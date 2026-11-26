# Spring-NWVMC (`v0.1.0`) — Exact 60 Annotations & 133 Attributes Reference

> **100% Machine-Verified 1:1** against `controller-to-api-framework/src/main/java/**/annotation/*.java`.
> AI agents MUST verify exact package, attribute name, type, and syntax here before writing any Spring-NWVMC annotation.

## Quick Package Import Map (6 Real Packages)

| Package | Annotations |
| :--- | :--- |
| `io.github.natswarchuan.core.annotation` | `@AutoRestController`, `@ServiceOverride`, `@CustomEndpoint`, `@AutoGet`, `@AutoPost`, `@AutoPut`, `@AutoPatch`, `@AutoDelete`, `@AutoParam`, `@AutoVariable`, `@AutoBody`, `@EnableNestedSubResource`, `@BusinessAction`, `@AutoComponent`, `@AutoService`, `@AutoBean`, `@AutoConfigurationBean`, `@OrderPriority`, `@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@HumanPolicy`, `@AuditTrail`, `@MultiTenant`, `@UniqueField`, `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@CustomQuery`, `@SecurityRoleEntity`, `@RoleCode`, `@RoleName`, `@RolePermissions`, `@SecurityPermissionEntity`, `@PermissionCode`, `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`, `@SecurityUserRoleEntity`, `@UserRoleSubject`, `@UserRoleCode`, `@UserRoleTenantId`, `@SecurityPolicyEntity`, `@PolicyResource`, `@PolicyAction`, `@PolicyAllowedRoles`, `@PolicyEffect`, `@Idempotent`, `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`, `@AutoCacheable`, `@AutoCacheEvict`, `@TrackExecutionTime` |
| `io.github.natswarchuan.module.cache.http.annotation` | `@HttpCacheable` |
| `io.github.natswarchuan.module.datasource.annotation` | `@TargetDataSource`, `@TargetDatabasePlatform` |
| `io.github.natswarchuan.module.event.annotation` | `@PublishCloudEvent` |
| `io.github.natswarchuan.module.lock.annotation` | `@DistributedLock` |
| `io.github.natswarchuan.module.webhook.annotation` | `@EntityWebhook` |

---

## 1. Routing & HTTP Verbs (13)

### `@AutoRestController`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoRestController;`
- **Target:** `Interface (TYPE)`
- **Purpose:** Transforms an interface extending AutoApiController<E> into a runtime JDK Dynamic Proxy registering 40 contracts (38 visible by default in Swagger UI).
- **How to use:** Place `@AutoRestController(basePath = "/api/v1/...")` on a Java `interface` extending `AutoApiController<E>` or narrow capability interfaces such as `AutoReadApi<E>`. Configure `readDto`/`createDto`/`updateDto` and `disabledEndpoints` to tailor the exposed surface.
- **When to use:** Use whenever exposing standardized CRUD, pagination, filtering, keyset, analytics, or read-only endpoints for a JPA entity without writing boilerplate Controller/Service/Repository classes.
- **When NOT to use:** Do NOT place on concrete `@RestController` classes, or on workflows that have no backing JPA entity (such as third-party webhooks/aggregations; use standard Spring `@RestController` or `@ServiceOverride`). Prefer `AutoReadApi<E>` instead of full `AutoApiController<E>` for public read-only catalogs.
- **Runtime behavior:** DynamicControllerProxyRegistrarHelper scans enabled controllers at boot and registers routes into Spring MVC RequestMappingHandlerMapping.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `basePath` | `String` | `""` | no | `@AutoRestController(basePath = "/api/v1/product-catalogs")` | Primary route prefix read by `DynamicControllerProxyRegistrarHelper` on proxy interfaces. Always use `basePath` on `@AutoRestController` interfaces. |
| `path` | `String` | `""` | no | `@AutoRestController(path = "/api/v1/orders")` | Only honored on concrete controllers (`SpringMvcEndpointBridge`); **ignored on proxy interfaces** by `DynamicControllerProxyRegistrarHelper` (`0.1.0`) — always use `basePath` instead. |
| `entityName` | `String` | `""` | no | `@AutoRestController(entityName = "ProductCatalog")` | Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio; extract repeated literals into a constant class for maintainability. |
| `enabledEndpoints` | `String[]` | `{}` | no | `@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Acts as a strict allowlist (exact `AutoApiController` method names, case-insensitive): when non-empty, every method NOT listed here is omitted from Spring MVC and Swagger UI. Prefer this for public read-only APIs. |
| `disabledEndpoints` | `String[]` | `{}` | no | `@AutoRestController(disabledEndpoints = {"deleteById", "batchChunked", "importCsv"})` | Evaluated **before** `enabledEndpoints` (denylist wins in `EndpointFeatureFilterHelper`); use exact `AutoApiController` method names (`deleteById`, `createBatch`, `batchChunked`, `updateBatchByFilter`, `importCsv`). |
| `enableNestedSubResources` | `boolean` | `false` | no | `@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Keep `false` unless deep `GET /{id}/items/...` traversal is required; enabling globally across large schemas increases route count and requires `@EnableNestedSubResource` allowlists. |
| `readDto` | `Class<?>` | `Void.class` | no | `@AutoRestController(readDto = ProductReadDto.class)` | Applies exclusively to the read (GET) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | no | `@AutoRestController(createDto = ProductCreateDto.class)` | Applies exclusively to the create (POST) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | no | `@AutoRestController(updateDto = ProductUpdateDto.class)` | Applies exclusively to the update (PUT/PATCH) pipeline; the DTO class needs a no-arg constructor/getters (or Lombok `@Builder`) and honors Jakarta `@Valid` and `@FieldSecurity`. |

### `@ServiceOverride`
- **Import:** `import io.github.natswarchuan.core.annotation.ServiceOverride;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Redirects a declared controller contract to a custom Spring bean method via MethodHandleCacheUtil instead of dynamic CRUD.
- **How to use:** Annotate a specific method (or entire controller interface) inside an `@AutoRestController` with `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")`. Declare standard Spring `@Component`/`@Service` on `MyHelper` and ensure parameter types align.
- **When to use:** Use when 90% of endpoints work out of the box, but one specific endpoint (e.g., overridden `create`, custom stats, complex multi-service orchestration) requires bespoke procedural Java code.
- **When NOT to use:** Do NOT pass a `String` literal to `targetBean` (it requires `Class<?>`, e.g. `MyHelper.class`; use `beanName` for strings). Also avoid `@ServiceOverride` when standard CRUD with `@HumanPolicy` or `@EntitySecurity` already satisfies the rule without custom code.
- **Runtime behavior:** EscapeHatchDispatchHelper resolves target bean (by targetBean class or beanName) and caches unreflected MethodHandle in MethodHandleCacheUtil.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | no | `@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | At startup the proxy registrar evaluates `targetBean` before `beanName`. Avoid setting conflicting values on both attributes simultaneously. |
| `beanName` | `String` | `""` | no | `@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | At startup the proxy registrar evaluates `targetBean` before `beanName`. Avoid setting conflicting values on both attributes simultaneously. |
| `methodName` | `String` | `""` | no | `@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"createOrder"`); mismatches silently skip or trigger a runtime lookup error. |
| `bypassAutoDispatch` | `boolean` | `true` | no | `@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | When `true` (default), the built-in CRUD handler is skipped and your bean owns execution/transaction/persistence. When `false`, `EscapeHatchResolutionUtil` disables the override (returns `null`, falling back directly to built-in CRUD). |

### `@CustomEndpoint`
- **Import:** `import io.github.natswarchuan.core.annotation.CustomEndpoint;`
- **Target:** `Method (METHOD)`
- **Purpose:** Binds domain-specific workflow routes (checkout, refund, approval) to independent Spring @Component Helper beans.
- **How to use:** Combine with `@AutoPost`/`@AutoGet` or specify `httpMethod`/`path` on a controller method and point `delegateBean` + `delegateMethod` to a custom Spring bean helper.
- **When to use:** Use for rich domain actions such as checkout, refund, order cancellation, report generation, or multi-entity transactions within an entity controller.
- **When NOT to use:** Do NOT pair controller-proxy `@EntitySecurity`/`@RateLimit`/`@Idempotent` expecting interception here (`@CustomEndpoint` dispatches directly via `ControllerProxySpecialRouteUtil` before `invokeProtectedOperation` — apply Spring AOP/security inside the delegated `@Component`/`@Service` bean or use `@ServiceOverride`), and do NOT duplicate `@BusinessAction` state transitions.
- **Runtime behavior:** Invokes `delegateBean.delegateMethod` directly through cached `MethodHandle` lookup (does NOT automatically wrap in a DB transaction — place `@Transactional` on a non-final `@Lazy @Service` delegate when mutating data).

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `path` | `String` | `""` | no | `@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Validated eagerly during application bootstrap; misspelled names or invalid `path` values fail fast before serving traffic. |
| `httpMethod` | `String` | `"GET"` | no | `@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Validated eagerly during application bootstrap; misspelled names or invalid `httpMethod` values fail fast before serving traffic. |
| `delegateBean` | `String` | `""` | no | `@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Validated eagerly during application bootstrap; misspelled names or invalid `delegateBean` values fail fast before serving traffic. |
| `delegateMethod` | `String` | `""` | no | `@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"buildMonthlyReport"`); mismatches silently skip or trigger a runtime lookup error. |
| `summary` | `String` | `""` | no | `@CustomEndpoint(path = "/revenue", summary = "Compute monthly revenue")` | Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio. |
| `description` | `String` | `""` | no | `@CustomEndpoint(path = "/revenue", description = "Aggregates paid monthly revenue")` | Exposed directly in generated Swagger / OpenAPI 3.0 specifications and NWVMC Studio. |

### `@AutoGet`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoGet;`
- **Target:** `Method (METHOD)`
- **Purpose:** Pure Java replacement for @GetMapping without static Spring Web imports.
- **How to use:** Place `@AutoGet("/your-path")` on a custom or overridden method inside an `@AutoRestController` interface (often paired with `@ServiceOverride` or `@CustomQuery`).
- **When to use:** Use for read-only HTTP GET custom routes inside pure-Java controller interfaces without importing Spring Web `@GetMapping`.
- **When NOT to use:** Do NOT use `@AutoGet` for operations that mutate database state or trigger side effects (use `@AutoPost`/`@AutoPut`/`@AutoPatch`/`@AutoDelete`), and avoid using it on standard concrete `@RestController` beans.
- **Runtime behavior:** Mapped to HTTP GET RequestMappingInfo at proxy bootstrap.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoGet("/{id}/summary")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `produces` | `String[]` | `{}` | no | `@AutoGet(value = "/export", produces = {"text/csv"})` | Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

### `@AutoPost`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoPost;`
- **Target:** `Method (METHOD)`
- **Purpose:** Pure Java HTTP POST route declaration supporting custom consumes/produces media types.
- **How to use:** Annotate a state-creating or action method with `@AutoPost("/path")` inside `@AutoRestController` and bind payloads with `@AutoBody` or `@RequestBody`. Combine with `@BusinessAction` or `@ServiceOverride`.
- **When to use:** Use for non-idempotent creation endpoints, action commands, batch submissions, or custom workflow POST routes on pure-Java interfaces.
- **When NOT to use:** Do NOT use for read-only lookups (`@AutoGet`), idempotent full replacement (`@AutoPut`), partial field updates (`@AutoPatch`), or deletion (`@AutoDelete`).
- **Runtime behavior:** Registered as HTTP POST handler in SpringMvcEndpointBridge.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoPost("/{id}/approve")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | no | `@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | no | `@AutoPost(value = "/calculate", produces = {"application/json"})` | Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

### `@AutoPut`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoPut;`
- **Target:** `Method (METHOD)`
- **Purpose:** Pure Java HTTP PUT route mapping for full resource replacement.
- **How to use:** Place `@AutoPut("/{id}")` on a full-update controller method paired with `@AutoVariable` (`UUID id`) and `@AutoBody` (`E` or `updateDto`).
- **When to use:** Use for idempotent full-resource replacement or custom PUT actions expecting complete state payloads.
- **When NOT to use:** Do NOT use for sparse single-field updates or state transitions (`@AutoPatch` or `@BusinessAction`), and respect optimistic locking (`@Version` -> HTTP `409 Conflict`).
- **Runtime behavior:** Bound as HTTP PUT handler wrapped inside transactional execution.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoPut("/{id}/replace")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | no | `@AutoPut(value = "/{id}", consumes = {"application/json"})` | Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | no | `@AutoPut(value = "/{id}", produces = {"application/json"})` | Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

### `@AutoPatch`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoPatch;`
- **Target:** `Method (METHOD)`
- **Purpose:** Pure Java HTTP PATCH declaration supporting partial merges, atomic increments, and RFC 6902 JSON Patch.
- **How to use:** Place `@AutoPatch("/{id}/action")` on custom partial-update or declarative `@BusinessAction` methods in an `@AutoRestController`.
- **When to use:** Use for partial field mutations, atomic counter adjustments, and state transitions (`@StateMachine` + `@BusinessAction`).
- **When NOT to use:** Do NOT use when the entire entity must be replaced strictly (use `@AutoPut`) or when creating new records (`@AutoPost`).
- **Runtime behavior:** Supports JSON merge semantics and application/json-patch+json.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoPatch("/{id}/status")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `consumes` | `String[]` | `{}` | no | `@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Enforced by Spring MVC content negotiation on HTTP `Content-Type`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |
| `produces` | `String[]` | `{}` | no | `@AutoPatch(value = "/{id}", produces = {"application/json"})` | Enforced by Spring MVC content negotiation on HTTP `Accept`; mismatched client headers return `406 Not Acceptable` or `415 Unsupported Media Type`. |

### `@AutoDelete`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoDelete;`
- **Target:** `Method (METHOD)`
- **Purpose:** Pure Java HTTP DELETE declaration triggering state-guarded soft deletion.
- **How to use:** Place `@AutoDelete("/{id}/custom")` on custom deletion methods inside `@AutoRestController`, typically paired with `@ServiceOverride`.
- **When to use:** Use for custom archive, soft-delete override, or cascade cleanup DELETE endpoints defined directly on controller interfaces.
- **When NOT to use:** Do NOT redefine `deleteById` if standard soft-delete (`DELETE /{id}`) with `@StateMachine(deletableStates = ...)` and `@EntitySecurity(deleteRoles = ...)` already handles it.
- **Runtime behavior:** Validates @StateMachine deletableStates before marking deleted=true.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoDelete("/{id}/archive")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

### `@AutoParam`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoParam;`
- **Target:** `Parameter (PARAMETER)`
- **Purpose:** Binds URL query parameters or Map<String, String> dynamic filter maps.
- **How to use:** Place `@AutoParam("page")` or `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")` on method parameters in controller interfaces.
- **When to use:** Use when keeping controller interfaces 100% Pure Java (zero `org.springframework.web.*` imports) while binding HTTP query parameters.
- **When NOT to use:** Never use `@AutoParam` for URI path placeholders (`{id}` -> `@AutoVariable`) or JSON request bodies (`@AutoBody`). Note: `v0.1.0` also supports standard Spring `@RequestParam` on controller interfaces if preferred.
- **Runtime behavior:** Extracted via DynamicQueryParameterParserHelper with QueryGuardrailEnforcerUtil validation.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoParam("status") String status` | At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `name` | `String` | `""` | no | `@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `required` | `boolean` | `true` | no | `@AutoParam(name = "keyword", required = false) String keyword` | Automatically behaves as optional if `defaultValue` is explicitly provided; use `false` with boxed types (`Integer`, `Boolean`) rather than primitives to avoid NPE. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | no | `@AutoParam(name = "limit", defaultValue = "20") int limit` | Parsed as String and converted via Spring `ConversionService` to the parameter target type; invalid literals fail with HTTP `400 Bad Request`. |

### `@AutoVariable`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoVariable;`
- **Target:** `Parameter (PARAMETER)`
- **Purpose:** Binds URI path variables such as UUIDv7 entity IDs.
- **How to use:** Annotate path identifier parameters like `findById(@AutoVariable("id") UUID id)` inside Pure Java controller interfaces.
- **When to use:** Use whenever extracting `{id}`, `{slug}`, or `{code}` from URI templates in Pure Java interfaces.
- **When NOT to use:** Do NOT use for `?query=` parameters (`@AutoParam`) or HTTP JSON bodies (`@AutoBody`). Note: `v0.1.0` also accepts standard `@PathVariable`.
- **Runtime behavior:** Parsed into typed Java UUID/String values from MVC path templates.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoVariable("orderId") UUID orderId` | At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `name` | `String` | `""` | no | `@AutoVariable(name = "tenantCode") String tenantCode` | At startup the proxy registrar evaluates `value` before `name`. Avoid setting conflicting values on both attributes simultaneously. |
| `required` | `boolean` | `true` | no | `@AutoVariable(name = "id", required = true) UUID id` | Path segments must match `{variableName}` in the method URI template (`@AutoGet("/{id}/...")`); setting `false` only applies when multiple optional URI patterns exist. |

### `@AutoBody`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoBody;`
- **Target:** `Parameter (PARAMETER)`
- **Purpose:** Deserializes HTTP JSON request payloads into DTO or Entity parameters paired with @Valid.
- **How to use:** Place `@AutoBody` on the payload parameter of `@AutoPost`/`@AutoPut`/`@AutoPatch` methods inside Pure Java interfaces (combine with `@Valid` for Bean Validation).
- **When to use:** Use when deserializing JSON payloads into entities, DTOs, or typed requests on Pure Java proxy controllers.
- **When NOT to use:** Do NOT place `@AutoBody` on GET/DELETE methods without HTTP bodies, or repeat `@AutoBody` twice on the same method signature.
- **Runtime behavior:** Validated with LocalValidatorFactoryBean before entering service transaction.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `required` | `boolean` | `true` | no | `@AutoBody(required = true) @Valid OrderCreateDto payload` | Combine with `@Valid` to trigger Jakarta Bean Validation before proxy dispatch; setting `false` allows empty HTTP request bodies without throwing `400`. |

### `@EnableNestedSubResource`
- **Import:** `import io.github.natswarchuan.core.annotation.EnableNestedSubResource;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Allows recursive traversal on child relationships via GET /{id}/{relation}/** with cyclic loop rejection.
- **How to use:** Set `enableNestedSubResources = true` on `@AutoRestController` and restrict reachable child associations with `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **When to use:** Use when parent-child REST URLs like `GET /api/v1/customer-orders/{id}/items` are desired while still enforcing `@EntitySecurity`, `@MultiTenant`, and ownership checks at every hop.
- **When NOT to use:** Do NOT open on high-fanout tables without configuring `allowedRelationships`, or across Bounded Contexts that should only hold UUIDv7 foreign keys instead of JPA `@OneToMany` links.
- **Runtime behavior:** Requires controller @AutoRestController(enableNestedSubResources = true).

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | no | `@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Empty array allows all reachable child `@Entity` types; explicitly listing classes prevents unintentional exposure of internal audit or billing child tables. |
| `allowedRelationships` | `String[]` | `{}` | no | `@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"items"`); mismatches silently skip or trigger a runtime lookup error. |

### `@BusinessAction`
- **Import:** `import io.github.natswarchuan.core.annotation.BusinessAction;`
- **Target:** `Method (METHOD)`
- **Purpose:** Declares declarative domain state transitions or numeric adjustments on custom action methods.
- **How to use:** Combine `@AutoPatch("/{id}/action")` with `@BusinessAction(targetStateField = "status", targetStateValue = "PAID", entityMethod = "markPaid")` on controller interfaces.
- **When to use:** Use for single-entity workflow transitions (`approve`, `ship`, `cancel`), stock/salary increments, or invoking rich entity domain methods declaratively without writing a Service.
- **When NOT to use:** Do NOT use for multi-entity orchestration, third-party API calls, or asynchronous workflows (delegate to a Spring helper via `@ServiceOverride` or `@CustomEndpoint` instead).
- **Runtime behavior:** Executed atomically before persisting updated entity attributes.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `targetStateField` | `String` | `""` | no | `@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"status"`); mismatches silently skip or trigger a runtime lookup error. |
| `targetStateValue` | `String` | `""` | no | `@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Validated automatically against `@StateMachine` or `@HumanPolicy` before persisting; illegal transitions abort with HTTP `409 Conflict` / `400 Bad Request`. |
| `adjustNumericField` | `String` | `""` | no | `@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Requires either `deltaParamIndex >= 0` or a non-empty `fixedDelta`. Supports `Integer`, `Long`, `BigDecimal`, and `Double` inside the action transaction. |
| `deltaParamIndex` | `int` | `-1` | no | `@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | At startup the proxy registrar evaluates `deltaParamIndex` before `fixedDelta`. Avoid setting conflicting values on both attributes simultaneously. |
| `fixedDelta` | `String` | `""` | no | `@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | At startup the proxy registrar evaluates `deltaParamIndex` before `fixedDelta`. Avoid setting conflicting values on both attributes simultaneously. |
| `entityMethod` | `String` | `""` | no | `@BusinessAction(entityMethod = "markFulfilled")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"markFulfilled"`); mismatches silently skip or trigger a runtime lookup error. |

---

## 2. Pure-Java Bean Stereotypes & Execution Priority (5)

### `@AutoComponent`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoComponent;`
- **Target:** `Class (TYPE)`
- **Purpose:** Framework component marker registered at bootstrap without compile-time @Component import.
- **How to use:** Internal framework stereotype scanned by `AutoBeanFactoryRegistrarBridge` within package `io.github.natswarchuan`. Registered as singleton into the Spring context.
- **When to use:** Use ONLY when contributing framework internals inside `io.github.natswarchuan.*` that must avoid compile-time `org.springframework.stereotype.Component`.
- **When NOT to use:** NEVER use in consumer applications (`com.example.*`, etc.)! `AutoBeanFactoryRegistrarBridge` only scans `io.github.natswarchuan` — use Spring `@Component` in consumer apps or your bean will NOT register.
- **Runtime behavior:** Framework-internal scan (io.github.natswarchuan); consumer apps should use Spring @Component.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoComponent("invoiceValidationHelper")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

### `@AutoService`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoService;`
- **Target:** `Class (TYPE)`
- **Purpose:** Service-layer stereotype marker for ServiceImpl classes paired with @ServiceOverride.
- **How to use:** Internal framework service stereotype scanned inside `io.github.natswarchuan` to register framework service implementations without importing Spring `@Service`.
- **When to use:** Use ONLY for framework internal services in `io.github.natswarchuan.*`.
- **When NOT to use:** NEVER use in application business services (`com.example.*`) — `AutoBeanFactoryRegistrarBridge` ignores packages outside `io.github.natswarchuan`; use Spring `@Service`.
- **Runtime behavior:** Scanned within io.github.natswarchuan by decapitalized simple class name; consumer services should use Spring @Service.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoService("orderFulfillmentService")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |

### `@AutoBean`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoBean;`
- **Target:** `Method (METHOD)`
- **Purpose:** Declares managed bean factory methods inside @AutoConfigurationBean classes.
- **How to use:** Place on factory methods inside framework `@AutoConfigurationBean` classes; invoked reflectively by `AutoBeanFactoryRegistrarBridge`.
- **When to use:** Use ONLY inside `io.github.natswarchuan.config.*` classes needing pure-Java conditional bean factories without Spring `@Bean`.
- **When NOT to use:** Do NOT use in consumer `@Configuration` classes; use standard Spring `@Bean` for custom SPI customizers (`SecurityIdentityCustomizer`, `DistributedLockProvider`, etc.).
- **Runtime behavior:** Processed by PureJavaBeanRegistrarBridge during auto-configuration.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String[]` | `{}` | no | `@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `targetTypeName` | `String` | `""` | no | `@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Optional FQCN hint when the factory method returns a broad supertype or dynamic proxy; ensure the class exists on the runtime classpath. |
| `primary` | `boolean` | `false` | no | `@AutoBean(primary = true)` | Declaring two `@AutoBean(primary = true)` definitions for the exact same type causes an ambiguous bean conflict at startup. |

### `@AutoConfigurationBean`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoConfigurationBean;`
- **Target:** `Class (TYPE)`
- **Purpose:** Marks configuration classes and YAML @ConfigurationProperties binding models.
- **How to use:** Marks Pure Java config and properties classes inside `io.github.natswarchuan.config.*` processed by `ControllerToApiAutoConfiguration` bootstrappers.
- **When to use:** Use ONLY inside the framework library (`io.github.natswarchuan`) for Pure Java `@Configuration` / `@ConfigurationProperties` equivalents.
- **When NOT to use:** Do NOT place on consumer app configuration classes; consumer apps use Spring `@Configuration` and `@ConfigurationProperties`.
- **Runtime behavior:** Registers configuration beans and YAML prefixes cleanly with IDE metadata.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@AutoConfigurationBean("storageAutoConfig")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `prefix` | `String` | `""` | no | `@AutoConfigurationBean(prefix = "nwvmc.storage")` | Binds matching kebab-case properties from `application.yml` into configuration beans; pair with `spring-configuration-metadata.json` for zero IDE warnings. |

### `@OrderPriority`
- **Import:** `import io.github.natswarchuan.core.annotation.OrderPriority;`
- **Target:** `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Purpose:** Controls execution priority order among SPI Customizer beans and filter chains.
- **How to use:** Place `@OrderPriority(1)` on pure-Java interceptors, customizers, or beans ordered by `AutoBeanFactoryRegistrarBridge`.
- **When to use:** Use when deterministic ordering of framework beans or multiple SPI customizers matters without relying on `@Order`.
- **When NOT to use:** Do NOT confuse `@OrderPriority` with Spring Security filter ordering or JPA sort clauses — use `SecurityIdentityCustomizer` and `?sort=` respectively.
- **Runtime behavior:** Lower integer values execute earlier (default Integer.MAX_VALUE).

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | no | `@OrderPriority(10)` | Lower integers execute FIRST (identical to Spring `@Order`). Reserve values `< 0` for security/tracing filters and `10..100` for business interceptors. |

---

## 3. Entity Lifecycle, Validation, StateMachine & Auditing (11)

### `@EntitySecurity`
- **Import:** `import io.github.natswarchuan.core.annotation.EntitySecurity;`
- **Target:** `Class (TYPE)`
- **Purpose:** Enforces NIST Level 2 RBAC, record-level ownerField isolation, and fine-grained permission codes before querying or mutating entities.
- **How to use:** Place `@EntitySecurity` on any JPA `@Entity` class. Specify `{read,write,delete}Roles`, optionally add `ownerField = "createdBy"` for row-level ownership, or `permitAll = true` for public catalogs.
- **When to use:** Use on EVERY exposed `@Entity` as the primary defense-in-depth gate across REST, Batch, Export, and GraphQL queries.
- **When NOT to use:** Do NOT set `permitAll = true` on entities using full `AutoApiController<E>` unless write/delete routes are blocked via `AutoReadApi<E>`, `disabledEndpoints`, or explicit DB `@SecurityPolicyEntity` rules (`EntitySecurityEvaluatorHelper.isPermitAllWithoutDbOverride` skips `@EntitySecurity` role checks across READ, WRITE, and DELETE when no DB policy overrides the method).
- **Runtime behavior:** Evaluated before SQL execution; unauthorized access throws HTTP 403 Forbidden.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `readRoles` | `String[]` | `{}` | no | `@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `writeRoles` | `String[]` | `{}` | no | `@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `deleteRoles` | `String[]` | `{}` | no | `@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `permitAll` | `boolean` | `false` | no | `@EntitySecurity(permitAll = true)` | Overrides `readRoles`/`writeRoles`/`deleteRoles` and allows anonymous HTTP calls. Never enable on PII, billing, or write-enabled internal entities. |
| `ownerField` | `String` | `""` | no | `@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Enforces row-level ownership filtering on `GET`/`PUT`/`PATCH`/`DELETE`: users only see or mutate records where this field equals their authenticated principal unless holding a `bypassOwnerRoles` role. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | no | `@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `permissions` | `String[]` | `{}` | no | `@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Evaluated against fine-grained authorities from JWT claims or DB-RBAC `@SecurityPermissionEntity`; pairs cleanly with role checks for defense-in-depth. |

### `@FieldSecurity`
- **Import:** `import io.github.natswarchuan.core.annotation.FieldSecurity;`
- **Target:** `Field (FIELD)`
- **Purpose:** Masks or nullifies sensitive columns dynamically when caller roles lack permission.
- **How to use:** Place `@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` directly on sensitive JPA entity fields (`costPrice`, `ssn`, `salary`). Masking operates on shallow-cloned response copies so JPA managed entities and L1 cache remain uncorrupted.
- **When to use:** Use when one endpoint/model serves multiple personas (`ROLE_USER` sees `******`/`null` while `ROLE_ADMIN` sees real prices/PII) across REST and GraphQL.
- **When NOT to use:** Do NOT assume `nullifyInsteadOfMask = false` leaks non-`String` secrets (`FieldMaskingExecutionHelper` always falls back to `null` for `BigDecimal`/`LocalDate`/`UUID`); set `nullifyInsteadOfMask = true` when **`String`** fields (like ISO dates or numeric codes) should serialize as `null` instead of `"******"`, and prefer `readDto` if the property key itself must be omitted.
- **Runtime behavior:** Applied post-fetch prior to JSON serialization.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | no | `@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |
| `maskPattern` | `String` | `"******"` | no | `@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Ignored when `nullifyInsteadOfMask = true`. For non-String fields (`BigDecimal`, `Integer`, `LocalDate`), prefer `nullifyInsteadOfMask = true` to keep JSON types strictly valid. |
| `nullifyInsteadOfMask` | `boolean` | `false` | no | `@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Essential for numeric, date, and nested object fields so TypeScript/Zod clients receive valid `null` instead of a String mask breaking deserialization. |

### `@StateMachine`
- **Import:** `import io.github.natswarchuan.core.annotation.StateMachine;`
- **Target:** `Field (FIELD)`
- **Purpose:** Enforces allowed state transitions via POST /{id}/transition and restricts DELETE /{id} to deletableStates.
- **How to use:** Place on a String state field (`@StateMachine(initial = "CREATED", transitions = {"CREATED:PAID,CANCELLED"}, deletableStates = {"CREATED", "CANCELLED"})`). Enforced automatically on PUT/PATCH/DELETE and `@BusinessAction`.
- **When to use:** Use for strict finite lifecycle workflows (orders, loans, invoices, tickets) to guarantee illegal state jumps or deletes return `422 Unprocessable Entity`.
- **When NOT to use:** NEVER use `"->"` syntax (`EntityStateMachineUtil` splits strictly on `":"`!), and do not duplicate it with `HumanPolicy.lifecycle` on the same field without coordination.
- **Runtime behavior:** Rejects illegal transitions or deletions with HTTP 422 BusinessRuleViolationException.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | no | `@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Automatically populated on `POST` creation when the incoming status field is blank/null; must match the left side (before `:`) of at least one entry in `transitions`. |
| `transitions` | `String[]` | `{}` | no | `@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Strictly enforces the exact colon syntax `"FROM:TO1,TO2"` (case-sensitive, comma-separated targets). Any `POST /{id}/transition` or `@BusinessAction` jumping to an undeclared state is rejected with HTTP `422 Unprocessable Entity` (`BusinessRuleViolationException`). |
| `deletableStates` | `String[]` | `{}` | no | `@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | When non-empty, `DELETE /{id}` fails with HTTP `422 Unprocessable Entity` (`BusinessRuleViolationException`) if the entity is in any other state (e.g., `"PAID"` or `"SHIPPED"`). |

### `@HumanPolicy`
- **Import:** `import io.github.natswarchuan.core.annotation.HumanPolicy;`
- **Target:** `Class (TYPE)`
- **Purpose:** Compiles readable English policy clauses into active RBAC, transition, and masking rules.
- **How to use:** Place `@HumanPolicy` on an entity with structured English phrases, or bind via `spring-nwvmc.human-policies` YAML in `application.yml`. Compiled once by `HumanPolicyRegistryHelper` into `HumanPolicyDefinitionDto`.
- **When to use:** Use when product managers, compliance officers, or YAML config teams want human-readable domain policies externalized cleanly without code edits.
- **When NOT to use:** Do NOT write arbitrary non-English prose or free-form essays — `HumanPolicyRegexCompilerHelper` matches deterministic English grammar templates. Use `@EntitySecurity` + `@StateMachine` directly for strict compile-time clarity.
- **Runtime behavior:** Inspectable per entity at GET /human-policy and overridable in YAML under spring-nwvmc.human-policies.<Entity>.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `lifecycle` | `String` | `""` | no | `@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Compiled once at startup into the exact same finite state machine engine as `@StateMachine`; do not declare conflicting `@StateMachine` rules on the same entity. |
| `security` | `String` | `""` | no | `@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Role tokens are normalized with the `ROLE_` prefix automatically; parsed eagerly at startup so malformed clauses fail fast. |
| `masking` | `String` | `""` | no | `@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"costPrice"`); mismatches silently skip or trigger a runtime lookup error. |
| `stateField` | `String` | `""` | no | `@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"orderStatus"`); mismatches silently skip or trigger a runtime lookup error. |

### `@AuditTrail`
- **Import:** `import io.github.natswarchuan.core.annotation.AuditTrail;`
- **Target:** `Class (TYPE)`
- **Purpose:** Records field-level diffs across mutations powering Time-Travel state reconstruction and /diff inspection.
- **How to use:** Annotate any `BaseAuditEntity` subclass with `@AuditTrail(recordFieldDiffs = true)`. All POST/PUT/PATCH/DELETE mutations log revision snapshots via `AuditTrailService` automatically.
- **When to use:** Use on compliance-sensitive entities (orders, payments, clinical records, accounts, RBAC policies) needing `GET /api/v1/system/time-travel/{entityName}/{id}` Time-Travel auditing.
- **When NOT to use:** Set `recordFieldDiffs = false` or omit `@AuditTrail` on ultra-high-churn telemetry/log tables to avoid magnifying write amplification in audit storage.
- **Runtime behavior:** Captures oldValue and newValue deltas on create, update, patch, transition, and restore.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `category` | `String` | `""` | no | `@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Used to tag and filter audit log queries; leave `""` to default to the JPA entity simple class name. |
| `recordFieldDiffs` | `boolean` | `true` | no | `@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Captures before/after JSON field diffs on every `PUT`/`PATCH`; disable (`false`) on entities storing large BLOBs or high-frequency telemetry rows to save storage. |

### `@MultiTenant`
- **Import:** `import io.github.natswarchuan.core.annotation.MultiTenant;`
- **Target:** `Class (TYPE)`
- **Purpose:** Isolates row queries and mutations automatically by active tenant context unless caller holds a bypass role.
- **How to use:** Place `@MultiTenant` on any SaaS `@Entity` containing a `tenantId` field (or override `tenantField`). `TenantSecurityFilterHelper` automatically injects tenant filters on reads, overwrites spoofed `tenantId` on create/import, and rejects missing tenant claims with fail-closed `403`.
- **When to use:** Use on all shared-database B2B SaaS tenant tables (vendor stores, invoices, orders, workspaces) to prevent cross-tenant leaks across REST, Batch, Export, and GraphQL.
- **When NOT to use:** Do NOT place on global shared reference tables (countries, public categories, currencies) where every user must read rows regardless of tenant, or without verifying `SecurityIdentityCustomizer` supplies `tenantId` in non-superadmin tokens.
- **Runtime behavior:** Fail-closed HTTP 403 when tenant context is unbound without bypass role; force-overwrites tenantId on create (anti-spoofing) and enforces tenant ownership across all ID-based reads, updates, deletes, restores, clones, and sub-resources.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | no | `@MultiTenant(tenantField = "organizationId")` | Add a composite database index starting with this column `(tenant_id, id)` for O(log N) tenant-isolated queries and zero cross-tenant leakage. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | no | `@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Store role names in `RoleConstant` with the `ROLE_` prefix (e.g., `ROLE_ADMIN`) matching your Spring Security `GrantedAuthority` entries. |

### `@UniqueField`
- **Import:** `import io.github.natswarchuan.core.annotation.UniqueField;`
- **Target:** `Field (FIELD)`
- **Purpose:** Validates uniqueness before persistence on create, update, and upsert.
- **How to use:** Place `@UniqueField` on business key entity properties (`email`, `skuCode`, `licenseNumber`) alongside JPA `@Column(unique = true)`. Pre-checked across active records (`deleted = false`) before POST/PUT/upsert.
- **When to use:** Use when soft-deleted records (`deleted = true`) must not block re-registering SKUs/emails, and you want clean localized `HTTP 409 Conflict` API errors.
- **When NOT to use:** Do NOT use alone without a database `UNIQUE` constraint/index in high-concurrency environments (race conditions between check and insert fall back to DB constraint mapped to `HTTP 409`). Also omit on non-unique display fields like `name` or `description`.
- **Runtime behavior:** Throws ConflictBusinessException (HTTP 409) when duplicate value exists.
- **Attributes:** *Marker annotation (no attributes).*

### `@AutoCode`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoCode;`
- **Target:** `Field (FIELD)`
- **Purpose:** Auto-generates unique prefixed business codes on creation or clone when left blank.
- **How to use:** Place `@AutoCode(prefix = "PRD-")` on a String business code field. Whenever an incoming payload leaves the field empty on create or clone, the framework generates e.g. `PRD-0194E1A0`.
- **When to use:** Use for human-readable reference numbers (order numbers, SKUs, store codes, ticket IDs) backed by UUIDv7 entropy without DB sequence bottlenecks.
- **When NOT to use:** Do NOT use if business regulations strictly require gap-free monotonic integers (`1, 2, 3...` without skipped numbers, e.g., statutory tax invoice serials) or omit `prefix` (compilation fails since `prefix` has no default).
- **Runtime behavior:** Populates prefix + unique token before entity validation and save.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | YES | `@AutoCode(prefix = "INV-") private String invoiceCode;` | Required attribute; appends an 8-character uppercase UUIDv7 hash (e.g. `INV-0194E1A0`) when the field is null/blank on create or clone, preserving caller-supplied codes if present. |

### `@AutoSlug`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoSlug;`
- **Target:** `Field (FIELD)`
- **Purpose:** Synthesizes normalized URL-friendly ASCII slugs automatically from sourceField.
- **How to use:** Place `@AutoSlug(sourceField = "storeName")` on a `slug` String field. Automatically populates upon create when empty, and appends suffix on clone.
- **When to use:** Use for SEO-friendly URLs on storefronts, blog posts, categories, and product catalogs (especially multilingual/Vietnamese titles).
- **When NOT to use:** Do NOT point `sourceField` to a non-existent or non-String property, and remember updating `title` later will NOT overwrite an already-persisted custom `slug` automatically.
- **Runtime behavior:** Normalizes Unicode diacritics and exposes lookup via filtered slug queries.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | YES | `@AutoSlug(sourceField = "productName") private String slug;` | Required attribute; normalizes Unicode/Vietnamese/CJK accents into lowercase URL-safe kebab-case (`"Áo Sơ Mi"` -> `"ao-so-mi"`). Pair with `@UniqueField` to guarantee uniqueness. |

### `@ComputedField`
- **Import:** `import io.github.natswarchuan.core.annotation.ComputedField;`
- **Target:** `Field (FIELD)`
- **Purpose:** Computes derived numeric totals cleanly prior to saving entity changes.
- **How to use:** Place on a derived numeric field (`BigDecimal subTotal` or `totalAmount`). Recomputed automatically on POST/PUT/PATCH/upsert using exact `BigDecimal` arithmetic on server side.
- **When to use:** Use for server-authoritative line totals, order grand totals (`sum(items.subTotal) - discount + shipping`), and tax/fee derivations so clients cannot spoof totals.
- **When NOT to use:** Do NOT use for complex tiered pricing, currency FX lookups, or dynamic promotions requiring external DB/API calls (compute those in a `@ServiceOverride` Spring helper bean).
- **Runtime behavior:** Validated at boot by ComputedFieldFailFastUtil so invalid sourceFields fail fast.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | no | `@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Recomputed automatically on `POST`/`PUT`/`PATCH`/Upsert before persisting, overriding any tampered client-supplied total. |
| `sourceFields` | `String[]` | `{}` | no | `@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"unitPrice"`); mismatches silently skip or trigger a runtime lookup error. |
| `collectionField` | `String` | `""` | no | `@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"items"`); mismatches silently skip or trigger a runtime lookup error. |
| `itemField` | `String` | `""` | no | `@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"subTotal"`); mismatches silently skip or trigger a runtime lookup error. |
| `subtractField` | `String` | `""` | no | `@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"discountAmount"`); mismatches silently skip or trigger a runtime lookup error. |
| `addField` | `String` | `""` | no | `@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"shippingFee"`); mismatches silently skip or trigger a runtime lookup error. |

### `@CustomQuery`
- **Import:** `import io.github.natswarchuan.core.annotation.CustomQuery;`
- **Target:** `Method (METHOD)`
- **Purpose:** Allows binding custom SQL/JPQL or provider helper methods to controller endpoints.
- **How to use:** Combine with `@AutoGet`/`@AutoPost` on a custom method inside an `@AutoRestController`, binding named arguments via `@AutoParam` or `@AutoVariable` matching `:param` placeholders.
- **When to use:** Use for native SQL reporting, CTEs, window functions, PostgreSQL JSONB queries, or Oracle/MySQL vendor syntax without creating a Spring Data Repository class.
- **When NOT to use:** NEVER concatenate raw user input into SQL (`sqlProvider` or `value` must use `:named` parameters!), do NOT point `sqlProvider` to a broken/missing method (`EntityFailFastValidatorUtil` rejects it at boot), and NEVER use SQL `JOIN` across separate Bounded Context modules.
- **Runtime behavior:** Dispatched with bound named parameters via JPA EntityManager.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `""` | no | `@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Always bind user inputs via `:param` or `?1` placeholders — never concatenate untrusted strings. Leave `""` when delegating dynamic SQL generation to `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | no | `@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | Native SQL (`true`, default) unlocks CTEs, window functions, and DB-specific JSON operators; switch to `false` (JPQL) for cross-database portability across H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | no | `@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Always specify a DTO projection class for aggregate/reporting queries to avoid `SELECT *` overhead and prevent untyped `Object[]` rows. |
| `sqlProvider` | `Class<?>` | `Void.class` | no | `@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Validated eagerly during application bootstrap; misspelled names or invalid `sqlProvider` values fail fast before serving traffic. |
| `providerMethod` | `String` | `""` | no | `@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Must match the exact Java method/field identifier (case-sensitive, e.g., `"buildRevenueSql"`); mismatches silently skip or trigger a runtime lookup error. |
| `modifying` | `boolean` | `false` | no | `@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Required (`true`) for any `UPDATE`/`DELETE` statement; automatically wraps execution in a read-write transaction and clears JPA persistence context. |

---

## 4. Declarative Security, Field Masking, Multi-Tenant & DB-RBAC (18)

### `@SecurityRoleEntity`
- **Import:** `import io.github.natswarchuan.core.annotation.SecurityRoleEntity;`
- **Target:** `Entity (TYPE)`
- **Purpose:** Designates a JPA Entity as the live Database RBAC Role catalog table.
- **How to use:** Place `@SecurityRoleEntity` on your database Role JPA entity (`cacheTtlSeconds = 60`), mark its role key with `@RoleCode`, and optionally mark `@RoleName` and `@RolePermissions`.
- **When to use:** Use when administrators manage dynamic roles and permission assignments at runtime through database tables instead of hardcoded Java enums/constants.
- **When NOT to use:** Do NOT omit `@RoleCode` (`EntityFailFastValidatorUtil` aborts startup!), and avoid registering multiple `@SecurityRoleEntity` classes in the same persistence context.
- **Runtime behavior:** DynamicDatabaseRbacProviderHelper caches role-to-permission bindings in Caffeine with configurable TTL and auto-invalidates on write.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | no | `@SecurityRoleEntity(cacheTtlSeconds = 120L)` | Shorter TTLs reflect database changes faster at higher query cost; longer TTLs cut DB load but delay permission revocations until expiry. |

### `@RoleCode`
- **Import:** `import io.github.natswarchuan.core.annotation.RoleCode;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the unique authority/role code column inside a @SecurityRoleEntity.
- **How to use:** Place `@RoleCode` on a field or getter inside a `@SecurityRoleEntity` JPA entity (REQUIRED: role authority code, normalized automatically with ROLE_ prefix).
- **When to use:** Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@RoleCode` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Read via cached LambdaAccessorUtil to match GrantedAuthority tokens (e.g. ROLE_FINANCE_ANALYST).
- **Attributes:** *Marker annotation (no attributes).*

### `@RoleName`
- **Import:** `import io.github.natswarchuan.core.annotation.RoleName;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Identifies the human-readable role display name field on a @SecurityRoleEntity.
- **How to use:** Place `@RoleName` on a field or getter inside a `@SecurityRoleEntity` JPA entity (optional display title of the role).
- **When to use:** Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@RoleName` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Exposed in RBAC diagnostic metadata and Dev Studio role inspection endpoints.
- **Attributes:** *Marker annotation (no attributes).*

### `@RolePermissions`
- **Import:** `import io.github.natswarchuan.core.annotation.RolePermissions;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Marks the collection or CSV string field holding granted permission codes on a role entity.
- **How to use:** Place `@RolePermissions` on a field or getter inside a `@SecurityRoleEntity` JPA entity (String, Collection<String>, or collection of Permission entities linked to this role).
- **When to use:** Use whenever `@SecurityRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@RolePermissions` on multiple properties in the same `@SecurityRoleEntity` class or outside `@SecurityRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Parsed dynamically and expanded into effective SecurityIdentityCustomizer authorities.
- **Attributes:** *Marker annotation (no attributes).*

### `@SecurityPermissionEntity`
- **Import:** `import io.github.natswarchuan.core.annotation.SecurityPermissionEntity;`
- **Target:** `Entity (TYPE)`
- **Purpose:** Marks a JPA Entity storing resource-action permissions and dynamic field-masking rules.
- **How to use:** Place `@SecurityPermissionEntity` on your Permission table JPA entity and mark the required identifier field with `@PermissionCode` (plus `@PermissionResource`, `@PermissionAction`, `@PermissionFieldMask`).
- **When to use:** Use when managing granular action/resource grants and field-level masking permissions dynamically in DB tables.
- **When NOT to use:** Do NOT forget `@PermissionCode`, and do not mix multiple `@SecurityPermissionEntity` classes in the same schema.
- **Runtime behavior:** Loaded into DatabaseRbacRuleMatcherHelper to enforce resource-level CRUD access and post-fetch field masking.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | no | `@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | Shorter TTLs reflect database changes faster at higher query cost; longer TTLs cut DB load but delay permission revocations until expiry. |

### `@PermissionCode`
- **Import:** `import io.github.natswarchuan.core.annotation.PermissionCode;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Designates the unique permission identifier field inside @SecurityPermissionEntity.
- **How to use:** Place `@PermissionCode` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (REQUIRED: unique permission identifier such as "product:read" or "billing:*").
- **When to use:** Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PermissionCode` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Matched against caller authorities and @EntitySecurity.permissions() codes.
- **Attributes:** *Marker annotation (no attributes).*

### `@PermissionResource`
- **Import:** `import io.github.natswarchuan.core.annotation.PermissionResource;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the target entity or API resource name (or wildcard *) inside @SecurityPermissionEntity.
- **How to use:** Place `@PermissionResource` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (target entity simple/table name or wildcard "*").
- **When to use:** Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PermissionResource` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Evaluated case-insensitively by DatabaseRbacRuleMatcherHelper with wildcard fallback.
- **Attributes:** *Marker annotation (no attributes).*

### `@PermissionAction`
- **Import:** `import io.github.natswarchuan.core.annotation.PermissionAction;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the logical CRUD or custom action verb protected by a @SecurityPermissionEntity rule.
- **How to use:** Place `@PermissionAction` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (action category: "READ", "WRITE", "DELETE", or "*").
- **When to use:** Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PermissionAction` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Normalized automatically from controller method names (READ, WRITE, DELETE, or explicit custom action).
- **Attributes:** *Marker annotation (no attributes).*

### `@PermissionFieldMask`
- **Import:** `import io.github.natswarchuan.core.annotation.PermissionFieldMask;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Declares comma-separated entity fields that must be dynamically redacted when this DB permission rule triggers.
- **How to use:** Place `@PermissionFieldMask` on a field or getter inside a `@SecurityPermissionEntity` JPA entity (optional comma-separated masked field names for callers holding this rule).
- **When to use:** Use whenever `@SecurityPermissionEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PermissionFieldMask` on multiple properties in the same `@SecurityPermissionEntity` class or outside `@SecurityPermissionEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Applied dynamically alongside @FieldSecurity prior to HTTP JSON response serialization.
- **Attributes:** *Marker annotation (no attributes).*

### `@SecurityUserRoleEntity`
- **Import:** `import io.github.natswarchuan.core.annotation.SecurityUserRoleEntity;`
- **Target:** `Entity (TYPE)`
- **Purpose:** Maps the JPA Entity binding authenticated user subjects to DB roles and optional tenant scopes.
- **How to use:** Place `@SecurityUserRoleEntity` on your User-Role assignment join entity and mark caller identity with required `@UserRoleSubject`, `@UserRoleCode`, and optional `@UserRoleTenantId`.
- **When to use:** Use when JWT tokens only identify `username`/`sub` and runtime authorities should be enriched dynamically from database assignments (optionally scoped per tenant).
- **When NOT to use:** Do NOT forget `@UserRoleSubject`, and keep stateless pure JWT claims (`SecurityIdentityCustomizer`) if external IdP (Keycloak/Auth0) already injects immutable authorities.
- **Runtime behavior:** Queried automatically during JWT / SecurityContext hydration via SecurityIdentityCustomizer.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `enabled` | `boolean` | `true` | no | `@SecurityUserRoleEntity(enabled = true)` | Set `false` temporarily during schema migration to pause dynamic user-role table joins while keeping JWT claim-based roles operational. |

### `@UserRoleSubject`
- **Import:** `import io.github.natswarchuan.core.annotation.UserRoleSubject;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Identifies the principal subject / username field on a @SecurityUserRoleEntity.
- **How to use:** Place `@UserRoleSubject` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (REQUIRED: caller username / JWT subject identifier).
- **When to use:** Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@UserRoleSubject` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Matched against Authentication.getName() from the active SecurityContext.
- **Attributes:** *Marker annotation (no attributes).*

### `@UserRoleCode`
- **Import:** `import io.github.natswarchuan.core.annotation.UserRoleCode;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Binds the assigned role code column inside @SecurityUserRoleEntity.
- **How to use:** Place `@UserRoleCode` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (assigned role code String (e.g. "ROLE_MANAGER")).
- **When to use:** Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@UserRoleCode` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Resolves linked @SecurityRoleEntity permissions at runtime when evaluating policies.
- **Attributes:** *Marker annotation (no attributes).*

### `@UserRoleTenantId`
- **Import:** `import io.github.natswarchuan.core.annotation.UserRoleTenantId;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Scopes a @SecurityUserRoleEntity assignment to a specific tenant identifier (or * for global).
- **How to use:** Place `@UserRoleTenantId` on a field or getter inside a `@SecurityUserRoleEntity` JPA entity (optional tenant identifier scoping this role assignment (or "*" for global)).
- **When to use:** Use whenever `@SecurityUserRoleEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@UserRoleTenantId` on multiple properties in the same `@SecurityUserRoleEntity` class or outside `@SecurityUserRoleEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Filtered against TenantContextHolder / X-Tenant-ID on each authenticated request.
- **Attributes:** *Marker annotation (no attributes).*

### `@SecurityPolicyEntity`
- **Import:** `import io.github.natswarchuan.core.annotation.SecurityPolicyEntity;`
- **Target:** `Entity (TYPE)`
- **Purpose:** Marks a JPA Entity storing explicit ALLOW / DENY runtime authorization policies prioritized by priority.
- **How to use:** Place `@SecurityPolicyEntity(priority = 100)` on a rule table entity, marking allowed roles via mandatory `@PolicyAllowedRoles` alongside `@PolicyResource`, `@PolicyAction`, and `@PolicyEffect` ("ALLOW"/"DENY").
- **When to use:** Use when overriding or supplementing static `@EntitySecurity` annotations dynamically from database rules (including explicit `DENY` emergency kill-switches).
- **When NOT to use:** Do NOT omit `@PolicyAllowedRoles` (`EntityFailFastValidatorUtil` rejects startup), and recognize explicit `DENY` rules take precedence over matching grants.
- **Runtime behavior:** Explicit DENY overrides ALLOW deterministically; DatabaseRbacRuleMatcherHelper checks policies before SQL execution.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `priority` | `int` | `100` | no | `@SecurityPolicyEntity(priority = 10)` | Lower values take precedence when multiple dynamic policies match the same entity and field (e.g., priority `10` overrides default `100`). |

### `@PolicyResource`
- **Import:** `import io.github.natswarchuan.core.annotation.PolicyResource;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the target resource identifier pattern in a @SecurityPolicyEntity.
- **How to use:** Place `@PolicyResource` on a field or getter inside a `@SecurityPolicyEntity` JPA entity (entity/resource pattern (or "*") covered by this policy).
- **When to use:** Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PolicyResource` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Supports exact entity class/resource names as well as wildcard * matching.
- **Attributes:** *Marker annotation (no attributes).*

### `@PolicyAction`
- **Import:** `import io.github.natswarchuan.core.annotation.PolicyAction;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the protected operation verb (READ, WRITE, DELETE, methodName, *) inside @SecurityPolicyEntity.
- **How to use:** Place `@PolicyAction` on a field or getter inside a `@SecurityPolicyEntity` JPA entity ("READ", "WRITE", "DELETE", or "*").
- **When to use:** Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PolicyAction` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Evaluated per HTTP method / endpoint operation before service delegation.
- **Attributes:** *Marker annotation (no attributes).*

### `@PolicyAllowedRoles`
- **Import:** `import io.github.natswarchuan.core.annotation.PolicyAllowedRoles;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Maps the collection or comma-separated roles targeted by a @SecurityPolicyEntity rule.
- **How to use:** Place `@PolicyAllowedRoles` on a field or getter inside a `@SecurityPolicyEntity` JPA entity (REQUIRED: comma-separated string or collection of roles matched by this policy).
- **When to use:** Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PolicyAllowedRoles` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Cross-referenced against active JWT authorities plus DB-hydrated @SecurityUserRoleEntity roles.
- **Attributes:** *Marker annotation (no attributes).*

### `@PolicyEffect`
- **Import:** `import io.github.natswarchuan.core.annotation.PolicyEffect;`
- **Target:** `Field / Method (FIELD, METHOD)`
- **Purpose:** Specifies ALLOW or DENY policy decision outcome on a @SecurityPolicyEntity rule.
- **How to use:** Place `@PolicyEffect` on a field or getter inside a `@SecurityPolicyEntity` JPA entity ("ALLOW" or "DENY" policy decision effect).
- **When to use:** Use whenever `@SecurityPolicyEntity` uses arbitrary custom SQL column/property names while mapping to the framework DB-RBAC engine.
- **When NOT to use:** Do NOT place `@PolicyEffect` on multiple properties in the same `@SecurityPolicyEntity` class or outside `@SecurityPolicyEntity` (`DatabaseRbacFailFastValidatorUtil` / `EntityFailFastValidatorUtil` fails fast at startup on both missing mandatory markers and duplicated single-valued markers).
- **Runtime behavior:** Any matching DENY policy immediately aborts the request with HTTP 403 AccessDeniedBusinessException.
- **Attributes:** *Marker annotation (no attributes).*

---

## 5. Resilience, Caching, Distributed Lock, Multi-DB, Events & Webhooks (13)

### `@DistributedLock`
- **Import:** `import io.github.natswarchuan.module.lock.annotation.DistributedLock;`
- **Target:** `Method (METHOD)`
- **Purpose:** Serializes concurrent access on SpEL keys cached in AST map (max 1024 entries; waitTimeMs=3000L, leaseTimeMs=5000L defaults).
- **How to use:** Place `@DistributedLock(key = "'sku:' + #skuCode", waitTimeMs = 3000, leaseTimeMs = 5000)` on a Spring `@Service` method backed by non-final proxies, or supply a Redis `DistributedLockProvider` SPI bean for clusters.
- **When to use:** Use when preventing overselling inventory, concurrent wallet debits, or duplicate scheduled batch drains across competing threads/nodes.
- **When NOT to use:** NEVER assume the default Caffeine + `ReentrantLock` provider synchronizes across multiple pods/Kubernetes replicas without replacing `DistributedLockProvider`! Also do NOT place on `final class` services.
- **Runtime behavior:** DistributedLockAspect throws DistributedLockAcquisitionException (HTTP 409) upon timeout.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `key` | `String` | `""` | no | `@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Always scope the key to the narrowest entity/business ID (e.g., `#id` or `#request.skuCode`); using a constant key serializes every caller globally. |
| `waitTimeMs` | `long` | `3000L` | no | `@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Tune carefully for production latency SLA: too low causes spurious 409 lock contention errors; too high stalls HTTP worker threads under bursts. |
| `leaseTimeMs` | `long` | `5000L` | no | `@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Tune carefully for production latency SLA: must exceed your slowest p99 transaction duration or the lock may auto-expire mid-write and allow concurrent corruption. |

### `@Idempotent`
- **Import:** `import io.github.natswarchuan.core.annotation.Idempotent;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Prevents concurrent or replayed duplicate writes within configurable TTL windows.
- **How to use:** Place `@Idempotent` on `@AutoRestController` methods/interfaces (`ProxyIdempotencyGuardHelper`) or non-final Spring `@Service` methods (`IdempotencyAspect` + atomic `IdempotencyStoreProvider`). Failures release the key so clients can safely retry.
- **When to use:** Use for checkout/payment capture, wallet transfers, webhook ingestion, and POST mutations vulnerable to mobile/network double-taps.
- **When NOT to use:** Do NOT place on GET reads or `@CustomEndpoint` methods without putting it inside the Spring bean service method where Spring AOP intercepts, and supply Redis `IdempotencyStoreProvider` for multi-pod deployments.
- **Runtime behavior:** Enforced by IdempotencyAspect + ProxyIdempotencyGuardHelper with Caffeine TTL in-flight locking (throws ConflictBusinessException HTTP 409). Null/blank keys pass through; IdempotencyManagerHelper offers optional SHA-256 helpers.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | no | `@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Clients must send a unique UUIDv7 per logical mutation attempt and reuse the exact same header on network retries; expose this header in CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | no | `@Idempotent(ttlSeconds = 900L)` | Retention window for cached responses in Redis/in-memory store; set `300L–86400L` depending on client retry horizons (e.g., 24h for payment webhooks). |

### `@RateLimit`
- **Import:** `import io.github.natswarchuan.core.annotation.RateLimit;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Enforces sliding-window request throttling per IP, User, or Tenant partition.
- **How to use:** Place `@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` on `@AutoRestController` interfaces or methods. Emits `X-RateLimit-Remaining` + `X-RateLimit-Reset` on allowed calls and RFC 6585 `Retry-After` + `HTTP 429 Too Many Requests` when exhausted.
- **When to use:** Use on public search, OTP/auth endpoints, AI natural-language queries, and heavy exports/imports to prevent abuse and DDoS amplification.
- **When NOT to use:** Do NOT place overly tight limits on internal health probes, and avoid `partitionKey = "GLOBAL"` when noisy tenants or users must stay isolated (prefer `"USER"`, `"TENANT"`, `"IP"`, or `#expr` SpEL).
- **Runtime behavior:** Increments nwvmc.ratelimit.rejected.total metric and responds with HTTP 429 Too Many Requests.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `requests` | `int` | `60` | no | `@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Emits `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and RFC 6585 `Retry-After` headers when HTTP `429 Too Many Requests` is returned. |
| `windowSeconds` | `int` | `60` | no | `@RateLimit(requests = 100, windowSeconds = 60)` | Defines the sliding/fixed counter window length; also drives the `X-RateLimit-Reset` epoch timestamp and `Retry-After` delay. |
| `partitionKey` | `String` | `"IP"` | no | `@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | `"USER"` buckets by authenticated principal and safely falls back to client IP for anonymous calls; `"GLOBAL"` shares one counter across every caller (use carefully on public routes). |

### `@EntityCircuitBreaker`
- **Import:** `import io.github.natswarchuan.core.annotation.EntityCircuitBreaker;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Wraps operations inside Resilience4j Circuit Breakers reporting telemetry to Actuator & Micrometer.
- **How to use:** Place `@EntityCircuitBreaker` on controllers/methods integrating external REST, legacy DB, or flaky AI providers to isolate cascading thread starvation via Resilience4j.
- **When to use:** Use when downstream failures must fail-fast (`HTTP 503`) instead of blocking Virtual Threads waiting on timeouts.
- **When NOT to use:** 4xx `BaseBusinessException` errors (`400`/`401`/`403`/`404`/`409`) are automatically ignored by `CircuitBreakerErrorFilterUtil` — do NOT wrap non-transient client failures in raw `RuntimeException` (500) or they will trip the breaker to `OPEN` (`503`).
- **Runtime behavior:** Trips to OPEN (HTTP 503) when error ratio exceeds threshold; updates nwvmc.resilience.circuitbreaker.state gauge.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `name` | `String` | `""` | no | `@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Identifies the Resilience4j registry instance and Micrometer metrics tag; leave `""` to auto-name from the controller/entity class. |
| `failureRateThreshold` | `float` | `50.0f` | no | `@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | no | `@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `slidingWindowSize` | `int` | `20` | no | `@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | no | `@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Tune carefully for production latency SLA: 4xx `BaseBusinessException` responses are automatically ignored; only 5xx/infrastructure errors count toward tripping the breaker. |

### `@EntityRetry`
- **Import:** `import io.github.natswarchuan.core.annotation.EntityRetry;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Automatically retries transient failures with configurable exponential backoff.
- **How to use:** Place `@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` on `@AutoRestController` methods or classes to automatically recover from transient network/DB lock glitches via Resilience4j.
- **When to use:** Use for idempotent GET reads, `@AutoPut` replacements, or downstream calls guarded by `@Idempotent` encountering transient hiccups.
- **When NOT to use:** NEVER place on non-idempotent POST creations or payment charges lacking `@Idempotent` (retries would duplicate charges!), and never stack long backoff delays inside latency-critical endpoints. **Version Note:** `0.1.0` natively excludes 4xx `BaseBusinessException` from `@EntityRetry` retries (legacy `v0.0.3` wrapped caught 4xx into `500 RetryExhaustedException` — upgrade to `0.1.0`).
- **Runtime behavior:** Throws standardized exception if all configured retry attempts exhaust.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `name` | `String` | `""` | no | `@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `maxAttempts` | `int` | `3` | no | `@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `waitDurationMs` | `long` | `500L` | no | `@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |
| `backoffMultiplier` | `double` | `2.0d` | no | `@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Tune carefully for production latency SLA: multiply `maxAttempts` by backoff duration and verify total latency stays below upstream gateway timeouts. |

### `@HttpCacheable`
- **Import:** `import io.github.natswarchuan.module.cache.http.annotation.HttpCacheable;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Computes RFC 7232 weak ETags (W/"...") and emits Cache-Control + HTTP 304 Not Modified responses.
- **How to use:** Place `@HttpCacheable(maxAgeSeconds = 120, isPrivate = false)` on read-only `@AutoRestController` interfaces or GET methods to emit standard RFC 7232/9111 HTTP caching.
- **When to use:** Use for semi-static catalogs, reference dictionaries, OpenAPI metadata, or public storefront listings where HTTP `304` eliminates JSON re-transmission.
- **When NOT to use:** NEVER leave `isPrivate = false` (default) on user-specific PII, tenant-isolated financials, or role-masked endpoints — set `isPrivate = true` or omit HTTP caching completely so CDNs cannot serve one user’s response to another! **Version Note:** `0.1.0` natively supports `ResponseEntity<ApiResponse<MyDto>>` on `@ServiceOverride` methods, unwrapping `ApiResponse.getData()` before SHA-256 ETag hashing (legacy `v0.0.3` required returning `ApiResponse<MyDto>` and manual `HttpCacheEvaluatorHelper` hashing).
- **Runtime behavior:** Records HIT/MISS counters in nwvmc.cache.http.requests.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | no | `@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Emits `Cache-Control: max-age=<N>`. Set `0` with `mustRevalidate = true` + `generateETag = true` for immediate conditional revalidation via `304 Not Modified`. |
| `isPrivate` | `boolean` | `false` | no | `@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | CRITICAL: Always set `isPrivate = true` on authenticated, tenant-scoped, or `@FieldSecurity`-masked endpoints to prevent shared CDNs from serving User A’s response to User B. |
| `mustRevalidate` | `boolean` | `true` | no | `@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Instructs intermediate caches never to serve stale responses once `maxAgeSeconds` elapses without checking the origin server. |
| `generateETag` | `boolean` | `true` | no | `@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Computes a weak RFC 7232 `ETag` digest from the serialized response and short-circuits matching `If-None-Match` calls with `304 Not Modified` (0-byte body). |

### `@AutoCacheable`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoCacheable;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Caches server-side read method outputs inside Caffeine L1 / Redis L2 engines.
- **How to use:** Place `@AutoCacheable(value = {"entityDetails"}, key = "#entityClass.simpleName + ':' + #id")` on read methods inside framework or Spring `@Service` beans.
- **When to use:** Use for read-heavy lookups by ID or static metadata queries where Read/Write ratio exceeds ~10:1 and results are cloned before client field projection.
- **When NOT to use:** NEVER share a single cache key across un-cloned mutable entities returned to sparse `?fields=` or `@FieldSecurity` (use `EntityCloneSnapshotHelper` before mutating), or on high-churn write-heavy transactional rows.
- **Runtime behavior:** Configurable globally via app.framework.cache.type.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String[]` | `{}` | no | `@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Cache region names must match your configured Caffeine/Redis regions; pair every write/delete mutation with matching `@AutoCacheEvict(value = ...)` to avoid stale reads. |
| `key` | `String` | `""` | no | `@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | In multi-tenant apps, always include `#tenantId` or current tenant context in the cache key to prevent cross-tenant cache poisoning. |

### `@AutoCacheEvict`
- **Import:** `import io.github.natswarchuan.core.annotation.AutoCacheEvict;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Evicts stale server-side cache entries upon mutations.
- **How to use:** Place `@AutoCacheEvict(value = {"entityDetails"}, key = "...")` on update/delete methods alongside `@AutoCacheable` reads.
- **When to use:** Use whenever single-entity updates, state transitions, or deletes mutate records cached via `@AutoCacheable`.
- **When NOT to use:** Avoid setting `allEntries = true` on high-frequency `create` endpoints (causes Cache Stampede across cold reads; `DynamicEntityCrudServiceImpl.create` intentionally avoids global eviction).
- **Runtime behavior:** Executed post-mutation cleanly without leaving stale read slices.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String[]` | `{}` | no | `@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Validated eagerly during application bootstrap; misspelled names or invalid `value` values fail fast before serving traffic. |
| `key` | `String` | `""` | no | `@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Must evaluate to the exact same key format as `@AutoCacheable.key`; ignored when `allEntries = true`. |
| `allEntries` | `boolean` | `false` | no | `@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Clearing entire regions under heavy traffic can trigger a cache stampede (thundering herd) against the database; prefer targeted `key` eviction whenever possible. |

### `@TrackExecutionTime`
- **Import:** `import io.github.natswarchuan.core.annotation.TrackExecutionTime;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Profiles execution duration and emits WARN logs when slow calls exceed threshold.
- **How to use:** Place `@TrackExecutionTime(warningThresholdMs = 300)` on `@AutoRestController` interfaces, methods, or custom Spring services to monitor P95/SLA violations automatically.
- **When to use:** Use on complex reports, batch endpoints, GraphQL resolvers, and `@CustomQuery` handlers to surface database slow-query regressions early.
- **When NOT to use:** Do NOT set `warningThresholdMs = 0` or negative values in high-throughput production routes (would spam `WARN` logs on every fast request), and omit on long-lived SSE `/events` streams.
- **Runtime behavior:** Also feeds latency timers via DynamicEntityMetricsHelper.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | no | `@TrackExecutionTime(warningThresholdMs = 250L)` | Emits a structured `WARN` log with `traceId` and elapsed milliseconds whenever execution exceeds this threshold; keep realistic (`200L–1000L`) to avoid log flooding. |

### `@EntityWebhook`
- **Import:** `import io.github.natswarchuan.module.webhook.annotation.EntityWebhook;`
- **Target:** `Class (TYPE)`
- **Purpose:** Sends post-commit asynchronous HMAC-SHA256 signed outbound webhooks on Virtual Threads.
- **How to use:** Place `@EntityWebhook` on JPA `@Entity` classes and register webhook targets via configuration or SPI. Delivered asynchronously via Virtual Threads / Transactional Outbox after database commit.
- **When to use:** Use to notify external SaaS tenants, payment partners, or ERP subscribers immediately when orders/shipments commit.
- **When NOT to use:** Set `includeFullPayload = false` if entities carry strict PII/PCI secrets, and never point webhook URLs to unverified internal localhost/private SSRF targets.
- **Runtime behavior:** Computes signatures in WebhookHmacSignerHelper and verifies constant-time equality.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | no | `@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Dispatched asynchronously after database transaction commit (`AFTER_COMMIT`) so rolled-back mutations never emit phantom webhooks. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | no | `@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Carries the HMAC-SHA256 payload signature; receivers MUST verify this header in constant time before processing. |
| `includeFullPayload` | `boolean` | `true` | no | `@EntityWebhook(includeFullPayload = false)` | Set `false` (thin event: entity ID + event type only) for sensitive PII/financial entities so external subscribers fetch authorized fields over authenticated GET calls. |

### `@PublishCloudEvent`
- **Import:** `import io.github.natswarchuan.module.event.annotation.PublishCloudEvent;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Publishes CNCF CloudEvents v1.0 envelopes after transaction commit.
- **How to use:** Place `@PublishCloudEvent(eventType = "io.nwvmc.order", source = "/orders")` on entities or controller methods; listeners consume `CloudEventEnvelopeDto` post-commit (`TransactionPhase.AFTER_COMMIT`).
- **When to use:** Use for clean inter-module communication between Bounded Contexts (`order` -> `inventory` -> `notification`) via `ApplicationEventPublisher` / Kafka without cross-module JPA entity coupling.
- **When NOT to use:** Do NOT confuse internal Spring CloudEvents with external customer HTTP webhooks (`@EntityWebhook`), or consume them inside the active DB transaction before commit (`@EventListener` without `AFTER_COMMIT`).
- **Runtime behavior:** Respects TransactionRuntimeBridge.executeAfterCommit to avoid phantom events.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `eventType` | `String` | `""` | no | `@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Follow reverse-DNS CloudEvents 1.0 naming (`com.company.domain.event`); leave `""` to auto-generate from package and entity name. |
| `source` | `String` | `""` | no | `@PublishCloudEvent(source = "/services/order-api")` | Populates the CNCF CloudEvents `source` URI attribute for cross-microservice lineage tracing. |
| `publishOnCreate` | `boolean` | `true` | no | `@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Emitted only after commit (`AFTER_COMMIT`) via Spring `ApplicationEventPublisher` / Kafka / RabbitMQ bridge. |
| `publishOnUpdate` | `boolean` | `true` | no | `@PublishCloudEvent(publishOnUpdate = true)` | Disable (`false`) on high-churn entities whose minor updates (e.g., view counters) should not flood downstream message brokers. |
| `publishOnDelete` | `boolean` | `true` | no | `@PublishCloudEvent(publishOnDelete = true)` | Fires for both permanent deletes and `BaseAuditEntity.deleted` soft-delete tombstones so downstream read-models stay synchronized. |

### `@TargetDataSource`
- **Import:** `import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Pins entity or query operations to a logical named datasource key.
- **How to use:** Place `@TargetDataSource("REPLICA")` on `@AutoRestController` methods/interfaces or Spring `@Service` interface/bean methods; framework automatically saves and restores previous context keys on exit.
- **When to use:** Use for CQRS read-replica offloading, heavy analytics/BI reports, or region-sharded multi-datasource pools.
- **When NOT to use:** Do NOT switch datasource mid-transaction inside an already-open `@Transactional` JDBC connection (Spring `AbstractRoutingDataSource` resolves connection at transaction start!) and NEVER declare the `@Service` class `final`.
- **Runtime behavior:** Records routing counts in framework.datasource.routing.total.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | no | `@TargetDataSource("REPLICA")` | Must match an active key registered in `DynamicRoutingDataSource`; unbound keys fall back to `PRIMARY` or fail fast depending on routing config. |

### `@TargetDatabasePlatform`
- **Import:** `import io.github.natswarchuan.module.datasource.annotation.TargetDatabasePlatform;`
- **Target:** `Type / Method (TYPE, METHOD)`
- **Purpose:** Assigns database engine family and logical cluster shard per entity.
- **How to use:** Place `@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER")` on specialized JPA entities or service methods to declare multi-database affinity metadata read by Studio & multi-DB bridges.
- **When to use:** Use in polyglot persistence or sharded enterprise platforms splitting ledger (`FINANCE_CLUSTER`), analytics (`ANALYTICS_CLUSTER`), and audit (`AUDIT_CLUSTER`) workloads.
- **When NOT to use:** Do NOT confuse declarative affinity metadata with configuring JDBC URLs — you still must define the backing physical `DataSource` pool entries when deploying across real multi-DB clusters, and do not try JPA cross-DB joins between entities on different clusters.
- **Runtime behavior:** Resolved dynamically by MultiPlatformDataSourceRegistryHelper & TenantDatabaseRoutingResolverHelper.

| Attribute | Java Type | Default | Required | Allowed / Example | Caveat |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `platform` | `String` | `"H2"` | no | `@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Validated eagerly during application bootstrap; misspelled names or invalid `platform` values fail fast before serving traffic. |
| `cluster` | `String` | `"PRIMARY"` | no | `@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Validated eagerly during application bootstrap; misspelled names or invalid `cluster` values fail fast before serving traffic. |
| `readOnly` | `boolean` | `false` | no | `@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Never set `readOnly = true` on `POST`/`PUT`/`PATCH`/`DELETE` handlers — read replicas reject writes and skip dirty-checking flush. |
