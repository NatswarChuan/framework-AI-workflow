import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { STAGE5_CONTENT } from '../data/pages/stage5Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const IDEMPOTENCY_FLOW = `sequenceDiagram
  participant Client
  participant Guard as ProxyIdempotencyGuardHelper
  participant Cache as Caffeine Cache (TTL 86400s)
  Client->>Guard: POST /api/v1/payment-transactions (X-Idempotency-Key: k-101)
  alt Missing or Blank Key
    Guard-->>Client: Bypass idempotency guard and proceed directly
  else Fresh Key (Not in Cache)
    Guard->>Cache: Record in-flight key with ttlSeconds
    Guard-->>Client: 201 Created (PaymentTransaction persisted)
  else Duplicate or Concurrent Key within TTL
    Guard-->>Client: 409 Conflict (ConflictBusinessException)
  end`;

export const IdempotencyPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="idempotency"
        currentLang={currentLang}
      />

      <h2 id="idempotency-goal" className="section-heading">
        {pickText(STAGE5_CONTENT.idH2Goal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE5_CONTENT.idGoalBody} currentLang={currentLang} />
      </p>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE5_CONTENT.idMermaidCaption, currentLang)}
        chart={IDEMPOTENCY_FLOW}
      />

      <h2 id="idempotency-config" className="section-heading">
        {pickText(STAGE5_CONTENT.idH2Config, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE5_CONTENT.idThComp, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.idThDef, currentLang)}</th>
              <th>{pickText(STAGE5_CONTENT.idThDet, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>headerName</code> (<code>@Idempotent</code>)</td>
              <td><code>"X-Idempotency-Key"</code></td>
              <td><RichDocText text={STAGE5_CONTENT.idRowHdr} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>ttlSeconds</code> (<code>@Idempotent</code>)</td>
              <td><code>300L</code></td>
              <td><RichDocText text={STAGE5_CONTENT.idRowTtl} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>ProxyIdempotencyGuardHelper</code></td>
              <td><code>Dynamic Proxy</code></td>
              <td><RichDocText text={STAGE5_CONTENT.idRowStat} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>app.framework.aop.idempotency-enabled</code></td>
              <td><code>true</code></td>
              <td><RichDocText text={STAGE5_CONTENT.idRowSwitch} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="idempotency-impl" className="section-heading">
        {pickText(STAGE5_CONTENT.idH2Impl, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'idempotent-controller',
            label: 'PaymentTransactionController.java (@Idempotent)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/PaymentTransactionController.java',
            highlightLines: [11, 12, 13, 14],
            code: `package com.example.implementation.controller;

import com.example.implementation.entity.PaymentTransaction;
import io.github.natswarchuan.common.constant.AopConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.Idempotent;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController
@Idempotent(
    headerName = HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY,
    ttlSeconds = AopConstant.SECONDS_PER_DAY)
public interface PaymentTransactionController extends AutoApiController<PaymentTransaction> {
  // Auto-mounted at /api/v1/payment-transactions; duplicate X-Idempotency-Key returns 409 Conflict!
}`,
          },
          {
            id: 'idempotent-entity',
            label: 'PaymentTransaction.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/PaymentTransaction.java',
            highlightLines: [17, 18],
            code: `package com.example.implementation.entity;

import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoCode;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_payment_transactions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class PaymentTransaction extends BaseAuditEntity {

  @UniqueField @AutoCode(prefix = "TXN-")
  private String transactionReference;

  @NotBlank private String orderCode;
  @NotBlank private String paymentMethod;
  @NotNull @DecimalMin("0.01") private BigDecimal amount;
  private String currency;
  @NotBlank private String status;
  private String gatewayProvider;
}`,
          },
          {
            id: 'idempotent-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '09b-verify-payment-idempotency.sh',
            code: `KEY="0194e1a0-7f20-7000-8000-000000000101"

# 1st attempt -> HTTP 201 Created (generates TXN-XXXXXXXX automatically via @AutoCode)
curl -i -X POST "http://localhost:8080/api/v1/payment-transactions" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "X-Idempotency-Key: $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"orderCode":"ORD-B2C2B2C-DOC01","paymentMethod":"CREDIT_CARD","amount":2414.00,"currency":"USD","status":"CAPTURED","gatewayProvider":"STRIPE"}'

# 2nd attempt with the SAME X-Idempotency-Key -> HTTP 409 Conflict (zero double-charge!)
curl -i -X POST "http://localhost:8080/api/v1/payment-transactions" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "X-Idempotency-Key: $KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"orderCode":"ORD-B2C2B2C-DOC01","paymentMethod":"CREDIT_CARD","amount":2414.00,"currency":"USD","status":"CAPTURED","gatewayProvider":"STRIPE"}'`,
          },
        ]}
      />

      <h2 id="idempotency-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="warning" currentLang={currentLang}>
        <RichDocText text={STAGE5_CONTENT.idCalloutWarn} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
