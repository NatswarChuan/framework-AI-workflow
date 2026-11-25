package com.novamart.ecommerce.dto;

import com.novamart.ecommerce.entity.ShopOrder;
import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Custom pricing quote DTO generated via @ServiceOverride escape-hatch delegation on ShopOrder.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class OrderPricingQuoteDto {

  private UUID orderId;
  private String orderNumber;
  private String appliedTier;
  private BigDecimal subtotalAmount;
  private BigDecimal loyaltyDiscountAmount;
  private BigDecimal estimatedTaxAmount;
  private BigDecimal finalPayableAmount;

  /**
   * Builds a base pricing quote DTO shell from a ShopOrder entity.
   *
   * @param order source shop order entity
   * @param tier customer pricing tier label
   * @return base OrderPricingQuoteDto, or null if order is null
   */
  public static OrderPricingQuoteDto fromOrder(final ShopOrder order, final String tier) {
    if (Objects.isNull(order)) {
      return null;
    }
    return OrderPricingQuoteDto.builder()
        .orderId(order.getId())
        .orderNumber(order.getOrderNumber())
        .appliedTier(tier)
        .subtotalAmount(order.getSubtotalAmount())
        .build();
  }
}
