# Changelog

All notable changes to `io.github.natswarchuan:spring-nwvmc` are documented in this file following [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-11-25

### Added
- **Official Maven Central Release (`io.github.natswarchuan:spring-nwvmc:0.1.0`)**: Published signed JAR, Sources JAR, Javadoc JAR, and CycloneDX 1.6 SBOM via Sonatype Central Portal (no custom `<repositories>` block required).
- **Official GitHub Pages Documentation Portal (`https://natswarchuan.github.io/Spring-NWVMC-document/`)**: 34 topic-focused Hub-and-Spoke pages across 8 sections in 20 languages (including RTL `ar`, `fa`, `ur`), 133 deep annotation attribute specification cards, 16-step continuous walkthrough, and dedicated `#ai-agent-kit` page.
- **Universal AI-Agent Adoption Kit (`ai-agent-kit/` & `llms.txt`)**: Model-agnostic `INTRO.md`, `RULES.md`, `SKILL.md`, `CHECKLIST.md`, 5 machine-verified references (`01..05` including 60 annotations / 133 attributes and zero-`javap` non-annotation class/SPI import catalog), 8 drop-in adapters (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Cursor `.mdc`, GitHub Copilot, Windsurf, Cline/Roo Code, Generic LLM System Prompt), and 1-command installers (`install.ps1` / `install.sh`), empirically validated in a clean-room greenfield build (**NovaMart Multi-Merchant E-Commerce**, 10 modules including 4-entity Dynamic DB-RBAC + Apache JMeter `0.0%` error rate).
- **Runtime Hardening (`586` Surefire unit tests)**:
  - `@RateLimit` dynamic partitioning (`IP`/`USER`/`TENANT`/`GLOBAL`/`#SpEL`) + `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and RFC 6585 `Retry-After` on HTTP `429`.
  - DB-RBAC fail-fast duplicate single-valued marker validator across all 14 marker annotations (`DatabaseRbacFailFastValidatorUtil`).
  - `@EntityCircuitBreaker` and `@EntityRetry` 4xx `BaseBusinessException` immunity (`CircuitBreakerErrorFilterUtil`, `DeclarativeRetryHelper` rethrows unwrapped 4xx client business exceptions directly instead of wrapping into `500 RetryExhaustedException`).
  - `@HttpCacheable` full header preservation (`ResponsePayloadWriterUtil.copyResponseEntityHeaders`), automatic `ApiResponse` wrapping, deterministic `ApiResponse.getData()` ETag hashing ignoring random per-request `traceId`/`timestamp` (`HttpCacheResponseReflectionUtil`), and zero double-wrapping of `ResponseEntity` (`DynamicResponseUtil`).
  - Split method-level and class-level `@TargetDataSource` AspectJ pointcuts in `DataSourceRoutingAspect`.

## [0.0.3] - 2026-11-15

### Added
- **Stage 1 — Hot-Path Optimization & GraalVM AOT**: Replaced reflective hot-path dispatch with `MethodHandleCacheUtil`, `LambdaAccessorUtil`, and `NwvmcRuntimeHintsRegistrar` (`META-INF/native-image`). Fixed varargs `MethodHandle.asFixedArity()` dispatch for `SecurityCustomizerProxyBridge`.
- **Stage 2 — Escape Hatch & Standard Code Ejection**: Added `@ServiceOverride` (`beanName`, `methodName`, `bypassAutoDispatch`), `EscapeHatchDispatchHelper`, `ControllerEjectionHelper`, and `DevEjectionController` (`GET /system/studio/eject`) to export standalone Spring MVC controller/service/repository scaffolds.
- **Database-Driven Declarative RBAC & Spring Security Customization**: Added 18 DB RBAC annotations (`@SecurityRoleEntity`, `@SecurityPermissionEntity`, `@SecurityUserRoleEntity`, `@SecurityPolicyEntity` and field tags incl. `@PermissionFieldMask`), `DynamicDatabaseRbacProviderHelper`, auto-eviction `DatabaseRbacCacheInvalidationListener`, and `SecurityIdentityCustomizer` authority augmentation & voter hooks (`augmentSubjectAuthorities`, `evaluateCustomAuthorization`).
- **Stage 3 — Production Guardrails**:
  - `QueryGuardrailProperties` & `QueryGuardrailEnforcerUtil` enforcing filter caps, join depth, and page-size bounds.
  - `EntityFailFastValidatorUtil` & `ComputedFieldFailFastUtil` validating entity metadata at startup.
  - `SurfaceAccessGuardrailUtil` & `SecurityExposurePolicyBridge` locking down `/system/studio` and `/api/v1/auth/token` in non-demo profiles.
  - `ExceptionCauseUnwrapperUtil` preserving full server-side stack traces while sanitizing client JSON responses.
- **Stage 4 — Enterprise Readiness**:
  - **Micrometer Metrics** (`DynamicEntityMetricsHelper`, `MetricConstant`) instrumenting entity operations, rate limiting, circuit breakers, and HTTP caching.
  - **IDE Config Metadata** (`spring-boot-configuration-processor` emitting `META-INF/spring-configuration-metadata.json` for `app.framework.*` and `spring-nwvmc.human-policies`).
  - **Zod Schema & Typed Fetch Client Codegen**: Added `GET /schema/zod` and `GET /schema/client` via `ZodAndClientGeneratorUtil` (`40` declared `@Auto*` contracts per entity: `15` Read in `AutoApiReadController` + `10` Write/Batch in `AutoWriteApi`/`AutoBatchApi` + `11` Enterprise in `AutoApiEnterpriseController` + `4` Export/Import in `AutoExportImportApi`; `38` exposed by default in Swagger/Studio).
  - **Runtime Hardening & Contract Projection (`P1.1`–`P2.3`)**: Enforced `@AutoRestController(readDto, createDto, updateDto)` at runtime via `ControllerDtoContractUtil`, deterministic entity cache keys & scoped eviction in `AutoCacheAspect` / `DynamicEntityCrudServiceImpl`, full `@MultiTenant`/RLS/ownership/masking parity in `DynamicGraphQLExecutionHelper` / `GraphQLSecurityEnforcementHelper`, bounded distinct/analytics/export fetches, `?expand=` & `/keyset?sort=` validation, `AtomicBoolean` single-flight drain retry in `TransactionalOutboxHelper`, and nested FK stub resolution in chunked batch validation.
- **Stage 5 — OSS Production Release**:
  - Migrated Maven coordinates to `io.github.natswarchuan:spring-nwvmc:0.0.3`.
  - Added CycloneDX SBOM generation (`cyclonedx-maven-plugin`), `.github/workflows/ci-matrix.yml` (Spring Boot `3.2.5`, `3.3.5`, `3.4.0`), and JMH throughput microbenchmarks (`DynamicProxyThroughputBenchmarkTest`).
  - Synchronized all 20 `/system/studio` language bundles (`messages*.properties`) and upgraded `docs/` portal to all 20 languages including RTL (`ar`, `fa`, `ur`).

## [0.0.2] - 2026-11-08

### Added
- Initial pure-Java runtime proxy framework, OData filtering, keyset pagination, GraphQL engine, multi-cloud storage (`LOCAL` / S3 / GCS), and 20-language `/system/studio`.
