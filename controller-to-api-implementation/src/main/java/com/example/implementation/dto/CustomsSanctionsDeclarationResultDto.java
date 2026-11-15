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
 * Data transfer object representing the compliance outcome of customs cargo sanctions screening.
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
public class CustomsSanctionsDeclarationResultDto implements Serializable {
@JsonProperty("consignmentId")
  private String consignmentId;

  @JsonProperty("cargoStatus")
  private String cargoStatus;

  @JsonProperty("sanctionsEmbargoed")
  private Boolean sanctionsEmbargoed;

  @JsonProperty("portReleasePermitted")
  private Boolean portReleasePermitted;

  @JsonProperty("screeningDecisionReason")
  private String screeningDecisionReason;
}

