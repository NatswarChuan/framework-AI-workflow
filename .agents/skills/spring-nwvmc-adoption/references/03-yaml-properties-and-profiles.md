# Spring-NWVMC (`0.1.0`) — Exact YAML Configuration Properties & Profiles

> **100% Verified 1:1** against `controller-to-api-framework/src/main/java/io/github/natswarchuan/config/properties/*.java`.
> Use ONLY these exact keys under `app.framework.*` and `spring-nwvmc.human-policies.*`.

---

## 1. Hardened Production Baseline (`src/main/resources/application.yml`)

Copy-paste production baseline with Java 21 Virtual Threads, externalized PostgreSQL + `ddl-auto: validate` (Flyway/Liquibase), query guardrails, locked-down Dev Studio, fail-closed security (`default-deny-unannotated-entities: true`, `require-authenticated-api-paths: true`), disabled Springdoc, and fail-fast JWT entropy enforcement:

```yaml
server:
  port: 8080
  compression:
    enabled: true
    mime-types: application/json,text/plain,text/csv,application/xml
    min-response-size: 1024

spring:
  application:
    name: my-nwvmc-app
  threads:
    virtual:
      enabled: true
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/appdb}
    username: ${DB_USERNAME:appuser}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate                  # ALWAYS validate + Flyway/Liquibase in prod (NEVER update!)
    open-in-view: false
    properties:
      hibernate:
        default_batch_fetch_size: 50
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true

springdoc:
  api-docs:
    enabled: false                        # ALWAYS disable OpenAPI/Swagger in prod unless behind internal VPN/auth
  swagger-ui:
    enabled: false

app:
  framework:
    # Compatibility fields (live base paths use @AutoRestController(basePath = ...)):
    base-path-prefix: /api/v1
    default-page-size: 20
    max-page-size: 100
    eager-fetch-singular-relations: true

    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
      # Optional allowlists (empty = allow entity fields):
      # allowed-filter-fields: [id, skuCode, productName, category, retailPrice, active]
      # allowed-sort-fields: [id, createdAt, retailPrice, productName]

    security:
      enabled: true
      data-masking-enabled: true
      row-level-security-enabled: true
      dynamic-database-rbac-enabled: true
      database-rbac-cache-ttl-seconds: 60
      jwt-secret: ${JWT_SECRET}           # Shared across pods! >= 32 UTF-8 bytes (HS256) / >= 64 bytes (HS512)
      jwt-expiration-seconds: 86400
      fail-fast-weak-jwt-secret: true     # ALWAYS true in prod!
      default-deny-unannotated-entities: true   # Fail-closed: reject entities missing @EntitySecurity
      require-authenticated-api-paths: true     # Fail-closed: require auth on /api/v1/** (allowlist public GETs via SecurityIdentityCustomizer)

    studio:
      enabled: false                      # ALWAYS false in prod!
      demo-token-endpoint-enabled: false  # ALWAYS false in prod!
      show-i18n-diagnostics: false
      hide-framework-fingerprint: true

    aop:
      audit-trail-enabled: true
      idempotency-enabled: true
      execution-profiling-enabled: true
      slow-execution-threshold-ms: 500
      idempotency-ttl-seconds: 300

    cache:
      type: CAFFEINE                      # CAFFEINE (single-JVM) | REDIS | TWO_TIER (multi-pod) | SIMPLE | NONE
      caffeine:
        initial-capacity: 100
        maximum-size: 5000
        expire-after-write-minutes: 10
      redis:
        time-to-live-seconds: 600
        key-prefix: "nwvmc:"
        cache-null-values: false

    storage:
      enabled: false                      # Enable ONLY when authenticated & restricted to allowed-extensions + S3/GCS!
      provider: LOCAL                     # LOCAL | S3 | GCS
      max-file-size: 52428800             # 50 MB
      allowed-extensions: [png, jpg, pdf, csv, txt]
      local:
        base-dir: target/uploads
        create-dir-if-missing: true
        url-prefix: /api/v1/storage/download/

    realtime:
      sse-enabled: true
      heartbeat-seconds: 15
      max-emitters-per-entity: 1000

    ai:
      enabled: false                      # Enable ONLY with require-authenticated-api-paths: true & scoped controllers
      natural-language-query-enabled: false

    i18n:
      default-locale: en
      cache-seconds: 3600

    date-time:
      default-timezone: UTC
      enable-header-timezone: true

    sub-resource:
      enabled-by-default: false           # Opt-in per entity via @EnableNestedSubResource
      enabled-entities: []
```

> **Production Security Notes:**
> - **CORS Restriction:** `SecurityFilterChainBridge` permits `*` origins by default — restrict allowed origins via `SecurityIdentityCustomizer` in production.
> - **Dynamic GraphQL:** `GET /api/v1/graphql/schema` and `POST /api/v1/graphql` activate automatically whenever `spring-nwvmc` is on the classpath; `require-authenticated-api-paths: true` protects them at the filter layer.

---

## 2. Multi-Datasource (`PRIMARY` + `REPLICA`) YAML & Registration

When using `@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)` and `GET /api/v1/system/databases/health`, declare your own `@ConfigurationProperties` for both pools and wire them into `DynamicRoutingDataSource` + `MultiPlatformDataSourceRegistryHelper` (see `04-cookbook-verified-patterns.md` Recipe 4b):

```yaml
app:
  datasource:
    driver-class-name: org.postgresql.Driver
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    maximum-pool-size: 20
    primary-url: ${DB_PRIMARY_URL}
    replica-url: ${DB_REPLICA_URL}
```

---

## 3. Local Development Profile (`src/main/resources/application-dev.yml`)

Boots cleanly out of the box with H2, `ddl-auto: update`, Swagger UI, Dev Studio, demo JWT endpoint, and a dev-only fallback secret:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:devdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: update

springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: true

app:
  framework:
    security:
      jwt-secret: ${JWT_SECRET:DevOnlyLocalSecretKeyAtLeast32BytesLong!}
      fail-fast-weak-jwt-secret: false
      require-authenticated-api-paths: false
    studio:
      enabled: true
      demo-token-endpoint-enabled: true
      show-i18n-diagnostics: true
      hide-framework-fingerprint: true
    storage:
      enabled: true
    ai:
      enabled: true
      natural-language-query-enabled: true
```

Run locally with:
```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

---

## 4. Automated Test Profile (`src/test/resources/application-test.yml`)

Dedicated test profile used by `@ActiveProfiles("test")` in JUnit 5 / `MockMvc` / `RANDOM_PORT` TDD suites:

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: create-drop

springdoc:
  api-docs:
    enabled: true

app:
  framework:
    security:
      jwt-secret: TestOnlyJwtSecretKeyAtLeast32BytesLongForHs256!
      fail-fast-weak-jwt-secret: true
      default-deny-unannotated-entities: true
      require-authenticated-api-paths: false
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
    storage:
      enabled: true
    ai:
      enabled: true
      natural-language-query-enabled: true
```

---

## 5. Cloud Storage Profiles (`S3` / MinIO & `GCS`)

```yaml
# Amazon S3 or MinIO (application-prod.yml)
app:
  framework:
    storage:
      enabled: true
      provider: S3
      allowed-extensions: [png, jpg, pdf, csv]
      s3:
        bucket-name: ${S3_BUCKET}
        region: ${AWS_REGION:ap-southeast-1}
        access-key: ${AWS_ACCESS_KEY_ID}
        secret-key: ${AWS_SECRET_ACCESS_KEY}
        endpoint: ${S3_CUSTOM_ENDPOINT:}   # Optional for MinIO / LocalStack
        path-style-access: true
        presigned-url-ttl-seconds: 900

# Google Cloud Storage
# app.framework.storage.provider: GCS
# app.framework.storage.gcs.bucket-name: ${GCS_BUCKET}
# app.framework.storage.gcs.project-id: ${GCP_PROJECT_ID}
# app.framework.storage.gcs.credentials-path: ${GOOGLE_APPLICATION_CREDENTIALS}
# app.framework.storage.gcs.presigned-url-ttl-seconds: 900
```

---

## 6. Natural-Language Policy Overrides (`spring-nwvmc.human-policies.*`)

Bound by `HumanPolicyConfigurationProperties` — lets ops/business teams adjust lifecycle, RBAC, and masking without recompiling Java:

```yaml
spring-nwvmc:
  human-policies:
    SubscriptionContract:
      lifecycle: "Starts at DRAFT. From DRAFT can transition to ACTIVE or CANCELLED. From ACTIVE can transition to SUSPENDED or EXPIRED. Allow deletion only when DRAFT or CANCELLED."
      security: "Allow read for USER, ADMIN, OPERATOR. Allow write for OPERATOR, ADMIN. Allow delete for SUPER_ADMIN."
      masking: "Mask recurringAmount for USER. Nullify clientTaxNumber for non-ADMIN."
```
