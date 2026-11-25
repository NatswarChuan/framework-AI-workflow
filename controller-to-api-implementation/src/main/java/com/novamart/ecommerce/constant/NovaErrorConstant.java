package com.novamart.ecommerce.constant;

/**
 * Business error codes and human-readable default messages for NovaMart exceptions.
 */
public final class NovaErrorConstant {

  /** Error code when requested stock quantity exceeds available units. */
  public static final String CODE_INSUFFICIENT_STOCK = "NOVAMART_INSUFFICIENT_STOCK";

  /** Error message format when stock is insufficient. */
  public static final String MSG_INSUFFICIENT_STOCK =
      "Insufficient available stock for SKU '%s': requested %d, available %d";

  /** Error code when warehouse stock SKU does not exist. */
  public static final String CODE_STOCK_NOT_FOUND = "NOVAMART_STOCK_NOT_FOUND";

  /** Error message format when stock SKU is missing. */
  public static final String MSG_STOCK_NOT_FOUND = "Warehouse stock record not found for SKU '%s'";

  /** Error code when stock reservation request parameters are invalid. */
  public static final String CODE_INVALID_RESERVATION = "NOVAMART_INVALID_RESERVATION";

  /** Error message when SKU is blank or null. */
  public static final String MSG_SKU_REQUIRED = "Reservation SKU must not be blank";

  /** Error message when quantity is null or non-positive. */
  public static final String MSG_QUANTITY_POSITIVE = "Reservation quantity must be greater than zero";

  /** Error code when storefront product cannot be found. */
  public static final String CODE_PRODUCT_NOT_FOUND = "NOVAMART_PRODUCT_NOT_FOUND";

  /** Error message format when storefront product ID is not found. */
  public static final String MSG_PRODUCT_NOT_FOUND = "Storefront product not found for id '%s'";

  /** Error code when order cannot be found for pricing quote. */
  public static final String CODE_ORDER_NOT_FOUND = "NOVAMART_ORDER_NOT_FOUND";

  /** Error message format when order ID is missing. */
  public static final String MSG_ORDER_NOT_FOUND = "Shop order not found for id '%s'";

  /** Error code when category analytics input is blank. */
  public static final String CODE_INVALID_CATEGORY = "NOVAMART_INVALID_CATEGORY";

  /** Error message when category code is blank. */
  public static final String MSG_CATEGORY_REQUIRED = "Analytics category code must not be blank";

  /** Error code when AI prompt or shipping URL is blank. */
  public static final String CODE_INVALID_INTEGRATION_INPUT = "NOVAMART_INVALID_INTEGRATION_INPUT";

  /** Error message when natural language prompt is blank. */
  public static final String MSG_PROMPT_REQUIRED = "Natural language query prompt must not be blank";

  /** Error message when shipping endpoint URL is blank. */
  public static final String MSG_ENDPOINT_REQUIRED = "Partner shipping target URL must not be blank";

  private NovaErrorConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
