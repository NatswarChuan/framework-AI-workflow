# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :--- |
| `0.1.x` | Supported |
| `< 0.1.0` (`0.0.x`) | End of support |

## Production Security Hardening Checklist

When deploying `io.github.natswarchuan:spring-nwvmc:0.1.0` in production:

1. **Configure a strong, shared JWT signing secret** via environment variable (**`>= 32` UTF-8 bytes** for HS256 / **`>= 64` UTF-8 bytes** for HS512; NEVER leave empty in multi-pod deployments or each JVM will generate an ephemeral per-pod CSPRNG key):
   ```yaml
   app:
     framework:
       security:
         enabled: true
         jwt-secret: ${JWT_SECRET}
         fail-fast-weak-jwt-secret: true
         default-deny-unannotated-entities: true
         require-authenticated-api-paths: true
   ```
   > **Important:** With `require-authenticated-api-paths: true`, Spring Security enforces authentication across `/api/v1/**` (including File Storage `/api/v1/storage/*`, GraphQL `/api/v1/graphql`, AI routes `/ai/query`, SSE `/events`, and `@CustomEndpoint` routes). Explicitly allowlist ONLY intentionally public read-only paths via a `SecurityIdentityCustomizer` bean.
2. **Disable development tooling, OpenAPI/Swagger, and optional attack surfaces in `application-prod.yml`:**
   ```yaml
   springdoc:
     api-docs:
       enabled: false
     swagger-ui:
       enabled: false

   app:
     framework:
       studio:
         enabled: false
         demo-token-endpoint-enabled: false
         show-i18n-diagnostics: false
         hide-framework-fingerprint: true
       storage:
         enabled: false            # Enable only with authentication, S3/GCS, and explicit allowed-extensions
       ai:
         enabled: false
         natural-language-query-enabled: false
   ```
3. **Restrict CORS & enforce `@MultiTenant` JWT claim parity:**
   - Restrict default `*` CORS origins to your approved frontend domains via `SecurityIdentityCustomizer`.
   - For `@MultiTenant` entities, `JwtAuthenticationFilter` reads `X-Tenant-ID` from the HTTP header; implement a `SecurityIdentityCustomizer` (or upstream auth filter) verifying the caller's signed JWT `tenantId` claim / DB tenant membership matches `X-Tenant-ID` to prevent cross-tenant header spoofing.
   - Always annotate ALL 4 DB-RBAC entities (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity`) with `@EntitySecurity(writeRoles = {"ROLE_SUPER_ADMIN"}, deleteRoles = {"ROLE_SUPER_ADMIN"})`.
4. **Configure query guardrails & multi-pod SPIs:**
   ```yaml
   app:
     framework:
       query-guardrails:
         max-join-depth: 3
         max-filter-criteria: 25
         max-page-size: 100
         max-unpaged-fetch-limit: 5000
   ```
   - For multi-pod Kubernetes deployments (`replicas > 1`), provide Redis/JDBC implementations of `DistributedLockProvider` and `IdempotencyStoreProvider` (`io.github.natswarchuan.module.idempotent.provider.IdempotencyStoreProvider`), as the built-in Caffeine stores are single-JVM only.

## Reporting a Vulnerability

Please report suspected security vulnerabilities privately by opening a **GitHub Security Advisory** on https://github.com/NatswarChuan/Spring-NWVMC/security/advisories/new rather than filing a public issue.

Include:
- Affected version and Spring Boot version
- Minimal entity/controller configuration reproducing the issue
- Observed vs expected HTTP status or security behavior

Reports are acknowledged within 48 hours, with coordinated disclosure after a patched release is available.
