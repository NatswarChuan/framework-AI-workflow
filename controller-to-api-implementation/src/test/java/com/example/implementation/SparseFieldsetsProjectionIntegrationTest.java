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
 * Enterprise integration tests validating Sparse Fieldsets Projection
 * across Dynamic Controller Proxies.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SparseFieldsetsProjectionIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  /**
   * Verifies that adding ?fields=id,storeName to a paginated endpoint
   * only populates the requested fields, nullifying unrequested fields in JSON.
   */
  @Test
  @DisplayName("Verify Dynamic Sparse Fieldsets Projection ?fields=id,storeName")
  public void testSparseFieldsetsProjection() throws Exception {
    final String adminToken = jwtTokenProviderHelper.generateToken(
        "admin-projection-tester",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    // 1. Create a store
    final String storePayload = """
        {
          "storeCode": "STORE-PROJ-01",
          "storeName": "Projection Flagship",
          "businessLicense": "LIC-9988-PROJ",
          "description": "Projection description",
          "active": true
        }
        """;

    mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/vendor-stores")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(storePayload))
        .andExpect(MockMvcResultMatchers.status().isCreated());

    // 2. Query with ?storeCode=STORE-PROJ-01&fields=id,storeName
    mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/vendor-stores?storeCode=STORE-PROJ-01&fields=id,storeName")
            .header("Authorization", "Bearer " + adminToken))
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].id").exists())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].storeName").value("Projection Flagship"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].businessLicense").doesNotExist())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.content[0].description").doesNotExist());
  }
}

