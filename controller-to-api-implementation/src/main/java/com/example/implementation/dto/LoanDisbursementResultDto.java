package com.example.implementation.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating the result of a loan disbursement operation.
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
public class LoanDisbursementResultDto {

  private UUID loanApplicationId;
  private String loanReferenceCode;
  private String disbursementReference;
  private BigDecimal disbursedAmount;
  private String disbursementStatus;
}

