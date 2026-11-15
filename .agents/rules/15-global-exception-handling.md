# Rule 15: Xử Lý Ngoại Lệ Tập Trung (Global Exception Handling) & Chuẩn Hóa Phản Hồi

Quy chuẩn này quy định về kiến trúc xử lý ngoại lệ tập trung qua `@RestControllerAdvice`, chuẩn hóa phản hồi lỗi `ApiResponse<Void>`, tích hợp đa ngôn ngữ (i18n) và bảo vệ an toàn thông tin hệ thống.

---

## 1. NGUYÊN TẮC XỬ LÝ NGOẠI LỆ TẬP TRUNG

1. **Một Nơi Xử Lý Duy Nhất (Single Handler Responsibility)**: Toàn bộ ngoại lệ trong luồng Spring MVC bắt buộc phải được xử lý tập trung tại `GlobalExceptionHandler` được đánh dấu `@RestControllerAdvice`.
2. **Không Rò Rỉ Chi Tiết Kỹ Thuật (Zero Sensitive Information Leak)**: Tuyệt đối không bao giờ trả về stack trace, tên class nội bộ, hay câu lệnh SQL thô cho client trong môi trường sản xuất.
3. **Phản Hồi Đồng Nhất với `ApiResponse<Void>`**: Mọi lỗi đều trả về cấu trúc đồng nhất chứa `success: false`, `errorCode`, `message` và `traceId` (UUIDv7) để đối soát.
4. **Tích Hợp Đa Ngôn Ngữ (i18n)**: Thông điệp lỗi hiển thị cho người dùng phải được nội suy tự động qua `MessageHelper` dựa trên Locale của request.

---

## 2. TRIỂN KHAI CHUẨN: `GlobalExceptionHandler.java`

```java
package com.enterprise.app.handler;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.LogConstant;
import com.enterprise.app.common.helper.MessageHelper;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.common.util.UuidUtil;
import com.enterprise.app.exception.BaseBusinessException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Bộ xử lý ngoại lệ tập trung toàn cục cho toàn bộ ứng dụng.
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  private final MessageHelper messageHelper;

  /**
   * Bẫy và xử lý toàn bộ Custom Business Exception trong hệ thống.
   */
  @ExceptionHandler(BaseBusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(final BaseBusinessException ex) {
    log.warn(LogConstant.LOG_WARN_BUSINESS, ex.getErrorCode(), ex.getMessage());

    String localizedMessage = messageHelper.getMessage(
        ex.getErrorCode(),
        ex.getMessageArgs().toArray(new String[CommonConstant.ZERO])
    );
    if (Objects.isNull(localizedMessage) || localizedMessage.isEmpty()) {
      localizedMessage = ex.getMessage();
    }

    final String traceId = resolveTraceId();
    final ApiResponse<Void> response = ApiResponse.error(ex.getErrorCode(), localizedMessage, traceId);
    return ResponseEntity.status(ex.getHttpStatus()).body(response);
  }

  /**
   * Bẫy lỗi kiểm tra dữ liệu đầu vào (Jakarta Bean Validation).
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Void>> handleValidationException(final MethodArgumentNotValidException ex) {
    final String defaultMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
    log.warn(LogConstant.LOG_VALIDATION_ERROR, defaultMessage);

    final String traceId = resolveTraceId();
    final ApiResponse<Void> response = ApiResponse.error(
        ErrorConstant.ERR_VALIDATION_FAILED,
        defaultMessage,
        traceId
    );
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  /**
   * Bẫy ngoại lệ hệ thống không mong muốn (Fallback Safety Net).
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleUnexpectedException(final Exception ex) {
    log.error(LogConstant.LOG_UNEXPECTED_EXCEPTION, ex);

    final String traceId = resolveTraceId();
    final ApiResponse<Void> response = ApiResponse.error(
        ErrorConstant.ERR_INTERNAL_SERVER,
        "An unexpected error occurred. Please contact support.",
        traceId
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }

  public String resolveTraceId() {
    final String traceId = MDC.get(CommonConstant.KEY_TRACE_ID);
    if (Objects.nonNull(traceId)) {
      return traceId;
    }
    return UuidUtil.generateUuidV7().toString();
  }
}
```

---

## 3. CHECKLIST KIỂM SOÁT XỬ LÝ LỖI TRƯỚC KHI BÀN GIAO

- [ ] Không có `new IllegalArgumentException`, `NoSuchElementException`, `IllegalStateException`.
- [ ] Không có `new RuntimeException` với chuỗi message thô trong tầng Service.
- [ ] 100% ngoại lệ nghiệp vụ kế thừa `BaseBusinessException` mang `HttpStatus` và mã lỗi trong `ErrorConstant`.
- [ ] Mọi thông điệp lỗi đều có key định nghĩa trong `messages.properties` và `messages_vi.properties`.
- [ ] Phản hồi lỗi trả về chuẩn `ApiResponse<Void>` kèm mã `traceId` UUIDv7.
