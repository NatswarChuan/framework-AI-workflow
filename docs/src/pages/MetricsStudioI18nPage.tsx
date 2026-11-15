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

const LOCALE_PRIORITY_CHART = `flowchart LR
  Req[HTTP Request to /system/studio or API] --> Q{1. ?lang= param?}
  Q -- Yes --> Res[Resolved Locale + Persist Cookie]
  Q -- No --> C{2. NWVMC_LANG Cookie?}
  C -- Yes --> Res
  C -- No --> H{3. X-Language Header?}
  H -- Yes --> Res
  H -- No --> AL{4. Accept-Language Header?}
  AL -- Yes --> Res
  AL -- No --> Def[5. app.framework.i18n.default-locale = en]
  Res --> RTL{"Is ar, fa, or ur?"}
  RTL -- Yes --> DirRTL["dir=rtl on html / studio shell"]
  RTL -- No --> DirLTR["dir=ltr on html / studio shell"]`;

export const MetricsStudioI18nPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="metrics-studio-i18n"
        currentLang={currentLang}
        badges={[
          { label: '11 Micrometer Metrics', tone: 'emerald' },
          { label: '20 Studio Locales · RTL', tone: 'blue' },
          { label: 'Host i18n Override', tone: 'purple' },
        ]}
      />

      <h2 id="metrics-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)} — Micrometer Metrics
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>DynamicEntityMetricsHelper</code> and <code>DynamicEntityHealthIndicatorHelper</code> instrument proxy calls, HTTP caches, resilience state machines, real-time sockets, and datasource routing without static Spring Web dependencies.
      </p>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Micrometer Name (<code>MetricConstant</code>)</th>
              <th>Type</th>
              <th>Measured Signal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>dynamic.entity.requests.total</code></td>
              <td>Counter</td>
              <td>Total requests handled by dynamic proxy controllers tagged by entity &amp; outcome</td>
            </tr>
            <tr>
              <td><code>dynamic.entity.duration.seconds</code></td>
              <td>Timer</td>
              <td>End-to-end execution latency for CRUD &amp; custom endpoint calls</td>
            </tr>
            <tr>
              <td><code>nwvmc.proxy.request.duration</code></td>
              <td>Timer</td>
              <td>JDK Dynamic Proxy invocation &amp; escape-hatch dispatch overhead</td>
            </tr>
            <tr>
              <td><code>nwvmc.cache.http.requests</code></td>
              <td>Counter</td>
              <td>HTTP cache outcomes tagged by <code>HIT</code> and <code>MISS</code></td>
            </tr>
            <tr>
              <td><code>nwvmc.outbox.pending.events</code></td>
              <td>Gauge</td>
              <td>Current backlog count awaiting relay by <code>OutboxEventDispatcherProvider</code></td>
            </tr>
            <tr>
              <td><code>nwvmc.outbox.dispatch.duration</code></td>
              <td>Timer</td>
              <td>Broker dispatch latency per outbox batch cycle</td>
            </tr>
            <tr>
              <td><code>nwvmc.resilience.circuitbreaker.state</code></td>
              <td>Gauge</td>
              <td>Circuit breaker state integer (<code>0=CLOSED</code>, <code>1=HALF_OPEN</code>, <code>2=OPEN</code>)</td>
            </tr>
            <tr>
              <td><code>nwvmc.ratelimit.rejected.total</code></td>
              <td>Counter</td>
              <td>Requests shed by <code>@RateLimit</code> guardrails</td>
            </tr>
            <tr>
              <td><code>framework.outbox.dispatched.total</code></td>
              <td>Counter</td>
              <td>Successfully acknowledged domain outbox events</td>
            </tr>
            <tr>
              <td><code>framework.realtime.active.connections</code></td>
              <td>Gauge</td>
              <td>Concurrent SSE &amp; STOMP WebSocket client subscriptions</td>
            </tr>
            <tr>
              <td><code>framework.datasource.routing.total</code></td>
              <td>Counter</td>
              <td>Database routing frequency grouped by Primary/Replica/Platform key</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="studio-i18n" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)} — 20-Language Studio &amp; RTL Resolution
      </h2>

      <MermaidDiagram
        theme={theme}
        caption="LocaleResolutionUtil Resolution Priority & RTL Directionality"
        chart={LOCALE_PRIORITY_CHART}
      />

      <p style={{ color: 'var(--text-secondary)' }}>
        All 20 languages (<code>en</code>, <code>zh</code>, <code>hi</code>, <code>es</code>, <code>fr</code>, <code>ar</code>, <code>bn</code>, <code>pt</code>, <code>ru</code>, <code>ur</code>, <code>id</code>, <code>de</code>, <code>ja</code>, <code>vi</code>, <code>ko</code>, <code>tr</code>, <code>it</code>, <code>th</code>, <code>fa</code>, <code>pl</code>) ship as UTF-8 bundles inside <code>classpath:i18n/messages*.properties</code>. <code>LocaleResolutionUtil</code> evaluates <code>?lang=</code>, <code>NWVMC_LANG</code> cookie, <code>X-Language</code>, and <code>Accept-Language</code> in strict priority.
      </p>

      <h2 id="i18n-diag" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'i18n-yml',
            label: 'application-dev.yml',
            language: 'yaml',
            fileName: 'src/main/resources/application-dev.yml',
            highlightLines: [4, 5, 8, 9, 10],
            code: `app:
  framework:
    i18n:
      default-locale: en
      supported-locales: [en, zh, hi, es, fr, ar, bn, pt, ru, ur, id, de, ja, vi, ko, tr, it, th, fa, pl]
      cache-seconds: 3600
    studio:
      enabled: true
      demo-token-endpoint-enabled: true
      show-i18n-diagnostics: true`,
          },
          {
            id: 'host-override',
            label: 'Host App i18n Override',
            language: 'properties',
            fileName: 'src/main/resources/i18n/messages_vi.properties',
            code: `# Override any framework validation or error message without modifying the starter JAR
# I18nConfig gives the application classpath resource priority before framework bundles
error.query.guardrail.join.depth.exceeded=Độ sâu liên kết vượt quá giới hạn cho phép
studio.header.version_badge=v1.0.0 (Java 21 LTS)`,
          },
        ]}
      />

      <Callout type="tip" currentLang={currentLang}>
        Enabling <code>app.framework.studio.show-i18n-diagnostics: true</code> renders the live <code>#studioI18nDiagBar</code> telemetry ribbon inside <code>/system/studio</code> displaying the active locale, resolution source, and RTL directionality.
      </Callout>
    </article>
  );
};
