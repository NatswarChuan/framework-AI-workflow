# 01. Memulai Cepat, Kontrak Dua Direktori & Diagnostik Fail-Fast (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/01_GETTING_STARTED.md) | [Tiếng Việt](../vi/01_GETTING_STARTED.md) | [日本語](../ja/01_GETTING_STARTED.md) | [中文](../zh/01_GETTING_STARTED.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap (EN)](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#quickstart)

---

## 1. Kontrak Domain Dua Direktori Ketat (`entity/` & `controller/`)

Aplikasi berbasis **`io.github.natswarchuan:spring-nwvmc:0.1.0`** menyusun domain bisnis hanya dalam dua direktori utama:

1. `entity/`: Entitas JPA yang memperluas `BaseAuditEntity` (dilengkapi kunci primer UUIDv7 dan optimistic locking `@Version`), berisi validasi Bean Validation (`jakarta.validation.constraints.*`), indeks B-Tree, serta anotasi deklaratif (`@EntitySecurity`, `@FieldSecurity`, `@StateMachine`, `@AutoCode`, `@AutoSlug`, `@UniqueField`, `@ComputedField`, `@AuditTrail`, `@MultiTenant`).
2. `controller/`: Antarmuka penanda beranotasi `@AutoRestController` yang memperluas `AutoApiController<E>` atau sub-antarmuka komposabel seperti `AutoReadApi<E>` (mendukung pula `@RequestBody`/`@RequestParam`/`@PathVariable` standar Spring MVC).

Alur domain di luar CRUD standar ditempatkan pada antarmuka `Service` serta bean Spring `@Service` / `@Component` (`public final class` `Helper`) yang diarahkan lewat `@CustomEndpoint` atau `@ServiceOverride` (`@AutoService` / `@AutoComponent` hanya memindai `"io.github.natswarchuan"`, dan tambahkan `@EntityScan` jika entitas berada di luar `io.github.natswarchuan`, `com.example`, `io.github`).

---

## 2. Pengaturan Maven & Gradle (`pom.xml` / `build.gradle.kts`)

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

Untuk build langsung dari GitHub melalui [JitPack](https://jitpack.io):

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

## 3. Konfigurasi Dasar Produksi (`application.yml`)

`spring-boot-configuration-processor` menyertakan `META-INF/spring-configuration-metadata.json` (`18` grup metadata dari `16` kelas `@AutoConfigurationBean`/`@ConfigurationProperties` pada `20` model `*Properties` di bawah `app.framework.*` dan `spring-nwvmc.human-policies`). Bidang lama pada `ControllerToApiProperties` tetap divalidasi saat boot untuk kompatibilitas, sedangkan rute aktif memakai `@AutoRestController(basePath = ...)` dan batas kueri memakai `app.framework.query-guardrails.*`:

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

> **Tip Dev Lokal:** Jika `JWT_SECRET` belum diekspor, tambahkan `jwt-secret: ${JWT_SECRET:dev-only-change-me-at-least-32-bytes-long!}` hanya di `application-dev.yml` (jaga `application.yml`/`application-prod.yml` tetap fail-closed).

---

## 4. Penyaringan Endpoint Granular (`enabledEndpoints` & `disabledEndpoints`)

`EndpointFeatureFilterHelper` mencocokkan nama metode persis pada `AutoApiController<E>` tanpa peka huruf besar/kecil (`equalsIgnoreCase(methodName)`, misalnya `batchChunked`, `deleteById`, `importCsv`):

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

## 5. Diagnostik Fail-Fast Saat Startup (`StartupDiagnosticsUtil` & `EntityFailFastValidatorUtil`)

| Pengecualian | Kondisi Pemicu | Solusi |
| :--- | :--- | :--- |
| `UnsupportedJavaVersionException` | `JavaVersionGuardUtil.enforceJava21OrHigher()` mendeteksi JVM `< 21` | Jalankan pada Java 21 LTS atau lebih baru |
| `InvalidConfigurationException` (`error.configuration.invalid`) | `fail-fast-weak-jwt-secret=true` dan `jwt-secret` khusus `< 32` byte UTF-8 | Atur `${JWT_SECRET}` minimal 32 byte |
| `InvalidConfigurationException` (`ERR_INVALID_GUARDRAIL_LIMIT`) | `maxJoinDepth < 1`, `maxFilterCriteria < 1`, atau `maxPageSize < 1` / `maxUnpagedFetchLimit < 1` | Atur bilangan bulat positif di bawah `app.framework.query-guardrails.*` |
| `InvalidConfigurationException` (`error.configuration.entity`) | `EntityFailFastValidatorUtil` atau `ComputedFieldFailFastUtil` menemukan `@Id` hilang, konstruktor tanpa argumen hilang, atau field `@ComputedField` tidak valid | Perluas `BaseAuditEntity`, pertahankan `@NoArgsConstructor`, dan cocokkan nama field persis |
