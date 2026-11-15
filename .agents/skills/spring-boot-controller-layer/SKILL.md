---
name: spring-boot-controller-layer
description: >-
  Kích hoạt kỹ năng này khi phát triển, thiết kế hoặc tái cấu trúc tầng API Controller,
  với vai trò DUY NHẤT là ĐIỀU PHỐI VIÊN (Coordinator/Dispatcher), tiếp nhận HTTP Request,
  kích hoạt Validation (@Valid), ủy quyền cho Service Interface, chuẩn hóa Response và
  tài liệu hóa Swagger/OpenAPI 3.0 đầy đủ (ẩn các endpoint không dùng qua @Hidden).
---

# Kỹ Năng: Phát Triển Tầng Controller - Thuần Túy Điều Phối Viên (Coordinator Layer)

Kỹ năng này hướng dẫn quy trình từng bước xây dựng REST Controller theo đúng chuẩn **Single Responsibility Principle (SRP)**: Controller đóng vai trò duy nhất là **Điều Phối Viên (Coordinator / Dispatcher)**, hoàn toàn không chứa mã nghiệp vụ và tách biệt tuyệt đối với các tầng khác.

---

## 1. NGUYÊN TẮC: CONTROLLER LÀ ĐIỀU PHỐI VIÊN THUẦN TÚY

### 1.1. Năm (5) Trách Nhiệm Duy Nhất Của Controller:
1. **Tiếp nhận HTTP Request**: Khai báo mapping endpoint (`@GetMapping`, `@PostMapping`,...), nhận Path Variables, Query Params, Headers, Request Body.
2. **Kích hoạt Validation đầu vào**: Gắn annotation `@Valid` trước `@RequestBody` để Spring Validation tự động kiểm tra tính hợp lệ của DTO.
3. **Ủy quyền cho Service Interface**: Chuyển giao toàn quyền thực thi cho phương thức tương ứng của Service Interface (Single Delegation).
4. **Đóng gói và Trả về HTTP Response**: Nhận dữ liệu kết quả từ Service, bọc vào đối tượng chuẩn hóa `ApiResponse<T>` và trả về qua `ResponseEntity` với mã `HttpStatus` chuẩn (`HttpStatus.OK`, `HttpStatus.CREATED`, v.v.).
5. **Tài liệu hóa Swagger / OpenAPI 3.0 toàn diện**: Khai báo `@Tag`, `@Operation`, `@ApiResponses`, `@Parameter` (triệt tiêu magic string qua `OpenApiConstant`); đồng thời đánh dấu `@Hidden` đối với các endpoint nội bộ / kỹ thuật không thể thao tác trên Swagger UI.

### 1.2. Những Điều CẤM TUYỆT ĐỐI Trong Controller:
- ❌ **CẤM** viết logic nghiệp vụ, tính toán tiền tệ, xử lý dữ liệu phức tạp.
- ❌ **CẤM** sử dụng câu lệnh điều kiện rẽ nhánh nghiệp vụ (`if/else`) trong Controller.
- ❌ **CẤM** tiêm (`@Autowired` / Constructor) trực tiếp **Repository** hoặc thao tác với **Entity**.
- ❌ **CẤM** gọi trực tiếp các Helper phụ trợ hoặc tự ghi đè database.

---

## 2. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC

### Bước 1: Khởi động & Xác nhận Tuân thủ Rule & Style
Trước khi viết mã, kiểm tra các điều kiện tiên quyết:
- Controller chỉ làm nhiệm vụ điều phối (Dispatching).
- Không dùng toán tử 3 ngôi (`? :`).
- **Không dùng nested if (if lồng nhau)**, chỉ dùng flat guard clauses.
- Không dùng `== null` hoặc `!= null`, dùng `Objects.isNull()` / `Objects.nonNull()`.
- Không dùng `Object` hoặc `Map<String, Object>`, luôn dùng strongly-typed DTO.
- Không khai báo `static final` hằng số trong Controller.

### Bước 2: Xây dựng Request DTO có hàm `toEntity()` / `toDto()` dùng Builder & OpenAPI Schema
- Đặt trong package `com.enterprise.app.dto.request` (hoặc `com.enterprise.app.request`).
- Sử dụng các annotation của Jakarta Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`).
- Đánh dấu các trường dữ liệu bằng `private`. Sử dụng Lombok `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`.
- Khai báo `@Schema` cho từng field (mô tả ý nghĩa, giá trị mẫu thực tế `example`, `requiredMode`) lấy từ `OpenApiConstant`.
- Khai báo phương thức `toEntity()` sử dụng Builder Pattern (`.builder()...build()`).

### Bước 3: Xây dựng Response DTO có hàm `fromEntity()` dùng Builder & OpenAPI Schema
- Đặt trong package `com.enterprise.app.dto.response` (hoặc `com.enterprise.app.response`).
- Khai báo `@Schema` cho từng field (mô tả, format, realistic example).
- Khai báo phương thức tĩnh `fromEntity(entity)` sử dụng Builder Pattern để ánh xạ dữ liệu đầu ra an toàn trước null.
- Bao bọc toàn bộ phản hồi bằng `ApiResponse<T>` chuẩn hóa (gồm: `code`, `message`, `data`, `timestamp`).

### Bước 4: Viết Controller Chỉ Điều Phối & Tài Liệu Hóa Swagger
- Đặt trong package `com.enterprise.app.controller`.
- Đánh dấu `@RestController`, `@RequestMapping` và `@Tag` nhóm API.
- Tiêm Service qua Constructor Injection bằng `@RequiredArgsConstructor` với field `private final UserService userService;` (luôn tiêm qua Interface).
- Đánh dấu `@Valid` trước các tham số `@RequestBody`.
- Khai báo `@Operation` và `@ApiResponses` cho từng method (200, 201, 400, 404, 500).
- Đánh dấu `@Hidden` đối với các endpoint nội bộ, endpoint chỉ phục vụ callbacks hoặc streaming dữ liệu không chạy trực tiếp được qua Swagger UI.
- Viết Javadoc chuẩn Google Style cho từng Endpoint.

---

## 3. CODE MẪU CHUẨN MỰC

### 3.1. Request DTO (`UserCreateRequest.java`)
```java
package com.enterprise.app.request;

import com.enterprise.app.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Đối tượng tiếp nhận dữ liệu yêu cầu tạo mới người dùng từ Client.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {

  @NotBlank(message = "Username must not be blank")
  @Size(min = 4, max = 50, message = "Username must be between 4 and 50 characters")
  private String username;

  @NotBlank(message = "Email must not be blank")
  @Email(message = "Email must be valid")
  private String email;

  @NotBlank(message = "Full name must not be blank")
  private String fullName;

  /**
   * Chuyển đổi yêu cầu sang đối tượng thực thể bằng Builder Pattern.
   *
   * @return {@link UserEntity} thực thể người dùng
   */
  public UserEntity toEntity() {
    return UserEntity.builder()
        .username(this.username)
        .email(this.email)
        .fullName(this.fullName)
        .build();
  }
}
```

### 3.2. Response DTO (`UserResponse.java`)
```java
package com.enterprise.app.response;

import com.enterprise.app.entity.UserEntity;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Đối tượng phản hồi thông tin chi tiết người dùng cho client.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

  private Long id;
  private String username;
  private String email;
  private String fullName;
  private String status;

  /**
   * Khởi tạo đối tượng phản hồi từ thực thể bằng Builder Pattern.
   *
   * @param entity thực thể nguồn
   * @return {@link UserResponse} dữ liệu phản hồi
   */
  public static UserResponse fromEntity(final UserEntity entity) {
    if (Objects.isNull(entity)) {
      return null;
    }

    return UserResponse.builder()
        .id(entity.getId())
        .username(entity.getUsername())
        .email(entity.getEmail())
        .fullName(entity.getFullName())
        .status(entity.getStatus())
        .build();
  }
}
```

### 3.3. Controller Thuần Túy Điều Phối Viên (`UserController.java`)
```java
package com.enterprise.app.controller;

import com.enterprise.app.common.constant.ApiEndpointConstant;
import com.enterprise.app.common.constant.OpenApiConstant;
import com.enterprise.app.common.constant.UserConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.enterprise.app.request.UserCreateRequest;
import com.enterprise.app.response.UserResponse;
import com.enterprise.app.service.UserService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse as SwaggerApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller đóng vai trò là Điều Phối Viên (Coordinator / Dispatcher)
 * cho các yêu cầu liên quan đến người dùng, tài liệu hóa OpenAPI 3.0 toàn diện.
 */
@RestController
@RequestMapping(ApiEndpointConstant.USERS_BASE)
@RequiredArgsConstructor
@Tag(name = OpenApiConstant.TAG_USERS_NAME, description = OpenApiConstant.TAG_USERS_DESC)
public class UserController {

  private final UserService userService;

  /**
   * Tiếp nhận yêu cầu tạo mới người dùng và điều phối sang {@link UserService}.
   *
   * @param request dữ liệu yêu cầu tạo người dùng đã qua kiểm tra hợp lệ
   * @return {@link ResponseEntity} mang mã HTTP 201 Created và dữ liệu người dùng mới tạo
   */
  @PostMapping
  @Operation(summary = OpenApiConstant.OP_CREATE_USER_SUMMARY, description = OpenApiConstant.OP_CREATE_USER_DESC)
  @ApiResponses({
      @SwaggerApiResponse(responseCode = "201", description = OpenApiConstant.RESP_201_DESC),
      @SwaggerApiResponse(responseCode = "400", description = OpenApiConstant.RESP_400_DESC)
  })
  public ResponseEntity<ApiResponse<UserResponse>> createUser(
      @Valid @RequestBody final UserCreateRequest request) {
    Objects.requireNonNull(request, UserConstant.MSG_REQUEST_NOT_NULL);

    final UserResponse response = userService.createUser(request);
    final ApiResponse<UserResponse> apiResponse = ApiResponse.success(response);
    return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
  }

  /**
   * Tiếp nhận yêu cầu lấy thông tin người dùng theo ID và điều phối sang {@link UserService}.
   *
   * @param id mã định danh người dùng
   * @return {@link ResponseEntity} mang mã HTTP 200 OK và dữ liệu người dùng
   */
  @GetMapping(ApiEndpointConstant.PATH_VARIABLE_ID)
  @Operation(summary = OpenApiConstant.OP_GET_USER_SUMMARY, description = OpenApiConstant.OP_GET_USER_DESC)
  @ApiResponses({
      @SwaggerApiResponse(responseCode = "200", description = OpenApiConstant.RESP_200_DESC),
      @SwaggerApiResponse(responseCode = "404", description = OpenApiConstant.RESP_404_DESC)
  })
  public ResponseEntity<ApiResponse<UserResponse>> getUserById(
      @Parameter(description = OpenApiConstant.PARAM_USER_ID_DESC, example = OpenApiConstant.PARAM_USER_ID_EXAMPLE, required = true)
      @PathVariable(UserConstant.PARAM_ID) final Long id) {
    Objects.requireNonNull(id, UserConstant.MSG_USER_ID_NOT_NULL);

    final UserResponse response = userService.getUserById(id);
    final ApiResponse<UserResponse> apiResponse = ApiResponse.success(response);
    return ResponseEntity.ok(apiResponse);
  }

  /**
   * Endpoint kỹ thuật nội bộ, ẩn hoàn toàn khỏi Swagger UI vì không thao tác trực tiếp từ client.
   */
  @Hidden
  @GetMapping("/internal/cache-evict")
  public ResponseEntity<ApiResponse<Void>> evictInternalUserCache() {
    userService.evictUserCache();
    return ResponseEntity.ok(ApiResponse.success(null));
  }
}
```
