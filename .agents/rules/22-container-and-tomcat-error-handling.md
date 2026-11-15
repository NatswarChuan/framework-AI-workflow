# Rule 22: Chuẩn Hóa Lỗi Tầng Servlet Container & Tomcat Ngoại Vi Spring

Tài liệu này quy chuẩn bắt buộc về việc bao phủ và chuẩn hóa 100% các lỗi phát sinh tại tầng **Tomcat Connector & Servlet Container** (HTTP 400, 404, 405, 413, 431, 500), triệt tiêu hoàn toàn trang Whitelabel HTML và đóng gói phản hồi về `ApiResponse<Void>` kèm mã `traceId` UUIDv7.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Triệt Tiêu Whitelabel Error Page & JSON Mặc Định**:
   - **TUYỆT ĐỐI CẤM** để lộ trang lỗi Whitelabel HTML của Spring hoặc cấu trúc JSON mặc định `{timestamp, status, error, path}`.
   - 100% lỗi từ Tomcat Connector phải được chuẩn hóa sang **`ApiResponse<Void>`**.
2. **Bộ Điều Phối Lỗi Container (`CustomContainerErrorController`)**:
   - Triển khai `ErrorController` để thay thế hoàn toàn `BasicErrorController` mặc định của Spring Boot.
   - Tiếp nhận toàn bộ điều hướng `/error` từ Tomcat, xác định mã HTTP Status và ánh xạ mã lỗi tương ứng từ `ErrorConstant`.
3. **Cấu Hình Tinh Chỉnh Tomcat (`TomcatWebServerCustomizer`)**:
   - Đăng ký `WebServerFactoryCustomizer<TomcatServletWebServerFactory>` để xử lý an toàn các ký tự URL đặc biệt (`relaxedPathChars`, `relaxedQueryChars`), ngăn chặn Tomcat ném lỗi sập connector `IllegalArgumentException: Invalid character found in request target`.

---

## 2. HẰNG SỐ LỖI CONTAINER (`ContainerErrorConstant.java`)

```java
package com.enterprise.app.common.constant;

/**
 * Hằng số định danh thuộc tính và thông điệp lỗi tầng Servlet Container và Tomcat.
 */
public final class ContainerErrorConstant {

  private ContainerErrorConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  // Thuộc tính RequestDispatcher chuẩn Jakarta Servlet
  public static final String ATTR_STATUS_CODE = "jakarta.servlet.error.status_code";
  public static final String ATTR_EXCEPTION = "jakarta.servlet.error.exception";
  public static final String ATTR_MESSAGE = "jakarta.servlet.error.message";
  public static final String ATTR_REQUEST_URI = "jakarta.servlet.error.request_uri";

  // Đường dẫn xử lý lỗi container
  public static final String ERROR_PATH = "/error";

  // Thông điệp lỗi chuẩn hóa
  public static final String MSG_NOT_FOUND = "The requested resource could not be found on the server";
  public static final String MSG_BAD_REQUEST = "Malformed HTTP request or invalid URL syntax";
  public static final String MSG_METHOD_NOT_ALLOWED = "HTTP request method is not supported for this endpoint";
  public static final String MSG_PAYLOAD_TOO_LARGE = "Uploaded file or request body exceeds maximum allowed size";
  public static final String MSG_HEADER_TOO_LARGE = "HTTP request headers exceed maximum allowed size";
  public static final String MSG_INTERNAL_ERROR = "An unexpected error occurred in the servlet container";
}
```

---

## 3. BỘ ĐIỀU PHỐI LỖI CONTAINER (`CustomContainerErrorController.java`)

```java
package com.enterprise.app.controller;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ContainerErrorConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.HttpHeaderConstant;
import com.enterprise.app.common.constant.LogConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.common.util.UuidUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller chuẩn hóa toàn bộ lỗi tầng Servlet Container và Tomcat nằm ngoài Spring MVC.
 */
@Slf4j
@RestController
public class CustomContainerErrorController implements ErrorController {

  @RequestMapping(value = ContainerErrorConstant.ERROR_PATH, produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ApiResponse<Void>> handleContainerError(final HttpServletRequest request) {
    final HttpStatus status = resolveHttpStatus(request);
    final String traceId = resolveTraceId();
    final String errorMessage = resolveErrorMessage(request, status);

    log.warn(LogConstant.LOG_START_WITH_PARAM, "CustomContainerErrorController", status.value());

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

  public String resolveErrorMessage(final HttpServletRequest request, final HttpStatus status) {
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

---

## 4. CẤU HÌNH TOMCAT & VÔ HIỆU HÓA WHITELABEL

### 4.1. Cấu Hình YAML Bắt Buộc (`application.yml`)
```yaml
server:
  error:
    whitelabel:
      enabled: false       # Tắt trang Whitelabel HTML mặc định
    include-message: always
    include-binding-errors: never
    include-stacktrace: never
    include-exception: false
  tomcat:
    max-http-form-post-size: 10MB
    max-swallow-size: 10MB
    connection-timeout: 20000ms
```

### 4.2. Đăng Ký Customizer Tomcat Cho Ký Tự Đặc Biệt (`TomcatWebServerCustomizer.java`)
```java
package com.enterprise.app.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Configuration;

/**
 * Cấu hình tinh chỉnh Tomcat Container bảo đảm an toàn trước các ký tự truy vấn đặc biệt.
 */
@Configuration
public class TomcatWebServerCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

  @Override
  public void customize(final TomcatServletWebServerFactory factory) {
    factory.addConnectorCustomizers(connector -> {
      connector.setProperty("relaxedPathChars", "[]|");
      connector.setProperty("relaxedQueryChars", "[]|{}^&#x5c;&#x60;&quot;&lt;&gt;");
    });
  }
}
```
