# 04. 보안, 멀티클라우드 스토리지, `@ServiceOverride`, 메트릭 및 20개 언어 i18n (`0.1.0`)

> **언어**: **한국어** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#security-rbac)

---

## 1. NIST Level 2 보안, DB 기반 동적 RBAC, 표면 잠금 및 스캐너 방어

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: 선언적 테이블 RBAC(`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, 커스텀 메타 애노테이션 합성 지원), 소유자 격리(`ownerField`), 민감 컬럼 마스킹/null 처리(`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), 실패-닫힘 `@MultiTenant` 격리(테넌트 누락 시 `403`, 생성 시 위조 덮어쓰기, 단일 ID 엔드포인트 IDOR 검증).
- **DB 기반 동적 RBAC (`DynamicDatabaseRbacProviderHelper`)**: 4개 JPA 엔티티에 `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` 및 마커를 지정합니다. 명시적 `DENY` > `ALLOW` 우선순위, `X-Tenant-ID` 테넌트 컨텍스트, `DatabaseRbacCacheInvalidationListener`의 L1 Caffeine 자동 무효화, `PureJavaSecurityFilterBridge`의 비파괴 `SecurityFilterChain` 공존, `SecurityIdentityCustomizer` 확장을 지원합니다(`app.framework.security.dynamic-database-rbac-enabled=true`).
- **기본 보안 잠금 (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: `app.framework.studio.enabled=false`(기본값) 시 미인증 `/system/**` 요청은 `401`로 차단되며 비활성 Studio는 `404 Not Found`(권한 부족 시 `403`)를 반환합니다. `demo-token-endpoint-enabled=false` 시 `POST /api/v1/auth/token`은 `404`를 반환합니다.
- **오류 언래핑 및 정제**: `ExceptionCauseUnwrapperUtil`은 서버 로그에 전체 원인을 기록하고 클라이언트에는 정제된 `ApiResponse<Void>`만 반환합니다.
- **SPA 및 멱등성 CORS (`SecurityFilterChainBridge`)**: 구성 가능한 오리진 패턴(`*`)과 `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, `X-Request-ID` 헤더를 허용합니다.

---

## 2. `@ServiceOverride` 탈출구 및 표준 MVC 코드 추출 (`GET /system/studio/eject`)

개별 엔드포인트가 동적 CRUD 범위를 넘어설 때:

1. **인플레이스 `@ServiceOverride`**: `AutoApiController<E>` 메서드에 `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)`를 선언하면 `EscapeHatchDispatchHelper`가 `MethodHandleCacheUtil`로 커스텀 Spring 빈에 직접 위임합니다.
2. **표준 코드 추출 (`/system/studio/eject`)**: `GET /system/studio/eject?target=<EntityOrControllerName>` 호출 시 `ControllerEjectionHelper`가 5개의 독립 표준 Spring MVC 파일(`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`)을 내보냅니다.

---

## 3. Micrometer 관측성 (`DynamicEntityMetricsHelper` & `MetricConstant` — 11개 메트릭)

| 메트릭 | 유형 | 태그 | 측정 범위 |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | 동적 엔티티 CRUD 호출 총횟수 |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | 종단 간 실행 지연 시간 |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | 동적 프록시 컨트롤러 지연 시간 |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag 평가 결과 (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | 트랜잭션 Outbox 대기 이벤트 수 |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Outbox 배치 발송 지연 시간 |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | 상태 코드 (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | 슬라이딩 윈도우 한도 초과로 거부된 요청 수 |
| `framework.outbox.dispatched.total` | Counter | — | 정상 발송 완료된 Outbox 이벤트 누적 수 |
| `framework.realtime.active.connections` | Gauge | — | 활성 SSE 이미터 연결 수 (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant별 데이터소스 라우팅 횟수 (선택 활성) |

---

## 4. 20개 언어 `/system/studio`, RTL 지원 및 호스트 현지화 (`i18n/`)

- **20개 내장 로케일 (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur`는 `dir="rtl"` 자동 활성화).
- **결정적 로케일 해석 (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG` 쿠키 -> `Accept-Language` -> `app.framework.i18n.default-locale`(`en`). 미인식 태그는 안전하게 `en`으로 폴백합니다.
- **호스트 앱 메시지 커스터마이징**: `I18nConfig`는 UTF-8 `ReloadableResourceBundleMessageSource`(`classpath:i18n/messages`, `cacheSeconds=3600`)를 구성하며, `app.framework.studio.show-i18n-diagnostics=true` 설정 시 `/system/studio`에 진단 바를 표시합니다.

---

## 5. JMH `1.37` 마이크로벤치마크 처리량 (`DynamicProxyThroughputBenchmarkTest`)

| 디스패치 경로 (`ops/ms`) | 측정 평균 처리량 |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
