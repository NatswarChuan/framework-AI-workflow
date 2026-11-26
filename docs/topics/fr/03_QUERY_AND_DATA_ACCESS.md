# 03. 13 Opérateurs de Filtre Dynamiques, Query Guardrails, Keyset O(1) et GraphQL SDL (`0.1.0`)

> **Langues**: **Français** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Les 20 Langues](../README.md) | [Manuel Complet (EN)](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#query-operators)

---

## 1. 13 Opérateurs de Filtre Dynamiques (`FilterOperatorConstant`)

Tous les paramètres de filtre sont compilés en requêtes JPA Criteria paramétrées et validées par `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) :

| Opérateur | Syntaxe URL | Sémantique SQL | Description |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Comparaison d’égalité stricte (opérateur par défaut sans suffixe). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filtre d’exclusion différent de la valeur spécifiée. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Recherche de sous-chaîne insensible à la casse avec jokers % SQL. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Correspondance de préfixe exploitant les index B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Correspondance de suffixe en fin de chaîne. |
| `gt` | `price.gt=100` | `> 100` | Comparaison strictement supérieure (numérique ou ISO-8601). |
| `gte` | `price.gte=100` | `>= 100` | Comparaison supérieure ou égale au seuil inclus. |
| `lt` | `stock.lt=50` | `< 50` | Comparaison strictement inférieure au seuil. |
| `lte` | `stock.lte=50` | `<= 50` | Comparaison inférieure ou égale au seuil maximal. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Correspond à toute valeur figurant dans la liste séparée par des virgules. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Exclut les valeurs présentes dans la liste séparée par des virgules. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Intervalle fermé inclusif délimité par deux bornes séparées par une virgule. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Évalue SQL IS NULL si true, ou IS NOT NULL si false. |

### Garde-Fous Anti-DoS de Requêtes (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` valide les critères et chemins de tri avant l’exécution JPA :

- `max-join-depth` (défaut `3`) : Plafonne la profondeur des jointures d’associations par points.
- `max-filter-criteria` (défaut `25`) : Plafonne le nombre total de prédicats par requête.
- `max-page-size` (défaut `200`) : Plafonne le nombre d’enregistrements par page.
- `max-unpaged-fetch-limit` (défaut `5000`) : Plafond anti-OOM sur les lectures non paginées (`GET /all`).
- `eager-fetch-singular-relations` (défaut `true`) : Précharge automatiquement en `LEFT JOIN FETCH` les associations singulières hors `?expand=`.
- `allowed-filter-fields` & `allowed-sort-fields` : Listes blanches optionnelles restreignant les champs filtrables/triables.

---

## 2. Pagination par Curseur Keyset O(1) (`GET /keyset`)

Les clés primaires étant des **UUIDv7** ordonnés chronologiquement, `/keyset` atteint directement la frontière du curseur en `dir=asc` et `dir=desc` via une sonde `size + 1` en temps `O(1)` :

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Persistance JPA Sans État, `@Version` et Projections Éparses Immuables

- **`spring.jpa.open-in-view=false`, `?expand=` et Verrouillage Optimiste** : Garde OSIV désactivé, prend en charge `?expand=rel1,rel2`, applique `@Version` (`409 Conflict` sur écriture concurrente) dans `BaseAuditEntity` et résout les stubs FK détachés via `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`** : Utilise `EntityCloneSnapshotHelper` dans `DynamicSchemaProjectionHelper` afin que les projections REST et GraphQL ne modifient jamais le cache L1 ni les entités gérées Hibernate.

---

## 4. Moteur GraphQL Dynamique (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Fonction |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exporte le GraphQL SDL synthétisé (`list<Entity>s`, types Object et Input) |
| `/api/v1/graphql` | `POST` | Point d’exécution unifié des requêtes et mutations |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Aire de jeu interactive GraphiQL |
