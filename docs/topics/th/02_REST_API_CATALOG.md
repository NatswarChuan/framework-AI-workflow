# 02. แคตตาล็อก 40 สัญญา REST ที่สร้างอัตโนมัติ และ Controller ระบบในตัว (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์ (EN)](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#endpoints)

---

## 1. 40 สัญญา `@Auto*` แบบเลือกประกอบได้ต่อหนึ่ง Entity (เปิดค่าเริ่มต้น `38` เส้นทาง)

การสืบทอด `AutoApiController<E>` (หรือเลือกประกอบ `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) จะให้ `DynamicControllerProxyRegistrarHelper` และ `SpringMvcEndpointBridge` ผูกสัญญาได้สูงสุด **40** เส้นทาง (`15` อ่าน + `10` เขียน/แบตช์ + `11` ระดับองค์กร + `4` นำเข้า/ส่งออก โดยแสดงบน Swagger UI ค่าเริ่มต้น **`38`** เส้นทางเพราะ `/events` ติด `@Hidden` และ `/{id}/**` ต้องเปิด `enableNestedSubResources = true`) รองรับ `@AutoRestController(readDto, createDto, updateDto)` และ `@RequestBody`/`@RequestParam`/`@PathVariable`

### กลุ่ม 1: ค้นหา วิเคราะห์ และสร้างโค้ดไคลเอนต์ (`AutoApiReadController` — 15 สัญญา)

| # | HTTP | เส้นทางย่อย | เมธอด | การทำงาน |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | แบ่งหน้าแบบ Offset รองรับตัวดำเนินการกรอง 13 แบบ เรียงหลายคอลัมน์ ดึงความสัมพันธ์ `?expand=` และเลือกฟิลด์เฉพาะได้ |
| 2 | `GET` | `/keyset` | `getKeysetPage` | แบ่งหน้าแบบเคอร์เซอร์ UUIDv7 ความเร็ว O(1) ไม่เกิดปัญหา SQL OFFSET ช้าบนตารางขนาดใหญ่ |
| 3 | `GET` | `/all` | `getAll` | คืนค่ารายการทั้งหมดที่ตรงตามตัวกรองแบบไดนามิกสำหรับดรอปดาวน์และตารางอ้างอิง |
| 4 | `GET` | `/count` | `count` | รันคำสั่ง SQL COUNT(*) ตามเงื่อนไขตัวกรองแบบไดนามิก |
| 5 | `GET` | `/exists` | `exists` | ตรวจสอบแบบบูลีนความเร็วสูง คืนค่า true เมื่อมีอย่างน้อยหนึ่งระเบียนตรงเงื่อนไข |
| 6 | `GET` | `/aggregate` | `aggregate` | คำนวณค่าสถิติ SQL SUM, AVG, MIN, MAX และ COUNT บนฟิลด์ตัวเลข |
| 7 | `GET` | `/distinct` | `findDistinctValues` | ดึงค่าที่ไม่ซ้ำกันสำหรับการสร้างตัวเลือกกรองข้อมูล |
| 8 | `GET` | `/top` | `findTopRecords` | คืนค่ารายการ N อันดับแรกที่เรียงลำดับแล้วสำหรับตารางจัดอันดับและการแจ้งเตือน |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | คำนวณสถิติจัดกลุ่ม GROUP BY แบบไดนามิกสำหรับกราฟและรายงาน BI |
| 10 | `GET` | `/metadata` | `getMetadata` | เปิดเผยโครงสร้างฟิลด์ JPA กฎตรวจสอบ Jakarta และเมทาดาต้าการมองเห็นตามสิทธิ์ RBAC |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | สร้างโค้ด TypeScript Interface พร้อมใช้งานโดยตรงจากฟิลด์ JPA |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | สร้างสัญญาโครงสร้าง JSON Schema Draft สำหรับตัวสร้างฟอร์มอัตโนมัติ |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | สังเคราะห์ Zod Validation Schema ผ่าน ZodAndClientGeneratorUtil ในรูปแบบ text/plain |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | สร้างโมดูลไคลเอนต์ TypeScript Fetch แบบมีชนิดข้อมูลพร้อม Zod และฟังก์ชัน CRUD |
| 15 | `GET` | `/{id}` | `getById` | ดึงข้อมูลรายการเดียวด้วย UUIDv7 พร้อมการปกปิดข้อมูล @FieldSecurity และ ETag @HttpCacheable |

### กลุ่ม 2: สร้าง แก้ไข แบตช์ Upsert Patch ลบ และกู้คืน (`AutoWriteApi` + `AutoBatchApi` — 10 สัญญา)

| # | HTTP | เส้นทางย่อย | เมธอด | การทำงาน |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | สร้างข้อมูลใหม่พร้อมตรวจสอบความถูกต้อง สร้างรหัส @AutoCode, @AutoSlug, ตรวจซ้ำ @UniqueField และคำนวณ @ComputedField |
| 17 | `POST` | `/batch` | `createBatch` | เพิ่มรายการข้อมูลที่ตรวจสอบแล้วหลายรายการพร้อมกันในหนึ่งทรานแซกชันแบบอะตอมมิก |
| 18 | `POST` | `/upsert` | `upsert` | เพิ่มหรืออัปเดตข้อมูลแบบอะตอมมิกโดยอ้างอิงคีย์ @UniqueField หรือ UUIDv7 ที่ระบุ |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | ดำเนินการอัปเดตหรือเพิ่มข้อมูลแบบกลุ่มภายในทรานแซกชันเดียว |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | ประมวลผลชุดข้อมูลขนาดใหญ่แบบแบ่งชิ้น พร้อมคืนผลการวินิจฉัย BatchExecutionResultDto รายรายการ |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | อัปเดตเฉพาะบางฟิลด์สำหรับทุกรายการที่ตรงเงื่อนไข URL โดยใช้ค่าที่ไม่เป็น null จาก body |
| 22 | `PUT` | `/{id}` | `update` | อัปเดตข้อมูลทั้งเอนทิตีโดยยังคงรักษาคอลัมน์ตรวจสอบของเซิร์ฟเวอร์ไว้ |
| 23 | `PATCH` | `/{id}` | `patch` | ผสานข้อมูลบางส่วนโดยคัดลอกเฉพาะฟิลด์ที่ไม่เป็น null ลงบนข้อมูลเดิม |
| 24 | `DELETE` | `/{id}` | `deleteById` | ลบข้อมูลแบบ Soft Delete หลังตรวจสอบสิทธิ์ @EntitySecurity และสถานะ @StateMachine deletableStates |
| 25 | `POST` | `/{id}/restore` | `restoreById` | กู้คืนข้อมูลที่ถูกลบแบบ Soft Delete กลับมาใช้งานในคิวรีปกติ |

### กลุ่ม 3: วงจรชีวิตองค์กร AI, RFC 6902 Patch และสตรีมมิง (`AutoApiEnterpriseController` — 11 สัญญา)

| # | HTTP | เส้นทางย่อย | เมธอด | การทำงาน |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | เพิ่มหรือลดค่าตัวเลขแบบอะตอมมิก ป้องกันปัญหา Read-Modify-Write แข่งขันกัน |
| 27 | `POST` | `/{id}/transition` | `transitionState` | เปลี่ยนสถานะตามกฎ @StateMachine ไปยัง targetState พร้อมส่งอีเวนต์ Audit และ Webhook |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | ทำสำเนาข้อมูลพร้อมออก UUIDv7 ใหม่และสร้างค่ารหัส @AutoCode ใหม่ |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | สตรีมเหตุการณ์แบบเรียลไทม์ผ่าน SSE (ซ่อนจาก Swagger UI ด้วย @Hidden เนื่องจากเป็น text/event-stream) |
| 30 | `GET` | `/ai/context` | `getAiContext` | ส่งออกโครงสร้างเครื่องมือ JSON สำหรับ LLM ที่อธิบายฟิลด์และตัวดำเนินการกรอง |
| 31 | `POST` | `/ai/query` | `queryAi` | แปลงคำสั่งภาษาธรรมชาติเป็นคิวรี JPA Criteria แบบมีพารามิเตอร์และจำกัดขอบเขตอย่างปลอดภัย |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | คืนค่ากฎ @HumanPolicy ที่คอมไพล์แล้ว บทบาท RBAC และการตั้งค่าทับจาก YAML |
| 33 | `GET` | `/health` | `getEntityHealth` | ตรวจสอบสถานะตารางฐานข้อมูลและจำนวนข้อมูลของแต่ละเอนทิตี |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | ใช้คำสั่ง JSON Patch มาตรฐาน RFC 6902 แบบมีโครงสร้าง (replace, add, remove) |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | เปรียบเทียบความแตกต่างรายฟิลด์ระหว่างข้อมูลเอนทิตีสองรายการ (id กับ targetId) |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | นำทางความสัมพันธ์แบบซ้อนลำดับขั้น (เปิดใช้งานผ่าน @AutoRestController(enableNestedSubResources = true)) |

### กลุ่ม 4: ส่งออก/นำเข้าข้อมูลจำนวนมาก CSV และ JSONL (`AutoExportImportApi` — 4 สัญญา)

| # | HTTP | เส้นทางย่อย | เมธอด | การทำงาน |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | ส่งออกข้อมูลที่กรองแล้วเป็นไฟล์ CSV ตามมาตรฐาน RFC-4180 |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | สตรีมข้อมูลที่ตรงเงื่อนไขในรูปแบบ JSON แยกบรรทัด application/x-ndjson |
| 39 | `POST` | `/import/csv` | `importCsv` | นำเข้าข้อความดิบ CSV มาตรฐาน RFC-4180 แบบแบ่งชุด |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | นำเข้าชุดข้อมูล NDJSON แบบแยกบรรทัดผ่านสตรีมมิง |

---

## 2. Controller แพลตฟอร์มในตัว

| Endpoint / พรีฟิกซ์ | Controller | หน้าที่และการล็อกใน Production |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio 20 ภาษา (รองรับ RTL `ar`, `fa`, `ur`) คืน `401` เมื่อ `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | ส่งออกโค้ด Spring MVC มาตรฐาน (Controller/Service/Repository) คุ้มครองโดย `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | ออกโทเคนเดโม HMAC-SHA512 JWT คืน `404` เมื่อ `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | สร้างสถานะของ Entity ย้อนหลังตามเวลา ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | ตรวจสอบ SPI Bean ที่ทำงานอยู่ใน `7` กลุ่มหลัก (`StorageCustomizer` แยกจัดการผ่าน `StorageCustomizerRegistryHelper` รวม `8` SPI) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | เมตริกสถานะสดของ Resilience4j Circuit Breaker |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | ตรวจสุขภาพแหล่งข้อมูลหลายฐานข้อมูล |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | บริบท MDC ปัจจุบันของ W3C `traceparent` และ UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | แปลงข้อผิดพลาดระดับ Tomcat (`400/404/405/413/431/500`) เป็น `ApiResponse<Void>` มาตรฐาน |
