---
name: spring-boot-business-customization
description: >-
  Kích hoạt kỹ năng này khi thiết kế logic nghiệp vụ cần khả năng tùy biến cao (Customizability),
  áp dụng Strategy Pattern, Template Method, Domain Events hoặc cơ chế @ConditionalOnMissingBean
  để cho phép mở rộng mà không làm sửa đổi mã nguồn cốt lõi (Core Logic).
---

# Kỹ Năng: Thiết Kế Nghiệp Vụ Có Khả Năng Tùy Biến Cao (Business Customization)

Kỹ năng này hướng dẫn cách áp dụng các mẫu thiết kế hướng đối tượng (GoF Design Patterns) kết hợp với Spring Framework để tạo ra các module nghiệp vụ có khả năng cắm/rút, thay thế hoặc mở rộng linh hoạt theo từng khách hàng và ngữ cảnh triển khai.

---

## 1. QUY TRÌNH TRIỂN KHAI THEO STRATEGY PATTERN

### Bước 1: Khởi tạo Interface Chiến Lược (Strategy Interface)
Định nghĩa một interface mô tả hành động nghiệp vụ cần tùy biến:
```java
package com.enterprise.app.service.strategy;

/**
 * Giao diện chiến lược xử lý tính phí vận chuyển theo từng đơn vị vận chuyển.
 */
public interface ShippingFeeStrategy {

  /**
   * Kiểm tra xem chiến lược này có hỗ trợ mã nhà vận chuyển cung cấp hay không.
   *
   * @param carrierCode mã nhà vận chuyển
   * @return {@code true} nếu hỗ trợ; ngược lại {@code false}
   */
  boolean supports(String carrierCode);

  /**
   * Tính toán phí vận chuyển thực tế cho đơn hàng.
   *
   * @param weightGram khối lượng đơn hàng tính bằng gram
   * @param distanceKm khoảng cách giao hàng tính bằng km
   * @return số tiền phí vận chuyển tính bằng đơn vị tiền tệ cơ sở
   */
  long calculateFee(int weightGram, double distanceKm);
}
```

### Bước 2: Triển khai các Biến Thể Chiến Lược (Implementations)
Mỗi thuật toán/đơn vị xử lý là một Spring Bean độc lập:
```java
package com.enterprise.app.service.strategy.impl;

import com.enterprise.app.common.constant.ShippingConstant;
import com.enterprise.app.service.strategy.ShippingFeeStrategy;
import java.util.Objects;
import org.springframework.stereotype.Component;

/**
 * Chiến lược tính phí vận chuyển hỏa tốc.
 */
@Component
public class ExpressShippingFeeStrategy implements ShippingFeeStrategy {

  @Override
  public boolean supports(final String carrierCode) {
    return Objects.equals(carrierCode, ShippingConstant.CARRIER_EXPRESS);
  }

  @Override
  public long calculateFee(final int weightGram, final double distanceKm) {
    // Logic tính phí hỏa tốc
    return Math.round(weightGram * 2.5 + distanceKm * 5000);
  }
}
```

### Bước 3: Tiêm và Điều phối Chiến Lược tại Tầng Service
Service chỉ làm nhiệm vụ tìm kiếm chiến lược phù hợp và thực thi, không chứa bất kỳ logic rẽ nhánh `if/else` phức tạp nào:
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.exception.BusinessException;
import com.enterprise.app.service.ShippingService;
import com.enterprise.app.service.strategy.ShippingFeeStrategy;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Dịch vụ xử lý giao vận đơn hàng.
 */
@Service
@RequiredArgsConstructor
public class ShippingServiceImpl implements ShippingService {

  private final List<ShippingFeeStrategy> shippingFeeStrategies;

  @Override
  public long calculateShippingFee(final String carrierCode, final int weightGram, final double distanceKm) {
    Objects.requireNonNull(carrierCode, "Carrier code must not be null");

    for (final ShippingFeeStrategy strategy : shippingFeeStrategies) {
      if (strategy.supports(carrierCode)) {
        return strategy.calculateFee(weightGram, distanceKm);
      }
    }

    throw new BusinessException(ErrorConstant.ERR_UNSUPPORTED_CARRIER, "Carrier not supported: " + carrierCode);
  }
}
```
*Lợi ích: Khi thêm đối tác vận chuyển mới, lập trình viên chỉ cần tạo thêm 1 file class mới thực thi `ShippingFeeStrategy`, không cần sửa bất kỳ dòng code nào trong `ShippingServiceImpl`!*
