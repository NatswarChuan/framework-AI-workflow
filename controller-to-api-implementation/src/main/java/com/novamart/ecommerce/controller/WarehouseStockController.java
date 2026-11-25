package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaOpenApiConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.dto.StockReservationReceiptDto;
import com.novamart.ecommerce.entity.WarehouseStock;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.CustomEndpoint;
import io.github.natswarchuan.core.controller.AutoApiController;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Warehouse inventory controller exposing atomic flash-sale stock reservation under distributed lock.
 */
@AutoRestController
public interface WarehouseStockController extends AutoApiController<WarehouseStock> {

  /**
   * Atomically reserves stock units for a SKU using StockReservationService.
   *
   * @param sku stock SKU code
   * @param quantity units to reserve
   * @return ApiResponse wrapping StockReservationReceiptDto
   */
  @CustomEndpoint(
      path = NovaPathConstant.SUB_RESERVE_STOCK,
      httpMethod = NovaPathConstant.HTTP_METHOD_POST,
      delegateBean = NovaFieldConstant.BEAN_STOCK_RESERVATION_SERVICE,
      delegateMethod = NovaFieldConstant.METHOD_RESERVE_STOCK,
      summary = NovaOpenApiConstant.SUM_RESERVE_STOCK,
      description = NovaOpenApiConstant.DESC_RESERVE_STOCK)
  ApiResponse<StockReservationReceiptDto> reserveStock(
      @RequestParam(NovaFieldConstant.PARAM_SKU) String sku,
      @RequestParam(NovaFieldConstant.PARAM_QTY) Integer quantity);
}
