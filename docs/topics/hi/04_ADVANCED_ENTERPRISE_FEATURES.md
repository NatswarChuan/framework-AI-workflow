# 04. सुरक्षा, मल्टी-क्लाउड स्टोरेज, `@ServiceOverride`, मेट्रिक्स और 20-भाषा i18n (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#security-rbac)

---

## 1. NIST स्तर 2 सुरक्षा, डेटाबेस-संचालित RBAC, सरफ़ेस लॉकडाउन और एंटी-स्कैनर सुरक्षा

- **`@EntitySecurity`, `@FieldSecurity` और `@MultiTenant`**: डिक्लेरेटिव टेबल RBAC (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, कस्टम मेटा-एनोटेशन सहित), स्वामित्व जाँच (`ownerField`), संवेदनशील कॉलम मास्किंग/नलीफिकेशन (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`), और fail-closed `@MultiTenant` अलगाव (टेनेंट न होने पर `403`, निर्माण पर एंटी-स्पूफिंग और ID एंडपॉइंट पर IDOR जाँच)।
- **डेटाबेस-संचालित डायनामिक RBAC (`DynamicDatabaseRbacProviderHelper`)**: 4 JPA एंटिटी पर `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` और उनके मार्कर लगाएँ। स्पष्ट `DENY` > `ALLOW` प्राथमिकता, `X-Tenant-ID` संदर्भ, `DatabaseRbacCacheInvalidationListener` द्वारा स्वतः L1 Caffeine अमान्यता, `PureJavaSecurityFilterBridge` के साथ `SecurityFilterChain` सह-अस्तित्व और `SecurityIdentityCustomizer` विस्तार प्रदान करता है (`app.framework.security.dynamic-database-rbac-enabled=true`)।
- **डिफ़ॉल्ट सुरक्षित लॉकडाउन (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: `app.framework.studio.enabled=false` (डिफ़ॉल्ट) होने पर बिना प्रमाणीकरण `/system/**` कॉल `401` से अवरुद्ध होती हैं और अक्षम Studio `404 Not Found` (`403` बिना एडमिन अधिकार) लौटाता है; `demo-token-endpoint-enabled=false` पर `POST /api/v1/auth/token` `404` लौटाता है।
- **त्रुटि अनरैपिंग और सैनिटाइजेशन**: `ExceptionCauseUnwrapperUtil` सर्वर लॉग में पूरा कारण दर्ज करता है और क्लाइंट को सुरक्षित `ApiResponse<Void>` भेजता है।
- **SPA और आइडेंपोटेंसी CORS (`SecurityFilterChainBridge`)**: विन्यास योग्य ऑरिजिन पैटर्न (`*`) के साथ `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` और `X-Request-ID` की अनुमति देता है।

---

## 2. `@ServiceOverride` एस्केप हैच और मानक MVC कोड निष्कासन (`GET /system/studio/eject`)

जब कोई विशेष एंडपॉइंट डायनामिक CRUD की सीमा से आगे बढ़ जाए:

1. **इन-प्लेस `@ServiceOverride`**: `AutoApiController<E>` की किसी भी मेथड पर `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` लगाएँ ताकि `EscapeHatchDispatchHelper` सीधे `MethodHandleCacheUtil` द्वारा कस्टम बीन को कॉल करे।
2. **मानक कोड इजेक्शन (`/system/studio/eject`)**: `GET /system/studio/eject?target=<EntityOrControllerName>` द्वारा `ControllerEjectionHelper` से 5 स्वतंत्र Spring MVC फ़ाइलें (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) निर्यात करें।

---

## 3. Micrometer ऑब्जर्वेबिलिटी (`DynamicEntityMetricsHelper` और `MetricConstant` — 11 मेट्रिक्स)

| मेट्रिक | प्रकार | टैग | दायरा |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | डायनामिक एंटिटी CRUD कॉल की कुल संख्या |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | एंड-टू-एंड निष्पादन विलंबता |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | डायनामिक प्रॉक्सी कंट्रोलर विलंबता |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | `@HttpCacheable` ETag मूल्यांकन परिणाम (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | ट्रांज़ैक्शनल आउटबॉक्स में लंबित इवेंट्स |
| `nwvmc.outbox.dispatch.duration` | Timer | — | आउटबॉक्स बैच प्रेषण विलंबता |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | अवस्था कोड (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | स्लाइडिंग-विंडो सीमा पार करने पर अस्वीकृत अनुरोध |
| `framework.outbox.dispatched.total` | Counter | — | सफलतापूर्वक प्रेषित कुल आउटबॉक्स इवेंट्स |
| `framework.realtime.active.connections` | Gauge | — | सक्रिय SSE कनेक्शन (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Primary / Replica / Tenant डेटासोर्स रूटिंग काउंटर (वैकल्पिक) |

---

## 4. 20-भाषा `/system/studio`, RTL समर्थन और होस्ट लोकलाइजेशन (`i18n/`)

- **20 अंतर्निहित भाषाएँ (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` में `dir="rtl"` सक्रिय होता है)।
- **निर्धारित भाषा चयन (`LocaleResolutionUtil` और `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> `NWVMC_LANG` कुकी -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`)। अज्ञात टैग सुरक्षित रूप से `en` पर लौटते हैं।
- **होस्ट एप्लिकेशन अनुकूलन**: `I18nConfig` UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`) सेट करता है; `app.framework.studio.show-i18n-diagnostics=true` चालू करने पर `/system/studio` में डायग्नोस्टिक्स बार दिखता है।

---

## 5. JMH `1.37` माइक्रोबेंचमार्क थ्रूपुट (`DynamicProxyThroughputBenchmarkTest`)

| डिस्पैच पथ (`ops/ms`) | मापित औसत थ्रूपुट |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. मल्टी-क्लाउड फ़ाइल स्टोरेज (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

अंतर्निहित `FileStorageController` (`/api/v1/storage/*`) `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` और `POST /presigned-url` प्रदान करता है (`app.framework.storage.provider`: `LOCAL`/`S3`/`GCS`)।

> **प्रोडक्शन सुरक्षा:** `app.framework.security.require-authenticated-api-paths: true` सक्षम करें और Spring Security `SecurityFilterChain` में `/api/v1/storage/**` को सुरक्षित करें।
