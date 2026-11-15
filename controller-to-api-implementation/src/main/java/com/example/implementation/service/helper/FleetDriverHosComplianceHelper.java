package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.FleetDriverHosDispatchDto;
import com.example.implementation.dto.FleetDriverHosResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing US FMCSA Hours of Service (HOS) 11-hour driving limit safety regulations.
 * Prevents commercial driver fatigue collisions and USD $10,000+ DOT fines by locking freight dispatch
 * when cumulative driving time reaches 11.0 hours without a certified 10-hour consecutive rest break.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class FleetDriverHosComplianceHelper {

  private final ConcurrentMap<String, String> driverStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates incoming freight dispatch assignments or ELD driving telemetry against FMCSA HOS rules.
   *
   * @param request dispatch or telematics payload
   * @return evaluation result and driver compliance state
   * @throws BaseBusinessException with HTTP 422 UNPROCESSABLE_ENTITY if driver has an HOS fatigue violation
   */
  public FleetDriverHosResultDto evaluateHosOrDispatch(
      final FleetDriverHosDispatchDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_FLEET_NULL_REQUEST,
          AdvancedBusinessConstant.STR_FLEET_HOS_DISPATCH_REQUEST_CANNOT_BE
      );
    }

    final String driverId = request.getDriverId();
    if (Objects.isNull(driverId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_FLEET_NULL_DRIVER_ID,
          AdvancedBusinessConstant.STR_DRIVER_IDENTIFIER_CANNOT_BE_NULL
      );
    }

    final String action = request.getAction();
    final String currentStatus = driverStatuses.getOrDefault(
        driverId,
        AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE
    );

    // Guard 1: Handle certified 10-hour consecutive rest break
    if (AdvancedBusinessConstant.ACTION_RECORD_REST_BREAK.equalsIgnoreCase(action)) {
      return handleRestBreakRecord(driverId, request.getConsecutiveRestHours());
    }

    // Guard 2: Handle freight load dispatch validation
    if (AdvancedBusinessConstant.ACTION_DISPATCH_FREIGHT.equalsIgnoreCase(action)) {
      return handleFreightDispatch(driverId, currentStatus, request.getFreightLoadId());
    }

    // Evaluation: Telematics ELD driving hours log
    return handleDrivingHoursLog(driverId, request.getCumulativeDrivingHours());
  }

  /**
   * Handles recording of consecutive rest hours to reset driver availability.
   *
   * @param driverId driver identifier
   * @param restHours consecutive rest hours logged
   * @return result indicating driver availability status
   */
  public FleetDriverHosResultDto handleRestBreakRecord(
      final String driverId,
      final Double restHours) {
    if (!isValidRestBreak(restHours)) {
      log.warn(AdvancedBusinessConstant.STR_INSUFFICIENT_REST_HOURS_10_0_LOGGED, restHours, driverId);
      return FleetDriverHosResultDto.builder()
          .driverId(driverId)
          .driverStatus(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED)
          .dispatchApproved(Boolean.FALSE)
          .complianceViolation(Boolean.TRUE)
          .hosDecisionReason(AdvancedBusinessConstant.STR_INSUFFICIENT_CONSECUTIVE_REST_HOURS)
          .build();
    }

    driverStatuses.put(driverId, AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);
    log.info(AdvancedBusinessConstant.STR_DRIVER_COMPLETED_CERTIFIED_10_HOUR_R, driverId);

    return FleetDriverHosResultDto.builder()
        .driverId(driverId)
        .driverStatus(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE)
        .dispatchApproved(Boolean.TRUE)
        .complianceViolation(Boolean.FALSE)
        .hosDecisionReason(AdvancedBusinessConstant.STR_MANDATORY_REST_PERIOD_SATISFIED)
        .build();
  }

  /**
   * Validates freight load dispatch against driver fatigue state.
   *
   * @param driverId driver identifier
   * @param currentStatus driver status
   * @param freightLoadId freight load identifier
   * @return result indicating dispatch approval
   */
  public FleetDriverHosResultDto handleFreightDispatch(
      final String driverId,
      final String currentStatus,
      final String freightLoadId) {
    if (AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_FREIGHT_DISPATCH_REJECTED_FOR_DRIVER, freightLoadId, driverId);
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_FLEET_HOS_REGULATORY_VIOLATION,
          AdvancedBusinessConstant.MSG_FLEET_HOS_REGULATORY_VIOLATION
      );
    }

    log.info(AdvancedBusinessConstant.STR_FREIGHT_LOAD_DISPATCHED_SUCCESSFULLY, freightLoadId, driverId);
    return FleetDriverHosResultDto.builder()
        .driverId(driverId)
        .driverStatus(currentStatus)
        .dispatchApproved(Boolean.TRUE)
        .complianceViolation(Boolean.FALSE)
        .hosDecisionReason(AdvancedBusinessConstant.STR_DRIVER_AVAILABLE_DISPATCH_AUTHORIZED)
        .build();
  }

  /**
   * Ingests ELD driving hours and flags fatigue lockout if limit reached.
   *
   * @param driverId driver identifier
   * @param drivingHours cumulative driving hours
   * @return result indicating updated compliance status
   */
  public FleetDriverHosResultDto handleDrivingHoursLog(
      final String driverId,
      final Double drivingHours) {
    if (isHosViolation(drivingHours)) {
      log.warn(AdvancedBusinessConstant.STR_DRIVER_REACHED_FMCSA_11_HOUR_LIMIT_H, driverId, drivingHours);
      driverStatuses.put(driverId, AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);

      return FleetDriverHosResultDto.builder()
          .driverId(driverId)
          .driverStatus(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED)
          .dispatchApproved(Boolean.FALSE)
          .complianceViolation(Boolean.TRUE)
          .hosDecisionReason(AdvancedBusinessConstant.STR_FMCSA_11_HOUR_DRIVING_LIMIT_EXCEEDED)
          .build();
    }

    driverStatuses.put(driverId, AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);
    return FleetDriverHosResultDto.builder()
        .driverId(driverId)
        .driverStatus(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE)
        .dispatchApproved(Boolean.TRUE)
        .complianceViolation(Boolean.FALSE)
        .hosDecisionReason(AdvancedBusinessConstant.STR_DRIVING_HOURS_WITHIN_LEGAL_LIMIT)
        .build();
  }

  /**
   * Checks if cumulative driving hours meet or exceed the FMCSA 11.0 hour limit.
   *
   * @param hours cumulative driving hours
   * @return true if >= 11.0
   */
  public boolean isHosViolation(final Double hours) {
    if (Objects.isNull(hours)) {
      return false;
    }
    return hours >= AdvancedBusinessConstant.MAX_PERMISSIBLE_DRIVING_HOURS;
  }

  /**
   * Checks if consecutive rest hours satisfy the mandatory 10.0 hour rest requirement.
   *
   * @param hours consecutive rest hours
   * @return true if >= 10.0
   */
  public boolean isValidRestBreak(final Double hours) {
    if (Objects.isNull(hours)) {
      return false;
    }
    return hours >= AdvancedBusinessConstant.MANDATORY_CONSECUTIVE_REST_HOURS;
  }

  /**
   * Seeds driver status for test isolation.
   *
   * @param driverId driver identifier
   * @param status driver status
   */
  public void seedDriverStatus(final String driverId, final String status) {
    driverStatuses.put(driverId, status);
  }
}

