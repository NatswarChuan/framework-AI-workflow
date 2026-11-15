import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

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
          { label: 'Auto SDL Schema', tone: 'blue' },
          { label: 'DynamicGraphQLExecutionHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="graphql-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>GraphQLDynamicApiController</code> mirrors every registered REST entity onto <code>/api/v1/graphql</code>. <code>DynamicGraphQLSchemaGeneratorHelper</code> introspects JPA metadata to produce typed GraphQL SDL documents on <code>GET /api/v1/graphql/schema</code> without writing manual resolver classes or schema files.
      </p>

      <h2 id="graphql-endpoints" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Helper Class</th>
              <th>Visibility &amp; Function</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /api/v1/graphql/schema</code></td>
              <td><code>DynamicGraphQLSchemaGeneratorHelper</code></td>
              <td>Generates complete GraphQL Schema Definition Language (SDL) from active JPA entities</td>
            </tr>
            <tr>
              <td><code>POST /api/v1/graphql</code></td>
              <td><code>DynamicGraphQLExecutionHelper</code></td>
              <td>Parses <code>GraphQLRequestDto</code> and delegates queries/mutations to <code>DynamicEntityCrudService</code></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/graphql/explorer</code></td>
              <td><code>GraphQLDynamicApiController</code></td>
              <td>Interactive HTML console marked <code>@Hidden</code> in Swagger OpenAPI 3.0</td>
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
            fileName: 'query-products.graphql',
            code: `query ListActiveProducts($page: Int, $size: Int) {
  findAllProductCatalog(page: $page, size: $size) {
    id
    code
    name
    unitPrice
  }
}`,
          },
          {
            id: 'graphql-curl',
            label: 'cURL Example',
            language: 'bash',
            fileName: 'graphql-request.sh',
            code: `curl -X POST http://localhost:8080/api/v1/graphql \\
  -H "Content-Type: application/json" \\
  -d '{"query":"{ findAllTag(page: 0, size: 10) { id name } }"}'`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        GraphQL queries reuse the exact same entity-level row security (<code>@EntitySecurity</code>) and field masking policies (<code>@FieldSecurity</code>) enforced on REST endpoints.
      </Callout>
    </article>
  );
};
