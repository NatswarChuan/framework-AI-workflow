import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE6_CONTENT } from '../data/pages/stage6Content';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const VirtualThreadsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="virtual-threads"
        currentLang={currentLang}
      />

      <h2 id="vt-goal" className="section-heading">
        {pickText(STAGE6_CONTENT.vtH2Goal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE6_CONTENT.vtGoalBody} currentLang={currentLang} />
      </p>

      <h2 id="vt-config" className="section-heading">
        {pickText(STAGE6_CONTENT.vtH2Config, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="yaml"
        fileName="src/main/resources/application.yml"
        highlightLines={[2, 3, 4, 12, 13, 14, 15]}
        code={`spring:
  threads:
    virtual:
      enabled: true
  datasource:
    hikari:
      maximum-pool-size: 30
      minimum-idle: 10
      connection-timeout: 20000

app:
  framework:
    cache:
      type: caffeine # or redis
      caffeine:
        initial-capacity: 100
        maximum-size: 5000
        expire-after-write-minutes: 10`}
      />

      <Callout type="warning" currentLang={currentLang}>
        <RichDocText text={STAGE6_CONTENT.vtPinningWarn} currentLang={currentLang} />
      </Callout>

      <h2 id="vt-impl" className="section-heading">
        {pickText(STAGE6_CONTENT.vtH2Impl, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'vt-resilience-ctrl',
            label: 'ProductCatalogReadOnlyController.java (Resilience + ETag)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ProductCatalogReadOnlyController.java',
            highlightLines: [19, 20, 21, 22, 25, 26, 27, 28],
            code: `package com.example.implementation.controller;

import com.example.implementation.dto.ProductReadDto;
import com.example.implementation.entity.ProductCatalog;
import com.example.implementation.helper.ProductCatalogShowcaseHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.AutoVariable;
import io.github.natswarchuan.core.annotation.EntityCircuitBreaker;
import io.github.natswarchuan.core.annotation.EntityRetry;
import io.github.natswarchuan.core.annotation.RateLimit;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoReadApi;
import io.github.natswarchuan.module.cache.http.annotation.HttpCacheable;
import java.util.UUID;
import org.springframework.http.ResponseEntity;

@AutoRestController(basePath = "/api/v1/readonly/product-catalogs", readDto = ProductReadDto.class)
@RateLimit(requests = 120, windowSeconds = 60, partitionKey = "IP")
@EntityCircuitBreaker(name = "productCatalogReadOnly", failureRateThreshold = 50.0f, slidingWindowSize = 20, waitDurationInOpenStateSeconds = 10)
@EntityRetry(name = "productCatalogReadOnly", maxAttempts = 3, waitDurationMs = 200L)
public interface ProductCatalogReadOnlyController extends AutoReadApi<ProductCatalog> {

  @AutoGet("/cached/{id}")
  @HttpCacheable(maxAgeSeconds = 60, isPrivate = true, mustRevalidate = true, generateETag = true)
  @ServiceOverride(targetBean = ProductCatalogShowcaseHelper.class, methodName = "getCachedProductById")
  ResponseEntity<ApiResponse<ProductReadDto>> getCachedProductById(@AutoVariable("id") UUID id);
}`,
          },
          {
            id: 'vt-outbox-spi',
            label: 'MarketplaceOutboxEventDispatcherProvider.java (Outbox SPI)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/provider/MarketplaceOutboxEventDispatcherProvider.java',
            highlightLines: [12, 16],
            code: `package com.example.implementation.provider;

import io.github.natswarchuan.module.event.OutboxEvent;
import io.github.natswarchuan.module.event.provider.OutboxEventDispatcherProvider;
import java.util.Map;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public final class MarketplaceOutboxEventDispatcherProvider implements OutboxEventDispatcherProvider {

  @Override
  public boolean dispatch(final OutboxEvent event, final Map<String, String> headers) {
    if (Objects.isNull(event)) {
      return false;
    }
    // Forward committed outbox event + W3C trace headers to Kafka, RabbitMQ, or SQS
    log.info("Relaying committed outbox event: aggregate={} event={}", event.getAggregateType(), event.getEventType());
    return true;
  }
}`,
          },
          {
            id: 'vt-curl',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '10-verify-ratelimit-and-http-cache.sh',
            code: `# 1. Inspect live X-RateLimit-Remaining header on the storefront read-only controller
curl -i "http://localhost:8080/api/v1/readonly/product-catalogs/cached/$PRODUCT_ID" \\
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 2. Conditional GET with If-None-Match returns HTTP 304 Not Modified with 0-byte body!
curl -i "http://localhost:8080/api/v1/readonly/product-catalogs/cached/$PRODUCT_ID" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "If-None-Match: *"`,
          },
        ]}
      />

      <h2 id="vt-metrics" className="section-heading">
        {pickText(STAGE6_CONTENT.vtH2Metrics, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE6_CONTENT.vtThMech, currentLang)}</th>
              <th>{pickText(STAGE6_CONTENT.vtThMetric, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colDescription, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@EntityCircuitBreaker</code></td>
              <td><code>nwvmc.resilience.circuitbreaker.state</code></td>
              <td><RichDocText text={STAGE6_CONTENT.vtRowCb} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>@RateLimit</code></td>
              <td><code>nwvmc.ratelimit.rejected.total</code></td>
              <td><RichDocText text={STAGE6_CONTENT.vtRowRl} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>@HttpCacheable</code></td>
              <td><code>nwvmc.cache.http.requests</code></td>
              <td><RichDocText text={STAGE6_CONTENT.vtRowHttp} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>TransactionalOutboxHelper</code></td>
              <td><code>nwvmc.outbox.pending.events</code> &amp; <code>nwvmc.outbox.dispatch.duration</code></td>
              <td><RichDocText text={STAGE6_CONTENT.vtRowOutbox} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="vt-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="warning" currentLang={currentLang}>
        <RichDocText text={STAGE6_CONTENT.vtCalloutWarn} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
