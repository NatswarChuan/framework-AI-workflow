# 01. Démarrage Rapide, Contrat Deux Répertoires et Diagnostics Fail-Fast (`0.1.0`)

> **Langues**: **Français** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Les 20 Langues](../README.md) | [Manuel Complet (EN)](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#quickstart)

---

## 1. Contrat Strict à Deux Répertoires (`entity/` et `controller/`)

Les applications conçues avec **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organisent les domaines métier en deux répertoires :

1. `entity/` : Entités JPA étendant `BaseAuditEntity` (clé primaire UUIDv7 et verrouillage optimiste `@Version` intégrés), portant les contraintes Bean Validation (`jakarta.validation.constraints.*`), les index B-Tree et les annotations déclaratives (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/` : Interfaces marqueurs annotées `@AutoRestController` étendant `AutoApiController<E>` ou des sous-ensembles composables comme `AutoReadApi<E>` (également compatibles avec `@RequestBody`/`@RequestParam`/`@PathVariable` de Spring MVC).

Les flux métier au-delà du CRUD générique résident dans des interfaces `Service` et des beans Spring `@Service` / `@Component` (`public final class` `Helper`) reliés via `@CustomEndpoint` ou `@ServiceOverride` (`@AutoService` / `@AutoComponent` analysent uniquement `"io.github.natswarchuan"`, et ajoutez `@EntityScan` si les entités se trouvent hors de `io.github.natswarchuan`, `com.example` ou `io.github`).

---

## 2. Configuration Maven et Gradle (`pom.xml` / `build.gradle.kts`)

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

```kotlin
// Gradle (Kotlin DSL — build.gradle.kts)
dependencies {
    implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
tasks.withType<JavaCompile> {
    options.compilerArgs.add("-parameters")
}
```

Pour des builds directs depuis GitHub via [JitPack](https://jitpack.io) :

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

## 3. Configuration de Référence en Production (`application.yml`)

`spring-boot-configuration-processor` embarque `META-INF/spring-configuration-metadata.json` (`18` groupes de métadonnées issus de `16` classes `@AutoConfigurationBean`/`@ConfigurationProperties` et `20` modèles `*Properties` sous `app.framework.*` et `spring-nwvmc.human-policies`). Les champs hérités de `ControllerToApiProperties` restent validés au démarrage pour compatibilité, tandis que les routes actives utilisent `@AutoRestController(basePath = ...)` et les limites `app.framework.query-guardrails.*` :

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

> **Astuce Dev Local :** Si `JWT_SECRET` n’est pas encore exporté, définissez `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` uniquement dans `application-dev.yml` (gardez `application.yml`/`application-prod.yml` strictement fail-closed).

---

## 4. Filtrage Granulaire des Endpoints (`enabledEndpoints` et `disabledEndpoints`)

`EndpointFeatureFilterHelper` effectue une correspondance insensible à la casse sur le nom exact de méthode dans `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, ex. `batchChunked`, `deleteById`, `importCsv`) :

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

## 5. Diagnostics Fail-Fast au Démarrage (`StartupDiagnosticsUtil` et `EntityFailFastValidatorUtil`)

| Exception | Condition de Déclenchement | Correction |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` détecte une JVM `< 21` | Exécuter sur Java 21 LTS ou version ultérieure |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` et `jwt-secret` personnalisé `< 32` octets UTF-8 | Définir `${JWT_SECRET}` sur au moins 32 octets |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` ou `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | Configurer des entiers positifs sous `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` ou `ComputedFieldFailFastUtil` détecte l’absence de `@Id`, de constructeur sans argument ou des champs `@ComputedField` invalides | Étendre `BaseAuditEntity`, conserver `@NoArgsConstructor` et respecter les noms exacts des champs |
