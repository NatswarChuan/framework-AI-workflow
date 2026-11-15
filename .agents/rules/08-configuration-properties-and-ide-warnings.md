# Rule 08: Quản Lý Thuộc Tính Cấu Hình & Triệt Tiêu Cảnh Báo IDE (Zero-Warning Configuration)

Tất cả các thuộc tính cấu hình trong `application.yml` hoặc `application.properties` phải được định nghĩa chuẩn tắc để **loại bỏ 100% cảnh báo "Unknown configuration property" trên mọi IDE** (IntelliJ IDEA, VS Code, Eclipse), đồng thời hỗ trợ tính năng tự động gợi ý mã (Auto-completion), kiểm tra kiểu (Type safety) và tài liệu hóa (Documentation tooltips).

> **LƯU Ý QUY CHUẨN CẤM STATIC CLASS**: Tuyệt đối không khai báo inner static class bên trong lớp Properties. Mọi đối tượng con lồng nhau đều phải được tách thành các lớp độc lập riêng biệt (top-level classes).

---

## 1. NGUYÊN TẮC BẮT BUỘC

1. **CẤM phân tán `@Value("${...}")` bừa bãi**:
   - Mọi thuộc tính cấu hình phải được gom nhóm có tổ chức theo tiền tố (prefix) trong các lớp **`@ConfigurationProperties`**.
2. **Khai báo Metadata sinh tự động**:
   - Dự án bắt buộc phải có dependency `spring-boot-configuration-processor` (ở phạm vi `optional: true` hoặc `annotationProcessor`).
   - Tự động sinh ra tệp `META-INF/spring-configuration-metadata.json` khi build, giúp IDE nhận diện mọi thuộc tính.
3. **Mỗi class là một tệp độc lập (Không static inner class)**:
   - Các nhóm thuộc tính con (như Security, Database) phải là các class top-level riêng: `AppSecurityProperties.java`, `AppDatabaseProperties.java`.
4. **Bắt buộc viết Javadoc và giá trị mặc định cho từng thuộc tính**:
   - Mỗi trường trong lớp Properties phải có Javadoc chi tiết mô tả mục đích sử dụng. Javadoc này sẽ hiển thị trực tiếp trong tooltip của IDE.
5. **Kiểm tra tính hợp lệ khi khởi động (Fail-fast validation)**:
   - Đánh dấu `@Validated` trên lớp Properties kèm theo các annotation `@NotNull`, `@NotBlank`, `@Min`, `@Max`.

---

## 2. MẪU TRIỂN KHAI CHUẨN MỰC

### 2.1. Lớp Cấu hình Bảo Mật Độc Lập (`AppSecurityProperties.java`)
```java
package com.enterprise.app.config.properties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import lombok.Getter;
import lombok.Setter;

/**
 * Cấu hình các tham số bảo mật hệ thống.
 *
 * <p>Là lớp độc lập, không dùng inner static class.
 */
@Getter
@Setter
public class AppSecurityProperties {

  /**
   * Khóa bí mật dùng để ký và giải mã JWT token.
   */
  @NotBlank(message = "JWT secret key must not be blank")
  private String jwtSecret = "default-secure-key-must-be-overridden-in-production-environment";

  /**
   * Thời gian sống mặc định của JWT Access Token.
   */
  @NotNull
  private Duration tokenValidity = Duration.ofHours(2);
}
```

### 2.2. Lớp Cấu hình Cơ Sở Dữ Liệu Độc Lập (`AppDatabaseProperties.java`)
```java
package com.enterprise.app.config.properties;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Cấu hình kết nối và phân vùng cơ sở dữ liệu.
 *
 * <p>Là lớp độc lập, không dùng inner static class.
 */
@Getter
@Setter
public class AppDatabaseProperties {

  /**
   * Loại cơ sở dữ liệu chính được sử dụng (jpa, mongodb).
   */
  @NotBlank
  private String type = "jpa";

  /**
   * Số lượng kết nối tối đa trong Connection Pool.
   */
  private int maxPoolSize = 20;
}
```

### 2.3. Lớp Cấu hình Gốc (`AppProperties.java`)
```java
package com.enterprise.app.config.properties;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Cấu hình toàn bộ tham số kỹ thuật và nghiệp vụ của ứng dụng.
 *
 * <p>Tiền tố cấu hình trong application.yml: {@code app}.
 * Sử dụng các class độc lập, hoàn toàn không có inner static class.
 */
@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

  /**
   * Cấu hình liên quan đến xác thực và mã hóa bảo mật.
   */
  @NotNull
  private AppSecurityProperties security = new AppSecurityProperties();

  /**
   * Cấu hình kết nối cơ sở dữ liệu và phân vùng truy vấn.
   */
  @NotNull
  private AppDatabaseProperties database = new AppDatabaseProperties();
}
```
