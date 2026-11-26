import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { UI_LABELS, pickText } from '../data/locales';
import { RichDocText } from '../components/RichDocText';
import { STAGE8_CONTENT } from '../data/pages/stage8Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const SpringAiPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="spring-ai"
        currentLang={currentLang}
        guardrailTip={{
          type: 'security',
          content: <RichDocText text={STAGE8_CONTENT.aiCalloutSec} currentLang={currentLang} />,
        }}
      />

      <h2 id="ai-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.aiGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="ai-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="yaml"
        fileName="application.yml"
        highlightLines={[4, 5, 6]}
        code={`app:
  framework:
    ai:
      enabled: true
      natural-language-query-enabled: true
      system-prompt-prefix: "Translate user intent strictly into registered entity filters"`}
      />

      <h2 id="ai-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'ai-helper-java',
            label: 'CatalogAssistantHelper.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/helper/CatalogAssistantHelper.java',
            highlightLines: [17, 18, 22, 32],
            code: `package com.example.implementation.helper;

import com.example.implementation.entity.ProductCatalog;
import io.github.natswarchuan.common.dto.AiQueryExecutionResultDto;
import io.github.natswarchuan.common.dto.AiQueryRequestDto;
import io.github.natswarchuan.module.ai.helper.AiNaturalLanguageQueryParserHelper;
import io.github.natswarchuan.module.ai.helper.DynamicEntityAiMetadataProviderHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public final class CatalogAssistantHelper {

  // ObjectProvider avoids Spring component-scan ordering conflicts with framework AutoConfiguration
  private final ObjectProvider<DynamicEntityAiMetadataProviderHelper> metadataProvider;
  private final ObjectProvider<AiNaturalLanguageQueryParserHelper> nlQueryParserProvider;

  public String getProductCatalogSystemPrompt() {
    return metadataProvider.getObject().generateSystemContextPrompt(ProductCatalog.class);
  }

  public AiQueryExecutionResultDto<ProductCatalog> askProductCatalog(final String naturalPrompt) {
    final AiQueryRequestDto request = AiQueryRequestDto.builder()
        .prompt(naturalPrompt)
        .page(0)
        .size(10)
        .sort("retailPrice")
        .dir("asc")
        .build();
    return nlQueryParserProvider.getObject().executeNaturalLanguageQuery(ProductCatalog.class, request);
  }
}`,
          },
          {
            id: 'ai-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '12b-spring-ai-natural-query.sh',
            code: `# 1. Fetch the auto-generated LLM system prompt for ProductCatalog (both /ai/context & /ai-context work!)
curl -s "http://localhost:8080/api/v1/product-catalogs/ai/context" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 2. Run a natural-language query translated into safe JPA Criteria filters (no raw SQL!)
curl -s -X POST "http://localhost:8080/api/v1/product-catalogs/ai/query" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt":"category equals ELECTRONICS and retailPrice less than 3000","page":0,"size":5,"sort":"retailPrice","dir":"asc"}' | jq`,
          },
        ]}
      />
    </article>
  );
};
