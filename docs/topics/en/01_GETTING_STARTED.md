# 01. Getting Started, Two-Directory Contract & Fail-Fast Diagnostics

> **Language**: English | [Tiếng Việt](../01_GETTING_STARTED.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Strict Two-Directory Domain Architecture (`entity/` & `controller/`)

Applications powered by **Spring-NWVMC `v0.0.2`** maintain two primary domain directories:

1. `entity/`: JPA domain entities extending `BaseAuditEntity`, carrying Bean Validation constraints (`jakarta.validation.constraints.*`), database indexes, and declarative annotations (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`).
2. `controller/`: Marker interfaces annotated with `@AutoRestController` extending `AutoApiController<E>`.

Domain workflows outside generic CRUD decompose into dedicated `Service` interfaces backed by `@AutoService` / `@AutoComponent` `public final class` `Helper` beans (zero `private` methods, zero `static` helper methods) invoked via `@CustomEndpoint`.

---

## 2. Maven & JitPack Setup (`pom.xml`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.0.2</version>
  </dependency>
</dependencies>
```

---

## 3. Baseline Configuration (`application.yml`)

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    base-path-prefix: /api/v1
    default-page-size: 20
    max-page-size: 100
    eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET:Enterprise-Strong-HS512-Key-Must-Be-At-Least-32-Bytes-Long!}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # Enable only in local/dev environments
      demo-token-endpoint-enabled: false # Enable only when demo token issuance is needed
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. Granular Endpoint Filtering (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` matches entries case-insensitively against declared interface method names on `AutoApiController<E>` or functional feature groups (`READ`, `WRITE`, `DELETE`, `BATCH`, `ANALYTICS`, `EXPORT`, `AI`, `STREAM`, `SCHEMA`, `SUB_RESOURCE`).

```java
@AutoRestController(
    path = "/api/v1/commercial-products",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface CommercialProductController extends AutoApiController<CommercialProduct> {
}
```

---

## 5. Fail-Fast Startup Diagnostics (`StartupDiagnosticsUtil` & `JavaVersionGuardUtil`)

| Exception | Guard / Trigger Condition | Corrective Action |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` detects JVM `< 21` | Run application on Java 21 LTS or newer |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` with custom key `< 32` UTF-8 bytes | Configure `${JWT_SECRET}` with at least 32 UTF-8 characters |
| `InvalidConfigurationException` | `defaultPageSize <= 0` or `defaultPageSize > maxPageSize` (`@Max(200)`) | Configure `default-page-size <= max-page-size` within `1..200` |
| `InvalidConfigurationException` | `jwtExpirationSeconds <= 0` or `heartbeatSeconds <= 0` | Supply positive integer durations |
| `InvalidConfigurationException` (`error.configuration.entity`) | `DeveloperFriendlyDiagnosticsHelper` detects missing `@Id` or missing no-arg constructor | Extend `BaseAuditEntity` or add `@Id` and `@NoArgsConstructor` |
