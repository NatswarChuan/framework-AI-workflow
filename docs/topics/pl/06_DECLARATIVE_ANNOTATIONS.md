# 06. Pełna specyfikacja wszystkich 60 adnotacji deklaratywnych (`0.1.0`)

> **Języki**: **Polski** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#annotations)

Wyczerpująca dokumentacja techniczna wszystkich **60 adnotacji deklaratywnych** w `io.github.natswarchuan:spring-nwvmc:0.1.0`, wyodrębniona bezpośrednio z deklaracji Java `@interface`: dokładny pakiet, `@Target`, **każdy atrybut**, typ Java, wartość domyślna, wymagalność, **jak używać**, **kiedy używać**, **kiedy NIE używać i typowe pułapki**, wraz ze zweryfikowanymi przykładami w Javie.

## Szybki indeks (60 adnotacji)

| Adnotacja | Kategoria | `@Target` | Podsumowanie atrybutów | Główne zastosowanie |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Przekształca interfejs rozszerzający AutoApiController<E> w dynamiczne proxy JDK rejestrujące 40 kontraktów (38 widocznych domyślnie w Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Przekierowuje pojedynczy kontrakt kontrolera do niestandardowej metody beana Spring przez MethodHandleCacheUtil. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Wiąże dedykowane ścieżki domenowe (kasa, zwrot, akceptacja) z niezależnymi beanami Spring @Component Helper. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Czysto javowy zamiennik @GetMapping bez statycznych importów Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Deklaracja trasy HTTP POST w czystej Javie obsługująca własne typy consumes/produces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Mapowanie HTTP PUT w czystej Javie do pełnej podmiany zasobu. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Deklaracja HTTP PATCH w czystej Javie obsługująca częściowe scalanie, atomowe przyrosty i RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Deklaracja HTTP DELETE w czystej Javie uruchamiająca miękkie usuwanie z kontrolą stanu. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Wiąże parametry zapytania URL lub dynamiczne mapy filtrów Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Wiąże zmienne ścieżki URI, takie jak identyfikatory UUIDv7 encji. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Deserializuje ładunki JSON żądań HTTP do parametrów DTO lub Encji wraz z @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Umożliwia rekurencyjną nawigację po relacjach podrzędnych przez GET /{id}/{relation}/** z ochroną przed cyklami. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Deklaruje domenowe przejścia stanów lub korekty liczbowe na niestandardowych metodach akcji. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Znacznik komponentu rejestrowany przy starcie bez importu @Component w czasie kompilacji. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Stereotyp warstwy serwisowej dla klas ServiceImpl współpracujących z @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Deklaruje zarządzane metody fabrykujące beany wewnątrz klas @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Oznacza klasy konfiguracyjne oraz modele wiązania właściwości YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Kontroluje kolejność priorytetów wykonania między beanami SPI Customizer a łańcuchami filtrów. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Egzekwuje RBAC NIST Poziomu 2, izolację ownerField oraz kody uprawnień przed zapytaniami i zmianami. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Dynamicznie maskuje lub zeruje wrażliwe kolumny przy braku wymaganych ról. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Wymusza dozwolone przejścia przez POST /{id}/transition i ogranicza DELETE /{id} do deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Kompiluje czytelne klauzule polityk w aktywne reguły RBAC, przejść stanów i maskowania. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Rejestruje różnice na poziomie pól między zmianami na potrzeby Time-Travel i inspekcji /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Automatycznie izoluje zapytania i mutacje wierszy według aktywnego najemcy, chyba że użytkownik ma rolę obejścia. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Weryfikuje unikalność przed zapisem podczas tworzenia, aktualizacji i operacji upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Automatycznie generuje unikalne kody biznesowe z prefiksem podczas tworzenia lub klonowania, jeśli pole jest puste. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Automatycznie generuje znormalizowane przyjazne dla URL slugi ASCII z pola sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Wylicza pochodne sumy liczbowe przed zapisem zmian encji. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Pozwala wiązać własne zapytania SQL/JPQL lub metody dostawców z endpointami kontrolera. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Wskazuje encję JPA jako tabelę katalogu ról RBAC opartego na bazie danych. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje kolumnę unikalnego kodu roli wewnątrz encji @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identyfikuje pole czytelnej nazwy wyświetlanej roli w encji @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Oznacza pole kolekcji lub tekstu CSV przechowujące kody uprawnień przypisane do roli. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Oznacza encję JPA przechowującą uprawnienia zasób-akcja oraz dynamiczne reguły maskowania pól. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Wskazuje pole unikalnego identyfikatora uprawnienia w encji @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje nazwę docelowej encji lub zasobu API (lub symbol *) w @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje czasownik akcji CRUD lub niestandardowej chroniony przez @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Deklaruje pola encji oddzielone przecinkami, które mają być dynamicznie maskowane przez tę regułę. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Mapuje encję JPA wiążącą uwierzytelnione podmioty z rolami DB i opcjonalnym zakresem najemcy. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identyfikuje pole podmiotu / nazwy użytkownika w encji @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Wiąże kolumnę przypisanego kodu roli w encji @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ogranicza przypisanie @SecurityUserRoleEntity do wskazanego najemcy (lub * globalnie). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Oznacza encję JPA przechowującą jawne polityki ALLOW / DENY uporządkowane według priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje wzorzec docelowego zasobu w encji @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje chroniony typ operacji (READ, WRITE, DELETE, methodName, *) w @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Mapuje kolekcję lub listę ról objętą regułą @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Określa wynik decyzji polityki (ALLOW lub DENY) w regule @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serializuje równoległy dostęp po kluczach SpEL w mapie AST (domyślnie waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Zapobiega równoległym lub ponawianym duplikatom zapisu w konfigurowalnych oknach TTL. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Egzekwuje limitowanie żądań z przesuwnym oknem według partycji IP, Użytkownika lub Najemcy. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Otacza operacje wyłącznikami Resilience4j Circuit Breaker raportującymi telemetrię do Actuatora i Micrometera. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Automatycznie ponawia tymczasowe błędy z konfigurowalnym wykładniczym opóźnieniem. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Wylicza słabe ETag RFC 7232 (W/"...") i zwraca nagłówek Cache-Control oraz odpowiedzi HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Buforuje wyniki metod odczytu po stronie serwera w silnikach Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Usuwa nieaktualne wpisy pamięci podręcznej serwera po operacjach zapisu. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Mierzy czas wykonania i zapisuje logi WARN po przekroczeniu progu powolnych wywołań. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Wysyła asynchroniczne webhooki podpisane HMAC-SHA256 na Virtual Threads po zatwierdzeniu transakcji. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Publikuje koperty CNCF CloudEvents v1.0 po zatwierdzeniu transakcji. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Przypina operacje encji lub zapytań do nazwanego klucza źródła danych. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Przypisuje rodzinę silnika bazy danych oraz logiczny shard klastra dla danej encji. |

---

## 1. Routing, dynamiczne kontrakty API, separacja DTO i wiązanie parametrów (13 Adnotacji)

### `@AutoRestController`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Cel**: Przekształca interfejs rozszerzający AutoApiController<E> w dynamiczne proxy JDK rejestrujące 40 kontraktów (38 widocznych domyślnie w Swagger UI).
- **Zachowanie w czasie wykonania**: DynamicControllerProxyRegistrarHelper skanuje kontrolery przy starcie i rejestruje trasy w RequestMappingHandlerMapping.
- **Jak używać**: Umieść na interfejsie Java dziedziczącym `AutoApiController<E>` lub `AutoReadApi<E>`, definiując `basePath`, DTO oraz wykluczenia.
- **Kiedy używać**: Stosuj przy szybkim wystawianiu standardowych endpointów CRUD, filtrowania, paginacji keyset lub API tylko do odczytu dla encji JPA.
- **Kiedy NIE używać i pułapki**: NIE stosuj na konkretnych klasach `@RestController` ani bez encji JPA; dla publicznych katalogów wybierz `AutoReadApi<E>` zamiast pełnego `AutoApiController<E>`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Nie (Opcjonalny) | Poprawna ścieżka HTTP zaczynająca się od `/` (np. `/api/v1/product-catalogs`) lub pusty ciąg `""` dla automatycznego wyliczenia.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Jawna ścieżka bazowa URI (np. "/api/v1/product-catalogs"). Pusta oznacza wyliczenie w kebab-case.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `basePath` przed `path`. Unikaj sprzecznych wartości w obu polach. |
| `path` | `String` | `""` | Nie (Opcjonalny) | Poprawna ścieżka HTTP zaczynająca się od `/` (np. `/api/v1/orders`) lub pusty ciąg `""` dla automatycznego wyliczenia.<br/>`@AutoRestController(path = "/api/v1/orders")` | Alias dla ścieżki bazowej. Zaleca się użycie basePath, który ma pierwszeństwo przy rejestracji.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `basePath` przed `path`. Unikaj sprzecznych wartości w obu polach. |
| `entityName` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"ProductCatalog"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Nadpisuje nazwę encji wyświetlaną w metadanych OpenAPI/Studio.<br/>*Uwaga:* Widoczne bezpośrednio w Swagger / OpenAPI 3.0 i NWVMC Studio; wydziel napisy do `OpenApiConstant` zamiast hardkodować. |
| `enabledEndpoints` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Biała lista dozwolonych nazw metod kontraktu (np. "getPage", "create"). Pusta włącza wszystkie.<br/>*Uwaga:* Działa jak ścisła biała lista: gdy jest niepusta, wszystkie niewymienione metody znikają ze Spring MVC i Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Czarna lista metod wyłączanych przed rejestracją tras Spring MVC.<br/>*Uwaga:* Oceniane po `enabledEndpoints`; służy do blokowania operacji usuwania i wsadowych przy zachowaniu pozostałych kontraktów. |
| `enableNestedSubResources` | `boolean` | `false` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Włącza rekurencyjną nawigację GET /{id}/**. Domyślnie false, aby uniknąć nadmiaru tras.<br/>*Uwaga:* Zostaw `false`, jeśli nie potrzebujesz `GET /{id}/items/...`; po włączeniu ogranicz relacje przez `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `ProductReadDto.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | Opcjonalne DTO odczytu ukrywające wewnętrzne pola encji; Void.class zwraca encję.<br/>*Uwaga:* Działa wyłącznie w potoku odczytu (GET); klasa DTO wymaga bezargumentowego konstruktora/getterów oraz wspiera `@Valid`. |
| `createDto` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `ProductCreateDto.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | Opcjonalne DTO wejściowe walidowane przed mapowaniem POST na encję E.<br/>*Uwaga:* Działa wyłącznie w potoku tworzenia (POST); klasa DTO wymaga bezargumentowego konstruktora/getterów oraz wspiera `@Valid`. |
| `updateDto` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `ProductUpdateDto.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | Opcjonalne DTO aktualizacji ograniczające modyfikowalne pola w żądaniach PUT/PATCH.<br/>*Uwaga:* Działa wyłącznie w potoku aktualizacji (PUT/PATCH); klasa DTO wymaga bezargumentowego konstruktora/getterów oraz wspiera `@Valid`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Przekierowuje pojedynczy kontrakt kontrolera do niestandardowej metody beana Spring przez MethodHandleCacheUtil.
- **Zachowanie w czasie wykonania**: EscapeHatchDispatchHelper odnajduje docelowy bean i buforuje MethodHandle w MethodHandleCacheUtil.
- **Jak używać**: Oznacz metodę kontrolera `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` dla klasy `@Service`/`@Component`.
- **Kiedy używać**: Użyj, gdy większość tras działa automatycznie, ale pojedyncza metoda wymaga własnej logiki Java.
- **Kiedy NIE używać i pułapki**: NIE przekazuj tekstu do `targetBean` (wymaga `Class<?>`; do nazwy służy `beanName`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `OrderCustomService.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Docelowa klasa beana Spring (ma pierwszeństwo przed beanName).<br/>*Uwaga:* Przy starcie rejestrator sprawdza `targetBean` przed `beanName`. Unikaj sprzecznych wartości w obu polach. |
| `beanName` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa beana w ApplicationContext (np. `"orderCustomService"`) lub `""` dla automatycznego wyszukania.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Jawna nazwa beana w kontenerze Spring używana, gdy targetBean to Void.class.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `targetBean` przed `beanName`. Unikaj sprzecznych wartości w obu polach. |
| `methodName` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"createOrder"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nazwa metody w docelowym beanie; pusta oznacza nazwę metody z kontrolera.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"createOrder"`); niezgodność wywoła błąd runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Nie (Opcjonalny) | `true` (omiń domyślne proxy i wywołaj docelowy bean bezpośrednio) lub `false` (uruchom wspólnie z domyślnym dispatch).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Gdy true, całkowicie pomija domyślny dispatch CRUD i wywołuje bean przez MethodHandle.<br/>*Uwaga:* Gdy `true` (domyślnie), wbudowany CRUD jest pomijany, a bean sam zarządza transakcją. Ustaw `false` tylko dla dodatkowych hooków. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Wiąże dedykowane ścieżki domenowe (kasa, zwrot, akceptacja) z niezależnymi beanami Spring @Component Helper.
- **Zachowanie w czasie wykonania**: Wywołuje delegateBean.delegateMethod przez buforowany MethodHandle z pełną walidacją i obsługą transakcji.
- **Jak używać**: Zadeklaruj metodę w interfejsie z `path`, `httpMethod`, `delegateBean` i `delegateMethod` wskazującymi na bean pomocniczy Springa.
- **Kiedy używać**: Stosuj do dedykowanych akcji domenowych, takich jak realizacja zamówienia, zwrot płatności czy transakcje wieloencyjne.
- **Kiedy NIE używać i pułapki**: NIE polegaj tu na interceptorach proxy (`ControllerProxySpecialRouteUtil` omija `invokeProtectedOperation`) — AOP/bezpieczeństwo przenieś do docelowego `@Service`, a do prostych przejść użyj `@BusinessAction`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/reports/monthly-sales`); `""` mapuje się na ścieżkę główną.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Ścieżka względna względem basePath kontrolera (np. "/checkout").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `path` powodują natychmiastowe przerwanie (fail-fast). |
| `httpMethod` | `String` | `"GET"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Metoda HTTP ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `httpMethod` powodują natychmiastowe przerwanie (fail-fast). |
| `delegateBean` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa beana w ApplicationContext (np. `"orderReportService"`) lub `""` dla automatycznego wyszukania.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nazwa beana Spring realizującego logikę (wymagana, chyba że użyto metody default lub @ServiceOverride).<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `delegateBean` powodują natychmiastowe przerwanie (fail-fast). |
| `delegateMethod` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"buildMonthlyReport"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nazwa metody na delegateBean; pusta przyjmuje nazwę z kontrolera.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"buildMonthlyReport"`); niezgodność wywoła błąd runtime. |
| `summary` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"Get monthly revenue breakdown"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Krótkie podsumowanie OpenAPI 3.0 w Swagger UI.<br/>*Uwaga:* Widoczne bezpośrednio w Swagger / OpenAPI 3.0 i NWVMC Studio; wydziel napisy do `OpenApiConstant` zamiast hardkodować. |
| `description` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"Aggregates confirmed invoice totals grouped by currency"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Szczegółowy opis OpenAPI 3.0 po rozwinięciu punktu końcowego w Swagger UI.<br/>*Uwaga:* Widoczne bezpośrednio w Swagger / OpenAPI 3.0 i NWVMC Studio; wydziel napisy do `OpenApiConstant` zamiast hardkodować. |

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

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Czysto javowy zamiennik @GetMapping bez statycznych importów Spring Web.
- **Zachowanie w czasie wykonania**: Mapowany jako RequestMappingInfo HTTP GET podczas uruchamiania proxy.
- **Jak używać**: Dodaj `@AutoGet("/sciezka")` na metodzie interfejsu `@AutoRestController` (często z `@ServiceOverride` lub `@CustomQuery`).
- **Kiedy używać**: Użyj do definiowania tras GET bez importowania Springowego `@GetMapping` w interfejsie kontrolera.
- **Kiedy NIE używać i pułapki**: NIE używaj dla operacji mutujących dane (stosuj `@AutoPost`/`@AutoDelete`) ani w zwykłych klasach `@RestController`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/{id}/summary`); `""` mapuje się na ścieżkę główną.<br/>`@AutoGet("/{id}/summary")` | Względny szablon ścieżki GET (np. "/metrics"). Puste mapuje na główny basePath.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `produces` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json", "text/csv"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Opcjonalne typy MIME odpowiedzi (np. "text/event-stream", "text/csv").<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Accept`; niezgodność zwraca `406` lub `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Deklaracja trasy HTTP POST w czystej Javie obsługująca własne typy consumes/produces.
- **Zachowanie w czasie wykonania**: Rejestrowany jako handler HTTP POST w SpringMvcEndpointBridge.
- **Jak używać**: Oznacz metodę tworzącą lub akcję `@AutoPost("/sciezka")`, wiążąc ciało przez `@AutoBody`/`@RequestBody` oraz `@BusinessAction`/`@ServiceOverride`.
- **Kiedy używać**: Stosuj przy tworzeniu zasobów, wywoływaniu komend biznesowych lub wysyłce wsadowej przez POST.
- **Kiedy NIE używać i pułapki**: NIE stosuj do odczytu (`@AutoGet`), pełnej podmiany (`@AutoPut`), łat (`@AutoPatch`) ani usuwania (`@AutoDelete`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/{id}/approve`); `""` mapuje się na ścieżkę główną.<br/>`@AutoPost("/{id}/approve")` | Względny szablon ścieżki POST w ramach basePath.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `consumes` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json", "multipart/form-data"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Akceptowane typy Content-Type żądania.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Content-Type`; niezgodność zwraca `406` lub `415`. |
| `produces` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Zwracane typy MIME odpowiedzi.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Accept`; niezgodność zwraca `406` lub `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Mapowanie HTTP PUT w czystej Javie do pełnej podmiany zasobu.
- **Zachowanie w czasie wykonania**: Wiązany jako handler HTTP PUT otoczony wykonaniem transakcyjnym.
- **Jak używać**: Umieść `@AutoPut("/{id}")` na metodzie pełnej aktualizacji z `@AutoVariable` i `@AutoBody`.
- **Kiedy używać**: Użyj do idempotentnego, pełnego nadpisania zasobu.
- **Kiedy NIE używać i pułapki**: NIE stosuj do częściowych aktualizacji pól (`@AutoPatch` lub `@BusinessAction`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/{id}/replace`); `""` mapuje się na ścieżkę główną.<br/>`@AutoPut("/{id}/replace")` | Względny szablon ścieżki PUT (np. "/{id}").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `consumes` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Obsługiwane typy Content-Type żądania.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Content-Type`; niezgodność zwraca `406` lub `415`. |
| `produces` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Zwracane typy MIME odpowiedzi.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Accept`; niezgodność zwraca `406` lub `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Deklaracja HTTP PATCH w czystej Javie obsługująca częściowe scalanie, atomowe przyrosty i RFC 6902 JSON Patch.
- **Zachowanie w czasie wykonania**: Obsługuje semantykę scalania JSON oraz application/json-patch+json.
- **Jak używać**: Oznacz metodę częściowej aktualizacji lub `@BusinessAction` za pomocą `@AutoPatch("/{id}/akcja")`.
- **Kiedy używać**: Użyj do częściowych modyfikacji, atomowych zmian liczb oraz przejść stanów (`@BusinessAction`).
- **Kiedy NIE używać i pułapki**: NIE stosuj, gdy wymagana jest pełna podmiana encji (`@AutoPut`) lub jej utworzenie (`@AutoPost`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/{id}/status`); `""` mapuje się na ścieżkę główną.<br/>`@AutoPatch("/{id}/status")` | Względny szablon ścieżki PATCH (np. "/{id}/approve").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `consumes` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json", "application/merge-patch+json"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Akceptowane typy Content-Type.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Content-Type`; niezgodność zwraca `406` lub `415`. |
| `produces` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica typów MIME (np. `{"application/json"}`); puste `{}` domyślnie używa `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Zwracane typy MIME.<br/>*Uwaga:* Egzekwowane przez negocjację treści Spring MVC na nagłówku `Accept`; niezgodność zwraca `406` lub `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Deklaracja HTTP DELETE w czystej Javie uruchamiająca miękkie usuwanie z kontrolą stanu.
- **Zachowanie w czasie wykonania**: Weryfikuje deletableStates w @StateMachine przed ustawieniem deleted=true.
- **Jak używać**: Umieść `@AutoDelete("/{id}/custom")` na niestandardowej metodzie usuwającej z `@ServiceOverride`.
- **Kiedy używać**: Stosuj do niestandardowej archiwizacji lub kaskadowego czyszczenia przez DELETE.
- **Kiedy NIE używać i pułapki**: NIE redefiniuj usuwania, gdy wystarcza domyślny soft-delete z `@StateMachine`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Względna podścieżka URI z opcjonalnymi zmiennymi `{pathVar}` (np. `/{id}/archive`); `""` mapuje się na ścieżkę główną.<br/>`@AutoDelete("/{id}/archive")` | Względny szablon ścieżki DELETE (np. "/{id}/purge").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Cel**: Wiąże parametry zapytania URL lub dynamiczne mapy filtrów Map<String, String>.
- **Zachowanie w czasie wykonania**: Pobierany przez DynamicQueryParameterParserHelper z walidacją w QueryGuardrailEnforcerUtil.
- **Jak używać**: Umieść na parametrach metody w interfejsie kontrolera.
- **Kiedy używać**: Użyj, aby utrzymać interfejs w 100% Pure Java bez importów Spring Web przy wiązaniu parametrów query.
- **Kiedy NIE używać i pułapki**: NIE używaj dla zmiennych ścieżki (`@AutoVariable`) ani ciała JSON (`@AutoBody`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"status"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoParam("status") String status` | Nazwa parametru zapytania (alias `name`). Pusta oznacza nazwę z kodu bajtowego Javy.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `value` przed `name`. Unikaj sprzecznych wartości w obu polach. |
| `name` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"pageSize"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Jawna nazwa parametru zapytania.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `value` przed `name`. Unikaj sprzecznych wartości w obu polach. |
| `required` | `boolean` | `true` | Nie (Opcjonalny) | `true` (wymagane; brak zwraca HTTP 400) lub `false` (opcjonalne; pominięcie przekazuje null).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Czy brak parametru ma zwracać błąd HTTP 400.<br/>*Uwaga:* Staje się opcjonalne po ustawieniu `defaultValue`; przy `false` używaj typów opakowujących (`Integer`) zamiast prymitywów. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"20"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Wartość domyślna w razie braku parametru; domyślnie wartownik DEFAULT_NONE.<br/>*Uwaga:* Konwertowane ze String przez Spring `ConversionService` na typ docelowy; błędne wartości zwracają HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Cel**: Wiąże zmienne ścieżki URI, takie jak identyfikatory UUIDv7 encji.
- **Zachowanie w czasie wykonania**: Parsowany do typowanych wartości Java UUID/String z szablonów ścieżek MVC.
- **Jak używać**: Umieść na parametrach ścieżki, np. `findById(@AutoVariable("id") UUID id)`.
- **Kiedy używać**: Użyj do wyciągania `{id}`, `{slug}` z URI w interfejsach Pure Java.
- **Kiedy NIE używać i pułapki**: NIE stosuj do parametrów query (`@AutoParam`) ani ciała JSON (`@AutoBody`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"orderId"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoVariable("orderId") UUID orderId` | Nazwa zmiennej ścieżki URI.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `value` przed `name`. Unikaj sprzecznych wartości w obu polach. |
| `name` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"tenantCode"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Jawna nazwa zmiennej ścieżki.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `value` przed `name`. Unikaj sprzecznych wartości w obu polach. |
| `required` | `boolean` | `true` | Nie (Opcjonalny) | `true` (wymagane; brak zwraca HTTP 400) lub `false` (opcjonalne; pominięcie przekazuje null).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Czy zmienna ścieżki jest wymagana.<br/>*Uwaga:* Nazwa musi odpowiadać `{variableName}` w szablonie URI; `false` działa tylko przy opcjonalnych wzorcach ścieżek. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Cel**: Deserializuje ładunki JSON żądań HTTP do parametrów DTO lub Encji wraz z @Valid.
- **Zachowanie w czasie wykonania**: Walidowany za pomocą LocalValidatorFactoryBean przed wejściem do transakcji serwisu.
- **Jak używać**: Umieść `@AutoBody` na parametrze ciała metody `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Kiedy używać**: Użyj do deserializacji JSON do encji lub DTO w kontrolerach Pure Java.
- **Kiedy NIE używać i pułapki**: NIE używaj w metodach GET/DELETE ani wielokrotnie w jednej sygnaturze.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Nie (Opcjonalny) | `true` (wymagane; brak zwraca HTTP 400) lub `false` (opcjonalne; pominięcie przekazuje null).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Czy brak ciała żądania ma powodować błąd HTTP 400.<br/>*Uwaga:* Łącz z `@Valid`, aby uruchomić walidację Jakarta; `false` pozwala na puste ciało żądania bez błędu `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Umożliwia rekurencyjną nawigację po relacjach podrzędnych przez GET /{id}/{relation}/** z ochroną przed cyklami.
- **Zachowanie w czasie wykonania**: Wymaga ustawienia @AutoRestController(enableNestedSubResources = true) na kontrolerze.
- **Jak używać**: Włącz `enableNestedSubResources = true` na kontrolerze i ogranicz relacje za pomocą `@EnableNestedSubResource`.
- **Kiedy używać**: Gdy potrzebujesz zagnieżdżonych URL-i `GET /api/v1/customer-orders/{id}/items` z kontrolą dostępu na każdym poziomie.
- **Kiedy NIE używać i pułapki**: NIE otwieraj bez ograniczenia `allowedRelationships` dla gęstych relacji; do prostego dołączania użyj `?expand=`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Opcjonalna biała lista encji docelowych podczas przeglądania GET /{id}/**.<br/>*Uwaga:* Pusta tablica udostępnia wszystkie encje podrzędne; wymień klasy jawnie, aby chronić tabele wewnętrzne. |
| `allowedRelationships` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Dozwolone nazwy relacji JPA w ścieżkach podzasobów (np. "items", "customer").<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"items"`); niezgodność wywoła błąd runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Deklaruje domenowe przejścia stanów lub korekty liczbowe na niestandardowych metodach akcji.
- **Zachowanie w czasie wykonania**: Wykonywany atomowo tuż przed utrwaleniem zaktualizowanych atrybutów encji.
- **Jak używać**: Połącz `@AutoPatch` z `@BusinessAction(...)` na metodzie interfejsu kontrolera.
- **Kiedy używać**: Do deklaratywnych przejść stanów, zmian liczników lub metod domenowych bez pisania warstwy Service.
- **Kiedy NIE używać i pułapki**: NIE używaj do orkiestracji wielu encji ani wywołań zewnętrznych API (zastosuj `@ServiceOverride`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu statusu cyklu życia (np. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nazwa pola stanu w encji (weryfikowana przez @StateMachine).<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"status"`); niezgodność wywoła błąd runtime. |
| `targetStateValue` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"APPROVED"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Docelowa wartość stanu przypisywana w ramach transakcji.<br/>*Uwaga:* Automatycznie walidowane względem `@StateMachine` lub `@HumanPolicy` przed zapisem; niedozwolone przejście cofa transakcję. |
| `adjustNumericField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu liczbowego (np. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Pole liczbowe aktualizowane atomowo w ramach transakcji.<br/>*Uwaga:* Wymaga `deltaParamIndex >= 0` lub niepustego `fixedDelta`. Obsługuje `Integer`, `Long`, `BigDecimal` i `Double`. |
| `deltaParamIndex` | `int` | `-1` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Indeks parametru (od 0) niosącego wartość delty; -1 wyłącza odczyt z parametrów.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `deltaParamIndex` przed `fixedDelta`. Unikaj sprzecznych wartości w obu polach. |
| `fixedDelta` | `String` | `""` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Stała wartość delta jako tekst (np. "100", "-1") używana bez parametru dynamicznego.<br/>*Uwaga:* Przy starcie rejestrator sprawdza `deltaParamIndex` przed `fixedDelta`. Unikaj sprzecznych wartości w obu polach. |
| `entityMethod` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"markFulfilled"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Bezparametrowa metoda domenowa na encji uruchamiana w tej samej transakcji.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"markFulfilled"`); niezgodność wywoła błąd runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Wykrywanie beanów, wiązanie konfiguracji i kolejność wykonania (5 Adnotacji)

### `@AutoComponent`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Znacznik komponentu rejestrowany przy starcie bez importu @Component w czasie kompilacji.
- **Zachowanie w czasie wykonania**: Skanowany wyłącznie wewnątrz pakietu io.github.natswarchuan; w aplikacjach użyj Spring @Component.
- **Jak używać**: Wewnętrzny stereotyp skanowany przez `AutoBeanFactoryRegistrarBridge` w pakiecie `io.github.natswarchuan`.
- **Kiedy używać**: Stosuj WYŁĄCZNIE wewnątrz kodu bazowego `io.github.natswarchuan.*`.
- **Kiedy NIE używać i pułapki**: NIGDY nie używaj w aplikacjach konsumenckich (`com.example.*`)! Użyj Springowego `@Component`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa beana w ApplicationContext (np. `"invoiceValidationHelper"`) lub `""` dla automatycznego wyszukania.<br/>`@AutoComponent("invoiceValidationHelper")` | Opcjonalna nazwa beana; pusta przyjmuje nazwę klasy w camelCase.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Stereotyp warstwy serwisowej dla klas ServiceImpl współpracujących z @ServiceOverride.
- **Zachowanie w czasie wykonania**: Rejestrowany w io.github.natswarchuan po nazwie klasy; serwisy aplikacji powinny używać Spring @Service.
- **Jak używać**: Wewnętrzny stereotyp serwisu skanowany w `io.github.natswarchuan`.
- **Kiedy używać**: TYLKO dla wewnętrznych serwisów w `io.github.natswarchuan.*`.
- **Kiedy NIE używać i pułapki**: NIGDY w serwisach aplikacyjnych — użyj Springowego `@Service`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa beana w ApplicationContext (np. `"orderFulfillmentService"`) lub `""` dla automatycznego wyszukania.<br/>`@AutoService("orderFulfillmentService")` | Opcjonalna nazwa beana serwisowego.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Deklaruje zarządzane metody fabrykujące beany wewnątrz klas @AutoConfigurationBean.
- **Zachowanie w czasie wykonania**: Przetwarzany przez PureJavaBeanRegistrarBridge podczas autokonfiguracji.
- **Jak używać**: Umieść na metodach fabrykujących wewnątrz klas `@AutoConfigurationBean`.
- **Kiedy używać**: TYLKO w wewnętrznych klasach konfiguracyjnych `io.github.natswarchuan.config.*`.
- **Kiedy NIE używać i pułapki**: NIE używaj we własnych klasach `@Configuration` — stosuj zwykłe `@Bean` Springa.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Jawne nazwy i aliasy beana.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `targetTypeName` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"com.example.spi.PaymentGateway"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Opcjonalna pełna nazwa klasy docelowej.<br/>*Uwaga:* Opcjonalna pełna nazwa FQCN, gdy fabryka zwraca nadtyp lub proxy; klasa musi znajdować się na classpath. |
| `primary` | `boolean` | `false` | Nie (Opcjonalny) | `true` (preferowany bean przy wielu kandydatach) lub `false` (standardowy priorytet).<br/>`@AutoBean(primary = true)` | Oznacza bean jako główny (@Primary) w razie konfliktu kandydatów.<br/>*Uwaga:* Zadeklarowanie dwóch `@AutoBean(primary = true)` dla tego samego typu spowoduje konflikt niejednoznaczności przy starcie. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Oznacza klasy konfiguracyjne oraz modele wiązania właściwości YAML.
- **Zachowanie w czasie wykonania**: Rejestruje beany konfiguracyjne i prefiksy YAML z metadanymi IDE.
- **Jak używać**: Oznacza klasy konfiguracyjne i właściwości w `io.github.natswarchuan.config.*`.
- **Kiedy używać**: TYLKO w bibliotece frameworka jako odpowiednik Pure Java `@Configuration`.
- **Kiedy NIE używać i pułapki**: NIE używaj w konfiguracjach aplikacji — stosuj `@Configuration` Springa.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa beana w ApplicationContext (np. `"storageAutoConfig"`) lub `""` dla automatycznego wyszukania.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Opcjonalny identyfikator beana konfiguracyjnego.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `prefix` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"nwvmc.storage"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Opcjonalny prefiks właściwości YAML wiązany przez `PureJavaBeanRegistrarBridge`.<br/>*Uwaga:* Wiąże właściwości kebab-case z `application.yml`; użyj z `spring-configuration-metadata.json`, aby uniknąć ostrzeżeń IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Cel**: Kontroluje kolejność priorytetów wykonania między beanami SPI Customizer a łańcuchami filtrów.
- **Zachowanie w czasie wykonania**: Mniejsze wartości całkowite wykonują się wcześniej (domyślnie Integer.MAX_VALUE).
- **Jak używać**: Umieść `@OrderPriority(1)` na komponentach lub customizerach wymagających kolejności.
- **Kiedy używać**: Gdy wymagana jest deterministyczna kolejność wielu customizerów SPI.
- **Kiedy NIE używać i pułapki**: NIE myl z kolejnością filtrów Security ani parametrem zapytania `?sort=`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Priorytet wykonania; niższa wartość wykonuje się wcześniej.<br/>*Uwaga:* Mniejsze liczby wykonują się PIERWSZE (jak Spring `@Order`). Zarezerwuj `< 0` dla bezpieczeństwa/śledzenia i `10..100` dla logiki. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Bezpieczeństwo encji, maszyna stanów, integralność, generatory i zapytania (11 Adnotacji)

### `@EntitySecurity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Egzekwuje RBAC NIST Poziomu 2, izolację ownerField oraz kody uprawnień przed zapytaniami i zmianami.
- **Zachowanie w czasie wykonania**: Oceniany przed wykonaniem SQL; brak uprawnień skutkuje HTTP 403 Forbidden.
- **Jak używać**: Umieść na klasie JPA `@Entity`, definiując role oraz opcjonalne `ownerField`.
- **Kiedy używać**: Stosuj na KAŻDEJ wystawionej encji dla spójnej ochrony REST, batch, eksportu i GraphQL.
- **Kiedy NIE używać i pułapki**: NIE włączaj `permitAll = true` na pełnym `AutoApiController<E>` bez `AutoReadApi<E>`, `disabledEndpoints` lub `@SecurityPolicyEntity` (omija kontrolę READ, WRITE i DELETE).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_USER", "ROLE_ADMIN"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Role uprawnione do odczytu rekordów (GET, GraphQL, eksport).<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |
| `writeRoles` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Role uprawnione do zapisu (POST/PUT/PATCH/import).<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |
| `deleteRoles` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Role uprawnione do usuwania (DELETE / batch-delete).<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |
| `permitAll` | `boolean` | `false` | Nie (Opcjonalny) | `true` (zezwól na publiczny dostęp bez uwierzytelniania) lub `false` (wymagaj uwierzytelniania i sprawdzania ról).<br/>`@EntitySecurity(permitAll = true)` | Gdy true (bez nadpisania DB-RBAC), omija kontrole READ, WRITE i DELETE; łącz publiczne katalogi z AutoReadApi<E> lub disabledEndpoints.<br/>*Uwaga:* Pomija sprawdzanie ról i dopuszcza ruch anonimowy. Nigdy nie włączaj dla danych osobowych ani finansowych. |
| `ownerField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu właściciela/UUID (np. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Pole właściciela rekordu ("createdBy"), chroniące przed atakami IDOR.<br/>*Uwaga:* Wymusza filtrowanie właściciela na poziomie wiersza dla `GET`/`PUT`/`PATCH`/`DELETE`, poza rolami z `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Role uprzywilejowane mogące ominąć weryfikację `ownerField`.<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |
| `permissions` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ORDER_READ", "ORDER_APPROVE"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Szczegółowe kody uprawnień sprawdzane obok ról (DB RBAC).<br/>*Uwaga:* Sprawdzane względem szczegółowych uprawnień z JWT lub DB-RBAC `@SecurityPermissionEntity`. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Dynamicznie maskuje lub zeruje wrażliwe kolumny przy braku wymaganych ról.
- **Zachowanie w czasie wykonania**: Stosowany po pobraniu danych, przed serializacją do JSON.
- **Jak używać**: Umieść na wrażliwych polach (`costPrice`, `ssn`); maskowanie działa na izolowanych kopiach.
- **Kiedy używać**: Gdy ten sam model zwracany w REST i GraphQL wymaga maskowania wybranych pól dla części ról.
- **Kiedy NIE używać i pułapki**: Typy nie-`String` są automatycznie zerowane do `null`; ustaw `nullifyInsteadOfMask = true`, aby pola `String` zwracały `null` zamiast `"******"`, lub użyj `readDto` do ukrycia klucza.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Role uprawnione do odczytu niezmienionej wartości pola.<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |
| `maskPattern` | `String` | `"******"` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"***-**-****"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Wzorzec maskujący dla pól tekstowych w razie braku uprawnień.<br/>*Uwaga:* Ignorowane, gdy `nullifyInsteadOfMask = true`. Dla pól niebędących Stringiem (`BigDecimal`, `LocalDate`) użyj `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Nie (Opcjonalny) | `true` (zastąp nieuprawnione pole wartością JSON null) lub `false` (zastosuj maskę maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Gdy true, wymusza null także na polach String zamiast maskPattern (typy inne niż String są automatycznie zerowane).<br/>*Uwaga:* Niezbędne dla liczb, dat i obiektów, aby klienci TypeScript/Zod otrzymywali poprawne `null`. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Wymusza dozwolone przejścia przez POST /{id}/transition i ogranicza DELETE /{id} do deletableStates.
- **Zachowanie w czasie wykonania**: Odrzuca niedozwolone przejścia lub usunięcia wyjątkiem HTTP 422 BusinessRuleViolationException.
- **Jak używać**: Umieść na tekstowym polu stanu, używając dwukropka (`"CREATED:PAID,CANCELLED"`).
- **Kiedy używać**: Do ścisłych maszyn stanów (zamówienia, kredyty, faktury) blokujących nielegalne przejścia kodem `422`.
- **Kiedy NIE używać i pułapki**: NIGDY nie stosuj zapisu `"->"` (`EntityStateMachineUtil` dzieli wyłącznie po `":"`)!

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"CREATED"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Domyślny stan początkowy ustawiany przy tworzeniu encji ("ACTIVE").<br/>*Uwaga:* Ustawiane automatycznie przy `POST`, gdy pole jest puste; musi pasować do stanu przed `:` w `transitions`. |
| `transitions` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Dozwolone przejścia stanów w formacie z dwukropkiem "FROM:TO_1,TO_2".<br/>*Uwaga:* Wymaga dokładnej składni z dwukropkiem `"FROM:TO1,TO2"` (cele po przecinku). Niezadeklarowane przejścia zwracają HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Biała lista stanów zezwalających na DELETE (pozostałe zwracają HTTP 422).<br/>*Uwaga:* Gdy niepuste, `DELETE /{id}` zwraca HTTP `409 Conflict`, jeśli encja znajduje się w innym stanie (np. `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Kompiluje czytelne klauzule polityk w aktywne reguły RBAC, przejść stanów i maskowania.
- **Zachowanie w czasie wykonania**: Dostępny pod GET /human-policy i nadpisywalny w YAML pod spring-nwvmc.human-policies.<Entity>.
- **Jak używać**: Umieść na encji lub w YAML `spring-nwvmc.human-policies`.
- **Kiedy używać**: Gdy zespoły produktowe lub compliance chcą czytelnych reguł w języku naturalnym lub YAML.
- **Kiedy NIE używać i pułapki**: NIE pisz dowolnej prozy ani tekstu w innych językach niż obsługiwane wzorce angielskie.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Dyrektywa cyklu życia w naturalnym języku angielskim.<br/>*Uwaga:* Kompilowane przy starcie do tego samego silnika co `@StateMachine`; nie deklaruj sprzecznych reguł na jednej encji. |
| `security` | `String` | `""` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Dyrektywa RBAC w naturalnym języku angielskim.<br/>*Uwaga:* Role są automatycznie normalizowane z prefiksem `ROLE_`, a błędne zdania przerywają start aplikacji. |
| `masking` | `String` | `""` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Polityka maskowania pól w naturalnym języku angielskim.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"costPrice"`); niezgodność wywoła błąd runtime. |
| `stateField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu statusu cyklu życia (np. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Pole stanu w encji zarządzane przez regułę `lifecycle`.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"orderStatus"`); niezgodność wywoła błąd runtime. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Rejestruje różnice na poziomie pól między zmianami na potrzeby Time-Travel i inspekcji /diff.
- **Zachowanie w czasie wykonania**: Przechwytuje zmiany oldValue oraz newValue przy tworzeniu, aktualizacji, patchu, przejściu i przywróceniu.
- **Jak używać**: Oznacz encję dziedziczącą `BaseAuditEntity`; `AuditTrailService` zapisuje rewizje przy każdej mutacji.
- **Kiedy używać**: Dla encji wymagających zgodności i audytu Time-Travel `GET /{id}/revisions` (płatności, zamówienia).
- **Kiedy NIE używać i pułapki**: Unikaj na tabelach telemetrycznych i logach o ogromnej liczbie zapisów.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"FINANCE_LEDGER"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Logiczna kategoria audytu; pusta przyjmuje nazwę encji.<br/>*Uwaga:* Taguje wpisy audytu do filtrowania według domeny; `""` używa nazwy klasy encji JPA. |
| `recordFieldDiffs` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Gdy true, wylicza różnice pól przed/po na potrzeby Time-Travel.<br/>*Uwaga:* Zapisuje różnice przed/po dla `PUT`/`PATCH`; wyłącz (`false`) dla dużych pól i zapisów o dużej częstotliwości. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Automatycznie izoluje zapytania i mutacje wierszy według aktywnego najemcy, chyba że użytkownik ma rolę obejścia.
- **Zachowanie w czasie wykonania**: Zwraca fail-closed HTTP 403 przy braku kontekstu najemcy; nadpisuje tenantId przy tworzeniu (anti-spoofing) i blokuje IDOR we wszystkich operacjach po ID.
- **Jak używać**: Umieść na encji SaaS — izolacja odczytów, anty-spoofing przy zapisie oraz blokada `403` działają automatycznie.
- **Kiedy używać**: Na wszystkich współdzielonych tabelach SaaS B2B, aby zapobiec wyciekom danych między najemcami.
- **Kiedy NIE używać i pułapki**: NIE stosuj na globalnych tabelach słownikowych (kraje, waluty).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu identyfikatora najemcy (np. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Nazwa pola encji przechowującego identyfikator najemcy (domyślnie "tenantId").<br/>*Uwaga:* Utwórz złożony indeks `(tenant_id, id)` w bazie dla szybkich zapytań i ścisłej izolacji najemców. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Nie (Opcjonalny) | Tablica nazw ról Spring Security (np. `{"ROLE_SUPER_ADMIN"}`); puste `{}` nie nakłada osobnego ograniczenia.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Globalne role platformowe uprawnione do dostępu między najemcami.<br/>*Uwaga:* Przechowuj nazwy ról w `RoleConstant` z prefiksem `ROLE_` (np. `ROLE_ADMIN`) zgodnym z `GrantedAuthority` Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Weryfikuje unikalność przed zapisem podczas tworzenia, aktualizacji i operacji upsert.
- **Zachowanie w czasie wykonania**: Rzuca wyjątek ConflictBusinessException (HTTP 409) w razie wykrycia duplikatu.
- **Jak używać**: Umieść na polach kluczy biznesowych (`email`, `skuCode`) obok `@Column(unique = true)`.
- **Kiedy używać**: Gdy potrzebujesz czytelnych błędów `HTTP 409 Conflict` i pomijania rekordów po soft-delete.
- **Kiedy NIE używać i pułapki**: NIE rezygnuj z indeksu `UNIQUE` w bazie przy dużej współbieżności.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Automatycznie generuje unikalne kody biznesowe z prefiksem podczas tworzenia lub klonowania, jeśli pole jest puste.
- **Zachowanie w czasie wykonania**: Wypełnia prefiks i unikalny token przed walidacją oraz zapisem encji.
- **Jak używać**: Umieść `@AutoCode(prefix = "PRD-")` na polu tekstowym; wygeneruje się przy tworzeniu lub klonowaniu.
- **Kiedy używać**: Do czytelnych numerów referencyjnych (zamówienia, SKU, zgłoszenia) bez blokad sekwencji bazodanowych.
- **Kiedy NIE używać i pułapki**: NIE stosuj tam, gdzie przepisy wymagają ciągłej numeracji bez luk (`1, 2, 3...`).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Tak (Wymagany)** | Niepusty identyfikator (np. `"ORD"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Wymagany prefiks dodawany przed 8-znakowym skrótem UUIDv7 (np. "PRD-").<br/>*Uwaga:* Atrybut wymagany; generuje kod typu `INV-2026-0001` tylko wtedy, gdy pole jest puste podczas tworzenia. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Automatycznie generuje znormalizowane przyjazne dla URL slugi ASCII z pola sourceField.
- **Zachowanie w czasie wykonania**: Normalizuje znaki diakrytyczne Unicode i umożliwia wyszukiwanie przez filtr sluga.
- **Jak używać**: Umieść `@AutoSlug(sourceField = "name")` na polu `slug`.
- **Kiedy używać**: Do generowania przyjaznych adresów SEO dla sklepów, artykułów i produktów.
- **Kiedy NIE używać i pułapki**: NIE wskazuj w `sourceField` nieistniejącej właściwości encji.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Tak (Wymagany)** | Dokładna nazwa pola Java w encji odpowiadająca polu tekstowego (np. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Wymagana nazwa pola źródłowego konwertowanego do małego sluga ASCII.<br/>*Uwaga:* Wymagany; normalizuje znaki diakrytyczne do bezpiecznego kebab-case URL. Łącz z `@UniqueField` dla unikalności. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Cel**: Wylicza pochodne sumy liczbowe przed zapisem zmian encji.
- **Zachowanie w czasie wykonania**: Weryfikowany przy starcie przez ComputedFieldFailFastUtil w trybie fail-fast dla błędnych sourceFields.
- **Jak używać**: Umieść na polu wyliczanym (`BigDecimal`); przeliczane po stronie serwera przed zapisem.
- **Kiedy używać**: Do wyliczania sum pozycji i zamówień po stronie serwera, uniemożliwiając manipulację kwotami.
- **Kiedy NIE używać i pułapki**: NIE używaj do złożonych rabatów progowych ani przeliczeń z zewnętrznych API.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Strategia obliczeń: "MULTIPLY" lub "SUM_COLLECTION".<br/>*Uwaga:* Przeliczane automatycznie przed zapisem w `POST`/`PUT`/`PATCH`, nadpisując zmanipulowane sumy od klienta. |
| `sourceFields` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Pola tej samej encji mnożone w trybie "MULTIPLY".<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"unitPrice"`); niezgodność wywoła błąd runtime. |
| `collectionField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu kolekcji @OneToMany (np. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Pole kolekcji @OneToMany sumowane w trybie "SUM_COLLECTION".<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"items"`); niezgodność wywoła błąd runtime. |
| `itemField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu liczbowego (np. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Pole liczbowe każdego elementu podrzędnego do zsumowania.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"subTotal"`); niezgodność wywoła błąd runtime. |
| `subtractField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu liczbowego (np. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Opcjonalne pole potrącenia odejmowane od sumy.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"discountAmount"`); niezgodność wywoła błąd runtime. |
| `addField` | `String` | `""` | Nie (Opcjonalny) | Dokładna nazwa pola Java w encji odpowiadająca polu liczbowego (np. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Opcjonalne pole dopłaty dodawane do wyniku.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"shippingFee"`); niezgodność wywoła błąd runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Pozwala wiązać własne zapytania SQL/JPQL lub metody dostawców z endpointami kontrolera.
- **Zachowanie w czasie wykonania**: Wykonywany z powiązanymi parametrami nazwanymi przez JPA EntityManager.
- **Jak używać**: Połącz z `@AutoGet`/`@AutoPost`, wiążąc `:param` poprzez `@AutoParam`.
- **Kiedy używać**: Do raportów w natywnym SQL, CTE lub funkcji okienkowych bez pisania Repository.
- **Kiedy NIE używać i pułapki**: NIGDY nie sklejaj danych wejściowych w SQL (stosuj `:param`) ani nie rób JOIN-ów między domenami.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Wewnętrzne zapytanie SQL lub JPQL z parametrami `:param`.<br/>*Uwaga:* Zawsze używaj parametrów `:param` lub `?1` przeciw SQL Injection; zostaw `""` przy użyciu `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Nie (Opcjonalny) | `true` (wykonaj natywny SQL bazy danych) lub `false` (wykonaj przenośny JPA JPQL).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true wykonuje natywny SQL; false wykonuje JPQL.<br/>*Uwaga:* Natywny SQL (`true`) odblokowuje CTE i funkcje okna; ustaw `false` (JPQL) dla przenośności między H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `MonthlyRevenueDto.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Opcjonalna klasa docelowa mapowania wyników.<br/>*Uwaga:* W zapytaniach agregujących zawsze podawaj klasę DTO, aby uniknąć `SELECT *` i nietypowanych wierszy. |
| `sqlProvider` | `Class<?>` | `Void.class` | Nie (Opcjonalny) | Dowolna konkretna klasa DTO Java (np. `OrderAnalyticsSqlProvider.class`) lub `Void.class`, aby wyłączyć mapowanie DTO.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Opcjonalna klasa dostawcy SQL walidowana przy starcie aplikacji.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `sqlProvider` powodują natychmiastowe przerwanie (fail-fast). |
| `providerMethod` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"buildRevenueSql"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nazwa metody w `sqlProvider` zwracającej ciąg SQL.<br/>*Uwaga:* Musi dokładnie odpowiadać identyfikatorowi Java (z rozróżnianiem wielkości liter, np. `"buildRevenueSql"`); niezgodność wywoła błąd runtime. |
| `modifying` | `boolean` | `false` | Nie (Opcjonalny) | `true` (DML UPDATE/DELETE w transakcji zapisu) lub `false` (zapytanie SELECT tylko do odczytu).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Musi mieć wartość `true` dla zapytań INSERT/UPDATE/DELETE.<br/>*Uwaga:* Wymagane (`true`) dla `UPDATE`/`DELETE`; uruchamia transakcję zapisu i czyści kontekst JPA. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Dynamiczny RBAC oparty na bazie danych i meta-adnotacje maskowania pól (18 Adnotacji)

### `@SecurityRoleEntity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Cel**: Wskazuje encję JPA jako tabelę katalogu ról RBAC opartego na bazie danych.
- **Zachowanie w czasie wykonania**: DynamicDatabaseRbacProviderHelper buforuje powiązania ról w Caffeine i unieważnia je automatycznie przy zapisie.
- **Jak używać**: Umieść `@SecurityRoleEntity` na encji ról oraz obowiązkowo oznacz kod roli przez `@RoleCode`.
- **Kiedy używać**: Gdy administratorzy zarządzają rolami dynamicznie w bazie danych zamiast w stałych.
- **Kiedy NIE używać i pułapki**: NIE pomijaj `@RoleCode` (błąd przy starcie!) i nie definiuj wielu `@SecurityRoleEntity`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce sekundach; np. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Czas życia pamięci podręcznej Caffeine w sekundach (Domyślnie 60L).<br/>*Uwaga:* Krótki TTL szybciej odzwierciedla zmiany kosztem zapytań; długi odciąża bazę, lecz opóźnia cofnięcie uprawnień. |

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

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje kolumnę unikalnego kodu roli wewnątrz encji @SecurityRoleEntity.
- **Zachowanie w czasie wykonania**: Odczytywany przez buforowany LambdaAccessorUtil w celu dopasowania tokenów GrantedAuthority.
- **Jak używać**: Umieść `@RoleCode` na odpowiednim polu lub getterze wewnątrz encji `@SecurityRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Identyfikuje pole czytelnej nazwy wyświetlanej roli w encji @SecurityRoleEntity.
- **Zachowanie w czasie wykonania**: Udostępniany w metadanych diagnostycznych RBAC oraz punktach inspekcji Dev Studio.
- **Jak używać**: Umieść `@RoleName` na odpowiednim polu lub getterze wewnątrz encji `@SecurityRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Oznacza pole kolekcji lub tekstu CSV przechowujące kody uprawnień przypisane do roli.
- **Zachowanie w czasie wykonania**: Parsowany dynamicznie i rozwijany do efektywnych uprawnień SecurityIdentityCustomizer.
- **Jak używać**: Umieść `@RolePermissions` na odpowiednim polu lub getterze wewnątrz encji `@SecurityRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Cel**: Oznacza encję JPA przechowującą uprawnienia zasób-akcja oraz dynamiczne reguły maskowania pól.
- **Zachowanie w czasie wykonania**: Ładowany do DatabaseRbacRuleMatcherHelper w celu egzekwowania kontroli CRUD i maskowania pól.
- **Jak używać**: Umieść `@SecurityPermissionEntity` na encji uprawnień z wymaganym `@PermissionCode`.
- **Kiedy używać**: Do dynamicznego zarządzania uprawnieniami zasób/akcja i maskowaniem pól w bazie.
- **Kiedy NIE używać i pułapki**: NIE pomijaj `@PermissionCode` i nie duplikuj `@SecurityPermissionEntity`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce sekundach; np. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Czas życia pamięci podręcznej Caffeine w sekundach.<br/>*Uwaga:* Krótki TTL szybciej odzwierciedla zmiany kosztem zapytań; długi odciąża bazę, lecz opóźnia cofnięcie uprawnień. |

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

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Wskazuje pole unikalnego identyfikatora uprawnienia w encji @SecurityPermissionEntity.
- **Zachowanie w czasie wykonania**: Dopasowywany do uprawnień wywołującego i kodów @EntitySecurity.permissions().
- **Jak używać**: Umieść `@PermissionCode` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPermissionEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPermissionEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPermissionEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje nazwę docelowej encji lub zasobu API (lub symbol *) w @SecurityPermissionEntity.
- **Zachowanie w czasie wykonania**: Oceniany bez rozróżniania wielkości liter przez DatabaseRbacRuleMatcherHelper z obsługą masek.
- **Jak używać**: Umieść `@PermissionResource` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPermissionEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPermissionEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPermissionEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje czasownik akcji CRUD lub niestandardowej chroniony przez @SecurityPermissionEntity.
- **Zachowanie w czasie wykonania**: Automatycznie normalizowany na podstawie metod kontrolera (READ, WRITE, DELETE lub akcja własna).
- **Jak używać**: Umieść `@PermissionAction` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPermissionEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPermissionEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPermissionEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Deklaruje pola encji oddzielone przecinkami, które mają być dynamicznie maskowane przez tę regułę.
- **Zachowanie w czasie wykonania**: Stosowany dynamicznie obok @FieldSecurity przed serializacją odpowiedzi HTTP JSON.
- **Jak używać**: Umieść `@PermissionFieldMask` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPermissionEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPermissionEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPermissionEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Cel**: Mapuje encję JPA wiążącą uwierzytelnione podmioty z rolami DB i opcjonalnym zakresem najemcy.
- **Zachowanie w czasie wykonania**: Automatycznie odpytywany podczas inicjalizacji JWT / SecurityContext przez SecurityIdentityCustomizer.
- **Jak używać**: Umieść na encji łączącej użytkowników z rolami wraz z `@UserRoleSubject` i `@UserRoleCode`.
- **Kiedy używać**: Gdy JWT zawiera tylko nazwę użytkownika, a role mają być doładowywane z bazy.
- **Kiedy NIE używać i pułapki**: NIE pomijaj `@UserRoleSubject`; zbędne, gdy zewnętrzny IdP dostarcza pełne role w JWT.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@SecurityUserRoleEntity(enabled = true)` | Przełącznik włączający lub wyłączający ładowanie przypisań użytkownik-rola.<br/>*Uwaga:* Tymczasowe `false` podczas migracji schematu wstrzymuje zapytania do tabeli przy zachowaniu ról z JWT. |

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

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Identyfikuje pole podmiotu / nazwy użytkownika w encji @SecurityUserRoleEntity.
- **Zachowanie w czasie wykonania**: Porównywany z Authentication.getName() z aktywnego SecurityContext.
- **Jak używać**: Umieść `@UserRoleSubject` na odpowiednim polu lub getterze wewnątrz encji `@SecurityUserRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityUserRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityUserRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Wiąże kolumnę przypisanego kodu roli w encji @SecurityUserRoleEntity.
- **Zachowanie w czasie wykonania**: Rozwiązuje powiązane uprawnienia @SecurityRoleEntity podczas ewaluacji polityk.
- **Jak używać**: Umieść `@UserRoleCode` na odpowiednim polu lub getterze wewnątrz encji `@SecurityUserRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityUserRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityUserRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Ogranicza przypisanie @SecurityUserRoleEntity do wskazanego najemcy (lub * globalnie).
- **Zachowanie w czasie wykonania**: Filtrowany względem TenantContextHolder / X-Tenant-ID przy każdym żądaniu.
- **Jak używać**: Umieść `@UserRoleTenantId` na odpowiednim polu lub getterze wewnątrz encji `@SecurityUserRoleEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityUserRoleEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityUserRoleEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Cel**: Oznacza encję JPA przechowującą jawne polityki ALLOW / DENY uporządkowane według priority.
- **Zachowanie w czasie wykonania**: Jawne DENY deterministycznie wygrywa z ALLOW przed wykonaniem jakiegokolwiek SQL.
- **Jak używać**: Umieść `@SecurityPolicyEntity` z obowiązkowym `@PolicyAllowedRoles` oraz `@PolicyEffect`.
- **Kiedy używać**: Do dynamicznego nadpisywania statycznego `@EntitySecurity` regułami z bazy (w tym awaryjne `DENY`).
- **Kiedy NIE używać i pułapki**: NIE pomijaj `@PolicyAllowedRoles`; jawna reguła `DENY` ma pierwszeństwo przed `ALLOW`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Nie (Opcjonalny) | Liczba dodatnia (`>= 0`) w jednostce priorytecie liczbowym; np. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Priorytet oceny reguł polityk (mniejsza wartość ma pierwszeństwo, domyślnie 100).<br/>*Uwaga:* Niższe wartości mają wyższy priorytet przy wielu pasujących politykach (np. `10` nadpisuje `100`). |

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

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje wzorzec docelowego zasobu w encji @SecurityPolicyEntity.
- **Zachowanie w czasie wykonania**: Obsługuje dokładne nazwy encji/zasobów oraz dopasowanie maską *.
- **Jak używać**: Umieść `@PolicyResource` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPolicyEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPolicyEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPolicyEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje chroniony typ operacji (READ, WRITE, DELETE, methodName, *) w @SecurityPolicyEntity.
- **Zachowanie w czasie wykonania**: Oceniany dla każdej operacji HTTP przed przekazaniem do serwisu.
- **Jak używać**: Umieść `@PolicyAction` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPolicyEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPolicyEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPolicyEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Mapuje kolekcję lub listę ról objętą regułą @SecurityPolicyEntity.
- **Zachowanie w czasie wykonania**: Krzyżowo weryfikowany z uprawnieniami JWT oraz rolami załadowanymi z @SecurityUserRoleEntity.
- **Jak używać**: Umieść `@PolicyAllowedRoles` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPolicyEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPolicyEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPolicyEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Cel**: Określa wynik decyzji polityki (ALLOW lub DENY) w regule @SecurityPolicyEntity.
- **Zachowanie w czasie wykonania**: Każda pasująca polityka DENY natychmiast przerywa żądanie kodem HTTP 403 AccessDeniedBusinessException.
- **Jak używać**: Umieść `@PolicyEffect` na odpowiednim polu lub getterze wewnątrz encji `@SecurityPolicyEntity`.
- **Kiedy używać**: Do elastycznego mapowania własnych nazw kolumn `@SecurityPolicyEntity` na silnik DB-RBAC.
- **Kiedy NIE używać i pułapki**: NIE powielaj w jednej encji ani poza klasą oznaczoną `@SecurityPolicyEntity`.

> **Adnotacja znacznikowa (Marker Annotation)**: Czysta adnotacja znacznikowa bez atrybutów.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Blokady rozproszone, idempotentność, cache, wiele baz danych i CloudEvents (13 Adnotacji)

### `@DistributedLock`

- **Pakiet**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Cel**: Serializuje równoległy dostęp po kluczach SpEL w mapie AST (domyślnie waitTimeMs=3000L, leaseTimeMs=5000L).
- **Zachowanie w czasie wykonania**: DistributedLockAspect rzuca DistributedLockAcquisitionException (HTTP 409) po przekroczeniu limitu czasu.
- **Jak używać**: Umieść na metodzie nie-finalnego `@Service`; w klastrze zarejestruj bean Redis `DistributedLockProvider`.
- **Kiedy używać**: Aby zapobiec wyprzedaniu zapasów lub równoczesnemu obciążeniu portfela.
- **Kiedy NIE używać i pułapki**: NIE zakładaj blokady między wieloma podami przy domyślnym dostawcy Caffeine ani nie stosuj na klasach `final`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Nie (Opcjonalny) | Wyrażenie SpEL odwołujące się do parametrów metody (np. `"'inventory:' + #skuId"`) lub `""` dla automatycznego klucza.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Wyrażenie SpEL klucza blokady obliczane w runtime.<br/>*Uwaga:* Zawsze zawężaj klucz do ID zasobu (`#id`); stały klucz wymusi globalną serializację ruchu. |
| `waitTimeMs` | `long` | `3000L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 0`) w jednostce milisekundach; np. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Maksymalny czas oczekiwania na blokadę w milisekundach (3000L).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: zbyt niska wartość wywoła fałszywe 409; zbyt wysoka zablokuje wątki przy skokach ruchu. |
| `leaseTimeMs` | `long` | `5000L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 100`) w jednostce milisekundach; np. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Maksymalny czas dzierżawy blokady w ms (5000L).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: musi przekraczać czas p99 transakcji, inaczej blokada wygaśnie przed zatwierdzeniem. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Zapobiega równoległym lub ponawianym duplikatom zapisu w konfigurowalnych oknach TTL.
- **Zachowanie w czasie wykonania**: Egzekwowane przez IdempotencyAspect + ProxyIdempotencyGuardHelper z blokadą Caffeine TTL (HTTP 409 ConflictBusinessException); puste klucze przechodzą, a IdempotencyManagerHelper oferuje opcjonalny SHA-256.
- **Jak używać**: Umieść na metodach `@AutoRestController` lub nie-finalnych `@Service`; błąd zwalnia klucz do ponowienia.
- **Kiedy używać**: Do płatności, przelewów i żądań POST narażonych na podwójne wysłanie.
- **Kiedy NIE używać i pułapki**: NIE stosuj na GET; w klastrze zapewnij dostawcę Redis `IdempotencyStoreProvider`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Nie (Opcjonalny) | Poprawna nazwa nagłówka HTTP (bez rozróżniania wielkości liter w sieci, np. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Nagłówek HTTP z kluczem idempotentności (brak lub pusty pomija mechanizm).<br/>*Uwaga:* Klient musi wysyłać unikalny UUIDv7 na operację i powtarzać go przy ponowieniach; dodaj nagłówek do CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce sekundach; np. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Okno deduplikacji w sekundach zwracające HTTP 409 przy ponownym wysłaniu (300L).<br/>*Uwaga:* Czas przechowywania odpowiedzi w Redis/pamięci; ustaw `300L–86400L` zależnie od okna ponowień. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Egzekwuje limitowanie żądań z przesuwnym oknem według partycji IP, Użytkownika lub Najemcy.
- **Zachowanie w czasie wykonania**: Zwiększa metrykę nwvmc.ratelimit.rejected.total i odpowiada kodem HTTP 429 Too Many Requests.
- **Jak używać**: Umieść na interfejsie lub metodzie kontrolera; dodaje `X-RateLimit-Remaining`/`X-RateLimit-Reset`, a po przekroczeniu zwraca `HTTP 429` + `Retry-After`.
- **Kiedy używać**: Na publicznym wyszukiwaniu, autoryzacji, zapytaniach AI oraz ciężkich eksportach.
- **Kiedy NIE używać i pułapki**: NIE ograniczaj health-checków i unikaj `"GLOBAL"`, gdy wymagana jest izolacja per `"USER"`, `"TENANT"` lub `"IP"`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce żądaniach; np. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Maksymalna liczba żądań na okno czasowe (domyślnie 60).<br/>*Uwaga:* Przy HTTP `429` automatycznie dołącza nagłówki `X-RateLimit-Remaining`, `X-RateLimit-Reset` oraz RFC 6585 `Retry-After`. |
| `windowSeconds` | `int` | `60` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce sekundach; np. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Czas trwania okna limitowania w sekundach (domyślnie 60).<br/>*Uwaga:* Określa długość okna licznika oraz wyznacza wartości nagłówków `X-RateLimit-Reset` i `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Strategia partycjonowania: "IP"/"clientIp", "USER" (fallback IP dla anonimowych), "TENANT", "GLOBAL" lub SpEL "#expr".<br/>*Uwaga:* `"USER"` dzieli limity per użytkownik (z fallbackiem na IP dla anonimów); `"GLOBAL"` współdzieli jedną pulę dla wszystkich. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Otacza operacje wyłącznikami Resilience4j Circuit Breaker raportującymi telemetrię do Actuatora i Micrometera.
- **Zachowanie w czasie wykonania**: Przechodzi w stan OPEN (HTTP 503) po przekroczeniu progu błędów i aktualizuje metrykę stanu.
- **Jak używać**: Umieść na kontrolerach/metodach wywołujących zewnętrzne API lub AI.
- **Kiedy używać**: Gdy awarie zewnętrzne mają zwracać natychmiastowe `HTTP 503` zamiast blokować wątki.
- **Kiedy NIE używać i pułapki**: `CircuitBreakerErrorFilterUtil` automatycznie ignoruje 4xx `BaseBusinessException`; nie owijaj błędów klienta w zwykły `RuntimeException`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"payment-gateway-cb"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nazwa instancji CircuitBreaker w Resilience4j.<br/>*Uwaga:* Identyfikuje instancję Resilience4j i tag Micrometer; `""` wylicza nazwę z klasy. |
| `failureRateThreshold` | `float` | `50.0f` | Nie (Opcjonalny) | Liczba dodatnia (`1.0f .. 100.0f`) w jednostce procentach; np. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Próg procentowy błędów otwierający obwód (domyślnie 50.0f).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: błędy biznesowe 4xx (`BaseBusinessException`) są ignorowane; tylko awarie 5xx i infrastruktury otwierają obwód. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce sekundach; np. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Czas oczekiwania w stanie OPEN przed testem HALF_OPEN w sekundach (10).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: błędy biznesowe 4xx (`BaseBusinessException`) są ignorowane; tylko awarie 5xx i infrastruktury otwierają obwód. |
| `slidingWindowSize` | `int` | `20` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce wywołaniach; np. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Liczba ostatnich wywołań w oknie przesuwnym (domyślnie 20).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: błędy biznesowe 4xx (`BaseBusinessException`) są ignorowane; tylko awarie 5xx i infrastruktury otwierają obwód. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce wywołaniach; np. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Liczba próbnych wywołań w stanie HALF_OPEN przed zamknięciem obwodu (5).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: błędy biznesowe 4xx (`BaseBusinessException`) są ignorowane; tylko awarie 5xx i infrastruktury otwierają obwód. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Automatycznie ponawia tymczasowe błędy z konfigurowalnym wykładniczym opóźnieniem.
- **Zachowanie w czasie wykonania**: Rzuca ustandaryzowany wyjątek po wyczerpaniu wszystkich skonfigurowanych prób.
- **Jak używać**: Umieść na kontrolerze lub metodzie, aby ponawiać przejściowe błędy sieci/bazy danych.
- **Kiedy używać**: Dla idempotentnych odczytów GET, PUT oraz wywołań chronionych przez `@Idempotent`.
- **Kiedy NIE używać i pułapki**: NIGDY na nieidempotentnych żądaniach POST lub płatnościach bez `@Idempotent` (ryzyko podwójnej opłaty)!

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"erp-sync-retry"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nazwa instancji Retry w Resilience4j.<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: upewnij się, że łączny czas ponowień mieści się poniżej limitu timeoutu bramy. |
| `maxAttempts` | `int` | `3` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce próbach; np. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Łączna liczba prób wraz z pierwszym wywołaniem (3).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: upewnij się, że łączny czas ponowień mieści się poniżej limitu timeoutu bramy. |
| `waitDurationMs` | `long` | `500L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 50`) w jednostce milisekundach; np. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Początkowe opóźnienie w ms przed pierwszą ponowną próbą (500L).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: upewnij się, że łączny czas ponowień mieści się poniżej limitu timeoutu bramy. |
| `backoffMultiplier` | `double` | `2.0d` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1.0d`) w jednostce mnożniku; np. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Mnożnik wykładniczy opóźnienia między ponowieniami (2.0d).<br/>*Uwaga:* Dobierz ostrożnie pod produkcyjne SLA opóźnień: upewnij się, że łączny czas ponowień mieści się poniżej limitu timeoutu bramy. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Pakiet**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Wylicza słabe ETag RFC 7232 (W/"...") i zwraca nagłówek Cache-Control oraz odpowiedzi HTTP 304 Not Modified.
- **Zachowanie w czasie wykonania**: Rejestruje liczniki HIT/MISS w metryce nwvmc.cache.http.requests.
- **Jak używać**: Umieść na kontrolerach lub metodach GET dla standardowego `ETag`, `Cache-Control` i `304`.
- **Kiedy używać**: Do katalogów, słowników i list publicznych, by oszczędzać pasmo przez `HTTP 304`.
- **Kiedy NIE używać i pułapki**: NIGDY nie zostawiaj `isPrivate = false` na danych prywatnych PII ani wielodostępnych!

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Nie (Opcjonalny) | Liczba dodatnia (`>= 0`) w jednostce sekundach; np. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Wartość dyrektywy `max-age` nagłówka Cache-Control w sekundach (60).<br/>*Uwaga:* Wysyła `Cache-Control: max-age=<N>`. Wartość `0` z `generateETag = true` wymusza natychmiastową rewalidację `304`. |
| `isPrivate` | `boolean` | `false` | Nie (Opcjonalny) | `true` (prywatny cache przeglądarki; zablokowany dla CDN) lub `false` (publiczny cache dla serwerów proxy i CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true ustawia `private` (bez CDN); false ustawia `public`.<br/>*Uwaga:* KRYTYCZNE: Zawsze ustawiaj `isPrivate = true` na uwierzytelnionych i wielodostępnych endpointach, aby CDN nie ujawnił cudzych danych. |
| `mustRevalidate` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Dodaje `, must-revalidate` wymagając ponownej walidacji po wygaśnięciu.<br/>*Uwaga:* Zabrania serwerom cache zwracania przeterminowanych odpowiedzi po `maxAgeSeconds` bez ponownej walidacji. |
| `generateETag` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Oblicza ETag SHA-256 i zwraca `HTTP 304 Not Modified` dla zgodnego `If-None-Match`.<br/>*Uwaga:* Wylicza `ETag` (RFC 7232) i zwraca `304 Not Modified` (0 bajtów), gdy nagłówek `If-None-Match` pasuje. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Buforuje wyniki metod odczytu po stronie serwera w silnikach Caffeine L1 / Redis L2.
- **Zachowanie w czasie wykonania**: Globalnie konfigurowalny przez właściwość app.framework.cache.type.
- **Jak używać**: Umieść na metodach odczytu w warstwie serwisowej.
- **Kiedy używać**: Dla zapytań o wysokiej przewadze odczytów nad zapisami (np. po ID lub metadane).
- **Kiedy NIE używać i pułapki**: NIE cachuj często modyfikowanych tabel ani mutowalnych encji bez klonowania.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Logiczne nazwy pamięci podręcznych w Caffeine L1 lub Redis L2.<br/>*Uwaga:* Nazwy muszą odpowiadać regionom Caffeine/Redis; paruj każdą operację zapisu z `@AutoCacheEvict`. |
| `key` | `String` | `""` | Nie (Opcjonalny) | Wyrażenie SpEL odwołujące się do parametrów metody (np. `"'product:' + #id"`) lub `""` dla automatycznego klucza.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Wyrażenie klucza SpEL (w v0.1.0 bezpiecznie rozwiązuje `EntityName:id`).<br/>*Uwaga:* W aplikacjach multi-tenant zawsze dodawaj tenantId do klucza, aby zapobiec wyciekom między najemcami. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Usuwa nieaktualne wpisy pamięci podręcznej serwera po operacjach zapisu.
- **Zachowanie w czasie wykonania**: Wykonywany czysto po mutacji bez pozostawiania nieaktualnych odczytów.
- **Jak używać**: Umieść na metodach aktualizacji i usuwania z kluczem spójnym z `@AutoCacheable`.
- **Kiedy używać**: Zawsze, gdy zapisy lub usunięcia modyfikują encje buforowane przez `@AutoCacheable`.
- **Kiedy NIE używać i pułapki**: Unikaj `allEntries = true` przy częstych operacjach `create` (ryzyko Cache Stampede).

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Nazwy pamięci podręcznych do wyczyszczenia po wykonaniu metody.<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `value` powodują natychmiastowe przerwanie (fail-fast). |
| `key` | `String` | `""` | Nie (Opcjonalny) | Wyrażenie SpEL odwołujące się do parametrów metody (np. `"'product:' + #id"`) lub `""` dla automatycznego klucza.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Wyrażenie SpEL usuwające wyłącznie zmodyfikowany wpis pamięci podręcznej.<br/>*Uwaga:* Musi generować taki sam klucz jak `@AutoCacheable.key`; ignorowane przy `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Nie (Opcjonalny) | `true` (wyczyść wszystkie wpisy w regionie cache) lub `false` (usuń tylko pojedynczy wpis wyznaczony przez key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Gdy true, usuwa wyłącznie wpisy z prefiksem danej encji.<br/>*Uwaga:* Czyszczenie całego regionu pod dużym ruchem grozi efektem cache stampede; preferuj usuwanie konkretnego `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Pakiet**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Mierzy czas wykonania i zapisuje logi WARN po przekroczeniu progu powolnych wywołań.
- **Zachowanie w czasie wykonania**: Zasila również timery opóźnień poprzez DynamicEntityMetricsHelper.
- **Jak używać**: Umieść na interfejsach kontrolerów lub serwisach w celu monitorowania przekroczeń SLA.
- **Kiedy używać**: Na złożonych raportach, batchach, GraphQL i `@CustomQuery` do wykrywania wolnych zapytań.
- **Kiedy NIE używać i pułapki**: NIE ustawiaj `<= 0` na ruchliwych trasach ani na długich strumieniach SSE `/events`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Nie (Opcjonalny) | Liczba dodatnia (`>= 1`) w jednostce milisekundach; np. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Próg czasu w ms, po którego przekroczeniu logowane jest ostrzeżenie `WARN` (500L).<br/>*Uwaga:* Loguje ostrzeżenie `WARN` z `traceId` po przekroczeniu progu; dobierz rozsądnie (`200L–1000L`), aby nie zalać logów. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Pakiet**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Cel**: Wysyła asynchroniczne webhooki podpisane HMAC-SHA256 na Virtual Threads po zatwierdzeniu transakcji.
- **Zachowanie w czasie wykonania**: Oblicza podpisy w WebhookHmacSignerHelper i weryfikuje je w czasie stałym.
- **Jak używać**: Umieść na encji JPA; wysyłka uruchamiana jest asynchronicznie po zatwierdzeniu transakcji.
- **Kiedy używać**: Do natychmiastowego powiadamiania partnerów zewnętrznych i systemów ERP po zatwierdzeniu zmian.
- **Kiedy NIE używać i pułapki**: Ustaw `includeFullPayload = false` przy wrażliwych danych PII/PCI i chroń przed SSRF.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Nie (Opcjonalny) | Tablica zera lub więcej poprawnych wartości: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Zdarzenia cyklu życia wyzwalające wysyłkę webhooków podpisanych HMAC.<br/>*Uwaga:* Wysyłane asynchronicznie po zatwierdzeniu transakcji (`AFTER_COMMIT`), co eliminuje fałszywe webhooki przy rollbacku. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Nie (Opcjonalny) | Poprawna nazwa nagłówka HTTP (bez rozróżniania wielkości liter w sieci, np. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Nagłówek HTTP zawierający podpis HMAC-SHA256.<br/>*Uwaga:* Zawiera podpis HMAC-SHA256 ładunku; odbiorca musi go zweryfikować w czasie stałym przed przetworzeniem. |
| `includeFullPayload` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@EntityWebhook(includeFullPayload = false)` | true wysyła pełny ładunek JSON; false tylko ID i metadane zdarzenia.<br/>*Uwaga:* Ustaw `false` (tylko ID i typ zdarzenia) dla wrażliwych encji, aby odbiorcy pobierali dane autoryzowanym GET. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Pakiet**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Publikuje koperty CNCF CloudEvents v1.0 po zatwierdzeniu transakcji.
- **Zachowanie w czasie wykonania**: Wykorzystuje TransactionRuntimeBridge.executeAfterCommit, aby wykluczyć zdarzenia widmowe.
- **Jak używać**: Umieść na encji lub metodzie i odbieraj `CloudEventEnvelopeDto` w fazie `AFTER_COMMIT`.
- **Kiedy używać**: Do komunikacji zdarzeniowej między modułami (Bounded Contexts) bez sprzężenia JPA.
- **Kiedy NIE używać i pułapki**: NIE myl z zewnętrznym `@EntityWebhook` i zawsze przetwarzaj po `AFTER_COMMIT`.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Nie (Opcjonalny) | Niepusty identyfikator (np. `"com.acme.order.lifecycle"`); pozostaw `""`, aby użyć konwencji domyślnej.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Typ zdarzenia CNCF CloudEvents.<br/>*Uwaga:* Stosuj konwencję reverse-DNS CloudEvents 1.0 (`com.company.domain.event`); `""` generuje automatycznie. |
| `source` | `String` | `""` | Nie (Opcjonalny) | Poprawna ścieżka HTTP zaczynająca się od `/` (np. `/services/order-api`) lub pusty ciąg `""` dla automatycznego wyliczenia.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI źródła CloudEvents identyfikujące kontekst domenowy.<br/>*Uwaga:* Wypełnia atrybut URI `source` CNCF CloudEvents do śledzenia zdarzeń między mikroserwisami. |
| `publishOnCreate` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Wysyła CloudEvent po utworzeniu rekordu (domyślnie true).<br/>*Uwaga:* Publikowane wyłącznie po zatwierdzeniu (`AFTER_COMMIT`) przez Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Wysyła CloudEvent po aktualizacji rekordu (domyślnie true).<br/>*Uwaga:* Ustaw `false` na często modyfikowanych encjach, aby nie przeciążać brokera wiadomości. |
| `publishOnDelete` | `boolean` | `true` | Nie (Opcjonalny) | `true` (włączone) lub `false` (wyłączone).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Wysyła CloudEvent po usunięciu rekordu (domyślnie true).<br/>*Uwaga:* Uruchamia się przy trwałym usuwaniu i `@SoftDelete`, utrzymując spójność modeli odczytu. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Pakiet**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Przypina operacje encji lub zapytań do nazwanego klucza źródła danych.
- **Zachowanie w czasie wykonania**: Rejestruje liczniki trasowania w metryce framework.datasource.routing.total.
- **Jak używać**: Umieść na kontrolerze lub nie-finalnym serwisie; poprzedni kontekst jest automatycznie przywracany.
- **Kiedy używać**: Do odciążania głównej bazy poprzez kierowanie raportów BI do replik `REPLICA`.
- **Kiedy NIE używać i pułapki**: NIE przełączaj źródła w trakcie już otwartej transakcji `@Transactional` ani na klasie `final`!

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Klucz routingu bazy w `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Uwaga:* Musi odpowiadać kluczowi w `DynamicRoutingDataSource`; nieznane klucze wracają do `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Pakiet**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Cel**: Przypisuje rodzinę silnika bazy danych oraz logiczny shard klastra dla danej encji.
- **Zachowanie w czasie wykonania**: Rozwiązywany dynamicznie przez MultiPlatformDataSourceRegistryHelper oraz TenantDatabaseRoutingResolverHelper.
- **Jak używać**: Umieść na encjach JPA lub metodach, deklarując docelową platformę i klaster bazodanowy.
- **Kiedy używać**: W architekturach poliglotycznych i shardowanych z osobnymi klastrami finansowymi, analitycznymi i audytowymi.
- **Kiedy NIE używać i pułapki**: NIE zastępuje fizycznej konfiguracji puli JDBC i nie zezwala na JOIN-y między różnymi klastrami.

| Atrybut | Typ Java | Wartość domyślna | Wymagany | Dozwolone wartości i przykład | Opis i uwagi runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Docelowy silnik bazy danych ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `platform` powodują natychmiastowe przerwanie (fail-fast). |
| `cluster` | `String` | `"PRIMARY"` | Nie (Opcjonalny) | Jedna z obsługiwanych wartości: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Docelowy klaster lub shard ("PRIMARY", "REPLICA", "FINANCE_CLUSTER").<br/>*Uwaga:* Walidowane podczas startu aplikacji; literówki lub błędne `cluster` powodują natychmiastowe przerwanie (fail-fast). |
| `readOnly` | `boolean` | `false` | Nie (Opcjonalny) | `true` (kieruj do puli replik tylko do odczytu) lub `false` (kieruj do głównej puli odczytu/zapisu).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Gdy true, sygnalizuje preferencję kierowania do replik tylko do odczytu.<br/>*Uwaga:* Nigdy nie ustawiaj `readOnly = true` przy zapisie (`POST`/`PUT`/`DELETE`) — repliki tylko do odczytu odrzucają zapisy. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
