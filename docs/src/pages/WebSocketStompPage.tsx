import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { STAGE6_CONTENT } from '../data/pages/stage6Content';

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
        <RichDocText text={STAGE6_CONTENT.wsGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="ws-destinations" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE6_CONTENT.wsThChannel, currentLang)}</th>
              <th>{pickText(STAGE6_CONTENT.wsThPattern, currentLang)}</th>
              <th>{pickText(STAGE6_CONTENT.wsThPurpose, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>WebSocketStompConstant.WS_ENDPOINT</code></td>
              <td><code>/ws-connect</code></td>
              <td><RichDocText text={STAGE6_CONTENT.wsRowWs} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>TOPIC_PREFIX</code> / <code>QUEUE_PREFIX</code></td>
              <td><code>/topic</code> · <code>/queue</code></td>
              <td><RichDocText text={STAGE6_CONTENT.wsRowBroker} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>APP_PREFIX</code></td>
              <td><code>/app</code></td>
              <td><RichDocText text={STAGE6_CONTENT.wsRowApp} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td>{pickText(STAGE6_CONTENT.wsEventsLabel, currentLang)}</td>
              <td><code>/created</code>, <code>/updated</code>, <code>/deleted</code>, <code>/state-changed</code></td>
              <td><RichDocText text={STAGE6_CONTENT.wsRowEvents} currentLang={currentLang} /></td>
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
            label: pickText(STAGE6_CONTENT.wsTabYaml, currentLang),
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
            label: pickText(STAGE6_CONTENT.wsTabJs, currentLang),
            language: 'typescript',
            fileName: 'realtime-client.ts',
            code: `const source = new EventSource('/api/v1/product-catalogs/events');
source.addEventListener('UPDATED', (event) => {
  console.log('Catalog updated:', JSON.parse(event.data));
});`,
          },
        ]}
      />

      <h2 id="websocket-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE6_CONTENT.wsCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
