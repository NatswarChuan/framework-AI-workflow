# Rule 04: Cấu Hình Toàn Cục (Global Config), Lớp Tiện Ích (Util) và Trợ Thủ (Helper)

Quy chuẩn này phân định ranh giới kỹ thuật rõ ràng giữa **Global Config**, **Util** và **Helper**, bảo đảm tính mô-đun hóa, dễ kiểm thử (Unit Test) và quản lý tài nguyên nhất quán theo triết lý Framework-First.

---

## 1. NGUYÊN TẮC TIÊN QUYẾT: LUÔN ƯU TIÊN GLOBAL CONFIG TRƯỚC KHI TẠO UTIL

> **NGUYÊN TẮC BẮT BUỘC (FRAMEWORK-FIRST ARCHITECTURE)**:
> **Trước khi tạo bất kỳ lớp `*Util` nào, Developer và Agent BẮT BUỘC phải đánh giá xem vấn đề có thể được giải quyết bằng Cấu Hình Toàn Cục (Global Configuration) của Spring Framework hay không.**
>
> Nếu một yêu cầu kỹ thuật có thể được thiết lập tập trung ở tầng Framework (`config` package, Spring Beans, Jackson Modules, WebMvcConfigurer, Converters, Formatters), **BẮT BUỘC PHẢI TẠO GLOBAL CONFIG TRƯỚC TIÊN**, tuyệt đối không viết các class Util tĩnh rải rác!

### 1.1. Bảng Đối Chiếu: Global Config Thay Thế Util Lạc Hậu

| Vấn đề Kỹ thuật | Cách làm Lạc hậu (❌ Lạm dụng Util) | Chuẩn Doanh Nghiệp (✅ Global Config Ưu Tiên) |
| :--- | :--- | :--- |
| **Định dạng Ngày/Giờ (ISO-8601, UTC)** | Viết `DateTimeUtil.format(...)` gọi thủ công ở từng DTO/Service | Cấu hình `JacksonConfig` đăng ký `JavaTimeModule` với chuẩn UTC ISO-8601 toàn cục. Toàn bộ `LocalDateTime` tự động tuần tự hóa. |
| **Tuần tự hóa JSON** | Viết `JsonUtil.toJson(...)` dùng static `ObjectMapper` | Cấu hình Bean `ObjectMapper` tập trung trong `JacksonConfig` tiêm qua Spring DI. |
| **CORS & Header** | Viết `CorsUtil` hoặc set header thủ công | Cấu hình tập trung trong `SecurityConfig` và `WebMvcConfigurer`. |
| **Xử lý Bất đồng bộ** | Tạo `ExecutorUtil` tự tạo thread pool bằng Java thô | Cấu hình `@EnableAsync` với Bean `ThreadPoolTaskExecutor` trong `AsyncConfig`. |
| **Bộ Nhớ Đệm (Cache)** | Viết `CacheUtil` quản lý static ConcurrentHashMap | Sử dụng trừu tượng `@EnableCaching` với Caffeine/Redis trong `CacheConfig`. |
| **Chuyển đổi kiểu Web** | Viết `ParamUtil.parse(...)` trong Controller | Đăng ký `Converter<S, T>` hoặc `Formatter<T>` trong `WebMvcConfigurer.addFormatters(...)`. |

### 1.2. Điều Kiện Cho Phép Tạo Lớp Util
Chỉ được phép tạo lớp `*Util` khi thỏa mãn **toàn bộ các điều kiện** sau:
1. Nghiệp vụ là **thuật toán tính toán thuần túy (Pure Algorithmic Computation)**, hoàn toàn phi trạng thái (Stateless).
2. **Không thể cấu hình tập trung** bằng bất kỳ cơ chế nào của Spring Framework / Servlet Container.
3. Ví dụ hợp lệ: `UuidUtil` (sinh UUIDv7 RFC 9562), `StringUtil` (chuẩn hóa chuỗi an toàn null), `CryptoUtil` (thuật toán băm SHA-256).

---

## 2. QUY CHUẨN LỚP TIỆN ÍCH (UTIL CLASS)

Lớp Util đại diện cho các hàm tiện ích phi trạng thái, thuần túy thuật toán, tái sử dụng độc lập không phụ thuộc ngữ cảnh Spring.

### 2.1. Ràng Buộc Bắt Buộc:
1. Khai báo là **`public final class`** để ngăn chặn kế thừa.
2. Constructor duy nhất là **`private`** và ném `UnsupportedOperationException`.
3. **100% PHƯƠNG THỨC LÀ `public static`** (CẤM `private function` hay non-static function).
4. **TUYỆT ĐỐI KHÔNG** chứa biến trạng thái (stateful fields).
5. **TUYỆT ĐỐI KHÔNG** gắn annotation của Spring (`@Component`, `@Service`, `@Autowired`...).
6. Không khai báo hằng số trong Util; hằng số phải nằm trong lớp Constant tương ứng.

### 2.2. Triển Khai Chuẩn: `StringUtil.java`
```java
package com.enterprise.app.common.util;

import com.enterprise.app.common.constant.CommonConstant;
import java.util.Objects;

/**
 * Tiện ích hỗ trợ xử lý và chuẩn hóa chuỗi ký tự.
 */
public final class StringUtil {

  private StringUtil() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  public static boolean isBlank(final String input) {
    if (Objects.isNull(input)) {
      return true;
    }
    return input.trim().isEmpty();
  }

  public static String trimToEmpty(final String input) {
    if (Objects.isNull(input)) {
      return CommonConstant.EMPTY_STRING;
    }
    return input.trim();
  }
}
```

---

## 3. QUY CHUẨN LỚP TRỢ THỦ (HELPER CLASS)

Lớp Helper đại diện cho các thành phần hỗ trợ logic nghiệp vụ phụ trợ, cần tương tác với Spring Context (Inject Repository, Service, Client ngoài, gửi email, định dạng thông báo).
Đặc biệt, **Helper là đích đến bắt buộc cho toàn bộ logic phân rã từ tầng Service** để đảm bảo trong `*ServiceImpl` chỉ chứa các phương thức `@Override` từ Service Interface.

### 3.1. Ràng Buộc Bắt Buộc:
1. Khai báo là **`public final class`**.
2. Đánh dấu là Spring Bean bằng annotation **`@Component`**.
3. **TUYỆT ĐỐI KHÔNG ĐƯỢC CHỨA STATIC FUNCTION**. 100% phương thức là instance method (`public`).
4. Bắt buộc tiêm phụ thuộc qua Constructor (`@RequiredArgsConstructor` với các trường `private final`).
5. Không khai báo hằng số trong Helper; 100% hằng số phải trích xuất vào lớp Constant.
6. **Tiếp nhận 100% logic phụ trợ từ Service**: Các thao tác tra cứu phụ, validation nghiệp vụ con, chuẩn hóa dữ liệu, mapping trung gian hoặc rẽ nhánh điều kiện phức tạp bắt buộc viết trong Helper thay vì viết phương thức phụ trong `*ServiceImpl`.
7. **Ưu tiên Builder Pattern thay vì Setter**: Khi tạo mới hoặc cập nhật đối tượng (Entity, DTO) trong Helper, 100% dùng `.builder()...build()` hoặc `toBuilder()`, không gọi chuỗi hàm setter rời rạc.

### 3.2. Triển Khai Chuẩn: `NotificationHelper.java`
```java
package com.enterprise.app.common.helper;

import com.enterprise.app.common.constant.NotificationConstant;
import com.enterprise.app.common.constant.NotificationLogConstant;
import com.enterprise.app.dto.NotificationDto;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Trợ thủ hỗ trợ gửi thông báo và quản lý định dạng tin nhắn nghiệp vụ.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class NotificationHelper {

  private final EmailSenderClient emailSenderClient;
  private final SmsSenderClient smsSenderClient;

  public void dispatchNotification(final NotificationDto notificationDto) {
    Objects.requireNonNull(notificationDto, NotificationConstant.MSG_DTO_NOT_NULL);

    if (Objects.equals(notificationDto.getChannel(), NotificationConstant.CHANNEL_EMAIL)) {
      emailSenderClient.send(notificationDto);
      return;
    }

    if (Objects.equals(notificationDto.getChannel(), NotificationConstant.CHANNEL_SMS)) {
      smsSenderClient.send(notificationDto);
      return;
    }

    log.warn(NotificationLogConstant.WARN_UNKNOWN_CHANNEL, notificationDto.getChannel());
  }
}
```
