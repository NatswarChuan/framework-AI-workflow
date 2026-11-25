package com.novamart.ecommerce.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.util.NovaJwtTestUtil;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
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
 * Integration tests for Module 7: Dynamic DB-RBAC roles, permissions, ALLOW, and DENY > ALLOW.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(NovaTestConstant.PROFILE_TEST)
public class DynamicDatabaseRbacIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;

  @Test
  public void shouldEnforceDynamicDbRbacRolesPermissionsAndDenyOverridesAllowAtRuntime()
      throws Exception {
    final String superAdminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_SUPER_ADMIN,
            NovaTestConstant.USERNAME_SUPER_ADMIN,
            Set.of(NovaRoleConstant.ROLE_SUPER_ADMIN));

    final String auditorAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_RBAC_AUDITOR,
            NovaTestConstant.USERNAME_RBAC_AUDITOR,
            Set.of("ROLE_GUEST"));

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, auditorAuth))
        .andExpect(status().isForbidden());

    final MvcResult permCreated =
        mockMvc
            .perform(
                post("/api/v1/nova-permissions")
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"permissionCode\":\"store-category:read\","
                            + "\"resourceName\":\"StoreCategory\","
                            + "\"actionName\":\"READ\",\"maskedFields\":\"\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    final MvcResult roleCreated =
        mockMvc
            .perform(
                post("/api/v1/nova-roles")
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"roleCode\":\""
                            + NovaRoleConstant.ROLE_CATALOG_AUDITOR
                            + "\",\"roleName\":\"Catalog Auditor\","
                            + "\"permissionsCsv\":\"store-category:read\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    final MvcResult userRoleCreated =
        mockMvc
            .perform(
                post("/api/v1/nova-user-roles")
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"username\":\""
                            + NovaTestConstant.USERNAME_RBAC_AUDITOR
                            + "\",\"roleCode\":\""
                            + NovaRoleConstant.ROLE_CATALOG_AUDITOR
                            + "\",\"tenantId\":\"*\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    final MvcResult allowPolicyCreated =
        mockMvc
            .perform(
                post("/api/v1/nova-access-policies")
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"resourcePattern\":\"StoreCategory\","
                            + "\"actionPattern\":\"READ\","
                            + "\"targetRoles\":\""
                            + NovaRoleConstant.ROLE_CATALOG_AUDITOR
                            + "\",\"effect\":\"ALLOW\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, auditorAuth))
        .andExpect(status().isOk());

    final MvcResult denyPolicyCreated =
        mockMvc
            .perform(
                post("/api/v1/nova-access-policies")
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        "{\"resourcePattern\":\"StoreCategory\","
                            + "\"actionPattern\":\"READ\","
                            + "\"targetRoles\":\""
                            + NovaRoleConstant.ROLE_CATALOG_AUDITOR
                            + "\",\"effect\":\"DENY\"}"))
            .andExpect(status().isCreated())
            .andReturn();

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STORE_CATEGORIES)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, auditorAuth))
        .andExpect(status().isForbidden());

    cleanupRbacRecord("/api/v1/nova-access-policies", denyPolicyCreated, superAdminAuth);
    cleanupRbacRecord("/api/v1/nova-access-policies", allowPolicyCreated, superAdminAuth);
    cleanupRbacRecord("/api/v1/nova-user-roles", userRoleCreated, superAdminAuth);
    cleanupRbacRecord("/api/v1/nova-roles", roleCreated, superAdminAuth);
    cleanupRbacRecord("/api/v1/nova-permissions", permCreated, superAdminAuth);
  }

  /**
   * Soft-deletes a temporary DB-RBAC entity created during the test so other suites stay isolated.
   *
   * @param basePath entity controller base path
   * @param createdResult creation response
   * @param superAdminAuth super admin bearer token
   * @throws Exception when deletion fails
   */
  public void cleanupRbacRecord(
      final String basePath, final MvcResult createdResult, final String superAdminAuth)
      throws Exception {
    final JsonNode node = objectMapper.readTree(createdResult.getResponse().getContentAsString());
    final String id = node.path("data").path("id").asText();
    mockMvc
        .perform(
            delete(basePath + "/" + id)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, superAdminAuth))
        .andExpect(status().isOk());
  }
}
