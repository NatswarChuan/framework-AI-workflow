# 06. Especificação Completa das 60 Anotações Declarativas (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/06_DECLARATIVE_ANNOTATIONS.md) | [Tiếng Việt](../vi/06_DECLARATIVE_ANNOTATIONS.md) | [日本語](../ja/06_DECLARATIVE_ANNOTATIONS.md) | [中文](../zh/06_DECLARATIVE_ANNOTATIONS.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#annotations)

Referência técnica exaustiva de todas as **60 Anotações Declarativas** de `io.github.natswarchuan:spring-nwvmc:0.1.0`, extraídas diretamente das declarações Java `@interface`: pacote exato, `@Target`, **cada atributo**, tipo Java, valor padrão, obrigatoriedade, **como usar**, **quando usar**, **quando NÃO usar e armadilhas**, além de exemplos Java verificados.

## Índice Rápido (60 Anotações)

| Anotação | Categoria | `@Target` | Resumo de Atributos | Finalidade Principal |
| :--- | :--- | :--- | :--- | :--- |
| [`@AutoRestController`](#autorestcontroller) | `routing` | `Interface (TYPE)` | `path (""), basePath (""), entityName (""), enabledEndpoints ({}), disabledEndpoints ({}), enableNestedSubResources (false), readDto (Void.class), createDto (Void.class), updateDto (Void.class)` | Transforma uma interface que estende AutoApiController<E> em proxy dinâmico JDK registrando 40 contratos (38 visíveis por padrão no Swagger UI). |
| [`@ServiceOverride`](#serviceoverride) | `routing` | `Type / Method (TYPE, METHOD)` | `targetBean (Void.class), beanName (""), methodName (""), bypassAutoDispatch (true)` | Redireciona um contrato do controlador para um método de bean Spring customizado via MethodHandleCacheUtil em vez do CRUD dinâmico. |
| [`@CustomEndpoint`](#customendpoint) | `routing` | `Method (METHOD)` | `path (""), httpMethod ("GET"), delegateBean (""), delegateMethod (""), summary (""), description ("")` | Vincula rotas de fluxo de domínio (checkout, reembolso, aprovação) a beans Spring @Component Helper independentes. |
| [`@AutoGet`](#autoget) | `routing` | `Method (METHOD)` | `value (""), produces ({})` | Substituto em Java puro para @GetMapping sem importações estáticas de Spring Web. |
| [`@AutoPost`](#autopost) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Declaração HTTP POST em Java puro com suporte a media types consumes/produces customizados. |
| [`@AutoPut`](#autoput) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Mapeamento HTTP PUT em Java puro para substituição completa de recursos. |
| [`@AutoPatch`](#autopatch) | `routing` | `Method (METHOD)` | `value (""), consumes ({}), produces ({})` | Declaração HTTP PATCH em Java puro com merge parcial, incrementos atômicos e RFC 6902 JSON Patch. |
| [`@AutoDelete`](#autodelete) | `routing` | `Method (METHOD)` | `value ("")` | Declaração HTTP DELETE em Java puro que aciona exclusão lógica protegida por estado. |
| [`@AutoParam`](#autoparam) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true), defaultValue (DEFAULT_NONE)` | Vincula parâmetros de consulta da URL ou mapas dinâmicos Map<String, String>. |
| [`@AutoVariable`](#autovariable) | `routing` | `Parameter (PARAMETER)` | `value (""), name (""), required (true)` | Vincula variáveis de caminho URI como IDs UUIDv7 de entidades. |
| [`@AutoBody`](#autobody) | `routing` | `Parameter (PARAMETER)` | `required (true)` | Desserializa payloads JSON HTTP em parâmetros DTO ou Entidade combinados com @Valid. |
| [`@EnableNestedSubResource`](#enablenestedsubresource) | `routing` | `Type / Method (TYPE, METHOD)` | `targetEntities ({}), allowedRelationships ({})` | Permite navegação recursiva em relacionamentos filhos via GET /{id}/{relation}/** bloqueando ciclos. |
| [`@BusinessAction`](#businessaction) | `routing` | `Method (METHOD)` | `targetStateField (""), targetStateValue (""), adjustNumericField (""), deltaParamIndex (-1), fixedDelta (""), entityMethod ("")` | Declara transições de estado de domínio ou ajustes numéricos em métodos de ação customizados. |
| [`@AutoComponent`](#autocomponent) | `bean` | `Class (TYPE)` | `value ("")` | Marcador de componente registrado na inicialização sem importar @Component em compilação. |
| [`@AutoService`](#autoservice) | `bean` | `Class (TYPE)` | `value ("")` | Estereótipo de camada de serviço para classes ServiceImpl pareadas com @ServiceOverride. |
| [`@AutoBean`](#autobean) | `bean` | `Method (METHOD)` | `value ({}), targetTypeName (""), primary (false)` | Declara métodos fábrica de beans gerenciados dentro de classes @AutoConfigurationBean. |
| [`@AutoConfigurationBean`](#autoconfigurationbean) | `bean` | `Class (TYPE)` | `value (""), prefix ("")` | Marca classes de configuração e modelos vinculados a propriedades YAML. |
| [`@OrderPriority`](#orderpriority) | `bean` | `Class / Method / Field (TYPE, METHOD, FIELD)` | `value (Integer.MAX_VALUE)` | Controla a ordem de prioridade de execução entre beans SPI Customizer e cadeias de filtros. |
| [`@EntitySecurity`](#entitysecurity) | `entity` | `Class (TYPE)` | `readRoles ({}), writeRoles ({}), deleteRoles ({}), permitAll (false), ownerField (""), bypassOwnerRoles ({"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}), permissions ({})` | Aplica RBAC NIST Nível 2, isolamento por ownerField e códigos de permissão antes de consultar ou alterar entidades. |
| [`@FieldSecurity`](#fieldsecurity) | `entity` | `Field (FIELD)` | `viewRoles ({}), maskPattern ("******"), nullifyInsteadOfMask (false)` | Mascara ou anula colunas sensíveis dinamicamente quando os papéis não possuem permissão. |
| [`@StateMachine`](#statemachine) | `entity` | `Field (FIELD)` | `initial ("ACTIVE"), transitions ({}), deletableStates ({})` | Impõe transições permitidas via POST /{id}/transition e restringe DELETE /{id} a deletableStates. |
| [`@HumanPolicy`](#humanpolicy) | `entity` | `Class (TYPE)` | `lifecycle (""), security (""), masking (""), stateField ("")` | Compila cláusulas legíveis de política em regras ativas de RBAC, transição e mascaramento. |
| [`@AuditTrail`](#audittrail) | `entity` | `Class (TYPE)` | `category (""), recordFieldDiffs (true)` | Registra diferenças por campo entre mutações para reconstrução Time-Travel e inspeção /diff. |
| [`@MultiTenant`](#multitenant) | `entity` | `Class (TYPE)` | `tenantField ("tenantId"), bypassTenantRoles ({"ROLE_SUPER_ADMIN"})` | Isola consultas e mutações automaticamente por inquilino ativo, exceto para papéis de bypass. |
| [`@UniqueField`](#uniquefield) | `entity` | `Field (FIELD)` | `(Anotação marcadora — sem atributos)` | Valida unicidade antes da persistência em create, update e upsert. |
| [`@AutoCode`](#autocode) | `entity` | `Field (FIELD)` | `prefix (OBRIGATÓRIO)` | Gera automaticamente códigos de negócio únicos com prefixo na criação ou clonagem quando em branco. |
| [`@AutoSlug`](#autoslug) | `entity` | `Field (FIELD)` | `sourceField (OBRIGATÓRIO)` | Sintetiza automaticamente slugs ASCII amigáveis para URL a partir de sourceField. |
| [`@ComputedField`](#computedfield) | `entity` | `Field (FIELD)` | `operation ("MULTIPLY"), sourceFields ({}), collectionField (""), itemField (""), subtractField (""), addField ("")` | Calcula totais numéricos derivados antes de salvar alterações na entidade. |
| [`@CustomQuery`](#customquery) | `entity` | `Method (METHOD)` | `value (""), nativeQuery (true), resultClass (Void.class), sqlProvider (Void.class), providerMethod (""), modifying (false)` | Permite vincular consultas SQL/JPQL customizadas ou métodos provedores a endpoints do controlador. |
| [`@SecurityRoleEntity`](#securityroleentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Designa uma entidade JPA como tabela de catálogo ativa de papéis RBAC no banco de dados. |
| [`@RoleCode`](#rolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia a coluna do código único de papel dentro de uma entidade @SecurityRoleEntity. |
| [`@RoleName`](#rolename) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Identifica o campo de nome legível do papel em uma entidade @SecurityRoleEntity. |
| [`@RolePermissions`](#rolepermissions) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Marca o campo coleção ou string CSV com os códigos de permissão concedidos a um papel. |
| [`@SecurityPermissionEntity`](#securitypermissionentity) | `rbac` | `Entity (TYPE)` | `cacheTtlSeconds (60L)` | Marca uma entidade JPA que armazena permissões recurso-ação e regras dinâmicas de mascaramento. |
| [`@PermissionCode`](#permissioncode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Designa o campo identificador único da permissão dentro de @SecurityPermissionEntity. |
| [`@PermissionResource`](#permissionresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia o nome da entidade ou recurso API alvo (ou curinga *) em @SecurityPermissionEntity. |
| [`@PermissionAction`](#permissionaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia o verbo de ação CRUD ou customizado protegido por @SecurityPermissionEntity. |
| [`@PermissionFieldMask`](#permissionfieldmask) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Declara campos separados por vírgula que devem ser ocultados dinamicamente por esta regra. |
| [`@SecurityUserRoleEntity`](#securityuserroleentity) | `rbac` | `Entity (TYPE)` | `enabled (true)` | Mapeia a entidade JPA que vincula sujeitos autenticados a papéis do banco e escopo de inquilino. |
| [`@UserRoleSubject`](#userrolesubject) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Identifica o campo sujeito / nome de usuário principal em @SecurityUserRoleEntity. |
| [`@UserRoleCode`](#userrolecode) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Vincula a coluna do código de papel atribuído dentro de @SecurityUserRoleEntity. |
| [`@UserRoleTenantId`](#userroletenantid) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Delimita uma atribuição @SecurityUserRoleEntity a um ID de inquilino específico (ou * global). |
| [`@SecurityPolicyEntity`](#securitypolicyentity) | `rbac` | `Entity (TYPE)` | `priority (100)` | Marca uma entidade JPA que armazena políticas explícitas ALLOW / DENY ordenadas por priority. |
| [`@PolicyResource`](#policyresource) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia o padrão identificador do recurso alvo em @SecurityPolicyEntity. |
| [`@PolicyAction`](#policyaction) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia o verbo de operação protegido (READ, WRITE, DELETE, methodName, *) em @SecurityPolicyEntity. |
| [`@PolicyAllowedRoles`](#policyallowedroles) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Mapeia a coleção ou lista separada por vírgulas de papéis alvo da regra @SecurityPolicyEntity. |
| [`@PolicyEffect`](#policyeffect) | `rbac` | `Field / Method (FIELD, METHOD)` | `(Anotação marcadora — sem atributos)` | Especifica o resultado de decisão ALLOW ou DENY em uma regra @SecurityPolicyEntity. |
| [`@DistributedLock`](#distributedlock) | `resilience` | `Method (METHOD)` | `key (""), waitTimeMs (3000L), leaseTimeMs (5000L)` | Serializa acessos concorrentes em chaves SpEL em cache AST (padrão waitTimeMs=3000L, leaseTimeMs=5000L). |
| [`@Idempotent`](#idempotent) | `resilience` | `Type / Method (TYPE, METHOD)` | `headerName ("X-Idempotency-Key"), ttlSeconds (300L)` | Evita gravações duplicadas concorrentes ou reenviadas dentro de janelas TTL configuráveis. |
| [`@RateLimit`](#ratelimit) | `resilience` | `Type / Method (TYPE, METHOD)` | `requests (60), windowSeconds (60), partitionKey ("IP")` | Aplica limitação de taxa em janela deslizante por partição de IP, Usuário ou Inquilino. |
| [`@EntityCircuitBreaker`](#entitycircuitbreaker) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), failureRateThreshold (50.0f), waitDurationInOpenStateSeconds (10), slidingWindowSize (20), permittedNumberOfCallsInHalfOpenState (5)` | Envolve operações em Circuit Breakers Resilience4j enviando telemetria para Actuator e Micrometer. |
| [`@EntityRetry`](#entityretry) | `resilience` | `Type / Method (TYPE, METHOD)` | `name (""), maxAttempts (3), waitDurationMs (500L), backoffMultiplier (2.0d)` | Repete automaticamente falhas transitórias com backoff exponencial configurável. |
| [`@HttpCacheable`](#httpcacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `maxAgeSeconds (60), isPrivate (false), mustRevalidate (true), generateETag (true)` | Calcula ETags fracos RFC 7232 (W/"...") e emite Cache-Control com respostas HTTP 304 Not Modified. |
| [`@AutoCacheable`](#autocacheable) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key ("")` | Faz cache de saídas de métodos de leitura no servidor em Caffeine L1 / Redis L2. |
| [`@AutoCacheEvict`](#autocacheevict) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ({}), key (""), allEntries (false)` | Remove entradas obsoletas do cache do servidor após mutações. |
| [`@TrackExecutionTime`](#trackexecutiontime) | `resilience` | `Type / Method (TYPE, METHOD)` | `warningThresholdMs (500L)` | Mede o tempo de execução e emite logs WARN quando chamadas lentas excedem o limite. |
| [`@EntityWebhook`](#entitywebhook) | `resilience` | `Class (TYPE)` | `events ({"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}), secretHeader ("X-Webhook-Signature"), includeFullPayload (true)` | Envia webhooks de saída assinados com HMAC-SHA256 de forma assíncrona em Virtual Threads após commit. |
| [`@PublishCloudEvent`](#publishcloudevent) | `resilience` | `Type / Method (TYPE, METHOD)` | `eventType (""), source (""), publishOnCreate (true), publishOnUpdate (true), publishOnDelete (true)` | Publica envelopes CNCF CloudEvents v1.0 após o commit da transação. |
| [`@TargetDataSource`](#targetdatasource) | `resilience` | `Type / Method (TYPE, METHOD)` | `value ("PRIMARY")` | Fixa operações de entidade ou consulta a uma chave lógica de fonte de dados. |
| [`@TargetDatabasePlatform`](#targetdatabaseplatform) | `resilience` | `Type / Method (TYPE, METHOD)` | `platform ("H2"), cluster ("PRIMARY"), readOnly (false)` | Atribui família de motor de banco e shard de cluster lógico por entidade. |

---

## 1. Roteamento, Contratos API Dinâmicos, Desacoplamento DTO e Parâmetros (13 Anotações)

### `@AutoRestController`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Interface (TYPE)`
- **Finalidade**: Transforma uma interface que estende AutoApiController<E> em proxy dinâmico JDK registrando 40 contratos (38 visíveis por padrão no Swagger UI).
- **Comportamento em Execução**: DynamicControllerProxyRegistrarHelper varre controladores habilitados na inicialização e registra rotas em RequestMappingHandlerMapping.
- **Como Usar**: Aplique `@AutoRestController(basePath = "/api/v1/...")` em uma interface Java que estenda `AutoApiController<E>` ou `AutoReadApi<E>` e defina DTOs/restrições.
- **Quando Usar**: Use para expor CRUD padrão, paginação, filtros, keyset, analítica ou endpoints somente-leitura para uma entidade JPA.
- **Quando NÃO Usar e Cuidados**: NÃO use em classes concretas `@RestController` ou fluxos sem entidade JPA; prefira `AutoReadApi<E>` para catálogos somente leitura.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `basePath` | `String` | `""` | Não (Opcional) | Caminho HTTP válido iniciado com `/` (ex.: `/api/v1/product-catalogs`) ou string vazia `""` para derivação automática.<br/>`@AutoRestController(basePath = "/api/v1/product-catalogs")` | Caminho URI raiz explícito (ex. "/api/v1/product-catalogs"). Vazio por padrão, derivado em kebab-case plural.<br/>*Atenção:* Na inicialização o registrador avalia `basePath` antes de `path`. Evite valores conflitantes nos dois. |
| `path` | `String` | `""` | Não (Opcional) | Caminho HTTP válido iniciado com `/` (ex.: `/api/v1/orders`) ou string vazia `""` para derivação automática.<br/>`@AutoRestController(path = "/api/v1/orders")` | Atributo alias alternativo. Prefira basePath, priorizado por DynamicControllerProxyRegistrarHelper.<br/>*Atenção:* Na inicialização o registrador avalia `basePath` antes de `path`. Evite valores conflitantes nos dois. |
| `entityName` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"ProductCatalog"`); deixe `""` para usar a convenção padrão.<br/>`@AutoRestController(entityName = "ProductCatalog")` | Sobrescreve o nome da entidade exibido no OpenAPI/Studio em vez do nome simples de E.<br/>*Atenção:* Exibido diretamente no Swagger / OpenAPI 3.0 e NWVMC Studio; extraia textos para `OpenApiConstant` sem hard-code. |
| `enabledEndpoints` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `"getPage"`, `"getById"`, `"create"`, `"update"`, `"patch"`, `"deleteById"`, `"getKeysetPage"`, `"count"`, `"exportCsv"`, `"importCsv"`.<br/>`@AutoRestController(enabledEndpoints = {"getPage", "getById", "create"})` | Lista branca de nomes exatos de métodos (ex. "getPage", "create"). Vazio habilita todos.<br/>*Atenção:* Funciona como lista branca estrita: quando preenchida, qualquer método omitido não é registrado no Spring MVC nem no Swagger UI. |
| `disabledEndpoints` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `"deleteById"`, `"updateBatchByFilter"`, `"batchChunked"`, `"importCsv"`, `"streamEvents"`.<br/>`@AutoRestController(disabledEndpoints = {"deleteById", "updateBatchByFilter", "importCsv"})` | Lista negra desativando métodos específicos antes do mapeamento MVC.<br/>*Atenção:* Avaliado após `enabledEndpoints`; bloqueia endpoints destrutivos ou em lote mantendo o restante dos 40 contratos. |
| `enableNestedSubResources` | `boolean` | `false` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@AutoRestController(basePath = "/api/v1/orders", enableNestedSubResources = true)` | Habilita navegação recursiva GET /{id}/**. Padrão false evita excesso de rotas.<br/>*Atenção:* Mantenha `false` salvo necessidade de `GET /{id}/items/...`; ao ativar, restrinja relacionamentos com `@EnableNestedSubResource`. |
| `readDto` | `Class<?>` | `Void.class` | Não (Opcional) | Qualquer classe Java concreta (ex.: `ProductReadDto.class`) ou `Void.class` para desativar o mapeamento DTO.<br/>`@AutoRestController(readDto = ProductReadDto.class)` | DTO de leitura opcional ocultando campos internos da entidade na serialização.<br/>*Atenção:* Aplica-se apenas ao fluxo leitura (GET); a classe DTO precisa de construtor padrão/getters (ou `@Builder`) e respeita `@Valid`. |
| `createDto` | `Class<?>` | `Void.class` | Não (Opcional) | Qualquer classe Java concreta (ex.: `ProductCreateDto.class`) ou `Void.class` para desativar o mapeamento DTO.<br/>`@AutoRestController(createDto = ProductCreateDto.class)` | DTO de criação opcional validado com Jakarta Validation antes do POST na entidade.<br/>*Atenção:* Aplica-se apenas ao fluxo criação (POST); a classe DTO precisa de construtor padrão/getters (ou `@Builder`) e respeita `@Valid`. |
| `updateDto` | `Class<?>` | `Void.class` | Não (Opcional) | Qualquer classe Java concreta (ex.: `ProductUpdateDto.class`) ou `Void.class` para desativar o mapeamento DTO.<br/>`@AutoRestController(updateDto = ProductUpdateDto.class)` | DTO de atualização opcional restringindo campos graváveis em PUT e PATCH.<br/>*Atenção:* Aplica-se apenas ao fluxo atualização (PUT/PATCH); a classe DTO precisa de construtor padrão/getters (ou `@Builder`) e respeita `@Valid`. |

```java
@AutoRestController(
    basePath = "/api/v1/product-catalogs",
    disabledEndpoints = {"batchChunked"},
    enableNestedSubResources = true
)
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {}
```

### `@ServiceOverride`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Redireciona um contrato do controlador para um método de bean Spring customizado via MethodHandleCacheUtil em vez do CRUD dinâmico.
- **Comportamento em Execução**: EscapeHatchDispatchHelper resolve o bean de destino (por targetBean ou beanName) e guarda o MethodHandle em cache.
- **Como Usar**: Anote o método desejado na interface com `@ServiceOverride(targetBean = MyHelper.class, methodName = "customMethod")` e registre a classe com `@Service`/`@Component`.
- **Quando Usar**: Use quando a maioria dos endpoints é padrão, mas um método específico exige código Java sob medida.
- **Quando NÃO Usar e Cuidados**: NÃO passe strings em `targetBean` (exige `Class<?>`; use `beanName`). Evite se regras declarativas bastarem.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetBean` | `Class<?>` | `Void.class` | Não (Opcional) | Classe concreta de bean Spring `@Service`/`@Component` (ex.: `OrderCustomService.class`), ou `Void.class` para resolver via `beanName`.<br/>`@ServiceOverride(targetBean = OrderCustomService.class, methodName = "createOrder")` | Classe do bean Spring alvo (tem precedência sobre beanName).<br/>*Atenção:* Na inicialização o registrador avalia `targetBean` antes de `beanName`. Evite valores conflitantes nos dois. |
| `beanName` | `String` | `""` | Não (Opcional) | Nome exato do bean registrado no ApplicationContext (ex.: `"orderCustomService"`) ou `""` para resolução automática.<br/>`@ServiceOverride(beanName = "orderCustomService", methodName = "createOrder")` | Nome explícito do bean no Spring quando targetBean for Void.class.<br/>*Atenção:* Na inicialização o registrador avalia `targetBean` antes de `beanName`. Evite valores conflitantes nos dois. |
| `methodName` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"createOrder"`); deixe `""` para usar a convenção padrão.<br/>`@ServiceOverride(targetBean = OrderService.class, methodName = "createOrder")` | Nome do método no bean destino; vazio usa o mesmo nome do método no controlador.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"createOrder"`); divergências causam erro em runtime. |
| `bypassAutoDispatch` | `boolean` | `true` | Não (Opcional) | `true` (padrão — ativa a sobrescrita e chama o bean alvo) ou `false` (desativa a sobrescrita e executa o CRUD padrão).<br/>`@ServiceOverride(targetBean = OrderService.class, bypassAutoDispatch = true)` | Quando true, ignora o despacho CRUD padrão e executa o bean via MethodHandleCacheUtil.<br/>*Atenção:* Em `true` (padrão), `EscapeHatchDispatchHelper` invoca seu bean. Definir `false` desativa `@ServiceOverride` por completo e executa o CRUD padrão (NÃO é um hook pré/pós). |

```java
@ServiceOverride(targetBean = TagEscapeHatchHelper.class, methodName = "buildTaxonomyStats")
@AutoGet("/showcase/escape-hatch-stats")
ApiResponse<Map<String, String>> getTaxonomyEscapeHatchStats();
```

### `@CustomEndpoint`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Vincula rotas de fluxo de domínio (checkout, reembolso, aprovação) a beans Spring @Component Helper independentes.
- **Comportamento em Execução**: Invoca delegateBean.delegateMethod via MethodHandle em cache com validação completa e transação.
- **Como Usar**: Declare um método na interface com `path`, `httpMethod`, `delegateBean` e `delegateMethod` direcionando para um helper Spring.
- **Quando Usar**: Use para ações ricas de domínio como checkout, reembolso, aprovação ou orquestração multi-entidade.
- **Quando NÃO Usar e Cuidados**: NÃO dependa de interceptadores de proxy aqui (o despacho ocorre antes via `ControllerProxySpecialRouteUtil`); aplique Spring AOP/segurança no bean `@Component`/`@Service` delegado e prefira `@BusinessAction` para transições simples.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `path` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/reports/monthly-sales`); `""` vincula à raiz.<br/>`@CustomEndpoint(path = "/reports/monthly-sales", httpMethod = "GET")` | Caminho relativo sob o basePath do controlador (ex. "/checkout").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `path` inválidos falham rapidamente antes de aceitar tráfego. |
| `httpMethod` | `String` | `"GET"` | Não (Opcional) | Um dos valores suportados: `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`.<br/>`@CustomEndpoint(path = "/approve", httpMethod = "POST", delegateBean = "orderApprovalService")` | Verbo HTTP esperado ("GET", "POST", "PUT", "PATCH", "DELETE").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `httpMethod` inválidos falham rapidamente antes de aceitar tráfego. |
| `delegateBean` | `String` | `""` | Não (Opcional) | Nome exato do bean registrado no ApplicationContext (ex.: `"orderReportService"`) ou `""` para resolução automática.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildReport")` | Nome do bean Spring responsável pelo fluxo (obrigatório salvo método default ou @ServiceOverride).<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `delegateBean` inválidos falham rapidamente antes de aceitar tráfego. |
| `delegateMethod` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"buildMonthlyReport"`); deixe `""` para usar a convenção padrão.<br/>`@CustomEndpoint(path = "/export", delegateBean = "orderReportService", delegateMethod = "buildMonthlyReport")` | Nome do método em delegateBean; vazio herda o nome no controlador.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"buildMonthlyReport"`); divergências causam erro em runtime. |
| `summary` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"Get monthly revenue breakdown"`); deixe `""` para usar a convenção padrão.<br/>`@CustomEndpoint(path = "/revenue", summary = OpenApiConstant.SUM_MONTHLY_REVENUE)` | Resumo curto da operação OpenAPI 3.0 exibido no Swagger UI.<br/>*Atenção:* Exibido diretamente no Swagger / OpenAPI 3.0 e NWVMC Studio; extraia textos para `OpenApiConstant` sem hard-code. |
| `description` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"Aggregates confirmed invoice totals grouped by currency"`); deixe `""` para usar a convenção padrão.<br/>`@CustomEndpoint(path = "/revenue", description = OpenApiConstant.DESC_MONTHLY_REVENUE)` | Descrição detalhada OpenAPI 3.0 exibida ao expandir a rota no Swagger UI.<br/>*Atenção:* Exibido diretamente no Swagger / OpenAPI 3.0 e NWVMC Studio; extraia textos para `OpenApiConstant` sem hard-code. |

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

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Substituto em Java puro para @GetMapping sem importações estáticas de Spring Web.
- **Comportamento em Execução**: Mapeado para RequestMappingInfo HTTP GET na inicialização do proxy.
- **Como Usar**: Adicione `@AutoGet("/caminho")` em um método de `@AutoRestController` (geralmente com `@ServiceOverride` ou `@CustomQuery`).
- **Quando Usar**: Use para rotas HTTP GET de leitura em interfaces Java puras sem importar `@GetMapping`.
- **Quando NÃO Usar e Cuidados**: NÃO use em operações que alteram estado no banco ou em classes `@RestController` convencionais.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/{id}/summary`); `""` vincula à raiz.<br/>`@AutoGet("/{id}/summary")` | Template de rota GET relativo (ex. "/metrics"). Vazio mapeia no basePath raiz.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `produces` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json", "text/csv"}`); `{}` vazio adota `application/json`.<br/>`@AutoGet(value = "/export", produces = {"text/csv"})` | Tipos MIME produzidos opcionalmente (ex. "text/event-stream", "text/csv").<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Accept`; divergências retornam `406` ou `415`. |

```java
@AutoGet("/keyset")
ApiResponse<PageResponse<E>> getKeysetPage(...);
```

### `@AutoPost`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Declaração HTTP POST em Java puro com suporte a media types consumes/produces customizados.
- **Comportamento em Execução**: Registrado como manipulador HTTP POST no SpringMvcEndpointBridge.
- **Como Usar**: Anote um método de criação/ação com `@AutoPost("/caminho")` usando `@AutoBody` ou `@RequestBody` junto a `@BusinessAction` ou `@ServiceOverride`.
- **Quando Usar**: Use para endpoints de criação, comandos de negócio ou envio em lote em interfaces Java puras.
- **Quando NÃO Usar e Cuidados**: NÃO use para consultas de leitura (`@AutoGet`), substituições completas (`@AutoPut`) ou exclusões (`@AutoDelete`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/{id}/approve`); `""` vincula à raiz.<br/>`@AutoPost("/{id}/approve")` | Template de caminho POST relativo ao basePath.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `consumes` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json", "multipart/form-data"}`); `{}` vazio adota `application/json`.<br/>`@AutoPost(value = "/upload", consumes = {"multipart/form-data"})` | Tipos Content-Type aceitos na requisição.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Content-Type`; divergências retornam `406` ou `415`. |
| `produces` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json"}`); `{}` vazio adota `application/json`.<br/>`@AutoPost(value = "/calculate", produces = {"application/json"})` | Tipos de mídia produzidos na resposta.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Accept`; divergências retornam `406` ou `415`. |

```java
@AutoPost(ApiEndpointConstant.PATH_UPSERT)
ApiResponse<E> upsert(@Valid @AutoBody E entity);
```

### `@AutoPut`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Mapeamento HTTP PUT em Java puro para substituição completa de recursos.
- **Comportamento em Execução**: Vinculado como manipulador HTTP PUT dentro de execução transacional.
- **Como Usar**: Aplique `@AutoPut("/{id}")` em métodos de substituição completa com `@AutoVariable` e `@AutoBody`.
- **Quando Usar**: Use para substituição completa e idempotente de recursos com payload integral.
- **Quando NÃO Usar e Cuidados**: NÃO use para atualizações parciais de poucos campos (`@AutoPatch` ou `@BusinessAction`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/{id}/replace`); `""` vincula à raiz.<br/>`@AutoPut("/{id}/replace")` | Template de caminho PUT relativo (ex. "/{id}").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `consumes` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json"}`); `{}` vazio adota `application/json`.<br/>`@AutoPut(value = "/{id}", consumes = {"application/json"})` | Tipos Content-Type aceitos na requisição.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Content-Type`; divergências retornam `406` ou `415`. |
| `produces` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json"}`); `{}` vazio adota `application/json`.<br/>`@AutoPut(value = "/{id}", produces = {"application/json"})` | Tipos de mídia produzidos na resposta.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Accept`; divergências retornam `406` ou `415`. |

```java
@AutoPut("/{id}")
ApiResponse<E> update(@AutoVariable("id") UUID id, @Valid @AutoBody E entity);
```

### `@AutoPatch`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Declaração HTTP PATCH em Java puro com merge parcial, incrementos atômicos e RFC 6902 JSON Patch.
- **Comportamento em Execução**: Suporta semântica de merge JSON e application/json-patch+json.
- **Como Usar**: Use `@AutoPatch("/{id}/acao")` em métodos de atualização parcial ou `@BusinessAction`.
- **Quando Usar**: Use para mutações parciais, ajustes numéricos atômicos e transições de estado.
- **Quando NÃO Usar e Cuidados**: NÃO use quando a entidade inteira precisar ser substituída (`@AutoPut`) ou criada (`@AutoPost`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/{id}/status`); `""` vincula à raiz.<br/>`@AutoPatch("/{id}/status")` | Template de caminho PATCH relativo (ex. "/{id}/approve").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `consumes` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json", "application/merge-patch+json"}`); `{}` vazio adota `application/json`.<br/>`@AutoPatch(value = "/{id}", consumes = {"application/merge-patch+json"})` | Tipos Content-Type aceitos.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Content-Type`; divergências retornam `406` ou `415`. |
| `produces` | `String[]` | `{}` | Não (Opcional) | Array de tipos MIME (ex.: `{"application/json"}`); `{}` vazio adota `application/json`.<br/>`@AutoPatch(value = "/{id}", produces = {"application/json"})` | Tipos de mídia produzidos.<br/>*Atenção:* Aplicado pela negociação de conteúdo do Spring MVC no cabeçalho `Accept`; divergências retornam `406` ou `415`. |

```java
@AutoPatch("/{id}/patch-rfc6902")
ApiResponse<E> patchRfc6902(...);
```

### `@AutoDelete`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Declaração HTTP DELETE em Java puro que aciona exclusão lógica protegida por estado.
- **Comportamento em Execução**: Valida @StateMachine deletableStates antes de definir deleted=true.
- **Como Usar**: Aplique `@AutoDelete("/{id}/custom")` em exclusões personalizadas normalmente com `@ServiceOverride`.
- **Quando Usar**: Use para arquivamento, soft-delete customizado ou limpeza em cascata via DELETE.
- **Quando NÃO Usar e Cuidados**: NÃO redefina `deleteById` se o soft-delete padrão com `@StateMachine` já atender.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Subcaminho URI relativo com variáveis `{pathVar}` opcionais (ex.: `/{id}/archive`); `""` vincula à raiz.<br/>`@AutoDelete("/{id}/archive")` | Template de caminho DELETE relativo (ex. "/{id}/purge").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |

```java
@AutoDelete("/{id}")
ApiResponse<Void> deleteById(@AutoVariable("id") UUID id);
```

### `@AutoParam`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Finalidade**: Vincula parâmetros de consulta da URL ou mapas dinâmicos Map<String, String>.
- **Comportamento em Execução**: Extraído via DynamicQueryParameterParserHelper com validação em QueryGuardrailEnforcerUtil.
- **Como Usar**: Aplique nos parâmetros do método: `@AutoParam(name = "status", required = false, defaultValue = "ACTIVE")`.
- **Quando Usar**: Use para manter interfaces 100% Pure Java sem importar Spring Web ao ler query params.
- **Quando NÃO Usar e Cuidados**: NÃO use para variáveis de caminho (`@AutoVariable`) nem corpo JSON (`@AutoBody`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"status"`); deixe `""` para usar a convenção padrão.<br/>`@AutoParam("status") String status` | Nome do parâmetro de query; vazio usa o nome do parâmetro Java.<br/>*Atenção:* Na inicialização o registrador avalia `value` antes de `name`. Evite valores conflitantes nos dois. |
| `name` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"pageSize"`); deixe `""` para usar a convenção padrão.<br/>`@AutoParam(name = "pageSize", required = false, defaultValue = "20") int size` | Nome explícito do parâmetro de consulta.<br/>*Atenção:* Na inicialização o registrador avalia `value` antes de `name`. Evite valores conflitantes nos dois. |
| `required` | `boolean` | `true` | Não (Opcional) | `true` (obrigatório; ausente retorna HTTP 400) ou `false` (opcional; passa null se omitido).<br/>`@AutoParam(name = "keyword", required = false) String keyword` | Indica se a ausência do parâmetro gera HTTP 400.<br/>*Atenção:* Torna-se opcional automaticamente ao informar `defaultValue`; com `false`, prefira wrappers (`Integer`, `Boolean`) a primitivos. |
| `defaultValue` | `String` | `DEFAULT_NONE sentinel` | Não (Opcional) | String identificadora não vazia (ex.: `"20"`); deixe `""` para usar a convenção padrão.<br/>`@AutoParam(name = "limit", defaultValue = "20") int limit` | Valor padrão caso ausente; o padrão é o sentinela DEFAULT_NONE.<br/>*Atenção:* Convertido de String pelo Spring `ConversionService` para o tipo alvo; valores inválidos retornam HTTP `400`. |

```java
ApiResponse<PageResponse<E>> getPage(@AutoParam(name = "page", required = false) Integer page);
```

### `@AutoVariable`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Finalidade**: Vincula variáveis de caminho URI como IDs UUIDv7 de entidades.
- **Comportamento em Execução**: Convertido em valores Java tipados UUID/String a partir de templates de caminho MVC.
- **Como Usar**: Anote parâmetros de ID na rota como `findById(@AutoVariable("id") UUID id)`.
- **Quando Usar**: Use ao extrair `{id}` ou `{code}` de templates URI em interfaces Pure Java.
- **Quando NÃO Usar e Cuidados**: NÃO use para query params (`@AutoParam`) nem corpo JSON (`@AutoBody`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"orderId"`); deixe `""` para usar a convenção padrão.<br/>`@AutoVariable("orderId") UUID orderId` | Nome da variável de caminho URI.<br/>*Atenção:* Na inicialização o registrador avalia `value` antes de `name`. Evite valores conflitantes nos dois. |
| `name` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"tenantCode"`); deixe `""` para usar a convenção padrão.<br/>`@AutoVariable(name = "tenantCode") String tenantCode` | Nome explícito da variável de caminho.<br/>*Atenção:* Na inicialização o registrador avalia `value` antes de `name`. Evite valores conflitantes nos dois. |
| `required` | `boolean` | `true` | Não (Opcional) | `true` (obrigatório; ausente retorna HTTP 400) ou `false` (opcional; passa null se omitido).<br/>`@AutoVariable(name = "id", required = true) UUID id` | Indica se a variável de caminho é obrigatória.<br/>*Atenção:* Deve coincidir com `{variableName}` no modelo de URI; `false` só faz sentido com padrões de rota opcionais. |

```java
ApiResponse<E> getById(@AutoVariable("id") UUID id);
```

### `@AutoBody`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Parameter (PARAMETER)`
- **Finalidade**: Desserializa payloads JSON HTTP em parâmetros DTO ou Entidade combinados com @Valid.
- **Comportamento em Execução**: Validado pelo LocalValidatorFactoryBean antes de entrar na transação de serviço.
- **Como Usar**: Adicione `@AutoBody` no parâmetro de payload de `@AutoPost`/`@AutoPut`/`@AutoPatch`.
- **Quando Usar**: Use ao desserializar payloads JSON para entidades ou DTOs em controladores Pure Java.
- **Quando NÃO Usar e Cuidados**: NÃO coloque em métodos GET/DELETE sem corpo, nem declare dois `@AutoBody` no mesmo método.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `required` | `boolean` | `true` | Não (Opcional) | `true` (obrigatório; ausente retorna HTTP 400) ou `false` (opcional; passa null se omitido).<br/>`@AutoBody(required = true) @Valid OrderCreateDto payload` | Indica se corpo ausente retorna HTTP 400.<br/>*Atenção:* Combine com `@Valid` para validação Jakarta antes do despacho; `false` aceita corpo HTTP vazio sem erro `400`. |

```java
ApiResponse<E> create(@Valid @AutoBody E entity);
```

### `@EnableNestedSubResource`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Permite navegação recursiva em relacionamentos filhos via GET /{id}/{relation}/** bloqueando ciclos.
- **Comportamento em Execução**: Requer @AutoRestController(enableNestedSubResources = true) no controlador.
- **Como Usar**: Habilite `enableNestedSubResources = true` no `@AutoRestController` e filtre com `@EnableNestedSubResource(allowedRelationships = {"items"})`.
- **Quando Usar**: Use quando desejar URLs aninhadas `GET /api/v1/customer-orders/{id}/items` com validação de segurança e tenant por salto.
- **Quando NÃO Usar e Cuidados**: NÃO habilite sem `allowedRelationships` em entidades altamente conectadas ou entre Bounded Contexts.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetEntities` | `Class<?>[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `OrderItem.class`, `Shipment.class` (JPA `@Entity` classes).<br/>`@EnableNestedSubResource(targetEntities = {OrderItem.class, Shipment.class})` | Whitelist opcional de entidades destino acessíveis em GET /{id}/**.<br/>*Atenção:* Array vazio libera todas as entidades filhas; liste explicitamente as classes para não expor tabelas internas. |
| `allowedRelationships` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `"items"`, `"payments"`, `"shipments"` (JPA field names).<br/>`@EnableNestedSubResource(allowedRelationships = {"items", "shipments"})` | Nomes exatos de relacionamentos JPA permitidos nas sub-rotas (ex. "items", "customer").<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"items"`); divergências causam erro em runtime. |

```java
@EnableNestedSubResource(allowedRelationships = {"items", "category"})
```

### `@BusinessAction`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Declara transições de estado de domínio ou ajustes numéricos em métodos de ação customizados.
- **Comportamento em Execução**: Executado atomicamente antes de persistir os atributos atualizados da entidade.
- **Como Usar**: Combine `@AutoPatch` com `@BusinessAction(...)` no método da interface para execução transacional.
- **Quando Usar**: Para transições (`approve`, `cancel`), incrementos numéricos ou chamadas de domínio na entidade sem escrever Service.
- **Quando NÃO Usar e Cuidados**: NÃO use para orquestração de múltiplas entidades ou chamadas externas (`@ServiceOverride` / `@CustomEndpoint`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `targetStateField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo estado de ciclo de vida (ex.: `"status"`).<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Nome do campo de estado na entidade (validado por @StateMachine se houver).<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"status"`); divergências causam erro em runtime. |
| `targetStateValue` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"APPROVED"`); deixe `""` para usar a convenção padrão.<br/>`@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")` | Novo valor de estado atribuído dentro da transação.<br/>*Atenção:* Validado automaticamente contra `@StateMachine` ou `@HumanPolicy` antes de persistir; transições inválidas sofrem rollback. |
| `adjustNumericField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo numérico (ex.: `"stockQuantity"`).<br/>`@BusinessAction(adjustNumericField = "stockQuantity", deltaParamIndex = 1)` | Propriedade numérica incrementada ou decrementada atomicamente.<br/>*Atenção:* Exige `deltaParamIndex >= 0` ou `fixedDelta` preenchido. Suporta `Integer`, `Long`, `BigDecimal` e `Double`. |
| `deltaParamIndex` | `int` | `-1` | Não (Opcional) | Um dos valores suportados: `-1` (disabled) or `0`-based method argument index (e.g., `1`).<br/>`@BusinessAction(adjustNumericField = "balance", deltaParamIndex = 1)` | Índice baseado em zero do parâmetro contendo o delta dinâmico (-1 desativa).<br/>*Atenção:* Na inicialização o registrador avalia `deltaParamIndex` antes de `fixedDelta`. Evite valores conflitantes nos dois. |
| `fixedDelta` | `String` | `""` | Não (Opcional) | Um dos valores suportados: Decimal or integer string such as `"1"`, `"-1"`, `"10.50"`.<br/>`@BusinessAction(adjustNumericField = "viewCount", fixedDelta = "1")` | String numérica fixa (ex. "100", "-1") aplicada quando deltaParamIndex não for usado.<br/>*Atenção:* Na inicialização o registrador avalia `deltaParamIndex` antes de `fixedDelta`. Evite valores conflitantes nos dois. |
| `entityMethod` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"markFulfilled"`); deixe `""` para usar a convenção padrão.<br/>`@BusinessAction(entityMethod = "markFulfilled")` | Método sem parâmetros na entidade executado dentro da mesma transação.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"markFulfilled"`); divergências causam erro em runtime. |

```java
@BusinessAction(targetStateField = "status", targetStateValue = "APPROVED")
```

---

## 2. Descoberta de Beans, Vinculação de Configuração e Ordem de Execução (5 Anotações)

### `@AutoComponent`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Marcador de componente registrado na inicialização sem importar @Component em compilação.
- **Comportamento em Execução**: Escaneamento interno ao framework (io.github.natswarchuan); aplicações devem usar @Component do Spring.
- **Como Usar**: Estereótipo interno escaneado pelo `AutoBeanFactoryRegistrarBridge` em `io.github.natswarchuan`.
- **Quando Usar**: Use APENAS ao contribuir em módulos internos do framework dentro de `io.github.natswarchuan.*`.
- **Quando NÃO Usar e Cuidados**: NUNCA use em aplicações consumidoras (`com.example.*`)! Use `@Component` do Spring para o bean ser registrado.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Nome exato do bean registrado no ApplicationContext (ex.: `"invoiceValidationHelper"`) ou `""` para resolução automática.<br/>`@AutoComponent("invoiceValidationHelper")` | Nome explícito do bean; vazio usa o nome da classe em camelCase.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |

```java
@AutoComponent
public final class FrameworkMetricsHelper {}
```

### `@AutoService`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Estereótipo de camada de serviço para classes ServiceImpl pareadas com @ServiceOverride.
- **Comportamento em Execução**: Escaneado em io.github.natswarchuan pelo nome simples da classe; serviços da aplicação devem usar Spring @Service.
- **Como Usar**: Estereótipo interno de serviço escaneado apenas em `io.github.natswarchuan`.
- **Quando Usar**: Use APENAS em serviços internos de `io.github.natswarchuan.*`.
- **Quando NÃO Usar e Cuidados**: NUNCA em serviços da sua aplicação; utilize `@Service` do Spring.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Nome exato do bean registrado no ApplicationContext (ex.: `"orderFulfillmentService"`) ou `""` para resolução automática.<br/>`@AutoService("orderFulfillmentService")` | Nome explícito opcional do bean de serviço.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |

```java
@AutoService
public class DynamicEntityCrudServiceImpl implements DynamicEntityCrudService {}
```

### `@AutoBean`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Declara métodos fábrica de beans gerenciados dentro de classes @AutoConfigurationBean.
- **Comportamento em Execução**: Processado por PureJavaBeanRegistrarBridge durante a autoconfiguração.
- **Como Usar**: Aplique em métodos fábrica dentro de classes `@AutoConfigurationBean` do framework.
- **Quando Usar**: Use APENAS em `io.github.natswarchuan.config.*` nos fontes do framework.
- **Quando NÃO Usar e Cuidados**: NÃO use em classes `@Configuration` consumidoras; utilize `@Bean` do Spring.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `{"primaryObjectMapper", "nwvmcMapper"}`.<br/>`@AutoBean(value = {"primaryRedisClient"}, primary = true)` | Nome(s) e apelidos do bean.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `targetTypeName` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"com.example.spi.PaymentGateway"`); deixe `""` para usar a convenção padrão.<br/>`@AutoBean(targetTypeName = "com.example.spi.PaymentGateway")` | FQCN opcional do tipo alvo para checagem bridge.<br/>*Atenção:* FQCN opcional quando a fábrica retorna supertipo ou proxy dinâmico; garanta a classe no classpath. |
| `primary` | `boolean` | `false` | Não (Opcional) | `true` (bean preferido quando há vários candidatos) ou `false` (prioridade padrão).<br/>`@AutoBean(primary = true)` | Marca o bean como candidato primário na injeção.<br/>*Atenção:* Declarar dois `@AutoBean(primary = true)` para o mesmo tipo gera conflito de ambiguidade na inicialização. |

```java
@AutoBean(targetTypeName = BridgeConstant.CLASS_LOCALE_RESOLVER)
public Object localeResolver() { ... }
```

### `@AutoConfigurationBean`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Marca classes de configuração e modelos vinculados a propriedades YAML.
- **Comportamento em Execução**: Registra beans de configuração e prefixos YAML com metadados completos para IDE.
- **Como Usar**: Marca classes de configuração e propriedades internas em `io.github.natswarchuan.config.*`.
- **Quando Usar**: Use APENAS no núcleo do framework como equivalente Pure Java a `@Configuration`.
- **Quando NÃO Usar e Cuidados**: NÃO use em aplicações consumidoras; use `@Configuration` do Spring.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Nome exato do bean registrado no ApplicationContext (ex.: `"storageAutoConfig"`) ou `""` para resolução automática.<br/>`@AutoConfigurationBean("storageAutoConfig")` | Identificador opcional do bean de configuração.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `prefix` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"nwvmc.storage"`); deixe `""` para usar a convenção padrão.<br/>`@AutoConfigurationBean(prefix = "nwvmc.storage")` | Prefixo YAML opcional ligado pelo `PureJavaBeanRegistrarBridge`.<br/>*Atenção:* Vincula propriedades kebab-case do `application.yml`; use com `spring-configuration-metadata.json` sem avisos na IDE. |

```java
@AutoConfigurationBean(prefix = "app.framework.query-guardrails")
public class QueryGuardrailProperties {}
```

### `@OrderPriority`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class / Method / Field (TYPE, METHOD, FIELD)`
- **Finalidade**: Controla a ordem de prioridade de execução entre beans SPI Customizer e cadeias de filtros.
- **Comportamento em Execução**: Valores inteiros menores executam primeiro (padrão Integer.MAX_VALUE).
- **Como Usar**: Adicione `@OrderPriority(1)` em customizers ou componentes ordenáveis.
- **Quando Usar**: Quando a ordem determinística entre múltiplos customizers SPI ou filtros for importante.
- **Quando NÃO Usar e Cuidados**: NÃO confunda com ordenação SQL (`?sort=`) ou filtros Security.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `int` | `Integer.MAX_VALUE` | Não (Opcional) | Um dos valores suportados: Any signed `int` (`Integer.MIN_VALUE` = highest priority, `Integer.MAX_VALUE` = lowest).<br/>`@OrderPriority(10)` | Inteiro de precedência; valores menores executam primeiro.<br/>*Atenção:* Números menores executam PRIMEIRO (igual ao Spring `@Order`). Reserve `< 0` para segurança/rastreamento e `10..100` para negócio. |

```java
@OrderPriority(10)
public class TenantSecurityCustomizer implements SecurityIdentityCustomizer {}
```

---

## 3. Segurança de Entidade, Máquina de Estados, Integridade, Geradores e Consultas (11 Anotações)

### `@EntitySecurity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Aplica RBAC NIST Nível 2, isolamento por ownerField e códigos de permissão antes de consultar ou alterar entidades.
- **Comportamento em Execução**: Avaliado antes da execução SQL; acessos não autorizados lançam HTTP 403 Forbidden.
- **Como Usar**: Aplique na `@Entity` configurando papéis de leitura/escrita/exclusão e `ownerField`.
- **Quando Usar**: Use em TODA entidade exposta para unificar segurança em REST, lote, exportação e GraphQL.
- **Quando NÃO Usar e Cuidados**: NÃO ative `permitAll = true` em `AutoApiController<E>` completo sem `AutoReadApi<E>`, `disabledEndpoints` ou `@SecurityPolicyEntity` (ele ignora checagens em READ, WRITE e DELETE).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `readRoles` | `String[]` | `{}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_USER", "ROLE_ADMIN"}`); `{}` vazio não adiciona restrição própria.<br/>`@EntitySecurity(readRoles = {"ROLE_USER", "ROLE_ADMIN"})` | Perfis autorizados a ler registros (GET, GraphQL, exportação).<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |
| `writeRoles` | `String[]` | `{}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_MANAGER", "ROLE_ADMIN"}`); `{}` vazio não adiciona restrição própria.<br/>`@EntitySecurity(writeRoles = {"ROLE_MANAGER", "ROLE_ADMIN"})` | Perfis autorizados para escrita (POST/PUT/PATCH/import/batch).<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |
| `deleteRoles` | `String[]` | `{}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vazio não adiciona restrição própria.<br/>`@EntitySecurity(deleteRoles = {"ROLE_ADMIN"})` | Perfis autorizados para DELETE e exclusão em lote.<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |
| `permitAll` | `boolean` | `false` | Não (Opcional) | `true` (permitir acesso público sem autenticação) ou `false` (exigir autenticação e verificação de papéis).<br/>`@EntitySecurity(permitAll = true)` | Se true (e sem política DB-RBAC), ignora checagens de @EntitySecurity em READ, WRITE e DELETE; combine com AutoReadApi<E> ou disabledEndpoints.<br/>*Atenção:* Sobrepõe `readRoles`/`writeRoles`/`deleteRoles` permitindo acesso anônimo. Nunca use em dados pessoais ou financeiros. |
| `ownerField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo proprietário/UUID (ex.: `"createdBy"`).<br/>`@EntitySecurity(readRoles = {"ROLE_USER"}, ownerField = "createdBy")` | Campo dono do registro ("createdBy"); previne ataques IDOR.<br/>*Atenção:* Impõe filtro de propriedade por linha em `GET`/`PUT`/`PATCH`/`DELETE`, exceto para papéis em `bypassOwnerRoles`. |
| `bypassOwnerRoles` | `String[]` | `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}`); `{}` vazio não adiciona restrição própria.<br/>`@EntitySecurity(ownerField = "ownerId", bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_AUDITOR"})` | Perfis privilegiados que ignoram a verificação de `ownerField`.<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |
| `permissions` | `String[]` | `{}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ORDER_READ", "ORDER_APPROVE"}`); `{}` vazio não adiciona restrição própria.<br/>`@EntitySecurity(permissions = {"INVOICE_VIEW", "INVOICE_PAY"})` | Códigos de permissão granulares avaliados em conjunto com papéis.<br/>*Atenção:* Avaliado contra permissões granulares de JWT ou DB-RBAC `@SecurityPermissionEntity`. |

```java
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN},
    ownerField = "createdBy"
)
```

### `@FieldSecurity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Mascara ou anula colunas sensíveis dinamicamente quando os papéis não possuem permissão.
- **Comportamento em Execução**: Aplicado após a consulta e antes da serialização JSON.
- **Como Usar**: Coloque em campos sensíveis (`costPrice`, `ssn`); o mascaramento ocorre sobre cópias clonadas seguras.
- **Quando Usar**: Quando o mesmo endpoint atende perfis diferentes e certos campos exigem sigilo em REST e GraphQL.
- **Quando NÃO Usar e Cuidados**: Campos não-`String` já recebem `null` automaticamente; use `nullifyInsteadOfMask = true` se quiser `null` em campos `String` em vez de `"******"`, ou `readDto` para omitir a propriedade.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `viewRoles` | `String[]` | `{}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_ADMIN", "ROLE_FINANCE"}`); `{}` vazio não adiciona restrição própria.<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN", "ROLE_FINANCE"}, maskPattern = "***")` | Perfis autorizados a visualizar o valor original sem máscara.<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |
| `maskPattern` | `String` | `"******"` | Não (Opcional) | String identificadora não vazia (ex.: `"***-**-****"`); deixe `""` para usar a convenção padrão.<br/>`@FieldSecurity(viewRoles = {"ROLE_HR"}, maskPattern = "REDACTED")` | Padrão de máscara retornado para campos String sem permissão.<br/>*Atenção:* Ignorado quando `nullifyInsteadOfMask = true`. Para campos não-String (`BigDecimal`, `LocalDate`), prefira `nullifyInsteadOfMask = true`. |
| `nullifyInsteadOfMask` | `boolean` | `false` | Não (Opcional) | `true` (substituir campo não autorizado por null) ou `false` (aplicar string maskPattern).<br/>`@FieldSecurity(viewRoles = {"ROLE_ADMIN"}, nullifyInsteadOfMask = true)` | Se true, força null em campos String em vez de maskPattern (tipos não-String já recebem null automaticamente).<br/>*Atenção:* Essencial para números, datas e objetos, garantindo `null` válido a clientes TypeScript/Zod. |

```java
@FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
private String nationalId;
```

### `@StateMachine`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Impõe transições permitidas via POST /{id}/transition e restringe DELETE /{id} a deletableStates.
- **Comportamento em Execução**: Rejeita transições ou exclusões ilegais com HTTP 422 BusinessRuleViolationException.
- **Como Usar**: Aplique no campo String de status usando `:` (`"CREATED:PAID,CANCELLED"`).
- **Quando Usar**: Para fluxos rígidos de ciclo de vida (pedidos, empréstimos) bloqueando saltos ilegais (`422`).
- **Quando NÃO Usar e Cuidados**: NUNCA escreva `"->"` (`EntityStateMachineUtil` divide apenas por `":"`)!

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `initial` | `String` | `"ACTIVE"` | Não (Opcional) | String identificadora não vazia (ex.: `"CREATED"`); deixe `""` para usar a convenção padrão.<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Estado inicial injetado ao criar registro se vazio ("ACTIVE").<br/>*Atenção:* Preenchido automaticamente no `POST` quando vazio; deve corresponder ao estado antes de `:` em `transitions`. |
| `transitions` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `"FROM:TO1,TO2"` colon-separated rules (e.g., `{"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"}`).<br/>`@StateMachine(initial = "CREATED", transitions = {"CREATED:PENDING_PAYMENT,CANCELLED", "PENDING_PAYMENT:CONFIRMED,CANCELLED"})` | Regras de transição no formato com dois pontos "FROM:TO_1,TO_2".<br/>*Atenção:* Exige a sintaxe exata `"FROM:TO1,TO2"` (sensível a maiúsculas, destinos separados por vírgula). Transições não declaradas retornam HTTP `422`. |
| `deletableStates` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `{"CREATED", "CANCELLED"}` (state names where DELETE is allowed).<br/>`@StateMachine(initial = "CREATED", deletableStates = {"CREATED", "CANCELLED"})` | Estados em que DELETE é permitido (outros retornam HTTP 422).<br/>*Atenção:* Quando preenchido, `DELETE /{id}` retorna HTTP `422 Unprocessable Entity` se a entidade estiver em outro estado (ex.: `"PAID"`). |

```java
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:PAID", "PAID:SHIPPED"},
    deletableStates = {"DRAFT"}
)
```

### `@HumanPolicy`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Compila cláusulas legíveis de política em regras ativas de RBAC, transição e mascaramento.
- **Comportamento em Execução**: Inspecionável em GET /human-policy e sobrescrevível em YAML em spring-nwvmc.human-policies.<Entity>.
- **Como Usar**: Coloque na entidade ou via `spring-nwvmc.human-policies` no YAML para compilação no startup.
- **Quando Usar**: Quando times de produto ou compliance desejam regras legíveis em linguagem natural ou YAML.
- **Quando NÃO Usar e Cuidados**: NÃO escreva texto livre arbitrário ou em outro idioma; prefira `@EntitySecurity`/`@StateMachine` para máxima clareza.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lifecycle` | `String` | `""` | Não (Opcional) | Um dos valores suportados: Natural English rules like `"Starts at DRAFT. From DRAFT can transition to PAID. Allow deletion only when DRAFT."`.<br/>`@HumanPolicy(lifecycle = "Starts at DRAFT. From DRAFT can transition to PAID or CANCELLED.")` | Diretiva em inglês natural compilada em transições de estado.<br/>*Atenção:* Compilado na inicialização para o mesmo motor de `@StateMachine`; evite regras conflitantes na mesma entidade. |
| `security` | `String` | `""` | Não (Opcional) | Um dos valores suportados: Natural English rules like `"Allow read for USER, ADMIN. Allow write for ADMIN. Allow delete for SUPER_ADMIN."`.<br/>`@HumanPolicy(security = "Allow read for USER, ADMIN. Allow write for ADMIN.")` | Diretiva RBAC em inglês natural para leitura/escrita/exclusão/propriedade.<br/>*Atenção:* Os papéis recebem prefixo `ROLE_` automaticamente e frases inválidas falham no startup. |
| `masking` | `String` | `""` | Não (Opcional) | Um dos valores suportados: Natural English rules like `"Mask costPrice for USER with asterisks. Nullify ssn for non-ADMIN."`.<br/>`@HumanPolicy(masking = "Mask phoneNumber for USER. Nullify costPrice for non-ADMIN.")` | Política em inglês natural especificando campos mascarados e perfis.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"costPrice"`); divergências causam erro em runtime. |
| `stateField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo estado de ciclo de vida (ex.: `"orderStatus"`).<br/>`@HumanPolicy(stateField = "orderStatus", lifecycle = "Starts at NEW.")` | Campo da entidade que armazena o estado gerenciado.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"orderStatus"`); divergências causam erro em runtime. |

```java
@HumanPolicy(
    stateField = "status",
    lifecycle = "Starts at PENDING. From PENDING can transition to ACTIVE or CANCELLED.",
    security = "Allow read for USER, ADMIN. Allow write for ADMIN."
)
```

### `@AuditTrail`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Registra diferenças por campo entre mutações para reconstrução Time-Travel e inspeção /diff.
- **Comportamento em Execução**: Captura deltas oldValue e newValue em create, update, patch, transition e restore.
- **Como Usar**: Anote a entidade `BaseAuditEntity` com `@AuditTrail`; mutações gravam revisões automaticamente.
- **Quando Usar**: Para entidades críticas (pagamentos, pedidos, prontuários) que exigem histórico `GET /api/v1/system/time-travel/{entityName}/{id}`.
- **Quando NÃO Usar e Cuidados**: Evite em tabelas de logs/telemetria de escrita massiva para não gerar amplificação de escrita.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `category` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"FINANCE_LEDGER"`); deixe `""` para usar a convenção padrão.<br/>`@AuditTrail(category = "FINANCE_LEDGER", recordFieldDiffs = true)` | Categoria lógica gravada no evento de auditoria.<br/>*Atenção:* Marca logs de auditoria para filtragem por domínio; `""` usa o nome simples da entidade JPA. |
| `recordFieldDiffs` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@AuditTrail(category = "PAYMENTS", recordFieldDiffs = true)` | Se true, calcula diff campo a campo para o Time-Travel.<br/>*Atenção:* Grava diff antes/depois em cada `PUT`/`PATCH`; desative (`false`) em blobs grandes ou gravações muito frequentes. |

```java
@AuditTrail(category = "FINANCIAL", recordFieldDiffs = true)
```

### `@MultiTenant`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Isola consultas e mutações automaticamente por inquilino ativo, exceto para papéis de bypass.
- **Comportamento em Execução**: Retorna HTTP 403 fail-closed quando o tenant está ausente sem papel bypass; sobrescreve tenantId na criação (anti-spoofing) e bloqueia IDOR nas operações por ID.
- **Como Usar**: Aplique na `@Entity` SaaS; filtragem de leitura, anti-spoofing na criação e fail-closed `403` são automáticos.
- **Quando Usar**: Em todas as tabelas SaaS compartilhadas para evitar vazamento entre clientes no REST, Batch e GraphQL.
- **Quando NÃO Usar e Cuidados**: NÃO coloque em tabelas globais compartilhadas (países, moedas) nem sem claim `tenantId`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `tenantField` | `String` | `"tenantId"` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo identificador de locatário (ex.: `"tenantId"`).<br/>`@MultiTenant(tenantField = "organizationId")` | Nome do campo da entidade que armazena o ID do tenant ("tenantId").<br/>*Atenção:* Crie um índice composto `(tenant_id, id)` no banco para consultas rápidas com isolamento estrito. |
| `bypassTenantRoles` | `String[]` | `{"ROLE_SUPER_ADMIN"}` | Não (Opcional) | Array de papéis Spring Security (ex.: `{"ROLE_SUPER_ADMIN"}`); `{}` vazio não adiciona restrição própria.<br/>`@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})` | Perfis globais autorizados a acessar dados de todos os tenants.<br/>*Atenção:* Mantenha os papéis em `RoleConstant` com prefixo `ROLE_` (ex.: `ROLE_ADMIN`) alinhado ao `GrantedAuthority` do Spring Security. |

```java
@MultiTenant(tenantField = "tenantId", bypassTenantRoles = {"ROLE_SUPER_ADMIN"})
```

### `@UniqueField`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Valida unicidade antes da persistência em create, update e upsert.
- **Comportamento em Execução**: Lança ConflictBusinessException (HTTP 409) quando existe valor duplicado.
- **Como Usar**: Aplique em campos-chave (`email`, `skuCode`) junto com `@Column(unique = true)` para checar unicidade antes de gravar.
- **Quando Usar**: Quando quiser validar unicidade apenas em registros ativos (`deleted = false`) retornando `HTTP 409`.
- **Quando NÃO Usar e Cuidados**: NÃO dispense índice `UNIQUE` no banco sob alta concorrência.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@UniqueField
private String code;
```

### `@AutoCode`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Gera automaticamente códigos de negócio únicos com prefixo na criação ou clonagem quando em branco.
- **Comportamento em Execução**: Preenche prefixo + token único antes da validação e persistência.
- **Como Usar**: Aplique no campo String com `@AutoCode(prefix = "PRD-")`; gerado automaticamente se vazio.
- **Quando Usar**: Para códigos legíveis (pedidos, SKUs, lojas, tickets) baseados em UUIDv7 sem gargalo de sequences.
- **Quando NÃO Usar e Cuidados**: NÃO use se a legislação exigir numeração sequencial sem lacunas (`1, 2, 3...`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `prefix` | `String` | `Obrigatório (sem padrão)` | **Sim (Obrigatório)** | Prefixo obrigatório não vazio (ex.: `"PRD-"`, `"INV-"`) — omitir impede a compilação.<br/>`@AutoCode(prefix = "INV") private String invoiceCode;` | Prefixo obrigatório concatenado antes de um hash UUIDv7 de 8 caracteres (ex. "PRD-").<br/>*Atenção:* Atributo obrigatório; concatena um hash UUIDv7 de 8 caracteres (ex.: `INV-0194E1A0`) quando vazio na criação ou clonagem, preservando valores informados. |

```java
@AutoCode(prefix = "PRD-")
private String code;
```

### `@AutoSlug`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Sintetiza automaticamente slugs ASCII amigáveis para URL a partir de sourceField.
- **Comportamento em Execução**: Normaliza diacríticos Unicode e expõe consulta filtrada pelo slug.
- **Como Usar**: Coloque `@AutoSlug(sourceField = "name")` no campo `slug`.
- **Quando Usar**: Para URLs amigáveis para SEO em lojas, posts, categorias e catálogos.
- **Quando NÃO Usar e Cuidados**: NÃO aponte `sourceField` para propriedade inexistente.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sourceField` | `String` | `Obrigatório (sem padrão)` | **Sim (Obrigatório)** | Nome exato da propriedade Java na entidade para um campo String (ex.: `"title"`).<br/>`@AutoSlug(sourceField = "productName") private String slug;` | Campo de origem obrigatório convertido em slug ASCII minúsculo com hífens.<br/>*Atenção:* Obrigatório; normaliza acentos e Unicode em kebab-case seguro para URL. Combine com `@UniqueField` para unicidade. |

```java
@AutoSlug(sourceField = "name")
private String slug;
```

### `@ComputedField`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field (FIELD)`
- **Finalidade**: Calcula totais numéricos derivados antes de salvar alterações na entidade.
- **Comportamento em Execução**: Validado na inicialização por ComputedFieldFailFastUtil para falha rápida em campos inválidos.
- **Como Usar**: Coloque no campo derivado (`BigDecimal`); recalculado com precisão no servidor antes de persistir.
- **Quando Usar**: Para totais de linha e totais de pedido calculados no servidor, blindados contra fraude de payload.
- **Quando NÃO Usar e Cuidados**: NÃO use para descontos complexos em faixas ou câmbio externo (delegue via `@ServiceOverride`).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `operation` | `String` | `"MULTIPLY"` | Não (Opcional) | Um dos valores suportados: `"MULTIPLY"` (product of `sourceFields`) or `"SUM_COLLECTION"` (aggregate `collectionField` items).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Operação de cálculo: "MULTIPLY" ou "SUM_COLLECTION".<br/>*Atenção:* Recalculado automaticamente antes de persistir em `POST`/`PUT`/`PATCH`, bloqueando totais adulterados pelo cliente. |
| `sourceFields` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `{"unitPrice", "quantity"}` (numeric properties on same entity).<br/>`@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})` | Campos da entidade multiplicados entre si quando operation = "MULTIPLY".<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"unitPrice"`); divergências causam erro em runtime. |
| `collectionField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo coleção @OneToMany (ex.: `"items"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Campo coleção @OneToMany somado em modo "SUM_COLLECTION".<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"items"`); divergências causam erro em runtime. |
| `itemField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo numérico (ex.: `"subTotal"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal")` | Campo numérico de cada item filho somado (ex. "subTotal").<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"subTotal"`); divergências causam erro em runtime. |
| `subtractField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo numérico (ex.: `"discountAmount"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", subtractField = "discountAmount")` | Campo de desconto subtraído da soma (ex. "discountAmount").<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"discountAmount"`); divergências causam erro em runtime. |
| `addField` | `String` | `""` | Não (Opcional) | Nome exato da propriedade Java na entidade para um campo numérico (ex.: `"shippingFee"`).<br/>`@ComputedField(operation = "SUM_COLLECTION", collectionField = "items", itemField = "subTotal", addField = "shippingFee")` | Campo de acréscimo somado ao total (ex. "shippingFee").<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"shippingFee"`); divergências causam erro em runtime. |

```java
@ComputedField(operation = "MULTIPLY", sourceFields = {"unitPrice", "quantity"})
private BigDecimal lineTotal;
```

### `@CustomQuery`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Permite vincular consultas SQL/JPQL customizadas ou métodos provedores a endpoints do controlador.
- **Comportamento em Execução**: Executado com parâmetros nomeados vinculados via JPA EntityManager.
- **Como Usar**: Combine com `@AutoGet`/`@AutoPost` ligando os `:param` com `@AutoParam` ou `@AutoVariable`.
- **Quando Usar**: Para relatórios SQL nativos, CTEs, window functions ou JSONB sem criar repositórios manuais.
- **Quando NÃO Usar e Cuidados**: NUNCA concatene entrada de usuário no SQL; use `:param` e evite JOIN entre Bounded Contexts.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `""` | Não (Opcional) | Um dos valores suportados: Parameterized SQL or JPQL statement using positional `?1`/`?2` or named `:param` placeholders.<br/>`@CustomQuery(value = "SELECT * FROM orders WHERE tenant_id = :tenantId AND total >= :minTotal", nativeQuery = true)` | Consulta SQL ou JPQL inline suportando parâmetros `:param`.<br/>*Atenção:* Use sempre parâmetros `:param` ou `?1` contra SQL Injection; deixe `""` ao delegar para `sqlProvider`. |
| `nativeQuery` | `boolean` | `true` | Não (Opcional) | `true` (executar SQL nativo do banco) ou `false` (executar JPQL portável JPA).<br/>`@CustomQuery(value = "SELECT o FROM OrderEntity o WHERE o.status = :status", nativeQuery = false)` | true executa SQL nativo; false executa JPQL.<br/>*Atenção:* SQL nativo (`true`) libera CTEs e funções analíticas; use `false` (JPQL) para portabilidade entre H2/PostgreSQL/MySQL. |
| `resultClass` | `Class<?>` | `Void.class` | Não (Opcional) | Qualquer classe Java concreta (ex.: `MonthlyRevenueDto.class`) ou `Void.class` para desativar o mapeamento DTO.<br/>`@CustomQuery(value = "SELECT currency, SUM(total) FROM invoices GROUP BY currency", resultClass = MonthlyRevenueDto.class)` | Classe opcional de mapeamento dos resultados.<br/>*Atenção:* Informe sempre uma classe DTO de projeção em agregações para evitar `SELECT *` e linhas sem tipo. |
| `sqlProvider` | `Class<?>` | `Void.class` | Não (Opcional) | Classe provedora SQL Pure Java (ex.: `OrderAnalyticsSqlProvider.class`), ou `Void.class` ao usar `value` inline.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Classe provedora opcional de SQL dinâmico validada no boot.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `sqlProvider` inválidos falham rapidamente antes de aceitar tráfego. |
| `providerMethod` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"buildRevenueSql"`); deixe `""` para usar a convenção padrão.<br/>`@CustomQuery(sqlProvider = OrderAnalyticsSqlProvider.class, providerMethod = "buildRevenueSql")` | Nome do método em `sqlProvider` que retorna a String SQL.<br/>*Atenção:* Deve coincidir exatamente com o identificador Java (sensível a maiúsculas, ex.: `"buildRevenueSql"`); divergências causam erro em runtime. |
| `modifying` | `boolean` | `false` | Não (Opcional) | `true` (DML UPDATE/DELETE em transação de escrita) ou `false` (consulta SELECT somente leitura).<br/>`@CustomQuery(value = "UPDATE orders SET status = :status WHERE id = :id", modifying = true)` | Deve ser `true` para instruções INSERT, UPDATE ou DELETE.<br/>*Atenção:* Obrigatório (`true`) para `UPDATE`/`DELETE`; executa em transação de escrita e limpa o contexto JPA. |

```java
@CustomQuery(value = "SELECT * FROM tbl_order WHERE status = :status", nativeQuery = true)
```

---

## 4. RBAC Dinâmico via Banco de Dados e Meta-Anotações de Mascaramento (18 Anotações)

### `@SecurityRoleEntity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Finalidade**: Designa uma entidade JPA como tabela de catálogo ativa de papéis RBAC no banco de dados.
- **Comportamento em Execução**: DynamicDatabaseRbacProviderHelper armazena vínculos papel-permissão em Caffeine e invalida automaticamente na escrita.
- **Como Usar**: Anote sua entidade Role com `@SecurityRoleEntity` e marque a chave obrigatória com `@RoleCode`.
- **Quando Usar**: Quando administradores criam e editam perfis dinamicamente em banco de dados em produção.
- **Quando NÃO Usar e Cuidados**: NÃO omita `@RoleCode` (falha no boot!) nem declare múltiplas entidades `@SecurityRoleEntity`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Não (Opcional) | Número positivo (`>= 1`) em segundos; ex.: `60L`.<br/>`@SecurityRoleEntity(cacheTtlSeconds = 120L)` | TTL em segundos do cache Caffeine antes de recarregar do JPA.<br/>*Atenção:* TTLs curtos refletem mudanças mais rápido com mais consultas; TTLs longos aliviam o banco mas atrasam revogações. |

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

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia a coluna do código único de papel dentro de uma entidade @SecurityRoleEntity.
- **Comportamento em Execução**: Lido via LambdaAccessorUtil em cache para corresponder aos tokens GrantedAuthority.
- **Como Usar**: Coloque `@RoleCode` no campo ou getter correspondente dentro da entidade `@SecurityRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@RoleCode
@UniqueField
@Column(name = "code", nullable = false, unique = true)
private String code; // e.g. ROLE_FINANCE_ANALYST
```

### `@RoleName`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Identifica o campo de nome legível do papel em uma entidade @SecurityRoleEntity.
- **Comportamento em Execução**: Exposto nos metadados de diagnóstico RBAC e endpoints de inspeção do Dev Studio.
- **Como Usar**: Coloque `@RoleName` no campo ou getter correspondente dentro da entidade `@SecurityRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@RoleName
@Column(name = "display_name", nullable = false)
private String name;
```

### `@RolePermissions`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Marca o campo coleção ou string CSV com os códigos de permissão concedidos a um papel.
- **Comportamento em Execução**: Analisado dinamicamente e expandido para autoridades efetivas do SecurityIdentityCustomizer.
- **Como Usar**: Coloque `@RolePermissions` no campo ou getter correspondente dentro da entidade `@SecurityRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@RolePermissions
@Column(name = "permissions_csv", length = 2000)
private String permissions; // e.g. "product:read,product:write"
```

### `@SecurityPermissionEntity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Finalidade**: Marca uma entidade JPA que armazena permissões recurso-ação e regras dinâmicas de mascaramento.
- **Comportamento em Execução**: Carregado no DatabaseRbacRuleMatcherHelper para impor acesso CRUD e mascaramento após leitura.
- **Como Usar**: Anote a entidade Permission com `@SecurityPermissionEntity` e marque `@PermissionCode`.
- **Quando Usar**: Para gerenciar permissões granulares recurso/ação e mascaramento de campos pelo banco.
- **Quando NÃO Usar e Cuidados**: NÃO esqueça `@PermissionCode` nem registre múltiplas `@SecurityPermissionEntity`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cacheTtlSeconds` | `long` | `60L` | Não (Opcional) | Número positivo (`>= 1`) em segundos; ex.: `60L`.<br/>`@SecurityPermissionEntity(cacheTtlSeconds = 120L)` | TTL em segundos do cache Caffeine para permissões.<br/>*Atenção:* TTLs curtos refletem mudanças mais rápido com mais consultas; TTLs longos aliviam o banco mas atrasam revogações. |

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

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Designa o campo identificador único da permissão dentro de @SecurityPermissionEntity.
- **Comportamento em Execução**: Comparado com autoridades do usuário e códigos em @EntitySecurity.permissions().
- **Como Usar**: Coloque `@PermissionCode` no campo ou getter correspondente dentro da entidade `@SecurityPermissionEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPermissionEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPermissionEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PermissionCode
@UniqueField
@Column(name = "code", nullable = false)
private String code; // e.g. "product:write"
```

### `@PermissionResource`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia o nome da entidade ou recurso API alvo (ou curinga *) em @SecurityPermissionEntity.
- **Comportamento em Execução**: Avaliado sem distinção de maiúsculas pelo DatabaseRbacRuleMatcherHelper com curinga.
- **Como Usar**: Coloque `@PermissionResource` no campo ou getter correspondente dentro da entidade `@SecurityPermissionEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPermissionEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPermissionEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PermissionResource
@Column(name = "resource_name", nullable = false)
private String resource; // e.g. "ProductCatalog" or "*"
```

### `@PermissionAction`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia o verbo de ação CRUD ou customizado protegido por @SecurityPermissionEntity.
- **Comportamento em Execução**: Normalizado automaticamente a partir dos métodos do controlador (READ, WRITE, DELETE ou ação customizada).
- **Como Usar**: Coloque `@PermissionAction` no campo ou getter correspondente dentro da entidade `@SecurityPermissionEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPermissionEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPermissionEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PermissionAction
@Column(name = "action_name", nullable = false)
private String action; // READ, WRITE, DELETE, *
```

### `@PermissionFieldMask`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Declara campos separados por vírgula que devem ser ocultados dinamicamente por esta regra.
- **Comportamento em Execução**: Aplicado dinamicamente junto com @FieldSecurity antes da serialização JSON.
- **Como Usar**: Coloque `@PermissionFieldMask` no campo ou getter correspondente dentro da entidade `@SecurityPermissionEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPermissionEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPermissionEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PermissionFieldMask
@Column(name = "field_mask_csv", length = 1000)
private String maskedFields; // e.g. "unitCost,supplierMargin"
```

### `@SecurityUserRoleEntity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Finalidade**: Mapeia a entidade JPA que vincula sujeitos autenticados a papéis do banco e escopo de inquilino.
- **Comportamento em Execução**: Consultado automaticamente na hidratação JWT / SecurityContext via SecurityIdentityCustomizer.
- **Como Usar**: Anote a entidade de associação com `@SecurityUserRoleEntity`, `@UserRoleSubject` e `@UserRoleCode`.
- **Quando Usar**: Quando o JWT identifica apenas `username` e os papéis são carregados do banco em tempo real.
- **Quando NÃO Usar e Cuidados**: NÃO esqueça `@UserRoleSubject`; dispense se o JWT externo já contiver todas as autoridades.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `enabled` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@SecurityUserRoleEntity(enabled = true)` | Chave para habilitar ou desabilitar o carregamento de vínculos usuário-perfil.<br/>*Atenção:* Defina `false` temporariamente em migrações para pausar a tabela de papéis mantendo os claims do JWT. |

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

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Identifica o campo sujeito / nome de usuário principal em @SecurityUserRoleEntity.
- **Comportamento em Execução**: Comparado com Authentication.getName() do SecurityContext ativo.
- **Como Usar**: Coloque `@UserRoleSubject` no campo ou getter correspondente dentro da entidade `@SecurityUserRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityUserRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityUserRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@UserRoleSubject
@Column(name = "subject", nullable = false)
private String subject; // Authentication.getName() / JWT sub
```

### `@UserRoleCode`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Vincula a coluna do código de papel atribuído dentro de @SecurityUserRoleEntity.
- **Comportamento em Execução**: Resolve as permissões vinculadas em @SecurityRoleEntity durante avaliação de políticas.
- **Como Usar**: Coloque `@UserRoleCode` no campo ou getter correspondente dentro da entidade `@SecurityUserRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityUserRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityUserRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@UserRoleCode
@Column(name = "role_code", nullable = false)
private String roleCode;
```

### `@UserRoleTenantId`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Delimita uma atribuição @SecurityUserRoleEntity a um ID de inquilino específico (ou * global).
- **Comportamento em Execução**: Filtrado conforme TenantContextHolder / X-Tenant-ID em cada requisição autenticada.
- **Como Usar**: Coloque `@UserRoleTenantId` no campo ou getter correspondente dentro da entidade `@SecurityUserRoleEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityUserRoleEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityUserRoleEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@UserRoleTenantId
@Column(name = "tenant_id")
private String tenantId; // optional tenant scope or "*"
```

### `@SecurityPolicyEntity`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Entity (TYPE)`
- **Finalidade**: Marca uma entidade JPA que armazena políticas explícitas ALLOW / DENY ordenadas por priority.
- **Comportamento em Execução**: DENY explícito prevalece deterministicamente sobre ALLOW antes da execução SQL.
- **Como Usar**: Anote a entidade de política com `@SecurityPolicyEntity`, `@PolicyAllowedRoles`, `@PolicyResource`, `@PolicyAction` e `@PolicyEffect`.
- **Quando Usar**: Para sobrescrever `@EntitySecurity` dinamicamente via banco (incluindo travas `DENY` de emergência).
- **Quando NÃO Usar e Cuidados**: NÃO omita `@PolicyAllowedRoles`; lembre-se de que regras `DENY` explícitas bloqueiam sobre permissões.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `priority` | `int` | `100` | Não (Opcional) | Número positivo (`>= 0`) em prioridade inteira; ex.: `10`.<br/>`@SecurityPolicyEntity(priority = 10)` | Ordem de prioridade das políticas (valores menores têm maior precedência).<br/>*Atenção:* Valores menores têm precedência quando múltiplas políticas coincidem (ex.: `10` vence `100`). |

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

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia o padrão identificador do recurso alvo em @SecurityPolicyEntity.
- **Comportamento em Execução**: Suporta nomes exatos de entidade/recurso bem como correspondência com curinga *.
- **Como Usar**: Coloque `@PolicyResource` no campo ou getter correspondente dentro da entidade `@SecurityPolicyEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPolicyEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPolicyEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PolicyResource
@Column(name = "resource", nullable = false)
private String resource; // e.g. "ComplianceAuditRecord"
```

### `@PolicyAction`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia o verbo de operação protegido (READ, WRITE, DELETE, methodName, *) em @SecurityPolicyEntity.
- **Comportamento em Execução**: Avaliado por operação HTTP antes de delegar ao serviço.
- **Como Usar**: Coloque `@PolicyAction` no campo ou getter correspondente dentro da entidade `@SecurityPolicyEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPolicyEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPolicyEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PolicyAction
@Column(name = "action", nullable = false)
private String action; // READ | WRITE | DELETE | *
```

### `@PolicyAllowedRoles`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Mapeia a coleção ou lista separada por vírgulas de papéis alvo da regra @SecurityPolicyEntity.
- **Comportamento em Execução**: Cruzado com autoridades JWT ativas e papéis carregados de @SecurityUserRoleEntity.
- **Como Usar**: Coloque `@PolicyAllowedRoles` no campo ou getter correspondente dentro da entidade `@SecurityPolicyEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPolicyEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPolicyEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PolicyAllowedRoles
@Column(name = "allowed_roles", length = 1000)
private String allowedRoles; // e.g. "ROLE_AUDITOR,ROLE_COMPLIANCE_LEAD"
```

### `@PolicyEffect`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Field / Method (FIELD, METHOD)`
- **Finalidade**: Especifica o resultado de decisão ALLOW ou DENY em uma regra @SecurityPolicyEntity.
- **Comportamento em Execução**: Qualquer política DENY correspondente aborta imediatamente com HTTP 403 AccessDeniedBusinessException.
- **Como Usar**: Coloque `@PolicyEffect` no campo ou getter correspondente dentro da entidade `@SecurityPolicyEntity`.
- **Quando Usar**: Para mapear suas próprias colunas de `@SecurityPolicyEntity` no motor DB-RBAC sem renomear o banco.
- **Quando NÃO Usar e Cuidados**: NÃO duplique na mesma entidade nem use fora de uma entidade marcada com `@SecurityPolicyEntity`.

> **Anotação Marcadora**: Anotação marcadora pura — não declara atributos.

```java
@PolicyEffect
@Column(name = "effect", nullable = false)
private String effect; // ALLOW or DENY
```

---

## 5. Bloqueio Distribuído, Idempotência, Cache, Multi-BD e CloudEvents (13 Anotações)

### `@DistributedLock`

- **Pacote**: `io.github.natswarchuan.module.lock.annotation`
- **`@Target`**: `Method (METHOD)`
- **Finalidade**: Serializa acessos concorrentes em chaves SpEL em cache AST (padrão waitTimeMs=3000L, leaseTimeMs=5000L).
- **Comportamento em Execução**: DistributedLockAspect lança DistributedLockAcquisitionException (HTTP 409) ao exceder o tempo.
- **Como Usar**: Coloque em método de um `@Service` não-final; em cluster forneça bean `DistributedLockProvider` Redis.
- **Quando Usar**: Para evitar venda acima do estoque, débitos concorrentes ou condições de corrida críticas.
- **Quando NÃO Usar e Cuidados**: NÃO assuma trava distribuída entre pods com o provedor local Caffeine nem use em classes `final`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `key` | `String` | `""` | Não (Opcional) | Expressão SpEL referenciando parâmetros do método (ex.: `"'inventory:' + #skuId"`) ou `""` para chave automática.<br/>`@DistributedLock(key = "'order:' + #id", waitTimeMs = 2000L, leaseTimeMs = 8000L)` | Expressão SpEL da chave de trava avaliada em runtime.<br/>*Atenção:* Escopo sempre no menor ID de recurso (`#id`); chave fixa serializa todo o tráfego global. |
| `waitTimeMs` | `long` | `3000L` | Não (Opcional) | Número positivo (`>= 0`) em milissegundos; ex.: `3000L`.<br/>`@DistributedLock(key = "#id", waitTimeMs = 1500L)` | Tempo máximo em milissegundos aguardando a trava (padrão 3000L).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: muito baixo gera erros 409 indevidos; muito alto trava threads em picos de carga. |
| `leaseTimeMs` | `long` | `5000L` | Não (Opcional) | Número positivo (`>= 100`) em milissegundos; ex.: `10000L`.<br/>`@DistributedLock(key = "#id", leaseTimeMs = 10000L)` | Duração máxima de expiração da trava em milissegundos (5000L).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: deve superar a latência p99 da transação ou o lock expirará antes do commit. |

```java
@DistributedLock(key = "'sku:' + #request.skuId", waitTimeMs = 3000, leaseTimeMs = 5000)
```

### `@Idempotent`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Evita gravações duplicadas concorrentes ou reenviadas dentro de janelas TTL configuráveis.
- **Comportamento em Execução**: Aplicado por IdempotencyAspect + ProxyIdempotencyGuardHelper com trava TTL Caffeine (HTTP 409 ConflictBusinessException); IdempotencyManagerHelper provê SHA-256 opcional.
- **Como Usar**: Anote métodos de `@AutoRestController` ou de `@Service` não-final; falhas liberam a chave para retentativa.
- **Quando Usar**: Para captura de pagamentos, transferências e POSTs sujeitos a duplo clique ou timeout de rede.
- **Quando NÃO Usar e Cuidados**: NÃO coloque em GETs e forneça um `IdempotencyStoreProvider` Redis em múltiplas réplicas.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `headerName` | `String` | `"X-Idempotency-Key"` | Não (Opcional) | Nome de cabeçalho HTTP válido (insensível a maiúsculas na rede, ex.: `"X-Idempotency-Key"`).<br/>`@Idempotent(headerName = "Idempotency-Key", ttlSeconds = 600L)` | Cabeçalho HTTP portando a chave do cliente; omitido ou vazio ignora o bloqueio.<br/>*Atenção:* O cliente deve enviar UUIDv7 único por operação e reutilizá-lo em retentativas; libere-o em CORS `allowedHeaders`. |
| `ttlSeconds` | `long` | `300L` | Não (Opcional) | Número positivo (`>= 1`) em segundos; ex.: `300L`.<br/>`@Idempotent(ttlSeconds = 900L)` | Janela em segundos retornando HTTP 409 Conflict em reenvios duplicados (300L).<br/>*Atenção:* Janela de retenção no Redis/memória; ajuste entre `300L` e `86400L` conforme o prazo de retentativa. |

```java
@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
```

### `@RateLimit`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Aplica limitação de taxa em janela deslizante por partição de IP, Usuário ou Inquilino.
- **Comportamento em Execução**: Incrementa a métrica nwvmc.ratelimit.rejected.total e responde HTTP 429 Too Many Requests.
- **Como Usar**: Coloque na interface ou método; emite `X-RateLimit-Remaining`/`X-RateLimit-Reset` e retorna `HTTP 429` + `Retry-After` ao exceder.
- **Quando Usar**: Para buscas públicas, auth, consultas IA e exportações pesadas para conter abuso e DDoS.
- **Quando NÃO Usar e Cuidados**: NÃO restrinja probes de saúde nem use `"GLOBAL"` quando um único usuário/tenant não puder bloquear os demais.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `requests` | `int` | `60` | Não (Opcional) | Número positivo (`>= 1`) em requisições; ex.: `60`.<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Máximo de requisições permitidas por janela deslizante (60).<br/>*Atenção:* Emite `X-RateLimit-Remaining`, `X-RateLimit-Reset` e `Retry-After` (RFC 6585) ao retornar HTTP `429`. |
| `windowSeconds` | `int` | `60` | Não (Opcional) | Número positivo (`>= 1`) em segundos; ex.: `60`.<br/>`@RateLimit(requests = 100, windowSeconds = 60)` | Duração em segundos da janela de controle (60).<br/>*Atenção:* Define a janela do contador e calcula os cabeçalhos `X-RateLimit-Reset` e `Retry-After`. |
| `partitionKey` | `String` | `"IP"` | Não (Opcional) | Um dos valores suportados: `"IP"`, `"clientIp"`, `"USER"`, `"TENANT"`, `"GLOBAL"`, or SpEL `#expr` (case-insensitive).<br/>`@RateLimit(requests = 30, windowSeconds = 60, partitionKey = "USER")` | Estratégia dinâmica: "IP"/"clientIp", "USER" (fallback IP se anônimo), "TENANT", "GLOBAL" ou SpEL "#expr".<br/>*Atenção:* `"USER"` particiona por usuário autenticado (fallback para IP se anônimo); `"GLOBAL"` compartilha uma cota única. |

```java
@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
```

### `@EntityCircuitBreaker`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Envolve operações em Circuit Breakers Resilience4j enviando telemetria para Actuator e Micrometer.
- **Comportamento em Execução**: Abre para OPEN (HTTP 503) ao exceder o limite e atualiza o medidor nwvmc.resilience.circuitbreaker.state.
- **Como Usar**: Anote controladores integrados a APIs externas ou IA para evitar falhas em cascata via Resilience4j.
- **Quando Usar**: Quando falhas externas devem falhar rápido (`HTTP 503`) em vez de travar Virtual Threads em timeouts.
- **Quando NÃO Usar e Cuidados**: `CircuitBreakerErrorFilterUtil` ignora automaticamente 4xx `BaseBusinessException`; não encapsule erros de cliente em `RuntimeException`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"payment-gateway-cb"`); deixe `""` para usar a convenção padrão.<br/>`@EntityCircuitBreaker(name = "inventory-service", failureRateThreshold = 50.0f)` | Nome da instância CircuitBreaker no Resilience4j.<br/>*Atenção:* Identifica a instância Resilience4j e a tag Micrometer; `""` deriva o nome da classe. |
| `failureRateThreshold` | `float` | `50.0f` | Não (Opcional) | Número positivo (`1.0f .. 100.0f`) em porcentagem; ex.: `50.0f`.<br/>`@EntityCircuitBreaker(failureRateThreshold = 40.0f, slidingWindowSize = 20)` | Taxa de falha percentual que abre o disjuntor (padrão 50.0f).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: erros de negócio 4xx (`BaseBusinessException`) são ignorados; apenas falhas 5xx/infra abrem o circuito. |
| `waitDurationInOpenStateSeconds` | `int` | `10` | Não (Opcional) | Número positivo (`>= 1`) em segundos; ex.: `15`.<br/>`@EntityCircuitBreaker(waitDurationInOpenStateSeconds = 15)` | Segundos de espera no estado OPEN retornando HTTP 503 (padrão 10).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: erros de negócio 4xx (`BaseBusinessException`) são ignorados; apenas falhas 5xx/infra abrem o circuito. |
| `slidingWindowSize` | `int` | `20` | Não (Opcional) | Número positivo (`>= 1`) em chamadas; ex.: `20`.<br/>`@EntityCircuitBreaker(slidingWindowSize = 25, failureRateThreshold = 50.0f)` | Quantidade de chamadas avaliadas na janela deslizante (20).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: erros de negócio 4xx (`BaseBusinessException`) são ignorados; apenas falhas 5xx/infra abrem o circuito. |
| `permittedNumberOfCallsInHalfOpenState` | `int` | `5` | Não (Opcional) | Número positivo (`>= 1`) em chamadas; ex.: `5`.<br/>`@EntityCircuitBreaker(permittedNumberOfCallsInHalfOpenState = 3)` | Chamadas de sonda permitidas no estado HALF_OPEN (5).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: erros de negócio 4xx (`BaseBusinessException`) são ignorados; apenas falhas 5xx/infra abrem o circuito. |

```java
@EntityCircuitBreaker(name = "catalogCb", failureRateThreshold = 50.0f)
```

### `@EntityRetry`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Repete automaticamente falhas transitórias com backoff exponencial configurável.
- **Comportamento em Execução**: Lança exceção padronizada caso todas as tentativas configuradas se esgotem.
- **Como Usar**: Aplique em interfaces ou métodos para recuperação automática de falhas transitórias de rede/BD.
- **Quando Usar**: Para leituras GET idempotentes, PUTs ou chamadas protegidas por `@Idempotent`.
- **Quando NÃO Usar e Cuidados**: NUNCA em criações POST ou cobranças sem `@Idempotent` (pode duplicar transações!).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `name` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"erp-sync-retry"`); deixe `""` para usar a convenção padrão.<br/>`@EntityRetry(name = "erp-sync-retry", maxAttempts = 3)` | Nome da instância Retry no Resilience4j.<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: garanta que a soma das tentativas e backoffs fique abaixo do timeout do gateway. |
| `maxAttempts` | `int` | `3` | Não (Opcional) | Número positivo (`>= 1`) em tentativas; ex.: `3`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 500L)` | Total de tentativas incluindo a execução inicial (3).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: garanta que a soma das tentativas e backoffs fique abaixo do timeout do gateway. |
| `waitDurationMs` | `long` | `500L` | Não (Opcional) | Número positivo (`>= 50`) em milissegundos; ex.: `500L`.<br/>`@EntityRetry(maxAttempts = 3, waitDurationMs = 250L, backoffMultiplier = 2.0d)` | Espera inicial em ms antes da primeira retentativa (500L).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: garanta que a soma das tentativas e backoffs fique abaixo do timeout do gateway. |
| `backoffMultiplier` | `double` | `2.0d` | Não (Opcional) | Número positivo (`>= 1.0d`) em fator multiplicador; ex.: `2.0d`.<br/>`@EntityRetry(maxAttempts = 4, waitDurationMs = 200L, backoffMultiplier = 2.0d)` | Multiplicador exponencial entre retentativas consecutivas (2.0d).<br/>*Atenção:* Ajuste com cuidado conforme o SLA de latência em produção: garanta que a soma das tentativas e backoffs fique abaixo do timeout do gateway. |

```java
@EntityRetry(name = "paymentRetry", maxAttempts = 3, waitDurationMs = 500, backoffMultiplier = 2.0)
```

### `@HttpCacheable`

- **Pacote**: `io.github.natswarchuan.module.cache.http.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Calcula ETags fracos RFC 7232 (W/"...") e emite Cache-Control com respostas HTTP 304 Not Modified.
- **Comportamento em Execução**: Registra contadores HIT/MISS em nwvmc.cache.http.requests.
- **Como Usar**: Aplique em controladores/métodos GET de leitura para habilitar `ETag`, `Cache-Control` e `304`.
- **Quando Usar**: Para catálogos semiestáticos, tabelas de domínio e listagens públicas economizando banda via `304`.
- **Quando NÃO Usar e Cuidados**: NÃO deixe `isPrivate = false` em dados PII, multi-tenant ou mascarados por `@FieldSecurity`!

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `maxAgeSeconds` | `int` | `60` | Não (Opcional) | Número positivo (`>= 0`) em segundos; ex.: `120`.<br/>`@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, generateETag = true)` | Diretiva `max-age` de Cache-Control em segundos (60).<br/>*Atenção:* Emite `Cache-Control: max-age=<N>`. Use `0` com `generateETag = true` para revalidação condicional `304`. |
| `isPrivate` | `boolean` | `false` | Não (Opcional) | `true` (cache privado no navegador; bloqueado em CDNs) ou `false` (cache público para proxies e CDNs).<br/>`@HttpCacheable(maxAgeSeconds = 60, isPrivate = true)` | true emite `private` bloqueando CDNs; false emite `public`.<br/>*Atenção:* CRÍTICO: Defina `isPrivate = true` em endpoints autenticados ou com `@FieldSecurity` para evitar vazamento em CDNs. |
| `mustRevalidate` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@HttpCacheable(maxAgeSeconds = 60, mustRevalidate = true)` | Anexa `, must-revalidate` exigindo revalidação quando expirar.<br/>*Atenção:* Impede caches intermediários de servir dados expirados após `maxAgeSeconds` sem revalidar na origem. |
| `generateETag` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@HttpCacheable(maxAgeSeconds = 30, generateETag = true)` | Gera ETag SHA-256 e responde `HTTP 304` quando `If-None-Match` coincidir.<br/>*Atenção:* Gera `ETag` RFC 7232 e retorna `304 Not Modified` (0 bytes) quando `If-None-Match` coincide. |

```java
@HttpCacheable(maxAgeSeconds = 60, generateETag = true)
```

### `@AutoCacheable`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Faz cache de saídas de métodos de leitura no servidor em Caffeine L1 / Redis L2.
- **Comportamento em Execução**: Configurável globalmente via app.framework.cache.type.
- **Como Usar**: Coloque em métodos de leitura; o provedor é alternado via `app.framework.cache.type`.
- **Quando Usar**: Para leituras intensivas por ID ou metadados estáveis com alta proporção leitura/escrita.
- **Quando NÃO Usar e Cuidados**: NÃO armazene entidades mutáveis sem clonar nem dados com altíssima taxa de escrita.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `{"productCatalog"}` (Caffeine/Redis cache region names).<br/>`@AutoCacheable(value = {"productCatalog"}, key = "#id")` | Nomes lógicos dos caches gerenciados em Caffeine ou Redis.<br/>*Atenção:* Os nomes devem coincidir com regiões Caffeine/Redis; combine toda escrita com `@AutoCacheEvict`. |
| `key` | `String` | `""` | Não (Opcional) | Expressão SpEL referenciando parâmetros do método (ex.: `"'product:' + #id"`) ou `""` para chave automática.<br/>`@AutoCacheable(value = {"products"}, key = "'sku:' + #skuCode")` | Expressão SpEL de chave (v0.1.0 resolve `EntityName:id` deterministicamente).<br/>*Atenção:* Em apps multi-tenant, sempre inclua o tenantId na chave para impedir vazamento entre inquilinos. |

```java
@AutoCacheable(value = {"products"}, key = "#id")
```

### `@AutoCacheEvict`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Remove entradas obsoletas do cache do servidor após mutações.
- **Comportamento em Execução**: Executado após a mutação sem deixar fatias de leitura obsoletas.
- **Como Usar**: Coloque em métodos de atualização/exclusão com a mesma chave usada em `@AutoCacheable`.
- **Quando Usar**: Sempre que atualizações ou exclusões alterarem registros cacheados por `@AutoCacheable`.
- **Quando NÃO Usar e Cuidados**: Evite `allEntries = true` em operações `create` frequentes (causa Cache Stampede).

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String[]` | `{}` | Não (Opcional) | Array com zero ou mais valores válidos: `{"productCatalog"}` (target cache region names to evict).<br/>`@AutoCacheEvict(value = {"productCatalog"}, key = "#id")` | Nomes dos caches invalidados ao término do método.<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `value` inválidos falham rapidamente antes de aceitar tráfego. |
| `key` | `String` | `""` | Não (Opcional) | Expressão SpEL referenciando parâmetros do método (ex.: `"'product:' + #id"`) ou `""` para chave automática.<br/>`@AutoCacheEvict(value = {"products"}, key = "#id", allEntries = false)` | Expressão SpEL mirando apenas a entrada da entidade modificada.<br/>*Atenção:* Deve gerar a mesma chave de `@AutoCacheable.key`; ignorado quando `allEntries = true`. |
| `allEntries` | `boolean` | `false` | Não (Opcional) | `true` (limpar todas as entradas da região de cache) ou `false` (remover apenas a entrada resolvida por key).<br/>`@AutoCacheEvict(value = {"productCatalog"}, allEntries = true)` | Se true, remove entradas restritas ao prefixo da entidade modificada.<br/>*Atenção:* Limpar toda a região sob alto tráfego pode gerar cache stampede no banco; prefira remoção pontual por `key`. |

```java
@AutoCacheEvict(value = {"entityById"}, key = "#id", allEntries = false)
```

### `@TrackExecutionTime`

- **Pacote**: `io.github.natswarchuan.core.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Mede o tempo de execução e emite logs WARN quando chamadas lentas excedem o limite.
- **Comportamento em Execução**: Também alimenta temporizadores de latência via DynamicEntityMetricsHelper.
- **Como Usar**: Aplique em interfaces `@AutoRestController` ou serviços para monitorar violações de SLA.
- **Quando Usar**: Em relatórios complexos, lotes, GraphQL e `@CustomQuery` para detectar lentidão SQL rapidamente.
- **Quando NÃO Usar e Cuidados**: NÃO defina `warningThresholdMs <= 0` em rotas rápidas nem use em streams SSE `/events` longos.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `warningThresholdMs` | `long` | `500L` | Não (Opcional) | Número positivo (`>= 1`) em milissegundos; ex.: `300L`.<br/>`@TrackExecutionTime(warningThresholdMs = 250L)` | Limiar em milissegundos para emitir log `WARN` de lentidão (padrão 500L).<br/>*Atenção:* Gera log `WARN` com `traceId` ao ultrapassar o limite; ajuste (`200L–1000L`) para evitar excesso de logs. |

```java
@TrackExecutionTime(warningThresholdMs = 250L)
```

### `@EntityWebhook`

- **Pacote**: `io.github.natswarchuan.module.webhook.annotation`
- **`@Target`**: `Class (TYPE)`
- **Finalidade**: Envia webhooks de saída assinados com HMAC-SHA256 de forma assíncrona em Virtual Threads após commit.
- **Comportamento em Execução**: Calcula assinaturas em WebhookHmacSignerHelper e verifica igualdade em tempo constante.
- **Como Usar**: Anote a `@Entity`; a entrega assinada dispara somente após o commit da transação.
- **Quando Usar**: Para notificar parceiros externos, ERPs ou clientes SaaS logo após commit de pedidos/pagamentos.
- **Quando NÃO Usar e Cuidados**: Use `includeFullPayload = false` para dados PII/PCI sensíveis e nunca aponte a URLs SSRF internas.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `events` | `String[]` | `{"CREATED", "UPDATED", "DELETED", "STATE_CHANGED"}` | Não (Opcional) | Array com zero ou mais valores válidos: `"CREATED"`, `"UPDATED"`, `"DELETED"`, `"STATE_CHANGED"`.<br/>`@EntityWebhook(events = {"CREATED", "STATE_CHANGED"})` | Eventos que disparam entregas de webhook assinadas por HMAC.<br/>*Atenção:* Disparado de forma assíncrona após o commit (`AFTER_COMMIT`), impedindo webhooks fantasmas em rollbacks. |
| `secretHeader` | `String` | `"X-Webhook-Signature"` | Não (Opcional) | Nome de cabeçalho HTTP válido (insensível a maiúsculas na rede, ex.: `"X-Webhook-Signature"`).<br/>`@EntityWebhook(secretHeader = "X-Hub-Signature-256")` | Cabeçalho HTTP contendo a assinatura HMAC-SHA256.<br/>*Atenção:* Carrega a assinatura HMAC-SHA256 do payload; o receptor deve validá-la em tempo constante. |
| `includeFullPayload` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@EntityWebhook(includeFullPayload = false)` | true serializa o payload JSON completo; false envia apenas ID e metadados.<br/>*Atenção:* Defina `false` (apenas ID e evento) em entidades sensíveis para que assinantes consultem via GET autenticado. |

```java
@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")
```

### `@PublishCloudEvent`

- **Pacote**: `io.github.natswarchuan.module.event.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Publica envelopes CNCF CloudEvents v1.0 após o commit da transação.
- **Comportamento em Execução**: Respeita TransactionRuntimeBridge.executeAfterCommit para evitar eventos fantasma.
- **Como Usar**: Anote a entidade ou método; ouça `CloudEventEnvelopeDto` com `@TransactionalEventListener(AFTER_COMMIT)`.
- **Quando Usar**: Para comunicação desacoplada entre Bounded Contexts via eventos sem JOINs SQL cruzados.
- **Quando NÃO Usar e Cuidados**: NÃO confunda com `@EntityWebhook` externo nem processe fora de `AFTER_COMMIT`.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `eventType` | `String` | `""` | Não (Opcional) | String identificadora não vazia (ex.: `"com.acme.order.lifecycle"`); deixe `""` para usar a convenção padrão.<br/>`@PublishCloudEvent(eventType = "com.acme.order.v1", source = "/api/v1/orders")` | Tipo CNCF CloudEvents (ex. "io.nwvmc.order.created").<br/>*Atenção:* Siga a convenção reverse-DNS CloudEvents 1.0 (`com.company.domain.event`); `""` gera automaticamente. |
| `source` | `String` | `""` | Não (Opcional) | Caminho HTTP válido iniciado com `/` (ex.: `/services/order-api`) ou string vazia `""` para derivação automática.<br/>`@PublishCloudEvent(source = "/services/order-api")` | URI `source` identificando o contexto emissor.<br/>*Atenção:* Preenche o atributo URI `source` do CNCF CloudEvents para rastreamento entre microsserviços. |
| `publishOnCreate` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@PublishCloudEvent(publishOnCreate = true, publishOnUpdate = false, publishOnDelete = false)` | Emite CloudEvent após commit de criação (true).<br/>*Atenção:* Publicado somente após o commit (`AFTER_COMMIT`) via Spring Events / Kafka / RabbitMQ. |
| `publishOnUpdate` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@PublishCloudEvent(publishOnUpdate = true)` | Emite CloudEvent após commit de atualização (true).<br/>*Atenção:* Desative (`false`) em entidades de alta rotatividade para não inundar o broker de mensagens. |
| `publishOnDelete` | `boolean` | `true` | Não (Opcional) | `true` (ativado) ou `false` (desativado).<br/>`@PublishCloudEvent(publishOnDelete = true)` | Emite CloudEvent após exclusão confirmada (true).<br/>*Atenção:* Dispara tanto em exclusão física quanto `BaseAuditEntity.deleted` mantendo modelos de leitura sincronizados. |

```java
@PublishCloudEvent(eventType = "com.example.order.created", source = "/orders")
```

### `@TargetDataSource`

- **Pacote**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Fixa operações de entidade ou consulta a uma chave lógica de fonte de dados.
- **Comportamento em Execução**: Registra contagens de roteamento em framework.datasource.routing.total.
- **Como Usar**: Aplique no controlador ou em serviço não-final; o contexto anterior é restaurado no `finally`.
- **Quando Usar**: Para descarregar consultas pesadas de leitura/BI em réplicas (`REPLICA`) ou bancos regionais.
- **Quando NÃO Usar e Cuidados**: NÃO troque de datasource no meio de uma transação `@Transactional` já aberta nem em classe `final`!

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `value` | `String` | `"PRIMARY"` | Não (Opcional) | Um dos valores suportados: Configured datasource lookup key such as `"PRIMARY"`, `"REPLICA"`, `"ANALYTICS"`, `"FINANCE"`.<br/>`@TargetDataSource("REPLICA")` | Chave lógica de roteamento aplicada ao `DataSourceContextHolder` ("PRIMARY", "REPLICA").<br/>*Atenção:* Deve corresponder a uma chave ativa no `DynamicRoutingDataSource`; chaves ausentes caem em `PRIMARY`. |

```java
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
```

### `@TargetDatabasePlatform`

- **Pacote**: `io.github.natswarchuan.module.datasource.annotation`
- **`@Target`**: `Type / Method (TYPE, METHOD)`
- **Finalidade**: Atribui família de motor de banco e shard de cluster lógico por entidade.
- **Comportamento em Execução**: Resolvido dinamicamente por MultiPlatformDataSourceRegistryHelper e TenantDatabaseRoutingResolverHelper.
- **Como Usar**: Coloque em entidades JPA ou métodos declarando engine e cluster de destino.
- **Quando Usar**: Em plataformas multi-engine dividindo financeiro (`FINANCE_CLUSTER`), analítico (`ANALYTICS_CLUSTER`) e auditoria.
- **Quando NÃO Usar e Cuidados**: NÃO substitui a configuração física do pool JDBC; proíba JOINs JPA entre clusters distintos.

| Atributo | Tipo Java | Valor Padrão | Obrigatório | Valores Aceitos e Exemplo | Descrição e Notas de Runtime |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `platform` | `String` | `"H2"` | Não (Opcional) | Um dos valores suportados: `"H2"`, `"POSTGRESQL"`, `"MYSQL"`, `"ORACLE"`, `"REDIS"`, `"MONGODB"`.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER", readOnly = false)` | Motor de banco alvo ("H2", "POSTGRESQL", "MYSQL", "ORACLE", "REDIS").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `platform` inválidos falham rapidamente antes de aceitar tráfego. |
| `cluster` | `String` | `"PRIMARY"` | Não (Opcional) | Um dos valores suportados: `"PRIMARY"`, `"REPLICA"`, `"FINANCE_CLUSTER"`, `"ANALYTICS_CLUSTER"`, `"AUDIT_CLUSTER"`, or custom cluster ID.<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "ANALYTICS_CLUSTER", readOnly = true)` | Cluster de destino ("PRIMARY", "REPLICA", "FINANCE_CLUSTER", "ANALYTICS_CLUSTER").<br/>*Atenção:* Validado na inicialização; nomes incorretos ou `cluster` inválidos falham rapidamente antes de aceitar tráfego. |
| `readOnly` | `boolean` | `false` | Não (Opcional) | `true` (rotear para o pool réplica somente leitura) ou `false` (rotear para o pool primário leitura/escrita).<br/>`@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "REPLICA", readOnly = true)` | Se true, indica preferência por réplicas somente leitura.<br/>*Atenção:* Nunca use `readOnly = true` em escritas (`POST`/`PUT`/`DELETE`): réplicas somente leitura rejeitam gravações. |

```java
@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE", readOnly = false)
```
