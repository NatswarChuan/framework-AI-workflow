# 05. 8 SPI-Customizer-Interfaces, `@CustomEndpoint` & `@ServiceOverride` (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch (EN)](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#customizers)

---

## 1. Nicht-invasive SPI-Erweiterungsinterfaces (`8` Customizers)

Alle Erweiterungspunkte unter `io.github.natswarchuan.customization.customizer` bieten `interface`-`default`-Methoden für gezielte Spring-Bean-Überschreibungen ohne Eingriffe in den Framework-Kern:

| # | SPI-Interface | Kontext-DTO | Erweiterungsbereich |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Kern-Bean-Container, `TaskExecutor`, Aufgabenplanung |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring-AI-`ChatClient`-Prompts, Vektor-Hooks, RAG-Pipelines |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Eigene RBAC-Evaluatoren, OAuth2-Claim-Mappings, Maskierungsregeln |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Dynamische JPA-Criteria-Hooks, Multi-Datasource- & Tenant-Routing |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Verteilte Sperren, Resilience4j Circuit Breaker, Retries & CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook-HMAC-Signatur, WebSocket STOMP & ausgehende REST-Interceptoren |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Benutzerdefinierte Endpunkte, GraphQL-Erweiterungen & i18n-Anpassungen |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS`-Bucket-Richtlinien, Pre-Signed URLs & Upload-Limits |

Aktive Beans der `7` Kern-Telemetriegruppen (`CustomizerGroupConstant`) lassen sich über `GET /api/v1/system/customizers` einsehen (`StorageCustomizer` wird separat über `StorageCustomizerRegistryHelper` verwaltet).


> **Aktiver Runtime-Interceptor vs. Metadaten-/Telemetrie-Hooks (`0.1.0`):** `SecurityIdentityCustomizer` wird bei jedem Request aktiv ausgeführt (`SecurityFilterChainBridge` & `SecurityAuthorityDecisionHelper`); die übrigen `7` registrieren Metadaten-/Telemetrie-Deskriptoren für `GET /api/v1/system/customizers`.

---

## 2. Fachspezifisches Routing (`@CustomEndpoint`) & Escape-Hatch (`@ServiceOverride`)

### Benutzerdefinierter Fach-Endpunkt mit `@CustomEndpoint`

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

### Methodenbezogener Escape-Hatch mit `@ServiceOverride`

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

## 3. Ausgehender HTTP-Client (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` sendet ausgehende HTTP-Anfragen standardmäßig über Java 21 `java.net.http.HttpClient` oder optional über Spring 6 `RestClient` (`RestClientConfig`) und überträgt in beiden Modi `X-Request-ID`, W3C `traceparent` und `tracestate` aus dem aktiven MDC.
