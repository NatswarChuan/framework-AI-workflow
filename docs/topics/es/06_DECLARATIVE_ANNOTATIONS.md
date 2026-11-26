# 06. Especificación Completa de las 60 Anotaciones Declarativas (`0.1.0`)

> **Idiomas**: **Español** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Los 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#annotations)

Referencia técnica exhaustiva de las **60 Anotaciones Declarativas** de `io.github.natswarchuan:spring-nwvmc:0.1.0`, extraídas directamente del código Java `@interface`: paquete exacto, `@Target`, **todos los atributos**, tipo Java, valor por defecto, indicador obligatorio/opcional, **cómo usar**, **cuándo usar**, **cuándo NO usar y errores comunes**, y fragmentos Java verificados.

## Índice Rápido (60 Anotaciones)

| Anotación | Categoría | `@Target` | Resumen de Atributos | Propósito Principal |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Convierte una interfaz que extiende AutoApiController<E> en un proxy dinámico JDK con 40 contratos (38 visibles por defecto en Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Redirige un contrato de controlador hacia un método de bean Spring personalizado mediante MethodHandleCacheUtil en lugar del CRUD dinámico. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Vincula rutas de flujo de dominio (pago, reembolso, aprobación) a beans Spring @Component Helper independientes. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Reemplazo puro en Java para @GetMapping sin importaciones estáticas de Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Declaración HTTP POST en Java puro compatible con tipos de medio consumes/produces personalizados. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Mapeo HTTP PUT en Java puro para reemplazo completo de recursos. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Declaración HTTP PATCH en Java puro compatible con fusiones parciales, incrementos atómicos y RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Declaración HTTP DELETE en Java puro que dispara borrado lógico protegido por estado. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Vincula parámetros de consulta URL o mapas dinámicos Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Vincula variables de ruta URI como identificadores UUIDv7 de entidades. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Deserializa cargas JSON HTTP en parámetros DTO o Entidad junto con @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Permite la navegación recursiva sobre relaciones hijas mediante GET /{id}/{relation}/** rechazando bucles cíclicos. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Declara transiciones de estado de dominio o ajustes numéricos en métodos de acción personalizados. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Marcador de componente del framework registrado al arranque sin importar @Component en compilación. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Estereotipo de capa de servicio para clases ServiceImpl emparejadas con @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Declara métodos fábrica de beans administrados dentro de clases @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Marca clases de configuración y modelos enlazados a propiedades YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Controla el orden de prioridad de ejecución entre beans SPI Customizer y cadenas de filtros. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Aplica RBAC NIST Nivel 2, aislamiento por ownerField y códigos de permiso antes de consultar o mutar entidades. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Enmascara o anula dinámicamente columnas sensibles cuando el usuario carece de roles requeridos. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Aplica transiciones permitidas en POST /{id}/transition y restringe DELETE /{id} a deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Compila cláusulas legibles de política en reglas activas de RBAC, transición y enmascaramiento. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Registra diferencias por campo entre mutaciones para reconstrucción Time-Travel e inspección /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Aísla automáticamente consultas y mutaciones por inquilino activo salvo que el llamante posea rol bypass. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Anotación marcadora — sin atributos)` | Valida la unicidad antes de persistir en creación, actualización y upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (OBLIGATORIO)` | Genera automáticamente códigos de negocio únicos con prefijo al crear o clonar si están vacíos. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (OBLIGATORIO)` | Sintetiza automáticamente slugs ASCII normalizados y aptos para URL desde sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Calcula importes numéricos derivados antes de guardar cambios en la entidad. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Permite vincular consultas SQL/JPQL personalizadas o métodos proveedor a endpoints del controlador. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Designa una entidad JPA como tabla catálogo viva de roles RBAC en base de datos. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna la columna de código de rol único dentro de una entidad @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Identifica el campo de nombre legible del rol en una entidad @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Marca el campo colección o cadena CSV que almacena códigos de permiso concedidos en un rol. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Marca una entidad JPA que almacena permisos recurso-acción y reglas dinámicas de enmascaramiento. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Designa el campo identificador único del permiso dentro de @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna el nombre de entidad o recurso API (o comodín *) dentro de @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna el verbo de acción CRUD o personalizado protegido por @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Declara campos separados por comas que deben ocultarse dinámicamente al activarse esta regla. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Mapea la entidad JPA que vincula sujetos autenticados con roles de base de datos y ámbito de inquilino. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Identifica el campo sujeto / nombre de usuario principal en @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Vincula la columna del código de rol asignado dentro de @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Acota una asignación @SecurityUserRoleEntity a un identificador de inquilino (o * para global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Marca una entidad JPA que almacena políticas explícitas ALLOW / DENY ordenadas por priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna el patrón identificador de recurso objetivo en @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna el verbo de operación protegida (READ, WRITE, DELETE, methodName, *) en @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Asigna la colección o lista CSV de roles afectados por una regla @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotación marcadora — sin atributos)` | Especifica el resultado de decisión ALLOW o DENY en una regla @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serializa accesos concurrentes sobre claves SpEL cacheadas en mapa AST (máx. 1024 entradas; defaults waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Previene escrituras duplicadas concurrentes o reenviadas dentro de ventanas TTL configurables. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Aplica limitación de tasa por ventana deslizante por partición de IP, Usuario o Inquilino. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Envuelve operaciones en Circuit Breakers de Resilience4j reportando telemetría a Actuator y Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Reintenta automáticamente fallos transitorios con retroceso exponencial configurable. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Calcula ETag débiles RFC 7232 (W/"...") y emite Cache-Control junto a respuestas HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Almacena en caché resultados de métodos de lectura del servidor en Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Invalida entradas de caché obsoletas del servidor tras mutaciones. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Mide la duración de ejecución y emite registros WARN cuando llamadas lentas superan el umbral. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Envía webhooks salientes firmados con HMAC-SHA256 asíncronamente en Virtual Threads tras commit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Publica sobres CNCF CloudEvents v1.0 después del commit transaccional. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Fija operaciones de entidad o consulta a una clave lógica de origen de datos. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Asigna familia de motor de base de datos y fragmento de clúster lógico por entidad. |

---

## 1. Enrutamiento, Contratos API Dinámicos, Desacoplamiento DTO y Parámetros (13 Anotaciones)

### `@AutoRestController`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Propósito**: Convierte una interfaz que extiende AutoApiController<E> en un proxy dinámico JDK con 40 contratos (38 visibles por defecto en Swagger UI).
- **Comportamiento en Ejecución**: DynamicControllerProxyRegistrarHelper escanea los controladores al arrancar y registra las rutas en RequestMappingHandlerMapping.
- **Cómo Usar**: Coloque `@AutoRestController(basePath = "/api/v1/...")` sobre una interfaz Java que extienda `AutoApiController<E>` o `AutoReadApi<E>`, y ajuste `disabledEndpoints` y DTOs.
- **Cuándo Usar**: Úselo para exponer CRUD estándar, paginación, filtros, keyset, analítica o APIs de solo lectura sobre una entidad JPA sin código repetitivo.
- **Cuándo NO Usar y Precauciones**: NO lo coloque sobre clases `@RestController` concretas ni en flujos sin entidad JPA; para catálogos de solo lectura prefiera `AutoReadApi<E>` en vez de `AutoApiController<E>`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | No (Opcional) | Ruta HTTP válida iniciada con `/` (ej. `/api/v1/product-catalogs`) o cadena vacía `""` para derivación automática.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Ruta URI raíz explícita (ej. "/api/v1/product-catalogs"). Si se omite, se deriva del nombre en kebab-case plural.<br/>*Precaución:* Al iniciar, el registrador evalúa `basePath` antes que `path`. Evite valores contradictorios en ambos. |
| `path` | `String` | `""` | No (Opcional) | Ruta HTTP válida iniciada con `/` (ej. `/api/v1/orders`) o cadena vacía `""` para derivación automática.<br/>`@AutoRestController(path = "/api/v1/orders")` | Atributo alias alternativo. Se recomienda basePath ya que DynamicControllerProxyRegistrarHelper prioriza extractCustomBasePath().<br/>*Precaución:* Al iniciar, el registrador evalúa `basePath` antes que `path`. Evite valores contradictorios en ambos. |
| `entityName` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"ProductCatalog"`); `""` aplica la convención por defecto.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Sobrescribe el nombre de entidad mostrado en OpenAPI/Studio en lugar del nombre simple de E.<br/>*Precaución:* Se expone directamente en Swagger / OpenAPI 3.0 y NWVMC Studio; extraiga textos a `OpenApiConstant` para evitar literales. |
| `enabledEndpoints` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Lista blanca exacta de métodos permitidos (ej. "getPage", "create"). Vacío habilita todos los heredados.<br/>*Precaución:* Actúa como lista blanca estricta: si no está vacía, cualquier método fuera de la lista se omite en Spring MVC y Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | Lista negra para deshabilitar métodos específicos de AutoApiController antes del mapeo MVC.<br/>*Precaución:* Se evalúa tras `enabledEndpoints`; útil para bloquear endpoints destructivos o masivos manteniendo el resto de los 40 contratos. |
| `enableNestedSubResources` | `boolean` | `false` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Habilita navegación recursiva GET /{id}/**. Predeterminado en false para evitar saturación de rutas.<br/>*Precaución:* Manténgalo en `false` salvo que necesite `GET /{id}/items/...`; al activarlo, combine con `@EnableNestedSubResource` para controlar relaciones. |
| `readDto` | `Class<?>` | `Void.class` | No (Opcional) | Cualquier clase Java concreta (ej. `ProductReadDto.class`) o `Void.class` para desactivar el mapeo DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO de lectura opcional para desacoplar la respuesta de campos internos; Void.class devuelve la entidad.<br/>*Precaución:* Aplica solo al flujo lectura (GET); la clase DTO requiere constructor sin argumentos/getters (o `@Builder`) y respeta `@Valid` y `@FieldSecurity`. |
| `createDto` | `Class<?>` | `Void.class` | No (Opcional) | Cualquier clase Java concreta (ej. `ProductCreateDto.class`) o `Void.class` para desactivar el mapeo DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO de entrada opcional validado con Jakarta Validation antes de crear la entidad en POST.<br/>*Precaución:* Aplica solo al flujo creación (POST); la clase DTO requiere constructor sin argumentos/getters (o `@Builder`) y respeta `@Valid` y `@FieldSecurity`. |
| `updateDto` | `Class<?>` | `Void.class` | No (Opcional) | Cualquier clase Java concreta (ej. `ProductUpdateDto.class`) o `Void.class` para desactivar el mapeo DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO de actualización opcional que restringe campos editables y valida en PUT/PATCH.<br/>*Precaución:* Aplica solo al flujo actualización (PUT/PATCH); la clase DTO requiere constructor sin argumentos/getters (o `@Builder`) y respeta `@Valid` y `@FieldSecurity`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Redirige un contrato de controlador hacia un método de bean Spring personalizado mediante MethodHandleCacheUtil en lugar del CRUD dinámico.
- **Comportamiento en Ejecución**: EscapeHatchDispatchHelper resuelve el bean destino (por targetBean o beanName) y almacena en caché su MethodHandle en MethodHandleCacheUtil.
- **Cómo Usar**: Anote un método específico (o la interfaz) con `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` sobre un bean `@Service`/`@Component`.
- **Cuándo Usar**: Úselo cuando la mayoría de rutas usan CRUD automático pero una operación concreta requiere lógica Java a medida u orquestación compleja.
- **Cuándo NO Usar y Precauciones**: NO pase cadenas a `targetBean` (requiere `Class<?>`, use `beanName` para nombres). No lo use si una regla declarativa ya resuelve el caso.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | No (Opcional) | Clase concreta de bean Spring `@Service`/`@Component` (ej. `OrderCustomService.class`), o `Void.class` para resolver por `beanName`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Clase del bean Spring destino (tiene prioridad sobre beanName).<br/>*Precaución:* Al iniciar, el registrador evalúa `targetBean` antes que `beanName`. Evite valores contradictorios en ambos. |
| `beanName` | `String` | `""` | No (Opcional) | Nombre exacto del bean registrado en ApplicationContext (ej. `"orderCustomService"`) o `""` para resolución automática.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Nombre explícito del bean en Spring cuando targetBean permanece en Void.class.<br/>*Precaución:* Al iniciar, el registrador evalúa `targetBean` antes que `beanName`. Evite valores contradictorios en ambos. |
| `methodName` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"createOrder"`); `""` aplica la convención por defecto.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nombre del método en el bean destino; si está vacío usa el mismo nombre del controlador.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"createOrder"`); un desajuste genera error en ejecución. |
| `bypassAutoDispatch` | `boolean` | `true` | No (Opcional) | `true` (por defecto: activa la sobrescritura e invoca el bean) o `false` (desactiva la sobrescritura y usa el CRUD por defecto).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Si es true, omite por completo el despacho CRUD automático y ejecuta el bean vía MethodHandle.<br/>*Precaución:* En `true` (por defecto), `EscapeHatchDispatchHelper` invoca su bean. Poner `false` desactiva `@ServiceOverride` por completo y ejecuta el CRUD estándar (NO actúa como hook pre/post). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Vincula rutas de flujo de dominio (pago, reembolso, aprobación) a beans Spring @Component Helper independientes.
- **Comportamiento en Ejecución**: Invoca delegateBean.delegateMethod mediante MethodHandle cacheado con validación completa y envoltura transaccional.
- **Cómo Usar**: Declare un método en la interfaz con `path`, `httpMethod`, `delegateBean` y `delegateMethod` apuntando a un helper `@Component`.
- **Cuándo Usar**: Úselo para acciones de dominio complejas como checkout, reembolso, aprobación o transacciones multi-entidad.
- **Cuándo NO Usar y Precauciones**: NO espere interceptores proxy en `@CustomEndpoint` (despacha antes vía `ControllerProxySpecialRouteUtil`); coloque seguridad/AOP en el bean `@Component`/`@Service` delegado y use `@BusinessAction` para transiciones simples.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/reports/monthly-sales`); `""` enlaza con la raíz.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Ruta relativa bajo el basePath del controlador (ej. "/checkout").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `path` inválidos fallan rápido antes del tráfico. |
| `httpMethod` | `String` | `"GET"` | No (Opcional) | Uno de los valores admitidos: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Verbo HTTP a enlazar ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `httpMethod` inválidos fallan rápido antes del tráfico. |
| `delegateBean` | `String` | `""` | No (Opcional) | Nombre exacto del bean registrado en ApplicationContext (ej. `"orderReportService"`) o `""` para resolución automática.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nombre del bean Spring con la lógica delegada (no puede estar vacío salvo método default o @ServiceOverride).<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `delegateBean` inválidos fallan rápido antes del tráfico. |
| `delegateMethod` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"buildMonthlyReport"`); `""` aplica la convención por defecto.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nombre del método en delegateBean; si está vacío toma el nombre del controlador.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"buildMonthlyReport"`); un desajuste genera error en ejecución. |
| `summary` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"Get monthly revenue breakdown"`); `""` aplica la convención por defecto.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Resumen corto de operación OpenAPI 3.0 visible en Swagger UI.<br/>*Precaución:* Se expone directamente en Swagger / OpenAPI 3.0 y NWVMC Studio; extraiga textos a `OpenApiConstant` para evitar literales. |
| `description` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"Aggregates confirmed invoice totals grouped by currency"`); `""` aplica la convención por defecto.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Descripción detallada OpenAPI 3.0 al expandir el endpoint en Swagger UI.<br/>*Precaución:* Se expone directamente en Swagger / OpenAPI 3.0 y NWVMC Studio; extraiga textos a `OpenApiConstant` para evitar literales. |

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

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Reemplazo puro en Java para @GetMapping sin importaciones estáticas de Spring Web.
- **Comportamiento en Ejecución**: Se asigna a un RequestMappingInfo HTTP GET durante el arranque del proxy.
- **Cómo Usar**: Coloque `@AutoGet("/tu-ruta")` en un método de `@AutoRestController` junto con `@ServiceOverride` o `@CustomQuery`.
- **Cuándo Usar**: Úselo para rutas HTTP GET de solo lectura en interfaces Java puras sin importar `@GetMapping`.
- **Cuándo NO Usar y Precauciones**: NO lo utilice para mutar datos (use `@AutoPost`/`@AutoPut`/`@AutoPatch`/`@AutoDelete`), ni sobre un `@RestController` concreto.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/{id}/summary`); `""` enlaza con la raíz.<br/>`@AutoGet("/{id}/summary")` | Plantilla de ruta GET relativa (ej. "/metrics"). Vacío mapea directo al basePath.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `produces` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json", "text/csv"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Tipos multimedia producidos opcionales (ej. "text/event-stream", "text/csv").<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Accept`; cabeceras incompatibles devuelven `406` o `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Declaración HTTP POST en Java puro compatible con tipos de medio consumes/produces personalizados.
- **Comportamiento en Ejecución**: Se registra como manejador HTTP POST en SpringMvcEndpointBridge.
- **Cómo Usar**: Anote métodos de creación o acción con `@AutoPost("/ruta")`, vincule el cuerpo con `@AutoBody`/`@RequestBody` y combine con `@BusinessAction` o `@ServiceOverride`.
- **Cuándo Usar**: Úselo para creación de recursos, comandos de negocio, envíos por lotes o flujos POST declarativos.
- **Cuándo NO Usar y Precauciones**: NO lo utilice para lecturas (`@AutoGet`), reemplazos completos (`@AutoPut`), parches (`@AutoPatch`) ni borrados (`@AutoDelete`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/{id}/approve`); `""` enlaza con la raíz.<br/>`@AutoPost("/{id}/approve")` | Plantilla de ruta POST relativa bajo el basePath.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `consumes` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json", "multipart/form-data"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Tipos Content-Type aceptados en la petición.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Content-Type`; cabeceras incompatibles devuelven `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Tipos multimedia devueltos en la respuesta.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Accept`; cabeceras incompatibles devuelven `406` o `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Mapeo HTTP PUT en Java puro para reemplazo completo de recursos.
- **Comportamiento en Ejecución**: Vinculado como controlador HTTP PUT dentro de ejecución transaccional.
- **Cómo Usar**: Coloque `@AutoPut("/{id}")` en métodos de reemplazo completo junto con `@AutoVariable` y `@AutoBody`.
- **Cuándo Usar**: Úselo para reemplazos completos e idempotentes con la representación total del recurso.
- **Cuándo NO Usar y Precauciones**: NO lo utilice para parches parciales de un campo (`@AutoPatch` o `@BusinessAction`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/{id}/replace`); `""` enlaza con la raíz.<br/>`@AutoPut("/{id}/replace")` | Plantilla de ruta PUT relativa (ej. "/{id}").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `consumes` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Tipos Content-Type aceptados.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Content-Type`; cabeceras incompatibles devuelven `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Tipos multimedia generados en la respuesta.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Accept`; cabeceras incompatibles devuelven `406` o `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Declaración HTTP PATCH en Java puro compatible con fusiones parciales, incrementos atómicos y RFC 6902 JSON Patch.
- **Comportamiento en Ejecución**: Admite semántica de fusión JSON y application/json-patch+json.
- **Cómo Usar**: Aplique `@AutoPatch("/{id}/accion")` en métodos de parche parcial o `@BusinessAction`.
- **Cuándo Usar**: Úselo para modificaciones parciales, incrementos atómicos y transiciones de estado.
- **Cuándo NO Usar y Precauciones**: NO lo use si requiere reemplazo integral (`@AutoPut`) ni creación (`@AutoPost`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/{id}/status`); `""` enlaza con la raíz.<br/>`@AutoPatch("/{id}/status")` | Plantilla de ruta PATCH relativa (ej. "/{id}/approve").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `consumes` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json", "application/merge-patch+json"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Tipos Content-Type aceptados.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Content-Type`; cabeceras incompatibles devuelven `406` o `415`. |
| `produces` | `String[]` | `{}` | No (Opcional) | Arreglo de tipos MIME (ej. `{"application/json"}`); `{}` vacío usa `application/json` por defecto.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Tipos multimedia generados.<br/>*Precaución:* Spring MVC aplica negociación de contenido sobre `Accept`; cabeceras incompatibles devuelven `406` o `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Declaración HTTP DELETE en Java puro que dispara borrado lógico protegido por estado.
- **Comportamiento en Ejecución**: Valida @StateMachine deletableStates antes de marcar deleted=true.
- **Cómo Usar**: Coloque `@AutoDelete("/{id}/custom")` en métodos de borrado personalizados junto a `@ServiceOverride`.
- **Cuándo Usar**: Úselo para archivado, borrado lógico personalizado o limpieza en cascada vía DELETE.
- **Cuándo NO Usar y Precauciones**: NO redefina `deleteById` si el borrado lógico estándar con `@StateMachine` ya cubre el requisito.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Subruta URI relativa con variables opcionales `{pathVar}` (ej. `/{id}/archive`); `""` enlaza con la raíz.<br/>`@AutoDelete("/{id}/archive")` | Plantilla de ruta DELETE relativa (ej. "/{id}/purge").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Propósito**: Vincula parámetros de consulta URL o mapas dinámicos Map<String, String>.
- **Comportamiento en Ejecución**: Se extrae mediante DynamicQueryParameterParserHelper con validación de QueryGuardrailEnforcerUtil.
- **Cómo Usar**: Colóquelo en parámetros de método como `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")`.
- **Cuándo Usar**: Úselo cuando quiera interfaces 100% Pure Java sin imports de Spring Web para parámetros de consulta.
- **Cuándo NO Usar y Precauciones**: No lo use para placeholders de ruta (`@AutoVariable`) ni cuerpo JSON (`@AutoBody`). `v0.1.0` también soporta `@RequestParam`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"status"`); `""` aplica la convención por defecto.<br/>`@AutoParam("status") String status` | Nombre del parámetro query (alias de name). Vacío usa el nombre en bytecode Java.<br/>*Precaución:* Al iniciar, el registrador evalúa `value` antes que `name`. Evite valores contradictorios en ambos. |
| `name` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"pageSize"`); `""` aplica la convención por defecto.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Nombre explícito del parámetro query.<br/>*Precaución:* Al iniciar, el registrador evalúa `value` antes que `name`. Evite valores contradictorios en ambos. |
| `required` | `boolean` | `true` | No (Opcional) | `true` (obligatorio; ausente devuelve HTTP 400) o `false` (opcional; pasa null si se omite).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Indica si omitir el parámetro devuelve HTTP 400.<br/>*Precaución:* Si define `defaultValue` pasa a ser opcional automáticamente; con `false`, use tipos envoltorio (`Integer`, `Boolean`) en lugar de primitivos. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | No (Opcional) | Cadena identificadora no vacía (ej. `"20"`); `""` aplica la convención por defecto.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Valor de respaldo si falta el parámetro (por defecto centinela DEFAULT_NONE).<br/>*Precaución:* Se convierte desde String mediante Spring `ConversionService` al tipo destino; literales inválidos fallan con HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Propósito**: Vincula variables de ruta URI como identificadores UUIDv7 de entidades.
- **Comportamiento en Ejecución**: Se analiza en valores Java tipados UUID/String desde plantillas de ruta MVC.
- **Cómo Usar**: Anote parámetros de ruta como `findById(@AutoVariable("id") UUID id)`.
- **Cuándo Usar**: Para extraer `{id}`, `{slug}` o `{code}` en interfaces sin dependencia Spring Web.
- **Cuándo NO Usar y Precauciones**: NO lo utilice para parámetros `?query=` (`@AutoParam`) ni JSON (`@AutoBody`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"orderId"`); `""` aplica la convención por defecto.<br/>`@AutoVariable("orderId") UUID orderId` | Nombre de la variable de ruta URI (alias de name).<br/>*Precaución:* Al iniciar, el registrador evalúa `value` antes que `name`. Evite valores contradictorios en ambos. |
| `name` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"tenantCode"`); `""` aplica la convención por defecto.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Nombre explícito de la variable de ruta.<br/>*Precaución:* Al iniciar, el registrador evalúa `value` antes que `name`. Evite valores contradictorios en ambos. |
| `required` | `boolean` | `true` | No (Opcional) | `true` (obligatorio; ausente devuelve HTTP 400) o `false` (opcional; pasa null si se omite).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Indica si la variable de ruta es obligatoria.<br/>*Precaución:* Debe coincidir con `{variableName}` en la plantilla URI del método; `false` solo aplica cuando hay rutas alternativas. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Propósito**: Deserializa cargas JSON HTTP en parámetros DTO o Entidad junto con @Valid.
- **Comportamiento en Ejecución**: Se valida con LocalValidatorFactoryBean antes de entrar a la transacción de servicio.
- **Cómo Usar**: Colóquelo en el parámetro payload de métodos `@AutoPost`/`@AutoPut`/`@AutoPatch` (con `@Valid`).
- **Cuándo Usar**: Para deserializar cuerpos JSON hacia entidades o DTOs en interfaces Pure Java.
- **Cuándo NO Usar y Precauciones**: NO lo coloque en GET/DELETE sin cuerpo ni declare más de un `@AutoBody` por método.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | No (Opcional) | `true` (obligatorio; ausente devuelve HTTP 400) o `false` (opcional; pasa null si se omite).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Indica si un cuerpo HTTP ausente provoca HTTP 400.<br/>*Precaución:* Combine con `@Valid` para validar antes del despacho; `false` permite cuerpos HTTP vacíos sin lanzar `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Permite la navegación recursiva sobre relaciones hijas mediante GET /{id}/{relation}/** rechazando bucles cíclicos.
- **Comportamiento en Ejecución**: Requiere @AutoRestController(enableNestedSubResources = true) en el controlador.
- **Cómo Usar**: Active `enableNestedSubResources = true` en `@AutoRestController` y restrinja las relaciones con `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **Cuándo Usar**: Cuando necesite URLs anidadas tipo `GET /api/v1/customer-orders/{id}/items` manteniendo validación de seguridad y tenant en cada salto.
- **Cuándo NO Usar y Precauciones**: NO lo habilite sin `allowedRelationships` en tablas con muchas relaciones ni entre contextos separados.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Lista blanca opcional de entidades destino permitidas al recorrer GET /{id}/**.<br/>*Precaución:* Un arreglo vacío expone todas las entidades hijas alcanzables; liste clases explícitas para evitar exponer tablas internas. |
| `allowedRelationships` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Nombres de relaciones JPA permitidas en rutas de sub-recursos (ej. "items", "customer").<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"items"`); un desajuste genera error en ejecución. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Declara transiciones de estado de dominio o ajustes numéricos en métodos de acción personalizados.
- **Comportamiento en Ejecución**: Se ejecuta atómicamente antes de persistir los atributos actualizados de la entidad.
- **Cómo Usar**: Combine `@AutoPatch` con `@BusinessAction(...)` en un método de la interfaz controlador para ejecución transaccional automática.
- **Cuándo Usar**: Para transiciones de estado (`approve`, `cancel`), ajustes de inventario/saldo o ejecución de métodos en una entidad sin escribir Service.
- **Cuándo NO Usar y Precauciones**: NO lo utilice para orquestar múltiples entidades, llamadas HTTP externas o tareas asíncronas (`@ServiceOverride` / `@CustomEndpoint`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo estado de ciclo de vida (ej. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nombre del campo de estado en la entidad (validado con @StateMachine si existe).<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"status"`); un desajuste genera error en ejecución. |
| `targetStateValue` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"APPROVED"`); `""` aplica la convención por defecto.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nuevo valor de estado a asignar dentro de la transacción.<br/>*Precaución:* Se valida automáticamente contra `@StateMachine` o `@HumanPolicy` antes de guardar; transiciones inválidas revierten la transacción. |
| `adjustNumericField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo numérico (ej. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Propiedad numérica a incrementar o decrementar atómicamente.<br/>*Precaución:* Requiere `deltaParamIndex >= 0` o `fixedDelta` no vacío. Soporta `Integer`, `Long`, `BigDecimal` y `Double` en transacción. |
| `deltaParamIndex` | `int` | `-1` | No (Opcional) | Uno de los valores admitidos: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Índice base cero del parámetro que contiene el delta numérico (-1 desactiva).<br/>*Precaución:* Al iniciar, el registrador evalúa `deltaParamIndex` antes que `fixedDelta`. Evite valores contradictorios en ambos. |
| `fixedDelta` | `String` | `""` | No (Opcional) | Uno de los valores admitidos: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Cadena numérica fija (ej. "100", "-1") aplicada cuando deltaParamIndex es -1.<br/>*Precaución:* Al iniciar, el registrador evalúa `deltaParamIndex` antes que `fixedDelta`. Evite valores contradictorios en ambos. |
| `entityMethod` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"markFulfilled"`); `""` aplica la convención por defecto.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Método sin argumentos en la entidad ejecutado dentro de la misma transacción.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"markFulfilled"`); un desajuste genera error en ejecución. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Descubrimiento de Beans, Enlace de Configuración y Orden de Ejecución (5 Anotaciones)

### `@AutoComponent`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Marcador de componente del framework registrado al arranque sin importar @Component en compilación.
- **Comportamiento en Ejecución**: Escaneo interno del framework (io.github.natswarchuan); aplicaciones cliente deben usar @Component de Spring.
- **Cómo Usar**: Estereotipo interno del framework escaneado por `AutoBeanFactoryRegistrarBridge` en `io.github.natswarchuan`.
- **Cuándo Usar**: Úselo SÓLO al contribuir módulos internos dentro de `io.github.natswarchuan.*`.
- **Cuándo NO Usar y Precauciones**: ¡NUNCA lo use en apps consumidoras (`com.example.*`)! El escáner sólo busca en `io.github.natswarchuan`; use `@Component`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Nombre exacto del bean registrado en ApplicationContext (ej. `"invoiceValidationHelper"`) o `""` para resolución automática.<br/>`@AutoComponent("invoiceValidationHelper")` | Nombre explícito opcional del bean; vacío usa el nombre en camelCase.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Estereotipo de capa de servicio para clases ServiceImpl emparejadas con @ServiceOverride.
- **Comportamiento en Ejecución**: Escaneado en io.github.natswarchuan por nombre simple decapitalizado; los servicios cliente usan Spring @Service.
- **Cómo Usar**: Estereotipo interno de servicio escaneado únicamente dentro de `io.github.natswarchuan`.
- **Cuándo Usar**: Úselo SÓLO para servicios internos del framework en `io.github.natswarchuan.*`.
- **Cuándo NO Usar y Precauciones**: NUNCA en servicios de su aplicación (`com.example.*`); use `@Service` de Spring.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Nombre exacto del bean registrado en ApplicationContext (ej. `"orderFulfillmentService"`) o `""` para resolución automática.<br/>`@AutoService("orderFulfillmentService")` | Nombre opcional del bean de servicio en el contenedor.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Declara métodos fábrica de beans administrados dentro de clases @AutoConfigurationBean.
- **Comportamiento en Ejecución**: Procesado por PureJavaBeanRegistrarBridge durante la autoconfiguración.
- **Cómo Usar**: Colóquelo en métodos fábrica dentro de clases `@AutoConfigurationBean` del framework.
- **Cuándo Usar**: Úselo SÓLO dentro de `io.github.natswarchuan.config.*` en código fuente del framework.
- **Cuándo NO Usar y Precauciones**: NO lo utilice en clases `@Configuration` de usuario; use `@Bean` estándar de Spring.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Nombre(s) y alias explícitos del bean.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `targetTypeName` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"com.example.spi.PaymentGateway"`); `""` aplica la convención por defecto.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | FQCN opcional del tipo destino para comprobaciones bridge.<br/>*Precaución:* Nombre FQCN opcional cuando la fábrica devuelve un supertipo o proxy dinámico; verifique su presencia en el classpath. |
| `primary` | `boolean` | `false` | No (Opcional) | `true` (bean preferido cuando existen varios candidatos) o `false` (prioridad estándar de candidato).<br/>`@AutoBean(primary = true)` | Marca el bean como candidato principal ante conflictos de inyección.<br/>*Precaución:* Declarar dos `@AutoBean(primary = true)` para el mismo tipo provoca conflicto de ambigüedad al arrancar. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Marca clases de configuración y modelos enlazados a propiedades YAML.
- **Comportamiento en Ejecución**: Registra beans de configuración y prefijos YAML de forma limpia con metadatos IDE.
- **Cómo Usar**: Marca clases de configuración y propiedades internas bajo `io.github.natswarchuan.config.*`.
- **Cuándo Usar**: Úselo SÓLO en código interno del framework como equivalente Pure Java a `@Configuration`.
- **Cuándo NO Usar y Precauciones**: NO lo utilice en configuraciones de aplicación cliente; use Spring `@Configuration`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Nombre exacto del bean registrado en ApplicationContext (ej. `"storageAutoConfig"`) o `""` para resolución automática.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Identificador opcional del bean de configuración.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `prefix` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"nwvmc.storage"`); `""` aplica la convención por defecto.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Prefijo YAML opcional vinculado mediante `PureJavaBeanRegistrarBridge`.<br/>*Precaución:* Enlaza propiedades kebab-case de `application.yml`; combine con `spring-configuration-metadata.json` para cero alertas IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Propósito**: Controla el orden de prioridad de ejecución entre beans SPI Customizer y cadenas de filtros.
- **Comportamiento en Ejecución**: Los valores enteros menores se ejecutan antes (por defecto Integer.MAX_VALUE).
- **Cómo Usar**: Aplique `@OrderPriority(1)` sobre interceptores, customizers o beans ordenables Pure Java.
- **Cuándo Usar**: Cuando necesite un orden determinista entre varios customizers SPI o filtros.
- **Cuándo NO Usar y Precauciones**: NO lo confunda con filtros de Spring Security ni con el parámetro `?sort=`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | No (Opcional) | Uno de los valores admitidos: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Entero de prioridad de ejecución; menor valor = mayor prioridad.<br/>*Precaución:* Los números menores se ejecutan PRIMERO (igual que Spring `@Order`). Reserve `< 0` para seguridad/trazado y `10..100` para negocio. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Seguridad de Entidades, Máquina de Estados, Integridad, Generadores y Consultas (11 Anotaciones)

### `@EntitySecurity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Aplica RBAC NIST Nivel 2, aislamiento por ownerField y códigos de permiso antes de consultar o mutar entidades.
- **Comportamiento en Ejecución**: Se evalúa antes de ejecutar SQL; el acceso no autorizado lanza HTTP 403 Forbidden.
- **Cómo Usar**: Colóquelo en la entidad JPA definiendo `readRoles`, `writeRoles`, `deleteRoles` y opcionalmente `ownerField`.
- **Cuándo Usar**: Úselo en TODA entidad JPA expuesta para unificar seguridad en REST, batch, exportación y GraphQL.
- **Cuándo NO Usar y Precauciones**: NO use `permitAll = true` sobre `AutoApiController<E>` completo sin `AutoReadApi<E>`, `disabledEndpoints` o `@SecurityPolicyEntity` (omite comprobaciones en READ, WRITE y DELETE si no hay política DB).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_USER", "ROLE_ADMIN"}`); `{}` vacío no añade restricción propia.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Roles autorizados para leer registros (GET, GraphQL, analítica, exportación).<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |
| `writeRoles` | `String[]` | `{}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); `{}` vacío no añade restricción propia.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Roles autorizados para escrituras POST/PUT/PATCH/import/batch.<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |
| `deleteRoles` | `String[]` | `{}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vacío no añade restricción propia.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Roles autorizados para operaciones DELETE / borrado por lotes.<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |
| `permitAll` | `boolean` | `false` | No (Opcional) | `true` (permitir acceso público sin autenticación) o `false` (exigir autenticación y verificación de roles).<br/>`@EntitySecurity(permitAll = true)` | Si es true (sin política DB-RBAC), omite los controles de @EntitySecurity en READ, WRITE y DELETE; combine catálogos públicos con AutoReadApi<E> o disabledEndpoints.<br/>*Precaución:* Anula `readRoles`/`writeRoles`/`deleteRoles` y permite acceso anónimo. Nunca lo active en PII ni entidades financieras. |
| `ownerField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo propietario/UUID (ej. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Campo que guarda el propietario ("createdBy", "ownerId"); aplica filtro anti-IDOR.<br/>*Precaución:* Aplica filtro de propiedad por fila en `GET`/`PUT`/`PATCH`/`DELETE`; solo roles en `bypassOwnerRoles` ven registros ajenos. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vacío no añade restricción propia.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Roles privilegiados que omiten la restricción de `ownerField`.<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |
| `permissions` | `String[]` | `{}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ORDER_READ", "ORDER_APPROVE"}`); `{}` vacío no añade restricción propia.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Códigos de permiso granulares evaluados junto con los roles.<br/>*Precaución:* Se evalúa contra permisos granulares de JWT o DB-RBAC `@SecurityPermissionEntity`, combinable con roles. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Enmascara o anula dinámicamente columnas sensibles cuando el usuario carece de roles requeridos.
- **Comportamiento en Ejecución**: Se aplica después de la lectura y antes de la serialización JSON.
- **Cómo Usar**: Anote campos sensibles (`costPrice`, `ssn`); el enmascaramiento actúa sobre copias clonadas sin alterar caché ni BD.
- **Cuándo Usar**: Cuando una misma API sirve distintos roles (`ROLE_USER` ve máscara/`null`, `ROLE_ADMIN` ve datos completos).
- **Cuándo NO Usar y Precauciones**: No tema fugas en no-`String` (`BigDecimal`/`LocalDate` pasan a `null` automáticamente); active `nullifyInsteadOfMask = true` para anular campos `String`, o use `readDto` para omitir la clave.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); `{}` vacío no añade restricción propia.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Roles autorizados a ver el valor real sin enmascarar.<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |
| `maskPattern` | `String` | `"******"` | No (Opcional) | Cadena identificadora no vacía (ej. `"***-**-****"`); `""` aplica la convención por defecto.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Patrón de máscara devuelto en campos String cuando faltan roles.<br/>*Precaución:* Se ignora si `nullifyInsteadOfMask = true`. Para campos numéricos o de fecha (`BigDecimal`, `LocalDate`), use `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | No (Opcional) | `true` (reemplazar el campo no autorizado por null) o `false` (aplicar cadena maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Si es true, fuerza null incluso en String en vez de maskPattern (los tipos no String ya pasan a null automáticamente).<br/>*Precaución:* Indispensable en campos numéricos, fechas y objetos para que clientes TypeScript/Zod reciban `null` válido. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Aplica transiciones permitidas en POST /{id}/transition y restringe DELETE /{id} a deletableStates.
- **Comportamiento en Ejecución**: Rechaza transiciones o eliminaciones ilegales con HTTP 422 BusinessRuleViolationException.
- **Cómo Usar**: Aplíquelo sobre el campo String de estado usando `:` como delimitador (`"CREATED:PAID,CANCELLED"`).
- **Cuándo Usar**: Para ciclos de vida estrictos (pedidos, préstamos, facturas) bloqueando saltos ilegales con HTTP `422`.
- **Cuándo NO Usar y Precauciones**: NUNCA utilice la sintaxis `"->"` (`EntityStateMachineUtil` exige estrictamente `":"`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | No (Opcional) | Cadena identificadora no vacía (ej. `"CREATED"`); `""` aplica la convención por defecto.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Estado inicial inyectado al crear la entidad si el campo está vacío ("ACTIVE").<br/>*Precaución:* Se asigna automáticamente al crear vía `POST` si llega vacío; debe coincidir con el estado origen antes de `:` en `transitions`. |
| `transitions` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Reglas permitidas en formato con dos puntos "FROM:TO_1,TO_2".<br/>*Precaución:* Exige la sintaxis exacta con dos puntos `"FROM:TO1,TO2"` (sensible a mayúsculas, destinos separados por comas). Cualquier salto no declarado devuelve HTTP `422`. |
| `deletableStates` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Estados en los que se permite DELETE (otros devuelven HTTP 422).<br/>*Precaución:* Si no está vacío, `DELETE /{id}` fallan con HTTP `422 Unprocessable Entity` cuando la entidad está en otro estado (ej. `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Compila cláusulas legibles de política en reglas activas de RBAC, transición y enmascaramiento.
- **Comportamiento en Ejecución**: Inspeccionable en GET /human-policy y sobrescribible en YAML bajo spring-nwvmc.human-policies.<Entity>.
- **Cómo Usar**: Colóquelo en la entidad o configúrelo vía YAML `spring-nwvmc.human-policies`; se compila al inicio en `HumanPolicyDefinitionDto`.
- **Cuándo Usar**: Cuando equipos de producto o cumplimiento necesitan reglas legibles externamente sin editar código Java.
- **Cuándo NO Usar y Precauciones**: NO redacte ensayos libres ni otros idiomas: `HumanPolicyRegexCompilerHelper` parsea plantillas inglesas deterministas.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | No (Opcional) | Uno de los valores admitidos: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Directiva en inglés natural compilada hacia transiciones de estado.<br/>*Precaución:* Se compila al inicio al mismo motor que `@StateMachine`; no declare reglas contradictorias con `@StateMachine` en la misma entidad. |
| `security` | `String` | `""` | No (Opcional) | Uno de los valores admitidos: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Directiva RBAC en inglés natural para lectura/escritura/borrado/dueño.<br/>*Precaución:* Los roles se normalizan automáticamente con prefijo `ROLE_` y las frases inválidas fallan rápido al arrancar. |
| `masking` | `String` | `""` | No (Opcional) | Uno de los valores admitidos: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Política en inglés natural indicando campos ocultos y roles autorizados.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"costPrice"`); un desajuste genera error en ejecución. |
| `stateField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo estado de ciclo de vida (ej. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Campo de la entidad donde reside el estado gestionado por `lifecycle`.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"orderStatus"`); un desajuste genera error en ejecución. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Registra diferencias por campo entre mutaciones para reconstrucción Time-Travel e inspección /diff.
- **Comportamiento en Ejecución**: Captura deltas oldValue y newValue al crear, actualizar, parchear, transicionar y restaurar.
- **Cómo Usar**: Anote la entidad que extiende `BaseAuditEntity` con `@AuditTrail`; cada escritura guarda una revisión.
- **Cuándo Usar**: En entidades críticas de cumplimiento (pagos, pedidos, historiales clínicos) que requieran `GET /api/v1/system/time-travel/{entityName}/{id}`.
- **Cuándo NO Usar y Precauciones**: Desactive `recordFieldDiffs = false` u omítalo en tablas de telemetría/logs de altísima escritura.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"FINANCE_LEDGER"`); `""` aplica la convención por defecto.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Categoría lógica registrada en cada evento de auditoría (vacío usa el nombre de la entidad).<br/>*Precaución:* Etiqueta los registros de auditoría para filtrado por dominio; `""` usa el nombre de la clase entidad. |
| `recordFieldDiffs` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Si es true, calcula diferencias campo a campo entre estado previo y nuevo para Time-Travel.<br/>*Precaución:* Registra diferencias antes/después en cada `PUT`/`PATCH`; desactívelo (`false`) en entidades con blobs o escrituras masivas. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Aísla automáticamente consultas y mutaciones por inquilino activo salvo que el llamante posea rol bypass.
- **Comportamiento en Ejecución**: Responde HTTP 403 fail-closed cuando falta contexto de inquilino sin rol bypass; sobrescribe tenantId en creación (anti-spoofing) y protege todas las operaciones por ID contra IDOR.
- **Cómo Usar**: Anote la entidad con `@MultiTenant`; el runtime filtra lecturas, evita falsificación al crear y bloquea con `403` sin tenant.
- **Cuándo Usar**: En todas las tablas SaaS compartidas (tiendas, pedidos, facturas) para evitar fugas entre inquilinos.
- **Cuándo NO Usar y Precauciones**: NO lo utilice en catálogos globales compartidos (países, monedas) ni sin claim `tenantId` para usuarios normales.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo identificador de inquilino (ej. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Campo String que almacena el identificador de inquilino (predeterminado "tenantId").<br/>*Precaución:* Cree un índice compuesto `(tenant_id, id)` en base de datos para consultas O(log N) y aislamiento estricto entre inquilinos. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | No (Opcional) | Arreglo de roles de Spring Security (ej. `{"ROLE_SUPER_ADMIN"}`); `{}` vacío no añade restricción propia.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Roles globales autorizados a consultar o modificar datos de todos los inquilinos.<br/>*Precaución:* Defina los roles en `RoleConstant` con prefijo `ROLE_` (ej. `ROLE_ADMIN`) coherente con Spring Security `GrantedAuthority`. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Valida la unicidad antes de persistir en creación, actualización y upsert.
- **Comportamiento en Ejecución**: Lanza ConflictBusinessException (HTTP 409) cuando existe un valor duplicado.
- **Cómo Usar**: Colóquelo en propiedades clave de negocio (`email`, `skuCode`) junto a `@Column(unique = true)` para prevalidar duplicados activos (`deleted = false`).
- **Cuándo Usar**: Cuando desee validar unicidad lógica antes del SQL y devolver errores `HTTP 409 Conflict` localizados.
- **Cuándo NO Usar y Precauciones**: NO omita el índice `UNIQUE` en base de datos bajo alta concurrencia; tampoco lo aplique en campos no únicos.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Genera automáticamente códigos de negocio únicos con prefijo al crear o clonar si están vacíos.
- **Comportamiento en Ejecución**: Rellena prefijo + token único antes de validar y guardar la entidad.
- **Cómo Usar**: Anote el campo String con `@AutoCode(prefix = "PRD-")`; si llega vacío al crear o clonar se autogenera.
- **Cuándo Usar**: Para códigos de negocio legibles (pedidos, SKUs, tiendas, tickets) sin cuellos de botella de secuencias DB.
- **Cuándo NO Usar y Precauciones**: NO lo utilice si la ley exige numeración estrictamente secuencial sin saltos (`1, 2, 3...`, ej. facturas fiscales).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Obligatorio (sin valor por defecto)` | **Sí (Obligatorio)** | Prefijo obligatorio no vacío (ej. `"PRD-"`, `"INV-"`); omitirlo impide compilar.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Prefijo obligatorio antepuesto a un hash UUIDv7 de 8 caracteres (ej. "PRD-").<br/>*Precaución:* Atributo obligatorio; añade un hash UUIDv7 de 8 caracteres (ej. `INV-0194E1A0`) solo si llega vacío al crear o clonar, conservando el código si el cliente lo envía. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Sintetiza automáticamente slugs ASCII normalizados y aptos para URL desde sourceField.
- **Comportamiento en Ejecución**: Normaliza diacríticos Unicode y habilita búsquedas mediante filtros por slug.
- **Cómo Usar**: Anote el campo `slug` con `@AutoSlug(sourceField = "title")`; se completa al crear si viene vacío.
- **Cuándo Usar**: Para URLs SEO amigables en tiendas, artículos, categorías y catálogos multilingües.
- **Cuándo NO Usar y Precauciones**: NO apunte `sourceField` a una propiedad inexistente; actualizar el título luego no cambia un `slug` existente.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Obligatorio (sin valor por defecto)` | **Sí (Obligatorio)** | Nombre exacto de propiedad Java en la entidad para un campo String (ej. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Propiedad origen obligatoria cuyo valor se normaliza a slug ASCII en minúsculas.<br/>*Precaución:* Obligatorio; normaliza acentos y Unicode a kebab-case seguro para URL. Combine con `@UniqueField` para garantizar unicidad. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Propósito**: Calcula importes numéricos derivados antes de guardar cambios en la entidad.
- **Comportamiento en Ejecución**: Validado al arranque por ComputedFieldFailFastUtil para fallar rápido ante sourceFields inválidos.
- **Cómo Usar**: Anote el campo calculado (`BigDecimal totalAmount`); se recalcula en servidor con `BigDecimal` antes de persistir.
- **Cuándo Usar**: Para totales de línea y subtotales autoritativos en servidor evitando manipulación de importes por el cliente.
- **Cuándo NO Usar y Precauciones**: NO lo use para descuentos escalonados complejos o reglas con API/DB externas (use `@ServiceOverride`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | No (Opcional) | Uno de los valores admitidos: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Estrategia de cálculo: "MULTIPLY" o "SUM_COLLECTION".<br/>*Precaución:* Se recalcula automáticamente antes de guardar en `POST`/`PUT`/`PATCH`, anulando totales manipulados por el cliente. |
| `sourceFields` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Campos de la misma entidad que se multiplican entre sí en modo "MULTIPLY".<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"unitPrice"`); un desajuste genera error en ejecución. |
| `collectionField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo colección @OneToMany (ej. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Campo colección @OneToMany agregado en modo "SUM_COLLECTION" (ej. "items").<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"items"`); un desajuste genera error en ejecución. |
| `itemField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo numérico (ej. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Campo numérico en cada elemento hijo que se suma (ej. "subTotal").<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"subTotal"`); un desajuste genera error en ejecución. |
| `subtractField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo numérico (ej. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Campo de descuento en la entidad padre restado del total.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"discountAmount"`); un desajuste genera error en ejecución. |
| `addField` | `String` | `""` | No (Opcional) | Nombre exacto de propiedad Java en la entidad para un campo numérico (ej. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Campo de recargo opcional sumado al total (ej. "shippingFee").<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"shippingFee"`); un desajuste genera error en ejecución. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Permite vincular consultas SQL/JPQL personalizadas o métodos proveedor a endpoints del controlador.
- **Comportamiento en Ejecución**: Se ejecuta con parámetros nombrados enlazados mediante JPA EntityManager.
- **Cómo Usar**: Combínelo con `@AutoGet`/`@AutoPost` vinculando cada `:param` con `@AutoParam` o `@AutoVariable`.
- **Cuándo Usar**: Para reportes SQL nativos, CTEs, funciones ventana o JSONB sin escribir interfaces `JpaRepository`.
- **Cuándo NO Usar y Precauciones**: NUNCA concatene entrada de usuario en el SQL (use `:param`); tampoco cruce Bounded Contexts con `JOIN`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | No (Opcional) | Uno de los valores admitidos: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Consulta SQL o JPQL en línea con parámetros nombrados `:param`.<br/>*Precaución:* Use siempre parámetros enlazados `:param` o `?1` contra inyección SQL; deje `""` si usa `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | No (Opcional) | `true` (ejecutar SQL nativo de base de datos) o `false` (ejecutar JPQL portable de JPA).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true ejecuta SQL nativo directo; false ejecuta JPQL de JPA.<br/>*Precaución:* SQL nativo (`true`) habilita CTE y funciones de ventana; use `false` (JPQL) para portabilidad entre H2, PostgreSQL y MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | No (Opcional) | Cualquier clase Java concreta (ej. `MonthlyRevenueDto.class`) o `Void.class` para desactivar el mapeo DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Clase destino opcional para mapear filas devueltas.<br/>*Precaución:* Especifique siempre un DTO de proyección en consultas agregadas para evitar `SELECT *` y filas `Object[]` sin tipo. |
| `sqlProvider` | `Class<?>` | `Void.class` | No (Opcional) | Clase proveedora de SQL en Pure Java (ej. `OrderAnalyticsSqlProvider.class`), o `Void.class` al usar `value` en línea.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Clase Pure Java proveedora de SQL dinámico validada en arranque.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `sqlProvider` inválidos fallan rápido antes del tráfico. |
| `providerMethod` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"buildRevenueSql"`); `""` aplica la convención por defecto.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nombre del método dentro de `sqlProvider` que devuelve la cadena SQL.<br/>*Precaución:* Debe coincidir exactamente con el identificador Java (sensible a mayúsculas, ej. `"buildRevenueSql"`); un desajuste genera error en ejecución. |
| `modifying` | `boolean` | `false` | No (Opcional) | `true` (DML UPDATE/DELETE en transacción de escritura) o `false` (consulta SELECT de solo lectura).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Debe ser `true` para sentencias INSERT/UPDATE/DELETE.<br/>*Precaución:* Obligatorio (`true`) para `UPDATE`/`DELETE`; envuelve la ejecución en una transacción de escritura con rollback automático. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC Dinámico Basado en Base de Datos y Meta-Anotaciones de Enmascaramiento (18 Anotaciones)

### `@SecurityRoleEntity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Propósito**: Designa una entidad JPA como tabla catálogo viva de roles RBAC en base de datos.
- **Comportamiento en Ejecución**: DynamicDatabaseRbacProviderHelper cachea los enlaces rol-permiso en Caffeine según el TTL y los invalida al escribir.
- **Cómo Usar**: Aplique `@SecurityRoleEntity` en su entidad Role marcando el código obligatorio con `@RoleCode`.
- **Cuándo Usar**: Cuando los administradores crean y editan roles dinámicamente desde tablas de base de datos.
- **Cuándo NO Usar y Precauciones**: NO omita `@RoleCode` (`EntityFailFastValidatorUtil` aborta el arranque) ni registre múltiples entidades `@SecurityRoleEntity`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Opcional) | Número positivo (`>= 1`) en segundos; ej. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL en segundos de la caché Caffeine del snapshot (se invalida al mutar roles).<br/>*Precaución:* TTL cortos reflejan cambios más rápido con más consultas; TTL largos reducen carga pero retrasan revocaciones. |

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

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna la columna de código de rol único dentro de una entidad @SecurityRoleEntity.
- **Comportamiento en Ejecución**: Se lee mediante LambdaAccessorUtil cacheado para coincidir con tokens GrantedAuthority.
- **Cómo Usar**: Coloque `@RoleCode` en el campo o getter dentro de la entidad `@SecurityRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityRoleEntity` ni fuera de una entidad `@SecurityRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Identifica el campo de nombre legible del rol en una entidad @SecurityRoleEntity.
- **Comportamiento en Ejecución**: Expuesto en metadatos de diagnóstico RBAC y endpoints de inspección de Dev Studio.
- **Cómo Usar**: Coloque `@RoleName` en el campo o getter dentro de la entidad `@SecurityRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityRoleEntity` ni fuera de una entidad `@SecurityRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Marca el campo colección o cadena CSV que almacena códigos de permiso concedidos en un rol.
- **Comportamiento en Ejecución**: Se analiza dinámicamente y se expande hacia autoridades efectivas de SecurityIdentityCustomizer.
- **Cómo Usar**: Coloque `@RolePermissions` en el campo o getter dentro de la entidad `@SecurityRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityRoleEntity` ni fuera de una entidad `@SecurityRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Propósito**: Marca una entidad JPA que almacena permisos recurso-acción y reglas dinámicas de enmascaramiento.
- **Comportamiento en Ejecución**: Se carga en DatabaseRbacRuleMatcherHelper para aplicar control CRUD y enmascaramiento tras lectura.
- **Cómo Usar**: Anote la entidad Permission con `@SecurityPermissionEntity` y marque `@PermissionCode` obligatoriamente.
- **Cuándo Usar**: Cuando gestione permisos granulares recurso/acción y enmascaramiento dinámico desde BD.
- **Cuándo NO Usar y Precauciones**: NO omita `@PermissionCode` ni defina múltiples `@SecurityPermissionEntity`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | No (Opcional) | Número positivo (`>= 1`) en segundos; ej. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL en segundos en Caffeine para el snapshot de permisos.<br/>*Precaución:* TTL cortos reflejan cambios más rápido con más consultas; TTL largos reducen carga pero retrasan revocaciones. |

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

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Designa el campo identificador único del permiso dentro de @SecurityPermissionEntity.
- **Comportamiento en Ejecución**: Se compara con las autoridades del usuario y códigos @EntitySecurity.permissions().
- **Cómo Usar**: Coloque `@PermissionCode` en el campo o getter dentro de la entidad `@SecurityPermissionEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPermissionEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPermissionEntity` ni fuera de una entidad `@SecurityPermissionEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna el nombre de entidad o recurso API (o comodín *) dentro de @SecurityPermissionEntity.
- **Comportamiento en Ejecución**: Evaluado sin distinción de mayúsculas por DatabaseRbacRuleMatcherHelper con comodín.
- **Cómo Usar**: Coloque `@PermissionResource` en el campo o getter dentro de la entidad `@SecurityPermissionEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPermissionEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPermissionEntity` ni fuera de una entidad `@SecurityPermissionEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna el verbo de acción CRUD o personalizado protegido por @SecurityPermissionEntity.
- **Comportamiento en Ejecución**: Se normaliza automáticamente desde los métodos del controlador (READ, WRITE, DELETE o acción personalizada).
- **Cómo Usar**: Coloque `@PermissionAction` en el campo o getter dentro de la entidad `@SecurityPermissionEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPermissionEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPermissionEntity` ni fuera de una entidad `@SecurityPermissionEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Declara campos separados por comas que deben ocultarse dinámicamente al activarse esta regla.
- **Comportamiento en Ejecución**: Se aplica dinámicamente junto con @FieldSecurity antes de serializar la respuesta JSON.
- **Cómo Usar**: Coloque `@PermissionFieldMask` en el campo o getter dentro de la entidad `@SecurityPermissionEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPermissionEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPermissionEntity` ni fuera de una entidad `@SecurityPermissionEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Propósito**: Mapea la entidad JPA que vincula sujetos autenticados con roles de base de datos y ámbito de inquilino.
- **Comportamiento en Ejecución**: Se consulta automáticamente al hidratar el contexto JWT / SecurityContext mediante SecurityIdentityCustomizer.
- **Cómo Usar**: Colóquelo en la entidad de asignación usuario-rol marcando `@UserRoleSubject` y `@UserRoleCode`.
- **Cuándo Usar**: Cuando el JWT sólo porta `sub`/`username` y los roles vigentes se cargan dinámicamente desde base de datos.
- **Cuándo NO Usar y Precauciones**: NO olvide `@UserRoleSubject`; omita este entity si su IdP externo ya emite roles autoritativos en el JWT.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@SecurityUserRoleEntity(enabled = true)` | Interruptor para activar o desactivar asignaciones usuario-rol de esta tabla.<br/>*Precaución:* Póngalo en `false` temporalmente durante migraciones para pausar consultas DB manteniendo los roles del JWT. |

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

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Identifica el campo sujeto / nombre de usuario principal en @SecurityUserRoleEntity.
- **Comportamiento en Ejecución**: Se compara con Authentication.getName() del SecurityContext activo.
- **Cómo Usar**: Coloque `@UserRoleSubject` en el campo o getter dentro de la entidad `@SecurityUserRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityUserRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityUserRoleEntity` ni fuera de una entidad `@SecurityUserRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Vincula la columna del código de rol asignado dentro de @SecurityUserRoleEntity.
- **Comportamiento en Ejecución**: Resuelve los permisos vinculados de @SecurityRoleEntity al evaluar políticas.
- **Cómo Usar**: Coloque `@UserRoleCode` en el campo o getter dentro de la entidad `@SecurityUserRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityUserRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityUserRoleEntity` ni fuera de una entidad `@SecurityUserRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Acota una asignación @SecurityUserRoleEntity a un identificador de inquilino (o * para global).
- **Comportamiento en Ejecución**: Se filtra contra TenantContextHolder / X-Tenant-ID en cada solicitud autenticada.
- **Cómo Usar**: Coloque `@UserRoleTenantId` en el campo o getter dentro de la entidad `@SecurityUserRoleEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityUserRoleEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityUserRoleEntity` ni fuera de una entidad `@SecurityUserRoleEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Propósito**: Marca una entidad JPA que almacena políticas explícitas ALLOW / DENY ordenadas por priority.
- **Comportamiento en Ejecución**: DENY explícito prevalece determinísticamente sobre ALLOW antes de ejecutar SQL.
- **Cómo Usar**: Anote la entidad política marcando `@PolicyAllowedRoles` (obligatorio), `@PolicyResource`, `@PolicyAction` y `@PolicyEffect`.
- **Cuándo Usar**: Para anular o complementar reglas estáticas `@EntitySecurity` desde BD, incluyendo bloqueos `DENY` de emergencia.
- **Cuándo NO Usar y Precauciones**: NO omita `@PolicyAllowedRoles` y recuerde que las reglas `DENY` anulan permisos coincidentes.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | No (Opcional) | Número positivo (`>= 0`) en prioridad entera; ej. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Prioridad de evaluación ante conflicto de políticas (menor número = mayor prioridad).<br/>*Precaución:* Los valores más bajos tienen prioridad cuando coinciden varias políticas (ej. `10` prevalece sobre `100`). |

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

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna el patrón identificador de recurso objetivo en @SecurityPolicyEntity.
- **Comportamiento en Ejecución**: Admite nombres exactos de entidad/recurso así como coincidencia con comodín *.
- **Cómo Usar**: Coloque `@PolicyResource` en el campo o getter dentro de la entidad `@SecurityPolicyEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPolicyEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPolicyEntity` ni fuera de una entidad `@SecurityPolicyEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna el verbo de operación protegida (READ, WRITE, DELETE, methodName, *) en @SecurityPolicyEntity.
- **Comportamiento en Ejecución**: Se evalúa por cada operación HTTP antes de delegar al servicio.
- **Cómo Usar**: Coloque `@PolicyAction` en el campo o getter dentro de la entidad `@SecurityPolicyEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPolicyEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPolicyEntity` ni fuera de una entidad `@SecurityPolicyEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Asigna la colección o lista CSV de roles afectados por una regla @SecurityPolicyEntity.
- **Comportamiento en Ejecución**: Se cruza contra autoridades JWT activas más roles hidratados de @SecurityUserRoleEntity.
- **Cómo Usar**: Coloque `@PolicyAllowedRoles` en el campo o getter dentro de la entidad `@SecurityPolicyEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPolicyEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPolicyEntity` ni fuera de una entidad `@SecurityPolicyEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Propósito**: Especifica el resultado de decisión ALLOW o DENY en una regla @SecurityPolicyEntity.
- **Comportamiento en Ejecución**: Cualquier política DENY coincidente aborta de inmediato con HTTP 403 AccessDeniedBusinessException.
- **Cómo Usar**: Coloque `@PolicyEffect` en el campo o getter dentro de la entidad `@SecurityPolicyEntity`.
- **Cuándo Usar**: Úselo para mapear columnas existentes de `@SecurityPolicyEntity` sin imponer nombres fijos en la base de datos.
- **Cuándo NO Usar y Precauciones**: NO lo duplique sobre varios campos de `@SecurityPolicyEntity` ni fuera de una entidad `@SecurityPolicyEntity`.

> **Anotación Marcadora**: Anotación marcadora pura — no declara ningún atributo.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Bloqueo Distribuido, Idempotencia, Caché, Multi-BD y CloudEvents (13 Anotaciones)

### `@DistributedLock`

- **Paquete**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Propósito**: Serializa accesos concurrentes sobre claves SpEL cacheadas en mapa AST (máx. 1024 entradas; defaults waitTimeMs=3000L, leaseTimeMs=5000L).
- **Comportamiento en Ejecución**: DistributedLockAspect lanza DistributedLockAcquisitionException (HTTP 409) al expirar el tiempo.
- **Cómo Usar**: Colóquelo en métodos de un `@Service` no final; para clústeres registre un bean `DistributedLockProvider` con Redis.
- **Cuándo Usar**: Para evitar sobreventa de inventario, cargos concurrentes de saldo o condiciones de carrera en lotes.
- **Cuándo NO Usar y Precauciones**: ¡NO asuma bloqueo multi-nodo usando el proveedor local Caffeine sin reemplazar `DistributedLockProvider` ni sobre clases `final`!

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | No (Opcional) | Expresión SpEL referenciando argumentos del método (ej. `"'inventory:' + #skuId"`) o `""` para clave automática.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Expresión SpEL de clave mutex evaluada en runtime (ej. "'sku:' + #skuCode").<br/>*Precaución:* Limite siempre la clave al ID del recurso (`#id`); una clave constante serializa todo el tráfico global. |
| `waitTimeMs` | `long` | `3000L` | No (Opcional) | Número positivo (`>= 0`) en milisegundos; ej. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Milisegundos máximos esperando el bloqueo antes de fallar (por defecto 3000L).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: muy bajo causa falsos 409 por contención; muy alto retiene hilos bajo picos de tráfico. |
| `leaseTimeMs` | `long` | `5000L` | No (Opcional) | Número positivo (`>= 100`) en milisegundos; ej. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Tiempo máximo de arrendamiento del bloqueo en milisegundos (5000L).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: debe superar la duración p99 de la transacción o el bloqueo expirará antes de confirmar. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Previene escrituras duplicadas concurrentes o reenviadas dentro de ventanas TTL configurables.
- **Comportamiento en Ejecución**: Ejecutado por IdempotencyAspect + ProxyIdempotencyGuardHelper con bloqueo TTL Caffeine (HTTP 409 ConflictBusinessException); claves ausentes pasan directo; IdempotencyManagerHelper aporta ayuda SHA-256 opcional.
- **Cómo Usar**: Anote métodos de `@AutoRestController` o de un `@Service` no final; fallos liberan la clave para reintento seguro.
- **Cuándo Usar**: Para captura de pagos, transferencias y mutaciones POST expuestas a dobles clics o reintentos de red.
- **Cuándo NO Usar y Precauciones**: NO lo utilice en GET de lectura, y en clústeres multi-pod reemplace `IdempotencyStoreProvider` con Redis.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | No (Opcional) | Nombre de cabecera HTTP válido (insensible a mayúsculas en red, ej. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Cabecera HTTP con la clave cliente; si se omite o va vacía se omite la deduplicación.<br/>*Precaución:* El cliente debe enviar un UUIDv7 único por operación y reutilizarlo en reintentos; inclúyalo en CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | No (Opcional) | Número positivo (`>= 1`) en segundos; ej. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Ventana en segundos durante la cual reintentar la clave devuelve HTTP 409 Conflict (300L).<br/>*Precaución:* Ventana de retención en caché/Redis; configure `300L–86400L` según el horizonte de reintento (ej. 24h en pagos). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Aplica limitación de tasa por ventana deslizante por partición de IP, Usuario o Inquilino.
- **Comportamiento en Ejecución**: Incrementa la métrica nwvmc.ratelimit.rejected.total y responde con HTTP 429 Too Many Requests.
- **Cómo Usar**: Anote la interfaz o método con `@RateLimit(...)`; añade `X-RateLimit-Remaining`/`X-RateLimit-Reset` y devuelve `HTTP 429` + `Retry-After` al agotarse.
- **Cuándo Usar**: Para búsquedas públicas, endpoints auth/OTP, consultas AI o exportaciones masivas expuestas a abuso.
- **Cuándo NO Usar y Precauciones**: NO limite probes internos ni use `partitionKey = "GLOBAL"` si un cliente ruidoso no debe bloquear a los demás (use `"USER"`, `"TENANT"` o `"IP"`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | No (Opcional) | Número positivo (`>= 1`) en peticiones; ej. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Número máximo de peticiones permitidas por ventana (60).<br/>*Precaución:* Incluye `X-RateLimit-Remaining`, `X-RateLimit-Reset` y `Retry-After` (RFC 6585) al responder HTTP `429`. |
| `windowSeconds` | `int` | `60` | No (Opcional) | Número positivo (`>= 1`) en segundos; ej. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Duración en segundos de la ventana de control (60).<br/>*Precaución:* Define la ventana del contador y calcula `X-RateLimit-Reset` y el valor `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | No (Opcional) | Uno de los valores admitidos: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Criterio de partición dinámico: "IP"/"clientIp", "USER" (con respaldo IP para anónimos), "TENANT", "GLOBAL" o SpEL "#expr".<br/>*Precaución:* `"USER"` aísla por usuario autenticado y recurre a IP si es anónimo; `"GLOBAL"` comparte un único cupo para todos. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Envuelve operaciones en Circuit Breakers de Resilience4j reportando telemetría a Actuator y Micrometer.
- **Comportamiento en Ejecución**: Pasa a estado OPEN (HTTP 503) al superar el umbral y actualiza el gauge nwvmc.resilience.circuitbreaker.state.
- **Cómo Usar**: Anote controladores o métodos que llamen servicios externos/IA para aislar fallos en cascada con Resilience4j.
- **Cuándo Usar**: Cuando sea preferible fallar rápido (`HTTP 503`) ante caídas externas en lugar de saturar hilos.
- **Cuándo NO Usar y Precauciones**: `CircuitBreakerErrorFilterUtil` ignora automáticamente 4xx `BaseBusinessException`; NO envuelva errores de cliente en `RuntimeException` genéricas que abrirían el circuito (`503`).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"payment-gateway-cb"`); `""` aplica la convención por defecto.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nombre de la instancia CircuitBreaker en Resilience4j (vacío usa el nombre de entidad).<br/>*Precaución:* Identifica la instancia Resilience4j y su etiqueta Micrometer; `""` deriva el nombre de la clase. |
| `failureRateThreshold` | `float` | `50.0f` | No (Opcional) | Número positivo (`1.0f .. 100.0f`) en porcentaje; ej. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Porcentaje de fallo que abre el circuito (por defecto 50.0f).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: las excepciones de negocio 4xx (`BaseBusinessException`) se ignoran; solo fallos 5xx o de red disparan el circuito. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | No (Opcional) | Número positivo (`>= 1`) en segundos; ej. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Segundos en estado OPEN devolviendo HTTP 503 antes de probar HALF_OPEN (10).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: las excepciones de negocio 4xx (`BaseBusinessException`) se ignoran; solo fallos 5xx o de red disparan el circuito. |
| `slidingWindowSize` | `int` | `20` | No (Opcional) | Número positivo (`>= 1`) en llamadas; ej. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Número de llamadas evaluadas en la ventana deslizante (20).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: las excepciones de negocio 4xx (`BaseBusinessException`) se ignoran; solo fallos 5xx o de red disparan el circuito. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | No (Opcional) | Número positivo (`>= 1`) en llamadas; ej. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Llamadas de prueba permitidas en estado HALF_OPEN (5).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: las excepciones de negocio 4xx (`BaseBusinessException`) se ignoran; solo fallos 5xx o de red disparan el circuito. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Reintenta automáticamente fallos transitorios con retroceso exponencial configurable.
- **Comportamiento en Ejecución**: Lanza una excepción estandarizada si se agotan todos los intentos configurados.
- **Cómo Usar**: Anote controladores o métodos con `@EntityRetry` para recuperarse de fallos transitorios de red o bloqueos DB.
- **Cuándo Usar**: En lecturas GET idempotentes, reemplazos PUT o llamadas protegidas con `@Idempotent`.
- **Cuándo NO Usar y Precauciones**: NUNCA en POST no idempotentes o cobros sin `@Idempotent` (duplicaría cargos!).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"erp-sync-retry"`); `""` aplica la convención por defecto.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nombre de la instancia Retry en Resilience4j.<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: verifique que `maxAttempts` por el tiempo de espera no supere el timeout del gateway. |
| `maxAttempts` | `int` | `3` | No (Opcional) | Número positivo (`>= 1`) en intentos; ej. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Intentos totales incluyendo la primera ejecución (3).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: verifique que `maxAttempts` por el tiempo de espera no supere el timeout del gateway. |
| `waitDurationMs` | `long` | `500L` | No (Opcional) | Número positivo (`>= 50`) en milisegundos; ej. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Espera inicial en ms antes del primer reintento (500L).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: verifique que `maxAttempts` por el tiempo de espera no supere el timeout del gateway. |
| `backoffMultiplier` | `double` | `2.0d` | No (Opcional) | Número positivo (`>= 1.0d`) en factor multiplicador; ej. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Multiplicador exponencial entre reintentos consecutivos (2.0d).<br/>*Precaución:* Ajuste con cuidado según el SLA de latencia en producción: verifique que `maxAttempts` por el tiempo de espera no supere el timeout del gateway. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Paquete**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Calcula ETag débiles RFC 7232 (W/"...") y emite Cache-Control junto a respuestas HTTP 304 Not Modified.
- **Comportamiento en Ejecución**: Registra contadores HIT/MISS en nwvmc.cache.http.requests.
- **Cómo Usar**: Colóquelo en controladores/métodos GET de lectura para habilitar `ETag`, `Cache-Control` y `304 Not Modified`.
- **Cuándo Usar**: Para catálogos estables, diccionarios y listados públicos reduciendo ancho de banda con `304`.
- **Cuándo NO Usar y Precauciones**: ¡NUNCA deje `isPrivate = false` en datos PII privados, multi-tenant o con `@FieldSecurity`!

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | No (Opcional) | Número positivo (`>= 0`) en segundos; ej. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Directiva `max-age` de Cache-Control en segundos (60).<br/>*Precaución:* Emite `Cache-Control: max-age=<N>`. Use `0` junto con `generateETag = true` para revalidación inmediata `304 Not Modified`. |
| `isPrivate` | `boolean` | `false` | No (Opcional) | `true` (caché privada solo de navegador; bloqueada en CDN) o `false` (caché pública apta para proxies y CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true emite `private` (solo navegador); false emite `public` (CDNs).<br/>*Precaución:* CRÍTICO: Use siempre `isPrivate = true` en endpoints autenticados o con `@FieldSecurity` para evitar fugas en CDN compartidos. |
| `mustRevalidate` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Agrega `, must-revalidate` obligando a revalidar respuestas caducadas.<br/>*Precaución:* Impide a proxies y navegadores servir respuestas caducadas tras `maxAgeSeconds` sin revalidar con el origen. |
| `generateETag` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Calcula ETag SHA-256 y responde `HTTP 304 Not Modified` ante `If-None-Match`.<br/>*Precaución:* Calcula un `ETag` RFC 7232 y responde `304 Not Modified` (0 bytes) cuando coincide `If-None-Match`. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Almacena en caché resultados de métodos de lectura del servidor en Caffeine L1 / Redis L2.
- **Comportamiento en Ejecución**: Configurable globalmente mediante app.framework.cache.type.
- **Cómo Usar**: Colóquelo en métodos de lectura de servicio; el motor se selecciona mediante `app.framework.cache.type`.
- **Cuándo Usar**: Cuando la proporción lectura/escritura supera 10:1 en consultas por ID o metadatos estables.
- **Cuándo NO Usar y Precauciones**: NO cachee entidades mutables sin clonarlas antes de proyecciones/masking, ni tablas muy volátiles.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Nombres lógicos de caché respaldados por Caffeine L1 o Redis L2.<br/>*Precaución:* Los nombres deben coincidir con sus regiones Caffeine/Redis; empareje cada escritura con `@AutoCacheEvict` para evitar datos obsoletos. |
| `key` | `String` | `""` | No (Opcional) | Expresión SpEL referenciando argumentos del método (ej. `"'product:' + #id"`) o `""` para clave automática.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Expresión SpEL de clave (v0.1.0 resuelve `EntityName:id` de forma determinista).<br/>*Precaución:* En aplicaciones multi-tenant, incluya siempre el ID de inquilino en la clave para evitar contaminación entre inquilinos. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Invalida entradas de caché obsoletas del servidor tras mutaciones.
- **Comportamiento en Ejecución**: Ejecutado tras la mutación limpiamente sin dejar lecturas obsoletas.
- **Cómo Usar**: Anote los métodos de actualización/borrado haciendo coincidir la clave con `@AutoCacheable`.
- **Cuándo Usar**: Siempre que actualizaciones, transiciones o borrados modifiquen registros cacheados por `@AutoCacheable`.
- **Cuándo NO Usar y Precauciones**: Evite `allEntries = true` en `create` de alta frecuencia para prevenir tormentas de caché (Cache Stampede).

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | No (Opcional) | Arreglo de cero o más valores válidos: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Nombres de cachés a invalidar tras completar el método.<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `value` inválidos fallan rápido antes del tráfico. |
| `key` | `String` | `""` | No (Opcional) | Expresión SpEL referenciando argumentos del método (ej. `"'product:' + #id"`) o `""` para clave automática.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Expresión SpEL para eliminar únicamente la entrada de caché afectada.<br/>*Precaución:* Debe producir exactamente la misma clave que `@AutoCacheable.key`; se ignora si `allEntries = true`. |
| `allEntries` | `boolean` | `false` | No (Opcional) | `true` (vaciar todas las entradas de la región caché) o `false` (eliminar solo la entrada indicada por key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Si es true, limpia entradas restringidas al prefijo de la entidad afectada.<br/>*Precaución:* Vaciar toda la región bajo alto tráfico puede provocar estampida contra la BD; prefiera desalojo puntual por `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Paquete**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Mide la duración de ejecución y emite registros WARN cuando llamadas lentas superan el umbral.
- **Comportamiento en Ejecución**: También alimenta temporizadores de latencia mediante DynamicEntityMetricsHelper.
- **Cómo Usar**: Colóquelo en interfaces `@AutoRestController`, métodos o servicios para vigilar incumplimientos de SLA.
- **Cuándo Usar**: En reportes complejos, lotes, GraphQL y `@CustomQuery` para detectar regresiones SQL.
- **Cuándo NO Usar y Precauciones**: NO configure `warningThresholdMs <= 0` en rutas masivas ni lo aplique a streams SSE `/events` de larga vida.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | No (Opcional) | Número positivo (`>= 1`) en milisegundos; ej. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Umbral en milisegundos tras el cual se emite un log `WARN` de ejecución lenta (500L).<br/>*Precaución:* Emite un log `WARN` con `traceId` al superar este umbral; elija un valor realista (`200L–1000L`) para no inundar los logs. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Paquete**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Propósito**: Envía webhooks salientes firmados con HMAC-SHA256 asíncronamente en Virtual Threads tras commit.
- **Comportamiento en Ejecución**: Calcula firmas en WebhookHmacSignerHelper y verifica igualdad en tiempo constante.
- **Cómo Usar**: Colóquelo en la entidad JPA; se entrega tras el commit de BD de forma asíncrona con `@TransactionalEventListener`.
- **Cuándo Usar**: Para notificar inmediatamente a socios externos o inquilinos SaaS al confirmarse pedidos o pagos.
- **Cuándo NO Usar y Precauciones**: Defina `includeFullPayload = false` si hay secretos PII/PCI, y evite URLs SSRF privadas.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | No (Opcional) | Arreglo de cero o más valores válidos: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Eventos de ciclo de vida que disparan webhooks firmados por HMAC.<br/>*Precaución:* Se despacha de forma asíncrona tras el commit (`AFTER_COMMIT`), evitando webhooks fantasma en transacciones revertidas. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | No (Opcional) | Nombre de cabecera HTTP válido (insensible a mayúsculas en red, ej. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Cabecera HTTP con la firma HMAC-SHA256 de verificación.<br/>*Precaución:* Transporta la firma HMAC-SHA256 del payload; el receptor debe validarla en tiempo constante antes de procesarla. |
| `includeFullPayload` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@EntityWebhook(includeFullPayload = false)` | true incluye el JSON completo; false envía sólo ID y metadatos del evento.<br/>*Precaución:* Configure `false` (solo ID y tipo de evento) en entidades con PII o finanzas para que los suscriptores consulten vía GET autenticado. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Paquete**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Publica sobres CNCF CloudEvents v1.0 después del commit transaccional.
- **Comportamiento en Ejecución**: Respeta TransactionRuntimeBridge.executeAfterCommit para evitar eventos fantasma.
- **Cómo Usar**: Anote entidades o métodos; consuma `CloudEventEnvelopeDto` con `@TransactionalEventListener(AFTER_COMMIT)`.
- **Cuándo Usar**: Para comunicación desacoplada entre Bounded Contexts (`order` -> `inventory` -> `notification`) sin JOINs entre módulos.
- **Cuándo NO Usar y Precauciones**: No lo confunda con `@EntityWebhook` externo ni escuche sin `TransactionPhase.AFTER_COMMIT`.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | No (Opcional) | Cadena identificadora no vacía (ej. `"com.acme.order.lifecycle"`); `""` aplica la convención por defecto.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Atributo `type` de CloudEvents (ej. "io.nwvmc.order.created").<br/>*Precaución:* Siga la convención reverse-DNS CloudEvents 1.0 (`com.company.domain.event`); `""` lo genera automáticamente. |
| `source` | `String` | `""` | No (Opcional) | Ruta HTTP válida iniciada con `/` (ej. `/services/order-api`) o cadena vacía `""` para derivación automática.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` de CloudEvents que identifica al contexto emisor.<br/>*Precaución:* Completa el atributo URI `source` de CNCF CloudEvents para trazabilidad entre microservicios. |
| `publishOnCreate` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Emite CloudEvent al confirmar creación (true).<br/>*Precaución:* Se publica únicamente tras el commit (`AFTER_COMMIT`) mediante Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Emite CloudEvent al confirmar actualización (true).<br/>*Precaución:* Desactívelo (`false`) en entidades con actualizaciones triviales frecuentes para no saturar el bróker. |
| `publishOnDelete` | `boolean` | `true` | No (Opcional) | `true` (habilitado) o `false` (deshabilitado).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Emite CloudEvent tras borrado confirmado (true).<br/>*Precaución:* Se dispara tanto en borrado físico como en `BaseAuditEntity.deleted` para mantener sincronizadas las vistas de lectura. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Paquete**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Fija operaciones de entidad o consulta a una clave lógica de origen de datos.
- **Comportamiento en Ejecución**: Registra conteos de enrutamiento en framework.datasource.routing.total.
- **Cómo Usar**: Colóquelo en métodos del controlador o servicios no finales (`"REPLICA"`); restaura el contexto automáticamente al salir.
- **Cuándo Usar**: Para separar lecturas CQRS hacia réplicas de solo lectura (`REPLICA`) o reportes analíticos.
- **Cuándo NO Usar y Precauciones**: NO cambie de datasource dentro de un `@Transactional` ya abierto ni sobre una clase `final`!

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | No (Opcional) | Uno de los valores admitidos: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Clave de enrutamiento en `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Precaución:* Debe coincidir con una clave registrada en `DynamicRoutingDataSource`; claves desconocidas recurren a `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Paquete**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Propósito**: Asigna familia de motor de base de datos y fragmento de clúster lógico por entidad.
- **Comportamiento en Ejecución**: Resuelto dinámicamente por MultiPlatformDataSourceRegistryHelper y TenantDatabaseRoutingResolverHelper.
- **Cómo Usar**: Colóquelo en entidades JPA o métodos indicando plataforma y clúster de base de datos.
- **Cuándo Usar**: En arquitecturas políglotas o segmentadas por clúster (`FINANCE_CLUSTER`, `ANALYTICS_CLUSTER`, `AUDIT_CLUSTER`).
- **Cuándo NO Usar y Precauciones**: NO sustituye la configuración JDBC física en YAML; tampoco realice JOINs JPA entre clústeres distintos.

| Atributo | Tipo Java | Valor por Defecto | Obligatorio | Valores Aceptados y Ejemplo | Descripción y Notas de Ejecución |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | No (Opcional) | Uno de los valores admitidos: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Motor de base de datos objetivo ("H2", "POSTGRESQL", "MYSQL", "ORACLE").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `platform` inválidos fallan rápido antes del tráfico. |
| `cluster` | `String` | `"PRIMARY"` | No (Opcional) | Uno de los valores admitidos: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Clúster o shard objetivo ("PRIMARY", "REPLICA", "FINANCE_CLUSTER").<br/>*Precaución:* Se valida al arrancar la aplicación; nombres mal escritos o `cluster` inválidos fallan rápido antes del tráfico. |
| `readOnly` | `boolean` | `false` | No (Opcional) | `true` (enrutar al pool réplica de solo lectura) o `false` (enrutar al pool primario de lectura/escritura).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Si es true, indica preferencia de enrutamiento hacia réplicas de solo lectura.<br/>*Precaución:* Nunca use `readOnly = true` en `POST`/`PUT`/`PATCH`/`DELETE`: las réplicas de lectura rechazan escrituras. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
