# 07. Bộ Kit Hướng Dẫn AI-Agent (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Ngôn ngữ**: Tiếng Việt | [English](en/07_AI_AGENT_ADOPTION_KIT.md) | [Sổ Tay Đầy Đủ](../GUIDE_VI.md) | [Trang Cổng Tương Tác (`#ai-agent-kit`)](../index.html#ai-agent-kit)

---

## 1. Mục Tiêu & Kiến Trúc Bộ Kit (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../ai-agent-kit/`) trang bị cho **mọi AI-Agent và mô hình LLM trên thị trường** dữ liệu đã kiểm chứng tự động 1:1 từ mã nguồn (`60` annotation trên đúng `6` package Java, `133` thuộc tính, `40` auto-endpoint, thuộc tính `app.framework.*` và toàn bộ bẫy runtime thực chiến của `v0.1.0`), giúp đội ngũ áp dụng framework chính xác ngay lần đầu mà không ảo giác annotation hay vấp lỗi khởi động.

| Tệp / Thư mục | Vai Trò |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../ai-agent-kit/INTRO.md) | Định hướng kiến trúc: JitPack `v0.1.0` (Maven/Gradle), Hợp đồng 2 thư mục (`entity/` + `controller/`), 9 capability interfaces (`AutoReadApi`..`AutoAiApi`), 6 package annotation, 11 subsystem |
| [`ai-agent-kit/RULES.md`](../../ai-agent-kit/RULES.md) | Luật sắt chống ảo giác (`11.9 KB`, dưới ngưỡng giới hạn `24 KB`) khóa chặt toàn bộ bẫy runtime thực chiến |
| [`ai-agent-kit/SKILL.md`](../../ai-agent-kit/SKILL.md) | Kỹ năng `spring-nwvmc-adoption` gồm 6 workflow thực thi từng bước + bảng chẩn đoán nguyên nhân gốc cho 10 lỗi phổ biến |
| [`ai-agent-kit/CHECKLIST.md`](../../ai-agent-kit/CHECKLIST.md) | Cổng soát xét 6 giai đoạn (Pre-Flight -> Thiết kế -> Bẫy Runtime -> Khóa Bảo Mật Production -> Hiệu năng -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../ai-agent-kit/references/) | 5 tài liệu tham chiếu sâu theo cơ chế Progressive Disclosure (60 annotation / 133 thuộc tính, 40 API + 13 toán tử dấu chấm, YAML + Multi-Datasource, cookbook gồm `@MultiTenant` + DB-RBAC 4 thực thể + `JwtTokenService`, và bảng import/chữ ký lớp ngoài annotation không cần `javap`) |
| [`llms.txt`](../../llms.txt) & [`docs/llms.txt`](../llms.txt) | Bản đồ chuẩn `llmstxt.org` giúp trình thu thập dữ liệu và AI-Agent đọc tự động |

---

## 2. Cài Đặt Trong 1 Lệnh Vào Dự Án Spring Boot Của Bạn

### Windows (PowerShell)

```powershell
# Cài đầy đủ cho TẤT CẢ các AI-Agent & IDE
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all

# Hoặc chọn riêng 1 công cụ: all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent claude

# Ghi đè file root adapter cũ (mặc định bảo toàn an toàn file sẵn có)
.\ai-agent-kit\install.ps1 -Target "C:\path\to\your-spring-boot-project" -Agent all -Force
```

### macOS / Linux / Git Bash

```bash
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent cursor
./ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all --force
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
4. **Lớp `@Service` tiêu thụ có dùng AOP framework** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) bắt buộc **không `final`** và gắn **`@Lazy`** (kèm `@TargetDataSource` mức class khi trỏ `REPLICA` trên `v0.1.0`), đồng thời **mọi `@Component` tiêm service đó cũng phải dùng `ObjectProvider<MyService>` hoặc `@Lazy`**. Tuyệt đối không gắn `@Transactional` lên `public final class` Helper.
5. **Dev JWT & Testing**: Endpoint cấp token dev là **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (KHÔNG dùng `GET /system/studio/demo-token`); trong test gọi `jwtTokenService.generateToken(username, userId, roles)` (**`username` đứng trước**).
6. **JPA Entity kế thừa `BaseAuditEntity`** (đã có sẵn UUIDv7, soft-delete, audit và `@Version`), tuyệt đối không gắn `@Data` và không tự bịa `@SoftDelete`.
7. **Tự động tách kebab-case & phạm vi `readDto`**: `ECommerceOrder` -> `/api/v1/e-commerce-orders`; mọi endpoint trên controller có `readDto = X.class` đều ánh xạ phản hồi qua `X`.
8. **Khóa bảo mật Production**: giữ `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` và `JWT_SECRET >= 32` byte UTF-8 trong `application.yml` / `application-prod.yml` (chỉ bật Studio trong `application-dev.yml`).
