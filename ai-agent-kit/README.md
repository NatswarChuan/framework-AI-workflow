# Spring-NWVMC (`0.1.0`) — Universal SDD + TDD AI-Agent Adoption Kit

> A universal, model-agnostic **SDD (Spec-Driven Development) + TDD (Test-Driven Development) + INTRO + RULES + SKILL + CHECKLIST + Multi-Agent Adapter Kit + `llms.txt`** that enables **every AI coding agent and LLM on the market** (Google Antigravity / Gemini, Anthropic Claude Code, OpenAI Codex / ChatGPT, Cursor, GitHub Copilot, Windsurf, Cline / Roo Code, DeepSeek, Qwen, Grok, Mistral, Ollama / Llama, Aider, Continue.dev, Amazon Q) to build on **Spring-NWVMC `0.1.0`** (*Next-Wave Virtual Multi-Controller*, `io.github.natswarchuan:spring-nwvmc:0.1.0` on Maven Central) with **spec-first clarity, red-green-refactor test discipline, zero hallucinated annotations, and zero runtime traps**.
>
> Grounded 1:1 in the verified source code of `controller-to-api-framework/` (`593` main / `257` test `.java` files, `586/586` unit tests) and validated via clean-room build of **NovaMart Multi-Merchant E-Commerce** (`controller-to-api-implementation/`, `23/23` integration & unit tests + `1,003`-request Apache JMeter smoke load run at `0.0%` error rate).

---

## 1. What Is Inside

| File / Folder | Role | When Loaded |
| :--- | :--- | :--- |
| **[`INTRO.md`](./INTRO.md)** | Architecture orientation: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` (no `v` prefix; optional JitPack mirror `v0.1.0` with `v` prefix), 2-Directory Contract (`entity/` + `controller/`), 9 composable capability interfaces, 6 annotation packages, 6 built-in platform endpoint groups, SDD+TDD overview | Read first for end-to-end orientation |
| **[`RULES.md`](./RULES.md)** | Hard **SDD + TDD protocol** (Spec-First, `[NEEDS CLARIFICATION]` ambiguity gate, `REQ-ID` traceability, Red → Green → Refactor, bug-fix regression-first, anti-cheating law) + strict anti-hallucination runtime & AppSec guardrails | Always loaded in project/system rules (`< 24 KB` budget) |
| **[`SKILL.md`](./SKILL.md)** | Progressive-disclosure `spring-nwvmc-adoption` runbook with **7 workflows** (**Workflow 0** SDD+TDD Loop + Workflows 1–6) & **15-row** root-cause troubleshooting matrix | Auto-discovered in `.agents/skills/` and `.claude/skills/` |
| **[`CHECKLIST.md`](./CHECKLIST.md)** | **7-phase** sign-off gate (Phase 0 SDD Spec → Pre-Flight → Design → Runtime Pitfalls → Production Security Lockdown → Performance & Multi-Pod Readiness → TDD 4-Tier Pyramid & Go-Live) | Run before spec sign-off, PR review, or release |
| **[`references/01-annotations-exact-matrix.md`](./references/01-annotations-exact-matrix.md)** | Machine-verified 1:1 reference of all **60 declarative annotations** across **6 exact Java packages** and **133 attributes** | Loaded on demand before declaring annotations |
| **[`references/02-endpoints-and-query-dsl.md`](./references/02-endpoints-and-query-dsl.md)** | All **40 auto-generated endpoints**, **13 dot-syntax filter operators** (`FilterOperatorConstant`: `.eq`, `.ne`, `.like`, `.startsWith`, `.endsWith`, `.gt`, `.gte`, `.lt`, `.lte`, `.in`, `.notIn`, `.between`, `.null`), GraphQL, Storage, Time-Travel, and Telemetry | Loaded when writing clients, frontends, or integration tests |
| **[`references/03-yaml-properties-and-profiles.md`](./references/03-yaml-properties-and-profiles.md)** | Exact `app.framework.*` and `spring-nwvmc.human-policies.*` YAML keys, hardened `application.yml` (`prod`) baseline, bootable `application-dev.yml`, `application-test.yml`, and Multi-Datasource setup | Loaded when configuring Spring Boot profiles and security |
| **[`references/04-cookbook-verified-patterns.md`](./references/04-cookbook-verified-patterns.md)** | Verified copy-paste Java recipes (Entity, ReadOnly DTO, `@HttpCacheable`, `@StateMachine`, `@CustomEndpoint`, `@DistributedLock`, Multi-Datasource `PRIMARY`+`REPLICA`, `@AutoCacheable`, `@Idempotent`, `@MultiTenant`, 4-entity DB-RBAC with `@EntitySecurity`, Outbox, Webhook, Spring AI, `JwtTokenService` + `MockMvc` tests) | Loaded when implementing specific capabilities |
| **[`references/05-imports-and-spi-contracts.md`](./references/05-imports-and-spi-contracts.md)** | Exact non-annotation class imports and signatures (`BaseBusinessException`, `StandardHttpStatus`, `UuidUtil`, `ApiResponse`, `*Constant`, `JwtTokenService`, `DynamicRoutingDataSource`, `DataSourceContextHolder`, `IdempotencyStoreProvider`, `OutboxEvent*`, AI/Webhook/RestClient DTOs, active vs telemetry SPIs) | Instant lookup — eliminates package guessing and `javap` inspection |
| **[`references/06-sdd-and-tdd-playbook.md`](./references/06-sdd-and-tdd-playbook.md)** | Complete **SDD** (`Specify → Clarify → Plan → Tasks → Contract-Sync` + enterprise scaling) & **TDD** (`Red → Green → Refactor`, 4-Tier Test Pyramid, Spec-vs-Runtime Drift tests, `RANDOM_PORT` + `RestClient` `@DistributedLock` concurrency race test, copy-paste JUnit 5 / `MockMvc` recipes) playbook | Loaded at the start of every feature or bug fix |
| **[`templates/`](./templates/)** | Ready-to-copy SDD starter templates: [`spec.template.md`](./templates/spec.template.md), [`plan.template.md`](./templates/plan.template.md), [`tasks.template.md`](./templates/tasks.template.md) | Copied into `specs/<feature-slug>/` before coding |
| **[`adapters/`](./adapters/)** | 8 drop-in instruction files tailored to every major AI coding agent and LLM (all enforcing SDD + TDD + Spring-NWVMC `0.1.0` rules) | Installed into your project root via the installer script |
| **[`../llms.txt`](../llms.txt)** | [`llmstxt.org`](https://llmstxt.org/)-compliant index for automated AI crawlers and agent fetchers | Consumed automatically from repository root or GitHub Pages |

---

## 2. Universal AI-Agent & LLM Compatibility Matrix

| AI Agent / IDE / Model | Adapter Source | Target Path in Your Project | Auto-Discovered Skill |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI / Gemini 2.5–3.x** | `adapters/GEMINI.md` + `adapters/AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/SKILL.md` |
| **Anthropic Claude Code (Opus / Sonnet / Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/SKILL.md` |
| **OpenAI Codex CLI / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/SKILL.md` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | Reads `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code, JetBrains, Coding Agent)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | Reads `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | Reads `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | Reads `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Ollama/Llama, Aider, Continue.dev, Amazon Q** | `adapters/GENERIC_LLM_PROMPT.md` | Installed to `.agents/skills/spring-nwvmc-adoption/GENERIC_LLM_PROMPT.md` when using `--agent generic`; paste into System Prompt / Project Instructions (+ upload `references/01`, `04`, `05`, `06` if supported) | N/A (self-contained prompt) |

---

## 3. 1-Command Zero-Clone Installation

Open a terminal **directly inside your Spring Boot project root** and run one of the commands below. No local clone or pre-existing files are required — the installer downloads each file once into a temporary staging folder (TLS 1.2 + retries + symlink protection) from `https://github.com/NatswarChuan/Spring-NWVMC-document`.

> **Tip:** Start with your specific tool (e.g., `-Agent cursor`, `claude`, `copilot`, `antigravity`, `codex`, `windsurf`, `cline`, or `generic` — installs `14`–`27` files cleanly), or pass `-Agent all` to install all `34` files across every agent ecosystem (`13` files in `.agents/skills/`, `13` in `.claude/skills/`, and `8` adapters). Skill tree files refresh on each run; existing root adapters are preserved unless `-Force` / `--force` is passed.

### Windows (PowerShell — run in PowerShell, NOT `cmd.exe`)

```powershell
# Recommended: target your specific AI tool (cursor | claude | copilot | antigravity | codex | windsurf | cline | generic | all)
$ErrorActionPreference='Stop'; $s=Join-Path $env:TEMP ("nwvmc-install-" + [guid]::NewGuid().ToString("N") + ".ps1"); try { [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent cursor } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Or install for ALL AI coding agents & models (34 files) into the current directory ("."):
$ErrorActionPreference='Stop'; $s=Join-Path $env:TEMP ("nwvmc-install-" + [guid]::NewGuid().ToString("N") + ".ps1"); try { [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }
```

### macOS / Linux / Git Bash

```bash
# Recommended: target your specific AI tool (cursor | claude | copilot | antigravity | codex | windsurf | cline | generic | all)
curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor

# Or install for ALL AI coding agents & models (34 files) into the current directory ("."):
curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all

# Add --force to overwrite existing root adapter files:
curl --proto '=https' --tlsv1.2 -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all --force
```

> **Enterprise Supply-Chain Hardening:** Never run unpinned `main` scripts blindly in audited CI/CD or regulated environments. Inspect `install.ps1` / `install.sh` first, or pin an immutable commit SHA in **BOTH** the download URL and `--ref` / `-Ref` (e.g., `REF="<commit-sha>"; curl --proto '=https' --tlsv1.2 -fsSL "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/${REF}/ai-agent-kit/install.sh" | bash -s -- --target . --agent all --ref "${REF}"`), or clone & audit locally first below.

### Offline / Corporate Proxy (`git clone`) or Manual Setup

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

Or copy manually from the `Spring-NWVMC-document` repository:
1. Copy `ai-agent-kit/{SKILL.md, INTRO.md, RULES.md, CHECKLIST.md, references/, templates/}` into `<your-project>/.agents/skills/spring-nwvmc-adoption/` (and `.claude/skills/spring-nwvmc-adoption/` if using Claude Code).
2. Copy the matching file from `ai-agent-kit/adapters/` to the target path shown in Section 2.

---

## 4. Ready-to-Paste First Prompts for Your AI Agent

Once installed into your Spring Boot project, send the prompts below in order to your AI coding agent:

### Prompt 1 — Bootstrap Spring-NWVMC in a New or Existing Spring Boot App (Run First!)
> *"Read the `spring-nwvmc-adoption` skill (`INTRO.md`, `RULES.md`, `SKILL.md`, `references/03-yaml-properties-and-profiles.md`, `references/06-sdd-and-tdd-playbook.md`) and integrate `io.github.natswarchuan:spring-nwvmc:0.1.0` (Maven Central) into this Spring Boot project: update `pom.xml` with Java 21 + `<parameters>true</parameters>`, create a hardened `application.yml`, a bootable `application-dev.yml` (H2 + Dev Studio + fallback `JWT_SECRET`), and `application-test.yml`, draft `specs/product-catalog/spec.md`, write failing `MockMvc` tests first (RED), implement `ProductCatalog` entity + `ProductCatalogController` (GREEN), and verify `mvn clean verify` passes 100%."*

### Prompt 2 — Spec-First (SDD) + Test-First (TDD) New Feature Delivery
> *"Follow Workflow 0 and `references/06-sdd-and-tdd-playbook.md` in `spring-nwvmc-adoption` to build a `DiscountVoucher` feature using SDD + TDD: first draft `specs/discount-voucher/spec.md` with `REQ-ID` Given/When/Then criteria and stop for any `[NEEDS CLARIFICATION]` items; after approval, generate `plan.md` (with Traceability Matrix) and `tasks.md`, then execute every slice strictly RED (failing JUnit 5 / `MockMvc` test) → GREEN (2-Directory `entity/` + `controller/` on `io.github.natswarchuan:spring-nwvmc:0.1.0`) → REFACTOR + Tier 3 OpenAPI/Zod contract-drift test."*

### Prompt 3 — Production Security, SDD Contract Drift & Architecture Audit
> *"Audit this repository against `CHECKLIST.md` (Phases 0–6) and `RULES.md` in `spring-nwvmc-adoption`: verify `specs/*/spec.md` matches live `/v3/api-docs` & `/schema/zod` with zero drift, verify production lockdown (`studio.enabled=false`, `demo-token-endpoint-enabled=false`, `default-deny-unannotated-entities=true`, `require-authenticated-api-paths=true`, `JWT_SECRET >= 32` bytes, Springdoc disabled, `@EntitySecurity` on all entities including DB-RBAC tables, `@MultiTenant` JWT claim check, `HEADER_X_IDEMPOTENCY_KEY`, `ObjectProvider<T>` / `@Lazy` AOP rules), and confirm `mvn clean verify` passes 100% with zero `@Disabled` tests."*

---

## 5. Official Links

- **Interactive Documentation Portal (20 Languages):** https://natswarchuan.github.io/Spring-NWVMC-document/
- **AI-Agent Adoption Kit Web Guide:** https://natswarchuan.github.io/Spring-NWVMC-document/#ai-agent-kit
- **Maven Central Artifact:** https://central.sonatype.com/artifact/io.github.natswarchuan/spring-nwvmc
- **Framework Source Repository:** https://github.com/NatswarChuan/Spring-NWVMC
- **Documentation & Kit Repository:** https://github.com/NatswarChuan/Spring-NWVMC-document
