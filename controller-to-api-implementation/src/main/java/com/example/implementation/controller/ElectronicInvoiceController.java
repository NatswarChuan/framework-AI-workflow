package com.example.implementation.controller;

import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.ElectronicInvoice;

/**
 * Dynamic proxy REST controller for {@link ElectronicInvoice} entities.
 *
 * <p>Auto-generates enterprise endpoints at {@code /api/v1/electronic-invoices}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface ElectronicInvoiceController extends AutoApiController<ElectronicInvoice> {
}

