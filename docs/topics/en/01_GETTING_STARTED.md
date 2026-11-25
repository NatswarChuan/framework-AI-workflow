# 01. Getting Started, Two-Directory Contract & Fail-Fast Diagnostics (`0.1.0`)

> **Language**: English | [Tiếng Việt](../01_GETTING_STARTED.md) | [Complete Manual](../../GUIDE_EN.md)

---

## 1. Strict Two-Directory Domain Contract (`entity/` & `controller/`)

Applications built with **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organize business domains into two directories:

1. `entity/`: JPA domain entities extending `BaseAuditEntity` (built-in UUIDv7 PK and `@Version` optimistic locking), carrying Bean Validation constraints (`jakarta.validation.constraints.*`), B-Tree indexes, and declarative annotations (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Marker interfaces annotated with `@AutoRestController` extending `AutoApiController<E>` or composable subsets such as `AutoReadApi<E>` (also supporting standard Spring MVC `@RequestBody`/`@RequestParam`/`@PathVariable`).

Domain workflows beyond generic CRUD live in `Service` interfaces and independent Spring `@Service` / `@Component` `public final class` `Helper` beans routed via `@CustomEndpoint` or `@ServiceOverride` (`@AutoService` / `@AutoComponent` only scan `"io.github.natswarchuan"`, and add `@EntityScan` when entities live outside `io.github.natswarchuan`, `com.example`, `io.github`).

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
    <version>0.1.0</version>
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
    <version>v0.1.0</version>
  </dependency>
</dependencies>
```

---

## 3. Production Baseline Configuration (`application.yml`)

`spring-boot-configuration-processor` ships `META-INF/spring-configuration-metadata.json` (`18` metadata groups from `16` `@AutoConfigurationBean`/`@ConfigurationProperties` classes across `20` `*Properties` models under `app.framework.*` and `spring-nwvmc.human-policies`; legacy top-level fields on `ControllerToApiProperties` such as `base-path-prefix`, `default-page-size`, `max-page-size`, `eager-fetch-singular-relations` remain boot-validated compatibility fields while live routes use `@AutoRestController(basePath = ...)` and query limits use `app.framework.query-guardrails.*`):

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
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
```

---

## 4. Granular Endpoint Filtering (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` matches case-insensitively by exact method name on `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, e.g. `batchChunked`, `deleteById`, `importCsv`):

```java
@AutoRestController(
    basePath = "/api/v1/commercial-products",
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
