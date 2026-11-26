# 05. 8 SPI Customizer Interfaces, `@CustomEndpoint` & `@ServiceOverride` (`0.1.0`)

> **Languages**: **English** | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [All 20 Languages](../README.md) | [Complete Manual](../../GUIDE_EN.md) | [20-Language Interactive Portal](../../index.html#customizers)

---

## 1. Non-Invasive SPI Extension Interfaces (`8` Customizers)

All extension hooks under `io.github.natswarchuan.customization.customizer` expose `interface` `default` methods allowing selective Spring Bean overrides without modifying framework internals:

| # | SPI Interface | Context DTO | Extension Scope |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Core bean container, `TaskExecutor`, task scheduling |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` prompts, vector hooks, RAG pipelines |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Custom RBAC evaluators, OAuth2 claim mappings, masking rules |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Dynamic JPA Criteria hooks, multi-datasource & tenant routing |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Distributed locks, Resilience4j circuit breakers, retry & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook HMAC signing, WebSocket STOMP, outbound REST interceptors |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Custom endpoints, GraphQL extensions & i18n customization |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` bucket policies, pre-signed URLs & upload limits |

Active registered beans across the `7` core telemetry groups (`CustomizerGroupConstant`) inspect cleanly via `GET /api/v1/system/customizers` (`StorageCustomizer` is managed separately via `StorageCustomizerRegistryHelper`).


> **Active Runtime Interceptor vs. Metadata/Telemetry Hooks (`0.1.0`):** `SecurityIdentityCustomizer` is actively invoked on every request by `SecurityFilterChainBridge` and `SecurityAuthorityDecisionHelper` (custom JWT/ABAC authority augmentation & voting). The other `7` `*Customizer` SPIs register context metadata & telemetry descriptors exposed via `GET /api/v1/system/customizers` and `StorageCustomizerRegistryHelper`.

---

## 2. Custom Domain Routing (`@CustomEndpoint`) & Escape Hatch (`@ServiceOverride`)

### Custom Domain Endpoint via `@CustomEndpoint`

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

### Method-Level Escape Hatch via `@ServiceOverride`

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

## 3. Outbound HTTP Client (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` dispatches outbound HTTP calls via its default Java 21 `java.net.http.HttpClient` mode or optional Spring 6 `RestClient` (`RestClientConfig`), injecting `X-Request-ID`, W3C `traceparent`, and `tracestate` headers from active MDC context in both modes.
