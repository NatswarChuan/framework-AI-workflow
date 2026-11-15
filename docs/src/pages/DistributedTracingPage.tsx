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

const TRACE_FLOW = `flowchart LR
  Client[Inbound Caller] -->|X-Request-ID / traceparent| Filter[TraceIdFilter]
  Filter -->|Missing?| UUID[UuidUtil.generateUuidV7]
  Filter -->|Populate SLF4J MDC| Prop[W3cTraceContextPropagatorHelper]
  Prop -->|HTTP Outbound| Client3P[ThirdPartyRestClientHelper]
  Prop -->|Event Relay| Outbox[OutboxEvent Headers]
  Filter -->|Response Header| Resp[ApiResponse traceId + X-Request-ID]`;

export const DistributedTracingPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="distributed-tracing"
        currentLang={currentLang}
        badges={[
          { label: 'TraceIdFilter (UUIDv7)', tone: 'emerald' },
          { label: 'W3C traceparent', tone: 'blue' },
          { label: 'TraceContextSystemApiController', tone: 'purple' },
        ]}
      />

      <h2 id="tracing-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>TraceIdFilter</code> captures or mints a time-ordered UUIDv7 identifier per request, binds <code>traceId</code>, <code>spanId</code>, and <code>parentSpanId</code> into SLF4J MDC, injects <code>X-Request-ID</code> on every HTTP response, and embeds <code>traceId</code> directly into <code>ApiResponse&lt;T&gt;</code>. <code>W3cTraceContextPropagatorHelper</code> propagates headers across outbound REST calls and asynchronous outbox dispatches.
      </p>

      <MermaidDiagram
        theme={theme}
        caption="Request Correlation & W3C TraceContext Propagation Pipeline"
        chart={TRACE_FLOW}
      />

      <h2 id="tracing-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Component / Header</th>
              <th>Format / Default</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>X-Request-ID</code></td>
              <td>UUIDv7 (RFC 9562)</td>
              <td>Inbound/outbound request correlation identifier echoed in <code>ApiResponse.traceId</code></td>
            </tr>
            <tr>
              <td><code>traceparent</code></td>
              <td><code>00-{'<traceId>'}-{'<spanId>'}-01</code></td>
              <td>W3C TraceContext header parsed and emitted by <code>W3cTraceContextPropagatorHelper</code></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/trace-context</code></td>
              <td><code>TraceContextSystemApiController</code></td>
              <td>Inspects active <code>W3cTraceContextDto</code> from SLF4J MDC</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="tracing-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="bash"
        fileName="inspect-trace-context.sh"
        code={`curl -i -H "X-Request-ID: 0194e1a0-7f20-7000-8000-0000000000aa" \\
  http://localhost:8080/api/v1/system/trace-context

# JSON Response:
# {
#   "code": 200,
#   "data": {
#     "version": "00",
#     "traceId": "0194e1a0-7f20-7000-8000-0000000000aa",
#     "spanId": "...",
#     "traceFlags": "01"
#   },
#   "traceId": "0194e1a0-7f20-7000-8000-0000000000aa"
# }`}
      />

      <Callout type="note" currentLang={currentLang}>
        MDC keys are cleared deterministically inside the <code>finally</code> block of <code>TraceIdFilter</code> so virtual thread carrier reuse never leaks trace context across unrelated requests.
      </Callout>
    </article>
  );
};
