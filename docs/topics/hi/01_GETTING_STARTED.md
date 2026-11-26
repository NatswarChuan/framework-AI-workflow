# 01. त्वरित आरंभ, दो-डायरेक्टरी अनुबंध और Fail-Fast स्टार्टअप निदान (`0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल (EN)](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#quickstart)

---

## 1. सख्त दो-डायरेक्टरी डोमेन अनुबंध (`entity/` और `controller/`)

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** के साथ निर्मित Spring Boot एप्लिकेशन व्यवसाय डोमेन को केवल दो डायरेक्टरी में व्यवस्थित करते हैं:

1. `entity/`: `BaseAuditEntity` (अंतर्निहित UUIDv7 प्राइमरी की और `@Version` ऑप्टिमिस्टिक लॉकिंग) को विस्तृत करने वाली JPA एंटिटी, जिनमें Bean Validation (`jakarta.validation.constraints.*`), B-Tree इंडेक्स और डिक्लेरेटिव एनोटेशन (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`) होते हैं।
2. `controller/`: `@AutoRestController` से चिह्नित मार्कर इंटरफ़ेस जो `AutoApiController<E>` या `AutoReadApi<E>` जैसे संयोज्य उप-इंटरफ़ेस का विस्तार करते हैं (मानक Spring MVC `@RequestBody`/`@RequestParam`/`@PathVariable` भी समर्थित हैं)।

सामान्य CRUD से परे डोमेन वर्कफ़्लो `Service` इंटरफ़ेस और स्वतंत्र Spring `@Service` / `@Component` (`public final class` `Helper`) बीन्स में रहते हैं जिन्हें `@CustomEndpoint` या `@ServiceOverride` द्वारा जोड़ा जाता है (`@AutoService` / `@AutoComponent` केवल `"io.github.natswarchuan"` को स्कैन करते हैं; यदि एंटिटी `io.github.natswarchuan`, `com.example`, `io.github` के बाहर हों तो `@EntityScan` जोड़ें)।

---

## 2. Maven और Gradle सेटअप (`pom.xml` / `build.gradle.kts`)

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

[JitPack](https://jitpack.io) के माध्यम से सीधे GitHub बिल्ड के लिए:

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

## 3. प्रोडक्शन बेसलाइन कॉन्फ़िगरेशन (`application.yml`)

`spring-boot-configuration-processor` `META-INF/spring-configuration-metadata.json` (`app.framework.*` और `spring-nwvmc.human-policies` के अंतर्गत `20` `*Properties` मॉडल व `16` `@AutoConfigurationBean`/`@ConfigurationProperties` वर्गों से `18` मेटाडेटा समूह) प्रदान करता है। `ControllerToApiProperties` के पुराने फ़ील्ड संगतता हेतु बूट-सत्यापित रहते हैं जबकि सक्रिय रूट `@AutoRestController(basePath = ...)` व सीमाएँ `app.framework.query-guardrails.*` से नियंत्रित होती हैं:

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

> **लोकल देव सुझाव:** यदि `JWT_SECRET` सेट नहीं है, तो `application-dev.yml` में `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` जोड़ें (`application.yml`/`application-prod.yml` हमेशा fail-closed रखें)।

---

## 4. सूक्ष्म एंडपॉइंट फ़िल्टरिंग (`enabledEndpoints` और `disabledEndpoints`)

`EndpointFeatureFilterHelper` केस-इनसेंसिटिव रूप से `AutoApiController<E>` के सटीक मेथड नाम से मिलान करता है (`equalsIgnoreCase(methodName)`, जैसे `batchChunked`, `deleteById`, `importCsv`):

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

## 5. स्टार्टअप Fail-Fast निदान (`StartupDiagnosticsUtil` और `EntityFailFastValidatorUtil`)

| अपवाद (Exception) | ट्रिगर स्थिति | समाधान |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` JVM `< 21` का पता लगाता है | Java 21 LTS या नए संस्करण पर चलाएँ |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` और कस्टम `jwt-secret` `< 32` UTF-8 बाइट्स | `${JWT_SECRET}` को कम से कम 32 बाइट्स का सेट करें |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` या `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | `app.framework.query-guardrails.*` के अंतर्गत धनात्मक पूर्णांक कॉन्फ़िगर करें |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` या `ComputedFieldFailFastUtil` को `@Id` की कमी, नो-आर्ग कंस्ट्रक्टर की कमी या अमान्य `@ComputedField` फ़ील्ड मिले | `BaseAuditEntity` विस्तृत करें, `@NoArgsConstructor` बनाए रखें और सटीक फ़ील्ड नाम मिलाएँ |
