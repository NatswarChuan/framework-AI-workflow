# Executable SDD + TDD Task List: <Feature Name>

- **Spec:** [`./spec.md`](./spec.md) | **Plan:** [`./plan.md`](./plan.md)
- **Workflow Tip:** Treat `tasks.md` as an ephemeral PR / agent execution checklist (archive or keep inside the PR description after merge to avoid multi-developer Git merge conflicts).
- **Rule:** Execute slices in declarative-first order. Every slice MUST observe a failing test (**RED**) before implementing production code (**GREEN**), then clean up (**REFACTOR**).

---

## Slice 1 — 2-Directory Entity, Controller & CRUD / Masking Contract (`REQ-001`, `REQ-003`)
- [ ] **[RED]** Write Tier 2 `MockMvc` tests in `<Feature>ContractTddTest` for `POST` (`201`), `@AutoCode`/`@AutoSlug`, `@Idempotent` replay (`409`), dot-filter, `/keyset`, `@FieldSecurity` masking, and `readDto` stripping; run `mvn test -Dtest=<Feature>ContractTddTest` and confirm failure (`404`/assertion).
- [ ] **[GREEN]** Implement `entity/<Entity>.java` (extending `BaseAuditEntity`), `controller/<Entity>Controller.java`, and optional `<Entity>ReadOnlyController.java` + `<Entity>ReadDto.java`; re-run → 100% PASS.
- [ ] **[REFACTOR]** Verify B-Tree `@Index` definitions, zero `@Data` on `@Entity`, `HEADER_X_IDEMPOTENCY_KEY` usage, and no `readDto` contamination; re-run → 100% PASS.

## Slice 2 — Custom Domain Validation, Exceptions & Helpers (Only If Needed) (`REQ-002`)
- [ ] **[RED]** Write Tier 1 unit tests in `<Action>HelperUnitTest` covering Happy Path, Negative Path (`BaseBusinessException` exact `StandardHttpStatus` & `errorCode`), and null/blank guard clauses; run `mvn test -Dtest=<Action>HelperUnitTest` and verify expected failure.
- [ ] **[GREEN]** Implement `<Domain>Exception` (`BaseBusinessException`), DTO builders, and `<Action>Helper` (plus Flyway/Liquibase migration if applicable); re-run unit test → 100% PASS.
- [ ] **[REFACTOR]** Extract repeated literals into constants, keep methods small and clear; re-run unit test → 100% PASS.

## Slice 3 — Security, Multi-Tenancy, StateMachine & Custom Workflows (`REQ-004`, `REQ-005`)
- [ ] **[RED]** Write Tier 2 tests for `@EntitySecurity`, `@MultiTenant` (`403` missing header + IDOR + JWT `tenantId` mismatch), DB-RBAC `DENY > ALLOW`, `@StateMachine` legal (`200`) + illegal (`422 Unprocessable Entity`) jumps, and `@CustomEndpoint`/`@ServiceOverride` authorization; verify RED failure.
- [ ] **[GREEN]** Implement security annotations, `SecurityIdentityCustomizer` tenant check, `@Lazy` non-final AOP `@Service` + `ObjectProvider<T>` wiring, and custom routes; re-run → 100% PASS.
- [ ] **[REFACTOR]** Verify `@Transactional` boundaries, no `@Transactional` on `final` classes, clean structured logs; re-run → 100% PASS.

## Slice 4 — Spec-to-Runtime Drift (`REQ-006`), Concurrency (`REQ-007`) & Final Release Gate
- [ ] **[RED]** Write Tier 3 Contract Drift test (`/v3/api-docs`, `/metadata`, `/schema/zod`, asserting internal fields are absent) and Tier 4 `RANDOM_PORT` + `RestClient` `@DistributedLock` concurrency race test (asserting zero `500`s); confirm failures if gaps exist.
- [ ] **[GREEN]** Resolve any schema leakage, lock ordering (`@DistributedLock` outer facade), or multi-pod SPI gaps until Tier 3 & Tier 4 tests pass 100%.
- [ ] **[VERIFY]** Confirm `prod` profile locks down `/system/studio`, `/system/studio/eject`, `/api/v1/auth/token`, and unauthenticated `/api/v1/**` paths.
- [ ] **[VERIFY]** Run full `mvn clean verify` → **0 Failures, 0 Errors, 0 Skipped** (zero `@Disabled`).
- [ ] **[VERIFY]** Run Apache JMeter (`mvn jmeter:configure jmeter:jmeter jmeter:results` or `mvn -Pjmeter verify`, when configured) → **0.0% Error Rate**.
- [ ] **[SYNC]** Confirm `spec.md` (and any golden OpenAPI/Zod snapshots) match final runtime behavior 100% and sign off Phases 0–6 in `CHECKLIST.md`.
