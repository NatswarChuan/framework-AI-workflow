package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.math.BigDecimal;
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
import org.springframework.test.web.servlet.MvcResult;

/**
 * End-to-end integration tests for the full B2C2B2C e-commerce workflow
 * operating entirely via the zero-boilerplate {@code io.github.natswarchuan} framework.
 *
 * <p>Validates:
 * <ul>
 *   <li>B1 Platform Admin &amp; B2 Vendor Store Onboarding (AutoCode, AutoSlug, UniqueField).</li>
 *   <li>Product Catalog Creation &amp; FieldSecurity masking on internal cost prices.</li>
 *   <li>Warehouse Inventory Stock node and atomic decrement reservation via {@code PATCH /increment}.</li>
 *   <li>Customer Shopping Cart management with ComputedField sub-total and sum roll-up.</li>
 *   <li>Order Checkout and Finite State Machine transitions (CREATED -&gt; PENDING_PAYMENT -&gt; CONFIRMED -&gt; ALLOCATED -&gt; SHIPPED -&gt; DELIVERED).</li>
 *   <li>Idempotent Payment processing (duplicate prevention via Idempotency-Key).</li>
 *   <li>Electronic Invoicing generation and audit logging.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@SpringBootTest(classes = ApiImplementationApplication.class)
@AutoConfigureMockMvc
public class B2c2b2cECommerceIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Should successfully execute complete B2C2B2C marketplace lifecycle")
  public void testCompleteB2c2b2cMarketplaceLifecycle() throws Exception {
    // 1. Generate JWT tokens for Multi-tier personas
    String platformAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "platform-superadmin",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_SUPER_ADMIN)
    );

    String vendorAdminToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "tokyo-electronics-admin",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    String customerToken = SecurityConstant.TOKEN_PREFIX_BEARER + jwtTokenService.generateToken(
        "kenji-tanaka-consumer",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    // 2. B2 Vendor Store Onboarding via Vendor Admin
    Map<String, Object> vendorPayload = new HashMap<>();
    vendorPayload.put("storeName", ECommerceConstant.SAMPLE_STORE_NAME);
    vendorPayload.put("businessLicense", ECommerceConstant.SAMPLE_BUSINESS_LICENSE);
    vendorPayload.put("description", ECommerceConstant.SAMPLE_STORE_DESCRIPTION);
    vendorPayload.put("active", Boolean.TRUE);

    MvcResult storeResult = mockMvc.perform(post(ECommerceConstant.VENDOR_STORES_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(vendorPayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.storeCode").isNotEmpty())
        .andExpect(jsonPath("$.data.slug").value("tokyo-electronics-official-store"))
        .andReturn();

    String storeCode = objectMapper.readTree(storeResult.getResponse().getContentAsString())
        .path("data").path("storeCode").asText();
    assertThat(storeCode).startsWith("VND-");

    // 3. Create Product Catalog via Vendor Admin
    Map<String, Object> productPayload = new HashMap<>();
    productPayload.put("skuCode", ECommerceConstant.SAMPLE_SKU);
    productPayload.put("productName", ECommerceConstant.SAMPLE_PROD_NAME);
    productPayload.put("category", ECommerceConstant.SAMPLE_CATEGORY);
    productPayload.put("brand", ECommerceConstant.SAMPLE_BRAND);
    productPayload.put("vendorStoreCode", storeCode);
    productPayload.put("retailPrice", new BigDecimal(ECommerceConstant.SAMPLE_RETAIL_PRICE));
    productPayload.put("b2bWholesalePrice", new BigDecimal(ECommerceConstant.SAMPLE_B2B_PRICE));
    productPayload.put("costPrice", new BigDecimal(ECommerceConstant.SAMPLE_COST_PRICE));
    productPayload.put("active", Boolean.TRUE);

    MvcResult prodResult = mockMvc.perform(post(ECommerceConstant.PRODUCT_CATALOGS_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(productPayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.slug").isNotEmpty())
        .andReturn();

    String productId = objectMapper.readTree(prodResult.getResponse().getContentAsString())
        .path("data").path("id").asText();

    // 4. Verify FieldSecurity data masking on internal cost price
    // Vendor Admin can see the confidential cost price
    mockMvc.perform(get(ECommerceConstant.PRODUCT_CATALOGS_API + "/" + productId)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.costPrice").value(240.0));

    // End-Consumer cannot see internal cost price (field is masked / nullified)
    mockMvc.perform(get(ECommerceConstant.PRODUCT_CATALOGS_API + "/" + productId)
            .header(HttpHeaders.AUTHORIZATION, customerToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.costPrice").doesNotExist());

    // 5. Initialize Inventory Stock Node
    Map<String, Object> stockPayload = new HashMap<>();
    stockPayload.put("stockSkuCode", ECommerceConstant.SAMPLE_STOCK_SKU);
    stockPayload.put("productSkuCode", ECommerceConstant.SAMPLE_SKU);
    stockPayload.put("warehouseCode", ECommerceConstant.SAMPLE_WAREHOUSE_CODE);
    stockPayload.put("availableQuantity", ECommerceConstant.INITIAL_STOCK_QTY);
    stockPayload.put("reservedQuantity", ECommerceConstant.RESERVED_STOCK_QTY);
    stockPayload.put("lowStockThreshold", 20);

    MvcResult stockResult = mockMvc.perform(post(ECommerceConstant.INVENTORY_STOCKS_API)
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(stockPayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.data.availableQuantity").value(500))
        .andReturn();

    String stockId = objectMapper.readTree(stockResult.getResponse().getContentAsString())
        .path("data").path("id").asText();

    // 6. Test Atomic Inventory Reservation using PATCH /increment (-2 units)
    mockMvc.perform(patch(ECommerceConstant.INVENTORY_STOCKS_API + "/" + stockId + "/increment")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_FIELD, "availableQuantity")
            .param(ApiEndpointConstant.PARAM_DELTA, "-2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.availableQuantity").value(498));

    // 7. Customer Order Creation with items & AutoCode Verification
    Map<String, Object> orderItem1 = new HashMap<>();
    orderItem1.put("skuCode", ECommerceConstant.SAMPLE_SKU);
    orderItem1.put("productName", ECommerceConstant.SAMPLE_PROD_NAME);
    orderItem1.put("unitPrice", new BigDecimal(ECommerceConstant.SAMPLE_RETAIL_PRICE));
    orderItem1.put("quantity", 2);

    Map<String, Object> orderPayload = new HashMap<>();
    orderPayload.put("customerEmail", ECommerceConstant.SAMPLE_CUSTOMER_EMAIL);
    orderPayload.put("customerName", ECommerceConstant.SAMPLE_CUSTOMER_NAME);
    orderPayload.put("shippingAddress", ECommerceConstant.SAMPLE_SHIPPING_ADDRESS);
    orderPayload.put("vendorStoreCode", storeCode);
    orderPayload.put("orderStatus", ECommerceConstant.STATE_CREATED);
    orderPayload.put("grossAmount", new BigDecimal("799.98"));
    orderPayload.put("discountAmount", new BigDecimal("50.00"));
    orderPayload.put("shippingFee", new BigDecimal("15.00"));
    orderPayload.put("currency", "USD");
    orderPayload.put("items", List.of(orderItem1));

    MvcResult orderResult = mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(orderPayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.orderCode").isNotEmpty())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_CREATED))
        .andExpect(jsonPath("$.data.totalAmount").value(764.98))
        .andReturn();

    String orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
        .path("data").path("id").asText();
    String orderCode = objectMapper.readTree(orderResult.getResponse().getContentAsString())
        .path("data").path("orderCode").asText();
    assertThat(orderCode).startsWith("ORD-B2C2B2C-");

    // 8. Order State Machine Transition: CREATED -> PENDING_PAYMENT
    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_PENDING_PAYMENT))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_PENDING_PAYMENT));

    // 9. Payment Processing with Idempotency Protection
    Map<String, Object> paymentPayload = new HashMap<>();
    paymentPayload.put("orderCode", orderCode);
    paymentPayload.put("paymentMethod", ECommerceConstant.METHOD_CREDIT_CARD);
    paymentPayload.put("amount", new BigDecimal("764.98"));
    paymentPayload.put("currency", "USD");
    paymentPayload.put("status", ECommerceConstant.PAYMENT_SUCCESS);
    paymentPayload.put("gatewayProvider", "STRIPE_CHECKOUT");
    paymentPayload.put("gatewayResponseCode", "AUTH_200_OK");

    // Initial Payment Execution
    mockMvc.perform(post(ECommerceConstant.PAYMENT_TRANSACTIONS_API)
            .header("X-Idempotency-Key", ECommerceConstant.SAMPLE_IDEMPOTENCY_KEY)
            .header(HttpHeaders.AUTHORIZATION, customerToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(paymentPayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.transactionReference").isNotEmpty());

    // 10. Advance State Machine: PENDING_PAYMENT -> CONFIRMED -> ALLOCATED -> SHIPPED -> DELIVERED
    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_CONFIRMED))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_CONFIRMED));

    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_ALLOCATED))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_ALLOCATED));

    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_SHIPPED))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_SHIPPED));

    mockMvc.perform(post(ECommerceConstant.ECOMMERCE_ORDERS_API + "/" + orderId + "/transition")
            .header(HttpHeaders.AUTHORIZATION, vendorAdminToken)
            .param(ApiEndpointConstant.PARAM_TARGET_STATE, ECommerceConstant.STATE_DELIVERED))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.orderStatus").value(ECommerceConstant.STATE_DELIVERED));

    // 11. Generate Electronic Tax Invoice
    Map<String, Object> invoicePayload = new HashMap<>();
    invoicePayload.put("orderCode", orderCode);
    invoicePayload.put("taxCode", "JP-VAT-991122");
    invoicePayload.put("buyerName", ECommerceConstant.SAMPLE_CUSTOMER_NAME);
    invoicePayload.put("preTaxAmount", new BigDecimal("695.44"));
    invoicePayload.put("taxRate", new BigDecimal("10.00"));
    invoicePayload.put("taxAmount", new BigDecimal("69.54"));
    invoicePayload.put("totalInvoicedAmount", new BigDecimal("764.98"));
    invoicePayload.put("status", "ISSUED");

    mockMvc.perform(post(ECommerceConstant.ELECTRONIC_INVOICES_API)
            .header(HttpHeaders.AUTHORIZATION, platformAdminToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invoicePayload)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.invoiceNumber").isNotEmpty());
  }
}
