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
 * Data transfer object representing incoming industrial machinery telemetry or work order dispatch request.
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
public class IotMachineryTelemetryRequestDto implements Serializable {
@JsonProperty("machineId")
  private String machineId;

  @JsonProperty("vibrationMmPerSec")
  private Double vibrationMmPerSec;

  @JsonProperty("temperatureCelsius")
  private Double temperatureCelsius;

  @JsonProperty("action")
  private String action;

  @JsonProperty("workOrderId")
  private String workOrderId;

  @JsonProperty("clearanceToken")
  private String clearanceToken;
}

