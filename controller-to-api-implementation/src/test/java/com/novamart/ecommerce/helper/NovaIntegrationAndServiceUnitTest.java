package com.novamart.ecommerce.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.dto.PartnerShipmentDispatchDto;
import com.novamart.ecommerce.dto.StockReservationReceiptDto;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.entity.WarehouseStock;
import com.novamart.ecommerce.exception.InvalidIntegrationInputException;
import com.novamart.ecommerce.service.SalesAnalyticsService;
import com.novamart.ecommerce.service.impl.SalesAnalyticsServiceImpl;
import com.novamart.ecommerce.service.impl.StockReservationServiceImpl;
import io.github.natswarchuan.common.dto.AiQueryExecutionResultDto;
import io.github.natswarchuan.common.dto.AiQueryRequestDto;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.ai.helper.AiNaturalLanguageQueryParserHelper;
import io.github.natswarchuan.module.ai.helper.DynamicEntityAiMetadataProviderHelper;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallRequestDto;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto;
import io.github.natswarchuan.module.integration.helper.ThirdPartyRestClientHelper;
import io.github.natswarchuan.module.webhook.dto.WebhookSubscriptionDto;
import io.github.natswarchuan.module.webhook.helper.WebhookDispatcherHelper;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;

/**
 * Isolated unit tests for AI/Partner integration helpers and ServiceImpl delegation layers.
 */
public class NovaIntegrationAndServiceUnitTest {

  @Test
  @SuppressWarnings("unchecked")
  public void shouldDelegateAiAssistantViaObjectProviderAndRejectBlankPrompt() {
    final ObjectProvider<DynamicEntityAiMetadataProviderHelper> metaProvider =
        mock(ObjectProvider.class);
    final ObjectProvider<AiNaturalLanguageQueryParserHelper> nlProvider =
        mock(ObjectProvider.class);
    final DynamicEntityAiMetadataProviderHelper metaHelper =
        mock(DynamicEntityAiMetadataProviderHelper.class);
    final AiNaturalLanguageQueryParserHelper nlHelper =
        mock(AiNaturalLanguageQueryParserHelper.class);

    when(metaProvider.getObject()).thenReturn(metaHelper);
    when(nlProvider.getObject()).thenReturn(nlHelper);
    when(metaHelper.generateSystemContextPrompt(StorefrontProduct.class))
        .thenReturn("StorefrontProduct schema prompt");
    final AiQueryExecutionResultDto<StorefrontProduct> expected =
        AiQueryExecutionResultDto.<StorefrontProduct>builder()
            .interpretedQuery("retailPrice >= 500")
            .build();
    when(nlHelper.executeNaturalLanguageQuery(
            eq(StorefrontProduct.class), any(AiQueryRequestDto.class)))
        .thenReturn(expected);

    final CatalogAiAssistantHelper helper =
        new CatalogAiAssistantHelper(metaProvider, nlProvider);
    assertThat(helper.generateProductCatalogSystemPrompt()).contains("StorefrontProduct");
    assertThat(helper.queryCatalogByNaturalLanguage("products over 500").getInterpretedQuery())
        .isEqualTo("retailPrice >= 500");
    assertThat(helper.resolvePromptLength(null)).isZero();

    assertThatThrownBy(() -> helper.queryCatalogByNaturalLanguage(null))
        .isInstanceOf(InvalidIntegrationInputException.class);
    assertThatThrownBy(() -> helper.queryCatalogByNaturalLanguage("   "))
        .isInstanceOf(InvalidIntegrationInputException.class);
  }

  @Test
  @SuppressWarnings("unchecked")
  public void shouldDelegatePartnerShippingAndWebhookRegistrationViaObjectProvider() {
    final ObjectProvider<ThirdPartyRestClientHelper> restProvider = mock(ObjectProvider.class);
    final ObjectProvider<WebhookDispatcherHelper> webhookProvider = mock(ObjectProvider.class);
    final ThirdPartyRestClientHelper restHelper = mock(ThirdPartyRestClientHelper.class);
    final WebhookDispatcherHelper webhookHelper = mock(WebhookDispatcherHelper.class);

    when(restProvider.getObject()).thenReturn(restHelper);
    when(webhookProvider.getObject()).thenReturn(webhookHelper);
    when(restHelper.executeOutboundCall(any(ThirdPartyCallRequestDto.class)))
        .thenReturn(
            ThirdPartyCallResponseDto.builder()
                .serviceName("NovaPartnerShipping")
                .statusCode(200)
                .responseBody("OK")
                .executionTimeMs(12L)
                .build());
    final UUID subId = UuidUtil.generateUuidV7();
    when(webhookHelper.registerSubscription(any(WebhookSubscriptionDto.class)))
        .thenReturn(WebhookSubscriptionDto.builder().subscriptionId(subId).build());

    final PartnerShippingGatewayHelper helper =
        new PartnerShippingGatewayHelper(restProvider, webhookProvider);
    final PartnerShipmentDispatchDto quote =
        helper.fetchCarrierQuote(NovaTestConstant.SAMPLE_CARRIER_URL);
    assertThat(quote.getHttpStatus()).isEqualTo(200);

    final WebhookSubscriptionDto sub =
        helper.registerPaymentWebhookSubscriber(
            "CheckoutPayment",
            NovaTestConstant.SAMPLE_WEBHOOK_URL,
            NovaTestConstant.SAMPLE_WEBHOOK_SECRET);
    assertThat(sub.getSubscriptionId()).isEqualTo(subId);

    assertThatThrownBy(() -> helper.fetchCarrierQuote(" "))
        .isInstanceOf(InvalidIntegrationInputException.class);
  }

  @Test
  @SuppressWarnings("unchecked")
  public void shouldDelegateStockReservationAndSalesAnalyticsServiceImpls() {
    final StockReservationHelper stockHelper = mock(StockReservationHelper.class);
    final WarehouseStock stock = WarehouseStock.builder().sku(NovaTestConstant.SAMPLE_SKU).build();
    final StockReservationReceiptDto receipt =
        StockReservationReceiptDto.builder().sku(NovaTestConstant.SAMPLE_SKU).build();
    when(stockHelper.loadStockOrThrow(NovaTestConstant.SAMPLE_SKU)).thenReturn(stock);
    when(stockHelper.deductAndBuildReceipt(stock, 2)).thenReturn(receipt);

    final StockReservationServiceImpl stockService = new StockReservationServiceImpl(stockHelper);
    assertThat(stockService.reserveStock(NovaTestConstant.SAMPLE_SKU, 2).getSku())
        .isEqualTo(NovaTestConstant.SAMPLE_SKU);
    verify(stockHelper).validateReservationInput(NovaTestConstant.SAMPLE_SKU, 2);

    final SalesAnalyticsHelper analyticsHelper = mock(SalesAnalyticsHelper.class);
    final CategorySalesAnalyticsDto analyticsDto =
        CategorySalesAnalyticsDto.builder()
            .categoryCode(NovaTestConstant.SAMPLE_CATEGORY)
            .activeProductCount(3L)
            .build();
    when(analyticsHelper.computeCategoryAnalytics(NovaTestConstant.SAMPLE_CATEGORY))
        .thenReturn(analyticsDto);

    final SalesAnalyticsService analyticsService = new SalesAnalyticsServiceImpl(analyticsHelper);
    assertThat(
            analyticsService
                .summarizeCategorySales(NovaTestConstant.SAMPLE_CATEGORY)
                .getActiveProductCount())
        .isEqualTo(3L);
    analyticsService.evictCategorySalesCache();

    final ObjectProvider<SalesAnalyticsService> serviceProvider = mock(ObjectProvider.class);
    when(serviceProvider.getObject()).thenReturn(analyticsService);
    final SalesAnalyticsDispatchHelper dispatchHelper =
        new SalesAnalyticsDispatchHelper(serviceProvider);
    final ApiResponse<CategorySalesAnalyticsDto> apiResp =
        dispatchHelper.getCategorySalesAnalytics(NovaTestConstant.SAMPLE_CATEGORY);
    assertThat(apiResp.getData().getCategoryCode()).isEqualTo(NovaTestConstant.SAMPLE_CATEGORY);
    assertThat(dispatchHelper.evictCategorySalesCache().getData()).isNotBlank();
  }
}
