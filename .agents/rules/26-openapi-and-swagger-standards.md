# Quy Chuẩn Swagger & OpenAPI 3.0 Toàn Diện (OpenAPI & Swagger Standards)

Tài liệu này xác lập các chuẩn mực bắt buộc về tài liệu hóa API thông qua Springdoc OpenAPI 3.0 (Swagger UI) trong hệ thống Spring Boot.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **100% API Phải Có Tài Liệu Swagger Hoàn Chỉnh**: Mọi REST Controller, Request DTO, Response DTO, Path/Query Parameter đều bắt buộc phải được mô tả chi tiết bằng các annotation của OpenAPI 3 (`@Tag`, `@Operation`, `@ApiResponse`, `@Schema`, `@Parameter`).
2. **Ẩn Tuyệt Đối Các Endpoint Không Thể / Không Được Sử Dụng Qua Swagger (`@Hidden`)**:
   - Bắt buộc gắn `@Hidden` (hoặc `@Operation(hidden = true)`) lên các endpoint nội bộ, endpoint chỉ phục vụ webhook callbacks, endpoint kỹ thuật (`/error`, filter dispatch) hoặc các endpoint streaming dữ liệu nhịp cao (SSE raw continuous stream, binary duplex) không thể tương tác thực nghiệm bình thường trên giao diện Swagger UI.
   - Giữ cho giao diện Swagger UI luôn tinh gọn, 100% endpoint hiển thị đều có thể thử nghiệm ("Try it out") thành công.
3. **Mô Tả Chi Tiết 100% Field, Request, Response & Giá Trị Mẫu (Realistic Examples)**:
   - Request & Response DTO: 100% trường dữ liệu phải có `@Schema` ghi rõ ý nghĩa nghiệp vụ (`description`), định dạng kiểu (`format`), giá trị mẫu thực tế (`example`), và tính bắt buộc (`requiredMode`).
   - Tuyệt đối không dùng giá trị mẫu chung chung hoặc vô nghĩa (như `"string"`, `"123"`, `"test"`). Bắt buộc cung cấp example thực tế (như UUIDv7 mẫu, email mẫu, timestamp ISO-8601 UTC).
   - Controller Method: Bắt buộc mô tả toàn bộ các mã phản hồi có thể xảy ra: `200/201 (Success)`, `400 (Bad Request)`, `401 (Unauthorized)`, `403 (Forbidden)`, `404 (Not Found)`, `500 (Internal Error)` với Schema tương ứng (`ApiResponse<T>` hoặc `ApiResponse<Void>`).
4. **Triệt Tiêu 100% Magic String Trong Annotation Swagger**:
   - Toàn bộ chuỗi thông điệp trong Swagger (`summary`, `description`, `example`, `name`, `tagName`) bắt buộc phải được khai báo tập trung trong các lớp Constant (`OpenApiConstant`, `*Constant`). Tuyệt đối cấm viết String literal rải rác.
5. **Cấu Hình Tập Trung Qua `OpenApiConfig`**:
   - Thiết lập cấu hình toàn cục hệ thống: OpenAPI Info, Contact, License, Security Scheme (Bearer JWT), Servers theo từng môi trường.

---

## 2. BẢNG ANNOTATION OPENAPI BẮT BUỘC

| Vị trí áp dụng | Annotation bắt buộc | Mục đích & Ràng buộc |
| :--- | :--- | :--- |
| **Controller Class** | `@Tag(name = ..., description = ...)` | Định danh nhóm API nghiệp vụ, lấy từ `OpenApiConstant`. |
| **Endpoint Không Dùng** | `@Hidden` | Ẩn hoàn toàn khỏi Swagger UI cho các endpoint nội bộ/callback. |
| **Controller Method** | `@Operation(summary = ..., description = ...)` | Tóm tắt và mô tả chi tiết hành vi của endpoint. |
| **Controller Method** | `@ApiResponses({ @ApiResponse(...), ... })` | Khai báo 100% các mã HTTP Status trả về kèm Schema & Example. |
| **Path / Query Param** | `@Parameter(name = ..., description = ..., example = ...)` | Mô tả chi tiết tham số URL, kiểu mẫu, bắt buộc hay tùy chọn. |
| **DTO Class** | `@Schema(name = ..., description = ...)` | Định danh đối tượng dữ liệu truyền tải. |
| **DTO Field** | `@Schema(description = ..., example = ..., requiredMode = ...)` | Chi tiết hóa từng trường dữ liệu, format, example thực tế. |

---

## 3. CODE MẪU CHUẨN MỰC

### 3.1. Hằng Số OpenAPI (`OpenApiConstant.java`)
```java
package com.enterprise.app.common.constant;

/**
 * Hằng số tài liệu OpenAPI và Swagger UI.
 */
public final class OpenApiConstant {

  public static final String TAG_USERS_NAME = "Quản Lý Người Dùng";
  public static final String TAG_USERS_DESC = "Các API điều phối thao tác với tài khoản người dùng";
  public static final String OP_CREATE_USER_SUMMARY = "Tạo mới tài khoản người dùng";
  public static final String OP_CREATE_USER_DESC = "Tiếp nhận dữ liệu hợp lệ và khởi tạo tài khoản mới vào hệ thống";
  public static final String SCHEMA_USER_ID_DESC = "Mã định danh duy nhất của người dùng chuẩn UUIDv7";
  public static final String SCHEMA_USER_ID_EXAMPLE = "018f6c58-8b7a-7c22-bcf8-3c31405a2e1a";
  public static final String SCHEMA_USER_EMAIL_DESC = "Địa chỉ thư điện tử chính thức của người dùng";
  public static final String SCHEMA_USER_EMAIL_EXAMPLE = "nguyen.van.a@enterprise.com";
  public static final String RESP_201_DESC = "Khởi tạo tài khoản thành công";
  public static final String RESP_400_DESC = "Dữ liệu yêu cầu không hợp lệ";

  private OpenApiConstant() {
    // Ngăn chặn khởi tạo đối tượng hằng số
  }
}
```

### 3.2. Request DTO Có Schema & Example Đầy Đủ
```java
package com.enterprise.app.request;

import com.enterprise.app.common.constant.OpenApiConstant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Yêu cầu tạo mới tài khoản người dùng")
public class UserCreateRequest {

  @NotBlank
  @Email
  @Schema(
      description = OpenApiConstant.SCHEMA_USER_EMAIL_DESC,
      example = OpenApiConstant.SCHEMA_USER_EMAIL_EXAMPLE,
      requiredMode = Schema.RequiredMode.REQUIRED
  )
  private String email;
}
```

### 3.3. Controller Có Swagger & Endpoint Bị `@Hidden`
```java
package com.enterprise.app.controller;

import com.enterprise.app.common.constant.OpenApiConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.request.UserCreateRequest;
import com.enterprise.app.response.UserResponse;
import com.enterprise.app.service.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse as SwaggerApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = OpenApiConstant.TAG_USERS_NAME, description = OpenApiConstant.TAG_USERS_DESC)
public class UserController {

  private final UserService userService;

  @PostMapping
  @Operation(summary = OpenApiConstant.OP_CREATE_USER_SUMMARY, description = OpenApiConstant.OP_CREATE_USER_DESC)
  @ApiResponses({
      @SwaggerApiResponse(responseCode = "201", description = OpenApiConstant.RESP_201_DESC),
      @SwaggerApiResponse(responseCode = "400", description = OpenApiConstant.RESP_400_DESC)
  })
  public ResponseEntity<ApiResponse<UserResponse>> createUser(
      @Valid @RequestBody final UserCreateRequest request) {
    final UserResponse response = userService.createUser(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response));
  }

  @Hidden
  @GetMapping("/internal/metrics")
  public ResponseEntity<ApiResponse<Void>> getInternalMetrics() {
    // Endpoint kỹ thuật nội bộ, ẩn hoàn toàn khỏi Swagger UI
    return ResponseEntity.ok(ApiResponse.success(null));
  }
}
```
