# 05. 8 SPI Customizer انٹرفیسز، `@CustomEndpoint` اور `@ServiceOverride` (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#spi-customizers)

---

## 1. غیر مداخلت کار SPI توسیعی انٹرفیسز (`8` Customizers)

`io.github.natswarchuan.customization.customizer` کے تحت تمام ایکسٹینشن ہکس `interface` `default` میتھڈز فراہم کرتے ہیں تاکہ فریم ورک کے اندرونی کوڈ کو چھیڑے بغیر Spring Bean اوور رائیڈ کیے جا سکیں:

| # | SPI انٹرفیس | Context DTO | توسیعی دائرہ کار |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | بنیادی بین کنٹینر، `TaskExecutor`، ٹاسک شیڈولنگ |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` پرامپٹس، ویکٹر ہکس، RAG پائپ لائنز |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | کسٹم RBAC ایویلیوئیٹرز، OAuth2 کلیم میپنگ اور ماسکنگ قواعد |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | ڈائنامک JPA Criteria ہکس، ملٹی ڈیٹاسورس اور ٹیننٹ روٹنگ |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | ڈسٹری بیوٹڈ لاکس، Resilience4j سرکٹ بریکرز، ری ٹرائی اور CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | ویب ہک HMAC سائننگ، WebSocket STOMP اور آؤٹ باؤنڈ REST انٹرسیپٹرز |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | کسٹم اینڈپوائنٹس، GraphQL توسیعات اور i18n تخصیص |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` بکٹ پالیسیاں، پری سائنڈ URLs اور اپ لوڈ حدود |

`7` بنیادی ٹیلی میٹری گروپس (`CustomizerGroupConstant`) کے فعال بینز `GET /api/v1/system/customizers` پر دیکھے جا سکتے ہیں (`StorageCustomizer` الگ سے `StorageCustomizerRegistryHelper` سنبھالتا ہے)۔

---

## 2. کسٹم ڈومین روٹنگ (`@CustomEndpoint`) اور متبادل راستہ (`@ServiceOverride`)

### `@CustomEndpoint` کے ذریعے کسٹم ڈومین اینڈپوائنٹ

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

### `@ServiceOverride` کے ذریعے میتھڈ لیول اوور رائیڈ

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

## 3. آؤٹ باؤنڈ HTTP کلائنٹ (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` ڈیفالٹ Java 21 `java.net.http.HttpClient` یا اختیاری Spring 6 `RestClient` (`RestClientConfig`) موڈ میں بیرونی HTTP کالز بھیجتا ہے اور دونوں موڈز میں فعال MDC سے `X-Request-ID`، W3C `traceparent` اور `tracestate` ہیڈرز خودکار شامل کرتا ہے۔
