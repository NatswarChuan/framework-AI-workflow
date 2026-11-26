# 07. حزمة التبني الشاملة لوكلاء الذكاء الاصطناعي (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` و`llms.txt`، `0.1.0`)

> **اللغات**: **العربية** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [جميع اللغات الـ 20](../README.md) | [الدليل الكامل (EN)](../../GUIDE_EN.md) | [البوابة التفاعلية (20 لغة)](../../index.html#ai-agent-kit)

---

## 1. الهدف وبنية الحزمة (`ai-agent-kit/`)

تزوّد **Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) **كل وكيل برمجة ذكاء اصطناعي وكل نموذج LLM في السوق** بحقائق متحقق منها آليًا 1:1 من الشيفرة المصدرية (`60` تعليقًا توضيحيًا ضمن `6` حزم Java دقيقة، `133` خاصية، `40` نقطة نهاية تلقائية، مفاتيح `app.framework.*` وضوابط تشغيل `0.1.0` مجربة) لدمج Spring-NWVMC بدقة من المحاولة الأولى دون هلوسة.

| الملف / المجلد | الدور |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | نظرة معمارية: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` وJitPack `v0.1.0`، عقد المجلدين (`entity/` + `controller/`)، 9 واجهات قابلة للتركيب، 6 حزم تعليقات، 6 نظامًا فرعيًا مدمجًا |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | ضوابط صارمة ضد الهلوسة (`19.0 KB`، دون سقف `24 KB`) توثق كل فخ تشغيلي مُثبت عمليًا |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | مهارة `spring-nwvmc-adoption` التدريجية مع 7 مسارات عمل خطوة بخطوة ومصفوفة تشخيص لـ 15 أسباب جذرية |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | بوابة تحقق من 7 مراحل قبل التسليم (ما قبل البدء ← التصميم ← فخاخ التشغيل ← إغلاق الإنتاج ← الأداء ← `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) مراجع معمقة محققة آليًا (60 تعليقًا / 133 خاصية، 40 نقطة نهاية + 13 عاملًا بالنقطة، YAML + تعدد قواعد البيانات، وصفات عملية تشمل `@MultiTenant` + DB-RBAC من 4 كيانات + `JwtTokenService`، وجدول استيرادات الفئات وSPI الدقيقة) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | فهارس متوافقة مع `llmstxt.org` لوكلاء وزواحف الذكاء الاصطناعي |

---

## 2. التثبيت بأمر واحد دون استنساخ (Zero-Clone 1-Liner)

افتح الطرفية **مباشرة داخل المجلد الجذر لمشروع Spring Boot الخاص بك** ونفذ أحد الأمرين أدناه — لا حاجة للاستنساخ المسبق أو لملفات محلية (يقوم السكربت بالتنزيل المباشر من `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# التثبيت لجميع وكلاء البرمجة والنماذج داخل المجلد الحالي (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# أو استهداف وكيل محدد فقط (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# أضف -Force لاستبدال ملفات المحولات الموجودة (الوضع الافتراضي يحافظ عليها بأمان)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### الاستنساخ أولًا (دون اتصال / وكيل مؤسسي)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. مصفوفة التوافق الشاملة لوكلاء الذكاء الاصطناعي وLLMs

| وكيل الذكاء الاصطناعي / IDE / النموذج | مصدر المحوّل | المسار الهدف في مشروعك | المهارة المكتشفة تلقائيًا |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | الصق في System Prompt / Project Instructions | `llms.txt` |

---

## 4. أهم 8 قواعد تشغيلية مُحقّقة تفرضها `RULES.md`

1. **يستخدم `@StateMachine.transitions` صيغة النقطتين** (`"CREATED:PENDING_PAYMENT,CANCELLED"`) وليس `"FROM -> TO"` أبدًا، وتُنفذ الانتقالات عبر معامل الاستعلام `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (وليس جسم JSON).
2. **تستخدم عوامل التصفية صيغة النقطة** (`retailPrice.gte=1000&productName.like=MacBook`) وليس `__gte` أبدًا.
3. **احقن مساعدات الإطار `@AutoComponent` عبر `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`، `AiNaturalLanguageQueryParserHelper`، `ThirdPartyRestClientHelper`، `WebhookDispatcherHelper`) واستدعِ `.getObject()` وقت التشغيل.
4. **فئات `@Service` المعترضة بـ AOP** (`@DistributedLock`، `@AutoCacheable`، `@AutoCacheEvict`، `@TargetDataSource`) يجب أن تكون **غير final** و**`@Lazy`**، وكل `@Component` يحقنها يجب أن يستخدم أيضًا **`ObjectProvider<MyService>`** أو **`@Lazy`**. لا تضع `@Transactional` أبدًا على فئات Helper من نوع `public final class`.
5. **رمز JWT للتطوير والاختبارات**: مسار الرمز هو **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (وليس `GET /system/studio/demo-token`)؛ وتستدعي الاختبارات `jwtTokenService.generateToken(username, userId, roles)` (**`username` أولًا**).
6. **ترث كيانات JPA من `BaseAuditEntity`** (يتضمن UUIDv7 `id` والحذف الناعم وأعمدة التدقيق و`@Version`)؛ لا تستخدم `@Data` على `@Entity` ولا تخترع `@SoftDelete`.
7. **المسارات التلقائية CamelCase ونطاق `readDto`**: يتحول `ECommerceOrder` إلى `/api/v1/e-commerce-orders`؛ ووحدات التحكم التي تحدد `readDto = X.class` تُسقط جميع الاستجابات عبر `X`.
8. **إغلاق بيئة الإنتاج**: أبقِ `app.framework.studio.enabled: false` و`demo-token-endpoint-enabled: false` و`fail-fast-weak-jwt-secret: true` و`JWT_SECRET >= 32` بايت UTF-8 في `application.yml` / `application-prod.yml` (وفعّل Studio فقط في `application-dev.yml`).

---

## 5. بروتوكول الجودة SDD (التطوير الموجّه بالمواصفات) و TDD (التطوير الموجّه بالاختبارات)

يفرض كل محوّل ومسار عمل نهج المواصفات أولًا والاختبار أولًا عبر `references/06-sdd-and-tdd-playbook.md` وقوالب `templates/{spec,plan,tasks}.template.md` لمنع الافتراضات الصامتة وانحراف العقود والشيفرة غير المختبرة.

- **SDD — التطوير الموجّه بالمواصفات (`specs/<feature>/`):** مسار من 6 بوابات (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): اكتب `spec.md` بمعايير `REQ-ID` (`Given/When/Then`)، وتوقف عند `[NEEDS CLARIFICATION]` للتأكيد، وأنشئ مصفوفة تتبع 1:1 في `plan.md` مع التحقق من التطابق التام مع `/v3/api-docs` و`/metadata` و`/schema/zod`.
- **TDD — أحمر ← أخضر ← إعادة هيكلة (هرم الاختبار من 4 مستويات):** اكتب أولًا اختبار JUnit 5 / `MockMvc` فاشلًا بوسم `@DisplayName("REQ-XXX: ...")` (واختبار تراجع لكل خطأ)، ثم اكتب الحد الأدنى من الشيفرة التصريحية حتى ينجح، ثم أعد الهيكلة. يغطي 4 مستويات: الوحدة، الأمان وتدفق العمل، انحراف العقد، وتزامن `@DistributedLock` + JMeter بنسبة خطأ `0.0%` دون `@Disabled`.
- **دليل العمل والقوالب:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
