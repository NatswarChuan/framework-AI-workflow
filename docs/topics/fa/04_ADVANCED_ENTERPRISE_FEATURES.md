# 04. امنیت، ذخیره‌سازی چندابری، `@ServiceOverride`، معیارها و بین‌المللی‌سازی ۲۰ زبانه (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#security-rbac)

---

## 1. امنیت NIST سطح ۲، RBAC مبتنی بر پایگاه داده، قفل سطوح و دفاع ضداسکنر

- **`@EntitySecurity`، `@FieldSecurity` و `@MultiTenant`**: کنترل دسترسی اعلانی جدول (`readRoles`، `writeRoles`، `deleteRoles`، `permissions` با پشتیبانی از متا-حاشیه‌نویسی)، محافظ مالکیت (`ownerField`)، پنهان‌سازی یا تهی‌سازی ستون‌های حساس (`viewRoles`، `maskPattern`، `nullifyInsteadOfMask`) و جداسازی `@MultiTenant` به شکل fail-closed (`403` در نبود مستأجر، جلوگیری از جعل در ایجاد و بررسی IDOR).
- **RBAC پویای مبتنی بر پایگاه داده (`DynamicDatabaseRbacProviderHelper`)**: ۴ موجودیت JPA را با `@SecurityRoleEntity`، `@SecurityPermissionEntity`، `@SecurityUserRoleEntity`، `@SecurityPolicyEntity` و نشانگرهای مربوطه مشخص کنید. اولویت صریح `DENY` > `ALLOW`، زمینه `X-Tenant-ID`، باطل‌سازی خودکار کش L1 Caffeine با `DatabaseRbacCacheInvalidationListener`، همزیستی بدون تداخل با `SecurityFilterChain` از طریق `PureJavaSecurityFilterBridge` و توسعه با `SecurityIdentityCustomizer` را فراهم می‌کند (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **قفل ایمن پیش‌فرض (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: با `app.framework.studio.enabled=false` (پیش‌فرض)، درخواست‌های احرازهویت‌نشده به `/system/**` با `401` مسدود و سطوح غیرفعال Studio با `404 Not Found` (`403` بدون دسترسی مدیر) رد می‌شوند؛ با `demo-token-endpoint-enabled=false`، مسیر `POST /api/v1/auth/token` کد `404` می‌دهد.
- **بازکردن و پالایش خطاها**: `ExceptionCauseUnwrapperUtil` علت کامل داخلی را در لاگ سرور ثبت می‌کند و تنها پاسخ ایمن `ApiResponse<Void>` به کلاینت برمی‌گرداند.
- **CORS برای SPA و یک‌باراجرایی (`SecurityFilterChainBridge`)**: الگوهای مبدا قابل تنظیم (`*`) را همراه با سرآیندهای `Authorization`، `Idempotency-Key`، `X-Idempotency-Key`، `X-Language`، `X-Tenant-ID`، `traceparent` و `X-Request-ID` مجاز می‌کند.

---

## 2. مسیر جایگزین `@ServiceOverride` و خروجی کد استاندارد MVC (`GET /system/studio/eject`)

وقتی یک مسیر خاص فراتر از CRUD پویا می‌رود:

1. **`@ServiceOverride` درجا**: هر متد `AutoApiController<E>` را با `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` مشخص کنید تا `EscapeHatchDispatchHelper` از طریق `MethodHandleCacheUtil` مستقیماً به بین سفارشی هدایت کند.
2. **خروجی کد استاندارد (`/system/studio/eject`)**: با فراخوانی `GET /system/studio/eject?target=<EntityOrControllerName>` پنج فایل مستقل Spring MVC (`DTO`، `Repository`، `Service`، `ServiceImpl`، `Controller`) توسط `ControllerEjectionHelper` تولید می‌شود.

---

## 3. مشاهده‌پذیری Micrometer (`DynamicEntityMetricsHelper` و `MetricConstant` — ۱۱ معیار)

| معیار | نوع | برچسب‌ها | دامنه |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | مجموع فراخوانی‌های CRUD موجودیت‌های پویا |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | تأخیر اجرای سرتاسری |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | تأخیر کنترلر پروکسی پویا |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | نتیجه ارزیابی ETag در `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | رویدادهای در انتظار در Outbox تراکنشی |
| `nwvmc.outbox.dispatch.duration` | Timer | — | تأخیر ارسال دسته‌ای Outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | کد وضعیت (`0=CLOSED`، `1=HALF_OPEN`، `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | درخواست‌های ردشده به دلیل عبور از سهمیه پنجره لغزان |
| `framework.outbox.dispatched.total` | Counter | — | تعداد کل رویدادهای Outbox ارسال‌شده با موفقیت |
| `framework.realtime.active.connections` | Gauge | — | اتصالات فعال SSE (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | شمارنده اختیاری مسیریابی منبع داده Primary / Replica / Tenant |

---

## 4. `/system/studio` ۲۰ زبانه، پشتیبانی RTL و بومی‌سازی میزبان (`i18n/`)

- **۲۰ زبان داخلی (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`، `fa`، `ur` جهت `dir="rtl"` را فعال می‌کنند).
- **تشخیص قطعی زبان (`LocaleResolutionUtil` و `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> کوکی `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). برچسب‌های ناشناخته به‌طور ایمن به `en` بازمی‌گردند.
- **سفارشی‌سازی برنامه میزبان**: `I18nConfig` منبع پیام UTF-8 (`classpath:i18n/messages`، `cacheSeconds=3600`) را تنظیم می‌کند؛ فعال‌سازی `app.framework.studio.show-i18n-diagnostics=true` نوار عیب‌یابی را در `/system/studio` نشان می‌دهد.

---

## 5. توان عملیاتی بنچمارک JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| مسیر فراخوانی (`ops/ms`) | میانگین توان عملیاتی اندازه‌گیری‌شده |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
