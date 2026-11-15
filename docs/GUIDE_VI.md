# Spring-NWVMC `1.0.0` — Tài Liệu Tham Chiếu Kỹ Thuật (Tiếng Việt)

> **Tọa Độ Artifact**: `io.github.natswarchuan:spring-nwvmc:1.0.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v1.0.0`  
> **Nền Tảng Runtime**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **Chuyên Đề Chi Tiết**: [Khởi Động](topics/01_GETTING_STARTED.md) · [40 Endpoints](topics/02_REST_API_CATALOG.md) · [Truy Vấn & GraphQL](topics/03_QUERY_AND_DATA_ACCESS.md) · [Bảo Mật, Metrics & i18n](topics/04_ADVANCED_ENTERPRISE_FEATURES.md) · [8 SPI Customizer](topics/05_SPRING_ECOSYSTEM_SPIS.md) · [42 Annotations](topics/06_DECLARATIVE_ANNOTATIONS.md)  
> **Ngôn Ngữ**: [English](GUIDE_EN.md) | Tiếng Việt | [日本語](GUIDE_JA.md) | [中文](GUIDE_ZH.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](index.html)

---

## 1. Kiến Trúc & Nguyên Lý Cốt Lõi

`controller-to-api-framework` gồm `528` tệp Java chính, `42` annotation `@interface`, `20` lớp cấu hình `@ConfigurationProperties` kèm `META-INF/spring-configuration-metadata.json`, `21` gói ngôn ngữ (`classpath:i18n/messages*.properties`) và chỉ dẫn AOT trong `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`).

- **Tách Biệt Domain (`entity/` & `controller/`)**: Ứng dụng tiêu thụ khai báo JPA Entity kế thừa `BaseAuditEntity` và interface Controller kế thừa `AutoApiController<E>` không chứa `import org.springframework.web.*`. Trong toàn bộ framework, chỉ tầng AOT (`core/aot/`) và metadata cấu hình (`config/properties/`) dùng `import org.springframework.*` (`10` dòng import tĩnh).
- **Điều Phối Hot-Path Bằng `MethodHandle`**: `MethodHandleCacheUtil` và `LambdaAccessorUtil` thay thế lời gọi reflection `Method.invoke` tại hot-path proxy và truy xuất thuộc tính thực thể.
- **Khóa Chính UUIDv7 (`UuidUtil.generateUuidV7`)**: Tuân thủ RFC 9562 tăng dần theo thời gian 48-bit, giữ cục bộ chỉ mục B-Tree khi ghi và phục vụ phân trang `/keyset` độ phức tạp $O(1)$.
- **Chuẩn Hóa Lỗi Toàn Diện**: `GlobalExceptionHandlerHelper`, `CustomContainerErrorController` (`/error`) và `ExceptionCauseUnwrapperUtil` ghi trọn stack trace ở log server, trả về `ApiResponse<Void>` an toàn kèm `X-Request-ID` (UUIDv7) và W3C `traceparent`.

---

## 2. Khởi Tạo Nhanh

### Maven & Gradle

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

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:1.0.0")
}
```

### Mã Nguồn Hai Thư Mục Tối Thiểu

```java
// src/main/java/com/example/app/entity/ProductCatalog.java
@Entity
@Table(name = "tbl_product_catalog")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @AutoSlug(sourceField = "name")
  private String slug;

  @NotBlank
  private String name;

  @PositiveOrZero
  private BigDecimal unitPrice;
}

// src/main/java/com/example/app/controller/ProductCatalogController.java
@AutoRestController(path = "/api/v1/product-catalogs")
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 3. Thuộc Tính Cấu Hình (`app.framework.*`)

Gói `spring-boot-configuration-processor` sinh metadata cho phép IDE kiểm tra kiểu và gợi ý tự động toàn bộ thuộc tính:

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
      enabled: false                     # Mặc định khóa ở production (401 trên /system/studio*)
      demo-token-endpoint-enabled: false # Mặc định khóa ở production (404 trên /api/v1/auth/token)
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
    storage:
      enabled: true
      provider: LOCAL
```

---

## 4. 40 Hợp Đồng REST/Stream/Schema (`38` Mặc Định Trên Swagger UI)

`AutoApiController<E>` kế thừa `17` hợp đồng đọc (`AutoApiReadController<E>`), khai báo `11` hợp đồng ghi và kế thừa `12` hợp đồng doanh nghiệp (`AutoApiEnterpriseController<E>`):

- **Đọc, Thống Kê & Sinh Code Client (`17`)**: `GET ""`, `GET /keyset`, `GET /all`, `GET /count`, `GET /exists`, `GET /aggregate`, `GET /distinct`, `GET /top`, `GET /group-by`, `GET /export/csv`, `GET /export/jsonl`, `GET /metadata`, `GET /schema/typescript`, `GET /schema/json`, `GET /schema/zod`, `GET /schema/client`, `GET /{id}`.
- **Ghi, Batch, Upsert, Patch & Khôi Phục (`11`)**: `POST ""`, `POST /batch`, `POST /upsert`, `POST /upsert-batch`, `POST /batch-chunked`, `PATCH /{id}/increment`, `PATCH /batch-update`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `POST /{id}/restore`.
- **Doanh Nghiệp, AI, Patch RFC 6902 & Streaming (`12`)**: `POST /{id}/transition`, `POST /{id}/clone`, `GET /events` (`@Hidden` SSE stream), `GET /ai/context`, `POST /ai/query`, `GET /human-policy`, `GET /health`, `POST /import/csv`, `POST /import/jsonl`, `PATCH /{id}/patch-rfc6902`, `GET /{id}/diff`, `GET /{id}/**` (bật qua `enableNestedSubResources = true`).

---

## 5. Cơ Chế Thoát `@ServiceOverride`, `@CustomEndpoint` & Ejection MVC

1. **Ghi Đè Từng Hàm (`@ServiceOverride`)**: Gắn `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` lên phương thức trong interface Controller để `EscapeHatchDispatchHelper` gọi thẳng bean tùy biến bằng `MethodHandleCacheUtil`.
2. **Endpoint Nghiệp Vụ (`@CustomEndpoint`)**: Gắn trực tiếp lên interface để ủy quyền vào `@AutoComponent` Helper độc lập.
3. **Xuất Mã Chuẩn Spring MVC (`GET /system/studio/eject`)**: Gọi `GET /system/studio/eject?target=<EntityOrControllerName>` khi mở Studio để `ControllerEjectionHelper` xuất đầy đủ `Controller`, `Service`, `ServiceImpl`, `Repository`.

---

## 6. Truy Vấn Động 13 Toán Tử, Guardrails & GraphQL

- **13 Toán Tử Lọc (`FilterOperatorConstant`)**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`.
- **Phòng Chống Tấn Công & DoS Query (`QueryFilterParameterUtil` & `QueryGuardrailEnforcerUtil`)**: Chặn SQLi/XSS qua regex, giới hạn độ sâu join (`max-join-depth=3`), số lượng tiêu chí lọc (`max-filter-criteria=25`), kích thước trang (`max-page-size=200`) và allowlist trường.
- **GraphQL Động (`GraphQLDynamicApiController`)**: Cung cấp `GET /api/v1/graphql/schema`, `POST /api/v1/graphql` và `GET /api/v1/graphql/explorer` (`@Hidden`).

---

## 7. Bảo Mật, Resilience, Lưu Trữ & Giám Sát Micrometer

- **Kiểm Soát Truy Cập**: `@EntitySecurity` (RBAC + `ownerField`), `@FieldSecurity` (`maskPattern = "******"` hoặc trả `null`), `@MultiTenant`, `SecurityFilterChainBridge` (CORS `*` hỗ trợ `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`).
- **Đồng Thời & Chống Lỗi**: `@DistributedLock`, `@Idempotent` (`X-Idempotency-Key`, TTL `300L`), `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`.
- **Chỉ Số Micrometer (`DynamicEntityMetricsHelper` / `MetricConstant`)**: `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, `framework.datasource.routing.total`.
- **Lưu Trữ, Webhook & Time-Travel**: `FileStorageController` (`LOCAL` / `AWS S3` / `GCS`), `@EntityWebhook` ký HMAC-SHA256, `@PublishCloudEvent`, WebSocket `/ws-connect`, và `TimeTravelDynamicApiController` (`/api/v1/system/time-travel/{entityName}/{id}`).

---

## 8. Đa Ngôn Ngữ 20 Thứ Tiếng (`/system/studio` & Ứng Dụng Host)

- **20 Ngôn Ngữ Hỗ Trợ Sẵn (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (bộ 3 ngôn ngữ `ar`, `fa`, `ur` tự động bật giao diện phải sang trái `dir="rtl"`).
- **Thứ Tự Phân Giải Ngôn Ngữ (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**:
  1. Tham số `?lang=` trên URL (lưu vào cookie `NWVMC_LANG`)
  2. Cookie `NWVMC_LANG`
  3. Tiêu đề HTTP `X-Language`
  4. Tiêu đề HTTP `Accept-Language`
  5. Mặc định `app.framework.i18n.default-locale` (`en`). Mã không hợp lệ rơi về `en`.
- **Thanh Chẩn Đoán i18n (`show-i18n-diagnostics: true`)**: Hiển thị `#studioI18nDiagBar` trên `/system/studio` báo cáo locale, hướng LTR/RTL và khóa thiếu bản dịch.

---

## 9. Vi Chuẩn JMH `1.37` & Xuất CycloneDX SBOM

Kết quả đo thông lượng bằng `DynamicProxyThroughputBenchmarkTest` (`Mode.Throughput`, `ops/ms`):

| Phương Thức Vi Chuẩn | Thông Lượng Trung Bình |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |

Sinh tệp CycloneDX SBOM (`target/bom.json`):

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```
