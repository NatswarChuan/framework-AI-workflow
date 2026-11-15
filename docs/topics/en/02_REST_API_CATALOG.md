# 02. 38-Endpoint Catalog & Built-In Platform Controllers

> **Language**: English | [Tiếng Việt](../02_REST_API_CATALOG.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Complete 38-Contract `@Auto*` Interface Breakdown

Extending `AutoApiController<E>` triggers `DynamicControllerProxyRegistrarHelper` and `SpringMvcEndpointBridge` to bind **38 endpoint contracts** (**36** visible by default in Swagger UI and `/system/studio`; `/events` carries `@Hidden` and `/{id}/**` is opt-in via `enableNestedSubResources`).

### 1.1 Read, Analytics, Streaming & Schema (`AutoApiReadController<E>` — 15 Endpoints)

| # | HTTP | Path | Method Name | Technical Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/` | `getPage` | Offset pagination (`page`, `size`), `sort`, `dir`, `search`, `fields`, 13 filter operators |
| 2 | `GET` | `/keyset` | `getKeysetPage` | O(1) cursor pagination using monotonic UUIDv7 `afterId` |
| 3 | `GET` | `/all` | `getAll` | Filtered full collection query |
| 4 | `GET` | `/count` | `count` | `Long` count matching active criteria |
| 5 | `GET` | `/exists` | `exists` | `Boolean` existence predicate |
| 6 | `GET` | `/aggregate` | `aggregate` | Executes `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` against `field` |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Distinct scalar values for `field` |
| 8 | `GET` | `/top` | `findTopRecords` | Bounded top-N records (`limit`, `sort`, `dir`) |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Bucketed analytics grouped by `groupField` over `valueField` |
| 10 | `GET` | `/export/csv` | `exportCsv` | O(1)-memory chunked RFC-4180 CSV stream |
| 11 | `GET` | `/export/jsonl` | `exportJsonl` | O(1)-memory NDJSON (`application/x-ndjson`) stream |
| 12 | `GET` | `/metadata` | `getMetadata` | Field descriptors and active `@StateMachine` definition |
| 13 | `GET` | `/schema/typescript` | `generateTypeScript` | Dynamic TypeScript `interface` generation |
| 14 | `GET` | `/schema/json` | `getJsonSchema` | Dynamic JSON Schema Draft-07 generation |
| 15 | `GET` | `/{id}` | `getById` | Single UUIDv7 lookup with `include` eager graph & `@FieldSecurity` masking |

### 1.2 Write, Upsert & Chunked Batch (`AutoApiController<E>` — 11 Endpoints)

| # | HTTP | Path | Method Name | Technical Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `/` | `create` | Validates payload and applies `@UniqueField`, `@AutoCode`, `@AutoSlug`, `@ComputedField` |
| 17 | `POST` | `/batch` | `createBatch` | Single-transaction list insert |
| 18 | `POST` | `/upsert` | `upsert` | Updates on `@UniqueField` match or inserts otherwise |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Batch upsert collection |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Slices payloads across `chunkSize` (default `100`) commits |
| 21 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Atomic numeric delta (`?field=...&delta=...`) |
| 22 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Bulk partial updates for filter matches |
| 23 | `PUT` | `/{id}` | `update` | Full replacement by UUIDv7 `id` |
| 24 | `PATCH` | `/{id}` | `patch` | Partial attribute patch |
| 25 | `DELETE` | `/{id}` | `deleteById` | Soft-delete guarded by `@StateMachine.deletableStates` |
| 26 | `POST` | `/{id}/restore` | `restoreById` | Restores soft-deleted entity |

### 1.3 Workflow, AI, Bulk Import, Diff & Sub-Resources (`AutoApiEnterpriseController<E>` — 12 Endpoints)

| # | HTTP | Path | Method Name | Technical Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Validates `?targetState=...` against `@StateMachine` (`HTTP 422` if disallowed) |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Clones record with fresh UUIDv7 and `@AutoCode` |
| 29 | `GET` | `/events` | `streamEvents` | Real-time SSE stream (`@Hidden` from Swagger UI) |
| 30 | `GET` | `/ai/context` | `getAiContext` | Structured schema context for Spring AI `ChatClient` |
| 31 | `POST` | `/ai/query` | `queryAi` | Safe Criteria-backed natural language query execution |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Active parsed `@HumanPolicy` / YAML policy view |
| 33 | `GET` | `/health` | `getEntityHealth` | Entity circuit breaker health telemetry |
| 34 | `POST` | `/import/csv` | `importCsv` | Streaming multipart RFC-4180 CSV import |
| 35 | `POST` | `/import/jsonl` | `importJsonl` | Streaming NDJSON bulk import |
| 36 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Applies RFC 6902 JSON Patch operations (`add`/`replace`/`remove`) |
| 37 | `GET` | `/{id}/diff` | `compareEntityDiff` | Compares `{id}` against `?targetId={uuid}` (`MODIFIED`, `ADDED`, `REMOVED`) |
| 38 | `GET` | `/{id}/**` | `navigateSubResources` | Recursive relation traversal (requires `enableNestedSubResources=true`) |

---

## 2. Built-In Platform Controllers

| Route | Controller | Operational Notes |
| :--- | :--- | :--- |
| `/system/studio` (`@Hidden`) | `DevStudioController` | 20-language Live API Studio (active only when `app.framework.studio.enabled=true`) |
| `POST /api/v1/auth/token` | `AuthController` | Demo JWT issuer (active only when `demo-token-endpoint-enabled=true`) |
| `/api/v1/storage/*` (6 APIs) | `FileStorageController` | Upload, download, metadata, delete, presigned URL, exists (`LOCAL`/`S3`/`GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `POST /graphql`, `GET /graphql/schema`, `GET /graphql/explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Historical entity snapshot reconstruction at `?timestamp=...` |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Registered SPI Customizer Bean inventory |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Entity circuit breaker telemetry |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Primary/Replica datasource pool health |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Active `X-Request-ID` / `traceparent` MDC context |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Standardizes Tomcat `400/404/405/413/431/500` responses into `ApiResponse<Void>` |
