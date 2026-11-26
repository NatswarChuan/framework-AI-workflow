import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { UI_LABELS, pickText } from '../data/locales';
import { RichDocText } from '../components/RichDocText';
import { STAGE7_CONTENT } from '../data/pages/stage7Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const WebhookSubsystemPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="webhook-subsystem"
        currentLang={currentLang}
        guardrailTip={{
          type: 'security',
          content: <RichDocText text={STAGE7_CONTENT.whCalloutSec} currentLang={currentLang} />,
        }}
      />

      <h2 id="webhook-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.whGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="webhook-headers" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE7_CONTENT.whThConst, currentLang)}</th>
              <th>{pickText(STAGE7_CONTENT.whThHdr, currentLang)}</th>
              <th>{pickText(STAGE7_CONTENT.whThRole, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>HEADER_WEBHOOK_SIGNATURE</code></td>
              <td><code>X-Webhook-Signature</code></td>
              <td><RichDocText text={STAGE7_CONTENT.whRowSig} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_TIMESTAMP</code></td>
              <td><code>X-Webhook-Timestamp</code></td>
              <td><RichDocText text={STAGE7_CONTENT.whRowTs} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_EVENT</code></td>
              <td><code>X-Webhook-Event</code></td>
              <td><RichDocText text={STAGE7_CONTENT.whRowEvt} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>HEADER_WEBHOOK_DELIVERY_ID</code></td>
              <td><code>X-Webhook-Delivery-Id</code></td>
              <td><RichDocText text={STAGE7_CONTENT.whRowId} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="webhook-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'webhook-entity',
            label: 'ElectronicInvoice.java (@EntityWebhook + @PublishCloudEvent)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/ElectronicInvoice.java',
            highlightLines: [17, 18, 19, 20, 21, 22, 23],
            code: `package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.UniqueField;
import io.github.natswarchuan.module.event.annotation.PublishCloudEvent;
import io.github.natswarchuan.module.webhook.annotation.EntityWebhook;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_electronic_invoices")
@Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
@EntityWebhook(
    events = {"CREATED", "UPDATED", "STATE_CHANGED"},
    secretHeader = "X-Webhook-Signature",
    includeFullPayload = true)
@PublishCloudEvent(
    eventType = "com.example.marketplace.invoice.v1",
    source = "/api/v1/electronic-invoices")
public class ElectronicInvoice extends BaseAuditEntity {

  @UniqueField @AutoCode(prefix = "INV-ECOM-")
  private String invoiceNumber;

  private String orderCode;
  private String taxCode;
  private String buyerName;
  private BigDecimal preTaxAmount;
  private BigDecimal taxRate;
  private BigDecimal taxAmount;
  private BigDecimal totalInvoicedAmount;
  private String status;
}`,
          },
          {
            id: 'webhook-subscribe-curl',
            label: 'Try Live (curl) + Subscriber Registration',
            language: 'bash',
            fileName: '11-electronic-invoice-webhook.sh',
            code: `# Register subscriber in Java via WebhookDispatcherHelper:
# webhookDispatcherHelper.registerSubscription(WebhookSubscriptionDto.builder()
#     .targetEntity("ElectronicInvoice")
#     .endpointUrl("https://erp.marketplace.internal/hooks/invoices")
#     .secretKey("whsec_docs_verified_hmac_key_2026")
#     .subscribedEvents(List.of("CREATED", "UPDATED"))
#     .active(true).build());

# Trigger creation -> automatically commits OutboxEvent, emits CloudEvent, and dispatches HMAC-SHA256 webhook!
curl -s -X POST "http://localhost:8080/api/v1/electronic-invoices" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"orderCode":"ORD-B2C2B2C-DOC01","taxCode":"0312345678","buyerName":"Minh Tech Corp","preTaxAmount":2200.00,"taxRate":10.00,"taxAmount":220.00,"totalInvoicedAmount":2420.00,"status":"ISSUED"}' | jq`,
          },
        ]}
      />
    </article>
  );
};
