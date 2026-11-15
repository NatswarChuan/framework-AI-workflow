package com.example.implementation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating flight seat reservation result.
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
@Schema(description = "Result payload of flight seat reservation")
public class FlightSeatReservationResultDto {

  @Schema(description = "Reservation ticket UUID")
  private UUID reservationId;

  @Schema(description = "Flight number code", example = "VN-214")
  private String flightNumber;

  @Schema(description = "Passenger name or passport number", example = "John Doe")
  private String passengerId;

  @Schema(description = "Current seat number assigned or STANDBY", example = "14B")
  private String assignedSeat;

  @Schema(description = "Reservation status: CONFIRMED or STANDBY_OVERBOOKED", example = "CONFIRMED")
  private String status;

  @Schema(description = "Total seats booked on flight after this transaction", example = "102")
  private int currentTotalBooked;
}

