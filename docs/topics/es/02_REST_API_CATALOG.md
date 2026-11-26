# 02. Catálogo de 40 Contratos REST Autogenerados y Controladores de Plataforma (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Los 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#endpoints)

---

## 1. 40 Contratos `@Auto*` Componibles por Entidad (`38` Expuestos por Defecto)

Extender `AutoApiController<E>` (o combinar selectivamente `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) activa `DynamicControllerProxyRegistrarHelper` y `SpringMvcEndpointBridge` para registrar hasta **40** contratos (`15` lectura en `AutoApiReadController` + `10` escritura/lotes en `AutoWriteApi`/`AutoBatchApi` + `11` empresariales en `AutoApiEnterpriseController` + `4` exportación/importación en `AutoExportImportApi`; **`38`** visibles por defecto en Swagger UI porque `/events` lleva `@Hidden` y `/{id}/**` exige `enableNestedSubResources = true`). Compatible con `@AutoRestController(readDto, createDto, updateDto)` y `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Grupo 1: Consulta, Analítica y Generación de Clientes (`AutoApiReadController` — 15 Contratos)

| # | HTTP | Subruta | Método | Comportamiento |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Paginación por desplazamiento con 13 operadores de filtro, ordenación multicolumna, carga eager y campos dispersos. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Paginación por cursor UUIDv7 en tiempo O(1) sin degradación de escaneo SQL OFFSET en tablas grandes. |
| 3 | `GET` | `/all` | `getAll` | Devuelve todos los registros que coinciden con los filtros dinámicos para listas y tablas de consulta. |
| 4 | `GET` | `/count` | `count` | Ejecuta SQL COUNT(*) según los predicados de filtro dinámicos. |
| 5 | `GET` | `/exists` | `exists` | Verificación booleana rápida que devuelve true cuando coincide al menos un registro. |
| 6 | `GET` | `/aggregate` | `aggregate` | Calcula SQL SUM, AVG, MIN, MAX y COUNT sobre atributos numéricos. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Recupera valores distintos sin duplicados para selectores y facetas de filtro. |
| 8 | `GET` | `/top` | `findTopRecords` | Devuelve las N entidades principales ordenadas para clasificaciones y alertas. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Métricas dinámicas de agregación GROUP BY para gráficos e informes BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Expone definiciones de campos JPA, restricciones Jakarta y metadatos de visibilidad RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Genera interfaces TypeScript listas para copiar directamente desde campos JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Genera contratos JSON Schema Draft para constructores dinámicos de formularios. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Sintetiza esquemas de validación Zod en ejecución mediante ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Sintetiza un módulo cliente TypeScript Fetch tipado con validación Zod y funciones CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Obtiene una entidad por UUIDv7 aplicando enmascaramiento @FieldSecurity y ETags de @HttpCacheable. |

### Grupo 2: Escritura, Lotes, Upsert, Patch, Borrado y Restauración (`AutoWriteApi` + `AutoBatchApi` — 10 Contratos)

| # | HTTP | Subruta | Método | Comportamiento |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Crea una entidad aplicando validación Bean, @AutoCode, @AutoSlug, @UniqueField y @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Inserta una colección validada dentro de una única transacción atómica. |
| 18 | `POST` | `/upsert` | `upsert` | Inserta o actualiza atómicamente según claves @UniqueField o ID UUIDv7 explícito. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Ejecuta upsert masivo transaccional sobre un arreglo de registros. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Procesa lotes grandes en bloques configurables y devuelve diagnósticos BatchExecutionResultDto por elemento. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Actualiza parcialmente todos los registros coincidentes con los filtros URL usando los campos no nulos del cuerpo. |
| 22 | `PUT` | `/{id}` | `update` | Actualización completa de la entidad preservando las columnas de auditoría del servidor. |
| 23 | `PATCH` | `/{id}` | `patch` | Fusión parcial que copia únicamente los atributos no nulos recibidos sobre la entidad existente. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Elimina lógicamente un registro tras verificar @EntitySecurity deleteRoles y @StateMachine deletableStates. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Restaura una entidad eliminada lógicamente para que vuelva a las consultas activas. |

### Grupo 3: Ciclo de Vida Empresarial, IA, RFC 6902 y Streaming (`AutoApiEnterpriseController` — 11 Contratos)

| # | HTTP | Subruta | Método | Comportamiento |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Aplica incrementos o decrementos numéricos atómicos evitando condiciones de carrera cliente. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Ejecuta una transición @StateMachine validada hacia targetState y emite eventos de auditoría y webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Duplica una entidad emitiendo un nuevo ID UUIDv7 y regenerando campos @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Flujo en vivo mediante Server-Sent Events (SSE) (@Hidden en Swagger UI por MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Exporta esquemas JSON de herramientas LLM describiendo campos y operadores de filtro. |
| 31 | `POST` | `/ai/query` | `queryAi` | Traduce indicaciones en lenguaje natural a consultas JPA Criteria parametrizadas y acotadas. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Devuelve transiciones compiladas de @HumanPolicy, roles RBAC y sobrescrituras YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Inspecciona el estado de la tabla en base de datos y el conteo de registros por entidad. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Aplica operaciones estructuradas RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Calcula diferencias campo por campo entre dos registros de entidad activos (id frente a targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Navegación recursiva de relaciones (activación explícita con @AutoRestController(enableNestedSubResources = true)). |

### Grupo 4: Exportación e Importación Masiva CSV y JSONL (`AutoExportImportApi` — 4 Contratos)

| # | HTTP | Subruta | Método | Comportamiento |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Exporta las entidades filtradas en formato CSV compatible con RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Transmite las filas coincidentes como JSON delimitado por líneas (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Importa cargas CSV RFC-4180 como texto sin formato en lotes divididos. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importa conjuntos de datos NDJSON delimitados por líneas mediante flujo continuo. |

---

## 2. Controladores Integrados de Plataforma

| Endpoint / Prefijo | Controlador | Responsabilidad y Bloqueo en Producción |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio en 20 idiomas (RTL `ar`, `fa`, `ur`); devuelve `401` cuando `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Exporta código Spring MVC estándar (Controller/Service/Repository); protegido por `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Emite JWT HMAC-SHA512 de demostración; devuelve `404` cuando `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Reconstrucción histórica de entidades en un instante ISO-8601 UTC |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Inspecciona beans SPI activos de los `7` grupos de telemetría `*Customizer` (`StorageCustomizer` gestionado por `StorageCustomizerRegistryHelper`, `8` SPI en total) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Métricas en vivo de los Circuit Breakers de Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Inspección de salud de múltiples fuentes de datos |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Contexto activo W3C `traceparent` y UUIDv7 `X-Request-ID` en MDC |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Convierte errores del contenedor Tomcat `400/404/405/413/431/500` a `ApiResponse<Void>` |
