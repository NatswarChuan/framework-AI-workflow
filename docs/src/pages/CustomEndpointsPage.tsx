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

const CUSTOM_ENDPOINT_FLOW = `flowchart LR
  Req[POST /api/v1/orders/checkout-cart] --> MVC[Spring MVC Handler]
  MVC --> Proxy[ControllerProxyInvocationHandler]
  Proxy --> Ann{Has @CustomEndpoint?}
  Ann -- Yes --> Lookup[Lookup bean: advancedOrderCheckoutHelper]
  Lookup --> MH[MethodHandleCacheUtil exact invoke]
  MH --> Helper[OrderCheckoutHelper.checkoutCart]
  Helper --> DB[(Multi-step Tx + Event Outbox)]`;

export const CustomEndpointsPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="custom-endpoints"
        currentLang={currentLang}
        badges={[
          { label: '@CustomEndpoint', tone: 'purple' },
          { label: '@AutoComponent Helpers', tone: 'blue' },
          { label: 'MethodHandle Dispatch', tone: 'emerald' },
        ]}
      />

      <h2 id="custom-endpoint-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>@CustomEndpoint</code> lets a pure Java controller interface expose domain workflows (checkout, payment capture, approval pipelines) alongside all 40 inherited CRUD endpoints, forwarding execution via cached <code>MethodHandle</code> invocation into standalone <code>@AutoComponent</code> Helper beans.
      </p>

      <MermaidDiagram
        theme={theme}
        caption="@CustomEndpoint Delegation Pipeline"
        chart={CUSTOM_ENDPOINT_FLOW}
      />

      <h2 id="custom-endpoint-attrs" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Default / Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>path</code></td>
              <td><code>String</code> (required)</td>
              <td>Relative URL path appended to controller <code>path</code></td>
            </tr>
            <tr>
              <td><code>httpMethod</code></td>
              <td><code>"GET"</code></td>
              <td>HTTP verb (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>)</td>
            </tr>
            <tr>
              <td><code>delegateBean</code></td>
              <td><code>String</code></td>
              <td>Spring container bean name holding the target orchestration method</td>
            </tr>
            <tr>
              <td><code>delegateMethod</code></td>
              <td><code>String</code></td>
              <td>Exact <code>public</code> method name inside <code>delegateBean</code></td>
            </tr>
            <tr>
              <td><code>summary</code> / <code>description</code></td>
              <td><code>String</code></td>
              <td>Exposed directly into OpenAPI 3.0 Swagger specification</td>
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
            label: 'Controller Interface',
            language: 'java',
            fileName: 'controller/OrderController.java',
            highlightLines: [4, 5, 6, 7, 8, 9],
            code: `@AutoRestController(path = "/api/v1/orders")
public interface OrderController extends AutoApiController<CustomerOrder> {

  @CustomEndpoint(
      path = "/checkout-cart",
      httpMethod = "POST",
      delegateBean = "orderCheckoutHelper",
      delegateMethod = "checkoutCart",
      summary = "Execute validated cart checkout"
  )
  @Idempotent(ttlSeconds = 300L)
  ApiResponse<CustomerOrder> checkoutCart(@Valid @AutoBody CartCheckoutDto request);
}`,
          },
          {
            id: 'helper-bean',
            label: 'Delegate Helper Bean',
            language: 'java',
            fileName: 'helper/OrderCheckoutHelper.java',
            highlightLines: [3, 4, 8],
            code: `@Slf4j
@AutoComponent("orderCheckoutHelper")
@RequiredArgsConstructor
public final class OrderCheckoutHelper {

  private final TransactionalOutboxHelper outboxHelper;

  public ApiResponse<CustomerOrder> checkoutCart(final CartCheckoutDto request) {
    final CustomerOrder saved = persistOrder(request);
    outboxHelper.enqueueDomainEvent("OrderCreatedEvent", saved);
    return ApiResponse.success(saved);
  }
}`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        Compose multiple <code>@CustomEndpoint</code> methods cleanly with <code>@Idempotent</code>, <code>@RateLimit</code>, <code>@EntityCircuitBreaker</code>, and Jakarta Bean Validation (<code>@Valid @AutoBody</code>).
      </Callout>
    </article>
  );
};
