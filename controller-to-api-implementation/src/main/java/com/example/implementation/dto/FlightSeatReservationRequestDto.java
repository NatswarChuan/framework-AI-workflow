package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object for booking an airline flight seat with capacity limits.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Request payload for booking a flight seat")
public class FlightSeatReservationRequestDto {

  @NotBlank
  @Schema(description = "Flight number code", example = "VN-214")
  private String flightNumber;

  @NotBlank
  @Schema(description = "Passenger name or passport number", example = "John Doe")
  private String passengerId;

  @Schema(description = "Requested seat class", example = "ECONOMY")
  private String seatClass;
}

