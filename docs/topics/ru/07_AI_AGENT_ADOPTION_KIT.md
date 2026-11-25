# 07. Универсальный комплект внедрения для ИИ-агентов (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` и `llms.txt`, `0.1.0`)

> **Языки**: **Русский** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Все 20 языков](../README.md) | [Полное руководство](../../GUIDE_EN.md) | [Интерактивный портал (20 языков)](../../index.html#ai-agent-kit)

---

## 1. Назначение и архитектура комплекта (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) обеспечивает **любых ИИ-агентов разработки и LLM на рынке** машинно-проверенными 1:1 спецификациями из исходного кода (`60` аннотаций в `6` точных пакетах Java, `133` атрибута, `40` автоэндпоинтов, точные ключи `app.framework.*` и проверенные правила `0.1.0`), исключая галлюцинации и ошибки при первом же внедрении.

| Файл / Каталог | Назначение |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Обзор архитектуры: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` и JitPack `v0.1.0`, контракт 2 каталогов (`entity/` + `controller/`), 9 составных интерфейсов, 6 пакетов аннотаций и 11 встроенных подсистем |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Строгие защитные правила от галлюцинаций (`13.6 KB`, строго в пределах `24 KB`) с каждой подтверждённой ловушкой runtime |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Поэтапный навык `spring-nwvmc-adoption` с 6 рабочими сценариями и матрицей диагностики 10 типовых сбоев |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 6-этапный чек-лист приёмки перед релизом (Pre-Flight -> Проектирование -> Ловушки Runtime -> Блокировка продакшена -> Производительность -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | 5 глубоких справочников с машинной проверкой (60 аннотаций / 133 атрибута, 40 эндпоинтов + 13 точечных операторов, YAML + мульти-БД, рецепты с `@MultiTenant` + DB-RBAC из 4 сущностей + `JwtTokenService`, и точные импорты классов/SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Индексы стандарта `llmstxt.org` для автоматических краулеров и ИИ-агентов |

---

## 2. Установка одной командой без клонирования (Zero-Clone 1-Liner)

Откройте терминал **прямо в корне вашего Spring Boot проекта** и выполните одну из команд ниже — предварительное клонирование и локальные файлы не требуются (скрипт скачивает проверенный комплект с `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Установить для ВСЕХ ИИ-агентов и моделей в текущий каталог (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Или выбрать одного агента (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Добавьте -Force для перезаписи существующих корневых адаптеров (по умолчанию существующие файлы сохраняются)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Предварительное клонирование (Офлайн / Корпоративный прокси)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Универсальная матрица совместимости ИИ-агентов и LLM

| ИИ-агент / IDE / Модель | Источник адаптера | Путь назначения в проекте | Автоматический навык |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Вставить в System Prompt / Project Instructions | `llms.txt` |

---

## 4. 8 подтверждённых runtime-правил из `RULES.md`

1. **`@StateMachine.transitions` использует двоеточие** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), никогда `"FROM -> TO"`, а переходы вызываются через query-параметр `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (не в JSON-теле).
2. **Операторы фильтрации используют точечный синтаксис** (`retailPrice.gte=1000&productName.like=MacBook`), никогда `__gte`.
3. **Внедряйте фреймворковые `@AutoComponent`-хелперы через `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) и вызывайте `.getObject()` при обращении.
4. **Перехватываемые AOP классы `@Service`** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) должны быть **не-final** и **`@Lazy`**, а каждый внедряющий их `@Component` также обязан использовать **`ObjectProvider<MyService>`** или **`@Lazy`**. Никогда не ставьте `@Transactional` на `public final class` Helper.
5. **Dev JWT и тесты**: эндпоинт выпуска токена — **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (НЕ `GET /system/studio/demo-token`); тесты вызывают `jwtTokenService.generateToken(username, userId, roles)` (**`username` ПЕРВЫМ**).
6. **JPA-сущности наследуют `BaseAuditEntity`** (UUIDv7 `id`, мягкое удаление, аудит и `@Version` встроены); запрещено вешать `@Data` на `@Entity` и придумывать `@SoftDelete`.
7. **Автопути CamelCase и область `readDto`**: `ECommerceOrder` преобразуется в `/api/v1/e-commerce-orders`; контроллеры с `readDto = X.class` проецируют все ответы через `X`.
8. **Продакшен-блокировка**: сохраняйте `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` и `JWT_SECRET >= 32` байт UTF-8 в `application.yml` / `application-prod.yml` (включайте Studio только в `application-dev.yml`).
