# 07. Bộ Kit Hướng Dẫn AI-Agent (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Ngôn ngữ**: [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | **Tiếng Việt** | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Đủ 20 Ngôn Ngữ](../README.md) | [Cẩm Nang Đầy Đủ](../../GUIDE_VI.md) | [Cổng Tài Liệu 20 Ngôn Ngữ](../../index.html#ai-agent-kit)

---

## 1. Mục Tiêu & Kiến Trúc Bộ Kit (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) trang bị cho **mọi AI-Agent và mô hình LLM trên thị trường** dữ liệu đã kiểm chứng tự động 1:1 từ mã nguồn (`60` annotation trên đúng `6` package Java, `133` thuộc tính, `40` auto-endpoint, thuộc tính `app.framework.*` và toàn bộ bẫy runtime thực chiến của `0.1.0`), giúp đội ngũ áp dụng framework chính xác ngay lần đầu mà không ảo giác annotation hay vấp lỗi khởi động.

| Tệp / Thư mục | Vai Trò |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Định hướng kiến trúc: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `0.1.0`, Hợp đồng 2 thư mục (`entity/` + `controller/`), 9 capability interfaces (`AutoReadApi`..`AutoAiApi`), 6 package annotation, 11 subsystem |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Luật sắt chống ảo giác (`17.2 KB`, dưới ngưỡng giới hạn `24 KB`) khóa chặt toàn bộ bẫy runtime thực chiến |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Kỹ năng `spring-nwvmc-adoption` gồm 6 workflow thực thi từng bước + bảng chẩn đoán nguyên nhân gốc cho 10 lỗi phổ biến |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Cổng soát xét 6 giai đoạn (Pre-Flight -> Thiết kế -> Bẫy Runtime -> Khóa Bảo Mật Production -> Hiệu năng -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 5 tài liệu tham chiếu sâu theo cơ chế Progressive Disclosure (60 annotation / 133 thuộc tính, 40 API + 13 toán tử dấu chấm, YAML + Multi-Datasource, cookbook gồm `@MultiTenant` + DB-RBAC 4 thực thể + `JwtTokenService`, và bảng import/chữ ký lớp ngoài annotation không cần `javap`) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Bản đồ chuẩn `llmstxt.org` giúp trình thu thập dữ liệu và AI-Agent đọc tự động |

---

## 2. Cài Đặt Trong 1 Lệnh — Không Cần Clone Repo Trước

Mở terminal **ngay trong thư mục gốc dự án Spring Boot của bạn** và dán 1 trong 2 lệnh sau (script tự tải toàn bộ 26 tệp từ `https://github.com/NatswarChuan/Spring-NWVMC-document` mà không yêu cầu file local sẵn có):

### Windows (PowerShell)

```powershell
# Cài đầy đủ cho TẤT CẢ AI-Agent & IDE ngay tại thư mục dự án hiện tại (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Hoặc chọn riêng 1 công cụ (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Thêm -Force để ghi đè file root adapter cũ (mặc định bảo toàn an toàn file sẵn có)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Hoặc Clone Repo Trước (Môi Trường Offline / Proxy)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Bảng Tương Thích Mọi AI-Agent & Mô Hình LLM

| AI-Agent / IDE / Model | Tệp Adapter Nguồn | Vị Trí Cài Trong Dự Án | Nạp Skill Tự Động |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Dán vào System Prompt / Project Instructions | `llms.txt` |

---

## 4. 8 Bẫy Runtime Thực Chiến Được Khóa Chặt Trong `RULES.md`

1. **`@StateMachine.transitions` dùng dấu hai chấm** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), tuyệt đối không dùng `"FROM -> TO"`, và gọi chuyển trạng thái qua query param `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT`.
2. **Toán tử lọc dùng dấu chấm** (`retailPrice.gte=1000&productName.like=MacBook`), tuyệt đối không dùng `__gte`.
3. **Tiêm Helper `@AutoComponent` của framework qua `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) và gọi `.getObject()` lúc thực thi.
4. **Lớp `@Service` tiêu thụ có dùng AOP framework** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) bắt buộc **không `final`** và gắn **`@Lazy`** (kèm `@TargetDataSource` mức class khi trỏ `REPLICA` trên `0.1.0`), đồng thời **mọi `@Component` tiêm service đó cũng phải dùng `ObjectProvider<MyService>` hoặc `@Lazy`**. Tuyệt đối không gắn `@Transactional` lên `public final class` Helper.
5. **Dev JWT & Testing**: Endpoint cấp token dev là **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (KHÔNG dùng `GET /system/studio/demo-token`); trong test gọi `jwtTokenService.generateToken(username, userId, roles)` (**`username` đứng trước**).
6. **JPA Entity kế thừa `BaseAuditEntity`** (đã có sẵn UUIDv7, soft-delete, audit và `@Version`), tuyệt đối không gắn `@Data` và không tự bịa `@SoftDelete`.
7. **Tự động tách kebab-case & phạm vi `readDto`**: `ECommerceOrder` -> `/api/v1/e-commerce-orders`; mọi endpoint trên controller có `readDto = X.class` đều ánh xạ phản hồi qua `X`.
8. **Khóa bảo mật Production**: giữ `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` và `JWT_SECRET >= 32` byte UTF-8 trong `application.yml` / `application-prod.yml` (chỉ bật Studio trong `application-dev.yml`).

---

## 5. Giao Thức Chất Lượng SDD (Hướng Đặc Tả) & TDD (Hướng Kiểm Thử)

Toàn bộ adapter và skill đều cưỡng chế quy trình Đặc tả trước + Kiểm thử trước qua `references/06-sdd-and-tdd-playbook.md` và bộ mẫu `templates/{spec,plan,tasks}.template.md`, triệt tiêu việc AI tự đoán yêu cầu, lệch contract hay bàn giao code thiếu test.

- **SDD — Phát Triển Hướng Đặc Tả (`specs/<feature>/`):** Chu trình 6 cổng (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): viết `spec.md` với tiêu chí `REQ-ID` (`Given/When/Then`), dừng ngay tại `[NEEDS CLARIFICATION]` để xác nhận, lập ma trận truy vết 1:1 trong `plan.md` và đối chiếu không lệch với `/v3/api-docs`, `/metadata`, `/schema/zod`.
- **TDD — Red → Green → Refactor (Kim Tự Tháp Kiểm Thử 4 Tầng):** Viết test JUnit 5 / `MockMvc` thất bại trước gắn `@DisplayName("REQ-XXX: ...")` (mọi bug fix phải có regression test trước), viết code khai báo tối thiểu cho tới khi GREEN rồi REFACTOR. Phủ đủ 4 tầng: Unit, Tích hợp Bảo mật/Nghiệp vụ, Chống lệch Contract, và Đồng thời `@DistributedLock` + JMeter `0.0%` lỗi — cấm `@Disabled`.
- **Playbook & Templates:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
