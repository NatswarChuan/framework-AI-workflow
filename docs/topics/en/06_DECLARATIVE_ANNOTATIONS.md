# 06. Declarative Annotations Specification Reference

> **Language**: English | [Tiếng Việt](../06_DECLARATIVE_ANNOTATIONS.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Overview of Core Declarative Annotations

The framework ships 41 Pure Java annotations under `io.github.natswarchuan.core.annotation` and `module.*.annotation`. Below are verified attributes and runtime behavior for core entity and controller annotations.

---

## 2. Proxy Routing Annotations (`Controller`)

### `@AutoRestController` (`ElementType.TYPE`)

| Attribute | Type / Default | Behavior |
| :--- | :--- | :--- |
| `path` | `String` (empty = inferred kebab-case) | Root resource path (e.g. `"/api/v1/commercial-products"`) |
| `tags` | `String[]` | OpenAPI 3.0 Swagger UI tag group names |
| `enabledEndpoints` | `String[]` | Allowlist of method names or groups via `EndpointFeatureFilterHelper` |
| `disabledEndpoints` | `String[]` | Denylist of disabled methods or groups (e.g. `{"deleteById", "batchChunked"}`) |
| `enableNestedSubResources` | `boolean` (`false`) | Enables recursive `GET /{id}/**` relationship traversal |

### `@CustomEndpoint` (`ElementType.METHOD`)

Attributes: `path`, `httpMethod` (`"GET"` default), `delegateBean`, `delegateMethod`, `summary`, `description`. Routes custom sub-paths directly to Spring delegate beans.

---

## 3. Security, Lifecycle & Data Integrity (`Entity`)

| Annotation | Target | Core Attributes | Runtime Enforcement |
| :--- | :--- | :--- | :--- |
| `@EntitySecurity` | `TYPE` | `readRoles`, `writeRoles`, `deleteRoles`, `ownerField`, `bypassOwnershipRoles` (`{"ROLE_ADMIN"}`) | Enforces NIST Level 2 RBAC and record ownership filtering |
| `@FieldSecurity` | `FIELD` | `viewRoles`, `maskPattern` (`"***"`), `nullifyWhenDenied` (`false`) | Masks or nullifies privileged fields when caller roles lack access |
| `@StateMachine` | `FIELD` / `TYPE` | `field` (`"status"`), `initial` (`"PENDING"`), `transitions`, `deletableStates` | Rejects illegal transitions and guarded soft deletes (`HTTP 422`) |
| `@HumanPolicy` | `TYPE` | `lifecycle`, `security`, `masking`, `stateField` | Parses English policy directives into state machine, RBAC, and masking rules |
| `@MultiTenant` | `TYPE` | `tenantField` (`"tenantId"`), `bypassTenantRoles` (`{"ROLE_SUPER_ADMIN"}`) | Isolates queries and mutations per active tenant context |
| `@UniqueField` | `FIELD` | *(marker)* | Enforces business key uniqueness before `POST`/`PUT`/`upsert` (`HTTP 409`) |
| `@AutoCode` | `FIELD` | `prefix` (required) | Generates prefixed code identifiers (e.g. `"PRD-"`) when empty on create/clone |
| `@AutoSlug` | `FIELD` | `sourceField` (required) | Normalizes URL-friendly ASCII slugs from `sourceField` |
| `@ComputedField` | `FIELD` | `operation` (`MULTIPLY` / `SUM_COLLECTION`), `sourceFields`, `collectionField`, `itemField` | Computes derived numeric totals automatically prior to persistence |
| `@AuditTrail` | `TYPE` | `category`, `recordFieldDiffs` (`true`) | Records field-level diffs backing Time-Travel replay |

---

## 4. Resilience, Concurrency & Event Annotations

| Annotation | Target | Attributes & Defaults | Enforcement Behavior |
| :--- | :--- | :--- | :--- |
| `@RateLimit` | `TYPE`, `METHOD` | `requestsPerWindow` (`60`), `windowSeconds` (`60`), `partitionKey` (`"clientIp"`) | Protects endpoints via bounded sliding-window rate limits (`HTTP 429`) |
| `@EntityCircuitBreaker` | `TYPE`, `METHOD` | `name`, `failureRateThreshold` (`50.0`), `waitDurationSeconds` (`10`), `fallbackMessage` | Opens Resilience4j circuit breaker upon sustained failures (`HTTP 503`) |
| `@EntityRetry` | `TYPE`, `METHOD` | `name`, `maxAttempts` (`3`), `waitDurationMs` (`500L`), `backoffMultiplier` (`2.0d`) | Applies exponential backoff retry on transient errors |
| `@DistributedLock` | `METHOD` | `key`, `waitTimeMs`, `leaseTimeMs` | Acquires cluster distributed lock via SpEL key before execution |
| `@Idempotent` | `METHOD` | `ttlSeconds` (`3600L`), `enforcePayloadMatch` (`true`) | Enforces `Idempotency-Key` deduplication with `ConstantTimeComparisonUtil` payload hash check |
| `@HttpCacheable` | `TYPE`, `METHOD` | `maxAgeSeconds` (`60`), `etagEnabled` (`true`), `mustRevalidate` (`false`) | Emits `Cache-Control` and `ETag` supporting HTTP `304 Not Modified` |
| `@PublishCloudEvent` | `TYPE`, `METHOD` | `topic`, `source`, `actions` (`{"CREATED","UPDATED","DELETED"}`) | Publishes CNCF CloudEvents 1.0 envelopes on mutations |
| `@EntityWebhook` | `TYPE` | `events`, `secretHeader` (`"X-Webhook-Signature"`), `includeFullPayload` (`true`) | Signs and dispatches outbound webhooks using HMAC-SHA256 |
| `@TargetDatabasePlatform` | `TYPE`, `METHOD` | `platform` (`"H2"`), `cluster` (`"PRIMARY"`), `readOnly` (`false`) | Routes reads/writes across primary, replica, and multi-database clusters |
