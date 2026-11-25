# 05. 8 Antarmuka SPI Customizer, `@CustomEndpoint` & `@ServiceOverride` (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#spi-customizers)

---

## 1. Antarmuka Ekstensi SPI Non-Invasif (`8` Customizer)

Seluruh titik ekstensi di bawah `io.github.natswarchuan.customization.customizer` menyediakan metode `default` antarmuka sehingga Spring Bean dapat menimpa perilaku secara selektif tanpa menyentuh kode inti framework:

| # | Antarmuka SPI | Context DTO | Cakupan Ekstensi |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Kontainer bean inti, `TaskExecutor`, penjadwalan tugas |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompt Spring AI `ChatClient`, kait vektor, pipeline RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Evaluator RBAC khusus, pemetaan klaim OAuth2 & aturan masking |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Kait dinamis JPA Criteria, multi-datasource & perutean tenant |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Kunci terdistribusi, circuit breaker Resilience4j, retry & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Penandatanganan HMAC webhook, WebSocket STOMP & interceptor REST keluar |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoint kustom, ekstensi GraphQL & kustomisasi i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Kebijakan bucket `LOCAL`/`S3`/`GCS`, pre-signed URL & batas unggahan |

Bean aktif pada `7` grup telemetri utama (`CustomizerGroupConstant`) dapat diperiksa melalui `GET /api/v1/system/customizers` (`StorageCustomizer` dikelola terpisah oleh `StorageCustomizerRegistryHelper`).

---

## 2. Perutean Domain (`@CustomEndpoint`) & Jalur Keluar (`@ServiceOverride`)

### Endpoint Domain Kustom melalui `@CustomEndpoint`

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

### Jalur Keluar Tingkat Metode melalui `@ServiceOverride`

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

## 3. Klien HTTP Keluar (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` mengirim panggilan HTTP keluar lewat mode default Java 21 `java.net.http.HttpClient` atau Spring 6 `RestClient` opsional (`RestClientConfig`), menyisipkan header `X-Request-ID`, W3C `traceparent`, dan `tracestate` dari MDC aktif pada kedua mode.
