# 02. Catálogo dos 40 Contratos REST Autogerados e Controladores de Plataforma (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#endpoints)

---

## 1. 40 Contratos `@Auto*` Combináveis por Entidade (`38` Expostos por Padrão)

Estender `AutoApiController<E>` (ou combinar seletivamente `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) aciona `DynamicControllerProxyRegistrarHelper` e `SpringMvcEndpointBridge` para expor até **40** contratos (`15` leitura + `10` escrita/lote + `11` corporativos + `4` exportação/importação; **`38`** visíveis por padrão no Swagger UI porque `/events` usa `@Hidden` e `/{id}/**` exige `enableNestedSubResources = true`). Suporta `@AutoRestController(readDto, createDto, updateDto)` e `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Grupo 1: Consulta, Analítica e Geração de Clientes (`AutoApiReadController` — 15 Contratos)

| # | HTTP | Subcaminho | Método | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Paginação por deslocamento com 13 operadores de filtro, ordenação multicoluna, eager-fetch `?expand=` e campos esparsos. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Paginação por cursor UUIDv7 em tempo O(1) sem degradação de varredura SQL OFFSET em tabelas grandes. |
| 3 | `GET` | `/all` | `getAll` | Retorna todos os registros compatíveis com filtros dinâmicos para seletores e tabelas auxiliares. |
| 4 | `GET` | `/count` | `count` | Executa SQL COUNT(*) de acordo com os predicados de filtro dinâmicos. |
| 5 | `GET` | `/exists` | `exists` | Verificação booleana rápida que retorna true quando há ao menos um registro compatível. |
| 6 | `GET` | `/aggregate` | `aggregate` | Calcula SQL SUM, AVG, MIN, MAX e COUNT em atributos numéricos. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Obtém valores distintos sem duplicidade para menus de filtragem. |
| 8 | `GET` | `/top` | `findTopRecords` | Retorna as N principais entidades ordenadas para rankings e alertas. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Métricas dinâmicas de agregação GROUP BY para gráficos e relatórios de BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Expõe definições de campos JPA, restrições Jakarta e metadados de visibilidade RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Gera interfaces TypeScript prontas para cópia diretamente dos campos JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Gera contratos JSON Schema Draft para construtores dinâmicos de formulários. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Sintetiza esquemas de validação Zod via ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Sintetiza um módulo cliente TypeScript Fetch tipado com Zod e funções CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Obtém uma entidade por UUIDv7 aplicando mascaramento @FieldSecurity e ETags de @HttpCacheable. |

### Grupo 2: Escrita, Lotes, Upsert, Patch, Exclusão e Restauração (`AutoWriteApi` + `AutoBatchApi` — 10 Contratos)

| # | HTTP | Subcaminho | Método | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Cria uma entidade com validação Bean, @AutoCode, @AutoSlug, @UniqueField e @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Insere uma coleção validada dentro de uma única transação atômica. |
| 18 | `POST` | `/upsert` | `upsert` | Insere ou atualiza atomicamente combinando chaves @UniqueField ou ID UUIDv7 explícito. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Executa upsert em massa transacional sobre uma lista de registros. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Processa grandes lotes em blocos configuráveis retornando diagnósticos BatchExecutionResultDto por item. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Aplica patch em todos os registros compatíveis com os filtros da URL usando campos não nulos do corpo. |
| 22 | `PUT` | `/{id}` | `update` | Atualização completa da entidade preservando as colunas de auditoria do servidor. |
| 23 | `PATCH` | `/{id}` | `patch` | Mesclagem parcial copiando apenas atributos não nulos recebidos sobre a entidade existente. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Realiza exclusão lógica após validar deleteRoles de @EntitySecurity e deletableStates de @StateMachine. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Restaura uma entidade excluída logicamente de volta às consultas ativas. |

### Grupo 3: Ciclo de Vida Corporativo, IA, RFC 6902 e Streaming (`AutoApiEnterpriseController` — 11 Contratos)

| # | HTTP | Subcaminho | Método | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Aplica variações numéricas atômicas positivas ou negativas sem condições de corrida. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Executa uma transição @StateMachine validada para targetState e emite eventos de auditoria/webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Duplica uma entidade emitindo novo ID UUIDv7 e regenerando campos @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Fluxo em tempo real via Server-Sent Events (SSE) (@Hidden no Swagger UI devido ao MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Exporta esquemas JSON de ferramentas LLM descrevendo campos e operadores de filtro. |
| 31 | `POST` | `/ai/query` | `queryAi` | Traduz instruções em linguagem natural em consultas JPA Criteria limitadas e parametrizadas. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Retorna transições compiladas do @HumanPolicy, papéis RBAC e sobrescritas YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Inspeciona o estado da tabela no banco de dados e a contagem de registros por entidade. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Aplica operações estruturadas RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Calcula diferenças campo a campo entre dois registros ativos da entidade (id vs targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Navegação recursiva de relacionamentos (opt-in via @AutoRestController(enableNestedSubResources = true)). |

### Grupo 4: Exportação e Importação em Massa CSV e JSONL (`AutoExportImportApi` — 4 Contratos)

| # | HTTP | Subcaminho | Método | Comportamento |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Exporta entidades filtradas no formato CSV padrão RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Transmite os registros compatíveis em fluxo application/x-ndjson delimitado por quebras de linha. |
| 39 | `POST` | `/import/csv` | `importCsv` | Importa payloads CSV RFC-4180 em texto bruto em lotes segmentados. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importa conjuntos de dados NDJSON delimitados por linha via streaming. |

---

## 2. Controladores Integrados da Plataforma

| Endpoint / Prefixo | Controlador | Responsabilidade e Bloqueio em Produção |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio em 20 idiomas (RTL `ar`, `fa`, `ur`); retorna `401` quando `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Exporta código Spring MVC padrão (Controller/Service/Repository); protegido por `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Emite JWT HMAC-SHA512 de demonstração; retorna `404` quando `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Reconstrução histórica de entidade em um timestamp ISO-8601 UTC |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Inspeciona beans SPI ativos dos `7` grupos principais de telemetria `*Customizer` (`StorageCustomizer` via `StorageCustomizerRegistryHelper`, `8` SPIs no total) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Métricas em tempo real dos Circuit Breakers Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Verificação de saúde de múltiplas fontes de dados |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Contexto ativo W3C `traceparent` e UUIDv7 `X-Request-ID` no MDC |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Converte erros do contêiner Tomcat `400/404/405/413/431/500` em `ApiResponse<Void>` |
