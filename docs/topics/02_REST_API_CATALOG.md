# 02. Danh Mục 40 Hợp Đồng REST/Stream/Schema & Bộ Điều Khiển Hệ Thống (`0.1.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/02_REST_API_CATALOG.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. 40 Hợp Đồng `@Auto*` Có Thể Ghép Nối (`38` Mặc Định Trên Swagger UI)

Khi interface mở rộng `AutoApiController<E>` (hoặc chọn từng nhóm capability từ `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`), `DynamicControllerProxyRegistrarHelper` và `SpringMvcEndpointBridge` tổng hợp tối đa **40** hợp đồng (`15` Read trong `AutoApiReadController` + `10` Write/Batch trong `AutoWriteApi`/`AutoBatchApi` + `11` Enterprise trong `AutoApiEnterpriseController` + `4` Export/Import trong `AutoExportImportApi`; **`38`** hiển thị mặc định trên Swagger UI và badge `/system/studio` vì `/events` gắn `@Hidden` và `/{id}/**` mặc định tắt trừ khi bật `enableNestedSubResources = true`). Hỗ trợ `@AutoRestController(readDto, createDto, updateDto)` (minh họa thực tế bởi `ProductReadDto` trên `ProductCatalogReadOnlyController`) và annotation chuẩn Spring MVC `@RequestBody`, `@RequestParam`, `@PathVariable`.

### Nhóm 1: Đọc, Phân Trang, Thống Kê & Sinh Hợp Đồng Client (`AutoApiReadController` — 15 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Phân trang chuẩn kèm lọc động 13 toán tử, sắp xếp đa trường, `?expand=` và `fields=...` |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Phân trang con trỏ UUIDv7 2 chiều `ASC`/`DESC` độ phức tạp seek $O(1)$ (`afterId`, `dir`, `size`, probe `size+1`) |
| 3 | `GET` | `/all` | `getAll` | Trả về danh sách khớp bộ lọc không phân trang, giới hạn bởi `max-unpaged-fetch-limit` |
| 4 | `GET` | `/count` | `count` | Đếm số lượng bản ghi khớp bộ lọc động |
| 5 | `GET` | `/exists` | `exists` | Kiểm tra nhanh sự tồn tại bản ghi theo bộ lọc |
| 6 | `GET` | `/aggregate` | `aggregate` | Thống kê `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` trên trường số |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Lấy danh sách giá trị duy nhất trên trường chỉ định |
| 8 | `GET` | `/top` | `findTopRecords` | Trích xuất top N bản ghi sắp xếp theo trường mục tiêu |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Thống kê phân nhóm (`GROUP BY`) cho biểu đồ và báo cáo |
| 10 | `GET` | `/metadata` | `getMetadata` | Siêu dữ liệu trường JPA, nhãn validation và luật bảo mật |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Sinh mã nguồn TypeScript `interface` |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Sinh JSON Schema tương thích form động |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Sinh Zod validation schema qua `ZodAndClientGeneratorUtil` |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Sinh Typed Fetch Client (`text/plain`) kèm `Zod` & CRUD methods |
| 15 | `GET` | `/{id}` | `getById` | Lấy chi tiết thực thể theo UUIDv7 (tích hợp `@HttpCacheable` ETag / `304`) |

### Nhóm 2: Ghi, Batch, Upsert, Patch, Xóa Mềm & Khôi Phục (`AutoWriteApi` + `AutoBatchApi` — 10 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Tạo mới thực thể kèm sinh `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@UniqueField` |
| 17 | `POST` | `/upsert` | `upsert` | Tự động tạo mới hoặc cập nhật theo khóa duy nhất |
| 18 | `PUT` | `/{id}` | `update` | Cập nhật toàn phần thực thể (`@Version` Optimistic Locking) |
| 19 | `PATCH` | `/{id}` | `patch` | Cập nhật từng phần trường khác `null` |
| 20 | `DELETE` | `/{id}` | `deleteById` | Xóa mềm (`Soft Delete`) kèm kiểm tra `@StateMachine` `deletableStates` |
| 21 | `POST` | `/{id}/restore` | `restoreById` | Khôi phục thực thể đã xóa mềm (`deleted=false`) |
| 22 | `POST` | `/batch` | `createBatch` | Chèn hàng loạt thực thể theo giao dịch |
| 23 | `POST` | `/upsert-batch` | `upsertBatch` | Upsert hàng loạt trong một batch |
| 24 | `POST` | `/batch-chunked` | `batchChunked` | Nạp phân mảnh lô lớn, cô lập lỗi từng bản ghi (`BatchExecutionResultDto`) |
| 25 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Cập nhật hàng loạt bản ghi thỏa điều kiện lọc |

### Nhóm 3: Doanh Nghiệp, State Machine, AI, Patch RFC 6902 & Streaming (`AutoApiEnterpriseController` — 11 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `POST` | `/{id}/transition` | `transitionState` | Chuyển đổi trạng thái hợp lệ theo `@StateMachine` (`targetState`) |
| 27 | `POST` | `/{id}/clone` | `cloneEntity` | Nhân bản bản ghi, tự cấp UUIDv7 và `@AutoCode` mới |
| 28 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Tăng/giảm trường số nguyên tử (`stock`, `balance`, `points`) |
| 29 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Áp dụng JSON Patch (`add` / `replace` / `remove`) chuẩn RFC 6902 |
| 30 | `GET` | `/{id}/diff` | `compareEntityDiff` | So sánh sai khác giữa hai bản ghi thực thể (`id` so với `?targetId={targetId}`) |
| 31 | `GET` | `/human-policy` | `getPolicySummary` | Tổng hợp quy tắc `@HumanPolicy` đang áp dụng lên thực thể |
| 32 | `GET` | `/health` | `getEntityHealth` | Trạng thái bảng dữ liệu, số lượng bản ghi và cấu hình chỉ mục |
| 33 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Luồng Server-Sent Events (SSE) đẩy thay đổi thực thể theo thời gian thực |
| 34 | `GET` | `/{id}/**` | `navigateSubResources` | Truy vấn cây quan hệ con đệ quy (kích hoạt khi `enableNestedSubResources = true`) |
| 35 | `GET` | `/ai/context` | `getAiContext` | Xuất JSON Tool Schema cho LLM Function Calling |
| 36 | `POST` | `/ai/query` | `queryAi` | Dịch truy vấn ngôn ngữ tự nhiên sang JPA Criteria tham số hóa |

### Nhóm 4: Xuất & Nhập Dữ Liệu CSV / JSONL (`AutoExportImportApi` — 4 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Xuất CSV chuẩn RFC-4180 theo luồng |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Xuất JSON Lines (`application/x-ndjson`) |
| 39 | `POST` | `/import/csv` | `importCsv` | Nạp hàng loạt từ thân `text/csv` thô RFC-4180 (`@AutoBody String`) |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Nạp hàng loạt từ thân JSON Lines thô (`@AutoBody String`) |

---

## 2. Bộ Điều Khiển Hệ Thống Tích Hợp Sẵn (Built-In Platform Controllers)

| Endpoint / Prefix | Bộ Điều Khiển | Vai Trò & Khóa Bảo Mật Production |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Live Studio đa 20 ngôn ngữ (RTL `ar`, `fa`, `ur`); khóa `401` khi `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Xuất mã nguồn Spring MVC Controller/Service/Repository; bảo vệ bởi `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Cấp phát demo JWT HMAC-SHA512; trả `404` khi `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Tái tạo trạng thái lịch sử tại mốc ISO-8601 UTC bằng `@AuditTrail` |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Thống kê các SPI bean thuộc 7 nhóm `*Customizer` chuẩn (`StorageCustomizer` quản lý riêng qua `StorageCustomizerRegistryHelper`, tổng `8` SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Trạng thái Resilience4j Circuit Breaker |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Trạng thái từng cụm nguồn dữ liệu (`Primary` / `Replica` / `Tenant`) |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Trích xuất W3C `traceparent` và UUIDv7 `X-Request-ID` từ SLF4J MDC |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Chuẩn hóa lỗi Tomcat `400/404/405/413/431/500` thành `ApiResponse<Void>` |
