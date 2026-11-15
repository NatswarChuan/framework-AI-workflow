# 01. Triển Khai Nhanh, Quy Tắc 2 Thư Mục & Chẩn Đoán Fail-Fast

> **Ngôn ngữ**: Tiếng Việt | [English](en/01_GETTING_STARTED.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. Kiến Trúc Cố Định 2 Thư Mục (`entity/` & `controller/`)

Ứng dụng Spring Boot sử dụng **Spring-NWVMC `v0.0.2`** chỉ tổ chức hai thư mục Domain chính:

1. `entity/`: Các lớp JPA Entity kế thừa `BaseAuditEntity`, cấu hình Validation (`jakarta.validation.constraints.*`), chỉ mục database và chú thích khai báo (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`).
2. `controller/`: Các Interface đánh dấu `@AutoRestController` kế thừa `AutoApiController<E>`.

Khi phát sinh nghiệp vụ phức tạp vượt ngoài CRUD chuẩn (giao dịch sổ kép, đối soát batch liên domain, quy trình nhiều bước), tách thành Service Interface kèm lớp Helper (`public final class`, `@AutoService` / `@AutoComponent`, 100% phương thức `public`, không có `private` method, không có `static` helper method) và ủy quyền qua `@CustomEndpoint`.

---

## 2. Cài Đặt Maven & JitPack (`pom.xml`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.0.2</version>
  </dependency>
</dependencies>
```

---

## 3. Cấu Hình `application.yml` Chuẩn Hóa

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    base-path-prefix: /api/v1
    default-page-size: 20
    max-page-size: 100
    eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET:Enterprise-Strong-HS512-Key-Must-Be-At-Least-32-Bytes-Long!}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # Bật true chỉ ở môi trường dev/staging
      demo-token-endpoint-enabled: false # Bật true chỉ khi cần cấp phát JWT thử nghiệm
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. Tùy Biến Bật / Tắt Tuyến Đường (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` đối chiếu không phân biệt hoa thường với tên phương thức trên `AutoApiController<E>` hoặc mã nhóm chức năng (`READ`, `WRITE`, `DELETE`, `BATCH`, `ANALYTICS`, `EXPORT`, `AI`, `STREAM`, `SCHEMA`, `SUB_RESOURCE`).

```java
@AutoRestController(
    path = "/api/v1/commercial-products",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface CommercialProductController extends AutoApiController<CommercialProduct> {
}
```

---

## 5. Bảng Chẩn Đoán Khởi Động Fail-Fast (`StartupDiagnosticsUtil` & `JavaVersionGuardUtil`)

| Ngoại Lệ | Điều Kiện Kiểm Tra | Hành Động Sửa Lỗi |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` phát hiện JVM `< 21` | Nâng cấp runtime lên Java 21 LTS trở lên |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` và khóa tùy chỉnh `< 32` byte UTF-8 | Đặt `${JWT_SECRET}` tối thiểu 32 ký tự |
| `InvalidConfigurationException` | `defaultPageSize <= 0` hoặc `defaultPageSize > maxPageSize` (`@Max(200)`) | Chỉnh `default-page-size <= max-page-size` trong phạm vi `1..200` |
| `InvalidConfigurationException` | `jwtExpirationSeconds <= 0` hoặc `heartbeatSeconds <= 0` | Đặt giá trị nguyên dương cho TTL JWT và SSE heartbeat |
| `InvalidConfigurationException` (`error.configuration.entity`) | `DeveloperFriendlyDiagnosticsHelper` phát hiện Entity thiếu `@Id` hoặc thiếu no-arg constructor | Kế thừa `BaseAuditEntity` hoặc bổ sung `@Id` + `@NoArgsConstructor` |
