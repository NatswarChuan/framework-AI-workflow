package com.example.implementation.service.helper;

import com.example.implementation.constant.AdvancedBusinessConstant;
import com.example.implementation.dto.MultiWarehouseAllocationRequestDto;
import com.example.implementation.dto.MultiWarehouseAllocationResultDto;
import com.example.implementation.dto.WarehouseStockAllocationItemDto;
import com.example.implementation.entity.InventoryStock;
import io.github.natswarchuan.common.constant.LogConstant;
import io.github.natswarchuan.exception.BaseBusinessException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Helper component executing distributed multi-warehouse stock allocation with cascade atomic rollback.
 *
 * <p>Enforces all-or-nothing commitment: if aggregate stock across preferred warehouses cannot
 * fully satisfy the requested quantity, all partial commitments are cancelled immediately with zero orphaned locks.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-07
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class MultiWarehouseStockAllocationHelper {

  private final EntityManager entityManager;

  /**
   * Executes atomic multi-warehouse stock reservation.
   *
   * @param request multi-warehouse allocation request payload
   * @return successful {@link MultiWarehouseAllocationResultDto}
   * @throws BaseBusinessException if total aggregate stock across warehouses is insufficient
   */
  public MultiWarehouseAllocationResultDto allocateMultiWarehouseStockAtomic(
      final MultiWarehouseAllocationRequestDto request) {
    Objects.requireNonNull(request);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_ALLOCATE_MULTI_WAREHOUSE_STOCK_ATOMI, request.getOrderReference());

    final List<InventoryStock> lockedStockList = new ArrayList<>();
    int aggregateAvailable = 0;

    for (final String whCode : request.getPreferredWarehouseCodes()) {
      final InventoryStock stock = findAndLockWarehouseStock(request.getProductSkuCode(), whCode);
      if (Objects.nonNull(stock)) {
        lockedStockList.add(stock);
        aggregateAvailable = aggregateAvailable + stock.getAvailableQuantity();
      }
    }

    final boolean isInsufficient = aggregateAvailable < request.getRequestedQuantity();
    if (isInsufficient) {
      throw new BaseBusinessException(
          HttpStatus.BAD_REQUEST,
          AdvancedBusinessConstant.ERR_INSUFFICIENT_MULTI_WAREHOUSE_STOCK,
          AdvancedBusinessConstant.MSG_INSUFFICIENT_MULTI_WAREHOUSE_STOCK
      );
    }

    int remainingToAllocate = request.getRequestedQuantity();
    final List<WarehouseStockAllocationItemDto> allocationItems = new ArrayList<>();

    for (final InventoryStock stock : lockedStockList) {
      if (remainingToAllocate <= 0) {
        break;
      }

      final int available = stock.getAvailableQuantity();
      int allocationFromWh = available;
      if (available > remainingToAllocate) {
        allocationFromWh = remainingToAllocate;
      }

      stock.setAvailableQuantity(available - allocationFromWh);
      stock.setReservedQuantity(stock.getReservedQuantity() + allocationFromWh);
      entityManager.merge(stock);

      final WarehouseStockAllocationItemDto item = WarehouseStockAllocationItemDto.builder()
          .warehouseCode(stock.getWarehouseCode())
          .stockSkuCode(stock.getStockSkuCode())
          .allocatedUnits(allocationFromWh)
          .build();
      allocationItems.add(item);

      remainingToAllocate = remainingToAllocate - allocationFromWh;
    }

    final MultiWarehouseAllocationResultDto result = MultiWarehouseAllocationResultDto.builder()
        .orderReference(request.getOrderReference())
        .productSkuCode(request.getProductSkuCode())
        .requestedQuantity(request.getRequestedQuantity())
        .allocatedQuantity(request.getRequestedQuantity())
        .allocationStatus(AdvancedBusinessConstant.STATUS_FULLY_ALLOCATED)
        .warehouseAllocations(allocationItems)
        .build();

    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_ALLOCATE_MULTI_WAREHOUSE_STOCK_ATOMI);
    return result;
  }

  /**
   * Finds and locks inventory stock record for a given product and warehouse location.
   *
   * @param productSkuCode product SKU code
   * @param warehouseCode target warehouse location code
   * @return locked {@link InventoryStock} instance, or null if not found
   */
  public InventoryStock findAndLockWarehouseStock(final String productSkuCode, final String warehouseCode) {
    Objects.requireNonNull(productSkuCode);
    Objects.requireNonNull(warehouseCode);
    log.info(LogConstant.START_METHOD_WITH_PARAM, AdvancedBusinessConstant.STR_FIND_AND_LOCK_WAREHOUSE_STOCK, warehouseCode);

    final TypedQuery<InventoryStock> query = entityManager.createQuery(
        AdvancedBusinessConstant.STR_SELECT_S_FROM_INVENTORY_STOCK_S_WHER
            + AdvancedBusinessConstant.STR_AND_S_WAREHOUSE_CODE_WH_CODE,
        InventoryStock.class
    );
    query.setParameter(AdvancedBusinessConstant.STR_PRODUCT_SKU, productSkuCode);
    query.setParameter(AdvancedBusinessConstant.STR_WH_CODE, warehouseCode);
    query.setLockMode(LockModeType.PESSIMISTIC_WRITE);

    final List<InventoryStock> results = query.getResultList();
    if (results.isEmpty()) {
      log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_FIND_AND_LOCK_WAREHOUSE_STOCK);
      return null;
    }

    final InventoryStock found = results.get(0);
    log.info(LogConstant.FINISH_METHOD, AdvancedBusinessConstant.STR_FIND_AND_LOCK_WAREHOUSE_STOCK);
    return found;
  }
}

