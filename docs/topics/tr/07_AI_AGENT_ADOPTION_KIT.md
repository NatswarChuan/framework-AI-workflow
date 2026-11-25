# 07. Evrensel AI-Agent Benimseme Kiti (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` ve `llms.txt`, `0.1.0`)

> **Diller**: **Türkçe** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Tüm 20 Dil](../README.md) | [Tam Kılavuz](../../GUIDE_EN.md) | [20 Dilli Etkileşimli Portal](../../index.html#ai-agent-kit)

---

## 1. Amaç ve Kit Mimarisi (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** (`../../../ai-agent-kit/`), **piyasadaki her yapay zeka kodlama ajanına ve LLM’e** kaynak koddan 1:1 makine doğrulamalı bilgileri (`6` kesin Java paketindeki `60` anotasyon, `133` öznitelik, `40` otomatik uç nokta, kesin `app.framework.*` anahtarları ve doğrulanmış `0.1.0` çalışma zamanı kuralları) sunarak halüsinasyon ve çalışma zamanı sürprizi olmadan ilk denemede kusursuz entegrasyon sağlar.

| Dosya / Dizin | Görev |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Mimari kılavuz: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` ve JitPack `v0.1.0`, 2 dizin sözleşmesi (`entity/` + `controller/`), 9 birleştirilebilir arayüz, 6 anotasyon paketi ve 11 yerleşik alt sistem |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Sıkı halüsinasyon önleyici koruma kuralları (`13.6 KB`, `24 KB` bütçesinin altında) ve doğrulanmış çalışma zamanı tuzakları |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Aşamalı `spring-nwvmc-adoption` becerisi: 6 adım adım iş akışı ve 10 satırlık kök neden sorun giderme matrisi |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Teslim öncesi 6 aşamalı onay kapısı (Ön Kontrol -> Tasarım -> Çalışma Zamanı Tuzakları -> Üretim Kilitleme -> Performans -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..05`](../../../ai-agent-kit/references/) | Makine doğrulamalı 5 derin referans (60 anotasyon / 133 öznitelik, 40 uç nokta + 13 noktalı operatör, YAML + Çoklu Veri Kaynağı, `@MultiTenant` + 4 varlıklı DB-RBAC + `JwtTokenService` tarifleri, ve kesin anotasyon dışı sınıf/SPI import tablosu) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Otomatik yapay zeka tarayıcıları ve ajanları için `llmstxt.org` uyumlu dizinler |

---

## 2. Klonlama Gerektirmeyen Tek Komutlu Kurulum (Zero-Clone 1-Liner)

Doğrudan **Spring Boot projenizin kök dizininde** bir terminal açıp aşağıdaki komutlardan birini çalıştırın — yerel klon veya önceden dosya gerekmez (betik doğrulanmış kiti `https://github.com/NatswarChuan/Spring-NWVMC-document` adresinden otomatik indirir):

### Windows (PowerShell)

```powershell
# TÜM yapay zeka kodlama ajanları ve modelleri için geçerli dizine (".") kur
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all; Remove-Item $s -Force

# Veya tek bir ajan seç (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
$s="$env:TEMP\install-nwvmc-kit.ps1"; irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude; Remove-Item $s -Force

# Mevcut kök adaptör dosyalarının üzerine yazmak için -Force ekleyin (varsayılan mevcut dosyaları güvenle korur)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Önce Klonla (Çevrimdışı / Kurumsal Proxy)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Evrensel AI-Agent ve LLM Uyumluluk Matrisi

| AI Ajanı / IDE / Model | Adaptör Kaynağı | Projenizdeki Hedef Yol | Otomatik Keşfedilen Beceri |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | System Prompt / Project Instructions alanına yapıştırın | `llms.txt` |

---

## 4. `RULES.md` Tarafından Zorunlu Kılınan 8 Doğrulanmış Çalışma Zamanı Kuralı

1. **`@StateMachine.transitions` iki nokta sözdizimi kullanır** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), asla `"FROM -> TO"` değil; geçişler JSON gövdesiyle değil `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` sorgu parametresiyle tetiklenir.
2. **Sorgu operatörleri nokta sözdizimi kullanır** (`retailPrice.gte=1000&productName.like=MacBook`), asla `__gte` değil.
3. **Çerçeve `@AutoComponent` yardımcılarını `ObjectProvider<T>` ile enjekte edin** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) ve çalışma zamanında `.getObject()` çağırın.
4. **AOP tarafından kesilen `@Service` sınıfları** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) **non-final** ve **`@Lazy`** olmalıdır; bunları enjekte eden her `@Component` de **`ObjectProvider<MyService>`** veya **`@Lazy`** kullanmalıdır. `public final class` Helper’lara asla `@Transactional` koymayın.
5. **Geliştirme JWT ve testler**: token uç noktası **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** adresidir (`GET /system/studio/demo-token` DEĞİL); testler `jwtTokenService.generateToken(username, userId, roles)` çağırır (**önce `username`**).
6. **JPA varlıkları `BaseAuditEntity` sınıfını genişletir** (UUIDv7 `id`, geçici silme, denetim sütunları ve `@Version` yerleşiktir); `@Entity` üzerinde asla `@Data` kullanmayın ve `@SoftDelete` uydurmayın.
7. **CamelCase otomatik yolları ve `readDto` kapsamı**: `ECommerceOrder` -> `/api/v1/e-commerce-orders`; `readDto = X.class` tanımlı denetleyiciler tüm yanıtları `X` olarak projekte eder.
8. **Üretim kilitlemesi**: `application.yml` / `application-prod.yml` içinde `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true` ve `JWT_SECRET >= 32` UTF-8 bayt koruyun (Studio’yu yalnızca `application-dev.yml` içinde açın).
