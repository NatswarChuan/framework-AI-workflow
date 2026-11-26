# 01. クイックスタート、2ディレクトリ契約および Fail-Fast 起動診断（`0.1.0`）

> **言語**: [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | **日本語** | [中文](../zh/01_GETTING_STARTED.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#quickstart)

---

## 1. 厳格な 2 ディレクトリドメイン契約（`entity/` と `controller/`）

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** を用いる Spring Boot アプリケーションは、業務ドメインを次の 2 つのディレクトリだけで構成します：

1. `entity/`: `BaseAuditEntity`（UUIDv7 主キーおよび `@Version` 楽観的ロックを内蔵）を継承する JPA エンティティ。Bean Validation（`jakarta.validation.constraints.*`）、B-Tree インデックス、および宣言的アノテーション（`@EntitySecurity`、`@FieldSecurity`、`@StateMachine`、`@AutoCode`、`@AutoSlug`、`@UniqueField`、`@ComputedField`、`@AuditTrail`、`@MultiTenant`）を記述します。
2. `controller/`: `@AutoRestController` を付与し、`AutoApiController<E>` または `AutoReadApi<E>` などの機能別サブインターフェースを継承するマーカーインターフェース（標準 Spring MVC の `@RequestBody`/`@RequestParam`/`@PathVariable` も併用可能）。

標準 CRUD を超える業務ワークフローは `Service` インターフェースおよび独立した Spring `@Service` / `@Component` の `public final class` `Helper` Bean に分離し、`@CustomEndpoint` または `@ServiceOverride` 経由で委譲します（`@AutoService` / `@AutoComponent` は `"io.github.natswarchuan"` のみ走査し、エンティティが `io.github.natswarchuan`、`com.example`、`io.github` 以外にある場合は `@EntityScan` を追加します）。

---

## 2. Maven / Gradle セットアップ（`pom.xml` / `build.gradle.kts`）

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

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <parameters>true</parameters>
      </configuration>
    </plugin>
  </plugins>
</build>
```

```kotlin
// Gradle (Kotlin DSL — build.gradle.kts)
dependencies {
    implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
tasks.withType<JavaCompile> {
    options.compilerArgs.add("-parameters")
}
```

[JitPack](https://jitpack.io) 経由で GitHub リリースを直接参照する場合：

```xml
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

---

## 3. 本番ベースライン設定（`application.yml`）

`spring-boot-configuration-processor` が `META-INF/spring-configuration-metadata.json`（`app.framework.*` および `spring-nwvmc.human-policies` 配下の `20` 個の `*Properties` モデル、`16` 個の `@AutoConfigurationBean`/`@ConfigurationProperties` クラスから生成される `18` メタデータグループ）を提供します。`ControllerToApiProperties` の旧トップレベル項目は起動時検証の互換性維持のために残され、実ルートは `@AutoRestController(basePath = ...)`、クエリ上限は `app.framework.query-guardrails.*` が制御します：

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
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false
```

> **ローカル開発のヒント:** `JWT_SECRET` が未設定の場合、`application-dev.yml` にのみ `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` を設定してください（`application.yml`/`application-prod.yml` は必ず fail-closed のまま維持）。

---

## 4. エンドポイントの細粒度フィルタリング（`enabledEndpoints` と `disabledEndpoints`）

`EndpointFeatureFilterHelper` は `AutoApiController<E>` の正確なメソッド名（大文字小文字を区別しない `equalsIgnoreCase(methodName)`、例：`batchChunked`、`deleteById`、`importCsv`）で一致判定を行います：

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 5. 起動時 Fail-Fast 診断（`StartupDiagnosticsUtil` と `EntityFailFastValidatorUtil`）

| 例外クラス | 発生条件 | 対処方法 |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` が JVM `< 21` を検出 | Java 21 LTS 以降で実行する |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` かつ独自 `jwt-secret` が `32` UTF-8 バイト未満 | `${JWT_SECRET}` に 32 バイト以上の秘密鍵を設定する |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`、`maxFilterCriteria < 1`、または `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | `app.framework.query-guardrails.*` に正の整数を設定する |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` または `ComputedFieldFailFastUtil` が `@Id` 欠如、引数なしコンストラクタ欠如、または不正な `@ComputedField` ソース項目を検出 | `BaseAuditEntity` を継承し、`@NoArgsConstructor` を維持し、正確なエンティティ項目名と一致させる |
