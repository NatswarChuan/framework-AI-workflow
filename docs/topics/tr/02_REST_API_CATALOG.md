# 02. Otomatik Üretilen 40 REST Sözleşmesi ve Platform Denetleyicileri Kataloğu (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz (EN)](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#endpoints)

---

## 1. Varlık Başına 40 Birleştirilebilir `@Auto*` Sözleşmesi (Varsayılan `38` Açık)

`AutoApiController<E>` genişletildiğinde (veya `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi` seçici olarak birleştirildiğinde) `DynamicControllerProxyRegistrarHelper` ve `SpringMvcEndpointBridge` en fazla **40** sözleşmeyi kaydeder (`15` okuma + `10` yazma/toplu işlem + `11` kurumsal + `4` dışa/içe aktarım; `/events` `@Hidden` olduğu ve `/{id}/**` `enableNestedSubResources = true` gerektirdiği için Swagger UI’da varsayılan **`38`** görünür). `@AutoRestController(readDto, createDto, updateDto)` ve `@RequestBody`/`@RequestParam`/`@PathVariable` desteklenir.

### Grup 1: Sorgulama, Analitik ve İstemci Kod Üretimi (`AutoApiReadController` — 15 Sözleşme)

| # | HTTP | Alt Yol | Metot | Davranış |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 13 filtre operatörü, çoklu sütun sıralama, ilişkili eager-fetch ve alan seçimi destekli sayfalama. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Büyük tablolarda SQL OFFSET tarama yavaşlaması olmadan O(1) UUIDv7 imleç sayfalama. |
| 3 | `GET` | `/all` | `getAll` | Açılır listeler ve başvuru tabloları için dinamik filtrelerle eşleşen tüm kayıtları döndürür. |
| 4 | `GET` | `/count` | `count` | Dinamik filtre koşullarıyla eşleşen SQL COUNT(*) sorgusunu yürütür. |
| 5 | `GET` | `/exists` | `exists` | En az bir kayıt eşleştiğinde true döndüren hızlı mantıksal kontrol. |
| 6 | `GET` | `/aggregate` | `aggregate` | Sayısal alanlar üzerinde SQL SUM, AVG, MIN, MAX ve COUNT hesaplar. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Filtre seçenek listeleri için yinelenmeyen benzersiz değerleri getirir. |
| 8 | `GET` | `/top` | `findTopRecords` | Sıralama listeleri ve uyarılar için sıralı en üst N varlığı döndürür. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Grafikler ve BI raporlama için dinamik GROUP BY toplulaştırma metrikleri. |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA alan tanımlarını, Jakarta doğrulama kısıtlarını ve RBAC görünürlük metaverilerini sunar. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Doğrudan JPA alanlarından kopyalamaya hazır TypeScript arayüzleri üretir. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Form oluşturucular için JSON Schema Draft sözleşmeleri üretir. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil aracılığıyla çalışma zamanı Zod doğrulama şeması (text/plain) üretir. |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod doğrulamalı ve CRUD yardımcılı tiplenmiş bir TypeScript Fetch istemci modülü üretir. |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7 ile tek bir varlığı getirir; @FieldSecurity maskelemesi ve @HttpCacheable ETag uygular. |

### Grup 2: Yazma, Toplu İşlem, Upsert, Patch, Silme ve Geri Yükleme (`AutoWriteApi` + `AutoBatchApi` — 10 Sözleşme)

| # | HTTP | Alt Yol | Metot | Davranış |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation, @AutoCode, @AutoSlug, @UniqueField ve @ComputedField uygulayarak yeni varlık oluşturur. |
| 17 | `POST` | `/batch` | `createBatch` | Doğrulanmış bir koleksiyonu tek bir atomik işlem içinde topluca ekler. |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField anahtarlarına veya açık UUIDv7 kimliğine göre atomik ekleme/güncelleme yapar. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Bir kayıt dizisi üzerinde işlemsel toplu upsert gerçekleştirir. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Büyük yığınları yapılandırılabilir parçalar halinde işleyerek öğe bazlı BatchExecutionResultDto tanıları döndürür. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Gövdedeki null olmayan alanları kullanarak URL filtresiyle eşleşen tüm kayıtları topluca yamalar. |
| 22 | `PUT` | `/{id}` | `update` | Sunucu denetim sütunlarını koruyarak tam varlık güncellemesi yapar. |
| 23 | `PATCH` | `/{id}` | `patch` | Mevcut varlığın üzerine yalnızca null olmayan gelen alanları kopyalayarak kısmi birleştirme yapar. |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles ve @StateMachine deletableStates kontrollerinden sonra kaydı geçici siler. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Daha önce geçici silinmiş bir varlığı yeniden etkin sorgulara geri yükler. |

### Grup 3: Kurumsal Yaşam Döngüsü, Yapay Zeka, RFC 6902 ve Akış (`AutoApiEnterpriseController` — 11 Sözleşme)

| # | HTTP | Alt Yol | Metot | Davranış |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | İstemci okuma-değiştirme-yazma yarışları olmadan atomik artı/eksi sayısal fark uygular. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | targetState hedefine doğrulanmış @StateMachine geçişi yürütür ve denetim/webhook olayları yayar. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Yeni UUIDv7 kimliği verip @AutoCode alanlarını yeniden üreterek bir varlığı çoğaltır. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Gerçek zamanlı SSE akışı (text/event-stream MIME nedeniyle Swagger UI üzerinde @Hidden). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Alanları ve filtre operatörlerini açıklayan LLM JSON araç şemalarını dışa aktarır. |
| 31 | `POST` | `/ai/query` | `queryAi` | Doğal dil istemlerini sınırlandırılmış parametreli JPA Criteria sorgularına dönüştürür. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Derlenmiş @HumanPolicy yaşam döngüsü geçişlerini, RBAC rollerini ve YAML geçersiz kılmalarını döndürür. |
| 33 | `GET` | `/health` | `getEntityHealth` | Varlık başına veritabanı tablo durumunu ve kayıt sayısını denetler. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Yapılandırılmış RFC 6902 JSON Patch işlemlerini (replace, add, remove) uygular. |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | İki canlı varlık kaydı (id ile targetId) arasındaki alan farklarını hesaplar. |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Özyinelemeli ilişki gezintisi (@AutoRestController(enableNestedSubResources = true) ile etkinleştirilir). |

### Grup 4: CSV ve JSONL Toplu Dışa/İçe Aktarım (`AutoExportImportApi` — 4 Sözleşme)

| # | HTTP | Alt Yol | Metot | Davranış |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Filtrelenmiş varlıkları RFC-4180 CSV biçiminde dışa aktarır. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Eşleşen satırları application/x-ndjson satır sonuyla ayrılmış JSON olarak aktarır. |
| 39 | `POST` | `/import/csv` | `importCsv` | RFC-4180 CSV ham gövde yüklerini parçalı yığınlar halinde içe aktarır. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Satır sonuyla ayrılmış akışlı NDJSON veri kümelerini içe aktarır. |

---

## 2. Yerleşik Platform Denetleyicileri

| Uç Nokta / Ön Ek | Denetleyici | Sorumluluk ve Üretim Kilitlemesi |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20 dilli Developer Studio (RTL `ar`, `fa`, `ur`); `app.framework.studio.enabled=false` iken `401` döner |
| `GET /system/studio/eject` | `DevEjectionController` | Standart Spring MVC kodu (Controller/Service/Repository) üretir; `SurfaceAccessGuardrailUtil` ile korunur |
| `POST /api/v1/auth/token` | `AuthController` | Demo HMAC-SHA512 JWT üretir; `demo-token-endpoint-enabled=false` iken `404` döner |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | ISO-8601 UTC zaman damgasında varlık durumunu noktasal olarak yeniden oluşturma |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7` çekirdek telemetri `*Customizer` grubundaki aktif SPI bean’lerini listeler (`StorageCustomizer`, `StorageCustomizerRegistryHelper` ile yönetilir; toplam `8` SPI) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Canlı Resilience4j Circuit Breaker sağlık metrikleri |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Çoklu veri kaynağı sağlık denetimi |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Aktif MDC bağlamındaki W3C `traceparent` ve UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat kapsayıcı hatalarını (`400/404/405/413/431/500`) standart `ApiResponse<Void>` biçimine dönüştürür |
