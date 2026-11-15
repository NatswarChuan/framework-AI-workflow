# `controller-to-api-implementation` — Reference Application (`1.0.0`)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Framework](https://img.shields.io/badge/Dependency-spring--nwvmc%3A1.0.0-blue.svg)](pom.xml)
[![License](https://img.shields.io/badge/License-Apache--2.0-lightgrey.svg)](../LICENSE)

Reference Spring Boot `3.3.5` application consuming **`io.github.natswarchuan:spring-nwvmc:1.0.0`**. Demonstrates the strict two-directory architecture (`entity/` + `controller/`) across 24 business entities (e-commerce, healthcare, fintech, HR, supply chain, multi-tenancy), custom `@CustomEndpoint` delegation, `@ServiceOverride` escape hatches (`TagController`), `@HumanPolicy` YAML rules (`SubscriptionContract`), and Apache JMeter verification.

---

## Project Layout & Configuration

- **Framework Dependency** ([`pom.xml`](pom.xml)): `io.github.natswarchuan:spring-nwvmc:1.0.0`, Java 21 LTS, Virtual Threads enabled, H2 in-memory persistence (`open-in-view: false`, HikariCP pool max `30`).
- **Controllers** (`src/main/java/com/example/implementation/controller/`): Interfaces extending `AutoApiController<E>` (`ProductCatalogController`, `CustomerOrderController`, `LoanApplicationController`, `BankAccountController`, `PatientRecordController`, `SubscriptionContractController`, `TagController` with `@ServiceOverride`, and `AdvancedEnterpriseBusinessController` with `@CustomEndpoint`).
- **Entities** (`src/main/java/com/example/implementation/entity/`): Domain models using `@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@HumanPolicy`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@EntityWebhook`, `@TargetDatabasePlatform`, and `@MultiTenant`.
- **Configuration** ([`application.yml`](src/main/resources/application.yml) & [`application-dev.yml`](src/main/resources/application-dev.yml)):
  - Production defaults keep `app.framework.studio.enabled: false` and `demo-token-endpoint-enabled: false` (locked via `SurfaceAccessGuardrailUtil`).
  - Active `dev` profile unlocks `/system/studio`, `/system/studio/eject`, and `POST /api/v1/auth/token`.
  - Query guardrails configure `max-join-depth: 3`, `max-filter-criteria: 25`, and `max-page-size: 100`.

---

## Verification & Runtime Commands

```bash
# 1. Run integration tests + Apache JMeter load suite (expects local 1.0.0 in ~/.m2)
mvn clean verify -f controller-to-api-implementation/pom.xml

# 2. Launch application with dev profile on port 8080
mvn spring-boot:run "-Dspring-boot.run.profiles=dev" -f controller-to-api-implementation/pom.xml
```

### Runtime Verification Endpoints (`dev` profile)

| Surface | URL | Purpose |
| :--- | :--- | :--- |
| **Developer Live Studio** | `http://localhost:8080/system/studio` | 20-language live API inspector, JWT generator, `#studioI18nDiagBar`, Zod/TS/JSON/Client exporters |
| **Code Ejection Endpoint** | `http://localhost:8080/system/studio/eject?target=ProductCatalog` | Exports standalone Spring MVC Controller/Service/Repository scaffold |
| **Swagger UI (OpenAPI 3.0)** | `http://localhost:8080/swagger-ui/index.html` | Interactive specification (`BearerAuth` scheme, excludes `@Hidden` routes) |
| **SPI Customizer Telemetry** | `http://localhost:8080/api/v1/system/customizers` | Lists active SPI customizer beans |
| **Database Health Telemetry** | `http://localhost:8080/api/v1/system/databases/health` | Multi-datasource health status |
| **JMeter HTML Report** | `target/jmeter/reports` | Generated Apache JMeter latency and error-rate dashboard |
