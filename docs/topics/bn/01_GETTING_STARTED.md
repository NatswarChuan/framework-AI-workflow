# 01. দ্রুত শুরু, দুই-ডিরেক্টরি চুক্তি এবং Fail-Fast স্টার্টআপ ডায়াগনস্টিকস (`0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#quickstart)

---

## 1. কঠোর দুই-ডিরেক্টরি ডোমেইন চুক্তি (`entity/` এবং `controller/`)

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** দিয়ে তৈরি Spring Boot অ্যাপ্লিকেশন ব্যবসা ডোমেইনকে মাত্র দুটি ডিরেক্টরিতে সাজায়:

1. `entity/`: `BaseAuditEntity` (বিল্ট-ইন UUIDv7 প্রাইমারি কী এবং `@Version` অপটিমিস্টিক লকিং) এক্সটেন্ড করা JPA এনটিটি, যেখানে Bean Validation (`jakarta.validation.constraints.*`), B-Tree ইনডেক্স এবং ডিক্লারেটিভ অ্যানোটেশন (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`) থাকে।
2. `controller/`: `@AutoRestController` যুক্ত মার্কার ইন্টারফেস যা `AutoApiController<E>` বা `AutoReadApi<E>`-এর মতো কম্পোজেবল সাব-ইন্টারফেস এক্সটেন্ড করে (স্ট্যান্ডার্ড Spring MVC `@RequestBody`/`@RequestParam`/`@PathVariable`-ও সমর্থিত)।

সাধারণ CRUD-এর বাইরের ডোমেইন ওয়ার্কফ্লো `Service` ইন্টারফেস এবং স্বতন্ত্র Spring `@Service` / `@Component` (`public final class` `Helper`) বিনে থাকে, যা `@CustomEndpoint` বা `@ServiceOverride` দিয়ে যুক্ত হয় (`@AutoService` / `@AutoComponent` কেবল `"io.github.natswarchuan"` স্ক্যান করে; এনটিটি `io.github.natswarchuan`, `com.example`, `io.github`-এর বাইরে থাকলে `@EntityScan` যোগ করুন)।

---

## 2. Maven ও Gradle সেটআপ (`pom.xml` / `build.gradle.kts`)

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

[JitPack](https://jitpack.io) এর মাধ্যমে সরাসরি GitHub বিল্ড ব্যবহার করতে:

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

## 3. প্রোডাকশন বেসলাইন কনফিগারেশন (`application.yml`)

`spring-boot-configuration-processor` অন্তর্ভুক্ত করে `META-INF/spring-configuration-metadata.json` (`app.framework.*` ও `spring-nwvmc.human-policies`-এর অধীনে `20`টি `*Properties` মডেল ও `16`টি `@AutoConfigurationBean`/`@ConfigurationProperties` ক্লাস থেকে `18`টি মেটাডেটা গ্রুপ)। `ControllerToApiProperties`-এর পুরোনো ফিল্ড সামঞ্জস্যের জন্য বুট-ভ্যালিডেটেড থাকে, আর সক্রিয় রুট `@AutoRestController(basePath = ...)` এবং কোয়েরি সীমা `app.framework.query-guardrails.*` দ্বারা নিয়ন্ত্রিত হয়:

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

## 4. সূক্ষ্ম এন্ডপয়েন্ট ফিল্টারিং (`enabledEndpoints` ও `disabledEndpoints`)

`EndpointFeatureFilterHelper` কেস-ইনসেন্সিটিভভাবে `AutoApiController<E>`-এর সঠিক মেথড নামের সাথে মিলায় (`equalsIgnoreCase(methodName)`, যেমন `batchChunked`, `deleteById`, `importCsv`):

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

## 5. স্টার্টআপ Fail-Fast ডায়াগনস্টিকস (`StartupDiagnosticsUtil` ও `EntityFailFastValidatorUtil`)

| এক্সেপশন | ট্রিগার শর্ত | সমাধান |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` JVM `< 21` শনাক্ত করে | Java 21 LTS বা তার পরবর্তী সংস্করণে চালান |
| `InvalidConfigurationException` (`error.configuration.jwt`) | `fail-fast-weak-jwt-secret=true` এবং কাস্টম `jwt-secret` `< 32` UTF-8 বাইট | `${JWT_SECRET}` ন্যূনতম 32 বাইট নির্ধারণ করুন |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` বা `maxPageSize < 1` | `app.framework.query-guardrails.*`-এ ধনাত্মক পূর্ণসংখ্যা দিন |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` বা `ComputedFieldFailFastUtil` `@Id` অনুপস্থিত, নো-আর্গ কনস্ট্রাক্টর অনুপস্থিত বা অবৈধ `@ComputedField` ফিল্ড পায় | `BaseAuditEntity` এক্সটেন্ড করুন, `@NoArgsConstructor` রাখুন এবং সঠিক ফিল্ড নাম মেলান |
