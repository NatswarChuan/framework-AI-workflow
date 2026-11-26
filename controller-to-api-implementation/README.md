# NovaMart Multi-Merchant E-Commerce Backend

Enterprise multi-merchant e-commerce reference application built on **Java 21 LTS**, **Spring Boot 3.3.5**, and **Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:0.1.0`)** from **Maven Central** (`58` main `.java` files, `14` test `.java` files, `23/23` passing unit & integration tests).

---

## Architecture & Modules

Following Spring-NWVMC's **2-Directory Domain Contract** (`entity/` + `controller/`) with zero boilerplate CRUD Repositories/Services/Controllers:

| # | Module | Key Classes | Spring-NWVMC Features |
| :---: | :--- | :--- | :--- |
| **1** | **Storefront Catalog** | `StoreCategory`, `StorefrontProduct`, `StoreCategoryController`, `StorefrontProductController` | `BaseAuditEntity` (UUIDv7, `@Version`, soft-delete), `@AutoSlug`, `@UniqueField`, `@EntitySecurity`, `@FieldSecurity` (`supplierCost` nullified for `ROLE_USER`) |
| **2** | **Public Read-Only Storefront** | `PublicCatalogController`, `PublicProductCardDto`, `PublicCatalogCacheHelper` | `AutoReadApi<StorefrontProduct>`, `readDto = PublicProductCardDto.class`, `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`, `@HttpCacheable` (weak ETag + `304 Not Modified`) |
| **3** | **Multi-Tenant Merchant Isolation** | `MerchantListing`, `MerchantListingController` | `@MultiTenant(tenantField = "merchantTenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})`, fail-closed `403`, anti-spoofing, cross-tenant IDOR protection |
| **4** | **Flash-Sale Inventory Reservation** | `WarehouseStock`, `WarehouseStockController`, `StockReservationService`, `StockReservationServiceImpl`, `StockReservationHelper` | Non-final `@Lazy @Service`, `@Transactional(rollbackFor = Exception.class)`, `@DistributedLock(key = "'STOCK_' + #sku")`, `@CustomEndpoint(path = "/reserve")`, `InsufficientStockException` (`409`) |
| **5** | **Order Lifecycle** | `ShopOrder`, `ShopOrderController`, `OrderSummaryHelper`, `OrderPricingOverrideHelper` | `@AutoCode(prefix = "NVM-")`, `@StateMachine` (colon syntax + `deletableStates`), `@AuditTrail` Time-Travel, `@CustomEndpoint("/checkout-summary")`, `@ServiceOverride("/{id}/pricing-quote")` |
| **6** | **Idempotent Payment & Outbox/Webhooks** | `CheckoutPayment`, `CheckoutPaymentController`, `NovaOutboxDispatcherProvider` | `@Idempotent` (`X-Idempotency-Key`, `201` -> `409`), `@EntityWebhook`, `@PublishCloudEvent`, custom `OutboxEventDispatcherProvider` recording `ENTITY_CREATED` |
| **7** | **Dynamic Database RBAC** | `NovaRole`, `NovaPermission`, `NovaUserRole`, `NovaAccessPolicy` + 4 controllers | `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` enforcing live roles, permissions, and `DENY > ALLOW` |
| **8** | **Read-Replica Sales Analytics & L1 Cache** | `SalesAnalyticsService`, `SalesAnalyticsServiceImpl`, `SalesAnalyticsHelper`, `SalesAnalyticsDispatchHelper`, `NovaDataSourceConfig` | `DynamicRoutingDataSource` (`PRIMARY` + `REPLICA`), `@TargetDataSource(REPLICA)`, `@TargetDatabasePlatform`, `@AutoCacheable` / `@AutoCacheEvict`, mounted on `StorefrontProductController` (no `readDto`) |
| **9** | **Ecosystem Integrations** | `CatalogAiAssistantHelper`, `PartnerShippingGatewayHelper` | `ObjectProvider<T>` injection of `DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`; Dot-DSL, `/keyset`, `?fields=`, GraphQL, File Storage, Spring AI, Zod/TS SDK codegen |
| **10** | **Security Lockdown & Load Testing** | `ProductionSecurityLockdownIntegrationTest`, `src/test/jmeter/novamart-load-test.jmx` | Production `application.yml` locks down Studio & demo token endpoints (`false`); Apache JMeter smoke load suite (`1,003` requests, `0.0%` error rate) |

---

## Running Locally

### Development Mode (Dev Studio + Demo JWT enabled)
```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```
- **Swagger UI:** `http://localhost:8080/swagger-ui/index.html`
- **Dev Studio:** `http://localhost:8080/system/studio`
- **Mint Dev Demo JWT (`POST /api/v1/auth/token`, returns `200 OK` with `data.token`):**
  - **Windows (PowerShell):**
    ```powershell
    $token = (Invoke-RestMethod -Method Post "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN").data.token
    ```
  - **macOS / Linux (Bash):**
    ```bash
    ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN" | jq -r '.data.token')
    ```

### Production Baseline
`src/main/resources/application.yml` enforces:
- `app.framework.studio.enabled: false`
- `app.framework.studio.demo-token-endpoint-enabled: false`
- `app.framework.security.fail-fast-weak-jwt-secret: true`
- `app.framework.security.jwt-secret: ${JWT_SECRET}` (minimum 32 UTF-8 bytes for HS256 / 64 bytes for HS512)
- `spring.threads.virtual.enabled: true` and `spring.jpa.open-in-view: false`

---

## Verification & Apache JMeter Load Testing

### Full Unit & Integration Test Suite (`23/23` tests)
```powershell
mvn clean verify
```

### Apache JMeter Smoke Load Test (Against Live Local `dev` Server)
```powershell
# 1. Build the executable JAR first
mvn clean package -DskipTests

# 2. Start the packaged app in dev profile (in a separate terminal)
java -jar target/novamart-ecommerce-1.0.0.jar --spring.profiles.active=dev

# 3. Execute JMeter smoke load test (1,003 requests) & generate HTML dashboard (target/jmeter/reports/)
mvn -Pjmeter jmeter:configure jmeter:jmeter jmeter:results
```
