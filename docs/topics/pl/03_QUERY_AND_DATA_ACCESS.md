# 03. 13 dynamicznych operatorów filtrowania, Query Guardrails, Keyset O(1) i GraphQL SDL (`0.1.0`)

> **Języki**: **Polski** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#query-dsl)

---

## 1. 13 dynamicznych operatorów filtrowania (`FilterOperatorConstant`)

Wszystkie parametry filtrujące są kompilowane do parametryzowanych zapytań JPA Criteria weryfikowanych przez `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operator | Składnia URL | Semantyka SQL | Opis |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Dokładne porównanie równości (domyślny operator przy braku przyrostka). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filtr wykluczający różny od podanej wartości. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Dopasowanie podciągu bez rozróżniania wielkości liter (% SQL). |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Dopasowanie prefiksu wykorzystujące skanowanie indeksów B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Dopasowanie sufiksu na końcu ciągu tekstowego. |
| `gt` | `price.gt=100` | `> 100` | Porównanie ostro większe niż dla liczb lub znaczników ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Porównanie większe lub równe z włączeniem granicy. |
| `lt` | `stock.lt=50` | `< 50` | Porównanie ostro mniejsze niż. |
| `lte` | `stock.lte=50` | `<= 50` | Porównanie mniejsze lub równe górnej granicy. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Dopasowanie dowolnego elementu z listy rozdzielonej przecinkami. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Wyklucza rekordy dopasowane do listy wyłączeń. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Domknięty przedział od wartości minimalnej do maksymalnej. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Sprawdza SQL IS NULL dla true lub IS NOT NULL dla false. |

### Bariery anty-DoS zapytań (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` waliduje kryteria oraz ścieżki sortowania przed wykonaniem JPA:

- `max-join-depth` (domyślnie `3`): Ogranicza głębokość łączeń relacji rozdzielanych kropką.
- `max-filter-criteria` (domyślnie `25`): Ogranicza maksymalną liczbę predykatów w żądaniu.
- `max-page-size` (domyślnie `200`): Ogranicza liczbę rekordów na stronie.
- `max-unpaged-fetch-limit` (domyślnie `5000`): Limit chroniący przed OOM w niepaginowanym `GET /all`.
- `eager-fetch-singular-relations` (domyślnie `true`): Automatycznie dociąga relacje pojedyncze przez `LEFT JOIN FETCH`, chyba że podano `?expand=`.
- `allowed-filter-fields` i `allowed-sort-fields`: Opcjonalne białe listy pól dopuszczonych do filtrowania i sortowania.

---

## 2. Paginacja kursorowa Keyset O(1) (`GET /keyset`)

Dzięki monotonicznym kluczom głównym **UUIDv7**, `/keyset` przeskakuje bezpośrednio do granicy kursora w obu kierunkach (`dir=asc`, `dir=desc`) z próbkowaniem `size + 1` w czasie $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Bezstanowa trwałość JPA, `@Version` i niemutujące projekcje pól

- **`spring.jpa.open-in-view=false`, `?expand=` i optymistyczne blokowanie**: Wyłącza OSIV, wspiera selektywne `?expand=rel1,rel2`, wymusza `@Version` (`409 Conflict` przy nieaktualnym zapisie) w `BaseAuditEntity` i rozwiązuje odłączone stuby FK przez `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Wykorzystuje `EntityCloneSnapshotHelper` w `DynamicSchemaProjectionHelper`, dzięki czemu projekcje REST i GraphQL nigdy nie modyfikują pamięci podręcznej L1 ani zarządzanych encji Hibernate.

---

## 4. Dynamiczny silnik GraphQL (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Funkcja |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Eksportuje wygenerowany schemat GraphQL SDL (`list<Entity>s`, typy Object i Input) |
| `/api/v1/graphql` | `POST` | Zunifikowany endpoint wykonywania zapytań i mutacji |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Interaktywne środowisko GraphiQL |
