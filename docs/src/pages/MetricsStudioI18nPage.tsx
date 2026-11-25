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
        badges={[
          { label: pickText(STAGE7_CONTENT.msBadgeMetrics, currentLang), tone: 'emerald' },
          { label: pickText(STAGE7_CONTENT.msBadgeLocales, currentLang), tone: 'blue' },
          { label: pickText(STAGE7_CONTENT.msBadgeHost, currentLang), tone: 'purple' },
        ]}
      />

      <h2 id="metrics-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)} — {pickText(STAGE7_CONTENT.msSecMetrics, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.msGoalBody} currentLang={currentLang} />
      </p>

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

      <h2 id="studio-i18n" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)} — {pickText(STAGE7_CONTENT.msSecStudio, currentLang)}
      </h2>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE7_CONTENT.msMermaidCaption, currentLang)}
        chart={LOCALE_PRIORITY_CHART}
      />

      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE7_CONTENT.msI18nBody} currentLang={currentLang} />
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

      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE7_CONTENT.msCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
