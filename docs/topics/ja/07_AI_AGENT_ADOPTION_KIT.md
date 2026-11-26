# 07. 汎用 AI エージェント導入キット（`SKILL`・`RULES`・`INTRO`・`CHECKLIST`・`llms.txt`、`0.1.0`）

> **言語**: [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | **日本語** | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [全 20 言語一覧](../README.md) | [完全リファレンスマニュアル](../../GUIDE_JA.md) | [20言語インタラクティブポータル](../../index.html#ai-agent-kit)

---

## 1. 目的とキット構成（`ai-agent-kit/`）

**Spring-NWVMC AI-Agent Adoption Kit**（`../../../ai-agent-kit/`）は、**市場のあらゆる AI コーディングエージェントおよび LLM** に対してコードから機械検証した正確な仕様（`6` パッケージ `60` アノテーション、`133` 属性、`40` 自動エンドポイント、`app.framework.*` 設定キー、実証済み `0.1.0` ランタイム指針）を提供し、ハルシネーションや実行時エラーなく初回から正確に統合できるようにします。

| ファイル / ディレクトリ | 役割 |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | アーキテクチャ概要：Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `v0.1.0`、2 ディレクトリ契約（`entity/` + `controller/`）、9 合成インターフェース、6 アノテーションパッケージ、6 組み込みサブシステム |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | ハルシネーション防止ガードレール（`19.0 KB`、`24 KB` 上限内）と実証済みランタイム落とし穴 |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | 段階的開示型 `spring-nwvmc-adoption` スキル（7 導入ワークフロー + 15 項目トラブルシューティング表） |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | 7 段階引き渡し前チェックリスト（事前確認 -> 設計 -> ランタイム注意点 -> 本番ロックダウン -> 性能 -> `mvn clean verify`） |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 機械検証済み 6 (+ `templates/`) 詳細リファレンス（60 アノテーション / 133 属性、40 API + 13 ドット演算子、YAML + マルチ DB、`@MultiTenant` + 4 エンティティ DB-RBAC + `JwtTokenService` 実装レシピ、非アノテーション import / SPI 契約一覧） |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | AI クローラー・エージェント向け `llmstxt.org` 準拠インデックス |

---

## 2. クローン不要の 1 コマンド導入（Zero-Clone 1-Liner）

Spring Boot **プロジェクトルート直下で** ターミナルを開き、以下をコピーして実行してください（ローカルファイルや事前 clone は不要で、`https://github.com/NatswarChuan/Spring-NWVMC-document` から自動取得します）：

### Windows (PowerShell)

```powershell
# 全 AI エージェント・モデル向けに現在のディレクトリ（"."）へ一括導入
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 単一エージェント向け（all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic）：
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# 既存のルートアダプターを上書きする場合は -Force を付与（既定では既存ファイルを安全に保持）
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### 事前クローン（オフライン / 社内プロキシ環境）

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. AI エージェント / LLM 互換マトリクス

| AI エージェント / IDE / モデル | アダプターソース | プロジェクト内配置先 | 自動検出スキル |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions へ貼り付け | `llms.txt` |

---

## 4. `RULES.md` が強制する 8 大実証済みランタイム注意点

1. **`@StateMachine.transitions` はコロン構文**（`"CREATED:PENDING_PAYMENT,CANCELLED"`）を使用（`"FROM -> TO"` 不可）。遷移は JSON ボディではなくクエリ `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` で実行。
2. **クエリ演算子はドット構文**（`retailPrice.gte=1000&productName.like=MacBook`）、`__gte` は不可。
3. **フレームワーク `@AutoComponent` Helper は `ObjectProvider<T>` で注入**し（`DynamicEntityAiMetadataProviderHelper`、`AiNaturalLanguageQueryParserHelper`、`ThirdPartyRestClientHelper`、`WebhookDispatcherHelper`）、実行時に `.getObject()` を呼ぶ。
4. **AOP 対象 `@Service` クラス**（`@DistributedLock`、`@AutoCacheable`、`@AutoCacheEvict`、`@TargetDataSource`）は **non-final** かつ **`@Lazy`** とし、呼び出し側 `@Component` も **`ObjectProvider<MyService>`** または **`@Lazy`** で注入。`public final class` Helper に `@Transactional` を付与しない。
5. **開発用 JWT とテスト**：トークン発行は **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`**（`GET /system/studio/demo-token` は不可）。テストでは `jwtTokenService.generateToken(username, userId, roles)`（**`username` が第 1 引数**）。
6. **JPA エンティティは `BaseAuditEntity` を継承**（UUIDv7 `id`、論理削除、監査列、`@Version` を内蔵）。`@Entity` に `@Data` 禁止、`@SoftDelete` は存在しない。
7. **CamelCase 自動パスと `readDto` スコープ**：`ECommerceOrder` は `/api/v1/e-commerce-orders` に対応。`readDto = X.class` 指定時は全応答が `X` へ射影される。
8. **本番ロックダウン**：`application.yml` / `application-prod.yml` では `app.framework.studio.enabled: false`、`demo-token-endpoint-enabled: false`、`fail-fast-weak-jwt-secret: true`、`JWT_SECRET >= 32` バイトを維持（Studio は `application-dev.yml` のみ有効化）。

---

## 5. SDD（仕様駆動開発）＆ TDD（テスト駆動開発）品質プロトコル

全アダプターとスキルは `references/06-sdd-and-tdd-playbook.md` および `templates/{spec,plan,tasks}.template.md` により仕様先行・テスト先行開発を強制し、AI の勝手な推測や契約ドリフト、未テストコードを防ぎます。

- **SDD — 仕様駆動開発（`specs/<feature>/`）:** 6段階ゲート（`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`）：`REQ-ID`（`Given/When/Then`）付き `spec.md` を起票し `[NEEDS CLARIFICATION]` で必ず確認、1:1 トレーサビリティ表を `plan.md` に定義し、稼働中の `/v3/api-docs`・`/metadata`・`/schema/zod` と完全一致させます。
- **TDD — Red → Green → Refactor（4 層テストピラミッド）:** まず `@DisplayName("REQ-XXX: ...")` 付きで失敗する JUnit 5 / `MockMvc` テスト（バグ修正時は回帰テスト）を書き、最小限の宣言的コードで GREEN にした上でリファクタリングします。単体・セキュリティ統合・契約ドリフト・`@DistributedLock` 並行/JMeter `0.0%` の 4 層を網羅し、`@Disabled` は禁止です。
- **プレイブック＆テンプレート:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
