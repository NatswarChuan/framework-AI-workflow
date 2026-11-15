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
 * Data transfer object representing the result of an FMCSA HOS compliance check or freight dispatch attempt.
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
public class FleetDriverHosResultDto implements Serializable {
@JsonProperty("driverId")
  private String driverId;

  @JsonProperty("driverStatus")
  private String driverStatus;

  @JsonProperty("dispatchApproved")
  private Boolean dispatchApproved;

  @JsonProperty("complianceViolation")
  private Boolean complianceViolation;

  @JsonProperty("hosDecisionReason")
  private String hosDecisionReason;
}

