package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;

/**
 * Thrown with HTTP 409 Conflict when requested reservation quantity exceeds available stock.
 */
public class InsufficientStockException extends BaseBusinessException {

  /**
   * Constructs an insufficient stock exception with SKU and quantity details.
   *
   * @param sku stock SKU identifier
   * @param requested requested quantity
   * @param available currently available quantity
   */
  public InsufficientStockException(
      final String sku, final Integer requested, final Integer available) {
    super(
        StandardHttpStatus.CONFLICT,
        NovaErrorConstant.CODE_INSUFFICIENT_STOCK,
        String.format(NovaErrorConstant.MSG_INSUFFICIENT_STOCK, sku, requested, available));
  }
}
