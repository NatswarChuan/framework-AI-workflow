# 03. 13 動的フィルタ演算子、Query Guardrails、Keyset O(1) および GraphQL SDL（`0.1.0`）

> **言語**: [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | **日本語** | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#query-dsl)

---

## 1. 13 種類の動的フィルタ演算子（`FilterOperatorConstant`）

すべてのフィルタクエリパラメータは `QueryFilterParameterUtil`（`PATTERN_MALICIOUS_SQL`、`PATTERN_XSS`、`PATTERN_SAFE_FIELD_PATH`）で検証された上で、パラメータ化 JPA Criteria クエリへコンパイルされます：

| 演算子 | URL 構文 | SQL 相当 | 説明 |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | 完全一致比較（演算子接尾辞を省略した場合の既定）。 |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | 不一致除外フィルタ。 |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | 大文字小文字を区別しない部分一致。 |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | 前方一致検索（B-Tree インデックス活用可能）。 |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | 後方一致検索。 |
| `gt` | `price.gt=100` | `> 100` | より大きい（数値・ISO-8601日時対応）。 |
| `gte` | `price.gte=100` | `>= 100` | 以上比較。 |
| `lt` | `stock.lt=50` | `< 50` | 未満比較。 |
| `lte` | `stock.lte=50` | `<= 50` | 以下比較。 |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | カンマ区切り候補リスト内のいずれかに一致。 |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | 除外リストに含まれないレコードを抽出。 |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | 下限・上限を含む範囲指定（カンマ区切り）。 |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true で IS NULL、false で IS NOT NULL を判定。 |

### クエリ DoS ガードレール（`QueryGuardrailProperties` — `app.framework.query-guardrails`）

`QueryGuardrailEnforcerUtil` は JPA 実行前に受信したフィルタ条件とソートパスを検証します：

- `max-join-depth`（既定 `3`）：ドット区切り関連パス結合の最大深さを制限。
- `max-filter-criteria`（既定 `25`）：1 リクエスト当たりの最大フィルタ条件数を制限。
- `max-page-size`（既定 `200`）：1 ページ当たりの最大取得件数を制限。
- `max-unpaged-fetch-limit`（既定 `5000`）：ページングなし `GET /all` 等での OOM 防止上限。
- `eager-fetch-singular-relations`（既定 `true`）：`?expand=` 指定がない限り単一関連を `LEFT JOIN FETCH` で先読み。
- `allowed-filter-fields` & `allowed-sort-fields`：フィルタ・ソート可能な項目を厳格に限定する任意のホワイトリスト。

---

## 2. 定数時間 O(1) カーソル Keyset ページネーション（`GET /keyset`）

主キーに時系列単調増加の **UUIDv7** を採用しているため、`/keyset` は `dir=asc`・`dir=desc` の双方向で `size + 1` プローブを用い $O(1)$ シーク時間でカーソル境界へ直接到達します：

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. ステートレス JPA 永続化、`@Version` および非破壊スパースフィールド選択

- **`spring.jpa.open-in-view=false`、`?expand=` と楽観的ロック**：OSIV を無効化し、選択的 `?expand=rel1,rel2`、`BaseAuditEntity` の `@Version`（競合時 `409 Conflict`）、および `JpaAssociationReferenceUtil` によるデタッチ FK スタブ解決を提供します。
- **`fields=id,skuCode,productName,retailPrice`**：`DynamicSchemaProjectionHelper` 内で `EntityCloneSnapshotHelper` を用いるため、REST / GraphQL の部分射影が Hibernate 管理エンティティや 1 次キャッシュを破壊しません。

---

## 4. 動的 GraphQL エンジン（`GraphQLDynamicApiController`）

| エンドポイント | HTTP | 機能 |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | 自動合成された GraphQL SDL（`list<Entity>s`、Object / Input 型）を出力 |
| `/api/v1/graphql` | `POST` | 統合クエリおよびミューテーション実行エンドポイント |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | インタラクティブ GraphiQL プレイグラウンド |
