# 02. 40 项自动生成 REST 契约与平台内置控制器目录（`0.1.0`）

> **语言**: [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#endpoints)

---

## 1. 每实体 40 项可组合 `@Auto*` 契约（默认暴露 `38` 项）

继承 `AutoApiController<E>`（或按需组合 `AutoReadApi`、`AutoKeysetApi`、`AutoAnalyticsApi`、`AutoSchemaApi`、`AutoExportImportApi`、`AutoWriteApi`、`AutoBatchApi`、`AutoWorkflowApi`、`AutoAiApi`）后，`DynamicControllerProxyRegistrarHelper` 与 `SpringMvcEndpointBridge` 将自动绑定最多 **40** 项契约（`AutoApiReadController` `15` 项 + `AutoWriteApi`/`AutoBatchApi` `10` 项 + `AutoApiEnterpriseController` `11` 项 + `AutoExportImportApi` `4` 项；因 `/events` 标记 `@Hidden` 且 `/{id}/**` 需开启 `enableNestedSubResources = true`，Swagger UI 默认展示 **`38`** 项）。支持 `@AutoRestController(readDto, createDto, updateDto)` 与标准 Spring `@RequestBody`/`@RequestParam`/`@PathVariable`。

### 第 1 组：查询、统计分析与客户端代码生成（`AutoApiReadController` — 15 项契约）

| # | HTTP | 子路径 | 方法名 | 行为说明 |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 支持 13 种动态运算符过滤、多字段排序、关联预加载及稀疏字段的分页查询。 |
| 2 | `GET` | `/keyset` | `getKeysetPage` | 基于单调 UUIDv7 的 O(1) 游标分页，消除深分页全表扫描开销。 |
| 3 | `GET` | `/all` | `getAll` | 返回匹配动态条件的全量轻量集合，适用于下拉框与字典表。 |
| 4 | `GET` | `/count` | `count` | 执行匹配动态过滤条件的 SQL COUNT(*) 计数查询。 |
| 5 | `GET` | `/exists` | `exists` | 快速布尔检测接口，只要存在至少一条匹配记录即返回 true。 |
| 6 | `GET` | `/aggregate` | `aggregate` | 在数值字段上计算 SQL SUM、AVG、MIN、MAX 与 COUNT 聚合指标。 |
| 7 | `GET` | `/distinct` | `findDistinctValues` | 提取去重后的字段枚举值列表，用于筛选下拉选项展示。 |
| 8 | `GET` | `/top` | `findTopRecords` | 返回排序后的前 N 条实体记录，适用于排行榜与告警列表。 |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | 用于图表与商业智能报表的动态 GROUP BY 分组聚合指标。 |
| 10 | `GET` | `/metadata` | `getMetadata` | 暴露 JPA 字段定义、Jakarta 校验约束以及 RBAC 可见性元数据。 |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | 直接根据 JPA 实体字段实时生成可复制的 TypeScript 接口定义。 |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | 生成适用于前端表单构建器的 JSON Schema Draft 契约。 |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | 通过 ZodAndClientGeneratorUtil 生成运行时 Zod 校验模式（text/plain）。 |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | 生成集成 Zod 解析与 CRUD 辅助方法的强类型 TypeScript Fetch 客户端模块。 |
| 15 | `GET` | `/{id}` | `getById` | 按 UUIDv7 查询单条实体，自动应用 @FieldSecurity 字段脱敏与 @HttpCacheable ETag。 |

### 第 2 组：写入、批量、Upsert、局部更新、删除与恢复（`AutoWriteApi` + `AutoBatchApi` — 10 项契约）

| # | HTTP | 子路径 | 方法名 | 行为说明 |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | 创建实体并自动执行参数校验、@AutoCode 编号、@AutoSlug、@UniqueField 查重与 @ComputedField 计算。 |
| 17 | `POST` | `/batch` | `createBatch` | 在单个原子事务中批量校验并写入实体集合。 |
| 18 | `POST` | `/upsert` | `upsert` | 基于 @UniqueField 唯一键或显式 UUIDv7 主键执行原子插入或更新。 |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | 在单事务中对记录数组执行批量 Upsert 插入或更新。 |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | 按可配置分块大小处理大批量数据，并返回逐条 BatchExecutionResultDto 诊断结果。 |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | 使用请求体中的非空字段，批量局部更新所有符合 URL 过滤条件的记录。 |
| 22 | `PUT` | `/{id}` | `update` | 完整更新实体字段，同时保留服务端审计字段。 |
| 23 | `PATCH` | `/{id}` | `patch` | 局部合并更新，仅将请求中的非空属性覆盖到现有实体。 |
| 24 | `DELETE` | `/{id}` | `deleteById` | 校验 @EntitySecurity deleteRoles 与 @StateMachine deletableStates 后执行软删除。 |
| 25 | `POST` | `/{id}/restore` | `restoreById` | 将被软删除的实体恢复至正常活跃查询范围。 |

### 第 3 组：企业生命周期、AI、RFC 6902 补丁与流式推送（`AutoApiEnterpriseController` — 11 项契约）

| # | HTTP | 子路径 | 方法名 | 行为说明 |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | 执行原子正负数值增量调整，避免客户端先读后写的竞态覆盖。 |
| 27 | `POST` | `/{id}/transition` | `transitionState` | 执行经过校验的 @StateMachine 状态流转至 targetState，并触发审计与 Webhook 事件。 |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | 复制实体记录，生成新的 UUIDv7 主键并重新签发 @AutoCode 字段。 |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | 基于 Server-Sent Events (SSE) 的实时实体事件流（因 MIME 为 text/event-stream 在 Swagger UI 中 @Hidden 隐藏）。 |
| 30 | `GET` | `/ai/context` | `getAiContext` | 导出描述实体字段与过滤操作符的 LLM JSON 工具契约。 |
| 31 | `POST` | `/ai/query` | `queryAi` | 将自然语言查询提示词转换为受限且参数化的 JPA Criteria 安全查询。 |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | 返回编译后的 @HumanPolicy 生命周期流转规则、RBAC 角色及 YAML 覆盖配置。 |
| 33 | `GET` | `/health` | `getEntityHealth` | 检查每个实体对应数据库表的健康状态与总记录数。 |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | 应用结构化的 RFC 6902 JSON Patch 操作（replace、add、remove）。 |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | 对比两条实体的当前字段差异（source id 对比 targetId）。 |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | 递归关联子资源导航（需显式开启 @AutoRestController(enableNestedSubResources = true)）。 |

### 第 4 组：CSV 与 JSONL 批量导入导出（`AutoExportImportApi` — 4 项契约）

| # | HTTP | 子路径 | 方法名 | 行为说明 |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | 将过滤后的实体数据导出为符合 RFC-4180 标准的 CSV 文件。 |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | 以 application/x-ndjson 按行分隔 JSON 流式输出匹配记录。 |
| 39 | `POST` | `/import/csv` | `importCsv` | 以分块批处理方式导入 RFC-4180 CSV 原始请求体数据。 |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | 流式导入按行分隔的 NDJSON 数据集。 |

---

## 2. 平台内置控制器

| 端点 / 前缀 | 控制器类 | 职责与生产锁定策略 |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20 语言开发者工作台（支持 RTL `ar`, `fa`, `ur`）；`app.framework.studio.enabled=false` 时返回 `401` |
| `GET /system/studio/eject` | `DevEjectionController` | 导出标准 Spring MVC Controller/Service/Repository 源码；受 `SurfaceAccessGuardrailUtil` 保护 |
| `POST /api/v1/auth/token` | `AuthController` | 签发开发调试用 HMAC-SHA512 JWT；`demo-token-endpoint-enabled=false` 时返回 `404` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`、`GET /download/{fileId}`、`GET /metadata/{fileId}`、`POST /presigned-url`（`LOCAL` / `S3` / `GCS`） |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`、`POST ""`、`GET /explorer`（`@Hidden`） |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | 按指定 ISO-8601 UTC 时间戳还原实体历史快照 |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | 查询 `7` 个核心遥测 `*Customizer` 分组已注册的 SPI Bean（`StorageCustomizer` 由 `StorageCustomizerRegistryHelper` 独立管理，共 `8` 个 SPI） |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Resilience4j 熔断器实时健康指标 |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | 多数据源健康状态巡检 |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | 当前 MDC 上下文中的 W3C `traceparent` 与 UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | 将 Tomcat 容器层 `400/404/405/413/431/500` 错误统一封装为 `ApiResponse<Void>` |
