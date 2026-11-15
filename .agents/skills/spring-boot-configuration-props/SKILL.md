---
name: spring-boot-configuration-props
description: >-
  Kích hoạt kỹ năng này khi thêm mới, sửa đổi hoặc chuẩn hóa các thuộc tính cấu hình trong application.yml / properties,
  đảm bảo 100% không bị warning trên IDE và hỗ trợ đầy đủ auto-completion, metadata và type-validation.
---

# Kỹ Năng: Chuẩn Hóa Cấu Hình & Triệt Tiêu Cảnh Báo IDE (Configuration Properties)

Kỹ năng này hướng dẫn quy trình đóng gói thuộc tính cấu hình thành các lớp strongly-typed, loại trừ hoàn toàn các cảnh báo "Unknown configuration property" trên IntelliJ IDEA, VS Code và Eclipse.

---

## 1. QUY TRÌNH TRIỂN KHAI

### Bước 1: Thêm Dependency Xử Lý Metadata
Đảm bảo dự án đã khai báo `spring-boot-configuration-processor` trong file quản lý gói:
- Với Maven: Thêm vào `pom.xml` với thẻ `<optional>true</optional>`.
- Với Gradle: Thêm `annotationProcessor "org.springframework.boot:spring-boot-configuration-processor"`.

### Bước 2: Thiết Kế Lớp `@ConfigurationProperties`
1. Đặt trong package `com.enterprise.app.config.properties`.
2. Đặt tiền tố rõ ràng (ví dụ: `@ConfigurationProperties(prefix = "app.payment")`).
3. Đánh dấu `@Validated` trên lớp.
4. Sử dụng Lombok `@Getter` và `@Setter`.
5. **BẮT BUỘC**: Viết Javadoc cho từng trường dữ liệu để IDE hiển thị tooltip hướng dẫn cho developer.
6. Thiết lập giá trị mặc định cho từng thuộc tính để tránh NPE khi ứng dụng khởi chạy mà người dùng chưa định nghĩa trong file cấu hình.

### Bước 3: Kích Hoạt Quét Tự Động
Thêm `@ConfigurationPropertiesScan` vào file chạy ứng dụng chính (`Application.java`).

### Bước 4: Viết File `application.yml`
Khi lập trình viên gõ các thuộc tính trong `application.yml`, IDE sẽ tự động gợi ý (Ctrl+Space) và không bao giờ xuất hiện gạch chân màu vàng cảnh báo.

---

## 2. CODE MẪU CHUẨN

```java
package com.enterprise.app.config.properties;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Cấu hình cổng thanh toán điện tử.
 */
@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app.payment")
public class PaymentProperties {

  /**
   * URL endpoint của cổng thanh toán trực tuyến.
   */
  @NotBlank(message = "Gateway URL must not be blank")
  private String gatewayUrl = "https://api.payment-gateway.example.com";

  /**
   * Thời gian chờ tối đa (tính theo giây) khi gọi cổng thanh toán.
   */
  @Min(value = 1, message = "Timeout must be at least 1 second")
  private int timeoutSeconds = 30;

  /**
   * Cho phép chạy ở chế độ giả lập (Mock Sandbox).
   */
  private boolean sandboxMode = false;
}
```
