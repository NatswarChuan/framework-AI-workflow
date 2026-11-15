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
 * Data transfer object representing pharmaceutical vaccine cold-chain telemetry data logger reading or release request.
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
public class ColdChainVaccineTelemetryRequestDto implements Serializable {
@JsonProperty("consignmentId")
  private String consignmentId;

  @JsonProperty("batchNumber")
  private String batchNumber;

  @JsonProperty("ambientTemperatureCelsius")
  private Double ambientTemperatureCelsius;

  @JsonProperty("cumulativeExcursionMinutes")
  private Double cumulativeExcursionMinutes;

  @JsonProperty("action")
  private String action;

  @JsonProperty("qaInspectionToken")
  private String qaInspectionToken;
}

