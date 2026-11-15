# 04. Bảo Mật Chống Scanner, Đa Ngôn Ngữ `/system/studio`, Virtual Threads & Lưu Trữ Đa Đám Mây

> **Ngôn ngữ**: Tiếng Việt | [English](en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. Bảo Mật Đối Kháng & Phòng Chống Scanner AI Tự Động

| Cơ Chế Phòng Thủ | Lớp Thực Thi | Cấu Hình / Hằng Số Kiểm Chứng |
| :--- | :--- | :--- |
| **Đóng Băng Studio & Demo Auth** | `DevStudioController`, `AuthController`, `SecurityExposurePolicyBridge` | Mặc định `app.framework.studio.enabled=false` & `demo-token-endpoint-enabled=false`; trả HTTP `404` và loại `/system/**` khỏi matcher công khai |
| **Xoay Khóa CSPRNG 64 Byte** | `StartupDiagnosticsUtil.validateAndHardenSecurity` | Khi tắt demo token và `jwt-secret` vẫn là chuỗi dev mặc định, hệ thống sinh khóa 64-byte `SecureRandom` ngay lúc khởi động |
| **Chặn Khóa JWT Yếu** | `StartupDiagnosticsUtil.assertJwtSecretEntropy` | `fail-fast-weak-jwt-secret=true` từ chối khởi động nếu khóa `< 32` byte UTF-8 |
| **So Khớp Thời Gian Hằng** | `ConstantTimeComparisonUtil` | Bọc `MessageDigest.isEqual` chống timing attack trên hash `@Idempotent` và HMAC `@EntityWebhook` (`WebhookHmacSignerHelper`) |
| **Giới Hạn Tốc Độ Trượt** | `RateLimitingFilter` | Caffeine cache giới hạn `10,000` khóa; trần mặc định `1,000 req/s`, riêng `/api/v1/auth/**` khóa còn `20 req/s` |
| **Chống Path Traversal (`CWE-22`)** | `StoragePathSanitizerHelper` | Loại null byte (`\0`), chuẩn hóa đường dẫn và ràng buộc file trong thư mục gốc hợp lệ |
| **Tiêu Đề Bảo Mật HTTP** | `SecurityHeadersPolicyBridge` | Gắn `X-Frame-Options: DENY`, `Content-Security-Policy`, `Permissions-Policy`, `Referrer-Policy` và `Strict-Transport-Security` |

---

## 2. Đa Ngôn Ngữ (`i18n`), `/system/studio` & Mở Rộng Bản Dịch

1. **20 Ngôn Ngữ Tích Hợp (`I18nLocalizationProperties`)**: `en`, `zh`, `hi`, `es`, `fr`, `ar` (RTL), `bn`, `pt`, `ru`, `ur` (RTL), `id`, `de`, `ja`, `vi`, `ko`, `tr`, `it`, `th`, `fa` (RTL), `pl`. Các ngôn ngữ `ar`, `ur`, `fa` tự động gán `dir="rtl"` trên `/system/studio`.
2. **Thứ Tự Ưu Tiên (`LocaleResolutionUtil.resolveBestMatchLocale`)**:
   `?lang=` -> Header `X-Language` -> Cookie `NWVMC_LANG` -> Header `Accept-Language` (`MAX_ACCEPT_HEADER_LENGTH=256`, `MAX_ACCEPT_RANGES=8`) -> `app.framework.i18n.default-locale` (`en`).
3. **Bảo Vệ Khóa & Chẩn Đoán (`LocaleResolutionUtil` / `DevStudioDiagnosticsUtil`)**:
   - Chỉ chấp nhận khóa khớp `^[A-Za-z0-9._-]+$` dài tối đa `128` ký tự (`MAX_MESSAGE_CODE_LENGTH`), từ chối chuỗi `..`. Payload dạng `?lang=../../etc/passwd` bị bỏ qua và rơi về `en`.
   - Bộ đệm dịch giới hạn `8192` mục (`MAX_TRANSLATION_CACHE_SIZE`), danh sách thiếu khóa giới hạn `128` khóa (`MAX_MISSING_KEY_RECORDS`) hiển thị trên `#studioI18nDiagBar` khi `show-i18n-diagnostics=true`.
4. **Mở Rộng Từ Host Application**:
   - Đặt `src/main/resources/i18n/messages_{lang}.properties` để bổ sung/ghi đè khóa thông điệp.
   - Hoặc tiêm `MessageSource` tùy chỉnh của host app vào `new MessageHelper(hostMessageSource)`.

---

## 3. Lưu Trữ Tệp Đa Đám Mây (`FileStorageController`)

Cấu hình qua `app.framework.storage.provider` (`LOCAL`, `S3`, `GCS`), giới hạn kích thước qua `max-file-size` (mặc định `52428800` byte = 50 MB):

- `POST /api/v1/storage/upload`
- `GET /api/v1/storage/download/{fileId}`
- `GET /api/v1/storage/metadata/{fileId}`
- `DELETE /api/v1/storage/{fileId}`
- `POST /api/v1/storage/presigned-url`
- `GET /api/v1/storage/exists/{fileId}`

---

## 4. Virtual Threads Java 21, CloudEvents, ETag & Real-Time

- **Virtual Threads + HikariCP**: Bật `spring.threads.virtual.enabled: true` và tắt OSIV (`spring.jpa.open-in-view: false`) giúp giải phóng kết nối HikariCP ngay sau bước truy vấn thay vì giữ qua giai đoạn serialize JSON.
- **Real-Time SSE & WebSocket/STOMP**: `@Hidden @AutoGet("/events")` trên từng controller kết hợp kênh `RealtimeStreamingProperties` (`heartbeat-seconds=15`, `max-emitters-per-entity=1000`).
- **HTTP ETag (`@HttpCacheable`) & `@Idempotent`**: Giảm truyền tải lặp lại với `304 Not Modified` và đảm bảo an toàn retry cho giao dịch tài chính qua khóa `Idempotency-Key`.
- **Audit Trail Time-Travel**: `GET /api/v1/system/time-travel/{entityName}/{id}?timestamp=...` phục hồi ảnh thực thể quá khứ bằng cách áp dụng ngược bản ghi CDC với độ phức tạp $O(K)$.
