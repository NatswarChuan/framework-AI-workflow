package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.CouponVoucher;

/**
 * Dynamic proxy REST controller for {@link CouponVoucher} entities.
 *
 * <p>Auto-generates enterprise endpoints at {@code /api/v1/coupon-vouchers}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface CouponVoucherController extends AutoApiController<CouponVoucher> {
}

