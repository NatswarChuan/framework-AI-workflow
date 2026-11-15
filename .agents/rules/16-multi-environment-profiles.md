# Rule 16: Kiến Trúc Đa Môi Trường Thông Qua Spring Profiles

Tài liệu này quy chuẩn bắt buộc về việc thiết lập, phân tách và quản lý cấu hình hệ thống đa môi trường (**Multi-Environment Architecture**) thông qua cơ chế **Spring Profiles** (`local`, `dev`, `test`, `staging`, `prod`), bảo đảm tính linh hoạt và bảo mật tuyệt đối cho thông tin nhạy cảm.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Phân Định 5 Môi Trường Tiêu Chuẩn**:
   - **`local`**: Máy lập trình viên cá nhân. Ưu tiên khởi động nhanh, log chi tiết (`DEBUG`), hiển thị SQL, bộ nhớ đệm cục bộ (Caffeine in-memory), Swagger UI bật sẵn.
   - **`dev`**: Môi trường phát triển tập trung (Shared Dev). Kết nối CSDL Dev, bật đầy đủ Distributed Tracing.
   - **`test`**: Môi trường CI/CD Pipelines, Unit & Integration Tests. Dùng H2 In-Memory hoặc Testcontainers, mock dịch vụ bên thứ ba.
   - **`staging`**: Môi trường tiền sản xuất (UAT/Staging). Dữ liệu làm mờ (Masked Data), kiểm thử tải và bảo mật.
   - **`prod`**: Môi trường vận hành sản xuất. Bảo mật tối đa, tắt Swagger/Actuator nhạy cảm, HikariCP tối ưu, log bất đồng bộ (Async Appender), 100% bí mật nạp từ biến môi trường (`${ENV_VAR}`).

2. **Cơ Chế Phân Tách Tập Tin Cấu Hình**:
   - `application.yml`: Chứa cấu hình gốc dùng chung (Base Config) và profile kích hoạt mặc định:
     ```yaml
     spring:
       profiles:
         active: ${SPRING_PROFILES_ACTIVE:local}
     ```
   - `application-local.yml`, `application-dev.yml`, `application-test.yml`, `application-staging.yml`, `application-prod.yml`: Cấu hình ghi đè theo từng môi trường.

3. **Triệt Tiêu Magic String Cho Tên Profile**:
   - Tuyệt đối không hardcode chuỗi `"local"`, `"prod"` trong code Java.
   - Bắt buộc tham chiếu từ lớp **`ProfileConstant.java`**.

4. **Tuyệt Đối Không Lưu Trữ Thông Tin Nhạy Cảm Trong Git**:
   - Mật khẩu DB, JWT Secret Key, API Key Staging/Prod bắt buộc nạp qua biến môi trường: `${SPRING_DATASOURCE_PASSWORD}`.

---

## 2. LỚP HẰNG SỐ PROFILE CHUẨN MỰC (`ProfileConstant.java`)

```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp hằng số định danh các môi trường chạy (Spring Profiles) của ứng dụng.
 */
public final class ProfileConstant {

  private ProfileConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String LOCAL = "local";
  public static final String DEV = "dev";
  public static final String TEST = "test";
  public static final String STAGING = "staging";
  public static final String PROD = "prod";

  // Biểu thức điều kiện kết hợp profile
  public static final String NOT_PROD = "!prod";
  public static final String LOCAL_OR_DEV = "local | dev";
  public static final String STAGING_OR_PROD = "staging | prod";
}
```

---

## 3. CẤU TRÚC YAML PHÂN TẦNG MẪU

### 3.1. Cấu Hình Gốc (`application.yml`)
```yaml
spring:
  application:
    name: enterprise-service
  profiles:
    active: ${SPRING_PROFILES_ACTIVE:local}
  jackson:
    date-format: yyyy-MM-dd'T'HH:mm:ss.SSSXXX
    time-zone: UTC
    default-property-inclusion: non_null

server:
  port: ${SERVER_PORT:8080}
```

### 3.2. Cấu Hình Sản Xuất (`application-prod.yml`)
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    hikari:
      maximum-pool-size: ${DB_POOL_MAX_SIZE:50}
      minimum-idle: 10
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

logging:
  level:
    root: WARN
    com.enterprise.app: INFO

springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: false
```

---

## 4. PHÂN TÁCH GHI NHẬT KÝ THEO PROFILE TRONG `logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds">

  <!-- Môi trường Local / Dev: Console Appender -->
  <springProfile name="local,dev">
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
      <encoder>
        <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{traceId}] %-5level %logger{36} - %msg%n</pattern>
        <charset>UTF-8</charset>
      </encoder>
    </appender>
    <root level="INFO">
      <appender-ref ref="CONSOLE"/>
    </root>
  </springProfile>

  <!-- Môi trường Staging / Prod: Async Appender -->
  <springProfile name="staging,prod">
    <appender name="ASYNC_APP" class="ch.qos.logback.classic.AsyncAppender">
      <appender-ref ref="APP_FILE"/>
      <queueSize>1024</queueSize>
      <discardingThreshold>0</discardingThreshold>
    </appender>
    <root level="WARN">
      <appender-ref ref="ASYNC_APP"/>
    </root>
  </springProfile>

</configuration>
```
