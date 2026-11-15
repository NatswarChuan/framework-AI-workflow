package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object requesting a financial double-entry ledger fund transfer between accounts.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for financial double-entry ledger fund transfer")
public class DoubleEntryTransferRequestDto {

  @NotBlank(message = "Source account number is required")
  @Schema(description = "Source account number to debit", example = "ACC-100001")
  private String sourceAccountNumber;

  @NotBlank(message = "Destination account number is required")
  @Schema(description = "Destination account number to credit", example = "ACC-200002")
  private String destinationAccountNumber;

  @Schema(description = "Platform fee account number", example = "ACC-PLATFORM-FEE")
  private String platformFeeAccountNumber;

  @NotNull(message = "Transfer amount is required")
  @DecimalMin(value = "0.01", message = "Transfer amount must be at least 0.01")
  @Schema(description = "Gross amount to debit from source account", example = "250.00")
  private BigDecimal amount;

  @Schema(description = "Platform processing fee deducted from transferred amount", example = "5.00")
  private BigDecimal feeAmount;

  @NotBlank(message = "Transfer reference is required")
  @Schema(description = "Unique idempotency transfer reference code", example = "TXN-REF-20261107-001")
  private String transferReference;
}
