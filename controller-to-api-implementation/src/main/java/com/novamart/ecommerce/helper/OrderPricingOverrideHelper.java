package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.OrderPricingQuoteDto;
import com.novamart.ecommerce.entity.ShopOrder;
import com.novamart.ecommerce.exception.OrderPricingNotFoundException;
import io.github.natswarchuan.common.response.ApiResponse;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper invoked via @ServiceOverride on ShopOrderController to compute dynamic tiered quotes.
 */
@Slf4j
@Component(NovaFieldConstant.BEAN_ORDER_PRICING_OVERRIDE_HELPER)
@RequiredArgsConstructor
public final class OrderPricingOverrideHelper {

  private final EntityManager entityManager;

  /**
   * Calculates a dynamic tier-discounted pricing quote with tax for an existing ShopOrder.
   *
   * @param orderId shop order UUIDv7
   * @param tier pricing tier (STANDARD, VIP, MERCHANT)
   * @return ApiResponse containing OrderPricingQuoteDto
   */
  public ApiResponse<OrderPricingQuoteDto> calculatePricingQuote(
      final UUID orderId, final String tier) {
    log.info(NovaLogConstant.START_ORDER_PRICING_QUOTE, orderId, tier);
    if (Objects.isNull(orderId)) {
      throw new OrderPricingNotFoundException(null);
    }
    final ShopOrder order = entityManager.find(ShopOrder.class, orderId);
    validateOrderExists(order, orderId);
    final String normalizedTier = normalizeTier(tier);
    final OrderPricingQuoteDto quote = buildPricingQuote(order, normalizedTier);
    log.info(NovaLogConstant.FINISH_ORDER_PRICING_QUOTE, orderId, quote.getFinalPayableAmount());
    return ApiResponse.success(quote);
  }

  /**
   * Validates that a ShopOrder exists and is not soft-deleted.
   *
   * @param order loaded order entity
   * @param orderId requested order UUID
   */
  public void validateOrderExists(final ShopOrder order, final UUID orderId) {
    if (Objects.isNull(order)) {
      throw new OrderPricingNotFoundException(orderId);
    }
    if (Boolean.TRUE.equals(order.getDeleted())) {
      throw new OrderPricingNotFoundException(orderId);
    }
  }

  /**
   * Normalizes optional pricing tier input to uppercase or defaults to STANDARD.
   *
   * @param rawTier raw tier query value
   * @return normalized uppercase tier
   */
  public String normalizeTier(final String rawTier) {
    if (Objects.isNull(rawTier)) {
      return NovaFieldConstant.TIER_STANDARD;
    }
    if (rawTier.isBlank()) {
      return NovaFieldConstant.TIER_STANDARD;
    }
    return rawTier.trim().toUpperCase(Locale.ROOT);
  }

  /**
   * Resolves the loyalty discount rate for a normalized pricing tier.
   *
   * @param tier normalized tier code
   * @return BigDecimal discount percentage rate
   */
  public BigDecimal resolveDiscountRate(final String tier) {
    if (NovaFieldConstant.TIER_VIP.equals(tier)) {
      return NovaNumericConstant.DISCOUNT_RATE_VIP;
    }
    if (NovaFieldConstant.TIER_MERCHANT.equals(tier)) {
      return NovaNumericConstant.DISCOUNT_RATE_MERCHANT;
    }
    return NovaNumericConstant.DISCOUNT_RATE_STANDARD;
  }

  /**
   * Computes subtotal, loyalty discount, sales tax, and final payable amount using Builder pattern.
   *
   * @param order source ShopOrder entity
   * @param normalizedTier normalized pricing tier
   * @return completed OrderPricingQuoteDto
   */
  public OrderPricingQuoteDto buildPricingQuote(
      final ShopOrder order, final String normalizedTier) {
    final BigDecimal subtotal =
        order.getSubtotalAmount().setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
    final BigDecimal discountRate = resolveDiscountRate(normalizedTier);
    final BigDecimal loyaltyDiscount =
        subtotal
            .multiply(discountRate)
            .setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
    final BigDecimal taxableBase = subtotal.subtract(loyaltyDiscount);
    final BigDecimal estimatedTax =
        taxableBase
            .multiply(NovaNumericConstant.SALES_TAX_RATE)
            .setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
    final BigDecimal finalPayable =
        taxableBase
            .add(estimatedTax)
            .setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
    return OrderPricingQuoteDto.fromOrder(order, normalizedTier).toBuilder()
        .subtotalAmount(subtotal)
        .loyaltyDiscountAmount(loyaltyDiscount)
        .estimatedTaxAmount(estimatedTax)
        .finalPayableAmount(finalPayable)
        .build();
  }
}
