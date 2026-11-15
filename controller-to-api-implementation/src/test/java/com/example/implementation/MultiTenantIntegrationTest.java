package com.example.implementation;

import com.example.implementation.entity.SubscriptionContract;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.constant.TenantConstant;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import java.math.BigDecimal;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * Enterprise integration tests validating SaaS Multi-Tenant Isolation SPI.
 *
 * <p>Confirms that tenant boundaries are strictly respected during dynamic proxy
 * queries, creations, and cross-tenant isolation checks.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class MultiTenantIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  /**
   * Verifies that creating an entity automatically injects the tenant identifier from the HTTP request,
   * and queries are segregated so Tenant-A cannot see Tenant-B records.
   */
  @Test
  @DisplayName("Verify strict SaaS Multi-Tenant data isolation across dynamic controller proxies")
  public void testMultiTenantDataIsolation() throws Exception {
    final String operatorToken = jwtTokenProviderHelper.generateToken(
        "operator-user",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_OPERATOR, RoleConstant.ROLE_ADMIN)
    );

    // 1. Create a contract under Tenant Alpha
    final String tenantAlphaPayload = """
        {
          "subscriberName": "Alpha Corp",
          "subscriberEmail": "billing@alpha.com",
          "subscriptionTier": "ENTERPRISE",
          "recurringAmount": 999.00,
          "billingPeriod": "MONTHLY"
        }
        """;

    mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/subscription-contracts")
            .header("Authorization", "Bearer " + operatorToken)
            .header(TenantConstant.HEADER_TENANT_ID, "tenant-alpha")
            .contentType(MediaType.APPLICATION_JSON)
            .content(tenantAlphaPayload))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.tenantId").value("tenant-alpha"));

    // 2. Create a contract under Tenant Beta
    final String tenantBetaPayload = """
        {
          "subscriberName": "Beta LLC",
          "subscriberEmail": "billing@beta.com",
          "subscriptionTier": "STANDARD",
          "recurringAmount": 199.00,
          "billingPeriod": "YEARLY"
        }
        """;

    mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/subscription-contracts")
            .header("Authorization", "Bearer " + operatorToken)
            .header(TenantConstant.HEADER_TENANT_ID, "tenant-beta")
            .contentType(MediaType.APPLICATION_JSON)
            .content(tenantBetaPayload))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.tenantId").value("tenant-beta"));

    // 3. Query as Tenant Alpha -> Must ONLY see Alpha Corp
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/subscription-contracts")
            .header("Authorization", "Bearer " + operatorToken)
            .header(TenantConstant.HEADER_TENANT_ID, "tenant-alpha"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Alpha Corp')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Beta LLC')]").doesNotExist());

    // 4. Query as Tenant Beta -> Must ONLY see Beta LLC
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/subscription-contracts")
            .header("Authorization", "Bearer " + operatorToken)
            .header(TenantConstant.HEADER_TENANT_ID, "tenant-beta"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Beta LLC')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Alpha Corp')]").doesNotExist());

    // 5. Query as SUPER_ADMIN -> Can bypass tenant filter and see across tenants
    final String superAdminToken = jwtTokenProviderHelper.generateToken(
        "super-admin-user",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_SUPER_ADMIN, RoleConstant.ROLE_ADMIN)
    );

    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/subscription-contracts")
            .header("Authorization", "Bearer " + superAdminToken)
            .header(TenantConstant.HEADER_TENANT_ID, "tenant-alpha"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Alpha Corp')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.subscriberName == 'Beta LLC')]").exists());
  }
}

