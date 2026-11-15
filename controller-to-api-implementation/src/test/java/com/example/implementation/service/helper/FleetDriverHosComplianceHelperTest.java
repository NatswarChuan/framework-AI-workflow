package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.FleetDriverHosDispatchDto;
import com.example.implementation.dto.FleetDriverHosResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating US FMCSA Hours of Service (HOS) 11-hour driving limit rules,
 * fatigue lockout triggers, and 10-hour consecutive rest break resets.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class FleetDriverHosComplianceHelperTest {

  private FleetDriverHosComplianceHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new FleetDriverHosComplianceHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateHosOrDispatch(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null driver identifier should throw BAD_REQUEST exception")
  public void testNullDriverIdThrowsBadRequest() {
    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateHosOrDispatch(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Freight dispatch on fatigue-locked driver throws UNPROCESSABLE_ENTITY (422)")
  public void testFreightDispatchOnFatigueLockedDriverThrowsUnprocessable() {
    helper.seedDriverStatus("DRIVER-01", AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);

    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action(AdvancedBusinessConstant.ACTION_DISPATCH_FREIGHT)
        .freightLoadId("LOAD-999")
        .build();

    assertThatThrownBy(() -> helper.evaluateHosOrDispatch(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.UNPROCESSABLE_ENTITY.value())
        .matches(ex -> AdvancedBusinessConstant.ERR_FLEET_HOS_REGULATORY_VIOLATION.equals(
            ((BaseBusinessException) ex).getErrorCode()));
  }

  @Test
  @DisplayName("Freight dispatch on available driver is approved")
  public void testFreightDispatchOnAvailableDriverApproved() {
    helper.seedDriverStatus("DRIVER-01", AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);

    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action(AdvancedBusinessConstant.ACTION_DISPATCH_FREIGHT)
        .freightLoadId("LOAD-999")
        .build();

    final FleetDriverHosResultDto result = helper.evaluateHosOrDispatch(request);

    assertThat(result.getDispatchApproved()).isTrue();
    assertThat(result.getComplianceViolation()).isFalse();
  }

  @Test
  @DisplayName("Driving hours at or above 11.0 triggers fatigue lockout")
  public void testDrivingHoursAbove11TriggersFatigueLockout() {
    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action("LOG_DRIVING")
        .cumulativeDrivingHours(11.2)
        .build();

    final FleetDriverHosResultDto result = helper.evaluateHosOrDispatch(request);

    assertThat(result.getDriverStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);
    assertThat(result.getComplianceViolation()).isTrue();
  }

  @Test
  @DisplayName("Driving hours below 11.0 remains available")
  public void testDrivingHoursBelow11RemainsAvailable() {
    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action("LOG_DRIVING")
        .cumulativeDrivingHours(7.5)
        .build();

    final FleetDriverHosResultDto result = helper.evaluateHosOrDispatch(request);

    assertThat(result.getDriverStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);
    assertThat(result.getComplianceViolation()).isFalse();
  }

  @Test
  @DisplayName("Insufficient rest break under 10.0 hours fails to reset status")
  public void testInsufficientRestBreakFailsToReset() {
    helper.seedDriverStatus("DRIVER-01", AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);

    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action(AdvancedBusinessConstant.ACTION_RECORD_REST_BREAK)
        .consecutiveRestHours(6.0)
        .build();

    final FleetDriverHosResultDto result = helper.evaluateHosOrDispatch(request);

    assertThat(result.getDriverStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);
    assertThat(result.getDispatchApproved()).isFalse();
  }

  @Test
  @DisplayName("Certified rest break at or above 10.0 hours resets status to AVAILABLE")
  public void testCertifiedRestBreakResetsToAvailable() {
    helper.seedDriverStatus("DRIVER-01", AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED);

    final FleetDriverHosDispatchDto request = FleetDriverHosDispatchDto.builder()
        .driverId("DRIVER-01")
        .action(AdvancedBusinessConstant.ACTION_RECORD_REST_BREAK)
        .consecutiveRestHours(10.0)
        .build();

    final FleetDriverHosResultDto result = helper.evaluateHosOrDispatch(request);

    assertThat(result.getDriverStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);
    assertThat(result.getDispatchApproved()).isTrue();
    assertThat(result.getComplianceViolation()).isFalse();
  }
}

