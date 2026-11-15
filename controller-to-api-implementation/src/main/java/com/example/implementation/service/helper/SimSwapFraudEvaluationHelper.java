package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.SimSwapFraudEvaluationRequestDto;
import com.example.implementation.dto.SimSwapFraudEvaluationResultDto;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component enforcing telecommunications and banking SIM-swap fraud prevention gates.
 * Protects against account takeover (ATO) by imposing high-risk security freezes on fund transfers
 * exceeding $1,000 within 48 hours of mobile SIM or device replacement, unless cleared by biometric KYC.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Component
@Slf4j
public final class SimSwapFraudEvaluationHelper {

  private final ConcurrentMap<String, String> accountStatuses = new ConcurrentHashMap<>();

  /**
   * Evaluates incoming financial transactions or biometric KYC clearance against SIM-swap risks.
   *
   * @param request transaction or KYC verification request
   * @return evaluation result and account state
   * @throws BaseBusinessException with HTTP 403 FORBIDDEN if high-value transfer is blocked by SIM-swap freeze
   */
  public SimSwapFraudEvaluationResultDto evaluateSimSwapOrTransfer(
      final SimSwapFraudEvaluationRequestDto request) {
    if (Objects.isNull(request)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_FRAUD_NULL_REQUEST,
          AdvancedBusinessConstant.STR_SIM_SWAP_FRAUD_EVALUATION_REQUEST_CA
      );
    }

    final String accountId = request.getAccountId();
    if (Objects.isNull(accountId)) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.STR_ERROR_FRAUD_NULL_ACCOUNT_ID,
          AdvancedBusinessConstant.STR_ACCOUNT_IDENTIFIER_CANNOT_BE_NULL
      );
    }

    final String action = request.getAction();
    final String currentStatus = accountStatuses.getOrDefault(
        accountId,
        AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL
    );

    // Guard 1: Biometric video KYC verification to clear SIM-swap freeze
    if (AdvancedBusinessConstant.ACTION_VERIFY_BIOMETRIC_KYC.equalsIgnoreCase(action)) {
      return handleBiometricVerification(accountId, request.getVerificationToken());
    }

    // Guard 2: Ingest telco SIM-swap telemetry event
    if (AdvancedBusinessConstant.ACTION_REPORT_SIM_SWAP.equalsIgnoreCase(action)) {
      return handleSimSwapReport(accountId, request.getHoursSinceSimSwap());
    }

    // Execution: Fund transfer validation under SIM-swap freeze
    return handleFundTransfer(accountId, currentStatus, request.getTransactionAmount());
  }

  /**
   * Handles biometric video selfie verification to clear SIM-swap restrictions.
   *
   * @param accountId account identifier
   * @param verificationToken biometric KYC token
   * @return result indicating account is cleared
   */
  public SimSwapFraudEvaluationResultDto handleBiometricVerification(
      final String accountId,
      final String verificationToken) {
    if (!AdvancedBusinessConstant.SECURITY_TOKEN_BIOMETRIC_VERIFIED.equals(verificationToken)) {
      log.warn(AdvancedBusinessConstant.STR_INVALID_BIOMETRIC_KYC_TOKEN_FOR_ACCO, accountId);
      throw new BaseBusinessException(
          HttpStatus.FORBIDDEN,
          AdvancedBusinessConstant.STR_ERROR_FRAUD_INVALID_BIOMETRIC_TOKEN,
          AdvancedBusinessConstant.STR_BIOMETRIC_KYC_VERIFICATION_FAILED_OR
      );
    }

    accountStatuses.put(accountId, AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);
    log.info(AdvancedBusinessConstant.STR_ACCOUNT_SUCCESSFULLY_CLEARED_OF_SIM, accountId);

    return SimSwapFraudEvaluationResultDto.builder()
        .accountId(accountId)
        .accountStatus(AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL)
        .transactionAllowed(Boolean.TRUE)
        .riskLevel(AdvancedBusinessConstant.STR_LOW)
        .decisionReason(AdvancedBusinessConstant.STR_BIOMETRIC_KYC_CLEARED)
        .build();
  }

  /**
   * Ingests telecom SIM-swap event and marks account status accordingly.
   *
   * @param accountId account identifier
   * @param hoursSinceSwap elapsed hours since SIM card replacement
   * @return result indicating updated risk status
   */
  public SimSwapFraudEvaluationResultDto handleSimSwapReport(
      final String accountId,
      final Double hoursSinceSwap) {
    if (isHighRiskSimSwapWindow(hoursSinceSwap)) {
      log.warn(AdvancedBusinessConstant.STR_ACCOUNT_FLAGGED_WITH_HIGH_RISK_SIM_S, accountId, hoursSinceSwap);
      accountStatuses.put(accountId, AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED);

      return SimSwapFraudEvaluationResultDto.builder()
          .accountId(accountId)
          .accountStatus(AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED)
          .transactionAllowed(Boolean.FALSE)
          .riskLevel(AdvancedBusinessConstant.STR_CRITICAL)
          .decisionReason(AdvancedBusinessConstant.STR_SIM_SWAP_WITHIN_48_H_DETECTED)
          .build();
    }

    accountStatuses.put(accountId, AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);
    return SimSwapFraudEvaluationResultDto.builder()
        .accountId(accountId)
        .accountStatus(AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL)
        .transactionAllowed(Boolean.TRUE)
        .riskLevel(AdvancedBusinessConstant.STR_LOW)
        .decisionReason(AdvancedBusinessConstant.STR_SIM_SWAP_WINDOW_EXPIRED)
        .build();
  }

  /**
   * Validates fund transfer under active SIM-swap risk states.
   *
   * @param accountId account identifier
   * @param currentStatus current account risk state
   * @param amount monetary transaction amount in USD
   * @return result indicating whether transfer is approved
   */
  public SimSwapFraudEvaluationResultDto handleFundTransfer(
      final String accountId,
      final String currentStatus,
      final Double amount) {
    if (AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED.equalsIgnoreCase(currentStatus)) {
      if (isHighValueTransaction(amount)) {
        log.warn(AdvancedBusinessConstant.STR_HIGH_VALUE_TRANSFER_OF_BLOCKED_FOR_S, amount, accountId);
        throw new BaseBusinessException(
            HttpStatus.FORBIDDEN,
            AdvancedBusinessConstant.ERR_FRAUD_SIM_SWAP_HIGH_RISK_FREEZE,
            AdvancedBusinessConstant.MSG_FRAUD_SIM_SWAP_HIGH_RISK_FREEZE
        );
      }

      log.info(AdvancedBusinessConstant.STR_LOW_VALUE_TRANSFER_OF_PERMITTED_UNDE, amount, accountId);
      return SimSwapFraudEvaluationResultDto.builder()
          .accountId(accountId)
          .accountStatus(currentStatus)
          .transactionAllowed(Boolean.TRUE)
          .riskLevel(AdvancedBusinessConstant.STR_MEDIUM)
          .decisionReason(AdvancedBusinessConstant.STR_LOW_VALUE_TRANSACTION_APPROVED)
          .build();
    }

    log.info(AdvancedBusinessConstant.STR_TRANSFER_OF_APPROVED_FOR_NORMAL_ACCO, amount, accountId);
    return SimSwapFraudEvaluationResultDto.builder()
        .accountId(accountId)
        .accountStatus(currentStatus)
        .transactionAllowed(Boolean.TRUE)
        .riskLevel(AdvancedBusinessConstant.STR_LOW)
        .decisionReason(AdvancedBusinessConstant.STR_NORMAL_ACCOUNT_APPROVED)
        .build();
  }

  /**
   * Checks if SIM card was swapped within the regulatory 48-hour high-risk freeze window.
   *
   * @param hours elapsed hours since SIM swap
   * @return true if within 48 hours
   */
  public boolean isHighRiskSimSwapWindow(final Double hours) {
    if (Objects.isNull(hours)) {
      return false;
    }
    return hours <= 48.0;
  }

  /**
   * Checks if transaction amount reaches or exceeds the $1,000 high-value threshold.
   *
   * @param amount monetary amount
   * @return true if >= 1000.0
   */
  public boolean isHighValueTransaction(final Double amount) {
    if (Objects.isNull(amount)) {
      return false;
    }
    return amount >= AdvancedBusinessConstant.SIM_SWAP_HIGH_RISK_THRESHOLD_USD;
  }

  /**
   * Seeds account status for test isolation.
   *
   * @param accountId account identifier
   * @param status account status
   */
  public void seedAccountStatus(final String accountId, final String status) {
    accountStatuses.put(accountId, status);
  }
}

