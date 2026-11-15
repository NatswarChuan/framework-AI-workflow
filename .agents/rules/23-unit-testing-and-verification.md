# Rule 23: Quy Chuẩn Kiểm Thử Đơn Vị (Unit Testing) & Test/Fix Đến Khi Pass

Quy chuẩn này xác lập nguyên tắc kiểm thử bắt buộc: **Mỗi phương thức (function/method) được viết ra trong hệ thống đều phải có Unit Test tương ứng và bắt buộc phải chạy kiểm thử, sửa lỗi (test/fix) cho đến khi 100% các ca kiểm thử vượt qua (Pass hoàn toàn)**.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Bắt Buộc 100% Hàm Phải Có Unit Test Tương Ứng**:
   - Bất kỳ class nào (Service, Controller, Helper, Util, Mapper, Validator, Exception Handler) khi viết mới hoặc sửa đổi hàm đều phải tạo/cập nhật Unit Test tương ứng trong `src/test/java`.
   - Cấm bàn giao bất kỳ hàm nghiệp vụ nào mà không có bài kiểm thử đi kèm.
2. **Quy Trình Test/Fix Đến Khi Pass Hoàn Toàn (Zero-Failure Verification)**:
   - Sau khi viết code và test: Chạy kiểm thử để xác thực hành vi.
   - Nếu xảy ra lỗi (AssertionError, Exception ngoài dự kiến): Phân tích nguyên nhân gốc, sửa mã nguồn hoặc dữ liệu kiểm thử, chạy lại cho đến khi pass.
   - **TUYỆT ĐỐI CẤM** dùng `@Disabled` hoặc `@Ignore` để né tránh lỗi kiểm thử.
3. **Bao Phủ Đầy Đủ Các Kịch Bản (Comprehensive Coverage)**:
   - **Happy Path**: Dữ liệu hợp lệ, trả về kết quả mong đợi với đúng kiểu dữ liệu.
   - **Negative Path**: Dữ liệu không hợp lệ, kích hoạt Guard Clauses và ném đúng Custom Exception kế thừa `BaseBusinessException` với đúng `HttpStatus` và `errorCode`.
   - **Boundary & Edge Cases**: Giá trị rỗng, giá trị biên, đối tượng vắng mặt (`Optional.empty()`).
4. **Bộ Công Cụ Kiểm Thử Chuẩn Mực**:
   - **JUnit 5 (Jupiter)**: `@Test`, `@DisplayName`, `@ParameterizedTest`.
   - **Mockito**: `@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`, `given(...)`, `willReturn(...)`, `verify(...)`.
   - **AssertJ**: `assertThat(...)` tăng tính biểu đạt và an toàn kiểu dữ liệu.
5. **Tuân Thủ Ràng Buộc Kiến Trúc & Cú Pháp**:
   - 100% phương thức kiểm thử là `public void`.
   - Triệt tiêu Magic String & Magic Number trong test (sử dụng hằng số từ Constant hoặc Test Constant).
   - Không dùng `== null` hoặc `!= null` (dùng AssertJ `isNotNull()`, `isNull()`).

---

## 2. CẤU TRÚC ĐẶT TÊN & TỔ CHỨC KIỂM THỬ

- **Vị Trí**: Đặt trong thư mục `src/test/java` với cấu trúc package đối xứng 1-1 với lớp được kiểm thử.
- **Tên Lớp Test**: `{TargetClassName}Test.java` (ví dụ: `UserServiceImplTest.java`, `StringUtilTest.java`).
- **Tên Phương Thức Test**: `tenHam_DieuKienDauVao_KetQuaMongDoi` (ví dụ: `getUserById_ValidId_ReturnsUserResponse`, `getUserById_UserNotFound_ThrowsUserNotFoundException`).
- **Đánh Dấu `@DisplayName`**: Mô tả rõ ràng mục tiêu kiểm thử bằng tiếng Việt/tiếng Anh có ngữ cảnh.

---

## 3. MẪU TRIỂN KHAI KIỂM THỬ CHUẨN CHO TẦNG SERVICE

```java
package com.enterprise.app.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.enterprise.app.common.constant.CommonConstant;
import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.dto.UserResponse;
import com.enterprise.app.entity.UserEntity;
import com.enterprise.app.exception.InvalidParameterException;
import com.enterprise.app.exception.UserNotFoundException;
import com.enterprise.app.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

/**
 * Kiểm thử đơn vị cho {@link UserServiceImpl}.
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

  private static final String MOCK_USER_ID = "018f4a1c-7b2a-7d1e-8e3b-9a4f6c8d2e1a";
  private static final String MOCK_USERNAME = "john_doe";

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserServiceImpl userService;

  @Test
  @DisplayName("getUserById: Trả về UserResponse khi UserId hợp lệ và tồn tại")
  public void getUserById_ValidId_ReturnsUserResponse() {
    // Arrange (Chuẩn bị dữ liệu)
    final UserEntity mockEntity = UserEntity.builder()
        .id(MOCK_USER_ID)
        .username(MOCK_USERNAME)
        .active(Boolean.TRUE)
        .build();

    given(userRepository.findById(MOCK_USER_ID)).willReturn(Optional.of(mockEntity));

    // Act (Thực thi hàm)
    final UserResponse response = userService.getUserById(MOCK_USER_ID);

    // Assert (Xác minh kết quả)
    assertThat(response).isNotNull();
    assertThat(response.getId()).isEqualTo(MOCK_USER_ID);
    assertThat(response.getUsername()).isEqualTo(MOCK_USERNAME);

    verify(userRepository).findById(MOCK_USER_ID);
  }

  @Test
  @DisplayName("getUserById: Ném InvalidParameterException khi UserId là null")
  public void getUserById_NullId_ThrowsInvalidParameterException() {
    // Act & Assert
    assertThatThrownBy(() -> userService.getUserById(null))
        .isInstanceOf(InvalidParameterException.class)
        .hasFieldOrPropertyWithValue("httpStatus", HttpStatus.BAD_REQUEST);

    verify(userRepository, never()).findById(null);
  }

  @Test
  @DisplayName("getUserById: Ném UserNotFoundException khi không tìm thấy người dùng trong CSDL")
  public void getUserById_UserNotFound_ThrowsUserNotFoundException() {
    // Arrange
    given(userRepository.findById(MOCK_USER_ID)).willReturn(Optional.empty());

    // Act & Assert
    assertThatThrownBy(() -> userService.getUserById(MOCK_USER_ID))
        .isInstanceOf(UserNotFoundException.class)
        .hasFieldOrPropertyWithValue("httpStatus", HttpStatus.NOT_FOUND)
        .hasFieldOrPropertyWithValue("errorCode", ErrorConstant.ERR_USER_NOT_FOUND);

    verify(userRepository).findById(MOCK_USER_ID);
  }
}
```

---

## 4. QUY TRÌNH TEST/FIX LẶP (CONTINUOUS VERIFICATION CYCLE)

```text
[Viết Phương Thức Nghiệp Vụ]
            ↓
[Viết Unit Test Tương Ứng (Happy + Negative + Guard Clauses)]
            ↓
[Chạy Kiểm Thử (Run Unit Tests)]
            ↓
    Kiểm tra kết quả?
    ├── ❌ CÓ LỖI (Fail / Error):
    │      1. Đọc kỹ stack trace và assertion failure.
    │      2. Phân tích nguyên nhân (Logic bug, Mock sai, Null).
    │      3. Sửa mã nguồn (Refactor/Fix Code).
    │      4. Chạy lại kiểm thử (Quay lại bước Run Unit Tests).
    └── ✅ 100% PASS:
           Sẵn sàng chuyển sang hàm tiếp theo hoặc bàn giao.
```

---

## 5. CHECKLIST ĐỐI SOÁT UNIT TEST TRƯỚC KHI BÀN GIAO

- [ ] Mỗi hàm mới/sửa đổi đều có ít nhất 1 bài Unit Test thành công và 1 bài Unit Test ngoại lệ/biên.
- [ ] 100% các ca kiểm thử chạy thành công (0 Failure, 0 Error, 0 Skipped).
- [ ] Mọi ngoại lệ kiểm tra đều là Custom Exception kế thừa `BaseBusinessException`, đúng `HttpStatus`.
- [ ] Sử dụng `verify(...)` kiểm tra tương tác mock và `verify(..., never())` cho các nhánh guard clause dừng sớm.
- [ ] Không có magic string trong file test; dữ liệu giả lập được trích xuất thành hằng số rõ ràng.
