package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.service.SalesAnalyticsService;
import io.github.natswarchuan.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;

/**
 * Dispatcher helper bridging StorefrontProductController analytics routes to @Lazy SalesAnalyticsService
 * via ObjectProvider so Spring creates AOP proxies after framework aspects are registered.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class SalesAnalyticsDispatchHelper {

  private final ObjectProvider<SalesAnalyticsService> salesAnalyticsServiceProvider;

  /**
   * Delegates category sales analytics computation to the REPLICA-routed cached service.
   *
   * @param category product category code
   * @return ApiResponse wrapping CategorySalesAnalyticsDto
   */
  public ApiResponse<CategorySalesAnalyticsDto> getCategorySalesAnalytics(final String category) {
    log.info(
        NovaLogConstant.START_SALES_ANALYTICS, category, NovaFieldConstant.CACHE_SALES_ANALYTICS);
    final CategorySalesAnalyticsDto summary =
        salesAnalyticsServiceProvider.getObject().summarizeCategorySales(category);
    log.info(NovaLogConstant.FINISH_SALES_ANALYTICS, category, summary.getActiveProductCount());
    return ApiResponse.success(summary);
  }

  /**
   * Delegates cache eviction to SalesAnalyticsService.
   *
   * @return ApiResponse confirming cache eviction
   */
  public ApiResponse<String> evictCategorySalesCache() {
    log.info(NovaLogConstant.START_EVICT_SALES_CACHE);
    salesAnalyticsServiceProvider.getObject().evictCategorySalesCache();
    log.info(NovaLogConstant.FINISH_EVICT_SALES_CACHE);
    return ApiResponse.success(NovaFieldConstant.CACHE_SALES_ANALYTICS);
  }
}
