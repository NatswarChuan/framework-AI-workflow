# 02. Catalogue des 40 Contrats REST Auto-Générés et Contrôleurs Plateforme (`0.1.0`)

> **Langues**: **Français** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [Les 20 Langues](../README.md) | [Manuel Complet (EN)](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#endpoints)

---

## 1. 40 Contrats `@Auto*` Composables par Entité (`38` Exposés par Défaut)

L’extension de `AutoApiController<E>` (ou la composition sélective de `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`) déclenche `DynamicControllerProxyRegistrarHelper` et `SpringMvcEndpointBridge` pour enregistrer jusqu’à **40** contrats (`15` lecture dans `AutoApiReadController` + `10` écriture/lots dans `AutoWriteApi`/`AutoBatchApi` + `11` entreprise dans `AutoApiEnterpriseController` + `4` export/import dans `AutoExportImportApi` ; **`38`** visibles par défaut dans Swagger UI car `/events` est `@Hidden` et `/{id}/**` requiert `enableNestedSubResources = true`). Compatible avec `@AutoRestController(readDto, createDto, updateDto)` et `@RequestBody`/`@RequestParam`/`@PathVariable`.

### Groupe 1 : Lecture, Analytique et Génération de Clients (`AutoApiReadController` — 15 Contrats)

| # | HTTP | Sous-Chemin | Méthode | Comportement |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | Pagination par décalage avec 13 opérateurs de filtre, tri multicolonne, préchargement `?expand=` et sélection de champs. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | Pagination par curseur UUIDv7 en temps O(1) sans dégradation SQL OFFSET sur les grandes tables. |
| 3 | `GET` | `/all` | `getAll` | Retourne tous les enregistrements correspondant aux filtres dynamiques pour les listes et référentiels. |
| 4 | `GET` | `/count` | `count` | Exécute un SQL COUNT(*) correspondant aux prédicats de filtre dynamiques. |
| 5 | `GET` | `/exists` | `exists` | Vérification booléenne rapide retournant true si au moins un enregistrement correspond. |
| 6 | `GET` | `/aggregate` | `aggregate` | Calcule SQL SUM, AVG, MIN, MAX et COUNT sur les attributs numériques. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | Récupère les valeurs distinctes dédupliquées pour les menus de filtres à facettes. |
| 8 | `GET` | `/top` | `findTopRecords` | Retourne les N premières entités ordonnées pour les classements et alertes. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | Métriques d’agrégation GROUP BY dynamiques pour graphiques et rapports BI. |
| 10 | `GET` | `/metadata` | `getMetadata` | Expose les définitions de champs JPA, contraintes Jakarta et métadonnées de visibilité RBAC. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | Génère des interfaces TypeScript prêtes à copier directement depuis les champs JPA. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | Génère des contrats JSON Schema Draft pour les générateurs de formulaires. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | Synthétise des schémas de validation Zod via ZodAndClientGeneratorUtil (text/plain). |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Synthétise un module client TypeScript Fetch typé avec validation Zod et aides CRUD. |
| 15 | `GET` | `/{id}` | `getById` | Récupère une entité par UUIDv7 en appliquant le masquage @FieldSecurity et les ETags @HttpCacheable. |

### Groupe 2 : Écriture, Lots, Upsert, Patch, Suppression et Restauration (`AutoWriteApi` + `AutoBatchApi` — 10 Contrats)

| # | HTTP | Sous-Chemin | Méthode | Comportement |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Crée une entité avec validation Bean, @AutoCode, @AutoSlug, @UniqueField et @ComputedField. |
| 17 | `POST` | `/batch` | `createBatch` | Insère une collection validée au sein d’une transaction atomique unique. |
| 18 | `POST` | `/upsert` | `upsert` | Insère ou met à jour de manière atomique selon les clés @UniqueField ou un ID UUIDv7 explicite. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | Effectue un upsert groupé transactionnel sur un tableau d’enregistrements. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | Traite les gros lots par segments configurables avec diagnostic BatchExecutionResultDto par élément. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | Met à jour partiellement chaque enregistrement correspondant aux filtres URL avec les champs non nuls du corps. |
| 22 | `PUT` | `/{id}` | `update` | Mise à jour complète de l’entité tout en préservant les colonnes d’audit serveur. |
| 23 | `PATCH` | `/{id}` | `patch` | Fusion partielle ne copiant que les attributs non nuls reçus sur l’entité existante. |
| 24 | `DELETE` | `/{id}` | `deleteById` | Supprime logiquement un enregistrement après vérification de @EntitySecurity deleteRoles et @StateMachine deletableStates. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | Restaure une entité supprimée logiquement dans les requêtes actives. |

### Groupe 3 : Cycle de Vie Entreprise, IA, RFC 6902 et Streaming (`AutoApiEnterpriseController` — 11 Contrats)

| # | HTTP | Sous-Chemin | Méthode | Comportement |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | Applique des deltas numériques atomiques positifs ou négatifs sans condition de concurrence client. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | Exécute une transition @StateMachine validée vers targetState et émet les événements d’audit et webhook. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | Duplique une entité avec un nouvel ID UUIDv7 et la régénération des champs @AutoCode. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Flux temps réel Server-Sent Events (SSE) (@Hidden dans Swagger UI car MIME text/event-stream). |
| 30 | `GET` | `/ai/context` | `getAiContext` | Exporte les schémas JSON d’outils LLM décrivant les champs et opérateurs de filtre. |
| 31 | `POST` | `/ai/query` | `queryAi` | Traduit les requêtes en langage naturel en requêtes JPA Criteria bornées et paramétrées. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | Retourne les transitions compilées @HumanPolicy, rôles RBAC et surcharges YAML. |
| 33 | `GET` | `/health` | `getEntityHealth` | Inspecte l’état de la table de base de données sous-jacente et le nombre de lignes par entité. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | Applique des opérations structurées RFC 6902 JSON Patch (replace, add, remove). |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | Calcule les différences champ par champ entre deux entités actives (id vs targetId). |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | Navigation récursive des relations (option activée via @AutoRestController(enableNestedSubResources = true)). |

### Groupe 4 : Export et Import Massifs CSV et JSONL (`AutoExportImportApi` — 4 Contrats)

| # | HTTP | Sous-Chemin | Méthode | Comportement |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | Exporte les entités filtrées au format CSV conforme à la RFC-4180. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | Diffuse les lignes correspondantes en JSON délimité par retours à la ligne (application/x-ndjson). |
| 39 | `POST` | `/import/csv` | `importCsv` | Importe des charges utiles CSV RFC-4180 brutes par lots segmentés. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | Importe en streaming des jeux de données NDJSON délimités par sauts de ligne. |

---

## 2. Contrôleurs Plateforme Intégrés

| Endpoint / Préfixe | Contrôleur | Responsabilité et Verrouillage Production |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | Developer Studio en 20 langues (RTL `ar`, `fa`, `ur`) ; renvoie `401` si `app.framework.studio.enabled=false` |
| `GET /system/studio/eject` | `DevEjectionController` | Exporte du code Spring MVC standard (Controller/Service/Repository) ; protégé par `SurfaceAccessGuardrailUtil` |
| `POST /api/v1/auth/token` | `AuthController` | Génère un JWT HMAC-SHA512 de démonstration ; renvoie `404` si `demo-token-endpoint-enabled=false` |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | Reconstruction d’entité à un instant donné ISO-8601 UTC (Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | Inspecte les beans SPI actifs des `7` groupes de télémétrie `*Customizer` (`StorageCustomizer` géré par `StorageCustomizerRegistryHelper`, `8` SPI au total) |
| `GET /api/v1/system/resilience/circuit-breakers` | `CircuitBreakerTelemetryApiController` | Métriques temps réel des disjoncteurs Resilience4j |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | Contrôle de santé des sources de données multiples |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | Contexte MDC actif W3C `traceparent` et UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Convertit les erreurs conteneur Tomcat `400/404/405/413/431/500` en `ApiResponse<Void>` |
