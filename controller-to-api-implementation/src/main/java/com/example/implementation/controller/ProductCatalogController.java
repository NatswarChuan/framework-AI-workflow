package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.ProductCatalog;

/**
 * Dynamic proxy REST controller for {@link ProductCatalog} entities.
 *
 * <p>Auto-generates enterprise endpoints at {@code /api/v1/product-catalogs}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}

