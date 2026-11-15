import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const ZodClientCodegenPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="zod-client-codegen"
        currentLang={currentLang}
        badges={[
          { label: '/schema/zod · /schema/client', tone: 'emerald' },
          { label: '/schema/typescript · /schema/json', tone: 'blue' },
          { label: 'ZodAndClientGeneratorUtil', tone: 'purple' },
        ]}
      />

      <h2 id="codegen-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Every controller interface extending <code>AutoApiReadController&lt;E&gt;</code> automatically publishes live schema artifacts via <code>ZodAndClientGeneratorUtil</code> and <code>TypeScriptSchemaGeneratorHelper</code>, mapping Java Bean Validation annotations (<code>@NotBlank</code>, <code>@Min</code>, <code>@Max</code>, <code>@Size</code>) into executable frontend contracts.
      </p>

      <h2 id="codegen-routes" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Generator Class</th>
              <th>Generated Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/schema/json</code></td>
              <td><code>DynamicSchemaProjectionHelper</code></td>
              <td>Draft-07 JSON Schema (<code>EntityJsonSchemaDto</code>)</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/schema/typescript</code></td>
              <td><code>TypeScriptSchemaGeneratorHelper</code></td>
              <td>Typed TypeScript <code>export interface Entity {'{ ... }'}</code></td>
            </tr>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/schema/zod</code></td>
              <td><code>ZodAndClientGeneratorUtil</code></td>
              <td>Runtime <code>z.object({'{ ... }'})</code> schema with constraint rules</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/{'{entity}'}/schema/client</code></td>
              <td><code>ZodAndClientGeneratorUtil</code></td>
              <td>Ready-to-use typed Fetch client supporting CRUD, pagination, and keyset cursors</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="codegen-output" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'zod-output',
            label: 'GET /schema/zod',
            language: 'typescript',
            fileName: 'productCatalogSchema.ts',
            code: `import { z } from 'zod';

export const ProductCatalogSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2).max(50),
  name: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  status: z.string(),
});

export type ProductCatalog = z.infer<typeof ProductCatalogSchema>;`,
          },
          {
            id: 'client-output',
            label: 'GET /schema/client',
            language: 'typescript',
            fileName: 'productCatalogClient.ts',
            code: `export function createProductCatalogClient(baseUrl = '/api/v1/product-catalogs', token?: string) {
  const headers = (): Record<string, string> => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
  });

  return {
    getPage: (query = '') => fetch(\`\${baseUrl}\${query}\`, { headers: headers() }).then((r) => r.json()),
    getById: (id: string) => fetch(\`\${baseUrl}/\${id}\`, { headers: headers() }).then((r) => r.json()),
    create: (payload: unknown) => fetch(baseUrl, { method: 'POST', headers: headers(), body: JSON.stringify(payload) }).then((r) => r.json()),
  };
}`,
          },
        ]}
      />

      <Callout type="tip" currentLang={currentLang}>
        You can download Zod schemas and Fetch clients visually inside <code>/system/studio</code> using the dedicated codegen buttons in the API explorer toolbar, eliminating manual frontend DTO synchronization.
      </Callout>
    </article>
  );
};
