---
name: spring-boot-service-layer
description: >-
  Kích hoạt kỹ năng này khi thiết kế hoặc triển khai tầng Nghiệp vụ (Business Logic),
  Service Interface, Service Implementation, quản lý giao dịch (@Transactional),
  áp dụng Dependency Inversion (DI) và kiến trúc SOLID trong Java Spring Boot.
---

# Kỹ Năng: Triển Khai Tầng Nghiệp Vụ (Service Layer)

Kỹ năng này hướng dẫn thiết kế và viết code cho Service Layer theo đúng nguyên lý SOLID, bắt buộc phân tách Interface - Implementation, bảo vệ dữ liệu bằng giao dịch `@Transactional(rollbackFor = Exception.class)`, ghi log bắt đầu/kết thúc hàm và triệt tiêu lỗi NPE.

---

## 1. NGUYÊN TẮC BẮT BUỘC TRONG SERVICE LAYER

1. **Bắt buộc phân tách Interface & Implementation**:
   - Giao diện (Interface): Định nghĩa hợp đồng nghiệp vụ, có thể dùng phương thức `default` cho các logic dùng chung thay vì `abstract class`.
   - Lớp thực thi (`*ServiceImpl`): Chứa logic nghiệp vụ, đánh dấu `@Service` và `@Transactional(readOnly = true)`.
2. **Bảo vệ toàn vẹn dữ liệu qua Transaction**:
   - Các phương thức thay đổi dữ liệu (Create, Update, Delete) bắt buộc đánh dấu:
     `@Transactional(rollbackFor = Exception.class)`.
3. **Ghi log bắt đầu và kết thúc đầy đủ (Entry & Exit Logging)**:
   - Dòng đầu tiên: `log.info("Starting methodName with param: {}", param);`
   - Dòng cuối trước khi return: `log.info("Finished methodName successfully with resultId: {}", resultId);`
4. **Dependency Injection chuẩn mực**:
   - Sử dụng Constructor Injection (`@RequiredArgsConstructor` trên các biến `private final`).
   - Luôn tiêm Interface thay vì lớp thực thi cụ thể.
5. **Tuân thủ quy tắc cú pháp nghiêm ngặt**:
   - **Tuyệt đối CẤM `abstract class`**: Dùng `interface` kết hợp phương thức `default`.
   - **Tuyệt đối CẤM private function**: 100% phương thức là `public`.
   - **Tuyệt đối CẤM `UUID.randomUUID()`**: Luôn dùng UUIDv7 (`UuidUtil.generateUuidV7()`).
   - Tuyệt đối không dùng toán tử 3 ngôi (`? :`).
   - Chỉ được phép tối đa 1 điều kiện trong 1 câu lệnh `if`. Không dùng `nested if`.
   - Dùng thư viện `Objects` kiểm tra null (`Objects.isNull()`, `Objects.nonNull()`).
   - Hằng số lấy từ file `*Constant`.
6. **Chỉ triển khai phương thức `@Override` từ Service Interface (Interface-Only Service Methods)**:
   - Trong `*ServiceImpl`, 100% phương thức khai báo BẮT BUỘC phải là phương thức được đánh dấu `@Override` từ Service Interface.
   - **TUYỆT ĐỐI CẤM** khai báo thêm bất kỳ phương thức phụ trợ nào (kể cả phương thức `public`) bên trong lớp ServiceImpl.
   - Toàn bộ logic phân rã, tra cứu phụ trợ, kiểm tra nghiệp vụ con, validation phân nhánh hoặc mapping trung gian **BẮT BUỘC DI CHUYỂN SANG CÁC LỚP `Helper`** (`@Component`, `final class`) và tiêm qua DI constructor.
7. **Ưu tiên tuyệt đối Builder Pattern thay vì Setter (Builder Over Setter Principle)**:
   - Khi tạo mới đối tượng: Dùng `.builder()...build()`.
   - Khi cập nhật hoặc chỉnh sửa đối tượng hiện có: Dùng `toBuilder()` (`@Builder(toBuilder = true)`).
   - **TUYỆT ĐỐI CẤM** gọi chuỗi hàm setter rời rạc `obj.setA(...); obj.setB(...);` trong Service Layer.
8. **Triệt tiêu 100% Magic Strings, Magic Numbers & Hard-Code (Zero Hard-Code Policy)**:
   - CẤM hard-code: tiền tố role (`PREFIX_ROLE_*`), token type (`TOKEN_TYPE_BEARER`), trạng thái (`STATUS_ACTIVE`, `STATUS_GRANTED`), default UUID (`DEFAULT_SYSTEM_UUID`), TTL seconds (`DEFAULT_TTL_SECONDS`), loyalty points (`DEFAULT_LOYALTY_POINTS`), lý do audit (`REASON_*`), regex patterns.
   - 100% giá trị chuỗi và số bắt buộc phải được khai báo thành hằng số trong các file `*Constant` tương ứng kèm Javadoc đầy đủ.

---

## 2. CODE MẪU CHUẨN MỰC

### 2.1. Service Interface (`UserService.java`)
```java
package com.enterprise.app.service;

import com.enterprise.app.exception.ResourceNotFoundException;
import com.enterprise.app.exception.ConflictException;
import com.enterprise.app.request.UserCreateRequest;
import com.enterprise.app.response.UserResponse;
import java.util.UUID;

/**
 * Giao diện định nghĩa các nghiệp vụ quản lý người dùng.
 *
 * <p>Tuân thủ nguyên tắc Dependency Inversion (D trong SOLID).
 * Có thể sử dụng default methods để tái sử dụng logic chung thay cho abstract class.
 */
public interface UserService {

  /**
   * Tạo mới một tài khoản người dùng vào hệ thống.
   *
   * @param request dữ liệu yêu cầu tạo mới người dùng không được null
   * @return {@link UserResponse} thông tin người dùng vừa được tạo
   * @throws ConflictException nếu username hoặc email đã tồn tại
   */
  UserResponse createUser(UserCreateRequest request);

  /**
   * Truy vấn thông tin người dùng theo mã định danh UUIDv7 duy nhất.
   *
   * @param id mã định danh UUIDv7 của người dùng không được null
   * @return {@link UserResponse} thông tin chi tiết của người dùng
   * @throws ResourceNotFoundException nếu không tìm thấy người dùng với mã định danh cung cấp
   */
  UserResponse getUserById(UUID id);
}
```

### 2.2. Service Implementation (`UserServiceImpl.java`)
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.UserConstant;
import com.enterprise.app.common.constant.UserLogConstant;
import com.enterprise.app.common.constant.UserStatusConstant;
import com.enterprise.app.entity.UserEntity;
import com.enterprise.app.exception.ConflictException;
import com.enterprise.app.exception.ResourceNotFoundException;
import com.enterprise.app.mapper.UserMapper;
import com.enterprise.app.repository.UserRepository;
import com.enterprise.app.request.UserCreateRequest;
import com.enterprise.app.response.UserResponse;
import com.enterprise.app.service.UserService;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Lớp thực thi các nghiệp vụ của {@link UserService}.
 *
 * <p>Áp dụng chặt chẽ các quy chuẩn:
 * <ul>
 *   <li>Bảo vệ Transaction với rollbackFor = Exception.class.</li>
 *   <li>Log đầy đủ bắt đầu và kết thúc function bằng hằng số (Zero magic string).</li>
 *   <li>100% public method, không có private function.</li>
 *   <li>Không dùng toán tử 3 ngôi, không nested if, tối đa 1 điều kiện trong 1 if.</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;
  private final UserMapper userMapper;

  /**
   * {@inheritDoc}
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public UserResponse createUser(final UserCreateRequest request) {
    Objects.requireNonNull(request, UserConstant.MSG_REQUEST_NOT_NULL);

    // 1. Ghi log bắt đầu function bằng hằng số
    log.info(UserLogConstant.START_CREATE_USER, request.getUsername(), request.getEmail());

    // 2. Flat guard clause: Kiểm tra trùng username
    final boolean usernameExists = userRepository.existsByUsername(request.getUsername());
    if (usernameExists) {
      log.warn(UserLogConstant.WARN_USERNAME_EXISTS, request.getUsername());
      throw new ConflictException(ErrorConstant.ERR_USER_ALREADY_EXISTS);
    }

    // 3. Flat guard clause: Kiểm tra trùng email
    final boolean emailExists = userRepository.existsByEmail(request.getEmail());
    if (emailExists) {
      log.warn(UserLogConstant.WARN_EMAIL_EXISTS, request.getEmail());
      throw new ConflictException(ErrorConstant.ERR_EMAIL_ALREADY_EXISTS);
    }

    final UserEntity userEntity = userMapper.toEntity(request);
    userEntity.setStatus(UserStatusConstant.ACTIVE);

    final UserEntity savedEntity = userRepository.save(userEntity);
    final UserResponse response = userMapper.toResponse(savedEntity);

    // 4. Ghi log kết thúc function bằng hằng số
    log.info(UserLogConstant.FINISH_CREATE_USER, response.getId());
    return response;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public UserResponse getUserById(final UUID id) {
    Objects.requireNonNull(id, UserConstant.MSG_USER_ID_NOT_NULL);

    // 1. Ghi log bắt đầu function bằng hằng số
    log.info(UserLogConstant.START_GET_USER_BY_ID, id);

    final UserEntity userEntity = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(ErrorConstant.ERR_USER_NOT_FOUND));

    final UserResponse response = userMapper.toResponse(userEntity);

    // 2. Ghi log kết thúc function bằng hằng số
    log.info(UserLogConstant.FINISH_GET_USER_BY_ID, response.getUsername());
    return response;
  }
}
```
