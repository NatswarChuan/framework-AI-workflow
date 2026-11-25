package com.novamart.ecommerce.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.util.NovaJwtTestUtil;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration tests for Modules 3 & 4: Multi-Tenant Merchant Isolation & Flash-Sale Stock Lock.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(NovaTestConstant.PROFILE_TEST)
public class MultiTenantAndInventoryIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;

  @Test
  public void shouldEnforceMultiTenantFailClosed403AndBlockCrossTenantIdor() throws Exception {
    final String merchantAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_MERCHANT,
            NovaTestConstant.USERNAME_MERCHANT,
            Set.of(NovaRoleConstant.ROLE_MERCHANT));
    final String superAdminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_SUPER_ADMIN,
            NovaTestConstant.USERNAME_SUPER_ADMIN,
            Set.of(NovaRoleConstant.ROLE_SUPER_ADMIN));

    final String payloadWithSpoofedTenant =
        "{\"merchantTenantId\":\""
            + NovaTestConstant.TENANT_BETA
            + "\",\"productSku\":\"SKU-MT-01\",\"title\":\"Merchant Alpha Deal\","
            + "\"listingPrice\":199.99,\"status\":\"ACTIVE\"}";

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_MERCHANT_LISTINGS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, merchantAuth))
        .andExpect(status().isForbidden());

    final MvcResult created =
        mockMvc
            .perform(
                post(NovaPathConstant.BASE_MERCHANT_LISTINGS)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, merchantAuth)
                    .header(HttpHeaderConstant.HEADER_TENANT_ID, NovaTestConstant.TENANT_ALPHA)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payloadWithSpoofedTenant))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.merchantTenantId").value(NovaTestConstant.TENANT_ALPHA))
            .andExpect(jsonPath("$.data.listingCode").isNotEmpty())
            .andReturn();

    final JsonNode node = objectMapper.readTree(created.getResponse().getContentAsString());
    final String listingId = node.path("data").path("id").asText();

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_MERCHANT_LISTINGS + "/" + listingId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, merchantAuth)
                .header(HttpHeaderConstant.HEADER_TENANT_ID, NovaTestConstant.TENANT_ALPHA))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.merchantTenantId").value(NovaTestConstant.TENANT_ALPHA));

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_MERCHANT_LISTINGS + "/" + listingId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, merchantAuth)
                .header(HttpHeaderConstant.HEADER_TENANT_ID, NovaTestConstant.TENANT_BETA))
        .andExpect(status().isForbidden());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_MERCHANT_LISTINGS + "/" + listingId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.id").value(listingId));
  }

  @Test
  public void shouldReserveWarehouseStockAtomicallyAndRejectOverReservationWith409()
      throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String sku = "SKU-FLASH-" + UuidUtil.generateUuidV7().toString().substring(0, 8);
    final String stockPayload =
        "{\"sku\":\""
            + sku
            + "\",\"warehouseCode\":\"WH-SG-01\",\"availableQuantity\":10,\"reservedQuantity\":0}";

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_WAREHOUSE_STOCKS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(stockPayload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.availableQuantity").value(10));

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_WAREHOUSE_STOCKS + NovaPathConstant.SUB_RESERVE_STOCK)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("sku", sku)
                .param("qty", "4"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sku").value(sku))
        .andExpect(jsonPath("$.data.requestedQuantity").value(4))
        .andExpect(jsonPath("$.data.remainingAvailableQuantity").value(6))
        .andExpect(jsonPath("$.data.totalReservedQuantity").value(4))
        .andExpect(jsonPath("$.data.reservationId").isNotEmpty());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_WAREHOUSE_STOCKS + NovaPathConstant.SUB_RESERVE_STOCK)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("sku", sku)
                .param("qty", "20"))
        .andExpect(status().isConflict());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_WAREHOUSE_STOCKS + NovaPathConstant.SUB_RESERVE_STOCK)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("sku", "UNKNOWN-SKU-999")
                .param("qty", "1"))
        .andExpect(status().isNotFound());
  }
}
