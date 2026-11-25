# 01. 快速上手、双目录领域契约与启动 Fail-Fast 诊断（`0.1.0`）

> **语言**: [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#quickstart)

---

## 1. 严格双目录领域契约（`entity/` 与 `controller/`）

基于 **`io.github.natswarchuan:spring-nwvmc:0.1.0`** 的 Spring Boot 应用仅需两个领域目录即可组织核心业务：

1. `entity/`：继承 `BaseAuditEntity`（内置 UUIDv7 主键与 `@Version` 乐观锁）的 JPA 实体，声明 Bean Validation 校验约束（`jakarta.validation.constraints.*`）、B-Tree 索引以及声明式注解（`@EntitySecurity`、`@FieldSecurity`、`@StateMachine`、`@AutoCode`、`@AutoSlug`、`@UniqueField`、`@ComputedField`、`@AuditTrail`、`@MultiTenant`）。
2. `controller/`：标注 `@AutoRestController` 并继承 `AutoApiController<E>` 或 `AutoReadApi<E>` 等能力子接口的标记接口（同时兼容标准 Spring MVC 的 `@RequestBody`/`@RequestParam`/`@PathVariable`）。

超出通用 CRUD 的领域流程放在独立 Spring `@Service` / `@Component` 的 `public final class` `Helper` Bean 中，通过 `@CustomEndpoint` 或 `@ServiceOverride` 路由委派（`@AutoService` / `@AutoComponent` 仅扫描 `"io.github.natswarchuan"`，若实体位于 `io.github.natswarchuan`、`com.example`、`io.github` 之外需添加 `@EntityScan`）。

---

## 2. Maven 与 Gradle 接入（`pom.xml` / `build.gradle.kts`）

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

若需通过 [JitPack](https://jitpack.io) 直接从 GitHub 构建引入：

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

## 3. 生产基线配置（`application.yml`）

`spring-boot-configuration-processor` 内置 `META-INF/spring-configuration-metadata.json`（涵盖 `app.framework.*` 与 `spring-nwvmc.human-policies` 下 `20` 个 `*Properties` 模型、`16` 个 `@AutoConfigurationBean`/`@ConfigurationProperties` 类对应的 `18` 组配置元数据）。`ControllerToApiProperties` 旧顶层字段仅保留启动兼容校验，实时路由由 `@AutoRestController(basePath = ...)` 控制，查询限流由 `app.framework.query-guardrails.*` 生效：

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

## 4. 细粒度端点启停（`enabledEndpoints` 与 `disabledEndpoints`）

`EndpointFeatureFilterHelper` 按 `AutoApiController<E>` 的精确方法名忽略大小写匹配（`equalsIgnoreCase(methodName)`，如 `batchChunked`、`deleteById`、`importCsv`）：

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

## 5. 启动期 Fail-Fast 诊断（`StartupDiagnosticsUtil` 与 `EntityFailFastValidatorUtil`）

| 异常类 | 触发条件 | 修复方式 |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` 检测到 JVM `< 21` | 升级至 Java 21 LTS 或更高版本 |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` 且自定义 `jwt-secret` 少于 `32` UTF-8 字节 | 将 `${JWT_SECRET}` 配置为不少于 32 字节的高强度密钥 |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`、`maxFilterCriteria < 1` 或 `maxPageSize < 1` | 在 `app.framework.query-guardrails.*` 下配置正整数 |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` 或 `ComputedFieldFailFastUtil` 检测到缺少 `@Id`、缺少无参构造器或 `@ComputedField` 源字段名无效 | 继承 `BaseAuditEntity`、保留 `@NoArgsConstructor` 并确保字段名完全匹配 |
