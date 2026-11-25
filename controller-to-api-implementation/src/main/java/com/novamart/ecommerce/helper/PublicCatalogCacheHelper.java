package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.PublicProductCardDto;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.exception.ProductCatalogNotFoundException;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.module.cache.http.helper.HttpCacheEvaluatorHelper;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Helper backing ETag-cached public product card reads on PublicCatalogController.
 */
@Slf4j
@Component(NovaFieldConstant.BEAN_PUBLIC_CATALOG_CACHE_HELPER)
@RequiredArgsConstructor
public final class PublicCatalogCacheHelper {

  private final EntityManager entityManager;
  private final ObjectProvider<HttpCacheEvaluatorHelper> httpCacheEvaluatorProvider;

  /**
   * Loads an active StorefrontProduct, emits weak ETag and Cache-Control headers via framework
   * HttpCacheEvaluatorHelper, and short-circuits matching If-None-Match requests with HTTP 304.
   *
   * @param productId storefront product UUIDv7
   * @return ApiResponse of PublicProductCardDto, or null after committing 304 Not Modified
   */
  public ApiResponse<PublicProductCardDto> getCachedProductById(final UUID productId) {
    log.info(NovaLogConstant.START_GET_CACHED_PRODUCT, productId);
    if (Objects.isNull(productId)) {
      throw new ProductCatalogNotFoundException(null);
    }
    final StorefrontProduct product = entityManager.find(StorefrontProduct.class, productId);
    validateActiveProduct(product, productId);
    final PublicProductCardDto card = PublicProductCardDto.fromEntity(product);
    final boolean notModified = applyHttpCacheHeadersAndEvaluate304(card);
    log.info(NovaLogConstant.FINISH_GET_CACHED_PRODUCT, productId);
    if (notModified) {
      return null;
    }
    return ApiResponse.success(card);
  }

  /**
   * Validates that a loaded product exists and is not soft-deleted.
   *
   * @param product candidate product entity
   * @param productId requested product identifier
   */
  public void validateActiveProduct(final StorefrontProduct product, final UUID productId) {
    if (Objects.isNull(product)) {
      throw new ProductCatalogNotFoundException(productId);
    }
    if (Boolean.TRUE.equals(product.getDeleted())) {
      throw new ProductCatalogNotFoundException(productId);
    }
  }

  /**
   * Applies RFC 7232 weak ETag and private Cache-Control headers and commits HTTP 304 when matched.
   *
   * @param card deterministic public product card DTO
   * @return true when HTTP 304 Not Modified was committed; false for normal 200 payload
   */
  public boolean applyHttpCacheHeadersAndEvaluate304(final PublicProductCardDto card) {
    final ServletRequestAttributes servletAttrs = resolveServletRequestAttributes();
    if (Objects.isNull(servletAttrs)) {
      return false;
    }
    final HttpCacheEvaluatorHelper evaluator = httpCacheEvaluatorProvider.getIfAvailable();
    if (Objects.isNull(evaluator)) {
      return false;
    }
    final HttpServletResponse response = servletAttrs.getResponse();
    if (Objects.isNull(response)) {
      return false;
    }
    final String etag = evaluator.computePayloadHash(card);
    final String cacheControl = buildPrivateCacheControlHeader();
    response.setHeader(HttpHeaders.ETAG, etag);
    response.setHeader(HttpHeaders.CACHE_CONTROL, cacheControl);
    return commitNotModifiedIfMatched(servletAttrs.getRequest(), response, evaluator, etag);
  }

  /**
   * Checks the incoming If-None-Match header and flushes HTTP 304 Not Modified when matching.
   *
   * @param request current HTTP request
   * @param response current HTTP response
   * @param evaluator framework HTTP cache evaluator
   * @param etag computed weak ETag
   * @return true if 304 Not Modified was committed
   */
  public boolean commitNotModifiedIfMatched(
      final HttpServletRequest request,
      final HttpServletResponse response,
      final HttpCacheEvaluatorHelper evaluator,
      final String etag) {
    if (Objects.isNull(request)) {
      return false;
    }
    final String ifNoneMatch = request.getHeader(HttpHeaders.IF_NONE_MATCH);
    if (!evaluator.isIfNoneMatchMatching(ifNoneMatch, etag)) {
      return false;
    }
    response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
    flushResponseSafely(response);
    return true;
  }

  /**
   * Flushes the HTTP response buffer cleanly for empty 304 responses.
   *
   * @param response current HTTP servlet response
   */
  public void flushResponseSafely(final HttpServletResponse response) {
    try {
      response.flushBuffer();
    } catch (final IOException ignored) {
      log.warn(NovaLogConstant.FINISH_GET_CACHED_PRODUCT, HttpServletResponse.SC_NOT_MODIFIED);
    }
  }

  /**
   * Resolves current ServletRequestAttributes if executing inside an active HTTP request.
   *
   * @return ServletRequestAttributes or null outside servlet context
   */
  public ServletRequestAttributes resolveServletRequestAttributes() {
    final RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
    if (attributes instanceof ServletRequestAttributes servletAttrs) {
      return servletAttrs;
    }
    return null;
  }

  /**
   * Builds the RFC 9111 private Cache-Control header aligned with @HttpCacheable settings.
   *
   * @return Cache-Control header value
   */
  public String buildPrivateCacheControlHeader() {
    return NovaFieldConstant.CACHE_CONTROL_PRIVATE_PREFIX
        + NovaNumericConstant.HTTP_CACHE_MAX_AGE_SECONDS
        + NovaFieldConstant.CACHE_CONTROL_MUST_REVALIDATE_SUFFIX;
  }
}
