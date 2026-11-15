package com.example.implementation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.ErrorConstant;
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
import org.springframework.test.web.servlet.MvcResult;

/**
 * Rigorous abnormal integration test suite validating error handling, boundary validation,
 * state machine safeguards, and security enforcement across the universal framework.
 *
 * <p>Verifies that the framework gracefully handles and standardizes all non-happy paths:
 * <ul>
 *   <li>Security RBAC bypass attempts (HTTP 403 Forbidden).</li>
 *   <li>Unauthenticated access to protected endpoints (HTTP 401 Unauthorized).</li>
 *   <li>Unique constraint collisions (HTTP 409 Conflict).</li>
 *   <li>Illegal state machine transitions (HTTP 422 Unprocessable Entity).</li>
 *   <li>Deletion attempts on non-deletable states (HTTP 422 Unprocessable Entity).</li>
 *   <li>Jakarta Bean Validation constraint violations (HTTP 400 Bad Request).</li>
 *   <li>Malformed JSON payloads (HTTP 400 Bad Request).</li>
 *   <li>Unsupported HTTP request methods (HTTP 405 Method Not Allowed).</li>
 *   <li>Unsupported media types (HTTP 415 Unsupported Media Type).</li>
 *   <li>Non-existent resource queries (HTTP 404 Not Found).</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest(classes = ApiImplementationApplication.class)
@AutoConfigureMockMvc
public class B2c2b2cAbnormalScenariosIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Abnormal 1: Customer role attempting platform admin operation should return 403 Forbidden")
  public void testSecurityRbacBypassAttemptShouldReturn403() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "unauthorized-customer",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    final Map<String, Object> storePayload = new HashMap<>();
    storePayload.put("storeName", "Unauthorized Hacker Store");
    storePayload.put("businessLicense", "BL-HACK-0001");
    storePayload.put("description", "Illegal vendor creation attempt");
    storePayload.put("active", Boolean.TRUE);

    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value(SecurityConstant.ERR_FORBIDDEN));
  }

  @Test
  @DisplayName("Abnormal 2: Unauthenticated request to protected endpoint should return 401 Unauthorized")
  public void testUnauthenticatedAccessShouldReturn401() throws Exception {
    mockMvc.perform(get(ECommerceConstant.ECOMMERCE_ORDERS_API))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value(SecurityConstant.ERR_UNAUTHORIZED));
  }

  @Test
  @DisplayName("Abnormal 3: Duplicate unique business field should return 409 Conflict")
  public void testDuplicateUniqueFieldShouldReturn409() throws Exception {
    final String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "vendor-owner-unique",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final Map<String, Object> storePayload = new HashMap<>();
    storePayload.put("storeName", "Kyoto Unique Electronics");
    storePayload.put("businessLicense", "BL-UNIQUE-KEY-112233");
    storePayload.put("description", "Unique license store");
    storePayload.put("active", Boolean.TRUE);

    // First creation should succeed
    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isCreated());

    // Second creation with the exact same unique license must return 409 Conflict
    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_CONFLICT));
  }

  @Test
  @DisplayName("Abnormal 4: Illegal state machine transition should return 422 Unprocessable Entity")
  public void testIllegalStateMachineTransitionShouldReturn422() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-order-state-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    // Create fresh order in CREATED state
    final Map<String, Object> orderPayload = new HashMap<>();
    orderPayload.put("customerEmail", ECommerceConstant.SAMPLE_CUSTOMER_EMAIL);
    orderPayload.put("customerName", ECommerceConstant.SAMPLE_CUSTOMER_NAME);
    orderPayload.put("shippingAddress", ECommerceConstant.SAMPLE_SHIPPING_ADDRESS);
    orderPayload.put("currency", "JPY");
    orderPayload.put("grossAmount", "399.99");
    orderPayload.put("discountAmount", "50.00");
    orderPayload.put("shippingFee", "15.00");
    orderPayload.put("orderStatus", ECommerceConstant.STATE_CREATED);

    final MvcResult orderResult = mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(orderPayload)))
        .andExpect(status().isCreated())
        .andReturn();

    final String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
        .path("data").path("id").asText();

    // Illegal jump: CREATED directly to SHIPPED (not allowed by state machine)
    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_SHIPPED))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_BUSINESS_RULE_VIOLATION));
  }

  @Test
  @DisplayName("Abnormal 5: Deleting an entity in a non-deletable state should return 422 Unprocessable Entity")
  public void testDeleteInNonDeletableStateShouldReturn422() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-order-delete-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    // Create fresh order
    final Map<String, Object> orderPayload = new HashMap<>();
    orderPayload.put("customerEmail", ECommerceConstant.SAMPLE_CUSTOMER_EMAIL);
    orderPayload.put("customerName", ECommerceConstant.SAMPLE_CUSTOMER_NAME);
    orderPayload.put("shippingAddress", ECommerceConstant.SAMPLE_SHIPPING_ADDRESS);
    orderPayload.put("currency", "JPY");
    orderPayload.put("grossAmount", "399.99");
    orderPayload.put("discountAmount", "50.00");
    orderPayload.put("shippingFee", "15.00");
    orderPayload.put("orderStatus", ECommerceConstant.STATE_CREATED);

    final MvcResult orderResult = mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(orderPayload)))
        .andExpect(status().isCreated())
        .andReturn();

    final String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
        .path("data").path("id").asText();

    // Transition to PENDING_PAYMENT
    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_PENDING_PAYMENT))
        .andExpect(status().isOk());

    // Transition to CONFIRMED (non-deletable state)
    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_CONFIRMED))
        .andExpect(status().isOk());

    final String platformAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "platform-superadmin-delete",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_SUPER_ADMIN)
    );

    // Attempting to delete order when in CONFIRMED state must be rejected
    mockMvc.perform(delete(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId)
            .header(HttpHeaders.AUTHORIZATION, platformAdminToken))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_BUSINESS_RULE_VIOLATION));
  }

  @Test
  @DisplayName("Abnormal 6: Input validation constraint violation should return 400 Bad Request")
  public void testBeanValidationViolationShouldReturn400() throws Exception {
    final String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "vendor-validation-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    // Negative retail price violates @Positive
    final Map<String, Object> invalidProduct = new HashMap<>();
    invalidProduct.put("productName", "");
    invalidProduct.put("sku", "SKU-INVALID-PRICE");
    invalidProduct.put("retailPrice", "-99.99");

    mockMvc.perform(post(ECommerceConstant.PRODUCT_CATALOGS_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidProduct)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_VALIDATION_FAILED));
  }

  @Test
  @DisplayName("Abnormal 7: Malformed JSON body should return 400 Bad Request")
  public void testMalformedJsonBodyShouldReturn400() throws Exception {
    final String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "vendor-malformed-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final String brokenJson = "{\"storeName\": \"Truncated JSON without closing brace";

    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(brokenJson))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_MALFORMED_JSON));
  }

  @Test
  @DisplayName("Abnormal 8: Unsupported HTTP method should return 405 Method Not Allowed")
  public void testUnsupportedHttpMethodShouldReturn405() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-method-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    // Sending POST to a base increment sub-path with no ID or unsupported pattern
    mockMvc.perform(post(ECommerceConstant.SHOPPING_CARTS_API + "/018e38f4-0000-7000-8000-000000000000/increment")
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isMethodNotAllowed())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_METHOD_NOT_ALLOWED));
  }

  @Test
  @DisplayName("Abnormal 9: Unsupported Media Type should return 415 Unsupported Media Type")
  public void testUnsupportedMediaTypeShouldReturn415() throws Exception {
    final String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "vendor-media-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.TEXT_PLAIN)
            .content("Plain text not supported"))
        .andExpect(status().isUnsupportedMediaType())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_UNSUPPORTED_MEDIA_TYPE));
  }

  @Test
  @DisplayName("Abnormal 10: Non-existent entity ID lookup should return 404 Not Found")
  public void testNonExistentResourceLookupShouldReturn404() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-notfound-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    mockMvc.perform(get(ECommerceConstant.VENDOR_STORES_API + "/018e38f4-9999-7999-8999-999999999999")
            .header(HttpHeaders.AUTHORIZATION, customerToken))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_RESOURCE_NOT_FOUND));
  }

  @Test
  @DisplayName("Abnormal 11: Malicious SQL injection in dynamic query should return 400 Bad Request")
  public void testMaliciousSqlInjectionInDynamicQueryShouldReturn400() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-security-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    mockMvc.perform(get(ECommerceConstant.PRODUCT_CATALOGS_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .param("productName", "' OR 1=1 --")
            .param("page", "0")
            .param("size", "10"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_INVALID_PARAMETER));
  }

  @Test
  @DisplayName("Abnormal 12: Malicious XSS script tag in dynamic query should return 400 Bad Request")
  public void testMaliciousXssInDynamicQueryShouldReturn400() throws Exception {
    final String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "customer-security-xss",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    mockMvc.perform(get(ECommerceConstant.PRODUCT_CATALOGS_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .param("sku", "<script>alert('pwned')</script>")
            .param("page", "0")
            .param("size", "10"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_INVALID_PARAMETER));
  }

  @Test
  @DisplayName("Abnormal 13: Concurrent in-flight idempotent request conflict should return 409 Conflict")
  public void testConcurrentInFlightIdempotentRequestShouldReturn409() throws Exception {
    final String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "vendor-idempotency-test",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final String idempotencyKey = "IDEMP-ABNORMAL-TEST-KEY-001";
    final Map<String, Object> storePayload = new HashMap<>();
    storePayload.put("storeName", "Idempotent Safe Store");
    storePayload.put("businessLicense", "BL-IDEMP-001");
    storePayload.put("description", "Testing idempotency guard");
    storePayload.put("active", Boolean.TRUE);

    // First request with idempotency key succeeds
    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isCreated());

    // Second request with exact same idempotency key while within TTL must return 409 Conflict
    mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .header("X-Idempotency-Key", idempotencyKey)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(storePayload)))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value(ErrorConstant.ERR_CONFLICT));
  }
}
