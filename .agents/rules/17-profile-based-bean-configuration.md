# Rule 17: Phân Định và Khởi Tạo Spring Bean Theo Môi Trường (@Profile)

Tài liệu này quy chuẩn bắt buộc về việc áp dụng annotation `@Profile` kết hợp với tính đa hình (Polymorphism) để khởi tạo các triển khai Spring Bean phù hợp theo từng môi trường vận hành (Mock Service cho Local/Dev vs Real Service cho Staging/Prod).

---

## 1. NGUYÊN TẮC THIẾT KẾ BEAN THEO MÔI TRƯỜNG

1. **Tuân Thủ Dependency Inversion (DIP)**:
   - Các tầng nghiệp vụ cấp cao chỉ phụ thuộc vào **Interface** (hợp đồng dịch vụ), không bao giờ phụ thuộc vào lớp triển khai cụ thể (`Impl`).
2. **Khởi Tạo Bean Điều Kiện Qua `@Profile`**:
   - Sử dụng `@Profile(ProfileConstant.LOCAL_OR_DEV)` cho các triển khai giả lập (Mocking, Stubbing, In-Memory).
   - Sử dụng `@Profile(ProfileConstant.STAGING_OR_PROD)` cho các triển khai dịch vụ thực tế (Stripe, AWS S3, SendGrid, Twilio).
3. **Triệt Tiêu Magic String**:
   - 100% giá trị trong `@Profile` phải tham chiếu từ `ProfileConstant`.
4. **Ghi Nhật Ký Đầu/Cuối Bằng Hằng Số**:
   - Mọi phương thức trong Bean phải ghi log bắt đầu và kết thúc sử dụng hằng số từ `*LogConstant`.

---

## 2. KHAI BÁO HỢP ĐỒNG DỊCH VỤ (SERVICE INTERFACE)

```java
package com.enterprise.app.service;

import com.enterprise.app.dto.PaymentReceiptDto;
import com.enterprise.app.dto.PaymentRequestDto;

/**
 * Hợp đồng dịch vụ điều phối thanh toán trực tuyến.
 */
public interface PaymentGatewayService {

  /**
   * Thực hiện giao dịch thanh toán qua cổng thanh toán.
   *
   * @param requestDto thông tin yêu cầu thanh toán
   * @return {@link PaymentReceiptDto} kết quả biên nhận giao dịch
   */
  PaymentReceiptDto processPayment(PaymentRequestDto requestDto);
}
```

---

## 3. LỚP HẰNG SỐ LOG THANH TOÁN (`PaymentLogConstant.java`)

```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp hằng số thông điệp ghi nhật ký cho phân hệ thanh toán đa môi trường.
 */
public final class PaymentLogConstant {

  private PaymentLogConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String START_MOCK_PAYMENT = "Starting mock payment processing for orderId={}";
  public static final String FINISH_MOCK_PAYMENT = "Finished mock payment processing with txId={}";
  public static final String START_STRIPE_PAYMENT = "Starting Stripe live payment processing for orderId={}";
  public static final String FINISH_STRIPE_PAYMENT = "Finished Stripe live payment processing with txId={}";
}
```

---

## 4. TRIỂN KHAI GIẢ LẬP CHO LOCAL/DEV (`MockPaymentGatewayServiceImpl.java`)

```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.PaymentLogConstant;
import com.enterprise.app.common.constant.ProfileConstant;
import com.enterprise.app.common.util.UuidUtil;
import com.enterprise.app.dto.PaymentReceiptDto;
import com.enterprise.app.dto.PaymentRequestDto;
import com.enterprise.app.service.PaymentGatewayService;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Triển khai giả lập cổng thanh toán phục vụ môi trường nội bộ và phát triển.
 */
@Slf4j
@Service
@Profile(ProfileConstant.LOCAL_OR_DEV)
public class MockPaymentGatewayServiceImpl implements PaymentGatewayService {

  @Override
  public PaymentReceiptDto processPayment(final PaymentRequestDto requestDto) {
    Objects.requireNonNull(requestDto);
    log.info(PaymentLogConstant.START_MOCK_PAYMENT, requestDto.getOrderId());

    final PaymentReceiptDto receipt = PaymentReceiptDto.builder()
        .transactionId(UuidUtil.generateUuidV7().toString())
        .orderId(requestDto.getOrderId())
        .amount(requestDto.getAmount())
        .success(Boolean.TRUE)
        .build();

    log.info(PaymentLogConstant.FINISH_MOCK_PAYMENT, receipt.getTransactionId());
    return receipt;
  }
}
```

---

## 5. TRIỂN KHAI THỰC TẾ CHO STAGING/PRODUCTION (`StripePaymentGatewayServiceImpl.java`)

```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.PaymentLogConstant;
import com.enterprise.app.common.constant.ProfileConstant;
import com.enterprise.app.common.util.UuidUtil;
import com.enterprise.app.dto.PaymentReceiptDto;
import com.enterprise.app.dto.PaymentRequestDto;
import com.enterprise.app.service.PaymentGatewayService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Triển khai cổng thanh toán thực tế với Stripe API cho môi trường Staging và Production.
 */
@Slf4j
@Service
@Profile(ProfileConstant.STAGING_OR_PROD)
@RequiredArgsConstructor
public class StripePaymentGatewayServiceImpl implements PaymentGatewayService {

  @Override
  public PaymentReceiptDto processPayment(final PaymentRequestDto requestDto) {
    Objects.requireNonNull(requestDto);
    log.info(PaymentLogConstant.START_STRIPE_PAYMENT, requestDto.getOrderId());

    // Thực thi gọi Stripe SDK trong môi trường thực tế...
    final PaymentReceiptDto receipt = PaymentReceiptDto.builder()
        .transactionId(UuidUtil.generateUuidV7().toString())
        .orderId(requestDto.getOrderId())
        .amount(requestDto.getAmount())
        .success(Boolean.TRUE)
        .build();

    log.info(PaymentLogConstant.FINISH_STRIPE_PAYMENT, receipt.getTransactionId());
    return receipt;
  }
}
```
