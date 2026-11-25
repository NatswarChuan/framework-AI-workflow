# 01. Szybki start, kontrakt dwóch katalogów i diagnostyka Fail-Fast (`0.1.0`)

> **Języki**: **Polski** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#quickstart)

---

## 1. Ścisły kontrakt dwóch katalogów (`entity/` i `controller/`)

Aplikacje oparte na **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organizują domeny biznesowe w dokładnie dwóch katalogach:

1. `entity/`: Encje JPA rozszerzające `BaseAuditEntity` (wbudowany klucz główny UUIDv7 oraz optymistyczne blokowanie `@Version`), z regułami Bean Validation (`jakarta.validation.constraints.*`), indeksami B-Tree oraz adnotacjami deklaratywnymi (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Interfejsy znacznikowe z `@AutoRestController`, rozszerzające `AutoApiController<E>` lub wybrane podinterfejsy takie jak `AutoReadApi<E>` (wspierające także standardowe `@RequestBody`/`@RequestParam`/`@PathVariable` Spring MVC).

Przepływy domenowe wykraczające poza CRUD umieszcza się w interfejsach `Service` oraz niezależnych beanach Spring `@Service` / `@Component` (`public final class` `Helper`) podłączonych przez `@CustomEndpoint` lub `@ServiceOverride` (`@AutoService` / `@AutoComponent` skanują tylko `"io.github.natswarchuan"`; dodaj `@EntityScan`, jeśli encje leżą poza `io.github.natswarchuan`, `com.example`, `io.github`).

---

## 2. Konfiguracja Maven i Gradle (`pom.xml` / `build.gradle.kts`)

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

Aby budować bezpośrednio z GitHuba przez [JitPack](https://jitpack.io):

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

## 3. Bazowa konfiguracja produkcyjna (`application.yml`)

`spring-boot-configuration-processor` dostarcza `META-INF/spring-configuration-metadata.json` (`18` grup metadanych z `16` klas `@AutoConfigurationBean`/`@ConfigurationProperties` w `20` modelach `*Properties` pod `app.framework.*` oraz `spring-nwvmc.human-policies`). Starsze pola `ControllerToApiProperties` pozostają walidowane przy starcie dla zgodności, a aktywne ścieżki i limity sterowane są przez `@AutoRestController(basePath = ...)` i `app.framework.query-guardrails.*`:

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

## 4. Granularne filtrowanie endpointów (`enabledEndpoints` i `disabledEndpoints`)

`EndpointFeatureFilterHelper` dopasowuje bez rozróżniania wielkości liter dokładne nazwy metod z `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, np. `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Diagnostyka startowa Fail-Fast (`StartupDiagnosticsUtil` i `EntityFailFastValidatorUtil`)

| Wyjątek | Warunek wyzwolenia | Rozwiązanie |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` wykrywa JVM `< 21` | Uruchom aplikację na Java 21 LTS lub nowszej |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` oraz własny `jwt-secret` `< 32` bajtów UTF-8 | Ustaw `${JWT_SECRET}` o długości co najmniej 32 bajtów |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` lub `maxPageSize < 1` | Skonfiguruj dodatnie liczby całkowite w `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` lub `ComputedFieldFailFastUtil` wykrywa brak `@Id`, brak bezparametrowego konstruktora lub błędne pola `@ComputedField` | Rozszerz `BaseAuditEntity`, zachowaj `@NoArgsConstructor` i dopasuj dokładne nazwy pól |
