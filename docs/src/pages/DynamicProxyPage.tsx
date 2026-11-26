import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme: 'dark' | 'light';
}

const PROXY_FLOW_CHART = `flowchart TD
  Start["DynamicControllerProxyRegistrarHelper\ncreateAndRegisterControllerProxy"] --> Scan["Scan AutoApiController Interfaces"]
  Scan --> Filter["EndpointFeatureFilterHelper\nenabled / disabled"]
  Filter --> Bridge["SpringMvcEndpointBridge\nRequestMappingHandlerMapping"]
  Bridge --> Call["HTTP Request\nControllerProxyInvocationHandler"]
  Call --> Check{"@ServiceOverride present?"}
  Check -->|Yes| Escape["EscapeHatchDispatchHelper\nMethodHandleCacheUtil"]
  Check -->|No| Crud["DynamicEntityCrudService\nTransaction + JPA"]`;

export const DynamicProxyPage: React.FC<PageProps> = ({ currentLang, theme }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="dynamic-proxy"
        currentLang={currentLang}
        guardrailTip={{
          type: 'tip',
          content: <RichDocText text={STAGE2_CONTENT.dpCalloutTip} currentLang={currentLang} />,
        }}
      />

      <h2 id="proxy-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.dpGoalBody} currentLang={currentLang} />
      </p>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE2_CONTENT.dpMermaidCaption, currentLang)}
        chart={PROXY_FLOW_CHART}
      />

      <h2 id="proxy-aot" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.dpConfigBody} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        language="properties"
        fileName="META-INF/spring/aot.factories"
        code={`org.springframework.aot.hint.RuntimeHintsRegistrar=\\
io.github.natswarchuan.autoconfigure.NwvmcRuntimeHintsRegistrar`}
      />

      <h2 id="proxy-accessors" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="MethodHandleCacheUtil.java + LambdaAccessorUtil.java"
        code={`// Cached unreflected MethodHandle lookup inside EscapeHatchDispatchHelper
final MethodHandle handle = MethodHandleCacheUtil.resolveMethodHandle(targetClass, "buildTaxonomyStats");
final Object result = handle.bindTo(beanInstance).invokeWithArguments(args);

// Zero-reflection property getter handle via LambdaAccessorUtil
final Function<Object, Object> getter = LambdaAccessorUtil.resolveLambdaGetter(entityClass, "status");
final Object statusValue = getter.apply(entity);`}
      />
    </article>
  );
};
