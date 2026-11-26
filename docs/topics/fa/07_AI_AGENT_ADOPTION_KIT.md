# 07. کیت جامع پذیرش برای ایجنت‌های هوش مصنوعی (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` و `llms.txt`، `0.1.0`)

> **زبان‌ها**: **فارسی** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [هر ۲۰ زبان](../README.md) | [راهنمای کامل (EN)](../../GUIDE_EN.md) | [پورتال تعاملی ۲۰ زبانه](../../index.html#ai-agent-kit)

---

## 1. هدف و معماری کیت (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) تمامی **ایجنت‌های برنامه‌نویسی هوش مصنوعی و مدل‌های LLM موجود در بازار** را به واقعیت‌های ۱:۱ بررسی‌شده با ماشین از کد منبع مجهز می‌کند (`60` حاشیه‌نویسی در `6` پکیج دقیق Java، `133` ویژگی، `40` مسیر خودکار، کلیدهای دقیق `app.framework.*` و قواعد آزمایش‌شده زمان اجرا `0.1.0`) تا ادغام در همان تلاش اول بدون توهم و خطا انجام شود.

| فایل / پوشه | نقش |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | نمای معماری: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` و JitPack `v0.1.0`، قرارداد ۲ پوشه‌ای (`entity/` + `controller/`)، ۹ اینترفیس ترکیبی، ۶ پکیج حاشیه‌نویسی و ۶ زیرسیستم داخلی |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | قواعد سخت‌گیرانه ضدتوهم شامل همه دام‌های تاییدشده زمان اجرا |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | مهارت مرحله‌ای `spring-nwvmc-adoption` با ۷ گردش‌کار گام‌به‌گام و ماتریس عیب‌یابی ۱۵ علت ریشه‌ای |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | دروازه بررسی ۷ مرحله‌ای پیش از تحویل (پیش‌بررسی ← طراحی ← دام‌های زمان اجرا ← قفل تولید ← کارایی ← `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | ۶ (+ `templates/`) مرجع عمیق تاییدشده با ماشین (۶۰ حاشیه‌نویسی / ۱۳۳ ویژگی، ۴۰ مسیر + ۱۳ عملگر نقطه‌ای، YAML + چندپایگاه‌داده، دستورالعمل‌های عملی شامل `@MultiTenant` + DB-RBAC چهار موجودیتی + `JwtTokenService`، و جدول دقیق import کلاس‌ها و SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | فهرست‌های منطبق با `llmstxt.org` برای خزنده‌ها و ایجنت‌های هوش مصنوعی |

---

## 2. نصب با ۱ دستور بدون نیاز به کلون (Zero-Clone 1-Liner)

ترمینال را **مستقیماً در ریشه پروژه Spring Boot خود** باز کرده و یکی از دستورات زیر را اجرا کنید — بدون نیاز به کلون محلی یا فایل‌های پیشین (اسکریپت فایل‌های تاییدشده را مستقیماً از `https://github.com/NatswarChuan/Spring-NWVMC-document` دریافت می‌کند):

### Windows (PowerShell)

```powershell
# نصب برای همه ایجنت‌های هوش مصنوعی و مدل‌ها در پوشه فعلی (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# یا انتخاب یک ایجنت خاص (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# برای بازنویسی فایل‌های آداپتور موجود در ریشه، -Force را اضافه کنید (به‌صورت پیش‌فرض فایل‌های قبلی حفظ می‌شوند)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### کلون پیش از نصب (آفلاین / پروکسی سازمانی)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. ماتریس جامع سازگاری ایجنت‌های هوش مصنوعی و LLMها

| ایجنت هوش مصنوعی / IDE / مدل | منبع آداپتور | مسیر هدف در مخزن شما | مهارت خودکار |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | در System Prompt / Project Instructions جای‌گذاری کنید | `llms.txt` |

---

## 4. ۸ نکته حیاتی زمان اجرا که `RULES.md` اجبار می‌کند

1. **`@StateMachine.transitions` از نحو دونقطه استفاده می‌کند** (`"CREATED:PENDING_PAYMENT,CANCELLED"`)، هرگز `"FROM -> TO"` نه؛ و تغییر وضعیت با پارامتر کوئری `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` انجام می‌شود (نه بدنه JSON).
2. **عملگرهای پرس‌وجو از نحو نقطه‌ای استفاده می‌کنند** (`retailPrice.gte=1000&productName.like=MacBook`)، هرگز `__gte` نه.
3. **هلپرهای `@AutoComponent` فریم‌ورک را از طریق `ObjectProvider<T>` تزریق کنید** (`DynamicEntityAiMetadataProviderHelper`، `AiNaturalLanguageQueryParserHelper`، `ThirdPartyRestClientHelper`، `WebhookDispatcherHelper`) و در زمان اجرا `.getObject()` را فرا بخوانید.
4. **کلاس‌های `@Service` رهگیری‌شده با AOP** (`@DistributedLock`، `@AutoCacheable`، `@AutoCacheEvict`، `@TargetDataSource`) باید **غیر final** و **`@Lazy`** باشند و هر `@Component` که آن‌ها را تزریق می‌کند نیز باید از **`ObjectProvider<MyService>`** یا **`@Lazy`** استفاده کند. هرگز `@Transactional` را روی Helper از نوع `public final class` نگذارید.
5. **JWT توسعه و تست‌ها**: مسیر صدور توکن **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** است (نه `GET /system/studio/demo-token`)؛ تست‌ها `jwtTokenService.generateToken(username, userId, roles)` را صدا می‌زنند (**`username` اول است**).
6. **موجودیت‌های JPA از `BaseAuditEntity` ارث می‌برند** (UUIDv7 `id`، حذف نرم، ستون‌های ممیزی و `@Version` داخلی هستند)؛ هرگز `@Data` را روی `@Entity` نگذارید و `@SoftDelete` اختراع نکنید.
7. **مسیرهای خودکار CamelCase و محدوده `readDto`**: `ECommerceOrder` به `/api/v1/e-commerce-orders` نگاشت می‌شود؛ کنترلرهای دارای `readDto = X.class` تمام پاسخ‌ها را از طریق `X` قالب‌بندی می‌کنند.
8. **قفل امنیتی محیط تولید**: مقادیر `app.framework.studio.enabled: false`، `demo-token-endpoint-enabled: false`، `fail-fast-weak-jwt-secret: true` و `JWT_SECRET >= 32` بایت UTF-8 را در `application.yml` / `application-prod.yml` حفظ کنید (Studio را فقط در `application-dev.yml` فعال کنید).

---

## 5. پروتکل کیفیت SDD (توسعه مبتنی بر مشخصات) و TDD (توسعه مبتنی بر آزمون)

هر آداپتور و گردش‌کار با تکیه بر `references/06-sdd-and-tdd-playbook.md` و قالب‌های `templates/{spec,plan,tasks}.template.md` رویکرد مشخصات‌اول و آزمون‌اول را اجبار می‌کند و از حدس‌های پنهان و انحراف قرارداد جلوگیری می‌نماید.

- **SDD — توسعه مبتنی بر مشخصات (`specs/<feature>/`):** خط لوله ۶ مرحله‌ای (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): نگارش `spec.md` با معیارهای `REQ-ID` (`Given/When/Then`)، توقف روی `[NEEDS CLARIFICATION]`، ساخت ماتریس ردیابی ۱:۱ در `plan.md` و تطبیق بدون انحراف با `/v3/api-docs`، `/metadata` و `/schema/zod`.
- **TDD — قرمز ← سبز ← بازآرایی (هرم آزمون ۴ لایه):** ابتدا آزمون شکست‌خورده JUnit 5 / `MockMvc` با `@DisplayName("REQ-XXX: ...")` (و برای هر باگ آزمون رگرسیون) بنویسید، حداقل کد اعلانی را تا سبز شدن پیاده کنید و سپس بازآرایی نمایید. هر ۴ لایه واحد، امنیت/گردش‌کار، انحراف قرارداد و هم‌زمانی `@DistributedLock` + JMeter با خطای `0.0%` پوشش داده می‌شود و `@Disabled` ممنوع است.
- **راهنمای عملی و قالب‌ها:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
