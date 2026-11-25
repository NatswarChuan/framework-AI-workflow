# CLAUDE.md — Spring-NWVMC (`v0.1.0`) Project Guide for Claude Code

> Drop this file at the root of your Spring Boot project when using **Anthropic Claude Code** (Claude Opus / Sonnet / Haiku).

## Project Stack & Framework
This project uses **Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:0.1.0` on Maven Central; optional JitPack mirror `v0.1.0`)** on **Java 21 LTS** and **Spring Boot 3.x** (`maven-compiler-plugin` `<parameters>true</parameters>` required).

## Installed Skill & Reference Documentation
Read on demand before writing or modifying Spring-NWVMC code (never guess annotation attributes, routes, or YAML keys):
- `.claude/skills/spring-nwvmc-adoption/SKILL.md` (or `.agents/skills/spring-nwvmc-adoption/SKILL.md`) — Master SDD+TDD workflows & troubleshooting table
- `.../INTRO.md` — 2-Directory Contract, 9 composable API interfaces, built-in subsystems
- `.../RULES.md` — Full SDD/TDD rules & anti-hallucination guardrails
- `.../CHECKLIST.md` — 7-phase SDD, security, TDD & pre-handover verification checklist
- `.../references/01-annotations-exact-matrix.md` — All 60 real annotations across 6 packages & 133 attributes
- `.../references/02-endpoints-and-query-dsl.md` — All 40 endpoints & 13 dot-syntax filter operators
- `.../references/03-yaml-properties-and-profiles.md` — Exact `app.framework.*` YAML keys & `dev`/`prod` profiles
- `.../references/04-cookbook-verified-patterns.md` — Verified Java/YAML/test recipes
- `.../references/05-imports-and-spi-contracts.md` — Exact non-annotation class, constant & SPI imports/signatures
- `.../references/06-sdd-and-tdd-playbook.md` & `.../templates/{spec,plan,tasks}.template.md` — SDD templates & 4-Tier TDD Red-Green-Refactor playbook

## Mandatory SDD + TDD Workflow (Execute Before Coding)
1. **SDD First:** Create `specs/<feature>/spec.md` (`REQ-ID` Given/When/Then criteria, schema, API surface, security/RBAC/tenant matrix, NFRs). Stop on any `[NEEDS CLARIFICATION]` item until user confirms; then generate `plan.md` (Traceability Matrix) & `tasks.md` (`[RED]→[GREEN]→[REFACTOR]`). Keep `spec.md` synced with live `/v3/api-docs` and `/schema/zod`.
2. **TDD Red → Green → Refactor:** Write a failing JUnit 5 / `MockMvc` test (`@DisplayName("REQ-XXX: ...")`) BEFORE production code (and regression test first for every bug fix), run `mvn test -Dtest=...` to verify RED failure, write minimal declarative Spring-NWVMC code until GREEN, then REFACTOR. NEVER weaken assertions or add `@Disabled`. Cover all 4 tiers (Unit, `MockMvc` Security/Workflow, Contract Drift, Concurrency/JMeter).

## Core Architectural Rules
1. **2-Directory Contract:** Put JPA entities extending `BaseAuditEntity` in `entity/` and `@AutoRestController` interfaces extending `AutoApiController<E>` (or narrow `AutoReadApi<E>`..`AutoAiApi<E>`) in `controller/`. Do NOT hand-code CRUD repositories/services/controllers for auto-managed entities.
2. **JPA Entity Safety:** NEVER put Lombok `@Data` on `@Entity`. Use `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`. Soft-delete, UUIDv7 `id`, and `@Version` optimistic locking are inherited from `BaseAuditEntity` (there is NO `@SoftDelete` annotation).
3. **Only 6 Real Annotation Packages:**
   - `io.github.natswarchuan.core.annotation.*` (54 annotations)
   - `io.github.natswarchuan.module.cache.http.annotation.HttpCacheable`
   - `io.github.natswarchuan.module.datasource.annotation.{TargetDataSource, TargetDatabasePlatform}`
   - `io.github.natswarchuan.module.event.annotation.PublishCloudEvent`
   - `io.github.natswarchuan.module.lock.annotation.DistributedLock`
   - `io.github.natswarchuan.module.webhook.annotation.EntityWebhook`

## Critical Verified Pitfalls (Always Enforce)
- **`@StateMachine.transitions`:** Colon syntax `"CREATED:PENDING_PAYMENT,CANCELLED"`, NEVER `"FROM -> TO"`. Invoke via query param `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT`, NOT JSON body.
- **Query Operators:** Dot syntax (`retailPrice.gte=1000&productName.like=MacBook`), NEVER `__gte`.
- **CamelCase Base Paths:** `ECommerceOrder` resolves to `/api/v1/e-commerce-orders`. Set `@AutoRestController(basePath = "...")` when you want a custom URI.
- **Bean Registration Order (`ObjectProvider`):** Inject framework `@AutoComponent` helpers (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) via `ObjectProvider<T>` and call `.getObject()` at invocation time.
- **AOP Proxying (`@Lazy` + non-final + Lazy Injection):** Consumer `@Service` beans using `@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, or `@TargetDataSource` MUST be **non-final** and **`@Lazy`** (plus class-level `@TargetDataSource` for `REPLICA` on `v0.1.0`), AND any `@Component` injecting them MUST use **`ObjectProvider<MyService>`** or **`@Lazy`**. NEVER put `@Transactional` on `public final class` Helpers.
- **Dev JWT & Testing:** Use `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` (NOT `/system/studio/demo-token`) and `JwtTokenService.generateToken(username, userId, roles)` (`username` FIRST!).
- **`readDto` Scoping:** Controllers declaring `readDto = X.class` map ALL responses through `X`. Put endpoints returning other DTOs on a controller without `readDto`.
- **Fail-Closed Custom Routes:** `@ServiceOverride` custom methods not in `SecurityConstant.READ_OPERATIONS` require `writeRoles` by default; `@CustomEndpoint` bypasses proxy-level security/rate-limit (apply security/AOP inside the delegated Spring bean).
- **Outbox & Storage:** Outbox event types use `EventConstant` (`ENTITY_CREATED`); `POST /api/v1/storage/upload` returns `201 Created`.
- **Production Lockdown:** `application.yml` MUST keep `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, and `JWT_SECRET` `>= 32` UTF-8 bytes from env vars. Enable Dev Studio ONLY in `application-dev.yml`.

## Mandatory Verification Commands
- Run `mvn clean verify` before declaring any task done (0 failures, 0 errors, 0 `@Disabled` tests).
- Check every applicable item in `CHECKLIST.md`.
