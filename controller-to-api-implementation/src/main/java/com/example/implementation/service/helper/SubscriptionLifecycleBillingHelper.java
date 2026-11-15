package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.SubscriptionPlanChangeRequestDto;
import com.example.implementation.dto.SubscriptionPlanChangeResultDto;
import com.example.implementation.entity.SubscriptionContract;
import io.github.natswarchuan.common.constant.ErrorConstant;
import io.github.natswarchuan.common.constant.LogConstant;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import java.math.BigDecimal;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component orchestrating SaaS subscription plan modifications and billing concurrency locks.
 *
 * <p>Prevents race conditions between user plan downgrades/cancellations and recurring automated
 * billing cycles, ensuring consistent financial accounting and preventing billing fraud.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class SubscriptionLifecycleBillingHelper {

  private final EntityManager entityManager;

  /**
   * Executes atomic subscription plan transition under billing lock protections.
   *
   * @param request subscription plan modification request payload
   * @return successful {@link SubscriptionPlanChangeResultDto}
   * @throws BaseBusinessException if contract is inactive or billing is actively locked
   */
  public SubscriptionPlanChangeResultDto changeSubscriptionPlanAtomic(
      final SubscriptionPlanChangeRequestDto request) {
    Objects.requireNonNull(request);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_CHANGE_SUBSCRIPTION_PLAN_ATOMIC, request.getSubscriptionId());

    final SubscriptionContract contract = entityManager.find(
        SubscriptionContract.class,
        request.getSubscriptionId(),
        LockModeType.PESSIMISTIC_WRITE
    );
    if (Objects.isNull(contract)) {
      throw new BaseBusinessException(
          HttpStatus.NOT_FOUND,
          ErrorConstant.ERR_RESOURCE_NOT_FOUND,
          ErrorConstant.MSG_RESOURCE_NOT_FOUND
      );
    }

    validateSubscriptionStateForModification(contract);

    final String oldTier = contract.getSubscriptionTier();
    contract.setSubscriptionTier(request.getTargetTier());
    entityManager.merge(contract);

    final SubscriptionPlanChangeResultDto result = SubscriptionPlanChangeResultDto.builder()
        .subscriptionId(contract.getId())
        .contractCode(contract.getContractCode())
        .previousTier(oldTier)
        .newTier(request.getTargetTier())
        .changeStatus(AdvancedBusinessConstant.STATUS_CHANGED)
        .proratedAdjustment(BigDecimal.ZERO)
        .build();

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_CHANGE_SUBSCRIPTION_PLAN_ATOMIC);
    return result;
  }

  /**
   * Validates that subscription contract is in an active mutable state and not locked by billing.
   *
   * @param contract target subscription contract entity
   * @throws BaseBusinessException if contract is cancelled, expired, or locked in billing
   */
  public void validateSubscriptionStateForModification(final SubscriptionContract contract) {
    Objects.requireNonNull(contract);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_VALIDATE_SUBSCRIPTION_STATE_FOR_MODI, contract.getContractStatus());

    final boolean isCancelled = AdvancedBusinessConstant.STATUS_CONTRACT_CANCELLED.equals(contract.getContractStatus());
    if (isCancelled) {
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_SUBSCRIPTION_INACTIVE,
          AdvancedBusinessConstant.MSG_SUBSCRIPTION_INACTIVE
      );
    }

    final boolean isExpired = AdvancedBusinessConstant.STATUS_CONTRACT_EXPIRED.equals(contract.getContractStatus());
    if (isExpired) {
      throw new BaseBusinessException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          AdvancedBusinessConstant.ERR_SUBSCRIPTION_INACTIVE,
          AdvancedBusinessConstant.MSG_SUBSCRIPTION_INACTIVE
      );
    }

    final boolean isBillingLocked = AdvancedBusinessConstant.STATUS_CONTRACT_SUSPENDED.equals(contract.getContractStatus());
    if (isBillingLocked) {
      throw new BaseBusinessException(
          HttpStatus.CONFLICT,
          AdvancedBusinessConstant.ERR_SUBSCRIPTION_BILLING_CONFLICT,
          AdvancedBusinessConstant.MSG_SUBSCRIPTION_BILLING_CONFLICT
      );
    }

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_VALIDATE_SUBSCRIPTION_STATE_FOR_MODI);
  }
}

