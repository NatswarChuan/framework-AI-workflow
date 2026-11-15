---
name: spring-boot-util-and-helper
description: >-
  Kích hoạt kỹ năng này khi xây dựng các lớp tiện ích (Util Class) hoặc lớp trợ thủ nghiệp vụ (Helper Class),
  đảm bảo tuân thủ nghiêm ngặt chuẩn thiết kế: luôn ưu tiên tạo Global Config trước khi tạo Util,
  Util là final class chỉ chứa static method, Helper là final class @Component không chứa bất kỳ static method nào.
---

# Kỹ Năng: Xây Dựng Lớp Tiện Ích (Util) & Trợ Thủ (Helper)

Kỹ năng này hướng dẫn chi tiết cách tạo và chuẩn hóa các thành phần `Util` và `Helper`, đặc biệt nhấn mạnh nguyên tắc kiến trúc: **Luôn ưu tiên giải quyết vấn đề bằng Global Configuration trước khi tạo lớp Util tĩnh**.

---

## 1. NGUYÊN TẮC TIÊN QUYẾT: ƯU TIÊN GLOBAL CONFIG TRƯỚC KHI TẠO UTIL

> **QUY TẮC BẮT BUỘC**:
> Tuyệt đối không tạo các lớp Util tĩnh phục vụ các tính năng xuyên suốt (cross-cutting concerns) như định dạng ngày tháng, parse JSON, cấu hình CORS, xử lý luồng nếu có thể cấu hình tập trung ở tầng Spring Framework.

### Bảng Đối Chiếu Thay Thế Util Bằng Global Config:
| Vấn đề | ❌ Cách Lạc Hậu (Tạo Util tĩnh) | ✅ Chuẩn Framework (Tạo Global Config) |
| :--- | :--- | :--- |
| **Định dạng Ngày/Giờ** | Viết `DateTimeUtil.format(...)` gọi rải rác | Cấu hình `JacksonConfig` với `JavaTimeModule` định dạng ISO-8601 UTC tự động. |
| **Xử lý JSON** | Viết `JsonUtil.toJson(...)` dùng static ObjectMapper | Khởi tạo Bean `@Primary ObjectMapper` trong `JacksonConfig` tiêm qua DI. |
| **Xử lý Đa luồng** | Tạo `ExecutorUtil` tự tạo ThreadPool thô | Cấu hình `@EnableAsync` với `ThreadPoolTaskExecutor` trong `AsyncConfig`. |
| **Bảo mật & CORS** | Viết `CorsUtil` tự gán header | Cấu hình `SecurityFilterChain` hoặc `WebMvcConfigurer.addCorsMappings`. |

---

## 2. SO SÁNH VAI TRÒ GIỮA UTIL VÀ HELPER

| Đặc tính kỹ thuật | Lớp Tiện Ích (`*Util`) | Lớp Trợ Thủ (`*Helper`) |
| :--- | :--- | :--- |
| **Vị trí Thư mục / Package** | Bắt buộc đặt trong `.../util/` | Bắt buộc đặt trong `.../helper/` |
| **Hậu tố tên file (Suffix)** | Bắt buộc kết thúc bằng `Util.java` | Bắt buộc kết thúc bằng `Helper.java` |
| **Khai báo lớp** | `public final class` | `public final class` |
| **Spring / Framework Bean** | **KHÔNG DÙNG** (Không là Bean) | `@Component` / `@AutoComponent` (Là Bean được quản lý) |
| **Constructor** | `private` ném `UnsupportedOperationException(CommonConstant.MSG_UTILITY_CLASS)` | `@RequiredArgsConstructor` cho DI |
| **Loại phương thức** | **100% PHẢI LÀ `public static`** | **100% PHẢI LÀ `public` NON-STATIC** (Instance methods, **0 `static`**) |
| **Trường tĩnh (Static Field)** | **CẤM** (ngoài `@Slf4j`; hằng số/cache phải đặt ở `*Constant`) | **TUYỆT ĐỐI CẤM** (ngoài `@Slf4j`) |
| **Private Method** | **TUYỆT ĐỐI CẤM** | **TUYỆT ĐỐI CẤM** |
| **Inner / Anonymous Class** | **TUYỆT ĐỐI CẤM** (bắt buộc tách file `.java` độc lập) | **TUYỆT ĐỐI CẤM** (bắt buộc tách file `.java` độc lập) |
| **Khai báo Hằng số** | **CẤM** (phải lấy từ `*Constant` trong `constant/`) | **CẤM** (phải lấy từ `*Constant` trong `constant/`) |
| **Mục đích sử dụng** | Thuật toán băm, che dữ liệu (masking), chuỗi, UUID, reflection tĩnh | Nghiệp vụ phụ trợ, điều phối, truy vấn phụ, xử lý trạng thái tiêm qua DI |

---

## 3. CODE MẪU CHUẨN MỰC

### 3.1. Giải Pháp Ưu Tiên: Cấu Hình Toàn Cục Thay Thế `DateTimeUtil` (`JacksonConfig.java`)
```java
package com.enterprise.app.config;

import com.enterprise.app.common.constant.DateTimeConstant;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Cấu hình ObjectMapper toàn cục, tự động định dạng ngày giờ chuẩn ISO-8601 UTC
 * mà không cần phải gọi bất kỳ DateTimeUtil nào thủ công.
 */
@Configuration
public class JacksonConfig {

  @Bean
  @Primary
  public ObjectMapper objectMapper() {
    final ObjectMapper mapper = new ObjectMapper();
    final JavaTimeModule timeModule = new JavaTimeModule();

    final DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DateTimeConstant.ISO_DATETIME_PATTERN);
    timeModule.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));
    timeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(formatter));

    mapper.registerModule(timeModule);
    mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    return mapper;
  }
}
```

---

### 3.2. Lớp Util Hợp Lệ: Thuật Toán Che Mờ Dữ Liệu PII (`DataMaskingUtil.java`)
Chỉ tạo khi là thuật toán tính toán thuần túy phi trạng thái không thể cấu hình qua Spring:

```java
package com.enterprise.app.common.util;

import com.enterprise.app.common.constant.CommonConstant;
import java.util.Objects;

/**
 * Tiện ích che mờ (masking) thông tin nhạy cảm của người dùng (Email, Số điện thoại).
 *
 * <p>Tuân thủ chuẩn Util: final class, private constructor, 100% public static method.
 */
public final class DataMaskingUtil {

  private DataMaskingUtil() {
    throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
  }

  /**
   * Che mờ địa chỉ email phục vụ hiển thị an toàn (vd: a***z@domain.com).
   *
   * @param email địa chỉ email đầu vào
   * @return chuỗi đã che mờ hoặc chuỗi rỗng nếu đầu vào là null
   */
  public static String maskEmail(final String email) {
    if (Objects.isNull(email)) {
      return CommonConstant.EMPTY_STRING;
    }

    final int atIndex = email.indexOf(CommonConstant.CHAR_AT);
    if (atIndex <= 1) {
      return email;
    }

    final String username = email.substring(0, atIndex);
    final String domain = email.substring(atIndex);
    final String maskedUser = username.charAt(0) + CommonConstant.MASK_STARS + username.charAt(username.length() - 1);

    return maskedUser + domain;
  }
}
```

---

### 3.3. Lớp Helper Chuẩn Mực: Trợ Thủ Gửi Thông Báo (`NotificationHelper.java`)
```java
package com.enterprise.app.common.helper;

import com.enterprise.app.common.constant.NotificationConstant;
import com.enterprise.app.common.constant.NotificationLogConstant;
import com.enterprise.app.dto.NotificationDto;
import com.enterprise.app.service.EmailSenderService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Trợ thủ điều phối gửi thông báo đa kênh.
 *
 * <p>Tuân thủ chuẩn Helper: final class, Spring Bean (@Component),
 * tiêm qua DI constructor, 100% instance method (không static).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class NotificationHelper {

  private final EmailSenderService emailSenderService;

  public void sendEmailNotification(final NotificationDto notificationDto) {
    Objects.requireNonNull(notificationDto, NotificationConstant.MSG_NOTIFICATION_NOT_NULL);
    log.info(NotificationLogConstant.START_SEND_NOTIFICATION, notificationDto.getRecipient());

    emailSenderService.sendEmail(notificationDto.toEmailDispatchDto());

    log.info(NotificationLogConstant.FINISH_SEND_NOTIFICATION, notificationDto.getRecipient());
  }
}
```

---

## 4. CHECKLIST ĐỐI SOÁT UTIL VÀ HELPER

- [ ] **Ưu tiên Global Config**: Đã kiểm tra và xác nhận tính năng KHÔNG THỂ cấu hình tập trung bằng `@Configuration`, `WebMvcConfigurer`, hay Jackson.
- [ ] **Lớp Util**:
  - [ ] Khai báo `public final class`.
  - [ ] Constructor là `private` ném `UnsupportedOperationException`.
  - [ ] 100% phương thức là `public static` (Không có `private function`).
  - [ ] Không có annotation Spring nào trên class.
  - [ ] Thuần túy tính toán, không lưu trạng thái.
- [ ] **Lớp Helper**:
  - [ ] Khai báo `public final class`.
  - [ ] Đánh dấu `@Component`, tiêm phụ thuộc bằng `@RequiredArgsConstructor` với `private final`.
  - [ ] 100% phương thức là instance method (Tuyệt đối không có từ khóa `static`).
  - [ ] Không có `private function`.
  - [ ] **Service-to-Helper Decomposition**: Tiếp nhận 100% logic phụ trợ từ Service, giúp ServiceImpl chỉ chứa phương thức `@Override` từ Service Interface.
  - [ ] **Ưu tiên tuyệt đối Builder Pattern thay vì Setter**: Khởi tạo và cập nhật đối tượng bằng `.builder()...build()` hoặc `toBuilder()`, không gọi setter rời rạc.
- [ ] **Triệt tiêu 100% Magic Number & Magic String & Hard-Code**: 100% String/Number (prefix, default UUID, status, TTL, lý do audit) lấy từ file `*Constant` kèm Javadoc đầy đủ.
