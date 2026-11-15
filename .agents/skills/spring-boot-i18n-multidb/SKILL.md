---
name: spring-boot-i18n-multidb
description: >-
  Kích hoạt kỹ năng này khi triển khai hỗ trợ Đa Ngôn Ngữ (i18n), thiết lập cấu hình nhiều Cơ Sở Dữ Liệu
  (Multi-Datasource/Multi-Database), hoặc phân tách mã nguồn để hỗ trợ song song nhiều Framework/Protocol (REST, gRPC, Kafka).
---

# Kỹ Năng: Triển Khai Đa Ngôn Ngữ & Kiến Trúc Đa CSDL/Framework

Kỹ năng này hướng dẫn quy trình từng bước xây dựng hệ thống đa ngôn ngữ hoàn chỉnh và thiết lập cơ chế kết nối đa cơ sở dữ liệu trên cùng một mã nguồn.

---

## 1. QUY TRÌNH TRIỂN KHAI ĐA NGÔN NGỮ (i18n)

### Bước 1: Khởi tạo các tệp ResourceBundle
Tạo thư mục `src/main/resources/i18n/` và bổ sung các tệp tin:
- `messages.properties` (Ngôn ngữ mặc định)
- `messages_vi.properties` (Tiếng Việt)
- `messages_en.properties` (Tiếng Anh)

Ví dụ nội dung `messages_vi.properties`:
```properties
user.created.success=Người dùng đã được tạo thành công với mã định danh {0}
error.user.not.found=Không tìm thấy người dùng với mã định danh {0}
error.user.already.exists=Tên đăng nhập {0} đã tồn tại trong hệ thống
```

### Bước 2: Cấu hình Spring MessageSource & LocaleResolver
Trong package `com.enterprise.app.config`:
```java
package com.enterprise.app.config;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

/**
 * Cấu hình hệ thống đa ngôn ngữ toàn cầu (i18n).
 */
@Configuration
public class I18nConfig {

  @Bean
  public LocaleResolver localeResolver() {
    final AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
    resolver.setDefaultLocale(Locale.ENGLISH);
    return resolver;
  }

  @Bean
  public MessageSource messageSource() {
    final ReloadableResourceBundleMessageSource source = new ReloadableResourceBundleMessageSource();
    source.setBasename("classpath:i18n/messages");
    source.setDefaultEncoding(StandardCharsets.UTF_8.name());
    source.setCacheSeconds(3600);
    return source;
  }
}
```

### Bước 3: Sử dụng `MessageHelper` trong Service hoặc Handler
- Tiêm `MessageHelper` vào Service hoặc ExceptionHandler để lấy thông điệp theo locale tự động, không hardcode bất kỳ chuỗi thông báo nào.

---

## 2. QUY TRÌNH HỖ TRỢ ĐA DATABASE TRÊN CÙNG SOURCE CODE

Khi một ứng dụng cần kết nối song song 2 database (ví dụ: Primary PostgreSQL cho nghiệp vụ chính và Secondary MySQL cho báo cáo/lịch sử):

### Bước 1: Định nghĩa 2 nhóm cấu hình trong `application.yml`
```yaml
app:
  datasource:
    primary:
      jdbc-url: jdbc:postgresql://localhost:5432/primary_db
      username: postgres
      password: secretpassword
      driver-class-name: org.postgresql.Driver
    secondary:
      jdbc-url: jdbc:mysql://localhost:3306/secondary_db
      username: root
      password: secretpassword
      driver-class-name: com.mysql.cj.jdbc.Driver
```

### Bước 2: Phân tách Package Entity & Repository riêng biệt
- Package `com.enterprise.app.entity.primary` & `com.enterprise.app.repository.primary`
- Package `com.enterprise.app.entity.secondary` & `com.enterprise.app.repository.secondary`

### Bước 3: Cấu hình 2 EntityManagerFactory độc lập
- Tạo `PrimaryDbConfig.java` với `@EnableJpaRepositories(basePackages = "...repository.primary")` và đánh dấu `@Primary`.
- Tạo `SecondaryDbConfig.java` với `@EnableJpaRepositories(basePackages = "...repository.secondary")`.
- Nhờ việc phân tách này, tầng Service có thể tiêm cả 2 repository từ 2 cơ sở dữ liệu khác nhau mà không bao giờ bị xung đột context!
