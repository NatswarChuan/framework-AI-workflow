# 03. Dynamic Query Engine, Keyset O(1) & GraphQL SDL

> **Language**: English | [Tiếng Việt](../03_QUERY_AND_DATA_ACCESS.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. 13 Dynamic Filter Operators (`FilterOperatorConstant`)

All filter predicates compile to parameterized JPA Criteria queries validated through `QueryFilterParameterUtil`.

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

**Anti-Exhaustion & Anti-Injection Bounds (`QueryFilterParameterUtil`)**:
- Maximum dynamic predicates per query: `MAX_DYNAMIC_FILTERS=30`.
- Maximum relation sort traversal depth: `MAX_SORT_RELATION_DEPTH=4`.
- SQLi keywords and XSS patterns reject immediately with `error.security.malicious.query` (`HTTP 400`).

---

## 2. O(1) Cursor Keyset Pagination (`GET /keyset`)

Traditional `OFFSET` queries degrade linearly ($O(N)$) on large tables. Because entity identifiers are monotonic timestamp-ordered **UUIDv7** values, `/keyset` jumps straight to the cursor boundary on the primary B-Tree index in $O(1)$ seek time:

```bash
curl "http://localhost:8080/api/v1/commercial-products/keyset?afterId=019a0b12-3456-7000-8000-000000000001&size=20&fields=id,name,price" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Eager Loading & Sparse Fieldsets

- **`include=...` & `eager-fetch-singular-relations: true`**: Generates `JOIN FETCH` plans on `@ManyToOne` / `@OneToOne` relationships inside a single SQL query while keeping `spring.jpa.open-in-view=false`.
- **`fields=id,name,price`**: Restricts serialized response attributes via `DynamicSchemaProjectionHelper`.

---

## 4. Dynamic GraphQL Engine (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Function |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exports synthesized GraphQL SDL (`get<Entity>`, `list<Entity>`, `count<Entity>`) |
| `/api/v1/graphql` | `POST` | Unified query and mutation execution endpoint |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Browser GraphiQL playground |
