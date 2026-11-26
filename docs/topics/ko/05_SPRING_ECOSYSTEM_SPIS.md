# 05. 8개 SPI Customizer 인터페이스, `@CustomEndpoint` 및 `@ServiceOverride` (`0.1.0`)

> **언어**: **한국어** | [English](../en/05_SPRING_ECOSYSTEM_SPIS.md) | [Tiếng Việt](../vi/05_SPRING_ECOSYSTEM_SPIS.md) | [日本語](../ja/05_SPRING_ECOSYSTEM_SPIS.md) | [中文](../zh/05_SPRING_ECOSYSTEM_SPIS.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼 (EN)](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#customizers)

---

## 1. 비침투형 SPI 확장 인터페이스 (`8` Customizers)

`io.github.natswarchuan.customization.customizer` 아래 모든 확장 훅은 `interface` `default` 메서드로 제공되어 프레임워크 내부 수정 없이 원하는 Spring 빈만 선택 재정의할 수 있습니다:

| # | SPI 인터페이스 | 컨텍스트 DTO | 확장 범위 |
| :-: | :--- | :--- | :--- |
| 1 | `SpringCoreCustomizer` | `CoreCustomizerContextDto` | 핵심 빈 컨테이너, `TaskExecutor`, 작업 스케줄링 |
| 2 | `PlatformAiCustomizer` | `PlatformAiCustomizerContextDto` | Spring AI `ChatClient` 프롬프트, 벡터 스토어 훅, RAG 파이프라인 |
| 3 | `SecurityIdentityCustomizer` | `SecurityCustomizerContextDto` | 커스텀 RBAC 평가기, OAuth2 클레임 매핑, 마스킹 규칙 |
| 4 | `DataAccessCustomizer` | `DataCustomizerContextDto` | 동적 JPA Criteria 훅, 다중 데이터소스 및 테넌트 라우팅 |
| 5 | `SpringCloudCustomizer` | `CloudCustomizerContextDto` | 분산 락, Resilience4j 서킷 브레이커, 재시도 및 CloudEvents |
| 6 | `MessagingIntegrationCustomizer` | `MessagingCustomizerContextDto` | Webhook HMAC 서명, WebSocket STOMP, 아웃바운드 REST 인터셉터 |
| 7 | `ArchitectureExtensionCustomizer` | `ArchitectureCustomizerContextDto` | 커스텀 엔드포인트, GraphQL 확장 및 i18n 커스터마이징 |
| 8 | `StorageCustomizer` | `StorageCustomizerContextDto` | `LOCAL`/`S3`/`GCS` 버킷 정책, 사전 서명 URL 및 업로드 한도 |

`7`개 핵심 텔레메트리 그룹(`CustomizerGroupConstant`)에 등록된 활성 빈은 `GET /api/v1/system/customizers`에서 조회할 수 있습니다(`StorageCustomizer`는 `StorageCustomizerRegistryHelper`가 별도 관리).


> **런타임 인터셉터 vs. 메타데이터/텔레메트리 훅(`0.1.0`):** `SecurityIdentityCustomizer`는 모든 요청에서 `SecurityFilterChainBridge`와 `SecurityAuthorityDecisionHelper`가 직접 실행합니다. 나머지 `7`개는 `GET /api/v1/system/customizers` 및 `StorageCustomizerRegistryHelper`용 메타데이터·텔레메트리 등록 훅입니다.

---

## 2. 커스텀 도메인 라우팅 (`@CustomEndpoint`) 및 탈출구 (`@ServiceOverride`)

### `@CustomEndpoint`로 커스텀 도메인 엔드포인트 정의

```java
@AutoRestController(basePath = "/api/v1/advanced-enterprise")
public interface AdvancedEnterpriseBusinessController extends AutoApiController<CustomerOrder> {

  @CustomEndpoint(
      path = "/checkout-cart",
      httpMethod = "POST",
      delegateBean = "advancedOrderCheckoutHelper",
      delegateMethod = "checkoutCart",
      summary = "Checkout customer cart atomically"
  )
  ApiResponse<CustomerOrder> checkoutCart(@Valid @AutoBody CartCheckoutRequestDto request);
}
```

### `@ServiceOverride`로 메서드 단위 탈출구 구현

```java
@AutoRestController(basePath = "/api/v1/tags")
public interface TagController extends AutoApiController<Tag> {

  @ServiceOverride(
      targetBean = TagEscapeHatchHelper.class,
      methodName = "buildTaxonomyStats",
      bypassAutoDispatch = true
  )
  @AutoGet("/showcase/escape-hatch-stats")
  ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
}
```

---

## 3. 아웃바운드 HTTP 클라이언트 (`ThirdPartyRestClientHelper`)

`ThirdPartyRestClientHelper`는 기본 Java 21 `java.net.http.HttpClient` 모드 또는 선택적 Spring 6 `RestClient`(`RestClientConfig`) 모드로 외부 HTTP 호출을 수행하며, 두 모드 모두 활성 MDC에서 `X-Request-ID`, W3C `traceparent`, `tracestate` 헤더를 자동 전파합니다.
