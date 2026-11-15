package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.implementation.entity.SubscriptionContract;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.PolicyConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Enterprise integration test suite verifying the Natural-Language Declarative Business Policy engine.
 * Confirms that developers can customize full lifecycle workflows, RBAC authorization, and field masking
 * using plain human-readable English sentences without procedural boilerplate.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class HumanLanguageCustomizationIntegrationTest {

  @Autowired
  public MockMvc mockMvc;

  @Autowired
  public ObjectMapper objectMapper;

  @Autowired
  public JwtTokenProviderHelper jwtTokenProviderHelper;

  public String adminToken;
  public String userToken;
  public String superAdminToken;

  @BeforeEach
  public void setUp() {
    adminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenProviderHelper.generateToken(
        "admin.contract.manager",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_OPERATOR)
    );
    userToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenProviderHelper.generateToken(
        "subscriber.john",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );
    superAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenProviderHelper.generateToken(
        "superadmin.counsel",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_SUPER_ADMIN, RoleConstant.ROLE_ADMIN)
    );
  }

  @Test
  @DisplayName("HumanPolicy: verifies plain English lifecycle, policy summary, and deletion safeguard")
  public void subscriptionContract_NaturalLanguagePolicy_EnforcesLifecycleAndSecurity() throws Exception {
    // 1. Inspect live human-readable policy summary generated from plain English sentences
    final MvcResult summaryResult = mockMvc.perform(get("/api/v1/subscription-contracts" + PolicyConstant.PATH_POLICY_SUMMARY)
            .header(HttpHeaders.AUTHORIZATION, adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.entityName").value("SubscriptionContract"))
        .andExpect(jsonPath("$.data.lifecycleSummary").value(org.hamcrest.Matchers.containsString("DRAFT")))
        .andReturn();

    final String summaryBody = summaryResult.getResponse().getContentAsString();
    assertThat(summaryBody).contains("DRAFT");
    assertThat(summaryBody).contains("ACTIVE");

    // 2. Create subscription contract without specifying status - engine initializes to 'DRAFT' based on 'Starts at DRAFT'
    final SubscriptionContract contract = SubscriptionContract.builder()
        .subscriberName("Enterprise Cloud Corp")
        .subscriberEmail("procurement@enterprisecloud.com")
        .subscriptionTier("PLATINUM_TIER")
        .recurringAmount(new BigDecimal("4999.00"))
        .billingPeriod("ANNUAL")
        .clientTaxNumber("US-EIN-987654321")
        .build();

    final MvcResult createResult = mockMvc.perform(post("/api/v1/subscription-contracts")
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(contract)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.contractCode").value(org.hamcrest.Matchers.startsWith("SUB-")))
        .andExpect(jsonPath("$.data.contractStatus").value("DRAFT"))
        .andReturn();

    final JsonNode createdJson = objectMapper.readTree(createResult.getResponse().getContentAsString()).path("data");
    final String contractId = createdJson.path("id").asText();

    // 3. Permitted transition: DRAFT -> ACTIVE
    final SubscriptionContract updatePayload = contract.toBuilder()
        .contractStatus("ACTIVE")
        .build();

    mockMvc.perform(put("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updatePayload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.contractStatus").value("ACTIVE"));

    // 4. Deletion safeguard: Attempting to delete when status is 'ACTIVE' must be blocked with HTTP 422
    // ('Allow deletion only when DRAFT or CANCELLED.')
    mockMvc.perform(delete("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, superAdminToken))
        .andExpect(status().isUnprocessableEntity());

    // 5. Illegal transition: from ACTIVE directly to EXPIRED (permitted only SUSPENDED or EXPIRED)
    // Attempting invalid transition like ACTIVE -> DRAFT must be blocked
    final SubscriptionContract invalidTransitionPayload = contract.toBuilder()
        .contractStatus("DRAFT")
        .build();

    mockMvc.perform(put("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidTransitionPayload)))
        .andExpect(status().isUnprocessableEntity());

    // 6. Transition to CANCELLED via SUSPENDED: ACTIVE -> SUSPENDED -> CANCELLED
    final SubscriptionContract suspendPayload = contract.toBuilder()
        .contractStatus("SUSPENDED")
        .build();

    mockMvc.perform(put("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(suspendPayload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.contractStatus").value("SUSPENDED"));

    final SubscriptionContract cancelPayload = contract.toBuilder()
        .contractStatus("CANCELLED")
        .build();

    mockMvc.perform(put("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(cancelPayload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.contractStatus").value("CANCELLED"));

    // 7. Deletion now succeeds because state is CANCELLED ('Allow deletion only when DRAFT or CANCELLED.')
    mockMvc.perform(delete("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, superAdminToken))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("HumanPolicy: verifies field masking nullifies tax number and restricts sensitive data")
  public void subscriptionContract_NaturalLanguageMasking_ProtectsSensitiveFields() throws Exception {
    final SubscriptionContract contract = SubscriptionContract.builder()
        .subscriberName("Tokyo Fintech Labs")
        .subscriberEmail("contact@tokyofintech.jp")
        .subscriptionTier("GOLD_TIER")
        .recurringAmount(new BigDecimal("1200.00"))
        .billingPeriod("MONTHLY")
        .clientTaxNumber("JP-CORPORATE-12345")
        .build();

    final MvcResult createResult = mockMvc.perform(post("/api/v1/subscription-contracts")
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(contract)))
        .andExpect(status().isCreated())
        .andReturn();

    final String contractId = objectMapper.readTree(createResult.getResponse().getContentAsString()).path("data").path("id").asText();

    // Query as regular USER -> clientTaxNumber must be masked / nullified ('Nullify clientTaxNumber for non-ADMIN.')
    mockMvc.perform(get("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, userToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.subscriberName").value("Tokyo Fintech Labs"))
        .andExpect(jsonPath("$.data.clientTaxNumber").doesNotExist());

    // Query as ADMIN -> full unmasked clientTaxNumber is visible
    mockMvc.perform(get("/api/v1/subscription-contracts/" + contractId)
            .header(HttpHeaders.AUTHORIZATION, adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.clientTaxNumber").value("JP-CORPORATE-12345"));
  }
}

