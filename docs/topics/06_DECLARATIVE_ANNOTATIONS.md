# 06. Đặc Tả 42 Annotation Khai Báo (`1.0.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/06_DECLARATIVE_ANNOTATIONS.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. Tổng Quan Phân Nhóm 42 Annotation

Framework cung cấp **42** annotation Pure Java trong `io.github.natswarchuan.core.annotation` và `module.*.annotation`:

- **Controller, Proxy & Escape Hatch (`13`)**: `@AutoRestController`, `@AutoGet`, `@AutoPost`, `@AutoPut`, `@AutoPatch`, `@AutoDelete`, `@AutoParam`, `@AutoVariable`, `@AutoBody`, `@CustomEndpoint`, `@ServiceOverride`, `@EnableNestedSubResource`, `@BusinessAction`.
- **Bean & Component DI (`5`)**: `@AutoComponent`, `@AutoService`, `@AutoBean`, `@AutoConfigurationBean`, `@OrderPriority`.
- **Entity, Ràng Buộc & Truy Vấn (`11`)**: `@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@HumanPolicy`, `@AuditTrail`, `@MultiTenant`, `@UniqueField`, `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@CustomQuery`.
- **Khả Năng Chịu Tải, Đồng Thời, Bộ Đệm & Sự Kiện (`13`)**: `@DistributedLock`, `@Idempotent`, `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`, `@HttpCacheable`, `@AutoCacheable`, `@AutoCacheEvict`, `@TrackExecutionTime`, `@EntityWebhook`, `@PublishCloudEvent`, `@TargetDataSource`, `@TargetDatabasePlatform`.

---

## 2. Định Tuyến Proxy & Escape Hatch (`Controller`)

### `@AutoRestController` (`ElementType.TYPE`)

| Thuộc Tính | Kiểu / Mặc Định | Hành Vi Runtime |
| :--- | :--- | :--- |
| `path` | `String` (`""`) | Tiền tố URL gốc (ví dụ `"/api/v1/product-catalogs"`) |
| `basePath` | `String` (`""`) | Bí danh đường dẫn phụ khi cần tách gốc URI |
| `entityName` | `String` (`""`) | Ghi đè tên entity hiển thị trên metadata/studio |
| `enabledEndpoints` | `String[]` (`{}`) | Danh sách trắng tên hàm hoặc nhóm tính năng |
| `disabledEndpoints` | `String[]` (`{}`) | Danh sách đen tắt endpoint cụ thể |
| `enableNestedSubResources` | `boolean` (`false`) | Bật điều hướng đệ quy `GET /{id}/**` |

### `@ServiceOverride` (`ElementType.METHOD`)

| Thuộc Tính | Kiểu / Mặc Định | Hành Vi Runtime |
| :--- | :--- | :--- |
| `targetBean` | `Class<?>` (`Void.class`) | Lớp Spring Bean xử lý thay thế |
| `beanName` | `String` (`""`) | Tên Bean Spring (nếu không tra theo class) |
| `methodName` | `String` (`""`) | Tên phương thức mục tiêu (mặc định trùng tên hàm Controller) |
| `bypassAutoDispatch` | `boolean` (`true`) | Nhảy thẳng sang custom bean qua `MethodHandleCacheUtil` |

### `@CustomEndpoint` (`ElementType.METHOD`)

Thuộc tính: `path`, `httpMethod` (`"GET"`), `delegateBean`, `delegateMethod`, `summary`, `description`.

---

## 3. Bảo Mật, Vòng Đời & Tính Toàn Vẹn Dữ Liệu (`Entity`)

| Annotation | Target | Thuộc Tính Chính & Mặc Định | Cơ Chế Thực Thi |
| :--- | :--- | :--- | :--- |
| `@EntitySecurity` | `TYPE` | `readRoles`, `writeRoles`, `deleteRoles`, `permitAll` (`false`), `ownerField`, `bypassOwnerRoles` (`{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) | Kiểm soát RBAC NIST Level 2 & quyền sở hữu bản ghi |
| `@FieldSecurity` | `FIELD` | `viewRoles`, `maskPattern` (`"******"`), `nullifyInsteadOfMask` (`false`) | Che mờ hoặc gán `null` cho trường nhạy cảm khi thiếu role |
| `@StateMachine` | `FIELD` / `TYPE` | `initial` (`"ACTIVE"`), `transitions`, `deletableStates` | Chặn chuyển trạng thái trái quy tắc và xóa trái phép (`HTTP 422`) |
| `@HumanPolicy` | `TYPE` | `lifecycle`, `security`, `masking`, `stateField` | Nạp luật tiếng Anh tự nhiên vào RBAC / State Machine / Masking |
| `@MultiTenant` | `TYPE` | `tenantField` (`"tenantId"`), `bypassTenantRoles` (`{"ROLE_SUPER_ADMIN"}`) | Cô lập truy vấn theo Tenant ID |
| `@UniqueField` | `FIELD` | *(marker)* | Kiểm tra duy nhất trước khi `POST`/`PUT`/`upsert` (`HTTP 409`) |
| `@AutoCode` | `FIELD` | `prefix` (bắt buộc) | Sinh mã tiền tố (ví dụ `"PRD-"`) khi tạo/clone |
| `@AutoSlug` | `FIELD` | `sourceField` (bắt buộc) | Chuẩn hóa slug URL từ `sourceField` |
| `@ComputedField` | `FIELD` | `operation` (`MULTIPLY`), `sourceFields`, `collectionField`, `itemField`, `subtractField`, `addField` | Tự tính giá trị tổng dẫn xuất trước khi lưu DB |
| `@AuditTrail` | `TYPE` | `category`, `recordFieldDiffs` (`true`) | Ghi lại diff từng trường hỗ trợ Time-Travel |

---

## 4. Resilience, Đồng Thời, Bộ Đệm & Sự Kiện

| Annotation | Target | Thuộc Tính & Mặc Định | Hành Vi Thực Thi |
| :--- | :--- | :--- | :--- |
| `@DistributedLock` | `METHOD` | `key`, `waitTimeMs` (`1000L`), `leaseTimeMs` (`30000L`) | Khóa SpEL key chống race condition (`HTTP 409`) |
| `@Idempotent` | `METHOD` | `headerName` (`"X-Idempotency-Key"`), `ttlSeconds` (`300L`) | Chống trùng lặp xử lý qua Caffeine cache (`HTTP 409`) |
| `@RateLimit` | `METHOD` | `requests`, `windowSeconds`, `partitionKey` (`"IP"`) | Sliding window rate limit (`HTTP 429`) |
| `@EntityCircuitBreaker` | `TYPE`, `METHOD` | `name`, `failureRateThreshold` (`50.0f`), `waitDurationInOpenStateSeconds` (`10`), `slidingWindowSize` (`20`), `permittedNumberOfCallsInHalfOpenState` (`5`) | Cô lập lỗi Resilience4j (`HTTP 503` khi `OPEN`) |
| `@EntityRetry` | `TYPE`, `METHOD` | `name`, `maxAttempts` (`3`), `waitDurationMs` (`500L`), `backoffMultiplier` (`2.0d`) | Thử lại với exponential backoff |
| `@HttpCacheable` | `TYPE`, `METHOD` | `maxAgeSeconds`, `isPrivate` (`false`), `mustRevalidate` (`true`), `generateETag` (`true`) | ETag / `Cache-Control` / `304 Not Modified` |
| `@PublishCloudEvent` | `TYPE` | `eventType`, `source`, `publishOnCreate` (`true`), `publishOnUpdate` (`true`), `publishOnDelete` (`true`) | Xuất CloudEvents sau commit |
| `@EntityWebhook` | `TYPE` | `events`, `secretHeader` (`"X-Webhook-Signature"`), `includeFullPayload` (`true`) | Gửi HMAC-SHA256 webhook sau commit |
