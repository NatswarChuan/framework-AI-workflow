# 04. セキュリティ、マルチクラウドストレージ、`@ServiceOverride`、Metrics および 20 言語 i18n（`0.1.0`）

> **言語**: [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | **日本語** | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#security-rbac)

---

## 1. NIST Level 2 セキュリティ、DB 駆動 RBAC、サーフェスロックダウンとアンチスキャナ保護

- **`@EntitySecurity`、`@FieldSecurity`、`@MultiTenant`**：テーブル単位の RBAC（`readRoles`、`writeRoles`、`deleteRoles`、`permissions`、カスタムメタアノテーション合成対応）、所有者ガード（`ownerField`）、列マスキング/null 化（`viewRoles`、`maskPattern`、`nullifyInsteadOfMask`）、およびフェイルクローズ `@MultiTenant` 分離（未設定時 `403`、作成時なりすまし上書き、全 ID 操作の IDOR 検証）。
- **DB 駆動動的 RBAC（`DynamicDatabaseRbacProviderHelper`）**：4 つのドメイン JPA エンティティに `@SecurityRoleEntity`、`@SecurityPermissionEntity`、`@SecurityUserRoleEntity`、`@SecurityPolicyEntity` と対応マーカーを付与します。明示的 `DENY` > `ALLOW` 優先、`X-Tenant-ID` テナント分離、`DatabaseRbacCacheInvalidationListener` による L1 Caffeine 自動失効、`PureJavaSecurityFilterBridge` による既存 `SecurityFilterChain` 共存、`SecurityIdentityCustomizer` による拡張を提供（`app.framework.security.dynamic-database-rbac-enabled=true`）。
- **セキュアバイデフォルトのロックダウン（`DevStudioProperties` + `SurfaceAccessGuardrailUtil`）**：`app.framework.studio.enabled=false`（既定）時は未認証の `/system/**` を `401` で遮断し無効 Studio を `404 Not Found`（権限不足は `403`）で拒否。`demo-token-endpoint-enabled=false` 時は `POST /api/v1/auth/token` が `404` を返します。
- **例外のアンラップとサニタイズ**：`ExceptionCauseUnwrapperUtil` は詳細原因をサーバーログへ記録しつつ、クライアントへ安全な `ApiResponse<Void>` のみ返却します。
- **SPA & 冪等性 CORS（`SecurityFilterChainBridge`）**：設定可能なオリジンパターン（`*`）と `Authorization`、`Idempotency-Key`、`X-Idempotency-Key`、`X-Language`、`X-Tenant-ID`、`traceparent`、`X-Request-ID` を許可します。

---

## 2. `@ServiceOverride` エスケープハッチと標準 MVC 出力（`GET /system/studio/eject`）

個別エンドポイントが動的 CRUD の範囲を超える場合：

1. **インプレース `@ServiceOverride`**：`AutoApiController<E>` のメソッドへ `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` を付与し、`EscapeHatchDispatchHelper` が `MethodHandleCacheUtil` 経由で独自 Spring Bean へ直接委譲します。
2. **標準コード Ejection（`/system/studio/eject`）**：`GET /system/studio/eject?target=<EntityOrControllerName>` で `ControllerEjectionHelper` により独立した 5 つの標準 Spring MVC ファイル（`DTO`、`Repository`、`Service`、`ServiceImpl`、`Controller`）を書き出せます。

---

## 3. Micrometer オブザーバビリティ（`DynamicEntityMetricsHelper` & `MetricConstant` — 11 メトリクス）

| メトリクス名 | 種別 | タグ | 計測対象 |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | 動的エンティティ CRUD 呼び出し総数 |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | エンドツーエンド処理レイテンシ |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | 動的プロキシコントローラー処理時間 |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag 評価結果（`HIT` / `MISS`） |
| `nwvmc.outbox.pending.events` | Gauge | — | トランザクション Outbox 待機イベント数 |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Outbox バッチ配信レイテンシ |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | 状態コード（`0=CLOSED`、`1=HALF_OPEN`、`2=OPEN`） |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | スライディングウィンドウ上限超過による拒否件数 |
| `framework.outbox.dispatched.total` | Counter | — | 正常配信済み Outbox イベント累計 |
| `framework.realtime.active.connections` | Gauge | — | アクティブ SSE 接続数（`SseEmitterRegistryHelper`） |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant 別データソースルーティング回数（オプトイン） |

---

## 4. 20 言語 `/system/studio`、RTL 対応とホスト国際化（`i18n/`）

- **20 組み込みロケール（`I18nConstant`）**：`en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl`（`ar`、`fa`、`ur` は `dir="rtl"`）。
- **決定的ロケール解決（`LocaleResolutionUtil` & `HeaderLocaleResolver`）**：`?lang=` -> `X-Language` -> `NWVMC_LANG` Cookie -> `Accept-Language` -> `app.framework.i18n.default-locale`（`en`）。未対応タグは安全に `en` へフォールバックします。
- **ホスト側メッセージカスタマイズ**：`I18nConfig` は UTF-8 `ReloadableResourceBundleMessageSource`（`classpath:i18n/messages`、`cacheSeconds=3600`）を構成します。`app.framework.studio.show-i18n-diagnostics=true` で `/system/studio` に診断バーを表示します。

---

## 5. JMH `1.37` マイクロベンチマークスループット（`DynamicProxyThroughputBenchmarkTest`）

| ディスパッチ経路（`ops/ms`） | 計測平均スループット |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. マルチクラウドストレージ（`FileStorageController` — `LOCAL` / `S3` / `GCS`）

内蔵 `FileStorageController`（`/api/v1/storage/*`）は `POST /upload`・`GET /download/{fileId}`・`GET /metadata/{fileId}`・`GET /exists/{fileId}`・`DELETE /{fileId}`・`POST /presigned-url` を `app.framework.storage.provider`（`LOCAL`/`S3`/`GCS`）および `StorageCustomizer` で提供します。

> **本番セキュリティ対策:** 公開前に `app.framework.security.require-authenticated-api-paths: true` を有効化し、Spring Security `SecurityFilterChain` で `/api/v1/storage/**` を保護してください。
