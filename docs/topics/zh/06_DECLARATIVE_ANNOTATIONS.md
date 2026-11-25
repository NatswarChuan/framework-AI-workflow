# 06. 全部 60 个声明式注解完整技术规范（`0.1.0`）

> **语言**: [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#annotations)

完整收录 `io.github.natswarchuan:spring-nwvmc:0.1.0` 全部 **60 个声明式注解**（直接提取自 Java `@interface` 源码）：精确包名、`@Target`、**全部属性**、Java 类型、解析后默认值、必填/可选标记、**使用方法**、**适用场景**、**不适用场景与常见陷阱**，以及经过实测验证的 Java 代码片段。

## 60 个注解速查索引

| 注解 | 分类 | `@Target` | 属性摘要 | 核心用途 |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | 将继承 AutoApiController<E> 的接口注册为拥有 40 个契约（Swagger UI 默认展示 38 项）的运行时 JDK 动态代理。 |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | 通过 MethodHandleCacheUtil 将单个声明的控制器方法直接路由到自定义 Spring Bean，绕过默认动态 CRUD。 |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | 将特定业务流程路由（结账、退款、审批）绑定到独立的 Spring @Component Helper Bean 执行。 |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | 零 Spring Web 编译依赖的纯 Java 注解，完全替代 @GetMapping。 |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 纯 Java HTTP POST 路由声明注解，支持自定义 consumes/produces 媒体类型。 |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 用于全量资源替换的纯 Java HTTP PUT 路由注解。 |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 纯 Java HTTP PATCH 声明，支持局部合并、原子自增与 RFC 6902 JSON Patch。 |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | 纯 Java HTTP DELETE 声明，触发带状态校验的软删除流程。 |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | 绑定 URL 查询参数或 Map<String, String> 动态过滤参数映射。 |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | 绑定 URI 路径变量（如 UUIDv7 实体主键 ID）。 |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | 将 HTTP JSON 请求体反序列化为 DTO 或 Entity 参数，并与 @Valid 协同触发校验。 |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | 允许通过 GET /{id}/{relation}/** 递归浏览子关联资源，并自动拦截循环引用。 |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | 在自定义动作方法上声明式定义领域状态流转或数值字段增减规则。 |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | 框架组件标记注解，在启动时自动注册 Bean 而无需编译期导入 @Component。 |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | 用于与 @ServiceOverride 配合的 ServiceImpl 服务实现类标记注解。 |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | 在 @AutoConfigurationBean 配置类中声明受管的 Bean 工厂方法。 |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | 标记配置类及 YAML 配置属性绑定模型，实现零 Spring 配置注解侵入。 |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | 控制 SPI Customizer 扩展点与过滤器链之间的执行优先级顺序。 |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | 在实体读写前强制执行 NIST Level 2 RBAC、记录级 ownerField 归属隔离及细粒度权限码校验。 |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | 当调用方角色权限不足时，在序列化前动态脱敏或置空敏感字段。 |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | 通过 POST /{id}/transition 强制执行合法状态机流转，并限制 DELETE /{id} 仅允许在 deletableStates 状态下执行。 |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | 将自然可读的策略条款直接编译为生效中的 RBAC 权限、状态机流转及字段脱敏规则。 |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | 记录跨变更的字段级差异，为时光机状态重建与 /diff 差异审计提供底层历史账本。 |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | 除非调用方具备绕过角色，否则自动按当前租户上下文隔离行级查询与写入。 |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | 在新增、更新与 Upsert 持久化前自动校验字段唯一性冲突。 |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | 当字段为空时，在创建或克隆实体时自动生成带前缀的唯一业务编码。 |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | 从 sourceField 自动标准化并生成适合 URL 的 ASCII Slug 短链标识。 |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | 在保存实体变更前自动计算衍生汇总数值（乘积、加减或子集合求和）。 |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | 支持将自定义原生 SQL、JPQL 或 SQL Provider Helper 方法绑定到控制器端点。 |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | 将 JPA 实体声明为数据库驱动 RBAC 角色目录主表。 |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射 @SecurityRoleEntity 中唯一的权限/角色编码字段。 |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 标识 @SecurityRoleEntity 中用于展示的可读角色名称字段。 |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 标记角色实体上存储已授予权限码集合或逗号分隔字符串的字段。 |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | 将 JPA 实体标记为存储资源-操作权限与动态字段脱敏规则的数据库权限表。 |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 指定 @SecurityPermissionEntity 中的唯一权限代码字段。 |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射 @SecurityPermissionEntity 中的目标实体名或 API 资源名（支持通配符 *）。 |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射受 @SecurityPermissionEntity 规则保护的逻辑 CRUD 或自定义操作动作动词。 |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 声明当此数据库权限规则命中时需要动态脱敏遮盖的逗号分隔实体字段名列表。 |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | 将 JPA 实体标记为关联用户主体、数据库角色与可选租户范围的动态授权映射表。 |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 标识 @SecurityUserRoleEntity 中的主体标识符（Authentication.getName() / JWT sub）字段。 |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 绑定 @SecurityUserRoleEntity 中分配给用户的角色编码字段。 |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 将 @SecurityUserRoleEntity 角色授权限定到指定租户 ID（或用 * 表示全局有效）。 |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | 将 JPA 实体标记为支持按 priority 排序的显式 ALLOW / DENY 动态授权策略表。 |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射 @SecurityPolicyEntity 中的目标资源匹配模式字段。 |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射 @SecurityPolicyEntity 中受控操作动作动词（READ、WRITE、DELETE 或 *）。 |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 映射 @SecurityPolicyEntity 策略规则所适用的角色集合或逗号分隔角色串字段。 |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | 指定 @SecurityPolicyEntity 规则匹配时的授权决策结果（ALLOW 或 DENY）。 |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | 基于 AST 缓存（上限 1024）解析 SpEL 锁键串行化并发访问（默认 waitTimeMs=3000L, leaseTimeMs=5000L）。 |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | 在可配置 TTL 窗口内防并发重复提交与请求重放。 |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | 按 IP、User 或 Tenant 维度实施滑动窗口请求限流。 |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | 使用 Resilience4j 熔断器保护实体操作，并向 Actuator 与 Micrometer 上报实时状态指标。 |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | 对瞬态故障自动实施可配置指数退避重试。 |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | 自动计算 RFC 7232 弱 ETag（W/"..."）并下发 Cache-Control 与 HTTP 304 Not Modified 条件缓存响应。 |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | 在 Caffeine L1 或 Redis L2 缓存引擎中缓存服务端只读方法返回值。 |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | 在数据发生写入变更时自动失效并清理过期缓存条目。 |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | 实时监测方法执行耗时，当慢调用超过阈值时自动输出 WARN 告警日志。 |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | 事务提交后在 Java 21 虚拟线程上异步发送经 HMAC-SHA256 签名的出站 Webhook。 |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | 在数据库事务提交后发布符合 CNCF CloudEvents v1.0 规范的事件信封。 |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | 将实体或查询操作动态绑定到指定名称的逻辑数据源标识。 |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | 为每个实体声明目标数据库引擎家族及逻辑集群分片属性。 |

---

## 1. 路由、动态 API 契约、DTO 解耦与参数绑定 (13 个注解)

### `@AutoRestController`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **核心用途**: 将继承 AutoApiController<E> 的接口注册为拥有 40 个契约（Swagger UI 默认展示 38 项）的运行时 JDK 动态代理。
- **运行时行为**: 启动时由 DynamicControllerProxyRegistrarHelper 扫描启用的控制器并将路由注册到 RequestMappingHandlerMapping。
- **使用方法**: 将该注解标注在继承 `AutoApiController<E>` 或 `AutoReadApi<E>` 等细粒度能力接口的 Java `interface` 上，设置 `basePath`，按需配置 `disabledEndpoints` 与 DTO 契约。
- **适用场景**: 当需要将 JPA 实体快速暴露为标准化 CRUD、分片分页、筛选、Keyset 游标或只读 API，且不想编写重复的 Controller/Service 样板代码时使用。
- **何时不适用及注意事项**: 不要标注在具体的 `@RestController` 实现类上，也不要用于完全脱离 JPA 实体的外部聚合网关。面向公共只读目录时，请继承 `AutoReadApi<E>` 而非开放全部 40 个契约的 `AutoApiController<E>`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | 否（可选） | 以 `/` 开头的合法 HTTP 路径（例如 `/api/v1/product-catalogs`），或空字符串 `""` 表示自动推导。<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | 显式根路径 URI（例如 "/api/v1/product-catalogs"）。留空时自动按控制器接口名称生成 kebab-case 复数路径。<br/>*注意:* 启动时代理注册器会优先解析 `basePath`，其次才是 `path`。请勿同时为两个属性设置冲突值。 |
| `path` | `String` | `""` | 否（可选） | 以 `/` 开头的合法 HTTP 路径（例如 `/api/v1/orders`），或空字符串 `""` 表示自动推导。<br/>`@AutoRestController(path = "/api/v1/orders")` | 基础路径兼容别名属性。建议优先使用 basePath，因为 DynamicControllerProxyRegistrarHelper 优先读取 extractCustomBasePath()。<br/>*注意:* 启动时代理注册器会优先解析 `basePath`，其次才是 `path`。请勿同时为两个属性设置冲突值。 |
| `entityName` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"ProductCatalog"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoRestController(entityName = "ProductCatalog")` | 覆盖 OpenAPI/Studio 元数据中展示的实体名称，默认使用泛型 E 的类名。<br/>*注意:* 直接展示在生成的 Swagger / OpenAPI 3.0 文档和 NWVMC Studio 中；请将文案提取至 `OpenApiConstant` 以遵循零硬编码规范。 |
| `enabledEndpoints` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`。<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | 精确允许暴露的契约方法名白名单（如 "getPage"、"create"）。为空数组时默认启用所继承接口的全部契约。<br/>*注意:* 作为严格白名单生效：非空时，未列入的 AutoApiController 方法均不会注册到 Spring MVC 与 Swagger UI。公开只读 API 建议优先使用。 |
| `disabledEndpoints` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`。<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | 在 MVC 映射前禁用的方法名黑名单（例如 "deleteById"、"batchChunked"、"importCsv"）。<br/>*注意:* 在 `enabledEndpoints` 之后生效；适合保留其余 40 个契约的同时，精准封禁删除或批量导入等高风险端点。 |
| `enableNestedSubResources` | `boolean` | `false` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | 开启递归子资源导航 GET /{id}/**。默认 false 以防止大型数据库模式产生过多冗余路由。<br/>*注意:* 除非明确需要 `GET /{id}/items/...` 级联子资源查询，否则保持 `false`；开启时建议配合 `@EnableNestedSubResource` 白名单防止路由膨胀与越权遍历。 |
| `readDto` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `ProductReadDto.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@AutoRestController(readDto = ProductReadDto.class)` | 可选读取投影 DTO，在序列化时剥离内部实体字段；默认值 Void.class 时直接返回实体。<br/>*注意:* 仅作用于 读取 (GET) 流水线；DTO 类需提供无参构造/访问器（或 Lombok `@Builder`），并自动兼容 Jakarta `@Valid` 与 `@FieldSecurity`。 |
| `createDto` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `ProductCreateDto.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | 可选创建入参 DTO，在 POST 写入前执行 Jakarta Validation 校验并映射为实体 E。<br/>*注意:* 仅作用于 创建 (POST) 流水线；DTO 类需提供无参构造/访问器（或 Lombok `@Builder`），并自动兼容 Jakarta `@Valid` 与 `@FieldSecurity`。 |
| `updateDto` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `ProductUpdateDto.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | 可选更新入参 DTO，限制 PUT/PATCH 允许修改的字段并执行 Bean Validation。<br/>*注意:* 仅作用于 更新 (PUT/PATCH) 流水线；DTO 类需提供无参构造/访问器（或 Lombok `@Builder`），并自动兼容 Jakarta `@Valid` 与 `@FieldSecurity`。 |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 通过 MethodHandleCacheUtil 将单个声明的控制器方法直接路由到自定义 Spring Bean，绕过默认动态 CRUD。
- **运行时行为**: EscapeHatchDispatchHelper 按 targetBean 类型或 beanName 解析目标 Bean，并在 MethodHandleCacheUtil 中缓存 MethodHandle。
- **使用方法**: 在 `@AutoRestController` 接口的方法（或接口本身）上添加 `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")`，并在目标类上标注 `@Component`/`@Service`。
- **适用场景**: 当 90% 的端点可复用自动 CRUD，仅少数方法（如重写 `create`、复杂统计或多服务编排）需要手写 Java 业务逻辑时使用。
- **何时不适用及注意事项**: 切勿将 `targetBean` 写成字符串（它要求 `Class<?>` 如 `MyHelper.class`，按名称查找请用 `beanName`）。若 `@HumanPolicy` 或 `@EntitySecurity` 已满足需求，也不应滥用覆盖。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `OrderCustomService.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | 目标 Spring Bean 类（优先级高于 beanName）。若存在多个实现类请配合 beanName 使用。<br/>*注意:* 启动时代理注册器会优先解析 `targetBean`，其次才是 `beanName`。请勿同时为两个属性设置冲突值。 |
| `beanName` | `String` | `""` | 否（可选） | ApplicationContext 中已注册的精确 Bean 名称（例如 `"orderCustomService"`），或 `""` 自动解析。<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | 当 targetBean 为 Void.class 时按 Spring 容器中的 Bean 名称查找目标实例。<br/>*注意:* 启动时代理注册器会优先解析 `targetBean`，其次才是 `beanName`。请勿同时为两个属性设置冲突值。 |
| `methodName` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"createOrder"`）；留空 `""` 则采用框架默认命名约定。<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | 目标 Bean 上的方法名；为空时默认匹配当前控制器接口的同名方法。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"createOrder"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `bypassAutoDispatch` | `boolean` | `true` | 否（可选） | `true`（绕过默认代理并直接调用目标 Bean）或 `false`（与默认调度协同执行）。<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | 为 true 时完全绕过默认 CRUD 分发，通过 MethodHandleCacheUtil 直接调用自定义 Bean。<br/>*注意:* 默认 `true` 会完全跳过内置 CRUD 处理器，由目标 Bean 接管事务与持久化；仅在需要环绕默认逻辑的钩子时设为 `false`。 |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 将特定业务流程路由（结账、退款、审批）绑定到独立的 Spring @Component Helper Bean 执行。
- **运行时行为**: 通过缓存的 MethodHandle 调用 delegateBean.delegateMethod，并完整包裹参数校验与事务边界。
- **使用方法**: 在控制器方法上配合 `@AutoGet`/`@AutoPost` 或通过 `path`/`httpMethod` 声明自定义端点，并利用 `delegateBean`/`delegateMethod` 委托到独立的 Spring Bean Helper。
- **适用场景**: 适用于挂载在实体控制器下的领域工作流动作，如结算、退款、审批、取消订单或跨实体事务流程。
- **何时不适用及注意事项**: 切勿依赖代理层的 `@Idempotent`/`@EntitySecurity` 拦截 `@CustomEndpoint`（它会先于 `invokeProtectedOperation` 由 `ControllerProxySpecialRouteUtil` 直接分发，请在被委托的 `@Component`/`@Service` 上配置 Spring AOP）；简单状态流转也请优先使用 `@BusinessAction`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/reports/monthly-sales`）；留空 `""` 绑定控制器根路径。<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | 相对于控制器 basePath 的子路径（例如 "/checkout"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `path` 配置会在接收流量前快速失败。 |
| `httpMethod` | `String` | `"GET"` | 否（可选） | 支持以下固定取值之一：`"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`。<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | 匹配的 HTTP 请求方法（"GET"、"POST"、"PUT"、"PATCH"、"DELETE"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `httpMethod` 配置会在接收流量前快速失败。 |
| `delegateBean` | `String` | `""` | 否（可选） | ApplicationContext 中已注册的精确 Bean 名称（例如 `"orderReportService"`），或 `""` 自动解析。<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | 执行业务编排的目标 Spring Bean 名称；除非接口拥有 default 实现或 @ServiceOverride，否则不能为空。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `delegateBean` 配置会在接收流量前快速失败。 |
| `delegateMethod` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"buildMonthlyReport"`）；留空 `""` 则采用框架默认命名约定。<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean 上的目标方法名；为空时默认采用当前控制器方法名。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"buildMonthlyReport"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `summary` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"Get monthly revenue breakdown"`）；留空 `""` 则采用框架默认命名约定。<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | 在 Swagger UI 中展示的简短 OpenAPI 3.0 操作摘要。<br/>*注意:* 直接展示在生成的 Swagger / OpenAPI 3.0 文档和 NWVMC Studio 中；请将文案提取至 `OpenApiConstant` 以遵循零硬编码规范。 |
| `description` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"Aggregates confirmed invoice totals grouped by currency"`）；留空 `""` 则采用框架默认命名约定。<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | 在 Swagger UI 中展开接口后显示的详细 OpenAPI 3.0 说明文档。<br/>*注意:* 直接展示在生成的 Swagger / OpenAPI 3.0 文档和 NWVMC Studio 中；请将文案提取至 `OpenApiConstant` 以遵循零硬编码规范。 |

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

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 零 Spring Web 编译依赖的纯 Java 注解，完全替代 @GetMapping。
- **运行时行为**: 在代理初始化阶段动态映射为 HTTP GET 的 RequestMappingInfo。
- **使用方法**: 在 `@AutoRestController` 接口内的方法上标注 `@AutoGet("/your-path")`，通常与 `@ServiceOverride` 或 `@CustomQuery` 配合使用。
- **适用场景**: 在 Pure Java 控制器接口中定义只读 HTTP GET 自定义路由且不想引入 Spring Web `@GetMapping` 时使用。
- **何时不适用及注意事项**: 切勿用于修改数据库或产生副作用的操作（请改用 `@AutoPost`/`@AutoPut`/`@AutoPatch`/`@AutoDelete`），也不要用于普通 `@RestController` 类。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/{id}/summary`）；留空 `""` 绑定控制器根路径。<br/>`@AutoGet("/{id}/summary")` | GET 路由模板相对路径（如 "/metrics"）。为空时直接映射到控制器的根路徑 basePath。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `produces` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json", "text/csv"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | 声明响应产出的 MIME 媒体类型数组（如 "text/event-stream"、"text/csv"）。<br/>*注意:* 由 Spring MVC 基于 HTTP `Accept` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 纯 Java HTTP POST 路由声明注解，支持自定义 consumes/produces 媒体类型。
- **运行时行为**: 通过 SpringMvcEndpointBridge 注册为 HTTP POST 处理器。
- **使用方法**: 在 `@AutoRestController` 接口内的方法上添加 `@AutoPost("/path")`，使用 `@AutoBody` 或 `@RequestBody` 绑定请求体，可与 `@BusinessAction` 或 `@ServiceOverride` 组合。
- **适用场景**: 用于 Pure Java 接口中的资源创建、业务命令动作、批量提交或工作流 POST 端点。
- **何时不适用及注意事项**: 不要用于只读查询（用 `@AutoGet`）、幂等全量替换（用 `@AutoPut`）、局部更新（用 `@AutoPatch`）或删除（用 `@AutoDelete`）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/{id}/approve`）；留空 `""` 绑定控制器根路径。<br/>`@AutoPost("/{id}/approve")` | 相对于控制器 basePath 的 POST 路径模板。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `consumes` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json", "multipart/form-data"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | 允许消费的请求 Content-Type（如 "application/json"、"multipart/form-data"）。<br/>*注意:* 由 Spring MVC 基于 HTTP `Content-Type` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |
| `produces` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | 响应输出的 MIME 类型数组（如 "application/json"）。<br/>*注意:* 由 Spring MVC 基于 HTTP `Accept` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 用于全量资源替换的纯 Java HTTP PUT 路由注解。
- **运行时行为**: 绑定为 HTTP PUT 处理器，并自动包裹在数据库事务内执行。
- **使用方法**: 在全量更新方法上使用 `@AutoPut("/{id}")`，搭配 `@AutoVariable UUID id` 与 `@AutoBody` 绑定更新载荷。
- **适用场景**: 用于幂等全量资源替换，或需要提交完整状态的自定义 PUT 操作。
- **何时不适用及注意事项**: 局部字段更新或状态转换请改用 `@AutoPatch` 或 `@BusinessAction`；更新实体时注意 `@Version` 乐观锁冲突会返回 HTTP `409`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/{id}/replace`）；留空 `""` 绑定控制器根路径。<br/>`@AutoPut("/{id}/replace")` | 相对于 basePath 的 PUT 路径模板（如 "/{id}"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `consumes` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | 允许消费的请求 Content-Type 列表。<br/>*注意:* 由 Spring MVC 基于 HTTP `Content-Type` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |
| `produces` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | 输出的响应 MIME 类型列表。<br/>*注意:* 由 Spring MVC 基于 HTTP `Accept` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 纯 Java HTTP PATCH 声明，支持局部合并、原子自增与 RFC 6902 JSON Patch。
- **运行时行为**: 原生兼容标准 JSON 合并语义与 application/json-patch+json 媒体类型。
- **使用方法**: 在局部更新方法或 `@BusinessAction` 状态动作方法上标注 `@AutoPatch("/{id}/action")`。
- **适用场景**: 适用于局部字段修改、原子计数器调整和状态机流转（`@StateMachine` + `@BusinessAction`）。
- **何时不适用及注意事项**: 需要严格全量替换时请用 `@AutoPut`；新建资源请用 `@AutoPost`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/{id}/status`）；留空 `""` 绑定控制器根路径。<br/>`@AutoPatch("/{id}/status")` | 相对于 basePath 的 PATCH 路径模板（如 "/{id}/approve"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `consumes` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json", "application/merge-patch+json"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | 允许消费的请求 Content-Type。<br/>*注意:* 由 Spring MVC 基于 HTTP `Content-Type` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |
| `produces` | `String[]` | `{}` | 否（可选） | MIME 媒体类型数组（例如 `{"application/json"}`）；空数组 `{}` 默认使用 `application/json`。<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | 响应输出 MIME 类型。<br/>*注意:* 由 Spring MVC 基于 HTTP `Accept` 执行内容协商；客户端头不匹配将返回 `406` 或 `415` 错误。 |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 纯 Java HTTP DELETE 声明，触发带状态校验的软删除流程。
- **运行时行为**: 在标记 deleted=true 之前严格验证 @StateMachine deletableStates 列表。
- **使用方法**: 在 `@AutoRestController` 接口的自定义删除方法上使用 `@AutoDelete("/{id}/custom")`，通常配合 `@ServiceOverride`。
- **适用场景**: 用于在控制器接口上声明自定义归档、逻辑删除或级联清理 DELETE 路由。
- **何时不适用及注意事项**: 若内置软删除（`DELETE /{id}`）配合 `@StateMachine(deletableStates = ...)` 和 `@EntitySecurity` 已能满足，切勿重复定义。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 相对子路径，支持 `{pathVar}` 路径模板（例如 `/{id}/archive`）；留空 `""` 绑定控制器根路径。<br/>`@AutoDelete("/{id}/archive")` | 相对于 basePath 的 DELETE 路径模板（如 "/{id}/purge"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **核心用途**: 绑定 URL 查询参数或 Map<String, String> 动态过滤参数映射。
- **运行时行为**: 通过 DynamicQueryParameterParserHelper 解析，并经由 QueryGuardrailEnforcerUtil 执行安全边界校验。
- **使用方法**: 在控制器接口方法参数上标注 `@AutoParam("status")` 或设置 `required = false, defaultValue = "ACTIVE"`。
- **适用场景**: 希望控制器接口保持 100% Pure Java（零 `org.springframework.web.*` 导入）并绑定 URL 查询参数时使用。
- **何时不适用及注意事项**: 切勿用于 URI 路径占位符（用 `@AutoVariable`）或 JSON 请求体（用 `@AutoBody`）。注：`v0.1.0` 也兼容直接使用 Spring `@RequestParam`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"status"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoParam("status") String status` | 绑定的查询参数名（name 的别名）。为空时读取 Java 参数名。<br/>*注意:* 启动时代理注册器会优先解析 `value`，其次才是 `name`。请勿同时为两个属性设置冲突值。 |
| `name` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"pageSize"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | 显式指定的查询参数名。<br/>*注意:* 启动时代理注册器会优先解析 `value`，其次才是 `name`。请勿同时为两个属性设置冲突值。 |
| `required` | `boolean` | `true` | 否（可选） | `true`（必填；缺失将返回 HTTP 400）或 `false`（可选；省略时传入 null）。<br/>`@AutoParam(name = "keyword", required = false) String keyword` | 为 true 时缺少该查询参数会返回 HTTP 400。<br/>*注意:* 若显式指定了 `defaultValue` 则自动视为可选；设为 `false` 时请使用包装类型（如 `Integer`、`Boolean`）而非基本类型，避免空指针异常。 |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | 否（可选） | 非空标识字符串（例如 `"20"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | 参数缺失时的默认值；默认为 DEFAULT_NONE 哨兵值（表示无默认值）。设置具体值后即变为可选。<br/>*注意:* 以字符串解析后通过 Spring `ConversionService` 自动转换为目标参数类型；非法字面量将触发 HTTP `400`。 |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **核心用途**: 绑定 URI 路径变量（如 UUIDv7 实体主键 ID）。
- **运行时行为**: 从 MVC 路径模板中解析并转换为强类型 Java UUID 或 String。
- **使用方法**: 在 Pure Java 控制器接口中标注 URI 变量参数，例如 `findById(@AutoVariable("id") UUID id)`。
- **适用场景**: 在 Pure Java 控制器接口中解析 URI 模板变量（如 `{id}`、`{slug}`、`{code}`）时使用。
- **何时不适用及注意事项**: 不要用于 `?query=` 查询参数（用 `@AutoParam`）或请求体（用 `@AutoBody`）；`v0.1.0` 同样支持原生 `@PathVariable`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"orderId"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoVariable("orderId") UUID orderId` | 绑定的 URI 模板路径变量名（name 别名）。<br/>*注意:* 启动时代理注册器会优先解析 `value`，其次才是 `name`。请勿同时为两个属性设置冲突值。 |
| `name` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"tenantCode"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | 显式 URI 模板变量名。<br/>*注意:* 启动时代理注册器会优先解析 `value`，其次才是 `name`。请勿同时为两个属性设置冲突值。 |
| `required` | `boolean` | `true` | 否（可选） | `true`（必填；缺失将返回 HTTP 400）或 `false`（可选；省略时传入 null）。<br/>`@AutoVariable(name = "id", required = true) UUID id` | 路径变量是否必须存在且非空（默认 true）。<br/>*注意:* 路径变量名必须与方法 URI 模板中的 `{variableName}` 一致；仅在存在多个可选 URI 匹配模式时才应设为 `false`。 |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **核心用途**: 将 HTTP JSON 请求体反序列化为 DTO 或 Entity 参数，并与 @Valid 协同触发校验。
- **运行时行为**: 在进入 Service 事务层前经由 LocalValidatorFactoryBean 完成字段级校验。
- **使用方法**: 在 Pure Java 接口的 `@AutoPost`/`@AutoPut`/`@AutoPatch` 方法载荷参数上添加 `@AutoBody`（可配合 `@Valid` 启用校验）。
- **适用场景**: 用于在 Pure Java 代理控制器中将 JSON 请求体反序列化为实体或强类型 DTO。
- **何时不适用及注意事项**: 切勿在无请求体的 GET/DELETE 方法上使用 `@AutoBody`，也不可在同一方法上声明多个 `@AutoBody`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | 否（可选） | `true`（必填；缺失将返回 HTTP 400）或 `false`（可选；省略时传入 null）。<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | 请求体缺失时是否返回 HTTP 400 错误（默认 true）。<br/>*注意:* 建议搭配 `@Valid` 在进入代理前执行 Jakarta 参数校验；设为 `false` 允许空请求体而不报 `400`。 |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 允许通过 GET /{id}/{relation}/** 递归浏览子关联资源，并自动拦截循环引用。
- **运行时行为**: 需在控制器上显式配置 @AutoRestController(enableNestedSubResources = true)。
- **使用方法**: 先在 `@AutoRestController` 设置 `enableNestedSubResources = true`，再叠加 `@EnableNestedSubResource(allowedRelationships = {"items"})` 精确放行允许访问的关联字段。
- **适用场景**: 需要提供诸如 `GET /api/v1/customer-orders/{id}/items` 的父子嵌套资源接口，并在每一跳上强制校验 `@EntitySecurity` 和多租户权限时使用。
- **何时不适用及注意事项**: 不要在未限制 `allowedRelationships` 时直接暴露高扇出实体，也不要跨微服务边界域建立 JPA 关联。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`OrderItem.class`, `Shipment.class` (JPA `@Entity` classes)。<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | 可选的允许在 GET /{id}/** 遍历过程中访问的目标 JPA 实体类白名单。<br/>*注意:* 空数组表示允许全部关联子实体；生产环境请显式列出实体类，避免意外暴露内部审计或计费子表。 |
| `allowedRelationships` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`"items"`, `"payments"`, `"shipments"` (JPA field names)。<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | 允许出现在子资源 URL 路径中的 JPA 关联属性名白名单（如 "items"、"customer"）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"items"`）；名称不匹配会导致跳过规则或运行时查找异常。 |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 在自定义动作方法上声明式定义领域状态流转或数值字段增减规则。
- **运行时行为**: 在持久化保存实体更改之前按原子操作执行。
- **使用方法**: 在控制器接口上将 `@AutoPatch` 与 `@BusinessAction(targetStateField = "...", targetStateValue = "...")` 组合使用，由动态代理在事务内自动执行。
- **适用场景**: 用于单实体的审批/发货/取消等状态跃迁、库存或积分数值增减，或无参领域方法触发而无需另写 Service 实现。
- **何时不适用及注意事项**: 切勿用于多实体协调、第三方 HTTP 调用或异步流程（请改用 `@ServiceOverride` 或 `@CustomEndpoint` 委托 Spring Helper）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | 否（可选） | 实体类中与 生命周期状态 字段精确匹配的 Java 属性名（例如 `"status"`）。<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | 保存流程状态的实体字段名（若标注 @StateMachine 则自动校验证合法转换）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"status"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `targetStateValue` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"APPROVED"`）；留空 `""` 则采用框架默认命名约定。<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | 在事务内赋予 targetStateField 的目标状态字符串。<br/>*注意:* 持久化前会自动校验 `@StateMachine` 或 `@HumanPolicy` 状态机规则；非法流转将回滚并抛出业务异常。 |
| `adjustNumericField` | `String` | `""` | 否（可选） | 实体类中与 数值 字段精确匹配的 Java 属性名（例如 `"stockQuantity"`）。<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | 需要原子增减的数值字段名（支持 BigDecimal、Integer、Long 等）。<br/>*注意:* 必须配合 `deltaParamIndex >= 0` 或非空 `fixedDelta` 使用。事务内自动支持 `Integer`、`Long`、`BigDecimal` 与 `Double` 增减。 |
| `deltaParamIndex` | `int` | `-1` | 否（可选） | 支持以下固定取值之一：`-1` (disabled) or `0`-based method argument index (e.g., `1`)。<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | 承载动态增减步长 delta 的方法参数下标（从 0 开始）；-1 表示不从参数读取。<br/>*注意:* 启动时代理注册器会优先解析 `deltaParamIndex`，其次才是 `fixedDelta`。请勿同时为两个属性设置冲突值。 |
| `fixedDelta` | `String` | `""` | 否（可选） | 支持以下固定取值之一：Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`。<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | 固定数值增量字符串（如 "100"、"-1"），在未通过参数传递 delta 时使用。<br/>*注意:* 启动时代理注册器会优先解析 `deltaParamIndex`，其次才是 `fixedDelta`。请勿同时为两个属性设置冲突值。 |
| `entityMethod` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"markFulfilled"`）；留空 `""` 则采用框架默认命名约定。<br/>`@BusinessAction(entityMethod = "markFulfilled")` | 在同一个事务内触发的实体无参领域方法名称。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"markFulfilled"`）；名称不匹配会导致跳过规则或运行时查找异常。 |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean 扫描、配置绑定与执行优先级 (5 个注解)

### `@AutoComponent`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 框架组件标记注解，在启动时自动注册 Bean 而无需编译期导入 @Component。
- **运行时行为**: 仅限框架内部包（io.github.natswarchuan）扫描，业务应用请使用 Spring @Component。
- **使用方法**: 框架内部组件注解，由 `AutoBeanFactoryRegistrarBridge` 在 `io.github.natswarchuan` 包下扫描并注册到 Spring 容器。
- **适用场景**: 仅在编写框架源码本身（`io.github.natswarchuan.*`）并需要避免引入 `org.springframework.stereotype.Component` 时使用。
- **何时不适用及注意事项**: 严禁在业务应用代码（如 `com.example.*`）中使用！内部扫描器仅扫描 `io.github.natswarchuan`，业务项目请直接用 Spring `@Component`，否则 Bean 不会被注册。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | ApplicationContext 中已注册的精确 Bean 名称（例如 `"invoiceValidationHelper"`），或 `""` 自动解析。<br/>`@AutoComponent("invoiceValidationHelper")` | 可选的显式容器 Bean 名称；为空时采用首字母小写的类名。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 用于与 @ServiceOverride 配合的 ServiceImpl 服务实现类标记注解。
- **运行时行为**: 仅在 io.github.natswarchuan 包内按首字母小写类名注册，业务应用服务请使用 Spring @Service。
- **使用方法**: 框架内部服务注解，用于在 `io.github.natswarchuan` 包下注册框架核心服务，无需引入 `@Service`。
- **适用场景**: 仅在编写框架自身核心服务（`io.github.natswarchuan.*`）时使用。
- **何时不适用及注意事项**: 严禁在业务项目中使用！业务项目的 Service 实现请使用 Spring `@Service`，否则无法被扫描注入。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | ApplicationContext 中已注册的精确 Bean 名称（例如 `"orderFulfillmentService"`），或 `""` 自动解析。<br/>`@AutoService("orderFulfillmentService")` | 可选显式服务 Bean 名称；默认按小写驼峰类命名。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 在 @AutoConfigurationBean 配置类中声明受管的 Bean 工厂方法。
- **运行时行为**: 在自动装配阶段由 PureJavaBeanRegistrarBridge 统一扫描处理并注册。
- **使用方法**: 声明在框架 `@AutoConfigurationBean` 配置类的工厂方法上，由 `AutoBeanFactoryRegistrarBridge` 反射调用注册。
- **适用场景**: 仅在 `io.github.natswarchuan.config.*` 框架配置类中无 Spring `@Bean` 依赖时使用。
- **何时不适用及注意事项**: 不要在业务 `@Configuration` 类中使用；注册自定义 SPI Customizer 请使用 Spring `@Bean` 或 `@Component`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`{"primaryObjectMapper", "nwvmcMapper"}`。<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | 显式 Bean 名称及别名数组。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `targetTypeName` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"com.example.spi.PaymentGateway"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | 可选目标 Spring 类型的全限定类名，用于动态桥接检查。<br/>*注意:* 当工厂方法返回父接口或动态代理时提供完全限定类名提示；需确保该类存在于运行时 Classpath。 |
| `primary` | `boolean` | `false` | 否（可选） | `true`（存在多个候选 Bean 时优先注入此 Bean）或 `false`（普通候选优先级）。<br/>`@AutoBean(primary = true)` | 存在同类型多候选 Bean 时将该 Bean 标记为优先主候选（primary）。<br/>*注意:* 为同一类型声明两个 `@AutoBean(primary = true)` 会在启动阶段触发 Bean 歧义冲突。 |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 标记配置类及 YAML 配置属性绑定模型，实现零 Spring 配置注解侵入。
- **运行时行为**: 结合 IDE 元数据纯净注册配置 Bean 与 YAML 属性前缀。
- **使用方法**: 标注在框架 `io.github.natswarchuan.config.*` 的配置与属性类上，由启动桥接器自动装配。
- **适用场景**: 仅在 `io.github.natswarchuan` 框架库内部需要无 Spring 编译依赖的配置类时使用。
- **何时不适用及注意事项**: 不要用于业务应用配置类；业务项目请使用 Spring `@Configuration` 与 `@ConfigurationProperties`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | ApplicationContext 中已注册的精确 Bean 名称（例如 `"storageAutoConfig"`），或 `""` 自动解析。<br/>`@AutoConfigurationBean("storageAutoConfig")` | 可选配置 Bean 标识名称。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `prefix` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"nwvmc.storage"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | 可选 YAML 配置前缀（如 "app.framework.cache"），由 `PureJavaBeanRegistrarBridge` 动态绑定。<br/>*注意:* 将 `application.yml` 中对应 kebab-case 属性绑定到配置 Bean；建议配合 `spring-configuration-metadata.json` 实现零 IDE 警告。 |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **核心用途**: 控制 SPI Customizer 扩展点与过滤器链之间的执行优先级顺序。
- **运行时行为**: 数值越小优先级越高越早执行（默认为 Integer.MAX_VALUE）。
- **使用方法**: 标注在需要按优先顺序排列的 Pure Java 拦截器、Customizer 或框架 Bean 上，如 `@OrderPriority(1)`。
- **适用场景**: 需要确保多个框架 Bean 或 SPI Customizer 按确定性先后顺序生效时使用。
- **何时不适用及注意事项**: 不要与 Spring Security 过滤器链顺序或数据库 `?sort=` 排序混淆；两者分别由 `SecurityExposureCustomizer` 與 URL 参数控制。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | 否（可选） | 支持以下固定取值之一：Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest)。<br/>`@OrderPriority(10)` | 执行优先级整数；数值越小优先级越高（默认 Integer.MAX_VALUE 优先级最低）。<br/>*注意:* 数值越小越先执行（与 Spring `@Order` 语义一致）。建议 `< 0` 留给安全与追踪过滤器，`10..100` 用于业务拦截器。 |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. 实体安全、状态机、数据完整性、自动生成与查询 (11 个注解)

### `@EntitySecurity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 在实体读写前强制执行 NIST Level 2 RBAC、记录级 ownerField 归属隔离及细粒度权限码校验。
- **运行时行为**: 在 SQL 执行前完成鉴权；未授权访问立即抛出 HTTP 403 Forbidden。
- **使用方法**: 直接标注在 JPA `@Entity` 类上，配置 `readRoles`/`writeRoles`/`deleteRoles`；需要行级所有权隔离时加上 `ownerField = "createdBy"`，公开只读目录可设 `permitAll = true`。
- **适用场景**: 建议标注在所有对外暴露的 `@Entity` 上，统一保护 REST、批处理、导出及 GraphQL 入口。
- **何时不适用及注意事项**: 切勿在使用完整 `AutoApiController<E>` 时误设 `permitAll = true` 却未禁用写/删路由或未配置 `@SecurityPolicyEntity`（当无数据库策略覆盖时，`isPermitAllWithoutDbOverride` 会跳过读、写、删全部角色校验）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_USER", "ROLE_ADMIN"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | 允许读取记录（GET 分页/详情/统计/GraphQL/导出）的角色列表。空数组受安全策略控制。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |
| `writeRoles` | `String[]` | `{}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_MANAGER", "ROLE_ADMIN"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | 允许执行 POST/PUT/PATCH/导入/批处理写入的角色列表。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |
| `deleteRoles` | `String[]` | `{}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | 允许执行删除（DELETE / batch-delete）操作的最小权限角色列表。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |
| `permitAll` | `boolean` | `false` | 否（可选） | `true`（允许未登录用户公开访问）或 `false`（强制要求认证与角色校验）。<br/>`@EntitySecurity(permitAll = true)` | 设为 true 且无 DB-RBAC 策略覆盖时，会跳过全部 CRUD（READ、WRITE、DELETE）角色校验；公开只读目录务必搭配 AutoReadApi<E> 或 disabledEndpoints。<br/>*注意:* 会覆盖 `readRoles`/`writeRoles`/`deleteRoles` 并允许匿名访问。严禁用于包含 PII、财务或可写内部实体。 |
| `ownerField` | `String` | `""` | 否（可选） | 实体类中与 所有者主体/UUID 字段精确匹配的 Java 属性名（例如 `"createdBy"`）。<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | 存储记录所有者主体 ID 的实体字段名（如 "createdBy"、"ownerId"），开启防 IDOR 行级所有权隔离。<br/>*注意:* 对 `GET`/`PUT`/`PATCH`/`DELETE` 强制行级归属过滤：用户仅可访问与当前登录主体一致的记录，除非持有 `bypassOwnerRoles` 角色。 |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | 允许绕过 ownerField 所有权校验的特权管理员角色数组。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |
| `permissions` | `String[]` | `{}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ORDER_READ", "ORDER_APPROVE"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | 与角色共同校验的细粒度权限代码数组（支持 Database RBAC 与 `SecurityIdentityCustomizer`）。<br/>*注意:* 与 JWT 声明或 DB-RBAC `@SecurityPermissionEntity` 中的细粒度权限进行匹配，可与角色校验叠加形成纵深防御。 |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 当调用方角色权限不足时，在序列化前动态脱敏或置空敏感字段。
- **运行时行为**: 在数据库读取之后、JSON 响应序列化之前应用脱敏拦截。
- **使用方法**: 直接加在敏感实体字段上（如 `costPrice`、`ssn`、`salary`），框架在响应阶段基于浅拷贝对象执行脱敏，绝不污染持久层实体或 L1 缓存。
- **适用场景**: 当同一实体接口同时服务多类角色（普通用户看掩码/`null`，管理员看原值），并希望在 REST 和 GraphQL 同时生效时使用。
- **何时不适用及注意事项**: 无需担心 `nullifyInsteadOfMask = false` 会泄漏非字符串字段（`FieldMaskingExecutionHelper` 会对 `BigDecimal`/`LocalDate` 自动置 `null`）；仅当希望 **`String`** 字段也返回 `null` 而非 `"******"` 时才需设 `true`。若需彻底移除 JSON 键名请改用 `readDto`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_ADMIN", "ROLE_FINANCE"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | 允许查看未脱敏原始字段值的角色列表。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |
| `maskPattern` | `String` | `"******"` | 否（可选） | 非空标识字符串（例如 `"***-**-****"`）；留空 `""` 则采用框架默认命名约定。<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | 当调用方不具备 viewRoles 权限时替换到字符串字段的掩码模板。<br/>*注意:* 当 `nullifyInsteadOfMask = true` 时被忽略。对于非字符串字段（`BigDecimal`、`Integer`、`LocalDate`），建议开启 `nullifyInsteadOfMask = true` 以保持 JSON 类型合法。 |
| `nullifyInsteadOfMask` | `boolean` | `false` | 否（可选） | `true`（无权查看时将字段值置为 JSON null）或 `false`（使用 maskPattern 掩码字符串替换）。<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | 为 true 时强制将 String 字段置为 null 而非 maskPattern（BigDecimal、LocalDate、UUID 等非字符串类型已由 FieldMaskingExecutionHelper 自动置为 null）。<br/>*注意:* 对数值、日期及嵌套对象字段尤为关键，确保前端 TypeScript/Zod 收到合法 `null` 而不会因字符串掩码导致反序列化失败。 |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 通过 POST /{id}/transition 强制执行合法状态机流转，并限制 DELETE /{id} 仅允许在 deletableStates 状态下执行。
- **运行时行为**: 拦截非法状态流转或删除操作，抛出 HTTP 422 BusinessRuleViolationException。
- **使用方法**: 标注在实体 String 状态字段上，例如 `transitions = {"CREATED:PAID,CANCELLED"}`，框架在 PUT/PATCH/DELETE 和 `@BusinessAction` 时自动校验。
- **适用场景**: 适用于订单、贷款审批、发票、工单等严格有限状态机流程，防止非法跳态或误删数据（拦截返回 HTTP `422`）。
- **何时不适用及注意事项**: 严禁使用 `"->"` 箭头格式（`EntityStateMachineUtil` 仅按冒号 `":"` 解析）！此外注意不要与 `@HumanPolicy(lifecycle = ...)` 冲突。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | 否（可选） | 非空标识字符串（例如 `"CREATED"`）；留空 `""` 则采用框架默认命名约定。<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 创建实体且该字段为空时自动填入的初始状态（默认 "ACTIVE"）。<br/>*注意:* 在 `POST` 创建且状态为空时自动填充此初始态；必须与 `transitions` 中至少一条规则冒号 `:` 左侧的起点名称一致。 |
| `transitions` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`)。<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 允许的状态跃迁规则，必须使用冒号格式 "FROM:TO_1,TO_2"（例如 "CREATED:PAID,CANCELLED"）。<br/>*注意:* 严格校验冒号语法 `"FROM:TO1,TO2"`（区分大小写，多个目标态用逗号分隔）。任何跳转到未声明目标态的请求均会被拒绝（HTTP `400`/`409`）。 |
| `deletableStates` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`{"CREATED", "CANCELLED"}` (state names where DELETE is allowed)。<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | 允许删除记录的状态白名单（不在此列表中的状态执行 DELETE 将拦截并返回 HTTP 422）。<br/>*注意:* 非空时，若实体处于其他状态（如 `"PAID"`、`"SHIPPED"`），调用 `DELETE` 或批量删除将直接返回 HTTP `409 Conflict`。 |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 将自然可读的策略条款直接编译为生效中的 RBAC 权限、状态机流转及字段脱敏规则。
- **运行时行为**: 可通过 GET /human-policy 按实体查看，并支持在 YAML 的 spring-nwvmc.human-policies.<Entity> 下动态覆写。
- **使用方法**: 将 `@HumanPolicy` 标在实体上或配合 `application.yml` 中的 `spring-nwvmc.human-policies` 使用，`HumanPolicyRegistryHelper` 会在运行期编译为结构化策略。
- **适用场景**: 当产品、合规或运维团队希望使用可读的英语/YAML 策略外置管控权限、脱敏与状态流而无需改代码时使用。
- **何时不适用及注意事项**: 切勿写入非英语散文或随性长句！`HumanPolicyRegexCompilerHelper` 仅匹配确定性英语语法模板；复杂严格约束建议直接用 `@EntitySecurity` + `@StateMachine`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | 否（可选） | 支持以下固定取值之一：Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`。<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | 自然英语生命周期规则字符串（由 NLP 编译器转换为状态机跃迁规则）。<br/>*注意:* 启动时一次性编译为与 `@StateMachine` 相同的有限状态机；请勿在同一实体上同时定义冲突的 `@StateMachine`。 |
| `security` | `String` | `""` | 否（可选） | 支持以下固定取值之一：Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`。<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | 自然英语 RBAC 访问控制规则（描述读/写/删及所有者权限）。<br/>*注意:* 角色名称会自动补齐 `ROLE_` 前缀，并在启动阶段提前解析，语法错误会立即快速失败。 |
| `masking` | `String` | `""` | 否（可选） | 支持以下固定取值之一：Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`。<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | 自然英语字段脱敏策略（指定敏感字段与可看原值的角色）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"costPrice"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `stateField` | `String` | `""` | 否（可选） | 实体类中与 生命周期状态 字段精确匹配的 Java 属性名（例如 `"orderStatus"`）。<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | 当编译 lifecycle 规则时指定承载状态值的实体字段名。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"orderStatus"`）；名称不匹配会导致跳过规则或运行时查找异常。 |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 记录跨变更的字段级差异，为时光机状态重建与 /diff 差异审计提供底层历史账本。
- **运行时行为**: 在创建、更新、局部修补、状态流转与恢复时自动捕获 oldValue 与 newValue 变更明细。
- **使用方法**: 在继承 `BaseAuditEntity` 的实体类上添加 `@AuditTrail(recordFieldDiffs = true)`，框架在所有写删动作中通过 `AuditTrailService` 自动留痕。
- **适用场景**: 用于订单、支付、病历、银行账户及 RBAC 策略等高合规实体，支撑 `GET /{id}/revisions` 时间旅行与审计追溯。
- **何时不适用及注意事项**: 超高频写入的遥测、日志流或临时表请勿开启 `@AuditTrail(recordFieldDiffs = true)`，以免产生不必要的写放大。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"FINANCE_LEDGER"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | 记录在审计流水上的分类名称；为空时默认采用实体类名。<br/>*注意:* 用于给审计日志打标签并支持按业务域筛选；留空 `""` 时默认采用 JPA 实体类名。 |
| `recordFieldDiffs` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | 为 true 时计算字段前后值变化 JSON 差异，支持 Time-Travel 历史回溯。<br/>*注意:* 在每次 `PUT`/`PATCH` 时记录修改前后字段差异；若实体含大体积文本/二进制字段或超高频写入，请设为 `false` 节省存储。 |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 除非调用方具备绕过角色，否则自动按当前租户上下文隔离行级查询与写入。
- **运行时行为**: 无绕过角色且租户上下文缺失时快速拒绝返回 HTTP 403；创建时强制覆盖防伪造并在全部按 ID 操作强制隔离校验（防 IDOR）。
- **使用方法**: 在包含 `tenantId` 的 SaaS `@Entity` 上标注 `@MultiTenant`。框架在读取时自动附加租户隔离条件，并在创建/导入/单条读写时防篡改且 Fail-Closed 返回 `403`。
- **适用场景**: 用于所有共享数据库的多租户 B2B SaaS 业务表（商户门店、订单、发票、工作区），全链路阻断跨租户越权访问。
- **何时不适用及注意事项**: 不要用于全球公共字典表（国家、币种、公共类目）；此外必须确保非超级管理员的 JWT/Identity 提供了有效的 `tenantId`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | 否（可选） | 实体类中与 租户标识 字段精确匹配的 Java 属性名（例如 `"tenantId"`）。<br/>`@MultiTenant(tenantField = "organizationId")` | 存储租户 ID 的实体字段名；默认 TenantConstant.DEFAULT_TENANT_FIELD ("tenantId")。<br/>*注意:* 强烈建议为该列建立联合数据库索引 `(tenant_id, id)`，保障多租户隔离查询达到 O(log N) 性能并防止跨租户泄露。 |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | 否（可选） | Spring Security 角色/权限名称数组（例如 `{"ROLE_SUPER_ADMIN"}`）；空数组 `{}` 表示未单独限制此操作。<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | 允许跨租户检索/操作的超级平台管理员角色数组（默认 {"ROLE_SUPER_ADMIN"}）。<br/>*注意:* 请将角色常量集中在 `RoleConstant` 中并使用 `ROLE_` 前缀（例如 `ROLE_ADMIN`），与 Spring Security 的 `GrantedAuthority` 保持一致。 |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 在新增、更新与 Upsert 持久化前自动校验字段唯一性冲突。
- **运行时行为**: 当检测到重复值时立即抛出 ConflictBusinessException（HTTP 409）。
- **使用方法**: 标注在实体唯一业务键字段（如 `email`、`skuCode`）上并搭配 `@Column(unique = true)`；在 POST/PUT/upsert 前自动检查活跃记录唯一性。
- **适用场景**: 当需要友好清晰的国际化 `HTTP 409 Conflict` 冲突提示，且允许逻辑删除后的编码被重新启用时使用。
- **何时不适用及注意事项**: 高并发场景切勿仅靠 `@UniqueField` 而省略数据库 `UNIQUE` 索引（并发竞态由 DB 约束兜底并同样映射 `HTTP 409`）；不要标注在允许重名的字段上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 当字段为空时，在创建或克隆实体时自动生成带前缀的唯一业务编码。
- **运行时行为**: 在实体验证与落库前自动填充 prefix + 唯一编码令牌。
- **使用方法**: 标注在实体 String 编码字段上（如 `@AutoCode(prefix = "PRD-")`）；创建或克隆时若未传入编码，框架自动生成诸如 `PRD-0194E1A0`。
- **适用场景**: 用于需要可读业务编号（订单号、SKU、门店编号、工单号）同时希望避免数据库自增序列锁竞争的场景。
- **何时不适用及注意事项**: 如果法规严格要求绝对连续无跳号的纯递增序列号（如法定税控发票连续号），请勿使用；另外 `prefix` 必填，漏传无法编译。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **是（必填）** | 非空标识字符串（例如 `"ORD"`）；留空 `""` 则采用框架默认命名约定。<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | 必填编码前缀，拼接在 8 位大写 UUIDv7 哈希之前（例如 "PRD-"、"ORD-"）。<br/>*注意:* 必填属性；仅在新建且字段为空时自动生成如 `INV-2026-0001` 的编码，若调用方已显式传入则保留原值。 |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 从 sourceField 自动标准化并生成适合 URL 的 ASCII Slug 短链标识。
- **运行时行为**: 自动去除 Unicode 变音符号，并支持通过 slug 动态过滤条件直接查询。
- **使用方法**: 在 `slug` 字段上标注 `@AutoSlug(sourceField = "storeName")`；创建为空时自动转写，克隆实体时自动追加 `-copy-...` 后缀。
- **适用场景**: 用于商城门店、博客文章、分类、商品目录等需要友好 SEO URL（尤其含多语言/越南语变音符）的场景。
- **何时不适用及注意事项**: 切勿将 `sourceField` 指向不存在的字段；且注意后续修改标题默认不会覆盖已保存的自定义 slug 以防 SEO 外链失效。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **是（必填）** | 实体类中与 字符串 字段精确匹配的 Java 属性名（例如 `"title"`）。<br/>`@AutoSlug(sourceField = "productName") private String slug;` | 必填来源属性名（支持多语言重音字符及越南语 đ/Đ），框架将其规范化为小写连字符 ASCII slug。<br/>*注意:* 必填属性；自动将 Unicode 字符规范为小写 URL 安全的 kebab-case 别名。建议配合 `@UniqueField` 确保唯一性。 |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **核心用途**: 在保存实体变更前自动计算衍生汇总数值（乘积、加减或子集合求和）。
- **运行时行为**: 应用启动时经 ComputedFieldFailFastUtil 校验字段映射，配置错误立即 Fail-Fast 阻断。
- **使用方法**: 标注在 `BigDecimal subTotal` 或 `totalAmount` 等衍生金额字段上，框架在 POST/PUT/PATCH/upsert 持久化前于服务端以精确 `BigDecimal` 重新计算并覆盖。
- **适用场景**: 用于订单小计、总金额（子项合计 - 折扣 + 运费）及税费衍生计算，防止客户端恶意伪造应付金额。
- **何时不适用及注意事项**: 需要阶梯优惠券、实时汇率或查询外部促销表时请勿使用 `@ComputedField`（请在 Spring `@ServiceOverride` Helper 中计算）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | 否（可选） | 支持以下固定取值之一：`"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items)。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 计算模式："MULTIPLY"（同行字段相乘）或 "SUM_COLLECTION"（汇总子集合并加减字段）。<br/>*注意:* 在 `POST`/`PUT`/`PATCH`/Upsert 持久化前自动重算，彻底覆盖客户端可能篡改的金额总计。 |
| `sourceFields` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`{"unitPrice", "quantity"}` (numeric properties on same entity)。<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | 当 operation = "MULTIPLY" 时参与连乘的同实体字段列表（如 {"unitPrice", "quantity"}）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"unitPrice"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `collectionField` | `String` | `""` | 否（可选） | 实体类中与 @OneToMany 集合 字段精确匹配的 Java 属性名（例如 `"items"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" 模式下要聚合的 @OneToMany 子集合字段名（如 "items"）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"items"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `itemField` | `String` | `""` | 否（可选） | 实体类中与 数值 字段精确匹配的 Java 属性名（例如 `"subTotal"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 子集合元素上参与求累加的数值属性名（如 "subTotal"）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"subTotal"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `subtractField` | `String` | `""` | 否（可选） | 实体类中与 数值 字段精确匹配的 Java 属性名（例如 `"discountAmount"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | 从集合汇总值中扣除的父实体字段名（如 "discountAmount"）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"discountAmount"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `addField` | `String` | `""` | 否（可选） | 实体类中与 数值 字段精确匹配的 Java 属性名（例如 `"shippingFee"`）。<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | 追加到结果上的父实体附加费用字段名（如 "shippingFee"）。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"shippingFee"`）；名称不匹配会导致跳过规则或运行时查找异常。 |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 支持将自定义原生 SQL、JPQL 或 SQL Provider Helper 方法绑定到控制器端点。
- **运行时行为**: 通过 JPA EntityManager 绑定命名参数后安全执行。
- **使用方法**: 在控制器接口方法上结合 `@AutoGet`/`@AutoPost` 使用，并通过 `@AutoParam`/`@AutoVariable` 绑定 `:param` 参数。
- **适用场景**: 适用于原生 SQL 复杂报表、CTE 公用表表达式、窗口函数、PostgreSQL JSONB 查询等无需手写 Repository 的定制查询。
- **何时不适用及注意事项**: 严禁在 SQL 中拼接用户输入（必须使用 `:named` 绑定参数）！勿让 `sqlProvider` 指向不存在的方法（启动 fail-fast 报错），也严禁跨微服务限界上下文执行 SQL JOIN。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 否（可选） | 支持以下固定取值之一：Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders。<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | 支持命名参数 `:param` 的内联 SQL 或 JPQL 查询语句（若使用 sqlProvider 则留空）。<br/>*注意:* 务必使用 `:param` 或 `?1` 绑定参数，严禁拼接用户输入防 SQL 注入；当通过 `sqlProvider` 动态生成 SQL 时可留空 `""`。 |
| `nativeQuery` | `boolean` | `true` | 否（可选） | `true`（执行底层数据库原生 SQL）或 `false`（执行跨库可移植 JPQL）。<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true 执行原生 SQL 查询；false 执行 JPQL 面向对象查询。<br/>*注意:* 原生 SQL（默认 `true`）可使用 CTE、窗口函数与数据库专属 JSON 算子；如需在 H2/PostgreSQL/MySQL 间无痛迁移请改为 `false`（JPQL）。 |
| `resultClass` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `MonthlyRevenueDto.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | 可选结果映射目标类（实体或标量类型）；默认 Void.class 返回原始结果。<br/>*注意:* 聚合与报表查询务必指定 DTO 投影类，消除 `SELECT *` 开销并确保强类型映射而非裸 `Object[]`。 |
| `sqlProvider` | `Class<?>` | `Void.class` | 否（可选） | 任意具体 Java DTO 类字面量（例如 `OrderAnalyticsSqlProvider.class`），或 `Void.class` 表示不启用 DTO 映射。<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | 可选的动态 SQL 提供类，会在启动时由 EntityFailFastValidatorUtil 校验并防止运行时签名错误。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `sqlProvider` 配置会在接收流量前快速失败。 |
| `providerMethod` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"buildRevenueSql"`）；留空 `""` 则采用框架默认命名约定。<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | sqlProvider 类中返回 String SQL 语句的方法名。<br/>*注意:* 必须与 Java 方法/字段名严格区分大小写匹配（例如 `"buildRevenueSql"`）；名称不匹配会导致跳过规则或运行时查找异常。 |
| `modifying` | `boolean` | `false` | 否（可选） | `true`（在写事务内执行 UPDATE/DELETE DML 语句）或 `false`（只读 SELECT 查询返回实体或 DTO）。<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | 执行 INSERT/UPDATE/DELETE 修改语句时必须设为 true（触发 executeUpdate）。<br/>*注意:* 执行 `UPDATE`/`DELETE` 语句时必须设为 `true`；自动开启可写事务并清理 JPA 一级缓存避免脏读。 |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. 数据库驱动动态 RBAC 与字段脱敏元注解 (18 个注解)

### `@SecurityRoleEntity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **核心用途**: 将 JPA 实体声明为数据库驱动 RBAC 角色目录主表。
- **运行时行为**: DynamicDatabaseRbacProviderHelper 在 Caffeine 中按 TTL 缓存角色权限绑定，写入变更后自动失效。
- **使用方法**: 在角色 JPA 实体上添加 `@SecurityRoleEntity`，并使用 `@RoleCode` 标记角色编码字段（建议同时标注 `@RoleName` 与 `@RolePermissions`）。
- **适用场景**: 需要由管理员在后台通过数据库表动态增删改角色及其权限绑定，而不是硬编码在 Java 常量时使用。
- **何时不适用及注意事项**: 严禁遗漏 `@RoleCode`（启动 fail-fast 立即拒绝启动），也不要在同一个应用中标注多个 `@SecurityRoleEntity`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | 否（可选） | 正数（`>= 1`），单位：秒；例如 `60L`。<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine 内存快照的缓存 TTL（秒），超时后从数据库重载；修改角色表时也会自动提前失效缓存。<br/>*注意:* 较短的 TTL 能更快生效数据库变更但查询更多；较长 TTL 减轻数据库压力，但权限撤销会延迟至缓存过期。 |

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

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射 @SecurityRoleEntity 中唯一的权限/角色编码字段。
- **运行时行为**: 通过缓存的 LambdaAccessorUtil 读取角色编码，用于匹配 Spring Security GrantedAuthority 令牌。
- **使用方法**: 将 `@RoleCode` 标注在 `@SecurityRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@RoleCode`，也不要标注在未声明 `@SecurityRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 标识 @SecurityRoleEntity 中用于展示的可读角色名称字段。
- **运行时行为**: 在 RBAC 诊断元数据与 Dev Studio 角色检视接口中提供描述信息。
- **使用方法**: 将 `@RoleName` 标注在 `@SecurityRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@RoleName`，也不要标注在未声明 `@SecurityRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 标记角色实体上存储已授予权限码集合或逗号分隔字符串的字段。
- **运行时行为**: 运行时动态解析并展开为 Spring Security 与 SecurityIdentityCustomizer 可用的有效权限集。
- **使用方法**: 将 `@RolePermissions` 标注在 `@SecurityRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@RolePermissions`，也不要标注在未声明 `@SecurityRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **核心用途**: 将 JPA 实体标记为存储资源-操作权限与动态字段脱敏规则的数据库权限表。
- **运行时行为**: 加载至 DatabaseRbacRuleMatcherHelper 以执行资源级 CRUD 访问控制与读后字段脱敏。
- **使用方法**: 标注在权限 JPA 实体类上，必填 `@PermissionCode`（建议补充 `@PermissionResource`、`@PermissionAction` 与 `@PermissionFieldMask`）。
- **适用场景**: 需要通过数据库动态管理细粒度资源/操作授权（`READ`/`WRITE`/`DELETE`）及字段级脱敏规则时使用。
- **何时不适用及注意事项**: 严禁缺少 `@PermissionCode`（启动 fail-fast 报错），勿定义多个 `@SecurityPermissionEntity`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | 否（可选） | 正数（`>= 1`），单位：秒；例如 `60L`。<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Caffeine 内存快照 TTL 秒数（修改权限表时自动即时失效）。<br/>*注意:* 较短的 TTL 能更快生效数据库变更但查询更多；较长 TTL 减轻数据库压力，但权限撤销会延迟至缓存过期。 |

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

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 指定 @SecurityPermissionEntity 中的唯一权限代码字段。
- **运行时行为**: 与当前调用者权限集及 @EntitySecurity.permissions() 声明进行匹配。
- **使用方法**: 将 `@PermissionCode` 标注在 `@SecurityPermissionEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPermissionEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PermissionCode`，也不要标注在未声明 `@SecurityPermissionEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射 @SecurityPermissionEntity 中的目标实体名或 API 资源名（支持通配符 *）。
- **运行时行为**: 由 DatabaseRbacRuleMatcherHelper 按大小写不敏感匹配并支持通配符兜底。
- **使用方法**: 将 `@PermissionResource` 标注在 `@SecurityPermissionEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPermissionEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PermissionResource`，也不要标注在未声明 `@SecurityPermissionEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射受 @SecurityPermissionEntity 规则保护的逻辑 CRUD 或自定义操作动作动词。
- **运行时行为**: 从控制器方法自动归一化映射为标准动作名（READ、WRITE、DELETE 或自定义动作）。
- **使用方法**: 将 `@PermissionAction` 标注在 `@SecurityPermissionEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPermissionEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PermissionAction`，也不要标注在未声明 `@SecurityPermissionEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 声明当此数据库权限规则命中时需要动态脱敏遮盖的逗号分隔实体字段名列表。
- **运行时行为**: 在 HTTP JSON 响应序列化前与 @FieldSecurity 协同执行动态遮盖或置空。
- **使用方法**: 将 `@PermissionFieldMask` 标注在 `@SecurityPermissionEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPermissionEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PermissionFieldMask`，也不要标注在未声明 `@SecurityPermissionEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **核心用途**: 将 JPA 实体标记为关联用户主体、数据库角色与可选租户范围的动态授权映射表。
- **运行时行为**: 在 JWT 解析与 SecurityContext 构建阶段自动查询，实时扩充用户 GrantedAuthority。
- **使用方法**: 标注在用户-角色关联表实体上，必填 `@UserRoleSubject`、`@UserRoleCode`（多租户可追加 `@UserRoleTenantId`）。
- **适用场景**: 当 JWT 仅携带用户标识 `sub`/`username`，需要在每次请求时从数据库动态装配其当前生效角色及租户权限时使用。
- **何时不适用及注意事项**: 切勿忘记标注 `@UserRoleSubject`；若全权依赖 Keycloak/Auth0 JWT 内的声明而无需数据库追加角色，可保持 `enabled = false`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@SecurityUserRoleEntity(enabled = true)` | 是否启用从该实体表加载用户-角色映射的开关，可在不删类情况下快速停用。<br/>*注意:* 在数据库迁移期间可临时设为 `false`，暂停动态用户-角色表查询而保留 JWT 角色认证可用。 |

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

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 标识 @SecurityUserRoleEntity 中的主体标识符（Authentication.getName() / JWT sub）字段。
- **运行时行为**: 与当前 SecurityContext 中的 Authentication.getName() 进行精确匹配。
- **使用方法**: 将 `@UserRoleSubject` 标注在 `@SecurityUserRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityUserRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@UserRoleSubject`，也不要标注在未声明 `@SecurityUserRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 绑定 @SecurityUserRoleEntity 中分配给用户的角色编码字段。
- **运行时行为**: 策略评估时按该编码动态关联对应的 @SecurityRoleEntity 权限集合。
- **使用方法**: 将 `@UserRoleCode` 标注在 `@SecurityUserRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityUserRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@UserRoleCode`，也不要标注在未声明 `@SecurityUserRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 将 @SecurityUserRoleEntity 角色授权限定到指定租户 ID（或用 * 表示全局有效）。
- **运行时行为**: 每次请求时根据 TenantContextHolder / X-Tenant-ID 上下文动态过滤生效角色。
- **使用方法**: 将 `@UserRoleTenantId` 标注在 `@SecurityUserRoleEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityUserRoleEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@UserRoleTenantId`，也不要标注在未声明 `@SecurityUserRoleEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **核心用途**: 将 JPA 实体标记为支持按 priority 排序的显式 ALLOW / DENY 动态授权策略表。
- **运行时行为**: 确定性遵循 DENY 优先于 ALLOW；在任何 SQL 查询或写入执行前拦截放行或拒绝。
- **使用方法**: 标注在动态策略实体表上，必填 `@PolicyAllowedRoles`，配合 `@PolicyResource`、`@PolicyAction` 和 `@PolicyEffect`（"ALLOW"/"DENY"）。
- **适用场景**: 需要用数据库动态规则覆盖或补充静态 `@EntitySecurity` 配置（例如紧急 `DENY` 熔断规则或临时授权）时使用。
- **何时不适用及注意事项**: 严禁缺少 `@PolicyAllowedRoles`（启动报错）；同时切记同一资源上的显式 `DENY` 策略优先级高于授权。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | 否（可选） | 正数（`>= 0`），单位：整数优先级；例如 `10`。<br/>`@SecurityPolicyEntity(priority = 10)` | 多条策略冲突时的评估优先级整数；数值越小越优先评估。<br/>*注意:* 当多条动态策略命中同一实体字段时，数值越小优先级越高（例如 `10` 会覆盖默认的 `100`）。 |

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

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射 @SecurityPolicyEntity 中的目标资源匹配模式字段。
- **运行时行为**: 同时支持实体类/资源名称精确匹配及全局通配符 * 匹配。
- **使用方法**: 将 `@PolicyResource` 标注在 `@SecurityPolicyEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPolicyEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PolicyResource`，也不要标注在未声明 `@SecurityPolicyEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射 @SecurityPolicyEntity 中受控操作动作动词（READ、WRITE、DELETE 或 *）。
- **运行时行为**: 在委派进入 Service 执行层前针对每次 HTTP 请求操作进行匹配评估。
- **使用方法**: 将 `@PolicyAction` 标注在 `@SecurityPolicyEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPolicyEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PolicyAction`，也不要标注在未声明 `@SecurityPolicyEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 映射 @SecurityPolicyEntity 策略规则所适用的角色集合或逗号分隔角色串字段。
- **运行时行为**: 与当前 JWT 令牌角色及数据库动态水合的 @SecurityUserRoleEntity 角色并集交叉比对。
- **使用方法**: 将 `@PolicyAllowedRoles` 标注在 `@SecurityPolicyEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPolicyEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PolicyAllowedRoles`，也不要标注在未声明 `@SecurityPolicyEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **核心用途**: 指定 @SecurityPolicyEntity 规则匹配时的授权决策结果（ALLOW 或 DENY）。
- **运行时行为**: 任意匹配成功的 DENY 策略均会立即中断请求并抛出 HTTP 403 AccessDeniedBusinessException。
- **使用方法**: 将 `@PolicyEffect` 标注在 `@SecurityPolicyEntity` 实体类的对应字段或 getter 方法上。
- **适用场景**: 当数据库 RBAC 表 `@SecurityPolicyEntity` 需要保留自有数据库字段命名并自动对接框架权限快照引擎时使用。
- **何时不适用及注意事项**: 切勿在同一实体内重复标注多个 `@PolicyEffect`，也不要标注在未声明 `@SecurityPolicyEntity` 的普通实体上。

> **标记注解（Marker Annotation）**：纯标记型注解，不包含任何属性。

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. 分布式锁、幂等性、缓存、多数据源与云事件 (13 个注解)

### `@DistributedLock`

- **所属包名**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **核心用途**: 基于 AST 缓存（上限 1024）解析 SpEL 锁键串行化并发访问（默认 waitTimeMs=3000L, leaseTimeMs=5000L）。
- **运行时行为**: 等待锁超时时，DistributedLockAspect 立即抛出 DistributedLockAcquisitionException（HTTP 409）。
- **使用方法**: 标注在 Spring `@Service`（非 `final` 类，供 CGLIB AOP 代理）的方法上；多机集群请注册基于 Redis/Redisson 的 `DistributedLockProvider` SPI Bean。
- **适用场景**: 适用于防止库存超卖、账户并发扣款或定时任务多节点并发重入的临界区互斥。
- **何时不适用及注意事项**: 注意：默认内置 Caffeine + `ReentrantLock` 仅在单机 JVM 内有效！多节点集群若不替换 `DistributedLockProvider` 无法跨节点互斥；同时切勿标注在 `final class` Bean 上。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | 否（可选） | 引用方法参数的 SpEL 表达式（例如 `"'inventory:' + #skuId"`），留空 `""` 则自动生成键。<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | 运行时求值的 SpEL 互斥锁键表达式（如 "'sku:' + #skuCode"）；为空时按方法签名加锁。<br/>*注意:* 务必将锁键细化到具体业务主键（如 `#id`）；使用固定常量键会导致全局所有请求串行排队。 |
| `waitTimeMs` | `long` | `3000L` | 否（可选） | 正数（`>= 0`），单位：毫秒；例如 `3000L`。<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | 获取锁的最大等待毫秒数，超时抛出抢锁失败异常（默认 3000L）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：过短易在并发突发时误报 409 锁冲突；过长会阻塞工作线程拉高尾延迟。 |
| `leaseTimeMs` | `long` | `5000L` | 否（可选） | 正数（`>= 100`），单位：毫秒；例如 `10000L`。<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | 锁租约最大持有时间（毫秒），防止死锁（默认 5000L）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：必须大于最慢 p99 事务耗时，否则锁在写入中途提前过期将导致并发脏写。 |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 在可配置 TTL 窗口内防并发重复提交与请求重放。
- **运行时行为**: 由 IdempotencyAspect 与 ProxyIdempotencyGuardHelper 通过 Caffeine TTL 并发锁执行（冲突抛出 ConflictBusinessException HTTP 409）；缺省键自动放行，IdempotencyManagerHelper 可选提供 SHA-256 辅助方法。
- **使用方法**: 标注在 `@AutoRestController` 接口/方法（由 `ProxyIdempotencyGuardHelper` 拦截）或非 `final` 的 Spring `@Service` Bean 方法上；执行失败时自动释放锁允许客户端重试，成功则持久化去重键。
- **适用场景**: 适用于电商下单支付、转账扣款及移动端弱网双连点易引发重复请求的 POST 写操作。
- **何时不适用及注意事项**: 不要加在 GET 只读查询上，也不要直接标在 `@CustomEndpoint` 方法期待 Spring AOP 生效（请标在被委托的 Spring Bean 方法上）；多节点集群需自定义 `IdempotencyStoreProvider` SPI。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | 否（可选） | 合法的 HTTP 请求/响应头名称（传输时大小写不敏感，例如 `"X-Idempotency-Key"`）。<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | 承载客户端幂等键的 HTTP 请求头名称；未传或传空字符串时不触发拦截。<br/>*注意:* 客户端每次业务提交须生成唯一 UUIDv7 并在网络重试时复用同一请求头；跨域场景需将该头加入 CORS `allowedHeaders`。 |
| `ttlSeconds` | `long` | `300L` | 否（可选） | 正数（`>= 1`），单位：秒；例如 `300L`。<br/>`@Idempotent(ttlSeconds = 900L)` | 去重记忆窗口期（秒），在此期间重放同一非空幂等键将抛出 HTTP 409 Conflict（默认 300L = 5 分钟）。<br/>*注意:* 响应快照在 Redis/内存中的保留时长；依据客户端重试窗口设为 `300L–86400L`（如支付回调建议 24 小时）。 |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 按 IP、User 或 Tenant 维度实施滑动窗口请求限流。
- **运行时行为**: 触发限流时递增 nwvmc.ratelimit.rejected.total 指标并返回 HTTP 429 Too Many Requests。
- **使用方法**: 标注在 `@AutoRestController` 接口类型或方法上；允许调用返回 `X-RateLimit-Remaining` 与 `X-RateLimit-Reset`，超限抛出 `RateLimitExceededException`（`HTTP 429` + `Retry-After`）。
- **适用场景**: 用于公开查询、登录/验证码接口、Spring AI 自然语言查询及大批量导出导入接口，防止刷接口与 DDoS 资源耗尽。
- **何时不适用及注意事项**: 不要在健康检查上设过低阈值；若需防止单一租户或用户拖垮全局流量，请避免 `partitionKey = "GLOBAL"`，改用 `"USER"`、`"TENANT"`、`"IP"` 或 `#expr`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | 否（可选） | 正数（`>= 1`），单位：请求数；例如 `60`。<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | 每个滑动时间窗口允许的最大请求次数（默认 60）。<br/>*注意:* 触发限流返回 HTTP `429` 时自动附带 `X-RateLimit-Remaining`、`X-RateLimit-Reset` 与 RFC 6585 `Retry-After` 响应头。 |
| `windowSeconds` | `int` | `60` | 否（可选） | 正数（`>= 1`），单位：秒；例如 `60`。<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | 限流时间窗口长度（秒），默认 60 秒。<br/>*注意:* 定义限流计数窗口时长，同时决定 `X-RateLimit-Reset` 重置时间戳与 `Retry-After` 建议等待秒数。 |
| `partitionKey` | `String` | `"IP"` | 否（可选） | 支持以下固定取值之一：`"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive)。<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | 限流分桶维度（忽略大小写）："IP"/"clientIp"（客户端 IP）、"USER"（登录主体，匿名回退 IP）、"TENANT"（租户上下文）、"GLOBAL"（全局共享桶）或 SpEL "#expr"。<br/>*注意:* `"USER"` 按登录主体隔离并在匿名请求时自动降级为客户端 IP；`"GLOBAL"` 由全部调用方共享单一配额，公开接口请慎用。 |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 使用 Resilience4j 熔断器保护实体操作，并向 Actuator 与 Micrometer 上报实时状态指标。
- **运行时行为**: 当故障率超阈值时跳闸至 OPEN 状态（HTTP 503），并更新 nwvmc.resilience.circuitbreaker.state 仪表盘指标。
- **使用方法**: 标注在对接外部 REST 服务、AI 网关或高风险资源的控制器/方法上，结合 Resilience4j 实现故障快速降级。
- **适用场景**: 当下游依赖持续故障时，需要触发快速失败（返回 `HTTP 503`）而非耗尽线程池等待超时时使用。
- **何时不适用及注意事项**: `CircuitBreakerErrorFilterUtil` 会自动忽略 4xx `BaseBusinessException`（`400`/`401`/`403`/`404`/`409`）；切勿将业务校验失败包装成普通 `RuntimeException` 导致误触发熔断（`503`）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"payment-gateway-cb"`）；留空 `""` 则采用框架默认命名约定。<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j 熔断器实例名称；留空时默认采用实体或控制器名称。<br/>*注意:* 用作 Resilience4j 注册实例名与 Micrometer 监控指标标签；留空 `""` 时自动以控制器/实体类名命名。 |
| `failureRateThreshold` | `float` | `50.0f` | 否（可选） | 正数（`1.0f .. 100.0f`），单位：百分比；例如 `50.0f`。<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | 触发熔断跳闸（进入 OPEN 状态）的失败率百分比阈值（默认 50.0f%）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：4xx 业务异常（`BaseBusinessException`）已自动豁免，仅 5xx 与底层基础设施故障会计入熔断失败率。 |
| `waitDurationInOpenStateSeconds` | `int` | `10` | 否（可选） | 正数（`>= 1`），单位：秒；例如 `15`。<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | 熔断 OPEN 后拒绝请求（返回 HTTP 503）的冷却秒数，期满后进入 HALF_OPEN（默认 10 秒）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：4xx 业务异常（`BaseBusinessException`）已自动豁免，仅 5xx 与底层基础设施故障会计入熔断失败率。 |
| `slidingWindowSize` | `int` | `20` | 否（可选） | 正数（`>= 1`），单位：调用次数；例如 `20`。<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | 用于计算失败率的滑动统计窗口样本数量（默认 20 次调用）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：4xx 业务异常（`BaseBusinessException`）已自动豁免，仅 5xx 与底层基础设施故障会计入熔断失败率。 |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | 否（可选） | 正数（`>= 1`），单位：调用次数；例如 `5`。<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | 进入 HALF_OPEN 半开探测阶段时允许试探放行的请求次数（默认 5 次）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：4xx 业务异常（`BaseBusinessException`）已自动豁免，仅 5xx 与底层基础设施故障会计入熔断失败率。 |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 对瞬态故障自动实施可配置指数退避重试。
- **运行时行为**: 若所有配置的重试次数耗尽，则抛出框架标准异常响应。
- **使用方法**: 在控制器接口或方法上标注 `@EntityRetry`，通过指数退避自动恢复瞬时数据库死锁或网络抖动。
- **适用场景**: 适用于幂等 GET 查询、`@AutoPut` 全量更新，或已由 `@Idempotent` 保护且偶发瞬断的下游调用。
- **何时不适用及注意事项**: 严禁放在未配 `@Idempotent` 的非幂等 POST 创建或扣款接口上（会造成重复扣款）！也不要在强低延迟接口上设置过长退避总耗时。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"erp-sync-retry"`）；留空 `""` 则采用框架默认命名约定。<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j 重试实例注册名称。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：请核算 `maxAttempts` 与退避时间总和，确保总耗时低于上游网关超时阈值。 |
| `maxAttempts` | `int` | `3` | 否（可选） | 正数（`>= 1`），单位：尝试次数；例如 `3`。<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | 最大执行总次数（包含首次调用，默认 3 次）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：请核算 `maxAttempts` 与退避时间总和，确保总耗时低于上游网关超时阈值。 |
| `waitDurationMs` | `long` | `500L` | 否（可选） | 正数（`>= 50`），单位：毫秒；例如 `500L`。<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | 首次重试前的初始等待毫秒数（默认 500L）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：请核算 `maxAttempts` 与退避时间总和，确保总耗时低于上游网关超时阈值。 |
| `backoffMultiplier` | `double` | `2.0d` | 否（可选） | 正数（`>= 1.0d`），单位：倍率因子；例如 `2.0d`。<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | 指数退避乘数系数（默认 2.0d -> 500ms、1000ms...）。<br/>*注意:* 请根据生产延迟 SLA 谨慎调优：请核算 `maxAttempts` 与退避时间总和，确保总耗时低于上游网关超时阈值。 |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **所属包名**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 自动计算 RFC 7232 弱 ETag（W/"..."）并下发 Cache-Control 与 HTTP 304 Not Modified 条件缓存响应。
- **运行时行为**: 将 HTTP 缓存 HIT/MISS 计数实时记录至 nwvmc.cache.http.requests 指标。
- **使用方法**: 标注在只读控制器或特定 GET 方法上（如 `maxAgeSeconds = 120`），自动产出标准 `ETag`、`Cache-Control` 并支持 `304 Not Modified`。
- **适用场景**: 适用于半静态商品目录、字典数据及公开列表接口，大幅降低带宽和重复序列化开销。
- **何时不适用及注意事项**: 若接口返回用户私有 PII、多租户财务数据或按角色字段脱敏结果，严禁使用默认 `isPrivate = false`（公有 CDN 缓存会导致严重越权泄露）！请改用 `isPrivate = true` 或禁用 HTTP 缓存。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | 否（可选） | 正数（`>= 0`），单位：秒；例如 `120`。<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | HTTP Cache-Control 响应头中的 max-age 秒数（默认 60 秒）。<br/>*注意:* 输出 `Cache-Control: max-age=<N>`。设为 `0` 并结合 `mustRevalidate = true` 与 `generateETag = true` 可实现每次条件协商与 `304` 零流量复用。 |
| `isPrivate` | `boolean` | `false` | 否（可选） | `true`（仅浏览器私有缓存，禁止共享 CDN 缓存）或 `false`（公有缓存，允许代理和 CDN 共享）。<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true 输出 private 指令禁止共享代理/CDN 缓存；false 输出 public。<br/>*注意:* 关键安全提示：凡是带认证、多租户或 `@FieldSecurity` 掩码的接口必须设为 `isPrivate = true`，防止共享 CDN 将用户 A 的响应错发给用户 B。 |
| `mustRevalidate` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | 追加 ", must-revalidate" 指令，要求过期缓存必须回源验证。<br/>*注意:* 指示中间缓存一旦超过 `maxAgeSeconds` 必须向源站重新校验，禁止返回过期脏数据。 |
| `generateETag` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | 计算 SHA-256 ETag，若命中客户端 If-None-Match 请求头直接返回 304 Not Modified 节省带宽。<br/>*注意:* 基于序列化响应体生成 RFC 7232 弱 `ETag`，当客户端 `If-None-Match` 命中时直接返回 `304 Not Modified`（0 字节响应体）。 |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 在 Caffeine L1 或 Redis L2 缓存引擎中缓存服务端只读方法返回值。
- **运行时行为**: 支持通过 app.framework.cache.type 全局切换缓存引擎实现。
- **使用方法**: 标注在服务层的读取方法上（如 `@AutoCacheable(value = {"entityDetails"})`），读写缓存引擎由 `app.framework.cache.type` 统一切换。
- **适用场景**: 适用于读多写少（读写比 > 10:1）的主键详情检索或高频元数据读取场景（框架返回浅拷贝防止响应投影破坏缓存）。
- **何时不适用及注意事项**: 切勿缓存直接暴露给 `?fields=` 或 `@FieldSecurity` 原地修改的可变实体实例（务必克隆）；高写少读的表亦不应开启缓存。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`{"productCatalog"}` (Caffeine/Redis cache region names)。<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | 缓存名称数组，依据 app.framework.cache.type 路由到底层 Caffeine L1 或 Redis L2。<br/>*注意:* 缓存区名称须与 Caffeine/Redis 配置一致；每个写/删操作务必配对相同的 `@AutoCacheEvict(value = ...)` 防止读到陈旧数据。 |
| `key` | `String` | `""` | 否（可选） | 引用方法参数的 SpEL 表达式（例如 `"'product:' + #id"`），留空 `""` 则自动生成键。<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL 缓存键表达式（`v0.1.0` AutoCacheAspect 内置对 `EntityName:id` 的确定性解析以防 Class 反射异常）。<br/>*注意:* 在多租户应用中，缓存键必须包含租户标识，严防跨租户缓存串读。 |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 在数据发生写入变更时自动失效并清理过期缓存条目。
- **运行时行为**: 在变更执行完成后清理缓存，彻底杜绝脏读残片。
- **使用方法**: 标注在更新和删除方法上并与 `@AutoCacheable` 读取键匹配，保证修改后缓存立即可见最新数据。
- **适用场景**: 当通过 `@AutoCacheable` 缓存实体后，在单条修改、状态流转或删除处配对清除对应键值以防脏读。
- **何时不适用及注意事项**: 不要在高频 `create` 创建接口上盲目开启 `allEntries = true`（会诱发缓存雪崩/击穿 `Cache Stampede`）。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 否（可选） | 包含零个或多个以下有效标识的数组：`{"productCatalog"}` (target cache region names to evict)。<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | 方法成功执行后需要清除的缓存空间名称数组。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `value` 配置会在接收流量前快速失败。 |
| `key` | `String` | `""` | 否（可选） | 引用方法参数的 SpEL 表达式（例如 `"'product:' + #id"`），留空 `""` 则自动生成键。<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | 定位被修改单条记录缓存项的 SpEL 键表达式（如 `EntityName:id`）。<br/>*注意:* 必须与 `@AutoCacheable.key` 生成完全一致的键格式；当 `allEntries = true` 时该属性被忽略。 |
| `allEntries` | `boolean` | `false` | 否（可选） | `true`（清空目标缓存区内的全部条目）或 `false`（仅淘汰由 key 解析出的单条缓存记录）。<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | 设为 true 时清除缓存；`v0.1.0` 按当前实体前缀安全清理，不再误清空其他实体缓存。<br/>*注意:* 高并发下清空整个缓存区容易引发数据库缓存雪崩（惊群效应）；优先使用精准 `key` 淘汰策略。 |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **所属包名**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 实时监测方法执行耗时，当慢调用超过阈值时自动输出 WARN 告警日志。
- **运行时行为**: 同时通过 DynamicEntityMetricsHelper 向 Micrometer 上报耗时直方图计时器。
- **使用方法**: 标注在控制器接口、特定方法或 Spring Service 上（如 `warningThresholdMs = 300`），实时捕捉超时慢接口。
- **适用场景**: 适用于复杂报表、批处理、GraphQL 解析器及 `@CustomQuery` 处理器，第一时间在日志中暴露慢 SQL 退化。
- **何时不适用及注意事项**: 生产高并发路径禁止将 `warningThresholdMs` 设为 `0`（避免每次正常请求疯狂打印 `WARN` 日志），也不应标注在长连接 SSE `/events` 上。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | 否（可选） | 正数（`>= 1`），单位：毫秒；例如 `300L`。<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | 耗时告警阈值（毫秒），超过时记录 `WARN` 慢查询日志并触发 Micrometer 观测指标（默认 500L）。<br/>*注意:* 耗时超过此阈值时输出包含 `traceId` 的结构化 `WARN` 日志；请按接口 SLA 设为合理值（`200L–1000L`）以免日志刷屏。 |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **所属包名**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **核心用途**: 事务提交后在 Java 21 虚拟线程上异步发送经 HMAC-SHA256 签名的出站 Webhook。
- **运行时行为**: 通过 WebhookHmacSignerHelper 计算签名并采用恒定时间安全比较算法防计时攻击。
- **使用方法**: 标注在 JPA `@Entity` 上并配置目标订阅 URL；仅在数据库事务成功提交后通过 Outbox/Virtual Threads 异步签名投递。
- **适用场景**: 用于订单、支付、物流状态落库提交后，向外部商户或合作方 ERP 系统推送 HMAC 签名回调通知。
- **何时不适用及注意事项**: 若实体含敏感隐私/PCI 密钥字段请设 `includeFullPayload = false`；切勿订阅未校验的内网 SSRF 地址。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | 否（可选） | 包含零个或多个以下有效标识的数组：`"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`。<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | 触发 HMAC 签名 Webhook 异步推送的事件类型数组（默认覆盖创建/更新/删除/状态变更）。<br/>*注意:* 在数据库事务提交后（`AFTER_COMMIT`）异步投递，确保已回滚的变更绝不会发送虚假 Webhook 通知。 |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | 否（可选） | 合法的 HTTP 请求/响应头名称（传输时大小写不敏感，例如 `"X-Webhook-Signature"`）。<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | 承载 HMAC-SHA256 防篡改签名的 HTTP 请求头名称。<br/>*注意:* 携带 HMAC-SHA256 载荷签名；接收方在处理业务前必须使用常量时间比对验证签名防止伪造。 |
| `includeFullPayload` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@EntityWebhook(includeFullPayload = false)` | true 在 Webhook 载荷中附带实体 JSON 快照；false 仅发送实体 ID 与事件元数据（适合高安全通知）。<br/>*注意:* 对于包含 PII 或财务敏感数据的实体请设为 `false`（仅推送 ID 与事件类型），让订阅方通过鉴权 GET 拉取已脱敏字段。 |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **所属包名**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 在数据库事务提交后发布符合 CNCF CloudEvents v1.0 规范的事件信封。
- **运行时行为**: 依托 TransactionRuntimeBridge.executeAfterCommit 回调机制，彻底杜绝回滚幽灵事件。
- **使用方法**: 标注在实体或控制器方法上，监听器通过 Spring `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)` 接收标准化 `CloudEventEnvelopeDto`。
- **适用场景**: 用于模块化和微服务解耦架构中各 Bounded Context（如订单 -> 库存 -> 通知）间的异步事件驱动通信，彻底避免跨模块 SQL JOIN。
- **何时不适用及注意事项**: 不要将面向内部领域解耦的 `@PublishCloudEvent` 与外部签名回调 `@EntityWebhook` 混淆；监听器务必在 `AFTER_COMMIT` 后执行以防脏读回滚。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | 否（可选） | 非空标识字符串（例如 `"com.acme.order.lifecycle"`）；留空 `""` 则采用框架默认命名约定。<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` 标识（如 "io.nwvmc.order.created"）。<br/>*注意:* 遵循 CloudEvents 1.0 反向域名命名规范（`com.company.domain.event`）；留空 `""` 时自动按包名和实体名生成。 |
| `source` | `String` | `""` | 否（可选） | 以 `/` 开头的合法 HTTP 路径（例如 `/services/order-api`），或空字符串 `""` 表示自动推导。<br/>`@PublishCloudEvent(source = "/services/order-api")` | 标识事件来源微服务上下文的 CloudEvents `source` URI。<br/>*注意:* 填充 CNCF CloudEvents 标准 `source` URI 字段，便于跨微服务事件血缘追踪。 |
| `publishOnCreate` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | POST 创建提交后是否发布 CloudEvent（默认 true）。<br/>*注意:* 仅在事务提交后（`AFTER_COMMIT`）通过 Spring 事件总线 / Kafka / RabbitMQ 桥接发布。 |
| `publishOnUpdate` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@PublishCloudEvent(publishOnUpdate = true)` | PUT/PATCH 更新提交后是否发布 CloudEvent（默认 true）。<br/>*注意:* 对高频更新字段（如浏览计数）建议设为 `false`，避免下游消息队列被无关变更淹没。 |
| `publishOnDelete` | `boolean` | `true` | 否（可选） | `true`（启用）或 `false`（禁用）。<br/>`@PublishCloudEvent(publishOnDelete = true)` | DELETE 删除提交后是否发布 CloudEvent（默认 true）。<br/>*注意:* 同时覆盖物理删除与 `@SoftDelete` 软删除，保障下游只读视图与搜索索引保持同步。 |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **所属包名**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 将实体或查询操作动态绑定到指定名称的逻辑数据源标识。
- **运行时行为**: 将数据源路由命中次数记录至 framework.datasource.routing.total 指标。
- **使用方法**: 标注在控制器或非 `final` 的 Spring `@Service` 方法上，例如 `@TargetDataSource("REPLICA")`；退出方法时自动恢复原数据源上下文防止 ThreadLocal 泄漏。
- **适用场景**: 适用于 CQRS 读写分离（将重查询/BI 报表路由至只读副本 `REPLICA`）或多库分片路由场景。
- **何时不适用及注意事项**: 切勿在已经开启 `@Transactional` 并获取 JDBC 连接的事务内部半途切换 `@TargetDataSource`（RoutingDataSource 仅在开启事务获取连接前生效）！且类不可为 `final`。

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | 否（可选） | 支持以下固定取值之一：Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`。<br/>`@TargetDataSource("REPLICA")` | 切换 `DataSourceContextHolder` 的数据源路由标识（如 "PRIMARY"、"REPLICA"）。<br/>*注意:* 必须与 `DynamicRoutingDataSource` 注册的键名完全一致；未注册的键将回退到 `PRIMARY` 或按配置快速失败。 |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **所属包名**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **核心用途**: 为每个实体声明目标数据库引擎家族及逻辑集群分片属性。
- **运行时行为**: 运行时由 MultiPlatformDataSourceRegistryHelper 与 TenantDatabaseRoutingResolverHelper 动态解析路由。
- **使用方法**: 标注在领域 JPA `@Entity` 或服务方法上声明其归属的数据库引擎与集群，供 Studio 拓扑及多数据源路由器识别。
- **适用场景**: 用于多引擎混合持久化或分库分集群架构（如账务隔离集群、分析数仓集群、审计归档集群）。
- **何时不适用及注意事项**: 请注意 `@TargetDatabasePlatform` 仅是声明式拓扑亲和元数据（仍需在 YAML/Config 配置真实 JDBC 连接池），且严禁跨不同数据库集群的实体编写 JPA `@ManyToOne` SQL JOIN！

| 属性名 | Java 类型 | 默认值 | 是否必填 | 有效值与示例 | 说明与运行时注意 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | 否（可选） | 支持以下固定取值之一：`"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | 声明目标数据库引擎亲和标识（"H2"、"POSTGRESQL"、"MYSQL"、"ORACLE" 等）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `platform` 配置会在接收流量前快速失败。 |
| `cluster` | `String` | `"PRIMARY"` | 否（可选） | 支持以下固定取值之一：`"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | 声明数据库集群或分片层级（"PRIMARY"、"FINANCE_CLUSTER"、"ANALYTICS_CLUSTER"、"AUDIT_CLUSTER"）。<br/>*注意:* 在应用启动阶段即刻校验；拼写错误或非法的 `cluster` 配置会在接收流量前快速失败。 |
| `readOnly` | `boolean` | `false` | 否（可选） | `true`（路由至只读从库连接池）或 `false`（路由至可读写主库连接池）。<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | 设为 true 时提示调度倾向于只读副本节点。<br/>*注意:* 严禁在写接口（`POST`/`PUT`/`PATCH`/`DELETE`）上设为 `true`——只读从库会拒绝写入并跳过脏检查刷新。 |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
