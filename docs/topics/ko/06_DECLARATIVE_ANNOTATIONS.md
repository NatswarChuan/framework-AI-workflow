# 06. 60개 선언적 애노테이션 전체 기술 명세서 (`0.1.0`)

> **언어**: **한국어** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼 (EN)](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#annotations)

`io.github.natswarchuan:spring-nwvmc:0.1.0`의 **60개 선언적 애노테이션** 전체를 Java `@interface` 소스에서 직접 추출한 상세 기술 명세서입니다. 정확한 패키지, `@Target`, **모든 속성**, Java 타입, 기본값, 필수/선택 여부, **사용 방법**, **사용해야 할 때**, **사용하지 말아야 할 때와 주의사항**, 검증된 Java 코드 예제를 제공합니다.

## 빠른 색인 (60개 애노테이션)

| 애노테이션 | 분류 | `@Target` | 속성 요약 | 핵심 용도 |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | AutoApiController<E> 확장 인터페이스를 40개 계약(Swagger UI 기본 38개 노출)을 등록하는 런타임 JDK 동적 프록시로 변환합니다. |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | 선언된 단일 컨트롤러 계약을 동적 CRUD 대신 MethodHandleCacheUtil을 통해 커스텀 Spring 빈 메서드로 리디렉션합니다. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | 결제·환불·승인 같은 도메인 워크플로 경로를 독립 Spring @Component Helper 빈에 바인딩합니다. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | 정적 Spring Web 임포트 없이 사용하는 순수 Java @GetMapping 대체 어노테이션입니다. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 사용자 정의 consumes/produces 미디어 타입을 지원하는 순수 Java HTTP POST 경로 선언입니다. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 전체 리소스 교체를 위한 순수 Java HTTP PUT 경로 매핑입니다. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | 부분 병합, 원자적 증분 및 RFC 6902 JSON Patch를 지원하는 순수 Java HTTP PATCH 선언입니다. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | 상태 가드 기반 소프트 삭제를 실행하는 순수 Java HTTP DELETE 선언입니다. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | URL 쿼리 파라미터 또는 Map<String, String> 동적 필터 맵을 바인딩합니다. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | UUIDv7 엔티티 ID 같은 URI 경로 변수를 바인딩합니다. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | @Valid와 함께 HTTP JSON 요청 페이로드를 DTO 또는 Entity 파라미터로 역직렬화합니다. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | 순환 루프를 차단하면서 GET /{id}/{relation}/**로 하위 관계를 재귀 탐색하도록 허용합니다. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | 커스텀 액션 메서드에 선언적 도메인 상태 전이 또는 수치 조정을 정의합니다. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | 컴파일 타임 @Component 임포트 없이 부팅 시 자동 등록되는 프레임워크 컴포넌트 마커입니다. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | @ServiceOverride와 함께 쓰이는 ServiceImpl 클래스를 위한 서비스 계층 스테레오타입입니다. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | @AutoConfigurationBean 클래스 내부에서 관리형 빈 팩토리 메서드를 선언합니다. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | 구성 클래스와 YAML 프로퍼티 바인딩 모델을 표시합니다. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | SPI Customizer 빈과 필터 체인 간의 실행 우선순위를 제어합니다. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | 엔티티 조회·변경 전에 NIST Level 2 RBAC, ownerField 소유자 격리 및 권한 코드를 적용합니다. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | 호출자 역할에 권한이 없으면 민감한 컬럼을 동적으로 마스킹하거나 null 처리합니다. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | POST /{id}/transition의 허용 전이와 DELETE /{id}의 삭제 가능 상태를 강제합니다. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | 읽기 쉬운 정책 문구를 활성 RBAC, 상태 전이 및 마스킹 규칙으로 컴파일합니다. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | 변경 전반의 필드 단위 차이를 기록해 타임트래블 상태 복원 및 /diff 검사를 지원합니다. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | 바이패스 역할이 없는 한 활성 테넌트 컨텍스트 기준으로 행 조회와 변경을 자동 격리합니다. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(마커 어노테이션 — 속성 없음)` | 생성, 수정, Upsert 영속화 직전에 필드 유일성을 사전 검증합니다. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (필수)` | 생성 또는 복제 시 비어 있는 경우 접두사가 붙은 고유 비즈니스 코드를 자동 생성합니다. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (필수)` | sourceField에서 URL 친화적인 정규화 ASCII 슬러그를 자동 생성합니다. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | 엔티티 변경 저장 전 파생 수치 합계를 깔끔하게 자동 계산합니다. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | 커스텀 SQL/JPQL 또는 프로바이더 헬퍼 메서드를 컨트롤러 엔드포인트에 바인딩합니다. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | JPA 엔티티를 실시간 데이터베이스 RBAC 역할 카탈로그 테이블로 지정합니다. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityRoleEntity 내부의 고유 역할 코드 컬럼을 매핑합니다. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityRoleEntity에서 사람이 읽을 수 있는 역할 표시 이름 필드를 식별합니다. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | 역할 엔티티에서 부여된 권한 코드 컬렉션 또는 CSV 문자열 필드를 표시합니다. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | 리소스-액션 권한과 동적 필드 마스킹 규칙을 저장하는 JPA 엔티티를 지정합니다. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPermissionEntity 내 고유 권한 식별자 필드를 지정합니다. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPermissionEntity에서 대상 엔티티 또는 API 리소스 이름(또는 *)을 매핑합니다. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPermissionEntity 규칙이 보호하는 CRUD 또는 커스텀 액션 동사를 매핑합니다. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | 이 DB 권한 규칙이 적용될 때 동적으로 가릴 쉼표 구분 엔티티 필드를 선언합니다. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | 인증된 사용자 주체를 DB 역할 및 선택적 테넌트 범위에 바인딩하는 JPA 엔티티를 매핑합니다. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityUserRoleEntity에서 주체(사용자명 / JWT sub) 필드를 식별합니다. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityUserRoleEntity 내부에 할당된 역할 코드 컬럼을 바인딩합니다. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityUserRoleEntity 할당을 특정 테넌트 ID(또는 전역 *) 범위로 제한합니다. |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | priority 순으로 평가되는 명시적 ALLOW / DENY 인가 정책을 저장하는 JPA 엔티티를 표시합니다. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPolicyEntity에서 대상 리소스 식별자 패턴을 매핑합니다. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPolicyEntity 내부에서 보호되는 작업 동사(READ, WRITE, DELETE, methodName, *)를 매핑합니다. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPolicyEntity 규칙이 대상으로 하는 역할 컬렉션 또는 쉼표 구분 문자열을 매핑합니다. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(마커 어노테이션 — 속성 없음)` | @SecurityPolicyEntity 규칙의 ALLOW 또는 DENY 정책 결정 결과를 지정합니다. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | AST 맵(최대 1024개)에 캐시된 SpEL 키를 기반으로 동시 접근을 직렬화합니다(기본 waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | 설정 가능한 TTL 창 내에서 동시 또는 재전송된 중복 쓰기를 방지합니다. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | IP, 사용자 또는 테넌트 파티션별로 슬라이딩 윈도 요청 제한을 적용합니다. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Actuator 및 Micrometer에 원격 측정을 보고하는 Resilience4j 서킷 브레이커로 작업을 보호합니다. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | 일시적 오류를 설정 가능한 지수 백오프로 자동 재시도합니다. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | RFC 7232 약한 ETag(W/"...")를 계산하고 Cache-Control 및 HTTP 304 Not Modified 응답을 반환합니다. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | 서버 측 읽기 메서드 결과를 Caffeine L1 / Redis L2 엔진에 캐시합니다. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | 데이터 변경 시 오래된 서버 측 캐시 항목을 제거합니다. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | 실행 시간을 측정하고 임계치를 초과하는 느린 호출 시 WARN 로그를 기록합니다. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | 커밋 후 Virtual Threads에서 HMAC-SHA256 서명된 아웃바운드 웹훅을 비동기 전송합니다. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | 트랜잭션 커밋 이후 CNCF CloudEvents v1.0 표준 이벤트를 발행합니다. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | 엔티티 또는 쿼리 작업을 지정된 논리 데이터소스 키에 고정합니다. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | 엔티티별로 데이터베이스 엔진 계열과 논리 클러스터 샤드를 할당합니다. |

---

## 1. 라우팅, 동적 API 계약, DTO 분리 및 파라미터 바인딩 (13 개 애노테이션)

### `@AutoRestController`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **목적**: AutoApiController<E> 확장 인터페이스를 40개 계약(Swagger UI 기본 38개 노출)을 등록하는 런타임 JDK 동적 프록시로 변환합니다.
- **런타임 동작**: 부팅 시 DynamicControllerProxyRegistrarHelper가 활성 컨트롤러를 스캔해 RequestMappingHandlerMapping에 경로를 등록합니다.
- **사용 방법**: `AutoApiController<E>` 또는 `AutoReadApi<E>`를 확장하는 Java 인터페이스에 선언하고 `basePath`, `disabledEndpoints`, DTO 계약을 지정합니다.
- **사용해야 할 때**: JPA 엔티티에 대해 보일러플레이트 없이 표준 CRUD, 페이징, 필터링, 키셋 또는 읽기 전용 API를 즉시 노출할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 일반 구체 `@RestController` 클래스나 JPA 엔티티 없는 외부 집계 API에는 사용하지 마세요. 읽기 전용 공개 API는 `AutoReadApi<E>` 상속을 권장합니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | 아니오 (선택) | `/`로 시작하는 유효한 HTTP 경로(예: `/api/v1/product-catalogs`) 또는 자동 유도를 위한 빈 문자열 `""`.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | 명시적 루트 URI 경로(예: "/api/v1/product-catalogs"). 비어 있으면 컨트롤러 이름에서 복수형 kebab-case로 자동 유도됩니다.<br/>*주의:* 시작 시 프록시 등록기는 `path`보다 `basePath`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `path` | `String` | `""` | 아니오 (선택) | `/`로 시작하는 유효한 HTTP 경로(예: `/api/v1/orders`) 또는 자동 유도를 위한 빈 문자열 `""`.<br/>`@AutoRestController(path = "/api/v1/orders")` | 경로 별칭 속성. 프록시 등록기가 extractCustomBasePath()로 basePath를 우선 읽으므로 basePath 사용을 권장합니다.<br/>*주의:* 시작 시 프록시 등록기는 `path`보다 `basePath`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `entityName` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"ProductCatalog"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoRestController(entityName = "ProductCatalog")` | OpenAPI/Studio 메타데이터에 표시되는 엔티티 이름을 명시적으로 재정의합니다.<br/>*주의:* 생성된 Swagger / OpenAPI 3.0 및 NWVMC Studio에 직접 노출됩니다. 하드코딩 방지를 위해 `OpenApiConstant` 상수를 사용하세요. |
| `enabledEndpoints` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | 허용할 정확한 메서드 이름 화이트리스트(예: "getPage", "create"). 비어 있으면 상속된 전체 메서드가 활성화됩니다.<br/>*주의:* 엄격한 화이트리스트로 동작합니다. 비어 있지 않으면 목록에 없는 모든 계약 메서드가 Spring MVC와 Swagger UI에서 제외됩니다. |
| `disabledEndpoints` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | MVC 매핑 전 제외할 정확한 메서드 이름 블랙리스트(예: "deleteById", "batchChunked").<br/>*주의:* `enabledEndpoints` 이후에 평가됩니다. 나머지 40개 계약을 유지하면서 삭제나 대량 처리 엔드포인트만 차단할 때 적합합니다. |
| `enableNestedSubResources` | `boolean` | `false` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | 재귀 하위 리소스 탐색 GET /{id}/**을 활성화합니다. 대규모 스키마의 라우트 폭증을 막기 위해 기본값은 false입니다.<br/>*주의:* `GET /{id}/items/...` 탐색이 꼭 필요한 경우에만 `true`로 설정하고, `@EnableNestedSubResource`로 허용 관계를 제한하세요. |
| `readDto` | `Class<?>` | `Void.class` | 아니오 (선택) | 임의의 구체 Java DTO 클래스 리터럴(예: `ProductReadDto.class`) 또는 매핑 비활성화용 `Void.class`.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | 응답 직렬화 시 엔티티 내부 필드를 숨기는 선택적 Read DTO 타입입니다. 기본 Void.class는 엔티티를 반환합니다.<br/>*주의:* 조회 (GET) 파이프라인에만 적용됩니다. DTO 클래스는 기본 생성자/게터가 필요하며 `@Valid` 및 `@FieldSecurity`와 연동됩니다. |
| `createDto` | `Class<?>` | `Void.class` | 아니오 (선택) | 임의의 구체 Java DTO 클래스 리터럴(예: `ProductCreateDto.class`) 또는 매핑 비활성화용 `Void.class`.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | POST 매핑 전 Jakarta Validation을 수행하고 엔티티 E로 변환하는 선택적 생성 DTO입니다.<br/>*주의:* 생성 (POST) 파이프라인에만 적용됩니다. DTO 클래스는 기본 생성자/게터가 필요하며 `@Valid` 및 `@FieldSecurity`와 연동됩니다. |
| `updateDto` | `Class<?>` | `Void.class` | 아니오 (선택) | 임의의 구체 Java DTO 클래스 리터럴(예: `ProductUpdateDto.class`) 또는 매핑 비활성화용 `Void.class`.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | PUT/PATCH 수정 시 변경 가능한 필드를 제한하고 검증을 수행하는 업데이트 DTO입니다.<br/>*주의:* 수정 (PUT/PATCH) 파이프라인에만 적용됩니다. DTO 클래스는 기본 생성자/게터가 필요하며 `@Valid` 및 `@FieldSecurity`와 연동됩니다. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 선언된 단일 컨트롤러 계약을 동적 CRUD 대신 MethodHandleCacheUtil을 통해 커스텀 Spring 빈 메서드로 리디렉션합니다.
- **런타임 동작**: EscapeHatchDispatchHelper가 대상 빈을 찾고 MethodHandle을 MethodHandleCacheUtil에 캐시하여 실행합니다.
- **사용 방법**: `@AutoRestController` 내 메서드에 `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")`를 선언하고 대상 클래스를 Spring `@Component`/`@Service`로 등록하세요.
- **사용해야 할 때**: 대부분의 엔드포인트는 자동 CRUD를 쓰되 특정 메서드만 맞춤형 Java 비즈니스 로직으로 대체해야 할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `targetBean`에 문자열을 넣지 마세요(`Class<?>` 필수, 이름 지정은 `beanName`). 선언형 규칙으로 해결 가능하면 불필요한 오버라이드를 피하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | 아니오 (선택) | 구체 Spring `@Service`/`@Component` 빈 클래스(예: `OrderCustomService.class`) 또는 `beanName` 조회용 `Void.class`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | 대상 Spring 빈 클래스(beanName보다 우선 적용됩니다).<br/>*주의:* 시작 시 프록시 등록기는 `beanName`보다 `targetBean`을 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `beanName` | `String` | `""` | 아니오 (선택) | ApplicationContext에 등록된 정확한 빈 이름(예: `"orderCustomService"`) 또는 자동 해석용 `""`.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | targetBean이 Void.class일 때 사용하는 Spring 컨테이너의 명시적 빈 이름입니다.<br/>*주의:* 시작 시 프록시 등록기는 `beanName`보다 `targetBean`을 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `methodName` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"createOrder"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | 대상 빈의 메서드 이름입니다. 비어 있으면 컨트롤러 메서드 이름을 그대로 사용합니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"createOrder"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `bypassAutoDispatch` | `boolean` | `true` | 아니오 (선택) | `true`(기본값 — 오버라이드 활성화 후 대상 빈 호출) 또는 `false`(오버라이드 비활성화 후 기본 CRUD 실행).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | true일 때 기본 CRUD 디스패치를 완전히 건너뛰고 MethodHandleCacheUtil로 커스텀 빈을 실행합니다.<br/>*주의:* `true`(기본값)일 때 `EscapeHatchDispatchHelper`가 대상 빈을 호출합니다. `false`는 `@ServiceOverride`를 비활성화해 기본 CRUD를 실행합니다(전/후 훅 아님). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 결제·환불·승인 같은 도메인 워크플로 경로를 독립 Spring @Component Helper 빈에 바인딩합니다.
- **런타임 동작**: 전체 검증 및 트랜잭션 래핑과 함께 캐시된 MethodHandle로 delegateBean.delegateMethod를 호출합니다.
- **사용 방법**: 인터페이스 메서드에 `path`, `httpMethod`, `delegateBean`, `delegateMethod`를 지정해 독립된 Spring `@Component` 헬퍼 빈으로 위임하세요.
- **사용해야 할 때**: 체크아웃, 환불, 승인 또는 다중 엔티티 트랜잭션 같은 도메인 워크플로 엔드포인트를 노출할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@CustomEndpoint`는 `invokeProtectedOperation` 이전에 직접 위임되므로 Spring AOP/보안은 위임 `@Component`/`@Service` 빈에 두고 단순 상태 전이는 `@BusinessAction`을 쓰세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/reports/monthly-sales`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | 컨트롤러 basePath 하위의 상대 경로(예: "/checkout")입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `path` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `httpMethod` | `String` | `"GET"` | 아니오 (선택) | 지원되는 값 중 하나: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | 바인딩할 HTTP 메서드("GET", "POST", "PUT", "PATCH", "DELETE")입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `httpMethod` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `delegateBean` | `String` | `""` | 아니오 (선택) | ApplicationContext에 등록된 정확한 빈 이름(예: `"orderReportService"`) 또는 자동 해석용 `""`.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | 비즈니스 워크플로를 처리할 Spring 빈 이름입니다(default 메서드나 @ServiceOverride가 없으면 비워 둘 수 없음).<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `delegateBean` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `delegateMethod` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"buildMonthlyReport"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | delegateBean 내 호출할 메서드 이름입니다. 비어 있으면 컨트롤러 메서드 이름을 사용합니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"buildMonthlyReport"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `summary` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"Get monthly revenue breakdown"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Swagger UI에 표시되는 짧은 OpenAPI 3.0 요약입니다.<br/>*주의:* 생성된 Swagger / OpenAPI 3.0 및 NWVMC Studio에 직접 노출됩니다. 하드코딩 방지를 위해 `OpenApiConstant` 상수를 사용하세요. |
| `description` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"Aggregates confirmed invoice totals grouped by currency"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Swagger UI에서 엔드포인트를 펼쳤을 때 표시되는 상세 OpenAPI 3.0 설명입니다.<br/>*주의:* 생성된 Swagger / OpenAPI 3.0 및 NWVMC Studio에 직접 노출됩니다. 하드코딩 방지를 위해 `OpenApiConstant` 상수를 사용하세요. |

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

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 정적 Spring Web 임포트 없이 사용하는 순수 Java @GetMapping 대체 어노테이션입니다.
- **런타임 동작**: 프록시 부트스트랩 시 HTTP GET RequestMappingInfo로 매핑됩니다.
- **사용 방법**: `@AutoRestController` 인터페이스 메서드에 `@AutoGet("/path")`를 선언하고 보통 `@ServiceOverride` 또는 `@CustomQuery`와 함께 사용합니다.
- **사용해야 할 때**: Spring Web `@GetMapping`을 임포트하지 않고 순수 Java 인터페이스에 읽기 전용 GET 엔드포인트를 추가할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: DB 상태를 변경하거나 부작용이 있는 작업에는 절대 사용하지 마세요(`@AutoPost`/`@AutoDelete` 사용). 일반 `@RestController`에도 사용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/{id}/summary`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@AutoGet("/{id}/summary")` | 상대 GET 경로 템플릿(예: "/metrics"). 비어 있으면 컨트롤러 basePath에 매핑됩니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `produces` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json", "text/csv"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | 응답 미디어 타입 목록(예: "text/event-stream", "text/csv")입니다.<br/>*주의:* Spring MVC가 HTTP `Accept` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 사용자 정의 consumes/produces 미디어 타입을 지원하는 순수 Java HTTP POST 경로 선언입니다.
- **런타임 동작**: SpringMvcEndpointBridge에 HTTP POST 핸들러로 등록됩니다.
- **사용 방법**: 생성/액션 메서드에 `@AutoPost("/path")`를 선언하고 `@AutoBody` 또는 `@RequestBody`로 본문을 바인딩한 뒤 `@BusinessAction`/`@ServiceOverride`와 조합합니다.
- **사용해야 할 때**: 리소스 생성, 비즈니스 커맨드 실행, 배치 제출 등의 POST 엔드포인트를 순수 Java 인터페이스에 선언할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 읽기 전용 조회(`@AutoGet`), 전체 교체(`@AutoPut`), 부분 수정(`@AutoPatch`), 삭제(`@AutoDelete`) 용도로 사용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/{id}/approve`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@AutoPost("/{id}/approve")` | basePath 하위의 상대 POST 경로 템플릿입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `consumes` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json", "multipart/form-data"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | 허용되는 요청 Content-Type 목록입니다.<br/>*주의:* Spring MVC가 HTTP `Content-Type` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |
| `produces` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | 응답으로 생성할 미디어 타입 목록입니다.<br/>*주의:* Spring MVC가 HTTP `Accept` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 전체 리소스 교체를 위한 순수 Java HTTP PUT 경로 매핑입니다.
- **런타임 동작**: 트랜잭션 실행 내부에서 HTTP PUT 핸들러로 바인딩됩니다.
- **사용 방법**: 전체 수정 메서드에 `@AutoPut("/{id}")`를 두고 `@AutoVariable`, `@AutoBody`와 함께 사용하세요.
- **사용해야 할 때**: 전체 상태 페이로드를 받는 멱등적 전체 리소스 교체 PUT 엔드포인트에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 일부 필드만 수정하거나 상태를 전환할 때는 `@AutoPatch` 또는 `@BusinessAction`을 사용하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/{id}/replace`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@AutoPut("/{id}/replace")` | 상대 PUT 경로 템플릿(예: "/{id}")입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `consumes` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | 지원되는 요청 Content-Type 목록입니다.<br/>*주의:* Spring MVC가 HTTP `Content-Type` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |
| `produces` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | 생성되는 응답 미디어 타입 목록입니다.<br/>*주의:* Spring MVC가 HTTP `Accept` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 부분 병합, 원자적 증분 및 RFC 6902 JSON Patch를 지원하는 순수 Java HTTP PATCH 선언입니다.
- **런타임 동작**: JSON 병합 시맨틱 및 application/json-patch+json을 지원합니다.
- **사용 방법**: 부분 수정 또는 선언형 `@BusinessAction` 메서드에 `@AutoPatch("/{id}/action")`을 선언하세요.
- **사용해야 할 때**: 부분 필드 수정, 원자적 수치 증감, 상태 전이(`@BusinessAction`)에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 전체 교체가 필요한 경우(`@AutoPut`)나 신규 생성(`@AutoPost`)에는 사용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/{id}/status`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@AutoPatch("/{id}/status")` | 상대 PATCH 경로 템플릿(예: "/{id}/approve")입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `consumes` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json", "application/merge-patch+json"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | 허용되는 요청 Content-Type입니다.<br/>*주의:* Spring MVC가 HTTP `Content-Type` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |
| `produces` | `String[]` | `{}` | 아니오 (선택) | MIME 미디어 타입 배열(예: `{"application/json"}`). 빈 `{}`는 기본 `application/json`을 사용합니다.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | 응답 미디어 타입 목록입니다.<br/>*주의:* Spring MVC가 HTTP `Accept` 헤더로 콘텐츠 협상을 수행합니다. 불일치 시 `406` 또는 `415`를 반환합니다. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 상태 가드 기반 소프트 삭제를 실행하는 순수 Java HTTP DELETE 선언입니다.
- **런타임 동작**: deleted=true 마킹 전에 @StateMachine deletableStates를 검증합니다.
- **사용 방법**: 커스텀 삭제 메서드에 `@AutoDelete("/{id}/custom")`을 선언하고 보통 `@ServiceOverride`와 함께 사용합니다.
- **사용해야 할 때**: 아카이브, 소프트 삭제 재정의 또는 계단식 정리 DELETE 엔드포인트에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 기본 소프트 삭제와 `@StateMachine(deletableStates)`만으로 충분한 경우 중복 정의하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 선택적 `{pathVar}` 템플릿을 포함한 상대 URI 하위 경로(예: `/{id}/archive`). `""`는 컨트롤러 루트에 바인딩됩니다.<br/>`@AutoDelete("/{id}/archive")` | 상대 DELETE 경로 템플릿(예: "/{id}/purge")입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **목적**: URL 쿼리 파라미터 또는 Map<String, String> 동적 필터 맵을 바인딩합니다.
- **런타임 동작**: QueryGuardrailEnforcerUtil 검증과 함께 DynamicQueryParameterParserHelper로 추출됩니다.
- **사용 방법**: 컨트롤러 인터페이스 메서드 파라미터에 `@AutoParam("status")` 형태로 지정합니다.
- **사용해야 할 때**: 컨트롤러 인터페이스를 Spring Web 임포트 없이 순수 Java로 유지하면서 쿼리 파라미터를 바인딩할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 경로 변수(`@AutoVariable`)나 JSON 본문(`@AutoBody`)에는 사용하지 마세요(`v0.1.0`부터 `@RequestParam`도 호환됩니다).

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"status"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoParam("status") String status` | 바인딩할 쿼리 파라미터 이름(name의 별칭). 비어 있으면 Java 파라미터 이름을 사용합니다.<br/>*주의:* 시작 시 프록시 등록기는 `name`보다 `value`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `name` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"pageSize"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | 명시적인 쿼리 파라미터 이름입니다.<br/>*주의:* 시작 시 프록시 등록기는 `name`보다 `value`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `required` | `boolean` | `true` | 아니오 (선택) | `true`(필수; 누락 시 HTTP 400 반환) 또는 `false`(선택; 생략 시 null 전달).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | 필수 여부입니다. true일 때 누락되면 HTTP 400을 반환합니다.<br/>*주의:* `defaultValue`를 지정하면 자동으로 선택값이 됩니다. `false`일 때는 NPE 방지를 위해 기본형 대신 래퍼 타입(`Integer`)을 사용하세요. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"20"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | 파라미터 누락 시 사용할 기본값입니다. 기본은 DEFAULT_NONE 센티넬입니다.<br/>*주의:* 문자열에서 Spring `ConversionService`로 대상 타입으로 변환됩니다. 잘못된 리터럴은 HTTP `400` 오류를 유발합니다. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **목적**: UUIDv7 엔티티 ID 같은 URI 경로 변수를 바인딩합니다.
- **런타임 동작**: MVC 경로 템플릿에서 타입 안전한 Java UUID/String 값으로 파싱됩니다.
- **사용 방법**: `findById(@AutoVariable("id") UUID id)`처럼 경로 변수 파라미터에 선언합니다.
- **사용해야 할 때**: 순수 Java 인터페이스에서 `{id}`, `{slug}` 같은 경로 변수를 바인딩할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 쿼리 스트링(`@AutoParam`)이나 요청 본문(`@AutoBody`)에는 사용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"orderId"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoVariable("orderId") UUID orderId` | 바인딩할 URI 경로 변수 이름입니다.<br/>*주의:* 시작 시 프록시 등록기는 `name`보다 `value`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `name` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"tenantCode"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | 명시적인 경로 변수 이름입니다.<br/>*주의:* 시작 시 프록시 등록기는 `name`보다 `value`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `required` | `boolean` | `true` | 아니오 (선택) | `true`(필수; 누락 시 HTTP 400 반환) 또는 `false`(선택; 생략 시 null 전달).<br/>`@AutoVariable(name = "id", required = true) UUID id` | 경로 변수가 필수인지 여부입니다.<br/>*주의:* 메서드 URI 템플릿의 `{variableName}`과 일치해야 하며, `false`는 선택적 URI 패턴이 있을 때만 유효합니다. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **목적**: @Valid와 함께 HTTP JSON 요청 페이로드를 DTO 또는 Entity 파라미터로 역직렬화합니다.
- **런타임 동작**: 서비스 트랜잭션 진입 전 LocalValidatorFactoryBean으로 검증됩니다.
- **사용 방법**: `@AutoPost`/`@AutoPut`/`@AutoPatch` 메서드의 페이로드 파라미터에 `@AutoBody`를 선언하세요(`@Valid`와 병용).
- **사용해야 할 때**: 순수 Java 프록시 컨트롤러에서 JSON 본문을 엔티티나 DTO로 역직렬화할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 본문이 없는 GET/DELETE 메서드에 쓰지 말고 한 메서드에 두 개 이상 선언하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | 아니오 (선택) | `true`(필수; 누락 시 HTTP 400 반환) 또는 `false`(선택; 생략 시 null 전달).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | 요청 본문이 누락될 때 HTTP 400을 반환할지 여부입니다.<br/>*주의:* 디스패치 전 Jakarta 검증을 위해 `@Valid`와 함께 사용하세요. `false`는 빈 요청 본문을 `400` 없이 허용합니다. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 순환 루프를 차단하면서 GET /{id}/{relation}/**로 하위 관계를 재귀 탐색하도록 허용합니다.
- **런타임 동작**: 컨트롤러에 @AutoRestController(enableNestedSubResources = true) 설정이 필요합니다.
- **사용 방법**: `@AutoRestController`에서 `enableNestedSubResources = true`를 켠 뒤 `@EnableNestedSubResource(allowedRelationships = {"items"})`로 허용 연관관계를 제한하세요.
- **사용해야 할 때**: `GET /api/v1/customer-orders/{id}/items` 같은 계층형 URL과 단계별 보안/멀티테넌트 검증이 함께 필요할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `allowedRelationships` 제한 없이 대규모 연관 테이블에 열지 마세요. 단순 조회는 `?expand=` 파라미터가 더 가볍습니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | 재귀 GET /{id}/** 탐색 중 도달을 허용할 대상 JPA 엔티티 클래스 화이트리스트입니다.<br/>*주의:* 빈 배열은 모든 하위 엔티티를 노출합니다. 내부 테이블 노출을 막기 위해 허용 클래스를 명시하세요. |
| `allowedRelationships` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | 하위 리소스 URL 경로에서 허용할 JPA 연관 필드 이름 화이트리스트(예: "items")입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"items"`). 불일치 시 런타임 조회 오류가 발생합니다. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 커스텀 액션 메서드에 선언적 도메인 상태 전이 또는 수치 조정을 정의합니다.
- **런타임 동작**: 갱신된 엔티티 속성을 영속화하기 직전에 원자적으로 실행됩니다.
- **사용 방법**: 컨트롤러 인터페이스 메서드에 `@AutoPatch`와 `@BusinessAction(...)`을 함께 선언하면 프록시가 트랜잭션 내에서 실행합니다.
- **사용해야 할 때**: 별도의 Service 클래스 없이 단일 엔티티의 상태 전이, 재고/포인트 가감, 도메인 메서드 실행을 선언할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 다중 엔티티 오케스트레이션, 외부 API 호출, 비동기 워크플로에는 사용하지 마세요(`@ServiceOverride` 권장).

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | 아니오 (선택) | 엔티티의 수명 주기 상태 필드와 정확히 일치하는 Java 속성 이름(예: `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | 엔티티의 상태 필드 이름입니다(@StateMachine이 있으면 전이 규칙을 자동 검증합니다).<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"status"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `targetStateValue` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"APPROVED"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | 트랜잭션 내에서 targetStateField에 설정할 목표 상태 문자열입니다.<br/>*주의:* 저장 전 `@StateMachine` 또는 `@HumanPolicy` 규칙을 자동 검증하며, 허용되지 않은 전이는 즉시 롤백됩니다. |
| `adjustNumericField` | `String` | `""` | 아니오 (선택) | 엔티티의 숫자 필드와 정확히 일치하는 Java 속성 이름(예: `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | 원자적으로 가감할 숫자형 엔티티 필드 이름입니다.<br/>*주의:* `deltaParamIndex >= 0` 또는 비어 있지 않은 `fixedDelta`가 필요합니다. `Integer`, `Long`, `BigDecimal`, `Double`을 지원합니다. |
| `deltaParamIndex` | `int` | `-1` | 아니오 (선택) | 지원되는 값 중 하나: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | 동적 증감량(delta)을 전달하는 메서드의 0-기반 파라미터 인덱스(-1이면 미사용)입니다.<br/>*주의:* 시작 시 프록시 등록기는 `fixedDelta`보다 `deltaParamIndex`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `fixedDelta` | `String` | `""` | 아니오 (선택) | 지원되는 값 중 하나: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | 동적 파라미터 대신 적용할 고정 숫자 문자열(예: "100", "-1")입니다.<br/>*주의:* 시작 시 프록시 등록기는 `fixedDelta`보다 `deltaParamIndex`를 우선 평가합니다. 두 속성에 충돌하는 값을 넣지 마세요. |
| `entityMethod` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"markFulfilled"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | 동일 트랜잭션 내에서 호출할 엔티티의 무인자 도메인 메서드 이름입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"markFulfilled"`). 불일치 시 런타임 조회 오류가 발생합니다. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Bean 탐색, 설정 바인딩 및 실행 우선순위 (5 개 애노테이션)

### `@AutoComponent`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 컴파일 타임 @Component 임포트 없이 부팅 시 자동 등록되는 프레임워크 컴포넌트 마커입니다.
- **런타임 동작**: 프레임워크 내부 패키지(io.github.natswarchuan) 전용 스캔이며, 앱 코드에서는 Spring @Component를 사용하세요.
- **사용 방법**: `io.github.natswarchuan` 패키지에서 `AutoBeanFactoryRegistrarBridge`가 스캔하는 내부 컴포넌트 스테레오타입입니다.
- **사용해야 할 때**: `io.github.natswarchuan.*` 내부 프레임워크 코어 모듈을 작성할 때만 사용하세요.
- **사용하지 말아야 할 때 및 주의사항**: 소비자 애플리케이션(`com.example.*`)에서는 절대 사용하지 마세요! Spring `@Component`를 써야 빈으로 등록됩니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | ApplicationContext에 등록된 정확한 빈 이름(예: `"invoiceValidationHelper"`) 또는 자동 해석용 `""`.<br/>`@AutoComponent("invoiceValidationHelper")` | 명시적 빈 이름(선택)입니다. 비어 있으면 클래스 이름 camelCase를 사용합니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: @ServiceOverride와 함께 쓰이는 ServiceImpl 클래스를 위한 서비스 계층 스테레오타입입니다.
- **런타임 동작**: io.github.natswarchuan 패키지 내 클래스명 기반으로 등록되며, 앱 서비스는 Spring @Service를 사용해야 합니다.
- **사용 방법**: `io.github.natswarchuan` 내부 코어 서비스 등록용 스테레오타입입니다.
- **사용해야 할 때**: 프레임워크 내부 서비스 구현(`io.github.natswarchuan.*`)에만 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 애플리케이션 서비스에서는 절대 사용하지 말고 Spring `@Service`를 사용하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | ApplicationContext에 등록된 정확한 빈 이름(예: `"orderFulfillmentService"`) 또는 자동 해석용 `""`.<br/>`@AutoService("orderFulfillmentService")` | 선택적 서비스 빈 이름입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: @AutoConfigurationBean 클래스 내부에서 관리형 빈 팩토리 메서드를 선언합니다.
- **런타임 동작**: 자동 구성 단계에서 PureJavaBeanRegistrarBridge가 처리합니다.
- **사용 방법**: 프레임워크 내부 `@AutoConfigurationBean` 클래스의 팩토리 메서드에 선언합니다.
- **사용해야 할 때**: 프레임워크 내부 설정 패키지 `io.github.natswarchuan.config.*`에서만 사용하세요.
- **사용하지 말아야 할 때 및 주의사항**: 사용자 `@Configuration` 클래스에서는 사용하지 말고 표준 Spring `@Bean`을 쓰세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | 명시적 빈 이름 및 별칭 배열입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `targetTypeName` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"com.example.spi.PaymentGateway"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | 동적 브리지 매칭을 위한 대상 타입의 FQCN(선택)입니다.<br/>*주의:* 팩토리 메서드가 상위 타입이나 프록시를 반환할 때 쓰는 FQCN 힌트이며, 런타임 클래스패스에 존재해야 합니다. |
| `primary` | `boolean` | `false` | 아니오 (선택) | `true`(후보가 여러 개일 때 우선 주입되는 빈) 또는 `false`(기본 후보 우선순위).<br/>`@AutoBean(primary = true)` | 다중 빈 후보 충돌 시 기본 우선 빈(@Primary)으로 지정합니다.<br/>*주의:* 동일 타입에 `@AutoBean(primary = true)`를 둘 이상 선언하면 시작 시 빈 모호성 충돌이 발생합니다. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 구성 클래스와 YAML 프로퍼티 바인딩 모델을 표시합니다.
- **런타임 동작**: IDE 메타데이터와 함께 구성 빈과 YAML 접두사를 깔끔하게 등록합니다.
- **사용 방법**: `io.github.natswarchuan.config.*` 내부의 순수 Java 설정/프로퍼티 클래스에 붙입니다.
- **사용해야 할 때**: 프레임워크 라이브러리 내부에서 `@Configuration` 대신 사용할 때만 쓰세요.
- **사용하지 말아야 할 때 및 주의사항**: 사용자 애플리케이션 설정에는 사용하지 말고 Spring `@Configuration`을 쓰세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | ApplicationContext에 등록된 정확한 빈 이름(예: `"storageAutoConfig"`) 또는 자동 해석용 `""`.<br/>`@AutoConfigurationBean("storageAutoConfig")` | 선택적 설정 빈 이름입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `prefix` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"nwvmc.storage"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | `PureJavaBeanRegistrarBridge`가 바인딩하는 선택적 YAML 속성 접두사입니다.<br/>*주의:* `application.yml`의 kebab-case 속성을 바인딩합니다. IDE 경고 방지를 위해 메타데이터 파일과 함께 사용하세요. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **목적**: SPI Customizer 빈과 필터 체인 간의 실행 우선순위를 제어합니다.
- **런타임 동작**: 정수 값이 작을수록 먼저 실행됩니다(기본값 Integer.MAX_VALUE).
- **사용 방법**: 실행 순서가 중요한 Pure Java 빈 또는 커스터마이저에 `@OrderPriority(1)`을 선언하세요.
- **사용해야 할 때**: 여러 SPI 커스터마이저나 빈의 실행 순서를 결정론적으로 제어할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: Spring Security 필터 순서나 URL `?sort=` 정렬 파라미터와 혼동하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | 아니오 (선택) | 지원되는 값 중 하나: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | 실행 우선순위 정수입니다. 값이 낮을수록 먼저 실행됩니다.<br/>*주의:* 낮은 숫자가 먼저 실행됩니다(Spring `@Order`와 동일). `< 0`은 보안/추적용, `10..100`은 비즈니스용으로 사용하세요. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. 엔티티 보안, 상태 머신, 무결성, 자동 생성기 및 쿼리 (11 개 애노테이션)

### `@EntitySecurity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 엔티티 조회·변경 전에 NIST Level 2 RBAC, ownerField 소유자 격리 및 권한 코드를 적용합니다.
- **런타임 동작**: SQL 실행 전 평가되며 비인가 접근 시 HTTP 403 Forbidden을 반환합니다.
- **사용 방법**: JPA `@Entity` 클래스에 선언하고 읽기/쓰기/삭제 역할과 필요 시 `ownerField`를 설정하세요.
- **사용해야 할 때**: 노출되는 모든 엔티티에 적용하여 REST, 배치, 내보내기, GraphQL을 일관되게 보호하세요.
- **사용하지 말아야 할 때 및 주의사항**: `AutoReadApi<E>`, `disabledEndpoints` 또는 `@SecurityPolicyEntity` 없이 전체 `AutoApiController<E>`에 `permitAll = true`를 두지 마세요(DB 정책이 없으면 READ/WRITE/DELETE 모두 우회됨).

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_USER", "ROLE_ADMIN"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | 조회(GET/GraphQL/내보내기)가 허용되는 역할 목록입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |
| `writeRoles` | `String[]` | `{}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_MANAGER", "ROLE_ADMIN"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | 쓰기(POST/PUT/PATCH/가져오기/배치)가 허용되는 역할 목록입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |
| `deleteRoles` | `String[]` | `{}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | 삭제(DELETE 및 일괄 삭제)가 허용되는 역할 목록입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |
| `permitAll` | `boolean` | `false` | 아니오 (선택) | `true`(인증 없는 공개 접근 허용) 또는 `false`(인증 및 역할 검사 강제).<br/>`@EntitySecurity(permitAll = true)` | true이고 DB-RBAC 정책이 없으면 READ/WRITE/DELETE 전체 검사를 우회하므로 공개 카탈로그는 AutoReadApi<E> 또는 disabledEndpoints와 함께 써야 합니다.<br/>*주의:* 역할 검사를 모두 우회해 익명 접근을 허용합니다. PII나 결제·쓰기 가능 내부 엔티티에는 절대 사용하지 마세요. |
| `ownerField` | `String` | `""` | 아니오 (선택) | 엔티티의 소유자/UUID 필드와 정확히 일치하는 Java 속성 이름(예: `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | 소유자 ID를 저장하는 필드명(예: "createdBy")으로 IDOR 방어를 수행합니다.<br/>*주의:* `GET`/`PUT`/`PATCH`/`DELETE`에 행 수준 소유권 필터를 강제하며 `bypassOwnerRoles`가 없으면 본인 레코드만 접근할 수 있습니다. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | `ownerField` 소유권 검사를 우회할 수 있는 관리자 역할 목록입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |
| `permissions` | `String[]` | `{}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ORDER_READ", "ORDER_APPROVE"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | 역할과 함께 평가되는 세분화된 권한 코드 목록(DB RBAC 연동)입니다.<br/>*주의:* JWT 클레임 또는 DB-RBAC `@SecurityPermissionEntity`의 세밀한 권한과 대조해 다층 보안을 제공합니다. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: 호출자 역할에 권한이 없으면 민감한 컬럼을 동적으로 마스킹하거나 null 처리합니다.
- **런타임 동작**: 데이터 조회 후 JSON 직렬화 직전에 적용됩니다.
- **사용 방법**: 민감 필드(`costPrice`, `ssn`)에 선언하세요. 분리된 복사본 위에서 마스킹되어 DB/L1 캐시가 손상되지 않습니다.
- **사용해야 할 때**: 동일 모델에서 역할별로 민감 필드(원가, 급여, PII) 노출을 제어할 때 REST와 GraphQL에 공통 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 비문자열 필드는 이미 자동 `null` 처리됩니다. `String` 필드를 `"******"` 대신 `null`로 내려야 할 때만 `nullifyInsteadOfMask = true`를 쓰시고, 키 자체를 숨기려면 `readDto`를 사용하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_ADMIN", "ROLE_FINANCE"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | 마스킹되지 않은 원본 필드 값을 조회할 수 있는 역할 목록입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |
| `maskPattern` | `String` | `"******"` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"***-**-****"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | 권한이 없을 때 String 필드에 반환되는 마스킹 문자열입니다.<br/>*주의:* `nullifyInsteadOfMask = true`이면 무시됩니다. `BigDecimal`, `LocalDate` 같은 비문자열 필드는 JSON 타입 안전성을 위해 `nullifyInsteadOfMask = true`를 권장합니다. |
| `nullifyInsteadOfMask` | `boolean` | `false` | 아니오 (선택) | `true`(권한 없을 때 필드를 JSON null로 대체) 또는 `false`(maskPattern 문자열로 마스킹).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | true이면 String 필드도 maskPattern 대신 null로 설정합니다(BigDecimal 등 비문자열 타입은 자동 null 처리).<br/>*주의:* 숫자·날짜·객체 필드에서 TypeScript/Zod 클라이언트의 역직렬화 오류를 막기 위해 필수적입니다. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: POST /{id}/transition의 허용 전이와 DELETE /{id}의 삭제 가능 상태를 강제합니다.
- **런타임 동작**: 잘못된 전이 또는 삭제를 HTTP 422 BusinessRuleViolationException으로 거부합니다.
- **사용 방법**: String 상태 필드 위에 `:` 구분자 규칙(`"CREATED:PAID,CANCELLED"`)과 함께 선언하세요.
- **사용해야 할 때**: 주문, 대출, 청구서처럼 엄격한 상태 머신이 필요해 잘못된 전이나 삭제를 `422`로 막아야 할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `"->"` 문법을 절대 쓰지 마세요(`EntityStateMachineUtil`은 `:`만 파싱합니다). `@HumanPolicy`와 중복 충돌을 피하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"CREATED"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 생성 시 필드가 비어 있을 때 자동 할당되는 초기 상태("ACTIVE")입니다.<br/>*주의:* `POST` 생성 시 상태가 비어 있으면 자동 설정되며, `transitions`의 `:` 앞 시작 상태와 일치해야 합니다. |
| `transitions` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | 콜론 형식 `"FROM:TO_1,TO_2"`로 선언하는 허용 상태 전이 규칙입니다.<br/>*주의:* 정확한 콜론 문법 `"FROM:TO1,TO2"`(쉼표로 대상 구분, 대소문자 구분)를 요구합니다. 선언되지 않은 전이는 HTTP `422`로 거부됩니다. |
| `deletableStates` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | 삭제(DELETE)가 허용되는 상태 화이트리스트입니다(미포함 시 HTTP 422).<br/>*주의:* 비어 있지 않으면 지정 외 상태(예: `"PAID"`)의 레코드 삭제 시 HTTP `422 Unprocessable Entity`로 차단됩니다. |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 읽기 쉬운 정책 문구를 활성 RBAC, 상태 전이 및 마스킹 규칙으로 컴파일합니다.
- **런타임 동작**: GET /human-policy로 조회 가능하며 YAML의 spring-nwvmc.human-policies.<Entity>에서 재정의할 수 있습니다.
- **사용 방법**: 엔티티에 `@HumanPolicy`를 선언하거나 YAML `spring-nwvmc.human-policies`로 바인딩하면 `HumanPolicyRegistryHelper`가 컴파일합니다.
- **사용해야 할 때**: 기획자/보안팀이 Java 코드 수정 없이 자연어나 YAML로 읽기 쉬운 정책을 관리하고자 할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 임의의 자유 서술이나 비영어 문장을 쓰지 마세요. 명확성을 원하면 `@EntitySecurity` + `@StateMachine`을 직접 쓰세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | 아니오 (선택) | 지원되는 값 중 하나: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | 상태 전이 규칙으로 컴파일되는 자연어 영어 수명 주기 지침입니다.<br/>*주의:* 시작 시 `@StateMachine`과 동일한 엔진으로 컴파일되므로 같은 엔티티에 충돌하는 규칙을 중복 선언하지 마세요. |
| `security` | `String` | `""` | 아니오 (선택) | 지원되는 값 중 하나: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | 읽기/쓰기/삭제/소유자 규칙을 정의하는 자연어 영어 RBAC 지침입니다.<br/>*주의:* 역할 이름에 `ROLE_` 접두사가 자동 정규화되며, 잘못된 문장은 시작 시 즉시 실패합니다. |
| `masking` | `String` | `""` | 아니오 (선택) | 지원되는 값 중 하나: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | 마스킹 대상 필드와 허용 역할을 기술하는 자연어 정책입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"costPrice"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `stateField` | `String` | `""` | 아니오 (선택) | 엔티티의 수명 주기 상태 필드와 정확히 일치하는 Java 속성 이름(예: `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | `lifecycle` 규칙이 관리하는 엔티티 상태 필드 이름입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"orderStatus"`). 불일치 시 런타임 조회 오류가 발생합니다. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 변경 전반의 필드 단위 차이를 기록해 타임트래블 상태 복원 및 /diff 검사를 지원합니다.
- **런타임 동작**: 생성, 수정, 패치, 전이 및 복원 시 oldValue/newValue 델타를 기록합니다.
- **사용 방법**: `BaseAuditEntity` 하위 클래스에 `@AuditTrail`을 선언하면 모든 변경 이력이 자동 저장됩니다.
- **사용해야 할 때**: 결제, 주문, 의료 기록 등 법적 감사 추적과 타임 트래블 조회가 필요한 엔티티에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 초고빈도 로그나 텔레메트리 테이블에는 쓰기 증폭을 피하기 위해 적용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"FINANCE_LEDGER"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | 감사 이벤트에 기록될 논리적 카테고리입니다. 비어 있으면 엔티티 클래스명을 사용합니다.<br/>*주의:* 감사 로그를 도메인별로 분류·필터링할 때 사용하며, `""`이면 JPA 엔티티 클래스명이 기본 적용됩니다. |
| `recordFieldDiffs` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | true일 때 타임 트래블(`GET /api/v1/system/time-travel/{entityName}/{id}`)을 위한 필드 변경 전후 차이를 저장합니다.<br/>*주의:* `PUT`/`PATCH` 시 변경 전후 필드를 기록합니다. 대용량 텍스트나 초고빈도 갱신 테이블에서는 `false`로 저장 공간을 아끼세요. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 바이패스 역할이 없는 한 활성 테넌트 컨텍스트 기준으로 행 조회와 변경을 자동 격리합니다.
- **런타임 동작**: 바이패스 역할 없이 테넌트 컨텍스트가 비어 있으면 HTTP 403을 반환하며, 생성 시 tenantId 위변조를 덮어쓰고 모든 ID 단위 작업의 IDOR을 차단합니다.
- **사용 방법**: `tenantId` 필드가 있는 SaaS 엔티티에 선언하면 읽기 격리, 생성 시 위조 덮어쓰기 방지, 누락 시 `403` 차단이 자동 적용됩니다.
- **사용해야 할 때**: 공유 DB 기반 B2B SaaS의 모든 테넌트 테이블에 적용하여 교차 테넌트 유출을 원천 차단합니다.
- **사용하지 말아야 할 때 및 주의사항**: 국가, 통화, 공용 카테고리 같은 전역 공유 테이블에는 사용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | 아니오 (선택) | 엔티티의 테넌트 식별자 필드와 정확히 일치하는 Java 속성 이름(예: `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | 테넌트 식별자를 저장하는 엔티티 필드명(기본 "tenantId")입니다.<br/>*주의:* 빠른 테넌트 격리 조회를 위해 DB에 `(tenant_id, id)` 복합 인덱스를 반드시 생성하세요. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | 아니오 (선택) | Spring Security 권한 이름 배열(예: `{"ROLE_SUPER_ADMIN"}`). 빈 `{}`는 별도 제한을 두지 않습니다.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | 테넌트 제한 없이 전체 테넌트에 접근 가능한 플랫폼 관리자 역할입니다.<br/>*주의:* 역할 이름은 `RoleConstant`에 `ROLE_` 접두사로 정의해(예: `ROLE_ADMIN`) Spring Security `GrantedAuthority`와 일치시키세요. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: 생성, 수정, Upsert 영속화 직전에 필드 유일성을 사전 검증합니다.
- **런타임 동작**: 중복 값이 존재하면 ConflictBusinessException(HTTP 409)을 발생시킵니다.
- **사용 방법**: 비즈니스 고유 키 필드(`email`, `skuCode`)에 `@Column(unique = true)`와 함께 선언해 사전 중복 검증을 활성화하세요.
- **사용해야 할 때**: 소프트 삭제된 행을 제외하고 활성 레코드 간 중복을 검증해 깔끔한 `HTTP 409 Conflict`를 반환할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 고동시성 환경에서 DB `UNIQUE` 인덱스를 생략하지 마세요. 중복 가능한 필드에도 붙이지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: 생성 또는 복제 시 비어 있는 경우 접두사가 붙은 고유 비즈니스 코드를 자동 생성합니다.
- **런타임 동작**: 엔티티 검증 및 저장 전에 접두사 + 고유 토큰을 채웁니다.
- **사용 방법**: String 코드 필드에 `@AutoCode(prefix = "PRD-")`를 붙이면 생성/복제 시 빈 값을 자동 생성합니다.
- **사용해야 할 때**: DB 시퀀스 경합 없이 주문 번호, SKU, 매장 코드 등 가독성 있는 참조 코드를 자동 생성할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 세금계산서 등 결번 없는 엄격한 순차 일련번호(`1, 2, 3...`)가 법적으로 필요한 곳에는 쓰지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `필수 (기본값 없음)` | **예 (필수)** | 필수 비어 있지 않은 접두사 문자열(예: `"PRD-"`, `"INV-"`) — 생략 시 컴파일 실패.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | 8자리 대문자 UUIDv7 해시 앞에 붙는 필수 코드 접두사(예: "PRD-")입니다.<br/>*주의:* 필수 속성입니다. 생성/복제 시 필드가 비어 있을 때만 8자리 대문자 UUIDv7 해시(`INV-0194E1A0`)를 붙이며 전달된 값은 보존합니다. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: sourceField에서 URL 친화적인 정규화 ASCII 슬러그를 자동 생성합니다.
- **런타임 동작**: 유니코드 발음 구별 부호를 정규화하고 슬러그 필터 조회를 지원합니다.
- **사용 방법**: `slug` 필드에 `@AutoSlug(sourceField = "name")`을 선언하면 빈 값 생성 또는 복제 시 자동 생성됩니다.
- **사용해야 할 때**: 스토어, 블로그 글, 카테고리, 상품 카탈로그의 다국어 SEO URL 슬러그 생성에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 존재하지 않는 필드를 `sourceField`로 지정하지 마세요. 기존 슬러그는 제목 수정 시 덮어쓰지 않습니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `필수 (기본값 없음)` | **예 (필수)** | 엔티티의 문자열 필드와 정확히 일치하는 Java 속성 이름(예: `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | 소문자 하이픈 ASCII 슬러그로 정규화할 필수 원본 엔티티 필드명입니다.<br/>*주의:* 필수 속성입니다. 유니코드 문자열을 URL 안전한 kebab-case로 정규화하며, 유일성을 위해 `@UniqueField`와 함께 쓰세요. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **목적**: 엔티티 변경 저장 전 파생 수치 합계를 깔끔하게 자동 계산합니다.
- **런타임 동작**: 부팅 시 ComputedFieldFailFastUtil이 잘못된 sourceFields를 Fail-Fast로 검증합니다.
- **사용 방법**: 파생 숫자 필드(`BigDecimal`)에 선언하면 서버 저장 전 정확한 `BigDecimal` 연산으로 자동 재계산됩니다.
- **사용해야 할 때**: 클라이언트 금액 위변조를 막기 위해 서버 주도로 라인 소계 및 주문 합계를 산출할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 복잡한 구간 할인이나 외부 환율 API 조회가 필요한 계산에는 쓰지 마세요(`@ServiceOverride` 권장).

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | 아니오 (선택) | 지원되는 값 중 하나: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 계산 전략: "MULTIPLY" 또는 "SUM_COLLECTION"입니다.<br/>*주의:* `POST`/`PUT`/`PATCH` 저장 직전 자동 재계산되어 클라이언트가 조작한 금액을 원천 차단합니다. |
| `sourceFields` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | "MULTIPLY" 모드에서 서로 곱할 동일 엔티티 필드 목록입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"unitPrice"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `collectionField` | `String` | `""` | 아니오 (선택) | 엔티티의 @OneToMany 컬렉션 필드와 정확히 일치하는 Java 속성 이름(예: `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | "SUM_COLLECTION" 모드에서 합산할 @OneToMany 자식 컬렉션 필드명입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"items"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `itemField` | `String` | `""` | 아니오 (선택) | 엔티티의 숫자 필드와 정확히 일치하는 Java 속성 이름(예: `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | 각 자식 요소에서 합산할 숫자 필드명(예: "subTotal")입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"subTotal"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `subtractField` | `String` | `""` | 아니오 (선택) | 엔티티의 숫자 필드와 정확히 일치하는 Java 속성 이름(예: `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | 합계에서 차감할 부모 엔티티 필드명(예: "discountAmount")입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"discountAmount"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `addField` | `String` | `""` | 아니오 (선택) | 엔티티의 숫자 필드와 정확히 일치하는 Java 속성 이름(예: `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | 결과에 가산할 부모 엔티티 추가 비용 필드명(예: "shippingFee")입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"shippingFee"`). 불일치 시 런타임 조회 오류가 발생합니다. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: 커스텀 SQL/JPQL 또는 프로바이더 헬퍼 메서드를 컨트롤러 엔드포인트에 바인딩합니다.
- **런타임 동작**: 바인딩된 명명 파라미터와 함께 JPA EntityManager로 실행됩니다.
- **사용 방법**: `@AutoGet`/`@AutoPost`와 함께 선언하고 `@AutoParam`/`@AutoVariable`로 `:param`을 바인딩하세요.
- **사용해야 할 때**: Repository를 만들지 않고 네이티브 SQL 리포트, CTE, 윈도우 함수, JSONB 쿼리를 실행할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 사용자 입력을 SQL 문자열에 직접 결합하지 마세요(`:param` 필수). 도메인 간 교차 JOIN도 금지됩니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | 아니오 (선택) | 지원되는 값 중 하나: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | 이름 기반 `:param` 바인딩을 지원하는 인라인 SQL 또는 JPQL 문자열입니다.<br/>*주의:* SQL 인젝션 방지를 위해 항상 `:param` 또는 `?1` 바인딩을 사용하세요. `sqlProvider` 사용 시 `""`로 비워 둡니다. |
| `nativeQuery` | `boolean` | `true` | 아니오 (선택) | `true`(데이터베이스 네이티브 SQL 실행) 또는 `false`(이식 가능한 JPA JPQL 실행).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true면 네이티브 SQL, false면 JPA JPQL로 실행합니다.<br/>*주의:* 네이티브 SQL(`true`)은 CTE와 윈도우 함수를 지원하며, H2/PostgreSQL/MySQL 이식성이 필요하면 `false`(JPQL)를 사용하세요. |
| `resultClass` | `Class<?>` | `Void.class` | 아니오 (선택) | 임의의 구체 Java DTO 클래스 리터럴(예: `MonthlyRevenueDto.class`) 또는 매핑 비활성화용 `Void.class`.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | 조회 결과를 매핑할 선택적 대상 클래스입니다.<br/>*주의:* 집계·리포트 쿼리에는 `SELECT *` 방지와 타입 안전성을 위해 항상 DTO 프로젝션 클래스를 지정하세요. |
| `sqlProvider` | `Class<?>` | `Void.class` | 아니오 (선택) | 구체 Pure Java SQL 프로바이더 클래스(예: `OrderAnalyticsSqlProvider.class`) 또는 인라인 `value` 사용 시 `Void.class`.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | 부팅 시 검증되는 동적 SQL 문자열 제공 클래스(선택)입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `sqlProvider` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `providerMethod` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"buildRevenueSql"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | `sqlProvider` 내에서 SQL 문자열을 반환하는 메서드 이름입니다.<br/>*주의:* Java 메서드/필드 식별자와 대소문자까지 정확히 일치해야 합니다(예: `"buildRevenueSql"`). 불일치 시 런타임 조회 오류가 발생합니다. |
| `modifying` | `boolean` | `false` | 아니오 (선택) | `true`(쓰기 트랜잭션 내 UPDATE/DELETE DML 실행) 또는 `false`(읽기 전용 SELECT 쿼리).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | INSERT/UPDATE/DELETE 쿼리 실행 시 반드시 `true`여야 합니다.<br/>*주의:* `UPDATE`/`DELETE` 문에서는 `true`가 필수이며 쓰기 트랜잭션으로 자동 감쌉니다. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. 데이터베이스 기반 동적 RBAC 및 필드 마스킹 메타 애노테이션 (18 개 애노테이션)

### `@SecurityRoleEntity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **목적**: JPA 엔티티를 실시간 데이터베이스 RBAC 역할 카탈로그 테이블로 지정합니다.
- **런타임 동작**: DynamicDatabaseRbacProviderHelper가 역할-권한 매핑을 Caffeine에 캐시하고 쓰기 시 자동 무효화합니다.
- **사용 방법**: Role JPA 엔티티에 `@SecurityRoleEntity`를 선언하고 `@RoleCode`로 역할 코드를 지정하세요.
- **사용해야 할 때**: 관리자가 하드코딩 대신 DB 테이블을 통해 런타임에 동적으로 역할을 관리할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@RoleCode`를 누락하면 부팅이 중단됩니다. 또한 여러 `@SecurityRoleEntity`를 중복 등록하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | 아니오 (선택) | 초 단위의 양수(`>= 1`). 예: `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | JPA에서 역할을 다시 로드하기 전 Caffeine 스냅샷 캐시 TTL(초)입니다.<br/>*주의:* 짧은 TTL은 DB 변경을 빠르게 반영하지만 쿼리가 늘어나고, 긴 TTL은 부하를 줄이지만 권한 회수 반영이 지연됩니다. |

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

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityRoleEntity 내부의 고유 역할 코드 컬럼을 매핑합니다.
- **런타임 동작**: 캐시된 LambdaAccessorUtil로 읽어 GrantedAuthority 토큰과 매칭합니다.
- **사용 방법**: `@SecurityRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@RoleCode`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityRoleEntity에서 사람이 읽을 수 있는 역할 표시 이름 필드를 식별합니다.
- **런타임 동작**: RBAC 진단 메타데이터 및 Dev Studio 역할 검사 엔드포인트에 노출됩니다.
- **사용 방법**: `@SecurityRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@RoleName`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: 역할 엔티티에서 부여된 권한 코드 컬렉션 또는 CSV 문자열 필드를 표시합니다.
- **런타임 동작**: 동적으로 파싱되어 SecurityIdentityCustomizer의 유효 권한으로 확장됩니다.
- **사용 방법**: `@SecurityRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@RolePermissions`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **목적**: 리소스-액션 권한과 동적 필드 마스킹 규칙을 저장하는 JPA 엔티티를 지정합니다.
- **런타임 동작**: DatabaseRbacRuleMatcherHelper에 로드되어 리소스 CRUD 제어 및 조회 후 필드 마스킹을 적용합니다.
- **사용 방법**: Permission 엔티티에 `@SecurityPermissionEntity`와 필수 `@PermissionCode`를 선언하세요.
- **사용해야 할 때**: DB에서 리소스/액션별 세밀한 권한 및 필드 마스킹을 동적으로 관리할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@PermissionCode`를 누락하거나 중복 선언하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | 아니오 (선택) | 초 단위의 양수(`>= 1`). 예: `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | 권한 정의 스냅샷의 Caffeine 캐시 TTL(초)입니다.<br/>*주의:* 짧은 TTL은 DB 변경을 빠르게 반영하지만 쿼리가 늘어나고, 긴 TTL은 부하를 줄이지만 권한 회수 반영이 지연됩니다. |

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

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPermissionEntity 내 고유 권한 식별자 필드를 지정합니다.
- **런타임 동작**: 호출자 권한 및 @EntitySecurity.permissions() 코드와 대조됩니다.
- **사용 방법**: `@SecurityPermissionEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PermissionCode`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPermissionEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPermissionEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPermissionEntity에서 대상 엔티티 또는 API 리소스 이름(또는 *)을 매핑합니다.
- **런타임 동작**: DatabaseRbacRuleMatcherHelper가 대소문자 구분 없이 와일드카드 폴백과 함께 평가합니다.
- **사용 방법**: `@SecurityPermissionEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PermissionResource`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPermissionEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPermissionEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPermissionEntity 규칙이 보호하는 CRUD 또는 커스텀 액션 동사를 매핑합니다.
- **런타임 동작**: 컨트롤러 메서드명에서 READ, WRITE, DELETE 또는 커스텀 액션으로 자동 정규화됩니다.
- **사용 방법**: `@SecurityPermissionEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PermissionAction`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPermissionEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPermissionEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: 이 DB 권한 규칙이 적용될 때 동적으로 가릴 쉼표 구분 엔티티 필드를 선언합니다.
- **런타임 동작**: HTTP JSON 응답 직렬화 전에 @FieldSecurity와 함께 동적으로 적용됩니다.
- **사용 방법**: `@SecurityPermissionEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PermissionFieldMask`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPermissionEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPermissionEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **목적**: 인증된 사용자 주체를 DB 역할 및 선택적 테넌트 범위에 바인딩하는 JPA 엔티티를 매핑합니다.
- **런타임 동작**: JWT / SecurityContext 구성 시 SecurityIdentityCustomizer를 통해 자동 조회됩니다.
- **사용 방법**: 사용자-역할 매핑 엔티티에 선언하고 `@UserRoleSubject`, `@UserRoleCode`, `@UserRoleTenantId`를 붙이세요.
- **사용해야 할 때**: JWT에는 사용자 식별자만 담고 DB 할당 테이블에서 테넌트별 역할을 동적으로 부여할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@UserRoleSubject`를 누락하지 마세요. 외부 IdP JWT만으로 충분하면 불필요합니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@SecurityUserRoleEntity(enabled = true)` | 이 테이블에서 사용자-역할 매핑을 로드할지 제어하는 스위치(기본 true)입니다.<br/>*주의:* 스키마 마이그레이션 중 일시적으로 `false`로 두면 JWT 역할 인증은 유지한 채 DB 조회만 중지할 수 있습니다. |

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

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityUserRoleEntity에서 주체(사용자명 / JWT sub) 필드를 식별합니다.
- **런타임 동작**: 활성 SecurityContext의 Authentication.getName()과 대조됩니다.
- **사용 방법**: `@SecurityUserRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@UserRoleSubject`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityUserRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityUserRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityUserRoleEntity 내부에 할당된 역할 코드 컬럼을 바인딩합니다.
- **런타임 동작**: 정책 평가 시 연결된 @SecurityRoleEntity 권한을 런타임에 해석합니다.
- **사용 방법**: `@SecurityUserRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@UserRoleCode`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityUserRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityUserRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityUserRoleEntity 할당을 특정 테넌트 ID(또는 전역 *) 범위로 제한합니다.
- **런타임 동작**: 인증된 각 요청마다 TenantContextHolder / X-Tenant-ID 기준으로 필터링됩니다.
- **사용 방법**: `@SecurityUserRoleEntity` 엔티티 내 해당 필드 또는 getter 위에 `@UserRoleTenantId`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityUserRoleEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityUserRoleEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **목적**: priority 순으로 평가되는 명시적 ALLOW / DENY 인가 정책을 저장하는 JPA 엔티티를 표시합니다.
- **런타임 동작**: 명시적 DENY가 ALLOW를 결정론적으로 우선하며 SQL 실행 전에 정책을 검사합니다.
- **사용 방법**: 정책 엔티티에 `@SecurityPolicyEntity`와 필수 `@PolicyAllowedRoles`, `@PolicyResource`, `@PolicyAction`, `@PolicyEffect`를 선언하세요.
- **사용해야 할 때**: 정적 `@EntitySecurity`를 DB 기반 동적 ALLOW/DENY 정책으로 보강하거나 긴급 차단(`DENY`)할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@PolicyAllowedRoles`를 빼먹지 마세요. 명시적 `DENY`가 `ALLOW`보다 우선합니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | 아니오 (선택) | 정수 우선순위 단위의 양수(`>= 0`). 예: `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | 정책 평가 우선순위입니다(낮을수록 우선 적용, 기본 100).<br/>*주의:* 여러 정책이 일치할 때 낮은 숫자가 우선 적용됩니다(예: `10`이 기본값 `100`보다 우선). |

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

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPolicyEntity에서 대상 리소스 식별자 패턴을 매핑합니다.
- **런타임 동작**: 정확한 엔티티/리소스 이름과 와일드카드 * 매칭을 모두 지원합니다.
- **사용 방법**: `@SecurityPolicyEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PolicyResource`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPolicyEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPolicyEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPolicyEntity 내부에서 보호되는 작업 동사(READ, WRITE, DELETE, methodName, *)를 매핑합니다.
- **런타임 동작**: 서비스 위임 전에 각 HTTP 요청 작업별로 평가됩니다.
- **사용 방법**: `@SecurityPolicyEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PolicyAction`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPolicyEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPolicyEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPolicyEntity 규칙이 대상으로 하는 역할 컬렉션 또는 쉼표 구분 문자열을 매핑합니다.
- **런타임 동작**: 활성 JWT 권한 및 DB에서 로드된 @SecurityUserRoleEntity 역할과 교차 검증합니다.
- **사용 방법**: `@SecurityPolicyEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PolicyAllowedRoles`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPolicyEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPolicyEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **목적**: @SecurityPolicyEntity 규칙의 ALLOW 또는 DENY 정책 결정 결과를 지정합니다.
- **런타임 동작**: 일치하는 DENY 정책이 있으면 즉시 HTTP 403 AccessDeniedBusinessException으로 요청을 차단합니다.
- **사용 방법**: `@SecurityPolicyEntity` 엔티티 내 해당 필드 또는 getter 위에 `@PolicyEffect`를 선언하세요.
- **사용해야 할 때**: 기존 테이블/컬럼 이름을 변경하지 않고 `@SecurityPolicyEntity`의 속성을 DB-RBAC 스냅샷에 매핑할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 한 `@SecurityPolicyEntity` 클래스 내에 중복 선언하거나 해당 어노테이션이 없는 엔티티에 쓰지 마세요.

> **마커 애노테이션 (Marker Annotation)**: 속성을 선언하지 않는 순수 마커 애노테이션입니다.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. 분산 락, 멱등성, 캐싱, 멀티 DB 및 클라우드 이벤트 (13 개 애노테이션)

### `@DistributedLock`

- **패키지**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **목적**: AST 맵(최대 1024개)에 캐시된 SpEL 키를 기반으로 동시 접근을 직렬화합니다(기본 waitTimeMs=3000L, leaseTimeMs=5000L).
- **런타임 동작**: 대기 시간 초과 시 DistributedLockAspect가 DistributedLockAcquisitionException(HTTP 409)을 발생시킵니다.
- **사용 방법**: non-final `@Service` 메서드에 선언하세요. 다중 인스턴스 클러스터에선 Redis `DistributedLockProvider` 빈을 제공해야 합니다.
- **사용해야 할 때**: 재고 초과 판매, 동시 잔액 차감, 배치 경합 방지를 위한 상호 배제 시 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 기본 Caffeine + `ReentrantLock`은 단일 JVM 전용입니다! 다중 파드에서는 반드시 `DistributedLockProvider`를 교체하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | 아니오 (선택) | 메서드 인자를 참조하는 SpEL 표현식(예: `"'inventory:' + #skuId"`) 또는 자동 키 생성용 `""`.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | 런타임에 평가되는 SpEL 락 키 표현식입니다.<br/>*주의:* 락 키는 반드시 가장 좁은 리소스 ID(`#id`)로 지정하세요. 고정 키는 전체 트래픽을 직렬화합니다. |
| `waitTimeMs` | `long` | `3000L` | 아니오 (선택) | 밀리초 단위의 양수(`>= 0`). 예: `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | 락 획득 최대 대기 시간(밀리초, 기본 3000L)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 너무 짧으면 409 충돌이 잦고, 너무 길면 트래픽 급증 시 스레드가 대기합니다. |
| `leaseTimeMs` | `long` | `5000L` | 아니오 (선택) | 밀리초 단위의 양수(`>= 100`). 예: `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | 최대 락 유지(리스) 시간(밀리초, 기본 5000L)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: p99 트랜잭션 시간보다 길어야 쓰기 도중 락 만료로 인한 동시성 손상을 막습니다. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 설정 가능한 TTL 창 내에서 동시 또는 재전송된 중복 쓰기를 방지합니다.
- **런타임 동작**: IdempotencyAspect와 ProxyIdempotencyGuardHelper가 Caffeine TTL 잠금(HTTP 409 ConflictBusinessException)을 적용하며, 키가 비어 있으면 통과시키고 IdempotencyManagerHelper는 선택적 SHA-256 도구를 제공합니다.
- **사용 방법**: `@AutoRestController` 또는 non-final `@Service` 메서드에 선언하세요. 실패 시 키가 해제되어 안전한 재시도가 가능합니다.
- **사용해야 할 때**: 결제 승인, 송금, 중복 클릭에 취약한 POST 작업의 멱등성 보장을 위해 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: GET 조회에는 사용하지 말고, 다중 파드 환경에서는 Redis 기반 `IdempotencyStoreProvider`를 등록하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | 아니오 (선택) | 유효한 HTTP 헤더 이름(전송 시 대소문자 구분 없음, 예: `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | 클라이언트가 전달하는 HTTP 헤더 이름입니다(누락/공백 시 우회).<br/>*주의:* 클라이언트는 논리 작업마다 고유 UUIDv7을 전송하고 재시도 시 동일 헤더를 재사용해야 합니다. CORS `allowedHeaders`에 허용하세요. |
| `ttlSeconds` | `long` | `300L` | 아니오 (선택) | 초 단위의 양수(`>= 1`). 예: `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | 동일 키 재전송 시 HTTP 409 Conflict를 반환할 중복 방지 유효 시간(초, 기본 300L)입니다.<br/>*주의:* Redis/메모리에 응답을 보관하는 시간입니다. 결제 등 재시도 기간에 맞춰 `300L–86400L`로 설정하세요. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: IP, 사용자 또는 테넌트 파티션별로 슬라이딩 윈도 요청 제한을 적용합니다.
- **런타임 동작**: nwvmc.ratelimit.rejected.total 메트릭을 증가시키고 HTTP 429 Too Many Requests를 응답합니다.
- **사용 방법**: `@AutoRestController` 인터페이스 또는 메서드에 선언하세요. 허용 시 `X-RateLimit-Remaining`/`X-RateLimit-Reset`, 초과 시 `HTTP 429` + `Retry-After`를 반환합니다.
- **사용해야 할 때**: 공개 검색, 인증, AI 자연어 쿼리, 대용량 내보내기 등 트래픽 남용 방지가 필요한 곳에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 내부 헬스 체크에 과도한 제한을 두지 말고, 격리가 필요한 경우 `"GLOBAL"` 대신 `"USER"`, `"TENANT"`, `"IP"`를 선택하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | 아니오 (선택) | 요청 수 단위의 양수(`>= 1`). 예: `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | 윈도우당 허용되는 최대 요청 횟수(기본 60)입니다.<br/>*주의:* HTTP `429` 반환 시 `X-RateLimit-Remaining`, `X-RateLimit-Reset`, RFC 6585 `Retry-After` 헤더를 자동 추가합니다. |
| `windowSeconds` | `int` | `60` | 아니오 (선택) | 초 단위의 양수(`>= 1`). 예: `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | 속도 제한 시간 창 길이(초, 기본 60)입니다.<br/>*주의:* 카운터 윈도우 길이를 정의하며 `X-RateLimit-Reset` 및 `Retry-After` 값의 기준이 됩니다. |
| `partitionKey` | `String` | `"IP"` | 아니오 (선택) | 지원되는 값 중 하나: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | 버킷 분할 전략(대소문자 무관): "IP"/"clientIp", "USER"(익명 시 IP 폴백), "TENANT", "GLOBAL", 또는 SpEL "#expr".<br/>*주의:* `"USER"`는 인증 주체별로 격리하고 익명 요청은 IP로 폴백합니다. `"GLOBAL"`은 전체 호출자가 단일 한도를 공유합니다. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: Actuator 및 Micrometer에 원격 측정을 보고하는 Resilience4j 서킷 브레이커로 작업을 보호합니다.
- **런타임 동작**: 오류율 임계치 초과 시 OPEN(HTTP 503)으로 전환되고 nwvmc.resilience.circuitbreaker.state 게이지를 갱신합니다.
- **사용 방법**: 외부 API나 AI 연동 등 장애 전파 위험이 있는 컨트롤러/메서드에 선언해 Resilience4j로 격리하세요.
- **사용해야 할 때**: 하위 서비스 장애 시 타임아웃 대기로 스레드를 고갈시키는 대신 즉시 `HTTP 503`으로 빠르게 실패시켜야 할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `CircuitBreakerErrorFilterUtil`이 4xx `BaseBusinessException`을 자동 무시합니다. 클라이언트 오류를 일반 `RuntimeException`으로 감싸지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"payment-gateway-cb"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Resilience4j CircuitBreaker 인스턴스 이름입니다.<br/>*주의:* Resilience4j 인스턴스명과 Micrometer 메트릭 태그로 사용됩니다. `""`이면 클래스명으로 자동 지정됩니다. |
| `failureRateThreshold` | `float` | `50.0f` | 아니오 (선택) | 퍼센트 단위의 양수(`1.0f .. 100.0f`). 예: `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | 서킷을 OPEN 상태로 전환하는 실패율 임계치(기본 50.0f%)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 4xx `BaseBusinessException`은 자동 제외되며 5xx 및 인프라 장애만 차단율에 집계됩니다. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | 아니오 (선택) | 초 단위의 양수(`>= 1`). 예: `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | OPEN 상태에서 HALF_OPEN 전환 전 대기 시간(초, 기본 10)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 4xx `BaseBusinessException`은 자동 제외되며 5xx 및 인프라 장애만 차단율에 집계됩니다. |
| `slidingWindowSize` | `int` | `20` | 아니오 (선택) | 호출 수 단위의 양수(`>= 1`). 예: `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | 실패율을 계산할 최근 호출 샘플 크기(기본 20)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 4xx `BaseBusinessException`은 자동 제외되며 5xx 및 인프라 장애만 차단율에 집계됩니다. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | 아니오 (선택) | 호출 수 단위의 양수(`>= 1`). 예: `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | HALF_OPEN 상태에서 복구 여부를 시험할 허용 호출 수(기본 5)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 4xx `BaseBusinessException`은 자동 제외되며 5xx 및 인프라 장애만 차단율에 집계됩니다. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 일시적 오류를 설정 가능한 지수 백오프로 자동 재시도합니다.
- **런타임 동작**: 설정된 재시도 횟수를 모두 소진하면 표준화된 예외를 발생시킵니다.
- **사용 방법**: 일시적인 DB 잠금이나 네트워크 오류를 지수 백오프로 자동 복구하려면 컨트롤러/메서드에 선언하세요.
- **사용해야 할 때**: 멱등한 GET 조회, PUT 교체 또는 `@Idempotent`로 보호된 작업에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: `@Idempotent` 없는 비멱등 POST 생성이나 결제 청구에 절대 사용하지 마세요(중복 과금 위험)!

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"erp-sync-retry"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Resilience4j Retry 인스턴스 이름입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 총 재시도 시간이 상위 게이트웨이 타임아웃을 넘지 않도록 계산하세요. |
| `maxAttempts` | `int` | `3` | 아니오 (선택) | 시도 횟수 단위의 양수(`>= 1`). 예: `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | 최초 시도를 포함한 최대 실행 횟수(기본 3)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 총 재시도 시간이 상위 게이트웨이 타임아웃을 넘지 않도록 계산하세요. |
| `waitDurationMs` | `long` | `500L` | 아니오 (선택) | 밀리초 단위의 양수(`>= 50`). 예: `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | 첫 번째 재시도 전 대기 시간(밀리초, 기본 500L)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 총 재시도 시간이 상위 게이트웨이 타임아웃을 넘지 않도록 계산하세요. |
| `backoffMultiplier` | `double` | `2.0d` | 아니오 (선택) | 배수 단위의 양수(`>= 1.0d`). 예: `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | 재시도 간 지수 백오프 배율(기본 2.0d)입니다.<br/>*주의:* 운영 환경 지연 SLA에 맞춰 신중히 조정하세요: 총 재시도 시간이 상위 게이트웨이 타임아웃을 넘지 않도록 계산하세요. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **패키지**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: RFC 7232 약한 ETag(W/"...")를 계산하고 Cache-Control 및 HTTP 304 Not Modified 응답을 반환합니다.
- **런타임 동작**: HIT/MISS 카운터를 nwvmc.cache.http.requests 메트릭에 기록합니다.
- **사용 방법**: 읽기 전용 컨트롤러 또는 GET 메서드에 선언해 표준 `ETag`, `Cache-Control`, `304` 응답을 활성화하세요.
- **사용해야 할 때**: 자주 바뀌지 않는 카탈로그, 기준 정보, 공개 목록에서 `304` 응답으로 트래픽을 절감할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 개인정보, 멀티테넌트, `@FieldSecurity` 마스킹 데이터에 기본 `isPrivate = false`를 절대 두지 마세요!

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | 아니오 (선택) | 초 단위의 양수(`>= 0`). 예: `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | HTTP Cache-Control `max-age` 초 단위 기간(기본 60)입니다.<br/>*주의:* `Cache-Control: max-age=<N>` 헤더를 출력합니다. `0`과 `generateETag = true` 조합으로 즉시 `304` 재검증이 가능합니다. |
| `isPrivate` | `boolean` | `false` | 아니오 (선택) | `true`(브라우저 전용 private 캐시; 공용 CDN 차단) 또는 `false`(프록시 및 CDN 공유 가능한 public 캐시).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true면 `private`(CDN 캐시 금지), false면 `public`을 출력합니다.<br/>*주의:* 중요: 인증·멀티테넌트·`@FieldSecurity` 엔드포인트에서는 공용 CDN 데이터 유출을 막기 위해 반드시 `isPrivate = true`로 설정하세요. |
| `mustRevalidate` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | 만료된 캐시의 재검증을 요구하는 `, must-revalidate`를 추가합니다.<br/>*주의:* `maxAgeSeconds` 만료 후 원본 재검증 없이 오래된 응답을 반환하지 못하도록 강제합니다. |
| `generateETag` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | SHA-256 ETag를 생성하고 `If-None-Match` 일치 시 `HTTP 304 Not Modified`로 응답합니다.<br/>*주의:* 응답에서 RFC 7232 `ETag`를 계산하고 `If-None-Match` 일치 시 0바이트 `304 Not Modified`를 반환합니다. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 서버 측 읽기 메서드 결과를 Caffeine L1 / Redis L2 엔진에 캐시합니다.
- **런타임 동작**: app.framework.cache.type 설정으로 전역 제어할 수 있습니다.
- **사용 방법**: 읽기 서비스 메서드에 선언하세요(`app.framework.cache.type`으로 엔진 전환).
- **사용해야 할 때**: 읽기 비중이 압도적인 단건 ID 조회나 메타데이터 조회에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 쓰기 빈도가 높은 테이블에는 적용하지 마세요. 또한 캐시된 엔티티를 복제 없이 직접 수정하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Caffeine L1 또는 Redis L2에서 관리할 논리 캐시 이름 목록입니다.<br/>*주의:* Caffeine/Redis 캐시 영역명과 일치해야 하며, 쓰기·삭제 메서드에 대응하는 `@AutoCacheEvict`를 반드시 쌍으로 선언하세요. |
| `key` | `String` | `""` | 아니오 (선택) | 메서드 인자를 참조하는 SpEL 표현식(예: `"'product:' + #id"`) 또는 자동 키 생성용 `""`.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL 캐시 키 표현식(`v0.1.0`은 `EntityName:id`를 결정론적으로 안전하게 생성합니다).<br/>*주의:* 멀티테넌트 앱에서는 테넌트 간 캐시 오염을 막기 위해 키에 반드시 테넌트 ID를 포함하세요. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 데이터 변경 시 오래된 서버 측 캐시 항목을 제거합니다.
- **런타임 동작**: 변경 후 깔끔하게 실행되어 오래된 읽기 잔여 데이터를 남기지 않습니다.
- **사용 방법**: 수정/삭제 메서드에 `@AutoCacheable`과 동일한 키 규칙으로 선언해 정합성을 유지하세요.
- **사용해야 할 때**: `@AutoCacheable`로 캐시된 레코드를 수정·상태전이·삭제할 때 반드시 함께 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 빈번한 `create` 작업에 `allEntries = true`를 설정해 캐시 스탬피드를 유발하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | 메서드 완료 후 무효화할 캐시 이름 목록입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `value` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `key` | `String` | `""` | 아니오 (선택) | 메서드 인자를 참조하는 SpEL 표현식(예: `"'product:' + #id"`) 또는 자동 키 생성용 `""`.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | 수정된 단일 엔티티 캐시 항목만 정확히 삭제할 SpEL 키 표현식입니다.<br/>*주의:* `@AutoCacheable.key`와 동일한 키 형식으로 평가되어야 하며 `allEntries = true`일 때는 무시됩니다. |
| `allEntries` | `boolean` | `false` | 아니오 (선택) | `true`(대상 캐시 영역의 모든 항목 제거) 또는 `false`(key로 지정된 단일 항목만 제거).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | true일 때 해당 엔티티 접두사 범위의 캐시만 안전하게 일괄 제거합니다.<br/>*주의:* 고부하 상황에서 전체 영역을 비우면 DB 캐시 스탬피드가 발생할 수 있으므로 가능한 단일 `key` 제거를 권장합니다. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **패키지**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 실행 시간을 측정하고 임계치를 초과하는 느린 호출 시 WARN 로그를 기록합니다.
- **런타임 동작**: DynamicEntityMetricsHelper를 통해 지연 시간 타이머도 기록합니다.
- **사용 방법**: 컨트롤러 인터페이스나 서비스에 선언해 SLA 지연 임계치를 초과하는 호출을 추적하세요.
- **사용해야 할 때**: 복잡한 리포트, 배치, GraphQL, `@CustomQuery`에서 느린 SQL 회귀를 조기 포착할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 고트래픽 경로에 `warningThresholdMs = 0`을 두어 로그를 도배하거나 장수명 SSE `/events` 스트림에 적용하지 마세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | 아니오 (선택) | 밀리초 단위의 양수(`>= 1`). 예: `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | 지연 실행 WARN 로그 및 메트릭 알람이 발생할 임계 시간(밀리초, 기본 500L)입니다.<br/>*주의:* 임계값 초과 시 `traceId`가 포함된 `WARN` 로그를 기록합니다. 로그 폭주를 막기 위해 현실적인 값(`200L–1000L`)을 쓰세요. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **패키지**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **목적**: 커밋 후 Virtual Threads에서 HMAC-SHA256 서명된 아웃바운드 웹훅을 비동기 전송합니다.
- **런타임 동작**: WebhookHmacSignerHelper에서 서명을 생성하고 상수 시간 동등성을 검증합니다.
- **사용 방법**: JPA `@Entity`에 선언하면 DB 커밋 완료 후 Outbox와 Virtual Thread를 통해 안전하게 비동기 발송됩니다.
- **사용해야 할 때**: 주문/결제 커밋 직후 외부 파트너나 SaaS 고객사 시스템으로 HMAC 서명 웹훅을 보낼 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 민감한 PII/PCI 데이터가 포함되면 `includeFullPayload = false`로 설정하고 내부 SSRF 주소를 차단하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | 아니오 (선택) | 0개 이상의 유효한 값 배열: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | HMAC 서명 웹훅 발송을 트리거하는 생명주기 이벤트 목록입니다.<br/>*주의:* DB 트랜잭션 커밋(`AFTER_COMMIT`) 이후 비동기 발송되므로 롤백된 변경이 유령 웹훅을 보내지 않습니다. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | 아니오 (선택) | 유효한 HTTP 헤더 이름(전송 시 대소문자 구분 없음, 예: `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HMAC-SHA256 검증 서명을 담는 HTTP 헤더 이름입니다.<br/>*주의:* HMAC-SHA256 서명을 전달합니다. 수신 측은 처리 전 상수 시간 비교로 반드시 검증해야 합니다. |
| `includeFullPayload` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@EntityWebhook(includeFullPayload = false)` | true면 전체 JSON 페이로드를 포함하고, false면 ID와 메타데이터만 전송합니다.<br/>*주의:* PII·금융 엔티티에서는 `false`(ID와 이벤트 유형만 전송)로 설정해 구독자가 인증된 GET으로 조회하게 하세요. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **패키지**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 트랜잭션 커밋 이후 CNCF CloudEvents v1.0 표준 이벤트를 발행합니다.
- **런타임 동작**: 롤백 유령 이벤트를 막기 위해 TransactionRuntimeBridge.executeAfterCommit을 준수합니다.
- **사용 방법**: 엔티티 또는 메서드에 선언하고 `AFTER_COMMIT` 단계에서 `CloudEventEnvelopeDto`를 구독하세요.
- **사용해야 할 때**: 모듈 간 SQL JOIN 없이 바운디드 컨텍스트 간 이벤트 기반 비동기 통신이 필요할 때 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 외부 HTTP용 `@EntityWebhook`과 혼동하지 말고 리스너는 반드시 `AFTER_COMMIT`으로 실행하세요.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | 아니오 (선택) | 비어 있지 않은 식별자 문자열(예: `"com.acme.order.lifecycle"`). `""`이면 프레임워크 기본 규칙을 따릅니다.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | CNCF CloudEvents `type` 식별자입니다.<br/>*주의:* CloudEvents 1.0 역방향 DNS 규칙(`com.company.domain.event`)을 따르며 `""`이면 자동 생성됩니다. |
| `source` | `String` | `""` | 아니오 (선택) | `/`로 시작하는 유효한 HTTP 경로(예: `/services/order-api`) 또는 자동 유도를 위한 빈 문자열 `""`.<br/>`@PublishCloudEvent(source = "/services/order-api")` | 발행 바운디드 컨텍스트를 나타내는 CloudEvents `source` URI입니다.<br/>*주의:* 마이크로서비스 간 이벤트 추적을 위한 CNCF CloudEvents `source` URI를 채웁니다. |
| `publishOnCreate` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | 생성 커밋 후 CloudEvent 발행 여부(기본 true)입니다.<br/>*주의:* 트랜잭션 커밋(`AFTER_COMMIT`) 이후에만 Spring Events / Kafka / RabbitMQ로 발행됩니다. |
| `publishOnUpdate` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | 수정 커밋 후 CloudEvent 발행 여부(기본 true)입니다.<br/>*주의:* 조회수처럼 갱신이 잦은 엔티티에서는 브로커 과부하 방지를 위해 `false`로 끄세요. |
| `publishOnDelete` | `boolean` | `true` | 아니오 (선택) | `true`(활성화) 또는 `false`(비활성화).<br/>`@PublishCloudEvent(publishOnDelete = true)` | 삭제 커밋 후 CloudEvent 발행 여부(기본 true)입니다.<br/>*주의:* 물리 삭제와 `BaseAuditEntity.deleted` 모두에서 발행되어 하위 읽기 모델을 동기화합니다. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **패키지**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 엔티티 또는 쿼리 작업을 지정된 논리 데이터소스 키에 고정합니다.
- **런타임 동작**: 라우팅 횟수를 framework.datasource.routing.total 메트릭에 기록합니다.
- **사용 방법**: 컨트롤러 또는 non-final 서비스 메서드에 선언하세요. 종료 시 이전 컨텍스트가 자동 복구됩니다.
- **사용해야 할 때**: CQRS 읽기 전용 레플리카(`REPLICA`) 분리나 대용량 BI 리포트 분산 처리에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 이미 열린 `@Transactional` 중간에 데이터소스를 바꾸지 마세요(트랜잭션 시작 시점에 커넥션이 결정됨). `final` 클래스에도 금지입니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | 아니오 (선택) | 지원되는 값 중 하나: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | `DataSourceContextHolder`에 바인딩할 데이터소스 라우팅 키("PRIMARY", "REPLICA")입니다.<br/>*주의:* `DynamicRoutingDataSource`에 등록된 키와 일치해야 하며, 미등록 키는 `PRIMARY`로 폴백합니다. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **패키지**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **목적**: 엔티티별로 데이터베이스 엔진 계열과 논리 클러스터 샤드를 할당합니다.
- **런타임 동작**: MultiPlatformDataSourceRegistryHelper 및 TenantDatabaseRoutingResolverHelper가 동적으로 해결합니다.
- **사용 방법**: 전용 DB 엔진과 클러스터 어피니티가 필요한 엔티티나 서비스 메서드에 선언하세요.
- **사용해야 할 때**: 금융·분석·감사 클러스터가 분리된 폴리글롯 영속성 또는 샤딩 아키텍처에 사용합니다.
- **사용하지 말아야 할 때 및 주의사항**: 실제 JDBC DataSource 풀 설정을 대체하지 않으며 서로 다른 클러스터 엔티티 간 JPA JOIN은 불가합니다.

| 속성 | Java 타입 | 기본값 | 필수 여부 | 허용 값 및 예제 | 설명 및 런타임 주의사항 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | 아니오 (선택) | 지원되는 값 중 하나: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | 대상 데이터베이스 엔진 식별자("H2", "POSTGRESQL", "MYSQL", "ORACLE" 등)입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `platform` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `cluster` | `String` | `"PRIMARY"` | 아니오 (선택) | 지원되는 값 중 하나: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | 대상 데이터베이스 클러스터/샤드 티어("PRIMARY", "FINANCE_CLUSTER" 등)입니다.<br/>*주의:* 애플리케이션 부트스트랩 시 즉시 검증됩니다. 오타나 잘못된 `cluster` 값은 트래픽 수신 전에 Fail-Fast로 중단됩니다. |
| `readOnly` | `boolean` | `false` | 아니오 (선택) | `true`(읽기 전용 복제본 풀로 라우팅) 또는 `false`(읽기/쓰기 마스터 풀로 라우팅).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | true일 때 읽기 전용 레플리카 라우팅 선호를 지정합니다.<br/>*주의:* `POST`/`PUT`/`PATCH`/`DELETE`에는 절대 `readOnly = true`를 설정하지 마세요. 읽기 복제본은 쓰기를 거부합니다. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
