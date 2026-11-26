# Feature Specification: <Feature Name>

- **Feature Slug:** `<feature-slug>`
- **Bounded Context / Module:** `<domain-module>`
- **Framework Baseline:** `io.github.natswarchuan:spring-nwvmc:0.1.0` (Java 21 LTS + Spring Boot 3.x)
- **Status:** `DRAFT` | `CLARIFIED` | `APPROVED` | `IMPLEMENTED`

---

## 1. Business Goal & Scope

### Problem Statement
> Describe the business problem, target actors, and expected value in 2–4 concise sentences.

### Out of Scope
- Explicitly list what this feature will **NOT** implement to prevent scope creep.

---

## 2. Acceptance Criteria (Testable `Given / When / Then`)

| REQ-ID | User Story / Scenario | Given | When | Then (Exact Expected Outcome & HTTP Status) |
| :--- | :--- | :--- | :--- | :--- |
| `REQ-001` | Create resource + idempotency | Authenticated `ROLE_ADMIN` | `POST /api/v1/<resources>` with valid JSON + `X-Idempotency-Key` (and replay) | First call returns `201 Created` (`UUIDv7` `id`, `X-Request-ID`, auto-code/slug); replay returns `409 Conflict` |
| `REQ-002` | Reject invalid input / domain rule | Authenticated `ROLE_ADMIN` or Helper input | `POST /api/v1/<resources>` violating validation or Helper domain guard | Returns `400 Bad Request` with typed `BaseBusinessException` + explicit `errorCode` |
| `REQ-003` | Security & field masking | Authenticated `ROLE_USER` | `GET /api/v1/<resources>/{id}` & public `readDto` route | Returns `200 OK`; `@FieldSecurity` masks/nullifies secrets; `readDto` omits internal columns |
| `REQ-004` | Tenant / ownership isolation | Tenant B token (or missing `X-Tenant-ID`) | `GET/PUT/DELETE /api/v1/<resources>/{tenantA_id}` | Returns `403 Forbidden` (fail-closed IDOR + JWT `tenantId` claim parity) |
| `REQ-005` | State transition rules | Resource in `DRAFT` state | `POST /{id}/transition?targetState=ACTIVE` (valid) vs `ARCHIVED` (illegal) | Valid returns `200 OK`; illegal jump or non-deletable `DELETE` returns **`422 Unprocessable Entity`** |
| `REQ-006` | Contract parity (no secret leak) | Running application | `GET /v3/api-docs`, `/metadata`, `/schema/zod` | Matches spec paths/fields 1:1; internal fields absent from public DTO OpenAPI schema |
| `REQ-007` | Concurrent lock safety & SLA | Initial stock = `3`, `8` parallel requests | Concurrent `POST /api/v1/<resources>/<action>` | Exactly `3` succeed (`200`), `5` return `409 Conflict`, **zero `500` errors** |

---

## 3. Domain Entity Schema (`entity/<EntityName>.java`)

Extends `BaseAuditEntity` (inherits UUIDv7 `id`, `@Version`, `deleted`, audit timestamps/actors — NEVER `@Data`, NEVER `@SoftDelete`).

| Field Name | Java Type | Constraints / Validation | Declarative Annotations | Indexed? |
| :--- | :--- | :--- | :--- | :---: |
| `<codeField>` | `String` | `@Size(max = 64)` | `@UniqueField`, `@AutoCode(prefix = "XXX-")` | Yes (`UNIQUE`) |
| `<statusField>` | `String` | `@NotBlank` | `@StateMachine(initial = "DRAFT", transitions = {"DRAFT:ACTIVE,CANCELLED"}, deletableStates = {"DRAFT", "CANCELLED"})` | Yes |
| `<secretField>` | `String` | Optional | `@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, maskPattern = "******")` | No |
| `tenantId` | `String` | `@NotBlank` | Enforced via `@MultiTenant(tenantField = "tenantId")` | Yes |

---

## 4. API Surface Contract (`controller/<EntityName>Controller.java`)

- **Primary Interface:** `AutoApiController<E>` | Composable subset (`AutoReadApi<E>`, `AutoKeysetApi<E>`, ...)
- **Base Path:** `@AutoRestController(basePath = "/api/v1/<kebab-plural>")` *(always use `basePath`, NOT `path`)*
- **Public Read-Only Surface (if applicable):** `@AutoRestController(basePath = "/api/v1/public/<kebab-plural>", readDto = <Entity>ReadDto.class)` extending `AutoReadApi<E>`
- **Disabled Auto Endpoints:** `disabledEndpoints = {}` *(exact `AutoApiController` method names; evaluated before `enabledEndpoints`)*
- **Custom Endpoints / Overrides:**

> **CRITICAL Security Warning (`0.1.0`):** `@CustomEndpoint` dispatches directly via `ControllerProxySpecialRouteUtil` **before** proxy-level `@EntitySecurity`, `@RateLimit`, and `@Idempotent`. Always enforce authentication/authorization inside the delegated Spring bean (or enable `require-authenticated-api-paths: true` / use `@ServiceOverride`).

| HTTP | Full Path | Mechanism (`@CustomEndpoint` / `@ServiceOverride`) | Delegate Bean & Method | Auth Guard & Request / Response DTO | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/<resources>/<action>` | `@CustomEndpoint` | `<bean>.<method>` | Explicit role check in bean; `<Action>RequestDto` → `ApiResponse<<Action>ResponseDto>` | `200`, `400`, `403`, `409` |

---

## 5. Security, Operations, Migrations & Non-Functional Requirements

- **Entity RBAC (`@EntitySecurity`):** `readRoles = {...}`, `writeRoles = {...}`, `deleteRoles = {...}`, `ownerField = ""`
- **Multi-Tenant Auth Boundary (if applicable):** Confirm `SecurityIdentityCustomizer` verifies caller JWT `tenantId` claim / DB membership matches `X-Tenant-ID`.
- **DB-RBAC Policies (if enabled):** Document explicit `DENY` / `ALLOW` rows; protect all 4 DB-RBAC entities with `ROLE_SUPER_ADMIN` write roles.
- **Resilience & Multi-Pod Concurrency:**
  - `@DistributedLock(key = "...")` on outer non-transactional facade calling `@Lazy @Service` (`@Transactional`); Redis/JDBC `DistributedLockProvider` required for > 1 pod.
  - `@Idempotent(headerName = HttpHeaderConstant.HEADER_X_IDEMPOTENCY_KEY)` on `<controller/method>`; Redis/JDBC `IdempotencyStoreProvider` required for > 1 pod.
  - `@RateLimit(requests = ..., windowSeconds = ..., partitionKey = "IP|USER|TENANT")`
- **Caching & Data Source:**
  - Read/Write ratio analysis: `<justify @AutoCacheable / @HttpCacheable or NO cache>`
  - DataSource routing: `PRIMARY` | `REPLICA` (method-level or class-level `@TargetDataSource` natively supported in `0.1.0`)
- **Database Migrations, Retention & i18n:**
  - Schema migration: Flyway/Liquibase script (`V<N>__<slug>.sql`) + rollback notes (`ddl-auto: validate` in prod).
  - Soft-delete (`BaseAuditEntity.deleted`) vs GDPR physical purge retention policy: `<policy>`.
  - Error codes (`i18n`): `<ERR_DOMAIN_CODE_1>`, `<ERR_DOMAIN_CODE_2>`.
- **Performance & SLA:**
  - List endpoints support Keyset O(1) (`GET /keyset`) and sparse `?fields=`, `spring.jpa.open-in-view: false`, zero N+1 queries.
  - Apache JMeter load test target (`mvn jmeter:configure jmeter:jmeter jmeter:results`): **`0.0%` Error Rate**, p95 `< <target>ms`.

---

## 6. Open Questions (`[NEEDS CLARIFICATION]` Gate)

> **HARD STOP:** Every item below MUST be resolved and removed before creating `plan.md` or writing Java code.

- [ ] `[NEEDS CLARIFICATION: Confirm allowed writeRoles, public readDto fields, and whether multi-tenant isolation is required.]`
