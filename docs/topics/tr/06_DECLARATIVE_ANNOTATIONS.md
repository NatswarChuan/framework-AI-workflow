# 06. Tüm 60 Bildirimsel Anotasyonun Eksiksiz Teknik Şartnamesi (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz (EN)](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0` içindeki tüm **60 Bildirimsel Anotasyonun** Java `@interface` kaynak kodundan birebir çıkarılmış kapsamlı teknik referansıdır: kesin paket adı, `@Target`, **her öznitelik**, Java türü, varsayılan değer, zorunlu/isteğe bağlı durumu, **nasıl kullanılır**, **ne zaman kullanılır**, **ne zaman KULLANILMAMALI ve tuzaklar**, ve doğrulanmış Java kod örnekleri.

## Hızlı Matris Dizini (60 Anotasyon)

| Anotasyon | Kategori | `@Target` | Öznitelik Özeti | Temel Amaç |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> genişleten bir arayüzü 40 sözleşmeli (Swagger UI içinde varsayılan 38 görünür) çalışma zamanı JDK Dinamik Proxy’ye dönüştürür. |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Bildirilen bir denetleyici sözleşmesini dinamik CRUD yerine MethodHandleCacheUtil ile özel bir Spring bean metoduna yönlendirir. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Alana özgü iş akışı yollarını (ödeme, iade, onay) bağımsız Spring @Component Helper bean’lerine bağlar. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Statik Spring Web içe aktarımları olmadan @GetMapping yerine geçen saf Java anotasyonu. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Özel consumes/produces medya türlerini destekleyen saf Java HTTP POST rota bildirimi. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Tam kaynak değiştirme için saf Java HTTP PUT rota eşlemesi. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Kısmi birleştirme, atomik artırım ve RFC 6902 JSON Patch destekli saf Java HTTP PATCH bildirimi. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Durum korumalı geçici silmeyi tetikleyen saf Java HTTP DELETE bildirimi. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL sorgu parametrelerini veya Map<String, String> dinamik filtre haritalarını bağlar. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 varlık kimlikleri gibi URI yol değişkenlerini bağlar. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | HTTP JSON istek gövdelerini @Valid ile eşleşen DTO veya Entity parametrelerine çözer. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Döngüsel hataları reddederek GET /{id}/{relation}/** üzerinden özyinelemeli alt ilişki gezintisine izin verir. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Özel eylem metotlarında bildirimsel alan durum geçişlerini veya sayısal düzenlemeleri tanımlar. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Derleme zamanı @Component içe aktarımı olmadan açılışta kaydedilen bileşen işaretçisi. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride ile eşleşen ServiceImpl sınıfları için servis katmanı işaretçisi. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean sınıfları içinde yönetilen bean fabrika metotlarını bildirir. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Yapılandırma sınıflarını ve YAML özellik bağlama modellerini işaretler. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer bean’leri ile filtre zincirleri arasındaki yürütme önceliğini yönetir. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Sorgu veya değişiklik öncesinde NIST Level 2 RBAC, ownerField izolasyonu ve izin kodlarını zorunlu kılar. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Çağıranın rolleri yetersiz olduğunda hassas sütunları dinamik olarak maskeler veya null yapar. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition için izin verilen geçişleri uygular ve DELETE /{id} işlemini deletableStates ile sınırlar. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Okunabilir politika ifadelerini etkin RBAC, geçiş ve maskeleme kurallarına derler. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Zaman Yolculuğu durum yeniden yapılandırması ve /diff denetimi için alan düzeyinde farkları kaydeder. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Atlama rolü bulunmadıkça satır sorgularını ve değişiklikleri etkin kiracı bağlamına göre otomatik yalıtır. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(İşaretçi anotasyon — öznitelik yok)` | Oluşturma, güncelleme ve upsert işlemlerinde kalıcılıktan önce benzersizliği doğrular. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (ZORUNLU)` | Boş bırakıldığında oluşturma veya klonlamada önekli benzersiz iş kodları otomatik üretir. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (ZORUNLU)` | sourceField üzerinden URL dostu normalize edilmiş ASCII slug değerlerini otomatik üretir. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Varlık değişikliklerini kaydetmeden önce türetilmiş sayısal toplamları temiz biçimde hesaplar. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Denetleyici uç noktalarına özel SQL/JPQL sorguları veya sağlayıcı metotları bağlar. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Bir JPA varlığını canlı veritabanı RBAC Rol katalog tablosu olarak işaretler. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityRoleEntity içindeki benzersiz rol kodu sütununu eşler. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityRoleEntity üzerinde insan tarafından okunabilir rol görünen adını tanımlar. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | Bir rol varlığında verilen izin kodlarını tutan koleksiyon veya CSV alanını işaretler. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Kaynak-eylem izinlerini ve dinamik alan maskeleme kurallarını tutan JPA varlığını işaretler. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPermissionEntity içindeki benzersiz izin tanımlayıcı alanını belirtir. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPermissionEntity içinde hedef varlık veya API kaynak adını (veya *) eşler. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPermissionEntity kuralıyla korunan CRUD veya özel eylem fiilini eşler. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | Bu DB izin kuralı tetiklendiğinde dinamik maskelenecek virgülle ayrılmış alanları belirtir. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Kimliği doğrulanmış kullanıcıları DB rolleriyle ve isteğe bağlı kiracı kapsamıyla bağlayan varlığı işaretler. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityUserRoleEntity üzerindeki asıl özne / kullanıcı adı alanını tanımlar. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityUserRoleEntity içindeki atanmış rol kodu sütununu bağlar. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityUserRoleEntity atamasını belirli bir kiracı kimliğine (veya genel için *) sınırlar. |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | priority değerine göre sıralanan açık ALLOW / DENY yetkilendirme politikalarını tutan varlığı işaretler. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPolicyEntity içinde hedef kaynak tanımlayıcı desenini eşler. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPolicyEntity içindeki korunan işlem fiilini (READ, WRITE, DELETE, methodName, *) eşler. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPolicyEntity kuralının hedeflediği rol koleksiyonunu veya CSV dizesini eşler. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(İşaretçi anotasyon — öznitelik yok)` | @SecurityPolicyEntity kuralında ALLOW veya DENY karar sonucunu belirtir. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST haritasında (maks 1024) önbelleklenen SpEL anahtarlarında eşzamanlı erişimi sıralar (varsayılan 3000L/5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Yapılandırılabilir TTL pencerelerinde eşzamanlı veya tekrarlanan yinelenen yazmaları önler. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP, Kullanıcı veya Kiracı bölümlemesine göre kayan pencereli hız sınırlaması uygular. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator ve Micrometer’a telemetri bildiren Resilience4j Devre Kesicileriyle işlemleri sarar. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Geçici hataları yapılandırılabilir üstel geri çekilme ile otomatik yeniden dener. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 zayıf ETag (W/"...") hesaplar ve Cache-Control ile HTTP 304 Not Modified yanıtları döndürür. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Sunucu tarafı okuma metodu çıktılarını Caffeine L1 / Redis L2 motorlarında önbellekler. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Değişikliklerde eski sunucu tarafı önbellek girdilerini temizler. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Yürütme süresini ölçer ve yavaş çağrılar eşiği aştığında WARN günlüğü yazar. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | İşlem onayı sonrası Virtual Threads üzerinde HMAC-SHA256 imzalı giden webhook’lar gönderir. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | İşlem onayından sonra CNCF CloudEvents v1.0 zarfları yayınlar. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Varlık veya sorgu işlemlerini mantıksal adlandırılmış bir veri kaynağı anahtarına sabitler. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Varlık başına veritabanı motoru ailesi ve mantıksal küme bölümü atar. |

---

## 1. Yönlendirme, Dinamik API Sözleşmeleri, DTO Ayrımı ve Parametre Bağlama (13 Anotasyon)

### `@AutoRestController`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Amaç**: AutoApiController<E> genişleten bir arayüzü 40 sözleşmeli (Swagger UI içinde varsayılan 38 görünür) çalışma zamanı JDK Dinamik Proxy’ye dönüştürür.
- **Çalışma Zamanı Davranışı**: DynamicControllerProxyRegistrarHelper açılışta etkin denetleyicileri tarar ve yolları RequestMappingHandlerMapping’e kaydeder.
- **Nasıl Kullanılır**: `AutoApiController<E>` veya `AutoReadApi<E>` genişleten Java arayüzüne `@AutoRestController(basePath = "/api/v1/...")` ekleyin.
- **Ne Zaman Kullanılır**: JPA varlıkları için şablon kod yazmadan standart CRUD, sayfalama, keyset veya salt okunur API sunmak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Somut `@RestController` sınıflarında veya JPA varlığı olmayan akışlarda KULLANMAYIN; salt okunur kataloglarda `AutoReadApi<E>` tercih edin.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Hayır (İsteğe Bağlı) | `/` ile başlayan geçerli HTTP yolu (örn. `/api/v1/product-catalogs`) veya otomatik türetme için boş dize `""`.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Açık kök URI yolu (örn. "/api/v1/product-catalogs"). Boş bırakılırsa denetleyici adından kebab-case çoğul türetilir.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `path` yerine önce `basePath` değerini okur. Çelişkili değerler vermeyin. |
| `path` | `String` | `""` | Hayır (İsteğe Bağlı) | `/` ile başlayan geçerli HTTP yolu (örn. `/api/v1/orders`) veya otomatik türetme için boş dize `""`.<br/>`@AutoRestController(path = "/api/v1/orders")` | Temel yol için alternatif takma ad. Kayıt yardımcısı öncelikli okuduğu için basePath tercih edilmelidir.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `path` yerine önce `basePath` değerini okur. Çelişkili değerler vermeyin. |
| `entityName` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"ProductCatalog"`); varsayılan kural için `""` bırakın.<br/>`@AutoRestController(entityName = "ProductCatalog")` | OpenAPI/Studio meta verilerinde görünen varlık adını geçersiz kılar.<br/>*Uyarı:* Swagger / OpenAPI 3.0 ve NWVMC Studio içinde doğrudan görünür; sabit metin yerine `OpenApiConstant` kullanın. |
| `enabledEndpoints` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | İzin verilen sözleşme metot adları listesi (örn. "getPage", "create"). Boşsa tümü etkinleşir.<br/>*Uyarı:* Sıkı izin listesi olarak çalışır: boş değilse listede yer almayan tüm AutoApiController metotları Spring MVC ve Swagger UI’dan çıkarılır. |
| `disabledEndpoints` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | MVC eşlemesi öncesi devre dışı bırakılacak metot adları kara listesi.<br/>*Uyarı:* `enabledEndpoints` sonrasında değerlendirilir; diğer sözleşmeleri koruyup silme veya toplu uç noktaları kapatmak için idealdir. |
| `enableNestedSubResources` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Özyinelemeli GET /{id}/** alt kaynak gezintisini açar. Varsayılan false değerindedir.<br/>*Uyarı:* `GET /{id}/items/...` gerekmedikçe `false` bırakın; açıldığında `@EnableNestedSubResource` ile izin verilen ilişkileri sınırlayın. |
| `readDto` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Herhangi bir somut Java DTO sınıfı (örn. `ProductReadDto.class`) veya DTO eşlemesini kapatmak için `Void.class`.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | Yanıt serileştirmede dahili varlık alanlarını gizleyen isteğe bağlı okuma DTO sınıfı.<br/>*Uyarı:* Yalnızca okuma (GET) hattında uygulanır; DTO sınıfı parametresiz kurucu/getter gerektirir ve `@Valid` ile uyumludur. |
| `createDto` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Herhangi bir somut Java DTO sınıfı (örn. `ProductCreateDto.class`) veya DTO eşlemesini kapatmak için `Void.class`.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | POST eşlemesi öncesi Jakarta Validation ile doğrulanan isteğe bağlı oluşturma DTO sınıfı.<br/>*Uyarı:* Yalnızca oluşturma (POST) hattında uygulanır; DTO sınıfı parametresiz kurucu/getter gerektirir ve `@Valid` ile uyumludur. |
| `updateDto` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Herhangi bir somut Java DTO sınıfı (örn. `ProductUpdateDto.class`) veya DTO eşlemesini kapatmak için `Void.class`.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | PUT/PATCH güncellemelerinde düzenlenebilir alanları kısıtlayan isteğe bağlı DTO sınıfı.<br/>*Uyarı:* Yalnızca güncelleme (PUT/PATCH) hattında uygulanır; DTO sınıfı parametresiz kurucu/getter gerektirir ve `@Valid` ile uyumludur. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Bildirilen bir denetleyici sözleşmesini dinamik CRUD yerine MethodHandleCacheUtil ile özel bir Spring bean metoduna yönlendirir.
- **Çalışma Zamanı Davranışı**: EscapeHatchDispatchHelper hedef bean’i çözer ve MethodHandle’ı MethodHandleCacheUtil içinde önbelleğe alır.
- **Nasıl Kullanılır**: İlgili metodu `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` ile işaretleyin ve hedef sınıfı `@Component`/`@Service` yapın.
- **Ne Zaman Kullanılır**: Çoğu uç nokta otomatik CRUD kullanırken tek bir metot için özel Java iş mantığı gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `targetBean` içine string YAZMAYIN (`Class<?>` ister; ad için `beanName` kullanın). Bildirimsel kurallar yetiyorsa kullanmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Somut Spring `@Service`/`@Component` bean sınıfı (örn. `OrderCustomService.class`) veya `beanName` ile çözmek için `Void.class`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Hedef Spring bean sınıfı (beanName özelliğine göre önceliklidir).<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `beanName` yerine önce `targetBean` değerini okur. Çelişkili değerler vermeyin. |
| `beanName` | `String` | `""` | Hayır (İsteğe Bağlı) | ApplicationContext’te kayıtlı tam bean adı (örn. `"orderCustomService"`) veya otomatik çözümleme için `""`.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | targetBean Void.class iken kullanılan açık Spring bean adı.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `beanName` yerine önce `targetBean` değerini okur. Çelişkili değerler vermeyin. |
| `methodName` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"createOrder"`); varsayılan kural için `""` bırakın.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Hedef bean üzerindeki metot adı; boşsa denetleyici metot adı kullanılır.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"createOrder"`); uyumsuzluk çalışma zamanı hatası verir. |
| `bypassAutoDispatch` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (varsayılan — geçersiz kılmayı etkinleştirip hedef bean’i çağır) veya `false` (geçersiz kılmayı kapatıp varsayılan CRUD’u çalıştır).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true olduğunda varsayılan CRUD yönlendirmesini atlar ve özel bean metodunu çağırır.<br/>*Uyarı:* `true` iken `EscapeHatchDispatchHelper` bean’inizi çağırır. `false` yapmak `@ServiceOverride`’ı tamamen kapatıp varsayılan CRUD’u çalıştırır (ön/son kanca DEĞİLDİR). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Alana özgü iş akışı yollarını (ödeme, iade, onay) bağımsız Spring @Component Helper bean’lerine bağlar.
- **Çalışma Zamanı Davranışı**: Tam doğrulama ve işlem sarmalamasıyla önbellekli MethodHandle üzerinden delegateBean.delegateMethod çağırır.
- **Nasıl Kullanılır**: Arayüz metodunda `path`, `httpMethod`, `delegateBean` ve `delegateMethod` belirterek iş akışını bir Spring beanine devredin.
- **Ne Zaman Kullanılır**: Ödeme, iade, onay veya çoklu varlık işlemleri gibi alan iş akışı uç noktaları için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Proxy kesicilerine güvenmeyin (`ControllerProxySpecialRouteUtil` doğrudan yönlendirir); AOP/güvenliği hedef `@Service` beanine koyun ve basit geçişlerde `@BusinessAction` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/reports/monthly-sales`); `""` kök yola bağlanır.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Denetleyici basePath altındaki göreli uç nokta yolu (örn. "/checkout").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `path` trafik almadan önce hızlıca hata verir. |
| `httpMethod` | `String` | `"GET"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Eşleştirilecek HTTP metodu ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `httpMethod` trafik almadan önce hızlıca hata verir. |
| `delegateBean` | `String` | `""` | Hayır (İsteğe Bağlı) | ApplicationContext’te kayıtlı tam bean adı (örn. `"orderReportService"`) veya otomatik çözümleme için `""`.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | İş akışı işleyici metodunu içeren Spring bean adı (default metot veya @ServiceOverride yoksa boş olamaz).<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `delegateBean` trafik almadan önce hızlıca hata verir. |
| `delegateMethod` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"buildMonthlyReport"`); varsayılan kural için `""` bırakın.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean üzerindeki hedef metot adı; boşsa denetleyici metot adı kullanılır.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"buildMonthlyReport"`); uyumsuzluk çalışma zamanı hatası verir. |
| `summary` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"Get monthly revenue breakdown"`); varsayılan kural için `""` bırakın.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI içinde görünen kısa OpenAPI 3.0 özeti.<br/>*Uyarı:* Swagger / OpenAPI 3.0 ve NWVMC Studio içinde doğrudan görünür; sabit metin yerine `OpenApiConstant` kullanın. |
| `description` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"Aggregates confirmed invoice totals grouped by currency"`); varsayılan kural için `""` bırakın.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI üzerinde uç nokta genişletildiğinde görünen ayrıntılı OpenAPI açıklaması.<br/>*Uyarı:* Swagger / OpenAPI 3.0 ve NWVMC Studio içinde doğrudan görünür; sabit metin yerine `OpenApiConstant` kullanın. |

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

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Statik Spring Web içe aktarımları olmadan @GetMapping yerine geçen saf Java anotasyonu.
- **Çalışma Zamanı Davranışı**: Proxy başlatılırken HTTP GET RequestMappingInfo olarak eşlenir.
- **Nasıl Kullanılır**: `@AutoRestController` arayüz metoduna `@AutoGet("/yol")` ekleyin; genellikle `@ServiceOverride` veya `@CustomQuery` ile kullanılır.
- **Ne Zaman Kullanılır**: Spring Web `@GetMapping` bağımlılığı olmadan saf Java arayüzünde HTTP GET rotası açmak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Veritabanını değiştiren işlemlerde ve standart `@RestController` sınıflarında KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/{id}/summary`); `""` kök yola bağlanır.<br/>`@AutoGet("/{id}/summary")` | Göreli GET yol şablonu (örn. "/metrics"). Boşsa doğrudan basePath köküne bağlanır.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `produces` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json", "text/csv"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Üretilen medya türleri (örn. "text/event-stream", "text/csv").<br/>*Uyarı:* Spring MVC içerik pazarlığı `Accept` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Özel consumes/produces medya türlerini destekleyen saf Java HTTP POST rota bildirimi.
- **Çalışma Zamanı Davranışı**: SpringMvcEndpointBridge içinde HTTP POST işleyicisi olarak kaydedilir.
- **Nasıl Kullanılır**: Oluşturma/eylem metoduna `@AutoPost("/yol")` ekleyin; gövdeyi `@AutoBody`/`@RequestBody` ile bağlayıp `@BusinessAction` veya `@ServiceOverride` kullanın.
- **Ne Zaman Kullanılır**: Kaynak oluşturma, iş komutları veya toplu gönderim POST rotaları için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Salt okunur sorgular (`@AutoGet`), tam değiştirme (`@AutoPut`) veya silme (`@AutoDelete`) için KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/{id}/approve`); `""` kök yola bağlanır.<br/>`@AutoPost("/{id}/approve")` | basePath altındaki göreli POST yol şablonu.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `consumes` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json", "multipart/form-data"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Kabul edilen istek Content-Type türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Content-Type` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |
| `produces` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Yanıtta üretilen medya türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Accept` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Tam kaynak değiştirme için saf Java HTTP PUT rota eşlemesi.
- **Çalışma Zamanı Davranışı**: İşlemsel yürütme içine sarılı HTTP PUT işleyicisi olarak bağlanır.
- **Nasıl Kullanılır**: Tam güncelleme metoduna `@AutoPut("/{id}")` ekleyin; `@AutoVariable` ve `@AutoBody` ile eşleyin.
- **Ne Zaman Kullanılır**: Tam durum yükü alan idempotent kaynak değiştirme işlemleri için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Kısmi tek alan güncellemeleri veya durum geçişleri için KULLANMAYIN (`@AutoPatch` veya `@BusinessAction` seçin).

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/{id}/replace`); `""` kök yola bağlanır.<br/>`@AutoPut("/{id}/replace")` | Göreli PUT yol şablonu (örn. "/{id}").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `consumes` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Desteklenen istek Content-Type türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Content-Type` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |
| `produces` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Üretilen yanıt medya türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Accept` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Kısmi birleştirme, atomik artırım ve RFC 6902 JSON Patch destekli saf Java HTTP PATCH bildirimi.
- **Çalışma Zamanı Davranışı**: JSON birleştirme semantiğini ve application/json-patch+json türünü destekler.
- **Nasıl Kullanılır**: Kısmi güncelleme veya `@BusinessAction` metotlarına `@AutoPatch("/{id}/eylem")` ekleyin.
- **Ne Zaman Kullanılır**: Kısmi alan değişiklikleri, atomik sayaç güncellemeleri ve durum geçişleri için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Tüm varlığın değiştirilmesi gerektiğinde (`@AutoPut`) veya oluşturmada (`@AutoPost`) KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/{id}/status`); `""` kök yola bağlanır.<br/>`@AutoPatch("/{id}/status")` | Göreli PATCH yol şablonu (örn. "/{id}/approve").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `consumes` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json", "application/merge-patch+json"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Kabul edilen Content-Type türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Content-Type` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |
| `produces` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | MIME medya türleri dizisi (örn. `{"application/json"}`); boş `{}` varsayılan `application/json` kullanır.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Üretilen yanıt medya türleri.<br/>*Uyarı:* Spring MVC içerik pazarlığı `Accept` üzerinden uygulanır; uyumsuz üstbilgiler `406` veya `415` döndürür. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Durum korumalı geçici silmeyi tetikleyen saf Java HTTP DELETE bildirimi.
- **Çalışma Zamanı Davranışı**: deleted=true işaretlemeden önce @StateMachine deletableStates değerlerini doğrular.
- **Nasıl Kullanılır**: Özel silme metotlarına genellikle `@ServiceOverride` eşliğinde `@AutoDelete("/{id}/ozel")` ekleyin.
- **Ne Zaman Kullanılır**: Özel arşivleme, soft-delete geçersiz kılma veya kademeli temizleme DELETE uç noktaları için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Yerleşik soft-delete ve `@StateMachine` gereksinimi karşılıyorsa yeniden tanımlamayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | İsteğe bağlı `{pathVar}` şablonlu göreli URI alt yolu (örn. `/{id}/archive`); `""` kök yola bağlanır.<br/>`@AutoDelete("/{id}/archive")` | Göreli DELETE yol şablonu (örn. "/{id}/purge").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Amaç**: URL sorgu parametrelerini veya Map<String, String> dinamik filtre haritalarını bağlar.
- **Çalışma Zamanı Davranışı**: QueryGuardrailEnforcerUtil doğrulamasıyla DynamicQueryParameterParserHelper üzerinden çıkarılır.
- **Nasıl Kullanılır**: Denetleyici arayüzü metot parametrelerine `@AutoParam(name = "status", defaultValue = "ACTIVE")` ekleyin.
- **Ne Zaman Kullanılır**: Denetleyici arayüzünü Spring Web bağımlılığından arındırılmış Pure Java tutarken sorgu parametresi bağlamak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Yol değişkenleri (`@AutoVariable`) veya JSON gövdeleri (`@AutoBody`) için KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"status"`); varsayılan kural için `""` bırakın.<br/>`@AutoParam("status") String status` | Bağlanacak sorgu parametresi adı (name eş anlamlısı).<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `name` yerine önce `value` değerini okur. Çelişkili değerler vermeyin. |
| `name` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"pageSize"`); varsayılan kural için `""` bırakın.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Açık sorgu parametresi adı.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `name` yerine önce `value` değerini okur. Çelişkili değerler vermeyin. |
| `required` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (zorunlu; eksikse HTTP 400 döner) veya `false` (isteğe bağlı; yoksa null geçilir).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Parametre eksik olduğunda HTTP 400 verilip verilmeyeceği.<br/>*Uyarı:* `defaultValue` verildiğinde otomatik opsiyonel olur; `false` iken NPE önlemek için ilkel tip yerine sarmalayıcı (`Integer`) kullanın. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"20"`); varsayılan kural için `""` bırakın.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Parametre yoksa kullanılacak varsayılan değer (varsayılan DEFAULT_NONE).<br/>*Uyarı:* Spring `ConversionService` ile String’den hedef türe dönüştürülür; geçersiz değerler HTTP `400` döndürür. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Amaç**: UUIDv7 varlık kimlikleri gibi URI yol değişkenlerini bağlar.
- **Çalışma Zamanı Davranışı**: MVC yol şablonlarından tiplenmiş Java UUID/String değerlerine ayrıştırılır.
- **Nasıl Kullanılır**: `findById(@AutoVariable("id") UUID id)` gibi yol parametrelerine ekleyin.
- **Ne Zaman Kullanılır**: Pure Java arayüzlerde URI içinden `{id}` veya `{code}` almak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Sorgu parametreleri (`@AutoParam`) veya JSON gövdesi (`@AutoBody`) için KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"orderId"`); varsayılan kural için `""` bırakın.<br/>`@AutoVariable("orderId") UUID orderId` | Bağlanacak URI yol değişkeni adı.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `name` yerine önce `value` değerini okur. Çelişkili değerler vermeyin. |
| `name` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"tenantCode"`); varsayılan kural için `""` bırakın.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Açık yol değişkeni adı.<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `name` yerine önce `value` değerini okur. Çelişkili değerler vermeyin. |
| `required` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (zorunlu; eksikse HTTP 400 döner) veya `false` (isteğe bağlı; yoksa null geçilir).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Yol değişkeninin zorunlu olup olmadığı.<br/>*Uyarı:* Metot URI şablonundaki `{variableName}` ile eşleşmelidir; `false` yalnızca isteğe bağlı URI kalıplarında geçerlidir. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Amaç**: HTTP JSON istek gövdelerini @Valid ile eşleşen DTO veya Entity parametrelerine çözer.
- **Çalışma Zamanı Davranışı**: Servis işlemine girmeden önce LocalValidatorFactoryBean ile doğrulanır.
- **Nasıl Kullanılır**: `@AutoPost`/`@AutoPut`/`@AutoPatch` metot gövde parametresine `@AutoBody` ekleyin.
- **Ne Zaman Kullanılır**: Pure Java proxy denetleyicilerde JSON yükünü DTO veya varlığa dönüştürmek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Gövdesiz GET/DELETE metotlarında ve aynı metotta birden fazla KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (zorunlu; eksikse HTTP 400 döner) veya `false` (isteğe bağlı; yoksa null geçilir).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | İstek gövdesinin zorunlu olup olmadığını belirler.<br/>*Uyarı:* Yönlendirme öncesi Jakarta doğrulaması için `@Valid` ile birlikte kullanın; `false` boş gövdeye `400` vermeden izin verir. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Döngüsel hataları reddederek GET /{id}/{relation}/** üzerinden özyinelemeli alt ilişki gezintisine izin verir.
- **Çalışma Zamanı Davranışı**: Denetleyicide @AutoRestController(enableNestedSubResources = true) ayarını gerektirir.
- **Nasıl Kullanılır**: `enableNestedSubResources = true` yapın ve `@EnableNestedSubResource(allowedRelationships = {"items"})` ile ilişkileri sınırlayın.
- **Ne Zaman Kullanılır**: Her adımda güvenlik ve kiracı denetimiyle `GET /api/v1/customer-orders/{id}/items` gibi iç içe rotalar gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `allowedRelationships` ile sınırlamadan yoğun ilişkili tablolarda AÇMAYIN; düz genişletme için `?expand=` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | GET /{id}/** gezintisinde izin verilen hedef JPA varlık sınıfları.<br/>*Uyarı:* Boş dizi tüm alt varlıkları açar; dahili tabloların sızmasını önlemek için sınıfları açıkça listeleyin. |
| `allowedRelationships` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Alt kaynak URL yollarında izin verilen JPA ilişki alan adları.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"items"`); uyumsuzluk çalışma zamanı hatası verir. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Özel eylem metotlarında bildirimsel alan durum geçişlerini veya sayısal düzenlemeleri tanımlar.
- **Çalışma Zamanı Davranışı**: Güncellenen varlık öznitelikleri kaydedilmeden önce atomik olarak yürütülür.
- **Nasıl Kullanılır**: Denetleyici arayüz metodunda `@AutoPatch` ile `@BusinessAction(...)` anotasyonunu birleştirin.
- **Ne Zaman Kullanılır**: Servis yazmadan tek varlık durum geçişleri, stok artırma/azaltma ve alan metotları için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Çoklu varlık orkestrasyonu veya dış API çağrıları için KULLANMAYIN (`@ServiceOverride` kullanın).

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki yaşam döngüsü durumu alanıyla tam eşleşen Java özellik adı (örn. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Varlık üzerindeki durum alanı adı (@StateMachine varsa doğrulanır).<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"status"`); uyumsuzluk çalışma zamanı hatası verir. |
| `targetStateValue` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"APPROVED"`); varsayılan kural için `""` bırakın.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | İşlem içinde targetStateField alanına atanacak hedef durum değeri.<br/>*Uyarı:* Kaydetmeden önce `@StateMachine` veya `@HumanPolicy` ile doğrulanır; geçersiz geçişler işlemi geri alır. |
| `adjustNumericField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki sayısal alanıyla tam eşleşen Java özellik adı (örn. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Atomik olarak artırılacak veya azaltılacak sayısal varlık alanı adı.<br/>*Uyarı:* `deltaParamIndex >= 0` veya dolu `fixedDelta` gerektirir. İşlem içinde `Integer`, `Long`, `BigDecimal` ve `Double` destekler. |
| `deltaParamIndex` | `int` | `-1` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Dinamik delta değerini taşıyan parametre indeksi (-1 devre dışı bırakır).<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `fixedDelta` yerine önce `deltaParamIndex` değerini okur. Çelişkili değerler vermeyin. |
| `fixedDelta` | `String` | `""` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Parametre kullanılmadığında uygulanacak sabit sayısal delta metni (örn. "100").<br/>*Uyarı:* Başlangıçta kayıt yardımcısı `fixedDelta` yerine önce `deltaParamIndex` değerini okur. Çelişkili değerler vermeyin. |
| `entityMethod` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"markFulfilled"`); varsayılan kural için `""` bırakın.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Aynı işlem içinde varlık üzerinde çalıştırılacak parametresiz alan metodu adı.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"markFulfilled"`); uyumsuzluk çalışma zamanı hatası verir. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean Keşfi, Yapılandırma Bağlama ve Çalışma Sırası (5 Anotasyon)

### `@AutoComponent`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Derleme zamanı @Component içe aktarımı olmadan açılışta kaydedilen bileşen işaretçisi.
- **Çalışma Zamanı Davranışı**: Yalnızca çerçeve paketi (io.github.natswarchuan) içinde taranır; tüketici uygulamaları Spring @Component kullanmalıdır.
- **Nasıl Kullanılır**: `AutoBeanFactoryRegistrarBridge` tarafından `io.github.natswarchuan` paketinde taranan dahili bileşen anotasyonu.
- **Ne Zaman Kullanılır**: YALNIZCA `io.github.natswarchuan.*` paketindeki dahili çerçeve bileşenleri için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Tüketici uygulamalarında (`com.example.*`) ASLA kullanmayın! Spring `@Component` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | ApplicationContext’te kayıtlı tam bean adı (örn. `"invoiceValidationHelper"`) veya otomatik çözümleme için `""`.<br/>`@AutoComponent("invoiceValidationHelper")` | İsteğe bağlı açık bean adı; boşsa sınıf adının camelCase hali kullanılır.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: @ServiceOverride ile eşleşen ServiceImpl sınıfları için servis katmanı işaretçisi.
- **Çalışma Zamanı Davranışı**: io.github.natswarchuan içinde sınıf adıyla kaydedilir; uygulama servisleri Spring @Service kullanmalıdır.
- **Nasıl Kullanılır**: Yalnızca `io.github.natswarchuan` içinde taranan dahili servis anotasyonu.
- **Ne Zaman Kullanılır**: YALNIZCA `io.github.natswarchuan.*` içindeki dahili servisler için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Uygulama servislerinde ASLA kullanmayın; Spring `@Service` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | ApplicationContext’te kayıtlı tam bean adı (örn. `"orderFulfillmentService"`) veya otomatik çözümleme için `""`.<br/>`@AutoService("orderFulfillmentService")` | İsteğe bağlı servis bean adı.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: @AutoConfigurationBean sınıfları içinde yönetilen bean fabrika metotlarını bildirir.
- **Çalışma Zamanı Davranışı**: Otomatik yapılandırma sırasında PureJavaBeanRegistrarBridge tarafından işlenir.
- **Nasıl Kullanılır**: Çerçeve içi `@AutoConfigurationBean` sınıflarındaki fabrika metotlarına ekleyin.
- **Ne Zaman Kullanılır**: YALNIZCA `io.github.natswarchuan.config.*` içindeki çekirdek konfigürasyonlarda kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Uygulama `@Configuration` sınıflarında KULLANMAYIN; standart Spring `@Bean` tercih edin.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Açık bean adları ve takma adlar.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `targetTypeName` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"com.example.spi.PaymentGateway"`); varsayılan kural için `""` bırakın.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Dinamik köprü eşlemesi için isteğe bağlı tam sınıf adı.<br/>*Uyarı:* Fabrika metodu üst tür veya proxy döndürdüğünde isteğe bağlı FQCN ipucu verir; sınıf classpath’te bulunmalıdır. |
| `primary` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (birden fazla aday olduğunda öncelikli bean) veya `false` (standart öncelik).<br/>`@AutoBean(primary = true)` | Çoklu aday çakışmasında bu beani birincil olarak işaretler.<br/>*Uyarı:* Aynı tür için iki `@AutoBean(primary = true)` tanımlamak açılışta belirsizlik çakışmasına yol açar. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Yapılandırma sınıflarını ve YAML özellik bağlama modellerini işaretler.
- **Çalışma Zamanı Davranışı**: Yapılandırma bean’lerini ve YAML öneklerini IDE metaverisiyle temiz biçimde kaydeder.
- **Nasıl Kullanılır**: `io.github.natswarchuan.config.*` içindeki yapılandırma sınıflarını işaretler.
- **Ne Zaman Kullanılır**: YALNIZCA çerçeve kütüphanesi içinde Pure Java `@Configuration` karşılığı olarak kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Uygulama yapılandırma sınıflarında KULLANMAYIN; Spring `@Configuration` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | ApplicationContext’te kayıtlı tam bean adı (örn. `"storageAutoConfig"`) veya otomatik çözümleme için `""`.<br/>`@AutoConfigurationBean("storageAutoConfig")` | İsteğe bağlı yapılandırma bean kimliği.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `prefix` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"nwvmc.storage"`); varsayılan kural için `""` bırakın.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | YAML özellik ön eki (örn. "app.framework.cache").<br/>*Uyarı:* `application.yml` içindeki kebab-case özellikleri bağlar; IDE uyarısı olmaması için metadata ile eşleştirin. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Amaç**: SPI Customizer bean’leri ile filtre zincirleri arasındaki yürütme önceliğini yönetir.
- **Çalışma Zamanı Davranışı**: Daha küçük tam sayı değerleri daha önce çalışır (varsayılan Integer.MAX_VALUE).
- **Nasıl Kullanılır**: Sıralı bileşen veya özelleştiricilere `@OrderPriority(1)` ekleyin.
- **Ne Zaman Kullanılır**: Birden fazla SPI özelleştiricisinin kesin sırayla çalışması gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Spring Security filtre sırası veya `?sort=` sorgu sıralaması ile KARIŞTIRMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Yürütme önceliği; düşük değerler daha önce çalışır.<br/>*Uyarı:* Küçük tam sayılar ÖNCE çalışır (Spring `@Order` gibi). `< 0` güvenlik/izleme, `10..100` iş katmanı için ayrılmalıdır. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Varlık Güvenliği, Durum Makinesi, Bütünlük, Otomatik Üreticiler ve Sorgular (11 Anotasyon)

### `@EntitySecurity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Sorgu veya değişiklik öncesinde NIST Level 2 RBAC, ownerField izolasyonu ve izin kodlarını zorunlu kılar.
- **Çalışma Zamanı Davranışı**: SQL yürütülmeden önce değerlendirilir; yetkisiz erişim HTTP 403 Forbidden fırlatır.
- **Nasıl Kullanılır**: JPA `@Entity` sınıfına ekleyerek okuma/yazma/silme rollerini ve gerekirse `ownerField` alanını tanımlayın.
- **Ne Zaman Kullanılır**: REST, toplu işlem, dışa aktarma ve GraphQL katmanlarını korumak için her açık varlıkta kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `AutoReadApi<E>`, `disabledEndpoints` veya `@SecurityPolicyEntity` olmadan tam `AutoApiController<E>` üzerinde `permitAll = true` KULLANMAYIN (READ, WRITE ve DELETE denetimlerini atlar).

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_USER", "ROLE_ADMIN"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Kayıt okuma yetkisine sahip roller (GET, GraphQL, dışa aktarma).<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |
| `writeRoles` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Yazma (POST/PUT/PATCH/içe aktarma) yetkisine sahip roller.<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |
| `deleteRoles` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Silme (DELETE / toplu silme) yetkisine sahip roller.<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |
| `permitAll` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (kimlik doğrulamasız genel erişime izin ver) veya `false` (kimlik doğrulama ve rol kontrolünü zorunlu kıl).<br/>`@EntitySecurity(permitAll = true)` | true olduğunda (DB-RBAC kuralı yoksa) READ, WRITE ve DELETE kontrollerini atlar; genel kataloglarda AutoReadApi<E> veya disabledEndpoints ile kullanın.<br/>*Uyarı:* Rol kontrollerini devre dışı bırakır ve anonim erişime izin verir. PII veya finansal varlıklarda asla açmayın. |
| `ownerField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki sahip/UUID alanıyla tam eşleşen Java özellik adı (örn. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Kayıt sahibini tutan alan ("createdBy"); IDOR saldırılarını önler.<br/>*Uyarı:* `GET`/`PUT`/`PATCH`/`DELETE` için satır düzeyinde sahiplik uygular; `bypassOwnerRoles` dışındakiler yalnızca kendi kayıtlarına erişir. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | `ownerField` sahiplik kontrolünü atlayabilen ayrıcalıklı roller.<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |
| `permissions` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ORDER_READ", "ORDER_APPROVE"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Rollerle birlikte değerlendirilen ince taneli izin kodları.<br/>*Uyarı:* JWT veya DB-RBAC `@SecurityPermissionEntity` içindeki ince taneli izinlere karşı değerlendirilir. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: Çağıranın rolleri yetersiz olduğunda hassas sütunları dinamik olarak maskeler veya null yapar.
- **Çalışma Zamanı Davranışı**: Veri çekildikten sonra JSON serileştirmeden hemen önce uygulanır.
- **Nasıl Kullanılır**: Hassas alanlara (`costPrice`, `ssn`) ekleyin; maskeleme izole kopyalar üzerinde çalışır.
- **Ne Zaman Kullanılır**: Aynı API’de farklı rollere göre bazı hassas alanların gizlenmesi gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: String olmayan türler zaten otomatik `null` olur; `String` alanların `"******"` yerine `null` dönmesi için `nullifyInsteadOfMask = true`, anahtarı gizlemek için `readDto` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Maskelenmemiş orijinal değeri görmeye yetkili roller.<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |
| `maskPattern` | `String` | `"******"` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"***-**-****"`); varsayılan kural için `""` bırakın.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Yetki yetersizliğinde String alanlara uygulanan maske metni.<br/>*Uyarı:* `nullifyInsteadOfMask = true` iken yok sayılır. String olmayan alanlarda (`BigDecimal`, `LocalDate`) JSON tür güvenliği için `nullifyInsteadOfMask = true` önerilir. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (yetkisiz alanı JSON null ile değiştir) veya `false` (maskPattern dizesini uygula).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true olduğunda String alanları da maskPattern yerine null yapar (String olmayan türler otomatik null olur).<br/>*Uyarı:* Sayısal, tarih ve nesne alanlarında TypeScript/Zod istemcilerinin geçerli `null` alması için gereklidir. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: POST /{id}/transition için izin verilen geçişleri uygular ve DELETE /{id} işlemini deletableStates ile sınırlar.
- **Çalışma Zamanı Davranışı**: Geçersiz geçiş veya silme işlemlerini HTTP 422 BusinessRuleViolationException ile reddeder.
- **Nasıl Kullanılır**: String durum alanına `:` ayracı kullanarak (`"CREATED:PAID,CANCELLED"`) ekleyin.
- **Ne Zaman Kullanılır**: Sipariş, kredi veya fatura gibi sıkı yaşam döngüsü kurallarında geçersiz geçişleri (`422`) engellemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: ASLA `"->"` söz dizimini kullanmayın (`EntityStateMachineUtil` yalnızca `":"` ile böler)!

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"CREATED"`); varsayılan kural için `""` bırakın.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Kayıt oluşturulurken alan boşsa atanan başlangıç durumu ("ACTIVE").<br/>*Uyarı:* `POST` oluşturmada alan boşsa otomatik atanır; `transitions` içindeki `:` öncesi başlangıç durumuyla eşleşmelidir. |
| `transitions` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | İki nokta biçiminde izin verilen geçiş kuralları: "FROM:TO_1,TO_2".<br/>*Uyarı:* Kesin iki nokta sözdizimini `"FROM:TO1,TO2"` (virgülle ayrılmış hedefler) zorlar. Tanımsız geçişler HTTP `422` ile reddedilir. |
| `deletableStates` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | DELETE işlemine izin verilen durum listesi (aksi halde HTTP 422 döner).<br/>*Uyarı:* Boş değilse, varlık başka bir durumdayken (örn. `"PAID"`) `DELETE /{id}` HTTP `422 Unprocessable Entity` döndürür. |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Okunabilir politika ifadelerini etkin RBAC, geçiş ve maskeleme kurallarına derler.
- **Çalışma Zamanı Davranışı**: GET /human-policy üzerinden incelenebilir ve spring-nwvmc.human-policies.<Entity> altında YAML ile geçersiz kılınabilir.
- **Nasıl Kullanılır**: Varlık üzerine `@HumanPolicy` ekleyin veya YAML `spring-nwvmc.human-policies` ile yapılandırın.
- **Ne Zaman Kullanılır**: Ürün/uyumluluk ekiplerinin kod değiştirmeden okunabilir politika kuralları tanımlaması gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Rastgele serbest metin veya İngilizce dışı dil YAZMAYIN; derleyici belirli kalıpları tanır.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Durum geçişlerine derlenen doğal İngilizce yaşam döngüsü kuralı.<br/>*Uyarı:* Başlangıçta `@StateMachine` ile aynı motora derlenir; aynı varlıkta çelişkili kurallar tanımlamayın. |
| `security` | `String` | `""` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Okuma/yazma/silme kuralları için doğal İngilizce RBAC yönergesi.<br/>*Uyarı:* Rol adları otomatik olarak `ROLE_` önekiyle normalize edilir ve hatalı cümleler açılışta hata verir. |
| `masking` | `String` | `""` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Maskelenecek alanları ve izinli rolleri belirten İngilizce kural.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"costPrice"`); uyumsuzluk çalışma zamanı hatası verir. |
| `stateField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki yaşam döngüsü durumu alanıyla tam eşleşen Java özellik adı (örn. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | `lifecycle` tarafından yönetilen varlık durum alanı adı.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"orderStatus"`); uyumsuzluk çalışma zamanı hatası verir. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Zaman Yolculuğu durum yeniden yapılandırması ve /diff denetimi için alan düzeyinde farkları kaydeder.
- **Çalışma Zamanı Davranışı**: Oluşturma, güncelleme, yama, geçiş ve geri yükleme sırasında oldValue/newValue farklarını yakalar.
- **Nasıl Kullanılır**: `BaseAuditEntity` alt sınıflarına ekleyin; tüm mutasyonlar `AuditTrailService` tarafından kaydedilir.
- **Ne Zaman Kullanılır**: Denetim ve Time-Travel geçmişi gerektiren ödeme, sipariş, hesap varlıklarında kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Çok yüksek yazma hacimli log/telemetri tablolarında `recordFieldDiffs = true` kullanmaktan kaçının.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"FINANCE_LEDGER"`); varsayılan kural için `""` bırakın.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Her değişiklik kaydına eklenen denetim kategorisi.<br/>*Uyarı:* Denetim günlüklerini alan bazında etiketler; `""` bırakılırsa JPA varlık sınıf adı kullanılır. |
| `recordFieldDiffs` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true ise Time-Travel için eski ve yeni alan farklarını (diff) kaydeder.<br/>*Uyarı:* Her `PUT`/`PATCH` işleminde önce/sonra alan farklarını kaydeder; büyük alanlarda veya yoğun yazmada `false` yapın. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: Atlama rolü bulunmadıkça satır sorgularını ve değişiklikleri etkin kiracı bağlamına göre otomatik yalıtır.
- **Çalışma Zamanı Davranışı**: Atlama rolü olmadan kiracı bağlamı eksikse HTTP 403 döndürür; oluşturmada tenantId sahteciliğini ezer ve tüm ID işlemlerinde IDOR koruması uygular.
- **Nasıl Kullanılır**: SaaS varlığına ekleyin; okuma filtresi, oluşturmada sahtecilik önleme ve `403` kilidi otomatik çalışır.
- **Ne Zaman Kullanılır**: Çok kiracılı paylaşılan tüm SaaS tablolarında kiracılar arası sızıntıyı önlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Ülke/para birimi gibi tüm kullanıcıların görmesi gereken küresel referans tablolarında KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Hayır (İsteğe Bağlı) | Varlık üzerindeki kiracı kimliği alanıyla tam eşleşen Java özellik adı (örn. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Kiracı kimliğini tutan alan adı (varsayılan "tenantId").<br/>*Uyarı:* Hızlı ve güvenli kiracı izolasyonu için veritabanında `(tenant_id, id)` bileşik indeksi oluşturun. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Hayır (İsteğe Bağlı) | Spring Security rol adları dizisi (örn. `{"ROLE_SUPER_ADMIN"}`); boş `{}` bu işlem için ek kısıtlama koymaz.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Tüm kiracılara erişebilen platform geneli roller.<br/>*Uyarı:* Rol adlarını Spring Security `GrantedAuthority` ile uyumlu olacak şekilde `ROLE_` önekiyle `RoleConstant` içinde tutun. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: Oluşturma, güncelleme ve upsert işlemlerinde kalıcılıktan önce benzersizliği doğrular.
- **Çalışma Zamanı Davranışı**: Yinelenen değer bulunduğunda ConflictBusinessException (HTTP 409) fırlatır.
- **Nasıl Kullanılır**: `email`, `skuCode` gibi alanlara `@Column(unique = true)` ile birlikte ekleyin.
- **Ne Zaman Kullanılır**: Soft-delete edilenleri dışarıda bırakıp temiz `HTTP 409 Conflict` hatası döndürmek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Yüksek eşzamanlılıkta DB `UNIQUE` kısıtlaması olmadan tek başına GÜVENMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: Boş bırakıldığında oluşturma veya klonlamada önekli benzersiz iş kodları otomatik üretir.
- **Çalışma Zamanı Davranışı**: Doğrulama ve kayıttan önce önek + benzersiz belirteci doldurur.
- **Nasıl Kullanılır**: String kod alanına `@AutoCode(prefix = "PRD-")` ekleyin; boş gelirse otomatik üretilir.
- **Ne Zaman Kullanılır**: DB sekans darboğazı olmadan okunabilir sipariş, SKU veya mağaza kodu üretmek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Yasal olarak kesintisiz ardışık numara (`1, 2, 3...`) zorunluysa KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Zorunlu (varsayılan yok)` | **Evet (Zorunlu)** | Zorunlu boş olmayan ön ek (örn. `"PRD-"`, `"INV-"`) — atlanırsa derleme başarısız olur.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | 8 karakterlik UUIDv7 özetinin önüne eklenen zorunlu kod ön eki (örn. "PRD-").<br/>*Uyarı:* Zorunlu öznitelik; oluşturma/klonlama sırasında alan boşsa 8 karakterlik UUIDv7 özeti (`INV-0194E1A0`) ekler, gönderilen kodu korur. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: sourceField üzerinden URL dostu normalize edilmiş ASCII slug değerlerini otomatik üretir.
- **Çalışma Zamanı Davranışı**: Unicode aksan işaretlerini normalleştirir ve slug filtresiyle sorgulamayı destekler.
- **Nasıl Kullanılır**: `slug` alanına `@AutoSlug(sourceField = "name")` ekleyin.
- **Ne Zaman Kullanılır**: Mağaza, blog, kategori ve ürün katalogları için SEO uyumlu URL üretmek amacıyla kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Var olmayan bir alanı `sourceField` olarak VERMEYİN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Zorunlu (varsayılan yok)` | **Evet (Zorunlu)** | Varlık üzerindeki String alanıyla tam eşleşen Java özellik adı (örn. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Küçük harfli ASCII slug değerine dönüştürülecek zorunlu kaynak alan adı.<br/>*Uyarı:* Zorunlu öznitelik; aksanlı metni URL güvenli kebab-case biçimine çevirir. Benzersizlik için `@UniqueField` ile kullanın. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Amaç**: Varlık değişikliklerini kaydetmeden önce türetilmiş sayısal toplamları temiz biçimde hesaplar.
- **Çalışma Zamanı Davranışı**: Geçersiz sourceFields tanımlarının hızlı başarısız olması için açılışta ComputedFieldFailFastUtil ile doğrulanır.
- **Nasıl Kullanılır**: Türetilmiş `BigDecimal` alanına ekleyin; kayıt öncesi sunucuda yeniden hesaplanır.
- **Ne Zaman Kullanılır**: İstemci manipülasyonunu önlemek için satır toplamları ve sipariş genel toplamlarını sunucuda hesaplamak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Karmaşık kademeli indirimler veya dış API gerektiren fiyatlandırmalarda KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Hesaplama modu: "MULTIPLY" veya "SUM_COLLECTION".<br/>*Uyarı:* Kaydetmeden önce otomatik yeniden hesaplanır ve istemcinin manipüle ettiği toplamları geçersiz kılar. |
| `sourceFields` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | "MULTIPLY" modunda çarpılacak aynı varlık alanları.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"unitPrice"`); uyumsuzluk çalışma zamanı hatası verir. |
| `collectionField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki @OneToMany koleksiyon alanıyla tam eşleşen Java özellik adı (örn. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" modunda toplanacak @OneToMany alt koleksiyon alanı.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"items"`); uyumsuzluk çalışma zamanı hatası verir. |
| `itemField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki sayısal alanıyla tam eşleşen Java özellik adı (örn. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Her alt öğeden toplanacak sayısal alan adı (örn. "subTotal").<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"subTotal"`); uyumsuzluk çalışma zamanı hatası verir. |
| `subtractField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki sayısal alanıyla tam eşleşen Java özellik adı (örn. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Toplamdan düşülecek isteğe bağlı indirim alanı.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"discountAmount"`); uyumsuzluk çalışma zamanı hatası verir. |
| `addField` | `String` | `""` | Hayır (İsteğe Bağlı) | Varlık üzerindeki sayısal alanıyla tam eşleşen Java özellik adı (örn. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Sonuca eklenecek isteğe bağlı ek ücret alanı (örn. "shippingFee").<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"shippingFee"`); uyumsuzluk çalışma zamanı hatası verir. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: Denetleyici uç noktalarına özel SQL/JPQL sorguları veya sağlayıcı metotları bağlar.
- **Çalışma Zamanı Davranışı**: JPA EntityManager üzerinden bağlı adlandırılmış parametrelerle yürütülür.
- **Nasıl Kullanılır**: `@AutoGet`/`@AutoPost` ile birleştirip `:param` değerlerini `@AutoParam` ile bağlayın.
- **Ne Zaman Kullanılır**: Repository yazmadan yerel SQL raporları, CTE ve pencere fonksiyonları için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: SQL içine kullanıcı girdisini ASLA birleştirmeyin (`:param` kullanın) ve alanlar arası JOIN yapmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Adlandırılmış `:param` destekli satır içi SQL veya JPQL sorgusu.<br/>*Uyarı:* SQL enjeksiyonuna karşı daima `:param` veya `?1` bağlama kullanın; `sqlProvider` ile `""` bırakın. |
| `nativeQuery` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (yerel veritabanı SQL çalıştır) veya `false` (taşınabilir JPA JPQL çalıştır).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true ise yerel SQL, false ise JPQL çalıştırır.<br/>*Uyarı:* Yerel SQL (`true`) CTE ve pencere fonksiyonları sağlar; H2/PostgreSQL/MySQL taşınabilirliği için `false` (JPQL) kullanın. |
| `resultClass` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Herhangi bir somut Java DTO sınıfı (örn. `MonthlyRevenueDto.class`) veya DTO eşlemesini kapatmak için `Void.class`.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Sonuç satırlarının eşleneceği isteğe bağlı sınıf.<br/>*Uyarı:* Toplama sorgularında `SELECT *` yükünü önlemek ve tür güvenliği için her zaman DTO projeksiyon sınıfı belirtin. |
| `sqlProvider` | `Class<?>` | `Void.class` | Hayır (İsteğe Bağlı) | Somut Pure Java SQL sağlayıcı sınıfı (örn. `OrderAnalyticsSqlProvider.class`) veya satır içi `value` için `Void.class`.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Başlangıçta doğrulanan programatik SQL sağlayıcı sınıfı.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `sqlProvider` trafik almadan önce hızlıca hata verir. |
| `providerMethod` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"buildRevenueSql"`); varsayılan kural için `""` bırakın.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | `sqlProvider` içinde SQL dizesi döndüren metot adı.<br/>*Uyarı:* Java metot/alan adıyla büyük/küçük harf duyarlı tam eşleşmelidir (örn. `"buildRevenueSql"`); uyumsuzluk çalışma zamanı hatası verir. |
| `modifying` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (yazma işleminde UPDATE/DELETE DML çalıştır) veya `false` (salt okunur SELECT sorgusu).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE sorguları için `true` olmalıdır.<br/>*Uyarı:* `UPDATE`/`DELETE` ifadeleri için `true` zorunludur; otomatik yazma işlemi açar. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Veritabanı Tabanlı Dinamik RBAC ve Alan Maskeleme Meta-Anotasyonları (18 Anotasyon)

### `@SecurityRoleEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Amaç**: Bir JPA varlığını canlı veritabanı RBAC Rol katalog tablosu olarak işaretler.
- **Çalışma Zamanı Davranışı**: DynamicDatabaseRbacProviderHelper rol-izin eşlemelerini Caffeine içinde önbellekler ve yazmada temizler.
- **Nasıl Kullanılır**: Role JPA varlığına `@SecurityRoleEntity` ekleyin ve zorunlu `@RoleCode` alanını işaretleyin.
- **Ne Zaman Kullanılır**: Yöneticilerin rolleri veritabanından dinamik olarak yönetmesi gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `@RoleCode` olmadan KULLANMAYIN (başlangıçta hata verir) ve birden fazla tanımlamayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 1`); örn. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Roller yeniden yüklenmeden önceki Caffeine önbellek süresi (saniye).<br/>*Uyarı:* Kısa TTL değişiklikleri hızlı yansıtır ancak sorguyu artırır; uzun TTL yükü azaltır fakat yetki iptalini geciktirir. |

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

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityRoleEntity içindeki benzersiz rol kodu sütununu eşler.
- **Çalışma Zamanı Davranışı**: GrantedAuthority belirteçleriyle eşleşmek için önbellekli LambdaAccessorUtil ile okunur.
- **Nasıl Kullanılır**: `@SecurityRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@RoleCode` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityRoleEntity üzerinde insan tarafından okunabilir rol görünen adını tanımlar.
- **Çalışma Zamanı Davranışı**: RBAC tanılama metaverilerinde ve Dev Studio rol inceleme uç noktalarında sunulur.
- **Nasıl Kullanılır**: `@SecurityRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@RoleName` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: Bir rol varlığında verilen izin kodlarını tutan koleksiyon veya CSV alanını işaretler.
- **Çalışma Zamanı Davranışı**: Dinamik olarak ayrıştırılır ve SecurityIdentityCustomizer yetkilerine genişletilir.
- **Nasıl Kullanılır**: `@SecurityRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@RolePermissions` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Amaç**: Kaynak-eylem izinlerini ve dinamik alan maskeleme kurallarını tutan JPA varlığını işaretler.
- **Çalışma Zamanı Davranışı**: Kaynak düzeyi CRUD erişimi ve alan maskeleme için DatabaseRbacRuleMatcherHelper içine yüklenir.
- **Nasıl Kullanılır**: Permission varlığına `@SecurityPermissionEntity` ve zorunlu `@PermissionCode` ekleyin.
- **Ne Zaman Kullanılır**: Veritabanında ince taneli kaynak/işlem izinleri ve alan maskeleme yönetirken kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `@PermissionCode` olmadan ve birden fazla `@SecurityPermissionEntity` ile kullanmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 1`); örn. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | İzin anlık görüntüsü için Caffeine önbellek süresi (saniye).<br/>*Uyarı:* Kısa TTL değişiklikleri hızlı yansıtır ancak sorguyu artırır; uzun TTL yükü azaltır fakat yetki iptalini geciktirir. |

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

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPermissionEntity içindeki benzersiz izin tanımlayıcı alanını belirtir.
- **Çalışma Zamanı Davranışı**: Çağıranın yetkileri ve @EntitySecurity.permissions() kodlarıyla eşleştirilir.
- **Nasıl Kullanılır**: `@SecurityPermissionEntity` varlığı içindeki ilgili alan veya getter üzerine `@PermissionCode` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPermissionEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPermissionEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPermissionEntity içinde hedef varlık veya API kaynak adını (veya *) eşler.
- **Çalışma Zamanı Davranışı**: DatabaseRbacRuleMatcherHelper tarafından büyük/küçük harf duyarsız ve joker destekli değerlendirilir.
- **Nasıl Kullanılır**: `@SecurityPermissionEntity` varlığı içindeki ilgili alan veya getter üzerine `@PermissionResource` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPermissionEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPermissionEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPermissionEntity kuralıyla korunan CRUD veya özel eylem fiilini eşler.
- **Çalışma Zamanı Davranışı**: Denetleyici metot adlarından otomatik olarak READ, WRITE, DELETE veya özel eyleme normalleştirilir.
- **Nasıl Kullanılır**: `@SecurityPermissionEntity` varlığı içindeki ilgili alan veya getter üzerine `@PermissionAction` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPermissionEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPermissionEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: Bu DB izin kuralı tetiklendiğinde dinamik maskelenecek virgülle ayrılmış alanları belirtir.
- **Çalışma Zamanı Davranışı**: HTTP JSON yanıtı serileştirilmeden önce @FieldSecurity ile birlikte dinamik uygulanır.
- **Nasıl Kullanılır**: `@SecurityPermissionEntity` varlığı içindeki ilgili alan veya getter üzerine `@PermissionFieldMask` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPermissionEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPermissionEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Amaç**: Kimliği doğrulanmış kullanıcıları DB rolleriyle ve isteğe bağlı kiracı kapsamıyla bağlayan varlığı işaretler.
- **Çalışma Zamanı Davranışı**: JWT / SecurityContext yüklenirken SecurityIdentityCustomizer aracılığıyla otomatik sorgulanır.
- **Nasıl Kullanılır**: Kullanıcı-rol birleşim varlığına ekleyin ve `@UserRoleSubject` ile `@UserRoleCode` işaretleyin.
- **Ne Zaman Kullanılır**: JWT yalnızca kullanıcı adını taşırken etkin rollerin veritabanından dinamik yüklenmesi gerektiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `@UserRoleSubject` unutmayın; harici IdP zaten JWT içinde tüm rolleri veriyorsa gerekmez.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@SecurityUserRoleEntity(enabled = true)` | Bu tablodan kullanıcı-rol eşlemelerini yüklemeyi açıp kapatma anahtarı.<br/>*Uyarı:* Şema geçişi sırasında geçici olarak `false` yapılırsa JWT rolleri çalışmaya devam eder. |

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

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityUserRoleEntity üzerindeki asıl özne / kullanıcı adı alanını tanımlar.
- **Çalışma Zamanı Davranışı**: Etkin SecurityContext içindeki Authentication.getName() değeriyle eşleştirilir.
- **Nasıl Kullanılır**: `@SecurityUserRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@UserRoleSubject` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityUserRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityUserRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityUserRoleEntity içindeki atanmış rol kodu sütununu bağlar.
- **Çalışma Zamanı Davranışı**: Politikalar değerlendirilirken bağlantılı @SecurityRoleEntity izinlerini çözer.
- **Nasıl Kullanılır**: `@SecurityUserRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@UserRoleCode` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityUserRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityUserRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityUserRoleEntity atamasını belirli bir kiracı kimliğine (veya genel için *) sınırlar.
- **Çalışma Zamanı Davranışı**: Her kimliği doğrulanmış istekte TenantContextHolder / X-Tenant-ID değerine göre filtrelenir.
- **Nasıl Kullanılır**: `@SecurityUserRoleEntity` varlığı içindeki ilgili alan veya getter üzerine `@UserRoleTenantId` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityUserRoleEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityUserRoleEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Amaç**: priority değerine göre sıralanan açık ALLOW / DENY yetkilendirme politikalarını tutan varlığı işaretler.
- **Çalışma Zamanı Davranışı**: Açık DENY kuralı deterministik olarak ALLOW’u geçersiz kılar ve SQL öncesi değerlendirilir.
- **Nasıl Kullanılır**: Politika varlığına `@SecurityPolicyEntity` ve zorunlu `@PolicyAllowedRoles`, `@PolicyEffect` ekleyin.
- **Ne Zaman Kullanılır**: Statik `@EntitySecurity` ayarlarını veritabanı kurallarıyla (acil `DENY` dahil) dinamik geçersiz kılmak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `@PolicyAllowedRoles` olmadan kullanmayın; açık `DENY` kuralı `ALLOW` üzerine baskın çıkar.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Hayır (İsteğe Bağlı) | tamsayı öncelik cinsinden pozitif sayı (`>= 0`); örn. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Çakışan politikalar için öncelik değeri (küçük sayı yüksek öncelik).<br/>*Uyarı:* Birden fazla politika eşleştiğinde düşük değer önceliklidir (örn. `10`, `100` değerini ezer). |

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

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPolicyEntity içinde hedef kaynak tanımlayıcı desenini eşler.
- **Çalışma Zamanı Davranışı**: Tam varlık/kaynak adlarının yanı sıra * joker eşleşmesini destekler.
- **Nasıl Kullanılır**: `@SecurityPolicyEntity` varlığı içindeki ilgili alan veya getter üzerine `@PolicyResource` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPolicyEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPolicyEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPolicyEntity içindeki korunan işlem fiilini (READ, WRITE, DELETE, methodName, *) eşler.
- **Çalışma Zamanı Davranışı**: Servis delegasyonundan önce her HTTP işlemi için değerlendirilir.
- **Nasıl Kullanılır**: `@SecurityPolicyEntity` varlığı içindeki ilgili alan veya getter üzerine `@PolicyAction` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPolicyEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPolicyEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPolicyEntity kuralının hedeflediği rol koleksiyonunu veya CSV dizesini eşler.
- **Çalışma Zamanı Davranışı**: Etkin JWT yetkileri ve DB’den yüklenen @SecurityUserRoleEntity rolleriyle karşılaştırılır.
- **Nasıl Kullanılır**: `@SecurityPolicyEntity` varlığı içindeki ilgili alan veya getter üzerine `@PolicyAllowedRoles` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPolicyEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPolicyEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Amaç**: @SecurityPolicyEntity kuralında ALLOW veya DENY karar sonucunu belirtir.
- **Çalışma Zamanı Davranışı**: Eşleşen herhangi bir DENY politikası isteği derhal HTTP 403 AccessDeniedBusinessException ile durdurur.
- **Nasıl Kullanılır**: `@SecurityPolicyEntity` varlığı içindeki ilgili alan veya getter üzerine `@PolicyEffect` ekleyin.
- **Ne Zaman Kullanılır**: Mevcut veritabanı sütun adlarını değiştirmeden `@SecurityPolicyEntity` alanını DB-RBAC motoruna eşlemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Aynı sınıfta birden fazla alana veya `@SecurityPolicyEntity` olmayan sınıfa EKLEMEYİN.

> **İşaretleyici Anotasyon (Marker Annotation)**: Herhangi bir öznitelik tanımlamayan saf işaretleyici anotasyon.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Dağıtık Kilit, İdempotans, Önbellekleme, Çoklu DB ve CloudEvents (13 Anotasyon)

### `@DistributedLock`

- **Paket**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Amaç**: AST haritasında (maks 1024) önbelleklenen SpEL anahtarlarında eşzamanlı erişimi sıralar (varsayılan 3000L/5000L).
- **Çalışma Zamanı Davranışı**: Zaman aşımında DistributedLockAspect HTTP 409 DistributedLockAcquisitionException fırlatır.
- **Nasıl Kullanılır**: Final olmayan `@Service` metoduna ekleyin; küme ortamında Redis `DistributedLockProvider` tanımlayın.
- **Ne Zaman Kullanılır**: Stok aşımı, eşzamanlı cüzdan düşümü veya yarış durumlarını engellemek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Varsayılan Caffeine sağlayıcısının çoklu podlarda çalıştığını SANMAYIN ve `final` sınıflarda kullanmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Hayır (İsteğe Bağlı) | Metot parametrelerine başvuran SpEL ifadesi (örn. `"'inventory:' + #skuId"`) veya otomatik anahtar için `""`.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Çalışma zamanında değerlendirilen SpEL kilit anahtarı ifadesi.<br/>*Uyarı:* Kilit anahtarını daima en dar kaynak kimliğine (`#id`) sabitleyin; sabit anahtar tüm trafiği sıraya sokar. |
| `waitTimeMs` | `long` | `3000L` | Hayır (İsteğe Bağlı) | milisaniye cinsinden pozitif sayı (`>= 0`); örn. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Kilidi almak için maksimum bekleme süresi (ms, varsayılan 3000L).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: çok düşük değer sahte 409 çakışması üretir; çok yüksek değer yoğunlukta iş parçacıklarını bekletir. |
| `leaseTimeMs` | `long` | `5000L` | Hayır (İsteğe Bağlı) | milisaniye cinsinden pozitif sayı (`>= 100`); örn. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Kilidin tutulacağı maksimum kiralama süresi (ms, varsayılan 5000L).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: p99 işlem süresini aşmalıdır; aksi halde kilit yazma ortasında düşüp veri bozulmasına yol açar. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Yapılandırılabilir TTL pencerelerinde eşzamanlı veya tekrarlanan yinelenen yazmaları önler.
- **Çalışma Zamanı Davranışı**: IdempotencyAspect + ProxyIdempotencyGuardHelper Caffeine TTL kilidi uygular (HTTP 409 ConflictBusinessException); anahtar yoksa geçer, IdempotencyManagerHelper isteğe bağlı SHA-256 sunar.
- **Nasıl Kullanılır**: `@AutoRestController` veya final olmayan `@Service` metoduna ekleyin; hata halinde anahtar serbest kalır.
- **Ne Zaman Kullanılır**: Ödeme alma, para transferi ve çift gönderime açık POST işlemlerinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: GET okuma uçlarında ve çoklu podda Redis `IdempotencyStoreProvider` olmadan KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Hayır (İsteğe Bağlı) | Geçerli HTTP üstbilgi adı (ağda büyük/küçük harfe duyarsız, örn. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | İstemci benzersizlik anahtarını taşıyan HTTP başlığı.<br/>*Uyarı:* İstemci her işlemde benzersiz UUIDv7 göndermeli ve yeniden denemede aynı başlığı kullanmalıdır; CORS `allowedHeaders` listesine ekleyin. |
| `ttlSeconds` | `long` | `300L` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 1`); örn. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Aynı anahtarın yeniden gönderiminde HTTP 409 döndürülecek süre (300L).<br/>*Uyarı:* Yanıtın Redis/bellekte tutulma süresidir; istemci yeniden deneme aralığına göre `300L–86400L` ayarlayın. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: IP, Kullanıcı veya Kiracı bölümlemesine göre kayan pencereli hız sınırlaması uygular.
- **Çalışma Zamanı Davranışı**: nwvmc.ratelimit.rejected.total metriğini artırır ve HTTP 429 Too Many Requests yanıtı döner.
- **Nasıl Kullanılır**: Denetleyici arayüzüne veya metoduna ekleyin; `X-RateLimit-Remaining`/`X-RateLimit-Reset` yazar ve aşımda `HTTP 429` + `Retry-After` döndürür.
- **Ne Zaman Kullanılır**: Herkese açık arama, kimlik doğrulama, AI sorguları ve ağır dışa aktarımları korumak için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Sağlık kontrollerini sıkılaştırmayın ve kullanıcı/kiracı izolasyonu gerektiğinde `"GLOBAL"` yerine `"USER"`, `"TENANT"` veya `"IP"` kullanın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Hayır (İsteğe Bağlı) | istek cinsinden pozitif sayı (`>= 1`); örn. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Zaman penceresi başına izin verilen maksimum istek sayısı (60).<br/>*Uyarı:* HTTP `429` döndüğünde `X-RateLimit-Remaining`, `X-RateLimit-Reset` ve RFC 6585 `Retry-After` başlıklarını ekler. |
| `windowSeconds` | `int` | `60` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 1`); örn. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Hız sınırlama penceresi süresi (saniye, varsayılan 60).<br/>*Uyarı:* Sayaç pencere süresini belirler ve `X-RateLimit-Reset` ile `Retry-After` değerlerini hesaplar. |
| `partitionKey` | `String` | `"IP"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Bölümleme stratejisi: "IP"/"clientIp", "USER" (anonimde IP yedeği), "TENANT", "GLOBAL" veya SpEL "#expr".<br/>*Uyarı:* `"USER"` kimliği doğrulanmış kullanıcıya göre ayırır (anonimde IP’ye düşer); `"GLOBAL"` herkes için tek kota paylaşır. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Actuator ve Micrometer’a telemetri bildiren Resilience4j Devre Kesicileriyle işlemleri sarar.
- **Çalışma Zamanı Davranışı**: Hata oranı eşiği aştığında OPEN (HTTP 503) durumuna geçer ve durum göstergesini günceller.
- **Nasıl Kullanılır**: Dış REST veya AI çağrıları yapan denetleyicilere ekleyerek zincirleme arızaları izole edin.
- **Ne Zaman Kullanılır**: Alt servis çöktüğünde zaman aşımı beklemek yerine hızlıca `HTTP 503` döndürmek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `CircuitBreakerErrorFilterUtil` 4xx `BaseBusinessException` hatalarını otomatik yoksayar; istemci hatalarını ham `RuntimeException` içine sarmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"payment-gateway-cb"`); varsayılan kural için `""` bırakın.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j devre kesici adı.<br/>*Uyarı:* Resilience4j örneğini ve Micrometer metrik etiketini belirler; `""` sınıf adından türetilir. |
| `failureRateThreshold` | `float` | `50.0f` | Hayır (İsteğe Bağlı) | yüzde cinsinden pozitif sayı (`1.0f .. 100.0f`); örn. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Devreyi OPEN durumuna geçiren hata oranı yüzdesi (50.0f).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: 4xx `BaseBusinessException` hataları otomatik yok sayılır; yalnızca 5xx ve altyapı hataları devreyi açar. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 1`); örn. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | HALF_OPEN öncesi OPEN durumunda bekleme süresi (10 sn).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: 4xx `BaseBusinessException` hataları otomatik yok sayılır; yalnızca 5xx ve altyapı hataları devreyi açar. |
| `slidingWindowSize` | `int` | `20` | Hayır (İsteğe Bağlı) | çağrı cinsinden pozitif sayı (`>= 1`); örn. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Hata oranını ölçen kayan pencere çağrı sayısı (20).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: 4xx `BaseBusinessException` hataları otomatik yok sayılır; yalnızca 5xx ve altyapı hataları devreyi açar. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Hayır (İsteğe Bağlı) | çağrı cinsinden pozitif sayı (`>= 1`); örn. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | HALF_OPEN durumunda izin verilen test çağrısı sayısı (5).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: 4xx `BaseBusinessException` hataları otomatik yok sayılır; yalnızca 5xx ve altyapı hataları devreyi açar. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Geçici hataları yapılandırılabilir üstel geri çekilme ile otomatik yeniden dener.
- **Çalışma Zamanı Davranışı**: Yapılandırılan tüm yeniden deneme hakları bittiğinde standartlaştırılmış istisna fırlatır.
- **Nasıl Kullanılır**: Geçici ağ veya veritabanı kilitlenme hatalarını otomatik kurtarmak için denetleyici veya metoda ekleyin.
- **Ne Zaman Kullanılır**: İdempotent GET okumaları, PUT veya `@Idempotent` korumalı çağrılar için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: `@Idempotent` olmayan POST oluşturma veya ödeme metotlarında ASLA kullanmayın (çift ücret keser)!

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"erp-sync-retry"`); varsayılan kural için `""` bırakın.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j Retry kayıt adı.<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: toplam yeniden deneme süresinin üst ağ geçidi zaman aşımının altında kaldığını doğrulayın. |
| `maxAttempts` | `int` | `3` | Hayır (İsteğe Bağlı) | deneme cinsinden pozitif sayı (`>= 1`); örn. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | İlk deneme dahil toplam deneme sayısı (varsayılan 3).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: toplam yeniden deneme süresinin üst ağ geçidi zaman aşımının altında kaldığını doğrulayın. |
| `waitDurationMs` | `long` | `500L` | Hayır (İsteğe Bağlı) | milisaniye cinsinden pozitif sayı (`>= 50`); örn. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | İlk yeniden deneme öncesi bekleme süresi (500L ms).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: toplam yeniden deneme süresinin üst ağ geçidi zaman aşımının altında kaldığını doğrulayın. |
| `backoffMultiplier` | `double` | `2.0d` | Hayır (İsteğe Bağlı) | çarpan cinsinden pozitif sayı (`>= 1.0d`); örn. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Ardışık yeniden denemeler arasındaki üstel çarpan (2.0d).<br/>*Uyarı:* Üretim gecikme SLA’sına göre dikkatle ayarlayın: toplam yeniden deneme süresinin üst ağ geçidi zaman aşımının altında kaldığını doğrulayın. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Paket**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: RFC 7232 zayıf ETag (W/"...") hesaplar ve Cache-Control ile HTTP 304 Not Modified yanıtları döndürür.
- **Çalışma Zamanı Davranışı**: HIT/MISS sayaçlarını nwvmc.cache.http.requests metriğine kaydeder.
- **Nasıl Kullanılır**: Salt okunur denetleyici veya GET metotlarına ekleyerek `ETag` ve `304` önbellekleme sağlayın.
- **Ne Zaman Kullanılır**: Yarı statik kataloglar ve genel listelerde `304` ile bant genişliği tasarrufu için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Kişisel PII, çok kiracılı veya rol maskeli uçlarda varsayılan `isPrivate = false` ASLA bırakmayın!

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Hayır (İsteğe Bağlı) | saniye cinsinden pozitif sayı (`>= 0`); örn. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Cache-Control `max-age` süresi (saniye, varsayılan 60).<br/>*Uyarı:* `Cache-Control: max-age=<N>` üretir. Anında `304` doğrulaması için `0` ile `generateETag = true` kullanın. |
| `isPrivate` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (yalnızca tarayıcı özel önbelleği; CDN engelli) veya `false` (proxy ve CDN ile paylaşılabilir genel önbellek).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true ise `private` (CDN önbelleklemesini engeller); false ise `public` yayar.<br/>*Uyarı:* KRİTİK: Kimlik doğrulamalı veya `@FieldSecurity` kullanan uç noktalarda CDN sızıntısını önlemek için mutlaka `isPrivate = true` yapın. |
| `mustRevalidate` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Süresi dolan önbelleğin yeniden doğrulanması için `, must-revalidate` ekler.<br/>*Uyarı:* `maxAgeSeconds` dolduğunda önbelleklerin kaynağa sormadan eski yanıt dönmesini engeller. |
| `generateETag` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | SHA-256 ETag hesaplar ve `If-None-Match` eşleşirse `HTTP 304` döner.<br/>*Uyarı:* RFC 7232 `ETag` hesaplar ve `If-None-Match` eşleştiğinde 0 bayt `304 Not Modified` döndürür. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Sunucu tarafı okuma metodu çıktılarını Caffeine L1 / Redis L2 motorlarında önbellekler.
- **Çalışma Zamanı Davranışı**: app.framework.cache.type üzerinden genel olarak yapılandırılabilir.
- **Nasıl Kullanılır**: Okuma metotlarına ekleyin; Caffeine veya Redis `app.framework.cache.type` ile seçilir.
- **Ne Zaman Kullanılır**: Okuma/yazma oranı yüksek ID bazlı okuma ve meta veri sorgularında kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Çok sık yazılan tablolarda ve klonlanmamış değiştirilebilir varlıklarda KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Caffeine L1 veya Redis L2 önbellek adları listesi.<br/>*Uyarı:* Önbellek adları Caffeine/Redis yapılandırmasıyla eşleşmeli ve yazma metotları `@AutoCacheEvict` ile eşlenmelidir. |
| `key` | `String` | `""` | Hayır (İsteğe Bağlı) | Metot parametrelerine başvuran SpEL ifadesi (örn. `"'product:' + #id"`) veya otomatik anahtar için `""`.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL önbellek anahtarı (v0.1.0 belirlenimli olarak `EntityName:id` çözer).<br/>*Uyarı:* Çok kiracılı uygulamalarda kiracılar arası sızıntıyı önlemek için anahtara mutlaka kiracı kimliği ekleyin. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Değişikliklerde eski sunucu tarafı önbellek girdilerini temizler.
- **Çalışma Zamanı Davranışı**: Eski okuma kalıntıları bırakmadan değişiklik sonrasında temiz biçimde çalışır.
- **Nasıl Kullanılır**: Güncelleme/silme metotlarına `@AutoCacheable` anahtarıyla uyumlu olarak ekleyin.
- **Ne Zaman Kullanılır**: `@AutoCacheable` ile önbelleğe alınmış kayıtlar güncellendiğinde veya silindiğinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Sık çalışan `create` metotlarında `allEntries = true` kullanmaktan kaçının (Cache Stampede).

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Metot tamamlandığında temizlenecek önbellek adları.<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `value` trafik almadan önce hızlıca hata verir. |
| `key` | `String` | `""` | Hayır (İsteğe Bağlı) | Metot parametrelerine başvuran SpEL ifadesi (örn. `"'product:' + #id"`) veya otomatik anahtar için `""`.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Yalnızca değişen kaydı temizleyen SpEL anahtar ifadesi.<br/>*Uyarı:* `@AutoCacheable.key` ile aynı anahtarı üretmelidir; `allEntries = true` iken yok sayılır. |
| `allEntries` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (hedef önbellek bölgesindeki tüm kayıtları temizle) veya `false` (yalnızca key ile belirlenen tek kaydı sil).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true ise yalnızca ilgili varlık ön ekine ait önbellekleri temizler.<br/>*Uyarı:* Yüksek trafikte tüm bölgeyi temizlemek veritabanında önbellek izdihamına yol açabilir; mümkünse tekil `key` silin. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Yürütme süresini ölçer ve yavaş çağrılar eşiği aştığında WARN günlüğü yazar.
- **Çalışma Zamanı Davranışı**: Ayrıca DynamicEntityMetricsHelper üzerinden gecikme zamanlayıcılarını besler.
- **Nasıl Kullanılır**: SLA ihlallerini yakalamak için denetleyici veya servislere ekleyin.
- **Ne Zaman Kullanılır**: Karmaşık raporlarda, toplu işlemlerde ve `@CustomQuery` yavaşlamalarını yakalamakta kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Yüksek trafikli yollarda `0` değeri vermeyin ve uzun ömürlü SSE `/events` akışlarında KULLANMAYIN.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Hayır (İsteğe Bağlı) | milisaniye cinsinden pozitif sayı (`>= 1`); örn. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Yavaş çalışma `WARN` günlüğü tetiklenecek eşik süre (500L ms).<br/>*Uyarı:* Eşik aşıldığında `traceId` içeren `WARN` günlüğü yazar; günlük taşmasını önlemek için gerçekçi (`200L–1000L`) seçin. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Paket**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Amaç**: İşlem onayı sonrası Virtual Threads üzerinde HMAC-SHA256 imzalı giden webhook’lar gönderir.
- **Çalışma Zamanı Davranışı**: İmzaları WebhookHmacSignerHelper içinde hesaplar ve sabit zamanlı eşitlik doğrulaması yapar.
- **Nasıl Kullanılır**: JPA `@Entity` üzerine ekleyin; teslimat veritabanı commit sonrası asenkron yapılır.
- **Ne Zaman Kullanılır**: Sipariş veya ödeme onaylandığında harici ortaklara güvenli bildirim göndermek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Katı PII/PCI verilerinde `includeFullPayload = false` yapın ve dahili SSRF adreslerini engelleyin.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Hayır (İsteğe Bağlı) | Sıfır veya daha fazla geçerli değer dizisi: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC imzalı webhook teslimatını tetikleyen yaşam döngüsü olayları.<br/>*Uyarı:* Veritabanı commit sonrası (`AFTER_COMMIT`) asenkron gönderilir; geri alınan işlemlerde sahte webhook oluşmaz. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Hayır (İsteğe Bağlı) | Geçerli HTTP üstbilgi adı (ağda büyük/küçük harfe duyarsız, örn. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 doğrulama imzasını taşıyan HTTP başlığı.<br/>*Uyarı:* HMAC-SHA256 yük imzasını taşır; alıcılar işlemeden önce sabit zamanlı doğrulama yapmalıdır. |
| `includeFullPayload` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@EntityWebhook(includeFullPayload = false)` | true tam JSON yükünü gönderir; false sadece kimlik ve olay meta verisini iletir.<br/>*Uyarı:* Hassas PII/finans varlıklarında `false` yapın (yalnızca ID + olay); aboneler yetkili GET ile veri çeksin. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Paket**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: İşlem onayından sonra CNCF CloudEvents v1.0 zarfları yayınlar.
- **Çalışma Zamanı Davranışı**: Hayalet olayları önlemek için TransactionRuntimeBridge.executeAfterCommit kullanır.
- **Nasıl Kullanılır**: Varlık veya metoda ekleyin; commit sonrası `CloudEventEnvelopeDto` dinleyin.
- **Ne Zaman Kullanılır**: Modüller arası çapraz SQL JOIN olmadan Bounded Context iletişimi için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Harici `@EntityWebhook` ile karıştırmayın ve `AFTER_COMMIT` olmadan işlemeyin.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Hayır (İsteğe Bağlı) | Boş olmayan tanımlayıcı dizesi (örn. `"com.acme.order.lifecycle"`); varsayılan kural için `""` bırakın.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` başlığı.<br/>*Uyarı:* CloudEvents 1.0 ters-DNS adlandırmasını (`com.company.domain.event`) kullanın; `""` otomatik üretir. |
| `source` | `String` | `""` | Hayır (İsteğe Bağlı) | `/` ile başlayan geçerli HTTP yolu (örn. `/services/order-api`) veya otomatik türetme için boş dize `""`.<br/>`@PublishCloudEvent(source = "/services/order-api")` | Yayımlayan bağlamı tanımlayan CloudEvents `source` URI değeri.<br/>*Uyarı:* Mikroservisler arası izleme için CNCF CloudEvents `source` URI özniteliğini doldurur. |
| `publishOnCreate` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Oluşturma commit sonrası CloudEvent yayınlar (true).<br/>*Uyarı:* Yalnızca commit sonrasında (`AFTER_COMMIT`) Spring Events / Kafka / RabbitMQ üzerinden yayınlanır. |
| `publishOnUpdate` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Güncelleme commit sonrası CloudEvent yayınlar (true).<br/>*Uyarı:* Sık güncellenen varlıklarda mesaj kuyruğunu doldurmamak için `false` yapın. |
| `publishOnDelete` | `boolean` | `true` | Hayır (İsteğe Bağlı) | `true` (etkin) veya `false` (devre dışı).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Silme commit sonrası CloudEvent yayınlar (true).<br/>*Uyarı:* Hem kalıcı silmede hem `BaseAuditEntity.deleted` işleminde tetiklenerek alt sistemleri senkron tutar. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Paket**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Varlık veya sorgu işlemlerini mantıksal adlandırılmış bir veri kaynağı anahtarına sabitler.
- **Çalışma Zamanı Davranışı**: Yönlendirme sayılarını framework.datasource.routing.total metriğine kaydeder.
- **Nasıl Kullanılır**: Denetleyici veya final olmayan servis metoduna ekleyin; çıkışta eski bağlam geri yüklenir.
- **Ne Zaman Kullanılır**: CQRS okuma replikalarına veya ağır raporları ikincil veritabanına yönlendirmek için kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Halihazırda açılmış bir `@Transactional` işlemin ortasında veri kaynağı DEĞİŞTİRMEYİN!

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | `DataSourceContextHolder` yönlendirme anahtarı ("PRIMARY", "REPLICA").<br/>*Uyarı:* `DynamicRoutingDataSource` içindeki kayıtlı anahtarla eşleşmelidir; bilinmeyen anahtar `PRIMARY` kaynağına düşer. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Paket**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Amaç**: Varlık başına veritabanı motoru ailesi ve mantıksal küme bölümü atar.
- **Çalışma Zamanı Davranışı**: Çalışma zamanında MultiPlatformDataSourceRegistryHelper ve TenantDatabaseRoutingResolverHelper tarafından çözülür.
- **Nasıl Kullanılır**: Çoklu veritabanı motor ve küme bilgisini tanımlamak için varlık veya metoda ekleyin.
- **Ne Zaman Kullanılır**: Finans, analitik ve denetim iş yüklerini ayrı kümelere ayıran çoklu veritabanı mimarilerinde kullanın.
- **Ne Zaman KULLANILMAMALI ve Tuzaklar**: Fiziksel JDBC havuz yapılandırmasının yerine GEÇMEZ; farklı kümeler arasında JPA JOIN yapmayın.

| Öznitelik | Java Türü | Varsayılan Değer | Zorunlu | Geçerli Değerler ve Örnek | Açıklama ve Çalışma Zamanı Uyarıları |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Hedef veritabanı motoru kimliği ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `platform` trafik almadan önce hızlıca hata verir. |
| `cluster` | `String` | `"PRIMARY"` | Hayır (İsteğe Bağlı) | Desteklenen değerlerden biri: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Hedef veritabanı kümesi ("PRIMARY", "REPLICA", "FINANCE_CLUSTER").<br/>*Uyarı:* Uygulama açılışında doğrulanır; yazım hatası veya geçersiz `cluster` trafik almadan önce hızlıca hata verir. |
| `readOnly` | `boolean` | `false` | Hayır (İsteğe Bağlı) | `true` (salt okunur kopya havuzuna yönlendir) veya `false` (okuma/yazma ana havuzuna yönlendir).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true olduğunda salt okunur replika yönlendirmesi önerir.<br/>*Uyarı:* Yazma işlemlerinde (`POST`/`PUT`/`DELETE`) asla `readOnly = true` yapmayın; salt okunur kopyalar yazmayı reddeder. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
