# Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:1.0.0`)

[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5%20%7C%203.3.5%20%7C%203.4.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Artifact](https://img.shields.io/badge/Maven-io.github.natswarchuan%3Aspring--nwvmc%3A1.0.0-blue.svg)](controller-to-api-framework/pom.xml)
[![License](https://img.shields.io/badge/License-Apache--2.0-lightgrey.svg)](LICENSE)

Enterprise dynamic REST, GraphQL, persistence, security, and observability starter for **Java 21** and **Spring Boot 3.x**. Declare a JPA `Entity` extending `BaseAuditEntity` and an interface extending `AutoApiController<E>` annotated with `@AutoRestController` to expose **40** standardized REST/streaming/schema contracts (**38** visible by default in OpenAPI 3.0 Swagger UI) with optional `@ServiceOverride` delegation and MVC code ejection.

---

## Repository Modules

| Module | Path | Role & Contents |
| :--- | :--- | :--- |
| **Framework Library** | [`controller-to-api-framework/`](controller-to-api-framework/) | `io.github.natswarchuan:spring-nwvmc:1.0.0` (`528` main `.java` files, `42` annotations, `20` `@ConfigurationProperties` models, GraalVM AOT `RuntimeHints`, CycloneDX SBOM, `21` i18n bundles) |
| **Reference Application** | [`controller-to-api-implementation/`](controller-to-api-implementation/) | Consumer showcase on Spring Boot `3.3.5` demonstrating the 2-directory contract (`entity/` + `controller/`), `@CustomEndpoint`, `@ServiceOverride`, and Apache JMeter load testing |
| **Developer React UI** | [`controller-to-api-ui/`](controller-to-api-ui/) | React 18 + Vite TypeScript marketplace dashboard and Playwright E2E suite verifying live REST calls, abnormal error paths, and `X-Idempotency-Key` CORS forwarding |
| **Documentation Portal** | [`docs/`](docs/) | Interactive React 19 + Vite documentation portal + Markdown guides across `20` languages (with RTL support for `ar`, `fa`, `ur`) |

---

## Architectural Guarantees (`1.0.0`)

1. **Zero Compile-Time Spring Pollution in Domain Interfaces**: Consumer `entity/` and `controller/` interfaces bind to `42` Pure Java declarative annotations without generated code or Lombok `@Data` on entities.
2. **`MethodHandle` Hot-Path Dispatch & GraalVM AOT**: `MethodHandleCacheUtil` and `LambdaAccessorUtil` eliminate reflective `Method.invoke` bottlenecks, backed by `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`) for GraalVM Native Image builds.
3. **Escape Hatch & Code Ejection (`@ServiceOverride` / `/system/studio/eject`)**: Override any generated CRUD method via `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` (`EscapeHatchDispatchHelper`), or export standard Spring MVC Controller / Service / ServiceImpl / Repository source files via `GET /system/studio/eject?target=<EntityOrControllerName>`.
4. **Query Guardrails & Startup Fail-Fast**: `QueryGuardrailProperties` (`app.framework.query-guardrails`) enforces `max-join-depth=3`, `max-filter-criteria=25`, `max-page-size=200`, and field/sort allowlists; `QueryFilterParameterUtil` blocks SQLi/XSS payloads; `EntityFailFastValidatorUtil` and `StartupDiagnosticsUtil` validate entity metadata and JWT secret entropy (`>= 32` bytes) at boot.
5. **Secure-by-Default Surface Policy**: `DevStudioProperties` (`app.framework.studio`) defaults to `enabled=false`, `demo-token-endpoint-enabled=false`, and `hide-framework-fingerprint=true` (returning HTTP `401` on `/system/studio` and `/system/studio/eject` and HTTP `404` on `/api/v1/auth/token` when locked).
6. **Observability & Contract Codegen**: `DynamicEntityMetricsHelper` publishes Micrometer metrics (`dynamic.entity.*`, `nwvmc.proxy.*`, `nwvmc.cache.*`, `nwvmc.outbox.*`, `nwvmc.resilience.*`, `nwvmc.ratelimit.*`), `TraceIdFilter` propagates RFC 9562 UUIDv7 `X-Request-ID` and W3C `traceparent`, and `ZodAndClientGeneratorUtil` serves runtime Zod schemas (`GET /schema/zod`) and typed Fetch clients (`GET /schema/client`).

---

## Quick Start

### 1. Install Framework & Verify Reference Implementation

```bash
# 1. Build and install io.github.natswarchuan:spring-nwvmc:1.0.0 into local Maven repo (~/.m2)
mvn clean install -f controller-to-api-framework/pom.xml

# 2. Verify CycloneDX SBOM generation (target/bom.json)
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom -Dcyclonedx.skipNotDeployed=false -Dmaven.deploy.skip=false -f controller-to-api-framework/pom.xml

# 3. Run consumer integration tests and Apache JMeter 2,000-request load suite
mvn clean verify -f controller-to-api-implementation/pom.xml
```

### 2. Minimal Consumer Code (`entity/` + `controller/`)

```java
// 1. src/main/java/com/example/app/entity/CommercialProduct.java
@Entity
@Table(name = "tbl_commercial_product")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommercialProduct extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @NotBlank
  private String name;

  @Positive
  private BigDecimal price;
}

// 2. src/main/java/com/example/app/controller/CommercialProductController.java
@AutoRestController(path = "/api/v1/commercial-products")
public interface CommercialProductController extends AutoApiController<CommercialProduct> {
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
| **Code Ejection Endpoint** | `GET /system/studio/eject?target=ProductCatalog` | Exports standalone Spring MVC Controller/Service/Repository scaffold |
| **Swagger UI (OpenAPI 3.0)** | `http://localhost:8080/swagger-ui/index.html` | Interactive specification (`BearerAuth`, auto-filtered `@Hidden` internal paths) |
| **Customizer Telemetry** | `http://localhost:8080/api/v1/system/customizers` | Lists active beans implementing the 8 SPI `*Customizer` interfaces |
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
| [Security Policy](SECURITY.md) | Production lockdown checklist and coordinated vulnerability disclosure |
| [Changelog](CHANGELOG.md) | Release history from `0.0.2` through `1.0.0` |
| [Contributing Guide](CONTRIBUTING.md) | Coding rules, SonarQube thresholds, and verification requirements |
