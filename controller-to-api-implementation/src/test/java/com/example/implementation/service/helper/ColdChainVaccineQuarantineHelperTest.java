package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto;
import com.example.implementation.dto.ColdChainVaccineTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating WHO/EU GDP pharmaceutical cold-chain temperature monitoring,
 * sub-zero freezing lockouts, cumulative heat excursions, and Qualified Person (QP) clearance.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class ColdChainVaccineQuarantineHelperTest {

  private ColdChainVaccineQuarantineHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new ColdChainVaccineQuarantineHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateColdChainTelemetry(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null consignment identifier should throw BAD_REQUEST exception")
  public void testNullConsignmentIdThrowsBadRequest() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateColdChainTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Normal compliant cold chain temperature (4.5 C) should maintain IN_TRANSIT status")
  public void testNormalColdChainTemperatureReadingCompliant() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-001")
        .batchNumber("BATCH-BNT162B2")
        .ambientTemperatureCelsius(4.5)
        .cumulativeExcursionMinutes(0.0)
        .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
        .build();

    final ColdChainVaccineTelemetryResultDto result = helper.evaluateColdChainTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getVaccineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT);
    assertThat(result.getQuarantineLocked()).isFalse();
    assertThat(result.getTemperatureReadingCelsius()).isEqualTo(4.5);
  }

  @Test
  @DisplayName("Critical freezing spike (-1.2 C) should trip mandatory GDP quarantine lockout")
  public void testCriticalFreezingSpikeTripsQuarantineLockout() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-001")
        .batchNumber("BATCH-BNT162B2")
        .ambientTemperatureCelsius(-1.2)
        .cumulativeExcursionMinutes(2.0)
        .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
        .build();

    final ColdChainVaccineTelemetryResultDto result = helper.evaluateColdChainTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getVaccineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED);
    assertThat(result.getQuarantineLocked()).isTrue();
    assertThat(result.getReleasePermitted()).isFalse();
  }

  @Test
  @DisplayName("Cumulative heat excursion (> 30 mins above 8.0 C) should trip quarantine lockout")
  public void testCumulativeHeatExcursionTripsQuarantineLockout() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-002")
        .batchNumber("BATCH-MRNA-1273")
        .ambientTemperatureCelsius(9.8)
        .cumulativeExcursionMinutes(35.0)
        .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
        .build();

    final ColdChainVaccineTelemetryResultDto result = helper.evaluateColdChainTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getVaccineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED);
    assertThat(result.getQuarantineLocked()).isTrue();
  }

  @Test
  @DisplayName("Compliant consignment release should succeed with status RELEASED")
  public void testConsignmentReleasePermittedWhenCompliant() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-003")
        .batchNumber("BATCH-BNT162B2")
        .action(AdvancedBusinessConstant.ACTION_RELEASE_CONSIGNMENT)
        .build();

    final ColdChainVaccineTelemetryResultDto result = helper.evaluateColdChainTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getVaccineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_VACCINE_RELEASED);
    assertThat(result.getReleasePermitted()).isTrue();
  }

  @Test
  @DisplayName("Consignment release on quarantined batch should throw PRECONDITION_FAILED")
  public void testConsignmentReleaseRejectedWhenQuarantineLockedThrowsPreconditionFailed() {
    // Step 1: Trip freeze lockout
    final ColdChainVaccineTelemetryRequestDto tripRequest = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-004")
        .batchNumber("BATCH-BNT162B2")
        .ambientTemperatureCelsius(-2.0)
        .cumulativeExcursionMinutes(5.0)
        .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
        .build();
    helper.evaluateColdChainTelemetry(tripRequest);

    // Step 2: Attempt release
    final ColdChainVaccineTelemetryRequestDto releaseRequest = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-004")
        .batchNumber("BATCH-BNT162B2")
        .action(AdvancedBusinessConstant.ACTION_RELEASE_CONSIGNMENT)
        .build();

    assertThatThrownBy(() -> helper.evaluateColdChainTelemetry(releaseRequest))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.PRECONDITION_FAILED.value())
        .hasMessageContaining(AdvancedBusinessConstant.MSG_GDP_COLD_CHAIN_TEMPERATURE_EXCURSION);
  }

  @Test
  @DisplayName("Invalid Qualified Person token should throw FORBIDDEN exception")
  public void testInvalidQpTokenThrowsForbidden() {
    final ColdChainVaccineTelemetryRequestDto request = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-005")
        .batchNumber("BATCH-BNT162B2")
        .action(AdvancedBusinessConstant.ACTION_AUTHORIZE_QA_CLEARANCE)
        .qaInspectionToken("FORGED_QP_TOKEN")
        .build();

    assertThatThrownBy(() -> helper.evaluateColdChainTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Valid Qualified Person token clears quarantine lockout and releases consignment")
  public void testValidQpClearanceReleasesQuarantinedConsignment() {
    // Step 1: Trip freeze lockout
    final ColdChainVaccineTelemetryRequestDto tripRequest = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-006")
        .batchNumber("BATCH-BNT162B2")
        .ambientTemperatureCelsius(-0.8)
        .cumulativeExcursionMinutes(1.0)
        .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
        .build();
    helper.evaluateColdChainTelemetry(tripRequest);

    // Step 2: Qualified Person QA clearance
    final ColdChainVaccineTelemetryRequestDto clearRequest = ColdChainVaccineTelemetryRequestDto.builder()
        .consignmentId("CSG-006")
        .batchNumber("BATCH-BNT162B2")
        .action(AdvancedBusinessConstant.ACTION_AUTHORIZE_QA_CLEARANCE)
        .qaInspectionToken(AdvancedBusinessConstant.SECURITY_TOKEN_QP_QA_RELEASE)
        .build();

    final ColdChainVaccineTelemetryResultDto result = helper.evaluateColdChainTelemetry(clearRequest);

    assertThat(result).isNotNull();
    assertThat(result.getVaccineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_VACCINE_RELEASED);
    assertThat(result.getQuarantineLocked()).isFalse();
    assertThat(result.getReleasePermitted()).isTrue();
  }
}

