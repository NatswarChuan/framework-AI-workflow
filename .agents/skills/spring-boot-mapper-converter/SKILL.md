---
name: spring-boot-mapper-converter
description: >-
  Kích hoạt kỹ năng này khi thiết kế hoặc cấu hình tầng Ánh Xạ Dữ Liệu (Mapper & Converter Layer),
  chuyển đổi giữa Request, DTO, Model, Entity và Response bắt buộc dùng các hàm toXXX và fromXXX
  kết hợp với Builder Pattern (.builder()...build()), chống lỗi NPE và đảm bảo 100% Type-Safety.
---

# Kỹ Năng: Ánh Xạ Dữ Liệu Bằng Hàm `toXXX` / `fromXXX` Dùng Builder Pattern

Kỹ năng này hướng dẫn quy chuẩn chuyển đổi dữ liệu hai chiều giữa các tầng kiến trúc (`Request` <-> `DTO` <-> `Model` <-> `Entity` <-> `Response`), bắt buộc triển khai qua các phương thức **`toXXX`** và **`fromXXX`** sử dụng **Builder Pattern** của Lombok.

---

## 1. NGUYÊN TẮC BẮT BUỘC TRONG CHUYỂN ĐỔI DỮ LIỆU

1. **Bắt buộc có cặp phương thức `toXXX` và `fromXXX`**:
   - `toEntity()` / `fromEntity(entity)`
   - `toDto()` / `fromDto(dto)`
   - `toResponse()` / `fromEntity(entity)`
2. **100% sử dụng Builder Pattern**:
   - Mọi phép gán và tạo đối tượng mới đều phải thực hiện thông qua `.builder()...build()`.
   - Tuyệt đối không dùng các chuỗi setter thủ công rời rạc (`entity.setName(...)`, `entity.setEmail(...)`).
   - Tuyệt đối không dùng reflection thiếu an toàn kiểu (`BeanUtils.copyProperties`).
3. **Phòng chống NPE tuyệt đối**:
   - Phương thức `fromXXX` nhận đối tượng nguồn phải kiểm tra `Objects.isNull(source)` ngay tại dòng đầu tiên và trả về `null` (Flat Guard Clause).
4. **Không dùng `nested if` và không dùng toán tử 3 ngôi**:
   - Mọi phép xử lý gán có điều kiện đều phải tách bạch thành các lệnh `if` độc lập.

---

## 2. CODE MẪU CHUẨN MỰC

### 2.1. Request DTO Có Hàm `toEntity` Dùng Builder (`UserCreateRequest.java`)
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
 * Yêu cầu tạo mới người dùng từ phía Client.
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
   * Chuyển đổi yêu cầu sang đối tượng thực thể cơ sở dữ liệu.
   *
   * @return {@link UserEntity} thực thể người dùng được tạo qua Builder
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

### 2.2. Response DTO Có Hàm `fromEntity` Dùng Builder (`UserResponse.java`)
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
 * Đối tượng phản hồi thông tin chi tiết người dùng.
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
   * Khởi tạo đối tượng phản hồi từ thực thể cơ sở dữ liệu sử dụng Builder Pattern.
   *
   * @param entity thực thể người dùng nguồn
   * @return {@link UserResponse} dữ liệu phản hồi đã ánh xạ hoặc null nếu entity là null
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

### 2.3. Lớp Mapper Chuyên Biệt Có Đầy Đủ `toXXX` và `fromXXX` (`UserMapper.java`)
```java
package com.enterprise.app.mapper;

import com.enterprise.app.entity.UserEntity;
import com.enterprise.app.request.UserCreateRequest;
import com.enterprise.app.response.UserResponse;
import java.util.Objects;
import org.springframework.stereotype.Component;

/**
 * Thành phần ánh xạ dữ liệu chuyên biệt giữa các tầng.
 *
 * <p>Triển khai đầy đủ cặp phương thức toXXX và fromXXX sử dụng 100% Builder Pattern.
 */
@Component
public class UserMapper {

  /**
   * Chuyển đổi từ Request sang Entity.
   *
   * @param request dữ liệu yêu cầu
   * @return {@link UserEntity} được dựng qua Builder
   */
  public UserEntity toEntity(final UserCreateRequest request) {
    if (Objects.isNull(request)) {
      return null;
    }

    return UserEntity.builder()
        .username(request.getUsername())
        .email(request.getEmail())
        .fullName(request.getFullName())
        .build();
  }

  /**
   * Chuyển đổi từ Entity sang Response (toResponse).
   *
   * @param entity thực thể nguồn
   * @return {@link UserResponse} được dựng qua Builder
   */
  public UserResponse toResponse(final UserEntity entity) {
    return fromEntity(entity);
  }

  /**
   * Chuyển đổi từ Entity sang Response (fromEntity).
   *
   * @param entity thực thể nguồn
   * @return {@link UserResponse} được dựng qua Builder
   */
  public UserResponse fromEntity(final UserEntity entity) {
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
