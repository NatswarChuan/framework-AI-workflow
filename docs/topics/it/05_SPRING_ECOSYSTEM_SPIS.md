# 05. 8 Interfacce SPI Customizer, `@CustomEndpoint` e `@ServiceOverride` (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo (EN)](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#customizers)

---

## 1. Interfacce di Estensione SPI Non Invasive (`8` Customizer)

Tutti i punti di estensione in `io.github.natswarchuan.customization.customizer` espongono metodi `default` di interfaccia, consentendo override selettivi tramite Spring Bean senza toccare il codice interno del framework:

| # | Interfaccia SPI | DTO Contesto | Ambito di Estensione |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Container bean principale, `TaskExecutor`, pianificazione task |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompt Spring AI `ChatClient`, hook vettoriali, pipeline RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Valutatori RBAC personalizzati, mappatura claim OAuth2 e regole di mascheramento |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Hook dinamici JPA Criteria, multi-datasource e routing tenant |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Lock distribuiti, circuit breaker Resilience4j, retry e CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Firma HMAC webhook, WebSocket STOMP e interceptor REST in uscita |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoint personalizzati, estensioni GraphQL e personalizzazione i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Policy bucket `LOCAL`/`S3`/`GCS`, URL prefirmati e limiti di upload |

I bean attivi nei `7` gruppi principali di telemetria (`CustomizerGroupConstant`) si ispezionano via `GET /api/v1/system/customizers` (`StorageCustomizer` è gestito separatamente da `StorageCustomizerRegistryHelper`).


> **Interceptor Attivo vs. Hook Metadati/Telemetria (`0.1.0`):** `SecurityIdentityCustomizer` viene eseguito attivamente a ogni richiesta (`SecurityFilterChainBridge` e `SecurityAuthorityDecisionHelper`); gli altri `7` registrano descrittori di metadati e telemetria per `GET /api/v1/system/customizers`.

---

## 2. Routing di Dominio (`@CustomEndpoint`) ed Escape Hatch (`@ServiceOverride`)

### Endpoint di Dominio Personalizzato tramite `@CustomEndpoint`

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

### Escape Hatch a Livello di Metodo tramite `@ServiceOverride`

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

## 3. Client HTTP in Uscita (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` invia chiamate HTTP esterne tramite la modalità predefinita Java 21 `java.net.http.HttpClient` o Spring 6 `RestClient` (`RestClientConfig`), propagando automaticamente `X-Request-ID`, W3C `traceparent` e `tracestate` dal MDC attivo in entrambe le modalità.
