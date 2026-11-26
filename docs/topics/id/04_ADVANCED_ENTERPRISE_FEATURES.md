# 04. Keamanan, Penyimpanan Multi-Cloud, `@ServiceOverride`, Metrik & i18n 20 Bahasa (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap (EN)](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#security-rbac)

---

## 1. Keamanan NIST Level 2, RBAC Berbasis Database, Penguncian Permukaan & Anti-Scanner

- **`@EntitySecurity`, `@FieldSecurity` & `@MultiTenant`**: RBAC tabel deklaratif (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, mendukung meta-anotasi), penjagaan kepemilikan (`ownerField`), penyamaran/nullifikasi kolom (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), serta isolasi `@MultiTenant` fail-closed (`403` saat tenant kosong, penimpaan anti-spoofing saat create, dan pencegahan IDOR pada endpoint ID).
- **RBAC Dinamis Berbasis Database (`DynamicDatabaseRbacProviderHelper`)**: Tandai 4 entitas JPA dengan `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, dan `@SecurityPolicyEntity` beserta markernya. Menerapkan prioritas eksplisit `DENY` > `ALLOW`, konteks `X-Tenant-ID`, invalidasi otomatis L1 Caffeine melalui `DatabaseRbacCacheInvalidationListener`, koeksistensi non-destruktif `SecurityFilterChain` lewat `PureJavaSecurityFilterBridge`, serta ekstensi via `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Penguncian Aman Bawaan (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Saat `app.framework.studio.enabled=false` (default), `SecurityExposurePolicyBridge` memblokir `/system/**` tanpa autentikasi dengan `401` dan `StartupDiagnosticsUtil` menolak Studio nonaktif dengan `404 Not Found` (`403` tanpa izin admin); saat `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` mengembalikan `404`.
- **Pembongkaran & Sanitasi Galat**: `ExceptionCauseUnwrapperUtil` mencatat penyebab internal lengkap di log server sambil mengembalikan `ApiResponse<Void>` yang aman ke klien.
- **CORS SPA & Idempotensi (`SecurityFilterChainBridge`)**: Mengizinkan pola asal yang dapat dikonfigurasi (`*`) bersama header `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent`, dan `X-Request-ID`.

---

## 2. Jalur Keluar `@ServiceOverride` & Ejeksi MVC Standar (`GET /system/studio/eject`)

Saat endpoint tertentu melampaui semantik CRUD dinamis:

1. **`@ServiceOverride` di Tempat**: Anotasikan metode apa pun pada `AutoApiController<E>` dengan `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` agar `EscapeHatchDispatchHelper` mendelegasikan langsung via `MethodHandleCacheUtil`.
2. **Ejeksi Kode Standar (`/system/studio/eject`)**: Panggil `GET /system/studio/eject?target=<EntityOrControllerName>` untuk mengekspor 5 berkas Spring MVC mandiri (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) melalui `ControllerEjectionHelper`.

---

## 3. Observabilitas Micrometer (`DynamicEntityMetricsHelper` & `MetricConstant` — 11 Metrik)

| Metrik | Tipe | Tag | Cakupan |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Total pemanggilan CRUD entitas dinamis |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Latensi eksekusi ujung-ke-ujung |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latensi controller proxy dinamis |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Hasil evaluasi ETag `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Antrean peristiwa outbox transaksional tertunda |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Latensi pengiriman batch outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Kode status (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Permintaan ditolak karena melampaui kuota sliding-window |
| `framework.outbox.dispatched.total` | Counter | — | Total kumulatif peristiwa outbox yang berhasil terkirim |
| `framework.realtime.active.connections` | Gauge | — | Koneksi SSE aktif (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Penghitung opsional perutean datasource Primary / Replica / Tenant |

---

## 4. `/system/studio` 20 Bahasa, Dukungan RTL & Lokalisasi Host (`i18n/`)

- **20 Bahasa Bawaan (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` mengaktifkan `dir="rtl"`).
- **Resolusi Bahasa Deterministik (`LocaleResolutionUtil` & `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Kode tak dikenal otomatis kembali aman ke `en`.
- **Kustomisasi Aplikasi Host**: `I18nConfig` mengatur UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`); mengaktifkan `app.framework.studio.show-i18n-diagnostics=true` menampilkan bilah diagnostik di `/system/studio`.

---

## 5. Throughput Microbenchmark JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Jalur Dispatch (`ops/ms`) | Throughput Rata-Rata Terukur |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. Penyimpanan Multi-Cloud (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

`FileStorageController` (`/api/v1/storage/*`) menyediakan `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}`, dan `POST /presigned-url` dengan `app.framework.storage.provider` (`LOCAL`/`S3`/`GCS`) serta `StorageCustomizer`.

> **Pengamanan Produksi:** Aktifkan `app.framework.security.require-authenticated-api-paths: true` dan lindungi `/api/v1/storage/**` di `SecurityFilterChain`.
