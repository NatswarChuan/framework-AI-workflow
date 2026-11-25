# 04. Sicurezza, Storage Multi-Cloud, `@ServiceOverride`, Metriche e i18n in 20 Lingue (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#security-rbac)

---

## 1. Sicurezza NIST Livello 2, RBAC su Database, Blocco Superficie e Difesa Anti-Scanner

- **`@EntitySecurity`, `@FieldSecurity` e `@MultiTenant`**: RBAC dichiarativo per tabella (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, componibile tramite meta-annotazioni), controllo proprietà (`ownerField`), mascheramento/azzeramento colonne (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) e isolamento `@MultiTenant` fail-closed (`403` senza tenant, sovrascrittura anti-spoofing in creazione e controlli IDOR sugli endpoint per ID).
- **RBAC Dinamico su Database (`DynamicDatabaseRbacProviderHelper`)**: Annota 4 entità JPA con `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` e `@SecurityPolicyEntity` e relativi marker. Impone precedenza esplicita `DENY` > `ALLOW`, contesto `X-Tenant-ID`, invalidazione automatica L1 Caffeine tramite `DatabaseRbacCacheInvalidationListener`, coesistenza non distruttiva con `SecurityFilterChain` via `PureJavaSecurityFilterBridge` ed estensione via `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Blocco Sicuro di Default (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Con `app.framework.studio.enabled=false` (default), `SecurityExposurePolicyBridge` blocca `/system/**` non autenticati con `401` e `StartupDiagnosticsUtil` restituisce `404 Not Found` (`403` senza ruolo admin); con `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` restituisce `404`.
- **Unwrapping e Sanitizzazione Errori**: `ExceptionCauseUnwrapperUtil` registra la causa completa sul server restituendo risposte `ApiResponse<Void>` sanitizzate al client.
- **CORS SPA e Idempotenza (`SecurityFilterChainBridge`)**: Consente pattern di origine configurabili (`*`) con `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` e `X-Request-ID`.

---

## 2. Escape Hatch `@ServiceOverride` ed Eiezione MVC Standard (`GET /system/studio/eject`)

Quando un singolo endpoint supera la semantica CRUD dinamica:

1. **`@ServiceOverride` In-Place**: Annota qualsiasi metodo di `AutoApiController<E>` con `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` per delegare direttamente tramite `EscapeHatchDispatchHelper` e `MethodHandleCacheUtil`.
2. **Eiezione Codice Standard (`/system/studio/eject`)**: Invoca `GET /system/studio/eject?target=<EntityOrControllerName>` per esportare 5 file Spring MVC autonomi (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) tramite `ControllerEjectionHelper`.

---

## 3. Osservabilità Micrometer (`DynamicEntityMetricsHelper` e `MetricConstant` — 11 Metriche)

| Metrica | Tipo | Tag | Ambito |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Invocazioni CRUD delle entità dinamiche |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Latenza di esecuzione end-to-end |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latenza del controller proxy dinamico |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Esito valutazione ETag di `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Eventi in coda nell’outbox transazionale |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Latenza di spedizione batch dell’outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Codice stato (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Richieste rifiutate per superamento della quota a finestra mobile |
| `framework.outbox.dispatched.total` | Counter | — | Totale cumulativo degli eventi outbox consegnati con successo |
| `framework.realtime.active.connections` | Gauge | — | Connessioni SSE attive (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Contatore opzionale di routing per datasource Primary / Replica / Tenant |

---

## 4. `/system/studio` in 20 Lingue, Supporto RTL e Localizzazione Host (`i18n/`)

- **20 Lingue Integrate (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` attivano `dir="rtl"`).
- **Risoluzione Deterministica della Lingua (`LocaleResolutionUtil` e `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Tag non riconosciuti ripiegano in sicurezza su `en`.
- **Personalizzazione Applicazione Host**: `I18nConfig` configura `ReloadableResourceBundleMessageSource` UTF-8 (`classpath:i18n/messages`, `cacheSeconds=3600`); attivando `app.framework.studio.show-i18n-diagnostics=true` compare la barra diagnostica in `/system/studio`.

---

## 5. Throughput Microbenchmark JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Percorso di Dispatch (`ops/ms`) | Throughput Medio Misurato |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
