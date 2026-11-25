package com.novamart.ecommerce.dto;

import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Read-replica sales analytics DTO summarizing pricing metrics for a product category.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class CategorySalesAnalyticsDto {

  private String categoryCode;
  private long activeProductCount;
  private BigDecimal averageRetailPrice;
  private BigDecimal minRetailPrice;
  private BigDecimal maxRetailPrice;
  private String servedFromDataSource;
  private Instant computedAtUtc;
}
