# 04. ความปลอดภัย, ที่เก็บไฟล์ Multi-Cloud, `@ServiceOverride`, เมตริก และ i18n 20 ภาษา (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์ (EN)](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#security-rbac)

---

## 1. ความปลอดภัย NIST ระดับ 2, RBAC จากฐานข้อมูล, การล็อกพื้นผิว และการป้องกันสแกนเนอร์

- **`@EntitySecurity`, `@FieldSecurity` และ `@MultiTenant`**: ควบคุมสิทธิ์ RBAC ระดับตาราง (`readRoles`, `writeRoles`, `deleteRoles`, `permissions` รองรับเมตาแอนโนเทชัน), การตรวจเจ้าของข้อมูล (`ownerField`), การปิดบัง/ตั้งค่าเป็น null สำหรับคอลัมน์ลับ (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) และการแยกผู้เช่า `@MultiTenant` แบบ fail-closed (คืน `403` เมื่อไม่มีผู้เช่า ป้องกันการปลอมแปลงตอนสร้าง และตรวจ IDOR ทุกเส้นทาง ID)
- **RBAC แบบไดนามิกจากฐานข้อมูล (`DynamicDatabaseRbacProviderHelper`)**: ติด `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` และมาร์กเกอร์บน Entity ทั้ง 4 บังคับลำดับ `DENY` > `ALLOW` รองรับ `X-Tenant-ID` ล้างแคช L1 Caffeine อัตโนมัติผ่าน `DatabaseRbacCacheInvalidationListener` อยู่ร่วมกับ `SecurityFilterChain` ผ่าน `PureJavaSecurityFilterBridge` และต่อยอดด้วย `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`)
- **การล็อกปลอดภัยตามค่าเริ่มต้น (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: เมื่อ `app.framework.studio.enabled=false` (ค่าเริ่มต้น) คำขอที่ไม่ยืนยันตัวตนไปยัง `/system/**` จะถูกบล็อกด้วย `401` และ Studio ที่ปิดอยู่จะคืน `404 Not Found` (`403` เมื่อไม่มีสิทธิ์ผู้ดูแล) ส่วน `demo-token-endpoint-enabled=false` จะทำให้ `POST /api/v1/auth/token` คืน `404`
- **การแกะและคัดกรองข้อผิดพลาด**: `ExceptionCauseUnwrapperUtil` บันทึกสาเหตุเต็มฝั่งเซิร์ฟเวอร์และส่งคืนเฉพาะ `ApiResponse<Void>` ที่ปลอดภัยแก่ไคลเอนต์
- **CORS สำหรับ SPA และ Idempotency (`SecurityFilterChainBridge`)**: รองรับรูปแบบ Origin ที่กำหนดได้ (`*`) พร้อมเฮดเดอร์ `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` และ `X-Request-ID`

---

## 2. ทางออกฉุกเฉิน `@ServiceOverride` และการส่งออกโค้ด MVC มาตรฐาน (`GET /system/studio/eject`)

เมื่อบาง Endpoint มีความซับซ้อนเกินกว่า CRUD ไดนามิก:

1. **`@ServiceOverride` เฉพาะจุด**: ติด `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` บนเมธอดใน `AutoApiController<E>` เพื่อให้ `EscapeHatchDispatchHelper` ส่งต่อไปยัง Spring Bean ของคุณผ่าน `MethodHandleCacheUtil`
2. **การส่งออกโค้ดมาตรฐาน (`/system/studio/eject`)**: เรียก `GET /system/studio/eject?target=<EntityOrControllerName>` เพื่อส่งออกไฟล์ Spring MVC อิสระ 5 ไฟล์ (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) ผ่าน `ControllerEjectionHelper`

---

## 3. การเฝ้าสังเกต Micrometer (`DynamicEntityMetricsHelper` และ `MetricConstant` — 11 เมตริก)

| เมตริก | ประเภท | แท็ก | ขอบเขตการวัด |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | จำนวนการเรียก CRUD ของ Entity แบบไดนามิกทั้งหมด |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | ความหน่วงเวลาการทำงานตั้งแต่ต้นจนจบ |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | ความหน่วงเวลาของ Proxy Controller แบบไดนามิก |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | ผลการตรวจ ETag ของ `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | จำนวนอีเวนต์ที่รอส่งใน Transactional Outbox |
| `nwvmc.outbox.dispatch.duration` | Timer | — | ความหน่วงเวลาการส่งแบตช์ของ Outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | รหัสสถานะ (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | จำนวนคำขอที่ถูกปฏิเสธเนื่องจากเกินโควตา Sliding-Window |
| `framework.outbox.dispatched.total` | Counter | — | ยอดสะสมอีเวนต์ Outbox ที่ส่งสำเร็จ |
| `framework.realtime.active.connections` | Gauge | — | จำนวนการเชื่อมต่อ SSE ที่ทำงานอยู่ (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | ตัวนับทางเลือกของการกำหนดเส้นทางแหล่งข้อมูล Primary / Replica / Tenant |

---

## 4. `/system/studio` 20 ภาษา, รองรับ RTL และการแปลภาษาฝั่งแอป (`i18n/`)

- **20 ภาษาในตัว (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` เปิด `dir="rtl"` อัตโนมัติ)
- **ลำดับการระบุภาษา (`LocaleResolutionUtil` และ `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> คุกกี้ `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`) แท็กที่ไม่รู้จักจะถอยกลับเป็น `en` อย่างปลอดภัย
- **การปรับแต่งในแอปพลิเคชันโฮสต์**: `I18nConfig` ตั้งค่า UTF-8 `ReloadableResourceBundleMessageSource` (`classpath:i18n/messages`, `cacheSeconds=3600`) และเมื่อเปิด `app.framework.studio.show-i18n-diagnostics=true` จะแสดงแถบวินิจฉัยใน `/system/studio`

---

## 5. ผลทดสอบความเร็วไมโครเบนช์มาร์ก JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| เส้นทางการจ่ายงาน (`ops/ms`) | ค่าเฉลี่ยความเร็วที่วัดได้ |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. การจัดเก็บไฟล์หลายคลาวด์ (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

`FileStorageController` (`/api/v1/storage/*`) รองรับ `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` และ `POST /presigned-url` ผ่าน `app.framework.storage.provider` (`LOCAL`/`S3`/`GCS`) และ `StorageCustomizer`

> **การล็อกความปลอดภัย Production:** เปิดใช้งาน `app.framework.security.require-authenticated-api-paths: true` และป้องกัน `/api/v1/storage/**` ใน `SecurityFilterChain`
