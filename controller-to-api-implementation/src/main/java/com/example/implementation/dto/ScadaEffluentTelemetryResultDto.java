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
 * Data transfer object representing SCADA effluent containment and sluice gate isolation outcome.
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
public class ScadaEffluentTelemetryResultDto implements Serializable {
@JsonProperty("facilityId")
  private String facilityId;

  @JsonProperty("sluiceGateId")
  private String sluiceGateId;

  @JsonProperty("sluiceGateStatus")
  private String sluiceGateStatus;

  @JsonProperty("emergencyIsolated")
  private Boolean emergencyIsolated;

  @JsonProperty("dischargePermitted")
  private Boolean dischargePermitted;

  @JsonProperty("containmentDecisionReason")
  private String containmentDecisionReason;
}

