# 04. Seguridad, Almacenamiento Multi-Cloud, `@ServiceOverride`, Métricas e i18n en 20 Idiomas (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Los 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#security-rbac)

---

## 1. Seguridad NIST Nivel 2, RBAC Dinámico en BD, Bloqueo de Superficie y Protección Anti-Escáner

- **`@EntitySecurity`, `@FieldSecurity` y `@MultiTenant`**: RBAC declarativo por entidad (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, componible con meta-anotaciones), control de propiedad (`ownerField`), enmascaramiento o nulificación de columnas (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) y aislamiento `@MultiTenant` fail-closed (`403` sin tenant, sobrescritura anti-suplantación al crear y defensa IDOR en rutas por ID).
- **RBAC Dinámico en Base de Datos (`DynamicDatabaseRbacProviderHelper`)**: Anote 4 entidades JPA con `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` y `@SecurityPolicyEntity` más sus marcadores. Aplica precedencia explícita `DENY` > `ALLOW`, contexto `X-Tenant-ID`, invalidación automática L1 Caffeine vía `DatabaseRbacCacheInvalidationListener`, convivencia no destructiva con `SecurityFilterChain` mediante `PureJavaSecurityFilterBridge` y extensión con `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Bloqueo Seguro por Defecto (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Con `app.framework.studio.enabled=false` (defecto), `SecurityExposurePolicyBridge` bloquea `/system/**` sin autenticar con `401` y `StartupDiagnosticsUtil` devuelve `404 Not Found` (`403` sin rol admin); con `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` devuelve `404`.
- **Desempaquetado y Saneamiento de Errores**: `ExceptionCauseUnwrapperUtil` registra la causa raíz en el servidor y devuelve al cliente respuestas `ApiResponse<Void>` saneadas.
- **CORS para SPA e Idempotencia (`SecurityFilterChainBridge`)**: Permite patrones de origen configurables (`*`) con cabeceras `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` y `X-Request-ID`.

---

## 2. Vía de Escape `@ServiceOverride` y Extracción MVC Estándar (`GET /system/studio/eject`)

Cuando un endpoint concreto supera la semántica CRUD dinámica:

1. **`@ServiceOverride` In-Place**: Anote cualquier método de `AutoApiController<E>` con `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` para que `EscapeHatchDispatchHelper` redirija la invocación mediante `MethodHandleCacheUtil`.
2. **Extracción de Código Estándar (`/system/studio/eject`)**: Invoque `GET /system/studio/eject?target=<EntityOrControllerName>` para exportar 5 archivos Spring MVC independientes (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) vía `ControllerEjectionHelper`.

---

## 3. Observabilidad Micrometer (`DynamicEntityMetricsHelper` y `MetricConstant` — 11 Métricas)

| Métrica | Tipo | Etiquetas | Alcance |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Invocaciones CRUD de entidades dinámicas |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Latencia de ejecución de extremo a extremo |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latencia del controlador proxy dinámico |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Resultado de evaluación ETag de `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Eventos pendientes en el outbox transaccional |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Latencia de despacho por lotes del outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Código de estado (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Peticiones rechazadas por superar la cuota de ventana deslizante |
| `framework.outbox.dispatched.total` | Counter | — | Total acumulado de eventos outbox despachados con éxito |
| `framework.realtime.active.connections` | Gauge | — | Conexiones SSE activas (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Contador opcional de enrutamiento por datasource Primary / Replica / Tenant |

---

## 4. `/system/studio` en 20 Idiomas, Soporte RTL y Localización del Host (`i18n/`)

- **20 Idiomas Integrados (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` activan `dir="rtl"`).
- **Resolución Determinista de Idioma (`LocaleResolutionUtil` y `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Etiquetas desconocidas recurren de forma segura a `en`.
- **Personalización en la Aplicación Host**: `I18nConfig` configura `ReloadableResourceBundleMessageSource` en UTF-8 (`classpath:i18n/messages`, `cacheSeconds=3600`). Activar `app.framework.studio.show-i18n-diagnostics=true` muestra la barra de diagnóstico en `/system/studio`.

---

## 5. Rendimiento Microbenchmark JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Ruta de Despacho (`ops/ms`) | Rendimiento Medio Medido |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. Almacenamiento Multi-Cloud (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

`FileStorageController` (`/api/v1/storage/*`) expone `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` y `POST /presigned-url` mediante `app.framework.storage.provider` (`LOCAL`/`S3`/`GCS`) y `StorageCustomizer`.

> **Endurecimiento en Producción:** Active `app.framework.security.require-authenticated-api-paths: true` y proteja `/api/v1/storage/**` en su `SecurityFilterChain` antes de exponerlo.
