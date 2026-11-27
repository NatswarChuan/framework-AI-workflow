import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { STAGE4_CONTENT } from '../data/pages/stage4Content';
import { STAGE5_CONTENT } from '../data/pages/stage5Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const TimeTravelPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="time-travel"
        currentLang={currentLang}
        badges={[
          { label: '@AuditTrail', tone: 'purple' },
          { label: 'TimeTravelDynamicApiController', tone: 'blue' },
          { label: 'EntityTimeTravelReconstructionHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="timetravel-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE5_CONTENT.ttGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="timetravel-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE4_CONTENT.gqlThEndpoint, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.ttThClass, currentLang)}</th>
              <th>{pickText(STAGE4_CONTENT.fsThBehavior, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/{'{id}'}/diff</code></td>
              <td><code>AutoApiEnterpriseController</code></td>
              <td><RichDocText text={STAGE5_CONTENT.ttRowDiff} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/time-travel/{'{entityName}'}/{'{id}'}?timestamp=ISO-8601</code></td>
              <td><code>TimeTravelDynamicApiController</code></td>
              <td><RichDocText text={STAGE5_CONTENT.ttRowReplay} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>POST /api/v1/{'{entity}'}/{'{id}'}/restore</code></td>
              <td><code>AutoApiController</code></td>
              <td><RichDocText text={STAGE5_CONTENT.ttRowRestore} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="timetravel-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'audit-entity',
            label: 'ECommerceOrder.java (@AuditTrail + @StateMachine)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/ECommerceOrder.java',
            highlightLines: [14, 21, 22, 23, 24, 25, 26, 27, 28, 29],
            code: `package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AuditTrail;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.StateMachine;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_ecommerce_orders")
@AuditTrail(category = "ECOMMERCE_ORDER_AUDIT")
@Getter @Setter @SuperBuilder @NoArgsConstructor @AllArgsConstructor
public class ECommerceOrder extends BaseAuditEntity {

  @UniqueField @AutoCode(prefix = "ORD-B2C2B2C-")
  private String orderCode;

  // Colon syntax "FROM:TO1,TO2" strictly enforces allowed workflow transitions
  @StateMachine(
      initial = "CREATED",
      transitions = {
          "CREATED:PENDING_PAYMENT,CANCELLED",
          "PENDING_PAYMENT:CONFIRMED,CANCELLED",
          "CONFIRMED:ALLOCATED,REFUNDED",
          "ALLOCATED:SHIPPED",
          "SHIPPED:DELIVERED",
          "DELIVERED:COMPLETED"
      },
      deletableStates = {"CREATED", "CANCELLED"})
  private String orderStatus;

  private String customerEmail;
  private String customerName;
  private String shippingAddress;
  private BigDecimal grossAmount;
  private BigDecimal discountAmount;
  private BigDecimal shippingFee;
  private String currency;
}`,
          },
          {
            id: 'replay-curl',
            label: pickText(STAGE5_CONTENT.ttTabQuery, currentLang),
            language: 'bash',
            fileName: '09c-order-statemachine-and-timetravel.sh',
            code: `# 1. Create a Marketplace order (starts in CREATED; orderCode auto-generated)
ORDER_ID=$(curl -s -X POST "http://localhost:8080/api/v1/e-commerce-orders" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"orderStatus":"CREATED","customerEmail":"buyer@marketplace.io","customerName":"Nguyen Minh","shippingAddress":"100 Nguyen Hue, HCMC","grossAmount":2499.00,"discountAmount":100.00,"shippingFee":15.00,"currency":"USD"}' \\
  | jq -r '.data.id')

# 2. Illegal jump CREATED -> DELIVERED is blocked (HTTP 4xx)
curl -i -X POST "http://localhost:8080/api/v1/e-commerce-orders/$ORDER_ID/transition?targetState=DELIVERED" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. Valid transition CREATED -> PENDING_PAYMENT succeeds (HTTP 200 OK)
curl -s -X POST "http://localhost:8080/api/v1/e-commerce-orders/$ORDER_ID/transition?targetState=PENDING_PAYMENT" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 4. Reconstruct historical snapshot via Time-Travel API
curl -s "http://localhost:8080/api/v1/system/time-travel/ECommerceOrder/$ORDER_ID" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq`,
          },
        ]}
      />

      <h2 id="time-travel-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE5_CONTENT.ttCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
