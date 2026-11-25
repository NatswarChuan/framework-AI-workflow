# 06. ข้อกำหนดทางเทคนิคฉบับสมบูรณ์ของ 60 Declarative Annotations (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#annotations)

เอกสารอ้างอิงทางเทคนิคฉบับสมบูรณ์สำหรับ **60 Declarative Annotations** ทั้งหมดใน `io.github.natswarchuan:spring-nwvmc:0.1.0` ซึ่งดึงตรงจากซอร์สโค้ด Java `@interface`: แพ็กเกจที่แน่นอน, `@Target`, **ทุกแอตทริบิวต์**, ชนิดข้อมูล Java, ค่าเริ่มต้น, สถานะบังคับ/ไม่บังคับ, **วิธีใช้งาน**, **เมื่อใดควรใช้**, **เมื่อใดไม่ควรใช้และข้อควรระวัง**, พร้อมตัวอย่างโค้ด Java ที่ทดสอบแล้ว

## ดัชนีสรุปอย่างเร็ว (60 แอนโนเทชัน)

| แอนโนเทชัน | หมวดหมู่ | `@Target` | สรุปแอตทริบิวต์ | วัตถุประสงค์หลัก |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | แปลงอินเทอร์เฟซที่สืบทอด AutoApiController<E> เป็น JDK Dynamic Proxy ที่มี 40 สัญญา (แสดงเริ่มต้น 38 รายการใน Swagger UI) |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | เปลี่ยนเส้นทางเมธอดของคอนโทรลเลอร์ไปยังเมธอดของ Spring Bean แบบกำหนดเองผ่าน MethodHandleCacheUtil แทน CRUD อัตโนมัติ |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | ผูกเส้นทางเวิร์กโฟลว์เฉพาะโดเมนเข้ากับ Spring @Component Helper Bean ที่เป็นอิสระ |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | แอนโนเทชัน Pure Java แทนที่ @GetMapping โดยไม่ต้องนำเข้า Spring Web |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | ประกาศเส้นทาง HTTP POST แบบ Pure Java พร้อมรองรับ consumes/produces แบบกำหนดเอง |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | การจับคู่เส้นทาง HTTP PUT แบบ Pure Java สำหรับการแทนที่ทรัพยากรทั้งชุด |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | ประกาศ HTTP PATCH แบบ Pure Java รองรับการอัปเดตบางส่วน ค่าเพิ่มลดแบบอะตอมมิก และ RFC 6902 JSON Patch |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | ประกาศ HTTP DELETE แบบ Pure Java สำหรับการลบแบบ Soft Delete ที่ตรวจสถานะก่อนลบ |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | ผูกพารามิเตอร์คิวรีจาก URL หรือ Map<String, String> สำหรับการกรองแบบไดนามิก |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | ผูกตัวแปรบนเส้นทาง URI เช่น รหัส UUIDv7 ของข้อมูล |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | แปลงข้อมูล JSON ใน HTTP Request Body เป็นพารามิเตอร์ DTO หรือ Entity ร่วมกับ @Valid |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | อนุญาตให้เข้าถึงความสัมพันธ์ลูกแบบซ้อนชั้นผ่าน GET /{id}/{relation}/** พร้อมป้องกันการวนซ้ำ |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | ประกาศการเปลี่ยนสถานะโดเมนหรือการปรับปรุงค่าตัวเลขเชิงประกาศบนเมธอดการดำเนินการ |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | แอนโนเทชันระบุ Component ของเฟรมเวิร์กที่ลงทะเบียนตอนบูตโดยไม่ต้องนำเข้า @Component |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | สเตอริโอไทป์ชั้น Service สำหรับคลาส ServiceImpl ที่ใช้งานร่วมกับ @ServiceOverride |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | ประกาศเมธอดสร้าง Bean ภายในคลาส @AutoConfigurationBean |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | ระบุคลาสการตั้งค่าและโมเดลผูกค่าคุณสมบัติ YAML |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | ควบคุมลำดับความสำคัญในการทำงานระหว่าง SPI Customizer และสายตัวกรอง |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | บังคับใช้สิทธิ์ RBAC, การแยกข้อมูลตาม ownerField และรหัสสิทธิ์ permissions ก่อนคิวรีหรือแก้ไข |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | ปกปิดหรือตั้งค่าเป็น null บนฟิลด์ลับอัตโนมัติเมื่อผู้เรียกไม่มีสิทธิ์ |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | บังคับการเปลี่ยนสถานะผ่าน POST /{id}/transition และจำกัด DELETE /{id} เฉพาะสถานะใน deletableStates |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | คอมไพล์ประโยคนโยบายที่อ่านเข้าใจง่ายเป็นกฎ RBAC การเปลี่ยนสถานะ และการปกปิดข้อมูล |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | บันทึกความแตกต่างรายฟิลด์ทุกการเปลี่ยนแปลงเพื่อรองรับ Time-Travel และ /diff |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | แยกการคิวรีและการแก้ไขข้อมูลระดับแถวตาม Tenant อัตโนมัติ ยกเว้นผู้ที่มีสิทธิ์ข้าม Tenant |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | ตรวจสอบความไม่ซ้ำของค่าข้อมูลก่อนบันทึกลงฐานข้อมูลทั้งตอนสร้าง แก้ไข และ Upsert |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | สร้างรหัสธุรกิจที่มีคำนำหน้าแบบไม่ซ้ำอัตโนมัติเมื่อเว้นว่างตอนสร้างหรือโคลน |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | สร้าง ASCII Slug ที่เป็นมิตรกับ URL จากฟิลด์ sourceField โดยอัตโนมัติ |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | คำนวณยอดรวมตัวเลขจากการคำนวณล่วงหน้าก่อนบันทึกการเปลี่ยนแปลงข้อมูล |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | ช่วยให้ผูกคำสั่ง SQL/JPQL แบบกำหนดเองหรือเมธอด Provider เข้ากับ Endpoint ของคอนโทรลเลอร์ |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | กำหนดให้ JPA Entity เป็นตารางรายการบทบาท RBAC แบบไดนามิกในฐานข้อมูล |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่คอลัมน์รหัสบทบาทที่ไม่ซ้ำกันภายใน @SecurityRoleEntity |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุฟิลด์ชื่อแสดงผลของบทบาทบน @SecurityRoleEntity |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุฟิลด์แบบคอลเลกชันหรือข้อความ CSV ที่เก็บรหัสสิทธิ์ของบทบาท |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | ระบุ JPA Entity ที่จัดเก็บสิทธิ์ Resource-Action และกฎการปกปิดฟิลด์แบบไดนามิก |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุฟิลด์รหัสสิทธิ์ที่ไม่ซ้ำกันภายใน @SecurityPermissionEntity |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่ชื่อเอนทิตีหรือทรัพยากร API เป้าหมาย (หรือ *) ภายใน @SecurityPermissionEntity |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่คำสั่ง CRUD หรือการดำเนินการที่อยู่ภายใต้กฎของ @SecurityPermissionEntity |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุรายชื่อฟิลด์ที่คั่นด้วยจุลภาคซึ่งต้องถูกปกปิดแบบไดนามิกเมื่อกฎสิทธิ์ DB นี้ทำงาน |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | กำหนด JPA Entity ที่ผูกผู้ใช้ที่ยืนยันตัวตนแล้วเข้ากับบทบาท DB และขอบเขต Tenant |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุฟิลด์ชื่อผู้ใช้หรือ Subject หลักบน @SecurityUserRoleEntity |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ผูกคอลัมน์รหัสบทบาทที่กำหนดให้ผู้ใช้ภายใน @SecurityUserRoleEntity |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จำกัดขอบเขตการกำหนดบทบาท @SecurityUserRoleEntity เฉพาะรหัส Tenant ที่ระบุ (หรือ * สำหรับทั้งหมด) |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | ระบุ JPA Entity ที่จัดเก็บนโยบาย ALLOW / DENY แบบชัดแจ้งเรียงตามค่า priority |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่รูปแบบชื่อทรัพยากรเป้าหมายภายใน @SecurityPolicyEntity |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่ประเภทการกระทำที่ควบคุม (READ, WRITE, DELETE, methodName, *) ใน @SecurityPolicyEntity |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | จับคู่คอลเลกชันหรือรายชื่อบทบาทที่คั่นด้วยจุลภาคซึ่งอยู่ภายใต้กฎ @SecurityPolicyEntity |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | ระบุผลลัพธ์การตัดสินใจ ALLOW หรือ DENY บนกฎ @SecurityPolicyEntity |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | จัดลำดับการเข้าถึงพร้อมกันด้วยคีย์ SpEL ในแคช AST (ค่าเริ่มต้น waitTimeMs=3000L, leaseTimeMs=5000L) |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | ป้องกันการเขียนซ้ำจากคำขอพร้อมกันหรือการส่งซ้ำภายในช่วงเวลา TTL |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | จำกัดอัตราคำขอแบบ Sliding-Window แยกตาม IP ผู้ใช้ หรือ Tenant |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | ห่อหุ้มการทำงานด้วย Resilience4j Circuit Breaker พร้อมส่ง Telemetry ไปยัง Actuator & Micrometer |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | ลองใหม่โดยอัตโนมัติเมื่อเกิดความล้มเหลวชั่วคราวแบบ Exponential Backoff |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | คำนวณ weak ETag มาตรฐาน RFC 7232 (W/"...") และส่ง Cache-Control พร้อมสถานะ HTTP 304 Not Modified |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | แคชผลลัพธ์ของเมธอดอ่านฝั่งเซิร์ฟเวอร์ใน Caffeine L1 / Redis L2 |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | ล้างข้อมูลแคชฝั่งเซิร์ฟเวอร์ที่ล้าสมัยเมื่อมีการแก้ไขข้อมูล |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | วัดระยะเวลาการทำงานและบันทึก WARN เมื่อการเรียกใช้ช้าเกินเกณฑ์ |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | ส่ง Webhook ขาออกที่ลงลายเซ็น HMAC-SHA256 แบบอะซิงโครนัสบน Virtual Threads หลัง Commit |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | เผยแพร่ซองข้อมูลมาตรฐาน CNCF CloudEvents v1.0 หลังการ Commit ทรานแซกชัน |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | ผูกการทำงานของเอนทิตีหรือคิวรีเข้ากับชื่อคีย์แหล่งข้อมูลที่กำหนด |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | กำหนดตระกูลฐานข้อมูลและคลัสเตอร์ชาร์ดเชิงตรรกะให้กับแต่ละเอนทิตี |

---

## 1. การกำหนดเส้นทาง, สัญญา API แบบไดนามิก, การแยก DTO และการผูกพารามิเตอร์ (13 แอนโนเทชัน)

### `@AutoRestController`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **วัตถุประสงค์**: แปลงอินเทอร์เฟซที่สืบทอด AutoApiController<E> เป็น JDK Dynamic Proxy ที่มี 40 สัญญา (แสดงเริ่มต้น 38 รายการใน Swagger UI)
- **พฤติกรรมขณะรันไทม์**: DynamicControllerProxyRegistrarHelper สแกนคอนโทรลเลอร์ตอนบูตและลงทะเบียนเส้นทางเข้า RequestMappingHandlerMapping
- **วิธีใช้งาน**: วาง `@AutoRestController(basePath = "/api/v1/...")` บน Java interface ที่สืบทอด `AutoApiController<E>` หรือ `AutoReadApi<E>` แล้วกำหนด DTO และ endpoint ที่ปิด
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการเปิดบริการ CRUD, การกรอง, การแบ่งหน้า, Keyset หรือ API อ่านอย่างเดียวจาก JPA Entity โดยไม่ต้องเขียนโค้ดซ้ำซ้อน
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับคลาส `@RestController` ทั่วไปหรือเวิร์กโฟลว์ที่ไม่มี JPA Entity และสำหรับ API อ่านอย่างเดียวควรใช้ `AutoReadApi<E>` แทน

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | ไม่ (ทางเลือก) | พาธ HTTP ที่ถูกต้องขึ้นต้นด้วย `/` (เช่น `/api/v1/product-catalogs`) หรือสตริงว่าง `""` เพื่อให้สร้างอัตโนมัติ<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | พาธ URI หลักที่ระบุชัดเจน (เช่น "/api/v1/product-catalogs") หากเว้นว่างจะสร้างอัตโนมัติในรูปพหูพจน์ kebab-case<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `basePath` ก่อน `path` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `path` | `String` | `""` | ไม่ (ทางเลือก) | พาธ HTTP ที่ถูกต้องขึ้นต้นด้วย `/` (เช่น `/api/v1/orders`) หรือสตริงว่าง `""` เพื่อให้สร้างอัตโนมัติ<br/>`@AutoRestController(path = "/api/v1/orders")` | แอตทริบิวต์ชื่อแทนของพาธ แนะนำให้ใช้ basePath เนื่องจากตัวลงทะเบียนอ่านค่าดังกล่าวก่อน<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `basePath` ก่อน `path` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `entityName` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"ProductCatalog"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoRestController(entityName = "ProductCatalog")` | กำหนดชื่อ Entity ที่แสดงในข้อมูลเมตา OpenAPI/Studio แทนชื่อคลาสเดิม<br/>*ข้อควรระวัง:* แสดงผลโดยตรงบน Swagger / OpenAPI 3.0 และ NWVMC Studio ควรแยกข้อความไว้ใน `OpenApiConstant` เพื่อหลีกเลี่ยงฮาร์ดโค้ด |
| `enabledEndpoints` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | รายการชื่อเมธอดที่อนุญาตให้เปิดใช้งาน (เช่น "getPage", "create") หากว่างจะเปิดทั้งหมด<br/>*ข้อควรระวัง:* ทำงานแบบไวท์ลิสต์เข้มงวด หากระบุค่า เมธอดที่ไม่ได้อยู่ในรายการจะไม่ถูกลงทะเบียนใน Spring MVC และ Swagger UI |
| `disabledEndpoints` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | รายการชื่อเมธอดที่ต้องการปิดก่อนการลงทะเบียนเส้นทาง MVC (เช่น "deleteById", "batchChunked")<br/>*ข้อควรระวัง:* ประเมินหลัง `enabledEndpoints` เหมาะสำหรับปิดเอนด์พอยต์ลบข้อมูลหรือแบตช์โดยยังคงสัญญา CRUD อื่นๆ ไว้ |
| `enableNestedSubResources` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | เปิดใช้การเรียกทรัพยากรย่อยแบบซ้อนชั้น GET /{id}/** ค่าเริ่มต้นเป็น false เพื่อลดเส้นทางส่วนเกิน<br/>*ข้อควรระวัง:* คงค่า `false` ไว้หากไม่จำเป็นต้องใช้ `GET /{id}/items/...` และหากเปิดควรจำกัดความสัมพันธ์ด้วย `@EnableNestedSubResource` |
| `readDto` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `ProductReadDto.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO สำหรับการอ่านเพื่อซ่อนฟิลด์ภายในของ Entity ตอนแปลง JSON; ค่าเริ่มต้น Void.class จะคืน Entity เดิม<br/>*ข้อควรระวัง:* ใช้เฉพาะในขั้นตอน อ่าน (GET) คลาส DTO ต้องมีคอนสตรักเตอร์ว่าง/เกตเตอร์ และรองรับ `@Valid` กับ `@FieldSecurity` |
| `createDto` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `ProductCreateDto.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO ขาเข้าที่ผ่าน Jakarta Validation ก่อนแปลงเป็น Entity E เมื่อเรียก POST<br/>*ข้อควรระวัง:* ใช้เฉพาะในขั้นตอน สร้าง (POST) คลาส DTO ต้องมีคอนสตรักเตอร์ว่าง/เกตเตอร์ และรองรับ `@Valid` กับ `@FieldSecurity` |
| `updateDto` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `ProductUpdateDto.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO สำหรับ PUT/PATCH เพื่อจำกัดฟิลด์ที่อนุญาตให้แก้ไขและตรวจสอบความถูกต้อง<br/>*ข้อควรระวัง:* ใช้เฉพาะในขั้นตอน อัปเดต (PUT/PATCH) คลาส DTO ต้องมีคอนสตรักเตอร์ว่าง/เกตเตอร์ และรองรับ `@Valid` กับ `@FieldSecurity` |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: เปลี่ยนเส้นทางเมธอดของคอนโทรลเลอร์ไปยังเมธอดของ Spring Bean แบบกำหนดเองผ่าน MethodHandleCacheUtil แทน CRUD อัตโนมัติ
- **พฤติกรรมขณะรันไทม์**: EscapeHatchDispatchHelper ค้นหา Bean เป้าหมายและแคช MethodHandle ไว้ใน MethodHandleCacheUtil
- **วิธีใช้งาน**: ใส่ `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` บนเมธอดในอินเทอร์เฟซและประกาศ `@Component`/`@Service` บนคลาสเป้าหมาย
- **เมื่อใดควรใช้**: ใช้เมื่อ endpoint ส่วนใหญ่ใช้ CRUD อัตโนมัติได้ แต่มีบางเมธอดที่ต้องเขียนตรรกะ Java เฉพาะทางเพิ่มเติม
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ข้อความ string ใน `targetBean` (ต้องเป็น `Class<?>`; ใช้ `beanName` สำหรับชื่อ bean) และไม่ควรใช้หากกฎเชิงประกาศจัดการได้อยู่แล้ว

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `OrderCustomService.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | คลาส Spring Bean ปลายทาง (มีความสำคัญสูงกว่า beanName)<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `targetBean` ก่อน `beanName` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `beanName` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อ Bean ที่ลงทะเบียนไว้ใน ApplicationContext (เช่น `"orderCustomService"`) หรือ `""` เพื่อให้ค้นหาอัตโนมัติ<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | ชื่อ bean ที่ระบุใน Spring container ใช้เมื่อ targetBean เป็น Void.class<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `targetBean` ก่อน `beanName` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `methodName` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"createOrder"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | ชื่อเมธอดบน bean ปลายทาง หากเว้นว่างจะใช้ชื่อเดียวกับเมธอดในคอนโทรลเลอร์<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"createOrder"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `bypassAutoDispatch` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (ข้ามพร็อกซีเริ่มต้นและเรียก Bean ปลายทางโดยตรง) หรือ `false` (ทำงานร่วมกับตัวกระจายคำขอเริ่มต้น)<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | เมื่อเป็น true จะข้ามการทำงาน CRUD อัตโนมัติและเรียกเมธอดของ bean ผ่าน MethodHandle<br/>*ข้อควรระวัง:* เมื่อเป็น `true` (ค่าเริ่มต้น) ระบบจะข้าม CRUD อัตโนมัติทั้งหมดให้ Bean จัดการธุรกรรมเอง ใช้ `false` เฉพาะงานเสริมเท่านั้น |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ผูกเส้นทางเวิร์กโฟลว์เฉพาะโดเมนเข้ากับ Spring @Component Helper Bean ที่เป็นอิสระ
- **พฤติกรรมขณะรันไทม์**: เรียกใช้ delegateBean.delegateMethod ผ่าน MethodHandle ที่แคชไว้พร้อมการตรวจสอบและทรานแซกชันครบถ้วน
- **วิธีใช้งาน**: ประกาศเมธอดบนอินเทอร์เฟซพร้อม `path`, `httpMethod`, `delegateBean` และ `delegateMethod` ไปยัง Spring Helper
- **เมื่อใดควรใช้**: ใช้สำหรับสร้าง endpoint การทำงานเฉพาะทาง เช่น การชำระเงิน, คืนเงิน, อนุมัติ หรือธุรกรรมข้ามหลาย Entity
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: อย่าวางใจ interceptor ของ proxy ที่นี่ เพราะ `@CustomEndpoint` ส่งต่อตรงก่อน `invokeProtectedOperation` ให้วาง Spring AOP บน `@Component`/`@Service` ปลายทาง และใช้ `@BusinessAction` สำหรับเปลี่ยนสถานะง่ายๆ

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/reports/monthly-sales`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | พาธย่อยสัมพัทธ์ภายใต้ basePath ของคอนโทรลเลอร์ (เช่น "/checkout")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `path` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `httpMethod` | `String` | `"GET"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP เมธอดที่ใช้งาน ("GET", "POST", "PUT", "PATCH", "DELETE")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `httpMethod` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `delegateBean` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อ Bean ที่ลงทะเบียนไว้ใน ApplicationContext (เช่น `"orderReportService"`) หรือ `""` เพื่อให้ค้นหาอัตโนมัติ<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | ชื่อ Spring bean ที่มีเมธอดจัดการเวิร์กโฟลว์ (ต้องระบุ เว้นแต่มี default method หรือ @ServiceOverride)<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `delegateBean` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `delegateMethod` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"buildMonthlyReport"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | ชื่อเมธอดบน delegateBean หากว่างจะใช้ชื่อเมธอดของคอนโทรลเลอร์<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"buildMonthlyReport"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `summary` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"Get monthly revenue breakdown"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | คำอธิบายสั้นๆ ของ OpenAPI 3.0 ที่แสดงใน Swagger UI<br/>*ข้อควรระวัง:* แสดงผลโดยตรงบน Swagger / OpenAPI 3.0 และ NWVMC Studio ควรแยกข้อความไว้ใน `OpenApiConstant` เพื่อหลีกเลี่ยงฮาร์ดโค้ด |
| `description` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"Aggregates confirmed invoice totals grouped by currency"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | คำอธิบายละเอียดของ OpenAPI 3.0 เมื่อคลิกขยายใน Swagger UI<br/>*ข้อควรระวัง:* แสดงผลโดยตรงบน Swagger / OpenAPI 3.0 และ NWVMC Studio ควรแยกข้อความไว้ใน `OpenApiConstant` เพื่อหลีกเลี่ยงฮาร์ดโค้ด |

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

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: แอนโนเทชัน Pure Java แทนที่ @GetMapping โดยไม่ต้องนำเข้า Spring Web
- **พฤติกรรมขณะรันไทม์**: จับคู่เป็น HTTP GET RequestMappingInfo ขณะเริ่มทำงานของพร็อกซี
- **วิธีใช้งาน**: ใส่ `@AutoGet("/path")` บนเมธอดในอินเทอร์เฟซ `@AutoRestController` (มักใช้คู่กับ `@ServiceOverride` หรือ `@CustomQuery`)
- **เมื่อใดควรใช้**: ใช้สำหรับเปิดเส้นทาง HTTP GET อ่านอย่างเดียวในอินเทอร์เฟซ Pure Java โดยไม่ต้องอิมพอร์ต `@GetMapping`
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับการแก้ไขข้อมูลในฐานข้อมูล และห้ามใช้ในคลาส `@RestController` ทั่วไป

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/{id}/summary`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@AutoGet("/{id}/summary")` | พาธเทมเพลต GET สัมพัทธ์ (เช่น "/metrics") หากว่างจะชี้ตรงไปที่ basePath หลัก<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `produces` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json", "text/csv"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | ชนิดสื่อ MIME ที่ส่งกลับ (เช่น "text/event-stream", "text/csv")<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Accept` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ประกาศเส้นทาง HTTP POST แบบ Pure Java พร้อมรองรับ consumes/produces แบบกำหนดเอง
- **พฤติกรรมขณะรันไทม์**: ลงทะเบียนเป็นตัวจัดการ HTTP POST ใน SpringMvcEndpointBridge
- **วิธีใช้งาน**: ใส่ `@AutoPost("/path")` บนเมธอดสร้างหรือแอคชัน ผูก body ด้วย `@AutoBody`/`@RequestBody` ร่วมกับ `@BusinessAction` หรือ `@ServiceOverride`
- **เมื่อใดควรใช้**: ใช้สำหรับ endpoint สร้างข้อมูล คำสั่งทางธุรกิจ หรือการส่งข้อมูลแบบกลุ่มผ่าน POST
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้สำหรับอ่านข้อมูล (`@AutoGet`), แทนที่ทั้งหมด (`@AutoPut`), อัปเดตบางส่วน (`@AutoPatch`) หรือลบ (`@AutoDelete`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/{id}/approve`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@AutoPost("/{id}/approve")` | พาธเทมเพลต POST สัมพัทธ์ภายใต้ basePath<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `consumes` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json", "multipart/form-data"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | ชนิด Content-Type ของคำขอที่รองรับ<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Content-Type` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |
| `produces` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | ชนิดสื่อ MIME ที่ส่งคืนในคำตอบ<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Accept` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: การจับคู่เส้นทาง HTTP PUT แบบ Pure Java สำหรับการแทนที่ทรัพยากรทั้งชุด
- **พฤติกรรมขณะรันไทม์**: ผูกเป็นตัวจัดการ HTTP PUT ภายใต้การทำงานแบบทรานแซกชัน
- **วิธีใช้งาน**: ใส่ `@AutoPut("/{id}")` บนเมธอดแทนที่ทั้งระเบียนร่วมกับ `@AutoVariable` และ `@AutoBody`
- **เมื่อใดควรใช้**: ใช้สำหรับการแทนที่ทรัพยากรทั้งก้อนแบบ Idempotent ที่ส่งสถานะครบถ้วน
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับการแก้ไขแค่บางฟิลด์หรือเปลี่ยนสถานะ (ควรใช้ `@AutoPatch` หรือ `@BusinessAction`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/{id}/replace`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@AutoPut("/{id}/replace")` | พาธเทมเพลต PUT สัมพัทธ์ (เช่น "/{id}")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `consumes` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | ชนิด Content-Type ของคำขอที่รองรับ<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Content-Type` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |
| `produces` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | ชนิดสื่อ MIME ที่ส่งกลับในคำตอบ<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Accept` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ประกาศ HTTP PATCH แบบ Pure Java รองรับการอัปเดตบางส่วน ค่าเพิ่มลดแบบอะตอมมิก และ RFC 6902 JSON Patch
- **พฤติกรรมขณะรันไทม์**: รองรับรูปแบบ JSON Merge และ application/json-patch+json
- **วิธีใช้งาน**: ใส่ `@AutoPatch("/{id}/action")` บนเมธอดอัปเดตบางส่วนหรือ `@BusinessAction`
- **เมื่อใดควรใช้**: ใช้สำหรับแก้ไขบางฟิลด์ ปรับค่าตัวเลขแบบ atomic และเปลี่ยนสถานะ (`@BusinessAction`)
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้เมื่อต้องแทนที่ข้อมูลทั้งหมด (`@AutoPut`) หรือสร้างระเบียนใหม่ (`@AutoPost`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/{id}/status`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@AutoPatch("/{id}/status")` | พาธเทมเพลต PATCH สัมพัทธ์ (เช่น "/{id}/approve")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `consumes` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json", "application/merge-patch+json"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | ชนิด Content-Type ที่รองรับ<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Content-Type` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |
| `produces` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของ MIME type (เช่น `{"application/json"}`) หากว่าง `{}` จะใช้ค่าเริ่มต้น `application/json`<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | ชนิดสื่อ MIME ที่ส่งคืน<br/>*ข้อควรระวัง:* Spring MVC ตรวจสอบผ่าน HTTP `Accept` หากไคลเอนต์ส่งค่าไม่ตรงจะคืนรหัส `406` หรือ `415` |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ประกาศ HTTP DELETE แบบ Pure Java สำหรับการลบแบบ Soft Delete ที่ตรวจสถานะก่อนลบ
- **พฤติกรรมขณะรันไทม์**: ตรวจสอบ @StateMachine deletableStates ก่อนตั้งค่า deleted=true
- **วิธีใช้งาน**: ใส่ `@AutoDelete("/{id}/custom")` บนเมธอดลบแบบกำหนดเองโดยมักใช้คู่กับ `@ServiceOverride`
- **เมื่อใดควรใช้**: ใช้สำหรับสร้าง endpoint ลบแบบจัดเก็บถาวร ลบแบบนุ่มนวล หรือล้างข้อมูลต่อเนื่องผ่าน DELETE
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ไม่ต้องนิยามซ้ำหาก `DELETE /{id}` แบบ soft-delete มาตรฐานพร้อม `@StateMachine` เพียงพอแล้ว

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | เส้นทางย่อยสัมพัทธ์ที่รองรับ `{pathVar}` (เช่น `/{id}/archive`) หากว่าง `""` จะผูกกับพาธหลัก<br/>`@AutoDelete("/{id}/archive")` | พาธเทมเพลต DELETE สัมพัทธ์ (เช่น "/{id}/purge")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **วัตถุประสงค์**: ผูกพารามิเตอร์คิวรีจาก URL หรือ Map<String, String> สำหรับการกรองแบบไดนามิก
- **พฤติกรรมขณะรันไทม์**: สกัดค่าผ่าน DynamicQueryParameterParserHelper พร้อมตรวจสอบความปลอดภัยด้วย QueryGuardrailEnforcerUtil
- **วิธีใช้งาน**: วาง `@AutoParam("status")` บนพารามิเตอร์ของเมธอดในอินเทอร์เฟซคอนโทรลเลอร์
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการให้อินเทอร์เฟซเป็น Pure Java 100% โดยไม่ import Spring Web แต่ยังรับ query params ได้
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับตัวแปรพาธ (`@AutoVariable`) หรือ JSON body (`@AutoBody`) ทั้งนี้ `v0.1.0` รองรับ `@RequestParam` ด้วย

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"status"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoParam("status") String status` | ชื่อ query parameter ที่ผูก (ชื่อแทนของ name) หากว่างใช้ชื่อพารามิเตอร์ Java<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `value` ก่อน `name` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `name` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"pageSize"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | ชื่อ query parameter ที่ระบุโดยตรง<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `value` ก่อน `name` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `required` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (บังคับ หากไม่มีจะคืนค่า HTTP 400) หรือ `false` (ไม่บังคับ หากไม่ส่งจะได้รับ null)<br/>`@AutoParam(name = "keyword", required = false) String keyword` | ระบุว่าหากขาดพารามิเตอร์นี้จะตอบกลับ HTTP 400 หรือไม่<br/>*ข้อควรระวัง:* จะกลายเป็นไม่บังคับโดยอัตโนมัติเมื่อระบุ `defaultValue` หากตั้งเป็น `false` ควรใช้คลาส wrapper (`Integer`) แทนชนิดพื้นฐานเพื่อกัน NPE |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"20"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | ค่าเริ่มต้นสำรองหากไม่ส่งมา (ค่าเริ่มต้นคือ sentinel DEFAULT_NONE)<br/>*ข้อควรระวัง:* แปลงจากสตริงเป็นชนิดข้อมูลปลายทางผ่าน Spring `ConversionService` หากรูปแบบไม่ถูกต้องจะคืน HTTP `400` |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **วัตถุประสงค์**: ผูกตัวแปรบนเส้นทาง URI เช่น รหัส UUIDv7 ของข้อมูล
- **พฤติกรรมขณะรันไทม์**: แปลงจากเทมเพลตเส้นทาง MVC เป็นค่า Java UUID/String ที่มีชนิดข้อมูลชัดเจน
- **วิธีใช้งาน**: วางบนพารามิเตอร์รับค่าจาก URI เช่น `findById(@AutoVariable("id") UUID id)`
- **เมื่อใดควรใช้**: ใช้เมื่อดึงค่า `{id}` หรือ `{code}` จาก URI ในอินเทอร์เฟซ Pure Java
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับ query string (`@AutoParam`) หรือ JSON body (`@AutoBody`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"orderId"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoVariable("orderId") UUID orderId` | ชื่อตัวแปรพาธ URI ที่ต้องการผูก<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `value` ก่อน `name` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `name` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"tenantCode"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | ชื่อตัวแปรพาธที่ระบุชัดเจน<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `value` ก่อน `name` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `required` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (บังคับ หากไม่มีจะคืนค่า HTTP 400) หรือ `false` (ไม่บังคับ หากไม่ส่งจะได้รับ null)<br/>`@AutoVariable(name = "id", required = true) UUID id` | ระบุว่าตัวแปรพาธนี้จำเป็นต้องมีค่าหรือไม่<br/>*ข้อควรระวัง:* ชื่อตัวแปรต้องตรงกับ `{variableName}` ในรูปแบบ URI ของเมธอด การตั้ง `false` ใช้ได้เฉพาะเมื่อมีหลายรูปแบบพาธ |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **วัตถุประสงค์**: แปลงข้อมูล JSON ใน HTTP Request Body เป็นพารามิเตอร์ DTO หรือ Entity ร่วมกับ @Valid
- **พฤติกรรมขณะรันไทม์**: ตรวจสอบความถูกต้องผ่าน LocalValidatorFactoryBean ก่อนเข้าสู่ทรานแซกชันของ Service
- **วิธีใช้งาน**: ใส่ `@AutoBody` บนพารามิเตอร์รับ payload ของ `@AutoPost`/`@AutoPut`/`@AutoPatch` (ร่วมกับ `@Valid`)
- **เมื่อใดควรใช้**: ใช้สำหรับแปลง JSON body เป็น Entity หรือ DTO ในคอนโทรลเลอร์ Pure Java
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่บนเมธอด GET/DELETE ที่ไม่มี body และห้ามใส่เกินหนึ่งตัวต่อเมธอด

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (บังคับ หากไม่มีจะคืนค่า HTTP 400) หรือ `false` (ไม่บังคับ หากไม่ส่งจะได้รับ null)<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | ระบุว่าหากไม่มี HTTP body จะให้ตอบกลับ HTTP 400 หรือไม่<br/>*ข้อควรระวัง:* ควรใช้คู่กับ `@Valid` เพื่อตรวจสอบข้อมูลก่อนเข้าพร็อกซี การตั้ง `false` จะยอมรับ HTTP body ว่างได้โดยไม่เกิด `400` |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: อนุญาตให้เข้าถึงความสัมพันธ์ลูกแบบซ้อนชั้นผ่าน GET /{id}/{relation}/** พร้อมป้องกันการวนซ้ำ
- **พฤติกรรมขณะรันไทม์**: ต้องเปิดใช้งาน @AutoRestController(enableNestedSubResources = true) บนคอนโทรลเลอร์
- **วิธีใช้งาน**: เปิดใช้ `enableNestedSubResources = true` แล้วจำกัดความสัมพันธ์ที่เข้าถึงได้ด้วย `@EnableNestedSubResource`
- **เมื่อใดควรใช้**: เมื่อต้องการ URL ซ้อนชั้นอย่าง `GET /api/v1/customer-orders/{id}/items` ที่ยังบังคับใช้สิทธิ์และความปลอดภัยทุกขั้น
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามเปิดโดยไม่จำกัด `allowedRelationships` บนตารางที่มีความสัมพันธ์ซับซ้อน (หากต้องการดึงข้อมูลร่วมแบบง่ายให้ใช้ `?expand=`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | รายการคลาส JPA Entity ที่อนุญาตให้เข้าถึงระหว่าง GET /{id}/**<br/>*ข้อควรระวัง:* อาร์เรย์ว่างจะเปิดเผยเอนทิตีลูกทั้งหมด ควรระบุคลาสที่อนุญาตชัดเจนเพื่อป้องกันการเปิดเผยตารางภายในโดยไม่ตั้งใจ |
| `allowedRelationships` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `"items"`, `"payments"`, `"shipments"` (JPA field names)<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | รายการชื่อฟิลด์ความสัมพันธ์ JPA ที่อนุญาตให้เปิดใช้งานผ่านพาธย่อย (เช่น "items", "customer")<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"items"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ประกาศการเปลี่ยนสถานะโดเมนหรือการปรับปรุงค่าตัวเลขเชิงประกาศบนเมธอดการดำเนินการ
- **พฤติกรรมขณะรันไทม์**: ทำงานแบบอะตอมมิกก่อนบันทึกคุณสมบัติของเอนทิตีที่อัปเดต
- **วิธีใช้งาน**: ใช้ `@AutoPatch` ร่วมกับ `@BusinessAction(...)` บนเมธอดในอินเทอร์เฟซคอนโทรลเลอร์
- **เมื่อใดควรใช้**: ใช้สำหรับเปลี่ยนสถานะ ปรับค่าตัวเลข หรือเรียกเมธอดใน Entity โดยไม่ต้องเขียนคลาส Service
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับงานที่ประสานหลาย Entity หรือเรียก API ภายนอก (ควรใช้ `@ServiceOverride` แทน)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ สถานะวงจรชีวิต (เช่น `"status"`)<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | ชื่อฟิลด์เก็บสถานะบน Entity (ตรวจสอบกับ @StateMachine หากมี)<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"status"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `targetStateValue` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"APPROVED"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | ค่าสถานะเป้าหมายที่จะกำหนดให้ targetStateField ภายใน transaction<br/>*ข้อควรระวัง:* ตรวจสอบกับ `@StateMachine` หรือ `@HumanPolicy` อัตโนมัติก่อนบันทึก หากเปลี่ยนสถานะผิดกฎจะ rollback ธุรกรรมทันที |
| `adjustNumericField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ ตัวเลข (เช่น `"stockQuantity"`)<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | ชื่อฟิลด์ตัวเลขที่ต้องการเพิ่มหรือลดค่าแบบ atomic<br/>*ข้อควรระวัง:* ต้องใช้คู่กับ `deltaParamIndex >= 0` หรือ `fixedDelta` รองรับการปรับค่า `Integer`, `Long`, `BigDecimal` และ `Double` ในธุรกรรม |
| `deltaParamIndex` | `int` | `-1` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `-1` (disabled) or `0`-based method argument index (e.g., `1`)<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | ดัชนีพารามิเตอร์ (เริ่มจาก 0) ที่รับค่า delta แบบไดนามิก (-1 คือปิดใช้งาน)<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `deltaParamIndex` ก่อน `fixedDelta` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `fixedDelta` | `String` | `""` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | ค่าคงที่ตัวเลขในรูปข้อความ (เช่น "100", "-1") เมื่อไม่ได้ส่ง deltaParamIndex<br/>*ข้อควรระวัง:* ตอนเริ่มต้นระบบจะอ่าน `deltaParamIndex` ก่อน `fixedDelta` หลีกเลี่ยงการกำหนดค่าขัดแย้งกันพร้อมกัน |
| `entityMethod` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"markFulfilled"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@BusinessAction(entityMethod = "markFulfilled")` | ชื่อเมธอดบน Entity (แบบไม่มีพารามิเตอร์) ที่เรียกใช้งานภายใน transaction เดียวกัน<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"markFulfilled"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. การค้นหา Bean, การผูกค่าคอนฟิก และลำดับการทำงาน (5 แอนโนเทชัน)

### `@AutoComponent`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: แอนโนเทชันระบุ Component ของเฟรมเวิร์กที่ลงทะเบียนตอนบูตโดยไม่ต้องนำเข้า @Component
- **พฤติกรรมขณะรันไทม์**: สแกนเฉพาะแพ็กเกจภายในเฟรมเวิร์ก (io.github.natswarchuan) สำหรับแอปผู้ใช้ให้ใช้ Spring @Component
- **วิธีใช้งาน**: สเตอริโอไทป์ภายในเฟรมเวิร์กที่ถูกสแกนโดย `AutoBeanFactoryRegistrarBridge` ใต้แพ็กเกจ `io.github.natswarchuan`
- **เมื่อใดควรใช้**: ใช้เฉพาะเมื่อพัฒนาโค้ดภายในเฟรมเวิร์กใต้ `io.github.natswarchuan.*` เท่านั้น
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้ในแอปของผู้ใช้งาน (`com.example.*`) โดยเด็ดขาด ให้ใช้ `@Component` ของ Spring แทน มิฉะนั้น Bean จะไม่ถูกสร้าง

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อ Bean ที่ลงทะเบียนไว้ใน ApplicationContext (เช่น `"invoiceValidationHelper"`) หรือ `""` เพื่อให้ค้นหาอัตโนมัติ<br/>`@AutoComponent("invoiceValidationHelper")` | ชื่อ bean ที่ระบุชัดเจน (ไม่บังคับ) หากว่างใช้ชื่อคลาสแบบ camelCase<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: สเตอริโอไทป์ชั้น Service สำหรับคลาส ServiceImpl ที่ใช้งานร่วมกับ @ServiceOverride
- **พฤติกรรมขณะรันไทม์**: ลงทะเบียนเฉพาะภายใน io.github.natswarchuan สำหรับ Service ในแอปผู้ใช้ให้ใช้ Spring @Service
- **วิธีใช้งาน**: สเตอริโอไทป์บริการภายในเฟรมเวิร์กในแพ็กเกจ `io.github.natswarchuan`
- **เมื่อใดควรใช้**: ใช้สำหรับ Service ภายในเฟรมเวิร์ก `io.github.natswarchuan.*` เท่านั้น
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้ใน Service ของแอปพลิเคชัน ให้ใช้ `@Service` ของ Spring แทน

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อ Bean ที่ลงทะเบียนไว้ใน ApplicationContext (เช่น `"orderFulfillmentService"`) หรือ `""` เพื่อให้ค้นหาอัตโนมัติ<br/>`@AutoService("orderFulfillmentService")` | ชื่อ Service bean (ไม่บังคับ)<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ประกาศเมธอดสร้าง Bean ภายในคลาส @AutoConfigurationBean
- **พฤติกรรมขณะรันไทม์**: ประมวลผลโดย PureJavaBeanRegistrarBridge ระหว่างการกำหนดค่าอัตโนมัติ
- **วิธีใช้งาน**: วางบน factory method ภายในคลาส `@AutoConfigurationBean` ของเฟรมเวิร์ก
- **เมื่อใดควรใช้**: ใช้ภายใน `io.github.natswarchuan.config.*` ของเฟรมเวิร์กเท่านั้น
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้ใน `@Configuration` ของโปรเจกต์ผู้ใช้ ให้ใช้ `@Bean` ของ Spring ตามปกติ

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `{"primaryObjectMapper", "nwvmcMapper"}`<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | ชื่อและนามแฝงของ Bean<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `targetTypeName` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"com.example.spi.PaymentGateway"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | ชื่อคลาสเต็ม (FQCN) ของชนิดเป้าหมาย<br/>*ข้อควรระวัง:* ชื่อคลาสเต็ม (FQCN) เมื่อเมธอด factory คืนค่า supertype หรือ proxy โดยคลาสนั้นต้องอยู่ใน classpath ขณะรัน |
| `primary` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (เลือก Bean นี้ก่อนเมื่อมีหลายตัวที่ตรงกัน) หรือ `false` (ลำดับความสำคัญปกติ)<br/>`@AutoBean(primary = true)` | กำหนดให้เป็น Bean หลัก (@Primary) เมื่อมีตัวเลือกซ้ำกัน<br/>*ข้อควรระวัง:* การประกาศ `@AutoBean(primary = true)` สองตัวสำหรับชนิดเดียวกันจะทำให้เกิดข้อขัดแย้งของ Bean ตอนเริ่มระบบ |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: ระบุคลาสการตั้งค่าและโมเดลผูกค่าคุณสมบัติ YAML
- **พฤติกรรมขณะรันไทม์**: ลงทะเบียน Bean การตั้งค่าและคำนำหน้า YAML อย่างสะอาดพร้อมเมทาดาต้าสำหรับ IDE
- **วิธีใช้งาน**: ระบุคลาสตั้งค่าและ properties ภายใน `io.github.natswarchuan.config.*`
- **เมื่อใดควรใช้**: ใช้ภายในไลบรารีของเฟรมเวิร์กแทน `@Configuration` เท่านั้น
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้ในคลาสตั้งค่าของแอปผู้ใช้ ให้ใช้ `@Configuration` ของ Spring แทน

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อ Bean ที่ลงทะเบียนไว้ใน ApplicationContext (เช่น `"storageAutoConfig"`) หรือ `""` เพื่อให้ค้นหาอัตโนมัติ<br/>`@AutoConfigurationBean("storageAutoConfig")` | ชื่อของ bean ตั้งค่า (ไม่บังคับ)<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `prefix` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"nwvmc.storage"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | คำนำหน้าค่าคอนฟิก YAML (เช่น "app.framework.cache")<br/>*ข้อควรระวัง:* ผูกค่าพร็อพเพอร์ตี้ kebab-case จาก `application.yml` ควรใช้คู่กับ `spring-configuration-metadata.json` เพื่อไม่ให้ IDE แจ้งเตือน |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **วัตถุประสงค์**: ควบคุมลำดับความสำคัญในการทำงานระหว่าง SPI Customizer และสายตัวกรอง
- **พฤติกรรมขณะรันไทม์**: ค่าจำนวนเต็มที่น้อยกว่าจะถูกเรียกทำงานก่อน (ค่าเริ่มต้น Integer.MAX_VALUE)
- **วิธีใช้งาน**: วาง `@OrderPriority(1)` บนคอมโพเนนต์หรือ customizer เพื่อจัดลำดับการทำงาน
- **เมื่อใดควรใช้**: เมื่อต้องการจัดลำดับการทำงานที่แน่นอนระหว่าง SPI Customizer หลายตัว
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: อย่าสับสนกับลำดับฟิลเตอร์ Spring Security หรือ `?sort=` ใน URL

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)<br/>`@OrderPriority(10)` | ลำดับความสำคัญ (ค่าน้อยทำงานก่อน ค่าเริ่มต้น Integer.MAX_VALUE ต่ำสุด)<br/>*ข้อควรระวัง:* ตัวเลขน้อยกว่าจะทำงานก่อน (เหมือน Spring `@Order`) ควรสงวนค่า `< 0` ให้ความปลอดภัย/tracing และ `10..100` สำหรับงานธุรกิจ |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. ความปลอดภัยของ Entity, State Machine, ความถูกต้องของข้อมูล, ตัวสร้างอัตโนมัติ และคิวรี (11 แอนโนเทชัน)

### `@EntitySecurity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: บังคับใช้สิทธิ์ RBAC, การแยกข้อมูลตาม ownerField และรหัสสิทธิ์ permissions ก่อนคิวรีหรือแก้ไข
- **พฤติกรรมขณะรันไทม์**: ประเมินก่อนรัน SQL หากไม่มีสิทธิ์จะคืนค่า HTTP 403 Forbidden ทันที
- **วิธีใช้งาน**: วางบนคลาส JPA `@Entity` เพื่อกำหนดสิทธิ์ role และระบุ `ownerField` สำหรับแยกเจ้าของข้อมูล
- **เมื่อใดควรใช้**: ควรใช้กับทุก Entity ที่เปิดให้บริการ API เพื่อคุ้มครองทั้ง REST, Batch, Export และ GraphQL
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามเปิด `permitAll = true` บน `AutoApiController<E>` เต็มรูปแบบโดยไม่จำกัดผ่าน `AutoReadApi<E>`, `disabledEndpoints` หรือ `@SecurityPolicyEntity` (เพราะข้ามตรวจทั้ง READ, WRITE และ DELETE)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_USER", "ROLE_ADMIN"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | บทบาทที่อนุญาตให้อ่านข้อมูล (GET, GraphQL, Export)<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |
| `writeRoles` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_MANAGER", "ROLE_ADMIN"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | บทบาทที่อนุญาตให้เขียน แก้ไข หรือนำเข้า (POST/PUT/PATCH)<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |
| `deleteRoles` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | บทบาทที่อนุญาตให้ลบข้อมูล (DELETE / ลบแบบกลุ่ม)<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |
| `permitAll` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (อนุญาตให้เข้าถึงแบบสาธารณะโดยไม่ต้องยืนยันตัวตน) หรือ `false` (บังคับตรวจสอบตัวตนและบทบาท)<br/>`@EntitySecurity(permitAll = true)` | หากเป็น true (โดยไม่มี DB-RBAC ทับ) จะข้ามการตรวจสอบทั้ง READ, WRITE และ DELETE ให้ใช้คู่กับ AutoReadApi<E> หรือ disabledEndpoints เสมอ<br/>*ข้อควรระวัง:* ข้ามการตรวจสอบบทบาททั้งหมดและอนุญาตการเข้าถึงแบบไม่ระบุตัวตน ห้ามเปิดกับข้อมูล PII หรือข้อมูลการเงิน |
| `ownerField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ เจ้าของ/UUID (เช่น `"createdBy"`)<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | ชื่อฟิลด์เก็บเจ้าของระเบียน (เช่น "createdBy") เพื่อป้องกัน IDOR<br/>*ข้อควรระวัง:* บังคับกรองสิทธิ์ระดับแถวตามเจ้าของบน `GET`/`PUT`/`PATCH`/`DELETE` ยกเว้นผู้ใช้ที่มีบทบาทใน `bypassOwnerRoles` |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | บทบาทผู้ดูแลที่สามารถข้ามการตรวจสอบ `ownerField`<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |
| `permissions` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ORDER_READ", "ORDER_APPROVE"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | รหัสสิทธิ์แบบละเอียดที่ตรวจสอบร่วมกับบทบาท (DB RBAC)<br/>*ข้อควรระวัง:* ตรวจสอบกับสิทธิ์ระดับละเอียดจาก JWT หรือ DB-RBAC `@SecurityPermissionEntity` เพื่อเสริมการป้องกันหลายชั้น |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: ปกปิดหรือตั้งค่าเป็น null บนฟิลด์ลับอัตโนมัติเมื่อผู้เรียกไม่มีสิทธิ์
- **พฤติกรรมขณะรันไทม์**: ทำงานหลังจากดึงข้อมูลและก่อนแปลงผลลัพธ์เป็น JSON
- **วิธีใช้งาน**: วางบนฟิลด์ข้อมูลลับ (`costPrice`, `ssn`) ระบบจะปิดบังบนสำเนาที่ไม่กระทบฐานข้อมูลหรือ L1 cache
- **เมื่อใดควรใช้**: ใช้เมื่อโมเดลเดียวให้บริการหลายบทบาทและต้องการปิดบังบางฟิลด์ตามสิทธิ์ทั้งใน REST และ GraphQL
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ฟิลด์ที่ไม่ใช่ `String` จะถูกตั้งเป็น `null` อัตโนมัติอยู่แล้ว ให้ตั้ง `nullifyInsteadOfMask = true` เมื่อต้องการให้ฟิลด์ `String` เป็น `null` แทน `"******"` หรือใช้ `readDto` เพื่อซ่อนชื่อคีย์

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_ADMIN", "ROLE_FINANCE"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | บทบาทที่อนุญาตให้ดูค่าจริงโดยไม่ถูกปิดบัง<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |
| `maskPattern` | `String` | `"******"` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"***-**-****"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | รูปแบบข้อความปิดบังสำหรับฟิลด์ String เมื่อไม่มีสิทธิ์<br/>*ข้อควรระวัง:* จะถูกข้ามเมื่อ `nullifyInsteadOfMask = true` สำหรับฟิลด์ที่ไม่ใช่ String (`BigDecimal`, `LocalDate`) ควรใช้ `nullifyInsteadOfMask = true` เพื่อคงชนิด JSON ให้ถูกต้อง |
| `nullifyInsteadOfMask` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (แทนค่าฟิลด์ที่ไม่มีสิทธิ์ด้วย JSON null) หรือ `false` (ปิดบังด้วยสตริง maskPattern)<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | เมื่อเป็น true จะบังคับให้ฟิลด์ String เป็น null แทน maskPattern (ชนิดที่ไม่ใช่ String จะถูกตั้งเป็น null อัตโนมัติอยู่แล้ว)<br/>*ข้อควรระวัง:* จำเป็นมากสำหรับฟิลด์ตัวเลข วันที่ และออบเจ็กต์ เพื่อให้ไคลเอนต์ TypeScript/Zod รับค่า `null` ที่ถูกต้อง |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: บังคับการเปลี่ยนสถานะผ่าน POST /{id}/transition และจำกัด DELETE /{id} เฉพาะสถานะใน deletableStates
- **พฤติกรรมขณะรันไทม์**: ปฏิเสธการเปลี่ยนสถานะหรือการลบที่ไม่ถูกต้องด้วย HTTP 422 BusinessRuleViolationException
- **วิธีใช้งาน**: ใส่บนฟิลด์สถานะ String โดยใช้เครื่องหมาย `:` คั่น (`"CREATED:PAID,CANCELLED"`)
- **เมื่อใดควรใช้**: ใช้กับงานที่มีวงจรชีวิตเข้มงวด (คำสั่งซื้อ สินเชื่อ ใบแจ้งหนี้) เพื่อป้องกันการเปลี่ยนสถานะผิดกฎ (`422`)
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้รูปแบบ `"->"` โดยเด็ดขาด (`EntityStateMachineUtil` แยกข้อความด้วย `":"` เท่านั้น)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"CREATED"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | สถานะเริ่มต้นที่กำหนดอัตโนมัติเมื่อสร้างข้อมูลหากเว้นว่าง ("ACTIVE")<br/>*ข้อควรระวัง:* กำหนดค่าอัตโนมัติเมื่อสร้างผ่าน `POST` หากค่าว่าง ต้องตรงกับสถานะเริ่มต้นหน้า `:` ใน `transitions` |
| `transitions` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | กฎการเปลี่ยนสถานะที่อนุญาตในรูปแบบ "FROM:TO_1,TO_2"<br/>*ข้อควรระวัง:* ต้องใช้รูปแบบโคลอน `"FROM:TO1,TO2"` อย่างเคร่งครัด (คั่นปลายทางด้วยจุลภาค) การเปลี่ยนสถานะนอกรายการจะถูกปฏิเสธด้วย HTTP `400`/`409` |
| `deletableStates` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | รายการสถานะที่อนุญาตให้ลบข้อมูลได้ (สถานะอื่นจะถูกปฏิเสธด้วย HTTP 422)<br/>*ข้อควรระวัง:* เมื่อระบุค่าไว้ การสั่ง `DELETE /{id}` ในสถานะอื่น (เช่น `"PAID"`) จะถูกปฏิเสธด้วย HTTP `409 Conflict` |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: คอมไพล์ประโยคนโยบายที่อ่านเข้าใจง่ายเป็นกฎ RBAC การเปลี่ยนสถานะ และการปกปิดข้อมูล
- **พฤติกรรมขณะรันไทม์**: ตรวจสอบได้ที่ GET /human-policy และตั้งค่าทับได้ใน YAML ที่ spring-nwvmc.human-policies.<Entity>
- **วิธีใช้งาน**: ใส่ `@HumanPolicy` บน Entity หรือตั้งค่าใน YAML `spring-nwvmc.human-policies` เพื่อคอมไพล์อัตโนมัติ
- **เมื่อใดควรใช้**: ใช้เมื่อทีมผลิตภัณฑ์หรือฝ่ายกำกับดูแลต้องการกติกาที่อ่านเข้าใจง่ายและปรับผ่าน YAML ได้โดยไม่แก้โค้ด
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามเขียนข้อความอิสระหรือภาษาอื่นที่ไม่ใช่รูปแบบภาษาอังกฤษที่ตัวคอมไพเลอร์รองรับ

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | คำสั่งวงจรชีวิตภาษาอังกฤษธรรมชาติที่จะแปลงเป็นกฎเปลี่ยนสถานะ<br/>*ข้อควรระวัง:* คอมไพล์ครั้งเดียวตอนเริ่มระบบเข้าเครื่องยนต์เดียวกับ `@StateMachine` ห้ามประกาศกฎขัดแย้งกันบนเอนทิตีเดียวกัน |
| `security` | `String` | `""` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | คำสั่ง RBAC ภาษาอังกฤษธรรมชาติสำหรับสิทธิ์อ่าน/เขียน/ลบ<br/>*ข้อควรระวัง:* ชื่อบทบาทจะถูกเติมคำนำหน้า `ROLE_` อัตโนมัติ และตรวจสอบทันทีตอนบูตแอป |
| `masking` | `String` | `""` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | นโยบายปิดบังข้อมูลฟิลด์ด้วยภาษาอังกฤษธรรมชาติ<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"costPrice"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `stateField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ สถานะวงจรชีวิต (เช่น `"orderStatus"`)<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | ชื่อฟิลด์ที่เก็บสถานะใน Entity สำหรับกฎ `lifecycle`<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"orderStatus"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: บันทึกความแตกต่างรายฟิลด์ทุกการเปลี่ยนแปลงเพื่อรองรับ Time-Travel และ /diff
- **พฤติกรรมขณะรันไทม์**: เก็บค่าส่วนต่าง oldValue และ newValue เมื่อสร้าง แก้ไข แพตช์ เปลี่ยนสถานะ และกู้คืน
- **วิธีใช้งาน**: ใส่บนคลาสที่สืบทอด `BaseAuditEntity` ระบบจะบันทึกประวัติการแก้ไขผ่าน `AuditTrailService` อัตโนมัติ
- **เมื่อใดควรใช้**: ใช้กับ Entity ที่ต้องการตรวจสอบย้อนหลังและ Time-Travel เช่น การเงิน คำสั่งซื้อ ข้อมูลการแพทย์
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: หลีกเลี่ยงการใช้ `recordFieldDiffs = true` กับตาราง log/telemetry ที่เขียนถี่มากเพื่อไม่ให้เปลือง I/O

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"FINANCE_LEDGER"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | หมวดหมู่ของการบันทึก audit (หากว่างใช้ชื่อ Entity)<br/>*ข้อควรระวัง:* ใช้จัดหมวดหมู่และกรองบันทึกตรวจสอบ (Audit Log) หากเว้น `""` จะใช้ชื่อคลาส Entity |
| `recordFieldDiffs` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | เมื่อเป็น true จะบันทึกผลต่างค่าเก่า/ใหม่ของแต่ละฟิลด์สำหรับ Time-Travel<br/>*ข้อควรระวัง:* บันทึกส่วนต่างก่อน/หลังทุกครั้งที่ `PUT`/`PATCH` ควรตั้ง `false` สำหรับตารางที่มีข้อมูลขนาดใหญ่หรือเขียนถี่มาก |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: แยกการคิวรีและการแก้ไขข้อมูลระดับแถวตาม Tenant อัตโนมัติ ยกเว้นผู้ที่มีสิทธิ์ข้าม Tenant
- **พฤติกรรมขณะรันไทม์**: ปฏิเสธด้วย HTTP 403 ทันทีเมื่อไม่มี Tenant Context เขียนทับ tenantId กันปลอมแปลงตอนสร้าง และบล็อก IDOR ทุกการดำเนินการด้วย ID
- **วิธีใช้งาน**: ใส่บน `@Entity` ที่รองรับหลายผู้เช่า ระบบจะกรองการอ่าน ป้องกันปลอมแปลงตอนสร้าง และบล็อก `403` อัตโนมัติ
- **เมื่อใดควรใช้**: ใช้กับตาราง SaaS ที่แชร์ฐานข้อมูลร่วมกัน เพื่อป้องกันข้อมูลรั่วไหลข้าม Tenant
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับตารางอ้างอิงส่วนกลาง (ประเทศ สกุลเงิน) ที่ทุกคนต้องอ่านร่วมกันได้

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ รหัสผู้เช่า (เช่น `"tenantId"`)<br/>`@MultiTenant(tenantField = "organizationId")` | ชื่อฟิลด์เก็บรหัส Tenant บน Entity (ค่าเริ่มต้น "tenantId")<br/>*ข้อควรระวัง:* ควรสร้าง composite index `(tenant_id, id)` บนฐานข้อมูลเพื่อให้คิวรีแยกผู้เช่าเร็วและปลอดภัย |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | ไม่ (ทางเลือก) | อาร์เรย์ชื่อบทบาท Spring Security (เช่น `{"ROLE_SUPER_ADMIN"}`) หากว่าง `{}` จะไม่จำกัดสิทธิ์เพิ่มเติม<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | บทบาทระดับแพลตฟอร์มที่สามารถข้ามการแบ่งแยก Tenant ได้<br/>*ข้อควรระวัง:* เก็บชื่อบทบาทไว้ใน `RoleConstant` พร้อมคำนำหน้า `ROLE_` (เช่น `ROLE_ADMIN`) ให้ตรงกับ `GrantedAuthority` ของ Spring Security |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: ตรวจสอบความไม่ซ้ำของค่าข้อมูลก่อนบันทึกลงฐานข้อมูลทั้งตอนสร้าง แก้ไข และ Upsert
- **พฤติกรรมขณะรันไทม์**: โยนข้อยกเว้น ConflictBusinessException (HTTP 409) ทันทีเมื่อพบค่าซ้ำ
- **วิธีใช้งาน**: วางบนฟิลด์คีย์ธุรกิจที่ไม่ซ้ำกัน (`email`, `skuCode`) ร่วมกับ `@Column(unique = true)`
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการตรวจสอบความไม่ซ้ำเฉพาะข้อมูลที่ยังใช้งานอยู่ (`deleted = false`) พร้อมส่ง `HTTP 409 Conflict`
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้แทน `UNIQUE` index ในฐานข้อมูลเมื่อมีโหลดพร้อมกันสูง และห้ามใส่บนฟิลด์ที่ซ้ำได้

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: สร้างรหัสธุรกิจที่มีคำนำหน้าแบบไม่ซ้ำอัตโนมัติเมื่อเว้นว่างตอนสร้างหรือโคลน
- **พฤติกรรมขณะรันไทม์**: เติมคำนำหน้าและโทเค็นที่ไม่ซ้ำก่อนตรวจสอบความถูกต้องและบันทึก
- **วิธีใช้งาน**: ใส่ `@AutoCode(prefix = "PRD-")` บนฟิลด์ String ระบบจะสร้างรหัสให้อัตโนมัติหากเว้นว่างตอนสร้าง/โคลน
- **เมื่อใดควรใช้**: ใช้สำหรับสร้างรหัสอ้างอิงที่คนอ่านเข้าใจง่าย (เลขคำสั่งซื้อ SKU รหัสร้าน) โดยไม่ติดคอขวด sequence ของ DB
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้หากกฎระเบียบบังคับเลขรันต่อเนื่องห้ามข้ามเลข (เช่น เลขใบกำกับภาษี) และห้ามลืมใส่ `prefix`

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **ใช่ (บังคับ)** | สตริงตัวระบุที่ไม่ว่าง (เช่น `"ORD"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | คำนำหน้ารหัสที่ต้องระบุเสมอ เพื่อนำหน้าแฮช UUIDv7 8 ตัวอักษร (เช่น "PRD-")<br/>*ข้อควรระวัง:* แอตทริบิวต์บังคับ จะสร้างรหัสเช่น `INV-2026-0001` เมื่อฟิลด์ว่างตอนสร้าง และคงค่าเดิมหากส่งมาแล้ว |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: สร้าง ASCII Slug ที่เป็นมิตรกับ URL จากฟิลด์ sourceField โดยอัตโนมัติ
- **พฤติกรรมขณะรันไทม์**: ปรับอักขระ Unicode ให้เป็นมาตรฐานและรองรับการค้นหาผ่านตัวกรอง slug
- **วิธีใช้งาน**: ใส่ `@AutoSlug(sourceField = "name")` บนฟิลด์ `slug` ระบบจะแปลงอัตโนมัติเมื่อสร้างหรือโคลน
- **เมื่อใดควรใช้**: ใช้สร้าง URL ที่เป็นมิตรกับ SEO สำหรับหน้าร้าน บทความ หมวดหมู่ และสินค้า
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามชี้ `sourceField` ไปยังฟิลด์ที่ไม่มีอยู่จริง และการแก้ไขชื่อภายหลังจะไม่เขียนทับ slug เดิมเพื่อรักษา SEO

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **ใช่ (บังคับ)** | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ สตริง (เช่น `"title"`)<br/>`@AutoSlug(sourceField = "productName") private String slug;` | ชื่อฟิลด์ต้นทางที่ต้องระบุเพื่อแปลงเป็น slug ตัวพิมพ์เล็ก ASCII<br/>*ข้อควรระวัง:* แอตทริบิวต์บังคับ แปลงข้อความเป็น kebab-case ที่ปลอดภัยต่อ URL ควรใช้คู่กับ `@UniqueField` เพื่อป้องกันซ้ำ |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **วัตถุประสงค์**: คำนวณยอดรวมตัวเลขจากการคำนวณล่วงหน้าก่อนบันทึกการเปลี่ยนแปลงข้อมูล
- **พฤติกรรมขณะรันไทม์**: ตรวจสอบตั้งแต่บูตโดย ComputedFieldFailFastUtil เพื่อให้ล้มเหลวทันทีหากระบุฟิลด์ผิด
- **วิธีใช้งาน**: ใส่บนฟิลด์ผลลัพธ์ `BigDecimal` ระบบจะคำนวณใหม่ฝั่งเซิร์ฟเวอร์ด้วยความแม่นยำก่อนบันทึกลง DB
- **เมื่อใดควรใช้**: ใช้คำนวณยอดรวมรายการและยอดสุทธิฝั่งเซิร์ฟเวอร์เพื่อป้องกันการปลอมแปลงราคาจากฝั่งไคลเอนต์
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับโปรโมชันขั้นบันไดซับซ้อนหรือการคำนวณที่ต้องเรียก DB/API ภายนอก

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | โหมดคำนวณ: "MULTIPLY" หรือ "SUM_COLLECTION"<br/>*ข้อควรระวัง:* คำนวณใหม่อัตโนมัติก่อนบันทึกใน `POST`/`PUT`/`PATCH` ป้องกันการปลอมแปลงยอดรวมจากฝั่งไคลเอนต์ |
| `sourceFields` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `{"unitPrice", "quantity"}` (numeric properties on same entity)<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | รายชื่อฟิลด์ใน Entity เดียวกันที่จะนำมาคูณกันในโหมด "MULTIPLY"<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"unitPrice"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `collectionField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ คอลเลกชัน @OneToMany (เช่น `"items"`)<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | ชื่อฟิลด์ @OneToMany ที่ต้องการรวมผลในโหมด "SUM_COLLECTION"<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"items"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `itemField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ ตัวเลข (เช่น `"subTotal"`)<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | ชื่อฟิลด์ตัวเลขในแต่ละรายการย่อยที่จะนำมาบวกรวม (เช่น "subTotal")<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"subTotal"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `subtractField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ ตัวเลข (เช่น `"discountAmount"`)<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | ฟิลด์ส่วนลดบน Entity แม่ที่จะนำมาหักออกจากผลรวม (เช่น "discountAmount")<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"discountAmount"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `addField` | `String` | `""` | ไม่ (ทางเลือก) | ชื่อฟิลด์ Java ที่ตรงทุกตัวอักษรบน Entity สำหรับฟิลด์ ตัวเลข (เช่น `"shippingFee"`)<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | ฟิลด์ค่าธรรมเนียมเพิ่มบน Entity แม่ที่จะบวกเพิ่มเข้าผลลัพธ์ (เช่น "shippingFee")<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"shippingFee"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: ช่วยให้ผูกคำสั่ง SQL/JPQL แบบกำหนดเองหรือเมธอด Provider เข้ากับ Endpoint ของคอนโทรลเลอร์
- **พฤติกรรมขณะรันไทม์**: ประมวลผลพร้อมผูกพารามิเตอร์แบบระบุชื่อผ่าน JPA EntityManager
- **วิธีใช้งาน**: ใช้ร่วมกับ `@AutoGet`/`@AutoPost` โดยผูก `:param` ผ่าน `@AutoParam` หรือ `@AutoVariable`
- **เมื่อใดควรใช้**: ใช้สำหรับทำรายงาน Native SQL, CTE หรือ Window Function โดยไม่ต้องเขียน Repository เอง
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามต่อ string อินพุตของผู้ใช้ลงใน SQL (ต้องใช้ `:param`) และห้ามเขียน SQL JOIN ข้ามโดเมนอิสระ

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | คำสั่ง SQL หรือ JPQL แบบ inline รองรับพารามิเตอร์ `:param`<br/>*ข้อควรระวัง:* ใช้พารามิเตอร์ `:param` หรือ `?1` เสมอเพื่อป้องกัน SQL Injection เว้น `""` เมื่อใช้ `sqlProvider` |
| `nativeQuery` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (รันคำสั่ง SQL เนทีฟของฐานข้อมูล) หรือ `false` (รันคำสั่ง JPA JPQL แบบพกพา)<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true รัน Native SQL โดยตรง; false รัน JPA JPQL<br/>*ข้อควรระวัง:* SQL เนทีฟ (`true`) รองรับ CTE และ window function เลือก `false` (JPQL) หากต้องการย้ายข้าม H2/PostgreSQL/MySQL ได้ง่าย |
| `resultClass` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `MonthlyRevenueDto.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | คลาสปลายทางสำหรับ map ผลลัพธ์ (ไม่บังคับ)<br/>*ข้อควรระวัง:* ควรระบุคลาส DTO projection เสมอสำหรับคิวรีสรุปผลเพื่อเลี่ยง `SELECT *` และรับประกันความปลอดภัยของชนิดข้อมูล |
| `sqlProvider` | `Class<?>` | `Void.class` | ไม่ (ทางเลือก) | คลาส DTO ของ Java ที่เป็นรูปธรรม (เช่น `OrderAnalyticsSqlProvider.class`) หรือ `Void.class` เพื่อปิดการแปลง DTO<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | คลาส Java ที่สร้าง SQL แบบไดนามิก (ถูกตรวจสอบตอน boot ด้วย fail-fast)<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `sqlProvider` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `providerMethod` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"buildRevenueSql"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | ชื่อเมธอดใน `sqlProvider` ที่คืนค่าสตริง SQL<br/>*ข้อควรระวัง:* ต้องตรงกับชื่อเมธอด/ฟิลด์ Java แบบแยกตัวพิมพ์เล็กใหญ่ (เช่น `"buildRevenueSql"`) หากไม่ตรงจะเกิดข้อผิดพลาดขณะรัน |
| `modifying` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (รัน DML UPDATE/DELETE ในธุรกรรมแบบเขียน) หรือ `false` (คำสั่ง SELECT แบบอ่านอย่างเดียว)<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | ต้องเป็น `true` สำหรับคำสั่ง INSERT/UPDATE/DELETE<br/>*ข้อควรระวัง:* ต้องตั้งเป็น `true` สำหรับคำสั่ง `UPDATE`/`DELETE` ทุกครั้งเพื่อเปิดธุรกรรมแบบเขียนอัตโนมัติ |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC แบบไดนามิกจากฐานข้อมูล และเมตาแอนโนเทชันสำหรับปิดบังฟิลด์ (18 แอนโนเทชัน)

### `@SecurityRoleEntity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **วัตถุประสงค์**: กำหนดให้ JPA Entity เป็นตารางรายการบทบาท RBAC แบบไดนามิกในฐานข้อมูล
- **พฤติกรรมขณะรันไทม์**: DynamicDatabaseRbacProviderHelper แคชความสัมพันธ์ Role-Permission ใน Caffeine ตาม TTL และล้างอัตโนมัติเมื่อมีการแก้ไข
- **วิธีใช้งาน**: ใส่ `@SecurityRoleEntity` บน JPA Entity ของ Role และทำเครื่องหมาย `@RoleCode` บนฟิลด์รหัส
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการให้ผู้ดูแลระบบเพิ่ม/แก้ไข Role แบบไดนามิกผ่านฐานข้อมูลได้ทันที
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามลืมใส่ `@RoleCode` (ระบบจะ Fail-Fast ตอนเปิด) และห้ามมี `@SecurityRoleEntity` เกิน 1 คลาส

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย วินาที เช่น `60L`<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | ระยะเวลาแคช Caffeine เป็นวินาทีก่อนโหลดข้อมูล Role ใหม่<br/>*ข้อควรระวัง:* TTL สั้นช่วยสะท้อนการเปลี่ยนแปลงเร็วแต่เพิ่มคิวรี ส่วน TTL ยาวช่วยลดโหลดฐานข้อมูลแต่ทำให้การเพิกถอนสิทธิ์ล่าช้าลง |

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

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่คอลัมน์รหัสบทบาทที่ไม่ซ้ำกันภายใน @SecurityRoleEntity
- **พฤติกรรมขณะรันไทม์**: อ่านผ่าน LambdaAccessorUtil เพื่อนำไปจับคู่กับ GrantedAuthority ของผู้ใช้
- **วิธีใช้งาน**: ใส่ `@RoleCode` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุฟิลด์ชื่อแสดงผลของบทบาทบน @SecurityRoleEntity
- **พฤติกรรมขณะรันไทม์**: แสดงในเมทาดาต้าการวินิจฉัย RBAC และจุดตรวจสอบใน Dev Studio
- **วิธีใช้งาน**: ใส่ `@RoleName` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุฟิลด์แบบคอลเลกชันหรือข้อความ CSV ที่เก็บรหัสสิทธิ์ของบทบาท
- **พฤติกรรมขณะรันไทม์**: แยกวิเคราะห์แบบไดนามิกและขยายเป็นสิทธิ์ที่มีผลใน SecurityIdentityCustomizer
- **วิธีใช้งาน**: ใส่ `@RolePermissions` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **วัตถุประสงค์**: ระบุ JPA Entity ที่จัดเก็บสิทธิ์ Resource-Action และกฎการปกปิดฟิลด์แบบไดนามิก
- **พฤติกรรมขณะรันไทม์**: โหลดเข้าสู่ DatabaseRbacRuleMatcherHelper เพื่อบังคับใช้สิทธิ์ CRUD และปกปิดฟิลด์หลังคิวรี
- **วิธีใช้งาน**: ใส่ `@SecurityPermissionEntity` บน Entity ของสิทธิ์ พร้อมระบุ `@PermissionCode`
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการจัดการสิทธิ์ระดับทรัพยากร/แอคชัน และการปิดบังฟิลด์แบบไดนามิกผ่านฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามลืม `@PermissionCode` และห้ามกำหนด `@SecurityPermissionEntity` ซ้ำหลายคลาส

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย วินาที เช่น `60L`<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | ระยะเวลาแคช Caffeine เป็นวินาทีสำหรับสิทธิ์<br/>*ข้อควรระวัง:* TTL สั้นช่วยสะท้อนการเปลี่ยนแปลงเร็วแต่เพิ่มคิวรี ส่วน TTL ยาวช่วยลดโหลดฐานข้อมูลแต่ทำให้การเพิกถอนสิทธิ์ล่าช้าลง |

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

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุฟิลด์รหัสสิทธิ์ที่ไม่ซ้ำกันภายใน @SecurityPermissionEntity
- **พฤติกรรมขณะรันไทม์**: จับคู่กับสิทธิ์ของผู้เรียกใช้และรายการรหัสใน @EntitySecurity.permissions()
- **วิธีใช้งาน**: ใส่ `@PermissionCode` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPermissionEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPermissionEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPermissionEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่ชื่อเอนทิตีหรือทรัพยากร API เป้าหมาย (หรือ *) ภายใน @SecurityPermissionEntity
- **พฤติกรรมขณะรันไทม์**: ประเมินโดย DatabaseRbacRuleMatcherHelper แบบไม่สนตัวพิมพ์เล็กใหญ่พร้อมรองรับไวลด์การ์ด
- **วิธีใช้งาน**: ใส่ `@PermissionResource` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPermissionEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPermissionEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPermissionEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่คำสั่ง CRUD หรือการดำเนินการที่อยู่ภายใต้กฎของ @SecurityPermissionEntity
- **พฤติกรรมขณะรันไทม์**: ปรับชื่ออัตโนมัติจากเมธอดของคอนโทรลเลอร์เป็น READ, WRITE, DELETE หรือคำสั่งกำหนดเอง
- **วิธีใช้งาน**: ใส่ `@PermissionAction` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPermissionEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPermissionEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPermissionEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุรายชื่อฟิลด์ที่คั่นด้วยจุลภาคซึ่งต้องถูกปกปิดแบบไดนามิกเมื่อกฎสิทธิ์ DB นี้ทำงาน
- **พฤติกรรมขณะรันไทม์**: ทำงานร่วมกับ @FieldSecurity แบบไดนามิกก่อนแปลงคำตอบเป็น JSON
- **วิธีใช้งาน**: ใส่ `@PermissionFieldMask` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPermissionEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPermissionEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPermissionEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **วัตถุประสงค์**: กำหนด JPA Entity ที่ผูกผู้ใช้ที่ยืนยันตัวตนแล้วเข้ากับบทบาท DB และขอบเขต Tenant
- **พฤติกรรมขณะรันไทม์**: ถูกคิวรีอัตโนมัติระหว่างการสร้าง SecurityContext จาก JWT ผ่าน SecurityIdentityCustomizer
- **วิธีใช้งาน**: ใส่บน Entity ตารางเชื่อม User-Role พร้อม `@UserRoleSubject`, `@UserRoleCode` และ `@UserRoleTenantId`
- **เมื่อใดควรใช้**: ใช้เมื่อ JWT ถือแค่ชื่อผู้ใช้ และต้องการโหลด Role ที่ใช้งานจริงจากฐานข้อมูลแบบไดนามิก
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามลืม `@UserRoleSubject` และไม่จำเป็นหากใช้สิทธิ์จากภายนอก (Keycloak/Auth0) ใน JWT ทั้งหมด

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@SecurityUserRoleEntity(enabled = true)` | สวิตช์เปิดหรือปิดการโหลดการผูก User กับ Role จากตารางนี้<br/>*ข้อควรระวัง:* ตั้งเป็น `false` ชั่วคราวระหว่างย้ายสคีมาฐานข้อมูลเพื่อให้สิทธิ์จาก JWT ยังทำงานต่อไปได้ |

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

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุฟิลด์ชื่อผู้ใช้หรือ Subject หลักบน @SecurityUserRoleEntity
- **พฤติกรรมขณะรันไทม์**: จับคู่กับ Authentication.getName() จาก SecurityContext ที่ใช้งานอยู่
- **วิธีใช้งาน**: ใส่ `@UserRoleSubject` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityUserRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityUserRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityUserRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ผูกคอลัมน์รหัสบทบาทที่กำหนดให้ผู้ใช้ภายใน @SecurityUserRoleEntity
- **พฤติกรรมขณะรันไทม์**: ดึงสิทธิ์ที่เชื่อมโยงจาก @SecurityRoleEntity มาตรวจสอบระหว่างประเมินนโยบาย
- **วิธีใช้งาน**: ใส่ `@UserRoleCode` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityUserRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityUserRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityUserRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จำกัดขอบเขตการกำหนดบทบาท @SecurityUserRoleEntity เฉพาะรหัส Tenant ที่ระบุ (หรือ * สำหรับทั้งหมด)
- **พฤติกรรมขณะรันไทม์**: กรองตาม TenantContextHolder / X-Tenant-ID ในทุกคำขอที่ยืนยันตัวตน
- **วิธีใช้งาน**: ใส่ `@UserRoleTenantId` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityUserRoleEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityUserRoleEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityUserRoleEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **วัตถุประสงค์**: ระบุ JPA Entity ที่จัดเก็บนโยบาย ALLOW / DENY แบบชัดแจ้งเรียงตามค่า priority
- **พฤติกรรมขณะรันไทม์**: กฎ DENY จะมีผลเหนือ ALLOW เสมอ และตรวจสอบก่อนรัน SQL ทุกครั้ง
- **วิธีใช้งาน**: ใส่บน Entity นโยบาย พร้อม `@PolicyAllowedRoles`, `@PolicyResource`, `@PolicyAction` และ `@PolicyEffect`
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการให้กฎจากฐานข้อมูลทับซ้อนหรือเสริม `@EntitySecurity` แบบคงที่ (รวมถึงสั่ง `DENY` ฉุกเฉิน)
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามลืม `@PolicyAllowedRoles` และจำไว้ว่ากฎ `DENY` จะมีอำนาจเหนือกว่า `ALLOW` เสมอ

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 0`) ในหน่วย ลำดับความสำคัญจำนวนเต็ม เช่น `10`<br/>`@SecurityPolicyEntity(priority = 10)` | ลำดับความสำคัญของการประเมินนโยบาย (ค่าน้อยสำคัญกว่า ค่าเริ่มต้น 100)<br/>*ข้อควรระวัง:* ค่าที่น้อยกว่าจะมีลำดับความสำคัญสูงกว่าเมื่อมีหลายนโยบายตรงกัน (เช่น `10` มาก่อน `100`) |

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

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่รูปแบบชื่อทรัพยากรเป้าหมายภายใน @SecurityPolicyEntity
- **พฤติกรรมขณะรันไทม์**: รองรับทั้งชื่อเอนทิตีที่ตรงกันทุกตัวอักษรและการใช้ไวลด์การ์ด *
- **วิธีใช้งาน**: ใส่ `@PolicyResource` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPolicyEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPolicyEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPolicyEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่ประเภทการกระทำที่ควบคุม (READ, WRITE, DELETE, methodName, *) ใน @SecurityPolicyEntity
- **พฤติกรรมขณะรันไทม์**: ประเมินผลในแต่ละคำขอ HTTP ก่อนส่งต่อให้ชั้น Service
- **วิธีใช้งาน**: ใส่ `@PolicyAction` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPolicyEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPolicyEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPolicyEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: จับคู่คอลเลกชันหรือรายชื่อบทบาทที่คั่นด้วยจุลภาคซึ่งอยู่ภายใต้กฎ @SecurityPolicyEntity
- **พฤติกรรมขณะรันไทม์**: ตรวจสอบร่วมกับสิทธิ์ใน JWT และบทบาทที่โหลดจากตาราง @SecurityUserRoleEntity
- **วิธีใช้งาน**: ใส่ `@PolicyAllowedRoles` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPolicyEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPolicyEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPolicyEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **วัตถุประสงค์**: ระบุผลลัพธ์การตัดสินใจ ALLOW หรือ DENY บนกฎ @SecurityPolicyEntity
- **พฤติกรรมขณะรันไทม์**: นโยบาย DENY ที่ตรงเงื่อนไขจะปฏิเสธคำขอทันทีด้วย HTTP 403 AccessDeniedBusinessException
- **วิธีใช้งาน**: ใส่ `@PolicyEffect` บนฟิลด์หรือเมธอด getter ภายใน Entity ที่มี `@SecurityPolicyEntity`
- **เมื่อใดควรใช้**: ใช้เพื่อ map ชื่อคอลัมน์อิสระของ `@SecurityPolicyEntity` เข้ากับระบบ DB-RBAC โดยไม่ต้องแก้ชื่อตารางในฐานข้อมูล
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่ซ้ำหลายฟิลด์ในคลาสเดียว และห้ามใส่นอก Entity ที่มี `@SecurityPolicyEntity`

> **Marker Annotation**: แอนโนเทชันทำเครื่องหมายล้วน — ไม่มีแอตทริบิวต์ใด ๆ

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Distributed Lock, Idempotency, การแคช, หลายฐานข้อมูล และ CloudEvents (13 แอนโนเทชัน)

### `@DistributedLock`

- **แพ็กเกจ**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **วัตถุประสงค์**: จัดลำดับการเข้าถึงพร้อมกันด้วยคีย์ SpEL ในแคช AST (ค่าเริ่มต้น waitTimeMs=3000L, leaseTimeMs=5000L)
- **พฤติกรรมขณะรันไทม์**: DistributedLockAspect จะโยน DistributedLockAcquisitionException (HTTP 409) เมื่อหมดเวลารอ
- **วิธีใช้งาน**: วางบนเมธอดของ Spring `@Service` (คลาสต้องไม่เป็น final) และควรใช้ Redis `DistributedLockProvider` เมื่อรันหลายโหนด
- **เมื่อใดควรใช้**: ใช้ป้องกันการขายเกินสต็อก การตัดเงินพร้อมกัน หรือ race condition ในงานเบื้องหลัง
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: อย่าเข้าใจผิดว่า Caffeine + ReentrantLock เริ่มต้นจะล็อกข้ามเครื่องใน Kubernetes ได้ (ต้องเปลี่ยน `DistributedLockProvider`)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | ไม่ (ทางเลือก) | นิพจน์ SpEL ที่อ้างอิงพารามิเตอร์เมธอด (เช่น `"'inventory:' + #skuId"`) หรือ `""` เพื่อสร้างคีย์อัตโนมัติ<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | นิพจน์ SpEL สำหรับสร้างคีย์ล็อกตอนทำงาน (เช่น "'sku:' + #skuCode")<br/>*ข้อควรระวัง:* ควรจำกัดคีย์ให้แคบที่สุดตาม ID ของทรัพยากร (`#id`) เพราะคีย์คงที่จะทำให้ทุกคำขอต้องรอคิวกันทั้งหมด |
| `waitTimeMs` | `long` | `3000L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 0`) ในหน่วย มิลลิวินาที เช่น `3000L`<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | ระยะเวลารอขอรับ lock สูงสุดเป็นมิลลิวินาที (ค่าเริ่มต้น 3000L)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: สั้นเกินไปจะเกิด 409 บ่อย ยาวเกินไปจะทำให้เธรดรอคิวนานเมื่อมีโหลดสูง |
| `leaseTimeMs` | `long` | `5000L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 100`) ในหน่วย มิลลิวินาที เช่น `10000L`<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | ระยะเวลาถือครอง lock สูงสุดเป็นมิลลิวินาที (ค่าเริ่มต้น 5000L)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ต้องมากกว่าเวลาธุรกรรม p99 มิฉะนั้นล็อกอาจหมดอายุกลางคันทำให้ข้อมูลเสียหาย |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: ป้องกันการเขียนซ้ำจากคำขอพร้อมกันหรือการส่งซ้ำภายในช่วงเวลา TTL
- **พฤติกรรมขณะรันไทม์**: บังคับใช้ผ่าน IdempotencyAspect และ ProxyIdempotencyGuardHelper ด้วย Caffeine TTL (HTTP 409 ConflictBusinessException) ข้ามเมื่อไม่มีคีย์ และมี IdempotencyManagerHelper เสริมสำหรับ SHA-256
- **วิธีใช้งาน**: วางบนเมธอดของ `@AutoRestController` หรือ `@Service` ที่ไม่เป็น final (หากทำงานพลาดจะคืนคีย์ให้ลองใหม่ได้)
- **เมื่อใดควรใช้**: ใช้สำหรับการชำระเงิน โอนเงิน หรือ POST ที่เสี่ยงต่อการกดซ้ำและการ retry จากเครือข่าย
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่บนเมธอด GET และในระบบหลายโหนดควรใช้ `IdempotencyStoreProvider` แบบ Redis

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | ไม่ (ทางเลือก) | ชื่อ HTTP Header ที่ถูกต้อง (ไม่แยกตัวพิมพ์เล็กใหญ่ เช่น `"X-Idempotency-Key"`)<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | ชื่อ HTTP header ที่ส่งคีย์ Idempotency (หากไม่ส่งหรือว่างจะข้าม)<br/>*ข้อควรระวัง:* ไคลเอนต์ต้องส่ง UUIDv7 เฉพาะต่อหนึ่งธุรกรรมและใช้ค่าเดิมเมื่อลองใหม่ อย่าลืมเพิ่มหัวข้อนี้ใน CORS `allowedHeaders` |
| `ttlSeconds` | `long` | `300L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย วินาที เช่น `300L`<br/>`@Idempotent(ttlSeconds = 900L)` | ช่วงเวลาป้องกันการส่งซ้ำเป็นวินาที (ส่งซ้ำจะได้ HTTP 409; ค่าเริ่มต้น 300L)<br/>*ข้อควรระวัง:* ระยะเวลาเก็บผลลัพธ์ใน Redis/หน่วยความจำ ตั้งค่าระหว่าง `300L–86400L` ตามกรอบเวลาลองใหม่ของไคลเอนต์ |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: จำกัดอัตราคำขอแบบ Sliding-Window แยกตาม IP ผู้ใช้ หรือ Tenant
- **พฤติกรรมขณะรันไทม์**: เพิ่มค่าเมตริก nwvmc.ratelimit.rejected.total และตอบกลับ HTTP 429 Too Many Requests
- **วิธีใช้งาน**: ใส่บนอินเทอร์เฟซคอนโทรลเลอร์หรือเมธอด ระบบจะส่ง `X-RateLimit-Remaining`/`X-RateLimit-Reset` และคืน `HTTP 429` พร้อม `Retry-After` เมื่อเกินโควตา
- **เมื่อใดควรใช้**: ใช้ป้องกันการสแปมบน API ค้นหาสาธารณะ auth คิวรี AI หรือส่งออกข้อมูลขนาดใหญ่
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: อย่าจำกัดเข้มงวดบน health check และหลีกเลี่ยง `"GLOBAL"` เมื่อต้องการแยกโควตาตาม `"USER"`, `"TENANT"` หรือ `"IP"`

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย คำขอ เช่น `60`<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | จำนวนคำขอสูงสุดที่อนุญาตต่อช่วงเวลา (ค่าเริ่มต้น 60)<br/>*ข้อควรระวัง:* แนบส่วนหัว `X-RateLimit-Remaining`, `X-RateLimit-Reset` และ `Retry-After` ตามมาตรฐาน RFC 6585 เมื่อคืน HTTP `429` |
| `windowSeconds` | `int` | `60` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย วินาที เช่น `60`<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | ระยะเวลาหน้าต่างจำกัดอัตราเป็นวินาที (ค่าเริ่มต้น 60)<br/>*ข้อควรระวัง:* กำหนดความยาวหน้าต่างนับจำนวนและใช้คำนวณค่า `X-RateLimit-Reset` กับ `Retry-After` |
| `partitionKey` | `String` | `"IP"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | กลยุทธ์แบ่งกลุ่มนับสิทธิ์: "IP"/"clientIp", "USER" (ใช้ IP แทนหากไม่ล็อกอิน), "TENANT", "GLOBAL" หรือ SpEL "#expr"<br/>*ข้อควรระวัง:* `"USER"` แยกโควตาตามผู้ใช้ที่ล็อกอินและสลับเป็น IP อัตโนมัติหากไม่ระบุตัวตน ส่วน `"GLOBAL"` ใช้โควตาร่วมกันทั้งระบบ |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: ห่อหุ้มการทำงานด้วย Resilience4j Circuit Breaker พร้อมส่ง Telemetry ไปยัง Actuator & Micrometer
- **พฤติกรรมขณะรันไทม์**: ตัดวงจรเป็น OPEN (HTTP 503) เมื่ออัตราความผิดพลาดเกินกำหนดพร้อมอัปเดตเกจ Micrometer
- **วิธีใช้งาน**: วางบนคอนโทรลเลอร์หรือเมธอดที่ต่อกับ API ภายนอกหรือ AI เพื่อตัดวงจรป้องกันระบบล่มต่อเนื่อง
- **เมื่อใดควรใช้**: ใช้เมื่อต้องการให้ระบบตัดการทำงานทันที (`HTTP 503`) เมื่อปลายทางล่ม แทนการรอ timeout จนระบบค้าง
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: `CircuitBreakerErrorFilterUtil` ยกเว้น 4xx `BaseBusinessException` ให้อัตโนมัติ ห้ามห่อ error ฝั่งผู้ใช้ด้วย `RuntimeException` ทั่วไป

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"payment-gateway-cb"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | ชื่อ CircuitBreaker ใน Resilience4j<br/>*ข้อควรระวัง:* ระบุชื่ออินสแตนซ์ Resilience4j และแท็ก Micrometer หากว่าง `""` จะตั้งตามชื่อคลาส |
| `failureRateThreshold` | `float` | `50.0f` | ไม่ (ทางเลือก) | จำนวนบวก (`1.0f .. 100.0f`) ในหน่วย เปอร์เซ็นต์ เช่น `50.0f`<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | เปอร์เซ็นต์ความล้มเหลวที่ทำให้ตัดวงจรสู่สถานะ OPEN (ค่าเริ่มต้น 50.0f)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ข้อผิดพลาดธุรกิจ 4xx (`BaseBusinessException`) จะถูกข้ามโดยอัตโนมัติ นับเฉพาะ 5xx และปัญหาโครงสร้างพื้นฐาน |
| `waitDurationInOpenStateSeconds` | `int` | `10` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย วินาที เช่น `15`<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | ระยะเวลาพักเป็นวินาทีในสถานะ OPEN ก่อนทดสอบ HALF_OPEN (ค่าเริ่มต้น 10)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ข้อผิดพลาดธุรกิจ 4xx (`BaseBusinessException`) จะถูกข้ามโดยอัตโนมัติ นับเฉพาะ 5xx และปัญหาโครงสร้างพื้นฐาน |
| `slidingWindowSize` | `int` | `20` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย การเรียก เช่น `20`<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | จำนวนการเรียกย้อนหลังที่ใช้คำนวณอัตราความล้มเหลว (ค่าเริ่มต้น 20)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ข้อผิดพลาดธุรกิจ 4xx (`BaseBusinessException`) จะถูกข้ามโดยอัตโนมัติ นับเฉพาะ 5xx และปัญหาโครงสร้างพื้นฐาน |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย การเรียก เช่น `5`<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | จำนวนคำขอทดสอบในสถานะ HALF_OPEN เพื่อยืนยันการฟื้นตัว (ค่าเริ่มต้น 5)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ข้อผิดพลาดธุรกิจ 4xx (`BaseBusinessException`) จะถูกข้ามโดยอัตโนมัติ นับเฉพาะ 5xx และปัญหาโครงสร้างพื้นฐาน |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: ลองใหม่โดยอัตโนมัติเมื่อเกิดความล้มเหลวชั่วคราวแบบ Exponential Backoff
- **พฤติกรรมขณะรันไทม์**: โยนข้อยกเว้นมาตรฐานเมื่อความพยายามลองใหม่ทั้งหมดหมดลง
- **วิธีใช้งาน**: ใส่บนคอนโทรลเลอร์หรือเมธอดเพื่อลองใหม่โดยอัตโนมัติเมื่อเกิดปัญหาเครือข่ายหรือ deadlock ชั่วคราว
- **เมื่อใดควรใช้**: ใช้กับการอ่านข้อมูล GET แบบ Idempotent หรือเมธอดที่ป้องกันด้วย `@Idempotent` แล้ว
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใส่บน POST สร้างข้อมูลหรือตัดบัตรเครดิตที่ไม่มี `@Idempotent` เด็ดขาด (เสี่ยงตัดเงินซ้ำ!)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"erp-sync-retry"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | ชื่อตัวจัดการ Retry ใน Resilience4j<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ตรวจสอบให้เวลารวมของการลองใหม่ทั้งหมดต่ำกว่า timeout ของ API Gateway |
| `maxAttempts` | `int` | `3` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย จำนวนครั้ง เช่น `3`<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | จำนวนครั้งที่ลองทำงานสูงสุดรวมครั้งแรก (ค่าเริ่มต้น 3)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ตรวจสอบให้เวลารวมของการลองใหม่ทั้งหมดต่ำกว่า timeout ของ API Gateway |
| `waitDurationMs` | `long` | `500L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 50`) ในหน่วย มิลลิวินาที เช่น `500L`<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | ระยะเวลารอเริ่มต้นก่อนลองใหม่ครั้งแรกเป็นมิลลิวินาที (ค่าเริ่มต้น 500L)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ตรวจสอบให้เวลารวมของการลองใหม่ทั้งหมดต่ำกว่า timeout ของ API Gateway |
| `backoffMultiplier` | `double` | `2.0d` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1.0d`) ในหน่วย ตัวคูณ เช่น `2.0d`<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | ตัวคูณทวีคูณระยะรอระหว่างการลองซ้ำแต่ละครั้ง (ค่าเริ่มต้น 2.0d)<br/>*ข้อควรระวัง:* ปรับจูนให้เหมาะกับ SLA ความหน่วงในระบบจริงอย่างรอบคอบ: ตรวจสอบให้เวลารวมของการลองใหม่ทั้งหมดต่ำกว่า timeout ของ API Gateway |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **แพ็กเกจ**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: คำนวณ weak ETag มาตรฐาน RFC 7232 (W/"...") และส่ง Cache-Control พร้อมสถานะ HTTP 304 Not Modified
- **พฤติกรรมขณะรันไทม์**: บันทึกตัวนับ HIT/MISS ลงในเมตริก nwvmc.cache.http.requests
- **วิธีใช้งาน**: วางบนคอนโทรลเลอร์หรือเมธอด GET เพื่อเปิดใช้งาน `ETag`, `Cache-Control` และ `304 Not Modified`
- **เมื่อใดควรใช้**: ใช้กับแค็ตตาล็อกหรือข้อมูลอ้างอิงที่ไม่เปลี่ยนบ่อย เพื่อประหยัดแบนด์วิดท์ด้วย `HTTP 304`
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้ค่าเริ่มต้น `isPrivate = false` กับข้อมูลส่วนตัว PII, Multi-Tenant หรือข้อมูลที่ซ่อนตาม Role เด็ดขาด!

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 0`) ในหน่วย วินาที เช่น `120`<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | ค่า `max-age` ใน header Cache-Control เป็นวินาที (ค่าเริ่มต้น 60)<br/>*ข้อควรระวัง:* ส่งค่า `Cache-Control: max-age=<N>` ตั้งเป็น `0` คู่กับ `generateETag = true` เพื่อตรวจสอบซ้ำแบบ `304 Not Modified` ทันที |
| `isPrivate` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (แคชเฉพาะเบราว์เซอร์ ห้าม CDN แชร์แคช) หรือ `false` (แคชสาธารณะที่พร็อกซีและ CDN จัดเก็บได้)<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true จะส่ง `private` (ห้าม CDN เก็บแคช); false จะส่ง `public`<br/>*ข้อควรระวัง:* สำคัญมาก: ต้องตั้ง `isPrivate = true` เสมอสำหรับ API ที่ต้องล็อกอินหรือมี `@FieldSecurity` เพื่อป้องกัน CDN แคชข้อมูลสลับผู้ใช้ |
| `mustRevalidate` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | ต่อท้าย `, must-revalidate` เพื่อบังคับตรวจสอบซ้ำเมื่อหมดอายุ<br/>*ข้อควรระวัง:* บังคับไม่ให้แคชส่งข้อมูลเก่าที่หมดอายุหลัง `maxAgeSeconds` โดยไม่ตรวจสอบกับเซิร์ฟเวอร์ต้นทางก่อน |
| `generateETag` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | คำนวณ ETag SHA-256 และตอบ `HTTP 304` ทันทีเมื่อตรงกับ `If-None-Match`<br/>*ข้อควรระวัง:* สร้างค่า `ETag` ตามมาตรฐาน RFC 7232 และตอบ `304 Not Modified` (0 ไบต์) ทันทีเมื่อ `If-None-Match` ตรงกัน |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: แคชผลลัพธ์ของเมธอดอ่านฝั่งเซิร์ฟเวอร์ใน Caffeine L1 / Redis L2
- **พฤติกรรมขณะรันไทม์**: ตั้งค่าภาพรวมได้ผ่านคุณสมบัติ app.framework.cache.type
- **วิธีใช้งาน**: ใส่บนเมธอดอ่านข้อมูลใน Service โดยเลือก Caffeine/Redis ผ่าน `app.framework.cache.type`
- **เมื่อใดควรใช้**: ใช้สำหรับการค้นหาตาม ID หรือ metadata ที่มีการอ่านบ่อยกว่าเขียนมาก
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามใช้กับตารางที่เขียนบ่อยมาก และห้ามแก้ไขออบเจกต์จากแคชโดยตรงโดยไม่โคลน

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `{"productCatalog"}` (Caffeine/Redis cache region names)<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | ชื่อของพื้นที่เก็บแคชบน Caffeine หรือ Redis<br/>*ข้อควรระวัง:* ชื่อแคชต้องตรงกับการตั้งค่า Caffeine/Redis และควรจับคู่ `@AutoCacheEvict` ในเมธอดเขียน/ลบเพื่อกันข้อมูลเก่า |
| `key` | `String` | `""` | ไม่ (ทางเลือก) | นิพจน์ SpEL ที่อ้างอิงพารามิเตอร์เมธอด (เช่น `"'product:' + #id"`) หรือ `""` เพื่อสร้างคีย์อัตโนมัติ<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | นิพจน์ SpEL สำหรับคีย์แคช (`v0.1.0` จัดการ `EntityName:id` อย่างปลอดภัย)<br/>*ข้อควรระวัง:* ในระบบ multi-tenant ต้องใส่ tenantId ไว้ในคีย์แคชเสมอเพื่อป้องกันข้อมูลปะปนข้ามผู้เช่า |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: ล้างข้อมูลแคชฝั่งเซิร์ฟเวอร์ที่ล้าสมัยเมื่อมีการแก้ไขข้อมูล
- **พฤติกรรมขณะรันไทม์**: ทำงานหลังการแก้ไขข้อมูลโดยไม่ทิ้งข้อมูลอ่านที่ล้าสมัยไว้
- **วิธีใช้งาน**: ใส่บนเมธอด update/delete ให้ตรงคีย์กับ `@AutoCacheable` เพื่อความถูกต้องของข้อมูล
- **เมื่อใดควรใช้**: ใช้ทุกครั้งที่มีการแก้ไขหรือลบข้อมูลที่ถูกเก็บไว้ด้วย `@AutoCacheable`
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: หลีกเลี่ยงการตั้ง `allEntries = true` บนเมธอด `create` ที่เรียกถี่เพราะจะเกิด Cache Stampede

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `{"productCatalog"}` (target cache region names to evict)<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | ชื่อแคชที่ต้องการล้างเมื่อเมธอดทำงานเสร็จ<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `value` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `key` | `String` | `""` | ไม่ (ทางเลือก) | นิพจน์ SpEL ที่อ้างอิงพารามิเตอร์เมธอด (เช่น `"'product:' + #id"`) หรือ `""` เพื่อสร้างคีย์อัตโนมัติ<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | นิพจน์ SpEL เพื่อระบุคีย์แคชเฉพาะรายการที่ถูกแก้ไข<br/>*ข้อควรระวัง:* ต้องสร้างคีย์รูปแบบเดียวกับ `@AutoCacheable.key` ทุกประการ และจะถูกข้ามเมื่อ `allEntries = true` |
| `allEntries` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (ล้างรายการทั้งหมดในแคชปลายทาง) หรือ `false` (ลบเฉพาะรายการเดียวที่ระบุด้วย key)<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | เมื่อเป็น true จะล้างเฉพาะแคชที่ขึ้นต้นด้วยชื่อ Entity นั้นอย่างปลอดภัย<br/>*ข้อควรระวัง:* การล้างแคชทั้งกลุ่มขณะมีโหลดสูงอาจทำให้เกิด cache stampede ใส่ฐานข้อมูล ควรลบเฉพาะ `key` เมื่อทำได้ |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **แพ็กเกจ**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: วัดระยะเวลาการทำงานและบันทึก WARN เมื่อการเรียกใช้ช้าเกินเกณฑ์
- **พฤติกรรมขณะรันไทม์**: ป้อนข้อมูลตัวจับเวลาความหน่วงผ่าน DynamicEntityMetricsHelper อีกด้วย
- **วิธีใช้งาน**: ใส่บนคอนโทรลเลอร์หรือ Service เพื่อตรวจจับการทำงานที่ช้าเกิน SLA
- **เมื่อใดควรใช้**: ใช้กับรายงานซับซ้อน งาน batch, GraphQL และ `@CustomQuery` เพื่อตรวจจับคิวรีช้าแต่เนิ่นๆ
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามตั้ง `warningThresholdMs = 0` บน production และห้ามใส่บน SSE `/events` ที่เชื่อมต่อค้างไว้

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | ไม่ (ทางเลือก) | จำนวนบวก (`>= 1`) ในหน่วย มิลลิวินาที เช่น `300L`<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | เกณฑ์เวลาทำงานช้าเป็นมิลลิวินาทีที่จะพิมพ์ WARN log (ค่าเริ่มต้น 500L)<br/>*ข้อควรระวัง:* บันทึก log ระดับ `WARN` พร้อม `traceId` เมื่อช้ากว่าเกณฑ์ ควรตั้งค่าเหมาะสม (`200L–1000L`) เพื่อไม่ให้ log ล้น |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **แพ็กเกจ**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **วัตถุประสงค์**: ส่ง Webhook ขาออกที่ลงลายเซ็น HMAC-SHA256 แบบอะซิงโครนัสบน Virtual Threads หลัง Commit
- **พฤติกรรมขณะรันไทม์**: คำนวณลายเซ็นใน WebhookHmacSignerHelper และตรวจสอบความเท่ากันแบบเวลาคงที่
- **วิธีใช้งาน**: ใส่บน `@Entity` การส่งจะทำงานแบบ asynchronous หลัง DB commit เท่านั้น
- **เมื่อใดควรใช้**: ใช้แจ้งเตือนระบบภายนอกหรือคู่ค้าทันทีเมื่อคำสั่งซื้อหรือการชำระเงิน commit สำเร็จ
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ควรตั้ง `includeFullPayload = false` หากมีข้อมูล PII/PCI ลับ และห้ามชี้ URL ไปยัง IP ภายใน (SSRF)

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | ไม่ (ทางเลือก) | อาร์เรย์ของค่าที่ถูกต้องตั้งแต่ 0 ค่าขึ้นไป: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | รายการเหตุการณ์ที่กระตุ้นการส่ง Webhook พร้อมลายเซ็น HMAC<br/>*ข้อควรระวัง:* ส่งแบบอะซิงโครนัสหลัง commit ฐานข้อมูล (`AFTER_COMMIT`) เพื่อไม่ให้ธุรกรรมที่ rollback ส่ง webhook หลอกออกไป |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | ไม่ (ทางเลือก) | ชื่อ HTTP Header ที่ถูกต้อง (ไม่แยกตัวพิมพ์เล็กใหญ่ เช่น `"X-Webhook-Signature"`)<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HTTP header ที่ใช้ส่งลายเซ็นตรวจสอบ HMAC-SHA256<br/>*ข้อควรระวัง:* เก็บลายเซ็น HMAC-SHA256 ของข้อมูล ฝั่งผู้รับต้องตรวจสอบลายเซ็นก่อนประมวลผลเสมอ |
| `includeFullPayload` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@EntityWebhook(includeFullPayload = false)` | true ส่ง JSON payload เต็ม; false ส่งแค่ ID และข้อมูลเหตุการณ์<br/>*ข้อควรระวัง:* ตั้งเป็น `false` (ส่งเฉพาะ ID และชนิดเหตุการณ์) สำหรับข้อมูล PII/การเงิน เพื่อให้ผู้รับดึงข้อมูลผ่าน GET ที่ยืนยันตัวตนแล้ว |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **แพ็กเกจ**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: เผยแพร่ซองข้อมูลมาตรฐาน CNCF CloudEvents v1.0 หลังการ Commit ทรานแซกชัน
- **พฤติกรรมขณะรันไทม์**: ทำงานผ่าน TransactionRuntimeBridge.executeAfterCommit เพื่อป้องกันอีเวนต์หลอกเมื่อ Rollback
- **วิธีใช้งาน**: วางบน Entity หรือเมธอด เพื่อรับ `CloudEventEnvelopeDto` หลัง commit ด้วย `@TransactionalEventListener`
- **เมื่อใดควรใช้**: ใช้สื่อสารข้าม Bounded Context ผ่าน Domain Events โดยไม่ต้องทำ SQL JOIN ข้ามโดเมน
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: อย่าสับสนกับ `@EntityWebhook` สำหรับส่งออกนอกระบบ และต้องรับฟังในเฟส `AFTER_COMMIT`

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | ไม่ (ทางเลือก) | สตริงตัวระบุที่ไม่ว่าง (เช่น `"com.acme.order.lifecycle"`) หากเว้น `""` จะใช้ค่าตามมาตรฐานของเฟรมเวิร์ก<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | ค่า `type` ของ CloudEvents (เช่น "io.nwvmc.order.created")<br/>*ข้อควรระวัง:* ใช้รูปแบบ reverse-DNS ตามมาตรฐาน CloudEvents 1.0 (`com.company.domain.event`) หากว่าง `""` จะสร้างให้อัตโนมัติ |
| `source` | `String` | `""` | ไม่ (ทางเลือก) | พาธ HTTP ที่ถูกต้องขึ้นต้นด้วย `/` (เช่น `/services/order-api`) หรือสตริงว่าง `""` เพื่อให้สร้างอัตโนมัติ<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` ของ CloudEvents ที่ระบุโมดูลผู้ส่ง<br/>*ข้อควรระวัง:* กำหนดค่า URI `source` ตามมาตรฐาน CNCF CloudEvents เพื่อการติดตามเหตุการณ์ข้ามไมโครเซอร์วิส |
| `publishOnCreate` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | ส่ง CloudEvent หลัง commit การสร้างข้อมูล (ค่าเริ่มต้น true)<br/>*ข้อควรระวัง:* เผยแพร่หลัง commit (`AFTER_COMMIT`) เท่านั้นผ่าน Spring Events / Kafka / RabbitMQ |
| `publishOnUpdate` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@PublishCloudEvent(publishOnUpdate = true)` | ส่ง CloudEvent หลัง commit การแก้ไขข้อมูล (ค่าเริ่มต้น true)<br/>*ข้อควรระวัง:* ตั้งเป็น `false` กับเอนทิตีที่อัปเดตถี่มากเพื่อไม่ให้ล้น message broker ปลายทาง |
| `publishOnDelete` | `boolean` | `true` | ไม่ (ทางเลือก) | `true` (เปิดใช้งาน) หรือ `false` (ปิดใช้งาน)<br/>`@PublishCloudEvent(publishOnDelete = true)` | ส่ง CloudEvent หลัง commit การลบข้อมูล (ค่าเริ่มต้น true)<br/>*ข้อควรระวัง:* ทำงานทั้งการลบจริงและ `@SoftDelete` เพื่อให้ระบบปลายทางและดัชนีค้นหาซิงก์ตรงกัน |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **แพ็กเกจ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: ผูกการทำงานของเอนทิตีหรือคิวรีเข้ากับชื่อคีย์แหล่งข้อมูลที่กำหนด
- **พฤติกรรมขณะรันไทม์**: บันทึกจำนวนการเลือกเส้นทางในเมตริก framework.datasource.routing.total
- **วิธีใช้งาน**: วางบนคอนโทรลเลอร์หรือ Service ที่ไม่เป็น final ระบบจะคืนค่า ThreadLocal เดิมอัตโนมัติหลังจบงาน
- **เมื่อใดควรใช้**: ใช้สำหรับแยกทราฟฟิกอ่าน/รายงาน BI หนักๆ ไปยังฐานข้อมูล `REPLICA`
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ห้ามสลับ DataSource กลางคันภายใน `@Transactional` ที่เปิด connection ไปแล้ว และห้ามใส่บนคลาส `final`

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`<br/>`@TargetDataSource("REPLICA")` | คีย์กำหนดเส้นทาง DataSource ใน `DataSourceContextHolder` ("PRIMARY", "REPLICA")<br/>*ข้อควรระวัง:* ต้องตรงกับคีย์ที่ลงทะเบียนใน `DynamicRoutingDataSource` หากไม่พบจะสลับกลับไปที่ `PRIMARY` |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **แพ็กเกจ**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **วัตถุประสงค์**: กำหนดตระกูลฐานข้อมูลและคลัสเตอร์ชาร์ดเชิงตรรกะให้กับแต่ละเอนทิตี
- **พฤติกรรมขณะรันไทม์**: ถูกตัดสินเส้นทางแบบไดนามิกโดย MultiPlatformDataSourceRegistryHelper และ TenantDatabaseRoutingResolverHelper
- **วิธีใช้งาน**: วางบน Entity หรือเมธอดเพื่อระบุชนิดฐานข้อมูลและคลัสเตอร์ปลายทาง
- **เมื่อใดควรใช้**: ใช้ในระบบที่ใช้ฐานข้อมูลหลายชนิดหรือแยกคลัสเตอร์เฉพาะทาง เช่น การเงิน วิเคราะห์ และตรวจสอบ
- **เมื่อใดไม่ควรใช้และข้อควรระวัง**: ไม่สามารถใช้แทนการตั้งค่า JDBC DataSource จริงได้ และห้ามทำ JPA JOIN ข้ามคลัสเตอร์ต่างกัน

| แอตทริบิวต์ | ชนิดข้อมูล Java | ค่าเริ่มต้น | จำเป็น | ค่าที่รองรับและตัวอย่าง | คำอธิบายและข้อควรระวังขณะรันไทม์ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | รหัสชนิดฐานข้อมูลเป้าหมาย ("H2", "POSTGRESQL", "MYSQL", "ORACLE")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `platform` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `cluster` | `String` | `"PRIMARY"` | ไม่ (ทางเลือก) | หนึ่งในค่าที่ระบบรองรับ: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | ชื่อคลัสเตอร์ฐานข้อมูลเป้าหมาย ("PRIMARY", "REPLICA", "FINANCE_CLUSTER")<br/>*ข้อควรระวัง:* ตรวจสอบทันทีตอนบูตแอป หากสะกดผิดหรือค่า `cluster` ไม่ถูกต้อง ระบบจะหยุดทำงานแบบ Fail-Fast ทันที |
| `readOnly` | `boolean` | `false` | ไม่ (ทางเลือก) | `true` (ส่งคำขอไปยังพูลเรพลิกาแบบอ่านอย่างเดียว) หรือ `false` (ส่งคำขอไปยังพูลหลักแบบอ่านและเขียน)<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | ระบุ `true` เพื่อแนะนำให้ส่งทราฟฟิกไปยังโหนดอ่านอย่างเดียว<br/>*ข้อควรระวัง:* ห้ามตั้ง `readOnly = true` บนคำสั่งเขียน (`POST`/`PUT`/`DELETE`) เพราะเรพลิกาแบบอ่านอย่างเดียวจะปฏิเสธการเขียน |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
