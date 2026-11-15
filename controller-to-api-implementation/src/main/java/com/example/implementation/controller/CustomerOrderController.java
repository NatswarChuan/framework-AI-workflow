package com.example.implementation.controller;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.CustomerOrder;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Dynamic proxy REST controller for {@link CustomerOrder} entities.
 *
 * <p>Auto-generates endpoints at {@code /api/v1/customer-orders} with derived method {@code findAllByOrderStatus}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface CustomerOrderController extends AutoApiController<CustomerOrder> {

  /**
   * Derived query retrieving customer orders by state machine status.
   *
   * @param orderStatus target order status
   * @return {@link ResponseEntity} wrapping collection of matching orders
   */
  @GetMapping(ApiEndpointConstant.PATH_BY_STATUS)
  ResponseEntity<ApiResponse<List<CustomerOrder>>> findAllByOrderStatus(
      @PathVariable(ApiEndpointConstant.PARAM_ORDER_STATUS) String orderStatus);
}
