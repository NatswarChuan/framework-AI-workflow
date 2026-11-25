# 02. Catalog of 40 Auto-Generated REST Contracts & Platform Controllers (`0.1.0`)

> **Language**: English | [Tiếng Việt](../02_REST_API_CATALOG.md) | [Complete Manual](../../GUIDE_EN.md)

---

## 1. 40 Composable `@Auto*` Contracts per Entity (`38` Exposed by Default)

Extending `AutoApiController<E>` (or selectively composing `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) triggers `DynamicControllerProxyRegistrarHelper` and `SpringMvcEndpointBridge` to bind up to **40** contracts (`15` Read in `AutoApiReadController` + `10` Write/Batch in `AutoWriteApi`/`AutoBatchApi` + `11` Enterprise in `AutoApiEnterpriseController` + `4` Export/Import in `AutoExportImportApi`; **`38`** visible by default in Swagger UI and `/system/studio` badge because `/events` is `@Hidden` and `/{id}/**` requires `enableNestedSubResources = true`). Supports `@AutoRestController(readDto, createDto, updateDto)` (demonstrated by `ProductReadDto` on `ProductCatalogReadOnlyController`) and standard Spring `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Group 1: Query, Analytics & Client Codegen (`AutoApiReadController` — 15 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Offset pagination with 13-operator filtering, multi-field sorting, `?expand=`, and `fields=...` |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Bidirectional `ASC`/`DESC` $O(1)$ UUIDv7 cursor keyset pagination (`afterId`, `dir`, `size`, `size+1` probe) |
| 3 | `GET` | `/all` | `getAll` | Filtered collection response bounded by `max-unpaged-fetch-limit` |
| 4 | `GET` | `/count` | `count` | Total record count matching dynamic predicates |
| 5 | `GET` | `/exists` | `exists` | Fast existence probe against dynamic predicates |
| 6 | `GET` | `/aggregate` | `aggregate` | Numeric `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` statistics |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Distinct non-null values for target attribute |
| 8 | `GET` | `/top` | `findTopRecords` | Top-N ordered slice by target field |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Aggregated `GROUP BY` metrics for reporting |
| 10 | `GET` | `/metadata` | `getMetadata` | Entity fields, Jakarta validation rules, and RBAC descriptors |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Emits TypeScript `interface` definitions |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Emits JSON Schema metadata |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Emits Zod runtime validation schema (`ZodAndClientGeneratorUtil`) |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Emits typed TypeScript Fetch client with Zod schemas |
| 15 | `GET` | `/{id}` | `getById` | Fetch entity by UUIDv7 (`@HttpCacheable` ETag / `304`) |

### Group 2: Mutation, Batch, Upsert, Patch, Delete & Restore (`AutoWriteApi` + `AutoBatchApi` — 10 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Creates entity with `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@UniqueField` |
| 17 | `POST` | `/upsert` | `upsert` | Idempotent create-or-update by unique business key |
| 18 | `PUT` | `/{id}` | `update` | Full entity replacement with `@Version` optimistic locking (`409 Conflict` on stale write) |
| 19 | `PATCH` | `/{id}` | `patch` | Partial non-null field merge |
| 20 | `DELETE` | `/{id}` | `deleteById` | Soft delete guarded by `@StateMachine` `deletableStates` |
| 21 | `POST` | `/{id}/restore` | `restoreById` | Restores a soft-deleted record |
| 22 | `POST` | `/batch` | `createBatch` | Transactional batch insert |
| 23 | `POST` | `/upsert-batch` | `upsertBatch` | Batch upsert mutation |
| 24 | `POST` | `/batch-chunked` | `batchChunked` | Partial-failure isolated chunked batch processor (`BatchExecutionResultDto`) |
| 25 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Bulk attribute update matching query predicates |

### Group 3: Enterprise Lifecycle, AI, RFC 6902 Patch & Streaming (`AutoApiEnterpriseController` — 11 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `POST` | `/{id}/transition` | `transitionState` | Directed `@StateMachine` state transition (`targetState`) |
| 27 | `POST` | `/{id}/clone` | `cloneEntity` | Deep entity clone issuing new UUIDv7 and `@AutoCode` |
| 28 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Atomic numeric counter delta adjustment |
| 29 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | RFC 6902 JSON Patch operations (`add` / `replace` / `remove`) |
| 30 | `GET` | `/{id}/diff` | `compareEntityDiff` | Compares field-level differences between two live entity records (`id` vs `?targetId={targetId}`) |
| 31 | `GET` | `/human-policy` | `getPolicySummary` | Returns active `@HumanPolicy` lifecycle/RBAC/masking rules |
| 32 | `GET` | `/health` | `getEntityHealth` | Entity table health and record telemetry |
| 33 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Real-time Server-Sent Events (SSE) entity stream |
| 34 | `GET` | `/{id}/**` | `navigateSubResources` | Recursive sub-resource graph traversal (`enableNestedSubResources = true`) |
| 35 | `GET` | `/ai/context` | `getAiContext` | JSON Tool Schema payload for LLM function calling |
| 36 | `POST` | `/ai/query` | `queryAi` | Translates natural language prompts into parameterized JPA Criteria |

### Group 4: CSV & JSONL Bulk Export/Import (`AutoExportImportApi` — 4 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Chunked RFC-4180 CSV export |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Newline-delimited JSON (`application/x-ndjson`) stream |
| 39 | `POST` | `/import/csv` | `importCsv` | Bulk RFC-4180 CSV import from raw `text/csv` body (`@AutoBody String`) |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Bulk NDJSON import from raw JSON Lines body (`@AutoBody String`) |

---

## 2. Built-In Platform Controllers

| Endpoint / Prefix | Controller | Responsibility & Production Lockdown |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20-language Developer Studio (RTL `ar`, `fa`, `ur`); returns `401` when `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Exports standard Spring MVC Controller/Service/Repository code; guarded by `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Mints demo HMAC-SHA512 JWT; returns `404` when `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Point-in-time entity reconstruction at ISO-8601 UTC timestamp |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Active SPI beans across the `7` core telemetry `*Customizer` groups (`StorageCustomizer` uses `StorageCustomizerRegistryHelper`, `8` SPIs total) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Live Resilience4j Circuit Breaker health metrics |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Multi-datasource health inspection |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Active W3C `traceparent` and UUIDv7 `X-Request-ID` MDC context |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Converts Tomcat `400/404/405/413/431/500` container errors to `ApiResponse<Void>` |
