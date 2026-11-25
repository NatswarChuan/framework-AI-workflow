# 06. Spécification Complète des 60 Annotations Déclaratives (`0.1.0`)

> **Langues**: **Français** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Les 20 Langues](../README.md) | [Manuel Complet](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#annotations)

Référence technique complète des **60 Annotations Déclaratives** de `io.github.natswarchuan:spring-nwvmc:0.1.0`, extraites directement des déclarations Java `@interface` : package exact, `@Target`, **chaque attribut**, type Java, valeur par défaut, caractère obligatoire/optionnel, **comment l’utiliser**, **quand l’utiliser**, **quand NE PAS l’utiliser et pièges**, avec exemples Java vérifiés.

## Index Rapide (60 Annotations)

| Annotation | Catégorie | `@Target` | Résumé des Attributs | Rôle Principal |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Transforme une interface étendant AutoApiController<E> en proxy dynamique JDK enregistrant 40 contrats (38 visibles par défaut dans Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Redirige un contrat de contrôleur vers une méthode de bean Spring personnalisée via MethodHandleCacheUtil au lieu du CRUD dynamique. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Lie des routes métier dédiées (paiement, remboursement, validation) à des beans Spring @Component Helper indépendants. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Remplacement pur Java de @GetMapping sans import statique Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Déclaration HTTP POST pure Java prenant en charge les types MIME consumes/produces personnalisés. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Mappage HTTP PUT pur Java pour le remplacement complet d’une ressource. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Déclaration HTTP PATCH pure Java supportant fusion partielle, incréments atomiques et RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Déclaration HTTP DELETE pure Java déclenchant une suppression logique contrôlée par état. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Lie les paramètres de requête URL ou les cartes de filtres dynamiques Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Lie les variables de chemin URI telles que les identifiants UUIDv7 d’entités. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Désérialise les corps JSON HTTP en paramètres DTO ou Entité avec @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Autorise le parcours récursif des relations enfants via GET /{id}/{relation}/** avec rejet des cycles. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Déclare des transitions d’état métier ou ajustements numériques sur des méthodes d’action personnalisées. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Marqueur de composant enregistré au démarrage sans import @Component à la compilation. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Stéréotype de couche service pour les classes ServiceImpl associées à @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Déclare des méthodes fabriques de beans gérés dans les classes @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Marque les classes de configuration et modèles liés aux propriétés YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Contrôle l’ordre de priorité d’exécution entre beans SPI Customizer et chaînes de filtres. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Applique RBAC NIST Niveau 2, isolation par ownerField et codes de permission avant toute requête ou mutation. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Masque ou annule dynamiquement les colonnes sensibles lorsque les rôles appelants sont insuffisants. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Impose les transitions autorisées via POST /{id}/transition et limite DELETE /{id} à deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Compile des clauses de politique lisibles en règles actives RBAC, transitions et masquage. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Enregistre les écarts champ par champ alimentant la reconstruction temporelle et l’inspection /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Isole automatiquement les requêtes et mutations par locataire actif sauf rôle de contournement. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Valide l’unicité avant persistance lors des créations, mises à jour et upserts. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Génère automatiquement des codes métier uniques préfixés à la création ou au clonage si vides. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Synthétise automatiquement des slugs ASCII normalisés adaptés aux URL à partir de sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Calcule proprement les totaux numériques dérivés avant l’enregistrement de l’entité. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Permet de lier des requêtes SQL/JPQL personnalisées ou méthodes fournisseur aux endpoints. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Désigne une entité JPA comme table catalogue dynamique des rôles RBAC en base de données. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe la colonne du code de rôle unique au sein d’une entité @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifie le champ du nom lisible du rôle sur une entité @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Marque le champ collection ou CSV contenant les codes de permission accordés à un rôle. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Marque une entité JPA stockant les permissions ressource-action et règles de masquage de champs. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Désigne le champ identifiant unique de la permission dans @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe le nom d’entité ou de ressource API (ou joker *) dans @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe le verbe d’action CRUD ou métier protégé par @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Déclare les champs séparés par des virgules à masquer dynamiquement lors du déclenchement de cette règle. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Mappe l’entité JPA liant sujets authentifiés, rôles en base et périmètre locataire optionnel. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifie le champ sujet / nom d’utilisateur principal dans @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Lie la colonne du code de rôle attribué au sein de @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Restreint une attribution @SecurityUserRoleEntity à un identifiant locataire (ou * global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Marque une entité JPA stockant les politiques ALLOW / DENY priorisées par priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe le motif identifiant la ressource cible dans @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe le verbe d’opération protégé (READ, WRITE, DELETE, methodName, *) dans @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappe la collection ou liste CSV de rôles ciblés par une règle @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Spécifie la décision ALLOW ou DENY d’une règle @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Sérialise l’accès concurrent sur des clés SpEL en cache AST (max 1024 ; défauts waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Empêche les écritures dupliquées concurrentes ou rejouées pendant une fenêtre TTL configurable. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Applique une limitation de débit par fenêtre glissante par IP, utilisateur ou locataire. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Enveloppe les opérations dans des disjoncteurs Resilience4j avec télémétrie Actuator & Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Réessaie automatiquement les pannes transitoires avec recul exponentiel configurable. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Calcule des ETag faibles RFC 7232 (W/"...") et émet Cache-Control avec réponses HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Met en cache les résultats de lecture côté serveur dans Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Évince les entrées de cache obsolètes côté serveur lors des mutations. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Mesure la durée d’exécution et émet des logs WARN au-delà du seuil de lenteur. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Envoie des webhooks sortants signés HMAC-SHA256 de manière asynchrone sur Virtual Threads après commit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Publie des enveloppes CNCF CloudEvents v1.0 après validation de la transaction. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Associe les opérations d’entité ou requête à une clé logique de source de données. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Assigne la famille de moteur de base et le shard de cluster logique par entité. |

---

## 1. Routage, Contrats API Dynamiques, Découplage DTO et Paramètres (13 Annotations)

### `@AutoRestController`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Objectif**: Transforme une interface étendant AutoApiController<E> en proxy dynamique JDK enregistrant 40 contrats (38 visibles par défaut dans Swagger UI).
- **Comportement à l’Exécution**: DynamicControllerProxyRegistrarHelper analyse les contrôleurs au démarrage et enregistre les routes dans RequestMappingHandlerMapping.
- **Comment Utiliser**: Appliquez `@AutoRestController(basePath = "/api/v1/...")` sur une interface Java étendant `AutoApiController<E>` ou `AutoReadApi<E>`, puis configurez DTOs et exclusions.
- **Quand Utiliser**: À utiliser pour exposer des endpoints CRUD, pagination, filtres, keyset ou lecture seule sur une entité JPA sans code répétitif.
- **Quand NE PAS Utiliser et Pièges**: NE l’appliquez PAS sur une classe `@RestController` concrète ni sans entité JPA. Pour des catalogues publics en lecture seule, héritez de `AutoReadApi<E>` plutôt que `AutoApiController<E>`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Non (Optionnel) | Chemin HTTP valide commençant par `/` (ex. `/api/v1/product-catalogs`) ou chaîne vide `""` pour dérivation automatique.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Chemin URI racine explicite (ex. "/api/v1/product-catalogs"). Par défaut dérivé du nom en kebab-case pluriel.<br/>*Attention:* Au démarrage, le registraire évalue `basePath` avant `path`. Évitez des valeurs contradictoires. |
| `path` | `String` | `""` | Non (Optionnel) | Chemin HTTP valide commençant par `/` (ex. `/api/v1/orders`) ou chaîne vide `""` pour dérivation automatique.<br/>`@AutoRestController(path = "/api/v1/orders")` | Alias historique du chemin racine. Préférez basePath lu en priorité par DynamicControllerProxyRegistrarHelper.<br/>*Attention:* Au démarrage, le registraire évalue `basePath` avant `path`. Évitez des valeurs contradictoires. |
| `entityName` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"ProductCatalog"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Remplace le nom d’entité affiché dans OpenAPI/Studio à la place du nom simple de E.<br/>*Attention:* Exposé directement dans Swagger / OpenAPI 3.0 et NWVMC Studio ; centralisez les chaînes dans `OpenApiConstant`. |
| `enabledEndpoints` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Liste blanche exacte des méthodes exposées (ex. "getPage", "create"). Vide = toutes actives.<br/>*Attention:* Agit en liste blanche stricte : dès qu’elle n’est pas vide, toute méthode absente est omise de Spring MVC et Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Liste noire désactivant des méthodes exactes avant l’enregistrement Spring MVC.<br/>*Attention:* Évalué après `enabledEndpoints` ; idéal pour bloquer les suppressions ou imports massifs tout en gardant les autres contrats. |
| `enableNestedSubResources` | `boolean` | `false` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Active la navigation récursive GET /{id}/**. Vaut false par défaut pour limiter l’explosion de routes.<br/>*Attention:* Laissez à `false` sauf besoin de parcours `GET /{id}/items/...` ; associez `@EnableNestedSubResource` pour filtrer les relations exposées. |
| `readDto` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `ProductReadDto.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO de lecture optionnel filtrant la sérialisation sans exposer les champs internes de l’entité.<br/>*Attention:* S’applique uniquement au flux lecture (GET) ; le DTO doit fournir constructeur par défaut/getters (ou `@Builder`) et respecte `@Valid`. |
| `createDto` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `ProductCreateDto.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO d’entrée validé par Jakarta Validation avant le mapping POST vers l’entité E.<br/>*Attention:* S’applique uniquement au flux création (POST) ; le DTO doit fournir constructeur par défaut/getters (ou `@Builder`) et respecte `@Valid`. |
| `updateDto` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `ProductUpdateDto.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO de mise à jour restreignant les champs modifiables avec validation sur PUT/PATCH.<br/>*Attention:* S’applique uniquement au flux mise à jour (PUT/PATCH) ; le DTO doit fournir constructeur par défaut/getters (ou `@Builder`) et respecte `@Valid`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Redirige un contrat de contrôleur vers une méthode de bean Spring personnalisée via MethodHandleCacheUtil au lieu du CRUD dynamique.
- **Comportement à l’Exécution**: EscapeHatchDispatchHelper résout le bean cible (par targetBean ou beanName) et met en cache le MethodHandle dans MethodHandleCacheUtil.
- **Comment Utiliser**: Annotez une méthode du contrôleur avec `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` pointant vers un `@Service`/`@Component`.
- **Quand Utiliser**: Idéal quand la majorité des routes restent automatiques mais qu’une route précise demande un code métier Java spécifique.
- **Quand NE PAS Utiliser et Pièges**: Ne passez JAMAIS une chaîne à `targetBean` (c’est un `Class<?>`; utilisez `beanName`). Évitez aussi de dupliquer ce que `@HumanPolicy` gère déjà.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `OrderCustomService.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Classe du bean Spring cible (prioritaire sur beanName si renseignée).<br/>*Attention:* Au démarrage, le registraire évalue `targetBean` avant `beanName`. Évitez des valeurs contradictoires. |
| `beanName` | `String` | `""` | Non (Optionnel) | Nom exact du bean enregistré dans l’ApplicationContext (ex. `"orderCustomService"`) ou `""` pour résolution automatique.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Nom explicite du bean dans le conteneur Spring lorsque targetBean vaut Void.class.<br/>*Attention:* Au démarrage, le registraire évalue `targetBean` avant `beanName`. Évitez des valeurs contradictoires. |
| `methodName` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"createOrder"`) ; laisser `""` pour la convention par défaut.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nom de la méthode cible sur le bean ; par défaut identique au nom sur le contrôleur.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"createOrder"`) sous peine d’erreur runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Non (Optionnel) | `true` (contourner le proxy par défaut et appeler le bean cible) ou `false` (exécuter en complément du routage par défaut).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Si true, court-circuite complètement le CRUD automatique pour invoquer le bean via MethodHandle.<br/>*Attention:* À `true` (défaut), le CRUD natif est totalement court-circuité. Utilisez `false` uniquement pour un hook avant/après le routage standard. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Lie des routes métier dédiées (paiement, remboursement, validation) à des beans Spring @Component Helper indépendants.
- **Comportement à l’Exécution**: Appelle delegateBean.delegateMethod via un MethodHandle mis en cache avec validation et transaction complètes.
- **Comment Utiliser**: Déclarez une méthode sur l’interface avec `path`, `httpMethod`, `delegateBean` et `delegateMethod` pointant vers un helper `@Component`.
- **Quand Utiliser**: À utiliser pour des actions métier dédiées (paiement, remboursement, validation, annulation) rattachées à une ressource.
- **Quand NE PAS Utiliser et Pièges**: N’attendez PAS d’AOP proxy sur `@CustomEndpoint` (`ControllerProxySpecialRouteUtil` court-circuite `invokeProtectedOperation`) ; placez AOP/sécurité sur le bean délégué et préférez `@BusinessAction` pour les transitions simples.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/reports/monthly-sales`) ; `""` lie la racine.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Chemin relatif sous le basePath du contrôleur (ex. "/checkout").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `path` invalide échoue immédiatement avant le trafic. |
| `httpMethod` | `String` | `"GET"` | Non (Optionnel) | L’une des valeurs prises en charge : `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Verbe HTTP associé ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `httpMethod` invalide échoue immédiatement avant le trafic. |
| `delegateBean` | `String` | `""` | Non (Optionnel) | Nom exact du bean enregistré dans l’ApplicationContext (ex. `"orderReportService"`) ou `""` pour résolution automatique.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nom du bean Spring hébergeant le traitement délégué (non vide sauf méthode default ou @ServiceOverride).<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `delegateBean` invalide échoue immédiatement avant le trafic. |
| `delegateMethod` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"buildMonthlyReport"`) ; laisser `""` pour la convention par défaut.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nom de méthode sur delegateBean ; par défaut celui du contrôleur.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"buildMonthlyReport"`) sous peine d’erreur runtime. |
| `summary` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"Get monthly revenue breakdown"`) ; laisser `""` pour la convention par défaut.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Résumé court OpenAPI 3.0 affiché dans Swagger UI.<br/>*Attention:* Exposé directement dans Swagger / OpenAPI 3.0 et NWVMC Studio ; centralisez les chaînes dans `OpenApiConstant`. |
| `description` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"Aggregates confirmed invoice totals grouped by currency"`) ; laisser `""` pour la convention par défaut.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Description détaillée OpenAPI 3.0 visible au dépliage dans Swagger UI.<br/>*Attention:* Exposé directement dans Swagger / OpenAPI 3.0 et NWVMC Studio ; centralisez les chaînes dans `OpenApiConstant`. |

```java
@CustomEndpoint(
    path = "/checkout-cart",
    httpMethod = "POST",
    delegateBean = "advancedOrderCheckoutHelper",
    delegateMethod = "checkoutCart",
    summary = "Checkout cart"
)
```

### `@AutoGet`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Remplacement pur Java de @GetMapping sans import statique Spring Web.
- **Comportement à l’Exécution**: Mappé en RequestMappingInfo HTTP GET lors de l’initialisation du proxy.
- **Comment Utiliser**: Placez `@AutoGet("/chemin")` sur une méthode d’interface `@AutoRestController` (souvent avec `@ServiceOverride` ou `@CustomQuery`).
- **Quand Utiliser**: À utiliser pour des routes HTTP GET en lecture seule dans des interfaces Java pures sans importer `@GetMapping`.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour des mutations d’état (`@AutoPost`/`@AutoDelete`), ni sur une classe `@RestController` classique.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/{id}/summary`) ; `""` lie la racine.<br/>`@AutoGet("/{id}/summary")` | Modèle de chemin GET relatif (ex. "/metrics"). Vide = racine basePath.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `produces` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json", "text/csv"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Types média produits (ex. "text/event-stream", "application/json", "text/csv").<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Accept` ; un en-tête incompatible renvoie `406` ou `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Déclaration HTTP POST pure Java prenant en charge les types MIME consumes/produces personnalisés.
- **Comportement à l’Exécution**: Enregistré comme gestionnaire HTTP POST dans SpringMvcEndpointBridge.
- **Comment Utiliser**: Annotez une méthode avec `@AutoPost("/chemin")`, liez le payload avec `@AutoBody`/`@RequestBody` et associez `@BusinessAction` ou `@ServiceOverride`.
- **Quand Utiliser**: Idéal pour les créations, commandes métier, envois par lots ou workflows POST déclaratifs.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour des lectures (`@AutoGet`), remplacements (`@AutoPut`), mises à jour partielles (`@AutoPatch`) ou suppressions (`@AutoDelete`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/{id}/approve`) ; `""` lie la racine.<br/>`@AutoPost("/{id}/approve")` | Chemin POST relatif sous basePath.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `consumes` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json", "multipart/form-data"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Types Content-Type acceptés en entrée.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Content-Type` ; un en-tête incompatible renvoie `406` ou `415`. |
| `produces` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Types média produits en réponse.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Accept` ; un en-tête incompatible renvoie `406` ou `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Mappage HTTP PUT pur Java pour le remplacement complet d’une ressource.
- **Comportement à l’Exécution**: Lié comme gestionnaire HTTP PUT exécuté dans un périmètre transactionnel.
- **Comment Utiliser**: Placez `@AutoPut("/{id}")` sur une méthode de remplacement complet avec `@AutoVariable` et `@AutoBody`.
- **Quand Utiliser**: À utiliser pour des remplacements complets idempotents recevant la ressource entière.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour des modifications partielles d’un seul champ (préférez `@AutoPatch` ou `@BusinessAction`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/{id}/replace`) ; `""` lie la racine.<br/>`@AutoPut("/{id}/replace")` | Modèle d’URI PUT relatif (ex. "/{id}").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `consumes` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Types Content-Type acceptés.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Content-Type` ; un en-tête incompatible renvoie `406` ou `415`. |
| `produces` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Types média produits en réponse.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Accept` ; un en-tête incompatible renvoie `406` ou `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Déclaration HTTP PATCH pure Java supportant fusion partielle, incréments atomiques et RFC 6902 JSON Patch.
- **Comportement à l’Exécution**: Prend en charge la sémantique de fusion JSON et application/json-patch+json.
- **Comment Utiliser**: Placez `@AutoPatch("/{id}/action")` sur des méthodes de mise à jour partielle ou `@BusinessAction`.
- **Quand Utiliser**: Idéal pour modifications partielles, incréments atomiques et transitions d’état (`@BusinessAction`).
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour un remplacement complet (`@AutoPut`) ou une création (`@AutoPost`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/{id}/status`) ; `""` lie la racine.<br/>`@AutoPatch("/{id}/status")` | Chemin PATCH relatif (ex. "/{id}/approve").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `consumes` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json", "application/merge-patch+json"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Types Content-Type acceptés.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Content-Type` ; un en-tête incompatible renvoie `406` ou `415`. |
| `produces` | `String[]` | `{}` | Non (Optionnel) | Tableau de types MIME (ex. `{"application/json"}`) ; `{}` vide utilise `application/json` par défaut.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Types média produits.<br/>*Attention:* Appliqué par la négociation de contenu Spring MVC via `Accept` ; un en-tête incompatible renvoie `406` ou `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Déclaration HTTP DELETE pure Java déclenchant une suppression logique contrôlée par état.
- **Comportement à l’Exécution**: Valide @StateMachine deletableStates avant de positionner deleted=true.
- **Comment Utiliser**: Placez `@AutoDelete("/{id}/custom")` sur des suppressions personnalisées avec `@ServiceOverride`.
- **Quand Utiliser**: Pour archivage personnalisé, suppression douce spécifique ou nettoyage en cascade via DELETE.
- **Quand NE PAS Utiliser et Pièges**: NE redéfinissez PAS `deleteById` si le soft-delete standard et `@StateMachine` suffisent.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Sous-chemin URI relatif avec variables `{pathVar}` optionnelles (ex. `/{id}/archive`) ; `""` lie la racine.<br/>`@AutoDelete("/{id}/archive")` | Modèle de chemin DELETE relatif (ex. "/{id}/purge").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Objectif**: Lie les paramètres de requête URL ou les cartes de filtres dynamiques Map<String, String>.
- **Comportement à l’Exécution**: Extrait via DynamicQueryParameterParserHelper avec validation par QueryGuardrailEnforcerUtil.
- **Comment Utiliser**: Placez-le sur les paramètres d’interface : `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")`.
- **Quand Utiliser**: Idéal pour conserver des interfaces 100 % Pure Java sans importer Spring Web pour les query params.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour les variables de chemin (`@AutoVariable`) ni le corps JSON (`@AutoBody`). `@RequestParam` est aussi supporté en `v0.1.0`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"status"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoParam("status") String status` | Nom du paramètre query (alias de name). Vide = nom du paramètre Java.<br/>*Attention:* Au démarrage, le registraire évalue `value` avant `name`. Évitez des valeurs contradictoires. |
| `name` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"pageSize"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Nom explicite du paramètre de requête.<br/>*Attention:* Au démarrage, le registraire évalue `value` avant `name`. Évitez des valeurs contradictoires. |
| `required` | `boolean` | `true` | Non (Optionnel) | `true` (obligatoire ; absent renvoie HTTP 400) ou `false` (optionnel ; null passé si absent).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Indique si l’absence du paramètre renvoie HTTP 400.<br/>*Attention:* Devient optionnel dès que `defaultValue` est renseigné ; avec `false`, préférez les types objets (`Integer`) aux primitifs. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Non (Optionnel) | Identifiant non vide (ex. `"20"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Valeur de repli si absent ; par défaut sentinelle DEFAULT_NONE.<br/>*Attention:* Converti depuis String via Spring `ConversionService` vers le type cible ; une valeur incompatible renvoie HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Objectif**: Lie les variables de chemin URI telles que les identifiants UUIDv7 d’entités.
- **Comportement à l’Exécution**: Analysé en valeurs typées Java UUID/String depuis les modèles de chemin MVC.
- **Comment Utiliser**: Annotez les paramètres de chemin : `findById(@AutoVariable("id") UUID id)`.
- **Quand Utiliser**: Pour extraire `{id}`, `{slug}` ou `{code}` dans des interfaces Pure Java.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour les `?query=` (`@AutoParam`) ni le corps JSON (`@AutoBody`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"orderId"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoVariable("orderId") UUID orderId` | Nom de variable de chemin URI (alias de name).<br/>*Attention:* Au démarrage, le registraire évalue `value` avant `name`. Évitez des valeurs contradictoires. |
| `name` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"tenantCode"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Nom explicite de variable de chemin.<br/>*Attention:* Au démarrage, le registraire évalue `value` avant `name`. Évitez des valeurs contradictoires. |
| `required` | `boolean` | `true` | Non (Optionnel) | `true` (obligatoire ; absent renvoie HTTP 400) ou `false` (optionnel ; null passé si absent).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Indique si la variable de chemin est requise.<br/>*Attention:* Doit correspondre à `{variableName}` dans le modèle d’URI ; `false` ne s’applique qu’avec des routes optionnelles. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Objectif**: Désérialise les corps JSON HTTP en paramètres DTO ou Entité avec @Valid.
- **Comportement à l’Exécution**: Validé via LocalValidatorFactoryBean avant l’entrée dans la transaction de service.
- **Comment Utiliser**: Ajoutez `@AutoBody` (et `@Valid`) sur le paramètre payload des méthodes `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Quand Utiliser**: Pour désérialiser un payload JSON vers une entité ou un DTO dans un contrôleur Pure Java.
- **Quand NE PAS Utiliser et Pièges**: NE l’ajoutez PAS sur GET/DELETE sans corps, ni deux `@AutoBody` sur une même méthode.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Non (Optionnel) | `true` (obligatoire ; absent renvoie HTTP 400) ou `false` (optionnel ; null passé si absent).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Indique si un corps de requête manquant déclenche HTTP 400.<br/>*Attention:* Associez `@Valid` pour déclencher la validation Jakarta ; `false` autorise un corps HTTP vide sans erreur `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Autorise le parcours récursif des relations enfants via GET /{id}/{relation}/** avec rejet des cycles.
- **Comportement à l’Exécution**: Nécessite @AutoRestController(enableNestedSubResources = true) sur le contrôleur.
- **Comment Utiliser**: Activez `enableNestedSubResources = true` sur `@AutoRestController` puis restreignez via `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **Quand Utiliser**: Quand des URLs imbriquées `GET /api/v1/customer-orders/{id}/items` sont souhaitées avec contrôle d’accès à chaque niveau.
- **Quand NE PAS Utiliser et Pièges**: NE l’ouvrez PAS sans restreindre `allowedRelationships` sur des entités à forte cardinalité.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Liste blanche optionnelle d’entités cibles accessibles via GET /{id}/**.<br/>*Attention:* Un tableau vide expose toutes les entités enfants ; listez explicitement les classes autorisées pour protéger les tables internes. |
| `allowedRelationships` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Noms explicites des relations JPA autorisées dans les sous-ressources (ex. "items", "customer").<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"items"`) sous peine d’erreur runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Déclare des transitions d’état métier ou ajustements numériques sur des méthodes d’action personnalisées.
- **Comportement à l’Exécution**: Exécuté atomiquement avant la persistance des attributs mis à jour.
- **Comment Utiliser**: Associez `@AutoPatch` et `@BusinessAction(...)` sur une méthode du contrôleur ; le runtime l’exécute dans une transaction.
- **Quand Utiliser**: Pour transitions d’état (`approve`, `cancel`), incréments atomiques ou appels de méthodes métier sans classe Service.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour orchestrer plusieurs entités ou appeler des APIs tierces (préférez `@ServiceOverride` ou `@CustomEndpoint`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ statut de cycle de vie (ex. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nom du champ d’état sur l’entité (validé via @StateMachine si présent).<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"status"`) sous peine d’erreur runtime. |
| `targetStateValue` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"APPROVED"`) ; laisser `""` pour la convention par défaut.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nouvelle valeur d’état à affecter dans la transaction.<br/>*Attention:* Validé automatiquement selon `@StateMachine` ou `@HumanPolicy` avant persistance ; toute transition illégale annule la transaction. |
| `adjustNumericField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ numérique (ex. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Champ numérique incrémenté ou décrémenté atomiquement.<br/>*Attention:* Nécessite `deltaParamIndex >= 0` ou un `fixedDelta` non vide. Supporte `Integer`, `Long`, `BigDecimal` et `Double`. |
| `deltaParamIndex` | `int` | `-1` | Non (Optionnel) | L’une des valeurs prises en charge : `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Indice (base 0) du paramètre portant le delta dynamique ; -1 pour ignorer.<br/>*Attention:* Au démarrage, le registraire évalue `deltaParamIndex` avant `fixedDelta`. Évitez des valeurs contradictoires. |
| `fixedDelta` | `String` | `""` | Non (Optionnel) | L’une des valeurs prises en charge : Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Delta fixe sous forme de chaîne (ex. "100", "-1") utilisé sans paramètre dynamique.<br/>*Attention:* Au démarrage, le registraire évalue `deltaParamIndex` avant `fixedDelta`. Évitez des valeurs contradictoires. |
| `entityMethod` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"markFulfilled"`) ; laisser `""` pour la convention par défaut.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Nom d’une méthode métier sans argument sur l’entité exécutée dans la même transaction.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"markFulfilled"`) sous peine d’erreur runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Découverte de Beans, Liaison de Configuration et Ordre d’Exécution (5 Annotations)

### `@AutoComponent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Marqueur de composant enregistré au démarrage sans import @Component à la compilation.
- **Comportement à l’Exécution**: Scan interne au framework (io.github.natswarchuan) ; vos applications doivent utiliser @Component de Spring.
- **Comment Utiliser**: Stéréotype interne scanné par `AutoBeanFactoryRegistrarBridge` sous `io.github.natswarchuan`.
- **Quand Utiliser**: À utiliser UNIQUEMENT dans les modules internes sous `io.github.natswarchuan.*`.
- **Quand NE PAS Utiliser et Pièges**: N’utilisez JAMAIS dans une application consommatrice (`com.example.*`) ! Utilisez `@Component` de Spring.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Nom exact du bean enregistré dans l’ApplicationContext (ex. `"invoiceValidationHelper"`) ou `""` pour résolution automatique.<br/>`@AutoComponent("invoiceValidationHelper")` | Nom explicite du bean ; vide utilise le nom de classe en camelCase.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Stéréotype de couche service pour les classes ServiceImpl associées à @ServiceOverride.
- **Comportement à l’Exécution**: Scanné dans io.github.natswarchuan par nom de classe ; les services applicatifs utilisent Spring @Service.
- **Comment Utiliser**: Stéréotype interne scanné uniquement sous `io.github.natswarchuan`.
- **Quand Utiliser**: UNIQUEMENT pour les services internes dans `io.github.natswarchuan.*`.
- **Quand NE PAS Utiliser et Pièges**: JAMAIS dans votre application ; utilisez `@Service` de Spring.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Nom exact du bean enregistré dans l’ApplicationContext (ex. `"orderFulfillmentService"`) ou `""` pour résolution automatique.<br/>`@AutoService("orderFulfillmentService")` | Nom explicite optionnel du bean de service.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Déclare des méthodes fabriques de beans gérés dans les classes @AutoConfigurationBean.
- **Comportement à l’Exécution**: Traité par PureJavaBeanRegistrarBridge durant l’auto-configuration.
- **Comment Utiliser**: Placez-le sur les méthodes fabriques des classes `@AutoConfigurationBean` du framework.
- **Quand Utiliser**: UNIQUEMENT dans `io.github.natswarchuan.config.*` côté cœur du framework.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS dans vos `@Configuration` utilisateur ; utilisez `@Bean` de Spring.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Nom(s) et alias explicites du bean.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `targetTypeName` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"com.example.spi.PaymentGateway"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | FQCN optionnel du type cible pour vérification bridge.<br/>*Attention:* Nom pleinement qualifié optionnel si la fabrique retourne un proxy ou supertype ; la classe doit être présente au classpath. |
| `primary` | `boolean` | `false` | Non (Optionnel) | `true` (bean prioritaire parmi plusieurs candidats) ou `false` (priorité standard).<br/>`@AutoBean(primary = true)` | Désigne ce bean comme candidat prioritaire lors des injections.<br/>*Attention:* Déclarer deux `@AutoBean(primary = true)` pour un même type provoque un conflit d’ambiguïté au démarrage. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Marque les classes de configuration et modèles liés aux propriétés YAML.
- **Comportement à l’Exécution**: Enregistre proprement les beans de configuration et préfixes YAML avec métadonnées IDE.
- **Comment Utiliser**: Annote les classes de configuration/propriétés internes dans `io.github.natswarchuan.config.*`.
- **Quand Utiliser**: UNIQUEMENT dans le cœur du framework en remplacement Pure Java de `@Configuration`.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS dans votre application ; utilisez `@Configuration` de Spring.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | Nom exact du bean enregistré dans l’ApplicationContext (ex. `"storageAutoConfig"`) ou `""` pour résolution automatique.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Identifiant optionnel du bean de configuration.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `prefix` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"nwvmc.storage"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Préfixe YAML optionnel lié via `PureJavaBeanRegistrarBridge`.<br/>*Attention:* Lie les propriétés kebab-case d’`application.yml` ; ajoutez `spring-configuration-metadata.json` pour l’autocomplétion IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Objectif**: Contrôle l’ordre de priorité d’exécution entre beans SPI Customizer et chaînes de filtres.
- **Comportement à l’Exécution**: Les valeurs entières inférieures s’exécutent plus tôt (par défaut Integer.MAX_VALUE).
- **Comment Utiliser**: Placez `@OrderPriority(1)` sur les composants ordonnancés par le bootstrap Pure Java.
- **Quand Utiliser**: Quand l’ordre déterministe entre plusieurs customizers ou filtres est requis.
- **Quand NE PAS Utiliser et Pièges**: NE le confondez PAS avec l’ordre des filtres Security ni le tri SQL `?sort=`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Non (Optionnel) | L’une des valeurs prises en charge : Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Priorité entière ; une valeur faible s’exécute plus tôt.<br/>*Attention:* Les valeurs les plus basses s’exécutent EN PREMIER (comme `@Order`). Réservez `< 0` à la sécurité/traçage et `10..100` au métier. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Sécurité d’Entité, Machine à États, Intégrité, Générateurs et Requêtes (11 Annotations)

### `@EntitySecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Applique RBAC NIST Niveau 2, isolation par ownerField et codes de permission avant toute requête ou mutation.
- **Comportement à l’Exécution**: Évalué avant l’exécution SQL ; tout accès non autorisé renvoie HTTP 403 Forbidden.
- **Comment Utiliser**: Annotez l’entité JPA avec `readRoles`, `writeRoles`, `deleteRoles`, et `ownerField` si l’isolation par propriétaire est requise.
- **Quand Utiliser**: À appliquer sur TOUTE entité exposée pour sécuriser uniformément REST, batch, export et GraphQL.
- **Quand NE PAS Utiliser et Pièges**: N’activez PAS `permitAll = true` sur un `AutoApiController<E>` complet sans `AutoReadApi<E>`, `disabledEndpoints` ou `@SecurityPolicyEntity` (il contourne READ, WRITE et DELETE sans politique DB).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_USER", "ROLE_ADMIN"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Rôles autorisés en lecture (GET, GraphQL, analytics, export).<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |
| `writeRoles` | `String[]` | `{}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_MANAGER", "ROLE_ADMIN"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Rôles autorisés pour les écritures POST/PUT/PATCH/import/batch.<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |
| `deleteRoles` | `String[]` | `{}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Rôles autorisés pour DELETE et suppression par lots.<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |
| `permitAll` | `boolean` | `false` | Non (Optionnel) | `true` (autoriser l’accès public anonyme) ou `false` (exiger authentification et contrôle des rôles).<br/>`@EntitySecurity(permitAll = true)` | Si true (et sans politique DB-RBAC), contourne @EntitySecurity sur READ, WRITE et DELETE ; associez AutoReadApi<E> ou disabledEndpoints.<br/>*Attention:* Court-circuite `readRoles`/`writeRoles`/`deleteRoles` et autorise l’accès anonyme. Interdit sur les données sensibles ou financières. |
| `ownerField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ propriétaire/UUID (ex. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Champ contenant l’identifiant du propriétaire ("createdBy") ; bloque les attaques IDOR.<br/>*Attention:* Impose l’isolation par propriétaire sur `GET`/`PUT`/`PATCH`/`DELETE`, sauf si l’utilisateur détient un rôle de `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Rôles privilégiés exemptés du contrôle `ownerField`.<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |
| `permissions` | `String[]` | `{}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ORDER_READ", "ORDER_APPROVE"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Codes de permission fins évalués avec les rôles (DB RBAC).<br/>*Attention:* Évalué face aux permissions fines des claims JWT ou de `@SecurityPermissionEntity` (DB-RBAC). |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Masque ou annule dynamiquement les colonnes sensibles lorsque les rôles appelants sont insuffisants.
- **Comportement à l’Exécution**: Appliqué après lecture et avant sérialisation JSON.
- **Comment Utiliser**: Placez-le sur les champs sensibles (`costPrice`, `ssn`) ; le masquage opère sur des copies clonées sûres.
- **Quand Utiliser**: Quand une même API sert plusieurs profils dont certains ne doivent pas voir certains champs en REST et GraphQL.
- **Quand NE PAS Utiliser et Pièges**: Les champs non-`String` deviennent déjà `null` automatiquement ; utilisez `nullifyInsteadOfMask = true` si un champ `String` doit valoir `null` plutôt que `"******"`, ou `readDto` pour masquer la clé JSON.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_ADMIN", "ROLE_FINANCE"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Rôles autorisés à voir la valeur réelle non masquée.<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |
| `maskPattern` | `String` | `"******"` | Non (Optionnel) | Identifiant non vide (ex. `"***-**-****"`) ; laisser `""` pour la convention par défaut.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Chaîne de masquage appliquée aux champs String sans rôle.<br/>*Attention:* Ignoré si `nullifyInsteadOfMask = true`. Pour les champs non-String (`BigDecimal`, `LocalDate`), utilisez `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Non (Optionnel) | `true` (remplacer le champ non autorisé par null) ou `false` (appliquer la chaîne maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Si true, force null sur les String au lieu de maskPattern (les types non-String sont déjà mis à null automatiquement).<br/>*Attention:* Indispensable pour nombres, dates et objets afin que les clients TypeScript/Zod reçoivent un `null` typé valide. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Impose les transitions autorisées via POST /{id}/transition et limite DELETE /{id} à deletableStates.
- **Comportement à l’Exécution**: Rejette toute transition ou suppression illégale avec HTTP 422 BusinessRuleViolationException.
- **Comment Utiliser**: Placez-le sur le champ String d’état avec le séparateur `:` (`"CREATED:PAID,CANCELLED"`).
- **Quand Utiliser**: Pour cycles de vie stricts (commandes, prêts, factures) rejetant toute transition illégale (`HTTP 422`).
- **Quand NE PAS Utiliser et Pièges**: N’écrivez JAMAIS `"->"` (`EntityStateMachineUtil` découpe uniquement sur `":"`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Non (Optionnel) | Identifiant non vide (ex. `"CREATED"`) ; laisser `""` pour la convention par défaut.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | État initial attribué à la création si le champ est vide ("ACTIVE").<br/>*Attention:* Appliqué automatiquement à la création `POST` si le champ est vide ; doit correspondre à l’état avant `:` dans `transitions`. |
| `transitions` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Transitions autorisées au format "FROM:TO_1,TO_2" (séparateur deux-points).<br/>*Attention:* Exige la syntaxe exacte `"FROM:TO1,TO2"` (sensible à la casse, cibles séparées par des virgules). Toute transition non déclarée échoue en HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | États autorisant la suppression DELETE (les autres renvoient HTTP 422).<br/>*Attention:* S’il n’est pas vide, `DELETE /{id}` échoue en HTTP `409 Conflict` dès que l’entité est dans un autre état (ex. `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Compile des clauses de politique lisibles en règles actives RBAC, transitions et masquage.
- **Comportement à l’Exécution**: Inspectable via GET /human-policy et surchargeable en YAML sous spring-nwvmc.human-policies.<Entity>.
- **Comment Utiliser**: Déclarez `@HumanPolicy` sur l’entité ou dans `spring-nwvmc.human-policies` YAML ; compilé par `HumanPolicyRegistryHelper`.
- **Quand Utiliser**: Quand les équipes produit/conformité souhaitent des règles lisibles et externalisables en YAML.
- **Quand NE PAS Utiliser et Pièges**: N’écrivez PAS de texte libre arbitraire ni d’autre langue que les gabarits anglais supportés.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Non (Optionnel) | L’une des valeurs prises en charge : Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Directive en anglais naturel compilée en règles de transition d’état.<br/>*Attention:* Compilé au démarrage vers le même moteur que `@StateMachine` ; évitez de déclarer des règles contradictoires. |
| `security` | `String` | `""` | Non (Optionnel) | L’une des valeurs prises en charge : Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Directive RBAC en anglais naturel pour lecture/écriture/suppression/propriétaire.<br/>*Attention:* Les rôles sont automatiquement normalisés avec le préfixe `ROLE_` et validés dès le démarrage. |
| `masking` | `String` | `""` | Non (Optionnel) | L’une des valeurs prises en charge : Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Règle de masquage de champs rédigée en anglais naturel.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"costPrice"`) sous peine d’erreur runtime. |
| `stateField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ statut de cycle de vie (ex. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Nom du champ d’état géré lorsque `lifecycle` est fourni.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"orderStatus"`) sous peine d’erreur runtime. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Enregistre les écarts champ par champ alimentant la reconstruction temporelle et l’inspection /diff.
- **Comportement à l’Exécution**: Capture les deltas oldValue et newValue lors des opérations create, update, patch, transition et restore.
- **Comment Utiliser**: Annotez l’entité `BaseAuditEntity` avec `@AuditTrail` ; `AuditTrailService` capture chaque mutation.
- **Quand Utiliser**: Sur les entités soumises à conformité (paiements, dossiers médicaux, comptes) exigeant `/{id}/revisions`.
- **Quand NE PAS Utiliser et Pièges**: Évitez sur les tables de logs à très fort débit d’écriture pour limiter l’amplification d’E/S.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"FINANCE_LEDGER"`) ; laisser `""` pour la convention par défaut.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Catégorie d’audit logique ; vide utilise le nom simple de l’entité.<br/>*Attention:* Catégorise les journaux d’audit pour le filtrage ; `""` utilise le nom simple de l’entité JPA. |
| `recordFieldDiffs` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Si true, calcule les deltas champ par champ entre ancien et nouvel état (Time-Travel).<br/>*Attention:* Enregistre le diff avant/après sur `PUT`/`PATCH` ; mettez `false` sur les gros blobs ou écritures haute fréquence. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Isole automatiquement les requêtes et mutations par locataire actif sauf rôle de contournement.
- **Comportement à l’Exécution**: Échoue en HTTP 403 si le contexte locataire est absent sans rôle bypass ; écrase tenantId à la création (anti-spoofing) et protège toute opération par ID contre l’IDOR.
- **Comment Utiliser**: Placez `@MultiTenant` sur l’entité SaaS : filtrage en lecture, blocage `403` si tenant absent et anti-usurpation à l’écriture.
- **Quand Utiliser**: Sur toutes les tables SaaS mutualisées (boutiques, commandes, factures) pour garantir l’étanchéité.
- **Quand NE PAS Utiliser et Pièges**: NE le mettez PAS sur les référentiels globaux (pays, devises), et vérifiez la fourniture de `tenantId`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ identifiant locataire (ex. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Nom du champ contenant l’identifiant du locataire (défaut "tenantId").<br/>*Attention:* Créez un index composite `(tenant_id, id)` en base pour garantir des requêtes rapides et un cloisonnement strict. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Non (Optionnel) | Tableau de rôles Spring Security (ex. `{"ROLE_SUPER_ADMIN"}`) ; `{}` vide n’ajoute pas de restriction dédiée.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Rôles plateforme autorisés à accéder à tous les tenants sans restriction.<br/>*Attention:* Centralisez les rôles dans `RoleConstant` avec le préfixe `ROLE_` (ex. `ROLE_ADMIN`) correspondant à `GrantedAuthority`. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Valide l’unicité avant persistance lors des créations, mises à jour et upserts.
- **Comportement à l’Exécution**: Lève ConflictBusinessException (HTTP 409) lorsqu’un doublon existe.
- **Comment Utiliser**: Placez `@UniqueField` sur les clés métier (`email`, `skuCode`) en complément de `@Column(unique = true)`.
- **Quand Utiliser**: Quand vous voulez des erreurs `HTTP 409 Conflict` localisées tout en ignorant les lignes supprimées logiquement.
- **Quand NE PAS Utiliser et Pièges**: NE vous passez PAS d’un index `UNIQUE` en base sous forte concurrence.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Génère automatiquement des codes métier uniques préfixés à la création ou au clonage si vides.
- **Comportement à l’Exécution**: Renseigne le préfixe + jeton unique avant validation et sauvegarde.
- **Comment Utiliser**: Placez `@AutoCode(prefix = "PRD-")` sur le champ String ; généré automatiquement à la création/clonage si vide.
- **Quand Utiliser**: Pour des codes lisibles (commandes, SKU, boutiques, tickets) basés sur UUIDv7 sans contention de séquence SQL.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS si la réglementation impose des séquences strictement contiguës sans trou (`1, 2, 3...`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Oui (Requis)** | Identifiant non vide (ex. `"ORD"`) ; laisser `""` pour la convention par défaut.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Préfixe obligatoire accolé devant un hash UUIDv7 de 8 caractères en majuscules (ex. "PRD-").<br/>*Attention:* Attribut obligatoire ; génère un code comme `INV-2026-0001` uniquement si le champ est vide à la création. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Synthétise automatiquement des slugs ASCII normalisés adaptés aux URL à partir de sourceField.
- **Comportement à l’Exécution**: Normalise les signes diacritiques Unicode et permet la recherche filtrée par slug.
- **Comment Utiliser**: Placez `@AutoSlug(sourceField = "name")` sur le champ `slug` ; rempli automatiquement à la création ou clonage.
- **Quand Utiliser**: Pour des URLs SEO propres (boutiques, articles, produits) à partir de titres avec accents.
- **Quand NE PAS Utiliser et Pièges**: NE référencez PAS un champ inexistant dans `sourceField` ; la modification du titre n’écrase pas un slug existant.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Oui (Requis)** | Nom exact de la propriété Java sur l’entité correspondant à un champ chaîne (ex. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Nom obligatoire du champ source normalisé en slug ASCII minuscule avec tirets.<br/>*Attention:* Obligatoire ; normalise accents et Unicode en kebab-case URL. Associez `@UniqueField` pour garantir l’unicité. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Objectif**: Calcule proprement les totaux numériques dérivés avant l’enregistrement de l’entité.
- **Comportement à l’Exécution**: Validé au démarrage par ComputedFieldFailFastUtil afin d’échouer rapidement en cas d’erreur.
- **Comment Utiliser**: Placez-le sur le champ calculé (`BigDecimal totalAmount`) ; recalculé côté serveur avant sauvegarde.
- **Quand Utiliser**: Pour des totaux autoritaires côté serveur empêchant toute falsification des montants par le client.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS pour des tarifs par paliers complexes ou appels externes (`@ServiceOverride`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Non (Optionnel) | L’une des valeurs prises en charge : `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Stratégie de calcul : "MULTIPLY" ou "SUM_COLLECTION".<br/>*Attention:* Recalculé automatiquement avant persistance sur `POST`/`PUT`/`PATCH`, empêchant toute falsification côté client. |
| `sourceFields` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Champs de l’entité multipliés ensemble lorsque operation = "MULTIPLY".<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"unitPrice"`) sous peine d’erreur runtime. |
| `collectionField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ collection @OneToMany (ex. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Nom de la collection @OneToMany agrégée en mode "SUM_COLLECTION" (ex. "items").<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"items"`) sous peine d’erreur runtime. |
| `itemField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ numérique (ex. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Champ numérique de chaque élément enfant à additionner (ex. "subTotal").<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"subTotal"`) sous peine d’erreur runtime. |
| `subtractField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ numérique (ex. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Champ de déduction sur le parent soustrait de la somme (ex. "discountAmount").<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"discountAmount"`) sous peine d’erreur runtime. |
| `addField` | `String` | `""` | Non (Optionnel) | Nom exact de la propriété Java sur l’entité correspondant à un champ numérique (ex. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Champ de supplément ajouté au total (ex. "shippingFee").<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"shippingFee"`) sous peine d’erreur runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Permet de lier des requêtes SQL/JPQL personnalisées ou méthodes fournisseur aux endpoints.
- **Comportement à l’Exécution**: Exécuté avec paramètres nommés liés via JPA EntityManager.
- **Comment Utiliser**: Associez `@CustomQuery` à `@AutoGet`/`@AutoPost` et liez chaque `:param` avec `@AutoParam`/`@AutoVariable`.
- **Quand Utiliser**: Pour requêtes SQL natives, CTE, fonctions de fenêtrage ou JSONB sans créer de repository manuel.
- **Quand NE PAS Utiliser et Pièges**: N’concaténez JAMAIS d’entrées utilisateur dans le SQL ; utilisez uniquement `:param` et évitez les JOIN entre domaines.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Non (Optionnel) | L’une des valeurs prises en charge : Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Requête SQL ou JPQL inline avec paramètres nommés `:param`.<br/>*Attention:* Utilisez toujours des paramètres liés `:param` ou `?1` contre l’injection SQL ; laissez `""` avec `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Non (Optionnel) | `true` (exécuter du SQL natif) ou `false` (exécuter du JPQL JPA portable).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true exécute du SQL natif ; false exécute du JPQL.<br/>*Attention:* SQL natif (`true`) ouvre les CTE et fonctions fenêtres ; choisissez `false` (JPQL) pour la portabilité H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `MonthlyRevenueDto.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Classe cible optionnelle pour mapper les résultats.<br/>*Attention:* Indiquez toujours un DTO de projection pour les agrégats afin d’éviter `SELECT *` et les lignes `Object[]`. |
| `sqlProvider` | `Class<?>` | `Void.class` | Non (Optionnel) | Toute classe Java concrète (ex. `OrderAnalyticsSqlProvider.class`) ou `Void.class` pour désactiver le mapping DTO.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Classe Pure Java fournissant du SQL dynamique, vérifiée au démarrage.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `sqlProvider` invalide échoue immédiatement avant le trafic. |
| `providerMethod` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"buildRevenueSql"`) ; laisser `""` pour la convention par défaut.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nom de la méthode dans `sqlProvider` retournant la requête SQL.<br/>*Attention:* Doit correspondre exactement à l’identifiant Java (sensible à la casse, ex. `"buildRevenueSql"`) sous peine d’erreur runtime. |
| `modifying` | `boolean` | `false` | Non (Optionnel) | `true` (DML UPDATE/DELETE en transaction d’écriture) ou `false` (requête SELECT en lecture seule).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Doit valoir `true` pour les requêtes INSERT/UPDATE/DELETE (`executeUpdate()`).<br/>*Attention:* Requis (`true`) pour tout `UPDATE`/`DELETE` ; ouvre une transaction en écriture et synchronise le contexte JPA. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC Dynamique en Base de Données et Méta-Annotations de Masquage (18 Annotations)

### `@SecurityRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Objectif**: Désigne une entité JPA comme table catalogue dynamique des rôles RBAC en base de données.
- **Comportement à l’Exécution**: DynamicDatabaseRbacProviderHelper met en cache les liaisons rôle-permission dans Caffeine et les invalide à l’écriture.
- **Comment Utiliser**: Placez `@SecurityRoleEntity` sur l’entité Role avec `@RoleCode` obligatoire (et `@RolePermissions` en option).
- **Quand Utiliser**: Lorsque vos administrateurs gèrent les rôles dynamiquement en base de données.
- **Quand NE PAS Utiliser et Pièges**: N’omettez JAMAIS `@RoleCode` (échec au démarrage) et ne déclarez qu’une seule `@SecurityRoleEntity`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Non (Optionnel) | Nombre positif (`>= 1`) en secondes ; ex. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL en secondes du cache Caffeine (invalidé automatiquement lors de modifications).<br/>*Attention:* Un TTL court propage vite les changements mais sollicite la base ; un TTL long allège la base mais retarde les révocations. |

```java
@Entity
@Table(name = "sec_roles")
@SecurityRoleEntity(cacheTtlSeconds = 60L)
public class AppSecurityRole {
  @RoleCode private String code;
  @RoleName private String name;
  @RolePermissions private String permissionsCsv;
}
```

### `@RoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe la colonne du code de rôle unique au sein d’une entité @SecurityRoleEntity.
- **Comportement à l’Exécution**: Lu via LambdaAccessorUtil en cache pour correspondre aux jetons GrantedAuthority.
- **Comment Utiliser**: Placez `@RoleCode` sur le champ ou getter correspondant de l’entité `@SecurityRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Identifie le champ du nom lisible du rôle sur une entité @SecurityRoleEntity.
- **Comportement à l’Exécution**: Exposé dans les métadonnées de diagnostic RBAC et l’inspecteur Dev Studio.
- **Comment Utiliser**: Placez `@RoleName` sur le champ ou getter correspondant de l’entité `@SecurityRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Marque le champ collection ou CSV contenant les codes de permission accordés à un rôle.
- **Comportement à l’Exécution**: Analysé dynamiquement et étendu vers les autorités effectives de SecurityIdentityCustomizer.
- **Comment Utiliser**: Placez `@RolePermissions` sur le champ ou getter correspondant de l’entité `@SecurityRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Objectif**: Marque une entité JPA stockant les permissions ressource-action et règles de masquage de champs.
- **Comportement à l’Exécution**: Chargé dans DatabaseRbacRuleMatcherHelper pour appliquer le contrôle CRUD et le masquage après lecture.
- **Comment Utiliser**: Placez `@SecurityPermissionEntity` sur l’entité Permission avec `@PermissionCode` obligatoire.
- **Quand Utiliser**: Pour piloter dynamiquement permissions ressource/action et masquage de champs depuis la base.
- **Quand NE PAS Utiliser et Pièges**: N’omettez PAS `@PermissionCode` et ne définissez qu’une seule `@SecurityPermissionEntity`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Non (Optionnel) | Nombre positif (`>= 1`) en secondes ; ex. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL en secondes dans Caffeine pour le cache des permissions.<br/>*Attention:* Un TTL court propage vite les changements mais sollicite la base ; un TTL long allège la base mais retarde les révocations. |

```java
@Entity
@Table(name = "sec_permissions")
@SecurityPermissionEntity(cacheTtlSeconds = 60L)
public class AppSecurityPermission {
  @PermissionCode private String code;
  @PermissionResource private String resource;
  @PermissionAction private String action;
  @PermissionFieldMask private String maskedFields;
}
```

### `@PermissionCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Désigne le champ identifiant unique de la permission dans @SecurityPermissionEntity.
- **Comportement à l’Exécution**: Comparé aux autorités de l’appelant et aux codes @EntitySecurity.permissions().
- **Comment Utiliser**: Placez `@PermissionCode` sur le champ ou getter correspondant de l’entité `@SecurityPermissionEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPermissionEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPermissionEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe le nom d’entité ou de ressource API (ou joker *) dans @SecurityPermissionEntity.
- **Comportement à l’Exécution**: Évalué sans distinction de casse par DatabaseRbacRuleMatcherHelper avec repli générique.
- **Comment Utiliser**: Placez `@PermissionResource` sur le champ ou getter correspondant de l’entité `@SecurityPermissionEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPermissionEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPermissionEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe le verbe d’action CRUD ou métier protégé par @SecurityPermissionEntity.
- **Comportement à l’Exécution**: Normalisé automatiquement depuis les méthodes du contrôleur (READ, WRITE, DELETE ou action personnalisée).
- **Comment Utiliser**: Placez `@PermissionAction` sur le champ ou getter correspondant de l’entité `@SecurityPermissionEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPermissionEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPermissionEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Déclare les champs séparés par des virgules à masquer dynamiquement lors du déclenchement de cette règle.
- **Comportement à l’Exécution**: Appliqué dynamiquement avec @FieldSecurity avant la sérialisation JSON HTTP.
- **Comment Utiliser**: Placez `@PermissionFieldMask` sur le champ ou getter correspondant de l’entité `@SecurityPermissionEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPermissionEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPermissionEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Objectif**: Mappe l’entité JPA liant sujets authentifiés, rôles en base et périmètre locataire optionnel.
- **Comportement à l’Exécution**: Interrogé automatiquement lors de l’hydratation JWT / SecurityContext via SecurityIdentityCustomizer.
- **Comment Utiliser**: Placez `@SecurityUserRoleEntity` sur la table d’association avec `@UserRoleSubject` et `@UserRoleCode`.
- **Quand Utiliser**: Quand le JWT identifie l’utilisateur et que ses rôles doivent être résolus dynamiquement depuis la BDD.
- **Quand NE PAS Utiliser et Pièges**: N’oubliez PAS `@UserRoleSubject` ; inutile si votre IdP fournit déjà tous les rôles dans le JWT.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@SecurityUserRoleEntity(enabled = true)` | Interrupteur permettant d’activer/désactiver la lecture des liaisons utilisateur-rôle.<br/>*Attention:* Passez à `false` temporairement lors d’une migration tout en conservant les rôles portés par le JWT. |

```java
@Entity
@Table(name = "sec_user_roles")
@SecurityUserRoleEntity(enabled = true)
public class AppSecurityUserRole {
  @UserRoleSubject private String subject;
  @UserRoleCode private String roleCode;
  @UserRoleTenantId private String tenantId;
}
```

### `@UserRoleSubject`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Identifie le champ sujet / nom d’utilisateur principal dans @SecurityUserRoleEntity.
- **Comportement à l’Exécution**: Comparé à Authentication.getName() issu du SecurityContext actif.
- **Comment Utiliser**: Placez `@UserRoleSubject` sur le champ ou getter correspondant de l’entité `@SecurityUserRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityUserRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityUserRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Lie la colonne du code de rôle attribué au sein de @SecurityUserRoleEntity.
- **Comportement à l’Exécution**: Résout les permissions liées de @SecurityRoleEntity lors de l’évaluation des politiques.
- **Comment Utiliser**: Placez `@UserRoleCode` sur le champ ou getter correspondant de l’entité `@SecurityUserRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityUserRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityUserRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Restreint une attribution @SecurityUserRoleEntity à un identifiant locataire (ou * global).
- **Comportement à l’Exécution**: Filtré selon TenantContextHolder / X-Tenant-ID sur chaque requête authentifiée.
- **Comment Utiliser**: Placez `@UserRoleTenantId` sur le champ ou getter correspondant de l’entité `@SecurityUserRoleEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityUserRoleEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityUserRoleEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Objectif**: Marque une entité JPA stockant les politiques ALLOW / DENY priorisées par priority.
- **Comportement à l’Exécution**: Tout DENY explicite l’emporte de manière déterministe sur ALLOW avant exécution SQL.
- **Comment Utiliser**: Placez `@SecurityPolicyEntity` sur l’entité règle avec `@PolicyAllowedRoles` obligatoire et `@PolicyEffect` ("ALLOW"/"DENY").
- **Quand Utiliser**: Pour surcharger dynamiquement `@EntitySecurity` depuis la base (y compris via des règles `DENY` d’urgence).
- **Quand NE PAS Utiliser et Pièges**: N’omettez PAS `@PolicyAllowedRoles` ; gardez en tête qu’un `DENY` explicite prime sur `ALLOW`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Non (Optionnel) | Nombre positif (`>= 0`) en priorité entière ; ex. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Ordre de priorité d’évaluation des politiques (plus petit = plus prioritaire).<br/>*Attention:* Une valeur plus faible est prioritaire lorsque plusieurs politiques s’appliquent (ex. `10` prime sur `100`). |

```java
@Entity
@Table(name = "sec_policies")
@SecurityPolicyEntity(priority = 10)
public class AppSecurityPolicy {
  @PolicyResource private String resource;
  @PolicyAction private String action;
  @PolicyAllowedRoles private String allowedRoles;
  @PolicyEffect private String effect; // ALLOW | DENY
}
```

### `@PolicyResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe le motif identifiant la ressource cible dans @SecurityPolicyEntity.
- **Comportement à l’Exécution**: Supporte les noms exacts d’entité/ressource ainsi que le joker *.
- **Comment Utiliser**: Placez `@PolicyResource` sur le champ ou getter correspondant de l’entité `@SecurityPolicyEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPolicyEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPolicyEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe le verbe d’opération protégé (READ, WRITE, DELETE, methodName, *) dans @SecurityPolicyEntity.
- **Comportement à l’Exécution**: Évalué pour chaque opération HTTP avant la délégation au service.
- **Comment Utiliser**: Placez `@PolicyAction` sur le champ ou getter correspondant de l’entité `@SecurityPolicyEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPolicyEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPolicyEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Mappe la collection ou liste CSV de rôles ciblés par une règle @SecurityPolicyEntity.
- **Comportement à l’Exécution**: Vérifié par rapport aux autorités JWT actives et aux rôles @SecurityUserRoleEntity chargés depuis la base.
- **Comment Utiliser**: Placez `@PolicyAllowedRoles` sur le champ ou getter correspondant de l’entité `@SecurityPolicyEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPolicyEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPolicyEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Objectif**: Spécifie la décision ALLOW ou DENY d’une règle @SecurityPolicyEntity.
- **Comportement à l’Exécution**: Toute règle DENY correspondante interrompt immédiatement la requête avec HTTP 403 AccessDeniedBusinessException.
- **Comment Utiliser**: Placez `@PolicyEffect` sur le champ ou getter correspondant de l’entité `@SecurityPolicyEntity`.
- **Quand Utiliser**: Pour lier vos colonnes métier de `@SecurityPolicyEntity` au moteur DB-RBAC sans renommer la base.
- **Quand NE PAS Utiliser et Pièges**: NE le dupliquez PAS sur plusieurs champs ni en dehors d’une entité `@SecurityPolicyEntity`.

> **Annotation Marqueur** : Annotation marqueur pure — ne déclare aucun attribut.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Verrouillage Distribué, Idempotence, Cache, Multi-Base et CloudEvents (13 Annotations)

### `@DistributedLock`

- **Package**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Objectif**: Sérialise l’accès concurrent sur des clés SpEL en cache AST (max 1024 ; défauts waitTimeMs=3000L, leaseTimeMs=5000L).
- **Comportement à l’Exécution**: DistributedLockAspect lève DistributedLockAcquisitionException (HTTP 409) après expiration.
- **Comment Utiliser**: Placez-le sur une méthode `@Service` non-finale ; en cluster, fournissez un bean `DistributedLockProvider` Redis.
- **Quand Utiliser**: Pour empêcher la survente de stock, les débits concurrents ou les exécutions parallèles conflictuelles.
- **Quand NE PAS Utiliser et Pièges**: NE croyez PAS que le fournisseur Caffeine par défaut synchronise plusieurs nœuds ; remplacez `DistributedLockProvider` en cluster.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Non (Optionnel) | Expression SpEL référençant les paramètres (ex. `"'inventory:' + #skuId"`) ou `""` pour une clé générée automatiquement.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Expression SpEL de clé de verrouillage évaluée au runtime.<br/>*Attention:* Ciblez toujours l’ID de ressource le plus fin (`#id`) ; une clé constante sérialise tous les utilisateurs. |
| `waitTimeMs` | `long` | `3000L` | Non (Optionnel) | Nombre positif (`>= 0`) en millisecondes ; ex. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Attente maximale en millisecondes avant échec d’acquisition (défaut 3000L).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : trop bas provoque des 409 prématurés ; trop haut bloque les requêtes lors des pics. |
| `leaseTimeMs` | `long` | `5000L` | Non (Optionnel) | Nombre positif (`>= 100`) en millisecondes ; ex. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Durée maximale du bail du verrou en millisecondes (5000L).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : doit dépasser la latence p99 de la transaction sinon le verrou expire avant le commit. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Empêche les écritures dupliquées concurrentes ou rejouées pendant une fenêtre TTL configurable.
- **Comportement à l’Exécution**: Appliqué par IdempotencyAspect + ProxyIdempotencyGuardHelper avec verrou TTL Caffeine (HTTP 409 ConflictBusinessException) ; IdempotencyManagerHelper offre une aide SHA-256 optionnelle.
- **Comment Utiliser**: Annotez une méthode `@AutoRestController` ou d’un `@Service` non-final ; les échecs libèrent la clé automatiquement.
- **Quand Utiliser**: Pour paiements, virements et mutations POST exposés aux doubles soumissions réseau.
- **Quand NE PAS Utiliser et Pièges**: NE l’utilisez PAS sur des GET, et fournissez un `IdempotencyStoreProvider` Redis en environnement multi-nœuds.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Non (Optionnel) | Nom d’en-tête HTTP valide (insensible à la casse sur le réseau, ex. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | En-tête HTTP contenant la clé client ; absent ou vide = contournement sûr.<br/>*Attention:* Le client doit envoyer un UUIDv7 unique par opération et le réutiliser lors des réessais ; exposez-le dans CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Non (Optionnel) | Nombre positif (`>= 1`) en secondes ; ex. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Fenêtre de déduplication en secondes rejetant tout rejeu par HTTP 409 Conflict (300L).<br/>*Attention:* Durée de rétention dans Redis/mémoire ; réglez entre `300L` et `86400L` selon la fenêtre de réessai client. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Applique une limitation de débit par fenêtre glissante par IP, utilisateur ou locataire.
- **Comportement à l’Exécution**: Incrémente nwvmc.ratelimit.rejected.total et répond HTTP 429 Too Many Requests.
- **Comment Utiliser**: Placez `@RateLimit` sur le contrôleur ou une méthode ; émet `X-RateLimit-Remaining`/`X-RateLimit-Reset`, puis `HTTP 429` + `Retry-After` en cas de dépassement.
- **Quand Utiliser**: Sur recherches publiques, endpoints OTP/auth, requêtes AI et exports lourds pour éviter les abus.
- **Quand NE PAS Utiliser et Pièges**: NE limitez PAS trop les sondes santé et évitez `"GLOBAL"` lorsqu’il faut isoler les utilisateurs ou locataires (`"USER"`, `"TENANT"`, `"IP"`).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Non (Optionnel) | Nombre positif (`>= 1`) en requêtes ; ex. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Nombre maximal d’appels autorisés par fenêtre glissante (60).<br/>*Attention:* Émet les en-têtes `X-RateLimit-Remaining`, `X-RateLimit-Reset` et `Retry-After` (RFC 6585) en cas de HTTP `429`. |
| `windowSeconds` | `int` | `60` | Non (Optionnel) | Nombre positif (`>= 1`) en secondes ; ex. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Durée de la fenêtre en secondes (60).<br/>*Attention:* Définit la fenêtre de comptage et pilote les en-têtes `X-RateLimit-Reset` et `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Non (Optionnel) | L’une des valeurs prises en charge : `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Stratégie dynamique : "IP"/"clientIp", "USER" (repli IP si anonyme), "TENANT", "GLOBAL" ou SpEL "#expr".<br/>*Attention:* `"USER"` partitionne par utilisateur authentifié (repli sur IP si anonyme) ; `"GLOBAL"` partage un quota unique. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Enveloppe les opérations dans des disjoncteurs Resilience4j avec télémétrie Actuator & Micrometer.
- **Comportement à l’Exécution**: Bascule en OPEN (HTTP 503) au-delà du seuil et met à jour la jauge nwvmc.resilience.circuitbreaker.state.
- **Comment Utiliser**: Placez-le sur les contrôleurs appelant des services externes/IA pour éviter l’effondrement en cascade.
- **Quand Utiliser**: Quand il faut échouer rapidement (`HTTP 503`) plutôt que bloquer les threads sur des timeouts.
- **Quand NE PAS Utiliser et Pièges**: `CircuitBreakerErrorFilterUtil` ignore automatiquement les 4xx `BaseBusinessException` ; n’enveloppez pas les erreurs client dans `RuntimeException`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"payment-gateway-cb"`) ; laisser `""` pour la convention par défaut.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nom du coupe-circuit dans Resilience4j ; vide utilise le nom d’entité.<br/>*Attention:* Identifie l’instance Resilience4j et le tag Micrometer ; `""` utilise le nom de la classe. |
| `failureRateThreshold` | `float` | `50.0f` | Non (Optionnel) | Nombre positif (`1.0f .. 100.0f`) en pourcentage ; ex. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Pourcentage d’échecs ouvrant le coupe-circuit (défaut 50.0f).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : les erreurs métier 4xx (`BaseBusinessException`) sont ignorées ; seuls les échecs 5xx/infra ouvrent le circuit. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Non (Optionnel) | Nombre positif (`>= 1`) en secondes ; ex. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Secondes en état OPEN (renvoyant HTTP 503) avant passage HALF_OPEN (10).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : les erreurs métier 4xx (`BaseBusinessException`) sont ignorées ; seuls les échecs 5xx/infra ouvrent le circuit. |
| `slidingWindowSize` | `int` | `20` | Non (Optionnel) | Nombre positif (`>= 1`) en appels ; ex. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Nombre d’appels enregistrés dans la fenêtre glissante (20).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : les erreurs métier 4xx (`BaseBusinessException`) sont ignorées ; seuls les échecs 5xx/infra ouvrent le circuit. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Non (Optionnel) | Nombre positif (`>= 1`) en appels ; ex. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Nombre de requêtes de sonde autorisées en état HALF_OPEN (5).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : les erreurs métier 4xx (`BaseBusinessException`) sont ignorées ; seuls les échecs 5xx/infra ouvrent le circuit. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Réessaie automatiquement les pannes transitoires avec recul exponentiel configurable.
- **Comportement à l’Exécution**: Lève une exception standardisée lorsque toutes les tentatives configurées sont épuisées.
- **Comment Utiliser**: Placez `@EntityRetry` sur les contrôleurs ou méthodes pour absorber les micro-coupures réseau/BDD.
- **Quand Utiliser**: Pour les GET idempotents, PUT ou appels protégés par `@Idempotent`.
- **Quand NE PAS Utiliser et Pièges**: JAMAIS sur un POST non-idempotent ou paiement sans `@Idempotent` (risque de double facturation!).

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"erp-sync-retry"`) ; laisser `""` pour la convention par défaut.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nom de l’instance Retry dans Resilience4j.<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : vérifiez que la durée cumulée des tentatives reste inférieure au timeout de la passerelle. |
| `maxAttempts` | `int` | `3` | Non (Optionnel) | Nombre positif (`>= 1`) en tentatives ; ex. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Nombre maximal de tentatives appel initial compris (3).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : vérifiez que la durée cumulée des tentatives reste inférieure au timeout de la passerelle. |
| `waitDurationMs` | `long` | `500L` | Non (Optionnel) | Nombre positif (`>= 50`) en millisecondes ; ex. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Délai initial en ms avant la première relance (500L).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : vérifiez que la durée cumulée des tentatives reste inférieure au timeout de la passerelle. |
| `backoffMultiplier` | `double` | `2.0d` | Non (Optionnel) | Nombre positif (`>= 1.0d`) en facteur multiplicateur ; ex. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Multiplicateur exponentiel entre chaque tentative (2.0d).<br/>*Attention:* À ajuster soigneusement selon votre SLA de latence en production : vérifiez que la durée cumulée des tentatives reste inférieure au timeout de la passerelle. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Package**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Calcule des ETag faibles RFC 7232 (W/"...") et émet Cache-Control avec réponses HTTP 304 Not Modified.
- **Comportement à l’Exécution**: Enregistre les compteurs HIT/MISS dans nwvmc.cache.http.requests.
- **Comment Utiliser**: Annotez vos contrôleurs/méthodes GET en lecture pour émettre `ETag`, `Cache-Control` et `304`.
- **Quand Utiliser**: Pour catalogues stables, référentiels et listes publiques réduisant la bande passante grâce aux `304`.
- **Quand NE PAS Utiliser et Pièges**: NE laissez JAMAIS `isPrivate = false` sur des données privées, multi-tenant ou masquées par rôle !

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Non (Optionnel) | Nombre positif (`>= 0`) en secondes ; ex. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Durée `max-age` en secondes dans l’en-tête Cache-Control (60).<br/>*Attention:* Émet `Cache-Control: max-age=<N>`. Mettez `0` avec `generateETag = true` pour revalidation conditionnelle `304`. |
| `isPrivate` | `boolean` | `false` | Non (Optionnel) | `true` (cache privé navigateur seul ; exclu des CDN) ou `false` (cache public partageable par proxies/CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true émet `private` (pas de CDN) ; false émet `public`.<br/>*Attention:* CRITIQUE : Activez `isPrivate = true` sur tout endpoint authentifié ou masqué afin d’empêcher un CDN de diffuser les données d’un autre utilisateur. |
| `mustRevalidate` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Ajoute `, must-revalidate` pour revalider toute entrée expirée.<br/>*Attention:* Interdit aux caches intermédiaires de servir une réponse expirée après `maxAgeSeconds` sans revalidation. |
| `generateETag` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Calcule un ETag SHA-256 et renvoie `HTTP 304` si `If-None-Match` correspond.<br/>*Attention:* Calcule un `ETag` RFC 7232 et court-circuite les requêtes `If-None-Match` correspondantes avec `304 Not Modified`. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Met en cache les résultats de lecture côté serveur dans Caffeine L1 / Redis L2.
- **Comportement à l’Exécution**: Configurable globalement via app.framework.cache.type.
- **Comment Utiliser**: Placez-le sur les méthodes de lecture ; Caffeine ou Redis est sélectionné via `app.framework.cache.type`.
- **Quand Utiliser**: Pour les lectures fréquentes par ID ou métadonnées (ratio lecture/écriture élevé).
- **Quand NE PAS Utiliser et Pièges**: NE mettez PAS en cache des entités mutables sans clonage préalable, ni des données très volatiles.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Noms logiques des caches (Caffeine L1 ou Redis L2 selon configuration).<br/>*Attention:* Les noms doivent correspondre aux régions Caffeine/Redis ; associez `@AutoCacheEvict` à chaque écriture. |
| `key` | `String` | `""` | Non (Optionnel) | Expression SpEL référençant les paramètres (ex. `"'product:' + #id"`) ou `""` pour une clé générée automatiquement.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Expression SpEL de clé (v0.1.0 résout `EntityName:id` sans erreur de `Class`).<br/>*Attention:* En multi-tenant, incluez toujours l’identifiant locataire dans la clé pour éviter toute fuite inter-locataires. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Évince les entrées de cache obsolètes côté serveur lors des mutations.
- **Comportement à l’Exécution**: Exécuté proprement après mutation sans laisser de lectures périmées.
- **Comment Utiliser**: Placez-le sur les méthodes update/delete avec la même clé SpEL que `@AutoCacheable`.
- **Quand Utiliser**: Dès qu’une écriture ou suppression affecte des enregistrements mis en cache via `@AutoCacheable`.
- **Quand NE PAS Utiliser et Pièges**: Évitez `allEntries = true` sur les créations fréquentes pour prévenir les effets Cache Stampede.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Noms des caches à évincer après l’exécution.<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `value` invalide échoue immédiatement avant le trafic. |
| `key` | `String` | `""` | Non (Optionnel) | Expression SpEL référençant les paramètres (ex. `"'product:' + #id"`) ou `""` pour une clé générée automatiquement.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Expression SpEL ciblant uniquement l’entrée de l’entité modifiée.<br/>*Attention:* Doit produire exactement la même clé que `@AutoCacheable.key` ; ignoré lorsque `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Non (Optionnel) | `true` (vider toutes les entrées de la région) ou `false` (évincer uniquement l’entrée identifiée par key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Si true, purge uniquement les entrées préfixées par l’entité concernée.<br/>*Attention:* Vider toute la région sous forte charge risque une ruée sur la base ; privilégiez l’éviction ciblée par `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Mesure la durée d’exécution et émet des logs WARN au-delà du seuil de lenteur.
- **Comportement à l’Exécution**: Alimente également les chronomètres de latence via DynamicEntityMetricsHelper.
- **Comment Utiliser**: Annotez contrôleurs ou services avec `@TrackExecutionTime(warningThresholdMs = 300)` pour traquer les lenteurs.
- **Quand Utiliser**: Sur rapports complexes, traitements batch, GraphQL et `@CustomQuery` pour repérer les régressions SQL.
- **Quand NE PAS Utiliser et Pièges**: NE mettez PAS `warningThresholdMs <= 0` ni sur des flux SSE `/events` persistants.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Non (Optionnel) | Nombre positif (`>= 1`) en millisecondes ; ex. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Seuil en millisecondes au-delà duquel un log `WARN` de lenteur est émis (500L).<br/>*Attention:* Émet un log `WARN` avec `traceId` au-delà du seuil ; choisissez une valeur réaliste (`200L–1000L`) contre le bruit. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Package**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Objectif**: Envoie des webhooks sortants signés HMAC-SHA256 de manière asynchrone sur Virtual Threads après commit.
- **Comportement à l’Exécution**: Calcule les signatures via WebhookHmacSignerHelper avec vérification à temps constant.
- **Comment Utiliser**: Annotez l’entité JPA ; l’envoi asynchrone signé HMAC s’exécute strictement après commit BDD.
- **Quand Utiliser**: Pour notifier des partenaires externes ou ERP dès la validation transactionnelle d’une commande.
- **Quand NE PAS Utiliser et Pièges**: Passez `includeFullPayload = false` en présence de secrets PII/PCI et bloquez toute URL SSRF.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Non (Optionnel) | Tableau de zéro ou plusieurs valeurs valides : `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Événements déclenchant l’envoi de webhooks signés par HMAC.<br/>*Attention:* Expédié de façon asynchrone après commit (`AFTER_COMMIT`), évitant tout webhook fantôme en cas de rollback. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Non (Optionnel) | Nom d’en-tête HTTP valide (insensible à la casse sur le réseau, ex. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | En-tête HTTP contenant la signature HMAC-SHA256.<br/>*Attention:* Transporte la signature HMAC-SHA256 ; le récepteur doit la vérifier en temps constant avant traitement. |
| `includeFullPayload` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@EntityWebhook(includeFullPayload = false)` | true inclut le JSON complet ; false n’envoie que l’ID et les métadonnées.<br/>*Attention:* Mettez `false` (ID + type uniquement) pour les données sensibles afin que les abonnés récupèrent les champs autorisés via GET. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Package**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Publie des enveloppes CNCF CloudEvents v1.0 après validation de la transaction.
- **Comportement à l’Exécution**: Respecte TransactionRuntimeBridge.executeAfterCommit pour éviter tout événement fantôme.
- **Comment Utiliser**: Annotez l’entité ou la méthode ; écoutez `CloudEventEnvelopeDto` après commit (`AFTER_COMMIT`).
- **Quand Utiliser**: Pour découpler les Bounded Contexts (`order` -> `inventory` -> `notification`) sans couplage SQL.
- **Quand NE PAS Utiliser et Pièges**: NE confondez PAS avec `@EntityWebhook` externe et écoutez toujours en `AFTER_COMMIT`.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Non (Optionnel) | Identifiant non vide (ex. `"com.acme.order.lifecycle"`) ; laisser `""` pour la convention par défaut.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Attribut `type` CloudEvents v1.0 (ex. "io.nwvmc.order.created").<br/>*Attention:* Suivez la convention reverse-DNS CloudEvents 1.0 (`com.company.domain.event`) ; `""` génère automatiquement. |
| `source` | `String` | `""` | Non (Optionnel) | Chemin HTTP valide commençant par `/` (ex. `/services/order-api`) ou chaîne vide `""` pour dérivation automatique.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` identifiant le contexte émetteur.<br/>*Attention:* Renseigne l’attribut URI `source` CloudEvents CNCF pour la traçabilité inter-microservices. |
| `publishOnCreate` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Émet un CloudEvent après création réussie (true).<br/>*Attention:* Publié uniquement après commit (`AFTER_COMMIT`) via Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Émet un CloudEvent après mise à jour (true).<br/>*Attention:* Désactivez (`false`) sur les entités très fréquemment modifiées afin de ne pas saturer le broker. |
| `publishOnDelete` | `boolean` | `true` | Non (Optionnel) | `true` (activé) ou `false` (désactivé).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Émet un CloudEvent après suppression (true).<br/>*Attention:* Déclenché en suppression physique comme en `@SoftDelete` pour synchroniser les modèles de lecture. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Associe les opérations d’entité ou requête à une clé logique de source de données.
- **Comportement à l’Exécution**: Enregistre les comptages de routage dans framework.datasource.routing.total.
- **Comment Utiliser**: Placez-le sur des contrôleurs ou services non-finaux ; le contexte précédent est restauré automatiquement en sortie.
- **Quand Utiliser**: Pour déporter les lectures lourdes / BI vers une réplique `REPLICA` en CQRS.
- **Quand NE PAS Utiliser et Pièges**: NE changez PAS de source en plein milieu d’une `@Transactional` déjà ouverte ni sur une classe `final` !

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Non (Optionnel) | L’une des valeurs prises en charge : Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Clé de routage injectée dans `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Attention:* Doit correspondre à une clé active de `DynamicRoutingDataSource` ; une clé inconnue bascule sur `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Objectif**: Assigne la famille de moteur de base et le shard de cluster logique par entité.
- **Comportement à l’Exécution**: Résolu dynamiquement par MultiPlatformDataSourceRegistryHelper et TenantDatabaseRoutingResolverHelper.
- **Comment Utiliser**: Annotez les entités JPA ou méthodes avec la plateforme et le cluster de destination.
- **Quand Utiliser**: En architectures polyglottes ou partitionnées par cluster spécialisé (`FINANCE`, `ANALYTICS`, `AUDIT`).
- **Quand NE PAS Utiliser et Pièges**: NE remplace PAS la configuration des pools JDBC réels ; interdisez tout JOIN JPA entre clusters différents.

| Attribut | Type Java | Valeur par Défaut | Requis | Valeurs Acceptées & Exemple | Description & Mises en Garde |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Non (Optionnel) | L’une des valeurs prises en charge : `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Identifiant du moteur cible ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `platform` invalide échoue immédiatement avant le trafic. |
| `cluster` | `String` | `"PRIMARY"` | Non (Optionnel) | L’une des valeurs prises en charge : `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Cluster ou shard cible ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER").<br/>*Attention:* Validé dès le démarrage ; toute faute ou valeur `cluster` invalide échoue immédiatement avant le trafic. |
| `readOnly` | `boolean` | `false` | Non (Optionnel) | `true` (router vers le pool réplica en lecture seule) ou `false` (router vers le pool maître lecture/écriture).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Si true, signale une affinité pour les réplicas en lecture seule.<br/>*Attention:* Ne mettez jamais `readOnly = true` sur des écritures (`POST`/`PUT`/`DELETE`) : les réplicas rejettent toute mutation. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
