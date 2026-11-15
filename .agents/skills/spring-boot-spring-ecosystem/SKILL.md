---
name: spring-boot-spring-ecosystem
description: >-
  Kích hoạt kỹ năng này khi tích hợp hoặc chuẩn hóa các thành phần trong hệ sinh thái Spring Framework / Spring Boot:
  Spring Security (JWT stateless, SecurityFilterChain, RBAC), Spring Validation (Jakarta Validation, Custom Validator),
  Spring AI (ChatClient, VectorStore, RAG, PromptTemplate), Spring RestClient, Spring Events và Spring Observability.
---

# Kỹ Năng: Triển Khai Hệ Sinh Thái Spring Chuẩn Doanh Nghiệp (Spring Ecosystem Standards)

Kỹ năng này hướng dẫn quy trình từng bước áp dụng các tiêu chuẩn tiên tiến nhất của hệ sinh thái **Spring Boot 3.x** và **Spring Framework 6.x**, bao gồm **Spring Security**, **Spring Validation**, **Spring AI** và **Spring RestClient**, bảo đảm 100% tuân thủ toàn bộ các quy chuẩn kiến trúc và cú pháp khắt khe của dự án.

---

## 1. QUY TRÌNH TRIỂN KHAI TỪNG BƯỚC (STEP-BY-STEP WORKFLOW)

```
[ Bắt đầu Triển Khai ]
         │
         ▼
[ BƯỚC 1: Spring Security ] ─────► (SecurityFilterChain, JWT Filter, SecurityConstant, EntryPoint & AccessDeniedHandler)
         │
         ▼
[ BƯỚC 2: Spring Validation ] ───► (Jakarta @Valid, Custom ConstraintValidator độc lập, ValidationConstant, i18n messages)
         │
         ▼
[ BƯỚC 3: Spring AI ] ───────────► (ChatClient, VectorStore RAG, BeanOutputConverter, AiConstant, AiLogConstant)
         │
         ▼
[ BƯỚC 4: Spring RestClient ] ───► (RestClient hiện đại thay thế RestTemplate, timeout & connection pool)
         │
         ▼
[ BƯỚC 5: Spring Event-Driven ] ─► (ApplicationEventPublisher, @TransactionalEventListener sau commit)
         │
         ▼
[ Hoàn thành & Đối soát ]
```

---

## 2. CODE TRIỂN KHAI MẪU CHUẨN MỰC

### Bước 1: Triển Khai Spring Security Chuẩn Doanh Nghiệp

#### 1. Lớp Hằng Số Bảo Mật (`SecurityConstant.java`):
```java
package com.enterprise.app.common.constant;

/**
 * Tập hợp hằng số cấu hình phân hệ bảo mật Spring Security.
 */
public final class SecurityConstant {

  private SecurityConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String AUTH_HEADER = "Authorization";
  public static final String BEARER_PREFIX = "Bearer ";
  public static final int BEARER_PREFIX_LENGTH = 7;

  // Vai trò người dùng (Roles)
  public static final String ROLE_ADMIN = "ROLE_ADMIN";
  public static final String ROLE_USER = "ROLE_USER";

  // Đường dẫn công khai không yêu cầu xác thực
  public static final String PATH_AUTH = "/api/v1/auth/**";
  public static final String PATH_PUBLIC = "/api/v1/public/**";
  public static final String PATH_ACTUATOR_HEALTH = "/actuator/health";
  public static final String PATH_SWAGGER = "/swagger-ui/**";
  public static final String PATH_API_DOCS = "/v3/api-docs/**";
}
```

#### 2. Xử Lý Lỗi 401 Unauthorized (`CustomAuthenticationEntryPoint.java`):
```java
package com.enterprise.app.handler;

import com.enterprise.app.common.constant.ErrorConstant;
import com.enterprise.app.common.constant.HttpHeaderConstant;
import com.enterprise.app.common.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

/**
 * Xử lý tập trung các yêu cầu HTTP không được xác thực hợp lệ (Mã 401).
 */
@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final ObjectMapper objectMapper;

  @Override
  public void commence(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final AuthenticationException authException) throws IOException {

    response.setStatus(HttpStatus.UNAUTHORIZED.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setHeader(HttpHeaderConstant.HEADER_CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

    final ApiResponse<Void> errorResponse = ApiResponse.error(
        ErrorConstant.ERR_UNAUTHORIZED,
        authException.getMessage()
    );

    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
  }
}
```

---

### Bước 2: Triển Khai Spring Validation Tối Ưu i18n & Custom Validator

#### 1. Cấu Hình Validation Tập Trung (`ValidationConfig.java`):
```java
package com.enterprise.app.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

/**
 * Cấu hình liên kết LocalValidatorFactoryBean với Spring MessageSource hỗ trợ i18n tự động.
 */
@Configuration
public class ValidationConfig {

  @Bean
  @Primary
  public LocalValidatorFactoryBean validator(final MessageSource messageSource) {
    final LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
    factory.setValidationMessageSource(messageSource);
    return factory;
  }
}
```

#### 2. Lớp Hằng Số Validation (`ValidationConstant.java`):
```java
package com.enterprise.app.common.constant.validation;

/**
 * Hằng số kiểm tra ràng buộc dữ liệu đầu vào và nhãn trường i18n.
 */
public final class ValidationConstant {

  private ValidationConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String PHONE_REGEX = "^(0[3|5|7|8|9])+([0-9]{8})$";
  public static final String MSG_PHONE_INVALID = "{validation.phone.invalid}";
  public static final String MSG_PHONE_BLANK = "{validation.phone.blank}";
  public static final String LABEL_PHONE_NUMBER = "label.user.phone_number";
}
```

#### 3. Gom Nhóm Annotation Ràng Buộc & Validator Vào Cùng 1 Thư Mục (`validation/phone/`):
```java
// File 1: validation/phone/ValidPhoneNumber.java
package com.enterprise.app.validation.phone;

import com.enterprise.app.common.constant.validation.ValidationConstant;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = ValidPhoneNumberValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPhoneNumber {
  String message() default ValidationConstant.MSG_PHONE_INVALID;
  Class<?>[] groups() default {};
  Class<? extends Payload>[] payload() default {};
}
```

```java
// File 2: validation/phone/ValidPhoneNumberValidator.java
package com.enterprise.app.validation.phone;

import com.enterprise.app.common.constant.validation.ValidationConstant;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Objects;
import java.util.regex.Pattern;

public class ValidPhoneNumberValidator implements ConstraintValidator<ValidPhoneNumber, String> {
  public static final Pattern PHONE_PATTERN = Pattern.compile(ValidationConstant.PHONE_REGEX);

  @Override
  public boolean isValid(final String phoneNumber, final ConstraintValidatorContext context) {
    if (Objects.isNull(phoneNumber)) {
      return true;
    }
    return PHONE_PATTERN.matcher(phoneNumber).matches();
  }
}
```

#### 4. Sử Dụng Annotation Phụ `@ValidationArgs` Để Điền {0}, {1}... Vào Message Đa Ngôn Ngữ:
```java
package com.enterprise.app.model.request;

import com.enterprise.app.common.constant.validation.ValidationConstant;
import com.enterprise.app.validation.args.ValidationArgs;
import com.enterprise.app.validation.phone.ValidPhoneNumber;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegistrationRequest {

  @NotBlank(message = ValidationConstant.MSG_PHONE_BLANK)
  @ValidPhoneNumber(message = ValidationConstant.MSG_PHONE_INVALID)
  @ValidationArgs({ValidationConstant.LABEL_PHONE_NUMBER})
  private String phoneNumber;
}
```

---

### Bước 3: Triển Khai Spring AI Với ChatClient & Structured Output

#### 1. Lớp Hằng Số Spring AI (`AiConstant.java`):
```java
package com.enterprise.app.common.constant;

/**
 * Hằng số cấu hình phân hệ trí tuệ nhân tạo Spring AI.
 */
public final class AiConstant {

  private AiConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String SYSTEM_PROMPT = "Bạn là trợ lý dữ liệu khách hàng doanh nghiệp. Phân tích nội dung và trả về cấu trúc chính xác.";
  public static final int DEFAULT_MAX_TOKENS = 1000;
}
```

#### 2. Lớp Hằng Số Log Spring AI (`AiLogConstant.java`):
```java
package com.enterprise.app.common.constant;

/**
 * Hằng số ghi nhật ký cho các tác vụ trí tuệ nhân tạo.
 */
public final class AiLogConstant {

  private AiLogConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String START_AI_ANALYSIS = "Starting enterprise AI customer analysis for customerId={}";
  public static final String FINISH_AI_ANALYSIS = "Finished enterprise AI customer analysis for customerId={}";
}
```

#### 3. Dịch Vụ AI Phân Tích Khách Hàng (`CustomerAiInsightServiceImpl.java`):
```java
package com.enterprise.app.service.impl;

import com.enterprise.app.common.constant.AiConstant;
import com.enterprise.app.common.constant.AiLogConstant;
import com.enterprise.app.dto.CustomerAnalysisRequestDto;
import com.enterprise.app.dto.CustomerInsightResponseDto;
import com.enterprise.app.service.CustomerAiInsightService;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;

/**
 * Dịch vụ cung cấp thông tin phân tích khách hàng ứng dụng Spring AI ChatClient.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerAiInsightServiceImpl implements CustomerAiInsightService {

  private final ChatClient chatClient;

  @Override
  public CustomerInsightResponseDto analyzeCustomer(final CustomerAnalysisRequestDto requestDto) {
    Objects.requireNonNull(requestDto);
    log.info(AiLogConstant.START_AI_ANALYSIS, requestDto.getCustomerId());

    final BeanOutputConverter<CustomerInsightResponseDto> outputConverter =
        new BeanOutputConverter<>(CustomerInsightResponseDto.class);

    final CustomerInsightResponseDto result = chatClient.prompt()
        .system(AiConstant.SYSTEM_PROMPT)
        .user(requestDto.getFeedbackHistory())
        .call()
        .entity(outputConverter);

    log.info(AiLogConstant.FINISH_AI_ANALYSIS, requestDto.getCustomerId());
    return result;
  }
}
```

---

### Bước 4: Cấu Hình Spring RestClient Tiên Tiến (Thay thế RestTemplate)

```java
package com.enterprise.app.config;

import com.enterprise.app.common.constant.HttpHeaderConstant;
import java.time.Duration;
import org.springframework.boot.web.client.ClientHttpRequestFactories;
import org.springframework.boot.web.client.ClientHttpRequestFactorySettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * Khởi tạo Bean RestClient chuẩn Spring 6 hỗ trợ gọi HTTP bất đồng bộ và đồng bộ.
 */
@Configuration
public class EnterpriseRestClientConfig {

  @Bean
  public RestClient enterpriseRestClient() {
    final ClientHttpRequestFactorySettings settings = ClientHttpRequestFactorySettings.DEFAULTS
        .withConnectTimeout(Duration.ofSeconds(5))
        .withReadTimeout(Duration.ofSeconds(10));

    final ClientHttpRequestFactory requestFactory = ClientHttpRequestFactories.get(settings);

    return RestClient.builder()
        .requestFactory(requestFactory)
        .defaultHeader(HttpHeaderConstant.HEADER_ACCEPT, "application/json")
        .build();
  }
}
```

---

## 3. CHECKLIST ĐỐI SOÁT CHUẨN SPRING TRƯỚC KHI BÀN GIAO

- [ ] **Spring Security**:
  - [ ] Khai báo `SecurityFilterChain` bean, không dùng các class kế thừa cũ.
  - [ ] Session Stateless, có JWT filter, cấu hình 401 và 403 bọc `ApiResponse`.
  - [ ] Toàn bộ vai trò (`ROLE_...`) và endpoint nằm trong `SecurityConstant.java`.
- [ ] **Spring Validation**:
  - [ ] Có `@Valid` ở Controller parameters.
  - [ ] Custom Validator tách thành 2 file riêng biệt: annotation và class validator.
  - [ ] Regex và thông điệp lỗi 100% nằm trong `ValidationConstant.java`.
- [ ] **Spring AI**:
  - [ ] Sử dụng `ChatClient` hoặc `VectorStore` của Spring AI.
  - [ ] Kết quả trả về dùng `BeanOutputConverter<T>` strongly-typed.
  - [ ] Prompt và tham số trích xuất từ `AiConstant.java` và `AiLogConstant.java`.
- [ ] **Spring RestClient**:
  - [ ] 100% dùng `RestClient` hoặc `WebClient`, không dùng `RestTemplate`.
- [ ] **Nguyên Tắc Zero-Defect**:
  - [ ] 100% phương thức là `public`.
  - [ ] Không có `static inner class`, không `enum`, không `record`.
  - [ ] Không có `abstract class`.
