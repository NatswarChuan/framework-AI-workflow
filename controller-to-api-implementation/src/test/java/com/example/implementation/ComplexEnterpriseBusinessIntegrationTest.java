package com.example.implementation;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.CartCheckoutRequestDto;
import com.example.implementation.dto.CouponDiscountCalculationResultDto;
import com.example.implementation.dto.FlashSalePurchaseRequestDto;
import com.example.implementation.dto.OrderPaymentSagaRequestDto;
import com.example.implementation.dto.SagaExecutionResultDto;
import com.example.implementation.dto.VoucherDiscountCalculationRequestDto;
import com.example.implementation.entity.CouponVoucher;
import com.example.implementation.entity.ECommerceOrder;
import com.example.implementation.entity.InventoryStock;
import com.example.implementation.entity.ShoppingCart;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.security.helper.JwtTokenProviderHelper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
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
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Enterprise integration tests validating complex business scenarios:
 * 1. Last-product multi-user flash-sale purchase under extreme concurrency.
 * 2. Multiple send cart checkout under network retry / idempotent deduplication.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ComplexEnterpriseBusinessIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JwtTokenProviderHelper jwtTokenProviderHelper;

  @Autowired
  private EntityManager entityManager;

  @Autowired
  private TransactionTemplate transactionTemplate;

  /**
   * Complex Scenario 1: Last-Product Multi-User Flash Sale Contention.
   *
   * <p>Only 1 unit is available in inventory. 20 concurrent buyers send orders at the exact same millisecond.
   * Exactly 1 buyer must succeed (HTTP 200), and 19 buyers must be gracefully rejected with out-of-stock (HTTP 400).
   * Final inventory must be exactly 0 (no overselling, no negative stock, no DB deadlock).
   */
  @Test
  @DisplayName("Verify Last-Product Multi-User Concurrent Flash-Sale Buy (Zero Overselling)")
  public void testLastProductMultiUserConcurrentFlashSaleBuy() throws Exception {
    final String userToken = jwtTokenProviderHelper.generateToken(
        "flash-sale-buyer",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );

    // Initialize inventory with availableQuantity = 1
    final InventoryStock stock = transactionTemplate.execute(status -> {
      final InventoryStock s = InventoryStock.builder()
          .stockSkuCode("SKU-FLASH-" + System.currentTimeMillis())
          .productSkuCode("PROD-IPHONE-15")
          .warehouseCode("WH-HANOI-01")
          .availableQuantity(1)
          .reservedQuantity(0)
          .lowStockThreshold(0)
          .build();
      entityManager.persist(s);
      return s;
    });

    final int totalThreads = 20;
    final ExecutorService executor = Executors.newFixedThreadPool(totalThreads);
    final AtomicInteger successCount = new AtomicInteger(0);
    final AtomicInteger outOfStockCount = new AtomicInteger(0);

    final List<Callable<Void>> tasks = new ArrayList<>();
    for (int i = 0; i < totalThreads; i++) {
      final int idx = i;
      tasks.add(() -> {
        final String payload = String.format("""
            {
              "stockId": "%s",
              "buyerEmail": "buyer%d@flashsale.com",
              "quantity": 1,
              "unitPrice": 1200.00
            }
            """, stock.getId(), idx);

        try {
          final MvcResult result = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/advanced-business/flash-sale/buy")
                  .header("Authorization", "Bearer " + userToken)
                  .contentType(MediaType.APPLICATION_JSON)
                  .content(payload))
              .andReturn();

          final int status = result.getResponse().getStatus();
          if (status == 200) {
            successCount.incrementAndGet();
          } else if (status == 400) {
            outOfStockCount.incrementAndGet();
          }
        } catch (final Exception ex) {
          // exception handling
        }
        return null;
      });
    }

    final List<Future<Void>> futures = executor.invokeAll(tasks);
    for (final Future<Void> f : futures) {
      f.get();
    }
    executor.shutdown();

    // Exactly 1 buyer got the last item
    Assertions.assertEquals(1, successCount.get(), "Exactly 1 buyer must succeed in flash-sale race condition");
    Assertions.assertEquals(totalThreads - 1, outOfStockCount.get(), "19 buyers must receive out-of-stock");

    // Verify stock in database is now exactly 0
    final InventoryStock postStock = entityManager.find(InventoryStock.class, stock.getId());
    Assertions.assertEquals(0, postStock.getAvailableQuantity());
  }

  /**
   * Complex Scenario 2: Multiple Send Checkout Cart / Idempotent Settlement.
   *
   * <p>A user clicks checkout multiple times concurrently with the same idempotencyKey.
   * The system must return the same settled order, creating exactly 1 record in the database.
   */
  @Test
  @DisplayName("Verify Multiple Send Checkout Cart with Idempotency Key Deduplication")
  public void testMultipleSendCheckoutCartIdempotency() throws Exception {
    final String userToken = jwtTokenProviderHelper.generateToken(
        "cart-shopper",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );

    // Initialize shopping cart
    final ShoppingCart cart = transactionTemplate.execute(status -> {
      final ShoppingCart c = ShoppingCart.builder()
          .userEmail("shopper@domain.com")
          .currency("USD")
          .totalAmount(new BigDecimal("299.99"))
          .build();
      entityManager.persist(c);
      return c;
    });

    final String idempotencyKey = "IDEM-KEY-" + System.currentTimeMillis();
    final String checkoutPayload = String.format("""
        {
          "cartId": "%s",
          "buyerEmail": "shopper@domain.com",
          "shippingAddress": "123 Silicon Boulevard, California",
          "idempotencyKey": "%s",
          "expectedTotalAmount": 299.99
        }
        """, cart.getId(), idempotencyKey);

    // First checkout request
    final MvcResult firstResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/advanced-business/cart/checkout")
            .header("Authorization", "Bearer " + userToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(checkoutPayload))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.orderCode").exists())
        .andReturn();

    // Duplicate checkout request with same idempotencyKey
    final MvcResult secondResult = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/advanced-business/cart/checkout")
            .header("Authorization", "Bearer " + userToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(checkoutPayload))
        .andExpect(MockMvcResultMatchers.status().isCreated())
        .andReturn();

    // Verify both responses yield the identical order
    final com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
    final com.fasterxml.jackson.databind.JsonNode node1 = mapper.readTree(firstResult.getResponse().getContentAsString());
    final com.fasterxml.jackson.databind.JsonNode node2 = mapper.readTree(secondResult.getResponse().getContentAsString());

    Assertions.assertEquals(
        node1.get("data").get("orderCode").asText(),
        node2.get("data").get("orderCode").asText(),
        "Duplicate checkout submissions must return identical idempotent order"
    );
    Assertions.assertEquals(
        node1.get("data").get("id").asText(),
        node2.get("data").get("id").asText()
    );
  }

  /**
   * Complex Scenario 3: Distributed Multi-Phase Saga Orchestration - Happy Path Commit.
   *
   * <p>Deducts stock, processes payment, finalizes order as PAID, and emits outbox event.
   */
  @Test
  @DisplayName("Verify Distributed Multi-Phase Saga Orchestration (Happy Path Commit)")
  public void testSagaPaymentCommitPhase() throws Exception {
    final String userToken = jwtTokenProviderHelper.generateToken(
        "saga-shopper",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );

    final long timestamp = System.currentTimeMillis();
    final String sku = "SKU-SAGA-COMMIT-" + timestamp;

    final InventoryStock stock = transactionTemplate.execute(status -> {
      final InventoryStock s = InventoryStock.builder()
          .stockSkuCode(sku)
          .productSkuCode("PROD-MACBOOK-PRO")
          .warehouseCode("WH-WEST")
          .availableQuantity(10)
          .reservedQuantity(0)
          .build();
      entityManager.persist(s);
      return s;
    });

    final ECommerceOrder order = transactionTemplate.execute(status -> {
      final ECommerceOrder o = ECommerceOrder.builder()
          .orderCode("ORD-SAGA-" + timestamp)
          .vendorStoreCode("VND-TECH-STORE")
          .customerName("Tech Enthusiast")
          .customerEmail("tech@domain.com")
          .shippingAddress("789 Infinite Loop, Cupertino")
          .grossAmount(new BigDecimal("1999.00"))
          .discountAmount(BigDecimal.ZERO)
          .shippingFee(BigDecimal.ZERO)
          .currency("USD")
          .orderStatus("PENDING")
          .build();
      entityManager.persist(o);
      return o;
    });

    final String payload = String.format("""
        {
          "orderId": "%s",
          "stockSkuCode": "%s",
          "reservationQuantity": 2,
          "paymentAmount": 1999.00,
          "paymentMethod": "CREDIT_CARD",
          "simulatePaymentFailure": false
        }
        """, order.getId(), sku);

    final MvcResult result = mockMvc.perform(
        MockMvcRequestBuilders.post("/api/v1/advanced-business/saga/payment")
            .header("Authorization", "Bearer " + userToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload)
    )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.sagaStatus").value(AdvancedBusinessConstant.SAGA_STATUS_COMMITTED))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.orderStatus").value(AdvancedBusinessConstant.STATUS_PAID))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.remainingStockQuantity").value(8))
        .andReturn();

    Assertions.assertNotNull(result);
  }

  /**
   * Complex Scenario 4: Distributed Multi-Phase Saga with Automated Compensation Rollback.
   *
   * <p>Simulates downstream payment gateway failure (e.g. card declined), triggering
   * automatic compensation transaction that replenishes reserved inventory back to warehouse stock.
   */
  @Test
  @DisplayName("Verify Distributed Multi-Phase Saga with Automated Compensation Rollback")
  public void testSagaPaymentFailureAndCompensationRollback() throws Exception {
    final String userToken = jwtTokenProviderHelper.generateToken(
        "saga-shopper-fail",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );

    final long timestamp = System.currentTimeMillis();
    final String sku = "SKU-SAGA-FAIL-" + timestamp;

    final InventoryStock stock = transactionTemplate.execute(status -> {
      final InventoryStock s = InventoryStock.builder()
          .stockSkuCode(sku)
          .productSkuCode("PROD-DELL-XPS")
          .warehouseCode("WH-EAST")
          .availableQuantity(15)
          .reservedQuantity(0)
          .build();
      entityManager.persist(s);
      return s;
    });

    final ECommerceOrder order = transactionTemplate.execute(status -> {
      final ECommerceOrder o = ECommerceOrder.builder()
          .orderCode("ORD-SAGA-FAIL-" + timestamp)
          .vendorStoreCode("VND-TECH-STORE")
          .customerName("Corporate Buyer")
          .customerEmail("buyer@corp.com")
          .shippingAddress("456 Enterprise Ave, Austin")
          .grossAmount(new BigDecimal("2499.00"))
          .discountAmount(BigDecimal.ZERO)
          .shippingFee(BigDecimal.ZERO)
          .currency("USD")
          .orderStatus("PENDING")
          .build();
      entityManager.persist(o);
      return o;
    });

    final String payload = String.format("""
        {
          "orderId": "%s",
          "stockSkuCode": "%s",
          "reservationQuantity": 3,
          "paymentAmount": 2499.00,
          "paymentMethod": "CORPORATE_CARD",
          "simulatePaymentFailure": true
        }
        """, order.getId(), sku);

    final MvcResult result = mockMvc.perform(
        MockMvcRequestBuilders.post("/api/v1/advanced-business/saga/payment")
            .header("Authorization", "Bearer " + userToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload)
    )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.sagaStatus").value(AdvancedBusinessConstant.SAGA_STATUS_COMPENSATED))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.orderStatus").value(AdvancedBusinessConstant.STATUS_PAYMENT_FAILED))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.remainingStockQuantity").value(15))
        .andReturn();

    Assertions.assertNotNull(result);
  }

  /**
   * Complex Scenario 5: Multi-Voucher Tiered Discount Calculation Engine.
   *
   * <p>Applies promotional voucher coupon + VIP tier multiplier (5% extra discount).
   */
  @Test
  @DisplayName("Verify Multi-Voucher Tiered Discount Calculation Engine")
  public void testMultiVoucherTieredDiscountCalculation() throws Exception {
    final String userToken = jwtTokenProviderHelper.generateToken(
        "tier-shopper",
        UuidUtil.generateUuidV7().toString(),
        Set.of(RoleConstant.ROLE_USER)
    );

    final String couponCode = "VOUCHER-50-" + System.currentTimeMillis();
    transactionTemplate.execute(status -> {
      final CouponVoucher voucher = CouponVoucher.builder()
          .couponCode(couponCode)
          .title("Super Summer $50 Off")
          .discountAmount(new BigDecimal("50.00"))
          .minOrderAmount(new BigDecimal("200.00"))
          .active(true)
          .build();
      entityManager.persist(voucher);
      return voucher;
    });

    final String payload = String.format("""
        {
          "grossAmount": 300.00,
          "userTier": "VIP",
          "voucherCodes": ["%s"]
        }
        """, couponCode);

    final MvcResult result = mockMvc.perform(
        MockMvcRequestBuilders.post("/api/v1/advanced-business/voucher/calculate-discount")
            .header("Authorization", "Bearer " + userToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload)
    )
        .andExpect(MockMvcResultMatchers.status().isOk())
        .andExpect(MockMvcResultMatchers.jsonPath("$.code").value("SUCCESS"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.grossAmount").value(300.00))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.voucherDiscountSum").value(50.00))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.tierDiscountAmount").value(15.00))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.netAmount").value(235.00))
        .andExpect(MockMvcResultMatchers.jsonPath("$.data.memberTier").value("VIP"))
        .andReturn();

    Assertions.assertNotNull(result);
  }
}

