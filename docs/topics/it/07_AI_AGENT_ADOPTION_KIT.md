# 07. Kit Universale di Adozione per Agenti IA (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` e `llms.txt`, `0.1.0`)

> **Lingue**: **Italiano** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Tutte le 20 Lingue](../README.md) | [Manuale Completo](../../GUIDE_EN.md) | [Portale Interattivo (20 Lingue)](../../index.html#ai-agent-kit)

---

## 1. Scopo e Architettura del Kit (`ai-agent-kit/`)

Lo **Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) fornisce a **ogni agente di coding IA e LLM sul mercato** specifiche verificate automaticamente 1:1 sul codice sorgente (`60` annotazioni in `6` package Java esatti, `133` attributi, `40` endpoint automatici, chiavi `app.framework.*` e regole runtime verificate in `0.1.0`) per adottare Spring-NWVMC correttamente al primo tentativo senza allucinazioni.

| File / Directory | Ruolo |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Orientamento architetturale: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` e JitPack `v0.1.0`, contratto a 2 directory (`entity/` + `controller/`), 9 interfacce componibili, 6 package di annotazioni e 11 sottosistemi integrati |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Guardrail rigorosi anti-allucinazione (`13.6 KB`, sotto la soglia `24 KB`) con tutte le insidie runtime verificate |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Skill progressiva `spring-nwvmc-adoption` con 6 workflow passo-passo e matrice di risoluzione problemi a 10 cause radice |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Cancello di verifica in 6 fasi prima del rilascio (Pre-Flight -> Design -> Insidie Runtime -> Blocco Produzione -> Performance -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | 5 riferimenti approfonditi verificati via codice (60 annotazioni / 133 attributi, 40 endpoint + 13 operatori a punto, YAML + Multi-Datasource, ricettario con `@MultiTenant` + DB-RBAC 4 entità + `JwtTokenService`, e import esatti non-annotazione / SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Indici conformi `llmstxt.org` per crawler e agenti IA automatici |

---

## 2. Installazione in 1 Comando senza Clonare (Zero-Clone 1-Liner)

Apri un terminale **direttamente nella root del tuo progetto Spring Boot** ed esegui uno dei comandi seguenti — non serve clonare il repository né avere file locali (lo script scarica tutto da `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Installa per TUTTI gli agenti IA e modelli nella directory corrente (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Oppure scegli un singolo agente (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Aggiungi -Force per sovrascrivere gli adapter esistenti nella root (di default vengono preservati)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Clona Prima (Offline / Proxy Aziendale)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Matrice Universale di Compatibilità Agenti IA e LLM

| Agente IA / IDE / Modello | Sorgente Adapter | Percorso Destinazione nel Repo | Skill Rilevata Automaticamente |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Incolla in System Prompt / Project Instructions | `llms.txt` |

---

## 4. Le 8 Insidie Runtime Verificate Imposte da `RULES.md`

1. **`@StateMachine.transitions` usa la sintassi con i due punti** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), mai `"FROM -> TO"`, e attiva le transizioni tramite query param `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (non corpo JSON).
2. **Gli operatori di query usano la sintassi con il punto** (`retailPrice.gte=1000&productName.like=MacBook`), mai `__gte`.
3. **Inietta gli helper `@AutoComponent` del framework tramite `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) e invoca `.getObject()` a runtime.
4. **Le classi `@Service` intercettate da AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) devono essere **non-final** e **`@Lazy`**, e ogni `@Component` che le inietta deve usare anch’esso **`ObjectProvider<MyService>`** o **`@Lazy`**. Non mettere mai `@Transactional` su Helper `public final class`.
5. **JWT di sviluppo e test**: l’endpoint del token è **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NON `GET /system/studio/demo-token`); i test chiamano `jwtTokenService.generateToken(username, userId, roles)` (**`username` PER PRIMO**).
6. **Le entità JPA estendono `BaseAuditEntity`** (UUIDv7 `id`, soft-delete, colonne audit e `@Version` integrati); non usare mai `@Data` su `@Entity` e non inventare `@SoftDelete`.
7. **Percorsi automatici CamelCase e ambito `readDto`**: `ECommerceOrder` corrisponde a `/api/v1/e-commerce-orders`; i controller con `readDto = X.class` proiettano tutte le risposte attraverso `X`.
8. **Blocco di produzione**: mantieni `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` e `JWT_SECRET >= 32` byte UTF-8 in `application.yml` / `application-prod.yml` (abilita Studio solo in `application-dev.yml`).
