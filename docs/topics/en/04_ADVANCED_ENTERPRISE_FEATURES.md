# 04. Security, Multi-Cloud Storage, `@ServiceOverride`, Metrics & 20-Language i18n (`1.0.0`)

> **Language**: English | [Tiếng Việt](../04_ADVANCED_ENTERPRISE_FEATURES.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. NIST Level 2 Security, Surface Lockdown & Anti-Scanner Protection

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: Declarative table RBAC (`readRoles`, `writeRoles`, `deleteRoles`), ownership guards (`ownerField`), column masking/nullification (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), and multi-tenant isolation (`tenantField`).
- **Secure-by-Default Surface Lockdown (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: When `app.framework.studio.enabled=false` (default), `/system/studio` and `/system/studio/eject` return HTTP `401 Unauthorized`; when `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` returns HTTP `404 Not Found`.
- **Anti-Fingerprinting & Error Masking**: `hide-framework-fingerprint=true` suppresses technical version badges, while `ExceptionCauseUnwrapperUtil` logs full internal causes server-side and returns sanitized `ApiResponse<Void>` responses to callers.
- **SPA & Idempotency CORS (`SecurityFilterChainBridge`)**: Permits configurable origin patterns (`*`) with `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, and `X-Request-ID`.

---

## 2. `@ServiceOverride` Escape Hatch & Standard MVC Ejection (`GET /system/studio/eject`)

When individual endpoints outgrow dynamic CRUD semantics:

1. **In-Place `@ServiceOverride`**: Annotate any method on an `AutoApiController<E>` interface with `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` so `EscapeHatchDispatchHelper` routes invocation directly via `MethodHandleCacheUtil`.
2. **Standard Code Ejection (`/system/studio/eject`)**: Invoke `GET /system/studio/eject?target=<EntityOrControllerName>` to export decoupled Spring MVC `Controller`, `Service`, `ServiceImpl`, and `Repository` code via `ControllerEjectionHelper`.

---

## 3. Micrometer Observability (`DynamicEntityMetricsHelper` & `MetricConstant`)

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
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant routing counts |

---

## 4. 20-Language `/system/studio`, RTL Support & Host Localization (`i18n/`)

- **20 Built-In Locales (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` enable `dir="rtl"`).
- **Deterministic Locale Resolution (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: `?lang=` query param -> `NWVMC_LANG` cookie -> `X-Language` header -> `Accept-Language` header -> `app.framework.i18n.default-locale` (`en`). Unrecognized locale tags fall back safely to `en`.
- **Host Application Customization**: `I18nConfig` configures UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`). Enabling `app.framework.studio.show-i18n-diagnostics=true` displays `#studioI18nDiagBar` inside `/system/studio` with active locale, text direction, and missing-key diagnostics.

---

## 5. JMH `1.37` Microbenchmark Throughput (`DynamicProxyThroughputBenchmarkTest`)

| Dispatch Path (`ops/ms`) | Measured Mean Throughput |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |
