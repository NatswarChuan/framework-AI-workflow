# 04. Sicherheit, Multi-Cloud-Storage, `@ServiceOverride`, Metriken & 20-Sprachen-i18n (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#security-rbac)

---

## 1. NIST-Level-2-Sicherheit, DB-gestütztes RBAC, Oberflächen-Lockdown & Anti-Scanner-Schutz

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: Deklaratives Tabellen-RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, auch per Meta-Annotation kombinierbar), Eigentümerschutz (`ownerField`), Spaltenmaskierung/-nullifizierung (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) sowie Fail-Closed-`@MultiTenant`-Isolation (`403` ohne Tenant, Anti-Spoofing beim Erstellen und IDOR-Prüfungen bei Einzel-ID-Endpunkten).
- **Datenbankgestütztes dynamisches RBAC (`DynamicDatabaseRbacProviderHelper`)**: Annotieren Sie 4 JPA-Entitäten mit `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` und `@SecurityPolicyEntity` samt Markern. Erzwingt explizite `DENY` > `ALLOW`-Priorität, `X-Tenant-ID`-Kontext, automatische L1-Caffeine-Invalidierung via `DatabaseRbacCacheInvalidationListener`, konfliktfreie `SecurityFilterChain`-Koexistenz via `PureJavaSecurityFilterBridge` und Erweiterung über `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Secure-by-Default-Lockdown (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Bei `app.framework.studio.enabled=false` (Standard) blockiert `SecurityExposurePolicyBridge` unauthentifizierte `/system/**`-Aufrufe mit `401` und deaktivierte Studio-Flächen mit `404 Not Found` (`403` ohne Admin-Rechte); bei `demo-token-endpoint-enabled=false` liefert `POST /api/v1/auth/token` `404`.
- **Fehlerbereinigung & Unwrapping**: `ExceptionCauseUnwrapperUtil` protokolliert vollständige Ursachen serverseitig und liefert dem Client bereinigte `ApiResponse<Void>`-Antworten.
- **SPA- & Idempotenz-CORS (`SecurityFilterChainBridge`)**: Erlaubt konfigurierbare Origin-Muster (`*`) samt `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` und `X-Request-ID`.

---

## 2. `@ServiceOverride`-Escape-Hatch & Standard-MVC-Export (`GET /system/studio/eject`)

Wenn einzelne Endpunkte über dynamisches CRUD hinauswachsen:

1. **In-Place `@ServiceOverride`**: Annotieren Sie eine Methode in `AutoApiController<E>` mit `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`, damit `EscapeHatchDispatchHelper` direkt via `MethodHandleCacheUtil` delegiert.
2. **Standard-Code-Ejection (`/system/studio/eject`)**: Mit `GET /system/studio/eject?target=<EntityOrControllerName>` exportiert `ControllerEjectionHelper` 5 eigenständige Spring-MVC-Dateien (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`).

---

## 3. Micrometer-Observability (`DynamicEntityMetricsHelper` & `MetricConstant` — 11 Metriken)

| Metrik | Typ | Tags | Messbereich |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Aufrufe dynamischer Entitäts-CRUD-Operationen |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Ende-zu-Ende-Ausführungslatenz |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latenz des dynamischen Proxy-Controllers |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable`-ETag-Auswertung (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Ausstehende Ereignisse in der Transactional Outbox |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Versandlatenz von Outbox-Batches |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Statuscode (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Abgelehnte Anfragen bei Überschreitung des Sliding-Window-Limits |
| `framework.outbox.dispatched.total` | Counter | — | Kumulativ erfolgreich versendete Outbox-Ereignisse |
| `framework.realtime.active.connections` | Gauge | — | Aktive SSE-Verbindungen (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Optionaler Routing-Zähler je Primary / Replica / Tenant-Datasource |

---

## 4. 20-Sprachen-`/system/studio`, RTL-Support & Host-Lokalisierung (`i18n/`)

- **20 integrierte Sprachen (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` aktivieren `dir="rtl"`).
- **Deterministische Locale-Auflösung (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG`-Cookie -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Unbekannte Sprachcodes fallen sicher auf `en` zurück.
- **Anpassung in der Host-Anwendung**: `I18nConfig` richtet UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`) ein; `app.framework.studio.show-i18n-diagnostics=true` blendet die Diagnoseleiste in `/system/studio` ein.

---

## 5. JMH-`1.37`-Microbenchmark-Durchsatz (`DynamicProxyThroughputBenchmarkTest`)

| Dispatch-Pfad (`ops/ms`) | Gemessener mittlerer Durchsatz |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
