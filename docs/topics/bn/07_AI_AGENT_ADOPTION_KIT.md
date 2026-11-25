# 07. ইউনিভার্সাল AI-Agent অ্যাডপশন কিট (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` ও `llms.txt`, `0.1.0`)

> **ভাষাসমূহ**: **বাংলা** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [সকল ২০টি ভাষা](../README.md) | [সম্পূর্ণ ম্যানুয়াল](../../GUIDE_EN.md) | [২০-ভাষার ইন্টারঅ্যাক্টিভ পোর্টাল](../../index.html#ai-agent-kit)

---

## 1. উদ্দেশ্য ও কিট আর্কিটেকচার (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) বাজারের **প্রতিটি AI কোডিং এজেন্ট এবং LLM**-কে সোর্স কোড থেকে ১:১ মেশিন-যাচাইকৃত তথ্য (`6`টি সঠিক Java প্যাকেজে `60`টি অ্যানোটেশন, `133`টি অ্যাট্রিবিউট, `40`টি অটো এন্ডপয়েন্ট, সঠিক `app.framework.*` কী এবং প্রমাণিত `0.1.0` রানটাইম নির্দেশিকা) দেয়, ফলে প্রথম চেষ্টাতেই কোনো হ্যালুসিনেশন ছাড়াই নির্ভুল ইন্টিগ্রেশন সম্ভব হয়।

| ফাইল / ডিরেক্টরি | ভূমিকা |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | আর্কিটেকচার পরিচিতি: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` ও JitPack `v0.1.0`, ২-ডিরেক্টরি চুক্তি (`entity/` + `controller/`), ৯টি কম্পোজেবল ইন্টারফেস, ৬টি অ্যানোটেশন প্যাকেজ, ১১টি বিল্ট-ইন সাবসিস্টেম |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | কঠোর হ্যালুসিনেশন-বিরোধী নিয়ম (`17.2 KB`, `24 KB` সীমার নিচে) যা প্রতিটি প্রমাণিত রানটাইম সতর্কতা নথিভুক্ত করে |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | ধাপে ধাপে `spring-nwvmc-adoption` স্কিল: ৬টি অ্যাডপশন ওয়ার্কফ্লো এবং ১০টি মূল-কারণ ট্রাবলশুটিং ম্যাট্রিক্স |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | হ্যান্ডওভারের আগে ৬-ধাপের যাচাই গেট (Pre-Flight -> ডিজাইন -> রানটাইম সতর্কতা -> প্রোডাকশন লকডাউন -> পারফরম্যান্স -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | মেশিন-যাচাইকৃত ৫টি গভীর রেফারেন্স (৬০ অ্যানোটেশন / ১৩৩ অ্যাট্রিবিউট, ৪০ এন্ডপয়েন্ট + ১৩ ডট অপারেটর, YAML + মাল্টি-ডেটাসোর্স, `@MultiTenant` + ৪-এনটিটি DB-RBAC + `JwtTokenService` কুকবুক, এবং সঠিক নন-অ্যানোটেশন ক্লাস/SPI ইমপোর্ট) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | স্বয়ংক্রিয় AI ক্রলার ও এজেন্টদের জন্য `llmstxt.org`-সম্মত সূচক |

---

## 2. ক্লোন ছাড়াই ১-কমান্ড ইনস্টলেশন (Zero-Clone 1-Liner)

সরাসরি আপনার **Spring Boot প্রোজেক্টের রুট ডিরেক্টরিতে** টার্মিনাল খুলে নিচের যেকোনো কমান্ড চালান — কোনো স্থানীয় ক্লোন বা পূর্বের ফাইল লাগবে না (স্ক্রিপ্ট সরাসরি `https://github.com/NatswarChuan/Spring-NWVMC-document` থেকে যাচাইকৃত ফাইল ডাউনলোড করে):

### Windows (PowerShell)

```powershell
# বর্তমান ডিরেক্টরিতে (".") সকল AI কোডিং এজেন্ট ও মডেলের জন্য ইনস্টল করুন
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# অথবা নির্দিষ্ট একটি এজেন্ট বেছে নিন (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# বিদ্যমান রুট অ্যাডাপ্টার ওভাররাইট করতে -Force যোগ করুন (ডিফল্টভাবে পুরোনো ফাইল নিরাপদে সংরক্ষিত থাকে)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### আগে ক্লোন করুন (অফলাইন / কর্পোরেট প্রক্সি)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. ইউনিভার্সাল AI-Agent ও LLM সামঞ্জস্য ম্যাট্রিক্স

| AI এজেন্ট / IDE / মডেল | অ্যাডাপ্টার সোর্স | আপনার রিপোতে লক্ষ্য পথ | স্বয়ংক্রিয় শনাক্ত স্কিল |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions-এ পেস্ট করুন | `llms.txt` |

---

## 4. `RULES.md` দ্বারা প্রয়োগকৃত ৮টি প্রমাণিত রানটাইম সতর্কতা

1. **`@StateMachine.transitions` কোলন সিনট্যাক্স ব্যবহার করে** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), কখনো `"FROM -> TO"` নয়; এবং ট্রানজিশন JSON বডি নয় বরং `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` কোয়েরি প্যারামিটার দিয়ে চলে।
2. **কোয়েরি অপারেটর ডট সিনট্যাক্স ব্যবহার করে** (`retailPrice.gte=1000&productName.like=MacBook`), কখনো `__gte` নয়।
3. **ফ্রেমওয়ার্ক `@AutoComponent` হেল্পার `ObjectProvider<T>` দিয়ে ইনজেক্ট করুন** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) এবং রানটাইমে `.getObject()` কল করুন।
4. **AOP ইন্টারসেপ্ট করা `@Service` ক্লাস** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) অবশ্যই **non-final** এবং **`@Lazy`** হতে হবে, এবং যে `@Component` এগুলো ইনজেক্ট করবে সেটিরও **`ObjectProvider<MyService>`** বা **`@Lazy`** ব্যবহার করতে হবে। `public final class` Helper-এ কখনো `@Transactional` দেবেন না।
5. **ডেভ JWT ও টেস্ট**: টোকেন এন্ডপয়েন্ট হলো **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (`GET /system/studio/demo-token` নয়); টেস্টে `jwtTokenService.generateToken(username, userId, roles)` কল করুন (**`username` প্রথমে**)।
6. **JPA এনটিটি `BaseAuditEntity` এক্সটেন্ড করে** (UUIDv7 `id`, সফট-ডিলিট, অডিট কলাম ও `@Version` বিল্ট-ইন); `@Entity`-তে কখনো `@Data` দেবেন না এবং `@SoftDelete` বানাবেন না।
7. **CamelCase অটো পাথ ও `readDto` স্কোপ**: `ECommerceOrder` ম্যাপ হয় `/api/v1/e-commerce-orders`-এ; `readDto = X.class` যুক্ত কন্ট্রোলার সব রেসপন্স `X`-এ প্রোজেক্ট করে।
8. **প্রোডাকশন লকডাউন**: `application.yml` / `application-prod.yml`-এ `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, এবং `JWT_SECRET >= 32` UTF-8 বাইট বজায় রাখুন (Studio কেবল `application-dev.yml`-এ চালু করুন)।

---

## 5. SDD (স্পেক-ড্রিভেন) ও TDD (টেস্ট-ড্রিভেন) মান নিয়ন্ত্রণ প্রোটোকল

প্রতিটি অ্যাডাপ্টার ও স্কিল ওয়ার্কফ্লো `references/06-sdd-and-tdd-playbook.md` এবং `templates/{spec,plan,tasks}.template.md` ব্যবহার করে স্পেক-ফার্স্ট ও টেস্ট-ফার্স্ট ডেলিভারি নিশ্চিত করে, ফলে নীরব অনুমান ও কন্ট্র্যাক্ট ড্রিফট দূর হয়।

- **SDD — স্পেক-ড্রিভেন ডেভেলপমেন্ট (`specs/<feature>/`):** ৬-ধাপের গেট (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): `REQ-ID` (`Given/When/Then`) সহ `spec.md` লিখুন, `[NEEDS CLARIFICATION]`-এ থেমে নিশ্চিত হন, `plan.md`-এ ১:১ ট্রেসেবিলিটি ম্যাট্রিক্স গড়ুন এবং লাইভ `/v3/api-docs`, `/metadata`, `/schema/zod`-এর সাথে শূন্য-ড্রিফট যাচাই করুন।
- **TDD — রেড → গ্রিন → রিফ্যাক্টর (৪-স্তরের টেস্ট পিরামিড):** প্রথমে `@DisplayName("REQ-XXX: ...")` সহ ব্যর্থ JUnit 5 / `MockMvc` টেস্ট (বাগ ফিক্সে রিগ্রেশন টেস্ট) লিখুন, ন্যূনতম ডিক্লারেটিভ কোডে GREEN করুন এবং রিফ্যাক্টর করুন। ৪ স্তর কভার করে: ইউনিট, সিকিউরিটি/ওয়ার্কফ্লো, কন্ট্র্যাক্ট ড্রিফট, এবং `@DistributedLock` কনকারেন্সি + JMeter `0.0%` ত্রুটি (`@Disabled` নিষিদ্ধ)।
- **Playbook & Templates:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
