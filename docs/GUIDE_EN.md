# Spring-NWVMC `1.0.0` — Technical Reference Manual (English)

> **Artifact Coordinates**: `io.github.natswarchuan:spring-nwvmc:1.0.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v1.0.0`  
> **Runtime Baseline**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **Topic Guides**: [Getting Started](topics/en/01_GETTING_STARTED.md) · [40 Endpoints](topics/en/02_REST_API_CATALOG.md) · [Query & GraphQL](topics/en/03_QUERY_AND_DATA_ACCESS.md) · [Security, Metrics & i18n](topics/en/04_ADVANCED_ENTERPRISE_FEATURES.md) · [8 SPI Customizers](topics/en/05_SPRING_ECOSYSTEM_SPIS.md) · [42 Annotations](topics/en/06_DECLARATIVE_ANNOTATIONS.md)  
> **Languages**: English | [Tiếng Việt](GUIDE_VI.md) | [日本語](GUIDE_JA.md) | [中文](GUIDE_ZH.md) | [20-Language Portal](index.html)

---

## 1. Architecture & Core Design

`controller-to-api-framework` comprises `528` main Java source files, `42` Pure Java declarative `@interface` annotations, `20` `@ConfigurationProperties` / `@AutoConfigurationBean` models with generated `META-INF/spring-configuration-metadata.json`, `21` i18n message bundles (`classpath:i18n/messages*.properties`), and AOT hints registered via `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`).

- **Decoupled Domain Contract**: Application code declares JPA `entity/` classes extending `BaseAuditEntity` and `controller/` interfaces extending `AutoApiController<E>` without static Spring MVC imports or generated boilerplate. Only Spring AOT (`core/aot/`) and property metadata (`config/properties/`) retain compile-time Spring annotations (`10` imports across the entire framework).
- **`MethodHandle` Hot-Path Dispatch**: `MethodHandleCacheUtil` and `LambdaAccessorUtil` replace reflective `Method.invoke` overhead on controller routing and entity field mutations.
- **UUIDv7 Primary Keys (`UuidUtil.generateUuidV7`)**: Time-ordered RFC 9562 identifiers preserve sequential B-Tree locality during inserts and back $O(1)$ `/keyset` pagination.
- **Zero-Allocation Error Handling**: `GlobalExceptionHandlerHelper`, `CustomContainerErrorController` (`/error`), and `ExceptionCauseUnwrapperUtil` log full server causes internally while emitting sanitized `ApiResponse<Void>` responses with RFC 9562 UUIDv7 `X-Request-ID` and W3C `traceparent` headers.

---

## 2. Quick Start Setup

### Maven & Gradle

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:1.0.0")
}
```

### Two-Directory Consumer Example

```java
// src/main/java/com/example/app/entity/ProductCatalog.java
@Entity
@Table(name = "tbl_product_catalog")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @AutoSlug(sourceField = "name")
  private String slug;

  @NotBlank
  private String name;

  @PositiveOrZero
  private BigDecimal unitPrice;
}

// src/main/java/com/example/app/controller/ProductCatalogController.java
@AutoRestController(path = "/api/v1/product-catalogs")
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 3. Configuration Properties (`app.framework.*`)

Full IDE autocompletion and validation ship via `spring-boot-configuration-processor`:

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    base-path-prefix: /api/v1
    default-page-size: 20
    max-page-size: 100
    eager-fetch-singular-relations: true
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # Production lockdown (returns 401 on /system/studio*)
      demo-token-endpoint-enabled: false # Production lockdown (returns 404 on /api/v1/auth/token)
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
    storage:
      enabled: true
      provider: LOCAL
```

---

## 4. 40 Generated REST/Streaming/Schema Contracts (`38` Default Visible)

`AutoApiController<E>` inherits `AutoApiReadController<E>` (`17` contracts), declares `11` mutation/restore contracts, and inherits `AutoApiEnterpriseController<E>` (`12` contracts):

- **Read, Analytics & Codegen (`17`)**: `GET ""` (`list`), `GET /keyset`, `GET /all`, `GET /count`, `GET /exists`, `GET /aggregate`, `GET /distinct`, `GET /top`, `GET /group-by`, `GET /export/csv`, `GET /export/jsonl`, `GET /metadata`, `GET /schema/typescript`, `GET /schema/json`, `GET /schema/zod`, `GET /schema/client`, `GET /{id}`.
- **Write, Batch, Patch & Soft Delete (`11`)**: `POST ""`, `POST /batch`, `POST /upsert`, `POST /upsert-batch`, `POST /batch-chunked`, `PATCH /{id}/increment`, `PATCH /batch-update`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `POST /{id}/restore`.
- **Enterprise, AI, RFC 6902 & Streaming (`12`)**: `POST /{id}/transition`, `POST /{id}/clone`, `GET /events` (`@Hidden` SSE stream), `GET /ai/context`, `POST /ai/query`, `GET /human-policy`, `GET /health`, `POST /import/csv`, `POST /import/jsonl`, `PATCH /{id}/patch-rfc6902`, `GET /{id}/diff`, `GET /{id}/**` (opt-in via `enableNestedSubResources = true`).

Use `enabledEndpoints` / `disabledEndpoints` on `@AutoRestController` to restrict exposed contracts by method name or group (`READ`, `WRITE`, `DELETE`, `BATCH`, `ANALYTICS`, `EXPORT`, `AI`, `STREAM`, `SCHEMA`, `SUB_RESOURCE`).

---

## 5. `@ServiceOverride`, `@CustomEndpoint` & Code Ejection

1. **Method-Level Override (`@ServiceOverride`)**: Annotate a controller method with `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` so `EscapeHatchDispatchHelper` dispatches via `MethodHandleCacheUtil` directly to a custom `@AutoService` / `@Service` bean.
2. **Custom Domain Endpoints (`@CustomEndpoint`)**: Bind sub-paths (`path`, `httpMethod`, `delegateBean`, `delegateMethod`) directly to independent Spring `@AutoComponent` helper beans.
3. **Standard MVC Ejection (`GET /system/studio/eject`)**: Request `GET /system/studio/eject?target=<EntityOrControllerName>` in dev mode to export standalone `Controller`, `Service`, `ServiceImpl`, and `Repository` Java classes via `ControllerEjectionHelper`.

---

## 6. Dynamic Query Engine, Guardrails & GraphQL

- **13 Filter Operators (`FilterOperatorConstant`)**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`.
- **Injection & DoS Guardrails (`QueryFilterParameterUtil` & `QueryGuardrailEnforcerUtil`)**: Validates safe field path regex, blocks SQLi/XSS payloads, and bounds join depth (`max-join-depth=3`), filter count (`max-filter-criteria=25`), page size (`max-page-size=200`), and optional allowlists.
- **Dynamic GraphQL (`GraphQLDynamicApiController`)**: Exposes `GET /api/v1/graphql/schema`, `POST /api/v1/graphql`, and `GET /api/v1/graphql/explorer` (`@Hidden`).

---

## 7. Security, Resilience, Storage & Observability

- **Access Control & Masking**: `@EntitySecurity` (RBAC + `ownerField` row-level security), `@FieldSecurity` (`maskPattern = "******"` or nullification), `@MultiTenant`, and `SecurityFilterChainBridge` (stateless JWT + CORS `*` supporting `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`).
- **Concurrency & Resilience**: `@DistributedLock`, `@Idempotent` (`X-Idempotency-Key`, TTL `300L`), `@RateLimit`, `@EntityCircuitBreaker` (`/api/v1/system/circuit-breakers`), `@EntityRetry`.
- **Micrometer Metrics (`DynamicEntityMetricsHelper` / `MetricConstant`)**: Emits `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, and `framework.datasource.routing.total`.
- **Storage, Events & Time-Travel**: Multi-cloud `FileStorageController` (`LOCAL`, `AWS S3`, `GCS`), `@EntityWebhook` HMAC-SHA256 dispatch, `@PublishCloudEvent`, WebSocket `/ws-connect`, and `TimeTravelDynamicApiController` (`/api/v1/system/time-travel/{entityName}/{id}`).

---

## 8. 20-Language `/system/studio` & Host i18n Customization

- **20 Supported Locale Tags (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, and `ur` activate `dir="rtl"`).
- **Locale Resolution Priority (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**:
  1. `?lang=` query parameter (`NWVMC_LANG` cookie persisted)
  2. `NWVMC_LANG` cookie
  3. `X-Language` HTTP header
  4. `Accept-Language` HTTP header
  5. Fallback to `app.framework.i18n.default-locale` (`en`). Invalid tags default cleanly to `en`.
- **Diagnostic Bar (`show-i18n-diagnostics: true`)**: Renders `#studioI18nDiagBar` inside `/system/studio` surfacing active locale, direction (`LTR`/`RTL`), loaded key counts, and missing bundle keys.

---

## 9. JMH `1.37` Microbenchmark & SBOM Verification

Measured throughput via `DynamicProxyThroughputBenchmarkTest` (`Mode.Throughput`, `ops/ms`):

| Benchmark Method | Mean Throughput |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |

Generate CycloneDX SBOM (`target/bom.json`):

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```
