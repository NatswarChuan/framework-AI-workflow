# Technical Implementation Plan: <Feature Name>

- **Spec Source:** [`./spec.md`](./spec.md) (`STATUS: APPROVED` — zero unresolved `[NEEDS CLARIFICATION]`)
- **Target Version:** `io.github.natswarchuan:spring-nwvmc:0.1.0`

---

## 1. Architectural Mapping (2-Directory Contract + Extensions)

| Layer / Package | Artifact Class | Stereotype / Supertype | Single Responsibility |
| :--- | :--- | :--- | :--- |
| `entity/` | `<Entity>.java` | `@Entity extends BaseAuditEntity` | Domain state, indexes, declarative annotations |
| `controller/` | `<Entity>Controller.java` | `@AutoRestController(basePath = ...) interface extends AutoApiController<E>` | Declarative route contract |
| `controller/` | `<Entity>ReadOnlyController.java` | `@AutoRestController(readDto = ...) extends AutoReadApi<E>` | Public read-only projection (optional) |
| `dto/` | `<Entity>ReadDto.java` | Immutable Builder DTO | Zero internal-field leakage |
| `service/` + `service/impl/` | `<Action>ServiceImpl.java` | Non-final `@Lazy @Service` | `@Transactional` + AOP (`@DistributedLock`, `@AutoCacheable`, `@TargetDataSource`) |
| `helper/` | `<Action>Helper.java` | `@Component` (optional) | Atomic business logic / validation (NO `@Transactional` if declared `final`; inject AOP services via `ObjectProvider<T>`) |
| `exception/` | `<Domain>Exception.java` | `extends BaseBusinessException` | Typed `StandardHttpStatus` + i18n `errorCode` |
| `constant/` | `<Domain>Constant.java` | Constants class (optional) | Shared error codes, roles, prefixes |

---

## 2. Spring-NWVMC Runtime Pitfall Pre-Check (`RULES.md` §2)

- [ ] `@StateMachine.transitions` uses colon syntax (`"FROM:TO1,TO2"`), called via `?targetState=`, rejecting illegal jumps with HTTP `422`.
- [ ] Query operators use exact `FilterOperatorConstant` dot syntax (`.eq`, `.ne`, `.like`, `.startsWith`, `.endsWith`, `.gt`, `.gte`, `.lt`, `.lte`, `.in`, `.notIn`, `.between`, `.null`).
- [ ] Framework `@AutoComponent` helpers injected via `ObjectProvider<T>`.
- [ ] AOP `@Service` beans are **non-final**, **`@Lazy`**, and injected lazily (`ObjectProvider<MyService>` / `@Lazy`) by callers; ZERO `@Transactional` on `final` classes (`0.1.0` supports method-level `@TargetDataSource` natively).
- [ ] `@Idempotent` uses `HttpHeaderConstant.HEADER_X_IDEMPOTENCY_KEY` (or `AopConstant.HEADER_IDEMPOTENCY_KEY`) when clients send `X-Idempotency-Key`.
- [ ] `@CustomEndpoint` delegate beans explicitly enforce authentication/authorization; `readDto` controllers host ONLY routes returning that DTO shape.
- [ ] `application.yml` keeps `studio.enabled: false`, `demo-token-endpoint-enabled: false`, `default-deny-unannotated-entities: true`, `require-authenticated-api-paths: true`, `fail-fast-weak-jwt-secret: true`, `ddl-auto: validate`.

---

## 3. Requirement-to-Test Traceability Matrix (SDD ↔ TDD Contract — 1:1 with `spec.md`)

| REQ-ID | Spec Summary | Runtime Endpoint / Class | Test Tier | Test Class & Method (`RED` First) |
| :--- | :--- | :--- | :---: | :--- |
| `REQ-001` | Create resource + `@AutoCode` + `@Idempotent` (`201`→`409`) | `POST /api/v1/<resources>` | Tier 2 | `<Feature>ContractTddTest#shouldCreateAndDeduplicateResource` |
| `REQ-002` | Input / domain validation guard (`400` + `errorCode`) | `<Action>Helper.validate...` / `POST` | Tier 1 & 2 | `<Action>HelperUnitTest#shouldRejectInvalidInput` |
| `REQ-003` | `@FieldSecurity` masking + `readDto` strip | `GET /api/v1/<resources>/{id}` | Tier 2 | `<Feature>SecurityTddTest#shouldMaskAndStripSensitiveFields` |
| `REQ-004` | `@MultiTenant` / IDOR + JWT claim check (`403`) | `GET/PUT/DELETE /api/v1/<resources>/{id}` | Tier 2 | `<Feature>SecurityTddTest#shouldBlockCrossTenantAccess` |
| `REQ-005` | `@StateMachine` legal (`200`) & illegal (`422`) transitions | `POST /{id}/transition?targetState=` | Tier 2 | `<Feature>WorkflowTddTest#shouldEnforceStateTransitions` |
| `REQ-006` | OpenAPI / `/metadata` / `/schema/zod` parity (no secret leak) | `GET /v3/api-docs`, `/metadata`, `/schema/zod` | Tier 3 | `<Feature>ContractDriftTddTest#shouldMatchSpecSchemas` |
| `REQ-007` | Concurrent lock safety (`RANDOM_PORT` + zero `500`s) / Load SLA | `POST /api/v1/<resources>/<action>` | Tier 4 | `<Feature>ConcurrencyTddTest#shouldPreventOverselling` |
