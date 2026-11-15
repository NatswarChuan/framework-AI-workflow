package com.example.implementation.controller;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Company;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Dynamic proxy REST controller for {@link Company} entities.
 *
 * <p>Exposes auto-generated endpoints at {@code /api/v1/companies} with derived query {@code existsByTaxCode}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface CompanyController extends AutoApiController<Company> {

  /**
   * Derived query verifying tax code existence via dynamic query synthesis.
   *
   * @param taxCode company tax registration number
   * @return {@link ResponseEntity} wrapping boolean existence flag
   */
  @GetMapping(ApiEndpointConstant.PATH_EXISTS_BY_TAX_CODE)
  ResponseEntity<ApiResponse<Boolean>> existsByTaxCode(
      @PathVariable(ApiEndpointConstant.PARAM_TAX_CODE) String taxCode);
}
