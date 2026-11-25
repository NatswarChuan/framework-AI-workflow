# 04. Bezpieczeństwo, pamięć Multi-Cloud, `@ServiceOverride`, metryki i i18n w 20 językach (`0.1.0`)

> **Języki**: **Polski** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#security-rbac)

---

## 1. Bezpieczeństwo NIST Poziom 2, bazodanowy RBAC, blokada powierzchni i ochrona przed skanerami

- **`@EntitySecurity`, `@FieldSecurity` i `@MultiTenant`**: Deklaratywny RBAC na encjach (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, wsparcie meta-adnotacji), ochrona właściciela (`ownerField`), maskowanie lub zerowanie kolumn (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) oraz izolacja `@MultiTenant` fail-closed (`403` bez tenanta, nadpisywanie anty-spoofing przy tworzeniu i kontrola IDOR).
- **Dynamiczny RBAC w bazie danych (`DynamicDatabaseRbacProviderHelper`)**: Oznacz 4 encje JPA adnotacjami `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` i `@SecurityPolicyEntity` oraz ich znacznikami. Wymusza priorytet `DENY` > `ALLOW`, kontekst `X-Tenant-ID`, automatyczne unieważnianie L1 Caffeine przez `DatabaseRbacCacheInvalidationListener`, bezpieczne współistnienie z `SecurityFilterChain` przez `PureJavaSecurityFilterBridge` i rozszerzenia `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Domyślna blokada powierzchni (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Przy `app.framework.studio.enabled=false` (domyślnie) `SecurityExposurePolicyBridge` blokuje nieuwierzytelnione `/system/**` kodem `401`, a `StartupDiagnosticsUtil` zwraca `404 Not Found` (`403` bez roli admin); przy `demo-token-endpoint-enabled=false` wywołanie `POST /api/v1/auth/token` zwraca `404`.
- **Bezpieczne rozpakowywanie błędów**: `ExceptionCauseUnwrapperUtil` loguje pełną przyczynę po stronie serwera, zwracając klientowi bezpieczną odpowiedź `ApiResponse<Void>`.
- **CORS dla SPA i idempotentności (`SecurityFilterChainBridge`)**: Zezwala na konfigurowalne wzorce pochodzenia (`*`) wraz z nagłówkami `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` i `X-Request-ID`.

---

## 2. Furtka `@ServiceOverride` i eksport standardowego MVC (`GET /system/studio/eject`)

Gdy pojedynczy endpoint przerasta standardową semantykę CRUD:

1. **`@ServiceOverride` na miejscu**: Oznacz dowolną metodę w `AutoApiController<E>` adnotacją `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`, aby `EscapeHatchDispatchHelper` kierował wywołanie bezpośrednio przez `MethodHandleCacheUtil`.
2. **Eksport standardowego kodu (`/system/studio/eject`)**: Wywołaj `GET /system/studio/eject?target=<EntityOrControllerName>`, aby wygenerować 5 niezależnych plików Spring MVC (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) przez `ControllerEjectionHelper`.

---

## 3. Obserwowalność Micrometer (`DynamicEntityMetricsHelper` i `MetricConstant` — 11 metryk)

| Metryka | Typ | Tagi | Zakres |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Wywołania CRUD dynamicznych encji |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Opóźnienie wykonania end-to-end |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Opóźnienie dynamicznego kontrolera proxy |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Wynik ewaluacji ETag `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Oczekujące zdarzenia w transakcyjnym outboxie |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Opóźnienie wysyłki paczek outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Kod stanu (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Żądania odrzucone po przekroczeniu limitu okna przesuwnego |
| `framework.outbox.dispatched.total` | Counter | — | Łączna liczba pomyślnie wysłanych zdarzeń outbox |
| `framework.realtime.active.connections` | Gauge | — | Aktywne połączenia SSE (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Opcjonalny licznik routingu źródeł danych Primary / Replica / Tenant |

---

## 4. 20-językowe `/system/studio`, wsparcie RTL i lokalizacja aplikacji (`i18n/`)

- **20 wbudowanych języków (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` włączają `dir="rtl"`).
- **Deterministyczne rozpoznawanie języka (`LocaleResolutionUtil` i `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> ciasteczko `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Nieznane kody bezpiecznie wracają do `en`.
- **Dostosowanie w aplikacji hosta**: `I18nConfig` konfiguruje UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`); włączenie `app.framework.studio.show-i18n-diagnostics=true` pokazuje pasek diagnostyczny w `/system/studio`.

---

## 5. Przepustowość mikrobenchmarku JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Ścieżka wywołania (`ops/ms`) | Zmierzona średnia przepustowość |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
