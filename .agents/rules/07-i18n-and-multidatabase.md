# Rule 07: Đa Ngôn Ngữ (i18n) & Kiến Trúc Hỗ Trợ Đa Framework / Đa Database

Quy tắc này đảm bảo hệ thống có khả năng toàn cầu hóa (Internationalization), đồng thời có kiến trúc mở cho phép tích hợp linh hoạt nhiều hệ quản trị cơ sở dữ liệu (RDBMS, NoSQL) và nhiều giao thức/framework giao tiếp trên cùng một mã nguồn.

---

## 1. QUY CHUẨN ĐA NGÔN NGỮ (INTERNATIONALIZATION - i18n)

### 1.1. Nguyên tắc cốt lõi:
1. **Không hardcode chuỗi thông điệp**: Tuyệt đối không viết cứng chuỗi thông báo kết quả, mô tả lỗi hoặc nhãn hiển thị trong mã nguồn Java.
2. **Quản lý tập trung qua ResourceBundle**:
   - Sử dụng các tệp tin `messages.properties` (mặc định), `messages_vi.properties` (Tiếng Việt), `messages_en.properties` (Tiếng Anh),... đặt trong `src/main/resources/i18n/`.
   - Các key thông điệp phải được quy hoạch trong lớp hằng số `MessageConstant`.
3. **Xác định ngôn ngữ theo ngữ cảnh phiên**:
   - Tự động nhận diện ngôn ngữ thông qua HTTP Header `Accept-Language` bằng `AcceptHeaderLocaleResolver` của Spring.
   - Truy xuất locale động qua `LocaleContextHolder.getLocale()`.
4. **Trợ thủ truy xuất thông điệp (`MessageHelper`)**:
   - Tuân thủ chuẩn Helper: là `public final class`, đánh dấu `@Component`, 100% non-static method, tiêm `MessageSource`.

### 1.2. Mẫu triển khai `MessageHelper`:
```java
package com.enterprise.app.common.helper;

import com.enterprise.app.common.constant.CommonConstant;
import java.util.Locale;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

/**
 * Trợ thủ hỗ trợ truy xuất thông điệp đa ngôn ngữ dựa trên ngữ cảnh phiên.
 *
 * <p>Tuân thủ chuẩn Helper: final class, Spring Component, không chứa static method.
 */
@Component
@RequiredArgsConstructor
public final class MessageHelper {

  private final MessageSource messageSource;

  /**
   * Lấy thông điệp đa ngôn ngữ theo mã định danh với ngữ cảnh ngôn ngữ hiện tại.
   *
   * @param messageCode mã thông điệp trong tệp messages.properties
   * @return chuỗi thông điệp tương ứng với ngôn ngữ yêu cầu
   */
  public String getMessage(final String messageCode) {
    if (Objects.isNull(messageCode)) {
      return CommonConstant.EMPTY_STRING;
    }

    final Locale locale = LocaleContextHolder.getLocale();
    return messageSource.getMessage(messageCode, null, messageCode, locale);
  }

  /**
   * Lấy thông điệp đa ngôn ngữ có kèm tham số nội suy (Placeholders).
   *
   * @param messageCode mã thông điệp
   * @param args mảng tham số truyền vào thông điệp
   * @return chuỗi thông điệp đã được điền tham số
   */
  public String getMessage(final String messageCode, final Object[] args) {
    if (Objects.isNull(messageCode)) {
      return CommonConstant.EMPTY_STRING;
    }

    final Locale locale = LocaleContextHolder.getLocale();
    return messageSource.getMessage(messageCode, args, messageCode, locale);
  }
}
```

---

## 2. KIẾN TRÚC ĐA DATABASE & ĐA FRAMEWORK (DECOUPLED PORTS & ADAPTERS)

Để một mã nguồn có thể chạy song song hoặc dễ dàng hoán đổi giữa nhiều Database (MySQL, PostgreSQL, Oracle, MongoDB) và các Framework/Transport (Spring Web MVC, WebFlux, gRPC, Kafka):

### 2.1. Phân tách rõ ràng giữa Domain Core và Transport Framework:
- **Tầng Service và Model**: Hoàn toàn không được chứa các import hoặc annotation của tầng giao tiếp Web (như `HttpServletRequest`, `@RequestParam`, `@PathVariable`, Spring Web annotations).
- Tầng giao tiếp (REST Controller, gRPC Stub, Kafka Consumer) chỉ đóng vai trò **Adapter**. Khi chuyển sang framework khác (ví dụ: bổ sung gRPC bên cạnh REST), tầng Service hoàn toàn giữ nguyên mà không cần sửa đổi dù chỉ 1 dòng code.

### 2.2. Hỗ trợ Đa Cơ Sở Dữ Liệu (Multi-Database & Multi-Datasource):
1. **Phân tách qua Repository Interface**:
   - Tầng Service chỉ tương tác với interface trừu tượng (`UserRepositoryPort`).
   - Tạo các adapter triển khai khác nhau:
     - `UserJpaRepositoryAdapter` (khi dùng JPA/PostgreSQL).
     - `UserMongoRepositoryAdapter` (khi dùng MongoDB).
   - Kích hoạt adapter phù hợp bằng `@ConditionalOnProperty(name = "app.database.type", havingValue = "jpa")`.
2. **Cấu hình Multi-Datasource an toàn**:
   - Khi dự án cần kết nối cùng lúc nhiều database: Mỗi DataSource phải có `@Configuration` riêng, chỉ định rõ ràng `basePackages` cho Repository và Entity tương ứng.
   - Một DataSource được đánh dấu `@Primary`, các DataSource phụ được tiêm bằng `@Qualifier("secondaryDataSource")`.
3. **Định tuyến cơ sở dữ liệu động (Dynamic Routing)**:
   - Sử dụng `AbstractRoutingDataSource` của Spring để chuyển đổi giữa Master (Ghi) và Slave (Đọc) hoặc giữa các Tenant (Multi-Tenancy) mà không làm ô nhiễm logic nghiệp vụ của tầng Service.
