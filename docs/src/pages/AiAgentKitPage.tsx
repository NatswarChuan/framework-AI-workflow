import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { pickText } from '../data/locales';
import { STAGE8_CONTENT } from '../data/pages/stage8Content';

interface AiAgentKitPageProps {
  currentLang: SupportedLanguage;
}

const GENERIC_PROMPT_SNIPPET = `You are a Senior Java 21 & Spring Boot 3.x Architect specializing in Spring-NWVMC (0.1.0).
Always follow strict SDD (Spec-Driven) + TDD (Test-Driven) delivery and verified Spring-NWVMC 0.1.0 rules.

=== 1. DEPENDENCY & BUILD ===
- Maven Central: io.github.natswarchuan:spring-nwvmc:0.1.0 (optional JitPack mirror: com.github.NatswarChuan:Spring-NWVMC:v0.1.0)
- Java: 21 LTS | Spring Boot: 3.2.5 / 3.3.5 / 3.4.0
- REQUIRED in maven-compiler-plugin: <parameters>true</parameters>

=== 2. MANDATORY SDD + TDD PROTOCOL ===
- SDD FIRST: Draft specs/<feature>/spec.md (REQ-ID Given/When/Then criteria, schema, API surface, RBAC/tenant rules, NFRs).
  Stop on [NEEDS CLARIFICATION] until confirmed, then write plan.md (Traceability Matrix) & tasks.md ([RED]->[GREEN]->[REFACTOR]).
- TDD STRICTLY: Write failing JUnit 5 / MockMvc test (@DisplayName("REQ-XXX: ...")) FIRST (RED), run mvn test to prove failure,
  write minimal declarative Spring-NWVMC code (GREEN), then REFACTOR. Every bug fix starts with a failing regression test.
  NEVER weaken assertions or add @Disabled. Verify 4 tiers (Unit, MockMvc Integration, OpenAPI/Zod Drift, Concurrency/JMeter).

=== 3. 2-DIRECTORY CONTRACT & 6 EXACT ANNOTATION PACKAGES (60 ANNOTATIONS) ===
- entity/: JPA @Entity extending BaseAuditEntity (UUIDv7 id, soft-delete, audit, @Version built-in; NO @Data, NO @SoftDelete).
- controller/: @AutoRestController interface extending AutoApiController<E> (40 routes) or narrow AutoReadApi<E>..AutoAiApi<E>.
- 6 exact packages: core.annotation.* (54), cache.http.annotation.HttpCacheable, datasource.annotation.{TargetDataSource,TargetDatabasePlatform},
  event.annotation.PublishCloudEvent, lock.annotation.DistributedLock, webhook.annotation.EntityWebhook.

=== 4. VERIFIED RUNTIME GUARDRAILS ===
- @StateMachine.transitions uses COLON syntax: "CREATED:PENDING_PAYMENT,CANCELLED" (NEVER "FROM -> TO"); invoke via ?targetState=...
- Filter operators use DOT syntax: retailPrice.gte=1000&productName.like=MacBook (NEVER __gte).
- Inject framework @AutoComponent helpers via ObjectProvider<T> (.getObject() at runtime).
- Consumer @Service using @DistributedLock / @AutoCacheable / @TargetDataSource MUST be non-final + @Lazy
  AND lazily injected (ObjectProvider<MyService>/@Lazy). NEVER put @Transactional on public final class Helpers.
- Dev JWT: POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN; JwtTokenService.generateToken(username, userId, roles).
- Prod lockdown: app.framework.studio.enabled=false, demo-token-endpoint-enabled=false, JWT_SECRET >= 32 UTF-8 bytes.`;

const CURSOR_MDC_SNIPPET = `---
description: Spring-NWVMC (0.1.0) SDD + TDD delivery rules, exact 6 annotation packages, verified runtime gotchas, and production security lockdown for Java 21 + Spring Boot 3.x projects.
globs:
  - "**/*.java"
  - "**/application*.yml"
  - "**/application*.yaml"
  - "**/pom.xml"
  - "**/build.gradle*"
  - "**/specs/**/*.md"
alwaysApply: true
---

# Spring-NWVMC (0.1.0) Cursor Rules (SDD + TDD Enabled)
Read .agents/skills/spring-nwvmc-adoption/SKILL.md, references/01..06, and templates/{spec,plan,tasks}.template.md before coding.

- SDD FIRST: Draft specs/<feature>/spec.md (REQ-ID Given/When/Then), pause on [NEEDS CLARIFICATION], then plan.md & tasks.md; zero drift vs /v3/api-docs & /schema/zod.
- TDD RED -> GREEN -> REFACTOR: Write failing JUnit 5 / MockMvc tests FIRST (and regression test first for bugs), NEVER weaken assertions or use @Disabled.
- Require Java 21 LTS, Maven Central io.github.natswarchuan:spring-nwvmc:0.1.0, and <parameters>true</parameters>.
- 2-Directory Contract: entity/ (extends BaseAuditEntity, NO @Data, NO @SoftDelete) + controller/ (@AutoRestController).
- @StateMachine.transitions: colon syntax "CREATED:PENDING_PAYMENT,CANCELLED"; trigger via ?targetState=...
- Query operators: dot syntax (retailPrice.gte=1000&productName.like=MacBook), NEVER __gte.
- Inject framework @AutoComponent helpers via ObjectProvider<T>; mark AOP consumer @Service non-final + @Lazy
  AND inject it lazily via ObjectProvider<MyService>/@Lazy. NEVER put @Transactional on public final class Helpers.
- Dev JWT: POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN; JwtTokenService.generateToken(username, userId, roles).
- Prod lockdown: studio.enabled=false, demo-token-endpoint-enabled=false, JWT_SECRET >= 32 bytes.`;

const AGENTS_MD_SNIPPET = `# AGENTS.md — Spring-NWVMC (0.1.0) Consumer Agent Directives (SDD + TDD)
Compatible with OpenAI Codex, Google Antigravity, Claude Code, OpenCode, Zed, Amp, Jules.

## Installed Skill, Playbook & Templates
- .agents/skills/spring-nwvmc-adoption/SKILL.md       (Workflow 0 SDD+TDD + 6 Adoption/Debug Workflows)
- .agents/skills/spring-nwvmc-adoption/INTRO.md       (Maven Central 0.1.0 + 2-Directory Contract + 9 Interfaces)
- .agents/skills/spring-nwvmc-adoption/RULES.md       (SDD/TDD Protocol + Anti-Hallucination Guardrails < 24 KB)
- .agents/skills/spring-nwvmc-adoption/CHECKLIST.md   (7-Phase SDD, Security, TDD & Go-Live Sign-Off)
- .agents/skills/spring-nwvmc-adoption/references/01..05 (60 Annotations, 40 Endpoints, YAML, Cookbook, SPI Imports)
- .agents/skills/spring-nwvmc-adoption/references/06-sdd-and-tdd-playbook.md + templates/{spec,plan,tasks}.template.md

## Hard Rules
1. SDD First: Create specs/<feature>/{spec.md, plan.md, tasks.md}; stop on [NEEDS CLARIFICATION]; verify zero drift vs /v3/api-docs & /schema/zod.
2. TDD Strictly: Write failing JUnit 5 / MockMvc tests FIRST (RED) -> minimal Spring-NWVMC code (GREEN) -> REFACTOR across 4 test tiers; zero @Disabled.
3. Java 21 LTS + <parameters>true</parameters> + io.github.natswarchuan:spring-nwvmc:0.1.0 (Maven Central).
4. Never use @Data on JPA @Entity; never invent @SoftDelete (built into BaseAuditEntity).
5. @StateMachine uses colon syntax "FROM:TO1,TO2" + query param ?targetState=X; filters use dot syntax (.gte/.like).
6. Inject framework @AutoComponent helpers via ObjectProvider<T>; AOP consumer @Service must be non-final + @Lazy AND injected lazily via ObjectProvider<MyService>/@Lazy (never @Transactional on final Helpers).
7. Dev JWT is POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN; JwtTokenService.generateToken(username, userId, roles).
8. Keep studio.enabled=false and JWT_SECRET >= 32 bytes in application.yml; finish with CHECKLIST.md + mvn clean verify.`;

const SDD_TDD_FLOW_SNIPPET = `# 1. SDD (Spec-Driven) — specs/discount-voucher/spec.md (from templates/spec.template.md)
| REQ-ID  | Given                | When                                         | Then                                           |
| REQ-001 | Admin JWT            | POST /api/v1/discount-vouchers + Idemp-Key   | 201 Created, voucherCode="VCH-*", X-Request-ID |
| REQ-002 | Replay Idemp-Key     | POST /api/v1/discount-vouchers (same key)    | 409 Conflict                                   |
| REQ-003 | ROLE_USER JWT        | GET /api/v1/public/discount-vouchers/{id}    | 200 OK, readDto strips internalCostBudget      |
| REQ-004 | DRAFT voucher        | POST /{id}/transition?targetState=ACTIVE     | 200 OK (illegal jump to DRAFT -> 4xx)          |

# 2. TDD RED — Write failing test FIRST & verify failure:
mvn test -Dtest=VoucherContractAndSecurityTddTest   # Expected RED: 404 / assertion failure

# 3. TDD GREEN — Implement minimal 2-Directory Spring-NWVMC entity/ + controller/ & verify:
mvn test -Dtest=VoucherContractAndSecurityTddTest   # 100% GREEN

# 4. TDD REFACTOR & Contract-Drift Gate — Assert /v3/api-docs + /schema/zod match spec.md:
mvn clean verify                                     # 0 Failures, 0 Errors, 0 @Disabled`;

export const AiAgentKitPage: React.FC<AiAgentKitPageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="ai-agent-kit"
        currentLang={currentLang}
        badges={[
          { label: 'ai-agent-kit/', tone: 'emerald' },
          { label: 'SDD + TDD Built-In', tone: 'amber' },
          { label: 'SKILL · RULES · INTRO · CHECKLIST', tone: 'purple' },
          { label: '8 Adapters + llms.txt', tone: 'blue' },
        ]}
      />

      <h2 id="kit-overview" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Overview, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.kitGoalBody} currentLang={currentLang} />
      </p>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardIntroTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardIntroBody} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardRulesTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardRulesBody} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardSkillTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardSkillBody} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardChecklistTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardChecklistBody} currentLang={currentLang} />
          </p>
        </div>
      </div>

      <h2 id="kit-sdd-tdd" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2SddTdd, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.kitSddTddLead} currentLang={currentLang} />
      </p>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardSddTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardSddBody} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE8_CONTENT.kitCardTddTitle, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE8_CONTENT.kitCardTddBody} currentLang={currentLang} />
          </p>
        </div>
      </div>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'sdd-tdd-loop',
            label: 'SDD + TDD Workflow (06-sdd-and-tdd-playbook.md)',
            language: 'bash',
            fileName: 'specs/discount-voucher/ + Red-Green-Refactor',
            code: SDD_TDD_FLOW_SNIPPET,
          },
        ]}
      />

      <h2 id="kit-install" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Install, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.kitInstallLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'kit-ps1',
            label: 'Windows (PowerShell)',
            language: 'powershell',
            fileName: 'install-nwvmc-kit.ps1 (Zero-Clone 1-Liner)',
            highlightLines: [2, 6, 10],
            code: `# Option 1 (Recommended — ZERO clone needed! Run directly inside your Spring Boot project root):
$s="$env:TEMP\\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Target a single agent only (-Agent all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Add -Force to overwrite existing root adapter files (default preserves existing files safely)

# Option 2 (Clone repo first — useful behind offline/corporate proxies):
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git "$env:TEMP\\nwvmc-docs"; powershell -ExecutionPolicy Bypass -File "$env:TEMP\\nwvmc-docs\\ai-agent-kit\\install.ps1" -Target "." -Agent all; Remove-Item "$env:TEMP\\nwvmc-docs" -Recurse -Force`,
          },
          {
            id: 'kit-sh',
            label: 'macOS / Linux (Bash)',
            language: 'bash',
            fileName: 'install-nwvmc-kit.sh (Zero-Clone 1-Liner)',
            highlightLines: [2, 5, 11],
            code: `# Option 1 (Recommended — ZERO clone needed! Run directly inside your Spring Boot project root):
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all

# Target a single agent only (--agent all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor

# Add --force to overwrite existing root adapter files (default preserves existing files safely)

# Option 2 (Clone repo first — useful behind offline/corporate proxies):
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target . --agent all
rm -rf /tmp/nwvmc-docs`,
          },
          {
            id: 'kit-manual',
            label: pickText(STAGE8_CONTENT.kitTabManual, currentLang),
            language: 'bash',
            fileName: 'manual-setup-and-llmstxt.sh',
            code: `# 1. Shallow-clone the official documentation & AI-Agent Kit repo
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs

# 2. Copy the progressive-disclosure skill + 6 verified references + SDD templates into your Spring Boot project
mkdir -p .agents/skills/spring-nwvmc-adoption/references .agents/skills/spring-nwvmc-adoption/templates
cp /tmp/nwvmc-docs/ai-agent-kit/{SKILL.md,INTRO.md,RULES.md,CHECKLIST.md} .agents/skills/spring-nwvmc-adoption/
cp /tmp/nwvmc-docs/ai-agent-kit/references/* .agents/skills/spring-nwvmc-adoption/references/
cp /tmp/nwvmc-docs/ai-agent-kit/templates/* .agents/skills/spring-nwvmc-adoption/templates/

# 3. (Claude Code) Mirror into .claude/skills/spring-nwvmc-adoption/
# 4. Copy your tool's adapter from /tmp/nwvmc-docs/ai-agent-kit/adapters/ to your repo root
rm -rf /tmp/nwvmc-docs

# 5. Direct HTTPS llmstxt.org & raw skill URLs (no download needed for web-capable AI agents):
#    - https://natswarchuan.github.io/Spring-NWVMC-document/llms.txt
#    - https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/SKILL.md`,
          },
        ]}
      />

      <h2 id="kit-adapters" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Adapters, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE8_CONTENT.kitThEcosystem, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.kitThAdapter, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.kitThTargetPath, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.kitThAutoSkill, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Google Antigravity / Gemini CLI</strong></td>
              <td><code>adapters/GEMINI.md</code> + <code>AGENTS.md</code></td>
              <td><code>GEMINI.md</code> + <code>AGENTS.md</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>Anthropic Claude Code</strong></td>
              <td><code>adapters/CLAUDE.md</code></td>
              <td><code>CLAUDE.md</code></td>
              <td><code>.claude/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>OpenAI Codex / OpenCode / Zed / Amp / Jules</strong></td>
              <td><code>adapters/AGENTS.md</code></td>
              <td><code>AGENTS.md</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>Cursor IDE</strong></td>
              <td><code>adapters/cursor/spring-nwvmc.mdc</code></td>
              <td><code>.cursor/rules/spring-nwvmc.mdc</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>GitHub Copilot</strong></td>
              <td><code>adapters/copilot-instructions.md</code></td>
              <td><code>.github/copilot-instructions.md</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>Windsurf / Codeium Cascade</strong></td>
              <td><code>adapters/windsurfrules</code></td>
              <td><code>.windsurfrules</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>Cline &amp; Roo Code</strong></td>
              <td><code>adapters/clinerules</code></td>
              <td><code>.clinerules</code></td>
              <td><code>.agents/skills/spring-nwvmc-adoption/</code></td>
            </tr>
            <tr>
              <td><strong>ChatGPT, DeepSeek, Qwen, Grok, Mistral, Llama, Aider</strong></td>
              <td><code>adapters/GENERIC_LLM_PROMPT.md</code></td>
              <td>{pickText(STAGE8_CONTENT.kitGenericPasteCell, currentLang)}</td>
              <td><code>llms.txt</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="kit-templates" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Templates, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.kitTemplatesLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'tpl-generic',
            label: 'GENERIC_LLM_PROMPT.md',
            language: 'markdown',
            fileName: 'ai-agent-kit/adapters/GENERIC_LLM_PROMPT.md',
            code: GENERIC_PROMPT_SNIPPET,
          },
          {
            id: 'tpl-cursor',
            label: '.cursor/rules/spring-nwvmc.mdc',
            language: 'markdown',
            fileName: '.cursor/rules/spring-nwvmc.mdc',
            code: CURSOR_MDC_SNIPPET,
          },
          {
            id: 'tpl-agents',
            label: 'AGENTS.md / CLAUDE.md / GEMINI.md',
            language: 'markdown',
            fileName: 'AGENTS.md',
            code: AGENTS_MD_SNIPPET,
          },
        ]}
      />

      <h2 id="kit-guardrails" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Guardrails, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE8_CONTENT.kitThPitfall, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.kitThWrong, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.kitThVerified, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall1, currentLang)}</strong></td>
              <td><code>"CREATED -&gt; PAID"</code> + JSON body</td>
              <td><code>"CREATED:PENDING_PAYMENT,CANCELLED"</code> + <code>POST /&#123;id&#125;/transition?targetState=PAID</code></td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall2, currentLang)}</strong></td>
              <td><code>retailPrice__gte=1000</code></td>
              <td><code>retailPrice.gte=1000&amp;productName.like=MacBook</code></td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall3, currentLang)}</strong></td>
              <td>Direct constructor field for <code>*Helper</code></td>
              <td><code>ObjectProvider&lt;T&gt;</code> + <code>.getObject()</code></td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall4, currentLang)}</strong></td>
              <td><code>public final class</code> / eager inject / <code>@Transactional</code> on Helper</td>
              <td>Non-final <code>@Lazy @Service</code> + lazy <code>ObjectProvider&lt;MyService&gt;</code> in callers (+ class <code>@TargetDataSource</code> on <code>v0.1.0</code>)</td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall5, currentLang)}</strong></td>
              <td><code>@Data</code> + invented <code>@SoftDelete</code></td>
              <td><code>extends BaseAuditEntity</code> + <code>@Getter @Setter @SuperBuilder</code></td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall6, currentLang)}</strong></td>
              <td><code>/api/v1/ecommerce-orders</code></td>
              <td><code>/api/v1/e-commerce-orders</code> (or explicit <code>basePath</code>)</td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall7, currentLang)}</strong></td>
              <td>Analytics route on <code>readDto = ProductReadDto.class</code></td>
              <td>Mount custom DTO routes on a controller without <code>readDto</code></td>
            </tr>
            <tr>
              <td><strong>{pickText(STAGE8_CONTENT.kitRowPitfall8, currentLang)}</strong></td>
              <td><code>studio.enabled: true</code> in <code>application.yml</code></td>
              <td><code>studio.enabled: false</code> + <code>JWT_SECRET &gt;= 32</code> bytes (Studio only in <code>application-dev.yml</code>)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="kit-prompts" className="section-heading">
        {pickText(STAGE8_CONTENT.kitH2Prompts, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.kitPromptsLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'prompt-bootstrap',
            label: pickText(STAGE8_CONTENT.kitTabPrompt1, currentLang),
            language: 'text',
            fileName: 'prompt-1-bootstrap.txt',
            code: `Read the spring-nwvmc-adoption skill (INTRO.md, RULES.md, SKILL.md, references/06-sdd-and-tdd-playbook.md) and integrate io.github.natswarchuan:spring-nwvmc:0.1.0 (Maven Central) into this Spring Boot 3.x project using SDD + TDD:
1. Update pom.xml with Java 21, io.github.natswarchuan:spring-nwvmc:0.1.0, and <parameters>true</parameters>.
2. Create a production-safe application.yml (studio.enabled=false, fail-fast-weak-jwt-secret=true) and application-dev.yml (Studio enabled).
3. Draft specs/product-catalog/spec.md (REQ-ID Given/When/Then criteria), plan.md, and tasks.md; pause if any [NEEDS CLARIFICATION] exists.
4. Execute strict TDD: write failing MockMvc tests first (RED) covering create (201), dot-syntax filtering, RBAC masking, and /v3/api-docs drift -> implement ProductCatalog + ProductCatalogController (GREEN) -> refactor and run mvn clean verify until 100% pass.`,
          },
          {
            id: 'prompt-workflow',
            label: pickText(STAGE8_CONTENT.kitTabPrompt2, currentLang),
            language: 'text',
            fileName: 'prompt-2-order-lock-idempotent.txt',
            code: `Using spring-nwvmc-adoption (references/01 and references/04), build an Order & Inventory workflow:
1. ECommerceOrder entity with @AutoCode(prefix = "ORD-"), @StateMachine using colon transitions ("CREATED:PENDING_PAYMENT,CANCELLED"), and @EntitySecurity.
2. PaymentTransaction controller with @Idempotent(headerName = "X-Idempotency-Key").
3. Non-final @Lazy @Service implementing atomic stock reservation guarded by @DistributedLock(key = "'SKU_STOCK_' + #skuCode").
4. Verify every item in CHECKLIST.md and pass mvn clean verify with 0 failures.`,
          },
          {
            id: 'prompt-audit',
            label: pickText(STAGE8_CONTENT.kitTabPrompt3, currentLang),
            language: 'text',
            fileName: 'prompt-3-production-audit.txt',
            code: `Audit this Spring-NWVMC repository against CHECKLIST.md and RULES.md in spring-nwvmc-adoption:
1. Verify application.yml / application-prod.yml lock down /system/studio and /api/v1/auth/token and enforce JWT_SECRET >= 32 bytes.
2. Confirm every business entity declares @EntitySecurity and masks sensitive fields via @FieldSecurity (and never uses Lombok @Data).
3. Check for runtime pitfalls: ObjectProvider<T> for framework @AutoComponent helpers, non-final @Lazy @Service for AOP, colon @StateMachine syntax, dot-syntax query filters, and readDto scoping.
4. Fix any findings and verify with mvn clean verify.`,
          },
        ]}
      />

      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE8_CONTENT.kitCalloutVerify} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
