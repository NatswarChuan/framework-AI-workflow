package com.example.implementation.provider;


import com.example.implementation.constant.AdvancedBusinessConstant;
import io.github.natswarchuan.core.customsql.provider.CustomSqlProvider;
import java.util.Map;
import java.util.Objects;
import org.springframework.stereotype.Component;

/**
 * Enterprise Dynamic SQL Provider generating MyBatis-equivalent dynamic SQL
 * with dynamic branching, filtering, and ordering logic in pure Java.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@Component
public class VendorStoreDynamicSqlProvider implements CustomSqlProvider {

  /**
   * Generates dynamic native SQL query based on provided runtime parameters.
   *
   * @param queryName logical query name
   * @param parameters runtime method parameter map
   * @return dynamic native SQL string
   */
  @Override
  public String generateSql(final String queryName, final Map<String, Object> parameters) {
    final StringBuilder sql = new StringBuilder(
        AdvancedBusinessConstant.STR_SELECT_V_STORE_CODE_AS_STORE_CODE_V
        + AdvancedBusinessConstant.STR_COUNT_O_ID_AS_TOTAL_ORDERS
        + AdvancedBusinessConstant.STR_COALESCE_SUM_O_GROSS_AMOUNT_0_0_AS_T
        + AdvancedBusinessConstant.STR_COALESCE_AVG_O_GROSS_AMOUNT_0_0_AS_A
        + AdvancedBusinessConstant.STR_FROM_TBL_VENDOR_STORES_V
        + AdvancedBusinessConstant.STR_LEFT_JOIN_TBL_ECOMMERCE_ORDERS_O_ON
        + AdvancedBusinessConstant.STR_WHERE_V_ACTIVE_TRUE
    );

    if (Objects.nonNull(parameters)) {
      final Object minOrders = parameters.get(AdvancedBusinessConstant.STR_MIN_ORDERS);
      if (Objects.nonNull(minOrders)) {
        sql.append(AdvancedBusinessConstant.STR_AND_O_ID_IS_NOT_NULL);
      }
      final Object storeCodePrefix = parameters.get(AdvancedBusinessConstant.STR_STORE_CODE_PREFIX);
      if (Objects.nonNull(storeCodePrefix)) {
        sql.append(AdvancedBusinessConstant.STR_AND_V_STORE_CODE_LIKE_STORE_CODE_PRE);
      }
    }

    sql.append(AdvancedBusinessConstant.STR_GROUP_BY_V_STORE_CODE_V_STORE_NAME_O);
    return sql.toString();
  }
}

