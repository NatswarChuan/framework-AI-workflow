# 05. 8 つの SPI Customizer インターフェース、`@CustomEndpoint` および `@ServiceOverride`（`0.1.0`）

> **言語**: [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | **日本語** | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#customizers)

---

## 1. 非侵襲 SPI 拡張インターフェース（`8` Customizers）

`io.github.natswarchuan.customization.customizer` 配下の全拡張ポイントは `interface` の `default` メソッドとして提供され、フレームワーク内部を改変せずに任意の Spring Bean で選択的に上書きできます：

| # | SPI インターフェース | コンテキスト DTO | 拡張スコープ |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | コア Bean コンテナ、`TaskExecutor`、タスクスケジューリング |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` プロンプト、Vector Store フック、RAG パイプライン |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | 独自 RBAC 評価器、OAuth2 クレームマッピング、マスキング規則 |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | 動的 JPA Criteria フック、マルチデータソースおよびテナントルーティング |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | 分散ロック、Resilience4j サーキットブレーカー、リトライおよび CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook HMAC 署名、WebSocket STOMP、外部 REST インターセプター |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | カスタムエンドポイント、GraphQL 拡張および i18n カスタマイズ |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` バケットポリシー、署名付き URL およびアップロード上限 |

`7` コアテレメトリグループ（`CustomizerGroupConstant`）の有効 Bean は `GET /api/v1/system/customizers` で確認できます（`StorageCustomizer` は `StorageCustomizerRegistryHelper` で独立管理）。


> **実行時インターセプターとメタデータ／テレメトリフックの違い（`0.1.0`）：** `SecurityIdentityCustomizer` は毎リクエスト時に `SecurityFilterChainBridge` と `SecurityAuthorityDecisionHelper` から実行されます。残り `7` 種は `GET /api/v1/system/customizers` および `StorageCustomizerRegistryHelper` 向けのメタデータ・テレメトリ登録フックです。

---

## 2. カスタムドメインルート（`@CustomEndpoint`）とエスケープハッチ（`@ServiceOverride`）

### `@CustomEndpoint` によるカスタム業務エンドポイント

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

### `@ServiceOverride` によるメソッド単位エスケープハッチ

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

## 3. 外部 HTTP クライアント（`ThirdPartyRestClientHelper`）

`ThirdPartyRestClientHelper` は既定の Java 21 `java.net.http.HttpClient` または任意の Spring 6 `RestClient`（`RestClientConfig`）で外部 HTTP 呼び出しを実行し、どちらのモードでも現在の MDC から `X-Request-ID`、W3C `traceparent`、`tracestate` を自動伝播します。
