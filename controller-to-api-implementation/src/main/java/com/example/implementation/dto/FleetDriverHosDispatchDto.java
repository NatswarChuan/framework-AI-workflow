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
 * Data transfer object representing commercial fleet driver hours of service (HOS) or freight dispatch request.
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
public class FleetDriverHosDispatchDto implements Serializable {
@JsonProperty("driverId")
  private String driverId;

  @JsonProperty("cumulativeDrivingHours")
  private Double cumulativeDrivingHours;

  @JsonProperty("consecutiveRestHours")
  private Double consecutiveRestHours;

  @JsonProperty("action")
  private String action;

  @JsonProperty("freightLoadId")
  private String freightLoadId;
}

