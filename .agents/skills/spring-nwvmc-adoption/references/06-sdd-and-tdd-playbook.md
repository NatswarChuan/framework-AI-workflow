# 06 — SDD (Spec-Driven Development) & TDD (Test-Driven Development) Playbook for Spring-NWVMC (`0.1.0`)

> **Purpose:** Turn every AI coding agent and developer into a disciplined, zero-defect **Spec-First + Test-First** engineer when building on **`io.github.natswarchuan:spring-nwvmc:0.1.0`**.
>
> **Core Principle:** **No production Java code is written before an unambiguous specification (`spec.md`), technical plan (`plan.md`), atomic task list (`tasks.md`), and failing test (`RED`) exist.**

---

## Part A — Spec-Driven Development (SDD) Lifecycle

Every new feature, domain entity, custom endpoint, security policy, or non-trivial change MUST progress through **6 gated stages**:

```text
1. SPECIFY (specs/domains/<context>/<entity>.md or specs/changes/<slug>/spec.md)
     │  Define business goals, Given/When/Then REQ-IDs, entity schema, API surface,
     │  security/RBAC/multi-tenant matrix, state machine, resilience, DB migrations & NFRs.
     ▼
2. CLARIFY (Zero-Assumption Ambiguity Gate)
     │  Mark every uncertain rule with [NEEDS CLARIFICATION: ...].
     │  STOP and confirm all open items with the stakeholder BEFORE planning or coding.
     ▼
3. PLAN (plan.md)
     │  Map to Spring-NWVMC 2-Directory Contract (entity/ + controller/),
     │  @Lazy non-final AOP Services, ObjectProvider<T> helpers, cache/DB/multi-pod decisions,
     │  and REQ-ID ↔ Endpoint ↔ Test Traceability Matrix.
     ▼
4. TASKS (tasks.md — ephemeral PR/agent checklist)
     │  Slice into ordered declarative-first tasks where EVERY slice follows:
     │  [RED] Failing Test → [GREEN] Minimal Code → [REFACTOR] → [VERIFY].
     ▼
5. IMPLEMENT (Strict TDD Loop — See Part B)
     │  Execute one slice at a time. Never skip RED or weaken assertions.
     ▼
6. CONTRACT-SYNC (Living Specification Gate)
        Verify live /v3/api-docs, /metadata, /schema/zod, /schema/client,
        and /api/v1/graphql/schema match spec.md (and golden OpenAPI/Zod snapshots).
```

### A.1 — Artifact Directory Standard & Multi-Team Scaling

- **Small / Greenfield Projects:** Use one folder per feature under `specs/<feature-slug>/{spec.md, plan.md}` (treat `tasks.md` as an ephemeral PR / agent scratchpad rather than a permanent merge-conflict-prone file).
- **Multi-Team / Long-Lived Products (Recommended at Scale):** Separate **canonical living domain specs** from **ephemeral change proposals** so multiple sprints modifying `ProductCatalog` never split truth:

```text
your-spring-boot-project/
├── specs/
│   ├── domains/<bounded-context>/<entity>.md   # Canonical living system-of-record spec
│   ├── changes/<ticket-slug>/                  # Ephemeral RFC / PR spec + plan (archived after merge)
│   │   ├── spec.md
│   │   └── plan.md
│   └── snapshots/<entity>.openapi.json         # Optional golden OpenAPI / Zod snapshots for CI diffing
├── src/main/java/.../entity/
├── src/main/java/.../controller/
└── src/test/java/.../
```

Copy starter templates directly from `../templates/`:
- [`templates/spec.template.md`](../templates/spec.template.md)
- [`templates/plan.template.md`](../templates/plan.template.md)
- [`templates/tasks.template.md`](../templates/tasks.template.md)

### A.2 — Hard SDD Rules (Non-Negotiable)

1. **Zero Silent Guessing (`[NEEDS CLARIFICATION]` Gate):** If role permissions, tenant claim verification, deletable states, uniqueness keys, rate limits, or public DTO fields are unspecified, insert `[NEEDS CLARIFICATION: <exact question>]` in `spec.md` and ask the user before proceeding to `plan.md`.
2. **Traceable Requirement IDs (`REQ-001`, `REQ-002`, …):** Every acceptance criterion in `spec.md` MUST have a unique `REQ-ID` written in testable **Given / When / Then** format and appear in BOTH `plan.md`'s Traceability Matrix and the JUnit 5 `@DisplayName("REQ-001: ...")` test annotation.
3. **2-Directory Contract First:** In `plan.md`, justify why a feature fits `@AutoRestController` + composable interface (`AutoReadApi<E>`..`AutoAiApi<E>`), `@CustomEndpoint` (note: bypasses proxy-level `@EntitySecurity`), `@ServiceOverride`, or SPI `*Customizer`. Never plan hand-written CRUD boilerplate for auto-managed entities.
4. **Living Specification (Zero Drift):** If an implementation discovery requires altering a URI, HTTP status code, DTO field, state transition, or security role, update `spec.md` in the same atomic commit.
5. **Machine-Verified Spec-vs-Runtime Parity:** Spring-NWVMC publishes live contracts at `GET /v3/api-docs`, `GET /api/v1/{entity}/metadata`, `GET /api/v1/{entity}/schema/{json,typescript,zod,client}`, and `GET /api/v1/graphql/schema`. Assert both positive fields/routes AND absence of sensitive internal fields (and diff against committed OpenAPI/Zod golden snapshots in CI for multi-team repos).

### A.3 — When Can SDD Artifacts Be Lightweight?

| Change Scope | Required SDD Level |
| :--- | :--- |
| **New domain module / entity / security model / workflow / multi-file feature** | **Full SDD:** `spec.md` + `plan.md` + ephemeral `tasks.md` |
| **Single custom endpoint / prototype / new annotation rule / bug fix** | **Lightweight Mini-Spec** (PR description or compact `REQ-ID` Given/When/Then) + **Mandatory TDD / Regression Test** |
| **Typo / comment / formatting only** | No spec needed; run `mvn test` to ensure zero regression |

---

## Part B — Test-Driven Development (TDD) Protocol for Spring-NWVMC (`0.1.0`)

### B.1 — The Strict Red → Green → Refactor Cycle

Execute this loop for **every** `REQ-ID` in `tasks.md`:

1. **RED (Write Failing Test First — Empirical Proof Required):**
   - Translate one `REQ-ID` (`Given / When / Then`) into a concrete JUnit 5 test tagged with `@DisplayName("REQ-001: ...")`.
   - Create only minimal compile-time stubs if needed so the test **compiles cleanly and fails for the expected behavioral reason** (e.g., expected `201` got `404`; expected `403` got `200`; expected `422` got `200`; expected masked `"******"` got raw PII; expected `409 Conflict` got `201`).
   - Run `mvn test -Dtest=<TestClass>#<testMethod>` and confirm the **RED failure output** matches the missing behavior.
2. **GREEN (Write Minimal Declarative Production Code):**
   - Implement the smallest clean Spring-NWVMC solution (`entity/` annotations, `controller/` interface, `@Lazy @Service`, or `Helper`) that makes the test pass.
   - Re-run `mvn test -Dtest=<TestClass>` and confirm **100% GREEN**.
3. **REFACTOR (Clean Code Under a Green Safety Net):**
   - Extract repeated literals into constants, refine SRP and guard clauses, enforce `@Transactional` boundaries, verify zero N+1 SQL (`open-in-view: false`), and re-run `mvn clean verify`.

### B.2 — Non-Negotiable TDD Guardrails (Anti-Cheating Laws)

1. **Never Weaken or Delete Failing Tests:** Do NOT comment out assertions, loosen HTTP status checks (`is2xxSuccessful()` instead of `isCreated()`, or `is4xxClientError()` instead of exact `isUnprocessableEntity()` `422` + `$.errorCode`), mock out the security filter chain to bypass `403`, or add `@Disabled`. Fix production code (or revise `spec.md` with explicit user sign-off).
2. **Bug-Fix Regression First:** Before fixing any bug, write a failing test reproducing the exact defect (RED), verify it fails, apply the fix (GREEN), and keep the regression test permanently.
3. **Verify Real Spring-NWVMC Runtime Semantics (Not Over-Mocked Tests):**
   - Unit tests mock downstream collaborators for pure Helper/Service logic.
   - **Never** mock Spring-NWVMC's proxy, `@EntitySecurity`, `@FieldSecurity`, `@MultiTenant`, `@StateMachine`, `@Idempotent`, `@RateLimit`, `@HttpCacheable`, or `@DistributedLock` — test them end-to-end with `@SpringBootTest` + `MockMvc` (or `RANDOM_PORT` + `RestClient` for concurrency!).
4. **Exact Token Helper Rule:** Always inject `ObjectProvider<JwtTokenService>` and call `jwtProvider.getObject().generateToken(username, userId, roles)` (**`username` FIRST, `userId` SECOND**).

---

## Part C — The 4-Tier Spring-NWVMC Test Pyramid

| Tier | Scope & Annotations | What MUST Be Verified | Target Speed |
| :--- | :--- | :--- | :---: |
| **Tier 1: Fast Unit Tests** | JUnit 5 + AssertJ (+ `@ExtendWith(MockitoExtension.class)` only when mocking collaborators) | Helper business logic, Service orchestration, Custom Exceptions (`BaseBusinessException` status & `errorCode`), DTO builders, null/blank guard clauses, boundary conditions | Milliseconds |
| **Tier 2: API Contract, Security & Workflow Integration** | `@SpringBootTest` + `@AutoConfigureMockMvc` (`@ActiveProfiles("test")`) | 2-Directory CRUD (`201`/`200`/`400`/`404`), `@AutoCode`/`@AutoSlug`/`@UniqueField`, dot-syntax filters & Keyset O(1), `@EntitySecurity` (`401`/`403`), `@FieldSecurity` masking/nullification, `readDto` stripping, `@MultiTenant` fail-closed `403` + IDOR + JWT `tenantId` claim check, DB-RBAC `DENY > ALLOW`, `@StateMachine` legal (`200`) + illegal (`422`) transitions + `deletableStates` (`422`), `@Idempotent` (`201`→`409` + missing-header check), `@RateLimit` (`429` + `Retry-After`), `@HttpCacheable` ETag (`200`→`304`), `@Version` stale write (`409`), `prod` Studio/eject/auth lockdown (`401`/`404`) | Seconds |
| **Tier 3: Spec-to-Runtime Contract Drift Tests** | `@SpringBootTest` + `@AutoConfigureMockMvc` | Assert `/v3/api-docs`, `/api/v1/{entity}/metadata`, `/schema/zod`, and `/api/v1/graphql/schema` expose ONLY spec-approved paths & fields AND explicitly assert sensitive internal columns (`costPrice`, `internalCostBudget`, `passwordHash`) are absent (pair with golden snapshot diffs in CI) | Seconds |
| **Tier 4: Concurrency & Load SLA** | `@SpringBootTest(webEnvironment = RANDOM_PORT)` + `RestClient` + `ExecutorService` (+ Testcontainers PostgreSQL in CI) & Apache JMeter (`mvn jmeter:configure jmeter:jmeter jmeter:results` / `mvn -Pjmeter verify`) | `@DistributedLock` race-condition prevention with **zero `500`s**, multi-pod Redis/JDBC SPI verification when scaling > 1 replica, HikariCP + Virtual Threads stability, **0.0% JMeter Error Rate**, p95 latency SLA | Release gate |

---

## Part D — Copy-Paste Verified TDD Recipes for Spring-NWVMC (`0.1.0`)

> **Prerequisite:** Create `src/test/resources/application-test.yml` (see `03-yaml-properties-and-profiles.md` §4) with H2 + `ddl-auto: create-drop` + test `jwt-secret` (`>= 32` bytes) so `@ActiveProfiles("test")` boots cleanly.

### Recipe 1 — Tier 1 Pure Unit Test (Helper + Custom Exception + Guard Clauses)

```java
class DiscountValidationHelperUnitTest {

  private final DiscountValidationHelper helper = new DiscountValidationHelper();

  @Test
  @DisplayName("REQ-002: Rejects discount percentage exceeding 80% with HTTP 400 BusinessException")
  void shouldRejectExcessiveDiscountPercentage() {
    assertThatThrownBy(() -> helper.validatePercentage(new BigDecimal("85.00")))
        .isInstanceOf(InvalidDiscountException.class)
        .satisfies(ex -> {
          InvalidDiscountException biz = (InvalidDiscountException) ex;
          assertThat(biz.getHttpStatus()).isEqualTo(StandardHttpStatus.BAD_REQUEST);
          assertThat(biz.getErrorCode()).isEqualTo("ERR_DISCOUNT_LIMIT_EXCEEDED");
        });
  }

  @Test
  @DisplayName("REQ-002: Rejects null discount percentage with HTTP 400 and explicit errorCode")
  void shouldRejectNullDiscountPercentage() {
    assertThatThrownBy(() -> helper.validatePercentage(null))
        .isInstanceOf(InvalidDiscountException.class)
        .satisfies(ex -> {
          InvalidDiscountException biz = (InvalidDiscountException) ex;
          assertThat(biz.getHttpStatus()).isEqualTo(StandardHttpStatus.BAD_REQUEST);
          assertThat(biz.getErrorCode()).isEqualTo("ERR_DISCOUNT_REQUIRED");
        });
  }
}
```

### Recipe 2 — Tier 2 Isolated Contract, Security, Masking, Idempotency & StateMachine Tests (`MockMvc`)

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VoucherContractAndSecurityTddTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;

  private String bearer(String username, String userId, String... roles) {
    // CRITICAL: username FIRST, userId SECOND!
    return "Bearer " + jwtTokenServiceProvider.getObject().generateToken(username, userId, Set.of(roles));
  }

  @Test
  @DisplayName("REQ-001: Creates voucher (201) and rejects duplicate X-Idempotency-Key replay (409)")
  void shouldCreateVoucherAndRejectIdempotentReplay() throws Exception {
    String adminJwt = bearer("admin", "01900000-0000-7000-8000-000000000001", "ROLE_ADMIN");
    String payload = """
        {"title":"Launch 20% Off","discountPercent":20.00,"internalCostBudget":50000.00,"issuerContactPhone":"+84901234567"}
        """;

    mockMvc.perform(post("/api/v1/discount-vouchers")
            .header("Authorization", adminJwt)
            .header("X-Idempotency-Key", "idem-req-001-001")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isCreated())
        .andExpect(header().exists("X-Request-ID"))
        .andExpect(jsonPath("$.data.voucherCode").value(startsWith("VCH-")));

    mockMvc.perform(post("/api/v1/discount-vouchers")
            .header("Authorization", adminJwt)
            .header("X-Idempotency-Key", "idem-req-001-001")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isConflict());
  }

  @Test
  @DisplayName("REQ-003 & REQ-005: Enforces readDto strip, @FieldSecurity mask, and @StateMachine exact 422 rejection")
  void shouldEnforceReadDtoFieldMaskingAndStateTransitions() throws Exception {
    String adminJwt = bearer("admin", "01900000-0000-7000-8000-000000000001", "ROLE_ADMIN");
    String userJwt = bearer("buyer", "01900000-0000-7000-8000-000000000002", "ROLE_USER");

    String createJson = mockMvc.perform(post("/api/v1/discount-vouchers")
            .header("Authorization", adminJwt)
            .header("X-Idempotency-Key", "idem-req-003-002")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {"title":"Mask Test","discountPercent":15.00,"internalCostBudget":9000.00,"issuerContactPhone":"+84901234567"}
                """))
        .andExpect(status().isCreated())
        .andReturn().getResponse().getContentAsString();
    String id = JsonPath.read(createJson, "$.data.id");

    // 1. Public readDto strips internalCostBudget completely
    mockMvc.perform(get("/api/v1/public/discount-vouchers/" + id).header("Authorization", userJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.internalCostBudget").doesNotExist());

    // 2. @FieldSecurity masks issuerContactPhone for ROLE_USER
    mockMvc.perform(get("/api/v1/discount-vouchers/" + id).header("Authorization", userJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.issuerContactPhone").value("******"));

    // 3. @StateMachine legal transition (200 OK) vs illegal transition jump (exact 422 Unprocessable Entity!)
    mockMvc.perform(post("/api/v1/discount-vouchers/" + id + "/transition")
            .param("targetState", "ACTIVE")
            .header("Authorization", adminJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.status").value("ACTIVE"));

    mockMvc.perform(post("/api/v1/discount-vouchers/" + id + "/transition")
            .param("targetState", "DRAFT")
            .header("Authorization", adminJwt))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errorCode").isNotEmpty());
  }
}
```

### Recipe 3 — Tier 3 Spec-to-Runtime Contract Drift Test

```java
@Test
@DisplayName("REQ-006: Runtime OpenAPI, /metadata and /schema/zod match spec.md with zero secret field leaks")
void shouldKeepRuntimeSchemasSynchronizedWithSpec() throws Exception {
  String adminJwt = bearer("admin", "01900000-0000-7000-8000-000000000001", "ROLE_ADMIN");

  // 1. Public read-only controller exposes ONLY AutoReadApi routes (no POST/DELETE in OpenAPI)
  mockMvc.perform(get("/v3/api-docs"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers'].get").exists())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers'].post").doesNotExist())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers/{id}'].delete").doesNotExist())
      .andExpect(jsonPath("$.components.schemas.DiscountVoucherReadDto.properties.internalCostBudget").doesNotExist());

  // 2. /metadata exposes expected entity fields
  mockMvc.perform(get("/api/v1/discount-vouchers/metadata").header("Authorization", adminJwt))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.data.entityName").value("DiscountVoucher"));

  // 3. Zod schema emits runtime contract cleanly
  mockMvc.perform(get("/api/v1/discount-vouchers/schema/zod").header("Authorization", adminJwt))
      .andExpect(status().isOk())
      .andExpect(content().string(containsString("voucherCode")));
}
```

### Recipe 4 — Tier 4 Real-HTTP Concurrency Race-Condition Test (`RANDOM_PORT` + `RestClient`)

> **Multi-Pod Production Note:** Passing this single-JVM test validates local lock behavior. For multi-pod Kubernetes deployments (`replicas > 1`), you MUST wire a Redis/JDBC `DistributedLockProvider` (default Caffeine lock is JVM-local), acquire `@DistributedLock` in an outer non-transactional facade wrapping `@Transactional`, and run concurrency tests against real PostgreSQL via Testcontainers in CI.

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class InventoryReservationConcurrencyTddTest {

  @LocalServerPort private int port;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;

  @Test
  @DisplayName("REQ-007: Concurrent stock reservations never oversell and emit zero 500 errors")
  void shouldPreventOversellingUnderConcurrentReservations() throws Exception {
    String adminJwt = "Bearer " + jwtTokenServiceProvider.getObject()
        .generateToken("admin", "01900000-0000-7000-8000-000000000001", Set.of("ROLE_ADMIN"));
    RestClient client = RestClient.builder().baseUrl("http://localhost:" + port).build();

    // Seed initial stock = 3 for SKU-RACE-01 before firing parallel requests...
    int threads = 8;
    ExecutorService pool = Executors.newFixedThreadPool(threads);
    CountDownLatch ready = new CountDownLatch(threads);
    CountDownLatch start = new CountDownLatch(1);
    AtomicInteger succeeded = new AtomicInteger();
    AtomicInteger conflicted = new AtomicInteger();
    AtomicInteger serverErrors = new AtomicInteger();

    try {
      List<Future<?>> futures = new ArrayList<>();
      for (int i = 0; i < threads; i++) {
        futures.add(pool.submit(() -> {
          ready.countDown();
          start.await();
          int status = client.post()
              .uri(u -> u.path("/api/v1/inventory-stocks/reserve")
                  .queryParam("sku", "SKU-RACE-01").queryParam("qty", 1).build())
              .header("Authorization", adminJwt)
              .exchange((req, res) -> res.getStatusCode().value());
          if (status == 200) succeeded.incrementAndGet();
          else if (status == 409) conflicted.incrementAndGet();
          else if (status >= 500) serverErrors.incrementAndGet();
          return null;
        }));
      }
      ready.await(5, TimeUnit.SECONDS);
      start.countDown();
      for (Future<?> f : futures) f.get(15, TimeUnit.SECONDS);
    } finally {
      pool.shutdownNow();
    }

    assertThat(serverErrors.get()).isZero();
    assertThat(succeeded.get()).isEqualTo(3);
    assertThat(conflicted.get()).isEqualTo(5);
    assertThat(succeeded.get() + conflicted.get()).isEqualTo(threads);
  }
}
```

---

## Part E — End-to-End SDD + TDD Execution Summary for AI Agents

When a user requests any new feature or change:
1. Check whether `spec.md` exists (`specs/<feature>/spec.md` or `specs/domains/<context>/<entity>.md`). If not, draft it using `templates/spec.template.md`.
2. Surface any `[NEEDS CLARIFICATION]` questions and **wait for confirmation** before writing Java code.
3. Produce `plan.md` (with 1:1 `REQ-ID` Traceability Matrix) and an ephemeral `tasks.md` (ordered declarative-first `[RED] → [GREEN] → [REFACTOR]` slices).
4. For each task slice: write the failing test first (`RED`), run `mvn test -Dtest=...` to confirm it fails for the right reason, write minimal declarative Spring-NWVMC code (`GREEN`), refactor cleanly, and run `mvn clean verify`.
5. Run Tier 3 Contract Drift tests, Tier 4 concurrency / JMeter (`mvn jmeter:configure jmeter:jmeter jmeter:results` or `mvn -Pjmeter verify`), and complete `CHECKLIST.md` Phases 0–6 before reporting completion.
