# Spring-NWVMC (`v0.1.0`) — Exact Non-Annotation Class, Constant & SPI Imports

> **Zero `javap` Guarantee:** Every import path, method signature, and constant below is verified 1:1 against the published `com.github.NatswarChuan:Spring-NWVMC:v0.1.0` JAR and `controller-to-api-framework/`.
> Use this table whenever writing consumer entities, controllers, helpers, services, exceptions, customizers, or tests — never guess package names.

---

## 1. Base Entity, Controllers & Response Envelope

| Class / Interface | Exact Import | Key Methods / Signature |
| :--- | :--- | :--- |
| `BaseAuditEntity` | `io.github.natswarchuan.common.entity.BaseAuditEntity` | UUIDv7 `id`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `deleted`, `@Version version` |
| `ApiResponse<T>` | `io.github.natswarchuan.common.response.ApiResponse` | `ApiResponse.success(T data)`, `ApiResponse.success(T data, String message)`, `ApiResponse.<T>builder()...build()` |
| `AutoApiController<E>` | `io.github.natswarchuan.core.controller.AutoApiController` | Master interface exposing all 40 contracts |
| `AutoReadApi<E>` | `io.github.natswarchuan.core.controller.AutoReadApi` | 5 read routes (`/`, `/all`, `/count`, `/exists`, `/{id}`) |
| `AutoKeysetApi<E>` | `io.github.natswarchuan.core.controller.AutoKeysetApi` | `GET /keyset` O(1) cursor pagination |
| `AutoAnalyticsApi<E>` | `io.github.natswarchuan.core.controller.AutoAnalyticsApi` | `/aggregate`, `/distinct`, `/top`, `/group-by` |
| `AutoSchemaApi<E>` | `io.github.natswarchuan.core.controller.AutoSchemaApi` | `/metadata`, `/schema/{json,typescript,zod,client}` |
| `AutoApiReadController<E>` | `io.github.natswarchuan.core.controller.AutoApiReadController` | Composite of the 4 read interfaces (15 routes) |
| `AutoWriteApi<E>` | `io.github.natswarchuan.core.controller.AutoWriteApi` | `POST /`, `/upsert`, `PUT /{id}`, `PATCH /{id}`, `DELETE /{id}`, `/{id}/hard`, `POST /{id}/restore` |
| `AutoBatchApi<E>` | `io.github.natswarchuan.core.controller.AutoBatchApi` | `POST /batch`, `/batch/chunked`, `DELETE /batch` |
| `AutoExportImportApi<E>` | `io.github.natswarchuan.core.controller.AutoExportImportApi` | `/export/{csv,jsonl}`, `/import/{csv,jsonl}` |
| `AutoWorkflowApi<E>` | `io.github.natswarchuan.core.controller.AutoWorkflowApi` | `/{id}/transition`, `/{id}/clone`, `/{id}/increment`, `/{id}/patch`, `/{id}/diff`, `/policy-summary`, `/health`, `/events` |
| `AutoAiApi<E>` | `io.github.natswarchuan.core.controller.AutoAiApi` | `GET /ai/context`, `POST /ai/query` |
| `AutoApiEnterpriseController<E>` | `io.github.natswarchuan.core.controller.AutoApiEnterpriseController` | Composite of `AutoWorkflowApi` + `AutoAiApi` (11 routes) |

---

## 2. Exceptions, HTTP Status & UUIDv7 Utility

| Class | Exact Import | Key Constructor / Methods |
| :--- | :--- | :--- |
| `BaseBusinessException` | `io.github.natswarchuan.exception.BaseBusinessException` | `super(StandardHttpStatus status, String errorCode, String message)` |
| `StandardHttpStatus` | `io.github.natswarchuan.common.constant.StandardHttpStatus` | `BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `UNPROCESSABLE_ENTITY`, `TOO_MANY_REQUESTS`, `INTERNAL_SERVER_ERROR`, `NOT_MODIFIED` (`.value()` / `.getCode()`) |
| `UuidUtil` | `io.github.natswarchuan.common.util.UuidUtil` | `UuidUtil.generateUuidV7()` (RFC 9562 time-ordered UUIDv7; NEVER use `UUID.randomUUID()`) |

---

## 3. Framework Constants (Zero Magic Strings)

| Constant Class | Exact Import | Frequently Used Constants |
| :--- | :--- | :--- |
| `RoleConstant` | `io.github.natswarchuan.common.constant.RoleConstant` | `ROLE_USER`, `ROLE_ADMIN`, `ROLE_SUPER_ADMIN` |
| `HttpHeaderConstant` | `io.github.natswarchuan.common.constant.HttpHeaderConstant` | `HEADER_AUTHORIZATION`, `HEADER_IDEMPOTENCY_KEY` (`"X-Idempotency-Key"`), `HEADER_TENANT_ID` (`"X-Tenant-ID"`), `HEADER_REQUEST_ID` (`"X-Request-ID"`) |
| `AopConstant` | `io.github.natswarchuan.common.constant.AopConstant` | `SECONDS_PER_DAY` (`86400L`), `DEFAULT_IDEMPOTENCY_TTL` |
| `EventConstant` | `io.github.natswarchuan.common.constant.EventConstant` | `EVENT_TYPE_CREATED` (`"ENTITY_CREATED"`), `EVENT_TYPE_UPDATED` (`"ENTITY_UPDATED"`), `EVENT_TYPE_DELETED` (`"ENTITY_DELETED"`), `EVENT_TYPE_STATE_CHANGED` (`"ENTITY_STATE_CHANGED"`) |
| `SecurityConstant` | `io.github.natswarchuan.common.constant.SecurityConstant` | `READ_OPERATIONS` (read operation allowlist for fail-closed `@ServiceOverride`) |
| `DataSourceConstant` | `io.github.natswarchuan.module.datasource.constant.DataSourceConstant` | `DATASOURCE_PRIMARY` (`"PRIMARY"`), `DATASOURCE_REPLICA` (`"REPLICA"`) |
| `DatabasePlatformConstant` | `io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant` | `CLUSTER_PRIMARY`, `CLUSTER_REPLICA`, `PLATFORM_H2`, `PLATFORM_POSTGRESQL`, `PLATFORM_MYSQL` |

---

## 4. Framework `@AutoComponent` Helpers & Services (ALWAYS Inject via `ObjectProvider<T>`)

> **CRITICAL:** In consumer `@Component` / `@Service` / `@SpringBootTest` classes, inject these via `org.springframework.beans.factory.ObjectProvider<T>` and resolve with `.getObject()` (or `.getIfAvailable()`) at runtime.

| Class | Exact Import | Verified Method Signatures |
| :--- | :--- | :--- |
| `JwtTokenService` | `io.github.natswarchuan.module.security.service.JwtTokenService` | **`generateToken(String username, String userId, Set<String> roles)`** — **WARNING: `username` is FIRST, `userId` is SECOND!** |
| `DynamicEntityCrudService` | `io.github.natswarchuan.core.service.DynamicEntityCrudService` | Dynamic JPA CRUD engine backing all `@AutoRestController` proxies |
| `HttpCacheEvaluatorHelper` | `io.github.natswarchuan.module.cache.http.helper.HttpCacheEvaluatorHelper` | `computePayloadHash(Object dto)`, `buildCacheControlDirective(HttpCacheable)`, `isIfNoneMatchMatching(String ifNoneMatch, String eTag)` |
| `DynamicEntityAiMetadataProviderHelper` | `io.github.natswarchuan.module.ai.helper.DynamicEntityAiMetadataProviderHelper` | `generateSystemContextPrompt(Class<?> entityClass)` |
| `AiNaturalLanguageQueryParserHelper` | `io.github.natswarchuan.module.ai.helper.AiNaturalLanguageQueryParserHelper` | `executeNaturalLanguageQuery(Class<E> entityClass, AiQueryRequestDto request)` |
| `ThirdPartyRestClientHelper` | `io.github.natswarchuan.module.integration.helper.ThirdPartyRestClientHelper` | `executeOutboundCall(ThirdPartyCallRequestDto request)` → `ThirdPartyCallResponseDto` (auto-propagates `X-Request-ID` & W3C `traceparent`) |
| `WebhookDispatcherHelper` | `io.github.natswarchuan.module.webhook.helper.WebhookDispatcherHelper` | `registerSubscription(WebhookSubscriptionDto subscription)`, `dispatchToSubscribers(...)`, `getDeliveryAuditHistory()` |
| `MultiPlatformDataSourceRegistryHelper` | `io.github.natswarchuan.module.datasource.helper.MultiPlatformDataSourceRegistryHelper` | `registerCluster(String clusterName, DataSource ds, String platform, boolean readOnly)` |

---

## 5. Datasource Routing, Outbox Events, AI, Integration & Webhook DTOs

| Class / Interface | Exact Import | Purpose |
| :--- | :--- | :--- |
| `DynamicRoutingDataSource` | `io.github.natswarchuan.module.datasource.routing.DynamicRoutingDataSource` | `registerDataSourceEntry(String key, DataSource ds)` + `setDefaultTargetDataSource(DataSource ds)` |
| `DataSourceContextHolder` | `io.github.natswarchuan.module.datasource.context.DataSourceContextHolder` | `getDataSourceType()`, `setDataSourceType(String)`, `clearDataSourceType()` |
| `OutboxEvent` | `io.github.natswarchuan.module.event.OutboxEvent` | Committed outbox event (`getAggregateType()`, `getAggregateId()`, `getEventType()`, `getStatus()`, `getPayload()`, `getTraceId()`) |
| `OutboxEventDispatcherProvider` | `io.github.natswarchuan.module.event.provider.OutboxEventDispatcherProvider` | SPI interface (`@Component`): `boolean dispatch(OutboxEvent event, Map<String, String> headers)` |
| `DistributedLockProvider` | `io.github.natswarchuan.module.lock.provider.DistributedLockProvider` | SPI interface (`@Component`) to plug in Redis / Redisson / JDBC locks |
| `IdempotencyStoreProvider` | `io.github.natswarchuan.core.provider.IdempotencyStoreProvider` | SPI interface (`@Component`) to plug in Redis / DB idempotency storage |
| `AiQueryRequestDto` | `io.github.natswarchuan.common.dto.AiQueryRequestDto` | Builder: `.prompt(...)`, `.page(0)`, `.size(10)`, `.sort(...)`, `.dir("asc")` |
| `AiQueryExecutionResultDto<E>` | `io.github.natswarchuan.common.dto.AiQueryExecutionResultDto` | Result wrapper returned by `AiNaturalLanguageQueryParserHelper` |
| `ThirdPartyCallRequestDto` | `io.github.natswarchuan.module.integration.dto.ThirdPartyCallRequestDto` | Builder: `.serviceName(...)`, `.targetUrl(...)`, `.httpMethod("GET"/"POST")`, `.headers(...)`, `.payload(...)` |
| `ThirdPartyCallResponseDto` | `io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto` | `.getServiceName()`, `.getStatusCode()`, `.getResponseBody()`, `.getResponseHeaders()`, `.getExecutionTimeMs()` |
| `WebhookSubscriptionDto` | `io.github.natswarchuan.module.webhook.dto.WebhookSubscriptionDto` | Builder: `.subscriptionId(...)`, `.endpointUrl(...)`, `.secretKey(...)`, `.targetEntity(...)`, `.subscribedEvents(...)`, `.active(true)` |

---

## 6. Extension Customizer SPIs (`8` Interfaces)

All 8 non-invasive customizer interfaces use Java `default` methods under `io.github.natswarchuan.customization.customizer.*`:

- `io.github.natswarchuan.customization.customizer.SecurityIdentityCustomizer` (`HttpSecurity` tuning, role augmentation, ABAC `TRUE`/`FALSE`/`null` voting)
- `io.github.natswarchuan.customization.customizer.SpringCoreCustomizer`
- `io.github.natswarchuan.customization.customizer.PlatformAiCustomizer`
- `io.github.natswarchuan.customization.customizer.DataAccessCustomizer`
- `io.github.natswarchuan.customization.customizer.SpringCloudCustomizer`
- `io.github.natswarchuan.customization.customizer.MessagingIntegrationCustomizer`
- `io.github.natswarchuan.customization.customizer.ArchitectureExtensionCustomizer`
- `io.github.natswarchuan.customization.customizer.StorageCustomizer`
