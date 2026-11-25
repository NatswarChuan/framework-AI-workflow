package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.NovaRole;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Admin management controller for dynamic DB-RBAC NovaRole entries (/api/v1/nova-roles).
 */
@AutoRestController
public interface NovaRoleController extends AutoApiController<NovaRole> {}
