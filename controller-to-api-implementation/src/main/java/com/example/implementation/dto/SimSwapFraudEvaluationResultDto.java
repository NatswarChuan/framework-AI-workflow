package com.example.implementation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

/**
 * Data transfer object representing the evaluation outcome of SIM-swap risk screening.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Jacksonized
@ToString
public class SimSwapFraudEvaluationResultDto implements Serializable {
@JsonProperty("accountId")
  private String accountId;

  @JsonProperty("accountStatus")
  private String accountStatus;

  @JsonProperty("transactionAllowed")
  private Boolean transactionAllowed;

  @JsonProperty("riskLevel")
  private String riskLevel;

  @JsonProperty("decisionReason")
  private String decisionReason;
}

