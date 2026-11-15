import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
  theme: 'dark' | 'light';
}

const PROXY_FLOW_CHART = `flowchart TD
  Start[DynamicControllerProxyRegistrarHelper.register] --> Scan[Scan AutoApiController Interfaces]
  Scan --> Filter[EndpointFeatureFilterHelper enabled/disabled]
  Filter --> Bridge[SpringMvcEndpointBridge RequestMappingHandlerMapping]
  Bridge --> Call[HTTP Call -> ControllerProxyInvocationHandler]
  Call --> Check{@ServiceOverride present?}
  Check -- Yes --> Escape[EscapeHatchDispatchHelper -> MethodHandleCacheUtil]
  Check -- No --> Crud[DynamicEntityCrudService -> Transaction + JPA]`;

export const DynamicProxyPage: React.FC<PageProps> = ({ currentLang, theme }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="dynamic-proxy"
        currentLang={currentLang}
        badges={[
          { label: 'MethodHandleCacheUtil', tone: 'emerald' },
          { label: 'LambdaAccessorUtil', tone: 'blue' },
          { label: 'NwvmcRuntimeHintsRegistrar', tone: 'purple' },
        ]}
      />

      <h2 id="proxy-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <code>DynamicControllerProxyRegistrarHelper</code> instantiates one JDK Dynamic Proxy per controller interface backed by <code>ControllerProxyInvocationHandler</code> and registers its handler methods into Spring MVC via <code>SpringMvcEndpointBridge</code>. On the execution hot path, <code>MethodHandleCacheUtil</code> (plus <code>MethodHandle.asFixedArity()</code> for varargs methods such as <code>SecurityCustomizerProxyBridge</code>) replaces slow reflective <code>Method.invoke</code> calls.
      </p>

      <MermaidDiagram
        theme={theme}
        caption="Dynamic Proxy Bootstrap & MethodHandle Hot-Path Dispatch"
        chart={PROXY_FLOW_CHART}
      />

      <h2 id="proxy-aot" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        For GraalVM Native Image builds, <code>NwvmcRuntimeHintsRegistrar</code> (registered in <code>META-INF/spring/aot.factories</code> and activated via <code>@ImportRuntimeHints</code> on <code>ControllerToApiAutoConfiguration</code>) declares proxy interfaces, reflection hints for framework components and <code>i18n/messages*</code> resource bundles.
      </p>

      <CodeBlock
        currentLang={currentLang}
        language="properties"
        fileName="META-INF/spring/aot.factories"
        code={`org.springframework.aot.hint.RuntimeHintsRegistrar=\\
io.github.natswarchuan.core.aot.NwvmcRuntimeHintsRegistrar`}
      />

      <h2 id="proxy-accessors" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="MethodHandleCacheUtil & LambdaAccessorUtil Usage"
        code={`// Cached unreflected MethodHandle lookup inside EscapeHatchDispatchHelper
final MethodHandle handle = MethodHandleCacheUtil.resolveHandle(targetClass, targetMethod);
final Object result = handle.bindTo(beanInstance).invokeWithArguments(args);

// Zero-reflection property getter/setter handles via LambdaAccessorUtil
final Function<Object, Object> getter = LambdaAccessorUtil.resolveGetter(entityClass, "status");
final Object statusValue = getter.apply(entity);`}
      />

      <h2 id="proxy-notes" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="tip" currentLang={currentLang}>
        When wrapping proxied bridge calls that take Java varargs (for example array parameters), convert handles with <code>asFixedArity()</code> in <code>MethodHandleCacheUtil</code> to prevent JVM <code>WrongMethodTypeException</code> during argument spread.
      </Callout>
    </article>
  );
};
