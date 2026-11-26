# 06. المواصفات الكاملة لجميع الـ 60 تعليقًا توضيحيًا تصريحيًا (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل (EN)](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#annotations)

مرجع تقني شامل لجميع **الـ 60 تعليقًا توضيحيًا تصريحيًا** في `io.github.natswarchuan:spring-nwvmc:0.1.0` المستخرجة مباشرة من شيفرة Java `@interface`: الحزمة الدقيقة، `@Target`، **كل خاصية**، نوع Java، القيمة الافتراضية، حالة الإلزام/الاختيار، **كيفية الاستخدام**، **متى يُستخدم**، **متى لا يُستخدم والمخاطر الشائعة**، مع أمثلة Java موثقة.

## الفهرس السريع (60 تعليقًا توضيحيًا)

| التعليق التوضيحي | الفئة | `@Target` | ملخص الخصائص | الغرض الأساسي |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | يحوّل واجهة تمتد من AutoApiController<E> إلى وكيل ديناميكي JDK يسجّل 40 عقداً (38 ظاهرة افتراضياً في Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | يعيد توجيه دالة متحكم واحدة نحو دالة Bean مخصصة في Spring عبر MethodHandleCacheUtil بدلاً من CRUD الديناميكي. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | يربط مسارات سير العمل المخصصة (الدفع، الاسترداد، الموافقة) بـ Spring @Component Helper مستقلة. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | بديل Java نقي لـ @GetMapping بدون أي استيرادات ثابتة من Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | إعلان مسار HTTP POST بلغة Java النقية مع دعم أنواع الوسائط consumes وproduces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | ربط مسار HTTP PUT بلغة Java النقية لاستبدال الموارد بالكامل. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | إعلان HTTP PATCH بلغة Java النقية يدعم الدمج الجزئي والزيادة الذرية وRFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | إعلان HTTP DELETE بلغة Java النقية يطلق الحذف المنطقي المحمي بالحالة. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | يربط معاملات استعلام الرابط أو خرائط التصفية الديناميكية Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | يربط متغيرات مسار URI مثل معرّفات الكيانات UUIDv7. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | يفك تسلسل حمولات طلبات HTTP JSON إلى معاملات DTO أو Entity مقترنة بـ @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | يسمح بالتنقل المتداخل عبر العلاقات الفرعية من خلال GET /{id}/{relation}/** مع منع الحلقات الدائرية. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | يعلن انتقالات حالة المجال أو التعديلات الرقمية التصريحية على دوال الإجراءات المخصصة. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | علامة مكون للإطار تُسجَّل عند الإقلاع دون استيراد @Component وقت التصريف. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | علامة طبقة الخدمة لفئات ServiceImpl المقترنة مع @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | يعلن دوال مصانع Beans مُدارة داخل فئات @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | يحدد فئات التهيئة ونماذج ربط خصائص YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | يتحكم في ترتيب أولوية التنفيذ بين وحدات SPI Customizer وسلاسل المرشحات. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | يفرض صلاحيات RBAC، وعزل السجلات عبر ownerField، ورموز الأذونات قبل الاستعلام أو التعديل. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | يحجب أو يفرغ الأعمدة الحساسة ديناميكياً عند نقص صلاحيات الدور. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | يفرض انتقالات الحالة المسموحة عبر POST /{id}/transition ويقصر DELETE /{id} على deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | يترجم بنود السياسات المقروءة إلى قواعد RBAC والانتقالات والحجب الفعالة. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | يسجل الفروقات الحقلية عبر التعديلات لدعم إعادة البناء الزمني وفحص /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | يعزل استعلامات وتعديلات الصفوف تلقائياً حسب سياق المستأجر النشط ما لم يحمل الدور استثناءً. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(تعليق وسم — بدون خصائص)` | يتحقق من تفرد الحقل قبل الحفظ عند الإنشاء والتحديث والإدراج-أو-التحديث. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (مطلوب)` | يولّد تلقائياً رموز عمل فريدة ببادئة عند الإنشاء أو النسخ إذا تُركت فارغة. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (مطلوب)` | ينشئ تلقائياً معرفات روابط ASCII قياسية من حقل sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | يحسب المجاميع الرقمية المشتقة بدقة قبل حفظ تغييرات الكيان. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | يتيح ربط استعلامات SQL/JPQL مخصصة أو دوال مزوّد بنقاط نهاية المتحكم. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | يحدد كيان JPA كجدول كتالوج الأدوار النشط لنظام RBAC في قاعدة البيانات. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط عمود رمز الدور الفريد داخل كيان @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يحدد حقل اسم العرض المقروء للدور في @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يحدد الحقل الذي يحتوي على رموز الأذونات الممنوحة (كمجموعة أو نص CSV) في كيان الدور. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | يحدد كيان JPA لتخزين أذونات الموارد والإجراءات وقواعد إخفاء الحقول الديناميكية. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يحدد حقل معرّف الإذن الفريد داخل @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط اسم الكيان الهدف أو مورد API (أو الرمز العام *) داخل @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط فعل العملية المنطقي (CRUD أو مخصص) المحمي بقاعدة @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يعلن أسماء الحقول المفصولة بفواصل الواجب حجبها ديناميكياً عند تطابق قاعدة الإذن هذه. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | يربط كيان JPA المسؤول عن إسناد أدوار قاعدة البيانات للمستخدمين مع نطاق المستأجر الاختياري. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يحدد حقل اسم المستخدم أو معرّف الـ Subject في @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط عمود رمز الدور المسند داخل @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يُخصص إسناد الدور في @SecurityUserRoleEntity لمعرّف مستأجر محدد (أو * للجميع). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | يحدد كيان JPA لتخزين سياسات التفويض الصريحة ALLOW وDENY مرتبة حسب الأولوية priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط نمط معرّف المورد الهدف داخل @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط فعل العملية المحمي (READ أو WRITE أو DELETE أو *) داخل @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يربط قائمة الأدوار (مجموعة أو مفصولة بفواصل) المشمولة بقاعدة @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(تعليق وسم — بدون خصائص)` | يحدد نتيجة قرار السياسة (ALLOW أو DENY) في قاعدة @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | ينسّق الوصول المتزامن لمفاتيح SpEL المخزنة (الافتراضي waitTimeMs=3000L وleaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | يمنع عمليات الكتابة المكررة المتزامنة أو المعاد إرسالها ضمن نوافذ TTL قابلة للضبط. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | يفرض تحديد معدل الطلبات بنافذة منزلقة لكل عنوان IP أو مستخدم أو مستأجر. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | يغلف العمليات بقواطع الدائرة Resilience4j مع إرسال القياسات إلى Actuator وMicrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | يعيد تلقائياً محاولة الإخفاقات المؤقتة بتراجع أسي قابل للضبط. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | يحسب وسوم ETag الضعيفة RFC 7232 (W/"...") ويصدر ترويسات Cache-Control واستجابات HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | يخزن نتائج دوال القراءة الخادمية مؤقتاً في محركات Caffeine L1 وRedis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | يزيل مدخلات الذاكرة المؤقتة القديمة على الخادم عند حدوث التعديلات. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | يقيس مدة التنفيذ ويصدر سجلات WARN عندما تتجاوز الاستدعاءات البطيئة الحد. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | يرسل إشعارات Webhook موقعة بـ HMAC-SHA256 غير متزامنة على Virtual Threads بعد الاعتماد. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | ينشر مغلفات CNCF CloudEvents v1.0 بعد اعتماد المعاملة. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | يربط عمليات الكيان أو الاستعلام بمفتاح مصدر بيانات منطقي محدد. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | يعيّن عائلة محرك قاعدة البيانات وقطعة العنقود المنطقية لكل كيان. |

---

## 1. التوجيه وعقود API الديناميكية وفصل DTO وربط المعاملات (13 تعليقًا توضيحيًا)

### `@AutoRestController`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **الغرض**: يحوّل واجهة تمتد من AutoApiController<E> إلى وكيل ديناميكي JDK يسجّل 40 عقداً (38 ظاهرة افتراضياً في Swagger UI).
- **السلوك وقت التشغيل**: يفحص DynamicControllerProxyRegistrarHelper المتحكمات عند الإقلاع ويسجّل المسارات في RequestMappingHandlerMapping.
- **كيفية الاستخدام**: ضع `@AutoRestController(basePath = "/api/v1/...")` على واجهة Java تمتد من `AutoApiController<E>` أو `AutoReadApi<E>` وحدد `disabledEndpoints` وDTOs.
- **متى يُستخدم**: استخدمه عند الرغبة في نشر نقاط نهاية CRUD أو بحث أو قراءة فقط لأي كيان JPA دون كتابة شيفرة متكررة.
- **متى لا يُستخدم والمحاذير**: لا تضعه على فئة `@RestController` ملموسة أو مهام بلا كيان JPA؛ وللقراءة فقط استخدم `AutoReadApi<E>` بدلاً من فتح جميع عقود `AutoApiController<E>`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | لا (اختياري) | مسار HTTP صالح يبدأ بـ `/` (مثل `/api/v1/product-catalogs`) أو سلسلة فارغة `""` للاشتقاق التلقائي.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | مسار URI الجذري الصريح (مثل "/api/v1/product-catalogs"). عند تركه فارغاً يُشتق بصيغة الجمع kebab-case.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `basePath` قبل `path`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `path` | `String` | `""` | لا (اختياري) | مسار HTTP صالح يبدأ بـ `/` (مثل `/api/v1/orders`) أو سلسلة فارغة `""` للاشتقاق التلقائي.<br/>`@AutoRestController(path = "/api/v1/orders")` | اسم بديل لمسار الجذر. يُفضّل استخدام basePath لأن المُسجّل يقرؤه أولاً.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `basePath` قبل `path`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `entityName` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"ProductCatalog"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoRestController(entityName = "ProductCatalog")` | يتجاوز اسم الكيان المعروض في بيانات OpenAPI وStudio بدلاً من اسم النوع E.<br/>*تنبيه:* يظهر مباشرة في وثائق Swagger / OpenAPI 3.0 وNWVMC Studio؛ استخرج النصوص إلى `OpenApiConstant` لتفادي النصوص الثابتة. |
| `enabledEndpoints` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | قائمة بيضاء لأسماء دوال العقد المسموح بها (مثل "getPage" و"create"). الفراغ يعني تفعيل الكل.<br/>*تنبيه:* يعمل كقائمة بيضاء صارمة: عند عدم فراغها، تُستبعد كل دالة غير مذكورة من Spring MVC وSwagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | قائمة سوداء لتعطيل دوال محددة من AutoApiController قبل تسجيل المسارات.<br/>*تنبيه:* يُقيّم بعد `enabledEndpoints`؛ مناسب لتعطيل مسارات الحذف أو الاستيراد الجماعي مع إبقاء بقية العقود الأربعين. |
| `enableNestedSubResources` | `boolean` | `false` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | يفعّل التنقل المتداخل GET /{id}/**. القيمة الافتراضية false لمنع تضخم المسارات.<br/>*تنبيه:* أبقه `false` ما لم تحتج للتنقل المتداخل `GET /{id}/items/...`؛ وعند التفعيل قيّد العلاقات عبر `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | لا (اختياري) | أي فئة Java فعلية (مثل `ProductReadDto.class`) أو `Void.class` لتعطيل تحويل DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | كائن DTO اختياري للقراءة يخفي الحقول الداخلية للكيان؛ عند Void.class يُرجع الكيان نفسه.<br/>*تنبيه:* يُطبّق فقط على مسار القراءة (GET)؛ تتطلب فئة DTO بانياً افتراضياً وخصائص قياسية وتدعم `@Valid` و`@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | لا (اختياري) | أي فئة Java فعلية (مثل `ProductCreateDto.class`) أو `Void.class` لتعطيل تحويل DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | كائن DTO اختياري للإنشاء يتم التحقق منه عبر Jakarta Validation قبل التحويل إلى الكيان في POST.<br/>*تنبيه:* يُطبّق فقط على مسار الإنشاء (POST)؛ تتطلب فئة DTO بانياً افتراضياً وخصائص قياسية وتدعم `@Valid` و`@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | لا (اختياري) | أي فئة Java فعلية (مثل `ProductUpdateDto.class`) أو `Void.class` لتعطيل تحويل DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | كائن DTO اختياري للتحديث يقيد الحقول القابلة للتعديل ويشغل التحقق في PUT وPATCH.<br/>*تنبيه:* يُطبّق فقط على مسار التحديث (PUT/PATCH)؛ تتطلب فئة DTO بانياً افتراضياً وخصائص قياسية وتدعم `@Valid` و`@FieldSecurity`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يعيد توجيه دالة متحكم واحدة نحو دالة Bean مخصصة في Spring عبر MethodHandleCacheUtil بدلاً من CRUD الديناميكي.
- **السلوك وقت التشغيل**: يحدد EscapeHatchDispatchHelper الـ Bean الهدف ويخزن MethodHandle مؤقتاً في MethodHandleCacheUtil.
- **كيفية الاستخدام**: ضع `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` على دالة بالمتحكم مع تعريف الفئة الهدف كـ `@Service` أو `@Component`.
- **متى يُستخدم**: استخدمه عندما تكفي معظم المسارات التلقائية، باستثناء مسار واحد يتطلب شيفرة Java مخصصة أو تنسيقاً معقداً.
- **متى لا يُستخدم والمحاذير**: لا تكتب `targetBean` كنص (يتطلب `Class<?>`؛ واستخدم `beanName` للنصوص)، وتجنبه إن كانت القواعد التصريحية كافية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | لا (اختياري) | فئة Spring Bean فعلية مثل `@Service`/`@Component` (مثل `OrderCustomService.class`)، أو `Void.class` للبحث عبر `beanName`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | فئة Spring Bean المستهدفة (لها الأولوية على beanName).<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `targetBean` قبل `beanName`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `beanName` | `String` | `""` | لا (اختياري) | الاسم الدقيق للـ Bean المسجل في ApplicationContext (مثل `"orderCustomService"`) أو `""` للحل التلقائي.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | اسم Bean الصريح في حاوية Spring عند ترك targetBean كـ Void.class.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `targetBean` قبل `beanName`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `methodName` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"createOrder"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | اسم الدالة على الـ Bean الهدف؛ وإذا كان فارغاً يطابق اسم الدالة على واجهة المتحكم.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"createOrder"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `bypassAutoDispatch` | `boolean` | `true` | لا (اختياري) | `true` (افتراضي — تفعيل التجاوز واستدعاء الـ Bean الهدف) أو `false` (تعطيل التجاوز والعودة إلى CRUD الافتراضي).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | عند true يتجاوز التوجيه التلقائي لـ CRUD وينفذ دالة الـ Bean عبر MethodHandleCacheUtil.<br/>*تنبيه:* عند `true` ينفذ `EscapeHatchDispatchHelper` الـ Bean الخاص بك؛ أما `false` فيعطّل `@ServiceOverride` تمامًا لتشغيل CRUD الافتراضي (وليس خطافًا قبل/بعد). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: يربط مسارات سير العمل المخصصة (الدفع، الاسترداد، الموافقة) بـ Spring @Component Helper مستقلة.
- **السلوك وقت التشغيل**: يستدعي delegateBean.delegateMethod عبر MethodHandle مخزن مؤقتاً مع تحقق ومعاملة متكاملة.
- **كيفية الاستخدام**: عرّف دالة بالمتحكم مع `path` و`httpMethod` و`delegateBean` و`delegateMethod` لتفويض المهمة إلى Bean مستقل.
- **متى يُستخدم**: استخدمه لإجراءات المجال المتخصصة مثل الدفع والاسترداد والموافقات والمعاملات متعددة الكيانات.
- **متى لا يُستخدم والمحاذير**: لا تعتمد على معترضات الوكيل هنا لأن `@CustomEndpoint` يمر مباشرة قبل `invokeProtectedOperation`؛ ضع الأمان داخل `@Service` المفوَّض وتجنب تكرار `@BusinessAction`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/reports/monthly-sales`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | المسار الفرعي نسبةً إلى basePath للمتحكم (مثل "/checkout").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `path` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `httpMethod` | `String` | `"GET"` | لا (اختياري) | إحدى القيم المدعومة التالية: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | فعل HTTP المطلوب ("GET" أو "POST" أو "PUT" أو "PATCH" أو "DELETE").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `httpMethod` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `delegateBean` | `String` | `""` | لا (اختياري) | الاسم الدقيق للـ Bean المسجل في ApplicationContext (مثل `"orderReportService"`) أو `""` للحل التلقائي.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | اسم Spring Bean الذي ينفذ منطق سير العمل (مطلوب ما لم توجد دالة default أو @ServiceOverride).<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `delegateBean` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `delegateMethod` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"buildMonthlyReport"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | اسم الدالة على delegateBean؛ الافتراضي نفس اسم دالة المتحكم.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"buildMonthlyReport"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `summary` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"Get monthly revenue breakdown"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | ملخص قصير لعملية OpenAPI 3.0 يظهر في Swagger UI.<br/>*تنبيه:* يظهر مباشرة في وثائق Swagger / OpenAPI 3.0 وNWVMC Studio؛ استخرج النصوص إلى `OpenApiConstant` لتفادي النصوص الثابتة. |
| `description` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"Aggregates confirmed invoice totals grouped by currency"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | وصف تفصيلي لـ OpenAPI 3.0 يظهر عند توسيع المسار في Swagger UI.<br/>*تنبيه:* يظهر مباشرة في وثائق Swagger / OpenAPI 3.0 وNWVMC Studio؛ استخرج النصوص إلى `OpenApiConstant` لتفادي النصوص الثابتة. |

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

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: بديل Java نقي لـ @GetMapping بدون أي استيرادات ثابتة من Spring Web.
- **السلوك وقت التشغيل**: يُربط مع RequestMappingInfo لطلبات HTTP GET عند إقلاع الوكيل.
- **كيفية الاستخدام**: ضع `@AutoGet("/your-path")` على دالة داخل واجهة `@AutoRestController` مع `@ServiceOverride` أو `@CustomQuery`.
- **متى يُستخدم**: استخدمه لتعريف مسارات GET للقراءة فقط داخل واجهات Java خالصة دون استيراد `@GetMapping`.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه لعمليات تعديل البيانات (استخدم `@AutoPost` أو `@AutoDelete`) ولا على فئات `@RestController` العادية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/{id}/summary`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@AutoGet("/{id}/summary")` | قالب مسار GET الفرعي (مثل "/metrics"). فارغ يعني المسار الأساسي مباشرة.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `produces` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json", "text/csv"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | أنواع الوسائط المُنتجة اختيارياً (مثل "text/event-stream" أو "text/csv").<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Accept`؛ عدم التطابق يعيد `406` أو `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: إعلان مسار HTTP POST بلغة Java النقية مع دعم أنواع الوسائط consumes وproduces.
- **السلوك وقت التشغيل**: يُسجل كمعالج HTTP POST في SpringMvcEndpointBridge.
- **كيفية الاستخدام**: ضع `@AutoPost("/path")` على دالة إنشاء أو إجراء داخل المتحكم واربط الحمولة بـ `@AutoBody` أو `@RequestBody` مع `@BusinessAction` أو `@ServiceOverride`.
- **متى يُستخدم**: استخدمه لنقاط الإنشاء أو الأوامر أو الإرسال الجماعي في واجهات Java خالصة.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه للقراءة (`@AutoGet`) أو التحديث الكامل (`@AutoPut`) أو الحذف (`@AutoDelete`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/{id}/approve`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@AutoPost("/{id}/approve")` | مسار POST الفرعي نسبةً إلى basePath.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `consumes` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json", "multipart/form-data"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | أنواع Content-Type المقبولة في الطلب.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Content-Type`؛ عدم التطابق يعيد `406` أو `415`. |
| `produces` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | أنواع الوسائط الناتجة في الاستجابة.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Accept`؛ عدم التطابق يعيد `406` أو `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: ربط مسار HTTP PUT بلغة Java النقية لاستبدال الموارد بالكامل.
- **السلوك وقت التشغيل**: مرتبط كمعالج HTTP PUT مغلف بتنفيذ معاملاتي كامل.
- **كيفية الاستخدام**: ضع `@AutoPut("/{id}")` على دالة الاستبدال الكامل مع `@AutoVariable` و`@AutoBody`.
- **متى يُستخدم**: استخدمه للاستبدال الكامل المتكرر بأمان الذي يتوقع حمولة الحالة الكاملة.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه للتعديلات الجزئية لحقل واحد (استخدم `@AutoPatch` أو `@BusinessAction`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/{id}/replace`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@AutoPut("/{id}/replace")` | قالب مسار PUT الفرعي (مثل "/{id}").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `consumes` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | أنواع Content-Type المدعومة.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Content-Type`؛ عدم التطابق يعيد `406` أو `415`. |
| `produces` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | أنواع الوسائط الناتجة.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Accept`؛ عدم التطابق يعيد `406` أو `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: إعلان HTTP PATCH بلغة Java النقية يدعم الدمج الجزئي والزيادة الذرية وRFC 6902 JSON Patch.
- **السلوك وقت التشغيل**: يدعم دلالات دمج JSON ونوع المحتوى application/json-patch+json.
- **كيفية الاستخدام**: ضع `@AutoPatch("/{id}/action")` على دوال التحديث الجزئي أو `@BusinessAction`.
- **متى يُستخدم**: استخدمه للتعديلات الجزئية والعدادات الذرية وانتقالات الحالة.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه للاستبدال الكامل (`@AutoPut`) أو الإنشاء (`@AutoPost`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/{id}/status`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@AutoPatch("/{id}/status")` | قالب مسار PATCH الفرعي (مثل "/{id}/approve").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `consumes` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json", "application/merge-patch+json"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | أنواع Content-Type المقبولة.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Content-Type`؛ عدم التطابق يعيد `406` أو `415`. |
| `produces` | `String[]` | `{}` | لا (اختياري) | مصفوفة أنواع MIME (مثل `{"application/json"}`)؛ المصفوفة الفارغة `{}` تعتمد `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | أنواع الوسائط الناتجة.<br/>*تنبيه:* يُطبّق عبر تفاوض المحتوى في Spring MVC على ترويسة `Accept`؛ عدم التطابق يعيد `406` أو `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: إعلان HTTP DELETE بلغة Java النقية يطلق الحذف المنطقي المحمي بالحالة.
- **السلوك وقت التشغيل**: يتحقق من deletableStates في @StateMachine قبل تعيين deleted=true.
- **كيفية الاستخدام**: ضع `@AutoDelete("/{id}/custom")` على دوال الحذف المخصصة غالباً مع `@ServiceOverride`.
- **متى يُستخدم**: استخدمه للأرشفة المخصصة أو التنظيف المتسلسل عبر DELETE.
- **متى لا يُستخدم والمحاذير**: لا تعد تعريف الحذف إن كان الحذف اللين المدمج و`@StateMachine` يكفيان.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | مسار فرعي نسبي يدعم متغيرات `{pathVar}` (مثل `/{id}/archive`)؛ القيمة `""` ترتبط بالمسار الجذري.<br/>`@AutoDelete("/{id}/archive")` | قالب مسار DELETE الفرعي (مثل "/{id}/purge").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **الغرض**: يربط معاملات استعلام الرابط أو خرائط التصفية الديناميكية Map<String, String>.
- **السلوك وقت التشغيل**: يُستخرج عبر DynamicQueryParameterParserHelper مع التحقق بواسطة QueryGuardrailEnforcerUtil.
- **كيفية الاستخدام**: ضعه على معاملات الدوال في الواجهة مثل `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")`.
- **متى يُستخدم**: استخدمه للحفاظ على واجهات Java خالصة 100% دون استيراد Spring Web لربط معاملات الاستعلام.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه لمتغيرات المسار (`@AutoVariable`) أو جسم JSON (`@AutoBody`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"status"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoParam("status") String status` | اسم معامل الاستعلام المراد ربطه (مرادف لـ name). الفارغ يستخدم اسم المعامل في Java.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `value` قبل `name`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `name` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"pageSize"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | الاسم الصريح لمعامل الاستعلام.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `value` قبل `name`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `required` | `boolean` | `true` | لا (اختياري) | `true` (إلزامي؛ غيابه يعيد HTTP 400) أو `false` (اختياري؛ يُمرر null عند الغياب).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | يحدد ما إذا كان غياب المعامل يسبب HTTP 400.<br/>*تنبيه:* يصبح اختيارياً تلقائياً عند تحديد `defaultValue`؛ استخدم الأنواع المغلفة (`Integer`) بدلاً من الأولية عند ضبطه على `false`. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"20"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | قيمة احتياطية عند غياب المعامل؛ الافتراضي DEFAULT_NONE (بلا قيمة افتراضية).<br/>*تنبيه:* يُحوّل من نص عبر Spring `ConversionService` إلى نوع المعامل؛ القيم غير القابلة للتحويل تعيد HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **الغرض**: يربط متغيرات مسار URI مثل معرّفات الكيانات UUIDv7.
- **السلوك وقت التشغيل**: يُحلل إلى قيم Java UUID/String محكومة النوع من قوالب مسار MVC.
- **كيفية الاستخدام**: ضعه على معاملات معرف المسار مثل `findById(@AutoVariable("id") UUID id)`.
- **متى يُستخدم**: لاستخراج `{id}` أو `{slug}` أو `{code}` من المسار في واجهات Java خالصة.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه لمعاملات الاستعلام (`@AutoParam`) أو JSON (`@AutoBody`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"orderId"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoVariable("orderId") UUID orderId` | اسم متغير مسار URI المراد ربطه.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `value` قبل `name`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `name` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"tenantCode"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | الاسم الصريح لمتغير المسار.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `value` قبل `name`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `required` | `boolean` | `true` | لا (اختياري) | `true` (إلزامي؛ غيابه يعيد HTTP 400) أو `false` (اختياري؛ يُمرر null عند الغياب).<br/>`@AutoVariable(name = "id", required = true) UUID id` | يحدد إلزامية وجود متغير المسار.<br/>*تنبيه:* يجب أن يطابق `{variableName}` في قالب المسار؛ يُستخدم `false` فقط عند وجود أنماط مسار اختيارية. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **الغرض**: يفك تسلسل حمولات طلبات HTTP JSON إلى معاملات DTO أو Entity مقترنة بـ @Valid.
- **السلوك وقت التشغيل**: يتم التحقق منه عبر LocalValidatorFactoryBean قبل دخول معاملة الخدمة.
- **كيفية الاستخدام**: ضع `@AutoBody` على معامل الحمولة في دوال `@AutoPost` و`@AutoPut` مع `@Valid`.
- **متى يُستخدم**: عند فك تسلسل حمولات JSON إلى كيانات أو DTOs في المتحكمات الديناميكية.
- **متى لا يُستخدم والمحاذير**: لا تضعه على دوال GET أو DELETE بدون جسم طلب، ولا تكرره مرتين في نفس الدالة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | لا (اختياري) | `true` (إلزامي؛ غيابه يعيد HTTP 400) أو `false` (اختياري؛ يُمرر null عند الغياب).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | يحدد ما إذا كان غياب جسم الطلب يطلق خطأ HTTP 400.<br/>*تنبيه:* ادمجها مع `@Valid` لتفعيل التحقق قبل التوجيه؛ ضبط `false` يسمح بطلب فارغ دون خطأ `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يسمح بالتنقل المتداخل عبر العلاقات الفرعية من خلال GET /{id}/{relation}/** مع منع الحلقات الدائرية.
- **السلوك وقت التشغيل**: يتطلب تفعيل @AutoRestController(enableNestedSubResources = true) على المتحكم.
- **كيفية الاستخدام**: فعّل `enableNestedSubResources = true` على المتحكم وقيد العلاقات بـ `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **متى يُستخدم**: عند الحاجة لمسارات متداخلة مثل `GET /api/v1/customer-orders/{id}/items` مع فرض الصلاحيات في كل مرحلة.
- **متى لا يُستخدم والمحاذير**: لا تفتحه دون تقييد `allowedRelationships` على الجداول الكثيفة أو عبر حدود السياقات المنفصلة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | قائمة بيضاء اختيارية لفئات الكيانات المسموح بالوصول إليها عبر GET /{id}/**.<br/>*تنبيه:* المصفوفة الفارغة تتيح كل الكيانات الفرعية؛ حدّد الفئات صراحة لمنع كشف الجداول الداخلية. |
| `allowedRelationships` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | أسماء علاقات JPA المسموح بها في مسارات الموارد الفرعية (مثل "items").<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"items"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: يعلن انتقالات حالة المجال أو التعديلات الرقمية التصريحية على دوال الإجراءات المخصصة.
- **السلوك وقت التشغيل**: يُنفذ ذرياً قبل حفظ خصائص الكيان المحدثة.
- **كيفية الاستخدام**: ادمج `@AutoPatch` مع `@BusinessAction(...)` على دالة بالمتحكم لتنفيذها تلقائياً ضمن معاملة.
- **متى يُستخدم**: لانتقالات الحالة الفردية والتعديلات الرقمية أو استدعاء دوال الكيان دون كتابة Service.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه للتنسيق بين عدة كيانات أو استدعاء APIs خارجية (استخدم `@ServiceOverride`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل حالة دورة الحياة (مثل `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | اسم حقل الحالة في الكيان (يُتحقق منه عبر @StateMachine إن وُجد).<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"status"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `targetStateValue` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"APPROVED"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | قيمة الحالة المستهدفة لتعيينها داخل المعاملة.<br/>*تنبيه:* يُتحقق منه تلقائياً وفق `@StateMachine` أو `@HumanPolicy` قبل الحفظ؛ أي انتقال غير قانوني يُلغى فوراً. |
| `adjustNumericField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل رقمي (مثل `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | اسم الحقل الرقمي المراد زيادته أو إنقاصه ذرياً.<br/>*تنبيه:* يتطلب تحديد `deltaParamIndex >= 0` أو `fixedDelta` غير فارغ. يدعم `Integer` و`Long` و`BigDecimal` و`Double`. |
| `deltaParamIndex` | `int` | `-1` | لا (اختياري) | إحدى القيم المدعومة التالية: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | فهرس المعامل (يبدأ من 0) الحامل لمقدار التغير؛ -1 لتعطيل القراءة من المعاملات.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `deltaParamIndex` قبل `fixedDelta`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `fixedDelta` | `String` | `""` | لا (اختياري) | إحدى القيم المدعومة التالية: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | قيمة تغير رقمية ثابتة (مثل "100" أو "-1") عند عدم وجود معامل.<br/>*تنبيه:* عند الإقلاع يقيّم المسجّل `deltaParamIndex` قبل `fixedDelta`. تجنّب تعيين قيم متعارضة لكليهما معاً. |
| `entityMethod` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"markFulfilled"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | اسم دالة مجال بلا وسائط على الكيان تُنفَّذ ضمن نفس المعاملة.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"markFulfilled"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. اكتشاف المكونات (Beans) وربط الإعدادات وترتيب التنفيذ (5 تعليقات توضيحية)

### `@AutoComponent`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: علامة مكون للإطار تُسجَّل عند الإقلاع دون استيراد @Component وقت التصريف.
- **السلوك وقت التشغيل**: ممسوح داخل حزمة الإطار فقط (io.github.natswarchuan)؛ يجب أن تستخدم تطبيقات المستهلك @Component من Spring.
- **كيفية الاستخدام**: توصيف داخلي يفحصه `AutoBeanFactoryRegistrarBridge` ضمن حزمة `io.github.natswarchuan`.
- **متى يُستخدم**: استخدمه فقط عند المساهمة في النواة داخل `io.github.natswarchuan.*`.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه أبداً في تطبيقات المستهلكين (`com.example.*`)؛ استخدم `@Component` من Spring وإلا فلن يُسجل الـ Bean.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | الاسم الدقيق للـ Bean المسجل في ApplicationContext (مثل `"invoiceValidationHelper"`) أو `""` للحل التلقائي.<br/>`@AutoComponent("invoiceValidationHelper")` | اسم Bean اختياري؛ الفارغ يشتق الاسم بصيغة camelCase.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: علامة طبقة الخدمة لفئات ServiceImpl المقترنة مع @ServiceOverride.
- **السلوك وقت التشغيل**: يُسجل داخل io.github.natswarchuan باسم الفئة البسيط؛ تستخدم خدمات المستهلك @Service من Spring.
- **كيفية الاستخدام**: توصيف خدمة داخلي يُمسح فقط ضمن حزمة `io.github.natswarchuan`.
- **متى يُستخدم**: لخدمات الإطار الداخلية في `io.github.natswarchuan.*` فقط.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه في تطبيقك؛ استخدم `@Service` من Spring.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | الاسم الدقيق للـ Bean المسجل في ApplicationContext (مثل `"orderFulfillmentService"`) أو `""` للحل التلقائي.<br/>`@AutoService("orderFulfillmentService")` | اسم bean اختياري للخدمة.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: يعلن دوال مصانع Beans مُدارة داخل فئات @AutoConfigurationBean.
- **السلوك وقت التشغيل**: يُعالج بواسطة PureJavaBeanRegistrarBridge أثناء التهيئة التلقائية.
- **كيفية الاستخدام**: ضعه على دوال المصنع داخل فئات `@AutoConfigurationBean` في الإطار.
- **متى يُستخدم**: فقط داخل `io.github.natswarchuan.config.*` لتعريف مصانع بدون `@Bean`.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه في `@Configuration` التطبيقية؛ استخدم `@Bean` القياسية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | أسماء الـ Bean الصريحة والبديلة.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `targetTypeName` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"com.example.spi.PaymentGateway"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | الاسم المؤهل الكامل للنوع المستهدف اختيارياً.<br/>*تنبيه:* اسم فئة مؤهل بالكامل عند إرجاع وكيل ديناميكي أو واجهة عامة؛ تأكد من وجود الفئة في مسار التنفيذ. |
| `primary` | `boolean` | `false` | لا (اختياري) | `true` (الـ Bean المفضّل عند تعدد المرشحين) أو `false` (أولوية قياسية).<br/>`@AutoBean(primary = true)` | يعين الـ Bean كمرشح رئيسي عند تعارض الحقن.<br/>*تنبيه:* تعريف اثنين من `@AutoBean(primary = true)` لنفس النوع يسبب تعارض غموض عند الإقلاع. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يحدد فئات التهيئة ونماذج ربط خصائص YAML.
- **السلوك وقت التشغيل**: يسجّل وحدات التهيئة وبادئات YAML بسلاسة مع بيانات تعريف IDE.
- **كيفية الاستخدام**: يميز فئات الإعدادات والخصائص في نواة `io.github.natswarchuan.config.*`.
- **متى يُستخدم**: داخل مكتبة الإطار فقط كبديل خالص لـ `@Configuration`.
- **متى لا يُستخدم والمحاذير**: لا تضعه على فئات إعدادات تطبيقك؛ استخدم `@Configuration`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | الاسم الدقيق للـ Bean المسجل في ApplicationContext (مثل `"storageAutoConfig"`) أو `""` للحل التلقائي.<br/>`@AutoConfigurationBean("storageAutoConfig")` | معرف Bean الإعدادات الاختياري.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `prefix` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"nwvmc.storage"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | بادئة YAML اختيارية تُربط عبر `PureJavaBeanRegistrarBridge`.<br/>*تنبيه:* يربط خصائص `application.yml` تلقائياً؛ أضف ملف metadata لمنع تحذيرات بيئة التطوير. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **الغرض**: يتحكم في ترتيب أولوية التنفيذ بين وحدات SPI Customizer وسلاسل المرشحات.
- **السلوك وقت التشغيل**: القيم الصحيحة الأصغر تُنفذ أولاً (الافتراضي Integer.MAX_VALUE).
- **كيفية الاستخدام**: ضع `@OrderPriority(1)` على المكونات أو المخصصات لترتيب تنفيذها.
- **متى يُستخدم**: عند الحاجة لترتيب حتمي بين عدة مخصصات SPI أو فلاتر.
- **متى لا يُستخدم والمحاذير**: لا تخلط بينه وبين ترتيب مرشحات الأمان أو معامل الترتيب `?sort=`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | لا (اختياري) | إحدى القيم المدعومة التالية: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | رقم أولوية التنفيذ؛ الأقل يُنفَّذ أولاً.<br/>*تنبيه:* الأرقام الأصغر تُنفّذ أولاً (مثل Spring `@Order`). خصّص القيم `< 0` لمرشحات الأمان والتتبع و`10..100` للمنطق. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. أمان الكيانات وآلة الحالة وسلامة البيانات والمولدات التلقائية والاستعلامات (11 تعليقًا توضيحيًا)

### `@EntitySecurity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يفرض صلاحيات RBAC، وعزل السجلات عبر ownerField، ورموز الأذونات قبل الاستعلام أو التعديل.
- **السلوك وقت التشغيل**: يُقيَّم قبل تنفيذ SQL؛ الوصول غير المصرح يطلق HTTP 403 Forbidden.
- **كيفية الاستخدام**: ضعه على كيان JPA وحدد الأدوار المطلوبة وأضف `ownerField` لعزل ملكية السجلات.
- **متى يُستخدم**: استخدمه على كل كيان منشور لتوحيد الأمان عبر REST والدفعات والتصدير وGraphQL.
- **متى لا يُستخدم والمحاذير**: لا تفعّل `permitAll = true` مع `AutoApiController<E>` الكامل دون `AutoReadApi<E>` أو `disabledEndpoints` أو `@SecurityPolicyEntity` لأنه يتجاوز التحقق في القراءة والكتابة والحذف.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_USER", "ROLE_ADMIN"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | الأدوار المصرح لها بقراءة السجلات (GET وGraphQL والتصدير).<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |
| `writeRoles` | `String[]` | `{}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_MANAGER", "ROLE_ADMIN"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | الأدوار المصرح لها بالكتابة والتعديل والاستيراد.<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |
| `deleteRoles` | `String[]` | `{}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | الأدوار المصرح لها بالحذف الفردي والجماعي.<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |
| `permitAll` | `boolean` | `false` | لا (اختياري) | `true` (السماح بالوصول العام دون مصادقة) أو `false` (فرض المصادقة والتحقق من الأدوار).<br/>`@EntitySecurity(permitAll = true)` | عند true (دون سياسة DB-RBAC) يتجاوز فحوصات @EntitySecurity في القراءة والكتابة والحذف؛ أقرن الكتالوج العام بـ AutoReadApi<E> أو disabledEndpoints.<br/>*تنبيه:* يتجاوز فحص الأدوار ويسمح بالوصول المجهول؛ يُحظر تفعيله على البيانات الشخصية أو المالية. |
| `ownerField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل المالك/UUID (مثل `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | اسم حقل مالك السجل (مثل "createdBy")؛ يمنع اختراق IDOR.<br/>*تنبيه:* يفرض عزل الصفوف حسب المالك في القراءة والكتابة ما لم يمتلك المستخدم دوراً في `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | الأدوار العليا المستثناة من قيد `ownerField`.<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |
| `permissions` | `String[]` | `{}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ORDER_READ", "ORDER_APPROVE"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | رموز أذونات دقيقة تُقيّم مع الأدوار عبر DB RBAC.<br/>*تنبيه:* يُطابق مع الأذونات الدقيقة من JWT أو `@SecurityPermissionEntity` في DB-RBAC. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: يحجب أو يفرغ الأعمدة الحساسة ديناميكياً عند نقص صلاحيات الدور.
- **السلوك وقت التشغيل**: يُطبق بعد الجلب وقبل تسلسل استجابة JSON.
- **كيفية الاستخدام**: ضعه على الحقول الحساسة (`costPrice`, `ssn`) ليجري الإخفاء على نسخة معزولة لا تمس قاعدة البيانات.
- **متى يُستخدم**: عند خدمة عدة أدوار من نفس النموذج مع حجب بعض الحقول عن غير المخولين.
- **متى لا يُستخدم والمحاذير**: الحقول غير النصية تصبح `null` تلقائياً؛ عيّن `nullifyInsteadOfMask = true` لتفريغ حقل `String` إلى `null` بدلاً من `"******"`، أو استخدم `readDto` لإخفاء المفتاح نهائياً.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_ADMIN", "ROLE_FINANCE"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | الأدوار المصرح لها برؤية القيمة الأصلية دون إخفاء.<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |
| `maskPattern` | `String` | `"******"` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"***-**-****"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | نمط الإخفاء المرجع للحقول النصية عند غياب الصلاحية.<br/>*تنبيه:* يُتجاهل عند `nullifyInsteadOfMask = true`. للحقول غير النصية (`BigDecimal`، `LocalDate`) يُفضّل التصفير بـ `null`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | لا (اختياري) | `true` (استبدال الحقل غير المصرح به بـ null) أو `false` (تطبيق نص القناع maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | عند true يفرّغ الحقول النصية إلى null بدلاً من maskPattern (الأنواع غير النصية تُضبط تلقائياً إلى null).<br/>*تنبيه:* ضروري للحقول الرقمية والتواريخ حتى يستلم عملاء TypeScript/Zod قيمة `null` صالحة بدلاً من نص قناع. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: يفرض انتقالات الحالة المسموحة عبر POST /{id}/transition ويقصر DELETE /{id} على deletableStates.
- **السلوك وقت التشغيل**: يرفض الانتقالات أو الحذف غير القانوني برمز HTTP 422 BusinessRuleViolationException.
- **كيفية الاستخدام**: ضعه على حقل الحالة النصي بصيغة `:` (`"CREATED:PAID,CANCELLED"`).
- **متى يُستخدم**: لدورات الحياة الصارمة مثل الطلبات والقروض لمنع القفزات غير القانونية (`HTTP 422`).
- **متى لا يُستخدم والمحاذير**: لا تستخدم صيغة `"->"` أبداً (المحرك يقسّم فقط عند النقطتين `":"`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"CREATED"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | الحالة الابتدائية المُعيّنة تلقائياً عند الإنشاء ("ACTIVE").<br/>*تنبيه:* يُضبط تلقائياً عند الإنشاء عبر `POST` إذا كان الحقل فارغاً؛ ويجب أن يطابق الحالة قبل `:` في `transitions`. |
| `transitions` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | قواعد الانتقال المسموحة بصيغة "FROM:TO_1,TO_2".<br/>*تنبيه:* يفرض صيغة النقطتين الدقيقة `"FROM:TO1,TO2"` مع فصل الحالات الهدف بفاصلة؛ أي انتقال غير معلن يُرفض بحالة HTTP `422`. |
| `deletableStates` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | الحالات المسموح فيها بالحذف (بقية الحالات ترفض بـ HTTP 422).<br/>*تنبيه:* عند عدم فراغه، يفشل الحذف بحالة HTTP `422 Unprocessable Entity` إذا كان الكيان في أي حالة أخرى مثل `"PAID"`. |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يترجم بنود السياسات المقروءة إلى قواعد RBAC والانتقالات والحجب الفعالة.
- **السلوك وقت التشغيل**: قابل للفحص عبر GET /human-policy وللتخصيص في YAML تحت spring-nwvmc.human-policies.<Entity>.
- **كيفية الاستخدام**: ضعه على الكيان أو اضبط `spring-nwvmc.human-policies` في YAML ليُترجم عبر `HumanPolicyRegistryHelper`.
- **متى يُستخدم**: عندما تحتاج فرق الامتثال والمنتج لقواعد قابلة للقراءة ومهيأة خارج الشيفرة.
- **متى لا يُستخدم والمحاذير**: لا تكتب نصوصاً عشوائية أو بلغات غير الإنجليزية — المترجم يطابق قوالب محددة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | لا (اختياري) | إحدى القيم المدعومة التالية: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | تعليمات دورة حياة بالإنجليزية تُترجم إلى قواعد انتقال حالة.<br/>*تنبيه:* يُترجم عند الإقلاع إلى محرك `@StateMachine` نفسه؛ تجنّب تعارضه مع `@StateMachine` على نفس الكيان. |
| `security` | `String` | `""` | لا (اختياري) | إحدى القيم المدعومة التالية: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | تعليمات صلاحيات RBAC بالإنجليزية للقراءة والكتابة والحذف.<br/>*تنبيه:* تُضاف بادئة `ROLE_` للأدوار تلقائياً وتُفحص الجمل عند الإقلاع للفشل السريع عند أي خطأ. |
| `masking` | `String` | `""` | لا (اختياري) | إحدى القيم المدعومة التالية: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | سياسة إخفاء الحقول بالإنجليزية تحدد الحقول والأدوار المصرحة.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"costPrice"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `stateField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل حالة دورة الحياة (مثل `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | اسم حقل الحالة في الكيان عند ترجمة `lifecycle`.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"orderStatus"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يسجل الفروقات الحقلية عبر التعديلات لدعم إعادة البناء الزمني وفحص /diff.
- **السلوك وقت التشغيل**: يلتقط تغييرات oldValue وnewValue عند الإنشاء والتحديث والترقيع والانتقال والاستعادة.
- **كيفية الاستخدام**: ضعه على الكيان الوراث من `BaseAuditEntity` لتوثيق كل تعديل أو حذف تلقائياً.
- **متى يُستخدم**: للكيانات الحساسة مثل المدفوعات والسجلات الطبية التي تتطلب تتبع التغييرات.
- **متى لا يُستخدم والمحاذير**: تجنبه في جداول السجلات عالية الكثافة لتفادي تضخم عمليات الكتابة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"FINANCE_LEDGER"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | تصنيف التدقيق المنطقي لكل عملية؛ الفارغ يستخدم اسم الكيان.<br/>*تنبيه:* يُصنّف سجلات التدقيق لتسهيل التصفية؛ الفراغ `""` يعتمد اسم فئة الكيان. |
| `recordFieldDiffs` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | عند true يحسب الفروقات الحقلية لدعم ميزة السفر عبر الزمن Time-Travel.<br/>*تنبيه:* يسجل الفروق قبل وبعد التحديث؛ عطّله (`false`) للكيانات ذات النصوص الضخمة أو التحديثات الكثيفة. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يعزل استعلامات وتعديلات الصفوف تلقائياً حسب سياق المستأجر النشط ما لم يحمل الدور استثناءً.
- **السلوك وقت التشغيل**: يرفض بـ HTTP 403 عند غياب سياق المستأجر دون دور استثناء، ويعيد كتابة tenantId عند الإنشاء ويحمي كافة العمليات بالمعرّف ضد IDOR.
- **كيفية الاستخدام**: ضعه على كيان SaaS لعزل البيانات، ومنع التزوير عند الإنشاء، ورفض الطلبات بلا مستأجر بـ `403`.
- **متى يُستخدم**: في جميع جداول SaaS المشتركة (المتاجر، الفواتير، الطلبات) لمنع تسرب بيانات المستأجرين.
- **متى لا يُستخدم والمحاذير**: لا تضعه على الجداول المرجعية العالمية العامة (الدول، العملات).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل معرّف المستأجر (مثل `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | اسم حقل معرف المستأجر في الكيان (الافتراضي "tenantId").<br/>*تنبيه:* أنشئ فهرساً مركباً `(tenant_id, id)` في قاعدة البيانات لضمان سرعة الاستعلام وعزل المستأجرين. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | لا (اختياري) | مصفوفة أدوار Spring Security (مثل `{"ROLE_SUPER_ADMIN"}`)؛ الفراغ `{}` لا يفرض قيداً إضافياً على هذه العملية.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | أدوار المنصة العليا المسموح لها بتجاوز عزل المستأجرين.<br/>*تنبيه:* خزّن أسماء الأدوار في `RoleConstant` ببادئة `ROLE_` (مثل `ROLE_ADMIN`) لتتطابق مع `GrantedAuthority` في Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: يتحقق من تفرد الحقل قبل الحفظ عند الإنشاء والتحديث والإدراج-أو-التحديث.
- **السلوك وقت التشغيل**: يطلق ConflictBusinessException (HTTP 409) عند وجود قيمة مكررة.
- **كيفية الاستخدام**: ضعه على حقول المفاتيح الفريدة مثل `email` و`skuCode` مع `@Column(unique = true)`.
- **متى يُستخدم**: عند الحاجة لرسائل تعارض `HTTP 409 Conflict` واضحة وتجاهل السجلات المحذوفة منطقياً.
- **متى لا يُستخدم والمحاذير**: لا تستغنِ به عن قيد `UNIQUE` في قاعدة البيانات أثناء التزامن العالي.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: يولّد تلقائياً رموز عمل فريدة ببادئة عند الإنشاء أو النسخ إذا تُركت فارغة.
- **السلوك وقت التشغيل**: يملأ البادئة والرمز الفريد قبل التحقق من الكيان وحفظه.
- **كيفية الاستخدام**: ضعه على حقل الرمز النصي مثل `@AutoCode(prefix = "PRD-")`. يُولَّد تلقائياً إذا كان فارغاً.
- **متى يُستخدم**: للرموز المقروءة (أرقام الطلبات، SKU، التذاكر) دون اختناق تسلسلات قاعدة البيانات.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه إذا اشترط القانون أرقاماً متسلسلة بلا فجوات مثل الفواتير الضريبية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `مطلوب (بلا قيمة افتراضية)` | **نعم (إلزامي)** | بادئة نصية إلزامية غير فارغة (مثل `"PRD-"` أو `"INV-"`) — يفشل التصريف إذا حُذفت.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | بادئة رمز إلزامية تُضاف قبل رمز UUIDv7 من 8 أحرف كبيرة (مثل "PRD-").<br/>*تنبيه:* سمة إلزامية؛ تضيف رمز UUIDv7 من 8 أحرف كبيرة (مثل `INV-0194E1A0`) فقط عند فراغ الحقل أثناء الإنشاء أو النسخ، مع الحفاظ على القيمة الممرّرة إن وُجدت. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: ينشئ تلقائياً معرفات روابط ASCII قياسية من حقل sourceField.
- **السلوك وقت التشغيل**: يعالج علامات التشكيل في Unicode ويدعم البحث بالتصفية عبر الـ slug.
- **كيفية الاستخدام**: ضعه على حقل `slug` مثل `@AutoSlug(sourceField = "name")` ليُملأ تلقائياً.
- **متى يُستخدم**: لعناوين URL الصديقة لمحركات البحث في المتاجر والمقالات والمنتجات.
- **متى لا يُستخدم والمحاذير**: لا تشر إلى حقل غير موجود في `sourceField`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `مطلوب (بلا قيمة افتراضية)` | **نعم (إلزامي)** | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل نصي (مثل `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | اسم الحقل المصدر الإلزامي الذي يُحوّل إلى slug نصي مناسب للروابط.<br/>*تنبيه:* إلزامي؛ يحوّل النص إلى صيغة رابط kebab-case آمنة. ادمجه مع `@UniqueField` لضمان التفرد. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **الغرض**: يحسب المجاميع الرقمية المشتقة بدقة قبل حفظ تغييرات الكيان.
- **السلوك وقت التشغيل**: يُتحقق منه عند الإقلاع بواسطة ComputedFieldFailFastUtil لاكتشاف أخطاء الحقول فوراً.
- **كيفية الاستخدام**: ضعه على الحقل المشتق ليُعاد حسابه تلقائياً على الخادم بدقة `BigDecimal`.
- **متى يُستخدم**: لحساب إجمالي الطلبات والبنود على الخادم ومنع تلاعب العملاء بالأسعار.
- **متى لا يُستخدم والمحاذير**: لا تستخدمه للتسعير المتدرج المعقد أو العروض التي تتطلب استعلامات خارجية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | لا (اختياري) | إحدى القيم المدعومة التالية: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | نوع العملية الحسابية: "MULTIPLY" أو "SUM_COLLECTION".<br/>*تنبيه:* يُعاد حسابه تلقائياً قبل الحفظ لمنع أي تلاعب بالقيم الإجمالية من جهة العميل. |
| `sourceFields` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | أسماء حقول الكيان المضروبة معاً عند "MULTIPLY".<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"unitPrice"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `collectionField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل مجموعة @OneToMany (مثل `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | اسم مجموعة @OneToMany الفرعية في وضع "SUM_COLLECTION".<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"items"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `itemField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل رقمي (مثل `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | الحقل الرقمي في كل عنصر فرعي ليتم جمعه (مثل "subTotal").<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"subTotal"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `subtractField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل رقمي (مثل `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | حقل خصم على الكيان الأب يُطرح من المجموع.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"discountAmount"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `addField` | `String` | `""` | لا (اختياري) | الاسم الدقيق لخاصية Java في الكيان المطابقة لحقل رقمي (مثل `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | حقل رسوم إضافية يُجمع إلى النتيجة (مثل "shippingFee").<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"shippingFee"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: يتيح ربط استعلامات SQL/JPQL مخصصة أو دوال مزوّد بنقاط نهاية المتحكم.
- **السلوك وقت التشغيل**: يُنفذ باستخدام المعاملات المسماة عبر JPA EntityManager.
- **كيفية الاستخدام**: ادمج `@CustomQuery` مع `@AutoGet` أو `@AutoPost` واربط كل `:param` بـ `@AutoParam`.
- **متى يُستخدم**: لتقارير SQL الأصلية وCTEs ودوال النوافذ واستعلامات JSONB دون كتابة Repository.
- **متى لا يُستخدم والمحاذير**: لا تدمج مدخلات المستخدم نصياً في SQL (استخدم `:param` دائماً) وتجنب JOIN بين النطاقات المستقلة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | لا (اختياري) | إحدى القيم المدعومة التالية: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | نص استعلام SQL أو JPQL يدعم معاملات `:param` المسماة.<br/>*تنبيه:* استخدم دوماً معاملات `:param` أو `?1` لمنع حقن SQL؛ اتركها `""` عند استخدام `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | لا (اختياري) | `true` (تنفيذ SQL أصلي لقاعدة البيانات) أو `false` (تنفيذ JPQL محمول عبر JPA).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true لتنفيذ SQL أصلي؛ false لتنفيذ JPQL.<br/>*تنبيه:* SQL الأصلي (`true`) يدعم CTE ودوال النوافذ؛ اختر `false` (JPQL) لسهولة النقل بين H2 وPostgreSQL وMySQL. |
| `resultClass` | `Class<?>` | `Void.class` | لا (اختياري) | أي فئة Java فعلية (مثل `MonthlyRevenueDto.class`) أو `Void.class` لتعطيل تحويل DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | فئة الهدف الاختيارية لتحويل صفوف النتيجة.<br/>*تنبيه:* حدّد دوماً فئة DTO للاستعلامات التجميعية لتجنب `SELECT *` وضمان سلامة الأنواع. |
| `sqlProvider` | `Class<?>` | `Void.class` | لا (اختياري) | فئة Java موفرة لاستعلام SQL (مثل `OrderAnalyticsSqlProvider.class`)، أو `Void.class` عند كتابة الاستعلام مباشرة في `value`.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | فئة Java اختيارية توفر نصوص SQL برمجياً ويتم التحقق منها عند الإقلاع.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `sqlProvider` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `providerMethod` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"buildRevenueSql"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | اسم الدالة داخل `sqlProvider` التي تعيد نص SQL.<br/>*تنبيه:* يجب مطابقة اسم الدالة أو الحقل بدقة مع حساسية الأحرف (مثل `"buildRevenueSql"`)؛ عدم التطابق يسبب خطأً تشغيلياً. |
| `modifying` | `boolean` | `false` | لا (اختياري) | `true` (تنفيذ DML للتحديث أو الحذف داخل معاملة كتابة) أو `false` (استعلام SELECT للقراءة فقط).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | يجب ضبطه على `true` لاستعلامات INSERT وUPDATE وDELETE.<br/>*تنبيه:* إلزامي (`true`) لأي عبارة `UPDATE`/`DELETE`؛ يغلف التنفيذ بمعاملة كتابة آمنة. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. نظام RBAC الديناميكي المعتمد على قاعدة البيانات وإخفاء الحقول (18 تعليقًا توضيحيًا)

### `@SecurityRoleEntity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **الغرض**: يحدد كيان JPA كجدول كتالوج الأدوار النشط لنظام RBAC في قاعدة البيانات.
- **السلوك وقت التشغيل**: يخزن DynamicDatabaseRbacProviderHelper ارتباطات الأدوار بالأذونات في Caffeine ويلغيها تلقائياً عند الكتابة.
- **كيفية الاستخدام**: ضع `@SecurityRoleEntity` على كيان الدور وحدد حقل الرمز عبر `@RoleCode`.
- **متى يُستخدم**: عندما يدير المسؤولون الأدوار ديناميكياً من قاعدة البيانات دون تعديل الشيفرة.
- **متى لا يُستخدم والمحاذير**: لا تترك الكيان دون `@RoleCode` ولا تسجل أكثر من `@SecurityRoleEntity` واحد.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة ثانية؛ مثال: `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | مدة صلاحية كاش Caffeine بالثواني قبل إعادة التحميل من JPA.<br/>*تنبيه:* المدة القصيرة تعكس التغييرات أسرع مع استعلامات أكثر، بينما الطويلة تخفف الحمل وتؤخر إلغاء الصلاحيات حتى الانتهاء. |

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

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط عمود رمز الدور الفريد داخل كيان @SecurityRoleEntity.
- **السلوك وقت التشغيل**: يُقرأ عبر LambdaAccessorUtil لمطابقة رموز GrantedAuthority.
- **كيفية الاستخدام**: ضع `@RoleCode` على الحقل أو الدالة المقابلة داخل كيان `@SecurityRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يحدد حقل اسم العرض المقروء للدور في @SecurityRoleEntity.
- **السلوك وقت التشغيل**: يظهر في البيانات التشخيصية لـ RBAC ونقاط فحص الأدوار في Dev Studio.
- **كيفية الاستخدام**: ضع `@RoleName` على الحقل أو الدالة المقابلة داخل كيان `@SecurityRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يحدد الحقل الذي يحتوي على رموز الأذونات الممنوحة (كمجموعة أو نص CSV) في كيان الدور.
- **السلوك وقت التشغيل**: يُحلل ديناميكياً ويُوسع إلى صلاحيات SecurityIdentityCustomizer الفعالة.
- **كيفية الاستخدام**: ضع `@RolePermissions` على الحقل أو الدالة المقابلة داخل كيان `@SecurityRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **الغرض**: يحدد كيان JPA لتخزين أذونات الموارد والإجراءات وقواعد إخفاء الحقول الديناميكية.
- **السلوك وقت التشغيل**: يُحمَّل في DatabaseRbacRuleMatcherHelper لفرض صلاحيات CRUD وإخفاء الحقول بعد الجلب.
- **كيفية الاستخدام**: ضعه على كيان الأذونات وحدد `@PermissionCode` كحقل إلزامي.
- **متى يُستخدم**: عند إدارة أذونات الموارد والحقول الحساسة ديناميكياً عبر قاعدة البيانات.
- **متى لا يُستخدم والمحاذير**: لا تهمل `@PermissionCode` ولا تكرر `@SecurityPermissionEntity`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة ثانية؛ مثال: `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | مدة صلاحية كاش Caffeine لقواعد الأذونات بالثواني.<br/>*تنبيه:* المدة القصيرة تعكس التغييرات أسرع مع استعلامات أكثر، بينما الطويلة تخفف الحمل وتؤخر إلغاء الصلاحيات حتى الانتهاء. |

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

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يحدد حقل معرّف الإذن الفريد داخل @SecurityPermissionEntity.
- **السلوك وقت التشغيل**: يُطابق مع صلاحيات المستدعي ورموز @EntitySecurity.permissions().
- **كيفية الاستخدام**: ضع `@PermissionCode` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPermissionEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPermissionEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPermissionEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط اسم الكيان الهدف أو مورد API (أو الرمز العام *) داخل @SecurityPermissionEntity.
- **السلوك وقت التشغيل**: يُقيَّم دون حساسية لحالة الأحرف عبر DatabaseRbacRuleMatcherHelper مع دعم البدائل الشاملة.
- **كيفية الاستخدام**: ضع `@PermissionResource` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPermissionEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPermissionEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPermissionEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط فعل العملية المنطقي (CRUD أو مخصص) المحمي بقاعدة @SecurityPermissionEntity.
- **السلوك وقت التشغيل**: يُطبع تلقائياً من أسماء دوال المتحكم مثل READ وWRITE وDELETE أو إجراء مخصص.
- **كيفية الاستخدام**: ضع `@PermissionAction` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPermissionEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPermissionEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPermissionEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يعلن أسماء الحقول المفصولة بفواصل الواجب حجبها ديناميكياً عند تطابق قاعدة الإذن هذه.
- **السلوك وقت التشغيل**: يُطبق ديناميكياً مع @FieldSecurity قبل تسلسل استجابة HTTP JSON.
- **كيفية الاستخدام**: ضع `@PermissionFieldMask` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPermissionEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPermissionEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPermissionEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **الغرض**: يربط كيان JPA المسؤول عن إسناد أدوار قاعدة البيانات للمستخدمين مع نطاق المستأجر الاختياري.
- **السلوك وقت التشغيل**: يُستعلم تلقائياً أثناء تحميل سياق JWT وSecurityContext عبر SecurityIdentityCustomizer.
- **كيفية الاستخدام**: ضعه على جدول ربط المستخدم بالأدوار وحدد `@UserRoleSubject` و`@UserRoleCode`.
- **متى يُستخدم**: عندما يحمل JWT هوية المستخدم وتُسحب أدواره ديناميكياً من قاعدة البيانات.
- **متى لا يُستخدم والمحاذير**: لا تنسَ `@UserRoleSubject`، ولا حاجة له إن كان مزود الهوية الخارجي يضع كل الأدوار في التوكن.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@SecurityUserRoleEntity(enabled = true)` | مفتاح لتفعيل أو إيقاف تحميل تعيينات الأدوار من هذا الجدول.<br/>*تنبيه:* اضبطه على `false` مؤقتاً أثناء ترحيل الجداول مع استمرار العمل بأدوار JWT. |

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

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يحدد حقل اسم المستخدم أو معرّف الـ Subject في @SecurityUserRoleEntity.
- **السلوك وقت التشغيل**: يُطابق مع Authentication.getName() من سياق SecurityContext النشط.
- **كيفية الاستخدام**: ضع `@UserRoleSubject` على الحقل أو الدالة المقابلة داخل كيان `@SecurityUserRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityUserRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityUserRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط عمود رمز الدور المسند داخل @SecurityUserRoleEntity.
- **السلوك وقت التشغيل**: يجلب أذونات @SecurityRoleEntity المرتبطة عند تقييم السياسات.
- **كيفية الاستخدام**: ضع `@UserRoleCode` على الحقل أو الدالة المقابلة داخل كيان `@SecurityUserRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityUserRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityUserRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يُخصص إسناد الدور في @SecurityUserRoleEntity لمعرّف مستأجر محدد (أو * للجميع).
- **السلوك وقت التشغيل**: يُصفى وفق TenantContextHolder وX-Tenant-ID في كل طلب مصادق عليه.
- **كيفية الاستخدام**: ضع `@UserRoleTenantId` على الحقل أو الدالة المقابلة داخل كيان `@SecurityUserRoleEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityUserRoleEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityUserRoleEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **الغرض**: يحدد كيان JPA لتخزين سياسات التفويض الصريحة ALLOW وDENY مرتبة حسب الأولوية priority.
- **السلوك وقت التشغيل**: يتفوق المنع الصريح DENY حتمياً على ALLOW؛ وتُقيَّم السياسات قبل أي استعلام SQL.
- **كيفية الاستخدام**: ضعه على كيان السياسات مع تحديد `@PolicyAllowedRoles` و`@PolicyEffect` ("ALLOW"/"DENY").
- **متى يُستخدم**: لتجاوز قيود `@EntitySecurity` الثابتة ديناميكياً عبر قواعد المنع أو السماح من قاعدة البيانات.
- **متى لا يُستخدم والمحاذير**: لا تترك `@PolicyAllowedRoles`، وتذكر أن قاعدة `DENY` لها الأولوية على السماح.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | لا (اختياري) | رقم موجب (`>= 0`) بوحدة أولوية رقمية؛ مثال: `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | أولوية تقييم السياسات المتعارضة (الرقم الأقل أولى).<br/>*تنبيه:* القيم الأصغر لها الأولوية عند تطابق عدة سياسات على نفس الحقل (مثل `10` تتقدم على `100`). |

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

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط نمط معرّف المورد الهدف داخل @SecurityPolicyEntity.
- **السلوك وقت التشغيل**: يدعم أسماء الكيانات/الموارد الدقيقة بالإضافة إلى المطابقة بالرمز *.
- **كيفية الاستخدام**: ضع `@PolicyResource` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPolicyEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPolicyEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPolicyEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط فعل العملية المحمي (READ أو WRITE أو DELETE أو *) داخل @SecurityPolicyEntity.
- **السلوك وقت التشغيل**: يُقيَّم لكل عملية HTTP قبل التفويض إلى طبقة الخدمة.
- **كيفية الاستخدام**: ضع `@PolicyAction` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPolicyEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPolicyEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPolicyEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يربط قائمة الأدوار (مجموعة أو مفصولة بفواصل) المشمولة بقاعدة @SecurityPolicyEntity.
- **السلوك وقت التشغيل**: يُقارن مع صلاحيات JWT النشطة وأدوار @SecurityUserRoleEntity المحملة من قاعدة البيانات.
- **كيفية الاستخدام**: ضع `@PolicyAllowedRoles` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPolicyEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPolicyEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPolicyEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **الغرض**: يحدد نتيجة قرار السياسة (ALLOW أو DENY) في قاعدة @SecurityPolicyEntity.
- **السلوك وقت التشغيل**: أي سياسة DENY مطابقة ترفض الطلب فوراً برمز HTTP 403 AccessDeniedBusinessException.
- **كيفية الاستخدام**: ضع `@PolicyEffect` على الحقل أو الدالة المقابلة داخل كيان `@SecurityPolicyEntity`.
- **متى يُستخدم**: لربط أعمدة قاعدة البيانات الحالية في `@SecurityPolicyEntity` بمحرك RBAC دون إعادة تسمية الأعمدة.
- **متى لا يُستخدم والمحاذير**: لا تكرره على عدة حقول في نفس الكيان ولا تضعه خارج `@SecurityPolicyEntity`.

> **تعليق علامة (Marker Annotation)**: تعليق علامة خالص لا يُعرّف أي خصائص.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. القفل الموزع وعدم التكرار والتخزين المؤقت وتعدد قواعد البيانات وأحداث السحابة (13 تعليقًا توضيحيًا)

### `@DistributedLock`

- **الحزمة (Package)**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **الغرض**: ينسّق الوصول المتزامن لمفاتيح SpEL المخزنة (الافتراضي waitTimeMs=3000L وleaseTimeMs=5000L).
- **السلوك وقت التشغيل**: يطلق DistributedLockAspect استثناء DistributedLockAcquisitionException (HTTP 409) عند انتهاء المهلة.
- **كيفية الاستخدام**: ضعه على دالة `@Service` غير نهائية، وأضف Bean `DistributedLockProvider` Redis للبيئات الموزعة.
- **متى يُستخدم**: لمنع البيع الزائد للمخزون أو الخصم المتزامن للأرصدة المالية.
- **متى لا يُستخدم والمحاذير**: لا تفترض أن مزود Caffeine الافتراضي يقفل عبر عدة خوادم؛ استبدل `DistributedLockProvider` في الكتلة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | لا (اختياري) | تعبير SpEL يشير لمعاملات الدالة (مثل `"'inventory:' + #skuId"`) أو `""` لتوليد المفتاح تلقائياً.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | تعبير SpEL لمفتاح القفل المُقيَّم وقت التشغيل.<br/>*تنبيه:* اربط المفتاح دائماً بمعرّف المورد الأدق (`#id`) لأن المفتاح الثابت يحوّل كل الطلبات إلى طابور واحد. |
| `waitTimeMs` | `long` | `3000L` | لا (اختياري) | رقم موجب (`>= 0`) بوحدة مللي ثانية؛ مثال: `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | أقصى مدة انتظار بالملي ثانية لاكتساب القفل (الافتراضي 3000L).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: قصره يسبب أخطاء 409 متكررة، وطوله يحجز الخيوط تحت الضغط المرتفع. |
| `leaseTimeMs` | `long` | `5000L` | لا (اختياري) | رقم موجب (`>= 100`) بوحدة مللي ثانية؛ مثال: `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | أقصى مدة صلاحية لحيازة القفل بالملي ثانية (5000L).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: يجب أن تتجاوز أبطأ مدة معاملة p99 وإلا قد ينتهي القفل قبل إتمام الكتابة. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يمنع عمليات الكتابة المكررة المتزامنة أو المعاد إرسالها ضمن نوافذ TTL قابلة للضبط.
- **السلوك وقت التشغيل**: يُفرض عبر IdempotencyAspect وProxyIdempotencyGuardHelper بقفل Caffeine TTL (HTTP 409 ConflictBusinessException)؛ تمر الطلبات بلا مفتاح ويتاح IdempotencyManagerHelper اختيارياً لـ SHA-256.
- **كيفية الاستخدام**: ضعه على دوال المتحكم أو خدمة غير نهائية؛ يتم تحرير المفتاح تلقائياً عند الفشل للسماح بإعادة المحاولة.
- **متى يُستخدم**: لعمليات الدفع والتحويل المالي وأي POST عرضة للنقر المزدوج أو إعادة الإرسال.
- **متى لا يُستخدم والمحاذير**: لا تضعه على GET واستبدل `IdempotencyStoreProvider` بـ Redis في التجمعات متعددة العقد.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | لا (اختياري) | اسم ترويسة HTTP صالح (غير حساس لحالة الأحرف عبر الشبكة، مثل `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | رأس HTTP الحامل لمفتاح عدم التكرار؛ الغياب أو الفراغ يتجاوز الفحص.<br/>*تنبيه:* يجب أن يرسل العميل UUIDv7 فريداً لكل عملية ويعيد استخدامه عند إعادة المحاولة، مع إدراجه في CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة ثانية؛ مثال: `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | نافذة منع التكرار بالثواني حيث يُرفض تكرار المفتاح بـ HTTP 409 Conflict.<br/>*تنبيه:* مدة حفظ الاستجابة في Redis أو الذاكرة؛ اضبطها بين `300L` و`86400L` وفق نافذة إعادة المحاولة. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يفرض تحديد معدل الطلبات بنافذة منزلقة لكل عنوان IP أو مستخدم أو مستأجر.
- **السلوك وقت التشغيل**: يزيد مقياس nwvmc.ratelimit.rejected.total ويرد برمز HTTP 429 Too Many Requests.
- **كيفية الاستخدام**: ضعه على المتحكم أو الدالة؛ يرسل `X-RateLimit-Remaining` و`X-RateLimit-Reset` ثم `HTTP 429` + `Retry-After` عند تجاوز الحد.
- **متى يُستخدم**: لمنع الإساءة في البحث العام، تسجيل الدخول، استعلامات الذكاء الاصطناعي والتصدير الضخم.
- **متى لا يُستخدم والمحاذير**: لا تضع حدوداً ضيقة على فحوصات الصحة وتجنب `"GLOBAL"` عندما يلزم عزل المستخدمين أو المستأجرين (`"USER"` أو `"TENANT"` أو `"IP"`).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة طلبات؛ مثال: `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | أقصى عدد طلبات مسموح بها لكل نافذة زمنية (60).<br/>*تنبيه:* يُصدر ترويسات `X-RateLimit-Remaining` و`X-RateLimit-Reset` و`Retry-After` وفق RFC 6585 عند إرجاع HTTP `429`. |
| `windowSeconds` | `int` | `60` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة ثانية؛ مثال: `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | مدة النافذة الزمنية بالثواني (60).<br/>*تنبيه:* يحدد طول نافذة العد ويحسب منه قيَم `X-RateLimit-Reset` و`Retry-After`. |
| `partitionKey` | `String` | `"IP"` | لا (اختياري) | إحدى القيم المدعومة التالية: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | استراتيجية التجزئة الديناميكية: "IP"/"clientIp" أو "USER" (مع رجوع للـ IP للزوار) أو "TENANT" أو "GLOBAL" أو SpEL "#expr".<br/>*تنبيه:* `"USER"` يجزّئ حسب المستخدم المسجل ويعود للـ IP للمجهولين؛ بينما `"GLOBAL"` يشارك حصة واحدة للجميع. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يغلف العمليات بقواطع الدائرة Resilience4j مع إرسال القياسات إلى Actuator وMicrometer.
- **السلوك وقت التشغيل**: يتحول إلى OPEN (HTTP 503) عند تجاوز نسبة الأخطاء ويحدّث مقياس nwvmc.resilience.circuitbreaker.state.
- **كيفية الاستخدام**: ضعه على المتحكمات المتصلة بخدمات خارجية أو ذكاء اصطناعي لمنع الانهيار المتسلسل.
- **متى يُستخدم**: عند الحاجة للفشل السريع (`HTTP 503`) بدلاً من حجز الخيوط بانتظار انتهاء المهلة.
- **متى لا يُستخدم والمحاذير**: يتجاهل `CircuitBreakerErrorFilterUtil` أخطاء 4xx من `BaseBusinessException` تلقائياً؛ لا تغلف أخطاء العميل بـ `RuntimeException`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"payment-gateway-cb"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | معرف قاطع الدائرة في Resilience4j؛ الفارغ يستخدم اسم الكيان.<br/>*تنبيه:* يُعرّف نسخة Resilience4j ووسم Micrometer؛ الفراغ `""` يشتق الاسم من الفئة. |
| `failureRateThreshold` | `float` | `50.0f` | لا (اختياري) | رقم موجب (`1.0f .. 100.0f`) بوحدة نسبة مئوية؛ مثال: `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | نسبة الإخفاق المئوية لفتح القاطع إلى حالة OPEN (50.0f).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تُستثنى أخطاء الأعمال 4xx تلقائياً؛ فقط أخطاء 5xx والبنية التحتية تفتح القاطع. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة ثانية؛ مثال: `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | ثواني التبريد في حالة OPEN (ترجع HTTP 503) قبل الانتقال إلى HALF_OPEN.<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تُستثنى أخطاء الأعمال 4xx تلقائياً؛ فقط أخطاء 5xx والبنية التحتية تفتح القاطع. |
| `slidingWindowSize` | `int` | `20` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة مكالمات؛ مثال: `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | عدد الاستدعاءات المسجلة داخل النافذة المنزلقَة (20).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تُستثنى أخطاء الأعمال 4xx تلقائياً؛ فقط أخطاء 5xx والبنية التحتية تفتح القاطع. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة مكالمات؛ مثال: `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | عدد طلبات الفحص المسموحة في حالة HALF_OPEN لتقرير التعافي (5).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تُستثنى أخطاء الأعمال 4xx تلقائياً؛ فقط أخطاء 5xx والبنية التحتية تفتح القاطع. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يعيد تلقائياً محاولة الإخفاقات المؤقتة بتراجع أسي قابل للضبط.
- **السلوك وقت التشغيل**: يطلق استثناءً موحداً إذا استُنفدت جميع محاولات الإعادة المحددة.
- **كيفية الاستخدام**: ضعه على المتحكم أو الدوال للتعافي التلقائي من أخطاء الشبكة أو تأمين القاعدة المؤقتة.
- **متى يُستخدم**: لعمليات القراءة GET والعمليات المتكررة بأمان المحمية بـ `@Idempotent`.
- **متى لا يُستخدم والمحاذير**: لا تضعه أبداً على POST غير متكررة أو عمليات دفع دون `@Idempotent` (سيضاعف السحب المالي).

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"erp-sync-retry"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | اسم مثيل إعادة المحاولة في Resilience4j.<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تأكد من أن إجمالي محاولات الإعادة وفترات الانتظار أقل من مهلة البوابة العليا. |
| `maxAttempts` | `int` | `3` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة محاولات؛ مثال: `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | إجمالي المحاولات متضمنة المحاولة الأولى (3).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تأكد من أن إجمالي محاولات الإعادة وفترات الانتظار أقل من مهلة البوابة العليا. |
| `waitDurationMs` | `long` | `500L` | لا (اختياري) | رقم موجب (`>= 50`) بوحدة مللي ثانية؛ مثال: `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | التأخير الأولي بالملي ثانية قبل إعادة المحاولة الأولى (500L).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تأكد من أن إجمالي محاولات الإعادة وفترات الانتظار أقل من مهلة البوابة العليا. |
| `backoffMultiplier` | `double` | `2.0d` | لا (اختياري) | رقم موجب (`>= 1.0d`) بوحدة معامل تضاعف؛ مثال: `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | معامل التراجع الأسي بين المحاولات المتتالية (2.0d).<br/>*تنبيه:* اضبط القيمة بدقة وفق اتفاقية زمن الاستجابة في الإنتاج: تأكد من أن إجمالي محاولات الإعادة وفترات الانتظار أقل من مهلة البوابة العليا. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **الحزمة (Package)**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يحسب وسوم ETag الضعيفة RFC 7232 (W/"...") ويصدر ترويسات Cache-Control واستجابات HTTP 304 Not Modified.
- **السلوك وقت التشغيل**: يسجل عدادات HIT/MISS في مقياس nwvmc.cache.http.requests.
- **كيفية الاستخدام**: ضعه على متحكمات القراءة أو دوال GET لتفعيل `ETag` و`Cache-Control` و`304 Not Modified`.
- **متى يُستخدم**: للكتالوجات والقواميس والقوائم العامة لتقليل استهلاك الشبكة عبر `304`.
- **متى لا يُستخدم والمحاذير**: لا تترك `isPrivate = false` أبداً مع البيانات الشخصية أو متعددة المستأجرين لتجنب تسرب CDN.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | لا (اختياري) | رقم موجب (`>= 0`) بوحدة ثانية؛ مثال: `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | مدة `max-age` في ترويسة Cache-Control بالثواني (60).<br/>*تنبيه:* يُصدر `Cache-Control: max-age=<N>`؛ استخدم `0` مع `generateETag = true` للتحقق الشرطي الفوري `304`. |
| `isPrivate` | `boolean` | `false` | لا (اختياري) | `true` (تخزين خاص بالمتصفح فقط وممنوع على شبكات CDN) أو `false` (تخزين عام قابل للاستخدام في الوكلاء وCDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true يصدر `private` لمنع تخزين الوكلاء المشتركة؛ false يصدر `public`.<br/>*تنبيه:* هام جداً: اضبط `isPrivate = true` دوماً على المسارات المصادق عليها لمنع شبكات CDN من مشاركة بيانات مستخدم مع آخر. |
| `mustRevalidate` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | يضيف `, must-revalidate` لإلزام إعادة التحقق عند انتهاء الصلاحية.<br/>*تنبيه:* يمنع الوكلاء من تقديم استجابات منتهية الصلاحية بعد `maxAgeSeconds` دون التحقق من الخادم. |
| `generateETag` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | يحسب بصمة ETag SHA-256 ويرجع `HTTP 304` عند تطابق `If-None-Match`.<br/>*تنبيه:* يحسب `ETag` وفق RFC 7232 ويعيد `304 Not Modified` بحجم 0 بايت عند تطابق `If-None-Match`. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يخزن نتائج دوال القراءة الخادمية مؤقتاً في محركات Caffeine L1 وRedis L2.
- **السلوك وقت التشغيل**: قابل للضبط عالمياً عبر الخاصية app.framework.cache.type.
- **كيفية الاستخدام**: ضعه على دوال القراءة الخدمية ليُدار عبر `app.framework.cache.type`.
- **متى يُستخدم**: للاستعلامات كثيفة القراءة عبر المعرف أو البيانات الوصفية الثابتة.
- **متى لا يُستخدم والمحاذير**: لا تخزن كيانات قابلة للتعديل دون استنساخ، ولا تفعّله على جداول كثيرة التعديل.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | أسماء مساحات التخزين المؤقت في Caffeine أو Redis.<br/>*تنبيه:* يجب تطابق أسماء المناطق مع إعدادات Caffeine/Redis وإقران كل عملية كتابة بـ `@AutoCacheEvict`. |
| `key` | `String` | `""` | لا (اختياري) | تعبير SpEL يشير لمعاملات الدالة (مثل `"'product:' + #id"`) أو `""` لتوليد المفتاح تلقائياً.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | تعبير SpEL للمفتاح (`v0.1.0` يولّد `EntityName:id` بأمان دون أخطاء انعكاس).<br/>*تنبيه:* في التطبيقات متعددة المستأجرين، أدرج معرّف المستأجر في المفتاح دائماً لمنع تداخل الكاش. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يزيل مدخلات الذاكرة المؤقتة القديمة على الخادم عند حدوث التعديلات.
- **السلوك وقت التشغيل**: يُنفذ بعد التعديل بنظافة دون ترك قراءات قديمة.
- **كيفية الاستخدام**: ضعه على دوال التحديث والحذف بمطابقة مفتاح `@AutoCacheable`.
- **متى يُستخدم**: كلما تم تعديل أو حذف سجلات مخزنة عبر `@AutoCacheable`.
- **متى لا يُستخدم والمحاذير**: تجنب `allEntries = true` في عمليات الإنشاء الكثيفة لمنع انهيار الكاش المفاجئ.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | أسماء مساحات الكاش المراد تفريغها بعد إتمام العملية.<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `value` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `key` | `String` | `""` | لا (اختياري) | تعبير SpEL يشير لمعاملات الدالة (مثل `"'product:' + #id"`) أو `""` لتوليد المفتاح تلقائياً.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | تعبير SpEL لاستهداف عنصر الكاش المتأثر فقط.<br/>*تنبيه:* يجب أن ينتج نفس صيغة مفتاح `@AutoCacheable.key`؛ يُتجاهل عند `allEntries = true`. |
| `allEntries` | `boolean` | `false` | لا (اختياري) | `true` (مسح جميع المفاتيح في منطقة التخزين المؤقت) أو `false` (حذف الإدخال المفرد المحدد عبر key فقط).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | عند true يفرغ مدخلات الكيان المعني فقط دون المساس ببقية الكيانات.<br/>*تنبيه:* مسح المنطقة كاملة تحت ضغط مرتفع قد يسبب هجمة استعلامات على قاعدة البيانات؛ فضّل الحذف الانتقائي بـ `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **الحزمة (Package)**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يقيس مدة التنفيذ ويصدر سجلات WARN عندما تتجاوز الاستدعاءات البطيئة الحد.
- **السلوك وقت التشغيل**: يزود أيضاً مؤقتات زمن الاستجابة عبر DynamicEntityMetricsHelper.
- **كيفية الاستخدام**: ضعه على المتحكمات أو الخدمات لمراقبة انتهاكات زمن الاستجابة تلقائياً.
- **متى يُستخدم**: في التقارير المعقدة والدفعات واستعلامات `@CustomQuery` لاكتشاف البطء مبكراً.
- **متى لا يُستخدم والمحاذير**: لا تجعله `0` في المسارات الكثيفة ولا تضعه على بث SSE طويل الأمد.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | لا (اختياري) | رقم موجب (`>= 1`) بوحدة مللي ثانية؛ مثال: `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | عتبة الزمن بالملي ثانية التي يصدر بعدها تحذير `WARN` لبطء التنفيذ (500L).<br/>*تنبيه:* يسجل تحذير `WARN` مع `traceId` عند تجاوز المدة؛ اضبط قيمة واقعية (`200L–1000L`) لتفادي تضخم السجلات. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **الحزمة (Package)**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **الغرض**: يرسل إشعارات Webhook موقعة بـ HMAC-SHA256 غير متزامنة على Virtual Threads بعد الاعتماد.
- **السلوك وقت التشغيل**: يحسب التوقيعات في WebhookHmacSignerHelper ويتحقق من التطابق بزمن ثابت.
- **كيفية الاستخدام**: ضعه على كيان JPA ليُسلّم بعد تأكيد المعاملة عبر Outbox وخيوط افتراضية.
- **متى يُستخدم**: لإشعار الشركاء الخارجيين أو أنظمة ERP فور تأكيد الطلبات والمدفوعات.
- **متى لا يُستخدم والمحاذير**: اجعل `includeFullPayload = false` مع بيانات PII/PCI الحساسة، وامنع روابط الشبكة الداخلية.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | لا (اختياري) | مصفوفة تضم صفراً أو أكثر من القيم الصالحة: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | الأحداث التي تطلق إرسال Webhook موقع بـ HMAC.<br/>*تنبيه:* يُرسل غير متزامن بعد تأكيد المعاملة (`AFTER_COMMIT`) لمنع إرسال إشعارات لعمليات تم التراجع عنها. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | لا (اختياري) | اسم ترويسة HTTP صالح (غير حساس لحالة الأحرف عبر الشبكة، مثل `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | ترويسة HTTP التي تحمل توقيع HMAC-SHA256.<br/>*تنبيه:* يحمل توقيع HMAC-SHA256 للبيانات؛ يجب على المستقبِل التحقق منه بزمن ثابت قبل المعالجة. |
| `includeFullPayload` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@EntityWebhook(includeFullPayload = false)` | true يرسل حمولة JSON كاملة؛ false يكتفي بالمعرف وبيانات الحدث.<br/>*تنبيه:* اضبطه `false` للبيانات الحساسة لإرسال المعرّف فقط حتى يجلب المشترك البيانات عبر GET مصادق عليه. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **الحزمة (Package)**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: ينشر مغلفات CNCF CloudEvents v1.0 بعد اعتماد المعاملة.
- **السلوك وقت التشغيل**: يلتزم بـ TransactionRuntimeBridge.executeAfterCommit لتفادي الأحداث الوهمية.
- **كيفية الاستخدام**: ضعه على الكيان أو الدالة واستقبل `CloudEventEnvelopeDto` بعد تأكيد المعاملة.
- **متى يُستخدم**: للتواصل المفكوك بين السياقات المستقلة عبر الأحداث دون ربط SQL مشترك.
- **متى لا يُستخدم والمحاذير**: لا تخلط بينه وبين `@EntityWebhook` ولا تستقبله قبل التزام قاعدة البيانات `AFTER_COMMIT`.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | لا (اختياري) | سلسلة معرّف غير فارغة (مثل `"com.acme.order.lifecycle"`)؛ اتركها `""` لتطبيق الاصطلاح الافتراضي.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | نوع حدث CloudEvents (مثل "io.nwvmc.order.created").<br/>*تنبيه:* اتبع تسمية CloudEvents 1.0 العكسية (`com.company.domain.event`)؛ والفراغ `""` يولّده تلقائياً. |
| `source` | `String` | `""` | لا (اختياري) | مسار HTTP صالح يبدأ بـ `/` (مثل `/services/order-api`) أو سلسلة فارغة `""` للاشتقاق التلقائي.<br/>`@PublishCloudEvent(source = "/services/order-api")` | معرف المصدر URI لسياق CloudEvents المرسِل.<br/>*تنبيه:* يملأ حقل URI `source` وفق معيار CNCF CloudEvents لتتبع مصدر الأحداث. |
| `publishOnCreate` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | يصُدر CloudEvent بعد تأكيد الإنشاء (true).<br/>*تنبيه:* يُنشر فقط بعد تأكيد المعاملة (`AFTER_COMMIT`) عبر جسر الأحداث أو Kafka. |
| `publishOnUpdate` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | يصُدر CloudEvent بعد التحديث (true).<br/>*تنبيه:* عطّله (`false`) في الكيانات عالية التحديث لتجنب إغراق وسيط الرسائل. |
| `publishOnDelete` | `boolean` | `true` | لا (اختياري) | `true` (مفعّل) أو `false` (معطّل).<br/>`@PublishCloudEvent(publishOnDelete = true)` | يصُدر CloudEvent بعد الحذف (true).<br/>*تنبيه:* ينطلق عند الحذف الفعلي والناعم `BaseAuditEntity.deleted` لإبقاء نماذج القراءة متزامنة. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **الحزمة (Package)**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يربط عمليات الكيان أو الاستعلام بمفتاح مصدر بيانات منطقي محدد.
- **السلوك وقت التشغيل**: يسجل عدادات التوجيه في مقياس framework.datasource.routing.total.
- **كيفية الاستخدام**: ضعه على المتحكم أو الدوال الخدمية غير النهائية مع استعادة تلقائية للسياق بعد الانتهاء.
- **متى يُستخدم**: لفصل القراءة والكتابة (CQRS) وتوجيه التقارير الثقيلة إلى نسخة القراءة `REPLICA`.
- **متى لا يُستخدم والمحاذير**: لا تغير مصدر البيانات داخل معاملة `@Transactional` مفتوحة مسبقاً ولا على فئة `final`!

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | لا (اختياري) | إحدى القيم المدعومة التالية: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | مفتاح توجيه مصدر البيانات في `DataSourceContextHolder` ("PRIMARY" أو "REPLICA").<br/>*تنبيه:* يجب تطابقها مع مفتاح مسجل في `DynamicRoutingDataSource`؛ المفاتيح غير المعروفة تعود إلى `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **الحزمة (Package)**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **الغرض**: يعيّن عائلة محرك قاعدة البيانات وقطعة العنقود المنطقية لكل كيان.
- **السلوك وقت التشغيل**: يُحل ديناميكياً بواسطة MultiPlatformDataSourceRegistryHelper وTenantDatabaseRoutingResolverHelper.
- **كيفية الاستخدام**: ضعه على كيانات JPA أو الدوال لتحديد محرك القاعدة والعنقود.
- **متى يُستخدم**: في الأنظمة متعددة قواعد البيانات أو العناقيد المقسمة للمالية والتحليلات والتدقيق.
- **متى لا يُستخدم والمحاذير**: لا يغني عن ضبط اتصالات JDBC الفعلية في YAML؛ ويُمنع إجراء JOIN بين عناقيد منفصلة.

| الخاصية | نوع Java | القيمة الافتراضية | مطلوب | القيم المقبولة والمثال | الوصف وملاحظات التشغيل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | لا (اختياري) | إحدى القيم المدعومة التالية: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | معرف محرك قاعدة البيانات ("H2" أو "POSTGRESQL" أو "MYSQL" أو "ORACLE").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `platform` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `cluster` | `String` | `"PRIMARY"` | لا (اختياري) | إحدى القيم المدعومة التالية: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | اسم المجموعة أو التجزئة ("PRIMARY" أو "FINANCE_CLUSTER" أو "ANALYTICS_CLUSTER").<br/>*تنبيه:* يُتحقق منه فور الإقلاع؛ الأخطاء الإملائية أو قيم `cluster` غير الصالحة تفشل سريعاً قبل استقبال الطلبات. |
| `readOnly` | `boolean` | `false` | لا (اختياري) | `true` (التوجيه إلى مجمع النسخ المتماثلة للقراءة فقط) أو `false` (التوجيه إلى مجمع قاعدة البيانات الرئيسية للقراءة والكتابة).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | عند true يشير إلى تفضيل التوجيه نحو نسخ القراءة فقط.<br/>*تنبيه:* لا تضبط `readOnly = true` على عمليات الكتابة لأن النسخ المماثلة للقراءة ترفض التعديل. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
