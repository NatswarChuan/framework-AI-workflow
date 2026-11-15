package com.example.implementation.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Enterprise DTO representing aggregated vendor revenue reports generated
 * via complex native SQL with CTE and joins.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class VendorRevenueSummaryDto {

  private String storeCode;
  private String storeName;
  private Long totalOrders;
  private BigDecimal totalRevenue;
  private BigDecimal averageOrderValue;
}

