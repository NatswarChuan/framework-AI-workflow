# Spring-NWVMC `1.0.0` — 技術リファレンスマニュアル（日本語）

> **アーティファクト座標**: `io.github.natswarchuan:spring-nwvmc:1.0.0` | JitPack: `com.github.NatswarChuan:Spring-NWVMC:v1.0.0`  
> **実行環境**: Java 21 LTS (Virtual Threads) · Spring Boot `3.2.5` / `3.3.5` / `3.4.0` · GraalVM AOT `RuntimeHints`  
> **言語**: [English](GUIDE_EN.md) | [Tiếng Việt](GUIDE_VI.md) | 日本語 | [中文](GUIDE_ZH.md) | [20言語ポータル](index.html)

---

## 1. アーキテクチャと中核設計

`controller-to-api-framework` は `528` 個のメイン Java ファイル、`42` 種類の宣言的アノテーション、`20` 種類の `@ConfigurationProperties` モデル（`META-INF/spring-configuration-metadata.json` 同梱）、`21` 個の国際化リソースバンドル（`classpath:i18n/messages*.properties`）、および `NwvmcRuntimeHintsRegistrar`（`META-INF/spring/aot.factories`）で構成されます。

- **2ディレクトリ契約（`entity/` と `controller/`）**: アプリケーションは `BaseAuditEntity` を継承する JPA エンティティと `AutoApiController<E>` を継承するインターフェースのみを定義します。フレームワーク側でも静的 Spring import は AOT とプロパティ定義（計10行）に限定されています。
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
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

```kotlin
dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:1.0.0")
}
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
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @AutoSlug(sourceField = "name")
  private String slug;

  @NotBlank
  private String name;
}

@AutoRestController(path = "/api/v1/product-catalogs")
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
    base-path-prefix: /api/v1
    default-page-size: 20
    max-page-size: 100
    eager-fetch-singular-relations: true
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false                     # 本番環境では既定無効 (/system/studio* は HTTP 401)
      demo-token-endpoint-enabled: false # 本番環境では既定無効 (/api/v1/auth/token は HTTP 404)
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true
```

---

## 4. 自動生成 40 契約エンドポイント（既定 38 件公開）

`AutoApiController<E>` は `AutoApiReadController<E>`（17件）、書き込み・パッチ・バッチ・復元（11件）、`AutoApiEnterpriseController<E>`（12件）を統合します（`/events` は `@Hidden`、`/{id}/**` は `enableNestedSubResources = true` 時のみ有効）。

- **参照・分析・コード生成（17）**: `GET ""`, `/keyset`, `/all`, `/count`, `/exists`, `/aggregate`, `/distinct`, `/top`, `/group-by`, `/export/csv`, `/export/jsonl`, `/metadata`, `/schema/typescript`, `/schema/json`, `/schema/zod`, `/schema/client`, `/{id}`
- **作成・一括更新・部分更新・論理削除（11）**: `POST ""`, `/batch`, `/upsert`, `/upsert-batch`, `/batch-chunked`, `PATCH /{id}/increment`, `PATCH /batch-update`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `POST /{id}/restore`
- **状態遷移・AI・RFC 6902・ストリーミング（12）**: `POST /{id}/transition`, `POST /{id}/clone`, `GET /events` (`@Hidden`), `GET /ai/context`, `POST /ai/query`, `GET /human-policy`, `GET /health`, `POST /import/csv`, `POST /import/jsonl`, `PATCH /{id}/patch-rfc6902`, `GET /{id}/diff`, `GET /{id}/**`

---

## 5. `@ServiceOverride`、`@CustomEndpoint` およびコード排出（Eject）

1. **`@ServiceOverride`**: `AutoApiController<E>` 内の対象メソッドに `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` を付与し、`EscapeHatchDispatchHelper` と `MethodHandleCacheUtil` で独自 Bean へ直接委譲します。
2. **`@CustomEndpoint`**: 独自サブルートを独立した `@AutoComponent` Helper Bean へルーティングします。
3. **標準 MVC ソース排出**: `GET /system/studio/eject?target=<EntityOrControllerName>` により `ControllerEjectionHelper` が標準 `Controller` / `Service` / `ServiceImpl` / `Repository` を生成します。

---

## 6. 動的検索・ガードレール・Micrometer 計測・20言語対応

- **13 フィルタ演算子**: `eq`, `ne`, `like`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `between`, `null`。
- **DoS / SQLi ガードレール**: `QueryFilterParameterUtil` と `QueryGuardrailProperties`（`max-join-depth=3`, `max-filter-criteria=25`, `max-page-size=200`）。
- **Micrometer メトリクス（`DynamicEntityMetricsHelper` / `MetricConstant`）**: `dynamic.entity.requests.total`, `dynamic.entity.duration.seconds`, `nwvmc.proxy.request.duration`, `nwvmc.cache.http.requests`, `nwvmc.outbox.pending.events`, `nwvmc.outbox.dispatch.duration`, `nwvmc.resilience.circuitbreaker.state`, `nwvmc.ratelimit.rejected.total`, `framework.datasource.routing.total`。
- **20 言語 i18n（`I18nConstant`）**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（`ar`, `fa`, `ur` は RTL 対応）。解決優先順は `?lang=` → `NWVMC_LANG` Cookie → `X-Language` → `Accept-Language` → `en`。

---

## 7. JMH `1.37` スループット実測結果

`DynamicProxyThroughputBenchmarkTest` による計測値（単位: `ops/ms`）：

| ベンチマーク手法 | 平均スループット |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `1457.171 ops/ms` |
| `measureCachedMethodHandleDispatch` | `1029.464 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `528.621 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `195.486 ops/ms` |

CycloneDX SBOM 生成コマンド:

```bash
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml
```
