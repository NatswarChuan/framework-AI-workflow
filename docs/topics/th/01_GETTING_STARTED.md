# 01. เริ่มต้นใช้งานอย่างรวดเร็ว, สัญญาโครงสร้าง 2 โฟลเดอร์ และการตรวจ Fail-Fast ตอนบูต (`0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#quickstart)

---

## 1. สัญญาโครงสร้างโดเมน 2 โฟลเดอร์อย่างเคร่งครัด (`entity/` และ `controller/`)

แอปพลิเคชันที่ใช้ **`io.github.natswarchuan:spring-nwvmc:0.1.0`** จัดโครงสร้างโดเมนธุรกิจไว้เพียง 2 โฟลเดอร์หลัก:

1. `entity/`: คลาส JPA Entity ที่สืบทอด `BaseAuditEntity` (มีคีย์หลัก UUIDv7 และ `@Version` optimistic locking ในตัว) พร้อม Bean Validation (`jakarta.validation.constraints.*`), ดัชนี B-Tree และแอนโนเทชันเชิงประกาศ (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`)
2. `controller/`: อินเทอร์เฟซที่ติด `@AutoRestController` และสืบทอด `AutoApiController<E>` หรืออินเทอร์เฟซย่อยที่ประกอบได้เช่น `AutoReadApi<E>` (รองรับ `@RequestBody`/`@RequestParam`/`@PathVariable` มาตรฐานของ Spring MVC ด้วย)

ลอจิกธุรกิจที่เกินกว่า CRUD มาตรฐานให้แยกไว้ในอินเทอร์เฟซ `Service` และ Spring Bean `@Service` / `@Component` (`public final class` `Helper`) แล้วเชื่อมต่อผ่าน `@CustomEndpoint` หรือ `@ServiceOverride` (ทั้งนี้ `@AutoService` / `@AutoComponent` สแกนเฉพาะ `"io.github.natswarchuan"` และให้เพิ่ม `@EntityScan` หาก Entity อยู่นอก `io.github.natswarchuan`, `com.example`, `io.github`)

---

## 2. การตั้งค่า Maven และ Gradle (`pom.xml` / `build.gradle.kts`)

```xml
<properties>
  <java.version>21</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>io.github.natswarchuan</groupId>
    <artifactId>spring-nwvmc</artifactId>
    <version>0.1.0</version>
  </dependency>
</dependencies>
```

หากต้องการบิลด์ตรงจาก GitHub ผ่าน [JitPack](https://jitpack.io):

```xml
<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.1.0</version>
  </dependency>
</dependencies>
```

---

## 3. ค่าคอนฟิกพื้นฐานสำหรับ Production (`application.yml`)

`spring-boot-configuration-processor` มาพร้อม `META-INF/spring-configuration-metadata.json` (`18` กลุ่มเมตาดาตาจาก `16` คลาส `@AutoConfigurationBean`/`@ConfigurationProperties` ครอบคลุม `20` โมเดล `*Properties` ใต้ `app.framework.*` และ `spring-nwvmc.human-policies`) ฟิลด์เดิมใน `ControllerToApiProperties` ยังคงตรวจตอนบูตเพื่อความเข้ากันได้ ส่วนเส้นทางจริงกำหนดผ่าน `@AutoRestController(basePath = ...)` และขีดจำกัดคิวรีผ่าน `app.framework.query-guardrails.*`:

```yaml
spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: ${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false
```

---

## 4. การคัดกรอง Endpoint รายเมธอด (`enabledEndpoints` และ `disabledEndpoints`)

`EndpointFeatureFilterHelper` จับคู่ชื่อเมธอดตรงตาม `AutoApiController<E>` แบบไม่สนตัวพิมพ์เล็ก-ใหญ่ (`equalsIgnoreCase(methodName)` เช่น `batchChunked`, `deleteById`, `importCsv`):

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked", "deleteById", "importCsv"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}
```

---

## 5. การวินิจฉัย Fail-Fast ตอนเริ่มต้นระบบ (`StartupDiagnosticsUtil` และ `EntityFailFastValidatorUtil`)

| ข้อยกเว้น (Exception) | เงื่อนไขที่ทำให้เกิด | วิธีแก้ไข |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` ตรวจพบ JVM `< 21` | รันบน Java 21 LTS หรือใหม่กว่า |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` และค่า `jwt-secret` สั้นกว่า `32` ไบต์ UTF-8 | กำหนด `${JWT_SECRET}` อย่างน้อย 32 ไบต์ |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` หรือ `maxPageSize < 1` | กำหนดจำนวนเต็มบวกใต้ `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` หรือ `ComputedFieldFailFastUtil` พบว่าขาด `@Id`, ขาด constructor ไร้พารามิเตอร์ หรือชื่อฟิลด์ `@ComputedField` ไม่ถูกต้อง | สืบทอด `BaseAuditEntity`, คง `@NoArgsConstructor` และใช้ชื่อฟิลด์ให้ตรงทุกตัวอักษร |
