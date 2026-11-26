# Spring-NWVMC `0.1.0` — 技术参考手册（中文）

> **制品坐标**: `io.github.natswarchuan:spring-nwvmc:0.1.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`  
> **运行基线**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **专题文档（支持全部20种语言）**: [快速上手](topics/zh/01_GETTING_STARTED.md) · [40 项端点契约](topics/zh/02_REST_API_CATALOG.md) · [查询与 GraphQL](topics/zh/03_QUERY_AND_DATA_ACCESS.md) · [安全、指标与 i18n](topics/zh/04_ADVANCED_ENTERPRISE_FEATURES.md) · [8 个 SPI 扩展点](topics/zh/05_SPRING_ECOSYSTEM_SPIS.md) · [60 个声明式注解完整规范](topics/zh/06_DECLARATIVE_ANNOTATIONS.md) · [AI-Agent 集成工具包](topics/zh/07_AI_AGENT_ADOPTION_KIT.md) · [全部20种语言索引](topics/README.md)  
> **语言切换**: [English](GUIDE_EN.md) | [Tiếng Việt](GUIDE_VI.md) | [日本語](GUIDE_JA.md) | 中文 | [20语言文档门户](index.html)

---

## 1. 架构设计与核心机制

`controller-to-api-framework` 提供 `60` 个 Pure Java 声明式注解（含数据库驱动动态 RBAC）、`9` 个可组合能力接口（`AutoReadApi`..`AutoAiApi`）、强类型 `@ConfigurationProperties` 配置元数据（`META-INF/spring-configuration-metadata.json`）、多语言资源包（`classpath:i18n/messages*.properties`）以及 GraalVM Native Image `RuntimeHints`（`META-INF/spring/aot.factories`）。

- **双目录极简业务模型（`entity/` 与 `controller/`）**: 应用层仅需继承 `BaseAuditEntity`（内置 `@Version` 乐观锁冲突返回 `409 Conflict` 及 `JpaAssociationReferenceUtil` 外键引用解析）声明 JPA 实体，以及继承 `AutoApiController<E>` 或只读/按需组合接口（如 `AutoReadApi<E>`）声明控制器接口（支持 `@AutoRestController(readDto, createDto, updateDto)` 及标准 Spring MVC 的 `@RequestBody`/`@RequestParam`/`@PathVariable`）。整个框架仅在 AOT（`autoconfigure/`、`common/constant/AotConstant`、`common/util/AotRuntimeHintsUtil`）与配置元数据（`config/properties/`）中保留 `10` 行静态 Spring 导入。
- **`MethodHandle` 热路径调用**: `MethodHandleCacheUtil` 与 `LambdaAccessorUtil` 消除动态代理热路径的反射 `Method.invoke` 开销。
- **UUIDv7 主键（`UuidUtil.generateUuidV7`）**: 基于时间单调递增的 RFC 9562 主键兼顾 B-Tree 顺序写入局部性与 `O(1)` `/keyset` 游标分页。
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
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
tasks.withType<JavaCompile> {
  options.compilerArgs.add("-parameters")
}
```

```xml
<!-- 通过 JitPack 直接引入 GitHub 发布版（无需预先本地安装） -->
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
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String skuCode;

  @AutoSlug(sourceField = "productName")
  private String slug;

  @NotBlank
  private String productName;
}

@AutoRestController(basePath = "/api/v1/product-catalogs")
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
      enabled: false                     # 生产默认锁定 (/system/studio* 返回 HTTP 401/404)
      demo-token-endpoint-enabled: false # 生产默认锁定 (/api/v1/auth/token 返回 HTTP 404)
      show-i18n-diagnostics: false
```

---

## 4. 自动生成 40 项 REST/流式/Schema 契约（默认公开 38 项）

`AutoApiController<E>` 汇总 `AutoApiReadController<E>`（15 项读与代码生成）、`AutoWriteApi` + `AutoBatchApi`（10 项写入与批处理契约）、`AutoApiEnterpriseController<E>`（11 项企业流程/增量调整/AI/流式契约）与 `AutoExportImportApi<E>`（4 项 CSV/JSONL 导出与导入契约；其中 `/events` 标记 `@Hidden`，`/{id}/**` 需显式启用 `enableNestedSubResources = true`，支持 `@AutoRestController(readDto = ProductReadDto.class)`）：

- **查询、统计与契约导出（`AutoApiReadController` — 15）**: `GET ""` (`getPage`), `/keyset` (`getKeysetPage`), `/all` (`getAll`), `/count` (`count`), `/exists` (`exists`), `/aggregate` (`aggregate`), `/distinct` (`findDistinctValues`), `/top` (`findTopRecords`), `/group-by` (`groupByAnalytics`), `/metadata` (`getMetadata`), `/schema/typescript` (`generateTypeScript`), `/schema/json` (`getJsonSchema`), `/schema/zod` (`generateZodSchema`), `/schema/client` (`generateTypedApiClient`), `/{id}` (`getById`)
- **写入、批量、Upsert 与恢复（`AutoWriteApi` + `AutoBatchApi` — 10）**: `POST ""` (`create`), `/upsert` (`upsert`), `PUT /{id}` (`update`), `PATCH /{id}` (`patch`), `DELETE /{id}` (`deleteById`), `POST /{id}/restore` (`restoreById`), `POST /batch` (`createBatch`), `/upsert-batch` (`upsertBatch`), `/batch-chunked` (`batchChunked`), `PATCH /batch-update` (`updateBatchByFilter`)
- **状态机、增量微调、AI、RFC 6902 与流式接口（`AutoApiEnterpriseController` — 11）**: `POST /{id}/transition` (`transitionState`), `POST /{id}/clone` (`cloneEntity`), `PATCH /{id}/increment` (`adjustNumericField`), `PATCH /{id}/patch-rfc6902` (`patchRfc6902`), `GET /{id}/diff` (`compareEntityDiff`), `GET /human-policy` (`getPolicySummary`), `GET /health` (`getEntityHealth`), `GET /events` (`@Hidden` `streamEvents`), `GET /{id}/**` (`navigateSubResources`), `GET /ai/context` (`getAiContext`), `POST /ai/query` (`queryAi`)
- **CSV 与 JSONL 导入/导出（`AutoExportImportApi` — 4）**: `GET /export/csv` (`exportCsv`), `GET /export/jsonl` (`exportJsonl`), `POST /import/csv` (`importCsv`), `POST /import/jsonl` (`importJsonl`)

---

## 5. `@ServiceOverride` 逃生通道与标准代码导出 (`GET /system/studio/eject`)

1. **`@ServiceOverride` 局部接管**: 在控制器接口方法上声明 `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`，通过 `EscapeHatchDispatchHelper` 与 `MethodHandleCacheUtil` 直接路由至自定义 Spring Bean。
2. **`@CustomEndpoint` 自定义行为**: 将业务子路径转发至独立 `@Component` Helper 组件执行。
3. **标准 MVC 代码导出**: 调用 `GET /system/studio/eject?target=<EntityOrControllerName>` 即可由 `ControllerEjectionHelper` 生成解耦的标准 5 个文件（`DTO` / `Repository` / `Service` / `ServiceImpl` / `Controller`）代码骨架。

---

## 6. 动态查询守卫、Micrometer 指标与 20 语言支持

- **13 种查询运算符**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`；结合 `EntityCloneSnapshotHelper` 无突变 `?fields=` / GraphQL 投影、`?expand=` 选择性关联加载及 `ASC`/`DESC` 双向 `/keyset` 分页（`size+1` 探测）。
- **查询防拒绝服务与防注入**: `QueryFilterParameterUtil` 拦截 SQLi/XSS 载荷，`QueryGuardrailProperties` 强制约束 `max-join-depth=3`、`max-filter-criteria=25`、`max-page-size=200` 与 `max-unpaged-fetch-limit=5000`；`ConstraintViolationException` 自动映射 HTTP `409 Conflict`。
- **Micrometer 指标（`DynamicEntityMetricsHelper` / `MetricConstant`，共 11 项）**: 采集 `dynamic.entity.requests.total`、`dynamic.entity.duration.seconds`、`nwvmc.proxy.request.duration`、`nwvmc.cache.http.requests`、`nwvmc.outbox.pending.events`、`nwvmc.outbox.dispatch.duration`、`nwvmc.resilience.circuitbreaker.state`、`nwvmc.ratelimit.rejected.total`、`framework.outbox.dispatched.total`、`framework.realtime.active.connections` 与 `framework.datasource.routing.total`。
- **数据库驱动动态 RBAC、Multi-Tenant 与 SPI 扩展**: `@MultiTenant` 缺省租户失败关闭返回 `403`、创建时强制防伪造覆盖并在全部按 ID 操作阻断跨租户 IDOR；支持 `@SecurityRoleEntity` / `@SecurityPermissionEntity` / `@SecurityUserRoleEntity` / `@SecurityPolicyEntity`（`DENY` > `ALLOW`）、`PureJavaSecurityFilterBridge` 无损共存宿主 `SecurityFilterChain`，以及 `DistributedLockProvider` / `IdempotencyStoreProvider` SPI。
- **20 语言与 RTL 支持（`I18nConstant`）**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（其中 `ar`、`fa`、`ur` 启用 RTL 从右向左布局）。解析顺序：`?lang=` -> `X-Language` -> `NWVMC_LANG` Cookie -> `Accept-Language` -> `en`。

---

## 7. JMH `1.37` 微基准测试与 SBOM 生成

`DynamicProxyThroughputBenchmarkTest` 实测吞吐量（`ops/ms`）：

| 基准测试方法 | 平均吞吐量 |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

生成 CycloneDX `1.6` SBOM 报告（`target/bom.json`）：

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```

---

## 8. 60 个声明式注解：属性清单、默认值与选型决策规范

全部 `60` 个框架注解的包名、`@Target`、完整属性、Java 类型、默认值、必填/可选、用法示例及适用/禁忌场景已完整收录于 **[20 语言互动文档 (`#annotations`)](index.html#annotations)** 与 **[60 个注解详细技术规范](topics/zh/06_DECLARATIVE_ANNOTATIONS.md)**。核心注解决策速查如下：

| 注解 | 核心属性与默认值 | 何时使用（推荐场景） | 何时不应使用 / 常见误区 |
| :--- | :--- | :--- | :--- |
| `@AutoRestController` | `basePath=""`, `path=""`, `entityName=""`, `enabledEndpoints={}`, `disabledEndpoints={}`, `enableNestedSubResources=false`, `readDto/createDto/updateDto=Void.class` | 在继承 `AutoApiController<E>` 或 `AutoReadApi<E>` 的接口上声明，零模板代码暴露 CRUD 与统计契约。 | 切勿贴在普通 `@RestController` 实现类或无对应 JPA 实体的流程上；公开只读目录优先继承 `AutoReadApi<E>`。 |
| `@ServiceOverride` | `targetBean=Void.class`, `beanName=""`, `methodName=""`, `bypassAutoDispatch=true` | 需接管某个自动契约方法并路由到自定义 Spring Bean 逻辑时使用。 | 新增自定义 URL 请用 `@CustomEndpoint`；`targetBean` 必须传 `Class<?>`（按名称路由用 `beanName`）。 |
| `@CustomEndpoint` | `path=""`, `httpMethod="GET"`, `delegateBean=""`, `delegateMethod=""`, `summary=""`, `description=""` | 在实体下扩展结账、审批等业务子端点并委托给独立 Spring `@Component`/`@Service` 时使用。 | `delegateBean` 不能为空且不可使用框架内部 `@AutoService`；它先于 `invokeProtectedOperation` 直接分发，鉴权与 AOP 应放在目标 Bean 内。 |
| `@EntitySecurity` | `readRoles={}`, `writeRoles={}`, `deleteRoles={}`, `permitAll=false`, `ownerField=""`, `bypassOwnerRoles={"ROLE_ADMIN","ROLE_SUPER_ADMIN"}`, `permissions={}` | 对实体强制执行 RBAC 角色校验与基于 `ownerField` 的行级数据隔离。 | 开启 `permitAll=true` 会同时放行 READ/WRITE/DELETE 全操作（除非被 `@SecurityPolicyEntity` 覆盖），公开目录务必配合 `AutoReadApi<E>` 或 `disabledEndpoints`。 |
| `@FieldSecurity` | `viewRoles={}`, `maskPattern="******"`, `nullifyInsteadOfMask=false` | 无权调用方查询数据时自动遮蔽敏感列或置 `null`。 | 非字符串类型（`BigDecimal`、日期、`UUID`）已由 `FieldMaskingExecutionHelper` 自动置 `null`；仅当希望 `String` 字段输出 `null` 而非 `"******"` 时开启 `nullifyInsteadOfMask=true`。 |
| `@MultiTenant` | `tenantField="tenantId"`, `bypassTenantRoles={"ROLE_SUPER_ADMIN"}` | SaaS 多租户行级隔离（缺少租户上下文时拒绝 `403` 并阻断跨租户 IDOR）。 | 切勿贴在全局公共字典表（如货币、国家码）上。 |
| `@StateMachine` | `initial="ACTIVE"`, `transitions={}`, `deletableStates={}` | 订单、支付单等需要严格约束合法状态流转和允许删除状态的实体。 | 静态分类配置表无需启用；务必将允许软删的状态显式加入 `deletableStates`。 |
| `@DistributedLock` | `key=""`, `waitTimeMs=3000L`, `leaseTimeMs=5000L` | 库存扣减、账户余额变更等高并发临界区通过 SpEL `key` 串行加锁。 | 高并发下避免留空 `key=""` 造成粗粒度锁争用，应指定细粒度键如 `"'sku:' + #skuCode"`。 |
| `@Idempotent` | `headerName="X-Idempotency-Key"`, `ttlSeconds=300L` | 创建订单或发起扣款接口防重复提交与并发重放（冲突返回 `409 Conflict`）。 | 只读 `GET` 接口不要标注；空 `X-Idempotency-Key` 头将跳过幂等校验。 |
| `@RateLimit` | `requests=60`, `windowSeconds=60`, `partitionKey="IP"` | 按 `"IP"`/`"clientIp"`、`"USER"`（匿名自动回退 IP）、`"TENANT"`、`"GLOBAL"` 或 SpEL `#expr` 限流。 | 需要用户/租户隔离时避免使用 `"GLOBAL"`；允许请求返回 `X-RateLimit-Remaining`/`X-RateLimit-Reset`，超限返回 `HTTP 429` 与 `Retry-After`。 |
| `@HttpCacheable` | `maxAgeSeconds=60`, `isPrivate=false`, `mustRevalidate=true`, `generateETag=true` | 较稳定的只读响应启用 RFC 7232 弱 ETag（`W/"..."`）与 HTTP `304 Not Modified`。 | 包含个人隐私或租户隔离数据的端点切勿保持 `isPrivate=false`（公有缓存可导致越权缓存污染）。 |
| `@SecurityRoleEntity` 等 17 个 DB-RBAC | `cacheTtlSeconds=60L`, `enabled=true`, `priority=100` 及 14 个字段标记注解 | 由数据库实时表管理角色、权限、动态字段掩码与 `DENY > ALLOW` 策略规则。 | 缺少必填标记或在同类中重复标注同一单值标记注解均会被 `DatabaseRbacFailFastValidatorUtil` 启动 Fail-Fast 拦截。 |

---

## 9. 通用 AI-Agent 集成工具包（`ai-agent-kit/` 与 `llms.txt`）

> 交互式门户：[`docs/index.html#ai-agent-kit`](index.html#ai-agent-kit) · 中文专题文档：[07. AI-Agent 集成工具包](topics/zh/07_AI_AGENT_ADOPTION_KIT.md) · LLM 索引：[`llms.txt`](../llms.txt)

通过内置的 **SDD + TDD 通用 AI-Agent Adoption Kit**（`INTRO.md`、`RULES.md`、`SKILL.md`、`CHECKLIST.md`、6 份机器校验 `references/01..06` 含 **SDD 与 TDD 实战手册**、`templates/{spec,plan,tasks}.template.md` 模板及 8 套即插 `adapters/`），可让 **所有主流 AI 编程代理与大模型**（Antigravity/Gemini、Claude Code、OpenAI Codex、Cursor、GitHub Copilot、Windsurf、Cline/Roo Code、ChatGPT、DeepSeek、Qwen、Grok 等）按规范驱动与测试驱动零幻觉精准交付 Spring-NWVMC `0.1.0`：

```powershell
# Windows（PowerShell — 在您的 Spring Boot 项目根目录直接运行，无需提前克隆仓库）
$ErrorActionPreference='Stop'; $s=Join-Path $env:TEMP ("nwvmc-install-" + [guid]::NewGuid().ToString("N") + ".ps1"); try { [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }
```

```bash
# macOS / Linux / Git Bash（在项目根目录直接运行，无需提前克隆仓库）
curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
```
