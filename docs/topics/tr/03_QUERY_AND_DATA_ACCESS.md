# 03. 13 Dinamik Filtre Operatörü, Query Guardrails, Keyset O(1) ve GraphQL SDL (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz (EN)](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#query-operators)

---

## 1. 13 Dinamik Filtre Operatörü (`FilterOperatorConstant`)

Tüm filtre sorgu parametreleri `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) tarafından doğrulanarak parametreli JPA Criteria sorgularına derlenir:

| Operatör | URL Sözdizimi | SQL Karşılığı | Açıklama |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Tam eşitlik karşılaştırması (ek belirtilmediğinde varsayılan operatör). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Belirtilen değerden farklı kayıtları getiren eşit değil filtresi. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Büyük/küçük harf duyarsız SQL % alt dize eşleşmesi. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | B-Tree indeks taramasından yararlanan ön ek eşleşmesi. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Metin sonu için son ek eşleşmesi. |
| `gt` | `price.gt=100` | `> 100` | Sayısal veya ISO-8601 tarihler için kesin büyüktür karşılaştırması. |
| `gte` | `price.gte=100` | `>= 100` | Eşik değer dahil büyük veya eşittir karşılaştırması. |
| `lt` | `stock.lt=50` | `< 50` | Kesin küçüktür sınır karşılaştırması. |
| `lte` | `stock.lte=50` | `<= 50` | Üst sınır dahil küçük veya eşittir karşılaştırması. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Virgülle ayrılmış aday değerlerden herhangi biriyle eşleşir. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Hariç tutma listesindeki değerleri içeren kayıtları dışlar. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Virgülle ayrılmış alt ve üst sınırları kapsayan aralık sorgusu. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true olduğunda SQL IS NULL, false olduğunda IS NOT NULL üretir. |

### Sorgu DoS Koruma Sınırları (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil`, JPA çalıştırmasından önce gelen filtre ölçütlerini ve sıralama yollarını doğrular:

- `max-join-depth` (varsayılan `3`): Nokta ayrılmış ilişki join derinliğini sınırlar.
- `max-filter-criteria` (varsayılan `25`): İstek başına toplam koşul sayısını sınırlar.
- `max-page-size` (varsayılan `200`): Sayfa başına en fazla kayıt sayısını sınırlar.
- `max-unpaged-fetch-limit` (varsayılan `5000`): Sayfasız `GET /all` çağrılarında OOM koruma üst sınırı.
- `eager-fetch-singular-relations` (varsayılan `true`): `?expand=` verilmedikçe tekil ilişkileri `LEFT JOIN FETCH` ile önceden yükler.
- `allowed-filter-fields` ve `allowed-sort-fields`: Filtrelenebilir ve sıralanabilir alanları kısıtlayan isteğe bağlı izin listeleri.

---

## 2. O(1) İmleçli Keyset Sayfalama (`GET /keyset`)

Birincil anahtarlar zamana göre monoton artan **UUIDv7** kullandığından `/keyset`, `dir=asc` ve `dir=desc` yönlerinde `size + 1` yoklamasıyla `O(1)` sürede doğrudan imleç sınırına atlar:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Durumsuz JPA Kalıcılığı, `@Version` ve Değişmeyen Seyrek Alan Seçimi

- **`spring.jpa.open-in-view=false`, `?expand=` ve İyimser Kilitleme**: OSIV kapalı kalır, seçici `?expand=rel1,rel2` desteklenir, `BaseAuditEntity` içinde `@Version` (`409 Conflict`) uygulanır ve ayrık FK taslakları `JpaAssociationReferenceUtil` ile çözümlenir.
- **`fields=id,skuCode,productName,retailPrice`**: `DynamicSchemaProjectionHelper` içinde `EntityCloneSnapshotHelper` kullanarak REST ve GraphQL projeksiyonlarının Hibernate L1 önbelleğini veya yönetilen varlıkları bozmasını önler.

---

## 4. Dinamik GraphQL Motoru (`GraphQLDynamicApiController`)

| Uç Nokta | HTTP | İşlev |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Üretilen GraphQL SDL şemasını (`list<Entity>s`, Object ve Input türleri) dışa aktarır |
| `/api/v1/graphql` | `POST` | Birleşik sorgu ve mutasyon yürütme uç noktası |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Etkileşimli GraphiQL deneme arayüzü |
