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
 * Data transfer object representing SCADA water treatment or nuclear coolant effluent telemetry or discharge request.
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
public class ScadaEffluentTelemetryRequestDto implements Serializable {
@JsonProperty("facilityId")
  private String facilityId;

  @JsonProperty("sluiceGateId")
  private String sluiceGateId;

  @JsonProperty("measuredTurbidityNtu")
  private Double measuredTurbidityNtu;

  @JsonProperty("measuredRadioactivityBql")
  private Double measuredRadioactivityBql;

  @JsonProperty("dischargeVolumeGallons")
  private Double dischargeVolumeGallons;

  @JsonProperty("action")
  private String action;

  @JsonProperty("decontaminationCertToken")
  private String decontaminationCertToken;
}

