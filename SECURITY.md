# Security Policy

## Supported Versions

| Version | Supported |
| :--- | :--- |
| `0.0.x` | Supported |
| `0.0.x` | End of support |

## Production Security Hardening Checklist

When deploying `io.github.natswarchuan:spring-nwvmc` in production:

1. Set an explicit `>= 32`-byte HS512 signing secret via environment variable:
   ```yaml
   app:
     framework:
       security:
         jwt-secret: ${JWT_SECRET}
         fail-fast-weak-jwt-secret: true
   ```
2. Disable development tooling in `application-prod.yml`:
   ```yaml
   app:
     framework:
       studio:
         enabled: false
         demo-token-endpoint-enabled: false
         show-i18n-diagnostics: false
         hide-framework-fingerprint: true
   ```
3. Configure query guardrails according to tenant SLAs:
   ```yaml
   app:
     framework:
       query-guardrails:
         max-join-depth: 3
         max-filter-criteria: 25
         max-page-size: 100
   ```

## Reporting a Vulnerability

Please report suspected security vulnerabilities privately by opening a **GitHub Security Advisory** on `https://github.com/NatswarChuan/Spring-NWVMC/security/advisories/new` rather than filing a public issue.

Include:
- Affected version and Spring Boot version
- Minimal entity/controller configuration reproducing the issue
- Observed vs expected HTTP status or security behavior

Reports are acknowledged within 48 hours, with coordinated disclosure after a patched release is available.
