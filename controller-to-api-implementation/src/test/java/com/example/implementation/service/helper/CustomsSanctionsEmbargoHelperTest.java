package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto;
import com.example.implementation.dto.CustomsSanctionsDeclarationResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating World Customs Organization and OFAC sanctions embargo screening,
 * origin country restrictions, blacklisted vessel screening, and special license clearances.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class CustomsSanctionsEmbargoHelperTest {

  private CustomsSanctionsEmbargoHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new CustomsSanctionsEmbargoHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateCustomsSanctions(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null consignment identifier should throw BAD_REQUEST exception")
  public void testNullConsignmentIdThrowsBadRequest() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateCustomsSanctions(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Compliant cargo declaration from Germany should pass sanctions screening")
  public void testCompliantCargoDeclarationCleared() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-001")
        .originCountryCode("DE")
        .vesselImoNumber("IMO-8881234")
        .harmonizedTariffCode("847130")
        .declaredMonetaryValueUsd(45000.0)
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(request);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_DECLARED);
    assertThat(result.getSanctionsEmbargoed()).isFalse();
    assertThat(result.getPortReleasePermitted()).isFalse();
  }

  @Test
  @DisplayName("Sanctioned origin country (North Korea - KP) should trip mandatory sanctions embargo")
  public void testSanctionedCountryOriginTripsEmbargoLockout() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-002")
        .originCountryCode(AdvancedBusinessConstant.SANCTIONED_COUNTRY_NORTH_KOREA)
        .vesselImoNumber("IMO-7771234")
        .harmonizedTariffCode("720110")
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(request);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
    assertThat(result.getSanctionsEmbargoed()).isTrue();
    assertThat(result.getPortReleasePermitted()).isFalse();
  }

  @Test
  @DisplayName("Blacklisted maritime vessel (IMO-999 series) should trip sanctions embargo")
  public void testBlacklistedVesselTripsEmbargoLockout() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-003")
        .originCountryCode("SG")
        .vesselImoNumber("IMO-9994567")
        .harmonizedTariffCode("850440")
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(request);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
    assertThat(result.getSanctionsEmbargoed()).isTrue();
  }

  @Test
  @DisplayName("Dual-use munitions HS tariff code (9306 series) should trip embargo lockout")
  public void testDualUseMunitionsHsCodeTripsEmbargoLockout() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-004")
        .originCountryCode("JP")
        .vesselImoNumber("IMO-6661234")
        .harmonizedTariffCode("930690")
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(request);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
    assertThat(result.getSanctionsEmbargoed()).isTrue();
  }

  @Test
  @DisplayName("Port cargo release should succeed with status CUSTOMS_CLEARED when compliant")
  public void testPortCargoReleaseApprovedWhenCompliant() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-005")
        .action(AdvancedBusinessConstant.ACTION_RELEASE_PORT_CARGO)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(request);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_RELEASED);
    assertThat(result.getPortReleasePermitted()).isTrue();
  }

  @Test
  @DisplayName("Port release on embargoed cargo should throw UNAVAILABLE_FOR_LEGAL_REASONS (HTTP 451)")
  public void testPortCargoReleaseRejectedWhenEmbargoedThrowsUnavailableForLegalReasons() {
    // Step 1: Trip embargo via sanctioned country Iran (IR)
    final CustomsSanctionsDeclarationRequestDto tripRequest = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-006")
        .originCountryCode(AdvancedBusinessConstant.SANCTIONED_COUNTRY_IRAN)
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();
    helper.evaluateCustomsSanctions(tripRequest);

    // Step 2: Attempt port cargo release
    final CustomsSanctionsDeclarationRequestDto releaseRequest = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-006")
        .action(AdvancedBusinessConstant.ACTION_RELEASE_PORT_CARGO)
        .build();

    assertThatThrownBy(() -> helper.evaluateCustomsSanctions(releaseRequest))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS.value())
        .hasMessageContaining(AdvancedBusinessConstant.MSG_CUSTOMS_SANCTIONS_EMBARGO_LOCKOUT);
  }

  @Test
  @DisplayName("Invalid OFAC trade license token should throw FORBIDDEN exception")
  public void testInvalidOfacLicenseTokenThrowsForbidden() {
    final CustomsSanctionsDeclarationRequestDto request = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-007")
        .action(AdvancedBusinessConstant.ACTION_OFAC_SPECIAL_CLEARANCE)
        .specialLicenseToken("FORGED_OFAC_TOKEN")
        .build();

    assertThatThrownBy(() -> helper.evaluateCustomsSanctions(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Valid OFAC trade license token clears embargo and authorizes port gate-out release")
  public void testValidOfacSpecialLicenseClearsEmbargoAndReleasesCargo() {
    // Step 1: Trip embargo
    final CustomsSanctionsDeclarationRequestDto tripRequest = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-008")
        .originCountryCode(AdvancedBusinessConstant.SANCTIONED_COUNTRY_CUBA)
        .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
        .build();
    helper.evaluateCustomsSanctions(tripRequest);

    // Step 2: Clear with authorized OFAC token
    final CustomsSanctionsDeclarationRequestDto clearRequest = CustomsSanctionsDeclarationRequestDto.builder()
        .consignmentId("CSG-CUSTOMS-008")
        .action(AdvancedBusinessConstant.ACTION_OFAC_SPECIAL_CLEARANCE)
        .specialLicenseToken(AdvancedBusinessConstant.SECURITY_TOKEN_OFAC_SPECIAL_LICENSE)
        .build();

    final CustomsSanctionsDeclarationResultDto result = helper.evaluateCustomsSanctions(clearRequest);

    assertThat(result).isNotNull();
    assertThat(result.getCargoStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_CARGO_RELEASED);
    assertThat(result.getSanctionsEmbargoed()).isFalse();
    assertThat(result.getPortReleasePermitted()).isTrue();
  }
}

