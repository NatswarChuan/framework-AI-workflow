package com.novamart.ecommerce.constant;

/**
 * Domain field names, bean names, SpEL expressions, states, and webhook/event keys.
 */
public final class NovaFieldConstant {

  /** Source field name for auto-slug generation. */
  public static final String FIELD_NAME = "name";

  /** Multi-tenant column field name on MerchantListing. */
  public static final String FIELD_MERCHANT_TENANT_ID = "merchantTenantId";

  /** Path variable name for entity UUID. */
  public static final String PARAM_ID = "id";

  /** Query parameter name for stock SKU. */
  public static final String PARAM_SKU = "sku";

  /** Query parameter name for reservation quantity. */
  public static final String PARAM_QTY = "qty";

  /** Query parameter name for pricing tier. */
  public static final String PARAM_TIER = "tier";

  /** Path variable name for category analytics lookup. */
  public static final String PARAM_CATEGORY = "category";

  /** Default customer pricing tier. */
  public static final String TIER_STANDARD = "STANDARD";

  /** VIP customer pricing tier. */
  public static final String TIER_VIP = "VIP";

  /** Merchant bulk pricing tier. */
  public static final String TIER_MERCHANT = "MERCHANT";

  /** AutoCode prefix for ShopOrder order numbers. */
  public static final String PREFIX_ORDER_CODE = "NVM-";

  /** AutoCode prefix for MerchantListing codes. */
  public static final String PREFIX_LISTING_CODE = "ML-";

  /** AutoCode prefix for CheckoutPayment reference codes. */
  public static final String PREFIX_PAYMENT_CODE = "PAY-";

  /** Initial state for ShopOrder state machine. */
  public static final String ORDER_STATE_DRAFT = "DRAFT";

  /** Pending payment state for ShopOrder. */
  public static final String ORDER_STATE_PENDING_PAYMENT = "PENDING_PAYMENT";

  /** Paid state for ShopOrder. */
  public static final String ORDER_STATE_PAID = "PAID";

  /** Shipped state for ShopOrder. */
  public static final String ORDER_STATE_SHIPPED = "SHIPPED";

  /** Delivered state for ShopOrder. */
  public static final String ORDER_STATE_DELIVERED = "DELIVERED";

  /** Cancelled state for ShopOrder. */
  public static final String ORDER_STATE_CANCELLED = "CANCELLED";

  /** Refunded state for ShopOrder. */
  public static final String ORDER_STATE_REFUNDED = "REFUNDED";

  /** State machine transition rule from DRAFT. */
  public static final String TRANSITION_FROM_DRAFT = "DRAFT:PENDING_PAYMENT,CANCELLED";

  /** State machine transition rule from PENDING_PAYMENT. */
  public static final String TRANSITION_FROM_PENDING = "PENDING_PAYMENT:PAID,CANCELLED";

  /** State machine transition rule from PAID. */
  public static final String TRANSITION_FROM_PAID = "PAID:SHIPPED,REFUNDED";

  /** State machine transition rule from SHIPPED. */
  public static final String TRANSITION_FROM_SHIPPED = "SHIPPED:DELIVERED";

  /** Audit trail category for ShopOrder. */
  public static final String AUDIT_CATEGORY_SHOP_ORDER = "NOVAMART_SHOP_ORDER";

  /** Default status for MerchantListing. */
  public static final String LISTING_STATUS_ACTIVE = "ACTIVE";

  /** Default status for CheckoutPayment. */
  public static final String PAYMENT_STATUS_CAPTURED = "CAPTURED";

  /** Default currency code. */
  public static final String CURRENCY_USD = "USD";

  /** Webhook event name for creation. */
  public static final String WEBHOOK_EVENT_CREATED = "CREATED";

  /** Webhook event name for update. */
  public static final String WEBHOOK_EVENT_UPDATED = "UPDATED";

  /** Webhook event name for state change. */
  public static final String WEBHOOK_EVENT_STATE_CHANGED = "STATE_CHANGED";

  /** Webhook HMAC signature header. */
  public static final String WEBHOOK_SECRET_HEADER = "X-Webhook-Signature";

  /** CNCF CloudEvents type for checkout payments. */
  public static final String CLOUD_EVENT_PAYMENT_TYPE = "com.novamart.ecommerce.payment.v1";

  /** Resilience name for public catalog endpoints. */
  public static final String RESILIENCE_PUBLIC_CATALOG = "novaPublicCatalog";

  /** Rate limit partition key by client IP. */
  public static final String RATE_LIMIT_PARTITION_IP = "IP";

  /** Spring bean name for PublicCatalogCacheHelper. */
  public static final String BEAN_PUBLIC_CATALOG_CACHE_HELPER = "publicCatalogCacheHelper";

  /** Method name on PublicCatalogCacheHelper. */
  public static final String METHOD_GET_CACHED_PRODUCT_BY_ID = "getCachedProductById";

  /** Spring bean name for StockReservationServiceImpl. */
  public static final String BEAN_STOCK_RESERVATION_SERVICE = "stockReservationService";

  /** Method name on StockReservationService. */
  public static final String METHOD_RESERVE_STOCK = "reserveStock";

  /** Spring bean name for OrderSummaryHelper. */
  public static final String BEAN_ORDER_SUMMARY_HELPER = "orderSummaryHelper";

  /** Method name on OrderSummaryHelper. */
  public static final String METHOD_BUILD_CHECKOUT_SUMMARY = "buildCheckoutSummary";

  /** Spring bean name for OrderPricingOverrideHelper. */
  public static final String BEAN_ORDER_PRICING_OVERRIDE_HELPER = "orderPricingOverrideHelper";

  /** Method name on OrderPricingOverrideHelper. */
  public static final String METHOD_CALCULATE_PRICING_QUOTE = "calculatePricingQuote";

  /** Spring bean name for SalesAnalyticsServiceImpl. */
  public static final String BEAN_SALES_ANALYTICS_SERVICE = "salesAnalyticsService";

  /** Method name on SalesAnalyticsService for summarizing category sales. */
  public static final String METHOD_SUMMARIZE_CATEGORY_SALES = "summarizeCategorySales";

  /** Method name on SalesAnalyticsDispatchHelper for category sales analytics endpoint. */
  public static final String METHOD_GET_CATEGORY_SALES_ANALYTICS = "getCategorySalesAnalytics";

  /** Method name on SalesAnalyticsService for evicting category analytics cache. */
  public static final String METHOD_EVICT_CATEGORY_SALES_CACHE = "evictCategorySalesCache";

  /** SpEL distributed lock key expression for warehouse SKU reservation. */
  public static final String SPEL_LOCK_STOCK_SKU = "'STOCK_' + #sku";

  /** Cache region name for category sales analytics. */
  public static final String CACHE_SALES_ANALYTICS = "novaCategorySalesAnalytics";

  /** SpEL cache key expression for category sales analytics. */
  public static final String SPEL_CACHE_CATEGORY_KEY = "'CAT_' + #category";

  /** Configuration properties prefix for NovaMart multi-datasource pools. */
  public static final String CONFIG_PREFIX_DATASOURCE = "novamart.datasource";

  /** HikariCP pool name for PRIMARY datasource. */
  public static final String POOL_NAME_PRIMARY = "NovaMart-PrimaryPool";

  /** HikariCP pool name for REPLICA datasource. */
  public static final String POOL_NAME_REPLICA = "NovaMart-ReplicaPool";

  /** Sort field for AI natural language product queries. */
  public static final String FIELD_RETAIL_PRICE = "retailPrice";

  /** Ascending sort direction literal. */
  public static final String SORT_DIR_ASC = "asc";

  /** Default carrier service name for outbound shipping calls. */
  public static final String SERVICE_PARTNER_SHIPPING = "NovaPartnerShipping";

  /** Fallback datasource key when context holder is empty. */
  public static final String FALLBACK_DATASOURCE_PRIMARY = "PRIMARY";

  /** Prefix for private HTTP Cache-Control header. */
  public static final String CACHE_CONTROL_PRIVATE_PREFIX = "private, max-age=";

  /** Suffix for must-revalidate HTTP Cache-Control directive. */
  public static final String CACHE_CONTROL_MUST_REVALIDATE_SUFFIX = ", must-revalidate";

  /** JPQL query for finding active warehouse stock by SKU. */
  public static final String JPQL_FIND_STOCK_BY_SKU =
      "SELECT w FROM WarehouseStock w WHERE w.sku = :sku AND w.deleted = false";

  /** JPQL query for loading all non-deleted shop orders. */
  public static final String JPQL_FIND_ACTIVE_ORDERS =
      "SELECT o FROM ShopOrder o WHERE o.deleted = false";

  /** JPQL query for loading active storefront products by category code. */
  public static final String JPQL_FIND_PRODUCTS_BY_CATEGORY =
      "SELECT p FROM StorefrontProduct p WHERE p.categoryCode = :category AND p.deleted = false";

  private NovaFieldConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
