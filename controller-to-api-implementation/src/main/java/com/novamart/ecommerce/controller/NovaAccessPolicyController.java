package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.NovaAccessPolicy;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Admin management controller for dynamic DB-RBAC NovaAccessPolicy rules (/api/v1/nova-access-policies).
 */
@AutoRestController
public interface NovaAccessPolicyController extends AutoApiController<NovaAccessPolicy> {}
