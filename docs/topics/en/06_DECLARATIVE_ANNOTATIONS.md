# 06. Specification Reference for All 42 Declarative Annotations (`1.0.0`)

> **Language**: English | [Tiếng Việt](../06_DECLARATIVE_ANNOTATIONS.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Category Overview of 42 Framework Annotations

`io.github.natswarchuan.core.annotation` and `module.*.annotation` expose **42** Pure Java annotations:

- **Controller, Proxy & Escape Hatch (`13`)**: `@AutoRestController`, `@AutoGet`, `@AutoPost`, `@AutoPut`, `@AutoPatch`, `@AutoDelete`, `@AutoParam`, `@AutoVariable`, `@AutoBody`, `@CustomEndpoint`, `@ServiceOverride`, `@EnableNestedSubResource`, `@BusinessAction`.
- **Bean & Component Wiring (`5`)**: `@AutoComponent`, `@AutoService`, `@AutoBean`, `@AutoConfigurationBean`, `@OrderPriority`.
- **Entity, Security & Data Rules (`11`)**: `@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@HumanPolicy`, `@AuditTrail`, `@MultiTenant`, `@UniqueField`, `@AutoCode`, `@AutoSlug`, `@ComputedField`, `@CustomQuery`.
- **Resilience, Concurrency, Caching & Events (`13`)**: `@DistributedLock`, `@Idempotent`, `@RateLimit`, `@EntityCircuitBreaker`, `@EntityRetry`, `@HttpCacheable`, `@AutoCacheable`, `@AutoCacheEvict`, `@TrackExecutionTime`, `@EntityWebhook`, `@PublishCloudEvent`, `@TargetDataSource`, `@TargetDatabasePlatform`.

---

## 2. Proxy Routing & Escape Hatch (`Controller`)

### `@AutoRestController` (`ElementType.TYPE`)

| Attribute | Type / Default | Runtime Behavior |
| :--- | :--- | :--- |
| `path` | `String` (`""`) | Root resource URI (e.g. `"/api/v1/product-catalogs"`) |
| `basePath` | `String` (`""`) | Alternate root URI prefix alias |
| `entityName` | `String` (`""`) | Custom entity display identifier |
| `enabledEndpoints` | `String[]` (`{}`) | Allowlist of method names or feature groups via `EndpointFeatureFilterHelper` |
| `disabledEndpoints` | `String[]` (`{}`) | Denylist disabling specific endpoints or groups |
| `enableNestedSubResources` | `boolean` (`false`) | Activates recursive `GET /{id}/**` relationship traversal |

### `@ServiceOverride` (`ElementType.METHOD`)

| Attribute | Type / Default | Runtime Behavior |
| :--- | :--- | :--- |
| `targetBean` | `Class<?>` (`Void.class`) | Target custom Spring bean class |
| `beanName` | `String` (`""`) | Target Spring bean name when routing by bean identifier |
| `methodName` | `String` (`""`) | Target delegate method name (defaults to annotated controller method name) |
| `bypassAutoDispatch` | `boolean` (`true`) | Invokes the target method directly via `MethodHandleCacheUtil` |

### `@CustomEndpoint` (`ElementType.METHOD`)

Attributes: `path`, `httpMethod` (`"GET"`), `delegateBean`, `delegateMethod`, `summary`, `description`.

---

## 3. Security, Lifecycle & Data Integrity (`Entity`)

| Annotation | Target | Attributes & Defaults | Enforcement |
| :--- | :--- | :--- | :--- |
| `@EntitySecurity` | `TYPE` | `readRoles`, `writeRoles`, `deleteRoles`, `permitAll` (`false`), `ownerField`, `bypassOwnerRoles` (`{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`) | NIST Level 2 RBAC & ownership filtering |
| `@FieldSecurity` | `FIELD` | `viewRoles`, `maskPattern` (`"******"`), `nullifyInsteadOfMask` (`false`) | Masks or nullifies sensitive fields when caller lacks role |
| `@StateMachine` | `FIELD` / `TYPE` | `initial` (`"ACTIVE"`), `transitions`, `deletableStates` | Rejects illegal transitions and deletes (`HTTP 422`) |
| `@HumanPolicy` | `TYPE` | `lifecycle`, `security`, `masking`, `stateField` | Compiles English directives into RBAC, transitions & masking |
| `@MultiTenant` | `TYPE` | `tenantField` (`"tenantId"`), `bypassTenantRoles` (`{"ROLE_SUPER_ADMIN"}`) | Isolates queries and writes per tenant context |
| `@UniqueField` | `FIELD` | *(marker)* | Enforces business key uniqueness before `POST`/`PUT`/`upsert` (`HTTP 409`) |
| `@AutoCode` | `FIELD` | `prefix` (required) | Generates prefixed code identifiers when empty on create/clone |
| `@AutoSlug` | `FIELD` | `sourceField` (required) | Normalizes URL-friendly ASCII slugs from `sourceField` |
| `@ComputedField` | `FIELD` | `operation` (`MULTIPLY`), `sourceFields`, `collectionField`, `itemField`, `subtractField`, `addField` | Computes derived numeric totals prior to persistence |
| `@AuditTrail` | `TYPE` | `category`, `recordFieldDiffs` (`true`) | Records field-level diffs backing Time-Travel replay |

---

## 4. Resilience, Concurrency, Caching & Event Annotations

| Annotation | Target | Attributes & Defaults | Enforcement |
| :--- | :--- | :--- | :--- |
| `@DistributedLock` | `METHOD` | `key`, `waitTimeMs`, `leaseTimeMs` | Acquires distributed lock for evaluated SpEL key (`HTTP 409`) |
| `@Idempotent` | `METHOD` | `headerName` (`"X-Idempotency-Key"`), `ttlSeconds` (`300L`) | Enforces duplicate-request guard in Caffeine cache (`HTTP 409`) |
| `@RateLimit` | `METHOD` | `requests`, `windowSeconds`, `partitionKey` (`"IP"`) | Sliding-window rate limiting (`HTTP 429`) |
| `@EntityCircuitBreaker` | `TYPE`, `METHOD` | `name`, `failureRateThreshold` (`50.0f`), `waitDurationInOpenStateSeconds` (`10`), `slidingWindowSize` (`20`), `permittedNumberOfCallsInHalfOpenState` (`5`) | Resilience4j circuit breaker isolation (`HTTP 503` when `OPEN`) |
| `@EntityRetry` | `TYPE`, `METHOD` | `name`, `maxAttempts` (`3`), `waitDurationMs` (`500L`), `backoffMultiplier` (`2.0d`) | Retry with configurable exponential backoff |
| `@HttpCacheable` | `TYPE`, `METHOD` | `maxAgeSeconds`, `isPrivate` (`false`), `mustRevalidate` (`true`), `generateETag` (`true`) | Emits ETag, `Cache-Control`, and `304 Not Modified` |
| `@PublishCloudEvent` | `TYPE` | `eventType`, `source`, `publishOnCreate`, `publishOnUpdate`, `publishOnDelete` | Emits CloudEvents post-commit |
| `@EntityWebhook` | `TYPE` | `events`, `secretHeader` (`"X-Webhook-Signature"`), `includeFullPayload` (`true`) | Dispatches post-commit HMAC-SHA256 outbound webhooks |
