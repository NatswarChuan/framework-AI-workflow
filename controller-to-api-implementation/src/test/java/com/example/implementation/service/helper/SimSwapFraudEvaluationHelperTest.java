package com.example.implementation.service.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.SimSwapFraudEvaluationRequestDto;
import com.example.implementation.dto.SimSwapFraudEvaluationResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

/**
 * Unit tests validating telecommunications SIM-swap fraud detection rules,
 * 48-hour high-risk freeze logic, and biometric KYC unfreezing.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
public class SimSwapFraudEvaluationHelperTest {

  private SimSwapFraudEvaluationHelper helper;

  @BeforeEach
  public void setUp() {
    helper = new SimSwapFraudEvaluationHelper();
  }

  @Test
  @DisplayName("Null request should throw BAD_REQUEST exception")
  public void testNullRequestThrowsBadRequest() {
    assertThatThrownBy(() -> helper.evaluateSimSwapOrTransfer(null))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Null account identifier should throw BAD_REQUEST exception")
  public void testNullAccountIdThrowsBadRequest() {
    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId(null)
        .build();

    assertThatThrownBy(() -> helper.evaluateSimSwapOrTransfer(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.BAD_REQUEST.value());
  }

  @Test
  @DisplayName("Invalid biometric token throws FORBIDDEN exception")
  public void testInvalidBiometricTokenThrowsForbidden() {
    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_VERIFY_BIOMETRIC_KYC)
        .verificationToken("FAKE-TOKEN")
        .build();

    assertThatThrownBy(() -> helper.evaluateSimSwapOrTransfer(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value());
  }

  @Test
  @DisplayName("Valid biometric token clears SIM swap restriction")
  public void testValidBiometricTokenClearsRestriction() {
    helper.seedAccountStatus("ACC-01", AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED);

    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_VERIFY_BIOMETRIC_KYC)
        .verificationToken(AdvancedBusinessConstant.SECURITY_TOKEN_BIOMETRIC_VERIFIED)
        .build();

    final SimSwapFraudEvaluationResultDto result = helper.evaluateSimSwapOrTransfer(request);

    assertThat(result.getAccountStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);
    assertThat(result.getTransactionAllowed()).isTrue();
  }

  @Test
  @DisplayName("High value transfer over $1000 on SIM swapped account throws FORBIDDEN")
  public void testHighValueTransferOnSimSwappedAccountThrowsForbidden() {
    helper.seedAccountStatus("ACC-01", AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED);

    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_TRANSFER_FUNDS)
        .transactionAmount(1500.0)
        .build();

    assertThatThrownBy(() -> helper.evaluateSimSwapOrTransfer(request))
        .isInstanceOf(BaseBusinessException.class)
        .matches(ex -> ((BaseBusinessException) ex).getStatusCode() == HttpStatus.FORBIDDEN.value())
        .matches(ex -> AdvancedBusinessConstant.ERR_FRAUD_SIM_SWAP_HIGH_RISK_FREEZE.equals(
            ((BaseBusinessException) ex).getErrorCode()));
  }

  @Test
  @DisplayName("Low value transfer under $1000 on SIM swapped account is permitted")
  public void testLowValueTransferOnSimSwappedAccountPermitted() {
    helper.seedAccountStatus("ACC-01", AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED);

    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_TRANSFER_FUNDS)
        .transactionAmount(500.0)
        .build();

    final SimSwapFraudEvaluationResultDto result = helper.evaluateSimSwapOrTransfer(request);

    assertThat(result.getTransactionAllowed()).isTrue();
    assertThat(result.getRiskLevel()).isEqualTo("MEDIUM");
  }

  @Test
  @DisplayName("Transfer on normal account is approved with low risk")
  public void testTransferOnNormalAccountApproved() {
    helper.seedAccountStatus("ACC-01", AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);

    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_TRANSFER_FUNDS)
        .transactionAmount(50000.0)
        .build();

    final SimSwapFraudEvaluationResultDto result = helper.evaluateSimSwapOrTransfer(request);

    assertThat(result.getTransactionAllowed()).isTrue();
    assertThat(result.getRiskLevel()).isEqualTo("LOW");
  }

  @Test
  @DisplayName("SIM swap report within 48 hours flags account as SIM_SWAPPED")
  public void testSimSwapReportWithin48HoursFlagsAccount() {
    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_REPORT_SIM_SWAP)
        .hoursSinceSimSwap(12.0)
        .build();

    final SimSwapFraudEvaluationResultDto result = helper.evaluateSimSwapOrTransfer(request);

    assertThat(result.getAccountStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED);
    assertThat(result.getRiskLevel()).isEqualTo("CRITICAL");
  }

  @Test
  @DisplayName("SIM swap report after 48 hours marks account as normal")
  public void testSimSwapReportAfter48HoursMarksNormal() {
    final SimSwapFraudEvaluationRequestDto request = SimSwapFraudEvaluationRequestDto.builder()
        .accountId("ACC-01")
        .action(AdvancedBusinessConstant.ACTION_REPORT_SIM_SWAP)
        .hoursSinceSimSwap(72.0)
        .build();

    final SimSwapFraudEvaluationResultDto result = helper.evaluateSimSwapOrTransfer(request);

    assertThat(result.getAccountStatus()).isEqualTo(AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);
    assertThat(result.getRiskLevel()).isEqualTo("LOW");
  }
}

