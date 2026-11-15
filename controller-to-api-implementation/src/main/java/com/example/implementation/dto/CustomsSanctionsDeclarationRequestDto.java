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
 * Data transfer object representing international customs manifest cargo declaration or port release request.
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
public class CustomsSanctionsDeclarationRequestDto implements Serializable {
@JsonProperty("consignmentId")
  private String consignmentId;

  @JsonProperty("originCountryCode")
  private String originCountryCode;

  @JsonProperty("vesselImoNumber")
  private String vesselImoNumber;

  @JsonProperty("harmonizedTariffCode")
  private String harmonizedTariffCode;

  @JsonProperty("declaredMonetaryValueUsd")
  private Double declaredMonetaryValueUsd;

  @JsonProperty("action")
  private String action;

  @JsonProperty("specialLicenseToken")
  private String specialLicenseToken;
}

