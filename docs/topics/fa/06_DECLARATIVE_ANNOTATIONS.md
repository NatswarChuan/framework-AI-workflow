# 06. مشخصات فنی کامل هر ۶۰ حاشیه‌نویسی اعلانی (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#annotations)

مرجع فنی جامع برای هر **۶۰ حاشیه‌نویسی اعلانی (Declarative Annotations)** در `io.github.natswarchuan:spring-nwvmc:0.1.0` که مستقیماً از کد منبع Java `@interface` استخراج شده است: پکیج دقیق، `@Target`، **تمامی ویژگی‌ها**، نوع Java، مقدار پیش‌فرض، وضعیت اجباری/اختیاری، **نحوه استفاده**، **زمان مناسب استفاده**، **زمان عدم استفاده و نکات هشدار** همراه با نمونه‌کدهای تاییدشده Java.

## فهرست سریع (۶۰ حاشیه‌نویسی)

| حاشیه‌نویسی | دسته‌بندی | `@Target` | خلاصه ویژگی‌ها | هدف اصلی |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | یک واسط مشتق‌شده از AutoApiController<E> را به پراکسی پویای JDK با ۴۰ قرارداد (۳۸ مورد نمایان پیش‌فرض در Swagger UI) تبدیل می‌کند. |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | یک قرارداد کنترلر را به جای CRUD پویا از طریق MethodHandleCacheUtil به متد یک Bean سفارشی Spring هدایت می‌کند. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | مسیرهای کاری خاص دامنه (تسویه، بازپرداخت، تایید) را به بین‌های مستقل Spring @Component Helper متصل می‌کند. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | جایگزین جاوای خالص برای @GetMapping بدون وابستگی کامپایل به Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | اعلان مسیر HTTP POST جاوای خالص با پشتیبانی از انواع رسانه consumes و produces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | نگاشت مسیر HTTP PUT جاوای خالص برای جایگزینی کامل منبع. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | اعلان HTTP PATCH جاوای خالص با پشتیبانی از ادغام جزئی، افزایش اتمیک و RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | اعلان HTTP DELETE جاوای خالص برای اجرای حذف نرم محافظت‌شده با وضعیت. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | پارامترهای کوئری URL یا نگاشت‌های فیلتر پویای Map<String, String> را متصل می‌کند. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | متغیرهای مسیر URI مانند شناسه‌های UUIDv7 را متصل می‌کند. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | بدنه JSON درخواست HTTP را همراه با @Valid به پارامترهای DTO یا Entity تبدیل می‌کند. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | پیمایش بازگشتی روابط فرزند را از طریق GET /{id}/{relation}/** با مسدودسازی حلقه‌ها مجاز می‌کند. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | گذارهای وضعیت دامنه یا تنظیمات عددی را به‌صورت اعلانی روی متدهای اکشن سفارشی تعریف می‌کند. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | نشانگر کامپوننت فریم‌ورک که هنگام راه‌اندازی بدون import کردن @Component ثبت می‌شود. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | نشانگر لایه سرویس برای کلاس‌های ServiceImpl همراه با @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | متدهای کارخانه ساخت Bean مدیریت‌شده را درون کلاس‌های @AutoConfigurationBean اعلان می‌کند. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | کلاس‌های پیکربندی و مدل‌های اتصال ویژگی‌های YAML را نشان‌گذاری می‌کند. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | ترتیب اولویت اجرا میان بین‌های SPI Customizer و زنجیره فیلترها را کنترل می‌کند. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | پیش از پرس‌وجو یا تغییر موجودیت، کنترل دسترسی RBAC، جداسازی ownerField و کدهای مجوز را اعمال می‌کند. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | در صورت نبود مجوز نقش، ستون‌های حساس را به‌صورت پویا پوشانش یا تهی می‌کند. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | گذارهای مجاز وضعیت را در POST /{id}/transition اعمال کرده و DELETE /{id} را به deletableStates محدود می‌کند. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | بندهای خوانای سیاست را به قواعد فعال RBAC، گذار وضعیت و پوشانش فیلد تبدیل می‌کند. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | تفاوت‌های سطح فیلد را در تغییرات ثبت کرده و بازسازی زمانی و بررسی /diff را پشتیبانی می‌کند. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | پرس‌وجوها و تغییرات ردیف را به‌طور خودکار بر اساس مستأجر فعال ایزوله می‌کند مگر با نقش عبور. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | پیش از ذخیره‌سازی در عملیات ایجاد، ویرایش و upsert یکتایی مقدار را بررسی می‌کند. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | هنگام ایجاد یا کپی در صورت خالی بودن، کدهای تجاری یکتای پیشونددار تولید می‌کند. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | اسلاگ‌های ASCII سازگار با آدرس وب را به‌صورت خودکار از sourceField می‌سازد. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | مقادیر عددی مشتق‌شده را پیش از ذخیره تغییرات موجودیت به‌صورت خودکار محاسبه می‌کند. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | اتصال کوئری‌های سفارشی SQL/JPQL یا متدهای فراهم‌کننده به اندپوینت‌های کنترلر را ممکن می‌سازد. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | یک موجودیت JPA را به‌عنوان جدول کاتالوگ نقش‌های RBAC پویا در پایگاه داده تعیین می‌کند. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ستون کد یکتای نقش را درون موجودیت @SecurityRoleEntity نگاشت می‌کند. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فیلد نام نمایشی خوانا برای انسان را روی @SecurityRoleEntity مشخص می‌کند. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فیلد مجموعه یا رشته CSV شامل کدهای مجوز اعطاشده به نقش را مشخص می‌کند. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | یک موجودیت JPA برای نگهداری مجوزهای منبع-عملیات و قواعد پوشانش پویا تعیین می‌کند. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فیلد شناسه یکتای مجوز را درون @SecurityPermissionEntity تعیین می‌کند. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | نام موجودیت یا منبع API هدف (یا نویسه عام *) را در @SecurityPermissionEntity نگاشت می‌کند. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فعل عملیات CRUD یا اکشن سفارشی محافظت‌شده توسط @SecurityPermissionEntity را نگاشت می‌کند. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فیلدهای جداشده با ویرگول را مشخص می‌کند که هنگام اعمال این مجوز باید به‌صورت پویا پوشانده شوند. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | موجودیت JPA متصل‌کننده شناسه‌های کاربری به نقش‌های پایگاه داده و محدوده مستأجر را مشخص می‌کند. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فیلد شناسه اصلی کاربر (JWT sub / username) را روی @SecurityUserRoleEntity مشخص می‌کند. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ستون کد نقش تخصیص‌یافته را درون @SecurityUserRoleEntity متصل می‌کند. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | تخصیص نقش در @SecurityUserRoleEntity را به یک مستأجر خاص (یا * برای همه‌جا) محدود می‌کند. |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | موجودیت JPA نگهدارنده سیاست‌های صریح ALLOW / DENY بر اساس priority را مشخص می‌کند. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | الگوی شناسه منبع هدف را در موجودیت @SecurityPolicyEntity نگاشت می‌کند. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | فعل عملیات محافظت‌شده (READ، WRITE، DELETE، methodName، *) را در @SecurityPolicyEntity نگاشت می‌کند. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | مجموعه یا رشته جداشده با ویرگول نقش‌های مشمول قاعده @SecurityPolicyEntity را نگاشت می‌کند. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | نتیجه تصمیم سیاست (ALLOW یا DENY) را روی @SecurityPolicyEntity مشخص می‌کند. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | دسترسی هم‌زمان را بر اساس کلیدهای SpEL کش‌شده صف‌بندی می‌کند (پیش‌فرض waitTimeMs=3000L، leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | از نوشتن‌های تکراری هم‌زمان یا بازپخش‌شده در بازه TTL قابل تنظیم جلوگیری می‌کند. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | محدودیت نرخ درخواست با پنجره لغزان را به تفکیک IP، کاربر یا مستأجر اعمال می‌کند. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | عملیات را درون مدارشکن Resilience4j با گزارش تله‌متری به Actuator و Micrometer قرار می‌دهد. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | خطاهای موقت را به‌طور خودکار با تاخیر نمایی قابل پیکربندی دوباره تلاش می‌کند. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | مقدار ETag ضعیف RFC 7232 (W/"...") را محاسبه کرده و هدر Cache-Control همراه با پاسخ HTTP 304 Not Modified ارسال می‌کند. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | خروجی متدهای خواندن سمت سرور را در موتورهای Caffeine L1 / Redis L2 کش می‌کند. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | هنگام تغییرات، مدخل‌های قدیمی کش سمت سرور را پاک‌سازی می‌کند. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | مدت اجرا را اندازه‌گیری کرده و در فراخوانی‌های کند، گزارش WARN ثبت می‌کند. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | پس از تایید تراکنش، وب‌هوک‌های خروجی امضاشده با HMAC-SHA256 را روی Virtual Threads ارسال می‌کند. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | پاکت‌های استاندارد CNCF CloudEvents v1.0 را پس از تایید تراکنش منتشر می‌کند. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | عملیات موجودیت یا پرس‌وجو را به یک کلید منبع داده منطقی متصل می‌کند. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | خانواده موتور پایگاه داده و شارد خوشه منطقی را برای هر موجودیت تعیین می‌کند. |

---

## 1. مسیریابی، قراردادهای پویا API، جداسازی DTO و نگاشت پارامترها (13 حاشیه‌نویسی)

### `@AutoRestController`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **هدف**: یک واسط مشتق‌شده از AutoApiController<E> را به پراکسی پویای JDK با ۴۰ قرارداد (۳۸ مورد نمایان پیش‌فرض در Swagger UI) تبدیل می‌کند.
- **رفتار در زمان اجرا**: DynamicControllerProxyRegistrarHelper هنگام راه‌اندازی کنترلرها را پویش کرده و مسیرها را در RequestMappingHandlerMapping ثبت می‌کند.
- **نحوه استفاده**: آن را روی واسط جاوای مشتق‌شده از `AutoApiController<E>` یا `AutoReadApi<E>` قرار داده و `basePath` و DTOها را تنظیم کنید.
- **چه زمانی استفاده شود**: هنگام نیاز به ارائه سریع CRUD استاندارد، صفحه‌بندی، فیلتر یا API فقط‌خواندنی از روی موجودیت JPA بدون کد تکراری استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی کلاس‌های `@RestController` عادی یا سرویس‌های بدون موجودیت JPA استفاده نکنید؛ برای موارد فقط‌خواندنی از `AutoReadApi<E>` بهره ببرید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | خیر (اختیاری) | مسیر HTTP معتبر با شروع `/` (مانند `/api/v1/product-catalogs`) یا رشته خالی `""` برای استخراج خودکار.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | مسیر ریشه URI صریح (مثلاً "/api/v1/product-catalogs"). در صورت خالی بودن از نام کنترلر ساخته می‌شود.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `basePath` را پیش از `path` بررسی می‌کند. مقادیر متضاد ندهید. |
| `path` | `String` | `""` | خیر (اختیاری) | مسیر HTTP معتبر با شروع `/` (مانند `/api/v1/orders`) یا رشته خالی `""` برای استخراج خودکار.<br/>`@AutoRestController(path = "/api/v1/orders")` | نام مستعار مسیر پایه؛ توصیه می‌شود از basePath استفاده کنید چون اولویت بالاتری دارد.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `basePath` را پیش از `path` بررسی می‌کند. مقادیر متضاد ندهید. |
| `entityName` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"ProductCatalog"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoRestController(entityName = "ProductCatalog")` | نام نمایشی موجودیت را در OpenAPI و Studio بازنویسی می‌کند.<br/>*نکته:* مستقیماً در مستندات Swagger / OpenAPI 3.0 و NWVMC Studio نمایش داده می‌شود؛ رشته‌ها را در `OpenApiConstant` تعریف کنید. |
| `enabledEndpoints` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | فهرست سفید نام دقیق متدهای مجاز (مثلاً "getPage", "create"). خالی یعنی همه فعال.<br/>*نکته:* به‌عنوان فهرست سفید سخت‌گیرانه عمل می‌کند: هر متدی که در آرایه نباشد از Spring MVC و Swagger UI حذف می‌شود. |
| `disabledEndpoints` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | فهرست سیاه برای غیرفعال کردن متدهای خاص پیش از ثبت در MVC.<br/>*نکته:* پس از `enabledEndpoints` بررسی می‌شود؛ برای مسدود کردن مسیرهای حذف یا دسته‌ای ضمن حفظ سایر قراردادها ایده‌آل است. |
| `enableNestedSubResources` | `boolean` | `false` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | مسیر بازگشتی GET /{id}/** را فعال می‌کند. پیش‌فرض false برای جلوگیری از شلوغی مسیرها.<br/>*نکته:* تا زمانی که به پیمایش `GET /{id}/items/...` نیاز ندارید `false` بگذارید و در صورت فعال‌سازی با `@EnableNestedSubResource` محدود کنید. |
| `readDto` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `ProductReadDto.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | کلاس DTO اختیاری برای مخفی‌سازی فیلدهای داخلی در خروجی خواندن؛ پیش‌فرض Void.class.<br/>*نکته:* فقط در مسیر خواندن (GET) اعمال می‌شود؛ کلاس DTO نیازمند سازنده پیش‌فرض/گتر است و از `@Valid` پشتیبانی می‌کند. |
| `createDto` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `ProductCreateDto.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | کلاس DTO ورودی اختیاری برای اعتبارسنجی پیش از ثبت در POST.<br/>*نکته:* فقط در مسیر ایجاد (POST) اعمال می‌شود؛ کلاس DTO نیازمند سازنده پیش‌فرض/گتر است و از `@Valid` پشتیبانی می‌کند. |
| `updateDto` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `ProductUpdateDto.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | کلاس DTO اختیاری برای محدود کردن فیلدهای قابل ویرایش در PUT/PATCH.<br/>*نکته:* فقط در مسیر به‌روزرسانی (PUT/PATCH) اعمال می‌شود؛ کلاس DTO نیازمند سازنده پیش‌فرض/گتر است و از `@Valid` پشتیبانی می‌کند. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: یک قرارداد کنترلر را به جای CRUD پویا از طریق MethodHandleCacheUtil به متد یک Bean سفارشی Spring هدایت می‌کند.
- **رفتار در زمان اجرا**: EscapeHatchDispatchHelper بین هدف را یافته و MethodHandle آن را در MethodHandleCacheUtil کش می‌کند.
- **نحوه استفاده**: متد رابط کنترلر را با `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` نشانه‌گذاری و کلاس هدف را `@Component` کنید.
- **چه زمانی استفاده شود**: زمانی که بیشتر مسیرها خودکار هستند اما یک متد خاص به منطق سفارشی جاوا نیاز دارد.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز رشته به `targetBean` ندهید (`Class<?>` می‌پذیرد؛ برای نام از `beanName` استفاده کنید).

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `OrderCustomService.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | کلاس بین Spring هدف (اولویت بالاتر نسبت به beanName).<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `targetBean` را پیش از `beanName` بررسی می‌کند. مقادیر متضاد ندهید. |
| `beanName` | `String` | `""` | خیر (اختیاری) | نام دقیق Bean ثبت‌شده در ApplicationContext (مانند `"orderCustomService"`) یا `""` برای تشخیص خودکار.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | نام صریح بین در کانتینر Spring زمانی که targetBean مقدار Void.class دارد.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `targetBean` را پیش از `beanName` بررسی می‌کند. مقادیر متضاد ندهید. |
| `methodName` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"createOrder"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | نام متد در بین هدف؛ در صورت خالی بودن هم‌نام متد کنترلر در نظر گرفته می‌شود.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"createOrder"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `bypassAutoDispatch` | `boolean` | `true` | خیر (اختیاری) | `true` (عبور از پروکسی پیش‌فرض و فراخوانی مستقیم Bean هدف) یا `false` (اجرا در کنار مسیریابی پیش‌فرض).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | در حالت true اجرای خودکار CRUD را دور زده و مستقیماً بین سفارشی را صدا می‌زند.<br/>*نکته:* در حالت `true` عملیات CRUD داخلی کاملاً نادیده گرفته می‌شود؛ تنها برای هوک‌های تکمیلی مقدار `false` بگذارید. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: مسیرهای کاری خاص دامنه (تسویه، بازپرداخت، تایید) را به بین‌های مستقل Spring @Component Helper متصل می‌کند.
- **رفتار در زمان اجرا**: متد delegateBean.delegateMethod را از طریق MethodHandle کش‌شده با اعتبارسنجی و تراکنش کامل اجرا می‌کند.
- **نحوه استفاده**: روی متد کنترلر ویژگی‌های `path`، `httpMethod`، `delegateBean` و `delegateMethod` را برای تفویض به یک بین مستقل قرار دهید.
- **چه زمانی استفاده شود**: برای اکشن‌های دامنه مانند تسویه‌حساب، بازپرداخت، تایید یا تراکنش‌های چندموجودیتی استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی این روت منتظر رهگیری proxy نمانید (مستقیماً قبل از `invokeProtectedOperation` اجرا می‌شود)؛ AOP/امنیت را روی `@Service` هدف بگذارید و برای تغییر وضعیت ساده از `@BusinessAction` بهره ببرید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/reports/monthly-sales`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | مسیر نسبی زیر basePath کنترلر (مثلاً "/checkout").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `path` پیش از پذیرش ترافیک خطا می‌دهد. |
| `httpMethod` | `String` | `"GET"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | متد HTTP هدف ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `httpMethod` پیش از پذیرش ترافیک خطا می‌دهد. |
| `delegateBean` | `String` | `""` | خیر (اختیاری) | نام دقیق Bean ثبت‌شده در ApplicationContext (مانند `"orderReportService"`) یا `""` برای تشخیص خودکار.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | نام بین Spring شامل متد اجراکننده منطق (الزامی مگر وجود متد default یا @ServiceOverride).<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `delegateBean` پیش از پذیرش ترافیک خطا می‌دهد. |
| `delegateMethod` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"buildMonthlyReport"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | نام متد روی delegateBean؛ در صورت خالی بودن هم‌نام متد کنترلر است.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"buildMonthlyReport"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `summary` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"Get monthly revenue breakdown"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | خلاصه کوتاه عملیات OpenAPI 3.0 در Swagger UI.<br/>*نکته:* مستقیماً در مستندات Swagger / OpenAPI 3.0 و NWVMC Studio نمایش داده می‌شود؛ رشته‌ها را در `OpenApiConstant` تعریف کنید. |
| `description` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"Aggregates confirmed invoice totals grouped by currency"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | توضیحات کامل OpenAPI 3.0 هنگام باز کردن مسیر در Swagger UI.<br/>*نکته:* مستقیماً در مستندات Swagger / OpenAPI 3.0 و NWVMC Studio نمایش داده می‌شود؛ رشته‌ها را در `OpenApiConstant` تعریف کنید. |

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

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: جایگزین جاوای خالص برای @GetMapping بدون وابستگی کامپایل به Spring Web.
- **رفتار در زمان اجرا**: هنگام راه‌اندازی پراکسی به RequestMappingInfo نوع HTTP GET نگاشت می‌شود.
- **نحوه استفاده**: روی متد کنترلر با `@ServiceOverride` یا `@CustomQuery` از `@AutoGet("/path")` استفاده کنید.
- **چه زمانی استفاده شود**: برای مسیرهای فقط‌خواندنی GET در رابط‌های جاوای خالص بدون وابستگی به `@GetMapping` استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای عملیات تغییر داده یا روی کلاس‌های عادی `@RestController` استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/{id}/summary`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@AutoGet("/{id}/summary")` | الگوی مسیر نسبی GET (مثلاً "/metrics"). خالی به ریشه basePath نگاشت می‌شود.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `produces` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json", "text/csv"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | انواع رسانه خروجی اختیاری (مثلاً "text/event-stream" یا "text/csv").<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Accept` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: اعلان مسیر HTTP POST جاوای خالص با پشتیبانی از انواع رسانه consumes و produces.
- **رفتار در زمان اجرا**: به‌عنوان هندلر HTTP POST در SpringMvcEndpointBridge ثبت می‌شود.
- **نحوه استفاده**: روی متدهای ایجاد یا اکشن از `@AutoPost("/path")` همراه `@AutoBody` و `@BusinessAction` یا `@ServiceOverride` استفاده کنید.
- **چه زمانی استفاده شود**: برای مسیرهای ایجاد، دستورات کسب‌وکار یا ارسال دسته‌ای در رابط جاوای خالص استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای خواندن (`@AutoGet`)، جایگزینی کامل (`@AutoPut`)، ویرایش جزئی (`@AutoPatch`) یا حذف (`@AutoDelete`) استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/{id}/approve`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@AutoPost("/{id}/approve")` | الگوی مسیر نسبی POST زیر basePath.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `consumes` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json", "multipart/form-data"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | انواع Content-Type مجاز در بدنه درخواست.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Content-Type` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |
| `produces` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | انواع رسانه خروجی پاسخ.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Accept` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: نگاشت مسیر HTTP PUT جاوای خالص برای جایگزینی کامل منبع.
- **رفتار در زمان اجرا**: به‌عنوان هندلر HTTP PUT درون اجرای تراکنشی متصل می‌شود.
- **نحوه استفاده**: برای متدهای جایگزینی کامل از `@AutoPut("/{id}")` همراه `@AutoVariable` و `@AutoBody` استفاده کنید.
- **چه زمانی استفاده شود**: برای جایگزینی کامل و Idempotent با دریافت تمام فیلدهای منبع استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای ویرایش جزئی چند فیلد استفاده نکنید (از `@AutoPatch` یا `@BusinessAction` بهره ببرید).

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/{id}/replace`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@AutoPut("/{id}/replace")` | الگوی مسیر نسبی PUT (مثلاً "/{id}").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `consumes` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | انواع Content-Type پشتیبانی‌شده در ورودی.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Content-Type` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |
| `produces` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | انواع رسانه تولیدشده در پاسخ.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Accept` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: اعلان HTTP PATCH جاوای خالص با پشتیبانی از ادغام جزئی، افزایش اتمیک و RFC 6902 JSON Patch.
- **رفتار در زمان اجرا**: از معناشناسی ادغام JSON و نوع رسانه application/json-patch+json پشتیبانی می‌کند.
- **نحوه استفاده**: روی متدهای ویرایش جزئی یا `@BusinessAction` از `@AutoPatch("/{id}/action")` استفاده کنید.
- **چه زمانی استفاده شود**: برای تغییرات جزئی فیلدها، شمارنده‌های اتمیک و تغییر وضعیت‌ها استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: هنگام نیاز به جایگزینی کامل (`@AutoPut`) یا ایجاد رکورد جدید (`@AutoPost`) استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/{id}/status`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@AutoPatch("/{id}/status")` | الگوی مسیر نسبی PATCH (مثلاً "/{id}/approve").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `consumes` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json", "application/merge-patch+json"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | انواع Content-Type مجاز.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Content-Type` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |
| `produces` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از انواع رسانه MIME (مانند `{"application/json"}`)؛ `{}` خالی به‌طور پیش‌فرض `application/json` می‌پذیرد.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | انواع رسانه تولیدشده در پاسخ.<br/>*نکته:* توسط مذاکره محتوای Spring MVC روی هدر `Accept` اعمال می‌شود؛ عدم تطابق کد `406` یا `415` برمی‌گرداند. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: اعلان HTTP DELETE جاوای خالص برای اجرای حذف نرم محافظت‌شده با وضعیت.
- **رفتار در زمان اجرا**: پیش از تنظیم deleted=true فهرست deletableStates در @StateMachine را اعتبارسنجی می‌کند.
- **نحوه استفاده**: روی متدهای حذف سفارشی همراه با `@ServiceOverride` از `@AutoDelete("/{id}/custom")` استفاده کنید.
- **چه زمانی استفاده شود**: برای بایگانی سفارشی یا پاک‌سازی آبشاری از طریق DELETE استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: اگر حذف نرم استاندارد و `@StateMachine` کافی است، بازنویسی نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | زیرمسیر نسبی URI همراه با الگوی اختیاری `{pathVar}` (مانند `/{id}/archive`)؛ مقدار `""` به ریشه متصل می‌شود.<br/>`@AutoDelete("/{id}/archive")` | الگوی مسیر نسبی DELETE (مثلاً "/{id}/purge").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **هدف**: پارامترهای کوئری URL یا نگاشت‌های فیلتر پویای Map<String, String> را متصل می‌کند.
- **رفتار در زمان اجرا**: از طریق DynamicQueryParameterParserHelper و با اعتبارسنجی QueryGuardrailEnforcerUtil استخراج می‌شود.
- **نحوه استفاده**: روی پارامترهای متد کنترلر با `@AutoParam("status")` قرار دهید.
- **چه زمانی استفاده شود**: برای خالص نگه‌داشتن رابط کنترلر بدون ایمپورت Spring Web هنگام دریافت پارامتر کوئری استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای متغیرهای مسیر (`@AutoVariable`) یا بدنه JSON (`@AutoBody`) استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"status"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoParam("status") String status` | نام پارامتر کوئری برای اتصال؛ در صورت خالی بودن از نام پارامتر جاوا استفاده می‌شود.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `value` را پیش از `name` بررسی می‌کند. مقادیر متضاد ندهید. |
| `name` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"pageSize"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | نام صریح پارامتر کوئری.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `value` را پیش از `name` بررسی می‌کند. مقادیر متضاد ندهید. |
| `required` | `boolean` | `true` | خیر (اختیاری) | `true` (الزامی؛ نبود آن HTTP 400 برمی‌گرداند) یا `false` (اختیاری؛ در نبود آن null ارسال می‌شود).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | تعیین می‌کند نبود پارامتر باعث خطای HTTP 400 شود یا خیر.<br/>*نکته:* در صورت تعیین `defaultValue` خودکار اختیاری می‌شود؛ هنگام `false` از انواع پوششی (`Integer`) به جای انواع اولیه استفاده کنید. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"20"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | مقدار جایگزین در نبود پارامتر؛ پیش‌فرض sentinel DEFAULT_NONE است.<br/>*نکته:* از رشته توسط Spring `ConversionService` به نوع مقصد تبدیل می‌شود؛ مقادیر نامعتبر HTTP `400` برمی‌گردانند. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **هدف**: متغیرهای مسیر URI مانند شناسه‌های UUIDv7 را متصل می‌کند.
- **رفتار در زمان اجرا**: از الگوهای مسیر MVC به مقادیر تایپ‌شده جاوا UUID/String تجزیه می‌شود.
- **نحوه استفاده**: روی پارامترهای مسیر مانند `findById(@AutoVariable("id") UUID id)` قرار دهید.
- **چه زمانی استفاده شود**: برای استخراج `{id}` یا `{code}` از مسیر در رابط‌های جاوای خالص.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای پارامتر کوئری (`@AutoParam`) یا بدنه JSON (`@AutoBody`) استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"orderId"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoVariable("orderId") UUID orderId` | نام متغیر مسیر URI برای اتصال.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `value` را پیش از `name` بررسی می‌کند. مقادیر متضاد ندهید. |
| `name` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"tenantCode"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | نام صریح متغیر مسیر.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `value` را پیش از `name` بررسی می‌کند. مقادیر متضاد ندهید. |
| `required` | `boolean` | `true` | خیر (اختیاری) | `true` (الزامی؛ نبود آن HTTP 400 برمی‌گرداند) یا `false` (اختیاری؛ در نبود آن null ارسال می‌شود).<br/>`@AutoVariable(name = "id", required = true) UUID id` | الزامی بودن مقدار غیرتهی برای متغیر مسیر.<br/>*نکته:* نام متغیر باید با `{variableName}` در الگوی URI یکسان باشد؛ `false` فقط در الگوهای مسیر اختیاری کاربرد دارد. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **هدف**: بدنه JSON درخواست HTTP را همراه با @Valid به پارامترهای DTO یا Entity تبدیل می‌کند.
- **رفتار در زمان اجرا**: پیش از ورود به تراکنش سرویس توسط LocalValidatorFactoryBean اعتبارسنجی می‌شود.
- **نحوه استفاده**: روی پارامتر بدنه متدهای `@AutoPost`/`@AutoPut`/`@AutoPatch` همراه `@Valid` قرار دهید.
- **چه زمانی استفاده شود**: برای تبدیل بدنه JSON به موجودیت یا DTO در کنترلرهای جاوای خالص.
- **چه زمانی استفاده نشود و دام‌های رایج**: در متدهای GET/DELETE بدون بدنه یا بیش از یک بار در یک متد استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | خیر (اختیاری) | `true` (الزامی؛ نبود آن HTTP 400 برمی‌گرداند) یا `false` (اختیاری؛ در نبود آن null ارسال می‌شود).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | تعیین می‌کند نبود بدنه درخواست باعث خطای HTTP 400 شود یا خیر.<br/>*نکته:* همراه با `@Valid` برای اعتبارسنجی جاکارتا استفاده کنید؛ `false` بدنه خالی را بدون خطای `400` می‌پذیرد. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: پیمایش بازگشتی روابط فرزند را از طریق GET /{id}/{relation}/** با مسدودسازی حلقه‌ها مجاز می‌کند.
- **رفتار در زمان اجرا**: نیازمند فعال‌سازی @AutoRestController(enableNestedSubResources = true) روی کنترلر است.
- **نحوه استفاده**: `enableNestedSubResources = true` را فعال و با `@EnableNestedSubResource(allowedRelationships = {"items"})` محدود کنید.
- **چه زمانی استفاده شود**: زمانی که مسیرهای تو در تو مثل `GET /api/v1/customer-orders/{id}/items` همراه بررسی امنیت در هر گام نیاز است.
- **چه زمانی استفاده نشود و دام‌های رایج**: بدون محدود کردن `allowedRelationships` روی جداول پررابطه فعال نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | فهرست سفید کلاس‌های موجودیت هدف مجاز در پیمایش GET /{id}/**.<br/>*نکته:* آرایه خالی همه موجودیت‌های فرزند را باز می‌کند؛ کلاس‌ها را صریح فهرست کنید تا جداول داخلی افشا نشوند. |
| `allowedRelationships` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | نام دقیق فیلدهای رابطه JPA مجاز در مسیر زیرمنابع (مثلاً "items", "customer").<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"items"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: گذارهای وضعیت دامنه یا تنظیمات عددی را به‌صورت اعلانی روی متدهای اکشن سفارشی تعریف می‌کند.
- **رفتار در زمان اجرا**: پیش از ذخیره‌سازی ویژگی‌های به‌روزشده موجودیت به‌صورت اتمیک اجرا می‌شود.
- **نحوه استفاده**: روی متد کنترلر، `@AutoPatch` را همراه با `@BusinessAction(...)` ترکیب کنید.
- **چه زمانی استفاده شود**: برای تغییر وضعیت تک‌موجودیت، تغییر مقادیر عددی یا اجرای متد دامنه بدون نوشتن لایه Service.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای هماهنگی چند موجودیت یا تماس با API خارجی استفاده نکنید (`@ServiceOverride` را برگزینید).

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد وضعیت چرخه حیات (مانند `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | نام فیلد وضعیت در موجودیت (در صورت وجود @StateMachine اعتبارسنجی می‌شود).<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"status"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `targetStateValue` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"APPROVED"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | مقدار وضعیت هدف برای اختصاص در تراکنش.<br/>*نکته:* پیش از ذخیره به‌طور خودکار با `@StateMachine` یا `@HumanPolicy` بررسی می‌شود؛ انتقال نامعتبر تراکنش را برمی‌گرداند. |
| `adjustNumericField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد عددی (مانند `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | نام فیلد عددی برای افزایش یا کاهش اتمیک.<br/>*نکته:* نیازمند `deltaParamIndex >= 0` یا `fixedDelta` غیرخالی است و از `Integer`، `Long`، `BigDecimal` و `Double` پشتیبانی می‌کند. |
| `deltaParamIndex` | `int` | `-1` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | اندیس پارامتر متد (از صفر) حاوی مقدار delta؛ 1- غیرفعال می‌کند.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `deltaParamIndex` را پیش از `fixedDelta` بررسی می‌کند. مقادیر متضاد ندهید. |
| `fixedDelta` | `String` | `""` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | مقدار عددی ثابت (مثلاً "100" یا "-1") در صورت استفاده نکردن از پارامتر.<br/>*نکته:* هنگام راه‌اندازی، ثبت‌کننده ابتدا `deltaParamIndex` را پیش از `fixedDelta` بررسی می‌کند. مقادیر متضاد ندهید. |
| `entityMethod` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"markFulfilled"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | نام متد بدون پارامتر روی موجودیت که درون همان تراکنش اجرا می‌شود.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"markFulfilled"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. کشف Bean، اتصال پیکربندی و اولویت اجرا (5 حاشیه‌نویسی)

### `@AutoComponent`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: نشانگر کامپوننت فریم‌ورک که هنگام راه‌اندازی بدون import کردن @Component ثبت می‌شود.
- **رفتار در زمان اجرا**: فقط در بسته داخلی فریم‌ورک (io.github.natswarchuan) اسکن می‌شود؛ در برنامه خود از Spring @Component استفاده کنید.
- **نحوه استفاده**: استریوتایپ داخلی فریم‌ورک که در پکیج `io.github.natswarchuan` اسکن می‌شود.
- **چه زمانی استفاده شود**: فقط هنگام توسعه هسته فریم‌ورک در پکیج `io.github.natswarchuan.*` استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز در برنامه‌های مصرف‌کننده (`com.example.*`) استفاده نکنید! از `@Component` اسپرینگ استفاده کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | نام دقیق Bean ثبت‌شده در ApplicationContext (مانند `"invoiceValidationHelper"`) یا `""` برای تشخیص خودکار.<br/>`@AutoComponent("invoiceValidationHelper")` | نام صریح بین در صورت نیاز؛ خالی نام کلاس را به صورت camelCase برمی‌گرداند.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: نشانگر لایه سرویس برای کلاس‌های ServiceImpl همراه با @ServiceOverride.
- **رفتار در زمان اجرا**: فقط در بسته io.github.natswarchuan با نام کلاس ثبت می‌شود؛ سرویس‌های برنامه باید از Spring @Service استفاده کنند.
- **نحوه استفاده**: استریوتایپ سرویس داخلی در پکیج `io.github.natswarchuan`.
- **چه زمانی استفاده شود**: فقط برای سرویس‌های داخلی `io.github.natswarchuan.*`.
- **چه زمانی استفاده نشود و دام‌های رایج**: در سرویس‌های برنامه خود هرگز استفاده نکنید؛ از `@Service` اسپرینگ بهره ببرید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | نام دقیق Bean ثبت‌شده در ApplicationContext (مانند `"orderFulfillmentService"`) یا `""` برای تشخیص خودکار.<br/>`@AutoService("orderFulfillmentService")` | نام صریح اختیاری بین سرویس.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: متدهای کارخانه ساخت Bean مدیریت‌شده را درون کلاس‌های @AutoConfigurationBean اعلان می‌کند.
- **رفتار در زمان اجرا**: هنگام پیکربندی خودکار توسط PureJavaBeanRegistrarBridge پردازش می‌شود.
- **نحوه استفاده**: روی متدهای کارخانه درون کلاس‌های `@AutoConfigurationBean` فریم‌ورک قرار دهید.
- **چه زمانی استفاده شود**: فقط در پکیج `io.github.natswarchuan.config.*` فریم‌ورک.
- **چه زمانی استفاده نشود و دام‌های رایج**: در کلاس‌های `@Configuration` برنامه خود استفاده نکنید؛ از `@Bean` استاندارد استفاده کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | نام‌ها و نام‌های مستعار بین.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `targetTypeName` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"com.example.spi.PaymentGateway"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | نام کامل کلاس مقصد در صورت نیاز.<br/>*نکته:* نام کامل کلاس (FQCN) در حالتی که متد کارخانه سوپرتایپ یا پروکسی برمی‌گرداند؛ کلاس باید در classpath باشد. |
| `primary` | `boolean` | `false` | خیر (اختیاری) | `true` (Bean اولویت‌دار هنگام وجود چند نامزد) یا `false` (اولویت عادی).<br/>`@AutoBean(primary = true)` | بین را هنگام تداخل به عنوان کاندیدای اصلی علامت‌گذاری می‌کند.<br/>*نکته:* تعریف دو `@AutoBean(primary = true)` برای یک نوع واحد باعث تعارض ابهام در زمان راه‌اندازی می‌شود. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: کلاس‌های پیکربندی و مدل‌های اتصال ویژگی‌های YAML را نشان‌گذاری می‌کند.
- **رفتار در زمان اجرا**: بین‌های پیکربندی و پیشوندهای YAML را همراه با فراداده IDE ثبت می‌کند.
- **نحوه استفاده**: کلاس‌های پیکربندی و ویژگی‌ها را در `io.github.natswarchuan.config.*` مشخص می‌کند.
- **چه زمانی استفاده شود**: فقط درون هسته کتابخانه به جای `@Configuration`.
- **چه زمانی استفاده نشود و دام‌های رایج**: در کلاس‌های پیکربندی برنامه کاربردی استفاده نکنید؛ از `@Configuration` استفاده نمایید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | نام دقیق Bean ثبت‌شده در ApplicationContext (مانند `"storageAutoConfig"`) یا `""` برای تشخیص خودکار.<br/>`@AutoConfigurationBean("storageAutoConfig")` | شناسه اختیاری بین پیکربندی.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `prefix` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"nwvmc.storage"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | پیشوند اختیاری تنظیمات YAML برای اتصال.<br/>*نکته:* ویژگی‌های kebab-case از `application.yml` را متصل می‌کند؛ همراه با فایل metadata از هشدار IDE جلوگیری کنید. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **هدف**: ترتیب اولویت اجرا میان بین‌های SPI Customizer و زنجیره فیلترها را کنترل می‌کند.
- **رفتار در زمان اجرا**: اعداد صحیح کوچک‌تر زودتر اجرا می‌شوند (پیش‌فرض Integer.MAX_VALUE).
- **نحوه استفاده**: برای تعیین ترتیب اجرا از `@OrderPriority(1)` روی مؤلفه‌ها استفاده کنید.
- **چه زمانی استفاده شود**: زمانی که ترتیب اجرای قطعی بین چند Customizer حیاتی است.
- **چه زمانی استفاده نشود و دام‌های رایج**: با ترتیب فیلترهای Spring Security یا `?sort=` اشتباه نگیرید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | اولویت اجرا؛ مقادیر کوچک‌تر زودتر اجرا می‌شوند.<br/>*نکته:* اعداد کوچک‌تر زودتر اجرا می‌شوند (مانند Spring `@Order`). مقادیر `< 0` را برای امنیت و `10..100` را برای منطق تجاری نگه دارید. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. امنیت موجودیت، ماشین حالت، یکپارچگی داده، تولیدکننده‌های خودکار و پرس‌وجو (11 حاشیه‌نویسی)

### `@EntitySecurity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: پیش از پرس‌وجو یا تغییر موجودیت، کنترل دسترسی RBAC، جداسازی ownerField و کدهای مجوز را اعمال می‌کند.
- **رفتار در زمان اجرا**: پیش از اجرای SQL ارزیابی می‌شود؛ دسترسی غیرمجاز بلافاصله HTTP 403 Forbidden برمی‌گرداند.
- **نحوه استفاده**: روی کلاس `@Entity` قرار داده و نقش‌ها و `ownerField` را تعیین کنید.
- **چه زمانی استفاده شود**: روی تمام موجودیت‌های دارای API برای حفاظت یکپارچه REST، دسته‌ای، خروجی و GraphQL استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز `permitAll = true` را روی `AutoApiController<E>` کامل بدون `AutoReadApi<E>`، `disabledEndpoints` یا `@SecurityPolicyEntity` قرار ندهید (بررسی READ، WRITE و DELETE را دور می‌زند).

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_USER", "ROLE_ADMIN"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | نقش‌های مجاز برای خواندن رکوردها (GET، GraphQL، خروجی).<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |
| `writeRoles` | `String[]` | `{}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_MANAGER", "ROLE_ADMIN"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | نقش‌های مجاز برای نوشتن و ویرایش (POST/PUT/PATCH).<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |
| `deleteRoles` | `String[]` | `{}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | نقش‌های مجاز برای حذف (DELETE / حذف دسته‌ای).<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |
| `permitAll` | `boolean` | `false` | خیر (اختیاری) | `true` (اجازه دسترسی عمومی بدون احراز هویت) یا `false` (الزام احراز هویت و بررسی نقش‌ها).<br/>`@EntitySecurity(permitAll = true)` | در صورت true (بدون قانون DB-RBAC) بررسی را در تمام عملیات READ، WRITE و DELETE دور می‌زند؛ با AutoReadApi<E> یا disabledEndpoints ترکیب کنید.<br/>*نکته:* بررسی نقش‌ها را لغو کرده و دسترسی ناشناس می‌دهد؛ هرگز برای داده‌های حساس یا مالی فعال نکنید. |
| `ownerField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد مالک/UUID (مانند `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | نام فیلد مالک رکورد (مثل "createdBy") برای جلوگیری از نفوذ IDOR.<br/>*نکته:* فیلتر مالکیت در سطح ردیف را روی خواندن و نوشتن اعمال می‌کند، مگر اینکه کاربر نقشی در `bypassOwnerRoles` داشته باشد. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | نقش‌های مدیریتی که از بررسی `ownerField` معاف هستند.<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |
| `permissions` | `String[]` | `{}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ORDER_READ", "ORDER_APPROVE"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | کدهای دسترسی دقیق که همراه نقش‌ها بررسی می‌شوند.<br/>*نکته:* با مجوزهای ریزدانه در JWT یا `@SecurityPermissionEntity` تطبیق داده می‌شود. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: در صورت نبود مجوز نقش، ستون‌های حساس را به‌صورت پویا پوشانش یا تهی می‌کند.
- **رفتار در زمان اجرا**: پس از واکشی داده و پیش از سریال‌سازی JSON اعمال می‌شود.
- **نحوه استفاده**: روی فیلدهای حساس (`costPrice`، `ssn`) بگذارید؛ ماسک روی کپی ایزوله انجام می‌شود.
- **چه زمانی استفاده شود**: زمانی که یک موجودیت باید فیلدهای حساس را بر اساس نقش در REST و GraphQL مخفی کند.
- **چه زمانی استفاده نشود و دام‌های رایج**: انواع غیر `String` خودکار `null` می‌شوند؛ برای `null` کردن فیلدهای `String` به جای `"******"` مقدار `nullifyInsteadOfMask = true` را بگذارید یا از `readDto` استفاده کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_ADMIN", "ROLE_FINANCE"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | نقش‌های مجاز به مشاهده مقدار اصلی فیلد.<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |
| `maskPattern` | `String` | `"******"` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"***-**-****"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | الگوی جایگزین نمایش‌داده‌شده در نبود نقش مجاز.<br/>*نکته:* در حالت `nullifyInsteadOfMask = true` نادیده گرفته می‌شود. برای فیلدهای غیررشته‌ای (`BigDecimal`، `LocalDate`) از `nullifyInsteadOfMask = true` استفاده کنید. |
| `nullifyInsteadOfMask` | `boolean` | `false` | خیر (اختیاری) | `true` (جایگزینی فیلد غیرمجاز با JSON null) یا `false` (اعمال رشته maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | در صورت true فیلدهای String را هم به جای maskPattern برابر null قرار می‌دهد (نوع‌های غیر String به‌طور خودکار null می‌شوند).<br/>*نکته:* برای فیلدهای عددی، تاریخ و اشیا ضروری است تا کلاینت TypeScript/Zod مقدار معتبر `null` دریافت کند. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: گذارهای مجاز وضعیت را در POST /{id}/transition اعمال کرده و DELETE /{id} را به deletableStates محدود می‌کند.
- **رفتار در زمان اجرا**: گذارها یا حذف‌های غیرمجاز را با خطای HTTP 422 BusinessRuleViolationException رد می‌کند.
- **نحوه استفاده**: روی فیلد متنی وضعیت با جداکننده `:` (`"CREATED:PAID,CANCELLED"`) قرار دهید.
- **چه زمانی استفاده شود**: برای چرخه‌های حیات سخت‌گیرانه (سفارش، وام، فاکتور) برای جلوگیری از پرش غیرمجاز با خطای `422`.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز از نحو `"->"` استفاده نکنید (فقط `":"` پشتیبانی می‌شود)!

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"CREATED"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | وضعیت اولیه پیش‌فرض هنگام ایجاد رکورد در صورت خالی بودن ("ACTIVE").<br/>*نکته:* در هنگام ایجاد `POST` در صورت خالی بودن خودکار تنظیم می‌شود و باید با وضعیت پیش از `:` در `transitions` همخوانی داشته باشد. |
| `transitions` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | قوانین انتقال وضعیت مجاز با قالب دونقطه "FROM:TO_1,TO_2".<br/>*نکته:* قالب دقیق دونقطه `"FROM:TO1,TO2"` (مقصدها با کاما جدا) الزامی است؛ هر گذار تعریف‌نشده با خطای HTTP `400`/`409` رد می‌شود. |
| `deletableStates` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | فهرست وضعیت‌های مجاز برای حذف (سایر موارد با HTTP 422 رد می‌شوند).<br/>*نکته:* اگر خالی نباشد، حذف موجودیت در هر وضعیت دیگری (مانند `"PAID"`) با HTTP `409 Conflict` رد می‌شود. |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: بندهای خوانای سیاست را به قواعد فعال RBAC، گذار وضعیت و پوشانش فیلد تبدیل می‌کند.
- **رفتار در زمان اجرا**: از مسیر GET /human-policy قابل بررسی و در YAML زیر کلید spring-nwvmc.human-policies.<Entity> قابل بازنویسی است.
- **نحوه استفاده**: روی موجودیت یا در YAML تحت `spring-nwvmc.human-policies` تعریف کنید تا در شروع برنامه کامپایل شود.
- **چه زمانی استفاده شود**: هنگامی که تیم‌های محصول یا انطباق به قوانین خوانا و قابل تنظیم در YAML نیاز دارند.
- **چه زمانی استفاده نشود و دام‌های رایج**: متن آزاد دلخواه یا غیرانگلیسی ننویسید — کامپایلر فقط الگوهای مشخص انگلیسی را می‌شناسد.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | دستورالعمل چرخه حیات به انگلیسی طبیعی برای کامپایل به انتقال وضعیت.<br/>*نکته:* در راه‌اندازی به همان موتور `@StateMachine` کامپایل می‌شود؛ قوانین متضاد را همزمان تعریف نکنید. |
| `security` | `String` | `""` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | دستورالعمل کنترل دسترسی RBAC به انگلیسی طبیعی.<br/>*نکته:* پیشوند `ROLE_` به‌طور خودکار به نقش‌ها افزوده شده و در راه‌اندازی اعتبارسنجی می‌شود. |
| `masking` | `String` | `""` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | سیاست مخفی‌سازی فیلدها به انگلیسی طبیعی.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"costPrice"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `stateField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد وضعیت چرخه حیات (مانند `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | نام فیلد وضعیت در موجودیت برای قوانین `lifecycle`.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"orderStatus"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: تفاوت‌های سطح فیلد را در تغییرات ثبت کرده و بازسازی زمانی و بررسی /diff را پشتیبانی می‌کند.
- **رفتار در زمان اجرا**: تغییرات oldValue و newValue را هنگام ایجاد، ویرایش، پچ، گذار وضعیت و بازیابی ثبت می‌کند.
- **نحوه استفاده**: روی موجودیت مشتق از `BaseAuditEntity` قرار دهید تا تغییرات خودکار ثبت شوند.
- **چه زمانی استفاده شود**: برای موجودیت‌های حساس به ممیزی (پرداخت‌ها، سفارش‌ها، پرونده پزشکی) جهت قابلیت `/{id}/revisions`.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی جداول لاگ با نرخ نوشتن بسیار بالا استفاده نکنید تا سربار I/O افزایش نیابد.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"FINANCE_LEDGER"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | دسته‌بندی ممیزی ثبت‌شده در رویدادها؛ پیش‌فرض نام موجودیت.<br/>*نکته:* برای برچسب‌گذاری و فیلتر گزارش‌های ممیزی است؛ `""` نام کلاس موجودیت JPA را انتخاب می‌کند. |
| `recordFieldDiffs` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | در حالت true تغییرات هر فیلد را برای قابلیت Time-Travel ذخیره می‌کند.<br/>*نکته:* تفاوت قبل و بعد هر `PUT`/`PATCH` را ثبت می‌کند؛ برای داده‌های حجیم یا نوشتن‌های پرتکرار `false` بگذارید. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: پرس‌وجوها و تغییرات ردیف را به‌طور خودکار بر اساس مستأجر فعال ایزوله می‌کند مگر با نقش عبور.
- **رفتار در زمان اجرا**: در نبود زمینه مستأجر بدون نقش عبور با HTTP 403 مسدود می‌کند؛ هنگام ایجاد مقدار tenantId را بازنویسی اجباری کرده و مانع IDOR روی همه عملیات شناسه می‌شود.
- **نحوه استفاده**: روی موجودیت SaaS قرار دهید تا ایزوله‌سازی خودکار و مسدودسازی `403` اعمال شود.
- **چه زمانی استفاده شود**: روی تمام جداول مشترک B2B SaaS برای جلوگیری از نشت داده بین مستاجران استفاده کنید.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی جداول مرجع عمومی (کشورها، ارزها) استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد شناسه مستأجر (مانند `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | نام فیلد نگهدارنده شناسه مستاجر در موجودیت (پیش‌فرض "tenantId").<br/>*نکته:* برای سرعت بالا و جداسازی دقیق، ایندکس ترکیبی `(tenant_id, id)` را در پایگاه‌داده ایجاد کنید. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | خیر (اختیاری) | آرایه نام نقش‌های Spring Security (مانند `{"ROLE_SUPER_ADMIN"}`)؛ `{}` خالی محدودیت جداگانه‌ای اعمال نمی‌کند.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | نقش‌های ابرمدیر پلتفرم با دسترسی به تمام مستاجرها.<br/>*نکته:* نام نقش‌ها را با پیشوند `ROLE_` در `RoleConstant` تعریف کنید (مانند `ROLE_ADMIN`) تا با `GrantedAuthority` همخوانی داشته باشد. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: پیش از ذخیره‌سازی در عملیات ایجاد، ویرایش و upsert یکتایی مقدار را بررسی می‌کند.
- **رفتار در زمان اجرا**: در صورت وجود مقدار تکراری، خطای ConflictBusinessException (HTTP 409) را پرتاب می‌کند.
- **نحوه استفاده**: روی فیلدهای یکتای کسب‌وکار (`email`، `skuCode`) همراه `@Column(unique = true)` قرار دهید.
- **چه زمانی استفاده شود**: برای اعتبارسنجی یکتایی روی رکوردهای فعال و بازگرداندن خطای `HTTP 409 Conflict` شفاف.
- **چه زمانی استفاده نشود و دام‌های رایج**: در هم‌زمانی بالا بدون ایندکس `UNIQUE` دیتابیس به تنهایی استفاده نکنید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: هنگام ایجاد یا کپی در صورت خالی بودن، کدهای تجاری یکتای پیشونددار تولید می‌کند.
- **رفتار در زمان اجرا**: پیش از اعتبارسنجی و ذخیره، پیشوند + توکن یکتا را مقداردهی می‌کند.
- **نحوه استفاده**: روی فیلد متنی با `prefix` قرار دهید؛ در زمان ایجاد یا کلون در صورت خالی بودن تولید می‌شود.
- **چه زمانی استفاده شود**: برای تولید کدهای خوانا (شماره سفارش، SKU، کد فروشگاه) بدون گلوگاه sequence دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: اگر قوانین مالیاتی اعداد متوالی بدون پرش (`1, 2, 3...`) را الزامی می‌دانند استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **بله (اجباری)** | رشته شناسه غیرخالی (مانند `"ORD"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | پیشوند کد اجباری پیش از هش ۸ کاراکتری UUIDv7 (مثلاً "PRD-").<br/>*نکته:* ویژگی الزامی؛ تنها در صورت خالی بودن فیلد هنگام ایجاد، کدی مانند `INV-2026-0001` تولید می‌کند. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: اسلاگ‌های ASCII سازگار با آدرس وب را به‌صورت خودکار از sourceField می‌سازد.
- **رفتار در زمان اجرا**: نشانه‌های یونیکد را نرمال‌سازی کرده و جست‌وجو از طریق فیلتر اسلاگ را فراهم می‌کند.
- **نحوه استفاده**: روی فیلد `slug` با `sourceField` قرار دهید.
- **چه زمانی استفاده شود**: برای ساخت URLهای سئوپسند در فروشگاه، مقالات و محصولات.
- **چه زمانی استفاده نشود و دام‌های رایج**: `sourceField` را به فیلد ناموجود ندهید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **بله (اجباری)** | نام دقیق ویژگی جاوا در موجودیت برای فیلد رشته‌ای (مانند `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | نام فیلد مبدا اجباری برای تبدیل به اسلاگ ASCII کوچک.<br/>*نکته:* الزامی؛ متن را به slug ایمن kebab-case تبدیل می‌کند. برای یکتایی همراه با `@UniqueField` استفاده شود. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **هدف**: مقادیر عددی مشتق‌شده را پیش از ذخیره تغییرات موجودیت به‌صورت خودکار محاسبه می‌کند.
- **رفتار در زمان اجرا**: هنگام راه‌اندازی توسط ComputedFieldFailFastUtil اعتبارسنجی می‌شود تا خطای فیلد سریع شناسایی شود.
- **نحوه استفاده**: روی فیلد محاسباتی `BigDecimal` قرار دهید تا پیش از ذخیره در سرور با دقت محاسبه شود.
- **چه زمانی استفاده شود**: برای محاسبه مطمئن جمع کل سفارش و جلوگیری از دستکاری مبلغ توسط کلاینت.
- **چه زمانی استفاده نشود و دام‌های رایج**: برای قیمت‌گذاری پلکانی پیچیده یا استعلام نرخ ارز خارجی استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | استراتژی محاسبه: "MULTIPLY" یا "SUM_COLLECTION".<br/>*نکته:* پیش از ذخیره به‌طور خودکار محاسبه مجدد می‌شود و مقادیر دستکاری‌شده کلاینت را بازنویسی می‌کند. |
| `sourceFields` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | فیلدهای هم‌موجودیت که در حالت "MULTIPLY" ضرب می‌شوند.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"unitPrice"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `collectionField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد مجموعه @OneToMany (مانند `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | نام فیلد مجموعه @OneToMany در حالت "SUM_COLLECTION".<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"items"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `itemField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد عددی (مانند `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | نام فیلد عددی روی هر عضو فرزند برای جمع زدن.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"subTotal"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `subtractField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد عددی (مانند `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | فیلد کسورات روی موجودیت والد که از جمع کم می‌شود.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"discountAmount"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `addField` | `String` | `""` | خیر (اختیاری) | نام دقیق ویژگی جاوا در موجودیت برای فیلد عددی (مانند `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | فیلد هزینه اضافی که به جمع نهایی اضافه می‌شود.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"shippingFee"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: اتصال کوئری‌های سفارشی SQL/JPQL یا متدهای فراهم‌کننده به اندپوینت‌های کنترلر را ممکن می‌سازد.
- **رفتار در زمان اجرا**: با پارامترهای نام‌گذاری‌شده متصل از طریق JPA EntityManager اجرا می‌شود.
- **نحوه استفاده**: همراه با `@AutoGet`/`@AutoPost` و با اتصال `:param` توسط `@AutoParam` استفاده کنید.
- **چه زمانی استفاده شود**: برای گزارش‌های SQL بومی، CTE و توابع پنجره‌ای بدون ساخت Repository.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز ورودی کاربر را به SQL نچسبانید (`:param` الزامی است) و بین دامنه‌های مستقل JOIN نزنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | رشته کوئری SQL یا JPQL درون‌خطی با پارامتر `:param`.<br/>*نکته:* همیشه برای جلوگیری از تزریق SQL از `:param` یا `?1` استفاده کنید؛ هنگام استفاده از `sqlProvider` خالی بگذارید. |
| `nativeQuery` | `boolean` | `true` | خیر (اختیاری) | `true` (اجرای SQL بومی پایگاه‌داده) یا `false` (اجرای JPQL قابل حمل JPA).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | در حالت true کوئری SQL بومی و در false کوئری JPQL اجرا می‌شود.<br/>*نکته:* SQL بومی (`true`) از CTE و توابع پنجره‌ای پشتیبانی می‌کند؛ برای سازگاری بین H2/PostgreSQL/MySQL مقدار `false` بگذارید. |
| `resultClass` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `MonthlyRevenueDto.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | کلاس اختیاری برای نگاشت ردیف‌های نتیجه.<br/>*نکته:* برای کوئری‌های تجمیعی همیشه کلاس DTO مشخص کنید تا از `SELECT *` و آرایه‌های بی‌نوع جلوگیری شود. |
| `sqlProvider` | `Class<?>` | `Void.class` | خیر (اختیاری) | هر کلاس مشخص DTO در جاوا (مانند `OrderAnalyticsSqlProvider.class`) یا `Void.class` برای غیرفعال‌سازی نگاشت.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | کلاس ارائه‌دهنده SQL پویا که در زمان راه‌اندازی بررسی می‌شود.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `sqlProvider` پیش از پذیرش ترافیک خطا می‌دهد. |
| `providerMethod` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"buildRevenueSql"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | نام متد درون `sqlProvider` که رشته SQL را برمی‌گرداند.<br/>*نکته:* باید دقیقاً با شناسه جاوا (حساس به حروف بزرگ و کوچک، مانند `"buildRevenueSql"`) منطبق باشد؛ عدم تطابق باعث خطای زمان اجرا می‌شود. |
| `modifying` | `boolean` | `false` | خیر (اختیاری) | `true` (اجرای DML UPDATE/DELETE در تراکنش نوشتن) یا `false` (کوئری SELECT فقط خواندنی).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | برای دستورات INSERT/UPDATE/DELETE باید `true` باشد.<br/>*نکته:* برای هر دستور `UPDATE`/`DELETE` مقدار `true` الزامی است تا در تراکنش نوشتن اجرا شود. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. کنترل دسترسی پویای مبتنی بر پایگاه داده (DB-RBAC) و پنهان‌سازی فیلدها (18 حاشیه‌نویسی)

### `@SecurityRoleEntity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **هدف**: یک موجودیت JPA را به‌عنوان جدول کاتالوگ نقش‌های RBAC پویا در پایگاه داده تعیین می‌کند.
- **رفتار در زمان اجرا**: DynamicDatabaseRbacProviderHelper نگاشت نقش-مجوز را در Caffeine کش کرده و هنگام نوشتن باطل می‌کند.
- **نحوه استفاده**: روی موجودیت Role قرار داده و فیلد اجباری `@RoleCode` را مشخص کنید.
- **چه زمانی استفاده شود**: هنگامی که مدیران نقش‌ها را به صورت پویا از طریق جداول دیتابیس مدیریت می‌کنند.
- **چه زمانی استفاده نشود و دام‌های رایج**: بدون `@RoleCode` قرار ندهید (در راه‌اندازی خطا می‌دهد) و بیش از یک `@SecurityRoleEntity` نسازید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب ثانیه؛ مانند `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | مدت زمان کش Caffeine به ثانیه پیش از بارگذاری مجدد نقش‌ها.<br/>*نکته:* TTL کوتاه تغییرات را سریع‌تر اعمال می‌کند اما کوئری بیشتری دارد؛ TTL طولانی بار پایگاه‌داده را کم ولی لغو مجوز را کند می‌کند. |

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

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: ستون کد یکتای نقش را درون موجودیت @SecurityRoleEntity نگاشت می‌کند.
- **رفتار در زمان اجرا**: از طریق LambdaAccessorUtil برای تطبیق توکن‌های GrantedAuthority خوانده می‌شود.
- **نحوه استفاده**: `@RoleCode` را روی فیلد یا getter مربوط در موجودیت `@SecurityRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فیلد نام نمایشی خوانا برای انسان را روی @SecurityRoleEntity مشخص می‌کند.
- **رفتار در زمان اجرا**: در فراداده تشخیصی RBAC و اندپوینت‌های بررسی Dev Studio نمایش داده می‌شود.
- **نحوه استفاده**: `@RoleName` را روی فیلد یا getter مربوط در موجودیت `@SecurityRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فیلد مجموعه یا رشته CSV شامل کدهای مجوز اعطاشده به نقش را مشخص می‌کند.
- **رفتار در زمان اجرا**: به‌صورت پویا تجزیه شده و به اختیارات موثر SecurityIdentityCustomizer بسط می‌یابد.
- **نحوه استفاده**: `@RolePermissions` را روی فیلد یا getter مربوط در موجودیت `@SecurityRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **هدف**: یک موجودیت JPA برای نگهداری مجوزهای منبع-عملیات و قواعد پوشانش پویا تعیین می‌کند.
- **رفتار در زمان اجرا**: در DatabaseRbacRuleMatcherHelper بارگذاری شده تا دسترسی CRUD و پوشانش فیلدها را اعمال کند.
- **نحوه استفاده**: روی موجودیت Permission قرار داده و `@PermissionCode` اجباری را نشانه‌گذاری کنید.
- **چه زمانی استفاده شود**: برای مدیریت دسترسی‌های دقیق منبع/عملیات و ماسک کردن فیلدها از طریق دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: `@PermissionCode` را فراموش نکنید و چند `@SecurityPermissionEntity` نسازید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب ثانیه؛ مانند `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | مدت کش Caffeine به ثانیه برای دسترسی‌ها.<br/>*نکته:* TTL کوتاه تغییرات را سریع‌تر اعمال می‌کند اما کوئری بیشتری دارد؛ TTL طولانی بار پایگاه‌داده را کم ولی لغو مجوز را کند می‌کند. |

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

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فیلد شناسه یکتای مجوز را درون @SecurityPermissionEntity تعیین می‌کند.
- **رفتار در زمان اجرا**: با اختیارات فراخواننده و کدهای @EntitySecurity.permissions() تطبیق داده می‌شود.
- **نحوه استفاده**: `@PermissionCode` را روی فیلد یا getter مربوط در موجودیت `@SecurityPermissionEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPermissionEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPermissionEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: نام موجودیت یا منبع API هدف (یا نویسه عام *) را در @SecurityPermissionEntity نگاشت می‌کند.
- **رفتار در زمان اجرا**: توسط DatabaseRbacRuleMatcherHelper بدون حساسیت به بزرگی حروف و با پشتیبانی wildcard ارزیابی می‌شود.
- **نحوه استفاده**: `@PermissionResource` را روی فیلد یا getter مربوط در موجودیت `@SecurityPermissionEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPermissionEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPermissionEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فعل عملیات CRUD یا اکشن سفارشی محافظت‌شده توسط @SecurityPermissionEntity را نگاشت می‌کند.
- **رفتار در زمان اجرا**: از نام متدهای کنترلر به‌طور خودکار به READ، WRITE، DELETE یا اکشن سفارشی نرمال‌سازی می‌شود.
- **نحوه استفاده**: `@PermissionAction` را روی فیلد یا getter مربوط در موجودیت `@SecurityPermissionEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPermissionEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPermissionEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فیلدهای جداشده با ویرگول را مشخص می‌کند که هنگام اعمال این مجوز باید به‌صورت پویا پوشانده شوند.
- **رفتار در زمان اجرا**: پیش از سریال‌سازی پاسخ HTTP JSON به‌طور پویا همراه با @FieldSecurity اعمال می‌شود.
- **نحوه استفاده**: `@PermissionFieldMask` را روی فیلد یا getter مربوط در موجودیت `@SecurityPermissionEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPermissionEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPermissionEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **هدف**: موجودیت JPA متصل‌کننده شناسه‌های کاربری به نقش‌های پایگاه داده و محدوده مستأجر را مشخص می‌کند.
- **رفتار در زمان اجرا**: هنگام بارگذاری JWT / SecurityContext به‌طور خودکار از طریق SecurityIdentityCustomizer واکشی می‌شود.
- **نحوه استفاده**: روی موجودیت واسط کاربر-نقش با `@UserRoleSubject` و `@UserRoleCode` قرار دهید.
- **چه زمانی استفاده شود**: وقتی JWT فقط نام کاربری را دارد و نقش‌ها باید به صورت پویا از دیتابیس خوانده شوند.
- **چه زمانی استفاده نشود و دام‌های رایج**: `@UserRoleSubject` را فراموش نکنید؛ اگر IdP خارجی تمام نقش‌ها را می‌دهد نیازی نیست.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@SecurityUserRoleEntity(enabled = true)` | کلید فعال یا غیرفعال‌سازی بارگذاری نگاشت کاربر-نقش.<br/>*نکته:* در زمان مهاجرت پایگاه‌داده می‌توان موقتاً `false` گذاشت تا نقش‌های JWT همچنان فعال بمانند. |

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

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فیلد شناسه اصلی کاربر (JWT sub / username) را روی @SecurityUserRoleEntity مشخص می‌کند.
- **رفتار در زمان اجرا**: با مقدار Authentication.getName() در SecurityContext فعال تطبیق داده می‌شود.
- **نحوه استفاده**: `@UserRoleSubject` را روی فیلد یا getter مربوط در موجودیت `@SecurityUserRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityUserRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityUserRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: ستون کد نقش تخصیص‌یافته را درون @SecurityUserRoleEntity متصل می‌کند.
- **رفتار در زمان اجرا**: هنگام ارزیابی سیاست‌ها، مجوزهای مرتبط با @SecurityRoleEntity را بازیابی می‌کند.
- **نحوه استفاده**: `@UserRoleCode` را روی فیلد یا getter مربوط در موجودیت `@SecurityUserRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityUserRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityUserRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: تخصیص نقش در @SecurityUserRoleEntity را به یک مستأجر خاص (یا * برای همه‌جا) محدود می‌کند.
- **رفتار در زمان اجرا**: در هر درخواست احراز هویت‌شده بر اساس TenantContextHolder / X-Tenant-ID فیلتر می‌شود.
- **نحوه استفاده**: `@UserRoleTenantId` را روی فیلد یا getter مربوط در موجودیت `@SecurityUserRoleEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityUserRoleEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityUserRoleEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **هدف**: موجودیت JPA نگهدارنده سیاست‌های صریح ALLOW / DENY بر اساس priority را مشخص می‌کند.
- **رفتار در زمان اجرا**: سیاست صریح DENY به‌صورت قطعی بر ALLOW اولویت دارد و پیش از اجرای SQL بررسی می‌شود.
- **نحوه استفاده**: روی موجودیت سیاست قرار داده و فیلد اجباری `@PolicyAllowedRoles` و `@PolicyEffect` را تعیین کنید.
- **چه زمانی استفاده شود**: برای بازنویسی پویای `@EntitySecurity` از طریق دیتابیس (از جمله مسدودسازی فوری `DENY`).
- **چه زمانی استفاده نشود و دام‌های رایج**: `@PolicyAllowedRoles` را فراموش نکنید؛ قانون `DENY` همیشه بر `ALLOW` اولویت دارد.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | خیر (اختیاری) | عدد مثبت (`>= 0`) بر حسب اولویت عددی؛ مانند `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | اولویت ارزیابی سیاست‌ها (مقادیر کوچک‌تر اولویت بالاتر دارند).<br/>*نکته:* در صورت تطابق چند سیاست، عدد کوچک‌تر اولویت بالاتری دارد (مثلاً `10` بر `100` غلبه می‌کند). |

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

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: الگوی شناسه منبع هدف را در موجودیت @SecurityPolicyEntity نگاشت می‌کند.
- **رفتار در زمان اجرا**: از نام دقیق موجودیت/منبع و همچنین تطبیق عام * پشتیبانی می‌کند.
- **نحوه استفاده**: `@PolicyResource` را روی فیلد یا getter مربوط در موجودیت `@SecurityPolicyEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPolicyEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPolicyEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: فعل عملیات محافظت‌شده (READ، WRITE، DELETE، methodName، *) را در @SecurityPolicyEntity نگاشت می‌کند.
- **رفتار در زمان اجرا**: پیش از ارجاع به سرویس، برای هر عملیات HTTP ارزیابی می‌شود.
- **نحوه استفاده**: `@PolicyAction` را روی فیلد یا getter مربوط در موجودیت `@SecurityPolicyEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPolicyEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPolicyEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: مجموعه یا رشته جداشده با ویرگول نقش‌های مشمول قاعده @SecurityPolicyEntity را نگاشت می‌کند.
- **رفتار در زمان اجرا**: با اختیارات JWT فعال و نقش‌های بارگذاری‌شده از @SecurityUserRoleEntity تطبیق داده می‌شود.
- **نحوه استفاده**: `@PolicyAllowedRoles` را روی فیلد یا getter مربوط در موجودیت `@SecurityPolicyEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPolicyEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPolicyEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **هدف**: نتیجه تصمیم سیاست (ALLOW یا DENY) را روی @SecurityPolicyEntity مشخص می‌کند.
- **رفتار در زمان اجرا**: هر سیاست DENY منطبق، بلافاصله درخواست را با خطای HTTP 403 AccessDeniedBusinessException متوقف می‌کند.
- **نحوه استفاده**: `@PolicyEffect` را روی فیلد یا getter مربوط در موجودیت `@SecurityPolicyEntity` قرار دهید.
- **چه زمانی استفاده شود**: برای نگاشت ستون‌های دلخواه `@SecurityPolicyEntity` به موتور DB-RBAC بدون تغییر ساختار دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی چند فیلد در یک کلاس تکرار نکنید و خارج از `@SecurityPolicyEntity` قرار ندهید.

> **حاشیه‌نویسی نشانگر (Marker Annotation)**: حاشیه‌نویسی نشانگر خالص بدون هیچ ویژگی.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. قفل توزیع‌شده، یک‌باراجرایی، کشینگ، چندپایگاه‌داده و رویدادهای ابری (13 حاشیه‌نویسی)

### `@DistributedLock`

- **پکیج**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **هدف**: دسترسی هم‌زمان را بر اساس کلیدهای SpEL کش‌شده صف‌بندی می‌کند (پیش‌فرض waitTimeMs=3000L، leaseTimeMs=5000L).
- **رفتار در زمان اجرا**: در صورت انقضای مهلت، DistributedLockAspect خطای DistributedLockAcquisitionException (HTTP 409) صادر می‌کند.
- **نحوه استفاده**: روی متد یک `@Service` غیرنهایی قرار دهید و در خوشه یک بین Redis `DistributedLockProvider` تعریف کنید.
- **چه زمانی استفاده شود**: برای جلوگیری از فروش بیش از موجودی یا برداشت هم‌زمان از کیف پول.
- **چه زمانی استفاده نشود و دام‌های رایج**: تصور نکنید ارائه‌دهنده پیش‌فرض Caffeine بین چند سرور کار می‌کند؛ روی کلاس `final` هم نگذارید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | خیر (اختیاری) | عبارت SpEL با ارجاع به پارامترهای متد (مانند `"'inventory:' + #skuId"`) یا `""` برای تولید خودکار کلید.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | عبارت SpEL برای ساخت کلید قفل در زمان اجرا.<br/>*نکته:* کلید را همیشه به کوچک‌ترین شناسه منبع (`#id`) محدود کنید؛ کلید ثابت کل ترافیک را صف‌بندی می‌کند. |
| `waitTimeMs` | `long` | `3000L` | خیر (اختیاری) | عدد مثبت (`>= 0`) بر حسب میلی‌ثانیه؛ مانند `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | حداکثر زمان انتظار به میلی‌ثانیه برای دریافت قفل (پیش‌فرض 3000L).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: مقدار خیلی کم خطای ۴۰۹ کاذب می‌دهد و مقدار خیلی زیاد ریسمان‌ها را معطل می‌کند. |
| `leaseTimeMs` | `long` | `5000L` | خیر (اختیاری) | عدد مثبت (`>= 100`) بر حسب میلی‌ثانیه؛ مانند `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | حداکثر مدت زمان اجاره قفل به میلی‌ثانیه (پیش‌فرض 5000L).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: باید از زمان p99 تراکنش بیشتر باشد تا قفل پیش از اتمام نوشتن منقضی نشود. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: از نوشتن‌های تکراری هم‌زمان یا بازپخش‌شده در بازه TTL قابل تنظیم جلوگیری می‌کند.
- **رفتار در زمان اجرا**: توسط IdempotencyAspect و ProxyIdempotencyGuardHelper با قفل Caffeine TTL اجرا می‌شود (HTTP 409 ConflictBusinessException)؛ کلید خالی عبور می‌کند و IdempotencyManagerHelper اختیاری است.
- **نحوه استفاده**: روی متدهای `@AutoRestController` یا `@Service` غیرنهایی قرار دهید؛ هنگام خطا کلید آزاد می‌شود.
- **چه زمانی استفاده شود**: برای پرداخت‌ها، انتقال وجه و درخواست‌های POST حساس به ارسال تکراری.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی متدهای GET نگذارید و در چند سرور از Redis `IdempotencyStoreProvider` استفاده کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | خیر (اختیاری) | نام معتبر هدر HTTP (بدون حساسیت به حروف بزرگ و کوچک در شبکه، مانند `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | هدر HTTP حاوی کلید عدم تکرار؛ در نبود آن بررسی رد می‌شود.<br/>*نکته:* کلاینت باید برای هر عملیات یک UUIDv7 یکتا بفرستد و در تلاش مجدد تکرار کند؛ آن را در CORS `allowedHeaders` مجاز کنید. |
| `ttlSeconds` | `long` | `300L` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب ثانیه؛ مانند `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | پنجره زمانی به ثانیه که ارسال مجدد کلید با HTTP 409 رد می‌شود.<br/>*نکته:* مدت نگهداری پاسخ در Redis یا حافظه؛ بر اساس پنجره تلاش مجدد بین `300L` تا `86400L` تنظیم کنید. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: محدودیت نرخ درخواست با پنجره لغزان را به تفکیک IP، کاربر یا مستأجر اعمال می‌کند.
- **رفتار در زمان اجرا**: معیار nwvmc.ratelimit.rejected.total را افزایش داده و با HTTP 429 Too Many Requests پاسخ می‌دهد.
- **نحوه استفاده**: روی رابط کنترلر یا متد قرار دهید؛ `X-RateLimit-Remaining`/`X-RateLimit-Reset` را تنظیم و در عبور از حد `HTTP 429` با `Retry-After` برمی‌گرداند.
- **چه زمانی استفاده شود**: برای حفاظت از جستجوی عمومی، احراز هویت، کوئری هوش مصنوعی و خروجی‌های حجیم.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی health check محدودیت تنگ نگذارید و برای ایزوله‌سازی کاربران یا مستأجران به جای `"GLOBAL"` از `"USER"`، `"TENANT"` یا `"IP"` استفاده کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب درخواست؛ مانند `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | حداکثر تعداد درخواست مجاز در هر بازه زمانی (پیش‌فرض ۶۰).<br/>*نکته:* در صورت بازگشت HTTP `429` هدرهای `X-RateLimit-Remaining`، `X-RateLimit-Reset` و `Retry-After` را ارسال می‌کند. |
| `windowSeconds` | `int` | `60` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب ثانیه؛ مانند `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | مدت بازه زمانی به ثانیه (پیش‌فرض ۶۰).<br/>*نکته:* طول پنجره شمارنده را تعیین کرده و مبنای محاسبه `X-RateLimit-Reset` و `Retry-After` است. |
| `partitionKey` | `String` | `"IP"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | استراتژی دسته‌بندی: "IP"/"clientIp"، "USER" (بازگشت به IP برای کاربران ناشناس)، "TENANT"، "GLOBAL" یا SpEL "#expr".<br/>*نکته:* `"USER"` بر اساس کاربر احراز هویت‌شده تفکیک می‌کند (در حالت ناشناس به IP برمی‌گردد)؛ `"GLOBAL"` سهمیه مشترک سراسری است. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: عملیات را درون مدارشکن Resilience4j با گزارش تله‌متری به Actuator و Micrometer قرار می‌دهد.
- **رفتار در زمان اجرا**: در صورت عبور نرخ خطا از آستانه، به وضعیت OPEN (HTTP 503) می‌رود و سنجنده را به‌روزرسانی می‌کند.
- **نحوه استفاده**: روی کنترلرها یا متدهای متصل به سرویس خارجی یا هوش مصنوعی قرار دهید.
- **چه زمانی استفاده شود**: وقتی باید هنگام خرابی سرویس پایین‌دستی فوراً با `HTTP 409`/`503` متوقف شود نه انتظار timeout.
- **چه زمانی استفاده نشود و دام‌های رایج**: `CircuitBreakerErrorFilterUtil` خطاهای 4xx را خودکار نادیده می‌گیرد؛ خطاهای کلاینت را در `RuntimeException` ساده نپیچید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"payment-gateway-cb"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | نام نمونه CircuitBreaker در Resilience4j.<br/>*نکته:* نام نمونه Resilience4j و برچسب Micrometer را مشخص می‌کند؛ `""` نام کلاس را انتخاب می‌کند. |
| `failureRateThreshold` | `float` | `50.0f` | خیر (اختیاری) | عدد مثبت (`1.0f .. 100.0f`) بر حسب درصد؛ مانند `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | آستانه درصد خطا برای باز شدن مدارشکن (پیش‌فرض 50.0f).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: خطاهای تجاری 4xx به‌طور خودکار نادیده گرفته می‌شوند و فقط خطاهای 5xx یا زیرساخت مدار را باز می‌کنند. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب ثانیه؛ مانند `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | مدت توقف به ثانیه در حالت OPEN پیش از آزمایش HALF_OPEN (پیش‌فرض ۱۰).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: خطاهای تجاری 4xx به‌طور خودکار نادیده گرفته می‌شوند و فقط خطاهای 5xx یا زیرساخت مدار را باز می‌کنند. |
| `slidingWindowSize` | `int` | `20` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب فراخوانی؛ مانند `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | تعداد فراخوانی‌های بررسی‌شده در پنجره لغزان (پیش‌فرض ۲۰).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: خطاهای تجاری 4xx به‌طور خودکار نادیده گرفته می‌شوند و فقط خطاهای 5xx یا زیرساخت مدار را باز می‌کنند. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب فراخوانی؛ مانند `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | تعداد درخواست آزمایشی مجاز در حالت HALF_OPEN برای بازیابی (پیش‌فرض ۵).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: خطاهای تجاری 4xx به‌طور خودکار نادیده گرفته می‌شوند و فقط خطاهای 5xx یا زیرساخت مدار را باز می‌کنند. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: خطاهای موقت را به‌طور خودکار با تاخیر نمایی قابل پیکربندی دوباره تلاش می‌کند.
- **رفتار در زمان اجرا**: در صورت پایان یافتن تمام تلاش‌های پیکربندی‌شده، خطای استاندارد صادر می‌کند.
- **نحوه استفاده**: روی کنترلر یا متد برای بازیابی خودکار خطاهای موقتی شبکه و دیتابیس قرار دهید.
- **چه زمانی استفاده شود**: برای درخواست‌های GET، PUT یا فراخوانی‌های محافظت‌شده با `@Idempotent`.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز روی POST یا پرداخت فاقد `@Idempotent` قرار ندهید (باعث کسر وجه تکراری می‌شود)!

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"erp-sync-retry"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | نام نمونه Retry در Resilience4j.<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: مطمئن شوید مجموع زمان تلاش‌ها کمتر از تایم‌اوت درگاه بالادستی بماند. |
| `maxAttempts` | `int` | `3` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب تلاش؛ مانند `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | تعداد کل تلاش‌ها از جمله اجرای اول (پیش‌فرض ۳).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: مطمئن شوید مجموع زمان تلاش‌ها کمتر از تایم‌اوت درگاه بالادستی بماند. |
| `waitDurationMs` | `long` | `500L` | خیر (اختیاری) | عدد مثبت (`>= 50`) بر حسب میلی‌ثانیه؛ مانند `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | تأخیر اولیه به میلی‌ثانیه پیش از اولین تکرار (پیش‌فرض 500L).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: مطمئن شوید مجموع زمان تلاش‌ها کمتر از تایم‌اوت درگاه بالادستی بماند. |
| `backoffMultiplier` | `double` | `2.0d` | خیر (اختیاری) | عدد مثبت (`>= 1.0d`) بر حسب ضریب افزایش؛ مانند `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | ضریب افزایش نمایی تأخیر بین تکرارها (پیش‌فرض 2.0d).<br/>*نکته:* با دقت متناسب با SLA تاخیر محیط عملیاتی تنظیم کنید: مطمئن شوید مجموع زمان تلاش‌ها کمتر از تایم‌اوت درگاه بالادستی بماند. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **پکیج**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: مقدار ETag ضعیف RFC 7232 (W/"...") را محاسبه کرده و هدر Cache-Control همراه با پاسخ HTTP 304 Not Modified ارسال می‌کند.
- **رفتار در زمان اجرا**: شمارنده‌های HIT/MISS را در معیار nwvmc.cache.http.requests ثبت می‌کند.
- **نحوه استفاده**: روی کنترلر یا متدهای GET برای صدور `ETag`، `Cache-Control` و `304 Not Modified` قرار دهید.
- **چه زمانی استفاده شود**: برای کاتالوگ‌های نیمه‌ایستا و لیست‌های عمومی جهت صرفه‌جویی پهنای باند با `304`.
- **چه زمانی استفاده نشود و دام‌های رایج**: هرگز روی داده‌های شخصی یا چندمستاجره مقدار پیش‌فرض `isPrivate = false` را رها نکنید!

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | خیر (اختیاری) | عدد مثبت (`>= 0`) بر حسب ثانیه؛ مانند `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | مقدار `max-age` در هدر Cache-Control به ثانیه (پیش‌فرض ۶۰).<br/>*نکته:* هدر `Cache-Control: max-age=<N>` را تولید می‌کند؛ مقدار `0` با `generateETag = true` اعتبارسنجی فوری `304` می‌دهد. |
| `isPrivate` | `boolean` | `false` | خیر (اختیاری) | `true` (کش خصوصی مرورگر؛ ممنوع در CDN اشتراکی) یا `false` (کش عمومی قابل ذخیره در پروکسی و CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | در حالت true عبارت `private` و در false عبارت `public` صادر می‌شود.<br/>*نکته:* بسیار مهم: در مسیرهای احراز هویت‌شده یا دارای `@FieldSecurity` همیشه `isPrivate = true` بگذارید تا CDN داده کاربران را قاطی نکند. |
| `mustRevalidate` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | `, must-revalidate` را برای اعتبارسنجی مجدد پس از انقضا اضافه می‌کند.<br/>*نکته:* به کش‌های میانی دستور می‌دهد پس از انقضای `maxAgeSeconds` بدون بررسی مجدد پاسخ قدیمی برنگردانند. |
| `generateETag` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | ETag با SHA-256 تولید و در صورت تطابق `If-None-Match` کد `304` برمی‌گرداند.<br/>*نکته:* مقدار `ETag` مطابق RFC 7232 تولید کرده و در صورت تطابق `If-None-Match` پاسخ ۰ بایتی `304` می‌دهد. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: خروجی متدهای خواندن سمت سرور را در موتورهای Caffeine L1 / Redis L2 کش می‌کند.
- **رفتار در زمان اجرا**: به‌صورت سراسری از طریق app.framework.cache.type قابل پیکربندی است.
- **نحوه استفاده**: روی متدهای خواندن قرار دهید تا بر اساس `app.framework.cache.type` کش شود.
- **چه زمانی استفاده شود**: برای خواندن‌های پرتکرار بر اساس شناسه یا فراداده‌های پایدار.
- **چه زمانی استفاده نشود و دام‌های رایج**: روی جداول با نرخ نوشتن بالا یا موجودیت‌های تغییرپذیر بدون کلون استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | نام کش‌های منطقی در Caffeine یا Redis.<br/>*نکته:* نام نواحی کش باید با تنظیمات Caffeine/Redis منطبق باشد و همراه با `@AutoCacheEvict` در عملیات نوشتن استفاده شود. |
| `key` | `String` | `""` | خیر (اختیاری) | عبارت SpEL با ارجاع به پارامترهای متد (مانند `"'product:' + #id"`) یا `""` برای تولید خودکار کلید.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | عبارت کلید SpEL (نسخه 0.1.0 به صورت قطعی `EntityName:id` را می‌سازد).<br/>*نکته:* در برنامه‌های چندمستأجره حتماً شناسه مستأجر را در کلید کش بگنجانید تا نشت داده رخ ندهد. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: هنگام تغییرات، مدخل‌های قدیمی کش سمت سرور را پاک‌سازی می‌کند.
- **رفتار در زمان اجرا**: پس از تغییر داده به‌صورت تمیز اجرا شده و خوانش کهنه باقی نمی‌گذارد.
- **نحوه استفاده**: روی متدهای ویرایش و حذف هماهنگ با کلید `@AutoCacheable` قرار دهید.
- **چه زمانی استفاده شود**: هر زمان که ویرایش یا حذف روی رکوردهای کش‌شده با `@AutoCacheable` رخ می‌دهد.
- **چه زمانی استفاده نشود و دام‌های رایج**: در متدهای پرکاربرد `create` از `allEntries = true` خودداری کنید (موجب Cache Stampede می‌شود).

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | نام کش‌هایی که پس از اتمام متد پاک می‌شوند.<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `value` پیش از پذیرش ترافیک خطا می‌دهد. |
| `key` | `String` | `""` | خیر (اختیاری) | عبارت SpEL با ارجاع به پارامترهای متد (مانند `"'product:' + #id"`) یا `""` برای تولید خودکار کلید.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | عبارت SpEL برای هدف قرار دادن دقیق رکورد ویرایش‌شده در کش.<br/>*نکته:* باید دقیقاً همان کلید `@AutoCacheable.key` را تولید کند؛ هنگام `allEntries = true` نادیده گرفته می‌شود. |
| `allEntries` | `boolean` | `false` | خیر (اختیاری) | `true` (پاک کردن همه کلیدهای ناحیه کش) یا `false` (حذف تنها یک کلید مشخص‌شده توسط key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | در حالت true فقط کلیدهای با پیشوند همان موجودیت را پاک می‌کند.<br/>*نکته:* پاک کردن کل کش در ترافیک بالا ممکن است فشار ناگهانی به پایگاه‌داده بیاورد؛ تا حد امکان حذف هدفمند با `key` انجام دهید. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **پکیج**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: مدت اجرا را اندازه‌گیری کرده و در فراخوانی‌های کند، گزارش WARN ثبت می‌کند.
- **رفتار در زمان اجرا**: همچنین زمان‌سنج‌های تاخیر را از طریق DynamicEntityMetricsHelper تغذیه می‌کند.
- **نحوه استفاده**: روی کنترلر یا سرویس برای پایش تخلفات SLA قرار دهید.
- **چه زمانی استفاده شود**: برای گزارش‌های پیچیده، دسته‌ای و `@CustomQuery` جهت شناسایی زودهنگام کندی دیتابیس.
- **چه زمانی استفاده نشود و دام‌های رایج**: مقدار `warningThresholdMs = 0` نگذارید و روی استریم طولانی SSE `/events` استفاده نکنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | خیر (اختیاری) | عدد مثبت (`>= 1`) بر حسب میلی‌ثانیه؛ مانند `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | آستانه زمانی به میلی‌ثانیه برای ثبت هشدار کندی اجرا `WARN` (پیش‌فرض 500L).<br/>*نکته:* در صورت عبور از آستانه، لاگ `WARN` همراه `traceId` ثبت می‌کند؛ مقدار منطقی (`200L–1000L`) برای جلوگیری از شلوغی لاگ انتخاب کنید. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **پکیج**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **هدف**: پس از تایید تراکنش، وب‌هوک‌های خروجی امضاشده با HMAC-SHA256 را روی Virtual Threads ارسال می‌کند.
- **رفتار در زمان اجرا**: امضاها را در WebhookHmacSignerHelper محاسبه و برابری را در زمان ثابت بررسی می‌کند.
- **نحوه استفاده**: روی `@Entity` قرار دهید؛ ارسال به صورت غیرهمگام و پس از commit دیتابیس انجام می‌شود.
- **چه زمانی استفاده شود**: برای اطلاع‌رسانی آنی و امضاشده به شرکای بیرونی پس از ثبت نهایی سفارش یا پرداخت.
- **چه زمانی استفاده نشود و دام‌های رایج**: در صورت وجود داده محرمانه `includeFullPayload = false` بگذارید و از URLهای داخلی SSRF پرهیز کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | خیر (اختیاری) | آرایه‌ای از صفر یا چند مقدار معتبر: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | رویدادهای چرخه حیات برای ارسال وب‌هوک با امضای HMAC.<br/>*نکته:* به‌صورت غیرهمزمان پس از commit (`AFTER_COMMIT`) ارسال می‌شود تا تراکنش‌های برگشتی وب‌هوک اشتباه نفرستند. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | خیر (اختیاری) | نام معتبر هدر HTTP (بدون حساسیت به حروف بزرگ و کوچک در شبکه، مانند `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | هدر HTTP حاوی امضای HMAC-SHA256.<br/>*نکته:* امضای HMAC-SHA256 را حمل می‌کند؛ گیرنده باید پیش از پردازش آن را در زمان ثابت بررسی کند. |
| `includeFullPayload` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@EntityWebhook(includeFullPayload = false)` | در حالت true کل JSON و در false فقط شناسه و متادیتای رویداد ارسال می‌شود.<br/>*نکته:* برای داده‌های حساس یا مالی `false` بگذارید (فقط شناسه و نوع رویداد) تا مشترک با GET احراز هویت‌شده داده را بگیرد. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **پکیج**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: پاکت‌های استاندارد CNCF CloudEvents v1.0 را پس از تایید تراکنش منتشر می‌کند.
- **رفتار در زمان اجرا**: از TransactionRuntimeBridge.executeAfterCommit پیروی می‌کند تا از انتشار رویدادهای کاذب جلوگیری شود.
- **نحوه استفاده**: روی موجودیت یا متد قرار دهید و بعد از commit رویداد `CloudEventEnvelopeDto` را دریافت کنید.
- **چه زمانی استفاده شود**: برای ارتباط رویدادمحور بین Bounded Contextها بدون نیاز به JOIN مشترک.
- **چه زمانی استفاده نشود و دام‌های رایج**: با `@EntityWebhook` اشتباه نگیرید و حتماً در فاز `AFTER_COMMIT` پردازش کنید.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | خیر (اختیاری) | رشته شناسه غیرخالی (مانند `"com.acme.order.lifecycle"`)؛ برای استفاده از قرارداد پیش‌فرض `""` بگذارید.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | نوع رویداد استاندارد CNCF CloudEvents.<br/>*نکته:* از قالب reverse-DNS استاندارد CloudEvents 1.0 (`com.company.domain.event`) پیروی کنید؛ `""` خودکار تولید می‌شود. |
| `source` | `String` | `""` | خیر (اختیاری) | مسیر HTTP معتبر با شروع `/` (مانند `/services/order-api`) یا رشته خالی `""` برای استخراج خودکار.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI مبدا CloudEvents برای شناسایی دامنه ارسال‌کننده.<br/>*نکته:* ویژگی URI `source` استاندارد CNCF CloudEvents را برای ردیابی بین میکروسرویس‌ها پر می‌کند. |
| `publishOnCreate` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | انتشار CloudEvent پس از ایجاد رکورد (پیش‌فرض true).<br/>*نکته:* فقط پس از commit (`AFTER_COMMIT`) از طریق Spring Events / Kafka / RabbitMQ منتشر می‌شود. |
| `publishOnUpdate` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | انتشار CloudEvent پس از به‌روزرسانی رکورد (پیش‌فرض true).<br/>*نکته:* برای موجودیت‌های پرنوسان `false` بگذارید تا صف پیام پر نشود. |
| `publishOnDelete` | `boolean` | `true` | خیر (اختیاری) | `true` (فعال) یا `false` (غیرفعال).<br/>`@PublishCloudEvent(publishOnDelete = true)` | انتشار CloudEvent پس از حذف رکورد (پیش‌فرض true).<br/>*نکته:* هم در حذف فیزیکی و هم `@SoftDelete` فعال می‌شود تا مدل‌های خواندنی هماهنگ بمانند. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **پکیج**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: عملیات موجودیت یا پرس‌وجو را به یک کلید منبع داده منطقی متصل می‌کند.
- **رفتار در زمان اجرا**: تعداد مسیریابی‌ها را در معیار framework.datasource.routing.total ثبت می‌کند.
- **نحوه استفاده**: روی کنترلر یا متد سرویس غیرنهایی قرار دهید؛ پس از خروج وضعیت قبلی بازیابی می‌شود.
- **چه زمانی استفاده شود**: برای انتقال خواندن‌های سنگین و گزارش‌های BI به سرور خواندنی `REPLICA`.
- **چه زمانی استفاده نشود و دام‌های رایج**: در میانه یک تراکنش `@Transactional` باز دیتاسورس را تغییر ندهید و روی کلاس `final` نگذارید!

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | کلید مسیریابی دیتاسورس در `DataSourceContextHolder` ("PRIMARY" یا "REPLICA").<br/>*نکته:* باید با کلید ثبت‌شده در `DynamicRoutingDataSource` مطابقت داشته باشد؛ کلید ناشناس به `PRIMARY` برمی‌گردد. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **پکیج**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **هدف**: خانواده موتور پایگاه داده و شارد خوشه منطقی را برای هر موجودیت تعیین می‌کند.
- **رفتار در زمان اجرا**: به‌صورت پویا توسط MultiPlatformDataSourceRegistryHelper و TenantDatabaseRoutingResolverHelper مسیریابی می‌شود.
- **نحوه استفاده**: روی موجودیت‌های JPA یا متدها برای اعلان موتور و خوشه دیتابیس هدف قرار دهید.
- **چه زمانی استفاده شود**: در معماری‌های چنددیتابیسی با خوشه‌های مجزای مالی، تحلیلی و ممیزی.
- **چه زمانی استفاده نشود و دام‌های رایج**: جایگزین تنظیمات JDBC واقعی نیست و بین موجودیت‌های دو خوشه متفاوت JOIN مجاز نیست.

| ویژگی | نوع Java | مقدار پیش‌فرض | اجباری | مقادیر مجاز و مثال | توضیحات و نکات زمان اجرا |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | شناسه موتور دیتابیس هدف ("H2"، "POSTGRESQL"، "MYSQL"، "ORACLE").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `platform` پیش از پذیرش ترافیک خطا می‌دهد. |
| `cluster` | `String` | `"PRIMARY"` | خیر (اختیاری) | یکی از مقادیر پشتیبانی‌شده: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | نام خوشه یا شارد هدف ("PRIMARY"، "FINANCE_CLUSTER"، "ANALYTICS_CLUSTER").<br/>*نکته:* در هنگام راه‌اندازی برنامه بررسی می‌شود؛ غلط املایی یا مقدار نامعتبر `cluster` پیش از پذیرش ترافیک خطا می‌دهد. |
| `readOnly` | `boolean` | `false` | خیر (اختیاری) | `true` (مسیریابی به استخر نسخه فقط خواندنی) یا `false` (مسیریابی به استخر اصلی خواندن و نوشتن).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | در حالت true اولویت مسیریابی به سرور خواندنی را نشان می‌دهد.<br/>*نکته:* هرگز روی عملیات نوشتن `readOnly = true` نگذارید؛ نسخه‌های فقط خواندنی تغییرات را رد می‌کنند. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
