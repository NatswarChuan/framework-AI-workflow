package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.DoubleEntryTransferRequestDto;
import com.example.implementation.entity.BankAccount;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Integration test suite verifying the financial double-entry ledger fund transfer engine.
 * Covers happy-path settlements, zero-deficit overdraft protection, and high-concurrency race condition elimination.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
class DoubleEntryLedgerIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private EntityManager entityManager;

  @Autowired
  private TransactionTemplate transactionTemplate;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProvider;

  private String jwtToken;

  @BeforeEach
  void setUp() {
    jwtToken = "Bearer " + jwtTokenProvider.generateToken(
        "fintech-auditor",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );
  }

  @Test
  @DisplayName("Should settle single double-entry transfer with platform fee credit and balance conservation")
  void testDoubleEntryTransfer_HappyPathSettlement() throws Exception {
    final String sourceAccNum = "ACC-SRC-" + System.currentTimeMillis();
    final String destAccNum = "ACC-DST-" + System.currentTimeMillis();
    final String feeAccNum = "ACC-FEE-" + System.currentTimeMillis();

    transactionTemplate.executeWithoutResult(status -> {
      final BankAccount src = BankAccount.builder()
          .accountNumber(sourceAccNum)
          .accountHolderName("Source User")
          .ibanRoutingNumber("IBAN-SRC-" + System.currentTimeMillis())
          .accountType("CHECKING")
          .currentBalance(new BigDecimal("1000.00"))
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      final BankAccount dst = BankAccount.builder()
          .accountNumber(destAccNum)
          .accountHolderName("Destination User")
          .ibanRoutingNumber("IBAN-DST-" + System.currentTimeMillis())
          .accountType("SAVINGS")
          .currentBalance(new BigDecimal("200.00"))
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      final BankAccount fee = BankAccount.builder()
          .accountNumber(feeAccNum)
          .accountHolderName("Platform Fee Collector")
          .ibanRoutingNumber("IBAN-FEE-" + System.currentTimeMillis())
          .accountType("CORPORATE")
          .currentBalance(BigDecimal.ZERO)
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      entityManager.persist(src);
      entityManager.persist(dst);
      entityManager.persist(fee);
      entityManager.flush();
    });

    final DoubleEntryTransferRequestDto request = DoubleEntryTransferRequestDto.builder()
        .sourceAccountNumber(sourceAccNum)
        .destinationAccountNumber(destAccNum)
        .platformFeeAccountNumber(feeAccNum)
        .amount(new BigDecimal("300.00"))
        .feeAmount(new BigDecimal("15.00"))
        .transferReference("TXN-REF-HAPPY-01")
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/wallet/transfer")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.settlementStatus").value(AdvancedBusinessConstant.STATUS_SETTLED))
        .andExpect(jsonPath("$.data.grossAmount").value(300.00))
        .andExpect(jsonPath("$.data.feeAmount").value(15.00))
        .andExpect(jsonPath("$.data.netTransferredAmount").value(285.00))
        .andExpect(jsonPath("$.data.sourceRemainingBalance").value(700.00))
        .andExpect(jsonPath("$.data.destinationNewBalance").value(485.00));
  }

  @Test
  @DisplayName("Should reject transfer when source account has insufficient funds (Zero-Deficit Guarantee)")
  void testDoubleEntryTransfer_InsufficientFunds() throws Exception {
    final String sourceAccNum = "ACC-LOW-" + System.currentTimeMillis();
    final String destAccNum = "ACC-DST2-" + System.currentTimeMillis();

    transactionTemplate.executeWithoutResult(status -> {
      final BankAccount src = BankAccount.builder()
          .accountNumber(sourceAccNum)
          .accountHolderName("Low Balance User")
          .ibanRoutingNumber("IBAN-LOW-" + System.currentTimeMillis())
          .accountType("CHECKING")
          .currentBalance(new BigDecimal("50.00"))
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      final BankAccount dst = BankAccount.builder()
          .accountNumber(destAccNum)
          .accountHolderName("Destination User")
          .ibanRoutingNumber("IBAN-DST2-" + System.currentTimeMillis())
          .accountType("SAVINGS")
          .currentBalance(new BigDecimal("100.00"))
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      entityManager.persist(src);
      entityManager.persist(dst);
      entityManager.flush();
    });

    final DoubleEntryTransferRequestDto request = DoubleEntryTransferRequestDto.builder()
        .sourceAccountNumber(sourceAccNum)
        .destinationAccountNumber(destAccNum)
        .amount(new BigDecimal("500.00"))
        .feeAmount(BigDecimal.ZERO)
        .transferReference("TXN-REF-OVERDRAFT")
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/wallet/transfer")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_INSUFFICIENT_FUNDS));
  }

  @Test
  @DisplayName("Should eliminate overdraft under 10 concurrent transfer attempts: exactly 2 succeed, 8 rejected")
  void testDoubleEntryTransfer_ExtremeConcurrency_EliminatesOverdraft() throws Exception {
    final String sourceAccNum = "ACC-CONC-SRC-" + System.currentTimeMillis();
    final String destAccNum = "ACC-CONC-DST-" + System.currentTimeMillis();

    transactionTemplate.executeWithoutResult(status -> {
      final BankAccount src = BankAccount.builder()
          .accountNumber(sourceAccNum)
          .accountHolderName("High Concurrency User")
          .ibanRoutingNumber("IBAN-CONC-" + System.currentTimeMillis())
          .accountType("CHECKING")
          .currentBalance(new BigDecimal("1000.00"))
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      final BankAccount dst = BankAccount.builder()
          .accountNumber(destAccNum)
          .accountHolderName("Recipient")
          .ibanRoutingNumber("IBAN-CONC2-" + System.currentTimeMillis())
          .accountType("SAVINGS")
          .currentBalance(BigDecimal.ZERO)
          .currency(AdvancedBusinessConstant.CURRENCY_USD)
          .status("ACTIVE")
          .build();
      entityManager.persist(src);
      entityManager.persist(dst);
      entityManager.flush();
    });

    final int totalThreads = 10;
    final ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
    final CountDownLatch startLatch = new CountDownLatch(1);
    final CountDownLatch doneLatch = new CountDownLatch(totalThreads);
    final AtomicInteger successCount = new AtomicInteger(0);
    final AtomicInteger failureCount = new AtomicInteger(0);

    for (int i = 0; i < totalThreads; i++) {
      final int idx = i;
      executor.submit(() -> {
        try {
          startLatch.await();
          final DoubleEntryTransferRequestDto request = DoubleEntryTransferRequestDto.builder()
              .sourceAccountNumber(sourceAccNum)
              .destinationAccountNumber(destAccNum)
              .amount(new BigDecimal("400.00"))
              .feeAmount(BigDecimal.ZERO)
              .transferReference("TXN-CONC-" + idx)
              .build();

          final int httpStatus = mockMvc.perform(post("/api/v1/advanced-business/wallet/transfer")
                  .header(HttpHeaders.AUTHORIZATION, jwtToken)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(request)))
              .andReturn()
              .getResponse()
              .getStatus();

          if (httpStatus == 200) {
            successCount.incrementAndGet();
          } else {
            failureCount.incrementAndGet();
          }
        } catch (Exception ex) {
          failureCount.incrementAndGet();
        } finally {
          doneLatch.countDown();
        }
      });
    }

    startLatch.countDown();
    final boolean completed = doneLatch.await(15, TimeUnit.SECONDS);
    executor.shutdown();

    assertThat(completed).isTrue();
    assertThat(successCount.get()).isEqualTo(2);
    assertThat(failureCount.get()).isEqualTo(8);

    transactionTemplate.executeWithoutResult(status -> {
      final BankAccount finalSrc = entityManager.createQuery(
          "SELECT a FROM BankAccount a WHERE a.accountNumber = :accNum",
          BankAccount.class
      ).setParameter("accNum", sourceAccNum).getSingleResult();

      final BankAccount finalDst = entityManager.createQuery(
          "SELECT a FROM BankAccount a WHERE a.accountNumber = :accNum",
          BankAccount.class
      ).setParameter("accNum", destAccNum).getSingleResult();

      assertThat(finalSrc.getCurrentBalance()).isEqualByComparingTo(new BigDecimal("200.00"));
      assertThat(finalDst.getCurrentBalance()).isEqualByComparingTo(new BigDecimal("800.00"));
    });
  }
}
