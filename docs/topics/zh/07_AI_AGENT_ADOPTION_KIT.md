# 07. 通用 AI-Agent 集成工具包（`SKILL` · `RULES` · `INTRO` · `CHECKLIST` 与 `llms.txt`，`0.1.0`）

> **语言**: [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | **中文** | [全部 20 种语言](../README.md) | [完整参考手册](../../GUIDE_ZH.md) | [20 语言互动文档门户](../../index.html#ai-agent-kit)

---

## 1. 设计目标与工具包架构（`ai-agent-kit/`）

**Spring-NWVMC AI-Agent Adoption Kit**（`../../../ai-agent-kit/`）为**市面上所有 AI 编程代理与大模型**提供 1:1 机器校验的权威事实（`6` 个精确 Java 包中的 `60` 个注解、`133` 项属性、`40` 个自动端点、`app.framework.*` 配置键与实测验证的 `0.1.0` 运行时护栏），助力团队一次精准落地，杜绝幻觉注解与运行时踩坑。

| 文件 / 目录 | 作用说明 |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | 架构总览：Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` 与 JitPack `v0.1.0`、双目录契约（`entity/` + `controller/`）、9 个可组合能力接口、6 个注解包、6 个内置子系统 |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | 严格防幻觉护栏，收录所有实测验证的运行时陷阱 |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | 渐进披露式 `spring-nwvmc-adoption` 技能手册（7 套落地工作流 + 15 行根因排障矩阵） |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 7 阶段交付前核验闸门（前置检查 -> 领域设计 -> 运行时陷阱 -> 生产安全锁定 -> 性能 -> `mvn clean verify`） |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) 份机器校验深度参考（60 注解 / 133 属性、40 端点 + 13 点分运算符、YAML + 多数据源、含 `@MultiTenant` + 4 实体 DB-RBAC + `JwtTokenService` 的实战配方、非注解类/常量/SPI 精确导入表） |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | 符合 `llmstxt.org` 规范的 AI 爬虫与代理入口索引 |

---

## 2. 一行命令零克隆安装（Zero-Clone 1-Liner）

直接在您的 **Spring Boot 项目根目录** 打开终端并粘贴执行以下任一命令——无需提前克隆仓库或准备本地文件（脚本直接从 `https://github.com/NatswarChuan/Spring-NWVMC-document` 拉取校验过的完整文件）：

### Windows (PowerShell)

```powershell
# 为所有 AI 编程代理与大模型安装到当前目录（"."）
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 或仅针对单一代理安装（all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic）：
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 添加 -Force 可覆盖已有根目录适配器文件（默认安全保留已有文件）
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### 先克隆后安装（离线 / 企业内网代理）

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. 全平台 AI-Agent 与 LLM 兼容矩阵

| AI 代理 / IDE / 大模型 | 适配器源文件 | 项目目标路径 | 自动加载技能 |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | 粘贴至 System Prompt / Project Instructions | `llms.txt` |

---

## 4. `RULES.md` 强制执行的 8 大实测运行时避坑法则

1. **`@StateMachine.transitions` 必须使用冒号语法**（`"CREATED:PENDING_PAYMENT,CANCELLED"`），切勿使用 `"FROM -> TO"`；状态流转通过查询参数 `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` 触发（非 JSON 请求体）。
2. **查询过滤运算符使用点语法**（`retailPrice.gte=1000&productName.like=MacBook`），切勿使用 `__gte`。
3. **注入框架 `@AutoComponent` Helper 必须使用 `ObjectProvider<T>`**（`DynamicEntityAiMetadataProviderHelper`、`AiNaturalLanguageQueryParserHelper`、`ThirdPartyRestClientHelper`、`WebhookDispatcherHelper`），并在运行时调用 `.getObject()`。
4. **受 AOP 拦截的业务 `@Service` 类**（`@DistributedLock`、`@AutoCacheable`、`@AutoCacheEvict`、`@TargetDataSource`）必须为 **非 final** 且标注 **`@Lazy`**，且注入它的业务 `@Component` 也须使用 **`ObjectProvider<MyService>`** 或 **`@Lazy`**；切勿在 `public final class` Helper 上加 `@Transactional`。
5. **开发 JWT 与集成测试**：开发签发端点为 **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`**（绝非 `GET /system/studio/demo-token`）；测试调用 `jwtTokenService.generateToken(username, userId, roles)`（**`username` 为第 1 参数**）。
6. **JPA 实体继承 `BaseAuditEntity`**（内置 UUIDv7 `id`、软删、审计字段与 `@Version`）；严禁在 `@Entity` 上使用 `@Data`，亦不存在 `@SoftDelete`。
7. **驼峰自动路由与 `readDto` 作用域**：`ECommerceOrder` 映射为 `/api/v1/e-commerce-orders`；声明 `readDto = X.class` 的控制器会将全部响应投影为 `X`。
8. **生产环境安全锁定**：在 `application.yml` / `application-prod.yml` 保持 `app.framework.studio.enabled: false`、`demo-token-endpoint-enabled: false`、`fail-fast-weak-jwt-secret: true` 且 `JWT_SECRET >= 32` 字节（仅在 `application-dev.yml` 开启 Studio）。

---

## 5. SDD（规范驱动）与 TDD（测试驱动）质量协议

所有适配器与技能流程均基于 `references/06-sdd-and-tdd-playbook.md` 与 `templates/{spec,plan,tasks}.template.md` 强制执行“先写规范、先写测试”的交付闭环，杜绝 AI 隐式猜测、契约漂移与未测代码。

- **SDD — 规范驱动开发（`specs/<feature>/`）:** 6 阶段门禁（`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`）：先编写带 `REQ-ID`（`Given/When/Then`）的 `spec.md`，遇 `[NEEDS CLARIFICATION]` 强制停下确认，在 `plan.md` 建立 1:1 追溯矩阵，并与实时 `/v3/api-docs`、`/metadata`、`/schema/zod` 零漂移对齐。
- **TDD — 红 → 绿 → 重构（4 层测试金字塔）:** 先编写带 `@DisplayName("REQ-XXX: ...")` 的失败 JUnit 5 / `MockMvc` 测试（修 Bug 先写回归测试），再以极简声明式代码转绿并重构；覆盖第 1 层单元测试、第 2 层安全与流程集成、第 3 层契约漂移校验及第 4 层 `@DistributedLock` 并发与 JMeter `0.0%` 错误率，严禁 `@Disabled`。
- **实操手册与模板：** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
