package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;

/**
 * Thrown with HTTP 400 Bad Request when AI or third-party integration inputs are blank.
 */
public class InvalidIntegrationInputException extends BaseBusinessException {

  /**
   * Constructs an invalid integration input business exception.
   *
   * @param message descriptive validation error message
   */
  public InvalidIntegrationInputException(final String message) {
    super(StandardHttpStatus.BAD_REQUEST, NovaErrorConstant.CODE_INVALID_INTEGRATION_INPUT, message);
  }
}
