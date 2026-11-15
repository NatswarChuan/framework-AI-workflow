package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ScadaEffluentTelemetryRequestDto;
import com.example.implementation.dto.ScadaEffluentTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing US EPA Safe Drinking Water Act and IAEA nuclear coolant SCADA effluent safety limits.
 * Monitors wastewater discharge turbidity and radioactivity in real time, automatically tripping sluice gates
 * into emergency physical isolation (HTTP 423) upon chemical or radiological contamination surges.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class ScadaEffluentContaminationIsolationHelper {

  private final ConcurrentMap<String, String> sluiceGateStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates incoming SCADA effluent sensor telemetry, municipal discharge orders, or EPA decontamination clearances.
   *
   * @param request effluent telemetry or discharge payload
   * @return evaluation result and SCADA sluice containment state
   * @throws BaseBusinessException with HTTP 423 LOCKED if effluent discharge is attempted while sluice gates are isolated
   */
  public ScadaEffluentTelemetryResultDto evaluateScadaEffluentTelemetry(
      final ScadaEffluentTelemetryRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_SCADA_NULL_REQUEST,
          AdvancedBusinessConstant.STR_SCADA_EFFLUENT_TELEMETRY_REQUEST_CAN
      );
    }

    final String sluiceGateId = request.getSluiceGateId();
    if (Objects.isNull(sluiceGateId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_SCADA_NULL_SLUICE_GATE_ID,
          AdvancedBusinessConstant.STR_SLUICE_GATE_IDENTIFIER_CANNOT_BE_NUL
      );
    }

    final String facilityId = request.getFacilityId();
    final String action = request.getAction();
    final String currentStatus = sluiceGateStatuses.getOrDefault(
        sluiceGateId,
        AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL
    );

    // Guard 1: Handle EPA environmental inspector decontamination clearance certificate
    if (AdvancedBusinessConstant.ACTION_EPA_DECONTAMINATION_CLEARANCE.equalsIgnoreCase(action)) {
      return handleEpaDecontaminationClearance(facilityId, sluiceGateId, request.getDecontaminationCertToken());
    }

    // Guard 2: Handle municipal waterway effluent discharge order
    if (AdvancedBusinessConstant.ACTION_DISCHARGE_EFFLUENT.equalsIgnoreCase(action)) {
      return handleEffluentDischargeValidation(facilityId, sluiceGateId, currentStatus, request.getDischargeVolumeGallons());
    }

    // Evaluation: Sensor telemetry reading
    return handleEffluentTelemetrySample(
        facilityId,
        sluiceGateId,
        request.getMeasuredTurbidityNtu(),
        request.getMeasuredRadioactivityBql()
    );
  }

  /**
   * Processes continuous SCADA water purity and radiological sensor telemetry samples.
   *
   * @param facilityId unique treatment or nuclear facility identifier
   * @param sluiceGateId sluice gate valve identifier
   * @param turbidityNtu measured turbidity in NTU
   * @param radioactivityBql measured radioactivity in Bq/L
   * @return containment outcome reflecting updated isolation state
   */
  public ScadaEffluentTelemetryResultDto handleEffluentTelemetrySample(
      final String facilityId,
      final String sluiceGateId,
      final Double turbidityNtu,
      final Double radioactivityBql) {
    final double turbidity = Objects.isNull(turbidityNtu) ? 2.0 : turbidityNtu;
    final double radioactivity = Objects.isNull(radioactivityBql) ? 10.0 : radioactivityBql;

    // Check 1: Radiological contamination spike (>= 100.0 Bq/L limit)
    if (radioactivity > AdvancedBusinessConstant.MAX_PERMISSIBLE_RADIOACTIVITY_BQL) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_RADIOLOGICAL_CONTAMINATION,
          sluiceGateId, radioactivity, AdvancedBusinessConstant.MAX_PERMISSIBLE_RADIOACTIVITY_BQL);
      sluiceGateStatuses.put(sluiceGateId, AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED);
      return ScadaEffluentTelemetryResultDto.builder()
          .facilityId(facilityId)
          .sluiceGateId(sluiceGateId)
          .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED)
          .emergencyIsolated(Boolean.TRUE)
          .dischargePermitted(Boolean.FALSE)
          .containmentDecisionReason(AdvancedBusinessConstant.STR_CRITICAL_RADIOLOGICAL_SPIKE_RADIOACT)
          .build();
    }

    // Check 2: Chemical / sediment turbidity spike (>= 25.0 NTU limit)
    if (turbidity > AdvancedBusinessConstant.MAX_PERMISSIBLE_TURBIDITY_NTU) {
      log.error(AdvancedBusinessConstant.STR_CRITICAL_TURBIDITY_SPIKE_ON_SLUICE_N,
          sluiceGateId, turbidity, AdvancedBusinessConstant.MAX_PERMISSIBLE_TURBIDITY_NTU);
      sluiceGateStatuses.put(sluiceGateId, AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED);
      return ScadaEffluentTelemetryResultDto.builder()
          .facilityId(facilityId)
          .sluiceGateId(sluiceGateId)
          .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED)
          .emergencyIsolated(Boolean.TRUE)
          .dischargePermitted(Boolean.FALSE)
          .containmentDecisionReason(AdvancedBusinessConstant.STR_CRITICAL_TURBIDITY_SPIKE_TURBIDITY_E)
          .build();
    }

    // Check 3: Sluice gate already under emergency isolation from prior breach
    final String existingStatus = sluiceGateStatuses.getOrDefault(
        sluiceGateId,
        AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL
    );
    if (AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED.equalsIgnoreCase(existingStatus)) {
      return ScadaEffluentTelemetryResultDto.builder()
          .facilityId(facilityId)
          .sluiceGateId(sluiceGateId)
          .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED)
          .emergencyIsolated(Boolean.TRUE)
          .dischargePermitted(Boolean.FALSE)
          .containmentDecisionReason(AdvancedBusinessConstant.STR_SLUICE_GATES_REMAIN_PHYSICALLY_ISOLA)
          .build();
    }

    // Normal compliant effluent state
    sluiceGateStatuses.put(sluiceGateId, AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL);
    return ScadaEffluentTelemetryResultDto.builder()
        .facilityId(facilityId)
        .sluiceGateId(sluiceGateId)
        .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL)
        .emergencyIsolated(Boolean.FALSE)
        .dischargePermitted(Boolean.TRUE)
        .containmentDecisionReason(AdvancedBusinessConstant.STR_SCADA_EFFLUENT_TELEMETRY_FULLY_COMPL)
        .build();
  }

  /**
   * Validates municipal effluent discharge order, halting flow if sluice gates are under emergency isolation.
   *
   * @param facilityId facility identifier
   * @param sluiceGateId sluice gate identifier
   * @param currentStatus operational status
   * @param dischargeVolumeGallons requested volume in gallons
   * @return discharge approval outcome
   * @throws BaseBusinessException with HTTP 423 LOCKED if discharge is attempted while isolated
   */
  public ScadaEffluentTelemetryResultDto handleEffluentDischargeValidation(
      final String facilityId,
      final String sluiceGateId,
      final String currentStatus,
      final Double dischargeVolumeGallons) {
    if (AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_EFFLUENT_DISCHARGE_REJECTED_FOR_ISOL, sluiceGateId);
      throw new BaseBusinessException(
          HttpStatus.LOCKED,
          AdvancedBusinessConstant.ERR_SCADA_CONTAMINATION_SLUICE_ISOLATED,
          AdvancedBusinessConstant.MSG_SCADA_CONTAMINATION_SLUICE_ISOLATED
      );
    }

    final double volume = Objects.isNull(dischargeVolumeGallons) ? 10000.0 : dischargeVolumeGallons;
    log.info(AdvancedBusinessConstant.STR_DISCHARGE_OF_GALLONS_APPROVED_THROUG, volume, sluiceGateId);
    return ScadaEffluentTelemetryResultDto.builder()
        .facilityId(facilityId)
        .sluiceGateId(sluiceGateId)
        .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL)
        .emergencyIsolated(Boolean.FALSE)
        .dischargePermitted(Boolean.TRUE)
        .containmentDecisionReason(AdvancedBusinessConstant.STR_EFFLUENT_DISCHARGE_AUTHORIZED_INTO_M)
        .build();
  }

  /**
   * Clears emergency isolation using certified EPA Environmental Inspector decontamination token.
   *
   * @param facilityId facility identifier
   * @param sluiceGateId sluice gate identifier
   * @param token EPA decontamination certification token
   * @return clearance outcome
   * @throws BaseBusinessException with HTTP 403 FORBIDDEN if token is invalid
   */
  public ScadaEffluentTelemetryResultDto handleEpaDecontaminationClearance(
      final String facilityId,
      final String sluiceGateId,
      final String token) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_EPA_DECONTAMINATION_CERT.equals(token)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_EPA_DECONTAMINATION_CERTIFIC, sluiceGateId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_SCADA_INVALID_EPA_TOKEN,
          AdvancedBusinessConstant.STR_INVALID_US_EPA_ENVIRONMENTAL_INSPECT
      );
    }

    sluiceGateStatuses.put(sluiceGateId, AdvancedBusinessConstant.STATUS_SLUICE_GATES_CERTIFIED);
    log.info(AdvancedBusinessConstant.STR_SLUICE_GATE_CLEARED_BY_CERTIFIED_EPA, sluiceGateId);
    return ScadaEffluentTelemetryResultDto.builder()
        .facilityId(facilityId)
        .sluiceGateId(sluiceGateId)
        .sluiceGateStatus(AdvancedBusinessConstant.STATUS_SLUICE_GATES_CERTIFIED)
        .emergencyIsolated(Boolean.FALSE)
        .dischargePermitted(Boolean.TRUE)
        .containmentDecisionReason(AdvancedBusinessConstant.STR_SLUICE_GATES_CERTIFIED_DECONTAMINATE)
        .build();
  }

  /**
   * Retrieves operational status of a sluice gate.
   *
   * @param sluiceGateId sluice gate identifier
   * @return current status string
   */
  public String getSluiceGateStatus(final String sluiceGateId) {
    return sluiceGateStatuses.getOrDefault(
        sluiceGateId,
        AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL
    );
  }

  /**
   * Resets sluice gate status for testing purposes.
   *
   * @param sluiceGateId sluice gate identifier
   */
  public void resetSluiceGateStatus(final String sluiceGateId) {
    sluiceGateStatuses.remove(sluiceGateId);
  }
}

