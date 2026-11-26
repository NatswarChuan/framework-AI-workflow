# 01. Primeiros Passos, Contrato de Dois Diretórios e Diagnóstico Fail-Fast (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#quickstart)

---

## 1. Contrato Estrito de Dois Diretórios (`entity/` e `controller/`)

Aplicações construídas com **`io.github.natswarchuan:spring-nwvmc:0.1.0`** organizam domínios de negócio em dois diretórios:

1. `entity/`: Entidades JPA que estendem `BaseAuditEntity` (chave primária UUIDv7 e bloqueio otimista `@Version` embutidos), contendo restrições Bean Validation (`jakarta.validation.constraints.*`), índices B-Tree e anotações declarativas (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Interfaces marcadoras anotadas com `@AutoRestController` que estendem `AutoApiController<E>` ou subconjuntos combináveis como `AutoReadApi<E>` (também compatíveis com `@RequestBody`/`@RequestParam`/`@PathVariable` do Spring MVC).

Fluxos de negócio além do CRUD padrão ficam em interfaces `Service` e beans Spring `@Service` / `@Component` (`public final class` `Helper`) roteados via `@CustomEndpoint` ou `@ServiceOverride` (`@AutoService` / `@AutoComponent` escaneiam apenas `"io.github.natswarchuan"`; adicione `@EntityScan` se as entidades estiverem fora de `io.github.natswarchuan`, `com.example`, `io.github`).

---

## 2. Configuração Maven e Gradle (`pom.xml` / `build.gradle.kts`)

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

Para compilações diretas do GitHub via [JitPack](https://jitpack.io):

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

## 3. Configuração Base de Produção (`application.yml`)

`spring-boot-configuration-processor` inclui `META-INF/spring-configuration-metadata.json` (`18` grupos de metadados de `16` classes `@AutoConfigurationBean`/`@ConfigurationProperties` distribuídos em `20` modelos `*Properties` sob `app.framework.*` e `spring-nwvmc.human-policies`). Campos legados de `ControllerToApiProperties` seguem validados no boot por compatibilidade, enquanto rotas ativas usam `@AutoRestController(basePath = ...)` e limites usam `app.framework.query-guardrails.*`:

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

> **Dica Dev Local:** Se `JWT_SECRET` ainda não estiver exportada, defina `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` apenas em `application-dev.yml` (mantenha `application.yml`/`application-prod.yml` fail-closed).

---

## 4. Filtragem Granular de Endpoints (`enabledEndpoints` e `disabledEndpoints`)

`EndpointFeatureFilterHelper` compara sem diferenciar maiúsculas pelo nome exato do método em `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, ex.: `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Diagnóstico Fail-Fast na Inicialização (`StartupDiagnosticsUtil` e `EntityFailFastValidatorUtil`)

| Exceção | Condição de Disparo | Correção |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` detecta JVM `< 21` | Executar em Java 21 LTS ou superior |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` e `jwt-secret` personalizado `< 32` bytes UTF-8 | Definir `${JWT_SECRET}` com pelo menos 32 bytes |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` ou `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | Configurar inteiros positivos em `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` ou `ComputedFieldFailFastUtil` detecta ausência de `@Id`, construtor padrão ausente ou campos `@ComputedField` inválidos | Estender `BaseAuditEntity`, manter `@NoArgsConstructor` e usar os nomes exatos dos campos |
