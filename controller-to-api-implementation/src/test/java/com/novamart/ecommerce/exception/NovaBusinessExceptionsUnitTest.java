package com.novamart.ecommerce.exception;

import static org.assertj.core.api.Assertions.assertThat;

import com.novamart.ecommerce.constant.NovaErrorConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import io.github.natswarchuan.common.constant.StandardHttpStatus;
import io.github.natswarchuan.common.util.UuidUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * Unit tests confirming every custom NovaMart business exception binds the expected HTTP status.
 */
public class NovaBusinessExceptionsUnitTest {

  @Test
  public void shouldConstructAllCustomExceptionsWithExactHttpStatusAndErrorCode() {
    final UUID sampleId = UuidUtil.generateUuidV7();

    final InsufficientStockException insufficient =
        new InsufficientStockException(NovaTestConstant.SAMPLE_SKU, 10, 2);
    assertThat(insufficient.getHttpStatus()).isEqualTo(StandardHttpStatus.CONFLICT);
    assertThat(insufficient.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_INSUFFICIENT_STOCK);

    final StockNotFoundException stockMissing =
        new StockNotFoundException(NovaTestConstant.SAMPLE_SKU);
    assertThat(stockMissing.getHttpStatus()).isEqualTo(StandardHttpStatus.NOT_FOUND);
    assertThat(stockMissing.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_STOCK_NOT_FOUND);

    final InvalidReservationRequestException badRes =
        new InvalidReservationRequestException(NovaErrorConstant.MSG_SKU_REQUIRED);
    assertThat(badRes.getHttpStatus()).isEqualTo(StandardHttpStatus.BAD_REQUEST);
    assertThat(badRes.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_INVALID_RESERVATION);

    final ProductCatalogNotFoundException prodMissing =
        new ProductCatalogNotFoundException(sampleId);
    assertThat(prodMissing.getHttpStatus()).isEqualTo(StandardHttpStatus.NOT_FOUND);
    assertThat(prodMissing.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_PRODUCT_NOT_FOUND);

    final OrderPricingNotFoundException orderMissing = new OrderPricingNotFoundException(sampleId);
    assertThat(orderMissing.getHttpStatus()).isEqualTo(StandardHttpStatus.NOT_FOUND);
    assertThat(orderMissing.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_ORDER_NOT_FOUND);

    final InvalidAnalyticsCategoryException badCat = new InvalidAnalyticsCategoryException();
    assertThat(badCat.getHttpStatus()).isEqualTo(StandardHttpStatus.BAD_REQUEST);
    assertThat(badCat.getErrorCode()).isEqualTo(NovaErrorConstant.CODE_INVALID_CATEGORY);

    final InvalidIntegrationInputException badInt =
        new InvalidIntegrationInputException(NovaErrorConstant.MSG_PROMPT_REQUIRED);
    assertThat(badInt.getHttpStatus()).isEqualTo(StandardHttpStatus.BAD_REQUEST);
    assertThat(badInt.getErrorCode())
        .isEqualTo(NovaErrorConstant.CODE_INVALID_INTEGRATION_INPUT);
  }
}
