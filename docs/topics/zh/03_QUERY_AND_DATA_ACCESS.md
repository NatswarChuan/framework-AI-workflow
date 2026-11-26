# 03. 13 种动态过滤运算符、查询护栏、O(1) 游标分页与 GraphQL SDL（`0.1.0`）

> **语言**: [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#query-operators)

---

## 1. 13 种动态过滤运算符（`FilterOperatorConstant`）

所有过滤查询参数均经 `QueryFilterParameterUtil`（`PATTERN_MALICIOUS_SQL`、`PATTERN_XSS`、`PATTERN_SAFE_FIELD_PATH`）校验，并编译为参数化 JPA Criteria 安全查询：

| 运算符 | URL 语法 | SQL 等价语义 | 说明 |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | 精确相等匹配（省略运算符后缀时的默认行为）。 |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | 不等于排除过滤，匹配字段值不相同的记录。 |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | 忽略大小写的模糊包含匹配（自动包裹 SQL % 通配符）。 |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | 前缀匹配（可有效利用 B-Tree 索引前缀扫描）。 |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | 后缀结束字符匹配。 |
| `gt` | `price.gt=100` | `> 100` | 严格大于比较（支持数值与 ISO-8601 时间戳）。 |
| `gte` | `price.gte=100` | `>= 100` | 大于或等于包含边界阈值比较。 |
| `lt` | `stock.lt=50` | `< 50` | 严格小于边界比较。 |
| `lte` | `stock.lte=50` | `<= 50` | 小于或等于最大边界比较。 |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | 匹配逗号分隔候选集合中的任意一项值。 |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | 排除匹配逗号分隔集合内任意值的记录。 |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | 闭合区间范围匹配（由逗号分隔下界与上界）。 |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | 传入 true 检查 SQL IS NULL，false 检查 IS NOT NULL。 |

### 查询 DoS 防护护栏（`QueryGuardrailProperties` — `app.framework.query-guardrails`）

`QueryGuardrailEnforcerUtil` 在执行 JPA 前校验传入的条件与排序路径：

- `max-join-depth`（默认 `3`）：限制点分关联路径的最大联表深度。
- `max-filter-criteria`（默认 `25`）：限制单次请求的最大过滤谓词数。
- `max-page-size`（默认 `200`）：限制单页最大记录数。
- `max-unpaged-fetch-limit`（默认 `5000`）：防止无分页 `GET /all` 等接口触发 OOM 的安全上限。
- `eager-fetch-singular-relations`（默认 `true`）：未显式指定 `?expand=` 时对单值关联执行 `LEFT JOIN FETCH`。
- `allowed-filter-fields` 与 `allowed-sort-fields`：可选严格白名单，限定允许过滤和排序的字段。

---

## 2. O(1) 游标 Keyset 分页（`GET /keyset`）

由于主键采用按时间单调递增的 **UUIDv7**，`/keyset` 在 `dir=asc` 与 `dir=desc` 双向均可通过 `size + 1` 探测以 `O(1)` 定位游标边界：

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. 无状态 JPA 持久化、`@Version` 乐观锁与非破坏稀疏字段裁剪

- **`spring.jpa.open-in-view=false`、`?expand=` 与乐观锁**：保持 OSIV 关闭，支持按需 `?expand=rel1,rel2`、`BaseAuditEntity` 内置 `@Version`（并发冲突返回 `409 Conflict`），以及 `JpaAssociationReferenceUtil` 外键存根解析。
- **`fields=id,skuCode,productName,retailPrice`**：`DynamicSchemaProjectionHelper` 内部使用 `EntityCloneSnapshotHelper`，确保 REST 与 GraphQL 稀疏裁剪绝不污染 Hibernate 一级缓存或托管实体。

---

## 4. 动态 GraphQL 引擎（`GraphQLDynamicApiController`）

| 端点 | HTTP | 功能说明 |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | 导出自动合成的 GraphQL SDL（`list<Entity>s`、Object 与 Input 类型） |
| `/api/v1/graphql` | `POST` | 统一的 GraphQL 查询与变更执行端点 |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | 交互式 GraphiQL 调试界面 |
