package com.example.implementation.controller;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.response.ApiResponse;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.annotation.BusinessAction;
import io.github.natswarchuan.core.controller.AutoApiController;
import com.example.implementation.entity.Employee;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Dynamic proxy REST controller for {@link Employee} entities.
 *
 * <p>Auto-generates 25+ standard endpoints at {@code /api/v1/employees}, multi-conditional cross-relation
 * derived queries, and declarative business promotion actions via {@link BusinessAction}.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-06
 */
@AutoRestController
public interface EmployeeController extends AutoApiController<Employee> {

  /**
   * Derived query retrieving employees having {@code salary >= minSalary} belonging to department
   * matching {@code department.code = deptCode}, ordered descending by salary.
   *
   * @param minSalary minimum salary filter
   * @param deptCode department identifier code
   * @return {@link ResponseEntity} wrapping list of qualifying employees
   */
  @GetMapping(ApiEndpointConstant.PATH_SEARCH_BY_SALARY_AND_DEPT)
  ResponseEntity<ApiResponse<List<Employee>>>
      findAllBySalaryGreaterThanEqualAndDepartmentCodeOrderBySalaryDesc(
          @RequestParam(ApiEndpointConstant.PARAM_MIN_SALARY) BigDecimal minSalary,
          @RequestParam(ApiEndpointConstant.PARAM_DEPT_CODE) String deptCode);

  /**
   * Declarative custom business workflow executing employee promotion without writing implementation code.
   *
   * <p>Increments {@code salary} by {@code bonus} and transitions status to {@code SENIOR_ACTIVE}.
   *
   * @param id employee unique identifier
   * @param bonus promotional bonus added to salary
   * @return {@link ResponseEntity} wrapping promoted employee state
   */
  @PostMapping(ApiEndpointConstant.PATH_PROMOTE)
  @BusinessAction(
      targetStateField = BusinessDomainConstant.FIELD_EMPLOYMENT_STATUS,
      targetStateValue = BusinessDomainConstant.STATUS_SENIOR_ACTIVE,
      adjustNumericField = BusinessDomainConstant.FIELD_SALARY,
      deltaParamIndex = CommonConstant.ONE
  )
  ResponseEntity<ApiResponse<Employee>> promoteEmployee(
      @PathVariable(ApiEndpointConstant.PARAM_ID) UUID id,
      @RequestParam(ApiEndpointConstant.PARAM_BONUS) String bonus);
}
