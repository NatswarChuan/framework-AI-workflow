# 03. 13 Operadores Dinámicos de Filtro, Query Guardrails, Keyset O(1) y GraphQL SDL (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Los 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#query-operators)

---

## 1. 13 Operadores Dinámicos de Filtro (`FilterOperatorConstant`)

Todos los parámetros de filtro se compilan a consultas JPA Criteria parametrizadas y validadas por `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operador | Sintaxis URL | Semántica SQL | Descripción |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Comparación de igualdad exacta (operador predeterminado si se omite el sufijo). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filtro de exclusión distinto que coincide con valores diferentes. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Coincidencia de subcadena sin distinción de mayúsculas con comodines % SQL. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Coincidencia por prefijo que aprovecha índices B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Coincidencia de sufijo al final de la cadena. |
| `gt` | `price.gt=100` | `> 100` | Comparación estrictamente mayor que para números o fechas ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Comparación mayor o igual al umbral inclusivo. |
| `lt` | `stock.lt=50` | `< 50` | Comparación estrictamente menor que. |
| `lte` | `stock.lte=50` | `<= 50` | Comparación menor o igual al límite máximo. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Coincide con cualquier valor dentro de la lista separada por comas. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Excluye registros que coincidan con la lista separada por comas. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Comparación de rango cerrado inclusivo con límites separados por coma. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Evalúa SQL IS NULL cuando es true, o IS NOT NULL cuando es false. |

### Barreras Anti-DoS de Consultas (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` valida criterios y rutas de ordenación antes de ejecutar JPA:

- `max-join-depth` (por defecto `3`): Limita la profundidad de asociaciones separadas por punto.
- `max-filter-criteria` (por defecto `25`): Limita el total de predicados por petición.
- `max-page-size` (por defecto `200`): Limita el tamaño máximo de página.
- `max-unpaged-fetch-limit` (por defecto `5000`): Techo de seguridad anti-OOM en consultas sin paginar (`GET /all`).
- `eager-fetch-singular-relations` (por defecto `true`): Realiza `LEFT JOIN FETCH` automático en asociaciones singulares salvo `?expand=`.
- `allowed-filter-fields` y `allowed-sort-fields`: Listas blancas opcionales que restringen los campos consultables u ordenables.

---

## 2. Paginación por Cursor Keyset O(1) (`GET /keyset`)

Gracias a que las claves primarias son **UUIDv7** ordenados cronológicamente, `/keyset` salta directamente al límite del cursor en `dir=asc` y `dir=desc` usando una sonda `size + 1` en tiempo `O(1)`:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Persistencia JPA Sin Estado, `@Version` y Proyecciones Dispersas No Mutables

- **`spring.jpa.open-in-view=false`, `?expand=` y Bloqueo Optimista**: Mantiene OSIV desactivado, soporta `?expand=rel1,rel2`, aplica `@Version` (`409 Conflict` ante escritura obsoleta) en `BaseAuditEntity` y resuelve stubs FK desconectados mediante `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Emplea `EntityCloneSnapshotHelper` en `DynamicSchemaProjectionHelper` para que las proyecciones REST y GraphQL nunca muten la caché L1 ni las entidades gestionadas por Hibernate.

---

## 4. Motor GraphQL Dinámico (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Función |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exporta el GraphQL SDL sintetizado (`list<Entity>s`, tipos Object e Input) |
| `/api/v1/graphql` | `POST` | Endpoint unificado de ejecución de consultas y mutaciones |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Interfaz interactiva GraphiQL |
