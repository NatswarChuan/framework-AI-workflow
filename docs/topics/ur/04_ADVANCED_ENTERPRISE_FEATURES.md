# 04. سیکیورٹی، ملٹی کلاؤڈ اسٹوریج، `@ServiceOverride`، میٹرکس اور 20-زبان i18n (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#security-rbac)

---

## 1. NIST لیول 2 سیکیورٹی، ڈیٹا بیس RBAC، سرفیس لاک ڈاؤن اور اینٹی اسکینر تحفظ

- **`@EntitySecurity`، `@FieldSecurity` اور `@MultiTenant`**: ڈیکلیریٹو ٹیبل RBAC (`readRoles`، `writeRoles`، `deleteRoles`، `permissions` مع میٹا اینوٹیشنز)، ملکیت کی جانچ (`ownerField`)، حساس کالم ماسکنگ/نل کرنا (`viewRoles`، `maskPattern`، `nullifyInsteadOfMask`) اور fail-closed `@MultiTenant` علیحدگی (ٹیننٹ نہ ہونے پر `403`، تخلیق پر جعل سازی روک تھام اور IDOR جانچ)۔
- **ڈیٹا بیس پر مبنی ڈائنامک RBAC (`DynamicDatabaseRbacProviderHelper`)**: 4 JPA اینٹیٹیز پر `@SecurityRoleEntity`، `@SecurityPermissionEntity`، `@SecurityUserRoleEntity`، `@SecurityPolicyEntity` اور مارکرز لگائیں۔ واضح `DENY` > `ALLOW` ترجیح، `X-Tenant-ID` سیاق، `DatabaseRbacCacheInvalidationListener` کے ذریعے L1 Caffeine خودکار تجدید، `PureJavaSecurityFilterBridge` سے `SecurityFilterChain` ہم آہنگی اور `SecurityIdentityCustomizer` توسیع فراہم کرتا ہے (`app.framework.security.dynamic-database-rbac-enabled=true`)۔
- **ڈیفالٹ محفوظ لاک ڈاؤن (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: `app.framework.studio.enabled=false` (ڈیفالٹ) پر غیر مصدقہ `/system/**` کالز `401` سے بلاک ہوتی ہیں اور غیر فعال Studio `404 Not Found` (`403` ایڈمن کے بغیر) واپس کرتا ہے؛ `demo-token-endpoint-enabled=false` پر `POST /api/v1/auth/token` `404` دیتا ہے۔
- **خرابیوں کی صفائی اور ان ریپنگ**: `ExceptionCauseUnwrapperUtil` سرور لاگز میں مکمل وجہ محفوظ رکھتا ہے اور کلائنٹ کو محفوظ `ApiResponse<Void>` بھیجتا ہے۔
- **SPA اور آئڈیمپوٹینسی CORS (`SecurityFilterChainBridge`)**: قابلِ ترتیب اصل پیٹرن (`*`) کے ساتھ `Authorization`، `Idempotency-Key`، `X-Idempotency-Key`، `X-Language`، `X-Tenant-ID`، `traceparent` اور `X-Request-ID` کی اجازت دیتا ہے۔

---

## 2. `@ServiceOverride` متبادل راستہ اور معیاری MVC کوڈ اخراج (`GET /system/studio/eject`)

جب کوئی مخصوص اینڈپوائنٹ ڈائنامک CRUD سے آگے بڑھ جائے:

1. **ان پلیس `@ServiceOverride`**: `AutoApiController<E>` کے کسی بھی میتھڈ پر `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` لگائیں تاکہ `EscapeHatchDispatchHelper` براہِ راست `MethodHandleCacheUtil` کے ذریعے کسٹم Spring بین کو کال کرے۔
2. **معیاری کوڈ اخراج (`/system/studio/eject`)**: `GET /system/studio/eject?target=<EntityOrControllerName>` کے ذریعے `ControllerEjectionHelper` سے 5 آزاد Spring MVC فائلیں (`DTO`، `Repository`، `Service`، `ServiceImpl`، `Controller`) حاصل کریں۔

---

## 3. Micrometer آبزرویبلٹی (`DynamicEntityMetricsHelper` اور `MetricConstant` — 11 میٹرکس)

| میٹرک | قسم | ٹیگز | دائرہ کار |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | ڈائنامک اینٹیٹی CRUD کالز کی کل تعداد |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | اینڈ ٹو اینڈ عملدرآمد کی تاخیر |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | ڈائنامک پراکسی کنٹرولر تاخیر |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag نتیجہ (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | ٹرانزیکشنل آؤٹ باکس میں زیر التوا ایونٹس |
| `nwvmc.outbox.dispatch.duration` | Timer | — | آؤٹ باکس بیچ ترسیل کی تاخیر |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | اسٹیٹ کوڈ (`0=CLOSED`، `1=HALF_OPEN`، `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | سلائیڈنگ ونڈو حد سے تجاوز پر مسترد درخواستیں |
| `framework.outbox.dispatched.total` | Counter | — | کامیابی سے بھیجے گئے کل آؤٹ باکس ایونٹس |
| `framework.realtime.active.connections` | Gauge | — | فعال SSE کنکشنز (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant ڈیٹاسورس روٹنگ کاؤنٹر (اختیاری) |

---

## 4. 20 زبانوں والا `/system/studio`، RTL سپورٹ اور ہوسٹ لوکلائزیشن (`i18n/`)

- **20 بلٹ ان زبانیں (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`، `fa`، `ur` کے لیے `dir="rtl"` فعال ہوتا ہے)۔
- **متعین زبان کی شناخت (`LocaleResolutionUtil` اور `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG` کوکی -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`)۔ نامعلوم ٹیگز محفوظ طریقے سے `en` پر لوٹتے ہیں۔
- **ہوسٹ ایپلی کیشن تخصیص**: `I18nConfig` UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`، `cacheSeconds=3600`) ترتیب دیتا ہے؛ `app.framework.studio.show-i18n-diagnostics=true` فعال کرنے پر `/system/studio` میں تشخیصی بار نظر آتا ہے۔

---

## 5. JMH `1.37` مائیکرو بینچ مارک تھروپٹ (`DynamicProxyThroughputBenchmarkTest`)

| ڈسپیچ پاتھ (`ops/ms`) | ناپا گیا اوسط تھروپٹ |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
