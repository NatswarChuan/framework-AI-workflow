package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto;
import com.example.implementation.dto.SmartGridFrequencyTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing clean energy smart grid over-frequency inverter curtailment safety codes.
 * Conforms to European ENTSO-E and IEEE 1547 / NERC PRC-024 standards, automatically throttling or tripping
 * renewable solar/wind generation during grid frequency surges above 50.20 Hz / 50.50 Hz to prevent catastrophic grid blackout.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class SmartGridInverterCurtailmentHelper {

  private final ConcurrentMap<String, String> inverterStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates renewable power inverter grid frequency telemetry, export dispatches, or emergency overrides.
   *
   * @param request frequency telemetry or export dispatch payload
   * @return evaluation result and grid compliance state
   * @throws BaseBusinessException with HTTP 503 SERVICE_UNAVAILABLE if grid export is attempted while tripped
   */
  public SmartGridFrequencyTelemetryResultDto evaluateGridFrequencyTelemetry(
      final SmartGridFrequencyTelemetryRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_GRID_NULL_REQUEST,
          AdvancedBusinessConstant.STR_SMART_GRID_FREQUENCY_TELEMETRY_REQUE
      );
    }

    final String inverterId = request.getInverterId();
    if (Objects.isNull(inverterId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_GRID_NULL_INVERTER_ID,
          AdvancedBusinessConstant.STR_INVERTER_IDENTIFIER_CANNOT_BE_NULL
      );
    }

    final String action = request.getAction();
    final String currentStatus = inverterStatuses.getOrDefault(
        inverterId,
        AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE
    );

    // Guard 1: Handle Transmission System Operator (TSO) emergency override
    if (AdvancedBusinessConstant.ACTION_OVERRIDE_CURTAILMENT.equalsIgnoreCase(action)) {
      return handleGridOperatorOverride(inverterId, request.getOperatorOverrideToken(), request.getRequestedExportMegawatts());
    }

    // Guard 2: Handle renewable power export dispatch validation
    if (AdvancedBusinessConstant.ACTION_EXPORT_DISPATCH.equalsIgnoreCase(action)) {
      return handleExportDispatchValidation(inverterId, currentStatus, request.getRequestedExportMegawatts());
    }

    // Evaluation: Sensor frequency telemetry reading
    return handleFrequencyTelemetrySample(
        inverterId,
        request.getMeasuredFrequencyHertz(),
        request.getNominalCapacityMegawatts()
    );
  }

  /**
   * Processes continuous grid frequency telemetry samples against utility safety limits.
   *
   * @param inverterId unique inverter identifier
   * @param measuredFrequencyHertz grid frequency in Hertz
   * @param nominalCapacityMegawatts rated maximum generating capacity in MW
   * @return evaluation result reflecting updated curtailment state
   */
  public SmartGridFrequencyTelemetryResultDto handleFrequencyTelemetrySample(
      final String inverterId,
      final Double measuredFrequencyHertz,
      final Double nominalCapacityMegawatts) {
    final double freq = Objects.isNull(measuredFrequencyHertz)
        ? AdvancedBusinessConstant.NOMINAL_GRID_FREQUENCY_HERTZ
        : measuredFrequencyHertz;
    final double capacity = Objects.isNull(nominalCapacityMegawatts) ? 100.0 : nominalCapacityMegawatts;

    // Check 1: Critical over-frequency surge (>= 50.50 Hz) requiring immediate emergency inverter disconnection
    if (freq >= AdvancedBusinessConstant.CRITICAL_OVER_FREQUENCY_TRIP_HERTZ) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_OVER_FREQUENCY_SURGE_ON_INV,
          inverterId, freq, AdvancedBusinessConstant.CRITICAL_OVER_FREQUENCY_TRIP_HERTZ);
      inverterStatuses.put(inverterId, AdvancedBusinessConstant.STATUS_GRID_INVERTER_TRIPPED);
      return SmartGridFrequencyTelemetryResultDto.builder()
          .inverterId(inverterId)
          .measuredFrequencyHertz(freq)
          .inverterStatus(AdvancedBusinessConstant.STATUS_GRID_INVERTER_TRIPPED)
          .curtailmentActive(Boolean.TRUE)
          .permittedExportMegawatts(0.0)
          .gridExportPermitted(Boolean.FALSE)
          .curtailmentDecisionReason(AdvancedBusinessConstant.STR_CRITICAL_OVER_FREQUENCY_TRIP_GRID_FR)
          .build();
    }

    // Check 2: Over-frequency droop regulation threshold (>= 50.20 Hz)
    if (freq >= AdvancedBusinessConstant.OVER_FREQUENCY_DROOP_THRESHOLD_HERTZ) {
      final double curtailedPower = capacity * 0.40;
      log.warn(AdvancedBusinessConstant.STR_OVER_FREQUENCY_DROOP_ON_INVERTER_HZ,
          inverterId, freq, curtailedPower);
      inverterStatuses.put(inverterId, AdvancedBusinessConstant.STATUS_GRID_INVERTER_CURTAILED);
      return SmartGridFrequencyTelemetryResultDto.builder()
          .inverterId(inverterId)
          .measuredFrequencyHertz(freq)
          .inverterStatus(AdvancedBusinessConstant.STATUS_GRID_INVERTER_CURTAILED)
          .curtailmentActive(Boolean.TRUE)
          .permittedExportMegawatts(curtailedPower)
          .gridExportPermitted(Boolean.TRUE)
          .curtailmentDecisionReason(AdvancedBusinessConstant.STR_OVER_FREQUENCY_DROOP_ACTIVE_POWER_CU)
          .build();
    }

    // Check 3: Check if grid frequency returned to nominal deadband (49.95 Hz - 50.05 Hz)
    if (freq >= AdvancedBusinessConstant.GRID_FREQUENCY_DEADBAND_LOWER_HERTZ) {
      if (freq <= AdvancedBusinessConstant.GRID_FREQUENCY_DEADBAND_UPPER_HERTZ) {
        inverterStatuses.put(inverterId, AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE);
        return SmartGridFrequencyTelemetryResultDto.builder()
            .inverterId(inverterId)
            .measuredFrequencyHertz(freq)
            .inverterStatus(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE)
            .curtailmentActive(Boolean.FALSE)
            .permittedExportMegawatts(capacity)
            .gridExportPermitted(Boolean.TRUE)
            .curtailmentDecisionReason(AdvancedBusinessConstant.STR_GRID_FREQUENCY_STABLE_WITHIN_NOMINAL)
            .build();
      }
    }

    // Normal online operation
    inverterStatuses.put(inverterId, AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE);
    return SmartGridFrequencyTelemetryResultDto.builder()
        .inverterId(inverterId)
        .measuredFrequencyHertz(freq)
        .inverterStatus(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE)
        .curtailmentActive(Boolean.FALSE)
        .permittedExportMegawatts(capacity)
        .gridExportPermitted(Boolean.TRUE)
        .curtailmentDecisionReason(AdvancedBusinessConstant.STR_INVERTER_OPERATING_NORMALLY_UNDER_ST)
        .build();
  }

  /**
   * Validates renewable power export dispatch, blocking dispatch if inverter is under emergency trip.
   *
   * @param inverterId unique inverter identifier
   * @param currentStatus current operational status
   * @param requestedExportMegawatts desired export power in MW
   * @return dispatch confirmation result
   * @throws BaseBusinessException with HTTP 503 SERVICE_UNAVAILABLE if inverter is tripped
   */
  public SmartGridFrequencyTelemetryResultDto handleExportDispatchValidation(
      final String inverterId,
      final String currentStatus,
      final Double requestedExportMegawatts) {
    final double requested = Objects.isNull(requestedExportMegawatts) ? 50.0 : requestedExportMegawatts;

    if (AdvancedBusinessConstant.STATUS_GRID_INVERTER_TRIPPED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_POWER_EXPORT_DISPATCH_REJECTED_FOR_T, inverterId);
      throw new BaseBusinessException(
          HttpStatus.SERVICE_UNAVAILABLE,
          AdvancedBusinessConstant.ERR_GRID_OVER_FREQUENCY_CURTAILMENT,
          AdvancedBusinessConstant.MSG_GRID_OVER_FREQUENCY_CURTAILMENT
      );
    }

    log.info(AdvancedBusinessConstant.STR_POWER_EXPORT_OF_MW_APPROVED_FOR_INVE, requested, inverterId);
    return SmartGridFrequencyTelemetryResultDto.builder()
        .inverterId(inverterId)
        .measuredFrequencyHertz(50.00)
        .inverterStatus(currentStatus)
        .curtailmentActive(Boolean.FALSE)
        .permittedExportMegawatts(requested)
        .gridExportPermitted(Boolean.TRUE)
        .curtailmentDecisionReason(AdvancedBusinessConstant.STR_RENEWABLE_POWER_EXPORT_DISPATCHED_SU)
        .build();
  }

  /**
   * Clears curtailment lockout using Transmission System Operator (TSO) override credentials.
   *
   * @param inverterId unique inverter identifier
   * @param token TSO override token
   * @param requestedExportMegawatts export power requested in MW
   * @return clearance outcome
   * @throws BaseBusinessException with HTTP 403 FORBIDDEN if token is invalid
   */
  public SmartGridFrequencyTelemetryResultDto handleGridOperatorOverride(
      final String inverterId,
      final String token,
      final Double requestedExportMegawatts) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_GRID_DISPATCH_OVERRIDE.equals(token)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_TSO_GRID_DISPATCH_OVERRIDE_T, inverterId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_GRID_INVALID_OVERRIDE_TOKEN,
          AdvancedBusinessConstant.STR_INVALID_TRANSMISSION_SYSTEM_OPERATOR
      );
    }

    final double export = Objects.isNull(requestedExportMegawatts) ? 100.0 : requestedExportMegawatts;
    inverterStatuses.put(inverterId, AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE);
    log.info(AdvancedBusinessConstant.STR_INVERTER_CURTAILMENT_CLEARED_BY_AUTH, inverterId);
    return SmartGridFrequencyTelemetryResultDto.builder()
        .inverterId(inverterId)
        .measuredFrequencyHertz(50.00)
        .inverterStatus(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE)
        .curtailmentActive(Boolean.FALSE)
        .permittedExportMegawatts(export)
        .gridExportPermitted(Boolean.TRUE)
        .curtailmentDecisionReason(AdvancedBusinessConstant.STR_INVERTER_CURTAILMENT_CLEARED_UNDER_C)
        .build();
  }

  /**
   * Retrieves operational status of an inverter.
   *
   * @param inverterId unique inverter identifier
   * @return current status string
   */
  public String getInverterStatus(final String inverterId) {
    return inverterStatuses.getOrDefault(
        inverterId,
        AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE
    );
  }

  /**
   * Resets inverter status for testing purposes.
   *
   * @param inverterId unique inverter identifier
   */
  public void resetInverterStatus(final String inverterId) {
    inverterStatuses.remove(inverterId);
  }
}

