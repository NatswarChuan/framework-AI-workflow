# Changelog

All notable changes to `io.github.natswarchuan:spring-nwvmc` are documented in this file following [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-15

### Added
- **Stage 1 — Hot-Path Optimization & GraalVM AOT**: Replaced reflective hot-path dispatch with `MethodHandleCacheUtil`, `LambdaAccessorUtil`, and `NwvmcRuntimeHintsRegistrar` (`META-INF/native-image`). Fixed varargs `MethodHandle.asFixedArity()` dispatch for `SecurityCustomizerProxyBridge`.
- **Stage 2 — Escape Hatch & Standard Code Ejection**: Added `@ServiceOverride` (`targetBean`, `beanName`, `methodName`, `bypassAutoDispatch`), `EscapeHatchDispatchHelper`, `ControllerEjectionHelper`, and `DevEjectionController` (`GET /system/studio/eject`) to export standalone Spring MVC controller/service/repository scaffolds.
- **Stage 3 — Production Guardrails**:
  - `QueryGuardrailProperties` & `QueryGuardrailEnforcerUtil` enforcing filter caps, join depth, and page-size bounds.
  - `EntityFailFastValidatorUtil` & `ComputedFieldFailFastUtil` validating entity metadata at startup.
  - `SurfaceAccessGuardrailUtil` & `SecurityExposurePolicyBridge` locking down `/system/studio` and `/api/v1/auth/token` in non-demo profiles.
  - `ExceptionCauseUnwrapperUtil` preserving full server-side stack traces while sanitizing client JSON responses.
- **Stage 4 — Enterprise Readiness**:
  - **Micrometer Metrics** (`DynamicEntityMetricsHelper`, `MetricConstant`) instrumenting entity operations, rate limiting, circuit breakers, and HTTP caching.
  - **IDE Config Metadata** (`spring-boot-configuration-processor` emitting `META-INF/spring-configuration-metadata.json` for `app.framework.*` and `spring-nwvmc.human-policies`).
  - **Zod Schema & Typed Fetch Client Codegen**: Added `GET /schema/zod` and `GET /schema/client` via `ZodAndClientGeneratorUtil` (`40` declared `@Auto*` contracts per entity: `17` Read + `11` Write + `12` Enterprise; `38` exposed by default in Swagger/Studio).
- **Stage 5 — OSS Production Release**:
  - Migrated Maven coordinates to `io.github.natswarchuan:spring-nwvmc:1.0.0`.
  - Added CycloneDX SBOM generation (`cyclonedx-maven-plugin`), `.github/workflows/ci-matrix.yml` (Spring Boot `3.2.5`, `3.3.5`, `3.4.0`), and JMH throughput microbenchmarks (`DynamicProxyThroughputBenchmarkTest`).
  - Synchronized all 20 `/system/studio` language bundles (`messages*.properties`) and upgraded `docs/` portal to all 20 languages including RTL (`ar`, `fa`, `ur`).

## [0.0.2] - 2026-11-08

### Added
- Initial pure-Java runtime proxy framework, OData filtering, keyset pagination, GraphQL engine, multi-cloud storage (`LOCAL` / S3 / GCS), and 20-language `/system/studio`.
