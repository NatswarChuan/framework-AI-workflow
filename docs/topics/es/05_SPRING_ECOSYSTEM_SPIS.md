# 05. 8 Interfaces SPI Customizer, `@CustomEndpoint` y `@ServiceOverride` (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Los 20 Idiomas](../README.md) | [Manual Completo](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#spi-customizers)

---

## 1. Interfaces de Extensión SPI No Invasivas (`8` Customizers)

Todos los puntos de extensión bajo `io.github.natswarchuan.customization.customizer` exponen métodos `default` en interfaces para personalizar selectivamente mediante Spring Beans sin modificar el núcleo del framework:

| # | Interfaz SPI | Context DTO | Ámbito de Extensión |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Contenedor principal de beans, `TaskExecutor` y planificación de tareas |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Prompts Spring AI `ChatClient`, hooks vectoriales y pipelines RAG |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Evaluadores RBAC personalizados, mapeo de claims OAuth2 y reglas de enmascaramiento |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Hooks dinámicos JPA Criteria, múltiples datasources y enrutamiento de tenants |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Bloqueos distribuidos, circuit breakers Resilience4j, reintentos y CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Firma HMAC de webhooks, WebSocket STOMP e interceptores REST salientes |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Endpoints personalizados, extensiones GraphQL y personalización i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Políticas de buckets `LOCAL`/`S3`/`GCS`, URLs prefirmadas y límites de carga |

Los beans activos registrados en los `7` grupos principales de telemetría (`CustomizerGroupConstant`) se inspeccionan en `GET /api/v1/system/customizers` (`StorageCustomizer` se gestiona por separado mediante `StorageCustomizerRegistryHelper`).

---

## 2. Enrutamiento de Dominio (`@CustomEndpoint`) y Vía de Escape (`@ServiceOverride`)

### Endpoint de Dominio Personalizado con `@CustomEndpoint`

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

### Vía de Escape a Nivel de Método con `@ServiceOverride`

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

## 3. Cliente HTTP Saliente (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` envía peticiones HTTP salientes mediante su modo por defecto Java 21 `java.net.http.HttpClient` o Spring 6 `RestClient` (`RestClientConfig`), inyectando automáticamente `X-Request-ID`, W3C `traceparent` y `tracestate` desde el MDC activo en ambos modos.
