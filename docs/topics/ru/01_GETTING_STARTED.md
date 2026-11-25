# 01. Быстрый старт, контракт двух каталогов и Fail-Fast диагностика запуска (`0.1.0`)

> **Языки**: **Русский** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#quickstart)

---

## 1. Строгий контракт двух каталогов (`entity/` и `controller/`)

Приложения на базе **`io.github.natswarchuan:spring-nwvmc:0.1.0`** организуют предметную область всего в двух каталогах:

1. `entity/`: JPA-сущности, наследующие `BaseAuditEntity` (встроенные UUIDv7-ключи и оптимистичная блокировка `@Version`), с правилами Bean Validation (`jakarta.validation.constraints.*`), B-Tree индексами и декларативными аннотациями (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Маркерные интерфейсы с `@AutoRestController`, расширяющие `AutoApiController<E>` или составные подинтерфейсы вроде `AutoReadApi<E>` (также поддерживаются стандартные `@RequestBody`/`@RequestParam`/`@PathVariable` Spring MVC).

Бизнес-процессы за рамками типового CRUD выносятся в интерфейсы `Service` и независимые Spring `@Service` / `@Component` бины (`public final class` `Helper`), подключаемые через `@CustomEndpoint` или `@ServiceOverride` (`@AutoService` / `@AutoComponent` сканируют только `"io.github.natswarchuan"`; добавьте `@EntityScan`, если сущности находятся вне `io.github.natswarchuan`, `com.example`, `io.github`).

---

## 2. Настройка Maven и Gradle (`pom.xml` / `build.gradle.kts`)

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

Для прямой сборки с GitHub через [JitPack](https://jitpack.io):

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

## 3. Базовая конфигурация для продакшена (`application.yml`)

`spring-boot-configuration-processor` поставляет `META-INF/spring-configuration-metadata.json` (`18` групп метаданных из `16` классов `@AutoConfigurationBean`/`@ConfigurationProperties` по `20` моделям `*Properties` в `app.framework.*` и `spring-nwvmc.human-policies`). Устаревшие поля `ControllerToApiProperties` проверяются при старте для совместимости, тогда как маршруты задаются через `@AutoRestController(basePath = ...)`, а лимиты — через `app.framework.query-guardrails.*`:

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

## 4. Тонкая фильтрация эндпоинтов (`enabledEndpoints` и `disabledEndpoints`)

`EndpointFeatureFilterHelper` без учёта регистра сопоставляет точные имена методов `AutoApiController<E>` (`equalsIgnoreCase(methodName)`, например `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Стартовая диагностика Fail-Fast (`StartupDiagnosticsUtil` и `EntityFailFastValidatorUtil`)

| Исключение | Условие срабатывания | Решение |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` обнаружил JVM `< 21` | Запустите приложение на Java 21 LTS или новее |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` и пользовательский `jwt-secret` короче `32` байт UTF-8 | Задайте `${JWT_SECRET}` длиной не менее 32 байт |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` или `maxPageSize < 1` | Укажите положительные целые числа в `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` или `ComputedFieldFailFastUtil` выявил отсутствие `@Id`, конструктора без аргументов или неверные поля `@ComputedField` | Наследуйте `BaseAuditEntity`, сохраните `@NoArgsConstructor` и используйте точные имена полей сущности |
