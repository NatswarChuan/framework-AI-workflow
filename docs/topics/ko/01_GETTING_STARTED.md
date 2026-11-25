# 01. 빠른 시작, 2-디렉터리 계약 및 Fail-Fast 기동 진단 (`0.1.0`)

> **언어**: **한국어** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#quickstart)

---

## 1. 엄격한 2-디렉터리 도메인 계약 (`entity/` & `controller/`)

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** 기반 Spring Boot 애플리케이션은 비즈니스 도메인을 두 개의 디렉터리로 깔끔하게 구성합니다:

1. `entity/`: `BaseAuditEntity`(내장 UUIDv7 기본 키 및 `@Version` 낙관적 락 포함)를 상속하는 JPA 엔티티. Bean Validation(`jakarta.validation.constraints.*`), B-Tree 인덱스, 선언적 애노테이션(`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`)을 선언합니다.
2. `controller/`: `@AutoRestController`를 부착하고 `AutoApiController<E>` 또는 `AutoReadApi<E>` 같은 조합형 하위 인터페이스를 상속하는 마커 인터페이스(표준 Spring MVC의 `@RequestBody`/`@RequestParam`/`@PathVariable`도 함께 지원).

일반 CRUD를 넘어서는 도메인 워크플로는 `Service` 인터페이스와 독립적인 Spring `@Service` / `@Component` `public final class` `Helper` 빈에 분리하고 `@CustomEndpoint` 또는 `@ServiceOverride`로 연결합니다(`@AutoService` / `@AutoComponent`는 `"io.github.natswarchuan"`만 스캔하며, 엔티티가 `io.github.natswarchuan`, `com.example`, `io.github` 밖에 있으면 `@EntityScan`을 추가해야 합니다).

---

## 2. Maven 및 Gradle 설정 (`pom.xml` / `build.gradle.kts`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>0.1.0</version>
  </dependency>
</dependencies>
```

[JitPack](https://jitpack.io)을 통해 GitHub 릴리스를 직접 사용하려면:

```xml
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.1.0</version>
  </dependency>
</dependencies>
```

---

## 3. 프로덕션 기본 설정 (`application.yml`)

`spring-boot-configuration-processor`는 `META-INF/spring-configuration-metadata.json`(`app.framework.*` 및 `spring-nwvmc.human-policies` 아래 `20`개 `*Properties` 모델, `16`개 `@AutoConfigurationBean`/`@ConfigurationProperties` 클래스 기반 `18`개 메타데이터 그룹)을 제공합니다. `ControllerToApiProperties`의 레거시 필드는 기동 호환성 검증용으로 유지되며 실제 라우팅은 `@AutoRestController(basePath = ...)`, 쿼리 제한은 `app.framework.query-guardrails.*`가 제어합니다:

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false
```

---

## 4. 세밀한 엔드포인트 필터링 (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper`는 `AutoApiController<E>`의 정확한 메서드 이름과 대소문자 구분 없이 일치시킵니다(`equalsIgnoreCase(methodName)`, 예: `batchChunked`, `deleteById`, `importCsv`):

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 5. 기동 시 Fail-Fast 진단 (`StartupDiagnosticsUtil` & `EntityFailFastValidatorUtil`)

| 예외 | 발생 조건 | 해결 방법 |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()`가 JVM `< 21` 감지 | Java 21 LTS 이상에서 실행 |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true`이고 사용자 지정 `jwt-secret`이 `32` UTF-8 바이트 미만 | `${JWT_SECRET}`에 32바이트 이상의 비밀 키 설정 |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` 또는 `maxPageSize < 1` | `app.framework.query-guardrails.*`에 양의 정수 지정 |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` 또는 `ComputedFieldFailFastUtil`이 `@Id` 누락, 기본 생성자 누락 또는 잘못된 `@ComputedField` 원본 필드 감지 | `BaseAuditEntity` 상속, `@NoArgsConstructor` 유지 및 정확한 엔티티 필드명 일치 |
