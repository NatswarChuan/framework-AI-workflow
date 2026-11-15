# Rule 18: Chuẩn Spring Security 6 (Stateless JWT & Phân Quyền RBAC)

Tài liệu này quy chuẩn bắt buộc việc áp dụng và triển khai bảo mật theo kiến trúc hiện đại nhất của **Spring Security 6.x** & **Spring Boot 3.x**, bảo đảm kiến trúc phi trạng thái (Stateless), an toàn tuyệt đối và triệt tiêu toàn bộ mã lỗi thời.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Chuẩn Hóa Theo Spring Security 6.x Tiên Tiến**:
   - 100% sử dụng **`SecurityFilterChain`** bean.
   - ❌ **TUYỆT ĐỐI CẤM** sử dụng `WebSecurityConfigurerAdapter` hoặc các API cũ đã bị Deprecated.
2. **Kiến Trúc Phi Trạng Thái (Stateless Session)**:
   - Cấu hình bắt buộc: `SessionCreationPolicy.STATELESS`.
   - Vô hiệu hóa CSRF cho các REST API phi trạng thái: `csrf(AbstractHttpConfigurer::disable)`.
3. **Phân Quyền Khai Báo (Declarative RBAC)**:
   - Kích hoạt bảo mật phương thức qua `@EnableMethodSecurity(prePostEnabled = true)`.
   - Sử dụng `@PreAuthorize("hasRole('ADMIN')")` hoặc `@PreAuthorize("hasAuthority('user:write')")`.
4. **Xử Lý Lỗi Xác Thực & Phân Quyền Chuẩn Hóa**:
   - HTTP 401 Unauthorized: Bắt qua `CustomAuthenticationEntryPoint` trả về `ApiResponse<Void>`.
   - HTTP 403 Forbidden: Bắt qua `CustomAccessDeniedHandler` trả về `ApiResponse<Void>`.
5. **Triệt Tiêu Magic String**:
   - 100% tên Role, Permission, và Endpoint bảo mật phải khai báo trong **`SecurityConstant.java`**.

---

## 2. LỚP HẰNG SỐ BẢO MẬT (`SecurityConstant.java`)

```java
package com.enterprise.app.common.constant;

/**
 * Hằng số bảo mật hệ thống Spring Security.
 */
public final class SecurityConstant {

  private SecurityConstant() {
    throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
  }

  public static final String AUTH_HEADER = "Authorization";
  public static final String TOKEN_PREFIX = "Bearer ";
  public static final int TOKEN_PREFIX_LENGTH = 7;

  // Vai trò hệ thống (Role-Based Access Control)
  public static final String ROLE_ADMIN = "ROLE_ADMIN";
  public static final String ROLE_USER = "ROLE_USER";
  public static final String ROLE_MANAGER = "ROLE_MANAGER";

  // Quyền hạn chi tiết (Permissions)
  public static final String PERM_READ = "user:read";
  public static final String PERM_WRITE = "user:write";
  public static final String PERM_DELETE = "user:delete";

  // Đường dẫn công khai
  public static final String PATH_AUTH_PREFIX = "/api/v1/auth/**";
  public static final String PATH_ACTUATOR_HEALTH = "/actuator/health";
  public static final String PATH_API_DOCS = "/v3/api-docs/**";
  public static final String PATH_SWAGGER = "/swagger-ui/**";
}
```

---

## 3. CẤU HÌNH BẢO MẬT CHUẨN (`SecurityConfig.java`)

```java
package com.enterprise.app.config;

import com.enterprise.app.common.constant.SecurityConstant;
import com.enterprise.app.filter.JwtAuthenticationFilter;
import com.enterprise.app.handler.CustomAccessDeniedHandler;
import com.enterprise.app.handler.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Cấu hình bảo mật ứng dụng với Spring Security 6.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final CustomAuthenticationEntryPoint authenticationEntryPoint;
  private final CustomAccessDeniedHandler accessDeniedHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(final HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable);
    http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.exceptionHandling(exceptions -> {
      exceptions.authenticationEntryPoint(authenticationEntryPoint);
      exceptions.accessDeniedHandler(accessDeniedHandler);
    });

    http.authorizeHttpRequests(authorize -> authorize
        .requestMatchers(SecurityConstant.PATH_AUTH_PREFIX).permitAll()
        .requestMatchers(SecurityConstant.PATH_ACTUATOR_HEALTH).permitAll()
        .requestMatchers(SecurityConstant.PATH_API_DOCS, SecurityConstant.PATH_SWAGGER).permitAll()
        .anyRequest().authenticated()
    );

    http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
```
