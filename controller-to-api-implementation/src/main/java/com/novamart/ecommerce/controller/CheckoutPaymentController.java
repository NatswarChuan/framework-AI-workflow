package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.CheckoutPayment;
import io.github.natswarchuan.common.constant.AopConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.Idempotent;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Idempotent payment controller guarding against duplicate payment creation via X-Idempotency-Key.
 */
@AutoRestController
@Idempotent(
    headerName = HttpHeaderConstant.HEADER_IDEMPOTENCY_KEY,
    ttlSeconds = AopConstant.SECONDS_PER_DAY)
public interface CheckoutPaymentController extends AutoApiController<CheckoutPayment> {}
