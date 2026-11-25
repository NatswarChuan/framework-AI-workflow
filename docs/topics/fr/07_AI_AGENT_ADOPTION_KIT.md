# 07. Kit Universel d’Adoption pour Agents IA (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Langues**: **Français** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Les 20 Langues](../README.md) | [Manuel Complet](../../GUIDE_EN.md) | [Portail Interactif (20 Langues)](../../index.html#ai-agent-kit)

---

## 1. Objectif et Architecture du Kit (`ai-agent-kit/`)

Le **Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`) fournit à **tous les agents de code IA et LLM du marché** des spécifications vérifiées automatiquement 1:1 depuis le code source (`60` annotations dans `6` packages Java exacts, `133` attributs, `40` endpoints automatiques, clés `app.framework.*` et garde-fous runtime vérifiés en `0.1.0`) afin d’intégrer Spring-NWVMC avec justesse dès le premier essai, sans hallucinations.

| Fichier / Dossier | Rôle |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Vue d’ensemble architecturale : Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `v0.1.0`, contrat 2 répertoires (`entity/` + `controller/`), 9 interfaces composables, 6 packages d’annotations et 11 sous-systèmes intégrés |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Garde-fous stricts anti-hallucination (`13.6 KB`, sous le plafond `24 KB`) encodant chaque piège d’exécution vérifié |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Skill progressive `spring-nwvmc-adoption` avec 6 workflows étape par étape et matrice de dépannage à 10 causes racines |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Porte de validation en 6 phases avant livraison (Pré-vol -> Conception -> Pièges Runtime -> Verrouillage Production -> Performance -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | 5 références approfondies vérifiées par machine (60 annotations / 133 attributs, 40 endpoints + 13 opérateurs à point, YAML + Multi-Datasource, recettes vérifiées incluant `@MultiTenant` + DB-RBAC 4 entités + `JwtTokenService`, et table complète des imports non-annotation / SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Index conformes `llmstxt.org` pour robots et agents IA automatisés |

---

## 2. Installation en 1 Commande sans Clonage (Zero-Clone 1-Liner)

Ouvrez un terminal **directement à la racine de votre projet Spring Boot** et exécutez l’une des commandes ci-dessous — aucun clone local ni fichier préalable requis (le script télécharge le kit vérifié directement depuis `https://github.com/NatswarChuan/Spring-NWVMC-document`) :

### Windows (PowerShell)

```powershell
# Installer pour TOUS les agents IA et modèles dans le répertoire courant (".")
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Ou cibler un seul agent (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic) :
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Ajoutez -Force pour écraser les adaptateurs racine existants (préservés par défaut)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Cloner d’Abord (Hors Ligne / Proxy d’Entreprise)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Matrice Universelle de Compatibilité Agents IA & LLMs

| Agent IA / IDE / Modèle | Source de l’Adaptateur | Chemin Cible dans votre Dépôt | Skill Auto-Découverte |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Coller dans System Prompt / Project Instructions | `llms.txt` |

---

## 4. Les 8 Pièges Runtime Vérifiés Imposés par `RULES.md`

1. **`@StateMachine.transitions` utilise la syntaxe deux-points** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), jamais `"FROM -> TO"`, et déclenche les transitions via le paramètre de requête `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (pas le corps JSON).
2. **Les opérateurs de requête utilisent la syntaxe à point** (`retailPrice.gte=1000&productName.like=MacBook`), jamais `__gte`.
3. **Injectez les helpers `@AutoComponent` du framework via `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) et appelez `.getObject()` à l’exécution.
4. **Les classes `@Service` interceptées par AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) doivent être **non-final** et **`@Lazy`**, et tout `@Component` qui les injecte doit aussi utiliser **`ObjectProvider<MyService>`** ou **`@Lazy`**. Ne placez jamais `@Transactional` sur des Helpers `public final class`.
5. **JWT de dev et tests** : l’endpoint de jeton est **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (PAS `GET /system/studio/demo-token`) ; les tests appellent `jwtTokenService.generateToken(username, userId, roles)` (**`username` EN PREMIER**).
6. **Les entités JPA étendent `BaseAuditEntity`** (UUIDv7 `id`, suppression logique, audit et `@Version` intégrés) ; n’utilisez jamais `@Data` sur `@Entity` et n’inventez jamais `@SoftDelete`.
7. **Chemins automatiques CamelCase et portée `readDto`** : `ECommerceOrder` devient `/api/v1/e-commerce-orders` ; les contrôleurs déclarant `readDto = X.class` projettent toutes leurs réponses via `X`.
8. **Verrouillage de production** : conservez `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` et `JWT_SECRET >= 32` octets UTF-8 dans `application.yml` / `application-prod.yml` (activez Studio uniquement dans `application-dev.yml`).
