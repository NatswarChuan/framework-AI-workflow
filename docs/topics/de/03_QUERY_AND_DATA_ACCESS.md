# 03. 13 dynamische Filteroperatoren, Query Guardrails, Keyset O(1) & GraphQL SDL (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#query-dsl)

---

## 1. 13 dynamische Filteroperatoren (`FilterOperatorConstant`)

Alle Filter-Query-Parameter werden durch `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) geprüft und in parametrisierte JPA-Criteria-Abfragen übersetzt:

| Operator | URL-Syntax | SQL-Semantik | Beschreibung |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Exakter Gleichheitsvergleich (Standardoperator ohne Suffix). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Ungleich-Ausschlussfilter für abweichende Feldwerte. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Groß-/Kleinschreibung-unabhängige Teilstringsuche mit SQL-%-Platzhaltern. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Präfixsuche zur optimalen Nutzung von B-Tree-Indizes. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Suffix-Abgleich gegen das String-Ende. |
| `gt` | `price.gt=100` | `> 100` | Strikt Größer-als-Vergleich für Zahlen oder ISO-8601-Zeitstempel. |
| `gte` | `price.gte=100` | `>= 100` | Größer-gleich-Vergleich inklusive Schwellenwert. |
| `lt` | `stock.lt=50` | `< 50` | Strikt Kleiner-als-Vergleich. |
| `lte` | `stock.lte=50` | `<= 50` | Kleiner-gleich-Vergleich inklusive Obergrenze. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Passt auf jedes Element der kommagetrennten Werteliste. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Schließt Werte aus der kommagetrennten Ausschlussliste aus. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Inklusiver Bereichsvergleich zwischen Unter- und Obergrenze. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Prüft bei true auf SQL IS NULL, bei false auf IS NOT NULL. |

### Query-DoS-Schutzgrenzen (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` validiert eingehende Filter- und Sortierpfade vor der JPA-Ausführung:

- `max-join-depth` (Standard `3`): Begrenzt die maximale Tiefe punktgetrennter Assoziations-Joins.
- `max-filter-criteria` (Standard `25`): Begrenzt die maximale Anzahl von Prädikaten pro Anfrage.
- `max-page-size` (Standard `200`): Begrenzt die Datensätze pro Seite.
- `max-unpaged-fetch-limit` (Standard `5000`): OOM-Schutzgrenze für unpaginierte `GET /all`-Abrufe.
- `eager-fetch-singular-relations` (Standard `true`): Lädt singuläre Relationen via `LEFT JOIN FETCH`, sofern nicht per `?expand=` überschrieben.
- `allowed-filter-fields` & `allowed-sort-fields`: Optionale strikte Positivlisten für filter- und sortierbare Felder.

---

## 2. O(1)-Cursor-Keyset-Paginierung (`GET /keyset`)

Da Primärschlüssel zeitlich monoton steigende **UUIDv7**-Werte sind, springt `/keyset` sowohl bei `dir=asc` als auch `dir=desc` mittels `size + 1`-Probe in $O(1)$-Zeit direkt zur Cursor-Grenze:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Zustandslose JPA-Persistenz, `@Version` & unveränderliche Sparse-Fieldsets

- **`spring.jpa.open-in-view=false`, `?expand=` & Optimistisches Locking**: Hält OSIV deaktiviert, unterstützt selektives `?expand=rel1,rel2`, erzwingt `@Version` (`409 Conflict` bei veraltetem Update) in `BaseAuditEntity` und löst abgetrennte FK-Stubs über `JpaAssociationReferenceUtil` auf.
- **`fields=id,skuCode,productName,retailPrice`**: Nutzt `EntityCloneSnapshotHelper` in `DynamicSchemaProjectionHelper`, sodass REST- und GraphQL-Projektionen niemals den Hibernate-L1-Cache oder verwaltete Entitäten verändern.

---

## 4. Dynamische GraphQL-Engine (`GraphQLDynamicApiController`)

| Endpunkt | HTTP | Funktion |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exportiert das generierte GraphQL-SDL (`list<Entity>s`, Object- und Input-Typen) |
| `/api/v1/graphql` | `POST` | Einheitlicher Ausführungs-Endpunkt für Queries und Mutations |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Interaktiver GraphiQL-Playground |
