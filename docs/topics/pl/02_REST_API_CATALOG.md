# 02. Katalog 40 automatycznych kontraktów REST i kontrolerów platformy (`0.1.0`)

> **Języki**: **Polski** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#endpoints)

---

## 1. 40 składalnych kontraktów `@Auto*` na encję (`38` udostępnianych domyślnie)

Rozszerzenie `AutoApiController<E>` (lub selektywne połączenie `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) uruchamia `DynamicControllerProxyRegistrarHelper` i `SpringMvcEndpointBridge`, rejestrując do **40** kontraktów (`15` odczyt + `10` zapis/batch + `11` enterprise + `4` eksport/import; **`38`** domyślnie widocznych w Swagger UI, ponieważ `/events` ma `@Hidden`, a `/{id}/**` wymaga `enableNestedSubResources = true`). Wspiera `@AutoRestController(readDto, createDto, updateDto)` oraz `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Grupa 1: Odczyt, analityka i generowanie klientów (`AutoApiReadController` — 15 kontraktów)

| # | HTTP | Podścieżka | Metoda | Zachowanie |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Paginacja offsetowa z obsługą 13 operatorów filtrowania, wielokolumnowego sortowania, ładowania include i wyboru pól. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Paginacja kursorowa UUIDv7 w czasie O(1) bez degradacji skanowania SQL OFFSET na dużych tabelach. |
| 3 | `GET` | `/all` | `getAll` | Zwraca wszystkie rekordy pasujące do filtrów dynamicznych na potrzeby list wyboru i słowników. |
| 4 | `GET` | `/count` | `count` | Wykonuje zapytanie SQL COUNT(*) zgodne z dynamicznymi predykatami filtrowania. |
| 5 | `GET` | `/exists` | `exists` | Szybkie sprawdzenie logiczne zwracające true, gdy pasuje co najmniej jeden rekord. |
| 6 | `GET` | `/aggregate` | `aggregate` | Oblicza SQL SUM, AVG, MIN, MAX oraz COUNT na polach numerycznych. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Pobiera unikalne wartości bez duplikatów dla filtrów fasetowych. |
| 8 | `GET` | `/top` | `findTopRecords` | Zwraca N najwyżej posortowanych encji dla rankingów i alertów. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Dynamiczne metryki agregacji GROUP BY na potrzeby wykresów i raportów BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Udostępnia definicje pól JPA, reguły Jakarta Validation oraz metadane widoczności RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Generuje gotowe do użycia interfejsy TypeScript bezpośrednio na podstawie pól JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Generuje kontrakty JSON Schema Draft dla kreatorów formularzy. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Syntetyzuje schemat walidacji Zod poprzez ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Generuje typowany moduł klienta TypeScript Fetch z walidacją Zod i funkcjami CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Pobiera pojedynczą encję po UUIDv7, stosując maskowanie @FieldSecurity i nagłówki ETag @HttpCacheable. |

### Grupa 2: Zapis, wsady, Upsert, Patch, usuwanie i przywracanie (`AutoWriteApi` + `AutoBatchApi` — 10 kontraktów)

| # | HTTP | Podścieżka | Metoda | Zachowanie |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Tworzy encję z walidacją Bean, generatorami @AutoCode, @AutoSlug, sprawdzaniem @UniqueField i @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Wstawia zweryfikowaną kolekcję rekordów w ramach jednej atomowej transakcji. |
| 18 | `POST` | `/upsert` | `upsert` | Atomowo wstawia lub aktualizuje rekord po kluczach @UniqueField albo jawnym UUIDv7 ID. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Wykonuje transakcyjny wsadowy upsert dla tablicy rekordów. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Przetwarza duże partie w konfigurowalnych paczkach, zwracając diagnostykę BatchExecutionResultDto dla każdego elementu. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Częściowo aktualizuje wszystkie rekordy spełniające filtry URL przy użyciu niepustych pól z treści żądania. |
| 22 | `PUT` | `/{id}` | `update` | Pełna aktualizacja encji z zachowaniem serwerowych kolumn audytowych. |
| 23 | `PATCH` | `/{id}` | `patch` | Częściowe scalenie kopiujące do istniejącej encji wyłącznie niepuste atrybuty wejściowe. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Miękko usuwa rekord po weryfikacji deleteRoles z @EntitySecurity oraz deletableStates z @StateMachine. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Przywraca wcześniej miękko usuniętą encję do aktywnych zapytań. |

### Grupa 3: Cykl życia Enterprise, AI, RFC 6902 i streaming (`AutoApiEnterpriseController` — 11 kontraktów)

| # | HTTP | Podścieżka | Metoda | Zachowanie |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Stosuje atomowe dodatnie lub ujemne przyrosty numeryczne bez wyścigów po stronie klienta. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Wykonuje zwalidowane przejście @StateMachine do targetState i emituje zdarzenia audytu oraz webhooka. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Duplikuje encję, nadając nowy UUIDv7 ID i ponownie generując pola @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Strumień zdarzeń Server-Sent Events (SSE) (@Hidden w Swagger UI z powodu MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Eksportuje schematy narzędzi JSON dla modeli LLM opisujące pola i operatory filtrowania. |
| 31 | `POST` | `/ai/query` | `queryAi` | Tłumaczy zapytania w języku naturalnym na bezpieczne, parametryzowane zapytania JPA Criteria. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Zwraca skompilowane reguły @HumanPolicy, role RBAC i nadpisania YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Sprawdza status tabeli bazodanowej oraz liczbę rekordów dla danej encji. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Stosuje ustrukturyzowane operacje RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Wylicza różnice pól między dwoma aktywnymi rekordami encji (id względem targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Rekurencyjna nawigacja po relacjach (włączana przez @AutoRestController(enableNestedSubResources = true)). |

### Grupa 4: Masowy eksport i import CSV oraz JSONL (`AutoExportImportApi` — 4 kontrakty)

| # | HTTP | Podścieżka | Metoda | Zachowanie |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Eksportuje przefiltrowane encje do formatu CSV zgodnego z RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Strumieniuje pasujące wiersze jako rozdzielany nową linią JSON (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Importuje surowe dane CSV RFC-4180 w porcjowanych partiach. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importuje strumieniowe zbiory danych NDJSON rozdzielane nową linią. |

---

## 2. Wbudowane kontrolery platformy

| Endpoint / Prefiks | Kontroler | Odpowiedzialność i blokada produkcyjna |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20-językowe Developer Studio (RTL `ar`, `fa`, `ur`); zwraca `401`, gdy `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Eksportuje standardowy kod Spring MVC (Controller/Service/Repository); chroniony przez `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Wystawia demonstracyjny JWT HMAC-SHA512; zwraca `404`, gdy `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Odtworzenie stanu encji w wybranym punkcie czasu ISO-8601 UTC |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Podgląd aktywnych beanów SPI z `7` grup telemetrycznych `*Customizer` (`StorageCustomizer` w `StorageCustomizerRegistryHelper`, łącznie `8` SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Bieżące metryki wyłączników obwodów Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Kontrola stanu wielu źródeł danych |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Aktywny kontekst MDC W3C `traceparent` oraz UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Konwertuje błędy kontenera Tomcat `400/404/405/413/431/500` na `ApiResponse<Void>` |
