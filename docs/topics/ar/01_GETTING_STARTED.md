# 01. البدء السريع، عقد المجلدين وتشخيصات الإقلاع الفوري Fail-Fast (`0.1.0`)

> **اللغات**: **العربية** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#quickstart)

---

## 1. عقد النطاق الصارم لمجلدين (`entity/` و `controller/`)

تنظم تطبيقات Spring Boot المبنية باستخدام **`io.github.natswarchuan:spring-nwvmc:0.1.0`** نطاقات الأعمال في مجلدين فقط:

1. `entity/`: كيانات JPA ترث من `BaseAuditEntity` (مع مفتاح أساسي UUIDv7 وقفل تفاؤلي `@Version` مدمجين)، وتحمل قيود Bean Validation (`jakarta.validation.constraints.*`) وفهارس B-Tree والتعليقات التوضيحية التصريحية (`@EntitySecurity`، `@FieldSecurity`، `@StateMachine`، `@AutoCode`، `@AutoSlug`، `@UniqueField`، `@ComputedField`، `@AuditTrail`، `@MultiTenant`).
2. `controller/`: واجهات مؤشرة موسومة بـ `@AutoRestController` ترث من `AutoApiController<E>` أو واجهات فرعية قابلة للتركيب مثل `AutoReadApi<E>` (مع دعم `@RequestBody`/`@RequestParam`/`@PathVariable` القياسية في Spring MVC).

توضع مسارات العمل المتقدمة التي تتجاوز CRUD العام داخل واجهات `Service` ومكونات Spring مستقلة (`@Service` / `@Component` من نوع `public final class` `Helper`) وتُربط عبر `@CustomEndpoint` أو `@ServiceOverride` (يفحص `@AutoService` / `@AutoComponent` الحزمة `"io.github.natswarchuan"` فقط؛ أضف `@EntityScan` إذا كانت الكيانات خارج `io.github.natswarchuan` و`com.example` و`io.github`).

---

## 2. إعداد Maven و Gradle (`pom.xml` / `build.gradle.kts`)

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

للبناء المباشر من GitHub عبر [JitPack](https://jitpack.io):

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

## 3. الإعدادات الأساسية لبيئة الإنتاج (`application.yml`)

يوفر `spring-boot-configuration-metadata.json` (`18` مجموعة بيانات وصفية من `16` فئة `@AutoConfigurationBean`/`@ConfigurationProperties` عبر `20` نموذج `*Properties` تحت `app.framework.*` و`spring-nwvmc.human-policies`). تبقى الحقول القديمة في `ControllerToApiProperties` قيد التحقق عند الإقلاع للتوافق، بينما تتحكم `@AutoRestController(basePath = ...)` بالمسارات و`app.framework.query-guardrails.*` بحدود الاستعلام:

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

## 4. تصفية نقاط النهاية بدقة (`enabledEndpoints` و `disabledEndpoints`)

يطابق `EndpointFeatureFilterHelper` أسماء الدوال الدقيقة في `AutoApiController<E>` دون حساسية لحالة الأحرف (`equalsIgnoreCase(methodName)` مثل `batchChunked` و`deleteById` و`importCsv`):

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

## 5. تشخيصات Fail-Fast عند التشغيل (`StartupDiagnosticsUtil` و `EntityFailFastValidatorUtil`)

| الاستثناء | شرط التفعيل | المعالجة |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | يكتشف `JavaVersionGuardUtil.enforceJava21OrHigher()` إصدار JVM `< 21` | التشغيل على Java 21 LTS أو أحدث |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` ومفتاح `jwt-secret` مخصص أقل من `32` بايت UTF-8 | تعيين `${JWT_SECRET}` بطول 32 بايت على الأقل |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1` أو `maxFilterCriteria < 1` أو `maxPageSize < 1` | ضبط أعداد صحيحة موجبة ضمن `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | يكتشف `EntityFailFastValidatorUtil` أو `ComputedFieldFailFastUtil` غياب `@Id` أو المنشئ الفارغ أو حقول `@ComputedField` غير صالحة | الوراثة من `BaseAuditEntity` والإبقاء على `@NoArgsConstructor` ومطابقة أسماء الحقول بدقة |
