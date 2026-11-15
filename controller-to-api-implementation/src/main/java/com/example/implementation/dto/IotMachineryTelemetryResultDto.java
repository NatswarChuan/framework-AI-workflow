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
 * Data transfer object representing the result of an industrial machinery telemetry evaluation
 * or work order dispatch attempt under safety shutdown constraints.
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
public class IotMachineryTelemetryResultDto implements Serializable {
@JsonProperty("machineId")
  private String machineId;

  @JsonProperty("machineStatus")
  private String machineStatus;

  @JsonProperty("eStopTripped")
  private Boolean eStopTripped;

  @JsonProperty("workOrderAccepted")
  private Boolean workOrderAccepted;

  @JsonProperty("tripReason")
  private String tripReason;
}

