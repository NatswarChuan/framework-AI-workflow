# GEMINI.md — Spring-NWVMC (`v0.1.0`) Consumer Workspace Directives

> Drop this file at the root of your consumer Spring Boot project when using **Google Antigravity**, **Gemini CLI**, or **Gemini Code Assist**.

## 1. Auto-Discovered Skill & Reference Files
This project consumes **Spring-NWVMC (`com.github.NatswarChuan:Spring-NWVMC:v0.1.0`)** on **Java 21 LTS** + **Spring Boot 3.x**.
Activate the `spring-nwvmc-adoption` skill in `.agents/skills/spring-nwvmc-adoption/SKILL.md` and consult its references before writing Spring-NWVMC code:
- [SKILL.md](.agents/skills/spring-nwvmc-adoption/SKILL.md) — Step-by-step workflows & troubleshooting matrix
- [INTRO.md](.agents/skills/spring-nwvmc-adoption/INTRO.md) — Architecture, JitPack setup, 9 composable interfaces
- [RULES.md](.agents/skills/spring-nwvmc-adoption/RULES.md) — Full consumer rules & anti-hallucination contract
- [CHECKLIST.md](.agents/skills/spring-nwvmc-adoption/CHECKLIST.md) — 6-phase production & verification checklist
- [01-annotations-exact-matrix.md](.agents/skills/spring-nwvmc-adoption/references/01-annotations-exact-matrix.md) — 60 exact annotations, 6 packages, 133 attributes
- [02-endpoints-and-query-dsl.md](.agents/skills/spring-nwvmc-adoption/references/02-endpoints-and-query-dsl.md) — 40 endpoints & 13 dot-syntax filter operators
- [03-yaml-properties-and-profiles.md](.agents/skills/spring-nwvmc-adoption/references/03-yaml-properties-and-profiles.md) — `app.framework.*` properties & `dev`/`prod` profiles
- [04-cookbook-verified-patterns.md](.agents/skills/spring-nwvmc-adoption/references/04-cookbook-verified-patterns.md) — Copy-paste verified recipes
- [05-imports-and-spi-contracts.md](.agents/skills/spring-nwvmc-adoption/references/05-imports-and-spi-contracts.md) — Exact non-annotation class/constant/SPI imports & signatures

## 2. Strict Non-Negotiable Rules
1. **Build:** Java 21 LTS + `maven-compiler-plugin` `<parameters>true</parameters>` + JitPack `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`.
2. **2-Directory Contract:** `entity/` (extends `BaseAuditEntity`, NEVER `@Data`, NEVER `@SoftDelete`) + `controller/` (`@AutoRestController` interface extending `AutoApiController<E>` or narrow `AutoReadApi<E>`..`AutoAiApi<E>`). Do not create manual CRUD repositories/services/controllers for auto-managed entities.
3. **Exact 6 Annotation Packages Only:**
   - `io.github.natswarchuan.core.annotation.*` (54 annotations)
   - `io.github.natswarchuan.module.cache.http.annotation.HttpCacheable`
   - `io.github.natswarchuan.module.datasource.annotation.{TargetDataSource, TargetDatabasePlatform}`
   - `io.github.natswarchuan.module.event.annotation.PublishCloudEvent`
   - `io.github.natswarchuan.module.lock.annotation.DistributedLock`
   - `io.github.natswarchuan.module.webhook.annotation.EntityWebhook`
4. **Verified Runtime Gotchas (Zero Tolerance):**
   - `@StateMachine.transitions`: colon syntax `"CREATED:PENDING_PAYMENT,CANCELLED"`, NEVER `"FROM -> TO"`. Invoke via `POST /api/v1/{entity}/{id}/transition?targetState=...`, NEVER JSON body.
   - Query operators: dot syntax (`retailPrice.gte=1000&productName.like=MacBook`), NEVER `__gte`.
   - CamelCase routes: `ECommerceOrder` → `/api/v1/e-commerce-orders` (or set explicit `basePath`).
   - Inject framework `@AutoComponent` helpers (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) via `ObjectProvider<T>` and call `.getObject()` at runtime.
   - Consumer `@Service` beans using framework AOP (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) MUST be **non-final** and **`@Lazy`** (plus class-level `@TargetDataSource` for `REPLICA` on `v0.1.0`), AND callers injecting them MUST use **`ObjectProvider<MyService>`** or **`@Lazy`**. NEVER place `@Transactional` on `public final class` Helpers.
   - Dev JWT endpoint is **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`**; `JwtTokenService.generateToken(username, userId, roles)` takes **`username` FIRST**.
   - Controllers with `readDto = X.class` project ALL responses through `X`; mount other DTO routes on a controller without `readDto`.
   - `@ServiceOverride` custom methods default to `writeRoles` (fail-closed); `@CustomEndpoint` dispatches directly to the delegated Spring bean (place security/AOP on the bean).
   - Outbox event types use `EventConstant` (`ENTITY_CREATED`); `POST /api/v1/storage/upload` returns `201 Created`.
5. **Production Lockdown:** Keep `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, and `JWT_SECRET >= 32` UTF-8 bytes in `application.yml` / `application-prod.yml`. Enable Dev Studio only in `application-dev.yml`.

## 3. Completion Gate
Execute `mvn clean verify` and confirm every applicable item in `CHECKLIST.md` passes with `0` failures and `0` `@Disabled` tests.
