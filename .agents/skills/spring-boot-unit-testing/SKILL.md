---
name: spring-boot-unit-testing
description: >-
  Kích hoạt kỹ năng này khi viết kiểm thử đơn vị (Unit Test), thiết lập Mockito / JUnit 5 / AssertJ,
  kiểm thử kịch bản ngoại lệ Custom Business Exception, kiểm thử Guard Clauses, hoặc thực hiện
  quy trình test và sửa lỗi (Test & Fix Loop) cho đến khi 100% test pass trong Java Spring Boot.
---

# Kỹ Năng: Kiểm Thử Đơn Vị (Unit Testing) & Quy Trình Test/Fix Đến Khi Pass

Kỹ năng này hướng dẫn toàn diện phương pháp xây dựng Unit Test cho **từng hàm** được viết ra trong hệ thống, bao phủ cả nhánh thành công (Happy Path) và ngoại lệ (Negative Path/Guard Clauses), cùng quy trình liên tục kiểm thử và sửa lỗi cho đến khi đạt 100% ca kiểm thử thành công (Pass).

---

## 1. NGUYÊN TẮC BẮT BUỘC KHI VIẾT UNIT TEST

1. **Mỗi Phương Thức Đều Phải Có Test Tương Ứng**:
   - Khi tạo mới hoặc sửa đổi bất kỳ hàm nào trong Service, Controller, Helper, Util, Mapper, Validator: Bắt buộc phải có các ca kiểm thử tương ứng.
   - Không được phép commit hoặc bàn giao code nếu chưa có test đi kèm.
2. **Quy Trình Test/Fix Đến Khi Pass Hoàn Toàn**:
   - Chạy lệnh kiểm thử sau khi viết code: `mvn test` hoặc `./gradlew test`.
   - Nếu có lỗi test: Phân tích assertion failure, sửa mã nguồn hoặc dữ liệu giả lập, và chạy lại cho đến khi toàn bộ test đều xanh (Green).
   - Tuyệt đối không dùng `@Disabled` để lướt qua lỗi.
3. **Mô Hình AAA (Arrange - Act - Assert)**:
   - **Arrange (Given)**: Thiết lập dữ liệu đầu vào và hành vi giả lập (`given(...).willReturn(...)`).
   - **Act (When)**: Gọi phương thức cần kiểm thử.
   - **Assert (Then)**: Xác minh kết quả trả về (`assertThat(...)`) và kiểm tra tương tác mock (`verify(...)`).
4. **Bao Phủ Guard Clauses & Custom Exception**:
   - Mỗi câu lệnh guard clause ném Custom Exception (như `InvalidParameterException`, `ResourceNotFoundException`) đều phải có 1 test case kiểm chứng với `assertThatThrownBy(...)`.
5. **Tuân Thủ Cú Pháp Dự Án**:
   - 100% phương thức test là `public void`.
   - Không dùng magic string/number trong test; trích xuất hằng số rõ ràng.
   - Không dùng toán tử 3 ngôi hoặc nested if trong mã test.

---

## 2. KIỂM THỬ TẦNG SERVICE VỚI MOCKITO

```java
package com.enterprise.app.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

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

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

  private static final String VALID_USER_ID = "018f4a1c-7b2a-7d1e-8e3b-9a4f6c8d2e1a";
  private static final String VALID_USERNAME = "enterprise_user";

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserServiceImpl userService;

  @Test
  @DisplayName("getUserById: Trả về UserResponse khi UserId tồn tại")
  public void getUserById_ValidId_ReturnsUserResponse() {
    final UserEntity entity = UserEntity.builder()
        .id(VALID_USER_ID)
        .username(VALID_USERNAME)
        .active(Boolean.TRUE)
        .build();

    given(userRepository.findById(VALID_USER_ID)).willReturn(Optional.of(entity));

    final UserResponse response = userService.getUserById(VALID_USER_ID);

    assertThat(response).isNotNull();
    assertThat(response.getId()).isEqualTo(VALID_USER_ID);
    assertThat(response.getUsername()).isEqualTo(VALID_USERNAME);
    verify(userRepository).findById(VALID_USER_ID);
  }

  @Test
  @DisplayName("getUserById: Ném InvalidParameterException khi UserId bị null")
  public void getUserById_NullId_ThrowsInvalidParameterException() {
    assertThatThrownBy(() -> userService.getUserById(null))
        .isInstanceOf(InvalidParameterException.class)
        .hasFieldOrPropertyWithValue("httpStatus", HttpStatus.BAD_REQUEST);

    verify(userRepository, never()).findById(null);
  }

  @Test
  @DisplayName("getUserById: Ném UserNotFoundException khi không tìm thấy thực thể")
  public void getUserById_NotFound_ThrowsUserNotFoundException() {
    given(userRepository.findById(VALID_USER_ID)).willReturn(Optional.empty());

    assertThatThrownBy(() -> userService.getUserById(VALID_USER_ID))
        .isInstanceOf(UserNotFoundException.class)
        .hasFieldOrPropertyWithValue("httpStatus", HttpStatus.NOT_FOUND)
        .hasFieldOrPropertyWithValue("errorCode", ErrorConstant.ERR_USER_NOT_FOUND);

    verify(userRepository).findById(VALID_USER_ID);
  }
}
```

---

## 3. KIỂM THỬ LỚP TIỆN ÍCH (UTIL TESTING)

```java
package com.enterprise.app.common.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class StringUtilTest {

  private static final String SAMPLE_TEXT = "  Enterprise Architecture  ";
  private static final String TRIMMED_TEXT = "Enterprise Architecture";

  @Test
  @DisplayName("isBlank: Trả về true khi chuỗi là null hoặc chỉ chứa khoảng trắng")
  public void isBlank_NullOrWhitespace_ReturnsTrue() {
    assertThat(StringUtil.isBlank(null)).isTrue();
    assertThat(StringUtil.isBlank("")).isTrue();
    assertThat(StringUtil.isBlank("   ")).isTrue();
  }

  @Test
  @DisplayName("isBlank: Trả về false khi chuỗi có ký tự hợp lệ")
  public void isBlank_ValidString_ReturnsFalse() {
    assertThat(StringUtil.isBlank("hello")).isFalse();
  }

  @Test
  @DisplayName("trimToEmpty: Cắt khoảng trắng hai đầu chuẩn xác")
  public void trimToEmpty_ValidInput_ReturnsTrimmed() {
    assertThat(StringUtil.trimToEmpty(SAMPLE_TEXT)).isEqualTo(TRIMMED_TEXT);
    assertThat(StringUtil.trimToEmpty(null)).isEqualTo("");
  }
}
```

---

## 4. QUY TRÌNH CHẨN ĐOÁN & SỬA LỖI KIỂM THỬ (DIAGNOSTIC & FIX WORKFLOW)

Khi Unit Test bị thất bại, thực hiện tuần tự 4 bước:
1. **Kiểm tra Stubbing (UnnecessaryStubbing / MissingStub)**:
   - Xác định xem `given(...)` đã khớp chính xác tham số truyền vào hay chưa (dùng `eq(...)` hoặc `any()`).
2. **Kiểm tra Mock Injection**:
   - Bảo đảm `@Mock` và `@InjectMocks` được khởi tạo đúng qua `@ExtendWith(MockitoExtension.class)`.
3. **Kiểm tra Assertion Failure**:
   - So sánh giá trị kỳ vọng (`expected`) và giá trị thực tế (`actual`). Nếu do logic nghiệp vụ sai lệch, sửa mã nguồn nghiệp vụ ngay lập tức.
4. **Xác minh lại toàn bộ Suite**:
   - Chạy lại toàn bộ test class để bảo đảm việc sửa lỗi không gây ảnh hưởng phụ (regression).

---

## 5. BỔ TRỢ KIỂM THỬ: KIỂM THỬ TẢI & HIỆU NĂNG BẰNG APACHE JMETER

Song song với việc Unit Test bảo đảm tính đúng đắn logic của từng hàm (100% pass, 0 lỗi), hệ thống **BẮT BUỘC** phải được kiểm thử hiệu năng chịu tải đồng thời cao bằng **Apache JMeter**.

### 5.1. Hai Trụ Cột Kiểm Thử Bắt Buộc Của Hệ Thống
1. **Kiểm Thử Đơn Vị (Unit Testing)**:
   - Công cụ: JUnit 5, Mockito, AssertJ.
   - Mục tiêu: Kiểm chứng logic nghiệp vụ nguyên tử, điều kiện biên (Guard Clauses), kịch bản lỗi Custom Exception.
   - Lệnh chạy: `mvn test "-Dtest=!PlaywrightUiTest"`.
2. **Kiểm Thử Hiệu Năng & Chịu Tải (Performance / Stress Testing)**:
   - Công cụ: Apache JMeter via `jmeter-maven-plugin`.
   - Mục tiêu: Kiểm chứng khả năng chịu tải đồng thời, đo lường thời gian phản hồi (Latency/SLA), phát hiện bottleneck, rò rỉ bộ nhớ hoặc nghẽn kết nối DB/Redis dưới áp lực hàng trăm threads.
   - Lệnh chạy: `mvn jmeter:jmeter jmeter:results`.

### 5.2. Tiêu Chuẩn Nghiệm Thu Kết Hợp
- [ ] 100% Unit Tests Passed (0 Failure, 0 Error, 0 Skipped).
- [ ] 100% JMeter Requests Successful (0.0% Error Rate).
- [ ] Báo cáo HTML được sinh tại `target/jmeter/reports/*/index.html`.

