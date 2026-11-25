# 03. 13 Dynamic Filter Operators, Query Guardrails, Keyset O(1) & GraphQL SDL (`0.1.0`)

> **Languages**: **English** | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [All 20 Languages](../README.md) | [Complete Manual](../../GUIDE_EN.md) | [20-Language Interactive Portal](../../index.html#query-dsl)

---

## 1. 13 Dynamic Filter Operators (`FilterOperatorConstant`)

All filter query parameters compile to parameterized JPA Criteria queries validated by `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operator | URL Syntax | SQL Semantics |
| :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` |
| `startsWith` | `productCode.startsWith=PRD-` | `LIKE 'PRD-%'` |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` |
| `gt` | `price.gt=100` | `> 100` |
| `gte` | `price.gte=100` | `>= 100` |
| `lt` | `stock.lt=50` | `< 50` |
| `lte` | `stock.lte=50` | `<= 50` |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN (...)` |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` |
| `null` | `deletedAt.null=true` | `IS NULL` (or `IS NOT NULL` when `false`) |

### Query DoS Guardrails (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` validates incoming query criteria and sorting paths prior to JPA execution:

- `max-join-depth` (default `3`): Caps dot-separated association traversal depth.
- `max-filter-criteria` (default `25`): Caps total predicates per request.
- `max-page-size` (default `200`): Caps per-page record limit.
- `max-unpaged-fetch-limit` (default `5000`): OOM safety ceiling on unpaged `GET /all` fetches.
- `eager-fetch-singular-relations` (default `true`): Eagerly `LEFT JOIN FETCH`es singular associations unless overridden by `?expand=`.
- `allowed-filter-fields` & `allowed-sort-fields`: Optional strict allowlists restricting queryable/sortable fields.

---

## 2. O(1) Cursor Keyset Pagination (`GET /keyset`)

Because primary keys use monotonic timestamp-ordered **UUIDv7** identifiers, `/keyset` jumps straight to the cursor boundary in both `dir=asc` and `dir=desc` using a `size + 1` probe in $O(1)$ seek time:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Stateless JPA Persistence, `@Version` & Non-Mutating Sparse Fieldsets

- **`spring.jpa.open-in-view=false`, `?expand=` & Optimistic Locking**: Keeps OSIV disabled, supports selective `?expand=rel1,rel2`, enforces `@Version` (`409 Conflict` on stale writes) in `BaseAuditEntity`, and resolves detached FK stubs via `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Uses `EntityCloneSnapshotHelper` inside `DynamicSchemaProjectionHelper` so sparse REST and GraphQL projections never mutate L1 cache entries or managed Hibernate entities.

---

## 4. Dynamic GraphQL Engine (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Function |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exports synthesized GraphQL SDL (`list<Entity>s`, Object & Input types) |
| `/api/v1/graphql` | `POST` | Unified query and mutation execution endpoint |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Interactive GraphiQL playground |
