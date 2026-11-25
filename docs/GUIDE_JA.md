# Spring-NWVMC `0.1.0` — 技術リファレンスマニュアル（日本語）

> **アーティファクト座標**: `io.github.natswarchuan:spring-nwvmc:0.1.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v0.1.0`  
> **実行環境**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **トピック別仕様**: [入門ガイド](topics/en/01_GETTING_STARTED.md) · [40 エンドポイント](topics/en/02_REST_API_CATALOG.md) · [60 アノテーション完全仕様](topics/en/06_DECLARATIVE_ANNOTATIONS.md)  
> **言語**: [English](GUIDE_EN.md) | [Tiếng Việt](GUIDE_VI.md) | 日本語 | [中文](GUIDE_ZH.md) | [20言語ポータル](index.html#annotations)

---

## 1. アーキテクチャと中核設計

`controller-to-api-framework` は `591` 個のメイン Java ファイル（テスト `251` 件、`569` テスト）、`60` 種類の宣言的アノテーション（DB 駆動 RBAC アノテーション `18` 種を含む）、`9` 個の組み合わせ可能な機能インターフェース（`AutoReadApi`..`AutoAiApi`）、`20` 個の `*Properties` クラスと `16` 個の `@AutoConfigurationBean` / `@ConfigurationProperties` クラス（`META-INF/spring-configuration-metadata.json` に `18` グループ定義）、`21` 個の国際化リソースバンドル（`classpath:i18n/messages*.properties`）、および `NwvmcRuntimeHintsRegistrar`（`META-INF/spring/aot.factories`）で構成されます。

- **2ディレクトリ契約（`entity/` と `controller/`）**: アプリケーションは `BaseAuditEntity`（`@Version` 楽観的ロックによる `409 Conflict` 応答および `JpaAssociationReferenceUtil` FK 参照解決付き）を継承する JPA エンティティと、`AutoApiController<E>` または `AutoReadApi<E>` 等の合成インターフェースを継承するインターフェースを定義します（`@AutoRestController(readDto, createDto, updateDto)` および標準 Spring MVC の `@RequestBody`/`@RequestParam`/`@PathVariable` も併用可能）。フレームワーク側でも静的 Spring import は AOT とプロパティ定義（計10行）に限定されています。
- **`MethodHandle` 高速ディスパッチ**: `MethodHandleCacheUtil` と `LambdaAccessorUtil` が実行時リフレクション呼び出しを置換します。
- **UUIDv7 主キー（`UuidUtil.generateUuidV7`）**: 時系列単調増加型の RFC 9562 ID により B-Tree 局所性と定数時間 $O(1)$ の `/keyset` ページングを実現します。
- **統一エラー応答**: `GlobalExceptionHandlerHelper`、`CustomContainerErrorController`（`/error`）、`ExceptionCauseUnwrapperUtil` によりサーバー側で詳細ログを記録しつつ、クライアントへ安全な `ApiResponse<Void>` と `X-Request-ID` / W3C `traceparent` を返却します。

---

## 2. クイックスタート

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>0.1.0</version>
  </dependency>
</dependencies>
```

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
```

```xml
<!-- JitPack 経由での GitHub リリース直接参照（ローカル事前インストール不要） -->
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.1.0</version>
  </dependency>
</dependencies>
```

### 基本実装例（`entity/` + `controller/`）

```java
@Entity
@Table(name = "tbl_product_catalog")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String skuCode;

  @AutoSlug(sourceField = "productName")
  private String slug;

  @NotBlank
  private String productName;
}

@AutoRestController(basePath = "/api/v1/product-catalogs")
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 3. 本番推奨プロパティ設定（`app.framework.*`）

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # 本番環境では既定無効 (/system/studio* は HTTP 401/404)
      demo-token-endpoint-enabled: false # 本番環境では既定無効 (/api/v1/auth/token は HTTP 404)
      show-i18n-diagnostics: false
```

---

## 4. 自動生成 40 契約エンドポイント（既定 38 件公開）

`AutoApiController<E>` は `AutoApiReadController<E>`（15件）、`AutoWriteApi` + `AutoBatchApi`（10件）、`AutoApiEnterpriseController<E>`（11件）、および `AutoExportImportApi<E>`（4件）を統合します（`/events` は `@Hidden`、`/{id}/**` は `enableNestedSubResources = true` 時のみ有効、`@AutoRestController(readDto = ProductReadDto.class)` 対応）。

- **参照・分析・コード生成（`AutoApiReadController` — 15）**: `GET ""` (`getPage`), `/keyset` (`getKeysetPage`), `/all` (`getAll`), `/count` (`count`), `/exists` (`exists`), `/aggregate` (`aggregate`), `/distinct` (`findDistinctValues`), `/top` (`findTopRecords`), `/group-by` (`groupByAnalytics`), `/metadata` (`getMetadata`), `/schema/typescript` (`generateTypeScript`), `/schema/json` (`getJsonSchema`), `/schema/zod` (`generateZodSchema`), `/schema/client` (`generateTypedApiClient`), `/{id}` (`getById`)
- **作成・一括更新・部分更新・論理削除（`AutoWriteApi` + `AutoBatchApi` — 10）**: `POST ""` (`create`), `/upsert` (`upsert`), `PUT /{id}` (`update`), `PATCH /{id}` (`patch`), `DELETE /{id}` (`deleteById`), `POST /{id}/restore` (`restoreById`), `POST /batch` (`createBatch`), `/upsert-batch` (`upsertBatch`), `/batch-chunked` (`batchChunked`), `PATCH /batch-update` (`updateBatchByFilter`)
- **状態遷移・数値調整・AI・RFC 6902・ストリーミング（`AutoApiEnterpriseController` — 11）**: `POST /{id}/transition` (`transitionState`), `POST /{id}/clone` (`cloneEntity`), `PATCH /{id}/increment` (`adjustNumericField`), `PATCH /{id}/patch-rfc6902` (`patchRfc6902`), `GET /{id}/diff` (`compareEntityDiff`), `GET /human-policy` (`getPolicySummary`), `GET /health` (`getEntityHealth`), `GET /events` (`@Hidden` `streamEvents`), `GET /{id}/**` (`navigateSubResources`), `GET /ai/context` (`getAiContext`), `POST /ai/query` (`queryAi`)
- **CSV・JSONL エクスポート/インポート（`AutoExportImportApi` — 4）**: `GET /export/csv` (`exportCsv`), `GET /export/jsonl` (`exportJsonl`), `POST /import/csv` (`importCsv`), `POST /import/jsonl` (`importJsonl`)

---

## 5. `@ServiceOverride`、`@CustomEndpoint` およびコード排出（Eject）

1. **`@ServiceOverride`**: `AutoApiController<E>` 内の対象メソッドに `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` を付与し、`EscapeHatchDispatchHelper` と `MethodHandleCacheUtil` で独自 Bean へ直接委譲します。
2. **`@CustomEndpoint`**: 独自サブルートを独立した `@Component` Helper Bean へルーティングします。
3. **標準 MVC ソース排出**: `GET /system/studio/eject?target=<EntityOrControllerName>` により `ControllerEjectionHelper` が独立した 5 つの Java ファイル（`DTO` / `Repository` / `Service` / `ServiceImpl` / `Controller`）を生成します。

---

## 6. 動的検索・ガードレール・Micrometer 計測・20言語対応

- **13 フィルタ演算子**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`。さらに `EntityCloneSnapshotHelper` による非破壊 `?fields=` / GraphQL 射影、`?expand=` 選択的展開、双方向 `ASC`/`DESC` `/keyset`（`size+1` 判定）に対応します。
- **DoS / SQLi ガードレール**: `QueryFilterParameterUtil` と `QueryGuardrailProperties`（`max-join-depth=3`, `max-filter-criteria=25`, `max-page-size=200`, `max-unpaged-fetch-limit=5000`）。`ConstraintViolationException` は HTTP `409 Conflict` へ変換されます。
- **Micrometer メトリクス（`DynamicEntityMetricsHelper` / `MetricConstant`、計 11 種）**: `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, `framework.outbox.dispatched.total`, `framework.realtime.active.connections`, `framework.datasource.routing.total`。
- **DB 駆動 RBAC、Multi-Tenant & SPI 拡張**: `@MultiTenant` は未設定コンテキストを `403` で拒否し、作成時なりすまし上書きと単体 ID 操作の IDOR を遮断します。`@SecurityRoleEntity` / `@SecurityPermissionEntity` / `@SecurityUserRoleEntity` / `@SecurityPolicyEntity`（`@PermissionFieldMask`、明示的 `DENY` > `ALLOW`）、`PureJavaSecurityFilterBridge` による既存 `SecurityFilterChain` 共存、`DistributedLockProvider`・`IdempotencyStoreProvider` SPI、および `SecurityIdentityCustomizer` を備えています。
- **20 言語 i18n（`I18nConstant`）**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（`ar`, `fa`, `ur` は RTL 対応）。解決優先順は `?lang=` → `X-Language` → `NWVMC_LANG` Cookie → `Accept-Language` → `en`。

---

## 7. JMH `1.37` スループット実測結果

`DynamicProxyThroughputBenchmarkTest` による計測値（単位: `ops/ms`）：

| ベンチマーク手法 | 平均スループット |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

CycloneDX `1.6` SBOM（`target/bom.json`, `128` コンポーネント）生成コマンド:

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```

---

## 8. 宣言的アノテーション（60種）属性・既定値・使い分け指針

全 `60` 個のアノテーションにおける属性、Java 型、デフォルト値、必須/任意、使用方法、推奨ユースケース、禁止・注意事項は **[20言語ポータル（#annotations）](index.html#annotations)** および **[60 アノテーション完全仕様](topics/en/06_DECLARATIVE_ANNOTATIONS.md)** に完全収録しています。

| アノテーション | 主要属性と既定値 | 使用すべきケース | 避けるべきケース・注意点 |
| :--- | :--- | :--- | :--- |
| `@AutoRestController` | `basePath=""`, `path=""`, `entityName=""`, `enabledEndpoints={}`, `disabledEndpoints={}`, `enableNestedSubResources=false`, `readDto/createDto/updateDto=Void.class` | `AutoApiController<E>` または `AutoReadApi<E>` 継承 interface に付与し CRUD/分析 API を自動公開。 | 具象 `@RestController` クラスや JPA Entity 非連動の処理には付与しない。公開参照専用には `AutoReadApi<E>` を選択。 |
| `@ServiceOverride` | `targetBean=Void.class`, `beanName=""`, `methodName=""`, `bypassAutoDispatch=true` | 特定の自動生成メソッドのみ独自 Spring Bean に差し替えたいとき。 | 新規 URL 追加には `@CustomEndpoint` を使用。`targetBean` は `Class<?>`（文字列指定は `beanName`）を指定。 |
| `@CustomEndpoint` | `path=""`, `httpMethod="GET"`, `delegateBean=""`, `delegateMethod=""`, `summary=""`, `description=""` | 決済確定や承認など固有サブルートを Spring `@Component`/`@Service` へ委譲するとき。 | 必須の `delegateBean` を空にせず、認可・AOP は委譲先 Bean 側に実装（`ControllerProxySpecialRouteUtil` で直接委譲）。 |
| `@EntitySecurity` | `core.annotation` (`readRoles`, `writeRoles`, `deleteRoles`, `permitAll=false`, `ownerField=""`, `bypassOwnerRoles={"ROLE_ADMIN","ROLE_SUPER_ADMIN"}`, `permissions={}`) | RBAC と `ownerField` による行単位の所有者アクセス制御を適用するとき。 | `permitAll=true` は READ/WRITE/DELETE 全般のロール検証をスキップするため、公開 API は `AutoReadApi<E>` や `disabledEndpoints` と必ず併用。 |
| `@FieldSecurity` | `viewRoles={}`, `maskPattern="******"`, `nullifyInsteadOfMask=false` | 権限不足時に特定列をマスクまたは `null` 化するとき。 | 非 `String` 型（`BigDecimal` 等）は自動で `null` 化済み。`nullifyInsteadOfMask=true` は **`String` 列**を `"******"` でなく `null` にしたい場合に指定。 |
| `@MultiTenant` | `tenantField="tenantId"`, `bypassTenantRoles={"ROLE_SUPER_ADMIN"}` | マルチテナント SaaS での厳格分離（テナント欠如時 `403`、IDOR 遮断）。 | 全テナント共有マスタ（通貨・国コード等）には付与しない。 |
| `@StateMachine` | `initial="ACTIVE"`, `transitions={}`, `deletableStates={}` | 注文・承認等の厳格な状態遷移と削除可能状態の制御。 | 静的マスタには不要。削除許可状態は `deletableStates` へ明示。 |
| `@DistributedLock` | `key=""`, `waitTimeMs=3000L`, `leaseTimeMs=5000L` | 在庫引当や残高更新での競合状態を SpEL キーで排他制御するとき。 | 高負荷環境で `key=""` のまま使わず `"'sku:' + #skuCode"` のように粒度を絞る。 |
| `@Idempotent` | `headerName="X-Idempotency-Key"`, `ttlSeconds=300L` | 決済・作成 API の二重送信やリトライ重複（`409 Conflict`）を防止。 | 読み取り専用 `GET` には付与しない。 |
| `@RateLimit` | `requests=60`, `windowSeconds=60`, `partitionKey="IP"` | `"IP"`/`"clientIp"`、`"USER"`（匿名時は IP へフォールバック）、`"TENANT"`、`"GLOBAL"`、または SpEL `#expr` で流量制限を行うとき。 | 隔離が必要な箇所での `"GLOBAL"` 乱用を回避。許可時 `X-RateLimit-Remaining`/`X-RateLimit-Reset`、超過時 `HTTP 429` + `Retry-After` を返却。 |
| `@HttpCacheable` | `maxAgeSeconds=60`, `isPrivate=false`, `mustRevalidate=true`, `generateETag=true` | 安定した参照 API で RFC 7232 weak ETag（`W/"..."`）と `304 Not Modified` を使うとき。 | 個人・テナント専用データで `isPrivate=false`（共有キャッシュ許可）にしない。 |
| `@SecurityRoleEntity` 他 17 DB-RBAC | `cacheTtlSeconds=60L`, `enabled=true`, `priority=100`, マーカー 14 種 | DB テーブルでロール・権限・項目マスク・`DENY > ALLOW` ポリシーを動的運用するとき。 | 必須マーカー欠落および同一エンティティ内での単一マーカー重複は `DatabaseRbacFailFastValidatorUtil` により起動時に Fail-Fast 検出されます。 |

---

## 10. AI エージェント導入キット（`ai-agent-kit/`・`llms.txt`）

> 詳細ページ：[`docs/index.html#ai-agent-kit`](index.html#ai-agent-kit) · 英語トピック：[07. AI-Agent Adoption Kit](topics/en/07_AI_AGENT_ADOPTION_KIT.md) · LLM インデックス：[`llms.txt`](../llms.txt)

**Spring-NWVMC AI-Agent Adoption Kit**（`INTRO.md`・`RULES.md`・`SKILL.md`・`CHECKLIST.md`・自動検証済み `references/01..05`・8 種の `adapters/`）を導入することで、Antigravity / Gemini、Claude Code、OpenAI Codex、Cursor、GitHub Copilot、Windsurf、Cline、ChatGPT / DeepSeek / Qwen などのあらゆる AI エージェントが `v0.1.0` をハルシネーションなく正確に実装できます：

```bash
# Windows (PowerShell)
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all

# macOS / Linux / Git Bash
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
```
