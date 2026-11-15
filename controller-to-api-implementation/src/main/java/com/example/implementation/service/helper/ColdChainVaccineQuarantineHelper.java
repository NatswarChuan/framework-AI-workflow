package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto;
import com.example.implementation.dto.ColdChainVaccineTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing Good Distribution Practice (GDP) cold-chain temperature regulations for vaccines.
 * Prevents spoiled, denatured, or compromised vaccines from reaching patients by imposing mandatory quarantine
 * lockouts on thermal excursion breaches (WHO GDP Annex 5 and EU Guidelines 2013/C 343/01).
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class ColdChainVaccineQuarantineHelper {

  private final ConcurrentMap<String, String> consignmentStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates incoming vaccine consignment telemetry, release requests, or QA clearance authorizations.
   *
   * @param request telemetry reading or release payload
   * @return evaluation result and consignment disposition state
   * @throws BaseBusinessException with HTTP 412 PRECONDITION_FAILED if consignment is quarantined during release attempt
   */
  public ColdChainVaccineTelemetryResultDto evaluateColdChainTelemetry(
      final ColdChainVaccineTelemetryRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_GDP_NULL_REQUEST,
          AdvancedBusinessConstant.STR_COLD_CHAIN_VACCINE_TELEMETRY_REQUEST
      );
    }

    final String consignmentId = request.getConsignmentId();
    if (Objects.isNull(consignmentId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_GDP_NULL_CONSIGNMENT_ID,
          AdvancedBusinessConstant.STR_CONSIGNMENT_IDENTIFIER_CANNOT_BE_NUL
      );
    }

    final String batchNumber = request.getBatchNumber();
    final String action = request.getAction();
    final String currentStatus = consignmentStatuses.getOrDefault(
        consignmentId,
        AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT
    );

    // Guard 1: Handle Qualified Person (QP) QA clearance token
    if (AdvancedBusinessConstant.ACTION_AUTHORIZE_QA_CLEARANCE.equalsIgnoreCase(action)) {
      return handleQaInspectionClearance(consignmentId, batchNumber, request.getQaInspectionToken());
    }

    // Guard 2: Handle consignment release for patient administration
    if (AdvancedBusinessConstant.ACTION_RELEASE_CONSIGNMENT.equalsIgnoreCase(action)) {
      return handleConsignmentRelease(consignmentId, batchNumber, currentStatus);
    }

    // Evaluation: Sensor telemetry reading
    return handleTemperatureLogging(
        consignmentId,
        batchNumber,
        request.getAmbientTemperatureCelsius(),
        request.getCumulativeExcursionMinutes()
    );
  }

  /**
   * Processes continuous temperature logger readings against GDP safe storage thresholds (2.0°C to 8.0°C).
   *
   * @param consignmentId unique consignment identifier
   * @param batchNumber pharmaceutical batch code
   * @param temperatureCelsius measured ambient temperature in Celsius
   * @param cumulativeExcursionMinutes aggregate minutes elapsed outside specification
   * @return evaluation result reflecting updated quarantine status
   */
  public ColdChainVaccineTelemetryResultDto handleTemperatureLogging(
      final String consignmentId,
      final String batchNumber,
      final Double temperatureCelsius,
      final Double cumulativeExcursionMinutes) {
    final double temp = Objects.isNull(temperatureCelsius) ? 4.0 : temperatureCelsius;
    final double excursionMins = Objects.isNull(cumulativeExcursionMinutes) ? 0.0 : cumulativeExcursionMinutes;

    // Check 1: Critical sub-zero freezing spike (immediate irreversible denaturing)
    if (temp <= AdvancedBusinessConstant.CRITICAL_FREEZING_THRESHOLD_CELSIUS) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_FREEZING_EXCURSION_ON_BATCH,
          batchNumber, temp, AdvancedBusinessConstant.CRITICAL_FREEZING_THRESHOLD_CELSIUS);
      consignmentStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED);
      return ColdChainVaccineTelemetryResultDto.builder()
          .consignmentId(consignmentId)
          .batchNumber(batchNumber)
          .temperatureReadingCelsius(temp)
          .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED)
          .quarantineLocked(Boolean.TRUE)
          .releasePermitted(Boolean.FALSE)
          .dispositionDecisionReason(AdvancedBusinessConstant.STR_CRITICAL_FREEZING_SPIKE_VACCINE_EMUL)
          .build();
    }

    // Check 2: Cumulative thermal excursion exceeding 30.0 minutes
    if (temp > AdvancedBusinessConstant.MAX_PERMISSIBLE_COLD_CHAIN_CELSIUS) {
      if (excursionMins > AdvancedBusinessConstant.MAX_PERMISSIBLE_EXCURSION_MINUTES) {
        log.warn(AdvancedBusinessConstant.STR_CUMULATIVE_HEAT_EXCURSION_ON_BATCH_C,
            batchNumber, temp, excursionMins, AdvancedBusinessConstant.MAX_PERMISSIBLE_EXCURSION_MINUTES);
        consignmentStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED);
        return ColdChainVaccineTelemetryResultDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .temperatureReadingCelsius(temp)
            .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED)
            .quarantineLocked(Boolean.TRUE)
            .releasePermitted(Boolean.FALSE)
            .dispositionDecisionReason(AdvancedBusinessConstant.STR_CUMULATIVE_HEAT_EXCURSION_EXCEEDED_3)
            .build();
      }
    }

    // Check 3: Check if already locked from a previous reading
    final String existingStatus = consignmentStatuses.getOrDefault(
        consignmentId,
        AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT
    );
    if (AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED.equalsIgnoreCase(existingStatus)) {
      return ColdChainVaccineTelemetryResultDto.builder()
          .consignmentId(consignmentId)
          .batchNumber(batchNumber)
          .temperatureReadingCelsius(temp)
          .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED)
          .quarantineLocked(Boolean.TRUE)
          .releasePermitted(Boolean.FALSE)
          .dispositionDecisionReason(AdvancedBusinessConstant.STR_CONSIGNMENT_REMAINS_QUARANTINED_FROM)
          .build();
    }

    // Normal safe cold chain status maintained
    consignmentStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT);
    return ColdChainVaccineTelemetryResultDto.builder()
        .consignmentId(consignmentId)
        .batchNumber(batchNumber)
        .temperatureReadingCelsius(temp)
        .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT)
        .quarantineLocked(Boolean.FALSE)
        .releasePermitted(Boolean.FALSE)
        .dispositionDecisionReason(AdvancedBusinessConstant.STR_COLD_CHAIN_TELEMETRY_WITHIN_COMPLIAN)
        .build();
  }

  /**
   * Validates pharmaceutical consignment release and halts dispatch if under GDP quarantine lockout.
   *
   * @param consignmentId unique consignment identifier
   * @param batchNumber pharmaceutical batch code
   * @param currentStatus current tracking status
   * @return release confirmation result
   * @throws BaseBusinessException with HTTP 412 PRECONDITION_FAILED if release is attempted on quarantined batch
   */
  public ColdChainVaccineTelemetryResultDto handleConsignmentRelease(
      final String consignmentId,
      final String batchNumber,
      final String currentStatus) {
    if (AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_CONSIGNMENT_RELEASE_REJECTED_FOR_QUA, batchNumber);
      throw new BaseBusinessException(
          HttpStatus.PRECONDITION_FAILED,
          AdvancedBusinessConstant.ERR_GDP_COLD_CHAIN_TEMPERATURE_EXCURSION,
          AdvancedBusinessConstant.MSG_GDP_COLD_CHAIN_TEMPERATURE_EXCURSION
      );
    }

    log.info(AdvancedBusinessConstant.STR_CONSIGNMENT_BATCH_APPROVED_FOR_CLINI, consignmentId, batchNumber);
    return ColdChainVaccineTelemetryResultDto.builder()
        .consignmentId(consignmentId)
        .batchNumber(batchNumber)
        .temperatureReadingCelsius(5.0)
        .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_RELEASED)
        .quarantineLocked(Boolean.FALSE)
        .releasePermitted(Boolean.TRUE)
        .dispositionDecisionReason(AdvancedBusinessConstant.STR_CONSIGNMENT_RELEASED_FOR_CLINICAL_AD)
        .build();
  }

  /**
   * Authorizes formal release of a quarantined consignment following Qualified Person (QP) review.
   *
   * @param consignmentId unique consignment identifier
   * @param batchNumber pharmaceutical batch code
   * @param token QP security authorization token
   * @return updated release result
   * @throws BaseBusinessException with HTTP 403 FORBIDDEN if token is invalid
   */
  public ColdChainVaccineTelemetryResultDto handleQaInspectionClearance(
      final String consignmentId,
      final String batchNumber,
      final String token) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_QP_QA_RELEASE.equals(token)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_QP_AUTHORIZATION_TOKEN_FOR_C, consignmentId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_GDP_INVALID_QP_TOKEN,
          AdvancedBusinessConstant.STR_INVALID_QUALIFIED_PERSON_QP_RELEASE
      );
    }

    consignmentStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_VACCINE_RELEASED);
    log.info(AdvancedBusinessConstant.STR_CONSIGNMENT_BATCH_CLEARED_BY_QUALIFI, consignmentId, batchNumber);
    return ColdChainVaccineTelemetryResultDto.builder()
        .consignmentId(consignmentId)
        .batchNumber(batchNumber)
        .temperatureReadingCelsius(4.5)
        .vaccineStatus(AdvancedBusinessConstant.STATUS_VACCINE_RELEASED)
        .quarantineLocked(Boolean.FALSE)
        .releasePermitted(Boolean.TRUE)
        .dispositionDecisionReason(AdvancedBusinessConstant.STR_CONSIGNMENT_FORMALLY_RELEASED_BY_AUT)
        .build();
  }

  /**
   * Retrieves the current tracking status for a consignment.
   *
   * @param consignmentId unique consignment identifier
   * @return tracking status string
   */
  public String getConsignmentStatus(final String consignmentId) {
    return consignmentStatuses.getOrDefault(
        consignmentId,
        AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT
    );
  }

  /**
   * Resets consignment status for testing purposes.
   *
   * @param consignmentId unique consignment identifier
   */
  public void resetConsignmentStatus(final String consignmentId) {
    consignmentStatuses.remove(consignmentId);
  }
}

