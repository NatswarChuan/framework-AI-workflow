# 05. 8 Giao Diện SPI Customizer, `@CustomEndpoint` & Kết Nối Ngoài

> **Ngôn ngữ**: Tiếng Việt | [English](en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tổng hợp](../GUIDE_VI.md)

---

## 1. Kiến Trúc Mở Rộng Không Sửa Mã Nguồn Lõi (8 SPI Interfaces)

Toàn bộ các điểm mở rộng trong package `io.github.natswarchuan.customization.customizer` sử dụng `interface` kết hợp `default` method để triển khai từng phần theo nhu cầu dự án:

| # | SPI Interface | Context DTO | Phạm Vi Can Thiệp |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Core Container, `TaskExecutor`, bộ lập lịch tác vụ |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` prompt, Vector Store, quy trình RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Mở rộng RBAC, ánh xạ claim OAuth2, luật che mờ dữ liệu |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Can thiệp JPA Criteria, định tuyến multi-datasource & tenant |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Khóa phân tán, Circuit Breaker, Retry & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Ký Webhook, WebSocket STOMP, Interceptor gọi HTTP ngoài |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Custom Endpoint Registry, GraphQL SDL & mở rộng i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Cấu hình bucket, pre-signed URL & quy tắc tải tệp |

Kiểm tra danh sách Bean Customizer đang nạp tại runtime: `GET /api/v1/system/customizers`.

---

## 2. Ủy Quyền Endpoint Nghiệp Vụ (`@CustomEndpoint`)

Gắn `@CustomEndpoint` trực tiếp lên phương thức tùy biến trong interface mở rộng `AutoApiController<E>` để trỏ về lớp `@AutoService` / `@AutoComponent` `Helper` (không dùng hàm `private` hay `static`):

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

---

## 3. Giao Tiếp Ngoài Qua `ThirdPartyRestClientHelper`

`ThirdPartyRestClientHelper` thực hiện lệnh gọi REST đồng bộ ra hệ thống đối tác qua Spring 6 `RestClient` (phản chiếu runtime) hoặc tự động dùng Java 21 `java.net.http.HttpClient`, bảo toàn truyền tiếp `X-Request-ID` và W3C `traceparent` qua MDC.
