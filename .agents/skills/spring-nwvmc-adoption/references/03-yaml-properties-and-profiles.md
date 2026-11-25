# Spring-NWVMC (`v0.1.0`) — Exact YAML Configuration Properties & Profiles

> **100% Verified 1:1** against `controller-to-api-framework/src/main/java/io/github/natswarchuan/config/properties/*.java`.
> Use ONLY these exact keys under `app.framework.*` and `spring-nwvmc.human-policies.*`.

---

## 1. Secure Production Baseline (`src/main/resources/application.yml`)

Copy-paste ready baseline with Java 21 Virtual Threads, safe HikariCP/JPA defaults, query guardrails, locked-down Dev Studio, and fail-fast JWT entropy enforcement:

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
    url: jdbc:h2:mem:appdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: update
    open-in-view: false
    properties:
      hibernate:
        default_batch_fetch_size: 50
        jdbc:
          batch_size: 50
        order_inserts: true
        order_updates: true

app:
  framework:
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
      jwt-secret: ${JWT_SECRET}           # MUST be >= 32 UTF-8 bytes in production!
      jwt-expiration-seconds: 86400
      fail-fast-weak-jwt-secret: true     # ALWAYS true in prod!
      default-deny-unannotated-entities: false
      require-authenticated-api-paths: false

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
      type: CAFFEINE                      # CAFFEINE | REDIS | TWO_TIER | SIMPLE | NONE
      caffeine:
        initial-capacity: 100
        maximum-size: 5000
        expire-after-write-minutes: 10
      redis:
        time-to-live-seconds: 600
        key-prefix: "nwvmc:"
        cache-null-values: false

    storage:
      enabled: true
      provider: LOCAL                     # LOCAL | S3 | GCS
      max-file-size: 52428800             # 50 MB
      allowed-extensions: []              # e.g. [png, jpg, pdf, csv, txt]
      local:
        base-dir: target/uploads
        create-dir-if-missing: true
        url-prefix: /api/v1/storage/download/

    realtime:
      sse-enabled: true
      heartbeat-seconds: 15
      max-emitters-per-entity: 1000

    ai:
      enabled: true
      natural-language-query-enabled: true

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

> **Dynamic GraphQL Note:** `GET /api/v1/graphql/schema` and `POST /api/v1/graphql` activate **automatically** whenever `spring-nwvmc` is on the classpath — no extra `app.framework.graphql.*` YAML key is required.

---

## 2. Multi-Datasource (`PRIMARY` + `REPLICA`) YAML & Registration

When using `@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)` and `GET /api/v1/system/databases/health`, declare your own `@ConfigurationProperties` for both pools and wire them into `DynamicRoutingDataSource` + `MultiPlatformDataSourceRegistryHelper` (see `04-cookbook-verified-patterns.md` Recipe 4b):

```yaml
app:
  datasource:
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
    maximum-pool-size: 20
    primary-url: jdbc:h2:mem:novamart_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    replica-url: jdbc:h2:mem:novamart_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
```

---

## 3. Local Development Profile (`src/main/resources/application-dev.yml`)

Enable Dev Studio and demo JWT minting **strictly** in `dev`:

```yaml
app:
  framework:
    security:
      fail-fast-weak-jwt-secret: false
    studio:
      enabled: true
      demo-token-endpoint-enabled: true
      show-i18n-diagnostics: true
      hide-framework-fingerprint: true
```

Run locally with:
```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

---

## 3. Cloud Storage Profiles (`S3` / MinIO & `GCS`)

```yaml
# Amazon S3 or MinIO (application-prod.yml)
app:
  framework:
    storage:
      provider: S3
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

## 4. Natural-Language Policy Overrides (`spring-nwvmc.human-policies.*`)

Bound by `HumanPolicyConfigurationProperties` — lets ops/business teams adjust lifecycle, RBAC, and masking without recompiling Java:

```yaml
spring-nwvmc:
  human-policies:
    SubscriptionContract:
      lifecycle: "Starts at DRAFT. From DRAFT can transition to ACTIVE or CANCELLED. From ACTIVE can transition to SUSPENDED or EXPIRED. Allow deletion only when DRAFT or CANCELLED."
      security: "Allow read for USER, ADMIN, OPERATOR. Allow write for OPERATOR, ADMIN. Allow delete for SUPER_ADMIN."
      masking: "Mask recurringAmount for USER. Nullify clientTaxNumber for non-ADMIN."
```
