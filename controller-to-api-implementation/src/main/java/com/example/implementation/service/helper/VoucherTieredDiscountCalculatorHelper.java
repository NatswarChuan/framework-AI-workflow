package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.CouponDiscountCalculationResultDto;
import com.example.implementation.dto.VoucherDiscountCalculationRequestDto;
import com.example.implementation.entity.CouponVoucher;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Helper executing tiered multi-voucher discount settlement and VIP tier multiplier pricing.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@RequiredArgsConstructor
public final class VoucherTieredDiscountCalculatorHelper {

  private final EntityManager entityManager;

  /**
   * Calculates tiered multi-voucher discounts and tier bonuses with zero-underflow guarantee.
   *
   * @param request discount calculation payload
   * @return {@link CouponDiscountCalculationResultDto} breakdown
   */
  public CouponDiscountCalculationResultDto calculateTieredDiscounts(
      final VoucherDiscountCalculationRequestDto request) {
    Objects.requireNonNull(request);

    final BigDecimal grossAmount = request.getGrossAmount();
    BigDecimal voucherDiscountSum = BigDecimal.ZERO;
    final List<String> appliedVouchers = new ArrayList<>();

    if (Objects.nonNull(request.getVoucherCodes())) {
      for (final String code : request.getVoucherCodes()) {
        final List<CouponVoucher> vouchers = entityManager.createQuery(
            AdvancedBusinessConstant.STR_SELECT_V_FROM_COUPON_VOUCHER_V_WHERE,
            CouponVoucher.class
        )
            .setParameter(AdvancedBusinessConstant.STR_CODE, code)
            .getResultList();

        if (vouchers.isEmpty()) {
          continue;
        }

        final CouponVoucher voucher = vouchers.get(0);
        if (grossAmount.compareTo(voucher.getMinOrderAmount()) >= 0) {
          voucherDiscountSum = voucherDiscountSum.add(voucher.getDiscountAmount());
          appliedVouchers.add(code);
        }
      }
    }

    final BigDecimal tierDiscountAmount = computeTierDiscount(grossAmount, request.getUserTier());
    final BigDecimal totalDiscount = voucherDiscountSum.add(tierDiscountAmount);

    BigDecimal netAmount = grossAmount.subtract(totalDiscount);
    if (netAmount.compareTo(BigDecimal.ZERO) < 0) {
      netAmount = BigDecimal.ZERO;
    }

    return CouponDiscountCalculationResultDto.builder()
        .grossAmount(grossAmount)
        .voucherDiscountSum(voucherDiscountSum)
        .tierDiscountAmount(tierDiscountAmount)
        .netAmount(netAmount)
        .appliedVouchers(appliedVouchers)
        .memberTier(request.getUserTier())
        .build();
  }

  /**
   * Computes tier-based extra discount based on user tier.
   *
   * @param grossAmount gross order amount
   * @param userTier user membership tier
   * @return tier discount amount
   */
  public BigDecimal computeTierDiscount(final BigDecimal grossAmount, final String userTier) {
    if (Objects.equals(userTier, AdvancedBusinessConstant.TIER_VIP)) {
      return grossAmount.multiply(BigDecimal.valueOf(AdvancedBusinessConstant.VIP_EXTRA_DISCOUNT_RATE))
          .setScale(2, RoundingMode.HALF_UP);
    }
    if (Objects.equals(userTier, AdvancedBusinessConstant.TIER_GOLD)) {
      return grossAmount.multiply(BigDecimal.valueOf(AdvancedBusinessConstant.GOLD_EXTRA_DISCOUNT_RATE))
          .setScale(2, RoundingMode.HALF_UP);
    }
    return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
  }
}
