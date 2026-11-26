# 04. Bảo Mật, Lưu Trữ Đa Đám Mây, `@ServiceOverride`, Metrics & Đa Ngôn Ngữ (`0.1.0`)

> **Ngôn ngữ**: [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | **Tiếng Việt** | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Đủ 20 Ngôn Ngữ](../README.md) | [Cẩm Nang Đầy Đủ](../../GUIDE_VI.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](../../index.html#security-rbac)

---

## 1. Bảo Mật NIST Level 2, RBAC Động Từ Database, Khóa Bề Mặt & Chống Quét Lỗ Hổng

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: Phân quyền theo bảng (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, hỗ trợ meta-annotation kết hợp như `@AuditedRecordSecurity`), giới hạn chủ sở hữu (`ownerField`), che giấu/null hóa cột nhạy cảm (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), và cô lập `@MultiTenant` fail-closed (`403` khi thiếu tenant, ghi đè chống giả mạo khi tạo và chặn IDOR mọi thao tác theo ID).
- **RBAC Động Từ Database (`DynamicDatabaseRbacProviderHelper`)**: Đánh dấu 4 bảng JPA Domain bằng `@SecurityRoleEntity` (`@RoleCode`, `@RoleName`, `@RolePermissions`), `@SecurityPermissionEntity` (`@PermissionCode`, `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`), `@SecurityUserRoleEntity` (`@UserRoleSubject`, `@UserRoleCode`, `@UserRoleTenantId`) và `@SecurityPolicyEntity` (`@PolicyResource`, `@PolicyAction`, `@PolicyAllowedRoles`, `@PolicyEffect`). Hỗ trợ `DENY` ưu tiên tuyệt đối trước `ALLOW`, ngữ cảnh `X-Tenant-ID`, tự động xóa cache L1 Caffeine qua `DatabaseRbacCacheInvalidationListener`, chung sống không phá hủy với custom `SecurityFilterChain` qua `PureJavaSecurityFilterBridge` và tùy biến qua `SecurityIdentityCustomizer` (`augmentSubjectAuthorities`, `evaluateCustomAuthorization`). Cấu hình qua `app.framework.security.dynamic-database-rbac-enabled=true`.
- **Khóa Bề Mặt Mặc Định (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Khi `app.framework.studio.enabled=false` (mặc định production), các truy cập chưa xác thực tới `/system/**` bị `SecurityExposurePolicyBridge` chặn với HTTP `401`, còn `StartupDiagnosticsUtil` trả HTTP `404 Not Found` cho bề mặt Studio bị tắt; khi `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` trả HTTP `404 Not Found`.
- **Chuẩn Hóa & Mask Lỗi Nội Bộ**: `ExceptionCauseUnwrapperUtil` ghi trọn stack trace ở log server nhưng chỉ trả `ApiResponse<Void>` an toàn ra HTTP client.
- **CORS SPA & `Idempotency-Key` (`SecurityFilterChainBridge`)**: Cho phép wildcard pattern `*` kèm các tiêu đề `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, `X-Request-ID`.

---

## 2. Cơ Chế `@ServiceOverride` & Xuất Mã Chuẩn MVC (`GET /system/studio/eject`)

Khi một endpoint cần nghiệp vụ riêng vượt ngoài CRUD chuẩn:

1. **Ghi Đè Tại Chỗ Qua `@ServiceOverride`**: Gắn `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` trực tiếp lên phương thức trong interface Controller; `EscapeHatchDispatchHelper` sử dụng `MethodHandleCacheUtil` điều hướng thẳng vào Spring Bean tùy biến.
2. **Xuất Mã Chuẩn MVC (`/system/studio/eject`)**: Gọi `GET /system/studio/eject?target=<EntityOrControllerName>` để `ControllerEjectionHelper` sinh đầy đủ 5 tệp mã Java chuẩn (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`).

---

## 3. Chỉ Số Micrometer (`DynamicEntityMetricsHelper` & `MetricConstant` — 11 Chỉ Số)

| Metric | Kiểu | Tags Chính | Mô Tả |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Tổng số yêu cầu CRUD thực thi |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Độ trễ thực thi thực tế |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Độ trễ tại Dynamic Proxy Controller |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Tỉ lệ đánh giá `@HttpCacheable` ETag |
| `nwvmc.outbox.pending.events` | Gauge | — | Số sự kiện đang chờ trong Outbox |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Thời gian gửi mỗi đợt Outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Trạng thái (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Số yêu cầu vượt ngưỡng HTTP `429` |
| `framework.outbox.dispatched.total` | Counter | — | Tổng số sự kiện Outbox đã gửi thành công |
| `framework.realtime.active.connections` | Gauge | — | Số kết nối SSE đang hoạt động (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Counter tùy chọn (`DynamicEntityMetricsHelper.recordDataSourceRouting`) theo Primary / Replica / Tenant |

---

## 4. Đa Ngôn Ngữ 20 Thứ Tiếng, RTL & Mở Rộng Từ Host (`i18n/`)

- **20 Ngôn Ngữ Tích Hợp (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` tự động bật giao diện phải sang trái `dir="rtl"`).
- **Thứ Tự Độ Ưu Tiên Ngôn Ngữ (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: Query param `?lang=` -> Header `X-Language` -> Cookie `NWVMC_LANG` -> Header `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Mã không hợp lệ tự rơi về `en`.
- **Ghi Đè / Bổ Sung Từ Ứng Dụng Host**: `I18nConfig` nạp `classpath:i18n/messages` (UTF-8, `cacheSeconds=3600`). Khi `app.framework.studio.show-i18n-diagnostics=true`, thanh `#studioI18nDiagBar` trên `/system/studio` hiển thị locale đang chạy, hướng LTR/RTL và cảnh báo các khóa thiếu bản dịch.

---

## 5. Kết Quả Vi Chuẩn JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Đường Dẫn Gọi (Throughput, `ops/ms`) | Kết Quả Trung Bình Đo Thực Tế |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. Lưu Trữ Tập Tin Đa Đám Mây (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

`FileStorageController` tích hợp sẵn (`/api/v1/storage/*`) cung cấp `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` và `POST /presigned-url`, chuyển đổi linh hoạt qua `app.framework.storage.provider` (`LOCAL` / `S3` / `GCS`) cùng `StorageCustomizer`.

> **Khóa Bảo Mật Production:** Bật `app.framework.security.require-authenticated-api-paths: true` và bảo vệ `/api/v1/storage/**` trong `SecurityFilterChain` (kèm giới hạn dung lượng & MIME cho phép) trước khi đưa lên mạng công cộng.
