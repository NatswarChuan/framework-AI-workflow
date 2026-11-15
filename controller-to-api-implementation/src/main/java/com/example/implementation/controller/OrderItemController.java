package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.OrderItem;

/**
 * Dynamic proxy REST controller for {@link OrderItem} entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/order-items}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface OrderItemController extends AutoApiController<OrderItem> {
}
