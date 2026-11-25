# Spring-NWVMC (`v0.1.0`) — Adoption & Zero-Defect Verification Checklist

> **For AI Agents:** Execute every applicable section below as a hard gate before reporting a task complete.
> **For Developers:** Use this checklist during PR review and production go-live sign-off.

---

## Phase 1 — Project Setup & Pre-Flight Gate

- [ ] **JDK 21 LTS Active:** `java -version` reports Java 21+; `pom.xml` sets `<java.version>21</java.version>` and `<maven.compiler.release>21</maven.compiler.release>`.
- [ ] **Compiler `-parameters` Enabled:** `maven-compiler-plugin` configures `<parameters>true</parameters>` (required for SpEL `#paramName` in `@DistributedLock` / `@AutoCacheable` and Spring MVC param binding).
- [ ] **Exact `0.1.0` / `v0.1.0` Dependency:** `com.github.NatswarChuan:Spring-NWVMC:v0.1.0` (with JitPack repo) or `io.github.natswarchuan:spring-nwvmc:0.1.0` added cleanly.
- [ ] **Virtual Threads & JPA Safe Defaults:** `spring.threads.virtual.enabled: true` and `spring.jpa.open-in-view: false` configured in `application.yml`.
- [ ] **Query Guardrails Configured:** `app.framework.query-guardrails` sets `max-join-depth` (`<= 3`), `max-filter-criteria` (`<= 25`), `max-page-size` (`<= 200`), `max-unpaged-fetch-limit` (`<= 5000`).

---

## Phase 2 — Domain Entity & Controller Design Gate

- [ ] **Extends `BaseAuditEntity`:** Entity inherits UUIDv7 `id`, `@Version` optimistic lock, audit fields, and `deleted` soft-delete support.
- [ ] **No `@Data` on JPA Entity:** Uses `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`.
- [ ] **Database Indexes Aligned:** `@UniqueField`, foreign keys, filter columns, and `@AutoSlug` / `@AutoCode` columns have matching `@Index` declarations in `@Table(indexes = ...)`.
- [ ] **Right Composable Interface Chosen:**
  - Full internal/admin CRUD → `AutoApiController<E>`.
  - Public storefront / restricted read-only → `AutoReadApi<E>` + `@AutoRestController(basePath = ..., readDto = XReadDto.class)`.
  - Never expose `costPrice`, secrets, or internal fields on public DTOs (`ProductReadDto` pattern).
- [ ] **No `readDto` Contamination:** Controllers with `readDto = ...` do NOT host custom methods returning unrelated DTO types.
- [ ] **Exact URL Path Verified:** Checked camelCase-to-kebab-case derivation (e.g., `ECommerceOrder` → `/api/v1/e-commerce-orders`) or declared explicit `@AutoRestController(basePath = "...")`.

---

## Phase 3 — Runtime Syntax & Spring-NWVMC Gotcha Gate

- [ ] **Exact Packages Only:** All annotations imported from the 6 real Spring-NWVMC packages (zero hallucinated annotations like `@SoftDelete` or `@EnableNwvmc`).
- [ ] **`@StateMachine` Colon Syntax Verified:** Transitions use `"FROM:TO1,TO2"` (e.g. `"CREATED:PENDING_PAYMENT,CANCELLED"`), NEVER `"FROM -> TO"`.
- [ ] **Transition Calls Use Query Param:** HTTP requests call `POST /api/v1/{entity}/{id}/transition?targetState=NEXT_STATE`, NOT JSON body.
- [ ] **Filter Operators Use Dot Syntax:** Queries use `field.gte=`, `field.like=`, `field.in=`, NEVER `field__gte=`.
- [ ] **`ObjectProvider<T>` Used for Framework `@AutoComponent` Helpers:** Any consumer `@Component` injecting `DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, or `WebhookDispatcherHelper` uses `ObjectProvider<T>`.
- [ ] **AOP `@Service` Beans Are Non-Final, `@Lazy`, AND Lazily Injected:** Every `@Service` using `@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, or `@TargetDataSource` is non-final and annotated with `@Lazy` (plus class-level `@TargetDataSource` when routing to `REPLICA` on `v0.1.0`), AND every `@Component` injecting it uses `ObjectProvider<MyService>` or `@Lazy` on the injected parameter.
- [ ] **No `@Transactional` on `public final class` Helpers:** Keep `@Transactional` strictly on non-final `@Lazy @Service` classes to prevent CGLIB `AopConfigException` on boot.
- [ ] **Auth Token & `JwtTokenService` Verified:** Dev curl scripts use `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` (NOT `GET /system/studio/demo-token`); tests call `jwtTokenService.generateToken(username, userId, roles)` (`username` first!).
- [ ] **Outbox Event Names Accurate:** Tests and dispatchers match `EventConstant` (`ENTITY_CREATED`, `ENTITY_UPDATED`, `ENTITY_DELETED`, `ENTITY_STATE_CHANGED`).
- [ ] **Storage Upload Expects `201 Created`:** Upload clients/tests expect HTTP `201 Created` with `data.fileId`.

---

## Phase 4 — Security & Production Lockdown Gate

- [ ] **Declarative RBAC Applied:** Every business entity declares `@EntitySecurity` (no accidental `permitAll = true` on PII or write endpoints).
- [ ] **Field Masking Verified:** Sensitive fields carry `@FieldSecurity(viewRoles = ..., nullifyInsteadOfMask = true)` or `maskPattern = "******"`.
- [ ] **Multi-Tenant Tested (if applicable):** `@MultiTenant` entities reject missing `X-Tenant-ID` (`403`), override spoofed body `tenantId`, and block cross-tenant IDOR `GET`/`PUT`/`DELETE` (`403`).
- [ ] **DB-RBAC Marker Uniqueness:** No duplicate single-valued markers (`@RoleCode`, `@PermissionCode`, `@UserRoleSubject`, `@PolicyEffect`, etc.) on any entity.
- [ ] **Production `application.yml` / `application-prod.yml` Locked Down:**
  - `app.framework.studio.enabled: false`
  - `app.framework.studio.demo-token-endpoint-enabled: false`
  - `app.framework.studio.show-i18n-diagnostics: false`
  - `app.framework.studio.hide-framework-fingerprint: true`
  - `app.framework.security.fail-fast-weak-jwt-secret: true`
  - `app.framework.security.jwt-secret: ${JWT_SECRET}` (`>= 32` UTF-8 bytes, never hardcoded in Git).
- [ ] **Dev Studio Isolated:** `enabled: true` and `demo-token-endpoint-enabled: true` exist ONLY in `application-dev.yml`.

---

## Phase 5 — Performance, Resilience & Observability Gate

- [ ] **Cache Analysis Completed:**
  - High-read analytics / catalog queries → `@AutoCacheable` + `@AutoCacheEvict` or `@HttpCacheable`.
  - Transactional money / inventory writes → NO stale cache; protected by `@Idempotent` or `@DistributedLock`.
- [ ] **Big-Data Pagination Ready:** Large list endpoints use `/keyset?dir=desc&size=20` and `?fields=` sparse projections rather than deep `OFFSET`.
- [ ] **Resilience Declared Where Needed:** Public high-traffic controllers carry `@RateLimit`, `@EntityCircuitBreaker`, and `@EntityRetry` (with rate limits sized safely for expected bursts/load tests).
- [ ] **Transactional Integrity:** Service classes use `@Transactional(readOnly = true)` at class level and `@Transactional(rollbackFor = Exception.class)` on every write method.
- [ ] **No Built-In Exceptions in Business Flows:** Custom domain failures throw subclasses of `BaseBusinessException` carrying `StandardHttpStatus` and `errorCode`.
- [ ] **W3C Tracing & Outbox Wired:** Outbound partner calls go through `ThirdPartyRestClientHelper`; async broker delivery uses `OutboxEventDispatcherProvider`.

---

## Phase 6 — Automated Verification & Go-Live Gate

- [ ] **Unit Tests Pass:** Every new Helper, DTO builder (`fromXXX`/`toXXX`), Custom Exception, and Provider has isolated JUnit 5 tests covering Happy Path, Negative Path, and Null/Blank Guard Clauses.
- [ ] **Integration Tests Pass (`MockMvc` / `@SpringBootTest`):** Verified live HTTP flows for:
  - Entity CRUD + `@AutoSlug` / `@AutoCode` / `@UniqueField`
  - `@FieldSecurity` (`ROLE_ADMIN` vs `ROLE_USER`) and `readDto` stripping
  - `@StateMachine` valid transition (`200`) & illegal jump rejection (`4xx`)
  - `@Idempotent` first call (`201`) & duplicate key replay (`409 Conflict`)
  - `@DistributedLock` valid deduction (`200`) & over-reservation (`409 Conflict`)
  - `@CustomEndpoint` & `@ServiceOverride` custom routes
  - GraphQL query (`POST /api/v1/graphql`), Zod/TS codegen (`/schema/zod`, `/schema/client`), Spring AI (`/ai/query`), File Storage (`/storage/upload` → `download` → `delete`)
- [ ] **Clean Build Green:** `mvn clean verify` passes with **0 Failures, 0 Errors, 0 Skipped** (no `@Disabled` tests).
- [ ] **Load Test Verified (if JMeter configured):** Apache JMeter run achieves **0.0% Error Rate** and generates HTML report in `target/jmeter/reports/`.
- [ ] **Documentation & Frontend Contracts Synced:** Any newly added entity/route/config is reflected in OpenAPI (`/v3/api-docs`), frontend TypeScript/Zod clients (`/schema/zod`, `/schema/client`), and project `README.md`.
