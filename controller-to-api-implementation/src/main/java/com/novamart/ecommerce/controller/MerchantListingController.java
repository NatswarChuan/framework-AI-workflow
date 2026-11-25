package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.entity.MerchantListing;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

/**
 * Multi-tenant controller for MerchantListing (/api/v1/merchant-listings) enforcing X-Tenant-ID.
 */
@AutoRestController
public interface MerchantListingController extends AutoApiController<MerchantListing> {}
