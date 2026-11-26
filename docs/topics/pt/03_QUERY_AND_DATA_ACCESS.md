# 03. 13 Operadores Dinâmicos de Filtro, Query Guardrails, Keyset O(1) e GraphQL SDL (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#query-operators)

---

## 1. 13 Operadores Dinâmicos de Filtro (`FilterOperatorConstant`)

Todos os parâmetros de consulta são compilados em JPA Criteria parametrizadas e validadas por `QueryFilterParameterUtil` (`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`):

| Operador | Sintaxe URL | Semântica SQL | Descrição |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | Comparação de igualdade exata (operador padrão quando o sufixo é omitido). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | Filtro de exclusão diferente para registros com outro valor. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | Correspondência de substring sem diferenciar maiúsculas usando curingas %. |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | Correspondência de prefixo que aproveita varreduras em índice B-Tree. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | Correspondência de sufixo no final da cadeia de texto. |
| `gt` | `price.gt=100` | `> 100` | Comparação estritamente maior que para números ou datas ISO-8601. |
| `gte` | `price.gte=100` | `>= 100` | Comparação maior ou igual ao limite inclusivo. |
| `lt` | `stock.lt=50` | `< 50` | Comparação estritamente menor que. |
| `lte` | `stock.lte=50` | `<= 50` | Comparação menor ou igual ao limite máximo. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | Corresponde a qualquer item da lista separada por vírgulas. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | Exclui registros presentes na lista separada por vírgulas. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | Intervalo fechado inclusivo com limites inferior e superior separados por vírgula. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | Avalia SQL IS NULL quando true, ou IS NOT NULL quando false. |

### Barreiras Anti-DoS de Consulta (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil` valida critérios e caminhos de ordenação antes da execução JPA:

- `max-join-depth` (padrão `3`): Limita a profundidade máxima de associações separadas por ponto.
- `max-filter-criteria` (padrão `25`): Limita o número total de predicados por requisição.
- `max-page-size` (padrão `200`): Limita a quantidade máxima de registros por página.
- `max-unpaged-fetch-limit` (padrão `5000`): Teto anti-OOM para consultas não paginadas (`GET /all`).
- `eager-fetch-singular-relations` (padrão `true`): Carrega associações singulares via `LEFT JOIN FETCH`, salvo `?expand=`.
- `allowed-filter-fields` e `allowed-sort-fields`: Listas brancas opcionais que restringem campos filtráveis e ordenáveis.

---

## 2. Paginação por Cursor Keyset O(1) (`GET /keyset`)

Como as chaves primárias usam **UUIDv7** ordenados no tempo, `/keyset` salta diretamente para a fronteira do cursor em `dir=asc` e `dir=desc` usando sonda `size + 1` em tempo `O(1)`:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Persistência JPA Stateless, `@Version` e Projeções Esparsas Imutáveis

- **`spring.jpa.open-in-view=false`, `?expand=` e Bloqueio Otimista**: Mantém OSIV desabilitado, suporta `?expand=rel1,rel2`, aplica `@Version` (`409 Conflict` em escrita obsoleta) em `BaseAuditEntity` e resolve stubs FK desconectados via `JpaAssociationReferenceUtil`.
- **`fields=id,skuCode,productName,retailPrice`**: Usa `EntityCloneSnapshotHelper` dentro de `DynamicSchemaProjectionHelper` para que projeções REST e GraphQL nunca alterem o cache L1 ou entidades gerenciadas pelo Hibernate.

---

## 4. Motor GraphQL Dinâmico (`GraphQLDynamicApiController`)

| Endpoint | HTTP | Função |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | Exporta o GraphQL SDL sintetizado (`list<Entity>s`, tipos Object e Input) |
| `/api/v1/graphql` | `POST` | Endpoint unificado de execução de queries e mutations |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | Playground interativo GraphiQL |
