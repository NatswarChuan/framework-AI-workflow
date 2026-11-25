# 06. Полная спецификация всех 60 декларативных аннотаций (`0.1.0`)

> **Языки**: **Русский** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#annotations)

Исчерпывающий технический справочник по всем **60 декларативным аннотациям** `io.github.natswarchuan:spring-nwvmc:0.1.0`, извлечённый напрямую из исходных объявлений Java `@interface`: точный пакет, `@Target`, **каждый атрибут**, тип Java, значение по умолчанию, обязательность, **как использовать**, **когда использовать**, **когда НЕ использовать и подводные камни**, а также проверенные примеры на Java.

## Краткий указатель (60 аннотаций)

| Аннотация | Категория | `@Target` | Сводка атрибутов | Основное назначение |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Преобразует интерфейс, расширяющий AutoApiController<E>, в динамический прокси JDK с 40 контрактами (38 по умолчанию в Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Перенаправляет контракт контроллера на пользовательский метод Spring-бина через MethodHandleCacheUtil вместо динамического CRUD. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Привязывает предметные бизнес-маршруты (оформление, возврат, согласование) к независимым бинам Spring @Component Helper. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Чисто Java-замена @GetMapping без статических импортов Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Чистое Java-объявление HTTP POST-маршрута с поддержкой consumes/produces. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Чистое Java-сопоставление HTTP PUT для полной замены ресурса. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Чистое Java-объявление HTTP PATCH с поддержкой частичного слияния, атомарных дельт и RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Чистое Java-объявление HTTP DELETE для мягкого удаления с проверкой состояния. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Связывает параметры строки запроса URL или карты динамических фильтров Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Связывает переменные пути URI, такие как UUIDv7 идентификаторы сущностей. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Десериализует JSON-тело HTTP-запроса в параметры DTO или Entity вместе с @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Разрешает рекурсивный обход дочерних связей по GET /{id}/{relation}/** с защитой от циклов. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Декларативно описывает переходы состояния домена или числовые корректировки в методах действий. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Маркер компонента фреймворка, регистрируемый при старте без импорта @Component. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Маркер сервисного слоя для реализаций ServiceImpl, используемых с @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Объявляет фабричные методы управляемых бинов внутри классов @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Помечает классы конфигурации и модели привязки YAML-свойств. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Управляет приоритетом выполнения между бинами SPI Customizer и цепочками фильтров. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Применяет RBAC, изоляцию на уровне записей ownerField и коды разрешений до выполнения запросов. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Динамически маскирует или обнуляет чувствительные поля при отсутствии нужных ролей. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Контролирует переходы состояний через POST /{id}/transition и ограничивает DELETE /{id} списком deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Компилирует читаемые правила политики в действующие правила RBAC, переходов и маскирования. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Записывает отличия на уровне полей для Time-Travel реконструкции и проверки /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Автоматически изолирует выборки и изменения строк по активному тенанту, если нет роли обхода. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Marker annotation — no attributes)` | Проверяет уникальность значения перед сохранением при create, update и upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (REQUIRED)` | Автоматически генерирует уникальные бизнес-коды с префиксом при создании или клонировании, если поле пустое. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (REQUIRED)` | Автоматически формирует нормализованные ЧПУ ASCII-слаги из поля sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Вычисляет производные числовые итоги перед сохранением изменений сущности. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Позволяет привязывать пользовательский SQL/JPQL или методы провайдеров к эндпоинтам контроллера. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Назначает JPA-сущность динамическим каталогом ролей RBAC в базе данных. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет столбец уникального кода роли внутри сущности @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Определяет поле отображаемого имени роли в сущности @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Помечает коллекцию или CSV-строку кодов разрешений, выданных роли. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Помечает JPA-сущность для хранения разрешений ресурс-действие и правил маскирования полей. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Указывает поле уникального идентификатора разрешения в @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет имя целевой сущности или API-ресурса (либо *) в @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет глагол CRUD или пользовательского действия в @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Указывает разделённый запятыми список полей сущности для динамического маскирования по правилу БД. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Помечает JPA-сущность, связывающую субъекта с ролями БД и опциональным тенантом. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Указывает поле субъекта / имени пользователя в @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Привязывает столбец назначенного кода роли внутри @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Ограничивает назначение @SecurityUserRoleEntity конкретным тенантом (или * для всех). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Помечает JPA-сущность явных политик ALLOW / DENY с приоритетом priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет шаблон целевого ресурса в сущности @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет защищаемое действие (READ, WRITE, DELETE, methodName, *) в @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Сопоставляет коллекцию или CSV-список ролей, охватываемых правилом @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Marker annotation — no attributes)` | Задаёт результат решения ALLOW или DENY в правиле @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Сериализует конкурентный доступ по SpEL-ключам в AST-кэше (макс. 1024; по умолчанию 3000L/5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Предотвращает параллельную или повторную дублирующую запись в рамках настраиваемого TTL. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Применяет ограничение частоты запросов со скользящим окном по IP, User или Tenant. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Оборачивает операции в Circuit Breaker Resilience4j с телеметрией в Actuator и Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Автоматически повторяет сбои с настраиваемой экспоненциальной задержкой. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Вычисляет слабые RFC 7232 ETag (W/"...") и формирует заголовки Cache-Control с ответами HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Кэширует результаты серверных методов чтения в Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Вытесняет устаревшие записи серверного кэша при изменениях данных. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Замеряет время выполнения и пишет WARN при превышении порога медленных вызовов. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Отправляет асинхронные исходящие webhook-уведомления с подписью HMAC-SHA256 на Virtual Threads. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Публикует конверты CNCF CloudEvents v1.0 после фиксации транзакции. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Привязывает операции сущности или запроса к логическому ключу источника данных. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Назначает семейство СУБД и логический шард кластера для сущности. |

---

## 1. Маршрутизация, динамические API-контракты, DTO и привязка параметров (13 аннотаций)

### `@AutoRestController`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Назначение**: Преобразует интерфейс, расширяющий AutoApiController<E>, в динамический прокси JDK с 40 контрактами (38 по умолчанию в Swagger UI).
- **Поведение во время выполнения**: DynamicControllerProxyRegistrarHelper сканирует контроллеры при старте и регистрирует маршруты в RequestMappingHandlerMapping.
- **Как использовать**: Аннотируйте Java-интерфейс, расширяющий `AutoApiController<E>` или `AutoReadApi<E>`, указав `basePath`, DTO-контракты и `disabledEndpoints`.
- **Когда использовать**: Используйте для публикации стандартного CRUD, пагинации, фильтрации, keyset и аналитики по JPA-сущности без шаблонного кода.
- **Когда НЕ использовать и риски**: НЕ ставьте на обычные классы `@RestController` и сценарии без JPA-сущности; для публичных справочников выбирайте `AutoReadApi<E>`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Нет (Опционально) | Корректный HTTP-путь, начинающийся с `/` (напр. `/api/v1/product-catalogs`), или пустая строка `""` для автоопределения.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Явный корневой URI-путь (напр. "/api/v1/product-catalogs"). Если пуст, вычисляется в kebab-case.<br/>*Примечание:* При старте регистратор сначала проверяет `basePath`, затем `path`. Не задавайте конфликтующие значения. |
| `path` | `String` | `""` | Нет (Опционально) | Корректный HTTP-путь, начинающийся с `/` (напр. `/api/v1/orders`), или пустая строка `""` для автоопределения.<br/>`@AutoRestController(path = "/api/v1/orders")` | Псевдоним базового пути. Предпочитайте basePath, так как регистратор читает его первым.<br/>*Примечание:* При старте регистратор сначала проверяет `basePath`, затем `path`. Не задавайте конфликтующие значения. |
| `entityName` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"ProductCatalog"`); `""` применяет соглашение по умолчанию.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Переопределяет отображаемое имя сущности в OpenAPI/Studio вместо простого имени класса E.<br/>*Примечание:* Отображается напрямую в Swagger / OpenAPI 3.0 и NWVMC Studio; выносите строки в `OpenApiConstant` без хардкода. |
| `enabledEndpoints` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"search"`, `"keysetPage"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Белый список точных имён методов контракта (напр. "getPage", "create"). Пустой = включены все.<br/>*Примечание:* Работает как строгий белый список: если не пуст, все остальные методы AutoApiController исключаются из Spring MVC и Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `"deleteById"`, `"batchDelete"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "batchDelete", "importCsv"})` | Чёрный список методов AutoApiController, отключаемых до регистрации MVC.<br/>*Примечание:* Применяется после `enabledEndpoints`; удобно для отключения опасных операций удаления и массового импорта. |
| `enableNestedSubResources` | `boolean` | `false` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Включает рекурсивную навигацию GET /{id}/**. По умолчанию false во избежание раздувания маршрутов.<br/>*Примечание:* Оставляйте `false`, если не нужен обход `GET /{id}/items/...`; при включении ограничивайте связи через `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `ProductReadDto.class`) или `Void.class` для отключения маппинга.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | Опциональный Read DTO для скрытия внутренних полей сущности; Void.class возвращает сущность.<br/>*Примечание:* Действует только для этапа чтения (GET); класс DTO должен иметь конструктор по умолчанию/геттеры и поддерживает `@Valid`. |
| `createDto` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `ProductCreateDto.class`) или `Void.class` для отключения маппинга.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | Опциональный входной DTO, проверяемый Jakarta Validation перед созданием сущности в POST.<br/>*Примечание:* Действует только для этапа создания (POST); класс DTO должен иметь конструктор по умолчанию/геттеры и поддерживает `@Valid`. |
| `updateDto` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `ProductUpdateDto.class`) или `Void.class` для отключения маппинга.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | Опциональный DTO обновления, ограничивающий изменяемые поля при PUT/PATCH.<br/>*Примечание:* Действует только для этапа обновления (PUT/PATCH); класс DTO должен иметь конструктор по умолчанию/геттеры и поддерживает `@Valid`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Перенаправляет контракт контроллера на пользовательский метод Spring-бина через MethodHandleCacheUtil вместо динамического CRUD.
- **Поведение во время выполнения**: EscapeHatchDispatchHelper определяет целевой бин (по targetBean или beanName) и кэширует MethodHandle в MethodHandleCacheUtil.
- **Как использовать**: Пометьте метод интерфейса контроллера `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")`, а класс реализации — `@Service`/`@Component`.
- **Когда использовать**: Используйте, когда большинство маршрутов стандартны, но отдельному методу нужна кастомная бизнес-логика на Java.
- **Когда НЕ использовать и риски**: НЕ передавайте строку в `targetBean` (ожидается `Class<?>`, для имени есть `beanName`). Не используйте без нужды, если хватает декларативных аннотаций.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `OrderCustomService.class`) или `Void.class` для отключения маппинга.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Класс целевого Spring-бина (имеет приоритет перед beanName).<br/>*Примечание:* При старте регистратор сначала проверяет `targetBean`, затем `beanName`. Не задавайте конфликтующие значения. |
| `beanName` | `String` | `""` | Нет (Опционально) | Точное имя бина в ApplicationContext (напр. `"orderCustomService"`) или `""` для автопоиска.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Явное имя бина в Spring, используемое при targetBean = Void.class.<br/>*Примечание:* При старте регистратор сначала проверяет `targetBean`, затем `beanName`. Не задавайте конфликтующие значения. |
| `methodName` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"createOrder"`); `""` применяет соглашение по умолчанию.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Имя метода на целевом бине; по умолчанию совпадает с именем метода контроллера.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"createOrder"`); иначе возникнет ошибка в runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Нет (Опционально) | `true` (обойти стандартный прокси и вызвать целевой бин) или `false` (выполнять совместно со стандартной диспетчеризацией).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | При true полностью обходит стандартный CRUD-диспетчер и вызывает бин через MethodHandle.<br/>*Примечание:* При `true` встроенный CRUD полностью пропускается, и бин сам управляет транзакцией. Ставьте `false` только для доп. перехвата. |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Привязывает предметные бизнес-маршруты (оформление, возврат, согласование) к независимым бинам Spring @Component Helper.
- **Поведение во время выполнения**: Вызывает delegateBean.delegateMethod через кэшированный MethodHandle с полной валидацией и транзакцией.
- **Как использовать**: Объявите метод с `path`, `httpMethod`, `delegateBean` и `delegateMethod`, ссылающийся на Spring-хелпер.
- **Когда использовать**: Используйте для доменных операций: оформление заказа, возврат средств, согласование, транзакции по нескольким сущностям.
- **Когда НЕ использовать и риски**: НЕ рассчитывайте на proxy-перехватчики здесь (`ControllerProxySpecialRouteUtil` срабатывает до `invokeProtectedOperation`) — ставьте Spring AOP на целевом `@Service` и берите `@BusinessAction` для простых переходов.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/reports/monthly-sales`); `""` привязывается к корню.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Относительный путь внутри basePath контроллера (напр. "/checkout").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `path` сразу прерывают старт (fail-fast). |
| `httpMethod` | `String` | `"GET"` | Нет (Опционально) | Одно из поддерживаемых значений: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | HTTP-метод маршрута ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `httpMethod` сразу прерывают старт (fail-fast). |
| `delegateBean` | `String` | `""` | Нет (Опционально) | Точное имя бина в ApplicationContext (напр. `"orderReportService"`) или `""` для автопоиска.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Имя Spring-бина с целевым обработчиком (непустое, если нет default-метода или @ServiceOverride).<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `delegateBean` сразу прерывают старт (fail-fast). |
| `delegateMethod` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"buildMonthlyReport"`); `""` применяет соглашение по умолчанию.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Имя метода на delegateBean; по умолчанию имя метода контроллера.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"buildMonthlyReport"`); иначе возникнет ошибка в runtime. |
| `summary` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"Get monthly revenue breakdown"`); `""` применяет соглашение по умолчанию.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Краткое описание операции OpenAPI 3.0 в Swagger UI.<br/>*Примечание:* Отображается напрямую в Swagger / OpenAPI 3.0 и NWVMC Studio; выносите строки в `OpenApiConstant` без хардкода. |
| `description` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"Aggregates confirmed invoice totals grouped by currency"`); `""` применяет соглашение по умолчанию.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Подробная документация OpenAPI 3.0 при раскрытии эндпоинта в Swagger UI.<br/>*Примечание:* Отображается напрямую в Swagger / OpenAPI 3.0 и NWVMC Studio; выносите строки в `OpenApiConstant` без хардкода. |

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

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Чисто Java-замена @GetMapping без статических импортов Spring Web.
- **Поведение во время выполнения**: Привязывается к RequestMappingInfo HTTP GET при инициализации прокси.
- **Как использовать**: Добавьте `@AutoGet("/path")` на метод интерфейса `@AutoRestController` в связке с `@ServiceOverride` или `@CustomQuery`.
- **Когда использовать**: Используйте для GET-маршрутов чтения в Pure Java-интерфейсах без импорта Spring `@GetMapping`.
- **Когда НЕ использовать и риски**: НЕ применяйте для операций, меняющих состояние БД, и на обычных `@RestController`-классах.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/{id}/summary`); `""` привязывается к корню.<br/>`@AutoGet("/{id}/summary")` | Относительный шаблон пути GET (напр. "/metrics"). Пустой = корень basePath.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `produces` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json", "text/csv"}`); пустой `{}` использует `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Возвращаемые MIME-типы ответа (напр. "text/event-stream", "text/csv").<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Accept`; при несовпадении возвращается `406` или `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Чистое Java-объявление HTTP POST-маршрута с поддержкой consumes/produces.
- **Поведение во время выполнения**: Регистрируется как обработчик HTTP POST в SpringMvcEndpointBridge.
- **Как использовать**: Пометьте метод создания или действия `@AutoPost("/path")` с `@AutoBody`/`@RequestBody` в сочетании с `@BusinessAction` или `@ServiceOverride`.
- **Когда использовать**: Используйте для создания сущностей, бизнес-команд и пакетной отправки по POST.
- **Когда НЕ использовать и риски**: НЕ используйте для чтения (`@AutoGet`), полной замены (`@AutoPut`) или удаления (`@AutoDelete`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/{id}/approve`); `""` привязывается к корню.<br/>`@AutoPost("/{id}/approve")` | Относительный шаблон пути POST внутри basePath.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `consumes` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json", "multipart/form-data"}`); пустой `{}` использует `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Допустимые Content-Type входящего тела запроса.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Content-Type`; при несовпадении возвращается `406` или `415`. |
| `produces` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json"}`); пустой `{}` использует `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Возвращаемые MIME-типы ответа.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Accept`; при несовпадении возвращается `406` или `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Чистое Java-сопоставление HTTP PUT для полной замены ресурса.
- **Поведение во время выполнения**: Привязывается как HTTP PUT-обработчик в транзакционном контуре.
- **Как использовать**: Используйте `@AutoPut("/{id}")` на методе полного обновления с `@AutoVariable` и `@AutoBody`.
- **Когда использовать**: Используйте для идемпотентной полной замены ресурса с полным телом.
- **Когда НЕ использовать и риски**: НЕ используйте для точечного обновления отдельных полей (берите `@AutoPatch` или `@BusinessAction`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/{id}/replace`); `""` привязывается к корню.<br/>`@AutoPut("/{id}/replace")` | Относительный шаблон пути PUT (напр. "/{id}").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `consumes` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json"}`); пустой `{}` использует `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Поддерживаемые Content-Type запроса.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Content-Type`; при несовпадении возвращается `406` или `415`. |
| `produces` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json"}`); пустой `{}` использует `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Возвращаемые MIME-типы ответа.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Accept`; при несовпадении возвращается `406` или `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Чистое Java-объявление HTTP PATCH с поддержкой частичного слияния, атомарных дельт и RFC 6902 JSON Patch.
- **Поведение во время выполнения**: Поддерживает семантику слияния JSON и application/json-patch+json.
- **Как использовать**: Добавьте `@AutoPatch("/{id}/action")` на метод частичного обновления или `@BusinessAction`.
- **Когда использовать**: Используйте для частичных правок, атомарного изменения чисел и переходов статуса.
- **Когда НЕ использовать и риски**: НЕ используйте, если требуется полная замена сущности (`@AutoPut`) или создание (`@AutoPost`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/{id}/status`); `""` привязывается к корню.<br/>`@AutoPatch("/{id}/status")` | Относительный шаблон пути PATCH (напр. "/{id}/approve").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `consumes` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json", "application/merge-patch+json"}`); пустой `{}` использует `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Допустимые Content-Type.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Content-Type`; при несовпадении возвращается `406` или `415`. |
| `produces` | `String[]` | `{}` | Нет (Опционально) | Массив MIME-типов (напр. `{"application/json"}`); пустой `{}` использует `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Возвращаемые MIME-типы.<br/>*Примечание:* Проверяется согласованием контента Spring MVC по заголовку `Accept`; при несовпадении возвращается `406` или `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Чистое Java-объявление HTTP DELETE для мягкого удаления с проверкой состояния.
- **Поведение во время выполнения**: Проверяет deletableStates из @StateMachine перед установкой deleted=true.
- **Как использовать**: Добавьте `@AutoDelete("/{id}/custom")` на метод удаления вместе с `@ServiceOverride`.
- **Когда использовать**: Используйте для кастомного архивирования, мягкого удаления или каскадной очистки через DELETE.
- **Когда НЕ использовать и риски**: НЕ переопределяйте `deleteById`, если стандартное мягкое удаление и `@StateMachine` подходят.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Относительный подпуть URI с шаблонами `{pathVar}` (напр. `/{id}/archive`); `""` привязывается к корню.<br/>`@AutoDelete("/{id}/archive")` | Относительный шаблон пути DELETE (напр. "/{id}/purge").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Назначение**: Связывает параметры строки запроса URL или карты динамических фильтров Map<String, String>.
- **Поведение во время выполнения**: Извлекается через DynamicQueryParameterParserHelper с проверкой QueryGuardrailEnforcerUtil.
- **Как использовать**: Указывайте на параметрах методов интерфейса: `@AutoParam(name = "status", defaultValue = "ACTIVE")`.
- **Когда использовать**: Используйте для Pure Java-интерфейсов без импортов Spring Web при чтении query-параметров.
- **Когда НЕ использовать и риски**: НЕ применяйте для переменных пути (`@AutoVariable`) и тела JSON (`@AutoBody`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"status"`); `""` применяет соглашение по умолчанию.<br/>`@AutoParam("status") String status` | Имя query-параметра (алиас name). Пусто = имя параметра Java.<br/>*Примечание:* При старте регистратор сначала проверяет `value`, затем `name`. Не задавайте конфликтующие значения. |
| `name` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"pageSize"`); `""` применяет соглашение по умолчанию.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Явное имя параметра запроса.<br/>*Примечание:* При старте регистратор сначала проверяет `value`, затем `name`. Не задавайте конфликтующие значения. |
| `required` | `boolean` | `true` | Нет (Опционально) | `true` (обязательно; отсутствие даёт HTTP 400) или `false` (опционально; при отсутствии передаётся null).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Определяет, вызывать ли HTTP 400 при отсутствии параметра.<br/>*Примечание:* Становится опциональным при заданном `defaultValue`; при `false` используйте обёртки (`Integer`, `Boolean`), а не примитивы. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"20"`); `""` применяет соглашение по умолчанию.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Значение по умолчанию при отсутствии параметра; по умолчанию маркер DEFAULT_NONE.<br/>*Примечание:* Конвертируется из строки через Spring `ConversionService` в целевой тип; некорректное значение вызывает HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Назначение**: Связывает переменные пути URI, такие как UUIDv7 идентификаторы сущностей.
- **Поведение во время выполнения**: Преобразуется в типизированные значения Java UUID/String из шаблонов путей MVC.
- **Как использовать**: Указывайте на параметрах идентификатора пути: `findById(@AutoVariable("id") UUID id)`.
- **Когда использовать**: Применяйте для извлечения `{id}` и `{code}` из URI в Pure Java-интерфейсах.
- **Когда НЕ использовать и риски**: НЕ используйте для `?query=` (`@AutoParam`) или JSON (`@AutoBody`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"orderId"`); `""` применяет соглашение по умолчанию.<br/>`@AutoVariable("orderId") UUID orderId` | Имя переменной пути URI.<br/>*Примечание:* При старте регистратор сначала проверяет `value`, затем `name`. Не задавайте конфликтующие значения. |
| `name` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"tenantCode"`); `""` применяет соглашение по умолчанию.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Явное имя переменной пути.<br/>*Примечание:* При старте регистратор сначала проверяет `value`, затем `name`. Не задавайте конфликтующие значения. |
| `required` | `boolean` | `true` | Нет (Опционально) | `true` (обязательно; отсутствие даёт HTTP 400) или `false` (опционально; при отсутствии передаётся null).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Обязательность наличия переменной пути.<br/>*Примечание:* Имя должно совпадать с `{variableName}` в шаблоне URI; `false` имеет смысл лишь при опциональных маршрутах. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Назначение**: Десериализует JSON-тело HTTP-запроса в параметры DTO или Entity вместе с @Valid.
- **Поведение во время выполнения**: Проверяется с помощью LocalValidatorFactoryBean до начала транзакции сервиса.
- **Как использовать**: Аннотируйте параметр тела в `@AutoPost`/`@AutoPut`/`@AutoPatch` через `@AutoBody` (вместе с `@Valid`).
- **Когда использовать**: Для десериализации JSON-тела в сущность или DTO в Pure Java-контроллерах.
- **Когда НЕ использовать и риски**: НЕ ставьте на GET/DELETE без тела и не объявляйте два `@AutoBody` в одной сигнатуре.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Нет (Опционально) | `true` (обязательно; отсутствие даёт HTTP 400) или `false` (опционально; при отсутствии передаётся null).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Определяет, возвращать ли HTTP 400 при отсутствии тела.<br/>*Примечание:* Сочетайте с `@Valid` для Jakarta-валидации до вызова; `false` допускает пустое тело без ошибки `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Разрешает рекурсивный обход дочерних связей по GET /{id}/{relation}/** с защитой от циклов.
- **Поведение во время выполнения**: Требует @AutoRestController(enableNestedSubResources = true) на контроллере.
- **Как использовать**: Включите `enableNestedSubResources = true` на `@AutoRestController` и ограничьте связи через `@EnableNestedSubResource`.
- **Когда использовать**: При необходимости вложенных маршрутов вроде `GET /api/v1/customer-orders/{id}/items` с проверкой прав на каждом шаге.
- **Когда НЕ использовать и риски**: НЕ открывайте без `allowedRelationships` на сильно связанных таблицах и между разными доменами.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Опциональный белый список целевых сущностей для обхода GET /{id}/**.<br/>*Примечание:* Пустой массив открывает все дочерние сущности; явно перечисляйте классы, чтобы не раскрыть служебные таблицы. |
| `allowedRelationships` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Разрешённые имена JPA-связей в пути подресурсов (напр. "items", "customer").<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"items"`); иначе возникнет ошибка в runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Декларативно описывает переходы состояния домена или числовые корректировки в методах действий.
- **Поведение во время выполнения**: Выполняется атомарно перед сохранением обновлённых атрибутов сущности.
- **Как использовать**: Сочетайте `@AutoPatch` с `@BusinessAction(...)` на методе интерфейса контроллера.
- **Когда использовать**: Для переходов статусов, инкрементов и вызова методов сущности без написания отдельного Service.
- **Когда НЕ использовать и риски**: НЕ применяйте для оркестрации нескольких сущностей или внешних HTTP-вызовов (берите `@ServiceOverride`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа статуса жизненного цикла (напр. `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Имя поля состояния в сущности (проверяется по @StateMachine).<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"status"`); иначе возникнет ошибка в runtime. |
| `targetStateValue` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"APPROVED"`); `""` применяет соглашение по умолчанию.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Целевое значение состояния в рамках транзакции.<br/>*Примечание:* Автоматически проверяется по `@StateMachine` или `@HumanPolicy` до сохранения; недопустимый переход откатывает транзакцию. |
| `adjustNumericField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа числового (напр. `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Числовое поле сущности для атомарного изменения.<br/>*Примечание:* Требует `deltaParamIndex >= 0` или непустой `fixedDelta`. Поддерживает `Integer`, `Long`, `BigDecimal` и `Double`. |
| `deltaParamIndex` | `int` | `-1` | Нет (Опционально) | Одно из поддерживаемых значений: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Индекс параметра метода (с нуля) с величиной дельты; -1 отключает чтение.<br/>*Примечание:* При старте регистратор сначала проверяет `deltaParamIndex`, затем `fixedDelta`. Не задавайте конфликтующие значения. |
| `fixedDelta` | `String` | `""` | Нет (Опционально) | Одно из поддерживаемых значений: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | Фиксированная числовая дельта строкой (напр. "100", "-1").<br/>*Примечание:* При старте регистратор сначала проверяет `deltaParamIndex`, затем `fixedDelta`. Не задавайте конфликтующие значения. |
| `entityMethod` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"markFulfilled"`); `""` применяет соглашение по умолчанию.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Имя метода доменной модели без параметров, выполняемого в той же транзакции.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"markFulfilled"`); иначе возникнет ошибка в runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Обнаружение бинов, привязка конфигурации и порядок выполнения (5 аннотаций)

### `@AutoComponent`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Маркер компонента фреймворка, регистрируемый при старте без импорта @Component.
- **Поведение во время выполнения**: Сканируется только в пакете io.github.natswarchuan; в прикладном коде используйте Spring @Component.
- **Как использовать**: Внутренний стереотип фреймворка, сканируемый `AutoBeanFactoryRegistrarBridge` в `io.github.natswarchuan`.
- **Когда использовать**: Используйте ТОЛЬКО при разработке модулей самого фреймворка в пакете `io.github.natswarchuan.*`.
- **Когда НЕ использовать и риски**: НИКОГДА не используйте в прикладном коде (`com.example.*`) — сканируется только `io.github.natswarchuan`. Используйте Spring `@Component`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Точное имя бина в ApplicationContext (напр. `"invoiceValidationHelper"`) или `""` для автопоиска.<br/>`@AutoComponent("invoiceValidationHelper")` | Опциональное имя бина; по умолчанию camelCase имени класса.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Маркер сервисного слоя для реализаций ServiceImpl, используемых с @ServiceOverride.
- **Поведение во время выполнения**: Регистрируется только в io.github.natswarchuan; прикладные сервисы должны использовать Spring @Service.
- **Как использовать**: Внутренний стереотип сервиса фреймворка в пакете `io.github.natswarchuan`.
- **Когда использовать**: ТОЛЬКО для внутренних сервисов в пакете `io.github.natswarchuan.*`.
- **Когда НЕ использовать и риски**: НИКОГДА не используйте в сервисах приложения; берите `@Service` из Spring.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Точное имя бина в ApplicationContext (напр. `"orderFulfillmentService"`) или `""` для автопоиска.<br/>`@AutoService("orderFulfillmentService")` | Опциональное имя бина сервиса.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Объявляет фабричные методы управляемых бинов внутри классов @AutoConfigurationBean.
- **Поведение во время выполнения**: Обрабатывается через PureJavaBeanRegistrarBridge на этапе автоконфигурации.
- **Как использовать**: Помещайте на фабричные методы внутри `@AutoConfigurationBean`-классов ядра.
- **Когда использовать**: ТОЛЬКО в конфигурациях самого фреймворка `io.github.natswarchuan.config.*`.
- **Когда НЕ использовать и риски**: НЕ используйте в пользовательских `@Configuration`-классах; применяйте `@Bean`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Явные имена и псевдонимы бина.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `targetTypeName` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"com.example.spi.PaymentGateway"`); `""` применяет соглашение по умолчанию.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | Опциональный FQCN целевого типа.<br/>*Примечание:* Опциональный FQCN, если фабрика возвращает супертип или прокси; класс должен быть доступен в classpath. |
| `primary` | `boolean` | `false` | Нет (Опционально) | `true` (приоритетный бин при нескольких кандидатах) или `false` (обычный приоритет).<br/>`@AutoBean(primary = true)` | Помечает бин как основной (@Primary) при наличии нескольких кандидатов.<br/>*Примечание:* Два `@AutoBean(primary = true)` одного типа вызовут конфликт неоднозначности бинов при старте. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Помечает классы конфигурации и модели привязки YAML-свойств.
- **Поведение во время выполнения**: Чисто регистрирует бины конфигурации и префиксы YAML с метаданными IDE.
- **Как использовать**: Помечает классы конфигурации и свойств ядра в `io.github.natswarchuan.config.*`.
- **Когда использовать**: ТОЛЬКО внутри ядра фреймворка вместо Spring `@Configuration`.
- **Когда НЕ использовать и риски**: НЕ используйте в приложениях — там применяйте Spring `@Configuration`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Точное имя бина в ApplicationContext (напр. `"storageAutoConfig"`) или `""` для автопоиска.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Опциональный идентификатор конфигурационного бина.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `prefix` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"nwvmc.storage"`); `""` применяет соглашение по умолчанию.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Опциональный YAML-префикс, связываемый через `PureJavaBeanRegistrarBridge`.<br/>*Примечание:* Связывает kebab-case свойства из `application.yml`; используйте с `spring-configuration-metadata.json` без предупреждений IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Назначение**: Управляет приоритетом выполнения между бинами SPI Customizer и цепочками фильтров.
- **Поведение во время выполнения**: Меньшие целочисленные значения выполняются раньше (по умолчанию Integer.MAX_VALUE).
- **Как использовать**: Добавляйте `@OrderPriority(1)` на сортируемые компоненты и кастомайзеры ядра.
- **Когда использовать**: Когда важен строгий детерминированный порядок нескольких SPI-кастомайзеров или фильтров.
- **Когда НЕ использовать и риски**: НЕ путайте с сортировкой SQL (`?sort=`) или фильтрами Spring Security.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Нет (Опционально) | Одно из поддерживаемых значений: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Приоритет выполнения; меньшее значение выполняется раньше.<br/>*Примечание:* Меньшие числа выполняются ПЕРВЫМИ (как в Spring `@Order`). Резервируйте `< 0` для безопасности/трассировки и `10..100` для бизнеса. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Безопасность сущностей, конечный автомат, целостность, генераторы и запросы (11 аннотаций)

### `@EntitySecurity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Применяет RBAC, изоляцию на уровне записей ownerField и коды разрешений до выполнения запросов.
- **Поведение во время выполнения**: Вычисляется до выполнения SQL; при отказе выбрасывается HTTP 403 Forbidden.
- **Как использовать**: Аннотируйте `@Entity`, задав `readRoles`/`writeRoles`/`deleteRoles` и при необходимости `ownerField`.
- **Когда использовать**: Используйте на КАЖДОЙ открытой сущности для защиты REST, пакетов, экспорта и GraphQL.
- **Когда НЕ использовать и риски**: НЕ ставьте `permitAll = true` на полный `AutoApiController<E>` без `AutoReadApi<E>`, `disabledEndpoints` или `@SecurityPolicyEntity` (пропускает проверки READ, WRITE и DELETE).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_USER", "ROLE_ADMIN"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Роли с правом чтения записей (GET, GraphQL, экспорт).<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |
| `writeRoles` | `String[]` | `{}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_MANAGER", "ROLE_ADMIN"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Роли с правом записи (POST/PUT/PATCH/импорт).<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |
| `deleteRoles` | `String[]` | `{}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Роли с правом удаления (DELETE и batch-delete).<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |
| `permitAll` | `boolean` | `false` | Нет (Опционально) | `true` (разрешить публичный доступ без входа) или `false` (требовать аутентификацию и проверку ролей).<br/>`@EntitySecurity(permitAll = true)` | При true (и отсутствии DB-RBAC политик) отключает проверки @EntitySecurity для READ, WRITE и DELETE; сочетайте с AutoReadApi<E> или disabledEndpoints.<br/>*Примечание:* Отменяет проверки ролей и открывает анонимный доступ. Никогда не включайте для ПДн и финансовых сущностей. |
| `ownerField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа владельца/UUID (напр. `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Поле владельца записи ("createdBy", "ownerId") для защиты от IDOR.<br/>*Примечание:* Включает построчный контроль владельца в `GET`/`PUT`/`PATCH`/`DELETE`, если у пользователя нет роли из `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Привилегированные роли, обходящие проверку `ownerField`.<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |
| `permissions` | `String[]` | `{}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ORDER_READ", "ORDER_APPROVE"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Детальные коды разрешений (проверяются DB RBAC и SecurityIdentityCustomizer).<br/>*Примечание:* Сверяется с гранулярными правами из JWT или DB-RBAC `@SecurityPermissionEntity`. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Динамически маскирует или обнуляет чувствительные поля при отсутствии нужных ролей.
- **Поведение во время выполнения**: Применяется после выборки перед сериализацией JSON.
- **Как использовать**: Аннотируйте чувствительные поля (`costPrice`, `ssn`); маскирование работает поверх изолированной копии.
- **Когда использовать**: Когда одна модель отдаётся разным ролям в REST и GraphQL с разным уровнем доступа к полям.
- **Когда НЕ использовать и риски**: Нестроковые поля и так сбрасываются в `null`; ставьте `nullifyInsteadOfMask = true` когда поле `String` должно стать `null` вместо `"******"`, либо `readDto` для удаления ключа.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_ADMIN", "ROLE_FINANCE"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Роли с правом видеть реальное немаскированное значение.<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |
| `maskPattern` | `String` | `"******"` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"***-**-****"`); `""` применяет соглашение по умолчанию.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Маска-заглушка для строковых полей при отсутствии прав.<br/>*Примечание:* Игнорируется при `nullifyInsteadOfMask = true`. Для нестроковых полей (`BigDecimal`, `LocalDate`) лучше `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Нет (Опционально) | `true` (заменять недоступное поле на JSON null) или `false` (применять маску maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | При true обнуляет и String-поля вместо maskPattern (нестроковые типы уже автоматически становятся null).<br/>*Примечание:* Критично для чисел, дат и объектов, чтобы клиенты TypeScript/Zod получали валидный `null`. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Контролирует переходы состояний через POST /{id}/transition и ограничивает DELETE /{id} списком deletableStates.
- **Поведение во время выполнения**: Отклоняет недопустимые переходы или удаления с ошибкой HTTP 422 BusinessRuleViolationException.
- **Как использовать**: Ставьте на строковое поле статуса с разделителем `:` (`"CREATED:PAID,CANCELLED"`).
- **Когда использовать**: Для строгих конечных автоматов (заказы, кредиты, счета) с возвратом `422` при нарушении.
- **Когда НЕ использовать и риски**: НИКОГДА не пишите `"->"` (`EntityStateMachineUtil` парсит только разделитель `":"`)!

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"CREATED"`); `""` применяет соглашение по умолчанию.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Начальный статус при создании записи, если поле пустое ("ACTIVE").<br/>*Примечание:* Автоматически задаётся при `POST`-создании, если поле пусто; должно совпадать со статусом до `:` в `transitions`. |
| `transitions` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Допустимые переходы в формате "FROM:TO_1,TO_2" (разделитель — двоеточие).<br/>*Примечание:* Требует точный синтаксис через двоеточие `"FROM:TO1,TO2"` (цели через запятую). Необъявленный переход отклоняется с HTTP `400`/`409`. |
| `deletableStates` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Состояния, в которых разрешено удаление DELETE (иначе HTTP 422).<br/>*Примечание:* Если не пуст, `DELETE /{id}` вернёт HTTP `409 Conflict`, если сущность находится в другом состоянии (напр. `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Компилирует читаемые правила политики в действующие правила RBAC, переходов и маскирования.
- **Поведение во время выполнения**: Доступен в GET /human-policy и переопределяется в YAML в spring-nwvmc.human-policies.<Entity>.
- **Как использовать**: Указывайте на сущности или в YAML `spring-nwvmc.human-policies` — компилируется `HumanPolicyRegistryHelper`.
- **Когда использовать**: Когда бизнесу или комплаенсу нужны человекочитаемые правила в YAML без изменения Java-кода.
- **Когда НЕ использовать и риски**: НЕ пишите произвольный текст или не-английские фразы — парсер работает по строгим шаблонам.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Нет (Опционально) | Одно из поддерживаемых значений: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Описание жизненного цикла на естественном английском языке.<br/>*Примечание:* Компилируется при старте в тот же движок, что и `@StateMachine`; не дублируйте конфликтующие правила. |
| `security` | `String` | `""` | Нет (Опционально) | Одно из поддерживаемых значений: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Правила RBAC на естественном английском языке.<br/>*Примечание:* К ролям автоматически добавляется префикс `ROLE_`, а синтаксис проверяется при запуске (fail-fast). |
| `masking` | `String` | `""` | Нет (Опционально) | Одно из поддерживаемых значений: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Политика маскирования полей на естественном английском языке.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"costPrice"`); иначе возникнет ошибка в runtime. |
| `stateField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа статуса жизненного цикла (напр. `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Поле сущности, хранящее состояние жизненного цикла.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"orderStatus"`); иначе возникнет ошибка в runtime. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Записывает отличия на уровне полей для Time-Travel реконструкции и проверки /diff.
- **Поведение во время выполнения**: Фиксирует дельты oldValue и newValue при create, update, patch, transition и restore.
- **Как использовать**: Аннотируйте сущность `BaseAuditEntity` с помощью `@AuditTrail`.
- **Когда использовать**: Для критичных сущностей (платежи, заказы, медкарта) с требованием аудита `/{id}/revisions`.
- **Когда НЕ использовать и риски**: Отключайте на высоконагруженных таблицах логов/телеметрии во избежание лишней записи.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"FINANCE_LEDGER"`); `""` применяет соглашение по умолчанию.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Логическая категория аудита; по умолчанию имя сущности.<br/>*Примечание:* Тегирует записи аудита для фильтрации по домену; `""` использует имя класса JPA-сущности. |
| `recordFieldDiffs` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | При true вычисляет пополевой diff (было/стало) для Time-Travel.<br/>*Примечание:* Фиксирует diff до/после при `PUT`/`PATCH`; отключайте (`false`) для крупных полей и высокочастотной телеметрии. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Автоматически изолирует выборки и изменения строк по активному тенанту, если нет роли обхода.
- **Поведение во время выполнения**: Fail-closed HTTP 403 при отсутствии контекста тенанта; принудительно перезаписывает tenantId при создании и проверяет принадлежность во всех операциях по ID (защита от IDOR).
- **Как использовать**: Ставьте на SaaS-сущность; изоляция чтений, защита от подмены при создании и `403` работают автоматически.
- **Когда использовать**: На всех мультитенантных B2B/SaaS таблицах для исключения утечек между арендаторами.
- **Когда НЕ использовать и риски**: НЕ ставьте на общие глобальные справочники (страны, валюты) и без `tenantId` в контексте.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Нет (Опционально) | Точное имя Java-поля сущности типа идентификатора арендатора (напр. `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Имя поля сущности, хранящего ID арендатора ("tenantId").<br/>*Примечание:* Создайте составной индекс `(tenant_id, id)` в БД для быстрой и строго изолированной выборки по арендатору. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Нет (Опционально) | Массив ролей Spring Security (напр. `{"ROLE_SUPER_ADMIN"}`); пустой `{}` не задаёт отдельного ограничения.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Роли уровня платформы с доступом ко всем арендаторам.<br/>*Примечание:* Храните роли в `RoleConstant` с префиксом `ROLE_` (напр. `ROLE_ADMIN`) в соответствии с `GrantedAuthority` в Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Проверяет уникальность значения перед сохранением при create, update и upsert.
- **Поведение во время выполнения**: Выбрасывает ConflictBusinessException (HTTP 409) при наличии дубликата.
- **Как использовать**: Ставьте на уникальные бизнес-поля (`email`, `skuCode`) вместе с `@Column(unique = true)`.
- **Когда использовать**: Когда нужно проверять уникальность среди активных записей с локализованным ответом `HTTP 409 Conflict`.
- **Когда НЕ использовать и риски**: НЕ отказывайтесь от индекса `UNIQUE` в БД при высокой конкурентности.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Автоматически генерирует уникальные бизнес-коды с префиксом при создании или клонировании, если поле пустое.
- **Поведение во время выполнения**: Заполняет префикс + уникальный токен перед валидацией и сохранением.
- **Как использовать**: Пометьте строковое поле `@AutoCode(prefix = "PRD-")`; код сгенерируется при пустом значении.
- **Когда использовать**: Для читаемых бизнес-кодов (заказы, SKU, тикеты) на базе UUIDv7 без блокировок последовательностей БД.
- **Когда НЕ использовать и риски**: НЕ используйте там, где по закону нужны строго последовательные номера без пропусков.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Required (no default)` | **Да (Обязательно)** | Непустая строка-идентификатор (напр. `"ORD"`); `""` применяет соглашение по умолчанию.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Обязательный префикс перед 8-символьным заглавным хэшем UUIDv7 (напр. "PRD-").<br/>*Примечание:* Обязательный атрибут; генерирует код вида `INV-2026-0001` только если поле пусто при создании. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Автоматически формирует нормализованные ЧПУ ASCII-слаги из поля sourceField.
- **Поведение во время выполнения**: Нормализует диакритические знаки Unicode и обеспечивает поиск по слагу.
- **Как использовать**: Укажите `@AutoSlug(sourceField = "name")` на поле `slug`.
- **Когда использовать**: Для SEO-человекочитаемых URL (витрины, статьи, товары, категории).
- **Когда НЕ использовать и риски**: НЕ указывайте несуществующее имя в `sourceField`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Required (no default)` | **Да (Обязательно)** | Точное имя Java-поля сущности типа строкового (напр. `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Обязательное имя исходного поля, преобразуемого в ASCII slug.<br/>*Примечание:* Обязательный; преобразует Unicode-текст в URL-безопасный kebab-case. Сочетайте с `@UniqueField` для уникальности. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Назначение**: Вычисляет производные числовые итоги перед сохранением изменений сущности.
- **Поведение во время выполнения**: Проверяется при старте через ComputedFieldFailFastUtil для быстрого выявления ошибок.
- **Как использовать**: Ставьте на вычисляемое числовое поле; пересчёт в `BigDecimal` выполняется на сервере до сохранения.
- **Когда использовать**: Для серверного расчёта сумм позиций и заказов без доверия суммам из клиентского JSON.
- **Когда НЕ использовать и риски**: НЕ применяйте для сложных ступенчатых скидок или расчётов через внешние API (`@ServiceOverride`).

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Нет (Опционально) | Одно из поддерживаемых значений: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Режим расчёта: "MULTIPLY" или "SUM_COLLECTION".<br/>*Примечание:* Автоматически пересчитывается до сохранения, перезаписывая любые подменённые клиентом суммы. |
| `sourceFields` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Поля одной сущности, перемножаемые в режиме "MULTIPLY".<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"unitPrice"`); иначе возникнет ошибка в runtime. |
| `collectionField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа коллекции @OneToMany (напр. `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Имя дочерней коллекции @OneToMany для режима "SUM_COLLECTION".<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"items"`); иначе возникнет ошибка в runtime. |
| `itemField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа числового (напр. `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Числовое поле каждого дочернего элемента для суммирования.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"subTotal"`); иначе возникнет ошибка в runtime. |
| `subtractField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа числового (напр. `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Поле скидки/вычета родителя, вычитаемое из суммы.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"discountAmount"`); иначе возникнет ошибка в runtime. |
| `addField` | `String` | `""` | Нет (Опционально) | Точное имя Java-поля сущности типа числового (напр. `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Дополнительное поле наценки, прибавляемое к итогу.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"shippingFee"`); иначе возникнет ошибка в runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Позволяет привязывать пользовательский SQL/JPQL или методы провайдеров к эндпоинтам контроллера.
- **Поведение во время выполнения**: Выполняется со связанными именованными параметрами через JPA EntityManager.
- **Как использовать**: Сочетайте с `@AutoGet`/`@AutoPost`, привязывая `:param` через `@AutoParam`/`@AutoVariable`.
- **Когда использовать**: Для нативных SQL-отчётов, CTE, оконных функций и JSONB без написания Repository.
- **Когда НЕ использовать и риски**: НИКОГДА не конкатенируйте пользовательский ввод в SQL; всегда используйте `:param` и не делайте JOIN между доменами.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Нет (Опционально) | Одно из поддерживаемых значений: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Встроенный SQL или JPQL с именованными параметрами `:param`.<br/>*Примечание:* Всегда используйте параметры `:param` или `?1` против SQL-инъекций; оставьте `""` при использовании `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Нет (Опционально) | `true` (выполнять нативный SQL базы данных) или `false` (выполнять переносимый JPA JPQL).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true выполняет нативный SQL; false — JPQL.<br/>*Примечание:* Нативный SQL (`true`) даёт CTE и оконные функции; выбирайте `false` (JPQL) для переносимости H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `MonthlyRevenueDto.class`) или `Void.class` для отключения маппинга.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Опциональный класс результата запроса.<br/>*Примечание:* Всегда указывайте DTO-проекцию для агрегаций, чтобы избежать `SELECT *` и нетипизированных `Object[]`. |
| `sqlProvider` | `Class<?>` | `Void.class` | Нет (Опционально) | Любой конкретный Java-класс DTO (напр. `OrderAnalyticsSqlProvider.class`) или `Void.class` для отключения маппинга.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Опциональный класс-провайдер динамического SQL (проверяется при старте).<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `sqlProvider` сразу прерывают старт (fail-fast). |
| `providerMethod` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"buildRevenueSql"`); `""` применяет соглашение по умолчанию.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Имя метода в `sqlProvider`, возвращающего строку SQL.<br/>*Примечание:* Должно точно совпадать с Java-идентификатором с учётом регистра (напр. `"buildRevenueSql"`); иначе возникнет ошибка в runtime. |
| `modifying` | `boolean` | `false` | Нет (Опционально) | `true` (DML UPDATE/DELETE внутри транзакции записи) или `false` (только чтение SELECT-запроса).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Обязательно `true` для запросов INSERT/UPDATE/DELETE.<br/>*Примечание:* Обязательно (`true`) для `UPDATE`/`DELETE`; оборачивает вызов в транзакцию записи и очищает контекст JPA. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. Динамический RBAC на основе БД и мета-аннотации маскирования полей (18 аннотаций)

### `@SecurityRoleEntity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Назначение**: Назначает JPA-сущность динамическим каталогом ролей RBAC в базе данных.
- **Поведение во время выполнения**: DynamicDatabaseRbacProviderHelper кэширует связи ролей и разрешений в Caffeine с автосбросом при записи.
- **Как использовать**: Аннотируйте JPA-сущность ролей `@SecurityRoleEntity` и пометьте код роли `@RoleCode`.
- **Когда использовать**: Когда роли и их полномочия динамически настраиваются в базе данных в runtime.
- **Когда НЕ использовать и риски**: НЕ забывайте `@RoleCode` (приложение не запустится) и не дублируйте `@SecurityRoleEntity`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Нет (Опционально) | Положительное число (`>= 1`) в секундах; напр. `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL кэша Caffeine в секундах (сбрасывается автоматически при изменении ролей).<br/>*Примечание:* Короткий TTL быстрее подхватывает изменения, но нагружает БД; длинный снижает нагрузку, но задерживает отзыв прав. |

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

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет столбец уникального кода роли внутри сущности @SecurityRoleEntity.
- **Поведение во время выполнения**: Читается через кэшированный LambdaAccessorUtil для сопоставления с GrantedAuthority.
- **Как использовать**: Укажите `@RoleCode` на поле или геттере внутри сущности `@SecurityRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Определяет поле отображаемого имени роли в сущности @SecurityRoleEntity.
- **Поведение во время выполнения**: Выводится в диагностических метаданных RBAC и инспекторе Dev Studio.
- **Как использовать**: Укажите `@RoleName` на поле или геттере внутри сущности `@SecurityRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Помечает коллекцию или CSV-строку кодов разрешений, выданных роли.
- **Поведение во время выполнения**: Динамически разбирается и разворачивается в полномочия SecurityIdentityCustomizer.
- **Как использовать**: Укажите `@RolePermissions` на поле или геттере внутри сущности `@SecurityRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Назначение**: Помечает JPA-сущность для хранения разрешений ресурс-действие и правил маскирования полей.
- **Поведение во время выполнения**: Загружается в DatabaseRbacRuleMatcherHelper для контроля CRUD и маскирования полей.
- **Как использовать**: Аннотируйте сущность разрешений `@SecurityPermissionEntity` с обязательным `@PermissionCode`.
- **Когда использовать**: Для управления гранулярными правами и масками полей через таблицы базы данных.
- **Когда НЕ использовать и риски**: НЕ пропускайте `@PermissionCode` и не создавайте вторую `@SecurityPermissionEntity`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Нет (Опционально) | Положительное число (`>= 1`) в секундах; напр. `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL кэша Caffeine в секундах для разрешений.<br/>*Примечание:* Короткий TTL быстрее подхватывает изменения, но нагружает БД; длинный снижает нагрузку, но задерживает отзыв прав. |

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

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Указывает поле уникального идентификатора разрешения в @SecurityPermissionEntity.
- **Поведение во время выполнения**: Сопоставляется с правами пользователя и кодами @EntitySecurity.permissions().
- **Как использовать**: Укажите `@PermissionCode` на поле или геттере внутри сущности `@SecurityPermissionEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPermissionEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPermissionEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет имя целевой сущности или API-ресурса (либо *) в @SecurityPermissionEntity.
- **Поведение во время выполнения**: Сравнивается без учёта регистра в DatabaseRbacRuleMatcherHelper с поддержкой маски.
- **Как использовать**: Укажите `@PermissionResource` на поле или геттере внутри сущности `@SecurityPermissionEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPermissionEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPermissionEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет глагол CRUD или пользовательского действия в @SecurityPermissionEntity.
- **Поведение во время выполнения**: Автоматически нормализуется из имён методов контроллера (READ, WRITE, DELETE или кастомное действие).
- **Как использовать**: Укажите `@PermissionAction` на поле или геттере внутри сущности `@SecurityPermissionEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPermissionEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPermissionEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Указывает разделённый запятыми список полей сущности для динамического маскирования по правилу БД.
- **Поведение во время выполнения**: Применяется динамически вместе с @FieldSecurity перед сериализацией JSON-ответа.
- **Как использовать**: Укажите `@PermissionFieldMask` на поле или геттере внутри сущности `@SecurityPermissionEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPermissionEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPermissionEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Назначение**: Помечает JPA-сущность, связывающую субъекта с ролями БД и опциональным тенантом.
- **Поведение во время выполнения**: Автоматически запрашивается при гидратации JWT / SecurityContext через SecurityIdentityCustomizer.
- **Как использовать**: Аннотируйте таблицу связей `@SecurityUserRoleEntity` с `@UserRoleSubject` и `@UserRoleCode`.
- **Когда использовать**: Когда JWT содержит только субъекта (`sub`), а роли должны подтягиваться из БД (в т.ч. по арендатору).
- **Когда НЕ использовать и риски**: НЕ забывайте `@UserRoleSubject`; не требуется, если внешний IdP уже отдаёт все роли в JWT.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@SecurityUserRoleEntity(enabled = true)` | Флаг включения/отключения загрузки привязок пользователь-роль.<br/>*Примечание:* Можно временно поставить `false` на время миграции схемы, сохраняя авторизацию по ролям из JWT. |

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

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Указывает поле субъекта / имени пользователя в @SecurityUserRoleEntity.
- **Поведение во время выполнения**: Сравнивается с Authentication.getName() из активного SecurityContext.
- **Как использовать**: Укажите `@UserRoleSubject` на поле или геттере внутри сущности `@SecurityUserRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityUserRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityUserRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Привязывает столбец назначенного кода роли внутри @SecurityUserRoleEntity.
- **Поведение во время выполнения**: Подтягивает связанные разрешения @SecurityRoleEntity при проверке политик.
- **Как использовать**: Укажите `@UserRoleCode` на поле или геттере внутри сущности `@SecurityUserRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityUserRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityUserRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Ограничивает назначение @SecurityUserRoleEntity конкретным тенантом (или * для всех).
- **Поведение во время выполнения**: Фильтруется по TenantContextHolder / X-Tenant-ID при каждом аутентифицированном запросе.
- **Как использовать**: Укажите `@UserRoleTenantId` на поле или геттере внутри сущности `@SecurityUserRoleEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityUserRoleEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityUserRoleEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Назначение**: Помечает JPA-сущность явных политик ALLOW / DENY с приоритетом priority.
- **Поведение во время выполнения**: Явный DENY детерминированно перекрывает ALLOW до выполнения любого SQL.
- **Как использовать**: Аннотируйте таблицу политик `@SecurityPolicyEntity` с обязательным `@PolicyAllowedRoles` и `@PolicyEffect`.
- **Когда использовать**: Для динамического переопределения `@EntitySecurity` правилами из БД (включая экстренные запреты `DENY`).
- **Когда НЕ использовать и риски**: НЕ забывайте `@PolicyAllowedRoles`; помните, что явный `DENY` перекрывает `ALLOW`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Нет (Опционально) | Положительное число (`>= 0`) в целочисленном приоритете; напр. `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Приоритет оценки политик (меньшее число = выше приоритет).<br/>*Примечание:* Меньшее значение имеет более высокий приоритет при совпадении политик (напр. `10` перекрывает `100`). |

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

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет шаблон целевого ресурса в сущности @SecurityPolicyEntity.
- **Поведение во время выполнения**: Поддерживает точные имена сущностей/ресурсов и маску *.
- **Как использовать**: Укажите `@PolicyResource` на поле или геттере внутри сущности `@SecurityPolicyEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPolicyEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPolicyEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет защищаемое действие (READ, WRITE, DELETE, methodName, *) в @SecurityPolicyEntity.
- **Поведение во время выполнения**: Проверяется для каждой HTTP-операции перед передачей в сервис.
- **Как использовать**: Укажите `@PolicyAction` на поле или геттере внутри сущности `@SecurityPolicyEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPolicyEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPolicyEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Сопоставляет коллекцию или CSV-список ролей, охватываемых правилом @SecurityPolicyEntity.
- **Поведение во время выполнения**: Сверяется с активными полномочиями JWT и ролями из @SecurityUserRoleEntity.
- **Как использовать**: Укажите `@PolicyAllowedRoles` на поле или геттере внутри сущности `@SecurityPolicyEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPolicyEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPolicyEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Назначение**: Задаёт результат решения ALLOW или DENY в правиле @SecurityPolicyEntity.
- **Поведение во время выполнения**: Любое совпадение DENY немедленно прерывает запрос с HTTP 403 AccessDeniedBusinessException.
- **Как использовать**: Укажите `@PolicyEffect` на поле или геттере внутри сущности `@SecurityPolicyEntity`.
- **Когда использовать**: Для привязки произвольных колонок таблицы `@SecurityPolicyEntity` к движку DB-RBAC без переименования схемы.
- **Когда НЕ использовать и риски**: НЕ дублируйте на нескольких полях одной сущности и не ставьте вне `@SecurityPolicyEntity`.

> **Маркерная аннотация**: Чистая маркерная аннотация без атрибутов.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Распределённые блокировки, идемпотентность, кэш, мульти-БД и CloudEvents (13 аннотаций)

### `@DistributedLock`

- **Пакет**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Назначение**: Сериализует конкурентный доступ по SpEL-ключам в AST-кэше (макс. 1024; по умолчанию 3000L/5000L).
- **Поведение во время выполнения**: DistributedLockAspect выбрасывает DistributedLockAcquisitionException (HTTP 409) по истечении таймаута.
- **Как использовать**: Ставьте на метод не-`final` `@Service`; для кластера зарегистрируйте Redis `DistributedLockProvider`.
- **Когда использовать**: Для защиты от оверселлинга склада, двойного списания баланса и гонок в батчах.
- **Когда НЕ использовать и риски**: НЕ считайте, что стандартный Caffeine-провайдер работает между разными нодами, и не ставьте на `final`-классы.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Нет (Опционально) | SpEL-выражение со ссылкой на аргументы метода (напр. `"'inventory:' + #skuId"`) или `""` для автогенерации ключа.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | SpEL-выражение ключа блокировки (напр. "'sku:' + #skuCode").<br/>*Примечание:* Всегда привязывайте ключ к ID ресурса (`#id`); константный ключ сериализует весь трафик. |
| `waitTimeMs` | `long` | `3000L` | Нет (Опционально) | Положительное число (`>= 0`) в миллисекундах; напр. `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Максимальное ожидание захвата блокировки в миллисекундах (3000L).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: слишком малое значение даст ложные 409; слишком большое задержит потоки под пиком. |
| `leaseTimeMs` | `long` | `5000L` | Нет (Опционально) | Положительное число (`>= 100`) в миллисекундах; напр. `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Максимальное время удержания блокировки (lease) в мс (5000L).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: должно превышать p99 время транзакции, иначе блокировка истечёт до коммита. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Предотвращает параллельную или повторную дублирующую запись в рамках настраиваемого TTL.
- **Поведение во время выполнения**: Выполняется IdempotencyAspect и ProxyIdempotencyGuardHelper через Caffeine TTL (HTTP 409 ConflictBusinessException); пустые ключи пропускаются, а IdempotencyManagerHelper опционален для SHA-256.
- **Как использовать**: Ставьте на методы `@AutoRestController` или не-`final` `@Service`; при ошибке ключ освобождается.
- **Когда использовать**: Для платежей, переводов и POST-запросов, уязвимых к двойному клику или сетевым повторам.
- **Когда НЕ использовать и риски**: НЕ ставьте на GET и используйте Redis `IdempotencyStoreProvider` в кластере из нескольких инстансов.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Нет (Опционально) | Корректное имя HTTP-заголовка (регистронезависимое в сети, напр. `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | HTTP-заголовок с ключом идемпотентности; пустой/отсутствующий пропускается.<br/>*Примечание:* Клиент обязан слать уникальный UUIDv7 на операцию и повторять его при ретраях; добавьте заголовок в CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Нет (Опционально) | Положительное число (`>= 1`) в секундах; напр. `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Окно дедупликации в секундах (повтор даёт HTTP 409 Conflict; по умолчанию 300L).<br/>*Примечание:* Срок хранения ответа в Redis/памяти; задавайте `300L–86400L` по окну повторных попыток (24ч для платежей). |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Применяет ограничение частоты запросов со скользящим окном по IP, User или Tenant.
- **Поведение во время выполнения**: Увеличивает метрику nwvmc.ratelimit.rejected.total и возвращает HTTP 429 Too Many Requests.
- **Как использовать**: Ставьте на интерфейс или метод; добавляет `X-RateLimit-Remaining`/`X-RateLimit-Reset`, а при превышении возвращает `HTTP 429` + `Retry-After`.
- **Когда использовать**: Для публичного поиска, авторизации, AI-запросов и тяжёлых выгрузок против злоупотреблений.
- **Когда НЕ использовать и риски**: НЕ ставьте низкий порог на health-check и избегайте `"GLOBAL"`, если требуется изоляция по `"USER"`, `"TENANT"` или `"IP"`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Нет (Опционально) | Положительное число (`>= 1`) в запросах; напр. `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Максимум запросов за скользящее окно (по умолчанию 60).<br/>*Примечание:* Возвращает заголовки `X-RateLimit-Remaining`, `X-RateLimit-Reset` и RFC 6585 `Retry-After` при HTTP `429`. |
| `windowSeconds` | `int` | `60` | Нет (Опционально) | Положительное число (`>= 1`) в секундах; напр. `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Длительность окна ограничения в секундах (60).<br/>*Примечание:* Задаёт длительность окна счётчика и определяет значения `X-RateLimit-Reset` и `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Нет (Опционально) | Одно из поддерживаемых значений: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Динамическое бакетирование: "IP"/"clientIp", "USER" (IP-фоллбек для анонимов), "TENANT", "GLOBAL" или SpEL "#expr".<br/>*Примечание:* `"USER"` делит квоту по пользователю с откатом на IP для анонимов; `"GLOBAL"` задаёт один общий лимит для всех. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Оборачивает операции в Circuit Breaker Resilience4j с телеметрией в Actuator и Micrometer.
- **Поведение во время выполнения**: Переходит в OPEN (HTTP 503) при превышении порога и обновляет метрику nwvmc.resilience.circuitbreaker.state.
- **Как использовать**: Ставьте на контроллеры/методы, зависящие от внешних API или AI, для защиты от каскадных сбоев.
- **Когда использовать**: Когда при сбое внешней системы лучше быстро вернуть `HTTP 503`, чем держать потоки на таймаутах.
- **Когда НЕ использовать и риски**: `CircuitBreakerErrorFilterUtil` автоматически игнорирует 4xx `BaseBusinessException`; не оборачивайте клиентские ошибки в `RuntimeException`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"payment-gateway-cb"`); `""` применяет соглашение по умолчанию.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Имя экземпляра CircuitBreaker в Resilience4j.<br/>*Примечание:* Задаёт имя экземпляра Resilience4j и тег метрик Micrometer; `""` берёт имя класса. |
| `failureRateThreshold` | `float` | `50.0f` | Нет (Опционально) | Положительное число (`1.0f .. 100.0f`) в процентах; напр. `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Порог процента ошибок для перехода в состояние OPEN (50.0f).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: бизнес-ошибки 4xx (`BaseBusinessException`) автоматически игнорируются; учитываются только сбои 5xx и инфраструктуры. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Нет (Опционально) | Положительное число (`>= 1`) в секундах; напр. `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Секунды в состоянии OPEN (HTTP 503) до пробы HALF_OPEN (10).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: бизнес-ошибки 4xx (`BaseBusinessException`) автоматически игнорируются; учитываются только сбои 5xx и инфраструктуры. |
| `slidingWindowSize` | `int` | `20` | Нет (Опционально) | Положительное число (`>= 1`) в вызовах; напр. `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Размер скользящего окна для подсчёта ошибок (20).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: бизнес-ошибки 4xx (`BaseBusinessException`) автоматически игнорируются; учитываются только сбои 5xx и инфраструктуры. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Нет (Опционально) | Положительное число (`>= 1`) в вызовах; напр. `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Число пробных запросов в состоянии HALF_OPEN (5).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: бизнес-ошибки 4xx (`BaseBusinessException`) автоматически игнорируются; учитываются только сбои 5xx и инфраструктуры. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Автоматически повторяет сбои с настраиваемой экспоненциальной задержкой.
- **Поведение во время выполнения**: Выбрасывает стандартизированное исключение после исчерпания всех попыток.
- **Как использовать**: Ставьте на контроллеры и методы для автоматических повторов при временных сбоях сети или блокировках БД.
- **Когда использовать**: Для идемпотентных GET, PUT или операций под защитой `@Idempotent`.
- **Когда НЕ использовать и риски**: НИКОГДА не ставьте на неидемпотентные POST-запросы или списания без `@Idempotent`!

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"erp-sync-retry"`); `""` применяет соглашение по умолчанию.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Имя экземпляра Retry в Resilience4j.<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: проверяйте, что суммарное время всех попыток меньше таймаута шлюза. |
| `maxAttempts` | `int` | `3` | Нет (Опционально) | Положительное число (`>= 1`) в попытках; напр. `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Всего попыток, включая первую (по умолчанию 3).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: проверяйте, что суммарное время всех попыток меньше таймаута шлюза. |
| `waitDurationMs` | `long` | `500L` | Нет (Опционально) | Положительное число (`>= 50`) в миллисекундах; напр. `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Начальная задержка перед первым повтором в мс (500L).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: проверяйте, что суммарное время всех попыток меньше таймаута шлюза. |
| `backoffMultiplier` | `double` | `2.0d` | Нет (Опционально) | Положительное число (`>= 1.0d`) в множителе; напр. `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Экспоненциальный множитель задержки между повторами (2.0d).<br/>*Примечание:* Тщательно подбирайте под SLA задержек в продакшене: проверяйте, что суммарное время всех попыток меньше таймаута шлюза. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Пакет**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Вычисляет слабые RFC 7232 ETag (W/"...") и формирует заголовки Cache-Control с ответами HTTP 304 Not Modified.
- **Поведение во время выполнения**: Учитывает счётчики HIT/MISS в метрике nwvmc.cache.http.requests.
- **Как использовать**: Ставьте на GET-методы чтения для стандартного кэширования с `ETag` и `304 Not Modified`.
- **Когда использовать**: Для полустатичных каталогов, справочников и публичных витрин для экономии трафика через `304`.
- **Когда НЕ использовать и риски**: НИКОГДА не оставляйте `isPrivate = false` на приватных, мультитенантных или маскируемых данных!

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Нет (Опционально) | Положительное число (`>= 0`) в секундах; напр. `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Длительность директивы `max-age` в Cache-Control в секундах (60).<br/>*Примечание:* Задаёт `Cache-Control: max-age=<N>`. Значение `0` с `generateETag = true` включает проверку через `304 Not Modified`. |
| `isPrivate` | `boolean` | `false` | Нет (Опционально) | `true` (приватный кэш браузера; запрещено для CDN) или `false` (публичный кэш для прокси и CDN).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true выставляет `private` (без CDN); false — `public`.<br/>*Примечание:* КРИТИЧНО: Всегда ставьте `isPrivate = true` для защищённых и multi-tenant эндпоинтов, чтобы CDN не отдал чужой ответ. |
| `mustRevalidate` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Добавляет `, must-revalidate` для обязательной проверки после истечения.<br/>*Примечание:* Запрещает прокси-кэшам отдавать устаревший ответ по истечении `maxAgeSeconds` без перепроверки. |
| `generateETag` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Вычисляет ETag (SHA-256) и возвращает `304 Not Modified` при совпадении `If-None-Match`.<br/>*Примечание:* Вычисляет RFC 7232 `ETag` и возвращает `304 Not Modified` (0 байт) при совпадении `If-None-Match`. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Кэширует результаты серверных методов чтения в Caffeine L1 / Redis L2.
- **Поведение во время выполнения**: Глобально настраивается через app.framework.cache.type.
- **Как использовать**: Ставьте на методы чтения сервисов; движок выбирается в `app.framework.cache.type`.
- **Когда использовать**: Для сценариев с высокой долей чтений по ID или метаданным (соотношение R/W > 10:1).
- **Когда НЕ использовать и риски**: НЕ кэшируйте изменяемые сущности без клонирования и таблицы с постоянной записью.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Имена кэшей в Caffeine L1 или Redis L2.<br/>*Примечание:* Имена регионов должны совпадать с настройками Caffeine/Redis; ставьте парный `@AutoCacheEvict` на все записи. |
| `key` | `String` | `""` | Нет (Опционально) | SpEL-выражение со ссылкой на аргументы метода (напр. `"'product:' + #id"`) или `""` для автогенерации ключа.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | SpEL-выражение ключа (`v0.1.0` детерминированно строит `EntityName:id`).<br/>*Примечание:* В multi-tenant системах обязательно включайте tenantId в ключ кэша во избежание утечки между арендаторами. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Вытесняет устаревшие записи серверного кэша при изменениях данных.
- **Поведение во время выполнения**: Выполняется после мутации, исключая устаревшее чтение.
- **Как использовать**: Ставьте на методы обновления и удаления с ключом, совпадающим с `@AutoCacheable`.
- **Когда использовать**: При каждом изменении или удалении записей, кэшированных через `@AutoCacheable`.
- **Когда НЕ использовать и риски**: Избегайте `allEntries = true` на частых `create` — это вызывает лавинообразный Cache Stampede.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Имена кэшей для очистки после выполнения метода.<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `value` сразу прерывают старт (fail-fast). |
| `key` | `String` | `""` | Нет (Опционально) | SpEL-выражение со ссылкой на аргументы метода (напр. `"'product:' + #id"`) или `""` для автогенерации ключа.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | SpEL-ключ для точечного удаления только изменённой записи.<br/>*Примечание:* Должно формировать точно такой же ключ, как `@AutoCacheable.key`; игнорируется при `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Нет (Опционально) | `true` (очистить все записи в регионе кэша) или `false` (удалять только одну запись по key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | При true очищает записи с префиксом текущей сущности, не затрагивая остальные.<br/>*Примечание:* Полная очистка региона под нагрузкой способна вызвать cache stampede на БД; предпочитайте точечный `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Пакет**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Замеряет время выполнения и пишет WARN при превышении порога медленных вызовов.
- **Поведение во время выполнения**: Также передаёт метрики задержек в DynamicEntityMetricsHelper.
- **Как использовать**: Ставьте на контроллеры или сервисы для отслеживания нарушений SLA и медленных запросов.
- **Когда использовать**: Для сложных отчётов, пакетных задач, GraphQL и `@CustomQuery` для раннего поиска тормозов.
- **Когда НЕ использовать и риски**: НЕ ставьте `warningThresholdMs = 0` на быстрых путях и не вешайте на длинные SSE-стримы `/events`.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Нет (Опционально) | Положительное число (`>= 1`) в миллисекундах; напр. `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Порог в мс, при превышении которого пишется предупреждение `WARN` о медленном вызове (500L).<br/>*Примечание:* Пишет `WARN`-лог с `traceId` при превышении порога; задавайте реалистичное значение (`200L–1000L`), чтобы не засорять логи. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Пакет**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Назначение**: Отправляет асинхронные исходящие webhook-уведомления с подписью HMAC-SHA256 на Virtual Threads.
- **Поведение во время выполнения**: Вычисляет подписи в WebhookHmacSignerHelper и сравнивает их за константное время.
- **Как использовать**: Ставьте на `@Entity`; отправка запускается строго после коммита транзакции через Outbox.
- **Когда использовать**: Для отправки внешних HTTP-уведомлений партнёрам и ERP после фиксации заказов и платежей.
- **Когда НЕ использовать и риски**: При наличии секретов PII/PCI ставьте `includeFullPayload = false` и защищайтесь от SSRF.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Нет (Опционально) | Массив из нуля или более допустимых значений: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | События, запускающие отправку HMAC-подписанных вебхуков.<br/>*Примечание:* Отправляется асинхронно после коммита (`AFTER_COMMIT`), исключая ложные вебхуки при откате транзакции. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Нет (Опционально) | Корректное имя HTTP-заголовка (регистронезависимое в сети, напр. `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | HTTP-заголовок с подписью HMAC-SHA256.<br/>*Примечание:* Содержит HMAC-SHA256 подпись тела; получатель обязан проверять её в постоянном времени. |
| `includeFullPayload` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@EntityWebhook(includeFullPayload = false)` | true включает JSON сущности; false — только ID и тип события.<br/>*Примечание:* Ставьте `false` (только ID и тип события) для PII/финансов, чтобы подписчик добирал данные через защищённый GET. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Пакет**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Публикует конверты CNCF CloudEvents v1.0 после фиксации транзакции.
- **Поведение во время выполнения**: Использует TransactionRuntimeBridge.executeAfterCommit для исключения фантомных событий.
- **Как использовать**: Ставьте на сущность или метод; слушайте `CloudEventEnvelopeDto` после коммита транзакции.
- **Когда использовать**: Для слабосвязанного взаимодействия между доменами (`order` -> `inventory`) без межтабличных JOIN.
- **Когда НЕ использовать и риски**: НЕ путайте с внешним `@EntityWebhook` и не обрабатывайте событие до коммита.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Нет (Опционально) | Непустая строка-идентификатор (напр. `"com.acme.order.lifecycle"`); `""` применяет соглашение по умолчанию.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Тип события CloudEvents (напр. "io.nwvmc.order.created").<br/>*Примечание:* Используйте reverse-DNS формат CloudEvents 1.0 (`com.company.domain.event`); `""` генерирует автоматически. |
| `source` | `String` | `""` | Нет (Опционально) | Корректный HTTP-путь, начинающийся с `/` (напр. `/services/order-api`), или пустая строка `""` для автоопределения.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` в CloudEvents, указывающий на модуль-отправитель.<br/>*Примечание:* Заполняет URI-атрибут `source` стандарта CNCF CloudEvents для трассировки между микросервисами. |
| `publishOnCreate` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Публиковать CloudEvent после создания (true).<br/>*Примечание:* Публикуется строго после коммита (`AFTER_COMMIT`) через Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Публиковать CloudEvent после обновления (true).<br/>*Примечание:* Ставьте `false` для часто обновляемых сущностей (счётчиков), чтобы не перегружать брокер сообщений. |
| `publishOnDelete` | `boolean` | `true` | Нет (Опционально) | `true` (включено) или `false` (отключено).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Публиковать CloudEvent после удаления (true).<br/>*Примечание:* Срабатывает как при физическом удалении, так и при `@SoftDelete`, синхронизируя проекции чтения. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Пакет**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Привязывает операции сущности или запроса к логическому ключу источника данных.
- **Поведение во время выполнения**: Фиксирует счётчики маршрутизации в framework.datasource.routing.total.
- **Как использовать**: Ставьте на контроллеры и не-`final` сервисы; контекст сбрасывается автоматически.
- **Когда использовать**: Для разделения чтения/записи (CQRS) и выноса тяжёлых отчётов на реплику `REPLICA`.
- **Когда НЕ использовать и риски**: НЕ переключайте источник внутри уже открытой `@Transactional` транзакции и на `final`-классе!

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Нет (Опционально) | Одно из поддерживаемых значений: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Ключ источника данных в `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Примечание:* Должно совпадать с ключом в `DynamicRoutingDataSource`; неизвестный ключ откатится на `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Пакет**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Назначение**: Назначает семейство СУБД и логический шард кластера для сущности.
- **Поведение во время выполнения**: Динамически разрешается через MultiPlatformDataSourceRegistryHelper и TenantDatabaseRoutingResolverHelper.
- **Как использовать**: Ставьте на JPA-сущности или методы для декларации целевой СУБД и кластера.
- **Когда использовать**: В полиглотных и шардированных системах с выделенными кластерами финансов, аналитики и аудита.
- **Когда НЕ использовать и риски**: НЕ заменяет настройку физических JDBC-пулов и не позволяет делать SQL JOIN между кластерами.

| Атрибут | Тип Java | По умолчанию | Обязательно | Допустимые значения и пример | Описание и особенности runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Нет (Опционально) | Одно из поддерживаемых значений: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Идентификатор СУБД ("H2", "POSTGRESQL", "MYSQL", "ORACLE", "REDIS").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `platform` сразу прерывают старт (fail-fast). |
| `cluster` | `String` | `"PRIMARY"` | Нет (Опционально) | Одно из поддерживаемых значений: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Кластер или шард БД ("PRIMARY", "REPLICA", "FINANCE_CLUSTER").<br/>*Примечание:* Проверяется при запуске приложения; опечатки или некорректный `cluster` сразу прерывают старт (fail-fast). |
| `readOnly` | `boolean` | `false` | Нет (Опционально) | `true` (направлять в read-only пул реплик) или `false` (направлять в основной read-write пул).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | При true задаёт маршрутизацию предпочтительно на read-only реплику.<br/>*Примечание:* Никогда не ставьте `readOnly = true` для записи (`POST`/`PUT`/`DELETE`) — read-реплики отклоняют мутации. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
