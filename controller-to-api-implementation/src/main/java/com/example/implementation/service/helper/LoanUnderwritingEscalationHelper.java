package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.LoanDisbursementRequestDto;
import com.example.implementation.dto.LoanDisbursementResultDto;
import com.example.implementation.entity.LoanApplication;
import io.github.natswarchuan.common.constant.ErrorConstant;
import io.github.natswarchuan.common.constant.LogConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component orchestrating FinTech lending credit scoring guards and loan disbursement lifecycle.
 *
 * <p>Enforces credit score underwriting thresholds, prevents illegal state machine jumping,
 * and eliminates double-disbursement race conditions under concurrent requests.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class LoanUnderwritingEscalationHelper {

  private final EntityManager entityManager;

  /**
   * Executes atomic loan fund disbursement with multi-stage underwriting verification.
   *
   * @param request loan disbursement request payload
   * @return successful {@link LoanDisbursementResultDto}
   * @throws BaseBusinessException if credit threshold is violated or double-disbursement is detected
   */
  public LoanDisbursementResultDto disburseLoanFundsAtomic(final LoanDisbursementRequestDto request) {
    Objects.requireNonNull(request);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_DISBURSE_LOAN_FUNDS_ATOMIC, request.getLoanApplicationId());

    final LoanApplication loan = entityManager.find(
        LoanApplication.class,
        request.getLoanApplicationId(),
        LockModeType.PESSIMISTIC_WRITE
    );
    if (Objects.isNull(loan)) {
      throw new BaseBusinessException(
          HttpStatus.NOT_FOUND,
          ErrorConstant.ERR_RESOURCE_NOT_FOUND,
          ErrorConstant.MSG_RESOURCE_NOT_FOUND
      );
    }

    validateCreditScoreUnderwriting(loan);
    validateLoanDisbursementEligibility(loan);

    loan.setLoanStatus(AdvancedBusinessConstant.STATE_LOAN_DISBURSED);
    entityManager.merge(loan);

    final String disbursementRef = AdvancedBusinessConstant.STR_DISB + System.currentTimeMillis();
    final LoanDisbursementResultDto result = LoanDisbursementResultDto.builder()
        .loanApplicationId(loan.getId())
        .loanReferenceCode(loan.getLoanReferenceCode())
        .disbursementReference(disbursementRef)
        .disbursedAmount(request.getDisbursementAmount())
        .disbursementStatus(AdvancedBusinessConstant.STATE_LOAN_DISBURSED)
        .build();

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_DISBURSE_LOAN_FUNDS_ATOMIC);
    return result;
  }

  /**
   * Validates that applicant's credit score satisfies minimum underwriting criteria.
   *
   * @param loan target loan entity
   * @throws BaseBusinessException if credit score is below threshold
   */
  public void validateCreditScoreUnderwriting(final LoanApplication loan) {
    Objects.requireNonNull(loan);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_VALIDATE_CREDIT_SCORE_UNDERWRITING, loan.getLoanReferenceCode());

    final Integer creditScore = loan.getCreditScore();
    if (Objects.isNull(creditScore)) {
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_LOAN_CREDIT_SCORE_TOO_LOW,
          AdvancedBusinessConstant.MSG_LOAN_CREDIT_SCORE_TOO_LOW
      );
    }

    final boolean isBelowThreshold = creditScore < AdvancedBusinessConstant.MINIMUM_CREDIT_SCORE_THRESHOLD;
    if (isBelowThreshold) {
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_LOAN_CREDIT_SCORE_TOO_LOW,
          AdvancedBusinessConstant.MSG_LOAN_CREDIT_SCORE_TOO_LOW
      );
    }

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_VALIDATE_CREDIT_SCORE_UNDERWRITING);
  }

  /**
   * Validates that loan application is in approved status and has not already been disbursed.
   *
   * @param loan target loan entity
   * @throws BaseBusinessException if loan is already disbursed or not yet approved
   */
  public void validateLoanDisbursementEligibility(final LoanApplication loan) {
    Objects.requireNonNull(loan);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_VALIDATE_LOAN_DISBURSEMENT_ELIGIBILI, loan.getLoanStatus());

    final boolean isAlreadyDisbursed = AdvancedBusinessConstant.STATE_LOAN_DISBURSED.equals(loan.getLoanStatus());
    if (isAlreadyDisbursed) {
      throw new BaseBusinessException(
          HttpStatus.CONFLICT,
          AdvancedBusinessConstant.ERR_LOAN_ALREADY_DISBURSED,
          AdvancedBusinessConstant.MSG_LOAN_ALREADY_DISBURSED
      );
    }

    final boolean isApproved = AdvancedBusinessConstant.STATE_LOAN_APPROVED.equals(loan.getLoanStatus());
    if (!isApproved) {
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_LOAN_NOT_APPROVED,
          AdvancedBusinessConstant.MSG_LOAN_NOT_APPROVED
      );
    }

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_VALIDATE_LOAN_DISBURSEMENT_ELIGIBILI);
  }
}

