# 06. Vollständige Spezifikation aller 60 deklarativen Annotationen (`0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#annotations)

Umfassende technische Referenz aller **60 deklarativen Annotationen** in `io.github.natswarchuan:spring-nwvmc:0.1.0`, direkt aus den Java-`@interface`-Quellen extrahiert: exaktes Package, `@Target`, **jedes Attribut**, Java-Typ, Standardwert, Pflicht-/Optional-Status, **Verwendung**, **wann einsetzen**, **wann NICHT einsetzen & Stolperfallen**, sowie verifizierte Java-Codebeispiele.

## Schnellübersicht (60 Annotationen)

| Annotation | Kategorie | `@Target` | Attribut-Übersicht | Kernzweck |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Wandelt ein AutoApiController<E>-Interface in einen JDK-Dynamic-Proxy mit 40 Verträgen um (38 standardmäßig in Swagger UI sichtbar). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Leitet einen Controller-Vertrag über MethodHandleCacheUtil auf eine benutzerdefinierte Spring-Bean-Methode statt dynamischem CRUD um. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Bindet domänenspezifische Workflow-Routen (Checkout, Erstattung, Freigabe) an unabhängige Spring-@Component-Helper-Beans. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Reiner Java-Ersatz für @GetMapping ohne statische Spring-Web-Importe. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Reine Java-HTTP-POST-Deklaration mit Unterstützung benutzerdefinierter consumes/produces-Medientypen. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Reines Java-HTTP-PUT-Mapping für vollständige Ressourcenersetzung. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Reine Java-HTTP-PATCH-Deklaration für partielles Merge, atomare Inkremente und RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Reine Java-HTTP-DELETE-Deklaration für zustandsgeschütztes Soft-Delete. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Bindet URL-Abfrageparameter oder dynamische Filter-Maps (Map<String, String>). |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Bindet URI-Pfadvariablen wie UUIDv7-Entitäts-IDs. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Deserialisiert HTTP-JSON-Payloads in DTO- oder Entity-Parameter in Kombination mit @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Erlaubt rekursives Durchlaufen von Kindbeziehungen über GET /{id}/{relation}/** mit Zykluserkennung. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Deklariert domänenspezifische Zustandsübergänge oder numerische Anpassungen an Aktionsmethoden. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Framework-Komponentenmarker, der beim Start ohne Compile-Time-@Component-Import registriert wird. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Service-Layer-Stereotyp für ServiceImpl-Klassen in Verbindung mit @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Deklariert verwaltete Bean-Fabrikmethoden innerhalb von @AutoConfigurationBean-Klassen. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Markiert Konfigurationsklassen und YAML-Property-Binding-Modelle. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Steuert die Ausführungsreihenfolge zwischen SPI-Customizer-Beans und Filterketten. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Erzwingt NIST-Level-2-RBAC, ownerField-Datensatzisolation und Berechtigungscodes vor Abfragen und Mutationen. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Maskiert oder nullifiziert sensible Spalten dynamisch bei fehlenden Aufruferrollen. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Erzwingt erlaubte Übergänge über POST /{id}/transition und beschränkt DELETE /{id} auf deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Kompiliert lesbare Policy-Klauseln in aktive RBAC-, Übergangs- und Maskierungsregeln. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Zeichnet Feldänderungen für Time-Travel-Rekonstruktion und /diff-Inspektion auf. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Isoliert Zeilenabfragen und Mutationen automatisch anhand des aktiven Mandantenkontexts (außer Bypass-Rollen). |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Prüft Eindeutigkeit vor der Persistierung bei Create, Update und Upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Generiert bei Erstellung oder Klonen automatisch eindeutige Geschäftscodes mit Präfix, sofern leer. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Erzeugt aus sourceField automatisch normalisierte URL-freundliche ASCII-Slugs. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Berechnet abgeleitete numerische Summen sauber vor dem Speichern von Entitätsänderungen. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Ermöglicht das Binden benutzerdefinierter SQL/JPQL-Abfragen oder Provider-Methoden an Endpunkte. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Deklariert eine JPA-Entität als dynamische Datenbank-RBAC-Rollentabelle. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet die eindeutige Rollencode-Spalte innerhalb einer @SecurityRoleEntity zu. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Kennzeichnet das lesbare Anzeigenamen-Feld einer Rolle in @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Markiert das Sammlungs- oder CSV-Feld mit den einer Rolle gewährten Berechtigungscodes. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Markiert eine JPA-Entität zur Speicherung von Ressourcen-Aktions-Rechten und Feldmaskierungsregeln. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Kennzeichnet das eindeutige Berechtigungskennungs-Feld innerhalb von @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet den Zielentitäts- oder API-Ressourcennamen (oder *) in @SecurityPermissionEntity zu. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet das durch @SecurityPermissionEntity geschützte CRUD- oder benutzerdefinierte Aktionsverb zu. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Deklariert kommagetrennte Entitätsfelder, die durch diese DB-Berechtigungsregel dynamisch maskiert werden. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Ordnet die JPA-Entität zu, die authentifizierte Benutzer mit DB-Rollen und optionalem Mandanten verknüpft. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Kennzeichnet das Principal-/Benutzernamen-Feld in @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Bindet die zugewiesene Rollencode-Spalte innerhalb von @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Begrenzt eine @SecurityUserRoleEntity-Zuweisung auf eine Mandanten-ID (oder * für global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Markiert eine JPA-Entität für explizite, nach priority sortierte ALLOW-/DENY-Autorisierungsrichtlinien. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet das Zielressourcen-Muster innerhalb einer @SecurityPolicyEntity zu. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet das geschützte Operationsverb (READ, WRITE, DELETE, methodName, *) in @SecurityPolicyEntity zu. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ordnet die Sammlung oder CSV-Liste der von @SecurityPolicyEntity betroffenen Rollen zu. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Bestimmt das Entscheidungsergebnis ALLOW oder DENY einer @SecurityPolicyEntity-Regel. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serialisiert parallelen Zugriff über AST-gecachte SpEL-Schlüssel (Standard waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Verhindert gleichzeitige oder wiederholte doppelte Schreibvorgänge innerhalb konfigurierbarer TTL-Fenster. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Erzwingt Sliding-Window-Ratenbegrenzung je IP-, Benutzer- oder Mandantenpartition. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Umschließt Operationen mit Resilience4j-Circuit-Breakern samt Telemetrie für Actuator & Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Wiederholt vorübergehende Fehler automatisch mit konfigurierbarem exponentiellem Backoff. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Berechnet schwache RFC-7232-ETags (W/"...") und liefert Cache-Control sowie HTTP 304 Not Modified Antworten. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Cached serverseitige Leseergebnisse in Caffeine L1 / Redis L2 Engines. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Entfernt veraltete serverseitige Cache-Einträge bei Mutationen. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Misst die Ausführungsdauer und schreibt WARN-Logs bei Überschreitung des Schwellwerts. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Sendet nach Commit asynchron HMAC-SHA256-signierte Webhooks auf Virtual Threads. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Veröffentlicht CNCF CloudEvents v1.0 Umschläge nach dem Transaktions-Commit. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Bindet Entitäts- oder Abfrageoperationen an einen benannten logischen DataSource-Schlüssel. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Weist je Entität Datenbank-Engine-Familie und logischen Cluster-Shard zu. |

---

## 1. Routing, dynamische API-Verträge, DTO-Entkopplung & Parameterbindung (13 Annotationen)

### `@AutoRestController`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Zweck**: Wandelt ein AutoApiController<E>-Interface in einen JDK-Dynamic-Proxy mit 40 Verträgen um (38 standardmäßig in Swagger UI sichtbar).
- **Laufzeitverhalten**: DynamicControllerProxyRegistrarHelper scannt Controller beim Start und registriert Routen in RequestMappingHandlerMapping.
- **Verwendung**: Deklarieren Sie `@AutoRestController(basePath = "/api/v1/...")` auf einem Java-Interface, das `AutoApiController<E>` oder `AutoReadApi<E>` erweitert.
- **Wann verwenden**: Verwenden Sie dies, um standardisierte CRUD-, Filter-, Keyset- oder Read-Only-Endpunkte für JPA-Entitäten ohne Boilerplate bereitzustellen.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf konkreten `@RestController`-Klassen oder zustandslosen Gateways ohne JPA-Entität einsetzen; für reine Lese-APIs `AutoReadApi<E>` wählen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Nein (Optional) | Gültiger HTTP-Pfad mit führendem `/` (z. B. `/api/v1/product-catalogs`) oder leerer String `""` für automatische Ableitung.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Expliziter Wurzel-URI-Pfad (z. B. "/api/v1/product-catalogs"). Leer = automatisch im Plural-Kebab-Case abgeleitet.<br/>*Hinweis:* Beim Start wertet der Registrar `basePath` vor `path` aus. Keine widersprüchlichen Werte setzen. |
| `path` | `String` | `""` | Nein (Optional) | Gültiger HTTP-Pfad mit führendem `/` (z. B. `/api/v1/orders`) oder leerer String `""` für automatische Ableitung.<br/>`@AutoRestController(path = "/api/v1/orders")` | Alternativer Pfad-Alias. Bevorzugen Sie basePath, da dieser zuerst ausgewertet wird.<br/>*Hinweis:* Beim Start wertet der Registrar `basePath` vor `path` aus. Keine widersprüchlichen Werte setzen. |
| `entityName` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"ProductCatalog"`); `""` verwendet die Standardkonvention.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Überschreibt den angezeigten Entitätsnamen in OpenAPI/Studio.<br/>*Hinweis:* Wird direkt in Swagger / OpenAPI 3.0 und NWVMC Studio angezeigt; Texte für Zero-Hard-Code in `OpenApiConstant` auslagern. |
| `enabledEndpoints` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Positivliste exakter Vertrags-Methodennamen (z. B. "getPage"). Leer aktiviert alle geerbten Endpunkte.<br/>*Hinweis:* Wirkt als strikte Positivliste: Alle nicht genannten Methoden werden aus Spring MVC und Swagger UI ausgeschlossen. |
| `disabledEndpoints` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Negativliste zum Deaktivieren einzelner Methoden vor der Spring-MVC-Registrierung.<br/>*Hinweis:* Wird nach `enabledEndpoints` ausgewertet; ideal zum Sperren von Lösch- oder Massenendpunkten bei Erhalt der übrigen Verträge. |
| `enableNestedSubResources` | `boolean` | `false` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Aktiviert rekursive Subressourcen-Navigation GET /{id}/**. Standardmäßig false.<br/>*Hinweis:* Auf `false` belassen, sofern kein `GET /{id}/items/...` nötig ist; bei Aktivierung mit `@EnableNestedSubResource` einschränken. |
| `readDto` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `ProductReadDto.class`) oder `Void.class` zum Deaktivieren.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | Optionales Lese-DTO zum Ausblenden interner Entitätsfelder; Void.class gibt die Entität zurück.<br/>*Hinweis:* Gilt ausschließlich für die Lese- (GET)-Pipeline; die DTO-Klasse benötigt Standardkonstruktor/Getter und unterstützt `@Valid`. |
| `createDto` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `ProductCreateDto.class`) oder `Void.class` zum Deaktivieren.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | Optionales Eingabe-DTO, das vor dem POST-Mapping mit Jakarta Validation geprüft wird.<br/>*Hinweis:* Gilt ausschließlich für die Erstellungs- (POST)-Pipeline; die DTO-Klasse benötigt Standardkonstruktor/Getter und unterstützt `@Valid`. |
| `updateDto` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `ProductUpdateDto.class`) oder `Void.class` zum Deaktivieren.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | Optionales Update-DTO zur Begrenzung beschreibbarer Felder bei PUT/PATCH.<br/>*Hinweis:* Gilt ausschließlich für die Aktualisierungs- (PUT/PATCH)-Pipeline; die DTO-Klasse benötigt Standardkonstruktor/Getter und unterstützt `@Valid`. |

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
- **Zweck**: Leitet einen Controller-Vertrag über MethodHandleCacheUtil auf eine benutzerdefinierte Spring-Bean-Methode statt dynamischem CRUD um.
- **Laufzeitverhalten**: EscapeHatchDispatchHelper löst die Ziel-Bean auf und puffert den MethodHandle in MethodHandleCacheUtil.
- **Verwendung**: Versehen Sie die Controller-Methode mit `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` für eine `@Service`/`@Component`-Klasse.
- **Wann verwenden**: Optimal, wenn der Großteil per Auto-CRUD läuft, aber einzelne Methoden maßgeschneiderte Java-Orchestrierung benötigen.
- **Wann NICHT verwenden & Fallstricke**: Übergeben Sie KEINEN String an `targetBean` (erfordert `Class<?>`). Vermeiden Sie Overrides, wenn deklarative Regeln genügen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `OrderCustomService.class`) oder `Void.class` zum Deaktivieren.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Ziel-Spring-Bean-Klasse (hat Vorrang vor beanName).<br/>*Hinweis:* Beim Start wertet der Registrar `targetBean` vor `beanName` aus. Keine widersprüchlichen Werte setzen. |
| `beanName` | `String` | `""` | Nein (Optional) | Exakter Bean-Name im ApplicationContext (z. B. `"orderCustomService"`) oder `""` für automatische Auflösung.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Expliziter Spring-Bean-Name, falls targetBean Void.class ist.<br/>*Hinweis:* Beim Start wertet der Registrar `targetBean` vor `beanName` aus. Keine widersprüchlichen Werte setzen. |
| `methodName` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"createOrder"`); `""` verwendet die Standardkonvention.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Methodenname auf dem Ziel-Bean; leer entspricht dem Methodennamen im Controller.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"createOrder"`); sonst Laufzeitfehler. |
| `bypassAutoDispatch` | `boolean` | `true` | Nein (Optional) | `true` (Standard-Proxy umgehen und Ziel-Bean direkt aufrufen) oder `false` (ergänzend zum Standard-Dispatch ausführen).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Bei true wird der automatische CRUD-Dispatch übersprungen und direkt über MethodHandle aufgerufen.<br/>*Hinweis:* Bei `true` (Standard) wird der integrierte CRUD-Handler komplett übersprungen. Setzen Sie `false` nur für ergänzende Hooks. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Bindet domänenspezifische Workflow-Routen (Checkout, Erstattung, Freigabe) an unabhängige Spring-@Component-Helper-Beans.
- **Laufzeitverhalten**: Ruft delegateBean.delegateMethod über einen gepufferten MethodHandle samt Validierung und Transaktion auf.
- **Verwendung**: Definieren Sie eine Interface-Methode mit `path`, `httpMethod`, `delegateBean` und `delegateMethod` auf einen Spring-Helper.
- **Wann verwenden**: Ideal für fachliche Workflow-Endpunkte wie Checkout, Erstattung, Freigaben oder entitätsübergreifende Transaktionen.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf Proxy-Aspekte verlassen (`ControllerProxySpecialRouteUtil` greift vor `invokeProtectedOperation`); Spring AOP auf den delegierten Bean setzen und für einfache Übergänge `@BusinessAction` nutzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/reports/monthly-sales`); `""` bindet an die Wurzel.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Relativer Pfad unterhalb des Controller-basePath (z. B. "/checkout").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `path`-Werte brechen sofort per Fail-Fast ab. |
| `httpMethod` | `String` | `"GET"` | Nein (Optional) | Einer der unterstützten Werte: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Zuzuordnende HTTP-Methode ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `httpMethod`-Werte brechen sofort per Fail-Fast ab. |
| `delegateBean` | `String` | `""` | Nein (Optional) | Exakter Bean-Name im ApplicationContext (z. B. `"orderReportService"`) oder `""` für automatische Auflösung.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Name des Spring-Beans mit der Workflow-Methode (erforderlich ohne default-Methode oder @ServiceOverride).<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `delegateBean`-Werte brechen sofort per Fail-Fast ab. |
| `delegateMethod` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"buildMonthlyReport"`); `""` verwendet die Standardkonvention.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Zielmethode auf delegateBean; leer = Controller-Methodenname.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"buildMonthlyReport"`); sonst Laufzeitfehler. |
| `summary` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"Get monthly revenue breakdown"`); `""` verwendet die Standardkonvention.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Kurze OpenAPI-3.0-Zusammenfassung für Swagger UI.<br/>*Hinweis:* Wird direkt in Swagger / OpenAPI 3.0 und NWVMC Studio angezeigt; Texte für Zero-Hard-Code in `OpenApiConstant` auslagern. |
| `description` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"Aggregates confirmed invoice totals grouped by currency"`); `""` verwendet die Standardkonvention.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Ausführliche OpenAPI-3.0-Beschreibung im aufgeklappten Swagger-UI-Eintrag.<br/>*Hinweis:* Wird direkt in Swagger / OpenAPI 3.0 und NWVMC Studio angezeigt; Texte für Zero-Hard-Code in `OpenApiConstant` auslagern. |

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
- **Zweck**: Reiner Java-Ersatz für @GetMapping ohne statische Spring-Web-Importe.
- **Laufzeitverhalten**: Wird beim Proxy-Start auf ein HTTP-GET-RequestMappingInfo abgebildet.
- **Verwendung**: Deklarieren Sie `@AutoGet("/pfad")` auf einer Methode in `@AutoRestController` (oft mit `@ServiceOverride` oder `@CustomQuery`).
- **Wann verwenden**: Geeignet für reine HTTP-GET-Routen in reinen Java-Interfaces ohne `@GetMapping`-Import.
- **Wann NICHT verwenden & Fallstricke**: NICHT für zustandsverändernde Endpunkte oder reguläre `@RestController`-Klassen nutzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/{id}/summary`); `""` bindet an die Wurzel.<br/>`@AutoGet("/{id}/summary")` | Relatives GET-Pfadmuster (z. B. "/metrics"). Leer entspricht dem basePath.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `produces` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json", "text/csv"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Optionale MIME-Typen der Antwort (z. B. "text/event-stream", "text/csv").<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Accept` erzwungen; falsche Header liefern `406` oder `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Reine Java-HTTP-POST-Deklaration mit Unterstützung benutzerdefinierter consumes/produces-Medientypen.
- **Laufzeitverhalten**: Wird in SpringMvcEndpointBridge als HTTP-POST-Handler registriert.
- **Verwendung**: Versehen Sie eine Erstellungs- oder Aktionsmethode mit `@AutoPost("/pfad")`, binden Sie den Body mit `@AutoBody` und kombinieren Sie mit `@BusinessAction`.
- **Wann verwenden**: Verwenden Sie es für nicht-idempotente Erstellungs-, Befehls- und Batch-POST-Endpunkte.
- **Wann NICHT verwenden & Fallstricke**: NICHT für Leseabfragen (`@AutoGet`), Vollersetzungen (`@AutoPut`), Teilupdates (`@AutoPatch`) oder Löschungen (`@AutoDelete`) verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/{id}/approve`); `""` bindet an die Wurzel.<br/>`@AutoPost("/{id}/approve")` | Relatives POST-Pfadmuster unterhalb von basePath.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `consumes` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json", "multipart/form-data"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Akzeptierte Content-Type-Medientypen der Anfrage.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Content-Type` erzwungen; falsche Header liefern `406` oder `415`. |
| `produces` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Erzeugte Antwort-Medientypen.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Accept` erzwungen; falsche Header liefern `406` oder `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Reines Java-HTTP-PUT-Mapping für vollständige Ressourcenersetzung.
- **Laufzeitverhalten**: Als HTTP-PUT-Handler innerhalb einer transaktionalen Ausführung gebunden.
- **Verwendung**: Setzen Sie `@AutoPut("/{id}")` auf Methoden zur Vollaktualisierung mit `@AutoVariable` und `@AutoBody`.
- **Wann verwenden**: Für idempotente Vollersetzungen mit vollständiger Ressourcen-Payload verwenden.
- **Wann NICHT verwenden & Fallstricke**: NICHT für partielle Einzel-Feld-Änderungen nutzen (dafür `@AutoPatch` oder `@BusinessAction`).

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/{id}/replace`); `""` bindet an die Wurzel.<br/>`@AutoPut("/{id}/replace")` | Relatives PUT-Pfadmuster (z. B. "/{id}").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `consumes` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Unterstützte Content-Type-Typen der Anfrage.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Content-Type` erzwungen; falsche Header liefern `406` oder `415`. |
| `produces` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Erzeugte Antwort-Medientypen.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Accept` erzwungen; falsche Header liefern `406` oder `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Reine Java-HTTP-PATCH-Deklaration für partielles Merge, atomare Inkremente und RFC 6902 JSON Patch.
- **Laufzeitverhalten**: Unterstützt JSON-Merge-Semantik und application/json-patch+json.
- **Verwendung**: Setzen Sie `@AutoPatch("/{id}/aktion")` auf Teilupdate- oder `@BusinessAction`-Methoden.
- **Wann verwenden**: Geeignet für partielle Mutationen, atomare Zähleränderungen und Statusübergänge.
- **Wann NICHT verwenden & Fallstricke**: NICHT bei zwingender Vollersetzung (`@AutoPut`) oder Neuerstellung (`@AutoPost`) verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/{id}/status`); `""` bindet an die Wurzel.<br/>`@AutoPatch("/{id}/status")` | Relatives PATCH-Pfadmuster (z. B. "/{id}/approve").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `consumes` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json", "application/merge-patch+json"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Akzeptierte Content-Types.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Content-Type` erzwungen; falsche Header liefern `406` oder `415`. |
| `produces` | `String[]` | `{}` | Nein (Optional) | Array aus MIME-Medientypen (z. B. `{"application/json"}`); leeres `{}` nutzt standardmäßig `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Erzeugte Antwort-Medientypen.<br/>*Hinweis:* Wird von Spring MVC über den HTTP-Header `Accept` erzwungen; falsche Header liefern `406` oder `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Reine Java-HTTP-DELETE-Deklaration für zustandsgeschütztes Soft-Delete.
- **Laufzeitverhalten**: Prüft @StateMachine deletableStates vor dem Setzen von deleted=true.
- **Verwendung**: Setzen Sie `@AutoDelete("/{id}/custom")` auf Löschmethoden, meist mit `@ServiceOverride`.
- **Wann verwenden**: Verwenden Sie dies für individuelle Archivierungs-, Soft-Delete- oder Bereinigungs-DELETE-Endpunkte.
- **Wann NICHT verwenden & Fallstricke**: Definieren Sie kein eigenes DELETE, wenn der Standard-Soft-Delete mit `@StateMachine` ausreicht.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Relativer URI-Unterpfad mit optionalen `{pathVar}`-Platzhaltern (z. B. `/{id}/archive`); `""` bindet an die Wurzel.<br/>`@AutoDelete("/{id}/archive")` | Relatives DELETE-Pfadmuster (z. B. "/{id}/purge").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Zweck**: Bindet URL-Abfrageparameter oder dynamische Filter-Maps (Map<String, String>).
- **Laufzeitverhalten**: Wird über DynamicQueryParameterParserHelper mit QueryGuardrailEnforcerUtil-Validierung extrahiert.
- **Verwendung**: Deklarieren Sie es an Methodenparametern im Controller-Interface.
- **Wann verwenden**: Wenn Controller-Interfaces 100 % Pure Java ohne Spring-Web-Imports bleiben sollen.
- **Wann NICHT verwenden & Fallstricke**: NICHT für Pfadvariablen (`@AutoVariable`) oder JSON-Bodies (`@AutoBody`) verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"status"`); `""` verwendet die Standardkonvention.<br/>`@AutoParam("status") String status` | Name des Query-Parameters (Alias für name). Leer = Java-Parametername.<br/>*Hinweis:* Beim Start wertet der Registrar `value` vor `name` aus. Keine widersprüchlichen Werte setzen. |
| `name` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"pageSize"`); `""` verwendet die Standardkonvention.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Expliziter Query-Parametername.<br/>*Hinweis:* Beim Start wertet der Registrar `value` vor `name` aus. Keine widersprüchlichen Werte setzen. |
| `required` | `boolean` | `true` | Nein (Optional) | `true` (erforderlich; fehlend liefert HTTP 400) oder `false` (optional; bei Fehlen wird null übergeben).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Ob das Fehlen des Parameters HTTP 400 auslöst.<br/>*Hinweis:* Wird automatisch optional, sobald `defaultValue` gesetzt ist; bei `false` Wrapper-Typen (`Integer`) statt Primitive verwenden. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Nein (Optional) | Nicht-leere Kennung (z. B. `"20"`); `""` verwendet die Standardkonvention.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Ersatzwert bei Fehlen; Standard ist das Sentinel DEFAULT_NONE.<br/>*Hinweis:* Wird per Spring `ConversionService` aus String in den Zieltyp konvertiert; ungültige Werte liefern HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Zweck**: Bindet URI-Pfadvariablen wie UUIDv7-Entitäts-IDs.
- **Laufzeitverhalten**: Wird aus MVC-Pfadmustern in typisierte Java-UUID-/String-Werte geparst.
- **Verwendung**: Verwenden Sie es an Pfad-ID-Parametern wie `findById(@AutoVariable("id") UUID id)`.
- **Wann verwenden**: Zum Auslesen von `{id}`, `{slug}` oder `{code}` aus URI-Vorlagen in Pure-Java-Interfaces.
- **Wann NICHT verwenden & Fallstricke**: NICHT für Query-Parameter (`@AutoParam`) oder Request-Bodies (`@AutoBody`) verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"orderId"`); `""` verwendet die Standardkonvention.<br/>`@AutoVariable("orderId") UUID orderId` | Name der URI-Pfadvariable.<br/>*Hinweis:* Beim Start wertet der Registrar `value` vor `name` aus. Keine widersprüchlichen Werte setzen. |
| `name` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"tenantCode"`); `""` verwendet die Standardkonvention.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Expliziter Name der Pfadvariable.<br/>*Hinweis:* Beim Start wertet der Registrar `value` vor `name` aus. Keine widersprüchlichen Werte setzen. |
| `required` | `boolean` | `true` | Nein (Optional) | `true` (erforderlich; fehlend liefert HTTP 400) oder `false` (optional; bei Fehlen wird null übergeben).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Ob die Pfadvariable erforderlich ist.<br/>*Hinweis:* Muss zu `{variableName}` im URI-Template passen; `false` greift nur bei optionalen URI-Mustern. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Zweck**: Deserialisiert HTTP-JSON-Payloads in DTO- oder Entity-Parameter in Kombination mit @Valid.
- **Laufzeitverhalten**: Wird vor Eintritt in die Service-Transaktion durch LocalValidatorFactoryBean validiert.
- **Verwendung**: Verwenden Sie `@AutoBody` (ggf. mit `@Valid`) am Body-Parameter von `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Wann verwenden**: Zur JSON-Deserialisierung in Entitäten oder DTOs in Pure-Java-Controllern.
- **Wann NICHT verwenden & Fallstricke**: NICHT bei GET/DELETE ohne Body und niemals mehrfach pro Methode verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Nein (Optional) | `true` (erforderlich; fehlend liefert HTTP 400) oder `false` (optional; bei Fehlen wird null übergeben).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Ob ein fehlender Request-Body HTTP 400 auslöst.<br/>*Hinweis:* Mit `@Valid` kombinieren, um Jakarta-Validierung auszulösen; `false` erlaubt leere Request-Bodies ohne HTTP `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Erlaubt rekursives Durchlaufen von Kindbeziehungen über GET /{id}/{relation}/** mit Zykluserkennung.
- **Laufzeitverhalten**: Erfordert @AutoRestController(enableNestedSubResources = true) am Controller.
- **Verwendung**: Aktivieren Sie `enableNestedSubResources = true` und schränken Sie Relationen per `@EnableNestedSubResource` ein.
- **Wann verwenden**: Für verschachtelte Parent-Child-URLs wie `GET /api/v1/customer-orders/{id}/items` mit Security-Check je Ebene.
- **Wann NICHT verwenden & Fallstricke**: NICHT ohne `allowedRelationships` bei stark vernetzten Tabellen oder über Domänengrenzen hinweg freigeben.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Optionale Positivliste erlaubter Ziel-Entitätsklassen beim GET /{id}/**-Traversal.<br/>*Hinweis:* Ein leeres Array gibt alle Kind-Entitäten frei; benennen Sie Klassen explizit, um interne Tabellen zu schützen. |
| `allowedRelationships` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Erlaubte JPA-Beziehungsfelder in Subressourcen-Pfaden (z. B. "items", "customer").<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"items"`); sonst Laufzeitfehler. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Deklariert domänenspezifische Zustandsübergänge oder numerische Anpassungen an Aktionsmethoden.
- **Laufzeitverhalten**: Wird vor dem Speichern aktualisierter Entitätsattribute atomar ausgeführt.
- **Verwendung**: Kombinieren Sie `@AutoPatch` mit `@BusinessAction(...)` direkt auf einer Controller-Methode.
- **Wann verwenden**: Für deklarative Statusübergänge, atomare Wertanpassungen und Domain-Methoden auf einer Entität ohne Service-Klasse.
- **Wann NICHT verwenden & Fallstricke**: NICHT für entitätsübergreifende Orchestrierung oder externe HTTP-Calls verwenden (nutzen Sie `@ServiceOverride`).

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein Lebenszyklus-Status-Feld (z. B. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Name des Statusfelds der Entität (geprüft gegen @StateMachine).<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"status"`); sonst Laufzeitfehler. |
| `targetStateValue` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"APPROVED"`); `""` verwendet die Standardkonvention.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Neuer Ziel-Statuswert innerhalb der Transaktion.<br/>*Hinweis:* Wird vor dem Speichern gegen `@StateMachine` oder `@HumanPolicy` geprüft; ungültige Übergänge führen zum Rollback. |
| `adjustNumericField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein numerischen-Feld (z. B. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Numerisches Feld, das atomar erhöht oder verringert wird.<br/>*Hinweis:* Erfordert `deltaParamIndex >= 0` oder ein gesetztes `fixedDelta`. Unterstützt `Integer`, `Long`, `BigDecimal` und `Double`. |
| `deltaParamIndex` | `int` | `-1` | Nein (Optional) | Einer der unterstützten Werte: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Nullbasierter Parameterindex für das dynamische Delta; -1 deaktiviert die Parameterauslese.<br/>*Hinweis:* Beim Start wertet der Registrar `deltaParamIndex` vor `fixedDelta` aus. Keine widersprüchlichen Werte setzen. |
| `fixedDelta` | `String` | `""` | Nein (Optional) | Einer der unterstützten Werte: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Fester numerischer Delta-String (z. B. "100", "-1"), falls kein Parameter genutzt wird.<br/>*Hinweis:* Beim Start wertet der Registrar `deltaParamIndex` vor `fixedDelta` aus. Keine widersprüchlichen Werte setzen. |
| `entityMethod` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"markFulfilled"`); `""` verwendet die Standardkonvention.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Name einer parameterlosen Domain-Methode auf der Entität in derselben Transaktion.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"markFulfilled"`); sonst Laufzeitfehler. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean-Erkennung, Konfigurationsbindung & Ausführungsreihenfolge (5 Annotationen)

### `@AutoComponent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Framework-Komponentenmarker, der beim Start ohne Compile-Time-@Component-Import registriert wird.
- **Laufzeitverhalten**: Framework-interner Scan (io.github.natswarchuan); Konsumenten-Apps nutzen Spring-@Component.
- **Verwendung**: Internes Framework-Stereotyp, gescannt von `AutoBeanFactoryRegistrarBridge` unter `io.github.natswarchuan`.
- **Wann verwenden**: NUR beim Entwickeln interner Framework-Module unter `io.github.natswarchuan.*` verwenden.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS in Konsumenten-Apps (`com.example.*`) einsetzen! Verwenden Sie Spring `@Component`.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Exakter Bean-Name im ApplicationContext (z. B. `"invoiceValidationHelper"`) oder `""` für automatische Auflösung.<br/>`@AutoComponent("invoiceValidationHelper")` | Optionaler Bean-Name; leer verwendet camelCase des Klassennamens.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Service-Layer-Stereotyp für ServiceImpl-Klassen in Verbindung mit @ServiceOverride.
- **Laufzeitverhalten**: Wird innerhalb von io.github.natswarchuan per Klassennamen registriert; App-Services verwenden Spring-@Service.
- **Verwendung**: Internes Service-Stereotyp innerhalb von `io.github.natswarchuan`.
- **Wann verwenden**: NUR für interne Framework-Services unter `io.github.natswarchuan.*`.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS in Anwendungsservices nutzen — dort `@Service` verwenden.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Exakter Bean-Name im ApplicationContext (z. B. `"orderFulfillmentService"`) oder `""` für automatische Auflösung.<br/>`@AutoService("orderFulfillmentService")` | Optionaler Name des Service-Beans.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Deklariert verwaltete Bean-Fabrikmethoden innerhalb von @AutoConfigurationBean-Klassen.
- **Laufzeitverhalten**: Wird während der Auto-Konfiguration von PureJavaBeanRegistrarBridge verarbeitet.
- **Verwendung**: Auf Factory-Methoden in `@AutoConfigurationBean`-Klassen des Frameworks anwenden.
- **Wann verwenden**: NUR in internen Konfigurationsklassen unter `io.github.natswarchuan.config.*`.
- **Wann NICHT verwenden & Fallstricke**: NICHT in eigenen `@Configuration`-Klassen einsetzen — nutzen Sie Spring `@Bean`.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Explizite Bean-Namen und Aliase.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `targetTypeName` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"com.example.spi.PaymentGateway"`); `""` verwendet die Standardkonvention.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Optionaler vollqualifizierter Zieltypname.<br/>*Hinweis:* Optionaler FQCN-Hinweis, wenn die Factory-Methode einen Obertyp oder Proxy zurückgibt; Klasse muss im Classpath liegen. |
| `primary` | `boolean` | `false` | Nein (Optional) | `true` (bevorzugter Bean bei mehreren Kandidaten) oder `false` (Standard-Priorität).<br/>`@AutoBean(primary = true)` | Markiert den Bean als Primärkandidaten bei Mehrdeutigkeiten.<br/>*Hinweis:* Zwei `@AutoBean(primary = true)` für denselben Typ führen beim Start zu einem Mehrdeutigkeitskonflikt. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Markiert Konfigurationsklassen und YAML-Property-Binding-Modelle.
- **Laufzeitverhalten**: Registriert Konfigurations-Beans und YAML-Präfixe sauber samt IDE-Metadaten.
- **Verwendung**: Kennzeichnet interne Konfigurations- und Properties-Klassen in `io.github.natswarchuan.config.*`.
- **Wann verwenden**: NUR innerhalb der Framework-Bibliothek als Pure-Java-Ersatz für `@Configuration`.
- **Wann NICHT verwenden & Fallstricke**: NICHT in Anwendungs-Konfigurationen einsetzen — dort Spring `@Configuration` nutzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Exakter Bean-Name im ApplicationContext (z. B. `"storageAutoConfig"`) oder `""` für automatische Auflösung.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Optionaler Konfigurations-Bean-Bezeichner.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `prefix` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"nwvmc.storage"`); `""` verwendet die Standardkonvention.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Optionales YAML-Property-Präfix über `PureJavaBeanRegistrarBridge`.<br/>*Hinweis:* Bindet passende kebab-case-Properties aus `application.yml`; mit `spring-configuration-metadata.json` bleiben IDE-Warnungen aus. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Zweck**: Steuert die Ausführungsreihenfolge zwischen SPI-Customizer-Beans und Filterketten.
- **Laufzeitverhalten**: Kleinere Ganzzahlwerte werden früher ausgeführt (Standard Integer.MAX_VALUE).
- **Verwendung**: Setzen Sie `@OrderPriority(1)` auf geordnete Pure-Java-Komponenten oder Customizer.
- **Wann verwenden**: Wenn eine deterministische Reihenfolge mehrerer SPI-Customizer erforderlich ist.
- **Wann NICHT verwenden & Fallstricke**: NICHT mit HTTP-Security-Filtern oder Query-Sortierung (`?sort=`) verwechseln.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Nein (Optional) | Einer der unterstützten Werte: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Ausführungs-Priorität; kleinere Werte werden früher ausgeführt.<br/>*Hinweis:* Kleinere Zahlen laufen ZUERST (wie Spring `@Order`). `< 0` für Sicherheit/Tracing und `10..100` für Fachlogik reservieren. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Entitätssicherheit, Zustandsautomat, Integrität, Generatoren & Abfragen (11 Annotationen)

### `@EntitySecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Erzwingt NIST-Level-2-RBAC, ownerField-Datensatzisolation und Berechtigungscodes vor Abfragen und Mutationen.
- **Laufzeitverhalten**: Wird vor SQL-Ausführung geprüft; unbefugter Zugriff wirft HTTP 403 Forbidden.
- **Verwendung**: Direkt auf der JPA-Entität anbringen und Rollen sowie optional `ownerField` festlegen.
- **Wann verwenden**: Auf JEDER exponierten Entität für durchgängige Sicherheit über REST, Batch, Export und GraphQL.
- **Wann NICHT verwenden & Fallstricke**: NICHT `permitAll = true` auf vollem `AutoApiController<E>` ohne `AutoReadApi<E>`, `disabledEndpoints` oder `@SecurityPolicyEntity` setzen (umgeht READ-, WRITE- und DELETE-Prüfungen).

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_USER", "ROLE_ADMIN"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Rollen mit Leseberechtigung (GET, GraphQL, Export).<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |
| `writeRoles` | `String[]` | `{}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Rollen mit Schreibrecht (POST/PUT/PATCH/Import).<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |
| `deleteRoles` | `String[]` | `{}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Rollen mit Löschberechtigung (DELETE / Batch-Delete).<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |
| `permitAll` | `boolean` | `false` | Nein (Optional) | `true` (öffentlichen Zugriff ohne Login erlauben) oder `false` (Authentifizierung und Rollenprüfung erzwingen).<br/>`@EntitySecurity(permitAll = true)` | Bei true (ohne DB-RBAC-Override) werden @EntitySecurity-Prüfungen für READ, WRITE und DELETE umgangen; mit AutoReadApi<E> oder disabledEndpoints kombinieren.<br/>*Hinweis:* Hebelt Rollenprüfungen aus und erlaubt anonymen Zugriff. Niemals für PII- oder Finanz-Entitäten aktivieren. |
| `ownerField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein Eigentümer/UUID-Feld (z. B. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Feld für den Datensatz-Eigentümer ("createdBy") zum Schutz vor IDOR.<br/>*Hinweis:* Erzwingt zeilenweise Eigentümerprüfung für `GET`/`PUT`/`PATCH`/`DELETE`, außer bei Rollen aus `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Privilegierte Rollen, die `ownerField`-Prüfungen umgehen dürfen.<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |
| `permissions` | `String[]` | `{}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ORDER_READ", "ORDER_APPROVE"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Feingranulare Berechtigungscodes für DB RBAC und Customizer.<br/>*Hinweis:* Wird gegen feingranulare Berechtigungen aus JWT oder DB-RBAC `@SecurityPermissionEntity` geprüft. |

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
- **Zweck**: Maskiert oder nullifiziert sensible Spalten dynamisch bei fehlenden Aufruferrollen.
- **Laufzeitverhalten**: Wird nach dem Laden und vor der JSON-Serialisierung angewendet.
- **Verwendung**: Auf sensiblen Entitätsfeldern (`costPrice`, `ssn`) anbringen; wirkt auf isolierten Response-Kopien.
- **Wann verwenden**: Wenn dasselbe Modell je nach Rolle unterschiedliche Feldsichtbarkeit in REST und GraphQL benötigt.
- **Wann NICHT verwenden & Fallstricke**: Nicht-`String`-Typen werden automatisch `null`; nutzen Sie `nullifyInsteadOfMask = true` um `String`-Felder auf `null` zu setzen, oder `readDto` zum Weglassen des Schlüssels.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Rollen, die den unmaskierten Originalwert sehen dürfen.<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |
| `maskPattern` | `String` | `"******"` | Nein (Optional) | Nicht-leere Kennung (z. B. `"***-**-****"`); `""` verwendet die Standardkonvention.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Ersatzmuster für String-Felder bei fehlender Rolle.<br/>*Hinweis:* Wird bei `nullifyInsteadOfMask = true` ignoriert. Für Nicht-String-Felder (`BigDecimal`, `LocalDate`) besser `nullifyInsteadOfMask = true` wählen. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Nein (Optional) | `true` (unbefugtes Feld durch JSON null ersetzen) oder `false` (maskPattern-Zeichenkette anwenden).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Bei true werden auch String-Felder null statt maskPattern (Nicht-String-Typen werden automatisch null).<br/>*Hinweis:* Unverzichtbar für Zahlen, Daten und Objekte, damit TypeScript/Zod-Clients ein gültiges `null` erhalten. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Zweck**: Erzwingt erlaubte Übergänge über POST /{id}/transition und beschränkt DELETE /{id} auf deletableStates.
- **Laufzeitverhalten**: Lehnt unzulässige Übergänge oder Löschungen mit HTTP 422 BusinessRuleViolationException ab.
- **Verwendung**: Auf dem String-Statusfeld anbringen mit `:` (`"CREATED:PAID,CANCELLED"`).
- **Wann verwenden**: Für strikte Lebenszyklen (Bestellungen, Kredite, Tickets), die illegale Sprünge mit `422` blockieren.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS `"->"` verwenden (`EntityStateMachineUtil` trennt strikt an `":"`)!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Nein (Optional) | Nicht-leere Kennung (z. B. `"CREATED"`); `""` verwendet die Standardkonvention.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Anfangsstatus bei Neuerstellung, falls Feld leer ("ACTIVE").<br/>*Hinweis:* Wird bei `POST` automatisch gesetzt, wenn leer; muss dem Ausgangszustand vor `:` in `transitions` entsprechen. |
| `transitions` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Erlaubte Zustandsübergänge im Doppelpunkt-Format "FROM:TO_1,TO_2".<br/>*Hinweis:* Erzwingt die Doppelpunkt-Syntax `"FROM:TO1,TO2"` (Ziele kommagetrennt). Nicht definierte Übergänge liefern HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Status-Positivliste für DELETE (sonst HTTP 422 Unprocessable Entity).<br/>*Hinweis:* Wenn gesetzt, schlägt `DELETE /{id}` mit HTTP `409 Conflict` fehl, falls die Entität in einem anderen Zustand liegt. |

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
- **Zweck**: Kompiliert lesbare Policy-Klauseln in aktive RBAC-, Übergangs- und Maskierungsregeln.
- **Laufzeitverhalten**: Per GET /human-policy einsehbar und per YAML unter spring-nwvmc.human-policies.<Entity> überschreibbar.
- **Verwendung**: Auf der Entität oder per YAML `spring-nwvmc.human-policies` deklarieren; wird per Regex-Compiler ausgewertet.
- **Wann verwenden**: Wenn Produkt- oder Compliance-Teams lesbare, per YAML auslagerbare Regeln wünschen.
- **Wann NICHT verwenden & Fallstricke**: KEINEN beliebigen Fließtext verwenden — der Parser erkennt feste englische Muster.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Nein (Optional) | Einer der unterstützten Werte: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Natürlichsprachige Lebenszyklus-Direktive für Zustandsübergänge.<br/>*Hinweis:* Wird beim Start in dieselbe State-Machine-Engine wie `@StateMachine` übersetzt; keine widersprüchlichen Regeln doppelt pflegen. |
| `security` | `String` | `""` | Nein (Optional) | Einer der unterstützten Werte: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Natürlichsprachige RBAC-Regel für Lese-, Schreib- und Löschrechte.<br/>*Hinweis:* Rollennamen werden automatisch mit `ROLE_` normalisiert und beim Start Fail-Fast geparst. |
| `masking` | `String` | `""` | Nein (Optional) | Einer der unterstützten Werte: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Natürlichsprachige Feld-Maskierungsrichtlinie.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"costPrice"`); sonst Laufzeitfehler. |
| `stateField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein Lebenszyklus-Status-Feld (z. B. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Zustandsfeld der Entität für die kompilierte Lifecycle-Regel.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"orderStatus"`); sonst Laufzeitfehler. |

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
- **Zweck**: Zeichnet Feldänderungen für Time-Travel-Rekonstruktion und /diff-Inspektion auf.
- **Laufzeitverhalten**: Erfasst oldValue- und newValue-Deltas bei create, update, patch, transition und restore.
- **Verwendung**: Auf `BaseAuditEntity`-Klassen anbringen; `AuditTrailService` zeichnet Mutationen automatisch auf.
- **Wann verwenden**: Für prüfungspflichtige Entitäten (Zahlungen, Bestellungen, Patientenakten) mit `/{id}/revisions`.
- **Wann NICHT verwenden & Fallstricke**: Auf hochfrequenten Log-/Telemetrie-Tabellen vermeiden oder `recordFieldDiffs = false` setzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"FINANCE_LEDGER"`); `""` verwendet die Standardkonvention.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Logische Audit-Kategorie; leer verwendet den Entitätsnamen.<br/>*Hinweis:* Taggt Audit-Logs für domänenspezifische Filterung; `""` verwendet den einfachen Entitätsklassennamen. |
| `recordFieldDiffs` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Bei true werden Feld-Diffs (Alt vs. Neu) für Time-Travel gespeichert.<br/>*Hinweis:* Speichert Vorher-/Nachher-Diffs bei `PUT`/`PATCH`; bei großen Blobs oder Hochfrequenz-Writes auf `false` setzen. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Isoliert Zeilenabfragen und Mutationen automatisch anhand des aktiven Mandantenkontexts (außer Bypass-Rollen).
- **Laufzeitverhalten**: Fail-Closed HTTP 403 bei fehlendem Mandantenkontext ohne Bypass-Rolle; überschreibt tenantId bei Create (Anti-Spoofing) und schützt alle ID-Operationen gegen IDOR.
- **Verwendung**: Auf SaaS-Entitäten platzieren: Lese-Filter, Anti-Spoofing beim Erstellen und Fail-Closed `403` sind aktiv.
- **Wann verwenden**: Auf allen mandantenfähigen Shared-DB-Tabellen zur sicheren Mandantentrennung über REST, Batch und GraphQL.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf globalen Referenztabellen (Länder, Währungen) platzieren.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein Mandanten-ID-Feld (z. B. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Name des Entitätsfelds für die Mandanten-ID (Standard "tenantId").<br/>*Hinweis:* Legen Sie einen zusammengesetzten DB-Index `(tenant_id, id)` für schnelle, streng getrennte Mandantenabfragen an. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Nein (Optional) | Array aus Spring-Security-Rollennamen (z. B. `{"ROLE_SUPER_ADMIN"}`); leeres `{}` fügt keine eigene Sperre hinzu.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Plattformrollen mit Mandanten-übergreifendem Zugriff.<br/>*Hinweis:* Hinterlegen Sie Rollennamen in `RoleConstant` mit Präfix `ROLE_` (z. B. `ROLE_ADMIN`) passend zu `GrantedAuthority`. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Zweck**: Prüft Eindeutigkeit vor der Persistierung bei Create, Update und Upsert.
- **Laufzeitverhalten**: Wirft ConflictBusinessException (HTTP 409), sobald ein Duplikat existiert.
- **Verwendung**: Auf eindeutigen Geschäftsschlüsseln (`email`, `skuCode`) ergänzend zu `@Column(unique = true)` einsetzen.
- **Wann verwenden**: Wenn Eindeutigkeit unter aktiven Datensätzen (`deleted = false`) mit sauberem `HTTP 409` geprüft werden soll.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf den Datenbank-`UNIQUE`-Index verzichten — bei Race Conditions greift das DB-Constraint (`409`).

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Zweck**: Generiert bei Erstellung oder Klonen automatisch eindeutige Geschäftscodes mit Präfix, sofern leer.
- **Laufzeitverhalten**: Befüllt Präfix + eindeutiges Token vor Validierung und Speicherung.
- **Verwendung**: Auf dem String-Code-Feld anbringen (`prefix = "PRD-"`); wird beim Erstellen/Klonen bei Leerwert generiert.
- **Wann verwenden**: Für menschenlesbare Referenzcodes (Bestellnummern, SKUs) ohne DB-Sequenz-Engpässe.
- **Wann NICHT verwenden & Fallstricke**: NICHT einsetzen, wenn lückenlose fortlaufende Nummern (`1, 2, 3...`, z. B. Rechnungsnummern) Pflicht sind.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Ja (Pflicht)** | Nicht-leere Kennung (z. B. `"ORD"`); `""` verwendet die Standardkonvention.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Pflicht-Präfix vor einem 8-stelligen UUIDv7-Großbuchstaben-Hash (z. B. "PRD-").<br/>*Hinweis:* Pflichtattribut; erzeugt Codes wie `INV-2026-0001` nur, wenn das Feld beim Erstellen leer ist. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Zweck**: Erzeugt aus sourceField automatisch normalisierte URL-freundliche ASCII-Slugs.
- **Laufzeitverhalten**: Normalisiert Unicode-Diakritika und ermöglicht Suchen über Slug-Filter.
- **Verwendung**: Auf dem Feld `slug` anbringen: `@AutoSlug(sourceField = "name")`.
- **Wann verwenden**: Für SEO-freundliche URLs bei Shops, Blogposts, Kategorien und Produktkatalogen.
- **Wann NICHT verwenden & Fallstricke**: Kein nicht vorhandenes `sourceField` angeben; spätere Titeländerungen überschreiben bestehende Slugs nicht.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Ja (Pflicht)** | Exakter Java-Feldname in der Entität für ein String-Feld (z. B. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Pflicht-Quellfeld, dessen Text in einen kleingeschriebenen ASCII-Slug umgewandelt wird.<br/>*Hinweis:* Pflichtattribut; normalisiert Unicode/Umlaute zu URL-sicherem kebab-case. Mit `@UniqueField` für Eindeutigkeit kombinieren. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Zweck**: Berechnet abgeleitete numerische Summen sauber vor dem Speichern von Entitätsänderungen.
- **Laufzeitverhalten**: Wird beim Start durch ComputedFieldFailFastUtil für sofortiges Fail-Fast bei Fehlkonfiguration geprüft.
- **Verwendung**: Auf berechneten `BigDecimal`-Feldern anbringen; wird vor dem Speichern exakt neu berechnet.
- **Wann verwenden**: Für serverseitige Positions- und Bestellsummen, damit Clients keine Beträge manipulieren können.
- **Wann NICHT verwenden & Fallstricke**: NICHT für komplexe Staffelpreise oder externe Währungskurse verwenden (`@ServiceOverride`).

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Nein (Optional) | Einer der unterstützten Werte: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Berechnungsmodus: "MULTIPLY" oder "SUM_COLLECTION".<br/>*Hinweis:* Wird vor jedem `POST`/`PUT`/`PATCH`-Speichern neu berechnet und überschreibt manipulierte Client-Summen. |
| `sourceFields` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Felder derselben Entität, die bei "MULTIPLY" multipliziert werden.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"unitPrice"`); sonst Laufzeitfehler. |
| `collectionField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein @OneToMany-Sammlung-Feld (z. B. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Name des @OneToMany-Collection-Feldes für "SUM_COLLECTION".<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"items"`); sonst Laufzeitfehler. |
| `itemField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein numerischen-Feld (z. B. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Numerisches Feld auf jedem Kindelement, das summiert wird.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"subTotal"`); sonst Laufzeitfehler. |
| `subtractField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein numerischen-Feld (z. B. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Optionales Abzugsfeld auf der Eltern-Entität (z. B. "discountAmount").<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"discountAmount"`); sonst Laufzeitfehler. |
| `addField` | `String` | `""` | Nein (Optional) | Exakter Java-Feldname in der Entität für ein numerischen-Feld (z. B. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Optionales Zuschlagsfeld (z. B. "shippingFee"), das hinzuaddiert wird.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"shippingFee"`); sonst Laufzeitfehler. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Ermöglicht das Binden benutzerdefinierter SQL/JPQL-Abfragen oder Provider-Methoden an Endpunkte.
- **Laufzeitverhalten**: Wird mit gebundenen benannten Parametern über den JPA EntityManager ausgeführt.
- **Verwendung**: Mit `@AutoGet`/`@AutoPost` kombinieren und `:param`-Parameter über `@AutoParam` binden.
- **Wann verwenden**: Für native SQL-Reports, CTEs, Window-Funktionen oder JSONB ohne manuelles Repository.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS Benutzereingaben konkatenieren (immer `:param`); keine domänenübergreifenden JOINs schreiben.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nein (Optional) | Einer der unterstützten Werte: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Inline-SQL oder JPQL mit benannten `:param`-Platzhaltern.<br/>*Hinweis:* Stets Bind-Parameter `:param` oder `?1` gegen SQL-Injection nutzen; bei `sqlProvider` leer `""` lassen. |
| `nativeQuery` | `boolean` | `true` | Nein (Optional) | `true` (natives Datenbank-SQL ausführen) oder `false` (portables JPA-JPQL ausführen).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true führt natives SQL aus; false nutzt JPA JPQL.<br/>*Hinweis:* Natives SQL (`true`) erlaubt CTEs und Window-Functions; `false` (JPQL) sorgt für Portabilität über H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `MonthlyRevenueDto.class`) oder `Void.class` zum Deaktivieren.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Optionale Zielklasse für das Ergebnis-Mapping.<br/>*Hinweis:* Für Aggregationsabfragen stets eine DTO-Projektionsklasse angeben, um `SELECT *` und untypisierte Zeilen zu vermeiden. |
| `sqlProvider` | `Class<?>` | `Void.class` | Nein (Optional) | Beliebige konkrete Java-DTO-Klasse (z. B. `OrderAnalyticsSqlProvider.class`) oder `Void.class` zum Deaktivieren.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Optionale Pure-Java-SQL-Provider-Klasse mit Startup-Validierung.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `sqlProvider`-Werte brechen sofort per Fail-Fast ab. |
| `providerMethod` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"buildRevenueSql"`); `""` verwendet die Standardkonvention.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Methodenname in `sqlProvider`, der den SQL-String liefert.<br/>*Hinweis:* Muss exakt (Groß-/Kleinschreibung beachten) mit dem Java-Bezeichner übereinstimmen (z. B. `"buildRevenueSql"`); sonst Laufzeitfehler. |
| `modifying` | `boolean` | `false` | Nein (Optional) | `true` (DML UPDATE/DELETE in Schreibtransaktion) oder `false` (Nur-Lese-SELECT-Abfrage).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Muss für INSERT/UPDATE/DELETE auf `true` stehen.<br/>*Hinweis:* Erforderlich (`true`) für `UPDATE`/`DELETE`; startet automatisch eine Schreibtransaktion. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Datenbankgestütztes dynamisches RBAC & Feldmaskierungs-Meta-Annotationen (18 Annotationen)

### `@SecurityRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Zweck**: Deklariert eine JPA-Entität als dynamische Datenbank-RBAC-Rollentabelle.
- **Laufzeitverhalten**: DynamicDatabaseRbacProviderHelper puffert Rollen-Berechtigungen in Caffeine und invalidiert bei Schreibvorgängen.
- **Verwendung**: Auf Ihrer Role-Entität platzieren und den Schlüssel mit `@RoleCode` markieren.
- **Wann verwenden**: Wenn Administratoren Rollen dynamisch zur Laufzeit in der Datenbank verwalten.
- **Wann NICHT verwenden & Fallstricke**: NIE `@RoleCode` vergessen (Fail-Fast beim Start!) und keine doppelte `@SecurityRoleEntity` anlegen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Nein (Optional) | Positive Zahl (`>= 1`) in Sekunden; z. B. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine-Snapshot-TTL in Sekunden vor dem Neuladen.<br/>*Hinweis:* Kurze TTLs zeigen Änderungen schneller bei höherer DB-Last; lange TTLs entlasten die DB, verzögern aber Widerrufe. |

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
- **Zweck**: Ordnet die eindeutige Rollencode-Spalte innerhalb einer @SecurityRoleEntity zu.
- **Laufzeitverhalten**: Wird über gepufferten LambdaAccessorUtil zum Abgleich von GrantedAuthority-Tokens gelesen.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Kennzeichnet das lesbare Anzeigenamen-Feld einer Rolle in @SecurityRoleEntity.
- **Laufzeitverhalten**: Wird in RBAC-Diagnosemetadaten und Dev-Studio-Endpunkten bereitgestellt.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Markiert das Sammlungs- oder CSV-Feld mit den einer Rolle gewährten Berechtigungscodes.
- **Laufzeitverhalten**: Wird dynamisch geparst und zu effektiven SecurityIdentityCustomizer-Berechtigungen expandiert.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Zweck**: Markiert eine JPA-Entität zur Speicherung von Ressourcen-Aktions-Rechten und Feldmaskierungsregeln.
- **Laufzeitverhalten**: Wird in DatabaseRbacRuleMatcherHelper für CRUD-Zugriffskontrolle und Feldmaskierung geladen.
- **Verwendung**: Auf Ihrer Permission-Entität anbringen und `@PermissionCode` zwingend markieren.
- **Wann verwenden**: Für granulare Ressourcen-/Aktionsrechte und dynamische Feld-Maskierung aus der Datenbank.
- **Wann NICHT verwenden & Fallstricke**: NIE `@PermissionCode` vergessen und nicht doppelt definieren.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Nein (Optional) | Positive Zahl (`>= 1`) in Sekunden; z. B. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Caffeine-TTL in Sekunden für den Berechtigungs-Snapshot.<br/>*Hinweis:* Kurze TTLs zeigen Änderungen schneller bei höherer DB-Last; lange TTLs entlasten die DB, verzögern aber Widerrufe. |

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
- **Zweck**: Kennzeichnet das eindeutige Berechtigungskennungs-Feld innerhalb von @SecurityPermissionEntity.
- **Laufzeitverhalten**: Wird gegen Aufrufer-Berechtigungen und @EntitySecurity.permissions()-Codes abgeglichen.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPermissionEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPermissionEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPermissionEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Ordnet den Zielentitäts- oder API-Ressourcennamen (oder *) in @SecurityPermissionEntity zu.
- **Laufzeitverhalten**: Wird von DatabaseRbacRuleMatcherHelper groß-/kleinschreibungsunabhängig samt Wildcard ausgewertet.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPermissionEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPermissionEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPermissionEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Ordnet das durch @SecurityPermissionEntity geschützte CRUD- oder benutzerdefinierte Aktionsverb zu.
- **Laufzeitverhalten**: Wird automatisch aus Controller-Methoden auf READ, WRITE, DELETE oder benutzerdefinierte Aktion normalisiert.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPermissionEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPermissionEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPermissionEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Deklariert kommagetrennte Entitätsfelder, die durch diese DB-Berechtigungsregel dynamisch maskiert werden.
- **Laufzeitverhalten**: Wird dynamisch zusammen mit @FieldSecurity vor der HTTP-JSON-Serialisierung angewendet.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPermissionEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPermissionEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPermissionEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Zweck**: Ordnet die JPA-Entität zu, die authentifizierte Benutzer mit DB-Rollen und optionalem Mandanten verknüpft.
- **Laufzeitverhalten**: Wird bei der JWT-/SecurityContext-Hydrierung automatisch über SecurityIdentityCustomizer abgefragt.
- **Verwendung**: Auf Ihrer User-Role-Zuordnungstabelle anbringen mit `@UserRoleSubject` und `@UserRoleCode`.
- **Wann verwenden**: Wenn JWTs nur `sub`/`username` enthalten und Rollen mandantenspezifisch aus der DB nachgeladen werden.
- **Wann NICHT verwenden & Fallstricke**: NIE `@UserRoleSubject` vergessen; unnötig, wenn externe IdPs alle Rollen komplett im JWT liefern.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@SecurityUserRoleEntity(enabled = true)` | Schalter zum Aktivieren/Deaktivieren der Benutzer-Rollen-Zuordnung.<br/>*Hinweis:* Während einer Schema-Migration temporär auf `false` setzen, während JWT-Rollen aktiv bleiben. |

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
- **Zweck**: Kennzeichnet das Principal-/Benutzernamen-Feld in @SecurityUserRoleEntity.
- **Laufzeitverhalten**: Wird gegen Authentication.getName() aus dem aktiven SecurityContext abgeglichen.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityUserRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityUserRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityUserRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Bindet die zugewiesene Rollencode-Spalte innerhalb von @SecurityUserRoleEntity.
- **Laufzeitverhalten**: Löst verknüpfte @SecurityRoleEntity-Berechtigungen bei der Policy-Auswertung auf.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityUserRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityUserRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityUserRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Begrenzt eine @SecurityUserRoleEntity-Zuweisung auf eine Mandanten-ID (oder * für global).
- **Laufzeitverhalten**: Wird bei jeder Anfrage anhand von TenantContextHolder / X-Tenant-ID gefiltert.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityUserRoleEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityUserRoleEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityUserRoleEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Zweck**: Markiert eine JPA-Entität für explizite, nach priority sortierte ALLOW-/DENY-Autorisierungsrichtlinien.
- **Laufzeitverhalten**: Explizites DENY überstimmt ALLOW deterministisch noch vor der SQL-Ausführung.
- **Verwendung**: Auf Ihrer Policy-Entität mit `@PolicyAllowedRoles` (Pflicht), `@PolicyResource`, `@PolicyAction` und `@PolicyEffect`.
- **Wann verwenden**: Zum dynamischen Überschreiben von `@EntitySecurity` aus der DB (inkl. Notfall-`DENY`).
- **Wann NICHT verwenden & Fallstricke**: NIE `@PolicyAllowedRoles` vergessen; explizites `DENY` überstimmt `ALLOW`.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Nein (Optional) | Positive Zahl (`>= 0`) in Ganzzahl-Priorität; z. B. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Auswertungspriorität (kleinere Werte haben Vorrang).<br/>*Hinweis:* Niedrigere Werte haben Vorrang bei mehreren passenden Richtlinien (z. B. `10` überschreibt `100`). |

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
- **Zweck**: Ordnet das Zielressourcen-Muster innerhalb einer @SecurityPolicyEntity zu.
- **Laufzeitverhalten**: Unterstützt exakte Entitäts-/Ressourcennamen sowie Wildcard-Abgleich (*).
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPolicyEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPolicyEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPolicyEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Ordnet das geschützte Operationsverb (READ, WRITE, DELETE, methodName, *) in @SecurityPolicyEntity zu.
- **Laufzeitverhalten**: Wird pro HTTP-Operation vor der Service-Delegierung ausgewertet.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPolicyEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPolicyEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPolicyEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Ordnet die Sammlung oder CSV-Liste der von @SecurityPolicyEntity betroffenen Rollen zu.
- **Laufzeitverhalten**: Wird gegen aktive JWT-Rechte sowie DB-geladene @SecurityUserRoleEntity-Rollen abgeglichen.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPolicyEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPolicyEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPolicyEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Zweck**: Bestimmt das Entscheidungsergebnis ALLOW oder DENY einer @SecurityPolicyEntity-Regel.
- **Laufzeitverhalten**: Jede zutreffende DENY-Richtlinie bricht die Anfrage sofort mit HTTP 403 AccessDeniedBusinessException ab.
- **Verwendung**: Auf dem passenden Feld oder Getter innerhalb einer `@SecurityPolicyEntity`-Entität anbringen.
- **Wann verwenden**: Zur Anbindung eigener Spaltennamen in `@SecurityPolicyEntity` an die DB-RBAC-Engine ohne Schema-Zwang.
- **Wann NICHT verwenden & Fallstricke**: NICHT mehrfach auf derselben Klasse und nicht außerhalb von `@SecurityPolicyEntity` verwenden.

> **Marker-Annotation**: Reine Marker-Annotation ohne eigene Attribute.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Verteilte Sperren, Idempotenz, Caching, Multi-DB & CloudEvents (13 Annotationen)

### `@DistributedLock`

- **Package**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Zweck**: Serialisiert parallelen Zugriff über AST-gecachte SpEL-Schlüssel (Standard waitTimeMs=3000L, leaseTimeMs=5000L).
- **Laufzeitverhalten**: DistributedLockAspect wirft bei Zeitüberschreitung DistributedLockAcquisitionException (HTTP 409).
- **Verwendung**: Auf einer Methode eines nicht-finalen `@Service` anbringen; für Cluster ein Redis-`DistributedLockProvider`-Bean registrieren.
- **Wann verwenden**: Zum Verhindern von Überverkäufen, parallelen Abbuchungen oder Batch-Race-Conditions.
- **Wann NICHT verwenden & Fallstricke**: Der Standard-Caffeine-Provider gilt nur pro JVM — im Cluster zwingend `DistributedLockProvider` ersetzen!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Nein (Optional) | SpEL-Ausdruck mit Methodenparametern (z. B. `"'inventory:' + #skuId"`) oder `""` für automatische Schlüsselbildung.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Zur Laufzeit ausgewerteter SpEL-Lock-Schlüssel.<br/>*Hinweis:* Schlüssel stets auf die kleinste Ressourcen-ID (`#id`) begrenzen; konstante Schlüssel serialisieren allen Traffic. |
| `waitTimeMs` | `long` | `3000L` | Nein (Optional) | Positive Zahl (`>= 0`) in Millisekunden; z. B. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Maximale Wartezeit in Millisekunden zum Erwerb des Locks (3000L).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: zu kurz erzeugt unnötige 409-Konflikte; zu lang blockiert Worker-Threads bei Lastspitzen. |
| `leaseTimeMs` | `long` | `5000L` | Nein (Optional) | Positive Zahl (`>= 100`) in Millisekunden; z. B. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Maximale Lease-Dauer des Locks in Millisekunden (5000L).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: muss die p99-Transaktionsdauer überschreiten, sonst läuft die Sperre vor dem Commit ab. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Verhindert gleichzeitige oder wiederholte doppelte Schreibvorgänge innerhalb konfigurierbarer TTL-Fenster.
- **Laufzeitverhalten**: Durchgesetzt von IdempotencyAspect + ProxyIdempotencyGuardHelper via Caffeine-TTL-Sperre (HTTP 409 ConflictBusinessException); IdempotencyManagerHelper bietet optionale SHA-256-Hilfe.
- **Verwendung**: Auf `@AutoRestController`- oder nicht-finalen `@Service`-Methoden anbringen; Fehler geben den Key wieder frei.
- **Wann verwenden**: Für Zahlungen, Überweisungen und POST-Aufrufe, die vor Doppelausführung durch Retries geschützt sein müssen.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf GET-Endpunkten verwenden; bei mehreren Pods `IdempotencyStoreProvider` durch Redis ersetzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Nein (Optional) | Gültiger HTTP-Header-Name (auf Netzwerkebene unabhängig von Groß-/Kleinschreibung, z. B. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | HTTP-Header für den Client-Idempotency-Key; fehlend/leer wird übersprungen.<br/>*Hinweis:* Clients müssen pro Vorgang eine eindeutige UUIDv7 senden und bei Retries wiederholen; in CORS `allowedHeaders` freigeben. |
| `ttlSeconds` | `long` | `300L` | Nein (Optional) | Positive Zahl (`>= 1`) in Sekunden; z. B. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Deduplizierungsfenster in Sekunden mit HTTP 409 Conflict bei Wiederholung (300L).<br/>*Hinweis:* Aufbewahrungsdauer im Cache/Redis; je nach Retry-Fenster `300L–86400L` wählen (z. B. 24h für Zahlungen). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Erzwingt Sliding-Window-Ratenbegrenzung je IP-, Benutzer- oder Mandantenpartition.
- **Laufzeitverhalten**: Erhöht nwvmc.ratelimit.rejected.total und antwortet mit HTTP 429 Too Many Requests.
- **Verwendung**: Auf Controller-Interface oder Methode anbringen; sendet `X-RateLimit-Remaining`/`X-RateLimit-Reset` und bei Überschreitung `HTTP 429` + `Retry-After`.
- **Wann verwenden**: Für öffentliche Suche, Auth-Endpunkte, AI-Queries und schwere Exporte zum Schutz vor Missbrauch.
- **Wann NICHT verwenden & Fallstricke**: NICHT auf Health-Probes eng setzen und `"GLOBAL"` meiden, wenn Aufrufer per `"USER"`, `"TENANT"` oder `"IP"` isoliert bleiben sollen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Nein (Optional) | Positive Zahl (`>= 1`) in Anfragen; z. B. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Maximale Anfragen pro Zeitfenster (Standard 60).<br/>*Hinweis:* Sendet bei HTTP `429` die Header `X-RateLimit-Remaining`, `X-RateLimit-Reset` und RFC 6585 `Retry-After`. |
| `windowSeconds` | `int` | `60` | Nein (Optional) | Positive Zahl (`>= 1`) in Sekunden; z. B. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Dauer des Zeitfensters in Sekunden (Standard 60).<br/>*Hinweis:* Bestimmt die Fensterdauer des Zählers sowie die Werte für `X-RateLimit-Reset` und `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Nein (Optional) | Einer der unterstützten Werte: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Dynamische Partitionierung: "IP"/"clientIp", "USER" (IP-Fallback für anonyme Calls), "TENANT", "GLOBAL" oder SpEL "#expr".<br/>*Hinweis:* `"USER"` trennt nach angemeldetem Benutzer (Fallback auf IP für Anonyme); `"GLOBAL"` teilt ein einziges Kontingent für alle. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Umschließt Operationen mit Resilience4j-Circuit-Breakern samt Telemetrie für Actuator & Micrometer.
- **Laufzeitverhalten**: Schaltet bei Schwellenüberschreitung auf OPEN (HTTP 503) und aktualisiert den Circuit-Breaker-Gauge.
- **Verwendung**: Auf Controllern/Methoden anbringen, die externe APIs oder AI-Provider aufrufen.
- **Wann verwenden**: Wenn bei externen Ausfällen sofort `HTTP 503` geliefert werden soll statt auf Timeouts zu warten.
- **Wann NICHT verwenden & Fallstricke**: `CircuitBreakerErrorFilterUtil` ignoriert 4xx-`BaseBusinessException` automatisch; Client-Fehler nicht in `RuntimeException` verpacken.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"payment-gateway-cb"`); `""` verwendet die Standardkonvention.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Name des Resilience4j-CircuitBreakers.<br/>*Hinweis:* Kennzeichnet die Resilience4j-Instanz und das Micrometer-Tag; `""` leitet den Namen von der Klasse ab. |
| `failureRateThreshold` | `float` | `50.0f` | Nein (Optional) | Positive Zahl (`1.0f .. 100.0f`) in Prozent; z. B. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Fehlerprozentsatz zum Öffnen des Schalters (Standard 50.0f).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: 4xx-Fachfehler (`BaseBusinessException`) werden ignoriert; nur 5xx-/Infrastrukturfehler öffnen den Circuit Breaker. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Nein (Optional) | Positive Zahl (`>= 1`) in Sekunden; z. B. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Abkühlsekunden im Zustand OPEN (HTTP 503) vor HALF_OPEN (10).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: 4xx-Fachfehler (`BaseBusinessException`) werden ignoriert; nur 5xx-/Infrastrukturfehler öffnen den Circuit Breaker. |
| `slidingWindowSize` | `int` | `20` | Nein (Optional) | Positive Zahl (`>= 1`) in Aufrufe; z. B. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Anzahl erfasster Aufrufe im Sliding Window (20).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: 4xx-Fachfehler (`BaseBusinessException`) werden ignoriert; nur 5xx-/Infrastrukturfehler öffnen den Circuit Breaker. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Nein (Optional) | Positive Zahl (`>= 1`) in Aufrufe; z. B. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Erlaubte Probeaufrufe im Zustand HALF_OPEN (5).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: 4xx-Fachfehler (`BaseBusinessException`) werden ignoriert; nur 5xx-/Infrastrukturfehler öffnen den Circuit Breaker. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Wiederholt vorübergehende Fehler automatisch mit konfigurierbarem exponentiellem Backoff.
- **Laufzeitverhalten**: Wirft nach Ausschöpfen aller konfigurierten Versuche eine standardisierte Exception.
- **Verwendung**: Auf Controllern oder Methoden für automatisches Wiederholen bei transienten DB-/Netzwerkstörungen.
- **Wann verwenden**: Für idempotente GET-Aufrufe, PUTs oder per `@Idempotent` geschützte Vorgänge.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS auf nicht-idempotenten POST-Erstellungen oder Zahlungen ohne `@Idempotent` einsetzen!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"erp-sync-retry"`); `""` verwendet die Standardkonvention.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Name der Retry-Instanz in Resilience4j.<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: Gesamtdauer aller Versuche muss unter dem Gateway-Timeout bleiben. |
| `maxAttempts` | `int` | `3` | Nein (Optional) | Positive Zahl (`>= 1`) in Versuche; z. B. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Gesamtzahl der Versuche inkl. Erstaufruf (3).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: Gesamtdauer aller Versuche muss unter dem Gateway-Timeout bleiben. |
| `waitDurationMs` | `long` | `500L` | Nein (Optional) | Positive Zahl (`>= 50`) in Millisekunden; z. B. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Anfangsverzögerung in ms vor dem ersten Retry (500L).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: Gesamtdauer aller Versuche muss unter dem Gateway-Timeout bleiben. |
| `backoffMultiplier` | `double` | `2.0d` | Nein (Optional) | Positive Zahl (`>= 1.0d`) in Multiplikator; z. B. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Exponentieller Backoff-Multiplikator zwischen Retries (2.0d).<br/>*Hinweis:* Sorgfältig auf das Produktions-Latenz-SLA abstimmen: Gesamtdauer aller Versuche muss unter dem Gateway-Timeout bleiben. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Package**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Berechnet schwache RFC-7232-ETags (W/"...") und liefert Cache-Control sowie HTTP 304 Not Modified Antworten.
- **Laufzeitverhalten**: Erfasst HIT/MISS-Zähler in der Metrik nwvmc.cache.http.requests.
- **Verwendung**: Auf Read-Only-Controllern oder GET-Methoden für RFC-konformes `ETag` und `304 Not Modified`.
- **Wann verwenden**: Für halbstabile Kataloge, Stammdaten und öffentliche Listen zur Bandbreiteneinsparung via `304`.
- **Wann NICHT verwenden & Fallstricke**: NIEMALS `isPrivate = false` bei PII, Mandanten- oder rollenmaskierten Daten belassen!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Nein (Optional) | Positive Zahl (`>= 0`) in Sekunden; z. B. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | HTTP Cache-Control `max-age` in Sekunden (Standard 60).<br/>*Hinweis:* Sendet `Cache-Control: max-age=<N>`. Wert `0` mit `generateETag = true` erzwingt sofortige `304`-Revalidierung. |
| `isPrivate` | `boolean` | `false` | Nein (Optional) | `true` (nur privater Browser-Cache; für CDNs gesperrt) oder `false` (öffentlicher Cache für Proxys und CDNs).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true sendet `private` (kein CDN); false sendet `public`.<br/>*Hinweis:* KRITISCH: Bei authentifizierten oder mandantenbezogenen Endpunkten stets `isPrivate = true` setzen, um CDN-Datenlecks zu verhindern. |
| `mustRevalidate` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Hängt `, must-revalidate` an zur strikten Revalidierung nach Ablauf.<br/>*Hinweis:* Verhindert, dass Caches nach Ablauf von `maxAgeSeconds` veraltete Antworten ohne Rückfrage ausliefern. |
| `generateETag` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Berechnet SHA-256-ETag und liefert bei passendem `If-None-Match` `HTTP 304`.<br/>*Hinweis:* Berechnet ein RFC-7232-`ETag` und antwortet bei passendem `If-None-Match` mit `304 Not Modified` (0 Bytes). |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Cached serverseitige Leseergebnisse in Caffeine L1 / Redis L2 Engines.
- **Laufzeitverhalten**: Global konfigurierbar über app.framework.cache.type.
- **Verwendung**: Auf Lesemethoden anbringen; Engine wird via `app.framework.cache.type` konfiguriert.
- **Wann verwenden**: Bei stark leselastigen ID-Lookups oder Metadaten-Abfragen (hohe Read/Write-Ratio).
- **Wann NICHT verwenden & Fallstricke**: KEINE veränderlichen Entitäten ungeklont cachen und keine schreibintensiven Tabellen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Logische Cache-Namen in Caffeine L1 oder Redis L2.<br/>*Hinweis:* Regionennamen müssen zur Caffeine/Redis-Konfiguration passen; jede Schreiboperation mit `@AutoCacheEvict` koppeln. |
| `key` | `String` | `""` | Nein (Optional) | SpEL-Ausdruck mit Methodenparametern (z. B. `"'product:' + #id"`) oder `""` für automatische Schlüsselbildung.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL-Schlüsselausdruck (v0.1.0 löst `EntityName:id` deterministisch auf).<br/>*Hinweis:* In Multi-Tenant-Apps stets die Mandanten-ID im Cache-Schlüssel aufnehmen. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Entfernt veraltete serverseitige Cache-Einträge bei Mutationen.
- **Laufzeitverhalten**: Wird nach der Mutation sauber ausgeführt ohne veraltete Lese-Slices.
- **Verwendung**: Auf Update-/Delete-Methoden passend zum Key von `@AutoCacheable` einsetzen.
- **Wann verwenden**: Immer wenn Updates oder Löschungen per `@AutoCacheable` gecachte Datensätze verändern.
- **Wann NICHT verwenden & Fallstricke**: Vermeiden Sie `allEntries = true` bei häufigem `create` (Gefahr eines Cache Stampede).

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Namen der zu bereinigenden Caches nach Methodenende.<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `value`-Werte brechen sofort per Fail-Fast ab. |
| `key` | `String` | `""` | Nein (Optional) | SpEL-Ausdruck mit Methodenparametern (z. B. `"'product:' + #id"`) oder `""` für automatische Schlüsselbildung.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | SpEL-Ausdruck zur gezielten Entfernens genau des geänderten Eintrags.<br/>*Hinweis:* Muss exakt denselben Schlüssel wie `@AutoCacheable.key` liefern; bei `allEntries = true` ignoriert. |
| `allEntries` | `boolean` | `false` | Nein (Optional) | `true` (alle Einträge der Cache-Region leeren) oder `false` (nur den einzelnen über key ermittelten Eintrag entfernen).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Bei true werden nur Einträge mit dem Entitäts-Präfix entfernt.<br/>*Hinweis:* Das komplette Leeren unter hoher Last kann einen Cache-Stampede auslösen; gezielte `key`-Invalidierung bevorzugen. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Misst die Ausführungsdauer und schreibt WARN-Logs bei Überschreitung des Schwellwerts.
- **Laufzeitverhalten**: Speist zudem Latenz-Timer über DynamicEntityMetricsHelper.
- **Verwendung**: Auf Controllern oder Services platzieren, um langsame Pfade automatisch zu loggen.
- **Wann verwenden**: Für komplexe Reports, Batch-Endpunkte, GraphQL und `@CustomQuery` zur Frühwarnung bei Slow-Queries.
- **Wann NICHT verwenden & Fallstricke**: KEINE `warningThresholdMs <= 0`-Werte in Produktiv-Hot-Paths und nicht auf langen SSE-Streams nutzen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Nein (Optional) | Positive Zahl (`>= 1`) in Millisekunden; z. B. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Schwellenwert in Millisekunden für `WARN`-Logs bei langsamer Ausführung (500L).<br/>*Hinweis:* Schreibt ein strukturiertes `WARN`-Log mit `traceId` bei Überschreitung; realistisch (`200L–1000L`) gegen Log-Flut wählen. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Package**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Zweck**: Sendet nach Commit asynchron HMAC-SHA256-signierte Webhooks auf Virtual Threads.
- **Laufzeitverhalten**: Berechnet Signaturen in WebhookHmacSignerHelper mit konstanter Vergleichszeit.
- **Verwendung**: Auf JPA-Entitäten platzieren; Versand erfolgt asynchron erst nach erfolgreichem DB-Commit.
- **Wann verwenden**: Zum Benachrichtigen externer Partner, ERPs oder SaaS-Mandanten unmittelbar nach Commit.
- **Wann NICHT verwenden & Fallstricke**: Bei strengen PII-/PCI-Daten `includeFullPayload = false` wählen und keine internen SSRF-Ziele zulassen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Nein (Optional) | Array mit null oder mehr gültigen Werten: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Lebenszyklus-Events, die HMAC-signierte Webhooks auslösen.<br/>*Hinweis:* Wird asynchron nach Transaktions-Commit (`AFTER_COMMIT`) versendet, sodass Rollbacks nie Phantom-Webhooks auslösen. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Nein (Optional) | Gültiger HTTP-Header-Name (auf Netzwerkebene unabhängig von Groß-/Kleinschreibung, z. B. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HTTP-Header für die HMAC-SHA256-Signatur.<br/>*Hinweis:* Überträgt die HMAC-SHA256-Signatur; Empfänger müssen diesen Header vor Verarbeitung zeitkonstant prüfen. |
| `includeFullPayload` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@EntityWebhook(includeFullPayload = false)` | true sendet vollständiges JSON; false nur Entitäts-ID und Event-Metadaten.<br/>*Hinweis:* Bei sensiblen PII-/Finanzdaten auf `false` setzen (nur ID + Eventtyp), sodass Empfänger per authentifiziertem GET abrufen. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Package**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Veröffentlicht CNCF CloudEvents v1.0 Umschläge nach dem Transaktions-Commit.
- **Laufzeitverhalten**: Nutzt TransactionRuntimeBridge.executeAfterCommit zur Vermeidung von Phantom-Events.
- **Verwendung**: Auf Entitäten/Methoden platzieren; Consumer hören `AFTER_COMMIT` auf `CloudEventEnvelopeDto`.
- **Wann verwenden**: Für saubere Entkopplung zwischen Bounded Contexts ohne modulübergreifende SQL-JOINs.
- **Wann NICHT verwenden & Fallstricke**: NICHT mit externen `@EntityWebhook` verwechseln und Consumer stets auf `AFTER_COMMIT` hängen.

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Nein (Optional) | Nicht-leere Kennung (z. B. `"com.acme.order.lifecycle"`); `""` verwendet die Standardkonvention.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` (z. B. "io.nwvmc.order.created").<br/>*Hinweis:* Reverse-DNS-Format nach CloudEvents 1.0 (`com.company.domain.event`) verwenden; `""` generiert automatisch. |
| `source` | `String` | `""` | Nein (Optional) | Gültiger HTTP-Pfad mit führendem `/` (z. B. `/services/order-api`) oder leerer String `""` für automatische Ableitung.<br/>`@PublishCloudEvent(source = "/services/order-api")` | CloudEvents `source`-URI des auslösenden Bounded Contexts.<br/>*Hinweis:* Füllt das CNCF-CloudEvents-Attribut `source` für microservice-übergreifendes Event-Tracing. |
| `publishOnCreate` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Sendet CloudEvent nach Create-Commit (true).<br/>*Hinweis:* Wird erst nach dem Commit (`AFTER_COMMIT`) über Spring Events / Kafka / RabbitMQ veröffentlicht. |
| `publishOnUpdate` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Sendet CloudEvent nach Update-Commit (true).<br/>*Hinweis:* Bei sehr häufig aktualisierten Entitäten auf `false` setzen, um Message-Broker nicht zu überfluten. |
| `publishOnDelete` | `boolean` | `true` | Nein (Optional) | `true` (aktiviert) oder `false` (deaktiviert).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Sendet CloudEvent nach Delete-Commit (true).<br/>*Hinweis:* Feuert bei Hard-Delete wie bei `@SoftDelete`, damit nachgelagerte Read-Models synchron bleiben. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Bindet Entitäts- oder Abfrageoperationen an einen benannten logischen DataSource-Schlüssel.
- **Laufzeitverhalten**: Erfasst Routing-Zähler unter framework.datasource.routing.total.
- **Verwendung**: Auf Controllern oder nicht-finalen Services anbringen; Vorheriger Kontext wird im `finally` wiederhergestellt.
- **Wann verwenden**: Für CQRS-Read-Replica-Offloading, schwere BI-Reports oder Multi-Datasource-Pools.
- **Wann NICHT verwenden & Fallstricke**: NICHT mitten in einer bereits offenen `@Transactional`-Verbindung umschalten und niemals auf `final`-Klassen!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Nein (Optional) | Einer der unterstützten Werte: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Routing-Schlüssel im `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Hinweis:* Muss einem registrierten Schlüssel in `DynamicRoutingDataSource` entsprechen; unbekannte fallen auf `PRIMARY` zurück. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Zweck**: Weist je Entität Datenbank-Engine-Familie und logischen Cluster-Shard zu.
- **Laufzeitverhalten**: Wird dynamisch durch MultiPlatformDataSourceRegistryHelper und TenantDatabaseRoutingResolverHelper aufgelöst.
- **Verwendung**: Auf spezialisierten Entitäten oder Methoden zur Deklaration der Datenbank-Affinität anbringen.
- **Wann verwenden**: In Polyglot- oder Sharding-Architekturen mit dedizierten Finanz-, Analytics- und Audit-Clustern.
- **Wann NICHT verwenden & Fallstricke**: Ersetzt KEINE JDBC-Pool-Konfiguration; keine SQL-JOINs über verschiedene Cluster hinweg!

| Attribut | Java-Typ | Standardwert | Pflicht | Zulässige Werte & Beispiel | Beschreibung & Laufzeithinweise |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Nein (Optional) | Einer der unterstützten Werte: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Datenbank-Engine-Affinität ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `platform`-Werte brechen sofort per Fail-Fast ab. |
| `cluster` | `String` | `"PRIMARY"` | Nein (Optional) | Einer der unterstützten Werte: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Ziel-Cluster/Shard ("PRIMARY", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER").<br/>*Hinweis:* Wird beim Anwendungsstart geprüft; Tippfehler oder ungültige `cluster`-Werte brechen sofort per Fail-Fast ab. |
| `readOnly` | `boolean` | `false` | Nein (Optional) | `true` (an Read-Only-Replikat-Pool routen) oder `false` (an Lese-/Schreib-Master-Pool routen).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Bei true wird Routing zu Read-Only-Replikas bevorzugt.<br/>*Hinweis:* Niemals `readOnly = true` bei Schreiboperationen setzen — Lese-Replikate weisen Schreibzugriffe ab. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
