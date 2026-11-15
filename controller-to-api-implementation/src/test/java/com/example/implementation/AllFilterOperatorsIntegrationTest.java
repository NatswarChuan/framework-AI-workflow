package com.example.implementation;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
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
 * Enterprise integration test validating all dynamic filtering operators
 * supported by the Spring-NWVMC framework on real database entities.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AllFilterOperatorsIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  @Test
  @DisplayName("Verify Dynamic Filter Operators: eq, like, gte, lte, in, sorting, and count")
  public void testAllFilterOperatorsAcrossDynamicEndpoints() throws Exception {
    final String adminToken = jwtTokenProviderHelper.generateToken(
        "filter-operator-admin",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    // 1. Seed two products with distinct prices and categories
    final String product1 = """
        {
          "skuCode": "SKU-OPERATOR-01",
          "productName": "Alpha Laptop Pro 15",
          "category": "COMPUTERS",
          "brand": "AlphaBrand",
          "vendorStoreCode": "STORE-FILTER-01",
          "retailPrice": 1500.00,
          "b2bWholesalePrice": 1200.00,
          "costPrice": 900.00,
          "active": true
        }
        """;

    final String product2 = """
        {
          "skuCode": "SKU-OPERATOR-02",
          "productName": "Beta Smartphone Max",
          "category": "MOBILE",
          "brand": "BetaBrand",
          "vendorStoreCode": "STORE-FILTER-01",
          "retailPrice": 800.00,
          "b2bWholesalePrice": 650.00,
          "costPrice": 500.00,
          "active": true
        }
        """;

    mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(product1))
        .andExpect(MockMvcResultMatchers.status().isCreated());

    mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(product2))
        .andExpect(MockMvcResultMatchers.status().isCreated());

    // 2. Test operator: eq (category.eq=COMPUTERS)
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("category.eq", "COMPUTERS"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-01')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-02')]").doesNotExist());

    // 3. Test operator: like (productName.like=Smartphone)
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("productName.like", "Smartphone"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-02')]").exists());

    // 4. Test operator: gte (retailPrice.gte=1000)
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("retailPrice.gte", "1000.00"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-01')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-02')]").doesNotExist());

    // 5. Test operator: lte (retailPrice.lte=900)
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("retailPrice.lte", "900.00"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-02')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-01')]").doesNotExist());

    // 6. Test operator: in (skuCode.in=SKU-OPERATOR-01,SKU-OPERATOR-02)
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("skuCode.in", "SKU-OPERATOR-01,SKU-OPERATOR-02"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-01')]").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[?(@.skuCode == 'SKU-OPERATOR-02')]").exists());

    // 7. Test sorting: sort=retailPrice, dir=desc
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs")
            .header("Authorization", "Bearer " + adminToken)
            .param("skuCode.in", "SKU-OPERATOR-01,SKU-OPERATOR-02")
            .param("sort", "retailPrice")
            .param("dir", "desc"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].skuCode").value("SKU-OPERATOR-01"));

    // 8. Test count endpoint with active filter
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/product-catalogs/count")
            .header("Authorization", "Bearer " + adminToken)
            .param("category.eq", "COMPUTERS"))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));
  }
}

