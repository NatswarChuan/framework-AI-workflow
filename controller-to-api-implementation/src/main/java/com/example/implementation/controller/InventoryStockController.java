package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.InventoryStock;

/**
 * Dynamic proxy REST controller for {@link InventoryStock} entities.
 *
 * <p>Auto-generates enterprise endpoints at {@code /api/v1/inventory-stocks}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface InventoryStockController extends AutoApiController<InventoryStock> {
}

