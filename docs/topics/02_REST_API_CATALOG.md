# 02. Danh Mục 38 Endpoint Tự Động & Phân Hệ Nền Tảng

> **Ngôn ngữ**: Tiếng Việt | [English](en/02_REST_API_CATALOG.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. Bảng Toàn Bộ 38 Hợp Đồng `@Auto*` Theo Controller Interface

Khi interface mở rộng `AutoApiController<E>`, `DynamicControllerProxyRegistrarHelper` và `SpringMvcEndpointBridge` tổng hợp **38 phương thức** (`36` hiển thị mặc định trên Swagger UI / `/system/studio`; `/events` mang `@Hidden` và `/{id}/**` yêu cầu kích hoạt `enableNestedSubResources`).

### 1.1 Nhóm Đọc, Phân Tích & Xuất Schema (`AutoApiReadController<E>` — 15 Endpoint)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/` | `getPage` | Phân trang offset (`page`, `size`), `sort`, `dir`, `search`, `fields`, 13 toán tử lọc |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Phân trang con trỏ $O(1)$ qua tham số UUIDv7 `afterId` |
| 3 | `GET` | `/all` | `getAll` | Truy xuất danh sách đầy đủ khớp bộ lọc |
| 4 | `GET` | `/count` | `count` | Trả về `Long` tổng bản ghi khớp bộ lọc |
| 5 | `GET` | `/exists` | `exists` | Trả về `Boolean` tồn tại bản ghi khớp |
| 6 | `GET` | `/aggregate` | `aggregate` | Tính `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` trên `field` |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Liệt kê tập giá trị phân biệt của `field` |
| 8 | `GET` | `/top` | `findTopRecords` | Lấy danh sách N bản ghi đứng đầu (`limit`, `sort`, `dir`) |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Gom nhóm thống kê theo `groupField` trên `valueField` |
| 10 | `GET` | `/export/csv` | `exportCsv` | Streaming CSV chuẩn RFC-4180 tiêu tốn RAM O(1) |
| 11 | `GET` | `/export/jsonl` | `exportJsonl` | Streaming NDJSON (`application/x-ndjson`) |
| 12 | `GET` | `/metadata` | `getMetadata` | Xuất cấu trúc trường và định nghĩa `@StateMachine` |
| 13 | `GET` | `/schema/typescript` | `generateTypeScript` | Tự sinh `interface` TypeScript từ metadata Entity |
| 14 | `GET` | `/schema/json` | `getJsonSchema` | Tự sinh JSON Schema Draft-07 |
| 15 | `GET` | `/{id}` | `getById` | Lấy chi tiết theo khóa chính UUIDv7, hỗ trợ `include` và `@FieldSecurity` |

### 1.2 Nhóm Ghi, Upsert & Xử Lý Lô (`AutoApiController<E>` — 11 Endpoint)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `/` | `create` | Khởi tạo thực thể mới với `@Valid`, `@UniqueField`, `@AutoCode`, `@AutoSlug` |
| 17 | `POST` | `/batch` | `createBatch` | Lưu danh sách bản ghi trong một transaction |
| 18 | `POST` | `/upsert` | `upsert` | Cập nhật nếu trùng `@UniqueField`, ngược lại tạo mới |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Upsert theo lô |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Tách mảng lớn thành từng phân đoạn `chunkSize` (mặc định `100`) |
| 21 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Tăng/giảm trường số nguyên tử (`?field=...&delta=...`) |
| 22 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Cập nhật đồng loạt theo điều kiện truy vấn |
| 23 | `PUT` | `/{id}` | `update` | Thay thế toàn phần thực thể theo UUIDv7 `id` |
| 24 | `PATCH` | `/{id}` | `patch` | Cập nhật từng phần giữ nguyên trường không gửi |
| 25 | `DELETE` | `/{id}` | `deleteById` | Xóa mềm kiểm tra trạng thái cho phép bởi `@StateMachine` |
| 26 | `POST` | `/{id}/restore` | `restoreById` | Phục hồi thực thể đã xóa mềm |

### 1.3 Nhóm Nghiệp Vụ Mở Rộng (`AutoApiEnterpriseController<E>` — 12 Endpoint)

| # | HTTP | Đường Dẫn | Phương Thức | Mô Tả Kỹ Thuật |
| :-: | :--- | :--- | :--- | :--- |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Chuyển đổi trạng thái (`?targetState=...`), trả `422` nếu vi phạm đồ thị |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Nhân bản sang thực thể mới với UUIDv7 mới và `@AutoCode` mới |
| 29 | `GET` | `/events` | `streamEvents` | Luồng SSE thời gian thực (`@Hidden` trên Swagger) |
| 30 | `GET` | `/ai/context` | `getAiContext` | Xuất mô tả schema cho Spring AI `ChatClient` |
| 31 | `POST` | `/ai/query` | `queryAi` | Biên dịch truy vấn ngôn ngữ tự nhiên thành Criteria an toàn |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Đọc luật nghiệp vụ hợp nhất từ `@HumanPolicy` và YAML |
| 33 | `GET` | `/health` | `getEntityHealth` | Trạng thái Circuit Breaker và độ sẵn sàng |
| 34 | `POST` | `/import/csv` | `importCsv` | Nạp hàng loạt tệp CSV RFC-4180 |
| 35 | `POST` | `/import/jsonl` | `importJsonl` | Nạp hàng loạt định dạng NDJSON |
| 36 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Áp dụng phép toán JSON Patch (`add`/`replace`/`remove`) chuẩn RFC 6902 |
| 37 | `GET` | `/{id}/diff` | `compareEntityDiff` | So sánh trường giữa `{id}` và `?targetId={uuid}` (`MODIFIED`, `ADDED`, `REMOVED`) |
| 38 | `GET` | `/{id}/**` | `navigateSubResources` | Truy vấn quan hệ lồng nhau đa tầng (cần `enableNestedSubResources=true`) |

---

## 2. Các Controller Nền Tảng Tích Hợp Sẵn

| Đường Dẫn | Controller | Ghi Chú Vận Hành |
| :--- | :--- | :--- |
| `/system/studio` (`@Hidden`) | `DevStudioController` | Giao diện Live API Studio 20 ngôn ngữ (chỉ bật khi `app.framework.studio.enabled=true`) |
| `POST /api/v1/auth/token` | `AuthController` | Cấp phát token thử nghiệm (chỉ bật khi `demo-token-endpoint-enabled=true`) |
| `/api/v1/storage/*` (6 API) | `FileStorageController` | Upload, download, metadata, xóa, pre-signed URL, exists (`LOCAL`/`S3`/`GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `POST /graphql`, `GET /graphql/schema`, `GET /graphql/explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Tái tạo bản ghi lịch sử tại `?timestamp=...` |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Kiểm kê SPI Customizer Bean |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Chỉ số Circuit Breaker thực thể |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Trạng thái cụm Primary/Replica |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Đọc ngữ cảnh `X-Request-ID` / `traceparent` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Chuẩn hóa lỗi Tomcat `400/404/405/413/431/500` về `ApiResponse<Void>` |
