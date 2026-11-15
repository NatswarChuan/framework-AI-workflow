import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const CustomizersAndIntegrationPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="customizers"
        currentLang={currentLang}
        badges={[
          { label: '8 Customizer SPIs', tone: 'purple' },
          { label: 'SpringEcosystemCustomizerRegistryHelper', tone: 'blue' },
          { label: 'ThirdPartyRestClientHelper', tone: 'emerald' },
        ]}
      />

      <h2 id="customizers-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        Application beans can hook into every infrastructure subsystem by implementing any of the 8 framework Customizer Service Provider Interfaces (SPIs) indexed by <code>SpringEcosystemCustomizerRegistryHelper</code> and inspectable at runtime via <code>CustomizerTelemetryApiController</code> (<code>GET /api/v1/system/customizers</code>).
      </p>

      <h2 id="customizers-table" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Customizer SPI Interface</th>
              <th>Context DTO</th>
              <th>Extension Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SpringCoreCustomizer</code></td>
              <td><code>CoreCustomizerContextDto</code></td>
              <td>Jackson serialization, web MVC hooks, executor tuning, message bundles</td>
            </tr>
            <tr>
              <td><code>PlatformAiCustomizer</code></td>
              <td><code>PlatformAiCustomizerContextDto</code></td>
              <td>LLM system prompt enrichment, AI metadata hooks, NL query preprocessors</td>
            </tr>
            <tr>
              <td><code>SecurityIdentityCustomizer</code></td>
              <td><code>SecurityCustomizerContextDto</code></td>
              <td>Custom JWT claim extraction, OAuth2 role mapping, tenant claim resolution</td>
            </tr>
            <tr>
              <td><code>DataAccessCustomizer</code></td>
              <td><code>DataCustomizerContextDto</code></td>
              <td>Hibernate dialect customization, query criteria predicates, audit enrichers</td>
            </tr>
            <tr>
              <td><code>SpringCloudCustomizer</code></td>
              <td><code>CloudCustomizerContextDto</code></td>
              <td>Distributed tracing tags, circuit breaker fallback policies, cloud discovery metadata</td>
            </tr>
            <tr>
              <td><code>MessagingIntegrationCustomizer</code></td>
              <td><code>MessagingCustomizerContextDto</code></td>
              <td>Outbox event serialization headers, webhook signing overrides, STOMP interceptors</td>
            </tr>
            <tr>
              <td><code>ArchitectureExtensionCustomizer</code></td>
              <td><code>ArchitectureCustomizerContextDto</code></td>
              <td>Domain boundary policies, custom proxy advice hooks, cross-cutting interceptors</td>
            </tr>
            <tr>
              <td><code>StorageCustomizer</code></td>
              <td><code>StorageCustomizerContextDto</code></td>
              <td>Upload validation hooks, virus scanning, custom key naming, pre-signed URL wrappers</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="customizers-restclient" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)} — <code>ThirdPartyRestClientHelper</code>
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'security-customizer',
            label: 'SPI Implementation',
            language: 'java',
            fileName: 'config/TenantSecurityCustomizer.java',
            highlightLines: [2],
            code: `@AutoComponent
public final class TenantSecurityCustomizer implements SecurityIdentityCustomizer {

  @Override
  public void customize(final SecurityCustomizerContextDto context) {
    // Register custom tenant claim resolver or OAuth2 attribute extractor
  }
}`,
          },
          {
            id: 'restclient-helper',
            label: 'ThirdPartyRestClientHelper',
            language: 'java',
            fileName: 'helper/PartnerGatewayHelper.java',
            code: `@AutoComponent
@RequiredArgsConstructor
public final class PartnerGatewayHelper {

  private final ThirdPartyRestClientHelper restClientHelper;

  public String fetchPartnerInventory(final String url) {
    // Automatically carries W3C traceparent and X-Request-ID from MDC
    return restClientHelper.getForObject(url, String.class);
  }
}`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        All outbound HTTP integrations use Spring Framework 6 <code>RestClient</code> configured in <code>RestClientConfig</code> rather than legacy blocking <code>RestTemplate</code> instances, maintaining virtual-thread friendliness and automatic W3C trace header forwarding.
      </Callout>
    </article>
  );
};
