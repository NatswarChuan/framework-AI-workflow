# Technical Implementation Plan: <Feature Name>

- **Spec Source:** [`./spec.md`](./spec.md) (`STATUS: APPROVED` — zero unresolved `[NEEDS CLARIFICATION]`)
- **Target Version:** `io.github.natswarchuan:spring-nwvmc:0.1.0`

---

## 1. Architectural Mapping (2-Directory Contract + Extensions)

| Layer / Package | Artifact Class | Stereotype / Supertype | Single Responsibility |
| :--- | :--- | :--- | :--- |
| `entity/` | `<Entity>.java` | `@Entity extends BaseAuditEntity` | Domain state, indexes, declarative annotations |
| `controller/` | `<Entity>Controller.java` | `@AutoRestController interface extends AutoApiController<E>` | Declarative route contract |
| `controller/` | `<Entity>ReadOnlyController.java` | `@AutoRestController(readDto = ...) extends AutoReadApi<E>` | Public read-only projection (optional) |
| `dto/` | `<Entity>ReadDto.java` | Immutable Builder DTO | Zero internal-field leakage |
| `service/` + `service/impl/` | `<Action>ServiceImpl.java` | Non-final `@Lazy @Service` | `@Transactional` + AOP (`@DistributedLock`, `@AutoCacheable`, `@TargetDataSource`) |
| `helper/` | `<Action>Helper.java` | `public final class @Component` | Atomic business helpers (NO `@Transactional`, injects AOP services via `ObjectProvider<T>`) |
| `exception/` | `<Domain>Exception.java` | `extends BaseBusinessException` | Typed `StandardHttpStatus` + i18n `errorCode` |
| `constant/` | `<Domain>Constant.java` | `public final class` | Zero hard-coded strings/numbers |

---

## 2. Spring-NWVMC Runtime Pitfall Pre-Check (`RULES.md` §2)

- [ ] `@StateMachine.transitions` uses colon syntax (`"FROM:TO1,TO2"`), called via `?targetState=`.
- [ ] Query operators use dot syntax (`.gte`, `.like`).
- [ ] Framework `@AutoComponent` helpers injected via `ObjectProvider<T>`.
- [ ] AOP `@Service` beans are **non-final**, **`@Lazy`**, and injected lazily (`ObjectProvider<MyService>` / `@Lazy`) by callers; ZERO `@Transactional` on `public final class` Helpers.
- [ ] Controllers declaring `readDto = ...` host ONLY routes returning that DTO shape.
- [ ] `application.yml` keeps `studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`.

---

## 3. Requirement-to-Test Traceability Matrix (SDD ↔ TDD Contract)

| REQ-ID | Spec Summary | Runtime Endpoint / Class | Test Tier | Test Class & Method (`RED` First) |
| :--- | :--- | :--- | :---: | :--- |
| `REQ-001` | Create resource + auto-code | `POST /api/v1/<resources>` | Tier 2 | `<Feature>ContractTddTest#shouldCreateResourceWithAutoCode` |
| `REQ-002` | Validation guard clause (`400`) | `<Action>Helper.validate...` | Tier 1 | `<Action>HelperUnitTest#shouldRejectInvalidInput` |
| `REQ-003` | `@FieldSecurity` + `readDto` strip | `GET /api/v1/<resources>/{id}` | Tier 2 | `<Feature>SecurityTddTest#shouldMaskAndStripSensitiveFields` |
| `REQ-004` | `@MultiTenant` / IDOR (`403`) | `GET/DELETE /api/v1/<resources>/{id}` | Tier 2 | `<Feature>SecurityTddTest#shouldBlockCrossTenantAccess` |
| `REQ-005` | `@StateMachine` legal & illegal jumps | `POST /{id}/transition?targetState=` | Tier 2 | `<Feature>WorkflowTddTest#shouldEnforceStateTransitions` |
| `REQ-006` | OpenAPI / `/metadata` / `/schema/zod` parity | `GET /v3/api-docs`, `/schema/zod` | Tier 3 | `<Feature>ContractDriftTddTest#shouldMatchSpecSchemas` |
| `REQ-007` | Concurrent lock safety / Load SLA | `POST /api/v1/<resources>/<action>` | Tier 4 | `<Feature>ConcurrencyTddTest#shouldPreventRaceCondition` |
