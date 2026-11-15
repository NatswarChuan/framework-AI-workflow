package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating the immutable financial double-entry settlement result.
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
@Schema(description = "Settlement outcome of a double-entry ledger fund transfer")
public class DoubleEntryTransferResultDto {

  @Schema(description = "Unique transfer reference", example = "TXN-REF-20261107-001")
  private String transferReference;

  @Schema(description = "Settlement status (SETTLED or REJECTED)", example = "SETTLED")
  private String settlementStatus;

  @Schema(description = "Debited source account number", example = "ACC-100001")
  private String sourceAccountNumber;

  @Schema(description = "Credited destination account number", example = "ACC-200002")
  private String destinationAccountNumber;

  @Schema(description = "Gross debited amount", example = "250.00")
  private BigDecimal grossAmount;

  @Schema(description = "Platform fee collected", example = "5.00")
  private BigDecimal feeAmount;

  @Schema(description = "Net credited amount to destination (gross - fee)", example = "245.00")
  private BigDecimal netTransferredAmount;

  @Schema(description = "Remaining balance on source account", example = "750.00")
  private BigDecimal sourceRemainingBalance;

  @Schema(description = "Updated balance on destination account", example = "1245.00")
  private BigDecimal destinationNewBalance;

  @Schema(description = "Settlement timestamp in UTC ISO-8601", example = "2026-11-07T10:30:00Z")
  private String settledAt;
}
