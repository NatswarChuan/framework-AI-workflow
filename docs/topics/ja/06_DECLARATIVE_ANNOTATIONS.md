# 06. 全 60 宣言的アノテーション完全仕様書（`0.1.0`）

> **言語**: [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | **日本語** | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0` の全 **60 宣言的アノテーション** を Java `@interface` ソースコードから直接抽出した完全仕様書です。正確なパッケージ名、`@Target`、**全属性**、Java 型、既定値、必須/任意区分、**使い方**、**推奨ユースケース**、**非推奨ケースと落とし穴**、検証済み Java コード例を網羅しています。

## クイック索引（60 アノテーション）

| アノテーション | カテゴリ | `@Target` | 属性概要 | 主な用途 |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> 継承インターフェースから 40 契約（Swagger UI 既定 38 公開）の動的 REST プロキシを登録します。 |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | 特定のメソッド呼び出しを自動 CRUD から MethodHandleCacheUtil 経由でカスタム Bean メソッドへ直接委譲します。 |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | 独自ビジネスエンドポイントを宣言し独立した Spring @Component Helper へ処理を転送します。 |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Spring Web への静的依存なしで使える純粋 Java 版 @GetMapping 置換アノテーションです。 |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | カスタム consumes/produces メディアタイプ対応の純粋 Java HTTP POST ルート宣言です。 |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | リソース全体置換向けの純粋 Java HTTP PUT マッピングです。 |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 部分マージ・アトミック加算・RFC 6902 JSON Patch 対応の純粋 Java HTTP PATCH 宣言です。 |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | 状態ガード付き論理削除を実行する純粋 Java HTTP DELETE 宣言です。 |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL クエリパラメータまたは Map<String, String> 動的フィルタマップをバインドします。 |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 エンティティ ID などの URI パス変数をバインドします。 |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | HTTP JSON リクエストボディを @Valid 検証付きの DTO または Entity 引数へデシリアライズします。 |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | 循環参照を防止しつつ GET /{id}/{relation}/** による再帰的サブリソース参照を許可します。 |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | カスタムアクションメソッドに状態遷移や数値加減算ルールを宣言的に定義します。 |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | コンパイル時 @Component 依存なしで起動時に自動登録される純粋 Java コンポーネントマーカーです。 |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride と連携する ServiceImpl 向けの純粋 Java サービスステレオタイプです。 |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean クラス内で管理対象 Bean ファクトリメソッドを宣言します。 |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | 設定クラスおよび YAML プロパティバインディングモデルを定義する純粋 Java アノテーションです。 |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer Bean やフィルタチェーン間の実行優先順位を制御します。 |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | クエリ・更新前に NIST Level 2 RBAC・ownerField 所有権分離・権限コードを強制評価します。 |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | 呼び出し元に権限がない場合、機密項目を動的にマスクまたは null 化します。 |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition の許可遷移と DELETE /{id} の削除可能状態を厳格に制御します。 |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | 自然文形式のポリシークローズを実行可能な RBAC・状態遷移・マスキング規則へコンパイルします。 |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | 更新ごとのフィールド差分を記録し、タイムトラベル復元と /diff 監査を実現します。 |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | バイパス権限がない限り、アクティブなテナントコンテキスト単位で行の参照・更新を自動分離します。 |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | 新規作成・更新・Upsert の永続化直前に一意性制約を事前検証します。 |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | 未指定時に作成またはクローン時に一意のプレフィックス付き業務コードを自動採番します。 |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | sourceField から URL 向けの正規化 ASCII スラッグを自動生成します。 |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | エンティティ保存前に派生数値合計を自動的に算出します。 |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | コントローラーエンドポイントへカスタム SQL/JPQL やプロバイダ Helper メソッドを関連付けます。 |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | JPA エンティティを動的データベース RBAC ロールカタログ表として指定します。 |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityRoleEntity 内で一意のロールコード列をマッピングします。 |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityRoleEntity 上のロール表示名フィールドを識別します。 |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ロールに付与された権限コード配列または CSV 文字列フィールドをマークします。 |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | リソース操作権限および動的フィールドマスク規則を保持する JPA エンティティを指定します。 |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity 内の一意な権限コード識別子フィールドを指定します。 |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity 内で対象エンティティまたはリソース名（ワイルドカード * 可）を指定します。 |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity で保護される CRUD またはカスタムアクション種別をマッピングします。 |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | この DB 権限ルール適用時に動的マスク対象となるカンマ区切りフィールド一覧を指定します。 |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | 認証済みユーザー主体と DB ロールおよび任意テナント境界を紐付ける JPA エンティティです。 |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity 上のプリンシパル主体（ユーザー名/JWT sub）フィールドを示します。 |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity 内で割り当てられたロールコード列をバインドします。 |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity のロール割り当てを特定テナント（または全体 *）へスコープ制限します。 |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | priority 順に評価される明示的 ALLOW / DENY 動的認可ポリシーを格納する JPA エンティティです。 |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity 内で対象リソース名パターンをマッピングします。 |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity 内で保護対象アクション（READ/WRITE/DELETE/methodName/*）を指定します。 |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity ルールが対象とするロール配列または CSV 文字列をマッピングします。 |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity ルールの判定結果（ALLOW または DENY）を指定します。 |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST キャッシュ（最大1024件）付き SpEL キーで排他制御を行います（既定 waitTimeMs=3000L, leaseTimeMs=5000L）。 |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | 設定可能な TTL ウィンドウ内で同時またはリプレイされた重複書き込みを防止します。 |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP・ユーザー・テナント単位でスライディングウィンドウ型のレート制限を適用します。 |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator/Micrometer へのテレメトリ報告付きで操作を Resilience4j サーキットブレーカー保護します。 |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | 一時的な障害を設定可能な指数バックオフで自動リトライします。 |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 準拠の弱い ETag（W/"..."）を生成し Cache-Control および HTTP 304 Not Modified 応答を返却します。 |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | サーバー側参照結果を Caffeine L1 / Redis L2 エンジンへキャッシュします。 |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | データ変更時に古いサーバーキャッシュエントリを自動破棄します。 |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | 処理時間を計測し、閾値超過のスロー呼び出し時に WARN ログを出力します。 |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | コミット後に Virtual Threads 上で HMAC-SHA256 署名付き Webhook を非同期配信します。 |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | トランザクションコミット後に CNCF CloudEvents v1.0 エンベロープを発行します。 |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | エンティティやクエリ操作を指定した論理データソースキーへルーティングします。 |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | エンティティごとにデータベースエンジン種別と論理クラスターシャードを割り当てます。 |

---

## 1. ルーティング、動的 API 契約、DTO 分離およびパラメータバインディング (13 アノテーション)

### `@AutoRestController`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **目的**: AutoApiController<E> 継承インターフェースから 40 契約（Swagger UI 既定 38 公開）の動的 REST プロキシを登録します。
- **実行時動作**: 起動時に DynamicControllerProxyRegistrarHelper が RequestMappingHandlerMapping へルートを動的登録します。
- **使い方**: `AutoApiController<E>` または `AutoReadApi<E>` を継承する Java インターフェースに付与し、`basePath`・`disabledEndpoints`・DTO 型を指定します。
- **使用すべき場面**: JPA エンティティに対しボイラープレート無しで標準 CRUD・フィルタ・Keyset・読み取り専用 API を公開したい場合に最適です。
- **使用を避けるべき場面と注意点**: 具象 `@RestController` クラスや JPA エンティティを持たない集計エンドポイントには使わないでください。公開参照用には `AutoApiController` ではなく `AutoReadApi<E>` を推奨します。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | いいえ（任意） | `/` で始まる有効な HTTP パス（例: `/api/v1/product-catalogs`）、または自動導出する空文字 `""`。<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | 明示的なルート URI（例: "/api/v1/product-catalogs"）。未指定時はコントローラー名からケバブケース複数形を生成します。<br/>*注意点:* 起動時に登録機は `path` より先に `basePath` を評価します。両方に矛盾する値を指定しないでください。 |
| `path` | `String` | `""` | いいえ（任意） | `/` で始まる有効な HTTP パス（例: `/api/v1/orders`）、または自動導出する空文字 `""`。<br/>`@AutoRestController(path = "/api/v1/orders")` | ルートパスの互換エイリアス属性。プロキシ登録機は basePath を優先するため通常は basePath を推奨します。<br/>*注意点:* 起動時に登録機は `path` より先に `basePath` を評価します。両方に矛盾する値を指定しないでください。 |
| `entityName` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"ProductCatalog"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoRestController(entityName = "ProductCatalog")` | OpenAPI や Studio メタデータに表示されるエンティティ名を明示指定で上書きします。<br/>*注意点:* 生成される Swagger / OpenAPI 3.0 と NWVMC Studio に直接反映されます。ハードコード防止のため `OpenApiConstant` に定義してください。 |
| `enabledEndpoints` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`。<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | 公開する契約メソッド名のホワイトリスト（例: "getPage", "create"）。空配列時は全メソッド有効。<br/>*注意点:* 厳格なホワイトリストとして機能します。空でない場合、列挙されていない契約メソッドは Spring MVC と Swagger UI から除外されます。 |
| `disabledEndpoints` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`。<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | MVC 登録前に除外したいメソッド名のブラックリスト（例: "deleteById", "batchChunked"）。<br/>*注意点:* `enabledEndpoints` の後に評価されます。40 契約の大部分を残しつつ削除系や一括取込だけを遮断する用途に最適です。 |
| `enableNestedSubResources` | `boolean` | `false` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | 再帰的なサブリソース参照 GET /{id}/** を有効化します。大規模スキーマのルート肥大化を防ぐため既定は false です。<br/>*注意点:* `GET /{id}/items/...` が不要な場合は `false` のままにしてください。有効化時は `@EnableNestedSubResource` で許可リレーションを限定してください。 |
| `readDto` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `ProductReadDto.class`）、または無効化する `Void.class`。<br/>`@AutoRestController(readDto = ProductReadDto.class)` | 読み取りレスポンスから内部エンティティ項目を除外する DTO 型。Void.class 時はエンティティを返却。<br/>*注意点:* 読み取り (GET) パイプラインのみに適用されます。DTO クラスにはデフォルトコンストラクタ／ゲッターが必要で、`@Valid` と `@FieldSecurity` に連動します。 |
| `createDto` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `ProductCreateDto.class`）、または無効化する `Void.class`。<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | POST 時に Jakarta Validation を実行した上でエンティティ E へ変換する入力 DTO 型。<br/>*注意点:* 作成 (POST) パイプラインのみに適用されます。DTO クラスにはデフォルトコンストラクタ／ゲッターが必要で、`@Valid` と `@FieldSecurity` に連動します。 |
| `updateDto` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `ProductUpdateDto.class`）、または無効化する `Void.class`。<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | PUT/PATCH 更新時に書き換え可能な項目を制限しバリデーションを行う入力 DTO 型。<br/>*注意点:* 更新 (PUT/PATCH) パイプラインのみに適用されます。DTO クラスにはデフォルトコンストラクタ／ゲッターが必要で、`@Valid` と `@FieldSecurity` に連動します。 |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: 特定のメソッド呼び出しを自動 CRUD から MethodHandleCacheUtil 経由でカスタム Bean メソッドへ直接委譲します。
- **実行時動作**: EscapeHatchDispatchHelper が対象 Bean と MethodHandle を一度だけ解決し MethodHandleCacheUtil にキャッシュします。
- **使い方**: コントローラー内の対象メソッドに `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` を付与し、委譲先を Spring `@Service`/`@Component` として定義します。
- **使用すべき場面**: 標準 CRUD の大部分を維持しつつ、特定ルートだけ独自の Java ビジネスロジックへ差し替えたい場合に使います。
- **使用を避けるべき場面と注意点**: `targetBean` に文字列は渡せません（`Class<?>` 必須、文字列は `beanName` を使用）。宣言的ルールで済む場合は不要な上書きを避けてください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `OrderCustomService.class`）、または無効化する `Void.class`。<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | 委譲先の Spring Bean クラス（beanName より優先されます）。<br/>*注意点:* 起動時に登録機は `beanName` より先に `targetBean` を評価します。両方に矛盾する値を指定しないでください。 |
| `beanName` | `String` | `""` | いいえ（任意） | ApplicationContext に登録済みの正確な Bean 名（例: `"orderCustomService"`）、または自動解決の `""`。<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | targetBean が Void.class の場合に名前ベースで Bean を解決します。<br/>*注意点:* 起動時に登録機は `beanName` より先に `targetBean` を評価します。両方に矛盾する値を指定しないでください。 |
| `methodName` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"createOrder"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | 委譲先 Bean のメソッド名。空の場合はコントローラー側のメソッド名と一致させます。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"createOrder"`）。不一致は実行時エラーとなります。 |
| `bypassAutoDispatch` | `boolean` | `true` | いいえ（任意） | `true`（既定プロキシをバイパスして対象 Bean を直接実行）または `false`（既定ディスパッチと併用実行）。<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true の場合、既定 CRUD ディスパッチをスキップして MethodHandleCacheUtil 経由で委譲実行します。<br/>*注意点:* `true`（既定）では組み込み CRUD を完全にバイパスし、対象 Bean がトランザクションを担います。補助フック用途のみ `false` にしてください。 |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: 独自ビジネスエンドポイントを宣言し独立した Spring @Component Helper へ処理を転送します。
- **実行時動作**: キャッシュ済み MethodHandle を経由し検証とトランザクション管理付きで delegateBean.delegateMethod を実行します。
- **使い方**: インターフェースのメソッドに `path`・`httpMethod`・`delegateBean`・`delegateMethod` を設定し、処理専用の Spring Helper Bean へ委譲します。
- **使用すべき場面**: 決済・返金・承認・複数エンティティを跨ぐトランザクションなどの業務アクションエンドポイントに利用します。
- **使用を避けるべき場面と注意点**: `@CustomEndpoint` は `invokeProtectedOperation` より前に直接委譲されるため、Spring AOP や認可は委譲先 `@Component`/`@Service` に付与し、単純な状態遷移には `@BusinessAction` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/reports/monthly-sales`）。`""` はルートにマップされます。<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | コントローラーの basePath 配下の相対パス（例: "/checkout"）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `path` はトラフィック受付前に Fail-Fast で停止します。 |
| `httpMethod` | `String` | `"GET"` | いいえ（任意） | 次のサポート値のいずれか: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`。<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | 割り当てる HTTP メソッド（"GET", "POST", "PUT", "PATCH", "DELETE"）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `httpMethod` はトラフィック受付前に Fail-Fast で停止します。 |
| `delegateBean` | `String` | `""` | いいえ（任意） | ApplicationContext に登録済みの正確な Bean 名（例: `"orderReportService"`）、または自動解決の `""`。<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | 処理を委譲する Spring Bean 名（default メソッドまたは @ServiceOverride がない限り必須）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `delegateBean` はトラフィック受付前に Fail-Fast で停止します。 |
| `delegateMethod` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"buildMonthlyReport"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean 上のメソッド名。空時はコントローラーのメソッド名を使用します。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"buildMonthlyReport"`）。不一致は実行時エラーとなります。 |
| `summary` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"Get monthly revenue breakdown"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI に表示される短い OpenAPI 3.0 サマリー。<br/>*注意点:* 生成される Swagger / OpenAPI 3.0 と NWVMC Studio に直接反映されます。ハードコード防止のため `OpenApiConstant` に定義してください。 |
| `description` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"Aggregates confirmed invoice totals grouped by currency"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI でエンドポイントを展開した際に表示される詳細ドキュメント。<br/>*注意点:* 生成される Swagger / OpenAPI 3.0 と NWVMC Studio に直接反映されます。ハードコード防止のため `OpenApiConstant` に定義してください。 |

```java
@CustomEndpoint(
    path = "/checkout-cart",
    httpMethod = "POST",
    delegateBean = "advancedOrderCheckoutHelper",
    delegateMethod = "checkoutCart",
    summary = "Checkout cart"
)
```

### `@AutoGet`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: Spring Web への静的依存なしで使える純粋 Java 版 @GetMapping 置換アノテーションです。
- **実行時動作**: プロキシ起動時に HTTP GET RequestMappingInfo へ動的登録されます。
- **使い方**: `@AutoRestController` インターフェース内のメソッドに付与し、必要に応じて `@ServiceOverride` や `@CustomQuery` と併用します。
- **使用すべき場面**: Spring Web の `@GetMapping` をインポートせず純粋 Java インターフェースで GET ルートを追加したいときに使います。
- **使用を避けるべき場面と注意点**: DB 変更や副作用を伴う操作には使わないでください（`@AutoPost` 等を使用）。通常の `@RestController` でも不要です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/{id}/summary`）。`""` はルートにマップされます。<br/>`@AutoGet("/{id}/summary")` | 相対 GET パステンプレート（例: "/metrics"）。空文字時はコントローラーの basePath 直下になります。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `produces` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json", "text/csv"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | レスポンスで生成するメディアタイプ配列（例: "text/event-stream", "text/csv"）。<br/>*注意点:* Spring MVC が HTTP `Accept` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: カスタム consumes/produces メディアタイプ対応の純粋 Java HTTP POST ルート宣言です。
- **実行時動作**: SpringMvcEndpointBridge により HTTP POST ハンドラとして登録されます。
- **使い方**: `@AutoRestController` 内の作成・業務アクションに付与し、`@AutoBody` または `@RequestBody` で入力を受信、`@BusinessAction` や `@ServiceOverride` と組み合わせます。
- **使用すべき場面**: 新規リソース作成、業務コマンド、バッチ登録など POST エンドポイントを宣言する際に使用します。
- **使用を避けるべき場面と注意点**: 参照（`@AutoGet`）、全置換（`@AutoPut`）、部分更新（`@AutoPatch`）、削除（`@AutoDelete`）には使わないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/{id}/approve`）。`""` はルートにマップされます。<br/>`@AutoPost("/{id}/approve")` | basePath 配下の相対 POST パステンプレート。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `consumes` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json", "multipart/form-data"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | 受け付けるリクエスト Content-Type 配列。<br/>*注意点:* Spring MVC が HTTP `Content-Type` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |
| `produces` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | レスポンスとして生成するメディアタイプ配列。<br/>*注意点:* Spring MVC が HTTP `Accept` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: リソース全体置換向けの純粋 Java HTTP PUT マッピングです。
- **実行時動作**: トランザクション境界内で HTTP PUT ハンドラとしてバインドされます。
- **使い方**: 全置換更新メソッドに `@AutoPut("/{id}")` を付け、`@AutoVariable` と `@AutoBody` を組み合わせます。
- **使用すべき場面**: リソース全体の完全置換（べき等な PUT）エンドポイントを宣言する場合に使います。
- **使用を避けるべき場面と注意点**: 一部項目のみの更新や状態遷移には `@AutoPatch` または `@BusinessAction` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/{id}/replace`）。`""` はルートにマップされます。<br/>`@AutoPut("/{id}/replace")` | 相対 PUT パステンプレート（例: "/{id}"）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `consumes` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | 受け付けるリクエスト Content-Type 配列。<br/>*注意点:* Spring MVC が HTTP `Content-Type` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |
| `produces` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | 生成するレスポンスメディアタイプ配列。<br/>*注意点:* Spring MVC が HTTP `Accept` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: 部分マージ・アトミック加算・RFC 6902 JSON Patch 対応の純粋 Java HTTP PATCH 宣言です。
- **実行時動作**: JSON マージ構文および application/json-patch+json を処理します。
- **使い方**: 部分更新や `@BusinessAction` 状態遷移メソッドに `@AutoPatch("/{id}/action")` を付与します。
- **使用すべき場面**: 一部項目の更新、数値の原子加算・減算、状態遷移（`@BusinessAction`）に最適です。
- **使用を避けるべき場面と注意点**: 全置換が必要な場合は `@AutoPut`、新規作成は `@AutoPost` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/{id}/status`）。`""` はルートにマップされます。<br/>`@AutoPatch("/{id}/status")` | 相対 PATCH パステンプレート（例: "/{id}/approve"）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `consumes` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json", "application/merge-patch+json"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | 受け付ける Content-Type 配列。<br/>*注意点:* Spring MVC が HTTP `Content-Type` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |
| `produces` | `String[]` | `{}` | いいえ（任意） | MIME メディア型の配列（例: `{"application/json"}`）。空配列 `{}` は既定の `application/json` を使用します。<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | 生成するレスポンスメディアタイプ配列。<br/>*注意点:* Spring MVC が HTTP `Accept` でコンテントネゴシエーションを行います。不一致時は `406` または `415` を返します。 |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: 状態ガード付き論理削除を実行する純粋 Java HTTP DELETE 宣言です。
- **実行時動作**: deleted=true 設定前に @StateMachine deletableStates を検証します。
- **使い方**: カスタム削除メソッドに `@AutoDelete("/{id}/custom")` を付け、`@ServiceOverride` 等と組み合わせて利用します。
- **使用すべき場面**: アーカイブやカスケード削除など独自の DELETE エンドポイントを定義する場合に使用します。
- **使用を避けるべき場面と注意点**: 標準の論理削除と `@StateMachine(deletableStates = ...)` で足りる場合は再定義不要です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 任意の `{pathVar}` テンプレートを含む相対サブパス（例: `/{id}/archive`）。`""` はルートにマップされます。<br/>`@AutoDelete("/{id}/archive")` | 相対 DELETE パステンプレート（例: "/{id}/purge"）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **目的**: URL クエリパラメータまたは Map<String, String> 動的フィルタマップをバインドします。
- **実行時動作**: QueryGuardrailEnforcerUtil 検証付きで DynamicQueryParameterParserHelper により抽出されます。
- **使い方**: コントローラーのメソッド引数に `@AutoParam(name = "status", defaultValue = "ACTIVE")` のように指定します。
- **使用すべき場面**: コントローラーを Spring Web 非依存（Pure Java）に保ったままクエリパラメータを受け取る場合に使います。
- **使用を避けるべき場面と注意点**: パス変数（`@AutoVariable`）や JSON ボディ（`@AutoBody`）には使いません（`v0.1.0` では Spring `@RequestParam` も併用可）。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"status"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoParam("status") String status` | バインドするクエリパラメータ名（name のエイリアス）。空時は Java 引数名を使用。<br/>*注意点:* 起動時に登録機は `name` より先に `value` を評価します。両方に矛盾する値を指定しないでください。 |
| `name` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"pageSize"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | 明示的なクエリパラメータ名。<br/>*注意点:* 起動時に登録機は `name` より先に `value` を評価します。両方に矛盾する値を指定しないでください。 |
| `required` | `boolean` | `true` | いいえ（任意） | `true`（必須（欠落時は HTTP 400））または `false`（任意（省略時は null を渡す））。<br/>`@AutoParam(name = "keyword", required = false) String keyword` | パラメータ未指定時に HTTP 400 エラーを返すかどうか。<br/>*注意点:* `defaultValue` 指定時は自動的に任意扱いになります。`false` の場合は NPE 防止のためプリミティブではなく `Integer` 等のラッパー型を使ってください。 |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | いいえ（任意） | 空でない識別子文字列（例: `"20"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | 未指定時のフォールバック値。既定は DEFAULT_NONE センチネル（既定値なし）です。<br/>*注意点:* 文字列から Spring `ConversionService` により引数型へ変換されます。変換不能なリテラルは HTTP `400` となります。 |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **目的**: UUIDv7 エンティティ ID などの URI パス変数をバインドします。
- **実行時動作**: MVC パステンプレートから型付き Java UUID / String 値へ変換されます。
- **使い方**: `findById(@AutoVariable("id") UUID id)` のようにパス変数引数へ指定します。
- **使用すべき場面**: Pure Java インターフェースで `{id}` や `{code}` を抽出するときに使用します。
- **使用を避けるべき場面と注意点**: クエリパラメータ（`@AutoParam`）や JSON ボディ（`@AutoBody`）には使わないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"orderId"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoVariable("orderId") UUID orderId` | バインドする URI テンプレート変数名。<br/>*注意点:* 起動時に登録機は `name` より先に `value` を評価します。両方に矛盾する値を指定しないでください。 |
| `name` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"tenantCode"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | 明示的なパス変数名。<br/>*注意点:* 起動時に登録機は `name` より先に `value` を評価します。両方に矛盾する値を指定しないでください。 |
| `required` | `boolean` | `true` | いいえ（任意） | `true`（必須（欠落時は HTTP 400））または `false`（任意（省略時は null を渡す））。<br/>`@AutoVariable(name = "id", required = true) UUID id` | パス変数が必須かどうか。<br/>*注意点:* メソッド URI テンプレートの `{variableName}` と一致させる必要があります。`false` は任意 URI パターン存在時のみ有効です。 |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **目的**: HTTP JSON リクエストボディを @Valid 検証付きの DTO または Entity 引数へデシリアライズします。
- **実行時動作**: サービストランザクション突入前に LocalValidatorFactoryBean で検証されます。
- **使い方**: `@AutoPost` や `@AutoPut` メソッドのペイロード引数に `@AutoBody`（検証には `@Valid` 併用）を付けます。
- **使用すべき場面**: Pure Java プロキシコントローラーで JSON ボディをエンティティや DTO にデシリアライズする際に使います。
- **使用を避けるべき場面と注意点**: GET/DELETE メソッドや、1 メソッドにつき複数の `@AutoBody` 指定は禁止です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | いいえ（任意） | `true`（必須（欠落時は HTTP 400））または `false`（任意（省略時は null を渡す））。<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | リクエストボディ欠如時に HTTP 400 エラーを返すかどうか。<br/>*注意点:* `@Valid` と併用してディスパッチ前に Jakarta バリデーションを実行できます。`false` にすると空ボディを `400` なしで許容します。 |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: 循環参照を防止しつつ GET /{id}/{relation}/** による再帰的サブリソース参照を許可します。
- **実行時動作**: コントローラー側で @AutoRestController(enableNestedSubResources = true) が必要です。
- **使い方**: `@AutoRestController` で `enableNestedSubResources = true` を有効にし、`@EnableNestedSubResource` で許可する関連を制限します。
- **使用すべき場面**: `GET /api/v1/customer-orders/{id}/items` のような階層 URL を公開しつつ各階層で権限・テナント検査を行いたいときに使います。
- **使用を避けるべき場面と注意点**: `allowedRelationships` を制限せずに密接関連テーブルへ開かないでください。単純な結合取得なら `?expand=` を推奨します。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)。<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | GET /{id}/** トラバーサルで到達を許可する JPA エンティティクラスのホワイトリスト。<br/>*注意点:* 空配列は到達可能な全子エンティティを許可します。内部テーブルの誤公開を防ぐため対象クラスを明示列挙してください。 |
| `allowedRelationships` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `"items"`, `"payments"`, `"shipments"` (JPA field names)。<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | サブリソースパスで許可する JPA 関連フィールド名の明示リスト（例: "items", "customer"）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"items"`）。不一致は実行時エラーとなります。 |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: カスタムアクションメソッドに状態遷移や数値加減算ルールを宣言的に定義します。
- **実行時動作**: 更新されたエンティティ属性を永続化する直前にアトミック実行されます。
- **使い方**: インターフェースのメソッドに `@AutoPatch` と `@BusinessAction(...)` を併用し、プロキシがトランザクション内で自動実行します。
- **使用すべき場面**: Service クラスを作らずに単一エンティティの承認・取消遷移や数値増減、ドメインメソッド実行を宣言したいときに使います。
- **使用を避けるべき場面と注意点**: 複数エンティティに跨る処理、外部 HTTP 通信、非同期処理には使わず `@ServiceOverride` へ委譲してください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | いいえ（任意） | エンティティ上の ライフサイクル状態 フィールドに完全一致する Java プロパティ名（例: `"status"`）。<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | エンティティ上の状態フィールド名（@StateMachine 定義があれば遷移ルールを自動検証）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"status"`）。不一致は実行時エラーとなります。 |
| `targetStateValue` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"APPROVED"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | トランザクション内で targetStateField へ設定する目標状態値。<br/>*注意点:* 永続化前に `@StateMachine` または `@HumanPolicy` で自動検証されます。不正な遷移はトランザクションをロールバックします。 |
| `adjustNumericField` | `String` | `""` | いいえ（任意） | エンティティ上の 数値 フィールドに完全一致する Java プロパティ名（例: `"stockQuantity"`）。<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | トランザクション内で加算・減算する数値プロパティ名。<br/>*注意点:* `deltaParamIndex >= 0` または `fixedDelta` のいずれかが必須です。`Integer`、`Long`、`BigDecimal`、`Double` をトランザクション内で更新します。 |
| `deltaParamIndex` | `int` | `-1` | いいえ（任意） | 次のサポート値のいずれか: `-1` (disabled) or `0`-based method argument index (e.g., `1`)。<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | 動的な増減値（delta）を受け取る引数の 0 始まりインデックス。-1 は無効。<br/>*注意点:* 起動時に登録機は `fixedDelta` より先に `deltaParamIndex` を評価します。両方に矛盾する値を指定しないでください。 |
| `fixedDelta` | `String` | `""` | いいえ（任意） | 次のサポート値のいずれか: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`。<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | 引数を使わない場合に適用する固定数値文字列（例: "100", "-1"）。<br/>*注意点:* 起動時に登録機は `fixedDelta` より先に `deltaParamIndex` を評価します。両方に矛盾する値を指定しないでください。 |
| `entityMethod` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"markFulfilled"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@BusinessAction(entityMethod = "markFulfilled")` | 同一トランザクション内でエンティティ上の引数なしメソッドを実行します。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"markFulfilled"`）。不一致は実行時エラーとなります。 |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean 検出、設定バインディングおよび実行優先度 (5 アノテーション)

### `@AutoComponent`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: コンパイル時 @Component 依存なしで起動時に自動登録される純粋 Java コンポーネントマーカーです。
- **実行時動作**: フレームワーク内部パッケージ（io.github.natswarchuan）専用。アプリ側 Bean には Spring の @Component を使用してください。
- **使い方**: `AutoBeanFactoryRegistrarBridge` が `io.github.natswarchuan` 配下で自動スキャンする内部ステレオタイプです。
- **使用すべき場面**: フレームワーク内部（`io.github.natswarchuan.*`）で Spring Web 依存を避けたい場合のみ使用します。
- **使用を避けるべき場面と注意点**: 利用アプリ側（`com.example.*` 等）では絶対に使わないでください！Spring の `@Component` を使わないと Bean 登録されません。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | ApplicationContext に登録済みの正確な Bean 名（例: `"invoiceValidationHelper"`）、または自動解決の `""`。<br/>`@AutoComponent("invoiceValidationHelper")` | 明示的な Bean 名（任意）。未指定時はクラス名の camelCase。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: @ServiceOverride と連携する ServiceImpl 向けの純粋 Java サービスステレオタイプです。
- **実行時動作**: io.github.natswarchuan 配下でクラス名ベースに登録。アプリ側サービスには Spring の @Service を使用してください。
- **使い方**: `io.github.natswarchuan` 内部向けの Pure Java Service ステレオタイプです。
- **使用すべき場面**: フレームワーク内部のサービス実装クラスにのみ使います。
- **使用を避けるべき場面と注意点**: アプリ側では使わず、必ず Spring の `@Service` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | ApplicationContext に登録済みの正確な Bean 名（例: `"orderFulfillmentService"`）、または自動解決の `""`。<br/>`@AutoService("orderFulfillmentService")` | 明示的な Service Bean 名（任意）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: @AutoConfigurationBean クラス内で管理対象 Bean ファクトリメソッドを宣言します。
- **実行時動作**: 自動設定フェーズで PureJavaBeanRegistrarBridge により処理・登録されます。
- **使い方**: フレームワーク内部の `@AutoConfigurationBean` クラスのファクトリーメソッドに付与します。
- **使用すべき場面**: フレームワーク内部の設定クラスで Spring `@Bean` を使わずに登録する場合のみ使います。
- **使用を避けるべき場面と注意点**: 利用アプリの `@Configuration` では Spring 標準の `@Bean` を使用してください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `{"primaryObjectMapper", "nwvmcMapper"}`。<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | 明示的な Bean 名とエイリアスの配列。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `targetTypeName` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"com.example.spi.PaymentGateway"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | 動的ブリッジ型判定用の完全修飾クラス名。<br/>*注意点:* ファクトリメソッドが親型や動的プロキシを返す際の FQCN ヒント。実行時クラスパス上に存在する必要があります。 |
| `primary` | `boolean` | `false` | いいえ（任意） | `true`（複数候補がある場合に優先注入される Bean）または `false`（通常の候補優先度）。<br/>`@AutoBean(primary = true)` | 複数の候補 Bean が存在する場合の優先候補（@Primary）として登録します。<br/>*注意点:* 同一型に `@AutoBean(primary = true)` を 2 つ定義すると起動時に曖昧性エラーで失敗します。 |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: 設定クラスおよび YAML プロパティバインディングモデルを定義する純粋 Java アノテーションです。
- **実行時動作**: IDE メタデータを備えた状態で設定 Bean と YAML プレフィックスを登録します。
- **使い方**: `io.github.natswarchuan.config.*` の設定クラスおよびプロパティクラスを宣言します。
- **使用すべき場面**: フレームワークライブラリ内部で Pure Java の設定クラスを定義するときのみ使用します。
- **使用を避けるべき場面と注意点**: 利用アプリ側の設定クラスでは Spring の `@Configuration` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | ApplicationContext に登録済みの正確な Bean 名（例: `"storageAutoConfig"`）、または自動解決の `""`。<br/>`@AutoConfigurationBean("storageAutoConfig")` | 任意の設定 Bean 名。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `prefix` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"nwvmc.storage"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | YAML 設定プレフィックス（例: "app.framework.cache"）。<br/>*注意点:* `application.yml` の kebab-case プロパティをバインドします。IDE 警告を防ぐためメタデータと併用してください。 |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **目的**: SPI Customizer Bean やフィルタチェーン間の実行優先順位を制御します。
- **実行時動作**: 整数値が小さいほど先に実行されます（既定値 Integer.MAX_VALUE）。
- **使い方**: `@OrderPriority(1)` をインターセプターやカスタマイザーに付けて実行順を制御します。
- **使用すべき場面**: `@Order` を使わずに複数 SPI カスタマイザーや Bean の優先順を確定させたいときに使います。
- **使用を避けるべき場面と注意点**: Spring Security フィルター順やクエリ `?sort=` とは無関係です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | いいえ（任意） | 次のサポート値のいずれか: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)。<br/>`@OrderPriority(10)` | 実行優先度（数値が小さいほど先、既定 Integer.MAX_VALUE が最低）。<br/>*注意点:* 小さい数値ほど先に実行されます（Spring `@Order` と同等）。`< 0` はセキュリティ／トレース用、`10..100` は業務層用にしてください。 |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. エンティティセキュリティ、ステートマシン、整合性、自動生成およびクエリ (11 アノテーション)

### `@EntitySecurity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: クエリ・更新前に NIST Level 2 RBAC・ownerField 所有権分離・権限コードを強制評価します。
- **実行時動作**: SQL 実行前に評価され、権限不足時は HTTP 403 Forbidden を送出します。
- **使い方**: JPA `@Entity` クラスへ付与し、各種ロールや所有者項目 `ownerField` を設定します。
- **使用すべき場面**: 公開するすべてのエンティティに付与し、REST・バッチ・エクスポート・GraphQL 全体で一貫したアクセス制御を行います。
- **使用を避けるべき場面と注意点**: `AutoReadApi<E>`・`disabledEndpoints`・`@SecurityPolicyEntity` なしで完全な `AutoApiController<E>` に `permitAll = true` を設定しないでください（DB ポリシー未設定時は READ/WRITE/DELETE すべてをバイパスします）。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_USER", "ROLE_ADMIN"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | 読み取り（GET・GraphQL・エクスポート）を許可するロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |
| `writeRoles` | `String[]` | `{}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_MANAGER", "ROLE_ADMIN"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | 書き込み（POST/PUT/PATCH・インポート）を許可するロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |
| `deleteRoles` | `String[]` | `{}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | 削除（DELETE・一括削除）を許可するロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |
| `permitAll` | `boolean` | `false` | いいえ（任意） | `true`（未認証の公開アクセスを許可）または `false`（認証とロール検証を強制）。<br/>`@EntitySecurity(permitAll = true)` | true かつ DB-RBAC 上書きがない場合、READ/WRITE/DELETE 全操作の検証をスキップします。公開 API は AutoReadApi<E> や disabledEndpoints と併用必須です。<br/>*注意点:* ロール検査をすべて無効化して匿名アクセスを許可します。PII や決済・内部管理エンティティには絶対に設定しないでください。 |
| `ownerField` | `String` | `""` | いいえ（任意） | エンティティ上の 所有者/UUID フィールドに完全一致する Java プロパティ名（例: `"createdBy"`）。<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | レコード所有者を保持する項目名（例: "createdBy"）。IDOR 防止の行単位制御を行います。<br/>*注意点:* `GET`/`PUT`/`PATCH`/`DELETE` に行レベル所有者フィルタを強制します。`bypassOwnerRoles` 保有者のみ他人のレコードへアクセス可能です。 |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | `ownerField` の所有者チェックをバイパスできる管理者ロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |
| `permissions` | `String[]` | `{}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ORDER_READ", "ORDER_APPROVE"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | ロールに加えて検証する詳細パーミッションコード配列（DB RBAC 対応）。<br/>*注意点:* JWT クレームまたは DB-RBAC `@SecurityPermissionEntity` の細粒度パーミッションに対して評価されます。 |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: 呼び出し元に権限がない場合、機密項目を動的にマスクまたは null 化します。
- **実行時動作**: データ取得後から JSON シリアライズ直前に適用されます。
- **使い方**: `costPrice` や `ssn` 等の機密項目へ付与します。クローンされた応答コピーのみがマスクされ DB/キャッシュは安全です。
- **使用すべき場面**: 同一モデルを複数ロールへ返し、一般ユーザーにのみ機密項目をマスクしたい場合に使います。
- **使用を避けるべき場面と注意点**: 非 `String` 型は自動で `null` になります。`String` 型を `"******"` ではなく `null` にしたい場合は `nullifyInsteadOfMask = true`、キー自体を隠す場合は `readDto` を使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_ADMIN", "ROLE_FINANCE"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | マスクなしの元の値を閲覧できるロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |
| `maskPattern` | `String` | `"******"` | いいえ（任意） | 空でない識別子文字列（例: `"***-**-****"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | 権限不足時に String 項目へ出力されるマスク文字列。<br/>*注意点:* `nullifyInsteadOfMask = true` の場合は無視されます。`BigDecimal` や `LocalDate` など非文字列型は JSON 型維持のため `nullifyInsteadOfMask = true` を推奨します。 |
| `nullifyInsteadOfMask` | `boolean` | `false` | いいえ（任意） | `true`（権限なし時にフィールドを JSON null へ置換）または `false`（maskPattern 文字列でマスク置換）。<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true にすると String 型も maskPattern ではなく null を返却（非 String 型は常に自動で null 化）。<br/>*注意点:* 数値・日付・オブジェクト型で TypeScript/Zod クライアントのデシリアライズ破損を防ぐため必須の設定です。 |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: POST /{id}/transition の許可遷移と DELETE /{id} の削除可能状態を厳格に制御します。
- **実行時動作**: 不正な遷移や削除は HTTP 422 BusinessRuleViolationException として拒否します。
- **使い方**: 文字列の状態フィールドへ `transitions = {"CREATED:PAID,CANCELLED"}` のように定義します。
- **使用すべき場面**: 注文・ローン・請求書など不正な状態遷移や誤削除を `422` で遮断したいワークフローに最適です。
- **使用を避けるべき場面と注意点**: `"->"` 記法は使えません（必ず `":"` 区切りを使用）。`@HumanPolicy` との二重定義にも注意してください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | いいえ（任意） | 空でない識別子文字列（例: `"CREATED"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 新規作成時に未指定の場合に自動セットされる初期状態（既定 "ACTIVE"）。<br/>*注意点:* `POST` 作成時に状態が空なら自動設定されます。`transitions` の `:` 左側の開始状態と一致させてください。 |
| `transitions` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)。<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 許可する遷移ルールをコロン区切り `"FROM:TO_1,TO_2"` で指定します。<br/>*注意点:* 厳密なコロン記法 `"FROM:TO1,TO2"`（カンマ区切り遷移先、大文字小文字区別）を要求します。未定義の遷移は HTTP `400`/`409` で拒否されます。 |
| `deletableStates` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)。<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | 削除（DELETE）を許可する状態ホワイトリスト（範囲外は HTTP 422）。<br/>*注意点:* 空でない場合、指定外の状態（例: `"PAID"`）にあるエンティティへの `DELETE` は HTTP `409 Conflict` で保護されます。 |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: 自然文形式のポリシークローズを実行可能な RBAC・状態遷移・マスキング規則へコンパイルします。
- **実行時動作**: GET /human-policy で参照でき、YAML の spring-nwvmc.human-policies.<Entity> で上書き可能です。
- **使い方**: エンティティへ直接記述するか `spring-nwvmc.human-policies` YAML と併用します（`HumanPolicyRegistryHelper` がコンパイル）。
- **使用すべき場面**: プロダクト担当者やコンプライアンス担当者が可読なルールをコード外（YAML等）で管理したいときに適しています。
- **使用を避けるべき場面と注意点**: 自由記述の散文や英語以外の言語は解釈できません。厳密さ重視なら `@EntitySecurity` と `@StateMachine` を直接使ってください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | いいえ（任意） | 次のサポート値のいずれか: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`。<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | 自然英語で記述した状態遷移ディレクティブ。<br/>*注意点:* 起動時に `@StateMachine` と同一エンジンへ一度だけコンパイルされます。同一エンティティで矛盾する宣言を避けてください。 |
| `security` | `String` | `""` | いいえ（任意） | 次のサポート値のいずれか: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`。<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | 自然英語の RBAC アクセス制御ルール。<br/>*注意点:* ロール名は自動的に `ROLE_` 接頭辞で正規化され、構文エラーは起動時に Fail-Fast で検出されます。 |
| `masking` | `String` | `""` | いいえ（任意） | 次のサポート値のいずれか: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`。<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | 自然英語によるフィールドマスキング方針。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"costPrice"`）。不一致は実行時エラーとなります。 |
| `stateField` | `String` | `""` | いいえ（任意） | エンティティ上の ライフサイクル状態 フィールドに完全一致する Java プロパティ名（例: `"orderStatus"`）。<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | lifecycle ルール適用時のエンティティ状態フィールド名。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"orderStatus"`）。不一致は実行時エラーとなります。 |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: 更新ごとのフィールド差分を記録し、タイムトラベル復元と /diff 監査を実現します。
- **実行時動作**: 作成・更新・パッチ・遷移・復元時の oldValue/newValue 差分を自動保存します。
- **使い方**: `BaseAuditEntity` 継承クラスに付与すると、`AuditTrailService` が全変更履歴を自動記録します。
- **使用すべき場面**: 決済・注文・診療記録・口座など、改ざん証跡や Time-Travel（`/{id}/revisions`）が求められるエンティティに使います。
- **使用を避けるべき場面と注意点**: 高頻度書き込みのログ・テレメトリテーブルでは書き込み増幅を避けるため無効化を推奨します。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"FINANCE_LEDGER"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | 監査レコードに記録されるカテゴリ名（空時はエンティティクラス名）。<br/>*注意点:* 監査ログのドメイン分類・検索用タグです。`""` の場合は JPA エンティティクラス名になります。 |
| `recordFieldDiffs` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true 時、Time-Travel（`/{id}/revisions`）向けに項目単位の変更前後差分を記録します。<br/>*注意点:* `PUT`/`PATCH` 毎の変更前後差分を記録します。巨大テキストや高頻度更新エンティティでは容量節約のため `false` を推奨します。 |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: バイパス権限がない限り、アクティブなテナントコンテキスト単位で行の参照・更新を自動分離します。
- **実行時動作**: バイパス権限なしでテナント未設定時は HTTP 403 で拒否し、作成時の tenantId なりすまし上書きと全単体 ID 操作の IDOR を防御します。
- **使い方**: SaaS エンティティに付与すると、検索フィルタ・作成時改ざん防止・欠落時の `403` 遮断が自動適用されます。
- **使用すべき場面**: B2B SaaS の共有 DB テーブルすべてに付与し、REST・バッチ・GraphQL を通じた他テナント漏洩を防ぎます。
- **使用を避けるべき場面と注意点**: 国・通貨・共通カテゴリのような全テナント共有マスタには付けないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | いいえ（任意） | エンティティ上の テナント識別子 フィールドに完全一致する Java プロパティ名（例: `"tenantId"`）。<br/>`@MultiTenant(tenantField = "organizationId")` | テナント ID を保持する項目名（既定 "tenantId"）。<br/>*注意点:* 高速なテナント分離クエリのため DB 側に複合インデックス `(tenant_id, id)` を作成することを強く推奨します。 |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | いいえ（任意） | Spring Security ロール名の配列（例: `{"ROLE_SUPER_ADMIN"}`）。空配列 `{}` はこの操作に対する個別制限を行いません。<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | テナント境界を超えてアクセスできるプラットフォーム管理者ロール配列。<br/>*注意点:* ロール名は `RoleConstant` に `ROLE_` 接頭辞付きで定義し（例: `ROLE_ADMIN`）、Spring Security の `GrantedAuthority` と一致させてください。 |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: 新規作成・更新・Upsert の永続化直前に一意性制約を事前検証します。
- **実行時動作**: 重複値が存在する場合は ConflictBusinessException（HTTP 409）を送出します。
- **使い方**: `email` や `skuCode` 等に `@Column(unique = true)` と併用し、論理削除を除く重複を事前検査します。
- **使用すべき場面**: 論理削除済み行を除外して一意性チェックし、分かりやすい `HTTP 409` レスポンスを返したいときに使います。
- **使用を避けるべき場面と注意点**: 高並行時は DB の `UNIQUE` 制約も併用してください。重複しうる表示名などには付けません。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: 未指定時に作成またはクローン時に一意のプレフィックス付き業務コードを自動採番します。
- **実行時動作**: バリデーションおよび保存の直前にプレフィックス＋一意トークンを設定します。
- **使い方**: 文字列コード項目に `@AutoCode(prefix = "PRD-")` を付け、作成・クローン時の空値を自動採番します。
- **使用すべき場面**: DB シーケンス競合を避けつつ注文番号・SKU・店舗コード等を自動採番したい場合に使います。
- **使用を避けるべき場面と注意点**: 法的な欠番禁止の連番（税務請求書等）が必要な場合は使用しないでください。`prefix` 指定はコンパイル必須です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **はい（必須）** | 空でない識別子文字列（例: `"ORD"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | 8文字大文字 UUIDv7 ハッシュの先頭に付与する必須プレフィックス（例: "PRD-"）。<br/>*注意点:* 必須属性です。作成時にフィールドが空の場合のみ `INV-2026-0001` 形式のコードを自動採番します。 |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: sourceField から URL 向けの正規化 ASCII スラッグを自動生成します。
- **実行時動作**: Unicode ダイアクリティカルを正規化し、スラッグフィルタ検索に対応します。
- **使い方**: `slug` 項目に `@AutoSlug(sourceField = "name")` を指定します。
- **使用すべき場面**: EC 店舗・記事・カテゴリ・商品の多言語対応 SEO URL 生成に使います。
- **使用を避けるべき場面と注意点**: 存在しないフィールドを `sourceField` に指定しないでください。更新時は既存スラッグを維持します。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **はい（必須）** | エンティティ上の 文字列 フィールドに完全一致する Java プロパティ名（例: `"title"`）。<br/>`@AutoSlug(sourceField = "productName") private String slug;` | ハイフン区切りの小文字 ASCII スラグへ正規化する必須ソース項目名。<br/>*注意点:* 必須属性です。アクセント文字や Unicode を URL 安全な kebab-case へ正規化します。一意性には `@UniqueField` を併用してください。 |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **目的**: エンティティ保存前に派生数値合計を自動的に算出します。
- **実行時動作**: 起動時に ComputedFieldFailFastUtil が項目妥当性を Fail-Fast 検証します。
- **使い方**: `BigDecimal` の算出項目に付与すると、保存前にサーバー側で安全に再計算・上書きされます。
- **使用すべき場面**: 注文明細小計や合計金額（`sum(items.subTotal) - discount + shipping`）をサーバー権威で算出し改ざんを防ぐ場合に使います。
- **使用を避けるべき場面と注意点**: 段階割引や外部 API 参照を伴う価格計算には不向きです（`@ServiceOverride` を使用）。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | いいえ（任意） | 次のサポート値のいずれか: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 計算方式（"MULTIPLY" または "SUM_COLLECTION"）。<br/>*注意点:* `POST`/`PUT`/`PATCH` 保存前に自動再計算され、クライアント改ざん合計値を安全に上書きします。 |
| `sourceFields` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `{"unitPrice", "quantity"}` (numeric properties on same entity)。<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | "MULTIPLY" 時に掛け合わせる同一エンティティ内のフィールド配列。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"unitPrice"`）。不一致は実行時エラーとなります。 |
| `collectionField` | `String` | `""` | いいえ（任意） | エンティティ上の @OneToMany コレクション フィールドに完全一致する Java プロパティ名（例: `"items"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" モードで集計する @OneToMany 子コレクション項目名（例: "items"）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"items"`）。不一致は実行時エラーとなります。 |
| `itemField` | `String` | `""` | いいえ（任意） | エンティティ上の 数値 フィールドに完全一致する Java プロパティ名（例: `"subTotal"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 各子要素上で加算される数値プロパティ名（例: "subTotal"）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"subTotal"`）。不一致は実行時エラーとなります。 |
| `subtractField` | `String` | `""` | いいえ（任意） | エンティティ上の 数値 フィールドに完全一致する Java プロパティ名（例: `"discountAmount"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | 親エンティティ上の控除項目名（例: "discountAmount"）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"discountAmount"`）。不一致は実行時エラーとなります。 |
| `addField` | `String` | `""` | いいえ（任意） | エンティティ上の 数値 フィールドに完全一致する Java プロパティ名（例: `"shippingFee"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | 合計に加算される親エンティティの追加項目名（例: "shippingFee"）。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"shippingFee"`）。不一致は実行時エラーとなります。 |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: コントローラーエンドポイントへカスタム SQL/JPQL やプロバイダ Helper メソッドを関連付けます。
- **実行時動作**: 名前付きパラメータをバインドして JPA EntityManager 経由で実行します。
- **使い方**: `@AutoGet` や `@AutoPost` と併用し、`:param` プレースホルダーを `@AutoParam`/`@AutoVariable` にバインドします。
- **使用すべき場面**: Repository を書かずにネイティブ SQL レポート、CTE、ウィンドウ関数を実行したいときに最適です。
- **使用を避けるべき場面と注意点**: ユーザー入力を文字列結合せず必ず `:param` を使用し、異なる Bounded Context 間の SQL JOIN は禁止です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | いいえ（任意） | 次のサポート値のいずれか: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders。<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | 名前付き `:param` プレースホルダー対応の SQL/JPQL 文。<br/>*注意点:* SQL インジェクション防止のため必ず `:param` または `?1` を使用してください。`sqlProvider` 利用時は `""` にします。 |
| `nativeQuery` | `boolean` | `true` | いいえ（任意） | `true`（データベースネイティブ SQL を実行）または `false`（ポータブルな JPA JPQL を実行）。<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true はネイティブ SQL、false は JPQL として実行します。<br/>*注意点:* ネイティブ SQL（`true`）は CTE やウィンドウ関数を活用できます。H2/PostgreSQL/MySQL 間の移植性重視なら `false`（JPQL）にします。 |
| `resultClass` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `MonthlyRevenueDto.class`）、または無効化する `Void.class`。<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | 結果行をマッピングする任意のクラス型。<br/>*注意点:* 集計・レポートクエリでは `SELECT *` と型安全なマッピングのため必ず DTO プロジェクションクラスを指定してください。 |
| `sqlProvider` | `Class<?>` | `Void.class` | いいえ（任意） | 任意の具象 Java DTO クラス（例: `OrderAnalyticsSqlProvider.class`）、または無効化する `Void.class`。<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | 動的 SQL を返す任意のプロバイダークラス（起動時に検証されます）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `sqlProvider` はトラフィック受付前に Fail-Fast で停止します。 |
| `providerMethod` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"buildRevenueSql"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | SQL 文字列を返す `sqlProvider` 内のメソッド名。<br/>*注意点:* Java のメソッド名・フィールド名と大文字小文字まで完全一致する必要があります（例: `"buildRevenueSql"`）。不一致は実行時エラーとなります。 |
| `modifying` | `boolean` | `false` | いいえ（任意） | `true`（書込みトランザクション内で UPDATE/DELETE を実行）または `false`（読み取り専用の SELECT クエリ）。<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE を実行する場合は必ず `true` にします。<br/>*注意点:* `UPDATE`/`DELETE` 文では必須（`true`）です。自動で書込みトランザクションを開始します。 |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. データベース駆動型動的 RBAC およびフィールドマスキング用メタアノテーション (18 アノテーション)

### `@SecurityRoleEntity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **目的**: JPA エンティティを動的データベース RBAC ロールカタログ表として指定します。
- **実行時動作**: DynamicDatabaseRbacProviderHelper がロール権限を Caffeine にキャッシュし、書き込み時に即時無効化します。
- **使い方**: Role エンティティに付与し、必須の `@RoleCode`（任意で `@RoleName` / `@RolePermissions`）を併記します。
- **使用すべき場面**: 管理者が実行時に DB 上でロールや権限紐づけを動的に作成・編集できるようにしたい場合に使います。
- **使用を避けるべき場面と注意点**: `@RoleCode` を省略すると起動時検証で即失敗します。また同一コンテキストに複数定義しないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | いいえ（任意） | 正の数値（`>= 1`、単位: 秒）。例: `60L`。<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine スナップショットキャッシュの TTL 秒数（役割テーブル更新時は即時無効化）。<br/>*注意点:* 短い TTL は変更反映が速い反面クエリ数が増え、長い TTL は負荷を下げますが権限剥奪の反映が遅れます。 |

```java
@Entity
@Table(name = "sec_roles")
@SecurityRoleEntity(cacheTtlSeconds = 60L)
public class AppSecurityRole {
  @RoleCode private String code;
  @RoleName private String name;
  @RolePermissions private String permissionsCsv;
}
```

### `@RoleCode`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityRoleEntity 内で一意のロールコード列をマッピングします。
- **実行時動作**: LambdaAccessorUtil 経由で高速読み取りされ GrantedAuthority と照合されます。
- **使い方**: `@SecurityRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityRoleEntity 上のロール表示名フィールドを識別します。
- **実行時動作**: RBAC 診断メタデータおよび Dev Studio ロール検査エンドポイントで公開されます。
- **使い方**: `@SecurityRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: ロールに付与された権限コード配列または CSV 文字列フィールドをマークします。
- **実行時動作**: 動的に解析され SecurityIdentityCustomizer の有効権限セットへ展開されます。
- **使い方**: `@SecurityRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **目的**: リソース操作権限および動的フィールドマスク規則を保持する JPA エンティティを指定します。
- **実行時動作**: DatabaseRbacRuleMatcherHelper にロードされ CRUD 制御と取得後フィールドマスクを実行します。
- **使い方**: Permission エンティティに付与し、必須の `@PermissionCode` 等を指定します。
- **使用すべき場面**: リソース/アクション単位の権限や項目マスキングを DB テーブルから動的運用するときに使います。
- **使用を避けるべき場面と注意点**: `@PermissionCode` の未指定や複数エンティティ定義は起動エラーになります。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | いいえ（任意） | 正の数値（`>= 1`、単位: 秒）。例: `60L`。<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | パーミッションスナップショットの Caffeine TTL 秒数。<br/>*注意点:* 短い TTL は変更反映が速い反面クエリ数が増え、長い TTL は負荷を下げますが権限剥奪の反映が遅れます。 |

```java
@Entity
@Table(name = "sec_permissions")
@SecurityPermissionEntity(cacheTtlSeconds = 60L)
public class AppSecurityPermission {
  @PermissionCode private String code;
  @PermissionResource private String resource;
  @PermissionAction private String action;
  @PermissionFieldMask private String maskedFields;
}
```

### `@PermissionCode`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPermissionEntity 内の一意な権限コード識別子フィールドを指定します。
- **実行時動作**: 呼び出し元の権限および @EntitySecurity.permissions() と照合されます。
- **使い方**: `@SecurityPermissionEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPermissionEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPermissionEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPermissionEntity 内で対象エンティティまたはリソース名（ワイルドカード * 可）を指定します。
- **実行時動作**: DatabaseRbacRuleMatcherHelper により大文字小文字区別なし＋ワイルドカードで評価されます。
- **使い方**: `@SecurityPermissionEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPermissionEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPermissionEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPermissionEntity で保護される CRUD またはカスタムアクション種別をマッピングします。
- **実行時動作**: コントローラーメソッド名から READ / WRITE / DELETE またはカスタムアクションへ自動正規化されます。
- **使い方**: `@SecurityPermissionEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPermissionEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPermissionEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: この DB 権限ルール適用時に動的マスク対象となるカンマ区切りフィールド一覧を指定します。
- **実行時動作**: HTTP JSON シリアライズ前に @FieldSecurity と併用して動的マスクを実行します。
- **使い方**: `@SecurityPermissionEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPermissionEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPermissionEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **目的**: 認証済みユーザー主体と DB ロールおよび任意テナント境界を紐付ける JPA エンティティです。
- **実行時動作**: JWT / SecurityContext ハイドレーション時に SecurityIdentityCustomizer 経由で自動参照されます。
- **使い方**: ユーザー・ロール中間エンティティに付与し、`@UserRoleSubject` と `@UserRoleCode`（任意で `@UserRoleTenantId`）を付けます。
- **使用すべき場面**: JWT がユーザー ID のみを持ち、DB 割り当てから動的に権限付与したい場合に使います。
- **使用を避けるべき場面と注意点**: `@UserRoleSubject` を忘れないでください。外部 IdP の JWT だけで完結する場合は不要です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@SecurityUserRoleEntity(enabled = true)` | ユーザー・ロール割当テーブルの読み込み有効化フラグ（既定 true）。<br/>*注意点:* スキーマ移行中に一時的に `false` にすると DB 参照を止めつつ JWT ロール認証を継続できます。 |

```java
@Entity
@Table(name = "sec_user_roles")
@SecurityUserRoleEntity(enabled = true)
public class AppSecurityUserRole {
  @UserRoleSubject private String subject;
  @UserRoleCode private String roleCode;
  @UserRoleTenantId private String tenantId;
}
```

### `@UserRoleSubject`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityUserRoleEntity 上のプリンシパル主体（ユーザー名/JWT sub）フィールドを示します。
- **実行時動作**: 現在の SecurityContext の Authentication.getName() と照合されます。
- **使い方**: `@SecurityUserRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityUserRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityUserRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityUserRoleEntity 内で割り当てられたロールコード列をバインドします。
- **実行時動作**: ポリシー評価時に紐付く @SecurityRoleEntity の権限を動的に解決します。
- **使い方**: `@SecurityUserRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityUserRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityUserRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityUserRoleEntity のロール割り当てを特定テナント（または全体 *）へスコープ制限します。
- **実行時動作**: リクエストごとに TenantContextHolder / X-Tenant-ID に対してフィルタされます。
- **使い方**: `@SecurityUserRoleEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityUserRoleEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityUserRoleEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **目的**: priority 順に評価される明示的 ALLOW / DENY 動的認可ポリシーを格納する JPA エンティティです。
- **実行時動作**: 明示的 DENY が ALLOW を確実に上書きし、SQL 実行前に決定論的に評価されます。
- **使い方**: ポリシーエンティティへ付与し、必須の `@PolicyAllowedRoles` 等（`ALLOW` / `DENY`）を併記します。
- **使用すべき場面**: 静的 `@EntitySecurity` を DB ポリシー（緊急 `DENY` 含む）で動的に上書き・補強したいときに使います。
- **使用を避けるべき場面と注意点**: `@PolicyAllowedRoles` の省略は起動エラーになります。明示的 `DENY` は `ALLOW` より優先されます。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | いいえ（任意） | 正の数値（`>= 0`、単位: 整数優先度）。例: `10`。<br/>`@SecurityPolicyEntity(priority = 10)` | ポリシー競合時の評価優先度（小さいほど高優先、既定 100）。<br/>*注意点:* 複数ポリシーが一致した場合、小さい数値が優先されます（例: `10` は既定の `100` に優先）。 |

```java
@Entity
@Table(name = "sec_policies")
@SecurityPolicyEntity(priority = 10)
public class AppSecurityPolicy {
  @PolicyResource private String resource;
  @PolicyAction private String action;
  @PolicyAllowedRoles private String allowedRoles;
  @PolicyEffect private String effect; // ALLOW | DENY
}
```

### `@PolicyResource`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPolicyEntity 内で対象リソース名パターンをマッピングします。
- **実行時動作**: 厳密なエンティティ名とワイルドカード * の両方に対応します。
- **使い方**: `@SecurityPolicyEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPolicyEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPolicyEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPolicyEntity 内で保護対象アクション（READ/WRITE/DELETE/methodName/*）を指定します。
- **実行時動作**: サービス層への委譲前に HTTP 操作単位で評価されます。
- **使い方**: `@SecurityPolicyEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPolicyEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPolicyEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPolicyEntity ルールが対象とするロール配列または CSV 文字列をマッピングします。
- **実行時動作**: 有効な JWT 権限と DB 由来の @SecurityUserRoleEntity ロール双方と照合されます。
- **使い方**: `@SecurityPolicyEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPolicyEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPolicyEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **目的**: @SecurityPolicyEntity ルールの判定結果（ALLOW または DENY）を指定します。
- **実行時動作**: 一致する DENY ポリシーがあると即座に HTTP 403 AccessDeniedBusinessException で拒否されます。
- **使い方**: `@SecurityPolicyEntity` エンティティの対象フィールドまたはゲッターへ付与します。
- **使用すべき場面**: 既存スキーマのカラム名を変更せず `@SecurityPolicyEntity` を DB-RBAC エンジンへマッピングしたいときに使います。
- **使用を避けるべき場面と注意点**: 同じ `@SecurityPolicyEntity` エンティティ内に重複付与せず、対象エンティティ以外では使わないでください。

> **マーカーアノテーション**: 属性を持たない純粋なマーカーアノテーションです。

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. 分散ロック、冪等性、キャッシュ、マルチ DB および CloudEvents (13 アノテーション)

### `@DistributedLock`

- **パッケージ**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **目的**: AST キャッシュ（最大1024件）付き SpEL キーで排他制御を行います（既定 waitTimeMs=3000L, leaseTimeMs=5000L）。
- **実行時動作**: タイムアウト時に DistributedLockAspect が DistributedLockAcquisitionException (HTTP 409) を送出します。
- **使い方**: 非 `final` な Spring `@Service` のメソッドへ付与します。分散環境では `DistributedLockProvider` SPI を登録してください。
- **使用すべき場面**: 在庫引き当ての過剰販売、残高の同時引き落とし、バッチ競合の排他制御に使います。
- **使用を避けるべき場面と注意点**: 既定の Caffeine + ReentrantLock は単一 JVM 限定です。複数 Pod では必ず `DistributedLockProvider` SPI を差し替えてください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | いいえ（任意） | メソッド引数を参照する SpEL 式（例: `"'inventory:' + #skuId"`）、または自動生成の空文字 `""`。<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | 実行時に評価される SpEL ロックキー式（例: "'sku:' + #skuCode"）。<br/>*注意点:* ロックキーは必ず最小単位の ID（`#id`）に限定してください。固定キーは全トラフィックを直列化してしまいます。 |
| `waitTimeMs` | `long` | `3000L` | いいえ（任意） | 正の数値（`>= 0`、単位: ミリ秒）。例: `3000L`。<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | ロック取得の最大待機ミリ秒数（既定 3000L）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 短すぎると 409 競合が多発し、長すぎるとスパイク時にリクエストが滞留します。 |
| `leaseTimeMs` | `long` | `5000L` | いいえ（任意） | 正の数値（`>= 100`、単位: ミリ秒）。例: `10000L`。<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | ロックの最大リース保持時間ミリ秒（既定 5000L）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: p99 トランザクション時間より長く設定しないと書込み途中でロックが失効します。 |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: 設定可能な TTL ウィンドウ内で同時またはリプレイされた重複書き込みを防止します。
- **実行時動作**: IdempotencyAspect と ProxyIdempotencyGuardHelper が Caffeine TTL 排他ロックを実行（ConflictBusinessException HTTP 409）。未指定キーは透過し IdempotencyManagerHelper で任意 SHA-256 も利用可能です。
- **使い方**: `@AutoRestController` または非 `final` な `@Service` メソッドに付与します（失敗時はキー自動解放）。
- **使用すべき場面**: 決済確定・送金・二重送信を防ぎたい POST ミューテーションに使います。
- **使用を避けるべき場面と注意点**: GET には付与しないでください。複数インスタンスでは `IdempotencyStoreProvider` SPI を Redis 実装へ差し替えてください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | いいえ（任意） | 有効な HTTP ヘッダー名（通信時は大文字小文字を区別しません。例: `"X-Idempotency-Key"`）。<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | クライアントが送信する HTTP ヘッダー名（未指定・空白時はスキップ）。<br/>*注意点:* クライアントは論理操作ごとに一意な UUIDv7 を送り、リトライ時に同一ヘッダーを再送します。CORS `allowedHeaders` に登録してください。 |
| `ttlSeconds` | `long` | `300L` | いいえ（任意） | 正の数値（`>= 1`、単位: 秒）。例: `300L`。<br/>`@Idempotent(ttlSeconds = 900L)` | 重複送信を HTTP 409 Conflict で拒否する保持期間秒数（既定 300L）。<br/>*注意点:* レスポンスキャッシュ保持期間です。リトライ期間に応じて `300L〜86400L`（決済なら 24 時間等）を設定してください。 |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: IP・ユーザー・テナント単位でスライディングウィンドウ型のレート制限を適用します。
- **実行時動作**: nwvmc.ratelimit.rejected.total を計測し HTTP 429 Too Many Requests を返します。
- **使い方**: `@AutoRestController` 型またはメソッドに付与します。許可時は `X-RateLimit-Remaining`・`X-RateLimit-Reset`、超過時は `HTTP 429` + `Retry-After` を返します。
- **使用すべき場面**: 公開検索・認証・AI クエリ・大容量エクスポートなど乱用・高負荷を防ぎたいルートに最適です。
- **使用を避けるべき場面と注意点**: ヘルスチェックへの厳しい制限を避け、特定ユーザーやテナントによる全体枯渇を防ぐため隔離が必要な場面では `"GLOBAL"` ではなく `"USER"`・`"TENANT"`・`"IP"` を選択してください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | いいえ（任意） | 正の数値（`>= 1`、単位: リクエスト数）。例: `60`。<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | スライディングウィンドウあたりの最大リクエスト許可数（既定 60）。<br/>*注意点:* 制限超過で HTTP `429` を返す際、`X-RateLimit-Remaining`・`X-RateLimit-Reset`・RFC 6585 `Retry-After` を自動付与します。 |
| `windowSeconds` | `int` | `60` | いいえ（任意） | 正の数値（`>= 1`、単位: 秒）。例: `60`。<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | レート制限の計測ウィンドウ秒数（既定 60）。<br/>*注意点:* カウントウィンドウ長を定義し、`X-RateLimit-Reset` と `Retry-After` の計算基準になります。 |
| `partitionKey` | `String` | `"IP"` | いいえ（任意） | 次のサポート値のいずれか: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)。<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | 動的分割キー（大小文字区別なし）: "IP"/"clientIp"、"USER"（未認証時は IP フォールバック）、"TENANT"、"GLOBAL"、または SpEL "#expr"。<br/>*注意点:* `"USER"` は認証ユーザー毎に分離し未認証時は IP へフォールバックします。`"GLOBAL"` は全呼出元で 1 枠を共有するため注意してください。 |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: Actuator/Micrometer へのテレメトリ報告付きで操作を Resilience4j サーキットブレーカー保護します。
- **実行時動作**: 失敗率超過時に OPEN (HTTP 503) へ遷移し nwvmc.resilience.circuitbreaker.state ゲージを更新します。
- **使い方**: 外部 API や AI プロバイダー等と通信するコントローラーへ付与して連鎖障害を遮断します。
- **使用すべき場面**: 下流障害時にタイムアウト待ちでスレッドを枯渇させず即座に `HTTP 503` でフェイルファストさせたいときに使います。
- **使用を避けるべき場面と注意点**: `CircuitBreakerErrorFilterUtil` が 4xx `BaseBusinessException` を自動除外します。クライアント起因エラーを素の `RuntimeException` で包まないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"payment-gateway-cb"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j に登録されるサーキットブレーカー識別名。<br/>*注意点:* Resilience4j レジストリ名と Micrometer メトリクスタグに使われます。`""` はクラス名から自動命名します。 |
| `failureRateThreshold` | `float` | `50.0f` | いいえ（任意） | 正の数値（`1.0f .. 100.0f`、単位: パーセント）。例: `50.0f`。<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | OPEN 状態へ遮断遷移する失敗率しきい値（既定 50.0f%）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 4xx の `BaseBusinessException` は自動除外され、5xx やインフラ障害のみがサーキット開放に計上されます。 |
| `waitDurationInOpenStateSeconds` | `int` | `10` | いいえ（任意） | 正の数値（`>= 1`、単位: 秒）。例: `15`。<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | HTTP 503 返却を続ける OPEN 状態の待機秒数（既定 10 秒）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 4xx の `BaseBusinessException` は自動除外され、5xx やインフラ障害のみがサーキット開放に計上されます。 |
| `slidingWindowSize` | `int` | `20` | いいえ（任意） | 正の数値（`>= 1`、単位: 呼び出し回数）。例: `20`。<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | 失敗率を判定するスライディングウィンドウの直近サンプル数（既定 20）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 4xx の `BaseBusinessException` は自動除外され、5xx やインフラ障害のみがサーキット開放に計上されます。 |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | いいえ（任意） | 正の数値（`>= 1`、単位: 呼び出し回数）。例: `5`。<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | HALF_OPEN 状態で回復判定のために許可する試行回数（既定 5）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 4xx の `BaseBusinessException` は自動除外され、5xx やインフラ障害のみがサーキット開放に計上されます。 |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: 一時的な障害を設定可能な指数バックオフで自動リトライします。
- **実行時動作**: 設定回数のリトライを使い切ると標準例外を送出します。
- **使い方**: 一過性の DB ロックやネットワーク瞬断から自動復旧させたいメソッド/コントローラーへ付与します。
- **使用すべき場面**: べき等な GET 参照・PUT 置換・`@Idempotent` 保護下の呼び出しに対して使います。
- **使用を避けるべき場面と注意点**: `@Idempotent` のない非べき等 POST や決済課金に付けると二重実行を引き起こすため厳禁です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"erp-sync-retry"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j Retry レジストリ名。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 合計リトライ時間が上流ゲートウェイのタイムアウトを超えないよう設計してください。 |
| `maxAttempts` | `int` | `3` | いいえ（任意） | 正の数値（`>= 1`、単位: 試行回数）。例: `3`。<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | 初回実行を含む最大試行回数（既定 3）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 合計リトライ時間が上流ゲートウェイのタイムアウトを超えないよう設計してください。 |
| `waitDurationMs` | `long` | `500L` | いいえ（任意） | 正の数値（`>= 50`、単位: ミリ秒）。例: `500L`。<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | 初回リトライまでの待機ミリ秒数（既定 500L）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 合計リトライ時間が上流ゲートウェイのタイムアウトを超えないよう設計してください。 |
| `backoffMultiplier` | `double` | `2.0d` | いいえ（任意） | 正の数値（`>= 1.0d`、単位: 乗数）。例: `2.0d`。<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | 連続リトライ間の指数バックオフ倍率（既定 2.0d）。<br/>*注意点:* 本番のレイテンシ SLA に合わせて慎重に調整してください: 合計リトライ時間が上流ゲートウェイのタイムアウトを超えないよう設計してください。 |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **パッケージ**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: RFC 7232 準拠の弱い ETag（W/"..."）を生成し Cache-Control および HTTP 304 Not Modified 応答を返却します。
- **実行時動作**: HIT/MISS カウンターを nwvmc.cache.http.requests に記録します。
- **使い方**: 読み取り専用コントローラーや GET メソッドに付与し、`ETag` と `304 Not Modified` を自動応答させます。
- **使用すべき場面**: 準静的なカタログ・マスタ・公開一覧に使い、`304` 応答で転送量を削減します。
- **使用を避けるべき場面と注意点**: 個人情報・マルチテナント・ロール別マスク対象データに `isPrivate = false`（既定）を残すと CDN 漏洩するため厳禁です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | いいえ（任意） | 正の数値（`>= 0`、単位: 秒）。例: `120`。<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Cache-Control ヘッダーの `max-age` 秒数（既定 60）。<br/>*注意点:* `Cache-Control: max-age=<N>` を付与します。`0` と `generateETag = true` の併用で即時 `304 Not Modified` 再検証が可能です。 |
| `isPrivate` | `boolean` | `false` | いいえ（任意） | `true`（ブラウザ専用プライベートキャッシュ（CDN 不可））または `false`（プロキシ・CDN 共有可能な public キャッシュ）。<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true で `private`（共有 CDN 不可）、false で `public` を出力します。<br/>*注意点:* 重要: 認証付き・マルチテナント・`@FieldSecurity` 対象エンドポイントでは CDN 経由の他ユーザー情報漏洩を防ぐため必ず `isPrivate = true` にしてください。 |
| `mustRevalidate` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | `, must-revalidate` を付与して期限切れ時の再検証を強制します。<br/>*注意点:* `maxAgeSeconds` 経過後にオリジン再検証なしで古いキャッシュを配信するのを防ぎます。 |
| `generateETag` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | SHA-256 ETag を生成し、`If-None-Match` 一致時に `HTTP 304` を返却します。<br/>*注意点:* レスポンスから RFC 7232 `ETag` を生成し、`If-None-Match` 一致時は 0 バイトの `304 Not Modified` を返します。 |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: サーバー側参照結果を Caffeine L1 / Redis L2 エンジンへキャッシュします。
- **実行時動作**: app.framework.cache.type によりグローバル設定が可能です。
- **使い方**: サービス読み取りメソッドへ付与し、`app.framework.cache.type` で Caffeine/Redis を切り替えます。
- **使用すべき場面**: 読み取り比率が高い ID 参照やメタデータ取得に適しています（クローン保護付き）。
- **使用を避けるべき場面と注意点**: 頻繁に更新されるテーブルや、クローン保護なしでの直接返却エンティティには使わないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `{"productCatalog"}` (Caffeine/Redis cache region names)。<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Caffeine L1 / Redis L2 のターゲットキャッシュ名配列。<br/>*注意点:* Caffeine/Redis の設定領域名と一致させ、更新・削除側には必ず対応する `@AutoCacheEvict` を設定してください。 |
| `key` | `String` | `""` | いいえ（任意） | メソッド引数を参照する SpEL 式（例: `"'product:' + #id"`）、または自動生成の空文字 `""`。<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL キャッシュキー式（`v0.1.0` は決定論的に `EntityName:id` を解決）。<br/>*注意点:* マルチテナント環境では他テナントへの誤配信を防ぐため必ずテナント識別子をキーに含めてください。 |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: データ変更時に古いサーバーキャッシュエントリを自動破棄します。
- **実行時動作**: 更新完了後に確実に実行され、古い読み取り残存を防ぎます。
- **使い方**: 更新・削除メソッドに付与し、`@AutoCacheable` と同じキーパターンで確実に無効化します。
- **使用すべき場面**: `@AutoCacheable` でキャッシュされたレコードを更新・状態変更・削除するときに使います。
- **使用を避けるべき場面と注意点**: 高頻度の `create` に `allEntries = true` を付けるとキャッシュスタンピードを招くため避けてください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `{"productCatalog"}` (target cache region names to evict)。<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | メソッド完了時に無効化するキャッシュ名配列。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `value` はトラフィック受付前に Fail-Fast で停止します。 |
| `key` | `String` | `""` | いいえ（任意） | メソッド引数を参照する SpEL 式（例: `"'product:' + #id"`）、または自動生成の空文字 `""`。<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | 変更された単一エンティティのキャッシュエントリのみを削除する SpEL 式。<br/>*注意点:* `@AutoCacheable.key` と完全一致するキー式にしてください。`allEntries = true` の場合は無視されます。 |
| `allEntries` | `boolean` | `false` | いいえ（任意） | `true`（対象キャッシュ領域の全エントリを削除）または `false`（key で指定した単一エントリのみ削除）。<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true 時は影響エンティティのプレフィックス範囲のみを安全に一括削除します。<br/>*注意点:* 高負荷時の全件削除は DB へのキャッシュスタンピードを招く恐れがあるため、可能な限り単一 `key` 削除を推奨します。 |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **パッケージ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: 処理時間を計測し、閾値超過のスロー呼び出し時に WARN ログを出力します。
- **実行時動作**: DynamicEntityMetricsHelper 経由でレイテンシタイマーも記録します。
- **使い方**: `@AutoRestController` や Service に付与し、SLA 超過の遅延を自動検知します。
- **使用すべき場面**: 複雑な集計・バッチ・GraphQL・`@CustomQuery` でスロークエリ退行を早期発見したいときに使います。
- **使用を避けるべき場面と注意点**: 高スループット経路で `warningThresholdMs = 0` を設定したり長時間接続の SSE `/events` に付けたりしないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | いいえ（任意） | 正の数値（`>= 1`、単位: ミリ秒）。例: `300L`。<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | 警告ログ（`WARN`）が出力される実行時間しきい値ミリ秒（既定 500L）。<br/>*注意点:* 閾値超過時に `traceId` 付き `WARN` ログを出力します。ログ過多を防ぐため現実的な値（`200L〜1000L`）を設定してください。 |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **パッケージ**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **目的**: コミット後に Virtual Threads 上で HMAC-SHA256 署名付き Webhook を非同期配信します。
- **実行時動作**: WebhookHmacSignerHelper で署名を生成し定数時間比較で検証します。
- **使い方**: JPA `@Entity` に付与すると DB コミット後に Outbox / Virtual Thread で非同期署名送信されます。
- **使用すべき場面**: 注文確定・決済完了を外部パートナーや SaaS 顧客の Webhook エンドポイントへ安全に通知したいときに使います。
- **使用を避けるべき場面と注意点**: PII/PCI 機密を含む場合は `includeFullPayload = false` にし、内部 SSRF アドレスを登録しないでください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | いいえ（任意） | 0 個以上の有効な値を含む配列: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`。<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC 署名付き Webhook 配信を発火させるイベント配列。<br/>*注意点:* DB コミット後（`AFTER_COMMIT`）に非同期配信されるため、ロールバックされた変更で誤送信されることはありません。 |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | いいえ（任意） | 有効な HTTP ヘッダー名（通信時は大文字小文字を区別しません。例: `"X-Webhook-Signature"`）。<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 検証署名を格納する HTTP ヘッダー名。<br/>*注意点:* HMAC-SHA256 署名を格納します。受信側は処理前に定数時間比較で必ず検証してください。 |
| `includeFullPayload` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@EntityWebhook(includeFullPayload = false)` | true はエンティティ JSON 全体を送信、false は ID とメタデータのみ送信します。<br/>*注意点:* PII や決済エンティティでは `false`（ID とイベント種別のみ通知）にし、受信側が認証付き GET で取得する構成を推奨します。 |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **パッケージ**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: トランザクションコミット後に CNCF CloudEvents v1.0 エンベロープを発行します。
- **実行時動作**: TransactionRuntimeBridge.executeAfterCommit によりロールバック時の誤発火を防ぎます。
- **使い方**: エンティティやメソッドに付与し、`AFTER_COMMIT` で `CloudEventEnvelopeDto` を購読します。
- **使用すべき場面**: モジュール境界（Bounded Context）間で SQL JOIN を使わずイベント駆動連携させたいときに使います。
- **使用を避けるべき場面と注意点**: 外部向け `@EntityWebhook` と混同せず、必ず `AFTER_COMMIT` フェーズで処理してください。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | いいえ（任意） | 空でない識別子文字列（例: `"com.acme.order.lifecycle"`）。`""` の場合はフレームワーク既定規約を使用します。<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CloudEvents の `type` 文字列（例: "io.nwvmc.order.created"）。<br/>*注意点:* CloudEvents 1.0 の逆 DNS 命名（`com.company.domain.event`）に従ってください。`""` で自動生成します。 |
| `source` | `String` | `""` | いいえ（任意） | `/` で始まる有効な HTTP パス（例: `/services/order-api`）、または自動導出する空文字 `""`。<br/>`@PublishCloudEvent(source = "/services/order-api")` | 発生元のコンテキストを表す CloudEvents `source` URI。<br/>*注意点:* マイクロサービス間のイベント追跡用 CNCF CloudEvents `source` URI を設定します。 |
| `publishOnCreate` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | 作成コミット後に CloudEvent を発行するか（既定 true）。<br/>*注意点:* コミット後（`AFTER_COMMIT`）にのみ Spring Events / Kafka / RabbitMQ 経由で発行されます。 |
| `publishOnUpdate` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@PublishCloudEvent(publishOnUpdate = true)` | 更新コミット後に CloudEvent を発行するか（既定 true）。<br/>*注意点:* 閲覧数など高頻度更新エンティティではメッセージブローカー過負荷を防ぐため `false` にしてください。 |
| `publishOnDelete` | `boolean` | `true` | いいえ（任意） | `true`（有効）または `false`（無効）。<br/>`@PublishCloudEvent(publishOnDelete = true)` | 削除コミット後に CloudEvent を発行するか（既定 true）。<br/>*注意点:* 物理削除および `@SoftDelete` の双方で発火し、下流の検索インデックスやリードモデルを同期します。 |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **パッケージ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: エンティティやクエリ操作を指定した論理データソースキーへルーティングします。
- **実行時動作**: ルーティング回数を framework.datasource.routing.total メトリクスに記録します。
- **使い方**: コントローラーや非 `final` サービスへ付与します。完了後は元のコンテキストキーが自動復元されます。
- **使用すべき場面**: CQRS の読み取りレプリカ分散や重い BI 分析クエリのオフロードに使用します。
- **使用を避けるべき場面と注意点**: すでに開始された `@Transactional` トランザクションの途中で切り替えても接続は切り替わりません。また `final class` 禁止です。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | いいえ（任意） | 次のサポート値のいずれか: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`。<br/>`@TargetDataSource("REPLICA")` | `DataSourceContextHolder` へ設定されるデータソースキー（"PRIMARY", "REPLICA" 等）。<br/>*注意点:* `DynamicRoutingDataSource` に登録済みのキーと一致させる必要があります。未登録キーは `PRIMARY` へフォールバックします。 |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **パッケージ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **目的**: エンティティごとにデータベースエンジン種別と論理クラスターシャードを割り当てます。
- **実行時動作**: MultiPlatformDataSourceRegistryHelper と TenantDatabaseRoutingResolverHelper が動的に解決します。
- **使い方**: 特定エンジン・専用クラスタへ配置したいエンティティやメソッドへ付与します。
- **使用すべき場面**: 財務・分析・監査等の専用 DB クラスタを持つポリグロット永続化構成で使います。
- **使用を避けるべき場面と注意点**: 物理 JDBC 接続設定の代わりにはならず、別クラスタ間の JPA JOIN は実行できません。

| 属性 | Java 型 | 既定値 | 必須 | 有効値と使用例 | 説明と実行時の注意点 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | いいえ（任意） | 次のサポート値のいずれか: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | 対象データベースエンジン識別子（"H2", "POSTGRESQL", "MYSQL", "ORACLE" 等）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `platform` はトラフィック受付前に Fail-Fast で停止します。 |
| `cluster` | `String` | `"PRIMARY"` | いいえ（任意） | 次のサポート値のいずれか: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | ターゲットクラスタ／シャード名（"PRIMARY", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER" 等）。<br/>*注意点:* アプリ起動時に即時検証されます。スペルミスや不正な `cluster` はトラフィック受付前に Fail-Fast で停止します。 |
| `readOnly` | `boolean` | `false` | いいえ（任意） | `true`（読み取り専用レプリカプールへルーティング）または `false`（読み書き可能なマスタープールへルーティング）。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true のとき読み取り専用レプリカへのルーティング優先度を示します。<br/>*注意点:* `POST`/`PUT`/`PATCH`/`DELETE` に `readOnly = true` は絶対に設定しないでください（レプリカは書込みを拒否します）。 |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
