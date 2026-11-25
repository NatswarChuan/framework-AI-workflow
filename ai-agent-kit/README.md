# Spring-NWVMC (`v0.1.0`) — Universal AI-Agent Adoption Kit

> **Tiếng Việt:** Bộ công cụ **INTRO + RULES + SKILL + CHECKLIST + Adapters + `llms.txt`** giúp **mọi AI-Agent & mọi mô hình LLM trên thị trường** (Google Antigravity/Gemini, Anthropic Claude Code, OpenAI Codex/ChatGPT, Cursor, GitHub Copilot, Windsurf, Cline/Roo Code, DeepSeek, Qwen, Grok, Mistral, Ollama/Llama, Aider…) hiểu chính xác 100% kiến trúc **Spring-NWVMC `v0.1.0`** và áp dụng vào dự án Spring Boot mới hoặc đang chạy chỉ trong vài phút — **không ảo giác annotation, không dính bẫy runtime**.
>
> **English:** A universal, model-agnostic **INTRO + RULES + SKILL + CHECKLIST + Multi-Agent Adapter Kit** grounded 1:1 in the verified source code of `controller-to-api-framework/` (`584/584` tests) and `controller-to-api-implementation/` (`173/173` tests + `2,000`-request JMeter `0.0%` error rate).

---

## 1. Cấu Trúc Bộ Kit / What Is Inside

| File / Folder | Vai trò (Role) | Khi nào dùng (When Loaded) |
| :--- | :--- | :--- |
| **[`INTRO.md`](./INTRO.md)** | Tổng quan kiến trúc: Maven/Gradle JitPack `v0.1.0`, Hợp đồng 2 thư mục (`entity/` + `controller/`), 9 capability interfaces, 6 packages annotation, 11 subsystem có sẵn | Đọc đầu tiên để định hướng tổng thể |
| **[`RULES.md`](./RULES.md)** | Luật sắt chống ảo giác (Anti-Hallucination Guardrails) & mọi bẫy runtime đã kiểm chứng thực tế (`ObjectProvider<T>`, `@Lazy`, `@StateMachine` dấu `:`, toán tử `.gte`, kebab-case, `readDto` scoping, `prod` lockdown) | Bắt buộc nạp trong system/project rules (< 24 KB) |
| **[`SKILL.md`](./SKILL.md)** | Kỹ năng triển khai từng bước (6 Workflows: Bootstrap → 2-Directory Resource → Custom Routes & Resilience → Events/AI/Storage → Troubleshooting Matrix → Verification Gate) | Tự động kích hoạt trong `.agents/skills/` & `.claude/skills/` |
| **[`CHECKLIST.md`](./CHECKLIST.md)** | Danh mục kiểm tra 6 giai đoạn (Pre-Flight → Design → Runtime Pitfalls → Security Lockdown → Performance → Automated Verification & Go-Live) | Chạy soát xét trước khi hoàn tất PR / bàn giao |
| **[`references/01-annotations-exact-matrix.md`](./references/01-annotations-exact-matrix.md)** | Bảng tra cứu chuẩn xác **100% kiểm chứng bằng máy** cho toàn bộ **60 annotation** (6 packages) & **133 attributes** | Đọc theo nhu cầu (Progressive Disclosure) trước khi viết annotation |
| **[`references/02-endpoints-and-query-dsl.md`](./references/02-endpoints-and-query-dsl.md)** | Toàn bộ **40 auto-endpoints**, **13 toán tử filter dạng dấu chấm (`.gte`, `.like`...)**, GraphQL, Storage, Time-Travel, `curl` mẫu | Đọc khi viết client, frontend, integration test hoặc Swagger |
| **[`references/03-yaml-properties-and-profiles.md`](./references/03-yaml-properties-and-profiles.md)** | Toàn bộ thuộc tính `app.framework.*` & `spring-nwvmc.human-policies.*`, mẫu `application.yml` (`prod`) và `application-dev.yml` | Đọc khi cấu hình Spring Boot profiles & bảo mật |
| **[`references/04-cookbook-verified-patterns.md`](./references/04-cookbook-verified-patterns.md)** | Công thức copy-paste đã chạy thật 100% (Entity, ReadOnly DTO, `@HttpCacheable` helper, StateMachine, `@CustomEndpoint`, `@DistributedLock`, Multi-Datasource `PRIMARY`+`REPLICA`, `@AutoCacheable`, `@Idempotent`, `@MultiTenant`, 4-entity DB-RBAC, Outbox, Webhook, Spring AI, `JwtTokenService` + `MockMvc` tests) | Đọc khi triển khai tính năng tương ứng |
| **[`references/05-imports-and-spi-contracts.md`](./references/05-imports-and-spi-contracts.md)** | Bảng tra cứu chính xác mọi `import` & chữ ký lớp ngoài Annotation (`BaseBusinessException`, `StandardHttpStatus`, `UuidUtil`, `ApiResponse`, `*Constant`, `JwtTokenService`, `DynamicRoutingDataSource`, `OutboxEvent*`, AI/Webhook/RestClient DTOs, 8 `*Customizer` SPI) | Tra cứu tức thì — triệt tiêu hoàn toàn việc phải đoán package hay chạy `javap` |
| **[`adapters/`](./adapters/)** | 8 tệp cấu hình thả-vào-là-chạy (drop-in) cho mọi AI coding tool / LLM | Cài vào gốc dự án mục tiêu bằng script |
| **[`../llms.txt`](../llms.txt)** | Tệp điều hướng chuẩn [`llmstxt.org`](https://llmstxt.org/) giúp crawler / agent đọc repo tự động | Đọc tự động từ root hoặc GitHub Pages |

---

## 2. Hỗ Trợ Mọi AI-Agent & Mọi Model LLM Trên Thị Trường

| AI Agent / IDE / Model | Tệp Adapter | Vị trí cài đặt trong dự án của bạn | Cơ chế Skill tự động |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI / Gemini 2.5–3.x** | `adapters/GEMINI.md` + `adapters/AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/SKILL.md` |
| **Anthropic Claude Code (Opus / Sonnet / Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/SKILL.md` |
| **OpenAI Codex CLI / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/SKILL.md` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | Đọc `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code, JetBrains, Coding Agent)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | Đọc `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | Đọc `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | Đọc `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Ollama/Llama, Aider, Continue.dev, Amazon Q** | `adapters/GENERIC_LLM_PROMPT.md` | Dán vào System Prompt / Project Instructions (và đính kèm `references/01` + `04` nếu hỗ trợ upload file) | N/A (self-contained prompt) |

---

## 3. Cài Đặt Trong 1 Lệnh (1-Command Installation)

### Windows (PowerShell)

```powershell
# Cài đầy đủ cho TẤT CẢ các AI Agent (khuyên dùng cho team dùng nhiều IDE/model khác nhau)
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project"

# Hoặc chỉ cài cho 1 AI Agent cụ thể:
# Giá trị -Agent: all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent claude

# Ghi đè các tệp root adapter đã tồn tại (mặc định script giữ nguyên tệp cũ để tránh mất rule riêng của bạn):
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all -Force
```

### macOS / Linux / Git Bash

```bash
# Cài đầy đủ cho TẤT CẢ các AI Agent
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project

# Hoặc chỉ cài cho 1 AI Agent cụ thể:
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent cursor

# Ghi đè tệp root adapter đã tồn tại:
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all --force
```

### Cài thủ công (Không dùng script)

1. Copy `ai-agent-kit/{SKILL.md, INTRO.md, RULES.md, CHECKLIST.md, references/}` vào `<your-project>/.agents/skills/spring-nwvmc-adoption/` (và `.claude/skills/spring-nwvmc-adoption/` nếu dùng Claude Code).
2. Copy tệp adapter tương ứng trong `ai-agent-kit/adapters/` vào đúng vị trí theo bảng mục 2 ở trên.

---

## 4. Câu Lệnh Mẫu Gửi Cho AI-Agent (Copy-Paste First Prompts)

Sau khi cài kit vào dự án của bạn, chỉ cần gửi 1 trong các prompt sau cho AI Agent:

### Prompt 1 — Tích hợp Spring-NWVMC vào dự án mới hoặc dự án Spring Boot sẵn có
> *"Hãy đọc skill `spring-nwvmc-adoption` (`INTRO.md`, `RULES.md`, `SKILL.md`) và tích hợp Spring-NWVMC `v0.1.0` (JitPack) vào dự án Spring Boot này: cập nhật `pom.xml` với `<parameters>true</parameters>`, tạo `application.yml` an toàn cho production và `application-dev.yml` bật Dev Studio, tạo entity `Product` + `ProductController`, và viết test `MockMvc` chạy pass 100%."*

### Prompt 2 — Thêm nghiệp vụ đặt hàng có StateMachine + DistributedLock + Idempotency
> *"Dựa theo `spring-nwvmc-adoption` (`references/01` và `references/04`), hãy tạo module `Order` dùng `@StateMachine` (cú pháp dấu hai chấm `FROM:TO1,TO2`), `@AutoCode(prefix = "ORD-")`, `@EntitySecurity`, `@Idempotent` cho thanh toán và `@Lazy @Service` non-final với `@DistributedLock` giữ tồn kho. Kiểm tra lại toàn bộ mục trong `CHECKLIST.md` và chạy `mvn clean verify`."*

### Prompt 3 — Kiểm toán bảo mật & tối ưu trước khi Go-Live Production
> *"Hãy chạy kiểm toán toàn bộ dự án dựa trên `CHECKLIST.md` và `RULES.md` của `spring-nwvmc-adoption`: kiểm tra `app.framework.studio.enabled`, `JWT_SECRET`, `@EntitySecurity`, `@FieldSecurity`, các lỗi `ObjectProvider<T>` / `@Lazy` / `readDto` scoping, và xác nhận `mvn clean verify` pass 100%."*
