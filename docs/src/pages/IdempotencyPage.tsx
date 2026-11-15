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

const IDEMPOTENCY_FLOW = `sequenceDiagram
  participant Client
  participant Aspect as IdempotencyAspect
  participant Store as IdempotencyManagerHelper
  Client->>Aspect: POST /api/v1/orders (X-Idempotency-Key: k-101)
  Aspect->>Store: Lookup SHA-256 fingerprint for k-101
  alt First Request (MISS)
    Aspect-->>Client: Proceed, set X-Idempotency-Status: MISS
    Aspect->>Store: Persist response for ttlSeconds (default 300s)
  else Duplicate Same Payload (HIT)
    Aspect-->>Client: Return cached response (X-Idempotency-Status: HIT)
  else Same Key Different Body
    Aspect-->>Client: 409 Conflict (error.idempotency.payload_mismatch)
  end`;

export const IdempotencyPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="idempotency"
        currentLang={currentLang}
        badges={[
          { label: '@Idempotent', tone: 'emerald' },
          { label: 'X-Idempotency-Key', tone: 'blue' },
          { label: 'SHA-256 Payload Match', tone: 'amber' },
        ]}
      />

      <h2 id="idempotency-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>IdempotencyAspect</code> and <code>IdempotencyManagerHelper</code> guard mutating endpoints against double submits and retry storms. Every request carrying <code>X-Idempotency-Key</code> is fingerprinted using SHA-256; retries with matching payloads receive cached responses marked <code>X-Idempotency-Status: HIT</code>, while mutated payloads trigger <code>IdempotencyException</code> (<code>409 Conflict</code>).
      </p>

      <MermaidDiagram
        theme={theme}
        caption="Idempotency Check & SHA-256 Fingerprint Verification Flow"
        chart={IDEMPOTENCY_FLOW}
      />

      <h2 id="idempotency-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Component / Attribute</th>
              <th>Default</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>headerName</code> (on <code>@Idempotent</code>)</td>
              <td><code>"X-Idempotency-Key"</code></td>
              <td>HTTP header carrying caller deduplication key</td>
            </tr>
            <tr>
              <td><code>ttlSeconds</code> (on <code>@Idempotent</code>)</td>
              <td><code>300L</code></td>
              <td>Record expiration window before key may be reused</td>
            </tr>
            <tr>
              <td><code>X-Idempotency-Status</code></td>
              <td><code>HIT</code> | <code>MISS</code> | <code>PROCESSING</code></td>
              <td>Response header identifying duplicate replay vs initial write</td>
            </tr>
            <tr>
              <td><code>app.framework.aop.idempotency-enabled</code></td>
              <td><code>true</code></td>
              <td>Global switch bound via <code>AopAuditProperties</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="idempotency-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="controller/PaymentController.java"
        highlightLines={[4]}
        code={`@AutoRestController(path = "/api/v1/payments")
public interface PaymentController extends AutoApiController<PaymentTransaction> {

  @Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300L)
  @AutoPost("/capture")
  ApiResponse<PaymentTransaction> capturePayment(@Valid @AutoBody CaptureRequestDto request);
}`}
      />

      <Callout type="warning" currentLang={currentLang}>
        Error codes emitted on violations are internationalized via <code>i18n/messages*.properties</code>: <code>error.idempotency.key_missing</code>, <code>error.idempotency.payload_mismatch</code>, and <code>error.idempotency.concurrent_processing</code>.
      </Callout>
    </article>
  );
};
