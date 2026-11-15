package com.example.implementation.controller;



import com.example.implementation.provider.VendorStoreDynamicSqlProvider;
import com.example.implementation.dto.VendorRevenueSummaryDto;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.CustomQuery;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.VendorStore;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Dynamic proxy REST controller for {@link VendorStore} entities.
 *
 * <p>Auto-generates enterprise endpoints at {@code /api/v1/vendor-stores} and showcases
 * MyBatis-level custom SQL capabilities:
 * <ul>
 *   <li>Complex native SQL query with CTE (Common Table Expressions) and window aggregation.</li>
 *   <li>Dynamic SQL evaluation via {@link VendorStoreDynamicSqlProvider}.</li>
 * </ul>
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface VendorStoreController extends AutoApiController<VendorStore> {

  /**
   * Complex native SQL query with Common Table Expression (CTE) and Multi-Table Join
   * aggregating store financial performance directly into {@link VendorRevenueSummaryDto}.
   *
   * @param storeCodePrefix optional store code filter prefix
   * @return {@link ResponseEntity} wrapping aggregated vendor revenue summaries
   */
  @GetMapping("/reports/revenue-cte")
  @CustomQuery(
      value = "WITH StoreRevenueSummary AS ("
          + "  SELECT v.store_code AS storeCode, v.store_name AS storeName, "
          + "         COUNT(o.id) AS totalOrders, "
          + "         COALESCE(SUM(o.gross_amount), 0.0) AS totalRevenue, "
          + "         COALESCE(AVG(o.gross_amount), 0.0) AS averageOrderValue "
          + "  FROM tbl_vendor_stores v "
          + "  LEFT JOIN tbl_ecommerce_orders o ON o.vendor_store_code = v.store_code "
          + "  WHERE (:storeCodePrefix IS NULL OR v.store_code LIKE :storeCodePrefix) "
          + "  GROUP BY v.store_code, v.store_name "
          + ") "
          + "SELECT storeCode, storeName, totalOrders, totalRevenue, averageOrderValue "
          + "FROM StoreRevenueSummary "
          + "ORDER BY totalRevenue DESC",
      nativeQuery = true,
      resultClass = VendorRevenueSummaryDto.class
  )
  ResponseEntity<ApiResponse<List<VendorRevenueSummaryDto>>> findVendorRevenueWithCte(
      @RequestParam(value = "storeCodePrefix", required = false) String storeCodePrefix
  );

  /**
   * MyBatis-style dynamic SQL query branching and filtering via Java provider SPI.
   *
   * @param minOrders optional order count filter
   * @param storeCodePrefix optional store code filter prefix
   * @return {@link ResponseEntity} wrapping dynamically generated query results
   */
  @GetMapping("/reports/dynamic-sql")
  @CustomQuery(
      sqlProvider = VendorStoreDynamicSqlProvider.class,
      nativeQuery = true,
      resultClass = VendorRevenueSummaryDto.class
  )
  ResponseEntity<ApiResponse<List<VendorRevenueSummaryDto>>> findVendorRevenueDynamic(
      @RequestParam(value = "minOrders", required = false) Integer minOrders,
      @RequestParam(value = "storeCodePrefix", required = false) String storeCodePrefix
  );
}


