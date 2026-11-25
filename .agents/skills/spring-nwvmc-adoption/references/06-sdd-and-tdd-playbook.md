# 06 — SDD (Spec-Driven Development) & TDD (Test-Driven Development) Playbook for Spring-NWVMC (`0.1.0`)

> **Purpose:** Turn every AI coding agent and developer into a disciplined, zero-defect **Spec-First + Test-First** engineer when building on **`io.github.natswarchuan:spring-nwvmc:0.1.0`**.
>
> **Core Principle:** **No production Java code is written before an unambiguous specification (`spec.md`), technical plan (`plan.md`), atomic task list (`tasks.md`), and failing test (`RED`) exist.**

---

## Part A — Spec-Driven Development (SDD) Lifecycle

Every new feature, domain entity, custom endpoint, security policy, or non-trivial change MUST progress through **6 gated stages**:

```text
1. SPECIFY (specs/<feature>/spec.md)
     │  Define business goals, Given/When/Then REQ-IDs, entity schema, API surface,
     │  security/RBAC/multi-tenant matrix, state machine, resilience & NFRs.
     ▼
2. CLARIFY (Zero-Assumption Ambiguity Gate)
     │  Mark every uncertain rule with [NEEDS CLARIFICATION: ...].
     │  STOP and confirm all open items with the stakeholder BEFORE planning or coding.
     ▼
3. PLAN (specs/<feature>/plan.md)
     │  Map to Spring-NWVMC 2-Directory Contract (entity/ + controller/),
     │  @Lazy non-final AOP Services, ObjectProvider<T> helpers, cache/DB decisions,
     │  and REQ-ID ↔ Endpoint ↔ Test Traceability Matrix.
     ▼
4. TASKS (specs/<feature>/tasks.md)
     │  Slice into ordered vertical tasks where EVERY slice follows:
     │  [RED] Failing Test → [GREEN] Minimal Code → [REFACTOR] → [VERIFY].
     ▼
5. IMPLEMENT (Strict TDD Loop — See Part B)
     │  Execute one slice at a time. Never skip RED or weaken assertions.
     ▼
6. CONTRACT-SYNC (Living Specification Gate)
        Verify live /v3/api-docs, /metadata, /schema/zod, /schema/client,
        and /api/v1/graphql/schema match spec.md with zero drift.
```

### A.1 — Artifact Directory Standard in Consumer Projects

Create one folder per feature or bounded context under `specs/`:

```text
your-spring-boot-project/
├── specs/
│   └── <feature-slug>/               # e.g., order-checkout, discount-voucher, merchant-rbac
│       ├── spec.md                   # Source of truth: requirements, contracts, security, NFRs
│       ├── plan.md                   # Technical architecture & REQ-ID traceability matrix
│       └── tasks.md                  # Ordered Red → Green → Refactor executable checklist
├── src/main/java/.../entity/
├── src/main/java/.../controller/
└── src/test/java/.../
```

Copy starter templates directly from `../templates/`:
- [`templates/spec.template.md`](../templates/spec.template.md)
- [`templates/plan.template.md`](../templates/plan.template.md)
- [`templates/tasks.template.md`](../templates/tasks.template.md)

### A.2 — Hard SDD Rules (Non-Negotiable)

1. **Zero Silent Guessing (`[NEEDS CLARIFICATION]` Gate):** If role permissions, tenant scope, deletable states, uniqueness keys, rate limits, or public DTO fields are unspecified, insert `[NEEDS CLARIFICATION: <exact question>]` in `spec.md` and ask the user before proceeding to `plan.md`.
2. **Traceable Requirement IDs (`REQ-001`, `REQ-002`, …):** Every acceptance criterion in `spec.md` MUST have a unique `REQ-ID` written in testable **Given / When / Then** format and appear in BOTH `plan.md`'s Traceability Matrix and the JUnit 5 `@DisplayName("REQ-001: ...")` test annotation.
3. **2-Directory Contract First:** In `plan.md`, justify why a feature fits `@AutoRestController` + composable interface (`AutoReadApi<E>`..`AutoAiApi<E>`), `@CustomEndpoint`, `@ServiceOverride`, or SPI `*Customizer`. Never plan hand-written CRUD boilerplate for auto-managed entities.
4. **Living Specification (Zero Drift):** If an implementation discovery requires altering a URI, HTTP status code, DTO field, state transition, or security role, update `spec.md` **first** (or in the same atomic commit). Stale specs fail review.
5. **Machine-Verified Spec-vs-Runtime Parity:** Spring-NWVMC automatically publishes live contracts at:
   - `GET /v3/api-docs` (OpenAPI 3.0)
   - `GET /api/v1/{entity}/metadata` (fields, Jakarta constraints, RBAC descriptors)
   - `GET /api/v1/{entity}/schema/json`, `/schema/zod`, `/schema/client` (JSON Schema, Zod, typed Fetch SDK)
   - `GET /api/v1/graphql/schema` (GraphQL SDL)
   Every feature MUST verify that runtime schemas match `spec.md` (zero leaked internal columns, exact route paths, exact HTTP verbs).

### A.3 — When Can SDD Artifacts Be Lightweight?

| Change Scope | Required SDD Level |
| :--- | :--- |
| **New domain module / entity / security model / workflow / multi-file feature** | **Full SDD:** `specs/<slug>/spec.md` + `plan.md` + `tasks.md` |
| **Single custom endpoint / new annotation rule / bug fix** | **Mini-Spec** (can live in PR description or short `specs/<slug>/spec.md` with `REQ-ID` + Given/When/Then) + **Mandatory TDD Regression Test** |
| **Typo / comment / formatting only** | No spec needed; run `mvn test` to ensure zero regression |

---

## Part B — Test-Driven Development (TDD) Protocol for Spring-NWVMC (`0.1.0`)

### B.1 — The Strict Red → Green → Refactor Cycle

Execute this loop for **every** `REQ-ID` in `tasks.md`:

1. **RED (Write Failing Test First — Empirical Proof Required):**
   - Translate one `REQ-ID` (`Given / When / Then`) into a concrete JUnit 5 test tagged with `@DisplayName("REQ-001: ...")`.
   - Create only minimal compile-time stubs if needed (e.g., empty entity/DTO/exception class) so the test **compiles cleanly and fails for the expected behavioral reason** (e.g., expected `201` got `404`; expected `403` got `200`; expected masked `"******"` got raw phone number; expected `409 Conflict` got `200`).
   - Run `mvn test -Dtest=<TestClass>#<testMethod>` and confirm the **RED failure output** matches the missing behavior.
2. **GREEN (Write Minimal Declarative Production Code):**
   - Implement the smallest clean Spring-NWVMC solution (`entity/` annotations, `controller/` interface, `@Lazy @Service`, or `Helper`) that makes the test pass.
   - Re-run `mvn test -Dtest=<TestClass>` and confirm **100% GREEN**.
3. **REFACTOR (Clean Code Under a Green Safety Net):**
   - Remove magic strings/numbers into `*Constant` classes, extract helpers to keep methods concise (`<= 40` lines, cognitive complexity `<= 8`), enforce `@Transactional` boundaries, verify no N+1 queries (`open-in-view: false`), and re-run `mvn clean verify`.

### B.2 — Non-Negotiable TDD Guardrails (Anti-Cheating Laws)

1. **Never Weaken or Delete Failing Tests:** Do NOT comment out assertions, loosen HTTP status checks (`is2xxSuccessful()` instead of `isCreated()`), mock out the security filter chain to bypass `403`, or add `@Disabled` to make a build green. Fix the production code (or revise `spec.md` with explicit user sign-off).
2. **Bug-Fix Regression First:** Before fixing any bug, write a failing test reproducing the exact defect (RED), verify it fails, apply the fix (GREEN), and keep the regression test permanently.
3. **Verify Real Spring-NWVMC Runtime Semantics (Not Over-Mocked Tests):**
   - Unit tests mock downstream dependencies for pure Helper/Service logic.
   - **Never** mock Spring-NWVMC's proxy, `@EntitySecurity`, `@FieldSecurity`, `@MultiTenant`, `@StateMachine`, `@Idempotent`, `@RateLimit`, `@HttpCacheable`, or `@DistributedLock` — test them end-to-end with `@SpringBootTest` + `MockMvc`!
4. **Exact Token Helper Rule:** Always mint test JWTs via `jwtTokenService.generateToken(username, userId, roles)` (**`username` FIRST, `userId` SECOND** — see `RULES.md` §2.8).

---

## Part C — The 4-Tier Spring-NWVMC Test Pyramid

| Tier | Scope & Annotations | What MUST Be Verified | Target Speed |
| :--- | :--- | :--- | :---: |
| **Tier 1: Fast Unit Tests** | `@ExtendWith(MockitoExtension.class)` (JUnit 5 + Mockito + AssertJ) | Helper business logic, Service orchestration, Custom Exceptions (`BaseBusinessException` status & errorCode), DTO `fromXXX`/`toXXX` builders, null/blank guard clauses, boundary conditions | Milliseconds |
| **Tier 2: API Contract, Security & Workflow Integration** | `@SpringBootTest` + `@AutoConfigureMockMvc` | 2-Directory CRUD (`201`/`200`/`400`/`404`), `@AutoCode`/`@AutoSlug`/`@UniqueField`, dot-syntax filters & Keyset O(1), `@EntitySecurity` (`401`/`403`), `@FieldSecurity` masking/nullification, `readDto` stripping, `@MultiTenant` fail-closed `403` + IDOR, DB-RBAC `DENY > ALLOW`, `@StateMachine` legal (`200`) + illegal (`4xx`) transitions + `deletableStates`, `@Idempotent` (`201`→`409`), `@RateLimit` (`429` + `Retry-After`), `@HttpCacheable` ETag (`200`→`304`), `@Version` stale write (`409`), `prod` Studio lockdown (`401`/`404`) | Seconds |
| **Tier 3: Spec-to-Runtime Contract Drift Tests** | `@SpringBootTest` + `@AutoConfigureMockMvc` | Assert `/v3/api-docs`, `/api/v1/{entity}/metadata`, `/schema/zod`, and `/api/v1/graphql/schema` expose ONLY spec-approved paths & fields (zero leaked internal columns like `costPrice`, `passwordHash`, `secretKey`) | Seconds |
| **Tier 4: Concurrency & Load SLA** | Multi-threaded `ExecutorService` + `CountDownLatch` & Apache JMeter (`mvn jmeter:jmeter jmeter:results`) | `@DistributedLock` race-condition prevention (zero overselling under parallel threads), HikariCP + Virtual Threads stability, **0.0% JMeter Error Rate**, latency SLA compliance | Release gate |

---

## Part D — Copy-Paste Verified TDD Recipes for Spring-NWVMC (`0.1.0`)

### Recipe 1 — Tier 1 Pure Unit Test (Helper + Custom Exception + Guard Clauses)

```java
@ExtendWith(MockitoExtension.class)
class DiscountValidationHelperUnitTest {

  private final DiscountValidationHelper helper = new DiscountValidationHelper();

  @Test
  @DisplayName("REQ-001: Rejects discount percentage exceeding 80% with HTTP 400 BusinessException")
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
  @DisplayName("REQ-002: Rejects null discount percentage via Objects.isNull guard clause")
  void shouldRejectNullDiscountPercentage() {
    assertThatThrownBy(() -> helper.validatePercentage(null))
        .isInstanceOf(InvalidDiscountException.class);
  }
}
```

### Recipe 2 — Tier 2 Contract, Security, Masking, StateMachine & Idempotency Test (`MockMvc`)

```java
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VoucherContractAndSecurityTddTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private JwtTokenService jwtTokenService;

  private String bearer(String username, String userId, String... roles) {
    // CRITICAL: username FIRST, userId SECOND!
    return "Bearer " + jwtTokenService.generateToken(username, userId, Set.of(roles));
  }

  @Test
  @DisplayName("REQ-003: Public readDto hides internalCostBudget and masks issuerSecret for ROLE_USER")
  void shouldStripInternalFieldsOnReadDtoAndMaskSensitiveFields() throws Exception {
    String adminJwt = bearer("admin", "01900000-0000-7000-8000-000000000001", "ROLE_ADMIN");
    String userJwt = bearer("buyer", "01900000-0000-7000-8000-000000000002", "ROLE_USER");

    String payload = """
        {
          "title": "Launch 20% Off",
          "discountPercent": 20.00,
          "internalCostBudget": 50000.00,
          "issuerContactPhone": "+84901234567"
        }
        """;

    String createJson = mockMvc.perform(post("/api/v1/discount-vouchers")
            .header("Authorization", adminJwt)
            .header("X-Idempotency-Key", "idem-req-003-001")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isCreated())
        .andExpect(header().exists("X-Request-ID"))
        .andExpect(jsonPath("$.data.voucherCode").value(startsWith("VCH-")))
        .andReturn().getResponse().getContentAsString();

    String id = JsonPath.read(createJson, "$.data.id");

    // 1. Replay same X-Idempotency-Key -> 409 Conflict
    mockMvc.perform(post("/api/v1/discount-vouchers")
            .header("Authorization", adminJwt)
            .header("X-Idempotency-Key", "idem-req-003-001")
            .contentType(MediaType.APPLICATION_JSON)
            .content(payload))
        .andExpect(status().isConflict());

    // 2. Public readDto endpoint strips internalCostBudget completely
    mockMvc.perform(get("/api/v1/public/discount-vouchers/" + id)
            .header("Authorization", userJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.title").value("Launch 20% Off"))
        .andExpect(jsonPath("$.data.internalCostBudget").doesNotExist());

    // 3. @FieldSecurity masks issuerContactPhone for ROLE_USER
    mockMvc.perform(get("/api/v1/discount-vouchers/" + id)
            .header("Authorization", userJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.issuerContactPhone").value("******"));

    // 4. @StateMachine legal transition (colon syntax, query param ?targetState=)
    mockMvc.perform(post("/api/v1/discount-vouchers/" + id + "/transition")
            .param("targetState", "ACTIVE")
            .header("Authorization", adminJwt))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.status").value("ACTIVE"));

    // 5. @StateMachine illegal transition jump -> 4xx rejected
    mockMvc.perform(post("/api/v1/discount-vouchers/" + id + "/transition")
            .param("targetState", "DRAFT")
            .header("Authorization", adminJwt))
        .andExpect(status().is4xxClientError());
  }
}
```

### Recipe 3 — Tier 3 Spec-to-Runtime Contract Drift Test

```java
@Test
@DisplayName("REQ-010: Runtime OpenAPI, /metadata and /schema/zod match spec.md with zero secret leaks")
void shouldKeepRuntimeSchemasSynchronizedWithSpec() throws Exception {
  String adminJwt = bearer("admin", "01900000-0000-7000-8000-000000000001", "ROLE_ADMIN");

  // Public read-only controller exposes ONLY AutoReadApi routes (no POST/DELETE in OpenAPI)
  mockMvc.perform(get("/v3/api-docs"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers'].get").exists())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers'].post").doesNotExist())
      .andExpect(jsonPath("$.paths['/api/v1/public/discount-vouchers/{id}'].delete").doesNotExist());

  // Zod schema endpoint emits runtime contract
  mockMvc.perform(get("/api/v1/discount-vouchers/schema/zod")
          .header("Authorization", adminJwt))
      .andExpect(status().isOk())
      .andExpect(content().string(containsString("voucherCode")));
}
```

### Recipe 4 — Tier 4 Concurrency Race-Condition Test (`@DistributedLock`)

```java
@Test
@DisplayName("REQ-012: Concurrent stock reservations never oversell under @DistributedLock")
void shouldPreventOversellingUnderConcurrentReservations() throws Exception {
  int threads = 8;
  ExecutorService pool = Executors.newFixedThreadPool(threads);
  CountDownLatch ready = new CountDownLatch(threads);
  CountDownLatch start = new CountDownLatch(1);
  AtomicInteger succeeded = new AtomicInteger();
  AtomicInteger conflicted = new AtomicInteger();

  List<Future<?>> futures = new ArrayList<>();
  for (int i = 0; i < threads; i++) {
    futures.add(pool.submit(() -> {
      ready.countDown();
      start.await();
      int status = mockMvc.perform(post("/api/v1/inventory-stocks/reserve")
              .header("Authorization", adminJwt)
              .contentType(MediaType.APPLICATION_JSON)
              .content("{\"skuCode\":\"SKU-RACE-01\",\"quantity\":1}"))
          .andReturn().getResponse().getStatus();
      if (status == 200) succeeded.incrementAndGet();
      if (status == 409) conflicted.incrementAndGet();
      return null;
    }));
  }
  ready.await(5, TimeUnit.SECONDS);
  start.countDown();
  for (Future<?> f : futures) f.get(10, TimeUnit.SECONDS);
  pool.shutdownNow();

  // Given initial stock = 3, exactly 3 succeed and 5 receive 409 Conflict!
  assertThat(succeeded.get()).isEqualTo(3);
  assertThat(conflicted.get()).isEqualTo(5);
}
```

---

## Part E — End-to-End SDD + TDD Execution Summary for AI Agents

When a user requests any new feature or change:
1. Check whether `specs/<feature>/spec.md` exists. If not, draft it using `templates/spec.template.md`.
2. Surface any `[NEEDS CLARIFICATION]` questions and **wait for confirmation** before writing Java code.
3. Produce `specs/<feature>/plan.md` (with `REQ-ID` Traceability Matrix) and `specs/<feature>/tasks.md` (ordered `[RED] → [GREEN] → [REFACTOR]` slices).
4. For each task slice: write the failing test first (`RED`), run `mvn test -Dtest=...` to confirm it fails for the right reason, write minimal declarative Spring-NWVMC code (`GREEN`), refactor cleanly, and run `mvn clean verify`.
5. Run Tier 3 Contract Drift tests and complete `CHECKLIST.md` Phases 0–6 before reporting completion.
