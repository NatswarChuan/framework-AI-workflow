# 06. सभी 60 डिक्लेरेटिव एनोटेशन का पूर्ण तकनीकी विनिर्देश (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0` के सभी **60 डिक्लेरेटिव एनोटेशन** का संपूर्ण तकनीकी संदर्भ, जिसे सीधे Java `@interface` स्रोत कोड से निकाला गया है: सटीक पैकेज, `@Target`, **प्रत्येक एट्रिब्यूट**, Java प्रकार, डिफ़ॉल्ट मान, आवश्यक/वैकल्पिक स्थिति, **उपयोग विधि**, **कब उपयोग करें**, **कब उपयोग न करें और सावधानियाँ**, और सत्यापित Java कोड उदाहरण।

## त्वरित सूचकांक (60 एनोटेशन)

| एनोटेशन | श्रेणी | `@Target` | एट्रिब्यूट सारांश | मुख्य उद्देश्य |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> को विस्तारित करने वाले इंटरफ़ेस को 40 कॉन्ट्रैक्ट्स (Swagger UI में डिफ़ॉल्ट 38 दृश्यमान) के रनटाइम JDK डायनेमिक प्रॉक्सी में बदलता है। |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | डायनेमिक CRUD के बजाय MethodHandleCacheUtil के माध्यम से किसी एक घोषित कंट्रोलर मेथड को कस्टम Spring बीन पर पुनर्निर्देशित करता है। |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | डोमेन-विशिष्ट वर्कफ़्लो रूट (चेकआउट, रिफ़ंड, अनुमोदन) को स्वतंत्र Spring @Component Helper बीन्स से जोड़ता है। |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | स्थिर Spring Web आयात के बिना @GetMapping का शुद्ध Java प्रतिस्थापन। |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | कस्टम consumes/produces मीडिया प्रकारों का समर्थन करने वाला शुद्ध Java HTTP POST रूट घोषणा। |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | पूर्ण संसाधन प्रतिस्थापन के लिए शुद्ध Java HTTP PUT रूट मैपिंग। |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | आंशिक मर्ज, परमाणु वृद्धि और RFC 6902 JSON Patch का समर्थन करने वाली शुद्ध Java HTTP PATCH घोषणा। |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | राज्य-संरक्षित सॉफ्ट डिलीशन ट्रिगर करने वाली शुद्ध Java HTTP DELETE घोषणा। |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL क्वेरी पैरामीटर या Map<String, String> डायनेमिक फ़िल्टर मैप बाइंड करता है। |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 इकाई ID जैसे URI पथ चर बाइंड करता है। |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | @Valid के साथ युग्मित DTO या Entity मापदंडों में HTTP JSON अनुरोध पेलोड को डीसीरियलाइज़ करता है। |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | चक्रीय लूप अस्वीकृति के साथ GET /{id}/{relation}/** के माध्यम से चाइल्ड संबंधों का पुनरावर्ती ट्रैवर्सल अनुमत करता है। |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | कस्टम एक्शन मेथड्स पर घोषणात्मक डोमेन स्टेट ट्रांज़िशन या संख्यात्मक समायोजन घोषित करता है। |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | कंपाइल-टाइम @Component आयात के बिना बूटस्ट्रैप पर पंजीकृत फ्रेमवर्क घटक मार्कर। |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride के साथ जोड़ी गई ServiceImpl कक्षाओं के लिए सेवा-स्तर स्टीरियोटाइप मार्कर। |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean कक्षाओं के भीतर प्रबंधित बीन फ़ैक्टरी मेथड्स घोषित करता है। |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | कॉन्फ़िगरेशन कक्षाओं और YAML प्रॉपर्टी बाइंडिंग मॉडल को चिह्नित करता है। |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer बीन्स और फ़िल्टर श्रृंखलाओं के बीच निष्पादन प्राथमिकता क्रम नियंत्रित करता है। |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | इकाई क्वेरी या परिवर्तन से पहले NIST Level 2 RBAC, ownerField अलगाव और सूक्ष्म अनुमति कोड लागू करता है। |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | जब कॉलर भूमिकाओं के पास अनुमति न हो तो संवेदनशील कॉलम को गतिशील रूप से मास्क या शून्य करता है। |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition द्वारा अनुमत अवस्था संक्रमण लागू करता है और DELETE /{id} को deletableStates तक सीमित करता है। |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | पठनीय नीति वाक्यों को सक्रिय RBAC, संक्रमण और मास्किंग नियमों में संकलित करता है। |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | टाइम-ट्रैवल स्थिति पुनर्निर्माण और /diff निरीक्षण के लिए परिवर्तनों पर फ़ील्ड-स्तरीय अंतर रिकॉर्ड करता है। |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | जब तक कॉलर के पास बायपास भूमिका न हो, सक्रिय किरायेदार संदर्भ द्वारा पंक्ति क्वेरी और परिवर्तनों को स्वचालित रूप से अलग करता है। |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | create, update और upsert पर सहेजने से पहले अद्वितीयता सत्यापित करता है। |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (अनिवार्य)` | खाली छोड़ने पर निर्माण या क्लोन के समय अद्वितीय उपसर्गयुक्त व्यावसायिक कोड स्वचालित उत्पन्न करता है। |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (अनिवार्य)` | sourceField से स्वचालित रूप से URL-अनुकूल ASCII स्लग संश्लेषित करता है। |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | इकाई परिवर्तन सहेजने से पहले व्युत्पन्न संख्यात्मक योग की सटीक गणना करता है। |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | कंट्रोलर एंडपॉइंट्स से कस्टम SQL/JPQL या प्रदाता हेल्पर मेथड्स जोड़ने की अनुमति देता है। |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | JPA इकाई को लाइव डेटाबेस RBAC भूमिका कैटलॉग तालिका के रूप में नामित करता है। |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityRoleEntity के भीतर अद्वितीय भूमिका कोड कॉलम को मैप करता है। |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityRoleEntity पर मानव-पठनीय भूमिका प्रदर्शन नाम फ़ील्ड की पहचान करता है। |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | भूमिका इकाई पर अनुमत अनुमति कोड संग्रह या CSV स्ट्रिंग फ़ील्ड चिह्नित करता है। |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | संसाधन-क्रिया अनुमतियों और गतिशील फ़ील्ड-मास्किंग नियमों को संग्रहीत करने वाली JPA इकाई को चिह्नित करता है। |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPermissionEntity के भीतर अद्वितीय अनुमति पहचानकर्ता फ़ील्ड निर्दिष्ट करता है। |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPermissionEntity के भीतर लक्ष्य इकाई या API संसाधन नाम (या वाइल्डकार्ड *) मैप करता है। |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPermissionEntity नियम द्वारा सुरक्षित तार्किक CRUD या कस्टम क्रिया को मैप करता है। |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | इस डेटाबेस अनुमति नियम के ट्रिगर होने पर गतिशील रूप से छुपाए जाने वाले अल्पविराम-पृथक इकाई फ़ील्ड घोषित करता है। |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | प्रमाणीकृत उपयोगकर्ता विषयों को DB भूमिकाओं और वैकल्पिक किरायेदार दायरे से जोड़ने वाली JPA इकाई को मैप करता है। |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityUserRoleEntity पर प्रमुख विषय / उपयोगकर्ता नाम फ़ील्ड की पहचान करता है। |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityUserRoleEntity के भीतर असाइन किए गए भूमिका कोड कॉलम को बाइंड करता है। |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityUserRoleEntity असाइनमेंट को किसी विशिष्ट किरायेदार ID (या वैश्विक के लिए *) तक सीमित करता है। |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | priority द्वारा क्रमबद्ध स्पष्ट ALLOW / DENY रनटाइम प्राधिकरण नीतियों को सहेजने वाली JPA इकाई को चिह्नित करता है। |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPolicyEntity में लक्ष्य संसाधन पहचानकर्ता पैटर्न को मैप करता है। |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPolicyEntity के भीतर संरक्षित संचालन क्रिया (READ, WRITE, DELETE, methodName, *) को मैप करता है। |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPolicyEntity नियम द्वारा लक्षित भूमिकाओं के संग्रह या अल्पविराम-पृथक सूची को मैप करता है। |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(मार्कर एनोटेशन — कोई एट्रिब्यूट नहीं)` | @SecurityPolicyEntity नियम पर ALLOW या DENY नीति निर्णय परिणाम निर्दिष्ट करता है। |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST मैप (अधिकतम 1024 प्रविष्टियां) में कैश्ड SpEL कुंजियों पर समवर्ती पहुंच को क्रमबद्ध करता है (डिफ़ॉल्ट waitTimeMs=3000L, leaseTimeMs=5000L)। |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | कॉन्फ़िगरेबल TTL विंडो के भीतर समवर्ती या दोहराए गए डुप्लिकेट राइट्स को रोकता है। |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP, User या Tenant विभाजन के अनुसार स्लाइडिंग-विंडो अनुरोध थ्रॉटलिंग लागू करता है। |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator और Micrometer को टेलीमेट्री रिपोर्ट करते हुए Resilience4j सर्किट ब्रेकर में संचालन लपेटता है। |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | कॉन्फ़िगरेबल एक्सपोनेंशियल बैकऑफ़ के साथ अस्थायी विफलताओं को स्वचालित रूप से पुनः प्रयास करता है। |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 कमजोर ETag (W/"...") की गणना करता है और Cache-Control + HTTP 304 Not Modified प्रतिक्रियाएं उत्सर्जित करता है। |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Caffeine L1 / Redis L2 इंजन के अंदर सर्वर-साइड रीड मेथड आउटपुट कैश करता है। |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | परिवर्तनों पर पुरानी सर्वर-साइड कैश प्रविष्टियों को हटाता है। |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | निष्पादन अवधि प्रोफ़ाइल करता है और धीमी कॉल सीमा से अधिक होने पर WARN लॉग जारी करता है। |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | कमिट के बाद Virtual Threads पर अतुल्यकालिक HMAC-SHA256 हस्ताक्षरित आउटबाउंड वेबहुक भेजता है। |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | लेनदेन कमिट के बाद CNCF CloudEvents v1.0 एनवेलप प्रकाशित करता है। |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | इकाई या क्वेरी संचालन को तार्किक नामित डेटास्रोत कुंजी से जोड़ता है। |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | प्रति इकाई डेटाबेस इंजन परिवार और तार्किक क्लस्टर शार्ड असाइन करता है। |

---

## 1. रूटिंग, डायनामिक API कॉन्ट्रैक्ट्स, DTO डीकपलिंग और पैरामीटर बाइंडिंग (13 एनोटेशन)

### `@AutoRestController`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **उद्देश्य**: AutoApiController<E> को विस्तारित करने वाले इंटरफ़ेस को 40 कॉन्ट्रैक्ट्स (Swagger UI में डिफ़ॉल्ट 38 दृश्यमान) के रनटाइम JDK डायनेमिक प्रॉक्सी में बदलता है।
- **रनटाइम व्यवहार**: बूट समय पर DynamicControllerProxyRegistrarHelper सक्षम कंट्रोलर्स को स्कैन कर RequestMappingHandlerMapping में रूट पंजीकृत करता है।
- **कैसे उपयोग करें**: `AutoApiController<E>` या `AutoReadApi<E>` को विस्तारित करने वाले Java `interface` पर `@AutoRestController(basePath = "/api/v1/...")` लगाएं और `readDto`/`createDto`/`disabledEndpoints` सेट करें।
- **कब उपयोग करें**: जब बिना बॉयलरप्लेट लिखे किसी JPA एंटिटी के लिए मानक CRUD, पेजिनेशन, फ़िल्टर या रीड-ओनली REST API बनाना हो।
- **कब उपयोग न करें और जोखिम**: इसे ठोस `@RestController` क्लास या बिना JPA एंटिटी वाले वर्कफ़्लो पर न लगाएं; सार्वजनिक रीड-ओनली कैटलॉग हेतु `AutoApiController<E>` के बजाय `AutoReadApi<E>` चुनें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | नहीं (वैकल्पिक) | `/` से शुरू होने वाला मान्य HTTP पथ (जैसे `/api/v1/product-catalogs`) या स्वतः व्युत्पत्ति हेतु खाली स्ट्रिंग `""`।<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | स्पष्ट रूट URI पथ (जैसे "/api/v1/product-catalogs")। खाली छोड़ने पर कंट्रोलर नाम से स्वतः kebab-case बहुवचन पथ बनता है।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `path` से पहले `basePath` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `path` | `String` | `""` | नहीं (वैकल्पिक) | `/` से शुरू होने वाला मान्य HTTP पथ (जैसे `/api/v1/orders`) या स्वतः व्युत्पत्ति हेतु खाली स्ट्रिंग `""`।<br/>`@AutoRestController(path = "/api/v1/orders")` | वैकल्पिक पाथ उपनाम। basePath को प्राथमिकता दें क्योंकि DynamicControllerProxyRegistrarHelper पहले उसे पढ़ता है।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `path` से पहले `basePath` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `entityName` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"ProductCatalog"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoRestController(entityName = "ProductCatalog")` | सामान्य E क्लास नाम के बजाय OpenAPI/Studio मेटाडेटा में प्रदर्शित एंटिटी नाम को ओवरराइड करता है।<br/>*सावधानी:* सीधे Swagger / OpenAPI 3.0 और NWVMC Studio में दिखता है; ज़ीरो हार्ड-कोड नियम हेतु टेक्स्ट को `OpenApiConstant` में रखें। |
| `enabledEndpoints` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`।<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | अनुमत कॉन्ट्रैक्ट मेथड नामों की श्वेतसूची (जैसे "getPage", "create")। खाली होने पर सभी इनहेरिटेड मेथड सक्षम रहते हैं।<br/>*सावधानी:* सख्त श्वेतसूची के रूप में काम करता है: गैर-खाली होने पर सूची से बाहर के सभी मेथड Spring MVC और Swagger UI से हट जाते हैं। |
| `disabledEndpoints` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`।<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | MVC मैपिंग से पहले विशिष्ट AutoApiController मेथड बंद करने की ब्लैकलिस्ट (जैसे "deleteById", "batchChunked")।<br/>*सावधानी:* `enabledEndpoints` के बाद लागू होता है; बाकी 40 कॉन्ट्रैक्ट चालू रखते हुए विनाशकारी या बल्क एंडपॉइंट रोकने हेतु उपयोग करें। |
| `enableNestedSubResources` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | पुनरावर्ती GET /{id}/** सब-रिसोर्स नेविगेशन सक्षम करता है। रूट विस्तार रोकने हेतु डिफ़ॉल्ट false है।<br/>*सावधानी:* जब तक `GET /{id}/items/...` आवश्यक न हो इसे `false` रखें; चालू करने पर `@EnableNestedSubResource` के साथ सीमित करें। |
| `readDto` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कोई भी कंक्रीट Java DTO क्लास लिटरल (जैसे `ProductReadDto.class`) या DTO मैपिंग बंद करने हेतु `Void.class`।<br/>`@AutoRestController(readDto = ProductReadDto.class)` | वैकल्पिक रीड DTO जो प्रतिक्रिया से संवेदनशील एंटिटी फ़ील्ड हटाता है; Void.class पर मूल एंटिटी लौटती है।<br/>*सावधानी:* केवल रीड (GET) पाइपलाइन पर लागू; DTO क्लास में नो-आर्ग कंस्ट्रक्टर/गेटर्स (या `@Builder`) होना चाहिए और यह `@Valid` का सम्मान करता है। |
| `createDto` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कोई भी कंक्रीट Java DTO क्लास लिटरल (जैसे `ProductCreateDto.class`) या DTO मैपिंग बंद करने हेतु `Void.class`।<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | वैकल्पिक इनपुट DTO जिस पर POST मैपिंग से पहले Jakarta Validation लागू होता है।<br/>*सावधानी:* केवल क्रिएट (POST) पाइपलाइन पर लागू; DTO क्लास में नो-आर्ग कंस्ट्रक्टर/गेटर्स (या `@Builder`) होना चाहिए और यह `@Valid` का सम्मान करता है। |
| `updateDto` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कोई भी कंक्रीट Java DTO क्लास लिटरल (जैसे `ProductUpdateDto.class`) या DTO मैपिंग बंद करने हेतु `Void.class`।<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | वैकल्पिक अपडेट DTO जो PUT/PATCH में परिवर्तनीय फ़ील्ड सीमित करता है और वैलिडेशन चलाता है।<br/>*सावधानी:* केवल अपडेट (PUT/PATCH) पाइपलाइन पर लागू; DTO क्लास में नो-आर्ग कंस्ट्रक्टर/गेटर्स (या `@Builder`) होना चाहिए और यह `@Valid` का सम्मान करता है। |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: डायनेमिक CRUD के बजाय MethodHandleCacheUtil के माध्यम से किसी एक घोषित कंट्रोलर मेथड को कस्टम Spring बीन पर पुनर्निर्देशित करता है।
- **रनटाइम व्यवहार**: EscapeHatchDispatchHelper targetBean या beanName से लक्ष्य बीन हल करता है और MethodHandleCacheUtil में MethodHandle कैश करता है।
- **कैसे उपयोग करें**: `@AutoRestController` इंटरफ़ेस के किसी मेथड पर `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` लगाएं और टारगेट क्लास को Spring `@Component` बनाएं।
- **कब उपयोग करें**: जब अधिकांश एंडपॉइंट ऑटो CRUD से चलते हों और केवल किसी एक मेथड (जैसे कस्टम `create` या सांख्यिकी) के लिए कस्टम Java लॉजिक चाहिए हो।
- **कब उपयोग न करें और जोखिम**: `targetBean` में कभी String मान न दें (`Class<?>` आवश्यक है; नाम के लिए `beanName` चुनें)। यदि `@HumanPolicy` पर्याप्त है तो अनावश्यक ओवरराइड न करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कंक्रीट Spring `@Service`/`@Component` बीन क्लास (जैसे `OrderCustomService.class`), या `beanName` से हल करने हेतु `Void.class`।<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | लक्षित Spring बीन क्लास (beanName से प्राथमिकता)। एकाधिक कार्यान्वयन होने पर beanName का उपयोग करें।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `beanName` से पहले `targetBean` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `beanName` | `String` | `""` | नहीं (वैकल्पिक) | ApplicationContext में पंजीकृत सटीक बीन नाम (जैसे `"orderCustomService"`), या स्वतः समाधान हेतु `""`।<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | targetBean Void.class होने पर Spring कंटेनर में Bean नाम द्वारा हल किया जाता है।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `beanName` से पहले `targetBean` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `methodName` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"createOrder"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | लक्षित बीन पर मेथड का नाम; खाली होने पर कंट्रोलर इंटरफ़ेस मेथड के नाम का उपयोग होता है।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"createOrder"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `bypassAutoDispatch` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (डिफ़ॉल्ट — ओवरराइड सक्रिय कर टारगेट बीन चलाएँ) या `false` (ओवरराइड निष्क्रिय कर डिफ़ॉल्ट CRUD चलाएँ)।<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true होने पर डिफ़ॉल्ट CRUD को पूरी तरह बायपास कर MethodHandleCacheUtil से कस्टम बीन चलाता है।<br/>*सावधानी:* `true` होने पर `EscapeHatchDispatchHelper` आपका बीन चलाता है। `false` सेट करने से `@ServiceOverride` निष्क्रिय होकर डिफ़ॉल्ट CRUD चलता है (यह प्री/पोस्ट हुक नहीं है)। |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: डोमेन-विशिष्ट वर्कफ़्लो रूट (चेकआउट, रिफ़ंड, अनुमोदन) को स्वतंत्र Spring @Component Helper बीन्स से जोड़ता है।
- **रनटाइम व्यवहार**: पूर्ण सत्यापन और लेनदेन सुरक्षा के साथ कैश्ड MethodHandle लुकअप के माध्यम से delegateBean.delegateMethod निष्पादित करता है।
- **कैसे उपयोग करें**: कंट्रोलर मेथड पर `path`, `httpMethod`, `delegateBean` और `delegateMethod` घोषित कर स्वतंत्र `@Component` Helper को कार्य सौंपें।
- **कब उपयोग करें**: चेकआउट, रिफ़ंड, ऑर्डर रद्दीकरण या मल्टी-एंटिटी लेनदेन जैसे डोमेन वर्कफ़्लो रूट बनाने के लिए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: प्रॉक्सी AOP पर निर्भर न रहें (`@CustomEndpoint` सीधे `ControllerProxySpecialRouteUtil` से चलता है); साधारण बदलावों हेतु `@BusinessAction` चुनें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/reports/monthly-sales`); खाली `""` रूट पर बाइंड होता है।<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | कंट्रोलर basePath के अंतर्गत सापेक्ष एंडपॉइंट पथ (जैसे "/checkout")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `path` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `httpMethod` | `String` | `"GET"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`।<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP विधि ("GET", "POST", "PUT", "PATCH", "DELETE")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `httpMethod` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `delegateBean` | `String` | `""` | नहीं (वैकल्पिक) | ApplicationContext में पंजीकृत सटीक बीन नाम (जैसे `"orderReportService"`), या स्वतः समाधान हेतु `""`।<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | वर्कफ़्लो हैंडलर मेथड वाले Spring बीन का नाम (डिफ़ॉल्ट मेथड या @ServiceOverride न होने पर अनिवार्य)।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `delegateBean` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `delegateMethod` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"buildMonthlyReport"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean पर लक्षित मेथड नाम; खाली होने पर कंट्रोलर मेथड नाम।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"buildMonthlyReport"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `summary` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"Get monthly revenue breakdown"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI में दिखने वाला संक्षिप्त OpenAPI 3.0 सारांश।<br/>*सावधानी:* सीधे Swagger / OpenAPI 3.0 और NWVMC Studio में दिखता है; ज़ीरो हार्ड-कोड नियम हेतु टेक्स्ट को `OpenApiConstant` में रखें। |
| `description` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"Aggregates confirmed invoice totals grouped by currency"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI में एंडपॉइंट खोलने पर दिखने वाला विस्तृत OpenAPI 3.0 विवरण।<br/>*सावधानी:* सीधे Swagger / OpenAPI 3.0 और NWVMC Studio में दिखता है; ज़ीरो हार्ड-कोड नियम हेतु टेक्स्ट को `OpenApiConstant` में रखें। |

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

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: स्थिर Spring Web आयात के बिना @GetMapping का शुद्ध Java प्रतिस्थापन।
- **रनटाइम व्यवहार**: प्रॉक्सी बूटस्ट्रैप पर HTTP GET RequestMappingInfo के रूप में मैप किया जाता है।
- **कैसे उपयोग करें**: `@AutoRestController` इंटरफ़ेस के भीतर किसी मेथड पर `@AutoGet("/your-path")` लगाएं (प्रायः `@ServiceOverride` या `@CustomQuery` के साथ)।
- **कब उपयोग करें**: जब बिना Spring Web `@GetMapping` इम्पोर्ट किए प्योर Java इंटरफ़ेस में रीड-ओनली HTTP GET रूट परिभाषित करना हो।
- **कब उपयोग न करें और जोखिम**: डेटाबेस बदलने वाले कार्यों के लिए `@AutoGet` न लगाएं (`@AutoPost`/`@AutoDelete` चुनें), और सामान्य `@RestController` क्लास में न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/{id}/summary`); खाली `""` रूट पर बाइंड होता है।<br/>`@AutoGet("/{id}/summary")` | सापेक्ष GET पाथ टेम्पलेट (जैसे "/metrics")। खाली होने पर सीधे basePath पर मैप होता है।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `produces` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json", "text/csv"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | वैकल्पिक आउटपुट मीडिया प्रकार (जैसे "text/event-stream", "text/csv")।<br/>*सावधानी:* Spring MVC HTTP `Accept` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: कस्टम consumes/produces मीडिया प्रकारों का समर्थन करने वाला शुद्ध Java HTTP POST रूट घोषणा।
- **रनटाइम व्यवहार**: SpringMvcEndpointBridge में HTTP POST हैंडलर के रूप में पंजीकृत होता है।
- **कैसे उपयोग करें**: `@AutoRestController` में क्रिएट/एक्शन मेथड पर `@AutoPost("/path")` लगाएं, `@AutoBody`/`@RequestBody` से पेलोड बाइंड करें और `@BusinessAction` या `@ServiceOverride` से जोड़ें।
- **कब उपयोग करें**: रिसोर्स बनाने, कमांड ट्रिगर करने या बैच सबमिट करने वाले POST रूट के लिए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: रीड-ओनली क्वेरी (`@AutoGet`), पूर्ण प्रतिस्थापन (`@AutoPut`), आंशिक अपडेट (`@AutoPatch`) या डिलीट (`@AutoDelete`) हेतु न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/{id}/approve`); खाली `""` रूट पर बाइंड होता है।<br/>`@AutoPost("/{id}/approve")` | basePath के अंतर्गत सापेक्ष POST पथ टेम्पलेट।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `consumes` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json", "multipart/form-data"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | स्वीकार्य अनुरोध Content-Type मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Content-Type` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |
| `produces` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | प्रतिक्रिया में उत्पादित मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Accept` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: पूर्ण संसाधन प्रतिस्थापन के लिए शुद्ध Java HTTP PUT रूट मैपिंग।
- **रनटाइम व्यवहार**: लेनदेन निष्पादन के भीतर लिपटे HTTP PUT हैंडलर के रूप में बाध्य किया गया।
- **कैसे उपयोग करें**: पूर्ण अपडेट मेथड पर `@AutoPut("/{id}")` लगाएं और `@AutoVariable UUID id` व `@AutoBody` से जोड़ें।
- **कब उपयोग करें**: पूरे पेलोड के साथ आइडेंटपोटेंट फुल-रिसोर्स रिप्लेसमेंट PUT एंडपॉइंट के लिए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: केवल कुछ फ़ील्ड बदलने हेतु `@AutoPatch` या `@BusinessAction` चुनें (`@Version` संघर्ष पर `409 Conflict` आता है)।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/{id}/replace`); खाली `""` रूट पर बाइंड होता है।<br/>`@AutoPut("/{id}/replace")` | सापेक्ष PUT पथ टेम्पलेट (जैसे "/{id}")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `consumes` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | समर्थित अनुरोध Content-Type मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Content-Type` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |
| `produces` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | उत्पादित प्रतिक्रिया मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Accept` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: आंशिक मर्ज, परमाणु वृद्धि और RFC 6902 JSON Patch का समर्थन करने वाली शुद्ध Java HTTP PATCH घोषणा।
- **रनटाइम व्यवहार**: JSON मर्ज सिमेंटिक्स और application/json-patch+json का समर्थन करता है।
- **कैसे उपयोग करें**: आंशिक अपडेट या `@BusinessAction` स्टेट ट्रांज़िशन मेथड पर `@AutoPatch("/{id}/action")` लगाएं।
- **कब उपयोग करें**: आंशिक फ़ील्ड बदलाव, एटॉमिक न्यूमेरिक एडजस्टमेंट और स्टेट ट्रांज़िशन के लिए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: पूरी एंटिटी बदलने हेतु `@AutoPut` और नया रिकॉर्ड बनाने हेतु `@AutoPost` का उपयोग करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/{id}/status`); खाली `""` रूट पर बाइंड होता है।<br/>`@AutoPatch("/{id}/status")` | सापेक्ष PATCH पथ टेम्पलेट (जैसे "/{id}/approve")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `consumes` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json", "application/merge-patch+json"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | स्वीकार्य Content-Type मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Content-Type` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |
| `produces` | `String[]` | `{}` | नहीं (वैकल्पिक) | MIME मीडिया प्रकारों का ऐरे (जैसे `{"application/json"}`); खाली `{}` डिफ़ॉल्ट `application/json` स्वीकारता है।<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | उत्पादित मीडिया प्रकार।<br/>*सावधानी:* Spring MVC HTTP `Accept` पर कंटेंट नेगोशिएशन लागू करता है; बेमेल हेडर पर `406` या `415` त्रुटि मिलती है। |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: राज्य-संरक्षित सॉफ्ट डिलीशन ट्रिगर करने वाली शुद्ध Java HTTP DELETE घोषणा।
- **रनटाइम व्यवहार**: deleted=true चिह्नित करने से पहले @StateMachine deletableStates सत्यापित करता है।
- **कैसे उपयोग करें**: कंट्रोलर इंटरफ़ेस के कस्टम डिलीट मेथड पर `@ServiceOverride` के साथ `@AutoDelete("/{id}/custom")` लगाएं।
- **कब उपयोग करें**: कंट्रोलर इंटरफ़ेस पर कस्टम आर्काइव, सॉफ्ट-डिलीट या क्लीनअप DELETE एंडपॉइंट के लिए।
- **कब उपयोग न करें और जोखिम**: यदि बिल्ट-इन सॉफ्ट-डिलीट और `@StateMachine(deletableStates)` पर्याप्त हैं, तो दोहराव न करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | वैकल्पिक `{pathVar}` टेम्पलेट सहित सापेक्ष URI उप-पथ (जैसे `/{id}/archive`); खाली `""` रूट पर बाइंड होता है।<br/>`@AutoDelete("/{id}/archive")` | सापेक्ष DELETE पथ टेम्पलेट (जैसे "/{id}/purge")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **उद्देश्य**: URL क्वेरी पैरामीटर या Map<String, String> डायनेमिक फ़िल्टर मैप बाइंड करता है।
- **रनटाइम व्यवहार**: QueryGuardrailEnforcerUtil सत्यापन के साथ DynamicQueryParameterParserHelper द्वारा निकाला जाता है।
- **कैसे उपयोग करें**: कंट्रोलर इंटरफ़ेस के मेथड पैरामीटर पर `@AutoParam("status")` या `defaultValue` लगाएं।
- **कब उपयोग करें**: जब कंट्रोलर इंटरफ़ेस को 100% प्योर Java रखते हुए HTTP क्वेरी पैरामीटर बाइंड करने हों।
- **कब उपयोग न करें और जोखिम**: URI पाथ (`@AutoVariable`) या JSON बॉडी (`@AutoBody`) के लिए न लगाएं। `v0.1.0` में `@RequestParam` भी समर्थित है।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"status"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoParam("status") String status` | बाइंड करने हेतु क्वेरी पैरामीटर नाम। खाली होने पर Java पैरामीटर नाम प्रयुक्त होता है।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `name` से पहले `value` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `name` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"pageSize"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | स्पष्ट क्वेरी पैरामीटर नाम।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `name` से पहले `value` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `required` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (अनिवार्य; न होने पर HTTP 400) या `false` (वैकल्पिक; न होने पर null पास होता है)।<br/>`@AutoParam(name = "keyword", required = false) String keyword` | क्या इस पैरामीटर के न होने पर HTTP 400 त्रुटि देनी है।<br/>*सावधानी:* `defaultValue` देने पर स्वतः वैकल्पिक हो जाता है; `false` होने पर NPE से बचने हेतु प्रिमिटिव के बजाय बॉक्सड टाइप (`Integer`) प्रयोग करें। |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"20"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | पैरामीटर न होने पर उपयोग होने वाला डिफ़ॉल्ट मान (DEFAULT_NONE कोई मान नहीं दर्शाता है)।<br/>*सावधानी:* स्ट्रिंग से Spring `ConversionService` द्वारा लक्ष्य प्रकार में बदला जाता है; गलत मान पर HTTP `400` मिलता है। |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **उद्देश्य**: UUIDv7 इकाई ID जैसे URI पथ चर बाइंड करता है।
- **रनटाइम व्यवहार**: MVC पथ टेम्पलेट से टाइप्ड Java UUID/String मानों में पार्स किया जाता है।
- **कैसे उपयोग करें**: `findById(@AutoVariable("id") UUID id)` जैसे पाथ आईडी पैरामीटर पर लगाएं।
- **कब उपयोग करें**: प्योर Java इंटरफ़ेस में URI टेम्पलेट से `{id}` या `{code}` निकालने के लिए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: क्वेरी पैरामीटर (`@AutoParam`) या बॉडी (`@AutoBody`) के लिए न लगाएं; `@PathVariable` भी मान्य है।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"orderId"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoVariable("orderId") UUID orderId` | बाइंड करने हेतु URI टेम्पलेट पाथ वेरिएबल नाम।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `name` से पहले `value` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `name` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"tenantCode"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | स्पष्ट URI टेम्पलेट वेरिएबल नाम।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `name` से पहले `value` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `required` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (अनिवार्य; न होने पर HTTP 400) या `false` (वैकल्पिक; न होने पर null पास होता है)।<br/>`@AutoVariable(name = "id", required = true) UUID id` | क्या पाथ वेरिएबल का होना अनिवार्य है।<br/>*सावधानी:* पाथ वेरिएबल नाम URI टेम्पलेट के `{variableName}` से मेल खाना चाहिए; `false` केवल वैकल्पिक URI पैटर्न पर उपयोगी है। |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **उद्देश्य**: @Valid के साथ युग्मित DTO या Entity मापदंडों में HTTP JSON अनुरोध पेलोड को डीसीरियलाइज़ करता है।
- **रनटाइम व्यवहार**: सेवा लेनदेन में प्रवेश करने से पहले LocalValidatorFactoryBean से सत्यापित होता है।
- **कैसे उपयोग करें**: `@AutoPost`/`@AutoPut` मेथड पैरामीटर पर `@AutoBody` (और `@Valid`) लगाएं।
- **कब उपयोग करें**: जब प्योर Java प्रॉक्सी कंट्रोलर में JSON पेलोड को एंटिटी या DTO में डीसीरियलाइज़ करना हो।
- **कब उपयोग न करें और जोखिम**: बिना बॉडी वाले GET/DELETE पर न लगाएं, और एक ही मेथड में दो `@AutoBody` न रखें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (अनिवार्य; न होने पर HTTP 400) या `false` (वैकल्पिक; न होने पर null पास होता है)।<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | क्या अनुरोध बॉडी गायब होने पर HTTP 400 त्रुटि देनी है।<br/>*सावधानी:* प्रॉक्सी डिस्पैच से पहले Jakarta सत्यापन हेतु `@Valid` के साथ जोड़ें; `false` खाली बॉडी की अनुमति देता है। |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: चक्रीय लूप अस्वीकृति के साथ GET /{id}/{relation}/** के माध्यम से चाइल्ड संबंधों का पुनरावर्ती ट्रैवर्सल अनुमत करता है।
- **रनटाइम व्यवहार**: कंट्रोलर पर @AutoRestController(enableNestedSubResources = true) आवश्यक है।
- **कैसे उपयोग करें**: `@AutoRestController` पर `enableNestedSubResources = true` सेट करें और `@EnableNestedSubResource(allowedRelationships = {"items"})` से संबंध सीमित करें।
- **कब उपयोग करें**: जब `GET /api/v1/customer-orders/{id}/items` जैसे पैरेंट-चाइल्ड नेस्टेड URL के साथ हर स्तर पर सुरक्षा जांच चाहिए हो।
- **कब उपयोग न करें और जोखिम**: बिना `allowedRelationships` सीमित किए बड़े स्कीमा पर या अलग बॉन्डेड कॉन्टेक्स्ट के बीच न खोलें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)।<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | GET /{id}/** नेविगेशन के दौरान अनुमत लक्ष्य JPA एंटिटी कक्षाओं की सूची।<br/>*सावधानी:* खाली ऐरे सभी चाइल्ड एंटिटी खोल देता है; अनपेक्षित डेटा लीक रोकने हेतु स्पष्ट क्लास सूची दें। |
| `allowedRelationships` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `"items"`, `"payments"`, `"shipments"` (JPA field names)।<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | सब-रिसोर्स URL पथों में अनुमत JPA एसोसिएशन फ़ील्ड नामों की सूची।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"items"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: कस्टम एक्शन मेथड्स पर घोषणात्मक डोमेन स्टेट ट्रांज़िशन या संख्यात्मक समायोजन घोषित करता है।
- **रनटाइम व्यवहार**: अपडेट किए गए इकाई गुणों को सहेजने से पहले परमाणु रूप से निष्पादित होता है।
- **कैसे उपयोग करें**: कंट्रोलर इंटरफ़ेस मेथड पर `@AutoPatch` के साथ `@BusinessAction` लगाएं; प्रॉक्सी इसे लेनदेन के भीतर स्वतः चलाता है।
- **कब उपयोग करें**: बिना Service लिखे सिंगल-एंटिटी अनुमोदन, रद्द करने, स्टॉक/बैलेंस समायोजन या डोमेन मेथड ट्रिगर करने के लिए।
- **कब उपयोग न करें और जोखिम**: मल्टी-एंटिटी ऑर्केस्ट्रेशन, बाहरी API कॉल या असिंक्रोनस कार्यों हेतु न लगाएं (`@ServiceOverride` चुनें)।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर लाइफसाइकल स्थिति फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"status"`)।<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | एंटिटी में स्टेट रखने वाले फ़ील्ड का नाम (@StateMachine होने पर सत्यापित)।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"status"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `targetStateValue` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"APPROVED"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | लेनदेन में targetStateField को दिया जाने वाला लक्षित स्टेट मान।<br/>*सावधानी:* सेव करने से पहले `@StateMachine` या `@HumanPolicy` से सत्यापित होता है; अवैध ट्रांजिशन पर रोलबैक होता है। |
| `adjustNumericField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर संख्यात्मक फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"stockQuantity"`)।<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | एटॉमिक रूप से घटाए-बढ़ाए जाने वाले संख्यात्मक फ़ील्ड का नाम।<br/>*सावधानी:* इसके साथ `deltaParamIndex >= 0` या `fixedDelta` देना आवश्यक है। `Integer`, `Long`, `BigDecimal` समर्थित हैं। |
| `deltaParamIndex` | `int` | `-1` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `-1` (disabled) or `0`-based method argument index (e.g., `1`)।<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | डायनेमिक डेल्टा मान वाले मेथड पैरामीटर का 0-आधारित इंडेक्स (-1 अक्षम करता है)।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `fixedDelta` से पहले `deltaParamIndex` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `fixedDelta` | `String` | `""` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`।<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | पैरामीटर के बजाय प्रयुक्त निश्चित संख्यात्मक डेल्टा स्ट्रिंग (जैसे "100", "-1")।<br/>*सावधानी:* स्टार्टअप पर प्रॉक्सी रजिस्ट्रार `fixedDelta` से पहले `deltaParamIndex` पढ़ता है। दोनों में विरोधाभासी मान न दें। |
| `entityMethod` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"markFulfilled"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@BusinessAction(entityMethod = "markFulfilled")` | उसी लेनदेन में निष्पादित होने वाले एंटिटी के बिना-आर्ग्युमेंट डोमेन मेथड का नाम।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"markFulfilled"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean खोज, कॉन्फ़िगरेशन बाइंडिंग और निष्पादन क्रम (5 एनोटेशन)

### `@AutoComponent`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: कंपाइल-टाइम @Component आयात के बिना बूटस्ट्रैप पर पंजीकृत फ्रेमवर्क घटक मार्कर।
- **रनटाइम व्यवहार**: फ़्रेमवर्क-आंतरिक स्कैन (io.github.natswarchuan); उपभोक्ता ऐप्स Spring @Component का उपयोग करें।
- **कैसे उपयोग करें**: `io.github.natswarchuan` पैकेज के भीतर `AutoBeanFactoryRegistrarBridge` द्वारा स्कैन किया जाने वाला आंतरिक स्टीरियोटाइप।
- **कब उपयोग करें**: केवल `io.github.natswarchuan.*` फ्रेमवर्क कोर में योगदान करते समय उपयोग करें।
- **कब उपयोग न करें और जोखिम**: उपभोक्ता ऐप्स (`com.example.*`) में कभी उपयोग न करें! यह केवल `io.github.natswarchuan` स्कैन करता है; `@Component` चुनें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | ApplicationContext में पंजीकृत सटीक बीन नाम (जैसे `"invoiceValidationHelper"`), या स्वतः समाधान हेतु `""`।<br/>`@AutoComponent("invoiceValidationHelper")` | वैकल्पिक स्पष्ट बीन नाम; खाली होने पर क्लास नाम का कैमल-केस लिया जाता है।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: @ServiceOverride के साथ जोड़ी गई ServiceImpl कक्षाओं के लिए सेवा-स्तर स्टीरियोटाइप मार्कर।
- **रनटाइम व्यवहार**: io.github.natswarchuan के भीतर सरल नाम से पंजीकृत; उपभोक्ता सेवाएं Spring @Service का उपयोग करें।
- **कैसे उपयोग करें**: `io.github.natswarchuan` के भीतर बिना Spring `@Service` के आंतरिक सेवा पंजीकृत करने हेतु।
- **कब उपयोग करें**: केवल `io.github.natswarchuan.*` कोर फ्रेमवर्क सेवाओं हेतु।
- **कब उपयोग न करें और जोखिम**: अपने ऐप की सर्विस में कभी न लगाएं — Spring `@Service` का उपयोग करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | ApplicationContext में पंजीकृत सटीक बीन नाम (जैसे `"orderFulfillmentService"`), या स्वतः समाधान हेतु `""`।<br/>`@AutoService("orderFulfillmentService")` | वैकल्पिक सेवा बीन नाम; खाली होने पर क्लास नाम प्रयुक्त।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: @AutoConfigurationBean कक्षाओं के भीतर प्रबंधित बीन फ़ैक्टरी मेथड्स घोषित करता है।
- **रनटाइम व्यवहार**: ऑटो-कॉन्फ़िगरेशन के दौरान PureJavaBeanRegistrarBridge द्वारा संसाधित होता है।
- **कैसे उपयोग करें**: फ्रेमवर्क `@AutoConfigurationBean` क्लास के अंदर फैक्ट्री मेथड्स पर लगाएं।
- **कब उपयोग करें**: केवल `io.github.natswarchuan.config.*` में शुद्ध-Java बीन फैक्ट्री हेतु।
- **कब उपयोग न करें और जोखिम**: उपभोक्ता `@Configuration` में उपयोग न करें; കस्टम SPI हेतु `@Bean` चुनें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `{"primaryObjectMapper", "nwvmcMapper"}`।<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | स्पष्ट बीन नाम और उपनाम सरणी।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `targetTypeName` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"com.example.spi.PaymentGateway"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | डायनेमिक ब्रिजिंग जांच हेतु लक्षित टाइप का पूर्ण नाम।<br/>*सावधानी:* फ़ैक्टरी मेथड द्वारा सामान्य सुपरटाइप लौटाने पर पूर्ण क्लास नाम संकेत देता है; क्लासपाथ पर उपलब्धता सुनिश्चित करें। |
| `primary` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (एक से अधिक उम्मीदवार होने पर इसे प्राथमिकता) या `false` (सामान्य उम्मीदवार प्राथमिकता)।<br/>`@AutoBean(primary = true)` | एकाधिक कैंडिडेट होने पर इस बीन को प्राथमिक के रूप में चिह्नित करता है।<br/>*सावधानी:* एक ही प्रकार के लिए दो `@AutoBean(primary = true)` घोषित करने पर स्टार्टअप पर बीन टकराव होगा। |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: कॉन्फ़िगरेशन कक्षाओं और YAML प्रॉपर्टी बाइंडिंग मॉडल को चिह्नित करता है।
- **रनटाइम व्यवहार**: IDE मेटाडेटा के साथ कॉन्फ़िगरेशन बीन और YAML उपसर्ग स्वच्छतापूर्वक पंजीकृत करता है।
- **कैसे उपयोग करें**: फ्रेमवर्क `io.github.natswarchuan.config.*` के कॉन्फ़िग और प्रॉपर्टी क्लास पर लगाया जाता है।
- **कब उपयोग करें**: केवल `io.github.natswarchuan` के भीतर `@Configuration` के विकल्प के रूप में।
- **कब उपयोग न करें और जोखिम**: उपभोक्ता ऐप्स में न लगाएं; `@Configuration` उपयोग करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | ApplicationContext में पंजीकृत सटीक बीन नाम (जैसे `"storageAutoConfig"`), या स्वतः समाधान हेतु `""`।<br/>`@AutoConfigurationBean("storageAutoConfig")` | वैकल्पिक कॉन्फ़िगरेशन बीन पहचानकर्ता।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `prefix` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"nwvmc.storage"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | वैकल्पिक YAML प्रॉपर्टी उपसर्ग (जैसे "app.framework.cache")।<br/>*सावधानी:* `application.yml` से मेल खाने वाली प्रॉपर्टीज़ बाइंड करता है; IDE चेतावनी से बचने हेतु metadata फ़ाइल साथ रखें। |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **उद्देश्य**: SPI Customizer बीन्स और फ़िल्टर श्रृंखलाओं के बीच निष्पादन प्राथमिकता क्रम नियंत्रित करता है।
- **रनटाइम व्यवहार**: छोटे पूर्णांक मान पहले निष्पादित होते हैं (डिफ़ॉल्ट Integer.MAX_VALUE)।
- **कैसे उपयोग करें**: `AutoBeanFactoryRegistrarBridge` द्वारा क्रमबद्ध प्योर-Java घटक पर `@OrderPriority(1)` लगाएं।
- **कब उपयोग करें**: जब एकाधिक फ्रेमवर्क बीन या SPI कस्टमाइज़र का क्रम तय करना हो।
- **कब उपयोग न करें और जोखिम**: Spring Security फ़िल्टर क्रम या `?sort=` क्वेरी के लिए इसका उपयोग न करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)।<br/>`@OrderPriority(10)` | निष्पादन प्राथमिकता पूर्णांक; कम मान पहले चलते हैं (Integer.MAX_VALUE सबसे कम)।<br/>*सावधानी:* कम संख्या पहले चलती है (Spring `@Order` के समान)। `< 0` सुरक्षा फ़िल्टर हेतु और `10..100` बिज़नेस लॉजिक हेतु रखें। |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. एंटिटी सुरक्षा, स्टेट मशीन, अखंडता, ऑटो-जनरेटर और क्वेरीज़ (11 एनोटेशन)

### `@EntitySecurity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: इकाई क्वेरी या परिवर्तन से पहले NIST Level 2 RBAC, ownerField अलगाव और सूक्ष्म अनुमति कोड लागू करता है।
- **रनटाइम व्यवहार**: SQL निष्पादन से पहले मूल्यांकित होता है; अनधिकृत पहुंच HTTP 403 Forbidden फेंकती है।
- **कैसे उपयोग करें**: किसी भी JPA `@Entity` क्लास पर लगाएं, भूमिकाएं सेट करें और रो-लेवल ओनरशिप हेतु `ownerField` जोड़ें।
- **कब उपयोग करें**: REST, बैच, एक्सपोर्ट और GraphQL में एकसमान सुरक्षा हेतु प्रत्येक उजागर `@Entity` पर उपयोग करें।
- **कब उपयोग न करें और जोखिम**: बिना `AutoReadApi<E>`, `disabledEndpoints` या `@SecurityPolicyEntity` के पूरे CRUD पर `permitAll = true` न लगाएं (यह READ/WRITE/DELETE सभी की जांच बायपास करता है)।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_USER", "ROLE_ADMIN"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | रिकॉर्ड पढ़ने (GET/GraphQL/Export) के लिए अधिकृत भूमिकाएं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |
| `writeRoles` | `String[]` | `{}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_MANAGER", "ROLE_ADMIN"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | POST/PUT/PATCH/इम्पोर्ट लेखन हेतु अधिकृत भूमिकाएं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |
| `deleteRoles` | `String[]` | `{}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | DELETE और बैच-डिलीट ऑपरेशन हेतु अधिकृत भूमिकाएं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |
| `permitAll` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (बिना लॉगिन सार्वजनिक पहुंच दें) या `false` (प्रमाणीकरण और रोल जांच अनिवार्य करें)।<br/>`@EntitySecurity(permitAll = true)` | true होने पर (बिना DB-RBAC ओवरराइड के) सभी READ/WRITE/DELETE जांच को बायपास करता है; पब्लिक कैटलॉग में AutoReadApi<E> जोड़ें।<br/>*सावधानी:* `readRoles`/`writeRoles`/`deleteRoles` को ओवरराइड कर गुमनाम एक्सेस देता है। PII या वित्तीय एंटिटी पर कभी न लगाएँ। |
| `ownerField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर स्वामी प्रिंसिपल/UUID फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"createdBy"`)।<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | रिकॉर्ड मालिक की ID रखने वाला फ़ील्ड (जैसे "createdBy") — IDOR से बचाता है।<br/>*सावधानी:* `GET`/`PUT`/`PATCH`/`DELETE` पर रो-लेवल स्वामित्व लागू करता है; `bypassOwnerRoles` न होने पर यूज़र केवल अपने रिकॉर्ड देख/बदल सकता है। |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | ownerField स्वामित्व जांच को बायपास करने वाली विशेष भूमिकाएं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |
| `permissions` | `String[]` | `{}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ORDER_READ", "ORDER_APPROVE"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | भूमिकाओं के साथ जांचे जाने वाले सूक्ष्म अनुमति कोड (DB RBAC द्वारा)।<br/>*सावधानी:* JWT क्लेम्स या DB-RBAC `@SecurityPermissionEntity` के सूक्ष्म अधिकारों से मिलान होता है। |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: जब कॉलर भूमिकाओं के पास अनुमति न हो तो संवेदनशील कॉलम को गतिशील रूप से मास्क या शून्य करता है।
- **रनटाइम व्यवहार**: JSON सीरीअलाइज़ेशन से पहले पोस्ट-फ़ेच लागू होता है।
- **कैसे उपयोग करें**: संवेदनशील फ़ील्ड (`costPrice`, `ssn`) पर लगाएं; प्रॉक्सी प्रतिक्रिया की कॉपी पर सुरक्षित मास्किंग करता है।
- **कब उपयोग करें**: जब एक ही मॉडल में भूमिका के अनुसार कुछ उपयोगकर्ताओं से कीमतें या PII छिपानी हों।
- **कब उपयोग न करें और जोखिम**: गैर-`String` प्रकार स्वतः `null` होते हैं; `String` को `null` करने हेतु `nullifyInsteadOfMask = true` रखें या कुंजी हटाने के लिए `readDto` चुनें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_ADMIN", "ROLE_FINANCE"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | बिना मास्क किए वास्तविक फ़ील्ड मान देखने हेतु अधिकृत भूमिकाएं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |
| `maskPattern` | `String` | `"******"` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"***-**-****"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | viewRoles न होने पर String फ़ील्ड में लौटाया जाने वाला मास्क पैटर्न।<br/>*सावधानी:* `nullifyInsteadOfMask = true` होने पर अनदेखा होता है। गैर-स्ट्रिंग फ़ील्ड (`BigDecimal`, `Integer`) हेतु `nullifyInsteadOfMask = true` बेहतर है। |
| `nullifyInsteadOfMask` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (अनधिकृत होने पर फ़ील्ड को JSON null करें) या `false` (maskPattern स्ट्रिंग से मास्क करें)।<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true होने पर String फ़ील्ड भी maskPattern के बजाय null हो जाते हैं (गैर-String प्रकार स्वतः null होते हैं)।<br/>*सावधानी:* संख्यात्मक, दिनांक और ऑब्जेक्ट फ़ील्ड हेतु आवश्यक ताकि TypeScript/Zod क्लाइंट को वैध `null` मिले। |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: POST /{id}/transition द्वारा अनुमत अवस्था संक्रमण लागू करता है और DELETE /{id} को deletableStates तक सीमित करता है।
- **रनटाइम व्यवहार**: अवैध संक्रमण या विलोपन को HTTP 422 BusinessRuleViolationException के साथ अस्वीकार करता है।
- **कैसे उपयोग करें**: String स्टेट फ़ील्ड पर `transitions = {"CREATED:PAID"}` लिखें; PUT/PATCH/DELETE पर स्वतः सत्यापित होता है।
- **कब उपयोग करें**: ऑर्डर, लोन या टिकट जैसे सख्त जीवनचक्र वर्कफ़्लो में अवैध ट्रांज़िशन रोकने (HTTP `422`) हेतु।
- **कब उपयोग न करें और जोखिम**: `"->"` का उपयोग न करें — पार्सर केवल `":"` पर विभाजित करता है!

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"CREATED"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | एंटिटी निर्माण पर खाली होने पर स्वतः सेट होने वाली प्रारंभिक स्थिति ("ACTIVE")।<br/>*सावधानी:* `POST` निर्माण पर स्थिति खाली होने पर स्वतः भर जाता है; `transitions` में कोलन `:` के बाईं ओर के नाम से मेल खाना चाहिए। |
| `transitions` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)।<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | कोलन प्रारूप "FROM:TO_1,TO_2" में अनुमत स्टेट ट्रांज़िशन नियम।<br/>*सावधानी:* सटीक कोलन सिंटैक्स `"FROM:TO1,TO2"` लागू करता है (अल्पविराम से अलग लक्ष्य)। अघोषित स्थिति में बदलाव HTTP `422` के साथ अस्वीकार होता है। |
| `deletableStates` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)।<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | वे स्टेटस जिनमें DELETE अनुमत है (अन्य पर HTTP 422 त्रुटि मिलती है)।<br/>*सावधानी:* गैर-खाली होने पर, अन्य स्थितियों (जैसे `"PAID"`) में `DELETE` करने पर HTTP `422 Unprocessable Entity` मिलेगा। |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: पठनीय नीति वाक्यों को सक्रिय RBAC, संक्रमण और मास्किंग नियमों में संकलित करता है।
- **रनटाइम व्यवहार**: GET /human-policy पर प्रति इकाई निरीक्षण योग्य और spring-nwvmc.human-policies.<Entity> के अंतर्गत YAML में ओवरराइड करने योग्य।
- **कैसे उपयोग करें**: एंटिटी पर `@HumanPolicy` लगाएं या `application.yml` में YAML नियम (`spring-nwvmc.human-policies`) लिखें; `HumanPolicyRegistryHelper` इसे संकलित करता है।
- **कब उपयोग करें**: जब अनुपालन/प्रोडक्ट टीम को बिना कोड बदले पढ़ने-योग्य YAML/अंग्रेज़ी नियम चाहिए हों।
- **कब उपयोग न करें और जोखिम**: अंग्रेज़ी के अलावा अन्य भाषा या मनमाना निबंध न लिखें (`HumanPolicyRegexCompilerHelper` निश्चित पैटर्न पर चलता है)।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`।<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | प्राकृतिक अंग्रेज़ी जीवनचक्र नियम जिसे स्टेट ट्रांज़िशन में बदला जाता है।<br/>*सावधानी:* स्टार्टअप पर `@StateMachine` इंजन में संकलित होता है; एक ही एंटिटी पर दोनों में विरोधाभासी नियम न लिखें। |
| `security` | `String` | `""` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`।<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | पढ़ने/लिखने/हटाने और स्वामी के लिए प्राकृतिक अंग्रेज़ी RBAC नियम।<br/>*सावधानी:* रोल नामों में `ROLE_` उपसर्ग स्वतः जुड़ता है और स्टार्टअप पर त्रुटि मिलने पर तुरंत फेल-फास्ट होता है। |
| `masking` | `String` | `""` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`।<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | मास्क किए जाने वाले फ़ील्ड और देखने की भूमिकाओं का प्राकृतिक अंग्रेज़ी नियम।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"costPrice"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `stateField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर लाइफसाइकल स्थिति फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"orderStatus"`)।<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | lifecycle नियम संकलित होने पर स्थिति मान रखने वाला एंटिटी फ़ील्ड।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"orderStatus"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: टाइम-ट्रैवल स्थिति पुनर्निर्माण और /diff निरीक्षण के लिए परिवर्तनों पर फ़ील्ड-स्तरीय अंतर रिकॉर्ड करता है।
- **रनटाइम व्यवहार**: create, update, patch, transition और restore पर oldValue और newValue डेल्टा कैप्चर करता है।
- **कैसे उपयोग करें**: किसी भी `BaseAuditEntity` पर `@AuditTrail` लगाएं; सभी लेखन परिवर्तन स्वतः लॉग हो जाते हैं।
- **कब उपयोग करें**: ऑर्डर, भुगतान, मेडिकल रिकॉर्ड या खातों के लिए जहाँ `GET /api/v1/system/time-travel/{entityName}/{id}` ऑडिटिंग आवश्यक हो।
- **कब उपयोग न करें और जोखिम**: अत्यधिक उच्च-आवृत्ति टेलीमेट्री/लॉग तालिकाओं पर `recordFieldDiffs = true` न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"FINANCE_LEDGER"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | ऑडिट इवेंट पर दर्ज होने वाली श्रेणी; खाली होने पर एंटिटी नाम प्रयुक्त।<br/>*सावधानी:* ऑडिट लॉग टैग और फ़िल्टर करने हेतु; `""` छोड़ने पर JPA एंटिटी क्लास नाम डिफ़ॉल्ट होता है। |
| `recordFieldDiffs` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true होने पर Time-Travel (`GET /api/v1/system/time-travel/{entityName}/{id}`) के लिए पुराना बनाम नया फ़ील्ड अंतर सहेजता है।<br/>*सावधानी:* हर `PUT`/`PATCH` पर पहले/बाद का अंतर रिकॉर्ड करता है; बड़े टेक्स्ट या उच्च-आवृत्ति लेखन पर `false` रखें। |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: जब तक कॉलर के पास बायपास भूमिका न हो, सक्रिय किरायेदार संदर्भ द्वारा पंक्ति क्वेरी और परिवर्तनों को स्वचालित रूप से अलग करता है।
- **रनटाइम व्यवहार**: बायपास भूमिका के बिना टेनेंट संदर्भ अनुपस्थित होने पर HTTP 403 देता है; निर्माण के समय tenantId को बलपूर्वक ओवरराइट करता है तथा सभी ID आधारित संचालन में स्वामित्व जांचता है।
- **कैसे उपयोग करें**: `tenantId` वाली `@Entity` पर लगाएं; पढ़ें फ़िल्टर, क्रिएट ओवरराइट और गुम टेनेंट पर `403` स्वतः लागू होता है।
- **कब उपयोग करें**: सभी साझा-डेटाबेस SaaS तालिकाओं (स्टोर, ऑर्डर, चालान) में क्रॉस-टेनेंट डेटा लीक रोकने हेतु।
- **कब उपयोग न करें और जोखिम**: देश या मुद्रा जैसी वैश्विक संदर्भ तालिकाओं पर न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | नहीं (वैकल्पिक) | एंटिटी पर टेनेंट पहचानकर्ता फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"tenantId"`)।<br/>`@MultiTenant(tenantField = "organizationId")` | टेनेंट आईडी रखने वाले फ़ील्ड का नाम (डिफ़ॉल्ट "tenantId")।<br/>*सावधानी:* तेज़ टेनेंट-आइसोलेटेड क्वेरी हेतु इस कॉलम पर `(tenant_id, id)` डेटाबेस इंडेक्स अवश्य बनाएं। |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | नहीं (वैकल्पिक) | Spring Security रोल/अधिकार नामों का ऐरे (जैसे `{"ROLE_SUPER_ADMIN"}`); खाली `{}` इस ऑपरेशन पर अलग प्रतिबंध नहीं लगाता।<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | वे प्लेटफ़ॉर्म भूमिकाएं जो बिना टेनेंट बाइंडिंग के सभी टेनेंट देख सकती हैं।<br/>*सावधानी:* रोल नाम `RoleConstant` में `ROLE_` उपसर्ग (जैसे `ROLE_ADMIN`) के साथ रखें ताकि Spring Security `GrantedAuthority` से मेल खाएँ। |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: create, update और upsert पर सहेजने से पहले अद्वितीयता सत्यापित करता है।
- **रनटाइम व्यवहार**: डुप्लिकेट मान मौजूद होने पर ConflictBusinessException (HTTP 409) फेंकता है।
- **कैसे उपयोग करें**: `email` या `skuCode` जैसे व्यावसायिक कुंजी फ़ील्ड पर `@Column(unique = true)` के साथ लगाएं।
- **कब उपयोग करें**: जब सॉफ्ट-डिलीट हो चुके रिकॉर्ड को अनदेखा कर स्पष्ट `HTTP 409 Conflict` संदेश देना हो।
- **कब उपयोग न करें और जोखिम**: उच्च समवर्ती में केवल `@UniqueField` पर निर्भर न रहें — DB `UNIQUE` इंडेक्स भी रखें।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: खाली छोड़ने पर निर्माण या क्लोन के समय अद्वितीय उपसर्गयुक्त व्यावसायिक कोड स्वचालित उत्पन्न करता है।
- **रनटाइम व्यवहार**: सत्यापन और सहेजने से पहले उपसर्ग + अद्वितीय टोकन भरता है।
- **कैसे उपयोग करें**: String कोड फ़ील्ड पर `@AutoCode(prefix = "PRD-")` लगाएं; क्रिएट/क्लोन करते समय खाली होने पर स्वतः कोड बनता है।
- **कब उपयोग करें**: ऑर्डर नंबर, SKU, स्टोर कोड या टिकट आईडी के लिए बिना DB सीक्वेंस लॉक के पठनीय कोड जनरेट करने हेतु।
- **कब उपयोग न करें और जोखिम**: यदि कानूनी रूप से बिना अंतराल वाले क्रमिक नंबर (`1, 2, 3...`) अनिवार्य हों, तो इसका उपयोग न करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `अनिवार्य (कोई डिफ़ॉल्ट नहीं)` | **हाँ (आवश्यक)** | अनिवार्य गैर-खाली उपसर्ग स्ट्रिंग (जैसे `"PRD-"` / `"INV-"`) — छोड़ने पर कंपाइल विफल होता है।<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | अनिवार्य कोड उपसर्ग जिसे 8-अक्षर के बड़े UUIDv7 हैश से पहले जोड़ा जाता है (जैसे "PRD-")।<br/>*सावधानी:* अनिवार्य एट्रिब्यूट; निर्माण या क्लोन पर फ़ील्ड खाली होने पर 8-अक्षर का UUIDv7 हैश (`INV-0194E1A0`) जोड़ता है और पूर्व-प्रदत्त मान सुरक्षित रखता है। |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: sourceField से स्वचालित रूप से URL-अनुकूल ASCII स्लग संश्लेषित करता है।
- **रनटाइम व्यवहार**: Unicode डायक्रिटिक्स सामान्य कर स्लग क्वेरी द्वारा लुकअप सक्षम करता है।
- **कैसे उपयोग करें**: `slug` फ़ील्ड पर `@AutoSlug(sourceField = "title")` लगाएं; खाली होने पर स्वतः जेनरेट होता है।
- **कब उपयोग करें**: स्टोर, ब्लॉग पोस्ट, श्रेणी और उत्पाद कैटलॉग के SEO-अनुकूल URL बनाने के लिए।
- **कब उपयोग न करें और जोखिम**: गलत `sourceField` नाम न दें; बाद में शीर्षक बदलने से मौजूदा स्लग नहीं बदलता।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `अनिवार्य (कोई डिफ़ॉल्ट नहीं)` | **हाँ (आवश्यक)** | एंटिटी पर स्ट्रिंग फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"title"`)।<br/>`@AutoSlug(sourceField = "productName") private String slug;` | अनिवार्य स्रोत प्रॉपर्टी नाम जिसके मान को लोअरकेस ASCII स्लग में बदला जाता है।<br/>*सावधानी:* अनिवार्य एट्रिब्यूट; यूनिकोड शीर्षक को लोअरकेस URL-सुरक्षित kebab-case में बदलता है। विशिष्टता हेतु `@UniqueField` जोड़ें। |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **उद्देश्य**: इकाई परिवर्तन सहेजने से पहले व्युत्पन्न संख्यात्मक योग की सटीक गणना करता है।
- **रनटाइम व्यवहार**: बूट समय पर ComputedFieldFailFastUtil द्वारा सत्यापित ताकि अमान्य sourceFields तुरंत विफल हों।
- **कैसे उपयोग करें**: व्युत्पन्न संख्यात्मक फ़ील्ड (`BigDecimal totalAmount`) पर लगाएं; सर्वर पर स्वतः पुनर्गणना होती है।
- **कब उपयोग करें**: सर्वर-स्तरीय लाइन टोटल व ऑर्डर योग की गणना हेतु ताकि क्लाइंट राशि के साथ छेड़छाड़ न कर सके।
- **कब उपयोग न करें और जोखिम**: जटिल टियर-प्राइसिंग या बाहरी DB/API वाले प्रमोशन हेतु न लगाएं; `@ServiceOverride` का उपयोग करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | गणना मोड: "MULTIPLY" या "SUM_COLLECTION"।<br/>*सावधानी:* `POST`/`PUT`/`PATCH` सेव से पहले स्वतः पुनर्गणना होती है, जिससे क्लाइंट द्वारा बदली गई कुल राशि ओवरराइड हो जाती है। |
| `sourceFields` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `{"unitPrice", "quantity"}` (numeric properties on same entity)।<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | operation = "MULTIPLY" होने पर आपस में गुणा किए जाने वाले फ़ील्ड।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"unitPrice"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `collectionField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर @OneToMany संग्रह फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"items"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" मोड में @OneToMany चाइल्ड कलेक्शन फ़ील्ड का नाम।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"items"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `itemField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर संख्यात्मक फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"subTotal"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | कलेक्शन के प्रत्येक आइटम से जोड़ा जाने वाला फ़ील्ड (जैसे "subTotal")।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"subTotal"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `subtractField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर संख्यात्मक फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"discountAmount"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | कुल योग से घटाया जाने वाला पैरेंट कटौती फ़ील्ड (जैसे "discountAmount")।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"discountAmount"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `addField` | `String` | `""` | नहीं (वैकल्पिक) | एंटिटी पर संख्यात्मक फ़ील्ड से सटीक मेल खाने वाला Java प्रॉपर्टी नाम (जैसे `"shippingFee"`)।<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | परिणाम में जोड़ा जाने वाला अतिरिक्त शुल्क फ़ील्ड (जैसे "shippingFee")।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"shippingFee"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: कंट्रोलर एंडपॉइंट्स से कस्टम SQL/JPQL या प्रदाता हेल्पर मेथड्स जोड़ने की अनुमति देता है।
- **रनटाइम व्यवहार**: JPA EntityManager के माध्यम से बाध्य नामित पैरामीटर्स के साथ प्रेषित किया जाता है।
- **कैसे उपयोग करें**: `@AutoRestController` मेथड पर `@AutoGet` और `@AutoParam` के साथ `:param` प्लेसहोल्डर बांधकर उपयोग करें।
- **कब उपयोग करें**: नेटिव SQL रिपोर्टिंग, CTE, विंडो फ़ंक्शन या JSONB क्वेरी के लिए बिना रिपॉजिटरी बनाए उपयोग करें।
- **कब उपयोग न करें और जोखिम**: कच्चे यूज़र इनपुट को SQL में कभी न जोड़ें; गलत `sqlProvider` पर स्टार्टअप विफल होता है; और क्रॉस-डोमेन SQL JOIN से बचें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders।<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | नामित `:param` प्लेसहोल्डर समर्थित इनलाइन SQL या JPQL क्वेरी स्ट्रिंग।<br/>*सावधानी:* हमेशा `:param` या `?1` बाइंड पैरामीटर उपयोग करें; डायनेमिक SQL हेतु `sqlProvider` उपयोग करने पर `""` छोड़ें। |
| `nativeQuery` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (डेटाबेस-नेटिव SQL चलाएं) या `false` (पोर्टेबल JPA JPQL चलाएं)।<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true मूल डेटाबेस SQL चलाता है; false JPA JPQL चलाता है।<br/>*सावधानी:* नेटिव SQL (`true`) CTE और विंडो फ़ंक्शन देता है; H2/PostgreSQL/MySQL पोर्टेबिलिटी हेतु `false` (JPQL) चुनें। |
| `resultClass` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कोई भी कंक्रीट Java DTO क्लास लिटरल (जैसे `MonthlyRevenueDto.class`) या DTO मैपिंग बंद करने हेतु `Void.class`।<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | परिणाम मैपिंग हेतु वैकल्पिक लक्षित क्लास।<br/>*सावधानी:* एग्रीगेट/रिपोर्ट क्वेरी हेतु हमेशा DTO प्रोजेक्शन क्लास दें ताकि `SELECT *` और असुरक्षित `Object[]` से बचा जा सके। |
| `sqlProvider` | `Class<?>` | `Void.class` | नहीं (वैकल्पिक) | कंक्रीट Pure Java SQL प्रोवाइडर क्लास (जैसे `OrderAnalyticsSqlProvider.class`), या इनलाइन `value` होने पर `Void.class`।<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | बूट पर सत्यापित डायनेमिक SQL प्रदान करने वाली वैकल्पिक प्योर Java क्लास।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `sqlProvider` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `providerMethod` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"buildRevenueSql"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | sqlProvider क्लास के भीतर SQL स्ट्रिंग लौटाने वाला मेथड नाम।<br/>*सावधानी:* Java मेथड/फ़ील्ड नाम से सटीक केस-सेंसिटिव मेल आवश्यक है (जैसे `"buildRevenueSql"`); अंतर होने पर नियम छूट सकता है या रनटाइम त्रुटि आएगी। |
| `modifying` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (राइट ट्रांज़ैक्शन में UPDATE/DELETE DML चलाएं) या `false` (रीड-ओनली SELECT क्वेरी)।<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE क्वेरी के लिए `true` होना अनिवार्य है।<br/>*सावधानी:* किसी भी `UPDATE`/`DELETE` हेतु `true` अनिवार्य है; यह स्वतः राइट ट्रांज़ैक्शन खोलता है। |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. डेटाबेस-संचालित डायनामिक RBAC और फ़ील्ड मास्किंग मेटा-एनोटेशन (18 एनोटेशन)

### `@SecurityRoleEntity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **उद्देश्य**: JPA इकाई को लाइव डेटाबेस RBAC भूमिका कैटलॉग तालिका के रूप में नामित करता है।
- **रनटाइम व्यवहार**: DynamicDatabaseRbacProviderHelper कॉन्फ़िगरेबल TTL के साथ भूमिका-अनुमति बाइंडिंग कैश करता है और लिखने पर अमान्य करता है।
- **कैसे उपयोग करें**: Role JPA एंटिटी पर `@SecurityRoleEntity` लगाएं और कोड फ़ील्ड को `@RoleCode` से चिह्नित करें।
- **कब उपयोग करें**: जब एडमिन को हार्डकोडेड रोल्स के बजाय डेटाबेस से डायनेमिक रूप से भूमिकाएं प्रबंधित करनी हों।
- **कब उपयोग न करें और जोखिम**: `@RoleCode` कभी न छोड़ें (स्टार्टअप विफल हो जाएगा), और एक से अधिक `@SecurityRoleEntity` न बनाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 1`); जैसे `60L`।<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine स्नैपशॉट कैश TTL सेकंड में (रोल टेबल बदलने पर स्वतः समाप्त)।<br/>*सावधानी:* छोटा TTL डेटाबेस बदलाव तेज़ी से दिखाता है पर क्वेरी बढ़ाता है; लंबा TTL लोड घटाता है पर अनुमति रद्द होने में देरी करता है। |

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

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityRoleEntity के भीतर अद्वितीय भूमिका कोड कॉलम को मैप करता है।
- **रनटाइम व्यवहार**: GrantedAuthority टोकन मिलाने के लिए कैश्ड LambdaAccessorUtil के माध्यम से पढ़ा जाता है।
- **कैसे उपयोग करें**: `@SecurityRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@RoleCode` लगाएं।
- **कब उपयोग करें**: जब `@SecurityRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@RoleCode` दोहराएं नहीं, और बिना `@SecurityRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityRoleEntity पर मानव-पठनीय भूमिका प्रदर्शन नाम फ़ील्ड की पहचान करता है।
- **रनटाइम व्यवहार**: RBAC डायग्नोस्टिक मेटाडेटा और Dev Studio भूमिका निरीक्षण एंडपॉइंट में प्रदर्शित होता है।
- **कैसे उपयोग करें**: `@SecurityRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@RoleName` लगाएं।
- **कब उपयोग करें**: जब `@SecurityRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@RoleName` दोहराएं नहीं, और बिना `@SecurityRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: भूमिका इकाई पर अनुमत अनुमति कोड संग्रह या CSV स्ट्रिंग फ़ील्ड चिह्नित करता है।
- **रनटाइम व्यवहार**: गतिशील रूप से पार्स कर प्रभावी SecurityIdentityCustomizer अधिकारों में विस्तारित किया जाता है।
- **कैसे उपयोग करें**: `@SecurityRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@RolePermissions` लगाएं।
- **कब उपयोग करें**: जब `@SecurityRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@RolePermissions` दोहराएं नहीं, और बिना `@SecurityRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **उद्देश्य**: संसाधन-क्रिया अनुमतियों और गतिशील फ़ील्ड-मास्किंग नियमों को संग्रहीत करने वाली JPA इकाई को चिह्नित करता है।
- **रनटाइम व्यवहार**: संसाधन-स्तरीय CRUD पहुंच और फ़ील्ड मास्किंग लागू करने के लिए DatabaseRbacRuleMatcherHelper में लोड होता है।
- **कैसे उपयोग करें**: Permission JPA एंटिटी पर लगाएं और `@PermissionCode` को अनिवार्य रूप से चिह्नित करें।
- **कब उपयोग करें**: डेटाबेस में सूक्ष्म संसाधन/क्रिया अनुमतियाँ और फ़ील्ड मास्किंग प्रबंधित करने हेतु।
- **कब उपयोग न करें और जोखिम**: `@PermissionCode` कभी न छोड़ें और एकाधिक `@SecurityPermissionEntity` न बनाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 1`); जैसे `60L`।<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | अनुमति स्नैपशॉट के लिए Caffeine कैश TTL सेकंड में।<br/>*सावधानी:* छोटा TTL डेटाबेस बदलाव तेज़ी से दिखाता है पर क्वेरी बढ़ाता है; लंबा TTL लोड घटाता है पर अनुमति रद्द होने में देरी करता है। |

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

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPermissionEntity के भीतर अद्वितीय अनुमति पहचानकर्ता फ़ील्ड निर्दिष्ट करता है।
- **रनटाइम व्यवहार**: कॉलर अधिकारों और @EntitySecurity.permissions() कोड के विरुद्ध मिलान किया जाता है।
- **कैसे उपयोग करें**: `@SecurityPermissionEntity` एंटिटी के फ़ील्ड या गेटर पर `@PermissionCode` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPermissionEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PermissionCode` दोहराएं नहीं, और बिना `@SecurityPermissionEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPermissionEntity के भीतर लक्ष्य इकाई या API संसाधन नाम (या वाइल्डकार्ड *) मैप करता है।
- **रनटाइम व्यवहार**: वाइल्डकार्ड फ़ॉलबैक के साथ DatabaseRbacRuleMatcherHelper द्वारा केस-इन्सेंसिटिव मूल्यांकित।
- **कैसे उपयोग करें**: `@SecurityPermissionEntity` एंटिटी के फ़ील्ड या गेटर पर `@PermissionResource` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPermissionEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PermissionResource` दोहराएं नहीं, और बिना `@SecurityPermissionEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPermissionEntity नियम द्वारा सुरक्षित तार्किक CRUD या कस्टम क्रिया को मैप करता है।
- **रनटाइम व्यवहार**: कंट्रोलर मेथड नामों से स्वचालित रूप से सामान्यीकृत (READ, WRITE, DELETE या कस्टम एक्शन) होता है।
- **कैसे उपयोग करें**: `@SecurityPermissionEntity` एंटिटी के फ़ील्ड या गेटर पर `@PermissionAction` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPermissionEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PermissionAction` दोहराएं नहीं, और बिना `@SecurityPermissionEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: इस डेटाबेस अनुमति नियम के ट्रिगर होने पर गतिशील रूप से छुपाए जाने वाले अल्पविराम-पृथक इकाई फ़ील्ड घोषित करता है।
- **रनटाइम व्यवहार**: HTTP JSON प्रतिक्रिया सीरीअलाइज़ेशन से पहले @FieldSecurity के साथ गतिशील रूप से लागू होता है।
- **कैसे उपयोग करें**: `@SecurityPermissionEntity` एंटिटी के फ़ील्ड या गेटर पर `@PermissionFieldMask` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPermissionEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PermissionFieldMask` दोहराएं नहीं, और बिना `@SecurityPermissionEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **उद्देश्य**: प्रमाणीकृत उपयोगकर्ता विषयों को DB भूमिकाओं और वैकल्पिक किरायेदार दायरे से जोड़ने वाली JPA इकाई को मैप करता है।
- **रनटाइम व्यवहार**: JWT / SecurityContext हाइड्रेशन के दौरान SecurityIdentityCustomizer द्वारा स्वचालित रूप से क्वेरी की जाती है।
- **कैसे उपयोग करें**: User-Role मैपिंग एंटिटी पर लगाएं और `@UserRoleSubject` व `@UserRoleCode` चिह्नित करें।
- **कब उपयोग करें**: जब JWT केवल यूज़रनेम रखता हो और भूमिकाएं डेटाबेस से लाइव लोड करनी हों।
- **कब उपयोग न करें और जोखिम**: `@UserRoleSubject` न भूलें; यदि Auth0/Keycloak JWT ही पूर्ण भूमिकाएं देता है तो इसकी आवश्यकता नहीं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@SecurityUserRoleEntity(enabled = true)` | बिना क्लास हटाए यूज़र-रोल मैपिंग चालू या बंद करने का स्विच।<br/>*सावधानी:* स्कीमा माइग्रेशन के दौरान इसे अस्थायी रूप से `false` रखकर JWT रोल जारी रखे जा सकते हैं। |

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

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityUserRoleEntity पर प्रमुख विषय / उपयोगकर्ता नाम फ़ील्ड की पहचान करता है।
- **रनटाइम व्यवहार**: सक्रिय SecurityContext से Authentication.getName() के विरुद्ध मिलान किया जाता है।
- **कैसे उपयोग करें**: `@SecurityUserRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@UserRoleSubject` लगाएं।
- **कब उपयोग करें**: जब `@SecurityUserRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@UserRoleSubject` दोहराएं नहीं, और बिना `@SecurityUserRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityUserRoleEntity के भीतर असाइन किए गए भूमिका कोड कॉलम को बाइंड करता है।
- **रनटाइम व्यवहार**: नीतियों का मूल्यांकन करते समय लिंक की गई @SecurityRoleEntity अनुमतियों को हल करता है।
- **कैसे उपयोग करें**: `@SecurityUserRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@UserRoleCode` लगाएं।
- **कब उपयोग करें**: जब `@SecurityUserRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@UserRoleCode` दोहराएं नहीं, और बिना `@SecurityUserRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityUserRoleEntity असाइनमेंट को किसी विशिष्ट किरायेदार ID (या वैश्विक के लिए *) तक सीमित करता है।
- **रनटाइम व्यवहार**: प्रत्येक अनुरोध पर TenantContextHolder / X-Tenant-ID के विरुद्ध फ़िल्टर किया जाता है।
- **कैसे उपयोग करें**: `@SecurityUserRoleEntity` एंटिटी के फ़ील्ड या गेटर पर `@UserRoleTenantId` लगाएं।
- **कब उपयोग करें**: जब `@SecurityUserRoleEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@UserRoleTenantId` दोहराएं नहीं, और बिना `@SecurityUserRoleEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **उद्देश्य**: priority द्वारा क्रमबद्ध स्पष्ट ALLOW / DENY रनटाइम प्राधिकरण नीतियों को सहेजने वाली JPA इकाई को चिह्नित करता है।
- **रनटाइम व्यवहार**: स्पष्ट DENY निश्चित रूप से ALLOW पर हावी होता है; SQL निष्पादन से पहले नीतियों की जांच होती है।
- **कैसे उपयोग करें**: Policy एंटिटी पर `@SecurityPolicyEntity` लगाएं और `@PolicyAllowedRoles`, `@PolicyResource`, `@PolicyAction`, `@PolicyEffect` चिह्नित करें।
- **कब उपयोग करें**: जब डेटाबेस नियमों से स्टैटिक `@EntitySecurity` को ओवरराइड करना हो (आपातकालीन `DENY` स्विच सहित)।
- **कब उपयोग न करें और जोखिम**: `@PolicyAllowedRoles` कभी न छोड़ें; स्पष्ट `DENY` नियम अनुमतियों से ऊपर रहते हैं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | नहीं (वैकल्पिक) | पूर्णांक प्राथमिकता में धनात्मक संख्या (`>= 0`); जैसे `10`।<br/>`@SecurityPolicyEntity(priority = 10)` | परस्पर विरोधी नीतियों के मूल्यांकन की प्राथमिकता (कम संख्या = उच्च प्राथमिकता)।<br/>*सावधानी:* एक ही फ़ील्ड पर कई नीतियाँ मिलने पर कम संख्या को प्राथमिकता मिलती है (जैसे `10`, डिफ़ॉल्ट `100` को ओवरराइड करता है)। |

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

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPolicyEntity में लक्ष्य संसाधन पहचानकर्ता पैटर्न को मैप करता है।
- **रनटाइम व्यवहार**: सटीक इकाई/संसाधन नामों के साथ-साथ वाइल्डकार्ड * मिलान का समर्थन करता है।
- **कैसे उपयोग करें**: `@SecurityPolicyEntity` एंटिटी के फ़ील्ड या गेटर पर `@PolicyResource` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPolicyEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PolicyResource` दोहराएं नहीं, और बिना `@SecurityPolicyEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPolicyEntity के भीतर संरक्षित संचालन क्रिया (READ, WRITE, DELETE, methodName, *) को मैप करता है।
- **रनटाइम व्यवहार**: सेवा डेलिगेशन से पहले प्रत्येक HTTP अनुरोध संचालन के लिए मूल्यांकित किया जाता है।
- **कैसे उपयोग करें**: `@SecurityPolicyEntity` एंटिटी के फ़ील्ड या गेटर पर `@PolicyAction` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPolicyEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PolicyAction` दोहराएं नहीं, और बिना `@SecurityPolicyEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPolicyEntity नियम द्वारा लक्षित भूमिकाओं के संग्रह या अल्पविराम-पृथक सूची को मैप करता है।
- **रनटाइम व्यवहार**: सक्रिय JWT अधिकारों और डेटाबेस @SecurityUserRoleEntity भूमिकाओं के विरुद्ध क्रॉस-चेक किया जाता है।
- **कैसे उपयोग करें**: `@SecurityPolicyEntity` एंटिटी के फ़ील्ड या गेटर पर `@PolicyAllowedRoles` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPolicyEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PolicyAllowedRoles` दोहराएं नहीं, और बिना `@SecurityPolicyEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **उद्देश्य**: @SecurityPolicyEntity नियम पर ALLOW या DENY नीति निर्णय परिणाम निर्दिष्ट करता है।
- **रनटाइम व्यवहार**: कोई भी मेल खाती DENY नीति तुरंत HTTP 403 AccessDeniedBusinessException के साथ अनुरोध रोक देती है।
- **कैसे उपयोग करें**: `@SecurityPolicyEntity` एंटिटी के फ़ील्ड या गेटर पर `@PolicyEffect` लगाएं।
- **कब उपयोग करें**: जब `@SecurityPolicyEntity` एंटिटी कस्टम कॉलम नाम रखते हुए DB-RBAC इंजन से जुड़ती है।
- **कब उपयोग न करें और जोखिम**: एक ही क्लास में `@PolicyEffect` दोहराएं नहीं, और बिना `@SecurityPolicyEntity` वाले मॉडल पर न लगाएं।

> **मार्कर एनोटेशन**: शुद्ध मार्कर एनोटेशन — इसमें कोई एट्रिब्यूट घोषित नहीं है।

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. डिस्ट्रिब्यूटेड लॉक, आइडेंपोटेंसी, कैशिंग, मल्टी-DB और क्लाउड इवेंट्स (13 एनोटेशन)

### `@DistributedLock`

- **पैकेज**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **उद्देश्य**: AST मैप (अधिकतम 1024 प्रविष्टियां) में कैश्ड SpEL कुंजियों पर समवर्ती पहुंच को क्रमबद्ध करता है (डिफ़ॉल्ट waitTimeMs=3000L, leaseTimeMs=5000L)।
- **रनटाइम व्यवहार**: समय-समाप्ति पर DistributedLockAspect HTTP 409 DistributedLockAcquisitionException फेंकता है।
- **कैसे उपयोग करें**: Spring `@Service` (नॉन-फ़ाइनल क्लास) मेथड पर लगाएं; क्लस्टर में Redis `DistributedLockProvider` बीन जोड़ें।
- **कब उपयोग करें**: इन्वेंट्री ओवरसेलिंग, समवर्ती वॉलेट डेबिट या बैच रेस कंडीशन रोकने हेतु।
- **कब उपयोग न करें और जोखिम**: बिना Redis `DistributedLockProvider` बदले इसे मल्टी-पॉड क्लस्टर लॉक न मानें, और `final class` पर न लगाएं!

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | नहीं (वैकल्पिक) | मेथड आर्गुमेंट्स संदर्भित करने वाला SpEL एक्सप्रेशन (जैसे `"'inventory:' + #skuId"`) या स्वतः कुंजी हेतु `""`।<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | रनटाइम SpEL लॉक कुंजी अभिव्यक्ति (जैसे "'sku:' + #skuCode")।<br/>*सावधानी:* लॉक कुंजी को हमेशा विशिष्ट ID (`#id`) तक सीमित रखें; स्थिर कुंजी सभी उपयोगकर्ताओं को कतार में रोक देगी। |
| `waitTimeMs` | `long` | `3000L` | नहीं (वैकल्पिक) | मिलीसेकंड में धनात्मक संख्या (`>= 0`); जैसे `3000L`।<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | लॉक प्राप्त करने की अधिकतम प्रतीक्षा अवधि मिलीसेकंड में (डिफ़ॉल्ट 3000L)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: बहुत कम होने पर 409 लॉक त्रुटि बढ़ेगी; बहुत अधिक होने पर HTTP थ्रेड अटक सकते हैं। |
| `leaseTimeMs` | `long` | `5000L` | नहीं (वैकल्पिक) | मिलीसेकंड में धनात्मक संख्या (`>= 100`); जैसे `10000L`।<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | लॉक लीज़ की अधिकतम समय-सीमा मिलीसेकंड में (डिफ़ॉल्ट 5000L)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: सबसे धीमे p99 ट्रांज़ैक्शन से अधिक होना चाहिए वरना लॉक बीच में ही समाप्त हो सकता है। |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: कॉन्फ़िगरेबल TTL विंडो के भीतर समवर्ती या दोहराए गए डुप्लिकेट राइट्स को रोकता है।
- **रनटाइम व्यवहार**: IdempotencyAspect व ProxyIdempotencyGuardHelper Caffeine TTL लॉक लागू करते हैं (ConflictBusinessException HTTP 409); अनुपस्थित कुंजी गुजरती है; IdempotencyManagerHelper वैकल्पिक SHA-256 हेल्पर देता है।
- **कैसे उपयोग करें**: प्रॉक्सी कंट्रोलर या नॉन-फ़ाइनल `@Service` मेथड पर लगाएं; विफलता पर कुंजी मुक्त होकर सुरक्षित रीट्राई की अनुमति मिलती है।
- **कब उपयोग करें**: चेकआउट, पेमेंट कैप्चर, वॉलेट ट्रांसफ़र और नेटवर्क रीट्राई से होने वाले डबल-सबमिशन रोकने हेतु।
- **कब उपयोग न करें और जोखिम**: GET रीड्स पर न लगाएं, और मल्टी-नोड हेतु Redis `IdempotencyStoreProvider` कॉन्फ़िगर करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | नहीं (वैकल्पिक) | मान्य HTTP हेडर नाम (ट्रांसपोर्ट पर केस-इनसेंसिटिव, जैसे `"X-Idempotency-Key"`)।<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | क्लाइंट-जनित आइडेंटपोटेंसी कुंजी ले जाने वाला HTTP हेडर (अनुपस्थित या खाली होने पर बायपास)।<br/>*सावधानी:* क्लाइंट को प्रत्येक प्रयास पर अद्वितीय UUIDv7 भेजना और रीट्राई पर वही हेडर दोहराना चाहिए; इसे CORS `allowedHeaders` में शामिल करें। |
| `ttlSeconds` | `long` | `300L` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 1`); जैसे `300L`।<br/>`@Idempotent(ttlSeconds = 900L)` | डुप्लीकेट रोकने की अवधि सेकंड में (दोबारा भेजने पर HTTP 409 Conflict; डिफ़ॉल्ट 300L)।<br/>*सावधानी:* कैश्ड प्रतिक्रिया रखने की अवधि; क्लाइंट रीट्राई विंडो के अनुसार `300L–86400L` रखें (भुगतान हेतु 24 घंटे)। |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: IP, User या Tenant विभाजन के अनुसार स्लाइडिंग-विंडो अनुरोध थ्रॉटलिंग लागू करता है।
- **रनटाइम व्यवहार**: nwvmc.ratelimit.rejected.total मीट्रिक बढ़ाता है और HTTP 429 Too Many Requests लौटाता है।
- **कैसे उपयोग करें**: `@AutoRestController` टाइप या मेथड पर लगाएं; मान्य कॉल में `X-RateLimit-Remaining` व `X-RateLimit-Reset` तथा सीमा पार होने पर `HTTP 429` + `Retry-After` मिलता है।
- **कब उपयोग करें**: पब्लिक सर्च, ऑथ/OTP, AI क्वेरी और भारी एक्सपोर्ट रूट्स को दुरुपयोग से बचाने हेतु।
- **कब उपयोग न करें और जोखिम**: हेल्थ प्रोब पर कम सीमा न रखें और अलग-अलग उपयोगकर्ताओं/टेनेंट्स को प्रभावित होने से बचाने हेतु `"GLOBAL"` से बचें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | नहीं (वैकल्पिक) | अनुरोध में धनात्मक संख्या (`>= 1`); जैसे `60`।<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | प्रति विंडो अनुमत अधिकतम अनुरोध संख्या (डिफ़ॉल्ट 60)।<br/>*सावधानी:* सीमा पार होने पर HTTP `429` के साथ `X-RateLimit-Remaining`, `X-RateLimit-Reset` और RFC 6585 `Retry-After` हेडर भेजता है। |
| `windowSeconds` | `int` | `60` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 1`); जैसे `60`।<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | दर सीमा समय विंडो सेकंड में (डिफ़ॉल्ट 60)।<br/>*सावधानी:* रेट-लिमिट विंडो की अवधि तय करता है और `X-RateLimit-Reset` व `Retry-After` मान निर्धारित करता है। |
| `partitionKey` | `String` | `"IP"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)।<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | बकेट पार्टीशन रणनीति: "IP"/"clientIp", "USER" (अनाम होने पर IP फ़ॉलबैक), "TENANT", "GLOBAL", या SpEL "#expr"।<br/>*सावधानी:* `"USER"` प्रमाणित उपयोगकर्ता के अनुसार सीमित करता है और गुमनाम कॉल पर IP पर लौटता है; `"GLOBAL"` सभी के लिए एक साझा कोटा है। |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: Actuator और Micrometer को टेलीमेट्री रिपोर्ट करते हुए Resilience4j सर्किट ब्रेकर में संचालन लपेटता है।
- **रनटाइम व्यवहार**: त्रुटि अनुपात सीमा पार होने पर OPEN (HTTP 503) में ट्रिप होता है और nwvmc.resilience.circuitbreaker.state गेज अपडेट करता है।
- **कैसे उपयोग करें**: बाहरी REST, AI प्रदाता या अस्थिर DB से जुड़ने वाले कंट्रोलर/मेथड पर `@EntityCircuitBreaker` लगाएं।
- **कब उपयोग करें**: जब डाउनस्ट्रीम विफलताओं पर तुरंत `HTTP 503` लौटाकर थ्रेड्स को ब्लॉक होने से बचाना हो।
- **कब उपयोग न करें और जोखिम**: `CircuitBreakerErrorFilterUtil` स्वतः 4xx `BaseBusinessException` को अनदेखा करता है; क्लाइंट त्रुटियों को सामान्य `RuntimeException` में न लपेटें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"payment-gateway-cb"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j सर्किट ब्रेकर का नाम; खाली होने पर एंटिटी/कंट्रोलर नाम।<br/>*सावधानी:* Resilience4j रजिस्ट्री नाम और Micrometer मीट्रिक टैग तय करता है; `""` छोड़ने पर क्लास नाम उपयोग होता है। |
| `failureRateThreshold` | `float` | `50.0f` | नहीं (वैकल्पिक) | प्रतिशत में धनात्मक संख्या (`1.0f .. 100.0f`); जैसे `50.0f`।<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | सर्किट को OPEN स्थिति में ले जाने वाला विफलता प्रतिशत (डिफ़ॉल्ट 50.0f)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: 4xx `BaseBusinessException` स्वतः अनदेखे होते हैं; केवल 5xx और इन्फ्रास्ट्रक्चर त्रुटियाँ सर्किट खोलती हैं। |
| `waitDurationInOpenStateSeconds` | `int` | `10` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 1`); जैसे `15`।<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | OPEN से HALF_OPEN में जाने से पहले कूलडाउन सेकंड (HTTP 503; डिफ़ॉल्ट 10)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: 4xx `BaseBusinessException` स्वतः अनदेखे होते हैं; केवल 5xx और इन्फ्रास्ट्रक्चर त्रुटियाँ सर्किट खोलती हैं। |
| `slidingWindowSize` | `int` | `20` | नहीं (वैकल्पिक) | कॉल में धनात्मक संख्या (`>= 1`); जैसे `20`।<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | विफलता दर मापने के लिए स्लाइडिंग विंडो में रिकॉर्ड कॉल की संख्या (20)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: 4xx `BaseBusinessException` स्वतः अनदेखे होते हैं; केवल 5xx और इन्फ्रास्ट्रक्चर त्रुटियाँ सर्किट खोलती हैं। |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | नहीं (वैकल्पिक) | कॉल में धनात्मक संख्या (`>= 1`); जैसे `5`।<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | CLOSED होने के परीक्षण हेतु HALF_OPEN स्थिति में अनुमत कॉल (5)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: 4xx `BaseBusinessException` स्वतः अनदेखे होते हैं; केवल 5xx और इन्फ्रास्ट्रक्चर त्रुटियाँ सर्किट खोलती हैं। |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: कॉन्फ़िगरेबल एक्सपोनेंशियल बैकऑफ़ के साथ अस्थायी विफलताओं को स्वचालित रूप से पुनः प्रयास करता है।
- **रनटाइम व्यवहार**: सभी कॉन्फ़िगर किए गए प्रयास समाप्त होने पर मानकीकृत अपवाद फेंकता है।
- **कैसे उपयोग करें**: क्षणिक नेटवर्क/DB लॉक त्रुटियों से उबरने हेतु कंट्रोलर इंटरफ़ेस या मेथड पर लगाएं।
- **कब उपयोग करें**: आइडेंटपोटेंट GET रीड, PUT रिप्लेसमेंट या `@Idempotent` से सुरक्षित कॉल के लिए।
- **कब उपयोग न करें और जोखिम**: बिना `@Idempotent` वाले नॉन-आइडेंटपोटेंट POST या पेमेंट चार्ज पर कभी न लगाएं!

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"erp-sync-retry"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j रीट्राई रजिस्ट्री नाम।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: `maxAttempts` और बैकऑफ़ समय का कुल योग अपस्ट्रीम गेटवे टाइमआउट से कम रखें। |
| `maxAttempts` | `int` | `3` | नहीं (वैकल्पिक) | प्रयास में धनात्मक संख्या (`>= 1`); जैसे `3`।<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | प्रारंभिक प्रयास सहित कुल निष्पादन प्रयास (डिफ़ॉल्ट 3)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: `maxAttempts` और बैकऑफ़ समय का कुल योग अपस्ट्रीम गेटवे टाइमआउट से कम रखें। |
| `waitDurationMs` | `long` | `500L` | नहीं (वैकल्पिक) | मिलीसेकंड में धनात्मक संख्या (`>= 50`); जैसे `500L`।<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | पहले रीट्राई से पूर्व प्रारंभिक विलंब मिलीसेकंड में (500L)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: `maxAttempts` और बैकऑफ़ समय का कुल योग अपस्ट्रीम गेटवे टाइमआउट से कम रखें। |
| `backoffMultiplier` | `double` | `2.0d` | नहीं (वैकल्पिक) | गुणक में धनात्मक संख्या (`>= 1.0d`); जैसे `2.0d`।<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | क्रमानुगत रीट्राई के बीच एक्सपोनेंशियल बैकऑफ़ गुणक (2.0d)।<br/>*सावधानी:* प्रोडक्शन लेटेंसी SLA के अनुसार सावधानी से ट्यून करें: `maxAttempts` और बैकऑफ़ समय का कुल योग अपस्ट्रीम गेटवे टाइमआउट से कम रखें। |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **पैकेज**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: RFC 7232 कमजोर ETag (W/"...") की गणना करता है और Cache-Control + HTTP 304 Not Modified प्रतिक्रियाएं उत्सर्जित करता है।
- **रनटाइम व्यवहार**: nwvmc.cache.http.requests में HIT/MISS काउंटर रिकॉर्ड करता है।
- **कैसे उपयोग करें**: रीड-ओनली कंट्रोलर या GET मेथड पर लगाएं ताकि `ETag`, `Cache-Control` और `304 Not Modified` मिलें।
- **कब उपयोग करें**: अर्ध-स्थिर कैटलॉग, डिक्शनरी डेटा और सार्वजनिक सूचियों के लिए जहाँ `304` बैंडविड्थ बचाए।
- **कब उपयोग न करें और जोखिम**: निजी PII, मल्टी-टेनेंट वित्त या भूमिका-मास्क्ड डेटा पर `isPrivate = false` (डिफ़ॉल्ट) कभी न छोड़ें!

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | नहीं (वैकल्पिक) | सेकंड में धनात्मक संख्या (`>= 0`); जैसे `120`।<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | HTTP Cache-Control `max-age` निर्देश सेकंड में (डिफ़ॉल्ट 60)।<br/>*सावधानी:* `Cache-Control: max-age=<N>` भेजता है। तुरंत `304` सत्यापन हेतु `0` के साथ `generateETag = true` उपयोग करें। |
| `isPrivate` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (केवल ब्राउज़र निजी कैश; CDN से अवरुद्ध) या `false` (सार्वजनिक कैश; प्रॉक्सी और CDN हेतु अनुमति)।<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true होने पर साझा CDN को रोकने हेतु `private` निर्देश भेजता है।<br/>*सावधानी:* महत्वपूर्ण: प्रमाणित, मल्टी-टेनेंट या `@FieldSecurity` एंडपॉइंट पर हमेशा `isPrivate = true` रखें ताकि CDN दूसरे उपयोगकर्ता को डेटा न दे। |
| `mustRevalidate` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | एक्सपायर्ड कैश को री-वैलिडेट करने के लिए `, must-revalidate` जोड़ता है।<br/>*सावधानी:* `maxAgeSeconds` समाप्त होने के बाद प्रॉक्सी को पुराना डेटा परोसने से रोकता है। |
| `generateETag` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | SHA-256 ETag बनाता है और `If-None-Match` मिलने पर `HTTP 304 Not Modified` लौटाता है।<br/>*सावधानी:* प्रतिक्रिया से RFC 7232 `ETag` बनाकर `If-None-Match` मेल खाने पर 0-बाइट `304 Not Modified` लौटाता है। |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: Caffeine L1 / Redis L2 इंजन के अंदर सर्वर-साइड रीड मेथड आउटपुट कैश करता है।
- **रनटाइम व्यवहार**: app.framework.cache.type के माध्यम से वैश्विक स्तर पर कॉन्फ़िगर करने योग्य।
- **कैसे उपयोग करें**: रीड मेथड पर `@AutoCacheable` लगाएं; कैश इंजन `app.framework.cache.type` से नियंत्रित होता है।
- **कब उपयोग करें**: जहाँ पढ़ने-लिखने का अनुपात उच्च (10:1+) हो, जैसे ID द्वारा लुकअप या मेटाडेटा क्वेरी।
- **कब उपयोग न करें और जोखिम**: उच्च-लेखन वाली तालिकाओं पर या बिना क्लोन किए म्यूटेबल एंटिटी ऑब्जेक्ट पर न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `{"productCatalog"}` (Caffeine/Redis cache region names)।<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | app.framework.cache.type के अनुसार लक्षित कैश नामों की सूची।<br/>*सावधानी:* कैश क्षेत्र नाम Caffeine/Redis कॉन्फ़िग से मेल खाने चाहिए; बासी डेटा से बचने हेतु लिखने पर `@AutoCacheEvict` जोड़ें। |
| `key` | `String` | `""` | नहीं (वैकल्पिक) | मेथड आर्गुमेंट्स संदर्भित करने वाला SpEL एक्सप्रेशन (जैसे `"'product:' + #id"`) या स्वतः कुंजी हेतु `""`।<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL कैश कुंजी अभिव्यक्ति (v0.1.0 सुरक्षित रूप से EntityName:id हल करता है)।<br/>*सावधानी:* मल्टी-टेनेंट ऐप में क्रॉस-टेनेंट लीक रोकने हेतु कैश कुंजी में हमेशा टेनेंट ID शामिल करें। |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: परिवर्तनों पर पुरानी सर्वर-साइड कैश प्रविष्टियों को हटाता है।
- **रनटाइम व्यवहार**: बिना पुराने स्लाइस छोड़े पोस्ट-म्यूटेशन स्वच्छतापूर्वक निष्पादित होता है।
- **कैसे उपयोग करें**: अपडेट/डिलीट मेथड्स पर `@AutoCacheable` कुंजियों से मेल खाते हुए `@AutoCacheEvict` लगाएं।
- **कब उपयोग करें**: जब `@AutoCacheable` से कैश्ड रिकॉर्ड को अपडेट, स्टेट चेंज या डिलीट किया जाए।
- **कब उपयोग न करें और जोखिम**: उच्च-आवृत्ति `create` एंडपॉइंट्स पर `allEntries = true` से बचें (कैश स्टैम्पेड होता है)।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `{"productCatalog"}` (target cache region names to evict)।<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | मेथड पूर्ण होने पर खाली किए जाने वाले कैश नाम।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `value` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `key` | `String` | `""` | नहीं (वैकल्पिक) | मेथड आर्गुमेंट्स संदर्भित करने वाला SpEL एक्सप्रेशन (जैसे `"'product:' + #id"`) या स्वतः कुंजी हेतु `""`।<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | बदली गई सिंगल एंटिटी कैश प्रविष्टि चुनने हेतु SpEL कुंजी।<br/>*सावधानी:* `@AutoCacheable.key` के समान सटीक कुंजी प्रारूप होना चाहिए; `allEntries = true` पर अनदेखा होता है। |
| `allEntries` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (लक्ष्य कैश क्षेत्र की सभी प्रविष्टियाँ साफ़ करें) या `false` (केवल key द्वारा निर्धारित एक प्रविष्टि हटाएं)।<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true होने पर केवल वर्तमान एंटिटी प्रीफ़िक्स के अंतर्गत प्रविष्टियां साफ़ होती हैं।<br/>*सावधानी:* भारी ट्रैफ़िक में पूरा कैश साफ़ करने से डेटाबेस पर अचानक लोड (कैश स्टैम्पीड) आ सकता है; संभव हो तो लक्षित `key` हटाएं। |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **पैकेज**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: निष्पादन अवधि प्रोफ़ाइल करता है और धीमी कॉल सीमा से अधिक होने पर WARN लॉग जारी करता है।
- **रनटाइम व्यवहार**: DynamicEntityMetricsHelper के माध्यम से विलंबता टाइमर भी फीड करता है।
- **कैसे उपयोग करें**: कंट्रोलर या Spring सर्विस पर `@TrackExecutionTime(warningThresholdMs = 300)` लगाएं।
- **कब उपयोग करें**: जटिल रिपोर्ट, बैच और `@CustomQuery` पर धीमी SQL पहचानने के लिए।
- **कब उपयोग न करें और जोखिम**: उच्च-थ्रूपुट में `warningThresholdMs = 0` न रखें और SSE `/events` स्ट्रीम पर न लगाएं।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | नहीं (वैकल्पिक) | मिलीसेकंड में धनात्मक संख्या (`>= 1`); जैसे `300L`।<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | धीमी गति की चेतावनी (`WARN` लॉग) जारी करने की मिलीसेकंड सीमा (डिफ़ॉल्ट 500L)।<br/>*सावधानी:* सीमा से अधिक समय लगने पर `traceId` सहित `WARN` लॉग लिखता है; लॉग बाढ़ रोकने हेतु व्यावहारिक मान (`200L–1000L`) रखें। |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **पैकेज**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **उद्देश्य**: कमिट के बाद Virtual Threads पर अतुल्यकालिक HMAC-SHA256 हस्ताक्षरित आउटबाउंड वेबहुक भेजता है।
- **रनटाइम व्यवहार**: WebhookHmacSignerHelper में हस्ताक्षर की गणना करता है और स्थिर-समय समानता सत्यापित करता है।
- **कैसे उपयोग करें**: JPA `@Entity` पर लगाएं; DB कमिट के बाद Outbox/Virtual Threads के माध्यम से असिंक्रोनस रूप से भेजा जाता है।
- **कब उपयोग करें**: जब ऑर्डर/भुगतान कमिट होने पर बाहरी भागीदारों या SaaS टेनेंट्स को सूचित करना हो।
- **कब उपयोग न करें और जोखिम**: यदि एंटिटी में संवेदनशील PII/PCI डेटा हो तो `includeFullPayload = false` रखें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | नहीं (वैकल्पिक) | शून्य या अधिक मान्य मानों का ऐरे: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`।<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC-साइन वेबहूक डिलीवरी ट्रिगर करने वाले जीवनचक्र इवेंट।<br/>*सावधानी:* डेटाबेस ट्रांज़ैक्शन कमिट (`AFTER_COMMIT`) के बाद असिंक्रोनस भेजा जाता है ताकि रोलबैक हुए डेटा पर वेबहुक न जाए। |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | नहीं (वैकल्पिक) | मान्य HTTP हेडर नाम (ट्रांसपोर्ट पर केस-इनसेंसिटिव, जैसे `"X-Webhook-Signature"`)।<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 सत्यापन डाइजेस्ट ले जाने वाला HTTP हेडर।<br/>*सावधानी:* HMAC-SHA256 पेलोड हस्ताक्षर ले जाता है; प्राप्तकर्ता को प्रोसेस करने से पहले इसे सत्यापित करना चाहिए। |
| `includeFullPayload` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@EntityWebhook(includeFullPayload = false)` | true पूरा JSON पेलोड भेजता है; false केवल ID और इवेंट मेटाडेटा भेजता है।<br/>*सावधानी:* संवेदनशील PII/वित्तीय डेटा हेतु `false` रखें (केवल ID और इवेंट प्रकार) ताकि सब्सक्राइबर प्रमाणित GET से डेटा लें। |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **पैकेज**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: लेनदेन कमिट के बाद CNCF CloudEvents v1.0 एनवेलप प्रकाशित करता है।
- **रनटाइम व्यवहार**: फैंटम ईवेंट से बचने के लिए TransactionRuntimeBridge.executeAfterCommit का सम्मान करता है।
- **कैसे उपयोग करें**: एंटिटी या कंट्रोलर मेथड पर लगाएं; `@TransactionalEventListener(AFTER_COMMIT)` से `CloudEventEnvelopeDto` सुनें।
- **कब उपयोग करें**: क्रॉस-मॉड्यूल JPA कपलिंग के बिना अलग-अलग बॉन्डेड कॉन्टेक्स्ट के बीच संवाद हेतु।
- **कब उपयोग न करें और जोखिम**: आंतरिक `@PublishCloudEvent` को बाहरी `@EntityWebhook` से भ्रमित न करें, और `AFTER_COMMIT` का उपयोग करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | नहीं (वैकल्पिक) | गैर-खाली पहचान स्ट्रिंग (जैसे `"com.acme.order.lifecycle"`); डिफ़ॉल्ट नियम हेतु `""` छोड़ें।<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` हेडर (जैसे "io.nwvmc.order.created")।<br/>*सावधानी:* CloudEvents 1.0 रिवर्स-DNS नामकरण (`com.company.domain.event`) का पालन करें; `""` से स्वतः बनता है। |
| `source` | `String` | `""` | नहीं (वैकल्पिक) | `/` से शुरू होने वाला मान्य HTTP पथ (जैसे `/services/order-api`) या स्वतः व्युत्पत्ति हेतु खाली स्ट्रिंग `""`।<br/>`@PublishCloudEvent(source = "/services/order-api")` | इवेंट उत्सर्जित करने वाले स्रोत बाउंडेड कॉन्टेक्स्ट का URI।<br/>*सावधानी:* माइक्रोसर्विस ट्रेसिंग हेतु CNCF CloudEvents `source` URI भरता है। |
| `publishOnCreate` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | POST क्रिएट कमिट के बाद CloudEvent जारी करने हेतु (डिफ़ॉल्ट true)।<br/>*सावधानी:* केवल ट्रांज़ैक्शन कमिट (`AFTER_COMMIT`) के बाद ही प्रकाशित होता है। |
| `publishOnUpdate` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@PublishCloudEvent(publishOnUpdate = true)` | PUT/PATCH अपडेट कमिट के बाद CloudEvent जारी करने हेतु (true)।<br/>*सावधानी:* उच्च-आवृत्ति अपडेट (जैसे व्यू काउंटर) हेतु `false` रखें ताकि मैसेज ब्रोकर पर अनावश्यक भार न पड़े। |
| `publishOnDelete` | `boolean` | `true` | नहीं (वैकल्पिक) | `true` (सक्षम) या `false` (अक्षम)।<br/>`@PublishCloudEvent(publishOnDelete = true)` | DELETE कमिट के बाद CloudEvent जारी करने हेतु (true)।<br/>*सावधानी:* हार्ड डिलीट और `BaseAuditEntity.deleted` दोनों पर चलता है ताकि डाउनस्ट्रीम रीड-मॉडल सिंक रहें। |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **पैकेज**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: इकाई या क्वेरी संचालन को तार्किक नामित डेटास्रोत कुंजी से जोड़ता है।
- **रनटाइम व्यवहार**: framework.datasource.routing.total में रूटिंग गणना रिकॉर्ड करता है।
- **कैसे उपयोग करें**: कंट्रोलर या नॉन-फ़ाइनल `@Service` मेथड पर `@TargetDataSource("REPLICA")` लगाएं।
- **कब उपयोग करें**: CQRS रीड-रेप्लिका ऑफ़लोडिंग और भारी BI रिपोर्ट को `REPLICA` पर भेजने हेतु।
- **कब उपयोग न करें और जोखिम**: पहले से खुले `@Transactional` कनेक्शन के बीच डेटासोर्स न बदलें, और `final class` पर न लगाएं!

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`।<br/>`@TargetDataSource("REPLICA")` | DataSourceContextHolder में सेट होने वाली तार्किक डेटासोर्स रूटिंग कुंजी ("PRIMARY", "REPLICA")।<br/>*सावधानी:* `DynamicRoutingDataSource` में पंजीकृत सक्रिय कुंजी से मेल खाना चाहिए; अज्ञात कुंजी `PRIMARY` पर लौटती है। |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **पैकेज**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **उद्देश्य**: प्रति इकाई डेटाबेस इंजन परिवार और तार्किक क्लस्टर शार्ड असाइन करता है।
- **रनटाइम व्यवहार**: MultiPlatformDataSourceRegistryHelper और TenantDatabaseRoutingResolverHelper द्वारा गतिशील रूप से हल किया जाता है।
- **कैसे उपयोग करें**: JPA `@Entity` या मेथड पर `@TargetDatabasePlatform` लगाएं।
- **कब उपयोग करें**: जहाँ लेजर (`FINANCE_CLUSTER`), एनालिटिक्स (`ANALYTICS_CLUSTER`) और ऑडिट कार्यभार अलग-अलग DB क्लस्टर में हों।
- **कब उपयोग न करें और जोखिम**: केवल एनोटेशन से JDBC URL नहीं बनता — वास्तविक मल्टी-DB में पूल कॉन्फ़िगर करें और क्रॉस-क्लस्टर JOIN न करें।

| एट्रिब्यूट | Java प्रकार | डिफ़ॉल्ट मान | आवश्यक | स्वीकृत मान व उदाहरण | विवरण और रनटाइम सावधानियाँ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | डेटाबेस इंजन पहचानकर्ता ("H2", "POSTGRESQL", "MYSQL", "ORACLE", "REDIS")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `platform` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `cluster` | `String` | `"PRIMARY"` | नहीं (वैकल्पिक) | निम्न समर्थित मानों में से एक: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | क्लस्टर/शार्ड नाम ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER")।<br/>*सावधानी:* ऐप स्टार्टअप पर तुरंत सत्यापित होता है; गलत स्पेलिंग या अमान्य `cluster` ट्रैफ़िक से पहले फेल-फास्ट होता है। |
| `readOnly` | `boolean` | `false` | नहीं (वैकल्पिक) | `true` (रीड-ओनली रेप्लिका पूल पर रूट करें) या `false` (रीड-राइट मास्टर पूल पर रूट करें)।<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true होने पर रीड-ओनली रेप्लिका रूटिंग का संकेत देता है।<br/>*सावधानी:* `POST`/`PUT`/`PATCH`/`DELETE` पर कभी `readOnly = true` न रखें — रीड रेप्लिका लेखन अस्वीकार करते हैं। |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
