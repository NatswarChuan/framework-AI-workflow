# Rule 11: Hạ Tầng Ghi Nhật Ký (Logging Infrastructure) & Giám Sát Truy Vết (Trace Request ID)

Tài liệu này quy định tiêu chuẩn toàn diện về hệ thống ghi nhật ký (Logging) và cơ chế phân bổ mã định danh truy vết luồng xử lý (**Trace Request ID**) xuyên suốt tất cả các tầng trong hệ thống.

---

## 1. NGUYÊN TẮC BẮT BUỘC KHI GHI NHẬT KÝ (LOGGING DIRECTIVES)

### 1.1. Luôn Sử Dụng Hằng Số Cho Thông Điệp Log (Zero Magic String Trong Log)
- **NGUYÊN TẮC BẮT BUỘC**:
  - **TUYỆT ĐỐI CẤM** viết chuỗi ký tự trực tiếp (String literal / Magic String) bên trong các hàm log (`log.info`, `log.warn`, `log.error`, `log.debug`).
  - Toàn bộ mẫu chuỗi log (Log Templates) **BẮT BUỘC** phải được định nghĩa trong các lớp Constant (`LogConstant` cho mẫu chung, hoặc `*LogConstant` theo từng domain nghiệp vụ: `UserLogConstant`, `OrderLogConstant`, `PaymentLogConstant`).
- **Ghi log bắt đầu và kết thúc mỗi Function (Entry & Exit Logging)**:
  - **Đầu hàm (Entry Log)**: Dùng hằng số log ghi rõ tên hàm và các tham số định danh đầu vào (đã loại bỏ PII).
  - **Cuối hàm (Exit Log)**: Dùng hằng số log ghi nhận hoàn tất và kết quả trả về.
  - **Khi có lỗi (Error Log)**: Dùng hằng số log ghi nhận lỗi và truyền đối tượng ngoại lệ để in stacktrace.

```java
// VÍ DỤ CHUẨN MỰC TRONG SERVICE (100% SỬ DỤNG HẰNG SỐ, ZERO MAGIC STRING/NUMBER):
@Override
@Transactional(rollbackFor = Exception.class)
public UserResponse createUser(final UserCreateRequest request) {
  Objects.requireNonNull(request, UserConstant.MSG_REQUEST_NOT_NULL);

  // 1. LOG BẮT ĐẦU FUNCTION DÙNG HẰNG SỐ
  log.info(UserLogConstant.START_CREATE_USER, request.getUsername(), request.getEmail());

  // ... Xử lý nghiệp vụ ...

  final UserResponse response = userMapper.toResponse(savedEntity);

  // 2. LOG KẾT THÚC FUNCTION DÙNG HẰNG SỐ
  log.info(UserLogConstant.FINISH_CREATE_USER, response.getId());
  return response;
}
```

---

### 1.2. Phân Định Cấp Độ Log (Log Levels Matrix)

| Cấp độ | Mục đích sử dụng | Môi trường áp dụng | Ví dụ (Sử dụng Hằng số) |
| :--- | :--- | :--- | :--- |
| **`DEBUG`** | Chi tiết kỹ thuật nội bộ, vết biến đổi trạng thái dữ liệu, kết quả truy vấn. | Dev, Testing | `log.debug(PricingLogConstant.DEBUG_EVAL_DISCOUNT, tier);` |
| **`INFO`** | Các mốc sự kiện quan trọng: Bắt đầu/kết thúc hàm, giao dịch hoàn tất, tích hợp API. | Tất cả môi trường | `log.info(PaymentLogConstant.START_PROCESS_PAYMENT, orderId);` |
| **`WARN`** | Tình huống bất thường nhưng tự phục hồi: Retry kết nối, fallback cache, sai sót validation. | Tất cả môi trường | `log.warn(LogConstant.LOG_CACHE_MISS, cacheKey);` |
| **`ERROR`** | Lỗi nghiêm trọng gián đoạn luồng xử lý, ngoại lệ hệ thống, hỏng kết nối CSDL. Bắt buộc kèm `Throwable`. | Tất cả môi trường | `log.error(PaymentLogConstant.ERR_TRANSACTION_FAILED, orderId, ex);` |

---

### 1.3. Bảo Mật Thông Tin & Che Giấu Dữ Liệu Nhạy Cảm (Masking PII)
- **TUYỆT ĐỐI KHÔNG GHI LOG**:
  - Mật khẩu người dùng (Password).
  - Khóa bí mật (JWT Secret, Private Key, API Keys).
  - Mã số thẻ tín dụng (CVV, Full PAN).
  - Thông tin định danh cá nhân nhạy cảm chưa được làm mờ (CCCD, OTP).

---

## 2. CƠ CHẾ TRACE REQUEST ID TOÀN HỆ THỐNG (DISTRIBUTED TRACING)

### 2.1. Quy Trình Hoạt Động Của Trace Request ID
```
[ Client Request ] ────► Mang Header 'X-Request-ID' (hoặc tự sinh UUID nếu chưa có)
       │
       ▼
[ TraceIdFilter ] ─────► 1. Trích xuất / Sinh mới traceId
       │                 2. Nạp vào MDC: MDC.put("traceId", traceId)
       │                 3. Đính kèm vào HTTP Response Header: 'X-Request-ID'
       ▼
[ Controller / Service / Helper ]
       │                ──► Mọi dòng log tự động xuất hiện [traceId] qua Logback Pattern
       ▼
[ GlobalExceptionHandler ]
       │                ──► Đính kèm traceId vào ApiResponse trả về cho client
       ▼
[ Finally Block Filter] ──► MDC.remove("traceId") (Chống rò rỉ ThreadLocal trong Thread Pool)
```

---

### 2.2. Lớp Hằng Số Truy Vết (`TraceConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp hằng số phục vụ cơ chế giám sát truy vết (Tracing).
 */
public final class TraceConstant {

  private TraceConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String TRACE_ID_HEADER = "X-Request-ID";
  public static final String TRACE_ID_MDC_KEY = "traceId";
}
```

---

### 2.3. Bộ Lọc Truy Vết HTTP (`TraceIdFilter.java`)
```java
package com.enterprise.app.filter;

import com.enterprise.app.common.constant.TraceConstant;
import com.enterprise.app.common.util.UuidUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Bộ lọc tiền xử lý HTTP chịu trách nhiệm khởi tạo và đồng bộ Trace Request ID bằng UUIDv7.
 *
 * <p>Được ưu tiên chạy đầu tiên (HIGHEST_PRECEDENCE) để mọi dòng log
 * của request đều có traceId ngay từ khi bắt đầu.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TraceIdFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain) throws ServletException, IOException {

    String traceId = request.getHeader(TraceConstant.TRACE_ID_HEADER);
    if (Objects.isNull(traceId)) {
      traceId = UuidUtil.generateUuidV7String();
    }
    if (traceId.trim().isEmpty()) {
      traceId = UuidUtil.generateUuidV7String();
    }

    // Nạp traceId vào SLF4J MDC
    MDC.put(TraceConstant.TRACE_ID_MDC_KEY, traceId);

    // Gắn traceId vào header phản hồi để Client dễ dàng đối soát khi có sự cố
    response.setHeader(TraceConstant.TRACE_ID_HEADER, traceId);

    try {
      filterChain.doFilter(request, response);
    } finally {
      // Dọn dẹp sạch sẽ tránh rò rỉ dữ liệu giữa các request dùng chung Thread Pool
      MDC.remove(TraceConstant.TRACE_ID_MDC_KEY);
    }
  }
}
```

---

## 3. CẤU HÌNH HẠ TẦNG LOGBACK PHÂN CHIA ĐẦY ĐỦ (`logback-spring.xml`)

Đặt tệp tin `logback-spring.xml` tại thư mục `src/main/resources/` để phân tách hạ tầng log:
1. **Console Appender**: Màu sắc rõ ràng, định dạng dễ đọc cho môi trường Development (`%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{traceId}] %-5level %logger{36} - %msg%n`).
2. **Rolling File Appender (App Log)**: Lưu trữ file log hằng ngày với chính sách giới hạn dung lượng (`SizeAndTimeBasedRollingPolicy`).
3. **Rolling File Appender (Error Log)**: Chỉ lưu trữ các log mức `WARN` và `ERROR` để đội ngũ vận hành phân tích lỗi nhanh chóng.
4. **Async Appender (Bất đồng bộ)**: Bao bọc các File Appender bằng `AsyncAppender` để quá trình ghi file I/O không làm nghẽn luồng xử lý chính của ứng dụng.
