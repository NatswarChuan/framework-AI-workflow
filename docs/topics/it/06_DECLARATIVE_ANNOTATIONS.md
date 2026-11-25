# 06. Specifica Completa di Tutte le 60 Annotazioni Dichiarative (`0.1.0`)

> **Lingue**: **Italiano** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#annotations)

Riferimento tecnico esaustivo per tutte le **60 Annotazioni Dichiarative** di `io.github.natswarchuan:spring-nwvmc:0.1.0`, estratte fedelmente dal codice Java `@interface`: package esatto, `@Target`, **ogni attributo**, tipo Java, valore predefinito, obbligatorietà, **come usarla**, **quando usarla**, **quando NON usarla e insidie comuni**, ed esempi Java verificati.

## Indice Rapido (60 Annotazioni)

| Annotazione | Categoria | `@Target` | Riepilogo Attributi | Scopo Principale |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Trasforma un’interfaccia che estende AutoApiController<E> in un proxy dinamico JDK con 40 contratti (38 visibili in Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Reindirizza un contratto del controller verso un metodo di bean Spring personalizzato tramite MethodHandleCacheUtil. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Associa rotte di flusso di dominio (checkout, rimborso, approvazione) a bean Spring @Component Helper indipendenti. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Sostituto puro Java per @GetMapping senza import statici Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Dichiarazione HTTP POST in puro Java con supporto ai media type consumes/produces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Mapping HTTP PUT in puro Java per la sostituzione completa della risorsa. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Dichiarazione HTTP PATCH in puro Java per merge parziali, incrementi atomici e RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Dichiarazione HTTP DELETE in puro Java per la rimozione logica protetta da stato. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Associa parametri di query URL o mappe di filtri dinamici Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Associa variabili di percorso URI come gli ID UUIDv7 delle entità. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Deserializza i payload JSON HTTP in parametri DTO o Entità abbinati a @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Consente l’attraversamento ricorsivo delle relazioni figlie via GET /{id}/{relation}/** bloccando i cicli. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Dichiara transizioni di stato di dominio o variazioni numeriche su metodi di azione personalizzati. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Marcatore di componente registrato all’avvio senza importazione @Component a compilazione. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Stereotipo di livello service per classi ServiceImpl abbinate a @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Dichiara metodi factory di bean gestiti all’interno di classi @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Contrassegna classi di configurazione e modelli associati a proprietà YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Controlla l’ordine di priorità di esecuzione tra i bean SPI Customizer e le catene di filtri. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Applica RBAC NIST Livello 2, isolamento ownerField e codici permesso prima di interrogazioni o mutazioni. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Maschera o annulla dinamicamente le colonne sensibili se i ruoli non hanno il permesso. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Applica le transizioni consentite tramite POST /{id}/transition e limita DELETE /{id} a deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Compila clausole di policy leggibili in regole attive RBAC, transizioni e mascheramento. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Registra le differenze per campo tra le mutazioni abilitando Time-Travel e ispezione /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Isola automaticamente query e mutazioni per tenant attivo salvo ruoli di bypass. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Convalida l’unicità prima della persistenza su create, update e upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Genera automaticamente codici aziendali univoci con prefisso alla creazione o clonazione se vuoti. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Sintetizza automaticamente slug ASCII normalizzati compatibili con URL da sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Calcola automaticamente totali numerici derivati prima del salvataggio dell’entità. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Consente di associare query SQL/JPQL personalizzate o metodi provider agli endpoint. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Designa un’entità JPA come tabella catalogo dei ruoli RBAC dinamici su database. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa la colonna del codice ruolo univoco all’interno di @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifica il campo del nome visualizzato del ruolo in @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Contrassegna il campo collezione o stringa CSV con i codici permesso assegnati al ruolo. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Contrassegna un’entità JPA che archivia permessi risorsa-azione e regole di mascheramento campi. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Designa il campo identificativo univoco del permesso in @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa il nome dell’entità o risorsa API (o wildcard *) in @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa il verbo di azione CRUD o personalizzato protetto da @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Dichiara i campi separati da virgola da mascherare dinamicamente quando si applica questa regola. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Mappa l’entità JPA che associa utenti autenticati a ruoli su database e ambito tenant opzionale. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifica il campo soggetto / username principale su @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Associa la colonna del codice ruolo assegnato in @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Limita un’assegnazione @SecurityUserRoleEntity a un ID tenant specifico (o * globale). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Contrassegna un’entità JPA per politiche esplicite ALLOW / DENY ordinate per priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa il pattern identificativo della risorsa target in @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa il verbo dell’operazione protetta (READ, WRITE, DELETE, methodName, *) in @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mappa la collezione o lista CSV di ruoli interessati da una regola @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Specifica l’esito decisionale ALLOW o DENY in una regola @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serializza accessi concorrenti su chiavi SpEL in cache AST (predefiniti waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Previene scritture duplicate concorrenti o riprodotte entro finestre TTL configurabili. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Applica limitazione delle richieste a finestra scorrevole per partizione IP, Utente o Tenant. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Avvolge le operazioni in Circuit Breaker Resilience4j con telemetria verso Actuator e Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Ritenta automaticamente i guasti transitori con backoff esponenziale configurabile. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Calcola ETag deboli RFC 7232 (W/"...") ed emette Cache-Control insieme a risposte HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Memorizza in cache gli output dei metodi di lettura in Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Rimuove le voci obsolete dalla cache lato server al momento delle mutazioni. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Misura la durata di esecuzione ed emette log WARN al superamento della soglia. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Invia webhook in uscita firmati HMAC-SHA256 asincroni su Virtual Threads dopo il commit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Pubblica buste CNCF CloudEvents v1.0 dopo il commit della transazione. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Associa operazioni su entità o query a una chiave logica di datasource. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Assegna famiglia di motore database e shard cluster logico per entità. |

---

## 1. Routing, Contratti API Dinamici, Disaccoppiamento DTO e Parametri (13 Annotazioni)

### `@AutoRestController`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Scopo**: Trasforma un’interfaccia che estende AutoApiController<E> in un proxy dinamico JDK con 40 contratti (38 visibili in Swagger UI).
- **Comportamento a Runtime**: DynamicControllerProxyRegistrarHelper scansiona i controller all’avvio e registra le rotte in RequestMappingHandlerMapping.
- **Come Usare**: Applica `@AutoRestController(basePath = "/api/v1/...")` a un’interfaccia Java che estende `AutoApiController<E>` o `AutoReadApi<E>`.
- **Quando Usare**: Usalo per esporre CRUD standard, paginazione, filtri, keyset o API in sola lettura su entità JPA senza boilerplate.
- **Quando NON Usare e Insidie**: NON usarlo su classi concrete `@RestController` o flussi privi di entità JPA; per cataloghi in sola lettura preferire `AutoReadApi<E>`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | No (Opzionale) | Percorso HTTP valido che inizia con `/` (es. `/api/v1/product-catalogs`) oppure stringa vuota `""` per derivazione automatica.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Percorso URI radice esplicito (es. "/api/v1/product-catalogs"). Se vuoto, viene derivato al plurale in kebab-case.<br/>*Avvertenza:* All’avvio il registrar valuta `basePath` prima di `path`. Evitare valori contrastanti su entrambi. |
| `path` | `String` | `""` | No (Opzionale) | Percorso HTTP valido che inizia con `/` (es. `/api/v1/orders`) oppure stringa vuota `""` per derivazione automatica.<br/>`@AutoRestController(path = "/api/v1/orders")` | Attributo alias alternativo per il percorso. Preferire basePath poiché letto per primo dal registrar.<br/>*Avvertenza:* All’avvio il registrar valuta `basePath` prima di `path`. Evitare valori contrastanti su entrambi. |
| `entityName` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"ProductCatalog"`); lascia `""` per la convenzione predefinita.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Sovrascrive il nome entità visualizzato nei metadati OpenAPI/Studio.<br/>*Avvertenza:* Esposto direttamente in Swagger / OpenAPI 3.0 e NWVMC Studio; estrai le stringhe in `OpenApiConstant`. |
| `enabledEndpoints` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Whitelist dei nomi esatti dei metodi esposti (es. "getPage", "create"). Vuoto abilita tutti.<br/>*Avvertenza:* Agisce da whitelist rigorosa: se popolata, ogni metodo non elencato viene escluso da Spring MVC e Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Blacklist per disattivare metodi specifici prima della registrazione Spring MVC.<br/>*Avvertenza:* Valutato dopo `enabledEndpoints`; utile per bloccare endpoint distruttivi o massivi mantenendo gli altri contratti. |
| `enableNestedSubResources` | `boolean` | `false` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Abilita la navigazione ricorsiva GET /{id}/**. Predefinito false per contenere il numero di rotte.<br/>*Avvertenza:* Mantieni `false` salvo necessità di `GET /{id}/items/...`; se attivo, limita le relazioni con `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `ProductReadDto.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO di lettura opzionale per nascondere campi interni in risposta; Void.class restituisce l’entità.<br/>*Avvertenza:* Si applica solo alla pipeline lettura (GET); il DTO richiede costruttore vuoto/getter e supporta `@Valid` e `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `ProductCreateDto.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO di creazione opzionale validato con Jakarta Validation prima del mapping POST.<br/>*Avvertenza:* Si applica solo alla pipeline creazione (POST); il DTO richiede costruttore vuoto/getter e supporta `@Valid` e `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `ProductUpdateDto.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO di aggiornamento opzionale che limita i campi modificabili in PUT/PATCH.<br/>*Avvertenza:* Si applica solo alla pipeline aggiornamento (PUT/PATCH); il DTO richiede costruttore vuoto/getter e supporta `@Valid` e `@FieldSecurity`. |

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
- **Scopo**: Reindirizza un contratto del controller verso un metodo di bean Spring personalizzato tramite MethodHandleCacheUtil.
- **Comportamento a Runtime**: EscapeHatchDispatchHelper risolve il bean di destinazione e memorizza in cache MethodHandle in MethodHandleCacheUtil.
- **Come Usare**: Annota il metodo sull’interfaccia con `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` puntando a un bean `@Service`/`@Component`.
- **Quando Usare**: Usalo quando gran parte delle rotte sfrutta il CRUD automatico ma un singolo metodo richiede logica Java su misura.
- **Quando NON Usare e Insidie**: NON passare stringhe a `targetBean` (richiede `Class<?>`, usa `beanName`). Evita se le regole dichiarative bastano.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `OrderCustomService.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Classe del bean Spring destinatario (ha precedenza su beanName).<br/>*Avvertenza:* All’avvio il registrar valuta `targetBean` prima di `beanName`. Evitare valori contrastanti su entrambi. |
| `beanName` | `String` | `""` | No (Opzionale) | Nome esatto del bean registrato nell’ApplicationContext (es. `"orderCustomService"`) o `""` per risoluzione automatica.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Nome esplicito del bean nel container Spring quando targetBean è Void.class.<br/>*Avvertenza:* All’avvio il registrar valuta `targetBean` prima di `beanName`. Evitare valori contrastanti su entrambi. |
| `methodName` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"createOrder"`); lascia `""` per la convenzione predefinita.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nome del metodo sul bean destinatario; vuoto usa il nome sul controller.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"createOrder"`); discrepanze generano errori runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | No (Opzionale) | `true` (bypassa il proxy predefinito e invoca il bean target) oppure `false` (esegui insieme al dispatch predefinito).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Se true, salta il dispatch CRUD standard e invoca il bean tramite MethodHandleCacheUtil.<br/>*Avvertenza:* Con `true` (predefinito) il CRUD integrato viene saltato e il bean gestisce la transazione. Usa `false` solo per hook aggiuntivi. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Associa rotte di flusso di dominio (checkout, rimborso, approvazione) a bean Spring @Component Helper indipendenti.
- **Comportamento a Runtime**: Invoca delegateBean.delegateMethod tramite MethodHandle in cache con validazione e transazione complete.
- **Come Usare**: Dichiara il metodo sull’interfaccia indicando `path`, `httpMethod`, `delegateBean` e `delegateMethod` verso un helper Spring.
- **Quando Usare**: Usalo per azioni di dominio ricche come checkout, rimborsi, approvazioni o transazioni multi-entità.
- **Quando NON Usare e Insidie**: NON aspettarti intercettori proxy qui (`ControllerProxySpecialRouteUtil` agisce prima di `invokeProtectedOperation`); applica AOP sul bean `@Service` delegato e usa `@BusinessAction` per transizioni semplici.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/reports/monthly-sales`); `""` usa la radice.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Percorso relativo sotto il basePath del controller (es. "/checkout").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `path` non validi falliscono subito (fail-fast). |
| `httpMethod` | `String` | `"GET"` | No (Opzionale) | Uno dei valori supportati: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Verbo HTTP da associare ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `httpMethod` non validi falliscono subito (fail-fast). |
| `delegateBean` | `String` | `""` | No (Opzionale) | Nome esatto del bean registrato nell’ApplicationContext (es. `"orderReportService"`) o `""` per risoluzione automatica.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nome del bean Spring contenente il metodo delegato (obbligatorio salvo metodo default o @ServiceOverride).<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `delegateBean` non validi falliscono subito (fail-fast). |
| `delegateMethod` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"buildMonthlyReport"`); lascia `""` per la convenzione predefinita.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nome del metodo su delegateBean; vuoto usa il nome sul controller.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"buildMonthlyReport"`); discrepanze generano errori runtime. |
| `summary` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"Get monthly revenue breakdown"`); lascia `""` per la convenzione predefinita.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Breve riepilogo dell’operazione OpenAPI 3.0 per Swagger UI.<br/>*Avvertenza:* Esposto direttamente in Swagger / OpenAPI 3.0 e NWVMC Studio; estrai le stringhe in `OpenApiConstant`. |
| `description` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"Aggregates confirmed invoice totals grouped by currency"`); lascia `""` per la convenzione predefinita.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Descrizione dettagliata OpenAPI 3.0 visibile espandendo l’endpoint in Swagger UI.<br/>*Avvertenza:* Esposto direttamente in Swagger / OpenAPI 3.0 e NWVMC Studio; estrai le stringhe in `OpenApiConstant`. |

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
- **Scopo**: Sostituto puro Java per @GetMapping senza import statici Spring Web.
- **Comportamento a Runtime**: Mappato a RequestMappingInfo HTTP GET durante il bootstrap del proxy.
- **Come Usare**: Applica `@AutoGet("/percorso")` su un metodo in `@AutoRestController`, spesso abbinato a `@ServiceOverride` o `@CustomQuery`.
- **Quando Usare**: Usalo per rotte HTTP GET in sola lettura su interfacce Java pure senza importare `@GetMapping`.
- **Quando NON Usare e Insidie**: NON usarlo per operazioni che modificano lo stato DB o su `@RestController` standard.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/{id}/summary`); `""` usa la radice.<br/>`@AutoGet("/{id}/summary")` | Template di percorso GET relativo (es. "/metrics"). Vuoto punta al basePath radice.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `produces` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json", "text/csv"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Tipi MIME prodotti in risposta (es. "text/event-stream", "text/csv").<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Accept`; header incompatibili restituiscono `406` o `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Dichiarazione HTTP POST in puro Java con supporto ai media type consumes/produces.
- **Comportamento a Runtime**: Registrato come handler HTTP POST in SpringMvcEndpointBridge.
- **Come Usare**: Annota il metodo con `@AutoPost("/percorso")` legando il payload tramite `@AutoBody`/`@RequestBody` e `@BusinessAction`/`@ServiceOverride`.
- **Quando Usare**: Usalo per creazione risorse, comandi applicativi o invii batch via POST.
- **Quando NON Usare e Insidie**: NON usarlo per letture (`@AutoGet`), sostituzioni complete (`@AutoPut`) o cancellazioni (`@AutoDelete`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/{id}/approve`); `""` usa la radice.<br/>`@AutoPost("/{id}/approve")` | Template percorso POST relativo al basePath.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `consumes` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json", "multipart/form-data"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Tipi Content-Type accettati nella richiesta.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Content-Type`; header incompatibili restituiscono `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Tipi MIME prodotti nella risposta.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Accept`; header incompatibili restituiscono `406` o `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Mapping HTTP PUT in puro Java per la sostituzione completa della risorsa.
- **Comportamento a Runtime**: Collegato come handler HTTP PUT in esecuzione transazionale.
- **Come Usare**: Applica `@AutoPut("/{id}")` ai metodi di sostituzione completa insieme a `@AutoVariable` e `@AutoBody`.
- **Quando Usare**: Usalo per sostituzione completa idempotente con payload dell’intera risorsa.
- **Quando NON Usare e Insidie**: NON usarlo per aggiornamenti parziali (`@AutoPatch` o `@BusinessAction`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/{id}/replace`); `""` usa la radice.<br/>`@AutoPut("/{id}/replace")` | Template percorso PUT relativo (es. "/{id}").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `consumes` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Tipi Content-Type supportati in ingresso.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Content-Type`; header incompatibili restituiscono `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Tipi MIME prodotti in risposta.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Accept`; header incompatibili restituiscono `406` o `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Dichiarazione HTTP PATCH in puro Java per merge parziali, incrementi atomici e RFC 6902 JSON Patch.
- **Comportamento a Runtime**: Supporta la semantica JSON merge e application/json-patch+json.
- **Come Usare**: Applica `@AutoPatch("/{id}/azione")` sui metodi di modifica parziale o `@BusinessAction`.
- **Quando Usare**: Usalo per modifiche parziali, incrementi atomici e transizioni di stato (`@BusinessAction`).
- **Quando NON Usare e Insidie**: NON usarlo quando serve sostituzione integrale (`@AutoPut`) o creazione (`@AutoPost`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/{id}/status`); `""` usa la radice.<br/>`@AutoPatch("/{id}/status")` | Template percorso PATCH relativo (es. "/{id}/approve").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `consumes` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json", "application/merge-patch+json"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Tipi Content-Type accettati.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Content-Type`; header incompatibili restituiscono `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opzionale) | Array di tipi MIME (es. `{"application/json"}`); `{}` vuoto usa `application/json` come predefinito.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Tipi MIME prodotti.<br/>*Avvertenza:* Applicato dalla content negotiation Spring MVC su `Accept`; header incompatibili restituiscono `406` o `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Dichiarazione HTTP DELETE in puro Java per la rimozione logica protetta da stato.
- **Comportamento a Runtime**: Convalida @StateMachine deletableStates prima di impostare deleted=true.
- **Come Usare**: Applica `@AutoDelete("/{id}/custom")` ai metodi di cancellazione personalizzati con `@ServiceOverride`.
- **Quando Usare**: Usalo per archiviazione, soft-delete personalizzato o pulizia a cascata tramite DELETE.
- **Quando NON Usare e Insidie**: NON ridefinire la cancellazione se il soft-delete standard e `@StateMachine` sono sufficienti.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Sottopercorso URI relativo con segnaposto `{pathVar}` opzionali (es. `/{id}/archive`); `""` usa la radice.<br/>`@AutoDelete("/{id}/archive")` | Template percorso DELETE relativo (es. "/{id}/purge").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Scopo**: Associa parametri di query URL o mappe di filtri dinamici Map<String, String>.
- **Comportamento a Runtime**: Estratto tramite DynamicQueryParameterParserHelper con validazione di QueryGuardrailEnforcerUtil.
- **Come Usare**: Posizionalo sui parametri del metodo nell’interfaccia controller.
- **Quando Usare**: Usalo per mantenere interfacce 100% Pure Java senza import Spring Web leggendo i parametri query.
- **Quando NON Usare e Insidie**: NON usarlo per variabili di percorso (`@AutoVariable`) o body JSON (`@AutoBody`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"status"`); lascia `""` per la convenzione predefinita.<br/>`@AutoParam("status") String status` | Nome del parametro query (alias di name); vuoto usa il nome Java.<br/>*Avvertenza:* All’avvio il registrar valuta `value` prima di `name`. Evitare valori contrastanti su entrambi. |
| `name` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"pageSize"`); lascia `""` per la convenzione predefinita.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Nome esplicito del parametro di query.<br/>*Avvertenza:* All’avvio il registrar valuta `value` prima di `name`. Evitare valori contrastanti su entrambi. |
| `required` | `boolean` | `true` | No (Opzionale) | `true` (obbligatorio; assente restituisce HTTP 400) oppure `false` (opzionale; passa null se omesso).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Indica se l’assenza del parametro genera HTTP 400.<br/>*Avvertenza:* Diventa automaticamente opzionale se `defaultValue` è impostato; con `false`, usa tipi wrapper (`Integer`) invece dei primitivi. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | No (Opzionale) | Stringa identificativa non vuota (es. `"20"`); lascia `""` per la convenzione predefinita.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Valore predefinito se assente; predefinito sentinella DEFAULT_NONE.<br/>*Avvertenza:* Convertito da String tramite Spring `ConversionService` al tipo di destinazione; valori errati generano HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Scopo**: Associa variabili di percorso URI come gli ID UUIDv7 delle entità.
- **Comportamento a Runtime**: Convertito in valori Java tipizzati UUID/String dai template di percorso MVC.
- **Come Usare**: Annota i parametri di percorso come `findById(@AutoVariable("id") UUID id)`.
- **Quando Usare**: Per estrarre `{id}` o `{code}` da template URI in interfacce Pure Java.
- **Quando NON Usare e Insidie**: NON usarlo per parametri query (`@AutoParam`) o body JSON (`@AutoBody`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"orderId"`); lascia `""` per la convenzione predefinita.<br/>`@AutoVariable("orderId") UUID orderId` | Nome della variabile di percorso URI.<br/>*Avvertenza:* All’avvio il registrar valuta `value` prima di `name`. Evitare valori contrastanti su entrambi. |
| `name` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"tenantCode"`); lascia `""` per la convenzione predefinita.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Nome esplicito della variabile di percorso.<br/>*Avvertenza:* All’avvio il registrar valuta `value` prima di `name`. Evitare valori contrastanti su entrambi. |
| `required` | `boolean` | `true` | No (Opzionale) | `true` (obbligatorio; assente restituisce HTTP 400) oppure `false` (opzionale; passa null se omesso).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Indica se la variabile di percorso è obbligatoria.<br/>*Avvertenza:* Deve coincidere con `{variableName}` nel template URI; `false` si applica solo con pattern URI opzionali. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Scopo**: Deserializza i payload JSON HTTP in parametri DTO o Entità abbinati a @Valid.
- **Comportamento a Runtime**: Validato con LocalValidatorFactoryBean prima di entrare nella transazione di servizio.
- **Come Usare**: Posiziona `@AutoBody` sul parametro payload dei metodi `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Quando Usare**: Per deserializzare payload JSON in entità o DTO nei controller Pure Java.
- **Quando NON Usare e Insidie**: NON applicarlo a metodi GET/DELETE privi di body né duplicarlo nello stesso metodo.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | No (Opzionale) | `true` (obbligatorio; assente restituisce HTTP 400) oppure `false` (opzionale; passa null se omesso).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Indica se un body mancante attiva HTTP 400.<br/>*Avvertenza:* Abbina `@Valid` per attivare la validazione Jakarta; `false` consente body vuoti senza restituire `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Consente l’attraversamento ricorsivo delle relazioni figlie via GET /{id}/{relation}/** bloccando i cicli.
- **Comportamento a Runtime**: Richiede @AutoRestController(enableNestedSubResources = true) sul controller.
- **Come Usare**: Abilita `enableNestedSubResources = true` su `@AutoRestController` e filtra le relazioni con `@EnableNestedSubResource`.
- **Quando Usare**: Per URL annidate come `GET /api/v1/customer-orders/{id}/items` mantenendo controlli di sicurezza a ogni salto.
- **Quando NON Usare e Insidie**: NON abilitarlo senza `allowedRelationships` su entità con molte relazioni.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Whitelist opzionale delle classi entità raggiungibili tramite GET /{id}/**.<br/>*Avvertenza:* Un array vuoto espone tutte le entità figlie; elenca esplicitamente le classi per proteggere tabelle interne. |
| `allowedRelationships` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Nomi espliciti delle relazioni JPA ammesse nei percorsi sub-risorsa.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"items"`); discrepanze generano errori runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Dichiara transizioni di stato di dominio o variazioni numeriche su metodi di azione personalizzati.
- **Comportamento a Runtime**: Eseguito atomicamente prima di rendere persistenti gli attributi aggiornati.
- **Come Usare**: Combina `@AutoPatch` e `@BusinessAction(...)` sul metodo dell’interfaccia controller.
- **Quando Usare**: Per transizioni di stato, incrementi numerici e invocazione di metodi di dominio senza scrivere classi Service.
- **Quando NON Usare e Insidie**: NON usarlo per orchestrazioni multi-entità o chiamate API esterne (usa `@ServiceOverride`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo stato del ciclo di vita (es. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nome del campo stato sull’entità (validato tramite @StateMachine).<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"status"`); discrepanze generano errori runtime. |
| `targetStateValue` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"APPROVED"`); lascia `""` per la convenzione predefinita.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Valore di stato target assegnato all’interno della transazione.<br/>*Avvertenza:* Validato automaticamente rispetto a `@StateMachine` o `@HumanPolicy` prima del salvataggio; transizioni illegali annullano la transazione. |
| `adjustNumericField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo numerico (es. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Proprietà numerica incrementata o decrementata atomicamente.<br/>*Avvertenza:* Richiede `deltaParamIndex >= 0` o `fixedDelta` valorizzato. Supporta `Integer`, `Long`, `BigDecimal` e `Double`. |
| `deltaParamIndex` | `int` | `-1` | No (Opzionale) | Uno dei valori supportati: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Indice a base zero del parametro contenente il delta dinamico (-1 disabilita).<br/>*Avvertenza:* All’avvio il registrar valuta `deltaParamIndex` prima di `fixedDelta`. Evitare valori contrastanti su entrambi. |
| `fixedDelta` | `String` | `""` | No (Opzionale) | Uno dei valori supportati: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Stringa numerica fissa (es. "100", "-1") usata se deltaParamIndex è assente.<br/>*Avvertenza:* All’avvio il registrar valuta `deltaParamIndex` prima di `fixedDelta`. Evitare valori contrastanti su entrambi. |
| `entityMethod` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"markFulfilled"`); lascia `""` per la convenzione predefinita.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Nome di un metodo senza parametri sull’entità eseguito nella stessa transazione.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"markFulfilled"`); discrepanze generano errori runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Rilevamento Bean, Binding di Configurazione e Ordine di Esecuzione (5 Annotazioni)

### `@AutoComponent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Marcatore di componente registrato all’avvio senza importazione @Component a compilazione.
- **Comportamento a Runtime**: Scansione interna al framework (io.github.natswarchuan); le app consumer devono usare Spring @Component.
- **Come Usare**: Stereotipo interno scansionato da `AutoBeanFactoryRegistrarBridge` nel package `io.github.natswarchuan`.
- **Quando Usare**: Usalo SOLO per componenti interni del framework nel package `io.github.natswarchuan.*`.
- **Quando NON Usare e Insidie**: MAI usarlo nelle app applicative (`com.example.*`)! Usa Spring `@Component`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Nome esatto del bean registrato nell’ApplicationContext (es. `"invoiceValidationHelper"`) o `""` per risoluzione automatica.<br/>`@AutoComponent("invoiceValidationHelper")` | Nome esplicito del bean; vuoto usa camelCase della classe.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Stereotipo di livello service per classi ServiceImpl abbinate a @ServiceOverride.
- **Comportamento a Runtime**: Scansionato in io.github.natswarchuan per nome classe; i service applicativi devono usare Spring @Service.
- **Come Usare**: Stereotipo di servizio interno scansionato in `io.github.natswarchuan`.
- **Quando Usare**: SOLO per servizi interni in `io.github.natswarchuan.*`.
- **Quando NON Usare e Insidie**: MAI nei servizi applicativi; usa Spring `@Service`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Nome esatto del bean registrato nell’ApplicationContext (es. `"orderFulfillmentService"`) o `""` per risoluzione automatica.<br/>`@AutoService("orderFulfillmentService")` | Nome opzionale del bean di servizio.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Dichiara metodi factory di bean gestiti all’interno di classi @AutoConfigurationBean.
- **Comportamento a Runtime**: Elaborato da PureJavaBeanRegistrarBridge durante l’auto-configurazione.
- **Come Usare**: Posiziona sui metodi factory dentro classi `@AutoConfigurationBean` del framework.
- **Quando Usare**: SOLO in `io.github.natswarchuan.config.*` all’interno del framework.
- **Quando NON Usare e Insidie**: NON usarlo nelle tue `@Configuration` applicative; usa `@Bean`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Nomi espliciti e alias del bean.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `targetTypeName` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"com.example.spi.PaymentGateway"`); lascia `""` per la convenzione predefinita.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | FQCN opzionale del tipo destinatario.<br/>*Avvertenza:* FQCN opzionale quando la factory restituisce un supertipo o proxy dinamico; la classe deve essere nel classpath. |
| `primary` | `boolean` | `false` | No (Opzionale) | `true` (bean prioritario tra più candidati) oppure `false` (priorità standard).<br/>`@AutoBean(primary = true)` | Contrassegna il bean come primario in caso di più candidati.<br/>*Avvertenza:* Dichiarare due `@AutoBean(primary = true)` per lo stesso tipo causa conflitto di ambiguità all’avvio. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Contrassegna classi di configurazione e modelli associati a proprietà YAML.
- **Comportamento a Runtime**: Registra bean di configurazione e prefissi YAML in modo pulito con metadati IDE.
- **Come Usare**: Contrassegna classi config/properties interne in `io.github.natswarchuan.config.*`.
- **Quando Usare**: SOLO dentro il framework come equivalente Pure Java di `@Configuration`.
- **Quando NON Usare e Insidie**: NON usarlo nelle config applicative; usa `@Configuration` di Spring.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Nome esatto del bean registrato nell’ApplicationContext (es. `"storageAutoConfig"`) o `""` per risoluzione automatica.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Identificativo opzionale del bean di configurazione.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `prefix` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"nwvmc.storage"`); lascia `""` per la convenzione predefinita.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Prefisso YAML opzionale collegato tramite `PureJavaBeanRegistrarBridge`.<br/>*Avvertenza:* Collega le proprietà kebab-case da `application.yml`; abbina `spring-configuration-metadata.json` per evitare avvisi IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Scopo**: Controlla l’ordine di priorità di esecuzione tra i bean SPI Customizer e le catene di filtri.
- **Comportamento a Runtime**: Valori interi minori vengono eseguiti prima (predefinito Integer.MAX_VALUE).
- **Come Usare**: Applica `@OrderPriority(1)` su interceptor, customizer o bean ordinabili.
- **Quando Usare**: Quando serve un ordine deterministico tra più SPI customizer.
- **Quando NON Usare e Insidie**: NON confonderlo con l’ordine dei filtri Security o la query `?sort=`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | No (Opzionale) | Uno dei valori supportati: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Valore di precedenza; numeri più bassi vengono eseguiti prima.<br/>*Avvertenza:* Numeri più bassi vengono eseguiti PER PRIMI (come Spring `@Order`). Riserva `< 0` a sicurezza/tracing e `10..100` al dominio. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Sicurezza Entità, Macchina a Stati, Integrità, Generatori Automatici e Query (11 Annotazioni)

### `@EntitySecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Applica RBAC NIST Livello 2, isolamento ownerField e codici permesso prima di interrogazioni o mutazioni.
- **Comportamento a Runtime**: Valutato prima dell’esecuzione SQL; l’accesso non autorizzato genera HTTP 403 Forbidden.
- **Come Usare**: Applica su qualsiasi `@Entity` configurando i ruoli e opzionalmente `ownerField`.
- **Quando Usare**: Usalo su OGNI entità esposta per proteggere uniformemente REST, batch, export e GraphQL.
- **Quando NON Usare e Insidie**: NON impostare `permitAll = true` su `AutoApiController<E>` completo senza `AutoReadApi<E>`, `disabledEndpoints` o `@SecurityPolicyEntity` (bypassa controlli su READ, WRITE e DELETE).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_USER", "ROLE_ADMIN"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Ruoli autorizzati alla lettura (GET, GraphQL, export).<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |
| `writeRoles` | `String[]` | `{}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Ruoli autorizzati in scrittura (POST/PUT/PATCH/import).<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |
| `deleteRoles` | `String[]` | `{}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Ruoli autorizzati alla cancellazione (DELETE / batch-delete).<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |
| `permitAll` | `boolean` | `false` | No (Opzionale) | `true` (consenti accesso pubblico senza login) oppure `false` (imponi autenticazione e controllo ruoli).<br/>`@EntitySecurity(permitAll = true)` | Se true (senza policy DB-RBAC), bypassa i controlli su READ, WRITE e DELETE; abbina sempre AutoReadApi<E> o disabledEndpoints.<br/>*Avvertenza:* Ignora i controlli sui ruoli consentendo accesso anonimo. Non abilitare mai su PII o entità finanziarie. |
| `ownerField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo proprietario/UUID (es. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Campo proprietario del record ("createdBy"); applica blocco anti-IDOR.<br/>*Avvertenza:* Applica il filtro proprietario a livello di riga su `GET`/`PUT`/`PATCH`/`DELETE`, salvo ruoli in `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Ruoli privilegiati esentati dal controllo `ownerField`.<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |
| `permissions` | `String[]` | `{}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ORDER_READ", "ORDER_APPROVE"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Codici permesso granulari valutati insieme ai ruoli.<br/>*Avvertenza:* Valutato rispetto ai permessi granulari nei claim JWT o in `@SecurityPermissionEntity` (DB-RBAC). |

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
- **Scopo**: Maschera o annulla dinamicamente le colonne sensibili se i ruoli non hanno il permesso.
- **Comportamento a Runtime**: Applicato dopo la lettura prima della serializzazione JSON.
- **Come Usare**: Applica su campi sensibili (`costPrice`, `ssn`); il mascheramento avviene su copie clonate.
- **Quando Usare**: Quando la stessa entità espone campi sensibili differenziati per ruolo in REST e GraphQL.
- **Quando NON Usare e Insidie**: I campi non-`String` diventano già `null`; imposta `nullifyInsteadOfMask = true` per restituire `null` sui campi `String`, oppure usa `readDto` per omettere la chiave.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Ruoli autorizzati a leggere il valore originale in chiaro.<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |
| `maskPattern` | `String` | `"******"` | No (Opzionale) | Stringa identificativa non vuota (es. `"***-**-****"`); lascia `""` per la convenzione predefinita.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Stringa sostitutiva mostrata ai chiamanti privi di ruolo.<br/>*Avvertenza:* Ignorato se `nullifyInsteadOfMask = true`. Per campi non-String (`BigDecimal`, `LocalDate`), preferisci `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | No (Opzionale) | `true` (sostituisci campo non autorizzato con null) oppure `false` (applica la stringa maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Se true, forza null sui campi String al posto di maskPattern (i tipi non-String diventano già null automaticamente).<br/>*Avvertenza:* Essenziale per campi numerici, date e oggetti affinché i client TypeScript/Zod ricevano un `null` valido. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Scopo**: Applica le transizioni consentite tramite POST /{id}/transition e limita DELETE /{id} a deletableStates.
- **Comportamento a Runtime**: Rifiuta transizioni o eliminazioni non valide con HTTP 422 BusinessRuleViolationException.
- **Come Usare**: Applica sul campo stato String usando `:` (`"CREATED:PAID,CANCELLED"`).
- **Quando Usare**: Per cicli di vita rigidi (ordini, prestiti, fatture) bloccando salti illegali (`HTTP 422`).
- **Quando NON Usare e Insidie**: MAI usare la sintassi `"->"` (`EntityStateMachineUtil` legge solo `":"`)!

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | No (Opzionale) | Stringa identificativa non vuota (es. `"CREATED"`); lascia `""` per la convenzione predefinita.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Stato iniziale predefinito alla creazione se vuoto ("ACTIVE").<br/>*Avvertenza:* Impostato automaticamente in `POST` se vuoto; deve coincidere con lo stato prima di `:` in `transitions`. |
| `transitions` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Regole di transizione consentite nel formato "FROM:TO_1,TO_2".<br/>*Avvertenza:* Richiede la sintassi esatta con i due punti `"FROM:TO1,TO2"` (destinazioni separate da virgola). Ogni transizione non dichiarata restituisce HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Stati in cui DELETE è consentita (altri rispondono HTTP 422).<br/>*Avvertenza:* Se valorizzato, `DELETE /{id}` fallisce con HTTP `409 Conflict` se l’entità è in un altro stato (es. `"PAID"`). |

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
- **Scopo**: Compila clausole di policy leggibili in regole attive RBAC, transizioni e mascheramento.
- **Comportamento a Runtime**: Ispezionabile su GET /human-policy e sovrascrivibile in YAML sotto spring-nwvmc.human-policies.<Entity>.
- **Come Usare**: Applica sull’entità o tramite YAML `spring-nwvmc.human-policies`; compilato da `HumanPolicyRegistryHelper`.
- **Quando Usare**: Quando team di compliance desiderano regole leggibili esternamente o in YAML.
- **Quando NON Usare e Insidie**: NON scrivere prosa libera o lingue diverse dai template inglesi supportati.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | No (Opzionale) | Uno dei valori supportati: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Direttiva in inglese naturale compilata in transizioni di stato.<br/>*Avvertenza:* Compilato all’avvio nello stesso motore di `@StateMachine`; evita regole conflittuali sulla stessa entità. |
| `security` | `String` | `""` | No (Opzionale) | Uno dei valori supportati: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Direttiva RBAC in inglese naturale per lettura/scrittura/cancellazione.<br/>*Avvertenza:* I ruoli vengono normalizzati con prefisso `ROLE_` e verificati in avvio con fail-fast. |
| `masking` | `String` | `""` | No (Opzionale) | Uno dei valori supportati: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Politica in inglese naturale per il mascheramento dei campi.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"costPrice"`); discrepanze generano errori runtime. |
| `stateField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo stato del ciclo di vita (es. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Campo stato dell’entità gestito da `lifecycle`.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"orderStatus"`); discrepanze generano errori runtime. |

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
- **Scopo**: Registra le differenze per campo tra le mutazioni abilitando Time-Travel e ispezione /diff.
- **Comportamento a Runtime**: Acquisisce delta oldValue e newValue su create, update, patch, transition e restore.
- **Come Usare**: Applica sull’entità `BaseAuditEntity`; le mutazioni salvano automaticamente le revisioni.
- **Quando Usare**: Su entità critiche (pagamenti, ordini, cartelle cliniche) per storico `/{id}/revisions`.
- **Quando NON Usare e Insidie**: Evitalo su tabelle di log o telemetria ad altissima frequenza di scrittura.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"FINANCE_LEDGER"`); lascia `""` per la convenzione predefinita.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Categoria logica registrata su ogni evento di audit.<br/>*Avvertenza:* Etichetta i log di audit per il filtraggio; `""` usa il nome semplice dell’entità JPA. |
| `recordFieldDiffs` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Se true, salva i diff campo per campo a supporto di Time-Travel.<br/>*Avvertenza:* Registra il diff prima/dopo ad ogni `PUT`/`PATCH`; imposta `false` su blob grandi o scritture ad alta frequenza. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Isola automaticamente query e mutazioni per tenant attivo salvo ruoli di bypass.
- **Comportamento a Runtime**: Fail-closed HTTP 403 se manca il contesto tenant senza ruolo bypass; sovrascrive tenantId in creazione (anti-spoofing) e blocca IDOR su tutte le operazioni per ID.
- **Come Usare**: Applica sull’entità SaaS; isolamento letture, anti-spoofing e `403` fail-closed sono automatici.
- **Quando Usare**: Su tutte le tabelle SaaS multi-tenant condivise per prevenire accessi incrociati.
- **Quando NON Usare e Insidie**: NON usarlo su tabelle di riferimento globali (paesi, valute).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo identificativo tenant (es. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Nome del campo entità contenente il tenant ID (predefinito "tenantId").<br/>*Avvertenza:* Crea un indice composto `(tenant_id, id)` su DB per query veloci e isolamento rigoroso tra tenant. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | No (Opzionale) | Array di ruoli Spring Security (es. `{"ROLE_SUPER_ADMIN"}`); `{}` vuoto non impone restrizioni specifiche.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Ruoli di piattaforma autorizzati all’accesso trasversale ai tenant.<br/>*Avvertenza:* Definisci i ruoli in `RoleConstant` con prefisso `ROLE_` (es. `ROLE_ADMIN`) allineato a `GrantedAuthority`. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Scopo**: Convalida l’unicità prima della persistenza su create, update e upsert.
- **Comportamento a Runtime**: Solleva ConflictBusinessException (HTTP 409) quando esiste un duplicato.
- **Come Usare**: Applica su campi chiave univoci (`email`, `skuCode`) insieme a `@Column(unique = true)`.
- **Quando Usare**: Per validare l’unicità sui soli record attivi restituendo errori `HTTP 409 Conflict` chiari.
- **Quando NON Usare e Insidie**: NON omettere l’indice `UNIQUE` su DB in alta concorrenza; non usarlo su campi duplicabili.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Scopo**: Genera automaticamente codici aziendali univoci con prefisso alla creazione o clonazione se vuoti.
- **Comportamento a Runtime**: Popola prefisso + token univoco prima della validazione e del salvataggio.
- **Come Usare**: Applica su un campo codice String (`prefix = "PRD-"`); generato se vuoto in creazione o clone.
- **Quando Usare**: Per codici leggibili (ordini, SKU, negozi) basati su UUIDv7 senza contese su sequenze DB.
- **Quando NON Usare e Insidie**: NON usarlo quando norme fiscali impongono numerazioni sequenziali prive di buchi (`1, 2, 3...`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Sì (Obbligatorio)** | Stringa identificativa non vuota (es. `"ORD"`); lascia `""` per la convenzione predefinita.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Prefisso obbligatorio anteposto a un hash UUIDv7 di 8 caratteri (es. "PRD-").<br/>*Avvertenza:* Attributo obbligatorio; genera codici come `INV-2026-0001` solo se il campo è vuoto alla creazione. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Scopo**: Sintetizza automaticamente slug ASCII normalizzati compatibili con URL da sourceField.
- **Comportamento a Runtime**: Normalizza i segni diacritici Unicode e abilita la ricerca filtrata per slug.
- **Come Usare**: Applica `@AutoSlug(sourceField = "name")` sul campo `slug`.
- **Quando Usare**: Per URL SEO-friendly in negozi, blog, categorie e cataloghi.
- **Quando NON Usare e Insidie**: NON puntare `sourceField` a proprietà inesistenti.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Sì (Obbligatorio)** | Nome esatto della proprietà Java sull’entità per un campo String (es. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Proprietà sorgente obbligatoria convertita in slug ASCII minuscolo.<br/>*Avvertenza:* Obbligatorio; normalizza accenti e Unicode in kebab-case sicuro per URL. Abbina `@UniqueField` per unicità. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Scopo**: Calcola automaticamente totali numerici derivati prima del salvataggio dell’entità.
- **Comportamento a Runtime**: Convalidato all’avvio da ComputedFieldFailFastUtil per fallimento rapido su configurazioni errate.
- **Come Usare**: Applica su un campo derivato (`BigDecimal`); ricalcolato lato server prima del salvataggio.
- **Quando Usare**: Per totali riga e importi ordine autoritativi lato server impedendo manomissioni dal client.
- **Quando NON Usare e Insidie**: NON usarlo per sconti a scaglioni complessi o chiamate FX esterne (`@ServiceOverride`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | No (Opzionale) | Uno dei valori supportati: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Strategia di calcolo: "MULTIPLY" o "SUM_COLLECTION".<br/>*Avvertenza:* Ricalcolato automaticamente prima del salvataggio su `POST`/`PUT`/`PATCH`, sovrascrivendo totali alterati dal client. |
| `sourceFields` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Campi della stessa entità moltiplicati tra loro in "MULTIPLY".<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"unitPrice"`); discrepanze generano errori runtime. |
| `collectionField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo collezione @OneToMany (es. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Campo collezione @OneToMany sommato in modalità "SUM_COLLECTION".<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"items"`); discrepanze generano errori runtime. |
| `itemField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo numerico (es. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Proprietà numerica di ogni elemento figlio da sommare.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"subTotal"`); discrepanze generano errori runtime. |
| `subtractField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo numerico (es. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Campo opzionale sottratto dalla somma (es. "discountAmount").<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"discountAmount"`); discrepanze generano errori runtime. |
| `addField` | `String` | `""` | No (Opzionale) | Nome esatto della proprietà Java sull’entità per un campo numerico (es. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Campo opzionale aggiunto al totale (es. "shippingFee").<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"shippingFee"`); discrepanze generano errori runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Consente di associare query SQL/JPQL personalizzate o metodi provider agli endpoint.
- **Comportamento a Runtime**: Eseguito con parametri nominali associati tramite JPA EntityManager.
- **Come Usare**: Abbinalo a `@AutoGet`/`@AutoPost` legando i parametri `:param` con `@AutoParam`.
- **Quando Usare**: Per report SQL nativi, CTE o window function senza scrivere repository dedicati.
- **Quando NON Usare e Insidie**: MAI concatenare input utente nell’SQL (usa sempre `:param`) né fare JOIN tra domini separati.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opzionale) | Uno dei valori supportati: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Query SQL o JPQL inline con segnaposti `:param`.<br/>*Avvertenza:* Usa sempre parametri `:param` o `?1` contro SQL injection; lascia `""` quando usi `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | No (Opzionale) | `true` (esegui SQL nativo del database) oppure `false` (esegui JPQL portatile JPA).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true esegue SQL nativo; false esegue JPQL.<br/>*Avvertenza:* SQL nativo (`true`) abilita CTE e window function; scegli `false` (JPQL) per portabilità tra H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `MonthlyRevenueDto.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Classe opzionale di mapping del risultato.<br/>*Avvertenza:* Specifica sempre una classe DTO di proiezione per query aggregate evitando `SELECT *` e righe non tipizzate. |
| `sqlProvider` | `Class<?>` | `Void.class` | No (Opzionale) | Qualsiasi classe DTO Java concreta (es. `OrderAnalyticsSqlProvider.class`) oppure `Void.class` per disabilitare la mappatura.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Classe provider SQL opzionale validata al bootstrap.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `sqlProvider` non validi falliscono subito (fail-fast). |
| `providerMethod` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"buildRevenueSql"`); lascia `""` per la convenzione predefinita.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nome del metodo in `sqlProvider` che restituisce la stringa SQL.<br/>*Avvertenza:* Deve corrispondere esattamente all’identificatore Java (case-sensitive, es. `"buildRevenueSql"`); discrepanze generano errori runtime. |
| `modifying` | `boolean` | `false` | No (Opzionale) | `true` (DML UPDATE/DELETE in transazione di scrittura) oppure `false` (query SELECT di sola lettura).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Obbligatorio `true` per query INSERT/UPDATE/DELETE.<br/>*Avvertenza:* Obbligatorio (`true`) per `UPDATE`/`DELETE`; avvia automaticamente una transazione di scrittura. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC Dinamico su Database e Meta-Annotazioni di Mascheramento (18 Annotazioni)

### `@SecurityRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Scopo**: Designa un’entità JPA come tabella catalogo dei ruoli RBAC dinamici su database.
- **Comportamento a Runtime**: DynamicDatabaseRbacProviderHelper memorizza le associazioni ruolo-permesso in Caffeine invalidandole alla scrittura.
- **Come Usare**: Applica `@SecurityRoleEntity` sulla tua entità Role marcando il codice con `@RoleCode`.
- **Quando Usare**: Quando gli amministratori gestiscono ruoli dinamicamente su database.
- **Quando NON Usare e Insidie**: NON omettere `@RoleCode` (errore al boot) e non definire più `@SecurityRoleEntity`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Opzionale) | Numero positivo (`>= 1`) in secondi; es. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL in secondi della cache Caffeine prima del ricaricamento.<br/>*Avvertenza:* TTL brevi riflettono prima le modifiche aumentando le query; TTL lunghi riducono il carico ma ritardano le revoche. |

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
- **Scopo**: Mappa la colonna del codice ruolo univoco all’interno di @SecurityRoleEntity.
- **Comportamento a Runtime**: Letto tramite LambdaAccessorUtil per abbinare i token GrantedAuthority.
- **Come Usare**: Applica `@RoleCode` sul campo o getter corrispondente nell’entità `@SecurityRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Identifica il campo del nome visualizzato del ruolo in @SecurityRoleEntity.
- **Comportamento a Runtime**: Esposto nei metadati diagnostici RBAC e negli endpoint di ispezione Dev Studio.
- **Come Usare**: Applica `@RoleName` sul campo o getter corrispondente nell’entità `@SecurityRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Contrassegna il campo collezione o stringa CSV con i codici permesso assegnati al ruolo.
- **Comportamento a Runtime**: Analizzato dinamicamente ed espanso nelle autorizzazioni effettive di SecurityIdentityCustomizer.
- **Come Usare**: Applica `@RolePermissions` sul campo o getter corrispondente nell’entità `@SecurityRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Scopo**: Contrassegna un’entità JPA che archivia permessi risorsa-azione e regole di mascheramento campi.
- **Comportamento a Runtime**: Caricato in DatabaseRbacRuleMatcherHelper per controllo CRUD e mascheramento campi.
- **Come Usare**: Applica `@SecurityPermissionEntity` sull’entità Permission con `@PermissionCode` obbligatorio.
- **Quando Usare**: Per gestire dinamicamente su DB permessi granulari risorsa/azione e mascheramento campi.
- **Quando NON Usare e Insidie**: NON dimenticare `@PermissionCode` e non duplicare l’annotazione.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Opzionale) | Numero positivo (`>= 1`) in secondi; es. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL in secondi della cache Caffeine per i permessi.<br/>*Avvertenza:* TTL brevi riflettono prima le modifiche aumentando le query; TTL lunghi riducono il carico ma ritardano le revoche. |

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
- **Scopo**: Designa il campo identificativo univoco del permesso in @SecurityPermissionEntity.
- **Comportamento a Runtime**: Confrontato con le autorizzazioni dell’utente e i codici @EntitySecurity.permissions().
- **Come Usare**: Applica `@PermissionCode` sul campo o getter corrispondente nell’entità `@SecurityPermissionEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPermissionEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPermissionEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Mappa il nome dell’entità o risorsa API (o wildcard *) in @SecurityPermissionEntity.
- **Comportamento a Runtime**: Valutato senza distinzione di maiuscole da DatabaseRbacRuleMatcherHelper con fallback wildcard.
- **Come Usare**: Applica `@PermissionResource` sul campo o getter corrispondente nell’entità `@SecurityPermissionEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPermissionEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPermissionEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Mappa il verbo di azione CRUD o personalizzato protetto da @SecurityPermissionEntity.
- **Comportamento a Runtime**: Normalizzato automaticamente dai metodi del controller (READ, WRITE, DELETE o azione personalizzata).
- **Come Usare**: Applica `@PermissionAction` sul campo o getter corrispondente nell’entità `@SecurityPermissionEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPermissionEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPermissionEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Dichiara i campi separati da virgola da mascherare dinamicamente quando si applica questa regola.
- **Comportamento a Runtime**: Applicato dinamicamente insieme a @FieldSecurity prima della serializzazione JSON.
- **Come Usare**: Applica `@PermissionFieldMask` sul campo o getter corrispondente nell’entità `@SecurityPermissionEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPermissionEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPermissionEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Scopo**: Mappa l’entità JPA che associa utenti autenticati a ruoli su database e ambito tenant opzionale.
- **Comportamento a Runtime**: Interrogato automaticamente durante l’idratazione JWT / SecurityContext tramite SecurityIdentityCustomizer.
- **Come Usare**: Applica sull’entità di join utente-ruolo con `@UserRoleSubject` e `@UserRoleCode`.
- **Quando Usare**: Quando il JWT contiene solo `sub` e i ruoli vanno caricati dinamicamente dal DB.
- **Quando NON Usare e Insidie**: NON dimenticare `@UserRoleSubject`; superfluo se un IdP esterno fornisce già i ruoli nel JWT.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@SecurityUserRoleEntity(enabled = true)` | Interruttore per abilitare o disabilitare il caricamento delle associazioni.<br/>*Avvertenza:* Imposta temporaneamente `false` durante migrazioni schema mantenendo operativi i ruoli JWT. |

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
- **Scopo**: Identifica il campo soggetto / username principale su @SecurityUserRoleEntity.
- **Comportamento a Runtime**: Confrontato con Authentication.getName() dal SecurityContext attivo.
- **Come Usare**: Applica `@UserRoleSubject` sul campo o getter corrispondente nell’entità `@SecurityUserRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityUserRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityUserRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Associa la colonna del codice ruolo assegnato in @SecurityUserRoleEntity.
- **Comportamento a Runtime**: Risolve i permessi collegati di @SecurityRoleEntity in sede di valutazione.
- **Come Usare**: Applica `@UserRoleCode` sul campo o getter corrispondente nell’entità `@SecurityUserRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityUserRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityUserRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Limita un’assegnazione @SecurityUserRoleEntity a un ID tenant specifico (o * globale).
- **Comportamento a Runtime**: Filtrato in base a TenantContextHolder / X-Tenant-ID su ogni richiesta autenticata.
- **Come Usare**: Applica `@UserRoleTenantId` sul campo o getter corrispondente nell’entità `@SecurityUserRoleEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityUserRoleEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityUserRoleEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Scopo**: Contrassegna un’entità JPA per politiche esplicite ALLOW / DENY ordinate per priority.
- **Comportamento a Runtime**: DENY esplicito prevale deterministicamente su ALLOW prima dell’esecuzione SQL.
- **Come Usare**: Applica su un’entità policy con `@PolicyAllowedRoles` obbligatorio e `@PolicyEffect`.
- **Quando Usare**: Per integrare o sovrascrivere `@EntitySecurity` tramite regole dinamiche `ALLOW`/`DENY` su DB.
- **Quando NON Usare e Insidie**: NON omettere `@PolicyAllowedRoles`; ricorda che `DENY` esplicito prevale su `ALLOW`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | No (Opzionale) | Numero positivo (`>= 0`) in priorità intera; es. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Priorità di valutazione delle policy (numeri più bassi prevalgono).<br/>*Avvertenza:* Valori più bassi hanno precedenza quando coincidono più policy (es. `10` prevale su `100`). |

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
- **Scopo**: Mappa il pattern identificativo della risorsa target in @SecurityPolicyEntity.
- **Comportamento a Runtime**: Supporta nomi esatti di entità/risorse e la corrispondenza wildcard *.
- **Come Usare**: Applica `@PolicyResource` sul campo o getter corrispondente nell’entità `@SecurityPolicyEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPolicyEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPolicyEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Mappa il verbo dell’operazione protetta (READ, WRITE, DELETE, methodName, *) in @SecurityPolicyEntity.
- **Comportamento a Runtime**: Valutato per ogni operazione HTTP prima della delega al service.
- **Come Usare**: Applica `@PolicyAction` sul campo o getter corrispondente nell’entità `@SecurityPolicyEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPolicyEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPolicyEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Mappa la collezione o lista CSV di ruoli interessati da una regola @SecurityPolicyEntity.
- **Comportamento a Runtime**: Confrontato con le autorizzazioni JWT attive e i ruoli DB @SecurityUserRoleEntity.
- **Come Usare**: Applica `@PolicyAllowedRoles` sul campo o getter corrispondente nell’entità `@SecurityPolicyEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPolicyEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPolicyEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Scopo**: Specifica l’esito decisionale ALLOW o DENY in una regola @SecurityPolicyEntity.
- **Comportamento a Runtime**: Qualsiasi regola DENY corrispondente interrompe la richiesta con HTTP 403 AccessDeniedBusinessException.
- **Come Usare**: Applica `@PolicyEffect` sul campo o getter corrispondente nell’entità `@SecurityPolicyEntity`.
- **Quando Usare**: Per mappare colonne personalizzate di `@SecurityPolicyEntity` nel motore DB-RBAC senza cambiare lo schema.
- **Quando NON Usare e Insidie**: NON duplicarlo su più campi né usarlo al di fuori di `@SecurityPolicyEntity`.

> **Annotazione Marker**: Pura annotazione marker — non dichiara alcun attributo.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Lock Distribuito, Idempotenza, Caching, Multi-DB e CloudEvents (13 Annotazioni)

### `@DistributedLock`

- **Package**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Scopo**: Serializza accessi concorrenti su chiavi SpEL in cache AST (predefiniti waitTimeMs=3000L, leaseTimeMs=5000L).
- **Comportamento a Runtime**: DistributedLockAspect solleva DistributedLockAcquisitionException (HTTP 409) al timeout.
- **Come Usare**: Applica su metodi di un `@Service` non final; in cluster registra un bean `DistributedLockProvider` Redis.
- **Quando Usare**: Per prevenire overselling di inventario, addebiti concorrenti o race condition.
- **Quando NON Usare e Insidie**: NON dare per scontato il lock multi-nodo con il provider locale Caffeine né applicarlo su classi `final`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | No (Opzionale) | Espressione SpEL riferita agli argomenti del metodo (es. `"'inventory:' + #skuId"`) o `""` per chiave automatica.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Espressione SpEL chiave di lock valutata a runtime.<br/>*Avvertenza:* Limita sempre la chiave all’ID risorsa più stretto (`#id`); una chiave fissa serializza tutto il traffico. |
| `waitTimeMs` | `long` | `3000L` | No (Opzionale) | Numero positivo (`>= 0`) in millisecondi; es. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Tempo massimo di attesa in millisecondi (predefinito 3000L).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: troppo basso causa 409 frequenti; troppo alto trattiene i thread durante i picchi. |
| `leaseTimeMs` | `long` | `5000L` | No (Opzionale) | Numero positivo (`>= 100`) in millisecondi; es. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Durata massima del lease del lock in ms (5000L).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: deve superare la durata p99 della transazione o il lock scadrà prima del commit. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Previene scritture duplicate concorrenti o riprodotte entro finestre TTL configurabili.
- **Comportamento a Runtime**: Applicato da IdempotencyAspect + ProxyIdempotencyGuardHelper con lock Caffeine TTL (HTTP 409 ConflictBusinessException); IdempotencyManagerHelper offre helper SHA-256 opzionali.
- **Come Usare**: Applica su metodi `@AutoRestController` o `@Service` non final; in errore la chiave viene rilasciata.
- **Quando Usare**: Per pagamenti, trasferimenti e POST esposti a doppi invii o retry di rete.
- **Quando NON Usare e Insidie**: NON usarlo su GET; su più pod registra un `IdempotencyStoreProvider` basato su Redis.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | No (Opzionale) | Nome di header HTTP valido (case-insensitive sulla rete, es. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Header HTTP recante la chiave client; assente o vuoto viene ignorato.<br/>*Avvertenza:* Il client deve inviare un UUIDv7 univoco per operazione e riutilizzarlo nei retry; includilo nei CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | No (Opzionale) | Numero positivo (`>= 1`) in secondi; es. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Finestra di deduplicazione in secondi (ripetizioni restituiscono HTTP 409; 300L).<br/>*Avvertenza:* Finestra di conservazione in Redis/memoria; imposta `300L–86400L` in base ai tempi di retry. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Applica limitazione delle richieste a finestra scorrevole per partizione IP, Utente o Tenant.
- **Comportamento a Runtime**: Incrementa nwvmc.ratelimit.rejected.total e risponde con HTTP 429 Too Many Requests.
- **Come Usare**: Applica sull’interfaccia o sul metodo; invia `X-RateLimit-Remaining`/`X-RateLimit-Reset` e restituisce `HTTP 429` + `Retry-After` oltre soglia.
- **Quando Usare**: Su ricerche pubbliche, auth, query AI ed export pesanti contro abusi.
- **Quando NON Usare e Insidie**: NON limitare gli health-check ed evita `"GLOBAL"` quando devi isolare utenti o tenant (`"USER"`, `"TENANT"`, `"IP"`).

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | No (Opzionale) | Numero positivo (`>= 1`) in richieste; es. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Numero massimo di richieste per finestra temporale (60).<br/>*Avvertenza:* Invia gli header `X-RateLimit-Remaining`, `X-RateLimit-Reset` e `Retry-After` (RFC 6585) in caso di HTTP `429`. |
| `windowSeconds` | `int` | `60` | No (Opzionale) | Numero positivo (`>= 1`) in secondi; es. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Durata in secondi della finestra temporale (60).<br/>*Avvertenza:* Definisce la durata della finestra contatore e calcola `X-RateLimit-Reset` e `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | No (Opzionale) | Uno dei valori supportati: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Strategia di partizione: "IP"/"clientIp", "USER" (fallback IP per anonimi), "TENANT", "GLOBAL" o SpEL "#expr".<br/>*Avvertenza:* `"USER"` isola per utente autenticato (fallback su IP se anonimo); `"GLOBAL"` condivide un’unica quota per tutti. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Avvolge le operazioni in Circuit Breaker Resilience4j con telemetria verso Actuator e Micrometer.
- **Comportamento a Runtime**: Scatta in OPEN (HTTP 503) superata la soglia e aggiorna il gauge nwvmc.resilience.circuitbreaker.state.
- **Come Usare**: Applica su controller o metodi esposti a dipendenze esterne/AI per evitare fallimenti a cascata.
- **Quando Usare**: Quando errori a valle devono fallire subito (`HTTP 503`) evitando attese di timeout.
- **Quando NON Usare e Insidie**: `CircuitBreakerErrorFilterUtil` ignora automaticamente le `BaseBusinessException` 4xx; non incapsulare errori client in `RuntimeException`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"payment-gateway-cb"`); lascia `""` per la convenzione predefinita.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nome dell’istanza CircuitBreaker in Resilience4j.<br/>*Avvertenza:* Identifica l’istanza Resilience4j e il tag Micrometer; `""` usa il nome della classe. |
| `failureRateThreshold` | `float` | `50.0f` | No (Opzionale) | Numero positivo (`1.0f .. 100.0f`) in percento; es. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Percentuale di errore per aprire il circuito (50.0f).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: gli errori applicativi 4xx (`BaseBusinessException`) sono ignorati; solo errori 5xx/infrastrutturali aprono il circuito. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | No (Opzionale) | Numero positivo (`>= 1`) in secondi; es. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Secondi di attesa in stato OPEN (HTTP 503) prima di HALF_OPEN (10).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: gli errori applicativi 4xx (`BaseBusinessException`) sono ignorati; solo errori 5xx/infrastrutturali aprono il circuito. |
| `slidingWindowSize` | `int` | `20` | No (Opzionale) | Numero positivo (`>= 1`) in chiamate; es. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Numero di chiamate valutate nella finestra mobile (20).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: gli errori applicativi 4xx (`BaseBusinessException`) sono ignorati; solo errori 5xx/infrastrutturali aprono il circuito. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | No (Opzionale) | Numero positivo (`>= 1`) in chiamate; es. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Chiamate sonda consentite in stato HALF_OPEN (5).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: gli errori applicativi 4xx (`BaseBusinessException`) sono ignorati; solo errori 5xx/infrastrutturali aprono il circuito. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Ritenta automaticamente i guasti transitori con backoff esponenziale configurabile.
- **Comportamento a Runtime**: Solleva un’eccezione standardizzata all’esaurimento di tutti i tentativi.
- **Come Usare**: Applica su controller o metodi per recuperare errori transitori di rete o lock DB.
- **Quando Usare**: Per letture GET idempotenti, PUT o chiamate protette da `@Idempotent`.
- **Quando NON Usare e Insidie**: MAI su POST non idempotenti o addebiti privi di `@Idempotent` (rischio doppio addebito)!

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"erp-sync-retry"`); lascia `""` per la convenzione predefinita.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nome dell’istanza Retry in Resilience4j.<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: assicurati che la durata complessiva dei tentativi resti sotto il timeout del gateway. |
| `maxAttempts` | `int` | `3` | No (Opzionale) | Numero positivo (`>= 1`) in tentativi; es. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Tentativi massimi inclusa la prima chiamata (3).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: assicurati che la durata complessiva dei tentativi resti sotto il timeout del gateway. |
| `waitDurationMs` | `long` | `500L` | No (Opzionale) | Numero positivo (`>= 50`) in millisecondi; es. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Attesa iniziale in ms prima del primo retry (500L).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: assicurati che la durata complessiva dei tentativi resti sotto il timeout del gateway. |
| `backoffMultiplier` | `double` | `2.0d` | No (Opzionale) | Numero positivo (`>= 1.0d`) in moltiplicatore; es. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Moltiplicatore esponenziale tra tentativi successivi (2.0d).<br/>*Avvertenza:* Calibrare con attenzione rispetto allo SLA di latenza in produzione: assicurati che la durata complessiva dei tentativi resti sotto il timeout del gateway. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Package**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Calcola ETag deboli RFC 7232 (W/"...") ed emette Cache-Control insieme a risposte HTTP 304 Not Modified.
- **Comportamento a Runtime**: Registra i contatori HIT/MISS in nwvmc.cache.http.requests.
- **Come Usare**: Applica su controller o metodi GET per emettere `ETag`, `Cache-Control` e `304`.
- **Quando Usare**: Per cataloghi semi-statici e listini pubblici risparmiando banda con `HTTP 304`.
- **Quando NON Usare e Insidie**: MAI lasciare `isPrivate = false` su dati PII, multi-tenant o mascherati per ruolo!

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | No (Opzionale) | Numero positivo (`>= 0`) in secondi; es. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Durata `max-age` nell’header Cache-Control in secondi (60).<br/>*Avvertenza:* Invia `Cache-Control: max-age=<N>`. Usa `0` con `generateETag = true` per rivalidazione condizionale `304`. |
| `isPrivate` | `boolean` | `false` | No (Opzionale) | `true` (cache privata solo browser; bloccata sui CDN) oppure `false` (cache pubblica condivisibile su proxy e CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true invia `private` (no CDN); false invia `public`.<br/>*Avvertenza:* CRITICO: Imposta sempre `isPrivate = true` su endpoint autenticati o con `@FieldSecurity` per evitare fughe dati su CDN. |
| `mustRevalidate` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Aggiunge `, must-revalidate` alla scadenza.<br/>*Avvertenza:* Impedisce alle cache intermedie di servire risposte scadute dopo `maxAgeSeconds` senza rivalidazione. |
| `generateETag` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Genera ETag SHA-256 rispondendo `HTTP 304` a fronte di `If-None-Match`.<br/>*Avvertenza:* Calcola un `ETag` RFC 7232 e risponde `304 Not Modified` (0 byte) quando `If-None-Match` corrisponde. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Memorizza in cache gli output dei metodi di lettura in Caffeine L1 / Redis L2.
- **Comportamento a Runtime**: Configurabile globalmente tramite app.framework.cache.type.
- **Come Usare**: Applica sui metodi di lettura del servizio.
- **Quando Usare**: Per letture frequenti per ID o metadati con alto rapporto lettura/scrittura.
- **Quando NON Usare e Insidie**: NON mettere in cache entità mutabili senza clonazione o tabelle ad alta scrittura.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Nomi logici delle cache in Caffeine L1 o Redis L2.<br/>*Avvertenza:* I nomi devono corrispondere alle regioni Caffeine/Redis; abbina `@AutoCacheEvict` su ogni scrittura. |
| `key` | `String` | `""` | No (Opzionale) | Espressione SpEL riferita agli argomenti del metodo (es. `"'product:' + #id"`) o `""` per chiave automatica.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Espressione SpEL chiave (v0.1.0 risolve `EntityName:id` in sicurezza).<br/>*Avvertenza:* In app multi-tenant includi sempre il tenantId nella chiave per evitare contaminazione tra tenant. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Rimuove le voci obsolete dalla cache lato server al momento delle mutazioni.
- **Comportamento a Runtime**: Eseguito post-mutazione senza lasciare frammenti di lettura obsoleti.
- **Come Usare**: Applica sui metodi update/delete con chiave coerente con `@AutoCacheable`.
- **Quando Usare**: Ogni volta che update o delete modificano record memorizzati con `@AutoCacheable`.
- **Quando NON Usare e Insidie**: Evita `allEntries = true` su `create` frequenti per prevenire fenomeni di Cache Stampede.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opzionale) | Array di zero o più valori validi: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Nomi delle cache da invalidare al termine del metodo.<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `value` non validi falliscono subito (fail-fast). |
| `key` | `String` | `""` | No (Opzionale) | Espressione SpEL riferita agli argomenti del metodo (es. `"'product:' + #id"`) o `""` per chiave automatica.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Espressione SpEL per rimuovere la sola voce modificata.<br/>*Avvertenza:* Deve generare la stessa chiave di `@AutoCacheable.key`; ignorato con `allEntries = true`. |
| `allEntries` | `boolean` | `false` | No (Opzionale) | `true` (svuota tutte le voci della regione cache) oppure `false` (rimuovi solo la singola voce indicata da key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Se true, svuota le voci limitate al prefisso dell’entità.<br/>*Avvertenza:* Svuotare l’intera regione sotto carico elevato può causare cache stampede sul DB; preferisci l’eviction mirata via `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Misura la durata di esecuzione ed emette log WARN al superamento della soglia.
- **Comportamento a Runtime**: Alimenta anche i timer di latenza tramite DynamicEntityMetricsHelper.
- **Come Usare**: Applica su interfacce `@AutoRestController` o servizi per monitorare sforamenti SLA.
- **Quando Usare**: Su report complessi, batch, GraphQL e `@CustomQuery` per rilevare regressioni SQL.
- **Quando NON Usare e Insidie**: NON impostare `<= 0` su rotte ad alto traffico né applicarlo a stream SSE `/events`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | No (Opzionale) | Numero positivo (`>= 1`) in millisecondi; es. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Soglia in ms oltre la quale viene emesso un avviso `WARN` (500L).<br/>*Avvertenza:* Registra un log `WARN` con `traceId` al superamento; imposta valori realistici (`200L–1000L`) per evitare rumore. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Package**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Scopo**: Invia webhook in uscita firmati HMAC-SHA256 asincroni su Virtual Threads dopo il commit.
- **Comportamento a Runtime**: Calcola le firme in WebhookHmacSignerHelper verificando l’uguaglianza a tempo costante.
- **Come Usare**: Applica sull’entità JPA; la consegna avviene asincronamente dopo il commit DB.
- **Quando Usare**: Per notificare partner esterni o ERP immediatamente dopo il commit di ordini/pagamenti.
- **Quando NON Usare e Insidie**: Imposta `includeFullPayload = false` per dati PII/PCI sensibili evitando URL SSRF interne.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | No (Opzionale) | Array di zero o più valori validi: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Eventi di ciclo di vita che avviano webhook firmati HMAC.<br/>*Avvertenza:* Inviato in modo asincrono dopo il commit (`AFTER_COMMIT`), evitando webhook fantasma sui rollback. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | No (Opzionale) | Nome di header HTTP valido (case-insensitive sulla rete, es. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Header HTTP con la firma HMAC-SHA256.<br/>*Avvertenza:* Contiene la firma HMAC-SHA256 del payload; il destinatario deve verificarla prima dell’elaborazione. |
| `includeFullPayload` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@EntityWebhook(includeFullPayload = false)` | true invia il payload JSON completo; false solo ID e metadati.<br/>*Avvertenza:* Imposta `false` (solo ID e tipo evento) per dati sensibili così i subscriber recuperano i campi via GET autenticato. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Package**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Pubblica buste CNCF CloudEvents v1.0 dopo il commit della transazione.
- **Comportamento a Runtime**: Rispetta TransactionRuntimeBridge.executeAfterCommit per evitare eventi fantasma.
- **Come Usare**: Applica su entità o metodi e ascolta `CloudEventEnvelopeDto` in `AFTER_COMMIT`.
- **Quando Usare**: Per comunicazione disaccoppiata tra Bounded Context senza JOIN SQL incrociati.
- **Quando NON Usare e Insidie**: NON confonderlo con `@EntityWebhook` esterno ed elabora solo dopo `AFTER_COMMIT`.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | No (Opzionale) | Stringa identificativa non vuota (es. `"com.acme.order.lifecycle"`); lascia `""` per la convenzione predefinita.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Attributo `type` CloudEvents (es. "io.nwvmc.order.created").<br/>*Avvertenza:* Segui la convenzione reverse-DNS CloudEvents 1.0 (`com.company.domain.event`); `""` genera automaticamente. |
| `source` | `String` | `""` | No (Opzionale) | Percorso HTTP valido che inizia con `/` (es. `/services/order-api`) oppure stringa vuota `""` per derivazione automatica.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` CloudEvents del contesto emittente.<br/>*Avvertenza:* Popola l’attributo URI `source` CNCF CloudEvents per il tracciamento tra microservizi. |
| `publishOnCreate` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Emette un CloudEvent dopo il commit di creazione (true).<br/>*Avvertenza:* Pubblicato solo dopo il commit (`AFTER_COMMIT`) tramite Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Emette un CloudEvent dopo il commit di aggiornamento (true).<br/>*Avvertenza:* Imposta `false` su entità aggiornate molto spesso per non saturare il message broker. |
| `publishOnDelete` | `boolean` | `true` | No (Opzionale) | `true` (attivo) oppure `false` (disattivo).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Emette un CloudEvent dopo la cancellazione (true).<br/>*Avvertenza:* Scatta sia su eliminazione fisica che `@SoftDelete` mantenendo sincronizzati i read-model. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Associa operazioni su entità o query a una chiave logica di datasource.
- **Comportamento a Runtime**: Registra i conteggi di routing in framework.datasource.routing.total.
- **Come Usare**: Applica su controller o servizi non final; il contesto precedente è ripristinato automaticamente.
- **Quando Usare**: Per separare letture pesanti/BI su repliche in sola lettura (`REPLICA`).
- **Quando NON Usare e Insidie**: NON cambiare datasource a metà di una `@Transactional` già aperta né su classi `final`!

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | No (Opzionale) | Uno dei valori supportati: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Chiave di routing in `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Avvertenza:* Deve corrispondere a una chiave attiva in `DynamicRoutingDataSource`; chiavi ignote ricadono su `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Scopo**: Assegna famiglia di motore database e shard cluster logico per entità.
- **Comportamento a Runtime**: Risolto dinamicamente da MultiPlatformDataSourceRegistryHelper e TenantDatabaseRoutingResolverHelper.
- **Come Usare**: Applica su entità JPA o metodi per dichiarare motore e cluster DB di destinazione.
- **Quando Usare**: In architetture polyglot o sharded con cluster dedicati a finanza, analytics e audit.
- **Quando NON Usare e Insidie**: NON sostituisce i pool JDBC reali; evita JOIN JPA tra entità su cluster diversi.

| Attributo | Tipo Java | Valore Predefinito | Obbligatorio | Valori Ammessi ed Esempio | Descrizione e Avvertenze Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | No (Opzionale) | Uno dei valori supportati: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Identificativo del motore database ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `platform` non validi falliscono subito (fail-fast). |
| `cluster` | `String` | `"PRIMARY"` | No (Opzionale) | Uno dei valori supportati: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Cluster o shard di destinazione ("PRIMARY", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER").<br/>*Avvertenza:* Validato all’avvio dell’applicazione; errori di battitura o `cluster` non validi falliscono subito (fail-fast). |
| `readOnly` | `boolean` | `false` | No (Opzionale) | `true` (instrada verso il pool replica in sola lettura) oppure `false` (instrada verso il pool master lettura/scrittura).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Se true, indica affinità verso repliche di sola lettura.<br/>*Avvertenza:* Non impostare mai `readOnly = true` su operazioni di scrittura: le repliche in sola lettura rifiutano le modifiche. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
