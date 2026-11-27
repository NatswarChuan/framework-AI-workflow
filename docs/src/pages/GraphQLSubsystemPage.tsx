import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { STAGE4_CONTENT } from '../data/pages/stage4Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const GraphQLSubsystemPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="graphql-subsystem"
        currentLang={currentLang}
        badges={[
          { label: 'GraphQLDynamicApiController', tone: 'purple' },
          { label: pickText(STAGE4_CONTENT.gqlBadgeSchema, currentLang), tone: 'blue' },
          { label: 'DynamicGraphQLExecutionHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="graphql-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE4_CONTENT.gqlGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="graphql-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE4_CONTENT.gqlThEndpoint, currentLang)}</th>
              <th>{pickText(STAGE4_CONTENT.gqlThHelper, currentLang)}</th>
              <th>{pickText(STAGE4_CONTENT.gqlThFunc, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /api/v1/graphql/schema</code></td>
              <td><code>DynamicGraphQLSchemaGeneratorHelper</code></td>
              <td><RichDocText text={STAGE4_CONTENT.gqlRowSchema} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>POST /api/v1/graphql</code></td>
              <td><code>DynamicGraphQLExecutionHelper</code></td>
              <td><RichDocText text={STAGE4_CONTENT.gqlRowExec} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/graphql/explorer</code></td>
              <td><code>GraphQLDynamicApiController</code></td>
              <td><RichDocText text={STAGE4_CONTENT.gqlRowExplorer} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="graphql-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'graphql-query',
            label: 'POST /api/v1/graphql',
            language: 'graphql',
            fileName: 'marketplace-catalog-and-tags.graphql',
            code: `query ListMarketplaceCatalogAndTags {
  listProductCatalogs {
    id
    skuCode
    productName
    retailPrice
  }
  listTags {
    id
    code
    label
  }
}`,
          },
          {
            id: 'graphql-curl',
            label: pickText(STAGE4_CONTENT.gqlTabCurl, currentLang),
            language: 'bash',
            fileName: '06-graphql-marketplace.sh',
            code: `# 1. Inspect the auto-generated GraphQL SDL schema
curl -s "http://localhost:8080/api/v1/graphql/schema" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 2. Fetch ProductCatalog and Tag fields in one single GraphQL round-trip
curl -s -X POST "http://localhost:8080/api/v1/graphql" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"query { listProductCatalogs { id skuCode productName retailPrice } listTags { id code label } }"}' | jq`,
          },
        ]}
      />

      <h2 id="graphql-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE4_CONTENT.gqlCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
