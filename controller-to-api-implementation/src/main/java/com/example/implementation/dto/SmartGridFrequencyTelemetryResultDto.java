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
 * Data transfer object representing the result of smart grid inverter over-frequency curtailment evaluation.
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
public class SmartGridFrequencyTelemetryResultDto implements Serializable {
@JsonProperty("inverterId")
  private String inverterId;

  @JsonProperty("measuredFrequencyHertz")
  private Double measuredFrequencyHertz;

  @JsonProperty("inverterStatus")
  private String inverterStatus;

  @JsonProperty("curtailmentActive")
  private Boolean curtailmentActive;

  @JsonProperty("permittedExportMegawatts")
  private Double permittedExportMegawatts;

  @JsonProperty("gridExportPermitted")
  private Boolean gridExportPermitted;

  @JsonProperty("curtailmentDecisionReason")
  private String curtailmentDecisionReason;
}

