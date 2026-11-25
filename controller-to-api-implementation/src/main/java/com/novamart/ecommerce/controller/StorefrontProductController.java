package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.helper.SalesAnalyticsDispatchHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoPost;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoApiController;
import io.github.natswarchuan.module.datasource.annotation.TargetDataSource;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Auto-generated full CRUD controller for StorefrontProduct plus REPLICA-routed sales analytics.
 * Mounted without readDto so custom analytics DTO responses are never stripped by projection.
 */
@AutoRestController
public interface StorefrontProductController extends AutoApiController<StorefrontProduct> {

  /**
   * Computes L1-cached category sales analytics from the REPLICA read pool.
   *
   * @param category product category code
   * @return ApiResponse wrapping CategorySalesAnalyticsDto
   */
  @AutoGet(NovaPathConstant.SUB_SALES_ANALYTICS_BY_CATEGORY)
  @TargetDataSource(DataSourceConstant.DATASOURCE_REPLICA)
  @ServiceOverride(
      targetBean = SalesAnalyticsDispatchHelper.class,
      methodName = NovaFieldConstant.METHOD_GET_CATEGORY_SALES_ANALYTICS)
  ApiResponse<CategorySalesAnalyticsDto> getCategorySalesAnalytics(
      @PathVariable(NovaFieldConstant.PARAM_CATEGORY) String category);

  /**
   * Evicts all cached category sales analytics snapshots.
   *
   * @return ApiResponse naming the evicted cache region
   */
  @AutoPost(NovaPathConstant.SUB_SALES_ANALYTICS_EVICT)
  @ServiceOverride(
      targetBean = SalesAnalyticsDispatchHelper.class,
      methodName = NovaFieldConstant.METHOD_EVICT_CATEGORY_SALES_CACHE)
  ApiResponse<String> evictCategorySalesCache();
}
