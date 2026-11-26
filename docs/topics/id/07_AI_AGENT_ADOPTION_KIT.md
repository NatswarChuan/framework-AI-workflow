# 07. Kit Adopsi AI-Agent Universal (`SKILL` · `RULES` · `INTRO` · `CHECKLIST` & `llms.txt`, `0.1.0`)

> **Bahasa**: **Bahasa Indonesia** | [English](../en/07_AI_AGENT_ADOPTION_KIT.md) | [Tiếng Việt](../vi/07_AI_AGENT_ADOPTION_KIT.md) | [日本語](../ja/07_AI_AGENT_ADOPTION_KIT.md) | [中文](../zh/07_AI_AGENT_ADOPTION_KIT.md) | [Semua 20 Bahasa](../README.md) | [Panduan Lengkap (EN)](../../GUIDE_EN.md) | [Portal Interaktif 20 Bahasa](../../index.html#ai-agent-kit)

---

## 1. Tujuan & Arsitektur Kit (`ai-agent-kit/`)

**Spring-NWVMC AI-Agent Adoption Kit** ([`ai-agent-kit/`](../../../ai-agent-kit/)) membekali **setiap agen pemrograman AI dan LLM di pasaran** dengan fakta terverifikasi mesin 1:1 langsung dari kode sumber (`60` anotasi dalam `6` paket Java persis, `133` atribut, `40` endpoint otomatis, kunci `app.framework.*` dan pagar runtime `0.1.0` yang terbukti), agar tim mengintegrasikan Spring-NWVMC dengan akurat sejak percobaan pertama tanpa halusinasi.

| Berkas / Direktori | Peran |
| :--- | :--- |
| [`ai-agent-kit/INTRO.md`](../../../ai-agent-kit/INTRO.md) | Orientasi arsitektur: Maven Central `io.github.natswarchuan:spring-nwvmc:0.1.0` & JitPack `v0.1.0`, kontrak 2 direktori (`entity/` + `controller/`), 9 antarmuka komposabel, 6 paket anotasi, 6 subsistem bawaan |
| [`ai-agent-kit/RULES.md`](../../../ai-agent-kit/RULES.md) | Pagar ketat anti-halusinasi yang merangkum setiap jebakan runtime terverifikasi |
| [`ai-agent-kit/SKILL.md`](../../../ai-agent-kit/SKILL.md) | Skill progresif `spring-nwvmc-adoption` berisi 7 alur kerja langkah demi langkah + matriks pemecahan masalah 15 akar penyebab |
| [`ai-agent-kit/CHECKLIST.md`](../../../ai-agent-kit/CHECKLIST.md) | Gerbang pemeriksaan 7 tahap sebelum serah terima (Pre-Flight -> Desain -> Jebakan Runtime -> Penguncian Produksi -> Performa -> `mvn clean verify`) |
| [`ai-agent-kit/references/01..06`](../../../ai-agent-kit/references/) | 6 (+ `templates/`) referensi mendalam terverifikasi mesin (60 anotasi / 133 atribut, 40 endpoint + 13 operator bertitik, YAML + Multi-Datasource, resep terverifikasi termasuk `@MultiTenant` + DB-RBAC 4 entitas + `JwtTokenService`, dan tabel impor kelas non-anotasi / SPI) |
| [`llms.txt`](../../../llms.txt) & [`docs/llms.txt`](../../llms.txt) | Titik masuk sesuai `llmstxt.org` untuk crawler dan agen AI otomatis |

---

## 2. Instalasi 1 Perintah Tanpa Clone (Zero-Clone 1-Liner)

Buka terminal **langsung di direktori root proyek Spring Boot Anda** lalu jalankan salah satu perintah di bawah — tanpa perlu clone lokal atau file bawaan (skrip mengunduh kit terverifikasi langsung dari `https://github.com/NatswarChuan/Spring-NWVMC-document`):

### Windows (PowerShell)

```powershell
# Pasang untuk SEMUA agen coding AI & model ke direktori saat ini (".")
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent all } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Atau targetkan satu agen tertentu (all | antigravity | claude | codex | cursor | copilot | windsurf | cline | generic):
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; $s=Join-Path $env:TEMP "nwvmc-$([guid]::NewGuid()).ps1"; try { irm "https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.ps1" -OutFile $s; powershell -ExecutionPolicy Bypass -File $s -Target "." -Agent claude } finally { Remove-Item $s -Force -ErrorAction SilentlyContinue }

# Tambahkan -Force untuk menimpa file adaptor root yang sudah ada (default mempertahankan file lama secara aman)
```

### macOS / Linux / Git Bash

```bash
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent all
curl -fsSL https://raw.githubusercontent.com/NatswarChuan/Spring-NWVMC-document/main/ai-agent-kit/install.sh | bash -s -- --target . --agent cursor
```

### Clone Terlebih Dahulu (Offline / Proxy Perusahaan)

```bash
git clone --depth 1 https://github.com/NatswarChuan/Spring-NWVMC-document.git /tmp/nwvmc-docs
/tmp/nwvmc-docs/ai-agent-kit/install.sh --target /path/to/your-spring-boot-project --agent all
rm -rf /tmp/nwvmc-docs
```

---

## 3. Matriks Kompatibilitas Universal AI-Agent & LLM

| Agen AI / IDE / Model | Sumber Adaptor | Jalur Target di Repo Anda | Skill Terdeteksi Otomatis |
| :--- | :--- | :--- | :--- |
| **Google Antigravity / Gemini CLI** | `adapters/GEMINI.md` + `AGENTS.md` | `GEMINI.md` + `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Anthropic Claude Code (Opus/Sonnet/Haiku)** | `adapters/CLAUDE.md` | `CLAUDE.md` | `.claude/skills/spring-nwvmc-adoption/` |
| **OpenAI Codex / OpenCode / Zed / Amp / Jules** | `adapters/AGENTS.md` | `AGENTS.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cursor IDE** | `adapters/cursor/spring-nwvmc.mdc` | `.cursor/rules/spring-nwvmc.mdc` | `.agents/skills/spring-nwvmc-adoption/` |
| **GitHub Copilot (VS Code / JetBrains)** | `adapters/copilot-instructions.md` | `.github/copilot-instructions.md` | `.agents/skills/spring-nwvmc-adoption/` |
| **Windsurf / Codeium Cascade** | `adapters/windsurfrules` | `.windsurfrules` | `.agents/skills/spring-nwvmc-adoption/` |
| **Cline & Roo Code** | `adapters/clinerules` | `.clinerules` | `.agents/skills/spring-nwvmc-adoption/` |
| **ChatGPT, Claude Web, Gemini Web, DeepSeek, Qwen, Grok, Mistral, Llama/Ollama, Aider** | `adapters/GENERIC_LLM_PROMPT.md` | Tempel ke System Prompt / Project Instructions | `llms.txt` |

---

## 4. 8 Jebakan Runtime Terverifikasi yang Ditegakkan `RULES.md`

1. **`@StateMachine.transitions` memakai sintaks titik dua** (`"CREATED:PENDING_PAYMENT,CANCELLED"`), bukan `"FROM -> TO"`, dan memicu transisi melalui parameter kueri `POST /api/v1/{entity}/{id}/transition?targetState=PENDING_PAYMENT` (bukan body JSON).
2. **Operator filter memakai sintaks titik** (`retailPrice.gte=1000&productName.like=MacBook`), bukan `__gte`.
3. **Suntikkan helper `@AutoComponent` framework lewat `ObjectProvider<T>`** (`DynamicEntityAiMetadataProviderHelper`, `AiNaturalLanguageQueryParserHelper`, `ThirdPartyRestClientHelper`, `WebhookDispatcherHelper`) dan panggil `.getObject()` saat runtime.
4. **Kelas `@Service` yang dicegat AOP** (`@DistributedLock`, `@AutoCacheable`, `@AutoCacheEvict`, `@TargetDataSource`) wajib **non-final** dan **`@Lazy`**, serta setiap `@Component` yang menyuntikkannya juga wajib memakai **`ObjectProvider<MyService>`** atau **`@Lazy`**. Jangan pernah memasang `@Transactional` pada Helper `public final class`.
5. **Dev JWT & pengujian**: endpoint token adalah **`POST /api/v1/auth/token?username=admin&role=ROLE_ADMIN`** (BUKAN `GET /system/studio/demo-token`); tes memanggil `jwtTokenService.generateToken(username, userId, roles)` (**`username` PERTAMA**).
6. **Entitas JPA memperluas `BaseAuditEntity`** (UUIDv7 `id`, soft-delete, kolom audit, `@Version` bawaan); jangan pernah memakai `@Data` pada `@Entity` dan jangan mengarang `@SoftDelete`.
7. **Rute otomatis CamelCase & cakupan `readDto`**: `ECommerceOrder` menjadi `/api/v1/e-commerce-orders`; controller dengan `readDto = X.class` memproyeksikan seluruh respons melalui `X`.
8. **Penguncian produksi**: pertahankan `app.framework.studio.enabled: false`, `demo-token-endpoint-enabled: false`, `fail-fast-weak-jwt-secret: true`, dan `JWT_SECRET >= 32` byte UTF-8 pada `application.yml` / `application-prod.yml` (aktifkan Studio hanya di `application-dev.yml`).

---

## 5. Protokol Kualitas SDD (Spec-Driven) & TDD (Test-Driven)

Setiap adaptor dan alur kerja menegakkan pengiriman Spec-First + Test-First memakai `references/06-sdd-and-tdd-playbook.md` serta templat `templates/{spec,plan,tasks}.template.md`, mencegah asumsi diam-diam dan penyimpangan kontrak.

- **SDD — Pengembangan Berbasis Spesifikasi (`specs/<feature>/`):** Alur 6 gerbang (`Specify → Clarify → Plan → Tasks → Implement → Contract-Sync`): susun `spec.md` dengan kriteria `REQ-ID` (`Given/When/Then`), berhenti pada `[NEEDS CLARIFICATION]`, buat matriks ketertelusuran 1:1 di `plan.md`, dan verifikasi nol penyimpangan terhadap `/v3/api-docs`, `/metadata`, serta `/schema/zod`.
- **TDD — Red → Green → Refactor (Piramida Uji 4 Tingkat):** Tulis uji JUnit 5 / `MockMvc` gagal bertag `@DisplayName("REQ-XXX: ...")` terlebih dahulu (serta uji regresi untuk tiap bug), tulis kode deklaratif minimal hingga GREEN, lalu REFACTOR. Mencakup 4 tingkat: Unit, Integrasi Keamanan/Alur, Penyimpangan Kontrak, dan Konkurensi `@DistributedLock` + JMeter `0.0%`, tanpa `@Disabled`.
- **Playbook & Templat:** [`06-sdd-and-tdd-playbook.md`](../../../ai-agent-kit/references/06-sdd-and-tdd-playbook.md) · [`spec.template.md`](../../../ai-agent-kit/templates/spec.template.md) · [`plan.template.md`](../../../ai-agent-kit/templates/plan.template.md) · [`tasks.template.md`](../../../ai-agent-kit/templates/tasks.template.md)
