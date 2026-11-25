# 07. यूनिवर्सल AI-Agent एडॉप्शन किट (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` और `llms.txt`, `0.1.0`)

> **भाषाएँ**: **हिन्दी** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [सभी 20 भाषाएँ](../README.md) | [संपूर्ण मैनुअल](../../GUIDE_EN.md) | [20-भाषा इंटरैक्टिव पोर्टल](../../index.html#ai-agent-kit)

---

## 1. उद्देश्य और किट आर्किटेक्चर (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) बाज़ार के **प्रत्येक AI कोडिंग एजेंट और LLM** को स्रोत कोड से मशीन-सत्यापित 1:1 तथ्य (`6` सटीक Java पैकेज में `60` एनोटेशन, `133` एट्रिब्यूट, `40` ऑटो एंडपॉइंट, सटीक `app.framework.*` कुंजियाँ और प्रमाणित `0.1.0` रनटाइम नियम) प्रदान करता है ताकि बिना किसी भ्रम या त्रुटि के पहली बार में सही एकीकरण हो सके।

| फ़ाइल / डायरेक्टरी | भूमिका |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | आर्किटेक्चर परिचय: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` व JitPack `v0.1.0`, 2-डायरेक्टरी अनुबंध (`entity/` + `controller/`), 9 संयोज्य इंटरफ़ेस, 6 एनोटेशन पैकेज, 11 अंतर्निहित सबसिस्टम |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | सख्त एंटी-हैलुसिनेशन नियम (`17.2 KB`, `24 KB` बजट के भीतर) जो हर सत्यापित रनटाइम सावधानी दर्ज करते हैं |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | प्रगतिशील `spring-nwvmc-adoption` कौशल: 6 चरणबद्ध वर्कफ़्लो और 10 मूल-कारण समस्या निवारण तालिका |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | हैंडओवर से पहले 6-चरणीय सत्यापन द्वार (Pre-Flight -> डिज़ाइन -> रनटाइम सावधानियाँ -> प्रोडक्शन लॉकडाउन -> प्रदर्शन -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | मशीन-सत्यापित 5 गहन संदर्भ (60 एनोटेशन / 133 एट्रिब्यूट, 40 एंडपॉइंट + 13 डॉट ऑपरेटर, YAML + मल्टी-डेटासोर्स, `@MultiTenant` + 4-एंटिटी DB-RBAC + `JwtTokenService` कुकबुक, और सटीक नॉन-एनोटेशन क्लास/SPI इम्पोर्ट्स) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | स्वचालित AI क्रॉलर और एजेंट्स के लिए `llmstxt.org`-अनुरूप सूचकांक |

---

## 2. बिना क्लोन किए 1-कमांड इंस्टॉलेशन (Zero-Clone 1-Liner)

सीधे अपने **Spring Boot प्रोजेक्ट की रूट डायरेक्टरी में** टर्मिनल खोलें और नीचे दी गई कमांड चलाएँ — किसी स्थानीय क्लोन या पूर्व फ़ाइल की आवश्यकता नहीं है (स्क्रिप्ट सीधे `https://github.com/NatswarChuan/Spring-NWVMC-document` से सत्यापित फ़ाइलें डाउनलोड करती है):

### Windows (PowerShell)

```powershell
# वर्तमान डायरेक्टरी (".") में सभी AI कोडिंग एजेंट्स व मॉडल्स के लिए इंस्टॉल करें
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# या किसी एक एजेंट को चुनें (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# मौजूदा रूट एडॉप्टर फ़ाइलों को ओवरराइट करने के लिए -Force जोड़ें (डिफ़ॉल्ट रूप से पुरानी फ़ाइलें सुरक्षित रहती हैं)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### पहले क्लोन करें (ऑफ़लाइन / कॉर्पोरेट प्रॉक्सी)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. यूनिवर्सल AI-Agent और LLM संगतता मैट्रिक्स

| AI एजेंट / IDE / मॉडल | एडॉप्टर स्रोत | आपके प्रोजेक्ट में लक्ष्य पथ | स्वतः पहचाना गया कौशल |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions में पेस्ट करें | `llms.txt` |

---

## 4. `RULES.md` द्वारा लागू 8 सत्यापित रनटाइम नियम

1. **`@StateMachine.transitions` कोलन सिंटैक्स का उपयोग करता है** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), कभी `"FROM -> TO"` नहीं; ट्रांज़िशन JSON बॉडी के बजाय क्वेरी पैरामीटर `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` से चलता है।
2. **क्वेरी ऑपरेटर डॉट सिंटैक्स का उपयोग करते हैं** (`retailPrice.gte=1000&productName.like=MacBook`), कभी `__gte` नहीं।
3. **फ़्रेमवर्क `@AutoComponent` हेल्पर्स को `ObjectProvider<T>` द्वारा इंजेक्ट करें** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) और रनटाइम पर `.getObject()` कॉल करें।
4. **AOP द्वारा इंटरसेप्ट `@Service` वर्ग** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) **non-final** और **`@Lazy`** होने चाहिए, और उन्हें इंजेक्ट करने वाला हर `@Component` भी **`ObjectProvider<MyService>`** या **`@Lazy`** का उपयोग करे। `public final class` Helper पर कभी `@Transactional` न लगाएँ।
5. **देव JWT और परीक्षण**: टोकन एंडपॉइंट **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** है (`GET /system/studio/demo-token` नहीं); परीक्षण `jwtTokenService.generateToken(username, userId, roles)` कॉल करते हैं (**`username` पहले**)।
6. **JPA एंटिटी `BaseAuditEntity` को विस्तृत करती हैं** (UUIDv7 `id`, सॉफ्ट-डिलीट, ऑडिट कॉलम और `@Version` अंतर्निहित); `@Entity` पर कभी `@Data` न लगाएँ और `@SoftDelete` की कल्पना न करें।
7. **CamelCase ऑटो पथ और `readDto` दायरा**: `ECommerceOrder` `/api/v1/e-commerce-orders` पर मैप होता है; `readDto = X.class` वाले कंट्रोलर सभी उत्तरों को `X` में प्रोजेक्ट करते हैं।
8. **प्रोडक्शन लॉकडाउन**: `application.yml` / `application-prod.yml` में `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, और `JWT_SECRET >= 32` UTF-8 बाइट्स बनाए रखें (Studio केवल `application-dev.yml` में सक्रिय करें)।

---

## 5. SDD (स्पेक-ड्रिवन) और TDD (टेस्ट-ड्रिवन) गुणवत्ता प्रोटोकॉल

प्रत्येक एडॉप्टर और स्किल वर्कफ़्लो `references/06-sdd-and-tdd-playbook.md` तथा `templates/{spec,plan,tasks}.template.md` के माध्यम से पहले-स्पेक और पहले-टेस्ट डिलीवरी लागू करता है, जिससे AI की अनकही धारणाएँ और कॉन्ट्रैक्ट ड्रिफ्ट रुकते हैं।

- **SDD — स्पेक-ड्रिवन डेवलपमेंट (`specs/<feature>/`):** 6-चरणीय गेट (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): `REQ-ID` (`Given/When/Then`) के साथ `spec.md` लिखें, `[NEEDS CLARIFICATION]` पर रुककर पुष्टि लें, `plan.md` में 1:1 ट्रेसबिलिटी मैट्रिक्स बनाएँ और लाइव `/v3/api-docs`, `/metadata`, `/schema/zod` से मिलान करें।
- **TDD — रेड → ग्रीन → रिफैक्टर (4-स्तरीय टेस्ट पिरामिड):** पहले `@DisplayName("REQ-XXX: ...")` के साथ असफल JUnit 5 / `MockMvc` टेस्ट (बग फ़िक्स हेतु रिग्रेशन टेस्ट) लिखें, न्यूनतम डिक्लेरेटिव कोड से GREEN करें, फिर REFACTOR करें। चारों स्तर (यूनिट, सिक्योरिटी/वर्कफ़्लो, कॉन्ट्रैक्ट ड्रिफ्ट, `@DistributedLock` कॉनकरेंसी + JMeter `0.0%`) कवर हों; `@Disabled` वर्जित।
- **Playbook & Templates:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
