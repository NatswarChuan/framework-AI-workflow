# 06. Đặc Tả Toàn Diện 60 Declarative Annotations (`0.1.0`)

> **Ngôn ngữ**: [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | **Tiếng Việt** | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Đủ 20 Ngôn Ngữ](../README.md) | [Cẩm Nang Đầy Đủ](../../GUIDE_VI.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](../../index.html#annotations)

Tài liệu tham chiếu đầy đủ **60 Declarative Annotations** của `io.github.natswarchuan:spring-nwvmc:0.1.0`, trích xuất trực tiếp từ mã nguồn `@interface` Java: gói package, `@Target`, danh sách **toàn bộ thuộc tính**, kiểu dữ liệu Java, giá trị mặc định, trạng thái bắt buộc/tùy chọn, **cách sử dụng**, **khi nào NÊN dùng**, **khi nào KHÔNG nên dùng & lưu ý bẫy thường gặp**, cùng ví dụ Java thực chiến.

## Mục Lục Nhanh 60 Annotations

| Annotation | Nhóm | `@Target` | Tóm Tắt Thuộc Tính | Mục Đích Chính |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Biến interface kế thừa AutoApiController<E> thành proxy RESTful gồm 40 hợp đồng (38 mặc định hiển thị trên Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Điều hướng riêng một phương thức trong interface Controller sang bean Spring tùy biến qua MethodHandleCacheUtil. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Khai báo endpoint nghiệp vụ đặc thù (thanh toán, hoàn tiền, duyệt) ủy quyền sang Spring @Component Helper độc lập. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Thay thế thuần Java cho @GetMapping mà không phụ thuộc compile-time vào Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Khai báo tuyến HTTP POST thuần Java hỗ trợ tùy chỉnh định dạng consumes/produces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Ánh xạ tuyến HTTP PUT thuần Java cho thao tác thay thế toàn bộ tài nguyên. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Khai báo HTTP PATCH thuần Java hỗ trợ gộp cục bộ, cộng dồn nguyên tử và RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Khai báo HTTP DELETE thuần Java kích hoạt xóa mềm có bảo vệ trạng thái. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Ánh xạ tham số truy vấn URL hoặc bản đồ bộ lọc động Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Ánh xạ biến đường dẫn URI như khóa chính UUIDv7. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Giải tuần tự JSON body HTTP thành đối tượng DTO hoặc Entity kết hợp kích hoạt @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Cho phép duyệt đệ quy các quan hệ con qua GET /{id}/{relation}/** kèm chặn vòng lặp. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Khai báo chuyển đổi trạng thái nghiệp vụ hoặc điều chỉnh trường số trên phương thức hành động. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Đánh dấu component của framework tự đăng ký khi khởi động mà không cần import @Component. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Đánh dấu tầng ServiceImpl chuyên dùng kết hợp cùng cơ chế @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Khai báo các phương thức factory tạo bean được quản lý bên trong @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Đánh dấu lớp cấu hình và mô hình ánh xạ thuộc tính YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Kiểm soát thứ tự ưu tiên thực thi giữa các SPI Customizer và chuỗi bộ lọc. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Áp dụng RBAC NIST Level 2, cô lập dữ liệu theo ownerField và mã quyền chi tiết trước mọi truy vấn hoặc ghi. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Tự động che mờ hoặc đặt null các cột nhạy cảm nếu vai trò gọi không đủ quyền. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Kiểm soát chuyển trạng thái hợp lệ tại POST /{id}/transition và giới hạn DELETE /{id} theo deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Biên dịch các mệnh đề chính sách dễ đọc thành quy tắc RBAC, chuyển trạng thái và che dữ liệu đang chạy. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Ghi nhận biến động từng trường qua mọi thao tác ghi phục vụ tái dựng lịch sử Time-Travel và /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Tự động cô lập truy vấn và ghi dữ liệu theo ngữ cảnh tenant hiện hành trừ khi có vai trò bỏ qua. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Annotation đánh dấu — không có thuộc tính)` | Kiểm tra tính duy nhất trước khi lưu xuống DB khi tạo, sửa hoặc upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (BẮT BUỘC)` | Tự động sinh mã nghiệp vụ duy nhất kèm tiền tố khi tạo mới hoặc nhân bản nếu để trống. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (BẮT BUỘC)` | Tự động chuẩn hóa và tạo slug ASCII thân thiện URL từ trường sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Tự động tính toán giá trị số dẫn xuất (nhân, cộng trừ, tổng danh sách con) trước khi lưu. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Cho phép gắn kết truy vấn SQL/JPQL tùy biến hoặc phương thức Provider vào endpoint controller. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Đánh dấu JPA Entity đóng vai trò bảng danh mục Vai trò (Role) cho RBAC động trong DB. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ cột mã vai trò duy nhất bên trong thực thể @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Xác định trường tên hiển thị dễ đọc của vai trò trên thực thể @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Đánh dấu trường chứa tập hợp hoặc chuỗi CSV các mã quyền được cấp cho vai trò. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Đánh dấu JPA Entity lưu trữ quyền theo cặp tài nguyên-hành động và quy tắc che trường dữ liệu động. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Xác định trường mã quyền duy nhất bên trong thực thể @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ tên thực thể hoặc tài nguyên API đích (hỗ trợ ký tự đại diện *) trong @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ loại hành động CRUD hoặc hành động tùy biến chịu kiểm soát bởi @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Khai báo danh sách tên trường phân tách bởi dấu phẩy cần tự động che mờ theo quy tắc RBAC trong DB. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Ánh xạ JPA Entity gán vai trò DB cho từng chủ thể người dùng kèm phạm vi tenant tùy chọn. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Xác định trường định danh người dùng (JWT sub / username) trên thực thể @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ cột mã vai trò được gán cho người dùng trong @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Giới hạn phạm vi gán vai trò @SecurityUserRoleEntity theo mã tenant cụ thể (hoặc * toàn cục). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Đánh dấu JPA Entity lưu các chính sách ALLOW / DENY tường minh sắp xếp theo độ ưu tiên priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ mẫu định danh tài nguyên đích trong thực thể @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ thao tác chịu kiểm soát (READ, WRITE, DELETE, methodName, *) trong @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Ánh xạ tập hợp hoặc danh sách vai trò phân tách dấu phẩy chịu tác động của @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Annotation đánh dấu — không có thuộc tính)` | Chỉ định kết quả quyết định ALLOW hoặc DENY của chính sách @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Tuần tự hóa truy cập đồng thời qua khóa SpEL lưu trong cache AST (mặc định waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Ngăn chặn ghi trùng lặp do bấm đúp đồng thời hoặc phát lại yêu cầu trong khoảng TTL. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Giới hạn tần suất yêu cầu theo cửa sổ trượt phân tách theo IP, User hoặc Tenant. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Bọc luồng xử lý trong Resilience4j Circuit Breaker kèm báo cáo telemetry tới Actuator & Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Tự động thử lại các lỗi tạm thời theo độ trễ lũy thừa có thể cấu hình. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Tính toán weak ETag chuẩn RFC 7232 (W/"...") và trả về header Cache-Control kèm mã HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Lưu đệm kết quả phương thức đọc phía server trong động cơ Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Tự động xóa các mục cache cũ phía server ngay khi dữ liệu thay đổi. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Đo thời gian thực thi và tự động ghi log WARN khi thao tác chậm vượt ngưỡng. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Gửi webhook bất đồng bộ ký chữ ký HMAC-SHA256 trên Virtual Threads sau khi commit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Phát sự kiện chuẩn CNCF CloudEvents v1.0 ngay sau khi giao dịch commit thành công. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Gắn thao tác thực thể hoặc truy vấn vào một khóa Datasource logic chỉ định. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Chỉ định họ động cơ CSDL và phân mảnh cụm logic cho từng thực thể. |

---

## 1. Nhóm Điều Khiển API, Route Động, DTO & Tham Số (13 Annotations)

### `@AutoRestController`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Mục đích**: Biến interface kế thừa AutoApiController<E> thành proxy RESTful gồm 40 hợp đồng (38 mặc định hiển thị trên Swagger UI).
- **Hành vi Runtime**: DynamicControllerProxyRegistrarHelper quét các controller kích hoạt khi khởi động và đăng ký tuyến vào RequestMappingHandlerMapping.
- **Cách sử dụng**: Gắn `@AutoRestController(basePath = "/api/v1/...")` lên một Java `interface` kế thừa `AutoApiController<E>` hoặc các interface thành phần như `AutoReadApi<E>`, kết hợp `readDto`/`createDto`/`disabledEndpoints`.
- **Khi nào NÊN sử dụng**: Sử dụng khi cần mở nhanh bộ API chuẩn (CRUD, lọc RSQL/JPA, keyset O(1), phân tích hoặc chỉ đọc) cho JPA Entity mà không cần viết Controller/Service/Repository lặp lại.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên class `@RestController` thông thường hoặc API tổng hợp không gắn JPA Entity; đối với danh mục công khai chỉ đọc hãy kế thừa `AutoReadApi<E>` thay vì mở toàn bộ 40 endpoint của `AutoApiController<E>`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Không (Tùy chọn) | Đường dẫn HTTP hợp lệ bắt đầu bằng `/` (vd. `/api/v1/product-catalogs`) hoặc chuỗi rỗng `""` để framework tự sinh.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Đường dẫn gốc tường minh (vd. "/api/v1/product-catalogs"). Nếu bỏ trống, tự sinh từ tên controller dạng kebab-case số nhiều.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `basePath` trước `path`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `path` | `String` | `""` | Không (Tùy chọn) | Đường dẫn HTTP hợp lệ bắt đầu bằng `/` (vd. `/api/v1/orders`) hoặc chuỗi rỗng `""` để framework tự sinh.<br/>`@AutoRestController(path = "/api/v1/orders")` | Thuộc tính bí danh tương thích. Ưu tiên dùng basePath vì DynamicControllerProxyRegistrarHelper đọc trực tiếp basePath trước.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `basePath` trước `path`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `entityName` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"ProductCatalog"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Ghi đè tên entity hiển thị trong tài liệu OpenAPI và Studio thay cho tên lớp gốc E.<br/>*Lưu ý:* Hiển thị trực tiếp trên tài liệu Swagger / OpenAPI 3.0 và NWVMC Studio; luôn trích xuất chuỗi sang `OpenApiConstant` để tuân thủ Zero Hard-Code. |
| `enabledEndpoints` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Danh sách trắng tên hàm được phép mở (vd. "getPage", "create"). Rỗng sẽ bật toàn bộ hàm kế thừa từ interface.<br/>*Lưu ý:* Hoạt động như danh sách trắng tuyệt đối: khi có giá trị, mọi hàm AutoApiController không nằm trong mảng sẽ bị loại khỏi Spring MVC và Swagger UI. Rất hợp cho API chỉ đọc công khai. |
| `disabledEndpoints` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | Danh sách đen tắt tên phương thức cụ thể trước khi ánh xạ MVC (vd. "deleteById", "batchChunked", "importCsv").<br/>*Lưu ý:* Được đánh giá sau `enabledEndpoints`; rất tiện để chặn các endpoint xóa dữ liệu hoặc xử lý lô nặng mà vẫn giữ nguyên các hợp đồng CRUD còn lại. |
| `enableNestedSubResources` | `boolean` | `false` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Bật định tuyến truy vấn đệ quy GET /{id}/**. Mặc định false để tránh phình to bảng định tuyến với schema hàng trăm bảng.<br/>*Lưu ý:* Chỉ bật `true` khi thật sự cần điều hướng quan hệ lồng `GET /{id}/items/...`; luôn kết hợp `@EnableNestedSubResource` để giới hạn quan hệ tránh phình route và lộ dữ liệu. |
| `readDto` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Bất kỳ lớp DTO Java cụ thể nào (vd. `ProductReadDto.class`) hoặc `Void.class` để tắt ánh xạ DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO đầu ra tùy chọn giúp ẩn các trường nội bộ của JPA Entity khi trả JSON; mặc định Void.class trả nguyên Entity.<br/>*Lưu ý:* Chỉ áp dụng cho luồng đọc (GET); lớp DTO cần constructor mặc định/getter (hoặc Lombok `@Builder`) và tự kích hoạt Jakarta `@Valid` cùng `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Bất kỳ lớp DTO Java cụ thể nào (vd. `ProductCreateDto.class`) hoặc `Void.class` để tắt ánh xạ DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO đầu vào tùy chọn chạy Jakarta Validation trước khi ánh xạ sang Entity E khi gọi POST.<br/>*Lưu ý:* Chỉ áp dụng cho luồng tạo mới (POST); lớp DTO cần constructor mặc định/getter (hoặc Lombok `@Builder`) và tự kích hoạt Jakarta `@Valid` cùng `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Bất kỳ lớp DTO Java cụ thể nào (vd. `ProductUpdateDto.class`) hoặc `Void.class` để tắt ánh xạ DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO cập nhật tùy chọn giới hạn các trường được phép sửa và kiểm tra hợp lệ khi gọi PUT/PATCH.<br/>*Lưu ý:* Chỉ áp dụng cho luồng cập nhật (PUT/PATCH); lớp DTO cần constructor mặc định/getter (hoặc Lombok `@Builder`) và tự kích hoạt Jakarta `@Valid` cùng `@FieldSecurity`. |

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
- **Mục đích**: Điều hướng riêng một phương thức trong interface Controller sang bean Spring tùy biến qua MethodHandleCacheUtil.
- **Hành vi Runtime**: EscapeHatchDispatchHelper ánh xạ bean đích (theo targetBean hoặc beanName) và lưu cache MethodHandle trong MethodHandleCacheUtil.
- **Cách sử dụng**: Gắn `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` lên một hàm cụ thể (hoặc cả interface) của `@AutoRestController`, đồng thời đảm bảo `MyHelper` là Spring `@Component`/`@Service` có chữ ký tương ứng.
- **Khi nào NÊN sử dụng**: Sử dụng khi phần lớn API dùng CRUD tự động nhưng có 1–2 hàm đặc thù (như ghi đè `create`, thống kê phức tạp hoặc gọi nhiều service) cần code Java tùy biến.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG truyền chuỗi cho `targetBean` (bắt buộc là `Class<?>`, muốn tìm theo tên chuỗi phải dùng `beanName`). Tránh lạm dụng khi `@HumanPolicy` hoặc `@EntitySecurity` đã xử lý được.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Class Spring Bean `@Service`/`@Component` cụ thể (vd. `OrderCustomService.class`), hoặc `Void.class` để tìm theo `beanName`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Class Spring Bean đích (được ưu tiên hơn beanName khi khai báo tường minh).<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `targetBean` trước `beanName`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `beanName` | `String` | `""` | Không (Tùy chọn) | Tên Bean chính xác đã đăng ký trong ApplicationContext (vd. `"orderCustomService"`), hoặc `""` để tự phân giải.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Tên Bean tường minh trong Spring container dùng khi targetBean là Void.class.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `targetBean` trước `beanName`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `methodName` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"createOrder"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Tên phương thức trên Bean đích; bỏ trống sẽ lấy trùng tên với hàm trên interface Controller.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"createOrder"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Không (Tùy chọn) | `true` (mặc định — bật ghi đè và gọi bean đích) hoặc `false` (tắt ghi đè và quay về luồng CRUD mặc định).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Khi true, bỏ qua hoàn toàn luồng CRUD tự động và gọi thẳng Bean đích qua MethodHandleCacheUtil.<br/>*Lưu ý:* Khi `true` (mặc định), `EscapeHatchDispatchHelper` gọi thẳng Bean đích và bạn tự quản lý transaction. Đặt `false` sẽ TẮT hoàn toàn `@ServiceOverride` để chạy lại CRUD mặc định (KHÔNG phải pre/post hook). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo endpoint nghiệp vụ đặc thù (thanh toán, hoàn tiền, duyệt) ủy quyền sang Spring @Component Helper độc lập.
- **Hành vi Runtime**: Gọi delegateBean.delegateMethod qua MethodHandle đã lưu cache kèm validation và giao dịch đầy đủ.
- **Cách sử dụng**: Khai báo hàm trên interface với `path`, `httpMethod`, `delegateBean` và `delegateMethod` (hoặc kết hợp `@AutoGet`/`@AutoPost`) trỏ tới một Spring `@Component` Helper độc lập.
- **Khi nào NÊN sử dụng**: Sử dụng khi cần mở các luồng hành động nghiệp vụ chuyên biệt trên resource như thanh toán (checkout), hoàn tiền (refund), phê duyệt hoặc giao dịch đa bảng.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG đặt `@EntitySecurity`/`@RateLimit`/`@Idempotent` ở chữ ký proxy mà kỳ vọng tự chặn (`@CustomEndpoint` nhảy qua `ControllerProxySpecialRouteUtil` trước `invokeProtectedOperation` — hãy xử lý AOP/bảo mật bên trong `@Component`/`@Service` được ủy quyền); không dùng thay `@BusinessAction` cho chuyển trạng thái đơn giản.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/reports/monthly-sales`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Đường dẫn con tương đối dưới basePath của Controller (vd. "/checkout").<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `path` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `httpMethod` | `String` | `"GET"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Phương thức HTTP áp dụng ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `httpMethod` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `delegateBean` | `String` | `""` | Không (Tùy chọn) | Tên Bean chính xác đã đăng ký trong ApplicationContext (vd. `"orderReportService"`), hoặc `""` để tự phân giải.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Tên Spring Bean chịu trách nhiệm xử lý nghiệp vụ; bắt buộc khác rỗng trừ khi hàm có thân `default` hoặc `@ServiceOverride` chặn trước.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `delegateBean` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `delegateMethod` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"buildMonthlyReport"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Tên phương thức trên delegateBean; nếu rỗng mặc định lấy theo tên hàm Controller.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"buildMonthlyReport"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `summary` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"Get monthly revenue breakdown"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Mô tả ngắn gọn cho OpenAPI 3.0 hiển thị trực tiếp trên Swagger UI.<br/>*Lưu ý:* Hiển thị trực tiếp trên tài liệu Swagger / OpenAPI 3.0 và NWVMC Studio; luôn trích xuất chuỗi sang `OpenApiConstant` để tuân thủ Zero Hard-Code. |
| `description` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"Aggregates confirmed invoice totals grouped by currency"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Mô tả chi tiết OpenAPI 3.0 hiển thị khi người dùng mở rộng endpoint trên Swagger UI.<br/>*Lưu ý:* Hiển thị trực tiếp trên tài liệu Swagger / OpenAPI 3.0 và NWVMC Studio; luôn trích xuất chuỗi sang `OpenApiConstant` để tuân thủ Zero Hard-Code. |

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
- **Mục đích**: Thay thế thuần Java cho @GetMapping mà không phụ thuộc compile-time vào Spring Web.
- **Hành vi Runtime**: Được ánh xạ thành HTTP GET RequestMappingInfo khi proxy khởi tạo.
- **Cách sử dụng**: Gắn `@AutoGet("/duong-dan")` lên hàm trong interface `@AutoRestController`, thường kết hợp cùng `@ServiceOverride`, `@CustomQuery` hoặc `@HttpCacheable`.
- **Khi nào NÊN sử dụng**: Dùng khi khai báo route GET tùy biến hoặc chỉ đọc trên controller interface mà không muốn phụ thuộc annotation `@GetMapping` của Spring Web.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng `@AutoGet` cho thao tác thay đổi dữ liệu DB hoặc có side-effect (hãy dùng `@AutoPost`/`@AutoPut`/`@AutoPatch`/`@AutoDelete`) và không dùng trên `@RestController` thông thường.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/{id}/summary`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@AutoGet("/{id}/summary")` | Mẫu đường dẫn GET tương đối (vd. "/metrics"). Rỗng sẽ ánh xạ trực tiếp vào gốc basePath.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `produces` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json", "text/csv"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Mảng Content-Type trả về tùy chọn (vd. "text/event-stream", "application/json", "text/csv").<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Accept`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo tuyến HTTP POST thuần Java hỗ trợ tùy chỉnh định dạng consumes/produces.
- **Hành vi Runtime**: Được đăng ký làm bộ xử lý HTTP POST trong SpringMvcEndpointBridge.
- **Cách sử dụng**: Gắn `@AutoPost("/duong-dan")` lên hàm tạo mới hoặc hành động trong `@AutoRestController`, nhận body qua `@AutoBody` hoặc `@RequestBody` và phối hợp `@BusinessAction` / `@ServiceOverride`.
- **Khi nào NÊN sử dụng**: Dùng cho API tạo mới tài nguyên, kích hoạt hành động nghiệp vụ (`@BusinessAction`), gửi lô dữ liệu hoặc tiếp nhận dữ liệu POST.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho truy vấn chỉ đọc (`@AutoGet`), thay thế toàn phần (`@AutoPut`), cập nhật một phần (`@AutoPatch`) hoặc xóa (`@AutoDelete`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/{id}/approve`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@AutoPost("/{id}/approve")` | Đường dẫn POST tương đối dưới basePath của Controller.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `consumes` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json", "multipart/form-data"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Mảng Content-Type đầu vào được chấp nhận (vd. "application/json", "multipart/form-data").<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Content-Type`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Mảng MIME trả về trong HTTP Response (vd. "application/json").<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Accept`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Ánh xạ tuyến HTTP PUT thuần Java cho thao tác thay thế toàn bộ tài nguyên.
- **Hành vi Runtime**: Gắn kết làm trình xử lý HTTP PUT nằm trong biên độ giao dịch transactional.
- **Cách sử dụng**: Gắn `@AutoPut("/{id}")` lên hàm thay thế toàn bộ bản ghi, kết hợp `@AutoVariable UUID id` và `@AutoBody`.
- **Khi nào NÊN sử dụng**: Dùng cho endpoint PUT thay thế toàn bộ tài nguyên một cách lũy đẳng (nhận đầy đủ trạng thái mới).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho cập nhật từng phần một vài trường hoặc chuyển trạng thái (nên dùng `@AutoPatch` hoặc `@BusinessAction`); lưu ý xung đột `@Version` trả về `409 Conflict`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/{id}/replace`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@AutoPut("/{id}/replace")` | Đường dẫn PUT tương đối (vd. "/{id}").<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `consumes` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Danh sách Content-Type đầu vào được hỗ trợ.<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Content-Type`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Danh sách MIME trả về trong HTTP Response.<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Accept`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo HTTP PATCH thuần Java hỗ trợ gộp cục bộ, cộng dồn nguyên tử và RFC 6902 JSON Patch.
- **Hành vi Runtime**: Hỗ trợ cả ngữ nghĩa gộp JSON thông thường và application/json-patch+json.
- **Cách sử dụng**: Gắn `@AutoPatch("/{id}/hanh-dong")` lên hàm cập nhật từng phần hoặc kết hợp `@BusinessAction` trong `@AutoRestController`.
- **Khi nào NÊN sử dụng**: Dùng cho cập nhật một phần trường, tăng/giảm số nguyên tử (`adjustNumericField`) và chuyển trạng thái (`@StateMachine` + `@BusinessAction`).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng khi yêu cầu thay thế toàn bộ bản ghi (`@AutoPut`) hoặc tạo mới (`@AutoPost`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/{id}/status`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@AutoPatch("/{id}/status")` | Đường dẫn PATCH tương đối dưới basePath (vd. "/{id}/approve").<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `consumes` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json", "application/merge-patch+json"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Các Content-Type đầu vào được chấp nhận.<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Content-Type`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | Không (Tùy chọn) | Mảng các kiểu MIME hợp lệ (vd. `{"application/json"}`); mảng rỗng `{}` dùng mặc định `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Các MIME đầu ra trả về trong phản hồi.<br/>*Lưu ý:* Spring MVC kiểm soát đàm phán định dạng qua HTTP `Accept`; client gửi sai header sẽ nhận `406 Not Acceptable` hoặc `415 Unsupported Media Type`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo HTTP DELETE thuần Java kích hoạt xóa mềm có bảo vệ trạng thái.
- **Hành vi Runtime**: Kiểm tra danh sách deletableStates trong @StateMachine trước khi gán deleted=true.
- **Cách sử dụng**: Gắn `@AutoDelete("/{id}/custom")` lên hàm xóa tùy biến trong `@AutoRestController`, thường đi cùng `@ServiceOverride`.
- **Khi nào NÊN sử dụng**: Dùng cho endpoint DELETE dọn dẹp liên tầng, hủy lưu trữ hoặc ghi đè hành vi xóa mềm mặc định.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG cần định nghĩa lại nếu API `DELETE /{id}` xóa mềm mặc định kèm `@StateMachine(deletableStates = ...)` và `@EntitySecurity` đã đáp ứng.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Đường dẫn con tương đối có thể chứa biến `{pathVar}` (vd. `/{id}/archive`); để trống `""` sẽ gắn thẳng vào root controller.<br/>`@AutoDelete("/{id}/archive")` | Đường dẫn DELETE tương đối dưới basePath (vd. "/{id}/purge").<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Mục đích**: Ánh xạ tham số truy vấn URL hoặc bản đồ bộ lọc động Map<String, String>.
- **Hành vi Runtime**: Được trích xuất qua DynamicQueryParameterParserHelper kèm kiểm tra an toàn bởi QueryGuardrailEnforcerUtil.
- **Cách sử dụng**: Gắn trực tiếp lên tham số hàm trong interface Controller, tương tự `@RequestParam` nhưng không import Spring Web.
- **Khi nào NÊN sử dụng**: Dùng khi muốn giữ Controller Interface hoàn toàn Pure Java (0 import `org.springframework.web.*`) mà vẫn bind đầy đủ query parameters.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho path variable (`{id}` -> `@AutoVariable`) hoặc JSON body (`@AutoBody`). Lưu ý từ `v0.1.0`, framework cũng hỗ trợ trực tiếp `@RequestParam` chuẩn Spring MVC.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"status"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoParam("status") String status` | Tên query param cần ánh xạ (bí danh của name); rỗng sẽ tự lấy tên biến Java (`-parameters`).<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `value` trước `name`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `name` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"pageSize"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Tên query parameter khai báo tường minh.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `value` trước `name`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `required` | `boolean` | `true` | Không (Tùy chọn) | `true` (bắt buộc; thiếu trả về HTTP 400) hoặc `false` (tùy chọn; bỏ qua sẽ truyền null).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Bắt buộc truyền trên URL hay không (`true` sẽ báo 400 nếu thiếu).<br/>*Lưu ý:* Tự động trở thành tùy chọn nếu đã cung cấp `defaultValue`; khi đặt `false`, hãy dùng kiểu đối tượng (`Integer`, `Boolean`) thay cho kiểu nguyên thủy để tránh NPE. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"20"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Giá trị dự phòng nếu không truyền; mặc định là chuỗi sentinel `DEFAULT_NONE` (không có mặc định).<br/>*Lưu ý:* Chuỗi mặc định được chuyển đổi sang kiểu đích qua Spring `ConversionService`; chuỗi sai định dạng kiểu số/UUID sẽ báo lỗi HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Mục đích**: Ánh xạ biến đường dẫn URI như khóa chính UUIDv7.
- **Hành vi Runtime**: Phân tích từ mẫu đường dẫn MVC thành giá trị kiểu Java UUID hoặc String.
- **Cách sử dụng**: Gắn trực tiếp vào tham số nhận biến từ `{...}` trên đường dẫn, ví dụ `findById(@AutoVariable("id") UUID id)`.
- **Khi nào NÊN sử dụng**: Dùng khi lấy giá trị `{id}`, `{slug}`, `{code}` từ URI mà vẫn giữ interface không phụ thuộc `org.springframework.web.*`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho query string (`?page=` -> `@AutoParam`) hay JSON body (`@AutoBody`). Từ `v0.1.0` bạn cũng có thể dùng trực tiếp `@PathVariable`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"orderId"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoVariable("orderId") UUID orderId` | Tên biến đường dẫn `{...}` trên URI cần ánh xạ.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `value` trước `name`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `name` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"tenantCode"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Tên biến đường dẫn khai báo tường minh.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `value` trước `name`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `required` | `boolean` | `true` | Không (Tùy chọn) | `true` (bắt buộc; thiếu trả về HTTP 400) hoặc `false` (tùy chọn; bỏ qua sẽ truyền null).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Biến đường dẫn có bắt buộc phải có giá trị khác null hay không.<br/>*Lưu ý:* Tên biến phải khớp chính xác `{variableName}` trong mẫu URI (`@AutoGet("/{id}/...")`); chỉ đặt `false` khi có nhiều mẫu đường dẫn tùy chọn. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Mục đích**: Giải tuần tự JSON body HTTP thành đối tượng DTO hoặc Entity kết hợp kích hoạt @Valid.
- **Hành vi Runtime**: Được kiểm định qua LocalValidatorFactoryBean trước khi đi vào transaction tầng Service.
- **Cách sử dụng**: Đặt `@AutoBody` lên tham số payload của các hàm `@AutoPost`/`@AutoPut`/`@AutoPatch` trong interface Controller (kèm `@Valid` khi cần Bean Validation).
- **Khi nào NÊN sử dụng**: Dùng khi ánh xạ HTTP JSON Request Body sang Entity hoặc DTO trên interface Controller không cần import `@RequestBody` (tuy `v0.1.0` cũng hỗ trợ `@RequestBody`).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên hàm GET/DELETE không có request body, và không khai báo hai `@AutoBody` trong cùng một phương thức.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Không (Tùy chọn) | `true` (bắt buộc; thiếu trả về HTTP 400) hoặc `false` (tùy chọn; bỏ qua sẽ truyền null).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Yêu cầu bắt buộc phải có HTTP Request Body hợp lệ hay không (`true` mặc định).<br/>*Lưu ý:* Nên kết hợp `@Valid` để kích hoạt Jakarta Validation ngay trước khi proxy chạy; đặt `false` cho phép gửi HTTP body rỗng mà không báo `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Cho phép duyệt đệ quy các quan hệ con qua GET /{id}/{relation}/** kèm chặn vòng lặp.
- **Hành vi Runtime**: Yêu cầu khai báo @AutoRestController(enableNestedSubResources = true) tại controller.
- **Cách sử dụng**: Bật `enableNestedSubResources = true` trên `@AutoRestController` kết hợp gắn `@EnableNestedSubResource(allowedRelationships = {"items"})` để giới hạn đúng quan hệ được phép điều hướng.
- **Khi nào NÊN sử dụng**: Dùng khi cần API tài nguyên lồng nhau dạng `GET /api/v1/customer-orders/{id}/items` mà vẫn kiểm tra `@EntitySecurity`, `@MultiTenant` và chủ sở hữu trên từng chặng.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG mở rộng rãi mà thiếu `allowedRelationships` trên bảng nhiều liên kết; nếu chỉ cần nhúng trường lồng đơn giản hãy dùng `?expand=customer` để giữ đồ thị phẳng.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Danh sách trắng các lớp JPA Entity được phép truy cập qua tuyến con đệ quy `GET /{id}/**`.<br/>*Lưu ý:* Mảng rỗng sẽ mở mọi Entity con có quan hệ; luôn liệt kê rõ các lớp cho phép để tránh lộ bảng nội bộ hoặc bảng kế toán/audit. |
| `allowedRelationships` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Danh sách trắng tên thuộc tính quan hệ JPA được phép đi sâu qua URL (vd. "items", "customer").<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"items"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo chuyển đổi trạng thái nghiệp vụ hoặc điều chỉnh trường số trên phương thức hành động.
- **Hành vi Runtime**: Thực thi nguyên tử trước khi lưu các thuộc tính thực thể đã cập nhật xuống DB.
- **Cách sử dụng**: Kết hợp `@AutoPatch("/{id}/...")` với `@BusinessAction(targetStateField = "...", targetStateValue = "...", entityMethod = "...")` ngay trên interface Controller.
- **Khi nào NÊN sử dụng**: Dùng khi cần khai báo nhanh các thao tác chuyển trạng thái (`approve`, `cancel`), cộng/trừ tồn kho/điểm hoặc gọi hàm nghiệp vụ trên một Entity mà không cần viết tầng Service.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho luồng phối hợp nhiều Entity độc lập, gọi API bên thứ ba hoặc tác vụ bất đồng bộ (hãy chuyển sang Spring Helper qua `@ServiceOverride` hoặc `@CustomEndpoint`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường trạng thái vòng đời (vd. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Tên thuộc tính lưu trạng thái trên Entity (tự động kiểm tra hợp lệ qua `@StateMachine`).<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"status"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `targetStateValue` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"APPROVED"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Giá trị trạng thái đích sẽ gán vào `targetStateField` trong phạm vi Transaction.<br/>*Lưu ý:* Tự động đối chiếu với `@StateMachine` hoặc `@HumanPolicy` trước khi lưu DB; chuyển trạng thái sai luật sẽ rollback giao dịch và trả mã lỗi nghiệp vụ. |
| `adjustNumericField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường số học (vd. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Tên trường số (`BigDecimal`, `Integer`, `Long`) sẽ được cộng/trừ nguyên tử khi gọi endpoint.<br/>*Lưu ý:* Bắt buộc đi kèm `deltaParamIndex >= 0` hoặc `fixedDelta` không rỗng. Hỗ trợ cộng/trừ nguyên tử cho `Integer`, `Long`, `BigDecimal` và `Double` trong giao dịch. |
| `deltaParamIndex` | `int` | `-1` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Chỉ số (từ 0) của tham số hàm mang giá trị delta cần cộng/trừ; mặc định `-1` (không đọc từ tham số).<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `deltaParamIndex` trước `fixedDelta`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `fixedDelta` | `String` | `""` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Chuỗi số cố định (vd. `"100"`, `"-1"`) áp dụng khi không truyền `deltaParamIndex`.<br/>*Lưu ý:* Khi khởi động, bộ đăng ký proxy ưu tiên đọc `deltaParamIndex` trước `fixedDelta`. Tránh khai báo đồng thời hai giá trị mâu thuẫn nhau. |
| `entityMethod` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"markFulfilled"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Tên phương thức nghiệp vụ không tham số ngay trên Entity sẽ được thực thi bên trong cùng Transaction.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"markFulfilled"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Nhóm Quét Bean, Cấu Hình & Thứ Tự Thực Thi (5 Annotations)

### `@AutoComponent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Đánh dấu component của framework tự đăng ký khi khởi động mà không cần import @Component.
- **Hành vi Runtime**: Chỉ quét nội bộ package framework (io.github.natswarchuan); ứng dụng consumer cần dùng Spring @Component.
- **Cách sử dụng**: Stereotype Pure Java nội bộ của framework, được `AutoBeanFactoryRegistrarBridge` quét và đăng ký trong package `io.github.natswarchuan`.
- **Khi nào NÊN sử dụng**: CHỈ sử dụng khi phát triển mã nguồn lõi bên trong package `io.github.natswarchuan.*` cần kiến trúc Pure Java.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG dùng ở ứng dụng tiêu thụ (`com.example.*`)! Bộ quét chỉ quét package `io.github.natswarchuan`; ở app của bạn hãy dùng `@Component` của Spring nếu không Bean sẽ không được khởi tạo.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Tên Bean chính xác đã đăng ký trong ApplicationContext (vd. `"invoiceValidationHelper"`), hoặc `""` để tự phân giải.<br/>`@AutoComponent("invoiceValidationHelper")` | Tên Bean tường minh tùy chọn trong Spring IoC; rỗng lấy tên lớp dạng lowerCamelCase.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Đánh dấu tầng ServiceImpl chuyên dùng kết hợp cùng cơ chế @ServiceOverride.
- **Hành vi Runtime**: Chỉ quét trong package framework io.github.natswarchuan theo tên lớp; tầng service ứng dụng dùng Spring @Service.
- **Cách sử dụng**: Stereotype Pure Java nội bộ của framework, chỉ dùng trong `io.github.natswarchuan` thay thế `@Service` ở lõi.
- **Khi nào NÊN sử dụng**: CHỈ sử dụng cho các tầng Service nằm trong lõi framework `io.github.natswarchuan.*`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG bao giờ gắn trong code nghiệp vụ ứng dụng (`com.example.*`); ứng dụng phải dùng `@Service` chuẩn Spring.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Tên Bean chính xác đã đăng ký trong ApplicationContext (vd. `"orderFulfillmentService"`), hoặc `""` để tự phân giải.<br/>`@AutoService("orderFulfillmentService")` | Tên Service Bean tùy chọn trong container.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Khai báo các phương thức factory tạo bean được quản lý bên trong @AutoConfigurationBean.
- **Hành vi Runtime**: Được xử lý và đăng ký tự động bởi PureJavaBeanRegistrarBridge lúc cấu hình.
- **Cách sử dụng**: Đặt trên các hàm khởi tạo Bean bên trong lớp cấu hình `@AutoConfigurationBean` của framework.
- **Khi nào NÊN sử dụng**: CHỈ dùng bên trong các class cấu hình lõi `io.github.natswarchuan.config.*`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng trong `@Configuration` của ứng dụng; hãy dùng `@Bean` chuẩn Spring khi khai báo custom SPI (`SecurityIdentityCustomizer`, `DistributedLockProvider`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Tên Bean và các bí danh đăng ký trong IoC.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `targetTypeName` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"com.example.spi.PaymentGateway"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Tên lớp đầy đủ (FQCN) của kiểu đích khi kiểm tra bridge động.<br/>*Lưu ý:* Tên lớp đầy đủ (FQCN) tùy chọn khi hàm factory trả về kiểu cha hoặc proxy động; lớp phải tồn tại trên classpath lúc chạy. |
| `primary` | `boolean` | `false` | Không (Tùy chọn) | `true` (ưu tiên tiêm Bean này khi có nhiều ứng viên cùng kiểu) hoặc `false` (độ ưu tiên mặc định).<br/>`@AutoBean(primary = true)` | Đánh dấu là Bean ưu tiên mặc định (`@Primary`) nếu có nhiều Bean cùng interface.<br/>*Lưu ý:* Khai báo hai `@AutoBean(primary = true)` cho cùng một kiểu dữ liệu sẽ gây lỗi xung đột Bean không xác định ngay khi khởi động. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Đánh dấu lớp cấu hình và mô hình ánh xạ thuộc tính YAML.
- **Hành vi Runtime**: Đăng ký các bean cấu hình và tiền tố YAML sạch sẽ kèm metadata cho IDE.
- **Cách sử dụng**: Đánh dấu các lớp cấu hình và properties Pure Java bên trong `io.github.natswarchuan.config.*` để bootstrapper tự nạp.
- **Khi nào NÊN sử dụng**: CHỈ sử dụng bên trong mã nguồn framework `io.github.natswarchuan` thay cho `@Configuration`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn ở ứng dụng người dùng; ứng dụng dùng `@Configuration` và `@ConfigurationProperties` chuẩn Spring Boot.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Tên Bean chính xác đã đăng ký trong ApplicationContext (vd. `"storageAutoConfig"`), hoặc `""` để tự phân giải.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Tên định danh Bean cấu hình tùy chọn.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `prefix` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"nwvmc.storage"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Tiền tố cấu hình YAML (`app.framework.*`) được bind động bởi `PureJavaBeanRegistrarBridge`.<br/>*Lưu ý:* Ánh xạ trực tiếp các thuộc tính kebab-case trong `application.yml`; luôn khai báo kèm `spring-configuration-metadata.json` để IDE không cảnh báo. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Mục đích**: Kiểm soát thứ tự ưu tiên thực thi giữa các SPI Customizer và chuỗi bộ lọc.
- **Hành vi Runtime**: Giá trị số nguyên càng nhỏ sẽ được thực thi càng sớm (mặc định Integer.MAX_VALUE).
- **Cách sử dụng**: Gắn `@OrderPriority(1)` lên bean, interceptor hoặc SPI customizer để quy định thứ tự thực thi thuần Java.
- **Khi nào NÊN sử dụng**: Dùng khi có nhiều SPI Customizer hoặc bộ lọc cần sắp xếp thứ tự chạy xác định thay cho `@Order`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG nhầm với thứ tự Servlet Filter của Spring Security hay tham số sắp xếp `?sort=` của truy vấn.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Thứ tự ưu tiên chạy; số càng nhỏ chạy càng trước (mặc định `Integer.MAX_VALUE` thấp nhất).<br/>*Lưu ý:* Số nguyên càng nhỏ thì chạy TRƯỚC (giống chuẩn Spring `@Order`). Dành giá trị `< 0` cho bảo mật/tracing và `10..100` cho bộ xử lý nghiệp vụ. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Nhóm Thực Thể, Bảo Mật Row/Field, State Machine & Truy Vấn (11 Annotations)

### `@EntitySecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Áp dụng RBAC NIST Level 2, cô lập dữ liệu theo ownerField và mã quyền chi tiết trước mọi truy vấn hoặc ghi.
- **Hành vi Runtime**: Đánh giá trước khi chạy SQL; truy cập trái phép lập tức trả HTTP 403 Forbidden.
- **Cách sử dụng**: Gắn trực tiếp lên lớp JPA `@Entity` để khai báo `readRoles`, `writeRoles`, `deleteRoles`, `permissions` và `ownerField` chống IDOR.
- **Khi nào NÊN sử dụng**: Nên dùng trên TẤT CẢ các JPA Entity có mở API nhằm bảo vệ thống nhất qua cả REST, Import/Export, Batch và GraphQL.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG bật `permitAll = true` trên `AutoApiController<E>` đầy đủ nếu chưa chặn ghi/xóa qua `AutoReadApi<E>`, `disabledEndpoints` hoặc `@SecurityPolicyEntity` (mặc định bỏ qua kiểm tra cho cả READ, WRITE lẫn DELETE khi chưa có DB policy ghi đè).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_USER", "ROLE_ADMIN"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Danh sách vai trò được phép đọc dữ liệu (GET, GraphQL, Export).<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |
| `writeRoles` | `String[]` | `{}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Danh sách vai trò được phép ghi/cập nhật (`POST`, `PUT`, `PATCH`, `import`).<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |
| `deleteRoles` | `String[]` | `{}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Danh sách vai trò được phép xóa bản ghi (`DELETE`, `batchDelete`).<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |
| `permitAll` | `boolean` | `false` | Không (Tùy chọn) | `true` (cho phép truy cập công khai không cần đăng nhập) hoặc `false` (bắt buộc xác thực JWT và kiểm tra phân quyền).<br/>`@EntitySecurity(permitAll = true)` | Khi `true` (và chưa có DB policy ghi đè), bỏ qua kiểm tra `@EntitySecurity` trên TẤT CẢ thao tác READ, WRITE, DELETE; danh mục công khai phải ghép với `AutoReadApi<E>` hoặc `disabledEndpoints`.<br/>*Lưu ý:* Bỏ qua toàn bộ `readRoles`/`writeRoles`/`deleteRoles` và mở truy cập ẩn danh. Tuyệt đối không bật cho dữ liệu cá nhân (PII), hóa đơn hoặc entity cho phép ghi. |
| `ownerField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường chủ sở hữu/UUID (vd. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Tên trường lưu chủ sở hữu bản ghi (vd. `"createdBy"`, `"ownerId"`), tự động chặn IDOR từng dòng.<br/>*Lưu ý:* Áp đặt lọc chủ sở hữu cấp dòng (Row-Level Security) trên mọi lệnh đọc/ghi/xóa; người dùng chỉ chạm được bản ghi của chính mình trừ khi có role thuộc `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Các vai trò quản trị được phép bỏ qua kiểm tra `ownerField`.<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |
| `permissions` | `String[]` | `{}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ORDER_READ", "ORDER_APPROVE"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Danh sách mã quyền chi tiết (Permission codes) được đánh giá cùng Role qua DB RBAC.<br/>*Lưu ý:* Đối chiếu trực tiếp với quyền chi tiết từ JWT hoặc bảng DB-RBAC `@SecurityPermissionEntity`, có thể kết hợp với kiểm tra role để bảo vệ nhiều lớp. |

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
- **Mục đích**: Tự động che mờ hoặc đặt null các cột nhạy cảm nếu vai trò gọi không đủ quyền.
- **Hành vi Runtime**: Thực thi sau bước truy vấn dữ liệu và trước khi tuần tự hóa thành JSON.
- **Cách sử dụng**: Đặt lên các field nhạy cảm trong `@Entity` (`costPrice`, `b2bWholesalePrice`, `ssn`). Quá trình che mờ thực hiện trên bản sao tách rời nên không làm hỏng JPA session hay L1 Cache.
- **Khi nào NÊN sử dụng**: Dùng khi nhiều nhóm quyền dùng chung một endpoint/Entity nhưng chỉ Admin/Kế toán mới được xem giá vốn, CCCD hoặc thông tin PII.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: Không cần bật `nullifyInsteadOfMask = true` chỉ để chống lộ kiểu số/ngày (`FieldMaskingExecutionHelper` đã tự gán `null` cho mọi kiểu khác `String`); chỉ cần đặt `true` khi muốn ép trường `String` về `null` thay vì `"******"`, hoặc dùng `@AutoRestController(readDto = ...)` nếu muốn xóa hẳn tên trường khỏi JSON.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Danh sách vai trò được phép nhìn thấy giá trị gốc không bị che mờ.<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |
| `maskPattern` | `String` | `"******"` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"***-**-****"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Chuỗi ký tự thay thế (vd. `"******"`) áp dụng cho field kiểu String khi thiếu quyền.<br/>*Lưu ý:* Bị bỏ qua khi `nullifyInsteadOfMask = true`. Với trường không phải String (`BigDecimal`, `Integer`, `LocalDate`), nên bật `nullifyInsteadOfMask = true` để tránh phá vỡ kiểu dữ liệu JSON của client. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Không (Tùy chọn) | `true` (thay giá trị trường không đủ quyền thành JSON null) hoặc `false` (che mờ bằng chuỗi maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Khi `true` sẽ ép cả trường `String` về `null` thay vì chuỗi `maskPattern` (các kiểu khác `String` như `BigDecimal`, `UUID` đã tự động gán `null` bởi `FieldMaskingExecutionHelper`).<br/>*Lưu ý:* Cực kỳ quan trọng cho trường số, ngày tháng và đối tượng con để phía TypeScript/Zod nhận `null` hợp lệ thay vì chuỗi che mờ gây lỗi parse. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Mục đích**: Kiểm soát chuyển trạng thái hợp lệ tại POST /{id}/transition và giới hạn DELETE /{id} theo deletableStates.
- **Hành vi Runtime**: Từ chối chuyển trạng thái hoặc xóa trái quy tắc bằng HTTP 422 BusinessRuleViolationException.
- **Cách sử dụng**: Đặt lên thuộc tính kiểu `String` quản lý trạng thái, khai báo quy tắc phân tách bằng dấu `:` (vd. `"CREATED:PENDING_PAYMENT,CANCELLED"`).
- **Khi nào NÊN sử dụng**: Dùng cho các đối tượng có vòng đời chặt chẽ (đơn hàng, hồ sơ vay, hóa đơn) để tự động chặn chuyển trạng thái sai hoặc xóa dữ liệu đã xử lý (`422 Unprocessable Entity`).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG dùng dấu `"->"` (bộ phân tích `EntityStateMachineUtil` chỉ tách chuỗi theo dấu hai chấm `":"`), và tránh khai báo đè chéo với `@HumanPolicy(lifecycle)`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"CREATED"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Trạng thái khởi tạo mặc định tự động gán khi tạo mới nếu bỏ trống (mặc định `"ACTIVE"`).<br/>*Lưu ý:* Tự động gán khi tạo mới `POST` nếu trường trạng thái trống; bắt buộc khớp tên trạng thái nguồn đứng trước dấu `:` trong mảng `transitions`. |
| `transitions` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Mảng quy tắc chuyển trạng thái hợp lệ theo định dạng dấu hai chấm `"FROM:TO_1,TO_2"`.<br/>*Lưu ý:* Bắt buộc đúng cú pháp dấu hai chấm `"FROM:TO1,TO2"` (phân biệt hoa/thường, nhiều trạng thái đích cách nhau bằng dấu phẩy). Mọi lệnh `POST /{id}/transition` nhảy sai luật đều bị chặn bằng HTTP `422`. |
| `deletableStates` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Danh sách các trạng thái cho phép xóa bản ghi (ngoài danh sách sẽ chặn với lỗi `HTTP 422`).<br/>*Lưu ý:* Khi có giá trị, mọi lệnh `DELETE /{id}` trên bản ghi ở trạng thái khác (như `"PAID"`, `"SHIPPED"`) sẽ bị chặn bằng HTTP `422 Unprocessable Entity`. |

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
- **Mục đích**: Biên dịch các mệnh đề chính sách dễ đọc thành quy tắc RBAC, chuyển trạng thái và che dữ liệu đang chạy.
- **Hành vi Runtime**: Tra cứu trực tiếp qua GET /human-policy và ghi đè linh hoạt trong YAML tại spring-nwvmc.human-policies.<Entity>.
- **Cách sử dụng**: Gắn `@HumanPolicy` lên Entity với câu tiếng Anh có cấu trúc hoặc khai báo trong YAML `spring-nwvmc.human-policies`, được `HumanPolicyRegistryHelper` biên dịch 1 lần.
- **Khi nào NÊN sử dụng**: Dùng khi muốn tách luật nghiệp vụ, phân quyền, che mờ sang dạng câu văn tự nhiên hoặc YAML cho phép cập nhật cấu hình mà không sửa code Java.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG viết văn xuôi tự do hoặc ngôn ngữ khác tiếng Anh chuẩn mẫu (`HumanPolicyRegexCompilerHelper` đối khớp theo các mẫu ngữ pháp cố định); nếu cần tường minh tuyệt đối hãy dùng `@EntitySecurity` + `@StateMachine`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Chuỗi luật vòng đời bằng tiếng Anh tự nhiên được biên dịch thành chuyển đổi trạng thái.<br/>*Lưu ý:* Được biên dịch một lần khi khởi động thành cùng động cơ với `@StateMachine`; tránh khai báo đồng thời `@StateMachine` gây xung đột quy tắc. |
| `security` | `String` | `""` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Câu mô tả phân quyền RBAC đọc/ghi/xóa/chủ sở hữu bằng tiếng Anh tự nhiên.<br/>*Lưu ý:* Tên role tự động được chuẩn hóa thêm tiền tố `ROLE_` và biên dịch ngay lúc khởi động để báo lỗi sớm nếu câu lệnh sai cú pháp. |
| `masking` | `String` | `""` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Câu luật che mờ dữ liệu nhạy cảm bằng tiếng Anh tự nhiên.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"costPrice"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `stateField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường trạng thái vòng đời (vd. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Tên trường trạng thái trên Entity tương ứng với luật `lifecycle`.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"orderStatus"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |

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
- **Mục đích**: Ghi nhận biến động từng trường qua mọi thao tác ghi phục vụ tái dựng lịch sử Time-Travel và /diff.
- **Hành vi Runtime**: Lưu vết chính xác giá trị cũ oldValue và giá trị mới newValue khi tạo, sửa, chuyển trạng thái và khôi phục.
- **Cách sử dụng**: Gắn lên Entity kế thừa `BaseAuditEntity`; mọi thao tác tạo/sửa/xóa qua framework sẽ tự động ghi lịch sử qua `AuditTrailService`.
- **Khi nào NÊN sử dụng**: Dùng cho các bảng quan trọng về pháp lý/kiểm toán (đơn hàng, giao dịch tiền, bệnh án, phân quyền) cần truy vết Time-Travel qua `GET /api/v1/system/time-travel/{entityName}/{id}`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên các bảng log/telemetry ghi hàng nghìn dòng/giây để tránh đội chi phí ghi (write amplification); hoặc tắt `recordFieldDiffs = false`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"FINANCE_LEDGER"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Tên danh mục nhật ký kiểm toán (`category`); nếu rỗng tự động lấy tên JPA Entity.<br/>*Lưu ý:* Dùng để phân nhóm và lọc nhật ký kiểm toán theo miền nghiệp vụ; để trống `""` sẽ tự lấy tên lớp JPA Entity. |
| `recordFieldDiffs` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Khi `true`, tự động tính diff cũ/mới theo từng trường phục vụ truy vấn Time-Travel (`GET /api/v1/system/time-travel/{entityName}/{id}`).<br/>*Lưu ý:* Ghi nhận chi tiết giá trị trước/sau của từng trường khi `PUT`/`PATCH`; nên đặt `false` với bảng chứa dữ liệu lớn hoặc cập nhật tần suất siêu cao để tránh phình dung lượng. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Tự động cô lập truy vấn và ghi dữ liệu theo ngữ cảnh tenant hiện hành trừ khi có vai trò bỏ qua.
- **Hành vi Runtime**: Từ chối ngay HTTP 403 (fail-closed) khi thiếu ngữ cảnh tenant; ghi đè cưỡng bức tenantId lúc tạo chống giả mạo và chặn IDOR trên mọi thao tác theo ID.
- **Cách sử dụng**: Gắn `@MultiTenant` lên `@Entity` có trường `tenantId` (hoặc tên khác qua `tenantField`). Hệ thống tự động fail-closed `403` nếu thiếu claim tenant, tự chèn chống giả mạo khi create/import và chặn IDOR khi truy cập theo ID.
- **Khi nào NÊN sử dụng**: Dùng cho mọi bảng dữ liệu SaaS B2B dùng chung Database (cửa hàng, đơn hàng, hóa đơn) để cách ly dữ liệu tuyệt đối giữa các khách hàng qua REST, Import/Export, Batch và GraphQL.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên bảng danh mục dùng chung toàn hệ thống (quốc gia, tiền tệ, danh mục công khai), và lưu ý phải truyền claim `tenantId` qua JWT hoặc `SecurityIdentityCustomizer`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường định danh tenant (vd. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Tên thuộc tính lưu mã Tenant trên Entity (mặc định `"tenantId"`).<br/>*Lưu ý:* Luôn đánh composite B-Tree index `(tenant_id, id)` ở DB để truy vấn cô lập đa khách hàng đạt hiệu năng cao và tuyệt đối không rò rỉ dữ liệu chéo. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Không (Tùy chọn) | Mảng tên role/authority Spring Security (vd. `{"ROLE_SUPER_ADMIN"}`); mảng rỗng `{}` không đặt giới hạn riêng cho thao tác này.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Các vai trò cấp nền tảng được phép truy cập xuyên Tenant không cần claim `tenantId` (mặc định `{"ROLE_SUPER_ADMIN"}`).<br/>*Lưu ý:* Khai báo tên role trong `RoleConstant` kèm tiền tố `ROLE_` (vd. `ROLE_ADMIN`) để khớp hoàn toàn với `GrantedAuthority` của Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Mục đích**: Kiểm tra tính duy nhất trước khi lưu xuống DB khi tạo, sửa hoặc upsert.
- **Hành vi Runtime**: Ném ngoại lệ ConflictBusinessException (HTTP 409) ngay khi phát hiện giá trị trùng lặp.
- **Cách sử dụng**: Đặt lên thuộc tính khóa nghiệp vụ duy nhất (`email`, `skuCode`, `businessLicense`) kết hợp `@Column(unique = true)`; framework tự kiểm tra trước khi `POST`/`PUT`/`upsert` trên bản ghi chưa bị xóa mềm (`deleted = false`).
- **Khi nào NÊN sử dụng**: Dùng khi cần báo lỗi `HTTP 409 Conflict` đa ngôn ngữ rõ ràng trước khi chạm DB, và bỏ qua bản ghi đã soft-delete.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG bỏ qua index `UNIQUE` ở tầng DB nếu tải đồng thời cao (tranh chấp race-condition được DB constraint chặn và tự ánh xạ sang `409`); không gắn lên trường cho phép trùng.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Mục đích**: Tự động sinh mã nghiệp vụ duy nhất kèm tiền tố khi tạo mới hoặc nhân bản nếu để trống.
- **Hành vi Runtime**: Điền prefix kèm chuỗi định danh duy nhất ngay trước bước kiểm định và lưu.
- **Cách sử dụng**: Gắn `@AutoCode(prefix = "PRD-")` lên trường mã kiểu `String`. Khi tạo mới hoặc nhân bản mà client bỏ trống, framework tự sinh mã dạng `PRD-XXXXXXXX`.
- **Khi nào NÊN sử dụng**: Dùng khi cần mã tham chiếu dễ đọc (mã đơn hàng `ORD-...`, mã SKU, mã phiếu) nhưng vẫn tránh thắt cổ chai `AUTO_INCREMENT`/sequence của DB.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng nếu nghiệp vụ kế toán/thuế bắt buộc số thứ tự tăng dần tuyệt đối không được nhảy số (`1, 2, 3...`). Cũng bắt buộc phải truyền `prefix` khi viết annotation.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Bắt buộc (không có mặc định)` | **Có (Bắt buộc)** | Chuỗi tiền tố BẮT BUỘC khác rỗng (vd. `"PRD-"`, `"ORD-"`, `"INV-"`) — bỏ qua sẽ lỗi biên dịch.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Tiền tố mã định danh BẮT BUỘC gắn trước 8 ký tự UUIDv7 viết hoa (vd. `"PRD-"`, `"ORD-"`).<br/>*Lưu ý:* Thuộc tính bắt buộc; tự ghép 8 ký tự UUIDv7 viết hoa (vd. `INV-0194E1A0`) khi trường rỗng lúc tạo/nhân bản, giữ nguyên giá trị nếu client đã truyền sẵn. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Mục đích**: Tự động chuẩn hóa và tạo slug ASCII thân thiện URL từ trường sourceField.
- **Hành vi Runtime**: Loại bỏ dấu tiếng Việt/Unicode và hỗ trợ truy vấn lọc trực tiếp theo trường slug.
- **Cách sử dụng**: Đặt `@AutoSlug(sourceField = "name")` trên trường `slug`; hệ thống tự bỏ dấu tiếng Việt (kể cả `đ`/`Đ`) khi tạo mới nếu bỏ trống hoặc khi nhân bản.
- **Khi nào NÊN sử dụng**: Dùng để tự sinh đường dẫn URL chuẩn SEO cho bài viết, cửa hàng, sản phẩm, danh mục (đặc biệt tối ưu cho tiêu đề có dấu tiếng Việt).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG trỏ `sourceField` tới tên trường không tồn tại hoặc không phải kiểu chữ; lưu ý khi sửa tiêu đề lúc update, framework không ghi đè slug đã có để tránh gãy liên kết SEO.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Bắt buộc (không có mặc định)` | **Có (Bắt buộc)** | Tên thuộc tính Java chính xác trên Entity ứng với trường chuỗi (vd. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Tên thuộc tính nguồn BẮT BUỘC (hỗ trợ chuẩn hóa dấu Unicode và đ/Đ tiếng Việt) để sinh đường dẫn slug ASCII viết thường.<br/>*Lưu ý:* Thuộc tính bắt buộc; tự chuẩn hóa dấu tiếng Việt/Unicode thành chuỗi kebab-case an toàn cho URL (`"Áo Sơ Mi"` -> `"ao-so-mi"`). Nên gắn kèm `@UniqueField` để chống trùng lặp. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Mục đích**: Tự động tính toán giá trị số dẫn xuất (nhân, cộng trừ, tổng danh sách con) trước khi lưu.
- **Hành vi Runtime**: Kiểm định ngay khi khởi động qua ComputedFieldFailFastUtil để fail-fast nếu khai báo sai trường.
- **Cách sử dụng**: Gắn lên trường `BigDecimal` dẫn xuất (`subTotal`, `totalAmount`). Hệ thống luôn tính lại chính xác phía server trước khi lưu POST/PUT/PATCH/upsert.
- **Khi nào NÊN sử dụng**: Dùng cho tổng tiền dòng (`unitPrice * quantity`) và tổng hóa đơn (`sum(items) - discount + shipping`) tính trực tiếp ở server để chống client giả mạo số tiền.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG dùng cho công thức tính giá bậc thang, khuyến mãi phức tạp hoặc tỷ giá ngoại tệ cần gọi DB/API ngoài (hãy xử lý trong Helper qua `@ServiceOverride`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Chế độ tính toán: `"MULTIPLY"` (nhân các trường cùng dòng) hoặc `"SUM_COLLECTION"` (tổng hợp collection con).<br/>*Lưu ý:* Tự động tính lại ngay trước khi lưu `POST`/`PUT`/`PATCH`/Upsert, ghi đè mọi tổng tiền do client tự sửa để chống gian lận giá. |
| `sourceFields` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Mảng tên các trường số trên cùng Entity được nhân với nhau khi dùng `"MULTIPLY"` (vd. `{"unitPrice", "quantity"}`).<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"unitPrice"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `collectionField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường danh sách @OneToMany (vd. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Tên thuộc tính danh sách con `@OneToMany` (vd. `"items"`) cần tính tổng trong chế độ `"SUM_COLLECTION"`.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"items"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `itemField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường số học (vd. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Tên trường số trên từng phần tử con sẽ được cộng dồn (vd. `"subTotal"`).<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"subTotal"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `subtractField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường số học (vd. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Trường giảm trừ tùy chọn trên bảng cha (vd. `"discountAmount"`) sẽ trừ bớt khỏi tổng.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"discountAmount"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `addField` | `String` | `""` | Không (Tùy chọn) | Tên thuộc tính Java chính xác trên Entity ứng với trường số học (vd. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Trường phụ phí tùy chọn trên bảng cha (vd. `"shippingFee"`) sẽ cộng thêm vào kết quả.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"shippingFee"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Cho phép gắn kết truy vấn SQL/JPQL tùy biến hoặc phương thức Provider vào endpoint controller.
- **Hành vi Runtime**: Được thực thi an toàn với tham số đặt tên qua JPA EntityManager.
- **Cách sử dụng**: Gắn cùng `@AutoGet`/`@AutoPost` trên interface Controller, truyền biến SQL `:param` tương ứng qua `@AutoParam` hoặc `@AutoVariable` (hoặc tách SQL ra `sqlProvider`).
- **Khi nào NÊN sử dụng**: Dùng cho các truy vấn báo cáo phức tạp dùng Native SQL, CTE (`WITH`), Window Functions, JSONB mà không cần viết thêm class `JpaRepository`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG cộng chuỗi tham số người dùng vào SQL (bắt buộc dùng `:param`), không trỏ `sqlProvider` sai tên hàm (`EntityFailFastValidatorUtil` chặn ngay lúc khởi động), và cấm JOIN chéo domain khác nhau.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Câu truy vấn SQL thuần hoặc JPQL hỗ trợ tham số đặt tên `:param` (bỏ trống nếu dùng `sqlProvider`).<br/>*Lưu ý:* Luôn truyền tham số qua `:param` hoặc `?1` để chống SQL Injection tuyệt đối; để trống `""` khi ủy quyền dựng SQL động cho `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Không (Tùy chọn) | `true` (chạy câu lệnh SQL thuần đặc thù của CSDL) hoặc `false` (chạy truy vấn JPA JPQL độc lập hệ quản trị).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | `true` chạy Native SQL trực tiếp; `false` chạy JPA JPQL.<br/>*Lưu ý:* SQL thuần (`true`, mặc định) khai thác tối đa CTE, Window Function và toán tử JSON; chuyển sang `false` (JPQL) nếu cần chạy tương thích đa hệ quản trị H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Bất kỳ lớp DTO Java cụ thể nào (vd. `MonthlyRevenueDto.class`) hoặc `Void.class` để tắt ánh xạ DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Class ánh xạ kiểu kết quả trả về (Entity, DTO hoặc scalar).<br/>*Lưu ý:* Luôn chỉ định lớp DTO projection cho truy vấn thống kê/báo cáo để triệt tiêu `SELECT *` và bảo đảm 100% an toàn kiểu dữ liệu. |
| `sqlProvider` | `Class<?>` | `Void.class` | Không (Tùy chọn) | Class Pure Java cung cấp SQL cụ thể (vd. `OrderAnalyticsSqlProvider.class`), hoặc `Void.class` khi viết SQL trực tiếp ở `value`.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Class Pure Java tùy chọn cung cấp chuỗi SQL động theo ngữ cảnh (được `EntityFailFastValidatorUtil` kiểm chứng lúc khởi động).<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `sqlProvider` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `providerMethod` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"buildRevenueSql"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Tên phương thức bên trong `sqlProvider` trả về chuỗi câu lệnh SQL.<br/>*Lưu ý:* Bắt buộc trùng khớp tuyệt đối (phân biệt hoa/thường) với tên hàm/thuộc tính Java (vd. `"buildRevenueSql"`); sai tên sẽ bỏ qua quy tắc hoặc phát sinh lỗi runtime. |
| `modifying` | `boolean` | `false` | Không (Tùy chọn) | `true` (chạy DML UPDATE/DELETE trong giao dịch ghi) hoặc `false` (truy vấn SELECT chỉ đọc trả về Entity hoặc DTO).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Bắt buộc đặt `true` nếu câu lệnh là `INSERT`/`UPDATE`/`DELETE` (chạy `executeUpdate`).<br/>*Lưu ý:* Bắt buộc đặt `true` cho mọi lệnh `UPDATE`/`DELETE`; tự bọc trong giao dịch ghi có rollback và làm sạch ngữ cảnh JPA. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Nhóm Phân Quyền Động DB-RBAC & Masking Theo Dữ Liệu Database (18 Annotations)

### `@SecurityRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Mục đích**: Đánh dấu JPA Entity đóng vai trò bảng danh mục Vai trò (Role) cho RBAC động trong DB.
- **Hành vi Runtime**: DynamicDatabaseRbacProviderHelper lưu cache role-permission trong Caffeine theo TTL và tự xóa cache khi DB thay đổi.
- **Cách sử dụng**: Gắn `@SecurityRoleEntity` lên JPA Entity bảng Vai trò, bắt buộc gắn `@RoleCode` lên trường mã role (tùy chọn thêm `@RoleName`, `@RolePermissions`).
- **Khi nào NÊN sử dụng**: Dùng khi hệ thống cho phép Admin tạo/sửa/xóa Role động lưu trong Database (thay vì khai báo Role cố định trong code Java).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG quên gắn `@RoleCode` (`EntityFailFastValidatorUtil` sẽ đánh rớt lúc boot!) và không gắn trên nhiều bảng Role trùng nhau.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị giây; vd. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Thời gian sống TTL (giây) của Caffeine L1 Snapshot trước khi nạp lại từ DB (mặc định 60s, tự xóa ngay khi bảng Role thay đổi).<br/>*Lưu ý:* TTL ngắn giúp cập nhật quyền từ DB nhanh hơn nhưng tăng truy vấn; TTL dài giảm tải DB nhưng làm chậm thời điểm thu hồi quyền tới khi hết hạn. |

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
- **Mục đích**: Ánh xạ cột mã vai trò duy nhất bên trong thực thể @SecurityRoleEntity.
- **Hành vi Runtime**: Đọc nhanh qua LambdaAccessorUtil để đối chiếu với danh sách GrantedAuthority của người dùng.
- **Cách sử dụng**: Gắn `@RoleCode` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityRoleEntity` (BẮT BUỘC: mã role, tự động chuẩn hóa tiền tố ROLE_).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@RoleCode` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Xác định trường tên hiển thị dễ đọc của vai trò trên thực thể @SecurityRoleEntity.
- **Hành vi Runtime**: Hiển thị trong siêu dữ liệu chẩn đoán RBAC và công cụ kiểm tra tại Dev Studio.
- **Cách sử dụng**: Gắn `@RoleName` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityRoleEntity` (tên hiển thị tùy chọn của Role).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@RoleName` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Đánh dấu trường chứa tập hợp hoặc chuỗi CSV các mã quyền được cấp cho vai trò.
- **Hành vi Runtime**: Được phân tích động và mở rộng thành tập quyền hiệu lực trong SecurityIdentityCustomizer.
- **Cách sử dụng**: Gắn `@RolePermissions` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityRoleEntity` (chuỗi, tập hợp chuỗi hoặc danh sách Permission entity liên kết với Role).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@RolePermissions` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Mục đích**: Đánh dấu JPA Entity lưu trữ quyền theo cặp tài nguyên-hành động và quy tắc che trường dữ liệu động.
- **Hành vi Runtime**: Nạp vào DatabaseRbacRuleMatcherHelper để kiểm soát CRUD theo tài nguyên và che cột sau truy vấn.
- **Cách sử dụng**: Gắn `@SecurityPermissionEntity` lên Entity bảng Quyền, bắt buộc có `@PermissionCode` (khuyến nghị thêm `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`).
- **Khi nào NÊN sử dụng**: Dùng khi phân quyền chi tiết theo Resource + Action (`product:read`, `order:write`) hoặc mặt nạ che trường dữ liệu trong Database.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG bỏ sót `@PermissionCode` (sẽ lỗi boot fail-fast) và không gắn lên nhiều bảng Permission cùng lúc.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị giây; vd. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Thời gian TTL (giây) của Caffeine Snapshot trước khi nạp lại danh mục quyền.<br/>*Lưu ý:* TTL ngắn giúp cập nhật quyền từ DB nhanh hơn nhưng tăng truy vấn; TTL dài giảm tải DB nhưng làm chậm thời điểm thu hồi quyền tới khi hết hạn. |

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
- **Mục đích**: Xác định trường mã quyền duy nhất bên trong thực thể @SecurityPermissionEntity.
- **Hành vi Runtime**: Đối chiếu trực tiếp với quyền của người dùng và mảng @EntitySecurity.permissions().
- **Cách sử dụng**: Gắn `@PermissionCode` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPermissionEntity` (BẮT BUỘC: mã quyền duy nhất (vd. "product:read")).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPermissionEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PermissionCode` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPermissionEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Ánh xạ tên thực thể hoặc tài nguyên API đích (hỗ trợ ký tự đại diện *) trong @SecurityPermissionEntity.
- **Hành vi Runtime**: DatabaseRbacRuleMatcherHelper so khớp không phân biệt hoa thường kèm hỗ trợ wildcard.
- **Cách sử dụng**: Gắn `@PermissionResource` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPermissionEntity` (tên thực thể mục tiêu hoặc "*" khớp mọi bảng).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPermissionEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PermissionResource` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPermissionEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Ánh xạ loại hành động CRUD hoặc hành động tùy biến chịu kiểm soát bởi @SecurityPermissionEntity.
- **Hành vi Runtime**: Tự động chuẩn hóa từ tên hàm controller thành nhóm READ, WRITE, DELETE hoặc hành động tùy biến.
- **Cách sử dụng**: Gắn `@PermissionAction` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPermissionEntity` (loại hành động: "READ", "WRITE", "DELETE" hoặc "*").
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPermissionEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PermissionAction` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPermissionEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Khai báo danh sách tên trường phân tách bởi dấu phẩy cần tự động che mờ theo quy tắc RBAC trong DB.
- **Hành vi Runtime**: Thực thi tự động song song với @FieldSecurity ngay trước khi tuần tự hóa phản hồi JSON.
- **Cách sử dụng**: Gắn `@PermissionFieldMask` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPermissionEntity` (danh sách tên field che mờ tùy chọn cách nhau dấu phẩy).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPermissionEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PermissionFieldMask` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPermissionEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Mục đích**: Ánh xạ JPA Entity gán vai trò DB cho từng chủ thể người dùng kèm phạm vi tenant tùy chọn.
- **Hành vi Runtime**: Tự động truy vấn lúc nạp JWT / SecurityContext thông qua SecurityIdentityCustomizer.
- **Cách sử dụng**: Gắn lên Entity trung gian gán quyền cho người dùng, kết hợp `@UserRoleSubject`, `@UserRoleCode` và tùy chọn `@UserRoleTenantId`.
- **Khi nào NÊN sử dụng**: Dùng khi token JWT chỉ mang `username`/`subject` và cần hệ thống tự động bổ sung các Role hiệu lực từ Database (kể cả phân tách theo Tenant).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG quên gắn `@UserRoleSubject`, và có thể tắt `enabled = false` nếu hệ thống hoàn toàn tin cậy claims tĩnh từ Keycloak/Auth0.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@SecurityUserRoleEntity(enabled = true)` | Cờ bật/tắt việc nạp danh sách gán Role theo User từ bảng này (mặc định `true`).<br/>*Lưu ý:* Có thể tạm đặt `false` khi đang migrate bảng phân quyền để ngừng tra cứu DB mà vẫn duy trì xác thực qua role trong JWT. |

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
- **Mục đích**: Xác định trường định danh người dùng (JWT sub / username) trên thực thể @SecurityUserRoleEntity.
- **Hành vi Runtime**: So khớp với giá trị Authentication.getName() trong SecurityContext hiện tại.
- **Cách sử dụng**: Gắn `@UserRoleSubject` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityUserRoleEntity` (BẮT BUỘC: định danh user / JWT subject).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityUserRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@UserRoleSubject` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityUserRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Ánh xạ cột mã vai trò được gán cho người dùng trong @SecurityUserRoleEntity.
- **Hành vi Runtime**: Liên kết sang tập quyền của @SecurityRoleEntity tương ứng khi thẩm định truy cập.
- **Cách sử dụng**: Gắn `@UserRoleCode` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityUserRoleEntity` (mã vai trò được gán cho user).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityUserRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@UserRoleCode` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityUserRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Giới hạn phạm vi gán vai trò @SecurityUserRoleEntity theo mã tenant cụ thể (hoặc * toàn cục).
- **Hành vi Runtime**: Tự động lọc đối chiếu theo TenantContextHolder / header X-Tenant-ID trên từng HTTP request.
- **Cách sử dụng**: Gắn `@UserRoleTenantId` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityUserRoleEntity` (mã Tenant tùy chọn giới hạn phạm vi gán role này).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityUserRoleEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@UserRoleTenantId` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityUserRoleEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Mục đích**: Đánh dấu JPA Entity lưu các chính sách ALLOW / DENY tường minh sắp xếp theo độ ưu tiên priority.
- **Hành vi Runtime**: Quy tắc DENY tường minh luôn thắng ALLOW một cách tất định trước khi chạy bất kỳ câu SQL nào.
- **Cách sử dụng**: Gắn lên Entity lưu quy tắc Allow/Deny theo bảng-hành động, bắt buộc có `@PolicyAllowedRoles` kèm `@PolicyResource`, `@PolicyAction`, `@PolicyEffect` (`"ALLOW"` hoặc `"DENY"`).
- **Khi nào NÊN sử dụng**: Dùng khi cần rule động trong DB ghi đè hoặc bổ sung cho `@EntitySecurity` tĩnh (như công tắc `DENY` khẩn cấp hoặc cấp quyền tạm thời theo nghiệp vụ).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG bỏ sót `@PolicyAllowedRoles` (sẽ lỗi khởi động!), và lưu ý rule `"DENY"` luôn thắng `"ALLOW"` nếu cùng khớp.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Không (Tùy chọn) | Số dương (`>= 0`) tính theo đơn vị mức độ ưu tiên số nguyên; vd. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Độ ưu tiên khi có nhiều rule trùng điều kiện (số càng nhỏ ưu tiên càng cao, mặc định `100`).<br/>*Lưu ý:* Số nhỏ hơn có độ ưu tiên cao hơn khi nhiều chính sách DB khớp cùng một Entity/trường (vd. `10` ghi đè mặc định `100`). |

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
- **Mục đích**: Ánh xạ mẫu định danh tài nguyên đích trong thực thể @SecurityPolicyEntity.
- **Hành vi Runtime**: Hỗ trợ cả khớp chính xác tên thực thể/tài nguyên lẫn ký tự đại diện *.
- **Cách sử dụng**: Gắn `@PolicyResource` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPolicyEntity` (tên thực thể/tài nguyên (hoặc "*") mà rule áp dụng).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPolicyEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PolicyResource` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPolicyEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Ánh xạ thao tác chịu kiểm soát (READ, WRITE, DELETE, methodName, *) trong @SecurityPolicyEntity.
- **Hành vi Runtime**: Được thẩm định theo từng thao tác HTTP trước khi chuyển vào tầng Service.
- **Cách sử dụng**: Gắn `@PolicyAction` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPolicyEntity` (hành động ("READ", "WRITE", "DELETE" hoặc "*")).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPolicyEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PolicyAction` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPolicyEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Ánh xạ tập hợp hoặc danh sách vai trò phân tách dấu phẩy chịu tác động của @SecurityPolicyEntity.
- **Hành vi Runtime**: Đối chiếu giao thoa với cả quyền trong JWT lẫn vai trò nạp động từ bảng @SecurityUserRoleEntity.
- **Cách sử dụng**: Gắn `@PolicyAllowedRoles` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPolicyEntity` (BẮT BUỘC: danh sách vai trò (chuỗi hoặc Collection) mà rule áp dụng).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPolicyEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PolicyAllowedRoles` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPolicyEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Mục đích**: Chỉ định kết quả quyết định ALLOW hoặc DENY của chính sách @SecurityPolicyEntity.
- **Hành vi Runtime**: Bất kỳ quy tắc DENY nào khớp đều lập tức ngắt yêu cầu với lỗi HTTP 403 AccessDeniedBusinessException.
- **Cách sử dụng**: Gắn `@PolicyEffect` lên field hoặc hàm getter bên trong JPA Entity có `@SecurityPolicyEntity` (hiệu lực quy tắc: `"ALLOW"` hoặc `"DENY"`).
- **Khi nào NÊN sử dụng**: Dùng để ánh xạ linh hoạt tên cột tự đặt trong bảng `@SecurityPolicyEntity` vào bộ nạp quyền DB-RBAC mà không ép đổi tên bảng/cột vật lý.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn trùng `@PolicyEffect` lên nhiều trường trong cùng class, và không gắn trên bảng không có `@SecurityPolicyEntity`.

> **Marker Annotation**: Annotation đánh dấu thuần túy — không khai báo thuộc tính nào.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Nhóm Chịu Tải, Cache, Đa Nguồn Dữ Liệu & Sự Kiện (13 Annotations)

### `@DistributedLock`

- **Package**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Mục đích**: Tuần tự hóa truy cập đồng thời qua khóa SpEL lưu trong cache AST (mặc định waitTimeMs=3000L, leaseTimeMs=5000L).
- **Hành vi Runtime**: DistributedLockAspect ném ngoại lệ DistributedLockAcquisitionException (HTTP 409) khi hết thời gian chờ.
- **Cách sử dụng**: Đặt lên phương thức thuộc Spring `@Service` (class không `final` để CGLIB AOP bọc được); khi chạy nhiều pod cần cài thêm bean Redis cho SPI `DistributedLockProvider`.
- **Khi nào NÊN sử dụng**: Dùng khi chống bán lố tồn kho, trừ tiền ví song song hoặc chặn nhiều luồng tranh chấp cùng một mã nghiệp vụ.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG mặc định rằng Caffeine + `ReentrantLock` mặc định có thể khóa giữa nhiều server/pod khác nhau mà không cấu hình `DistributedLockProvider` (Redis); cũng không gắn lên `final class` khiến Spring AOP lỗi khởi động.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Không (Tùy chọn) | Biểu thức SpEL tham chiếu tham số hàm (vd. `"'inventory:' + #skuId"`) hoặc để trống `""` để tự sinh khóa từ lớp và tham số.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Biểu thức SpEL tạo khóa lock (vd. `"'sku:' + #skuCode"`). Rỗng lấy theo chữ ký hàm.<br/>*Lưu ý:* Luôn thu hẹp khóa theo ID tài nguyên cụ thể (vd. `#id` hoặc `#request.sku`); khóa cố định sẽ ép toàn bộ hệ thống chạy tuần tự gây nghẽn cổ chai. |
| `waitTimeMs` | `long` | `3000L` | Không (Tùy chọn) | Số dương (`>= 0`) tính theo đơn vị mili-giây; vd. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Thời gian chờ tối đa (ms) để giành quyền lock trước khi báo lỗi (`3000L` = 3 giây).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: quá ngắn dễ gây lỗi 409 tranh chấp khóa giả; quá dài làm nghẽn luồng xử lý khi tải tăng đột biến. |
| `leaseTimeMs` | `long` | `5000L` | Không (Tùy chọn) | Số dương (`>= 100`) tính theo đơn vị mili-giây; vd. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Thời hạn giữ lock tối đa (ms) chống treo mutex (`5000L` = 5 giây).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: phải lớn hơn thời gian p99 của giao dịch, nếu không khóa sẽ tự nhả giữa chừng gây ghi đè dữ liệu. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Ngăn chặn ghi trùng lặp do bấm đúp đồng thời hoặc phát lại yêu cầu trong khoảng TTL.
- **Hành vi Runtime**: Thực thi qua IdempotencyAspect + ProxyIdempotencyGuardHelper dùng khóa Caffeine TTL (ném ConflictBusinessException HTTP 409); bỏ qua khi thiếu header và có IdempotencyManagerHelper hỗ trợ SHA-256 tùy chọn.
- **Cách sử dụng**: Gắn lên hàm/interface `@AutoRestController` hoặc phương thức thuộc Spring `@Service` không `final`; nếu thực thi lỗi, framework tự giải phóng khóa để client retry an toàn.
- **Khi nào NÊN sử dụng**: Dùng cho API thanh toán, chuyển tiền hoặc tạo đơn hàng có nguy cơ bị bấm đúp (double-submit) hoặc retry mạng.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên hàm GET, không gắn trên `@CustomEndpoint` (nếu cần AspectJ hãy gắn thẳng vào hàm trong Bean được ủy quyền), và nhớ thay SPI `IdempotencyStoreProvider` sang Redis nếu chạy nhiều pod.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Không (Tùy chọn) | Tên HTTP Header hợp lệ (không phân biệt hoa/thường trên giao thức mạng, vd. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Tên HTTP Header chứa khóa chống trùng lặp (mặc định `"X-Idempotency-Key"`; thiếu hoặc rỗng sẽ bỏ qua).<br/>*Lưu ý:* Client cần gửi 1 mã UUIDv7 duy nhất cho mỗi giao dịch và gửi lại đúng mã đó khi retry mạng; nhớ mở header này trong CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị giây; vd. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Thời gian ghi nhớ khóa chống trùng lặp tính bằng giây; gửi trùng trong khoảng này trả về `HTTP 409 Conflict` (`300L`).<br/>*Lưu ý:* Thời gian lưu giữ phản hồi chống trùng lặp trên Redis/RAM; đặt `300L–86400L` tùy chu kỳ retry (vd. 24 giờ cho thanh toán). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Giới hạn tần suất yêu cầu theo cửa sổ trượt phân tách theo IP, User hoặc Tenant.
- **Hành vi Runtime**: Tăng bộ đếm nwvmc.ratelimit.rejected.total và trả về HTTP 429 Too Many Requests.
- **Cách sử dụng**: Đặt lên interface Controller (`TYPE`) hoặc từng hàm (`METHOD`); phản hồi hợp lệ trả `X-RateLimit-Remaining` + `X-RateLimit-Reset`, vượt ngưỡng trả `HTTP 429` kèm `Retry-After` chuẩn RFC 6585.
- **Khi nào NÊN sử dụng**: Dùng để bảo vệ các endpoint công khai, đăng nhập/token, truy vấn AI hoặc Export/Import dữ liệu lớn tránh spam và cạn kiệt CPU/DB.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG đặt quá chặt cho health-check nội bộ và tránh dùng `partitionKey = "GLOBAL"` khi cần cô lập từng user/tenant (hãy dùng `"USER"`, `"TENANT"`, `"IP"` hoặc SpEL `#expr`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị lượt gọi; vd. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Số lượng request tối đa trong mỗi cửa sổ thời gian (mặc định `60`).<br/>*Lưu ý:* Tự đính kèm header `X-RateLimit-Remaining`, `X-RateLimit-Reset` và `Retry-After` chuẩn RFC 6585 khi trả HTTP `429 Too Many Requests`. |
| `windowSeconds` | `int` | `60` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị giây; vd. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Độ dài cửa sổ thời gian tính bằng giây (mặc định `60`).<br/>*Lưu ý:* Xác định độ dài cửa sổ đếm giới hạn, đồng thời quyết định giá trị `X-RateLimit-Reset` và số giây `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Chiến lược chia nhóm đếm quota (không phân biệt hoa/thường): `"IP"`/`"clientIp"`, `"USER"` (tự fallback về IP nếu chưa đăng nhập), `"TENANT"`, `"GLOBAL"` hoặc SpEL `"#expr"`.<br/>*Lưu ý:* `"USER"` phân vùng theo tài khoản đăng nhập và tự dự phòng sang IP nếu chưa đăng nhập; `"GLOBAL"` dùng chung 1 hạn mức cho toàn bộ hệ thống (cân nhắc kỹ trên API công khai). |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Bọc luồng xử lý trong Resilience4j Circuit Breaker kèm báo cáo telemetry tới Actuator & Micrometer.
- **Hành vi Runtime**: Ngắt mạch sang OPEN (HTTP 503) khi tỷ lệ lỗi vượt ngưỡng và cập nhật gauge trạng thái Micrometer.
- **Cách sử dụng**: Gắn lên `@AutoRestController` hoặc hàm có tương tác DB/API/AI rủi ro cao để cô lập lỗi dây chuyền bằng Resilience4j (`503` khi mở mạch).
- **Khi nào NÊN sử dụng**: Dùng khi cần fail-fast (`HTTP 503`) ngay lập tức nếu dịch vụ phụ thuộc/DB phụ đang chập chờn để tránh treo Virtual Threads.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: `CircuitBreakerErrorFilterUtil` đã tự động bỏ qua mọi `BaseBusinessException` 4xx (`400`/`401`/`403`/`404`/`409`); KHÔNG bọc lỗi người dùng trong `RuntimeException` thô (500) để tránh làm nhảy ngắt mạch (`503`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"payment-gateway-cb"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Tên định danh CircuitBreaker trong Resilience4j (rỗng tự đặt theo Entity).<br/>*Lưu ý:* Định danh tên circuit breaker trong Resilience4j và nhãn metric Micrometer; để trống `""` sẽ tự lấy theo tên lớp. |
| `failureRateThreshold` | `float` | `50.0f` | Không (Tùy chọn) | Số dương (`1.0f .. 100.0f`) tính theo đơn vị phần trăm; vd. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Tỷ lệ lỗi phần trăm làm cầu dao nhảy sang trạng thái ngắt mạch `OPEN` (`50.0f` = 50%).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: các lỗi nghiệp vụ 4xx (`BaseBusinessException`) tự động được bỏ qua; chỉ lỗi 5xx hoặc lỗi hạ tầng mới tính vào tỷ lệ ngắt mạch. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị giây; vd. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Số giây duy trì trạng thái ngắt mạch (`HTTP 503`) trước khi mở thăm dò `HALF_OPEN` (mặc định `10` giây).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: các lỗi nghiệp vụ 4xx (`BaseBusinessException`) tự động được bỏ qua; chỉ lỗi 5xx hoặc lỗi hạ tầng mới tính vào tỷ lệ ngắt mạch. |
| `slidingWindowSize` | `int` | `20` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị lượt gọi; vd. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Kích thước cửa sổ trượt đếm số lượng lời gọi gần nhất để tính tỷ lệ lỗi (mặc định `20`).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: các lỗi nghiệp vụ 4xx (`BaseBusinessException`) tự động được bỏ qua; chỉ lỗi 5xx hoặc lỗi hạ tầng mới tính vào tỷ lệ ngắt mạch. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị lượt gọi; vd. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Số lượng request thử nghiệm cho phép đi qua ở trạng thái `HALF_OPEN` để khôi phục mạch (`5`).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: các lỗi nghiệp vụ 4xx (`BaseBusinessException`) tự động được bỏ qua; chỉ lỗi 5xx hoặc lỗi hạ tầng mới tính vào tỷ lệ ngắt mạch. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Tự động thử lại các lỗi tạm thời theo độ trễ lũy thừa có thể cấu hình.
- **Hành vi Runtime**: Ném ngoại lệ chuẩn hóa nếu đã thử hết toàn bộ số lần cấu hình.
- **Cách sử dụng**: Đặt lên `@AutoRestController` hoặc phương thức để tự động thử lại khi gặp lỗi chập chờn tạm thời (network glitch, deadlock ngắn) theo thuật toán lùi dần hàm mũ.
- **Khi nào NÊN sử dụng**: Dùng cho các thao tác lũy đẳng (GET đọc dữ liệu, PUT hoặc các tác vụ ghi đã bọc sẵn `@Idempotent` an toàn).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG gắn lên lệnh POST tạo mới hoặc trừ tiền không có `@Idempotent` (sẽ gây trùng đơn/trừ tiền nhiều lần)! Cũng tránh đặt tổng thời gian chờ quá dài gây nghẽn HTTP request.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"erp-sync-retry"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Tên định danh Retry trong Resilience4j.<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: tổng thời gian qua các lần thử lại phải nhỏ hơn timeout của API Gateway/Nginx phía trước. |
| `maxAttempts` | `int` | `3` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị số lần thử; vd. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Tổng số lần thử tối đa tính cả lần gọi đầu tiên (mặc định `3`).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: tổng thời gian qua các lần thử lại phải nhỏ hơn timeout của API Gateway/Nginx phía trước. |
| `waitDurationMs` | `long` | `500L` | Không (Tùy chọn) | Số dương (`>= 50`) tính theo đơn vị mili-giây; vd. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Khoảng nghỉ ban đầu tính bằng ms trước lần thử lại thứ nhất (`500L`).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: tổng thời gian qua các lần thử lại phải nhỏ hơn timeout của API Gateway/Nginx phía trước. |
| `backoffMultiplier` | `double` | `2.0d` | Không (Tùy chọn) | Số dương (`>= 1.0d`) tính theo đơn vị hệ số nhân; vd. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Hệ số nhân giãn cách thời gian theo cấp số nhân giữa các lần thử (`2.0d`).<br/>*Lưu ý:* Cần tinh chỉnh sát với SLA độ trễ môi trường production: tổng thời gian qua các lần thử lại phải nhỏ hơn timeout của API Gateway/Nginx phía trước. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Package**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Tính toán weak ETag chuẩn RFC 7232 (W/"...") và trả về header Cache-Control kèm mã HTTP 304 Not Modified.
- **Hành vi Runtime**: Ghi nhận chỉ số HIT/MISS vào bộ đếm Micrometer nwvmc.cache.http.requests.
- **Cách sử dụng**: Gắn lên interface Controller hoặc phương thức GET chỉ đọc để tự động phát sinh header `Cache-Control`, `ETag` và phản hồi `304 Not Modified`.
- **Khi nào NÊN sử dụng**: Dùng cho danh mục ít thay đổi, dữ liệu tham chiếu hoặc danh sách sản phẩm công khai để tiết kiệm băng thông nhờ `HTTP 304`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG để mặc định `isPrivate = false` trên API chứa PII cá nhân, dữ liệu `@MultiTenant` hoặc `@FieldSecurity` (CDN dùng chung có thể trả nhầm cache của người này cho người khác)! Hãy đặt `isPrivate = true` hoặc không dùng `@HttpCacheable`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Không (Tùy chọn) | Số dương (`>= 0`) tính theo đơn vị giây; vd. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Thời gian cache trình duyệt/CDN `max-age` tính bằng giây (mặc định `60`).<br/>*Lưu ý:* Sinh header `Cache-Control: max-age=<N>`. Đặt `0` cùng `mustRevalidate = true` và `generateETag = true` để ép kiểm tra `304 Not Modified` ngay lập tức. |
| `isPrivate` | `boolean` | `false` | Không (Tùy chọn) | `true` (chỉ cache riêng trên trình duyệt, cấm CDN công cộng lưu) hoặc `false` (cache công khai cho phép CDN và reverse proxy lưu chung).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | `true` xuất `private` (chỉ cache ở trình duyệt, cấm CDN); `false` xuất `public`.<br/>*Lưu ý:* CỰC KỲ QUAN TRỌNG: Luôn đặt `isPrivate = true` cho endpoint có đăng nhập, đa tenant hoặc `@FieldSecurity` để chặn CDN trả nhầm dữ liệu của người dùng A cho người dùng B. |
| `mustRevalidate` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Nối thêm `, must-revalidate` ép trình duyệt/CDN kiểm tra lại nguồn gốc khi hết hạn.<br/>*Lưu ý:* Ép trình duyệt và proxy tuyệt đối không trả bản cache cũ sau khi hết `maxAgeSeconds` mà phải xác thực lại với server gốc. |
| `generateETag` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Tự tính mã băm SHA-256 ETag và trả ngay `HTTP 304 Not Modified` (rỗng body) nếu khớp header `If-None-Match`.<br/>*Lưu ý:* Sinh mã băm `ETag` chuẩn RFC 7232 từ dữ liệu phản hồi và tự trả `304 Not Modified` (0 byte) khi header `If-None-Match` trùng khớp. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Lưu đệm kết quả phương thức đọc phía server trong động cơ Caffeine L1 / Redis L2.
- **Hành vi Runtime**: Cấu hình linh hoạt toàn hệ thống qua khóa app.framework.cache.type.
- **Cách sử dụng**: Gắn lên hàm đọc dữ liệu trong Service (như `findById`), phối hợp cấu hình `app.framework.cache.type` (Caffeine hoặc Redis).
- **Khi nào NÊN sử dụng**: Dùng cho các truy vấn đọc nhiều ghi ít (tỷ lệ Read/Write cao, như đọc chi tiết theo UUID hoặc metadata) có bản sao cách ly an toàn.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG gắn lên bảng ghi liên tục (write-heavy), và tuyệt đối không làm biến đổi trực tiếp đối tượng trả về từ cache nếu không qua bước clone (`EntityCloneSnapshotHelper`).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Tên vùng nhớ đệm cache (`cacheNames`), điều phối tự động qua Caffeine L1 hoặc Redis L2 theo `app.framework.cache.type`.<br/>*Lưu ý:* Tên vùng cache phải khớp cấu hình Caffeine/Redis; luôn gắn `@AutoCacheEvict` tương ứng ở các hàm ghi/xóa để chống dữ liệu cũ (stale cache). |
| `key` | `String` | `""` | Không (Tùy chọn) | Biểu thức SpEL tham chiếu tham số hàm (vd. `"'product:' + #id"`) hoặc để trống `""` để tự sinh khóa từ lớp và tham số.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Biểu thức SpEL tạo khóa cache (`v0.1.0` giải quyết lỗi truy cập `Class` và tạo key chuẩn `EntityName:id` tách biệt theo từng Entity).<br/>*Lưu ý:* Trong hệ thống đa khách hàng (multi-tenant), bắt buộc ghép `tenantId` vào khóa cache để ngăn rò rỉ dữ liệu giữa các tenant. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Tự động xóa các mục cache cũ phía server ngay khi dữ liệu thay đổi.
- **Hành vi Runtime**: Chạy dứt điểm sau khi ghi thành công, tránh trả nhầm dữ liệu cũ.
- **Cách sử dụng**: Đặt lên các hàm cập nhật/xóa (`update`, `delete`) khớp khóa key với `@AutoCacheable` để tránh dữ liệu cũ.
- **Khi nào NÊN sử dụng**: Dùng đi kèm ở mọi luồng sửa/xóa bản ghi đang được cache bởi `@AutoCacheable`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG bật `allEntries = true` bừa bãi trên hàm `create` (gây bão truy vấn Cache Stampede dội thẳng xuống DB; `v0.1.0` đã gỡ trên `create` của CRUD mặc định).

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Tên vùng nhớ cache sẽ bị xóa sau khi thao tác ghi hoàn thành.<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `value` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `key` | `String` | `""` | Không (Tùy chọn) | Biểu thức SpEL tham chiếu tham số hàm (vd. `"'product:' + #id"`) hoặc để trống `""` để tự sinh khóa từ lớp và tham số.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Biểu thức SpEL định vị đúng key bản ghi bị sửa để xóa cục bộ (vd. `EntityName:id`).<br/>*Lưu ý:* Phải sinh đúng định dạng khóa khớp tuyệt đối với `@AutoCacheable.key`; bị bỏ qua khi `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Không (Tùy chọn) | `true` (xóa toàn bộ khóa trong vùng cache đích) hoặc `false` (chỉ xóa đúng 1 mục được xác định bởi thuộc tính key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Khi `true`, dọn sạch các mục theo tiền tố của đúng Entity bị tác động (`v0.1.0` không còn xóa nhầm Entity khác).<br/>*Lưu ý:* Xóa sạch cả vùng cache dưới tải cao dễ gây hiệu ứng sập tải DB (cache stampede); ưu tiên xóa đích danh theo `key` bất cứ khi nào có thể. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Đo thời gian thực thi và tự động ghi log WARN khi thao tác chậm vượt ngưỡng.
- **Hành vi Runtime**: Đồng thời đẩy số liệu độ trễ vào Micrometer Timer thông qua DynamicEntityMetricsHelper.
- **Cách sử dụng**: Gắn lên `@AutoRestController` hoặc hàm dịch vụ (`warningThresholdMs = 300`) để phát hiện sớm API vi phạm SLA.
- **Khi nào NÊN sử dụng**: Dùng cho các endpoint báo cáo nặng, batch processing, GraphQL và `@CustomQuery` để cảnh báo sớm truy vấn DB chậm.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG đặt `warningThresholdMs = 0` ở môi trường production (gây rác log WARN cho mọi request) và không gắn lên luồng kết nối dài hạn SSE `/events`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Không (Tùy chọn) | Số dương (`>= 1`) tính theo đơn vị mili-giây; vd. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Ngưỡng thời gian (ms) mà nếu vượt quá sẽ ghi cảnh báo slow-execution WARN log (`500L`).<br/>*Lưu ý:* Tự ghi log `WARN` kèm `traceId` và thời gian thực thi khi vượt ngưỡng; chọn mức thực tế (`200L–1000L`) tránh làm ngập ổ đĩa log. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Package**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Mục đích**: Gửi webhook bất đồng bộ ký chữ ký HMAC-SHA256 trên Virtual Threads sau khi commit.
- **Hành vi Runtime**: Tính chữ ký tại WebhookHmacSignerHelper và đối chiếu an toàn theo thời gian hằng số.
- **Cách sử dụng**: Gắn trực tiếp lên lớp JPA `@Entity`; webhook luôn chạy bất đồng bộ SAU KHI Transaction commit thành công qua Transactional Outbox.
- **Khi nào NÊN sử dụng**: Dùng khi cần bắn HTTP Callback có chữ ký bảo mật sang hệ thống đối tác/SaaS ngay khi đơn hàng hoặc thanh toán vừa commit thành công.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: Đặt `includeFullPayload = false` nếu Entity có dữ liệu thẻ/PII tối mật, và tuyệt đối chặn URL đích nội bộ để phòng chống SSRF.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Không (Tùy chọn) | Mảng chứa không hoặc nhiều giá trị hợp lệ: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Danh sách các sự kiện kích hoạt đẩy Webhook ký HMAC (`CREATED`, `UPDATED`, `DELETED`, `STATE_CHANGED`).<br/>*Lưu ý:* Được phát bất đồng bộ sau khi giao dịch DB commit (`AFTER_COMMIT`), bảo đảm giao dịch bị rollback tuyệt đối không bắn webhook ma. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Không (Tùy chọn) | Tên HTTP Header hợp lệ (không phân biệt hoa/thường trên giao thức mạng, vd. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Tên header chứa chữ ký xác thực HMAC-SHA256 (mặc định `"X-Webhook-Signature"`).<br/>*Lưu ý:* Chứa chữ ký HMAC-SHA256 của payload; phía đối tác nhận bắt buộc xác minh chữ ký bằng so sánh hằng thời gian (constant-time) trước khi xử lý. |
| `includeFullPayload` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@EntityWebhook(includeFullPayload = false)` | `true` gửi kèm toàn bộ JSON thực thể đã mask; `false` chỉ gửi `id` và loại sự kiện (tối ưu bảo mật).<br/>*Lưu ý:* Nên đặt `false` (chỉ gửi ID + loại sự kiện) với Entity chứa PII/tài chính để đối tác tự gọi GET có xác thực nhằm tuân thủ bảo mật dữ liệu. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Package**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Phát sự kiện chuẩn CNCF CloudEvents v1.0 ngay sau khi giao dịch commit thành công.
- **Hành vi Runtime**: Tuân thủ TransactionRuntimeBridge.executeAfterCommit để loại bỏ sự kiện ảo khi rollback.
- **Cách sử dụng**: Đặt lên Entity hoặc hàm Controller để phát phong bì sự kiện chuẩn CloudEvents v1.0 (`CloudEventEnvelopeDto`) sau khi Transaction commit.
- **Khi nào NÊN sử dụng**: Dùng làm xương sống giao tiếp liên module (`order` -> `notification`) trong kiến trúc Modular Monolith sẵn sàng tách Microservices mà không JOIN bảng chéo domain.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG nhầm với `@EntityWebhook` đẩy HTTP ra ngoài, và lưu ý listener bắt buộc lắng nghe ở pha `AFTER_COMMIT` để tránh đọc dữ liệu chưa commit hoặc bị rollback.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Không (Tùy chọn) | Chuỗi định danh hợp lệ (vd. `"com.acme.order.lifecycle"`); để trống `""` sẽ dùng quy ước mặc định của framework.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Loại sự kiện chuẩn CNCF CloudEvents (vd. `"io.nwvmc.order.created"`).<br/>*Lưu ý:* Tuân chuẩn đặt tên reverse-DNS của CloudEvents 1.0 (`com.company.domain.event`); để trống `""` sẽ tự sinh từ package và tên Entity. |
| `source` | `String` | `""` | Không (Tùy chọn) | Đường dẫn HTTP hợp lệ bắt đầu bằng `/` (vd. `/services/order-api`) hoặc chuỗi rỗng `""` để framework tự sinh.<br/>`@PublishCloudEvent(source = "/services/order-api")` | Đường dẫn URI `source` định danh Bounded Context phát ra sự kiện.<br/>*Lưu ý:* Gán thuộc tính URI `source` chuẩn CNCF CloudEvents 1.0 giúp truy vết nguồn gốc sự kiện giữa các microservice. |
| `publishOnCreate` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Tự động phát CloudEvent sau khi tạo mới thành công (mặc định `true`).<br/>*Lưu ý:* Chỉ phát sau khi giao dịch DB commit (`AFTER_COMMIT`) qua Spring `ApplicationEventPublisher` / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Tự động phát CloudEvent sau khi cập nhật thành công (mặc định `true`).<br/>*Lưu ý:* Đặt `false` với các Entity cập nhật liên tục (như bộ đếm lượt xem) để tránh làm quá tải Kafka/RabbitMQ phía sau. |
| `publishOnDelete` | `boolean` | `true` | Không (Tùy chọn) | `true` (bật) hoặc `false` (tắt).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Tự động phát CloudEvent sau khi xóa thành công (mặc định `true`).<br/>*Lưu ý:* Kích hoạt cho cả xóa cứng và xóa mềm `BaseAuditEntity.deleted` để các hệ thống tìm kiếm/read-model phía sau đồng bộ kịp thời. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Gắn thao tác thực thể hoặc truy vấn vào một khóa Datasource logic chỉ định.
- **Hành vi Runtime**: Ghi nhận số lần định tuyến vào bộ đếm Micrometer framework.datasource.routing.total.
- **Cách sử dụng**: Đặt lên `@AutoRestController` hoặc phương thức Spring `@Service` (class không `final`). Context cũ tự động được khôi phục trong `finally` để không rò rỉ ThreadLocal.
- **Khi nào NÊN sử dụng**: Dùng để phân tách luồng Đọc/Ghi (CQRS): đẩy báo cáo BI/phân tích nặng sang node `REPLICA` mà giữ giao dịch ghi ở `PRIMARY`.
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: TUYỆT ĐỐI KHÔNG gọi chuyển `@TargetDataSource` vào giữa một hàm đã mở sẵn `@Transactional` (JDBC connection đã bị khóa ngay từ lúc bắt đầu transaction!) và không gắn lên `final class`.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Khóa định tuyến pool kết nối DB vào `DataSourceContextHolder` (mặc định `"PRIMARY"`, vd. `"REPLICA"`).<br/>*Lưu ý:* Phải khớp chính xác khóa đã đăng ký trong `DynamicRoutingDataSource`; khóa không tồn tại sẽ quay về `PRIMARY` hoặc fail-fast theo cấu hình. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Mục đích**: Chỉ định họ động cơ CSDL và phân mảnh cụm logic cho từng thực thể.
- **Hành vi Runtime**: Phân giải động lúc chạy qua MultiPlatformDataSourceRegistryHelper và TenantDatabaseRoutingResolverHelper.
- **Cách sử dụng**: Đặt lên JPA `@Entity` hoặc hàm để khai báo rõ engine/cluster DB mục tiêu cho Studio và hạ tầng đa CSDL.
- **Khi nào NÊN sử dụng**: Dùng trong hệ thống Polyglot Persistence tách riêng cụm tài chính (`FINANCE_CLUSTER`), phân tích (`ANALYTICS_CLUSTER`) và lưu vết (`AUDIT_CLUSTER`).
- **Khi nào KHÔNG nên sử dụng & Lưu ý**: KHÔNG thay thế được cấu hình JDBC DataSource vật lý trong `application.yml`, và tuyệt đối không viết SQL/JPA JOIN nối bảng giữa hai entity ở 2 cluster khác nhau.

| Thuộc tính | Kiểu Java | Giá trị mặc định | Bắt buộc | Giá trị hợp lệ & Ví dụ | Mô tả & Lưu ý Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Loại engine Database mục tiêu (`"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`).<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `platform` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `cluster` | `String` | `"PRIMARY"` | Không (Tùy chọn) | Một trong các giá trị chuẩn được hỗ trợ: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Cụm DB hoặc shard mục tiêu (`"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`).<br/>*Lưu ý:* Được kiểm tra nghiêm ngặt ngay khi khởi động ứng dụng; sai chính tả hoặc giá trị `cluster` không hợp lệ sẽ fail-fast trước khi mở cổng đón request. |
| `readOnly` | `boolean` | `false` | Không (Tùy chọn) | `true` (định tuyến sang nhóm kết nối replica chỉ đọc) hoặc `false` (định tuyến sang kết nối master đọc/ghi chính).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Gợi ý ưu tiên định tuyến sang bản sao chỉ đọc (`read-only replica`) khi đặt `true`.<br/>*Lưu ý:* Tuyệt đối không đặt `readOnly = true` trên thao tác ghi (`POST`/`PUT`/`PATCH`/`DELETE`) vì DB replica sẽ từ chối lệnh ghi và Hibernate bỏ qua flush. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
