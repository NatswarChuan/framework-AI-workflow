# 02. 40 ऑटो-जनरेटेड REST अनुबंध और प्लेटफ़ॉर्म कंट्रोलर सूची (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#endpoints)

---

## 1. प्रति एंटिटी 40 संयोज्य `@Auto*` अनुबंध (डिफ़ॉल्ट रूप से `38` सक्रिय)

`AutoApiController<E>` का विस्तार करने (या `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi` को चुनकर जोड़ने) पर `DynamicControllerProxyRegistrarHelper` और `SpringMvcEndpointBridge` अधिकतम **40** अनुबंध पंजीकृत करते हैं (`15` रीड + `10` राइट/बैच + `11` एंटरप्राइज + `4` एक्सपोर्ट/इम्पोर्ट; `/events` पर `@Hidden` होने और `/{id}/**` के लिए `enableNestedSubResources = true` आवश्यक होने से Swagger UI में डिफ़ॉल्ट **`38`** दिखते हैं)। `@AutoRestController(readDto, createDto, updateDto)` और `@RequestBody`/`@RequestParam`/`@PathVariable` समर्थित हैं।

### समूह 1: क्वेरी, एनालिटिक्स और क्लाइंट कोडजेन (`AutoApiReadController` — 15 अनुबंध)

| # | HTTP | उप-पथ | मेथड | व्यवहार |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 13 फ़िल्टर ऑपरेटरों, मल्टी-कॉलम सॉर्ट, ईगर-फ़ेच `?expand=` और स्पार्स फ़ील्ड्स के साथ ऑफ़सेट पेजिनेशन। |
| 2 | `GET` | `/keyset` | `getKeysetPage` | बड़ी तालिकाओं पर SQL OFFSET स्कैन गिरावट के बिना O(1) UUIDv7 कर्सर पेजिनेशन। |
| 3 | `GET` | `/all` | `getAll` | ड्रॉपडाउन और लुकअप तालिकाओं के लिए डायनेमिक फ़िल्टर से मेल खाने वाले सभी रिकॉर्ड लौटाता है। |
| 4 | `GET` | `/count` | `count` | डायनेमिक फ़िल्टर विधेयों से मेल खाने वाली SQL COUNT(*) क्वेरी निष्पादित करता है। |
| 5 | `GET` | `/exists` | `exists` | कम से कम एक रिकॉर्ड मिलने पर true लौटाने वाली त्वरित बूलियन जांच। |
| 6 | `GET` | `/aggregate` | `aggregate` | संख्यात्मक गुणों पर SQL SUM, AVG, MIN, MAX और COUNT की गणना करता है। |
| 7 | `GET` | `/distinct` | `findDistinctValues` | फ़िल्टर फ़ैसेट ड्रॉपडाउन के लिए अद्वितीय मान (DISTINCT) प्राप्त करता है। |
| 8 | `GET` | `/top` | `findTopRecords` | लीडरबोर्ड और अलर्ट के लिए क्रमबद्ध शीर्ष N संस्थाएं लौटाता है। |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | चार्ट और BI रिपोर्टिंग के लिए डायनेमिक GROUP BY एग्रीगेशन मेट्रिक्स। |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA फ़ील्ड परिभाषाएं, Jakarta बाधाएं और RBAC दृश्यता मेटाडेटा प्रदान करता है। |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | JPA फ़ील्ड्स से सीधे कॉपी-रेडी TypeScript इंटरफ़ेस उत्पन्न करता है। |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | फ़ॉर्म बिल्डरों के लिए JSON Schema Draft अनुबंध उत्पन्न करता है। |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil के माध्यम से रनटाइम Zod सत्यापन स्कीमा (text/plain) बनाता है। |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod पार्सिंग और CRUD हेल्पर्स के साथ टाइप्ड TypeScript Fetch क्लाइंट मॉड्यूल तैयार करता है। |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7 द्वारा एक इकाई प्राप्त करता है और @FieldSecurity मास्किंग तथा @HttpCacheable ETag लागू करता है। |

### समूह 2: लेखन, बैच, Upsert, Patch, विलोपन और पुनर्स्थापना (`AutoWriteApi` + `AutoBatchApi` — 10 अनुबंध)

| # | HTTP | उप-पथ | मेथड | व्यवहार |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation, @AutoCode, @AutoSlug, @UniqueField और @ComputedField के साथ एक नई इकाई बनाता है। |
| 17 | `POST` | `/batch` | `createBatch` | एक ही परमाणु लेनदेन के भीतर सत्यापित संग्रह को सम्मिलित करता है। |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField कुंजी या स्पष्ट UUIDv7 ID के आधार पर परमाणु रूप से इंसर्ट या अपडेट करता है। |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | रिकॉर्ड की एक सरणी पर ट्रांज़ैक्शनल बल्क अप्सर्ट निष्पादित करता है। |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | कॉन्फ़िगरेबल चंक आकार में बड़े बैच संसाधित करता है और प्रति-आइटम BatchExecutionResultDto डायग्नोस्टिक्स लौटाता है। |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | बॉडी से गैर-शून्य फ़ील्ड का उपयोग करके URL फ़िल्टर विधेयों से मेल खाने वाले प्रत्येक रिकॉर्ड को पैच करता है। |
| 22 | `PUT` | `/{id}` | `update` | सर्वर ऑडिट कॉलम सुरक्षित रखते हुए पूर्ण इकाई अपडेट करता है। |
| 23 | `PATCH` | `/{id}` | `patch` | मौजूदा इकाई पर केवल गैर-शून्य आने वाले गुणों को कॉपी करके आंशिक मर्ज करता है। |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles और @StateMachine deletableStates सत्यापित कर रिकॉर्ड को सॉफ्ट-डिलीट करता है। |
| 25 | `POST` | `/{id}/restore` | `restoreById` | पहले से सॉफ्ट-डिलीट की गई इकाई को पुनः सक्रिय क्वेरी में बहाल करता है। |

### समूह 3: एंटरप्राइज लाइफसाइकिल, AI, RFC 6902 और स्ट्रीमिंग (`AutoApiEnterpriseController` — 11 अनुबंध)

| # | HTTP | उप-पथ | मेथड | व्यवहार |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | क्लाइंट रीड-मॉडिफ़ाई-राइट रेस के बिना परमाणु सकारात्मक या नकारात्मक संख्यात्मक डेल्टा लागू करता है। |
| 27 | `POST` | `/{id}/transition` | `transitionState` | targetState पर मान्य @StateMachine संक्रमण निष्पादित करता है और ऑडिट/वेबहुक ईवेंट भेजता है। |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | नया UUIDv7 ID जारी करते हुए और @AutoCode फ़ील्ड्स पुनः बनाते हुए इकाई की प्रतिलिपि बनाता है। |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent Events (SSE) लाइव एंटिटी स्ट्रीम (MIME text/event-stream होने के कारण Swagger UI में @Hidden)। |
| 30 | `GET` | `/ai/context` | `getAiContext` | फ़ील्ड और फ़िल्टर ऑपरेटरों का वर्णन करने वाले LLM JSON टूल स्कीमा निर्यात करता है। |
| 31 | `POST` | `/ai/query` | `queryAi` | प्राकृतिक भाषा के संकेतों को सीमित और पैरामीटरीकृत JPA Criteria क्वेरी में बदलता है। |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | संकलित @HumanPolicy जीवनचक्र संक्रमण, RBAC भूमिकाएं और YAML ओवरराइड लौटाता है। |
| 33 | `GET` | `/health` | `getEntityHealth` | प्रत्येक इकाई के डेटाबेस तालिका की स्थिति और रिकॉर्ड संख्या की जांच करता है। |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | संरचित RFC 6902 JSON Patch संचालन (replace, add, remove) लागू करता है। |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | दो जीवंत इकाई रिकॉर्ड (id बनाम targetId) के बीच फ़ील्ड-दर-फ़ील्ड अंतर की गणना करता है। |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | पुनरावर्ती संबंध नेविगेशन (@AutoRestController(enableNestedSubResources = true) से सक्रिय)। |

### समूह 4: CSV और JSONL बल्क एक्सपोर्ट/इम्पोर्ट (`AutoExportImportApi` — 4 अनुबंध)

| # | HTTP | उप-पथ | मेथड | व्यवहार |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | फ़िल्टर की गई संस्थाओं को RFC-4180 CSV प्रारूप में निर्यात करता है। |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | मेल खाने वाली पंक्तियों को application/x-ndjson के रूप में स्ट्रीम करता है। |
| 39 | `POST` | `/import/csv` | `importCsv` | चंक्ड बैचों में RFC-4180 CSV रॉ बॉडी पेलोड आयात करता है। |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | स्ट्रीमिंग न्यूलाइन-डिलिमिटेड NDJSON डेटासेट आयात करता है। |

---

## 2. अंतर्निहित प्लेटफ़ॉर्म कंट्रोलर

| एंडपॉइंट / उपसर्ग | कंट्रोलर | जिम्मेदारी और प्रोडक्शन लॉकडाउन |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20-भाषा Developer Studio (RTL `ar`, `fa`, `ur`); `app.framework.studio.enabled=false` होने पर `401` लौटाता है |
| `GET /system/studio/eject` | `DevEjectionController` | मानक Spring MVC कोड (Controller/Service/Repository) निर्यात करता है; `SurfaceAccessGuardrailUtil` द्वारा सुरक्षित |
| `POST /api/v1/auth/token` | `AuthController` | डेमो HMAC-SHA512 JWT जारी करता है; `demo-token-endpoint-enabled=false` होने पर `404` लौटाता है |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | निर्दिष्ट ISO-8601 UTC समय पर एंटिटी की स्थिति का पुनर्निर्माण (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7` मुख्य टेलीमेट्री `*Customizer` समूहों में सक्रिय SPI बीन्स का निरीक्षण (`StorageCustomizer` अलग से `StorageCustomizerRegistryHelper` द्वारा प्रबंधित, कुल `8` SPI) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Resilience4j सर्किट ब्रेकर के लाइव स्वास्थ्य मेट्रिक्स |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | मल्टी-डेटासोर्स स्वास्थ्य परीक्षण |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | सक्रिय MDC संदर्भ में W3C `traceparent` और UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat कंटेनर त्रुटियों (`400/404/405/413/431/500`) को मानक `ApiResponse<Void>` में रूपांतरित करता है |
