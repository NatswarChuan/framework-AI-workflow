# 02. فهرست ۴۰ قرارداد REST خودکار و کنترلرهای داخلی پلتفرم (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#endpoints)

---

## 1. ۴۰ قرارداد ترکیبی `@Auto*` برای هر موجودیت (`38` مورد پیش‌فرض فعال)

گسترش `AutoApiController<E>` (یا ترکیب انتخابی `AutoReadApi`، `AutoKeysetApi`، `AutoAnalyticsApi`، `AutoSchemaApi`، `AutoExportImportApi`، `AutoWriteApi`، `AutoBatchApi`، `AutoWorkflowApi`، `AutoAiApi`) باعث می‌شود `DynamicControllerProxyRegistrarHelper` و `SpringMvcEndpointBridge` تا **40** قرارداد ثبت کنند (`15` خواندن + `10` نوشتن/دسته‌ای + `11` سازمانی + `4` برون‌بری/درون‌ریزی؛ در Swagger UI به‌صورت پیش‌فرض **`38`** مورد دیده می‌شود چون `/events` دارای `@Hidden` است و `/{id}/**` نیازمند `enableNestedSubResources = true` است). از `@AutoRestController(readDto, createDto, updateDto)` و `@RequestBody`/`@RequestParam`/`@PathVariable` پشتیبانی می‌کند.

### گروه ۱: پرس‌وجو، تحلیل و تولید کد کلاینت (`AutoApiReadController` — ۱۵ قرارداد)

| # | HTTP | زیرمسیر | متد | رفتار |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | صفحه‌بندی مبتنی بر افست با پشتیبانی از ۱۳ عملگر فیلتر، مرتب‌سازی چندستونی، بارگذاری هم‌زمان روابط و انتخاب فیلدها. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | صفحه‌بندی مکان‌نما با UUIDv7 با پیچیدگی O(1) بدون افت کارایی SQL OFFSET در جدول‌های بزرگ. |
| 3 | `GET` | `/all` | `getAll` | تمامی رکوردهای منطبق با فیلترهای پویا را برای فهرست‌های کشویی و جدول‌های مرجع برمی‌گرداند. |
| 4 | `GET` | `/count` | `count` | شمارشگر SQL COUNT(*) را مطابق با گزاره‌های فیلتر پویا اجرا می‌کند. |
| 5 | `GET` | `/exists` | `exists` | بررسی بولی سریع که در صورت وجود دست‌کم یک رکورد منطبق مقدار true برمی‌گرداند. |
| 6 | `GET` | `/aggregate` | `aggregate` | مقادیر تجمعی SQL شامل SUM، AVG، MIN، MAX و COUNT را روی فیلدهای عددی محاسبه می‌کند. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | مقادیر یکتا و بدون تکرار را برای منوهای فیلتر دسته‌ای بازیابی می‌کند. |
| 8 | `GET` | `/top` | `findTopRecords` | N موجودیت برتر مرتب‌شده را برای جدول رتبه‌بندی و هشدارها بازمی‌گرداند. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | معیارهای تجمیع پویای GROUP BY برای نمودارها و گزارش‌های هوش تجاری. |
| 10 | `GET` | `/metadata` | `getMetadata` | تعاریف فیلدهای JPA، محدودیت‌های اعتبارسنجی Jakarta و فراداده دسترسی RBAC را ارائه می‌دهد. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | واسط‌های TypeScript آماده کپی را مستقیماً از فیلدهای JPA تولید می‌کند. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | قراردادهای JSON Schema Draft را برای فرم‌سازهای پویا تولید می‌کند. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | طرح‌واره اعتبارسنجی Zod را از طریق ZodAndClientGeneratorUtil به‌صورت text/plain تولید می‌کند. |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | ماژول کلاینت تایپ‌شده TypeScript Fetch را همراه با تجزیه Zod و توابع CRUD تولید می‌کند. |
| 15 | `GET` | `/{id}` | `getById` | یک موجودیت را با UUIDv7 واکشی کرده و پوشانش @FieldSecurity و ETag مربوط به @HttpCacheable را اعمال می‌کند. |

### گروه ۲: نوشتن، دسته‌ای، Upsert، Patch، حذف و بازیابی (`AutoWriteApi` + `AutoBatchApi` — ۱۰ قرارداد)

| # | HTTP | زیرمسیر | متد | رفتار |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | موجودیت جدیدی را همراه با اعتبارسنجی، @AutoCode، @AutoSlug، @UniqueField و @ComputedField ایجاد می‌کند. |
| 17 | `POST` | `/batch` | `createBatch` | مجموعه‌ای اعتبارسنجی‌شده را در قالب یک تراکنش اتمیک واحد درج می‌کند. |
| 18 | `POST` | `/upsert` | `upsert` | بر اساس کلیدهای @UniqueField یا شناسه UUIDv7 به‌صورت اتمیک درج یا به‌روزرسانی می‌کند. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | درج و به‌روزرسانی گروهی تراکنشی را روی آرایه‌ای از رکوردها اجرا می‌کند. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | دسته‌های بزرگ را در بخش‌های قابل پیکربندی پردازش کرده و گزارش BatchExecutionResultDto هر آیتم را برمی‌گرداند. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | تمام رکوردهای منطبق با فیلترهای آدرس را با فیلدهای غیرتهی بدنه درخواست به‌صورت جزئی به‌روزرسانی می‌کند. |
| 22 | `PUT` | `/{id}` | `update` | به‌روزرسانی کامل موجودیت ضمن حفظ ستون‌های ممیزی سمت سرور. |
| 23 | `PATCH` | `/{id}` | `patch` | ادغام جزئی که تنها فیلدهای غیرتهی ورودی را روی موجودیت فعلی اعمال می‌کند. |
| 24 | `DELETE` | `/{id}` | `deleteById` | پس از بررسی deleteRoles در @EntitySecurity و deletableStates در @StateMachine رکورد را به‌صورت نرم حذف می‌کند. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | موجودیت حذف‌شده نرم را دوباره به وضعیت فعال و قابل جست‌وجو بازمی‌گرداند. |

### گروه ۳: چرخه حیات سازمانی، هوش مصنوعی، RFC 6902 و استریمینگ (`AutoApiEnterpriseController` — ۱۱ قرارداد)

| # | HTTP | زیرمسیر | متد | رفتار |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | تغییرات عددی مثبت یا منفی را به‌صورت اتمیک و بدون تداخل خواندن-نوشتن اعمال می‌کند. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | انتقال معتبر @StateMachine به targetState را اجرا کرده و رویدادهای ممیزی و وب‌هوک را منتشر می‌کند. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | یک موجودیت را با صدور شناسه UUIDv7 جدید و تولید مجدد فیلدهای @AutoCode کپی می‌کند. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | جریان زنده رویدادهای SSE (به‌دلیل نوع MIME یعنی text/event-stream در Swagger UI با @Hidden مخفی است). |
| 30 | `GET` | `/ai/context` | `getAiContext` | طرح‌واره‌های ابزار JSON برای LLM را جهت توصیف فیلدها و عملگرهای فیلتر خروجی می‌گیرد. |
| 31 | `POST` | `/ai/query` | `queryAi` | دستورات زبان طبیعی را به پرس‌وجوهای امن، محدود و پارامتری JPA Criteria ترجمه می‌کند. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | گذارهای کامپایل‌شده @HumanPolicy، نقش‌های RBAC و بازنویسی‌های YAML را برمی‌گرداند. |
| 33 | `GET` | `/health` | `getEntityHealth` | وضعیت جدول پایگاه داده پشتیبان و تعداد رکوردهای هر موجودیت را بررسی می‌کند. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | عملیات ساختاریافته RFC 6902 JSON Patch (شامل replace، add و remove) را اعمال می‌کند. |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | تفاوت‌های فیلدبه‌فیلد میان دو رکورد فعال موجودیت (id در برابر targetId) را محاسبه می‌کند. |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | پیمایش بازگشتی روابط زیرمنبع (فعال‌سازی با @AutoRestController(enableNestedSubResources = true)). |

### گروه ۴: برون‌بری و درون‌ریزی انبوه CSV و JSONL (`AutoExportImportApi` — ۴ قرارداد)

| # | HTTP | زیرمسیر | متد | رفتار |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | موجودیت‌های فیلترشده را در قالب CSV مطابق استاندارد RFC-4180 خروجی می‌گیرد. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | ردیف‌های منطبق را به‌صورت جریان JSON خط‌به‌خط با نوع application/x-ndjson ارسال می‌کند. |
| 39 | `POST` | `/import/csv` | `importCsv` | داده‌های متنی خام RFC-4180 CSV را در دسته‌های تقسیم‌شده وارد می‌کند. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | مجموعه‌داده‌های NDJSON خط‌به‌خط را به‌صورت جریانی وارد می‌کند. |

---

## 2. کنترلرهای داخلی پلتفرم

| مسیر / پیشوند | کنترلر | مسئولیت و قفل امنیتی تولید |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio ۲۰ زبانه (پشتیبانی RTL برای `ar`، `fa`، `ur`)؛ هنگام `app.framework.studio.enabled=false` کد `401` برمی‌گرداند |
| `GET /system/studio/eject` | `DevEjectionController` | خروجی کد استاندارد Spring MVC (Controller/Service/Repository)؛ محافظت‌شده با `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | صدور JWT آزمایشی HMAC-SHA512؛ هنگام `demo-token-endpoint-enabled=false` کد `404` برمی‌گرداند |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`، `GET /download/{fileId}`، `GET /metadata/{fileId}`، `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`، `POST ""`، `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | بازسازی وضعیت موجودیت در یک برچسب زمانی ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | بازرسی بین‌های SPI فعال در `7` گروه تله‌متری اصلی `*Customizer` (`StorageCustomizer` از طریق `StorageCustomizerRegistryHelper` مدیریت می‌شود، مجموعاً `8` SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | معیارهای زنده سلامت مدارشکن‌های Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | بررسی سلامت چند پایگاه داده |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | زمینه فعال MDC برای W3C `traceparent` و شناسه UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | تبدیل خطاهای کانتینر Tomcat (`400/404/405/413/431/500`) به پاسخ یکپارچه `ApiResponse<Void>` |
