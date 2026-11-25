# 04. Sécurité, Stockage Multi-Cloud, `@ServiceOverride`, Métriques et i18n 20 Langues (`0.1.0`)

> **Langues**: **Français** | [English](../en/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Tiếng Việt](../vi/04_ADVANCED_ENTERPRISE_FEATURES.md) | [日本語](../ja/04_ADVANCED_ENTERPRISE_FEATURES.md) | [中文](../zh/04_ADVANCED_ENTERPRISE_FEATURES.md) | [Les 20 Langues](../README.md) | [Manuel Complet](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#security-rbac)

---

## 1. Sécurité NIST Niveau 2, RBAC Dynamique en Base, Verrouillage et Anti-Scanner

- **`@EntitySecurity`, `@FieldSecurity` et `@MultiTenant`** : RBAC déclaratif par entité (`readRoles`, `writeRoles`, `deleteRoles`, `permissions`, composable via méta-annotations), garde de propriété (`ownerField`), masquage/nullification de colonnes (`viewRoles`, `maskPattern`, `nullifyInsteadOfMask`) et isolation `@MultiTenant` fail-closed (`403` si absent, écrasement anti-usurpation à la création et protection IDOR sur les accès par ID).
- **RBAC Dynamique en Base de Données (`DynamicDatabaseRbacProviderHelper`)** : Annotez 4 entités JPA avec `@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity` et `@SecurityPolicyEntity` ainsi que leurs marqueurs. Applique la priorité stricte `DENY` > `ALLOW`, le contexte `X-Tenant-ID`, l’invalidation automatique L1 Caffeine via `DatabaseRbacCacheInvalidationListener`, la coexistence non destructive avec `SecurityFilterChain` via `PureJavaSecurityFilterBridge` et l’extension via `SecurityIdentityCustomizer` (`app.framework.security.dynamic-database-rbac-enabled=true`).
- **Verrouillage Sécurisé par Défaut (`DevStudioProperties` + `SurfaceAccessGuardrailUtil`)** : Avec `app.framework.studio.enabled=false` (défaut), `SecurityExposurePolicyBridge` bloque `/system/**` non authentifié en `401` et `StartupDiagnosticsUtil` renvoie `404 Not Found` (`403` sans rôle admin) ; avec `demo-token-endpoint-enabled=false`, `POST /api/v1/auth/token` renvoie `404`.
- **Déballage et Assainissement des Erreurs** : `ExceptionCauseUnwrapperUtil` journalise la cause interne complète côté serveur tout en renvoyant un `ApiResponse<Void>` assaini aux clients.
- **CORS SPA & Idempotence (`SecurityFilterChainBridge`)** : Autorise des motifs d’origine configurables (`*`) avec `Authorization`, `Idempotency-Key`, `X-Idempotency-Key`, `X-Language`, `X-Tenant-ID`, `traceparent` et `X-Request-ID`.

---

## 2. Porte de Sortie `@ServiceOverride` et Éjection MVC Standard (`GET /system/studio/eject`)

Lorsqu’un endpoint individuel dépasse la sémantique CRUD dynamique :

1. **`@ServiceOverride` sur Place** : Annotez toute méthode de `AutoApiController<E>` avec `@ServiceOverride(targetBean, beanName, methodName, bypassAutoDispatch)` afin que `EscapeHatchDispatchHelper` redirige l’appel via `MethodHandleCacheUtil`.
2. **Éjection de Code Standard (`/system/studio/eject`)** : Appelez `GET /system/studio/eject?target=<EntityOrControllerName>` pour exporter 5 fichiers Spring MVC autonomes (`DTO`, `Repository`, `Service`, `ServiceImpl`, `Controller`) via `ControllerEjectionHelper`.

---

## 3. Observabilité Micrometer (`DynamicEntityMetricsHelper` & `MetricConstant` — 11 Métriques)

| Métrique | Type | Étiquettes | Portée |
| :--- | :--- | :--- | :--- |
| `dynamic.entity.requests.total` | Counter | `entity`, `operation`, `status` | Invocations CRUD des entités dynamiques |
| `dynamic.entity.duration.seconds` | Timer | `entity`, `operation`, `status` | Latence d’exécution de bout en bout |
| `nwvmc.proxy.request.duration` | Timer | `entity`, `operation`, `status` | Latence du contrôleur proxy dynamique |
| `nwvmc.cache.http.requests` | Counter | `outcome` (`HIT` / `MISS`) | Résultat d’évaluation ETag de `@HttpCacheable` (`HIT` / `MISS`) |
| `nwvmc.outbox.pending.events` | Gauge | — | Événements en attente dans l’outbox transactionnel |
| `nwvmc.outbox.dispatch.duration` | Timer | — | Latence d’envoi par lots de l’outbox |
| `nwvmc.resilience.circuitbreaker.state` | Gauge | `circuit` | Code d’état (`0=CLOSED`, `1=HALF_OPEN`, `2=OPEN`) |
| `nwvmc.ratelimit.rejected.total` | Counter | `partition` | Requêtes rejetées dépassant le quota de fenêtre glissante |
| `framework.outbox.dispatched.total` | Counter | — | Total cumulé des événements outbox envoyés avec succès |
| `framework.realtime.active.connections` | Gauge | — | Connexions SSE actives (`SseEmitterRegistryHelper`) |
| `framework.datasource.routing.total` | Counter | `datasource` | Compteur optionnel de routage datasource Primary / Replica / Tenant |

---

## 4. `/system/studio` en 20 Langues, Support RTL et Localisation Hôte (`i18n/`)

- **20 Locales Intégrées (`I18nConstant`)** : `en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl` (`ar`, `fa`, `ur` activent `dir="rtl"`).
- **Résolution Déterministe de Locale (`LocaleResolutionUtil` & `HeaderLocaleResolver`)** : `?lang=` -> `X-Language` -> cookie `NWVMC_LANG` -> `Accept-Language` -> `app.framework.i18n.default-locale` (`en`). Les balises inconnues basculent sans erreur sur `en`.
- **Personnalisation de l’Application Hôte** : `I18nConfig` configure un `ReloadableResourceBundleMessageSource` UTF-8 (`classpath:i18n/messages`, `cacheSeconds=3600`). Activer `app.framework.studio.show-i18n-diagnostics=true` affiche la barre de diagnostic dans `/system/studio`.

---

## 5. Débit Microbenchmark JMH `1.37` (`DynamicProxyThroughputBenchmarkTest`)

| Chemin de Dispatch (`ops/ms`) | Débit Moyen Mesuré |
| :--- | :--- |
| `measureVanillaDirectDispatch` | `432.825 ops/ms` |
| `measureCachedMethodHandleDispatch` | `182.914 ops/ms` |
| `measureDynamicProxyServiceOverrideDispatch` | `68.267 ops/ms` |
| `measureDynamicProxyDefaultDispatch` | `52.730 ops/ms` |
