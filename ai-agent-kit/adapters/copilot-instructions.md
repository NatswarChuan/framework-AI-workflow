# GitHub Copilot Instructions — Spring-NWVMC (`0.1.0`, SDD + TDD)

> Install at `.github/copilot-instructions.md` in any Java 21 + Spring Boot 3.x repository using **Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:0.1.0`)**.

## Framework Context & Reference Files
This codebase uses **Spring-NWVMC (`0.1.0`)** from Maven Central (`io.github.natswarchuan:spring-nwvmc:0.1.0`; optional JitPack mirror `v0.1.0`).
Full verified references live in `.agents/skills/spring-nwvmc-adoption/`:
- `SKILL.md` — SDD + TDD workflows & troubleshooting table
- `INTRO.md`, `RULES.md`, `CHECKLIST.md` — Orientation, SDD/TDD & anti-hallucination guardrails, 7-phase sign-off
- `references/01-annotations-exact-matrix.md` — All 60 exact annotations & 133 attributes
- `references/02-endpoints-and-query-dsl.md` — All 40 endpoints & 13 dot-syntax filter operators
- `references/03-yaml-properties-and-profiles.md` — Exact `app.framework.*` properties & profiles
- `references/04-cookbook-verified-patterns.md` — Verified Java/YAML/test patterns
- `references/05-imports-and-spi-contracts.md` — Exact non-annotation class, constant & SPI imports/signatures
- `references/06-sdd-and-tdd-playbook.md` & `templates/{spec,plan,tasks}.template.md` — SDD templates & 4-Tier TDD Red-Green-Refactor playbook

## Mandatory SDD + TDD Protocol
- **SDD First:** Draft `specs/<feature>/spec.md` (`REQ-ID` Given/When/Then criteria, schema, API surface, RBAC/tenant matrix, NFRs); resolve every `[NEEDS CLARIFICATION]` item before creating `plan.md` & `tasks.md`. Keep `spec.md` synced with `/v3/api-docs` & `/schema/zod`.
- **TDD Red → Green → Refactor:** Write a failing JUnit 5 / `MockMvc` test (`@DisplayName("REQ-XXX: ...")`) BEFORE production code (and regression test first for every bug fix), verify RED failure, implement minimal declarative code until GREEN, then REFACTOR. NEVER weaken assertions or use `@Disabled`. Cover all 4 tiers (Unit, `MockMvc` Integration, Contract Drift, Concurrency/JMeter).

## Mandatory Coding Guidelines
1. **Build Configuration:** Java **21 LTS**, Spring Boot **3.2.5 / 3.3.5 / 3.4.0**, `<parameters>true</parameters>` in `maven-compiler-plugin`.
2. **2-Directory Contract:**
   - Place JPA entities extending `BaseAuditEntity` in `entity/`. Never use `@Data` on JPA entities (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`). Never invent `@SoftDelete` (soft-delete, UUIDv7 `id`, and `@Version` come from `BaseAuditEntity`).
   - Place `@AutoRestController` interfaces in `controller/` extending `AutoApiController<E>` (40 endpoints) or narrow capability interfaces (`AutoReadApi<E>`, `AutoWriteApi<E>`, `AutoBatchApi<E>`, `AutoAuditApi<E>`, `AutoAnalyticsApi<E>`, `AutoStateApi<E>`, `AutoExportImportApi<E>`, `AutoSchemaApi<E>`, `AutoAiApi<E>`).
   - Do not scaffold manual CRUD repositories, services, or concrete `@RestController` classes for entities handled by `@AutoRestController`.
3. **Allowed Annotation Packages Only (6 Packages):**
   - `io.github.natswarchuan.core.annotation.*` (54 annotations)
   - `io.github.natswarchuan.module.cache.http.annotation.HttpCacheable`
   - `io.github.natswarchuan.module.datasource.annotation.{TargetDataSource, TargetDatabasePlatform}`
   - `io.github.natswarchuan.module.event.annotation.PublishCloudEvent`
   - `io.github.natswarchuan.module.lock.annotation.DistributedLock`
   - `io.github.natswarchuan.module.webhook.annotation.EntityWebhook`
4. **Verified Runtime Rules (Never Break):**
   - `@StateMachine.transitions`: use colon syntax `"CREATED:PENDING_PAYMENT,CANCELLED"`, NEVER `"FROM -> TO"`. Invoke transitions via `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (query parameter, NOT JSON body).
   - Query filters: use dot syntax (`retailPrice.gte=1000&productName.like=MacBook`), NEVER `__gte`.
   - CamelCase base paths: `ECommerceOrder` resolves to `/api/v1/e-commerce-orders`; specify `@AutoRestController(basePath = "...")` if custom URI needed.
   - Inject framework `@AutoComponent` helpers (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) via `ObjectProvider<T>` and call `.getObject()` at runtime.
   - Consumer `@Service` beans annotated with `@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, or `@TargetDataSource` MUST be **non-final** and **`@Lazy`** (plus class-level `@TargetDataSource` for `REPLICA` on `v0.1.0`), AND callers injecting them MUST use **`ObjectProvider<MyService>`** or **`@Lazy`**. NEVER place `@Transactional` on `public final class` Helpers.
   - Dev JWT endpoint is **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`**; `JwtTokenService.generateToken(username, userId, roles)` takes **`username` FIRST**.
   - Controllers declaring `readDto = X.class` map all responses through `X`; move custom DTO endpoints to a controller without `readDto`.
   - `@ServiceOverride` custom methods default to `writeRoles` (fail-closed); `@CustomEndpoint` dispatches directly to the delegated Spring bean (apply security/AOP inside the delegated bean).
   - Outbox event types use `EventConstant` (`ENTITY_CREATED`); `POST /api/v1/storage/upload` returns `201 Created`.
5. **Security Baseline:**
   - Keep `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, and `JWT_SECRET >= 32` UTF-8 bytes in `application.yml` / `application-prod.yml`.
   - Enable Dev Studio ONLY in `application-dev.yml`.
   - Protect every business entity with `@EntitySecurity(...)` and mask sensitive fields with `@FieldSecurity(...)`.
   - Verify every change with `mvn clean verify` (`0` failures, `0` `@Disabled` tests) and `.agents/skills/spring-nwvmc-adoption/CHECKLIST.md`.
