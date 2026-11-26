# 01. Hızlı Başlangıç, İki Dizin Sözleşmesi ve Fail-Fast Başlatma Tanıları (`0.1.0`)

> **Diller**: **Türkçe** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz (EN)](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#quickstart)

---

## 1. Katı İki Dizinli Alan Sözleşmesi (`entity/` ve `controller/`)

**`io.github.natswarchuan:spring-nwvmc:0.1.0`** kullanan Spring Boot uygulamaları iş alanlarını yalnızca iki dizinde düzenler:

1. `entity/`: `BaseAuditEntity` sınıfını genişleten JPA varlıkları (yerleşik UUIDv7 birincil anahtar ve `@Version` iyimser kilitleme), Bean Validation kısıtları (`jakarta.validation.constraints.*`), B-Tree indeksleri ve bildirimsel anotasyonlar (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: `@AutoRestController` ile işaretli ve `AutoApiController<E>` veya `AutoReadApi<E>` gibi birleştirilebilir alt arayüzleri genişleten işaretçi arayüzler (standart Spring MVC `@RequestBody`/`@RequestParam`/`@PathVariable` da desteklenir).

Standart CRUD ötesindeki iş akışları `Service` arayüzleri ile bağımsız Spring `@Service` / `@Component` `public final class` `Helper` bean’lerinde yer alır ve `@CustomEndpoint` veya `@ServiceOverride` üzerinden bağlanır (`@AutoService` / `@AutoComponent` yalnızca `"io.github.natswarchuan"` paketini tarar; varlıklar `io.github.natswarchuan`, `com.example`, `io.github` dışındaysa `@EntityScan` ekleyin).

---

## 2. Maven ve Gradle Kurulumu (`pom.xml` / `build.gradle.kts`)

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

[JitPack](https://jitpack.io) üzerinden doğrudan GitHub derlemeleri için:

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

## 3. Üretim Temel Yapılandırması (`application.yml`)

`spring-boot-configuration-processor`, `META-INF/spring-configuration-metadata.json` dosyasını sağlar (`app.framework.*` ve `spring-nwvmc.human-policies` altında `20` `*Properties` modeli ve `16` `@AutoConfigurationBean`/`@ConfigurationProperties` sınıfından `18` grup). `ControllerToApiProperties` içindeki eski üst düzey alanlar uyumluluk için açılışta doğrulanır; canlı rotalar `@AutoRestController(basePath = ...)`, sorgu sınırları ise `app.framework.query-guardrails.*` ile yönetilir:

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

> **Yerel Geliştirme İpucu:** `JWT_SECRET` henüz tanımlı değilse `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` değerini yalnızca `application-dev.yml` içine koyun (`application.yml`/`application-prod.yml` fail-closed kalsın).

---

## 4. Ayrıntılı Uç Nokta Filtreleme (`enabledEndpoints` ve `disabledEndpoints`)

`EndpointFeatureFilterHelper`, `AutoApiController<E>` üzerindeki tam metot adlarını büyük/küçük harf duyarsız eşleştirir (`equalsIgnoreCase(methodName)`, örn. `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Açılışta Fail-Fast Tanıları (`StartupDiagnosticsUtil` ve `EntityFailFastValidatorUtil`)

| İstisna | Tetikleme Koşulu | Çözüm |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` JVM `< 21` algılar | Java 21 LTS veya daha yeni sürümde çalıştırın |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` ve özel `jwt-secret` `< 32` UTF-8 bayt | `${JWT_SECRET}` değerini en az 32 bayt yapın |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1` veya `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | `app.framework.query-guardrails.*` altında pozitif tam sayılar tanımlayın |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` veya `ComputedFieldFailFastUtil` eksik `@Id`, eksik parametresiz yapıcı veya geçersiz `@ComputedField` alanı algılar | `BaseAuditEntity` genişletin, `@NoArgsConstructor` koruyun ve tam alan adlarını eşleştirin |
