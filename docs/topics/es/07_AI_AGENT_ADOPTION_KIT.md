# 07. Kit Universal de Adopción para Agentes IA (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` y `llms.txt`, `0.1.0`)

> **Idiomas**: **Español** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Los 20 Idiomas](../README.md) | [Manual Completo (EN)](../../GUIDE_EN.md) | [Portal Interactivo (20 Idiomas)](../../index.html#ai-agent-kit)

---

## 1. Propósito y Arquitectura del Kit (`ai-agent-kit/`)

El **Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) dota a **todos los agentes de programación IA y LLM del mercado** de hechos verificados automáticamente 1:1 desde el código fuente (`60` anotaciones en `6` paquetes Java exactos, `133` atributos, `40` endpoints automáticos, claves `app.framework.*` y reglas de ejecución probadas en `0.1.0`) para integrar Spring-NWVMC con precisión al primer intento y sin alucinaciones.

| Archivo / Directorio | Rol |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Orientación arquitectónica: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` y JitPack `v0.1.0`, contrato de 2 directorios (`entity/` + `controller/`), 9 interfaces componibles, 6 paquetes de anotaciones y 6 subsistemas integrados |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Reglas estrictas anti-alucinación que codifican cada trampa de ejecución verificada |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Skill progresiva `spring-nwvmc-adoption` con 7 flujos paso a paso y matriz de diagnóstico de 15 causas raíz |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Puerta de verificación de 7 fases previa a entrega (Pre-Flight -> Diseño -> Trampas Runtime -> Bloqueo Producción -> Rendimiento -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) referencias profundas verificadas por máquina (60 anotaciones / 133 atributos, 40 endpoints + 13 operadores con punto, YAML + Multi-Datasource, recetario con `@MultiTenant` + DB-RBAC de 4 entidades + `JwtTokenService`, e imports exactos no-anotación y SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Índices compatibles con `llmstxt.org` para rastreadores y agentes IA |

---

## 2. Instalación en 1 Comando sin Clonar (Zero-Clone 1-Liner)

Abra una terminal **directamente en la raíz de su proyecto Spring Boot** y pegue uno de los comandos siguientes (no requiere clonación local ni archivos previos; el script descarga todo desde `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Instalar para TODOS los agentes IA y modelos en el directorio actual (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# O seleccionar un agente específico (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Añada -Force para sobrescribir adaptadores existentes (por defecto se preservan de forma segura)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Clonar Primero (Sin Conexión / Proxy Corporativo)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Matriz Universal de Compatibilidad de Agentes IA y LLMs

| Agente IA / IDE / Modelo | Fuente del Adaptador | Ruta Destino en su Repo | Skill Autodescubierta |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Pegar en System Prompt / Project Instructions | `llms.txt` |

---

## 4. Las 8 Trampas de Ejecución Verificadas Impuestas por `RULES.md`

1. **`@StateMachine.transitions` usa sintaxis con dos puntos** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), nunca `"FROM -> TO"`, y se dispara con parámetro de consulta `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (no cuerpo JSON).
2. **Los operadores de consulta usan sintaxis con punto** (`retailPrice.gte=1000&productName.like=MacBook`), nunca `__gte`.
3. **Inyecte helpers `@AutoComponent` del framework mediante `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) y llame a `.getObject()` en tiempo de ejecución.
4. **Las clases `@Service` interceptadas por AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) deben ser **no-final** y **`@Lazy`**, y cualquier `@Component` que las inyecte debe usar también **`ObjectProvider<MyService>`** o **`@Lazy`**. Nunca coloque `@Transactional` en Helpers `public final class`.
5. **JWT de desarrollo y pruebas**: el endpoint de token es **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (NO `GET /system/studio/demo-token`); en pruebas llame a `jwtTokenService.generateToken(username, userId, roles)` (**`username` PRIMERO**).
6. **Las entidades JPA extienden `BaseAuditEntity`** (UUIDv7 `id`, borrado lógico, auditoría y `@Version` integrados); nunca use `@Data` en `@Entity` ni invente `@SoftDelete`.
7. **Rutas automáticas CamelCase y alcance de `readDto`**: `ECommerceOrder` resuelve a `/api/v1/e-commerce-orders`; los controladores con `readDto = X.class` proyectan todas las respuestas a través de `X`.
8. **Bloqueo de producción**: mantenga `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` y `JWT_SECRET >= 32` bytes UTF-8 en `application.yml` / `application-prod.yml` (active Studio solo en `application-dev.yml`).

---

## 5. Protocolo de Calidad SDD (Guiado por Especificación) y TDD (Guiado por Pruebas)

Cada adaptador y flujo impone entrega Spec-First + Test-First mediante `references/06-sdd-and-tdd-playbook.md` y las plantillas `templates/{spec,plan,tasks}.template.md`, evitando suposiciones silenciosas, deriva de contratos y código sin pruebas.

- **SDD — Desarrollo Guiado por Especificación (`specs/<feature>/`):** Flujo de 6 puertas (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): redacta `spec.md` con criterios `REQ-ID` (`Given/When/Then`), detente en `[NEEDS CLARIFICATION]`, crea una matriz de trazabilidad 1:1 en `plan.md` y verifica cero deriva contra `/v3/api-docs`, `/metadata` y `/schema/zod`.
- **TDD — Rojo → Verde → Refactor (Pirámide de 4 Niveles):** Escribe primero una prueba fallida JUnit 5 / `MockMvc` con `@DisplayName("REQ-XXX: ...")` (y prueba de regresión en cada bug), implementa código declarativo mínimo hasta VERDE y refactoriza. Cubre 4 niveles: Unitario, Seguridad/Flujos, Deriva de Contrato y Concurrencia `@DistributedLock` + JMeter `0.0%`, sin `@Disabled`.
- **Playbook y Plantillas:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
