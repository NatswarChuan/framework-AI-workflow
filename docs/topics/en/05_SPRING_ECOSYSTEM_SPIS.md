# 05. 8 SPI Customizer Interfaces, `@CustomEndpoint` & Outbound HTTP

> **Language**: English | [Tiếng Việt](../05_SPRING_ECOSYSTEM_SPIS.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Non-Invasive SPI Extension Interfaces (`8` Customizers)

All extension hooks under `io.github.natswarchuan.customization.customizer` expose `default` interface methods allowing selective overrides as Spring Beans without modifying framework internals:

| # | SPI Interface | Context DTO | Extension Scope |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Core bean container, `TaskExecutor`, task scheduling |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` prompts, vector hooks, RAG pipelines |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Custom RBAC evaluators, OAuth2 claim mappings, masking rules |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Dynamic JPA Criteria hooks, multi-datasource & tenant routing |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Distributed locks, circuit breakers, retry & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook signing, WebSocket STOMP, outbound REST interceptors |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Custom endpoints, GraphQL extensions & i18n customization |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Storage bucket policies, pre-signed URLs & upload limits |

Active registered beans inspect cleanly via `GET /api/v1/system/customizers`.

---

## 2. Custom Domain Routing (`@CustomEndpoint`)

Declare `@CustomEndpoint` on domain interface methods extending `AutoApiController<E>` to dispatch requests directly to `@AutoService` / `@AutoComponent` `Helper` beans (zero `private` or `static` helper methods):

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

## 3. Outbound Integration (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` dispatches outbound HTTP calls reflectively via Spring 6 `RestClient` (or falls back to standard Java 21 `java.net.http.HttpClient`), forwarding `X-Request-ID` and W3C `traceparent` headers from active MDC context.
