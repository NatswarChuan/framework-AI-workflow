# 02. 40 آٹو جنریٹڈ REST معاہدے اور پلیٹ فارم کنٹرولرز کی فہرست (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#endpoints)

---

## 1. فی اینٹیٹی 40 قابلِ ترکیب `@Auto*` معاہدے (ڈیفالٹ `38` فعال)

`AutoApiController<E>` ایکسٹینڈ کرنے (یا `AutoReadApi`، `AutoKeysetApi`، `AutoAnalyticsApi`، `AutoSchemaApi`، `AutoExportImportApi`، `AutoWriteApi`، `AutoBatchApi`، `AutoWorkflowApi`، `AutoAiApi` منتخب کرنے) پر `DynamicControllerProxyRegistrarHelper` اور `SpringMvcEndpointBridge` زیادہ سے زیادہ **40** معاہدے رجسٹر کرتے ہیں (`15` ریڈ + `10` رائٹ/بیچ + `11` انٹرپرائز + `4` ایکسپورٹ/امپورٹ؛ `/events` پر `@Hidden` اور `/{id}/**` کے لیے `enableNestedSubResources = true` کی شرط کے باعث Swagger UI میں ڈیفالٹ **`38`** دکھائی دیتے ہیں)۔ `@AutoRestController(readDto, createDto, updateDto)` اور `@RequestBody`/`@RequestParam`/`@PathVariable` سپورٹ ہیں۔

### گروپ 1: کوئری، اینالیٹکس اور کلائنٹ کوڈ جنریشن (`AutoApiReadController` — 15 معاہدے)

| # | HTTP | ذیلی راستہ | میتھڈ | رویہ |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 13 فلٹر آپریٹرز، ملٹی کالم ترتیب، ایگر فیچ include اور منتخب فیلڈز کے ساتھ آفسیٹ پیجینیشن۔ |
| 2 | `GET` | `/keyset` | `getKeysetPage` | بڑی ٹیبلز پر SQL OFFSET اسکین سستی کے بغیر O(1) UUIDv7 کرسر پیجینیشن۔ |
| 3 | `GET` | `/all` | `getAll` | ڈراپ ڈاؤن اور لک اپ ٹیبلز کے لیے ڈائنامک فلٹرز سے مطابقت رکھنے والے تمام ریکارڈز واپس کرتا ہے۔ |
| 4 | `GET` | `/count` | `count` | ڈائنامک فلٹر شرائط کے مطابق SQL COUNT(*) چلاتا ہے۔ |
| 5 | `GET` | `/exists` | `exists` | کم از کم ایک ریکارڈ ملنے پر true لوٹانے والی تیز بولین جانچ۔ |
| 6 | `GET` | `/aggregate` | `aggregate` | عددی اوصاف پر SQL SUM، AVG، MIN، MAX اور COUNT کا حساب لگاتا ہے۔ |
| 7 | `GET` | `/distinct` | `findDistinctValues` | فلٹر فیسیٹ ڈراپ ڈاؤنز کے لیے منفرد قدریں حاصل کرتا ہے۔ |
| 8 | `GET` | `/top` | `findTopRecords` | لیڈر بورڈز اور الرٹس کے لیے سرفہرست N ترتیب شدہ ریکارڈز واپس کرتا ہے۔ |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | چارٹس اور BI رپورٹنگ کے لیے ڈائنامک GROUP BY مجموعی میٹرکس۔ |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA فیلڈ کی تعریفات، Jakarta پابندیاں اور RBAC مرئیت کا میٹا ڈیٹا فراہم کرتا ہے۔ |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | JPA فیلڈز سے براہ راست کاپی کے لیے تیار TypeScript انٹرفیس تیار کرتا ہے۔ |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | فارم بلڈرز کے لیے JSON Schema Draft معاہدے تیار کرتا ہے۔ |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil کے ذریعے رن ٹائم Zod توثیقی اسکیما (text/plain) تیار کرتا ہے۔ |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod پارسنگ اور CRUD ہیلپرز کے ساتھ ٹائپ شدہ TypeScript Fetch کلائنٹ ماڈیول بناتا ہے۔ |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7 کے ذریعے ایک ریکارڈ لاتا ہے اور @FieldSecurity ماسکنگ اور @HttpCacheable ETag لاگو کرتا ہے۔ |

### گروپ 2: تحریر، بیچ، Upsert، Patch، حذف اور بحالی (`AutoWriteApi` + `AutoBatchApi` — 10 معاہدے)

| # | HTTP | ذیلی راستہ | میتھڈ | رویہ |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation، @AutoCode، @AutoSlug، @UniqueField اور @ComputedField کے ساتھ نیا ریکارڈ بناتا ہے۔ |
| 17 | `POST` | `/batch` | `createBatch` | ایک ایٹامک ٹرانزیکشن کے اندر تصدیق شدہ مجموعہ داخل کرتا ہے۔ |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField کلیدوں یا واضح UUIDv7 ID کی بنیاد پر ایٹامک اندراج یا اپڈیٹ کرتا ہے۔ |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | ریکارڈز کی صف پر ٹرانزیکشنل بلک اپسرٹ انجام دیتا ہے۔ |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | قابل ترتیب حصوں میں بڑے بیچ پروسیس کرتا ہے اور فی آئٹم BatchExecutionResultDto تشخیص لوٹاتا ہے۔ |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | باڈی کے غیر خالی فیلڈز استعمال کرتے ہوئے URL فلٹر شرائط سے ملنے والے ہر ریکارڈ کو پیچ کرتا ہے۔ |
| 22 | `PUT` | `/{id}` | `update` | سرور آڈٹ کالم محفوظ رکھتے ہوئے مکمل ریکارڈ اپڈیٹ کرتا ہے۔ |
| 23 | `PATCH` | `/{id}` | `patch` | موجودہ ریکارڈ پر صرف غیر خالی موصولہ اوصاف نقل کر کے جزوی انضمام کرتا ہے۔ |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles اور @StateMachine deletableStates کی تصدیق کے بعد ریکارڈ سافٹ ڈیلیٹ کرتا ہے۔ |
| 25 | `POST` | `/{id}/restore` | `restoreById` | پہلے سے سافٹ ڈیلیٹ شدہ ریکارڈ کو دوبارہ فعال استفسارات میں بحال کرتا ہے۔ |

### گروپ 3: انٹرپرائز لائف سائیکل، AI، RFC 6902 اور اسٹریمنگ (`AutoApiEnterpriseController` — 11 معاہدے)

| # | HTTP | ذیلی راستہ | میتھڈ | رویہ |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | کلائنٹ ریڈ-موڈیفائی-رائٹ تصادم کے بغیر ایٹامک مثبت یا منفی عددی تبدیلی لاگو کرتا ہے۔ |
| 27 | `POST` | `/{id}/transition` | `transitionState` | targetState کی طرف مصدقہ @StateMachine منتقلی انجام دیتا ہے اور آڈٹ/ویب ہک ایونٹس خارج کرتا ہے۔ |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | نیا UUIDv7 ID جاری کرتے ہوئے اور @AutoCode فیلڈز دوبارہ بناتے ہوئے ریکارڈ کی نقل بناتا ہے۔ |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent Events (SSE) لائیو اسٹریمنگ (text/event-stream MIME کی وجہ سے Swagger UI میں @Hidden)۔ |
| 30 | `GET` | `/ai/context` | `getAiContext` | فیلڈز اور فلٹر آپریٹرز کی وضاحت کرنے والے LLM JSON ٹول اسکیما برآمد کرتا ہے۔ |
| 31 | `POST` | `/ai/query` | `queryAi` | قدرتی زبان کے پرامپٹس کو محفوظ اور محدود JPA Criteria استفسارات میں تبدیل کرتا ہے۔ |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | مرتب شدہ @HumanPolicy لائف سائیکل، RBAC کردار اور YAML اوور رائڈز واپس کرتا ہے۔ |
| 33 | `GET` | `/health` | `getEntityHealth` | ہر ریکارڈ کے ڈیٹابیس ٹیبل کی صورتحال اور تعداد کا معائنہ کرتا ہے۔ |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | منظم RFC 6902 JSON Patch آپریشنز (replace, add, remove) لاگو کرتا ہے۔ |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | دو موجودہ ریکارڈز (id بمقابلہ targetId) کے درمیان فیلڈ کا فرق نکالتا ہے۔ |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | تکراری روابط کی نیویگیشن (@AutoRestController(enableNestedSubResources = true) سے فعال)۔ |

### گروپ 4: CSV اور JSONL بلک ایکسپورٹ/امپورٹ (`AutoExportImportApi` — 4 معاہدے)

| # | HTTP | ذیلی راستہ | میتھڈ | رویہ |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | فلٹر شدہ ریکارڈز کو RFC-4180 CSV فارمیٹ میں ایکسپورٹ کرتا ہے۔ |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | مطابقت رکھنے والی قطاروں کو application/x-ndjson سطر وار JSON کے طور پر اسٹریمنگ کرتا ہے۔ |
| 39 | `POST` | `/import/csv` | `importCsv` | چنکڈ بیچز میں RFC-4180 CSV خام باڈی ڈیٹا درآمد کرتا ہے۔ |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | اسٹریمنگ سطر وار NDJSON ڈیٹاسیٹس درآمد کرتا ہے۔ |

---

## 2. بلٹ ان پلیٹ فارم کنٹرولرز

| اینڈپوائنٹ / سابقہ | کنٹرولر | ذمہ داری اور پروڈکشن لاک ڈاؤن |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20 زبانوں والا Developer Studio (RTL `ar`، `fa`، `ur`)؛ `app.framework.studio.enabled=false` پر `401` واپس کرتا ہے |
| `GET /system/studio/eject` | `DevEjectionController` | معیاری Spring MVC کوڈ (Controller/Service/Repository) برآمد کرتا ہے؛ `SurfaceAccessGuardrailUtil` سے محفوظ |
| `POST /api/v1/auth/token` | `AuthController` | ڈیمو HMAC-SHA512 JWT جاری کرتا ہے؛ `demo-token-endpoint-enabled=false` پر `404` واپس کرتا ہے |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`، `GET /download/{fileId}`، `GET /metadata/{fileId}`، `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`، `POST ""`، `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | مخصوص ISO-8601 UTC وقت پر اینٹیٹی کی تاریخی حالت کی بازتعمیر (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7` بنیادی ٹیلی میٹری `*Customizer` گروپس کے فعال SPI بینز کا معائنہ (`StorageCustomizer` الگ سے `StorageCustomizerRegistryHelper` کے تحت، کل `8` SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Resilience4j سرکٹ بریکرز کے لائیو ہیلتھ میٹرکس |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | ملٹی ڈیٹاسورس صحت کی جانچ |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | فعال MDC میں W3C `traceparent` اور UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat کنٹینر ایررز (`400/404/405/413/431/500`) کو معیاری `ApiResponse<Void>` میں تبدیل کرتا ہے |
