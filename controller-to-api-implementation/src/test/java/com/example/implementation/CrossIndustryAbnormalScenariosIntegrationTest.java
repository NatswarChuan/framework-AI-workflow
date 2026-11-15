package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.ClinicalAppointmentBookingRequestDto;
import com.example.implementation.dto.LoanDisbursementRequestDto;
import com.example.implementation.dto.MultiWarehouseAllocationRequestDto;
import com.example.implementation.dto.SubscriptionPlanChangeRequestDto;
import com.example.implementation.entity.ClinicalAppointment;
import com.example.implementation.entity.InventoryStock;
import com.example.implementation.entity.LoanApplication;
import com.example.implementation.entity.SubscriptionContract;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Cross-industry abnormal integration test suite validating real-world edge cases and race conditions:
 * <ul>
 *   <li>Healthcare: Concurrent clinical consultation slot double-booking race condition prevention.</li>
 *   <li>Supply Chain: Multi-warehouse aggregate stock shortfall with cascade atomic rollback.</li>
 *   <li>Supply Chain: Multi-warehouse partial distribution split fulfillment across distinct geographic nodes.</li>
 *   <li>FinTech: Loan disbursement credit score underwriting gate validation.</li>
 *   <li>FinTech: Concurrent double-disbursement race condition elimination with pessimistic locking.</li>
 *   <li>SaaS Billing: Subscription plan modification conflict under active billing synchronization lock.</li>
 *   <li>SaaS Billing: Guard against mutating inactive or cancelled subscription contracts.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CrossIndustryAbnormalScenariosIntegrationTest {

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

  @Autowired
  private com.example.implementation.service.helper.AviationOverbookingCapacityHelper aviationHelper;

  @Autowired
  private com.example.implementation.service.helper.ClinicalPrescriptionDispenseHelper prescriptionHelper;

  @Autowired
  private com.example.implementation.service.helper.IotMachineryEmergencyShutdownHelper iotHelper;

  @Autowired
  private com.example.implementation.service.helper.SimSwapFraudEvaluationHelper simSwapHelper;

  @Autowired
  private com.example.implementation.service.helper.FleetDriverHosComplianceHelper fleetHosHelper;

  private String jwtToken;

  @BeforeEach
  public void setUp() {
    jwtToken = "Bearer " + jwtTokenProvider.generateToken(
        "abnormal-tester",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );
  }

  @Test
  @DisplayName("Healthcare Abnormal 1: 10 concurrent patients booking exact same physician slot -> Exactly 1 succeeds, 9 fail with 409 Conflict")
  public void testHealthcareConcurrentDoubleBookingRaceCondition() throws Exception {
    final String targetDoctor = "Dr. Gregory House";
    final String targetSlot = "2026-12-01 09:00-09:30";
    final int concurrentPatients = 10;
    final CountDownLatch readyLatch = new CountDownLatch(concurrentPatients);
    final CountDownLatch startLatch = new CountDownLatch(1);
    final CountDownLatch doneLatch = new CountDownLatch(concurrentPatients);
    final AtomicInteger successBookings = new AtomicInteger(0);
    final AtomicInteger conflictBookings = new AtomicInteger(0);

    final ExecutorService executor = Executors.newFixedThreadPool(concurrentPatients);

    for (int i = 0; i < concurrentPatients; i = i + 1) {
      final int patientIndex = i;
      executor.submit(() -> {
        readyLatch.countDown();
        try {
          startLatch.await();
          final ClinicalAppointmentBookingRequestDto request = ClinicalAppointmentBookingRequestDto.builder()
              .patientId(UuidUtil.generateUuidV7())
              .patientName("Patient #" + patientIndex)
              .physicianName(targetDoctor)
              .departmentName("Diagnostic Medicine")
              .scheduledTime(targetSlot)
              .chiefComplaint("Acute unexplained symptom complex")
              .build();

          final MvcResult result = mockMvc.perform(post("/api/v1/advanced-business/healthcare/appointment")
                  .header(HttpHeaders.AUTHORIZATION, jwtToken)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(request)))
              .andReturn();

          final int status = result.getResponse().getStatus();
          if (status == 201) {
            successBookings.incrementAndGet();
          }
          if (status == 409) {
            conflictBookings.incrementAndGet();
          }
        } catch (final Exception ex) {
          // Handled via latch counters
        } finally {
          doneLatch.countDown();
        }
      });
    }

    readyLatch.await(10, TimeUnit.SECONDS);
    startLatch.countDown();
    doneLatch.await(20, TimeUnit.SECONDS);
    executor.shutdown();

    assertThat(successBookings.get()).isEqualTo(1);
    assertThat(conflictBookings.get()).isEqualTo(9);

    final Long bookedCount = transactionTemplate.execute(status ->
        entityManager.createQuery(
            "SELECT count(a) FROM ClinicalAppointment a WHERE a.physicianName = :doc AND a.scheduledTime = :slot",
            Long.class
        ).setParameter("doc", targetDoctor).setParameter("slot", targetSlot).getSingleResult()
    );
    assertThat(bookedCount).isEqualTo(1L);
  }

  @Test
  @DisplayName("Supply Chain Abnormal 2: Multi-warehouse allocation shortfall -> Total rollback, 0 units deducted")
  public void testSupplyChainMultiWarehouseShortfallRollback() throws Exception {
    final String sku = "SKU-LOGISTICS-FAIL-" + System.currentTimeMillis();
    final String whNorth = "WH-NORTH-" + System.currentTimeMillis();
    final String whSouth = "WH-SOUTH-" + System.currentTimeMillis();

    transactionTemplate.executeWithoutResult(status -> {
      final InventoryStock stockNorth = InventoryStock.builder()
          .stockSkuCode(sku + "-N")
          .productSkuCode(sku)
          .warehouseCode(whNorth)
          .availableQuantity(10)
          .reservedQuantity(0)
          .build();
      final InventoryStock stockSouth = InventoryStock.builder()
          .stockSkuCode(sku + "-S")
          .productSkuCode(sku)
          .warehouseCode(whSouth)
          .availableQuantity(5)
          .reservedQuantity(0)
          .build();
      entityManager.persist(stockNorth);
      entityManager.persist(stockSouth);
    });

    final MultiWarehouseAllocationRequestDto request = MultiWarehouseAllocationRequestDto.builder()
        .orderReference("ORD-SHORTFALL-001")
        .productSkuCode(sku)
        .requestedQuantity(25)
        .preferredWarehouseCodes(List.of(whNorth, whSouth))
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/logistics/allocate-stock")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_INSUFFICIENT_MULTI_WAREHOUSE_STOCK));

    transactionTemplate.executeWithoutResult(status -> {
      final InventoryStock freshNorth = entityManager.createQuery(
          "SELECT s FROM InventoryStock s WHERE s.warehouseCode = :wh", InventoryStock.class)
          .setParameter("wh", whNorth).getSingleResult();
      final InventoryStock freshSouth = entityManager.createQuery(
          "SELECT s FROM InventoryStock s WHERE s.warehouseCode = :wh", InventoryStock.class)
          .setParameter("wh", whSouth).getSingleResult();

      assertThat(freshNorth.getAvailableQuantity()).isEqualTo(10);
      assertThat(freshNorth.getReservedQuantity()).isEqualTo(0);
      assertThat(freshSouth.getAvailableQuantity()).isEqualTo(5);
      assertThat(freshSouth.getReservedQuantity()).isEqualTo(0);
    });
  }

  @Test
  @DisplayName("Supply Chain Abnormal 3: Multi-warehouse allocation split fulfillment across 2 warehouse nodes")
  public void testSupplyChainMultiWarehouseSplitFulfillment() throws Exception {
    final String sku = "SKU-LOGISTICS-SUCCESS-" + System.currentTimeMillis();
    final String whEast = "WH-EAST-" + System.currentTimeMillis();
    final String whWest = "WH-WEST-" + System.currentTimeMillis();

    transactionTemplate.executeWithoutResult(status -> {
      final InventoryStock stockEast = InventoryStock.builder()
          .stockSkuCode(sku + "-E")
          .productSkuCode(sku)
          .warehouseCode(whEast)
          .availableQuantity(10)
          .reservedQuantity(0)
          .build();
      final InventoryStock stockWest = InventoryStock.builder()
          .stockSkuCode(sku + "-W")
          .productSkuCode(sku)
          .warehouseCode(whWest)
          .availableQuantity(15)
          .reservedQuantity(0)
          .build();
      entityManager.persist(stockEast);
      entityManager.persist(stockWest);
    });

    final MultiWarehouseAllocationRequestDto request = MultiWarehouseAllocationRequestDto.builder()
        .orderReference("ORD-SPLIT-002")
        .productSkuCode(sku)
        .requestedQuantity(16)
        .preferredWarehouseCodes(List.of(whEast, whWest))
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/logistics/allocate-stock")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value(CommonConstant.CODE_SUCCESS))
        .andExpect(jsonPath("$.data.allocationStatus").value(AdvancedBusinessConstant.STATUS_FULLY_ALLOCATED))
        .andExpect(jsonPath("$.data.allocatedQuantity").value(16));

    transactionTemplate.executeWithoutResult(status -> {
      final InventoryStock freshEast = entityManager.createQuery(
          "SELECT s FROM InventoryStock s WHERE s.warehouseCode = :wh", InventoryStock.class)
          .setParameter("wh", whEast).getSingleResult();
      final InventoryStock freshWest = entityManager.createQuery(
          "SELECT s FROM InventoryStock s WHERE s.warehouseCode = :wh", InventoryStock.class)
          .setParameter("wh", whWest).getSingleResult();

      assertThat(freshEast.getAvailableQuantity()).isEqualTo(0);
      assertThat(freshEast.getReservedQuantity()).isEqualTo(10);
      assertThat(freshWest.getAvailableQuantity()).isEqualTo(9);
      assertThat(freshWest.getReservedQuantity()).isEqualTo(6);
    });
  }

  @Test
  @DisplayName("FinTech Lending Abnormal 4: Credit score below underwriting threshold -> 422 Unprocessable Entity")
  public void testFinTechLoanDisbursementCreditScoreGate() throws Exception {
    final UUID loanId = transactionTemplate.execute(status -> {
      final LoanApplication subprimeLoan = LoanApplication.builder()
          .loanReferenceCode("LOAN-SUBPRIME-" + System.currentTimeMillis())
          .applicantName("Risky Applicant")
          .applicantEmail("risky@example.com")
          .principalAmount(new BigDecimal("50000.00"))
          .interestRate(new BigDecimal("12.50"))
          .termMonths(36)
          .creditScore(520)
          .loanStatus(AdvancedBusinessConstant.STATE_LOAN_APPROVED)
          .build();
      entityManager.persist(subprimeLoan);
      return subprimeLoan.getId();
    });

    final LoanDisbursementRequestDto request = LoanDisbursementRequestDto.builder()
        .loanApplicationId(loanId)
        .disbursementAccount("ACC-DISB-SUBPRIME")
        .disbursementAmount(new BigDecimal("50000.00"))
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/lending/disburse")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_LOAN_CREDIT_SCORE_TOO_LOW));
  }

  @Test
  @DisplayName("FinTech Lending Abnormal 5: 10 concurrent disbursement requests -> Exactly 1 succeeds, 9 fail with 409 Conflict")
  public void testFinTechLoanDoubleDisbursementRaceCondition() throws Exception {
    final UUID loanId = transactionTemplate.execute(status -> {
      final LoanApplication primeLoan = LoanApplication.builder()
          .loanReferenceCode("LOAN-PRIME-" + System.currentTimeMillis())
          .applicantName("Creditworthy Applicant")
          .applicantEmail("creditworthy@example.com")
          .principalAmount(new BigDecimal("100000.00"))
          .interestRate(new BigDecimal("5.25"))
          .termMonths(60)
          .creditScore(780)
          .loanStatus(AdvancedBusinessConstant.STATE_LOAN_APPROVED)
          .build();
      entityManager.persist(primeLoan);
      return primeLoan.getId();
    });

    final int concurrentThreads = 10;
    final CountDownLatch readyLatch = new CountDownLatch(concurrentThreads);
    final CountDownLatch startLatch = new CountDownLatch(1);
    final CountDownLatch doneLatch = new CountDownLatch(concurrentThreads);
    final AtomicInteger successDisbursements = new AtomicInteger(0);
    final AtomicInteger conflictDisbursements = new AtomicInteger(0);

    final ExecutorService executor = Executors.newFixedThreadPool(concurrentThreads);

    for (int i = 0; i < concurrentThreads; i = i + 1) {
      executor.submit(() -> {
        readyLatch.countDown();
        try {
          startLatch.await();
          final LoanDisbursementRequestDto request = LoanDisbursementRequestDto.builder()
              .loanApplicationId(loanId)
              .disbursementAccount("ACC-PRIME-DISBURSE")
              .disbursementAmount(new BigDecimal("100000.00"))
              .build();

          final MvcResult result = mockMvc.perform(post("/api/v1/advanced-business/lending/disburse")
                  .header(HttpHeaders.AUTHORIZATION, jwtToken)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(request)))
              .andReturn();

          final int status = result.getResponse().getStatus();
          if (status == 200) {
            successDisbursements.incrementAndGet();
          }
          if (status == 409) {
            conflictDisbursements.incrementAndGet();
          }
        } catch (final Exception ex) {
          // Handled via latch counters
        } finally {
          doneLatch.countDown();
        }
      });
    }

    readyLatch.await(10, TimeUnit.SECONDS);
    startLatch.countDown();
    doneLatch.await(20, TimeUnit.SECONDS);
    executor.shutdown();

    assertThat(successDisbursements.get()).isEqualTo(1);
    assertThat(conflictDisbursements.get()).isEqualTo(9);

    transactionTemplate.executeWithoutResult(status -> {
      final LoanApplication freshLoan = entityManager.find(LoanApplication.class, loanId);
      assertThat(freshLoan.getLoanStatus()).isEqualTo(AdvancedBusinessConstant.STATE_LOAN_DISBURSED);
    });
  }

  @Test
  @DisplayName("SaaS Billing Abnormal 6: Subscription plan modification while billing actively locked -> 409 Conflict")
  public void testSaaSPlanChangeDuringActiveBillingLock() throws Exception {
    final UUID subId = transactionTemplate.execute(status -> {
      final SubscriptionContract contract = SubscriptionContract.builder()
          .contractCode("SUB-LOCKED-" + System.currentTimeMillis())
          .subscriberName("Enterprise Corp")
          .subscriberEmail("enterprise@corp.com")
          .subscriptionTier(AdvancedBusinessConstant.TIER_PRO)
          .recurringAmount(new BigDecimal("499.00"))
          .billingPeriod("MONTHLY")
          .contractStatus(AdvancedBusinessConstant.STATUS_CONTRACT_SUSPENDED)
          .tenantId("tenant-alpha")
          .build();
      entityManager.persist(contract);
      return contract.getId();
    });

    final SubscriptionPlanChangeRequestDto request = SubscriptionPlanChangeRequestDto.builder()
        .subscriptionId(subId)
        .targetTier(AdvancedBusinessConstant.TIER_BASIC)
        .allowProratedRefund(Boolean.TRUE)
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/subscription/change-plan")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_SUBSCRIPTION_BILLING_CONFLICT));
  }

  @Test
  @DisplayName("SaaS Billing Abnormal 7: Mutating cancelled subscription contract -> 422 Unprocessable Entity")
  public void testSaaSCancelledSubscriptionMutationRejected() throws Exception {
    final UUID subId = transactionTemplate.execute(status -> {
      final SubscriptionContract contract = SubscriptionContract.builder()
          .contractCode("SUB-CANCELLED-" + System.currentTimeMillis())
          .subscriberName("Exited User")
          .subscriberEmail("exited@corp.com")
          .subscriptionTier(AdvancedBusinessConstant.TIER_BASIC)
          .recurringAmount(new BigDecimal("99.00"))
          .billingPeriod("MONTHLY")
          .contractStatus(AdvancedBusinessConstant.STATUS_CONTRACT_CANCELLED)
          .tenantId("tenant-beta")
          .build();
      entityManager.persist(contract);
      return contract.getId();
    });

    final SubscriptionPlanChangeRequestDto request = SubscriptionPlanChangeRequestDto.builder()
        .subscriptionId(subId)
        .targetTier(AdvancedBusinessConstant.TIER_ENTERPRISE)
        .allowProratedRefund(Boolean.FALSE)
        .build();

    mockMvc.perform(post("/api/v1/advanced-business/subscription/change-plan")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_SUBSCRIPTION_INACTIVE));
  }

  @Test
  @DisplayName("Aviation Abnormal 8: Extreme concurrency overbooking tolerance gate (Zero Overselling)")
  public void testAviationOverbookingConcurrencyGate() throws Exception {
    final String flightNumber = "VN-OVERBOOK-" + System.currentTimeMillis();
    // Flight capacity is 100, max overbooking is 105. Seed with 103 seats already booked. Exactly 2 seats remaining!
    aviationHelper.seedFlightCount(flightNumber, 103);

    final int threadCount = 10;
    final ExecutorService executor = Executors.newFixedThreadPool(threadCount);
    final CountDownLatch readyLatch = new CountDownLatch(threadCount);
    final CountDownLatch startLatch = new CountDownLatch(1);
    final CountDownLatch doneLatch = new CountDownLatch(threadCount);

    final AtomicInteger successCount = new AtomicInteger(0);
    final AtomicInteger conflictCount = new AtomicInteger(0);

    for (int i = 0; i < threadCount; i++) {
      final int idx = i;
      executor.submit(() -> {
        readyLatch.countDown();
        try {
          startLatch.await();
          final com.example.implementation.dto.FlightSeatReservationRequestDto request =
              com.example.implementation.dto.FlightSeatReservationRequestDto.builder()
                  .flightNumber(flightNumber)
                  .passengerId("Passenger-" + idx)
                  .seatClass("ECONOMY")
                  .build();

          final MvcResult result = mockMvc.perform(post("/api/v1/advanced-business/aviation/reserve-seat")
                  .header(HttpHeaders.AUTHORIZATION, jwtToken)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(objectMapper.writeValueAsString(request)))
              .andReturn();

          if (result.getResponse().getStatus() == 200) {
            successCount.incrementAndGet();
          } else if (result.getResponse().getStatus() == 409) {
            conflictCount.incrementAndGet();
          }
        } catch (Exception ex) {
          // ignore
        } finally {
          doneLatch.countDown();
        }
      });
    }

    readyLatch.await(10, TimeUnit.SECONDS);
    startLatch.countDown();
    doneLatch.await(20, TimeUnit.SECONDS);
    executor.shutdown();

    // Exactly 2 of 10 must succeed, and exactly 8 must be rejected with 409 CONFLICT!
    assertThat(successCount.get()).isEqualTo(2);
    assertThat(conflictCount.get()).isEqualTo(8);
  }

  @Test
  @DisplayName("Healthcare Abnormal 9: Clinical EHR prescription post-dispense legal immutability lock")
  public void testClinicalPrescriptionPostDispenseLock() throws Exception {
    final UUID prescriptionId = UuidUtil.generateUuidV7();
    // Seed as already DISPENSED
    prescriptionHelper.seedStatus(prescriptionId, AdvancedBusinessConstant.STATUS_PRESCRIPTION_DISPENSED);

    // Attempt to modify medication dosage on dispensed prescription
    final com.example.implementation.dto.ClinicalPrescriptionDispenseRequestDto modifyRequest =
        com.example.implementation.dto.ClinicalPrescriptionDispenseRequestDto.builder()
            .prescriptionId(prescriptionId)
            .pharmacistId("PHARM-999")
            .action("MODIFY")
            .proposedDosage("1000mg")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/clinical/dispense")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(modifyRequest)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_CLINICAL_PRESCRIPTION_LOCKED));
  }

  @Test
  @DisplayName("Manufacturing IoT Abnormal 10: Critical sensor vibration anomaly trips autonomous E-Stop lockout")
  public void testIotMachineryEmergencyShutdownLockout() throws Exception {
    final String machineId = "CNC-MILLING-ALPHA-01";
    iotHelper.seedMachineStatus(machineId, AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL);

    // 1. Operational machine accepts normal work order
    final com.example.implementation.dto.IotMachineryTelemetryRequestDto workOrder1 =
        com.example.implementation.dto.IotMachineryTelemetryRequestDto.builder()
            .machineId(machineId)
            .action(AdvancedBusinessConstant.ACTION_DISPATCH_WORK_ORDER)
            .workOrderId("WO-BATCH-1001")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/iot/machinery-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(workOrder1)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.workOrderAccepted").value(true))
        .andExpect(jsonPath("$.data.machineStatus").value(AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL));

    // 2. High-frequency telemetry detects critical vibration anomaly (88.5 mm/s > limit 75.0)
    final com.example.implementation.dto.IotMachineryTelemetryRequestDto telemetryAnomaly =
        com.example.implementation.dto.IotMachineryTelemetryRequestDto.builder()
            .machineId(machineId)
            .action(AdvancedBusinessConstant.ACTION_REPORT_TELEMETRY)
            .vibrationMmPerSec(88.5)
            .temperatureCelsius(62.0)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/iot/machinery-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(telemetryAnomaly)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.eStopTripped").value(true))
        .andExpect(jsonPath("$.data.machineStatus").value(AdvancedBusinessConstant.STATUS_MACHINERY_EMERGENCY_STOPPED));

    // 3. Attempting to dispatch subsequent work order while under E-Stop MUST be rejected with HTTP 423 LOCKED
    final com.example.implementation.dto.IotMachineryTelemetryRequestDto workOrder2 =
        com.example.implementation.dto.IotMachineryTelemetryRequestDto.builder()
            .machineId(machineId)
            .action(AdvancedBusinessConstant.ACTION_DISPATCH_WORK_ORDER)
            .workOrderId("WO-BATCH-1002")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/iot/machinery-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(workOrder2)))
        .andExpect(status().isLocked())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_IOT_EMERGENCY_SHUTDOWN_LOCKED));

    // 4. Supervisor provides authorized clearance token to reset machine
    final com.example.implementation.dto.IotMachineryTelemetryRequestDto clearanceRequest =
        com.example.implementation.dto.IotMachineryTelemetryRequestDto.builder()
            .machineId(machineId)
            .action(AdvancedBusinessConstant.ACTION_MAINTENANCE_CLEARANCE)
            .clearanceToken(AdvancedBusinessConstant.SECURITY_TOKEN_MAINTENANCE_CLEARANCE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/iot/machinery-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(clearanceRequest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.machineStatus").value(AdvancedBusinessConstant.STATUS_MACHINERY_OPERATIONAL));

    // 5. Work order dispatch is restored
    mockMvc.perform(post("/api/v1/advanced-business/iot/machinery-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(workOrder2)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.workOrderAccepted").value(true));
  }

  @Test
  @DisplayName("Telecommunications & FinTech Abnormal 11: 48-hour SIM swap high-risk transfer freeze and biometric KYC unfreeze")
  public void testTelecomSimSwap48HourHighRiskTransferFreeze() throws Exception {
    final String accountId = "ACC-SIM-TEST-001";
    simSwapHelper.seedAccountStatus(accountId, AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL);

    // 1. Telecom reports recent SIM swap 3.5 hours ago
    final com.example.implementation.dto.SimSwapFraudEvaluationRequestDto simSwapEvent =
        com.example.implementation.dto.SimSwapFraudEvaluationRequestDto.builder()
            .accountId(accountId)
            .action(AdvancedBusinessConstant.ACTION_REPORT_SIM_SWAP)
            .hoursSinceSimSwap(3.5)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/telecom/sim-swap-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(simSwapEvent)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.accountStatus").value(AdvancedBusinessConstant.STATUS_ACCOUNT_SIM_SWAPPED))
        .andExpect(jsonPath("$.data.riskLevel").value("CRITICAL"));

    // 2. Low-value transfer of $250 (< $1,000 threshold) is permitted under monitoring
    final com.example.implementation.dto.SimSwapFraudEvaluationRequestDto lowTransfer =
        com.example.implementation.dto.SimSwapFraudEvaluationRequestDto.builder()
            .accountId(accountId)
            .action(AdvancedBusinessConstant.ACTION_TRANSFER_FUNDS)
            .transactionAmount(250.0)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/telecom/sim-swap-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(lowTransfer)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.transactionAllowed").value(true))
        .andExpect(jsonPath("$.data.riskLevel").value("MEDIUM"));

    // 3. High-value transfer of $5,000 (>= $1,000 threshold) MUST be blocked with HTTP 403 FORBIDDEN
    final com.example.implementation.dto.SimSwapFraudEvaluationRequestDto highTransfer =
        com.example.implementation.dto.SimSwapFraudEvaluationRequestDto.builder()
            .accountId(accountId)
            .action(AdvancedBusinessConstant.ACTION_TRANSFER_FUNDS)
            .transactionAmount(5000.0)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/telecom/sim-swap-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(highTransfer)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_FRAUD_SIM_SWAP_HIGH_RISK_FREEZE));

    // 4. User completes biometric video selfie KYC to unfreeze account
    final com.example.implementation.dto.SimSwapFraudEvaluationRequestDto biometricKyc =
        com.example.implementation.dto.SimSwapFraudEvaluationRequestDto.builder()
            .accountId(accountId)
            .action(AdvancedBusinessConstant.ACTION_VERIFY_BIOMETRIC_KYC)
            .verificationToken(AdvancedBusinessConstant.SECURITY_TOKEN_BIOMETRIC_VERIFIED)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/telecom/sim-swap-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(biometricKyc)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.accountStatus").value(AdvancedBusinessConstant.STATUS_ACCOUNT_NORMAL))
        .andExpect(jsonPath("$.data.riskLevel").value("LOW"));

    // 5. High-value transfer of $5,000 is now approved
    mockMvc.perform(post("/api/v1/advanced-business/telecom/sim-swap-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(highTransfer)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.transactionAllowed").value(true))
        .andExpect(jsonPath("$.data.riskLevel").value("LOW"));
  }

  @Test
  @DisplayName("Automotive & Fleet Abnormal 12: FMCSA 11-hour driving limit fatigue lockout and 10-hour rest break reset")
  public void testFleetDriverHos11HourFatigueLockout() throws Exception {
    final String driverId = "DRIVER-TRUCK-88";
    fleetHosHelper.seedDriverStatus(driverId, AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE);

    // 1. Driver logs 8.5 driving hours (< 11.0 limit) -> AVAILABLE
    final com.example.implementation.dto.FleetDriverHosDispatchDto logNormal =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action("LOG_DRIVING")
            .cumulativeDrivingHours(8.5)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(logNormal)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.driverStatus").value(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE));

    // 2. Dispatch load LOAD-801 -> Approved
    final com.example.implementation.dto.FleetDriverHosDispatchDto dispatch1 =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action(AdvancedBusinessConstant.ACTION_DISPATCH_FREIGHT)
            .freightLoadId("LOAD-801")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dispatch1)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.dispatchApproved").value(true));

    // 3. Driver logs 11.5 cumulative driving hours (>= 11.0 limit) -> FATIGUE_REST_REQUIRED
    final com.example.implementation.dto.FleetDriverHosDispatchDto logFatigue =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action("LOG_DRIVING")
            .cumulativeDrivingHours(11.5)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(logFatigue)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.driverStatus").value(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED))
        .andExpect(jsonPath("$.data.complianceViolation").value(true));

    // 4. Attempting to dispatch load LOAD-802 MUST be rejected with HTTP 422 UNPROCESSABLE_ENTITY
    final com.example.implementation.dto.FleetDriverHosDispatchDto dispatch2 =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action(AdvancedBusinessConstant.ACTION_DISPATCH_FREIGHT)
            .freightLoadId("LOAD-802")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dispatch2)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_FLEET_HOS_REGULATORY_VIOLATION));

    // 5. Driver takes insufficient rest break (4.0 hours < 10.0 mandatory) -> Still FATIGUE_REST_REQUIRED
    final com.example.implementation.dto.FleetDriverHosDispatchDto shortRest =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action(AdvancedBusinessConstant.ACTION_RECORD_REST_BREAK)
            .consecutiveRestHours(4.0)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(shortRest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.driverStatus").value(AdvancedBusinessConstant.STATUS_DRIVER_FATIGUE_REST_REQUIRED))
        .andExpect(jsonPath("$.data.complianceViolation").value(true));

    // 6. Driver completes full certified 10.5-hour rest break (>= 10.0) -> AVAILABLE
    final com.example.implementation.dto.FleetDriverHosDispatchDto fullRest =
        com.example.implementation.dto.FleetDriverHosDispatchDto.builder()
            .driverId(driverId)
            .action(AdvancedBusinessConstant.ACTION_RECORD_REST_BREAK)
            .consecutiveRestHours(10.5)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(fullRest)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.driverStatus").value(AdvancedBusinessConstant.STATUS_DRIVER_AVAILABLE))
        .andExpect(jsonPath("$.data.complianceViolation").value(false));

    // 7. Load LOAD-802 dispatch is now approved
    mockMvc.perform(post("/api/v1/advanced-business/fleet/hos-dispatch")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dispatch2)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.dispatchApproved").value(true));
  }

  @Test
  @DisplayName("Cross-Industry Scenario 13: Pharmaceutical Good Distribution Practice (GDP) Vaccine Cold-Chain Lockout & QP Clearance")
  public void testScenario13ColdChainVaccineQuarantineLockoutAndQpClearance() throws Exception {
    final String consignmentId = "CSG-INTEG-VACCINE-" + System.currentTimeMillis();
    final String batchNumber = "BATCH-BNT162B2-INTEG";

    // 1. Ingest normal compliant reading (4.5 C) -> IN_TRANSIT
    final com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto reading1 =
        com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .ambientTemperatureCelsius(4.5)
            .cumulativeExcursionMinutes(0.0)
            .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/cold-chain/vaccine-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(reading1)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.vaccineStatus").value(AdvancedBusinessConstant.STATUS_VACCINE_IN_TRANSIT))
        .andExpect(jsonPath("$.data.quarantineLocked").value(false));

    // 2. Ingest sub-zero freezing excursion (-1.5 C) -> QUARANTINE_LOCKED
    final com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto freezeTrip =
        com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .ambientTemperatureCelsius(-1.5)
            .cumulativeExcursionMinutes(3.0)
            .action(AdvancedBusinessConstant.ACTION_LOG_TEMPERATURE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/cold-chain/vaccine-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(freezeTrip)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.vaccineStatus").value(AdvancedBusinessConstant.STATUS_VACCINE_QUARANTINE_LOCKED))
        .andExpect(jsonPath("$.data.quarantineLocked").value(true));

    // 3. Attempt to release quarantined batch -> Must be rejected with HTTP 412 PRECONDITION_FAILED
    final com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto releaseAttempt =
        com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .action(AdvancedBusinessConstant.ACTION_RELEASE_CONSIGNMENT)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/cold-chain/vaccine-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(releaseAttempt)))
        .andExpect(status().isPreconditionFailed())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_GDP_COLD_CHAIN_TEMPERATURE_EXCURSION));

    // 4. Submit invalid Qualified Person (QP) token -> Must be rejected with HTTP 403 FORBIDDEN
    final com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto badToken =
        com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .action(AdvancedBusinessConstant.ACTION_AUTHORIZE_QA_CLEARANCE)
            .qaInspectionToken("FORGED_QP_TOKEN")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/cold-chain/vaccine-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(badToken)))
        .andExpect(status().isForbidden());

    // 5. Submit valid Qualified Person (QP) token -> Consignment formally RELEASED
    final com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto qpRelease =
        com.example.implementation.dto.ColdChainVaccineTelemetryRequestDto.builder()
            .consignmentId(consignmentId)
            .batchNumber(batchNumber)
            .action(AdvancedBusinessConstant.ACTION_AUTHORIZE_QA_CLEARANCE)
            .qaInspectionToken(AdvancedBusinessConstant.SECURITY_TOKEN_QP_QA_RELEASE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/cold-chain/vaccine-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(qpRelease)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.vaccineStatus").value(AdvancedBusinessConstant.STATUS_VACCINE_RELEASED))
        .andExpect(jsonPath("$.data.quarantineLocked").value(false))
        .andExpect(jsonPath("$.data.releasePermitted").value(true));
  }

  @Test
  @DisplayName("Cross-Industry Scenario 14: Clean Energy Smart Grid Inverter Curtailment Droop & Emergency TSO Override")
  public void testScenario14CleanEnergySmartGridInverterCurtailmentAndTsoOverride() throws Exception {
    final String inverterId = "INV-INTEG-GRID-" + System.currentTimeMillis();

    // 1. Normal telemetry (50.00 Hz) -> ONLINE_GENERATING
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto normalSample =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .farmLocation("Rhine Solar Park")
            .measuredFrequencyHertz(50.00)
            .nominalCapacityMegawatts(100.0)
            .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(normalSample)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.inverterStatus").value(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE))
        .andExpect(jsonPath("$.data.curtailmentActive").value(false))
        .andExpect(jsonPath("$.data.permittedExportMegawatts").value(100.0));

    // 2. Over-frequency droop reading (50.30 Hz) -> CURTAILED_THROTTLED (40 MW)
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto droopSample =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .farmLocation("Rhine Solar Park")
            .measuredFrequencyHertz(50.30)
            .nominalCapacityMegawatts(100.0)
            .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(droopSample)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.inverterStatus").value(AdvancedBusinessConstant.STATUS_GRID_INVERTER_CURTAILED))
        .andExpect(jsonPath("$.data.curtailmentActive").value(true))
        .andExpect(jsonPath("$.data.permittedExportMegawatts").value(40.0));

    // 3. Critical over-frequency surge (50.60 Hz) -> EMERGENCY_TRIPPED (0 MW)
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto tripSample =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .farmLocation("Rhine Solar Park")
            .measuredFrequencyHertz(50.60)
            .nominalCapacityMegawatts(100.0)
            .action(AdvancedBusinessConstant.ACTION_TELEMETRY_SAMPLE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(tripSample)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.inverterStatus").value(AdvancedBusinessConstant.STATUS_GRID_INVERTER_TRIPPED))
        .andExpect(jsonPath("$.data.curtailmentActive").value(true))
        .andExpect(jsonPath("$.data.permittedExportMegawatts").value(0.0));

    // 4. Attempt power export dispatch while tripped -> Must be rejected with HTTP 503 SERVICE_UNAVAILABLE
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto dispatchAttempt =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .requestedExportMegawatts(50.0)
            .action(AdvancedBusinessConstant.ACTION_EXPORT_DISPATCH)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dispatchAttempt)))
        .andExpect(status().isServiceUnavailable())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_GRID_OVER_FREQUENCY_CURTAILMENT));

    // 5. Submit invalid TSO token -> HTTP 403 FORBIDDEN
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto badToken =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .action(AdvancedBusinessConstant.ACTION_OVERRIDE_CURTAILMENT)
            .operatorOverrideToken("FORGED_TSO_TOKEN")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(badToken)))
        .andExpect(status().isForbidden());

    // 6. Submit valid TSO override token -> Restored to ONLINE_GENERATING and dispatch approved
    final com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto tsoOverride =
        com.example.implementation.dto.SmartGridFrequencyTelemetryRequestDto.builder()
            .inverterId(inverterId)
            .action(AdvancedBusinessConstant.ACTION_OVERRIDE_CURTAILMENT)
            .operatorOverrideToken(AdvancedBusinessConstant.SECURITY_TOKEN_GRID_DISPATCH_OVERRIDE)
            .requestedExportMegawatts(85.0)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/smart-grid/frequency-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(tsoOverride)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.inverterStatus").value(AdvancedBusinessConstant.STATUS_GRID_INVERTER_ONLINE))
        .andExpect(jsonPath("$.data.curtailmentActive").value(false))
        .andExpect(jsonPath("$.data.gridExportPermitted").value(true))
        .andExpect(jsonPath("$.data.permittedExportMegawatts").value(85.0));
  }

  @Test
  @DisplayName("Cross-Industry Scenario 15: World Customs Organization & OFAC Sanctions Trade Embargo Lockout (HTTP 451)")
  public void testScenario15CustomsSanctionsEmbargoLockoutAndOfacClearance() throws Exception {
    final String consignmentId = "CSG-CUSTOMS-INTEG-" + System.currentTimeMillis();

    // 1. Ingest compliant German industrial cargo -> DECLARED_PENDING_INSPECTION
    final com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto compliantCargo =
        com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto.builder()
            .consignmentId(consignmentId)
            .originCountryCode("DE")
            .vesselImoNumber("IMO-8881234")
            .harmonizedTariffCode("847130")
            .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/customs/sanctions-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(compliantCargo)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.cargoStatus").value(AdvancedBusinessConstant.STATUS_CARGO_DECLARED))
        .andExpect(jsonPath("$.data.sanctionsEmbargoed").value(false));

    // 2. Sanctioned origin country (North Korea - KP) trips sanctions embargo -> SANCTIONS_EMBARGOED
    final com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto sanctionedCargo =
        com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto.builder()
            .consignmentId(consignmentId)
            .originCountryCode(AdvancedBusinessConstant.SANCTIONED_COUNTRY_NORTH_KOREA)
            .action(AdvancedBusinessConstant.ACTION_CUSTOMS_DECLARATION)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/customs/sanctions-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sanctionedCargo)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.cargoStatus").value(AdvancedBusinessConstant.STATUS_CARGO_SANCTIONS_EMBARGOED))
        .andExpect(jsonPath("$.data.sanctionsEmbargoed").value(true));

    // 3. Attempt port gate-out release on embargoed cargo -> Must be rejected with HTTP 451 UNAVAILABLE_FOR_LEGAL_REASONS
    final com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto releaseAttempt =
        com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto.builder()
            .consignmentId(consignmentId)
            .action(AdvancedBusinessConstant.ACTION_RELEASE_PORT_CARGO)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/customs/sanctions-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(releaseAttempt)))
        .andExpect(status().isUnavailableForLegalReasons())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_CUSTOMS_SANCTIONS_EMBARGO_LOCKOUT));

    // 4. Submit invalid OFAC license token -> Must be rejected with HTTP 403 FORBIDDEN
    final com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto badToken =
        com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto.builder()
            .consignmentId(consignmentId)
            .action(AdvancedBusinessConstant.ACTION_OFAC_SPECIAL_CLEARANCE)
            .specialLicenseToken("FORGED_OFAC_LICENSE")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/customs/sanctions-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(badToken)))
        .andExpect(status().isForbidden());

    // 5. Submit valid certified OFAC trade license token -> CUSTOMS_CLEARED and port release approved
    final com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto ofacClearance =
        com.example.implementation.dto.CustomsSanctionsDeclarationRequestDto.builder()
            .consignmentId(consignmentId)
            .action(AdvancedBusinessConstant.ACTION_OFAC_SPECIAL_CLEARANCE)
            .specialLicenseToken(AdvancedBusinessConstant.SECURITY_TOKEN_OFAC_SPECIAL_LICENSE)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/customs/sanctions-evaluate")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(ofacClearance)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.cargoStatus").value(AdvancedBusinessConstant.STATUS_CARGO_RELEASED))
        .andExpect(jsonPath("$.data.sanctionsEmbargoed").value(false))
        .andExpect(jsonPath("$.data.portReleasePermitted").value(true));
  }

  @Test
  @DisplayName("Cross-Industry Scenario 16: Critical Infrastructure SCADA Radiological Sluice Gate Isolation (HTTP 423)")
  public void testScenario16ScadaEffluentContaminationSluiceGateIsolation() throws Exception {
    final String sluiceGateId = "GATE-SCADA-INTEG-" + System.currentTimeMillis();
    final String facilityId = "PLANT-NUCLEAR-INTEG";

    // 1. Ingest normal compliant telemetry (3.0 NTU, 15.0 Bq/L) -> NORMAL_DISCHARGE_OPEN
    final com.example.implementation.dto.ScadaEffluentTelemetryRequestDto normalTelemetry =
        com.example.implementation.dto.ScadaEffluentTelemetryRequestDto.builder()
            .facilityId(facilityId)
            .sluiceGateId(sluiceGateId)
            .measuredTurbidityNtu(3.0)
            .measuredRadioactivityBql(15.0)
            .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/scada/effluent-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(normalTelemetry)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sluiceGateStatus").value(AdvancedBusinessConstant.STATUS_SLUICE_GATES_NORMAL))
        .andExpect(jsonPath("$.data.emergencyIsolated").value(false))
        .andExpect(jsonPath("$.data.dischargePermitted").value(true));

    // 2. Ingest critical radiological contamination (180.0 Bq/L > 100.0 limit) -> EMERGENCY_SLUICE_ISOLATED
    final com.example.implementation.dto.ScadaEffluentTelemetryRequestDto radiologicalTrip =
        com.example.implementation.dto.ScadaEffluentTelemetryRequestDto.builder()
            .facilityId(facilityId)
            .sluiceGateId(sluiceGateId)
            .measuredTurbidityNtu(4.0)
            .measuredRadioactivityBql(180.0)
            .action(AdvancedBusinessConstant.ACTION_INGEST_TELEMETRY)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/scada/effluent-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(radiologicalTrip)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sluiceGateStatus").value(AdvancedBusinessConstant.STATUS_SLUICE_GATES_ISOLATED))
        .andExpect(jsonPath("$.data.emergencyIsolated").value(true));

    // 3. Attempt municipal effluent discharge while isolated -> Must be rejected with HTTP 423 LOCKED
    final com.example.implementation.dto.ScadaEffluentTelemetryRequestDto dischargeAttempt =
        com.example.implementation.dto.ScadaEffluentTelemetryRequestDto.builder()
            .facilityId(facilityId)
            .sluiceGateId(sluiceGateId)
            .dischargeVolumeGallons(20000.0)
            .action(AdvancedBusinessConstant.ACTION_DISCHARGE_EFFLUENT)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/scada/effluent-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dischargeAttempt)))
        .andExpect(status().isLocked())
        .andExpect(jsonPath("$.code").value(AdvancedBusinessConstant.ERR_SCADA_CONTAMINATION_SLUICE_ISOLATED));

    // 4. Submit invalid EPA token -> HTTP 403 FORBIDDEN
    final com.example.implementation.dto.ScadaEffluentTelemetryRequestDto badToken =
        com.example.implementation.dto.ScadaEffluentTelemetryRequestDto.builder()
            .facilityId(facilityId)
            .sluiceGateId(sluiceGateId)
            .action(AdvancedBusinessConstant.ACTION_EPA_DECONTAMINATION_CLEARANCE)
            .decontaminationCertToken("FORGED_EPA_CERT")
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/scada/effluent-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(badToken)))
        .andExpect(status().isForbidden());

    // 5. Submit valid EPA environmental inspector decontamination certificate -> DECONTAMINATED_CERTIFIED
    final com.example.implementation.dto.ScadaEffluentTelemetryRequestDto epaClearance =
        com.example.implementation.dto.ScadaEffluentTelemetryRequestDto.builder()
            .facilityId(facilityId)
            .sluiceGateId(sluiceGateId)
            .action(AdvancedBusinessConstant.ACTION_EPA_DECONTAMINATION_CLEARANCE)
            .decontaminationCertToken(AdvancedBusinessConstant.SECURITY_TOKEN_EPA_DECONTAMINATION_CERT)
            .build();

    mockMvc.perform(post("/api/v1/advanced-business/scada/effluent-telemetry")
            .header(HttpHeaders.AUTHORIZATION, jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(epaClearance)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sluiceGateStatus").value(AdvancedBusinessConstant.STATUS_SLUICE_GATES_CERTIFIED))
        .andExpect(jsonPath("$.data.emergencyIsolated").value(false))
        .andExpect(jsonPath("$.data.dischargePermitted").value(true));
  }
}

