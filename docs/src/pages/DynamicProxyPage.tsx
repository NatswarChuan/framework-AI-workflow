import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
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
      />

      <h2 id="proxy-goal" className="section-heading">
        {pickText(STAGE2_CONTENT.dpH2Goal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.dpGoalBody} currentLang={currentLang} />
      </p>

      <details className="under-the-hood-details">
        <summary className="under-the-hood-summary">
          <span>{pickText(STAGE2_CONTENT.dpUnderHoodSummary, currentLang)}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="under-the-hood-body">
          <MermaidDiagram
            theme={theme}
            currentLang={currentLang}
            caption={pickText(STAGE2_CONTENT.dpMermaidCaption, currentLang)}
            chart={PROXY_FLOW_CHART}
          />
        </div>
      </details>

      <h2 id="proxy-aot" className="section-heading">
        {pickText(STAGE2_CONTENT.dpH2Aot, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE2_CONTENT.dpConfigBody} currentLang={currentLang} />
      </p>
      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE2_CONTENT.dpAotLimitNote} currentLang={currentLang} />
      </Callout>

      <CodeBlock
        currentLang={currentLang}
        language="properties"
        fileName="META-INF/spring/aot.factories"
        code={`org.springframework.aot.hint.RuntimeHintsRegistrar=\\
io.github.natswarchuan.autoconfigure.NwvmcRuntimeHintsRegistrar`}
      />

      <h2 id="proxy-accessors" className="section-heading">
        {pickText(STAGE2_CONTENT.dpH2Accessors, currentLang)}
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

      <h2 id="proxy-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE2_CONTENT.dpCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
