# 02. Catalog of 40 Auto-Generated REST Contracts & Platform Controllers (`1.0.0`)

> **Language**: English | [Tiếng Việt](../02_REST_API_CATALOG.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. 40 Declared `@Auto*` Contracts per Entity (`38` Exposed by Default)

Extending `AutoApiController<E>` triggers `DynamicControllerProxyRegistrarHelper` and `SpringMvcEndpointBridge` to bind **40** contracts (`17` Read + `11` Write + `12` Enterprise; **`38`** visible by default in Swagger UI and `/system/studio` badge because `/events` is `@Hidden` and `/{id}/**` requires `enableNestedSubResources = true`).

### Group 1: Query, Analytics & Client Codegen (`AutoApiReadController` — 17 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Offset pagination with 13-operator filtering, multi-field sorting, `include=...`, `fields=...` |
| 2 | `GET` | `/keyset` | `getKeysetPage` | $O(1)$ UUIDv7 cursor keyset pagination (`afterId`, `size`) |
| 3 | `GET` | `/all` | `getAll` | Filtered collection response without page envelope |
| 4 | `GET` | `/count` | `count` | Total record count matching dynamic predicates |
| 5 | `GET` | `/exists` | `exists` | Fast existence probe against dynamic predicates |
| 6 | `GET` | `/aggregate` | `aggregate` | Numeric `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` statistics |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Distinct non-null values for target attribute |
| 8 | `GET` | `/top` | `findTopRecords` | Top-N ordered slice by target field |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Aggregated `GROUP BY` metrics for reporting |
| 10 | `GET` | `/export/csv` | `exportCsv` | Chunked RFC-4180 CSV export |
| 11 | `GET` | `/export/jsonl` | `exportJsonl` | Newline-delimited JSON (`application/x-ndjson`) stream |
| 12 | `GET` | `/metadata` | `getMetadata` | Entity fields, Jakarta validation rules, and RBAC descriptors |
| 13 | `GET` | `/schema/typescript` | `generateTypeScript` | Emits TypeScript `interface` definitions |
| 14 | `GET` | `/schema/json` | `getJsonSchema` | Emits JSON Schema metadata |
| 15 | `GET` | `/schema/zod` | `generateZodSchema` | Emits Zod runtime validation schema (`ZodAndClientGeneratorUtil`) |
| 16 | `GET` | `/schema/client` | `generateTypedApiClient` | Emits typed TypeScript Fetch client with Zod schemas |
| 17 | `GET` | `/{id}` | `getById` | Fetch entity by UUIDv7 (`@HttpCacheable` ETag / `304`) |

### Group 2: Mutation, Batch, Upsert, Patch, Delete & Restore (`AutoApiController` — 11 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 18 | `POST` | `""` | `create` | Creates entity with `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@UniqueField` |
| 19 | `POST` | `/batch` | `createBatch` | Transactional batch insert |
| 20 | `POST` | `/upsert` | `upsert` | Idempotent create-or-update by unique business key |
| 21 | `POST` | `/upsert-batch` | `upsertBatch` | Batch upsert mutation |
| 22 | `POST` | `/batch-chunked` | `batchChunked` | Partial-failure isolated chunked batch processor (`BatchExecutionResultDto`) |
| 23 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Atomic numeric counter delta adjustment |
| 24 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Bulk attribute update matching query predicates |
| 25 | `PUT` | `/{id}` | `update` | Full entity replacement |
| 26 | `PATCH` | `/{id}` | `patch` | Partial non-null field merge |
| 27 | `DELETE` | `/{id}` | `deleteById` | Soft delete guarded by `@StateMachine` `deletableStates` |
| 28 | `POST` | `/{id}/restore` | `restoreById` | Restores a soft-deleted record |

### Group 3: Enterprise Lifecycle, AI, RFC 6902 Patch & Streaming (`AutoApiEnterpriseController` — 12 Contracts)

| # | HTTP | Sub-Path | Method | Behavior |
| :-: | :--- | :--- | :--- | :--- |
| 29 | `POST` | `/{id}/transition` | `transitionState` | Directed `@StateMachine` state transition (`targetState`) |
| 30 | `POST` | `/{id}/clone` | `cloneEntity` | Deep entity clone issuing new UUIDv7 and `@AutoCode` |
| 31 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Real-time Server-Sent Events (SSE) entity stream |
| 32 | `GET` | `/ai/context` | `getAiContext` | JSON Tool Schema payload for LLM function calling |
| 33 | `POST` | `/ai/query` | `queryByNaturalLanguage` | Translates natural language prompts into parameterized JPA Criteria |
| 34 | `GET` | `/human-policy` | `getPolicySummary` | Returns active `@HumanPolicy` lifecycle/RBAC/masking rules |
| 35 | `GET` | `/health` | `getEntityHealth` | Entity table health and record telemetry |
| 36 | `POST` | `/import/csv` | `importCsv` | Streaming multipart RFC-4180 CSV import |
| 37 | `POST` | `/import/jsonl` | `importJsonl` | Streaming multipart NDJSON import |
| 38 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | RFC 6902 JSON Patch operations (`add` / `replace` / `remove`) |
| 39 | `GET` | `/{id}/diff` | `compareEntityDiff` | Compares current entity snapshot against historical diff target |
| 40 | `GET` | `/{id}/**` | `navigateSubResources` | Recursive sub-resource graph traversal (`enableNestedSubResources = true`) |

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
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Active SPI beans across the 8 `*Customizer` interfaces |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Live Resilience4j Circuit Breaker health metrics |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Multi-datasource health inspection |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Active W3C `traceparent` and UUIDv7 `X-Request-ID` MDC context |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Converts Tomcat `400/404/405/413/431/500` container errors to `ApiResponse<Void>` |
