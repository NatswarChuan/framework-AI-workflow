# 02. Catalogo dei 40 Contratti REST Autogenerati e Controller di Piattaforma (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#endpoints)

---

## 1. 40 Contratti `@Auto*` Componibili per Entità (`38` Esposti di Default)

Estendere `AutoApiController<E>` (o comporre selettivamente `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) attiva `DynamicControllerProxyRegistrarHelper` e `SpringMvcEndpointBridge` per registrare fino a **40** contratti (`15` lettura + `10` scrittura/batch + `11` enterprise + `4` export/import; **`38`** visibili di default su Swagger UI poiché `/events` è `@Hidden` e `/{id}/**` richiede `enableNestedSubResources = true`). Supporta `@AutoRestController(readDto, createDto, updateDto)` e `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Gruppo 1: Query, Analitica e Generazione Client (`AutoApiReadController` — 15 Contratti)

| # | HTTP | Sottopercorso | Metodo | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Paginazione offset con 13 operatori di filtro, ordinamento multicolonna, eager-fetch include e selezione campi. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Paginazione a cursore UUIDv7 O(1) senza degradazione SQL OFFSET su tabelle estese. |
| 3 | `GET` | `/all` | `getAll` | Restituisce tutti i record corrispondenti ai filtri dinamici per menu a tendina e tabelle di ricerca. |
| 4 | `GET` | `/count` | `count` | Esegue SQL COUNT(*) in base ai predicati di filtro dinamici. |
| 5 | `GET` | `/exists` | `exists` | Verifica booleana rapida che restituisce true quando corrisponde almeno un record. |
| 6 | `GET` | `/aggregate` | `aggregate` | Calcola SQL SUM, AVG, MIN, MAX e COUNT sugli attributi numerici. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Recupera valori distinti deduplicati per i filtri a faccette. |
| 8 | `GET` | `/top` | `findTopRecords` | Restituisce le prime N entità ordinate per classifiche e avvisi. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Metriche di aggregazione GROUP BY dinamiche per grafici e report BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Espone definizioni dei campi JPA, vincoli Jakarta e metadati di visibilità RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Genera interfacce TypeScript pronte all’uso direttamente dai campi JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Genera contratti JSON Schema Draft per builder di form dinamici. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Sintetizza schemi di validazione Zod tramite ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Genera un modulo client TypeScript Fetch tipizzato con parsing Zod e helper CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Recupera una singola entità tramite UUIDv7 applicando mascheramento @FieldSecurity ed ETag @HttpCacheable. |

### Gruppo 2: Mutazioni, Batch, Upsert, Patch, Eliminazione e Ripristino (`AutoWriteApi` + `AutoBatchApi` — 10 Contratti)

| # | HTTP | Sottopercorso | Metodo | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Crea un’entità applicando validazione Bean, @AutoCode, @AutoSlug, @UniqueField e @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Inserisce una collezione validata all’interno di un’unica transazione atomica. |
| 18 | `POST` | `/upsert` | `upsert` | Inserisce o aggiorna atomicamente in base a chiavi @UniqueField o ID UUIDv7 esplicito. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Esegue upsert massivo transazionale su un array di record. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Elabora grandi batch in chunk configurabili restituendo diagnostica BatchExecutionResultDto per elemento. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Aggiorna parzialmente ogni record corrispondente ai filtri URL con i campi non nulli del body. |
| 22 | `PUT` | `/{id}` | `update` | Aggiornamento completo dell’entità preservando le colonne di audit lato server. |
| 23 | `PATCH` | `/{id}` | `patch` | Unione parziale che copia solo gli attributi in ingresso non nulli sull’entità esistente. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Esegue il soft-delete dopo aver verificato @EntitySecurity deleteRoles e @StateMachine deletableStates. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Ripristina un’entità precedentemente rimossa in soft-delete rendendola nuovamente attiva. |

### Gruppo 3: Ciclo di Vita Enterprise, IA, RFC 6902 e Streaming (`AutoApiEnterpriseController` — 11 Contratti)

| # | HTTP | Sottopercorso | Metodo | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Applica variazioni numeriche atomiche positive o negative evitando race condition client. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Esegue una transizione @StateMachine validata verso targetState emettendo eventi audit e webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Duplica un’entità assegnando un nuovo ID UUIDv7 e rigenerando i campi @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Flusso Server-Sent Events (SSE) in tempo reale (@Hidden in Swagger UI perché text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Esporta schemi JSON per tool LLM che descrivono campi e operatori di filtro. |
| 31 | `POST` | `/ai/query` | `queryAi` | Traduce richieste in linguaggio naturale in query JPA Criteria parametrizzate e limitate. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Restituisce transizioni compilate @HumanPolicy, ruoli RBAC e override YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Verifica lo stato della tabella di database e il conteggio dei record per entità. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Applica operazioni strutturate RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Calcola le differenze campo per campo tra due record attivi dell’entità (id vs targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Navigazione ricorsiva delle relazioni (abilitata tramite @AutoRestController(enableNestedSubResources = true)). |

### Gruppo 4: Esportazione e Importazione Massiva CSV e JSONL (`AutoExportImportApi` — 4 Contratti)

| # | HTTP | Sottopercorso | Metodo | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Esporta le entità filtrate in formato CSV conforme a RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Trasmette le righe corrispondenti come flusso JSON delimitato da newline (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Importa payload CSV RFC-4180 in formato testo grezzo a batch suddivisi. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importa set di dati NDJSON delimitati da newline in streaming. |

---

## 2. Controller di Piattaforma Integrati

| Endpoint / Prefisso | Controller | Responsabilità e Blocco in Produzione |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio in 20 lingue (RTL `ar`, `fa`, `ur`); restituisce `401` se `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Esporta codice Spring MVC standard (Controller/Service/Repository); protetto da `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Emette JWT HMAC-SHA512 dimostrativo; restituisce `404` se `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Ricostruzione storica dell’entità a un timestamp ISO-8601 UTC |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Ispeziona i bean SPI attivi dei `7` gruppi di telemetria `*Customizer` (`StorageCustomizer` gestito da `StorageCustomizerRegistryHelper`, `8` SPI totali) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Metriche in tempo reale dei Circuit Breaker Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Controllo stato di salute di sorgenti dati multiple |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Contesto MDC attivo W3C `traceparent` e UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Converte errori del contenitore Tomcat `400/404/405/413/431/500` in `ApiResponse<Void>` |
