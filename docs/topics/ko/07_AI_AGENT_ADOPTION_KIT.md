# 07. 범용 AI-Agent 도입 키트 (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **언어**: **한국어** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [전체 20개 언어](../README.md) | [전체 매뉴얼 (EN)](../../GUIDE_EN.md) | [20개 언어 인터랙티브 포털](../../index.html#ai-agent-kit)

---

## 1. 목적 및 키트 아키텍처 (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit**([`ai-agent-kit/`](../../../ai-agent-kit/))는 **시중의 모든 AI 코딩 에이전트 및 LLM**에 소스에서 기계 검증된 프레임워크 명세(`6`개 정확한 Java 패키지의 `60`개 애노테이션, `133`개 속성, `40`개 자동 엔드포인트, `app.framework.*` YAML 키 및 검증된 `0.1.0` 런타임 규칙)를 제공하여 환각이나 런타임 오류 없이 첫 시도에 정확히 통합할 수 있도록 합니다.

| 파일 / 디렉터리 | 역할 |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | 아키텍처 안내: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `v0.1.0`, 2-디렉터리 계약(`entity/` + `controller/`), 9개 조합 인터페이스, 6개 애노테이션 패키지, 6개 내장 서브시스템 |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | 엄격한 환각 방지 가드레일 및 검증된 런타임 함정 총정리 |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | 점진적 공개형 `spring-nwvmc-adoption` 스킬(7단계 도입 워크플로 + 15항목 원인별 트러블슈팅 매트릭스) |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 7단계 배포 전 최종 점검 게이트(사전 점검 -> 설계 -> 런타임 주의점 -> 프로덕션 잠금 -> 성능 -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 기계 검증된 6 (+ `templates/`)개 심층 레퍼런스(60 애노테이션 / 133 속성, 40 API + 13 점 문법 연산자, YAML + 멀티 DB, `@MultiTenant` + 4-엔티티 DB-RBAC + `JwtTokenService` 쿡북, 비애노테이션 클래스/상수/SPI import 표) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | AI 크롤러 및 에이전트를 위한 `llmstxt.org` 표준 인덱스 |

---

## 2. 클론 없는 1-명령어 즉시 설치 (Zero-Clone 1-Liner)

Spring Boot **프로젝트 루트 디렉터리에서** 터미널을 열고 아래 명령어를 그대로 실행하세요. 로컬 클론이나 사전 파일 없이 `https://github.com/NatswarChuan/Spring-NWVMC-document`에서 검증된 키트 파일을 자동 다운로드합니다:

### Windows (PowerShell)

```powershell
# 모든 AI 코딩 에이전트 및 모델용으로 현재 디렉터리(".")에 일괄 설치
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 또는 특정 에이전트만 선택 설치 (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 기존 루트 어댑터 파일을 덮어쓰려면 -Force 추가 (기본값은 기존 파일을 안전하게 보존)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### 사전 클론 설치 (오프라인 / 사내 프록시 환경)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. 범용 AI-Agent 및 LLM 호환성 매트릭스

| AI 에이전트 / IDE / 모델 | 어댑터 소스 | 프로젝트 내 대상 경로 | 자동 인식 스킬 |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions에 붙여넣기 | `llms.txt` |

---

## 4. `RULES.md`가 강제하는 검증된 8대 런타임 주의사항

1. **`@StateMachine.transitions`는 콜론 문법**(`"CREATED:PENDING_PAYMENT,CANCELLED"`)만 사용하며 `"FROM -> TO"`는 금지됩니다. 전이는 JSON 본문이 아닌 쿼리 파라미터 `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT`로 호출합니다.
2. **쿼리 연산자는 점 문법**(`retailPrice.gte=1000&productName.like=MacBook`)을 사용하며 `__gte`는 지원하지 않습니다.
3. **프레임워크 `@AutoComponent` Helper는 `ObjectProvider<T>`로 주입**(`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`)하고 실행 시 `.getObject()`를 호출합니다.
4. **AOP 적용 `@Service` 클래스**(`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`)는 **non-final** 및 **`@Lazy`**로 선언하고, 이를 주입하는 `@Component` 역시 **`ObjectProvider<MyService>`** 또는 **`@Lazy`**를 사용해야 합니다. `public final class` Helper에는 `@Transactional`을 붙이지 마세요.
5. **개발용 JWT 및 테스트**: 토큰 발급 엔드포인트는 **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`**(`GET /system/studio/demo-token` 아님)이며, 테스트는 `jwtTokenService.generateToken(username, userId, roles)`(**`username`이 첫 번째 인자**)를 호출합니다.
6. **JPA 엔티티는 `BaseAuditEntity` 상속**(UUIDv7 `id`, 소프트 삭제, 감사 컬럼, `@Version` 내장). `@Entity`에 `@Data` 금지, `@SoftDelete`는 존재하지 않습니다.
7. **CamelCase 자동 경로 및 `readDto` 범위**: `ECommerceOrder`는 `/api/v1/e-commerce-orders`로 매핑되며, `readDto = X.class` 선언 시 모든 응답이 `X`로 프로젝션됩니다.
8. **프로덕션 보안 잠금**: `application.yml` / `application-prod.yml`에서 `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, `JWT_SECRET >= 32` UTF-8 바이트를 유지하세요(Studio는 `application-dev.yml`에서만 활성화).

---

## 5. SDD(명세 주도 개발) 및 TDD(테스트 주도 개발) 품질 프로토콜

모든 어댑터와 스킬은 `references/06-sdd-and-tdd-playbook.md` 및 `templates/{spec,plan,tasks}.template.md`로 명세 우선·테스트 우선 개발을 강제해 AI의 임의 추측과 계약 드리프트를 방지합니다.

- **SDD — 명세 주도 개발 (`specs/<feature>/`):** 6단계 게이트(`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): `REQ-ID`(`Given/When/Then`)로 `spec.md`를 작성하고 `[NEEDS CLARIFICATION]`에서 중단해 확인한 뒤 `plan.md` 추적성 매트릭스를 구성하고 `/v3/api-docs`·`/metadata`·`/schema/zod`와 일치시킵니다.
- **TDD — Red → Green → Refactor (4계층 테스트 피라미드):** 먼저 `@DisplayName("REQ-XXX: ...")`가 붙은 실패 JUnit 5 / `MockMvc` 테스트(버그 수정 시 회귀 테스트 우선)를 작성하고 최소 선언적 코드로 GREEN 달성 후 리팩터링합니다. 단위·보안/워크플로·계약 드리프트·`@DistributedLock` 동시성/JMeter `0.0%` 4계층을 검증하며 `@Disabled`는 금지됩니다.
- **플레이북 및 템플릿:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
