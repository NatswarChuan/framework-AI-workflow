# 06. Complete Specification of All 60 Declarative Annotations (`0.1.0`)

> **Languages**: **English** | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [All 20 Languages](../README.md) | [Complete Manual](../../GUIDE_EN.md) | [20-Language Interactive Portal](../../index.html#annotations)

Exhaustive technical reference for all **60 Declarative Annotations** in `io.github.natswarchuan:spring-nwvmc:0.1.0`, extracted verbatim from Java `@interface` declarations: exact package, `@Target`, **every attribute**, Java type, resolved default value, required vs. optional flag, **how to use**, **when to use**, **when NOT to use & common pitfalls**, and verified Java code snippets.

## Quick Matrix Index (60 Annotations)

| Annotation | Category | `@Target` | Attribute Summary | Core Purpose |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Transforms an interface extending AutoApiController<E> into a runtime JDK Dynamic Proxy registering 40 contracts (38 visible by default in Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Redirects a declared controller contract to a custom Spring bean method via MethodHandleCacheUtil instead of dynamic CRUD. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Binds domain-specific workflow routes (checkout, refund, approval) to independent Spring @Component Helper beans. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Pure Java replacement for @GetMapping without static Spring Web imports. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Pure Java HTTP POST route declaration supporting custom consumes/produces media types. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Pure Java HTTP PUT route mapping for full resource replacement. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Pure Java HTTP PATCH declaration supporting partial merges, atomic increments, and RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Pure Java HTTP DELETE declaration triggering state-guarded soft deletion. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Binds URL query parameters or Map<String, String> dynamic filter maps. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Binds URI path variables such as UUIDv7 entity IDs. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Deserializes HTTP JSON request payloads into DTO or Entity parameters paired with @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Allows recursive traversal on child relationships via GET /{id}/{relation}/** with cyclic loop rejection. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Declares declarative domain state transitions or numeric adjustments on custom action methods. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Framework component marker registered at bootstrap without compile-time @Component import. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Service-layer stereotype marker for ServiceImpl classes paired with @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Declares managed bean factory methods inside @AutoConfigurationBean classes. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Marks configuration classes and YAML @ConfigurationProperties binding models. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Controls execution priority order among SPI Customizer beans and filter chains. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Enforces NIST Level 2 RBAC, record-level ownerField isolation, and fine-grained permission codes before querying or mutating entities. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Masks or nullifies sensitive columns dynamically when caller roles lack permission. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Enforces allowed state transitions via POST /{id}/transition and restricts DELETE /{id} to deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Compiles readable English policy clauses into active RBAC, transition, and masking rules. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Records field-level diffs across mutations powering Time-Travel state reconstruction and /diff inspection. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Isolates row queries and mutations automatically by active tenant context unless caller holds a bypass role. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Validates uniqueness before persistence on create, update, and upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Auto-generates unique prefixed business codes on creation or clone when left blank. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Synthesizes normalized URL-friendly ASCII slugs automatically from sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Computes derived numeric totals cleanly prior to saving entity changes. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Allows binding custom SQL/JPQL or provider helper methods to controller endpoints. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Designates a JPA Entity as the live Database RBAC Role catalog table. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the unique authority/role code column inside a @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifies the human-readable role display name field on a @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Marks the collection or CSV string field holding granted permission codes on a role entity. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Marks a JPA Entity storing resource-action permissions and dynamic field-masking rules. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Designates the unique permission identifier field inside @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the target entity or API resource name (or wildcard *) inside @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the logical CRUD or custom action verb protected by a @SecurityPermissionEntity rule. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Declares comma-separated entity fields that must be dynamically redacted when this DB permission rule triggers. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Maps the JPA Entity binding authenticated user subjects to DB roles and optional tenant scopes. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Identifies the principal subject / username field on a @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Binds the assigned role code column inside @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Scopes a @SecurityUserRoleEntity assignment to a specific tenant identifier (or * for global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Marks a JPA Entity storing explicit ALLOW / DENY runtime authorization policies prioritized by priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the target resource identifier pattern in a @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the protected operation verb (READ, WRITE, DELETE, methodName, *) inside @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Maps the collection or comma-separated roles targeted by a @SecurityPolicyEntity rule. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Specifies ALLOW or DENY policy decision outcome on a @SecurityPolicyEntity rule. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serializes concurrent access on SpEL keys cached in AST map (max 1024 entries; waitTimeMs=3000L, leaseTimeMs=5000L defaults). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Prevents concurrent or replayed duplicate writes within configurable TTL windows. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Enforces sliding-window request throttling per IP, User, or Tenant partition. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Wraps operations inside Resilience4j Circuit Breakers reporting telemetry to Actuator & Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Automatically retries transient failures with configurable exponential backoff. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Computes RFC 7232 weak ETags (W/"...") and emits Cache-Control + HTTP 304 Not Modified responses. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Caches server-side read method outputs inside Caffeine L1 / Redis L2 engines. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Evicts stale server-side cache entries upon mutations. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Profiles execution duration and emits WARN logs when slow calls exceed threshold. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Sends post-commit asynchronous HMAC-SHA256 signed outbound webhooks on Virtual Threads. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Publishes CNCF CloudEvents v1.0 envelopes after transaction commit. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Pins entity or query operations to a logical named datasource key. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Assigns database engine family and logical cluster shard per entity. |

---

## 1. Routing, Dynamic API Contracts, DTO Decoupling & Parameter Binding (13 Annotations)

### `@AutoRestController`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Purpose**: Transforms an interface extending AutoApiController<E> into a runtime JDK Dynamic Proxy registering 40 contracts (38 visible by default in Swagger UI).
- **Runtime Behavior**: DynamicControllerProxyRegistrarHelper scans enabled controllers at boot and registers routes into Spring MVC RequestMappingHandlerMapping.
- **How to Use**: Place `@AutoRestController(basePath = "/api/v1/...")` on a Java `interface` extending `AutoApiController<E>` or narrow capability interfaces such as `AutoReadApi<E>`. Configure `readDto`/`createDto`/`updateDto` and `disabledEndpoints` to tailor the exposed surface.
- **When to Use**: Use whenever exposing standardized CRUD, pagination, filtering, keyset, analytics, or read-only endpoints for a JPA entity without writing boilerplate Controller/Service/Repository classes.
- **When NOT to Use & Pitfalls**: Do NOT place on concrete `@RestController` classes, or on workflows that have no backing JPA entity (such as third-party webhooks/aggregations; use standard Spring `@RestController` or `@ServiceOverride`). Prefer `AutoReadApi<E>` instead of full `AutoApiController<E>` for public read-only catalogs.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | No (Optional) | Valid HTTP path starting with `/` (e.g., `/api/v1/product-catalogs`) or empty string `""` to auto-derive.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Explicit root URI path (e.g. "/api/v1/product-catalogs"). When empty, derived from controller name in kebab-case plural.<br/>*Caveat:* At startup the proxy registrar evaluates `basePath` before `path`. Avoid setting conflicting values on both attributes simultaneously. |
| `path` | `String` | `""` | No (Optional) | Valid HTTP path starting with `/` (e.g., `/api/v1/orders`) or empty string `""` to auto-derive.<br/>`@AutoRestController(path = "/api/v1/orders")` | Legacy/alias root URI attribute. Prefer basePath because DynamicControllerProxyRegistrarHelper prioritizes extractCustomBasePath().<br/>*Caveat:* At startup the proxy registrar evaluates `basePath` before `path`. Avoid setting conflicting values on both attributes simultaneously. |
| `entityName` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"ProductCatalog"`); leave `""` to use the framework default convention.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Overrides the display entity name in OpenAPI/Studio metadata instead of using the generic E simple class name.<br/>*Caveat:* Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio; extract strings into `OpenApiConstant` to obey zero hard-code rules. |
| `enabledEndpoints` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Allowlist of exact contract method names (e.g. "getPage", "create"). Empty array allows all inherited capability methods.<br/>*Caveat:* Acts as a strict allowlist: when non-empty, every AutoApiController method NOT listed here is omitted from Spring MVC and Swagger UI. Prefer this for public read-only APIs. |
| `disabledEndpoints` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Denylist disabling exact AutoApiController method names before MVC mapping (e.g. "deleteById", "batchChunked", "importCsv").<br/>*Caveat:* Evaluated after `enabledEndpoints`; use this denylist to block destructive or bulk endpoints while retaining the rest of the 40 generated contracts. |
| `enableNestedSubResources` | `boolean` | `false` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Enables recursive GET /{id}/** sub-resource navigation. Defaults to false to prevent route bloat on large schemas.<br/>*Caveat:* Keep `false` unless deep `GET /{id}/items/...` traversal is required; enabling globally across large schemas increases route count and requires `@EnableNestedSubResource` allowlists. |
| `readDto` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `ProductReadDto.class`) or `Void.class` to disable DTO mapping.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | Optional projection DTO hiding internal entity fields at serialization time; Void.class returns the entity (with field masking).<br/>*Caveat:* Applies exclusively to the read (GET) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `ProductCreateDto.class`) or `Void.class` to disable DTO mapping.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | Optional inbound DTO validated via Jakarta Validation before POST mapping into entity E.<br/>*Caveat:* Applies exclusively to the create (POST) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `ProductUpdateDto.class`) or `Void.class` to disable DTO mapping.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | Optional inbound DTO restricting writable fields and running Bean Validation on PUT/PATCH updates.<br/>*Caveat:* Applies exclusively to the update (PUT/PATCH) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |

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
- **Purpose**: Redirects a declared controller contract to a custom Spring bean method via MethodHandleCacheUtil instead of dynamic CRUD.
- **Runtime Behavior**: EscapeHatchDispatchHelper resolves target bean (by targetBean class or beanName) and caches unreflected MethodHandle in MethodHandleCacheUtil.
- **How to Use**: Annotate a specific method (or entire controller interface) inside an `@AutoRestController` with `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")`. Declare standard Spring `@Component`/`@Service` on `MyHelper` and ensure parameter types align.
- **When to Use**: Use when 90% of endpoints work out of the box, but one specific endpoint (e.g., overridden `create`, custom stats, complex multi-service orchestration) requires bespoke procedural Java code.
- **When NOT to Use & Pitfalls**: Do NOT pass a `String` literal to `targetBean` (it requires `Class<?>`, e.g. `MyHelper.class`; use `beanName` for strings). Also avoid `@ServiceOverride` when standard CRUD with `@HumanPolicy` or `@EntitySecurity` already satisfies the rule without custom code.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `OrderCustomService.class`) or `Void.class` to disable DTO mapping.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Target Spring bean class (takes precedence over beanName). Avoid specifying interfaces if multiple beans implement it without @Primary.<br/>*Caveat:* At startup the proxy registrar evaluates `targetBean` before `beanName`. Avoid setting conflicting values on both attributes simultaneously. |
| `beanName` | `String` | `""` | No (Optional) | Exact Spring/NWVMC bean name registered in the ApplicationContext (e.g., `"orderCustomService"`), or `""` to auto-resolve.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Explicit Spring container bean name resolved when targetBean is Void.class.<br/>*Caveat:* At startup the proxy registrar evaluates `targetBean` before `beanName`. Avoid setting conflicting values on both attributes simultaneously. |
| `methodName` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"createOrder"`); leave `""` to use the framework default convention.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Method name on the target bean. If empty, defaults to the annotated controller method name.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"createOrder"`); mismatches silently skip or trigger a runtime lookup error. |
| `bypassAutoDispatch` | `boolean` | `true` | No (Optional) | `true` (bypass default proxy and invoke target bean directly) or `false` (run target bean before/alongside default dispatch).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | When true, skips default CRUD proxy dispatch completely and executes the custom bean method via MethodHandleCacheUtil.<br/>*Caveat:* When `true` (default), the built-in CRUD handler is skipped completely and your bean owns transaction/persistence. Set `false` only for pre/post hooks around default dispatch. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Binds domain-specific workflow routes (checkout, refund, approval) to independent Spring @Component Helper beans.
- **Runtime Behavior**: Invokes delegateBean.delegateMethod through cached MethodHandle lookup with full validation and transaction wrapping.
- **How to Use**: Combine with `@AutoPost`/`@AutoGet` or specify `httpMethod`/`path` on a controller method and point `delegateBean` + `delegateMethod` to a custom Spring bean helper.
- **When to Use**: Use for rich domain actions such as checkout, refund, order cancellation, report generation, or multi-entity transactions within an entity controller.
- **When NOT to Use & Pitfalls**: Do NOT pair controller-proxy `@EntitySecurity`/`@RateLimit`/`@Idempotent` expecting interception here (`@CustomEndpoint` dispatches directly via `ControllerProxySpecialRouteUtil` before `invokeProtectedOperation` — apply Spring AOP/security inside the delegated `@Component`/`@Service` bean or use `@ServiceOverride`), and do NOT duplicate `@BusinessAction` state transitions.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/reports/monthly-sales`); empty `""` binds to controller root.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Relative endpoint path under the controller basePath (e.g. "/checkout").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `path` values fail fast before serving traffic. |
| `httpMethod` | `String` | `"GET"` | No (Optional) | One of the supported tokens: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP verb to match ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `httpMethod` values fail fast before serving traffic. |
| `delegateBean` | `String` | `""` | No (Optional) | Exact Spring/NWVMC bean name registered in the ApplicationContext (e.g., `"orderReportService"`), or `""` to auto-resolve.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Spring bean name containing the workflow handler method; must be non-blank unless an interface default method or @ServiceOverride handles execution (CustomEndpointInvokerHelper throws if blank).<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `delegateBean` values fail fast before serving traffic. |
| `delegateMethod` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"buildMonthlyReport"`); leave `""` to use the framework default convention.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Target method name on delegateBean. Defaults to the annotated controller method name when blank.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"buildMonthlyReport"`); mismatches silently skip or trigger a runtime lookup error. |
| `summary` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"Get monthly revenue breakdown"`); leave `""` to use the framework default convention.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Short OpenAPI 3.0 operation summary displayed in Swagger UI.<br/>*Caveat:* Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio; extract strings into `OpenApiConstant` to obey zero hard-code rules. |
| `description` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"Aggregates confirmed invoice totals grouped by currency"`); leave `""` to use the framework default convention.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Detailed OpenAPI 3.0 operation documentation rendered when expanding the endpoint in Swagger UI.<br/>*Caveat:* Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio; extract strings into `OpenApiConstant` to obey zero hard-code rules. |

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
- **Purpose**: Pure Java replacement for @GetMapping without static Spring Web imports.
- **Runtime Behavior**: Mapped to HTTP GET RequestMappingInfo at proxy bootstrap.
- **How to Use**: Place `@AutoGet("/your-path")` on a custom or overridden method inside an `@AutoRestController` interface (often paired with `@ServiceOverride` or `@CustomQuery`).
- **When to Use**: Use for read-only HTTP GET custom routes inside pure-Java controller interfaces without importing Spring Web `@GetMapping`.
- **When NOT to Use & Pitfalls**: Do NOT use `@AutoGet` for operations that mutate database state or trigger side effects (use `@AutoPost`/`@AutoPut`/`@AutoPatch`/`@AutoDelete`), and avoid using it on standard concrete `@RestController` beans.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/{id}/summary`); empty `""` binds to controller root.<br/>`@AutoGet("/{id}/summary")` | Relative GET path template (e.g. "/metrics" or "/items/{id}"). Empty maps directly to controller basePath.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `produces` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json", "text/csv"}`); empty `{}` accepts default `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Optional produced media types (e.g. "text/event-stream", "application/json", "text/csv").<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Pure Java HTTP POST route declaration supporting custom consumes/produces media types.
- **Runtime Behavior**: Registered as HTTP POST handler in SpringMvcEndpointBridge.
- **How to Use**: Annotate a state-creating or action method with `@AutoPost("/path")` inside `@AutoRestController` and bind payloads with `@AutoBody` or `@RequestBody`. Combine with `@BusinessAction` or `@ServiceOverride`.
- **When to Use**: Use for non-idempotent creation endpoints, action commands, batch submissions, or custom workflow POST routes on pure-Java interfaces.
- **When NOT to Use & Pitfalls**: Do NOT use for read-only lookups (`@AutoGet`), idempotent full replacement (`@AutoPut`), partial field updates (`@AutoPatch`), or deletion (`@AutoDelete`).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/{id}/approve`); empty `""` binds to controller root.<br/>`@AutoPost("/{id}/approve")` | Relative POST URI path template under basePath (e.g. "/checkout").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json", "multipart/form-data"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Accepted request Content-Type media types (e.g. "application/json", "multipart/form-data").<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Response media types produced (e.g. "application/json").<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Pure Java HTTP PUT route mapping for full resource replacement.
- **Runtime Behavior**: Bound as HTTP PUT handler wrapped inside transactional execution.
- **How to Use**: Place `@AutoPut("/{id}")` on a full-update controller method paired with `@AutoVariable` (`UUID id`) and `@AutoBody` (`E` or `updateDto`).
- **When to Use**: Use for idempotent full-resource replacement or custom PUT actions expecting complete state payloads.
- **When NOT to Use & Pitfalls**: Do NOT use for sparse single-field updates or state transitions (`@AutoPatch` or `@BusinessAction`), and respect optimistic locking (`@Version` -> HTTP `409 Conflict`).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/{id}/replace`); empty `""` binds to controller root.<br/>`@AutoPut("/{id}/replace")` | Relative PUT path template (e.g. "/{id}").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Supported request Content-Type media types.<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Produced response media types.<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Pure Java HTTP PATCH declaration supporting partial merges, atomic increments, and RFC 6902 JSON Patch.
- **Runtime Behavior**: Supports JSON merge semantics and application/json-patch+json.
- **How to Use**: Place `@AutoPatch("/{id}/action")` on custom partial-update or declarative `@BusinessAction` methods in an `@AutoRestController`.
- **When to Use**: Use for partial field mutations, atomic counter adjustments, and state transitions (`@StateMachine` + `@BusinessAction`).
- **When NOT to Use & Pitfalls**: Do NOT use when the entire entity must be replaced strictly (use `@AutoPut`) or when creating new records (`@AutoPost`).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/{id}/status`); empty `""` binds to controller root.<br/>`@AutoPatch("/{id}/status")` | Relative PATCH URI path template (e.g. "/{id}/approve").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json", "application/merge-patch+json"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Accepted Content-Type media types.<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | No (Optional) | Array of MIME media types (e.g., `{"application/json"}`); empty `{}` accepts default `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Produced response media types.<br/>*Caveat:* Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Pure Java HTTP DELETE declaration triggering state-guarded soft deletion.
- **Runtime Behavior**: Validates @StateMachine deletableStates before marking deleted=true.
- **How to Use**: Place `@AutoDelete("/{id}/custom")` on custom deletion methods inside `@AutoRestController`, typically paired with `@ServiceOverride`.
- **When to Use**: Use for custom archive, soft-delete override, or cascade cleanup DELETE endpoints defined directly on controller interfaces.
- **When NOT to Use & Pitfalls**: Do NOT redefine `deleteById` if standard soft-delete (`DELETE /{id}`) with `@StateMachine(deletableStates = ...)` and `@EntitySecurity(deleteRoles = ...)` already handles it.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Relative URI sub-path with optional `{pathVar}` templates (e.g., `/{id}/archive`); empty `""` binds to controller root.<br/>`@AutoDelete("/{id}/archive")` | Relative DELETE URI path template (e.g. "/{id}/purge").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Purpose**: Binds URL query parameters or Map<String, String> dynamic filter maps.
- **Runtime Behavior**: Extracted via DynamicQueryParameterParserHelper with QueryGuardrailEnforcerUtil validation.
- **How to Use**: Place `@AutoParam("page")` or `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")` on method parameters in controller interfaces.
- **When to Use**: Use when keeping controller interfaces 100% Pure Java (zero `org.springframework.web.*` imports) while binding HTTP query parameters.
- **When NOT to Use & Pitfalls**: Never use `@AutoParam` for URI path placeholders (`{id}` -> `@AutoVariable`) or JSON request bodies (`@AutoBody`). Note: `v0.1.0` also supports standard Spring `@RequestParam` on controller interfaces if preferred.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"status"`); leave `""` to use the framework default convention.<br/>`@AutoParam("status") String status` | Query parameter name to bind (alias for name). Empty falls back to Java bytecode parameter name.<br/>*Caveat:* At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `name` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"pageSize"`); leave `""` to use the framework default convention.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Explicit query parameter name.<br/>*Caveat:* At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `required` | `boolean` | `true` | No (Optional) | `true` (required; missing value yields HTTP 400) or `false` (optional; null passed when omitted).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Whether omitting the query parameter triggers HTTP 400.<br/>*Caveat:* Automatically behaves as optional if `defaultValue` is explicitly provided; use `false` with boxed types (`Integer`, `Boolean`) rather than primitives to avoid NPE. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | No (Optional) | Non-empty identifier string (e.g., `"20"`); leave `""` to use the framework default convention.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Fallback string used when parameter is absent; defaults to ValueConstants DEFAULT_NONE sentinel (means no default, implies optional if set).<br/>*Caveat:* Parsed as String and converted via Spring `ConversionService` to the parameter target type; invalid literals fail with HTTP `400 Bad Request`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Purpose**: Binds URI path variables such as UUIDv7 entity IDs.
- **Runtime Behavior**: Parsed into typed Java UUID/String values from MVC path templates.
- **How to Use**: Annotate path identifier parameters like `findById(@AutoVariable("id") UUID id)` inside Pure Java controller interfaces.
- **When to Use**: Use whenever extracting `{id}`, `{slug}`, or `{code}` from URI templates in Pure Java interfaces.
- **When NOT to Use & Pitfalls**: Do NOT use for `?query=` parameters (`@AutoParam`) or HTTP JSON bodies (`@AutoBody`). Note: `v0.1.0` also accepts standard `@PathVariable`.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"orderId"`); leave `""` to use the framework default convention.<br/>`@AutoVariable("orderId") UUID orderId` | URI template path variable name to bind (alias for name).<br/>*Caveat:* At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `name` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"tenantCode"`); leave `""` to use the framework default convention.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Explicit URI template variable name.<br/>*Caveat:* At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `required` | `boolean` | `true` | No (Optional) | `true` (required; missing value yields HTTP 400) or `false` (optional; null passed when omitted).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Whether the path variable must resolve to a non-null value.<br/>*Caveat:* Path segments must match `{variableName}` in the method URI template (`@AutoGet("/{id}/...")`); setting `false` only applies when multiple optional URI patterns exist. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Purpose**: Deserializes HTTP JSON request payloads into DTO or Entity parameters paired with @Valid.
- **Runtime Behavior**: Validated with LocalValidatorFactoryBean before entering service transaction.
- **How to Use**: Place `@AutoBody` on the payload parameter of `@AutoPost`/`@AutoPut`/`@AutoPatch` methods inside Pure Java interfaces (combine with `@Valid` for Bean Validation).
- **When to Use**: Use when deserializing JSON payloads into entities, DTOs, or typed requests on Pure Java proxy controllers.
- **When NOT to Use & Pitfalls**: Do NOT place `@AutoBody` on GET/DELETE methods without HTTP bodies, or repeat `@AutoBody` twice on the same method signature.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | No (Optional) | `true` (required; missing value yields HTTP 400) or `false` (optional; null passed when omitted).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Whether a missing or null HTTP request body triggers HTTP 400.<br/>*Caveat:* Combine with `@Valid` to trigger Jakarta Bean Validation before proxy dispatch; setting `false` allows empty HTTP request bodies without throwing `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Allows recursive traversal on child relationships via GET /{id}/{relation}/** with cyclic loop rejection.
- **Runtime Behavior**: Requires controller @AutoRestController(enableNestedSubResources = true).
- **How to Use**: Set `enableNestedSubResources = true` on `@AutoRestController` and restrict reachable child associations with `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **When to Use**: Use when parent-child REST URLs like `GET /api/v1/customer-orders/{id}/items` are desired while still enforcing `@EntitySecurity`, `@MultiTenant`, and ownership checks at every hop.
- **When NOT to Use & Pitfalls**: Do NOT open on high-fanout tables without configuring `allowedRelationships`, or across Bounded Contexts that should only hold UUIDv7 foreign keys instead of JPA `@OneToMany` links.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Optional allowlist of reachable JPA target entity classes during recursive GET /{id}/** traversal.<br/>*Caveat:* Empty array allows all reachable child `@Entity` types; explicitly listing classes prevents unintentional exposure of internal audit or billing child tables. |
| `allowedRelationships` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Explicit allowlist of JPA association field names permitted in sub-resource URL paths (e.g. "items", "customer").<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"items"`); mismatches silently skip or trigger a runtime lookup error. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Declares declarative domain state transitions or numeric adjustments on custom action methods.
- **Runtime Behavior**: Executed atomically before persisting updated entity attributes.
- **How to Use**: Combine `@AutoPatch("/{id}/action")` with `@BusinessAction(targetStateField = "status", targetStateValue = "PAID", entityMethod = "markPaid")` on controller interfaces.
- **When to Use**: Use for single-entity workflow transitions (`approve`, `ship`, `cancel`), stock/salary increments, or invoking rich entity domain methods declaratively without writing a Service.
- **When NOT to Use & Pitfalls**: Do NOT use for multi-entity orchestration, third-party API calls, or asynchronous workflows (delegate to a Spring helper via `@ServiceOverride` or `@CustomEndpoint` instead).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a lifecycle status field (e.g., `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Entity field name holding the workflow state (validated against @StateMachine if present).<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"status"`); mismatches silently skip or trigger a runtime lookup error. |
| `targetStateValue` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"APPROVED"`); leave `""` to use the framework default convention.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Target state string to assign to targetStateField inside the transaction.<br/>*Caveat:* Validated automatically against `@StateMachine` or `@HumanPolicy` before persisting; illegal transitions abort with HTTP `409 Conflict` / `400 Bad Request`. |
| `adjustNumericField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a numeric field (e.g., `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Numeric entity property name (BigDecimal, Integer, Long) atomically incremented/decremented.<br/>*Caveat:* Requires either `deltaParamIndex >= 0` or a non-empty `fixedDelta`. Supports `Integer`, `Long`, `BigDecimal`, and `Double` inside the action transaction. |
| `deltaParamIndex` | `int` | `-1` | No (Optional) | One of the supported tokens: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Zero-based method parameter index carrying dynamic adjustment delta; -1 disables parameter lookup.<br/>*Caveat:* At startup the proxy registrar evaluates `deltaParamIndex` before `fixedDelta`. Avoid setting conflicting values on both attributes simultaneously. |
| `fixedDelta` | `String` | `""` | No (Optional) | One of the supported tokens: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Fixed numeric string delta (e.g. "100", "-1") used when deltaParamIndex is not set.<br/>*Caveat:* At startup the proxy registrar evaluates `deltaParamIndex` before `fixedDelta`. Avoid setting conflicting values on both attributes simultaneously. |
| `entityMethod` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"markFulfilled"`); leave `""` to use the framework default convention.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Optional zero-arg domain method name on the entity executed inside the same transaction.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"markFulfilled"`); mismatches silently skip or trigger a runtime lookup error. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean Discovery, Configuration Binding & Execution Ordering (5 Annotations)

### `@AutoComponent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Framework component marker registered at bootstrap without compile-time @Component import.
- **Runtime Behavior**: Framework-internal scan (io.github.natswarchuan); consumer apps should use Spring @Component.
- **How to Use**: Internal framework stereotype scanned by `AutoBeanFactoryRegistrarBridge` within package `io.github.natswarchuan`. Registered as singleton into the Spring context.
- **When to Use**: Use ONLY when contributing framework internals inside `io.github.natswarchuan.*` that must avoid compile-time `org.springframework.stereotype.Component`.
- **When NOT to Use & Pitfalls**: NEVER use in consumer applications (`com.example.*`, etc.)! `AutoBeanFactoryRegistrarBridge` only scans `io.github.natswarchuan` — use Spring `@Component` in consumer apps or your bean will NOT register.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Exact Spring/NWVMC bean name registered in the ApplicationContext (e.g., `"invoiceValidationHelper"`), or `""` to auto-resolve.<br/>`@AutoComponent("invoiceValidationHelper")` | Optional explicit container bean name; empty derives lowerCamelCase simple class name.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Service-layer stereotype marker for ServiceImpl classes paired with @ServiceOverride.
- **Runtime Behavior**: Scanned within io.github.natswarchuan by decapitalized simple class name; consumer services should use Spring @Service.
- **How to Use**: Internal framework service stereotype scanned inside `io.github.natswarchuan` to register framework service implementations without importing Spring `@Service`.
- **When to Use**: Use ONLY for framework internal services in `io.github.natswarchuan.*`.
- **When NOT to Use & Pitfalls**: NEVER use in application business services (`com.example.*`) — `AutoBeanFactoryRegistrarBridge` ignores packages outside `io.github.natswarchuan`; use Spring `@Service`.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Exact Spring/NWVMC bean name registered in the ApplicationContext (e.g., `"orderFulfillmentService"`), or `""` to auto-resolve.<br/>`@AutoService("orderFulfillmentService")` | Optional explicit service bean name; defaults to lowerCamelCase simple class name.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Declares managed bean factory methods inside @AutoConfigurationBean classes.
- **Runtime Behavior**: Processed by PureJavaBeanRegistrarBridge during auto-configuration.
- **How to Use**: Place on factory methods inside framework `@AutoConfigurationBean` classes; invoked reflectively by `AutoBeanFactoryRegistrarBridge`.
- **When to Use**: Use ONLY inside `io.github.natswarchuan.config.*` classes needing pure-Java conditional bean factories without Spring `@Bean`.
- **When NOT to Use & Pitfalls**: Do NOT use in consumer `@Configuration` classes; use standard Spring `@Bean` for custom SPI customizers (`SecurityIdentityCustomizer`, `DistributedLockProvider`, etc.).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Explicit bean name(s) and aliases.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `targetTypeName` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"com.example.spi.PaymentGateway"`); leave `""` to use the framework default convention.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Optional FQCN of target Spring type for bridging checks.<br/>*Caveat:* Optional FQCN hint when the factory method returns a broad supertype or dynamic proxy; ensure the class exists on the runtime classpath. |
| `primary` | `boolean` | `false` | No (Optional) | `true` (preferred bean when multiple candidates match) or `false` (standard candidate priority).<br/>`@AutoBean(primary = true)` | Marks the generated bean as primary candidate when resolving injection conflicts.<br/>*Caveat:* Declaring two `@AutoBean(primary = true)` definitions for the exact same type causes an ambiguous bean conflict at startup. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Marks configuration classes and YAML @ConfigurationProperties binding models.
- **Runtime Behavior**: Registers configuration beans and YAML prefixes cleanly with IDE metadata.
- **How to Use**: Marks Pure Java config and properties classes inside `io.github.natswarchuan.config.*` processed by `ControllerToApiAutoConfiguration` bootstrappers.
- **When to Use**: Use ONLY inside the framework library (`io.github.natswarchuan`) for Pure Java `@Configuration` / `@ConfigurationProperties` equivalents.
- **When NOT to Use & Pitfalls**: Do NOT place on consumer app configuration classes; consumer apps use Spring `@Configuration` and `@ConfigurationProperties`.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | Exact Spring/NWVMC bean name registered in the ApplicationContext (e.g., `"storageAutoConfig"`), or `""` to auto-resolve.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Optional configuration bean identifier.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `prefix` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"nwvmc.storage"`); leave `""` to use the framework default convention.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Optional YAML property prefix bound via PureJavaBeanRegistrarBridge (e.g. "app.framework.cache").<br/>*Caveat:* Binds matching kebab-case properties from `application.yml` into configuration beans; pair with `spring-configuration-metadata.json` for zero IDE warnings. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Purpose**: Controls execution priority order among SPI Customizer beans and filter chains.
- **Runtime Behavior**: Lower integer values execute earlier (default Integer.MAX_VALUE).
- **How to Use**: Place `@OrderPriority(1)` on pure-Java interceptors, customizers, or beans ordered by `AutoBeanFactoryRegistrarBridge`.
- **When to Use**: Use when deterministic ordering of framework beans or multiple SPI customizers matters without relying on `@Order`.
- **When NOT to Use & Pitfalls**: Do NOT confuse `@OrderPriority` with Spring Security filter ordering or JPA sort clauses — use `SecurityExposureCustomizer` and `?sort=` respectively.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | No (Optional) | One of the supported tokens: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Execution precedence integer; lower values execute earlier (Integer.MAX_VALUE is lowest priority).<br/>*Caveat:* Lower integers execute FIRST (identical to Spring `@Order`). Reserve values `< 0` for security/tracing filters and `10..100` for business interceptors. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Entity Security, State Machine, Integrity, Auto-Generators & Queries (11 Annotations)

### `@EntitySecurity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Enforces NIST Level 2 RBAC, record-level ownerField isolation, and fine-grained permission codes before querying or mutating entities.
- **Runtime Behavior**: Evaluated before SQL execution; unauthorized access throws HTTP 403 Forbidden.
- **How to Use**: Place `@EntitySecurity` on any JPA `@Entity` class. Specify `{read,write,delete}Roles`, optionally add `ownerField = "createdBy"` for row-level ownership, or `permitAll = true` for public catalogs.
- **When to Use**: Use on EVERY exposed `@Entity` as the primary defense-in-depth gate across REST, Batch, Export, and GraphQL queries.
- **When NOT to Use & Pitfalls**: Do NOT set `permitAll = true` on entities using full `AutoApiController<E>` unless write/delete routes are blocked via `AutoReadApi<E>`, `disabledEndpoints`, or explicit DB `@SecurityPolicyEntity` rules (`EntitySecurityEvaluatorHelper.isPermitAllWithoutDbOverride` skips `@EntitySecurity` role checks across READ, WRITE, and DELETE when no DB policy overrides the method).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_USER", "ROLE_ADMIN"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Roles authorized to read records (GET list/detail/analytics/GraphQL/export). Empty triggers default authenticated RBAC fallback.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `writeRoles` | `String[]` | `{}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_MANAGER", "ROLE_ADMIN"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Roles authorized for POST/PUT/PATCH/import/batch writes.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `deleteRoles` | `String[]` | `{}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Roles authorized for DELETE / batch-delete operations.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `permitAll` | `boolean` | `false` | No (Optional) | `true` (allow unauthenticated public access) or `false` (enforce authentication and role checks).<br/>`@EntitySecurity(permitAll = true)` | If true and no DB-RBAC policy overrides the target method, bypasses @EntitySecurity checks across ALL CRUD operations (READ, WRITE, DELETE); pair public catalogs with AutoReadApi<E> or disabledEndpoints.<br/>*Caveat:* Overrides `readRoles`/`writeRoles`/`deleteRoles` and allows anonymous HTTP calls. Never enable on PII, billing, or write-enabled internal entities. |
| `ownerField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a owner principal/UUID field (e.g., `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Entity field storing creator/owner subject ID (e.g. "createdBy", "ownerId"); enforces IDOR record-level ownership.<br/>*Caveat:* Enforces row-level ownership filtering on `GET`/`PUT`/`PATCH`/`DELETE`: users only see or mutate records where this field equals their authenticated principal unless holding a `bypassOwnerRoles` role. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Privileged roles allowed to access/modify records regardless of ownerField match.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `permissions` | `String[]` | `{}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ORDER_READ", "ORDER_APPROVE"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Fine-grained permission codes checked alongside roles (evaluated by Database RBAC or custom SecurityIdentityCustomizer).<br/>*Caveat:* Evaluated against fine-grained authorities from JWT claims or DB-RBAC `@SecurityPermissionEntity`; pairs cleanly with role checks for defense-in-depth. |

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
- **Purpose**: Masks or nullifies sensitive columns dynamically when caller roles lack permission.
- **Runtime Behavior**: Applied post-fetch prior to JSON serialization.
- **How to Use**: Place `@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` directly on sensitive JPA entity fields (`costPrice`, `ssn`, `salary`). Masking operates on shallow-cloned response copies so JPA managed entities and L1 cache remain uncorrupted.
- **When to Use**: Use when one endpoint/model serves multiple personas (`ROLE_USER` sees `******`/`null` while `ROLE_ADMIN` sees real prices/PII) across REST and GraphQL.
- **When NOT to Use & Pitfalls**: Do NOT assume `nullifyInsteadOfMask = false` leaks non-`String` secrets (`FieldMaskingExecutionHelper` always falls back to `null` for `BigDecimal`/`LocalDate`/`UUID`); set `nullifyInsteadOfMask = true` when **`String`** fields (like ISO dates or numeric codes) should serialize as `null` instead of `"******"`, and prefer `readDto` if the property key itself must be omitted.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_ADMIN", "ROLE_FINANCE"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Roles authorized to read the unmasked original field value.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `maskPattern` | `String` | `"******"` | No (Optional) | Non-empty identifier string (e.g., `"***-**-****"`); leave `""` to use the framework default convention.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Replacement mask string returned for String fields when caller lacks viewRoles.<br/>*Caveat:* Ignored when `nullifyInsteadOfMask = true`. For non-String fields (`BigDecimal`, `Integer`, `LocalDate`), prefer `nullifyInsteadOfMask = true` to keep JSON types strictly valid. |
| `nullifyInsteadOfMask` | `boolean` | `false` | No (Optional) | `true` (replace unauthorized field with JSON null) or `false` (apply maskPattern string (e.g. "******")).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | When true, forces String fields to null instead of maskPattern (non-String types like BigDecimal, LocalDate, UUID are already automatically set to null by FieldMaskingExecutionHelper).<br/>*Caveat:* Essential for numeric, date, and nested object fields so TypeScript/Zod clients receive valid `null` instead of a String mask breaking deserialization. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Purpose**: Enforces allowed state transitions via POST /{id}/transition and restricts DELETE /{id} to deletableStates.
- **Runtime Behavior**: Rejects illegal transitions or deletions with HTTP 422 BusinessRuleViolationException.
- **How to Use**: Place on a String state field (`@StateMachine(initial = "CREATED", transitions = {"CREATED:PAID,CANCELLED"}, deletableStates = {"CREATED", "CANCELLED"})`). Enforced automatically on PUT/PATCH/DELETE and `@BusinessAction`.
- **When to Use**: Use for strict finite lifecycle workflows (orders, loans, invoices, tickets) to guarantee illegal state jumps or deletes return `422 Unprocessable Entity`.
- **When NOT to Use & Pitfalls**: NEVER use `"->"` syntax (`EntityStateMachineUtil` splits strictly on `":"`!), and do not duplicate it with `HumanPolicy.lifecycle` on the same field without coordination.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | No (Optional) | Non-empty identifier string (e.g., `"CREATED"`); leave `""` to use the framework default convention.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Default initial workflow state automatically injected upon entity creation when field is blank.<br/>*Caveat:* Automatically populated on `POST` creation when the incoming status field is blank/null; must match the left side (before `:`) of at least one entry in `transitions`. |
| `transitions` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Allowed state transition rules using colon format "FROM:TO_1,TO_2" (e.g. "CREATED:PENDING_PAYMENT,CANCELLED").<br/>*Caveat:* Strictly enforces the exact colon syntax `"FROM:TO1,TO2"` (case-sensitive, comma-separated targets). Any `POST /{id}/transition` or `@BusinessAction` jumping to an undeclared state is rejected with HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Whitelist of states in which DELETE is permitted (others fail with HTTP 422 Unprocessable Entity). Empty allows delete from any state unless restricted.<br/>*Caveat:* When non-empty, `DELETE /{id}` and `batchDelete` fail with HTTP `409 Conflict` if the entity is in any other state (e.g., `"PAID"` or `"SHIPPED"`). |

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
- **Purpose**: Compiles readable English policy clauses into active RBAC, transition, and masking rules.
- **Runtime Behavior**: Inspectable per entity at GET /human-policy and overridable in YAML under spring-nwvmc.human-policies.<Entity>.
- **How to Use**: Place `@HumanPolicy` on an entity with structured English phrases, or bind via `spring-nwvmc.human-policies` YAML in `application.yml`. Compiled once by `HumanPolicyRegistryHelper` into `HumanPolicyDefinitionDto`.
- **When to Use**: Use when product managers, compliance officers, or YAML config teams want human-readable domain policies externalized cleanly without code edits.
- **When NOT to Use & Pitfalls**: Do NOT write arbitrary non-English prose or free-form essays — `HumanPolicyRegexCompilerHelper` matches deterministic English grammar templates. Use `@EntitySecurity` + `@StateMachine` directly for strict compile-time clarity.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | No (Optional) | One of the supported tokens: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Natural English lifecycle directive compiled into transitions (e.g. "starts at DRAFT, moves from DRAFT to ACTIVE...").<br/>*Caveat:* Compiled once at startup into the exact same finite state machine engine as `@StateMachine`; do not declare conflicting `@StateMachine` rules on the same entity. |
| `security` | `String` | `""` | No (Optional) | One of the supported tokens: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Natural English RBAC directive describing read/write/delete/owner rules.<br/>*Caveat:* Role tokens are normalized with the `ROLE_` prefix automatically; parsed eagerly at startup so malformed clauses fail fast. |
| `masking` | `String` | `""` | No (Optional) | One of the supported tokens: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Natural English field masking policy specifying masked fields and allowed viewer roles.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"costPrice"`); mismatches silently skip or trigger a runtime lookup error. |
| `stateField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a lifecycle status field (e.g., `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Entity field storing the managed lifecycle state when lifecycle is compiled.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"orderStatus"`); mismatches silently skip or trigger a runtime lookup error. |

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
- **Purpose**: Records field-level diffs across mutations powering Time-Travel state reconstruction and /diff inspection.
- **Runtime Behavior**: Captures oldValue and newValue deltas on create, update, patch, transition, and restore.
- **How to Use**: Annotate any `BaseAuditEntity` subclass with `@AuditTrail(recordFieldDiffs = true)`. All POST/PUT/PATCH/DELETE mutations log revision snapshots via `AuditTrailService` automatically.
- **When to Use**: Use on compliance-sensitive entities (orders, payments, clinical records, accounts, RBAC policies) needing `GET /{id}/revisions` Time-Travel auditing.
- **When NOT to Use & Pitfalls**: Set `recordFieldDiffs = false` or omit `@AuditTrail` on ultra-high-churn telemetry/log tables to avoid magnifying write amplification in audit storage.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"FINANCE_LEDGER"`); leave `""` to use the framework default convention.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Logical audit category topic recorded on every mutation event; empty defaults to entity class simple name.<br/>*Caveat:* Used to tag and filter audit log queries; leave `""` to default to the JPA entity simple class name. |
| `recordFieldDiffs` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | When true, computes old vs. new property JSON diffs backing Time-Travel (`GET /{id}/revisions`).<br/>*Caveat:* Captures before/after JSON field diffs on every `PUT`/`PATCH`; disable (`false`) on entities storing large BLOBs or high-frequency telemetry rows to save storage. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Isolates row queries and mutations automatically by active tenant context unless caller holds a bypass role.
- **Runtime Behavior**: Fail-closed HTTP 403 when tenant context is unbound without bypass role; force-overwrites tenantId on create (anti-spoofing) and enforces tenant ownership across all ID-based reads, updates, deletes, restores, clones, and sub-resources.
- **How to Use**: Place `@MultiTenant` on any SaaS `@Entity` containing a `tenantId` field (or override `tenantField`). `TenantSecurityFilterHelper` automatically injects tenant filters on reads, overwrites spoofed `tenantId` on create/import, and rejects missing tenant claims with fail-closed `403`.
- **When to Use**: Use on all shared-database B2B SaaS tenant tables (vendor stores, invoices, orders, workspaces) to prevent cross-tenant leaks across REST, Batch, Export, and GraphQL.
- **When NOT to Use & Pitfalls**: Do NOT place on global shared reference tables (countries, public categories, currencies) where every user must read rows regardless of tenant, or without verifying `SecurityIdentityCustomizer` supplies `tenantId` in non-superadmin tokens.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | No (Optional) | Exact Java property name on the entity matching a tenant identifier field (e.g., `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Entity String field name storing tenant identifier; defaults to TenantConstant.DEFAULT_TENANT_FIELD ("tenantId").<br/>*Caveat:* Add a composite database index starting with this column `(tenant_id, id)` for O(log N) tenant-isolated queries and zero cross-tenant leakage. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | No (Optional) | Array of Spring Security authority names (e.g., `{"ROLE_SUPER_ADMIN"}`); empty `{}` leaves this operation unrestricted unless restricted by another rule.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Platform-wide roles permitted to read/mutate across all tenants without tenant claim binding.<br/>*Caveat:* Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Purpose**: Validates uniqueness before persistence on create, update, and upsert.
- **Runtime Behavior**: Throws ConflictBusinessException (HTTP 409) when duplicate value exists.
- **How to Use**: Place `@UniqueField` on business key entity properties (`email`, `skuCode`, `licenseNumber`) alongside JPA `@Column(unique = true)`. Pre-checked across active records (`deleted = false`) before POST/PUT/upsert.
- **When to Use**: Use when soft-deleted records (`deleted = true`) must not block re-registering SKUs/emails, and you want clean localized `HTTP 409 Conflict` API errors.
- **When NOT to Use & Pitfalls**: Do NOT use alone without a database `UNIQUE` constraint/index in high-concurrency environments (race conditions between check and insert fall back to DB constraint mapped to `HTTP 409`). Also omit on non-unique display fields like `name` or `description`.

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Purpose**: Auto-generates unique prefixed business codes on creation or clone when left blank.
- **Runtime Behavior**: Populates prefix + unique token before entity validation and save.
- **How to Use**: Place `@AutoCode(prefix = "PRD-")` on a String business code field. Whenever an incoming payload leaves the field empty on create or clone, the framework generates e.g. `PRD-0194E1A0`.
- **When to Use**: Use for human-readable reference numbers (order numbers, SKUs, store codes, ticket IDs) backed by UUIDv7 entropy without DB sequence bottlenecks.
- **When NOT to Use & Pitfalls**: Do NOT use if business regulations strictly require gap-free monotonic integers (`1, 2, 3...` without skipped numbers, e.g., statutory tax invoice serials) or omit `prefix` (compilation fails since `prefix` has no default).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Yes (Required)** | Non-empty identifier string (e.g., `"ORD"`); leave `""` to use the framework default convention.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Mandatory immutable code prefix prepended before an 8-character uppercase UUIDv7 hash (e.g. "PRD-", "ORD-", "INV-").<br/>*Caveat:* Required attribute; generates sequential or date-stamped codes like `INV-2026-0001` only when the field is null/blank on creation, preserving caller-supplied codes if present. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Purpose**: Synthesizes normalized URL-friendly ASCII slugs automatically from sourceField.
- **Runtime Behavior**: Normalizes Unicode diacritics and exposes lookup via filtered slug queries.
- **How to Use**: Place `@AutoSlug(sourceField = "storeName")` on a `slug` String field. Automatically populates upon create when empty, and appends suffix on clone.
- **When to Use**: Use for SEO-friendly URLs on storefronts, blog posts, categories, and product catalogs (especially multilingual/Vietnamese titles).
- **When NOT to Use & Pitfalls**: Do NOT point `sourceField` to a non-existent or non-String property, and remember updating `title` later will NOT overwrite an already-persisted custom `slug` automatically.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Yes (Required)** | Exact Java property name on the entity matching a String field (e.g., `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Mandatory entity property name whose value (supports diacritics and Vietnamese đ/Đ) is normalized into a lowercase hyphenated ASCII slug.<br/>*Caveat:* Required attribute; normalizes Unicode/Vietnamese/CJK accents into lowercase URL-safe kebab-case (`"Áo Sơ Mi"` -> `"ao-so-mi"`). Pair with `@UniqueField` to guarantee uniqueness. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Purpose**: Computes derived numeric totals cleanly prior to saving entity changes.
- **Runtime Behavior**: Validated at boot by ComputedFieldFailFastUtil so invalid sourceFields fail fast.
- **How to Use**: Place on a derived numeric field (`BigDecimal subTotal` or `totalAmount`). Recomputed automatically on POST/PUT/PATCH/upsert using exact `BigDecimal` arithmetic on server side.
- **When to Use**: Use for server-authoritative line totals, order grand totals (`sum(items.subTotal) - discount + shipping`), and tax/fee derivations so clients cannot spoof totals.
- **When NOT to Use & Pitfalls**: Do NOT use for complex tiered pricing, currency FX lookups, or dynamic promotions requiring external DB/API calls (compute those in a `@ServiceOverride` Spring helper bean).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | No (Optional) | One of the supported tokens: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Calculation strategy: EnterpriseOperationConstant.COMPUTE_MULTIPLY ("MULTIPLY") or COMPUTE_SUM_COLLECTION ("SUM_COLLECTION").<br/>*Caveat:* Recomputed automatically on `POST`/`PUT`/`PATCH`/Upsert before persisting, overriding any tampered client-supplied total. |
| `sourceFields` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Property names on the same entity multiplied together when operation = "MULTIPLY" (e.g. {"unitPrice", "quantity"}).<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"unitPrice"`); mismatches silently skip or trigger a runtime lookup error. |
| `collectionField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a @OneToMany collection field (e.g., `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | @OneToMany child collection field name summed in "SUM_COLLECTION" mode (e.g. "items").<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"items"`); mismatches silently skip or trigger a runtime lookup error. |
| `itemField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a numeric field (e.g., `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Numeric property name on each child element summed across collectionField (e.g. "subTotal").<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"subTotal"`); mismatches silently skip or trigger a runtime lookup error. |
| `subtractField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a numeric field (e.g., `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Optional parent entity deduction field subtracted from collection sum (e.g. "discountAmount").<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"discountAmount"`); mismatches silently skip or trigger a runtime lookup error. |
| `addField` | `String` | `""` | No (Optional) | Exact Java property name on the entity matching a numeric field (e.g., `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Optional parent entity surcharge field added to the result (e.g. "shippingFee").<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"shippingFee"`); mismatches silently skip or trigger a runtime lookup error. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Allows binding custom SQL/JPQL or provider helper methods to controller endpoints.
- **Runtime Behavior**: Dispatched with bound named parameters via JPA EntityManager.
- **How to Use**: Combine with `@AutoGet`/`@AutoPost` on a custom method inside an `@AutoRestController`, binding named arguments via `@AutoParam` or `@AutoVariable` matching `:param` placeholders.
- **When to Use**: Use for native SQL reporting, CTEs, window functions, PostgreSQL JSONB queries, or Oracle/MySQL vendor syntax without creating a Spring Data Repository class.
- **When NOT to Use & Pitfalls**: NEVER concatenate raw user input into SQL (`sqlProvider` or `value` must use `:named` parameters!), do NOT point `sqlProvider` to a broken/missing method (`EntityFailFastValidatorUtil` rejects it at boot), and NEVER use SQL `JOIN` across separate Bounded Context modules.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Optional) | One of the supported tokens: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Inline SQL or JPQL query string supporting named `:param` placeholders (optional when sqlProvider is used).<br/>*Caveat:* Always bind user inputs via `:param` or `?1` placeholders — never concatenate untrusted strings. Leave `""` when delegating dynamic SQL generation to `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | No (Optional) | `true` (execute raw database-native SQL) or `false` (execute portable JPA JPQL).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true executes raw native database SQL via EntityManager.createNativeQuery; false executes JPA JPQL.<br/>*Caveat:* Native SQL (`true`, default) unlocks CTEs, window functions, and DB-specific JSON operators; switch to `false` (JPQL) for cross-database portability across H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `MonthlyRevenueDto.class`) or `Void.class` to disable DTO mapping.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Optional result mapping class (entity, scalar, or DTO); Void.class returns raw rows / maps.<br/>*Caveat:* Always specify a DTO projection class for aggregate/reporting queries to avoid `SELECT *` overhead and prevent untyped `Object[]` rows. |
| `sqlProvider` | `Class<?>` | `Void.class` | No (Optional) | Any concrete Java class literal (e.g., `OrderAnalyticsSqlProvider.class`) or `Void.class` to disable DTO mapping.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Optional Pure Java class providing programmatic/dynamic SQL strings validated at boot by EntityFailFastValidatorUtil.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `sqlProvider` values fail fast before serving traffic. |
| `providerMethod` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"buildRevenueSql"`); leave `""` to use the framework default convention.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Method name inside sqlProvider returning the String SQL statement.<br/>*Caveat:* Must match the exact Java method/field identifier (case-sensitive, e.g., `"buildRevenueSql"`); mismatches silently skip or trigger a runtime lookup error. |
| `modifying` | `boolean` | `false` | No (Optional) | `true` (DML UPDATE/DELETE executed inside a write transaction) or `false` (read-only SELECT query returning entities or DTOs).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Must be true for INSERT/UPDATE/DELETE queries executed via Query.executeUpdate().<br/>*Caveat:* Required (`true`) for any `UPDATE`/`DELETE` statement; automatically wraps execution in a read-write transaction and clears JPA persistence context. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Dynamic Database-Driven RBAC & Field Masking Meta-Annotations (18 Annotations)

### `@SecurityRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Purpose**: Designates a JPA Entity as the live Database RBAC Role catalog table.
- **Runtime Behavior**: DynamicDatabaseRbacProviderHelper caches role-to-permission bindings in Caffeine with configurable TTL and auto-invalidates on write.
- **How to Use**: Place `@SecurityRoleEntity` on your database Role JPA entity (`cacheTtlSeconds = 60`), mark its role key with `@RoleCode`, and optionally mark `@RoleName` and `@RolePermissions`.
- **When to Use**: Use when administrators manage dynamic roles and permission assignments at runtime through database tables instead of hardcoded Java enums/constants.
- **When NOT to Use & Pitfalls**: Do NOT omit `@RoleCode` (`EntityFailFastValidatorUtil` aborts startup!), and avoid registering multiple `@SecurityRoleEntity` classes in the same persistence context.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Optional) | Positive number (`>= 1`) in seconds; e.g., `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Caffeine snapshot TTL in seconds before reloading role definitions from JPA (auto-evicted earlier on role table mutations).<br/>*Caveat:* Shorter TTLs reflect database changes faster at higher query cost; longer TTLs cut DB load but delay permission revocations until expiry. |

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
- **Purpose**: Maps the unique authority/role code column inside a @SecurityRoleEntity.
- **Runtime Behavior**: Read via cached LambdaAccessorUtil to match GrantedAuthority tokens (e.g. ROLE_FINANCE_ANALYST).
- **How to Use**: Place `@RoleCode` on a field or getter inside a `@SecurityRoleEntity` JPA entity (REQUIRED: role authority code, normalized automatically with ROLE_ prefix).
- **When to Use**: Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@RoleCode` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Identifies the human-readable role display name field on a @SecurityRoleEntity.
- **Runtime Behavior**: Exposed in RBAC diagnostic metadata and Dev Studio role inspection endpoints.
- **How to Use**: Place `@RoleName` on a field or getter inside a `@SecurityRoleEntity` JPA entity (optional display title of the role).
- **When to Use**: Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@RoleName` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Marks the collection or CSV string field holding granted permission codes on a role entity.
- **Runtime Behavior**: Parsed dynamically and expanded into effective SecurityIdentityCustomizer authorities.
- **How to Use**: Place `@RolePermissions` on a field or getter inside a `@SecurityRoleEntity` JPA entity (String, Collection<String>, or collection of Permission entities linked to this role).
- **When to Use**: Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@RolePermissions` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Purpose**: Marks a JPA Entity storing resource-action permissions and dynamic field-masking rules.
- **Runtime Behavior**: Loaded into DatabaseRbacRuleMatcherHelper to enforce resource-level CRUD access and post-fetch field masking.
- **How to Use**: Place `@SecurityPermissionEntity` on your Permission table JPA entity and mark the required identifier field with `@PermissionCode` (plus `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`).
- **When to Use**: Use when managing granular action/resource grants and field-level masking permissions dynamically in DB tables.
- **When NOT to Use & Pitfalls**: Do NOT forget `@PermissionCode`, and do not mix multiple `@SecurityPermissionEntity` classes in the same schema.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Optional) | Positive number (`>= 1`) in seconds; e.g., `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Caffeine L1 snapshot TTL in seconds (evicted immediately on permission table mutations).<br/>*Caveat:* Shorter TTLs reflect database changes faster at higher query cost; longer TTLs cut DB load but delay permission revocations until expiry. |

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
- **Purpose**: Designates the unique permission identifier field inside @SecurityPermissionEntity.
- **Runtime Behavior**: Matched against caller authorities and @EntitySecurity.permissions() codes.
- **How to Use**: Place `@PermissionCode` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (REQUIRED: unique permission identifier such as "product:read" or "billing:*").
- **When to Use**: Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PermissionCode` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Maps the target entity or API resource name (or wildcard *) inside @SecurityPermissionEntity.
- **Runtime Behavior**: Evaluated case-insensitively by DatabaseRbacRuleMatcherHelper with wildcard fallback.
- **How to Use**: Place `@PermissionResource` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (target entity simple/table name or wildcard "*").
- **When to Use**: Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PermissionResource` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Maps the logical CRUD or custom action verb protected by a @SecurityPermissionEntity rule.
- **Runtime Behavior**: Normalized automatically from controller method names (READ, WRITE, DELETE, or explicit custom action).
- **How to Use**: Place `@PermissionAction` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (action category: "READ", "WRITE", "DELETE", or "*").
- **When to Use**: Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PermissionAction` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Declares comma-separated entity fields that must be dynamically redacted when this DB permission rule triggers.
- **Runtime Behavior**: Applied dynamically alongside @FieldSecurity prior to HTTP JSON response serialization.
- **How to Use**: Place `@PermissionFieldMask` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (optional comma-separated masked field names for callers holding this rule).
- **When to Use**: Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PermissionFieldMask` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Purpose**: Maps the JPA Entity binding authenticated user subjects to DB roles and optional tenant scopes.
- **Runtime Behavior**: Queried automatically during JWT / SecurityContext hydration via SecurityIdentityCustomizer.
- **How to Use**: Place `@SecurityUserRoleEntity` on your User-Role assignment join entity and mark caller identity with required `@UserRoleSubject`, `@UserRoleCode`, and optional `@UserRoleTenantId`.
- **When to Use**: Use when JWT tokens only identify `username`/`sub` and runtime authorities should be enriched dynamically from database assignments (optionally scoped per tenant).
- **When NOT to Use & Pitfalls**: Do NOT forget `@UserRoleSubject`, and keep stateless pure JWT claims (`SecurityIdentityCustomizer`) if external IdP (Keycloak/Auth0) already injects immutable authorities.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@SecurityUserRoleEntity(enabled = true)` | Toggle to enable or disable loading user-to-role bindings from this table without deleting the entity.<br/>*Caveat:* Set `false` temporarily during schema migration to pause dynamic user-role table joins while keeping JWT claim-based roles operational. |

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
- **Purpose**: Identifies the principal subject / username field on a @SecurityUserRoleEntity.
- **Runtime Behavior**: Matched against Authentication.getName() from the active SecurityContext.
- **How to Use**: Place `@UserRoleSubject` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (REQUIRED: caller username / JWT subject identifier).
- **When to Use**: Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@UserRoleSubject` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Binds the assigned role code column inside @SecurityUserRoleEntity.
- **Runtime Behavior**: Resolves linked @SecurityRoleEntity permissions at runtime when evaluating policies.
- **How to Use**: Place `@UserRoleCode` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (assigned role code String (e.g. "ROLE_MANAGER")).
- **When to Use**: Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@UserRoleCode` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Scopes a @SecurityUserRoleEntity assignment to a specific tenant identifier (or * for global).
- **Runtime Behavior**: Filtered against TenantContextHolder / X-Tenant-ID on each authenticated request.
- **How to Use**: Place `@UserRoleTenantId` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (optional tenant identifier scoping this role assignment (or "*" for global)).
- **When to Use**: Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@UserRoleTenantId` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Purpose**: Marks a JPA Entity storing explicit ALLOW / DENY runtime authorization policies prioritized by priority.
- **Runtime Behavior**: Explicit DENY overrides ALLOW deterministically; DatabaseRbacRuleMatcherHelper checks policies before SQL execution.
- **How to Use**: Place `@SecurityPolicyEntity(priority = 100)` on a rule table entity, marking allowed roles via mandatory `@PolicyAllowedRoles` alongside `@PolicyResource`, `@PolicyAction`, and `@PolicyEffect` ("ALLOW"/"DENY").
- **When to Use**: Use when overriding or supplementing static `@EntitySecurity` annotations dynamically from database rules (including explicit `DENY` emergency kill-switches).
- **When NOT to Use & Pitfalls**: Do NOT omit `@PolicyAllowedRoles` (`EntityFailFastValidatorUtil` rejects startup), and recognize explicit `DENY` rules take precedence over matching grants.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | No (Optional) | Positive number (`>= 0`) in integer priority; e.g., `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Evaluation order integer for conflicting policies; lower values evaluate higher precedence.<br/>*Caveat:* Lower values take precedence when multiple dynamic policies match the same entity and field (e.g., priority `10` overrides default `100`). |

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
- **Purpose**: Maps the target resource identifier pattern in a @SecurityPolicyEntity.
- **Runtime Behavior**: Supports exact entity class/resource names as well as wildcard * matching.
- **How to Use**: Place `@PolicyResource` on a field or getter inside a `@SecurityPolicyEntity` JPA entity (entity/resource pattern (or "*") covered by this policy).
- **When to Use**: Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PolicyResource` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Maps the protected operation verb (READ, WRITE, DELETE, methodName, *) inside @SecurityPolicyEntity.
- **Runtime Behavior**: Evaluated per HTTP method / endpoint operation before service delegation.
- **How to Use**: Place `@PolicyAction` on a field or getter inside a `@SecurityPolicyEntity` JPA entity ("READ", "WRITE", "DELETE", or "*").
- **When to Use**: Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PolicyAction` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Maps the collection or comma-separated roles targeted by a @SecurityPolicyEntity rule.
- **Runtime Behavior**: Cross-referenced against active JWT authorities plus DB-hydrated @SecurityUserRoleEntity roles.
- **How to Use**: Place `@PolicyAllowedRoles` on a field or getter inside a `@SecurityPolicyEntity` JPA entity (REQUIRED: comma-separated string or collection of roles matched by this policy).
- **When to Use**: Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PolicyAllowedRoles` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Purpose**: Specifies ALLOW or DENY policy decision outcome on a @SecurityPolicyEntity rule.
- **Runtime Behavior**: Any matching DENY policy immediately aborts the request with HTTP 403 AccessDeniedBusinessException.
- **How to Use**: Place `@PolicyEffect` on a field or getter inside a `@SecurityPolicyEntity` JPA entity ("ALLOW" or "DENY" policy decision effect).
- **When to Use**: Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to Use & Pitfalls**: Do NOT place `@PolicyEffect` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).

> **Marker Annotation**: Pure marker annotation — declares no attributes.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Distributed Locking, Idempotency, Caching, Multi-DB & Cloud Events (13 Annotations)

### `@DistributedLock`

- **Package**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Purpose**: Serializes concurrent access on SpEL keys cached in AST map (max 1024 entries; waitTimeMs=3000L, leaseTimeMs=5000L defaults).
- **Runtime Behavior**: DistributedLockAspect throws DistributedLockAcquisitionException (HTTP 409) upon timeout.
- **How to Use**: Place `@DistributedLock(key = "'sku:' + #skuCode", waitTimeMs = 3000, leaseTimeMs = 5000)` on a Spring `@Service` method backed by non-final proxies, or supply a Redis `DistributedLockProvider` SPI bean for clusters.
- **When to Use**: Use when preventing overselling inventory, concurrent wallet debits, or duplicate scheduled batch drains across competing threads/nodes.
- **When NOT to Use & Pitfalls**: NEVER assume the default Caffeine + `ReentrantLock` provider synchronizes across multiple pods/Kubernetes replicas without replacing `DistributedLockProvider`! Also do NOT place on `final class` services.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | No (Optional) | SpEL expression referencing method arguments (e.g., `"'inventory:' + #skuId"`) or empty `""` to auto-generate key.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | SpEL mutex key expression evaluated at runtime (e.g. "'sku:' + #skuCode"). Empty falls back to method signature.<br/>*Caveat:* Always scope the key to the narrowest entity/business ID (e.g., `#id` or `#request.skuCode`); using a constant key serializes every caller globally. |
| `waitTimeMs` | `long` | `3000L` | No (Optional) | Positive number (`>= 0`) in milliseconds; e.g., `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Maximum milliseconds to wait acquiring the lock before aborting with lock acquisition exception (default 3000L).<br/>*Caveat:* Tune carefully for production latency SLA: too low causes spurious 409 lock contention errors; too high stalls HTTP worker threads under bursts. |
| `leaseTimeMs` | `long` | `5000L` | No (Optional) | Positive number (`>= 100`) in milliseconds; e.g., `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Maximum lock lease expiration window in milliseconds protecting active mutexes until explicit release (default 5000L).<br/>*Caveat:* Tune carefully for production latency SLA: must exceed your slowest p99 transaction duration or the lock may auto-expire mid-write and allow concurrent corruption. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Prevents concurrent or replayed duplicate writes within configurable TTL windows.
- **Runtime Behavior**: Enforced by IdempotencyAspect + ProxyIdempotencyGuardHelper with Caffeine TTL in-flight locking (throws ConflictBusinessException HTTP 409). Null/blank keys pass through; IdempotencyManagerHelper offers optional SHA-256 helpers.
- **How to Use**: Place `@Idempotent` on `@AutoRestController` methods/interfaces (`ProxyIdempotencyGuardHelper`) or non-final Spring `@Service` methods (`IdempotencyAspect` + atomic `IdempotencyStoreProvider`). Failures release the key so clients can safely retry.
- **When to Use**: Use for checkout/payment capture, wallet transfers, webhook ingestion, and POST mutations vulnerable to mobile/network double-taps.
- **When NOT to Use & Pitfalls**: Do NOT place on GET reads or `@CustomEndpoint` methods without putting it inside the Spring bean service method where Spring AOP intercepts, and supply Redis `IdempotencyStoreProvider` for multi-pod deployments.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | No (Optional) | Valid HTTP header name (case-insensitive on wire, e.g., `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | HTTP header carrying client-generated idempotency key; requests omitting or sending blank keys bypass deduplication.<br/>*Caveat:* Clients must send a unique UUIDv7 per logical mutation attempt and reuse the exact same header on network retries; expose this header in CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | No (Optional) | Positive number (`>= 1`) in seconds; e.g., `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Deduplication window in seconds during which re-submitting the same non-blank key throws HTTP 409 Conflict (default 300L = 5m).<br/>*Caveat:* Retention window for cached responses in Redis/in-memory store; set `300L–86400L` depending on client retry horizons (e.g., 24h for payment webhooks). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Enforces sliding-window request throttling per IP, User, or Tenant partition.
- **Runtime Behavior**: Increments nwvmc.ratelimit.rejected.total metric and responds with HTTP 429 Too Many Requests.
- **How to Use**: Place `@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` on `@AutoRestController` interfaces or methods. Emits `X-RateLimit-Remaining` + `X-RateLimit-Reset` on allowed calls and RFC 6585 `Retry-After` + `HTTP 429 Too Many Requests` when exhausted.
- **When to Use**: Use on public search, OTP/auth endpoints, AI natural-language queries, and heavy exports/imports to prevent abuse and DDoS amplification.
- **When NOT to Use & Pitfalls**: Do NOT place overly tight limits on internal health probes, and avoid `partitionKey = "GLOBAL"` when noisy tenants or users must stay isolated (prefer `"USER"`, `"TENANT"`, `"IP"`, or `#expr` SpEL).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | No (Optional) | Positive number (`>= 1`) in requests; e.g., `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Maximum allowed calls per sliding window (RateLimitConstant.DEFAULT_REQUESTS_PER_WINDOW = 60).<br/>*Caveat:* Emits `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and RFC 6585 `Retry-After` headers when HTTP `429 Too Many Requests` is returned. |
| `windowSeconds` | `int` | `60` | No (Optional) | Positive number (`>= 1`) in seconds; e.g., `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Rate limit sliding window duration in seconds (RateLimitConstant.DEFAULT_WINDOW_SECONDS = 60).<br/>*Caveat:* Defines the sliding/fixed counter window length; also drives the `X-RateLimit-Reset` epoch timestamp and `Retry-After` delay. |
| `partitionKey` | `String` | `"IP"` | No (Optional) | One of the supported tokens: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Bucket partitioning strategy (case-insensitive): "IP"/"clientIp" (client IP), "USER" (authenticated principal with IP fallback), "TENANT" (tenant context), "GLOBAL" (shared bucket), or SpEL "#expr".<br/>*Caveat:* `"USER"` buckets by authenticated principal and safely falls back to client IP for anonymous calls; `"GLOBAL"` shares one counter across every caller (use carefully on public routes). |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Wraps operations inside Resilience4j Circuit Breakers reporting telemetry to Actuator & Micrometer.
- **Runtime Behavior**: Trips to OPEN (HTTP 503) when error ratio exceeds threshold; updates nwvmc.resilience.circuitbreaker.state gauge.
- **How to Use**: Place `@EntityCircuitBreaker` on controllers/methods integrating external REST, legacy DB, or flaky AI providers to isolate cascading thread starvation via Resilience4j.
- **When to Use**: Use when downstream failures must fail-fast (`HTTP 503`) instead of blocking Virtual Threads waiting on timeouts.
- **When NOT to Use & Pitfalls**: 4xx `BaseBusinessException` errors (`400`/`401`/`403`/`404`/`409`) are automatically ignored by `CircuitBreakerErrorFilterUtil` — do NOT wrap non-transient client failures in raw `RuntimeException` (500) or they will trip the breaker to `OPEN` (`503`).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"payment-gateway-cb"`); leave `""` to use the framework default convention.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Circuit breaker instance identifier registered in Resilience4j; empty uses entity/controller name.<br/>*Caveat:* Identifies the Resilience4j registry instance and Micrometer metrics tag; leave `""` to auto-name from the controller/entity class. |
| `failureRateThreshold` | `float` | `50.0f` | No (Optional) | Positive number (`1.0f .. 100.0f`) in percent; e.g., `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Failure percentage threshold transitioning the breaker to OPEN state (default 50.0f%).<br/>*Caveat:* Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | No (Optional) | Positive number (`>= 1`) in seconds; e.g., `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Cooldown seconds in OPEN state rejecting requests with HTTP 503 before probing HALF_OPEN (default 10).<br/>*Caveat:* Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `slidingWindowSize` | `int` | `20` | No (Optional) | Positive number (`>= 1`) in calls; e.g., `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Number of recent recorded calls evaluated inside the count-based sliding window (default 20).<br/>*Caveat:* Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | No (Optional) | Positive number (`>= 1`) in calls; e.g., `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Probe requests permitted in HALF_OPEN state to determine recovery to CLOSED (default 5).<br/>*Caveat:* Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Automatically retries transient failures with configurable exponential backoff.
- **Runtime Behavior**: Throws standardized exception if all configured retry attempts exhaust.
- **How to Use**: Place `@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` on `@AutoRestController` methods or classes to automatically recover from transient network/DB lock glitches via Resilience4j.
- **When to Use**: Use for idempotent GET reads, `@AutoPut` replacements, or downstream calls guarded by `@Idempotent` encountering transient hiccups.
- **When NOT to Use & Pitfalls**: NEVER place on non-idempotent POST creations or payment charges lacking `@Idempotent` (retries would duplicate charges!), and never stack long backoff delays inside latency-critical endpoints.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"erp-sync-retry"`); leave `""` to use the framework default convention.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j Retry registry instance name.<br/>*Caveat:* Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `maxAttempts` | `int` | `3` | No (Optional) | Positive number (`>= 1`) in attempts; e.g., `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Total execution attempts including the initial try (default 3).<br/>*Caveat:* Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `waitDurationMs` | `long` | `500L` | No (Optional) | Positive number (`>= 50`) in milliseconds; e.g., `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Initial delay in milliseconds before the first retry attempt (default 500L).<br/>*Caveat:* Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `backoffMultiplier` | `double` | `2.0d` | No (Optional) | Positive number (`>= 1.0d`) in multiplier factor; e.g., `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Exponential backoff multiplier between subsequent retry attempts (default 2.0d -> 500ms, 1000ms...).<br/>*Caveat:* Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Package**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Computes RFC 7232 weak ETags (W/"...") and emits Cache-Control + HTTP 304 Not Modified responses.
- **Runtime Behavior**: Records HIT/MISS counters in nwvmc.cache.http.requests.
- **How to Use**: Place `@HttpCacheable(maxAgeSeconds = 120, isPrivate = false)` on read-only `@AutoRestController` interfaces or GET methods to emit standard RFC 7232/9111 HTTP caching.
- **When to Use**: Use for semi-static catalogs, reference dictionaries, OpenAPI metadata, or public storefront listings where HTTP `304` eliminates JSON re-transmission.
- **When NOT to Use & Pitfalls**: NEVER leave `isPrivate = false` (default) on user-specific PII, tenant-isolated financials, or role-masked endpoints — set `isPrivate = true` or omit HTTP caching completely so CDNs cannot serve one user’s response to another!

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | No (Optional) | Positive number (`>= 0`) in seconds; e.g., `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | HTTP Cache-Control max-age directive duration in seconds (HttpCacheConstant.DEFAULT_MAX_AGE_SECONDS = 60).<br/>*Caveat:* Emits `Cache-Control: max-age=<N>`. Set `0` with `mustRevalidate = true` + `generateETag = true` for immediate conditional revalidation via `304 Not Modified`. |
| `isPrivate` | `boolean` | `false` | No (Optional) | `true` (browser-only private Cache-Control; blocked from shared CDNs) or `false` (public Cache-Control cacheable by proxies and CDNs).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true emits private Cache-Control blocking shared proxies/CDNs; false emits public.<br/>*Caveat:* CRITICAL: Always set `isPrivate = true` on authenticated, tenant-scoped, or `@FieldSecurity`-masked endpoints to prevent shared CDNs from serving User A’s response to User B. |
| `mustRevalidate` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Appends ", must-revalidate" requiring stale cache entries to revalidate with origin.<br/>*Caveat:* Instructs intermediate caches never to serve stale responses once `maxAgeSeconds` elapses without checking the origin server. |
| `generateETag` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Computes weak SHA-256 ETag and short-circuits matching If-None-Match requests with HTTP 304 Not Modified.<br/>*Caveat:* Computes a weak RFC 7232 `ETag` digest from the serialized response and short-circuits matching `If-None-Match` calls with `304 Not Modified` (0-byte body). |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Caches server-side read method outputs inside Caffeine L1 / Redis L2 engines.
- **Runtime Behavior**: Configurable globally via app.framework.cache.type.
- **How to Use**: Place `@AutoCacheable(value = {"entityDetails"}, key = "#entityClass.simpleName + ':' + #id")` on read methods inside framework or Spring `@Service` beans.
- **When to Use**: Use for read-heavy lookups by ID or static metadata queries where Read/Write ratio exceeds ~10:1 and results are cloned before client field projection.
- **When NOT to Use & Pitfalls**: NEVER share a single cache key across un-cloned mutable entities returned to sparse `?fields=` or `@FieldSecurity` (use `EntityCloneSnapshotHelper` before mutating), or on high-churn write-heavy transactional rows.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Target logical cache names managed by Caffeine L1 or Redis L2 depending on app.framework.cache.type.<br/>*Caveat:* Cache region names must match your configured Caffeine/Redis regions; pair every write/delete mutation with matching `@AutoCacheEvict(value = ...)` to avoid stale reads. |
| `key` | `String` | `""` | No (Optional) | SpEL expression referencing method arguments (e.g., `"'product:' + #id"`) or empty `""` to auto-generate key.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL key expression (v0.1.0 AutoCacheAspect safely resolves EntityName:id deterministically without failing on Class property access).<br/>*Caveat:* In multi-tenant apps, always include `#tenantId` or current tenant context in the cache key to prevent cross-tenant cache poisoning. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Evicts stale server-side cache entries upon mutations.
- **Runtime Behavior**: Executed post-mutation cleanly without leaving stale read slices.
- **How to Use**: Place `@AutoCacheEvict(value = {"entityDetails"}, key = "...")` on update/delete methods alongside `@AutoCacheable` reads.
- **When to Use**: Use whenever single-entity updates, state transitions, or deletes mutate records cached via `@AutoCacheable`.
- **When NOT to Use & Pitfalls**: Avoid setting `allEntries = true` on high-frequency `create` endpoints (causes Cache Stampede across cold reads; `DynamicEntityCrudServiceImpl.create` intentionally avoids global eviction).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Optional) | Array of zero or more valid tokens: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Target cache names to evict upon method completion.<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `key` | `String` | `""` | No (Optional) | SpEL expression referencing method arguments (e.g., `"'product:' + #id"`) or empty `""` to auto-generate key.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | SpEL key expression selecting the single mutated entity cache entry (e.g. EntityName:id).<br/>*Caveat:* Must evaluate to the exact same key format as `@AutoCacheable.key`; ignored when `allEntries = true`. |
| `allEntries` | `boolean` | `false` | No (Optional) | `true` (clear every key in target cache region) or `false` (evict only the single entry resolved by key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | When true, clears matching entity-scoped keys (v0.1.0 safely scopes eviction to the entity prefix instead of wiping unrelated entities).<br/>*Caveat:* Clearing entire regions under heavy traffic can trigger a cache stampede (thundering herd) against the database; prefer targeted `key` eviction whenever possible. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Package**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Profiles execution duration and emits WARN logs when slow calls exceed threshold.
- **Runtime Behavior**: Also feeds latency timers via DynamicEntityMetricsHelper.
- **How to Use**: Place `@TrackExecutionTime(warningThresholdMs = 300)` on `@AutoRestController` interfaces, methods, or custom Spring services to monitor P95/SLA violations automatically.
- **When to Use**: Use on complex reports, batch endpoints, GraphQL resolvers, and `@CustomQuery` handlers to surface database slow-query regressions early.
- **When NOT to Use & Pitfalls**: Do NOT set `warningThresholdMs = 0` or negative values in high-throughput production routes (would spam `WARN` logs on every fast request), and omit on long-lived SSE `/events` streams.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | No (Optional) | Positive number (`>= 1`) in milliseconds; e.g., `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Elapsed duration threshold in milliseconds above which a slow-execution WARN log and Micrometer observation alert emit (default 500L).<br/>*Caveat:* Emits a structured `WARN` log with `traceId` and elapsed milliseconds whenever execution exceeds this threshold; keep realistic (`200L–1000L`) to avoid log flooding. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Package**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Purpose**: Sends post-commit asynchronous HMAC-SHA256 signed outbound webhooks on Virtual Threads.
- **Runtime Behavior**: Computes signatures in WebhookHmacSignerHelper and verifies constant-time equality.
- **How to Use**: Place `@EntityWebhook` on JPA `@Entity` classes and register webhook targets via configuration or SPI. Delivered asynchronously via Virtual Threads / Transactional Outbox after database commit.
- **When to Use**: Use to notify external SaaS tenants, payment partners, or ERP subscribers immediately when orders/shipments commit.
- **When NOT to Use & Pitfalls**: Set `includeFullPayload = false` if entities carry strict PII/PCI secrets, and never point webhook URLs to unverified internal localhost/private SSRF targets.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | No (Optional) | Array of zero or more valid tokens: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Lifecycle events triggering outbound HMAC-signed webhook delivery.<br/>*Caveat:* Dispatched asynchronously after database transaction commit (`AFTER_COMMIT`) so rolled-back mutations never emit phantom webhooks. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | No (Optional) | Valid HTTP header name (case-insensitive on wire, e.g., `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HTTP header carrying the HMAC-SHA256 verification digest.<br/>*Caveat:* Carries the HMAC-SHA256 payload signature; receivers MUST verify this header in constant time before processing. |
| `includeFullPayload` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@EntityWebhook(includeFullPayload = false)` | true serializes the masked/cloned entity JSON payload inside the webhook body; false sends only entity ID & event metadata.<br/>*Caveat:* Set `false` (thin event: entity ID + event type only) for sensitive PII/financial entities so external subscribers fetch authorized fields over authenticated GET calls. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Package**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Publishes CNCF CloudEvents v1.0 envelopes after transaction commit.
- **Runtime Behavior**: Respects TransactionRuntimeBridge.executeAfterCommit to avoid phantom events.
- **How to Use**: Place `@PublishCloudEvent(eventType = "io.nwvmc.order", source = "/orders")` on entities or controller methods; listeners consume `CloudEventEnvelopeDto` post-commit (`TransactionPhase.AFTER_COMMIT`).
- **When to Use**: Use for clean inter-module communication between Bounded Contexts (`order` -> `inventory` -> `notification`) via `ApplicationEventPublisher` / Kafka without cross-module JPA entity coupling.
- **When NOT to Use & Pitfalls**: Do NOT confuse internal Spring CloudEvents with external customer HTTP webhooks (`@EntityWebhook`), or consume them inside the active DB transaction before commit (`@EventListener` without `AFTER_COMMIT`).

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | No (Optional) | Non-empty identifier string (e.g., `"com.acme.order.lifecycle"`); leave `""` to use the framework default convention.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` header (e.g. "io.nwvmc.order.created"); empty synthesizes entity event name.<br/>*Caveat:* Follow reverse-DNS CloudEvents 1.0 naming (`com.company.domain.event`); leave `""` to auto-generate from package and entity name. |
| `source` | `String` | `""` | No (Optional) | Valid HTTP path starting with `/` (e.g., `/services/order-api`) or empty string `""` to auto-derive.<br/>`@PublishCloudEvent(source = "/services/order-api")` | CloudEvents `source` URI identifying the emitting bounded context.<br/>*Caveat:* Populates the CNCF CloudEvents `source` URI attribute for cross-microservice lineage tracing. |
| `publishOnCreate` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Emits a CloudEvent after POST/create commit (default true).<br/>*Caveat:* Emitted only after commit (`AFTER_COMMIT`) via Spring `ApplicationEventPublisher` / Kafka / RabbitMQ bridge. |
| `publishOnUpdate` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Emits a CloudEvent after PUT/PATCH commit (default true).<br/>*Caveat:* Disable (`false`) on high-churn entities whose minor updates (e.g., view counters) should not flood downstream message brokers. |
| `publishOnDelete` | `boolean` | `true` | No (Optional) | `true` (enabled) or `false` (disabled).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Emits a CloudEvent after DELETE commit (default true).<br/>*Caveat:* Fires for both hard deletes and `@SoftDelete` tombstones so downstream read-models stay synchronized. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Pins entity or query operations to a logical named datasource key.
- **Runtime Behavior**: Records routing counts in framework.datasource.routing.total.
- **How to Use**: Place `@TargetDataSource("REPLICA")` on `@AutoRestController` methods/interfaces or Spring `@Service` interface/bean methods; framework automatically saves and restores previous context keys on exit.
- **When to Use**: Use for CQRS read-replica offloading, heavy analytics/BI reports, or region-sharded multi-datasource pools.
- **When NOT to Use & Pitfalls**: Do NOT switch datasource mid-transaction inside an already-open `@Transactional` JDBC connection (Spring `AbstractRoutingDataSource` resolves connection at transaction start!) and NEVER declare the `@Service` class `final`.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | No (Optional) | One of the supported tokens: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Logical datasource pool routing key bound into DataSourceContextHolder ("PRIMARY", "REPLICA", etc.).<br/>*Caveat:* Must match an active key registered in `DynamicRoutingDataSource`; unbound keys fall back to `PRIMARY` or fail fast depending on routing config. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Package**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Purpose**: Assigns database engine family and logical cluster shard per entity.
- **Runtime Behavior**: Resolved dynamically by MultiPlatformDataSourceRegistryHelper & TenantDatabaseRoutingResolverHelper.
- **How to Use**: Place `@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER")` on specialized JPA entities or service methods to declare multi-database affinity metadata read by Studio & multi-DB bridges.
- **When to Use**: Use in polyglot persistence or sharded enterprise platforms splitting ledger (`FINANCE_CLUSTER`), analytics (`ANALYTICS_CLUSTER`), and audit (`AUDIT_CLUSTER`) workloads.
- **When NOT to Use & Pitfalls**: Do NOT confuse declarative affinity metadata with configuring JDBC URLs — you still must define the backing physical `DataSource` pool entries when deploying across real multi-DB clusters, and do not try JPA cross-DB joins between entities on different clusters.

| Attribute | Java Type | Default Value | Required | Accepted Values & Example | Description & Runtime Caveats |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | No (Optional) | One of the supported tokens: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Target database engine affinity identifier ("H2", "POSTGRESQL", "MYSQL", "ORACLE", "REDIS", "MONGODB").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `platform` values fail fast before serving traffic. |
| `cluster` | `String` | `"PRIMARY"` | No (Optional) | One of the supported tokens: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Target database cluster/shard tier ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER", "AUDIT_CLUSTER").<br/>*Caveat:* Validated eagerly during application bootstrap; misspelled names or invalid `cluster` values fail fast before serving traffic. |
| `readOnly` | `boolean` | `false` | No (Optional) | `true` (route to read-only replica pool) or `false` (route to read-write master pool).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Hints routing affinity toward read-only replicas when true.<br/>*Caveat:* Never set `readOnly = true` on `POST`/`PUT`/`PATCH`/`DELETE` handlers — read replicas reject writes and skip dirty-checking flush. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
