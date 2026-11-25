# 06. تمام 60 ڈیکلیریٹو اینوٹیشنز کی مکمل تکنیکی تفصیل (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0` کی تمام **60 ڈیکلیریٹو اینوٹیشنز** کا جامع تکنیکی حوالہ، جو براہ راست Java `@interface` سورس کوڈ سے اخذ کیا گیا ہے: درست پیکج، `@Target`، **ہر ایٹری بیوٹ**، Java قسم، ڈیفالٹ قدر، لازمی یا اختیاری حیثیت، **استعمال کا طریقہ**، **کب استعمال کریں**، **کب استعمال نہ کریں اور احتیاطیں**، اور تصدیق شدہ Java کوڈ مثالیں۔

## فوری فہرست (60 اینوٹیشنز)

| اینوٹیشن | زمرہ | `@Target` | ایٹری بیوٹس کا خلاصہ | بنیادی مقصد |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> کی توسیع کرنے والے انٹرفیس کو 40 معاہدوں (Swagger UI میں 38 ڈیفالٹ) کے رن ٹائم JDK ڈائنامک پراکسی میں تبدیل کرتا ہے۔ |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | ڈائنامک CRUD کے بجائے MethodHandleCacheUtil کے ذریعے کنٹرولر کنٹریکٹ کو کسٹم Spring بین میتھڈ پر موڑتا ہے۔ |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | ڈومین کے مخصوص ورک فلو روٹس (چیک آؤٹ، ریفنڈ، منظوری) کو آزاد Spring @Component Helper بینز سے جوڑتا ہے۔ |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | اسٹیٹک Spring Web امپورٹس کے بغیر @GetMapping کا خالص Java متبادل۔ |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | کسٹم consumes/produces میڈیا اقسام کے ساتھ خالص Java HTTP POST روٹ۔ |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | مکمل ریسورس تبدیلی کے لیے خالص Java HTTP PUT روٹ میپنگ۔ |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | جزوی انضمام، ایٹامک اضافے اور RFC 6902 JSON Patch کے ساتھ خالص Java HTTP PATCH۔ |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | اسٹیٹ کے تحفظ کے ساتھ سافٹ ڈیلیٹ شروع کرنے والا خالص Java HTTP DELETE۔ |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL کوئری پیرامیٹرز یا Map<String, String> ڈائنامک فلٹر میپس کو بائنڈ کرتا ہے۔ |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 ریکارڈ IDs جیسے URI پاتھ متغیرات کو بائنڈ کرتا ہے۔ |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | @Valid کے ساتھ DTO یا Entity پیرامیٹرز میں HTTP JSON درخواست کو ڈی سیریلائز کرتا ہے۔ |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | چکری لوپ روک تھام کے ساتھ GET /{id}/{relation}/** کے ذریعے ذیلی روابط کی نیویگیشن کی اجازت دیتا ہے۔ |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | کسٹم ایکشن میتھڈز پر ڈومین اسٹیٹ کی منتقلی یا عددی تبدیلیاں متعین کرتا ہے۔ |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | کمپائل ٹائم @Component امپورٹ کے بغیر بوٹ پر رجسٹر ہونے والا فریم ورک کمپوننٹ مارکر۔ |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride کے ساتھ منسلک ServiceImpl کلاسز کے لیے سروس لیئر مارکر۔ |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean کلاسز کے اندر منظم بین فیکٹری میتھڈز متعین کرتا ہے۔ |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | کنفیگریشن کلاسز اور YAML پراپرٹیز بائنڈنگ ماڈلز کو نشان زد کرتا ہے۔ |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer بینز اور فلٹر چینز کے درمیان عمل درآمد کی ترجیح کنٹرول کرتا ہے۔ |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | ریکارڈ کی تلاش یا تبدیلی سے پہلے NIST Level 2 RBAC، ownerField علیحدگی اور اجازت کوڈز نافذ کرتا ہے۔ |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | اجازت نہ ہونے پر حساس کالموں کو ڈائنامک طریقے سے ماسک یا نل کرتا ہے۔ |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition پر مجاز حالت کی منتقلی نافذ کرتا ہے اور DELETE /{id} کو deletableStates تک محدود رکھتا ہے۔ |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | پڑھنے کے قابل پالیسی شقوں کو فعال RBAC، منتقلی اور ماسکنگ قواعد میں مرتب کرتا ہے۔ |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | ٹائم ٹریول اسٹیٹ کی بحالی اور /diff معائنے کے لیے فیلڈ کی سطح پر تبدیلیاں ریکارڈ کرتا ہے۔ |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | بائی پاس رول کے بغیر فعال کرایہ دار کے مطابق قطاروں اور تبدیلیوں کو خودکار الگ رکھتا ہے۔ |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | create، update اور upsert پر محفوظ کرنے سے پہلے انفرادیت کی تصدیق کرتا ہے۔ |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | خالی چھوڑنے پر تخلیق یا کلون کے وقت منفرد پریفکس بزنس کوڈ خودکار بناتا ہے۔ |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | sourceField سے خودکار URL-موافق ASCII سلگ تیار کرتا ہے۔ |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | تبدیلیاں محفوظ کرنے سے پہلے اخذ کردہ عددی مجموعے کا حساب لگاتا ہے۔ |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | کنٹرولر اینڈپوائنٹس سے کسٹم SQL/JPQL یا پرووائیڈر ہیلپر میتھڈز جوڑنے کی اجازت دیتا ہے۔ |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | JPA ریکارڈ کو لائیو ڈیٹابیس RBAC کردار کیٹلاگ ٹیبل کے طور پر مقرر کرتا ہے۔ |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityRoleEntity کے اندر منفرد کردار کوڈ کالم کو میپ کرتا ہے۔ |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityRoleEntity پر کردار کا قابل فہم ڈسپلے نام فیلڈ ظاہر کرتا ہے۔ |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | کردار ریکارڈ پر دیے گئے اجازت کوڈز کا مجموعہ یا CSV فیلڈ نشان زد کرتا ہے۔ |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | وسائل-عمل کی اجازتیں اور ڈائنامک فیلڈ ماسکنگ قواعد محفوظ کرنے والے JPA ریکارڈ کو نشان زد کرتا ہے۔ |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity کے اندر منفرد اجازت کوڈ فیلڈ مقرر کرتا ہے۔ |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity کے اندر ہدف ریکارڈ یا API وسائل کا نام (یا *) میپ کرتا ہے۔ |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPermissionEntity کے تحت محفوظ منطقی CRUD یا کسٹم ایکشن کو میپ کرتا ہے۔ |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ان کما سے الگ فیلڈز کا اعلان کرتا ہے جنہیں اس قاعدے کے لاگو ہونے پر ڈائنامک ماسک کرنا ہو۔ |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | تصدیق شدہ صارفین کو DB کرداروں اور کرایہ دار کے دائرہ کار سے جوڑنے والا JPA ریکارڈ مقرر کرتا ہے۔ |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity پر بنیادی صارف نام / سبجیکٹ فیلڈ شناخت کرتا ہے۔ |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity کے اندر تفویض کردہ کردار کوڈ کالم کو جوڑتا ہے۔ |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityUserRoleEntity تفویض کو مخصوص کرایہ دار ID (یا عالمی کے لیے *) تک محدود کرتا ہے۔ |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | ترجیح کے لحاظ سے ترتیب شدہ واضح ALLOW / DENY اجازت پالیسیاں محفوظ کرنے والا JPA ریکارڈ مقرر کرتا ہے۔ |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity میں ہدف وسائل کے شناخت کنندہ کو میپ کرتا ہے۔ |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity کے اندر محفوظ عمل (READ, WRITE, DELETE, methodName, *) کو میپ کرتا ہے۔ |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity قاعدے کے ہدف کرداروں کے مجموعے یا CSV فہرست کو میپ کرتا ہے۔ |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | @SecurityPolicyEntity قاعدے پر ALLOW یا DENY پالیسی نتیجہ متعین کرتا ہے۔ |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST نقشے میں کیش شدہ SpEL کلیدوں پر بیک وقت رسائی کو ترتیب وار چلاتا ہے (ڈیفالٹ 3000L/5000L)۔ |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | قابل ترتیب TTL ونڈو کے اندر بیک وقت یا دہرائی جانے والی ڈپلیکیٹ تحریروں کو روکتا ہے۔ |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP، User یا Tenant کے مطابق سلائیڈنگ ونڈو ریٹ لمیٹنگ نافذ کرتا ہے۔ |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator اور Micrometer کو ٹیلی میٹری بھیجتے ہوئے Resilience4j سرکٹ بریکر میں آپریشنز چلاتا ہے۔ |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | قابل ترتیب ایکسپونینشل بیک آف کے ساتھ عارضی ناکامیوں کو خودکار دوبارہ آزماتا ہے۔ |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 کمزور ETags (W/"...") کا حساب لگاتا ہے اور Cache-Control + HTTP 304 Not Modified جوابات بھیجتا ہے۔ |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Caffeine L1 / Redis L2 انجنز میں سرور سائیڈ ریڈ میتھڈ آؤٹ پٹس کیش کرتا ہے۔ |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | تبدیلیوں پر پرانی سرور سائیڈ کیش اندراجات خارج کرتا ہے۔ |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | عمل درآمد کا وقت ماپتا ہے اور سست کال حد سے بڑھنے پر WARN لاگ جاری کرتا ہے۔ |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | کمیٹ کے بعد ورچوئل تھریڈز پر غیر ہم وقتی HMAC-SHA256 دستخط شدہ ویب ہکس بھیجتا ہے۔ |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | ٹرانزیکشن کمیٹ کے بعد CNCF CloudEvents v1.0 لفافے شائع کرتا ہے۔ |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | ریکارڈ یا کوئری آپریشنز کو نامزد منطقی ڈیٹا سورس کلید سے جوڑتا ہے۔ |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | ہر ریکارڈ کے لیے ڈیٹابیس انجن فیملی اور منطقی کلسٹر شارڈ تفویض کرتا ہے۔ |

---

## 1. روٹنگ، ڈائنامک API معاہدے، DTO علیحدگی اور پیرامیٹر بائنڈنگ (13 اینوٹیشنز)

### `@AutoRestController`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **مقصد**: AutoApiController<E> کی توسیع کرنے والے انٹرفیس کو 40 معاہدوں (Swagger UI میں 38 ڈیفالٹ) کے رن ٹائم JDK ڈائنامک پراکسی میں تبدیل کرتا ہے۔
- **رن ٹائم رویہ**: اسٹارٹ اپ پر DynamicControllerProxyRegistrarHelper کنٹرولرز کو اسکین کر کے RequestMappingHandlerMapping میں روٹس رجسٹر کرتا ہے۔
- **استعمال کا طریقہ**: `AutoApiController<E>` یا `AutoReadApi<E>` کی توسیع کرنے والے Java انٹرفیس پر `@AutoRestController(basePath = "/api/v1/...")` لگائیں۔
- **کب استعمال کریں**: جب بغیر بوائلر پلیٹ کوڈ کے JPA اینٹیٹی کے لیے معیاری CRUD یا صرف پڑھنے والی API شائع کرنی ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: اسے ٹھوس `@RestController` کلاس یا بغیر JPA اینٹیٹی والے کام پر نہ لگائیں؛ صرف پڑھنے کے لیے `AutoReadApi<E>` استعمال کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | نہیں (اختیاری) | `/` سے شروع ہونے والا درست HTTP راستہ (مثلاً `/api/v1/product-catalogs`) یا خودکار اخذ کے لیے خالی اسٹرنگ `""`۔<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | واضح روٹ URI پاتھ (مثلاً "/api/v1/product-catalogs")۔ خالی ہونے پر کنٹرولر کے نام سے خودکار بنتا ہے۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `path` سے پہلے `basePath` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `path` | `String` | `""` | نہیں (اختیاری) | `/` سے شروع ہونے والا درست HTTP راستہ (مثلاً `/api/v1/orders`) یا خودکار اخذ کے لیے خالی اسٹرنگ `""`۔<br/>`@AutoRestController(path = "/api/v1/orders")` | بنیادی پاتھ کا متبادل نام۔ basePath کو ترجیح دیں کیونکہ رجسٹرار پہلے اسے پڑھتا ہے۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `path` سے پہلے `basePath` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `entityName` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"ProductCatalog"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoRestController(entityName = "ProductCatalog")` | OpenAPI/Studio میٹا ڈیٹا میں ظاہر ہونے والا اینٹیٹی نام تبدیل کرتا ہے۔<br/>*تنبیہ:* براہ راست Swagger / OpenAPI 3.0 اور NWVMC Studio میں ظاہر ہوتا ہے؛ ہارڈ کوڈ سے بچنے کے لیے `OpenApiConstant` استعمال کریں۔ |
| `enabledEndpoints` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`۔<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | اجازت یافتہ میتھڈ ناموں کی فہرست (مثلاً "getPage", "create")۔ خالی ہونے پر سب فعال رہتے ہیں۔<br/>*تنبیہ:* سخت اجازت فہرست کے طور پر کام کرتا ہے: غیر خالی ہونے پر غیر مذکور تمام میتھڈز Spring MVC اور Swagger UI سے خارج ہو جاتے ہیں۔ |
| `disabledEndpoints` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`۔<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | MVC میپنگ سے پہلے مخصوص میتھڈز بند کرنے کی بلیک لسٹ۔<br/>*تنبیہ:* `enabledEndpoints` کے بعد چیک ہوتا ہے؛ باقی 40 کنٹریکٹس فعال رکھتے ہوئے خطرناک ڈیلیٹ یا بلک روٹس روکنے کے لیے مفید ہے۔ |
| `enableNestedSubResources` | `boolean` | `false` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | ریکرسو سب ریسورس نیویگیشن GET /{id}/** فعال کرتا ہے۔ ڈیفالٹ false ہے۔<br/>*تنبیہ:* جب تک `GET /{id}/items/...` درکار نہ ہو `false` رکھیں؛ فعال کرنے پر `@EnableNestedSubResource` سے تعلقات محدود کریں۔ |
| `readDto` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `ProductReadDto.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@AutoRestController(readDto = ProductReadDto.class)` | اختیاری ریڈ DTO جو داخلی اینٹیٹی فیلڈز چھپاتا ہے؛ Void.class پر اصل اینٹیٹی لوٹتی ہے۔<br/>*تنبیہ:* صرف ریڈ (GET) پائپ لائن پر لاگو ہوتا ہے؛ DTO کلاس میں ڈیفالٹ کنسٹرکٹر اور گیٹرز ہونے چاہئیں اور `@Valid` سپورٹ کرتا ہے۔ |
| `createDto` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `ProductCreateDto.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | POST سے پہلے Jakarta Validation سے جانچا جانے والا اختیاری تخلیق DTO۔<br/>*تنبیہ:* صرف تخلیق (POST) پائپ لائن پر لاگو ہوتا ہے؛ DTO کلاس میں ڈیفالٹ کنسٹرکٹر اور گیٹرز ہونے چاہئیں اور `@Valid` سپورٹ کرتا ہے۔ |
| `updateDto` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `ProductUpdateDto.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | PUT/PATCH اپڈیٹس پر قابلِ ترمیم فیلڈز محدود کرنے والا اختیاری DTO۔<br/>*تنبیہ:* صرف اپ ڈیٹ (PUT/PATCH) پائپ لائن پر لاگو ہوتا ہے؛ DTO کلاس میں ڈیفالٹ کنسٹرکٹر اور گیٹرز ہونے چاہئیں اور `@Valid` سپورٹ کرتا ہے۔ |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: ڈائنامک CRUD کے بجائے MethodHandleCacheUtil کے ذریعے کنٹرولر کنٹریکٹ کو کسٹم Spring بین میتھڈ پر موڑتا ہے۔
- **رن ٹائم رویہ**: EscapeHatchDispatchHelper ہدف بین تلاش کر کے MethodHandleCacheUtil میں MethodHandle کیش کرتا ہے۔
- **استعمال کا طریقہ**: کنٹرولر میتھڈ پر `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` لگائیں اور ہدف کلاس کو `@Component` بنائیں۔
- **کب استعمال کریں**: جب زیادہ تر اینڈ پوائنٹس خودکار ہوں لیکن کسی ایک میتھڈ کے لیے کسٹم Java لاجک درکار ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: `targetBean` میں ہرگز String قدر نہ لکھیں (`Class<?>` چاہیے؛ نام کے لیے `beanName` استعمال کریں)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `OrderCustomService.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | ہدف Spring بین کلاس (beanName پر فوقیت رکھتی ہے)۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `beanName` سے پہلے `targetBean` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `beanName` | `String` | `""` | نہیں (اختیاری) | ApplicationContext میں رجسٹرڈ عین بین نام (مثلاً `"orderCustomService"`) یا خودکار تلاش کے لیے `""`۔<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | جب targetBean Void.class ہو تو Spring کنٹینر میں واضح بین کا نام۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `beanName` سے پہلے `targetBean` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `methodName` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"createOrder"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | ہدف بین پر میتھڈ کا نام؛ خالی ہونے پر کنٹرولر میتھڈ کا نام استعمال ہوتا ہے۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"createOrder"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `bypassAutoDispatch` | `boolean` | `true` | نہیں (اختیاری) | `true` (ڈیفالٹ پراکسی چھوڑ کر براہ راست ہدف بین چلائیں) یا `false` (ڈیفالٹ ڈسپیچ کے ساتھ چلائیں)۔<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true ہونے پر خودکار CRUD کو نظر انداز کر کے MethodHandleCacheUtil سے بین چلاتا ہے۔<br/>*تنبیہ:* `true` پر بلٹ ان CRUD مکمل طور پر نظرانداز ہوتا ہے؛ صرف اضافی ہُک کے لیے `false` رکھیں۔ |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: ڈومین کے مخصوص ورک فلو روٹس (چیک آؤٹ، ریفنڈ، منظوری) کو آزاد Spring @Component Helper بینز سے جوڑتا ہے۔
- **رن ٹائم رویہ**: مکمل توثیق اور ٹرانزیکشن کے ساتھ کیش شدہ MethodHandle کے ذریعے delegateBean.delegateMethod چلاتا ہے۔
- **استعمال کا طریقہ**: کنٹرولر میتھڈ پر `path`، `httpMethod`، `delegateBean` اور `delegateMethod` واضح کر کے Spring ہیلپر کو تفویض کریں۔
- **کب استعمال کریں**: چیک آؤٹ، ریفنڈ، منظوری یا متعدد اینٹیٹیز پر مشتمل ڈومین ایکشنز کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: پراکسی AOP پر انحصار نہ کریں بلکہ سیکیورٹی/AOP ڈیلیگیٹ `@Service` پر لگائیں، اور سادہ تبدیلیوں کے لیے `@BusinessAction` استعمال کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/reports/monthly-sales`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | کنٹرولر basePath کے تحت نسبتی اینڈ پوائنٹ پاتھ (مثلاً "/checkout")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `path` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `httpMethod` | `String` | `"GET"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`۔<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP طریقہ کار ("GET", "POST", "PUT", "PATCH", "DELETE")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `httpMethod` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `delegateBean` | `String` | `""` | نہیں (اختیاری) | ApplicationContext میں رجسٹرڈ عین بین نام (مثلاً `"orderReportService"`) یا خودکار تلاش کے لیے `""`۔<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | ورک فلو ہینڈلر رکھنے والے Spring بین کا نام (خالی ہونے پر CustomEndpointInvokerHelper ایرر دیتا ہے)۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `delegateBean` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `delegateMethod` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"buildMonthlyReport"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean پر میتھڈ نام؛ خالی ہونے پر کنٹرولر میتھڈ نام۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"buildMonthlyReport"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `summary` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"Get monthly revenue breakdown"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI میں دکھایا جانے والا مختصر OpenAPI 3.0 خلاصہ۔<br/>*تنبیہ:* براہ راست Swagger / OpenAPI 3.0 اور NWVMC Studio میں ظاہر ہوتا ہے؛ ہارڈ کوڈ سے بچنے کے لیے `OpenApiConstant` استعمال کریں۔ |
| `description` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"Aggregates confirmed invoice totals grouped by currency"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI میں تفصیلی OpenAPI 3.0 وضاحت۔<br/>*تنبیہ:* براہ راست Swagger / OpenAPI 3.0 اور NWVMC Studio میں ظاہر ہوتا ہے؛ ہارڈ کوڈ سے بچنے کے لیے `OpenApiConstant` استعمال کریں۔ |

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

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: اسٹیٹک Spring Web امپورٹس کے بغیر @GetMapping کا خالص Java متبادل۔
- **رن ٹائم رویہ**: پراکسی بوٹ اسٹریپ پر HTTP GET RequestMappingInfo کے طور پر میپ ہوتا ہے۔
- **استعمال کا طریقہ**: `@AutoRestController` انٹرفیس میں `@ServiceOverride` یا `@CustomQuery` کے ساتھ `@AutoGet("/your-path")` استعمال کریں۔
- **کب استعمال کریں**: Spring Web `@GetMapping` امپورٹ کیے بغیر پیور Java انٹرفیس میں HTTP GET روٹ بنانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ڈیٹا تبدیل کرنے والے کاموں یا عام `@RestController` کلاس پر استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/{id}/summary`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@AutoGet("/{id}/summary")` | نسبتی GET پاتھ ٹیمپلیٹ (مثلاً "/metrics")۔ خالی ہونے پر براہِ راست basePath پر میپ ہوتا ہے۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `produces` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json", "text/csv"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | اختیاری پروڈیوس کردہ میڈیا اقسام (مثلاً "text/event-stream")۔<br/>*تنبیہ:* Spring MVC HTTP `Accept` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: کسٹم consumes/produces میڈیا اقسام کے ساتھ خالص Java HTTP POST روٹ۔
- **رن ٹائم رویہ**: SpringMvcEndpointBridge میں HTTP POST ہینڈلر کے طور پر رجسٹر ہوتا ہے۔
- **استعمال کا طریقہ**: تخلیق یا ایکشن میتھڈ پر `@AutoPost("/path")` لگا کر `@AutoBody`/`@RequestBody` کے ساتھ جوڑیں۔
- **کب استعمال کریں**: وسائل کی تخلیق، بزنس کمانڈز یا بیچ سبمشن POST روٹس کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: پڑھنے (`@AutoGet`)، مکمل تبدیلی (`@AutoPut`) یا حذف (`@AutoDelete`) کے لیے استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/{id}/approve`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@AutoPost("/{id}/approve")` | basePath کے تحت نسبتی POST پاتھ ٹیمپلیٹ۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `consumes` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json", "multipart/form-data"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | درخواست میں قبول کردہ Content-Type میڈیا اقسام۔<br/>*تنبیہ:* Spring MVC HTTP `Content-Type` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |
| `produces` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | جواب میں تیار کردہ میڈیا اقسام۔<br/>*تنبیہ:* Spring MVC HTTP `Accept` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: مکمل ریسورس تبدیلی کے لیے خالص Java HTTP PUT روٹ میپنگ۔
- **رن ٹائم رویہ**: ٹرانزیکشنل عمل درآمد کے اندر HTTP PUT ہینڈلر کے طور پر منسلک ہوتا ہے۔
- **استعمال کا طریقہ**: مکمل اپڈیٹ میتھڈ پر `@AutoVariable` اور `@AutoBody` کے ساتھ `@AutoPut("/{id}")` لگائیں۔
- **کب استعمال کریں**: مکمل اسٹیٹ پے لوڈ کے ساتھ آئیڈیمپوٹینٹ فل ریسورس تبدیلی کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: صرف چند فیلڈز کی جزوی تبدیلی کے لیے استعمال نہ کریں (`@AutoPatch` استعمال کریں)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/{id}/replace`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@AutoPut("/{id}/replace")` | نسبتی PUT پاتھ ٹیمپلیٹ (مثلاً "/{id}")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `consumes` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | حمایت یافتہ درخواست Content-Type۔<br/>*تنبیہ:* Spring MVC HTTP `Content-Type` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |
| `produces` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | تیار کردہ جوابی میڈیا اقسام۔<br/>*تنبیہ:* Spring MVC HTTP `Accept` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: جزوی انضمام، ایٹامک اضافے اور RFC 6902 JSON Patch کے ساتھ خالص Java HTTP PATCH۔
- **رن ٹائم رویہ**: JSON انضمام اور application/json-patch+json کی حمایت کرتا ہے۔
- **استعمال کا طریقہ**: جزوی اپڈیٹ یا `@BusinessAction` میتھڈز پر `@AutoPatch("/{id}/action")` لگائیں۔
- **کب استعمال کریں**: جزوی تبدیلیوں، عددی اضافے اور اسٹیٹ ٹرانزیشنز کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: مکمل تبدیلی (`@AutoPut`) یا نئی تخلیق (`@AutoPost`) کے لیے استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/{id}/status`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@AutoPatch("/{id}/status")` | نسبتی PATCH پاتھ ٹیمپلیٹ (مثلاً "/{id}/approve")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `consumes` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json", "application/merge-patch+json"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | قبول کردہ Content-Type۔<br/>*تنبیہ:* Spring MVC HTTP `Content-Type` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |
| `produces` | `String[]` | `{}` | نہیں (اختیاری) | MIME میڈیا اقسام کی صف (مثلاً `{"application/json"}`)؛ خالی `{}` بذریعہ ڈیفالٹ `application/json` لیتا ہے۔<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | تیار کردہ میڈیا اقسام۔<br/>*تنبیہ:* Spring MVC HTTP `Accept` پر کنٹینٹ نیگوشی ایشن نافذ کرتا ہے؛ عدم مطابقت پر `406` یا `415` آتا ہے۔ |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: اسٹیٹ کے تحفظ کے ساتھ سافٹ ڈیلیٹ شروع کرنے والا خالص Java HTTP DELETE۔
- **رن ٹائم رویہ**: deleted=true سیٹ کرنے سے پہلے @StateMachine deletableStates کی تصدیق کرتا ہے۔
- **استعمال کا طریقہ**: `@ServiceOverride` کے ساتھ کسٹم ڈیلیٹ میتھڈ پر `@AutoDelete("/{id}/custom")` لگائیں۔
- **کب استعمال کریں**: کسٹم آرکائیو یا کیسکیڈ صفائی DELETE اینڈ پوائنٹس کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: اگر بلٹ ان سافٹ ڈیلیٹ کافی ہے تو دوبارہ مت لکھیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | اختیاری `{pathVar}` ٹیمپلیٹ کے ساتھ ذیلی URI راستہ (مثلاً `/{id}/archive`)؛ `""` روٹ سے جڑتا ہے۔<br/>`@AutoDelete("/{id}/archive")` | نسبتی DELETE پاتھ ٹیمپلیٹ (مثلاً "/{id}/purge")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **مقصد**: URL کوئری پیرامیٹرز یا Map<String, String> ڈائنامک فلٹر میپس کو بائنڈ کرتا ہے۔
- **رن ٹائم رویہ**: QueryGuardrailEnforcerUtil توثیق کے ساتھ DynamicQueryParameterParserHelper کے ذریعے اخذ کیا جاتا ہے۔
- **استعمال کا طریقہ**: میٹڈ پیرامیٹرز پر `@AutoParam("status")` یا `defaultValue` لگائیں۔
- **کب استعمال کریں**: کنٹرولر کو Spring Web سے آزاد رکھتے ہوئے query params پڑھنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: پاتھ ویری ایبل (`@AutoVariable`) یا JSON باڈی (`@AutoBody`) کے لیے استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"status"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoParam("status") String status` | بائنڈ کرنے کے لیے کوئری پیرامیٹر کا نام۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `name` سے پہلے `value` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `name` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"pageSize"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | واضح کوئری پیرامیٹر کا نام۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `name` سے پہلے `value` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `required` | `boolean` | `true` | نہیں (اختیاری) | `true` (لازمی؛ غائب ہونے پر HTTP 400) یا `false` (اختیاری؛ نہ ہونے پر null جاتا ہے)۔<br/>`@AutoParam(name = "keyword", required = false) String keyword` | کیا پیرامیٹر غائب ہونے پر HTTP 400 واپس کرنا ہے۔<br/>*تنبیہ:* `defaultValue` دینے پر خودکار اختیاری ہو جاتا ہے؛ `false` کے ساتھ پریمٹیو کے بجائے ریپر ٹائپ (`Integer`) استعمال کریں۔ |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"20"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | پیرامیٹر نہ ہونے پر متبادل قدر (ڈیفالٹ DEFAULT_NONE)۔<br/>*تنبیہ:* اسٹرنگ سے Spring `ConversionService` کے ذریعے ہدف ٹائپ میں تبدیل ہوتا ہے؛ غلط قدر پر HTTP `400` ملتا ہے۔ |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **مقصد**: UUIDv7 ریکارڈ IDs جیسے URI پاتھ متغیرات کو بائنڈ کرتا ہے۔
- **رن ٹائم رویہ**: MVC پاتھ ٹیمپلیٹس سے ٹائپ شدہ Java UUID/String قدروں میں پارس ہوتا ہے۔
- **استعمال کا طریقہ**: `findById(@AutoVariable("id") UUID id)` جیسے پاتھ آئی ڈی پیرامیٹر پر لگائیں۔
- **کب استعمال کریں**: پیور Java انٹرفیس میں URI سے `{id}` نکالنے کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: کوئری پیرامیٹرز (`@AutoParam`) یا JSON باڈی (`@AutoBody`) کے لیے استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"orderId"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoVariable("orderId") UUID orderId` | URI پاتھ ویری ایبل کا نام۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `name` سے پہلے `value` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `name` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"tenantCode"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | واضح پاتھ ویری ایبل کا نام۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `name` سے پہلے `value` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `required` | `boolean` | `true` | نہیں (اختیاری) | `true` (لازمی؛ غائب ہونے پر HTTP 400) یا `false` (اختیاری؛ نہ ہونے پر null جاتا ہے)۔<br/>`@AutoVariable(name = "id", required = true) UUID id` | کیا پاتھ ویری ایبل لازمی ہے۔<br/>*تنبیہ:* پاتھ ویری ایبل کا نام URI ٹیمپلیٹ کے `{variableName}` سے ملنا چاہیے؛ `false` صرف اختیاری روٹس میں کارآمد ہے۔ |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **مقصد**: @Valid کے ساتھ DTO یا Entity پیرامیٹرز میں HTTP JSON درخواست کو ڈی سیریلائز کرتا ہے۔
- **رن ٹائم رویہ**: سروس ٹرانزیکشن میں داخل ہونے سے پہلے LocalValidatorFactoryBean سے تصدیق ہوتی ہے۔
- **استعمال کا طریقہ**: `@AutoPost`/`@AutoPut` میتھڈ کے پے لوڈ پیرامیٹر پر `@AutoBody` لگائیں۔
- **کب استعمال کریں**: پیور Java پراکسی کنٹرولرز میں JSON پے لوڈ کو اینٹیٹی یا DTO میں تبدیل کرنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: GET/DELETE میتھڈز پر یا ایک ہی میتھڈ میں دو بار `@AutoBody` نہ لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | نہیں (اختیاری) | `true` (لازمی؛ غائب ہونے پر HTTP 400) یا `false` (اختیاری؛ نہ ہونے پر null جاتا ہے)۔<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | کیا درخواست کی باڈی غائب ہونے پر HTTP 400 واپس کرنا ہے۔<br/>*تنبیہ:* پراکسی ڈسپیچ سے پہلے توثیق کے لیے `@Valid` کے ساتھ ملائیں؛ `false` خالی باڈی کی اجازت دیتا ہے۔ |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: چکری لوپ روک تھام کے ساتھ GET /{id}/{relation}/** کے ذریعے ذیلی روابط کی نیویگیشن کی اجازت دیتا ہے۔
- **رن ٹائم رویہ**: کنٹرولر پر @AutoRestController(enableNestedSubResources = true) درکار ہوتا ہے۔
- **استعمال کا طریقہ**: `@AutoRestController` پر `enableNestedSubResources = true` لگا کر `@EnableNestedSubResource` سے تعلقات محدود کریں۔
- **کب استعمال کریں**: جب `GET /api/v1/customer-orders/{id}/items` جیسے نیسٹڈ پاتھ سیکیورٹی چیکس کے ساتھ درکار ہوں۔
- **کب استعمال نہ کریں اور احتیاطیں**: بغیر `allowedRelationships` محدود کیے یا علیحدہ ڈومینز کے درمیان فعال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)۔<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | GET /{id}/** نیویگیشن میں مجاز اینٹیٹی کلاسز کی فہرست۔<br/>*تنبیہ:* خالی صف تمام ذیلی اینٹیٹیز کھول دیتی ہے؛ اندرونی ٹیبلز کی حفاظت کے لیے واضح کلاسز درج کریں۔ |
| `allowedRelationships` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `"items"`, `"payments"`, `"shipments"` (JPA field names)۔<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | سب ریسورس URLs میں مجاز JPA ریلیشن شپ فیلڈز۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"items"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: کسٹم ایکشن میتھڈز پر ڈومین اسٹیٹ کی منتقلی یا عددی تبدیلیاں متعین کرتا ہے۔
- **رن ٹائم رویہ**: اپڈیٹ شدہ ریکارڈ محفوظ کرنے سے پہلے ایٹامک طور پر چلتا ہے۔
- **استعمال کا طریقہ**: کنٹرولر میتھڈ پر `@AutoPatch` اور `@BusinessAction` یکجا کریں۔
- **کب استعمال کریں**: سروس لکھے بغیر اسٹیٹ ٹرانزیشنز، عددی اضافے اور اینٹیٹی میتھڈز چلانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: متعدد اینٹیٹیز یا بیرونی API کالز کے لیے استعمال نہ کریں (`@ServiceOverride` استعمال کریں)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر لائف سائیکل اسٹیٹس فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"status"`)۔<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | اینٹیٹی میں اسٹیٹ رکھنے والی فیلڈ کا نام۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"status"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `targetStateValue` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"APPROVED"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | ٹرانزیکشن کے اندر targetStateField کو تفویض کی جانے والی اسٹیٹ قدر۔<br/>*تنبیہ:* محفوظ کرنے سے پہلے `@StateMachine` یا `@HumanPolicy` کے تحت جانچا جاتا ہے؛ غیر مجاز تبدیلی پر رول بیک ہوتا ہے۔ |
| `adjustNumericField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر عددی فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"stockQuantity"`)۔<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | ایٹمی طور پر بڑھائے یا گھٹائے جانے والے عددی فیلڈ کا نام۔<br/>*تنبیہ:* اس کے لیے `deltaParamIndex >= 0` یا غیر خالی `fixedDelta` لازمی ہے۔ `Integer`، `Long` اور `BigDecimal` کی حمایت ہے۔ |
| `deltaParamIndex` | `int` | `-1` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `-1` (disabled) or `0`-based method argument index (e.g., `1`)۔<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | ڈائنامک ڈیلٹا رکھنے والے میتھڈ پیرامیٹر کا صفر پر مبنی انڈیکس (-1 غیر فعال کرتا ہے)۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `fixedDelta` سے پہلے `deltaParamIndex` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `fixedDelta` | `String` | `""` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`۔<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | پے لوڈ پیرامیٹر نہ ہونے پر مقرر کردہ عددی ڈیلٹا سٹرنگ (مثلاً "100", "-1")۔<br/>*تنبیہ:* اسٹارٹ اپ پر رجسٹرار `fixedDelta` سے پہلے `deltaParamIndex` پڑھتا ہے۔ دونوں میں متضاد اقدار نہ دیں۔ |
| `entityMethod` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"markFulfilled"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@BusinessAction(entityMethod = "markFulfilled")` | اسی ٹرانزیکشن میں چلنے والے اینٹیٹی کے ڈومین میتھڈ کا نام۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"markFulfilled"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean دریافت، کنفیگریشن بائنڈنگ اور نفاذ کی ترتیب (5 اینوٹیشنز)

### `@AutoComponent`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: کمپائل ٹائم @Component امپورٹ کے بغیر بوٹ پر رجسٹر ہونے والا فریم ورک کمپوننٹ مارکر۔
- **رن ٹائم رویہ**: صرف فریم ورک پیکیج (io.github.natswarchuan) میں اسکین ہوتا ہے؛ ایپس Spring @Component استعمال کریں۔
- **استعمال کا طریقہ**: `io.github.natswarchuan` پیکج میں `AutoBeanFactoryRegistrarBridge` کے ذریعے اسکین کردہ اندرونی کمپوننٹ۔
- **کب استعمال کریں**: صرف `io.github.natswarchuan.*` فریم ورک کے اندرونی ماڈیولز بناتے وقت استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: کنزیومر ایپس (`com.example.*`) میں ہرگز استعمال نہ کریں؛ Spring `@Component` استعمال کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | ApplicationContext میں رجسٹرڈ عین بین نام (مثلاً `"invoiceValidationHelper"`) یا خودکار تلاش کے لیے `""`۔<br/>`@AutoComponent("invoiceValidationHelper")` | اختیاری بین کا نام؛ خالی ہونے پر کلاس کا نام استعمال ہوتا ہے۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: @ServiceOverride کے ساتھ منسلک ServiceImpl کلاسز کے لیے سروس لیئر مارکر۔
- **رن ٹائم رویہ**: io.github.natswarchuan میں کلاس کے نام سے رجسٹر ہوتا ہے؛ ایپ سروسز Spring @Service استعمال کریں۔
- **استعمال کا طریقہ**: `io.github.natswarchuan` میں اندرونی سروس رجسٹر کرنے کا اسٹیریوٹائپ۔
- **کب استعمال کریں**: صرف `io.github.natswarchuan.*` کی اندرونی سروسز کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: اپنی ایپ سروسز میں ہرگز استعمال نہ کریں — Spring `@Service` لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | ApplicationContext میں رجسٹرڈ عین بین نام (مثلاً `"orderFulfillmentService"`) یا خودکار تلاش کے لیے `""`۔<br/>`@AutoService("orderFulfillmentService")` | سروس بین کا اختیاری نام۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: @AutoConfigurationBean کلاسز کے اندر منظم بین فیکٹری میتھڈز متعین کرتا ہے۔
- **رن ٹائم رویہ**: آٹو کنفیگریشن کے دوران PureJavaBeanRegistrarBridge کے ذریعے پروسیس ہوتا ہے۔
- **استعمال کا طریقہ**: فریم ورک `@AutoConfigurationBean` کلاسز کے اندر فیکٹری میتھڈز پر لگائیں۔
- **کب استعمال کریں**: صرف `io.github.natswarchuan.config.*` فریم ورک کے اندر استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: اپنی `@Configuration` کلاسز میں استعمال نہ کریں؛ Spring `@Bean` لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `{"primaryObjectMapper", "nwvmcMapper"}`۔<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | واضح بین کے نام اور عرفی نام۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `targetTypeName` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"com.example.spi.PaymentGateway"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | ہدف قسم کا اختیاری مکمل نام۔<br/>*تنبیہ:* جب فیکٹری میتھڈ سپرٹائپ یا پراکسی دے تو مکمل کلاس نام فراہم کرتا ہے؛ کلاس پاتھ پر موجودگی یقینی بنائیں۔ |
| `primary` | `boolean` | `false` | نہیں (اختیاری) | `true` (متعدد امیدواروں میں ترجیحی بین) یا `false` (معیاری ترجیح)۔<br/>`@AutoBean(primary = true)` | تزریق کے تنازعات میں اس بین کو بنیادی بناتا ہے۔<br/>*تنبیہ:* ایک ہی قسم کے لیے دو `@AutoBean(primary = true)` بنانے پر اسٹارٹ اپ میں تضاد پیدا ہوتا ہے۔ |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: کنفیگریشن کلاسز اور YAML پراپرٹیز بائنڈنگ ماڈلز کو نشان زد کرتا ہے۔
- **رن ٹائم رویہ**: IDE میٹا ڈیٹا کے ساتھ کنفیگریشن بینز اور YAML پریفکسز رجسٹر کرتا ہے۔
- **استعمال کا طریقہ**: `io.github.natswarchuan.config.*` کی کنفیگ کلاسز پر استعمال ہوتا ہے۔
- **کب استعمال کریں**: صرف فریم ورک لائبریری کے اندر Pure Java کنفیگریشن کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: اپنی ایپ کنفیگریشن میں استعمال نہ کریں؛ Spring `@Configuration` استعمال کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | ApplicationContext میں رجسٹرڈ عین بین نام (مثلاً `"storageAutoConfig"`) یا خودکار تلاش کے لیے `""`۔<br/>`@AutoConfigurationBean("storageAutoConfig")` | اختیاری کنفیگریشن بین کا نام۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `prefix` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"nwvmc.storage"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | اختیاری YAML پراپرٹی پریفکس۔<br/>*تنبیہ:* `application.yml` کی پراپرٹیز کو بائنڈ کرتا ہے؛ IDE وارننگز سے بچنے کے لیے metadata شامل کریں۔ |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **مقصد**: SPI Customizer بینز اور فلٹر چینز کے درمیان عمل درآمد کی ترجیح کنٹرول کرتا ہے۔
- **رن ٹائم رویہ**: کم عددی قدریں پہلے چلتی ہیں (ڈیفالٹ Integer.MAX_VALUE)۔
- **استعمال کا طریقہ**: ترتیب شدہ کمپونینٹس پر `@OrderPriority(1)` لگائیں۔
- **کب استعمال کریں**: جب متعدد SPI کسٹمائزرز کے لیے مخصوص ترتیب درکار ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: اسے سیکیورٹی فلٹر آرڈر یا `?sort=` سے خلط ملط نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)۔<br/>`@OrderPriority(10)` | عملدرآمد ترجیحی نمبر؛ کم قدر پہلے چلتی ہے۔<br/>*تنبیہ:* کم اعداد پہلے چلتے ہیں (Spring `@Order` کی طرح)۔ سیکیورٹی/ٹریسنگ کے لیے `< 0` اور کاروباری منطق کے لیے `10..100` رکھیں۔ |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. اینٹیٹی سیکیورٹی، اسٹیٹ مشین، ڈیٹا سالمیت، آٹو جنریٹرز اور کوئریز (11 اینوٹیشنز)

### `@EntitySecurity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: ریکارڈ کی تلاش یا تبدیلی سے پہلے NIST Level 2 RBAC، ownerField علیحدگی اور اجازت کوڈز نافذ کرتا ہے۔
- **رن ٹائم رویہ**: SQL چلانے سے پہلے جانچتا ہے؛ غیر مجاز رسائی پر HTTP 403 Forbidden دیتا ہے۔
- **استعمال کا طریقہ**: JPA `@Entity` کلاس پر `@EntitySecurity` لگا کر رولز اور `ownerField` سیٹ کریں۔
- **کب استعمال کریں**: REST، بیچ اور GraphQL میں یکساں حفاظت کے لیے ہر اینٹیٹی پر لگائیں۔
- **کب استعمال نہ کریں اور احتیاطیں**: `AutoReadApi<E>`، `disabledEndpoints` یا `@SecurityPolicyEntity` کے بغیر مکمل CRUD پر `permitAll = true` نہ لگائیں (یہ READ، WRITE اور DELETE سب کی جانچ بائی پاس کرتا ہے)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_USER", "ROLE_ADMIN"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | ریکارڈ پڑھنے کی مجاز رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |
| `writeRoles` | `String[]` | `{}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_MANAGER", "ROLE_ADMIN"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | POST/PUT/PATCH لکھنے کی مجاز رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |
| `deleteRoles` | `String[]` | `{}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | DELETE آپریشنز کی مجاز رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |
| `permitAll` | `boolean` | `false` | نہیں (اختیاری) | `true` (لاگ ان کے بغیر عوامی رسائی کی اجازت) یا `false` (توثیق اور رول چیک لازمی کریں)۔<br/>`@EntitySecurity(permitAll = true)` | true ہونے پر (DB-RBAC کے بغیر) READ، WRITE اور DELETE سب کی جانچ بائی پاس کرتا ہے؛ AutoReadApi<E> لازمی جوڑیں۔<br/>*تنبیہ:* رول چیکس کو نظرانداز کر کے گمنام رسائی دیتا ہے؛ حساس یا مالی اینٹیٹیز پر ہرگز فعال نہ کریں۔ |
| `ownerField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر مالک/UUID فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"createdBy"`)۔<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | ریکارڈ کے مالک کی شناختی فیلڈ (IDOR سے بچاؤ کے لیے)۔<br/>*تنبیہ:* قطار کی سطح پر ملکیت کی پابندی لگاتا ہے؛ صارف صرف اپنے ریکارڈز دیکھ یا بدل سکتا ہے سوائے `bypassOwnerRoles` کے۔ |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | ownerField کی پابندی سے مستثنیٰ ایڈمن رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |
| `permissions` | `String[]` | `{}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ORDER_READ", "ORDER_APPROVE"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | رولز کے ساتھ جانچے جانے والے باریک اجازت کوڈز۔<br/>*تنبیہ:* JWT یا DB-RBAC `@SecurityPermissionEntity` کے باریک اختیارات کے خلاف جانچا جاتا ہے۔ |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: اجازت نہ ہونے پر حساس کالموں کو ڈائنامک طریقے سے ماسک یا نل کرتا ہے۔
- **رن ٹائم رویہ**: ڈیٹا لانے کے بعد اور JSON سیریلائزیشن سے پہلے لاگو ہوتا ہے۔
- **استعمال کا طریقہ**: حساس فیلڈز (`costPrice`, `ssn`) پر لگائیں؛ اصل ڈیٹا محفوظ رہتا ہے۔
- **کب استعمال کریں**: جب ایک ہی ماڈل مختلف کرداروں کو محدود فیلڈز دکھاتے ہوئے سرو کرنا ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: غیر `String` فیلڈز خودکار `null` ہو جاتی ہیں؛ `String` کو `null` کرنے کے لیے `nullifyInsteadOfMask = true` لگائیں یا `readDto` استعمال کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_ADMIN", "ROLE_FINANCE"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | اصل قدر دیکھنے کی مجاز رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |
| `maskPattern` | `String` | `"******"` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"***-**-****"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | رول نہ ہونے پر سٹرنگ فیلڈز میں لوٹایا جانے والا ماسک پیٹرن۔<br/>*تنبیہ:* `nullifyInsteadOfMask = true` ہونے پر نظرانداز ہوتا ہے۔ غیر اسٹرنگ فیلڈز (`BigDecimal`) کے لیے `nullifyInsteadOfMask = true` بہتر ہے۔ |
| `nullifyInsteadOfMask` | `boolean` | `false` | نہیں (اختیاری) | `true` (غیر مجاز فیلڈ کو null سے بدلیں) یا `false` (maskPattern اسٹرنگ لگائیں)۔<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true ہونے پر String فیلڈز بھی maskPattern کے بجائے null ہو جاتی ہیں (غیر سٹرنگ اقسام خودکار null ہوتی ہیں)۔<br/>*تنبیہ:* عددی اور تاریخ والی فیلڈز کے لیے لازمی تاکہ TypeScript/Zod کلائنٹ کو درست `null` ملے۔ |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: POST /{id}/transition پر مجاز حالت کی منتقلی نافذ کرتا ہے اور DELETE /{id} کو deletableStates تک محدود رکھتا ہے۔
- **رن ٹائم رویہ**: ناجائز منتقلی یا حذف کو HTTP 422 BusinessRuleViolationException کے ساتھ مسترد کرتا ہے۔
- **استعمال کا طریقہ**: String اسٹیٹ فیلڈ پر `:` کے ساتھ (`"CREATED:PAID,CANCELLED"`) لگائیں۔
- **کب استعمال کریں**: آرڈرز یا قرضوں کے سخت اسٹیٹ ورک فلو میں ناجائز تبدیلی روکنے (`HTTP 422`) کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: کبھی `"->"` نحو استعمال نہ کریں (صرف `":"` چلتا ہے)!

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"CREATED"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | تخلیق پر فیلڈ خالی ہونے پر ابتدائی اسٹیٹ ("ACTIVE")۔<br/>*تنبیہ:* `POST` بناتے وقت فیلڈ خالی ہونے پر خودکار بھرتا ہے؛ `transitions` میں `:` سے پہلے والے نام سے ملنا چاہیے۔ |
| `transitions` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)۔<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | "FROM:TO_1,TO_2" فارمیٹ میں مجاز اسٹیٹ ٹرانزیشن قوانین۔<br/>*تنبیہ:* عین کولن نحو `"FROM:TO1,TO2"` لازمی ہے (اہداف کوما سے الگ)؛ غیر اعلانیہ منتقلی HTTP `400`/`409` کے ساتھ مسترد ہوتی ہے۔ |
| `deletableStates` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)۔<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | وہ اسٹیٹس جن میں DELETE کی اجازت ہے (باقی پر HTTP 422)۔<br/>*تنبیہ:* غیر خالی ہونے پر کسی دوسری حالت (مثلاً `"PAID"`) میں `DELETE` کرنے پر HTTP `409 Conflict` ملتا ہے۔ |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: پڑھنے کے قابل پالیسی شقوں کو فعال RBAC، منتقلی اور ماسکنگ قواعد میں مرتب کرتا ہے۔
- **رن ٹائم رویہ**: GET /human-policy پر معائنہ کے قابل اور spring-nwvmc.human-policies.<Entity> کے تحت YAML میں قابل تبدیلی۔
- **استعمال کا طریقہ**: اینٹیٹی پر لگائیں یا YAML میں `spring-nwvmc.human-policies` سیٹ کریں۔
- **کب استعمال کریں**: جب کمپلائنس ٹیموں کو کوڈ بدلے بغیر قابلِ فہم YAML قواعد درکار ہوں۔
- **کب استعمال نہ کریں اور احتیاطیں**: بے ترتیب عبارات یا غیر انگریزی جملے مت لکھیں — یہ مقررہ انگریزی پیٹرنز پڑھتا ہے۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`۔<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | فطری انگریزی لائف سائیکل ہدایات جو اسٹیٹ ٹرانزیشنز میں بدلتی ہیں۔<br/>*تنبیہ:* اسٹارٹ اپ پر `@StateMachine` انجن میں کمپائل ہوتا ہے؛ ایک ہی اینٹیٹی پر متضاد قوانین نہ لکھیں۔ |
| `security` | `String` | `""` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`۔<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | پڑھنے/لکھنے/مٹانے کے لیے فطری انگریزی RBAC اصول۔<br/>*تنبیہ:* رول ناموں میں `ROLE_` خودکار شامل ہوتا ہے اور اسٹارٹ اپ پر فوری توثیق ہوتی ہے۔ |
| `masking` | `String` | `""` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`۔<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | فیلڈ ماسکنگ کے لیے فطری انگریزی پالیسی۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"costPrice"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `stateField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر لائف سائیکل اسٹیٹس فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"orderStatus"`)۔<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | اسٹیٹ رکھنے والی اینٹیٹی فیلڈ کا نام۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"orderStatus"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: ٹائم ٹریول اسٹیٹ کی بحالی اور /diff معائنے کے لیے فیلڈ کی سطح پر تبدیلیاں ریکارڈ کرتا ہے۔
- **رن ٹائم رویہ**: create، update، patch، transition اور restore پر oldValue اور newValue کی تبدیلیاں محفوظ کرتا ہے۔
- **استعمال کا طریقہ**: `BaseAuditEntity` پر `@AuditTrail` لگائیں تاکہ ہر تبدیلی خودکار ریکارڈ ہو۔
- **کب استعمال کریں**: ادائیگیوں، آرڈرز اور طبی ریکارڈز پر `GET /{id}/revisions` آڈٹ ٹریل کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: زیادہ لکھنے والی ٹیلی میٹری یا لاگ ٹیبلز پر `recordFieldDiffs = true` استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"FINANCE_LEDGER"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | آڈٹ ایونٹ پر درج کی جانے والی کیٹیگری؛ خالی پر اینٹیٹی نام۔<br/>*تنبیہ:* آڈٹ لاگز کو درجہ بند کرنے کے لیے؛ `""` چھوڑنے پر اینٹیٹی کا نام استعمال ہوتا ہے۔ |
| `recordFieldDiffs` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true ہونے پر Time-Travel کے لیے پرانی بمقابلہ نئی قدر کا فرق محفوظ کرتا ہے۔<br/>*تنبیہ:* ہر `PUT`/`PATCH` پر پہلے اور بعد کا فرق محفوظ کرتا ہے؛ بڑے ڈیٹا پر `false` رکھیں۔ |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: بائی پاس رول کے بغیر فعال کرایہ دار کے مطابق قطاروں اور تبدیلیوں کو خودکار الگ رکھتا ہے۔
- **رن ٹائم رویہ**: بائی پاس رول کے بغیر کرایہ دار سیاق مفقود ہونے پر HTTP 403 دیتا ہے؛ تخلیق پر tenantId کو زبردستی اوور رائٹ کرتا ہے اور تمام ID آپریشنز میں IDOR روکتا ہے۔
- **استعمال کا طریقہ**: SaaS اینٹیٹی پر لگائیں؛ فلٹرنگ، اینٹی سپوفنگ اور fail-closed `403` خودکار چلتے ہیں۔
- **کب استعمال کریں**: تمام مشترکہ SaaS ٹیبلز میں کراس ٹیننٹ ڈیٹا لیک روکنے کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: ممالک یا کرنسیوں جیسے عالمی حوالہ جاتی ٹیبلز پر استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | نہیں (اختیاری) | اینٹیٹی پر ٹیننٹ شناخت فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"tenantId"`)۔<br/>`@MultiTenant(tenantField = "organizationId")` | ٹیننٹ آئی ڈی رکھنے والی فیلڈ کا نام (ڈیفالٹ "tenantId")۔<br/>*تنبیہ:* تیز اور محفوظ ٹیننٹ علیحدگی کے لیے ڈیٹابیس میں `(tenant_id, id)` انڈیکس بنائیں۔ |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | نہیں (اختیاری) | Spring Security رول ناموں کی صف (مثلاً `{"ROLE_SUPER_ADMIN"}`)؛ خالی `{}` اضافی پابندی نہیں لگاتا۔<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | تمام ٹیننٹس تک رسائی رکھنے والے پلیٹ فارم ایڈمن رولز۔<br/>*تنبیہ:* رول نام `RoleConstant` میں `ROLE_` کے سابقے (مثلاً `ROLE_ADMIN`) کے ساتھ رکھیں تاکہ Spring Security سے مطابقت رہے۔ |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: create، update اور upsert پر محفوظ کرنے سے پہلے انفرادیت کی تصدیق کرتا ہے۔
- **رن ٹائم رویہ**: نقل قدر موجود ہونے پر ConflictBusinessException (HTTP 409) دیتا ہے۔
- **استعمال کا طریقہ**: کاروباری کلیدی فیلڈز (`email`, `skuCode`) پر `@Column(unique = true)` کے ساتھ لگائیں۔
- **کب استعمال کریں**: جب فعال ریکارڈز میں انفرادیت جانچ کر واضح `HTTP 409 Conflict` دینا ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: زیادہ کنکرنسی میں ڈیٹا بیس `UNIQUE` انڈیکس کے بغیر صرف اس پر انحصار نہ کریں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: خالی چھوڑنے پر تخلیق یا کلون کے وقت منفرد پریفکس بزنس کوڈ خودکار بناتا ہے۔
- **رن ٹائم رویہ**: تصدیق اور محفوظ کرنے سے پہلے پریفکس + منفرد ٹوکن بھرتا ہے۔
- **استعمال کا طریقہ**: String کوڈ فیلڈ پر `@AutoCode(prefix = "PRD-")` لگائیں؛ خالی ہونے پر خودکار بنے گا۔
- **کب استعمال کریں**: آرڈر نمبرز، SKU یا ٹکٹ آئی ڈیز کے لیے بغیر DB سیکوئنس رکاوٹ کے کوڈ بنانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: اگر قانونی طور پر بغیر وقفے کے نمبر (`1, 2, 3...`) لازمی ہوں تو استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **ہاں (لازمی)** | غیر خالی شناختی اسٹرنگ (مثلاً `"ORD"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | 8 حروف کے UUIDv7 ہیش سے پہلے لازمی پریفکس (مثلاً "PRD-")۔<br/>*تنبیہ:* لازمی صفت؛ تخلیق کے وقت فیلڈ خالی ہونے پر ہی `INV-2026-0001` جیسا کوڈ تیار کرتی ہے۔ |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: sourceField سے خودکار URL-موافق ASCII سلگ تیار کرتا ہے۔
- **رن ٹائم رویہ**: Unicode نشانات کو نارملائز کر کے سلگ کوئری کی سہولت فراہم کرتا ہے۔
- **استعمال کا طریقہ**: `slug` فیلڈ پر `@AutoSlug(sourceField = "name")` لگائیں۔
- **کب استعمال کریں**: اسٹور فرنٹس، بلاگز اور مصنوعات کے لیے SEO دوستانہ URLs بنانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: `sourceField` کو غلط پراپرٹی کی طرف مت جوڑیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **ہاں (لازمی)** | اینٹیٹی پر اسٹرنگ فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"title"`)۔<br/>`@AutoSlug(sourceField = "productName") private String slug;` | لازمی سورس فیلڈ کا نام جسے لوئر کیس ASCII سلگ میں بدلا جاتا ہے۔<br/>*تنبیہ:* لازمی؛ متن کو محفوظ URL kebab-case سلگ میں تبدیل کرتا ہے۔ یکتائی کے لیے `@UniqueField` شامل کریں۔ |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **مقصد**: تبدیلیاں محفوظ کرنے سے پہلے اخذ کردہ عددی مجموعے کا حساب لگاتا ہے۔
- **رن ٹائم رویہ**: بوٹ پر ComputedFieldFailFastUtil سے تصدیق ہوتی ہے تاکہ غلط فیلڈز فوراً ناکام ہوں۔
- **استعمال کا طریقہ**: محسوب عددی فیلڈ (`BigDecimal`) پر لگائیں؛ سرور پر خودکار حساب لگتا ہے۔
- **کب استعمال کریں**: کلائنٹ کی جعلسازی روکنے کے لیے سرور پر آرڈر کی کل رقم نکالنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: پیچیدہ پروموشنز یا بیرونی API حسابات کے لیے استعمال نہ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)۔<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | حساب کا طریقہ: "MULTIPLY" یا "SUM_COLLECTION"۔<br/>*تنبیہ:* محفوظ کرنے سے پہلے خودکار دوبارہ حساب لگاتا ہے تاکہ کلائنٹ کی تبدیل شدہ رقم نظرانداز ہو۔ |
| `sourceFields` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `{"unitPrice", "quantity"}` (numeric properties on same entity)۔<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | "MULTIPLY" موڈ میں ضرب دی جانے والی فیلڈز۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"unitPrice"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `collectionField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر @OneToMany کلیکشن فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"items"`)۔<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" میں جمع ہونے والی @OneToMany کلیکشن فیلڈ۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"items"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `itemField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر عددی فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"subTotal"`)۔<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | ہر ذیلی آئٹم کی عددی فیلڈ جسے جمع کیا جاتا ہے۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"subTotal"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `subtractField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر عددی فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"discountAmount"`)۔<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | مجموعی رقم سے منفی کی جانے والی رعایت فیلڈ۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"discountAmount"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `addField` | `String` | `""` | نہیں (اختیاری) | اینٹیٹی پر عددی فیلڈ سے عین مطابق Java پراپرٹی نام (مثلاً `"shippingFee"`)۔<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | نتیجے میں شامل کی جانے والی اضافی فیس فیلڈ۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"shippingFee"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: کنٹرولر اینڈپوائنٹس سے کسٹم SQL/JPQL یا پرووائیڈر ہیلپر میتھڈز جوڑنے کی اجازت دیتا ہے۔
- **رن ٹائم رویہ**: JPA EntityManager کے ذریعے نامزد پیرامیٹرز کے ساتھ چلایا جاتا ہے۔
- **استعمال کا طریقہ**: `@AutoGet`/`@AutoPost` کے ساتھ `:param` بائنڈنگ کے لیے استعمال کریں۔
- **کب استعمال کریں**: رپورٹس، CTEs یا ونڈو فنکشنز کے لیے بغیر ریپوزیٹری بنائے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: کبھی یوزر ان پٹ کو براہِ راست SQL میں نہ جوڑیں (ہمیشہ `:param` استعمال کریں)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders۔<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | `:param` سپورٹ کے ساتھ ان لائن SQL یا JPQL کوئری۔<br/>*تنبیہ:* SQL انجیکشن سے بچنے کے لیے ہمیشہ `:param` یا `?1` استعمال کریں؛ `sqlProvider` کے ساتھ `""` چھوڑیں۔ |
| `nativeQuery` | `boolean` | `true` | نہیں (اختیاری) | `true` (ڈیٹابیس نیٹیو SQL چلائیں) یا `false` (پورٹیبل JPA JPQL چلائیں)۔<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true نیٹو SQL چلاتا ہے؛ false JPQL چلاتا ہے۔<br/>*تنبیہ:* نیٹیو SQL (`true`) CTE اور ونڈو فنکشنز فراہم کرتا ہے؛ پورٹیبلٹی کے لیے `false` (JPQL) منتخب کریں۔ |
| `resultClass` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `MonthlyRevenueDto.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | نتیجہ میپ کرنے والی اختیاری کلاس۔<br/>*تنبیہ:* رپورٹ کوئریز کے لیے ہمیشہ DTO پروجیکشن کلاس دیں تاکہ `SELECT *` سے بچا جا سکے۔ |
| `sqlProvider` | `Class<?>` | `Void.class` | نہیں (اختیاری) | کوئی بھی حقیقی Java DTO کلاس (مثلاً `OrderAnalyticsSqlProvider.class`) یا DTO میپنگ بند کرنے کے لیے `Void.class`۔<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | اسٹارٹ اپ پر تصدیق شدہ ڈائنامک SQL فراہم کرنے والی کلاس۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `sqlProvider` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `providerMethod` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"buildRevenueSql"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | `sqlProvider` میں SQL واپس کرنے والے میتھڈ کا نام۔<br/>*تنبیہ:* Java میتھڈ/فیلڈ نام سے کیس-سینسٹو عین مطابقت ضروری ہے (مثلاً `"buildRevenueSql"`)؛ فرق ہونے پر رن ٹائم خرابی ہوگی۔ |
| `modifying` | `boolean` | `false` | نہیں (اختیاری) | `true` (رائٹ ٹرانزیکشن میں UPDATE/DELETE DML) یا `false` (صرف پڑھنے والی SELECT کوئری)۔<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE کے لیے `true` ہونا لازمی ہے۔<br/>*تنبیہ:* کسی بھی `UPDATE`/`DELETE` کے لیے `true` لازمی ہے؛ خودکار رائٹ ٹرانزیکشن شروع کرتا ہے۔ |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. ڈیٹا بیس پر مبنی ڈائنامک RBAC اور فیلڈ ماسکنگ میٹا اینوٹیشنز (18 اینوٹیشنز)

### `@SecurityRoleEntity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **مقصد**: JPA ریکارڈ کو لائیو ڈیٹابیس RBAC کردار کیٹلاگ ٹیبل کے طور پر مقرر کرتا ہے۔
- **رن ٹائم رویہ**: DynamicDatabaseRbacProviderHelper کردار اور اجازت کے ربط Caffeine میں کیش کرتا ہے اور تبدیلی پر خودکار صاف کرتا ہے۔
- **استعمال کا طریقہ**: اپنی Role JPA اینٹیٹی پر `@SecurityRoleEntity` اور لازمی `@RoleCode` لگائیں۔
- **کب استعمال کریں**: جب ایڈمن کو ڈیٹا بیس سے ڈائنامک رولز کا انتظام کرنا ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: `@RoleCode` مت چھوڑیں (بوٹ ناکام ہو جائے گا) اور دو `@SecurityRoleEntity` نہ بنائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `60L`۔<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine سنیپ شاٹ کیش TTL سیکنڈز میں۔<br/>*تنبیہ:* کم TTL تبدیلیاں جلدی دکھاتا ہے مگر کوئریز بڑھاتا ہے؛ زیادہ TTL بوجھ گھٹاتا ہے مگر منسوخی میں تاخیر کرتا ہے۔ |

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

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityRoleEntity کے اندر منفرد کردار کوڈ کالم کو میپ کرتا ہے۔
- **رن ٹائم رویہ**: GrantedAuthority ٹوکنز ملانے کے لیے کیش شدہ LambdaAccessorUtil سے پڑھا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@RoleCode` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityRoleEntity پر کردار کا قابل فہم ڈسپلے نام فیلڈ ظاہر کرتا ہے۔
- **رن ٹائم رویہ**: RBAC تشخیصی میٹا ڈیٹا اور Dev Studio معائنے میں ظاہر ہوتا ہے۔
- **استعمال کا طریقہ**: `@SecurityRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@RoleName` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: کردار ریکارڈ پر دیے گئے اجازت کوڈز کا مجموعہ یا CSV فیلڈ نشان زد کرتا ہے۔
- **رن ٹائم رویہ**: ڈائنامک طور پر پارس ہو کر موثر SecurityIdentityCustomizer اختیارات میں پھیلتا ہے۔
- **استعمال کا طریقہ**: `@SecurityRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@RolePermissions` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **مقصد**: وسائل-عمل کی اجازتیں اور ڈائنامک فیلڈ ماسکنگ قواعد محفوظ کرنے والے JPA ریکارڈ کو نشان زد کرتا ہے۔
- **رن ٹائم رویہ**: CRUD کنٹرول اور فیلڈ ماسکنگ کے لیے DatabaseRbacRuleMatcherHelper میں لوڈ ہوتا ہے۔
- **استعمال کا طریقہ**: Permission اینٹیٹی پر `@SecurityPermissionEntity` اور لازمی `@PermissionCode` لگائیں۔
- **کب استعمال کریں**: ڈیٹا بیس سے باریک اجازتیں اور فیلڈ ماسکنگ منظم کرنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: `@PermissionCode` نہ بھولیں اور دو `@SecurityPermissionEntity` نہ بنائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `60L`۔<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | اجازتوں کے لیے Caffeine سنیپ شاٹ TTL سیکنڈز میں۔<br/>*تنبیہ:* کم TTL تبدیلیاں جلدی دکھاتا ہے مگر کوئریز بڑھاتا ہے؛ زیادہ TTL بوجھ گھٹاتا ہے مگر منسوخی میں تاخیر کرتا ہے۔ |

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

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPermissionEntity کے اندر منفرد اجازت کوڈ فیلڈ مقرر کرتا ہے۔
- **رن ٹائم رویہ**: صارف کے اختیارات اور @EntitySecurity.permissions() کوڈز سے ملایا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPermissionEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PermissionCode` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPermissionEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPermissionEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPermissionEntity کے اندر ہدف ریکارڈ یا API وسائل کا نام (یا *) میپ کرتا ہے۔
- **رن ٹائم رویہ**: وائلد کارڈ سپورٹ کے ساتھ DatabaseRbacRuleMatcherHelper کے ذریعے جانچا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPermissionEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PermissionResource` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPermissionEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPermissionEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPermissionEntity کے تحت محفوظ منطقی CRUD یا کسٹم ایکشن کو میپ کرتا ہے۔
- **رن ٹائم رویہ**: کنٹرولر میتھڈ ناموں سے خودکار طور پر READ، WRITE، DELETE یا کسٹم ایکشن میں نارملائز ہوتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPermissionEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PermissionAction` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPermissionEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPermissionEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: ان کما سے الگ فیلڈز کا اعلان کرتا ہے جنہیں اس قاعدے کے لاگو ہونے پر ڈائنامک ماسک کرنا ہو۔
- **رن ٹائم رویہ**: HTTP JSON جواب سیریلائز ہونے سے پہلے @FieldSecurity کے ساتھ ڈائنامک لاگو ہوتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPermissionEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PermissionFieldMask` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPermissionEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPermissionEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **مقصد**: تصدیق شدہ صارفین کو DB کرداروں اور کرایہ دار کے دائرہ کار سے جوڑنے والا JPA ریکارڈ مقرر کرتا ہے۔
- **رن ٹائم رویہ**: JWT / SecurityContext ہائیڈریشن کے دوران SecurityIdentityCustomizer کے ذریعے خودکار کوئری ہوتا ہے۔
- **استعمال کا طریقہ**: صارف-رول اینٹیٹی پر `@SecurityUserRoleEntity` کے ساتھ `@UserRoleSubject` و `@UserRoleCode` لگائیں۔
- **کب استعمال کریں**: جب JWT صرف صارف نام رکھتا ہو اور رولز ڈیٹا بیس سے لوڈ کرنے ہوں۔
- **کب استعمال نہ کریں اور احتیاطیں**: `@UserRoleSubject` نہ بھولیں؛ اگر بیرونی IdP پہلے ہی تمام رولز دیتا ہو تو ضرورت نہیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@SecurityUserRoleEntity(enabled = true)` | صارف اور رول کے تعلقات کو آن یا آف کرنے کا سوئچ۔<br/>*تنبیہ:* اسکیما مائیگریشن کے دوران عارضی طور پر `false` رکھ کر JWT رولز چالو رکھے جا سکتے ہیں۔ |

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

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityUserRoleEntity پر بنیادی صارف نام / سبجیکٹ فیلڈ شناخت کرتا ہے۔
- **رن ٹائم رویہ**: فعال SecurityContext سے Authentication.getName() کے ساتھ ملایا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityUserRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@UserRoleSubject` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityUserRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityUserRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityUserRoleEntity کے اندر تفویض کردہ کردار کوڈ کالم کو جوڑتا ہے۔
- **رن ٹائم رویہ**: پالیسی جانچ کے دوران منسلک @SecurityRoleEntity اجازتیں حل کرتا ہے۔
- **استعمال کا طریقہ**: `@SecurityUserRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@UserRoleCode` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityUserRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityUserRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityUserRoleEntity تفویض کو مخصوص کرایہ دار ID (یا عالمی کے لیے *) تک محدود کرتا ہے۔
- **رن ٹائم رویہ**: ہر تصدیق شدہ درخواست پر TenantContextHolder / X-Tenant-ID کے مطابق فلٹر ہوتا ہے۔
- **استعمال کا طریقہ**: `@SecurityUserRoleEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@UserRoleTenantId` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityUserRoleEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityUserRoleEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **مقصد**: ترجیح کے لحاظ سے ترتیب شدہ واضح ALLOW / DENY اجازت پالیسیاں محفوظ کرنے والا JPA ریکارڈ مقرر کرتا ہے۔
- **رن ٹائم رویہ**: واضح DENY قطعی طور پر ALLOW پر غالب رہتا ہے؛ SQL سے پہلے پالیسیاں جانچی جاتی ہیں۔
- **استعمال کا طریقہ**: پالیسی اینٹیٹی پر `@SecurityPolicyEntity` اور لازمی `@PolicyAllowedRoles` لگائیں۔
- **کب استعمال کریں**: اسٹیٹک `@EntitySecurity` کو ڈیٹا بیس قوانین سے ڈائنامک طور پر اوور رائیڈ کرنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: `@PolicyAllowedRoles` نہ چھوڑیں؛ واضح `DENY` قواعد کو ہمیشہ ترجیح ملتی ہے۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | نہیں (اختیاری) | عددی ترجیح میں مثبت عدد (`>= 0`)؛ مثلاً `10`۔<br/>`@SecurityPolicyEntity(priority = 10)` | پالیسیوں کی ترجیح (کم نمبر = زیادہ اہمیت)۔<br/>*تنبیہ:* متعدد پالیسیاں ملنے پر کم عدد کو ترجیح ملتی ہے (مثلاً `10`، `100` پر غالب آتا ہے)۔ |

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

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPolicyEntity میں ہدف وسائل کے شناخت کنندہ کو میپ کرتا ہے۔
- **رن ٹائم رویہ**: درست ریکارڈ/وسائل کے نام اور وائلڈ کارڈ * دونوں کی حمایت کرتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPolicyEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PolicyResource` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPolicyEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPolicyEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPolicyEntity کے اندر محفوظ عمل (READ, WRITE, DELETE, methodName, *) کو میپ کرتا ہے۔
- **رن ٹائم رویہ**: سروس کو بھیجنے سے پہلے ہر HTTP آپریشن پر جانچا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPolicyEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PolicyAction` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPolicyEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPolicyEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPolicyEntity قاعدے کے ہدف کرداروں کے مجموعے یا CSV فہرست کو میپ کرتا ہے۔
- **رن ٹائم رویہ**: فعال JWT اختیارات اور ڈیٹابیس سے لوڈ شدہ @SecurityUserRoleEntity کرداروں سے جانچا جاتا ہے۔
- **استعمال کا طریقہ**: `@SecurityPolicyEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PolicyAllowedRoles` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPolicyEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPolicyEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **مقصد**: @SecurityPolicyEntity قاعدے پر ALLOW یا DENY پالیسی نتیجہ متعین کرتا ہے۔
- **رن ٹائم رویہ**: کوئی بھی مطابقت رکھنے والی DENY پالیسی فوری HTTP 403 AccessDeniedBusinessException کے ساتھ درخواست روک دیتی ہے۔
- **استعمال کا طریقہ**: `@SecurityPolicyEntity` اینٹیٹی میں متعلقہ فیلڈ یا گیٹر پر `@PolicyEffect` لگائیں۔
- **کب استعمال کریں**: موجودہ کالم نام برقرار رکھتے ہوئے `@SecurityPolicyEntity` کو DB-RBAC سے جوڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ایک ہی کلاس میں دہرائیں مت اور `@SecurityPolicyEntity` کے بغیر نہ لگائیں۔

> **مارکر اینوٹیشن**: خالص مارکر اینوٹیشن — اس میں کوئی ایٹری بیوٹ نہیں ہے۔

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. ڈسٹری بیوٹڈ لاکنگ، آئڈیمپوٹینسی، کیشنگ، ملٹی ڈی بی اور کلاؤڈ ایونٹس (13 اینوٹیشنز)

### `@DistributedLock`

- **پیکج**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **مقصد**: AST نقشے میں کیش شدہ SpEL کلیدوں پر بیک وقت رسائی کو ترتیب وار چلاتا ہے (ڈیفالٹ 3000L/5000L)۔
- **رن ٹائم رویہ**: وقت ختم ہونے پر DistributedLockAspect HTTP 409 DistributedLockAcquisitionException دیتا ہے۔
- **استعمال کا طریقہ**: نان فائنل `@Service` میتھڈ پر لگائیں؛ کلسٹر کے لیے Redis `DistributedLockProvider` فراہم کریں۔
- **کب استعمال کریں**: اسٹاک اوور سیلنگ یا بیک وقت والیٹ کٹوتی روکنے کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: ڈیفالٹ Caffeine پرووائیڈر کو ملٹی نوڈ لاک نہ سمجھیں اور `final class` پر نہ لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | نہیں (اختیاری) | میتھڈ پیرامیٹرز کا حوالہ دینے والا SpEL ایکسپریشن (مثلاً `"'inventory:' + #skuId"`) یا خودکار کلید کے لیے `""`۔<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | رن ٹائم پر جانچا جانے والا SpEL لاک کلید اظہار۔<br/>*تنبیہ:* کلید کو ہمیشہ مخصوص ID (`#id`) تک محدود رکھیں؛ مستقل کلید تمام ٹریفک کو قطار میں لگا دے گی۔ |
| `waitTimeMs` | `long` | `3000L` | نہیں (اختیاری) | ملی سیکنڈ میں مثبت عدد (`>= 0`)؛ مثلاً `3000L`۔<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | لاک حاصل کرنے کا زیادہ سے زیادہ انتظار ملی سیکنڈ میں (3000L)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: بہت کم ہونے پر 409 خطائیں بڑھیں گی؛ بہت زیادہ ہونے پر تھریڈز رک سکتے ہیں۔ |
| `leaseTimeMs` | `long` | `5000L` | نہیں (اختیاری) | ملی سیکنڈ میں مثبت عدد (`>= 100`)؛ مثلاً `10000L`۔<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | لاک لیز کی زیادہ سے زیادہ مدت ملی سیکنڈ میں (5000L)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: سب سے سست p99 ٹرانزیکشن سے زیادہ ہونا چاہیے ورنہ لاک درمیان میں ختم ہو سکتا ہے۔ |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: قابل ترتیب TTL ونڈو کے اندر بیک وقت یا دہرائی جانے والی ڈپلیکیٹ تحریروں کو روکتا ہے۔
- **رن ٹائم رویہ**: IdempotencyAspect اور ProxyIdempotencyGuardHelper کیش Caffeine TTL لاک (HTTP 409 ConflictBusinessException) نافذ کرتے ہیں؛ غائب کلیدیں گزر جاتی ہیں اور IdempotencyManagerHelper اختیاری ہے۔
- **استعمال کا طریقہ**: `@AutoRestController` یا نان فائنل `@Service` میتھڈ پر لگائیں؛ ناکامی پر کلید آزاد ہو جاتی ہے۔
- **کب استعمال کریں**: ادائیگیوں اور رقم کی منتقلی میں ڈبل سبمشن روکنے کے لیے استعمال کریں۔
- **کب استعمال نہ کریں اور احتیاطیں**: GET ریڈز پر استعمال نہ کریں اور ملٹی نوڈ کے لیے Redis `IdempotencyStoreProvider` شامل کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | نہیں (اختیاری) | درست HTTP ہیڈر نام (نیٹ ورک پر کیس-ان سینسٹو، مثلاً `"X-Idempotency-Key"`)۔<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | کلائنٹ کی دی گئی آئیڈیمپوٹینسی کلید والا HTTP ہیڈر۔<br/>*تنبیہ:* کلائنٹ کو ہر آپریشن کے لیے منفرد UUIDv7 بھیجنا اور ری ٹرائی پر وہی دہرانا چاہیے؛ اسے CORS میں شامل کریں۔ |
| `ttlSeconds` | `long` | `300L` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `300L`۔<br/>`@Idempotent(ttlSeconds = 900L)` | ڈوپلیکیٹ روکنے کی مدت سیکنڈز میں (دہرانے پر HTTP 409 Conflict)۔<br/>*تنبیہ:* Redis یا میموری میں جواب محفوظ رکھنے کی مدت؛ ری ٹرائی کے مطابق `300L–86400L` رکھیں۔ |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: IP، User یا Tenant کے مطابق سلائیڈنگ ونڈو ریٹ لمیٹنگ نافذ کرتا ہے۔
- **رن ٹائم رویہ**: nwvmc.ratelimit.rejected.total میٹرک بڑھاتا ہے اور HTTP 429 Too Many Requests لوٹاتا ہے۔
- **استعمال کا طریقہ**: کنٹرولر یا میتھڈ پر لگائیں؛ `X-RateLimit-Remaining` و `X-RateLimit-Reset` بھیجتا ہے اور حد پار کرنے پر `HTTP 429` + `Retry-After` دیتا ہے۔
- **کب استعمال کریں**: پبلک سرچ، auth، AI کوئریز اور بھاری ایکسپورٹس کو زیادتی سے بچانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: ہیلتھ پروبز پر سخت حد نہ لگائیں اور صارفین یا ٹیننٹس کو الگ رکھنے کے لیے `"GLOBAL"` سے بچیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | نہیں (اختیاری) | درخواستیں میں مثبت عدد (`>= 1`)؛ مثلاً `60`۔<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | فی ونڈو زیادہ سے زیادہ اجازت یافتہ درخواستیں (60)۔<br/>*تنبیہ:* HTTP `429` پر `X-RateLimit-Remaining`، `X-RateLimit-Reset` اور RFC 6585 `Retry-After` ہیڈرز بھیجتا ہے۔ |
| `windowSeconds` | `int` | `60` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `60`۔<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | ریٹ لمٹ ونڈو کا دورانیہ سیکنڈز میں (60)۔<br/>*تنبیہ:* کاؤنٹر ونڈو کا دورانیہ طے کرتا ہے اور `X-RateLimit-Reset` و `Retry-After` کا حساب لگاتا ہے۔ |
| `partitionKey` | `String` | `"IP"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)۔<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | متحرک تقسیم: "IP"/"clientIp"، "USER" (گمنام صارف کے لیے IP فال بیک)، "TENANT"، "GLOBAL" یا SpEL "#expr"۔<br/>*تنبیہ:* `"USER"` مصدقہ صارف کے مطابق اور گمنام کالز پر IP استعمال کرتا ہے؛ `"GLOBAL"` سب کے لیے ایک مشترکہ کوٹہ ہے۔ |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: Actuator اور Micrometer کو ٹیلی میٹری بھیجتے ہوئے Resilience4j سرکٹ بریکر میں آپریشنز چلاتا ہے۔
- **رن ٹائم رویہ**: خرابی کی شرح حد سے بڑھنے پر OPEN (HTTP 503) پر چلا جاتا ہے اور میٹرک اپڈیٹ کرتا ہے۔
- **استعمال کا طریقہ**: بیرونی APIs یا AI سے جڑے کنٹرولرز پر لگائیں تاکہ مسلسل ناکامی سے بچا جا سکے۔
- **کب استعمال کریں**: جب تھریڈز کو بلاک ہونے سے بچانے کے لیے فوری `HTTP 503` واپس کرنا ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: `CircuitBreakerErrorFilterUtil` خودکار 4xx `BaseBusinessException` کو نظرانداز کرتا ہے؛ کلائنٹ غلطیوں کو `RuntimeException` میں نہ لپیٹیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"payment-gateway-cb"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j سرکٹ بریکر کا نام۔<br/>*تنبیہ:* Resilience4j انسٹنس اور Micrometer ٹیگ متعین کرتا ہے؛ `""` کلاس نام استعمال کرتا ہے۔ |
| `failureRateThreshold` | `float` | `50.0f` | نہیں (اختیاری) | فیصد میں مثبت عدد (`1.0f .. 100.0f`)؛ مثلاً `50.0f`۔<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | بریکر OPEN ہونے کی ناکامی شرح فیصد (50.0f)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: 4xx کاروباری خطائیں خودکار نظرانداز ہوتی ہیں؛ صرف 5xx یا انفراسٹرکچر خرابی سرکٹ کھولتی ہے۔ |
| `waitDurationInOpenStateSeconds` | `int` | `10` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `15`۔<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | HALF_OPEN سے پہلے OPEN حالت کا وقت سیکنڈز میں (10)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: 4xx کاروباری خطائیں خودکار نظرانداز ہوتی ہیں؛ صرف 5xx یا انفراسٹرکچر خرابی سرکٹ کھولتی ہے۔ |
| `slidingWindowSize` | `int` | `20` | نہیں (اختیاری) | کالز میں مثبت عدد (`>= 1`)؛ مثلاً `20`۔<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | ناکامی کا حساب لگانے والی ونڈو میں کالز کی تعداد (20)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: 4xx کاروباری خطائیں خودکار نظرانداز ہوتی ہیں؛ صرف 5xx یا انفراسٹرکچر خرابی سرکٹ کھولتی ہے۔ |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | نہیں (اختیاری) | کالز میں مثبت عدد (`>= 1`)؛ مثلاً `5`۔<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | بحالی جانچنے کے لیے HALF_OPEN میں مجاز کالز (5)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: 4xx کاروباری خطائیں خودکار نظرانداز ہوتی ہیں؛ صرف 5xx یا انفراسٹرکچر خرابی سرکٹ کھولتی ہے۔ |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: قابل ترتیب ایکسپونینشل بیک آف کے ساتھ عارضی ناکامیوں کو خودکار دوبارہ آزماتا ہے۔
- **رن ٹائم رویہ**: تمام مقررہ کوششیں ختم ہونے پر معیاری ایکسیپشن جاری کرتا ہے۔
- **استعمال کا طریقہ**: عارضی نیٹ ورک یا DB لاک کی خرابی سے نمٹنے کے لیے کنٹرولر یا میتھڈ پر لگائیں۔
- **کب استعمال کریں**: آئیڈیمپوٹینٹ GET ریڈز یا `@Idempotent` سے محفوظ کالز کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: بغیر `@Idempotent` والی ادائیگی یا POST تخلیق پر ہرگز نہ لگائیں!

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"erp-sync-retry"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j ریٹرائی انسٹنس کا نام۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: یقینی بنائیں کہ تمام کوششوں کا کل وقت گیٹ وے ٹائم آؤٹ سے کم رہے۔ |
| `maxAttempts` | `int` | `3` | نہیں (اختیاری) | کوششیں میں مثبت عدد (`>= 1`)؛ مثلاً `3`۔<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | پہلی کوشش سمیت کل کوششوں کی تعداد (3)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: یقینی بنائیں کہ تمام کوششوں کا کل وقت گیٹ وے ٹائم آؤٹ سے کم رہے۔ |
| `waitDurationMs` | `long` | `500L` | نہیں (اختیاری) | ملی سیکنڈ میں مثبت عدد (`>= 50`)؛ مثلاً `500L`۔<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | پہلی ریٹرائی سے پہلے ابتدائی وقفہ ملی سیکنڈ میں (500L)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: یقینی بنائیں کہ تمام کوششوں کا کل وقت گیٹ وے ٹائم آؤٹ سے کم رہے۔ |
| `backoffMultiplier` | `double` | `2.0d` | نہیں (اختیاری) | ضرب عامل میں مثبت عدد (`>= 1.0d`)؛ مثلاً `2.0d`۔<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | اگلی کوششوں کے درمیان ایکسپونینشل بیک آف ضارب (2.0d)۔<br/>*تنبیہ:* پروڈکشن لیٹنسی SLA کے مطابق احتیاط سے ترتیب دیں: یقینی بنائیں کہ تمام کوششوں کا کل وقت گیٹ وے ٹائم آؤٹ سے کم رہے۔ |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **پیکج**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: RFC 7232 کمزور ETags (W/"...") کا حساب لگاتا ہے اور Cache-Control + HTTP 304 Not Modified جوابات بھیجتا ہے۔
- **رن ٹائم رویہ**: nwvmc.cache.http.requests میں HIT/MISS کاؤنٹرز ریکارڈ کرتا ہے۔
- **استعمال کا طریقہ**: صرف پڑھنے والے GET میتھڈز پر `ETag` اور `304` کیشنگ کے لیے لگائیں۔
- **کب استعمال کریں**: کم بدلنے والے کیٹلاگز اور عوامی فہرستوں پر بینڈوتھ بچانے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: نجی PII یا ملٹی ٹیننٹ ڈیٹا پر کبھی `isPrivate = false` نہ چھوڑیں!

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | نہیں (اختیاری) | سیکنڈ میں مثبت عدد (`>= 0`)؛ مثلاً `120`۔<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Cache-Control `max-age` سیکنڈز میں (60)۔<br/>*تنبیہ:* `Cache-Control: max-age=<N>` بھیجتا ہے؛ فوری `304` توثیق کے لیے `0` کے ساتھ `generateETag = true` رکھیں۔ |
| `isPrivate` | `boolean` | `false` | نہیں (اختیاری) | `true` (صرف براؤزر پرائیویٹ کیش؛ CDN پر ممنوع) یا `false` (پبلک کیش؛ پراکسی اور CDN کے لیے مجاز)۔<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true پر `private` (صرف براؤزر) اور false پر `public`۔<br/>*تنبیہ:* نہایت اہم: مصدقہ یا `@FieldSecurity` روٹس پر ہمیشہ `isPrivate = true` رکھیں تاکہ CDN دوسرے صارف کا ڈیٹا نہ دے۔ |
| `mustRevalidate` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | مدت ختم ہونے پر دوبارہ تصدیق کے لیے `, must-revalidate` شامل کرتا ہے۔<br/>*تنبیہ:* `maxAgeSeconds` گزرنے کے بعد پراکسی کو پرانا جواب دینے سے روکتا ہے۔ |
| `generateETag` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | ETag بناتا ہے اور `If-None-Match` ملنے پر `HTTP 304` لوٹاتا ہے۔<br/>*تنبیہ:* جواب سے RFC 7232 `ETag` بناتا ہے اور `If-None-Match` ملنے پر 0 بائٹ `304` بھیجتا ہے۔ |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: Caffeine L1 / Redis L2 انجنز میں سرور سائیڈ ریڈ میتھڈ آؤٹ پٹس کیش کرتا ہے۔
- **رن ٹائم رویہ**: app.framework.cache.type کے ذریعے عالمی سطح پر قابل ترتیب۔
- **استعمال کا طریقہ**: ریڈ میتھڈز پر لگائیں؛ کیش انجن `app.framework.cache.type` سے کنٹرول ہوتا ہے۔
- **کب استعمال کریں**: زیادہ پڑھے جانے والے ID لک اپس اور میٹا ڈیٹا کوئریز کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: زیادہ تبدیلی والے ڈیٹا یا بغیر کلون کیے اینٹیٹیز پر کیش نہ لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `{"productCatalog"}` (Caffeine/Redis cache region names)۔<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Caffeine یا Redis کیش ناموں کی فہرست۔<br/>*تنبیہ:* کیش نام Caffeine/Redis کنفیگ سے ملنے چاہئیں؛ ہر رائٹ آپریشن کے ساتھ `@AutoCacheEvict` لگائیں۔ |
| `key` | `String` | `""` | نہیں (اختیاری) | میتھڈ پیرامیٹرز کا حوالہ دینے والا SpEL ایکسپریشن (مثلاً `"'product:' + #id"`) یا خودکار کلید کے لیے `""`۔<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL کیش کلید (v0.1.0 میں EntityName:id خودکار اور محفوظ حل ہوتا ہے)۔<br/>*تنبیہ:* ملٹی ٹیننٹ ایپس میں کیش کلید میں ہمیشہ ٹیننٹ آئی ڈی شامل کریں۔ |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: تبدیلیوں پر پرانی سرور سائیڈ کیش اندراجات خارج کرتا ہے۔
- **رن ٹائم رویہ**: تبدیلی کے بعد بغیر باسی ڈیٹا چھوڑے صاف طریقے سے چلتا ہے۔
- **استعمال کا طریقہ**: اپڈیٹ/ڈیلیٹ میتھڈز پر `@AutoCacheable` کے مطابق کلید کے ساتھ لگائیں۔
- **کب استعمال کریں**: جب بھی `@AutoCacheable` سے کیش ریکارڈ میں ترمیم یا حذف ہو۔
- **کب استعمال نہ کریں اور احتیاطیں**: بار بار چلنے والے `create` پر `allEntries = true` سے بچیں (کیش اسٹیمپیڈ ہوتا ہے)۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `{"productCatalog"}` (target cache region names to evict)۔<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | میتھڈ مکمل ہونے پر خالی کیے جانے والے کیش نام۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `value` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `key` | `String` | `""` | نہیں (اختیاری) | میتھڈ پیرامیٹرز کا حوالہ دینے والا SpEL ایکسپریشن (مثلاً `"'product:' + #id"`) یا خودکار کلید کے لیے `""`۔<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | صرف تبدیل شدہ انٹری حذف کرنے کے لیے SpEL کلید۔<br/>*تنبیہ:* `@AutoCacheable.key` کے عین مطابق کلید بنانی چاہیے؛ `allEntries = true` پر نظرانداز ہوتا ہے۔ |
| `allEntries` | `boolean` | `false` | نہیں (اختیاری) | `true` (ہدف کیش ریجن کی تمام اندراجات صاف کریں) یا `false` (صرف key سے متعین ایک اندراج حذف کریں)۔<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true ہونے پر صرف موجودہ اینٹیٹی پری فکس کی کیش صاف کرتا ہے۔<br/>*تنبیہ:* زیادہ ٹریفک میں پورا کیش صاف کرنے سے ڈیٹابیس پر دباؤ آ سکتا ہے؛ مخصوص `key` حذف کرنا بہتر ہے۔ |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **پیکج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: عمل درآمد کا وقت ماپتا ہے اور سست کال حد سے بڑھنے پر WARN لاگ جاری کرتا ہے۔
- **رن ٹائم رویہ**: DynamicEntityMetricsHelper کے ذریعے لیٹنسی ٹائمرز بھی اپڈیٹ کرتا ہے۔
- **استعمال کا طریقہ**: SLA کی خلاف ورزیاں مانیٹر کرنے کے لیے کنٹرولرز یا سروسز پر لگائیں۔
- **کب استعمال کریں**: پیچیدہ رپورٹس، بیچز اور `@CustomQuery` میں سست کوئریز پکڑنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: `warningThresholdMs = 0` مت سیٹ کریں اور SSE `/events` اسٹریم پر نہ لگائیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | نہیں (اختیاری) | ملی سیکنڈ میں مثبت عدد (`>= 1`)؛ مثلاً `300L`۔<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | سست عملدرآمد کا `WARN` لاگ دینے کی حد ملی سیکنڈ میں (500L)۔<br/>*تنبیہ:* حد عبور ہونے پر `traceId` کے ساتھ `WARN` لاگ لکھتا ہے؛ لاگ بھرنے سے بچنے کے لیے مناسب قدر (`200L–1000L`) رکھیں۔ |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **پیکج**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **مقصد**: کمیٹ کے بعد ورچوئل تھریڈز پر غیر ہم وقتی HMAC-SHA256 دستخط شدہ ویب ہکس بھیجتا ہے۔
- **رن ٹائم رویہ**: WebhookHmacSignerHelper میں دستخط بناتا ہے اور یکساں وقت میں موازنہ کرتا ہے۔
- **استعمال کا طریقہ**: JPA `@Entity` پر لگائیں؛ DB کمٹ کے بعد خودکار بھیجا جاتا ہے۔
- **کب استعمال کریں**: آرڈرز/ادائیگیوں کے بعد بیرونی SaaS پارٹنرز کو فوری مطلع کرنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: حساس PII/PCI ڈیٹا ہونے پر `includeFullPayload = false` سیٹ کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | نہیں (اختیاری) | صفر یا زیادہ درست اقدار کی صف: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`۔<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC دستخط شدہ ویب ہک بھیجنے والے ایونٹس۔<br/>*تنبیہ:* ٹرانزیکشن کمٹ (`AFTER_COMMIT`) کے بعد بھیجا جاتا ہے تاکہ رول بیک پر جعلی ویب ہک نہ جائے۔ |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | نہیں (اختیاری) | درست HTTP ہیڈر نام (نیٹ ورک پر کیس-ان سینسٹو، مثلاً `"X-Webhook-Signature"`)۔<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 دستخط والا HTTP ہیڈر۔<br/>*تنبیہ:* HMAC-SHA256 دستخط لے کر جاتا ہے؛ وصول کنندہ کو پروسیس کرنے سے پہلے اس کی تصدیق کرنی چاہیے۔ |
| `includeFullPayload` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@EntityWebhook(includeFullPayload = false)` | true پورا JSON پے لوڈ بھیجتا ہے؛ false صرف آئی ڈی بھیجتا ہے۔<br/>*تنبیہ:* حساس PII یا مالی اینٹیٹیز پر `false` رکھیں تاکہ سبسکرائبر مصدقہ GET سے ڈیٹا حاصل کرے۔ |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **پیکج**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: ٹرانزیکشن کمیٹ کے بعد CNCF CloudEvents v1.0 لفافے شائع کرتا ہے۔
- **رن ٹائم رویہ**: فینٹم ایونٹس سے بچنے کے لیے TransactionRuntimeBridge.executeAfterCommit کا احترام کرتا ہے۔
- **استعمال کا طریقہ**: اینٹیٹی یا میتھڈ پر لگائیں؛ کمٹ کے بعد `CloudEventEnvelopeDto` سنیں۔
- **کب استعمال کریں**: مختلف ڈومینز کے درمیان بغیر JPA کپلنگ کے ایونٹ رابطے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: اسے بیرونی `@EntityWebhook` سے خلط ملط نہ کریں اور کمٹ سے پہلے نہ سنیں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | نہیں (اختیاری) | غیر خالی شناختی اسٹرنگ (مثلاً `"com.acme.order.lifecycle"`)؛ ڈیفالٹ اصول کے لیے `""` چھوڑیں۔<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` ہیڈر۔<br/>*تنبیہ:* CloudEvents 1.0 ریورس-DNS نامگذاری (`com.company.domain.event`) اپنائیں؛ `""` خودکار بناتا ہے۔ |
| `source` | `String` | `""` | نہیں (اختیاری) | `/` سے شروع ہونے والا درست HTTP راستہ (مثلاً `/services/order-api`) یا خودکار اخذ کے لیے خالی اسٹرنگ `""`۔<br/>`@PublishCloudEvent(source = "/services/order-api")` | ایونٹ بھیجنے والے سورس کا URI۔<br/>*تنبیہ:* مائیکروسروس ٹریسنگ کے لیے CNCF CloudEvents `source` URI بھرتا ہے۔ |
| `publishOnCreate` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | تخلیق کمٹ کے بعد CloudEvent بھیجنا ہے یا نہیں (true)۔<br/>*تنبیہ:* صرف کمٹ (`AFTER_COMMIT`) کے بعد Spring Events / Kafka کے ذریعے شائع ہوتا ہے۔ |
| `publishOnUpdate` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@PublishCloudEvent(publishOnUpdate = true)` | اپڈیٹ کمٹ کے بعد CloudEvent بھیجنا ہے یا نہیں (true)۔<br/>*تنبیہ:* کثرت سے اپ ڈیٹ ہونے والی اینٹیٹیز پر `false` رکھیں تاکہ میسج بروکر بھر نہ جائے۔ |
| `publishOnDelete` | `boolean` | `true` | نہیں (اختیاری) | `true` (فعال) یا `false` (غیر فعال)۔<br/>`@PublishCloudEvent(publishOnDelete = true)` | حذف کمٹ کے بعد CloudEvent بھیجنا ہے یا نہیں (true)۔<br/>*تنبیہ:* ہارڈ ڈیلیٹ اور `@SoftDelete` دونوں پر چلتا ہے تاکہ ریڈ ماڈل ہم آہنگ رہیں۔ |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **پیکج**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: ریکارڈ یا کوئری آپریشنز کو نامزد منطقی ڈیٹا سورس کلید سے جوڑتا ہے۔
- **رن ٹائم رویہ**: framework.datasource.routing.total میں روٹنگ شمار ریکارڈ کرتا ہے۔
- **استعمال کا طریقہ**: کنٹرولر یا نان فائنل سروس میتھڈ پر لگائیں؛ باہر نکلتے وقت خودکار بحال ہوتا ہے۔
- **کب استعمال کریں**: CQRS ریڈ ریپلیکا اور بھاری رپورٹس کو `REPLICA` پر منتقل کرنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: پہلے سے کھلی `@Transactional` کے درمیان ڈیٹا سورس نہ بدلیں!

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`۔<br/>`@TargetDataSource("REPLICA")` | `DataSourceContextHolder` کے لیے ڈیٹا سورس کی کلید ("PRIMARY", "REPLICA")۔<br/>*تنبیہ:* `DynamicRoutingDataSource` میں رجسٹرڈ کلید سے ملنا چاہیے؛ نامعلوم کلید `PRIMARY` پر لوٹتی ہے۔ |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **پیکج**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **مقصد**: ہر ریکارڈ کے لیے ڈیٹابیس انجن فیملی اور منطقی کلسٹر شارڈ تفویض کرتا ہے۔
- **رن ٹائم رویہ**: MultiPlatformDataSourceRegistryHelper اور TenantDatabaseRoutingResolverHelper کے ذریعے ڈائنامک طور پر حل ہوتا ہے۔
- **استعمال کا طریقہ**: مخصوص JPA اینٹیٹیز پر پلیٹ فارم اور کلسٹر کی نشاندہی کے لیے لگائیں۔
- **کب استعمال کریں**: پولی گلوٹ پرسسٹینس یا مالیاتی و تجزیاتی کلسٹرز الگ رکھنے کے لیے۔
- **کب استعمال نہ کریں اور احتیاطیں**: یہ YAML میں JDBC کنفیگریشن کا متبادل نہیں؛ مختلف کلسٹرز کے درمیان JOIN مت کریں۔

| ایٹری بیوٹ | Java قسم | ڈیفالٹ قدر | لازمی | قابل قبول اقدار اور مثال | تفصیل اور رن ٹائم تنبیہات |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`۔<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | ڈیٹا بیس انجن کا نام ("H2", "POSTGRESQL", "MYSQL", "ORACLE")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `platform` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `cluster` | `String` | `"PRIMARY"` | نہیں (اختیاری) | درج ذیل معاون اقدار میں سے ایک: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID۔<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | ہدف کلسٹر ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER")۔<br/>*تنبیہ:* ایپ اسٹارٹ اپ پر فوری توثیق ہوتی ہے؛ غلط ہجے یا غیر درست `cluster` ٹریفک سے پہلے فیل فاسٹ ہوتا ہے۔ |
| `readOnly` | `boolean` | `false` | نہیں (اختیاری) | `true` (صرف پڑھنے والے ریپلیکا پول پر روٹ کریں) یا `false` (ریڈ-رائٹ ماسٹر پول پر روٹ کریں)۔<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true ہونے پر ریڈ اونلی ریپلیکا روٹنگ کی ترجیح دیتا ہے۔<br/>*تنبیہ:* رائٹ آپریشنز پر کبھی `readOnly = true` نہ رکھیں کیونکہ ریڈ ریپلیکا تبدیلی مسترد کرتا ہے۔ |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
