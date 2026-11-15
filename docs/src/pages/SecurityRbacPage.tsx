import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  lead: {
    vi: 'Kiến trúc phòng thủ chiều sâu: JWT HS512 không trạng thái, phân quyền NIST Level 2 (RoleConstant), che mờ dữ liệu nhạy cảm động (@FieldSecurity / PiiDataMaskingUtil), bảo vệ Fail-Fast khóa JWT và ma trận chống quét lỗ hổng AI Scanner.',
    en: 'Defense-in-depth runtime security: stateless HMAC-SHA512 JWT auth, NIST Level 2 RBAC (RoleConstant), serialization-time PII masking (@FieldSecurity / PiiDataMaskingUtil), Fail-Fast JWT secret hardening, and anti-AI-scanner guards.',
    ja: '多層防御セキュリティアーキテクチャ：ステートレス HMAC-SHA512 JWT 認証、NIST レベル2 RBAC、@FieldSecurity 動的マスキング、JWT 鍵強制ローテーション、AI スキャナ対抗機構。',
    zh: '纵深防御安全架构：无状态 HMAC-SHA512 JWT 认证、NIST Level 2 RBAC、@FieldSecurity 动态脱敏、JWT 密钥强制轮转与 AI 自动化扫描对抗矩阵。',
  },
  h1: {
    vi: '1. Phân Cấp Vai Trò Chuẩn NIST RBAC (RoleConstant)',
    en: '1. NIST Level 2 RBAC Role Hierarchy (RoleConstant)',
    ja: '1. NIST レベル2 RBAC ロール階層 (RoleConstant)',
    zh: '1. NIST Level 2 RBAC 角色体系 (RoleConstant)',
  },
  h2: {
    vi: '2. Cấp Phát JWT Token Môi Trường Dev (AuthController)',
    en: '2. Development JWT Token Endpoint (AuthController)',
    ja: '2. 開発用 JWT トークン発行エンドポイント (AuthController)',
    zh: '2. 开发调试 JWT 签发端点 (AuthController)',
  },
  p2: {
    vi: 'Khi bật app.framework.studio.demo-token-endpoint-enabled: true (mặc định tắt trả về HTTP 404), AuthController cấp phát JWT ký bằng HMAC-SHA512:',
    en: 'When app.framework.studio.demo-token-endpoint-enabled=true (production default: false returning HTTP 404), AuthController issues HMAC-SHA512 bearer tokens:',
    ja: 'app.framework.studio.demo-token-endpoint-enabled=true（本番既定 false・HTTP 404応答）時のみ、AuthController が HMAC-SHA512 JWT を発行します：',
    zh: '仅当 app.framework.studio.demo-token-endpoint-enabled=true 时（生产默认 false 并返回 HTTP 404），AuthController 才签发 HMAC-SHA512 令牌：',
  },
  h3: {
    vi: '3. Che Mờ Dữ Liệu Nhạy Cảm Khi Serialize (@FieldSecurity)',
    en: '3. Serialization-Time Attribute Masking (@FieldSecurity)',
    ja: '3. シリアライズ時フィールドマスキング (@FieldSecurity)',
    zh: '3. 序列化阶段动态字段脱敏 (@FieldSecurity)',
  },
  p3: {
    vi: 'Các trường gắn @FieldSecurity(viewRoles = {...}, maskPattern = "******") tự động che mờ khi caller không thuộc viewRoles mà không làm thay đổi thực thể trong bộ nhớ dịch vụ:',
    en: 'Fields annotated with @FieldSecurity(viewRoles = {...}, maskPattern = "******") mask outgoing JSON for callers lacking viewRoles while preserving typed entity values inside services:',
    ja: '@FieldSecurity(viewRoles = {...}) により、権限を持たない呼出元への JSON シリアライズ時にのみ値をマスク化します：',
    zh: '@FieldSecurity(viewRoles = {...}, maskPattern = "******") 仅在向无权限调用方序列化 JSON 时遮蔽敏感字段，内部业务层仍持有完整强类型值：',
  },
  calloutTitle: {
    vi: 'An Toàn Bộ Nhớ Trong Tiến Trình',
    en: 'Zero Service-Layer Mutation',
    ja: 'サービス層でのデータ不変性',
    zh: '零内存实体篡改',
  },
  calloutBody: {
    vi: 'Quá trình che mờ chỉ diễn ra tại tầng tuần tự hóa phản hồi JSON; dữ liệu trong Transaction và DB luôn giữ nguyên giá trị gốc.',
    en: 'Masking applies solely at response serialization; database rows and domain objects inside transactional services remain unmodified.',
    ja: 'マスキングはレスポンス出力時にのみ適用され、トランザクション内のデータ自体は改変されません。',
    zh: '脱敏仅在 JSON 响应序列化层生效，事务内服务层及数据库原值始终保持完整。',
  },
  h4: {
    vi: '4. PiiDataMaskingUtil & Ma Trận Chống AI Scanner / Fuzzing',
    en: '4. PiiDataMaskingUtil & Anti-AI-Scanner Defense Matrix',
    ja: '4. PiiDataMaskingUtil ＆ AIスキャナ・ファジング防御機構',
    zh: '4. PiiDataMaskingUtil 与防 AI 自动化扫描安全矩阵',
  },
};

export const SecurityRbacPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">Spring Security 6</span>
        <span className="badge badge-blue">NIST Level 2 RBAC</span>
        <span className="badge badge-purple">@FieldSecurity</span>
        <span className="badge badge-rose">Anti-Scanner Hardened</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'NIST Level 2 RBAC, Stateless JWT & Anti-Scanner Defense'}
        {currentLang === 'vi' && 'Bảo Mật NIST Level 2 RBAC, JWT & Chống Quét Lỗ Hổng'}
        {currentLang === 'ja' && 'NIST レベル2 RBAC・JWT認証・AIスキャナ防御'}
        {currentLang === 'zh' && 'NIST Level 2 RBAC、JWT 与防自动化扫描加固'}
      </h1>

      <p className="page-lead">{TXT.lead[currentLang]}</p>

      <h2 id="rbac-roles" className="section-heading">{TXT.h1[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>RoleConstant</th>
            <th>Authority Scope</th>
            <th>Representative Operations</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ROLE_SUPER_ADMIN</code></td>
            <td>Global unrestricted authority &amp; system telemetry</td>
            <td>Cross-tenant ops, full entity CRUD, security overrides</td>
          </tr>
          <tr>
            <td><code>ROLE_ADMIN</code></td>
            <td>Domain administration &amp; write/delete governance</td>
            <td>Entity mutations, customizer &amp; health telemetry</td>
          </tr>
          <tr>
            <td><code>ROLE_MANAGER</code> / <code>ROLE_OPERATOR</code></td>
            <td>Workflow execution &amp; state machine transitions</td>
            <td>Order fulfillment, status updates via <code>/transition</code></td>
          </tr>
          <tr>
            <td><code>ROLE_USER</code> / <code>ROLE_AUDITOR</code></td>
            <td>Standard read / own-record / compliance inspection</td>
            <td>Filtered queries, masked PII responses, CSV/JSONL reads</td>
          </tr>
        </tbody>
      </table>

      <h2 id="jwt-stateless" className="section-heading">{TXT.h2[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p2[currentLang]}</p>

      <CodeBlock
        language="bash"
        fileName="cURL Token Issuance (Local/Dev Studio Only)"
        code={`curl -X POST "http://localhost:8080/api/v1/auth/token?username=admin-auditor&role=ROLE_ADMIN"`}
      />

      <h2 id="field-masking" className="section-heading">{TXT.h3[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p3[currentLang]}</p>

      <CodeBlock
        language="json"
        fileName="Masked Response for ROLE_USER"
        code={`{
  "code": 200,
  "data": {
    "id": "0194e1a0-0000-7000-8000-000000000001",
    "fullName": "Sarah Connor",
    "nationalId": "******",
    "costPrice": null
  }
}`}
      />

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {TXT.calloutBody[currentLang]}
      </Callout>

      <h2 id="pii-masking-util" className="section-heading">{TXT.h4[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>Component / Bridge</th>
            <th>Threat Mitigated</th>
            <th>Verified Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>SecurityExposurePolicyBridge</code></td>
            <td>Unauthenticated Studio / Demo Auth probing</td>
            <td>Returns opaque HTTP 404 when <code>studio.enabled=false</code> / <code>demo-token-endpoint-enabled=false</code></td>
          </tr>
          <tr>
            <td><code>StartupDiagnosticsUtil.validateAndHardenSecurity</code></td>
            <td>Default/weak JWT signing secret</td>
            <td>Rotates default key to ephemeral 64B CSPRNG when demo auth is off, or throws on <code>fail-fast-weak-jwt-secret=true</code></td>
          </tr>
          <tr>
            <td><code>SecurityHeadersPolicyBridge</code></td>
            <td>Clickjacking, XSS, MIME sniffing, referrer leak</td>
            <td>Injects <code>X-Frame-Options: DENY</code>, CSP, Permissions-Policy, Referrer-Policy, HSTS</td>
          </tr>
          <tr>
            <td><code>ConstantTimeComparisonUtil</code></td>
            <td>HMAC timing side-channel</td>
            <td>Constant-time byte check via <code>MessageDigest.isEqual</code></td>
          </tr>
          <tr>
            <td><code>QueryFilterParameterUtil</code> &amp; <code>RateLimitingFilter</code></td>
            <td>SQLi / fuzzing / credential stuffing</td>
            <td>Caps dynamic filters (30) &amp; sort depth (4); 10,000-entry IP bucket (20 req/s on <code>/api/v1/auth/**</code>)</td>
          </tr>
          <tr>
            <td><code>LocaleResolutionUtil</code> &amp; <code>StoragePathSanitizerHelper</code></td>
            <td>CWE-22 path / bundle key traversal</td>
            <td><code>LocaleResolutionUtil.isSafeMessageKey</code> (<code>^[A-Za-z0-9._-]+$</code>, max 128 chars); null-byte &amp; <code>..</code> rejection</td>
          </tr>
        </tbody>
      </table>

      <CodeBlock
        language="java"
        fileName="common/util/PiiDataMaskingUtil.java"
        code={`PiiDataMaskingUtil.maskEmail("john.doe@company.com");   // "j******e@company.com"
PiiDataMaskingUtil.maskPhoneNumber("+84901234567");     // "+849****567"
PiiDataMaskingUtil.maskCreditCard("4111222233334444");  // "411122******4444"
PiiDataMaskingUtil.maskNationalId("079090123456");      // "079******456"`}
      />
    </div>
  );
};
