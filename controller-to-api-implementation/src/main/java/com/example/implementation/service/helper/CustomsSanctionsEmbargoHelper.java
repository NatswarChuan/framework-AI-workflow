package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto;
import com.example.implementation.dto.CustomsSanctionsDeclarationResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing World Customs Organization (WCO) and OFAC international sanctions embargo compliance.
 * Screens bill-of-lading manifest origin countries, blacklisted maritime vessels, and dual-use defense HS tariff codes,
 * preventing illegal port cargo gate-out releases with legal embargo lockouts (HTTP 451).
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class CustomsSanctionsEmbargoHelper {

  private final ConcurrentMap<String, String> cargoStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates incoming maritime cargo manifest declarations, port release orders, or OFAC license clearances.
   *
   * @param request manifest declaration or release payload
   * @return evaluation result and port customs clearance state
   * @throws BaseBusinessException with HTTP 451 UNAVAILABLE_FOR_LEGAL_REASONS if release is attempted on embargoed cargo
   */
  public CustomsSanctionsDeclarationResultDto evaluateCustomsSanctions(
      final CustomsSanctionsDeclarationRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_CUSTOMS_NULL_REQUEST,
          AdvancedBusinessConstant.STR_CUSTOMS_SANCTIONS_DECLARATION_REQUES
      );
    }

    final String consignmentId = request.getConsignmentId();
    if (Objects.isNull(consignmentId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_CUSTOMS_NULL_CONSIGNMENT_ID,
          AdvancedBusinessConstant.STR_CONSIGNMENT_IDENTIFIER_CANNOT_BE_NUL
      );
    }

    final String action = request.getAction();
    final String currentStatus = cargoStatuses.getOrDefault(
        consignmentId,
        AdvancedBusinessConstant.STATUS_CARGO_DECLARED
    );

    // Guard 1: Handle OFAC / Ministry of Trade special trade license clearance
    if (AdvancedBusinessConstant.ACTION_OFAC_SPECIAL_CLEARANCE.equalsIgnoreCase(action)) {
      return handleOfacSpecialClearance(consignmentId, request.getSpecialLicenseToken());
    }

    // Guard 2: Handle port gate-out release validation
    if (AdvancedBusinessConstant.ACTION_RELEASE_PORT_CARGO.equalsIgnoreCase(action)) {
      return handlePortCargoRelease(consignmentId, currentStatus);
    }

    // Evaluation: Cargo declaration sanctions screening
    return handleCustomsDeclaration(
        consignmentId,
        request.getOriginCountryCode(),
        request.getVesselImoNumber(),
        request.getHarmonizedTariffCode()
    );
  }

  /**
   * Screens manifest origin country, vessel IMO, and HS tariff classifications against trade embargo registries.
   *
   * @param consignmentId unique consignment identifier
   * @param countryCode ISO-3166 alpha-2 origin country code
   * @param vesselImo maritime vessel IMO number
   * @param hsCode Harmonized System tariff code
   * @return screening outcome reflecting updated embargo state
   */
  public CustomsSanctionsDeclarationResultDto handleCustomsDeclaration(
      final String consignmentId,
      final String countryCode,
      final String vesselImo,
      final String hsCode) {
    // Check 1: Sanctioned country embargo check (KP, IR, CU, SY)
    if (isSanctionedCountry(countryCode)) {
      log.error(AdvancedBusinessConstant.STR_SANCTIONS_EMBARGO_ON_CONSIGNMENT_ORI,
          consignmentId, countryCode);
      cargoStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
      return CustomsSanctionsDeclarationResultDto.builder()
          .consignmentId(consignmentId)
          .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED)
          .sanctionsEmbargoed(Boolean.TRUE)
          .portReleasePermitted(Boolean.FALSE)
          .screeningDecisionReason(AdvancedBusinessConstant.STR_SANCTIONS_EMBARGO_ORIGIN_COUNTRY_UND)
          .build();
    }

    // Check 2: Blacklisted vessel screening (IMO-999 series)
    if (Objects.nonNull(vesselImo)) {
      if (vesselImo.startsWith(AdvancedBusinessConstant.BLACKLISTED_VESSEL_IMO_PREFIX)) {
        log.error(AdvancedBusinessConstant.STR_SANCTIONS_EMBARGO_ON_CONSIGNMENT_TRA,
            consignmentId, vesselImo);
        cargoStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
        return CustomsSanctionsDeclarationResultDto.builder()
            .consignmentId(consignmentId)
            .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED)
            .sanctionsEmbargoed(Boolean.TRUE)
            .portReleasePermitted(Boolean.FALSE)
            .screeningDecisionReason(AdvancedBusinessConstant.STR_SANCTIONS_EMBARGO_TRANSPORT_VESSEL_R)
            .build();
      }
    }

    // Check 3: Dual-use munitions or defense items (HS 9306 munitions, HS 8802 military aircraft/drones)
    if (Objects.nonNull(hsCode)) {
      if (hsCode.startsWith(AdvancedBusinessConstant.DUAL_USE_HS_PREFIX_MUNITIONS)) {
        log.warn(AdvancedBusinessConstant.STR_DUAL_USE_DEFENSE_ITEM_ON_CONSIGNMENT,
            consignmentId, hsCode);
        cargoStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED);
        return CustomsSanctionsDeclarationResultDto.builder()
            .consignmentId(consignmentId)
            .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED)
            .sanctionsEmbargoed(Boolean.TRUE)
            .portReleasePermitted(Boolean.FALSE)
            .screeningDecisionReason(AdvancedBusinessConstant.STR_DUAL_USE_EMBARGO_MUNITIONS_TARIFF_CO)
            .build();
      }
    }

    // Normal compliant trade cargo
    cargoStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_CARGO_DECLARED);
    return CustomsSanctionsDeclarationResultDto.builder()
        .consignmentId(consignmentId)
        .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_DECLARED)
        .sanctionsEmbargoed(Boolean.FALSE)
        .portReleasePermitted(Boolean.FALSE)
        .screeningDecisionReason(AdvancedBusinessConstant.STR_CARGO_MANIFEST_SUCCESSFULLY_CLEARED)
        .build();
  }

  /**
   * Validates port cargo gate-out release, rejecting embargoed consignments under legal enforcement.
   *
   * @param consignmentId unique consignment identifier
   * @param currentStatus current tracking status
   * @return release confirmation result
   * @throws BaseBusinessException with HTTP 451 UNAVAILABLE_FOR_LEGAL_REASONS if cargo is embargoed
   */
  public CustomsSanctionsDeclarationResultDto handlePortCargoRelease(
      final String consignmentId,
      final String currentStatus) {
    if (AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED.equalsIgnoreCase(currentStatus)) {
      log.warn(AdvancedBusinessConstant.STR_PORT_RELEASE_REJECTED_FOR_EMBARGOED, consignmentId);
      throw new BaseBusinessException(
          HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS,
          AdvancedBusinessConstant.ERR_CUSTOMS_SANCTIONS_EMBARGO_LOCKOUT,
          AdvancedBusinessConstant.MSG_CUSTOMS_SANCTIONS_EMBARGO_LOCKOUT
      );
    }

    log.info(AdvancedBusinessConstant.STR_PORT_GATE_OUT_RELEASE_APPROVED_FOR_C, consignmentId);
    return CustomsSanctionsDeclarationResultDto.builder()
        .consignmentId(consignmentId)
        .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_RELEASED)
        .sanctionsEmbargoed(Boolean.FALSE)
        .portReleasePermitted(Boolean.TRUE)
        .screeningDecisionReason(AdvancedBusinessConstant.STR_CONSIGNMENT_AUTHORIZED_FOR_PORT_GATE)
        .build();
  }

  /**
   * Authorizes formal cargo release under an approved OFAC / Ministry of Trade special license.
   *
   * @param consignmentId unique consignment identifier
   * @param token special trade license token
   * @return updated release result
   * @throws BaseBusinessException with HTTP 403 FORBIDDEN if token is invalid
   */
  public CustomsSanctionsDeclarationResultDto handleOfacSpecialClearance(
      final String consignmentId,
      final String token) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_OFAC_SPECIAL_LICENSE.equals(token)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_OFAC_TRADE_LICENSE_TOKEN_FOR, consignmentId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_CUSTOMS_INVALID_LICENSE_TOKEN,
          AdvancedBusinessConstant.STR_INVALID_OFAC_DUAL_USE_SPECIAL_TRADE
      );
    }

    cargoStatuses.put(consignmentId, AdvancedBusinessConstant.STATUS_CARGO_RELEASED);
    log.info(AdvancedBusinessConstant.STR_CONSIGNMENT_CLEARED_UNDER_CERTIFIED, consignmentId);
    return CustomsSanctionsDeclarationResultDto.builder()
        .consignmentId(consignmentId)
        .cargoStatus(AdvancedBusinessConstant.STATUS_CARGO_RELEASED)
        .sanctionsEmbargoed(Boolean.FALSE)
        .portReleasePermitted(Boolean.TRUE)
        .screeningDecisionReason(AdvancedBusinessConstant.STR_CARGO_FORMALLY_RELEASED_UNDER_CERTIF)
        .build();
  }

  /**
   * Checks whether a country code belongs to international sanctions lists.
   *
   * @param countryCode ISO-3166 country code
   * @return true if country is sanctioned
   */
  public boolean isSanctionedCountry(final String countryCode) {
    if (Objects.isNull(countryCode)) {
      return false;
    }
    if (AdvancedBusinessConstant.SANCTIONED_COUNTRY_NORTH_KOREA.equalsIgnoreCase(countryCode)) {
      return true;
    }
    if (AdvancedBusinessConstant.SANCTIONED_COUNTRY_IRAN.equalsIgnoreCase(countryCode)) {
      return true;
    }
    if (AdvancedBusinessConstant.SANCTIONED_COUNTRY_CUBA.equalsIgnoreCase(countryCode)) {
      return true;
    }
    if (AdvancedBusinessConstant.SANCTIONED_COUNTRY_SYRIA.equalsIgnoreCase(countryCode)) {
      return true;
    }
    return false;
  }

  /**
   * Retrieves operational tracking status for a consignment.
   *
   * @param consignmentId unique consignment identifier
   * @return status string
   */
  public String getCargoStatus(final String consignmentId) {
    return cargoStatuses.getOrDefault(
        consignmentId,
        AdvancedBusinessConstant.STATUS_CARGO_DECLARED
    );
  }

  /**
   * Resets cargo status for testing purposes.
   *
   * @param consignmentId unique consignment identifier
   */
  public void resetCargoStatus(final String consignmentId) {
    cargoStatuses.remove(consignmentId);
  }
}

