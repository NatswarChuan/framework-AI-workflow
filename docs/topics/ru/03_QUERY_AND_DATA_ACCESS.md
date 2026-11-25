# 03. 13 динамических операторов фильтрации, Query Guardrails, Keyset O(1) и GraphQL SDL (`0.1.0`)

> **Языки**: **Русский** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#query-dsl)

---

## 1. 13 динамических операторов фильтрации (`FilterOperatorConstant`)

Все параметры фильтрации компилируются в параметризованные запросы JPA Criteria после проверки `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Оператор | Синтаксис URL | Семантика SQL | Описание |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Точное сравнение на равенство (оператор по умолчанию при отсутствии суффикса). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Фильтр исключения «не равно» для записей с отличающимся значением. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Регистронезависимый поиск подстроки с шаблоном SQL %. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Поиск по префиксу с использованием индекса B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Поиск по суффиксу в конце строки. |
| `gt` | `price.gt=100` | `> 100` | Строгое сравнение «больше» для чисел и меток ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Сравнение «больше или равно» с включением границы. |
| `lt` | `stock.lt=50` | `< 50` | Строгое сравнение «меньше». |
| `lte` | `stock.lte=50` | `<= 50` | Сравнение «меньше или равно». |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Совпадение с любым значением из списка через запятую. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Исключает записи из перечисленного через запятую списка. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Включённый диапазон [min, max] с границами через запятую. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Проверяет SQL IS NULL при true или IS NOT NULL при false. |

### Защита от DoS-запросов (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` проверяет критерии и пути сортировки до выполнения JPA:

- `max-join-depth` (по умолчанию `3`): Ограничивает глубину обхода связей через точку.
- `max-filter-criteria` (по умолчанию `25`): Ограничивает число предикатов на один запрос.
- `max-page-size` (по умолчанию `200`): Ограничивает максимальный размер страницы.
- `max-unpaged-fetch-limit` (по умолчанию `5000`): Защита от OOM для непагинированных выборок `GET /all`.
- `eager-fetch-singular-relations` (по умолчанию `true`): Автоматически выполняет `LEFT JOIN FETCH` для одиночных связей, если не задан `?expand=`.
- `allowed-filter-fields` и `allowed-sort-fields`: Опциональные белые списки полей для фильтрации и сортировки.

---

## 2. Курсорная пагинация Keyset O(1) (`GET /keyset`)

Поскольку первичные ключи — это упорядоченные по времени **UUIDv7**, `/keyset` переходит сразу к границе курсора в режимах `dir=asc` и `dir=desc` с пробой `size + 1` за время $O(1)$:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Stateless JPA, `@Version` и немутирующие разреженные выборки полей

- **`spring.jpa.open-in-view=false`, `?expand=` и оптимистичная блокировка**: Держит OSIV выключенным, поддерживает `?expand=rel1,rel2`, контролирует `@Version` (`409 Conflict` при устаревшей записи) в `BaseAuditEntity` и разрешает отсоединённые FK-заглушки через `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Использует `EntityCloneSnapshotHelper` внутри `DynamicSchemaProjectionHelper`, поэтому проекции REST и GraphQL никогда не изменяют L1-кэш или управляемые сущности Hibernate.

---

## 4. Динамический движок GraphQL (`GraphQLDynamicApiController`)

| Эндпоинт | HTTP | Назначение |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Экспортирует синтезированную схему GraphQL SDL (`list<Entity>s`, типы Object и Input) |
| `/api/v1/graphql` | `POST` | Единый эндпоинт выполнения запросов и мутаций |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Интерактивная песочница GraphiQL |
