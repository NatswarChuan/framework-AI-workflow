package com.novamart.ecommerce.dto;

import com.novamart.ecommerce.entity.WarehouseStock;
import io.github.natswarchuan.common.util.UuidUtil;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Receipt DTO returned after atomically reserving warehouse inventory under a distributed lock.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class StockReservationReceiptDto {

  private UUID reservationId;
  private String sku;
  private String warehouseCode;
  private Integer requestedQuantity;
  private Integer remainingAvailableQuantity;
  private Integer totalReservedQuantity;

  /**
   * Builds a receipt DTO from the updated WarehouseStock entity and requested quantity.
   *
   * @param stock updated warehouse stock record
   * @param requestedQty quantity reserved in this operation
   * @return populated StockReservationReceiptDto, or null if stock is null
   */
  public static StockReservationReceiptDto fromStock(
      final WarehouseStock stock, final Integer requestedQty) {
    if (Objects.isNull(stock)) {
      return null;
    }
    return StockReservationReceiptDto.builder()
        .reservationId(UuidUtil.generateUuidV7())
        .sku(stock.getSku())
        .warehouseCode(stock.getWarehouseCode())
        .requestedQuantity(requestedQty)
        .remainingAvailableQuantity(stock.getAvailableQuantity())
        .totalReservedQuantity(stock.getReservedQuantity())
        .build();
  }

  /**
   * Creates a lightweight WarehouseStock snapshot representing post-reservation stock balances.
   *
   * @return detached WarehouseStock snapshot
   */
  public WarehouseStock toStockSnapshot() {
    return WarehouseStock.builder()
        .sku(sku)
        .warehouseCode(warehouseCode)
        .availableQuantity(remainingAvailableQuantity)
        .reservedQuantity(totalReservedQuantity)
        .build();
  }
}
