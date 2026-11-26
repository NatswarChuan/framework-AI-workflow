# 01. شروع سریع، قرارداد دو پوشه‌ای و عیب‌یابی Fail-Fast در زمان بالا آمدن (`0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل (EN)](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#quickstart)

---

## 1. قرارداد سخت‌گیرانه دو پوشه‌ای دامنه (`entity/` و `controller/`)

برنامه‌های Spring Boot ساخته‌شده با **`io.github.natswarchuan:spring-nwvmc:0.1.0`** دامنه‌های کسب‌وکار را تنها در دو پوشه سازمان‌دهی می‌کنند:

1. `entity/`: موجودیت‌های JPA که از `BaseAuditEntity` ارث می‌برند (دارای کلید اصلی UUIDv7 و قفل خوش‌بینانه `@Version` داخلی)، همراه با قیود Bean Validation (`jakarta.validation.constraints.*`)، ایندکس‌های B-Tree و حاشیه‌نویسی‌های اعلانی (`@EntitySecurity`، `@FieldSecurity`، `@StateMachine`، `@AutoCode`، `@AutoSlug`، `@UniqueField`، `@ComputedField`، `@AuditTrail`، `@MultiTenant`).
2. `controller/`: اینترفیس‌های نشانگر دارای `@AutoRestController` که `AutoApiController<E>` یا زیرمجموعه‌های ترکیبی مانند `AutoReadApi<E>` را گسترش می‌دهند (با پشتیبانی کامل از `@RequestBody`/`@RequestParam`/`@PathVariable` استاندارد Spring MVC).

فرایندهای تجاری فراتر از CRUD عمومی در اینترفیس‌های `Service` و بین‌های مستقل Spring `@Service` / `@Component` (`public final class` `Helper`) قرار می‌گیرند و از طریق `@CustomEndpoint` یا `@ServiceOverride` متصل می‌شوند (`@AutoService` / `@AutoComponent` تنها `"io.github.natswarchuan"` را اسکن می‌کنند؛ اگر موجودیت‌ها خارج از `io.github.natswarchuan`، `com.example` یا `io.github` هستند `@EntityScan` اضافه کنید).

---

## 2. تنظیمات Maven و Gradle (`pom.xml` / `build.gradle.kts`)

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

برای بیلد مستقیم از گیت‌هاب از طریق [JitPack](https://jitpack.io):

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

## 3. پیکربندی پایه محیط تولید (`application.yml`)

`spring-boot-configuration-processor` فایل `META-INF/spring-configuration-metadata.json` (`18` گروه فراداده از `16` کلاس `@AutoConfigurationBean`/`@ConfigurationProperties` در `20` مدل `*Properties` زیر `app.framework.*` و `spring-nwvmc.human-policies`) را ارائه می‌دهد. فیلدهای قدیمی `ControllerToApiProperties` برای سازگاری در زمان بوت اعتبارسنجی می‌شوند، در حالی که مسیرهای فعال با `@AutoRestController(basePath = ...)` و محدودیت‌ها با `app.framework.query-guardrails.*` کنترل می‌شوند:

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

> **نکته توسعه محلی:** اگر `JWT_SECRET` تنظیم نشده است، فقط در `application-dev.yml` مقدار `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` قرار دهید (`application.yml`/`application-prod.yml` را همیشه fail-closed نگه دارید).

---

## 4. فیلتر کردن دقیق Endpointها (`enabledEndpoints` و `disabledEndpoints`)

`EndpointFeatureFilterHelper` نام دقیق متدهای `AutoApiController<E>` را بدون حساسیت به حروف بزرگ و کوچک تطبیق می‌دهد (`equalsIgnoreCase(methodName)`، مانند `batchChunked`، `deleteById`، `importCsv`):

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

## 5. تشخیص Fail-Fast در زمان راه‌اندازی (`StartupDiagnosticsUtil` و `EntityFailFastValidatorUtil`)

| استثنا (Exception) | شرط وقوع | راه‌حل |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` نسخه JVM `< 21` را تشخیص دهد | برنامه را روی Java 21 LTS یا جدیدتر اجرا کنید |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` و `jwt-secret` سفارشی کمتر از `32` بایت UTF-8 باشد | مقدار `${JWT_SECRET}` را دست‌کم 32 بایت تنظیم کنید |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`، `maxFilterCriteria < 1` یا `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | اعداد صحیح مثبت زیر `app.framework.query-guardrails.*` تنظیم کنید |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` یا `ComputedFieldFailFastUtil` نبود `@Id`، نبود سازنده بدون پارامتر یا نام فیلد نامعتبر در `@ComputedField` را بیابد | از `BaseAuditEntity` ارث ببرید، `@NoArgsConstructor` را حفظ کنید و نام دقیق فیلدها را تطبیق دهید |
