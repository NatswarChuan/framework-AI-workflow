package com.novamart.ecommerce.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.entity.ShopOrder;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.entity.WarehouseStock;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.integration.dto.ThirdPartyCallResponseDto;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Unit tests verifying Builder Pattern DTO conversions (fromXXX / toXXX) and null guard clauses.
 */
public class NovaDtoMappingUnitTest {

  @Test
  public void shouldMapPublicProductCardDtoFromAndToEntity() {
    final UUID id = UuidUtil.generateUuidV7();
    final StorefrontProduct product =
        StorefrontProduct.builder()
            .id(id)
            .sku(NovaTestConstant.SAMPLE_SKU)
            .name(NovaTestConstant.SAMPLE_PRODUCT_NAME)
            .slug("novabook-pro-16-ultra")
            .categoryCode(NovaTestConstant.SAMPLE_CATEGORY)
            .brand(NovaTestConstant.SAMPLE_BRAND)
            .retailPrice(NovaTestConstant.SAMPLE_RETAIL_PRICE)
            .supplierCost(NovaTestConstant.SAMPLE_SUPPLIER_COST)
            .active(true)
            .build();

    final PublicProductCardDto card = PublicProductCardDto.fromEntity(product);
    assertThat(card).isNotNull();
    assertThat(card.getId()).isEqualTo(id);
    assertThat(card.getSku()).isEqualTo(NovaTestConstant.SAMPLE_SKU);
    assertThat(card.getRetailPrice()).isEqualByComparingTo(NovaTestConstant.SAMPLE_RETAIL_PRICE);

    final StorefrontProduct rebuilt = card.toEntity();
    assertThat(rebuilt.getSku()).isEqualTo(NovaTestConstant.SAMPLE_SKU);
    assertThat(rebuilt.getSupplierCost()).isNull();
    assertThat(PublicProductCardDto.fromEntity(null)).isNull();
  }

  @Test
  public void shouldMapStockReservationReceiptDtoFromStockAndSnapshot() {
    final WarehouseStock stock =
        WarehouseStock.builder()
            .sku(NovaTestConstant.SAMPLE_SKU)
            .warehouseCode(NovaTestConstant.SAMPLE_WAREHOUSE)
            .availableQuantity(7)
            .reservedQuantity(3)
            .build();

    final StockReservationReceiptDto receipt = StockReservationReceiptDto.fromStock(stock, 3);
    assertThat(receipt).isNotNull();
    assertThat(receipt.getReservationId()).isNotNull();
    assertThat(receipt.getRemainingAvailableQuantity()).isEqualTo(7);
    assertThat(receipt.getTotalReservedQuantity()).isEqualTo(3);

    final WarehouseStock snapshot = receipt.toStockSnapshot();
    assertThat(snapshot.getSku()).isEqualTo(NovaTestConstant.SAMPLE_SKU);
    assertThat(snapshot.getAvailableQuantity()).isEqualTo(7);
    assertThat(StockReservationReceiptDto.fromStock(null, 1)).isNull();
  }

  @Test
  public void shouldMapOrderPricingQuoteAndPartnerShipmentDtos() {
    final UUID orderId = UuidUtil.generateUuidV7();
    final ShopOrder order =
        ShopOrder.builder()
            .id(orderId)
            .orderNumber("NVM-001")
            .subtotalAmount(NovaTestConstant.SAMPLE_SUBTOTAL)
            .build();
    final OrderPricingQuoteDto quote = OrderPricingQuoteDto.fromOrder(order, "VIP");
    assertThat(quote).isNotNull();
    assertThat(quote.getOrderId()).isEqualTo(orderId);
    assertThat(quote.getAppliedTier()).isEqualTo("VIP");
    assertThat(OrderPricingQuoteDto.fromOrder(null, "VIP")).isNull();

    final ThirdPartyCallResponseDto thirdParty =
        ThirdPartyCallResponseDto.builder()
            .serviceName("NovaPartnerShipping")
            .statusCode(200)
            .responseBody("{\"rate\":12.50}")
            .executionTimeMs(18L)
            .build();
    final PartnerShipmentDispatchDto dispatch =
        PartnerShipmentDispatchDto.fromThirdPartyResponse(
            NovaTestConstant.SAMPLE_CARRIER_URL, thirdParty);
    assertThat(dispatch).isNotNull();
    assertThat(dispatch.getHttpStatus()).isEqualTo(200);
    assertThat(dispatch.getElapsedMs()).isEqualTo(18L);
    assertThat(
            PartnerShipmentDispatchDto.fromThirdPartyResponse(
                NovaTestConstant.SAMPLE_CARRIER_URL, null))
        .isNull();
  }
}
