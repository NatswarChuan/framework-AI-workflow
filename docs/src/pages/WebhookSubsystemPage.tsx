import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const WebhookSubsystemPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="webhook-subsystem"
        currentLang={currentLang}
        badges={[
          { label: '@EntityWebhook', tone: 'purple' },
          { label: 'HMAC-SHA256 Signing', tone: 'rose' },
          { label: 'WebhookDispatcherHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="webhook-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Entities annotated with <code>@EntityWebhook</code> trigger asynchronous HTTP callbacks signed with HMAC-SHA256 via <code>WebhookHmacSignerHelper</code> and delivered by <code>EntityEventWebhookDispatcherListener</code> + <code>WebhookDispatcherHelper</code> (<code>5000 ms</code> timeout, up to <code>3</code> delivery retries, circular delivery history in <code>WebhookAuditDequeUtil</code>).
      </p>

      <h2 id="webhook-headers" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Header Constant</th>
              <th>HTTP Header</th>
              <th>Format / Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>HEADER_WEBHOOK_SIGNATURE</code></td>
              <td><code>X-Webhook-Signature</code></td>
              <td><code>sha256=&lt;hex-hmac&gt;</code> computed via <code>HmacSHA256</code></td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_TIMESTAMP</code></td>
              <td><code>X-Webhook-Timestamp</code></td>
              <td>Unix/UTC timestamp binding signature against replay attacks</td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_EVENT</code></td>
              <td><code>X-Webhook-Event</code></td>
              <td>Event action: <code>CREATED</code>, <code>UPDATED</code>, <code>DELETED</code>, or <code>STATE_CHANGED</code></td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_DELIVERY_ID</code></td>
              <td><code>X-Webhook-Delivery-Id</code></td>
              <td>Unique UUIDv7 delivery tracking identifier</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="webhook-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="entity/InvoiceRecord.java"
        highlightLines={[2, 3, 4, 5]}
        code={`@Entity
@EntityWebhook(
    events = {"CREATED", "STATE_CHANGED"},
    secretHeader = "X-Webhook-Signature",
    includeFullPayload = true
)
public class InvoiceRecord {
  @Id
  private UUID id;
  private String invoiceNumber;
  private String paymentState;
}`}
      />

      <Callout type="security" currentLang={currentLang}>
        Verify receiver webhooks with constant-time comparison against <code>X-Webhook-Signature</code> (<code>sha256=...</code>) and reject stale timestamps outside your tolerance window.
      </Callout>
    </article>
  );
};
