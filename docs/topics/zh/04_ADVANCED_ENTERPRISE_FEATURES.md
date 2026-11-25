# 04. 安全体系、多云存储、`@ServiceOverride`、可观测指标与 20 语言 i18n（`0.1.0`）

> **语言**: [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#security-rbac)

---

## 1. NIST Level 2 安全、数据库动态 RBAC、攻击面锁定与防扫描保护

- **`@EntitySecurity`、`@FieldSecurity` 与 `@MultiTenant`**：声明式表级 RBAC（`readRoles`、`writeRoles`、`deleteRoles`、`permissions`，支持元注解组合）、属主隔离（`ownerField`）、敏感列脱敏或置空（`viewRoles`、`maskPattern`、`nullifyInsteadOfMask`）以及默认拒绝的 `@MultiTenant` 租户隔离（缺失租户返回 `403`、写入防伪造覆写与全单 ID 接口 IDOR 校验）。
- **数据库驱动动态 RBAC（`DynamicDatabaseRbacProviderHelper`）**：在 4 张业务 JPA 实体上分别标注 `@SecurityRoleEntity`、`@SecurityPermissionEntity`、`@SecurityUserRoleEntity` 与 `@SecurityPolicyEntity` 及其字段标记。强制 `DENY` 优先于 `ALLOW`、结合 `X-Tenant-ID` 租户上下文、由 `DatabaseRbacCacheInvalidationListener` 自动失效 L1 Caffeine 缓存、经 `PureJavaSecurityFilterBridge` 无冲突共存于自定义 `SecurityFilterChain`，并支持 `SecurityIdentityCustomizer` 扩展（`app.framework.security.dynamic-database-rbac-enabled=true`）。
- **默认安全锁定（`DevStudioProperties` + `SurfaceAccessGuardrailUtil`）**：当 `app.framework.studio.enabled=false`（默认）时，`SecurityExposurePolicyBridge` 对未认证 `/system/**` 返回 `401`，`StartupDiagnosticsUtil` 对关闭的 Studio 返回 `404 Not Found`（权限不足返回 `403`）；当 `demo-token-endpoint-enabled=false` 时 `POST /api/v1/auth/token` 返回 `404`。
- **异常脱敏与解包**：`ExceptionCauseUnwrapperUtil` 在服务端记录完整异常堆栈，同时仅向客户端返回安全的 `ApiResponse<Void>`。
- **SPA 与幂等头 CORS（`SecurityFilterChainBridge`）**：支持可配置源匹配（`*`）并放行 `Authorization`、`Idempotency-Key`、`X-Idempotency-Key`、`X-Language`、`X-Tenant-ID`、`traceparent` 与 `X-Request-ID`。

---

## 2. `@ServiceOverride` 逃生舱与标准 MVC 代码导出（`GET /system/studio/eject`）

当个别接口超出通用 CRUD 语义时：

1. **原地 `@ServiceOverride`**：在 `AutoApiController<E>` 方法上声明 `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`，`EscapeHatchDispatchHelper` 通过 `MethodHandleCacheUtil` 直接路由至自定义 Spring Bean。
2. **标准代码导出（`/system/studio/eject`）**：调用 `GET /system/studio/eject?target=<EntityOrControllerName>`，由 `ControllerEjectionHelper` 导出 5 个独立标准 Spring MVC 源文件（`DTO`、`Repository`、`Service`、`ServiceImpl`、`Controller`）。

---

## 3. Micrometer 可观测指标（`DynamicEntityMetricsHelper` & `MetricConstant` — 11 项指标）

| 指标名 | 类型 | 标签 | 监控范围 |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | 动态实体 CRUD 请求总次数 |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | 端到端执行耗时 |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | 动态代理控制器延迟 |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag 评估结果（`HIT` / `MISS`） |
| `nwvmc.outbox.pending.events` | Gauge | — | 事务 Outbox 待投递积压数 |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Outbox 批量投递耗时 |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | 熔断器状态码（`0=CLOSED`、`1=HALF_OPEN`、`2=OPEN`） |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | 超过滑动窗口限额被拒绝的请求数 |
| `framework.outbox.dispatched.total` | Counter | — | 已成功投递的 Outbox 事件累计总数 |
| `framework.realtime.active.connections` | Gauge | — | 活跃 SSE 推送连接数（`SseEmitterRegistryHelper`） |
| `framework.datasource.routing.total` | Counter | `datasource` | 按 Primary / Replica / Tenant 统计的数据源路由次数（按需启用） |

---

## 4. 20 语言 `/system/studio`、RTL 布局支持与宿主国际化（`i18n/`）

- **20 种内置语言环境（`I18nConstant`）**：`en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（`ar`、`fa`、`ur` 自动启用 `dir="rtl"`）。
- **确定性语言解析链（`LocaleResolutionUtil` & `HeaderLocaleResolver`）**：`?lang=` -> `X-Language` -> `NWVMC_LANG` Cookie -> `Accept-Language` -> `app.framework.i18n.default-locale`（`en`），未识别标签自动安全回退至 `en`。
- **宿主应用国际化扩展**：`I18nConfig` 配置 UTF-8 `ReloadableResourceBundleMessageSource`（`classpath:i18n/messages`，`cacheSeconds=3600`）；开启 `app.framework.studio.show-i18n-diagnostics=true` 可在 `/system/studio` 展示诊断栏。

---

## 5. JMH `1.37` 微基准吞吐量（`DynamicProxyThroughputBenchmarkTest`）

| 分发路径（`ops/ms`） | 实测平均吞吐量 |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
