# 04. Security, Multi-Cloud Storage, `@ServiceOverride`, Metrics & 20-Language i18n (`0.1.0`)

> **Languages**: **English** | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [All 20 Languages](../README.md) | [Complete Manual](../../GUIDE_EN.md) | [20-Language Interactive Portal](../../index.html#security-rbac)

---

## 1. NIST Level 2 Security, Database-Driven RBAC, Surface Lockdown & Anti-Scanner Protection

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: Declarative table RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, also composable via custom meta-annotations such as `@AuditedRecordSecurity`), ownership guards (`ownerField`), column masking/nullification (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), and fail-closed `@MultiTenant` isolation (`403` when unbound, anti-spoofing overwrite on create, and IDOR checks across single-ID endpoints).
- **Database-Driven RBAC (`DynamicDatabaseRbacProviderHelper`)**: Annotate 4 domain JPA entities with `@SecurityRoleEntity` (`@RoleCode`, `@RoleName`, `@RolePermissions`), `@SecurityPermissionEntity` (`@PermissionCode`, `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`), `@SecurityUserRoleEntity` (`@UserRoleSubject`, `@UserRoleCode`, `@UserRoleTenantId`), and `@SecurityPolicyEntity` (`@PolicyResource`, `@PolicyAction`, `@PolicyAllowedRoles`, `@PolicyEffect`). Enforces explicit `DENY` > `ALLOW` priority, tenant `X-Tenant-ID` context, automatic L1 Caffeine snapshot invalidation via `DatabaseRbacCacheInvalidationListener`, non-destructive `SecurityFilterChain` coexistence via `PureJavaSecurityFilterBridge`, and custom authority augmentation / voting via `SecurityIdentityCustomizer`. Controlled via `app.framework.security.dynamic-database-rbac-enabled=true`.
- **Secure-by-Default Surface Lockdown (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: When `app.framework.studio.enabled=false` (default), `SecurityExposurePolicyBridge` blocks unauthenticated `/system/**` calls with HTTP `401`, and `StartupDiagnosticsUtil` rejects disabled Studio surfaces with HTTP `404 Not Found` (`403` when lacking admin scope); when `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` returns HTTP `404 Not Found`.
- **Error Unwrapping & Sanitization**: `ExceptionCauseUnwrapperUtil` logs full internal causes server-side while returning sanitized `ApiResponse<Void>` responses to callers.
- **SPA & Idempotency CORS (`SecurityFilterChainBridge`)**: Permits configurable origin patterns (`*`) with `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, and `X-Request-ID`.

---

## 2. `@ServiceOverride` Escape Hatch & Standard MVC Ejection (`GET /system/studio/eject`)

When individual endpoints outgrow dynamic CRUD semantics:

1. **In-Place `@ServiceOverride`**: Annotate any method on an `AutoApiController<E>` interface with `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` so `EscapeHatchDispatchHelper` routes invocation directly via `MethodHandleCacheUtil`.
2. **Standard Code Ejection (`/system/studio/eject`)**: Invoke `GET /system/studio/eject?target=<EntityOrControllerName>` to export 5 standalone Spring MVC files (`DTO`, `Repository`, `Service`, `ServiceImpl`, and `Controller`) via `ControllerEjectionHelper`.

---

## 3. Micrometer Observability (`DynamicEntityMetricsHelper` & `MetricConstant` — 11 Metrics)

| Metric | Type | Tags | Scope |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Dynamic entity CRUD invocations |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | End-to-end execution latency |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Dynamic proxy controller latency |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag evaluation outcome |
| `nwvmc.outbox.pending.events` | Gauge | — | Queued transactional outbox backlog |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Outbox batch dispatch latency |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | State code (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Rejected requests exceeding sliding-window quota |
| `framework.outbox.dispatched.total` | Counter | — | Cumulative successfully dispatched outbox events |
| `framework.realtime.active.connections` | Gauge | — | Live SSE emitter connections (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Opt-in routing helper counter (`DynamicEntityMetricsHelper.recordDataSourceRouting`) by Primary / Replica / Tenant |

---

## 4. 20-Language `/system/studio`, RTL Support & Host Localization (`i18n/`)

- **20 Built-In Locales (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` enable `dir="rtl"`).
- **Deterministic Locale Resolution (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: `?lang=` query param -> `X-Language` header -> `NWVMC_LANG` cookie -> `Accept-Language` header -> `app.framework.i18n.default-locale` (`en`). Unrecognized locale tags fall back safely to `en`.
- **Host Application Customization**: `I18nConfig` configures UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`). Enabling `app.framework.studio.show-i18n-diagnostics=true` displays `#studioI18nDiagBar` inside `/system/studio` with active locale, text direction, and missing-key diagnostics.

---

## 5. JMH `1.37` Microbenchmark Throughput (`DynamicProxyThroughputBenchmarkTest`)

| Dispatch Path (`ops/ms`) | Measured Mean Throughput |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
