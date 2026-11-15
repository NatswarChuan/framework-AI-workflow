# Rule 14: 100% Custom Exception Nghiệp Vụ & Mã Lỗi Chuẩn Hóa

Quy chuẩn này quy định bắt buộc về việc mô hình hóa ngoại lệ nghiệp vụ: **Tuyệt đối KHÔNG sử dụng các Exception class có sẵn của Java hoặc Spring trong luồng nghiệp vụ**, 100% ngoại lệ phải là **Custom Business Exception** kế thừa `BaseBusinessException`, mang mã lỗi `errorCode` từ `ErrorConstant` và gắn liền với mã **HTTP Status Code** chuẩn.

---

## 1. TẠI SAO TUYỆT ĐỐI CẤM SỬ DỤNG EXCEPTION CÓ SẴN?

Trong hệ thống phần mềm doanh nghiệp, ném exception có sẵn của JDK (`IllegalArgumentException`, `NoSuchElementException`, `IllegalStateException`, `RuntimeException`, `NullPointerException`) hoặc Spring (`ResponseStatusException`) bị nghiêm cấm vì 6 lý do trọng yếu:

1. **Mất Ngữ Cảnh Nghiệp Vụ (Domain Context)**: `IllegalArgumentException("Invalid id")` không chỉ ra ID của thực thể nào (UserId, OrderId), vi phạm quy tắc gì. Custom Exception như `UserNotFoundException(userId)` chứa đầy đủ thông tin truy vết.
2. **Sai Lệch HTTP Status Code**: Spring Boot mặc định bẫy exception có sẵn thành **HTTP 500 Internal Server Error**, gây báo động giả cho DevOps/SRE, trong khi thực tế dữ liệu sai phải là **400 Bad Request**, thiếu tài nguyên là **404 Not Found**, trùng lặp là **409 Conflict**.
3. **Nguy Cơ Rò Rỉ Thông Tin (OWASP)**: Exception có sẵn có thể để lộ câu lệnh SQL, tên bảng, stack trace nội bộ ra client.
4. **Triệt Tiêu Khả Năng Đa Ngôn Ngữ (i18n)**: Không thể dịch các chuỗi hardcoded trong exception có sẵn theo Locale người dùng. Custom Exception liên kết với `errorCode` trong `messages.properties` giúp dịch 100%.
5. **Phá Vỡ Đo Lường & Giám Sát (APM Metrics)**: Prometheus, Grafana, Datadog không thể gom nhóm cảnh báo chính xác nếu toàn bộ lỗi đều là `RuntimeException`.
6. **Không Thể Viết Handler Bẫy Lỗi Rõ Ràng**: Bắt `IllegalArgumentException` trong `@RestControllerAdvice` sẽ vô tình bắt cả các lỗi từ thư viện bên thứ 3.

---

## 2. BẢNG TRA CỨU ĐỐI CHIẾU: THAY THẾ EXCEPTION CÓ SẴN

| Exception Có Sẵn (**CẤM**) | Custom Exception Nghiệp Vụ Thay Thế (**BẮT BUỘC**) | HTTP Status Code |
| :--- | :--- | :--- |
| `IllegalArgumentException` | `InvalidParameterException` / `BadRequestException` | `HttpStatus.BAD_REQUEST` (400) |
| `NoSuchElementException` | `ResourceNotFoundException` / `UserNotFoundException` | `HttpStatus.NOT_FOUND` (404) |
| `IllegalStateException` | `InvalidStateTransitionException` / `BusinessRuleViolationException` | `HttpStatus.BAD_REQUEST` (400) |
| `SecurityException` | `ForbiddenActionException` / `UnauthorizedRoleException` | `HttpStatus.FORBIDDEN` (403) |
| `AuthenticationException` | `InvalidTokenException` / `TokenExpiredException` | `HttpStatus.UNAUTHORIZED` (401) |
| `DuplicateKeyException` | `ConflictException` / `DuplicateResourceException` | `HttpStatus.CONFLICT` (409) |
| `NullPointerException` (nghiệp vụ) | Flat Guard Clause và ném Custom Exception cụ thể | `HttpStatus.BAD_REQUEST` (400) |
| `ResponseStatusException` | Custom Business Exception chuyên biệt | Ánh xạ trực tiếp theo `HttpStatus` |
| `RuntimeException` (thô) | `BusinessException` / `InternalBusinessException` | `HttpStatus.INTERNAL_SERVER_ERROR` (500) |

---

## 3. LỚP NGOẠI LỆ GỐC: `BaseBusinessException.java`

- Là class thông thường (concrete class), **tuyệt đối KHÔNG dùng từ khóa `abstract`**.
- Mang theo `httpStatus`, `errorCode` và danh sách tham số `messageArgs` (dạng `List<String>`) phục vụ đa ngôn ngữ i18n.

```java
package com.enterprise.app.exception;

import java.util.Collections;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Lớp ngoại lệ cơ sở cho toàn bộ ngoại lệ nghiệp vụ trong ứng dụng.
 */
@Getter
public class BaseBusinessException extends RuntimeException {

  private final HttpStatus httpStatus;
  private final String errorCode;
  private final List<String> messageArgs;

  public BaseBusinessException(
      final HttpStatus httpStatus,
      final String errorCode,
      final String message) {
    super(message);
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.messageArgs = Collections.emptyList();
  }

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

## 4. TRIỂN KHAI CUSTOM EXCEPTION MIỀN NGHIỆP VỤ

### 4.1. Ngoại Lệ Không Tìm Thấy Người Dùng (`UserNotFoundException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi không tìm thấy tài khoản người dùng (HTTP 404).
 */
@Getter
public class UserNotFoundException extends BaseBusinessException {

  private final String identifier;

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

### 4.2. Ngoại Lệ Trùng Lặp Email (`DuplicateEmailException.java`)
```java
package com.enterprise.app.exception;

import com.enterprise.app.common.constant.ErrorConstant;
import java.util.List;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Ngoại lệ ném ra khi địa chỉ email đã tồn tại (HTTP 409 Conflict).
 */
@Getter
public class DuplicateEmailException extends BaseBusinessException {

  private final String email;

  public DuplicateEmailException(final String email) {
    super(
        HttpStatus.CONFLICT,
        ErrorConstant.ERR_EMAIL_ALREADY_EXISTS,
        "Email address is already in use: " + email,
        List.of(email)
    );
    this.email = email;
  }
}
```

---

## 5. SỬ DỤNG TRONG SERVICE KẾT HỢP FLAT GUARD CLAUSES

```java
@Override
@Transactional(rollbackFor = Exception.class)
public UserResponse updateUserProfile(final String userId, final UserUpdateRequest request) {
  log.info(UserLogConstant.START_UPDATE_USER, userId);

  // Guard Clause 1: Kiểm tra null bằng Objects
  if (Objects.isNull(userId)) {
    throw new InvalidParameterException(UserConstant.MSG_USER_ID_NOT_NULL);
  }

  // Guard Clause 2: Truy vấn Entity, ném Custom Exception nếu vắng mặt
  final UserEntity userEntity = userRepository.findById(userId)
      .orElseThrow(() -> new UserNotFoundException(userId));

  // Guard Clause 3: Kiểm tra trạng thái tài khoản
  if (!userEntity.isActive()) {
    throw new UserAccountLockedException(userId);
  }

  // Guard Clause 4: Kiểm tra trùng email (tối đa 1 điều kiện trong if)
  final boolean emailExists = userRepository.existsByEmailAndIdNot(request.getEmail(), userId);
  if (emailExists) {
    throw new DuplicateEmailException(request.getEmail());
  }

  userEntity.setFullName(request.getFullName());
  final UserEntity updatedEntity = userRepository.save(userEntity);
  final UserResponse response = UserResponse.fromEntity(updatedEntity);

  log.info(UserLogConstant.FINISH_UPDATE_USER, userId);
  return response;
}
```
