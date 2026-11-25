# Spring-NWVMC `0.1.0` — Technical Reference Manual (English)

> **Artifact Coordinates**: `io.github.natswarchuan:spring-nwvmc:0.1.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`  
> **Runtime Baseline**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **Topic Guides**: [Getting Started](topics/en/01_GETTING_STARTED.md) · [40 Endpoints](topics/en/02_REST_API_CATALOG.md) · [Query & GraphQL](topics/en/03_QUERY_AND_DATA_ACCESS.md) · [Security, Metrics & i18n](topics/en/04_ADVANCED_ENTERPRISE_FEATURES.md) · [8 SPI Customizers](topics/en/05_SPRING_ECOSYSTEM_SPIS.md) · [60 Annotations](topics/en/06_DECLARATIVE_ANNOTATIONS.md)  
> **Languages**: English | [Tiếng Việt](GUIDE_VI.md) | [日本語](GUIDE_JA.md) | [中文](GUIDE_ZH.md) | [20-Language Portal](index.html)

---

## 1. Architecture & Core Design

`controller-to-api-framework` comprises `591` main Java source files (`251` test files, `569` tests), `60` Pure Java declarative `@interface` annotations (`54` in `core/annotation/` + `6` in `module/*/annotation/`, including `18` database-driven RBAC annotations), `9` composable controller capability interfaces (`AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`), `16` `@AutoConfigurationBean` / `@ConfigurationProperties` classes (`18` groups in `META-INF/spring-configuration-metadata.json` across `20` `*Properties` classes), `21` i18n message bundles (`classpath:i18n/messages*.properties`), and AOT hints registered via `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`).

- **Decoupled Domain Contract**: Application code declares JPA `entity/` classes extending `BaseAuditEntity` (`@Version` optimistic locking returning `409 Conflict` on stale updates, `JpaAssociationReferenceUtil` FK reference resolution on detached stubs) and `controller/` interfaces extending `AutoApiController<E>` or composable subsets such as `AutoReadApi<E>` without static Spring MVC imports or generated boilerplate (standard Spring `@RequestBody`, `@RequestParam`, and `@PathVariable` bindings are also supported alongside `@AutoBody`/`@AutoParam`/`@AutoVariable`, plus `@AutoRestController(readDto, createDto, updateDto)`). Only Spring AOT (`autoconfigure/`, `common/constant/AotConstant`, `common/util/AotRuntimeHintsUtil`) and property metadata (`config/properties/`) retain compile-time Spring annotations (`10` imports across the entire framework).
- **`MethodHandle` Hot-Path Dispatch**: `MethodHandleCacheUtil` and `LambdaAccessorUtil` replace reflective `Method.invoke` overhead on controller routing and entity field mutations.
- **UUIDv7 Primary Keys (`UuidUtil.generateUuidV7`)**: Time-ordered RFC 9562 identifiers preserve sequential B-Tree locality during inserts and back $O(1)$ `/keyset` pagination.
- **Zero-Allocation Error Handling**: `GlobalExceptionHandlerHelper`, `CustomContainerErrorController` (`/error`), and `ExceptionCauseUnwrapperUtil` log full server causes internally while emitting sanitized `ApiResponse<Void>` responses with RFC 9562 UUIDv7 `X-Request-ID` and W3C `traceparent` headers.

---

## 2. Quick Start Setup

### Maven, Gradle & JitPack

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>0.1.0</version>
  </dependency>
</dependencies>
```

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
```

```xml
<!-- Direct GitHub builds via JitPack (no prior local install required) -->
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.1.0</version>
  </dependency>
</dependencies>
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
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String skuCode;

  @AutoSlug(sourceField = "productName")
  private String slug;

  @NotBlank
  private String productName;

  @PositiveOrZero
  private BigDecimal retailPrice;
}

// src/main/java/com/example/app/controller/ProductCatalogController.java
@AutoRestController(basePath = "/api/v1/product-catalogs")
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
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # Production lockdown (returns 401/404 on /system/studio*)
      demo-token-endpoint-enabled: false # Production lockdown (returns 404 on /api/v1/auth/token)
      show-i18n-diagnostics: false
    storage:
      enabled: true
      provider: LOCAL
```

---

## 4. 40 Composable REST/Streaming/Schema Contracts (`38` Default Visible)

`AutoApiController<E>` composes `9` granular capability interfaces (`AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) into `AutoApiReadController<E>` (`15` read contracts), `AutoWriteApi` + `AutoBatchApi` (`10` write/batch contracts), `AutoApiEnterpriseController<E>` (`11` workflow/increment/AI/streaming contracts), and `AutoExportImportApi<E>` (`4` CSV/JSONL export-import contracts). Controllers that need strict read-only exposure extend only `AutoReadApi<E>` (optionally decoupled with `readDto = ProductReadDto.class`):

- **Read, Analytics & Codegen (`AutoApiReadController` — `15`)**: `GET ""` (`getPage`, supports `?expand=rel1,rel2`), `GET /keyset` (`getKeysetPage`, bidirectional `ASC`/`DESC` with `size+1` probe), `GET /all` (`getAll`, bounded by `max-unpaged-fetch-limit`), `GET /count` (`count`), `GET /exists` (`exists`), `GET /aggregate` (`aggregate`), `GET /distinct` (`findDistinctValues`), `GET /top` (`findTopRecords`), `GET /group-by` (`groupByAnalytics`), `GET /metadata` (`getMetadata`), `GET /schema/typescript` (`generateTypeScript`), `GET /schema/json` (`getJsonSchema`), `GET /schema/zod` (`generateZodSchema`), `GET /schema/client` (`generateTypedApiClient`), `GET /{id}` (`getById`, non-mutating `?fields=` via `EntityCloneSnapshotHelper`).
- **Write, Batch, Upsert, Patch & Soft Delete (`AutoWriteApi` + `AutoBatchApi` — `10`)**: `POST ""` (`create`), `POST /batch` (`createBatch`), `POST /upsert` (`upsert`), `POST /upsert-batch` (`upsertBatch`), `POST /batch-chunked` (`batchChunked`), `PATCH /batch-update` (`updateBatchByFilter`), `PUT /{id}` (`update`, `@Version` optimistic locking -> `409 Conflict` on stale write), `PATCH /{id}` (`patch`), `DELETE /{id}` (`deleteById`), `POST /{id}/restore` (`restoreById`).
- **Enterprise, Increment, AI, RFC 6902 & Streaming (`AutoApiEnterpriseController` — `11`)**: `POST /{id}/transition` (`transitionState`), `POST /{id}/clone` (`cloneEntity`), `PATCH /{id}/increment` (`adjustNumericField`), `PATCH /{id}/patch-rfc6902` (`patchRfc6902`), `GET /{id}/diff` (`compareEntityDiff`), `GET /human-policy` (`getPolicySummary`), `GET /health` (`getEntityHealth`), `GET /events` (`@Hidden` `streamEvents` SSE stream), `GET /{id}/**` (`navigateSubResources`, opt-in via `enableNestedSubResources = true`), `GET /ai/context` (`getAiContext`), `POST /ai/query` (`queryAi`).
- **CSV & JSONL Bulk Export/Import (`AutoExportImportApi` — `4`)**: `GET /export/csv` (`exportCsv`), `GET /export/jsonl` (`exportJsonl`), `POST /import/csv` (`importCsv`), `POST /import/jsonl` (`importJsonl`).

Use `enabledEndpoints` / `disabledEndpoints` or `readDto`/`createDto`/`updateDto` on `@AutoRestController` to restrict exposed contracts and decouple persistence payloads per controller.

---

## 5. `@ServiceOverride`, `@CustomEndpoint` & Code Ejection

1. **Method-Level Override (`@ServiceOverride`)**: Annotate a controller method with `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` so `EscapeHatchDispatchHelper` dispatches via `MethodHandleCacheUtil` directly to a custom Spring bean.
2. **Custom Domain Endpoints (`@CustomEndpoint`)**: Bind sub-paths (`path`, `httpMethod`, `delegateBean`, `delegateMethod`) directly to independent Spring `@Component` helper beans.
3. **Standard MVC Ejection (`GET /system/studio/eject`)**: Request `GET /system/studio/eject?target=<EntityOrControllerName>` in dev mode to export 5 standalone Java files (`DTO`, `Repository`, `Service`, `ServiceImpl`, and `Controller`) via `ControllerEjectionHelper`.

---

## 6. Dynamic Query Engine, Guardrails & GraphQL

- **13 Filter Operators (`FilterOperatorConstant`)**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`.
- **Injection & DoS Guardrails (`QueryFilterParameterUtil` & `QueryGuardrailEnforcerUtil`)**: Validates safe field path regex, blocks SQLi/XSS payloads, and bounds join depth (`max-join-depth=3`), filter count (`max-filter-criteria=25`), page size (`max-page-size=200`), unpaged list cap (`max-unpaged-fetch-limit=5000`), and optional allowlists. Hibernate `ConstraintViolationException` maps to HTTP `409 Conflict`.
- **Dynamic GraphQL (`GraphQLDynamicApiController`)**: Exposes `GET /api/v1/graphql/schema`, `POST /api/v1/graphql` (supports `$variable` substitution, `query { ... }` wrappers, `__schema`/`__type` introspection, and non-mutating projection), and `GET /api/v1/graphql/explorer` (`@Hidden`).

---

## 7. Security, Resilience, Storage & Observability

- **Access Control, Database-Driven RBAC & Masking**: `@EntitySecurity` (RBAC + `ownerField` row-level security, also composable via custom meta-annotations like `@AuditedRecordSecurity`), `@FieldSecurity` (`maskPattern = "******"` or nullification), `@MultiTenant` (fail-closed HTTP `403` when tenant context is missing without bypass role, force-overwrites incoming spoofed `tenantId` on create, and validates tenant ownership across all single-ID read/write/delete/clone/diff/sub-resource calls), database-driven dynamic RBAC (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` + `@PermissionFieldMask` with explicit `DENY` > `ALLOW` priority, tenant `X-Tenant-ID`, automatic L1 Caffeine cache invalidation via `DatabaseRbacCacheInvalidationListener`, controlled by `app.framework.security.dynamic-database-rbac-enabled`), `SecurityIdentityCustomizer` (`customizeSecurityFilterChain`, `augmentSubjectAuthorities`, `evaluateCustomAuthorization`), and non-destructive `SecurityFilterChain` coexistence via `PureJavaSecurityFilterBridge`.
- **Concurrency, Caching & SPIs**: `@DistributedLock` (`DistributedLockProvider` SPI with Caffeine + `ReentrantLock` default protecting active locked mutexes), `@Idempotent` (`IdempotencyStoreProvider` SPI + atomic Caffeine `compute`/`replace`, `X-Idempotency-Key`, returns `409 ConflictBusinessException`; blank keys bypass), granular per-entity `@AutoCacheEvict(allEntries = false)` key invalidation, `TransactionalOutboxHelper` (`PENDING -> PROCESSING` atomic claim), `@RateLimit`, `@EntityCircuitBreaker` (`/api/v1/system/circuit-breakers`), `@EntityRetry`.
- **Micrometer Metrics (`DynamicEntityMetricsHelper` / `MetricConstant`, 11 metrics)**: Emits `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, `framework.outbox.dispatched.total`, `framework.realtime.active.connections` (SSE streams via `SseEmitterRegistryHelper`), and `framework.datasource.routing.total` (opt-in helper counter via `DynamicEntityMetricsHelper.recordDataSourceRouting`).
- **Storage, Events & Time-Travel**: Multi-cloud `FileStorageController` (`LOCAL`, `AWS S3`, `GCS`), `@EntityWebhook` HMAC-SHA256 dispatch, `@PublishCloudEvent`, WebSocket `/ws-connect`, and `TimeTravelDynamicApiController` (`/api/v1/system/time-travel/{entityName}/{id}`).

---

## 8. 20-Language `/system/studio` & Host i18n Customization

- **20 Supported Locale Tags (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, and `ur` activate `dir="rtl"`).
- **Locale Resolution Priority (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**:
  1. `?lang=` query parameter (`NWVMC_LANG` cookie persisted)
  2. `X-Language` HTTP header
  3. `NWVMC_LANG` cookie
  4. `Accept-Language` HTTP header
  5. Fallback to `app.framework.i18n.default-locale` (`en`). Invalid tags default cleanly to `en`.
- **Diagnostic Bar (`show-i18n-diagnostics: true`)**: Renders `#studioI18nDiagBar` inside `/system/studio` surfacing active locale, direction (`LTR`/`RTL`), loaded key counts, and missing bundle keys.

---

## 9. JMH `1.37` Microbenchmark & SBOM Verification

Measured throughput via `DynamicProxyThroughputBenchmarkTest` (`Mode.Throughput`, `ops/ms`):

| Benchmark Method | Mean Throughput |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

Generate CycloneDX `1.6` SBOM (`target/bom.json`, `128` components):

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```

---

## 10. Declarative Annotations (`60`): Attributes, Defaults & Decision Matrix

For the exhaustive specification of every attribute, Java type, default value, **How to Use**, **When to Use**, and **When NOT to Use & Pitfalls** across all `60` framework annotations, see **[60 Annotations Reference](topics/en/06_DECLARATIVE_ANNOTATIONS.md)** or the interactive inspector at **[`index.html#annotations`](index.html#annotations)**. Key decision rules for primary annotations:

| Annotation | Package | Key Attributes & Defaults | When to Use | When NOT to Use / Pitfalls |
| :--- | :--- | :--- | :--- | :--- |
| `@AutoRestController` | `core.annotation` | `basePath=""`, `path=""`, `entityName=""`, `enabledEndpoints={}`, `disabledEndpoints={}`, `enableNestedSubResources=false`, `readDto/createDto/updateDto=Void.class` | On a Java `interface` extending `AutoApiController<E>` or `AutoReadApi<E>` to publish zero-boilerplate CRUD/analytics routes. | Never place on concrete `@RestController` classes or headless workflows without a JPA entity; prefer `AutoReadApi<E>` for public catalogs. |
| `@ServiceOverride` | `core.annotation` | `targetBean=Void.class`, `beanName=""`, `methodName=""`, `bypassAutoDispatch=true` | Redirect individual proxy methods to a custom Spring bean when validation/pricing diverges from default CRUD. | Do not use for non-standard URLs — use `@CustomEndpoint`. Do not pass a string name to `targetBean` (`targetBean` requires `Class<?>`; string names use `beanName`). |
| `@CustomEndpoint` | `core.annotation` | `path=""`, `httpMethod="GET"`, `delegateBean=""`, `delegateMethod=""`, `summary=""`, `description=""` | Domain workflows (`POST /checkout`, `POST /approve`) alongside auto-CRUD routes. | `delegateBean` must match a Spring `@Component` / `@Service` bean name (not internal `@AutoService`); dispatches before `invokeProtectedOperation` (`ControllerProxySpecialRouteUtil`). |
| `@EntitySecurity` | `core.annotation` | `readRoles={}`, `writeRoles={}`, `deleteRoles={}`, `permitAll=false`, `ownerField=""`, `bypassOwnerRoles={"ROLE_ADMIN","ROLE_SUPER_ADMIN"}`, `permissions={}` | Mandatory RBAC + owner-scoped row isolation on persistent entities. | `permitAll = true` bypasses checks across **all** CRUD methods (unless overridden by `@SecurityPolicyEntity`), so always pair with `AutoReadApi<E>` or `disabledEndpoints` on public catalogs. |
| `@FieldSecurity` | `core.annotation` | `viewRoles={}`, `maskPattern="******"`, `nullifyInsteadOfMask=false` | Hide or mask PII/secrets (`phone`, `taxId`, `salary`) dynamically per caller role. | Non-`String` fields (`BigDecimal`, `LocalDate`, `UUID`) are already set to `null` automatically by `FieldMaskingExecutionHelper`; use `nullifyInsteadOfMask = true` when **`String`** fields should serialize as `null` instead of `maskPattern`. |
| `@MultiTenant` | `core.annotation` | `tenantField="tenantId"`, `bypassTenantRoles={"ROLE_SUPER_ADMIN"}` | SaaS tenant isolation (`403` fail-closed if tenant missing; blocks cross-tenant IDOR). | Do not apply to shared global lookup tables (currencies, countries) consumed across tenants. |
| `@StateMachine` | `core.annotation` | `initial="ACTIVE"`, `transitions={}`, `deletableStates={}` | Order/payment/workflow entities enforcing legal state transitions and delete guards. | Leave off static catalog tables that have no workflow states; always list terminal deletable states explicitly in `deletableStates`. |
| `@DistributedLock` | `module.lock.annotation` | `key=""`, `waitTimeMs=3000L`, `leaseTimeMs=5000L` | Prevent race conditions on SKU stock, wallet balance, or voucher redemption via SpEL `key`. | Never rely on empty `key = ""` across multiple entity types under high contention; supply a narrow SpEL key such as `"'sku:' + #skuCode"`. |
| `@Idempotent` | `core.annotation` | `headerName="X-Idempotency-Key"`, `ttlSeconds=300L` | Payment/order creation endpoints prone to retries or double-clicks (`409` on replay). | Avoid on read-only `GET` endpoints; blank `X-Idempotency-Key` headers bypass deduplication unless enforced by client contract. |
| `@RateLimit` | `core.annotation` | `requests=60`, `windowSeconds=60`, `partitionKey="IP"` | Public login, export, AI query, or surge protection by `"IP"` / `"USER"` / `"TENANT"` / `"GLOBAL"` / `#expr` SpEL. | Avoid `"GLOBAL"` when callers must stay isolated (`"USER"` falls back to client IP when anonymous); emits `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and `Retry-After` on `429`. |
| `@HttpCacheable` | `module.cache.http.annotation` | `maxAgeSeconds=60`, `isPrivate=false`, `mustRevalidate=true`, `generateETag=true` | Public read responses benefiting from RFC 7232 weak `W/"..."` ETag + `304 Not Modified`. | Never set `isPrivate = false` on tenant- or user-specific private endpoints; CDN/shared caches could leak responses. |
| `@SecurityRoleEntity` & 17 DB-RBAC | `core.annotation` | `cacheTtlSeconds=60L` (`@SecurityRoleEntity`/`@SecurityPermissionEntity`), `enabled=true` (`@SecurityUserRoleEntity`), `priority=100` (`@SecurityPolicyEntity`), 14 marker field/method annotations | Runtime-editable roles, permissions, field masks, and explicit `DENY > ALLOW` rules stored in DB. | Both missing mandatory markers and duplicated single-valued markers (`> 1` property per class) fail fast at startup via `DatabaseRbacFailFastValidatorUtil`. |

---

## 10. Universal AI-Agent Adoption Kit (`ai-agent-kit/` & `llms.txt`)

> Full guide: [07. AI-Agent Adoption Kit](topics/en/07_AI_AGENT_ADOPTION_KIT.md) · Interactive portal: [`docs/index.html#ai-agent-kit`](index.html#ai-agent-kit) · LLM index: [`llms.txt`](../llms.txt)

Use the model-agnostic **AI-Agent Adoption Kit** (`INTRO.md`, `RULES.md`, `SKILL.md`, `CHECKLIST.md`, 5 machine-verified `references/01..05`, and 8 drop-in `adapters/`) so **any AI coding agent or LLM** (Antigravity/Gemini, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Windsurf, Cline/Roo Code, ChatGPT, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider) integrates Spring-NWVMC `v0.1.0` accurately without hallucinating annotations or hitting runtime pitfalls:

```bash
# Windows (PowerShell)
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all

# macOS / Linux / Git Bash
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
```
