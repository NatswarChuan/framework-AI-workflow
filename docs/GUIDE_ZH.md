# Spring-NWVMC `1.0.0` — 技术参考手册（中文）

> **制品坐标**: `io.github.natswarchuan:spring-nwvmc:1.0.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v1.0.0`  
> **运行基线**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **语言切换**: [English](GUIDE_EN.md) | [Tiếng Việt](GUIDE_VI.md) | [日本語](GUIDE_JA.md) | 中文 | [20语言文档门户](index.html)

---

## 1. 架构设计与核心机制

`controller-to-api-framework` 包含 `528` 个主源码 Java 文件、`42` 个声明式注解、`20` 个 `@ConfigurationProperties` 配置模型（自带 `META-INF/spring-configuration-metadata.json`）、`21` 个多语言资源包（`classpath:i18n/messages*.properties`）以及通过 `NwvmcRuntimeHintsRegistrar`（`META-INF/spring/aot.factories`）注册的 GraalVM Native Image AOT 提示。

- **双目录极简业务模型（`entity/` 与 `controller/`）**: 应用层仅需继承 `BaseAuditEntity` 声明 JPA 实体，以及继承 `AutoApiController<E>` 声明控制器接口。整个框架仅在 AOT（`core/aot/`）与配置元数据（`config/properties/`）中保留 `10` 行静态 Spring 导入。
- **`MethodHandle` 热路径调用**: `MethodHandleCacheUtil` 与 `LambdaAccessorUtil` 消除动态代理热路径的反射 `Method.invoke` 开销。
- **UUIDv7 主键（`UuidUtil.generateUuidV7`）**: 基于时间单调递增的 RFC 9562 主键兼顾 B-Tree 顺序写入局部性与 $O(1)$ `/keyset` 游标分页。
- **安全与容错边界**: `GlobalExceptionHandlerHelper`、`CustomContainerErrorController`（`/error`）与 `ExceptionCauseUnwrapperUtil` 在服务端记录完整堆栈的同时向调用方返回脱敏 `ApiResponse<Void>` 及 `X-Request-ID` / W3C `traceparent` 响应头。

---

## 2. 快速接入

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

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:1.0.0")
}
```

### 最小双目录示例

```java
@Entity
@Table(name = "tbl_product_catalog")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @AutoSlug(sourceField = "name")
  private String slug;

  @NotBlank
  private String name;
}

@AutoRestController(path = "/api/v1/product-catalogs")
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 3. 生产基线配置 (`app.framework.*`)

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
      enabled: false                     # 生产默认锁定 (/system/studio* 返回 HTTP 401)
      demo-token-endpoint-enabled: false # 生产默认锁定 (/api/v1/auth/token 返回 HTTP 404)
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. 自动生成 40 项 REST/流式/Schema 契约（默认公开 38 项）

`AutoApiController<E>` 汇总 `AutoApiReadController<E>`（17项读与代码生成）、`11` 项写入/批处理/局部更新/软删恢复契约以及 `AutoApiEnterpriseController<E>`（12项企业生命周期契约；其中 `/events` 标记 `@Hidden`，`/{id}/**` 需显式启用 `enableNestedSubResources = true`）：

- **查询、统计与契约导出（17）**: `GET ""`, `/keyset`, `/all`, `/count`, `/exists`, `/aggregate`, `/distinct`, `/top`, `/group-by`, `/export/csv`, `/export/jsonl`, `/metadata`, `/schema/typescript`, `/schema/json`, `/schema/zod`, `/schema/client`, `/{id}`
- **写入、批量、Upsert 与恢复（11）**: `POST ""`, `/batch`, `/upsert`, `/upsert-batch`, `/batch-chunked`, `PATCH /{id}/increment`, `PATCH /batch-update`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `POST /{id}/restore`
- **状态机、AI、RFC 6902 与流式接口（12）**: `POST /{id}/transition`, `POST /{id}/clone`, `GET /events` (`@Hidden`), `GET /ai/context`, `POST /ai/query`, `GET /human-policy`, `GET /health`, `POST /import/csv`, `POST /import/jsonl`, `PATCH /{id}/patch-rfc6902`, `GET /{id}/diff`, `GET /{id}/**`

---

## 5. `@ServiceOverride` 逃生通道与标准代码导出 (`GET /system/studio/eject`)

1. **`@ServiceOverride` 局部接管**: 在控制器接口方法上声明 `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`，通过 `EscapeHatchDispatchHelper` 与 `MethodHandleCacheUtil` 直接路由至自定义 Spring Bean。
2. **`@CustomEndpoint` 自定义行为**: 将业务子路径转发至独立 `@AutoComponent` Helper 组件执行。
3. **标准 MVC 代码导出**: 调用 `GET /system/studio/eject?target=<EntityOrControllerName>` 即可由 `ControllerEjectionHelper` 生成解耦的标准 `Controller` / `Service` / `ServiceImpl` / `Repository` 代码骨架。

---

## 6. 动态查询守卫、Micrometer 指标与 20 语言支持

- **13 种查询运算符**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`。
- **查询防拒绝服务与防注入**: `QueryFilterParameterUtil` 拦截 SQLi/XSS 载荷，`QueryGuardrailProperties` 强制约束 `max-join-depth=3`、`max-filter-criteria=25` 与 `max-page-size=200`。
- **Micrometer 指标（`DynamicEntityMetricsHelper` / `MetricConstant`）**: 采集 `dynamic.entity.requests.total`、`dynamic.entity.duration.seconds`、`nwvmc.proxy.request.duration`、`nwvmc.cache.http.requests`、`nwvmc.outbox.pending.events`、`nwvmc.outbox.dispatch.duration`、`nwvmc.resilience.circuitbreaker.state`、`nwvmc.ratelimit.rejected.total` 与 `framework.datasource.routing.total`。
- **20 语言与 RTL 支持（`I18nConstant`）**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（其中 `ar`、`fa`、`ur` 启用 RTL 从右向左布局）。解析顺序：`?lang=` -> `NWVMC_LANG` Cookie -> `X-Language` -> `Accept-Language` -> `en`。

---

## 7. JMH `1.37` 微基准测试与 SBOM 生成

`DynamicProxyThroughputBenchmarkTest` 实测吞吐量（`ops/ms`）：

| 基准测试方法 | 平均吞吐量 |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |

生成 CycloneDX SBOM 报告（`target/bom.json`）：

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```
