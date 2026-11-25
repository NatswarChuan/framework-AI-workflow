package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;
import java.util.UUID;

/**
 * Thrown with HTTP 404 Not Found when a requested storefront product does not exist.
 */
public class ProductCatalogNotFoundException extends BaseBusinessException {

  /**
   * Constructs a product-not-found business exception.
   *
   * @param productId missing product UUID
   */
  public ProductCatalogNotFoundException(final UUID productId) {
    super(
        StandardHttpStatus.NOT_FOUND,
        NovaErrorConstant.CODE_PRODUCT_NOT_FOUND,
        String.format(NovaErrorConstant.MSG_PRODUCT_NOT_FOUND, productId));
  }
}
