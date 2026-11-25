import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { OPERATORS_DATA } from '../data/operatorsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE3_CONTENT } from '../data/pages/stage3Content';

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
          { label: pickText(STAGE3_CONTENT.qoBadgeOps, currentLang), tone: 'emerald' },
          { label: 'QueryGuardrailProperties', tone: 'rose' },
          { label: pickText(STAGE3_CONTENT.qoBadgeKeyset, currentLang), tone: 'blue' },
        ]}
      />

      <h2 id="query-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE3_CONTENT.qoGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="query-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="yaml"
        fileName="src/main/resources/application.yml"
        highlightLines={[4, 5, 6, 7, 8]}
        code={`app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      allowed-filter-fields: [id, skuCode, productName, category, brand, retailPrice, active]
      allowed-sort-fields: [id, createdAt, retailPrice, productName]`}
      />

      <h2 id="query-operators-table" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE3_CONTENT.qoThOp, currentLang)}</th>
              <th>{pickText(STAGE3_CONTENT.qoThSyntax, currentLang)}</th>
              <th>{pickText(STAGE3_CONTENT.qoThSql, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colDescription, currentLang)}</th>
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

      <h2 id="query-verification" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="bash"
        fileName="05-query-operators-and-keyset.sh"
        code={`# 1. Combine dot-syntax operators (.gte, .like) + sparse ?fields= projection on ProductCatalog
curl -s "http://localhost:8080/api/v1/product-catalogs?category=ELECTRONICS&retailPrice.gte=1000&productName.like=MacBook&fields=id,skuCode,productName,retailPrice" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 2. Depth-1M page lookup stays O(1) via bidirectional UUIDv7 B-Tree keyset seek
curl -s "http://localhost:8080/api/v1/product-catalogs/keyset?dir=desc&size=5&fields=id,skuCode,productName,retailPrice" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 3. Selective relation expansion without full-graph blowup (?expand=customer)
curl -s "http://localhost:8080/api/v1/customer-orders?expand=customer&page=0&size=10" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq`}
      />

      <h2 id="query-notes" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="security" currentLang={currentLang}>
        <RichDocText text={STAGE3_CONTENT.qoCalloutSecurity} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
