import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { InteractiveEndpointExplorer } from '../components/InteractiveEndpointExplorer';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const EndpointsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="endpoints"
        currentLang={currentLang}
        badges={[
          { label: '40 Declared Contracts', tone: 'emerald' },
          { label: '38 Default Swagger Routes', tone: 'blue' },
          { label: '17 Read · 11 Write · 12 Enterprise', tone: 'purple' },
        ]}
      />

      <h2 id="endpoints-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>

      <div className="feature-grid">
        <div className="feature-card">
          <h4>AutoApiReadController (17 Contracts)</h4>
          <p>
            Offset page, UUIDv7 Keyset cursor, full filter list, SQL aggregates, count/exists, pivot tables, full-text search, CSV/Excel/JSON/XML/Markdown exports, plus <code>/schema/json</code>, <code>/schema/typescript</code>, <code>/schema/zod</code>, and <code>/schema/client</code>.
          </p>
        </div>
        <div className="feature-card">
          <h4>AutoApiController (11 Write Contracts)</h4>
          <p>
            Single &amp; batch create, PUT replace, PATCH partial update, UPSERT, delete by ID, JSON Merge Patch, query-based batch patch, single transition, chunked batch execution, and <code>importData</code>.
          </p>
        </div>
        <div className="feature-card">
          <h4>AutoApiEnterpriseController (12 Contracts)</h4>
          <p>
            Soft delete, restore, dry-run validation, entity diff compare, batch transitions, pessimistic checkout lock, audit history, plus <code>@Hidden</code> SSE <code>/events</code> stream.
          </p>
        </div>
        <div className="feature-card">
          <h4>38 Exposed by Default in Swagger UI</h4>
          <p>
            Of the 40 parent contracts, <code>/events</code> carries <code>@Hidden</code> because Swagger UI cannot stream SSE, and nested sub-resources activate when <code>enableNestedSubResources = true</code>.
          </p>
        </div>
      </div>

      <h2 id="endpoints-explorer" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <InteractiveEndpointExplorer currentLang={currentLang} />

      <h2 id="endpoints-system" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>System Path</th>
              <th>Controller Class</th>
              <th>Access &amp; Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>GET /system/studio</code></td>
              <td><code>DevStudioController</code></td>
              <td>20-language interactive console (requires <code>studio.enabled=true</code>; returns 404/401 when disabled)</td>
            </tr>
            <tr>
              <td><code>GET /system/studio/eject</code></td>
              <td><code>DevEjectionController</code></td>
              <td>Generates standalone MVC Repository, Service, and Controller scaffolds via <code>?target=Entity</code></td>
            </tr>
            <tr>
              <td><code>POST /api/v1/graphql</code></td>
              <td><code>GraphQLDynamicApiController</code></td>
              <td>Auto-generated GraphQL SDL queries &amp; mutations across all registered entities</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/databases/health</code></td>
              <td><code>MultiDatabaseHealthCheckController</code></td>
              <td>Multi-platform datasource status &amp; connection pool diagnostics</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/trace-context</code></td>
              <td><code>TraceContextSystemApiController</code></td>
              <td>Inspect active W3C <code>traceparent</code>, <code>traceId</code>, and <code>spanId</code> from MDC</td>
            </tr>
            <tr>
              <td><code>GET /api/v1/system/customizers</code></td>
              <td><code>CustomizerTelemetryApiController</code></td>
              <td>Inspect active Spring Ecosystem Customizers registered via SPI</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="SelectiveEndpointExclusion.java"
        highlightLines={[3, 4]}
        code={`@AutoRestController(
    path = "/api/v1/tags",
    disabledEndpoints = {"batchChunked", "bulkDelete"}
)
public interface TagController extends AutoApiController<Tag> {}`}
      />

      <Callout type="tip" currentLang={currentLang}>
        Every endpoint enforces pagination ceilings and operator allow-lists through <code>QueryGuardrailProperties</code> before touching JPA Criteria queries.
      </Callout>
    </article>
  );
};
