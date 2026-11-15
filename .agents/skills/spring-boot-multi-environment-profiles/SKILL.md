---
name: spring-boot-multi-environment-profiles
description: >-
  Kích hoạt kỹ năng này khi thiết lập, phân tách hoặc tối ưu hóa cấu hình hệ thống cho nhiều môi trường
  (local, dev, test, staging, prod) thông qua Spring Profiles, thiết lập @ConfigurationProperties theo profile,
  khởi tạo Bean theo môi trường với @Profile, hoặc cấu hình logback theo môi trường trong Java Spring Boot.
---

# Kỹ Năng: Thiết Lập Cấu Hình Đa Môi Trường Qua Spring Profiles

Kỹ năng này hướng dẫn quy trình từng bước xây dựng hạ tầng cấu hình đa môi trường (**Multi-Environment Architecture**) cho hệ thống Java Spring Boot doanh nghiệp, bảo đảm cách ly hoàn toàn dữ liệu, tối ưu tài nguyên và bảo vệ tuyệt đối bí mật hệ thống trên từng môi trường.

---

## 1. QUY TRÌNH THỰC HIỆN TỪNG BƯỚC (STEP-BY-STEP WORKFLOW)

```
[ BƯỚC 1: Khởi Tạo ProfileConstant ] ──► (Định nghĩa hằng số: LOCAL, DEV, TEST, STAGING, PROD)
         │
         ▼
[ BƯỚC 2: Thiết Lập application.yml ] ──► (Base config, jackson, port, active profile fallback)
         │
         ▼
[ BƯỚC 3: Phân Tách File Theo Môi Trường ] ──► (application-local.yml, application-dev.yml, application-prod.yml)
         │
         ▼
[ BƯỚC 4: Ràng Buộc @ConfigurationProperties ] ──► (Metadata processor, fail-fast validation @Validated)
         │
         ▼
[ BƯỚC 5: Đăng Ký Bean Phụ Thuộc Môi Trường ] ──► (@Profile(ProfileConstant.LOCAL_OR_DEV) vs @Profile(ProfileConstant.STAGING_OR_PROD))
         │
         ▼
[ BƯỚC 6: Cấu Hình Logging Phân Tầng ] ──► (<springProfile> trong logback-spring.xml)
```

---

## 2. CODE TRIỂN KHAI MẪU

### Bước 1: Khởi Tạo Lớp Hằng Số Môi Trường (`ProfileConstant.java`)
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

  // Biểu thức tổ hợp môi trường
  public static final String NOT_PROD = "!prod";
  public static final String LOCAL_OR_DEV = "local | dev";
  public static final String STAGING_OR_PROD = "staging | prod";
}
```

---

### Bước 2: Thiết Lập Các Tập Tin Cấu Hình YAML

#### 1. Cấu hình cơ sở (`application.yml`)
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

#### 2. Môi trường phát triển cá nhân (`application-local.yml`)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/enterprise_local
    username: postgres
    password: postgres_local_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

app:
  payment:
    provider: mock
    api-key: mock_key_for_local_testing_only
```

#### 3. Môi trường kiểm thử tự động CI/CD (`application-test.yml`)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: false

app:
  payment:
    provider: mock
    api-key: test_mock_key
```

#### 4. Môi trường vận hành sản xuất (`application-prod.yml`)
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
    hikari:
      pool-name: EnterpriseHikariPool
      maximum-pool-size: ${DB_POOL_MAX:50}
      minimum-idle: ${DB_POOL_MIN_IDLE:10}
      idle-timeout: 300000
      max-lifetime: 1800000
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

app:
  payment:
    provider: stripe
    api-key: ${STRIPE_LIVE_API_KEY}

springdoc:
  api-docs:
    enabled: false
  swagger-ui:
    enabled: false
```

---

### Bước 3: Đăng Ký Bean Phụ Thuộc Môi Trường Bằng `@Profile`

#### Interface Dịch Vụ:
```java
package com.enterprise.app.service;

import com.enterprise.app.dto.EmailDispatchDto;

/**
 * Hợp đồng gửi email thông báo hệ thống.
 */
public interface EmailSenderService {

  /**
   * Điều phối gửi email tới người nhận.
   *
   * @param dispatchDto thông tin nội dung và người nhận
   */
  void sendEmail(EmailDispatchDto dispatchDto);
}
```

#### Khai Báo Lớp Hằng Số Ghi Log Email (`EmailLogConstant.java`):
```java
package com.enterprise.app.common.constant;

/**
 * Hằng số thông điệp log phân hệ Email đa môi trường.
 */
public final class EmailLogConstant {

  private EmailLogConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String START_MOCK_DISPATCH = "Starting mock email dispatch to recipient={}";
  public static final String FINISH_MOCK_DISPATCH = "Finished mock email dispatch for recipient={}";
  public static final String START_SES_DISPATCH = "Starting AWS SES live email dispatch to recipient={}";
  public static final String FINISH_SES_DISPATCH = "Finished AWS SES live email dispatch for recipient={}";
}
```

---

#### Triển Khai Cho Local/Dev (Ghi Log Không Tốn Chi Phí):
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.EmailLogConstant;
import com.enterprise.app.common.constant.ProfileConstant;
import com.enterprise.app.dto.EmailDispatchDto;
import com.enterprise.app.service.EmailSenderService;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Dịch vụ gửi email giả lập (in log) cho môi trường Local và Dev.
 */
@Slf4j
@Service
@Profile(ProfileConstant.LOCAL_OR_DEV)
public class MockEmailSenderServiceImpl implements EmailSenderService {

  @Override
  public void sendEmail(final EmailDispatchDto dispatchDto) {
    Objects.requireNonNull(dispatchDto);
    log.info(EmailLogConstant.START_MOCK_DISPATCH, dispatchDto.getRecipientEmail());

    // Giả lập gửi thành công, không gọi SMTP server bên ngoài
    log.info(EmailLogConstant.FINISH_MOCK_DISPATCH, dispatchDto.getRecipientEmail());
  }
}
```

---

#### Triển Khai Cho Staging/Production (Gửi Qua AWS SES):
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.EmailLogConstant;
import com.enterprise.app.common.constant.ProfileConstant;
import com.enterprise.app.dto.EmailDispatchDto;
import com.enterprise.app.service.EmailSenderService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * Dịch vụ gửi email thực tế qua AWS Simple Email Service cho môi trường Staging và Prod.
 */
@Slf4j
@Service
@Profile(ProfileConstant.STAGING_OR_PROD)
@RequiredArgsConstructor
public class AwsSesEmailSenderServiceImpl implements EmailSenderService {

  private final AmazonSimpleEmailService amazonSimpleEmailService;

  @Override
  public void sendEmail(final EmailDispatchDto dispatchDto) {
    Objects.requireNonNull(dispatchDto);
    log.info(EmailLogConstant.START_SES_DISPATCH, dispatchDto.getRecipientEmail());

    // Thực thi gửi qua AWS SES client...
    log.info(EmailLogConstant.FINISH_SES_DISPATCH, dispatchDto.getRecipientEmail());
  }
}
```

---

## 3. LỆNH VẬN HÀNH THEO PROFILE

- **Chạy cục bộ bằng Maven**:
  ```bash
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
  ```
- **Chạy file JAR trên Production**:
  ```bash
  java -jar -Dspring.profiles.active=prod -DSPRING_DATASOURCE_URL=... enterprise-service.jar
  ```
- **Kiểm thử tự động bằng Maven**:
  ```bash
  ./mvnw test -Dspring.profiles.active=test
  ```
