package com.novamart.ecommerce.service;

import com.novamart.ecommerce.dto.StockReservationReceiptDto;

/**
 * Service contract for atomic flash-sale warehouse inventory reservation.
 */
public interface StockReservationService {

  /**
   * Acquires a SKU-level distributed lock and reserves the requested stock quantity atomically.
   *
   * @param sku stock SKU code
   * @param quantity number of units to reserve
   * @return confirmation receipt with updated stock balances
   */
  StockReservationReceiptDto reserveStock(String sku, Integer quantity);
}
