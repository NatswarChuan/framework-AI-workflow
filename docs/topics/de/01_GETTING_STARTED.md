# 01. Schnellstart, Zwei-Verzeichnis-Vertrag & Fail-Fast-Startdiagnose (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#quickstart)

---

## 1. Strikter Zwei-Verzeichnis-Domänenvertrag (`entity/` & `controller/`)

Anwendungen mit **`io.github.natswarchuan:spring-nwvmc:0.1.0`** strukturieren Fachdomänen in genau zwei Verzeichnissen:

1. `entity/`: JPA-Entitäten, die `BaseAuditEntity` erweitern (integrierter UUIDv7-Primärschlüssel und optimistisches Locking über `@Version`), versehen mit Bean-Validation-Constraints (`jakarta.validation.constraints.*`), B-Tree-Indizes und deklarativen Annotationen (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Marker-Interfaces mit `@AutoRestController`, die `AutoApiController<E>` oder gezielte Teil-Interfaces wie `AutoReadApi<E>` erweitern (auch Standard-Spring-MVC `@RequestBody`/`@RequestParam`/`@PathVariable` werden unterstützt).

Fachabläufe jenseits von Standard-CRUD liegen in `Service`-Interfaces und unabhängigen Spring-`@Service`/`@Component`-`Helper`-Beans (`public final class`), angebunden über `@CustomEndpoint` oder `@ServiceOverride` (`@AutoService` / `@AutoComponent` scannen nur `"io.github.natswarchuan"`, und `@EntityScan` ist erforderlich, falls Entitäten außerhalb von `io.github.natswarchuan`, `com.example`, `io.github` liegen).

---

## 2. Maven- & Gradle-Einrichtung (`pom.xml` / `build.gradle.kts`)

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

Für direkte GitHub-Builds über [JitPack](https://jitpack.io):

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

## 3. Produktions-Basiskonfiguration (`application.yml`)

`spring-boot-configuration-processor` liefert `META-INF/spring-configuration-metadata.json` (`18` Metadatengruppen aus `16` `@AutoConfigurationBean`/`@ConfigurationProperties`-Klassen über `20` `*Properties`-Modelle unter `app.framework.*` und `spring-nwvmc.human-policies`). Veraltete Top-Level-Felder in `ControllerToApiProperties` bleiben aus Kompatibilitätsgründen boot-validiert, während Live-Routen `@AutoRestController(basePath = ...)` und Abfragelimits `app.framework.query-guardrails.*` nutzen:

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

## 4. Granulare Endpunkt-Filterung (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` vergleicht groß-/kleinschreibungsunabhängig anhand des exakten Methodennamens in `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, z. B. `batchChunked`, `deleteById`, `importCsv`):

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 5. Fail-Fast-Startdiagnose (`StartupDiagnosticsUtil` & `EntityFailFastValidatorUtil`)

| Exception | Auslösebedingung | Behebung |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` erkennt JVM `< 21` | Mit Java 21 LTS oder neuer ausführen |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` und benutzerdefiniertes `jwt-secret` `< 32` UTF-8-Bytes | `${JWT_SECRET}` auf mindestens 32 Bytes setzen |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` oder `maxPageSize < 1` | Positive Ganzzahlen unter `app.framework.query-guardrails.*` konfigurieren |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` oder `ComputedFieldFailFastUtil` meldet fehlendes `@Id`, fehlenden Standardkonstruktor oder ungültige `@ComputedField`-Quellfelder | `BaseAuditEntity` erweitern, `@NoArgsConstructor` beibehalten und exakte Feldnamen verwenden |
