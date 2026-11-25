import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { UI_LABELS, pickText } from '../data/locales';
import { RichDocText } from '../components/RichDocText';
import { STAGE7_CONTENT } from '../data/pages/stage7Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const TRACE_FLOW = `flowchart TD
  Client["Inbound Caller"] -->|X-Request-ID / traceparent| Filter["TraceIdFilter"]
  Filter -->|Missing?| UUID["UuidUtil.generateUuidV7"]
  Filter -->|Populate SLF4J MDC| Prop["W3cTraceContextPropagatorHelper"]
  Prop -->|HTTP Outbound| Client3P["ThirdPartyRestClientHelper"]
  Prop -->|Event Relay| Outbox["OutboxEvent Headers"]
  Filter -->|Response Header| Resp["ApiResponse traceId + X-Request-ID"]`;

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
        <RichDocText text={STAGE7_CONTENT.trGoalBody} currentLang={currentLang} />
      </p>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE7_CONTENT.trMermaidCaption, currentLang)}
        chart={TRACE_FLOW}
      />

      <h2 id="tracing-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE7_CONTENT.trThComp, currentLang)}</th>
              <th>{pickText(STAGE7_CONTENT.trThFormat, currentLang)}</th>
              <th>{pickText(STAGE7_CONTENT.trThRole, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>X-Request-ID</code></td>
              <td>UUIDv7 (RFC 9562)</td>
              <td><RichDocText text={STAGE7_CONTENT.trRowXreq} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>traceparent</code></td>
              <td><code>00-{'<traceId>'}-{'<spanId>'}-01</code></td>
              <td><RichDocText text={STAGE7_CONTENT.trRowTp} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/trace-context</code></td>
              <td><code>TraceContextSystemApiController</code></td>
              <td><RichDocText text={STAGE7_CONTENT.trRowEndpoint} currentLang={currentLang} /></td>
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
#   "code": "SUCCESS",
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
        <RichDocText text={STAGE7_CONTENT.trCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
