# Spring-NWVMC (`0.1.0`) — SDD, TDD & Zero-Defect Verification Checklist

> **For AI Agents:** Execute every applicable section below as a hard gate before reporting a task complete.
> **For Developers:** Use this checklist during spec sign-off, PR review, and production go-live.

---

## Phase 0 — SDD (Spec-Driven Development) Contract Gate (Before Coding!)

- [ ] **Specification Authored (`specs/<feature-slug>/spec.md`):** Business goal, out-of-scope boundaries, testable `REQ-ID` (`Given / When / Then`) criteria, entity schema, API surface (`AutoApiController<E>` vs `AutoReadApi<E>` + `readDto`), security/tenant/DB-RBAC matrix, `@StateMachine` transitions, resilience/cache rules, and NFRs are explicitly written.
- [ ] **Ambiguity Gate Cleared:** Zero unresolved `[NEEDS CLARIFICATION: ...]` markers remain; all open business questions confirmed with the stakeholder.
- [ ] **Technical Plan & Traceability Ready (`plan.md`):** Every `REQ-ID` is mapped 1:1 to a target endpoint/class and concrete JUnit 5 / `MockMvc` test method (`REQ-ID ↔ Endpoint ↔ Test`).
- [ ] **Atomic TDD Task List Ready (`tasks.md`):** Work is broken into vertical slices ordered `[RED] → [GREEN] → [REFACTOR] → [VERIFY]`.
- [ ] **Living Spec Policy:** Any contract change discovered during implementation is synced back to `spec.md` in the same atomic commit.

---

## Phase 1 — Project Setup & Pre-Flight Gate

- [ ] **JDK 21 LTS Active:** `java -version` reports Java 21+; `pom.xml` sets `<java.version>21</java.version>` and `<maven.compiler.release>21</maven.compiler.release>`.
- [ ] **Compiler `-parameters` Enabled:** `maven-compiler-plugin` configures `<parameters>true</parameters>` (required for SpEL `#paramName` in `@DistributedLock` / `@AutoCacheable` and Spring MVC param binding).
- [ ] **Exact `0.1.0` Dependency:** `io.github.natswarchuan:spring-nwvmc:0.1.0` (Maven Central primary) or optional JitPack mirror `com.github.NatswarChuan:Spring-NWVMC:v0.1.0` added cleanly.
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
- [ ] **AOP `@Service` Beans Are Non-Final, `@Lazy`, AND Lazily Injected:** Every `@Service` using `@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, or `@TargetDataSource` is non-final and annotated with `@Lazy`, AND every `@Component` injecting it uses `ObjectProvider<MyService>` or `@Lazy` on the injected parameter (`0.1.0` supports method-level and class-level `@TargetDataSource` natively).
- [ ] **No `@Transactional` on `public final class` Helpers:** Keep `@Transactional` strictly on non-final `@Lazy @Service` classes to prevent CGLIB `AopConfigException` on boot.
- [ ] **`@Idempotent` Header Constant Verified:** Uses `HttpHeaderConstant.HEADER_X_IDEMPOTENCY_KEY` (or `AopConstant.HEADER_IDEMPOTENCY_KEY`) for `"X-Idempotency-Key"` — NEVER `HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY` (`"Idempotency-Key"`), which silently skips deduplication!
- [ ] **Auth Token & `JwtTokenService` Verified:** Dev curl scripts use `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` (NOT `GET /system/studio/demo-token`); tests call `jwtTokenService.generateToken(username, userId, roles)` (`username` first!).
- [ ] **Outbox Event Names Accurate:** Tests and dispatchers match `EventConstant` (`ENTITY_CREATED`, `ENTITY_UPDATED`, `ENTITY_DELETED`, `ENTITY_STATE_CHANGED`).
- [ ] **Storage Upload Expects `201 Created`:** Upload clients/tests expect HTTP `201 Created` with `data.fileId`.

---

## Phase 4 — Security & Production Lockdown Gate

- [ ] **Declarative RBAC Applied:** Every business entity (and ALL 4 DB-RBAC policy entities if used!) declares `@EntitySecurity` (no accidental `permitAll = true` on PII or write endpoints); `@CustomEndpoint` delegate beans enforce their own authentication/authorization.
- [ ] **Field Masking Verified:** Sensitive fields carry `@FieldSecurity(viewRoles = ..., nullifyInsteadOfMask = true)` or `maskPattern = "******"`.
- [ ] **Multi-Tenant Auth Boundary Verified (if applicable):** `@MultiTenant` entities reject missing `X-Tenant-ID` (`403`), override spoofed body `tenantId`, block cross-tenant IDOR (`403`), AND a `SecurityIdentityCustomizer` / upstream auth filter verifies the caller's signed JWT `tenantId` claim / DB membership matches `X-Tenant-ID`.
- [ ] **DB-RBAC Marker Uniqueness:** No duplicate single-valued markers (`@RoleCode`, `@PermissionCode`, `@UserRoleSubject`, `@PolicyEffect`, etc.) on any entity.
- [ ] **Production `application.yml` / `application-prod.yml` Locked Down:**
  - `app.framework.studio.enabled: false`
  - `app.framework.studio.demo-token-endpoint-enabled: false`
  - `app.framework.studio.show-i18n-diagnostics: false`
  - `app.framework.studio.hide-framework-fingerprint: true`
  - `app.framework.security.fail-fast-weak-jwt-secret: true`
  - `app.framework.security.default-deny-unannotated-entities: true`
  - `app.framework.security.require-authenticated-api-paths: true` (allowlist only intentionally public read-only paths via `SecurityIdentityCustomizer`)
  - `app.framework.security.jwt-secret: ${JWT_SECRET}` (`>= 32` UTF-8 bytes for HS256 / `>= 64` bytes for HS512; shared across pods; never hardcoded in Git)
  - `springdoc.api-docs.enabled: false` and `springdoc.swagger-ui.enabled: false`; restrict CORS origins via `SecurityIdentityCustomizer`; disable `storage.enabled: false` and `ai.enabled: false` unless explicitly authorized; use `ddl-auto: validate` + Flyway/Liquibase (NEVER `ddl-auto: update` in prod).
- [ ] **Dev Studio Isolated:** `enabled: true`, `demo-token-endpoint-enabled: true`, and H2 `ddl-auto: update` exist ONLY in `application-dev.yml`.

---

## Phase 5 — Performance, Resilience & Observability Gate

- [ ] **Cache Analysis Completed:**
  - High-read analytics / catalog queries → `@AutoCacheable` + `@AutoCacheEvict` or `@HttpCacheable`.
  - Transactional money / inventory writes → NO stale cache; protected by `@Idempotent` or `@DistributedLock`.
- [ ] **Multi-Pod Concurrency Readiness (Replicas > 1):** Default Caffeine `@DistributedLock` / `@Idempotent` stores are single-JVM only — Redis/JDBC `DistributedLockProvider` and `IdempotencyStoreProvider` (`io.github.natswarchuan.module.idempotent.provider.IdempotencyStoreProvider`) are wired for multi-pod Kubernetes, and `@DistributedLock` wraps `@Transactional` from an outer facade.
- [ ] **Big-Data Pagination Ready:** Large list endpoints use `/keyset?dir=desc&size=20` and `?fields=` sparse projections rather than deep `OFFSET`.
- [ ] **Resilience Declared Where Needed:** Public high-traffic controllers carry `@RateLimit`, `@EntityCircuitBreaker`, and `@EntityRetry` (with rate limits sized safely for expected bursts/load tests).
- [ ] **Transactional Integrity:** Service classes use `@Transactional(readOnly = true)` at class level and `@Transactional(rollbackFor = Exception.class)` on every write method.
- [ ] **No Built-In Exceptions in Business Flows:** Custom domain failures throw subclasses of `BaseBusinessException` carrying `StandardHttpStatus` and `errorCode`.
- [ ] **W3C Tracing & Outbox Wired:** Outbound partner calls go through `ThirdPartyRestClientHelper`; real async broker/HTTP delivery uses `OutboxEventDispatcherProvider` (note: `WebhookDispatcherHelper` simulates HTTP in `0.1.0`).

---

## Phase 6 — TDD Red-Green-Refactor, Contract Drift & Go-Live Gate

- [ ] **TDD Discipline Verified (RED → GREEN → REFACTOR):** Every new `REQ-ID` had a failing test (`@DisplayName("REQ-XXX: ...")`) observed **before** writing production code; every bug fix began with a failing regression test; zero assertions weakened or bypassed.
- [ ] **Tier 1 — Fast Unit Tests Pass:** Every Helper, Service, DTO builder (`fromXXX`/`toXXX`), Custom Exception (`BaseBusinessException`), and Provider has isolated JUnit 5 + Mockito + AssertJ tests covering Happy Path, Negative Path, and Null/Blank Guard Clauses.
- [ ] **Tier 2 — Contract, Security & Workflow Integration Tests Pass (`@SpringBootTest` + `MockMvc`):** Verified live HTTP flows (minting tokens via `jwtTokenService.generateToken(username, userId, roles)`) for:
  - Entity CRUD + `@AutoSlug` / `@AutoCode` / `@UniqueField` (`201`/`200`/`400`/`409`)
  - `@FieldSecurity` (`ROLE_ADMIN` vs `ROLE_USER`) and `readDto` field stripping (`$.data.costPrice` absent)
  - `@EntitySecurity`, `@MultiTenant` (`403` missing header + cross-tenant IDOR + JWT claim mismatch), and DB-RBAC `DENY > ALLOW`
  - `@StateMachine` valid transition (`200`), illegal jump rejection (`422 Unprocessable Entity`), and `deletableStates` guard (`422`)
  - `@Idempotent` first call (`201`) & duplicate key replay (`409 Conflict`)
  - `@HttpCacheable` weak ETag (`200` → `If-None-Match` → `304 Not Modified`) & `@Version` stale write (`409 Conflict`)
  - `@CustomEndpoint` & `@ServiceOverride` custom routes, plus `prod` lockdown (`/system/studio` `401`/`404`, `/api/v1/auth/token` `404`, `/system/studio/eject` blocked)
  - GraphQL (`POST /api/v1/graphql`), Spring AI (`/ai/query`), File Storage (`/storage/upload` `201` → `download` → `delete`)
- [ ] **Tier 3 — Spec-to-Runtime Contract Drift Gate Pass:** Automated assertions confirm `/v3/api-docs`, `/api/v1/{entity}/metadata`, `/schema/zod`, `/schema/client`, and `/api/v1/graphql/schema` match `spec.md` with zero leaked internal fields.
- [ ] **Tier 4 — Concurrency & Load SLA Verified:** Multi-threaded `RANDOM_PORT` + `RestClient` race test verifies `@DistributedLock` prevents overselling/double-spend (zero `500`s); Apache JMeter run (`mvn jmeter:configure jmeter:jmeter jmeter:results` or `mvn -Pjmeter verify`, when configured) achieves **0.0% Error Rate** with HTML report in `target/jmeter/reports/`.
- [ ] **Clean Build Green:** `mvn clean verify` passes with **0 Failures, 0 Errors, 0 Skipped** (zero `@Disabled` tests).
- [ ] **Living Spec & Frontend Contracts Synced:** `specs/<feature-slug>/spec.md`, OpenAPI (`/v3/api-docs`), frontend TypeScript/Zod clients (`/schema/zod`, `/schema/client`), and project `README.md` are 100% synchronized.
