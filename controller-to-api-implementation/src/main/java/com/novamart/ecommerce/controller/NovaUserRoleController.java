package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.NovaUserRole;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Admin management controller for dynamic DB-RBAC NovaUserRole assignments (/api/v1/nova-user-roles).
 */
@AutoRestController
public interface NovaUserRoleController extends AutoApiController<NovaUserRole> {}
