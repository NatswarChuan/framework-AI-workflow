# 03. 13 Operator Filter Dinamis, Query Guardrails, Keyset O(1) & GraphQL SDL (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#query-dsl)

---

## 1. 13 Operator Filter Dinamis (`FilterOperatorConstant`)

Semua parameter filter dikompilasi menjadi kueri JPA Criteria berparameter yang divalidasi oleh `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operator | Sintaks URL | Semantik SQL | Deskripsi |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Perbandingan kesetaraan persis (operator bawaan saat akhiran dihilangkan). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filter pengecualian tidak sama dengan nilai yang ditentukan. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Pencarian substring tanpa membedakan huruf besar/kecil dengan wildcard %. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Pencocokan awalan yang mengoptimalkan pemindaian indeks B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Pencocokan akhiran terhadap ujung string. |
| `gt` | `price.gt=100` | `> 100` | Perbandingan lebih besar secara ketat untuk angka atau waktu ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Perbandingan lebih besar dari atau sama dengan ambang batas. |
| `lt` | `stock.lt=50` | `< 50` | Perbandingan kurang dari secara ketat. |
| `lte` | `stock.lte=50` | `<= 50` | Perbandingan kurang dari atau sama dengan batas maksimum. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Cocok dengan item mana saja dalam daftar nilai yang dipisah koma. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Mengecualikan nilai yang termasuk dalam daftar pengecualian. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Perbandingan rentang tertutup inklusif dengan batas dipisah koma. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Mengevaluasi SQL IS NULL saat true, atau IS NOT NULL saat false. |

### Pagar Anti-DoS Kueri (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` memvalidasi kriteria filter dan jalur pengurutan sebelum eksekusi JPA:

- `max-join-depth` (default `3`): Membatasi kedalaman maksimum penelusuran asosiasi bertitik.
- `max-filter-criteria` (default `25`): Membatasi jumlah total predikat per permintaan.
- `max-page-size` (default `200`): Membatasi jumlah rekaman per halaman.
- `max-unpaged-fetch-limit` (default `5000`): Batas pengaman anti-OOM pada pengambilan tanpa paginasi (`GET /all`).
- `eager-fetch-singular-relations` (default `true`): Memuat relasi tunggal secara `LEFT JOIN FETCH` kecuali ditimpa `?expand=`.
- `allowed-filter-fields` & `allowed-sort-fields`: Daftar putih opsional untuk membatasi kolom yang dapat difilter/diurutkan.

---

## 2. Paginasi Kursor Keyset O(1) (`GET /keyset`)

Karena kunci primer memakai **UUIDv7** berurutan waktu, `/keyset` melompat langsung ke batas kursor pada arah `dir=asc` maupun `dir=desc` dengan probe `size + 1` dalam waktu $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Persistensi JPA Stateless, `@Version` & Proyeksi Kolom Non-Mutasi

- **`spring.jpa.open-in-view=false`, `?expand=` & Optimistic Locking**: Menjaga OSIV nonaktif, mendukung `?expand=rel1,rel2`, menerapkan `@Version` (`409 Conflict` saat pembaruan usang) di `BaseAuditEntity`, dan menyelesaikan stub FK terlepas melalui `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Menggunakan `EntityCloneSnapshotHelper` di dalam `DynamicSchemaProjectionHelper` agar proyeksi REST dan GraphQL tidak pernah memutasi cache L1 atau entitas terkelola Hibernate.

---

## 4. Mesin GraphQL Dinamis (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Fungsi |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Mengekspor GraphQL SDL otomatis (`list<Entity>s`, tipe Object dan Input) |
| `/api/v1/graphql` | `POST` | Endpoint eksekusi terpadu untuk kueri dan mutasi |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Playground interaktif GraphiQL |
