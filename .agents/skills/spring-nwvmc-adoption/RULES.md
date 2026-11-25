# Spring-NWVMC (`0.1.0`) — Universal AI-Agent Rules, SDD/TDD Protocol & Anti-Hallucination Guardrails

> **Scope:** Applies to EVERY AI coding agent and LLM (**Claude**, **Gemini / Antigravity**, **Codex / ChatGPT**, **Cursor**, **Copilot**, **Windsurf**, **Cline / Roo**, **DeepSeek**, **Qwen**, **Grok**, **Llama**, **Mistral**) when integrating, extending, or debugging an application built on **Spring-NWVMC `0.1.0`** (`io.github.natswarchuan:spring-nwvmc:0.1.0`).
>
> **Golden Rule:** NEVER guess an annotation name, attribute, YAML key, URL path, or query operator — and NEVER write production code before specifying the contract (**SDD**) and writing a failing test (**TDD**).

---

## 0. Mandatory SDD (Spec-Driven) & TDD (Test-Driven) Engineering Protocol

Load full templates and test recipes from `references/06-sdd-and-tdd-playbook.md` and `templates/{spec,plan,tasks}.template.md`.

### Rule 0.1 — Spec-First Before Production Code (SDD Gate)
1. **Specify First:** Before coding any new feature, entity, custom route, or security policy, create or update `specs/<feature-slug>/spec.md` with testable **`REQ-ID` (`Given / When / Then`)** acceptance criteria, entity fields, API surface (`AutoApiController<E>` vs `AutoReadApi<E>` + `readDto`), security/multi-tenant matrix, `@StateMachine` graph, resilience/cache contract, and NFRs.
2. **Zero Silent Assumptions (`[NEEDS CLARIFICATION]` Hard Stop):** If roles, tenant rules, state transitions, validation limits, or public DTO fields are ambiguous, record `[NEEDS CLARIFICATION: ...]` in `spec.md` and **ask the user before planning or coding**.
3. **Plan & Traceability (`plan.md` + `tasks.md`):** Map every `REQ-ID` 1:1 to a target endpoint/class and a concrete test case (`plan.md`), then slice work into ordered `[RED] → [GREEN] → [REFACTOR]` tasks (`tasks.md`). *(Single-route tweaks or bug fixes may use a lightweight mini-spec with `REQ-ID` + mandatory regression test.)*
4. **Living Specification (Zero Spec-Code Drift):** Any contract change discovered during implementation MUST update `spec.md` in the same atomic change, verified against live `/v3/api-docs`, `/api/v1/{entity}/metadata`, `/schema/zod`, and `/api/v1/graphql/schema`.

### Rule 0.2 — Red → Green → Refactor Discipline (TDD Gate)
1. **RED First (Proven Failing Test):** For every `REQ-ID`, write a JUnit 5 test annotated with `@DisplayName("REQ-XXX: ...")` **before** implementing the production code, run `mvn test -Dtest=<TargetTest>`, and confirm it fails for the expected behavioral reason (e.g., `404` missing route, `200` instead of `403`, unmasked PII, missing `409`).
2. **GREEN Second (Minimal Declarative Code):** Write the minimal Spring-NWVMC declarative implementation (`entity/` + `controller/` + `@Lazy @Service` / `Helper`) to make the test pass.
3. **REFACTOR Third (Clean Under Green Safety Net):** Eliminate magic strings/numbers into `*Constant`, refine SRP/guard clauses, confirm zero N+1 SQL, and re-run `mvn clean verify`.
4. **Bug-Fix Regression Law:** Every bug fix MUST begin with a failing regression test reproducing the exact bug (RED) before editing production code (GREEN).
5. **Anti-Cheating Law:** NEVER delete, weaken, mock away Spring-NWVMC security/proxy behavior, or add `@Disabled` to turn a failing test green.
6. **4-Tier Test Pyramid Required:**
   - **Tier 1 (Unit):** JUnit 5 + Mockito + AssertJ for Helpers, Services, `BaseBusinessException`, DTO builders, null/blank guard clauses.
   - **Tier 2 (Integration `MockMvc`):** Real `@SpringBootTest` tests covering CRUD, `@FieldSecurity`, `readDto` stripping, `@EntitySecurity`, `@MultiTenant` (`403`/IDOR), DB-RBAC `DENY > ALLOW`, `@StateMachine` legal/illegal transitions, `@Idempotent` (`201`→`409`), `@HttpCacheable` (`200`→`304`), `@Version` (`409`), and `prod` Studio lockdown (`401`/`404`).
   - **Tier 3 (Contract Drift):** Assert `/v3/api-docs`, `/metadata`, and `/schema/zod` match `spec.md` with zero leaked internal fields.
   - **Tier 4 (Concurrency & Load):** Parallel `ExecutorService` test for `@DistributedLock` + Apache JMeter `0.0%` error rate where configured.

---

## 1. Zero-Hallucination & Exact API Contract Rules

1. **Use ONLY the 60 real framework annotations from their exact 6 Java packages** (listed in `references/01-annotations-exact-matrix.md`).
   - **FORBIDDEN fictional annotations (DO NOT INVENT):** `@SoftDelete` (soft-delete is built into `BaseAuditEntity.deleted`), `@AutoRest`, `@EnableNwvmc`, `@EnableAutoApi`, `@AutoCrudController`, `@DynamicController`, `@FieldMask`, `@RateLimiter`.
2. **Exact Version Lock & Compiler Flag:**
   - Use **`io.github.natswarchuan:spring-nwvmc:0.1.0`** (Maven Central — primary; optional JitPack mirror: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`).
   - Always configure `<maven-compiler-plugin>` with `<parameters>true</parameters>` (Java **21**). Without `-parameters`, SpEL keys like `#stockSkuCode` in `@DistributedLock` / `@AutoCacheable` fail to resolve parameter names.
3. **Never write boilerplate CRUD `Repository` / `Service` / `Controller` classes** for entities managed by `@AutoRestController`. Put the domain entity in `entity/` and a thin interface extending `AutoApiController<E>` (or composable `AutoReadApi<E>`..`AutoAiApi<E>`) in `controller/`.

---

## 2. Critical Runtime Syntax Rules (Empirically Verified Against `v0.1.0`)

These 8 syntax rules prevent the most common LLM hallucinations and runtime failures:

### Rule 2.1 — `@StateMachine.transitions` Uses COLON Syntax (`"FROM:TO1,TO2"`), NEVER Arrows!
- **CORRECT:**
  ```java
  @StateMachine(
      initial = "CREATED",
      transitions = {
          "CREATED:PENDING_PAYMENT,CANCELLED",
          "PENDING_PAYMENT:CONFIRMED,CANCELLED",
          "CONFIRMED:ALLOCATED,REFUNDED"
      },
      deletableStates = {"CREATED", "CANCELLED"})
  ```
- **FORBIDDEN:** `"CREATED -> PENDING_PAYMENT"` (will fail to parse!).

### Rule 2.2 — State Transition Endpoint Uses Query Parameter `?targetState=`, NOT JSON Body!
- **CORRECT:** `POST /api/v1/e-commerce-orders/{id}/transition?targetState=PENDING_PAYMENT`
- **FORBIDDEN:** `POST /api/v1/e-commerce-orders/{id}/transition` with JSON body `{"targetState":"PENDING_PAYMENT"}` (returns HTTP `422`).

### Rule 2.3 — Dynamic Filter Operators Use DOT Syntax (`.gte`, `.like`), NOT Double Underscores (`__`)!
- **CORRECT:** `GET /api/v1/product-catalogs?category=ELECTRONICS&retailPrice.gte=1000&productName.like=MacBook&fields=id,skuCode,productName,retailPrice`
- **FORBIDDEN:** `retailPrice__gte=1000` (returns HTTP `400 Bad Request`).
- All 13 real operators: `.eq`, `.neq`, `.gt`, `.gte`, `.lt`, `.lte`, `.like`, `.ilike`, `.startsWith`, `.endsWith`, `.in`, `.notIn`, `.isNull`.

### Rule 2.4 — Auto-Derived Base Paths Follow Strict CamelCase-to-Kebab-Case Splitting
- Every capital-letter transition inserts a hyphen and pluralizes:
  - `ProductCatalog` → `/api/v1/product-catalogs`
  - `ECommerceOrder` → **`/api/v1/e-commerce-orders`** (NOT `/api/v1/ecommerce-orders`!)
  - `PaymentTransaction` → `/api/v1/payment-transactions`
  - `InventoryStock` → `/api/v1/inventory-stocks`
  - `ElectronicInvoice` → `/api/v1/electronic-invoices`
- Whenever an entity name has consecutive uppercase letters (e.g., `ECommerceOrder`, `B2BContract`) and you want a custom URI, declare `@AutoRestController(basePath = "/api/v1/custom-path")` explicitly.

### Rule 2.5 — Inject Framework `@AutoComponent` Helpers via `ObjectProvider<T>` in Consumer `@Component` Beans
- Framework auto-configuration (`ControllerToApiAutoConfiguration`) bootstraps pure-Java `@AutoComponent` beans (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) **after** consumer `@ComponentScan` begins.
- **MANDATORY:** In any consumer `@Component` or `@Service`, inject dynamically bootstrapped framework helpers via `org.springframework.beans.factory.ObjectProvider<T>`:
  ```java
  private final ObjectProvider<AiNaturalLanguageQueryParserHelper> nlQueryParserProvider;
  // At call time: nlQueryParserProvider.getObject().executeNaturalLanguageQuery(...)
  ```
- Direct eager constructor injection fails with `NoSuchBeanDefinitionException` when the consumer bean initializes before `ControllerToApiAutoConfiguration`.

### Rule 2.6 — Consumer `@Service` Classes Using Framework AOP Aspects MUST Be Non-Final, `@Lazy`, AND Lazily Injected!
- Framework aspects (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`, `@Idempotent`) are registered during framework auto-configuration.
- **MANDATORY** on any consumer `@Service` class using these annotations:
  1. Class MUST be **non-final** (`public class MyServiceImpl implements MyService`) so Spring CGLIB proxies can subclass it.
  2. Annotate the `@Service` class with **`@Lazy`** (`org.springframework.context.annotation.Lazy`) so Spring creates its AOP proxy after framework aspects are registered.
  3. **CRITICAL:** Any consumer `@Component` (such as a Helper or Controller delegate) that injects a `@Lazy` AOP `@Service` MUST ALSO inject it via **`ObjectProvider<MyService>`** (or annotate the constructor parameter with **`@Lazy`**). Eager constructor injection forces early instantiation before `AutoCacheAspect` registers and silently defeats caching!
  4. **Never place `@Transactional` on a `public final class` Helper** — Spring CGLIB fails at startup with `AopConfigException: Cannot subclass final class`. Keep `@Transactional` strictly on non-final `@Lazy @Service` classes.
  5. On JitPack `v0.1.0`, when annotating a service method with `@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)`, also place `@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)` at the class level so `DataSourceRoutingAspect` always binds a non-null key.

### Rule 2.7 — Keep `@AutoRestController(readDto = ...)` Controllers Dedicated to That Entity's Projection
- `ControllerDtoContractUtil` projects responses returned from a controller declaring `readDto = ProductReadDto.class` through `ProductReadDto` (stripping fields absent from the DTO).
- Never mount unrelated custom DTO routes (e.g., `CategorySalesAnalyticsDto`) on a `readDto`-projected controller; mount them on a controller without `readDto` or a dedicated interface.

### Rule 2.8 — Verified Runtime Event Names, Auth Token Endpoint & JitPack `v0.1.0` Caveats
- **Dev Demo JWT Endpoint:** **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (`200 OK`, JSON `$.data.token`, `$.data.userId`, `$.data.username`, `$.data.role`). NEVER call `GET /system/studio/demo-token` (`404`) or `GET /api/v1/auth/token` (`405`).
- **Programmatic JWT Minting in Tests:** `jwtTokenService.generateToken(String username, String userId, Set<String> roles)` — **`username` is FIRST, `userId` is SECOND!**
- **Outbox event types (`EventConstant`):** `"ENTITY_CREATED"`, `"ENTITY_UPDATED"`, `"ENTITY_DELETED"`, `"ENTITY_STATE_CHANGED"` (NOT `"CREATED"`).
- **File upload status:** `POST /api/v1/storage/upload` returns HTTP **`201 Created`** (`data.fileId`).
- **Maven Central `0.1.0` Native Fixes (vs legacy `0.0.3`):** `0.1.0` natively preserves `ResponseEntity` headers (`ETag`/`Cache-Control`), unwraps `ApiResponse.getData()` before SHA-256 ETag hashing (ignoring random `traceId`), skips double-wrapping `ResponseEntity` in `DynamicResponseUtil`, splits method/class `@TargetDataSource` AspectJ pointcuts, and passes 4xx `BaseBusinessException` through `@EntityRetry` without wrapping into `500 RetryExhaustedException`. If consuming legacy `v0.0.3`, return `ApiResponse<MyDto>` from `@HttpCacheable` `@ServiceOverride` helpers and keep `@EntityRetry` off 4xx endpoints.
- **Built-in route aliases (both work identically):** `/ai/context` ↔ `/ai-context`, `/ai/query` ↔ `/ai-query`, `/events` ↔ `/stream`, `/human-policy` ↔ `/policy-summary`.

---

## 3. Entity, Security & Multi-Tenancy Rules

1. **Always extend `BaseAuditEntity`** (`io.github.natswarchuan.common.entity.BaseAuditEntity`): gives UUIDv7 `id`, `@Version` optimistic lock (HTTP `409 Conflict` on stale writes), `createdAt`/`updatedAt`/`createdBy`/`updatedBy`, and `deleted` soft-delete (`DELETE /{id}` + `POST /{id}/restore`).
2. **NEVER put Lombok `@Data` on a JPA `@Entity`**: causes `StackOverflowError` and breaks Hibernate proxies. Use `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder @EqualsAndHashCode(callSuper = true)`.
3. **Always annotate entities with `@EntitySecurity`** (`readRoles`, `writeRoles`, `deleteRoles`) and protect sensitive columns with `@FieldSecurity(viewRoles = ..., nullifyInsteadOfMask = true)` (or `maskPattern = "******"`).
   - Never use `@EntitySecurity(permitAll = true)` on PII, financial, or write-enabled entities.
   - Custom `@AutoGet` + `@ServiceOverride` methods whose name is not in `SecurityConstant.READ_OPERATIONS` default to `writeRoles` (fail-closed) unless authorized via `@SecurityPolicyEntity` or `SecurityIdentityCustomizer`.
4. **Database-Driven RBAC (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity`):**
   - Never duplicate single-valued markers (e.g., two `@RoleCode` fields on the same entity) — startup fail-fast validation rejects it.
   - Explicit `DENY` policies strictly override `ALLOW`.
5. **`@MultiTenant` Fail-Closed Isolation:**
   - Every request to a `@MultiTenant` entity requires the `X-Tenant-ID` header (unless caller holds a `bypassTenantRoles` role); missing header or cross-tenant IDOR returns HTTP `403 Forbidden`.
6. **Production Surface Lockdown (NEVER relax in `application.yml` / `application-prod.yml`):**
   - `app.framework.studio.enabled: false`
   - `app.framework.studio.demo-token-endpoint-enabled: false`
   - `app.framework.studio.show-i18n-diagnostics: false`
   - `app.framework.security.fail-fast-weak-jwt-secret: true`
   - `app.framework.security.jwt-secret: ${JWT_SECRET}` (minimum **32 UTF-8 bytes** / 256 bits; NEVER commit secrets in Git).
   - Only enable Studio & demo tokens inside `application-dev.yml`.

---

## 4. Extension Decision Matrix (Pick the Right Tool!)

| Requirement | Use This Mechanism | Do NOT Use |
| :--- | :--- | :--- |
| Standard CRUD / filter / keyset / export / GraphQL / AI | `interface XController extends AutoApiController<X>` | Hand-written Spring `@RestController` + `JpaRepository` |
| Public read-only API hiding internal fields | `interface XReadOnlyController extends AutoReadApi<X>` + `@AutoRestController(basePath = ..., readDto = XReadDto.class)` | Exposing full JPA entity directly |
| Add a new domain route (e.g., `/quick-summary`, `/reserve`) | `@CustomEndpoint(path, httpMethod, delegateBean, delegateMethod)` delegating to a `@Component` Helper or `@Lazy @Service` | Writing a separate controller class duplicating routing |
| Replace one auto-generated route OR use `@PathVariable`/`@RequestBody`/`@HttpCacheable` | `@ServiceOverride(targetBean = ..., methodName = ...)` on controller interface | Forking the framework |
| Full procedural control / team wants standard Spring MVC | `GET /system/studio/eject?target=<Entity>` (exports 5 standalone Java files) | Fighting the proxy |
| Customize Spring Security filters / claims / ABAC voting | Implement `SecurityIdentityCustomizer` (`@Component`) | Overwriting framework `SecurityFilterChain` blindly |
| Forward committed DB mutations to Kafka / RabbitMQ / SQS | Implement `OutboxEventDispatcherProvider` (`@Component`) | Publishing inside `@Transactional` before commit |
| Call external REST partner APIs with W3C `traceparent` | Inject `ObjectProvider<ThirdPartyRestClientHelper>` | Legacy `RestTemplate` |

---

## 5. Architecture, Clean Code & Testing Standards

1. **Java 21 + Virtual Threads:** Enable `spring.threads.virtual.enabled: true` and `spring.jpa.open-in-view: false`.
2. **UUIDv7 Everywhere:** Use `UuidUtil.generateUuidV7()`, never `UUID.randomUUID()`.
3. **Custom Business Exceptions Only:** Extend `BaseBusinessException` with explicit `StandardHttpStatus` and `errorCode`. Never throw raw `RuntimeException` / `IllegalArgumentException` in business logic.
4. **Transactions & Caching:**
   - `@Transactional(readOnly = true)` at `@Service` class level; `@Transactional(rollbackFor = Exception.class)` on every write method.
   - Cache high-read analytics (`@AutoCacheable` + `@AutoCacheEvict`) and storefront reads (`@HttpCacheable`), NEVER cache transactional stock/payment writes protected by `@DistributedLock` / `@Idempotent`.
5. **Root-Cause Debugging Mandate:**
   - When tests or startup fail, ALWAYS read down to the deepest `Caused by:` stack frame before editing code. Never silence exceptions or add `@Disabled` to bypass failing tests.
6. **Mandatory Verification Before Handover:**
   - Every new Helper, Service, DTO, Customizer, or Controller route MUST be verified with JUnit 5 + `MockMvc` (`@SpringBootTest`) covering Happy Path, Negative Path (`400`/`403`/`409`), and Guard Clauses.
   - Run `mvn clean verify` (and JMeter load tests where configured) until **0 failures, 0 errors, 0 skipped, 0.0% JMeter error rate**.
