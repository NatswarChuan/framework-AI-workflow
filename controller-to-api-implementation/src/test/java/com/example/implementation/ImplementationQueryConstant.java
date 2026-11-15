package com.example.implementation;

/**
 * Constants for JSONPath expressions, query parameters, subpaths, and filter values
 * used in integration testing for the implementation project.
 * Adheres strictly to zero magic string/number policy.
 *
 * @author NatswarChuan
 */
public final class ImplementationQueryConstant {

  /** Root JSON data field name. */
  public static final String FIELD_DATA = "data";

  /** JSONPath expression to verify entity ID. */
  public static final String JSON_DATA_ID = "$.data.id";

  /** JSONPath expression to verify total elements in pagination response. */
  public static final String JSON_TOTAL_ELEMENTS = "$.data.totalElements";

  /** JSONPath expression to verify length of the data array. */
  public static final String JSON_DATA_LENGTH = "$.data.length()";

  /** JSONPath expression to verify boolean data value. */
  public static final String JSON_DATA_VALUE = "$.data";

  /** JSONPath expression to verify author pen name of a post. */
  public static final String JSON_POST_AUTHOR_PEN_NAME = "$.data.author.penName";

  /** JSONPath expression to verify view count of a post. */
  public static final String JSON_POST_VIEW_COUNT = "$.data.viewCount";

  /** JSONPath expression to verify soft delete flag. */
  public static final String JSON_DATA_DELETED = "$.data.deleted";

  /** JSONPath expression to verify post slug. */
  public static final String JSON_POST_SLUG = "$.data.slug";

  /** JSONPath expression to verify aggregation count. */
  public static final String JSON_AGG_COUNT = "$.data.count";

  /** JSONPath expression to verify aggregation sum. */
  public static final String JSON_AGG_SUM = "$.data.sum";

  /** JSONPath expression to verify aggregation average. */
  public static final String JSON_AGG_AVERAGE = "$.data.average";

  /** JSONPath expression to verify order number. */
  public static final String JSON_ORDER_NUMBER = "$.data.orderNumber";

  /** JSONPath expression to verify order status. */
  public static final String JSON_ORDER_STATUS = "$.data.orderStatus";

  /** JSONPath expression to verify order total amount. */
  public static final String JSON_ORDER_TOTAL_AMOUNT = "$.data.totalAmount";

  /** JSONPath expression to verify line item 0 subtotal. */
  public static final String JSON_ITEM_0_SUB_TOTAL = "$.data.items[0].subTotal";

  /** JSONPath expression to verify line item 1 subtotal. */
  public static final String JSON_ITEM_1_SUB_TOTAL = "$.data.items[1].subTotal";

  /** JSONPath expression to verify count of supported operators in metadata. */
  public static final String JSON_METADATA_OPS_LEN = "$.data.supportedOperators.length()";

  /** JSONPath expression to verify error trace ID. */
  public static final String JSON_TRACE_ID = "$.traceId";

  /** JSONPath expression to verify first group-by field value. */
  public static final String JSON_GROUP_0_FIELD = "$.data[0].groupField";

  /** JSONPath expression to verify employee code. */
  public static final String JSON_EMP_CODE = "$.data.employeeCode";

  /** JSONPath expression to verify employee salary. */
  public static final String JSON_EMP_SALARY = "$.data.salary";

  /** JSONPath expression to verify employee status. */
  public static final String JSON_EMP_STATUS = "$.data.employmentStatus";

  /** JSONPath expression to verify first employee email in list. */
  public static final String JSON_EMP_0_EMAIL = "$.data[0].workEmail";

  /** JSONPath expression to verify first employee status in list. */
  public static final String JSON_EMP_0_STATUS = "$.data[0].employmentStatus";

  /** Query parameter for filtering author pen name. */
  public static final String PARAM_AUTHOR_PEN_NAME = "author.penName";

  /** Query parameter for filtering author reputation score greater than or equal to. */
  public static final String PARAM_AUTHOR_REP_GTE = "author.reputationScore.gte";

  /** Query parameter for filtering view count greater than or equal to. */
  public static final String PARAM_VIEW_COUNT_GTE = "viewCount.gte";

  /** Field name for view count. */
  public static final String FIELD_VIEW_COUNT = "viewCount";

  /** Field name for slug. */
  public static final String FIELD_SLUG = "slug";

  /** Search keyword for Dynamic Proxy. */
  public static final String SEARCH_DYNAMIC_PROXY = "Dynamic Proxy";

  /** String literal for 900. */
  public static final String STR_900 = "900";

  /** String literal for 10000. */
  public static final String STR_10000 = "10000";

  /** String literal for 50. */
  public static final String STR_50 = "50";

  /** Large negative number string for boundary validation testing. */
  public static final String STR_NEGATIVE_999999 = "-999999";

  /** Expected view count 15050 after adding 50. */
  public static final int VIEWS_15050 = 15050;

  /** String literal for true. */
  public static final String STR_TRUE = "true";

  /** Query parameter for filtering salary range. */
  public static final String PARAM_SALARY_BETWEEN = "salary.between";

  /** Filter value for salary between 2500 and 5500. */
  public static final String VAL_SALARY_2500_5500 = "2500,5500";

  /** Query parameter for filtering employment status not in list. */
  public static final String PARAM_STATUS_NOT_IN = "employmentStatus.notIn";

  /** Filter value for resigned and terminated status codes. */
  public static final String VAL_RESIGNED_TERMINATED = "RESIGNED,TERMINATED";

  /** Query parameter for filtering company tax code via department. */
  public static final String PARAM_DEPT_COMPANY_TAX = "department.company.taxCode";

  /** Query parameter for filtering department code. */
  public static final String PARAM_DEPT_CODE_FILTER = "department.code";

  /** Query parameter for filtering company country code 3-levels deep. */
  public static final String PARAM_ORDER_COMPANY_COUNTRY =
      "customer.department.company.countryCode";

  /** Query parameter for filtering department annual budget 2-levels deep. */
  public static final String PARAM_ORDER_DEPT_BUDGET_GTE =
      "customer.department.annualBudget.gte";

  /** String literal for 400000. */
  public static final String STR_400000 = "400000";

  /** Query parameter for filtering customer tag code. */
  public static final String PARAM_CUSTOMER_TAG_CODE = "customer.tags.code";

  /** Query parameter for filtering product name in line items using like. */
  public static final String PARAM_ITEMS_PROD_NAME_LIKE = "items.productName.like";

  /** Search keyword for H100. */
  public static final String KEYWORD_H100 = "H100";

  /** Query parameter for filtering order total amount greater than or equal to. */
  public static final String PARAM_TOTAL_AMOUNT_GTE = "totalAmount.gte";

  /** String literal for 50000. */
  public static final String STR_50000 = "50000";

  /** Sort parameter by customer department code. */
  public static final String SORT_CUSTOMER_DEPT_CODE = "customer.department.code";

  /** Subpath for querying entity by slug. */
  public static final String SUBPATH_BY_SLUG = "/by-slug/";

  /** Subpath for checking existence by tax code. */
  public static final String SUBPATH_EXISTS_TAX_CODE = "/exists-by-tax-code/";

  /** Subpath for querying orders by status. */
  public static final String SUBPATH_BY_STATUS = "/by-status/";

  /** Subpath for restoring soft-deleted entity. */
  public static final String SUBPATH_RESTORE = "/restore";

  /** Subpath for atomic increment/decrement operations. */
  public static final String SUBPATH_INCREMENT = "/increment";

  /** Subpath for entity cloning operations. */
  public static final String SUBPATH_CLONE = "/clone";

  /** Subpath for lifecycle state transition. */
  public static final String SUBPATH_TRANSITION = "/transition";

  /** Subpath for employee promotion custom operation. */
  public static final String SUBPATH_PROMOTE = "/promote";

  private ImplementationQueryConstant() {
    // Prevent instantiation of utility constant class
  }
}
