package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import com.example.implementation.entity.CustomerOrder;
import com.example.implementation.entity.Department;
import com.example.implementation.entity.Employee;
import com.example.implementation.entity.OrderItem;
import com.example.implementation.entity.Post;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.List;
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
 * Integration test suite for real-world enterprise workflow scenarios (Scenario 5):
 * {@code @AutoSlug}, {@code @AutoCode}, {@code @UniqueField}, {@code @StateMachine},
 * {@code @ComputedField}, {@code @BusinessAction}, {@code POST /upsert}, {@code POST /upsert-batch},
 * {@code PATCH /increment}, {@code POST /clone}, {@code PATCH /batch-update},
 * {@code GET /group-by}, and {@code GET /export/csv}.
 *
 * @author NatswarChuan
 */
@SpringBootTest
@AutoConfigureMockMvc
public class EnterpriseWorkflowIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Scenario 5A: AutoSlug, UniqueField 409, Upsert, Upsert-Batch, Increment & Clone")
  @SneakyThrows
  public void contentWorkflow_AutoSlugUniqueUpsertIncrementAndClone_WorkEndToEnd() {
    final Post autoSlugPost = Post.builder()
        .title(ImplementationTestConstant.TITLE_VIETNAMESE)
        .content(ImplementationTestConstant.CONTENT_VIETNAMESE)
        .viewCount(ImplementationTestConstant.VIEWS_100)
        .published(true)
        .build();
    final MvcResult postRes = mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(autoSlugPost))
        )
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_POST_SLUG)
                .value(ImplementationTestConstant.EXPECTED_SLUG_VN)
        )
        .andReturn();
    final UUID postId = extractId(postRes);

    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(autoSlugPost))
        )
        .andExpect(status().isConflict());

    final Post upsertPayload = Post.builder()
        .slug(ImplementationTestConstant.EXPECTED_SLUG_VN)
        .title(ImplementationTestConstant.TITLE_VIETNAMESE)
        .content(ImplementationTestConstant.CONTENT_VIETNAMESE)
        .viewCount(ImplementationTestConstant.VIEWS_15000)
        .published(true)
        .build();
    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API + ApiEndpointConstant.PATH_UPSERT)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(upsertPayload))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_DATA_ID).value(postId.toString()))
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_POST_VIEW_COUNT)
                .value(ImplementationTestConstant.VIEWS_15000)
        );
    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API + ApiEndpointConstant.PATH_UPSERT_BATCH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of(upsertPayload)))
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.ONE)
        );
    verifyPostIncrementAndClone(postId);
  }

  @SneakyThrows
  public void verifyPostIncrementAndClone(final UUID postId) {
    final String incrementUrl = ImplementationTestConstant.POSTS_API
        + CommonConstant.SLASH_SEPARATOR + postId + ImplementationQueryConstant.SUBPATH_INCREMENT;
    mockMvc.perform(
            patch(incrementUrl)
                .param(
                    ApiEndpointConstant.PARAM_FIELD,
                    ImplementationQueryConstant.FIELD_VIEW_COUNT
                )
                .param(ApiEndpointConstant.PARAM_DELTA, ImplementationQueryConstant.STR_50)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_POST_VIEW_COUNT)
                .value(ImplementationQueryConstant.VIEWS_15050)
        );
    mockMvc.perform(
            patch(incrementUrl)
                .param(
                    ApiEndpointConstant.PARAM_FIELD,
                    ImplementationQueryConstant.FIELD_VIEW_COUNT
                )
                .param(
                    ApiEndpointConstant.PARAM_DELTA,
                    ImplementationQueryConstant.STR_NEGATIVE_999999
                )
        )
        .andExpect(status().isUnprocessableEntity());
    mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API
                + CommonConstant.SLASH_SEPARATOR + postId + ImplementationQueryConstant.SUBPATH_CLONE)
        )
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath(
                ImplementationQueryConstant.JSON_POST_SLUG,
                startsWith(ImplementationTestConstant.EXPECTED_SLUG_COPY_PREFIX)
            )
        );
  }

  @Test
  @DisplayName("Scenario 5B: Order AutoCode, Declarative @ComputedField, StateMachine & GroupBy Analytics")
  @SneakyThrows
  public void orderWorkflow_AutoCodeFormulaStateMachineAndGroupBy_WorkEndToEnd() {
    final OrderItem line1 = OrderItem.builder()
        .productName(ImplementationTestConstant.PROD_CLOUD_NODE)
        .quantity(CommonConstant.TWO)
        .unitPrice(new BigDecimal(ImplementationTestConstant.PRICE_10000))
        .build();
    final OrderItem line2 = OrderItem.builder()
        .productName(ImplementationTestConstant.PROD_NVME)
        .quantity(CommonConstant.THREE)
        .unitPrice(new BigDecimal(ImplementationTestConstant.PRICE_5000))
        .build();
    final CustomerOrder autoOrder = CustomerOrder.builder()
        .discountAmount(new BigDecimal(ImplementationTestConstant.PRICE_2000))
        .shippingFee(new BigDecimal(ImplementationTestConstant.SHIPPING_500))
        .items(List.of(line1, line2))
        .build();
    final MvcResult orderRes = mockMvc.perform(
            post(ImplementationTestConstant.ORDERS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(autoOrder))
        )
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath(
                ImplementationQueryConstant.JSON_ORDER_NUMBER,
                startsWith(BusinessDomainConstant.PREFIX_ORDER_CODE)
            )
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ORDER_STATUS)
                .value(BusinessDomainConstant.STATE_PENDING)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ORDER_TOTAL_AMOUNT)
                .value(ImplementationTestConstant.DOUBLE_33500)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ITEM_0_SUB_TOTAL)
                .value(ImplementationTestConstant.DOUBLE_20000)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ITEM_1_SUB_TOTAL)
                .value(ImplementationTestConstant.DOUBLE_15000)
        )
        .andReturn();
    final UUID orderId = extractId(orderRes);
    verifyOrderStateTransitionsAndProtection(orderId);
  }

  @SneakyThrows
  public void verifyOrderStateTransitionsAndProtection(final UUID orderId) {
    final String transitionUrl = ImplementationTestConstant.ORDERS_API
        + CommonConstant.SLASH_SEPARATOR + orderId + ImplementationQueryConstant.SUBPATH_TRANSITION;
    mockMvc.perform(
            post(transitionUrl)
                .param(
                    ApiEndpointConstant.PARAM_TARGET_STATE,
                    BusinessDomainConstant.STATE_DELIVERED
                )
        )
        .andExpect(status().isUnprocessableEntity());
    mockMvc.perform(
            post(transitionUrl)
                .param(
                    ApiEndpointConstant.PARAM_TARGET_STATE,
                    BusinessDomainConstant.STATE_CONFIRMED
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ORDER_STATUS)
                .value(BusinessDomainConstant.STATE_CONFIRMED)
        );
    mockMvc.perform(
            post(transitionUrl)
                .param(ApiEndpointConstant.PARAM_TARGET_STATE, BusinessDomainConstant.STATE_PAID)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ORDER_STATUS)
                .value(BusinessDomainConstant.STATE_PAID)
        );
    mockMvc.perform(
            delete(ImplementationTestConstant.ORDERS_API + CommonConstant.SLASH_SEPARATOR + orderId)
        )
        .andExpect(status().isUnprocessableEntity());
    mockMvc.perform(
            get(ImplementationTestConstant.ORDERS_API + ApiEndpointConstant.PATH_GROUP_BY)
                .param(
                    ApiEndpointConstant.PARAM_GROUP_FIELD,
                    BusinessDomainConstant.FIELD_ORDER_STATUS
                )
                .param(
                    ApiEndpointConstant.PARAM_VALUE_FIELD,
                    BusinessDomainConstant.FIELD_TOTAL_AMOUNT
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_GROUP_0_FIELD)
                .value(BusinessDomainConstant.FIELD_ORDER_STATUS)
        );
  }

  @Test
  @DisplayName("Scenario 5C: Declarative @BusinessAction promoteEmployee, Derived Query, BatchUpdate & CSV Export")
  @SneakyThrows
  public void hrWorkflow_BusinessActionDerivedQueryBatchUpdateAndCsvExport_WorkEndToEnd() {
    final String adminToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_ADMIN_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN)
    );
    final Department dept = Department.builder()
        .code(ImplementationTestConstant.DEPT_FINANCE)
        .name(ImplementationTestConstant.NAME_FINANCE)
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
    final Employee newEmp = Employee.builder()
        .fullName(ImplementationTestConstant.EMP_NAME_LONG)
        .workEmail(ImplementationTestConstant.EMP_EMAIL_LONG)
        .employmentStatus(BusinessDomainConstant.STATUS_PROBATION)
        .salary(new BigDecimal(ImplementationTestConstant.SALARY_2500))
        .department(Department.builder().id(deptId).build())
        .build();
    final UUID empId = extractId(
        mockMvc.perform(
                post(ImplementationTestConstant.EMPLOYEES_API)
                    .header(
                        HttpHeaderConstant.HEADER_AUTHORIZATION,
                        SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newEmp))
            )
            .andExpect(status().isCreated())
            .andExpect(
                jsonPath(
                    ImplementationQueryConstant.JSON_EMP_CODE,
                    startsWith(BusinessDomainConstant.PREFIX_EMPLOYEE_CODE)
                )
            )
            .andReturn()
    );
    verifyPromoteDerivedQueryBatchAndCsv(empId, adminToken);
  }

  @SneakyThrows
  public void verifyPromoteDerivedQueryBatchAndCsv(final UUID empId, final String adminToken) {
    mockMvc.perform(
            post(ImplementationTestConstant.EMPLOYEES_API
                + CommonConstant.SLASH_SEPARATOR + empId + ImplementationQueryConstant.SUBPATH_PROMOTE)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .param(ApiEndpointConstant.PARAM_BONUS, ImplementationTestConstant.BONUS_1500)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_EMP_SALARY)
                .value(ImplementationTestConstant.DOUBLE_4000)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_EMP_STATUS)
                .value(BusinessDomainConstant.STATUS_SENIOR_ACTIVE)
        );
    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API
                + ApiEndpointConstant.PATH_SEARCH_BY_SALARY_AND_DEPT)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .param(
                    ApiEndpointConstant.PARAM_MIN_SALARY,
                    ImplementationTestConstant.MIN_SALARY_3500
                )
                .param(
                    ApiEndpointConstant.PARAM_DEPT_CODE,
                    ImplementationTestConstant.DEPT_FINANCE
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.ONE)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_EMP_0_EMAIL)
                .value(ImplementationTestConstant.EMP_EMAIL_LONG)
        );
    mockMvc.perform(
            patch(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_BATCH_UPDATE)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_CODE_FILTER,
                    ImplementationTestConstant.DEPT_FINANCE
                )
                .contentType(MediaType.APPLICATION_JSON)
                .content(ImplementationTestConstant.BATCH_EXECUTIVE_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_EMP_0_STATUS)
                .value(BusinessDomainConstant.STATUS_EXECUTIVE)
        );
    final MvcResult csvRes = mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_EXPORT_CSV)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + adminToken
                )
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_CODE_FILTER,
                    ImplementationTestConstant.DEPT_FINANCE
                )
        )
        .andExpect(status().isOk())
        .andReturn();
    final String csvContent = csvRes.getResponse().getContentAsString();
    assertThat(csvContent).contains(ImplementationTestConstant.EXPECTED_EMP_CSV_HEADER);
    assertThat(csvContent).contains(ImplementationTestConstant.EMP_EMAIL_LONG);
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
