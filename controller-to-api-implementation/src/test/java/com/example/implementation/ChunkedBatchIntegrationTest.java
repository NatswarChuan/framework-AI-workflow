package com.example.implementation;

import com.example.implementation.entity.InventoryStock;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

/**
 * Integration test validating high-performance chunked batch processing engine (O(1) memory)
 * and row-level diagnostic error collection via {@code POST /api/v1/{entities}/batch-chunked}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ChunkedBatchIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  @Autowired
  private ObjectMapper objectMapper;

  /**
   * Tests chunked batch import with 50 items where 48 items are valid and 2 items
   * deliberately violate validation constraints.
   *
   * <p>Verifies:
   * 1. Total submitted = 50.
   * 2. Success count = 48.
   * 3. Failure count = 2.
   * 4. Diagnostic errors list contains specific row indices 10 and 25 with error codes.
   */
  @Test
  @DisplayName("Verify High-Performance Chunked Batch Processing with Diagnostic Errors")
  public void testChunkedBatchProcessingWithDiagnostics() throws Exception {
    final String adminToken = jwtTokenProviderHelper.generateToken(
        "batch-admin",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final List<InventoryStock> batchItems = new ArrayList<>();
    final long timestamp = System.currentTimeMillis();

    for (int i = 0; i < 50; i++) {
      if (i == 10) {
        // Deliberate constraint violation: blank stockSkuCode
        batchItems.add(InventoryStock.builder()
            .stockSkuCode("")
            .productSkuCode("PROD-BATCH-" + i)
            .warehouseCode("WH-NORTH")
            .availableQuantity(100)
            .reservedQuantity(0)
            .lowStockThreshold(10)
            .build());
        continue;
      }
      if (i == 25) {
        // Deliberate constraint violation: negative quantity
        batchItems.add(InventoryStock.builder()
            .stockSkuCode("SKU-BATCH-" + timestamp + "-" + i)
            .productSkuCode("PROD-BATCH-" + i)
            .warehouseCode("WH-NORTH")
            .availableQuantity(-50)
            .reservedQuantity(0)
            .lowStockThreshold(10)
            .build());
        continue;
      }

      batchItems.add(InventoryStock.builder()
          .stockSkuCode("SKU-BATCH-" + timestamp + "-" + i)
          .productSkuCode("PROD-BATCH-" + i)
          .warehouseCode("WH-NORTH")
          .availableQuantity(100 + i)
          .reservedQuantity(5)
          .lowStockThreshold(10)
          .build());
    }

    final String requestJson = objectMapper.writeValueAsString(batchItems);

    final MvcResult result = mockMvc.perform(
        MockMvcRequestBuilders.post("/api/v1/inventory-stocks/batch-chunked?chunkSize=10")
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestJson)
    )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(CommonConstant.CODE_SUCCESS))
        .andReturn();

    final JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
    final JsonNode data = root.get("data");

    Assertions.assertNotNull(data);
    Assertions.assertEquals(50, data.get("totalSubmitted").asInt());
    Assertions.assertEquals(48, data.get("successCount").asInt());
    Assertions.assertEquals(2, data.get("failureCount").asInt());

    final JsonNode errorsNode = data.get("errors");
    Assertions.assertEquals(2, errorsNode.size());

    final int firstRow = errorsNode.get(0).get("rowIndex").asInt();
    final int secondRow = errorsNode.get(1).get("rowIndex").asInt();

    Assertions.assertEquals(10, firstRow);
    Assertions.assertEquals(25, secondRow);
  }
}
