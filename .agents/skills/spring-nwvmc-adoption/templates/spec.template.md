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
| `REQ-001` | Create resource | Authenticated `ROLE_ADMIN` | `POST /api/v1/<resources>` with valid JSON + `X-Idempotency-Key` | Returns `201 Created`, `ApiResponse` with UUIDv7 `id`, `X-Request-ID`, auto-generated code/slug |
| `REQ-002` | Reject invalid input | Authenticated `ROLE_ADMIN` | `POST /api/v1/<resources>` violating validation constraint | Returns `400 Bad Request` with sanitized `ApiResponse<Void>` errorCode |
| `REQ-003` | Security & field masking | Authenticated `ROLE_USER` | `GET /api/v1/<resources>/{id}` | Returns `200 OK` with `@FieldSecurity` sensitive fields masked/nullified |
| `REQ-004` | Tenant / ownership isolation | Tenant B token or non-owner | `GET/PUT/DELETE /api/v1/<resources>/{tenantA_id}` | Returns `403 Forbidden` (fail-closed IDOR protection) |
| `REQ-005` | State transition rules | Resource in `DRAFT` state | `POST /{id}/transition?targetState=ACTIVE` (valid) vs `ARCHIVED` (illegal) | Valid returns `200 OK`; illegal jump returns `4xx` |

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
- **Base Path:** `@AutoRestController(basePath = "/api/v1/<kebab-plural>")`
- **Public Read-Only Surface (if applicable):** `@AutoRestController(basePath = "/api/v1/public/<kebab-plural>", readDto = <Entity>ReadDto.class)` extending `AutoReadApi<E>`
- **Disabled Auto Endpoints:** `disabledEndpoints = {}`
- **Custom Endpoints / Overrides:**

| HTTP | Full Path | Mechanism (`@CustomEndpoint` / `@ServiceOverride`) | Delegate Bean & Method | Request / Response DTO | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/<resources>/<action>` | `@CustomEndpoint` | `<helperBean>.<method>` | `<Action>RequestDto` → `ApiResponse<<Action>ResponseDto>` | `200`, `400`, `403`, `409` |

---

## 5. Security, Resilience, Caching & Non-Functional Requirements

- **Entity RBAC (`@EntitySecurity`):** `readRoles = {...}`, `writeRoles = {...}`, `deleteRoles = {...}`, `ownerField = ""`
- **DB-RBAC Policies (if enabled):** Document explicit `DENY` / `ALLOW` policy rows.
- **Resilience & Concurrency:**
  - `@DistributedLock(key = "...")` on: `<service.method>` (non-final `@Lazy @Service`)
  - `@Idempotent` on: `<controller/method>`
  - `@RateLimit(requests = ..., windowSeconds = ..., partitionKey = "IP|USER|TENANT")`
- **Caching & Data Source:**
  - Read/Write ratio analysis: `<justify @AutoCacheable / @HttpCacheable or NO cache>`
  - DataSource routing: `PRIMARY` | `REPLICA` (`@TargetDataSource`)
- **Performance & SLA:**
  - List endpoints support Keyset O(1) (`GET /keyset`) and sparse `?fields=`, `spring.jpa.open-in-view: false`, zero N+1 queries.
  - JMeter load test target: **`0.0%` Error Rate**, p95 `< <target>ms`.

---

## 6. Open Questions (`[NEEDS CLARIFICATION]` Gate)

> **HARD STOP:** Every item below MUST be resolved and removed before creating `plan.md` or writing Java code.

- [ ] `[NEEDS CLARIFICATION: Confirm allowed writeRoles and whether multi-tenant isolation is required.]`
