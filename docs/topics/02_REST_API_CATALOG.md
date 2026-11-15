# 02. Danh Mục 40 Hợp Đồng REST/Stream/Schema & Bộ Điều Khiển Hệ Thống (`1.0.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/02_REST_API_CATALOG.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. 40 Hợp Đồng `@Auto*` Sinh Tự Động Cho Mỗi Entity (`38` Mặc Định Trên Swagger UI)

Khi interface mở rộng `AutoApiController<E>`, `DynamicControllerProxyRegistrarHelper` và `SpringMvcEndpointBridge` tổng hợp **40** hợp đồng (`17` Read + `11` Write + `12` Enterprise; **`38`** hiển thị mặc định trên Swagger UI và badge `/system/studio` vì `/events` gắn `@Hidden` và `/{id}/**` mặc định tắt trừ khi bật `enableNestedSubResources = true`).

### Nhóm 1: Đọc, Phân Trang, Thống Kê & Sinh Hợp Đồng Client (`AutoApiReadController` — 17 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Phân trang chuẩn kèm lọc động 13 toán tử, sắp xếp đa trường, `include=...` và `fields=...` |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Phân trang con trỏ UUIDv7 độ phức tạp seek $O(1)$ (`afterId`, `size`) |
| 3 | `GET` | `/all` | `getAll` | Trả về danh sách khớp bộ lọc không phân trang trang nhỏ |
| 4 | `GET` | `/count` | `count` | Đếm số lượng bản ghi khớp bộ lọc động |
| 5 | `GET` | `/exists` | `exists` | Kiểm tra nhanh sự tồn tại bản ghi theo bộ lọc |
| 6 | `GET` | `/aggregate` | `aggregate` | Thống kê `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` trên trường số |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Lấy danh sách giá trị duy nhất trên trường chỉ định |
| 8 | `GET` | `/top` | `findTopRecords` | Trích xuất top N bản ghi sắp xếp theo trường mục tiêu |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Thống kê phân nhóm (`GROUP BY`) cho biểu đồ và báo cáo |
| 10 | `GET` | `/export/csv` | `exportCsv` | Xuất CSV chuẩn RFC-4180 theo luồng |
| 11 | `GET` | `/export/jsonl` | `exportJsonl` | Xuất JSON Lines (`application/x-ndjson`) |
| 12 | `GET` | `/metadata` | `getMetadata` | Siêu dữ liệu trường JPA, nhãn validation và luật bảo mật |
| 13 | `GET` | `/schema/typescript` | `generateTypeScript` | Sinh mã nguồn TypeScript `interface` |
| 14 | `GET` | `/schema/json` | `getJsonSchema` | Sinh JSON Schema tương thích form động |
| 15 | `GET` | `/schema/zod` | `generateZodSchema` | Sinh Zod validation schema qua `ZodAndClientGeneratorUtil` |
| 16 | `GET` | `/schema/client` | `generateTypedApiClient` | Sinh Typed Fetch Client (`text/plain`) kèm `Zod` & CRUD methods |
| 17 | `GET` | `/{id}` | `getById` | Lấy chi tiết thực thể theo UUIDv7 (tích hợp `@HttpCacheable` ETag / `304`) |

### Nhóm 2: Ghi, Batch, Upsert, Patch, Xóa Mềm & Khôi Phục (`AutoApiController` — 11 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 18 | `POST` | `""` | `create` | Tạo mới thực thể kèm sinh `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@UniqueField` |
| 19 | `POST` | `/batch` | `createBatch` | Chèn hàng loạt thực thể theo giao dịch |
| 20 | `POST` | `/upsert` | `upsert` | Tự động tạo mới hoặc cập nhật theo khóa duy nhất |
| 21 | `POST` | `/upsert-batch` | `upsertBatch` | Upsert hàng loạt trong một batch |
| 22 | `POST` | `/batch-chunked` | `batchChunked` | Nạp phân mảnh lô lớn, cô lập lỗi từng bản ghi (`BatchExecutionResultDto`) |
| 23 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Tăng/giảm trường số nguyên tử (`stock`, `balance`, `points`) |
| 24 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Cập nhật hàng loạt bản ghi thỏa điều kiện lọc |
| 25 | `PUT` | `/{id}` | `update` | Cập nhật toàn phần thực thể |
| 26 | `PATCH` | `/{id}` | `patch` | Cập nhật từng phần trường khác `null` |
| 27 | `DELETE` | `/{id}` | `deleteById` | Xóa mềm (`Soft Delete`) kèm kiểm tra `@StateMachine` `deletableStates` |
| 28 | `POST` | `/{id}/restore` | `restoreById` | Khôi phục thực thể đã xóa mềm (`deleted=false`) |

### Nhóm 3: Doanh Nghiệp, State Machine, AI, Patch RFC 6902 & Streaming (`AutoApiEnterpriseController` — 12 Hợp Đồng)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 29 | `POST` | `/{id}/transition` | `transitionState` | Chuyển đổi trạng thái hợp lệ theo `@StateMachine` (`targetState`) |
| 30 | `POST` | `/{id}/clone` | `cloneEntity` | Nhân bản bản ghi, tự cấp UUIDv7 và `@AutoCode` mới |
| 31 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Luồng Server-Sent Events (SSE) đẩy thay đổi thực thể theo thời gian thực |
| 32 | `GET` | `/ai/context` | `getAiContext` | Xuất JSON Tool Schema cho LLM Function Calling |
| 33 | `POST` | `/ai/query` | `queryByNaturalLanguage` | Dịch truy vấn ngôn ngữ tự nhiên sang JPA Criteria tham số hóa |
| 34 | `GET` | `/human-policy` | `getPolicySummary` | Tổng hợp quy tắc `@HumanPolicy` đang áp dụng lên thực thể |
| 35 | `GET` | `/health` | `getEntityHealth` | Trạng thái bảng dữ liệu, số lượng bản ghi và cấu hình chỉ mục |
| 36 | `POST` | `/import/csv` | `importCsv` | Nạp hàng loạt từ tệp CSV RFC-4180 |
| 37 | `POST` | `/import/jsonl` | `importJsonl` | Nạp hàng loạt từ luồng JSON Lines |
| 38 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Áp dụng JSON Patch (`add` / `replace` / `remove`) chuẩn RFC 6902 |
| 39 | `GET` | `/{id}/diff` | `compareEntityDiff` | So sánh sai khác giữa phiên bản hiện tại và trạng thái quá khứ |
| 40 | `GET` | `/{id}/**` | `navigateSubResources` | Truy vấn cây quan hệ con đệ quy (kích hoạt khi `enableNestedSubResources = true`) |

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
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Thống kê các SPI bean thuộc 8 interface `*Customizer` |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Trạng thái Resilience4j Circuit Breaker |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Trạng thái từng cụm nguồn dữ liệu (`Primary` / `Replica` / `Tenant`) |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Trích xuất W3C `traceparent` và UUIDv7 `X-Request-ID` từ SLF4J MDC |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Chuẩn hóa lỗi Tomcat `400/404/405/413/431/500` thành `ApiResponse<Void>` |
