# 02. 자동 생성 40개 REST 계약 및 플랫폼 컨트롤러 카탈로그 (`0.1.0`)

> **언어**: **한국어** | [English](../en/02_REST_API_CATALOG.md) | [Tiếng Việt](../vi/02_REST_API_CATALOG.md) | [日本語](../ja/02_REST_API_CATALOG.md) | [中文](../zh/02_REST_API_CATALOG.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#endpoints)

---

## 1. 엔티티당 40개 조합형 `@Auto*` 계약 (기본 노출 `38`개)

`AutoApiController<E>`를 상속(또는 `AutoReadApi`, `AutoKeysetApi`, `AutoAnalyticsApi`, `AutoSchemaApi`, `AutoExportImportApi`, `AutoWriteApi`, `AutoBatchApi`, `AutoWorkflowApi`, `AutoAiApi`를 선택 조합)하면 `DynamicControllerProxyRegistrarHelper`와 `SpringMvcEndpointBridge`가 최대 **40**개 계약을 바인딩합니다(`AutoApiReadController` `15` + `AutoWriteApi`/`AutoBatchApi` `10` + `AutoApiEnterpriseController` `11` + `AutoExportImportApi` `4`; `/events`는 `@Hidden`이고 `/{id}/**`는 `enableNestedSubResources = true`가 필요해 Swagger UI 기본 노출은 **`38`**개). `@AutoRestController(readDto, createDto, updateDto)` 및 표준 Spring `@RequestBody`/`@RequestParam`/`@PathVariable`을 지원합니다.

### 그룹 1: 조회, 분석 및 클라이언트 코드 생성 (`AutoApiReadController` — 15개 계약)

| # | HTTP | 하위 경로 | 메서드 | 동작 설명 |
| :-: | :--- | :--- | :--- | :--- |
| 1 | `GET` | `""` | `getPage` | 13개 필터 연산자, 다중 정렬, 연관 관계 Eager 로딩 및 필드 선택을 지원하는 오프셋 페이지네이션입니다. |
| 2 | `GET` | `/keyset` | `getKeysetPage` | 대용량 테이블에서도 SQL OFFSET 스캔 저하 없이 동작하는 O(1) UUIDv7 커서 기반 페이지네이션입니다. |
| 3 | `GET` | `/all` | `getAll` | 드롭다운 및 참조 테이블을 위해 동적 필터 조건과 일치하는 전체 레코드를 반환합니다. |
| 4 | `GET` | `/count` | `count` | 동적 필터 조건에 일치하는 레코드 수를 SQL COUNT(*)로 집계합니다. |
| 5 | `GET` | `/exists` | `exists` | 조건에 일치하는 레코드가 하나 이상 존재하면 true를 반환하는 고속 불리언 검사입니다. |
| 6 | `GET` | `/aggregate` | `aggregate` | 숫자 속성에 대해 SQL SUM, AVG, MIN, MAX 및 COUNT 집계를 계산합니다. |
| 7 | `GET` | `/distinct` | `findDistinctValues` | 필터 패싯 드롭다운용으로 중복 제거된 고유 값 목록을 조회합니다. |
| 8 | `GET` | `/top` | `findTopRecords` | 리더보드 및 알림을 위해 정렬된 상위 N개 엔티티를 반환합니다. |
| 9 | `GET` | `/group-by` | `groupByAnalytics` | 차트 및 BI 리포팅을 위한 동적 GROUP BY 집계 지표를 제공합니다. |
| 10 | `GET` | `/metadata` | `getMetadata` | JPA 필드 정의, Jakarta 검증 제약 조건 및 RBAC 가시성 메타데이터를 노출합니다. |
| 11 | `GET` | `/schema/typescript` | `generateTypeScript` | JPA 필드 정의로부터 바로 복사 가능한 TypeScript 인터페이스를 생성합니다. |
| 12 | `GET` | `/schema/json` | `getJsonSchema` | 동적 폼 빌더를 위한 JSON Schema Draft 계약을 생성합니다. |
| 13 | `GET` | `/schema/zod` | `generateZodSchema` | ZodAndClientGeneratorUtil을 통해 런타임 Zod 검증 스키마(text/plain)를 생성합니다. |
| 14 | `GET` | `/schema/client` | `generateTypedApiClient` | Zod 파싱과 CRUD 헬퍼가 포함된 타입 안전 TypeScript Fetch 클라이언트 모듈을 생성합니다. |
| 15 | `GET` | `/{id}` | `getById` | UUIDv7로 단건 엔티티를 조회하며 @FieldSecurity 마스킹과 @HttpCacheable ETag를 적용합니다. |

### 그룹 2: 생성, 배치, Upsert, 패치, 삭제 및 복원 (`AutoWriteApi` + `AutoBatchApi` — 10개 계약)

| # | HTTP | 하위 경로 | 메서드 | 동작 설명 |
| :-: | :--- | :--- | :--- | :--- |
| 16 | `POST` | `""` | `create` | Bean Validation, @AutoCode, @AutoSlug, @UniqueField 및 @ComputedField를 적용하여 엔티티를 생성합니다. |
| 17 | `POST` | `/batch` | `createBatch` | 검증된 컬렉션을 단일 원자적 트랜잭션 내에서 일괄 삽입합니다. |
| 18 | `POST` | `/upsert` | `upsert` | @UniqueField 키 또는 명시적 UUIDv7 ID를 기준으로 원자적 Upsert(삽입/갱신)를 수행합니다. |
| 19 | `POST` | `/upsert-batch` | `upsertBatch` | 레코드 배열 전체에 대해 트랜잭션 기반 대량 Upsert를 수행합니다. |
| 20 | `POST` | `/batch-chunked` | `batchChunked` | 대규모 배치를 설정 가능한 청크 단위로 처리하고 항목별 BatchExecutionResultDto 진단을 반환합니다. |
| 21 | `PATCH` | `/batch-update` | `updateBatchByFilter` | URL 필터 조건과 일치하는 모든 레코드를 본문의 non-null 필드로 일괄 부분 업데이트합니다. |
| 22 | `PUT` | `/{id}` | `update` | 서버 감사 컬럼을 보존하면서 엔티티 전체를 갱신합니다. |
| 23 | `PATCH` | `/{id}` | `patch` | 기존 엔티티에 null이 아닌 입력 속성만 병합하는 부분 업데이트를 수행합니다. |
| 24 | `DELETE` | `/{id}` | `deleteById` | @EntitySecurity deleteRoles 및 @StateMachine deletableStates 검증 후 레코드를 소프트 삭제합니다. |
| 25 | `POST` | `/{id}/restore` | `restoreById` | 이전에 소프트 삭제된 엔티티를 활성 조회 대상으로 복원합니다. |

### 그룹 3: 엔터프라이즈 생명주기, AI, RFC 6902 패치 및 스트리밍 (`AutoApiEnterpriseController` — 11개 계약)

| # | HTTP | 하위 경로 | 메서드 | 동작 설명 |
| :-: | :--- | :--- | :--- | :--- |
| 26 | `PATCH` | `/{id}/increment` | `adjustNumericField` | 클라이언트의 읽기-수정-쓰기 경쟁 상태 없이 숫자 필드에 원자적 증감 델타를 적용합니다. |
| 27 | `POST` | `/{id}/transition` | `transitionState` | 검증된 @StateMachine 전이를 targetState로 실행하고 감사/웹훅 이벤트를 발행합니다. |
| 28 | `POST` | `/{id}/clone` | `cloneEntity` | 새 UUIDv7 ID를 발급하고 @AutoCode 필드를 재생성하여 엔티티를 복제합니다. |
| 29 | `GET` | `/events` (`@Hidden`) | `streamEvents` | Server-Sent Events(SSE) 실시간 스트림입니다(text/event-stream MIME으로 인해 Swagger UI에서 @Hidden). |
| 30 | `GET` | `/ai/context` | `getAiContext` | 필드 및 필터 연산자를 설명하는 LLM용 JSON 도구 스키마를 내보냅니다. |
| 31 | `POST` | `/ai/query` | `queryAi` | 자연어 프롬프트를 제한된 파라미터화 JPA Criteria 안전 쿼리로 변환합니다. |
| 32 | `GET` | `/human-policy` | `getPolicySummary` | 컴파일된 @HumanPolicy 수명 주기 전이, RBAC 역할 및 YAML 재정의를 반환합니다. |
| 33 | `GET` | `/health` | `getEntityHealth` | 엔티티별 데이터베이스 테이블 상태와 레코드 건수를 점검합니다. |
| 34 | `PATCH` | `/{id}/patch-rfc6902` | `patchRfc6902` | 구조화된 RFC 6902 JSON Patch 연산(replace, add, remove)을 적용합니다. |
| 35 | `GET` | `/{id}/diff` | `compareEntityDiff` | 두 엔티티 레코드(id vs targetId) 간의 필드별 차이를 계산합니다. |
| 36 | `GET` | `/{id}/**` | `navigateSubResources` | 재귀적 하위 리소스 탐색 기능입니다(@AutoRestController(enableNestedSubResources = true)로 활성화). |

### 그룹 4: CSV 및 JSONL 대량 내보내기/가져오기 (`AutoExportImportApi` — 4개 계약)

| # | HTTP | 하위 경로 | 메서드 | 동작 설명 |
| :-: | :--- | :--- | :--- | :--- |
| 37 | `GET` | `/export/csv` | `exportCsv` | 필터링된 엔티티를 RFC-4180 표준 CSV 형식으로 내보냅니다. |
| 38 | `GET` | `/export/jsonl` | `exportJsonl` | 조건에 맞는 행을 줄바꿈 구분 JSON(application/x-ndjson) 형식으로 스트리밍합니다. |
| 39 | `POST` | `/import/csv` | `importCsv` | RFC-4180 CSV 원문 본문 페이로드를 청크 배치로 가져옵니다. |
| 40 | `POST` | `/import/jsonl` | `importJsonl` | 줄바꿈 구분 NDJSON 데이터셋을 스트리밍 방식으로 가져옵니다. |

---

## 2. 내장 플랫폼 컨트롤러

| 엔드포인트 / 접두사 | 컨트롤러 | 역할 및 프로덕션 잠금 |
| :--- | :--- | :--- |
| `GET /system/studio` (`@Hidden`) | `DevStudioController` | 20개 언어 Developer Studio(RTL `ar`, `fa`, `ur`); `app.framework.studio.enabled=false` 시 `401` 반환 |
| `GET /system/studio/eject` | `DevEjectionController` | 표준 Spring MVC Controller/Service/Repository 소스 코드 내보내기; `SurfaceAccessGuardrailUtil` 보호 |
| `POST /api/v1/auth/token` | `AuthController` | 개발용 HMAC-SHA512 JWT 발급; `demo-token-endpoint-enabled=false` 시 `404` 반환 |
| `/api/v1/storage/*` | `FileStorageController` | `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `POST /presigned-url` (`LOCAL` / `S3` / `GCS`) |
| `/api/v1/graphql*` | `GraphQLDynamicApiController` | `GET /schema`, `POST ""`, `GET /explorer` (`@Hidden`) |
| `GET /api/v1/system/time-travel/{entityName}/{id}` | `TimeTravelDynamicApiController` | 지정 ISO-8601 UTC 시점의 엔티티 상태 복원(Time-Travel) |
| `GET /api/v1/system/customizers` | `CustomizerTelemetryApiController` | `7`개 핵심 텔레메트리 `*Customizer` 그룹의 활성 SPI 빈 조회(`StorageCustomizer`는 `StorageCustomizerRegistryHelper` 관리, 총 `8`개 SPI) |
| `GET /api/v1/system/circuit-breakers` | `CircuitBreakerTelemetryApiController` | 실시간 Resilience4j 서킷 브레이커 상태 메트릭 |
| `GET /api/v1/system/databases/health` | `MultiDatabaseHealthCheckController` | 다중 데이터소스 상태 점검 |
| `GET /api/v1/system/trace-context` | `TraceContextSystemApiController` | 활성 MDC 컨텍스트의 W3C `traceparent` 및 UUIDv7 `X-Request-ID` |
| `GET/POST /error` (`@Hidden`) | `CustomContainerErrorController` | Tomcat 컨테이너 오류(`400/404/405/413/431/500`)를 표준 `ApiResponse<Void>`로 변환 |
