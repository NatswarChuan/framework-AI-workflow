package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.IotMachineryTelemetryRequestDto;
import com.example.implementation.dto.IotMachineryTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing ISO 13849 machinery safety emergency shutdown (E-Stop).
 * Tripping is initiated automatically when telemetry vibrations or temperatures exceed
 * critical safety thresholds, locking out all subsequent work order dispatches until
 * authorized supervisor clearance is confirmed.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class IotMachineryEmergencyShutdownHelper {

  private final ConcurrentMap<String, String> machineStatuses = new ConcurrentHashMap<>();

  /**
   * Processes machinery sensor telemetry reports, evaluates safety thresholds,
   * and enforces emergency lockout against unauthorized work order dispatches.
   *
   * @param request telemetry report or work order dispatch request
   * @return evaluation result and machinery status
   * @throws BaseBusinessException with HTTP 423 LOCKED if machine is locked under E-Stop
   */
  public IotMachineryTelemetryResultDto processTelemetryOrDispatch(
      final IotMachineryTelemetryRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_IOT_NULL_REQUEST,
          AdvancedBusinessConstant.STR_MACHINERY_TELEMETRY_REQUEST_CANNOT_B
      );
    }

    final String machineId = request.getMachineId();
    if (Objects.isNull(machineId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_IOT_NULL_MACHINE_ID,
          AdvancedBusinessConstant.STR_MACHINE_IDENTIFIER_CANNOT_BE_NULL
      );
    }

    final String action = request.getAction();
    final String currentStatus = machineStatuses.getOrDefault(
        machineId,
        AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL
    );

    // Guard 1: Handle supervisor maintenance clearance action
    if (AdvancedBusinessConstant.ACTION_MAINTENANCE_CLEARANCE.equalsIgnoreCase(action)) {
      return handleMaintenanceClearance(machineId, request.getClearanceToken());
    }

    // Guard 2: Reject work order dispatch if machinery is emergency stopped
    if (AdvancedBusinessConstant.ACTION_DISPATCH_WORK_ORDER.equalsIgnoreCase(action)) {
      return handleWorkOrderDispatch(machineId, currentStatus, request.getWorkOrderId());
    }

    // Evaluation: Telemetry sensor report ingestion
    return handleTelemetryReport(machineId, currentStatus, request);
  }

  /**
   * Handles supervisor maintenance clearance to reset an emergency stopped machine.
   *
   * @param machineId machine identifier
   * @param clearanceToken supervisor security token
   * @return result indicating machine is reset to operational
   */
  public IotMachineryTelemetryResultDto handleMaintenanceClearance(
      final String machineId,
      final String clearanceToken) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_MAINTENANCE_CLEARANCE.equals(clearanceToken)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_MAINTENANCE_CLEARANCE_TOKEN, machineId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_IOT_INVALID_CLEARANCE_TOKEN,
          AdvancedBusinessConstant.STR_INVALID_OR_UNAUTHORIZED_SUPERVISOR_M
      );
    }

    machineStatuses.put(machineId, AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL);
    log.info(AdvancedBusinessConstant.STR_MACHINE_SUCCESSFULLY_RESET_TO_OPERAT, machineId);

    return IotMachineryTelemetryResultDto.builder()
        .machineId(machineId)
        .machineStatus(AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL)
        .eStopTripped(Boolean.FALSE)
        .workOrderAccepted(Boolean.FALSE)
        .tripReason(AdvancedBusinessConstant.STR_MAINTENANCE_CLEARED)
        .build();
  }

  /**
   * Handles work order dispatch validation under machinery safety state.
   *
   * @param machineId machine identifier
   * @param currentStatus current machine state
   * @param workOrderId work order identifier
   * @return result indicating work order acceptance
   */
  public IotMachineryTelemetryResultDto handleWorkOrderDispatch(
      final String machineId,
      final String currentStatus,
      final String workOrderId) {
    if (AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_WORK_ORDER_DISPATCH_REJECTED_FOR_MAC, machineId);
      throw new BaseBusinessException(
          HttpStatus.LOCKED,
          AdvancedBusinessConstant.ERR_IOT_EMERGENCY_SHUTDOWN_LOCKED,
          AdvancedBusinessConstant.MSG_IOT_EMERGENCY_SHUTDOWN_LOCKED
      );
    }

    log.info(AdvancedBusinessConstant.STR_WORK_ORDER_ACCEPTED_FOR_OPERATIONAL, workOrderId, machineId);
    return IotMachineryTelemetryResultDto.builder()
        .machineId(machineId)
        .machineStatus(currentStatus)
        .eStopTripped(Boolean.FALSE)
        .workOrderAccepted(Boolean.TRUE)
        .tripReason(AdvancedBusinessConstant.STR_NONE)
        .build();
  }

  /**
   * Ingests telemetry readings and trips emergency stop if vibrations or temperatures exceed limits.
   *
   * @param machineId machine identifier
   * @param currentStatus current machine state
   * @param request telemetry payload
   * @return evaluation result
   */
  public IotMachineryTelemetryResultDto handleTelemetryReport(
      final String machineId,
      final String currentStatus,
      final IotMachineryTelemetryRequestDto request) {
    final Double vibration = request.getVibrationMmPerSec();
    final Double temperature = request.getTemperatureCelsius();

    if (isVibrationAnomaly(vibration)) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_VIBRATION_ANOMALY_ON_MACHIN,
          machineId, vibration, AdvancedBusinessConstant.MAX_PERMISSIBLE_VIBRATION_VELOCITY);
      machineStatuses.put(machineId, AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);

      return IotMachineryTelemetryResultDto.builder()
          .machineId(machineId)
          .machineStatus(AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED)
          .eStopTripped(Boolean.TRUE)
          .workOrderAccepted(Boolean.FALSE)
          .tripReason(AdvancedBusinessConstant.STR_CRITICAL_VIBRATION_EXCEEDED)
          .build();
    }

    if (isTemperatureAnomaly(temperature)) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_TEMPERATURE_ANOMALY_ON_MACH,
          machineId, temperature, AdvancedBusinessConstant.MAX_PERMISSIBLE_TEMPERATURE_CELSIUS);
      machineStatuses.put(machineId, AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);

      return IotMachineryTelemetryResultDto.builder()
          .machineId(machineId)
          .machineStatus(AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED)
          .eStopTripped(Boolean.TRUE)
          .workOrderAccepted(Boolean.FALSE)
          .tripReason(AdvancedBusinessConstant.STR_CRITICAL_TEMPERATURE_EXCEEDED)
          .build();
    }

    return IotMachineryTelemetryResultDto.builder()
        .machineId(machineId)
        .machineStatus(currentStatus)
        .eStopTripped(Boolean.FALSE)
        .workOrderAccepted(Boolean.FALSE)
        .tripReason(AdvancedBusinessConstant.STR_NONE)
        .build();
  }

  /**
   * Checks if vibration reading exceeds permissible ISO velocity threshold.
   *
   * @param vibration vibration velocity in mm/s
   * @return true if anomaly detected
   */
  public boolean isVibrationAnomaly(final Double vibration) {
    if (Objects.isNull(vibration)) {
      return false;
    }
    return vibration > AdvancedBusinessConstant.MAX_PERMISSIBLE_VIBRATION_VELOCITY;
  }

  /**
   * Checks if temperature reading exceeds permissible Celsius ceiling.
   *
   * @param temperature temperature in Celsius
   * @return true if anomaly detected
   */
  public boolean isTemperatureAnomaly(final Double temperature) {
    if (Objects.isNull(temperature)) {
      return false;
    }
    return temperature > AdvancedBusinessConstant.MAX_PERMISSIBLE_TEMPERATURE_CELSIUS;
  }

  /**
   * Seeds machine status for test isolation.
   *
   * @param machineId machine identifier
   * @param status machine status
   */
  public void seedMachineStatus(final String machineId, final String status) {
    machineStatuses.put(machineId, status);
  }
}

