package com.novamart.ecommerce.constant;

/**
 * Role name constants used across NovaMart security annotations and tests.
 */
public final class NovaRoleConstant {

  /** Standard buyer / customer authority. */
  public static final String ROLE_USER = "ROLE_USER";

  /** Merchant seller authority for managing storefronts and listings. */
  public static final String ROLE_MERCHANT = "ROLE_MERCHANT";

  /** Platform administrator authority. */
  public static final String ROLE_ADMIN = "ROLE_ADMIN";

  /** Super administrator authority with cross-tenant bypass privileges. */
  public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";

  /** Dynamic DB-RBAC auditor authority for policy verification. */
  public static final String ROLE_CATALOG_AUDITOR = "ROLE_CATALOG_AUDITOR";

  /** Dynamic DB-RBAC suspended merchant role for explicit DENY verification. */
  public static final String ROLE_SUSPENDED_MERCHANT = "ROLE_SUSPENDED_MERCHANT";

  /** Utility class instantiation guard message. */
  public static final String MSG_CONSTANT_CLASS = "Constant class cannot be instantiated";

  private NovaRoleConstant() {
    throw new UnsupportedOperationException(MSG_CONSTANT_CLASS);
  }
}
