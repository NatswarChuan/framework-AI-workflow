package com.novamart.ecommerce.controller;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.dto.PublicProductCardDto;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.helper.PublicCatalogCacheHelper;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoGet;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.EntityCircuitBreaker;
import io.github.natswarchuan.core.annotation.EntityRetry;
import io.github.natswarchuan.core.annotation.RateLimit;
import io.github.natswarchuan.core.annotation.ServiceOverride;
import io.github.natswarchuan.core.controller.AutoReadApi;
import io.github.natswarchuan.module.cache.http.annotation.HttpCacheable;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Public read-only storefront catalog projecting PublicProductCardDto with resilience and ETag.
 */
@AutoRestController(
    basePath = NovaPathConstant.BASE_PUBLIC_PRODUCTS,
    readDto = PublicProductCardDto.class)
@RateLimit(
    requests = NovaNumericConstant.PUBLIC_RATE_LIMIT_REQUESTS,
    windowSeconds = NovaNumericConstant.PUBLIC_RATE_LIMIT_WINDOW_SECONDS,
    partitionKey = NovaFieldConstant.RATE_LIMIT_PARTITION_IP)
@EntityCircuitBreaker(
    name = NovaFieldConstant.RESILIENCE_PUBLIC_CATALOG,
    failureRateThreshold = NovaNumericConstant.CB_FAILURE_RATE_THRESHOLD,
    slidingWindowSize = NovaNumericConstant.CB_SLIDING_WINDOW_SIZE,
    waitDurationInOpenStateSeconds = NovaNumericConstant.CB_WAIT_OPEN_SECONDS)
@EntityRetry(
    name = NovaFieldConstant.RESILIENCE_PUBLIC_CATALOG,
    maxAttempts = NovaNumericConstant.RETRY_MAX_ATTEMPTS,
    waitDurationMs = NovaNumericConstant.RETRY_WAIT_DURATION_MS)
public interface PublicCatalogController extends AutoReadApi<StorefrontProduct> {

  /**
   * Returns a single public product card with weak ETag and 304 Not Modified revalidation.
   *
   * @param id storefront product UUIDv7
   * @return ApiResponse of PublicProductCardDto
   */
  @AutoGet(NovaPathConstant.SUB_CACHED_BY_ID)
  @HttpCacheable(
      maxAgeSeconds = NovaNumericConstant.HTTP_CACHE_MAX_AGE_SECONDS,
      isPrivate = true,
      mustRevalidate = true,
      generateETag = true)
  @ServiceOverride(
      targetBean = PublicCatalogCacheHelper.class,
      methodName = NovaFieldConstant.METHOD_GET_CACHED_PRODUCT_BY_ID)
  ResponseEntity<ApiResponse<PublicProductCardDto>> getCachedProductById(
      @PathVariable(NovaFieldConstant.PARAM_ID) UUID id);
}
