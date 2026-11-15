---
name: spring-boot-exception-handling
description: >-
  Kích hoạt kỹ năng này khi xây dựng cơ chế xử lý ngoại lệ tập trung (Global Exception Handling),
  định nghĩa Custom Business Exceptions gắn liền với chuẩn HTTP Status Code (400, 401, 403, 404, 409, 500),
  cấu hình @RestControllerAdvice, chuẩn hóa phản hồi lỗi và tích hợp đa ngôn ngữ i18n.
---

# Kỹ Năng: Xử Lý Ngoại Lệ Tập Trung Chuẩn HTTP Status Code & Nghiệp Vụ

Kỹ năng này hướng dẫn thiết lập hệ thống ngoại lệ chuẩn mực cho môi trường doanh nghiệp: **Tuyệt đối KHÔNG sử dụng các Exception class có sẵn của Java/Spring** trong luồng nghiệp vụ mà **100% bắt buộc phải customize lại** thành các Custom Business Exception, ánh xạ trực tiếp mỗi ngoại lệ với một mã **HTTP Status Code** chuẩn mực và trả về phản hồi đa ngôn ngữ.

---

## 1. NGUYÊN TẮC BẮT BUỘC TRONG XỬ LÝ NGOẠI LỆ

1. **TUYỆT ĐỐI CẤM dùng Exception class có sẵn trong nghiệp vụ**:
   - Tuyệt đối không ném: `IllegalArgumentException`, `IllegalStateException`, `NoSuchElementException`, `EntityNotFoundException`, `RuntimeException`, `NullPointerException`, `ResponseStatusException`.
   - **Lý do**: Mất ngữ cảnh miền nghiệp vụ (Domain Context), sai lệch HTTP Status (bị bẫy thành 500 thay vì 400/404/409), nguy cơ rò rỉ stack trace (vi phạm OWASP) và không thể hỗ trợ đa ngôn ngữ (i18n).
   - **Yêu cầu bắt buộc**: 100% ngoại lệ nghiệp vụ phải được tạo thành các **Custom Exception** kế thừa `BaseBusinessException`, mang mã lỗi `errorCode` từ `ErrorConstant` và mã `HttpStatus` chuẩn.
2. **Gắn liền với chuẩn HTTP Status Code**:
   - Mọi ngoại lệ nghiệp vụ kế thừa từ `BaseBusinessException`.
   - `BaseBusinessException` bắt buộc lưu trữ trường **`HttpStatus httpStatus`** để quyết định mã trạng thái HTTP trả về phía client.
3. **Bảng ánh xạ thay thế Exception có sẵn sang Custom Exception**:

| Exception có sẵn (**BỊ CẤM**) | Custom Exception thay thế (**BẮT BUỘC**) | Mã HttpStatus tương ứng |
| :--- | :--- | :--- |
| `IllegalArgumentException` | `InvalidParameterException` / `BadRequestException` | `HttpStatus.BAD_REQUEST` (400) |
| `NoSuchElementException` / `EntityNotFoundException` | `ResourceNotFoundException` / `UserNotFoundException` | `HttpStatus.NOT_FOUND` (404) |
| `IllegalStateException` | `InvalidStateTransitionException` / `BusinessRuleViolationException` | `HttpStatus.BAD_REQUEST` (400) |
| `SecurityException` | `ForbiddenActionException` / `AccessDeniedBusinessException` | `HttpStatus.FORBIDDEN` (403) |
| `AuthenticationException` | `UnauthorizedException` / `InvalidTokenException` | `HttpStatus.UNAUTHORIZED` (401) |
| `DuplicateKeyException` | `ConflictException` / `UserAlreadyExistsException` | `HttpStatus.CONFLICT` (409) |
| `RuntimeException` (thô) | `BusinessException` / `InternalBusinessException` | `HttpStatus.INTERNAL_SERVER_ERROR` (500) |

4. **Xử lý tập trung qua `@RestControllerAdvice`**:
   - `GlobalExceptionHandler` bắt `BaseBusinessException` và trả về `ResponseEntity.status(ex.getHttpStatus()).body(...)`.
   - Thông điệp lỗi được lấy động qua `MessageHelper` hỗ trợ đa ngôn ngữ i18n.
5. **Không dùng `nested if` và không dùng toán tử 3 ngôi**:
   - Khối xử lý validation duyệt lỗi bằng flat guard clauses, an toàn trước NPE bằng `Objects.isNull()` / `Objects.nonNull()`.
6. **Không dùng kiểu `Object` trong mảng tham số**:
   - Dùng `List<String> messageArgs` thay vì `Object[] args` để đảm bảo 100% Type-Safety.

---

## 2. CODE MẪU CHUẨN MỰC

### 2.1. Base Business Exception Kèm `HttpStatus` (`BaseBusinessException.java`)
```java
package com.enterprise.app.exception;

import java.util.Collections;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Lớp ngoại lệ cơ sở cho toàn bộ ngoại lệ nghiệp vụ trong ứng dụng.
 *
 * <p>Tuân thủ quy tắc không dùng abstract class: là class thông thường,
 * bắt buộc mang theo {@link HttpStatus} để xác định chính xác mã phản hồi HTTP.
 */
@Getter
public class BaseBusinessException extends RuntimeException {

  private final HttpStatus httpStatus;
  private final String errorCode;
  private final List<String> messageArgs;

  /**
   * Khởi tạo ngoại lệ với HttpStatus, mã lỗi và thông điệp.
   *
   * @param httpStatus mã trạng thái HTTP tương ứng
   * @param errorCode mã lỗi định danh nghiệp vụ
   * @param message thông điệp mô tả lỗi
   */
  public BaseBusinessException(
      final HttpStatus httpStatus,
      final String errorCode,
      final String message) {
    super(message);
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.messageArgs = Collections.emptyList();
  }

  /**
   * Khởi tạo ngoại lệ có tham số nội suy đa ngôn ngữ.
   *
   * @param httpStatus mã trạng thái HTTP tương ứng
   * @param errorCode mã lỗi định danh nghiệp vụ
   * @param message thông điệp mô tả lỗi
   * @param messageArgs danh sách tham số dạng chuỗi phục vụ đa ngôn ngữ i18n
   */
  public BaseBusinessException(
      final HttpStatus httpStatus,
      final String errorCode,
      final String message,
      final List<String> messageArgs) {
    super(message);
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.messageArgs = messageArgs;
  }
}
```

---

### 2.2. Các Lớp Ngoại Lệ Nghiệp Vụ Tùy Biến Giàu Ngữ Cảnh (Rich Domain Exceptions)

#### 1. Tài Nguyên Không Tìm Thấy (HTTP 404 - `UserNotFoundException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi không tìm thấy người dùng theo định danh (HTTP 404 Not Found).
 */
@Getter
public class UserNotFoundException extends BaseBusinessException {

  private final String identifier;

  /**
   * Khởi tạo ngoại lệ kèm mã định danh người dùng.
   *
   * @param identifier mã ID hoặc username tìm kiếm
   */
  public UserNotFoundException(final String identifier) {
    super(
        HttpStatus.NOT_FOUND,
        ErrorConstant.ERR_USER_NOT_FOUND,
        "User not found with identifier: " + identifier,
        List.of(identifier)
    );
    this.identifier = identifier;
  }
}
```

#### 2. Xung Đột Email / Đã Tồn Tại (HTTP 409 - `DuplicateEmailException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi địa chỉ email đã tồn tại trong hệ thống (HTTP 409 Conflict).
 */
@Getter
public class DuplicateEmailException extends BaseBusinessException {

  private final String email;

  /**
   * Khởi tạo ngoại lệ kèm email bị trùng.
   *
   * @param email địa chỉ email xung đột
   */
  public DuplicateEmailException(final String email) {
    super(
        HttpStatus.CONFLICT,
        ErrorConstant.ERR_EMAIL_ALREADY_EXISTS,
        "Email is already in use: " + email,
        List.of(email)
    );
    this.email = email;
  }
}
```

#### 3. Vi Phạm Quy Tắc Số Dư (HTTP 422 - `InsufficientBalanceException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi số dư tài khoản không đủ để thực hiện thanh toán.
 */
@Getter
public class InsufficientBalanceException extends BaseBusinessException {

  private final String accountId;
  private final BigDecimal currentBalance;
  private final BigDecimal requiredAmount;

  /**
   * Khởi tạo ngoại lệ số dư không đủ kèm ngữ cảnh miền chi tiết.
   *
   * @param accountId mã tài khoản
   * @param currentBalance số dư hiện có
   * @param requiredAmount số tiền cần thanh toán
   */
  public InsufficientBalanceException(
      final String accountId,
      final BigDecimal currentBalance,
      final BigDecimal requiredAmount) {
    super(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorConstant.ERR_INSUFFICIENT_BALANCE,
        "Account has insufficient balance for transaction",
        List.of(accountId, currentBalance.toPlainString(), requiredAmount.toPlainString())
    );
    this.accountId = accountId;
    this.currentBalance = currentBalance;
    this.requiredAmount = requiredAmount;
  }
}
```

#### 4. Chuyển Đổi Trạng Thái Không Hợp Lệ (HTTP 400 - `InvalidOrderStateTransitionException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi đơn hàng chuyển đổi trạng thái bất hợp pháp (HTTP 400 Bad Request).
 */
@Getter
public class InvalidOrderStateTransitionException extends BaseBusinessException {

  private final String orderId;
  private final String currentStatus;
  private final String targetStatus;

  /**
   * Khởi tạo ngoại lệ chuyển trạng thái đơn hàng bất hợp lệ.
   *
   * @param orderId mã đơn hàng
   * @param currentStatus trạng thái hiện tại
   * @param targetStatus trạng thái đích muốn chuyển
   */
  public InvalidOrderStateTransitionException(
      final String orderId,
      final String currentStatus,
      final String targetStatus) {
    super(
        HttpStatus.BAD_REQUEST,
        ErrorConstant.ERR_INVALID_ORDER_STATE,
        "Cannot transition order " + orderId + " from " + currentStatus + " to " + targetStatus,
        List.of(orderId, currentStatus, targetStatus)
    );
    this.orderId = orderId;
    this.currentStatus = currentStatus;
    this.targetStatus = targetStatus;
  }
}
```

---

### 2.3. Global Exception Handler (`GlobalExceptionHandler.java`)
```java
package com.enterprise.app.handler;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.LogConstant;
import com.enterprise.app.common.helper.MessageHelper;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.exception.BaseBusinessException;
import com.enterprise.app.response.ValidationErrorDetail;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Bộ xử lý ngoại lệ tập trung chuẩn hóa phản hồi theo mã HTTP Status.
 *
 * <p>Tuân thủ 100% sử dụng hằng số, triệt tiêu toàn bộ magic string kể cả trong log.
 */
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

  private final MessageHelper messageHelper;

  /**
   * Bắt toàn bộ các ngoại lệ nghiệp vụ và trả về đúng HttpStatus tương ứng.
   *
   * @param ex đối tượng ngoại lệ nghiệp vụ
   * @return {@link ResponseEntity} mang mã HTTP Status và {@link ApiResponse} chuẩn
   */
  @ExceptionHandler(BaseBusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(final BaseBusinessException ex) {
    log.warn(LogConstant.LOG_WARN_BUSINESS, ex.getHttpStatus(), ex.getErrorCode(), ex.getMessage());

    String localizedMsg = messageHelper.getMessage(
        ex.getErrorCode(),
        ex.getMessageArgs().toArray(new String[CommonConstant.ZERO])
    );
    if (Objects.isNull(localizedMsg)) {
      localizedMsg = ex.getMessage();
    }
    if (localizedMsg.isEmpty()) {
      localizedMsg = ex.getMessage();
    }

    final ApiResponse<Void> response = ApiResponse.error(ex.getErrorCode(), localizedMsg);
    return ResponseEntity.status(ex.getHttpStatus()).body(response);
  }

  /**
   * Bắt lỗi xác thực tham số đầu vào (@Valid).
   *
   * @param ex ngoại lệ validation
   * @return phản hồi HTTP 400 Bad Request kèm chi tiết lỗi
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<List<ValidationErrorDetail>>> handleValidationException(
      final MethodArgumentNotValidException ex) {
    log.warn(LogConstant.LOG_VALIDATION_ERROR, ex.getMessage());

    final List<ValidationErrorDetail> errorDetails = new ArrayList<>();
    final BindingResult bindingResult = ex.getBindingResult();

    for (final FieldError fieldError : bindingResult.getFieldErrors()) {
      String rejectedVal = CommonConstant.EMPTY_STRING;
      if (Objects.nonNull(fieldError.getRejectedValue())) {
        rejectedVal = String.valueOf(fieldError.getRejectedValue());
      }

      final ValidationErrorDetail detail = ValidationErrorDetail.builder()
          .field(fieldError.getField())
          .rejectedValue(rejectedVal)
          .message(fieldError.getDefaultMessage())
          .build();
      errorDetails.add(detail);
    }

    final ApiResponse<List<ValidationErrorDetail>> response = ApiResponse.error(
        ErrorConstant.ERR_VALIDATION_FAILED,
        ErrorConstant.MSG_VALIDATION_FAILED,
        errorDetails
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
  }

  /**
   * Bắt các ngoại lệ hệ thống ngoài ý muốn (HTTP 500).
   *
   * @param ex ngoại lệ không mong muốn
   * @return phản hồi HTTP 500 Internal Server Error
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiResponse<Void>> handleUnexpectedException(final Exception ex) {
    log.error(LogConstant.LOG_UNEXPECTED_EXCEPTION, ex);

    final ApiResponse<Void> response = ApiResponse.error(
        ErrorConstant.ERR_INTERNAL_SERVER,
        ErrorConstant.MSG_INTERNAL_SERVER
    );
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
  }
}
```

---

## 3. BAO PHỦ 100% LỖI TẦNG TOMCAT / SERVLET CONTAINER & FILTER CHAIN (NGOẠI VI SPRING)

Các lỗi sinh ra trước khi tới `DispatcherServlet` (lỗi Filter, Tomcat 400 URL invalid, 404 static path, 413 Payload Too Large, 431 Header Too Large) không đi qua `@RestControllerAdvice`. Ta sử dụng bộ đôi **Filter Exception Handler** và **Custom ErrorController**:

### 3.1. Bộ Lọc Bẫy Lỗi Filter Chain (`ServletFilterExceptionHandler.java`):
```java
package com.enterprise.app.filter;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.HttpHeaderConstant;
import com.enterprise.app.common.constant.LogConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.common.util.UuidUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Bẫy mọi lỗi phát sinh từ các Filter phía sau và trả về ApiResponse chuẩn.
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class ServletFilterExceptionHandler extends OncePerRequestFilter {

  private final ObjectMapper objectMapper;

  @Override
  public void doFilterInternal(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final FilterChain filterChain) throws ServletException, IOException {

    try {
      filterChain.doFilter(request, response);
    } catch (final Throwable throwable) {
      log.error(LogConstant.LOG_ERROR_WITH_EXCEPTION, "ServletFilterExceptionHandler", throwable.getMessage(), throwable);
      writeErrorResponse(response, throwable);
    }
  }

  public void writeErrorResponse(final HttpServletResponse response, final Throwable throwable) throws IOException {
    final String traceId = resolveOrCreateTraceId();

    response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setHeader(HttpHeaderConstant.HEADER_TRACE_ID, traceId);

    final ApiResponse<Void> apiResponse = ApiResponse.error(
        ErrorConstant.ERR_INTERNAL_SERVER,
        throwable.getMessage(),
        traceId
    );

    response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
  }

  public String resolveOrCreateTraceId() {
    final String existingTraceId = MDC.get(CommonConstant.KEY_TRACE_ID);
    if (Objects.nonNull(existingTraceId)) {
      return existingTraceId;
    }
    return UuidUtil.generateUuidV7().toString();
  }
}
```

### 3.2. Bộ Điều Phối Lỗi Container (`CustomContainerErrorController.java`):
Bắt toàn bộ điều hướng `/error` từ Tomcat, xóa bỏ Whitelabel page và trả `ApiResponse` chuẩn:

```java
package com.enterprise.app.controller;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ContainerErrorConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.HttpHeaderConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.common.util.UuidUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import org.slf4j.MDC;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller chuẩn hóa toàn bộ lỗi tầng Servlet Container ngoại vi Spring MVC.
 */
@RestController
public class CustomContainerErrorController implements ErrorController {

  @RequestMapping(value = ContainerErrorConstant.ERROR_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<Void>> handleContainerError(final HttpServletRequest request) {
    final HttpStatus status = resolveHttpStatus(request);
    final String traceId = resolveTraceId();
    final String errorMessage = resolveErrorMessage(status);

    final ApiResponse<Void> apiResponse = ApiResponse.error(
        resolveErrorCode(status),
        errorMessage,
        traceId
    );

    final HttpHeaders headers = new HttpHeaders();
    headers.add(HttpHeaderConstant.HEADER_TRACE_ID, traceId);

    return new ResponseEntity<>(apiResponse, headers, status);
  }

  public HttpStatus resolveHttpStatus(final HttpServletRequest request) {
    final Object statusCodeObj = request.getAttribute(ContainerErrorConstant.ATTR_STATUS_CODE);
    if (Objects.isNull(statusCodeObj)) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    final int statusCode = Integer.parseInt(statusCodeObj.toString());
    final HttpStatus resolvedStatus = HttpStatus.resolve(statusCode);
    if (Objects.isNull(resolvedStatus)) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return resolvedStatus;
  }

  public String resolveErrorCode(final HttpStatus status) {
    if (Objects.equals(status, HttpStatus.NOT_FOUND)) {
      return ErrorConstant.ERR_RESOURCE_NOT_FOUND;
    }
    if (Objects.equals(status, HttpStatus.BAD_REQUEST)) {
      return ErrorConstant.ERR_BAD_REQUEST;
    }
    if (Objects.equals(status, HttpStatus.METHOD_NOT_ALLOWED)) {
      return ErrorConstant.ERR_METHOD_NOT_ALLOWED;
    }
    if (Objects.equals(status, HttpStatus.PAYLOAD_TOO_LARGE)) {
      return ErrorConstant.ERR_PAYLOAD_TOO_LARGE;
    }
    return ErrorConstant.ERR_INTERNAL_SERVER;
  }

  public String resolveErrorMessage(final HttpStatus status) {
    if (Objects.equals(status, HttpStatus.NOT_FOUND)) {
      return ContainerErrorConstant.MSG_NOT_FOUND;
    }
    if (Objects.equals(status, HttpStatus.BAD_REQUEST)) {
      return ContainerErrorConstant.MSG_BAD_REQUEST;
    }
    if (Objects.equals(status, HttpStatus.METHOD_NOT_ALLOWED)) {
      return ContainerErrorConstant.MSG_METHOD_NOT_ALLOWED;
    }
    if (Objects.equals(status, HttpStatus.PAYLOAD_TOO_LARGE)) {
      return ContainerErrorConstant.MSG_PAYLOAD_TOO_LARGE;
    }
    return ContainerErrorConstant.MSG_INTERNAL_ERROR;
  }

  public String resolveTraceId() {
    final String existingTraceId = MDC.get(CommonConstant.KEY_TRACE_ID);
    if (Objects.nonNull(existingTraceId)) {
      return existingTraceId;
    }
    return UuidUtil.generateUuidV7().toString();
  }
}
```
