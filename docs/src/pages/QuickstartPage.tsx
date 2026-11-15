import React, { useState } from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { Sparkles, Terminal, ShieldCheck, CheckCircle2, BookOpen, Building2 } from 'lucide-react';

interface PageProps {
  currentLang: SupportedLanguage;
}

const LABELS = {
  lead: {
    vi: 'Triển khai một JPA Entity + một Controller Interface rỗng để tổng hợp 38 hợp đồng API RESTful (@Auto*) qua JDK Dynamic Proxy và lõi 100% Pure Java (Java 21+, 0 import org.springframework.*).',
    en: 'Declare one JPA Entity plus one empty Controller Interface to synthesize 38 RESTful API contracts (@Auto*) via JDK Dynamic Proxy over a 100% Pure Java core (Java 21+, zero import org.springframework.*).',
    ja: '1つのJPAエンティティと1つの空コントローラーインターフェースから、100% Pure Javaコア（Java 21+）とJDK動的プロキシで38種類のREST API契約を自動生成します。',
    zh: '声明 1 个 JPA 实体与 1 个空控制器接口，通过 JDK 动态代理与 100% 纯 Java 核心（Java 21+，零 Spring 源码导入）自动生成 38 个 RESTful API 契约。',
  },
  tabMinimal: {
    vi: '1. Cấu Hình Tối Giản (3 Bước)',
    en: '1. Minimal Setup (3 Steps)',
    ja: '1. 最小構成（3ステップ）',
    zh: '1. 极简配置（3 步）',
  },
  tabEnterprise: {
    vi: '2. Đặc Tả Doanh Nghiệp (Enterprise & Fail-Fast)',
    en: '2. Enterprise & Fail-Fast Specification',
    ja: '2. エンタープライズ仕様＆Fail-Fast診断',
    zh: '2. 企业级安全与 Fail-Fast 诊断规范',
  },
  minimalCalloutTitle: {
    vi: 'Quy Tắc 2 Thư Mục & Trợ Thủ Khởi Động',
    en: 'Strict 2-Directory Model & Startup Diagnostics',
    ja: '2ディレクトリ構造と起動診断',
    zh: '严格双目录规范与启动诊断',
  },
  minimalCalloutBody: {
    vi: 'Không cần viết Service, ServiceImpl, Repository hay DTO cho luồng CRUD chuẩn. Khai báo 1 Entity trong entity/ và 1 Interface kế thừa AutoApiController<E> trong controller/ để kích hoạt Swagger UI (/swagger-ui/index.html) và Live Studio (/system/studio khi app.framework.studio.enabled=true).',
    en: 'Standard CRUD flows require zero manual Service, ServiceImpl, Repository, or DTO classes. Place an entity in entity/ and an interface extending AutoApiController<E> in controller/ to expose Swagger UI (/swagger-ui/index.html) and Dev Studio (/system/studio when app.framework.studio.enabled=true).',
    ja: '標準CRUDではService/Repository/DTOの手書きは不要です。entity/とcontroller/に2ファイルを配置するだけでSwagger UIとDev Studio（app.framework.studio.enabled=true時）が有効になります。',
    zh: '标准 CRUD 无需手动编写 Service、Repository 或 DTO。仅需在 entity/ 与 controller/ 中各声明一个文件，即可自动暴露 Swagger UI 与 Dev Studio（需开启 app.framework.studio.enabled=true）。',
  },
  minStep1: {
    vi: 'Bước 1: Tạo Thực Thể JPA (entity/CatalogItem.java)',
    en: 'Step 1: Declare a JPA Entity (entity/CatalogItem.java)',
    ja: 'ステップ1：JPAエンティティの宣言（entity/CatalogItem.java）',
    zh: '第 1 步：声明 JPA 实体类（entity/CatalogItem.java）',
  },
  minStep2: {
    vi: 'Bước 2: Tạo Controller Interface Rỗng (controller/CatalogItemController.java)',
    en: 'Step 2: Declare an Empty Controller Interface (controller/CatalogItemController.java)',
    ja: 'ステップ2：空コントローラーインターフェースの宣言（controller/CatalogItemController.java）',
    zh: '第 2 步：声明空控制器接口（controller/CatalogItemController.java）',
  },
  diagTitle: {
    vi: 'Kiểm Định Fail-Fast Khi Khởi Động (StartupDiagnosticsUtil & DeveloperFriendlyDiagnosticsHelper)',
    en: 'Fail-Fast Startup Validation (StartupDiagnosticsUtil & DeveloperFriendlyDiagnosticsHelper)',
    ja: '起動時Fail-Fast診断（StartupDiagnosticsUtil＆DeveloperFriendlyDiagnosticsHelper）',
    zh: '启动阶段 Fail-Fast 强校验（StartupDiagnosticsUtil & DeveloperFriendlyDiagnosticsHelper）',
  },
  diagBody: {
    vi: 'StartupDiagnosticsUtil kiểm tra điều kiện tiên quyết trước khi bind routes và in mã khắc phục rõ ràng nếu thiếu @Id, thiếu constructor mặc định hoặc vi phạm cấu hình bảo mật JWT trong chế độ production.',
    en: 'StartupDiagnosticsUtil validates critical invariants before route registration and prints explicit remediation guidance when @Id, no-arg constructors, or strong production JWT secrets are missing.',
    ja: 'StartupDiagnosticsUtilはルート登録前に@Id、デフォルトコンストラクタ、本番用JWT秘密鍵の強度を検証し、不備がある場合は具体的な修復手順を出力して起動を停止します。',
    zh: 'StartupDiagnosticsUtil 在注册路由前校验实体 @Id、无参构造器及生产环境 JWT 密钥强度，缺失时打印明确修复指令并 Fail-Fast 中止启动。',
  },
  entCalloutTitle: {
    vi: 'Kiến Trúc Doanh Nghiệp Đa Quốc Gia',
    en: 'Enterprise-Grade Architecture Stack',
    ja: 'エンタープライズアーキテクチャ仕様',
    zh: '跨国企业级技术规范栈',
  },
  entCalloutBody: {
    vi: 'Lõi 100% Pure Java trên Java 21+ Virtual Threads, Keyset Pagination O(1), NIST Level 2 RBAC (@EntitySecurity), Che mờ PII động (@FieldSecurity), Lưu trữ tệp Local/S3/GCS (/api/v1/storage), 7 nhóm SPI lõi + StorageCustomizer (8 SPI Interfaces), và 2,000 request Apache JMeter 0.0% lỗi.',
    en: '100% Pure Java core on Java 21+ Virtual Threads, O(1) Keyset Pagination, NIST Level 2 RBAC (@EntitySecurity), Dynamic PII Masking (@FieldSecurity), Local/S3/GCS Storage (/api/v1/storage), 7 Core Ecosystem SPIs + StorageCustomizer (8 SPI Interfaces), and 0.0% error rate across 2,000 Apache JMeter requests.',
    ja: 'Java 21+仮想スレッド上の100% Pure Javaコア、O(1) Keysetページング、NISTレベル2 RBAC、動的PIIマスキング、Local/S3/GCSストレージ、8種のSPIカスタマイザインターフェース、JMeter 2,000リクエストでエラー率0.0%を達成。',
    zh: '基于 Java 21+ 虚拟线程的 100% 纯 Java 核心、O(1) Keyset 游标分页、NIST Level 2 RBAC、动态 PII 脱敏、Local/S3/GCS 多云存储、8 个 SPI 自定义扩展接口，以及 Apache JMeter 2,000 并发 0.0% 错误率实测验证。',
  },
  entStep1: {
    vi: 'Bước 1: Thực Thể Doanh Nghiệp Với Chú Thích Khai Báo (@EntitySecurity, @StateMachine, @AutoCode)',
    en: 'Step 1: Enterprise Entity with Declarative Safeguards (@EntitySecurity, @StateMachine, @AutoCode)',
    ja: 'ステップ1：宣言的ガードを備えたエンタープライズエンティティ',
    zh: '第 1 步：声明企业级富领域实体（@EntitySecurity、@StateMachine、@AutoCode）',
  },
  entStep2: {
    vi: 'Bước 2: Controller Interface Với Công Tắc Endpoint & HTTP ETag (@HttpCacheable)',
    en: 'Step 2: Controller Interface with Endpoint Toggles & HTTP ETag (@HttpCacheable)',
    ja: 'ステップ2：エンドポイント切替＆HTTP ETag付きコントローラー',
    zh: '第 2 步：带端点开关与 HTTP ETag 缓存的控制器接口',
  },
  step3Heading: {
    vi: 'Bước 3: 38 Hợp Đồng REST (@Auto*) Tự Động Sinh & 6 APIs Lưu Trữ',
    en: 'Step 3: 38 Auto-Generated @Auto* REST Contracts & 6 Storage Endpoints',
    ja: 'ステップ3：起動時に自動生成される38のREST契約＆6つのストレージAPI',
    zh: '第 3 步：启动自动生成的 38 个 @Auto* REST 契约与 6 个存储端点',
  },
  diagHeading: {
    vi: 'Bảng Mã Chẩn Đoán Khởi Động Fail-Fast (StartupDiagnosticsUtil)',
    en: 'Fail-Fast Startup Diagnostics Reference (StartupDiagnosticsUtil)',
    ja: 'Fail-Fast 起動診断リファレンス（StartupDiagnosticsUtil）',
    zh: 'Fail-Fast 启动诊断参考表（StartupDiagnosticsUtil）',
  },
  colCheck: { vi: 'Kiểm Định', en: 'Check', ja: '検証項目', zh: '校验项目' },
  colError: { vi: 'Lỗi / Trạng Thái', en: 'Exception / Outcome', ja: '例外 / 結果', zh: '异常 / 结果' },
  colAction: { vi: 'Cơ Chế Kích Hoạt', en: 'Trigger Condition', ja: '発生条件', zh: '触发条件' },
  rowJvm: {
    vi: 'Kiểm tra JDK >= 21 trước khi nạp framework',
    en: 'Runtime.version().feature() < 21 via JavaVersionGuardUtil',
    ja: 'JavaVersionGuardUtil による JVM 21 未満検出',
    zh: 'JavaVersionGuardUtil 检测到 JVM 主版本低于 21',
  },
  rowJwt: {
    vi: 'demo-token-endpoint-enabled=false và JWT key là placeholder mặc định',
    en: 'Factory default JWT secret with demo-token-endpoint-enabled=false -> Ephemeral 64B CSPRNG rotation (or IllegalStateException if fail-fast-weak-jwt-secret=true)',
    ja: 'デフォルトJWT秘密鍵（demo無効時）-> 64Bエフェメラル鍵へ強制ローテーション、または fail-fast 設定時に起動中止',
    zh: '禁用 demo 端点却沿用默认 JWT 密钥 -> 强制轮转为 64 字节临时安全随机密钥（若开启 fail-fast-weak-jwt-secret 则直接拦截启动）',
  },
  rowEntityId: {
    vi: 'Entity khai báo trong @AutoRestController thiếu trường @Id hoặc getter ID',
    en: 'Target JPA Entity lacks @Id field/getter via DeveloperFriendlyDiagnosticsHelper',
    ja: '対象JPAエンティティに@Idフィールドが存在しない場合',
    zh: '目标 JPA 实体缺少 @Id 主键字段定义',
  },
  rowCors: {
    vi: 'allowCredentials=true kết hợp wildcard origin (*)',
    en: 'Unsafe CORS policy: allowCredentials=true combined with wildcard * origin',
    ja: 'allowCredentials=true とワイルドカード * オリジンの危険な併用',
    zh: 'allowCredentials=true 与通配符 * 源站存在凭证泄露风险',
  },
  card4Desc: {
    vi: 'GET /events (@Hidden SSE), GET /ai/context, POST /ai/query, cùng 6 APIs lưu trữ tệp tại /api/v1/storage/*.',
    en: 'GET /events (@Hidden SSE), GET /ai/context, POST /ai/query, plus 6 multi-cloud file storage endpoints under /api/v1/storage/*.',
    ja: 'GET /events（@Hidden SSE）、GET /ai/context、POST /ai/query、および /api/v1/storage/* の6つのストレージAPI。',
    zh: 'GET /events（@Hidden SSE）、GET /ai/context、POST /ai/query，以及 /api/v1/storage/* 下的 6 个多云存储接口。',
  },
};

export const QuickstartPage: React.FC<PageProps> = ({ currentLang }) => {
  const [activeTier, setActiveTier] = useState<'minimal' | 'enterprise'>('minimal');

  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">v0.0.2 JitPack</span>
        <span className="badge badge-blue">Java 21+ Enforced</span>
        <span className="badge badge-purple">2 Directories Only</span>
        <span className="badge badge-amber">38 @Auto* Contracts</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'Quickstart Integration: Minimal Setup to Enterprise Specification'}
        {currentLang === 'vi' && 'Hướng Dẫn Khởi Chạy Nhanh: Từ Cấu Hình Tối Giản Đến Chuẩn Doanh Nghiệp'}
        {currentLang === 'ja' && 'クイックスタート統合：最小構成からエンタープライズ仕様まで'}
        {currentLang === 'zh' && '快速集成指南：从极简配置到企业级生产规范'}
      </h1>

      <p className="page-lead">{LABELS.lead[currentLang]}</p>

      <CodeBlock
        language="xml"
        fileName="pom.xml (JitPack v0.0.2)"
        code={`<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependencies>
  <dependency>
    <groupId>com.github.NatswarChuan</groupId>
    <artifactId>Spring-NWVMC</artifactId>
    <version>v0.0.2</version>
  </dependency>
</dependencies>`}
      />

      {/* Tier Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTier('minimal')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTier === 'minimal' ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
            background: activeTier === 'minimal' ? 'rgba(52, 211, 153, 0.14)' : 'var(--bg-secondary)',
            color: activeTier === 'minimal' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
          }}
        >
          <BookOpen size={16} />
          <span>{LABELS.tabMinimal[currentLang]}</span>
        </button>

        <button
          onClick={() => setActiveTier('enterprise')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.86rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTier === 'enterprise' ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
            background: activeTier === 'enterprise' ? 'rgba(56, 189, 248, 0.14)' : 'var(--bg-secondary)',
            color: activeTier === 'enterprise' ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}
        >
          <Building2 size={16} />
          <span>{LABELS.tabEnterprise[currentLang]}</span>
        </button>
      </div>

      {activeTier === 'minimal' ? (
        <div>
          <Callout type="info" title={LABELS.minimalCalloutTitle[currentLang]}>
            {LABELS.minimalCalloutBody[currentLang]}
          </Callout>

          <h2 id="step-1" className="section-heading">{LABELS.minStep1[currentLang]}</h2>
          <CodeBlock
            language="java"
            fileName="entity/CatalogItem.java"
            code={`package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tbl_catalog_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CatalogItem {

    @Id
    private String id;
    private String skuCode;
    private String title;
    private Double unitPrice;
}`}
          />

          <h2 id="step-2" className="section-heading">{LABELS.minStep2[currentLang]}</h2>
          <CodeBlock
            language="java"
            fileName="controller/CatalogItemController.java"
            code={`package com.example.demo.controller;

import com.example.demo.entity.CatalogItem;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController(path = "/api/v1/catalog-items")
public interface CatalogItemController extends AutoApiController<CatalogItem> {
}`}
          />

          <Callout type="success" title={LABELS.diagTitle[currentLang]}>
            {LABELS.diagBody[currentLang]}
          </Callout>
        </div>
      ) : (
        <div>
          <Callout type="info" title={LABELS.entCalloutTitle[currentLang]}>
            {LABELS.entCalloutBody[currentLang]}
          </Callout>

          <h2 id="step-1" className="section-heading">{LABELS.entStep1[currentLang]}</h2>
          <CodeBlock
            language="java"
            fileName="entity/CommercialProduct.java"
            code={`@Entity
@Table(name = "tbl_commercial_products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder(toBuilder = true)
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@StateMachine(
    initial = "DRAFT",
    transitions = {"DRAFT:ACTIVE", "ACTIVE:SUSPENDED,DISCONTINUED"},
    deletableStates = {"DRAFT", "DISCONTINUED"}
)
public class CommercialProduct extends BaseAuditEntity {

    @UniqueField
    @AutoCode(prefix = "PRD-")
    @Column(name = "product_code", nullable = false, length = 32)
    private String productCode;

    @NotBlank
    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @NotNull
    @DecimalMin("0.00")
    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN}, maskPattern = "******")
    @Column(name = "cost_price", precision = 12, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "status", nullable = false, length = 32)
    private String status;
}`}
          />

          <h2 id="step-2" className="section-heading">{LABELS.entStep2[currentLang]}</h2>
          <CodeBlock
            language="java"
            fileName="controller/CommercialProductController.java"
            code={`package com.example.implementation.controller;

import com.example.implementation.entity.CommercialProduct;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.HttpCacheable;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController(
    path = "/api/v1/products",
    disabledEndpoints = {"deleteById", "DELETE"}
)
public interface CommercialProductController extends AutoApiController<CommercialProduct> {

    @HttpCacheable(maxAgeSeconds = 3600, generateETag = true)
    default ApiResponse<String> getProductNotice() {
        return ApiResponse.success("Enterprise Product Catalog 2026");
    }
}`}
          />
        </div>
      )}

      <h2 id="step-3" className="section-heading">{LABELS.step3Heading[currentLang]}</h2>

      <div className="doc-grid-2">
        <div className="doc-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <CheckCircle2 size={16} />
            <span>CRUD, Keyset O(1) & 13 Filter Operators</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <code>GET /api/v1/products</code>, <code>GET /keyset</code>, <code>GET /aggregate</code>, <code>GET /group-by</code>, <code>GET /&#123;id&#125;</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH /&#123;id&#125;/patch-rfc6902</code>, <code>GET /&#123;id&#125;/diff</code>.
          </p>
        </div>

        <div className="doc-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} />
            <span>State Machine, Soft Delete & Audit</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <code>POST /&#123;id&#125;/transition</code>, <code>PATCH /&#123;id&#125;/increment</code>, <code>DELETE /&#123;id&#125;</code> (Soft), <code>POST /&#123;id&#125;/restore</code>, <code>POST /&#123;id&#125;/clone</code>.
          </p>
        </div>

        <div className="doc-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Terminal size={16} />
            <span>Big Data Streaming, Batch & Schemas</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            <code>GET /export/csv</code>, <code>POST /import/csv</code>, <code>GET /export/jsonl</code>, <code>POST /import/jsonl</code>, <code>POST /batch-chunked</code>, <code>GET /schema/typescript</code>.
          </p>
        </div>

        <div className="doc-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-purple)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Sparkles size={16} />
            <span>AI, Real-Time SSE & Multi-Cloud Storage</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{LABELS.card4Desc[currentLang]}</p>
        </div>
      </div>

      <h3 style={{ marginTop: '1.75rem', fontSize: '1.05rem', fontWeight: 700 }}>{LABELS.diagHeading[currentLang]}</h3>
      <table className="doc-table">
        <thead>
          <tr>
            <th>{LABELS.colCheck[currentLang]}</th>
            <th>{LABELS.colError[currentLang]}</th>
            <th>{LABELS.colAction[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>JavaVersionGuardUtil</code></td>
            <td><code>UnsupportedOperationException</code></td>
            <td>{LABELS.rowJvm[currentLang]}</td>
          </tr>
          <tr>
            <td><code>StartupDiagnosticsUtil.validateAndHardenSecurity</code></td>
            <td>CSPRNG ephemeral secret / <code>IllegalStateException</code></td>
            <td>{LABELS.rowJwt[currentLang]}</td>
          </tr>
          <tr>
            <td><code>DeveloperFriendlyDiagnosticsHelper.validateEntityDesign</code></td>
            <td><code>EntityValidationDiagnosticDto</code> (<code>ERR_MISSING_ID</code>)</td>
            <td>{LABELS.rowEntityId[currentLang]}</td>
          </tr>
          <tr>
            <td><code>SecurityHeadersPolicyBridge</code></td>
            <td>CORS Misconfiguration Fail-Fast Guard</td>
            <td>{LABELS.rowCors[currentLang]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
