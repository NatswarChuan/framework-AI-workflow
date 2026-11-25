---
name: spring-nwvmc-adoption
description: >-
  Complete, empirically verified runbook for adopting, extending, securing, and debugging
  Spring-NWVMC (v0.1.0) in Java 21 + Spring Boot 3.x projects. Activate whenever a user asks
  to add Spring-NWVMC to a project, create @AutoRestController APIs, configure @EntitySecurity /
  @FieldSecurity / @MultiTenant / DB-RBAC / @StateMachine / @CustomEndpoint / @ServiceOverride /
  @DistributedLock / @Idempotent / @TargetDataSource / @AutoCacheable / @HttpCacheable /
  @EntityWebhook / @PublishCloudEvent / GraphQL / File Storage / Spring AI / Zod-TypeScript codegen,
  or troubleshoot Spring-NWVMC startup or runtime errors.
---

# Spring-NWVMC (`v0.1.0`) — Master AI-Agent Adoption Skill

This skill guides any AI coding agent step by step to integrate **Spring-NWVMC `0.1.0` / `v0.1.0`** accurately on the first try, using only real, verified APIs from the framework and reference implementation (`173` passing tests + `2,000`-request JMeter `0.0%` error rate).

## Progressive Disclosure References (Load On Demand)

Before emitting annotations, YAML keys, endpoint routes, or complex patterns, read the relevant reference file instead of guessing:

1. **[references/01-annotations-exact-matrix.md](./references/01-annotations-exact-matrix.md)** — All **60 real annotations** across their **6 exact Java packages**, all **133 attributes**, Java types, defaults, copy-paste examples, and caveats.
2. **[references/02-endpoints-and-query-dsl.md](./references/02-endpoints-and-query-dsl.md)** — All **40 auto-generated endpoints**, **13 dot-syntax query operators**, GraphQL, File Storage, Time-Travel, System Telemetry, and verified `curl` commands.
3. **[references/03-yaml-properties-and-profiles.md](./references/03-yaml-properties-and-profiles.md)** — Exact `app.framework.*` and `spring-nwvmc.human-policies.*` YAML properties, defaults, `prod` lockdown, and `dev` studio profiles.
4. **[references/04-cookbook-verified-patterns.md](./references/04-cookbook-verified-patterns.md)** — Copy-paste-runnable Java + YAML + test recipes (including `@MultiTenant`, 4-entity DB-RBAC, Multi-Datasource, `@HttpCacheable` helper, and `JwtTokenService` testing).
5. **[references/05-imports-and-spi-contracts.md](./references/05-imports-and-spi-contracts.md)** — Exact non-annotation class, constant, DTO, Helper, and SPI imports & signatures (eliminates `javap` lookups completely).

For orientation, rules, and pre-handover sign-off, see [INTRO.md](./INTRO.md), [RULES.md](./RULES.md), and [CHECKLIST.md](./CHECKLIST.md).

---

## Mandatory Anti-Hallucination Reminders (Check Every Time)

1. **Java 21 + `<parameters>true</parameters>`** in `maven-compiler-plugin` is mandatory.
2. **`@StateMachine.transitions`** uses **COLON syntax** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), NEVER `"FROM -> TO"`. Transitions are invoked with **query parameter** `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT`, NOT JSON body.
3. **Query operators** use **DOT syntax** (`retailPrice.gte=1000&productName.like=MacBook`), NEVER `__gte`.
4. **Kebab-case base paths:** `ECommerceOrder` → `/api/v1/e-commerce-orders`; specify `@AutoRestController(basePath = "...")` if you want a custom URI.
5. **Framework `@AutoComponent` helpers** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) MUST be injected via **`ObjectProvider<T>`** inside consumer `@Component` / `@Service` beans.
6. **AOP-intercepted consumer `@Service` classes** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) MUST be **non-final** and **`@Lazy`**, AND any consumer `@Component` injecting them MUST ALSO use **`ObjectProvider<MyService>`** or **`@Lazy`** (never place `@Transactional` on `public final class` Helpers!).
7. **Never use `@Data` on a JPA `@Entity`** and **never invent `@SoftDelete`** (soft-delete is built into `BaseAuditEntity`).
8. **Never enable Dev Studio in `application.yml` / `application-prod.yml`** — keep `app.framework.studio.enabled: false` and put `enabled: true` only in `application-dev.yml`. Demo JWT endpoint is **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NOT `GET /system/studio/demo-token`).

---

## Workflow 1 — Bootstrap Spring-NWVMC in a New or Existing Spring Boot 3.x Project

1. **Add dependency** (`pom.xml` with JitPack `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`, Java 21, and `<parameters>true</parameters>`). See [INTRO.md](./INTRO.md) §2.
2. **Create `application.yml` (secure production baseline)** and **`application-dev.yml` (local Dev Studio + demo JWT)** from [references/03-yaml-properties-and-profiles.md](./references/03-yaml-properties-and-profiles.md).
3. **Verify boot:** Run `mvn spring-boot:run "-Dspring-boot.run.profiles=dev"` and confirm:
   - Swagger UI loads at `http://localhost:8080/swagger-ui/index.html`
   - Dev Studio loads at `http://localhost:8080/system/studio`
   - Demo JWT token mints at **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (`200 OK`, `$.data.token`)

---

## Workflow 2 — Create a New Domain Resource (2-Directory Contract)

1. **Create `entity/<EntityName>.java`** extending `BaseAuditEntity`:
   - Add `@Entity`, `@Table(name = "...", indexes = ...)`, `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`.
   - Add `@EntitySecurity(...)` (mandatory for protected resources).
   - Add domain annotations as needed (`@UniqueField`, `@AutoCode(prefix = "ORD-")`, `@AutoSlug(sourceField = "productName")`, `@FieldSecurity`, `@StateMachine`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`, `@EntityWebhook`, `@PublishCloudEvent`).
2. **Create `controller/<EntityName>Controller.java`**:
   - Full internal/admin API (40 routes): `public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}`
   - Public read-only API with DTO stripping (5 routes):
     ```java
     @AutoRestController(basePath = "/api/v1/readonly/product-catalogs", readDto = ProductReadDto.class)
     public interface ProductCatalogReadOnlyController extends AutoReadApi<ProductCatalog> {}
     ```
3. **Verify live endpoints** with `MockMvc` or `curl` (create `201`, get `200`, dot-filter, `/keyset`, field masking for `ROLE_USER` vs `ROLE_ADMIN`).

---

## Workflow 3 — Add Custom Business Endpoints & Resilience

Choose the exact pattern from [references/04-cookbook-verified-patterns.md](./references/04-cookbook-verified-patterns.md):

- **Lightweight custom route (`@CustomEndpoint`):** Declare `@CustomEndpoint(path, httpMethod, delegateBean, delegateMethod)` on the controller interface pointing to a `@Component("beanName")` `public final class` Helper or `@Lazy @Service("beanName")` Service.
- **Override or standard Spring MVC binding (`@ServiceOverride`):** Combine `@AutoGet` / `@PostMapping` + `@PathVariable` / `@RequestParam` / `@RequestBody` + `@ServiceOverride(targetBean = ..., methodName = ...)` on the controller interface.
- **Prevent double-charges (`@Idempotent`):** Place `@Idempotent(headerName = HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY, ttlSeconds = AopConstant.SECONDS_PER_DAY)` on the controller interface; clients send `X-Idempotency-Key`.
- **Prevent concurrent overselling (`@DistributedLock`):** Place `@Lazy @Service` (non-final!) + `@Transactional(rollbackFor = Exception.class)` + `@DistributedLock(key = "'SKU_STOCK_' + #stockSkuCode", waitTimeMs = 3000L, leaseTimeMs = 5000L)` on the service method.
- **Offload read-heavy analytics (`@TargetDataSource` + `@AutoCacheable`):** Place `@Lazy @Service @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)` on the service class + `@AutoCacheable` / `@AutoCacheEvict` on its methods, and mount the route on a controller **without** `readDto`.
- **Public traffic protection:** Attach `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry` on the controller interface, and `@HttpCacheable` on read methods returning `ResponseEntity<ApiResponse<T>>`.

---

## Workflow 4 — Wire Events, Webhooks, Security Customizers, Storage, AI & Frontend SDKs

1. **Webhooks & CloudEvents:** Annotate entity with `@EntityWebhook` + `@PublishCloudEvent`; register subscribers via `ObjectProvider<WebhookDispatcherHelper>`.
2. **Transactional Outbox Relay:** Implement `OutboxEventDispatcherProvider` (`@Component`) to push committed `OutboxEvent` records (matching `EventConstant.EVENT_TYPE_CREATED` = `"ENTITY_CREATED"`) to Kafka / RabbitMQ / SQS.
3. **Custom Spring Security / ABAC:** Implement `SecurityIdentityCustomizer` (`@Component`) to tune `HttpSecurity`, augment subject authorities, or vote (`TRUE` / `FALSE` / `null` abstain).
4. **Outbound Partner HTTP Calls:** Inject `ObjectProvider<ThirdPartyRestClientHelper>` to propagate W3C `traceparent` + UUIDv7 `X-Request-ID` automatically.
5. **Spring AI Assistant:** Inject `ObjectProvider<DynamicEntityAiMetadataProviderHelper>` and `ObjectProvider<AiNaturalLanguageQueryParserHelper>`, or call `GET /api/v1/{entity}/ai/context` and `POST /api/v1/{entity}/ai/query`.
6. **Zero-Drift Frontend Contracts:** Pull `GET /api/v1/{entity}/schema/typescript`, `/schema/zod`, and `/schema/client` directly into `src/api/` during frontend build or CI.

---

## Workflow 5 — Troubleshooting Root-Cause Quick Matrix

| Observed Error | Exact Root Cause | Verified Fix |
| :--- | :--- | :--- |
| `NoSuchBeanDefinitionException` for `*Helper` (`DynamicEntityAiMetadataProviderHelper`, `ThirdPartyRestClientHelper`, etc.) | Consumer `@Component` initialized before `ControllerToApiAutoConfiguration` registered `@AutoComponent` beans | Inject via `ObjectProvider<T>` and call `.getObject()` at runtime |
| `@DistributedLock`, `@AutoCacheable`, or `@TargetDataSource` aspect does not fire on consumer `@Service` | Bean was `final`, missing `@Lazy`, OR injected eagerly by another `@Component` before aspects registered | Make `@Service` non-final + `@Lazy`, inject it via `ObjectProvider<MyService>` / `@Lazy` in callers, and add class-level `@TargetDataSource` on `v0.1.0` |
| `AopConfigException: Cannot subclass final class *Helper` at startup | Put `@Transactional` (or another CGLIB AOP annotation) on a `public final class` Helper | Remove `@Transactional` from `final` Helper; place `@Transactional` only on non-final `@Lazy @Service` |
| `404` on `/system/studio/demo-token` or `405` on `GET /api/v1/auth/token` | Wrong demo JWT URL or HTTP verb | Use **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (`dev` profile) |
| DB-RBAC test gets `403` for valid `NovaUserRole` row | Passed `(userId, username, roles)` to `JwtTokenService.generateToken` | Use exact order: `generateToken(username, userId, roles)` (`username` FIRST!) |
| `@HttpCacheable` + `@ServiceOverride` returns double-wrapped JSON or missing `ETag` on `v0.1.0` JAR | `v0.1.0` `EscapeHatchDispatchHelper` wraps `ResponseEntity` and `HttpCacheEvaluatorHelper` hashes random `traceId` | Return `ApiResponse<MyDto>` and compute weak ETag on DTO via `ObjectProvider<HttpCacheEvaluatorHelper>` (see Cookbook Recipe 1) |
| `404`/`409` `BaseBusinessException` becomes `500 RetryExhaustedException` on `v0.1.0` JAR | Class-level `@EntityRetry` on `v0.1.0` JAR wraps caught 4xx exceptions | Apply `@EntityRetry` only on transient downstream I/O methods (not endpoints throwing 4xx business errors) on `v0.1.0` |
| `404 Not Found` on `/api/v1/ecommerce-orders` | CamelCase `ECommerceOrder` splits to `/api/v1/e-commerce-orders` | Use `/api/v1/e-commerce-orders` or declare explicit `@AutoRestController(basePath = "...")` |
| `422 Unprocessable Entity` on `POST /{id}/transition` | Passed JSON body instead of `?targetState=` query parameter | Call `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` |
| `@StateMachine` rejects valid transitions | Used `"DRAFT -> PAID"` arrow syntax instead of colon syntax | Change to `"CREATED:PENDING_PAYMENT,CANCELLED"` (`"FROM:TO1,TO2"`) |
| `400 Bad Request` on filter query `retailPrice__gte=1000` | Used `__` instead of `.` operator delimiter | Use `retailPrice.gte=1000&productName.like=MacBook` |
| Custom `@AutoGet` + `@ServiceOverride` returns `403` for `ROLE_USER` | Method name not in `SecurityConstant.READ_OPERATIONS` defaults to `writeRoles` (fail-closed) | Grant access via `@SecurityPolicyEntity` / `SecurityIdentityCustomizer` or call with a `writeRoles` principal |
| Custom analytics DTO fields become `null` on read-only controller | Controller declares `readDto = ProductReadDto.class`, which projects every response through `ProductReadDto` | Move non-`ProductReadDto` route to a controller without `readDto` |
| `InvalidConfigurationException` on startup about JWT secret | `fail-fast-weak-jwt-secret: true` and `JWT_SECRET` < 32 UTF-8 bytes | Provide a `>= 32`-byte `${JWT_SECRET}` env var (or set `false` only in `application-dev.yml`) |
| `403 Forbidden` on `@MultiTenant` entity | Missing `X-Tenant-ID` header (fail-closed) or cross-tenant IDOR | Pass `X-Tenant-ID` header matching record tenant, or use a `bypassTenantRoles` token |

---

## Workflow 6 — Mandatory Verification Gate Before Completion

1. Run through **[CHECKLIST.md](./CHECKLIST.md)** line by line.
2. Execute full build & tests: `mvn clean verify` (must finish with **0 failures, 0 errors, 0 skipped** and `0.0%` JMeter error rate when JMeter is configured).
3. Never hide failures with `@Disabled` or swallow exceptions; always inspect the deepest `Caused by:` frame.
