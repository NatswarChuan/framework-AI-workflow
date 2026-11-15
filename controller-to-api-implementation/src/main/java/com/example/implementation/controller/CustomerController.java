package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Customer;

/**
 * Dynamic proxy REST controller for {@link Customer} entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/customers}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface CustomerController extends AutoApiController<Customer> {
}
