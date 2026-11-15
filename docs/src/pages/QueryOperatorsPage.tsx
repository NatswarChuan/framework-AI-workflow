import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { OPERATORS_DATA } from '../data/operatorsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const QueryOperatorsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="query-operators"
        currentLang={currentLang}
        badges={[
          { label: '13 Filter Operators', tone: 'emerald' },
          { label: 'QueryGuardrailProperties', tone: 'rose' },
          { label: 'UUIDv7 O(1) Keyset', tone: 'blue' },
        ]}
      />

      <h2 id="query-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>QueryFilterParameterUtil</code> parses dot-suffixed query parameters (such as <code>unitPrice.gte=100</code> or <code>code.startsWith=PRD-</code>) directly into typed JPA Criteria predicates while <code>QueryGuardrailEnforcerUtil</code> rejects arbitrary deep joins or unindexed scan explosions.
      </p>

      <h2 id="query-operators-table" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>HTTP Query Syntax</th>
              <th>SQL Translation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {OPERATORS_DATA.map((op) => (
              <tr key={op.operator}>
                <td><code>.{op.operator}</code></td>
                <td><code>{op.syntax}</code></td>
                <td><code>{op.sqlEquivalent}</code></td>
                <td>{pickText(op.description, currentLang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="query-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'guardrails-yml',
            label: 'application.yml',
            language: 'yaml',
            fileName: 'src/main/resources/application.yml',
            highlightLines: [4, 5, 6, 7, 8],
            code: `app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      allowed-filter-fields: [id, code, name, status, unitPrice, category]
      allowed-sort-fields: [id, createdAt, unitPrice, name]`,
          },
          {
            id: 'keyset-http',
            label: 'Keyset O(1) Query',
            language: 'bash',
            fileName: 'keyset-pagination.sh',
            code: `# Depth-1M page lookup stays O(1) via monotonic UUIDv7 B-Tree seek
curl -s "http://localhost:8080/api/v1/product-catalogs/keyset?afterId=0194e1a0-7000-7000-8000-000000000001&size=25&status.eq=ACTIVE&include=category&fields=id,code,name,unitPrice"`,
          },
        ]}
      />

      <Callout type="security" currentLang={currentLang}>
        Every filter path is validated against entity JPA metamodel attributes and <code>QueryGuardrailProperties</code> (<code>max-join-depth</code>, <code>max-filter-criteria</code>, <code>allowed-filter-fields</code>) before constructing Criteria expressions, preventing SQL injection and N+1 denial-of-service probes.
      </Callout>
    </article>
  );
};
