# 02. ৪০টি অটো-জেনারেটেড REST কন্ট্র্যাক্ট এবং প্ল্যাটফর্ম কন্ট্রোলার তালিকা (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#endpoints)

---

## 1. প্রতি এনটিটিতে ৪০টি কম্পোজেবল `@Auto*` কন্ট্র্যাক্ট (ডিফল্ট `38`টি দৃশ্যমান)

`AutoApiController<E>` এক্সটেন্ড করলে (বা `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi` বাছাই করে যুক্ত করলে) `DynamicControllerProxyRegistrarHelper` ও `SpringMvcEndpointBridge` সর্বোচ্চ **40**টি কন্ট্র্যাক্ট নিবন্ধন করে (`15` রিড + `10` রাইট/ব্যাচ + `11` এন্টারপ্রাইজ + `4` এক্সপোর্ট/ইমপোর্ট; `/events` `@Hidden` এবং `/{id}/**`-এ `enableNestedSubResources = true` লাগায় Swagger UI-তে ডিফল্ট **`38`**টি দেখায়)। `@AutoRestController(readDto, createDto, updateDto)` এবং `@RequestBody`/`@RequestParam`/`@PathVariable` সমর্থিত।

### গ্রুপ ১: কোয়েরি, অ্যানালিটিক্স ও ক্লায়েন্ট কোডজেন (`AutoApiReadController` — 15টি কন্ট্র্যাক্ট)

| # | HTTP | সাব-পাথ | মেথড | আচরণ |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | ১৩টি ফিল্টার অপারেটর, মাল্টি-কলাম সর্ট, ইগার-ফেচ include এবং স্পার্স ফিল্ড সমর্থিত অফসেট পেজিনেশন। |
| 2 | `GET` | `/keyset` | `getKeysetPage` | বড় টেবিলে SQL OFFSET স্ক্যান বিলম্ব ছাড়াই O(1) UUIDv7 কার্সার পেজিনেশন। |
| 3 | `GET` | `/all` | `getAll` | ড্রপডাউন এবং লুকআপ টেবিলের জন্য ডায়নামিক ফিল্টারের সাথে মিল থাকা সব রেকর্ড ফেরত দেয়। |
| 4 | `GET` | `/count` | `count` | ডায়নামিক ফিল্টার শর্তের সাথে মিল রেখে SQL COUNT(*) চালায়। |
| 5 | `GET` | `/exists` | `exists` | অন্তত একটি রেকর্ড মিললে true ফেরত দেওয়া দ্রুত বুলিয়ান যাচাই। |
| 6 | `GET` | `/aggregate` | `aggregate` | সংখ্যাসূচক অ্যাট্রিবিউটে SQL SUM, AVG, MIN, MAX এবং COUNT গণনা করে। |
| 7 | `GET` | `/distinct` | `findDistinctValues` | ফিল্টার ফ্যাসেট ড্রপডাউনের জন্য অনন্য মান সংগ্রহ করে। |
| 8 | `GET` | `/top` | `findTopRecords` | লিডারবোর্ড ও সতর্কতার জন্য শীর্ষ Nটি ক্রমবদ্ধ সত্তা ফেরত দেয়। |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | চার্ট ও BI রিপোর্টিংয়ের জন্য ডায়নামিক GROUP BY এগ্রিগেশন মেট্রিক্স। |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA ফিল্ড সংজ্ঞা, Jakarta সীমাবদ্ধতা এবং RBAC দৃশ্যমানতা মেটাডেটা প্রদান করে। |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | JPA ফিল্ড থেকে সরাসরি ব্যবহারযোগ্য TypeScript ইন্টারফেস তৈরি করে। |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | ফর্ম বিল্ডারের জন্য JSON Schema Draft কন্ট্র্যাক্ট তৈরি করে। |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil এর মাধ্যমে রানটাইম Zod ভ্যালিডেশন স্কিমা (text/plain) তৈরি করে। |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod পার্সিং ও CRUD হেল্পারসহ টাইপড TypeScript Fetch ক্লায়েন্ট মডিউল তৈরি করে। |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7 দিয়ে একটি সত্তা আনে এবং @FieldSecurity মাস্কিং ও @HttpCacheable ETag প্রয়োগ করে। |

### গ্রুপ ২: রাইট, ব্যাচ, Upsert, Patch, ডিলিট ও রিস্টোর (`AutoWriteApi` + `AutoBatchApi` — 10টি কন্ট্র্যাক্ট)

| # | HTTP | সাব-পাথ | মেথড | আচরণ |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation, @AutoCode, @AutoSlug, @UniqueField এবং @ComputedField প্রয়োগ করে নতুন সত্তা তৈরি করে। |
| 17 | `POST` | `/batch` | `createBatch` | একটি অ্যাটমিক ট্রানজ্যাকশনের ভেতরে যাচাইকৃত তালিকা একত্রে সংরক্ষণ করে। |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField কী বা প্রদত্ত UUIDv7 ID মিলিয়ে অ্যাটমিক ইনসার্ট বা আপডেট করে। |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | রেকর্ডের তালিকার ওপর ট্রানজ্যাকশনাল বাল্ক আপসার্ট পরিচালনা করে। |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | কনফিগারযোগ্য চাঙ্ক আকারে বড় ব্যাচ প্রসেস করে প্রতিটি আইটেমের BatchExecutionResultDto ফলাফল দেয়। |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | রিকোয়েস্ট বডির নন-নাল ফিল্ড ব্যবহার করে URL ফিল্টারের সাথে মিল থাকা সব রেকর্ড প্যাচ করে। |
| 22 | `PUT` | `/{id}` | `update` | সার্ভারের অডিট কলাম অক্ষুণ্ণ রেখে সম্পূর্ণ সত্তা আপডেট করে। |
| 23 | `PATCH` | `/{id}` | `patch` | বিদ্যমান সত্তায় কেবল নন-নাল ইনকামিং অ্যাট্রিবিউটগুলো কপি করে আংশিক মার্জ করে। |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles ও @StateMachine deletableStates যাচাই করে রেকর্ড সফট-ডিলিট করে। |
| 25 | `POST` | `/{id}/restore` | `restoreById` | পূর্বে সফট-ডিলিট করা সত্তাকে পুনরায় সক্রিয় কোয়েরিতে ফিরিয়ে আনে। |

### গ্রুপ ৩: এন্টারপ্রাইজ লাইফসাইকেল, AI, RFC 6902 ও স্ট্রিমিং (`AutoApiEnterpriseController` — 11টি কন্ট্র্যাক্ট)

| # | HTTP | সাব-পাথ | মেথড | আচরণ |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | ক্লায়েন্ট রেস কন্ডিশন ছাড়াই অ্যাটমিক ধনাত্মক বা ঋণাত্মক সংখ্যার পরিবর্তন প্রয়োগ করে। |
| 27 | `POST` | `/{id}/transition` | `transitionState` | বৈধ @StateMachine রূপান্তর targetState-এ কার্যকর করে এবং অডিট/ওয়েবহুক ইভেন্ট নির্গত করে। |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | নতুন UUIDv7 ID জারি ও @AutoCode ফিল্ড পুনরুৎপাদন করে একটি সত্তার অনুলিপি তৈরি করে। |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent Events (SSE) লাইভ ইভেন্ট স্ট্রিম (text/event-stream হওয়ায় Swagger UI-তে @Hidden)। |
| 30 | `GET` | `/ai/context` | `getAiContext` | ফিল্ড ও ফিল্টার অপারেটর বর্ণনাকারী LLM JSON টুল স্কিমা এক্সপোর্ট করে। |
| 31 | `POST` | `/ai/query` | `queryAi` | স্বাভাবিক ভাষার প্রম্পটকে নিরাপদ ও প্যারামিটারাইজড JPA Criteria কোয়েরিতে রূপান্তর করে। |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | কম্পাইল করা @HumanPolicy লাইফসাইকেল, RBAC ভূমিকা ও YAML ওভাররাইড ফেরত দেয়। |
| 33 | `GET` | `/health` | `getEntityHealth` | প্রতিটি সত্তার ডাটাবেস টেবিলের অবস্থা ও মোট রেকর্ডের সংখ্যা পরীক্ষা করে। |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | কাঠামোবদ্ধ RFC 6902 JSON Patch অপারেশন (replace, add, remove) প্রয়োগ করে। |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | দুটি সক্রিয় সত্তার রেকর্ডের (id বনাম targetId) মধ্যে ফিল্ড-ভিত্তিক পার্থক্য গণনা করে। |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | রিকার্সিভ রিলেশন নেভিগেশন (@AutoRestController(enableNestedSubResources = true) দিয়ে সক্রিয়যোগ্য)। |

### গ্রুপ ৪: CSV ও JSONL বাল্ক এক্সপোর্ট/ইমপোর্ট (`AutoExportImportApi` — 4টি কন্ট্র্যাক্ট)

| # | HTTP | সাব-পাথ | মেথড | আচরণ |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | ফিল্টার করা ডেটা RFC-4180 CSV ফরম্যাটে এক্সপোর্ট করে। |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | মিল থাকা সারিগুলো application/x-ndjson নিউলাইন-ডিলিমিটেড JSON হিসেবে স্ট্রিম করে। |
| 39 | `POST` | `/import/csv` | `importCsv` | চাঙ্কড ব্যাচে RFC-4180 CSV র পেলোড আমদানি করে। |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | স্ট্রিমিং নিউলাইন-ডিলিমিটেড NDJSON ডেটাসেট আমদানি করে। |

---

## 2. বিল্ট-ইন প্ল্যাটফর্ম কন্ট্রোলারসমূহ

| এন্ডপয়েন্ট / প্রিফিক্স | কন্ট্রোলার | দায়িত্ব ও প্রোডাকশন লকডাউন |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | ২০-ভাষার Developer Studio (RTL `ar`, `fa`, `ur`); `app.framework.studio.enabled=false` হলে `401` ফেরত দেয় |
| `GET /system/studio/eject` | `DevEjectionController` | স্ট্যান্ডার্ড Spring MVC কোড (Controller/Service/Repository) এক্সপোর্ট করে; `SurfaceAccessGuardrailUtil` দ্বারা সুরক্ষিত |
| `POST /api/v1/auth/token` | `AuthController` | ডেমো HMAC-SHA512 JWT তৈরি করে; `demo-token-endpoint-enabled=false` হলে `404` ফেরত দেয় |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | নির্দিষ্ট ISO-8601 UTC সময়ে এনটিটির ঐতিহাসিক অবস্থা পুনর্গঠন (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7`টি মূল টেলিমেট্রি `*Customizer` গ্রুপের সক্রিয় SPI বিন তালিকা (`StorageCustomizer` আলাদাভাবে `StorageCustomizerRegistryHelper`-এ পরিচালিত, মোট `8`টি SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Resilience4j সার্কিট ব্রেকারের লাইভ হেলথ মেট্রিক্স |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | মাল্টি-ডেটাসোর্স হেলথ চেক পরিদর্শন |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | সক্রিয় MDC কনটেক্সটে W3C `traceparent` এবং UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat কনটেইনার ত্রুটি (`400/404/405/413/431/500`)-কে একীভূত `ApiResponse<Void>`-এ রূপান্তর করে |
