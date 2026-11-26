# Spring-NWVMC (`v0.1.0`) — 40 Auto-Generated Endpoints, Query DSL & Built-In Subsystems

> Every URL path, HTTP method, query parameter, operator, and status code below is verified against `controller-to-api-framework` and live tests in `controller-to-api-implementation` (`v0.1.0`).

---

## 1. Base Path Derivation Convention

For an `@AutoRestController` without explicit `basePath`:
- Auto-derived paths always use `/api/v1` (`ApiEndpointConstant.API_V1_BASE` in `NamingConventionUtil`). Override anytime via `@AutoRestController(basePath = "...")`.
- Entity simple name is split on uppercase boundaries (kebab-case) and pluralized:
  - `ProductCatalog` → `/api/v1/product-catalogs`
  - `ECommerceOrder` → **`/api/v1/e-commerce-orders`**
  - `InventoryStock` → `/api/v1/inventory-stocks`
  - `PaymentTransaction` → `/api/v1/payment-transactions`
  - `ElectronicInvoice` → `/api/v1/electronic-invoices`
  - `Tag` → `/api/v1/tags`
- Override anytime via `@AutoRestController(basePath = "/api/v1/readonly/product-catalogs")`.

---

## 2. All 40 Auto-Generated Entity Endpoints (Grouped by Composable Interface)

### Group A — Read, Keyset, Analytics & Schema (`AutoApiReadController<E>` — 15 Endpoints)

| Interface | Method | Sub-Path | Purpose & Verified Usage |
| :--- | :---: | :--- | :--- |
| `AutoReadApi` | `GET` | `/` | Paged query with dot-filters, `?sort=retailPrice&dir=desc&page=0&size=20`, `?fields=`, `?expand=` |
| `AutoReadApi` | `GET` | `/all` | Unpaged list bounded by `max-unpaged-fetch-limit` (default `5000`) |
| `AutoReadApi` | `GET` | `/count` | Exact row count matching filters (`GET /count?retailPrice.gte=1000`) |
| `AutoReadApi` | `GET` | `/exists` | Boolean existence check (`GET /exists?skuCode.eq=SKU-DOC-MAC-M3`) |
| `AutoReadApi` | `GET` | `/{id}` | Fetch single entity by UUIDv7 (`?fields=`, `?expand=`) |
| `AutoKeysetApi` | `GET` | `/keyset` | O(1) cursor pagination (`?afterId=<uuid>&dir=desc&size=20&fields=...`) |
| `AutoAnalyticsApi` | `GET` | `/aggregate` | Numeric `count`, `sum`, `average`, `min`, `max` (`?field=retailPrice`) |
| `AutoAnalyticsApi` | `GET` | `/distinct` | Distinct column values (`?field=category`) bounded by `max-unpaged-fetch-limit` |
| `AutoAnalyticsApi` | `GET` | `/top` | Top-N records by numeric field (`?field=retailPrice&limit=5`) |
| `AutoAnalyticsApi` | `GET` | `/group-by` | Grouped aggregates (`?groupField=category&valueField=retailPrice`; fallback aliases: `groupBy` & `field`) |
| `AutoSchemaApi` | `GET` | `/metadata` | Entity metadata (fields, relations, operators, security summary) |
| `AutoSchemaApi` | `GET` | `/schema/json` | JSON Schema projection |
| `AutoSchemaApi` | `GET` | `/schema/typescript` | TypeScript `export interface <Entity>` definition |
| `AutoSchemaApi` | `GET` | `/schema/zod` | Runtime Zod schema (`export const <Entity>Schema = z.object(...)`) |
| `AutoSchemaApi` | `GET` | `/schema/client` | Zero-dependency typed Fetch API client (`export const <Entity>Client`) |

### Group B — Write & Batch (`AutoWriteApi<E>` 6 + `AutoBatchApi<E>` 4 — 10 Endpoints)

| Interface | Method | Sub-Path | Purpose & Verified Usage |
| :--- | :---: | :--- | :--- |
| `AutoWriteApi` | `POST` | `/` | Create entity (`201 Created`); auto-populates UUIDv7, `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@StateMachine.initial` |
| `AutoWriteApi` | `POST` | `/upsert` | Create or update entity cleanly by unique key or primary key |
| `AutoWriteApi` | `PUT` | `/{id}` | Full update; enforces `@Version` optimistic lock (`409 Conflict` on stale version) |
| `AutoWriteApi` | `PATCH` | `/{id}` | Partial field update |
| `AutoWriteApi` | `DELETE` | `/{id}` | Soft-delete (`deleted = true`), guarded by `@StateMachine.deletableStates` |
| `AutoWriteApi` | `POST` | `/{id}/restore` | Restores soft-deleted entity (`deleted = false`) |
| `AutoBatchApi` | `POST` | `/batch` | Transactional batch insert (`List<E>`) |
| `AutoBatchApi` | `POST` | `/upsert-batch` | Batch upsert multiple entity records (`List<E>`) |
| `AutoBatchApi` | `POST` | `/batch-chunked` | High-volume O(1)-memory chunked batch insert (`?chunkSize=100`) with diagnostic report |
| `AutoBatchApi` | `PATCH` | `/batch-update` | Bulk update records matching dynamic filter criteria |

### Group C — Workflow, Realtime & Spring AI (`AutoApiEnterpriseController<E>` — 11 Endpoints)

| Interface | Method | Sub-Path | Purpose & Verified Usage |
| :--- | :---: | :--- | :--- |
| `AutoWorkflowApi` | `POST` | `/{id}/transition` | **Query param `?targetState=PENDING_PAYMENT`** (NOT JSON body!) — validates `@StateMachine` `"FROM:TO1,TO2"` |
| `AutoWorkflowApi` | `POST` | `/{id}/clone` | Clones entity with fresh UUIDv7 and fresh `@AutoCode`/`@AutoSlug` |
| `AutoWorkflowApi` | `PATCH` | `/{id}/increment` | Atomic numeric delta (`?field=availableQuantity&delta=-2`) |
| `AutoWorkflowApi` | `PATCH` | `/{id}/patch-rfc6902` | RFC 6902 JSON Patch (`application/json-patch+json` or `application/json`) |
| `AutoWorkflowApi` | `GET` | `/{id}/diff` | Field-by-field diff against another entity (`?targetId=<uuid>`) |
| `AutoWorkflowApi` | `GET` | `/human-policy` | Compiled `@HumanPolicy` + YAML policy summary (alias `/policy-summary`) |
| `AutoWorkflowApi` | `GET` | `/health` | Entity operational health telemetry |
| `AutoWorkflowApi` | `GET` | `/events` | `@Hidden` real-time Server-Sent Events stream (alias `/stream`) |
| `AutoWorkflowApi` | `GET` | `/{id}/**` | Nested sub-resource traversal (opt-in via `@EnableNestedSubResource`) |
| `AutoAiApi` | `GET` | `/ai/context` | LLM system prompt context for this entity (alias `/ai-context`) |
| `AutoAiApi` | `POST` | `/ai/query` | Natural-language query translated into JPA Criteria (alias `/ai-query`) |

### Group D — Export & Import (`AutoExportImportApi<E>` — 4 Endpoints)

| Interface | Method | Sub-Path | Purpose |
| :--- | :---: | :--- | :--- |
| `AutoExportImportApi` | `GET` | `/export/csv` | Streaming RFC-4180 CSV export bounded by `max-unpaged-fetch-limit` |
| `AutoExportImportApi` | `GET` | `/export/jsonl` | Streaming NDJSON / JSON Lines export |
| `AutoExportImportApi` | `POST` | `/import/csv` | Chunked RFC-4180 CSV import with tenant enforcement |
| `AutoExportImportApi` | `POST` | `/import/jsonl` | Chunked JSONL import with tenant enforcement |

---

## 3. All 13 Dot-Syntax Query Operators (`FilterOperatorConstant` — NEVER Use `__`)

| Operator | Query String Example | SQL Equivalent |
| :--- | :--- | :--- |
| `.eq` (or omitted) | `category=ELECTRONICS` or `category.eq=ELECTRONICS` | `category = 'ELECTRONICS'` |
| `.ne` | `category.ne=ARCHIVED` | `category <> 'ARCHIVED'` |
| `.like` | `productName.like=MacBook` | `LOWER(product_name) LIKE '%macbook%'` (case-insensitive substring) |
| `.startsWith` | `skuCode.startsWith=SKU-DOC` | `sku_code LIKE 'SKU-DOC%'` |
| `.endsWith` | `skuCode.endsWith=-M3` | `sku_code LIKE '%-M3'` |
| `.gt` | `retailPrice.gt=500` | `retail_price > 500` |
| `.gte` | `retailPrice.gte=1000` | `retail_price >= 1000` |
| `.lt` | `retailPrice.lt=3000` | `retail_price < 3000` |
| `.lte` | `retailPrice.lte=2500` | `retail_price <= 2500` |
| `.in` | `category.in=ELECTRONICS,AUDIO` | `category IN ('ELECTRONICS','AUDIO')` |
| `.notIn` | `orderStatus.notIn=CANCELLED,REFUNDED` | `order_status NOT IN (...)` |
| `.between` | `retailPrice.between=500,2500` | `retail_price BETWEEN 500 AND 2500` |
| `.null` | `brand.null=false` (or `brand.null=true`) | `brand IS NOT NULL` / `brand IS NULL` |

**Relational traversal:** Dot-join across JPA associations up to `max-join-depth` (default `3`):
`GET /api/v1/customer-orders?customer.department.company.countryCode=VN&expand=customer&sort=customer.department.code&dir=asc`

---

## 4. Built-In Platform Subsystem Endpoints

| Subsystem | Method & Path | Notes / Verified Behavior |
| :--- | :--- | :--- |
| **GraphQL SDL** | `GET /api/v1/graphql/schema` | Returns full auto-generated GraphQL SDL |
| **GraphQL Execute** | `POST /api/v1/graphql` | Body `{"query":"query { listProductCatalogs { id skuCode productName retailPrice } }"}` |
| **GraphQL Explorer** | `GET /api/v1/graphql/explorer` | `@Hidden` interactive HTML explorer |
| **Storage Upload** | `POST /api/v1/storage/upload` | Multipart field `file`; returns **`201 Created`** with `data.fileId` |
| **Storage Download** | `GET /api/v1/storage/download/{fileId}` | Streams binary file with `Content-Disposition` & `ETag` |
| **Storage Metadata** | `GET /api/v1/storage/metadata/{fileId}` | File size, MIME type, storage key |
| **Storage Exists** | `GET /api/v1/storage/exists/{fileId}` | Returns boolean `data` |
| **Storage Presigned** | `POST /api/v1/storage/presigned-url` | Generates time-limited S3/GCS/local URL |
| **Storage Delete** | `DELETE /api/v1/storage/{fileId}` | Deletes file (`200 OK`) |
| **Audit Time-Travel** | `GET /api/v1/system/time-travel/{entityName}/{id}` | Optional `?timestamp=2026-11-25T10:00:00Z` |
| **Multi-DB Health** | `GET /api/v1/system/databases/health` | Status across registered clusters |
| **W3C Trace Context** | `GET /api/v1/system/trace-context` | Active `traceId` (UUIDv7), `spanId`, `traceparent` |
| **Customizers** | `GET /api/v1/system/customizers` | Registered `*Customizer` beans telemetry |
| **Circuit Breakers** | `GET /api/v1/system/resilience/circuit-breakers` | Live Resilience4j breaker states & metrics |
| **Dev Studio** | `GET /system/studio` | Locked off by default (`app.framework.studio.enabled: true` in `dev` only) |
| **Dev Demo JWT** | `POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN` | Locked off by default (`demo-token-endpoint-enabled: true` in `dev` only); returns `200 OK` with `data.{token,role,username,userId}` (`GET` returns `405`, `/system/studio/demo-token` returns `404`) |
| **Code Ejection** | `GET /system/studio/eject?target=ProductCatalog` | Exports 5 standalone Spring MVC Java files (`dev`/admin only) |
| **WebSocket STOMP** | `/ws-connect` | Topics `/topic/{entity}/created`, `/updated`, `/deleted`, `/state-changed` |
