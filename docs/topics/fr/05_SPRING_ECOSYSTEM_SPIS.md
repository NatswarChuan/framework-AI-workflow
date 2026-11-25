# 05. 8 Interfaces SPI Customizer, `@CustomEndpoint` et `@ServiceOverride` (`0.1.0`)

> **Langues**: **Français** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Les 20 Langues](../README.md) | [Manuel Complet](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#spi-customizers)

---

## 1. Interfaces d’Extension SPI Non Invasives (`8` Customizers)

Tous les points d’extension sous `io.github.natswarchuan.customization.customizer` exposent des méthodes `default` d’interface permettant des surcharges sélectives via Spring Beans sans toucher au cœur du framework :

| # | Interface SPI | Context DTO | Domaine d’Extension |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Conteneur principal de beans, `TaskExecutor` et planification des tâches |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompts Spring AI `ChatClient`, hooks vectoriels et pipelines RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Évaluateurs RBAC personnalisés, mappage de claims OAuth2 et règles de masquage |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Hooks dynamiques JPA Criteria, multi-datasources et routage multi-tenant |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Verrous distribués, disjoncteurs Resilience4j, retries et CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Signature HMAC des webhooks, WebSocket STOMP et intercepteurs REST sortants |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoints personnalisés, extensions GraphQL et personnalisation i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Politiques de buckets `LOCAL`/`S3`/`GCS`, URLs présignées et limites d’upload |

Les beans actifs des `7` groupes principaux de télémétrie (`CustomizerGroupConstant`) sont consultables via `GET /api/v1/system/customizers` (`StorageCustomizer` est géré séparément par `StorageCustomizerRegistryHelper`).

---

## 2. Routage Métier (`@CustomEndpoint`) et Porte de Sortie (`@ServiceOverride`)

### Endpoint Métier Personnalisé via `@CustomEndpoint`

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

### Porte de Sortie au Niveau Méthode via `@ServiceOverride`

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

## 3. Client HTTP Sortant (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` exécute les appels HTTP sortants via son mode par défaut Java 21 `java.net.http.HttpClient` ou Spring 6 `RestClient` (`RestClientConfig`), en injectant automatiquement `X-Request-ID`, W3C `traceparent` et `tracestate` depuis le MDC actif dans les deux modes.
