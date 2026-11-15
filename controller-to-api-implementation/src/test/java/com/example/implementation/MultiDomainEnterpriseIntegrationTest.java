package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Multi-domain enterprise integration tests proving that the Spring-NWVMC framework
 * operates universally across Healthcare (EHR/Clinical) and FinTech (Banking/Lending).
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest(classes = ApiImplementationApplication.class)
@AutoConfigureMockMvc
public class MultiDomainEnterpriseIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Healthcare Domain: EHR Patient Onboarding, HIPAA FieldSecurity Masking, and State Machine")
  public void healthcareScenario_EhrPatientMaskingAndAppointmentStateMachine_Succeeds() throws Exception {
    final String operatorToken = jwtTokenService.generateToken("clinic.operator", "USER-OP-01", Set.of(RoleConstant.ROLE_OPERATOR));
    final String adminToken = jwtTokenService.generateToken("health.admin", "USER-ADM-01", Set.of(RoleConstant.ROLE_ADMIN));
    final String patientToken = jwtTokenService.generateToken("patient.user", "USER-PAT-01", Set.of(RoleConstant.ROLE_USER));

    // 1. Create Patient Record as Clinic Operator
    final Map<String, Object> patientPayload = new HashMap<>();
    patientPayload.put("fullName", "Dr. Alexander Fleming");
    patientPayload.put("nationalHealthId", "NID-EHR-889911");
    patientPayload.put("dateOfBirth", "1881-08-06");
    patientPayload.put("gender", "MALE");
    patientPayload.put("bloodType", "O-POS");
    patientPayload.put("medicalHistorySummary", "Penicillin allergy none; hypertension stage 1.");
    patientPayload.put("diagnosisNotes", "Routine health examination passed.");
    patientPayload.put("active", true);

    final MvcResult createPatientResult = mockMvc.perform(
        post(ImplementationTestConstant.PATIENTS_API)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(patientPayload))
    )
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.data.medicalRecordNumber").value(org.hamcrest.Matchers.startsWith("MRN-")))
    .andExpect(jsonPath("$.data.fullName").value("Dr. Alexander Fleming"))
    .andReturn();

    final String patientId = extractId(createPatientResult);

    // 2. Admin inspects patient record -> sees sensitive PHI
    mockMvc.perform(
        get(ImplementationTestConstant.PATIENTS_API + "/" + patientId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.bloodType").value("O-POS"))
    .andExpect(jsonPath("$.data.diagnosisNotes").value("Routine health examination passed."));

    // 3. Regular Consumer (ROLE_USER) inspects patient record -> @FieldSecurity masks PHI
    mockMvc.perform(
        get(ImplementationTestConstant.PATIENTS_API + "/" + patientId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + patientToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.bloodType").doesNotExist())
    .andExpect(jsonPath("$.data.diagnosisNotes").doesNotExist());

    // 4. Clinical Appointment Lifecycle with State Machine
    final Map<String, Object> aptPayload = new HashMap<>();
    aptPayload.put("patientId", patientId);
    aptPayload.put("patientName", "Dr. Alexander Fleming");
    aptPayload.put("physicianName", "Dr. Gregory House");
    aptPayload.put("departmentName", "Internal Medicine");
    aptPayload.put("scheduledTime", "2026-12-01 10:00:00");
    aptPayload.put("chiefComplaint", "Annual health review");
    aptPayload.put("appointmentStatus", "REQUESTED");

    final MvcResult aptResult = mockMvc.perform(
        post(ImplementationTestConstant.CLINICAL_APPOINTMENTS_API)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(aptPayload))
    )
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.data.appointmentCode").value(org.hamcrest.Matchers.startsWith("APT-")))
    .andExpect(jsonPath("$.data.appointmentStatus").value("REQUESTED"))
    .andReturn();

    final String aptId = extractId(aptResult);

    // Transition: REQUESTED -> CONFIRMED -> CHECKED_IN
    mockMvc.perform(
        post(ImplementationTestConstant.CLINICAL_APPOINTMENTS_API + "/" + aptId + "/transition?targetState=CONFIRMED")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.appointmentStatus").value("CONFIRMED"));

    mockMvc.perform(
        post(ImplementationTestConstant.CLINICAL_APPOINTMENTS_API + "/" + aptId + "/transition?targetState=CHECKED_IN")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.appointmentStatus").value("CHECKED_IN"));

    // Safeguard: Attempting to delete appointment while CHECKED_IN must fail with 422
    mockMvc.perform(
        delete(ImplementationTestConstant.CLINICAL_APPOINTMENTS_API + "/" + aptId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isUnprocessableEntity());
  }

  @Test
  @DisplayName("FinTech Domain: Core Banking Atomic Ledger Adjustments, Tax ID Masking, and Loan Underwriting")
  public void finTechScenario_CoreBankingLedgerAndLoanUnderwriting_Succeeds() throws Exception {
    final String operatorToken = jwtTokenService.generateToken("bank.teller", "USER-BNK-01", Set.of(RoleConstant.ROLE_OPERATOR));
    final String adminToken = jwtTokenService.generateToken("risk.manager", "USER-RSK-01", Set.of(RoleConstant.ROLE_ADMIN));
    final String customerToken = jwtTokenService.generateToken("bank.customer", "USER-CST-01", Set.of(RoleConstant.ROLE_USER));

    // 1. Create Bank Account as Operator
    final Map<String, Object> accountPayload = new HashMap<>();
    accountPayload.put("accountHolderName", "Satoshi Nakamoto");
    accountPayload.put("ibanRoutingNumber", "IBAN-GLOBAL-99887766");
    accountPayload.put("accountType", "CHECKING");
    accountPayload.put("currentBalance", new BigDecimal("50000.00"));
    accountPayload.put("currency", "USD");
    accountPayload.put("taxIdentifier", "TAX-SSN-9988-77");
    accountPayload.put("status", "ACTIVE");

    final MvcResult accountResult = mockMvc.perform(
        post(ImplementationTestConstant.BANK_ACCOUNTS_API)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(accountPayload))
    )
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.data.accountNumber").value(org.hamcrest.Matchers.startsWith("ACC-")))
    .andReturn();

    final String accountId = extractId(accountResult);

    // 2. Atomic Balance Adjustment via PATCH /increment
    mockMvc.perform(
        patch(ImplementationTestConstant.BANK_ACCOUNTS_API + "/" + accountId + "/increment?field=currentBalance&delta=15000.00")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.currentBalance").value(65000.0));

    // 3. Tax ID Masking: Admin sees Tax ID, regular customer sees masked null
    mockMvc.perform(
        get(ImplementationTestConstant.BANK_ACCOUNTS_API + "/" + accountId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.taxIdentifier").value("TAX-SSN-9988-77"));

    mockMvc.perform(
        get(ImplementationTestConstant.BANK_ACCOUNTS_API + "/" + accountId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + customerToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.taxIdentifier").doesNotExist());

    // 4. Commercial Loan Origination State Machine
    final Map<String, Object> loanPayload = new HashMap<>();
    loanPayload.put("applicantName", "Satoshi Nakamoto");
    loanPayload.put("applicantEmail", "satoshi@enterprise.crypto");
    loanPayload.put("principalAmount", new BigDecimal("250000.00"));
    loanPayload.put("interestRate", new BigDecimal("5.75"));
    loanPayload.put("termMonths", 36);
    loanPayload.put("creditScore", 820);
    loanPayload.put("loanStatus", "SUBMITTED");

    final MvcResult loanResult = mockMvc.perform(
        post(ImplementationTestConstant.LOAN_APPLICATIONS_API)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loanPayload))
    )
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.data.loanReferenceCode").value(org.hamcrest.Matchers.startsWith("LOAN-")))
    .andExpect(jsonPath("$.data.loanStatus").value("SUBMITTED"))
    .andReturn();

    final String loanId = extractId(loanResult);

    // Transition State Machine: SUBMITTED -> UNDERWRITING -> RISK_ASSESSED -> APPROVED -> DISBURSED
    mockMvc.perform(
        post(ImplementationTestConstant.LOAN_APPLICATIONS_API + "/" + loanId + "/transition?targetState=UNDERWRITING")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + operatorToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.loanStatus").value("UNDERWRITING"));

    mockMvc.perform(
        post(ImplementationTestConstant.LOAN_APPLICATIONS_API + "/" + loanId + "/transition?targetState=RISK_ASSESSED")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.loanStatus").value("RISK_ASSESSED"));

    mockMvc.perform(
        post(ImplementationTestConstant.LOAN_APPLICATIONS_API + "/" + loanId + "/transition?targetState=APPROVED")
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.data.loanStatus").value("APPROVED"));

    // Safeguard: Attempting to delete loan application while APPROVED must fail with 422
    mockMvc.perform(
        delete(ImplementationTestConstant.LOAN_APPLICATIONS_API + "/" + loanId)
            .header(HttpHeaders.AUTHORIZATION, SecurityConstant.TOKEN_PREFIX_BEARER + adminToken)
    )
    .andExpect(status().isUnprocessableEntity());
  }

  public String extractId(final MvcResult mvcResult) throws Exception {
    final String content = mvcResult.getResponse().getContentAsString();
    final Map<?, ?> body = objectMapper.readValue(content, Map.class);
    final Map<?, ?> data = (Map<?, ?>) body.get("data");
    assertThat(data).isNotNull();
    return String.valueOf(data.get("id"));
  }
}

