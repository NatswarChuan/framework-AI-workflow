# 02. Katalog der 40 automatisch generierten REST-Verträge & Plattform-Controller (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch (EN)](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#endpoints)

---

## 1. 40 kombinierbare `@Auto*`-Verträge pro Entität (`38` standardmäßig sichtbar)

Das Erweitern von `AutoApiController<E>` (oder selektive Kombinieren von `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) veranlasst `DynamicControllerProxyRegistrarHelper` und `SpringMvcEndpointBridge`, bis zu **40** Verträge bereitzustellen (`15` Lese-Verträge in `AutoApiReadController` + `10` Schreib-/Batch-Verträge in `AutoWriteApi`/`AutoBatchApi` + `11` Enterprise-Verträge in `AutoApiEnterpriseController` + `4` Export/Import in `AutoExportImportApi`; **`38`** standardmäßig in Swagger UI sichtbar, da `/events` `@Hidden` trägt und `/{id}/**` `enableNestedSubResources = true` verlangt). Unterstützt `@AutoRestController(readDto, createDto, updateDto)` sowie `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Gruppe 1: Abfragen, Analytik & Client-Codegen (`AutoApiReadController` — 15 Verträge)

| # | HTTP | Unterpfad | Methode | Verhalten |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Offset-Paginierung mit 13 Filteroperatoren, mehrspaltiger Sortierung, Eager-Fetch via `?expand=` und Feldauswahl. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | O(1)-UUIDv7-Cursor-Paginierung ohne SQL-OFFSET-Scan-Verlust auf großen Tabellen. |
| 3 | `GET` | `/all` | `getAll` | Gibt alle Datensätze zurück, die den dynamischen Filtern entsprechen, ideal für Auswahllisten. |
| 4 | `GET` | `/count` | `count` | Führt SQL COUNT(*) entsprechend den dynamischen Filterprädikaten aus. |
| 5 | `GET` | `/exists` | `exists` | Schnelle boolesche Prüfung, die true liefert, sobald mindestens ein Datensatz passt. |
| 6 | `GET` | `/aggregate` | `aggregate` | Berechnet SQL SUM, AVG, MIN, MAX und COUNT auf numerischen Attributen. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Ruft deduplizierte Distinct-Werte für Filter-Dropdowns und Facetten ab. |
| 8 | `GET` | `/top` | `findTopRecords` | Gibt die obersten N sortierten Entitäten für Ranglisten und Warnungen zurück. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Dynamische GROUP-BY-Aggregationsmetriken für Diagramme und BI-Berichte. |
| 10 | `GET` | `/metadata` | `getMetadata` | Stellt JPA-Felddefinitionen, Jakarta-Validierungsregeln und RBAC-Sichtbarkeitsmetadaten bereit. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Generiert kopierfertige TypeScript-Interfaces direkt aus JPA-Entitätsfeldern. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Erzeugt JSON-Schema-Draft-Verträge für dynamische Formulargeneratoren. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Erzeugt Laufzeit-Zod-Validierungsschemas über ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Erzeugt ein typisiertes TypeScript-Fetch-Clientmodul mit Zod-Parsing und CRUD-Helfern. |
| 15 | `GET` | `/{id}` | `getById` | Lädt eine Entität per UUIDv7 inklusive @FieldSecurity-Maskierung und @HttpCacheable-ETag. |

### Gruppe 2: Mutationen, Batch, Upsert, Patch, Löschen & Wiederherstellen (`AutoWriteApi` + `AutoBatchApi` — 10 Verträge)

| # | HTTP | Unterpfad | Methode | Verhalten |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Erstellt eine Entität samt Bean-Validierung, @AutoCode, @AutoSlug, @UniqueField und @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Fügt eine validierte Sammlung innerhalb einer atomaren Transaktion ein. |
| 18 | `POST` | `/upsert` | `upsert` | Fügt anhand von @UniqueField-Schlüsseln oder expliziter UUIDv7-ID atomar ein oder aktualisiert. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Führt einen transaktionalen Massen-Upsert über ein Array von Datensätzen aus. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Verarbeitet große Batches in konfigurierbaren Chunks mit BatchExecutionResultDto-Diagnose pro Eintrag. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Aktualisiert alle zum URL-Filter passenden Datensätze partiell anhand nicht-leerer Body-Felder. |
| 22 | `PUT` | `/{id}` | `update` | Vollständige Entitätsaktualisierung unter Beibehaltung serverseitiger Audit-Spalten. |
| 23 | `PATCH` | `/{id}` | `patch` | Partielles Merge, das nur nicht-leere eingehende Attribute in die bestehende Entität übernimmt. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Führt ein Soft-Delete nach Prüfung von @EntitySecurity deleteRoles und @StateMachine deletableStates durch. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Stellt eine zuvor per Soft-Delete gelöschte Entität für aktive Abfragen wieder her. |

### Gruppe 3: Enterprise-Lebenszyklus, KI, RFC 6902 Patch & Streaming (`AutoApiEnterpriseController` — 11 Verträge)

| # | HTTP | Unterpfad | Methode | Verhalten |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Wendet atomare positive oder negative Zahlen-Deltas ohne Client-Race-Conditions an. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Führt einen validierten @StateMachine-Übergang zu targetState aus und sendet Audit-/Webhook-Events. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Dupliziert eine Entität mit neuer UUIDv7-ID und neu generierten @AutoCode-Feldern. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent-Events-(SSE)-Livestream (@Hidden in Swagger UI wegen MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Exportiert LLM-JSON-Toolschemas zur Beschreibung von Feldern und Filteroperatoren. |
| 31 | `POST` | `/ai/query` | `queryAi` | Übersetzt natürlichsprachliche Eingaben in begrenzte, parametrisierte JPA-Criteria-Abfragen. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Gibt kompilierte @HumanPolicy-Lebenszyklusübergänge, RBAC-Rollen und YAML-Überschreibungen zurück. |
| 33 | `GET` | `/health` | `getEntityHealth` | Prüft den zugrunde liegenden Datenbanktabellenstatus und die Datensatzanzahl je Entität. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Wendet strukturierte RFC-6902-JSON-Patch-Operationen (replace, add, remove) an. |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Berechnet Feldunterschiede zwischen zwei aktiven Entitätsdatensätzen (id vs. targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Rekursive Beziehungsnavigation (Opt-in über @AutoRestController(enableNestedSubResources = true)). |

### Gruppe 4: CSV- & JSONL-Massenexport/-import (`AutoExportImportApi` — 4 Verträge)

| # | HTTP | Unterpfad | Methode | Verhalten |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Exportiert gefilterte Entitäten im RFC-4180-konformen CSV-Format. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Streamt passende Zeilen als zeilengetrenntes JSON (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Importiert RFC-4180-CSV-Klartextnutzlasten in segmentierten Batches. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importiert gestreamte zeilengetrennte NDJSON-Datensätze. |

---

## 2. Integrierte Plattform-Controller

| Endpunkt / Präfix | Controller | Aufgabe & Produktionsabsicherung |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20-sprachiges Developer Studio (RTL `ar`, `fa`, `ur`); liefert `401` bei `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Exportiert regulären Spring-MVC-Code (Controller/Service/Repository); geschützt durch `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Erzeugt Demo-HMAC-SHA512-JWTs; liefert `404` bei `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Zeitpunktgenaue Entitätsrekonstruktion (Time-Travel) für ISO-8601 UTC |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Listet aktive SPI-Beans der `7` Kern-Telemetriegruppen `*Customizer` auf (`StorageCustomizer` über `StorageCustomizerRegistryHelper`, gesamt `8` SPIs) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Live-Metriken der Resilience4j Circuit Breaker |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Zustandsprüfung aller konfigurierten Datenquellen |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Aktiver W3C `traceparent`- und UUIDv7-`X-Request-ID`-MDC-Kontext |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Wandelt Tomcat-Containerfehler `400/404/405/413/431/500` einheitlich in `ApiResponse<Void>` um |
