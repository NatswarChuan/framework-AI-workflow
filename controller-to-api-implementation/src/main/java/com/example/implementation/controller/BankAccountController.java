package com.example.implementation.controller;

import com.example.implementation.entity.BankAccount;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Dynamic proxy REST controller for {@link BankAccount} entities in the FinTech Banking domain.
 * Auto-generates enterprise endpoints at {@code /api/v1/bank-accounts}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface BankAccountController extends AutoApiController<BankAccount> {
}

