# 07. Uniwersalny zestaw adopcyjny dla agentów AI (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` i `llms.txt`, `0.1.0`)

> **Języki**: **Polski** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Wszystkie 20 języków](../README.md) | [Pełny podręcznik (EN)](../../GUIDE_EN.md) | [Interaktywny portal (20 języków)](../../index.html#ai-agent-kit)

---

## 1. Cel i architektura zestawu (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) wyposaża **każdego agenta programistycznego AI i model LLM na rynku** w zweryfikowane maszynowo 1:1 fakty ze źródeł (`60` adnotacji w `6` dokładnych pakietach Java, `133` atrybuty, `40` automatycznych endpointów, dokładne klucze `app.framework.*` oraz sprawdzone zasady runtime `0.1.0`), gwarantując bezbłędną integrację bez halucynacji już przy pierwszym podejściu.

| Plik / Katalog | Rola |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Przegląd architektury: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` i JitPack `v0.1.0`, kontrakt 2 katalogów (`entity/` + `controller/`), 9 składalnych interfejsów, 6 pakietów adnotacji i 6 wbudowanych podsystemów |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Ścisłe reguły anty-halucynacyjne (`19.0 KB`, poniżej budżetu `24 KB`) opisujące każdą sprawdzoną pułapkę runtime |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Progresywna umiejętność `spring-nwvmc-adoption` z 7 procedurami krok po kroku i 15-wierszową macierzą diagnostyki błędów |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 7-etapowa bramka weryfikacyjna przed oddaniem (Pre-Flight -> Projekt -> Pułapki Runtime -> Blokada Produkcji -> Wydajność -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) zweryfikowanych maszynowo dokumentów referencyjnych (60 adnotacji / 133 atrybuty, 40 endpointów + 13 operatorów kropkowych, YAML + Multi-Datasource, przepisy z `@MultiTenant` + 4-encyjnym DB-RBAC + `JwtTokenService`, oraz dokładne importy klas i SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Indeksy zgodne z `llmstxt.org` dla automatycznych crawlerów i agentów AI |

---

## 2. Instalacja 1 poleceniem bez klonowania (Zero-Clone 1-Liner)

Otwórz terminal **bezpośrednio w katalogu głównym projektu Spring Boot** i uruchom jedno z poniższych poleceń — bez klonowania repozytorium ani lokalnych plików (skrypt pobiera zweryfikowany zestaw prosto z `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Zainstaluj dla WSZYSTKICH agentów AI i modeli w bieżącym katalogu (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Lub wybierz pojedynczego agenta (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Dodaj -Force, aby nadpisać istniejące pliki adapterów w katalogu głównym (domyślnie są zachowywane)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Najpierw sklonuj (Offline / Firmowe proxy)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Uniwersalna macierz kompatybilności agentów AI i LLM

| Agent AI / IDE / Model | Źródło adaptera | Ścieżka docelowa w repozytorium | Automatycznie wykrywana umiejętność |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Wklej do System Prompt / Project Instructions | `llms.txt` |

---

## 4. 8 zweryfikowanych pułapek runtime wymuszanych przez `RULES.md`

1. **`@StateMachine.transitions` używa składni z dwukropkiem** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), nigdy `"FROM -> TO"`, a przejścia wywołuje się parametrem zapytania `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (nie w ciele JSON).
2. **Operatory zapytań używają składni kropkowej** (`retailPrice.gte=1000&productName.like=MacBook`), nigdy `__gte`.
3. **Wstrzykuj helpery `@AutoComponent` frameworka przez `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) i wywołuj `.getObject()` w czasie działania.
4. **Klasy `@Service` przechwytywane przez AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) muszą być **nie-final** i **`@Lazy`**, a każdy wstrzykujący je `@Component` również musi używać **`ObjectProvider<MyService>`** lub **`@Lazy`**. Nigdy nie dodawaj `@Transactional` na Helperach `public final class`.
5. **JWT deweloperski i testy**: endpoint tokenu to **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NIE `GET /system/studio/demo-token`); testy wywołują `jwtTokenService.generateToken(username, userId, roles)` (**`username` JAKO PIERWSZY**).
6. **Encje JPA rozszerzają `BaseAuditEntity`** (UUIDv7 `id`, soft-delete, kolumny audytu i `@Version` wbudowane); nigdy nie używaj `@Data` na `@Entity` i nie wymyślaj `@SoftDelete`.
7. **Automatyczne ścieżki CamelCase i zakres `readDto`**: `ECommerceOrder` mapuje się na `/api/v1/e-commerce-orders`; kontrolery z `readDto = X.class` rzutują wszystkie odpowiedzi przez `X`.
8. **Blokada produkcyjna**: utrzymuj `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` oraz `JWT_SECRET >= 32` bajtów UTF-8 w `application.yml` / `application-prod.yml` (włączaj Studio wyłącznie w `application-dev.yml`).

---

## 5. Protokół jakości SDD (Spec-Driven) i TDD (Test-Driven)

Każdy adapter wymusza dostarczanie Spec-First + Test-First w oparciu o `references/06-sdd-and-tdd-playbook.md` oraz szablony `templates/{spec,plan,tasks}.template.md`, eliminując ciche założenia AI i dryf kontraktów.

- **SDD — Tworzenie Oparte na Specyfikacji (`specs/<feature>/`):** 6-etapowa bramka (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): utwórz `spec.md` z kryteriami `REQ-ID` (`Given/When/Then`), zatrzymaj się na `[NEEDS CLARIFICATION]`, zbuduj macierz śledzenia 1:1 w `plan.md` i zweryfikuj zgodność z `/v3/api-docs`, `/metadata` i `/schema/zod`.
- **TDD — Red → Green → Refactor (4-poziomowa piramida testów):** Najpierw napisz nieprzechodzący test JUnit 5 / `MockMvc` z `@DisplayName("REQ-XXX: ...")` (dla błędów najpierw test regresji), wdróż minimalny kod deklaratywny do GREEN i zrefaktoryzuj. Obejmuje 4 poziomy: Unit, Bezpieczeństwo/Workflow, Dryf Kontraktu oraz Współbieżność `@DistributedLock` + JMeter `0.0%`, bez `@Disabled`.
- **Playbook i Szablony:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
