# 07. ชุดเครื่องมือสำหรับ AI-Agent แบบสากล (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` และ `llms.txt`, `0.1.0`)

> **ภาษา**: **ไทย** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [ครบทั้ง 20 ภาษา](../README.md) | [คู่มือฉบับสมบูรณ์](../../GUIDE_EN.md) | [พอร์ทัลเอกสารแบบโต้ตอบ 20 ภาษา](../../index.html#ai-agent-kit)

---

## 1. เป้าหมายและสถาปัตยกรรมชุดเครื่องมือ (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) มอบข้อเท็จจริงที่ตรวจสอบด้วยเครื่อง 1:1 จากซอร์สโค้ดจริงแก่ **AI Coding Agent และ LLM ทุกรุ่นในตลาด** (`60` แอนโนเทชันใน `6` แพ็กเกจ Java ที่ถูกต้อง, `133` แอตทริบิวต์, `40` Endpoint อัตโนมัติ, คีย์ `app.framework.*` และกฎรันไทม์ `0.1.0` ที่ทดสอบจริง) เพื่อให้ใช้งาน Spring-NWVMC ได้แม่นยำตั้งแต่ครั้งแรกโดยไม่หลอนแอนโนเทชัน

| ไฟล์ / โฟลเดอร์ | บทบาท |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | ภาพรวมสถาปัตยกรรม: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` และ JitPack `v0.1.0`, สัญญา 2 โฟลเดอร์ (`entity/` + `controller/`), 9 อินเทอร์เฟซประกอบได้, 6 แพ็กเกจแอนโนเทชัน, 11 ระบบย่อยในตัว |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | กฎเหล็กป้องกันการหลอน (`13.6 KB`, ต่ำกว่าขีดจำกัด `24 KB`) ที่รวมทุกกับดักรันไทม์ซึ่งผ่านการพิสูจน์แล้ว |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | ทักษะแบบเปิดเผยเป็นขั้น `spring-nwvmc-adoption` พร้อม 6 ขั้นตอนการทำงานและตารางแก้ปัญหา 10 สาเหตุหลัก |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | รายการตรวจสอบ 6 ระยะก่อนส่งมอบ (Pre-Flight -> ออกแบบ -> กับดักรันไทม์ -> ล็อกความปลอดภัย Production -> ประสิทธิภาพ -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | เอกสารอ้างอิงเชิงลึก 5 ฉบับที่ตรวจด้วยเครื่อง (60 แอนโนเทชัน / 133 แอตทริบิวต์, 40 API + 13 ตัวดำเนินการจุด, YAML + หลายฐานข้อมูล, สูตรโค้ดพร้อม `@MultiTenant` + DB-RBAC 4 Entity + `JwtTokenService`, และตาราง import คลาส/SPI นอกแอนโนเทชัน) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | ดัชนีมาตรฐาน `llmstxt.org` สำหรับบอตและ AI Agent |

---

## 2. ติดตั้งด้วยคำสั่งเดียวโดยไม่ต้องโคลน (Zero-Clone 1-Liner)

เปิดเทอร์มินัล **ในโฟลเดอร์รากของโปรเจกต์ Spring Boot ของคุณโดยตรง** แล้ววางคำสั่งด้านล่าง ไม่ต้องมีไฟล์ในเครื่องหรือโคลนล่วงหน้า (สคริปต์จะดาวน์โหลดไฟล์ที่ตรวจแล้วตรงจาก `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# ติดตั้งสำหรับ AI Coding Agent และโมเดลทั้งหมดลงในโฟลเดอร์ปัจจุบัน (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# หรือระบุเฉพาะ Agent เดียว (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# เพิ่ม -Force เพื่อเขียนทับไฟล์อะแดปเตอร์เดิมที่รูท (ค่าเริ่มต้นจะเก็บรักษาไฟล์เดิมอย่างปลอดภัย)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### โคลนก่อนติดตั้ง (ออฟไลน์ / พร็อกซีองค์กร)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. ตารางความเข้ากันได้กับ AI-Agent และ LLM ทุกรุ่น

| AI Agent / IDE / โมเดล | ไฟล์ต้นฉบับอะแดปเตอร์ | เส้นทางปลายทางในโปรเจกต์ | ทักษะที่ค้นพบอัตโนมัติ |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | วางลงใน System Prompt / Project Instructions | `llms.txt` |

---

## 4. 8 กับดักรันไทม์ที่พิสูจน์แล้วซึ่ง `RULES.md` บังคับใช้

1. **`@StateMachine.transitions` ใช้เครื่องหมายโคลอน** (`"CREATED:PENDING_PAYMENT,CANCELLED"`) ห้ามใช้ `"FROM -> TO"` และสั่งเปลี่ยนสถานะผ่านพารามิเตอร์คิวรี `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (ไม่ใช่ JSON body)
2. **ตัวดำเนินการกรองใช้รูปแบบจุด** (`retailPrice.gte=1000&productName.like=MacBook`) ห้ามใช้ `__gte`
3. **ฉีด Helper `@AutoComponent` ของเฟรมเวิร์กผ่าน `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) แล้วเรียก `.getObject()` ตอนทำงานจริง
4. **คลาส `@Service` ที่ใช้ AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) ต้องเป็น **non-final** และติด **`@Lazy`** รวมถึง `@Component` ที่ฉีดมันเข้าไปต้องใช้ **`ObjectProvider<MyService>`** หรือ **`@Lazy`** ด้วย ห้ามติด `@Transactional` บน Helper ที่เป็น `public final class`
5. **Dev JWT และการทดสอบ**: Endpoint ออกโทเคนคือ **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (ไม่ใช่ `GET /system/studio/demo-token`) และการทดสอบต้องเรียก `jwtTokenService.generateToken(username, userId, roles)` (**`username` เป็นพารามิเตอร์แรก**)
6. **JPA Entity สืบทอด `BaseAuditEntity`** (มี UUIDv7 `id`, soft-delete, คอลัมน์ตรวจสอบและ `@Version` ในตัว) ห้ามใช้ `@Data` บน `@Entity` และอย่าแต่งชื่อ `@SoftDelete` ขึ้นเอง
7. **เส้นทาง CamelCase อัตโนมัติและขอบเขต `readDto`**: `ECommerceOrder` จะได้ `/api/v1/e-commerce-orders` และ Controller ที่กำหนด `readDto = X.class` จะแปลงผลลัพธ์ทุกเส้นทางผ่าน `X`
8. **การล็อก Production**: คงค่า `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` และ `JWT_SECRET >= 32` ไบต์ UTF-8 ใน `application.yml` / `application-prod.yml` (เปิด Studio เฉพาะใน `application-dev.yml`)
