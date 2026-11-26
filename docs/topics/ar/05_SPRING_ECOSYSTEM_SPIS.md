# 05. 8 واجهات SPI Customizer و`@CustomEndpoint` و`@ServiceOverride` (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل (EN)](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#customizers)

---

## 1. واجهات امتداد SPI غير تداخلية (`8` Customizers)

توفر جميع نقاط الامتداد تحت `io.github.natswarchuan.customization.customizer` دوال `default` ضمن واجهات تتيح التخصيص الانتقائي عبر Spring Beans دون تعديل نواة الإطار:

| # | واجهة SPI | نموذج السياق DTO | نطاق الامتداد |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | حاوية المكونات الأساسية، `TaskExecutor`، جدولة المهام |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | مطالبات Spring AI `ChatClient`، خطافات المتجهات ومسارات RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | مُقيّمات RBAC مخصصة، ربط مطالبات OAuth2 وقواعد الإخفاء |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | خطافات JPA Criteria الديناميكية وتعدد قواعد البيانات وتوجيه المستأجرين |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | الأقفال الموزعة، قواطع Resilience4j، إعادة المحاولة وCloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | توقيع HMAC للويب هوك، WebSocket STOMP ومعترضات REST الصادرة |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | نقاط النهاية المخصصة وامتدادات GraphQL وتخصيص i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | سياسات حاويات `LOCAL`/`S3`/`GCS` والروابط الموقعة مسبقًا وحدود الرفع |

يمكن فحص المكونات النشطة في مجموعات القياس الأساسية الـ `7` (`CustomizerGroupConstant`) عبر `GET /api/v1/system/customizers` (تُدار `StorageCustomizer` عبر `StorageCustomizerRegistryHelper`).


> **المعترض النشط مقابل خطافات البيانات الوصفية والقياس (`0.1.0`):** يعمل `SecurityIdentityCustomizer` فعليًا على كل طلب عبر `SecurityFilterChainBridge` و`SecurityAuthorityDecisionHelper`؛ بينما تسجل الواجهات الـ `7` الأخرى بيانات التعريف والقياس عبر `GET /api/v1/system/customizers`.

---

## 2. التوجيه المخصص للنطاق (`@CustomEndpoint`) ومخرج التخصيص (`@ServiceOverride`)

### نقطة نهاية نطاق مخصصة عبر `@CustomEndpoint`

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

### مخرج تخصيص على مستوى الدالة عبر `@ServiceOverride`

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

## 3. عميل HTTP الصادر (`ThirdPartyRestClientHelper`)

يرسل `ThirdPartyRestClientHelper` طلبات HTTP الصادرة عبر الوضع الافتراضي Java 21 `java.net.http.HttpClient` أو وضع Spring 6 `RestClient` الاختياري (`RestClientConfig`)، مع تمرير ترويسات `X-Request-ID` وW3C `traceparent` و`tracestate` من سياق MDC تلقائيًا في كلا الوضعين.
