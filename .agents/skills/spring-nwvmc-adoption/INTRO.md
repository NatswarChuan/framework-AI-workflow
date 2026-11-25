# Spring-NWVMC (`0.1.0` / `v0.1.0`) — AI-Agent & Developer Introduction

> **Purpose:** Fast, accurate architectural orientation so any developer or AI coding agent (**Claude**, **Gemini / Antigravity**, **ChatGPT / Codex**, **Cursor**, **GitHub Copilot**, **Windsurf**, **Cline / Roo**, **DeepSeek**, **Qwen**, **Grok**, **Llama**, **Mistral**, **Aider**) understands **what Spring-NWVMC is**, **how it works at runtime**, and **how to adopt it cleanly** in a Java 21 + Spring Boot 3.x project.

---

## 1. What Is Spring-NWVMC?

**Spring-NWVMC** (*Next-Wave Virtual Multi-Controller*) is a **Single-Module Zero-Boilerplate Starter** for **Java 21 LTS** and **Spring Boot 3.2.5 / 3.3.5 / 3.4.0** built for Java 21 Virtual Threads.

Instead of writing repetitive `Repository` + `Service` + `ServiceImpl` + `Mapper` + `Controller` boilerplate for every CRUD table, you follow the **Two-Directory Domain Contract**:

1. **`entity/`**: Declare a standard JPA `@Entity` extending `BaseAuditEntity` (UUIDv7 primary key, `@Version` optimistic lock, audit timestamps, soft-delete flag) and attach declarative annotations (`@EntitySecurity`, `@FieldSecurity`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@StateMachine`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`, `@EntityWebhook`, `@PublishCloudEvent`).
2. **`controller/`**: Declare a 1-line Java `interface` annotated with `@AutoRestController` extending `AutoApiController<E>` (full 40-endpoint suite) or any subset of `9` composable capability interfaces (`AutoReadApi<E>`..`AutoAiApi<E>`).

At startup, `ControllerToApiAutoConfiguration` synthesizes a **JDK Dynamic Proxy** backed by cached `MethodHandle` / `LambdaMetafactory` dispatch (`ControllerProxyInvocationHandler`) and registers the endpoints directly into Spring MVC `RequestMappingHandlerMapping`, OpenAPI 3.0 Swagger UI, and the Dynamic GraphQL Engine — with **zero code generation** and **zero lock-in** (override any method via `@ServiceOverride`, add custom routes via `@CustomEndpoint`, or eject any entity to 5 plain Spring MVC Java files via `GET /system/studio/eject?target=<Entity>`).

---

## 2. Verified Artifact Coordinates (`0.1.0` — Official Maven Central)

- **Minimum Runtime:** Java **21 LTS** (`UnsupportedJavaVersionException` fail-fast below JDK 21) + Spring Boot **3.2.5 – 3.4.x**.
- **Official Documentation Portal (GitHub Pages):** [https://natswarchuan.github.io/Spring-NWVMC-document/](https://natswarchuan.github.io/Spring-NWVMC-document/)
- **Important:** Maven compiler MUST retain parameter names (`<parameters>true</parameters>`) so SpEL keys in `@DistributedLock` / `@AutoCacheable` and `@RequestParam` / `@PathVariable` resolve reliably.

### Option A — Maven Central (Recommended — zero custom `<repositories>` needed!)
```xml
<dependency>
  <groupId>io.github.natswarchuan</groupId>
  <artifactId>spring-nwvmc</artifactId>
  <version>0.1.0</version>
</dependency>
```

### Option B — Gradle (Kotlin DSL — Maven Central)
```kotlin
repositories {
  mavenCentral()
}
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
```

### Option C — JitPack Mirror (Optional)
```xml
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependency>
  <groupId>com.github.NatswarChuan</groupId>
  <artifactId>Spring-NWVMC</artifactId>
  <version>v0.1.0</version>
</dependency>
```

---

## 3. Core Architecture & 9 Composable Capability Interfaces

You never have to expose all 40 endpoints on sensitive or public-facing entities. Compose only what each surface requires:

| Interface | Endpoints Exposed | Typical Use Case |
| :--- | :---: | :--- |
| `AutoReadApi<E>` | 5 | Public storefront / read-only catalog (`GET /`, `/all`, `/count`, `/exists`, `/{id}`) — pairs cleanly with `@AutoRestController(readDto = ProductReadDto.class)` |
| `AutoKeysetApi<E>` | 1 | High-scale O(1) cursor pagination (`GET /keyset?afterId=&dir=desc&size=20`) |
| `AutoAnalyticsApi<E>` | 4 | Aggregations (`GET /aggregate`, `/distinct`, `/top`, `/group-by`) |
| `AutoSchemaApi<E>` | 5 | Runtime contracts (`GET /metadata`, `/schema/json`, `/schema/typescript`, `/schema/zod`, `/schema/client`) |
| `AutoApiReadController<E>` | 15 | Composite of the 4 read interfaces above |
| `AutoWriteApi<E>` | 7 | Single-record mutations (`POST /`, `POST /upsert`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `DELETE /{id}/hard`, `POST /{id}/restore`) |
| `AutoBatchApi<E>` | 3 | Bulk operations (`POST /batch`, `POST /batch/chunked`, `DELETE /batch`) |
| `AutoExportImportApi<E>` | 4 | Data transfer (`GET /export/csv`, `GET /export/jsonl`, `POST /import/csv`, `POST /import/jsonl`) |
| `AutoWorkflowApi<E>` | 9 | Lifecycle & realtime (`POST /{id}/transition?targetState=`, `/{id}/clone`, `PATCH /{id}/increment`, `PATCH /{id}/patch`, `GET /{id}/diff`, `/policy-summary`, `/health`, `/events` `@Hidden`, `/{id}/**`) |
| `AutoAiApi<E>` | 2 | Spring AI context & natural-language query (`GET /ai/context` alias `/ai-context`, `POST /ai/query` alias `/ai-query`) |
| `AutoApiEnterpriseController<E>` | 11 | Composite of `AutoWorkflowApi<E>` + `AutoAiApi<E>` |
| **`AutoApiController<E>`** | **40** | Master contract combining all interfaces above (**38** visible in Swagger UI; `/events` and `/stream` marked `@Hidden`) |

---

## 4. The 6 Real Java Annotation Packages (60 Annotations Total)

Every declarative annotation in Spring-NWVMC belongs to one of these **exact 6 packages** (see [references/01-annotations-exact-matrix.md](./references/01-annotations-exact-matrix.md) for all 60 annotations and all 133 attributes):

1. `io.github.natswarchuan.core.annotation` — **54 annotations** (Routing, Pure-Java Bean stereotypes, Entity lifecycle/rules, Security & DB-RBAC markers, Resilience & Caching).
2. `io.github.natswarchuan.module.cache.http.annotation` — `@HttpCacheable`.
3. `io.github.natswarchuan.module.datasource.annotation` — `@TargetDataSource`, `@TargetDatabasePlatform`.
4. `io.github.natswarchuan.module.event.annotation` — `@PublishCloudEvent`.
5. `io.github.natswarchuan.module.lock.annotation` — `@DistributedLock`.
6. `io.github.natswarchuan.module.webhook.annotation` — `@EntityWebhook`.

---

## 5. Built-In Platform Subsystems (Zero Extra Controllers Needed)

Once Spring-NWVMC is on the classpath, these enterprise endpoints activate automatically:

| Subsystem | Live Routes | Notes |
| :--- | :--- | :--- |
| **Dynamic GraphQL** | `GET /api/v1/graphql/schema`, `POST /api/v1/graphql`, `GET /api/v1/graphql/explorer` (`@Hidden`) | Auto-generated from JPA entities; supports `$variables`, `__schema`/`__type`, and full `@EntitySecurity` + `@MultiTenant` + `@FieldSecurity` parity |
| **File Storage (LOCAL / S3 / GCS)** | `POST /api/v1/storage/upload` (`201 Created`), `GET /download/{id}`, `GET /metadata/{id}`, `GET /exists/{id}`, `POST /presigned-url`, `DELETE /{id}` | Configured under `app.framework.storage.*` |
| **Audit Time-Travel** | `GET /api/v1/system/time-travel/{entityName}/{id}?timestamp=...` | Reconstructs historical state for `@AuditTrail` entities |
| **System Telemetry** | `GET /api/v1/system/databases/health`, `/api/v1/system/trace-context`, `/api/v1/system/customizers`, `/api/v1/system/circuit-breakers` | W3C `traceparent` + UUIDv7 `X-Request-ID` + Micrometer (`11` metrics) |
| **Dev Studio & Code Ejection** | `GET /system/studio`, `GET /system/studio/eject?target=<Entity>`, `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` | **Locked off (`false`) by default** — enable only in `application-dev.yml` (`POST /api/v1/auth/token` returns `200 OK` with `data.token`) |
| **Frontend Codegen** | `GET /api/v1/{entity}/schema/typescript`, `/schema/zod`, `/schema/client`, `/schema/json` | Emits zero-drift TypeScript interfaces, Zod schemas, and typed Fetch clients |

---

## 6. SDD + TDD Engineering Workflow & Clean-Room Verification

Every Spring-NWVMC feature built with this kit follows **Spec-Driven Development (SDD)** + **Test-Driven Development (TDD)**:
- **SDD (`specs/<feature>/{spec.md, plan.md, tasks.md}`):** Define `Given / When / Then` `REQ-ID`s, entity schemas, API surfaces, security/RBAC matrices, and NFRs BEFORE coding, resolving every `[NEEDS CLARIFICATION]` item upfront and verifying zero drift against Spring-NWVMC's live `/v3/api-docs`, `/metadata`, `/schema/zod`, and GraphQL SDL.
- **TDD (`Red → Green → Refactor` across 4 Test Tiers):** Write failing JUnit 5 / `MockMvc` tests tied to `REQ-ID`s first, implement minimal declarative Spring-NWVMC code until green, refactor cleanly, and finish with `mvn clean verify` (`0` failures, `0` `@Disabled`) and Apache JMeter `0.0%` error rate.
- **Empirical Proof:** Verified against `controller-to-api-framework/` (`586/586` unit tests) and the clean-room **NovaMart Multi-Merchant E-Commerce** reference (`controller-to-api-implementation/`, `23/23` integration & unit tests across 10 modules including 4-entity Dynamic DB-RBAC `DENY > ALLOW` + `1,003`-request JMeter `0.0%` error rate).

---

## 7. Next Files to Read

1. **[RULES.md](./RULES.md)** — Mandatory SDD/TDD rules and empirically verified runtime guardrails (read BEFORE writing code).
2. **[SKILL.md](./SKILL.md)** — Step-by-step SDD+TDD workflows, adoption steps, and root-cause troubleshooting matrix.
3. **[CHECKLIST.md](./CHECKLIST.md)** — 7-phase SDD, pre-flight, implementation, security, TDD, and go-live sign-off gates.
4. **[references/](./references/)** — Exact 60-annotation matrix (`01`), 40-endpoint & query DSL (`02`), YAML properties (`03`), copy-paste cookbook (`04`), non-annotation class/SPI imports (`05`), and the **SDD + TDD Playbook (`06`)**.
5. **[templates/](./templates/)** — Ready-to-copy SDD starter templates (`spec.template.md`, `plan.template.md`, `tasks.template.md`).
