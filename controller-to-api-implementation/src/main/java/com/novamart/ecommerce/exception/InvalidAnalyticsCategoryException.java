package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;

/**
 * Thrown with HTTP 400 Bad Request when an analytics category parameter is blank or null.
 */
public class InvalidAnalyticsCategoryException extends BaseBusinessException {

  /**
   * Constructs an invalid analytics category business exception.
   */
  public InvalidAnalyticsCategoryException() {
    super(
        StandardHttpStatus.BAD_REQUEST,
        NovaErrorConstant.CODE_INVALID_CATEGORY,
        NovaErrorConstant.MSG_CATEGORY_REQUIRED);
  }
}
