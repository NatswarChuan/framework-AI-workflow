package com.novamart.ecommerce.service.impl;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.helper.SalesAnalyticsHelper;
import com.novamart.ecommerce.service.SalesAnalyticsService;
import io.github.natswarchuan.core.annotation.AutoCacheEvict;
import io.github.natswarchuan.core.annotation.AutoCacheable;
import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.annotation.TargetDatabasePlatform;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.constant.DatabasePlatformConstant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Non-final, @Lazy service routing category sales analytics to REPLICA with @AutoCacheable.
 */
@Slf4j
@Lazy
@Service(NovaFieldConstant.BEAN_SALES_ANALYTICS_SERVICE)
@TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SalesAnalyticsServiceImpl implements SalesAnalyticsService {

  private final SalesAnalyticsHelper salesAnalyticsHelper;

  /**
   * {@inheritDoc}
   */
  @Override
  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  @TargetDatabasePlatform(
      platform = DatabasePlatformConstant.PLATFORM_H2,
      cluster = DatabasePlatformConstant.CLUSTER_REPLICA,
      readOnly = true)
  @AutoCacheable(
      value = {NovaFieldConstant.CACHE_SALES_ANALYTICS},
      key = NovaFieldConstant.SPEL_CACHE_CATEGORY_KEY)
  public CategorySalesAnalyticsDto summarizeCategorySales(final String category) {
    return salesAnalyticsHelper.computeCategoryAnalytics(category);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  @AutoCacheEvict(value = {NovaFieldConstant.CACHE_SALES_ANALYTICS}, allEntries = true)
  public void evictCategorySalesCache() {
    log.info(NovaLogConstant.START_EVICT_SALES_CACHE);
    log.info(NovaLogConstant.FINISH_EVICT_SALES_CACHE);
  }
}
