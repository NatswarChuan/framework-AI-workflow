package com.novamart.ecommerce.helper;

import com.novamart.ecommerce.constant.NovaFieldConstant;
import com.novamart.ecommerce.constant.NovaLogConstant;
import com.novamart.ecommerce.constant.NovaNumericConstant;
import com.novamart.ecommerce.dto.CategorySalesAnalyticsDto;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.exception.InvalidAnalyticsCategoryException;
import io.github.natswarchuan.module.datasource.context.DataSourceContextHolder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper computing read-replica category pricing analytics over StorefrontProduct records.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public final class SalesAnalyticsHelper {

  private final EntityManager entityManager;

  /**
   * Validates the requested category code and computes pricing statistics from the active DB pool.
   *
   * @param category product category code
   * @return CategorySalesAnalyticsDto carrying active datasource routing key
   */
  public CategorySalesAnalyticsDto computeCategoryAnalytics(final String category) {
    validateCategory(category);
    final String activeDsKey = resolveCurrentDataSourceKey();
    log.info(NovaLogConstant.START_SALES_ANALYTICS, category, activeDsKey);
    final TypedQuery<StorefrontProduct> query =
        entityManager.createQuery(
            NovaFieldConstant.JPQL_FIND_PRODUCTS_BY_CATEGORY, StorefrontProduct.class);
    query.setParameter(NovaFieldConstant.PARAM_CATEGORY, category);
    final List<StorefrontProduct> products = query.getResultList();
    final CategorySalesAnalyticsDto dto = buildAnalyticsDto(category, products, activeDsKey);
    log.info(NovaLogConstant.FINISH_SALES_ANALYTICS, category, dto.getActiveProductCount());
    return dto;
  }

  /**
   * Validates that category code is non-null and non-blank.
   *
   * @param category candidate category code
   */
  public void validateCategory(final String category) {
    if (Objects.isNull(category)) {
      throw new InvalidAnalyticsCategoryException();
    }
    if (category.isBlank()) {
      throw new InvalidAnalyticsCategoryException();
    }
  }

  /**
   * Reads the currently bound routing datasource key from DataSourceContextHolder.
   *
   * @return active datasource key or PRIMARY fallback
   */
  public String resolveCurrentDataSourceKey() {
    final String current = DataSourceContextHolder.getDataSourceKey();
    if (Objects.isNull(current)) {
      return NovaFieldConstant.FALLBACK_DATASOURCE_PRIMARY;
    }
    if (current.isBlank()) {
      return NovaFieldConstant.FALLBACK_DATASOURCE_PRIMARY;
    }
    return current;
  }

  /**
   * Builds a CategorySalesAnalyticsDto from matched StorefrontProduct records.
   *
   * @param category category code
   * @param products matching products list
   * @param activeDsKey active datasource routing key
   * @return computed analytics DTO
   */
  public CategorySalesAnalyticsDto buildAnalyticsDto(
      final String category, final List<StorefrontProduct> products, final String activeDsKey) {
    if (Objects.isNull(products)) {
      return buildEmptyAnalyticsDto(category, activeDsKey);
    }
    if (products.isEmpty()) {
      return buildEmptyAnalyticsDto(category, activeDsKey);
    }
    final BigDecimal sumPrice = sumRetailPrices(products);
    final BigDecimal avgPrice =
        sumPrice.divide(
            BigDecimal.valueOf(products.size()),
            NovaNumericConstant.MONEY_SCALE,
            RoundingMode.HALF_UP);
    return CategorySalesAnalyticsDto.builder()
        .categoryCode(category)
        .activeProductCount(products.size())
        .averageRetailPrice(avgPrice)
        .minRetailPrice(findMinRetailPrice(products))
        .maxRetailPrice(findMaxRetailPrice(products))
        .servedFromDataSource(activeDsKey)
        .computedAtUtc(Instant.now())
        .build();
  }

  /**
   * Returns a zeroed analytics snapshot when a category currently has no products.
   *
   * @param category category code
   * @param activeDsKey active datasource key
   * @return zeroed CategorySalesAnalyticsDto
   */
  public CategorySalesAnalyticsDto buildEmptyAnalyticsDto(
      final String category, final String activeDsKey) {
    final BigDecimal zero =
        BigDecimal.ZERO.setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
    return CategorySalesAnalyticsDto.builder()
        .categoryCode(category)
        .activeProductCount(NovaNumericConstant.LONG_ZERO)
        .averageRetailPrice(zero)
        .minRetailPrice(zero)
        .maxRetailPrice(zero)
        .servedFromDataSource(activeDsKey)
        .computedAtUtc(Instant.now())
        .build();
  }

  /**
   * Sums retail prices across products cleanly.
   *
   * @param products product list
   * @return summed retail price
   */
  public BigDecimal sumRetailPrices(final List<StorefrontProduct> products) {
    BigDecimal sum = BigDecimal.ZERO;
    for (final StorefrontProduct product : products) {
      sum = sum.add(extractRetailPriceOrZero(product));
    }
    return sum;
  }

  /**
   * Finds the minimum retail price across a non-empty product list.
   *
   * @param products non-empty product list
   * @return lowest retail price scaled to 2 decimal places
   */
  public BigDecimal findMinRetailPrice(final List<StorefrontProduct> products) {
    BigDecimal min = extractRetailPriceOrZero(products.get(NovaNumericConstant.INT_ZERO));
    for (final StorefrontProduct product : products) {
      final BigDecimal current = extractRetailPriceOrZero(product);
      if (current.compareTo(min) < NovaNumericConstant.INT_ZERO) {
        min = current;
      }
    }
    return min.setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
  }

  /**
   * Finds the maximum retail price across a non-empty product list.
   *
   * @param products non-empty product list
   * @return highest retail price scaled to 2 decimal places
   */
  public BigDecimal findMaxRetailPrice(final List<StorefrontProduct> products) {
    BigDecimal max = extractRetailPriceOrZero(products.get(NovaNumericConstant.INT_ZERO));
    for (final StorefrontProduct product : products) {
      final BigDecimal current = extractRetailPriceOrZero(product);
      if (current.compareTo(max) > NovaNumericConstant.INT_ZERO) {
        max = current;
      }
    }
    return max.setScale(NovaNumericConstant.MONEY_SCALE, RoundingMode.HALF_UP);
  }

  /**
   * Extracts a non-null retail price or returns BigDecimal.ZERO.
   *
   * @param product product entity
   * @return retail price or zero
   */
  public BigDecimal extractRetailPriceOrZero(final StorefrontProduct product) {
    if (Objects.isNull(product)) {
      return BigDecimal.ZERO;
    }
    if (Objects.isNull(product.getRetailPrice())) {
      return BigDecimal.ZERO;
    }
    return product.getRetailPrice();
  }
}
