import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { RichDocText } from '../components/RichDocText';
import { STAGE8_CONTENT } from '../data/pages/stage8Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const CustomizersAndIntegrationPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="customizers"
        currentLang={currentLang}
      />

      <h2 id="customizers-goal" className="section-heading">
        {pickText(STAGE8_CONTENT.cuH2Goal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE8_CONTENT.cuGoalBody} currentLang={currentLang} />
      </p>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE8_CONTENT.cuSpiDistinction} currentLang={currentLang} />
      </Callout>

      <h2 id="customizers-table" className="section-heading">
        {pickText(STAGE8_CONTENT.cuH2Table, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE8_CONTENT.cuThSpi, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.cuThDto, currentLang)}</th>
              <th>{pickText(STAGE8_CONTENT.cuThScope, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>SpringCoreCustomizer</code></td>
              <td><code>CoreCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowCore} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>PlatformAiCustomizer</code></td>
              <td><code>PlatformAiCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowAi} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>SecurityIdentityCustomizer</code></td>
              <td><code>SecurityCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowSec} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>DataAccessCustomizer</code></td>
              <td><code>DataCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowData} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>SpringCloudCustomizer</code></td>
              <td><code>CloudCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowCloud} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>MessagingIntegrationCustomizer</code></td>
              <td><code>MessagingCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowMsg} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>ArchitectureExtensionCustomizer</code></td>
              <td><code>ArchitectureCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowArch} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>StorageCustomizer</code></td>
              <td><code>StorageCustomizerContextDto</code></td>
              <td><RichDocText text={STAGE8_CONTENT.cuRowStorage} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="customizers-restclient" className="section-heading">
        {pickText(STAGE8_CONTENT.cuH2RestClient, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'security-customizer',
            label: 'EnterpriseSecurityIdentityCustomizer.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/customizer/EnterpriseSecurityIdentityCustomizer.java',
            highlightLines: [12, 16, 26],
            code: `package com.example.implementation.customizer;

import io.github.natswarchuan.customization.customizer.SecurityIdentityCustomizer;
import io.github.natswarchuan.customization.dto.SecurityAuthorizationRequestDto;
import io.github.natswarchuan.customization.dto.SecurityCustomizerContextDto;
import java.util.Set;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.stereotype.Component;

@Component
public final class EnterpriseSecurityIdentityCustomizer implements SecurityIdentityCustomizer {

  @Override
  public void customizeSecurityFilterChain(final Object http) throws Exception {
    if (http instanceof HttpSecurity httpSecurity) {
      httpSecurity.requestCache(RequestCacheConfigurer::disable);
    }
  }

  @Override
  public void customizeSecurityIdentityContext(final SecurityCustomizerContextDto contextDto) {
    // Enrich identity diagnostics before downstream authorization hooks execute
  }

  @Override
  public Set<String> augmentSubjectAuthorities(final String subject, final Set<String> currentAuthorities) {
    return currentAuthorities;
  }

  @Override
  public Boolean evaluateCustomAuthorization(final SecurityAuthorizationRequestDto requestDto) {
    return null; // Return TRUE (allow), FALSE (deny), or null (delegate to RBAC/DB policies)
  }
}`,
          },
          {
            id: 'restclient-helper',
            label: 'MarketplacePartnerGatewayHelper.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/helper/MarketplacePartnerGatewayHelper.java',
            highlightLines: [14, 18, 25, 26],
            code: `package com.example.implementation.helper;

import com.example.implementation.dto.PartnerRateCheckResultDto;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallRequestDto;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto;
import io.github.natswarchuan.module.integration.helper.ThirdPartyRestClientHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public final class MarketplacePartnerGatewayHelper {

  // ObjectProvider defers lookup until framework AutoConfiguration finishes registering @AutoComponent beans
  private final ObjectProvider<ThirdPartyRestClientHelper> restClientProvider;

  public PartnerRateCheckResultDto checkPartnerEndpoint(final String serviceName, final String targetUrl) {
    final ThirdPartyCallRequestDto request = ThirdPartyCallRequestDto.builder()
        .serviceName(serviceName)
        .targetUrl(targetUrl)
        .httpMethod("GET")
        .build();
    // Automatically propagates X-Request-ID, W3C traceparent, and tracestate from SLF4J MDC
    final ThirdPartyCallResponseDto response = restClientProvider.getObject().executeOutboundCall(request);
    final boolean healthy = response.getStatusCode() >= 200 && response.getStatusCode() < 300;
    return PartnerRateCheckResultDto.fromOutboundSummary(response, response.getResponseBody(), healthy);
  }
}`,
          },
        ]}
      />

      <h2 id="customizers-guardrails" className="section-heading">
        {formatStepHeading(4, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE8_CONTENT.cuCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
