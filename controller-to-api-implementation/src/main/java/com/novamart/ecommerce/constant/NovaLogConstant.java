package com.novamart.ecommerce.constant;

/**
 * Structured start and finish log message templates for NovaMart services, helpers, and providers.
 */
public final class NovaLogConstant {

  /** Log start for cached product detail lookup. */
  public static final String START_GET_CACHED_PRODUCT = "Starting cached product lookup for id={}";

  /** Log finish for cached product detail lookup. */
  public static final String FINISH_GET_CACHED_PRODUCT = "Finished cached product lookup for id={}";

  /** Log start for stock reservation service. */
  public static final String START_RESERVE_STOCK =
      "Starting atomic stock reservation for sku={}, qty={}";

  /** Log finish for stock reservation service. */
  public static final String FINISH_RESERVE_STOCK =
      "Finished atomic stock reservation for sku={}, remaining={}";

  /** Log start for order checkout summary aggregation. */
  public static final String START_ORDER_SUMMARY = "Starting shop order checkout summary aggregation";

  /** Log finish for order checkout summary aggregation. */
  public static final String FINISH_ORDER_SUMMARY =
      "Finished shop order checkout summary aggregation: totalOrders={}";

  /** Log start for order pricing quote override. */
  public static final String START_ORDER_PRICING_QUOTE =
      "Starting order pricing quote calculation for orderId={}, tier={}";

  /** Log finish for order pricing quote override. */
  public static final String FINISH_ORDER_PRICING_QUOTE =
      "Finished order pricing quote calculation for orderId={}, finalPayable={}";

  /** Log start for category sales analytics. */
  public static final String START_SALES_ANALYTICS =
      "Starting category sales analytics for category={}, dataSource={}";

  /** Log finish for category sales analytics. */
  public static final String FINISH_SALES_ANALYTICS =
      "Finished category sales analytics for category={}, productCount={}";

  /** Log start for evicting sales analytics cache. */
  public static final String START_EVICT_SALES_CACHE =
      "Starting eviction of category sales analytics cache";

  /** Log finish for evicting sales analytics cache. */
  public static final String FINISH_EVICT_SALES_CACHE =
      "Finished eviction of category sales analytics cache";

  /** Log start for outbox event dispatch. */
  public static final String START_OUTBOX_DISPATCH =
      "Starting NovaMart outbox dispatch for aggregateType={}, eventType={}";

  /** Log finish for outbox event dispatch. */
  public static final String FINISH_OUTBOX_DISPATCH =
      "Finished NovaMart outbox dispatch for aggregateId={}, totalRecorded={}";

  /** Log start for AI system context generation. */
  public static final String START_AI_SYSTEM_PROMPT =
      "Starting AI system context prompt generation for StorefrontProduct";

  /** Log finish for AI system context generation. */
  public static final String FINISH_AI_SYSTEM_PROMPT =
      "Finished AI system context prompt generation: length={}";

  /** Log start for AI natural language query. */
  public static final String START_AI_NL_QUERY =
      "Starting AI natural language catalog query: prompt={}";

  /** Log finish for AI natural language query. */
  public static final String FINISH_AI_NL_QUERY =
      "Finished AI natural language catalog query: interpreted={}";

  /** Log start for partner shipping call. */
  public static final String START_PARTNER_SHIPPING =
      "Starting outbound partner shipping call to url={}";

  /** Log finish for partner shipping call. */
  public static final String FINISH_PARTNER_SHIPPING =
      "Finished outbound partner shipping call: statusCode={}";

  /** Log start for webhook subscriber registration. */
  public static final String START_WEBHOOK_REGISTER =
      "Starting webhook subscriber registration for entity={}, url={}";

  /** Log finish for webhook subscriber registration. */
  public static final String FINISH_WEBHOOK_REGISTER =
      "Finished webhook subscriber registration: subscriptionId={}";

  /** Log start for multi-datasource initialization. */
  public static final String START_DATASOURCE_INIT =
      "Starting NovaMart PRIMARY and REPLICA routing datasource initialization";

  /** Log finish for multi-datasource initialization. */
  public static final String FINISH_DATASOURCE_INIT =
      "Finished NovaMart PRIMARY and REPLICA routing datasource initialization";

  private NovaLogConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
