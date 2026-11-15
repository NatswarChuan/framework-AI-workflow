package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ScadaEffluentTelemetryRequestDto;
import com.example.implementation.dto.ScadaEffluentTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating US EPA and IAEA SCADA water purity limits, radiological surge tripping,
 * physical sluice gate isolation, and environmental inspector decontamination clearances.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class ScadaEffluentContaminationIsolationHelperTest {

  private ScadaEffluentContaminationIsolationHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new ScadaEffluentContaminationIsolationHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateScadaEffluentTelemetry(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null sluice gate identifier should throw BAD_REQUEST exception")
  public void testNullSluiceGateIdThrowsBadRequest() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .sluiceGateId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateScadaEffluentTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Compliant effluent telemetry (3.5 NTU, 12.0 Bq/L) maintains NORMAL_DISCHARGE_OPEN status")
  public void testCompliantEffluentTelemetryNormalDischarge() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-01")
        .sluiceGateId("GATE-ALPHA-01")
        .measuredTurbidityNtu(3.5)
        .measuredRadioactivityBql(12.0)
        .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
        .build();

    final ScadaEffluentTelemetryResultDto result = helper.evaluateScadaEffluentTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getSluiceGateStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL);
    assertThat(result.getEmergencyIsolated()).isFalse();
    assertThat(result.getDischargePermitted()).isTrue();
  }

  @Test
  @DisplayName("Radiological contamination surge (150.0 Bq/L > 100.0 limit) trips emergency sluice isolation")
  public void testRadiologicalContaminationSurgeTripsEmergencyIsolation() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-NUCLEAR-02")
        .sluiceGateId("GATE-BRAVO-02")
        .measuredTurbidityNtu(4.0)
        .measuredRadioactivityBql(150.0)
        .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
        .build();

    final ScadaEffluentTelemetryResultDto result = helper.evaluateScadaEffluentTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getSluiceGateStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED);
    assertThat(result.getEmergencyIsolated()).isTrue();
    assertThat(result.getDischargePermitted()).isFalse();
  }

  @Test
  @DisplayName("Sediment turbidity surge (35.0 NTU > 25.0 limit) trips emergency sluice isolation")
  public void testTurbiditySedimentSurgeTripsEmergencyIsolation() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-03")
        .sluiceGateId("GATE-CHARLIE-03")
        .measuredTurbidityNtu(35.0)
        .measuredRadioactivityBql(8.0)
        .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
        .build();

    final ScadaEffluentTelemetryResultDto result = helper.evaluateScadaEffluentTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getSluiceGateStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED);
    assertThat(result.getEmergencyIsolated()).isTrue();
    assertThat(result.getDischargePermitted()).isFalse();
  }

  @Test
  @DisplayName("Municipal effluent discharge should be approved when sluice status is normal")
  public void testMunicipalEffluentDischargeApprovedWhenCompliant() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-04")
        .sluiceGateId("GATE-DELTA-04")
        .dischargeVolumeGallons(25000.0)
        .action(AdvancedBusinessConstant.ACTION_DISCHARGE_EFFLUENT)
        .build();

    final ScadaEffluentTelemetryResultDto result = helper.evaluateScadaEffluentTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getDischargePermitted()).isTrue();
    assertThat(result.getEmergencyIsolated()).isFalse();
  }

  @Test
  @DisplayName("Effluent discharge on isolated sluice gate should throw LOCKED (HTTP 423)")
  public void testEffluentDischargeRejectedWhenIsolatedThrowsLocked() {
    // Step 1: Trip isolation via chemical surge
    final ScadaEffluentTelemetryRequestDto tripRequest = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-05")
        .sluiceGateId("GATE-ECHO-05")
        .measuredTurbidityNtu(60.0)
        .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
        .build();
    helper.evaluateScadaEffluentTelemetry(tripRequest);

    // Step 2: Attempt discharge
    final ScadaEffluentTelemetryRequestDto dischargeRequest = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-05")
        .sluiceGateId("GATE-ECHO-05")
        .dischargeVolumeGallons(50000.0)
        .action(AdvancedBusinessConstant.ACTION_DISCHARGE_EFFLUENT)
        .build();

    assertThatThrownBy(() -> helper.evaluateScadaEffluentTelemetry(dischargeRequest))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.LOCKED.value())
        .hasMessageContaining(AdvancedBusinessConstant.MSG_SCADA_CONTAMINATION_SLUICE_ISOLATED);
  }

  @Test
  @DisplayName("Invalid EPA decontamination token should throw FORBIDDEN exception")
  public void testInvalidEpaDecontaminationTokenThrowsForbidden() {
    final ScadaEffluentTelemetryRequestDto request = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-06")
        .sluiceGateId("GATE-FOXTROT-06")
        .action(AdvancedBusinessConstant.ACTION_EPA_DECONTAMINATION_CLEARANCE)
        .decontaminationCertToken("FORGED_EPA_TOKEN")
        .build();

    assertThatThrownBy(() -> helper.evaluateScadaEffluentTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Valid EPA decontamination token clears isolation and authorizes municipal discharge")
  public void testValidEpaDecontaminationCertificateClearsIsolationAndAuthorizesDischarge() {
    // Step 1: Trip isolation
    final ScadaEffluentTelemetryRequestDto tripRequest = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-07")
        .sluiceGateId("GATE-GOLF-07")
        .measuredRadioactivityBql(260.0)
        .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
        .build();
    helper.evaluateScadaEffluentTelemetry(tripRequest);

    // Step 2: Certified EPA decontamination clearance
    final ScadaEffluentTelemetryRequestDto clearRequest = ScadaEffluentTelemetryRequestDto.builder()
        .facilityId("PLANT-WATER-07")
        .sluiceGateId("GATE-GOLF-07")
        .action(AdvancedBusinessConstant.ACTION_EPA_DECONTAMINATION_CLEARANCE)
        .decontaminationCertToken(AdvancedBusinessConstant.SECURITY_TOKEN_EPA_DECONTAMINATION_CERT)
        .build();

    final ScadaEffluentTelemetryResultDto result = helper.evaluateScadaEffluentTelemetry(clearRequest);

    assertThat(result).isNotNull();
    assertThat(result.getSluiceGateStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_SLUICE_GATES_CERTIFIED);
    assertThat(result.getEmergencyIsolated()).isFalse();
    assertThat(result.getDischargePermitted()).isTrue();
  }
}

