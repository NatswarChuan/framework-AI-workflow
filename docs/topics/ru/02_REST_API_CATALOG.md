# 02. Каталог 40 автогенерируемых REST-контрактов и системных контроллеров (`0.1.0`)

> **Языки**: **Русский** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#endpoints)

---

## 1. 40 составных `@Auto*`-контрактов на сущность (`38` доступны по умолчанию)

Наследование `AutoApiController<E>` (или выборочная композиция `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) запускает `DynamicControllerProxyRegistrarHelper` и `SpringMvcEndpointBridge`, регистрируя до **40** контрактов (`15` чтения + `10` записи/пакетов + `11` корпоративных + `4` экспорта/импорта; **`38`** отображаются по умолчанию в Swagger UI, так как `/events` скрыт `@Hidden`, а `/{id}/**` требует `enableNestedSubResources = true`). Поддерживаются `@AutoRestController(readDto, createDto, updateDto)` и `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Группа 1: Чтение, аналитика и генерация клиентов (`AutoApiReadController` — 15 контрактов)

| # | HTTP | Подпуть | Метод | Поведение |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Постраничная выборка с поддержкой 13 операторов фильтрации, многополевой сортировки, жадной загрузки связей и выборки полей. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Курсорная пагинация по UUIDv7 за O(1) без деградации при глубоком сканировании SQL OFFSET. |
| 3 | `GET` | `/all` | `getAll` | Возвращает все записи, соответствующие динамическим фильтрам, для выпадающих списков и справочников. |
| 4 | `GET` | `/count` | `count` | Выполняет SQL COUNT(*) с учётом динамических предикатов фильтрации. |
| 5 | `GET` | `/exists` | `exists` | Быстрая логическая проверка, возвращающая true при наличии хотя бы одной подходящей записи. |
| 6 | `GET` | `/aggregate` | `aggregate` | Вычисляет SQL SUM, AVG, MIN, MAX и COUNT по числовым полям. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Возвращает уникальные значения без дубликатов для фасетных фильтров. |
| 8 | `GET` | `/top` | `findTopRecords` | Возвращает первые N отсортированных сущностей для рейтингов и уведомлений. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Динамическая агрегация GROUP BY для графиков и BI-отчётности. |
| 10 | `GET` | `/metadata` | `getMetadata` | Предоставляет метаданные полей JPA, ограничений Jakarta Validation и прав RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Генерирует готовые интерфейсы TypeScript напрямую из полей JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Формирует контракты JSON Schema Draft для генераторов форм. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Синтезирует схему валидации Zod через ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Генерирует типизированный клиентский модуль TypeScript Fetch с разбором Zod и методами CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Загружает одну сущность по UUIDv7 с маскированием @FieldSecurity и ETag-кэшированием @HttpCacheable. |

### Группа 2: Запись, пакеты, Upsert, Patch, удаление и восстановление (`AutoWriteApi` + `AutoBatchApi` — 10 контрактов)

| # | HTTP | Подпуть | Метод | Поведение |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Создаёт сущность с валидацией, @AutoCode, @AutoSlug, проверкой @UniqueField и расчётом @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Сохраняет провалидированную коллекцию в рамках единой атомарной транзакции. |
| 18 | `POST` | `/upsert` | `upsert` | Атомарно добавляет или обновляет запись по ключам @UniqueField или явному UUIDv7 ID. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Выполняет транзакционный пакетный upsert для массива записей. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Обрабатывает крупные пакеты настраиваемыми чанками и возвращает поэлементную диагностику BatchExecutionResultDto. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Частично обновляет все записи по фильтрам URL, используя ненулевые поля из тела запроса. |
| 22 | `PUT` | `/{id}` | `update` | Полное обновление сущности с сохранением серверных столбцов аудита. |
| 23 | `PATCH` | `/{id}` | `patch` | Частичное слияние, переносящее только ненулевые входящие атрибуты на существующую сущность. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Выполняет мягкое удаление после проверки @EntitySecurity deleteRoles и @StateMachine deletableStates. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Восстанавливает ранее мягко удалённую сущность обратно в активные выборки. |

### Группа 3: Корпоративный жизненный цикл, ИИ, RFC 6902 и стриминг (`AutoApiEnterpriseController` — 11 контрактов)

| # | HTTP | Подпуть | Метод | Поведение |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Атомарно применяет положительную или отрицательную дельту без гонок read-modify-write на клиенте. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Выполняет проверенный переход @StateMachine к targetState и отправляет события аудита и webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Дублирует сущность с выдачей нового UUIDv7 ID и перегенерацией полей @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Поток Server-Sent Events (SSE) в реальном времени (@Hidden в Swagger UI из-за MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Экспортирует JSON-схемы инструментов LLM с описанием полей и операторов фильтрации. |
| 31 | `POST` | `/ai/query` | `queryAi` | Преобразует запросы на естественном языке в ограниченные параметризованные JPA Criteria-запросы. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Возвращает скомпилированные правила @HumanPolicy, роли RBAC и переопределения YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Проверяет состояние таблицы базы данных и число записей по каждой сущности. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Применяет структурированные операции RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Вычисляет попольные различия между двумя записями сущности (id против targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Рекурсивная навигация по связям (включается через @AutoRestController(enableNestedSubResources = true)). |

### Группа 4: Массовый экспорт и импорт CSV и JSONL (`AutoExportImportApi` — 4 контракта)

| # | HTTP | Подпуть | Метод | Поведение |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Экспортирует отфильтрованные сущности в формате RFC-4180 CSV. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Потоково отдаёт подходящие строки в формате построчного JSON (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Импортирует сырой текст RFC-4180 CSV пакетными чанками. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Импортирует потоковые наборы данных NDJSON с построчным разделением. |

---

## 2. Встроенные системные контроллеры

| Эндпоинт / Префикс | Контроллер | Назначение и защита продакшена |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20-языковая Developer Studio (RTL `ar`, `fa`, `ur`); возвращает `401` при `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Экспортирует стандартный код Spring MVC (Controller/Service/Repository); защищён `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Выпускает демонстрационный HMAC-SHA512 JWT; возвращает `404` при `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Восстановление состояния сущности на момент времени ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Инспекция активных SPI-бинов по `7` группам телеметрии `*Customizer` (`StorageCustomizer` через `StorageCustomizerRegistryHelper`, всего `8` SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Метрики состояния выключателей Resilience4j в реальном времени |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Проверка состояния нескольких источников данных |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Активный контекст MDC: W3C `traceparent` и UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Преобразует контейнерные ошибки Tomcat `400/404/405/413/431/500` в единый `ApiResponse<Void>` |
