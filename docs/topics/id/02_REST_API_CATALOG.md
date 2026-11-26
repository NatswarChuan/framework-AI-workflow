# 02. Katalog 40 Kontrak REST Otomatis & Controller Platform Bawaan (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap (EN)](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#endpoints)

---

## 1. 40 Kontrak `@Auto*` Komposabel per Entitas (`38` Tampil Secara Default)

Memperluas `AutoApiController<E>` (atau menggabungkan `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) memicu `DynamicControllerProxyRegistrarHelper` dan `SpringMvcEndpointBridge` mendaftarkan hingga **40** kontrak (`15` baca + `10` tulis/batch + `11` enterprise + `4` ekspor/impor; **`38`** tampil default di Swagger UI karena `/events` bertanda `@Hidden` dan `/{id}/**` memerlukan `enableNestedSubResources = true`). Mendukung `@AutoRestController(readDto, createDto, updateDto)` dan `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Grup 1: Kueri, Analitik & Pembuatan Kode Klien (`AutoApiReadController` — 15 Kontrak)

| # | HTTP | Sub-Jalur | Metode | Perilaku |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Paginasi offset dengan 13 operator filter, pengurutan multi-kolom, eager-fetch `?expand=`, dan pemilihan kolom fields. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Paginasi kursor UUIDv7 berkecepatan O(1) tanpa degradasi pemindaian SQL OFFSET pada tabel besar. |
| 3 | `GET` | `/all` | `getAll` | Mengembalikan seluruh rekaman yang cocok dengan filter dinamis untuk dropdown dan tabel referensi. |
| 4 | `GET` | `/count` | `count` | Menjalankan SQL COUNT(*) yang sesuai dengan predikat filter dinamis. |
| 5 | `GET` | `/exists` | `exists` | Pemeriksaan boolean cepat yang mengembalikan true bila minimal satu data cocok. |
| 6 | `GET` | `/aggregate` | `aggregate` | Menghitung SQL SUM, AVG, MIN, MAX, dan COUNT pada atribut numerik. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Mengambil daftar nilai unik tanpa duplikat untuk opsi filter dropdown. |
| 8 | `GET` | `/top` | `findTopRecords` | Mengembalikan N entitas teratas yang diurutkan untuk papan peringkat dan peringatan. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Metrik agregasi GROUP BY dinamis untuk grafik dan pelaporan BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Menyediakan definisi field JPA, batasan validasi Jakarta, serta metadata visibilitas RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Menghasilkan antarmuka TypeScript siap pakai langsung dari definisi field JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Menghasilkan kontrak JSON Schema Draft untuk pembangun formulir dinamis. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Menghasilkan skema validasi Zod runtime melalui ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Menghasilkan modul klien TypeScript Fetch bertipe kuat lengkap dengan parsing Zod dan helper CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Mengambil satu entitas berdasarkan UUIDv7 beserta penyamaran @FieldSecurity dan ETag @HttpCacheable. |

### Grup 2: Mutasi, Batch, Upsert, Patch, Hapus & Pulihkan (`AutoWriteApi` + `AutoBatchApi` — 10 Kontrak)

| # | HTTP | Sub-Jalur | Metode | Perilaku |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Membuat entitas baru disertai validasi Bean, @AutoCode, @AutoSlug, @UniqueField, dan @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Menyisipkan kumpulan data tervalidasi dalam satu transaksi atomik. |
| 18 | `POST` | `/upsert` | `upsert` | Menyisipkan atau memperbarui secara atomik berdasarkan kunci @UniqueField atau UUIDv7 eksplisit. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Menjalankan bulk upsert transaksional pada sekumpulan array rekaman. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Memproses batch besar dalam ukuran potongan terkonfigurasi dengan diagnostik BatchExecutionResultDto per item. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Memperbarui sebagian semua rekaman yang cocok dengan filter URL menggunakan field non-null dari body. |
| 22 | `PUT` | `/{id}` | `update` | Pembaruan entitas penuh dengan tetap menjaga kolom audit sisi server. |
| 23 | `PATCH` | `/{id}` | `patch` | Penggabungan parsial yang hanya menyalin atribut masuk bernilai non-null ke entitas yang ada. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Menghapus lunak rekaman setelah memverifikasi @EntitySecurity deleteRoles dan @StateMachine deletableStates. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Memulihkan entitas yang sebelumnya terhapus lunak agar aktif kembali di kueri. |

### Grup 3: Siklus Hidup Enterprise, AI, Patch RFC 6902 & Streaming (`AutoApiEnterpriseController` — 11 Kontrak)

| # | HTTP | Sub-Jalur | Metode | Perilaku |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Menerapkan selisih numerik positif atau negatif secara atomik tanpa race condition sisi klien. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Menjalankan transisi @StateMachine tervalidasi ke targetState lalu memancarkan event audit/webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Menggandakan entitas dengan menerbitkan ID UUIDv7 baru dan membuat ulang field @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Aliran peristiwa langsung Server-Sent Events (SSE) (@Hidden di Swagger UI karena MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Mengekspor skema JSON alat LLM yang menjelaskan field serta operator filter. |
| 31 | `POST` | `/ai/query` | `queryAi` | Menerjemahkan prompt bahasa alami menjadi kueri JPA Criteria berbatas dan terparameterisasi. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Mengembalikan aturan transisi @HumanPolicy terkompilasi, peran RBAC, serta override YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Memeriksa status tabel basis data pendukung serta jumlah baris per entitas. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Menerapkan operasi terstruktur RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Menghitung selisih per kolom antara dua rekaman entitas aktif (id vs targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Navigasi relasi rekursif (diaktifkan lewat @AutoRestController(enableNestedSubResources = true)). |

### Grup 4: Ekspor/Impor Massal CSV & JSONL (`AutoExportImportApi` — 4 Kontrak)

| # | HTTP | Sub-Jalur | Metode | Perilaku |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Mengekspor entitas terfilter dalam format CSV standar RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Mengalirkan baris data cocok sebagai JSON berbatas baris baru (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Mengimpor payload body mentah CSV RFC-4180 dalam batch bertahap. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Mengimpor kumpulan data NDJSON berbatas baris baru secara streaming. |

---

## 2. Controller Platform Bawaan

| Endpoint / Prefiks | Controller | Tanggung Jawab & Penguncian Produksi |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio 20 bahasa (RTL `ar`, `fa`, `ur`); mengembalikan `401` saat `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Mengekspor kode Spring MVC standar (Controller/Service/Repository); dilindungi `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Menerbitkan JWT HMAC-SHA512 demo; mengembalikan `404` saat `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Rekonstruksi entitas pada titik waktu ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Memeriksa bean SPI aktif pada `7` grup telemetri `*Customizer` (`StorageCustomizer` dikelola `StorageCustomizerRegistryHelper`, total `8` SPI) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Metrik kesehatan langsung Resilience4j Circuit Breaker |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Inspeksi kesehatan multi-sumber data |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Konteks MDC aktif W3C `traceparent` dan UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Mengonversi galat kontainer Tomcat `400/404/405/413/431/500` menjadi `ApiResponse<Void>` |
