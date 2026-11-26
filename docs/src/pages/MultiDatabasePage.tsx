import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE4_CONTENT } from '../data/pages/stage4Content';

interface PageProps {
  currentLang: SupportedLanguage;
  theme?: 'dark' | 'light';
}

const ROUTING_FLOW = `flowchart TD
  Call["Method Invocation"] --> RouteType{"Invocation Path?"}
  RouteType -->|Custom Bean / @TargetDataSource| Aspect["DataSourceRoutingAspect"]
  Aspect --> HasAnn{"Explicit @TargetDataSource?"}
  HasAnn -->|Yes| Key["Use Explicit Datasource Key"]
  HasAnn -->|No| Primary["DataSourceConstant.DATASOURCE_PRIMARY"]
  RouteType -->|Dynamic Proxy / readOnly Tx| Resolver["DataSourceRoutingResolverHelper"]
  Resolver --> Replica["DataSourceConstant.DATASOURCE_REPLICA"]
  Key --> Holder[("DataSourceContextHolder\nDynamicRoutingDataSource")]
  Primary --> Holder
  Replica --> Holder`;

export const MultiDatabasePage: React.FC<PageProps> = ({ currentLang, theme = 'dark' }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="multi-database"
        currentLang={currentLang}
      />

      <h2 id="multidb-goal" className="section-heading">
        {pickText(STAGE4_CONTENT.mdbH2Goal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE4_CONTENT.mdbGoalBody} currentLang={currentLang} />
      </p>

      <details className="under-the-hood-details">
        <summary className="under-the-hood-summary">
          <span>{pickText(STAGE4_CONTENT.mdbUnderHoodSummary, currentLang)}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="under-the-hood-body">
          <MermaidDiagram
            theme={theme}
            currentLang={currentLang}
            caption={pickText(STAGE4_CONTENT.mdbMermaidCaption, currentLang)}
            chart={ROUTING_FLOW}
          />
        </div>
      </details>

      <h2 id="multidb-config" className="section-heading">
        {pickText(STAGE4_CONTENT.mdbH2Config, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="config/RoutingDataSourceConfig.java"
        highlightLines={[7, 10, 11]}
        code={`@Configuration
public class RoutingDataSourceConfig {

  @Bean
  @Primary
  public DataSource dataSource(
      final MultiPlatformDataSourceRegistryHelper registryHelper,
      @Qualifier("primaryDataSource") final DataSource primaryDataSource,
      @Qualifier("replicaDataSource") final DataSource replicaDataSource) {
    registryHelper.registerCluster(DataSourceConstant.DATASOURCE_PRIMARY, primaryDataSource, "POSTGRESQL", false);
    registryHelper.registerCluster(DataSourceConstant.DATASOURCE_REPLICA, replicaDataSource, "POSTGRESQL", true);
    final DynamicRoutingDataSource routing = new DynamicRoutingDataSource();
    routing.setTargetDataSources(Map.of(
        DataSourceConstant.DATASOURCE_PRIMARY, primaryDataSource,
        DataSourceConstant.DATASOURCE_REPLICA, replicaDataSource));
    routing.setDefaultTargetDataSource(primaryDataSource);
    return routing;
  }
}`}
      />

      <h2 id="multidb-impl" className="section-heading">
        {pickText(STAGE4_CONTENT.mdbH2Impl, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'target-ds-ctrl',
            label: 'ProductCatalogController.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ProductCatalogController.java',
            highlightLines: [18, 19, 20, 21, 22],
            code: `package com.example.implementation.controller;

import com.example.implementation.dto.MarketplaceAnalyticsSummaryDto;
import com.example.implementation.entity.ProductCatalog;
import com.example.implementation.service.MarketplaceAnalyticsService;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoApiController;
import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import org.springframework.web.bind.annotation.PathVariable;

@AutoRestController
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {

  @AutoGet("/analytics/{category}")
  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  @ServiceOverride(targetBean = MarketplaceAnalyticsService.class, methodName = "summarizeCatalogByCategory")
  ApiResponse<MarketplaceAnalyticsSummaryDto> getCategoryAnalytics(@PathVariable("category") String category);
}`,
          },
          {
            id: 'target-ds-impl',
            label: 'MarketplaceAnalyticsServiceImpl.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/service/impl/MarketplaceAnalyticsServiceImpl.java',
            highlightLines: [16, 17, 18, 25, 26, 27, 28, 36],
            code: `package com.example.implementation.service.impl;

import com.example.implementation.dto.MarketplaceAnalyticsSummaryDto;
import com.example.implementation.helper.MarketplaceAnalyticsHelper;
import com.example.implementation.service.MarketplaceAnalyticsService;
import io.github.natswarchuan.core.annotation.AutoCacheEvict;
import io.github.natswarchuan.core.annotation.AutoCacheable;
import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.annotation.TargetDatabasePlatform;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Lazy // Ensures framework AOP aspects register before proxy creation
@Service
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MarketplaceAnalyticsServiceImpl implements MarketplaceAnalyticsService {

  private final MarketplaceAnalyticsHelper analyticsHelper;

  @Override
  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  @TargetDatabasePlatform(platform = DatabasePlatformConstant.PLATFORM_H2, cluster = DatabasePlatformConstant.CLUSTER_REPLICA, readOnly = true)
  @AutoCacheable(value = "marketplaceCatalogAnalytics", key = "'CAT_' + #category")
  public MarketplaceAnalyticsSummaryDto summarizeCatalogByCategory(final String category) {
    return analyticsHelper.computeCategorySummary(category);
  }

  @Override
  @AutoCacheEvict(value = "marketplaceCatalogAnalytics", allEntries = true)
  public void evictCatalogAnalyticsCache() {
    // Evicts all cached category snapshots on catalog refresh
  }
}`,
          },
          {
            id: 'target-ds-interface',
            label: 'MarketplaceAnalyticsService.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/service/MarketplaceAnalyticsService.java',
            code: `package com.example.implementation.service;

import com.example.implementation.dto.MarketplaceAnalyticsSummaryDto;

public interface MarketplaceAnalyticsService {
  MarketplaceAnalyticsSummaryDto summarizeCatalogByCategory(String category);
  void evictCatalogAnalyticsCache();
}`,
          },
        ]}
      />

      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE4_CONTENT.mdbDistributedNote} currentLang={currentLang} />
      </Callout>

      <h2 id="multidb-verify" className="section-heading">
        {pickText(STAGE4_CONTENT.mdbH2Verify, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="bash"
        fileName="07-replica-analytics-and-health.sh"
        code={`# 1. Execute read-replica analytics (returns datasourceKey: "REPLICA"; 2nd call hits @AutoCacheable with same snapshotId!)
curl -s "http://localhost:8080/api/v1/product-catalogs/analytics/ELECTRONICS" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq

# 2. Inspect cluster health across registered datasources
curl -s "http://localhost:8080/api/v1/system/databases/health" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq`}
      />

      <h2 id="multidb-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="warning" currentLang={currentLang}>
        <RichDocText text={STAGE4_CONTENT.mdbCalloutWarn} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
