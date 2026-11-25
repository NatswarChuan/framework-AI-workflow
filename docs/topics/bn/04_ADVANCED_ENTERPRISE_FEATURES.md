# 04. নিরাপত্তা, মাল্টি-ক্লাউড স্টোরেজ, `@ServiceOverride`, মেট্রিক্স ও ২০-ভাষা i18n (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#security-rbac)

---

## 1. NIST লেভেল ২ নিরাপত্তা, ডেটাবেস-চালিত RBAC, সারফেস লকডাউন ও অ্যান্টি-স্ক্যানার সুরক্ষা

- **`@EntitySecurity`, `@FieldSecurity` ও `@MultiTenant`**: ডিক্লারেটিভ টেবিল RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, মেটা-অ্যানোটেশন সমর্থনসহ), মালিকানা সুরক্ষা (`ownerField`), সংবেদনশীল কলাম মাস্কিং/নাল করা (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), এবং fail-closed `@MultiTenant` বিচ্ছিন্নতা (টেন্যান্ট না থাকলে `403`, তৈরির সময় অ্যান্টি-স্পুফিং এবং ID এন্ডপয়েন্টে IDOR যাচাই)।
- **ডেটাবেস-চালিত ডায়নামিক RBAC (`DynamicDatabaseRbacProviderHelper`)**: ৪টি JPA এনটিটিতে `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` ও মার্কার যোগ করুন। স্পষ্ট `DENY` > `ALLOW` অগ্রাধিকার, `X-Tenant-ID` কনটেক্সট, `DatabaseRbacCacheInvalidationListener` দিয়ে স্বয়ংক্রিয় L1 Caffeine ইনভ্যালিডেশন, `PureJavaSecurityFilterBridge` দিয়ে বিদ্যমান `SecurityFilterChain` সহাবস্থান এবং `SecurityIdentityCustomizer` সম্প্রসারণ দেয় (`app.framework.security.dynamic-database-rbac-enabled=true`)।
- **ডিফল্ট নিরাপদ লকডাউন (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: `app.framework.studio.enabled=false` (ডিফল্ট) থাকলে অননুমোদিত `/system/**` কল `401` পায় এবং নিষ্ক্রিয় Studio `404 Not Found` (`403` অ্যাডমিন স্কোপ না থাকলে) ফেরত দেয়; `demo-token-endpoint-enabled=false` হলে `POST /api/v1/auth/token` `404` ফেরত দেয়।
- **ত্রুটি আনর্যাপিং ও স্যানিটাইজেশন**: `ExceptionCauseUnwrapperUtil` সার্ভারে সম্পূর্ণ কারণ লগ করে এবং ক্লায়েন্টকে নিরাপদ `ApiResponse<Void>` পাঠায়।
- **SPA ও আইডেম্পটেন্সি CORS (`SecurityFilterChainBridge`)**: কনফিগারযোগ্য অরিজিন প্যাটার্ন (`*`)-এর সাথে `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` ও `X-Request-ID` অনুমোদন করে।

---

## 2. `@ServiceOverride` এস্কেপ হ্যাচ ও স্ট্যান্ডার্ড MVC কোড ইজেকশন (`GET /system/studio/eject`)

কোনো নির্দিষ্ট এন্ডপয়েন্ট ডায়নামিক CRUD-এর সীমা অতিক্রম করলে:

1. **ইন-প্লেস `@ServiceOverride`**: `AutoApiController<E>`-এর যেকোনো মেথডে `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` বসিয়ে `EscapeHatchDispatchHelper` ও `MethodHandleCacheUtil` দিয়ে কাস্টম Spring বিনে কল পাঠান।
2. **স্ট্যান্ডার্ড কোড ইজেকশন (`/system/studio/eject`)**: `GET /system/studio/eject?target=<EntityOrControllerName>` কল করে `ControllerEjectionHelper` দিয়ে ৫টি স্বতন্ত্র Spring MVC ফাইল (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) এক্সপোর্ট করুন।

---

## 3. Micrometer অবজারভেবিলিটি (`DynamicEntityMetricsHelper` ও `MetricConstant` — ১১টি মেট্রিক)

| মেট্রিক | ধরন | ট্যাগ | পরিসর |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | ডায়নামিক এনটিটি CRUD কল সংখ্যা |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | এন্ড-টু-এন্ড এক্সিকিউশন লেটেন্সি |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | ডায়নামিক প্রক্সি কন্ট্রোলার লেটেন্সি |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag মূল্যায়ন ফলাফল (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | ট্রানজ্যাকশনাল আউটবক্সে অপেক্ষমাণ ইভেন্ট |
| `nwvmc.outbox.dispatch.duration` | Timer | — | আউটবক্স ব্যাচ প্রেরণ লেটেন্সি |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | অবস্থা কোড (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | স্লাইডিং-উইন্ডো সীমা অতিক্রম করে প্রত্যাখ্যাত অনুরোধ |
| `framework.outbox.dispatched.total` | Counter | — | সফলভাবে প্রেরিত মোট আউটবক্স ইভেন্ট |
| `framework.realtime.active.connections` | Gauge | — | সক্রিয় SSE সংযোগ (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant ডেটাসোর্স রাউটিং কাউন্টার (ঐচ্ছিক) |

---

## 4. ২০-ভাষার `/system/studio`, RTL সমর্থন ও হোস্ট লোকালাইজেশন (`i18n/`)

- **২০টি বিল্ট-ইন ভাষা (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur`-এ `dir="rtl"` সক্রিয়)।
- **নির্ধারিত ভাষা নির্বাচন (`LocaleResolutionUtil` ও `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG` কুকি -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`)। অচেনা ট্যাগ নিরাপদে `en`-এ ফিরে যায়।
- **হোস্ট অ্যাপ্লিকেশন কাস্টমাইজেশন**: `I18nConfig` UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`) কনফিগার করে; `app.framework.studio.show-i18n-diagnostics=true` চালু করলে `/system/studio`-এ ডায়াগনস্টিক বার দেখায়।

---

## 5. JMH `1.37` মাইক্রোবেঞ্চমার্ক থ্রুপুট (`DynamicProxyThroughputBenchmarkTest`)

| ডিসপ্যাচ পাথ (`ops/ms`) | পরিমাপকৃত গড় থ্রুপুট |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
