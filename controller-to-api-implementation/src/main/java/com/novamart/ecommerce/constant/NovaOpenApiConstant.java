package com.novamart.ecommerce.constant;

/**
 * OpenAPI summary and description constants for NovaMart custom endpoints.
 */
public final class NovaOpenApiConstant {

  /** Summary for flash-sale stock reservation endpoint. */
  public static final String SUM_RESERVE_STOCK = "Reserve warehouse inventory atomically";

  /** Description for flash-sale stock reservation endpoint. */
  public static final String DESC_RESERVE_STOCK =
      "Acquires a SKU-scoped distributed lock and deducts available inventory atomically";

  /** Summary for shop order checkout summary endpoint. */
  public static final String SUM_CHECKOUT_SUMMARY = "Summarize shop orders by lifecycle state";

  /** Description for shop order checkout summary endpoint. */
  public static final String DESC_CHECKOUT_SUMMARY =
      "Aggregates active order counts across all state machine states and gross volume";

  private NovaOpenApiConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
