import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const TimeTravelPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="time-travel"
        currentLang={currentLang}
        badges={[
          { label: '@AuditTrail', tone: 'purple' },
          { label: 'TimeTravelDynamicApiController', tone: 'blue' },
          { label: 'EntityTimeTravelReconstructionHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="timetravel-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>@AuditTrail</code> appends immutable change diffs across inserts, updates, state machine transitions, and soft deletes. <code>TimeTravelDynamicApiController</code> exposes <code>GET /api/v1/system/time-travel/{'{entityName}'}/{'{id}'}?timestamp=...</code> backed by <code>EntityTimeTravelReconstructionHelper</code> to replay historical field snapshots up to any ISO-8601 UTC instant.
      </p>

      <h2 id="timetravel-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Class</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/{'{id}'}/history</code></td>
              <td><code>AutoApiEnterpriseController</code></td>
              <td>Retrieves chronological audit trail diff log for an individual UUIDv7 record</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/time-travel/{'{entityName}'}/{'{id}'}?timestamp=ISO-8601</code></td>
              <td><code>TimeTravelDynamicApiController</code></td>
              <td>Reconstructs <code>HistoricalEntitySnapshotDto</code> at an arbitrary UTC timestamp</td>
            </tr>
            <tr>
              <td><code>POST /api/v1/{'{entity}'}/{'{id}'}/restore</code></td>
              <td><code>AutoApiEnterpriseController</code></td>
              <td>Restores soft-deleted entity rows cleanly within a rollback-safe transaction</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="timetravel-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'audit-entity',
            label: '@AuditTrail Entity',
            language: 'java',
            fileName: 'entity/ContractRecord.java',
            highlightLines: [2],
            code: `@Entity
@AuditTrail
public class ContractRecord {
  @Id
  private UUID id;
  private String contractStatus;
  private BigDecimal committedValue;
}`,
          },
          {
            id: 'replay-curl',
            label: 'Point-in-Time Query',
            language: 'bash',
            fileName: 'time-travel-query.sh',
            code: `curl -s "http://localhost:8080/api/v1/system/time-travel/ContractRecord/0194e1a0-7f20-7000-8000-000000000042?timestamp=2026-11-10T08:30:00Z"`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        Toggle audit trail capture globally using <code>app.framework.aop.audit-trail-enabled</code> inside <code>AopAuditProperties</code>. When an entity is missing or lacks audit entries before the requested instant, <code>TimeTravelReconstructionException</code> maps cleanly to HTTP 404.
      </Callout>
    </article>
  );
};
