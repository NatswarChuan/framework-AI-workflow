# 05. 8 อินเทอร์เฟซ SPI Customizer, `@CustomEndpoint` และ `@ServiceOverride` (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์ (EN)](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#customizers)

---

## 1. อินเทอร์เฟซส่วนขยาย SPI แบบไม่รุกราน (`8` Customizers)

จุดขยายทั้งหมดภายใต้ `io.github.natswarchuan.customization.customizer` ใช้เมธอด `default` ของอินเทอร์เฟซ ทำให้ลงทะเบียน Spring Bean เพื่อปรับแต่งเฉพาะส่วนได้โดยไม่ต้องแก้โค้ดแกนกลาง:

| # | อินเทอร์เฟซ SPI | DTO บริบท | ขอบเขตการขยาย |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | คอนเทนเนอร์ Bean แกนกลาง, `TaskExecutor`, การตั้งเวลาทำงาน |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | พรอมต์ Spring AI `ChatClient`, เวกเตอร์ฮุก, ไปป์ไลน์ RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | ตัวประเมิน RBAC แบบกำหนดเอง, การแมป OAuth2 claim และกฎการปิดบังข้อมูล |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | ฮุก JPA Criteria ไดนามิก, หลายฐานข้อมูล และการแยกเส้นทางผู้เช่า |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Distributed Lock, Resilience4j Circuit Breaker, Retry และ CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | การลงนาม HMAC Webhook, WebSocket STOMP และตัวดักจับ REST ขาออก |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoint กำหนดเอง, ส่วนขยาย GraphQL และการปรับแต่ง i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | นโยบายบัคเก็ต `LOCAL`/`S3`/`GCS`, URL แบบลงนามล่วงหน้า และขีดจำกัดการอัปโหลด |

ตรวจสอบ Bean ที่ลงทะเบียนใน `7` กลุ่มเทเลเมทรีหลัก (`CustomizerGroupConstant`) ได้ที่ `GET /api/v1/system/customizers` (ส่วน `StorageCustomizer` จัดการแยกผ่าน `StorageCustomizerRegistryHelper`)


> **ตัวดักจับรันไทม์จริง vs. ฮุคเมทาดาทา/เทเลเมทรี (`0.1.0`):** `SecurityIdentityCustomizer` ทำงานจริงในทุกคำขอผ่าน `SecurityFilterChainBridge` และ `SecurityAuthorityDecisionHelper` ส่วนอีก `7` ตัวใช้ลงทะเบียนเมทาดาทาและเทเลเมทรีสำหรับ `GET /api/v1/system/customizers`

---

## 2. การกำหนดเส้นทางโดเมน (`@CustomEndpoint`) และทางออกฉุกเฉิน (`@ServiceOverride`)

### Endpoint เฉพาะโดเมนด้วย `@CustomEndpoint`

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

### ทางออกฉุกเฉินระดับเมธอดด้วย `@ServiceOverride`

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

## 3. ไคลเอนต์ HTTP ขาออก (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` ส่งคำขอ HTTP ขาออกผ่านโหมดเริ่มต้น Java 21 `java.net.http.HttpClient` หรือโหมดทางเลือก Spring 6 `RestClient` (`RestClientConfig`) โดยส่งต่อเฮดเดอร์ `X-Request-ID`, W3C `traceparent` และ `tracestate` จาก MDC อัตโนมัติทั้งสองโหมด
