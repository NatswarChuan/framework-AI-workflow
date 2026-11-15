# 01. Khởi Động Nhanh, Kiến Trúc Hai Thư Mục & Chẩn Đoán Fail-Fast (`1.0.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/01_GETTING_STARTED.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. Cấu Trúc Hai Thư Mục Domain (`entity/` & `controller/`)

Ứng dụng Spring Boot dùng **`io.github.natswarchuan:spring-nwvmc:1.0.0`** chỉ cần hai thư mục domain chính:

1. `entity/`: JPA Entity kế thừa `BaseAuditEntity`, khai báo Bean Validation (`jakarta.validation.constraints.*`), chỉ mục database và các annotation khai báo (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Marker interface gắn `@AutoRestController` kế thừa `AutoApiController<E>`.

Mọi nghiệp vụ vượt ra ngoài CRUD chuẩn đều được tách vào `Service` interface + `Helper` (`@AutoService` / `@AutoComponent`, `public final class`, không có hàm `private` hay hàm `static` trong Helper) và gắn kết qua `@CustomEndpoint` hoặc `@ServiceOverride`.

---

## 2. Cấu Hình Maven & Gradle (`pom.xml` / `build.gradle.kts`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

Nếu tích hợp trực tiếp từ GitHub qua [JitPack](https://jitpack.io):

```xml
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
    <version>v1.0.0</version>
  </dependency>
</dependencies>
```

---

## 3. Cấu Hình Chuẩn Production (`application.yml`)

Framework đóng gói sẵn `META-INF/spring-configuration-metadata.json` (qua `spring-boot-configuration-processor`) giúp IDE gợi ý toàn bộ `app.framework.*` và `spring-nwvmc.human-policies`:

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
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. Lọc Endpoint Theo Phạm Vi (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` đối chiếu tên phương thức trên `AutoApiController<E>` hoặc nhóm chức năng (`READ`, `WRITE`, `DELETE`, `BATCH`, `ANALYTICS`, `EXPORT`, `AI`, `STREAM`, `SCHEMA`, `SUB_RESOURCE`) không phân biệt hoa/thường:

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

## 5. Bảng Chẩn Đoán Khởi Động Fail-Fast (`StartupDiagnosticsUtil` & `EntityFailFastValidatorUtil`)

| Ngoại Lệ | Điều Kiện Kiểm Tra | Cách Khắc Phục |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` phát hiện JVM `< 21` | Chạy trên Java 21 LTS trở lên |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` và khóa `jwt-secret` nhỏ hơn `32` byte UTF-8 | Đặt `${JWT_SECRET}` tối thiểu `32` byte |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` hoặc `maxPageSize < 1` | Cấu hình giá trị nguyên dương trong `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` hoặc `ComputedFieldFailFastUtil` phát hiện Entity thiếu `@Id`, thiếu no-arg constructor hoặc cấu hình `@ComputedField` sai | Kế thừa `BaseAuditEntity`, khai báo `@NoArgsConstructor` và đúng tên trường nguồn |
