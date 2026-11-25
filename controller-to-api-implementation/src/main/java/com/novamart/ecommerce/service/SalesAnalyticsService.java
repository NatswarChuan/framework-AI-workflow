package com.novamart.ecommerce.service;

import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;

/**
 * Service contract for read-replica offloaded and L1-cached category sales analytics.
 */
public interface SalesAnalyticsService {

  /**
   * Computes pricing and inventory analytics for a product category on the REPLICA datasource.
   *
   * @param category product category code
   * @return aggregated CategorySalesAnalyticsDto
   */
  CategorySalesAnalyticsDto summarizeCategorySales(String category);

  /**
   * Evicts all cached category sales analytics snapshots.
   */
  void evictCategorySalesCache();
}
