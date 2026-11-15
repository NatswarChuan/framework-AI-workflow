# 01. Getting Started, Two-Directory Contract & Fail-Fast Diagnostics (`1.0.0`)

> **Language**: English | [Tiếng Việt](../01_GETTING_STARTED.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Strict Two-Directory Domain Contract (`entity/` & `controller/`)

Applications built with **`io.github.natswarchuan:spring-nwvmc:1.0.0`** structure domain domains into two directories:

1. `entity/`: JPA domain entities extending `BaseAuditEntity`, carrying Bean Validation constraints (`jakarta.validation.constraints.*`), B-Tree indexes, and declarative annotations (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Marker interfaces annotated with `@AutoRestController` extending `AutoApiController<E>`.

Domain workflows beyond generic CRUD live in `Service` interfaces and independent `@AutoService` / `@AutoComponent` `public final class` `Helper` beans routed via `@CustomEndpoint` or `@ServiceOverride`.

---

## 2. Maven & Gradle Setup (`pom.xml` / `build.gradle.kts`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

For direct GitHub builds via [JitPack](https://jitpack.io):

```xml
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
    <version>v1.0.0</version>
  </dependency>
</dependencies>
```

---

## 3. Production Baseline Configuration (`application.yml`)

`spring-boot-configuration-processor` ships `META-INF/spring-configuration-metadata.json` for `app.framework.*` and `spring-nwvmc.human-policies`:

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
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. Granular Endpoint Filtering (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` matches case-insensitively against method names on `AutoApiController<E>` or functional feature groups (`READ`, `WRITE`, `DELETE`, `BATCH`, `ANALYTICS`, `EXPORT`, `AI`, `STREAM`, `SCHEMA`, `SUB_RESOURCE`):

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

## 5. Startup Fail-Fast Diagnostics (`StartupDiagnosticsUtil` & `EntityFailFastValidatorUtil`)

| Exception | Trigger Condition | Remediation |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` detects JVM `< 21` | Run on Java 21 LTS or newer |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` and custom `jwt-secret` `< 32` UTF-8 bytes | Set `${JWT_SECRET}` to at least 32 bytes |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1`, or `maxPageSize < 1` | Configure positive integers under `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` or `ComputedFieldFailFastUtil` detects missing `@Id`, missing no-arg constructor, or invalid `@ComputedField` source fields | Extend `BaseAuditEntity`, retain `@NoArgsConstructor`, and match exact entity field names |
