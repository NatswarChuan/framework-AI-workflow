package com.example.implementation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object requesting the disbursement of commercial loan funds.
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
public class LoanDisbursementRequestDto {

  @NotNull(message = "Loan application ID is required")
  private UUID loanApplicationId;

  @NotBlank(message = "Disbursement account number is required")
  @Size(max = 64, message = "Disbursement account number must not exceed 64 characters")
  private String disbursementAccount;

  @NotNull(message = "Disbursement amount is required")
  @DecimalMin(value = "1.00", message = "Disbursement amount must be at least 1.00")
  private BigDecimal disbursementAmount;
}

