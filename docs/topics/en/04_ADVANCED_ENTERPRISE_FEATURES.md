# 04. Anti-Scanner Security, Multilingual `/system/studio`, Virtual Threads & Multi-Cloud Storage

> **Language**: English | [Tiếng Việt](../04_ADVANCED_ENTERPRISE_FEATURES.md) | [Complete Manual](../GUIDE_EN.md)

---

## 1. Adversarial Security & Anti-AI-Scanner Hardening

| Defense Mechanism | Enforcing Class | Configuration / Bound |
| :--- | :--- | :--- |
| **Default-Locked Studio & Demo Auth** | `DevStudioController`, `AuthController`, `SecurityExposurePolicyBridge` | Defaults `app.framework.studio.enabled=false` & `demo-token-endpoint-enabled=false`; returns HTTP `404` and omits `/system/**` from public Ant matchers |
| **64-Byte CSPRNG Key Rotation** | `StartupDiagnosticsUtil.validateAndHardenSecurity` | When demo auth is disabled and placeholder JWT key remains unchanged, generates an ephemeral 64-byte `SecureRandom` secret at startup |
| **Weak JWT Secret Blocking** | `StartupDiagnosticsUtil.assertJwtSecretEntropy` | `fail-fast-weak-jwt-secret=true` rejects custom secrets `< 32` UTF-8 bytes |
| **Constant-Time Verification** | `ConstantTimeComparisonUtil` | Wraps `MessageDigest.isEqual` for `@Idempotent` payload hashes and `@EntityWebhook` HMAC-SHA256 signatures (`WebhookHmacSignerHelper`) |
| **Sliding-Window Rate Limiting** | `RateLimitingFilter` | Bounded `10,000`-entry Caffeine cache: default `1,000 req/s`, tightened `20 req/s` on `/api/v1/auth/**` |
| **Path Traversal Blocking (`CWE-22`)** | `StoragePathSanitizerHelper` | Strips null bytes (`\0`), normalizes segments, and confines paths inside storage root |
| **OWASP HTTP Response Headers** | `SecurityHeadersPolicyBridge` | Enforces `X-Frame-Options: DENY`, `Content-Security-Policy`, `Permissions-Policy`, `Referrer-Policy`, and `Strict-Transport-Security` |

---

## 2. Multilingual `i18n`, `/system/studio` & Host Bundle Extension

1. **20 Built-In Locales (`I18nLocalizationProperties`)**: `en`, `zh`, `hi`, `es`, `fr`, `ar` (RTL), `bn`, `pt`, `ru`, `ur` (RTL), `id`, `de`, `ja`, `vi`, `ko`, `tr`, `it`, `th`, `fa` (RTL), `pl`. RTL (`dir="rtl"`) activates automatically in `/system/studio` for `ar`, `ur`, `fa`.
2. **Resolution Chain (`LocaleResolutionUtil.resolveBestMatchLocale`)**:
   `?lang=` -> `X-Language` header -> `NWVMC_LANG` cookie -> `Accept-Language` header (`MAX_ACCEPT_HEADER_LENGTH=256`, `MAX_ACCEPT_RANGES=8`) -> `app.framework.i18n.default-locale` (`en`).
3. **Key Validation & Bounded Diagnostics (`LocaleResolutionUtil` / `DevStudioDiagnosticsUtil`)**:
   - Enforces `^[A-Za-z0-9._-]+$` and max length `128` (`MAX_MESSAGE_CODE_LENGTH`); rejects `..` segments. Malformed tags such as `?lang=../../etc/passwd` normalize cleanly to `en`.
   - Translation cache caps at `8192` (`MAX_TRANSLATION_CACHE_SIZE`), and missing key diagnostics cap at `128` entries (`MAX_MISSING_KEY_RECORDS`) displayed in `#studioI18nDiagBar` when `show-i18n-diagnostics=true`.
4. **Extending in Host Applications**:
   - Define `src/main/resources/i18n/messages_{lang}.properties` entries to extend or override `/system/studio`, `error.*`, or `{validation...}` strings.
   - Construct `new MessageHelper(hostMessageSource)` in custom beans when integrating application-specific Spring `MessageSource` bundles.

---

## 3. Unified Multi-Cloud Storage (`FileStorageController`)

Configured via `app.framework.storage.provider` (`LOCAL`, `S3`, `GCS`), max payload `max-file-size` (`52428800` bytes = 50 MB):

- `POST /api/v1/storage/upload`
- `GET /api/v1/storage/download/{fileId}`
- `GET /api/v1/storage/metadata/{fileId}`
- `DELETE /api/v1/storage/{fileId}`
- `POST /api/v1/storage/presigned-url`
- `GET /api/v1/storage/exists/{fileId}`

---

## 4. Java 21 Virtual Threads, ETag & CDC Time-Travel

- **Virtual Threads + HikariCP**: Combining `spring.threads.virtual.enabled: true` with `spring.jpa.open-in-view: false` returns JDBC connections immediately after query execution prior to HTTP response serialization.
- **SSE Streaming & `RealtimeStreamingProperties`**: `@Hidden @AutoGet("/events")` governed by `heartbeat-seconds=15` and `max-emitters-per-entity=1000`.
- **HTTP ETag (`@HttpCacheable`) & `@Idempotent`**: Cuts redundant bandwidth via `304 Not Modified` and enforces atomic duplicate-request replay protection via `Idempotency-Key`.
- **Audit Time-Travel**: `GET /api/v1/system/time-travel/{entityName}/{id}?timestamp=...` reconstructs historical state in $O(K)$ via reverse CDC delta playback.
