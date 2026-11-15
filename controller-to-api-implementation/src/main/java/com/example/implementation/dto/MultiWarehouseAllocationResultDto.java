package com.example.implementation.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object encapsulating the outcome of multi-warehouse inventory allocation.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class MultiWarehouseAllocationResultDto {

  private String orderReference;
  private String productSkuCode;
  private Integer requestedQuantity;
  private Integer allocatedQuantity;
  private String allocationStatus;
  private List<WarehouseStockAllocationItemDto> warehouseAllocations;
}

