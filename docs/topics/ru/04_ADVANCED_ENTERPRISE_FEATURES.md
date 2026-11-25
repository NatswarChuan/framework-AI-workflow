# 04. Безопасность, мультиоблачное хранилище, `@ServiceOverride`, метрики и i18n на 20 языках (`0.1.0`)

> **Языки**: **Русский** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#security-rbac)

---

## 1. Безопасность NIST Level 2, RBAC в БД, блокировка поверхностей и защита от сканеров

- **`@EntitySecurity`, `@FieldSecurity` и `@MultiTenant`**: Декларативный табличный RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, поддержка композитных мета-аннотаций), защита владельца (`ownerField`), маскирование/обнуление столбцов (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) и fail-closed изоляция `@MultiTenant` (`403` без арендатора, защита от подмены при создании и проверки IDOR).
- **Динамический RBAC на основе БД (`DynamicDatabaseRbacProviderHelper`)**: Разметьте 4 JPA-сущности аннотациями `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` и их маркерами. Обеспечивает приоритет `DENY` > `ALLOW`, контекст `X-Tenant-ID`, автоинвалидацию L1 Caffeine через `DatabaseRbacCacheInvalidationListener`, безопасное сосуществование с `SecurityFilterChain` через `PureJavaSecurityFilterBridge` и расширение через `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Безопасная блокировка по умолчанию (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: При `app.framework.studio.enabled=false` (по умолчанию) `SecurityExposurePolicyBridge` блокирует неаутентифицированные запросы `/system/**` кодом `401`, а отключённая Studio возвращает `404 Not Found` (`403` без прав администратора); при `demo-token-endpoint-enabled=false` вызов `POST /api/v1/auth/token` возвращает `404`.
- **Распаковка и санитайзинг ошибок**: `ExceptionCauseUnwrapperUtil` записывает полную первопричину в серверные логи, возвращая клиенту очищенный `ApiResponse<Void>`.
- **CORS для SPA и идемпотентности (`SecurityFilterChainBridge`)**: Разрешает настраиваемые шаблоны origin (`*`) вместе с `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` и `X-Request-ID`.

---

## 2. Механизм обхода `@ServiceOverride` и экспорт стандартного MVC (`GET /system/studio/eject`)

Когда отдельный эндпоинт выходит за рамки динамического CRUD:

1. **Точечный `@ServiceOverride`**: Пометьте любой метод `AutoApiController<E>` аннотацией `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`, чтобы `EscapeHatchDispatchHelper` вызывал пользовательский Spring-бин через `MethodHandleCacheUtil`.
2. **Экспорт стандартного кода (`/system/studio/eject`)**: Вызовите `GET /system/studio/eject?target=<EntityOrControllerName>` для выгрузки 5 автономных файлов Spring MVC (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) через `ControllerEjectionHelper`.

---

## 3. Наблюдаемость Micrometer (`DynamicEntityMetricsHelper` и `MetricConstant` — 11 метрик)

| Метрика | Тип | Теги | Область измерения |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Суммарное число CRUD-вызовов динамических сущностей |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Сквозная задержка выполнения |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Задержка динамического прокси-контроллера |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Результат проверки ETag `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Очередь ожидающих событий транзакционного outbox |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Задержка пакетной отправки outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Код состояния (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Число отклонённых запросов при превышении лимита скользящего окна |
| `framework.outbox.dispatched.total` | Counter | — | Общее число успешно доставленных outbox-событий |
| `framework.realtime.active.connections` | Gauge | — | Активные SSE-подключения (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Опциональный счётчик маршрутизации по Primary / Replica / Tenant |

---

## 4. `/system/studio` на 20 языках, поддержка RTL и локализация приложения (`i18n/`)

- **20 встроенных локалей (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` включают `dir="rtl"`).
- **Детерминированный выбор языка (`LocaleResolutionUtil` и `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Неизвестные теги безопасно откатываются к `en`.
- **Настройка в хост-приложении**: `I18nConfig` настраивает UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`); включение `app.framework.studio.show-i18n-diagnostics=true` отображает панель диагностики в `/system/studio`.

---

## 5. Пропускная способность микробенчмарка JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Путь диспетчеризации (`ops/ms`) | Измеренная средняя пропускная способность |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
