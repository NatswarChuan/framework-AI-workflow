# 05. 8 Interface SPI Tùy Biến, `@CustomEndpoint` & `@ServiceOverride` (`0.1.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/05_SPRING_ECOSYSTEM_SPIS.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md)

---

## 1. 8 Interface SPI Mở Rộng Không Xâm Lấn (`*Customizer`)

Mọi điểm mở rộng trong `io.github.natswarchuan.customization.customizer` dùng `interface` kèm phương thức `default`, cho phép đăng ký Spring Bean chọn lọc mà không sửa mã nguồn lõi:

| # | SPI Interface | Context DTO | Phạm Vi Tùy Biến |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Container Bean, `TaskExecutor`, lập lịch |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompt Spring AI `ChatClient`, Vector Store, RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Evaluator RBAC, ánh xạ claim OAuth2, luật masking |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Hook JPA Criteria, định tuyến đa datasource & multi-tenant |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Khóa phân tán, Resilience4j Circuit Breaker, Retry & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Ký Webhook HMAC, WebSocket STOMP, interceptor HTTP outbound |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoint tùy biến, mở rộng GraphQL & i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Chính sách bucket `LOCAL`/`S3`/`GCS`, pre-signed URL |

Kiểm tra danh sách bean thuộc 7 nhóm `*Customizer` chuẩn (`CustomizerGroupConstant`) qua `GET /api/v1/system/customizers` (`StorageCustomizer` được quản lý riêng qua `StorageCustomizerRegistryHelper`).

---

## 2. Endpoint Tùy Biến (`@CustomEndpoint`) & Thoát Proxy (`@ServiceOverride`)

### `@CustomEndpoint` Cho Nghiệp Vụ Đặc Thù

```java
@AutoRestController(basePath = "/api/v1/advanced-enterprise")
public interface AdvancedEnterpriseBusinessController extends AutoApiController<CustomerOrder> {

  @CustomEndpoint(
      path = "/checkout-cart",
      httpMethod = "POST",
      delegateBean = "advancedOrderCheckoutHelper",
      delegateMethod = "checkoutCart",
      summary = "Checkout customer cart atomically"
  )
  ApiResponse<CustomerOrder> checkoutCart(@Valid @AutoBody CartCheckoutRequestDto request);
}
```

### `@ServiceOverride` Ghi Đè Một Contract Sinh Tự Động

```java
@AutoRestController(basePath = "/api/v1/tags")
public interface TagController extends AutoApiController<Tag> {

  @ServiceOverride(
      targetBean = TagEscapeHatchHelper.class,
      methodName = "buildTaxonomyStats",
      bypassAutoDispatch = true
  )
  @AutoGet("/showcase/escape-hatch-stats")
  ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
}
```

---

## 3. HTTP Client Outbound (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` gọi HTTP ra bên ngoài qua chế độ Java 21 `java.net.http.HttpClient` mặc định hoặc tùy chọn Spring `RestClient` (`RestClientConfig`), đồng thời chèn `X-Request-ID`, W3C `traceparent` và `tracestate` từ SLF4J MDC trên cả hai chế độ.
