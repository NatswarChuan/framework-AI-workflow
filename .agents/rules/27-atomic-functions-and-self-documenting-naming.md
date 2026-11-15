# Rule 27: Hàm Đơn Nhiệm, Lớp Đơn Trách Nhiệm & Tên Tự Mô Tả (Atomic Functions & Self-Documenting Naming)

Tài liệu này xác lập quy chuẩn bắt buộc về tính đơn nhiệm của phương thức, đơn trách nhiệm của lớp và nghệ thuật đặt tên tự thân mô tả ý nghĩa trong toàn bộ mã nguồn hệ thống.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Một (1) Hàm Chỉ Được Phép Làm Đúng Một (1) Việc Duy Nhất (Atomic Function Principle)**:
   - Mỗi phương thức chỉ đảm nhận duy nhất một tác vụ nguyên tử (Do One Thing and Do It Well).
   - Tuyệt đối không để một hàm kiêm nhiệm nhiều công việc hỗn tạp (như: vừa kiểm tra hợp lệ, vừa tính toán thuế, vừa ghi CSDL, vừa gửi thông báo).
   - Khi một hàm đóng vai trò điều phối quy trình (Orchestration), hàm đó chỉ triệu gọi tuần tự các hàm đơn nhiệm tương ứng, tuyệt đối không tự chèn thêm logic xử lý chi tiết.
   - Hàm đơn nhiệm giúp loại bỏ hoàn toàn các tác dụng phụ ẩn (Side Effects), dễ kiểm thử đơn vị độc lập và luôn thỏa mãn độ phức tạp SonarQube (Cyclomatic <= 8, Cognitive <= 8).
2. **Một (1) Lớp Chỉ Được Mang Đúng Một (1) Ý Nghĩa Duy Nhất (Class-Level SRP)**:
   - Mỗi lớp chỉ đại diện cho một thực thể hoặc một trách nhiệm đơn lẻ trong hệ sinh thái ứng dụng, chỉ có duy nhất **một lý do để thay đổi (Single Reason to Change)**.
   - Tuyệt đối cấm tạo các lớp "God Class" hoặc các lớp chứa từ khóa chung chung như `*Manager`, `*HandlerAll`, `*GeneralService` ôm đồm hàng chục nhiệm vụ không liên quan.
   - Phân tách lớp triệt để theo từng khía cạnh nghiệp vụ cụ thể: thay vì một lớp `UserManager` khổng lồ, chia thành `UserRegistrationValidator`, `PasswordHashHelper`, `UserWelcomeEmailSender`.
3. **Mã Nguồn Phải Tự Mô Tả Được Bản Thân (Self-Documenting Code Synergy)**:
   - **Sự kết hợp giữa `Tên Package` + `Tên Lớp` + `Tên Hàm` + `Tham Số` phải tự giải thích 100% mục đích và hành vi của hàm** mà người đọc không cần phải mở Javadoc hay đọc comment giải thích mới hiểu được.
   - **Tên Package**: Thể hiện rõ ngữ cảnh miền nghiệp vụ và loại phân tầng (`com.enterprise.app.order.pricing`, `com.enterprise.app.security.token`).
   - **Tên Lớp**: Danh từ chuyên biệt phản ánh chính xác vai trò duy nhất (`OrderVipDiscountCalculator`, `JwtTokenValidator`).
   - **Tên Hàm**: Bắt đầu bằng động từ hành động kết hợp tân ngữ cụ thể và điều kiện biên (`calculateLoyaltyDiscountAmount`, `verifyAccountEligibilityForPromotion`).
   - **Tuyệt đối CẤM các tên hàm mơ hồ, vô nghĩa**: Cấm đặt tên như `process()`, `handle()`, `doAction()`, `execute()`, `run()`, `data()`, `manage()`, `perform()`.
   - **Triết lý Clean Code**: "Mã nguồn sạch là tài liệu tốt nhất cho chính nó". Javadoc được duy trì để chuẩn hóa hợp đồng API (`@param`, `@return`, `@throws`), nhưng không bao giờ được dùng để khỏa lấp việc đặt tên hàm cẩu thả hoặc cấu trúc rối rắm.

---

## 2. BẢNG ĐỐI CHIẾU ĐẶT TÊN & ĐƠN NHIỆM

| Thành phần | ❌ Cách làm CẤM (Vi phạm SRP & Mơ hồ) | ✅ Cách làm BẮT BUỘC (Đơn nhiệm & Tự mô tả) |
| :--- | :--- | :--- |
| **Tên Package** | `com.enterprise.app.stuff`, `...service.impl` | `com.enterprise.app.order.discount`, `...customer.eligibility` |
| **Tên Lớp** | `OrderManager`, `UserDataHandler` | `OrderSeasonalDiscountCalculator`, `UserRegistrationValidator` |
| **Tên Hàm** | `process(order)`, `handleUser(data)` | `calculateSeasonalDiscountAmount(order)`, `verifyUserEmailUniqueness(email)` |
| **Trách nhiệm Hàm** | Vừa validate, vừa tính discount, vừa lưu DB | Tách thành 3 hàm riêng biệt trên 3 lớp Helper chuyên biệt |
| **Ý nghĩa Lớp** | Chứa cả đăng ký, đổi mật khẩu, xuất báo cáo | Mỗi lớp chỉ chứa các hàm cùng phục vụ duy nhất 1 mục đích |

---

## 3. CODE MẪU CHUẨN MỰC

### 3.1. Phân Tách Hàm Đơn Nhiệm & Tự Mô Tả (`OrderDiscountCalculationHelper.java`)
```java
package com.enterprise.app.order.discount;

import com.enterprise.app.common.constant.OrderLogConstant;
import com.enterprise.app.dto.OrderPricingCalculationDto;
import java.math.BigDecimal;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Trợ thủ tính toán mức chiết khấu cho đơn hàng dựa trên cấp bậc thành viên.
 *
 * <p>Đảm bảo tính đơn nhiệm: Lớp chỉ tính chiết khấu, mỗi hàm chỉ tính đúng 1 công thức.
 */
@Slf4j
@Component
public final class OrderDiscountCalculationHelper {

  /**
   * Tính toán số tiền chiết khấu dành riêng cho khách hàng VIP.
   *
   * @param calculationDto thông tin đơn giá và cấp bậc khách hàng
   * @return {@link BigDecimal} số tiền được khấu trừ
   */
  public BigDecimal calculateVipCustomerDiscountAmount(
      final OrderPricingCalculationDto calculationDto) {
    log.info(OrderLogConstant.START_CALCULATE_VIP_DISCOUNT);
    Objects.requireNonNull(calculationDto, OrderLogConstant.MSG_DTO_NOT_NULL);

    final BigDecimal orderTotal = calculationDto.getBaseTotalAmount();
    final BigDecimal discountRate = calculationDto.getDiscountRate();
    final BigDecimal discountAmount = orderTotal.multiply(discountRate);

    log.info(OrderLogConstant.FINISH_CALCULATE_VIP_DISCOUNT);
    return discountAmount;
  }
}
```

### 3.2. Chuỗi Gọi Hàm Tự Mô Tả Bản Thân Mà Không Cần Đọc Comment
```java
// Khi đọc đoạn mã điều phối này, lập trình viên hiểu ngay 100% nghiệp vụ:
userRegistrationValidator.verifyEmailAddressUniqueness(request.getEmail());
final String secureHashedPassword = passwordHashHelper.hashPlainTextPassword(request.getRawPassword());
final UserEntity savedUserEntity = userRepository.save(userEntity);
userNotificationHelper.sendWelcomeEmailAfterRegistration(savedUserEntity.getEmail());
```
