# 06. সকল ৬০টি ডিক্লারেটিভ অ্যানোটেশনের সম্পূর্ণ কারিগরি স্পেসিফিকেশন (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল (EN)](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0`-এর সকল **৬০টি ডিক্লারেটিভ অ্যানোটেশনের** পূর্ণাঙ্গ কারিগরি রেফারেন্স, যা সরাসরি Java `@interface` সোর্স কোড থেকে সংকলিত: সঠিক প্যাকেজ, `@Target`, **প্রতিটি অ্যাট্রিবিউট**, Java টাইপ, ডিফল্ট মান, আবশ্যিক/ঐচ্ছিক অবস্থা, **ব্যবহারের নিয়ম**, **কখন ব্যবহার করবেন**, **কখন ব্যবহার করবেন না এবং সতর্কতা**, এবং যাচাইকৃত Java কোড উদাহরণ।

## দ্রুত সূচিপত্র (৬০টি অ্যানোটেশন)

| অ্যানোটেশন | বিভাগ | `@Target` | অ্যাট্রিবিউট সারাংশ | মূল উদ্দেশ্য |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> প্রসারিতকারী ইন্টারফেসকে ৪০টি কন্ট্র্যাক্টের (Swagger UI-তে ডিফল্ট ৩৮টি দৃশ্যমান) রানটাইম JDK ডায়নামিক প্রক্সিতে রূপান্তর করে। |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | ডায়নামিক CRUD-এর পরিবর্তে MethodHandleCacheUtil দিয়ে একটি নির্দিষ্ট মেথডকে কাস্টম Spring বিন মেথডে রিডাইরেক্ট করে। |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | ডোমেইন-নির্দিষ্ট ওয়ার্কফ্লো রুট (চেকআউট, রিফান্ড, অনুমোদন) স্বতন্ত্র Spring @Component Helper বিনে যুক্ত করে। |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | স্ট্যাটিক Spring Web ইমপোর্ট ছাড়া @GetMapping-এর পিওর Java বিকল্প। |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | কাস্টম consumes/produces মিডিয়া টাইপ সমর্থনসহ পিওর Java HTTP POST রুট। |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | সম্পূর্ণ রিসোর্স প্রতিস্থাপনের জন্য পিওর Java HTTP PUT রুট ম্যাপিং। |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | আংশিক মার্জ, অ্যাটমিক ইনক্রিমেন্ট এবং RFC 6902 JSON Patch সমর্থিত পিওর Java HTTP PATCH। |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | স্টেট-সুরক্ষিত সফট ডিলিশন চালু করা পিওর Java HTTP DELETE ঘোষণা। |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL কুয়েরি প্যারামিটার বা Map<String, String> ডায়নামিক ফিল্টার ম্যাপ বাইন্ড করে। |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 সত্তার ID-র মতো URI পাথ ভেরিয়েবল বাইন্ড করে। |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | @Valid-এর সাথে DTO বা Entity প্যারামিটারে HTTP JSON পেলোড ডিসিরিয়ালাইজ করে। |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | চক্রীয় লুপ প্রতিরোধসহ GET /{id}/{relation}/** দিয়ে চাইল্ড সম্পর্ক রিকার্সিভ নেভিগেশন অনুমোদন করে। |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | কাস্টম অ্যাকশন মেথডে ডোমেইন স্টেট ট্রানজিশন বা সংখ্যাসূচক সমন্বয় ঘোষণা করে। |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | কম্পাইল-টাইমে @Component ইমপোর্ট ছাড়াই বুটে নিবন্ধিত কম্পোনেন্ট মার্কার। |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride-এর সাথে যুক্ত ServiceImpl ক্লাসের জন্য সার্ভিস-লেয়ার মার্কার। |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean ক্লাসের ভেতর ম্যানেজড বিন ফ্যাক্টরি মেথড ঘোষণা করে। |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | কনফিগারেশন ক্লাস ও YAML প্রোপার্টি বাইন্ডিং মডেল চিহ্নিত করে। |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer বিন এবং ফিল্টার চেইনের মধ্যে কার্যকরী অগ্রাধিকার ক্রম নিয়ন্ত্রণ করে। |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | ডেটা কোয়েরি বা পরিবর্তনের আগে NIST Level 2 RBAC, ownerField আইসোলেশন ও পারমিশন কোড প্রয়োগ করে। |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | ভূমিকার অনুমতি না থাকলে সংবেদনশীল কলাম ডায়নামিকভাবে মাস্ক বা নাল করে। |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition-এ বৈধ স্টেট ট্রানজিশন প্রয়োগ করে এবং DELETE /{id}-কে deletableStates-এ সীমাবদ্ধ রাখে। |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | সহজপাঠ্য পলিসি বাক্যকে সক্রিয় RBAC, ট্রানজিশন ও মাস্কিং নিয়মে কম্পাইল করে। |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | টাইম-ট্রাভেল অবস্থা পুনর্গঠন ও /diff পরিদর্শনের জন্য ফিল্ড-স্তরের পরিবর্তন লিপিবদ্ধ করে। |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | বাইপাস রোল না থাকলে সক্রিয় টেন্যান্ট কনটেক্সট অনুযায়ী সারি কোয়েরি ও পরিবর্তন স্বয়ংক্রিয়ভাবে আলাদা করে। |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | create, update এবং upsert সংরক্ষণের আগে স্বতন্ত্রতা যাচাই করে। |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (বাধ্যতামূলক)` | ফাঁকা থাকলে তৈরি বা ক্লোন করার সময় স্বয়ংক্রিয়ভাবে প্রিফিক্সসহ অনন্য কোড তৈরি করে। |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (বাধ্যতামূলক)` | sourceField থেকে স্বয়ংক্রিয়ভাবে URL-বান্ধব ASCII স্লাগ তৈরি করে। |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | সত্তার পরিবর্তন সংরক্ষণের আগে উদ্ভূত সংখ্যাসূচক মোট হিসাব করে। |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | কন্ট্রোলার এন্ডপয়েন্টে কাস্টম SQL/JPQL বা প্রোভাইডার হেল্পার মেথড বাঁধার সুবিধা দেয়। |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | একটি JPA সত্তাকে লাইভ ডাটাবেস RBAC রোল ক্যাটালগ টেবিল হিসেবে নির্ধারণ করে। |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityRoleEntity-এর ভেতরে অনন্য রোল কোড কলাম ম্যাপ করে। |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityRoleEntity-তে ভূমিকা প্রদর্শনের নাম ফিল্ড চিহ্নিত করে। |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | রোল সত্তায় প্রদত্ত পারমিশন কোডের তালিকা বা CSV স্ট্রিং ফিল্ড চিহ্নিত করে। |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | রিসোর্স-অ্যাকশন পারমিশন ও ডায়নামিক ফিল্ড-মাস্কিং নিয়ম সংরক্ষণকারী JPA সত্তা চিহ্নিত করে। |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPermissionEntity-এর ভেতর অনন্য পারমিশন আইডি ফিল্ড নির্ধারণ করে। |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPermissionEntity-এ টার্গেট সত্তা বা রিসোর্স নাম (অথবা *) ম্যাপ করে। |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPermissionEntity দ্বারা সুরক্ষিত CRUD বা কাস্টম অ্যাকশন ভার্ব ম্যাপ করে। |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | এই পারমিশন নিয়ম প্রয়োগ হলে কমা-বিভক্ত কোন ফিল্ডগুলো ডায়নামিকভাবে মাস্ক করতে হবে তা নির্ধারণ করে। |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | অথেনটিকেটেড ব্যবহারকারীকে DB রোল ও টেন্যান্ট স্কোপের সাথে যুক্তকারী JPA সত্তা চিহ্নিত করে। |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityUserRoleEntity-তে প্রিন্সিপাল সাবজেক্ট বা ইউজারনেম ফিল্ড চিহ্নিত করে। |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityUserRoleEntity-এর ভেতরে নির্ধারিত রোল কোড কলাম বাইন্ড করে। |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityUserRoleEntity অ্যাসাইনমেন্টকে নির্দিষ্ট টেন্যান্ট আইডিতে (বা গ্লোবাল *) সীমাবদ্ধ করে। |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | priority অনুযায়ী সাজানো স্পষ্ট ALLOW / DENY অথোরাইজেশন পলিসি সংরক্ষণকারী JPA সত্তা চিহ্নিত করে। |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPolicyEntity-তে টার্গেট রিসোর্স আইডেন্টিফায়ার প্যাটার্ন ম্যাপ করে। |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPolicyEntity-এর ভেতরে সুরক্ষিত অ্যাকশন (READ, WRITE, DELETE, methodName, *) ম্যাপ করে। |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPolicyEntity নিয়মের আওতাভুক্ত রোলের তালিকা বা CSV ফিল্ড ম্যাপ করে। |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(মার্কার অ্যানোটেশন — কোনো অ্যাট্রিবিউট নেই)` | @SecurityPolicyEntity নিয়মে ALLOW অথবা DENY সিদ্ধান্ত নির্ধারণ করে। |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST ম্যাপে (সর্বোচ্চ ১০২৪) ক্যাশকৃত SpEL কী-তে সমবর্তী অ্যাক্সেস সিরিয়ালাইজ করে (ডিফল্ট 3000L / 5000L ms)। |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | কনফিগারযোগ্য TTL সময়ের মধ্যে সমবর্তী বা পুনরাবৃত্ত ডুপ্লিকেট রাইট প্রতিরোধ করে। |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP, User বা Tenant অনুযায়ী স্লাইডিং-উইন্ডো রেট লিমিটিং প্রয়োগ করে। |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator ও Micrometer-এ টেলিমেট্রি পাঠিয়ে Resilience4j সার্কিট ব্রেকারের ভেতর অপারেশন চালায়। |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | কনফিগারযোগ্য এক্সপোনেনশিয়াল ব্যাকঅফসহ ক্ষণস্থায়ী ব্যর্থতা স্বয়ংক্রিয়ভাবে পুনরায় চেষ্টা করে। |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 দুর্বল ETag (W/"...") গণনা করে এবং Cache-Control ও HTTP 304 Not Modified রেসপন্স পাঠায়। |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Caffeine L1 / Redis L2 ইঞ্জিনে সার্ভার-সাইড রিড মেথডের আউটপুট ক্যাশ করে। |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | ডেটা পরিবর্তনে পুরোনো সার্ভার-সাইড ক্যাশ এন্ট্রি অপসারণ করে। |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | এক্সিকিউশন সময় পরিমাপ করে এবং ধীর কল সীমা ছাড়ালে WARN লগ দেয়। |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | কমিটের পর ভার্চুয়াল থ্রেডে অ্যাসিঙ্ক্রোনাস HMAC-SHA256 স্বাক্ষরিত ওয়েবহুক পাঠায়। |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | ট্রানজ্যাকশন কমিটের পর CNCF CloudEvents v1.0 এনভেলপ প্রকাশ করে। |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | সত্তা বা কোয়েরি অপারেশনকে নির্দিষ্ট লজিক্যাল ডেটাসোর্স কী-তে যুক্ত করে। |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | প্রতিটি সত্তার জন্য ডাটাবেস ইঞ্জিন পরিবার ও লজিক্যাল ক্লাস্টার শার্ড নির্ধারণ করে। |

---

## 1. রাউটিং, ডায়নামিক API কন্ট্র্যাক্ট, DTO ডিকাপলিং এবং প্যারামিটার বাইন্ডিং (13 অ্যানোটেশন)

### `@AutoRestController`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **উদ্দেশ্য**: AutoApiController<E> প্রসারিতকারী ইন্টারফেসকে ৪০টি কন্ট্র্যাক্টের (Swagger UI-তে ডিফল্ট ৩৮টি দৃশ্যমান) রানটাইম JDK ডায়নামিক প্রক্সিতে রূপান্তর করে।
- **রানটাইম আচরণ**: বুটের সময় DynamicControllerProxyRegistrarHelper কন্ট্রোলার স্ক্যান করে RequestMappingHandlerMapping-এ রুট নিবন্ধন করে।
- **কীভাবে ব্যবহার করবেন**: `AutoApiController<E>` বা `AutoReadApi<E>`-কে প্রসারিত করা Java ইন্টারফেসে `@AutoRestController(basePath = "/api/v1/...")` যুক্ত করুন এবং `disabledEndpoints` ও DTO কনফিগার করুন।
- **কখন ব্যবহার করবেন**: বয়লারপ্লেট কোড ছাড়াই JPA এন্টিটির জন্য স্ট্যান্ডার্ড CRUD, ফিল্টারিং, পেজিনেশন বা কেবল-পঠনযোগ্য API প্রকাশ করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কংক্রিট `@RestController` ক্লাসে বা JPA এন্টিটিহীন কাজের জন্য ব্যবহার করবেন না; শুধু-পড়ার জন্য `AutoReadApi<E>` বেছে নিন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | না (ঐচ্ছিক) | `/` দিয়ে শুরু হওয়া বৈধ HTTP পাথ (যেমন `/api/v1/product-catalogs`) অথবা স্বয়ংক্রিয় নির্ধারণের জন্য ফাঁকা স্ট্রিং `""`।<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | স্পষ্ট রুট URI পাথ (যেমন "/api/v1/product-catalogs")। ফাঁকা থাকলে কন্ট্রোলারের নাম থেকে স্বয়ংক্রিয়ভাবে তৈরি হয়।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `path`-এর আগে `basePath` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `path` | `String` | `""` | না (ঐচ্ছিক) | `/` দিয়ে শুরু হওয়া বৈধ HTTP পাথ (যেমন `/api/v1/orders`) অথবা স্বয়ংক্রিয় নির্ধারণের জন্য ফাঁকা স্ট্রিং `""`।<br/>`@AutoRestController(path = "/api/v1/orders")` | বিকল্প রুট পাথ অ্যাট্রিবিউট। basePath ব্যবহার করা উত্তম কারণ রেজিস্ট্রার আগে সেটি পড়ে।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `path`-এর আগে `basePath` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `entityName` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"ProductCatalog"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoRestController(entityName = "ProductCatalog")` | OpenAPI/Studio মেটাডেটায় প্রদর্শিত এন্টিটির নাম পরিবর্তন করে।<br/>*সতর্কতা:* সরাসরি Swagger / OpenAPI 3.0 ও NWVMC Studio-তে প্রদর্শিত হয়; হার্ড-কোড এড়াতে `OpenApiConstant` ব্যবহার করুন। |
| `enabledEndpoints` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`।<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | অনুমোদিত কন্ট্র্যাক্ট মেথড নামের তালিকা (যেমন "getPage", "create")। ফাঁকা থাকলে সব মেথড সক্রিয়।<br/>*সতর্কতা:* কঠোর অনুমোদিত তালিকা হিসেবে কাজ করে: অ-ফাঁকা থাকলে তালিকার বাইরের কোনো মেথড Spring MVC বা Swagger UI-তে যুক্ত হয় না। |
| `disabledEndpoints` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`।<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | MVC ম্যাপিংয়ের আগে নির্দিষ্ট মেথড নিষ্ক্রিয় করার ব্ল্যাকলিস্ট।<br/>*সতর্কতা:* `enabledEndpoints`-এর পরে প্রযোজ্য; বাকি ৪০টি কন্ট্র্যাক্ট রেখে ঝুঁকিপূর্ণ ডিলিট বা বাল্ক এন্ডপয়েন্ট বন্ধে ব্যবহার করুন। |
| `enableNestedSubResources` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | পুনরাবৃত্তিমূলক GET /{id}/** সাব-রিসোর্স নেভিগেশন সক্রিয় করে। ডিফল্ট false।<br/>*সতর্কতা:* `GET /{id}/items/...` প্রয়োজন না হলে `false` রাখুন; চালু করলে `@EnableNestedSubResource` দিয়ে সম্পর্ক সীমিত করুন। |
| `readDto` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | যেকোনো কংক্রিট Java DTO ক্লাস (যেমন `ProductReadDto.class`) অথবা DTO ম্যাপিং বন্ধ করতে `Void.class`।<br/>`@AutoRestController(readDto = ProductReadDto.class)` | ঐচ্ছিক রিড DTO যা আউটপুট থেকে অভ্যন্তরীণ এন্টিটি ফিল্ড বাদ দেয়; ডিফল্ট Void.class।<br/>*সতর্কতা:* শুধুমাত্র রিড (GET) পাইপলাইনে প্রযোজ্য; DTO ক্লাসে নো-আর্গ কনস্ট্রাক্টর/গেটার থাকতে হবে এবং এটি `@Valid` সমর্থন করে। |
| `createDto` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | যেকোনো কংক্রিট Java DTO ক্লাস (যেমন `ProductCreateDto.class`) অথবা DTO ম্যাপিং বন্ধ করতে `Void.class`।<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | POST ম্যাপিংয়ের আগে Jakarta Validation দিয়ে যাচাই করা ঐচ্ছিক ক্রিয়েট DTO।<br/>*সতর্কতা:* শুধুমাত্র ক্রিয়েট (POST) পাইপলাইনে প্রযোজ্য; DTO ক্লাসে নো-আর্গ কনস্ট্রাক্টর/গেটার থাকতে হবে এবং এটি `@Valid` সমর্থন করে। |
| `updateDto` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | যেকোনো কংক্রিট Java DTO ক্লাস (যেমন `ProductUpdateDto.class`) অথবা DTO ম্যাপিং বন্ধ করতে `Void.class`।<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | PUT/PATCH আপডেটে অনুমোদিত ফিল্ড সীমিতকারী ঐচ্ছিক আপডেট DTO।<br/>*সতর্কতা:* শুধুমাত্র আপডেট (PUT/PATCH) পাইপলাইনে প্রযোজ্য; DTO ক্লাসে নো-আর্গ কনস্ট্রাক্টর/গেটার থাকতে হবে এবং এটি `@Valid` সমর্থন করে। |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: ডায়নামিক CRUD-এর পরিবর্তে MethodHandleCacheUtil দিয়ে একটি নির্দিষ্ট মেথডকে কাস্টম Spring বিন মেথডে রিডাইরেক্ট করে।
- **রানটাইম আচরণ**: EscapeHatchDispatchHelper টার্গেট বিন খুঁজে MethodHandleCacheUtil-এ MethodHandle ক্যাশ করে।
- **কীভাবে ব্যবহার করবেন**: কন্ট্রোলারের নির্দিষ্ট মেথডে `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` বসান এবং টার্গেট ক্লাসে `@Service`/`@Component` দিন।
- **কখন ব্যবহার করবেন**: যখন অধিকাংশ এন্ডপয়েন্ট স্বয়ংক্রিয় CRUD দিয়েই চলে, কিন্তু বিশেষ একটি রুট কাস্টম Java লজিক দাবি করে তখন ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `targetBean`-এ কখনোই String মান দেবেন না (`Class<?>` লাগে; নামের জন্য `beanName` দিন)। ডিক্লেয়ারেটিভ রুল কাজ করলে ওভাররাইড এড়িয়ে চলুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | কংক্রিট Spring `@Service`/`@Component` বিন ক্লাস (যেমন `OrderCustomService.class`), অথবা `beanName` দিয়ে খুঁজতে `Void.class`।<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | টার্গেট Spring বিন ক্লাস (beanName-এর চেয়ে অগ্রাধিকার পায়)।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `beanName`-এর আগে `targetBean` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `beanName` | `String` | `""` | না (ঐচ্ছিক) | ApplicationContext-এ নিবন্ধিত সঠিক বিন নাম (যেমন `"orderCustomService"`) অথবা স্বয়ংক্রিয় সমাধানের জন্য `""`।<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | targetBean Void.class হলে Spring কন্টেইনারের নির্দিষ্ট বিন নাম দিয়ে খুঁজে নেয়।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `beanName`-এর আগে `targetBean` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `methodName` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"createOrder"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | টার্গেট বিনে মেথডের নাম; ফাঁকা থাকলে কন্ট্রোলার মেথডের নাম ধরে নেয়।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"createOrder"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `bypassAutoDispatch` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (ডিফল্ট — ওভাররাইড চালু করে টার্গেট বিন চালায়) অথবা `false` (ওভাররাইড বন্ধ করে ডিফল্ট CRUD চালায়)।<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true হলে ডিফল্ট CRUD এড়িয়ে MethodHandleCacheUtil দিয়ে কাস্টম বিন চালায়।<br/>*সতর্কতা:* `true` হলে `EscapeHatchDispatchHelper` আপনার বিন চালায়; `false` দিলে `@ServiceOverride` সম্পূর্ণ নিষ্ক্রিয় হয়ে ডিফল্ট CRUD চলে (এটি প্রি/পোস্ট হুক নয়)। |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: ডোমেইন-নির্দিষ্ট ওয়ার্কফ্লো রুট (চেকআউট, রিফান্ড, অনুমোদন) স্বতন্ত্র Spring @Component Helper বিনে যুক্ত করে।
- **রানটাইম আচরণ**: সম্পূর্ণ যাচাইকরণ ও ট্রানজ্যাকশনসহ ক্যাশ করা MethodHandle দিয়ে delegateBean.delegateMethod চালায়।
- **কীভাবে ব্যবহার করবেন**: কন্ট্রোলার মেথডে `path`, `httpMethod`, `delegateBean` এবং `delegateMethod` বসিয়ে স্বতন্ত্র `@Component` হেল্পারে ডেলিগেট করুন।
- **কখন ব্যবহার করবেন**: চেকআউট, রিফান্ড, অনুমোদন বা একাধিক এন্টিটি জুড়ে ডোমেইন অ্যাকশন তৈরি করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@CustomEndpoint`-এ প্রক্সি ইন্টারসেপ্টর আশা করবেন না (এটি সরাসরি ডেলিগেট বিনে যায়); `@Service`-এ AOP দিন এবং সহজ কাজের জন্য `@BusinessAction` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/reports/monthly-sales`); `""` রুট পাথে বাইন্ড হয়।<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | কন্ট্রোলারের basePath-এর অধীনে আপেক্ষিক পাথ (যেমন "/checkout")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `path` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `httpMethod` | `String` | `"GET"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`।<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP মেথড ("GET", "POST", "PUT", "PATCH", "DELETE")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `httpMethod` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `delegateBean` | `String` | `""` | না (ঐচ্ছিক) | ApplicationContext-এ নিবন্ধিত সঠিক বিন নাম (যেমন `"orderReportService"`) অথবা স্বয়ংক্রিয় সমাধানের জন্য `""`।<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | ওয়ার্কফ্লো হ্যান্ডলার মেথড ধারণকারী Spring বিনের নাম (ফাঁকা থাকলে CustomEndpointInvokerHelper ত্রুটি দেয়)।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `delegateBean` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `delegateMethod` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"buildMonthlyReport"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean-এর লক্ষ্য মেথডের নাম; ফাঁকা থাকলে কন্ট্রোলার মেথড।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"buildMonthlyReport"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `summary` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"Get monthly revenue breakdown"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI-তে প্রদর্শিত সংক্ষিপ্ত OpenAPI 3.0 সারসংক্ষেপ।<br/>*সতর্কতা:* সরাসরি Swagger / OpenAPI 3.0 ও NWVMC Studio-তে প্রদর্শিত হয়; হার্ড-কোড এড়াতে `OpenApiConstant` ব্যবহার করুন। |
| `description` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"Aggregates confirmed invoice totals grouped by currency"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI-তে এন্ডপয়েন্ট বিস্তারিত করলে প্রদর্শিত OpenAPI 3.0 বিবরণ।<br/>*সতর্কতা:* সরাসরি Swagger / OpenAPI 3.0 ও NWVMC Studio-তে প্রদর্শিত হয়; হার্ড-কোড এড়াতে `OpenApiConstant` ব্যবহার করুন। |

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

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: স্ট্যাটিক Spring Web ইমপোর্ট ছাড়া @GetMapping-এর পিওর Java বিকল্প।
- **রানটাইম আচরণ**: প্রক্সি বুটস্ট্র্যাপে HTTP GET RequestMappingInfo হিসেবে ম্যাপিং হয়।
- **কীভাবে ব্যবহার করবেন**: `@AutoRestController` ইন্টারফেসের মেথডে `@AutoGet("/your-path")` বসান (`@ServiceOverride` বা `@CustomQuery`-এর সাথে)।
- **কখন ব্যবহার করবেন**: Spring Web `@GetMapping` ইমপোর্ট না করেই পিওর Java ইন্টারফেসে কেবল-পড়ার HTTP GET রুট যোগ করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: ডেটা পরিবর্তন বা মুছে ফেলার জন্য ব্যবহার করবেন না; এবং প্রথাগত `@RestController` ক্লাসে ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/{id}/summary`); `""` রুট পাথে বাইন্ড হয়।<br/>`@AutoGet("/{id}/summary")` | আপেক্ষিক GET পাথ টেমপ্লেট (যেমন "/metrics")। ফাঁকা থাকলে মূল basePath-এ ম্যাপ হয়।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `produces` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json", "text/csv"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | ঐচ্ছিক আউটপুট মিডিয়া টাইপ (যেমন "text/event-stream", "text/csv")।<br/>*সতর্কতা:* Spring MVC HTTP `Accept` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: কাস্টম consumes/produces মিডিয়া টাইপ সমর্থনসহ পিওর Java HTTP POST রুট।
- **রানটাইম আচরণ**: SpringMvcEndpointBridge-এ HTTP POST হ্যান্ডলার হিসেবে নিবন্ধিত হয়।
- **কীভাবে ব্যবহার করবেন**: ক্রিয়েট বা অ্যাকশন মেথডে `@AutoPost("/path")` দিয়ে `@AutoBody`/`@RequestBody` বাইন্ড করুন এবং `@BusinessAction` বা `@ServiceOverride` যুক্ত করুন।
- **কখন ব্যবহার করবেন**: রিসোর্স তৈরি, অ্যাকশন কমান্ড বা ব্যাচ সাবমিশনের POST রুটের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: পড়ার জন্য (`@AutoGet`), পূর্ণ আপডেটের জন্য (`@AutoPut`) বা মুছে ফেলার জন্য (`@AutoDelete`) ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/{id}/approve`); `""` রুট পাথে বাইন্ড হয়।<br/>`@AutoPost("/{id}/approve")` | basePath-এর অধীনে আপেক্ষিক POST পাথ টেমপ্লেট।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `consumes` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json", "multipart/form-data"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | অনুমোদিত রিকোয়েস্ট Content-Type মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Content-Type` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |
| `produces` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | প্রতিক্রিয়ায় উৎপন্ন মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Accept` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: সম্পূর্ণ রিসোর্স প্রতিস্থাপনের জন্য পিওর Java HTTP PUT রুট ম্যাপিং।
- **রানটাইম আচরণ**: ট্রানজ্যাকশনাল এক্সিকিউশনের ভেতর HTTP PUT হ্যান্ডলার হিসেবে বাঁধা থাকে।
- **কীভাবে ব্যবহার করবেন**: সম্পূর্ণ আপডেট মেথডে `@AutoPut("/{id}")` বসিয়ে `@AutoVariable` ও `@AutoBody` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: সম্পূর্ণ রিসোর্স স্টেট দিয়ে আইডেমপোটেন্ট প্রতিস্থাপনের PUT রুটে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: আংশিক ফিল্ড আপডেটের জন্য ব্যবহার করবেন না (`@AutoPatch` বা `@BusinessAction` বেছে নিন)।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/{id}/replace`); `""` রুট পাথে বাইন্ড হয়।<br/>`@AutoPut("/{id}/replace")` | আপেক্ষিক PUT পাথ টেমপ্লেট (যেমন "/{id}")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `consumes` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | সমর্থিত রিকোয়েস্ট Content-Type মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Content-Type` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |
| `produces` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | উৎপন্ন রেসপন্স মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Accept` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: আংশিক মার্জ, অ্যাটমিক ইনক্রিমেন্ট এবং RFC 6902 JSON Patch সমর্থিত পিওর Java HTTP PATCH।
- **রানটাইম আচরণ**: JSON মার্জ সিম্যান্টিক্স এবং application/json-patch+json সমর্থন করে।
- **কীভাবে ব্যবহার করবেন**: আংশিক আপডেট বা `@BusinessAction` মেথডে `@AutoPatch("/{id}/action")` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: আংশিক ফিল্ড পরিবর্তন, অ্যাটমিক কাউন্টার বা স্টেট ট্রানজিশনের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: সম্পূর্ণ প্রতিস্থাপন (`@AutoPut`) বা নতুন রেকর্ড তৈরির (`@AutoPost`) জন্য ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/{id}/status`); `""` রুট পাথে বাইন্ড হয়।<br/>`@AutoPatch("/{id}/status")` | আপেক্ষিক PATCH পাথ টেমপ্লেট (যেমন "/{id}/approve")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `consumes` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json", "application/merge-patch+json"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | গৃহীত Content-Type মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Content-Type` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |
| `produces` | `String[]` | `{}` | না (ঐচ্ছিক) | MIME মিডিয়া টাইপের অ্যারে (যেমন `{"application/json"}`); ফাঁকা `{}` ডিফল্ট `application/json` ব্যবহার করে।<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | উৎপন্ন রেসপন্স মিডিয়া টাইপ।<br/>*সতর্কতা:* Spring MVC HTTP `Accept` দিয়ে কন্টেন্ট নেগোসিয়েশন যাচাই করে; অমিল হেডারে `406` বা `415` রিটার্ন হয়। |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: স্টেট-সুরক্ষিত সফট ডিলিশন চালু করা পিওর Java HTTP DELETE ঘোষণা।
- **রানটাইম আচরণ**: deleted=true নির্ধারণের আগে @StateMachine deletableStates যাচাই করে।
- **কীভাবে ব্যবহার করবেন**: কাস্টম ডিলিট মেথডে সাধারণত `@ServiceOverride`-এর সাথে `@AutoDelete("/{id}/custom")` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: কাস্টম আর্কাইভ, সফট-ডিলিট বা ক্যাসকেড ক্লিনআপ DELETE এন্ডপয়েন্টের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: স্ট্যান্ডার্ড সফট-ডিলিট এবং `@StateMachine` যথেষ্ট হলে অযথা পুনরায় লিখবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ঐচ্ছিক `{pathVar}` টেমপ্লেটসহ আপেক্ষিক URI সাব-পাথ (যেমন `/{id}/archive`); `""` রুট পাথে বাইন্ড হয়।<br/>`@AutoDelete("/{id}/archive")` | আপেক্ষিক DELETE পাথ টেমপ্লেট (যেমন "/{id}/purge")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **উদ্দেশ্য**: URL কুয়েরি প্যারামিটার বা Map<String, String> ডায়নামিক ফিল্টার ম্যাপ বাইন্ড করে।
- **রানটাইম আচরণ**: QueryGuardrailEnforcerUtil যাচাইসহ DynamicQueryParameterParserHelper দ্বারা নিষ্কাশিত হয়।
- **কীভাবে ব্যবহার করবেন**: মেথড প্যারামিটারে `@AutoParam("status")` বা `defaultValue` সেট করুন।
- **কখন ব্যবহার করবেন**: ইন্টারফেসকে 100% পিওর Java রেখে কুয়েরি প্যারামিটার বাইন্ড করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: পাথ ভেরিয়েবলের জন্য (`@AutoVariable`) বা JSON বডির জন্য (`@AutoBody`) ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"status"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoParam("status") String status` | বাইন্ড করার কুয়েরি প্যারামিটারের নাম; ফাঁকা থাকলে Java প্যারামিটার নাম নেয়।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `name`-এর আগে `value` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `name` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"pageSize"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | সুস্পষ্ট কুয়েরি প্যারামিটারের নাম।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `name`-এর আগে `value` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `required` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (বাধ্যতামূলক; না থাকলে HTTP 400) অথবা `false` (ঐচ্ছিক; অনুপস্থিত হলে null পাঠানো হয়)।<br/>`@AutoParam(name = "keyword", required = false) String keyword` | অনুপস্থিত থাকলে HTTP 400 এরর দেবে কিনা।<br/>*সতর্কতা:* `defaultValue` দিলে স্বয়ংক্রিয়ভাবে ঐচ্ছিক হয়; `false` হলে NPE এড়াতে প্রিমিটিভের বদলে র‍্যাপার টাইপ (`Integer`) ব্যবহার করুন। |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"20"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | প্যারামিটার না থাকলে ফলব্যাক মান (ডিফল্ট DEFAULT_NONE সেন্টিনেল)।<br/>*সতর্কতা:* স্ট্রিং থেকে Spring `ConversionService` দিয়ে টার্গেট টাইপে রূপান্তরিত হয়; ভুল মানে HTTP `400` আসে। |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **উদ্দেশ্য**: UUIDv7 সত্তার ID-র মতো URI পাথ ভেরিয়েবল বাইন্ড করে।
- **রানটাইম আচরণ**: MVC পাথ টেমপ্লেট থেকে টাইপড Java UUID/String মানে পার্স হয়।
- **কীভাবে ব্যবহার করবেন**: `findById(@AutoVariable("id") UUID id)`-এর মতো পাথ প্যারামিটারে বসান।
- **কখন ব্যবহার করবেন**: পিওর Java ইন্টারফেসে URI থেকে `{id}`, `{slug}` বা `{code}` নিতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কুয়েরি প্যারামিটার (`@AutoParam`) বা বডি (`@AutoBody`)-র জন্য ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"orderId"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoVariable("orderId") UUID orderId` | বাইন্ড করার URI পাথ ভেরিয়েবল নাম।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `name`-এর আগে `value` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `name` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"tenantCode"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | সুস্পষ্ট URI পাথ ভেরিয়েবল নাম।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `name`-এর আগে `value` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `required` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (বাধ্যতামূলক; না থাকলে HTTP 400) অথবা `false` (ঐচ্ছিক; অনুপস্থিত হলে null পাঠানো হয়)।<br/>`@AutoVariable(name = "id", required = true) UUID id` | পাথ ভেরিয়েবল বাধ্যতামূলক কিনা।<br/>*সতর্কতা:* URI টেমপ্লেটের `{variableName}`-এর সাথে নাম মিলতে হবে; কেবল ঐচ্ছিক URI প্যাটার্নে `false` প্রযোজ্য। |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **উদ্দেশ্য**: @Valid-এর সাথে DTO বা Entity প্যারামিটারে HTTP JSON পেলোড ডিসিরিয়ালাইজ করে।
- **রানটাইম আচরণ**: সার্ভিস ট্রানজ্যাকশনে প্রবেশের আগে LocalValidatorFactoryBean দিয়ে যাচাই করা হয়।
- **কীভাবে ব্যবহার করবেন**: `@AutoPost`/`@AutoPut`/`@AutoPatch` মেথডের পেলোড প্যারামিটারে `@AutoBody` (`@Valid` সহ) ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: পিওর Java প্রক্সি কন্ট্রোলারে JSON পেলোড এন্টিটি বা DTO-তে রূপান্তর করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: বডিবিহীন GET/DELETE মেথডে দেবেন না বা একই মেথডে একাধিক `@AutoBody` রাখবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (বাধ্যতামূলক; না থাকলে HTTP 400) অথবা `false` (ঐচ্ছিক; অনুপস্থিত হলে null পাঠানো হয়)।<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | রিকোয়েস্ট বডি না থাকলে HTTP 400 এরর দেবে কিনা।<br/>*সতর্কতা:* প্রক্সি ডিসপ্যাচের আগে Jakarta ভ্যালিডেশনের জন্য `@Valid` যুক্ত করুন; `false` খালি বডি গ্রহণ করে। |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: চক্রীয় লুপ প্রতিরোধসহ GET /{id}/{relation}/** দিয়ে চাইল্ড সম্পর্ক রিকার্সিভ নেভিগেশন অনুমোদন করে।
- **রানটাইম আচরণ**: কন্ট্রোলারে @AutoRestController(enableNestedSubResources = true) সক্রিয় থাকতে হবে।
- **কীভাবে ব্যবহার করবেন**: `@AutoRestController`-এ `enableNestedSubResources = true` দিন এবং `@EnableNestedSubResource(allowedRelationships = {"items"})` দিয়ে সীমাবদ্ধ করুন।
- **কখন ব্যবহার করবেন**: যখন `GET /api/v1/customer-orders/{id}/items`-এর মতো নেস্টেড প্যারেন্ট-চাইল্ড URL এবং প্রতি ধাপে নিরাপত্তা প্রয়োজন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `allowedRelationships` সীমাবদ্ধ না করে বেশি সংযুক্ত টেবিলে বা ভিন্ন বাউন্ডেড কনটেক্সটে চালু করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)।<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | GET /{id}/** ভ্রমণে অনুমোদিত টার্গেট JPA এন্টিটি ক্লাসের ঐচ্ছিক তালিকা।<br/>*সতর্কতা:* ফাঁকা অ্যারে সব চাইল্ড এন্টিটি খুলে দেয়; অভ্যন্তরীণ টেবিল সুরক্ষিত রাখতে নির্দিষ্ট ক্লাস তালিকা দিন। |
| `allowedRelationships` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `"items"`, `"payments"`, `"shipments"` (JPA field names)।<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | সাব-রিসোর্স URL-এ অনুমোদিত JPA রিলেশনশিপ ফিল্ড নামের তালিকা।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"items"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: কাস্টম অ্যাকশন মেথডে ডোমেইন স্টেট ট্রানজিশন বা সংখ্যাসূচক সমন্বয় ঘোষণা করে।
- **রানটাইম আচরণ**: আপডেটকৃত সত্তা সংরক্ষণের আগে অ্যাটমিকভাবে কার্যকর হয়।
- **কীভাবে ব্যবহার করবেন**: কন্ট্রোলার ইন্টারফেস মেথডে `@AutoPatch`-এর সাথে `@BusinessAction` যুক্ত করুন।
- **কখন ব্যবহার করবেন**: সার্ভিস না লিখেই একক এন্টিটির স্টেট পরিবর্তন বা সংখ্যাসূচক সমন্বয়ের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একাধিক এন্টিটি সমন্বয় বা এক্সটার্নাল API কলের জন্য ব্যবহার করবেন না (`@ServiceOverride` ব্যবহার করুন)।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির লাইফসাইকেল স্ট্যাটাস ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"status"`)।<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | এন্টিটিতে স্টেট ধারণকারী ফিল্ডের নাম (@StateMachine দ্বারা যাচাইকৃত)।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"status"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `targetStateValue` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"APPROVED"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | ট্রানজ্যাকশনের ভেতর targetStateField-এ বসানোর নতুন স্টেট মান।<br/>*সতর্কতা:* সেভের আগে `@StateMachine` বা `@HumanPolicy` অনুযায়ী যাচাই হয়; অবৈধ ট্রানজিশনে ট্রানজ্যাকশন রোলব্যাক হয়। |
| `adjustNumericField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির সংখ্যাসূচক ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"stockQuantity"`)।<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | অ্যাটমিকভাবে বাড়ানো বা কমানো হবে এমন সংখ্যাসূচক ফিল্ডের নাম।<br/>*সতর্কতা:* `deltaParamIndex >= 0` বা `fixedDelta` দিতে হবে। `Integer`, `Long`, `BigDecimal` ও `Double` সমর্থন করে। |
| `deltaParamIndex` | `int` | `-1` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `-1` (disabled) or `0`-based method argument index (e.g., `1`)।<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | ডায়নামিক ডেল্টা বহনকারী মেথড প্যারামিটারের ০-ভিত্তিক সূচক (-1 মানে বন্ধ)।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `fixedDelta`-এর আগে `deltaParamIndex` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `fixedDelta` | `String` | `""` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`।<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | ডেল্টা প্যারামিটার না থাকলে ব্যবহৃত স্থির সংখ্যা স্ট্রিং (যেমন "100", "-1")।<br/>*সতর্কতা:* স্টার্টআপে রেজিস্ট্রার `fixedDelta`-এর আগে `deltaParamIndex` পড়ে। উভয়ে পরস্পরবিরোধী মান দেবেন না। |
| `entityMethod` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"markFulfilled"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@BusinessAction(entityMethod = "markFulfilled")` | একই ট্রানজ্যাকশনের ভেতর এন্টিটিতে চালানোর জন্য আর্গুমেন্ট-বিহীন মেথডের নাম।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"markFulfilled"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean ডিসকভারি, কনফিগারেশন বাইন্ডিং এবং এক্সিকিউশন অর্ডার (5 অ্যানোটেশন)

### `@AutoComponent`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: কম্পাইল-টাইমে @Component ইমপোর্ট ছাড়াই বুটে নিবন্ধিত কম্পোনেন্ট মার্কার।
- **রানটাইম আচরণ**: ফ্রেমওয়ার্কের নিজস্ব প্যাকেজে (io.github.natswarchuan) স্ক্যান হয়; অ্যাপ কোডে Spring @Component ব্যবহার করুন।
- **কীভাবে ব্যবহার করবেন**: `AutoBeanFactoryRegistrarBridge` দ্বারা `io.github.natswarchuan` প্যাকেজে স্ক্যানকৃত অভ্যন্তরীণ কম্পোনেন্ট।
- **কখন ব্যবহার করবেন**: শুধুমাত্র `io.github.natswarchuan.*` ফ্রেমওয়ার্কের অভ্যন্তরীণ ক্লাস তৈরিতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কনজিউমার অ্যাপে (`com.example.*`) কখনোই ব্যবহার করবেন না! এটি শুধু `io.github.natswarchuan` স্ক্যান করে; Spring `@Component` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ApplicationContext-এ নিবন্ধিত সঠিক বিন নাম (যেমন `"invoiceValidationHelper"`) অথবা স্বয়ংক্রিয় সমাধানের জন্য `""`।<br/>`@AutoComponent("invoiceValidationHelper")` | ঐচ্ছিক বিন নাম; ফাঁকা থাকলে ক্লাস নামের camelCase ব্যবহৃত হয়।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: @ServiceOverride-এর সাথে যুক্ত ServiceImpl ক্লাসের জন্য সার্ভিস-লেয়ার মার্কার।
- **রানটাইম আচরণ**: io.github.natswarchuan প্যাকেজে ক্লাসের নামে নিবন্ধিত হয়; অ্যাপ সার্ভিসে Spring @Service ব্যবহার করুন।
- **কীভাবে ব্যবহার করবেন**: শুধু `io.github.natswarchuan`-এর ভেতরে অভ্যন্তরীণ সার্ভিস নিবন্ধনের জন্য।
- **কখন ব্যবহার করবেন**: শুধুমাত্র `io.github.natswarchuan.*` কোর সার্ভিসের জন্য।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: অ্যাপের ব্যবসায়িক সার্ভিসে ব্যবহার করবেন না — Spring `@Service` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ApplicationContext-এ নিবন্ধিত সঠিক বিন নাম (যেমন `"orderFulfillmentService"`) অথবা স্বয়ংক্রিয় সমাধানের জন্য `""`।<br/>`@AutoService("orderFulfillmentService")` | ঐচ্ছিক সার্ভিস বিনের নাম।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: @AutoConfigurationBean ক্লাসের ভেতর ম্যানেজড বিন ফ্যাক্টরি মেথড ঘোষণা করে।
- **রানটাইম আচরণ**: অটো-কনফিগারেশনের সময় PureJavaBeanRegistrarBridge দ্বারা প্রক্রিয়াকৃত হয়।
- **কীভাবে ব্যবহার করবেন**: ফ্রেমওয়ার্কের `@AutoConfigurationBean` ক্লাসের ফ্যাক্টরি মেথডে ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: শুধু `io.github.natswarchuan.config.*` কনফিগ ক্লাসে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: আপনার `@Configuration` ক্লাসে ব্যবহার করবেন না; Spring `@Bean` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `{"primaryObjectMapper", "nwvmcMapper"}`।<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | বিন নাম ও উপনাম অ্যারে।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `targetTypeName` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"com.example.spi.PaymentGateway"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | টার্গেট স্প্রিং টাইপের ঐচ্ছিক পূর্ণ নাম।<br/>*সতর্কতা:* ফ্যাক্টরি মেথড সুপারটাইপ বা প্রক্সি রিটার্ন করলে সম্পূর্ণ ক্লাস নাম দেয়; ক্লাসপাথে উপস্থিতি নিশ্চিত করুন। |
| `primary` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (একাধিক প্রার্থী থাকলে অগ্রাধিকারপ্রাপ্ত বিন) অথবা `false` (সাধারণ অগ্রাধিকার)।<br/>`@AutoBean(primary = true)` | ইনজেকশন দ্বন্দ্বে এই বিনটিকে প্রাথমিক হিসেবে চিহ্নিত করে।<br/>*সতর্কতা:* একই টাইপের জন্য দুটি `@AutoBean(primary = true)` দিলে স্টার্টআপে বিন দ্বন্দ্ব তৈরি হয়। |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: কনফিগারেশন ক্লাস ও YAML প্রোপার্টি বাইন্ডিং মডেল চিহ্নিত করে।
- **রানটাইম আচরণ**: IDE মেটাডেটাসহ কনফিগারেশন বিন ও YAML প্রিফিক্স নিবন্ধন করে।
- **কীভাবে ব্যবহার করবেন**: `io.github.natswarchuan.config.*`-এর কনফিগ ও প্রপার্টিজ ক্লাসে ব্যবহৃত হয়।
- **কখন ব্যবহার করবেন**: শুধুমাত্র ফ্রেমওয়ার্কের ভেতরে Pure Java `@Configuration` হিসেবে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কনজিউমার অ্যাপে ব্যবহার করবেন না; Spring `@Configuration` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | ApplicationContext-এ নিবন্ধিত সঠিক বিন নাম (যেমন `"storageAutoConfig"`) অথবা স্বয়ংক্রিয় সমাধানের জন্য `""`।<br/>`@AutoConfigurationBean("storageAutoConfig")` | ঐচ্ছিক কনফিগারেশন বিনের নাম।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `prefix` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"nwvmc.storage"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | ঐচ্ছিক YAML প্রপার্টি প্রিফিক্স (যেমন "app.framework.cache")।<br/>*সতর্কতা:* `application.yml`-এর প্রপার্টি বাইন্ড করে; IDE সতর্কতা এড়াতে metadata ফাইলের সাথে যুক্ত করুন। |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **উদ্দেশ্য**: SPI Customizer বিন এবং ফিল্টার চেইনের মধ্যে কার্যকরী অগ্রাধিকার ক্রম নিয়ন্ত্রণ করে।
- **রানটাইম আচরণ**: কম পূর্ণসংখ্যা মান আগে কার্যকর হয় (ডিফল্ট Integer.MAX_VALUE)।
- **কীভাবে ব্যবহার করবেন**: `AutoBeanFactoryRegistrarBridge` দ্বারা সাজানো কম্পোনেন্টে `@OrderPriority(1)` বসান।
- **কখন ব্যবহার করবেন**: একাধিক SPI কাস্টমাইজার বা ফ্রেমওয়ার্ক বিনের নির্ধারিত ক্রম দরকার হলে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: সিকিউরিটি ফিল্টার ক্রম বা `?sort=` কুয়েরি প্যারামিটারের সাথে গুলিয়ে ফেলবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)।<br/>`@OrderPriority(10)` | অগ্রাধিকার পূর্ণসংখ্যা; ছোট মান আগে চলে (Integer.MAX_VALUE সর্বনিম্ন)।<br/>*সতর্কতা:* ছোট সংখ্যা আগে চলে (Spring `@Order`-এর মতো)। নিরাপত্তা ও ট্রেসিংয়ের জন্য `< 0` এবং ব্যবসায়িক লজিকের জন্য `10..100` রাখুন। |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. এনটিটি নিরাপত্তা, স্টেট মেশিন, ডেটা ইন্টিগ্রিটি, অটো-জেনারেটর এবং কোয়েরি (11 অ্যানোটেশন)

### `@EntitySecurity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: ডেটা কোয়েরি বা পরিবর্তনের আগে NIST Level 2 RBAC, ownerField আইসোলেশন ও পারমিশন কোড প্রয়োগ করে।
- **রানটাইম আচরণ**: SQL চালানোর আগে যাচাই হয়; অননুমোদিত প্রবেশে HTTP 403 Forbidden ছোড়ে।
- **কীভাবে ব্যবহার করবেন**: JPA এন্টিটিতে `@EntitySecurity` যুক্ত করে রোল ও `ownerField` কনফিগার করুন।
- **কখন ব্যবহার করবেন**: REST, ব্যাচ, এক্সপোর্ট এবং GraphQL জুড়ে নিরাপত্তার জন্য প্রতিটি উন্মুক্ত এন্টিটিতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `AutoReadApi<E>`, `disabledEndpoints` বা `@SecurityPolicyEntity` ছাড়া সম্পূর্ণ CRUD-এ `permitAll = true` দেবেন না (এটি READ/WRITE/DELETE সব চেক বাইপাস করে)।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_USER", "ROLE_ADMIN"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | রেকর্ড পড়ার (GET/GraphQL/Export) অনুমোদিত রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |
| `writeRoles` | `String[]` | `{}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_MANAGER", "ROLE_ADMIN"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | POST/PUT/PATCH এবং ইমপোর্টের জন্য অনুমোদিত রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |
| `deleteRoles` | `String[]` | `{}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | DELETE ও ব্যাচ ডিলিটের অনুমোদিত রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |
| `permitAll` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (লগইন ছাড়াই উন্মুক্ত প্রবেশাধিকার) অথবা `false` (প্রমাণীকরণ ও রোল যাচাই বাধ্যতামূলক)।<br/>`@EntitySecurity(permitAll = true)` | true হলে (DB-RBAC ছাড়া) READ, WRITE ও DELETE সব চেক বাইপাস করে; পাবলিক ক্যাটালগে AutoReadApi<E> ব্যবহার করুন।<br/>*সতর্কতা:* রোল যাচাই এড়িয়ে অজ্ঞাত প্রবেশাধিকার দেয়; সংবেদনশীল বা আর্থিক এন্টিটিতে কখনোই ব্যবহার করবেন না। |
| `ownerField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির মালিক/UUID ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"createdBy"`)।<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | মালিক শনাক্তকারী ফিল্ড ("createdBy") — IDOR প্রতিরোধ করে।<br/>*সতর্কতা:* সারি-ভিত্তিক মালিকানা ফিল্টার প্রয়োগ করে; `bypassOwnerRoles` না থাকলে ব্যবহারকারী কেবল নিজের রেকর্ড দেখতে/বদলাতে পারে। |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | `ownerField` মালিকানা যাচাই এড়িয়ে যাওয়ার অনুমোদিত অ্যাডমিন রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |
| `permissions` | `String[]` | `{}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ORDER_READ", "ORDER_APPROVE"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | রোলের পাশাপাশি সূক্ষ্ম পারমিশন কোডের তালিকা (DB RBAC দ্বারা মূল্যায়িত)।<br/>*সতর্কতা:* JWT বা DB-RBAC `@SecurityPermissionEntity`-এর সূক্ষ্ম অনুমতির সাথে মিলিয়ে যাচাই হয়। |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: ভূমিকার অনুমতি না থাকলে সংবেদনশীল কলাম ডায়নামিকভাবে মাস্ক বা নাল করে।
- **রানটাইম আচরণ**: ডেটা ফেচের পর JSON সিরিয়ালাইজেশনের আগে প্রয়োগ হয়।
- **কীভাবে ব্যবহার করবেন**: সংবেদনশীল ফিল্ডে (`costPrice`, `ssn`) বসান; ফ্রেমওয়ার্ক ডেটাবেস অপরিবর্তিত রেখে কপিতে মাস্ক করে।
- **কখন ব্যবহার করবেন**: যখন একই এন্টিটি মডেল বিভিন্ন রোলের কাছে সংবেদনশীল তথ্য আড়াল করে পরিবেশন করতে হয়।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: অ-`String` ফিল্ড এমনিতেই `null` হয়; `String` ফিল্ডকে `"******"`-এর বদলে `null` করতে `nullifyInsteadOfMask = true` দিন, আর JSON কী বাদ দিতে `readDto` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_ADMIN", "ROLE_FINANCE"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | আসল মান দেখার অনুমোদিত রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |
| `maskPattern` | `String` | `"******"` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"***-**-****"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | রোল না থাকলে String ফিল্ডে ব্যবহৃত মাস্ক প্যাটার্ন।<br/>*সতর্কতা:* `nullifyInsteadOfMask = true` হলে উপেক্ষিত হয়। অ-স্ট্রিং ফিল্ডে (`BigDecimal`, `LocalDate`) `nullifyInsteadOfMask = true` ব্যবহার করুন। |
| `nullifyInsteadOfMask` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (অনুমতি না থাকলে ফিল্ডকে null করুন) অথবা `false` (maskPattern স্ট্রিং দিয়ে মাস্ক করুন)।<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true হলে String ফিল্ডও maskPattern-এর বদলে null হয় (অ-String টাইপগুলো এমনিতেই স্বয়ংক্রিয়ভাবে null হয়)।<br/>*সতর্কতা:* সংখ্যা, তারিখ ও অবজেক্ট ফিল্ডে অপরিহার্য যাতে TypeScript/Zod ক্লায়েন্ট বৈধ `null` পায়। |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: POST /{id}/transition-এ বৈধ স্টেট ট্রানজিশন প্রয়োগ করে এবং DELETE /{id}-কে deletableStates-এ সীমাবদ্ধ রাখে।
- **রানটাইম আচরণ**: অবৈধ রূপান্তর বা মুছে ফেলা HTTP 422 BusinessRuleViolationException দিয়ে বাতিল করে।
- **কীভাবে ব্যবহার করবেন**: String স্টেট ফিল্ডে `:` দিয়ে (`"CREATED:PAID,CANCELLED"`) ট্রানজিশন লিখুন।
- **কখন ব্যবহার করবেন**: অর্ডার বা লোন অনুমোদনের মতো কঠোর লাইফসাইকেল নিয়ন্ত্রণে (HTTP `422`) ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কখনোই `"->"` সিনট্যাক্স ব্যবহার করবেন না (`:` ব্যবহার করতে হবে)!

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"CREATED"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | তৈরির সময় ফিল্ড ফাঁকা থাকলে স্বয়ংক্রিয় প্রাথমিক স্টেট ("ACTIVE")।<br/>*সতর্কতা:* `POST` তৈরির সময় ফিল্ড ফাঁকা থাকলে স্বয়ংক্রিয়ভাবে বসে; `transitions`-এ `:`-এর বাম দিকের নামের সাথে মিলতে হবে। |
| `transitions` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)।<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | অনুমোদিত স্টেট ট্রানজিশন নিয়ম "FROM:TO_1,TO_2" ফরম্যাটে।<br/>*সতর্কতা:* সঠিক কোলন সিনট্যাক্স `"FROM:TO1,TO2"` অনুসরণ করে (কমা-বিচ্ছিন্ন লক্ষ্য); অঘোষিত ট্রানজিশন HTTP `422` দিয়ে বাতিল হয়। |
| `deletableStates` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)।<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | কোন কোন স্টেটে রেকর্ড DELETE করা যাবে তার তালিকা (অন্যথায় HTTP 422)।<br/>*সতর্কতা:* অ-ফাঁকা থাকলে অন্য কোনো অবস্থায় (যেমন `"PAID"`) `DELETE` করলে HTTP `422 Unprocessable Entity` আসে। |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: সহজপাঠ্য পলিসি বাক্যকে সক্রিয় RBAC, ট্রানজিশন ও মাস্কিং নিয়মে কম্পাইল করে।
- **রানটাইম আচরণ**: GET /human-policy-তে দেখা যায় এবং YAML-এ spring-nwvmc.human-policies.<Entity> দিয়ে ওভাররাইডযোগ্য।
- **কীভাবে ব্যবহার করবেন**: এন্টিটিতে `@HumanPolicy` বা `application.yml`-এ `spring-nwvmc.human-policies` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: যখন প্রোডাক্ট বা কমপ্লায়েন্স টিম মানুষের পাঠযোগ্য নিয়ম YAML-এ রাখতে চান।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: ইংরেজি ছাড়া অন্য ভাষা বা এলোমেলো গদ্য লিখবেন না — রেজেক্স কম্পাইলার নির্দিষ্ট প্যাটার্ন চেনে।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`।<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | স্বাভাবিক ইংরেজি লাইফসাইকেল নির্দেশনা যা স্টেট ট্রানজিশনে রূপান্তরিত হয়।<br/>*সতর্কতা:* স্টার্টআপে `@StateMachine` ইঞ্জিনে কম্পাইল হয়; একই এন্টিটিতে বিরোধপূর্ণ নিয়ম লিখবেন না। |
| `security` | `String` | `""` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`।<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | পড়া/লেখা/মোছা ও মালিকানার ইংরেজি RBAC নির্দেশনা।<br/>*সতর্কতা:* রোলে স্বয়ংক্রিয়ভাবে `ROLE_` প্রিফিক্স যুক্ত হয় এবং স্টার্টআপে সিনট্যাক্স যাচাই হয়। |
| `masking` | `String` | `""` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`।<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | মাস্কিং ফিল্ড ও দর্শক রোলের ইংরেজি নীতিমালা।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"costPrice"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `stateField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির লাইফসাইকেল স্ট্যাটাস ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"orderStatus"`)।<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | এন্টিটির যে ফিল্ডে স্টেট মান থাকে।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"orderStatus"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: টাইম-ট্রাভেল অবস্থা পুনর্গঠন ও /diff পরিদর্শনের জন্য ফিল্ড-স্তরের পরিবর্তন লিপিবদ্ধ করে।
- **রানটাইম আচরণ**: create, update, patch, transition ও restore-এ oldValue ও newValue পরিবর্তন ধারণ করে।
- **কীভাবে ব্যবহার করবেন**: `BaseAuditEntity` ক্লাসে `@AuditTrail` যোগ করুন; প্রতিটি পরিবর্তন স্বয়ংক্রিয়ভাবে রেকর্ড হবে।
- **কখন ব্যবহার করবেন**: অর্থনীতি, স্বাস্থ্যসেবা বা কমপ্লায়েন্স ডেটায় `GET /api/v1/system/time-travel/{entityName}/{id}` অডিট ট্র্যাকিংয়ের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: অতি উচ্চ-গতির লগ বা টেলিমেট্রি টেবিলে ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"FINANCE_LEDGER"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | অডিট ইভেন্টে নথিভুক্ত ক্যাটাগরির নাম; ফাঁকা থাকলে এন্টিটি নাম।<br/>*সতর্কতা:* অডিট লগ ট্যাগ ও ফিল্টারের জন্য; `""` রাখলে JPA এন্টিটির ক্লাস নাম ব্যবহৃত হয়। |
| `recordFieldDiffs` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true হলে Time-Travel-এর জন্য পুরনো বনাম নতুন ফিল্ডের পার্থক্য সংরক্ষণ করে।<br/>*সতর্কতা:* প্রতিটি `PUT`/`PATCH`-এ আগে/পরের পরিবর্তন রেকর্ড করে; বড় ডেটা বা অতি-ঘন আপডেটে `false` দিন। |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: বাইপাস রোল না থাকলে সক্রিয় টেন্যান্ট কনটেক্সট অনুযায়ী সারি কোয়েরি ও পরিবর্তন স্বয়ংক্রিয়ভাবে আলাদা করে।
- **রানটাইম আচরণ**: বাইপাস রোল ছাড়া টেন্যান্ট কনটেক্সট না থাকলে HTTP 403 ফেরত দেয়; তৈরিতে tenantId জোরপূর্বক ওভাররাইট করে ও ID ভিত্তিক অপারেশনে IDOR ব্লক করে।
- **কীভাবে ব্যবহার করবেন**: `tenantId` ফিল্ডসহ `@Entity`-তে লাগান; রিড ফিল্টার ও স্পুফিং প্রতিরোধ স্বয়ংক্রিয়ভাবে চলে।
- **কখন ব্যবহার করবেন**: সকল শেয়ার্ড-ডাটাবেজ SaaS টেবিলে (দোকান, অর্ডার, ইনভয়েস) ক্রস-টেন্যান্ট লিক ঠেকাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: দেশ বা মুদ্রার মতো গ্লোবাল রেফারেন্স টেবিলে ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | না (ঐচ্ছিক) | এন্টিটির টেন্যান্ট আইডি ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"tenantId"`)।<br/>`@MultiTenant(tenantField = "organizationId")` | টেন্যান্ট আইডি ধারণকারী ফিল্ডের নাম (ডিফল্ট "tenantId")।<br/>*সতর্কতা:* দ্রুত ও নিরাপদ টেন্যান্ট আইসোলেশনের জন্য `(tenant_id, id)` কম্পোজিট ডেটাবেস ইনডেক্স তৈরি করুন। |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | না (ঐচ্ছিক) | Spring Security রোল নামের অ্যারে (যেমন `{"ROLE_SUPER_ADMIN"}`); ফাঁকা `{}` আলাদা সীমাবদ্ধতা আরোপ করে না।<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | সব টেন্যান্ট জুড়ে অ্যাক্সেসের অনুমোদিত প্ল্যাটফর্ম অ্যাডমিন রোল।<br/>*সতর্কতা:* `RoleConstant`-এ `ROLE_` প্রিফিক্সসহ (যেমন `ROLE_ADMIN`) রোল নাম রাখুন যাতে Spring Security `GrantedAuthority`-এর সাথে মেলে। |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: create, update এবং upsert সংরক্ষণের আগে স্বতন্ত্রতা যাচাই করে।
- **রানটাইম আচরণ**: ডুপ্লিকেট মান থাকলে ConflictBusinessException (HTTP 409) ছোড়ে।
- **কীভাবে ব্যবহার করবেন**: `email` বা `skuCode`-এর মতো ফিল্ডে `@Column(unique = true)`-এর সাথে ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: সফট-ডিলিট করা ডেটা বাদ দিয়ে স্পষ্ট `HTTP 409 Conflict` এরর দেখাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: উচ্চ কনকারেন্সিতে ডেটাবেস `UNIQUE` ইনডেক্স ছাড়া শুধু এর ওপর ভরসা করবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: ফাঁকা থাকলে তৈরি বা ক্লোন করার সময় স্বয়ংক্রিয়ভাবে প্রিফিক্সসহ অনন্য কোড তৈরি করে।
- **রানটাইম আচরণ**: ভ্যালিডেশন ও সংরক্ষণের আগে প্রিফিক্স ও অনন্য টোকেন পূরণ করে।
- **কীভাবে ব্যবহার করবেন**: String কোড ফিল্ডে `@AutoCode(prefix = "PRD-")` দিন; ফাঁকা থাকলে স্বয়ংক্রিয়ভাবে কোড তৈরি হয়।
- **কখন ব্যবহার করবেন**: অর্ডার নম্বর বা SKU-এর মতো পাঠযোগ্য কোড কোনো DB সিকোয়েন্স লক ছাড়াই তৈরি করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কর-চালানের মতো বিরতিহীন ক্রমিক সংখ্যা (`1, 2, 3...`) বাধ্যতামূলক হলে ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `বাধ্যতামূলক (কোনো ডিফল্ট নেই)` | **হ্যাঁ (আবশ্যিক)** | বাধ্যতামূলক অ-ফাঁকা প্রিফিক্স স্ট্রিং (যেমন `"PRD-"`, `"INV-"`) — বাদ দিলে কম্পাইল ব্যর্থ হয়।<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | আট-অক্ষরের UUIDv7 হ্যাশের আগে যোগ করার বাধ্যতামূলক প্রিফিক্স (যেমন "PRD-")।<br/>*সতর্কতা:* বাধ্যতামূলক অ্যাট্রিবিউট; তৈরি বা ক্লোন করার সময় ফিল্ড ফাঁকা থাকলে ৮-অক্ষরের UUIDv7 হ্যাশ (`INV-0194E1A0`) যোগ করে এবং প্রদত্ত মান সংরক্ষণ করে। |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: sourceField থেকে স্বয়ংক্রিয়ভাবে URL-বান্ধব ASCII স্লাগ তৈরি করে।
- **রানটাইম আচরণ**: ইউনিকোড ডায়াক্রিটিক্স স্বাভাবিক করে স্লাগ ফিল্টারের মাধ্যমে অনুসন্ধান সহজ করে।
- **কীভাবে ব্যবহার করবেন**: `slug` ফিল্ডে `@AutoSlug(sourceField = "name")` দিন।
- **কখন ব্যবহার করবেন**: স্টোরফ্রন্ট, ব্লগ বা পণ্যের SEO-বান্ধব URL তৈরি করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `sourceField`-এ ভুল নাম দেবেন না; পরবর্তীতে শিরোনাম বদলালেও বিদ্যমান স্লাগ বদলাবে না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `বাধ্যতামূলক (কোনো ডিফল্ট নেই)` | **হ্যাঁ (আবশ্যিক)** | এন্টিটির স্ট্রিং ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"title"`)।<br/>`@AutoSlug(sourceField = "productName") private String slug;` | বাধ্যতামূলক সোর্স ফিল্ড যার মান ছোট হাতের ASCII স্লাগে রূপান্তরিত হয়।<br/>*সতর্কতা:* বাধ্যতামূলক; ইউনিকোড টেক্সটকে URL-নিরাপদ kebab-case স্লাগে রূপান্তর করে। অনন্যতার জন্য `@UniqueField` যুক্ত করুন। |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **উদ্দেশ্য**: সত্তার পরিবর্তন সংরক্ষণের আগে উদ্ভূত সংখ্যাসূচক মোট হিসাব করে।
- **রানটাইম আচরণ**: বুটে ComputedFieldFailFastUtil দ্বারা যাচাই হয় যাতে ভুল sourceFields দ্রুত ধরা পড়ে।
- **কীভাবে ব্যবহার করবেন**: ডিরাইভড `BigDecimal` ফিল্ডে ব্যবহার করুন; সার্ভার সেভ করার আগে পুনঃগণনা করে।
- **কখন ব্যবহার করবেন**: অর্ডার টোটাল বা আইটেম সাবটোটাল সার্ভারে নির্ভুল রাখতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: জটিল প্রমোশন বা এক্সটার্নাল API-নির্ভর হিসাবের জন্য ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | গণনার ধরন: "MULTIPLY" বা "SUM_COLLECTION"।<br/>*সতর্কতা:* সেভের আগে স্বয়ংক্রিয়ভাবে পুনরায় গণনা হয়, ফলে ক্লায়েন্টের পাঠানো ভুল যোগফল প্রতিস্থাপিত হয়। |
| `sourceFields` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `{"unitPrice", "quantity"}` (numeric properties on same entity)।<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | "MULTIPLY" মোডে গুণ হওয়া এন্টিটি ফিল্ডসমূহ।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"unitPrice"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `collectionField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির @OneToMany কালেকশন ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"items"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" মোডে যোগ করার @OneToMany কালেকশন ফিল্ড।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"items"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `itemField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির সংখ্যাসূচক ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"subTotal"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | প্রতিটি চাইল্ড আইটেমের যে সংখ্যাসূচক ফিল্ড যোগ হয়।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"subTotal"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `subtractField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির সংখ্যাসূচক ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"discountAmount"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | মোট যোগফল থেকে বিয়োগ করার প্যারেন্ট ডিসকাউন্ট ফিল্ড।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"discountAmount"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `addField` | `String` | `""` | না (ঐচ্ছিক) | এন্টিটির সংখ্যাসূচক ফিল্ডের সাথে হুবহু মিলে যাওয়া Java প্রপার্টি নাম (যেমন `"shippingFee"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | ফলাফলের সাথে যোগ হওয়া অতিরিক্ত ফি ফিল্ড।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"shippingFee"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: কন্ট্রোলার এন্ডপয়েন্টে কাস্টম SQL/JPQL বা প্রোভাইডার হেল্পার মেথড বাঁধার সুবিধা দেয়।
- **রানটাইম আচরণ**: JPA EntityManager দিয়ে নামকৃত প্যারামিটার বাইন্ড করে চালানো হয়।
- **কীভাবে ব্যবহার করবেন**: `@AutoGet`/`@AutoPost`-এর সাথে `:param` বাইন্ড করতে `@AutoParam` ব্যবহার করে লিখুন।
- **কখন ব্যবহার করবেন**: নেটিভ SQL রিপোর্ট, CTE বা উইন্ডো ফাংশন ব্যবহার করতে কোনো রিপোজিটরি না লিখেই ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: কখনো ইউজার ইনপুট SQL-এ যোগ করবেন না (`:param` ব্যবহার করুন) এবং ডোমেইনের মধ্যে JOIN এড়িয়ে চলুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders।<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | `:param` প্লেসহোল্ডারযুক্ত ইনলাইন SQL বা JPQL কোয়েরি।<br/>*সতর্কতা:* SQL ইনজেকশন রোধে সর্বদা `:param` বা `?1` ব্যবহার করুন; `sqlProvider` ব্যবহার করলে `""` রাখুন। |
| `nativeQuery` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (ডেটাবেস-নেটিভ SQL চালান) অথবা `false` (পোর্টেবল JPA JPQL চালান)।<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true নেটিভ SQL চালায়; false চালায় JPA JPQL।<br/>*সতর্কতা:* নেটিভ SQL (`true`) CTE ও উইন্ডো ফাংশন সমর্থন করে; পোর্টেবিলিটির জন্য `false` (JPQL) দিন। |
| `resultClass` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | যেকোনো কংক্রিট Java DTO ক্লাস (যেমন `MonthlyRevenueDto.class`) অথবা DTO ম্যাপিং বন্ধ করতে `Void.class`।<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | আউটপুট রো ম্যাপ করার ঐচ্ছিক রেজাল্ট ক্লাস।<br/>*সতর্কতা:* অ্যাগ্রিগেট কোয়েরিতে সর্বদা DTO প্রজেকশন ক্লাস দিন যাতে `SELECT *` এড়ানো যায়। |
| `sqlProvider` | `Class<?>` | `Void.class` | না (ঐচ্ছিক) | কংক্রিট Pure Java SQL প্রোভাইডার ক্লাস (যেমন `OrderAnalyticsSqlProvider.class`), অথবা ইনলাইন `value` ব্যবহারে `Void.class`।<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | ডায়নামিক SQL সরবরাহকারী ঐচ্ছিক Pure Java ক্লাস (স্টার্টআপে যাচাইকৃত)।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `sqlProvider` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `providerMethod` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"buildRevenueSql"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | SQL স্ট্রিং ফেরত দেওয়া `sqlProvider`-এর মেথডের নাম।<br/>*সতর্কতা:* Java মেথড/ফিল্ড নামের সাথে কেস-সেন্সিটিভ হুবহু মিল থাকতে হবে (যেমন `"buildRevenueSql"`); অমিল হলে রানটাইম ত্রুটি ঘটবে। |
| `modifying` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (রাইট ট্রানজ্যাকশনে UPDATE/DELETE DML চালান) অথবা `false` (রিড-অনলি SELECT কোয়েরি)।<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE কোয়েরির জন্য অবশ্যই `true` হতে হবে।<br/>*সতর্কতা:* যেকোনো `UPDATE`/`DELETE`-এর জন্য `true` বাধ্যতামূলক; স্বয়ংক্রিয়ভাবে রাইট ট্রানজ্যাকশন চালু করে। |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. ডেটাবেস-চালিত ডায়নামিক RBAC এবং ফিল্ড মাস্কিং মেটা-অ্যানোটেশন (18 অ্যানোটেশন)

### `@SecurityRoleEntity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **উদ্দেশ্য**: একটি JPA সত্তাকে লাইভ ডাটাবেস RBAC রোল ক্যাটালগ টেবিল হিসেবে নির্ধারণ করে।
- **রানটাইম আচরণ**: DynamicDatabaseRbacProviderHelper নির্ধারিত TTL-এ Caffeine-এ রোল-পারমিশন ক্যাশ করে ও পরিবর্তনে বাতিল করে।
- **কীভাবে ব্যবহার করবেন**: Role JPA এন্টিটিতে `@SecurityRoleEntity` এবং বাধ্যতামূলক `@RoleCode` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: অ্যাডমিনরা যখন হার্ডকোডেড কোডের বদলে ডেটাবেজ থেকে ডায়নামিকভাবে রোল নিয়ন্ত্রণ করবেন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@RoleCode` বাদ দেবেন না (স্টার্টআপ ব্যর্থ হবে) এবং একাধিক `@SecurityRoleEntity` রাখবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `60L`।<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | রোল স্ন্যাপশটের জন্য Caffeine ক্যাশ TTL সেকেন্ডে।<br/>*সতর্কতা:* ছোট TTL পরিবর্তন দ্রুত দেখায় তবে কোয়েরি বাড়ায়; বড় TTL লোড কমায় কিন্তু অনুমতি বাতিল হতে দেরি করে। |

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

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityRoleEntity-এর ভেতরে অনন্য রোল কোড কলাম ম্যাপ করে।
- **রানটাইম আচরণ**: GrantedAuthority টোকেন মেলাতে ক্যাশ করা LambdaAccessorUtil দিয়ে পড়া হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@RoleCode` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityRoleEntity-তে ভূমিকা প্রদর্শনের নাম ফিল্ড চিহ্নিত করে।
- **রানটাইম আচরণ**: RBAC ডায়াগনস্টিক মেটাডেটা ও Dev Studio রোল পরিদর্শনে প্রদর্শিত হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@RoleName` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: রোল সত্তায় প্রদত্ত পারমিশন কোডের তালিকা বা CSV স্ট্রিং ফিল্ড চিহ্নিত করে।
- **রানটাইম আচরণ**: ডায়নামিকভাবে পার্স করে SecurityIdentityCustomizer অথরিটিতে প্রসারিত হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@RolePermissions` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **উদ্দেশ্য**: রিসোর্স-অ্যাকশন পারমিশন ও ডায়নামিক ফিল্ড-মাস্কিং নিয়ম সংরক্ষণকারী JPA সত্তা চিহ্নিত করে।
- **রানটাইম আচরণ**: CRUD নিয়ন্ত্রণ ও ফিল্ড মাস্কিং প্রয়োগে DatabaseRbacRuleMatcherHelper-এ লোড হয়।
- **কীভাবে ব্যবহার করবেন**: Permission এন্টিটিতে `@SecurityPermissionEntity` এবং বাধ্যতামূলক `@PermissionCode` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: ডাটাবেজ থেকে সূক্ষ্ম পারমিশন এবং ফিল্ড মাস্কিং নিয়ন্ত্রণ করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@PermissionCode` ছাড়বেন না এবং একাধিক `@SecurityPermissionEntity` দেবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `60L`।<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | পারমিশন স্ন্যাপশটের Caffeine TTL সেকেন্ডে।<br/>*সতর্কতা:* ছোট TTL পরিবর্তন দ্রুত দেখায় তবে কোয়েরি বাড়ায়; বড় TTL লোড কমায় কিন্তু অনুমতি বাতিল হতে দেরি করে। |

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

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPermissionEntity-এর ভেতর অনন্য পারমিশন আইডি ফিল্ড নির্ধারণ করে।
- **রানটাইম আচরণ**: ব্যবহারকারীর অথরিটি ও @EntitySecurity.permissions()-এর সাথে মেলানো হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPermissionEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PermissionCode` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPermissionEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPermissionEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPermissionEntity-এ টার্গেট সত্তা বা রিসোর্স নাম (অথবা *) ম্যাপ করে।
- **রানটাইম আচরণ**: ওয়াইল্ডকার্ড ফলব্যাকসহ DatabaseRbacRuleMatcherHelper দ্বারা মূল্যায়িত হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPermissionEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PermissionResource` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPermissionEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPermissionEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPermissionEntity দ্বারা সুরক্ষিত CRUD বা কাস্টম অ্যাকশন ভার্ব ম্যাপ করে।
- **রানটাইম আচরণ**: কন্ট্রোলার মেথড থেকে স্বয়ংক্রিয়ভাবে READ, WRITE, DELETE বা কাস্টম অ্যাকশনে রূপান্তরিত হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPermissionEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PermissionAction` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPermissionEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPermissionEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: এই পারমিশন নিয়ম প্রয়োগ হলে কমা-বিভক্ত কোন ফিল্ডগুলো ডায়নামিকভাবে মাস্ক করতে হবে তা নির্ধারণ করে।
- **রানটাইম আচরণ**: HTTP JSON সিরিয়ালাইজেশনের আগে @FieldSecurity-এর সাথে ডায়নামিকভাবে প্রয়োগ হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPermissionEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PermissionFieldMask` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPermissionEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPermissionEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **উদ্দেশ্য**: অথেনটিকেটেড ব্যবহারকারীকে DB রোল ও টেন্যান্ট স্কোপের সাথে যুক্তকারী JPA সত্তা চিহ্নিত করে।
- **রানটাইম আচরণ**: JWT / SecurityContext লোড হওয়ার সময় SecurityIdentityCustomizer দিয়ে স্বয়ংক্রিয়ভাবে কোয়েরি হয়।
- **কীভাবে ব্যবহার করবেন**: ইউজার-রোল জয়েন এন্টিটিতে `@SecurityUserRoleEntity`, `@UserRoleSubject` ও `@UserRoleCode` দিন।
- **কখন ব্যবহার করবেন**: JWT শুধু ইউজার আইডি বহন করলে এবং ডেটাবেজ থেকে ডায়নামিক রোল লোড করতে হলে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@UserRoleSubject` ভুলবেন না; বাইরের IdP টোকেনেই সব রোল দিলে এটি জরুরি নয়।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@SecurityUserRoleEntity(enabled = true)` | ইউজার-রোল বাইন্ডিং সক্রিয় বা নিষ্ক্রিয় করার সুইচ।<br/>*সতর্কতা:* স্কিমা মাইগ্রেশনের সময় সাময়িকভাবে `false` রেখে JWT রোল চালু রাখা যায়। |

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

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityUserRoleEntity-তে প্রিন্সিপাল সাবজেক্ট বা ইউজারনেম ফিল্ড চিহ্নিত করে।
- **রানটাইম আচরণ**: সক্রিয় SecurityContext-এর Authentication.getName()-এর সাথে মেলে।
- **কীভাবে ব্যবহার করবেন**: `@SecurityUserRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@UserRoleSubject` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityUserRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityUserRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityUserRoleEntity-এর ভেতরে নির্ধারিত রোল কোড কলাম বাইন্ড করে।
- **রানটাইম আচরণ**: নীতি মূল্যায়নের সময় সংযুক্ত @SecurityRoleEntity পারমিশন সমাধান করে।
- **কীভাবে ব্যবহার করবেন**: `@SecurityUserRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@UserRoleCode` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityUserRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityUserRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityUserRoleEntity অ্যাসাইনমেন্টকে নির্দিষ্ট টেন্যান্ট আইডিতে (বা গ্লোবাল *) সীমাবদ্ধ করে।
- **রানটাইম আচরণ**: প্রতিটি অনুরোধে TenantContextHolder / X-Tenant-ID অনুযায়ী ফিল্টার হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityUserRoleEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@UserRoleTenantId` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityUserRoleEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityUserRoleEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **উদ্দেশ্য**: priority অনুযায়ী সাজানো স্পষ্ট ALLOW / DENY অথোরাইজেশন পলিসি সংরক্ষণকারী JPA সত্তা চিহ্নিত করে।
- **রানটাইম আচরণ**: স্পষ্ট DENY সর্বদা ALLOW-কে অতিক্রম করে; SQL চালানোর আগে যাচাই হয়।
- **কীভাবে ব্যবহার করবেন**: পলিসি এন্টিটিতে `@SecurityPolicyEntity` ও বাধ্যতামূলক `@PolicyAllowedRoles` দিন।
- **কখন ব্যবহার করবেন**: ডেটাবেজ নিয়ম দিয়ে `@EntitySecurity` ডায়নামিকভাবে ওভাররাইড বা জরুরি `DENY` প্রয়োগ করতে।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@PolicyAllowedRoles` ছাড়বেন না এবং মনে রাখবেন `DENY` নিয়ম `ALLOW`-এর ওপরে থাকে।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | না (ঐচ্ছিক) | পূর্ণসংখ্যার অগ্রাধিকার-এ ধনাত্মক সংখ্যা (`>= 0`); যেমন `10`।<br/>`@SecurityPolicyEntity(priority = 10)` | পলিসি মূল্যায়নের অগ্রাধিকার (ছোট মান উচ্চ অগ্রাধিকার)।<br/>*সতর্কতা:* একাধিক নীতি মিললে ছোট সংখ্যা অগ্রাধিকার পায় (যেমন `10` ডিফল্ট `100`-কে অতিক্রম করে)। |

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

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPolicyEntity-তে টার্গেট রিসোর্স আইডেন্টিফায়ার প্যাটার্ন ম্যাপ করে।
- **রানটাইম আচরণ**: সঠিক সত্তা নাম এবং * ওয়াইল্ডকার্ড ম্যাচিং উভয়ই সমর্থন করে।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPolicyEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PolicyResource` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPolicyEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPolicyEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPolicyEntity-এর ভেতরে সুরক্ষিত অ্যাকশন (READ, WRITE, DELETE, methodName, *) ম্যাপ করে।
- **রানটাইম আচরণ**: সার্ভিসে পাঠানোর আগে প্রতিটি HTTP অপারেশনে যাচাই হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPolicyEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PolicyAction` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPolicyEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPolicyEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPolicyEntity নিয়মের আওতাভুক্ত রোলের তালিকা বা CSV ফিল্ড ম্যাপ করে।
- **রানটাইম আচরণ**: সক্রিয় JWT অথরিটি ও ডাটাবেসের @SecurityUserRoleEntity রোলের সাথে মিলিয়ে দেখা হয়।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPolicyEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PolicyAllowedRoles` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPolicyEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPolicyEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **উদ্দেশ্য**: @SecurityPolicyEntity নিয়মে ALLOW অথবা DENY সিদ্ধান্ত নির্ধারণ করে।
- **রানটাইম আচরণ**: কোনো DENY নীতি মিললে তাৎক্ষণিকভাবে HTTP 403 AccessDeniedBusinessException দিয়ে অনুরোধ বাতিল করে।
- **কীভাবে ব্যবহার করবেন**: `@SecurityPolicyEntity` এন্টিটির নির্দিষ্ট ফিল্ড বা গেটারে `@PolicyEffect` ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: নিজস্ব ডাটাবেজ কলামের নাম অপরিবর্তিত রেখে `@SecurityPolicyEntity`-কে DB-RBAC ইঞ্জিনে ম্যাপিং করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: একই ক্লাসে একাধিকবার বা `@SecurityPolicyEntity`-বিহীন এন্টিটিতে দেবেন না।

> **মার্কার অ্যানোটেশন**: বিশুদ্ধ মার্কার অ্যানোটেশন — এতে কোনো অ্যাট্রিবিউট নেই।

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. ডিস্ট্রিবিউটেড লকিং, আইডেম্পটেন্সি, ক্যাশিং, মাল্টি-DB এবং ক্লাউড ইভেন্ট (13 অ্যানোটেশন)

### `@DistributedLock`

- **প্যাকেজ**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **উদ্দেশ্য**: AST ম্যাপে (সর্বোচ্চ ১০২৪) ক্যাশকৃত SpEL কী-তে সমবর্তী অ্যাক্সেস সিরিয়ালাইজ করে (ডিফল্ট 3000L / 5000L ms)।
- **রানটাইম আচরণ**: সময় শেষ হলে DistributedLockAspect HTTP 409 DistributedLockAcquisitionException ছোড়ে।
- **কীভাবে ব্যবহার করবেন**: নন-ফাইনাল `@Service` মেথডে ব্যবহার করুন; ক্লাস্টারের জন্য `DistributedLockProvider` বিন দিন।
- **কখন ব্যবহার করবেন**: ইনভেন্টরি ওভারসেলিং বা একযোগে ওয়ালেট ডেবিট ঠেকাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: ডিফল্ট Caffeine লক মাল্টি-নোড ক্লাস্টারে কাজ করে না — Redis `DistributedLockProvider` যুক্ত করুন!

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | না (ঐচ্ছিক) | মেথড আর্গুমেন্ট নির্দেশকারী SpEL এক্সপ্রেশন (যেমন `"'inventory:' + #skuId"`) অথবা স্বয়ংক্রিয় কী-এর জন্য `""`।<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | রানটাইমে মূল্যায়িত SpEL লক কী এক্সপ্রেশন।<br/>*সতর্কতা:* সর্বদা নির্দিষ্ট রিসোর্স ID (`#id`) ব্যবহার করুন; স্থির কী দিলে সব অনুরোধ সিরিয়াল হয়ে যাবে। |
| `waitTimeMs` | `long` | `3000L` | না (ঐচ্ছিক) | মিলিসেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 0`); যেমন `3000L`।<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | লক পাওয়ার সর্বোচ্চ অপেক্ষার সময় মিলিসেকেন্ডে (ডিফল্ট 3000L)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: খুব কম হলে ৪0৯ ত্রুটি বাড়বে; খুব বেশি হলে ট্র্যাফিক পিকে থ্রেড আটকে যাবে। |
| `leaseTimeMs` | `long` | `5000L` | না (ঐচ্ছিক) | মিলিসেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 100`); যেমন `10000L`।<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | লক লিজ মেয়াদের সর্বোচ্চ সময় মিলিসেকেন্ডে (5000L)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: সবচেয়ে ধীর p99 ট্রানজ্যাকশনের চেয়ে বেশি হতে হবে, নইলে লেখার মাঝেই লক শেষ হয়ে যাবে। |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: কনফিগারযোগ্য TTL সময়ের মধ্যে সমবর্তী বা পুনরাবৃত্ত ডুপ্লিকেট রাইট প্রতিরোধ করে।
- **রানটাইম আচরণ**: IdempotencyAspect ও ProxyIdempotencyGuardHelper Caffeine TTL লক প্রয়োগ করে (ConflictBusinessException HTTP 409); খালি কী বাইপাস হয় ও IdempotencyManagerHelper ঐচ্ছিক SHA-256 দেয়।
- **কীভাবে ব্যবহার করবেন**: `@AutoRestController` বা নন-ফাইনাল `@Service` মেথডে লাগান; ব্যর্থ হলে কী মুক্ত হয়ে যায়।
- **কখন ব্যবহার করবেন**: পেমেন্ট ক্যাপচার, ট্রান্সফার বা ডাবল-সাবমিট ঠেকাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: GET মেথডে ব্যবহার করবেন না এবং মাল্টি-পড ক্লাস্টারে Redis `IdempotencyStoreProvider` যোগ করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | না (ঐচ্ছিক) | বৈধ HTTP হেডার নাম (নেটওয়ার্কে কেস-ইনসেন্সিটিভ, যেমন `"X-Idempotency-Key"`)।<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | ক্লায়েন্ট-প্রদত্ত আইডেমপোটেন্সি কী ধারণকারী HTTP হেডার।<br/>*সতর্কতা:* ক্লায়েন্টকে প্রতিটি রিকোয়েস্টে অনন্য UUIDv7 পাঠাতে ও রিট্রাইয়ে সেটিই পুনরায় দিতে হবে; CORS `allowedHeaders`-এ যুক্ত করুন। |
| `ttlSeconds` | `long` | `300L` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `300L`।<br/>`@Idempotent(ttlSeconds = 900L)` | ডুপ্লিকেট ঠেকানোর সময়সীমা সেকেন্ডে (HTTP 409 Conflict; ডিফল্ট 300L)।<br/>*সতর্কতা:* Redis বা মেমোরিতে রেসপন্স ধরে রাখার সময়; রিট্রাই উইন্ডো অনুযায়ী `300L–86400L` দিন। |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: IP, User বা Tenant অনুযায়ী স্লাইডিং-উইন্ডো রেট লিমিটিং প্রয়োগ করে।
- **রানটাইম আচরণ**: nwvmc.ratelimit.rejected.total মেট্রিক বাড়ায় এবং HTTP 429 Too Many Requests পাঠায়।
- **কীভাবে ব্যবহার করবেন**: কন্ট্রোলার বা মেথডে বসান; অনুমোদিত কলে `X-RateLimit-Remaining`/`X-RateLimit-Reset` এবং সীমা ছাড়ালে `HTTP 429` + `Retry-After` পাঠায়।
- **কখন ব্যবহার করবেন**: পাবলিক সার্চ, অথ/OTP, AI কুয়েরি বা ভারী এক্সপোর্টে অপব্যবহার রোধে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: হেলথ প্রোবে খুব কম সীমা দেবেন না এবং ব্যবহারকারী বা টেন্যান্ট আলাদা রাখতে `"GLOBAL"` এড়িয়ে চলুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | না (ঐচ্ছিক) | অনুরোধ-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `60`।<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | প্রতি স্লাইডিং উইন্ডোতে সর্বোচ্চ অনুমোদিত রিকোয়েস্ট (৬০)।<br/>*সতর্কতা:* HTTP `429` ফেরত দেওয়ার সময় `X-RateLimit-Remaining`, `X-RateLimit-Reset` এবং RFC 6585 `Retry-After` হেডার যুক্ত করে। |
| `windowSeconds` | `int` | `60` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `60`।<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | রেট লিমিট উইন্ডোর সময়কাল সেকেন্ডে (৬০)।<br/>*সতর্কতা:* কাউন্টার উইন্ডোর দৈর্ঘ্য নির্ধারণ করে এবং `X-RateLimit-Reset` ও `Retry-After` গণনা করে। |
| `partitionKey` | `String` | `"IP"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)।<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | পার্টিশন কৌশল: "IP"/"clientIp", "USER" (বেনামী হলে IP ফলব্যাক), "TENANT", "GLOBAL" অথবা SpEL "#expr"।<br/>*সতর্কতা:* `"USER"` লগইন ইউজার অনুযায়ী ভাগ করে এবং অজ্ঞাত কলে IP ব্যবহার করে; `"GLOBAL"` সবার জন্য একটাই কোটা। |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: Actuator ও Micrometer-এ টেলিমেট্রি পাঠিয়ে Resilience4j সার্কিট ব্রেকারের ভেতর অপারেশন চালায়।
- **রানটাইম আচরণ**: ত্রুটির হার সীমা ছাড়ালে OPEN (HTTP 503)-এ যায় এবং nwvmc.resilience.circuitbreaker.state গেজ আপডেট করে।
- **কীভাবে ব্যবহার করবেন**: বাইরের API বা AI-নির্ভর এন্ডপয়েন্টে ক্যাসকেডিং ফেইলিউর ঠেকাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: থ্রেড আটকে না রেখে ডাউনস্ট্রিম ত্রুটিতে দ্রুত `HTTP 503` ফেরত দিতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `CircuitBreakerErrorFilterUtil` স্বয়ংক্রিয়ভাবে 4xx `BaseBusinessException` উপেক্ষা করে; ক্লায়েন্ট ত্রুটিকে সাধারণ `RuntimeException`-এ মোড়াবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"payment-gateway-cb"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j সার্কিট ব্রেকার ইনস্ট্যান্সের নাম।<br/>*সতর্কতা:* Resilience4j ইনস্ট্যান্স ও Micrometer ট্যাগ শনাক্ত করে; `""` রাখলে ক্লাস নাম ব্যবহৃত হয়। |
| `failureRateThreshold` | `float` | `50.0f` | না (ঐচ্ছিক) | শতাংশ-এ ধনাত্মক সংখ্যা (`1.0f .. 100.0f`); যেমন `50.0f`।<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | ব্রেকার OPEN অবস্থায় যাওয়ার ব্যর্থতার শতকরা হার (ডিফল্ট 50.0f)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: 4xx `BaseBusinessException` স্বয়ংক্রিয়ভাবে বাদ পড়ে; কেবল 5xx বা অবকাঠামো ত্রুটিতে সার্কিট খোলে। |
| `waitDurationInOpenStateSeconds` | `int` | `10` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `15`।<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | HALF_OPEN যাওয়ার আগে HTTP 503 রিটার্নসহ অপেক্ষার সেকেন্ড (১০)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: 4xx `BaseBusinessException` স্বয়ংক্রিয়ভাবে বাদ পড়ে; কেবল 5xx বা অবকাঠামো ত্রুটিতে সার্কিট খোলে। |
| `slidingWindowSize` | `int` | `20` | না (ঐচ্ছিক) | কল-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `20`।<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | ব্যর্থতা মাপার স্লাইডিং উইন্ডো সাইজ (২০)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: 4xx `BaseBusinessException` স্বয়ংক্রিয়ভাবে বাদ পড়ে; কেবল 5xx বা অবকাঠামো ত্রুটিতে সার্কিট খোলে। |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | না (ঐচ্ছিক) | কল-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `5`।<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | রিকভারি যাচাইয়ে HALF_OPEN অবস্থায় অনুমোদিত কল (৫)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: 4xx `BaseBusinessException` স্বয়ংক্রিয়ভাবে বাদ পড়ে; কেবল 5xx বা অবকাঠামো ত্রুটিতে সার্কিট খোলে। |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: কনফিগারযোগ্য এক্সপোনেনশিয়াল ব্যাকঅফসহ ক্ষণস্থায়ী ব্যর্থতা স্বয়ংক্রিয়ভাবে পুনরায় চেষ্টা করে।
- **রানটাইম আচরণ**: সব নির্ধারিত পুনঃপ্রচেষ্টা শেষ হলে প্রমিত এক্সেপশন ছোড়ে।
- **কীভাবে ব্যবহার করবেন**: অস্থায়ী নেটওয়ার্ক বা ডেটাবেজ গ্লিচ থেকে পুনরুদ্ধার করতে কন্ট্রোলার বা মেথডে দিন।
- **কখন ব্যবহার করবেন**: আইডেমপোটেন্ট GET রিড বা `@Idempotent` দ্বারা সুরক্ষিত কলের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: `@Idempotent` ছাড়া পেমেন্ট বা POST ক্রিয়েটে ব্যবহার করবেন না (ডাবল চার্জ হতে পারে)!

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"erp-sync-retry"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j রিট্রাই ইনস্ট্যান্সের নাম।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: `maxAttempts` ও অপেক্ষার মোট সময় যেন গেটওয়ে টাইমআউটের নিচে থাকে। |
| `maxAttempts` | `int` | `3` | না (ঐচ্ছিক) | প্রচেষ্টা-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `3`।<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | প্রাথমিক চেষ্টাসহ মোট চেষ্টা সংখ্যা (৩)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: `maxAttempts` ও অপেক্ষার মোট সময় যেন গেটওয়ে টাইমআউটের নিচে থাকে। |
| `waitDurationMs` | `long` | `500L` | না (ঐচ্ছিক) | মিলিসেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 50`); যেমন `500L`।<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | প্রথম রিট্রাইয়ের আগে প্রাথমিক বিলম্ব মিলিসেকেন্ডে (500L)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: `maxAttempts` ও অপেক্ষার মোট সময় যেন গেটওয়ে টাইমআউটের নিচে থাকে। |
| `backoffMultiplier` | `double` | `2.0d` | না (ঐচ্ছিক) | গুণক-এ ধনাত্মক সংখ্যা (`>= 1.0d`); যেমন `2.0d`।<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | পরবর্তী রিট্রাইয়ের মধ্যে এক্সপোনেনশিয়াল ব্যাকঅফ গুণক (2.0d)।<br/>*সতর্কতা:* প্রোডাকশন লেটেন্সি SLA অনুযায়ী সতর্কতার সাথে টিউন করুন: `maxAttempts` ও অপেক্ষার মোট সময় যেন গেটওয়ে টাইমআউটের নিচে থাকে। |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **প্যাকেজ**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: RFC 7232 দুর্বল ETag (W/"...") গণনা করে এবং Cache-Control ও HTTP 304 Not Modified রেসপন্স পাঠায়।
- **রানটাইম আচরণ**: nwvmc.cache.http.requests-এ HIT/MISS কাউন্টার রেকর্ড করে।
- **কীভাবে ব্যবহার করবেন**: কেবল-পড়ার কন্ট্রোলার বা GET মেথডে যোগ করে `ETag` ও `304` ক্যাশিং পান।
- **কখন ব্যবহার করবেন**: সেমি-স্ট্যাটিক ক্যাটালগ ও পাবলিক তালিকায় ব্যান্ডউইথ বাঁচাতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: ব্যক্তিগত PII বা রোল-মাস্কড ডেটায় কখনোই `isPrivate = false` রাখবেন না!

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | না (ঐচ্ছিক) | সেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 0`); যেমন `120`।<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Cache-Control `max-age` সেকেন্ডে (ডিফল্ট ৬০)।<br/>*সতর্কতা:* `Cache-Control: max-age=<N>` পাঠায়; তাৎক্ষণিক `304` যাচাইয়ের জন্য `0` ও `generateETag = true` ব্যবহার করুন। |
| `isPrivate` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (শুধুমাত্র ব্রাউজার ক্যাশে; CDN-এ নিষিদ্ধ) অথবা `false` (পাবলিক ক্যাশে; প্রক্সি ও CDN-এ সংরক্ষণযোগ্য)।<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true `private` নির্দেশ দেয় (CDN-এ নয়); false `public`।<br/>*সতর্কতা:* অত্যন্ত জরুরি: প্রমাণীকৃত বা `@FieldSecurity` এন্ডপয়েন্টে সর্বদা `isPrivate = true` দিন যাতে CDN ডেটা ফাঁস না করে। |
| `mustRevalidate` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | মেয়াদ উত্তীর্ণ হলে রি-ভ্যালিডেট করতে `, must-revalidate` যুক্ত করে।<br/>*সতর্কতা:* `maxAgeSeconds` শেষ হলে পুনরায় যাচাই ছাড়া পুরনো ক্যাশে দেখানো নিষিদ্ধ করে। |
| `generateETag` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | SHA-256 ETag তৈরি করে এবং `If-None-Match` মিললে `HTTP 304` রিটার্ন করে।<br/>*সতর্কতা:* RFC 7232 `ETag` তৈরি করে এবং `If-None-Match` মিললে ০-বাইট `304 Not Modified` রিটার্ন করে। |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: Caffeine L1 / Redis L2 ইঞ্জিনে সার্ভার-সাইড রিড মেথডের আউটপুট ক্যাশ করে।
- **রানটাইম আচরণ**: app.framework.cache.type দিয়ে গ্লোবালি কনফিগারযোগ্য।
- **কীভাবে ব্যবহার করবেন**: রিড মেথডে বসান; ক্যাশ প্রোভাইডার `app.framework.cache.type` থেকে নির্বাচিত হয়।
- **কখন ব্যবহার করবেন**: যেখানে লেখার চেয়ে পড়া অনেক বেশি (১০:১+) যেমন ID লুকআপ বা মেটাডেটা।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: উচ্চ-লেখাযুক্ত টেবিলে বা ক্লোন ছাড়া পরিবর্তনযোগ্য এন্টিটি ক্যাশ করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `{"productCatalog"}` (Caffeine/Redis cache region names)।<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Caffeine বা Redis ক্যাশ নামের তালিকা।<br/>*সতর্কতা:* ক্যাশে অঞ্চলের নাম Caffeine/Redis কনফিগের সাথে মিলতে হবে; প্রতিটি লেখায় `@AutoCacheEvict` যুক্ত করুন। |
| `key` | `String` | `""` | না (ঐচ্ছিক) | মেথড আর্গুমেন্ট নির্দেশকারী SpEL এক্সপ্রেশন (যেমন `"'product:' + #id"`) অথবা স্বয়ংক্রিয় কী-এর জন্য `""`।<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL ক্যাশ কী (v0.1.0 EntityName:id নির্ভুলভাবে সমাধান করে)।<br/>*সতর্কতা:* মাল্টি-টেন্যান্ট অ্যাপে ডেটা মিশে যাওয়া ঠেকাতে ক্যাশে কী-তে অবশ্যই টেন্যান্ট আইডি যুক্ত করুন। |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: ডেটা পরিবর্তনে পুরোনো সার্ভার-সাইড ক্যাশ এন্ট্রি অপসারণ করে।
- **রানটাইম আচরণ**: পরিবর্তনের পর পুরোনো ডেটা না রেখে পরিষ্কারভাবে কার্যকর হয়।
- **কীভাবে ব্যবহার করবেন**: আপডেট ও ডিলিট মেথডে `@AutoCacheable` কী-র সাথে মিলিয়ে ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: `@AutoCacheable` দিয়ে ক্যাশকৃত ডেটা পরিবর্তন বা মুছে ফেলার সময়।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: উচ্চ-ফ্রিকোয়েন্সির `create`-এ `allEntries = true` এড়িয়ে চলুন (ক্যাশ স্ট্যাম্পিড হয়)।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `{"productCatalog"}` (target cache region names to evict)।<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | মেথড শেষ হলে যে ক্যাশগুলো মুছে ফেলা হবে।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `value` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `key` | `String` | `""` | না (ঐচ্ছিক) | মেথড আর্গুমেন্ট নির্দেশকারী SpEL এক্সপ্রেশন (যেমন `"'product:' + #id"`) অথবা স্বয়ংক্রিয় কী-এর জন্য `""`।<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | নির্দিষ্ট এন্টিটি ক্যাশ এন্ট্রি মুছতে SpEL কী।<br/>*সতর্কতা:* `@AutoCacheable.key`-এর সাথে হুবহু মিলতে হবে; `allEntries = true` হলে উপেক্ষিত হয়। |
| `allEntries` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (টার্গেট ক্যাশের সব এন্ট্রি মুছুন) অথবা `false` (শুধুমাত্র key দ্বারা নির্ধারিত একটি এন্ট্রি মুছুন)।<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true হলে সংশ্লিষ্ট এন্টিটির প্রিফিক্সের অধীনস্থ সব ক্যাশ মুছে দেয়।<br/>*সতর্কতা:* উচ্চ ট্র্যাফিকে পুরো ক্যাশে মুছে ফেললে ডেটাবেসে হঠাৎ চাপ বাড়তে পারে; নির্দিষ্ট `key` মোছা শ্রেয়। |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **প্যাকেজ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: এক্সিকিউশন সময় পরিমাপ করে এবং ধীর কল সীমা ছাড়ালে WARN লগ দেয়।
- **রানটাইম আচরণ**: পাশাপাশি DynamicEntityMetricsHelper-এ লেটেন্সি টাইমার সরবরাহ করে।
- **কীভাবে ব্যবহার করবেন**: SLA লঙ্ঘন পর্যবেক্ষণে কন্ট্রোলার বা সার্ভিসে `@TrackExecutionTime(warningThresholdMs = 300)` দিন।
- **কখন ব্যবহার করবেন**: জটিল রিপোর্ট, ব্যাচ ও `@CustomQuery`-তে স্লো-কোয়েরি ধরতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: উচ্চ-লোডে `warningThresholdMs = 0` দেবেন না এবং দীর্ঘস্থায়ী SSE `/events`-এ ব্যবহার করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | না (ঐচ্ছিক) | মিলিসেকেন্ড-এ ধনাত্মক সংখ্যা (`>= 1`); যেমন `300L`।<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | ধীর গতির `WARN` লগ দেওয়ার থ্রেশহোল্ড মিলিসেকেন্ডে (500L)।<br/>*সতর্কতা:* সীমা ছাড়িয়ে গেলে `traceId`-সহ `WARN` লগ লেখে; লগ অতিরিক্ত বাড়া ঠেকাতে বাস্তবসম্মত মান (`200L–1000L`) দিন। |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **প্যাকেজ**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **উদ্দেশ্য**: কমিটের পর ভার্চুয়াল থ্রেডে অ্যাসিঙ্ক্রোনাস HMAC-SHA256 স্বাক্ষরিত ওয়েবহুক পাঠায়।
- **রানটাইম আচরণ**: WebhookHmacSignerHelper-এ স্বাক্ষর তৈরি করে এবং ধ্রুব-সময় সমতা যাচাই করে।
- **কীভাবে ব্যবহার করবেন**: JPA এন্টিটিতে দিন; DB কমিটের পর Outbox ও ভার্চুয়াল থ্রেডের মাধ্যমে অ্যাসিঙ্ক্রোনাস ডেলিভারি হয়।
- **কখন ব্যবহার করবেন**: অর্ডার বা পেমেন্ট কমিট হওয়ার সাথে সাথে বাহ্যিক পার্টনারদের নোটিফাই করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: সংবেদনশীল PII/PCI ডেটা থাকলে `includeFullPayload = false` ব্যবহার করুন।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | না (ঐচ্ছিক) | শূন্য বা ততোধিক বৈধ মানের অ্যারে: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`।<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC স্বাক্ষরিত ওয়েবহুক পাঠানোর ইভেন্ট তালিকা।<br/>*সতর্কতা:* ট্রানজ্যাকশন কমিটের (`AFTER_COMMIT`) পরে অ্যাসিঙ্ক্রোনাসভাবে পাঠানো হয়, তাই রোলব্যাকে ভুল ওয়েবহুক যায় না। |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | না (ঐচ্ছিক) | বৈধ HTTP হেডার নাম (নেটওয়ার্কে কেস-ইনসেন্সিটিভ, যেমন `"X-Webhook-Signature"`)।<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 স্বাক্ষর বহনকারী HTTP হেডার।<br/>*সতর্কতা:* HMAC-SHA256 সিগনেচার বহন করে; প্রাপককে প্রসেস করার আগে এটি যাচাই করতে হবে। |
| `includeFullPayload` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@EntityWebhook(includeFullPayload = false)` | true হলে সম্পূর্ণ JSON যায়; false হলে শুধু ID ও মেটাডেটা যায়।<br/>*সতর্কতা:* সংবেদনশীল PII বা আর্থিক এন্টিটিতে `false` দিন যাতে সাবস্ক্রাইবার কেবল ID পায় এবং প্রমাণীকৃত GET দিয়ে ডেটা আনে। |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **প্যাকেজ**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: ট্রানজ্যাকশন কমিটের পর CNCF CloudEvents v1.0 এনভেলপ প্রকাশ করে।
- **রানটাইম আচরণ**: ফ্যান্টম ইভেন্ট এড়াতে TransactionRuntimeBridge.executeAfterCommit অনুসরণ করে।
- **কীভাবে ব্যবহার করবেন**: এন্টিটি বা মেথডে দিন; লিসেনার `@TransactionalEventListener(AFTER_COMMIT)` দিয়ে গ্রহণ করে।
- **কখন ব্যবহার করবেন**: ডোমেইন বা বাউন্ডেড কনটেক্সটের মধ্যে ঢিলেঢালা ইভেন্ট-ভিত্তিক যোগাযোগের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: বাহ্যিক `@EntityWebhook`-এর সাথে গুলিয়ে ফেলবেন না এবং `AFTER_COMMIT` ছাড়া প্রসেস করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | না (ঐচ্ছিক) | অ-ফাঁকা শনাক্তকারী স্ট্রিং (যেমন `"com.acme.order.lifecycle"`); ডিফল্ট নিয়মের জন্য `""` রাখুন।<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` (যেমন "io.nwvmc.order.created")।<br/>*সতর্কতা:* CloudEvents 1.0 রিভার্স-DNS নিয়ম (`com.company.domain.event`) অনুসরণ করুন; `""` স্বয়ংক্রিয়ভাবে তৈরি করে। |
| `source` | `String` | `""` | না (ঐচ্ছিক) | `/` দিয়ে শুরু হওয়া বৈধ HTTP পাথ (যেমন `/services/order-api`) অথবা স্বয়ংক্রিয় নির্ধারণের জন্য ফাঁকা স্ট্রিং `""`।<br/>`@PublishCloudEvent(source = "/services/order-api")` | ইভেন্ট প্রেরণকারী বাউন্ডেড কনটেক্সটের CloudEvents `source` URI।<br/>*সতর্কতা:* মাইক্রোসার্ভিস ট্রেসিংয়ের জন্য CNCF CloudEvents `source` URI সেট করে। |
| `publishOnCreate` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | POST ক্রিয়েট কমিটের পর CloudEvent পাঠাবে কিনা (true)।<br/>*সতর্কতা:* কেবল কমিটের (`AFTER_COMMIT`) পর Spring Events / Kafka দিয়ে প্রকাশিত হয়। |
| `publishOnUpdate` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@PublishCloudEvent(publishOnUpdate = true)` | PUT/PATCH আপডেটের পর CloudEvent পাঠাবে কিনা (true)।<br/>*সতর্কতা:* ঘনঘন আপডেট হওয়া এন্টিটিতে `false` রাখুন যাতে মেসেজ ব্রোকারে চাপ না পড়ে। |
| `publishOnDelete` | `boolean` | `true` | না (ঐচ্ছিক) | `true` (সক্রিয়) অথবা `false` (নিষ্ক্রিয়)।<br/>`@PublishCloudEvent(publishOnDelete = true)` | DELETE কমিটের পর CloudEvent পাঠাবে কিনা (true)।<br/>*সতর্কতা:* হার্ড ডিলিট ও `BaseAuditEntity.deleted` উভয় ক্ষেত্রেই চলে যাতে রিড-মডেল সিঙ্ক থাকে। |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **প্যাকেজ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: সত্তা বা কোয়েরি অপারেশনকে নির্দিষ্ট লজিক্যাল ডেটাসোর্স কী-তে যুক্ত করে।
- **রানটাইম আচরণ**: framework.datasource.routing.total-এ রাউটিং সংখ্যা রেকর্ড করে।
- **কীভাবে ব্যবহার করবেন**: কন্ট্রোলার বা নন-ফাইনাল সার্ভিস মেথডে ব্যবহার করুন; শেষে স্বয়ংক্রিয়ভাবে রিসেট হয়।
- **কখন ব্যবহার করবেন**: ভারী রিপোর্ট ও CQRS রিড-রেপ্লিকা (`REPLICA`) রাউটিংয়ের জন্য ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: খোলা `@Transactional` লেনদেনের মাঝপথে ডেটাসোর্স পরিবর্তন করবেন না এবং `final class`-এ দেবেন না!

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`।<br/>`@TargetDataSource("REPLICA")` | `DataSourceContextHolder`-এ সেট হওয়া ডেটাসোর্স কী ("PRIMARY", "REPLICA")।<br/>*সতর্কতা:* `DynamicRoutingDataSource`-এ নিবন্ধিত সক্রিয় কী-এর সাথে মিলতে হবে; অজানা কী `PRIMARY`-তে ফিরে যায়। |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **প্যাকেজ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **উদ্দেশ্য**: প্রতিটি সত্তার জন্য ডাটাবেস ইঞ্জিন পরিবার ও লজিক্যাল ক্লাস্টার শার্ড নির্ধারণ করে।
- **রানটাইম আচরণ**: MultiPlatformDataSourceRegistryHelper ও TenantDatabaseRoutingResolverHelper দ্বারা ডায়নামিকভাবে নির্ধারিত হয়।
- **কীভাবে ব্যবহার করবেন**: বিশেষায়িত JPA এন্টিটি বা সার্ভিস মেথডে প্ল্যাটফর্ম ও ক্লাস্টার নির্ধারণ করতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন**: পলিগ্লট পারসিস্টেন্স বা ফিন্যান্স, অ্যানালিটিক্স ও অডিট ক্লাস্টার আলাদা রাখতে ব্যবহার করুন।
- **কখন ব্যবহার করবেন না এবং সতর্কতা**: এটি JDBC URL কনফিগারেশনের বিকল্প নয়; ভিন্ন ক্লাস্টারের মধ্যে JPA JOIN করবেন না।

| অ্যাট্রিবিউট | Java টাইপ | ডিফল্ট মান | আবশ্যিক | গ্রহণযোগ্য মান ও উদাহরণ | বিবরণ ও রানটাইম সতর্কতা |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | লক্ষ্য ডেটাবেজ ইঞ্জিনের নাম ("H2", "POSTGRESQL", "MYSQL", "ORACLE")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `platform` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `cluster` | `String` | `"PRIMARY"` | না (ঐচ্ছিক) | নিম্নলিখিত সমর্থিত মানগুলোর যেকোনো একটি: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | টার্গেট ক্লাস্টার ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER")।<br/>*সতর্কতা:* অ্যাপ স্টার্টআপে তাৎক্ষণিক যাচাই হয়; ভুল বানান বা অবৈধ `cluster` ট্র্যাফিকের আগেই ফেইল-ফাস্ট হয়। |
| `readOnly` | `boolean` | `false` | না (ঐচ্ছিক) | `true` (রিড-অনলি রেপ্লিকা পুলে রাউট করুন) অথবা `false` (রিড-রাইট মাস্টার পুলে রাউট করুন)।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true হলে রিড-অনলি রেপ্লিকায় রাউটিং নির্দেশ করে।<br/>*সতর্কতা:* রাইট অপারেশনে (`POST`/`PUT`/`DELETE`) কখনোই `readOnly = true` দেবেন না — রিড রেপ্লিকা লেখা প্রত্যাখ্যান করে। |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
