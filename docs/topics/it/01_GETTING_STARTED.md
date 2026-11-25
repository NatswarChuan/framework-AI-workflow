# 01. Guida Rapida, Contratto a Due Directory e Diagnostica Fail-Fast (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#quickstart)

---

## 1. Contratto Rigoroso a Due Directory (`entity/` e `controller/`)

Le applicazioni realizzate con **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organizzano i domini applicativi in due sole directory:

1. `entity/`: Entità JPA che estendono `BaseAuditEntity` (chiave primaria UUIDv7 e optimistic locking `@Version` integrati), con vincoli Bean Validation (`jakarta.validation.constraints.*`), indici B-Tree e annotazioni dichiarative (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Interfacce marker annotate `@AutoRestController` che estendono `AutoApiController<E>` o sottoinsiemi componibili come `AutoReadApi<E>` (compatibili anche con `@RequestBody`/`@RequestParam`/`@PathVariable` di Spring MVC).

I flussi di dominio oltre il CRUD generico vivono in interfacce `Service` e bean Spring `@Service` / `@Component` (`public final class` `Helper`) instradati tramite `@CustomEndpoint` o `@ServiceOverride` (`@AutoService` / `@AutoComponent` scansionano solo `"io.github.natswarchuan"`; aggiungere `@EntityScan` se le entità risiedono fuori da `io.github.natswarchuan`, `com.example`, `io.github`).

---

## 2. Configurazione Maven e Gradle (`pom.xml` / `build.gradle.kts`)

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

Per build dirette da GitHub tramite [JitPack](https://jitpack.io):

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

## 3. Configurazione Base di Produzione (`application.yml`)

`spring-boot-configuration-processor` include `META-INF/spring-configuration-metadata.json` (`18` gruppi di metadati da `16` classi `@AutoConfigurationBean`/`@ConfigurationProperties` su `20` modelli `*Properties` sotto `app.framework.*` e `spring-nwvmc.human-policies`). I campi legacy di `ControllerToApiProperties` restano validati all’avvio per compatibilità, mentre le rotte attive usano `@AutoRestController(basePath = ...)` e i limiti `app.framework.query-guardrails.*`:

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

## 4. Filtraggio Granulare degli Endpoint (`enabledEndpoints` e `disabledEndpoints`)

`EndpointFeatureFilterHelper` confronta senza distinzione tra maiuscole e minuscole il nome esatto del metodo su `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, es. `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Diagnostica Fail-Fast all’Avvio (`StartupDiagnosticsUtil` e `EntityFailFastValidatorUtil`)

| Eccezione | Condizione di Attivazione | Soluzione |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` rileva JVM `< 21` | Eseguire su Java 21 LTS o versione successiva |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` e `jwt-secret` personalizzato `< 32` byte UTF-8 | Impostare `${JWT_SECRET}` ad almeno 32 byte |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` o `maxPageSize < 1` | Configurare interi positivi in `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` o `ComputedFieldFailFastUtil` rileva assenza di `@Id`, costruttore vuoto mancante o campi `@ComputedField` non validi | Estendere `BaseAuditEntity`, mantenere `@NoArgsConstructor` e far coincidere i nomi dei campi |
