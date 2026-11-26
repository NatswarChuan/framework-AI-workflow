# 05. 8 个 SPI Customizer 扩展接口、`@CustomEndpoint` 与 `@ServiceOverride`（`0.1.0`）

> **语言**: [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#customizers)

---

## 1. 无侵入 SPI 扩展接口（`8` 个 Customizer）

`io.github.natswarchuan.customization.customizer` 下的全部扩展钩子均采用 `interface` + `default` 方法，支持通过注册 Spring Bean 按需覆写而无需修改框架源码：

| # | SPI 接口 | 上下文 DTO | 扩展范围 |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | 核心 Bean 容器、`TaskExecutor` 与任务调度 |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` 提示词、向量检索钩子与 RAG 流水线 |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | 自定义 RBAC 评估器、OAuth2 声明映射与字段脱敏规则 |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | 动态 JPA Criteria 钩子、多数据源与多租户路由 |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | 分布式锁、Resilience4j 熔断器、重试与 CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook HMAC 签名、WebSocket STOMP 与出站 REST 拦截器 |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | 自定义端点、GraphQL 扩展与 i18n 定制 |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` 存储桶策略、预签名 URL 与上传大小限制 |

`7` 个核心遥测分组（`CustomizerGroupConstant`）已注册的 Bean 可通过 `GET /api/v1/system/customizers` 实时巡检（`StorageCustomizer` 由 `StorageCustomizerRegistryHelper` 独立管理）。


> **运行期拦截器与元数据/遥测钩子说明（`0.1.0`）：** `SecurityIdentityCustomizer` 会由 `SecurityFilterChainBridge` 与 `SecurityAuthorityDecisionHelper` 在每次请求中实时执行（自定义权限增强与 ABAC 投票）；其余 `7` 个 `*Customizer` 用于注册上下文元数据与遥测描述符，可通过 `GET /api/v1/system/customizers` 与 `StorageCustomizerRegistryHelper` 查询。

---

## 2. 自定义业务路由（`@CustomEndpoint`）与逃生舱（`@ServiceOverride`）

### 使用 `@CustomEndpoint` 声明自定义业务端点

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

### 使用 `@ServiceOverride` 实现方法级逃生舱

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

## 3. 出站 HTTP 客户端（`ThirdPartyRestClientHelper`）

`ThirdPartyRestClientHelper` 默认使用 Java 21 `java.net.http.HttpClient`，也可切换 Spring 6 `RestClient`（`RestClientConfig`），两种模式均自动从当前 MDC 注入 `X-Request-ID`、W3C `traceparent` 与 `tracestate` 请求头。
