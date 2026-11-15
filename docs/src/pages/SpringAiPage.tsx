import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const SpringAiPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="spring-ai"
        currentLang={currentLang}
        badges={[
          { label: 'AiNaturalLanguageQueryParserHelper', tone: 'purple' },
          { label: 'DynamicEntityAiMetadataProviderHelper', tone: 'blue' },
          { label: 'POST /ai-query', tone: 'emerald' },
        ]}
      />

      <h2 id="ai-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>AiNaturalLanguageQueryParserHelper</code> translates natural-language prompts into validated <code>DynamicQueryRequestDto</code> Criteria queries dispatched via <code>DynamicEntityCrudService</code>, while <code>DynamicEntityAiMetadataProviderHelper</code> builds system context prompts and typed tool schemas for Spring AI <code>ChatClient</code> and <code>VectorStore</code> pipelines.
      </p>

      <h2 id="ai-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'ai-yml',
            label: 'AiEngineProperties YAML',
            language: 'yaml',
            fileName: 'application.yml',
            highlightLines: [4, 5, 6],
            code: `app:
  framework:
    ai:
      enabled: true
      natural-language-query-enabled: true
      system-prompt-prefix: "Translate user intent strictly into registered entity filters"`,
          },
          {
            id: 'ai-java',
            label: 'AI Tool Context Usage',
            language: 'java',
            fileName: 'helper/CatalogAssistantHelper.java',
            code: `@AutoComponent
@RequiredArgsConstructor
public final class CatalogAssistantHelper {

  private final DynamicEntityAiMetadataProviderHelper aiMetadataHelper;
  private final AiNaturalLanguageQueryParserHelper nlQueryHelper;

  public AiQueryExecutionResultDto<ProductCatalog> askCatalog(final AiQueryRequestDto req) {
    return nlQueryHelper.executeNaturalLanguageQuery(ProductCatalog.class, req);
  }
}`,
          },
        ]}
      />

      <Callout type="security" currentLang={currentLang}>
        Natural language query translation compiles filters exclusively against introspected entity fields inside <code>EntityMetadataIntrospectorHelper</code> and runs every generated predicate through <code>QueryGuardrailEnforcerUtil</code>, blocking unindexed scans and raw SQL injection attempts from prompt text.
      </Callout>
    </article>
  );
};
