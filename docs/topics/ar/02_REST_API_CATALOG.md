# 02. دليل 40 عقد REST مولد تلقائيًا ووحدات التحكم المدمجة للمنصة (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل (EN)](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#endpoints)

---

## 1. 40 عقد `@Auto*` قابل للتركيب لكل كيان (`38` متاحة افتراضيًا)

تؤدي وراثة `AutoApiController<E>` (أو تركيب `AutoReadApi` و`AutoKeysetApi` و`AutoAnalyticsApi` و`AutoSchemaApi` و`AutoExportImportApi` و`AutoWriteApi` و`AutoBatchApi` و`AutoWorkflowApi` و`AutoAiApi` انتقائيًا) إلى قيام `DynamicControllerProxyRegistrarHelper` و`SpringMvcEndpointBridge` بتسجيل حتى **40** عقدًا (`15` قراءة + `10` كتابة/دفعات + `11` مؤسسية + `4` تصدير/استيراد؛ ويظهر **`38`** افتراضيًا في Swagger UI لأن `/events` يحمل `@Hidden` و`/{id}/**` يتطلب `enableNestedSubResources = true`). يدعم `@AutoRestController(readDto, createDto, updateDto)` و`@RequestBody`/`@RequestParam`/`@PathVariable`.

### المجموعة 1: الاستعلام والتحليلات وتوليد شيفرة العميل (`AutoApiReadController` — 15 عقدًا)

| # | HTTP | المسار الفرعي | الدالة | السلوك |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | ترقيم الصفحات مع دعم 13 عامل تصفية، الفرز متعدد الأعمدة، الجلب المسبق للعلاقات، واختيار الحقول. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | ترقيم صفحات بمؤشر UUIDv7 بزمن O(1) دون تباطؤ فحص SQL OFFSET في الجداول الضخمة. |
| 3 | `GET` | `/all` | `getAll` | يُرجع جميع السجلات المطابقة للمرشحات الديناميكية للقوائم المنسدلة وجداول البحث. |
| 4 | `GET` | `/count` | `count` | ينفذ استعلام SQL COUNT(*) مطابقاً لشروط التصفية الديناميكية. |
| 5 | `GET` | `/exists` | `exists` | فحص منطقي سريع يُرجع true عند وجود سجل مطابق واحد على الأقل. |
| 6 | `GET` | `/aggregate` | `aggregate` | يحسب دوال SQL SUM وAVG وMIN وMAX وCOUNT على الحقول الرقمية. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | يجلب القيم الفريدة غير المكررة لقوائم التصفية المصنفة. |
| 8 | `GET` | `/top` | `findTopRecords` | يُرجع أعلى N من الكيانات المرتبة للوحات الصدارة والتنبيهات. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | مقاييس تجميع GROUP BY ديناميكية للرسوم البيانية وتقارير ذكاء الأعمال. |
| 10 | `GET` | `/metadata` | `getMetadata` | يعرض تعريفات حقول JPA وقيود Jakarta والبيانات الوصفية لصلاحيات RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | يولّد واجهات TypeScript جاهزة للنسخ مباشرة من حقول JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | يولّد عقود JSON Schema Draft لمنصات إنشاء النماذج الديناميكية. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | يُنشئ مخطط تحقق Zod وقت التشغيل عبر ZodAndClientGeneratorUtil بصيغة text/plain. |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | يولّد وحدة عميل TypeScript Fetch محكومة الأنواع مع تحليل Zod ودوال CRUD. |
| 15 | `GET` | `/{id}` | `getById` | يجلب كياناً واحداً بواسطة UUIDv7 مع تطبيق حجب @FieldSecurity ووسوم ETag من @HttpCacheable. |

### المجموعة 2: الكتابة والدفعات وUpsert وPatch والحذف والاستعادة (`AutoWriteApi` + `AutoBatchApi` — 10 عقود)

| # | HTTP | المسار الفرعي | الدالة | السلوك |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | ينشئ كياناً جديداً مع تفعيل التحقق، و@AutoCode، و@AutoSlug، و@UniqueField، و@ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | يدرج مجموعة بيانات تم التحقق منها ضمن معاملة ذرية واحدة. |
| 18 | `POST` | `/upsert` | `upsert` | يدرج أو يحدّث ذرياً اعتماداً على حقول @UniqueField أو معرّف UUIDv7 الصريح. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | ينفذ عملية إدراج وتحديث جماعية ضمن معاملة على مصفوفة سجلات. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | يعالج الدفعات الكبيرة بأجزاء قابلة للضبط مع إرجاع تشخيص BatchExecutionResultDto لكل عنصر. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | يحدّث جزئياً كل سجل يطابق مرشحات الرابط باستخدام الحقول غير الفارغة في جسم الطلب. |
| 22 | `PUT` | `/{id}` | `update` | تحديث كامل للكيان مع الحفاظ على أعمدة التدقيق الخادمية. |
| 23 | `PATCH` | `/{id}` | `patch` | دمج جزئي ينسخ الحقول غير الفارغة الواردة فقط فوق الكيان الحالي. |
| 24 | `DELETE` | `/{id}` | `deleteById` | يحذف السجل منطقياً بعد التحقق من deleteRoles في @EntitySecurity وdeletableStates في @StateMachine. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | يستعيد كياناً محذوفاً منطقياً إلى نطاق الاستعلامات النشطة. |

### المجموعة 3: دورة الحياة المؤسسية والذكاء الاصطناعي وRFC 6902 والبث (`AutoApiEnterpriseController` — 11 عقدًا)

| # | HTTP | المسار الفرعي | الدالة | السلوك |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | يطبق تغييرات رقمية موجبة أو سالبة بشكل ذري دون تعارضات القراءة والتعديل المتزامنة. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | ينفذ انتقال @StateMachine مُحققاً إلى targetState ويطلق أحداث التدقيق والويب هوك. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | ينسخ كياناً مع إصدار معرّف UUIDv7 جديد وإعادة توليد حقول @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | بث مباشر للأحداث عبر SSE (@Hidden في Swagger UI لأن نوع المحتوى text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | يصدّر مخططات أدوات LLM بصيغة JSON لوصف الحقول وعوامل التصفية. |
| 31 | `POST` | `/ai/query` | `queryAi` | يترجم أوامر اللغة الطبيعية إلى استعلامات JPA Criteria مقيدة ومعيارية آمنة. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | يُرجع قواعد انتقالات @HumanPolicy وأدوار RBAC وتخصيصات YAML المترجمة. |
| 33 | `GET` | `/health` | `getEntityHealth` | يفحص حالة جدول قاعدة البيانات الداعم وعدد السجلات لكل كيان. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | يطبق عمليات RFC 6902 JSON Patch المهيكلة (replace وadd وremove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | يحسب الفروقات الحقلية بين سجلين نشطين للكيان (id مقابل targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | تصفح متداخل للعلاقات الفرعية (يُفعل عبر @AutoRestController(enableNestedSubResources = true)). |

### المجموعة 4: التصدير والاستيراد الجماعي لـ CSV وJSONL (`AutoExportImportApi` — 4 عقود)

| # | HTTP | المسار الفرعي | الدالة | السلوك |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | يصدّر الكيانات المصفاة بصيغة CSV المتوافقة مع معيار RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | يبث السجلات المطابقة بصيغة JSON مفصولة بأسطر (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | يستورد حمولات CSV النصية بصيغة RFC-4180 على دفعات مجزأة. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | يستورد مجموعات بيانات NDJSON المتدفقة والمفصولة بأسطر. |

---

## 2. وحدات التحكم المدمجة للمنصة

| نقطة النهاية / البادئة | وحدة التحكم | المسؤولية وإغلاق الإنتاج |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio بـ 20 لغة (يدعم RTL للغات `ar` و`fa` و`ur`)؛ يُرجع `401` عند `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | يصدّر شيفرة Spring MVC قياسية (Controller/Service/Repository)؛ محمي بواسطة `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | يصدر رمز HMAC-SHA512 JWT للتجربة؛ يُرجع `404` عند `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload` و`GET /download/{fileId}` و`GET /metadata/{fileId}` و`POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema` و`POST ""` و`GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | إعادة بناء حالة الكيان عند طابع زمني محدد بتنسيق ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | فحص مكونات SPI النشطة عبر `7` مجموعات قياس `*Customizer` (تُدار `StorageCustomizer` عبر `StorageCustomizerRegistryHelper` بإجمالي `8` واجهات SPI) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | مقاييس الصحة الحية لقواطع الدائرة Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | فحص صحة مصادر البيانات المتعددة |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | سياق MDC النشط لـ W3C `traceparent` ومعرف UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | يحول أخطاء حاوية Tomcat (`400/404/405/413/431/500`) إلى استجابة `ApiResponse<Void>` موحدة |
