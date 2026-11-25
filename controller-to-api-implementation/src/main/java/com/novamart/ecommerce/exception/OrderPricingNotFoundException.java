package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.UUID;

/**
 * Thrown with HTTP 404 Not Found when an order cannot be located for pricing quote calculation.
 */
public class OrderPricingNotFoundException extends BaseBusinessException {

  /**
   * Constructs an order-pricing-not-found business exception.
   *
   * @param orderId missing order UUID
   */
  public OrderPricingNotFoundException(final UUID orderId) {
    super(
        StandardHttpStatus.NOT_FOUND,
        NovaErrorConstant.CODE_ORDER_NOT_FOUND,
        String.format(NovaErrorConstant.MSG_ORDER_NOT_FOUND, orderId));
  }
}
