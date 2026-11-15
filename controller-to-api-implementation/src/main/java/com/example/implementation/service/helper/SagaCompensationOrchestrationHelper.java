package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.OrderPaymentSagaRequestDto;
import com.example.implementation.dto.SagaExecutionResultDto;
import com.example.implementation.entity.ECommerceOrder;
import com.example.implementation.entity.InventoryStock;
import com.example.implementation.entity.PaymentTransaction;
import io.github.natswarchuan.common.constant.ErrorConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.event.EntityCreatedEvent;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Orchestrator helper executing multi-phase distributed Saga and automated stock compensation.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class SagaCompensationOrchestrationHelper {

  private final EntityManager entityManager;
  private final ApplicationEventPublisher eventPublisher;

  /**
   * Executes distributed Saga with automated compensation rollback upon failure.
   *
   * @param request saga request payload
   * @return {@link SagaExecutionResultDto} terminal execution status
   */
  public SagaExecutionResultDto orchestrateSaga(final OrderPaymentSagaRequestDto request) {
    Objects.requireNonNull(request);

    final InventoryStock stock = acquireStockWithPessimisticLock(request.getStockSkuCode());
    final int qty = request.getReservationQuantity();

    if (stock.getAvailableQuantity() < qty) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_PRODUCT_OUT_OF_STOCK,
          AdvancedBusinessConstant.MSG_PRODUCT_OUT_OF_STOCK
      );
    }

    // Phase 1: Stock reservation
    stock.setAvailableQuantity(stock.getAvailableQuantity() - qty);
    stock.setReservedQuantity(stock.getReservedQuantity() + qty);
    entityManager.merge(stock);
    entityManager.flush();

    final ECommerceOrder order = entityManager.find(ECommerceOrder.class, request.getOrderId());
    if (Objects.isNull(order)) {
      throw new BaseBusinessException(
          HttpStatus.NOT_FOUND,
          AdvancedBusinessConstant.ERR_ORDER_NOT_FOUND,
          AdvancedBusinessConstant.MSG_ORDER_NOT_FOUND
      );
    }

    // Phase 2: Gateway Execution & Conditional Compensation
    if (request.isSimulatePaymentFailure()) {
      return executeCompensationRollback(stock, order, request);
    }

    return executeCommitSuccess(stock, order, request);
  }

  /**
   * Executes compensation rollback restoring reserved inventory stock and recording failed payment.
   *
   * @param stock target inventory stock
   * @param order target ecommerce order
   * @param request original saga request
   * @return {@link SagaExecutionResultDto} compensated status
   */
  public SagaExecutionResultDto executeCompensationRollback(
      final InventoryStock stock,
      final ECommerceOrder order,
      final OrderPaymentSagaRequestDto request) {
    final int qty = request.getReservationQuantity();
    stock.setAvailableQuantity(stock.getAvailableQuantity() + qty);
    stock.setReservedQuantity(stock.getReservedQuantity() - qty);
    entityManager.merge(stock);

    order.setOrderStatus(AdvancedBusinessConstant.STATUS_PAYMENT_FAILED);
    entityManager.merge(order);

    final PaymentTransaction failedTxn = PaymentTransaction.builder()
        .transactionReference(AdvancedBusinessConstant.STR_TXN_FAIL + UuidUtil.generateUuidV7().toString().substring(0, 8))
        .orderCode(order.getOrderCode())
        .paymentMethod(request.getPaymentMethod())
        .amount(request.getPaymentAmount())
        .currency(AdvancedBusinessConstant.CURRENCY_USD)
        .status(AdvancedBusinessConstant.STATUS_PAYMENT_FAILED)
        .gatewayProvider(AdvancedBusinessConstant.GATEWAY_STRIPE)
        .gatewayResponseCode(AdvancedBusinessConstant.RESP_CARD_DECLINED)
        .build();
    entityManager.persist(failedTxn);
    entityManager.flush();

    return SagaExecutionResultDto.builder()
        .orderId(order.getId())
        .sagaStatus(AdvancedBusinessConstant.SAGA_STATUS_COMPENSATED)
        .orderStatus(AdvancedBusinessConstant.STATUS_PAYMENT_FAILED)
        .remainingStockQuantity(stock.getAvailableQuantity())
        .message(AdvancedBusinessConstant.MSG_SAGA_COMPENSATED)
        .compensationDetails(AdvancedBusinessConstant.STR_RESTORED + qty + AdvancedBusinessConstant.STR_UNITS_TO_WAREHOUSE_STOCK)
        .build();
  }

  /**
   * Executes commit phase confirming order, finalizing stock, and publishing outbox event.
   *
   * @param stock target inventory stock
   * @param order target ecommerce order
   * @param request original saga request
   * @return {@link SagaExecutionResultDto} committed status
   */
  public SagaExecutionResultDto executeCommitSuccess(
      final InventoryStock stock,
      final ECommerceOrder order,
      final OrderPaymentSagaRequestDto request) {
    final int qty = request.getReservationQuantity();
    stock.setReservedQuantity(stock.getReservedQuantity() - qty);
    entityManager.merge(stock);

    order.setOrderStatus(AdvancedBusinessConstant.STATUS_PAID);
    entityManager.merge(order);

    final PaymentTransaction successTxn = PaymentTransaction.builder()
        .transactionReference(AdvancedBusinessConstant.STR_TXN_SUCC + UuidUtil.generateUuidV7().toString().substring(0, 8))
        .orderCode(order.getOrderCode())
        .paymentMethod(request.getPaymentMethod())
        .amount(request.getPaymentAmount())
        .currency(AdvancedBusinessConstant.CURRENCY_USD)
        .status(AdvancedBusinessConstant.STATUS_PAYMENT_SUCCESS)
        .gatewayProvider(AdvancedBusinessConstant.GATEWAY_STRIPE)
        .gatewayResponseCode(AdvancedBusinessConstant.RESP_APPROVED)
        .build();
    entityManager.persist(successTxn);
    entityManager.flush();

    eventPublisher.publishEvent(new EntityCreatedEvent<>(order, ECommerceOrder.class, UuidUtil.generateUuidV7().toString()));

    return SagaExecutionResultDto.builder()
        .orderId(order.getId())
        .sagaStatus(AdvancedBusinessConstant.SAGA_STATUS_COMMITTED)
        .orderStatus(AdvancedBusinessConstant.STATUS_PAID)
        .remainingStockQuantity(stock.getAvailableQuantity())
        .message(AdvancedBusinessConstant.MSG_SAGA_COMMITTED)
        .compensationDetails(AdvancedBusinessConstant.STR_ZERO_COMPENSATION_NEEDED_ALL_PHASES)
        .build();
  }

  /**
   * Acquires inventory stock entity with pessimistic write locking.
   *
   * @param stockSkuCode unique stock SKU code
   * @return locked {@link InventoryStock}
   */
  public InventoryStock acquireStockWithPessimisticLock(final String stockSkuCode) {
    final List<InventoryStock> stocks = entityManager.createQuery(
        AdvancedBusinessConstant.STR_SELECT_S_FROM_INVENTORY_STOCK_S_WHER_2,
        InventoryStock.class
    )
        .setParameter(AdvancedBusinessConstant.STR_SKU, stockSkuCode)
        .setLockMode(LockModeType.PESSIMISTIC_WRITE)
        .getResultList();

    if (stocks.isEmpty()) {
      throw new BaseBusinessException(
          HttpStatus.NOT_FOUND,
          ErrorConstant.ERR_RESOURCE_NOT_FOUND,
          ErrorConstant.MSG_RESOURCE_NOT_FOUND
      );
    }
    return stocks.get(0);
  }

  /**
   * Publishes an entity created event for the specified order.
   *
   * @param order the newly created order
   */
  public void publishOrderCreatedEvent(final ECommerceOrder order) {
    eventPublisher.publishEvent(new EntityCreatedEvent<>(order, ECommerceOrder.class, UuidUtil.generateUuidV7().toString()));
  }
}
