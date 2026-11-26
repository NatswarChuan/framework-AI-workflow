import React from 'react';
import { ChevronDown } from 'lucide-react';
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

const LOCALE_PRIORITY_CHART = `flowchart TD
  Req["HTTP Request to /system/studio or API"] --> Q{"1. ?lang= param?"}
  Q -->|Yes| Res["Resolved Locale + Persist Cookie"]
  Q -->|No| H{"2. X-Language Header?"}
  H -->|Yes| Res
  H -->|No| C{"3. NWVMC_LANG Cookie?"}
  C -->|Yes| Res
  C -->|No| AL{"4. Accept-Language Header?"}
  AL -->|Yes| Res
  AL -->|No| Def["5. default-locale = en"]
  Res --> RTL{"Is ar, fa, or ur?"}
  RTL -->|Yes| DirRTL["dir=rtl on html / studio shell"]
  RTL -->|No| DirLTR["dir=ltr on html / studio shell"]`;

export const MetricsStudioI18nPage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="metrics-studio-i18n"
        currentLang={currentLang}
      />

      <h2 id="metrics-goal" className="section-heading">
        {pickText(STAGE7_CONTENT.msH2Overview, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.msGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="metrics-inventory" className="section-heading">
        {pickText(STAGE7_CONTENT.msH2Metrics, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th><RichDocText text={STAGE7_CONTENT.msThName} currentLang={currentLang} /></th>
              <th>{pickText(STAGE7_CONTENT.msThType, currentLang)}</th>
              <th>{pickText(STAGE7_CONTENT.msThSignal, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>dynamic.entity.requests.total</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeCounter, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow1} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>dynamic.entity.duration.seconds</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeTimer, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow2} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.proxy.request.duration</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeTimer, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow3} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.cache.http.requests</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeCounter, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow4} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.outbox.pending.events</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeGauge, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow5} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.outbox.dispatch.duration</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeTimer, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow6} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.resilience.circuitbreaker.state</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeGauge, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow7} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>nwvmc.ratelimit.rejected.total</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeCounter, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow8} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>framework.outbox.dispatched.total</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeCounter, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow9} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>framework.realtime.active.connections</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeGauge, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow10} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>framework.datasource.routing.total</code></td>
              <td>{pickText(STAGE7_CONTENT.msTypeCounter, currentLang)}</td>
              <td><RichDocText text={STAGE7_CONTENT.msRow11} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="metrics-ops-alerts" className="section-heading">
        {pickText(STAGE7_CONTENT.msH2OpsAlert, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.msOpsLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'ms-promql',
            label: 'PromQL Alerts',
            language: 'yaml',
            fileName: 'prometheus-nwvmc-alerts.yml',
            code: `groups:
  - name: spring-nwvmc-slo
    rules:
      - alert: HighEntityErrorRate
        expr: |
          sum(rate(dynamic_entity_requests_total{status=~"5..|ERROR"}[5m])) by (entity)
          / clamp_min(sum(rate(dynamic_entity_requests_total[5m])) by (entity), 1) > 0.05
        for: 3m
      - alert: HighEntityP99Latency
        expr: histogram_quantile(0.99, sum(rate(dynamic_entity_duration_seconds_bucket[5m])) by (le, entity)) > 0.50
        for: 5m`,
          },
          {
            id: 'ms-otlp-k8s',
            label: 'OTLP + K8s Probes',
            language: 'yaml',
            fileName: 'application-prod.yml (Actuator + OTLP)',
            code: `management:
  endpoints:
    web:
      exposure:
        include: health,prometheus,info
  endpoint:
    health:
      probes:
        enabled: true # exposes /actuator/health/liveness and /actuator/health/readiness
  tracing:
    sampling:
      probability: 0.1
  otlp:
    tracing:
      endpoint: https://otel-collector.internal:4318/v1/traces`,
          },
        ]}
      />

      <h2 id="i18n-diag" className="section-heading">
        {pickText(STAGE7_CONTENT.msH2I18n, currentLang)}
      </h2>

      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.msI18nBody} currentLang={currentLang} />
      </p>

      <details className="under-the-hood-details">
        <summary className="under-the-hood-summary">
          <span>{pickText(STAGE7_CONTENT.msUnderHoodSummary, currentLang)}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="under-the-hood-body">
          <MermaidDiagram
            theme={theme}
            currentLang={currentLang}
            caption={pickText(STAGE7_CONTENT.msMermaidCaption, currentLang)}
            chart={LOCALE_PRIORITY_CHART}
          />
        </div>
      </details>

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
            label: pickText(STAGE7_CONTENT.msTabHost, currentLang),
            language: 'properties',
            fileName: 'src/main/resources/i18n/messages_vi.properties',
            code: `# Override any framework validation or error message without modifying the starter JAR
# I18nConfig gives the application classpath resource priority before framework bundles
error.query.guardrail.join.depth.exceeded=Độ sâu liên kết vượt quá giới hạn cho phép
studio.tagline=Cổng Quản Trị API Động Doanh Nghiệp (Java 21 LTS · v0.1.0)`,
          },
        ]}
      />

      <h2 id="metrics-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE7_CONTENT.msCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
