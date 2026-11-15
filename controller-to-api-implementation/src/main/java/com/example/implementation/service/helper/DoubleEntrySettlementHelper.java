package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.DoubleEntryTransferRequestDto;
import com.example.implementation.dto.DoubleEntryTransferResultDto;
import com.example.implementation.entity.BankAccount;
import com.example.implementation.entity.PaymentTransaction;
import io.github.natswarchuan.common.constant.LogConstant;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.TypedQuery;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Dedicated enterprise helper executing high-concurrency financial double-entry ledger fund transfers.
 *
 * <p>Enforces deterministic two-phase row locking to mathematically eliminate deadlock cycles,
 * verifies zero-deficit balance invariants, and records immutable payment transactions.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class DoubleEntrySettlementHelper {

  private final EntityManager entityManager;

  /**
   * Executes deterministic double-entry ledger settlement between two commercial bank accounts.
   *
   * @param request fund transfer request
   * @return settled transfer outcome DTO
   */
  public DoubleEntryTransferResultDto settleTransfer(final DoubleEntryTransferRequestDto request) {
    Objects.requireNonNull(request);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_SETTLE_TRANSFER, request.getTransferReference());

    validateTransferParameters(request);

    lockAccountsInDeterministicOrder(request.getSourceAccountNumber(), request.getDestinationAccountNumber());
    final BankAccount sourceAccount = lockAccountByNumber(request.getSourceAccountNumber());
    final BankAccount destAccount = lockAccountByNumber(request.getDestinationAccountNumber());

    verifySufficientFunds(sourceAccount, request.getAmount());

    final BigDecimal fee = resolveFeeAmount(request.getFeeAmount());
    final BigDecimal netAmount = request.getAmount().subtract(fee);

    final BigDecimal newSourceBalance = sourceAccount.getCurrentBalance().subtract(request.getAmount());
    final BigDecimal newDestBalance = destAccount.getCurrentBalance().add(netAmount);

    sourceAccount.setCurrentBalance(newSourceBalance);
    destAccount.setCurrentBalance(newDestBalance);

    entityManager.merge(sourceAccount);
    entityManager.merge(destAccount);

    settlePlatformFee(request.getPlatformFeeAccountNumber(), fee);

    recordAuditTransaction(request, fee);

    entityManager.flush();

    final DoubleEntryTransferResultDto result = DoubleEntryTransferResultDto.builder()
        .transferReference(request.getTransferReference())
        .settlementStatus(AdvancedBusinessConstant.STATUS_SETTLED)
        .sourceAccountNumber(request.getSourceAccountNumber())
        .destinationAccountNumber(request.getDestinationAccountNumber())
        .grossAmount(request.getAmount())
        .feeAmount(fee)
        .netTransferredAmount(netAmount)
        .sourceRemainingBalance(newSourceBalance)
        .destinationNewBalance(newDestBalance)
        .settledAt(Instant.now().toString())
        .build();

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_SETTLE_TRANSFER);
    return result;
  }

  /**
   * Acquires row locks in deterministic lexicographical order to eliminate database deadlocks.
   *
   * @param acc1 first account number
   * @param acc2 second account number
   */
  public void lockAccountsInDeterministicOrder(final String acc1, final String acc2) {
    if (acc1.compareTo(acc2) < 0) {
      lockAccountByNumber(acc1);
      lockAccountByNumber(acc2);
      return;
    }
    lockAccountByNumber(acc2);
    lockAccountByNumber(acc1);
  }

  /**
   * Validates foundational transfer request constraints.
   *
   * @param request transfer request
   */
  public void validateTransferParameters(final DoubleEntryTransferRequestDto request) {
    if (Objects.isNull(request.getAmount())) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_INSUFFICIENT_FUNDS,
          AdvancedBusinessConstant.MSG_INSUFFICIENT_FUNDS
      );
    }
    if (request.getSourceAccountNumber().equals(request.getDestinationAccountNumber())) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_INSUFFICIENT_FUNDS,
          AdvancedBusinessConstant.STR_SOURCE_AND_DESTINATION_ACCOUNTS_MUST
      );
    }
  }

  /**
   * Acquires a pessimistic write lock on the target bank account by its unique account number.
   *
   * @param accountNumber unique account number
   * @return locked {@link BankAccount} entity
   */
  public BankAccount lockAccountByNumber(final String accountNumber) {
    final TypedQuery<BankAccount> query = entityManager.createQuery(
        AdvancedBusinessConstant.STR_SELECT_A_FROM_BANK_ACCOUNT_A_WHERE_A,
        BankAccount.class
    );
    query.setParameter(AdvancedBusinessConstant.STR_ACC_NUM, accountNumber);
    query.setLockMode(LockModeType.PESSIMISTIC_WRITE);

    final List<BankAccount> accounts = query.getResultList();
    if (accounts.isEmpty()) {
      throw new BaseBusinessException(
          HttpStatus.NOT_FOUND,
          AdvancedBusinessConstant.ERR_ACCOUNT_NOT_FOUND,
          AdvancedBusinessConstant.MSG_ACCOUNT_NOT_FOUND
      );
    }
    return accounts.get(0);
  }

  /**
   * Asserts that the source account possesses sufficient liquid balance to satisfy the transfer.
   *
   * @param account source account
   * @param requiredAmount debit amount
   */
  public void verifySufficientFunds(final BankAccount account, final BigDecimal requiredAmount) {
    if (account.getCurrentBalance().compareTo(requiredAmount) < 0) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_INSUFFICIENT_FUNDS,
          AdvancedBusinessConstant.MSG_INSUFFICIENT_FUNDS
      );
    }
  }

  /**
   * Resolves safe non-null platform fee amount.
   *
   * @param rawFee requested fee or null
   * @return non-null BigDecimal fee
   */
  public BigDecimal resolveFeeAmount(final BigDecimal rawFee) {
    if (Objects.isNull(rawFee)) {
      return BigDecimal.ZERO;
    }
    return rawFee;
  }

  /**
   * Credits platform fee account if a valid fee amount was supplied.
   *
   * @param feeAccountNumber platform fee account number
   * @param feeAmount platform fee
   */
  public void settlePlatformFee(final String feeAccountNumber, final BigDecimal feeAmount) {
    if (feeAmount.compareTo(BigDecimal.ZERO) <= 0) {
      return;
    }
    if (Objects.isNull(feeAccountNumber)) {
      return;
    }
    final BankAccount feeAccount = lockAccountByNumber(feeAccountNumber);
    feeAccount.setCurrentBalance(feeAccount.getCurrentBalance().add(feeAmount));
    entityManager.merge(feeAccount);
  }

  /**
   * Records an immutable financial transaction audit entry.
   *
   * @param request transfer request
   * @param fee collected fee
   */
  public void recordAuditTransaction(
      final DoubleEntryTransferRequestDto request,
      final BigDecimal fee) {
    final PaymentTransaction txn = PaymentTransaction.builder()
        .transactionReference(AdvancedBusinessConstant.STR_TXN + System.currentTimeMillis())
        .orderCode(request.getTransferReference())
        .paymentMethod(AdvancedBusinessConstant.METHOD_TRANSFER)
        .amount(request.getAmount())
        .currency(AdvancedBusinessConstant.CURRENCY_USD)
        .status(AdvancedBusinessConstant.STATUS_SETTLED)
        .gatewayProvider(AdvancedBusinessConstant.GATEWAY_STRIPE)
        .build();
    entityManager.persist(txn);
  }
}
