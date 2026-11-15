# 04. Bảo Mật, Lưu Trữ Đa Đám Mây, `@ServiceOverride`, Metrics & Đa Ngôn Ngữ (`1.0.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. Bảo Mật NIST Level 2, Khóa Bề Mặt Production & Chống Quét Lỗ Hổng

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: Phân quyền theo bảng (`readRoles`, `writeRoles`, `deleteRoles`), giới hạn chủ sở hữu (`ownerField`), che giấu/null hóa cột nhạy cảm (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) và cô lập tenant (`tenantField`).
- **Khóa Bề Mặt Mặc Định (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Khi `app.framework.studio.enabled=false` (mặc định production), `/system/studio` và `/system/studio/eject` trả HTTP `401 Unauthorized`; khi `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` trả HTTP `404 Not Found`.
- **Anti-Fingerprinting & Mask Lỗi Nội Bộ**: `hide-framework-fingerprint=true` ẩn badge phiên bản trên HTML, đồng thời `ExceptionCauseUnwrapperUtil` ghi trọn stack trace ở log server nhưng chỉ trả `ApiResponse<Void>` an toàn ra HTTP client.
- **CORS SPA & `Idempotency-Key` (`SecurityFilterChainBridge`)**: Cho phép wildcard pattern `*` kèm các tiêu đề `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, `X-Request-ID`.

---

## 2. Cơ Chế `@ServiceOverride` & Xuất Mã Chuẩn MVC (`GET /system/studio/eject`)

Khi một endpoint cần nghiệp vụ riêng vượt ngoài CRUD chuẩn:

1. **Ghi Đè Tại Chỗ Qua `@ServiceOverride`**: Gắn `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` trực tiếp lên phương thức trong interface Controller; `EscapeHatchDispatchHelper` sử dụng `MethodHandleCacheUtil` điều hướng thẳng vào Spring Bean tùy biến.
2. **Xuất Mã Chuẩn MVC (`/system/studio/eject`)**: Gọi `GET /system/studio/eject?target=<EntityOrControllerName>` để `ControllerEjectionHelper` sinh bộ mã Spring MVC chuẩn (`Controller`, `Service`, `ServiceImpl`, `Repository`).

---

## 3. Chỉ Số Micrometer (`DynamicEntityMetricsHelper` & `MetricConstant`)

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
| `framework.datasource.routing.total` | Counter | `datasource` | Phân bố điều hướng Primary / Replica / Tenant |

---

## 4. Đa Ngôn Ngữ 20 Thứ Tiếng, RTL & Mở Rộng Từ Host (`i18n/`)

- **20 Ngôn Ngữ Tích Hợp (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` tự động bật giao diện phải sang trái `dir="rtl"`).
- **Thứ Tự Độ Ưu Tiên Ngôn Ngữ (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: Query param `?lang=` -> Cookie `NWVMC_LANG` -> Header `X-Language` -> Header `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Mã không hợp lệ tự rơi về `en`.
- **Ghi Đè / Bổ Sung Từ Ứng Dụng Host**: `I18nConfig` nạp `classpath:i18n/messages` (UTF-8, `cacheSeconds=3600`). Khi `app.framework.studio.show-i18n-diagnostics=true`, thanh `#studioI18nDiagBar` trên `/system/studio` hiển thị locale đang chạy, hướng LTR/RTL và cảnh báo các khóa thiếu bản dịch.

---

## 5. Kết Quả Vi Chuẩn JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Đường Dẫn Gọi (Throughput, `ops/ms`) | Kết Quả Trung Bình Đo Thực Tế |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |
