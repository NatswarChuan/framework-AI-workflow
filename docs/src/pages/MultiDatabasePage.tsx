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

const ROUTING_FLOW = `flowchart LR
  Call[Service Method Call] --> Aspect[DataSourceRoutingAspect]
  Aspect --> HasAnn{@TargetDataSource?}
  HasAnn -- Yes --> Key[Use Explicit Key]
  HasAnn -- No --> TxCheck{@Transactional readOnly?}
  TxCheck -- true --> Replica[DataSourceConstant.DATASOURCE_REPLICA]
  TxCheck -- false --> Primary[DataSourceConstant.DATASOURCE_PRIMARY]
  Key --> Holder[DataSourceContextHolder -> DynamicRoutingDataSource]
  Replica --> Holder
  Primary --> Holder`;

export const MultiDatabasePage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="multi-database"
        currentLang={currentLang}
        badges={[
          { label: '@TargetDataSource', tone: 'emerald' },
          { label: '@TargetDatabasePlatform', tone: 'blue' },
          { label: 'DynamicRoutingDataSource', tone: 'purple' },
        ]}
      />

      <h2 id="multidb-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>DataSourceRoutingAspect</code> intercepts repository and service boundaries, pushing routing keys into <code>DataSourceContextHolder</code> for <code>DynamicRoutingDataSource</code>. Methods marked <code>@Transactional(readOnly = true)</code> route to <code>REPLICA</code> automatically when <code>@TargetDataSource</code> is omitted.
      </p>

      <MermaidDiagram
        theme={theme}
        caption="Read/Write & Explicit Datasource Routing Flow"
        chart={ROUTING_FLOW}
      />

      <h2 id="multidb-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'target-ds',
            label: '@TargetDataSource',
            language: 'java',
            fileName: 'helper/AnalyticsReportHelper.java',
            highlightLines: [4, 5],
            code: `@AutoComponent
public final class AnalyticsReportHelper {

  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  public List<SalesSummaryDto> fetchDailyAggregates() {
    // Executes strictly against read replica pool
    return queryReplica();
  }
}`,
          },
          {
            id: 'multi-platform',
            label: 'Health Check API',
            language: 'bash',
            fileName: 'database-health.sh',
            code: `# Returns DatabaseClusterMetadataDto status across registered clusters
curl -s http://localhost:8080/api/v1/system/databases/health`,
          },
        ]}
      />

      <Callout type="warning" currentLang={currentLang}>
        Preserve Bounded Context isolation by linking cross-domain entities using logical UUIDv7 foreign keys instead of SQL joins across separate schemas or database platforms. Communication across contexts belongs in <code>TransactionalOutboxHelper</code> domain events.
      </Callout>
    </article>
  );
};
