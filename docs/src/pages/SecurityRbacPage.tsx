import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const SECURITY_FLOW = `flowchart LR
  Req[HTTP Request] --> Filter[TraceIdFilter + SecurityFilterChainBridge]
  Filter --> Surface{Studio / Eject / Metrics?}
  Surface -- Production profile --> Denied[404 Not Found or 401 Unauthorized]
  Surface -- Dev profile / ROLE_ADMIN --> StudioOK[Allow Dev Studio + CORS Preflight]
  Filter --> RBAC{"@EntitySecurity Check"}
  RBAC -- Denied --> Unwrap[ExceptionCauseUnwrapperUtil -> ApiResponse 403]
  RBAC -- Granted --> RLS[Row-Level ownerField Predicate]
  RLS --> Mask["@FieldSecurity Masking / Nullification"]`;

export const SecurityRbacPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="security-rbac"
        currentLang={currentLang}
        badges={[
          { label: '@EntitySecurity · @FieldSecurity', tone: 'rose' },
          { label: '@MultiTenant', tone: 'purple' },
          { label: 'Secure-by-Default Production', tone: 'emerald' },
        ]}
      />

      <h2 id="security-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Security operates declaratively at entity metadata level and infrastructure bridge level. Production profiles lock down <code>/system/studio</code>, <code>/system/studio/eject</code>, and <code>/system/studio/demo-token</code> via <code>DevStudioProperties</code> (default <code>enabled=false</code>), enforce strong JWT secret lengths via <code>fail-fast-weak-jwt-secret: true</code>, and strip reflection wrappers safely via <code>ExceptionCauseUnwrapperUtil</code>.
      </p>

      <MermaidDiagram
        theme={theme}
        caption="End-to-End Request Security, RBAC, RLS, and Field Masking Pipeline"
        chart={SECURITY_FLOW}
      />

      <h2 id="security-annotations" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Annotation / Component</th>
              <th>Exact Attributes</th>
              <th>Runtime Enforcement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@EntitySecurity</code></td>
              <td><code>readRoles</code>, <code>writeRoles</code>, <code>deleteRoles</code>, <code>permitAll</code>, <code>ownerField</code>, <code>bypassOwnerRoles</code></td>
              <td>Enforces HTTP method authorization and appends Row-Level Security <code>WHERE ownerField = principal</code> unless caller holds bypass role (<code>ROLE_ADMIN</code>, <code>ROLE_SUPER_ADMIN</code>)</td>
            </tr>
            <tr>
              <td><code>@FieldSecurity</code></td>
              <td><code>viewRoles</code>, <code>maskPattern ("******")</code>, <code>nullifyInsteadOfMask (false)</code></td>
              <td>Masks unauthorized strings or sets non-string fields to <code>null</code> during serialization</td>
            </tr>
            <tr>
              <td><code>@MultiTenant</code></td>
              <td><code>tenantColumn</code></td>
              <td>Enforces tenant discriminator isolation using JWT claims or configured tenant context</td>
            </tr>
            <tr>
              <td><code>SecurityFilterChainBridge</code></td>
              <td>Stateless JWT + CORS</td>
              <td>Permits browser preflight headers (<code>Authorization</code>, <code>X-Idempotency-Key</code>, <code>X-Request-ID</code>, <code>*</code>) while enforcing bearer validation</td>
            </tr>
            <tr>
              <td><code>SurfaceAccessGuardrailUtil</code></td>
              <td>Production Lockdown</td>
              <td>Prevents access to Studio, Ejection, and Telemetry surfaces when <code>studio.enabled=false</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="security-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'entity-rbac',
            label: 'Entity RBAC & Field Masking',
            language: 'java',
            fileName: 'entity/CustomerOrder.java',
            highlightLines: [2, 3, 4, 5, 6, 13, 14, 15, 16],
            code: `@Entity
@EntitySecurity(
    readRoles = {"ROLE_USER", "ROLE_ADMIN"},
    writeRoles = {"ROLE_USER", "ROLE_ADMIN"},
    deleteRoles = {"ROLE_ADMIN"},
    ownerField = "customerId",
    bypassOwnerRoles = {"ROLE_ADMIN", "ROLE_SUPER_ADMIN"}
)
public class CustomerOrder {
  @Id
  private UUID id;

  private String customerId;

  @FieldSecurity(
      viewRoles = {"ROLE_FINANCE", "ROLE_ADMIN"},
      maskPattern = "******",
      nullifyInsteadOfMask = false
  )
  private String internalMarginNotes;
}`,
          },
          {
            id: 'prod-lockdown',
            label: 'Production YAML Defaults',
            language: 'yaml',
            fileName: 'application.yml',
            highlightLines: [5, 6, 7, 10, 11, 12],
            code: `app:
  framework:
    security:
      enabled: true
      data-masking-enabled: true
      row-level-security-enabled: true
      jwt-secret: \${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      hide-framework-fingerprint: true`,
          },
        ]}
      />

      <Callout type="security" currentLang={currentLang}>
        <code>hide-framework-fingerprint: true</code> suppresses internal header disclosure in HTTP error payloads, and <code>ExceptionCauseUnwrapperUtil</code> unwraps <code>InvocationTargetException</code> before delegating to the global <code>@RestControllerAdvice</code> exception mapper.
      </Callout>
    </article>
  );
};
