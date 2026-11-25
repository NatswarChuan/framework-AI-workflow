package com.novamart.ecommerce.exception;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.exception.BaseBusinessException;

/**
 * Thrown with HTTP 400 Bad Request when stock reservation parameters fail validation.
 */
public class InvalidReservationRequestException extends BaseBusinessException {

  /**
   * Constructs an invalid reservation request business exception.
   *
   * @param message descriptive validation failure reason
   */
  public InvalidReservationRequestException(final String message) {
    super(StandardHttpStatus.BAD_REQUEST, NovaErrorConstant.CODE_INVALID_RESERVATION, message);
  }
}
