# 05. 8 Interfaces SPI Customizer, `@CustomEndpoint` e `@ServiceOverride` (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#spi-customizers)

---

## 1. Interfaces de Extensão SPI Não Invasivas (`8` Customizers)

Todos os ganchos sob `io.github.natswarchuan.customization.customizer` expõem métodos `default` de interface, permitindo sobrescritas seletivas via Spring Beans sem alterar o núcleo do framework:

| # | Interface SPI | Context DTO | Escopo de Extensão |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Contêiner principal de beans, `TaskExecutor` e agendamento de tarefas |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompts Spring AI `ChatClient`, hooks vetoriais e pipelines RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Avaliadores RBAC customizados, mapeamento de claims OAuth2 e regras de mascaramento |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Hooks dinâmicos JPA Criteria, múltiplos datasources e roteamento de tenants |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Bloqueios distribuídos, circuit breakers Resilience4j, retentativas e CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Assinatura HMAC de webhooks, WebSocket STOMP e interceptadores REST de saída |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoints customizados, extensões GraphQL e personalização i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Políticas de buckets `LOCAL`/`S3`/`GCS`, URLs pré-assinadas e limites de upload |

Beans ativos registrados nos `7` grupos principais de telemetria (`CustomizerGroupConstant`) são consultados via `GET /api/v1/system/customizers` (`StorageCustomizer` é gerenciado via `StorageCustomizerRegistryHelper`).

---

## 2. Roteamento de Domínio (`@CustomEndpoint`) e Escape Hatch (`@ServiceOverride`)

### Endpoint de Domínio Personalizado via `@CustomEndpoint`

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

### Escape Hatch em Nível de Método via `@ServiceOverride`

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

## 3. Cliente HTTP de Saída (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` despacha chamadas HTTP de saída usando o modo padrão Java 21 `java.net.http.HttpClient` ou Spring 6 `RestClient` (`RestClientConfig`), propagando `X-Request-ID`, W3C `traceparent` e `tracestate` a partir do MDC ativo em ambos os modos.
