# 05. 8 interfejsów SPI Customizer, `@CustomEndpoint` i `@ServiceOverride` (`0.1.0`)

> **Języki**: **Polski** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik (EN)](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#customizers)

---

## 1. Nieinwazyjne interfejsy rozszerzeń SPI (`8` Customizerów)

Wszystkie punkty rozszerzeń w `io.github.natswarchuan.customization.customizer` udostępniają metody `default` w interfejsach, umożliwiając selektywne nadpisywanie przez Spring Beany bez modyfikowania kodu frameworka:

| # | Interfejs SPI | Kontekst DTO | Zakres rozszerzeń |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Główny kontener beanów, `TaskExecutor`, harmonogram zadań |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompty Spring AI `ChatClient`, hooki wektorowe, potoki RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Własne ewaluatory RBAC, mapowanie claimów OAuth2 i reguły maskowania |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Dynamiczne hooki JPA Criteria, wiele baz danych i routing tenantów |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Blokady rozproszone, wyłączniki Resilience4j, ponowienia i CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Podpisywanie HMAC webhooków, WebSocket STOMP i interceptory REST |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Niestandardowe endpointy, rozszerzenia GraphQL i personalizacja i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Polityki bucketów `LOCAL`/`S3`/`GCS`, podpisane adresy URL i limity przesyłania |

Aktywne beany w `7` głównych grupach telemetrycznych (`CustomizerGroupConstant`) można podejrzeć pod `GET /api/v1/system/customizers` (`StorageCustomizer` jest zarządzany przez `StorageCustomizerRegistryHelper`).


> **Aktywny interceptor runtime vs. hooki metadanych/telemetrii (`0.1.0`):** `SecurityIdentityCustomizer` jest aktywnie wywoływany przy każdym żądaniu (`SecurityFilterChainBridge` i `SecurityAuthorityDecisionHelper`); pozostałe `7` rejestruje deskryptory metadanych i telemetrii w `GET /api/v1/system/customizers`.

---

## 2. Routing domenowy (`@CustomEndpoint`) i furtka (`@ServiceOverride`)

### Niestandardowy endpoint domenowy z `@CustomEndpoint`

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

### Furtka na poziomie metody z `@ServiceOverride`

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

## 3. Wychodzący klient HTTP (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` wysyła żądania HTTP w domyślnym trybie Java 21 `java.net.http.HttpClient` lub opcjonalnie przez Spring 6 `RestClient` (`RestClientConfig`), przekazując w obu trybach nagłówki `X-Request-ID`, W3C `traceparent` i `tracestate` z aktywnego MDC.
