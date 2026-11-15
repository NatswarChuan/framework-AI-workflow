package com.example.implementation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
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

/**
 * Enterprise Integration Test suite validating custom SQL and MyBatis-equivalent dynamic query
 * capabilities directly through zero-boilerplate dynamic proxy controllers.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest(classes = ApiImplementationApplication.class)
@AutoConfigureMockMvc
public class EnterpriseCustomSqlIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Custom SQL 1: Native SQL with CTE and multi-table aggregation should return mapped DTOs")
  public void testNativeSqlCteAggregationShouldReturnMappedDtos() throws Exception {
    final String adminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "admin-sql-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    // Create a vendor store
    final Map<String, Object> storePayload = new HashMap<>();
    storePayload.put("storeName", "Shibuya Tech Flagship");
    storePayload.put("businessLicense", "BL-SQL-CTE-001");
    storePayload.put("description", "Store for CTE SQL verification");
    storePayload.put("active", Boolean.TRUE);

    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isCreated());

    // Execute Native SQL with CTE
    mockMvc.perform(get(ECommerceConstant.VENDOR_STORES_API + "/reports/revenue-cte")
            .header(HttpHeaders.AUTHORIZATION, adminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value("SUCCESS"));
  }

  @Test
  @DisplayName("Custom SQL 2: MyBatis-style Dynamic SQL Provider evaluation with runtime branching")
  public void testDynamicSqlProviderEvaluationShouldReturnResults() throws Exception {
    final String adminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "admin-dynamic-sql-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    mockMvc.perform(get(ECommerceConstant.VENDOR_STORES_API + "/reports/dynamic-sql")
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .param("minOrders", "0")
            .param("storeCodePrefix", "VND-%"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value("SUCCESS"));
  }
}

