# 05. ۸ اینترفیس SPI Customizer، `@CustomEndpoint` و `@ServiceOverride` (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل (EN)](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#customizers)

---

## 1. اینترفیس‌های توسعه غیرتهاجمی SPI (`8` Customizer)

تمامی نقاط توسعه زیر `io.github.natswarchuan.customization.customizer` متدهای `default` ارائه می‌دهند تا بدون دست‌کاری هسته فریم‌ورک بتوانید با ثبت Spring Bean رفتار دلخواه را بازنویسی کنید:

| # | اینترفیس SPI | DTO زمینه | حوزه توسعه |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | کانتینر اصلی بین‌ها، `TaskExecutor` و زمان‌بندی وظایف |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | پرامپت‌های Spring AI `ChatClient`، قلاب‌های برداری و خطوط RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | ارزیاب‌های سفارشی RBAC، نگاشت OAuth2 claim و قواعد پنهان‌سازی |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | قلاب‌های پویا JPA Criteria، چند پایگاه داده و مسیریابی مستأجر |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | قفل‌های توزیع‌شده، مدارشکن Resilience4j، تلاش مجدد و CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | امضای HMAC وب‌هوک‌ها، WebSocket STOMP و رهگیرهای REST خروجی |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | مسیرهای سفارشی، توسعه‌های GraphQL و بومی‌سازی i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | سیاست‌های باکت `LOCAL`/`S3`/`GCS`، نشانی‌های پیش‌امضاشده و سقف آپلود |

بین‌های فعال در `7` گروه تله‌متری اصلی (`CustomizerGroupConstant`) از طریق `GET /api/v1/system/customizers` قابل مشاهده‌اند (`StorageCustomizer` جداگانه توسط `StorageCustomizerRegistryHelper` مدیریت می‌شود).


> **رهگیر فعال زمان اجرا در برابر هوک‌های فراداده/تله‌متری (`0.1.0`):** `SecurityIdentityCustomizer` در هر درخواست به‌صورت فعال توسط `SecurityFilterChainBridge` و `SecurityAuthorityDecisionHelper` اجرا می‌شود؛ `7` رابط دیگر توصیف‌گرهای فراداده و تله‌متری را در `GET /api/v1/system/customizers` ثبت می‌کنند.

---

## 2. مسیریابی سفارشی دامنه (`@CustomEndpoint`) و مسیر جایگزین (`@ServiceOverride`)

### مسیر دامنه سفارشی با `@CustomEndpoint`

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

### جایگزینی در سطح متد با `@ServiceOverride`

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

## 3. کلاینت HTTP خروجی (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` تماس‌های HTTP خروجی را با حالت پیش‌فرض Java 21 `java.net.http.HttpClient` یا حالت اختیاری Spring 6 `RestClient` (`RestClientConfig`) ارسال می‌کند و در هر دو حالت سرآیندهای `X-Request-ID`، W3C `traceparent` و `tracestate` را از MDC فعال منتقل می‌نماید.
