# 07. یونیورسل AI-Agent ایڈاپشن کٹ (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` اور `llms.txt`، `0.1.0`)

> **زبانیں**: **اردو** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [تمام 20 زبانیں](../README.md) | [مکمل دستی کتابچہ (EN)](../../GUIDE_EN.md) | [20-زبان انٹرایکٹو پورٹل](../../index.html#ai-agent-kit)

---

## 1. مقصد اور کٹ آرکیٹیکچر (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) مارکیٹ کے **ہر AI کوڈنگ ایجنٹ اور LLM** کو سورس کوڈ سے ۱:۱ مشین-تصدیق شدہ حقائق (`6` درست Java پیکجز میں `60` اینوٹیشنز، `133` ایٹری بیوٹس، `40` خودکار اینڈپوائنٹس، درست `app.framework.*` کلیدیں اور آزمائے ہوئے `0.1.0` رن ٹائم اصول) فراہم کرتا ہے تاکہ بغیر کسی غلط فہمی یا رن ٹائم خرابی کے پہلی کوشش میں درست انضمام ہو۔

| فائل / ڈائریکٹری | کردار |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | آرکیٹیکچر تعارف: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` اور JitPack `v0.1.0`، دو ڈائریکٹری معاہدہ (`entity/` + `controller/`)، 9 قابلِ ترکیب انٹرفیس، 6 اینوٹیشن پیکجز، 6 بلٹ ان سب سسٹمز |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | سخت اینٹی ہیلوسینیشن گارڈ ریلز جن میں ہر تصدیق شدہ رن ٹائم احتیاط شامل ہے |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | تدریجی `spring-nwvmc-adoption` اسکل مع 7 مرحلہ وار ورک فلوز اور 15 بنیادی وجوہات کی ٹربل شوٹنگ جدول |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | حوالگی سے قبل 7 مرحلوں کی جانچ (Pre-Flight ← ڈیزائن ← رن ٹائم احتیاطیں ← پروڈکشن لاک ڈاؤن ← کارکردگی ← `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | مشین سے تصدیق شدہ 6 (+ `templates/`) گہرے حوالہ جات (60 اینوٹیشنز / 133 ایٹری بیوٹس، 40 اینڈپوائنٹس + 13 ڈاٹ آپریٹرز، YAML + ملٹی ڈیٹاسورس، `@MultiTenant` + 4-اینٹیٹی DB-RBAC + `JwtTokenService` ترکیبیں، اور درست نان-اینوٹیشن کلاس/SPI امپورٹس) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | خودکار AI کرالرز اور ایجنٹس کے لیے `llmstxt.org` معیاری فہرستیں |

---

## 2. بغیر کلون کے 1 کمانڈ تنصیب (Zero-Clone 1-Liner)

براہِ راست اپنے **Spring Boot پروجیکٹ کی روٹ ڈائریکٹری میں** ٹرمینل کھولیں اور نیچے دی گئی کمانڈ چلائیں — مقامی کلون یا پیشگی فائلوں کی ضرورت نہیں (اسکرپٹ براہِ راست `https://github.com/NatswarChuan/Spring-NWVMC-document` سے تصدیق شدہ فائلیں ڈاؤن لوڈ کرتا ہے):

### Windows (PowerShell)

```powershell
# موجودہ ڈائریکٹری (".") میں تمام AI کوڈنگ ایجنٹس اور ماڈلز کے لیے انسٹال کریں
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# یا کسی ایک ایجنٹ کا انتخاب کریں (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# موجودہ روٹ ایڈاپٹر فائلوں کو اوور رائٹ کرنے کے لیے -Force شامل کریں (ڈیفالٹ پرانی فائلیں محفوظ رکھتا ہے)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### پہلے کلون کریں (آف لائن / کارپوریٹ پراکسی)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. یونیورسل AI-Agent اور LLM مطابقت میٹرکس

| AI ایجنٹ / IDE / ماڈل | ایڈاپٹر ماخذ | آپ کے ریپو میں ہدف راستہ | خودکار دریافت اسکل |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions میں پیسٹ کریں | `llms.txt` |

---

## 4. `RULES.md` کے نافذ کردہ 8 تصدیق شدہ رن ٹائم اصول

1. **`@StateMachine.transitions` کولن نحو استعمال کرتا ہے** (`"CREATED:PENDING_PAYMENT,CANCELLED"`)، کبھی `"FROM -> TO"` نہیں؛ اور تبدیلی JSON باڈی کے بجائے کوئری پیرامیٹر `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` سے ہوتی ہے۔
2. **کوئری آپریٹرز ڈاٹ نحو استعمال کرتے ہیں** (`retailPrice.gte=1000&productName.like=MacBook`)، کبھی `__gte` نہیں۔
3. **فریم ورک `@AutoComponent` ہیلپرز کو `ObjectProvider<T>` کے ذریعے انجیکٹ کریں** (`DynamicEntityAiMetadataProviderHelper`، `AiNaturalLanguageQueryParserHelper`، `ThirdPartyRestClientHelper`، `WebhookDispatcherHelper`) اور رن ٹائم پر `.getObject()` کال کریں۔
4. **AOP سے گزرنے والی `@Service` کلاسز** (`@DistributedLock`، `@AutoCacheable`، `@AutoCacheEvict`، `@TargetDataSource`) لازماً **non-final** اور **`@Lazy`** ہوں، اور انہیں انجیکٹ کرنے والا ہر `@Component` بھی **`ObjectProvider<MyService>`** یا **`@Lazy`** استعمال کرے۔ `public final class` Helper پر کبھی `@Transactional` نہ لگائیں۔
5. **ڈیو JWT اور ٹیسٹس**: ٹوکن اینڈپوائنٹ **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** ہے (`GET /system/studio/demo-token` نہیں)؛ ٹیسٹ میں `jwtTokenService.generateToken(username, userId, roles)` کال کریں (**`username` پہلے**)۔
6. **JPA اینٹیٹیز `BaseAuditEntity` ایکسٹینڈ کرتی ہیں** (UUIDv7 `id`، سافٹ ڈیلیٹ، آڈٹ کالمز اور `@Version` شامل ہیں)؛ `@Entity` پر کبھی `@Data` استعمال نہ کریں اور `@SoftDelete` ایجاد نہ کریں۔
7. **CamelCase خودکار راستے اور `readDto` دائرہ**: `ECommerceOrder` کا راستہ `/api/v1/e-commerce-orders` بنتا ہے؛ `readDto = X.class` والے کنٹرولر تمام جوابات کو `X` میں پروجیکٹ کرتے ہیں۔
8. **پروڈکشن لاک ڈاؤن**: `application.yml` / `application-prod.yml` میں `app.framework.studio.enabled: false`، `demo-token-endpoint-enabled: false`، `fail-fast-weak-jwt-secret: true` اور `JWT_SECRET >= 32` UTF-8 بائٹس برقرار رکھیں (Studio صرف `application-dev.yml` میں فعال کریں)۔

---

## 5. SDD (تفصیل پر مبنی) اور TDD (ٹیسٹ پر مبنی) معیار کا پروٹوکول

ہر ایڈاپٹر اور ورک فلو `references/06-sdd-and-tdd-playbook.md` اور `templates/{spec,plan,tasks}.template.md` کے ذریعے اسپیک-فرسٹ اور ٹیسٹ-فرسٹ ترسیل نافذ کرتا ہے تاکہ خاموش مفروضے اور کنٹریکٹ ڈرفٹ ختم ہوں۔

- **SDD — تفصیل پر مبنی ترقی (`specs/<feature>/`):** 6 مراحل پر مشتمل پائپ لائن (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): `REQ-ID` (`Given/When/Then`) کے ساتھ `spec.md` لکھیں، `[NEEDS CLARIFICATION]` پر رک کر تصدیق لیں، `plan.md` میں 1:1 ٹریسیبلٹی میٹرکس بنائیں اور لائیو `/v3/api-docs`، `/metadata`، `/schema/zod` سے مطابقت جانچیں۔
- **TDD — ریڈ ← گرین ← ریفیکٹر (4-سطحی ٹیسٹ پیرامڈ):** پہلے `@DisplayName("REQ-XXX: ...")` کے ساتھ ناکام JUnit 5 / `MockMvc` ٹیسٹ (اور ہر بگ کے لیے ریگریشن ٹیسٹ) لکھیں، کم از کم ڈیکلیریٹو کوڈ سے GREEN کریں، پھر REFACTOR کریں۔ چاروں سطحیں (یونٹ، سیکیورٹی/ورک فلو، کنٹریکٹ ڈرفٹ، `@DistributedLock` کونکرنسی + JMeter `0.0%`) لازم ہیں، `@Disabled` ممنوع ہے۔
- **پلے بک اور ٹیمپلیٹس:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
