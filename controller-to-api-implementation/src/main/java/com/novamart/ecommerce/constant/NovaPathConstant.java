package com.novamart.ecommerce.constant;

/**
 * HTTP endpoint base paths and custom sub-route constants for NovaMart controllers.
 */
public final class NovaPathConstant {

  /** Public read-only product catalog base path. */
  public static final String BASE_PUBLIC_PRODUCTS = "/api/v1/public/products";

  /** Storefront product full CRUD base path. */
  public static final String BASE_STOREFRONT_PRODUCTS = "/api/v1/storefront-products";

  /** Store category base path. */
  public static final String BASE_STORE_CATEGORIES = "/api/v1/store-categories";

  /** Multi-tenant merchant listing base path. */
  public static final String BASE_MERCHANT_LISTINGS = "/api/v1/merchant-listings";

  /** Warehouse stock base path. */
  public static final String BASE_WAREHOUSE_STOCKS = "/api/v1/warehouse-stocks";

  /** Shop order base path. */
  public static final String BASE_SHOP_ORDERS = "/api/v1/shop-orders";

  /** Checkout payment base path. */
  public static final String BASE_CHECKOUT_PAYMENTS = "/api/v1/checkout-payments";

  /** Sub-route for ETag-cached public product detail lookup. */
  public static final String SUB_CACHED_BY_ID = "/cached/{id}";

  /** Sub-route for distributed-lock flash-sale stock reservation. */
  public static final String SUB_RESERVE_STOCK = "/reserve";

  /** Sub-route for checkout order summary aggregation. */
  public static final String SUB_CHECKOUT_SUMMARY = "/checkout-summary";

  /** Sub-route for order pricing quote escape hatch. */
  public static final String SUB_ORDER_PRICING_QUOTE = "/{id}/pricing-quote";

  /** Sub-route for read-replica category sales analytics. */
  public static final String SUB_SALES_ANALYTICS_BY_CATEGORY = "/analytics/{category}";

  /** Sub-route for evicting cached category sales analytics. */
  public static final String SUB_SALES_ANALYTICS_EVICT = "/analytics/evict";

  /** CloudEvents source URI for checkout payments. */
  public static final String CLOUD_EVENT_PAYMENT_SOURCE = "/api/v1/checkout-payments";

  /** HTTP GET method literal. */
  public static final String HTTP_METHOD_GET = "GET";

  /** HTTP POST method literal. */
  public static final String HTTP_METHOD_POST = "POST";

  private NovaPathConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
