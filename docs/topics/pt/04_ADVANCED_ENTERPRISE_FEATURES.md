# 04. Segurança, Armazenamento Multi-Cloud, `@ServiceOverride`, Métricas e i18n em 20 Idiomas (`0.1.0`)

> **Idiomas**: **Português** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#security-rbac)

---

## 1. Segurança NIST Nível 2, RBAC em Banco, Bloqueio de Superfície e Proteção Anti-Scanner

- **`@EntitySecurity`, `@FieldSecurity` e `@MultiTenant`**: RBAC declarativo por tabela (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, componível via meta-anotações), proteção por proprietário (`ownerField`), mascaramento/nulificação de colunas (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) e isolamento `@MultiTenant` fail-closed (`403` sem tenant, sobrescrita anti-spoofing na criação e defesa IDOR em endpoints por ID).
- **RBAC Dinâmico via Banco de Dados (`DynamicDatabaseRbacProviderHelper`)**: Anote 4 entidades JPA com `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` e `@SecurityPolicyEntity` mais seus marcadores. Aplica prioridade explícita `DENY` > `ALLOW`, contexto `X-Tenant-ID`, invalidação automática L1 Caffeine via `DatabaseRbacCacheInvalidationListener`, convivência não destrutiva com `SecurityFilterChain` via `PureJavaSecurityFilterBridge` e extensão via `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Bloqueio Seguro por Padrão (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)**: Com `app.framework.studio.enabled=false` (padrão), `SecurityExposurePolicyBridge` bloqueia `/system/**` sem autenticação com `401` e `StartupDiagnosticsUtil` retorna `404 Not Found` (`403` sem perfil admin); com `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` retorna `404`.
- **Desempacotamento e Higienização de Erros**: `ExceptionCauseUnwrapperUtil` registra a causa completa no servidor e retorna `ApiResponse<Void>` higienizado ao cliente.
- **CORS para SPA e Idempotência (`SecurityFilterChainBridge`)**: Permite padrões de origem configuráveis (`*`) com `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` e `X-Request-ID`.

---

## 2. Escape Hatch `@ServiceOverride` e Ejeção MVC Padrão (`GET /system/studio/eject`)

Quando um endpoint específico ultrapassa a semântica CRUD dinâmica:

1. **`@ServiceOverride` In-Place**: Anote qualquer método de `AutoApiController<E>` com `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` para delegar via `EscapeHatchDispatchHelper` e `MethodHandleCacheUtil`.
2. **Ejeção de Código Padrão (`/system/studio/eject`)**: Chame `GET /system/studio/eject?target=<EntityOrControllerName>` para exportar 5 arquivos Spring MVC independentes (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) via `ControllerEjectionHelper`.

---

## 3. Observabilidade Micrometer (`DynamicEntityMetricsHelper` e `MetricConstant` — 11 Métricas)

| Métrica | Tipo | Tags | Escopo |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Invocações CRUD dinâmicas de entidades |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Latência de execução ponta a ponta |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latência do controlador proxy dinâmico |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Resultado da avaliação ETag de `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Eventos pendentes no outbox transacional |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Latência de envio em lote do outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Código de estado (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Requisições rejeitadas acima do limite da janela deslizante |
| `framework.outbox.dispatched.total` | Counter | — | Total acumulado de eventos outbox entregues com sucesso |
| `framework.realtime.active.connections` | Gauge | — | Conexões SSE ativas (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Contador opcional de roteamento por datasource Primary / Replica / Tenant |

---

## 4. `/system/studio` em 20 Idiomas, Suporte RTL e Localização do Host (`i18n/`)

- **20 Idiomas Nativos (`I18nConstant`)**: `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` ativam `dir="rtl"`).
- **Resolução Determinística de Idioma (`LocaleResolutionUtil` e `HeaderLocaleResolver`)**: `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Tags desconhecidas recaem com segurança em `en`.
- **Personalização da Aplicação Host**: `I18nConfig` configura `ReloadableResourceBundleMessageSource` UTF-8 (`classpath:i18n/messages`, `cacheSeconds=3600`); ativar `app.framework.studio.show-i18n-diagnostics=true` exibe a barra de diagnóstico em `/system/studio`.

---

## 5. Vazão do Microbenchmark JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Caminho de Despacho (`ops/ms`) | Vazão Média Medida |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |

---

## 6. Armazenamento Multi-Cloud (`FileStorageController` — `LOCAL` / `S3` / `GCS`)

O `FileStorageController` (`/api/v1/storage/*`) expõe `POST /upload`, `GET /download/{fileId}`, `GET /metadata/{fileId}`, `GET /exists/{fileId}`, `DELETE /{fileId}` e `POST /presigned-url` via `app.framework.storage.provider` (`LOCAL`/`S3`/`GCS`) e `StorageCustomizer`.

> **Segurança em Produção:** Ative `app.framework.security.require-authenticated-api-paths: true` e proteja `/api/v1/storage/**` no `SecurityFilterChain`.
