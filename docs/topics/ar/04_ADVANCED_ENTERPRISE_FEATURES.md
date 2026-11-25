# 04. الأمان، التخزين متعدد السحب، `@ServiceOverride`، المقاييس والتدويل بـ 20 لغة (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#security-rbac)

---

## 1. أمان NIST المستوى 2، RBAC من قاعدة البيانات، إغلاق السطح والحماية من الماسحات

- **`@EntitySecurity` و`@FieldSecurity` و`@MultiTenant`**: تحكم RBAC تصريحي على مستوى الجدول (`readRoles`، `writeRoles`، `deleteRoles`، `permissions` مع دعم التعليقات المركبة)، وحماية المالك (`ownerField`)، وإخفاء/تصفير الأعمدة الحساسة (`viewRoles`، `maskPattern`، `nullifyInsteadOfMask`)، وعزل `@MultiTenant` بنهج الرفض الآمن (`403` عند غياب المستأجر، ومنع الانتحال عند الإنشاء وفحوص IDOR).
- **RBAC الديناميكي عبر قاعدة البيانات (`DynamicDatabaseRbacProviderHelper`)**: وسّم 4 كيانات JPA بـ `@SecurityRoleEntity` و`@SecurityPermissionEntity` و`@SecurityUserRoleEntity` و`@SecurityPolicyEntity` مع مؤشراتها. يفرض أولوية `DENY` > `ALLOW`، وسياق `X-Tenant-ID`، وإبطال ذاكرة L1 Caffeine تلقائيًا عبر `DatabaseRbacCacheInvalidationListener`، والتعايش الآمن مع `SecurityFilterChain` عبر `PureJavaSecurityFilterBridge` والتوسع عبر `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **إغلاق آمن افتراضيًا (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: عند `app.framework.studio.enabled=false` (الافتراضي) تُمنع الطلبات غير المصادق عليها إلى `/system/**` بـ `401` ويُرجع Studio المعطل `404 Not Found` (`403` دون صلاحية مدير)؛ وعند `demo-token-endpoint-enabled=false` يُرجع `POST /api/v1/auth/token` رمز `404`.
- **تفكيك الأخطاء وتنقيتها**: يسجل `ExceptionCauseUnwrapperUtil` السبب الجذري الكامل في سجلات الخادم بينما يعيد للعميل `ApiResponse<Void>` منقًى وآمنًا.
- **CORS لتطبيقات SPA وعدم التكرار (`SecurityFilterChainBridge`)**: يسمح بأنماط أصول قابلة للتهيئة (`*`) مع الترويسات `Authorization` و`Idempotency-Key` و`X-Idempotency-Key` و`X-Language` و`X-Tenant-ID` و`traceparent` و`X-Request-ID`.

---

## 2. مخرج التخصيص `@ServiceOverride` وتصدير شيفرة MVC القياسية (`GET /system/studio/eject`)

عندما تتجاوز نقطة نهاية محددة نطاق CRUD الديناميكي:

1. **`@ServiceOverride` الموضعي**: ضع `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` على أي دالة في `AutoApiController<E>` ليوجهها `EscapeHatchDispatchHelper` عبر `MethodHandleCacheUtil` مباشرة إلى مكون Spring مخصص.
2. **تصدير الشيفرة القياسية (`/system/studio/eject`)**: استدعِ `GET /system/studio/eject?target=<EntityOrControllerName>` لتوليد 5 ملفات Spring MVC مستقلة (`DTO`، `Repository`، `Service`، `ServiceImpl`، `Controller`) عبر `ControllerEjectionHelper`.

---

## 3. مراقبة Micrometer (`DynamicEntityMetricsHelper` و`MetricConstant` — 11 مقياسًا)

| المقياس | النوع | الوسوم | النطاق |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | إجمالي استدعاءات CRUD للكيانات الديناميكية |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | زمن الاستجابة الكامل من البداية للنهاية |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | زمن استجابة وحدة تحكم الوكيل الديناميكي |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | نتيجة فحص ETag في `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | الأحداث المعلقة في صندوق الصادر المعاملاتي (Outbox) |
| `nwvmc.outbox.dispatch.duration` | Timer | — | زمن إرسال دفعات Outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | رمز الحالة (`0=CLOSED`، `1=HALF_OPEN`، `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | الطلبات المرفوضة لتجاوز حد النافذة المنزلقة |
| `framework.outbox.dispatched.total` | Counter | — | إجمالي أحداث Outbox المرسلة بنجاح |
| `framework.realtime.active.connections` | Gauge | — | اتصالات SSE النشطة (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | عداد اختياري لتوجيه مصادر البيانات Primary / Replica / Tenant |

---

## 4. `/system/studio` بـ 20 لغة، دعم RTL وتوطين التطبيق (`i18n/`)

- **20 لغة مدمجة (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (تُفعّل `ar` و`fa` و`ur` اتجاه `dir="rtl"`).
- **تحديد اللغة الحتمي (`LocaleResolutionUtil` و`HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> ملف تعريف الارتباط `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). وتعود الوسوم غير المعروفة بأمان إلى `en`.
- **تخصيص التطبيق المضيف**: يضبط `I18nConfig` مورد رسائل UTF-8 (`classpath:i18n/messages`، `cacheSeconds=3600`)؛ وتفعيل `app.framework.studio.show-i18n-diagnostics=true` يعرض شريط التشخيص داخل `/system/studio`.

---

## 5. إنتاجية اختبار الأداء المصغر JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| مسار التوجيه (`ops/ms`) | متوسط الإنتاجية المقاس |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
