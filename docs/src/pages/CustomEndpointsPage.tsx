import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE3_CONTENT } from '../data/pages/stage3Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const CUSTOM_ENDPOINT_FLOW = `flowchart TD
  Req["GET /api/v1/e-commerce-orders/quick-summary"] --> MVC["Spring MVC Handler"]
  MVC --> Proxy["ControllerProxyInvocationHandler"]
  Proxy --> Ann{"Has @CustomEndpoint?"}
  Ann -->|Yes| Lookup["Lookup Bean: orderSummaryHelper"]
  Lookup --> MH["MethodHandleCacheUtil\nExact Direct Invoke"]
  MH --> Helper["OrderSummaryHelper.buildOrderQuickSummary"]
  Helper --> DB[("JPA EntityManager -> ApiResponse")]`;

export const CustomEndpointsPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="custom-endpoints"
        currentLang={currentLang}
        badges={[
          { label: '@CustomEndpoint', tone: 'purple' },
          { label: pickText(STAGE3_CONTENT.ceBadgeHelpers, currentLang), tone: 'blue' },
          { label: pickText(STAGE3_CONTENT.ceBadgeDispatch, currentLang), tone: 'emerald' },
        ]}
      />

      <h2 id="custom-endpoint-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE3_CONTENT.ceGoalBody} currentLang={currentLang} />
      </p>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE3_CONTENT.ceMermaidCaption, currentLang)}
        chart={CUSTOM_ENDPOINT_FLOW}
      />

      <h2 id="custom-endpoint-attrs" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE3_CONTENT.ceThAttr, currentLang)}</th>
              <th>{pickText(STAGE3_CONTENT.ceThType, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colDescription, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>path</code></td>
              <td><code>String</code></td>
              <td><RichDocText text={STAGE3_CONTENT.ceRowPath} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>httpMethod</code></td>
              <td><code>"GET"</code></td>
              <td><RichDocText text={STAGE3_CONTENT.ceRowMethod} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>delegateBean</code></td>
              <td><code>String</code></td>
              <td><RichDocText text={STAGE3_CONTENT.ceRowBean} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>delegateMethod</code></td>
              <td><code>String</code></td>
              <td><RichDocText text={STAGE3_CONTENT.ceRowMethodName} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>summary</code> / <code>description</code></td>
              <td><code>String</code></td>
              <td><RichDocText text={STAGE3_CONTENT.ceRowSummary} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="custom-endpoint-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'controller-interface',
            label: pickText(STAGE3_CONTENT.ceTabCtrl, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ECommerceOrderController.java',
            highlightLines: [12, 13, 14, 15, 16, 17, 18],
            code: `package com.example.implementation.controller;

import com.example.implementation.dto.OrderQuickSummaryDto;
import com.example.implementation.entity.ECommerceOrder;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.CustomEndpoint;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController
public interface ECommerceOrderController extends AutoApiController<ECommerceOrder> {

  @CustomEndpoint(
      path = "/quick-summary",
      httpMethod = "GET",
      delegateBean = "orderSummaryHelper",
      delegateMethod = "buildOrderQuickSummary",
      summary = "Summarize marketplace order counts by lifecycle status")
  ApiResponse<OrderQuickSummaryDto> getOrderQuickSummary();
}`,
          },
          {
            id: 'helper-bean',
            label: pickText(STAGE3_CONTENT.ceTabHelper, currentLang),
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/helper/OrderSummaryHelper.java',
            highlightLines: [10, 11, 13, 17],
            code: `package com.example.implementation.helper;

import com.example.implementation.dto.OrderQuickSummaryDto;
import io.github.natswarchuan.common.response.ApiResponse;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component("orderSummaryHelper")
@RequiredArgsConstructor
public final class OrderSummaryHelper {

  private final EntityManager entityManager;

  public ApiResponse<OrderQuickSummaryDto> buildOrderQuickSummary() {
    final long totalOrders = entityManager
        .createQuery("SELECT COUNT(o) FROM ECommerceOrder o", Long.class)
        .getSingleResult();
    final long pendingPayment = entityManager
        .createQuery("SELECT COUNT(o) FROM ECommerceOrder o WHERE o.orderStatus = :status", Long.class)
        .setParameter("status", "PENDING_PAYMENT")
        .getSingleResult();
    return ApiResponse.success(OrderQuickSummaryDto.fromCounts(totalOrders, pendingPayment));
  }
}`,
          },
          {
            id: 'custom-endpoint-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '04-custom-endpoint-order-summary.sh',
            code: `# Call the @CustomEndpoint directly on the kebab-case auto-generated ECommerceOrder base path
curl -s "http://localhost:8080/api/v1/e-commerce-orders/quick-summary" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# Verified JSON response:
# {
#   "code": "SUCCESS",
#   "data": {
#     "totalOrders": 1,
#     "pendingPaymentOrders": 1,
#     "generatedBy": "OrderSummaryHelper(@CustomEndpoint)",
#     "evaluationId": "01a21000-..."
#   }
# }`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE3_CONTENT.ceCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
