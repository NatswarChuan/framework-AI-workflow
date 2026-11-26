# 04. Güvenlik, Çoklu Bulut Depolama, `@ServiceOverride`, Metrikler ve 20 Dilli i18n (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz (EN)](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#security-rbac)

---

## 1. NIST Seviye 2 Güvenlik, Veritabanı RBAC, Yüzey Kilitleme ve Tarayıcı Koruması

- **`@EntitySecurity`, `@FieldSecurity` ve `@MultiTenant`**: Bildirimsel tablo RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, özel meta-anotasyon desteği), sahiplik koruması (`ownerField`), hassas sütun maskeleme/null yapma (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) ve fail-closed `@MultiTenant` izolasyonu (kiracı yoksa `403`, oluşturmada sahtecilik önleme ve ID uç noktalarında IDOR denetimi).
- **Veritabanı Tabanlı Dinamik RBAC (`DynamicDatabaseRbacProviderHelper`)**: 4 JPA varlığını `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` ve işaretçileriyle etiketleyin. Açık `DENY` > `ALLOW` önceliği, `X-Tenant-ID` bağlamı, `DatabaseRbacCacheInvalidationListener` ile otomatik L1 Caffeine geçersiz kılma, `PureJavaSecurityFilterBridge` ile mevcut `SecurityFilterChain` uyumu ve `SecurityIdentityCustomizer` genişletmesi sağlar (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Varsayılan Güvenli Kilitleme (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: `app.framework.studio.enabled=false` (varsayılan) iken kimliksiz `/system/**` çağrıları `401` ile, kapalı Studio yüzeyleri `404 Not Found` (`403` yetkisiz yönetici) ile reddedilir; `demo-token-endpoint-enabled=false` iken `POST /api/v1/auth/token` `404` döner.
- **Hata Açma ve Temizleme**: `ExceptionCauseUnwrapperUtil` tam kök nedeni sunucuda günlüklerken istemciye temizlenmiş `ApiResponse<Void>` döndürür.
- **SPA ve İdempotans CORS (`SecurityFilterChainBridge`)**: Yapılandırılabilir kaynak desenlerine (`*`) ek olarak `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` ve `X-Request-ID` başlıklarına izin verir.

---

## 2. `@ServiceOverride` Çıkış Kapısı ve Standart MVC Kod Çıkarımı (`GET /system/studio/eject`)

Tekil uç noktalar dinamik CRUD kapsamını aştığında:

1. **Yerinde `@ServiceOverride`**: `AutoApiController<E>` üzerindeki herhangi bir metoda `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` ekleyerek `EscapeHatchDispatchHelper` ve `MethodHandleCacheUtil` üzerinden özel Spring bean’e yönlendirin.
2. **Standart Kod Çıkarımı (`/system/studio/eject`)**: `GET /system/studio/eject?target=<EntityOrControllerName>` çağrısıyla `ControllerEjectionHelper` üzerinden 5 bağımsız Spring MVC dosyası (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) dışa aktarın.

---

## 3. Micrometer Gözlemlenebilirliği (`DynamicEntityMetricsHelper` ve `MetricConstant` — 11 Metrik)

| Metrik | Tür | Etiketler | Kapsam |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Dinamik varlık CRUD çağrıları |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Uçtan uca yürütme gecikmesi |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Dinamik proxy denetleyici gecikmesi |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag değerlendirme sonucu (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | İşlemsel outbox bekleyen olay sayısı |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Outbox toplu gönderim gecikmesi |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Durum kodu (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Kayan pencere kotasını aşan reddedilmiş istekler |
| `framework.outbox.dispatched.total` | Counter | — | Başarıyla gönderilen toplam outbox olayları |
| `framework.realtime.active.connections` | Gauge | — | Etkin SSE bağlantıları (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant veri kaynağı yönlendirme sayacı (isteğe bağlı) |

---

## 4. 20 Dilli `/system/studio`, RTL Desteği ve Ana Uygulama Yerelleştirmesi (`i18n/`)

- **20 Yerleşik Dil (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` için `dir="rtl"`).
- **Deterministik Dil Çözümlemesi (`LocaleResolutionUtil` ve `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG` çerezi -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Tanınmayan etiketler güvenle `en` diline düşer.
- **Ana Uygulama Özelleştirmesi**: `I18nConfig`, UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`) yapılandırır; `app.framework.studio.show-i18n-diagnostics=true` etkinleştirildiğinde `/system/studio` içinde tanılama çubuğu görünür.

---

## 5. JMH `1.37` Mikro Kıyaslama İş Hacmi (`DynamicProxyThroughputBenchmarkTest`)

| Yönlendirme Yolu (`ops/ms`) | Ölçülen Ortalama İş Hacmi |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. Çoklu Bulut Dosya Depolama (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

Yerleşik `FileStorageController` (`/api/v1/storage/*`) `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` ve `POST /presigned-url` uç noktalarını `app.framework.storage.provider` (`LOCAL`/`S3`/`GCS`) ile sunar.

> **Üretim Güvenliği:** `app.framework.security.require-authenticated-api-paths: true` ayarını açın ve `SecurityFilterChain` içinde `/api/v1/storage/**` yolunu koruyun.
