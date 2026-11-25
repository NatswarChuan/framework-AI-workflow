# 02. 自動生成される 40 REST 契約とプラットフォームコントローラー一覧（`0.1.0`）

> **言語**: [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | **日本語** | [中文](../zh/02_REST_API_CATALOG.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#endpoints)

---

## 1. エンティティ当たり 40 の合成可能 `@Auto*` 契約（既定公開 `38` 件）

`AutoApiController<E>` を継承（または `AutoReadApi`、`AutoKeysetApi`、`AutoAnalyticsApi`、`AutoSchemaApi`、`AutoExportImportApi`、`AutoWriteApi`、`AutoBatchApi`、`AutoWorkflowApi`、`AutoAiApi` を選択合成）すると、`DynamicControllerProxyRegistrarHelper` と `SpringMvcEndpointBridge` が最大 **40** 契約を自動登録します（`AutoApiReadController` `15` 件 + `AutoWriteApi`/`AutoBatchApi` `10` 件 + `AutoApiEnterpriseController` `11` 件 + `AutoExportImportApi` `4` 件。`/events` は `@Hidden`、`/{id}/**` は `enableNestedSubResources = true` が必要なため Swagger UI 既定表示は **`38`** 件）。`@AutoRestController(readDto, createDto, updateDto)` および標準 Spring MVC の `@RequestBody`/`@RequestParam`/`@PathVariable` に対応します。

### グループ 1：参照・分析・クライアントコード生成（`AutoApiReadController` — 15 契約）

| # | HTTP | サブパス | メソッド | 動作仕様 |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 13演算子フィルタ・複数ソート・JOIN FETCH・フィールド選択対応ページネーション。 |
| 2 | `GET` | `/keyset` | `getKeysetPage` | UUIDv7 カーソルを用いた定数時間 O(1) Keyset ページング。 |
| 3 | `GET` | `/all` | `getAll` | フィルタ条件に一致するレコード一覧をドロップダウンや参照表向けに一括返却します。 |
| 4 | `GET` | `/count` | `count` | 動的フィルタ条件に合致する件数を SQL COUNT(*) で取得します。 |
| 5 | `GET` | `/exists` | `exists` | 条件に一致するレコードが1件以上存在するかを高速に真偽判定します。 |
| 6 | `GET` | `/aggregate` | `aggregate` | 数値フィールドに対して SQL SUM・AVG・MIN・MAX・COUNT を集計します。 |
| 7 | `GET` | `/distinct` | `findDistinctValues` | 重複を除いた一意値一覧をフィルタ候補向けに取得します。 |
| 8 | `GET` | `/top` | `findTopRecords` | ソート順の上位 N 件をランキングやアラート表示向けに返却します。 |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | グラフおよび BI レポート向けの動的 GROUP BY 集計メトリクスです。 |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA フィールド定義・Jakarta バリデーション制約・RBAC 可視性メタデータを公開します。 |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | JPA フィールド定義から TypeScript インターフェースを自動生成します。 |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | 動的フォーム構築向けの JSON Schema Draft 契約を生成します。 |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil を通じて Zod バリデーションスキーマ（text/plain）を生成します。 |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod 解析と CRUD ヘルパーを備えた型付き TypeScript Fetch クライアントを生成します。 |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7 で単一エンティティを取得し、@FieldSecurity マスキングと @HttpCacheable ETag を適用します。 |

### グループ 2：更新・バッチ・Upsert・パッチ・削除・復元（`AutoWriteApi` + `AutoBatchApi` — 10 契約）

| # | HTTP | サブパス | メソッド | 動作仕様 |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation・@AutoCode・@AutoSlug・@UniqueField・@ComputedField を適用してエンティティを新規作成します。 |
| 17 | `POST` | `/batch` | `createBatch` | 検証済みコレクションを単一のアトミックトランザクション内で一括登録します。 |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField キーまたは明示的 UUIDv7 ID を基準にアトミックな Upsert を実行します。 |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | レコード配列に対してトランザクション制御された一括 Upsert を実行します。 |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | 大容量バッチを設定可能なチャンク単位で処理し、要素ごとの BatchExecutionResultDto 診断を返却します。 |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | URL フィルタに一致する全レコードをリクエストボディの非 null 項目で一括部分更新します。 |
| 22 | `PUT` | `/{id}` | `update` | サーバー側の監査カラムを保持したままエンティティを全体更新します。 |
| 23 | `PATCH` | `/{id}` | `patch` | 既存エンティティへ null 以外の入力フィールドのみを上書きマージします。 |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles と @StateMachine deletableStates を検証したうえで論理削除します。 |
| 25 | `POST` | `/{id}/restore` | `restoreById` | 論理削除済みのエンティティを復元し通常クエリ対象へ戻します。 |

### グループ 3：エンタープライズライフサイクル・AI・RFC 6902・ストリーミング（`AutoApiEnterpriseController` — 11 契約）

| # | HTTP | サブパス | メソッド | 動作仕様 |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | クライアント側の競合（Read-Modify-Write）を排除し数値項目をアトミックに増減します。 |
| 27 | `POST` | `/{id}/transition` | `transitionState` | 検証済み @StateMachine に従い targetState へ状態遷移し監査と Webhook を発火します。 |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | エンティティを複製し、新しい UUIDv7 ID と @AutoCode フィールドを再発行します。 |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent Events (SSE) リアルタイム配信（text/event-stream のため Swagger UI では @Hidden）。 |
| 30 | `GET` | `/ai/context` | `getAiContext` | フィールド定義とフィルタ演算子を記述した LLM 向け JSON ツールスキーマを出力します。 |
| 31 | `POST` | `/ai/query` | `queryAi` | 自然言語プロンプトを有界かつパラメータ化された安全な JPA Criteria クエリへ変換します。 |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | コンパイル済み @HumanPolicy 状態遷移・RBAC ロール・YAML 上書き設定を返却します。 |
| 33 | `GET` | `/health` | `getEntityHealth` | エンティティに対応するデータベーステーブルの状態とレコード件数を検査します。 |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | 構造化された RFC 6902 JSON Patch 操作（replace・add・remove）を適用します。 |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | 2つの有効エンティティレコード間（id 対 targetId）のフィールド差分を計算します。 |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | 再帰的サブリソース参照（@AutoRestController(enableNestedSubResources = true) で有効化）。 |

### グループ 4：CSV / JSONL 一括エクスポート・インポート（`AutoExportImportApi` — 4 契約）

| # | HTTP | サブパス | メソッド | 動作仕様 |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | フィルタ条件に一致するデータを RFC-4180 準拠 CSV 形式でエクスポートします。 |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | 一致する行を application/x-ndjson 形式の改行区切り JSON でストリーミング出力します。 |
| 39 | `POST` | `/import/csv` | `importCsv` | RFC-4180 CSV 生テキストペイロードを分割バッチでインポートします。 |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | 改行区切り NDJSON データセットをストリーミングインポートします。 |

---

## 2. 組み込みプラットフォームコントローラー

| エンドポイント / プレフィックス | コントローラー | 責務と本番ロックダウン |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20 言語対応 Developer Studio（RTL `ar`, `fa`, `ur`）。`app.framework.studio.enabled=false` 時は `401` を返却 |
| `GET /system/studio/eject` | `DevEjectionController` | 標準 Spring MVC の Controller / Service / Repository コードを出力。`SurfaceAccessGuardrailUtil` で保護 |
| `POST /api/v1/auth/token` | `AuthController` | 開発用 HMAC-SHA512 JWT を発行。`demo-token-endpoint-enabled=false` 時は `404` を返却 |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`、`GET /download/{fileId}`、`GET /metadata/{fileId}`、`POST /presigned-url`（`LOCAL` / `S3` / `GCS`） |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`、`POST ""`、`GET /explorer`（`@Hidden`） |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | 指定した ISO-8601 UTC 時刻におけるエンティティ状態のポイントインタイム復元 |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7` コアテレメトリ `*Customizer` グループの有効な SPI Bean 一覧（`StorageCustomizer` は `StorageCustomizerRegistryHelper` 管理、計 `8` SPI） |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Resilience4j サーキットブレーカーのリアルタイム稼働メトリクス |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | マルチデータソースのヘルスチェック診断 |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | 現在の MDC コンテキスト上の W3C `traceparent` と UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat の `400/404/405/413/431/500` コンテナエラーを統一形式 `ApiResponse<Void>` へ変換 |
