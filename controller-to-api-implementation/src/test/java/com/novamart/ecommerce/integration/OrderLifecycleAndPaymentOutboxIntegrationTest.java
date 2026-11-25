package com.novamart.ecommerce.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.provider.NovaOutboxDispatcherProvider;
import com.novamart.ecommerce.util.NovaJwtTestUtil;
import io.github.natswarchuan.common.constant.EventConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.event.OutboxEvent;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.util.List;
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
 * Integration tests for Modules 5 & 6: ShopOrder StateMachine/Audit/Overrides & Idempotent Payment.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(NovaTestConstant.PROFILE_TEST)
public class OrderLifecycleAndPaymentOutboxIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;
  @Autowired private NovaOutboxDispatcherProvider outboxDispatcherProvider;

  @Test
  public void shouldEnforceOrderStateMachineTimeTravelSummaryAndPricingOverride() throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));

    final String orderPayload =
        "{\"customerEmail\":\"buyer@novamart.test\",\"merchantCode\":\"MERCH-01\","
            + "\"subtotalAmount\":500.00,\"discountAmount\":0.00,\"totalAmount\":500.00}";

    final MvcResult created =
        mockMvc
            .perform(
                post(NovaPathConstant.BASE_SHOP_ORDERS)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(orderPayload))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.orderStatus").value(NovaFieldConstant.ORDER_STATE_DRAFT))
            .andReturn();

    final JsonNode createdNode = objectMapper.readTree(created.getResponse().getContentAsString());
    final String orderId = createdNode.path("data").path("id").asText();
    final String orderNumber = createdNode.path("data").path("orderNumber").asText();
    assertThat(orderNumber).startsWith(NovaFieldConstant.PREFIX_ORDER_CODE);

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_SHOP_ORDERS + "/" + orderId + "/transition")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("targetState", NovaFieldConstant.ORDER_STATE_DELIVERED))
        .andExpect(status().isUnprocessableEntity());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_SHOP_ORDERS + "/" + orderId + "/transition")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("targetState", NovaFieldConstant.ORDER_STATE_PENDING_PAYMENT))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath("$.data.orderStatus").value(NovaFieldConstant.ORDER_STATE_PENDING_PAYMENT));

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_SHOP_ORDERS + "/" + orderId + "/transition")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("targetState", NovaFieldConstant.ORDER_STATE_PAID))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(NovaFieldConstant.ORDER_STATE_PAID));

    mockMvc
        .perform(
            delete(NovaPathConstant.BASE_SHOP_ORDERS + "/" + orderId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isUnprocessableEntity());

    mockMvc
        .perform(
            get("/api/v1/system/time-travel/ShopOrder/" + orderId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_SHOP_ORDERS + NovaPathConstant.SUB_CHECKOUT_SUMMARY)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.totalOrders").isNumber())
        .andExpect(jsonPath("$.data.paidCount").isNumber());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_SHOP_ORDERS + "/" + orderId + "/pricing-quote")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("tier", NovaFieldConstant.TIER_VIP))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.appliedTier").value(NovaFieldConstant.TIER_VIP))
        .andExpect(jsonPath("$.data.loyaltyDiscountAmount").value(50.00))
        .andExpect(jsonPath("$.data.estimatedTaxAmount").value(36.00))
        .andExpect(jsonPath("$.data.finalPayableAmount").value(486.00));

    mockMvc
        .perform(
            get(
                    NovaPathConstant.BASE_SHOP_ORDERS
                        + "/"
                        + UuidUtil.generateUuidV7()
                        + "/pricing-quote")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isNotFound());
  }

  @Test
  public void shouldDeduplicateIdempotentPaymentsAndDispatchEntityCreatedOutboxEvent()
      throws Exception {
    outboxDispatcherProvider.clearDispatchedEvents();
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String idempotencyKey = "IDEM-PAY-" + UuidUtil.generateUuidV7();
    final String paymentPayload =
        "{\"orderNumber\":\"NVM-PAY-001\",\"amount\":249.50,\"currency\":\"USD\","
            + "\"paymentMethod\":\"CREDIT_CARD\",\"paymentStatus\":\"CAPTURED\"}";

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_CHECKOUT_PAYMENTS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .header(HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY, idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(paymentPayload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.paymentRef").isNotEmpty());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_CHECKOUT_PAYMENTS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .header(HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY, idempotencyKey)
                .contentType(MediaType.APPLICATION_JSON)
                .content(paymentPayload))
        .andExpect(status().isConflict());

    final List<OutboxEvent> recorded = outboxDispatcherProvider.getDispatchedEvents();
    final boolean hasCreatedPaymentEvent =
        recorded.stream()
            .anyMatch(e -> EventConstant.EVENT_TYPE_CREATED.equals(e.getEventType()));
    assertThat(hasCreatedPaymentEvent).isTrue();
  }
}
