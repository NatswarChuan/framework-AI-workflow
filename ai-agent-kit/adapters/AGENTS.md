# AGENTS.md — Spring-NWVMC (`v0.1.0`) Consumer Agent Directives

> Drop this file at the root of any Java 21 + Spring Boot 3.x project using **Spring-NWVMC (`com.github.NatswarChuan:Spring-NWVMC:v0.1.0`)**.
> Compatible with **OpenAI Codex**, **Google Antigravity**, **OpenCode**, **Zed**, **Amp**, **Jules**, and any agent supporting the open `AGENTS.md` standard.

## 1. Progressive Disclosure Knowledge Base

Before inventing annotations, endpoints, or YAML keys, load the installed skill files in `.agents/skills/spring-nwvmc-adoption/` (or `ai-agent-kit/` if vendored):

- **Skill Runbook:** `.agents/skills/spring-nwvmc-adoption/SKILL.md`
- **Architecture Intro:** `.agents/skills/spring-nwvmc-adoption/INTRO.md`
- **Full Consumer Rules:** `.agents/skills/spring-nwvmc-adoption/RULES.md`
- **Pre-Handover Checklist:** `.agents/skills/spring-nwvmc-adoption/CHECKLIST.md`
- **Exact 60 Annotations & 133 Attributes:** `.agents/skills/spring-nwvmc-adoption/references/01-annotations-exact-matrix.md`
- **40 Auto-Endpoints & 13 Dot-Syntax Query Operators:** `.agents/skills/spring-nwvmc-adoption/references/02-endpoints-and-query-dsl.md`
- **Exact `app.framework.*` YAML Properties:** `.agents/skills/spring-nwvmc-adoption/references/03-yaml-properties-and-profiles.md`
- **Copy-Paste Verified Patterns:** `.agents/skills/spring-nwvmc-adoption/references/04-cookbook-verified-patterns.md`
- **Exact Non-Annotation Class/Constant/SPI Imports:** `.agents/skills/spring-nwvmc-adoption/references/05-imports-and-spi-contracts.md`
- **SDD + TDD Playbook & Starter Templates:** `.agents/skills/spring-nwvmc-adoption/references/06-sdd-and-tdd-playbook.md` & `.agents/skills/spring-nwvmc-adoption/templates/{spec,plan,tasks}.template.md`

---

## 1.5 Mandatory SDD (Spec-Driven) & TDD (Test-Driven) Protocol

1. **SDD Before Code:** Draft `specs/<feature>/spec.md` (`REQ-ID` Given/When/Then criteria, entity schema, API surface, security/RBAC/tenant rules, NFRs). Stop and confirm any `[NEEDS CLARIFICATION]` item with the user BEFORE writing `plan.md`, `tasks.md`, or Java code. Keep `spec.md` synced with live `/v3/api-docs`, `/metadata`, and `/schema/zod` (zero drift).
2. **TDD Red → Green → Refactor:** For every `REQ-ID` (and every bug fix!), write a failing JUnit 5 / `MockMvc` test tagged `@DisplayName("REQ-XXX: ...")` **first** (`RED`), run `mvn test -Dtest=...` to verify the expected failure, implement minimal declarative Spring-NWVMC code (`GREEN`), then refactor cleanly (`REFACTOR`). NEVER delete, weaken, or `@Disabled` a failing test.
3. **4-Tier Test Coverage:** Tier 1 pure unit tests (Helpers/Exceptions/Guards), Tier 2 real `@SpringBootTest` + `MockMvc` security/masking/state-machine/idempotency/lockdown tests, Tier 3 OpenAPI/`/schema/zod` contract-drift tests, Tier 4 `@DistributedLock` concurrency & JMeter `0.0%` error SLA.

---

## 2. Hard Non-Negotiable Rules (Anti-Hallucination Guardrails)

1. **Verified Dependency & Build Requirements:**
   - Java **21 LTS** + Spring Boot **3.2.5 / 3.3.5 / 3.4.0**.
   - **Maven Central:** `io.github.natswarchuan:spring-nwvmc:0.1.0` (no custom repository needed; optional JitPack mirror: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`).
   - `maven-compiler-plugin` MUST configure `<parameters>true</parameters>`.
2. **2-Directory Contract First:**
   - Put JPA entities extending `BaseAuditEntity` in `entity/`. NEVER use `@Data` on JPA entities (`@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`). NEVER invent `@SoftDelete` (soft-delete + UUIDv7 + `@Version` live on `BaseAuditEntity`).
   - Put `@AutoRestController` interfaces in `controller/` extending `AutoApiController<E>` (full 40 endpoints) or narrow composable interfaces (`AutoReadApi<E>`, `AutoWriteApi<E>`, `AutoBatchApi<E>`, `AutoAuditApi<E>`, `AutoAnalyticsApi<E>`, `AutoStateApi<E>`, `AutoExportImportApi<E>`, `AutoSchemaApi<E>`, `AutoAiApi<E>`).
   - NEVER write manual boilerplate `Repository` / `Service` / `@RestController` CRUD classes for entities already managed by `@AutoRestController`.
3. **Exact 6 Annotation Packages Only (Zero Invented Annotations):**
   - `io.github.natswarchuan.core.annotation.*` (54 annotations)
   - `io.github.natswarchuan.module.cache.http.annotation.HttpCacheable`
   - `io.github.natswarchuan.module.datasource.annotation.{TargetDataSource, TargetDatabasePlatform}`
   - `io.github.natswarchuan.module.event.annotation.PublishCloudEvent`
   - `io.github.natswarchuan.module.lock.annotation.DistributedLock`
   - `io.github.natswarchuan.module.webhook.annotation.EntityWebhook`
4. **Empirically Verified Runtime Pitfalls (NEVER Break These):**
   - **`@StateMachine.transitions` uses COLON syntax** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), NEVER `"FROM -> TO"`.
   - **State transitions use query parameter** `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT`, NEVER a JSON body.
   - **Filter operators use DOT syntax** (`retailPrice.gte=1000&productName.like=MacBook`), NEVER `__gte`.
   - **Auto base path splits camelCase strictly:** `ECommerceOrder` → `/api/v1/e-commerce-orders`. Set `@AutoRestController(basePath = "...")` if you need a custom path.
   - **Inject framework `@AutoComponent` helpers via `ObjectProvider<T>`** inside consumer `@Component` / `@Service` beans (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) and call `.getObject()` at runtime.
   - **AOP-intercepted consumer `@Service` classes** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) MUST be **non-final** and **`@Lazy`** (class + method `@TargetDataSource` for `REPLICA` on `v0.1.0`), AND any `@Component` injecting them MUST ALSO use **`ObjectProvider<MyService>`** or **`@Lazy`**. NEVER place `@Transactional` on `public final class` Helpers.
   - **Dev JWT & Testing:** Dev token endpoint is **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NOT `GET /system/studio/demo-token`); `JwtTokenService.generateToken(username, userId, roles)` takes **`username` FIRST**.
   - **`readDto` projection scope:** Every route on a controller with `readDto = X.class` projects responses through `X`. Mount endpoints returning other DTO shapes on a separate controller without `readDto`.
   - **`@ServiceOverride` fail-closed RBAC:** Custom `@AutoGet` + `@ServiceOverride` method names not in `SecurityConstant.READ_OPERATIONS` default to `writeRoles` unless explicitly opened via `@SecurityPolicyEntity` or `SecurityIdentityCustomizer`.
   - **`@CustomEndpoint` direct dispatch:** Apply security/AOP inside the delegated Spring bean (not on the proxy method).
   - **Outbox & Storage:** Outbox event types match `EventConstant` (`ENTITY_CREATED`, not `CREATED`); `POST /api/v1/storage/upload` returns `201 Created`.
5. **Production Security Lockdown (Mandatory):**
   - `application.yml` / `application-prod.yml` MUST keep `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, and load `JWT_SECRET` (`>= 32` UTF-8 bytes) from environment variables.
   - Enable Dev Studio ONLY in `application-dev.yml`.
   - Every protected entity MUST declare `@EntitySecurity(...)` and mask sensitive fields with `@FieldSecurity(...)`.

---

## 3. Verification Gate Before Finishing

1. Walk through `.agents/skills/spring-nwvmc-adoption/CHECKLIST.md`.
2. Run `mvn clean verify` (or `./gradlew check`) — 100% of unit/integration tests MUST pass with `0` failures and `0` `@Disabled` tests.
3. Verify `prod` profile refuses `/system/studio` (`401`/`404`) and `/api/v1/auth/token` (`404`).
