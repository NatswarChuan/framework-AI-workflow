package com.example.implementation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data transfer object representing stock reserved at an individual warehouse node.
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
public class WarehouseStockAllocationItemDto {

  private String warehouseCode;
  private String stockSkuCode;
  private Integer allocatedUnits;
}

