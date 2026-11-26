# 01. فوری آغاز، دو ڈائریکٹری معاہدہ اور Fail-Fast اسٹارٹ اپ تشخیص (`0.1.0`)

> **زبانیں**: **اردو** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ (EN)](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#quickstart)

---

## 1. سخت دو ڈائریکٹری ڈومین معاہدہ (`entity/` اور `controller/`)

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** پر مبنی Spring Boot ایپلی کیشنز کاروباری ڈومین کو صرف دو ڈائریکٹریز میں منظم کرتی ہیں:

1. `entity/`: `BaseAuditEntity` (بلٹ ان UUIDv7 پرائمری کی اور `@Version` آپٹیمسٹک لاکنگ) کو ایکسٹینڈ کرنے والی JPA اینٹیٹیز، جن میں Bean Validation (`jakarta.validation.constraints.*`)، B-Tree انڈیکس اور ڈیکلیریٹو اینوٹیشنز (`@EntitySecurity`، `@FieldSecurity`، `@StateMachine`، `@AutoCode`، `@AutoSlug`، `@UniqueField`، `@ComputedField`، `@AuditTrail`، `@MultiTenant`) شامل ہوتی ہیں۔
2. `controller/`: `@AutoRestController` سے نشان زد مارکر انٹرفیس جو `AutoApiController<E>` یا `AutoReadApi<E>` جیسے قابلِ ترکیب سب انٹرفیس کو ایکسٹینڈ کرتے ہیں (معیاری Spring MVC `@RequestBody`/`@RequestParam`/`@PathVariable` بھی سپورٹ ہوتے ہیں)۔

عمومی CRUD سے ہٹ کر ڈومین ورک فلو `Service` انٹرفیس اور آزاد Spring `@Service` / `@Component` (`public final class` `Helper`) بینز میں رکھے جاتے ہیں اور `@CustomEndpoint` یا `@ServiceOverride` سے جوڑے جاتے ہیں (`@AutoService` / `@AutoComponent` صرف `"io.github.natswarchuan"` اسکین کرتے ہیں؛ اگر اینٹیٹیز `io.github.natswarchuan`، `com.example`، `io.github` سے باہر ہوں تو `@EntityScan` شامل کریں)۔

---

## 2. Maven اور Gradle سیٹ اپ (`pom.xml` / `build.gradle.kts`)

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

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <parameters>true</parameters>
      </configuration>
    </plugin>
  </plugins>
</build>
```

```kotlin
// Gradle (Kotlin DSL — build.gradle.kts)
dependencies {
    implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}
tasks.withType<JavaCompile> {
    options.compilerArgs.add("-parameters")
}
```

[JitPack](https://jitpack.io) کے ذریعے براہِ راست GitHub بلڈ کے لیے:

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

## 3. پروڈکشن بیس لائن کنفیگریشن (`application.yml`)

`spring-boot-configuration-processor` میں `META-INF/spring-configuration-metadata.json` شامل ہے (`app.framework.*` اور `spring-nwvmc.human-policies` کے تحت `20` `*Properties` ماڈلز اور `16` `@AutoConfigurationBean`/`@ConfigurationProperties` کلاسز سے `18` میٹا ڈیٹا گروپس)۔ `ControllerToApiProperties` کی پرانی فیلڈز مطابقت کے لیے بوٹ پر جانچی جاتی ہیں جبکہ فعال روٹس `@AutoRestController(basePath = ...)` اور کوئری حدود `app.framework.query-guardrails.*` سے طے ہوتی ہیں:

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

> **مقامی ڈویلپمنٹ مشورہ:** اگر `JWT_SECRET` سیٹ نہیں ہے تو صرف `application-dev.yml` میں `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` شامل کریں (`application.yml`/`application-prod.yml` کو محفوظ رکھیں)۔

---

## 4. باریک اینڈپوائنٹ فلٹرنگ (`enabledEndpoints` اور `disabledEndpoints`)

`EndpointFeatureFilterHelper` کیس ان سینسیٹو انداز میں `AutoApiController<E>` کے درست میتھڈ نام سے مطابقت کرتا ہے (`equalsIgnoreCase(methodName)`، مثلاً `batchChunked`، `deleteById`، `importCsv`):

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

## 5. اسٹارٹ اپ Fail-Fast تشخیص (`StartupDiagnosticsUtil` اور `EntityFailFastValidatorUtil`)

| استثنا (Exception) | ٹرگر شرط | حل |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` کو JVM `< 21` ملے | Java 21 LTS یا جدید تر پر چلائیں |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` اور کسٹم `jwt-secret` `< 32` UTF-8 بائٹس | `${JWT_SECRET}` کو کم از کم 32 بائٹس مقرر کریں |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`، `maxFilterCriteria < 1` یا `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | `app.framework.query-guardrails.*` میں مثبت صحیح اعداد دیں |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` یا `ComputedFieldFailFastUtil` کو `@Id` کی کمی، نو-آرگ کنسٹرکٹر کی کمی یا غلط `@ComputedField` فیلڈ ملے | `BaseAuditEntity` ایکسٹینڈ کریں، `@NoArgsConstructor` رکھیں اور درست فیلڈ نام ملائیں |
