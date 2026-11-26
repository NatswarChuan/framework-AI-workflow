# Spring-NWVMC (`io.github.natswarchuan:spring-nwvmc:0.1.0` — Maven Central)

[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5%20%7C%203.3.5%20%7C%203.4.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Maven Central](https://img.shields.io/badge/Maven%20Central-io.github.natswarchuan%3Aspring--nwvmc%3A0.1.0-blue.svg)](https://central.sonatype.com/artifact/io.github.natswarchuan/spring-nwvmc)
[![Official Docs](https://img.shields.io/badge/Official%20Docs-GitHub%20Pages-teal.svg)](https://natswarchuan.github.io/Spring-NWVMC-document/)
[![JitPack](https://img.shields.io/badge/JitPack-com.github.NatswarChuan%3ASpring--NWVMC%3Av0.1.0-brightgreen.svg)](https://jitpack.io/#NatswarChuan/Spring-NWVMC/v0.1.0)
[![License](https://img.shields.io/badge/License-Apache--2.0-lightgrey.svg)](LICENSE)

**Spring-NWVMC** (*Next-Wave Virtual Multi-Controller*) is an enterprise dynamic REST, GraphQL, persistence, security, and observability starter for **Java 21 LTS** and **Spring Boot 3.x**. Declare a JPA `@Entity` extending `BaseAuditEntity` in `entity/` and a 1-line `interface` extending `AutoApiController<E>` annotated with `@AutoRestController` in `controller/` to expose **40** standardized REST, keyset, analytics, streaming, schema, and AI contracts (**38** visible by default in OpenAPI 3.0 Swagger UI) with optional `@ServiceOverride` delegation and standalone Spring MVC code ejection.

> **Repository Naming Note:** This monorepo (`Controller-To-API` / `framework-AI-workflow`) hosts the Maven Central library `io.github.natswarchuan:spring-nwvmc:0.1.0` (source mirror: [NatswarChuan/Spring-NWVMC](https://github.com/NatswarChuan/Spring-NWVMC)), the NovaMart reference app, the 20-language docs portal (published at [NatswarChuan/Spring-NWVMC-document](https://github.com/NatswarChuan/Spring-NWVMC-document)), and the universal SDD+TDD AI-Agent Adoption Kit.

---

## 60-Second Quick Start

### 1. Add Maven Central Dependency & `-parameters` Compiler Flag (`pom.xml`)

> **Version Note:** Maven Central uses **`0.1.0`** (no `v` prefix); the optional JitPack mirror uses **`v0.1.0`** (with `v` prefix). `<parameters>true</parameters>` is **mandatory** for SpEL keys and Spring MVC parameter binding.

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>0.1.0</version>
  </dependency>
</dependencies>

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <parameters>true</parameters>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### 2. Minimal 2-Directory Consumer Code (`entity/` + `controller/`)

```java
// 1. src/main/java/com/novamart/ecommerce/entity/StorefrontProduct.java
package com.novamart.ecommerce.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_storefront_products")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN})
@Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class StorefrontProduct extends BaseAuditEntity {

  @UniqueField @NotBlank private String skuCode;
  @NotBlank private String productName;
  @UniqueField @AutoSlug(sourceField = "productName") private String slug;
  @NotBlank private String category;
  @NotNull @DecimalMin("0.00") private BigDecimal retailPrice;

  @FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}, nullifyInsteadOfMask = true)
  private BigDecimal supplierCost;
}

// 2. src/main/java/com/novamart/ecommerce/controller/StorefrontProductController.java
package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.StorefrontProduct;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController
public interface StorefrontProductController extends AutoApiController<StorefrontProduct> {
}
```

### 3. Build, Verify & Run Live Reference App (NovaMart)

```bash
# 1. Run NovaMart reference integration & unit tests (resolves Maven Central 0.1.0 — 23/23 tests)
mvn clean verify -f controller-to-api-implementation/pom.xml

# 2. Start NovaMart in dev profile (enables /system/studio & POST /api/v1/auth/token)
mvn spring-boot:run "-Dspring-boot.run.profiles=dev" -f controller-to-api-implementation/pom.xml

# 3. (Optional) Run Apache JMeter smoke load test (1,003 reqs, 0.0% err) against the running dev server
mvn -Pjmeter jmeter:configure jmeter:jmeter jmeter:results -f controller-to-api-implementation/pom.xml

# 4. (Contributors) Build, test (586/586 unit tests), and install framework locally
mvn clean install -f controller-to-api-framework/pom.xml

# 5. Start React Developer UI / Preview 20-language Documentation Portal
npm --prefix controller-to-api-ui install && npm --prefix controller-to-api-ui run test:e2e
npm --prefix docs install && npm --prefix docs run dev
```

| Surface | URL | Purpose |
| :--- | :--- | :--- |
| **Developer Live Studio** | `http://localhost:8080/system/studio` | 20-language live API inspector, JWT generator, Zod/TypeScript/Client exporters (`dev` profile only) |
| **Dev Demo JWT** | `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` | Mints dev Bearer JWT (`200 OK`, `data.token` — `dev` profile only) |
| **Code Ejection Endpoint** | `GET /system/studio/eject?target=StorefrontProduct` | Exports 5 standalone Spring MVC Java files (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) |
| **Swagger UI (OpenAPI 3.0)** | `http://localhost:8080/swagger-ui/index.html` | Interactive specification (`BearerAuth`, auto-filtered `@Hidden` internal paths) |
| **Customizer Telemetry** | `http://localhost:8080/api/v1/system/customizers` | Lists registered beans across the `7` core telemetry `*Customizer` groups (`8` SPIs total with `StorageCustomizer`) |
| **Circuit Breaker Telemetry** | `http://localhost:8080/api/v1/system/resilience/circuit-breakers` | Live Resilience4j circuit breaker state and failure counters |
| **Database Health Telemetry** | `http://localhost:8080/api/v1/system/databases/health` | Multi-datasource health telemetry |
| **W3C Trace Context** | `http://localhost:8080/api/v1/system/trace-context` | Inspects active SLF4J MDC UUIDv7 `X-Request-ID` & W3C `traceparent` |

---

## Repository Modules

| Module | Path | Role & Verified Contents |
| :--- | :--- | :--- |
| **Framework Library** | [`controller-to-api-framework/`](controller-to-api-framework/) | `io.github.natswarchuan:spring-nwvmc:0.1.0` (optional JitPack mirror: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`; `593` main `.java` files, `257` test `.java` files, `586` passing unit tests, `60` annotations across `6` packages, `9` composable capability interfaces `AutoReadApi`..`AutoAiApi`, GraalVM AOT `RuntimeHints`, CycloneDX `1.6` SBOM, `21` i18n bundles) |
| **Reference Application (NovaMart)** | [`controller-to-api-implementation/`](controller-to-api-implementation/) | Clean-room **NovaMart Multi-Merchant E-Commerce** showcase on Spring Boot `3.3.5` consuming Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` (`58` main / `14` test `.java` files, `23/23` unit & integration tests across 10 domain modules: `StorefrontProduct`, `PublicCatalogController` + `PublicProductCardDto` + `@HttpCacheable` + `@RateLimit`, `MerchantListing` `@MultiTenant`, `WarehouseStock` `@DistributedLock`, `ShopOrder` `@StateMachine` + `@AuditTrail` + `@CustomEndpoint` + `@ServiceOverride`, `CheckoutPayment` `@Idempotent` + `@EntityWebhook` + `@PublishCloudEvent`, 4-entity Dynamic DB-RBAC `DENY > ALLOW`, Multi-Datasource `PRIMARY`/`REPLICA` + `@AutoCacheable`, Spring AI, GraphQL, File Storage, and `-Pjmeter` smoke load suite `1,003` reqs `0.0%` err) |
| **Developer React UI** | [`controller-to-api-ui/`](controller-to-api-ui/) | React 18 + Vite TypeScript dashboard and Playwright E2E suite verifying live REST calls, abnormal error paths, and `X-Idempotency-Key` CORS forwarding |
| **Documentation Portal** | [`docs/`](docs/) | Interactive React 19 + Vite Hub-and-Spoke portal ([live GitHub Pages](https://natswarchuan.github.io/Spring-NWVMC-document/), `34` pages across `8` sections including [`#ai-agent-kit`](https://natswarchuan.github.io/Spring-NWVMC-document/#ai-agent-kit), `133` annotation attributes, `20` languages with RTL `ar`/`fa`/`ur`) + synchronized **20-language Markdown topic guides** ([`docs/topics/README.md`](docs/topics/README.md), `140` guides) |
| **AI-Agent Adoption Kit** | [`ai-agent-kit/`](ai-agent-kit/) & [`llms.txt`](llms.txt) | Universal model-agnostic **SDD + TDD + INTRO + RULES + SKILL + CHECKLIST + 6 Machine-Verified References + 3 SDD Templates + 8 Drop-In Adapters** + hardened zero-clone installers (`install.ps1` / `install.sh`, `34` files on `--agent all`) + active synced skill (`.agents/skills/spring-nwvmc-adoption/`) |

---

## Architectural Guarantees (`0.1.0`)

1. **Zero Compile-Time Spring Pollution in Domain Interfaces**: Consumer `entity/` (`BaseAuditEntity` with `@Version` optimistic locking and UUIDv7) and `controller/` interfaces (`AutoApiController<E>` or composable `AutoReadApi<E>`..`AutoAiApi<E>` with `@AutoRestController(readDto, createDto, updateDto)`) bind to `60` Pure Java declarative annotations without generated code or Lombok `@Data` on entities.
2. **`MethodHandle` Hot-Path Dispatch & GraalVM AOT**: `MethodHandleCacheUtil` and `LambdaAccessorUtil` eliminate reflective `Method.invoke` bottlenecks, backed by `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`) and non-destructive `SecurityFilterChain` coexistence via `PureJavaSecurityFilterBridge`.
3. **Escape Hatch & Code Ejection (`@ServiceOverride` / `/system/studio/eject`)**: Override any generated CRUD method via `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`, or export 5 standalone Spring MVC source files via `GET /system/studio/eject?target=<EntityOrControllerName>`.
4. **Query Guardrails, Tenant Isolation & Startup Fail-Fast**: `QueryGuardrailProperties` enforces `max-join-depth=3`, `max-filter-criteria=25`, `max-page-size=200`, `max-unpaged-fetch-limit=5000`; `@MultiTenant` enforces fail-closed `403` and IDOR checks (pair with `SecurityIdentityCustomizer` JWT `tenantId` claim verification in prod); `StartupDiagnosticsUtil` validates guardrails and JWT secret entropy (`>= 32` bytes) at boot.
5. **Secure-by-Default Studio Surface Policy**: `DevStudioProperties` defaults to `enabled=false` and `demo-token-endpoint-enabled=false` — pair with `default-deny-unannotated-entities: true`, `require-authenticated-api-paths: true`, and disabled Springdoc in `application-prod.yml` (see [SECURITY.md](SECURITY.md)).
6. **Observability & Contract Codegen**: Publishes `11` Micrometer metrics, propagates RFC 9562 UUIDv7 `X-Request-ID` + W3C `traceparent`, and serves runtime Zod schemas (`GET /schema/zod`) and typed Fetch clients (`GET /schema/client`).

---

## Documentation Matrix

| Document | Scope |
| :--- | :--- |
| [Interactive Portal (GitHub Pages)](https://natswarchuan.github.io/Spring-NWVMC-document/) | Live searchable React 19 + Vite documentation portal across 20 languages (`#ai-agent-kit`, `#quickstart`, `#annotations`) |
| [20-Language Topic Guides (`docs/topics/`)](docs/topics/README.md) | 140 focused topic guides (`01`..`07`) across all 20 languages |
| [English Reference Manual](docs/GUIDE_EN.md) | Complete specification in English |
| [Tiếng Việt Manual](docs/GUIDE_VI.md) | Complete specification in Vietnamese |
| [日本語マニュアル](docs/GUIDE_JA.md) | Complete specification in Japanese |
| [中文参考手册](docs/GUIDE_ZH.md) | Complete specification in Chinese |
| [AI-Agent Adoption Kit (`ai-agent-kit/`)](ai-agent-kit/README.md) | Universal SDD + TDD + SKILL / RULES / INTRO / CHECKLIST + 8 adapters (`install.ps1` / `install.sh`) |
| [LLM Discovery Index (`llms.txt`)](llms.txt) | `llmstxt.org` structured entry point for AI agents and web crawlers |
| [Security Policy](SECURITY.md) | Production lockdown checklist (`0.1.x`) and coordinated vulnerability disclosure |
| [Changelog](CHANGELOG.md) | Release history from `0.0.2` through `0.1.0` |
| [Contributing Guide](CONTRIBUTING.md) | Coding rules, SonarQube thresholds, and verification requirements |
