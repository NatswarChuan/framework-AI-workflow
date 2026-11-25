# 07. Universal AI-Agent Adoption Kit (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Languages**: **English** | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [All 20 Languages](../README.md) | [Complete Manual](../../GUIDE_EN.md) | [20-Language Interactive Portal](../../index.html#ai-agent-kit)

---

## 1. Purpose & Kit Architecture (`ai-agent-kit/`)

The **Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) equips **every AI coding agent and LLM on the market** with machine-verified framework facts (`60` annotations across `6` exact Java packages, `133` attributes, `40` auto-generated endpoints, exact `app.framework.*` YAML keys, and empirically proven `0.1.0` runtime guardrails) so teams integrate Spring-NWVMC accurately on the first attempt without hallucinated annotations or runtime surprises.

| File / Directory | Role |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Architecture orientation: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `0.1.0`, 2-Directory Contract (`entity/` + `controller/`), 9 composable capability interfaces (`AutoReadApi`..`AutoAiApi`), 6 annotation packages, 11 built-in subsystems |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Strict anti-hallucination guardrails (`13.6 KB`, strictly under the `24 KB` agent rule budget) encoding every verified runtime pitfall |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Progressive-disclosure `spring-nwvmc-adoption` skill with 6 step-by-step adoption workflows + 10-row root-cause troubleshooting matrix |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 6-phase pre-handover sign-off gate (Pre-Flight -> Design -> Runtime Gotchas -> Production Security Lockdown -> Performance -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | 5 machine-verified deep references (60 annotations / 133 attributes, 40 endpoints + 13 dot operators, YAML + Multi-Datasource, verified cookbook including `@MultiTenant` + 4-entity DB-RBAC + `JwtTokenService`, and exact non-annotation class/constant/SPI imports) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | `llmstxt.org`-compliant entry points for automated AI crawlers and agent fetchers |

---

## 2. 1-Command Zero-Clone Installation into Any Spring Boot Project

Open a terminal **directly inside your Spring Boot project root** and paste either command below — no local clone or pre-existing files required (the script fetches the verified kit files straight from `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Install for ALL AI coding agents & models into the current directory (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Or target a single agent (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Pass -Force to overwrite existing root adapter files (default preserves existing files safely)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Clone First (Offline / Corporate Proxy)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Universal AI-Agent & LLM Compatibility Matrix

| AI Agent / IDE / Model | Adapter Source | Target Path in Your Repo | Auto-Discovered Skill |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Paste into System Prompt / Project Instructions | `llms.txt` |

---

## 4. Top 8 Verified Runtime Pitfalls Enforced by `RULES.md`

1. **`@StateMachine.transitions` uses colon syntax** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), never `"FROM -> TO"`, and triggers transitions via query param `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (not JSON body).
2. **Query operators use dot syntax** (`retailPrice.gte=1000&productName.like=MacBook`), never `__gte`.
3. **Inject framework `@AutoComponent` helpers via `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) and call `.getObject()` at runtime.
4. **AOP-intercepted consumer `@Service` classes** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) must be **non-final** and **`@Lazy`** (with class-level `@TargetDataSource` when targeting `REPLICA` on `0.1.0`), AND any `@Component` injecting them must also use **`ObjectProvider<MyService>`** or **`@Lazy`**. Never place `@Transactional` on `public final class` Helpers.
5. **Dev JWT & Testing**: The dev token endpoint is **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NOT `GET /system/studio/demo-token`); tests call `jwtTokenService.generateToken(username, userId, roles)` (**`username` FIRST**).
6. **JPA entities extend `BaseAuditEntity`** (UUIDv7 `id`, soft-delete, audit columns, `@Version` built-in); never use `@Data` on `@Entity` and never invent `@SoftDelete`.
7. **CamelCase auto base paths & `readDto` scoping**: `ECommerceOrder` resolves to `/api/v1/e-commerce-orders`; controllers declaring `readDto = X.class` project all responses through `X`.
8. **Production lockdown**: keep `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, and `JWT_SECRET >= 32` UTF-8 bytes in `application.yml` / `application-prod.yml` (enable Studio only in `application-dev.yml`).
