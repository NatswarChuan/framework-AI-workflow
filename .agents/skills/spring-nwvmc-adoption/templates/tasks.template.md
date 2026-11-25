# Executable SDD + TDD Task List: <Feature Name>

- **Spec:** [`./spec.md`](./spec.md) | **Plan:** [`./plan.md`](./plan.md)
- **Rule:** Execute slices in strict order. Every slice MUST observe a failing test (**RED**) before implementing production code (**GREEN**), then clean up (**REFACTOR**).

---

## Slice 1 — Domain Constants, Custom Exceptions & Core Helper (`REQ-002`)
- [ ] **[RED]** Write Tier 1 unit tests in `<Action>HelperUnitTest` covering Happy Path, Negative Path (`BaseBusinessException`), and null/blank Guard Clauses; run `mvn test -Dtest=<Action>HelperUnitTest` and verify expected failure.
- [ ] **[GREEN]** Implement `<Domain>Constant`, `<Domain>Exception`, DTO (`@Builder`), and `<Action>Helper`; re-run unit test → 100% PASS.
- [ ] **[REFACTOR]** Check zero magic strings/numbers, `Objects.isNull`, flat guard clauses, Javadocs; re-run unit test → 100% PASS.

## Slice 2 — 2-Directory Entity, Controller & CRUD Contract (`REQ-001`, `REQ-003`)
- [ ] **[RED]** Write Tier 2 `MockMvc` tests in `<Feature>ContractTddTest` for `POST` (`201`), `@AutoCode`/`@AutoSlug`, dot-filter, `/keyset`, `@FieldSecurity` masking, and `readDto` stripping; run `mvn test -Dtest=<Feature>ContractTddTest` and confirm failure (`404`/assertion).
- [ ] **[GREEN]** Implement `entity/<Entity>.java` (extending `BaseAuditEntity`), `controller/<Entity>Controller.java`, and optional `<Entity>ReadOnlyController.java`; re-run → 100% PASS.
- [ ] **[REFACTOR]** Verify B-Tree `@Index` definitions, zero `@Data` on `@Entity`, no `readDto` contamination; re-run → 100% PASS.

## Slice 3 — Security, Multi-Tenancy, StateMachine & Custom Workflows (`REQ-004`, `REQ-005`)
- [ ] **[RED]** Write Tier 2 tests for `@EntitySecurity`, `@MultiTenant` (`403`/IDOR), DB-RBAC `DENY > ALLOW`, `@StateMachine` legal (`200`) + illegal (`4xx`) jumps, `@Idempotent` replay (`201`→`409`), and `@CustomEndpoint`/`@ServiceOverride`; verify RED failure.
- [ ] **[GREEN]** Implement security annotations, `@Lazy` non-final AOP `@Service` + `ObjectProvider<T>` wiring, and custom routes; re-run → 100% PASS.
- [ ] **[REFACTOR]** Verify `@Transactional` boundaries, no `@Transactional` on `final` Helpers, clean logs; re-run → 100% PASS.

## Slice 4 — Spec-to-Runtime Drift, Concurrency & Final Release Gate (`REQ-006`, `REQ-007`)
- [ ] **[RED/GREEN]** Write Tier 3 Contract Drift tests (`/v3/api-docs`, `/metadata`, `/schema/zod`) and Tier 4 Concurrency (`@DistributedLock` parallel race test).
- [ ] **[VERIFY]** Confirm `prod` profile locks down `/system/studio` (`401`/`404`) and `POST /api/v1/auth/token` (`404`).
- [ ] **[VERIFY]** Run full `mvn clean verify` → **0 Failures, 0 Errors, 0 Skipped** (zero `@Disabled`).
- [ ] **[VERIFY]** Run Apache JMeter (`mvn jmeter:jmeter jmeter:results`, if configured) → **0.0% Error Rate**.
- [ ] **[SYNC]** Confirm `spec.md` matches final runtime behavior 100% and sign off all phases in `CHECKLIST.md`.
