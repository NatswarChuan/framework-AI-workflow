package com.example.implementation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request payload for calculating tiered multi-voucher discount settlement.
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
public class VoucherDiscountCalculationRequestDto {

  @NotNull(message = "Order gross amount is required")
  @DecimalMin(value = "0.01", message = "Order gross amount must be greater than zero")
  private BigDecimal grossAmount;

  @NotBlank(message = "User tier is required")
  private String userTier;

  private List<String> voucherCodes;
}
