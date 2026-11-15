package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.FlightSeatReservationRequestDto;
import com.example.implementation.dto.FlightSeatReservationResultDto;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper class managing airline flight capacity gates and overbooking tolerance windows.
 * Eliminates race conditions when passengers contest remaining overbooking limits.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class AviationOverbookingCapacityHelper {

  private final ConcurrentMap<String, AtomicInteger> flightBookingCounts = new ConcurrentHashMap<>();

  /**
   * Reserves a flight seat, enforcing maximum capacity and overbooking tolerance window.
   *
   * @param request reservation request payload
   * @return reservation result receipt
   * @throws BaseBusinessException with HTTP 409 Conflict if overbooking limit is fully exhausted
   */
  public FlightSeatReservationResultDto reserveSeat(final FlightSeatReservationRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_FLIGHT_NULL_REQUEST,
          AdvancedBusinessConstant.MSG_FLIGHT_NULL_REQUEST
      );
    }

    String flightNumber = request.getFlightNumber();
    if (Objects.isNull(flightNumber)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_FLIGHT_NULL_NUMBER,
          AdvancedBusinessConstant.MSG_FLIGHT_NULL_NUMBER
      );
    }

    AtomicInteger counter = flightBookingCounts.computeIfAbsent(flightNumber, k -> new AtomicInteger(0));

    // Atomically increment and check capacity
    int currentCount = counter.incrementAndGet();
    if (currentCount > AdvancedBusinessConstant.FLIGHT_MAX_OVERBOOKING_LIMIT) {
      counter.decrementAndGet();
      log.warn(AdvancedBusinessConstant.STR_FLIGHT_OVERBOOKING_LIMIT_EXCEEDED_CU, flightNumber, currentCount);
      throw new BaseBusinessException(
          HttpStatus.CONFLICT,
          AdvancedBusinessConstant.ERR_FLIGHT_OVERBOOKED_EXHAUSTED,
          AdvancedBusinessConstant.MSG_FLIGHT_OVERBOOKED_EXHAUSTED
      );
    }

    UUID reservationId = UuidUtil.generateUuidV7();
    String status = AdvancedBusinessConstant.STATUS_RESERVATION_CONFIRMED;
    String assignedSeat = String.valueOf(currentCount).concat(AdvancedBusinessConstant.SEAT_SUFFIX_B);

    if (currentCount > AdvancedBusinessConstant.FLIGHT_BASE_CAPACITY) {
      status = AdvancedBusinessConstant.STATUS_RESERVATION_STANDBY;
      assignedSeat = AdvancedBusinessConstant.SEAT_STANDBY;
    }

    log.info(AdvancedBusinessConstant.STR_RESERVED_SEAT_ON_FLIGHT_FOR_PASSENGE,
        flightNumber, request.getPassengerId(), status, currentCount);

    return FlightSeatReservationResultDto.builder()
        .reservationId(reservationId)
        .flightNumber(flightNumber)
        .passengerId(request.getPassengerId())
        .assignedSeat(assignedSeat)
        .status(status)
        .currentTotalBooked(currentCount)
        .build();
  }

  /**
   * Resets flight count for testing.
   *
   * @param flightNumber flight number code
   * @param initialCount initial count to set
   */
  public void seedFlightCount(final String flightNumber, final int initialCount) {
    flightBookingCounts.put(flightNumber, new AtomicInteger(initialCount));
  }
}

