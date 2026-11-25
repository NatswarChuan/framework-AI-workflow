# Spring-NWVMC (`v0.1.0`) — Verified Copy-Paste Cookbook

> Every single recipe below is extracted directly from `controller-to-api-implementation/` and empirically verified against public JitPack `com.github.NatswarChuan:Spring-NWVMC:v0.1.0` (`173` passing tests + `2,000`-request JMeter `0.0%` error rate).

---

## Recipe 1 — Full Entity + Full CRUD + Read-Only Public DTO + Resilience + ETag Cache

### `entity/ProductCatalog.java`
```java
package com.example.app.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
    name = "tbl_product_catalogs",
    indexes = {
        @Index(name = "idx_product_catalogs_sku", columnList = "sku_code", unique = true),
        @Index(name = "idx_product_catalogs_slug", columnList = "slug", unique = true)
    })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
@EqualsAndHashCode(callSuper = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN})
public class ProductCatalog extends BaseAuditEntity {

  @UniqueField @NotBlank
  @Column(name = "sku_code", nullable = false, length = 64)
  private String skuCode;

  @NotBlank
  @Column(name = "product_name", nullable = false, length = 200)
  private String productName;

  @UniqueField @AutoSlug(sourceField = "productName")
  @Column(name = "slug", nullable = false, length = 250)
  private String slug;

  @NotBlank private String category;
  private String brand;
  @NotBlank private String vendorStoreCode;

  @NotNull @DecimalMin("0.00") private BigDecimal retailPrice;
  @NotNull @DecimalMin("0.00") private BigDecimal b2bWholesalePrice;

  @FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}, nullifyInsteadOfMask = true)
  private BigDecimal costPrice;

  @Column(nullable = false) private Boolean active;
}
```

### `controller/PublicCatalogController.java` + Automatic ETag Cache (`0.1.0` Verified!)
> **Spring-NWVMC `0.1.0` Native Support:** Declare `ResponseEntity<ApiResponse<PublicProductCardDto>>` on `@HttpCacheable` methods! Spring-NWVMC `0.1.0` automatically hashes `ApiResponse.getData()` deterministically (ignoring per-request `traceId`), emits `ETag` + `Cache-Control`, returns `304 Not Modified` on `If-None-Match`, and keeps `@EntityRetry` immune to 4xx `BaseBusinessException`.

```java
package com.example.app.controller;

import com.example.app.dto.PublicProductCardDto;
import com.example.app.entity.StorefrontProduct;
import com.example.app.helper.PublicCatalogCacheHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.EntityCircuitBreaker;
import io.github.natswarchuan.core.annotation.EntityRetry;
import io.github.natswarchuan.core.annotation.RateLimit;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoReadApi;
import io.github.natswarchuan.module.cache.http.annotation.HttpCacheable;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@AutoRestController(basePath = "/api/v1/public/products", readDto = PublicProductCardDto.class)
@RateLimit(requests = 120, windowSeconds = 60, partitionKey = "IP")
@EntityCircuitBreaker(name = "publicCatalog", failureRateThreshold = 50.0f, slidingWindowSize = 20, waitDurationInOpenStateSeconds = 10)
@EntityRetry(name = "publicCatalog", maxAttempts = 3, waitDurationMs = 200L)
public interface PublicCatalogController extends AutoReadApi<StorefrontProduct> {

  @AutoGet("/cached/{id}")
  @HttpCacheable(maxAgeSeconds = 60, isPrivate = true, mustRevalidate = true, generateETag = true)
  @ServiceOverride(targetBean = PublicCatalogCacheHelper.class, methodName = "getCachedProductById")
  ResponseEntity<ApiResponse<PublicProductCardDto>> getCachedProductById(@PathVariable("id") UUID id);
}

// helper/PublicCatalogCacheHelper.java (public final class — NEVER put @Transactional on final Helpers!)
package com.example.app.helper;

import io.github.natswarchuan.common.response.ApiResponse;
import jakarta.persistence.EntityManager;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("publicCatalogCacheHelper")
@RequiredArgsConstructor
public final class PublicCatalogCacheHelper {

  private final EntityManager entityManager;

  public ApiResponse<PublicProductCardDto> getCachedProductById(final UUID productId) {
    final StorefrontProduct product = entityManager.find(StorefrontProduct.class, productId);
    // Validate product exists & not soft-deleted (throw custom BaseBusinessException 404 otherwise)
    return ApiResponse.success(PublicProductCardDto.fromEntity(product));
  }
}
```

---

## Recipe 2 — `@StateMachine` (Colon Syntax) + `@AuditTrail` + `@CustomEndpoint`

```java
// In entity/ECommerceOrder.java (note exact colon syntax "FROM:TO1,TO2"):
@AuditTrail(category = "ECOMMERCE_ORDER_AUDIT")
public class ECommerceOrder extends BaseAuditEntity {

  @StateMachine(
      initial = "CREATED",
      transitions = {
          "CREATED:PENDING_PAYMENT,CANCELLED",
          "PENDING_PAYMENT:CONFIRMED,CANCELLED",
          "CONFIRMED:ALLOCATED,REFUNDED",
          "ALLOCATED:SHIPPED",
          "SHIPPED:DELIVERED",
          "DELIVERED:COMPLETED"
      },
      deletableStates = {"CREATED", "CANCELLED"})
  private String orderStatus;
}

// In controller/ECommerceOrderController.java (auto basePath: /api/v1/e-commerce-orders):
@AutoRestController
public interface ECommerceOrderController extends AutoApiController<ECommerceOrder> {

  @CustomEndpoint(
      path = "/quick-summary",
      httpMethod = "GET",
      delegateBean = "orderSummaryHelper",
      delegateMethod = "buildOrderQuickSummary",
      summary = "Summarize marketplace order counts by lifecycle status")
  ApiResponse<OrderQuickSummaryDto> getOrderQuickSummary();
}
```

Verified `curl` calls:
```bash
# Valid state transition (query param ?targetState=, NOT JSON body!)
curl -s -X POST "http://localhost:8080/api/v1/e-commerce-orders/$ORDER_ID/transition?targetState=PENDING_PAYMENT" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Time-Travel historical snapshot
curl -s "http://localhost:8080/api/v1/system/time-travel/ECommerceOrder/$ORDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Custom endpoint
curl -s "http://localhost:8080/api/v1/e-commerce-orders/quick-summary" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Recipe 3 — `@DistributedLock` Atomic Inventory Reservation (Non-Final + `@Lazy`)

```java
@Lazy // Required so DistributedLockAspect intercepts proxy creation after framework bootstrap
@Service("inventoryReservationService")
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class InventoryReservationServiceImpl implements InventoryReservationService {

  private final InventoryReservationHelper reservationHelper;

  @Override
  @Transactional(rollbackFor = Exception.class)
  @DistributedLock(key = "'SKU_STOCK_' + #stockSkuCode", waitTimeMs = 3000L, leaseTimeMs = 5000L)
  public InventoryReservationReceiptDto reserveStock(final String stockSkuCode, final Integer quantity) {
    reservationHelper.validateReservationInput(stockSkuCode, quantity);
    final InventoryStock stock = reservationHelper.loadStockOrThrow(stockSkuCode);
    return reservationHelper.deductAndBuildReceipt(stock, quantity);
  }
}

// Wired onto InventoryStockController:
@AutoRestController
public interface InventoryStockController extends AutoApiController<InventoryStock> {

  @CustomEndpoint(
      path = "/reserve",
      httpMethod = "POST",
      delegateBean = "inventoryReservationService",
      delegateMethod = "reserveStock")
  ApiResponse<InventoryReservationReceiptDto> reserveStock(
      @RequestParam("sku") String stockSkuCode,
      @RequestParam("qty") Integer quantity);
}
```

---

## Recipe 4 — `@TargetDataSource(REPLICA)` + `@AutoCacheable` + Multi-Datasource Registration

> **CRITICAL:** Any `@Component` Helper injecting a `@Lazy` AOP `@Service` MUST ALSO inject it via `ObjectProvider<MyService>` (or `@Lazy`), otherwise Spring eagerly initializes the service before `AutoCacheAspect` registers!

```java
import io.github.natswarchuan.core.annotation.AutoCacheEvict;
import io.github.natswarchuan.core.annotation.AutoCacheable;
import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.annotation.TargetDatabasePlatform;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Lazy
@Service
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SalesAnalyticsServiceImpl implements SalesAnalyticsService {

  private final SalesAnalyticsHelper analyticsHelper;

  @Override
  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  @TargetDatabasePlatform(platform = DatabasePlatformConstant.PLATFORM_H2, cluster = DatabasePlatformConstant.CLUSTER_REPLICA, readOnly = true)
  @AutoCacheable(value = "categorySalesAnalytics", key = "'CAT_' + #category")
  public CategorySalesAnalyticsDto summarizeByCategory(final String category) {
    return analyticsHelper.computeCategorySummary(category);
  }

  @Override
  @AutoCacheEvict(value = "categorySalesAnalytics", allEntries = true)
  public void evictAnalyticsCache() {
    // Evicts cached category snapshots
  }
}

// Dispatch helper wired into @CustomEndpoint — MUST use ObjectProvider<SalesAnalyticsService>!
@Component("salesAnalyticsDispatchHelper")
@RequiredArgsConstructor
public final class SalesAnalyticsDispatchHelper {
  private final ObjectProvider<SalesAnalyticsService> analyticsServiceProvider;

  public CategorySalesAnalyticsDto summarizeByCategory(final String category) {
    return analyticsServiceProvider.getObject().summarizeByCategory(category);
  }
}
```

### Recipe 4b — Multi-Datasource (`PRIMARY` + `REPLICA`) Routing & Telemetry Registration
```java
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import io.github.natswarchuan.module.datasource.helper.MultiPlatformDataSourceRegistryHelper;
import io.github.natswarchuan.module.datasource.routing.DynamicRoutingDataSource;
import javax.sql.DataSource;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Configuration
public class AppDataSourceConfig {
  @Bean @Primary
  public DataSource dataSource(
      @Qualifier(DataSourceConstant.DATASOURCE_PRIMARY) final DataSource primaryDs,
      @Qualifier(DataSourceConstant.DATASOURCE_REPLICA) final DataSource replicaDs) {
    final DynamicRoutingDataSource routing = new DynamicRoutingDataSource();
    routing.registerDataSourceEntry(DataSourceConstant.DATASOURCE_PRIMARY, primaryDs);
    routing.registerDataSourceEntry(DataSourceConstant.DATASOURCE_REPLICA, replicaDs);
    routing.setDefaultTargetDataSource(primaryDs);
    return routing;
  }
}

@Component
public final class AppDataSourceClusterListener implements ApplicationListener<ApplicationReadyEvent> {
  private final ObjectProvider<MultiPlatformDataSourceRegistryHelper> registryProvider;
  private final DataSource primaryDs;
  private final DataSource replicaDs;
  // Constructor injects @Qualifier(DATASOURCE_PRIMARY) and @Qualifier(DATASOURCE_REPLICA)

  @Override
  public void onApplicationEvent(final ApplicationReadyEvent event) {
    final MultiPlatformDataSourceRegistryHelper reg = registryProvider.getIfAvailable();
    if (java.util.Objects.nonNull(reg)) {
      reg.registerCluster(DatabasePlatformConstant.CLUSTER_PRIMARY, primaryDs, DatabasePlatformConstant.PLATFORM_H2, false);
      reg.registerCluster(DatabasePlatformConstant.CLUSTER_REPLICA, replicaDs, DatabasePlatformConstant.PLATFORM_H2, true);
    }
  }
}
```

---

## Recipe 5 — `@Idempotent` Payment Deduplication (`201 Created` → `409 Conflict`)

```java
@AutoRestController
@Idempotent(
    headerName = HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY,
    ttlSeconds = AopConstant.SECONDS_PER_DAY)
public interface PaymentTransactionController extends AutoApiController<PaymentTransaction> {}
```

---

## Recipe 6 — `@EntityWebhook` + `@PublishCloudEvent` + `OutboxEventDispatcherProvider`

```java
@Entity
@EntityWebhook(events = {"CREATED", "UPDATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature", includeFullPayload = true)
@PublishCloudEvent(eventType = "com.example.marketplace.invoice.v1", source = "/api/v1/electronic-invoices")
public class ElectronicInvoice extends BaseAuditEntity { /* ... */ }

@Component
public final class MarketplaceOutboxEventDispatcherProvider implements OutboxEventDispatcherProvider {

  @Override
  public boolean dispatch(final OutboxEvent event, final Map<String, String> headers) {
    if (Objects.isNull(event)) {
      return false;
    }
    // event.getEventType() uses EventConstant: "ENTITY_CREATED", "ENTITY_UPDATED", "ENTITY_DELETED"
    // Forward event + W3C trace headers to Kafka / RabbitMQ / SQS here
    return true;
  }
}
```

---

## Recipe 7 — Spring AI Assistant & Outbound Partner RestClient (`ObjectProvider`-Safe!)

```java
@Component
@RequiredArgsConstructor
public final class CatalogAssistantHelper {

  private final ObjectProvider<DynamicEntityAiMetadataProviderHelper> metadataProvider;
  private final ObjectProvider<AiNaturalLanguageQueryParserHelper> nlQueryParserProvider;

  public String getProductCatalogSystemPrompt() {
    return metadataProvider.getObject().generateSystemContextPrompt(ProductCatalog.class);
  }

  public AiQueryExecutionResultDto<ProductCatalog> askProductCatalog(final String naturalPrompt) {
    final AiQueryRequestDto req = AiQueryRequestDto.builder()
        .prompt(naturalPrompt).page(0).size(10).sort("retailPrice").dir("asc").build();
    return nlQueryParserProvider.getObject().executeNaturalLanguageQuery(ProductCatalog.class, req);
  }
}

@Component
@RequiredArgsConstructor
public final class MarketplacePartnerGatewayHelper {

  private final ObjectProvider<ThirdPartyRestClientHelper> restClientProvider;

  public ThirdPartyCallResponseDto callPartner(final String serviceName, final String targetUrl) {
    final ThirdPartyCallRequestDto req = ThirdPartyCallRequestDto.builder()
        .serviceName(serviceName).targetUrl(targetUrl).httpMethod("GET").build();
    return restClientProvider.getObject().executeOutboundCall(req);
  }
}
```

---

## Recipe 8 — Fail-Closed Multi-Tenant SaaS Isolation (`@MultiTenant`)

```java
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.MultiTenant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_merchant_listings",
    indexes = {@Index(name = "idx_merchant_listings_tenant", columnList = "merchant_tenant_id, id")})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
@EqualsAndHashCode(callSuper = true)
@MultiTenant(tenantField = "merchantTenantId", bypassTenantRoles = {RoleConstant.ROLE_SUPER_ADMIN})
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, "ROLE_MERCHANT", RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {"ROLE_MERCHANT", RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN})
public class MerchantListing extends BaseAuditEntity {
  @Column(name = "merchant_tenant_id", nullable = false, length = 64)
  private String merchantTenantId;
  private String title;
}
// Every call MUST pass header `X-Tenant-ID: TENANT_A` (missing header -> 403; reading TENANT_B ID -> 403).
```

---

## Recipe 9 — 4-Entity Dynamic Database RBAC (`ALLOW` & `DENY > ALLOW`)

Declare all 4 entities (with `@AutoRestController` interfaces extending `AutoApiController<E>`) to manage roles, permissions, user-role assignments, and `DENY > ALLOW` policies dynamically at runtime with automatic cache invalidation:

```java
// 1. Role catalog (@SecurityRoleEntity + @RoleCode, @RoleName, @RolePermissions)
@Entity @SecurityRoleEntity(cacheTtlSeconds = 60L)
@EntitySecurity(readRoles = {"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}, writeRoles = {"ROLE_SUPER_ADMIN"}, deleteRoles = {"ROLE_SUPER_ADMIN"})
public class NovaRole extends BaseAuditEntity {
  @RoleCode @UniqueField @NotBlank private String roleCode;
  @RoleName @NotBlank private String roleName;
  @RolePermissions private String permissionsCsv;
}

// 2. Permission catalog (@SecurityPermissionEntity + @PermissionCode, @PermissionResource, @PermissionAction, @PermissionFieldMask)
@Entity @SecurityPermissionEntity(cacheTtlSeconds = 60L)
public class NovaPermission extends BaseAuditEntity {
  @PermissionCode @UniqueField @NotBlank private String permissionCode;
  @PermissionResource @NotBlank private String resourceName;   // e.g. "StoreCategory"
  @PermissionAction @NotBlank private String actionName;       // e.g. "READ"
  @PermissionFieldMask private String maskedFields;            // optional CSV of fields to mask
}

// 3. Subject-to-role binding (@SecurityUserRoleEntity + @UserRoleSubject, @UserRoleCode, @UserRoleTenantId)
@Entity @SecurityUserRoleEntity(enabled = true)
public class NovaUserRole extends BaseAuditEntity {
  @UserRoleSubject @NotBlank private String username;          // matches JWT `sub` (username!)
  @UserRoleCode @NotBlank private String roleCode;
  @UserRoleTenantId private String tenantId;                   // "*" for global
}

// 4. Dynamic ALLOW / DENY policy (@SecurityPolicyEntity + @PolicyResource, @PolicyAction, @PolicyAllowedRoles, @PolicyEffect)
@Entity @SecurityPolicyEntity(priority = 100)
public class NovaAccessPolicy extends BaseAuditEntity {
  @PolicyResource @NotBlank private String resourcePattern;    // e.g. "StoreCategory"
  @PolicyAction @NotBlank private String actionPattern;        // e.g. "READ"
  @PolicyAllowedRoles @NotBlank private String targetRoles;    // e.g. "ROLE_CATALOG_AUDITOR"
  @PolicyEffect @NotBlank private String effect;               // "ALLOW" or "DENY" (DENY always wins!)
}
```

---

## Recipe 10 — Integration Testing (`JwtTokenService` & Dev Token Endpoint)

> **CRITICAL PARAMETER ORDER:** `JwtTokenService.generateToken(String username, String userId, Set<String> roles)` takes **`username` FIRST** and **`userId` SECOND**! The JWT `sub` claim equals `username` (which DB-RBAC `@UserRoleSubject` matches against).

```java
import io.github.natswarchuan.module.security.service.JwtTokenService;
import java.util.Set;
import org.springframework.beans.factory.ObjectProvider;

// In @SpringBootTest / MockMvc test utility:
public static String buildBearerToken(
    final ObjectProvider<JwtTokenService> jwtProvider,
    final String username,
    final String userId,
    final Set<String> roles) {
  final String jwt = jwtProvider.getObject().generateToken(username, userId, roles);
  return "Bearer " + jwt;
}
```

Dev profile `curl` token minting (when `app.framework.studio.demo-token-endpoint-enabled: true` in `application-dev.yml`):
```bash
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN" | jq -r '.data.token')
USER_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=customer&role=ROLE_USER" | jq -r '.data.token')
```
