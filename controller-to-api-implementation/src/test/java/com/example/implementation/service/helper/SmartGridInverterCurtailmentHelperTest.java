package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto;
import com.example.implementation.dto.SmartGridFrequencyTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating clean energy smart grid over-frequency curtailment droop controls,
 * ENTSO-E emergency inverter tripping, and Transmission System Operator (TSO) overrides.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class SmartGridInverterCurtailmentHelperTest {

  private SmartGridInverterCurtailmentHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new SmartGridInverterCurtailmentHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateGridFrequencyTelemetry(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null inverter identifier should throw BAD_REQUEST exception")
  public void testNullInverterIdThrowsBadRequest() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateGridFrequencyTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Nominal grid frequency (50.00 Hz) should maintain ONLINE_GENERATING status")
  public void testNormalGridFrequencyOperatingOnline() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-01")
        .farmLocation("Bavaria Solar Park")
        .measuredFrequencyHertz(50.00)
        .nominalCapacityMegawatts(100.0)
        .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
        .build();

    final SmartGridFrequencyTelemetryResultDto result = helper.evaluateGridFrequencyTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getInverterStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE);
    assertThat(result.getCurtailmentActive()).isFalse();
    assertThat(result.getGridExportPermitted()).isTrue();
    assertThat(result.getPermittedExportMegawatts()).isEqualTo(100.0);
  }

  @Test
  @DisplayName("Over-frequency droop (50.30 Hz) should trigger CURTAILED_THROTTLED mode")
  public void testOverFrequencyDroopCurtailmentActivated() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-WIND-02")
        .farmLocation("North Sea Wind Array")
        .measuredFrequencyHertz(50.30)
        .nominalCapacityMegawatts(100.0)
        .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
        .build();

    final SmartGridFrequencyTelemetryResultDto result = helper.evaluateGridFrequencyTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getInverterStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_GRID_INVERTER_CURTAILED);
    assertThat(result.getCurtailmentActive()).isTrue();
    assertThat(result.getPermittedExportMegawatts()).isEqualTo(40.0);
    assertThat(result.getGridExportPermitted()).isTrue();
  }

  @Test
  @DisplayName("Critical over-frequency surge (50.55 Hz) should trip inverter into EMERGENCY_TRIPPED mode")
  public void testCriticalOverFrequencyEmergencyTrip() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-03")
        .farmLocation("Mojave Solar Facility")
        .measuredFrequencyHertz(50.55)
        .nominalCapacityMegawatts(50.0)
        .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
        .build();

    final SmartGridFrequencyTelemetryResultDto result = helper.evaluateGridFrequencyTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getInverterStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_GRID_INVERTER_TRIPPED);
    assertThat(result.getCurtailmentActive()).isTrue();
    assertThat(result.getPermittedExportMegawatts()).isEqualTo(0.0);
    assertThat(result.getGridExportPermitted()).isFalse();
  }

  @Test
  @DisplayName("Renewable power export dispatch on online inverter should be approved")
  public void testExportDispatchApprovedWhenOnline() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-04")
        .requestedExportMegawatts(75.0)
        .action(AdvancedBusinessConstant.ACTION_EXPORT_DISPATCH)
        .build();

    final SmartGridFrequencyTelemetryResultDto result = helper.evaluateGridFrequencyTelemetry(request);

    assertThat(result).isNotNull();
    assertThat(result.getGridExportPermitted()).isTrue();
    assertThat(result.getPermittedExportMegawatts()).isEqualTo(75.0);
  }

  @Test
  @DisplayName("Power export dispatch on tripped inverter should throw SERVICE_UNAVAILABLE")
  public void testExportDispatchRejectedWhenTrippedThrowsServiceUnavailable() {
    // Step 1: Trip inverter
    final SmartGridFrequencyTelemetryRequestDto tripRequest = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-05")
        .measuredFrequencyHertz(50.60)
        .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
        .build();
    helper.evaluateGridFrequencyTelemetry(tripRequest);

    // Step 2: Attempt power export
    final SmartGridFrequencyTelemetryRequestDto dispatchRequest = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-05")
        .requestedExportMegawatts(50.0)
        .action(AdvancedBusinessConstant.ACTION_EXPORT_DISPATCH)
        .build();

    assertThatThrownBy(() -> helper.evaluateGridFrequencyTelemetry(dispatchRequest))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE.value())
        .hasMessageContaining(AdvancedBusinessConstant.MSG_GRID_OVER_FREQUENCY_CURTAILMENT);
  }

  @Test
  @DisplayName("Invalid TSO override token should throw FORBIDDEN exception")
  public void testInvalidTsoOverrideTokenThrowsForbidden() {
    final SmartGridFrequencyTelemetryRequestDto request = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-06")
        .action(AdvancedBusinessConstant.ACTION_OVERRIDE_CURTAILMENT)
        .operatorOverrideToken("UNAUTHORIZED_GRID_TOKEN")
        .build();

    assertThatThrownBy(() -> helper.evaluateGridFrequencyTelemetry(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Valid TSO override clears trip and restores inverter to ONLINE status")
  public void testValidTsoOverrideRestoresInverterOnline() {
    // Step 1: Trip inverter
    final SmartGridFrequencyTelemetryRequestDto tripRequest = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-07")
        .measuredFrequencyHertz(50.70)
        .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
        .build();
    helper.evaluateGridFrequencyTelemetry(tripRequest);

    // Step 2: TSO override
    final SmartGridFrequencyTelemetryRequestDto overrideRequest = SmartGridFrequencyTelemetryRequestDto.builder()
        .inverterId("INV-SOLAR-07")
        .action(AdvancedBusinessConstant.ACTION_OVERRIDE_CURTAILMENT)
        .operatorOverrideToken(AdvancedBusinessConstant.SECURITY_TOKEN_GRID_DISPATCH_OVERRIDE)
        .requestedExportMegawatts(80.0)
        .build();

    final SmartGridFrequencyTelemetryResultDto result = helper.evaluateGridFrequencyTelemetry(overrideRequest);

    assertThat(result).isNotNull();
    assertThat(result.getInverterStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE);
    assertThat(result.getCurtailmentActive()).isFalse();
    assertThat(result.getGridExportPermitted()).isTrue();
    assertThat(result.getPermittedExportMegawatts()).isEqualTo(80.0);
  }
}

