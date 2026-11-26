# 03. 13개 동적 필터 연산자, Query Guardrails, Keyset O(1) 및 GraphQL SDL (`0.1.0`)

> **언어**: **한국어** | [English](../en/03_QUERY_AND_DATA_ACCESS.md) | [Tiếng Việt](../vi/03_QUERY_AND_DATA_ACCESS.md) | [日本語](../ja/03_QUERY_AND_DATA_ACCESS.md) | [中文](../zh/03_QUERY_AND_DATA_ACCESS.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼 (EN)](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#query-operators)

---

## 1. 13개 동적 필터 연산자 (`FilterOperatorConstant`)

모든 필터 쿼리 파라미터는 `QueryFilterParameterUtil`(`PATTERN_MALICIOUS_SQL`, `PATTERN_XSS`, `PATTERN_SAFE_FIELD_PATH`) 검증 후 파라미터화된 JPA Criteria 쿼리로 컴파일됩니다:

| 연산자 | URL 문법 | SQL 의미 | 설명 |
| :--- | :--- | :--- | :--- |
| `eq` | `status.eq=ACTIVE` | `= 'ACTIVE'` | 정확한 일치 비교(접미사 생략 시 기본 연산자, 예: status=ACTIVE). |
| `ne` | `status.ne=ARCHIVED` | `!= 'ARCHIVED'` | 지정한 값과 다른 레코드를 조회하는 불일치 필터. |
| `like` | `name.like=Server` | `LOWER(name) LIKE '%server%'` | 대소문자를 구분하지 않는 부분 문자열 일치(% 와일드카드). |
| `startsWith` | `code.startsWith=PRD-` | `LIKE 'PRD-%'` | B-Tree 인덱스를 활용할 수 있는 접두사 일치 검색. |
| `endsWith` | `email.endsWith=@corp.com` | `LIKE '%@corp.com'` | 문자열 끝부분과 일치하는 접미사 검색. |
| `gt` | `price.gt=100` | `> 100` | 숫자 또는 ISO-8601 타임스탬프 초과 비교. |
| `gte` | `price.gte=100` | `>= 100` | 기준값 이상 포함 비교. |
| `lt` | `stock.lt=50` | `< 50` | 기준값 미만 비교. |
| `lte` | `stock.lte=50` | `<= 50` | 최대 기준값 이하 비교. |
| `in` | `status.in=DRAFT,ACTIVE` | `IN ('DRAFT', 'ACTIVE')` | 쉼표로 구분된 후보 목록 중 하나와 일치합니다. |
| `notIn` | `status.notIn=DELETED,BANNED` | `NOT IN ('DELETED', 'BANNED')` | 쉼표로 구분된 제외 목록에 해당하는 레코드를 제외합니다. |
| `between` | `price.between=100,500` | `BETWEEN 100 AND 500` | 쉼표로 구분된 하한 및 상한을 포함하는 폐구간 범위 검색. |
| `null` | `deletedAt.null=true` | `IS NULL / IS NOT NULL` | true이면 SQL IS NULL, false이면 IS NOT NULL을 검사합니다. |

### 쿼리 DoS 가드레일 (`QueryGuardrailProperties` — `app.framework.query-guardrails`)

`QueryGuardrailEnforcerUtil`은 JPA 실행 전에 필터 조건과 정렬 경로를 사전 검증합니다:

- `max-join-depth`(기본 `3`): 점으로 구분된 연관 관계 조인 최대 깊이 제한.
- `max-filter-criteria`(기본 `25`): 단일 요청당 최대 필터 조건 수 제한.
- `max-page-size`(기본 `200`): 페이지당 최대 레코드 수 제한.
- `max-unpaged-fetch-limit`(기본 `5000`): 비페이징 `GET /all` 요청의 OOM 방지 상한.
- `eager-fetch-singular-relations`(기본 `true`): `?expand=` 미지정 시 단일 연관 관계를 `LEFT JOIN FETCH`로 선로딩.
- `allowed-filter-fields` & `allowed-sort-fields`: 필터링/정렬 허용 필드를 제한하는 선택적 화이트리스트.

---

## 2. O(1) 커서 Keyset 페이지네이션 (`GET /keyset`)

기본 키가 시간순 단조 증가 **UUIDv7**이므로 `/keyset`은 `dir=asc` 및 `dir=desc` 양방향에서 `size + 1` 프로브로 `O(1)` 시간에 커서 경계로 바로 이동합니다:

```bash
curl "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=019a0b12-3456-7000-8000-000000000001&dir=desc&size=20&fields=id,skuCode,productName,retailPrice" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. 무상태 JPA 영속성, `@Version` 및 비파괴 희소 필드 선택

- **`spring.jpa.open-in-view=false`, `?expand=` 및 낙관적 락**: OSIV를 비활성화하고 선택적 `?expand=rel1,rel2`, `BaseAuditEntity`의 `@Version`(충돌 시 `409 Conflict`), `JpaAssociationReferenceUtil`의 분리된 FK 스텁 해석을 지원합니다.
- **`fields=id,skuCode,productName,retailPrice`**: `DynamicSchemaProjectionHelper` 내부에서 `EntityCloneSnapshotHelper`를 사용하여 REST 및 GraphQL 부분 프로젝션이 Hibernate L1 캐시나 영속 엔티티를 변형하지 않습니다.

---

## 4. 동적 GraphQL 엔진 (`GraphQLDynamicApiController`)

| 엔드포인트 | HTTP | 기능 |
| :--- | :--- | :--- |
| `/api/v1/graphql/schema` | `GET` | 자동 생성된 GraphQL SDL(`list<Entity>s`, Object 및 Input 타입) 내보내기 |
| `/api/v1/graphql` | `POST` | 통합 쿼리 및 뮤테이션 실행 엔드포인트 |
| `/api/v1/graphql/explorer` | `GET` (`@Hidden`) | 인터랙티브 GraphiQL 플레이그라운드 |
