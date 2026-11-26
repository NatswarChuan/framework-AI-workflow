# 07. Kit Universal de Adoção para Agentes IA (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` e `llms.txt`, `0.1.0`)

> **Idiomas**: **Português** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Todos os 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interativo (20 Idiomas)](../../index.html#ai-agent-kit)

---

## 1. Propósito e Arquitetura do Kit (`ai-agent-kit/`)

O **Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) fornece a **todos os agentes de código IA e LLMs do mercado** fatos verificados por máquina 1:1 no código-fonte (`60` anotações em `6` pacotes Java exatos, `133` atributos, `40` endpoints automáticos, chaves `app.framework.*` e regras runtime comprovadas na `0.1.0`) para adotar o Spring-NWVMC corretamente já na primeira tentativa.

| Arquivo / Diretório | Papel |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Orientação arquitetural: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` e JitPack `v0.1.0`, contrato de 2 diretórios (`entity/` + `controller/`), 9 interfaces combináveis, 6 pacotes de anotações e 6 subsistemas integrados |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Barreiras estritas anti-alucinação documentando cada armadilha de runtime comprovada |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Skill progressiva `spring-nwvmc-adoption` com 7 fluxos passo a passo e matriz de solução de problemas com 15 causas raiz |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Portão de verificação em 7 fases antes da entrega (Pre-Flight -> Design -> Armadilhas Runtime -> Bloqueio Produção -> Performance -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) referências profundas verificadas por máquina (60 anotações / 133 atributos, 40 endpoints + 13 operadores com ponto, YAML + Multi-Datasource, receitas com `@MultiTenant` + DB-RBAC de 4 entidades + `JwtTokenService`, e imports exatos não-anotação / SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Pontos de entrada `llmstxt.org` para rastreadores e agentes de IA |

---

## 2. Instalação em 1 Comando sem Clonar (Zero-Clone 1-Liner)

Abra um terminal **diretamente na raiz do seu projeto Spring Boot** e execute um dos comandos abaixo — sem clonar o repositório nem ter arquivos locais prévios (o script baixa tudo de `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Instalar para TODOS os agentes IA e modelos no diretório atual (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Ou escolher um agente específico (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Passe -Force para sobrescrever adaptadores existentes na raiz (o padrão preserva arquivos existentes)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Clonar Primeiro (Offline / Proxy Corporativo)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Matriz Universal de Compatibilidade de Agentes IA e LLMs

| Agente IA / IDE / Modelo | Fonte do Adaptador | Caminho no Seu Repositório | Skill Autodescoberta |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Colar em System Prompt / Project Instructions | `llms.txt` |

---

## 4. As 8 Armadilhas de Runtime Comprovadas Impostas por `RULES.md`

1. **`@StateMachine.transitions` usa sintaxe com dois-pontos** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), nunca `"FROM -> TO"`, e dispara transições via query param `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (nunca corpo JSON).
2. **Operadores de consulta usam sintaxe com ponto** (`retailPrice.gte=1000&productName.like=MacBook`), nunca `__gte`.
3. **Injete helpers `@AutoComponent` do framework via `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) e chame `.getObject()` em tempo de execução.
4. **Classes `@Service` interceptadas por AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) devem ser **non-final** e **`@Lazy`**, e qualquer `@Component` que as injete também deve usar **`ObjectProvider<MyService>`** ou **`@Lazy`**. Nunca use `@Transactional` em Helpers `public final class`.
5. **JWT de dev e testes**: o endpoint de token é **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NÃO `GET /system/studio/demo-token`); testes chamam `jwtTokenService.generateToken(username, userId, roles)` (**`username` PRIMEIRO**).
6. **Entidades JPA estendem `BaseAuditEntity`** (UUIDv7 `id`, soft-delete, colunas de auditoria e `@Version` nativos); nunca use `@Data` em `@Entity` nem invente `@SoftDelete`.
7. **Rotas automáticas CamelCase e escopo de `readDto`**: `ECommerceOrder` resolve para `/api/v1/e-commerce-orders`; controladores com `readDto = X.class` projetam todas as respostas em `X`.
8. **Bloqueio de produção**: mantenha `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` e `JWT_SECRET >= 32` bytes UTF-8 em `application.yml` / `application-prod.yml` (habilite Studio apenas em `application-dev.yml`).

---

## 5. Protocolo de Qualidade SDD (Orientado a Especificação) e TDD (Orientado a Testes)

Cada adaptador impõe entrega Spec-First + Test-First usando `references/06-sdd-and-tdd-playbook.md` e os modelos `templates/{spec,plan,tasks}.template.md`, eliminando suposições silenciosas, deriva de contratos e código sem testes.

- **SDD — Desenvolvimento Orientado a Especificação (`specs/<feature>/`):** Fluxo em 6 portões (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): escreva `spec.md` com critérios `REQ-ID` (`Given/When/Then`), pare em `[NEEDS CLARIFICATION]`, monte a matriz de rastreabilidade 1:1 em `plan.md` e valide zero deriva contra `/v3/api-docs`, `/metadata` e `/schema/zod`.
- **TDD — Vermelho → Verde → Refatorar (Pirâmide de 4 Níveis):** Escreva primeiro um teste falhando em JUnit 5 / `MockMvc` com `@DisplayName("REQ-XXX: ...")` (e regressão em todo bug), implemente o mínimo declarativo até VERDE e refatore. Cobre 4 níveis: Unitário, Segurança/Workflow, Deriva de Contrato e Concorrência `@DistributedLock` + JMeter `0.0%`, sem `@Disabled`.
- **Playbook e Modelos:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
