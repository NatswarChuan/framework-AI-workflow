package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaOpenApiConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.dto.OrderCheckoutSummaryDto;
import com.novamart.ecommerce.dto.OrderPricingQuoteDto;
import com.novamart.ecommerce.entity.ShopOrder;
import com.novamart.ecommerce.helper.OrderPricingOverrideHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.CustomEndpoint;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoApiController;
import java.util.UUID;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Order lifecycle controller exposing StateMachine CRUD, @CustomEndpoint summary, and @ServiceOverride quote.
 */
@AutoRestController
public interface ShopOrderController extends AutoApiController<ShopOrder> {

  /**
   * Aggregates active shop orders by StateMachine lifecycle state via @CustomEndpoint.
   *
   * @return ApiResponse wrapping OrderCheckoutSummaryDto
   */
  @CustomEndpoint(
      path = NovaPathConstant.SUB_CHECKOUT_SUMMARY,
      httpMethod = NovaPathConstant.HTTP_METHOD_GET,
      delegateBean = NovaFieldConstant.BEAN_ORDER_SUMMARY_HELPER,
      delegateMethod = NovaFieldConstant.METHOD_BUILD_CHECKOUT_SUMMARY,
      summary = NovaOpenApiConstant.SUM_CHECKOUT_SUMMARY,
      description = NovaOpenApiConstant.DESC_CHECKOUT_SUMMARY)
  ApiResponse<OrderCheckoutSummaryDto> getCheckoutSummary();

  /**
   * Computes a dynamic loyalty-discounted pricing quote via @ServiceOverride escape-hatch delegation.
   *
   * @param id shop order UUIDv7
   * @param tier optional customer tier (STANDARD, VIP, MERCHANT)
   * @return ApiResponse wrapping OrderPricingQuoteDto
   */
  @AutoGet(NovaPathConstant.SUB_ORDER_PRICING_QUOTE)
  @ServiceOverride(
      targetBean = OrderPricingOverrideHelper.class,
      methodName = NovaFieldConstant.METHOD_CALCULATE_PRICING_QUOTE)
  ApiResponse<OrderPricingQuoteDto> getOrderPricingQuote(
      @PathVariable(NovaFieldConstant.PARAM_ID) UUID id,
      @RequestParam(
              name = NovaFieldConstant.PARAM_TIER,
              required = false,
              defaultValue = NovaFieldConstant.TIER_STANDARD)
          String tier);
}
