# 05. 8 SPI Customizer इंटरफ़ेस, `@CustomEndpoint` और `@ServiceOverride` (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#customizers)

---

## 1. गैर-आक्रामक SPI विस्तार इंटरफ़ेस (`8` Customizers)

`io.github.natswarchuan.customization.customizer` के अंतर्गत सभी एक्सटेंशन हुक इंटरफ़ेस `default` मेथड्स प्रदान करते हैं, जिससे फ़्रेमवर्क के आंतरिक कोड को बदले बिना Spring Bean ओवरराइड संभव होते हैं:

| # | SPI इंटरफ़ेस | संदर्भ DTO | विस्तार दायरा |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | कोर बीन कंटेनर, `TaskExecutor`, टास्क शेड्यूलिंग |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` प्रॉम्प्ट, वेक्टर हुक्स, RAG पाइपलाइन |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | कस्टम RBAC मूल्यांकनकर्ता, OAuth2 क्लेम मैपिंग और मास्किंग नियम |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | डायनामिक JPA Criteria हुक्स, मल्टी-डेटासोर्स और टेनेंट रूटिंग |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | डिस्ट्रिब्यूटेड लॉक, Resilience4j सर्किट ब्रेकर, रीट्राई और CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | वेबहुक HMAC साइनिंग, WebSocket STOMP और आउटबाउंड REST इंटरसेप्टर |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | कस्टम एंडपॉइंट्स, GraphQL एक्सटेंशन और i18n अनुकूलन |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` बकेट नीतियाँ, प्री-साइंड URL और अपलोड सीमाएँ |

`7` मुख्य टेलीमेट्री समूहों (`CustomizerGroupConstant`) के सक्रिय बीन्स `GET /api/v1/system/customizers` द्वारा देखे जा सकते हैं (`StorageCustomizer` को `StorageCustomizerRegistryHelper` अलग से प्रबंधित करता है)।


> **सक्रिय रनटाइम इंटरसेप्टर बनाम मेटाडेटा/टेलीमेट्री हुक्स (`0.1.0`):** `SecurityIdentityCustomizer` हर अनुरोध पर `SecurityFilterChainBridge` व `SecurityAuthorityDecisionHelper` द्वारा सक्रिय रूप से चलता है; शेष `7` `*Customizer` केवल मेटाडेटा/टेलीमेट्री विवरण पंजीकृत करते हैं।

---

## 2. कस्टम डोमेन रूटिंग (`@CustomEndpoint`) और एस्केप हैच (`@ServiceOverride`)

### `@CustomEndpoint` के माध्यम से कस्टम डोमेन एंडपॉइंट

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

### `@ServiceOverride` के माध्यम से मेथड-स्तरीय एस्केप हैच

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

## 3. आउटबाउंड HTTP क्लाइंट (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` डिफ़ॉल्ट Java 21 `java.net.http.HttpClient` या वैकल्पिक Spring 6 `RestClient` (`RestClientConfig`) मोड में बाहरी HTTP कॉल करता है और दोनों मोड में सक्रिय MDC से `X-Request-ID`, W3C `traceparent` और `tracestate` हेडर स्वचालित रूप से जोड़ता है।
