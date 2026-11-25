package com.novamart.ecommerce.constant;

import java.math.BigDecimal;

/**
 * Numeric thresholds, lock timeouts, cache TTLs, and financial rate constants for NovaMart.
 */
public final class NovaNumericConstant {

  /** Zero integer literal. */
  public static final int INT_ZERO = 0;

  /** One integer literal. */
  public static final int INT_ONE = 1;

  /** Zero long literal. */
  public static final long LONG_ZERO = 0L;

  /** Default page size for AI natural language query. */
  public static final int AI_QUERY_PAGE_SIZE = 10;

  /** Scale used for monetary calculations. */
  public static final int MONEY_SCALE = 2;

  /** Public catalog rate limit requests per window (sized for load testing). */
  public static final int PUBLIC_RATE_LIMIT_REQUESTS = 5000;

  /** Public catalog rate limit window duration in seconds. */
  public static final int PUBLIC_RATE_LIMIT_WINDOW_SECONDS = 60;

  /** Circuit breaker failure rate threshold percentage. */
  public static final float CB_FAILURE_RATE_THRESHOLD = 50.0f;

  /** Circuit breaker sliding window size. */
  public static final int CB_SLIDING_WINDOW_SIZE = 20;

  /** Circuit breaker open state wait duration in seconds. */
  public static final int CB_WAIT_OPEN_SECONDS = 10;

  /** Retry max attempts for public catalog reads. */
  public static final int RETRY_MAX_ATTEMPTS = 3;

  /** Retry wait duration in milliseconds. */
  public static final long RETRY_WAIT_DURATION_MS = 200L;

  /** HTTP ETag cache max-age in seconds. */
  public static final int HTTP_CACHE_MAX_AGE_SECONDS = 60;

  /** Distributed lock wait timeout in milliseconds. */
  public static final long LOCK_WAIT_TIME_MS = 3000L;

  /** Distributed lock lease duration in milliseconds. */
  public static final long LOCK_LEASE_TIME_MS = 5000L;

  /** DB-RBAC entity cache TTL in seconds. */
  public static final long RBAC_CACHE_TTL_SECONDS = 60L;

  /** DB-RBAC policy evaluation priority (lower runs first). */
  public static final int RBAC_POLICY_PRIORITY = 10;

  /** Default HikariCP max pool size. */
  public static final int DEFAULT_MAX_POOL_SIZE = 20;

  /** Standard customer loyalty discount rate (0%). */
  public static final BigDecimal DISCOUNT_RATE_STANDARD = new BigDecimal("0.00");

  /** VIP customer loyalty discount rate (10%). */
  public static final BigDecimal DISCOUNT_RATE_VIP = new BigDecimal("0.10");

  /** Merchant bulk discount rate (15%). */
  public static final BigDecimal DISCOUNT_RATE_MERCHANT = new BigDecimal("0.15");

  /** Standard sales tax rate (8%). */
  public static final BigDecimal SALES_TAX_RATE = new BigDecimal("0.08");

  /** Minimum non-negative decimal string for Bean Validation. */
  public static final String DECIMAL_MIN_ZERO = "0.00";

  /** Column length for short codes. */
  public static final int COL_LEN_CODE = 64;

  /** Column length for medium labels. */
  public static final int COL_LEN_NAME = 200;

  /** Column length for slugs and URLs. */
  public static final int COL_LEN_SLUG = 250;

  /** Column length for CSV lists and policy descriptions. */
  public static final int COL_LEN_CSV = 500;

  /** Decimal precision for monetary columns. */
  public static final int MONEY_PRECISION = 14;

  private NovaNumericConstant() {
    throw new UnsupportedOperationException(NovaRoleConstant.MSG_CONSTANT_CLASS);
  }
}
