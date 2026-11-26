# 05. ৮টি SPI Customizer ইন্টারফেস, `@CustomEndpoint` এবং `@ServiceOverride` (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল (EN)](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#customizers)

---

## 1. অ-আক্রমণাত্মক SPI এক্সটেনশন ইন্টারফেস (`8` Customizers)

`io.github.natswarchuan.customization.customizer`-এর অধীনে সব এক্সটেনশন হুক ইন্টারফেস `default` মেথড সরবরাহ করে, যাতে ফ্রেমওয়ার্কের ভেতরের কোড না বদলেই নির্দিষ্ট Spring Bean ওভাররাইড করা যায়:

| # | SPI ইন্টারফেস | কনটেক্সট DTO | এক্সটেনশন পরিসর |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | মূল বিন কনটেইনার, `TaskExecutor`, টাস্ক শিডিউলিং |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` প্রম্পট, ভেক্টর হুক, RAG পাইপলাইন |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | কাস্টম RBAC ইভ্যালুয়েটর, OAuth2 ক্লেম ম্যাপিং ও মাস্কিং নিয়ম |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | ডায়নামিক JPA Criteria হুক, মাল্টি-ডেটাসোর্স ও টেন্যান্ট রাউটিং |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | ডিস্ট্রিবিউটেড লক, Resilience4j সার্কিট ব্রেকার, রিট্রাই ও CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | ওয়েবহুক HMAC সাইনিং, WebSocket STOMP ও আউটবাউন্ড REST ইন্টারসেপ্টর |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | কাস্টম এন্ডপয়েন্ট, GraphQL এক্সটেনশন ও i18n কাস্টমাইজেশন |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` বাকেট নীতি, প্রি-সাইনড URL ও আপলোড সীমা |

`7`টি মূল টেলিমেট্রি গ্রুপের (`CustomizerGroupConstant`) সক্রিয় বিনগুলো `GET /api/v1/system/customizers`-এ দেখা যায় (`StorageCustomizer` আলাদাভাবে `StorageCustomizerRegistryHelper` পরিচালনা করে)।


> **সক্রিয় রানটাইম ইন্টারসেপ্টর বনাম মেটাডেটা/টেলিমেট্রি হুক (`0.1.0`):** `SecurityIdentityCustomizer` প্রতিটি অনুরোধে সক্রিয়ভাবে চলে; বাকি `7`টি `*Customizer` `GET /api/v1/system/customizers`-এ মেটাডেটা ও টেলিমেট্রি নিবন্ধন করে।

---

## 2. কাস্টম ডোমেইন রাউটিং (`@CustomEndpoint`) ও এস্কেপ হ্যাচ (`@ServiceOverride`)

### `@CustomEndpoint` দিয়ে কাস্টম ডোমেইন এন্ডপয়েন্ট

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

### `@ServiceOverride` দিয়ে মেথড-স্তরের এস্কেপ হ্যাচ

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

## 3. আউটবাউন্ড HTTP ক্লায়েন্ট (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` ডিফল্ট Java 21 `java.net.http.HttpClient` বা ঐচ্ছিক Spring 6 `RestClient` (`RestClientConfig`) মোডে বহির্গামী HTTP কল পাঠায় এবং উভয় মোডেই সক্রিয় MDC থেকে `X-Request-ID`, W3C `traceparent` ও `tracestate` হেডার যুক্ত করে।
