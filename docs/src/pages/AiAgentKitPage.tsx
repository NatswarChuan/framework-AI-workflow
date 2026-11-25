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

const GENERIC_PROMPT_SNIPPET = `You are a Senior Java 21 & Spring Boot 3.x Architect specializing in Spring-NWVMC (v0.1.0).
Always generate code that strictly conforms to the verified runtime behavior of Spring-NWVMC v0.1.0.

=== 1. DEPENDENCY & BUILD ===
- Maven Central: io.github.natswarchuan:spring-nwvmc:0.1.0 (optional JitPack mirror: com.github.NatswarChuan:Spring-NWVMC:v0.1.0)
- Java: 21 LTS | Spring Boot: 3.2.5 / 3.3.5 / 3.4.0
- REQUIRED in maven-compiler-plugin: <parameters>true</parameters>

=== 2. 2-DIRECTORY CONTRACT ===
- entity/: JPA @Entity extending BaseAuditEntity (UUIDv7 id, soft-delete, audit, @Version built-in).
  NEVER use Lombok @Data on JPA @Entity. NEVER invent @SoftDelete.
- controller/: @AutoRestController interface extending AutoApiController<E> (40 routes)
  or narrow interfaces (AutoReadApi<E>..AutoAiApi<E>). Do NOT scaffold boilerplate CRUD.

=== 3. EXACT 6 REAL ANNOTATION PACKAGES (60 ANNOTATIONS) ===
1. io.github.natswarchuan.core.annotation.* (54 annotations)
2. io.github.natswarchuan.module.cache.http.annotation.HttpCacheable
3. io.github.natswarchuan.module.datasource.annotation.{TargetDataSource, TargetDatabasePlatform}
4. io.github.natswarchuan.module.event.annotation.PublishCloudEvent
5. io.github.natswarchuan.module.lock.annotation.DistributedLock
6. io.github.natswarchuan.module.webhook.annotation.EntityWebhook

=== 4. VERIFIED RUNTIME GUARDRAILS ===
- @StateMachine.transitions uses COLON syntax: "CREATED:PENDING_PAYMENT,CANCELLED" (NEVER "FROM -> TO").
  Invoke via query param: POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT.
- Filter operators use DOT syntax: retailPrice.gte=1000&productName.like=MacBook (NEVER __gte).
- CamelCase basePath: ECommerceOrder -> /api/v1/e-commerce-orders.
- Inject framework @AutoComponent helpers via ObjectProvider<T> (.getObject() at runtime).
- Consumer @Service using @DistributedLock / @AutoCacheable / @TargetDataSource MUST be non-final + @Lazy
  (with class-level @TargetDataSource when targeting REPLICA on v0.1.0), AND callers injecting them MUST ALSO
  use ObjectProvider<MyService> or @Lazy. NEVER put @Transactional on public final class Helpers.
- Dev JWT endpoint: POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN (NOT GET /system/studio/demo-token);
  JwtTokenService.generateToken(username, userId, roles) takes username FIRST.
- Controllers with readDto = X.class project ALL responses through X.
- Prod lockdown: app.framework.studio.enabled=false, demo-token-endpoint-enabled=false,
  fail-fast-weak-jwt-secret=true, JWT_SECRET >= 32 UTF-8 bytes.`;

const CURSOR_MDC_SNIPPET = `---
description: Spring-NWVMC (v0.1.0) enterprise adoption rules, exact 6 annotation packages, verified runtime gotchas, and production security lockdown for Java 21 + Spring Boot 3.x projects.
globs:
  - "**/*.java"
  - "**/application*.yml"
  - "**/application*.yaml"
  - "**/pom.xml"
  - "**/build.gradle*"
alwaysApply: true
---

# Spring-NWVMC (v0.1.0) Cursor Rules
Read .agents/skills/spring-nwvmc-adoption/SKILL.md and references/01..05 before inventing annotations or YAML keys.

- Require Java 21 LTS, Maven Central io.github.natswarchuan:spring-nwvmc:0.1.0, and <parameters>true</parameters>.
- 2-Directory Contract: entity/ (extends BaseAuditEntity, NO @Data, NO @SoftDelete) + controller/ (@AutoRestController).
- @StateMachine.transitions: colon syntax "CREATED:PENDING_PAYMENT,CANCELLED"; trigger via ?targetState=...
- Query operators: dot syntax (retailPrice.gte=1000&productName.like=MacBook), NEVER __gte.
- Inject framework @AutoComponent helpers via ObjectProvider<T>; mark AOP consumer @Service non-final + @Lazy
  AND inject it lazily via ObjectProvider<MyService>/@Lazy. NEVER put @Transactional on public final class Helpers.
- Dev JWT: POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN; JwtTokenService.generateToken(username, userId, roles).
- Prod lockdown: studio.enabled=false, demo-token-endpoint-enabled=false, JWT_SECRET >= 32 bytes.`;

const AGENTS_MD_SNIPPET = `# AGENTS.md — Spring-NWVMC (v0.1.0) Consumer Agent Directives
Compatible with OpenAI Codex, Google Antigravity, Claude Code, OpenCode, Zed, Amp, Jules.

## Installed Skill & Machine-Verified References
- .agents/skills/spring-nwvmc-adoption/SKILL.md       (6 Workflows + 10-Row Troubleshooting Matrix)
- .agents/skills/spring-nwvmc-adoption/INTRO.md       (JitPack v0.1.0 + 2-Directory Contract + 9 Interfaces)
- .agents/skills/spring-nwvmc-adoption/RULES.md       (Strict Anti-Hallucination Guardrails < 24 KB)
- .agents/skills/spring-nwvmc-adoption/CHECKLIST.md   (6-Phase Pre-Handover Sign-Off)
- .agents/skills/spring-nwvmc-adoption/references/01-annotations-exact-matrix.md (60 annotations / 133 attributes)
- .agents/skills/spring-nwvmc-adoption/references/02-endpoints-and-query-dsl.md  (40 endpoints / 13 dot operators)
- .agents/skills/spring-nwvmc-adoption/references/03-yaml-properties-and-profiles.md
- .agents/skills/spring-nwvmc-adoption/references/04-cookbook-verified-patterns.md
- .agents/skills/spring-nwvmc-adoption/references/05-imports-and-spi-contracts.md (Zero-javap imports & signatures)

## Hard Rules
1. Java 21 LTS + <parameters>true</parameters> + io.github.natswarchuan:spring-nwvmc:0.1.0 (Maven Central).
2. Never use @Data on JPA @Entity; never invent @SoftDelete (built into BaseAuditEntity).
3. @StateMachine uses colon syntax "FROM:TO1,TO2" + query param ?targetState=X; filters use dot syntax (.gte/.like).
4. Inject framework @AutoComponent helpers via ObjectProvider<T>; AOP consumer @Service must be non-final + @Lazy AND injected lazily via ObjectProvider<MyService>/@Lazy (never @Transactional on final Helpers).
5. Dev JWT is POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN; JwtTokenService.generateToken(username, userId, roles).
6. Keep studio.enabled=false and JWT_SECRET >= 32 bytes in application.yml; finish with CHECKLIST.md + mvn clean verify.`;

export const AiAgentKitPage: React.FC<AiAgentKitPageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="ai-agent-kit"
        currentLang={currentLang}
        badges={[
          { label: 'ai-agent-kit/', tone: 'emerald' },
          { label: 'SKILL · RULES · INTRO · CHECKLIST', tone: 'purple' },
          { label: '8 Adapters + llms.txt', tone: 'blue' },
          { label: 'v0.1.0 Verified', tone: 'amber' },
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

# 2. Copy the progressive-disclosure skill + 5 verified references into your Spring Boot project
mkdir -p .agents/skills/spring-nwvmc-adoption/references
cp /tmp/nwvmc-docs/ai-agent-kit/{SKILL.md,INTRO.md,RULES.md,CHECKLIST.md} .agents/skills/spring-nwvmc-adoption/
cp /tmp/nwvmc-docs/ai-agent-kit/references/* .agents/skills/spring-nwvmc-adoption/references/

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
            code: `Read the spring-nwvmc-adoption skill (INTRO.md, RULES.md, SKILL.md) and integrate Spring-NWVMC v0.1.0 (JitPack) into this Spring Boot 3.x project:
1. Update pom.xml with Java 21, JitPack repository, com.github.NatswarChuan:Spring-NWVMC:v0.1.0, and <parameters>true</parameters>.
2. Create a production-safe application.yml (studio.enabled=false, fail-fast-weak-jwt-secret=true) and application-dev.yml (Studio enabled).
3. Create ProductCatalog (extending BaseAuditEntity with @EntitySecurity & @FieldSecurity) and ProductCatalogController (@AutoRestController).
4. Write MockMvc tests covering create (201), dot-syntax filtering, and RBAC masking, then run mvn clean verify until 100% pass.`,
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
