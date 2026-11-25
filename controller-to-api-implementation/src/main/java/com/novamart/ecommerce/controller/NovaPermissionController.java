package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.NovaPermission;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Admin management controller for dynamic DB-RBAC NovaPermission entries (/api/v1/nova-permissions).
 */
@AutoRestController
public interface NovaPermissionController extends AutoApiController<NovaPermission> {}
