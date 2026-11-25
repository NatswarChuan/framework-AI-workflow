package com.novamart.ecommerce.helper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.dto.OrderCheckoutSummaryDto;
import com.novamart.ecommerce.dto.OrderPricingQuoteDto;
import com.novamart.ecommerce.dto.PublicProductCardDto;
import com.novamart.ecommerce.dto.StockReservationReceiptDto;
import com.novamart.ecommerce.entity.ShopOrder;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.entity.WarehouseStock;
import com.novamart.ecommerce.exception.InsufficientStockException;
import com.novamart.ecommerce.exception.InvalidAnalyticsCategoryException;
import com.novamart.ecommerce.exception.InvalidReservationRequestException;
import com.novamart.ecommerce.exception.OrderPricingNotFoundException;
import com.novamart.ecommerce.exception.ProductCatalogNotFoundException;
import com.novamart.ecommerce.exception.StockNotFoundException;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.datasource.context.DataSourceContextHolder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;

/**
 * Isolated JUnit 5 + Mockito unit tests for core NovaMart domain helpers and guard clauses.
 */
public class NovaDomainHelpersUnitTest {

  @Test
  @SuppressWarnings("unchecked")
  public void shouldReturnPublicProductCardAndRejectMissingOrDeletedProduct() {
    final EntityManager em = mock(EntityManager.class);
    final ObjectProvider<io.github.natswarchuan.module.cache.http.helper.HttpCacheEvaluatorHelper>
        cacheProvider = mock(ObjectProvider.class);
    final PublicCatalogCacheHelper helper = new PublicCatalogCacheHelper(em, cacheProvider);
    final UUID id = UuidUtil.generateUuidV7();
    final StorefrontProduct product =
        StorefrontProduct.builder()
            .id(id)
            .sku(NovaTestConstant.SAMPLE_SKU)
            .name(NovaTestConstant.SAMPLE_PRODUCT_NAME)
            .retailPrice(NovaTestConstant.SAMPLE_RETAIL_PRICE)
            .supplierCost(NovaTestConstant.SAMPLE_SUPPLIER_COST)
            .deleted(false)
            .active(true)
            .build();
    when(em.find(StorefrontProduct.class, id)).thenReturn(product);

    final ApiResponse<PublicProductCardDto> response = helper.getCachedProductById(id);
    assertThat(response).isNotNull();
    assertThat(response.getData().getSku()).isEqualTo(NovaTestConstant.SAMPLE_SKU);

    assertThatThrownBy(() -> helper.getCachedProductById(null))
        .isInstanceOf(ProductCatalogNotFoundException.class);

    final UUID deletedId = UuidUtil.generateUuidV7();
    final StorefrontProduct deleted = StorefrontProduct.builder().id(deletedId).deleted(true).build();
    when(em.find(StorefrontProduct.class, deletedId)).thenReturn(deleted);
    assertThatThrownBy(() -> helper.getCachedProductById(deletedId))
        .isInstanceOf(ProductCatalogNotFoundException.class);
  }

  @Test
  @SuppressWarnings("unchecked")
  public void shouldValidateLoadAndDeductWarehouseStock() {
    final EntityManager em = mock(EntityManager.class);
    final TypedQuery<WarehouseStock> query = mock(TypedQuery.class);
    final StockReservationHelper helper = new StockReservationHelper(em);

    assertThatThrownBy(() -> helper.validateReservationInput(null, 1))
        .isInstanceOf(InvalidReservationRequestException.class);
    assertThatThrownBy(() -> helper.validateReservationInput("  ", 1))
        .isInstanceOf(InvalidReservationRequestException.class);
    assertThatThrownBy(() -> helper.validateReservationInput(NovaTestConstant.SAMPLE_SKU, null))
        .isInstanceOf(InvalidReservationRequestException.class);
    assertThatThrownBy(() -> helper.validateReservationInput(NovaTestConstant.SAMPLE_SKU, 0))
        .isInstanceOf(InvalidReservationRequestException.class);

    when(em.createQuery(NovaFieldConstant.JPQL_FIND_STOCK_BY_SKU, WarehouseStock.class))
        .thenReturn(query);
    when(query.getResultList()).thenReturn(List.of());
    assertThatThrownBy(() -> helper.loadStockOrThrow(NovaTestConstant.SAMPLE_SKU))
        .isInstanceOf(StockNotFoundException.class);

    final WarehouseStock stock =
        WarehouseStock.builder()
            .sku(NovaTestConstant.SAMPLE_SKU)
            .warehouseCode(NovaTestConstant.SAMPLE_WAREHOUSE)
            .availableQuantity(5)
            .reservedQuantity(2)
            .build();
    when(em.merge(any(WarehouseStock.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    final StockReservationReceiptDto receipt = helper.deductAndBuildReceipt(stock, 3);
    assertThat(receipt.getRemainingAvailableQuantity()).isEqualTo(2);
    assertThat(receipt.getTotalReservedQuantity()).isEqualTo(5);
    verify(em).flush();

    assertThatThrownBy(() -> helper.deductAndBuildReceipt(stock, 9))
        .isInstanceOf(InsufficientStockException.class);
    assertThat(helper.resolveQuantityOrZero(null)).isZero();
  }

  @Test
  public void shouldSummarizeShopOrdersAndCalculateTieredPricingQuotes() {
    final EntityManager em = mock(EntityManager.class);
    final OrderSummaryHelper summaryHelper = new OrderSummaryHelper(em);

    final ShopOrder draft =
        ShopOrder.builder()
            .orderStatus(NovaFieldConstant.ORDER_STATE_DRAFT)
            .totalAmount(new BigDecimal("100.00"))
            .build();
    final ShopOrder paid =
        ShopOrder.builder()
            .orderStatus(NovaFieldConstant.ORDER_STATE_PAID)
            .totalAmount(new BigDecimal("250.50"))
            .build();

    final OrderCheckoutSummaryDto summary = summaryHelper.buildSummaryFromOrders(List.of(draft, paid));
    assertThat(summary.getTotalOrders()).isEqualTo(2L);
    assertThat(summary.getDraftCount()).isEqualTo(1L);
    assertThat(summary.getPaidCount()).isEqualTo(1L);
    assertThat(summary.getGrossOrderVolume()).isEqualByComparingTo(new BigDecimal("350.50"));
    assertThat(summaryHelper.buildSummaryFromOrders(null).getTotalOrders()).isZero();

    final OrderPricingOverrideHelper pricingHelper = new OrderPricingOverrideHelper(em);
    final UUID orderId = UuidUtil.generateUuidV7();
    final ShopOrder order =
        ShopOrder.builder()
            .id(orderId)
            .orderNumber("NVM-1001")
            .subtotalAmount(new BigDecimal("1000.00"))
            .deleted(false)
            .build();
    when(em.find(ShopOrder.class, orderId)).thenReturn(order);

    final ApiResponse<OrderPricingQuoteDto> vipQuote =
        pricingHelper.calculatePricingQuote(orderId, "vip");
    assertThat(vipQuote.getData().getAppliedTier()).isEqualTo(NovaFieldConstant.TIER_VIP);
    assertThat(vipQuote.getData().getLoyaltyDiscountAmount())
        .isEqualByComparingTo(new BigDecimal("100.00"));
    assertThat(vipQuote.getData().getEstimatedTaxAmount())
        .isEqualByComparingTo(new BigDecimal("72.00"));
    assertThat(vipQuote.getData().getFinalPayableAmount())
        .isEqualByComparingTo(new BigDecimal("972.00"));

    assertThat(pricingHelper.normalizeTier("  ")).isEqualTo(NovaFieldConstant.TIER_STANDARD);
    assertThat(pricingHelper.resolveDiscountRate(NovaFieldConstant.TIER_MERCHANT))
        .isEqualByComparingTo(new BigDecimal("0.15"));
    assertThatThrownBy(() -> pricingHelper.calculatePricingQuote(null, "VIP"))
        .isInstanceOf(OrderPricingNotFoundException.class);
  }

  @Test
  @SuppressWarnings("unchecked")
  public void shouldComputeSalesAnalyticsWithReplicaContext() {
    final EntityManager em = mock(EntityManager.class);
    final TypedQuery<StorefrontProduct> query = mock(TypedQuery.class);
    final SalesAnalyticsHelper helper = new SalesAnalyticsHelper(em);

    assertThatThrownBy(() -> helper.validateCategory(null))
        .isInstanceOf(InvalidAnalyticsCategoryException.class);
    assertThatThrownBy(() -> helper.validateCategory(" "))
        .isInstanceOf(InvalidAnalyticsCategoryException.class);

    when(em.createQuery(NovaFieldConstant.JPQL_FIND_PRODUCTS_BY_CATEGORY, StorefrontProduct.class))
        .thenReturn(query);
    when(query.getResultList())
        .thenReturn(
            List.of(
                StorefrontProduct.builder().retailPrice(new BigDecimal("100.00")).build(),
                StorefrontProduct.builder().retailPrice(new BigDecimal("300.00")).build()));

    DataSourceContextHolder.setDataSourceKey(DataSourceConstant.DATASOURCE_REPLICA);
    try {
      final CategorySalesAnalyticsDto dto =
          helper.computeCategoryAnalytics(NovaTestConstant.SAMPLE_CATEGORY);
      assertThat(dto.getActiveProductCount()).isEqualTo(2L);
      assertThat(dto.getAverageRetailPrice()).isEqualByComparingTo(new BigDecimal("200.00"));
      assertThat(dto.getMinRetailPrice()).isEqualByComparingTo(new BigDecimal("100.00"));
      assertThat(dto.getMaxRetailPrice()).isEqualByComparingTo(new BigDecimal("300.00"));
      assertThat(dto.getServedFromDataSource()).isEqualTo(DataSourceConstant.DATASOURCE_REPLICA);
    } finally {
      DataSourceContextHolder.clear();
    }

    assertThat(helper.buildAnalyticsDto("EMPTY", List.of(), "PRIMARY").getActiveProductCount())
        .isZero();
  }
}
