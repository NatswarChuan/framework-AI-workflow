package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.EventConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.event.OutboxEvent;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import jakarta.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
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
 * Enterprise Integration Test validating Transactional Outbox Pattern enforcement:
 * ensures every entity mutation commits an outbox event record atomically into the database.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest(classes = ApiImplementationApplication.class)
@AutoConfigureMockMvc
public class TransactionalOutboxIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Autowired
  private EntityManager entityManager;

  @Test
  @DisplayName("Transactional Outbox: creating vendor store must atomically record and publish outbox event")
  public void testEntityCreationMustAtomicallyRecordOutboxEvent() throws Exception {
    final String adminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "admin-outbox-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final Map<String, Object> storePayload = new HashMap<>();
    storePayload.put("storeName", "Kyoto Outbox Flagship");
    storePayload.put("businessLicense", "BL-OUTBOX-9988");
    storePayload.put("description", "Testing transactional outbox atomicity");
    storePayload.put("active", Boolean.TRUE);

    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, adminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isCreated());

    // Query outbox table
    final List<OutboxEvent> outboxRecords = entityManager.createQuery(
        "SELECT o FROM OutboxEvent o WHERE o.aggregateType = 'VendorStore' ORDER BY o.createdAt DESC",
        OutboxEvent.class
    ).getResultList();

    assertThat(outboxRecords).isNotEmpty();
    final OutboxEvent latestEvent = outboxRecords.get(0);
    assertThat(latestEvent.getAggregateType()).isEqualTo("VendorStore");
    assertThat(latestEvent.getEventType()).isEqualTo(EventConstant.EVENT_TYPE_CREATED);
    assertThat(latestEvent.getPayload()).contains("Kyoto Outbox Flagship");
    assertThat(latestEvent.getStatus()).isIn(EventConstant.OUTBOX_STATUS_PENDING, EventConstant.OUTBOX_STATUS_PUBLISHED);
    assertThat(latestEvent.getTraceId()).isNotBlank();
  }
}

