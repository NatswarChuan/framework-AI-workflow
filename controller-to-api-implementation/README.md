# `controller-to-api-implementation` — Reference Application (`v0.0.2`)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![JitPack](https://img.shields.io/badge/Dependency-Spring--NWVMC%3Av0.0.2-blue.svg)](https://jitpack.io/#NatswarChuan/Spring-NWVMC)
[![JMeter](https://img.shields.io/badge/JMeter-2000%20Reqs%20%7C%200%25%20Error-emerald.svg)](src/test/jmeter/implementation_load_test.jmx)

Reference enterprise Spring Boot 3.3.5 application consuming **`com.github.NatswarChuan:Spring-NWVMC:v0.0.2`** from JitPack (`https://jitpack.io`). Demonstrates the strict two-directory architecture (`entity/` + `controller/`) across 24 business entities (e-commerce, healthcare, fintech, HR, supply chain, multi-tenancy) alongside custom `@CustomEndpoint` delegate helpers and Apache JMeter load verification.

---

## Project Layout & Dependencies

- **Framework Dependency** ([`pom.xml`](pom.xml)): `com.github.NatswarChuan:Spring-NWVMC:v0.0.2`, Java 21 LTS, Virtual Threads enabled, H2 in-memory persistence (`open-in-view: false`, HikariCP pool max `30`).
- **Controllers** (`src/main/java/com/example/implementation/controller/`): Marker interfaces extending `AutoApiController<E>` (`ProductCatalogController`, `CustomerOrderController`, `LoanApplicationController`, `BankAccountController`, `PatientRecordController`, `SubscriptionContractController`, etc.), plus `AdvancedEnterpriseBusinessController` showcasing `@CustomEndpoint` delegation.
- **Entities** (`src/main/java/com/example/implementation/entity/`): Domain models using `@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@HumanPolicy`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@EntityWebhook`, and `@MultiTenant`.
- **Configuration** ([`src/main/resources/application.yml`](src/main/resources/application.yml)): Enables `app.framework.studio.*` (`enabled`, `demo-token-endpoint-enabled`, `show-i18n-diagnostics`, `hide-framework-fingerprint`), local file storage (`target/uploads`), and YAML `@HumanPolicy` overrides under `spring-nwvmc.human-policies.SubscriptionContract`. Note that the framework root binding prefix is `app.framework.base-path-prefix` (defaults to `/api/v1`).

---

## Local Verification & JMeter Execution

```bash
# 1. Run all unit & integration tests + Apache JMeter load suite using JitPack v0.0.2
mvn clean verify -U -f controller-to-api-implementation/pom.xml

# 2. Launch interactive runtime server on port 8080
mvn spring-boot:run -f controller-to-api-implementation/pom.xml
```

### Runtime Verification Endpoints (When `app.framework.studio.enabled=true`)

| Interface | URL | Purpose |
| :--- | :--- | :--- |
| **Developer Live Studio** | `http://localhost:8080/system/studio` | Interactive API tester, 1-click JWT generator, 20-language selector (including RTL `ar`), `#studioI18nDiagBar` missing-key bar |
| **Swagger UI (OpenAPI 3.0)** | `http://localhost:8080/swagger-ui/index.html` | Interactive specification (`743` dynamic paths generated across consumer domains, `BearerAuth` security scheme) |
| **SPI Customizer Telemetry** | `http://localhost:8080/api/v1/system/customizers` | Live inspection of registered SPI customizer beans |
| **Database Health Telemetry** | `http://localhost:8080/api/v1/system/databases/health` | Multi-datasource health telemetry |
| **JMeter HTML Report** | `target/jmeter/reports` | Generated load-test latency & throughput report |

---

## Verified Acceptance Results (`v0.0.2` via JitPack)

| Check | Result |
| :--- | :--- |
| **Automated Integration & Helper Tests** | **140 / 140 PASS** (`0 Failures, 0 Errors, 0 Skipped`) |
| **Apache JMeter (`implementation_load_test.jmx`)** | **2,000 requests**, **0 failed (`0.0%` error rate)**, **151.0 req/s** throughput, Avg **91 ms** (Min **3 ms**, Max **2,107 ms**) |
| **Chrome DevTools Browser Check** | Verified `/system/studio` (20 languages, `ar` RTL, `NWVMC_LANG` cookie, `?lang=../../etc/passwd` fallback, `#studioI18nDiagBar`, JWT `200`, Create `201`) & `/swagger-ui/index.html` (`@Hidden` exclusion, `Execute` HTTP `200`), `0` JS errors |
