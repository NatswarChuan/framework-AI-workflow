# Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:0.1.0` — Maven Central)

[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5%20%7C%203.3.5%20%7C%203.4.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Maven Central](https://img.shields.io/badge/Maven%20Central-io.github.natswarchuan%3Aspring--nwvmc%3A0.1.0-blue.svg)](https://central.sonatype.com/artifact/io.github.natswarchuan/spring-nwvmc)
[![Official Docs](https://img.shields.io/badge/Official%20Docs-GitHub%20Pages-teal.svg)](https://natswarchuan.github.io/Spring-NWVMC-document/)
[![JitPack](https://img.shields.io/badge/JitPack-com.github.NatswarChuan%3ASpring--NWVMC%3Av0.1.0-brightgreen.svg)](https://jitpack.io/#NatswarChuan/Spring-NWVMC/v0.1.0)
[![License](https://img.shields.io/badge/License-Apache--2.0-lightgrey.svg)](LICENSE)

Enterprise dynamic REST, GraphQL, persistence, security, and observability starter for **Java 21** and **Spring Boot 3.x**. Declare a JPA `Entity` extending `BaseAuditEntity` and an interface extending `AutoApiController<E>` annotated with `@AutoRestController` to expose **40** standardized REST/streaming/schema contracts (**38** visible by default in OpenAPI 3.0 Swagger UI) with optional `@ServiceOverride` delegation and MVC code ejection.

---

## Repository Modules

| Module | Path | Role & Contents |
| :--- | :--- | :--- |
| **Framework Library** | [`controller-to-api-framework/`](controller-to-api-framework/) | `io.github.natswarchuan:spring-nwvmc:0.1.0` (public JitPack: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`; `593` main `.java` files, `256` test files, `584` unit tests, `60` annotations, `9` composable capability interfaces `AutoReadApi`..`AutoAiApi`, `@RateLimit` `IP`/`USER`/`TENANT`/`GLOBAL` + RFC 6585 `Retry-After`, `@EntityCircuitBreaker` 4xx client-error immunity, DB-RBAC duplicate-marker fail-fast validation, `@HttpCacheable` ETag header forwarding + `ApiResponse` auto-wrap, split method/class `@TargetDataSource` AOP pointcuts, `DistributedLockProvider`/`IdempotencyStoreProvider` SPIs, `@Version` optimistic locking, `?fields=`/`?expand=`, `@MultiTenant` fail-closed `403`, `max-unpaged-fetch-limit`, GraalVM AOT `RuntimeHints`, CycloneDX `1.6` SBOM, `21` i18n bundles) |
| **Reference Application** | [`controller-to-api-implementation/`](controller-to-api-implementation/) | Consumer showcase on Spring Boot `3.3.5` consuming `com.github.NatswarChuan:Spring-NWVMC:v0.1.0` via JitPack (`142` main `.java` files, `58` test files, `173` unit & integration tests) implementing the entire 16-step continuous B2C2B2C Marketplace walkthrough (`ProductCatalog`, `ProductCatalogReadOnlyController` with `ProductReadDto` + `@HttpCacheable` + `@RateLimit`, `ECommerceOrder` `@StateMachine` + `@CustomEndpoint`, `InventoryStock` `@DistributedLock`, `PaymentTransaction` `@Idempotent`, `ElectronicInvoice` `@EntityWebhook` + `@PublishCloudEvent`, `MarketplaceAnalyticsServiceImpl` `@TargetDataSource(REPLICA)` + `@AutoCacheable`/`@AutoCacheEvict`, `CatalogAssistantHelper`, `MarketplacePartnerGatewayHelper`, `MarketplaceOutboxEventDispatcherProvider`, GraphQL, File Storage, Zod/TS Codegen) and Apache JMeter load testing (`2,000` reqs, `0.0%` err) |
| **Developer React UI** | [`controller-to-api-ui/`](controller-to-api-ui/) | React 18 + Vite TypeScript marketplace dashboard and Playwright E2E suite verifying live REST calls, abnormal error paths, and `X-Idempotency-Key` CORS forwarding |
| **Documentation Portal** | [`docs/`](docs/) | Interactive React 19 + Vite Hub-and-Spoke documentation portal (`34` topic-focused pages across `8` clean sections including dedicated [`#ai-agent-kit`](docs/index.html#ai-agent-kit), `16`-step continuous copy-paste-runnable walkthrough `StoryBanner`, deep attribute specification cards for all `133` annotation attributes, `20` languages with RTL support for `ar`, `fa`, `ur`) + synchronized **20-language Markdown topic guides** ([`docs/topics/README.md`](docs/topics/README.md), `20` languages × `7` topics = `140` guides) |
| **AI-Agent Adoption Kit** | [`ai-agent-kit/`](ai-agent-kit/) & [`llms.txt`](llms.txt) | Universal model-agnostic **INTRO + RULES + SKILL + CHECKLIST + 5 Machine-Verified References** (`60` annotations / `133` attributes / `40` endpoints / exact YAML & Multi-Datasource / cookbook incl. `@MultiTenant` + DB-RBAC / zero-`javap` non-annotation class & SPI imports) + **8 drop-in adapters** (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Cursor `.mdc`, GitHub Copilot, Windsurf, Cline/Roo Code, Generic LLM System Prompt) + 1-command installers (`install.ps1` / `install.sh`) + active workspace skill (`.agents/skills/spring-nwvmc-adoption/`) — clean-room proven by greenfield **NovaMart Multi-Merchant E-Commerce** (`58` main / `14` test files, `23/23` tests + JMeter `1,003` reqs `0.0%` err) |

---

## Architectural Guarantees (`0.1.0`)

1. **Zero Compile-Time Spring Pollution in Domain Interfaces**: Consumer `entity/` (`BaseAuditEntity` with `@Version` optimistic locking and UUIDv7) and `controller/` interfaces (`AutoApiController<E>` or composable `AutoReadApi<E>`..`AutoAiApi<E>` with `@AutoRestController(readDto, createDto, updateDto)` and standard Spring `@RequestBody`/`@RequestParam`/`@PathVariable`) bind to `60` Pure Java declarative annotations without generated code or Lombok `@Data` on entities.
2. **`MethodHandle` Hot-Path Dispatch & GraalVM AOT**: `MethodHandleCacheUtil` and `LambdaAccessorUtil` eliminate reflective `Method.invoke` bottlenecks, backed by `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`) for GraalVM Native Image builds and non-destructive `SecurityFilterChain` coexistence via `PureJavaSecurityFilterBridge`.
3. **Escape Hatch & Code Ejection (`@ServiceOverride` / `/system/studio/eject`)**: Override any generated CRUD method via `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` (`EscapeHatchDispatchHelper`), or export 5 standalone Spring MVC source files (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) via `GET /system/studio/eject?target=<EntityOrControllerName>`.
4. **Query Guardrails, Tenant Isolation & Startup Fail-Fast**: `QueryGuardrailProperties` (`app.framework.query-guardrails`) enforces `max-join-depth=3`, `max-filter-criteria=25`, `max-page-size=200`, `max-unpaged-fetch-limit=5000`, `eager-fetch-singular-relations=true`, and field/sort allowlists; `@MultiTenant` enforces fail-closed `403`, anti-spoofing, and IDOR checks; `QueryFilterParameterUtil` blocks SQLi/XSS payloads; `StartupDiagnosticsUtil` validates guardrails and JWT secret entropy (`>= 32` bytes) at boot.
5. **Secure-by-Default Surface Policy**: `DevStudioProperties` (`app.framework.studio`) defaults to `enabled=false` and `demo-token-endpoint-enabled=false` (returning HTTP `401` / `404` on `/system/studio` and `/system/studio/eject` via `SecurityExposurePolicyBridge` + `StartupDiagnosticsUtil`, and HTTP `404` on `/api/v1/auth/token` when locked).
6. **Observability & Contract Codegen**: `DynamicEntityMetricsHelper` publishes `11` Micrometer metrics (`dynamic.entity.*`, `nwvmc.proxy.*`, `nwvmc.cache.*`, `nwvmc.outbox.*`, `nwvmc.resilience.*`, `nwvmc.ratelimit.*`, `framework.outbox.dispatched.total`, `framework.realtime.active.connections`, `framework.datasource.routing.total`), `TraceIdFilter` propagates RFC 9562 UUIDv7 `X-Request-ID` and W3C `traceparent`, and `ZodAndClientGeneratorUtil` serves runtime Zod schemas (`GET /schema/zod`) and typed Fetch clients (`GET /schema/client`).

---

## Quick Start

### 1. Verify Reference Implementation (JitPack) & Contributor Framework Build

```bash
# 1. Run consumer integration tests & Apache JMeter load suite directly via JitPack
#    (resolves com.github.NatswarChuan:Spring-NWVMC:v0.1.0 from https://jitpack.io — no local ~/.m2 install needed)
mvn clean verify -f controller-to-api-implementation/pom.xml

# 2. (Contributors) Build, test, and install io.github.natswarchuan:spring-nwvmc:0.1.0 locally
mvn clean install -f controller-to-api-framework/pom.xml

# 3. Verify CycloneDX 1.6 SBOM generation (target/bom.json)
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom -Dcyclonedx.skipNotDeployed=false -Dmaven.deploy.skip=false -f controller-to-api-framework/pom.xml
```

### 2. Minimal Consumer Code (`entity/` + `controller/`)

```java
// 1. src/main/java/com/example/implementation/entity/ProductCatalog.java
@Entity
@Table(name = "tbl_product_catalogs")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @UniqueField
  @NotBlank
  private String skuCode;

  @NotBlank
  private String productName;

  @UniqueField
  @AutoSlug(sourceField = "productName")
  private String slug;

  @NotBlank
  private String category;

  @NotNull
  @DecimalMin("0.00")
  private BigDecimal retailPrice;

  @FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}, nullifyInsteadOfMask = true)
  private BigDecimal costPrice;
}

// 2. src/main/java/com/example/implementation/controller/ProductCatalogController.java
@AutoRestController
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

### 3. Run Interactive Surfaces

```bash
# Start backend with dev profile (enables /system/studio and /api/v1/auth/token)
mvn spring-boot:run "-Dspring-boot.run.profiles=dev" -f controller-to-api-implementation/pom.xml

# Start React Developer UI & run Playwright E2E
npm.cmd --prefix controller-to-api-ui install
npm.cmd --prefix controller-to-api-ui run test:e2e

# Preview 20-language Interactive Documentation Portal
npm.cmd --prefix docs install
npm.cmd --prefix docs run dev
```

| Surface | URL | Purpose |
| :--- | :--- | :--- |
| **Developer Live Studio** | `http://localhost:8080/system/studio` | 20-language live API inspector, JWT generator, Zod/TypeScript/Client exporters (`dev` profile) |
| **Code Ejection Endpoint** | `GET /system/studio/eject?target=ProductCatalog` | Exports 5 standalone Spring MVC Java files (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) |
| **Swagger UI (OpenAPI 3.0)** | `http://localhost:8080/swagger-ui/index.html` | Interactive specification (`BearerAuth`, auto-filtered `@Hidden` internal paths) |
| **Customizer Telemetry** | `http://localhost:8080/api/v1/system/customizers` | Lists active beans across the `7` core telemetry `*Customizer` groups (`StorageCustomizer` is registered separately via `StorageCustomizerRegistryHelper`, `8` SPIs total) |
| **Circuit Breaker Telemetry** | `http://localhost:8080/api/v1/system/circuit-breakers` | Live Resilience4j circuit breaker state and failure counters |
| **Database Health Telemetry** | `http://localhost:8080/api/v1/system/databases/health` | Multi-datasource health telemetry |
| **W3C Trace Context** | `http://localhost:8080/api/v1/system/trace-context` | Inspects active SLF4J MDC UUIDv7 `X-Request-ID` & W3C `traceparent` |

---

## Documentation Matrix

| Document | Scope |
| :--- | :--- |
| [English Reference Manual](docs/GUIDE_EN.md) | Complete specification in English |
| [Tiếng Việt Manual](docs/GUIDE_VI.md) | Complete specification in Vietnamese |
| [日本語マニュアル](docs/GUIDE_JA.md) | Complete specification in Japanese |
| [中文参考手册](docs/GUIDE_ZH.md) | Complete specification in Chinese |
| [Interactive Portal (`docs/`)](docs/index.html) | Searchable React 19 + Vite documentation portal across 20 languages |
| [AI-Agent Adoption Kit (`ai-agent-kit/`)](ai-agent-kit/README.md) | Universal SKILL / RULES / INTRO / CHECKLIST + adapters for every AI agent & LLM (`install.ps1` / `install.sh`) |
| [LLM Discovery Index (`llms.txt`)](llms.txt) | `llmstxt.org` structured entry point for AI agents and web crawlers |
| [Security Policy](SECURITY.md) | Production lockdown checklist and coordinated vulnerability disclosure |
| [Changelog](CHANGELOG.md) | Release history from `0.0.2` through `0.1.0` |
| [Contributing Guide](CONTRIBUTING.md) | Coding rules, SonarQube thresholds, and verification requirements |
