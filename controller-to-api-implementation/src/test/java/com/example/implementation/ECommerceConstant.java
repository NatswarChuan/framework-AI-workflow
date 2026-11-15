package com.example.implementation;

/**
 * Constants defining business identifiers, state machine states, and API endpoints
 * for the B2C2B2C e-commerce platform implementation.
 *
 * <p>Strictly complies with the zero hard-code policy and SonarQube quality standards.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
public final class ECommerceConstant {

  private ECommerceConstant() {
    throw new UnsupportedOperationException("Utility class cannot be instantiated");
  }

  // --- API Base Endpoints ---
  public static final String VENDOR_STORES_API = "/api/v1/vendor-stores";
  public static final String PRODUCT_CATALOGS_API = "/api/v1/product-catalogs";
  public static final String INVENTORY_STOCKS_API = "/api/v1/inventory-stocks";
  public static final String SHOPPING_CARTS_API = "/api/v1/shopping-carts";
  public static final String ECOMMERCE_ORDERS_API = "/api/v1/e-commerce-orders";
  public static final String PAYMENT_TRANSACTIONS_API = "/api/v1/payment-transactions";
  public static final String ELECTRONIC_INVOICES_API = "/api/v1/electronic-invoices";
  public static final String COUPON_VOUCHERS_API = "/api/v1/coupon-vouchers";

  // --- Order State Machine States ---
  public static final String STATE_CREATED = "CREATED";
  public static final String STATE_PENDING_PAYMENT = "PENDING_PAYMENT";
  public static final String STATE_CONFIRMED = "CONFIRMED";
  public static final String STATE_ALLOCATED = "ALLOCATED";
  public static final String STATE_SHIPPED = "SHIPPED";
  public static final String STATE_DELIVERED = "DELIVERED";
  public static final String STATE_COMPLETED = "COMPLETED";
  public static final String STATE_CANCELLED = "CANCELLED";
  public static final String STATE_REFUNDED = "REFUNDED";

  // --- Payment States & Providers ---
  public static final String PAYMENT_PENDING = "PENDING";
  public static final String PAYMENT_SUCCESS = "SUCCESS";
  public static final String PAYMENT_FAILED = "FAILED";
  public static final String PAYMENT_REFUNDED = "REFUNDED";

  public static final String METHOD_CREDIT_CARD = "CREDIT_CARD";
  public static final String METHOD_E_WALLET = "E_WALLET";
  public static final String METHOD_BANK_TRANSFER = "BANK_TRANSFER";

  // --- Auto Code Prefixes ---
  public static final String PREFIX_VENDOR_CODE = "VND-";
  public static final String PREFIX_ORDER_CODE = "ORD-B2C2B2C-";
  public static final String PREFIX_INVOICE_NO = "INV-ECOM-";
  public static final String PREFIX_TXN_REF = "TXN-";

  // --- Sample Test Identifiers ---
  public static final String SAMPLE_STORE_NAME = "Tokyo Electronics Official Store";
  public static final String SAMPLE_STORE_CODE = "VND-TOKYO-ELEC-01";
  public static final String SAMPLE_BUSINESS_LICENSE = "BL-JP-99887711";
  public static final String SAMPLE_STORE_DESCRIPTION = "Flagship merchant for authentic Japanese electronics";

  public static final String SAMPLE_SKU = "SKU-SONY-WH1000XM5-BLK";
  public static final String SAMPLE_PROD_NAME = "Sony WH-1000XM5 Wireless Headphones";
  public static final String SAMPLE_CATEGORY = "Audio & Electronics";
  public static final String SAMPLE_BRAND = "Sony";
  public static final String SAMPLE_RETAIL_PRICE = "399.99";
  public static final String SAMPLE_COST_PRICE = "240.00";
  public static final String SAMPLE_B2B_PRICE = "299.99";

  public static final String SAMPLE_STOCK_SKU = "STK-SONY-XM5-WH01";
  public static final String SAMPLE_WAREHOUSE_CODE = "WH-TOKYO-CENTRAL";
  public static final int INITIAL_STOCK_QTY = 500;
  public static final int RESERVED_STOCK_QTY = 0;

  public static final String SAMPLE_COUPON_CODE = "DISCOUNT-SPRING-50";
  public static final String SAMPLE_COUPON_DISCOUNT = "50.00";
  public static final String SAMPLE_MIN_ORDER_AMOUNT = "200.00";

  public static final String SAMPLE_CUSTOMER_EMAIL = "consumer.tanaka@example.jp";
  public static final String SAMPLE_CUSTOMER_NAME = "Kenji Tanaka";
  public static final String SAMPLE_SHIPPING_ADDRESS = "1-1 Chiyoda, Chiyoda City, Tokyo 100-8111, Japan";

  public static final String SAMPLE_IDEMPOTENCY_KEY = "idem-key-order-9988-uuidv7";

  // --- Dynamic Application-Level Security Roles ---
  public static final String ROLE_PLATFORM_ADMIN = "ROLE_PLATFORM_ADMIN";
  public static final String ROLE_VENDOR_ADMIN = "ROLE_VENDOR_ADMIN";
  public static final String ROLE_MERCHANT_RESELLER = "ROLE_MERCHANT_RESELLER";
  public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";
  public static final String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

  // --- Standard Error Codes Handled by Framework ---
  public static final String ERR_CONFLICT = "error.resource.conflict";
  public static final String ERR_BUSINESS_RULE_VIOLATION = "error.business.rule.violation";
  public static final String ERR_RESOURCE_NOT_FOUND = "error.resource.not.found";
  public static final String ERR_METHOD_NOT_ALLOWED = "error.http.method.not.allowed";
  public static final String ERR_MALFORMED_JSON = "error.http.json.malformed";
  public static final String ERR_INVALID_PARAMETER = "error.parameter.invalid";
  public static final String ERR_VALIDATION_FAILED = "error.validation.failed";
  public static final String ERR_FORBIDDEN = "error.security.forbidden";
  public static final String ERR_UNAUTHORIZED = "error.security.unauthorized";
}

