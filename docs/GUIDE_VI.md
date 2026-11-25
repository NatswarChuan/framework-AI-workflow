# Spring-NWVMC `0.1.0` — Tài Liệu Tham Chiếu Kỹ Thuật (Tiếng Việt)

> **Tọa Độ Artifact**: `io.github.natswarchuan:spring-nwvmc:0.1.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`  
> **Nền Tảng Runtime**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **Chuyên Đề Chi Tiết**: [Khởi Động](topics/01_GETTING_STARTED.md) · [40 Endpoints](topics/02_REST_API_CATALOG.md) · [Truy Vấn & GraphQL](topics/03_QUERY_AND_DATA_ACCESS.md) · [Bảo Mật, Metrics & i18n](topics/04_ADVANCED_ENTERPRISE_FEATURES.md) · [8 SPI Customizer](topics/05_SPRING_ECOSYSTEM_SPIS.md) · [60 Annotations](topics/06_DECLARATIVE_ANNOTATIONS.md)  
> **Ngôn Ngữ**: [English](GUIDE_EN.md) | Tiếng Việt | [日本語](GUIDE_JA.md) | [中文](GUIDE_ZH.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](index.html)

---

## 1. Kiến Trúc & Nguyên Lý Cốt Lõi

`controller-to-api-framework` gồm `591` tệp Java chính (`251` tệp kiểm thử, `569` unit test), `60` annotation `@interface` Pure Java (`54` trong `core/annotation/` + `6` trong `module/*/annotation/`, gồm `18` annotation RBAC từ Database), `9` capability interface có thể ghép nối (`AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`), `16` lớp `@AutoConfigurationBean` / `@ConfigurationProperties` (`18` nhóm cấu hình trong `META-INF/spring-configuration-metadata.json` trải trên `20` lớp `*Properties`), `21` gói ngôn ngữ (`classpath:i18n/messages*.properties`) và chỉ dẫn AOT trong `NwvmcRuntimeHintsRegistrar` (`META-INF/spring/aot.factories`).

- **Tách Biệt Domain (`entity/` & `controller/`)**: Ứng dụng tiêu thụ khai báo JPA Entity kế thừa `BaseAuditEntity` (tích hợp `@Version` Optimistic Locking trả `409 Conflict` khi xung đột và `JpaAssociationReferenceUtil` phân giải khóa ngoại từ JSON stub) và interface Controller kế thừa `AutoApiController<E>` hoặc các giao diện thành phần như `AutoReadApi<E>` không cần `import org.springframework.web.*` (hỗ trợ song song `@RequestBody`/`@RequestParam`/`@PathVariable` chuẩn Spring MVC và `@AutoRestController(readDto, createDto, updateDto)`). Trong toàn bộ framework, chỉ tầng AOT (`autoconfigure/`, `common/constant/AotConstant`, `common/util/AotRuntimeHintsUtil`) và metadata cấu hình (`config/properties/`) dùng `import org.springframework.*` (`10` dòng import tĩnh).
- **Điều Phối Hot-Path Bằng `MethodHandle`**: `MethodHandleCacheUtil` và `LambdaAccessorUtil` thay thế lời gọi reflection `Method.invoke` tại hot-path proxy và truy xuất thuộc tính thực thể.
- **Khóa Chính UUIDv7 (`UuidUtil.generateUuidV7`)**: Tuân thủ RFC 9562 tăng dần theo thời gian 48-bit, giữ cục bộ chỉ mục B-Tree khi ghi và phục vụ phân trang `/keyset` độ phức tạp $O(1)$.
- **Chuẩn Hóa Lỗi Toàn Diện**: `GlobalExceptionHandlerHelper`, `CustomContainerErrorController` (`/error`) và `ExceptionCauseUnwrapperUtil` ghi trọn stack trace ở log server, trả về `ApiResponse<Void>` an toàn kèm `X-Request-ID` (UUIDv7) và W3C `traceparent`.

---

## 2. Khởi Tạo Nhanh

### Maven, Gradle & JitPack

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

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
```

```xml
<!-- Cài đặt trực tiếp từ GitHub qua JitPack (không cần build local trước) -->
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
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String skuCode;

  @AutoSlug(sourceField = "productName")
  private String slug;

  @NotBlank
  private String productName;

  @PositiveOrZero
  private BigDecimal retailPrice;
}

// src/main/java/com/example/app/controller/ProductCatalogController.java
@AutoRestController(basePath = "/api/v1/product-catalogs")
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
      enabled: false                     # Mặc định khóa ở production (401/404 trên /system/studio*)
      demo-token-endpoint-enabled: false # Mặc định khóa ở production (404 trên /api/v1/auth/token)
      show-i18n-diagnostics: false
    storage:
      enabled: true
      provider: LOCAL
```

---

## 4. 40 Hợp Đồng REST/Stream/Schema Có Thể Ghép Nối (`38` Mặc Định Trên Swagger UI)

`AutoApiController<E>` kết hợp `9` capability interface (`AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) thành `AutoApiReadController<E>` (`15` hợp đồng đọc), `AutoWriteApi` + `AutoBatchApi` (`10` hợp đồng ghi/lô), `AutoApiEnterpriseController<E>` (`11` hợp đồng quy trình/AI/stream) và `AutoExportImportApi<E>` (`4` hợp đồng xuất/nhập CSV/JSONL). Controller chỉ đọc có thể kế thừa duy nhất `AutoReadApi<E>` (hoặc gắn `readDto = ProductReadDto.class` trên `@AutoRestController`):

- **Đọc, Thống Kê & Sinh Code Client (`AutoApiReadController` — `15`)**: `GET ""` (`getPage`, hỗ trợ `?expand=rel1,rel2`), `GET /keyset` (`getKeysetPage`, con trỏ 2 chiều `ASC`/`DESC` kèm `size+1` probe), `GET /all` (`getAll`, giới hạn bởi `max-unpaged-fetch-limit`), `GET /count` (`count`), `GET /exists` (`exists`), `GET /aggregate` (`aggregate`), `GET /distinct` (`findDistinctValues`), `GET /top` (`findTopRecords`), `GET /group-by` (`groupByAnalytics`), `GET /metadata` (`getMetadata`), `GET /schema/typescript` (`generateTypeScript`), `GET /schema/json` (`getJsonSchema`), `GET /schema/zod` (`generateZodSchema`), `GET /schema/client` (`generateTypedApiClient`), `GET /{id}` (`getById`, projection `?fields=` không làm đột biến entity gốc nhờ `EntityCloneSnapshotHelper`).
- **Ghi, Batch, Upsert, Patch & Khôi Phục (`AutoWriteApi` + `AutoBatchApi` — `10`)**: `POST ""` (`create`), `POST /batch` (`createBatch`), `POST /upsert` (`upsert`), `POST /upsert-batch` (`upsertBatch`), `POST /batch-chunked` (`batchChunked`), `PATCH /batch-update` (`updateBatchByFilter`), `PUT /{id}` (`update`, `@Version` Optimistic Locking trả `409 Conflict` khi phiên bản cũ), `PATCH /{id}` (`patch`), `DELETE /{id}` (`deleteById`), `POST /{id}/restore` (`restoreById`).
- **Doanh Nghiệp, Tăng/Giảm, AI, Patch RFC 6902 & Streaming (`AutoApiEnterpriseController` — `11`)**: `POST /{id}/transition` (`transitionState`), `POST /{id}/clone` (`cloneEntity`), `PATCH /{id}/increment` (`adjustNumericField`), `PATCH /{id}/patch-rfc6902` (`patchRfc6902`), `GET /{id}/diff` (`compareEntityDiff`), `GET /human-policy` (`getPolicySummary`), `GET /health` (`getEntityHealth`), `GET /events` (`@Hidden` `streamEvents`), `GET /{id}/**` (`navigateSubResources`, bật qua `enableNestedSubResources = true`), `GET /ai/context` (`getAiContext`), `POST /ai/query` (`queryAi`).
- **Xuất & Nhập CSV / JSONL (`AutoExportImportApi` — `4`)**: `GET /export/csv` (`exportCsv`), `GET /export/jsonl` (`exportJsonl`), `POST /import/csv` (`importCsv`), `POST /import/jsonl` (`importJsonl`).

---

## 5. Cơ Chế Thoát `@ServiceOverride`, `@CustomEndpoint` & Ejection MVC

1. **Ghi Đè Từng Hàm (`@ServiceOverride`)**: Gắn `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` lên phương thức trong interface Controller để `EscapeHatchDispatchHelper` gọi thẳng bean tùy biến bằng `MethodHandleCacheUtil`.
2. **Endpoint Nghiệp Vụ (`@CustomEndpoint`)**: Gắn trực tiếp lên interface để ủy quyền vào `@Component` Helper độc lập.
3. **Xuất Mã Chuẩn Spring MVC (`GET /system/studio/eject`)**: Gọi `GET /system/studio/eject?target=<EntityOrControllerName>` khi mở Studio để `ControllerEjectionHelper` xuất đầy đủ 5 tệp Java độc lập: `DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`.

---

## 6. Truy Vấn Động 13 Toán Tử, Guardrails & GraphQL

- **13 Toán Tử Lọc (`FilterOperatorConstant`)**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`.
- **Phòng Chống Tấn Công & DoS Query (`QueryFilterParameterUtil` & `QueryGuardrailEnforcerUtil`)**: Chặn SQLi/XSS qua regex, giới hạn độ sâu join (`max-join-depth=3`), số lượng tiêu chí lọc (`max-filter-criteria=25`), kích thước trang (`max-page-size=200`), trần truy vấn không phân trang (`max-unpaged-fetch-limit=5000`) và allowlist trường. `ConstraintViolationException` được ánh xạ sang `HTTP 409 Conflict`.
- **GraphQL Động (`GraphQLDynamicApiController`)**: Cung cấp `GET /api/v1/graphql/schema`, `POST /api/v1/graphql` (hỗ trợ `$variable`, wrapper `query { ... }`, introspection `__schema`/`__type` và projection không làm đột biến Cache) và `GET /api/v1/graphql/explorer` (`@Hidden`).

---

## 7. Bảo Mật, Resilience, Lưu Trữ & Giám Sát Micrometer

- **Kiểm Soát Truy Cập & RBAC Động Từ Database**: `@EntitySecurity` (RBAC + `ownerField`, hỗ trợ meta-annotation kết hợp như `@AuditedRecordSecurity`), `@FieldSecurity` (`maskPattern = "******"` hoặc trả `null`), `@MultiTenant` (fail-closed `403` khi thiếu tenant context không có bypass role, ghi đè chống giả mạo `tenantId` khi tạo, kiểm tra sở hữu trên mọi thao tác theo `id`), phân quyền động từ DB (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` kèm `@PermissionFieldMask`, ưu tiên `DENY` > `ALLOW`, ngữ cảnh `X-Tenant-ID`, tự động xóa cache Caffeine qua `DatabaseRbacCacheInvalidationListener`, cấu hình qua `app.framework.security.dynamic-database-rbac-enabled`), `SecurityIdentityCustomizer` (`customizeSecurityFilterChain`, `augmentSubjectAuthorities`, `evaluateCustomAuthorization`), và chung sống `SecurityFilterChain` không phá hủy qua `PureJavaSecurityFilterBridge`.
- **Đồng Thời, Cache & SPIs**: `@DistributedLock` (SPI `DistributedLockProvider` với mặc định Caffeine + `ReentrantLock` bảo vệ active mutex), `@Idempotent` (SPI `IdempotencyStoreProvider` + Caffeine atomic `compute`/`replace`, header `X-Idempotency-Key`, trả `409 ConflictBusinessException`), xóa cache chi tiết theo khóa entity (`@AutoCacheEvict(allEntries = false)`), `TransactionalOutboxHelper` (`PENDING -> PROCESSING` atomic claim), `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`.
- **Chỉ Số Micrometer (`DynamicEntityMetricsHelper` / `MetricConstant`, 11 metric)**: `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, `framework.outbox.dispatched.total`, `framework.realtime.active.connections` (kết nối SSE qua `SseEmitterRegistryHelper`), và `framework.datasource.routing.total` (counter tùy chọn gọi qua `recordDataSourceRouting`).
- **Lưu Trữ, Webhook & Time-Travel**: `FileStorageController` (`LOCAL` / `AWS S3` / `GCS`), `@EntityWebhook` ký HMAC-SHA256, `@PublishCloudEvent`, WebSocket `/ws-connect`, và `TimeTravelDynamicApiController` (`/api/v1/system/time-travel/{entityName}/{id}`).

---

## 8. Đa Ngôn Ngữ 20 Thứ Tiếng (`/system/studio` & Ứng Dụng Host)

- **20 Ngôn Ngữ Hỗ Trợ Sẵn (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (bộ 3 ngôn ngữ `ar`, `fa`, `ur` tự động bật giao diện phải sang trái `dir="rtl"`).
- **Thứ Tự Phân Giải Ngôn Ngữ (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**:
  1. Tham số `?lang=` trên URL (lưu vào cookie `NWVMC_LANG`)
  2. Tiêu đề HTTP `X-Language`
  3. Cookie `NWVMC_LANG`
  4. Tiêu đề HTTP `Accept-Language`
  5. Mặc định `app.framework.i18n.default-locale` (`en`). Mã không hợp lệ rơi về `en`.
- **Thanh Chẩn Đoán i18n (`show-i18n-diagnostics: true`)**: Hiển thị `#studioI18nDiagBar` trên `/system/studio` báo cáo locale, hướng LTR/RTL và khóa thiếu bản dịch.

---

## 9. Vi Chuẩn JMH `1.37` & Xuất CycloneDX SBOM

Kết quả đo thông lượng bằng `DynamicProxyThroughputBenchmarkTest` (`Mode.Throughput`, `ops/ms`):

| Phương Thức Vi Chuẩn | Thông Lượng Trung Bình |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

Sinh tệp CycloneDX `1.6` SBOM (`target/bom.json`, `128` thành phần):

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```

---

## 10. Tham Chiếu Nhanh 60 Annotations: Thuộc Tính, Giá Trị Mặc Định & Khi Nào Dùng

Để tra cứu chi tiết **toàn bộ 60 Annotation** (package, `@Target`, kiểu dữ liệu từng thuộc tính, giá trị mặc định, bắt buộc/tùy chọn, **cách dùng**, **khi nào nên dùng**, **khi nào không nên dùng & bẫy thường gặp** kèm ví dụ Java), xem **[Đặc Tả Toàn Diện 60 Annotations](topics/06_DECLARATIVE_ANNOTATIONS.md)** hoặc giao diện tương tác tại **[`index.html#annotations`](index.html#annotations)**. Bảng quyết định cho các annotation trọng yếu:

| Annotation | Package | Thuộc Tính & Giá Trị Mặc Định | Khi Nào Nên Dùng | Khi Nào KHÔNG Nên Dùng / Lưu Ý |
| :--- | :--- | :--- | :--- | :--- |
| `@AutoRestController` | `core.annotation` | `basePath=""`, `path=""`, `entityName=""`, `enabledEndpoints={}`, `disabledEndpoints={}`, `enableNestedSubResources=false`, `readDto/createDto/updateDto=Void.class` | Gắn lên Java `interface` kế thừa `AutoApiController<E>` hoặc `AutoReadApi<E>` để mở bộ API CRUD/phân tích không cần boilerplate. | KHÔNG gắn lên class `@RestController` thường hoặc endpoint không có JPA Entity; với danh mục công khai chỉ đọc hãy kế thừa `AutoReadApi<E>`. |
| `@ServiceOverride` | `core.annotation` | `targetBean=Void.class`, `beanName=""`, `methodName=""`, `bypassAutoDispatch=true` | Chuyển hướng riêng từng phương thức trong interface Controller sang Bean Spring xử lý nghiệp vụ tùy biến. | Không dùng để tạo URL mới hoàn toàn — hãy dùng `@CustomEndpoint`. Không truyền String vào `targetBean` (`targetBean` nhận `Class<?>`, String dùng `beanName`). |
| `@CustomEndpoint` | `core.annotation` | `path=""`, `httpMethod="GET"`, `delegateBean=""`, `delegateMethod=""`, `summary=""`, `description=""` | Endpoint hành động nghiệp vụ (`POST /checkout`, `POST /approve`) song hành cùng CRUD. | `delegateBean` phải khớp tên Spring `@Component`/`@Service` (không dùng `@AutoService` nội bộ); chạy trước `invokeProtectedOperation` nên bảo mật đặt trong bean đích. |
| `@EntitySecurity` | `core.annotation` | `readRoles={}`, `writeRoles={}`, `deleteRoles={}`, `permitAll=false`, `ownerField=""`, `bypassOwnerRoles={"ROLE_ADMIN","ROLE_SUPER_ADMIN"}`, `permissions={}` | Bảo vệ truy cập ở mức bản ghi (RBAC + cô lập dữ liệu theo chủ sở hữu `ownerField`). | `permitAll = true` bỏ qua kiểm tra vai trò trên **mọi** hàm CRUD (trừ khi có `@SecurityPolicyEntity`), nên danh mục công khai bắt buộc ghép với `AutoReadApi<E>` hoặc `disabledEndpoints`. |
| `@FieldSecurity` | `core.annotation` | `viewRoles={}`, `maskPattern="******"`, `nullifyInsteadOfMask=false` | Che mờ hoặc trả `null` các cột nhạy cảm (`phone`, `salary`, `taxId`) theo quyền người gọi. | Các kiểu khác `String` (`BigDecimal`, `LocalDate`) đã tự động được gán `null` bởi `FieldMaskingExecutionHelper`; bật `nullifyInsteadOfMask = true` khi muốn ép trường `String` về `null` thay vì `maskPattern`. |
| `@MultiTenant` | `core.annotation` | `tenantField="tenantId"`, `bypassTenantRoles={"ROLE_SUPER_ADMIN"}` | Hệ thống SaaS đa tenant (fail-closed `403` khi thiếu tenant context; chặn IDOR chéo tenant). | KHÔNG gắn lên bảng danh mục dùng chung toàn hệ thống (tiền tệ, quốc gia). |
| `@StateMachine` | `core.annotation` | `initial="ACTIVE"`, `transitions={}`, `deletableStates={}` | Thực thể có vòng đời trạng thái chặt chẽ (`Order`, `Payment`) và kiểm soát điều kiện xóa. | Không cần trên bảng danh mục tĩnh; luôn liệt kê rõ các trạng thái cho phép xóa trong `deletableStates`. |
| `@DistributedLock` | `module.lock.annotation` | `key=""`, `waitTimeMs=3000L`, `leaseTimeMs=5000L` | Chống race condition khi trừ kho SKU, số dư ví bằng khóa SpEL `key`. | Không để `key = ""` trên hàm tải cao nhiều thực thể; luôn dùng khóa hẹp như `"'sku:' + #skuCode"`. |
| `@Idempotent` | `core.annotation` | `headerName="X-Idempotency-Key"`, `ttlSeconds=300L` | Giao dịch thanh toán, tạo đơn tránh bấm đúp hoặc retry trùng lặp (`409` khi lặp khóa). | Không gắn trên API đọc `GET`; lưu ý client cần gửi `X-Idempotency-Key` khác rỗng. |
| `@RateLimit` | `core.annotation` | `requests=60`, `windowSeconds=60`, `partitionKey="IP"` | Giới hạn tần suất đăng nhập, xuất CSV, AI query theo `"IP"`, `"USER"`, `"TENANT"`, `"GLOBAL"` hoặc SpEL `#expr`. | Tránh dùng `"GLOBAL"` nếu cần cô lập từng user/tenant (`"USER"` tự fallback về IP cho khách chưa đăng nhập); trả `X-RateLimit-Remaining`, `X-RateLimit-Reset` và `Retry-After` khi `429`. |
| `@HttpCacheable` | `module.cache.http.annotation` | `maxAgeSeconds=60`, `isPrivate=false`, `mustRevalidate=true`, `generateETag=true` | Trả `Cache-Control` + weak ETag RFC 7232 (`W/"..."`) và `304 Not Modified`. | Không để `isPrivate = false` trên dữ liệu riêng tư từng User/Tenant để tránh CDN/Proxy trả nhầm cache. |
| `@SecurityRoleEntity` & 17 DB-RBAC | `core.annotation` | `cacheTtlSeconds=60L` (`@SecurityRoleEntity`/`@SecurityPermissionEntity`), `enabled=true` (`@SecurityUserRoleEntity`), `priority=100` (`@SecurityPolicyEntity`), 14 marker annotation | Phân quyền động lưu DB, che trường động và chính sách ưu tiên `DENY > ALLOW`. | Cả lỗi thiếu marker bắt buộc lẫn gắn trùng marker đơn trị trên > 1 thuộc tính đều bị `DatabaseRbacFailFastValidatorUtil` chặn fail-fast ngay khi boot. |

---

## 10. Bộ Kit Hướng Dẫn AI-Agent Toàn Diện (`ai-agent-kit/` & `llms.txt`)

> Hướng dẫn chi tiết: [07. Bộ Kit Hướng Dẫn AI-Agent](topics/07_AI_AGENT_ADOPTION_KIT.md) · Cổng tương tác: [`docs/index.html#ai-agent-kit`](index.html#ai-agent-kit) · Chỉ mục LLM: [`llms.txt`](../llms.txt)

Bộ **AI-Agent Adoption Kit** (`INTRO.md`, `RULES.md`, `SKILL.md`, `CHECKLIST.md`, 5 tài liệu tham chiếu sâu `references/01..05` kiểm chứng máy 1:1 và 8 tệp `adapters/`) giúp **mọi AI-Agent và mô hình LLM** (Antigravity/Gemini, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Windsurf, Cline/Roo Code, ChatGPT, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider) triển khai Spring-NWVMC `v0.1.0` chính xác ngay lần đầu:

```bash
# Windows (PowerShell)
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all

# macOS / Linux / Git Bash
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
```
