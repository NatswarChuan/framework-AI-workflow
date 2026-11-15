import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const VirtualThreadsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="virtual-threads"
        currentLang={currentLang}
        badges={[
          { label: 'Java 21 Virtual Threads', tone: 'emerald' },
          { label: '@RateLimit · @EntityCircuitBreaker', tone: 'amber' },
          { label: 'TransactionalOutboxHelper', tone: 'blue' },
        ]}
      />

      <h2 id="vt-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        High-concurrency throughput relies on Java 21 virtual threads (<code>spring.threads.virtual.enabled: true</code>), Resilience4j traffic protection (<code>@RateLimit</code>, <code>@EntityCircuitBreaker</code>, <code>@EntityRetry</code>), HTTP conditional caching (<code>@HttpCacheable</code>, <code>@AutoCacheable</code>, <code>@AutoCacheEvict</code>), and reliable event delivery via <code>TransactionalOutboxHelper</code> and <code>OutboxEventDispatcherProvider</code>.
      </p>

      <h2 id="vt-config" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'vt-yml',
            label: 'application.yml',
            language: 'yaml',
            fileName: 'src/main/resources/application.yml',
            highlightLines: [2, 3, 4, 12, 13, 14, 15],
            code: `spring:
  threads:
    virtual:
      enabled: true
  datasource:
    hikari:
      maximum-pool-size: 30
      minimum-idle: 10
      connection-timeout: 15000

app:
  framework:
    cache:
      type: caffeine # or redis
      caffeine:
        initial-capacity: 100
        maximum-size: 5000
        expire-after-write-minutes: 10`,
          },
          {
            id: 'outbox-java',
            label: 'Outbox Dispatcher SPI',
            language: 'java',
            fileName: 'messaging/KafkaOutboxDispatcher.java',
            highlightLines: [2, 5],
            code: `@AutoComponent
public final class KafkaOutboxDispatcher implements OutboxEventDispatcherProvider {

  @Override
  public boolean dispatch(final OutboxEvent event, final Map<String, String> headers) {
    // Publish outbox record to Kafka topic using injected KafkaTemplate
    return true;
  }
}`,
          },
        ]}
      />

      <h2 id="vt-metrics" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Resilience / Performance Mechanism</th>
              <th>Micrometer Gauge / Counter</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>@EntityCircuitBreaker</code></td>
              <td><code>nwvmc.resilience.circuitbreaker.state</code></td>
              <td>Exposes numeric state transitions: <code>0=CLOSED</code>, <code>1=HALF_OPEN</code>, <code>2=OPEN</code></td>
            </tr>
            <tr>
              <td><code>@RateLimit</code></td>
              <td><code>nwvmc.ratelimit.rejected.total</code></td>
              <td>Counts excess requests rejected prior to service/DB access</td>
            </tr>
            <tr>
              <td><code>@HttpCacheable</code></td>
              <td><code>nwvmc.cache.http.requests</code></td>
              <td>Tracks HTTP ETag / response cache <code>HIT</code> vs <code>MISS</code> counts</td>
            </tr>
            <tr>
              <td><code>TransactionalOutboxHelper</code></td>
              <td><code>nwvmc.outbox.pending.events</code> &amp; <code>nwvmc.outbox.dispatch.duration</code></td>
              <td>Monitors asynchronous broker relay backlog and dispatch latency</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="warning" currentLang={currentLang}>
        Keep JPA Open Session In View disabled (<code>spring.jpa.open-in-view: false</code>) so virtual threads release HikariCP JDBC connections immediately after repository/service transactions finish rather than pinning connections during JSON serialization.
      </Callout>
    </article>
  );
};
