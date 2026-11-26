# 06. Spesifikasi Lengkap 60 Anotasi Deklaratif (`0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap (EN)](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#annotations)

Referensi teknis menyeluruh untuk seluruh **60 Anotasi Deklaratif** pada `io.github.natswarchuan:spring-nwvmc:0.1.0`, diekstrak langsung dari deklarasi Java `@interface`: paket persis, `@Target`, **setiap atribut**, tipe Java, nilai default, status wajib/opsional, **cara penggunaan**, **kapan digunakan**, **kapan TIDAK digunakan & jebakan umum**, beserta cuplikan kode Java terverifikasi.

## Indeks Matriks Cepat (60 Anotasi)

| Anotasi | Kategori | `@Target` | Ringkasan Atribut | Tujuan Utama |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Mengubah antarmuka turunan AutoApiController<E> menjadi JDK Dynamic Proxy runtime dengan 40 kontrak (38 tampil default di Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Mengalihkan satu kontrak controller ke metode bean Spring kustom melalui MethodHandleCacheUtil alih-alih CRUD dinamis. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Mengikat rute alur bisnis khusus (checkout, refund, approval) ke bean Spring @Component Helper independen. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Pengganti Pure Java untuk @GetMapping tanpa impor statis Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Deklarasi rute HTTP POST Pure Java dengan dukungan media type consumes/produces kustom. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Pemetaan rute HTTP PUT Pure Java untuk penggantian sumber daya secara penuh. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Deklarasi HTTP PATCH Pure Java dengan dukungan merge parsial, increment atomik, dan RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Deklarasi HTTP DELETE Pure Java yang memicu penghapusan lunak terjaga status. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Mengikat parameter kueri URL atau peta filter dinamis Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Mengikat variabel jalur URI seperti ID entitas UUIDv7. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Mendeserialisasi payload JSON HTTP menjadi parameter DTO atau Entitas bersama @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Mengizinkan penelusuran rekursif relasi anak melalui GET /{id}/{relation}/** dengan penolakan siklus. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Mendeklarasikan transisi status domain atau penyesuaian numerik pada metode aksi kustom. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Penanda komponen framework yang didaftarkan saat boot tanpa impor @Component saat kompilasi. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Penanda lapisan layanan untuk kelas ServiceImpl yang dipasangkan dengan @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Mendeklarasikan metode pabrik bean terkelola di dalam kelas @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Menandai kelas konfigurasi dan model pengikatan properti YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Mengatur urutan prioritas eksekusi antar bean SPI Customizer dan rantai filter. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Menegakkan RBAC NIST Level 2, isolasi ownerField tingkat baris, serta kode izin sebelum kueri atau mutasi. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Menyamarkan atau mengosongkan kolom sensitif secara dinamis bila peran pemanggil tidak berwenang. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Menegakkan transisi status sah via POST /{id}/transition dan membatasi DELETE /{id} hanya pada deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Mengompilasi klausa kebijakan yang mudah dibaca menjadi aturan RBAC, transisi, dan penyamaran aktif. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Mencatat selisih tingkat field di setiap mutasi untuk rekonstruksi Time-Travel dan inspeksi /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Mengisolasi kueri dan mutasi baris secara otomatis menurut konteks tenant aktif kecuali peran bypass. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Anotasi penanda — tanpa atribut)` | Memvalidasi keunikan sebelum persistensi saat create, update, dan upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (WAJIB)` | Menghasilkan kode bisnis unik berawalan otomatis saat pembuatan atau kloning bila dikosongkan. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (WAJIB)` | Menghasilkan slug ASCII ramah URL yang dinormalisasi secara otomatis dari sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Menghitung total numerik turunan secara otomatis sebelum menyimpan perubahan entitas. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Memungkinkan pengikatan kueri SQL/JPQL kustom atau metode penyedia ke endpoint controller. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Menunjuk entitas JPA sebagai tabel katalog Peran RBAC dinamis di basis data. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan kolom kode peran unik di dalam entitas @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Mengidentifikasi field nama tampilan peran pada entitas @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Menandai field koleksi atau string CSV yang menyimpan kode izin milik peran. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Menandai entitas JPA penyimpan izin sumber-daya-aksi dan aturan penyamaran kolom dinamis. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Menunjuk field pengenal izin unik di dalam @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan nama entitas atau sumber daya API tujuan (atau wildcard *) di @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan kata kerja aksi CRUD atau kustom yang dilindungi aturan @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Mendeklarasikan daftar kolom dipisah koma yang disamarkan secara dinamis saat aturan izin aktif. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Memetakan entitas JPA pengikat subjek pengguna terautentikasi ke peran DB dan cakupan tenant. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Mengidentifikasi field subjek utama / username pada @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Mengikat kolom kode peran yang ditetapkan di dalam @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Membatasi penugasan @SecurityUserRoleEntity pada ID tenant tertentu (atau * untuk global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Menandai entitas JPA penyimpan kebijakan ALLOW / DENY eksplisit yang diurutkan menurut priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan pola pengenal sumber daya tujuan pada entitas @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan kata kerja operasi terproteksi (READ, WRITE, DELETE, methodName, *) pada @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Memetakan koleksi atau daftar peran dipisah koma yang menjadi target aturan @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotasi penanda — tanpa atribut)` | Menentukan hasil keputusan ALLOW atau DENY pada aturan @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Menyeragamkan akses serentak pada kunci SpEL ter-cache AST (default waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Mencegah penulisan duplikat serentak maupun replay dalam jendela TTL yang dapat dikonfigurasi. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Menegakkan pembatasan laju permintaan jendela geser per partisi IP, User, atau Tenant. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Membungkus operasi dalam Circuit Breaker Resilience4j dengan telemetri ke Actuator & Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Mengulang otomatis kegagalan sementara dengan jeda eksponensial terkonfigurasi. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Menghitung ETag lemah RFC 7232 (W/"...") serta mengeluarkan Cache-Control dan respons HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Menyimpan hasil metode baca sisi server di dalam mesin Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Menghapus entri cache sisi server yang usang saat terjadi mutasi. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Memprofilkan durasi eksekusi dan mencatat log WARN bila panggilan lambat melebihi ambang. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Mengirim webhook keluar bertanda tangan HMAC-SHA256 secara asinkron di Virtual Threads pasca-komit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Menerbitkan amplop CNCF CloudEvents v1.0 setelah komit transaksi. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Mengikat operasi entitas atau kueri ke kunci sumber data logis tertentu. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Menetapkan jenis mesin basis data dan shard klaster logis per entitas. |

---

## 1. Routing, Kontrak API Dinamis, Pemisahan DTO & Pengikatan Parameter (13 Anotasi)

### `@AutoRestController`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Tujuan**: Mengubah antarmuka turunan AutoApiController<E> menjadi JDK Dynamic Proxy runtime dengan 40 kontrak (38 tampil default di Swagger UI).
- **Perilaku Runtime**: DynamicControllerProxyRegistrarHelper memindai controller aktif saat boot dan mendaftarkan rute ke RequestMappingHandlerMapping.
- **Cara Menggunakan**: Pasang `@AutoRestController(basePath = "/api/v1/...")` pada interface Java turunan `AutoApiController<E>` atau `AutoReadApi<E>`, lalu atur `disabledEndpoints` dan DTO.
- **Kapan Digunakan**: Gunakan untuk mengekspos CRUD standar, paginasi, filter, keyset, analitik, atau API baca-saja untuk entitas JPA tanpa boilerplate.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pasang di kelas konkret `@RestController` atau alur tanpa entitas JPA; untuk baca-saja gunakan `AutoReadApi<E>`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Tidak (Opsional) | Jalur HTTP valid yang diawali `/` (mis. `/api/v1/product-catalogs`) atau string kosong `""` untuk derivasi otomatis.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Path URI root eksplisit (mis. "/api/v1/product-catalogs"). Jika kosong, diturunkan otomatis dalam kebab-case jamak.<br/>*Catatan:* Saat startup registrar mengevaluasi `basePath` sebelum `path`. Hindari nilai yang saling bertentangan. |
| `path` | `String` | `""` | Tidak (Opsional) | Jalur HTTP valid yang diawali `/` (mis. `/api/v1/orders`) atau string kosong `""` untuk derivasi otomatis.<br/>`@AutoRestController(path = "/api/v1/orders")` | Alias jalur root. Utamakan basePath karena DynamicControllerProxyRegistrarHelper memprioritaskannya.<br/>*Catatan:* Saat startup registrar mengevaluasi `basePath` sebelum `path`. Hindari nilai yang saling bertentangan. |
| `entityName` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"ProductCatalog"`); biarkan `""` untuk konvensi default.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Mengganti nama entitas yang tampil di metadata OpenAPI/Studio.<br/>*Catatan:* Tampil langsung di Swagger / OpenAPI 3.0 dan NWVMC Studio; simpan teks di `OpenApiConstant` agar bebas hard-code. |
| `enabledEndpoints` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Daftar putih nama metode yang diizinkan (mis. "getPage", "create"). Kosong berarti semua aktif.<br/>*Catatan:* Berfungsi sebagai daftar putih ketat: bila diisi, semua metode di luar daftar tidak didaftarkan ke Spring MVC maupun Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | Daftar hitam untuk menonaktifkan metode tertentu sebelum registrasi Spring MVC.<br/>*Catatan:* Dievaluasi setelah `enabledEndpoints`; ideal untuk memblokir endpoint destruktif atau massal sambil mempertahankan kontrak lainnya. |
| `enableNestedSubResources` | `boolean` | `false` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Mengaktifkan navigasi sub-sumber daya rekursif GET /{id}/**. Default false mencegah pembengkakan rute.<br/>*Catatan:* Biarkan `false` kecuali membutuhkan navigasi `GET /{id}/items/...`; saat aktif, batasi relasi dengan `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas Java konkret apa pun (mis. `ProductReadDto.class`) atau `Void.class` untuk menonaktifkan pemetaan DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO baca opsional untuk menyembunyikan field internal entitas saat serialisasi.<br/>*Catatan:* Berlaku khusus pada alur baca (GET); kelas DTO memerlukan konstruktor tanpa argumen/getter dan mendukung `@Valid` serta `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas Java konkret apa pun (mis. `ProductCreateDto.class`) atau `Void.class` untuk menonaktifkan pemetaan DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO input opsional yang divalidasi dengan Jakarta Validation sebelum pemetaan POST ke entitas.<br/>*Catatan:* Berlaku khusus pada alur buat (POST); kelas DTO memerlukan konstruktor tanpa argumen/getter dan mendukung `@Valid` serta `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas Java konkret apa pun (mis. `ProductUpdateDto.class`) atau `Void.class` untuk menonaktifkan pemetaan DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO pembaruan opsional yang membatasi field yang dapat ditulis pada PUT/PATCH.<br/>*Catatan:* Berlaku khusus pada alur pembaruan (PUT/PATCH); kelas DTO memerlukan konstruktor tanpa argumen/getter dan mendukung `@Valid` serta `@FieldSecurity`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Mengalihkan satu kontrak controller ke metode bean Spring kustom melalui MethodHandleCacheUtil alih-alih CRUD dinamis.
- **Perilaku Runtime**: EscapeHatchDispatchHelper menentukan bean tujuan lalu menyimpan cache MethodHandle di MethodHandleCacheUtil.
- **Cara Menggunakan**: Anote metode pada interface dengan `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` dan tandai kelas target dengan `@Service`/`@Component`.
- **Kapan Digunakan**: Gunakan bila mayoritas endpoint memakai CRUD otomatis, tetapi satu metode memerlukan logika Java kustom.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN isi `targetBean` dengan string (harus `Class<?>`; gunakan `beanName`). Hindari jika aturan deklaratif sudah mencukupi.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas bean Spring `@Service`/`@Component` konkret (mis. `OrderCustomService.class`), atau `Void.class` untuk resolusi via `beanName`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Kelas bean Spring target (diprioritaskan di atas beanName).<br/>*Catatan:* Saat startup registrar mengevaluasi `targetBean` sebelum `beanName`. Hindari nilai yang saling bertentangan. |
| `beanName` | `String` | `""` | Tidak (Opsional) | Nama bean persis yang terdaftar di ApplicationContext (mis. `"orderCustomService"`) atau `""` untuk resolusi otomatis.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Nama bean eksplisit di container Spring saat targetBean bernilai Void.class.<br/>*Catatan:* Saat startup registrar mengevaluasi `targetBean` sebelum `beanName`. Hindari nilai yang saling bertentangan. |
| `methodName` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"createOrder"`); biarkan `""` untuk konvensi default.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nama metode pada bean target; kosong berarti mengikuti nama metode controller.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"createOrder"`); ketidakcocokan memicu error runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Tidak (Opsional) | `true` (default — aktifkan override dan panggil bean target) atau `false` (nonaktifkan override dan jalankan CRUD default).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Jika true, memintas dispatch CRUD default dan memanggil bean kustom via MethodHandleCacheUtil.<br/>*Catatan:* Saat `true` (default), `EscapeHatchDispatchHelper` memanggil bean Anda. Mengatur `false` menonaktifkan `@ServiceOverride` penuh sehingga CRUD default berjalan (BUKAN pre/post hook). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Mengikat rute alur bisnis khusus (checkout, refund, approval) ke bean Spring @Component Helper independen.
- **Perilaku Runtime**: Memanggil delegateBean.delegateMethod lewat MethodHandle ter-cache dengan validasi dan transaksi penuh.
- **Cara Menggunakan**: Deklarasikan metode di interface dengan `path`, `httpMethod`, `delegateBean`, dan `delegateMethod` menuju bean Spring helper.
- **Kapan Digunakan**: Gunakan untuk aksi domain khusus seperti checkout, pengembalian dana, persetujuan, atau transaksi lintas-entitas.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN andalkan interceptor proxy di sini (`ControllerProxySpecialRouteUtil` berjalan sebelum `invokeProtectedOperation`); taruh AOP di bean `@Service` delegasi dan gunakan `@BusinessAction` untuk transisi sederhana.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/reports/monthly-sales`); `""` mengikat ke root.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Jalur relatif di bawah basePath controller (mis. "/checkout").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `path` tidak valid langsung gagal cepat (fail-fast). |
| `httpMethod` | `String` | `"GET"` | Tidak (Opsional) | Salah satu nilai yang didukung: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Kata kerja HTTP ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `httpMethod` tidak valid langsung gagal cepat (fail-fast). |
| `delegateBean` | `String` | `""` | Tidak (Opsional) | Nama bean persis yang terdaftar di ApplicationContext (mis. `"orderReportService"`) atau `""` untuk resolusi otomatis.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nama bean Spring yang menjalankan logika alur kerja (wajib kecuali ada metode default atau @ServiceOverride).<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `delegateBean` tidak valid langsung gagal cepat (fail-fast). |
| `delegateMethod` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"buildMonthlyReport"`); biarkan `""` untuk konvensi default.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nama metode pada delegateBean; kosong mengikuti metode controller.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"buildMonthlyReport"`); ketidakcocokan memicu error runtime. |
| `summary` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"Get monthly revenue breakdown"`); biarkan `""` untuk konvensi default.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Ringkasan singkat operasi OpenAPI 3.0 pada Swagger UI.<br/>*Catatan:* Tampil langsung di Swagger / OpenAPI 3.0 dan NWVMC Studio; simpan teks di `OpenApiConstant` agar bebas hard-code. |
| `description` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"Aggregates confirmed invoice totals grouped by currency"`); biarkan `""` untuk konvensi default.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Deskripsi detail OpenAPI 3.0 saat endpoint dibuka di Swagger UI.<br/>*Catatan:* Tampil langsung di Swagger / OpenAPI 3.0 dan NWVMC Studio; simpan teks di `OpenApiConstant` agar bebas hard-code. |

```java
@CustomEndpoint(
    path = "/checkout-cart",
    httpMethod = "POST",
    delegateBean = "advancedOrderCheckoutHelper",
    delegateMethod = "checkoutCart",
    summary = "Checkout cart"
)
```

### `@AutoGet`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Pengganti Pure Java untuk @GetMapping tanpa impor statis Spring Web.
- **Perilaku Runtime**: Dipetakan ke RequestMappingInfo HTTP GET saat bootstrap proxy.
- **Cara Menggunakan**: Pasang `@AutoGet("/jalur")` pada metode interface `@AutoRestController` (biasanya bersama `@ServiceOverride` atau `@CustomQuery`).
- **Kapan Digunakan**: Gunakan untuk rute HTTP GET baca-saja di antarmuka Pure Java tanpa mengimpor `@GetMapping`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN gunakan untuk operasi yang mengubah data di database atau di dalam kelas `@RestController` biasa.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/{id}/summary`); `""` mengikat ke root.<br/>`@AutoGet("/{id}/summary")` | Templat path GET relatif (mis. "/metrics"). Kosong memetakan langsung ke basePath.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `produces` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json", "text/csv"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Tipe media respons opsional (mis. "text/event-stream", "text/csv").<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Accept`; header tidak cocok mengembalikan `406` atau `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Deklarasi rute HTTP POST Pure Java dengan dukungan media type consumes/produces kustom.
- **Perilaku Runtime**: Terdaftar sebagai handler HTTP POST di SpringMvcEndpointBridge.
- **Cara Menggunakan**: Anote metode pembuatan/aksi dengan `@AutoPost("/jalur")`, ikat payload memakai `@AutoBody`/`@RequestBody` dengan `@BusinessAction` atau `@ServiceOverride`.
- **Kapan Digunakan**: Gunakan untuk pembuatan data, perintah aksi, pengiriman batch, atau rute POST alur kerja.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai untuk pembacaan (`@AutoGet`), penggantian penuh (`@AutoPut`), pembaruan parsial (`@AutoPatch`), atau penghapusan (`@AutoDelete`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/{id}/approve`); `""` mengikat ke root.<br/>`@AutoPost("/{id}/approve")` | Templat path POST relatif di bawah basePath.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `consumes` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json", "multipart/form-data"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Tipe Content-Type permintaan yang diterima.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Content-Type`; header tidak cocok mengembalikan `406` atau `415`. |
| `produces` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Tipe media respons yang dihasilkan.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Accept`; header tidak cocok mengembalikan `406` atau `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Pemetaan rute HTTP PUT Pure Java untuk penggantian sumber daya secara penuh.
- **Perilaku Runtime**: Diikat sebagai handler HTTP PUT di dalam eksekusi transaksional.
- **Cara Menggunakan**: Pasang `@AutoPut("/{id}")` pada metode pembaruan penuh bersama `@AutoVariable` dan `@AutoBody`.
- **Kapan Digunakan**: Gunakan untuk penggantian sumber daya penuh yang idempoten dengan payload lengkap.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN gunakan untuk pembaruan parsial (pilih `@AutoPatch` atau `@BusinessAction`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/{id}/replace`); `""` mengikat ke root.<br/>`@AutoPut("/{id}/replace")` | Templat path PUT relatif (mis. "/{id}").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `consumes` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Tipe Content-Type permintaan yang didukung.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Content-Type`; header tidak cocok mengembalikan `406` atau `415`. |
| `produces` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Tipe media respons yang dihasilkan.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Accept`; header tidak cocok mengembalikan `406` atau `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Deklarasi HTTP PATCH Pure Java dengan dukungan merge parsial, increment atomik, dan RFC 6902 JSON Patch.
- **Perilaku Runtime**: Mendukung semantik penggabungan JSON serta application/json-patch+json.
- **Cara Menggunakan**: Pasang `@AutoPatch("/{id}/aksi")` pada metode pembaruan parsial atau `@BusinessAction`.
- **Kapan Digunakan**: Gunakan untuk perubahan sebagian, penyesuaian angka atomik, dan transisi status.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN digunakan bila seluruh entitas wajib diganti (`@AutoPut`) atau untuk pembuatan baru (`@AutoPost`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/{id}/status`); `""` mengikat ke root.<br/>`@AutoPatch("/{id}/status")` | Templat path PATCH relatif (mis. "/{id}/approve").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `consumes` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json", "application/merge-patch+json"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Tipe Content-Type yang diterima.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Content-Type`; header tidak cocok mengembalikan `406` atau `415`. |
| `produces` | `String[]` | `{}` | Tidak (Opsional) | Array tipe media MIME (mis. `{"application/json"}`); `{}` kosong memakai default `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Tipe media respons yang dihasilkan.<br/>*Catatan:* Diterapkan oleh negosiasi konten Spring MVC pada header `Accept`; header tidak cocok mengembalikan `406` atau `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Deklarasi HTTP DELETE Pure Java yang memicu penghapusan lunak terjaga status.
- **Perilaku Runtime**: Memvalidasi @StateMachine deletableStates sebelum menandai deleted=true.
- **Cara Menggunakan**: Pasang `@AutoDelete("/{id}/kustom")` pada metode hapus khusus bersama `@ServiceOverride`.
- **Kapan Digunakan**: Gunakan untuk pengarsipan khusus, override soft-delete, atau pembersihan bertingkat via DELETE.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN mendefinisikan ulang jika soft-delete bawaan dengan `@StateMachine` sudah mencukupi.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Sub-jalur URI relatif dengan templat `{pathVar}` opsional (mis. `/{id}/archive`); `""` mengikat ke root.<br/>`@AutoDelete("/{id}/archive")` | Templat path DELETE relatif (mis. "/{id}/purge").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Tujuan**: Mengikat parameter kueri URL atau peta filter dinamis Map<String, String>.
- **Perilaku Runtime**: Diekstrak lewat DynamicQueryParameterParserHelper dengan validasi QueryGuardrailEnforcerUtil.
- **Cara Menggunakan**: Pasang pada parameter metode: `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")`.
- **Kapan Digunakan**: Gunakan untuk menjaga interface tetap 100% Pure Java tanpa impor Spring Web saat membaca query parameter.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai untuk path variable (`@AutoVariable`) maupun body JSON (`@AutoBody`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"status"`); biarkan `""` untuk konvensi default.<br/>`@AutoParam("status") String status` | Nama parameter kueri yang diikat (alias name). Kosong memakai nama parameter Java.<br/>*Catatan:* Saat startup registrar mengevaluasi `value` sebelum `name`. Hindari nilai yang saling bertentangan. |
| `name` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"pageSize"`); biarkan `""` untuk konvensi default.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Nama parameter kueri secara eksplisit.<br/>*Catatan:* Saat startup registrar mengevaluasi `value` sebelum `name`. Hindari nilai yang saling bertentangan. |
| `required` | `boolean` | `true` | Tidak (Opsional) | `true` (wajib; kosong menghasilkan HTTP 400) atau `false` (opsional; null dikirim bila kosong).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Apakah ketiadaan parameter memicu HTTP 400.<br/>*Catatan:* Otomatis opsional bila `defaultValue` diisi; gunakan tipe wrapper (`Integer`, `Boolean`) alih-alih primitif saat `false` untuk mencegah NPE. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"20"`); biarkan `""` untuk konvensi default.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Nilai fallback saat parameter kosong; default sentinel DEFAULT_NONE.<br/>*Catatan:* Dikonversi dari String melalui Spring `ConversionService` ke tipe target; nilai tidak valid gagal dengan HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Tujuan**: Mengikat variabel jalur URI seperti ID entitas UUIDv7.
- **Perilaku Runtime**: Diparsing menjadi nilai Java UUID/String bertipe kuat dari templat rute MVC.
- **Cara Menggunakan**: Pasang pada parameter ID jalur seperti `findById(@AutoVariable("id") UUID id)`.
- **Kapan Digunakan**: Gunakan saat mengekstrak `{id}`, `{slug}`, atau `{code}` pada interface Pure Java.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai untuk parameter query (`@AutoParam`) maupun body JSON (`@AutoBody`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"orderId"`); biarkan `""` untuk konvensi default.<br/>`@AutoVariable("orderId") UUID orderId` | Nama variabel path URI.<br/>*Catatan:* Saat startup registrar mengevaluasi `value` sebelum `name`. Hindari nilai yang saling bertentangan. |
| `name` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"tenantCode"`); biarkan `""` untuk konvensi default.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Nama eksplisit variabel path URI.<br/>*Catatan:* Saat startup registrar mengevaluasi `value` sebelum `name`. Hindari nilai yang saling bertentangan. |
| `required` | `boolean` | `true` | Tidak (Opsional) | `true` (wajib; kosong menghasilkan HTTP 400) atau `false` (opsional; null dikirim bila kosong).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Apakah variabel path wajib ada.<br/>*Catatan:* Nama harus cocok dengan `{variableName}` pada templat URI; `false` hanya berguna jika ada pola URI opsional. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Tujuan**: Mendeserialisasi payload JSON HTTP menjadi parameter DTO atau Entitas bersama @Valid.
- **Perilaku Runtime**: Divalidasi menggunakan LocalValidatorFactoryBean sebelum memasuki transaksi layanan.
- **Cara Menggunakan**: Pasang `@AutoBody` (bersama `@Valid`) pada parameter payload metode `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Kapan Digunakan**: Untuk mendeserialisasi JSON body menjadi entitas atau DTO pada proxy Pure Java.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pasang pada metode GET/DELETE atau lebih dari satu `@AutoBody` per metode.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Tidak (Opsional) | `true` (wajib; kosong menghasilkan HTTP 400) atau `false` (opsional; null dikirim bila kosong).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Apakah body permintaan yang kosong memicu HTTP 400.<br/>*Catatan:* Padukan dengan `@Valid` untuk validasi Jakarta sebelum dispatch; `false` mengizinkan body kosong tanpa error `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Mengizinkan penelusuran rekursif relasi anak melalui GET /{id}/{relation}/** dengan penolakan siklus.
- **Perilaku Runtime**: Memerlukan @AutoRestController(enableNestedSubResources = true) pada controller.
- **Cara Menggunakan**: Aktifkan `enableNestedSubResources = true` dan batasi relasi menggunakan `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **Kapan Digunakan**: Gunakan bila URL bersarang seperti `GET /api/v1/customer-orders/{id}/items` dibutuhkan beserta pemeriksaan keamanan tiap level.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dibuka tanpa `allowedRelationships` pada tabel kompleks atau lintas Bounded Context.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Daftar putih opsional kelas entitas target pada penelusuran GET /{id}/**.<br/>*Catatan:* Array kosong membuka semua entitas anak; cantumkan kelas secara eksplisit agar tabel internal tidak ikut terekspos. |
| `allowedRelationships` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Daftar putih nama relasi JPA yang diizinkan di URL sub-sumber daya (mis. "items").<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"items"`); ketidakcocokan memicu error runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Mendeklarasikan transisi status domain atau penyesuaian numerik pada metode aksi kustom.
- **Perilaku Runtime**: Dieksekusi secara atomik sebelum menyimpan atribut entitas yang diperbarui.
- **Cara Menggunakan**: Gabungkan `@AutoPatch` dengan `@BusinessAction(...)` pada metode antarmuka controller.
- **Kapan Digunakan**: Untuk transisi status, penyesuaian angka stok/saldo, atau memanggil metode domain entitas tanpa membuat kelas Service.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN gunakan untuk orkestrasi multi-entitas atau panggilan API eksternal (delegasikan via `@ServiceOverride`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field status siklus hidup (mis. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nama field status pada entitas (divalidasi dengan @StateMachine bila ada).<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"status"`); ketidakcocokan memicu error runtime. |
| `targetStateValue` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"APPROVED"`); biarkan `""` untuk konvensi default.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nilai status target yang ditetapkan pada targetStateField dalam transaksi.<br/>*Catatan:* Divalidasi otomatis terhadap `@StateMachine` atau `@HumanPolicy` sebelum disimpan; transisi ilegal membatalkan transaksi. |
| `adjustNumericField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field numerik (mis. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Nama properti numerik entitas untuk penambahan/pengurangan atomik.<br/>*Catatan:* Memerlukan `deltaParamIndex >= 0` atau `fixedDelta` yang terisi. Mendukung `Integer`, `Long`, `BigDecimal`, dan `Double`. |
| `deltaParamIndex` | `int` | `-1` | Tidak (Opsional) | Salah satu nilai yang didukung: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Indeks parameter berbasis nol yang membawa nilai delta; -1 menonaktifkannya.<br/>*Catatan:* Saat startup registrar mengevaluasi `deltaParamIndex` sebelum `fixedDelta`. Hindari nilai yang saling bertentangan. |
| `fixedDelta` | `String` | `""` | Tidak (Opsional) | Salah satu nilai yang didukung: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | String angka delta tetap (mis. "100", "-1") jika deltaParamIndex tidak digunakan.<br/>*Catatan:* Saat startup registrar mengevaluasi `deltaParamIndex` sebelum `fixedDelta`. Hindari nilai yang saling bertentangan. |
| `entityMethod` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"markFulfilled"`); biarkan `""` untuk konvensi default.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Nama metode domain tanpa argumen pada entitas yang dieksekusi dalam transaksi sama.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"markFulfilled"`); ketidakcocokan memicu error runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Penemuan Bean, Pengikatan Konfigurasi & Urutan Eksekusi (5 Anotasi)

### `@AutoComponent`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Penanda komponen framework yang didaftarkan saat boot tanpa impor @Component saat kompilasi.
- **Perilaku Runtime**: Dipindai di paket internal framework (io.github.natswarchuan); aplikasi konsumen wajib memakai Spring @Component.
- **Cara Menggunakan**: Stereotipe internal framework yang dipindai `AutoBeanFactoryRegistrarBridge` di paket `io.github.natswarchuan`.
- **Kapan Digunakan**: Gunakan HANYA saat menulis modul internal framework di dalam paket `io.github.natswarchuan.*`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN PERNAH dipakai di aplikasi konsumen (`com.example.*`)! Gunakan `@Component` dari Spring.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Nama bean persis yang terdaftar di ApplicationContext (mis. `"invoiceValidationHelper"`) atau `""` untuk resolusi otomatis.<br/>`@AutoComponent("invoiceValidationHelper")` | Nama bean eksplisit opsional; kosong memakai camelCase nama kelas.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Penanda lapisan layanan untuk kelas ServiceImpl yang dipasangkan dengan @ServiceOverride.
- **Perilaku Runtime**: Dipindai di io.github.natswarchuan berdasarkan nama kelas; layanan konsumen wajib memakai Spring @Service.
- **Cara Menggunakan**: Stereotipe layanan internal framework di dalam `io.github.natswarchuan`.
- **Kapan Digunakan**: HANYA untuk layanan internal framework di `io.github.natswarchuan.*`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN PERNAH dipakai di layanan aplikasi Anda — gunakan Spring `@Service`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Nama bean persis yang terdaftar di ApplicationContext (mis. `"orderFulfillmentService"`) atau `""` untuk resolusi otomatis.<br/>`@AutoService("orderFulfillmentService")` | Nama opsional bean layanan.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Mendeklarasikan metode pabrik bean terkelola di dalam kelas @AutoConfigurationBean.
- **Perilaku Runtime**: Diproses oleh PureJavaBeanRegistrarBridge selama konfigurasi otomatis.
- **Cara Menggunakan**: Pasang pada metode pabrik di dalam kelas `@AutoConfigurationBean` framework.
- **Kapan Digunakan**: HANYA di dalam paket konfigurasi internal `io.github.natswarchuan.config.*`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN digunakan di kelas `@Configuration` aplikasi; pakai `@Bean` Spring.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Nama dan alias bean eksplisit.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `targetTypeName` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"com.example.spi.PaymentGateway"`); biarkan `""` untuk konvensi default.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | FQCN opsional tipe target untuk pencocokan dinamis.<br/>*Catatan:* Nama FQCN opsional bila metode factory mengembalikan supertipe atau proxy; pastikan kelas tersedia di classpath. |
| `primary` | `boolean` | `false` | Tidak (Opsional) | `true` (bean utama jika ada beberapa kandidat) atau `false` (prioritas standar).<br/>`@AutoBean(primary = true)` | Menandai bean sebagai kandidat utama saat terjadi konflik injeksi.<br/>*Catatan:* Mendeklarasikan dua `@AutoBean(primary = true)` untuk tipe yang sama memicu konflik ambiguitas bean saat startup. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Menandai kelas konfigurasi dan model pengikatan properti YAML.
- **Perilaku Runtime**: Mendaftarkan bean konfigurasi dan prefiks YAML secara bersih dengan metadata IDE.
- **Cara Menggunakan**: Menandai kelas konfigurasi/properti internal di `io.github.natswarchuan.config.*`.
- **Kapan Digunakan**: HANYA di dalam pustaka framework sebagai padanan Pure Java `@Configuration`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai di aplikasi pengguna; gunakan `@Configuration` dari Spring.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Nama bean persis yang terdaftar di ApplicationContext (mis. `"storageAutoConfig"`) atau `""` untuk resolusi otomatis.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Pengidentifikasi opsional bean konfigurasi.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `prefix` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"nwvmc.storage"`); biarkan `""` untuk konvensi default.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Prefiks properti YAML opsional melalui `PureJavaBeanRegistrarBridge`.<br/>*Catatan:* Mengikat properti kebab-case dari `application.yml`; padukan dengan `spring-configuration-metadata.json` agar bebas peringatan IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Tujuan**: Mengatur urutan prioritas eksekusi antar bean SPI Customizer dan rantai filter.
- **Perilaku Runtime**: Nilai bilangan bulat yang lebih kecil dieksekusi lebih awal (default Integer.MAX_VALUE).
- **Cara Menggunakan**: Pasang `@OrderPriority(1)` pada komponen atau customizer Pure Java.
- **Kapan Digunakan**: Bila urutan deterministik antara beberapa customizer SPI sangat penting.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN disamakan dengan urutan filter Spring Security maupun parameter `?sort=`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Tidak (Opsional) | Salah satu nilai yang didukung: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Bilangan bulat prioritas eksekusi; nilai lebih kecil berjalan lebih dulu.<br/>*Catatan:* Angka lebih kecil berjalan LEBIH DULU (seperti Spring `@Order`). Sisihkan `< 0` untuk filter keamanan/tracing dan `10..100` untuk bisnis. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Keamanan Entitas, State Machine, Integritas, Auto-Generator & Query (11 Anotasi)

### `@EntitySecurity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Menegakkan RBAC NIST Level 2, isolasi ownerField tingkat baris, serta kode izin sebelum kueri atau mutasi.
- **Perilaku Runtime**: Dievaluasi sebelum eksekusi SQL; akses tidak sah melempar HTTP 403 Forbidden.
- **Cara Menggunakan**: Pasang pada kelas `@Entity`, tentukan peran baca/tulis/hapus serta `ownerField` bila perlu.
- **Kapan Digunakan**: Gunakan pada SETIAP entitas yang terekspos untuk mengamankan REST, batch, ekspor, dan GraphQL.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN aktifkan `permitAll = true` pada `AutoApiController<E>` penuh tanpa `AutoReadApi<E>`, `disabledEndpoints`, atau `@SecurityPolicyEntity` (melewati cek READ, WRITE, dan DELETE).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_USER", "ROLE_ADMIN"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Peran yang diizinkan membaca data (GET, GraphQL, ekspor).<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |
| `writeRoles` | `String[]` | `{}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Peran yang diizinkan menulis (POST/PUT/PATCH/impor).<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |
| `deleteRoles` | `String[]` | `{}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Peran yang diizinkan menghapus (DELETE / batch-delete).<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |
| `permitAll` | `boolean` | `false` | Tidak (Opsional) | `true` (izinkan akses publik tanpa autentikasi) atau `false` (wajibkan autentikasi dan pemeriksaan peran).<br/>`@EntitySecurity(permitAll = true)` | Jika true (tanpa kebijakan DB-RBAC), melewati cek @EntitySecurity untuk READ, WRITE, dan DELETE; pasangkan dengan AutoReadApi<E> atau disabledEndpoints.<br/>*Catatan:* Mengabaikan pemeriksaan peran dan mengizinkan akses anonim. Jangan pernah aktifkan pada data PII atau entitas keuangan. |
| `ownerField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field pemilik/UUID (mis. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Nama field pemilik data ("createdBy"); menegakkan kepemilikan anti-IDOR.<br/>*Catatan:* Menerapkan filter kepemilikan tingkat baris pada `GET`/`PUT`/`PATCH`/`DELETE`, kecuali memiliki peran di `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Peran istimewa yang melewati pemeriksaan `ownerField`.<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |
| `permissions` | `String[]` | `{}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ORDER_READ", "ORDER_APPROVE"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Kode izin terperinci yang dievaluasi bersama peran (DB RBAC).<br/>*Catatan:* Dievaluasi terhadap izin granular dari klaim JWT atau DB-RBAC `@SecurityPermissionEntity`. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Menyamarkan atau mengosongkan kolom sensitif secara dinamis bila peran pemanggil tidak berwenang.
- **Perilaku Runtime**: Diterapkan setelah pengambilan data sebelum serialisasi JSON.
- **Cara Menggunakan**: Pasang di field sensitif (`costPrice`, `ssn`); masking bekerja pada salinan klon aman.
- **Kapan Digunakan**: Bila satu endpoint melayani banyak peran dengan visibilitas field berbeda di REST dan GraphQL.
- **Kapan TIDAK Digunakan & Jebakan**: Tipe non-`String` otomatis menjadi `null`; atur `nullifyInsteadOfMask = true` bila field `String` harus bernilai `null` bukan `"******"`, atau pakai `readDto` untuk menyembunyikan key.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Peran yang diizinkan melihat nilai asli tanpa penyamaran.<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |
| `maskPattern` | `String` | `"******"` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"***-**-****"`); biarkan `""` untuk konvensi default.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | String pengganti untuk field String saat peran tidak mencukupi.<br/>*Catatan:* Diabaikan bila `nullifyInsteadOfMask = true`. Untuk field non-String (`BigDecimal`, `LocalDate`), pilih `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Tidak (Opsional) | `true` (ganti field tidak berizin dengan JSON null) atau `false` (terapkan string maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Jika true, memaksa field String menjadi null alih-alih maskPattern (tipe non-String otomatis menjadi null).<br/>*Catatan:* Penting untuk field angka, tanggal, dan objek agar klien TypeScript/Zod menerima `null` yang valid. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Menegakkan transisi status sah via POST /{id}/transition dan membatasi DELETE /{id} hanya pada deletableStates.
- **Perilaku Runtime**: Menolak transisi atau penghapusan ilegal dengan HTTP 422 BusinessRuleViolationException.
- **Cara Menggunakan**: Pasang di field String status memakai pemisah `:` (`"CREATED:PAID,CANCELLED"`).
- **Kapan Digunakan**: Untuk siklus hidup ketat (pesanan, pinjaman, faktur) guna memblokir lompatan ilegal (`422`).
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN PERNAH memakai `"->"` (`EntityStateMachineUtil` hanya memisahkan berdasarkan `":"`)!

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"CREATED"`); biarkan `""` untuk konvensi default.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Status awal otomatis saat pembuatan data jika kosong ("ACTIVE").<br/>*Catatan:* Diisi otomatis saat `POST` bila kosong; harus cocok dengan status sebelum `:` pada `transitions`. |
| `transitions` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Aturan transisi yang diizinkan memakai format titik dua "FROM:TO_1,TO_2".<br/>*Catatan:* Mewajibkan sintaks titik dua `"FROM:TO1,TO2"` (peka huruf besar/kecil, target dipisah koma). Transisi tak terdaftar ditolak dengan HTTP `422`. |
| `deletableStates` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Daftar status di mana DELETE diizinkan (lainnya ditolak HTTP 422).<br/>*Catatan:* Bila diisi, `DELETE /{id}` gagal dengan HTTP `422 Unprocessable Entity` jika entitas berada di status lain (mis. `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Mengompilasi klausa kebijakan yang mudah dibaca menjadi aturan RBAC, transisi, dan penyamaran aktif.
- **Perilaku Runtime**: Dapat diperiksa via GET /human-policy dan ditimpa di YAML pada spring-nwvmc.human-policies.<Entity>.
- **Cara Menggunakan**: Pasang di entitas atau atur lewat YAML `spring-nwvmc.human-policies`; dikompilasi `HumanPolicyRegistryHelper`.
- **Kapan Digunakan**: Bila tim produk atau kepatuhan membutuhkan aturan kebijakan yang mudah dibaca di YAML.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN tulis prosa bebas atau bahasa selain templat bahasa Inggris deterministik.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Tidak (Opsional) | Salah satu nilai yang didukung: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Aturan siklus hidup berbahasa Inggris alami yang dikompilasi ke transisi status.<br/>*Catatan:* Dikompilasi sekali saat startup ke mesin `@StateMachine` yang sama; hindari aturan bentrok pada entitas yang sama. |
| `security` | `String` | `""` | Tidak (Opsional) | Salah satu nilai yang didukung: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Direktif RBAC bahasa Inggris alami untuk aturan baca/tulis/hapus.<br/>*Catatan:* Nama peran otomatis dinormalisasi dengan awalan `ROLE_` dan divalidasi fail-fast saat startup. |
| `masking` | `String` | `""` | Tidak (Opsional) | Salah satu nilai yang didukung: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Kebijakan penyamaran field berbahasa Inggris alami.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"costPrice"`); ketidakcocokan memicu error runtime. |
| `stateField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field status siklus hidup (mis. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Field entitas penyimpan status yang dikelola oleh aturan lifecycle.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"orderStatus"`); ketidakcocokan memicu error runtime. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Mencatat selisih tingkat field di setiap mutasi untuk rekonstruksi Time-Travel dan inspeksi /diff.
- **Perilaku Runtime**: Menangkap delta oldValue dan newValue pada operasi create, update, patch, transition, dan restore.
- **Cara Menggunakan**: Pasang `@AuditTrail` pada turunan `BaseAuditEntity` agar mutasi terekam otomatis.
- **Kapan Digunakan**: Untuk entitas sensitif kepatuhan (pembayaran, rekam medis, rekening) guna audit Time-Travel.
- **Kapan TIDAK Digunakan & Jebakan**: Matikan `recordFieldDiffs` pada tabel log/telemetri berkecepatan tulis sangat tinggi.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"FINANCE_LEDGER"`); biarkan `""` untuk konvensi default.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Kategori audit logis pada event mutasi; kosong memakai nama entitas.<br/>*Catatan:* Menandai log audit untuk penyaringan per domain; `""` memakai nama kelas entitas JPA. |
| `recordFieldDiffs` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Jika true, menghitung selisih field lama vs baru untuk Time-Travel.<br/>*Catatan:* Mencatat diff sebelum/sesudah pada `PUT`/`PATCH`; atur `false` untuk blob besar atau penulisan berfrekuensi tinggi. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Mengisolasi kueri dan mutasi baris secara otomatis menurut konteks tenant aktif kecuali peran bypass.
- **Perilaku Runtime**: Fail-closed HTTP 403 bila konteks tenant kosong tanpa peran bypass; menimpa paksa tenantId saat create dan menegakkan isolasi di semua operasi ID.
- **Cara Menggunakan**: Pasang pada entitas SaaS; pemfilteran baca, anti-spoofing saat buat, dan fail-closed `403` berjalan otomatis.
- **Kapan Digunakan**: Pada semua tabel SaaS bersama (toko, faktur, pesanan) untuk mencegah kebocoran data lintas-tenant.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pasang di tabel referensi global (negara, mata uang) yang harus dibaca semua tenant.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field pengenal tenant (mis. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Nama field entitas penyimpan ID tenant (default "tenantId").<br/>*Catatan:* Buat indeks komposit `(tenant_id, id)` di basis data agar kueri isolasi tenant cepat dan aman. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Tidak (Opsional) | Array nama peran Spring Security (mis. `{"ROLE_SUPER_ADMIN"}`); `{}` kosong tidak menambah batasan khusus.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Peran platform superadmin yang dapat mengakses seluruh tenant.<br/>*Catatan:* Simpan nama peran di `RoleConstant` dengan awalan `ROLE_` (mis. `ROLE_ADMIN`) sesuai `GrantedAuthority` Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Memvalidasi keunikan sebelum persistensi saat create, update, dan upsert.
- **Perilaku Runtime**: Melempar ConflictBusinessException (HTTP 409) saat nilai duplikat ditemukan.
- **Cara Menggunakan**: Pasang pada properti unik (`email`, `skuCode`) bersama `@Column(unique = true)`.
- **Kapan Digunakan**: Bila ingin validasi keunikan hanya untuk data aktif dengan respons `HTTP 409 Conflict` yang jelas.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN hilangkan indeks `UNIQUE` database pada konkurensi tinggi.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Menghasilkan kode bisnis unik berawalan otomatis saat pembuatan atau kloning bila dikosongkan.
- **Perilaku Runtime**: Mengisi prefiks + token unik sebelum validasi dan penyimpanan entitas.
- **Cara Menggunakan**: Pasang `@AutoCode(prefix = "PRD-")` pada field String; otomatis dibuat saat create/clone bila kosong.
- **Kapan Digunakan**: Untuk kode referensi terbaca manusia (nomor pesanan, SKU, kode toko) tanpa bottleneck sequence DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai jika regulasi mewajibkan nomor urut tanpa celah (`1, 2, 3...`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Wajib (tanpa default)` | **Ya (Wajib)** | Prefiks string wajib tidak kosong (mis. `"PRD-"`, `"INV-"`) — kompilasi gagal jika dihilangkan.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Prefiks wajib yang ditempatkan di depan hash UUIDv7 8 karakter huruf besar (mis. "PRD-").<br/>*Catatan:* Atribut wajib; menambahkan hash UUIDv7 8 karakter huruf besar (mis. `INV-0194E1A0`) bila field kosong saat create/clone, serta mempertahankan kode dari klien. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Menghasilkan slug ASCII ramah URL yang dinormalisasi secara otomatis dari sourceField.
- **Perilaku Runtime**: Menormalkan diakritik Unicode dan menyediakan pencarian melalui filter slug.
- **Cara Menggunakan**: Pasang `@AutoSlug(sourceField = "name")` pada field `slug`.
- **Kapan Digunakan**: Untuk URL ramah SEO pada toko, artikel blog, kategori, dan katalog produk.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN arahkan `sourceField` ke properti yang tidak ada.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Wajib (tanpa default)` | **Ya (Wajib)** | Nama properti Java yang persis pada entitas untuk field String (mis. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Nama properti sumber wajib yang dinormalisasi menjadi slug ASCII huruf kecil.<br/>*Catatan:* Wajib; menormalkan teks Unicode menjadi kebab-case ramah URL. Padukan dengan `@UniqueField` agar unik. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Tujuan**: Menghitung total numerik turunan secara otomatis sebelum menyimpan perubahan entitas.
- **Perilaku Runtime**: Divalidasi saat boot oleh ComputedFieldFailFastUtil agar sourceFields tidak valid langsung gagal cepat.
- **Cara Menggunakan**: Pasang pada field turunan (`BigDecimal`); dihitung ulang otomatis di server sebelum simpan.
- **Kapan Digunakan**: Untuk total baris dan grand total pesanan otoritatif di server agar tidak dimanipulasi klien.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN dipakai untuk diskon bertingkat kompleks atau kurs eksternal (`@ServiceOverride`).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Tidak (Opsional) | Salah satu nilai yang didukung: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Operasi kalkulasi: "MULTIPLY" atau "SUM_COLLECTION".<br/>*Catatan:* Dihitung ulang otomatis sebelum disimpan pada `POST`/`PUT`/`PATCH`, menimpa total yang dimanipulasi klien. |
| `sourceFields` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Nama properti entitas yang dikalikan saat operation = "MULTIPLY".<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"unitPrice"`); ketidakcocokan memicu error runtime. |
| `collectionField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field koleksi @OneToMany (mis. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Nama koleksi anak @OneToMany yang dijumlahkan pada "SUM_COLLECTION".<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"items"`); ketidakcocokan memicu error runtime. |
| `itemField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field numerik (mis. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Properti numerik pada setiap elemen anak yang dijumlahkan (mis. "subTotal").<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"subTotal"`); ketidakcocokan memicu error runtime. |
| `subtractField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field numerik (mis. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Field potongan pada entitas induk yang dikurangi dari total (mis. "discountAmount").<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"discountAmount"`); ketidakcocokan memicu error runtime. |
| `addField` | `String` | `""` | Tidak (Opsional) | Nama properti Java yang persis pada entitas untuk field numerik (mis. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Field biaya tambahan opsional yang ditambahkan ke hasil (mis. "shippingFee").<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"shippingFee"`); ketidakcocokan memicu error runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Memungkinkan pengikatan kueri SQL/JPQL kustom atau metode penyedia ke endpoint controller.
- **Perilaku Runtime**: Dieksekusi dengan parameter bernama terikat melalui JPA EntityManager.
- **Cara Menggunakan**: Gabungkan dengan `@AutoGet`/`@AutoPost` dengan mengikat `:param` lewat `@AutoParam`/`@AutoVariable`.
- **Kapan Digunakan**: Untuk laporan SQL native, CTE, fungsi jendela, atau JSONB tanpa membuat Repository manual.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pernah menggabungkan input pengguna ke SQL (`:param` wajib) maupun melakukan JOIN lintas-domain.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Tidak (Opsional) | Salah satu nilai yang didukung: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | String kueri SQL atau JPQL inline dengan parameter `:param`.<br/>*Catatan:* Selalu gunakan parameter `:param` atau `?1` untuk mencegah SQL injection; biarkan `""` jika memakai `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Tidak (Opsional) | `true` (jalankan SQL native basis data) atau `false` (jalankan JPQL JPA yang portabel).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true menjalankan SQL native; false menjalankan JPQL JPA.<br/>*Catatan:* SQL native (`true`) mendukung CTE dan window function; pilih `false` (JPQL) untuk portabilitas lintas H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas Java konkret apa pun (mis. `MonthlyRevenueDto.class`) atau `Void.class` untuk menonaktifkan pemetaan DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Kelas pemetaan hasil opsional.<br/>*Catatan:* Selalu tentukan kelas DTO proyeksi pada kueri agregasi agar terhindar dari `SELECT *` dan `Object[]`. |
| `sqlProvider` | `Class<?>` | `Void.class` | Tidak (Opsional) | Kelas penyedia SQL Pure Java konkret (mis. `OrderAnalyticsSqlProvider.class`), atau `Void.class` bila memakai `value` inline.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Kelas penyedia SQL dinamis opsional yang divalidasi saat boot.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `sqlProvider` tidak valid langsung gagal cepat (fail-fast). |
| `providerMethod` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"buildRevenueSql"`); biarkan `""` untuk konvensi default.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nama metode di dalam `sqlProvider` yang mengembalikan String SQL.<br/>*Catatan:* Harus persis cocok dengan pengenal Java (peka huruf besar/kecil, mis. `"buildRevenueSql"`); ketidakcocokan memicu error runtime. |
| `modifying` | `boolean` | `false` | Tidak (Opsional) | `true` (DML UPDATE/DELETE dalam transaksi tulis) atau `false` (kueri SELECT baca-saja).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Wajib `true` untuk kueri INSERT/UPDATE/DELETE.<br/>*Catatan:* Wajib (`true`) untuk `UPDATE`/`DELETE`; membungkus eksekusi dalam transaksi tulis yang aman. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC Dinamis Berbasis Database & Meta-Anotasi Masking Kolom (18 Anotasi)

### `@SecurityRoleEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Tujuan**: Menunjuk entitas JPA sebagai tabel katalog Peran RBAC dinamis di basis data.
- **Perilaku Runtime**: DynamicDatabaseRbacProviderHelper menyimpan ikatan peran-izin di Caffeine lalu menginvalidasi otomatis saat diubah.
- **Cara Menggunakan**: Pasang `@SecurityRoleEntity` pada entitas Role dan tandai kode peran dengan `@RoleCode`.
- **Kapan Digunakan**: Ketika admin mengelola peran secara dinamis lewat tabel database di runtime.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN lewatkan `@RoleCode` (startup gagal!) atau membuat lebih dari satu `@SecurityRoleEntity`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan detik; mis. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL cache Caffeine dalam detik sebelum memuat ulang definisi peran.<br/>*Catatan:* TTL singkat mempercepat pembaruan namun menambah kueri; TTL panjang meringankan DB namun menunda pencabutan izin. |

```java
@Entity
@Table(name = "sec_roles")
@SecurityRoleEntity(cacheTtlSeconds = 60L)
public class AppSecurityRole {
  @RoleCode private String code;
  @RoleName private String name;
  @RolePermissions private String permissionsCsv;
}
```

### `@RoleCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan kolom kode peran unik di dalam entitas @SecurityRoleEntity.
- **Perilaku Runtime**: Dibaca melalui LambdaAccessorUtil ter-cache untuk mencocokkan token GrantedAuthority.
- **Cara Menggunakan**: Pasang `@RoleCode` pada field atau getter di dalam entitas `@SecurityRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Mengidentifikasi field nama tampilan peran pada entitas @SecurityRoleEntity.
- **Perilaku Runtime**: Ditampilkan pada metadata diagnostik RBAC dan inspeksi peran Dev Studio.
- **Cara Menggunakan**: Pasang `@RoleName` pada field atau getter di dalam entitas `@SecurityRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Menandai field koleksi atau string CSV yang menyimpan kode izin milik peran.
- **Perilaku Runtime**: Diparsing dinamis dan diperluas menjadi otoritas efektif di SecurityIdentityCustomizer.
- **Cara Menggunakan**: Pasang `@RolePermissions` pada field atau getter di dalam entitas `@SecurityRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Tujuan**: Menandai entitas JPA penyimpan izin sumber-daya-aksi dan aturan penyamaran kolom dinamis.
- **Perilaku Runtime**: Dimuat ke DatabaseRbacRuleMatcherHelper untuk menegakkan akses CRUD dan penyamaran kolom.
- **Cara Menggunakan**: Pasang `@SecurityPermissionEntity` pada entitas Permission dengan `@PermissionCode` wajib.
- **Kapan Digunakan**: Saat mengelola izin granular sumber daya/aksi serta penyamaran field secara dinamis di DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN lupakan `@PermissionCode` atau menggandakan `@SecurityPermissionEntity`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan detik; mis. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL cache Caffeine dalam detik untuk definisi izin.<br/>*Catatan:* TTL singkat mempercepat pembaruan namun menambah kueri; TTL panjang meringankan DB namun menunda pencabutan izin. |

```java
@Entity
@Table(name = "sec_permissions")
@SecurityPermissionEntity(cacheTtlSeconds = 60L)
public class AppSecurityPermission {
  @PermissionCode private String code;
  @PermissionResource private String resource;
  @PermissionAction private String action;
  @PermissionFieldMask private String maskedFields;
}
```

### `@PermissionCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Menunjuk field pengenal izin unik di dalam @SecurityPermissionEntity.
- **Perilaku Runtime**: Dicocokkan dengan otoritas pemanggil serta daftar kode @EntitySecurity.permissions().
- **Cara Menggunakan**: Pasang `@PermissionCode` pada field atau getter di dalam entitas `@SecurityPermissionEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPermissionEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPermissionEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan nama entitas atau sumber daya API tujuan (atau wildcard *) di @SecurityPermissionEntity.
- **Perilaku Runtime**: Dievaluasi case-insensitive oleh DatabaseRbacRuleMatcherHelper dengan dukungan wildcard.
- **Cara Menggunakan**: Pasang `@PermissionResource` pada field atau getter di dalam entitas `@SecurityPermissionEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPermissionEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPermissionEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan kata kerja aksi CRUD atau kustom yang dilindungi aturan @SecurityPermissionEntity.
- **Perilaku Runtime**: Dinormalisasi otomatis dari nama metode controller (READ, WRITE, DELETE, atau aksi kustom).
- **Cara Menggunakan**: Pasang `@PermissionAction` pada field atau getter di dalam entitas `@SecurityPermissionEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPermissionEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPermissionEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Mendeklarasikan daftar kolom dipisah koma yang disamarkan secara dinamis saat aturan izin aktif.
- **Perilaku Runtime**: Diterapkan secara dinamis bersama @FieldSecurity sebelum serialisasi respons JSON.
- **Cara Menggunakan**: Pasang `@PermissionFieldMask` pada field atau getter di dalam entitas `@SecurityPermissionEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPermissionEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPermissionEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Tujuan**: Memetakan entitas JPA pengikat subjek pengguna terautentikasi ke peran DB dan cakupan tenant.
- **Perilaku Runtime**: Dikueri otomatis saat hidrasi JWT / SecurityContext melalui SecurityIdentityCustomizer.
- **Cara Menggunakan**: Pasang pada entitas relasi User-Role beserta `@UserRoleSubject` dan `@UserRoleCode`.
- **Kapan Digunakan**: Bila JWT hanya membawa `username` dan hak akses harus diambil secara dinamis dari DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN lupakan `@UserRoleSubject`; tidak diperlukan jika IdP eksternal sudah menyematkan seluruh peran di JWT.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@SecurityUserRoleEntity(enabled = true)` | Sakelar aktif/nonaktif pemuatan relasi pengguna-peran dari tabel ini.<br/>*Catatan:* Atur `false` sementara saat migrasi skema untuk menjeda kueri tabel sambil mempertahankan peran dari JWT. |

```java
@Entity
@Table(name = "sec_user_roles")
@SecurityUserRoleEntity(enabled = true)
public class AppSecurityUserRole {
  @UserRoleSubject private String subject;
  @UserRoleCode private String roleCode;
  @UserRoleTenantId private String tenantId;
}
```

### `@UserRoleSubject`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Mengidentifikasi field subjek utama / username pada @SecurityUserRoleEntity.
- **Perilaku Runtime**: Dicocokkan dengan Authentication.getName() dari SecurityContext aktif.
- **Cara Menggunakan**: Pasang `@UserRoleSubject` pada field atau getter di dalam entitas `@SecurityUserRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityUserRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityUserRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Mengikat kolom kode peran yang ditetapkan di dalam @SecurityUserRoleEntity.
- **Perilaku Runtime**: Menyelesaikan izin @SecurityRoleEntity terkait saat evaluasi kebijakan.
- **Cara Menggunakan**: Pasang `@UserRoleCode` pada field atau getter di dalam entitas `@SecurityUserRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityUserRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityUserRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Membatasi penugasan @SecurityUserRoleEntity pada ID tenant tertentu (atau * untuk global).
- **Perilaku Runtime**: Disaring berdasarkan TenantContextHolder / X-Tenant-ID pada setiap permintaan terautentikasi.
- **Cara Menggunakan**: Pasang `@UserRoleTenantId` pada field atau getter di dalam entitas `@SecurityUserRoleEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityUserRoleEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityUserRoleEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Tujuan**: Menandai entitas JPA penyimpan kebijakan ALLOW / DENY eksplisit yang diurutkan menurut priority.
- **Perilaku Runtime**: DENY eksplisit secara deterministik mengalahkan ALLOW sebelum kueri SQL berjalan.
- **Cara Menggunakan**: Pasang `@SecurityPolicyEntity` bersama `@PolicyAllowedRoles`, `@PolicyResource`, `@PolicyAction`, dan `@PolicyEffect`.
- **Kapan Digunakan**: Untuk menimpa aturan statis `@EntitySecurity` secara dinamis dari DB (termasuk blokir `DENY` darurat).
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN lewatkan `@PolicyAllowedRoles`; ingat aturan `DENY` eksplisit menang di atas `ALLOW`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Tidak (Opsional) | Angka positif (`>= 0`) dalam satuan prioritas bilangan bulat; mis. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Prioritas evaluasi aturan kebijakan (angka kecil lebih diutamakan).<br/>*Catatan:* Nilai lebih kecil diprioritaskan ketika beberapa kebijakan cocok (mis. `10` mengalahkan `100`). |

```java
@Entity
@Table(name = "sec_policies")
@SecurityPolicyEntity(priority = 10)
public class AppSecurityPolicy {
  @PolicyResource private String resource;
  @PolicyAction private String action;
  @PolicyAllowedRoles private String allowedRoles;
  @PolicyEffect private String effect; // ALLOW | DENY
}
```

### `@PolicyResource`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan pola pengenal sumber daya tujuan pada entitas @SecurityPolicyEntity.
- **Perilaku Runtime**: Mendukung nama persis entitas/sumber daya serta pencocokan wildcard *.
- **Cara Menggunakan**: Pasang `@PolicyResource` pada field atau getter di dalam entitas `@SecurityPolicyEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPolicyEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPolicyEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan kata kerja operasi terproteksi (READ, WRITE, DELETE, methodName, *) pada @SecurityPolicyEntity.
- **Perilaku Runtime**: Dievaluasi pada setiap operasi HTTP sebelum delegasi ke lapisan layanan.
- **Cara Menggunakan**: Pasang `@PolicyAction` pada field atau getter di dalam entitas `@SecurityPolicyEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPolicyEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPolicyEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Memetakan koleksi atau daftar peran dipisah koma yang menjadi target aturan @SecurityPolicyEntity.
- **Perilaku Runtime**: Dicocokkan dengan otoritas JWT aktif serta peran dari @SecurityUserRoleEntity di basis data.
- **Cara Menggunakan**: Pasang `@PolicyAllowedRoles` pada field atau getter di dalam entitas `@SecurityPolicyEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPolicyEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPolicyEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Tujuan**: Menentukan hasil keputusan ALLOW atau DENY pada aturan @SecurityPolicyEntity.
- **Perilaku Runtime**: Kebijakan DENY yang cocok langsung menghentikan permintaan dengan HTTP 403 AccessDeniedBusinessException.
- **Cara Menggunakan**: Pasang `@PolicyEffect` pada field atau getter di dalam entitas `@SecurityPolicyEntity`.
- **Kapan Digunakan**: Untuk memetakan kolom kustom `@SecurityPolicyEntity` ke mesin DB-RBAC tanpa mengubah nama skema DB.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN duplikat di lebih dari satu field atau di luar entitas `@SecurityPolicyEntity`.

> **Anotasi Penanda (Marker Annotation)**: Anotasi penanda murni — tidak mendeklarasikan atribut apa pun.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Distributed Lock, Idempotency, Caching, Multi-DB & CloudEvents (13 Anotasi)

### `@DistributedLock`

- **Paket**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Tujuan**: Menyeragamkan akses serentak pada kunci SpEL ter-cache AST (default waitTimeMs=3000L, leaseTimeMs=5000L).
- **Perilaku Runtime**: DistributedLockAspect melempar DistributedLockAcquisitionException (HTTP 409) saat waktu habis.
- **Cara Menggunakan**: Pasang pada metode `@Service` non-final; untuk klaster sediakan bean `DistributedLockProvider` Redis.
- **Kapan Digunakan**: Untuk mencegah overselling stok, pemotongan saldo bersamaan, atau race condition batch.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN mengira penyedia default Caffeine mengunci lintas pod Kubernetes, dan hindari kelas `final`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Tidak (Opsional) | Ekspresi SpEL yang merujuk argumen metode (mis. `"'inventory:' + #skuId"`) atau `""` untuk kunci otomatis.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Ekspresi SpEL kunci penguncian yang dievaluasi saat runtime.<br/>*Catatan:* Selalu batasi kunci ke ID sumber daya terkecil (`#id`); kunci konstan membuat semua trafik antre global. |
| `waitTimeMs` | `long` | `3000L` | Tidak (Opsional) | Angka positif (`>= 0`) dalam satuan milidetik; mis. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Batas waktu tunggu memperoleh kunci dalam milidetik (default 3000L).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: terlalu rendah memicu 409 palsu; terlalu tinggi menahan thread saat lonjakan beban. |
| `leaseTimeMs` | `long` | `5000L` | Tidak (Opsional) | Angka positif (`>= 100`) dalam satuan milidetik; mis. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Masa sewa kunci maksimum dalam milidetik (default 5000L).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: harus melebihi durasi transaksi p99 agar kunci tidak kedaluwarsa di tengah penulisan. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Mencegah penulisan duplikat serentak maupun replay dalam jendela TTL yang dapat dikonfigurasi.
- **Perilaku Runtime**: Ditegakkan IdempotencyAspect & ProxyIdempotencyGuardHelper lewat kunci Caffeine TTL (HTTP 409 ConflictBusinessException); IdempotencyManagerHelper menyediakan pembantu SHA-256 opsional.
- **Cara Menggunakan**: Pasang pada metode `@AutoRestController` atau `@Service` non-final; gagal akan melepas kunci.
- **Kapan Digunakan**: Untuk pembayaran, transfer saldo, dan mutasi POST yang rentan klik ganda atau retry jaringan.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pasang pada GET dan sediakan `IdempotencyStoreProvider` Redis untuk multi-pod.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Tidak (Opsional) | Nama header HTTP valid (tidak peka huruf besar/kecil di jaringan, mis. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Header HTTP yang membawa kunci idempotensi klien; kosong berarti dilewati.<br/>*Catatan:* Klien harus mengirim UUIDv7 unik per operasi dan memakainya lagi saat retry; daftarkan di CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan detik; mis. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Jendela deduplikasi dalam detik yang menolak ulangan dengan HTTP 409 Conflict (300L).<br/>*Catatan:* Masa simpan respons di Redis/memori; atur `300L–86400L` sesuai jendela retry klien (mis. 24 jam untuk pembayaran). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menegakkan pembatasan laju permintaan jendela geser per partisi IP, User, atau Tenant.
- **Perilaku Runtime**: Menambah metrik nwvmc.ratelimit.rejected.total dan merespons HTTP 429 Too Many Requests.
- **Cara Menggunakan**: Pasang di interface atau metode controller; menyertakan `X-RateLimit-Remaining`/`X-RateLimit-Reset` dan `HTTP 429` + `Retry-After` saat melebihi kuota.
- **Kapan Digunakan**: Untuk pencarian publik, autentikasi, kueri AI, dan ekspor besar guna mencegah penyalahgunaan.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pasang ketat pada health check dan hindari `"GLOBAL"` bila isolasi per `"USER"`, `"TENANT"`, atau `"IP"` dibutuhkan.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan permintaan; mis. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Jumlah maksimum permintaan per jendela waktu (default 60).<br/>*Catatan:* Menyertakan header `X-RateLimit-Remaining`, `X-RateLimit-Reset`, dan RFC 6585 `Retry-After` saat HTTP `429`. |
| `windowSeconds` | `int` | `60` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan detik; mis. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Durasi jendela batas kecepatan dalam detik (60).<br/>*Catatan:* Menentukan durasi jendela penghitung sekaligus nilai `X-RateLimit-Reset` dan `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Tidak (Opsional) | Salah satu nilai yang didukung: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Strategi partisi dinamis: "IP"/"clientIp", "USER" (fallback IP jika anonim), "TENANT", "GLOBAL", atau SpEL "#expr".<br/>*Catatan:* `"USER"` mempartisi per pengguna terautentikasi dan otomatis fallback ke IP untuk anonim; `"GLOBAL"` berbagi satu kuota bersama. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Membungkus operasi dalam Circuit Breaker Resilience4j dengan telemetri ke Actuator & Micrometer.
- **Perilaku Runtime**: Berpindah ke OPEN (HTTP 503) saat rasio gagal melewati batas dan memperbarui gauge metrik.
- **Cara Menggunakan**: Pasang pada controller/metode yang bergantung pada API eksternal/AI guna mengisolasi kegagalan berantai.
- **Kapan Digunakan**: Saat kegagalan downstream harus langsung gagal-cepat (`HTTP 503`) tanpa menyumbat thread.
- **Kapan TIDAK Digunakan & Jebakan**: `CircuitBreakerErrorFilterUtil` otomatis mengabaikan 4xx `BaseBusinessException`; jangan bungkus error klien dalam `RuntimeException`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"payment-gateway-cb"`); biarkan `""` untuk konvensi default.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nama instansi CircuitBreaker Resilience4j.<br/>*Catatan:* Menentukan nama instans Resilience4j dan tag metrik Micrometer; `""` mengambil nama kelas. |
| `failureRateThreshold` | `float` | `50.0f` | Tidak (Opsional) | Angka positif (`1.0f .. 100.0f`) dalam satuan persen; mis. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Ambang batas persentase kegagalan untuk membuka sirkuit (default 50.0f).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: kesalahan bisnis 4xx (`BaseBusinessException`) diabaikan otomatis; hanya kegagalan 5xx/infrastruktur yang memicu breaker. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan detik; mis. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Detik jeda pada status OPEN (HTTP 503) sebelum HALF_OPEN (10).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: kesalahan bisnis 4xx (`BaseBusinessException`) diabaikan otomatis; hanya kegagalan 5xx/infrastruktur yang memicu breaker. |
| `slidingWindowSize` | `int` | `20` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan panggilan; mis. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Jumlah panggilan yang dicatat dalam jendela geser (20).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: kesalahan bisnis 4xx (`BaseBusinessException`) diabaikan otomatis; hanya kegagalan 5xx/infrastruktur yang memicu breaker. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan panggilan; mis. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Panggilan uji coba yang diizinkan di status HALF_OPEN (5).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: kesalahan bisnis 4xx (`BaseBusinessException`) diabaikan otomatis; hanya kegagalan 5xx/infrastruktur yang memicu breaker. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Mengulang otomatis kegagalan sementara dengan jeda eksponensial terkonfigurasi.
- **Perilaku Runtime**: Melempar pengecualian terstandarisasi bila semua percobaan ulang habis.
- **Cara Menggunakan**: Pasang di controller/metode untuk memulihkan gangguan sementara jaringan/DB dengan backoff eksponensial.
- **Kapan Digunakan**: Untuk GET idempoten, penggantian PUT, atau panggilan yang dilindungi `@Idempotent`.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN PERNAH dipasang pada POST non-idempoten atau penagihan pembayaran tanpa `@Idempotent`!

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"erp-sync-retry"`); biarkan `""` untuk konvensi default.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nama instansi Retry pada Resilience4j.<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: pastikan total waktu seluruh percobaan tetap di bawah batas timeout gateway. |
| `maxAttempts` | `int` | `3` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan percobaan; mis. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Total percobaan termasuk eksekusi awal (default 3).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: pastikan total waktu seluruh percobaan tetap di bawah batas timeout gateway. |
| `waitDurationMs` | `long` | `500L` | Tidak (Opsional) | Angka positif (`>= 50`) dalam satuan milidetik; mis. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Jeda awal dalam milidetik sebelum percobaan ulang pertama (500L).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: pastikan total waktu seluruh percobaan tetap di bawah batas timeout gateway. |
| `backoffMultiplier` | `double` | `2.0d` | Tidak (Opsional) | Angka positif (`>= 1.0d`) dalam satuan faktor pengali; mis. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Pengali backoff eksponensial antar percobaan ulang (2.0d).<br/>*Catatan:* Sesuaikan dengan cermat terhadap SLA latensi produksi: pastikan total waktu seluruh percobaan tetap di bawah batas timeout gateway. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Paket**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menghitung ETag lemah RFC 7232 (W/"...") serta mengeluarkan Cache-Control dan respons HTTP 304 Not Modified.
- **Perilaku Runtime**: Mencatat penghitung HIT/MISS pada metrik nwvmc.cache.http.requests.
- **Cara Menggunakan**: Pasang pada controller/metode GET baca-saja untuk `ETag`, `Cache-Control`, dan `304`.
- **Kapan Digunakan**: Untuk katalog semi-statis dan daftar publik agar `HTTP 304` menghemat bandwidth.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN pernah membiarkan `isPrivate = false` pada data PII atau multi-tenant agar CDN tidak membocorkan data!

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Tidak (Opsional) | Angka positif (`>= 0`) dalam satuan detik; mis. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Durasi directive `max-age` Cache-Control dalam detik (60).<br/>*Catatan:* Mengirim `Cache-Control: max-age=<N>`. Atur `0` bersama `generateETag = true` untuk revalidasi kondisional `304`. |
| `isPrivate` | `boolean` | `false` | Tidak (Opsional) | `true` (cache privat browser saja; diblokir dari CDN) atau `false` (cache publik yang dapat disimpan proxy dan CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true mengirim `private` mencegah CDN bersama; false mengirim `public`.<br/>*Catatan:* KRITIS: Selalu atur `isPrivate = true` pada endpoint terautentikasi atau multi-tenant agar CDN tidak membocorkan data antar pengguna. |
| `mustRevalidate` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Menambahkan `, must-revalidate` agar cache kadaluarsa divalidasi ulang.<br/>*Catatan:* Mencegah cache perantara menyajikan respons basi setelah `maxAgeSeconds` berakhir tanpa revalidasi. |
| `generateETag` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Menghitung ETag SHA-256 dan membalas `HTTP 304` saat `If-None-Match` cocok.<br/>*Catatan:* Menghitung `ETag` RFC 7232 dan membalas `304 Not Modified` (0 byte) bila `If-None-Match` cocok. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menyimpan hasil metode baca sisi server di dalam mesin Caffeine L1 / Redis L2.
- **Perilaku Runtime**: Dapat dikonfigurasi secara global lewat app.framework.cache.type.
- **Cara Menggunakan**: Pasang pada metode baca layanan; engine dikendalikan lewat `app.framework.cache.type`.
- **Kapan Digunakan**: Untuk pencarian ID atau metadata berat baca di mana rasio baca/tulis tinggi.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN cache entitas yang bermutasi tanpa kloning atau tabel berintensitas tulis tinggi.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Nama cache logis pada Caffeine L1 atau Redis L2.<br/>*Catatan:* Nama wilayah harus cocok dengan konfigurasi Caffeine/Redis; pasangkan setiap operasi tulis dengan `@AutoCacheEvict`. |
| `key` | `String` | `""` | Tidak (Opsional) | Ekspresi SpEL yang merujuk argumen metode (mis. `"'product:' + #id"`) atau `""` untuk kunci otomatis.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Ekspresi kunci SpEL (`v0.1.0` menyelesaikan `EntityName:id` secara deterministik).<br/>*Catatan:* Pada aplikasi multi-tenant, selalu sertakan tenantId dalam kunci cache untuk mencegah kebocoran lintas tenant. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menghapus entri cache sisi server yang usang saat terjadi mutasi.
- **Perilaku Runtime**: Dieksekusi pasca-mutasi secara bersih tanpa menyisakan bacaan usang.
- **Cara Menggunakan**: Pasang pada metode ubah/hapus dengan pola kunci yang sama seperti `@AutoCacheable`.
- **Kapan Digunakan**: Setiap kali perubahan atau penghapusan memengaruhi data yang dicache oleh `@AutoCacheable`.
- **Kapan TIDAK Digunakan & Jebakan**: Hindari `allEntries = true` pada operasi `create` berfrekuensi tinggi (memicu Cache Stampede).

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Nama cache yang dihapus setelah metode selesai.<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `value` tidak valid langsung gagal cepat (fail-fast). |
| `key` | `String` | `""` | Tidak (Opsional) | Ekspresi SpEL yang merujuk argumen metode (mis. `"'product:' + #id"`) atau `""` untuk kunci otomatis.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Ekspresi SpEL untuk menghapus entri cache spesifik yang berubah.<br/>*Catatan:* Harus menghasilkan format kunci yang persis sama dengan `@AutoCacheable.key`; diabaikan bila `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Tidak (Opsional) | `true` (hapus semua entri di wilayah cache target) atau `false` (hapus hanya satu entri sesuai key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Jika true, menghapus entri berawalan entitas terkait secara aman.<br/>*Catatan:* Menghapus seluruh wilayah saat trafik tinggi dapat memicu cache stampede ke DB; utamakan penghapusan per `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Paket**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Memprofilkan durasi eksekusi dan mencatat log WARN bila panggilan lambat melebihi ambang.
- **Perilaku Runtime**: Juga memberi umpan timer latensi melalui DynamicEntityMetricsHelper.
- **Cara Menggunakan**: Pasang pada antarmuka controller atau layanan guna memantau pelanggaran SLA.
- **Kapan Digunakan**: Untuk laporan kompleks, batch, GraphQL, dan `@CustomQuery` guna mendeteksi kueri lambat.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN atur `warningThresholdMs <= 0` di trafik tinggi dan hindari stream SSE `/events`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Tidak (Opsional) | Angka positif (`>= 1`) dalam satuan milidetik; mis. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Ambang batas waktu dalam milidetik sebelum log peringatan `WARN` dicatat (500L).<br/>*Catatan:* Menulis log `WARN` dengan `traceId` saat ambang terlampaui; tetapkan nilai wajar (`200L–1000L`) agar log tidak membanjir. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Paket**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Tujuan**: Mengirim webhook keluar bertanda tangan HMAC-SHA256 secara asinkron di Virtual Threads pasca-komit.
- **Perilaku Runtime**: Menghitung tanda tangan di WebhookHmacSignerHelper dan memverifikasi kesamaan waktu konstan.
- **Cara Menggunakan**: Pasang di `@Entity` JPA; dikirim secara asinkron dengan aman setelah transaksi DB commit.
- **Kapan Digunakan**: Untuk memberi tahu mitra eksternal atau tenant SaaS begitu pesanan/pembayaran berhasil dicommit.
- **Kapan TIDAK Digunakan & Jebakan**: Setel `includeFullPayload = false` bila ada PII/PCI dan cegah URL SSRF internal.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Tidak (Opsional) | Array berisi nol atau lebih nilai valid: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Event siklus hidup yang memicu pengiriman webhook bertanda tangan HMAC.<br/>*Catatan:* Dikirim secara asinkron setelah commit (`AFTER_COMMIT`), sehingga transaksi rollback tidak pernah memicu webhook palsu. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Tidak (Opsional) | Nama header HTTP valid (tidak peka huruf besar/kecil di jaringan, mis. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Header HTTP yang membawa signature HMAC-SHA256.<br/>*Catatan:* Membawa tanda tangan HMAC-SHA256 payload; penerima wajib memverifikasinya sebelum memproses. |
| `includeFullPayload` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@EntityWebhook(includeFullPayload = false)` | true menyertakan payload JSON lengkap; false hanya ID dan metadata event.<br/>*Catatan:* Atur `false` (hanya ID + jenis event) untuk data PII/keuangan agar pelanggan mengambil data lewat GET terautentikasi. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Paket**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menerbitkan amplop CNCF CloudEvents v1.0 setelah komit transaksi.
- **Perilaku Runtime**: Mematuhi TransactionRuntimeBridge.executeAfterCommit untuk mencegah event palsu.
- **Cara Menggunakan**: Pasang pada entitas/metode; tangkap `CloudEventEnvelopeDto` setelah commit via `AFTER_COMMIT`.
- **Kapan Digunakan**: Untuk komunikasi antar-Bounded Context yang bersih via event tanpa JOIN SQL lintas modul.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN tertukar dengan `@EntityWebhook` dan pastikan listener berjalan pada fase `AFTER_COMMIT`.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Tidak (Opsional) | String pengenal tidak kosong (mis. `"com.acme.order.lifecycle"`); biarkan `""` untuk konvensi default.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Tipe CloudEvents (mis. "io.nwvmc.order.created").<br/>*Catatan:* Ikuti penamaan reverse-DNS CloudEvents 1.0 (`com.company.domain.event`); `""` menghasilkan otomatis. |
| `source` | `String` | `""` | Tidak (Opsional) | Jalur HTTP valid yang diawali `/` (mis. `/services/order-api`) atau string kosong `""` untuk derivasi otomatis.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` CloudEvents yang mengidentifikasi konteks pengirim.<br/>*Catatan:* Mengisi atribut URI `source` CNCF CloudEvents untuk pelacakan lintas layanan mikro. |
| `publishOnCreate` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Memancarkan CloudEvent setelah commit create (true).<br/>*Catatan:* Dipublikasikan hanya setelah commit (`AFTER_COMMIT`) melalui jembatan Spring Events / Kafka. |
| `publishOnUpdate` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Memancarkan CloudEvent setelah commit update (true).<br/>*Catatan:* Atur `false` pada entitas yang sangat sering berubah agar broker pesan tidak kebanjiran event. |
| `publishOnDelete` | `boolean` | `true` | Tidak (Opsional) | `true` (aktif) atau `false` (nonaktif).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Memancarkan CloudEvent setelah commit delete (true).<br/>*Catatan:* Berjalan untuk hapus permanen maupun `BaseAuditEntity.deleted` agar read-model hilir tetap sinkron. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Paket**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Mengikat operasi entitas atau kueri ke kunci sumber data logis tertentu.
- **Perilaku Runtime**: Mencatat jumlah perutean pada metrik framework.datasource.routing.total.
- **Cara Menggunakan**: Pasang pada metode controller atau layanan non-final; konteks sebelumnya pulih otomatis.
- **Kapan Digunakan**: Untuk offloading read-replica CQRS, laporan BI berat, atau shard datasource regional.
- **Kapan TIDAK Digunakan & Jebakan**: JANGAN mengganti datasource di tengah transaksi `@Transactional` yang sudah terbuka maupun pada kelas `final`!

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Tidak (Opsional) | Salah satu nilai yang didukung: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Kunci perutean datasource di `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Catatan:* Harus cocok dengan kunci aktif pada `DynamicRoutingDataSource`; kunci tak dikenal jatuh kembali ke `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Paket**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Tujuan**: Menetapkan jenis mesin basis data dan shard klaster logis per entitas.
- **Perilaku Runtime**: Diselesaikan secara dinamis oleh MultiPlatformDataSourceRegistryHelper & TenantDatabaseRoutingResolverHelper.
- **Cara Menggunakan**: Pasang pada entitas JPA atau metode untuk mendeklarasikan platform dan klaster DB.
- **Kapan Digunakan**: Pada arsitektur polyglot persistence yang memisahkan klaster keuangan, analitik, dan audit.
- **Kapan TIDAK Digunakan & Jebakan**: TIDAK menggantikan konfigurasi pool JDBC fisik dan dilarang melakukan JOIN SQL lintas klaster.

| Atribut | Tipe Java | Nilai Default | Wajib | Nilai Valid & Contoh | Deskripsi & Catatan Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Tidak (Opsional) | Salah satu nilai yang didukung: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Engine database target ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `platform` tidak valid langsung gagal cepat (fail-fast). |
| `cluster` | `String` | `"PRIMARY"` | Tidak (Opsional) | Salah satu nilai yang didukung: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Klaster atau shard tujuan ("PRIMARY", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER").<br/>*Catatan:* Divalidasi saat bootstrap aplikasi; salah ketik atau nilai `cluster` tidak valid langsung gagal cepat (fail-fast). |
| `readOnly` | `boolean` | `false` | Tidak (Opsional) | `true` (arahkan ke pool replika baca-saja) atau `false` (arahkan ke pool master baca-tulis).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Jika true, mengarahkan preferensi rute ke replika baca-saja.<br/>*Catatan:* Jangan pernah atur `readOnly = true` pada operasi tulis (`POST`/`PUT`/`DELETE`) karena replika menolak penulisan. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
