package com.example.implementation.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Detailed breakdown of tiered discount calculation across multiple vouchers and member tiers.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CouponDiscountCalculationResultDto {

  private BigDecimal grossAmount;
  private BigDecimal voucherDiscountSum;
  private BigDecimal tierDiscountAmount;
  private BigDecimal netAmount;
  private List<String> appliedVouchers;
  private String memberTier;
}
