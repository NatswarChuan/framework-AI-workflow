# 05. 8 SPI-интерфейсов Customizer, `@CustomEndpoint` и `@ServiceOverride` (`0.1.0`)

> **Языки**: **Русский** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [Все 20 языков](../README.md) | [Полное руководство (EN)](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#customizers)

---

## 1. Неинвазивные SPI-интерфейсы расширения (`8` Customizer)

Все точки расширения в `io.github.natswarchuan.customization.customizer` предоставляют `default`-методы интерфейсов для выборочного переопределения через Spring-бины без правки ядра фреймворка:

| # | SPI-интерфейс | DTO контекста | Область расширения |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | Контейнер бинов ядра, `TaskExecutor`, планировщик задач |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Промпты Spring AI `ChatClient`, векторные хуки, RAG-конвейеры |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | Пользовательские RBAC-оценщики, маппинг OAuth2 claims и правила маскирования |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | Динамические JPA Criteria хуки, мульти-БД и маршрутизация арендаторов |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | Распределённые блокировки, Resilience4j circuit breaker, повторы и CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | HMAC-подпись вебхуков, WebSocket STOMP и исходящие REST-перехватчики |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | Пользовательские эндпоинты, расширения GraphQL и настройка i18n |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | Политики бакетов `LOCAL`/`S3`/`GCS`, предподписанные URL и лимиты загрузки |

Активные бины по `7` основным группам телеметрии (`CustomizerGroupConstant`) просматриваются через `GET /api/v1/system/customizers` (`StorageCustomizer` управляется отдельно через `StorageCustomizerRegistryHelper`).


> **Активный runtime-перехватчик и хуки метаданных/телеметрии (`0.1.0`):** `SecurityIdentityCustomizer` активно вызывается на каждом запросе (`SecurityFilterChainBridge` и `SecurityAuthorityDecisionHelper`); остальные `7` регистрируют дескрипторы метаданных и телеметрии для `GET /api/v1/system/customizers`.

---

## 2. Бизнес-маршрутизация (`@CustomEndpoint`) и обход (`@ServiceOverride`)

### Пользовательский доменный эндпоинт через `@CustomEndpoint`

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

### Точечный обход на уровне метода через `@ServiceOverride`

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

## 3. Исходящий HTTP-клиент (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper` выполняет исходящие HTTP-запросы через режим по умолчанию Java 21 `java.net.http.HttpClient` или Spring 6 `RestClient` (`RestClientConfig`), передавая `X-Request-ID`, W3C `traceparent` и `tracestate` из активного MDC в обоих режимах.
