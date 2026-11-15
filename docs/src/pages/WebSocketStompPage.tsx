import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const WebSocketStompPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="websocket-stomp"
        currentLang={currentLang}
        badges={[
          { label: '/ws-connect (STOMP)', tone: 'blue' },
          { label: 'SSE /events (@Hidden)', tone: 'purple' },
          { label: 'RealtimeStreamingProperties', tone: 'emerald' },
        ]}
      />

      <h2 id="ws-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Entity mutations publish real-time notifications simultaneously over Server-Sent Events (<code>GET /api/v1/{'{entity}'}/events</code>) and STOMP WebSockets configured by <code>WebSocketStompConfig</code> and <code>EntityEventWebSocketBroadcasterListener</code>.
      </p>

      <h2 id="ws-destinations" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Channel / Constant</th>
              <th>Value / Pattern</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>WebSocketStompConstant.WS_ENDPOINT</code></td>
              <td><code>/ws-connect</code></td>
              <td>STOMP WebSocket handshake endpoint</td>
            </tr>
            <tr>
              <td><code>TOPIC_PREFIX</code> / <code>QUEUE_PREFIX</code></td>
              <td><code>/topic</code> · <code>/queue</code></td>
              <td>Public broadcast topics and user-specific message queues</td>
            </tr>
            <tr>
              <td><code>APP_PREFIX</code></td>
              <td><code>/app</code></td>
              <td>Application-routed inbound STOMP message destination prefix</td>
            </tr>
            <tr>
              <td>Event Suffixes</td>
              <td><code>/created</code>, <code>/updated</code>, <code>/deleted</code>, <code>/state-changed</code></td>
              <td>Per-entity mutation sub-topics dispatched by <code>WebSocketEntityBroadcasterHelper</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="ws-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'realtime-yml',
            label: 'SSE Configuration',
            language: 'yaml',
            fileName: 'application.yml',
            code: `app:
  framework:
    realtime:
      sse-enabled: true
      heartbeat-seconds: 15
      max-emitters-per-entity: 1000`,
          },
          {
            id: 'sse-js',
            label: 'Browser EventSource Client',
            language: 'typescript',
            fileName: 'realtime-client.ts',
            code: `const source = new EventSource('/api/v1/product-catalogs/events');
source.addEventListener('UPDATED', (event) => {
  console.log('Catalog updated:', JSON.parse(event.data));
});`,
          },
        ]}
      />

      <Callout type="tip" currentLang={currentLang}>
        Active SSE and WebSocket client counts export directly under Micrometer gauge <code>framework.realtime.active.connections</code> via <code>DynamicEntityMetricsHelper</code>.
      </Callout>
    </article>
  );
};
