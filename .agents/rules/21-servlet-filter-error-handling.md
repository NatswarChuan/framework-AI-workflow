# Rule 21: Xử Lý Ngoại Lệ Tầng Servlet Filter Chain (Filter Error Handling)

Tài liệu này quy chuẩn bắt buộc về việc bẫy và chuẩn hóa 100% các ngoại lệ phát sinh trong chuỗi **Servlet Filter Chain** trước khi request đi tới `DispatcherServlet` của Spring MVC.

---

## 1. TẠI SAO BẮT BUỘC PHẢI CÓ FILTER EXCEPTION HANDLER?

1. **Giới Hạn Tuyệt Đối Của `@RestControllerAdvice`**:
   - `@RestControllerAdvice` chỉ bẫy được các ngoại lệ phát sinh **BÊN TRONG** vòng đời của Spring MVC `DispatcherServlet`.
   - Nếu bất kỳ Filter nào trong chuỗi (JWT Authentication Filter, RateLimiting Filter, CORS Filter, Tracing Filter) ném ngoại lệ hoặc gặp lỗi runtime:
     - Ngoại lệ sẽ văng thẳng ra Servlet Container (Tomcat).
     - Tomcat sẽ hiển thị trang HTML Whitelabel mặc định hoặc trả về JSON thô của container, phá vỡ cấu trúc API và làm rò rỉ stack trace nhạy cảm.
2. **Cơ Chế Tuyến Phòng Thủ Số 1 (First Line of Defense)**:
   - Đặt `ServletFilterExceptionHandler` ở vị trí đầu tiên trong Filter Chain (`@Order(Ordered.HIGHEST_PRECEDENCE)`).
   - Bắt mọi `Throwable` từ các filter phía sau, chuẩn hóa thành `ApiResponse<Void>` kèm mã `traceId` (UUIDv7) và ghi trực tiếp JSON ra `HttpServletResponse`.

---

## 2. TRIỂN KHAI CHUẨN: `ServletFilterExceptionHandler.java`

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
 * Bộ lọc ở cửa ngõ đầu tiên của chuỗi Servlet Filter để bẫy mọi ngoại lệ nảy sinh từ các Filter tiếp sau.
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
