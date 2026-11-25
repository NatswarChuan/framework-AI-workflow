package com.novamart.ecommerce.service.impl;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.StockReservationReceiptDto;
import com.novamart.ecommerce.entity.WarehouseStock;
import com.novamart.ecommerce.helper.StockReservationHelper;
import com.novamart.ecommerce.service.StockReservationService;
import io.github.natswarchuan.module.lock.annotation.DistributedLock;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Non-final, @Lazy service implementation for atomic @DistributedLock flash-sale stock reservation.
 */
@Lazy
@Service(NovaFieldConstant.BEAN_STOCK_RESERVATION_SERVICE)
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class StockReservationServiceImpl implements StockReservationService {

  private final StockReservationHelper stockReservationHelper;

  /**
   * {@inheritDoc}
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  @DistributedLock(
      key = NovaFieldConstant.SPEL_LOCK_STOCK_SKU,
      waitTimeMs = NovaNumericConstant.LOCK_WAIT_TIME_MS,
      leaseTimeMs = NovaNumericConstant.LOCK_LEASE_TIME_MS)
  public StockReservationReceiptDto reserveStock(final String sku, final Integer quantity) {
    stockReservationHelper.validateReservationInput(sku, quantity);
    final WarehouseStock stock = stockReservationHelper.loadStockOrThrow(sku);
    return stockReservationHelper.deductAndBuildReceipt(stock, quantity);
  }
}
