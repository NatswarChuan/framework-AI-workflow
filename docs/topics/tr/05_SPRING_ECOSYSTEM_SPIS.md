# 05. 8 SPI Customizer Arayüzü, `@CustomEndpoint` ve `@ServiceOverride` (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#spi-customizers)

---

## 1. Müdahalesiz SPI Genişletme Arayüzleri (`8` Customizer)

`io.github.natswarchuan.customization.customizer` altındaki tüm genişletme noktaları `interface` `default` metotları sunar; böylece çekirdek kodu değiştirmeden yalnızca ilgili Spring Bean’ler geçersiz kılınabilir:

| # | SPI Arayüzü | Context DTO | Genişletme Kapsamı |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Çekirdek bean kapsayıcısı, `TaskExecutor`, görev zamanlama |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` istemleri, vektör kancaları, RAG boru hatları |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Özel RBAC değerlendiricileri, OAuth2 claim eşlemeleri ve maskeleme kuralları |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Dinamik JPA Criteria kancaları, çoklu veri kaynağı ve kiracı yönlendirmesi |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Dağıtık kilitler, Resilience4j devre kesiciler, yeniden denemeler ve CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook HMAC imzalama, WebSocket STOMP ve giden REST kesiciler |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Özel uç noktalar, GraphQL eklentileri ve i18n özelleştirmesi |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` kova politikaları, ön imzalı URL’ler ve yükleme sınırları |

`7` çekirdek telemetri grubundaki (`CustomizerGroupConstant`) etkin bean’ler `GET /api/v1/system/customizers` üzerinden incelenebilir (`StorageCustomizer`, `StorageCustomizerRegistryHelper` tarafından ayrı yönetilir).

---

## 2. Alan Yönlendirmesi (`@CustomEndpoint`) ve Çıkış Kapısı (`@ServiceOverride`)

### `@CustomEndpoint` ile Özel Alan Uç Noktası

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

### `@ServiceOverride` ile Metot Düzeyinde Çıkış Kapısı

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

## 3. Giden HTTP İstemcisi (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper`, giden HTTP çağrılarını varsayılan Java 21 `java.net.http.HttpClient` veya isteğe bağlı Spring 6 `RestClient` (`RestClientConfig`) moduyla yürütür ve her iki modda da etkin MDC’den `X-Request-ID`, W3C `traceparent` ve `tracestate` başlıklarını otomatik aktarır.
