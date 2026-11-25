# 01. Khởi Động Nhanh, Kiến Trúc Hai Thư Mục & Chẩn Đoán Fail-Fast (`0.1.0`)

> **Ngôn ngữ**: [English](../en/01_GETTING_STARTED.md) | **Tiếng Việt** | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Đủ 20 Ngôn Ngữ](../README.md) | [Cẩm Nang Đầy Đủ](../../GUIDE_VI.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](../../index.html#quickstart)

---

## 1. Cấu Trúc Hai Thư Mục Domain (`entity/` & `controller/`)

Ứng dụng Spring Boot dùng **`io.github.natswarchuan:spring-nwvmc:0.1.0`** chỉ cần hai thư mục domain chính:

1. `entity/`: JPA Entity kế thừa `BaseAuditEntity` (tích hợp UUIDv7 và `@Version` Optimistic Locking), khai báo Bean Validation (`jakarta.validation.constraints.*`), chỉ mục database và các annotation khai báo (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Marker interface gắn `@AutoRestController` kế thừa `AutoApiController<E>` hoặc các capability interface thành phần như `AutoReadApi<E>` (hỗ trợ cả `@RequestBody`/`@RequestParam`/`@PathVariable` chuẩn Spring).

Mọi nghiệp vụ vượt ra ngoài CRUD chuẩn đều được tách vào `Service` interface + `Helper` (`@Service` / `@Component` của Spring, `public final class`, không có hàm `private` hay hàm `static` trong Helper; `@AutoService` / `@AutoComponent` chỉ quét gói `"io.github.natswarchuan"`, và thêm `@EntityScan` nếu gói Entity nằm ngoài `io.github.natswarchuan`, `com.example`, `io.github`) và gắn kết qua `@CustomEndpoint` hoặc `@ServiceOverride`.

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
    <version>0.1.0</version>
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
    <version>v0.1.0</version>
  </dependency>
</dependencies>
```

---

## 3. Cấu Hình Chuẩn Production (`application.yml`)

Framework đóng gói sẵn `META-INF/spring-configuration-metadata.json` (`18` nhóm cấu hình từ `16` lớp `@AutoConfigurationBean`/`@ConfigurationProperties` và `20` lớp `*Properties` dưới `app.framework.*` và `spring-nwvmc.human-policies`; các khóa tương thích cũ trên `ControllerToApiProperties` như `base-path-prefix`, `default-page-size`, `max-page-size`, `eager-fetch-singular-relations` chỉ phục vụ kiểm tra lúc boot, còn định tuyến dùng `@AutoRestController(basePath = ...)` và giới hạn truy vấn dùng `app.framework.query-guardrails.*`):

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
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
```

---

## 4. Lọc Endpoint Theo Phạm Vi (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` đối chiếu chính xác tên phương thức trên `AutoApiController<E>` không phân biệt hoa/thường (`equalsIgnoreCase(methodName)` như `batchChunked`, `deleteById`, `importCsv`):

```java
@AutoRestController(
    basePath = "/api/v1/commercial-products",
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
