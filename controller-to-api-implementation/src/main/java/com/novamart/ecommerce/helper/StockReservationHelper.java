package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.StockReservationReceiptDto;
import com.novamart.ecommerce.entity.WarehouseStock;
import com.novamart.ecommerce.exception.InsufficientStockException;
import com.novamart.ecommerce.exception.InvalidReservationRequestException;
import com.novamart.ecommerce.exception.StockNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper encapsulating validation, lookup, and deduction logic for warehouse inventory reservation.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class StockReservationHelper {

  private final EntityManager entityManager;

  /**
   * Validates reservation SKU and quantity guard clauses before acquiring or mutating stock.
   *
   * @param sku warehouse stock SKU
   * @param quantity requested reservation units
   */
  public void validateReservationInput(final String sku, final Integer quantity) {
    if (Objects.isNull(sku)) {
      throw new InvalidReservationRequestException(NovaErrorConstant.MSG_SKU_REQUIRED);
    }
    if (sku.isBlank()) {
      throw new InvalidReservationRequestException(NovaErrorConstant.MSG_SKU_REQUIRED);
    }
    if (Objects.isNull(quantity)) {
      throw new InvalidReservationRequestException(NovaErrorConstant.MSG_QUANTITY_POSITIVE);
    }
    if (quantity <= NovaNumericConstant.INT_ZERO) {
      throw new InvalidReservationRequestException(NovaErrorConstant.MSG_QUANTITY_POSITIVE);
    }
  }

  /**
   * Queries an active WarehouseStock entity by SKU or throws StockNotFoundException.
   *
   * @param sku stock SKU code
   * @return active WarehouseStock record
   */
  public WarehouseStock loadStockOrThrow(final String sku) {
    final TypedQuery<WarehouseStock> query =
        entityManager.createQuery(NovaFieldConstant.JPQL_FIND_STOCK_BY_SKU, WarehouseStock.class);
    query.setParameter(NovaFieldConstant.PARAM_SKU, sku);
    final List<WarehouseStock> results = query.getResultList();
    if (results.isEmpty()) {
      throw new StockNotFoundException(sku);
    }
    return results.get(NovaNumericConstant.INT_ZERO);
  }

  /**
   * Verifies sufficient availability, deducts inventory atomically, and builds a receipt DTO.
   *
   * @param stock managed WarehouseStock entity
   * @param quantity requested reservation quantity
   * @return reservation confirmation receipt
   */
  public StockReservationReceiptDto deductAndBuildReceipt(
      final WarehouseStock stock, final Integer quantity) {
    log.info(NovaLogConstant.START_RESERVE_STOCK, stock.getSku(), quantity);
    final int currentAvailable = resolveQuantityOrZero(stock.getAvailableQuantity());
    if (currentAvailable < quantity) {
      throw new InsufficientStockException(stock.getSku(), quantity, currentAvailable);
    }
    final int currentReserved = resolveQuantityOrZero(stock.getReservedQuantity());
    final int updatedAvailable = currentAvailable - quantity;
    final int updatedReserved = currentReserved + quantity;
    final WarehouseStock updatedStock =
        stock.toBuilder()
            .availableQuantity(updatedAvailable)
            .reservedQuantity(updatedReserved)
            .build();
    final WarehouseStock merged = entityManager.merge(updatedStock);
    entityManager.flush();
    log.info(NovaLogConstant.FINISH_RESERVE_STOCK, merged.getSku(), merged.getAvailableQuantity());
    return StockReservationReceiptDto.fromStock(merged, quantity);
  }

  /**
   * Safely unboxes a nullable integer quantity to zero.
   *
   * @param value candidate integer quantity
   * @return unboxed value or zero when null
   */
  public int resolveQuantityOrZero(final Integer value) {
    if (Objects.isNull(value)) {
      return NovaNumericConstant.INT_ZERO;
    }
    return value;
  }
}
