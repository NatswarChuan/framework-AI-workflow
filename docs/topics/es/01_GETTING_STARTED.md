# 01. Primeros Pasos, Contrato de Dos Directorios y Diagnóstico Fail-Fast (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Los 20 Idiomas](../README.md) | [Manual Completo](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#quickstart)

---

## 1. Contrato Estricto de Dos Directorios (`entity/` y `controller/`)

Las aplicaciones desarrolladas con **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organizan los dominios de negocio en solo dos directorios:

1. `entity/`: Entidades JPA que extienden `BaseAuditEntity` (clave primaria UUIDv7 y bloqueo optimista `@Version` integrados), con restricciones Bean Validation (`jakarta.validation.constraints.*`), índices B-Tree y anotaciones declarativas (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Interfaces marcadoras anotadas con `@AutoRestController` que extienden `AutoApiController<E>` o subconjuntos componibles como `AutoReadApi<E>` (compatibles también con `@RequestBody`/`@RequestParam`/`@PathVariable` de Spring MVC).

Los flujos de dominio más allá del CRUD genérico residen en interfaces `Service` y beans Spring `@Service` / `@Component` (`public final class` `Helper`) enlazados mediante `@CustomEndpoint` o `@ServiceOverride` (`@AutoService` / `@AutoComponent` solo escanean `"io.github.natswarchuan"`, y añada `@EntityScan` si las entidades viven fuera de `io.github.natswarchuan`, `com.example` o `io.github`).

---

## 2. Configuración Maven y Gradle (`pom.xml` / `build.gradle.kts`)

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

Para compilaciones directas desde GitHub vía [JitPack](https://jitpack.io):

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

## 3. Configuración Base de Producción (`application.yml`)

`spring-boot-configuration-processor` incluye `META-INF/spring-configuration-metadata.json` (`18` grupos de metadatos generados desde `16` clases `@AutoConfigurationBean`/`@ConfigurationProperties` y `20` modelos `*Properties` bajo `app.framework.*` y `spring-nwvmc.human-policies`). Los campos heredados de `ControllerToApiProperties` se validan por compatibilidad al arranque, mientras que las rutas activas usan `@AutoRestController(basePath = ...)` y los límites usan `app.framework.query-guardrails.*`:

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

## 4. Filtrado Granular de Endpoints (`enabledEndpoints` y `disabledEndpoints`)

`EndpointFeatureFilterHelper` compara sin distinguir mayúsculas por el nombre exacto del método en `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, p. ej. `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Diagnóstico Fail-Fast en el Arranque (`StartupDiagnosticsUtil` y `EntityFailFastValidatorUtil`)

| Excepción | Condición de Disparo | Solución |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` detecta JVM `< 21` | Ejecutar con Java 21 LTS o superior |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` y `jwt-secret` personalizado `< 32` bytes UTF-8 | Definir `${JWT_SECRET}` con al menos 32 bytes |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` o `maxPageSize < 1` | Configurar enteros positivos en `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` o `ComputedFieldFailFastUtil` detecta falta de `@Id`, constructor sin argumentos ausente o campos origen inválidos en `@ComputedField` | Extender `BaseAuditEntity`, mantener `@NoArgsConstructor` y coincidir exactamente con los nombres de campo |
