# 03. 13 Operatori Dinamici di Filtro, Query Guardrails, Keyset O(1) e GraphQL SDL (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo (EN)](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#query-operators)

---

## 1. 13 Operatori Dinamici di Filtro (`FilterOperatorConstant`)

Tutti i parametri di filtro vengono compilati in query JPA Criteria parametrizzate e validate da `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operatore | Sintassi URL | Semantica SQL | Descrizione |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Confronto di uguaglianza esatta (operatore predefinito senza suffisso). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filtro di esclusione diverso dal valore specificato. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Ricerca sottostringa senza distinzione maiuscole/minuscole con % SQL. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Corrispondenza prefisso che sfrutta gli indici B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Corrispondenza suffisso sulla parte finale della stringa. |
| `gt` | `price.gt=100` | `> 100` | Confronto strettamente maggiore per numeri o timestamp ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Confronto maggiore o uguale alla soglia inclusa. |
| `lt` | `stock.lt=50` | `< 50` | Confronto strettamente minore. |
| `lte` | `stock.lte=50` | `<= 50` | Confronto minore o uguale alla soglia massima. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Corrisponde a qualsiasi elemento nella lista separata da virgole. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Esclude i record presenti nella lista separata da virgole. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Intervallo chiuso inclusivo con estremi separati da virgola. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Valuta SQL IS NULL con true oppure IS NOT NULL con false. |

### Protezioni Anti-DoS per Query (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` valida criteri e percorsi di ordinamento prima dell’esecuzione JPA:

- `max-join-depth` (default `3`): Limita la profondità massima delle associazioni separate da punto.
- `max-filter-criteria` (default `25`): Limita il numero massimo di predicati per richiesta.
- `max-page-size` (default `200`): Limita il numero massimo di record per pagina.
- `max-unpaged-fetch-limit` (default `5000`): Soglia anti-OOM per chiamate non paginate (`GET /all`).
- `eager-fetch-singular-relations` (default `true`): Esegue `LEFT JOIN FETCH` automatico sulle relazioni singolari salvo `?expand=`.
- `allowed-filter-fields` e `allowed-sort-fields`: Liste bianche opzionali per limitare i campi filtrabili e ordinabili.

---

## 2. Paginazione a Cursore Keyset O(1) (`GET /keyset`)

Poiché le chiavi primarie sono **UUIDv7** ordinati cronologicamente, `/keyset` raggiunge subito il confine del cursore in `dir=asc` e `dir=desc` con sonda `size + 1` in tempo `O(1)`:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Persistenza JPA Stateless, `@Version` e Proiezioni Sparse Immutabili

- **`spring.jpa.open-in-view=false`, `?expand=` e Optimistic Locking**: Mantiene OSIV disabilitato, supporta `?expand=rel1,rel2`, applica `@Version` (`409 Conflict` su scritture obsolete) in `BaseAuditEntity` e risolve stub FK scollegati tramite `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Utilizza `EntityCloneSnapshotHelper` in `DynamicSchemaProjectionHelper` così che le proiezioni REST e GraphQL non modifichino mai la cache L1 o le entità gestite Hibernate.

---

## 4. Motore GraphQL Dinamico (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Funzione |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Esporta lo schema GraphQL SDL sintetizzato (`list<Entity>s`, tipi Object e Input) |
| `/api/v1/graphql` | `POST` | Endpoint unificato per l’esecuzione di query e mutation |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Playground interattivo GraphiQL |
