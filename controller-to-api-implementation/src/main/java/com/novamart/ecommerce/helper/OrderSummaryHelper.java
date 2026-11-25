package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.OrderCheckoutSummaryDto;
import com.novamart.ecommerce.entity.ShopOrder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper aggregating active ShopOrder metrics across all state machine lifecycle states.
 */
@Slf4j
@Component(NovaFieldConstant.BEAN_ORDER_SUMMARY_HELPER)
@RequiredArgsConstructor
public final class OrderSummaryHelper {

  private final EntityManager entityManager;

  /**
   * Aggregates order counts per lifecycle state and total gross order volume.
   *
   * @return populated OrderCheckoutSummaryDto
   */
  public OrderCheckoutSummaryDto buildCheckoutSummary() {
    log.info(NovaLogConstant.START_ORDER_SUMMARY);
    final TypedQuery<ShopOrder> query =
        entityManager.createQuery(NovaFieldConstant.JPQL_FIND_ACTIVE_ORDERS, ShopOrder.class);
    final List<ShopOrder> orders = query.getResultList();
    final OrderCheckoutSummaryDto summary = buildSummaryFromOrders(orders);
    log.info(NovaLogConstant.FINISH_ORDER_SUMMARY, summary.getTotalOrders());
    return summary;
  }

  /**
   * Computes lifecycle breakdown DTO from a list of ShopOrder entities.
   *
   * @param orders active orders list
   * @return aggregated OrderCheckoutSummaryDto
   */
  public OrderCheckoutSummaryDto buildSummaryFromOrders(final List<ShopOrder> orders) {
    if (Objects.isNull(orders)) {
      return buildEmptySummary();
    }
    return OrderCheckoutSummaryDto.builder()
        .totalOrders(orders.size())
        .draftCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_DRAFT))
        .pendingPaymentCount(
            countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_PENDING_PAYMENT))
        .paidCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_PAID))
        .shippedCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_SHIPPED))
        .deliveredCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_DELIVERED))
        .cancelledCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_CANCELLED))
        .refundedCount(countOrdersInState(orders, NovaFieldConstant.ORDER_STATE_REFUNDED))
        .grossOrderVolume(sumGrossVolume(orders))
        .build();
  }

  /**
   * Counts orders matching a specific state code.
   *
   * @param orders source order list
   * @param expectedState state machine status code
   * @return matching count
   */
  public long countOrdersInState(final List<ShopOrder> orders, final String expectedState) {
    long matched = NovaNumericConstant.LONG_ZERO;
    for (final ShopOrder order : orders) {
      if (matchesState(order, expectedState)) {
        matched = matched + NovaNumericConstant.INT_ONE;
      }
    }
    return matched;
  }

  /**
   * Checks whether a single order carries the expected state code safely.
   *
   * @param order candidate order
   * @param expectedState expected status string
   * @return true when order and status match
   */
  public boolean matchesState(final ShopOrder order, final String expectedState) {
    if (Objects.isNull(order)) {
      return false;
    }
    return Objects.equals(order.getOrderStatus(), expectedState);
  }

  /**
   * Sums totalAmount across all orders safely using BigDecimal scale 2.
   *
   * @param orders source order list
   * @return gross order volume
   */
  public BigDecimal sumGrossVolume(final List<ShopOrder> orders) {
    BigDecimal total = BigDecimal.ZERO;
    for (final ShopOrder order : orders) {
      total = total.add(extractOrderTotalOrZero(order));
    }
    return total.setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
  }

  /**
   * Extracts a non-null order total or returns BigDecimal.ZERO.
   *
   * @param order candidate order
   * @return order total amount or zero
   */
  public BigDecimal extractOrderTotalOrZero(final ShopOrder order) {
    if (Objects.isNull(order)) {
      return BigDecimal.ZERO;
    }
    if (Objects.isNull(order.getTotalAmount())) {
      return BigDecimal.ZERO;
    }
    return order.getTotalAmount();
  }

  /**
   * Returns a zeroed OrderCheckoutSummaryDto when no orders exist.
   *
   * @return empty OrderCheckoutSummaryDto
   */
  public OrderCheckoutSummaryDto buildEmptySummary() {
    return OrderCheckoutSummaryDto.builder()
        .totalOrders(NovaNumericConstant.LONG_ZERO)
        .draftCount(NovaNumericConstant.LONG_ZERO)
        .pendingPaymentCount(NovaNumericConstant.LONG_ZERO)
        .paidCount(NovaNumericConstant.LONG_ZERO)
        .shippedCount(NovaNumericConstant.LONG_ZERO)
        .deliveredCount(NovaNumericConstant.LONG_ZERO)
        .cancelledCount(NovaNumericConstant.LONG_ZERO)
        .refundedCount(NovaNumericConstant.LONG_ZERO)
        .grossOrderVolume(
            BigDecimal.ZERO.setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP))
        .build();
  }
}
