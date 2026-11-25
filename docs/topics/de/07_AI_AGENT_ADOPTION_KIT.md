# 07. Universelles AI-Agent-Adoptionskit (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Sprachen**: **Deutsch** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Alle 20 Sprachen](../README.md) | [Vollständiges Handbuch](../../GUIDE_EN.md) | [Interaktives Portal (20 Sprachen)](../../index.html#ai-agent-kit)

---

## 1. Zweck & Kit-Architektur (`ai-agent-kit/`)

Das **Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) stattet **jeden KI-Programmieragenten und jedes LLM am Markt** mit maschinell 1:1 gegen den Quellcode geprüften Fakten aus (`60` Annotationen in `6` exakten Java-Packages, `133` Attribute, `40` Auto-Endpunkte, exakte `app.framework.*`-Keys und bewährte `0.1.0`-Laufzeitregeln), damit Teams Spring-NWVMC beim ersten Versuch fehlerfrei und ohne Halluzinationen integrieren.

| Datei / Verzeichnis | Aufgabe |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Architektur-Orientierung: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `v0.1.0`, Zwei-Verzeichnis-Vertrag (`entity/` + `controller/`), 9 kombinierbare Interfaces, 6 Annotations-Packages, 11 integrierte Subsysteme |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Strenge Anti-Halluzinations-Leitplanken (`17.2 KB`, strikt unter dem `24 KB`-Limit) für jede verifizierte Laufzeitfalle |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Progressive-Disclosure-Skill `spring-nwvmc-adoption` mit 6 Schritt-für-Schritt-Workflows + 10-zeiliger Fehlerdiagnose-Matrix |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 6-stufige Übergabe-Checkliste (Pre-Flight -> Design -> Laufzeitfallen -> Produktions-Lockdown -> Performance -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 5 maschinell geprüfte Tiefenreferenzen (60 Annotationen / 133 Attribute, 40 Endpunkte + 13 Punkt-Operatoren, YAML + Multi-Datasource, Cookbook inkl. `@MultiTenant` + 4-Entitäten-DB-RBAC + `JwtTokenService`, sowie exakte Nicht-Annotations-Imports & SPIs) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | `llmstxt.org`-konforme Einstiegspunkte für KI-Crawler und Agenten |

---

## 2. 1-Befehl-Installation ohne Klonen (Zero-Clone 1-Liner)

Öffnen Sie ein Terminal **direkt im Stammverzeichnis Ihres Spring-Boot-Projekts** und führen Sie einen der folgenden Befehle aus — kein lokaler Klon erforderlich (das Skript lädt die verifizierten Kit-Dateien direkt von `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Für ALLE KI-Coding-Agenten & Modelle in das aktuelle Verzeichnis (".") installieren
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Oder gezielt einen einzelnen Agenten wählen (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Mit -Force vorhandene Root-Adapter überschreiben (standardmäßig werden bestehende Dateien sicher behalten)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Zuerst Klonen (Offline / Unternehmens-Proxy)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Universelle Kompatibilitätsmatrix für KI-Agenten & LLMs

| KI-Agent / IDE / Modell | Adapter-Quelle | Zielpfad im Projekt | Automatisch geladene Skill |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | In System Prompt / Project Instructions einfügen | `llms.txt` |

---

## 4. Die 8 wichtigsten verifizierten Laufzeitregeln aus `RULES.md`

1. **`@StateMachine.transitions` nutzt Doppelpunkt-Syntax** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), niemals `"FROM -> TO"`, und löst Übergänge per Query-Parameter `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` aus (kein JSON-Body).
2. **Filteroperatoren nutzen Punkt-Syntax** (`retailPrice.gte=1000&productName.like=MacBook`), niemals `__gte`.
3. **Framework-`@AutoComponent`-Helper über `ObjectProvider<T>` injizieren** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) und zur Laufzeit `.getObject()` aufrufen.
4. **AOP-abgefangene `@Service`-Klassen** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) müssen **nicht-final** und **`@Lazy`** sein, und jeder injizierende `@Component` muss ebenfalls **`ObjectProvider<MyService>`** oder **`@Lazy`** nutzen. Niemals `@Transactional` auf `public final class` Helpers setzen.
5. **Dev-JWT & Tests**: Der Dev-Token-Endpunkt lautet **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NICHT `GET /system/studio/demo-token`); Tests rufen `jwtTokenService.generateToken(username, userId, roles)` auf (**`username` ZUERST**).
6. **JPA-Entitäten erweitern `BaseAuditEntity`** (UUIDv7-`id`, Soft-Delete, Audit-Spalten, `@Version` integriert); niemals `@Data` auf `@Entity` nutzen und kein `@SoftDelete` erfinden.
7. **CamelCase-Routen & `readDto`-Bereich**: `ECommerceOrder` wird zu `/api/v1/e-commerce-orders`; Controller mit `readDto = X.class` projizieren sämtliche Antworten durch `X`.
8. **Produktions-Lockdown**: `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` und `JWT_SECRET >= 32` UTF-8-Bytes in `application.yml` / `application-prod.yml` belassen (Studio nur in `application-dev.yml` aktivieren).

---

## 5. SDD- (Spec-Driven) & TDD- (Test-Driven) Qualitätsprotokoll

Jeder Adapter erzwingt Spec-First- + Test-First-Umsetzung über `references/06-sdd-and-tdd-playbook.md` und Vorlagen in `templates/{spec,plan,tasks}.template.md` — gegen stille KI-Annahmen, Vertragsdrift und ungetesteten Code.

- **SDD — Spezifikationsgetriebene Entwicklung (`specs/<feature>/`):** 6-Phasen-Gate (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): `spec.md` mit testbaren `REQ-ID`s (`Given/When/Then`) schreiben, bei `[NEEDS CLARIFICATION]` stoppen, 1:1-Rückverfolgbarkeit in `plan.md` erstellen und Live-Parität mit `/v3/api-docs`, `/metadata` & `/schema/zod` prüfen.
- **TDD — Red → Green → Refactor (4-Stufen-Testpyramide):** Schreibe zuerst einen fehlschlagenden JUnit-5-/`MockMvc`-Test mit `@DisplayName("REQ-XXX: ...")` (bei Bugs zuerst Regressionstest), implementiere minimalen deklarativen Code bis GRÜN und refaktoriere. Deckt 4 Stufen ab: Unit, Security/Workflow, Contract Drift sowie `@DistributedLock`-Nebenläufigkeit + JMeter `0.0%` ohne `@Disabled`.
- **Playbook & Templates:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
