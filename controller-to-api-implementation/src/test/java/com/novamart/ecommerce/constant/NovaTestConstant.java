package com.novamart.ecommerce.constant;

import java.math.BigDecimal;

/**
 * Shared constants for NovaMart unit and integration test suites.
 */
public final class NovaTestConstant {

  /** Bearer token prefix for HTTP Authorization headers. */
  public static final String BEARER_PREFIX = "Bearer ";

  /** Test user subject ID for regular buyer. */
  public static final String USER_ID_BUYER = "u-buyer-001";

  /** Test username for regular buyer. */
  public static final String USERNAME_BUYER = "buyer.novamart";

  /** Test user subject ID for merchant. */
  public static final String USER_ID_MERCHANT = "u-merchant-001";

  /** Test username for merchant. */
  public static final String USERNAME_MERCHANT = "merchant.novamart";

  /** Test user subject ID for admin. */
  public static final String USER_ID_ADMIN = "u-admin-001";

  /** Test username for admin. */
  public static final String USERNAME_ADMIN = "admin.novamart";

  /** Test user subject ID for super admin. */
  public static final String USER_ID_SUPER_ADMIN = "u-super-001";

  /** Test username for super admin. */
  public static final String USERNAME_SUPER_ADMIN = "superadmin.novamart";

  /** Test username for dynamic DB-RBAC auditor user. */
  public static final String USERNAME_RBAC_AUDITOR = "alice.auditor";

  /** Test user ID for dynamic DB-RBAC auditor user. */
  public static final String USER_ID_RBAC_AUDITOR = "u-auditor-001";

  /** Tenant ID A for multi-tenant isolation tests. */
  public static final String TENANT_ALPHA = "TENANT-ALPHA";

  /** Tenant ID B for cross-tenant IDOR denial tests. */
  public static final String TENANT_BETA = "TENANT-BETA";

  /** Sample SKU code for tests. */
  public static final String SAMPLE_SKU = "NVM-SKU-LAPTOP-01";

  /** Sample product name for tests. */
  public static final String SAMPLE_PRODUCT_NAME = "NovaBook Pro 16 Ultra";

  /** Sample category code for tests. */
  public static final String SAMPLE_CATEGORY = "LAPTOPS";

  /** Sample brand name for tests. */
  public static final String SAMPLE_BRAND = "NovaTech";

  /** Sample warehouse code. */
  public static final String SAMPLE_WAREHOUSE = "WH-SG-01";

  /** Sample customer email. */
  public static final String SAMPLE_EMAIL = "customer@novamart.test";

  /** Sample merchant code. */
  public static final String SAMPLE_MERCHANT_CODE = "MERCH-001";

  /** Sample retail price. */
  public static final BigDecimal SAMPLE_RETAIL_PRICE = new BigDecimal("1999.00");

  /** Sample confidential supplier cost. */
  public static final BigDecimal SAMPLE_SUPPLIER_COST = new BigDecimal("1120.50");

  /** Sample order subtotal. */
  public static final BigDecimal SAMPLE_SUBTOTAL = new BigDecimal("500.00");

  /** Sample order total. */
  public static final BigDecimal SAMPLE_TOTAL = new BigDecimal("500.00");

  /** Sample webhook callback URL. */
  public static final String SAMPLE_WEBHOOK_URL = "https://partners.novamart.test/webhooks/payments";

  /** Sample webhook HMAC secret. */
  public static final String SAMPLE_WEBHOOK_SECRET = "novamart-hmac-secret-256bit";

  /** Sample shipping carrier URL. */
  public static final String SAMPLE_CARRIER_URL = "https://shipping.novamart.test/v1/rates";

  /** Active Spring test profile name. */
  public static final String PROFILE_TEST = "test";

  private NovaTestConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
