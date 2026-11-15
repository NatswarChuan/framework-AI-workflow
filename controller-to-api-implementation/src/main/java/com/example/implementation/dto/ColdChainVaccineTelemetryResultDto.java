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
 * Data transfer object representing the evaluation result of a pharmaceutical cold-chain vaccine consignment.
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
public class ColdChainVaccineTelemetryResultDto implements Serializable {
@JsonProperty("consignmentId")
  private String consignmentId;

  @JsonProperty("batchNumber")
  private String batchNumber;

  @JsonProperty("temperatureReadingCelsius")
  private Double temperatureReadingCelsius;

  @JsonProperty("vaccineStatus")
  private String vaccineStatus;

  @JsonProperty("quarantineLocked")
  private Boolean quarantineLocked;

  @JsonProperty("releasePermitted")
  private Boolean releasePermitted;

  @JsonProperty("dispositionDecisionReason")
  private String dispositionDecisionReason;
}

