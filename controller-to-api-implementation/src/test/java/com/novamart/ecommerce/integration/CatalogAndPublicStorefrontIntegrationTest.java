package com.novamart.ecommerce.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration tests for Modules 1 & 2: Storefront Catalog, FieldSecurity, Public DTO, ETag 304.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(NovaTestConstant.PROFILE_TEST)
public class CatalogAndPublicStorefrontIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;

  @Test
  public void shouldManageCategoriesWithAutoSlugAndRejectDuplicateCodeWith409() throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String userAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_BUYER,
            NovaTestConstant.USERNAME_BUYER,
            Set.of(NovaRoleConstant.ROLE_USER));

    final String uniqueCode = "CAT-" + UuidUtil.generateUuidV7().toString().substring(0, 8);
    final String payload =
        "{\"code\":\""
            + uniqueCode
            + "\",\"name\":\"Gaming Laptops "
            + uniqueCode
            + "\",\"description\":\"High-performance machines\",\"active\":true}";

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STORE_CATEGORIES)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
        .andExpect(status().isUnauthorized());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, userAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
        .andExpect(status().isForbidden());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.code").value(uniqueCode))
        .andExpect(jsonPath("$.data.slug").isNotEmpty());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
        .andExpect(status().isConflict());
  }

  @Test
  public void shouldEnforceFieldSecurityPublicDtoProjectionAndHttpCacheableEtag304()
      throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String userAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_BUYER,
            NovaTestConstant.USERNAME_BUYER,
            Set.of(NovaRoleConstant.ROLE_USER));

    final String uniqueSku = "SKU-PUB-" + UuidUtil.generateUuidV7().toString().substring(0, 8);
    final String payload =
        "{\"sku\":\""
            + uniqueSku
            + "\",\"name\":\"NovaPhone Ultra "
            + uniqueSku
            + "\",\"categoryCode\":\"PHONES\",\"brand\":\"NovaTech\","
            + "\"retailPrice\":1299.00,\"supplierCost\":640.00,\"active\":true}";

    final MvcResult created =
        mockMvc
            .perform(
                post(NovaPathConstant.BASE_STOREFRONT_PRODUCTS)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(payload))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.slug").isNotEmpty())
            .andExpect(jsonPath("$.data.supplierCost").value(640.00))
            .andReturn();

    final JsonNode createdNode =
        objectMapper.readTree(created.getResponse().getContentAsString());
    final String productId = createdNode.path("data").path("id").asText();

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/" + productId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, userAuth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sku").value(uniqueSku))
        .andExpect(jsonPath("$.data.supplierCost").doesNotExist());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_PUBLIC_PRODUCTS + "/" + productId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.sku").value(uniqueSku))
        .andExpect(jsonPath("$.data.supplierCost").doesNotExist());

    final MvcResult cachedFirst =
        mockMvc
            .perform(
                get(NovaPathConstant.BASE_PUBLIC_PRODUCTS + "/cached/" + productId)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
            .andExpect(status().isOk())
            .andExpect(header().exists(HttpHeaders.ETAG))
            .andExpect(header().exists(HttpHeaders.CACHE_CONTROL))
            .andExpect(jsonPath("$.data.sku").value(uniqueSku))
            .andReturn();

    final String etag = cachedFirst.getResponse().getHeader(HttpHeaders.ETAG);
    assertThat(etag).isNotBlank();
    assertThat(etag).startsWith("W/\"");

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_PUBLIC_PRODUCTS + "/cached/" + productId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .header(HttpHeaders.IF_NONE_MATCH, etag))
        .andExpect(status().isNotModified());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/" + UuidUtil.generateUuidV7())
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isNotFound());
  }
}
