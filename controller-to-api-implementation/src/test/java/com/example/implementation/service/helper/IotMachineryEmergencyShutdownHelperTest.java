package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.IotMachineryTelemetryRequestDto;
import com.example.implementation.dto.IotMachineryTelemetryResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating ISO 13849 machinery safety emergency shutdown (E-Stop)
 * tripping logic, vibration/temperature threshold anomaly evaluations, and work order lockout.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class IotMachineryEmergencyShutdownHelperTest {

  private IotMachineryEmergencyShutdownHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new IotMachineryEmergencyShutdownHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.processTelemetryOrDispatch(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null machine identifier should throw BAD_REQUEST exception")
  public void testNullMachineIdThrowsBadRequest() {
    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId(null)
        .build();

    assertThatThrownBy(() -> helper.processTelemetryOrDispatch(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Unauthorized clearance token should throw FORBIDDEN exception")
  public void testUnauthorizedClearanceTokenThrowsForbidden() {
    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_MAINTENANCE_CLEARANCE)
        .clearanceToken("INVALID-TOKEN")
        .build();

    assertThatThrownBy(() -> helper.processTelemetryOrDispatch(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Authorized supervisor clearance token should reset machine to OPERATIONAL")
  public void testAuthorizedClearanceResetsToOperational() {
    helper.seedMachineStatus("CNC-01", AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);

    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_MAINTENANCE_CLEARANCE)
        .clearanceToken(AdvancedBusinessConstant.SECURITY_TOKEN_MAINTENANCE_CLEARANCE)
        .build();

    final IotMachineryTelemetryResultDto result = helper.processTelemetryOrDispatch(request);

    assertThat(result.getMachineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL);
    assertThat(result.getTripReason()).isEqualTo("MAINTENANCE_CLEARED");
  }

  @Test
  @DisplayName("Work order dispatch on emergency stopped machine throws HTTP 423 LOCKED")
  public void testWorkOrderDispatchOnEmergencyStoppedThrowsLocked() {
    helper.seedMachineStatus("CNC-01", AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);

    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_DISPATCH_WORK_ORDER)
        .workOrderId("WO-999")
        .build();

    assertThatThrownBy(() -> helper.processTelemetryOrDispatch(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.LOCKED.value())
        .matches(ex -> AdvancedBusinessConstant.ERR_IOT_EMERGENCY_SHUTDOWN_LOCKED.equals(
            ((BaseBusinessException) ex).getErrorCode()));
  }

  @Test
  @DisplayName("Work order dispatch on operational machine succeeds")
  public void testWorkOrderDispatchOnOperationalSucceeds() {
    helper.seedMachineStatus("CNC-01", AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL);

    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_DISPATCH_WORK_ORDER)
        .workOrderId("WO-999")
        .build();

    final IotMachineryTelemetryResultDto result = helper.processTelemetryOrDispatch(request);

    assertThat(result.getWorkOrderAccepted()).isTrue();
    assertThat(result.getEStopTripped()).isFalse();
  }

  @Test
  @DisplayName("Vibration anomaly above 75.0 mm/s trips emergency stop")
  public void testVibrationAnomalyTripsEStop() {
    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_REPORT_TELEMETRY)
        .vibrationMmPerSec(82.4)
        .temperatureCelsius(50.0)
        .build();

    final IotMachineryTelemetryResultDto result = helper.processTelemetryOrDispatch(request);

    assertThat(result.getEStopTripped()).isTrue();
    assertThat(result.getMachineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);
    assertThat(result.getTripReason()).isEqualTo("CRITICAL_VIBRATION_EXCEEDED");
  }

  @Test
  @DisplayName("Temperature anomaly above 95.0 C trips emergency stop")
  public void testTemperatureAnomalyTripsEStop() {
    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_REPORT_TELEMETRY)
        .vibrationMmPerSec(20.0)
        .temperatureCelsius(103.5)
        .build();

    final IotMachineryTelemetryResultDto result = helper.processTelemetryOrDispatch(request);

    assertThat(result.getEStopTripped()).isTrue();
    assertThat(result.getMachineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED);
    assertThat(result.getTripReason()).isEqualTo("CRITICAL_TEMPERATURE_EXCEEDED");
  }

  @Test
  @DisplayName("Normal telemetry within safe operational limits")
  public void testNormalTelemetryOperatesSafely() {
    final IotMachineryTelemetryRequestDto request = IotMachineryTelemetryRequestDto.builder()
        .machineId("CNC-01")
        .action(AdvancedBusinessConstant.ACTION_REPORT_TELEMETRY)
        .vibrationMmPerSec(18.2)
        .temperatureCelsius(42.0)
        .build();

    final IotMachineryTelemetryResultDto result = helper.processTelemetryOrDispatch(request);

    assertThat(result.getEStopTripped()).isFalse();
    assertThat(result.getMachineStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL);
    assertThat(result.getTripReason()).isEqualTo("NONE");
  }
}

