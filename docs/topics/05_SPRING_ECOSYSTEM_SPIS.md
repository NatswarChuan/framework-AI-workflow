# 05. 8 Interface SPI Tùy Biến, `@CustomEndpoint` & `@ServiceOverride` (`1.0.0`)

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

Kiểm tra danh sách bean đang kích hoạt qua `GET /api/v1/system/customizers`.

---

## 2. Endpoint Tùy Biến (`@CustomEndpoint`) & Thoát Proxy (`@ServiceOverride`)

### `@CustomEndpoint` Cho Nghiệp Vụ Đặc Thù

```java
@AutoRestController(path = "/api/v1/advanced-enterprise")
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
@AutoRestController(path = "/api/v1/tags")
public interface TagController extends AutoApiController<Tag> {

  @ServiceOverride(
      beanName = "tagCustomOverrideService",
      methodName = "getCustomTagStats",
      bypassAutoDispatch = true
  )
  @AutoGet("/showcase/escape-hatch-stats")
  ApiResponse<String> getCustomTagStats();
}
```

---

## 3. HTTP Client Outbound (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` gọi HTTP ra bên ngoài qua Spring `RestClient` hoặc fallback chuẩn Java 21 `java.net.http.HttpClient`, tự động truyền tiếp `X-Request-ID` và W3C `traceparent` từ SLF4J MDC.
