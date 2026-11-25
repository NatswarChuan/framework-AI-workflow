# Spring-NWVMC (`0.1.0`) — Universal SDD + TDD AI-Agent Adoption Kit

> A universal, model-agnostic **SDD (Spec-Driven Development) + TDD (Test-Driven Development) + INTRO + RULES + SKILL + CHECKLIST + Multi-Agent Adapter Kit + `llms.txt`** that enables **every AI coding agent and LLM on the market** (Google Antigravity / Gemini, Anthropic Claude Code, OpenAI Codex / ChatGPT, Cursor, GitHub Copilot, Windsurf, Cline / Roo Code, DeepSeek, Qwen, Grok, Mistral, Ollama / Llama, Aider, Continue.dev, Amazon Q) to build on **Spring-NWVMC `0.1.0`** (`io.github.natswarchuan:spring-nwvmc:0.1.0` on Maven Central) with **spec-first clarity, red-green-refactor test discipline, zero hallucinated annotations, and zero runtime traps**.
>
> Grounded 1:1 in the verified source code of `controller-to-api-framework/` (`586/586` unit tests) and validated via clean-room build of **NovaMart Multi-Merchant E-Commerce** (`23/23` integration & unit tests + `1,003`-request Apache JMeter run at `0.0%` error rate).

---

## 1. What Is Inside

| File / Folder | Role | When Loaded |
| :--- | :--- | :--- |
| **[`INTRO.md`](./INTRO.md)** | Architecture orientation: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` (and optional JitPack `v0.1.0` mirror), strict 2-Directory Contract (`entity/` + `controller/`), 9 composable capability interfaces, 6 annotation packages, 11 built-in subsystems, SDD+TDD overview | Read first for end-to-end orientation |
| **[`RULES.md`](./RULES.md)** | Hard **SDD + TDD protocol** (Spec-First, `[NEEDS CLARIFICATION]` ambiguity gate, `REQ-ID` traceability, Red → Green → Refactor, bug-fix regression-first, anti-cheating law) + strict anti-hallucination runtime guardrails | Always loaded in project/system rules (`< 24 KB` budget) |
| **[`SKILL.md`](./SKILL.md)** | Progressive-disclosure `spring-nwvmc-adoption` runbook with **Workflow 0 (SDD + TDD Loop)** + 6 implementation & troubleshooting workflows | Auto-discovered in `.agents/skills/` and `.claude/skills/` |
| **[`CHECKLIST.md`](./CHECKLIST.md)** | **7-phase** sign-off gate (Phase 0 SDD Spec → Pre-Flight → Design → Runtime Pitfalls → Production Security Lockdown → Performance → TDD 4-Tier Pyramid & Contract-Drift Go-Live) | Run before spec sign-off, PR review, or release |
| **[`references/01-annotations-exact-matrix.md`](./references/01-annotations-exact-matrix.md)** | Machine-verified 1:1 reference of all **60 declarative annotations** across **6 exact Java packages** and **133 attributes** | Loaded on demand before declaring annotations |
| **[`references/02-endpoints-and-query-dsl.md`](./references/02-endpoints-and-query-dsl.md)** | All **40 auto-generated endpoints**, **13 dot-syntax filter operators** (`.gte`, `.like`, …), GraphQL, Storage, Time-Travel, and verified `curl` examples | Loaded when writing clients, frontends, or integration tests |
| **[`references/03-yaml-properties-and-profiles.md`](./references/03-yaml-properties-and-profiles.md)** | Exact `app.framework.*` and `spring-nwvmc.human-policies.*` YAML keys, secure `application.yml` (`prod`) baseline, `application-dev.yml`, and Multi-Datasource setup | Loaded when configuring Spring Boot profiles and security |
| **[`references/04-cookbook-verified-patterns.md`](./references/04-cookbook-verified-patterns.md)** | Verified copy-paste Java recipes (Entity, ReadOnly DTO, `@HttpCacheable`, `@StateMachine`, `@CustomEndpoint`, `@DistributedLock`, Multi-Datasource `PRIMARY`+`REPLICA`, `@AutoCacheable`, `@Idempotent`, `@MultiTenant`, 4-entity DB-RBAC, Outbox, Webhook, Spring AI, `JwtTokenService` + `MockMvc` tests) | Loaded when implementing specific capabilities |
| **[`references/05-imports-and-spi-contracts.md`](./references/05-imports-and-spi-contracts.md)** | Exact non-annotation class imports and signatures (`BaseBusinessException`, `StandardHttpStatus`, `UuidUtil`, `ApiResponse`, `*Constant`, `JwtTokenService`, `DynamicRoutingDataSource`, `OutboxEvent*`, AI/Webhook/RestClient DTOs, 8 `*Customizer` SPIs) | Instant lookup — eliminates package guessing and `javap` inspection |
| **[`references/06-sdd-and-tdd-playbook.md`](./references/06-sdd-and-tdd-playbook.md)** | Complete **SDD** (`Specify → Clarify → Plan → Tasks → Contract-Sync`) & **TDD** (`Red → Green → Refactor`, 4-Tier Test Pyramid, Spec-vs-Runtime Drift tests, `@DistributedLock` concurrency race test, copy-paste JUnit 5 / `MockMvc` recipes) playbook | Loaded at the start of every feature or bug fix |
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
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Ollama/Llama, Aider, Continue.dev, Amazon Q** | `adapters/GENERIC_LLM_PROMPT.md` | Paste into System Prompt / Project Instructions (attach `references/01` + `04` + `05` if file upload is supported) | N/A (self-contained prompt) |

---

## 3. 1-Command Zero-Clone Installation

Open a terminal **directly inside your Spring Boot project root** and run one of the commands below. No local clone or pre-existing files are required — the installer automatically downloads all verified kit files directly from `https://github.com/NatswarChuan/Spring-NWVMC-document`.

### Windows (PowerShell)

```powershell
# Install for ALL AI coding agents & models into the current directory (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Or target a single agent (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Add -Force to overwrite existing root adapter files (default safely preserves existing files)
```

### macOS / Linux / Git Bash

```bash
# Install for ALL AI coding agents & models into the current directory (".")
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all

# Or target a single agent:
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor

# Add --force to overwrite existing root adapter files:
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all --force
```

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

Once installed into your Spring Boot project, send any of the prompts below to your AI coding agent:

### Prompt 1 — Spec-First (SDD) + Test-First (TDD) New Feature Delivery
> *"Follow Workflow 0 and `references/06-sdd-and-tdd-playbook.md` in `spring-nwvmc-adoption` to build a `DiscountVoucher` feature using SDD + TDD: first draft `specs/discount-voucher/spec.md` with `REQ-ID` Given/When/Then criteria and stop for any `[NEEDS CLARIFICATION]` items; after approval, generate `plan.md` (with Traceability Matrix) and `tasks.md`, then execute every slice strictly RED (failing JUnit 5 / `MockMvc` test) → GREEN (2-Directory `entity/` + `controller/` on `io.github.natswarchuan:spring-nwvmc:0.1.0`) → REFACTOR + Tier 3 contract-drift test."*

### Prompt 2 — Bootstrap Spring-NWVMC in a New or Existing Spring Boot App
> *"Read the `spring-nwvmc-adoption` skill (`INTRO.md`, `RULES.md`, `SKILL.md`) and integrate `io.github.natswarchuan:spring-nwvmc:0.1.0` (Maven Central) into this Spring Boot project: update `pom.xml` with `<parameters>true</parameters>`, create a production-hardened `application.yml` and a dev-only `application-dev.yml` enabling Dev Studio, draft `specs/product-catalog/spec.md`, write failing `MockMvc` tests first (RED), implement `Product` entity + `ProductController` (GREEN), and verify `mvn clean verify` passes 100%."*

### Prompt 3 — Production Security, SDD Contract Drift & Architecture Audit
> *"Audit this repository against `CHECKLIST.md` (Phases 0–6) and `RULES.md` in `spring-nwvmc-adoption`: verify `specs/*/spec.md` matches live `/v3/api-docs` & `/schema/zod` with zero drift, verify `app.framework.studio.enabled=false`, `demo-token-endpoint-enabled=false`, `JWT_SECRET >= 32` bytes, `@EntitySecurity`, `@FieldSecurity`, `ObjectProvider<T>` / `@Lazy` AOP rules, `readDto` scoping, and confirm `mvn clean verify` passes 100% with zero `@Disabled` tests."*

---

## 5. Official Links

- **Interactive Documentation Portal (20 Languages):** https://natswarchuan.github.io/Spring-NWVMC-document/
- **AI-Agent Adoption Kit Web Guide:** https://natswarchuan.github.io/Spring-NWVMC-document/#ai-agent-kit
- **Maven Central Artifact:** https://central.sonatype.com/artifact/io.github.natswarchuan/spring-nwvmc
- **Framework Source Repository:** https://github.com/NatswarChuan/Spring-NWVMC
- **Documentation & Kit Repository:** https://github.com/NatswarChuan/Spring-NWVMC-document
