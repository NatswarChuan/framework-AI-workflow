package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;

/**
 * Thrown with HTTP 404 Not Found when a warehouse stock record cannot be located by SKU.
 */
public class StockNotFoundException extends BaseBusinessException {

  /**
   * Constructs a stock-not-found business exception.
   *
   * @param sku missing stock SKU identifier
   */
  public StockNotFoundException(final String sku) {
    super(
        StandardHttpStatus.NOT_FOUND,
        NovaErrorConstant.CODE_STOCK_NOT_FOUND,
        String.format(NovaErrorConstant.MSG_STOCK_NOT_FOUND, sku));
  }
}
