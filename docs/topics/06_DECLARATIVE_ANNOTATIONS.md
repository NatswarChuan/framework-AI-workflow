# 06. Đặc Tả Chú Thích Khai Báo (Declarative Annotations)

> **Ngôn ngữ**: Tiếng Việt | [English](en/06_DECLARATIVE_ANNOTATIONS.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. Tổng Quan Phân Nhóm Chú Thích Cốt Lõi

Framework cung cấp 41 annotation Pure Java trong `io.github.natswarchuan.core.annotation` và các phân hệ `module.*.annotation`. Dưới đây là đặc tả thuộc tính và cơ chế vận hành của các chú thích trọng tâm.

---

## 2. Chú Thích Định Tuyến & Proxy (`Controller`)

### `@AutoRestController` (`ElementType.TYPE`)

| Thuộc Tính | Kiểu / Mặc Định | Cơ Chế Xử Lý |
| :--- | :--- | :--- |
| `path` | `String` (rỗng = tự suy luận kebab-case) | Đường dẫn gốc của tài nguyên (VD: `"/api/v1/commercial-products"`) |
| `tags` | `String[]` | Nhóm hiển thị OpenAPI 3.0 Swagger UI |
| `enabledEndpoints` | `String[]` | Allowlist phương thức/nhóm được phép phơi bày qua `EndpointFeatureFilterHelper` |
| `disabledEndpoints` | `String[]` | Denylist phương thức/nhóm bị tắt (VD: `{"deleteById", "batchChunked"}`) |
| `enableNestedSubResources` | `boolean` (`false`) | Bật định tuyến quan hệ đệ quy `GET /{id}/**` |

### `@CustomEndpoint` (`ElementType.METHOD`)

Thuộc tính: `path`, `httpMethod` (mặc định `"GET"`), `delegateBean`, `delegateMethod`, `summary`, `description`. Ánh xạ lời gọi trực tiếp đến `@AutoComponent` / `@AutoService` bean tương ứng.

---

## 3. Chú Thích Bảo Mật, Quy Trình & Toàn Vẹn Dữ Liệu (`Entity`)

| Annotation | Target | Thuộc Tính Chính | Hành Vi Runtime |
| :--- | :--- | :--- | :--- |
| `@EntitySecurity` | `TYPE` | `readRoles`, `writeRoles`, `deleteRoles`, `ownerField`, `bypassOwnershipRoles` (`{"ROLE_ADMIN"}`) | Kiểm tra quyền NIST Level 2 RBAC và lọc dữ liệu theo `ownerField` |
| `@FieldSecurity` | `FIELD` | `viewRoles`, `maskPattern` (`"***"`), `nullifyWhenDenied` (`false`) | Che mờ hoặc gán null trường nhạy cảm khỏi JSON phản hồi nếu Role không hợp lệ |
| `@StateMachine` | `FIELD` / `TYPE` | `field` (`"status"`), `initial` (`"PENDING"`), `transitions`, `deletableStates` | Chặn chuyển trạng thái sai đồ thị hoặc xóa mềm ở trạng thái cấm (`HTTP 422`) |
| `@HumanPolicy` | `TYPE` | `lifecycle`, `security`, `masking`, `stateField` | Phân tích câu đặc tả tiếng Anh thành quy tắc State Machine, RBAC và Field Masking |
| `@MultiTenant` | `TYPE` | `tenantField` (`"tenantId"`), `bypassTenantRoles` (`{"ROLE_SUPER_ADMIN"}`) | Cô lập dữ liệu đa khách hàng tự động trên mọi truy vấn CRUD |
| `@UniqueField` | `FIELD` | *(marker)* | Kiểm tra trùng lặp giá trị trước `POST`/`PUT`/`upsert` (trả `HTTP 409`) |
| `@AutoCode` | `FIELD` | `prefix` (bắt buộc) | Sinh mã định danh nghiệp vụ theo tiền tố (VD: `"PRD-"`) khi tạo/clone nếu trường rỗng |
| `@AutoSlug` | `FIELD` | `sourceField` (bắt buộc) | Chuyển chuỗi từ `sourceField` thành URL slug không dấu khi tạo mới |
| `@ComputedField` | `FIELD` | `operation` (`MULTIPLY` / `SUM_COLLECTION`), `sourceFields`, `collectionField`, `itemField` | Tự tính giá trị số trước khi lưu xuống database |
| `@AuditTrail` | `TYPE` | `category`, `recordFieldDiffs` (`true`) | Ghi lịch sử thay đổi từng trường phục vụ Time-Travel |

---

## 4. Chú Thích Chịu Tải, Đồng Thời & Sự Kiện

| Annotation | Target | Thuộc Tính Chính & Mặc Định | Cơ Chế Thực Thi |
| :--- | :--- | :--- | :--- |
| `@RateLimit` | `TYPE`, `METHOD` | `requestsPerWindow` (`60`), `windowSeconds` (`60`), `partitionKey` (`"clientIp"`) | Bảo vệ endpoint/entity bằng bucket cửa sổ trượt (`HTTP 429`) |
| `@EntityCircuitBreaker` | `TYPE`, `METHOD` | `name`, `failureRateThreshold` (`50.0`), `waitDurationSeconds` (`10`), `fallbackMessage` | Ngắt mạch cô lập lỗi với Resilience4j (`HTTP 503` khi `OPEN`) |
| `@EntityRetry` | `TYPE`, `METHOD` | `name`, `maxAttempts` (`3`), `waitDurationMs` (`500L`), `backoffMultiplier` (`2.0d`) | Thử lại lũy thừa khi gặp lỗi DB/mạng tạm thời |
| `@DistributedLock` | `METHOD` | `key`, `waitTimeMs`, `leaseTimeMs` | Khóa phân tán chống race condition đa node qua SpEL key |
| `@Idempotent` | `METHOD` | `ttlSeconds` (`3600L`), `enforcePayloadMatch` (`true`) | Ngăn xử lý trùng lặp theo header `Idempotency-Key` + đối chiếu hash bằng `ConstantTimeComparisonUtil` |
| `@HttpCacheable` | `TYPE`, `METHOD` | `maxAgeSeconds` (`60`), `etagEnabled` (`true`), `mustRevalidate` (`false`) | Sinh HTTP `Cache-Control` và `ETag` (`304 Not Modified`) |
| `@PublishCloudEvent` | `TYPE`, `METHOD` | `topic`, `source`, `actions` (`{"CREATED","UPDATED","DELETED"}`) | Xuất bản sự kiện chuẩn CloudEvents 1.0 |
| `@EntityWebhook` | `TYPE` | `events`, `secretHeader` (`"X-Webhook-Signature"`), `includeFullPayload` (`true`) | Đẩy webhook bất đồng bộ có ký HMAC-SHA256 |
| `@TargetDatabasePlatform` | `TYPE`, `METHOD` | `platform` (`"H2"`), `cluster` (`"PRIMARY"`), `readOnly` (`false`) | Định tuyến thực thi xuống cụm Primary / Replica tương ứng |
