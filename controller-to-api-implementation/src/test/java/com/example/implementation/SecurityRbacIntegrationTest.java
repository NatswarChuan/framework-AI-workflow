package com.example.implementation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import com.example.implementation.entity.Department;
import com.example.implementation.entity.Employee;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;
import lombok.SneakyThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Comprehensive integration test for Spring Security 6 stateless JWT,
 * declarative {@code @EntitySecurity} role-based access control (RBAC), and automatic JPA Auditing.
 *
 * @author NatswarChuan
 */
@SpringBootTest
@AutoConfigureMockMvc
public class SecurityRbacIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Security: Request without JWT token to secured entity returns 401 Unauthorized")
  @SneakyThrows
  public void unauthenticatedRequestToSecuredEntity_Returns401Unauthorized() {
    final Employee unauthEmp = Employee.builder()
        .fullName(ImplementationTestConstant.EMP_NAME_ANNA)
        .workEmail(ImplementationTestConstant.EMP_EMAIL_ANNA)
        .employmentStatus(BusinessDomainConstant.STATUS_PROBATION)
        .salary(new BigDecimal(ImplementationTestConstant.EMP_SALARY_3000))
        .build();

    mockMvc.perform(
            post(ImplementationTestConstant.EMPLOYEES_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(unauthEmp))
        )
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value(SecurityConstant.ERR_UNAUTHORIZED));
  }

  @Test
  @DisplayName("Security: Public entity with permitAll allows access without JWT token")
  @SneakyThrows
  public void publicEntityWithoutToken_Returns200Ok() {
    mockMvc.perform(get(ImplementationTestConstant.DEPARTMENTS_API))
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Security: RBAC evaluation validates 403 Forbidden, 200 OK, and JPA Auditing via JWT")
  @SneakyThrows
  public void rbacAndAuditingWithJwt_WorksEndToEnd() {
    final String adminToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_ADMIN_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final Department dept = Department.builder()
        .code("DEPT-SEC-2026")
        .name("Security Assurance")
        .annualBudget(new BigDecimal(ImplementationTestConstant.BUDGET_800K))
        .build();
    final UUID deptId = extractId(
        mockMvc.perform(
                post(ImplementationTestConstant.DEPARTMENTS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(dept))
            )
            .andExpect(status().isCreated())
            .andReturn()
    );

    final Employee emp = Employee.builder()
        .fullName(ImplementationTestConstant.EMP_NAME_ANNA)
        .workEmail("anna.sec@enterprise.vn")
        .employmentStatus(BusinessDomainConstant.STATUS_PROBATION)
        .salary(new BigDecimal(ImplementationTestConstant.EMP_SALARY_3000))
        .department(Department.builder().id(deptId).build())
        .build();

    final MvcResult createResult = mockMvc.perform(
            post(ImplementationTestConstant.EMPLOYEES_API)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emp))
        )
        .andExpect(status().isCreated())
        .andExpect(jsonPath(ImplementationTestConstant.JSON_CREATED_BY).value(ImplementationTestConstant.USER_ADMIN_NAME))
        .andReturn();

    final UUID empId = extractId(createResult);

    final String staffToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_STAFF_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    mockMvc.perform(
            delete(ImplementationTestConstant.EMPLOYEES_API + CommonConstant.SLASH_SEPARATOR + empId)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + staffToken
                )
        )
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.code").value(SecurityConstant.ERR_FORBIDDEN));

    final String superAdminToken = jwtTokenService.generateToken(
        "super-admin",
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_SUPER_ADMIN)
    );

    mockMvc.perform(
            delete(ImplementationTestConstant.EMPLOYEES_API + CommonConstant.SLASH_SEPARATOR + empId)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + superAdminToken
                )
        )
        .andExpect(status().isOk());
  }

  @Test
  @DisplayName("Security & Masking: Data Masking nullifies sensitive salary when accessed without ROLE_ADMIN")
  @SneakyThrows
  public void dataMasking_NonAdminCaller_NullifiesSalary() {
    final String adminToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_ADMIN_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN)
    );

    final Department dept = Department.builder()
        .code("DEPT-MASK-001")
        .name("Masking Verification Dept")
        .annualBudget(new BigDecimal(ImplementationTestConstant.BUDGET_800K))
        .build();
    final UUID deptId = extractId(
        mockMvc.perform(
                post(ImplementationTestConstant.DEPARTMENTS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(dept))
            )
            .andExpect(status().isCreated())
            .andReturn()
    );

    final Employee emp = Employee.builder()
        .fullName("Masking Subject")
        .workEmail("masking.subject@enterprise.vn")
        .employmentStatus(BusinessDomainConstant.STATUS_PROBATION)
        .salary(new BigDecimal(ImplementationTestConstant.EMP_SALARY_3000))
        .department(Department.builder().id(deptId).build())
        .build();

    final MvcResult createResult = mockMvc.perform(
            post(ImplementationTestConstant.EMPLOYEES_API)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emp))
        )
        .andExpect(status().isCreated())
        .andReturn();

    final UUID empId = extractId(createResult);

    final String userToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_ADMIN_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_USER)
    );

    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + CommonConstant.SLASH_SEPARATOR + empId)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + userToken
                )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.salary").doesNotExist());

    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + CommonConstant.SLASH_SEPARATOR + empId)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.salary").value(3000.0));
  }

  @SneakyThrows
  public UUID extractId(final MvcResult result) {
    return UUID.fromString(
        objectMapper.readTree(result.getResponse().getContentAsString())
            .get(ImplementationQueryConstant.FIELD_DATA)
            .get(CommonConstant.FIELD_ID)
            .asText()
    );
  }
}

