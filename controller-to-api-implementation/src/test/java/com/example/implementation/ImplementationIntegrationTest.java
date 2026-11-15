package com.example.implementation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.natswarchuan.common.constant.ApiEndpointConstant;
import io.github.natswarchuan.common.constant.BusinessDomainConstant;
import io.github.natswarchuan.common.constant.CommonConstant;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.constant.SecurityConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import com.example.implementation.entity.Author;
import com.example.implementation.entity.Company;
import com.example.implementation.entity.Customer;
import com.example.implementation.entity.CustomerOrder;
import com.example.implementation.entity.Department;
import com.example.implementation.entity.Employee;
import com.example.implementation.entity.OrderItem;
import com.example.implementation.entity.Post;
import com.example.implementation.entity.Tag;
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
 * Integration test suite for Scenarios 1 through 4 in {@code controller-to-api-implementation},
 * consuming {@code controller-to-api-framework-0.0.1.jar} with pure 2-folder architecture
 * containing only {@code controller/} and {@code entity/}.
 *
 * @author NatswarChuan
 */
@SpringBootTest
@AutoConfigureMockMvc
public class ImplementationIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private JwtTokenService jwtTokenService;

  @Test
  @DisplayName("Scenario 1 (CMS): Full CRUD, @ManyToOne Filter, Derived findBySlug, Soft Delete, Trash Bin & Restore")
  public void cmsScenario_CrudDerivedQuerySoftDeleteAndRestore_WorkEndToEnd() {
    final UUID authorId = createSampleAuthor();
    final UUID postId = createSamplePost(authorId);
    verifyPostQueriesAndPatch(postId);
    verifySoftDeleteTrashBinAndRestore(postId);
  }

  @SneakyThrows
  public UUID createSampleAuthor() {
    final Author author = Author.builder()
        .penName(ImplementationTestConstant.PEN_NAME_NATSWARCHUAN)
        .email(ImplementationTestConstant.EMAIL_NATSWARCHUAN)
        .country(ImplementationTestConstant.COUNTRY_VIETNAM)
        .reputationScore(ImplementationTestConstant.REPUTATION_950)
        .verified(true)
        .build();
    final MvcResult authorResult = mockMvc.perform(
            post(ImplementationTestConstant.AUTHORS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(author))
        )
        .andExpect(status().isCreated())
        .andReturn();
    return extractIdFromResponse(authorResult);
  }

  @SneakyThrows
  public UUID createSamplePost(final UUID authorId) {
    final Post post = Post.builder()
        .slug(ImplementationTestConstant.SLUG_DYNAMIC_PROXY)
        .title(ImplementationTestConstant.TITLE_DYNAMIC_PROXY)
        .content(ImplementationTestConstant.CONTENT_DYNAMIC_PROXY)
        .viewCount(ImplementationTestConstant.VIEWS_15000)
        .published(true)
        .author(Author.builder().id(authorId).build())
        .build();
    final MvcResult postResult = mockMvc.perform(
            post(ImplementationTestConstant.POSTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(post))
        )
        .andExpect(status().isCreated())
        .andReturn();
    return extractIdFromResponse(postResult);
  }

  @SneakyThrows
  public void verifyPostQueriesAndPatch(final UUID postId) {
    mockMvc.perform(
            get(ImplementationTestConstant.POSTS_API
                + ImplementationQueryConstant.SUBPATH_BY_SLUG
                + ImplementationTestConstant.SLUG_DYNAMIC_PROXY)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_DATA_ID).value(postId.toString()))
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_POST_AUTHOR_PEN_NAME)
                .value(ImplementationTestConstant.PEN_NAME_NATSWARCHUAN)
        );
    mockMvc.perform(
            get(ImplementationTestConstant.POSTS_API)
                .param(
                    ImplementationQueryConstant.PARAM_AUTHOR_PEN_NAME,
                    ImplementationTestConstant.PEN_NAME_NATSWARCHUAN
                )
                .param(
                    ImplementationQueryConstant.PARAM_AUTHOR_REP_GTE,
                    ImplementationQueryConstant.STR_900
                )
                .param(
                    ImplementationQueryConstant.PARAM_VIEW_COUNT_GTE,
                    ImplementationQueryConstant.STR_10000
                )
                .param(
                    ApiEndpointConstant.PARAM_SEARCH,
                    ImplementationQueryConstant.SEARCH_DYNAMIC_PROXY
                )
                .param(
                    ApiEndpointConstant.PARAM_SORT,
                    ImplementationQueryConstant.FIELD_VIEW_COUNT
                )
                .param(ApiEndpointConstant.PARAM_DIR, CommonConstant.SORT_DESC)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_TOTAL_ELEMENTS).value(CommonConstant.ONE)
        );
    mockMvc.perform(
            patch(ImplementationTestConstant.POSTS_API + CommonConstant.SLASH_SEPARATOR + postId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(ImplementationTestConstant.PATCH_VIEWS_JSON)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_POST_VIEW_COUNT)
                .value(ImplementationTestConstant.VIEWS_25000)
        );
  }

  @SneakyThrows
  public void verifySoftDeleteTrashBinAndRestore(final UUID postId) {
    final String postItemUrl =
        ImplementationTestConstant.POSTS_API + CommonConstant.SLASH_SEPARATOR + postId;
    mockMvc.perform(delete(postItemUrl)).andExpect(status().isOk());
    mockMvc.perform(get(postItemUrl)).andExpect(status().isNotFound());
    mockMvc.perform(
            get(ImplementationTestConstant.POSTS_API)
                .param(CommonConstant.FIELD_DELETED, ImplementationQueryConstant.STR_TRUE)
                .param(
                    ImplementationQueryConstant.FIELD_SLUG,
                    ImplementationTestConstant.SLUG_DYNAMIC_PROXY
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_TOTAL_ELEMENTS).value(CommonConstant.ONE)
        );
    mockMvc.perform(post(postItemUrl + ImplementationQueryConstant.SUBPATH_RESTORE))
        .andExpect(status().isOk())
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_DATA_DELETED).value(false));
  }

  @Test
  @DisplayName("Scenario 2 (HR & Analytics): Batch Create, BETWEEN, NOT IN, EXISTS, Distinct, Top & KPI Aggregation")
  public void hrAnalyticsScenario_BetweenNotInExistsDistinctTopAndAggregation_WorkEndToEnd() {
    final String adminToken = jwtTokenService.generateToken(
        ImplementationTestConstant.USER_ADMIN_NAME,
        ImplementationTestConstant.USER_ID_SAMPLE,
        Set.of(RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_USER)
    );
    final UUID deptId = createFintechCompanyAndDepartment();
    seedFintechEmployees(deptId, adminToken);
    verifyEmployeeQueryAndAggregation(adminToken);
    verifyDistinctAndTopEndpoints(adminToken);
  }

  @SneakyThrows
  public void verifyEmployeeQueryAndAggregation(final String token) {
    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + token
                )
                .param(
                    ImplementationQueryConstant.PARAM_SALARY_BETWEEN,
                    ImplementationQueryConstant.VAL_SALARY_2500_5500
                )
                .param(
                    ImplementationQueryConstant.PARAM_STATUS_NOT_IN,
                    ImplementationQueryConstant.VAL_RESIGNED_TERMINATED
                )
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_COMPANY_TAX,
                    ImplementationTestConstant.TAX_FINTECH
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_TOTAL_ELEMENTS).value(CommonConstant.TWO)
        );
    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_AGGREGATE)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + token
                )
                .param(ApiEndpointConstant.PARAM_FIELD, BusinessDomainConstant.FIELD_SALARY)
                .param(
                    BusinessDomainConstant.FIELD_EMPLOYMENT_STATUS,
                    CommonConstant.STATUS_ACTIVE
                )
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_COMPANY_TAX,
                    ImplementationTestConstant.TAX_FINTECH
                )
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_AGG_COUNT).value(CommonConstant.TWO))
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_AGG_SUM)
                .value(ImplementationTestConstant.DOUBLE_8000)
        )
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_AGG_AVERAGE)
                .value(ImplementationTestConstant.DOUBLE_4000)
        );
  }

  @SneakyThrows
  public void verifyDistinctAndTopEndpoints(final String token) {
    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_DISTINCT)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + token
                )
                .param(
                    ApiEndpointConstant.PARAM_FIELD,
                    BusinessDomainConstant.FIELD_EMPLOYMENT_STATUS
                )
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_COMPANY_TAX,
                    ImplementationTestConstant.TAX_FINTECH
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.TWO)
        );
    mockMvc.perform(
            get(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_TOP)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + token
                )
                .param(ApiEndpointConstant.PARAM_FIELD, BusinessDomainConstant.FIELD_SALARY)
                .param(
                    ImplementationQueryConstant.PARAM_DEPT_COMPANY_TAX,
                    ImplementationTestConstant.TAX_FINTECH
                )
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.THREE)
        );
  }

  @SneakyThrows
  public UUID createFintechCompanyAndDepartment() {
    final Company company = Company.builder()
        .taxCode(ImplementationTestConstant.TAX_FINTECH)
        .name(ImplementationTestConstant.NAME_FINTECH)
        .countryCode(ImplementationTestConstant.COUNTRY_CODE_VN)
        .active(true)
        .build();
    final MvcResult companyRes = mockMvc.perform(
            post(ImplementationTestConstant.COMPANIES_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(company))
        )
        .andExpect(status().isCreated())
        .andReturn();
    final UUID companyId = extractIdFromResponse(companyRes);
    mockMvc.perform(
            get(ImplementationTestConstant.COMPANIES_API
                + ImplementationQueryConstant.SUBPATH_EXISTS_TAX_CODE
                + ImplementationTestConstant.TAX_FINTECH)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_DATA_VALUE).value(true));
    final Department department = Department.builder()
        .code(ImplementationTestConstant.DEPT_PLATFORM)
        .name(ImplementationTestConstant.NAME_PLATFORM)
        .annualBudget(new BigDecimal(ImplementationTestConstant.BUDGET_1M))
        .company(Company.builder().id(companyId).build())
        .build();
    final MvcResult deptRes = mockMvc.perform(
            post(ImplementationTestConstant.DEPARTMENTS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(department))
        )
        .andExpect(status().isCreated())
        .andReturn();
    return extractIdFromResponse(deptRes);
  }

  @SneakyThrows
  public void seedFintechEmployees(final UUID deptId, final String token) {
    final Department deptRef = Department.builder().id(deptId).build();
    final Employee emp1 = Employee.builder()
        .employeeCode(ImplementationTestConstant.EMP_CODE_1)
        .fullName(ImplementationTestConstant.EMP_NAME_1)
        .workEmail(ImplementationTestConstant.EMP_EMAIL_1)
        .employmentStatus(CommonConstant.STATUS_ACTIVE)
        .salary(new BigDecimal(ImplementationTestConstant.SALARY_3000))
        .department(deptRef)
        .build();
    final Employee emp2 = Employee.builder()
        .employeeCode(ImplementationTestConstant.EMP_CODE_2)
        .fullName(ImplementationTestConstant.EMP_NAME_2)
        .workEmail(ImplementationTestConstant.EMP_EMAIL_2)
        .employmentStatus(CommonConstant.STATUS_ACTIVE)
        .salary(new BigDecimal(ImplementationTestConstant.SALARY_5000))
        .department(deptRef)
        .build();
    final Employee emp3 = Employee.builder()
        .employeeCode(ImplementationTestConstant.EMP_CODE_3)
        .fullName(ImplementationTestConstant.EMP_NAME_3)
        .workEmail(ImplementationTestConstant.EMP_EMAIL_3)
        .employmentStatus(ImplementationTestConstant.STATUS_RESIGNED)
        .salary(new BigDecimal(ImplementationTestConstant.SALARY_4000))
        .department(deptRef)
        .build();
    mockMvc.perform(
            post(ImplementationTestConstant.EMPLOYEES_API + ApiEndpointConstant.PATH_BATCH)
                .header(
                    HttpHeaderConstant.HEADER_AUTHORIZATION,
                    SecurityConstant.TOKEN_PREFIX_BEARER + token
                )
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(List.of(emp1, emp2, emp3)))
        )
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.THREE)
        );
  }

  @Test
  @DisplayName("Scenario 3 (Complex ERP): 3-Level @ManyToOne + @ManyToMany + @OneToMany + Revenue Aggregation")
  public void complexErpScenario_DeepNestedFilteringSortingAndRevenueAggregation_WorkEndToEnd() {
    final UUID customerId = createErpHierarchyAndCustomer();
    createSampleOrderForCustomer(customerId);
    verifyDeepOrderQueriesAndMetadata();
  }

  @SneakyThrows
  public UUID createErpHierarchyAndCustomer() {
    final Company company = Company.builder()
        .taxCode(ImplementationTestConstant.TAX_VIETTECH)
        .name(ImplementationTestConstant.NAME_VIETTECH)
        .countryCode(ImplementationTestConstant.COUNTRY_CODE_VN)
        .active(true)
        .build();
    final UUID companyId = extractIdFromResponse(
        mockMvc.perform(
                post(ImplementationTestConstant.COMPANIES_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(company))
            )
            .andReturn()
    );
    final Department department = Department.builder()
        .code(ImplementationTestConstant.DEPT_AI_CLOUD)
        .name(ImplementationTestConstant.NAME_AI_CLOUD)
        .annualBudget(new BigDecimal(ImplementationTestConstant.BUDGET_500K))
        .company(Company.builder().id(companyId).build())
        .build();
    final UUID deptId = extractIdFromResponse(
        mockMvc.perform(
                post(ImplementationTestConstant.DEPARTMENTS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(department))
            )
            .andReturn()
    );
    final Tag vipTag = Tag.builder()
        .code(ImplementationTestConstant.TAG_VIP)
        .label(ImplementationTestConstant.LABEL_VIP)
        .build();
    final UUID tagId = extractIdFromResponse(
        mockMvc.perform(
                post(ImplementationTestConstant.TAGS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(vipTag))
            )
            .andReturn()
    );
    final Customer customer = Customer.builder()
        .customerCode(ImplementationTestConstant.CUST_CODE_999)
        .fullName(ImplementationTestConstant.CUST_NAME_999)
        .tier(ImplementationTestConstant.TIER_DIAMOND)
        .department(Department.builder().id(deptId).build())
        .tags(List.of(Tag.builder().id(tagId).build()))
        .build();
    return extractIdFromResponse(
        mockMvc.perform(
                post(ImplementationTestConstant.CUSTOMERS_API)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customer))
            )
            .andReturn()
    );
  }

  @SneakyThrows
  public void createSampleOrderForCustomer(final UUID customerId) {
    final OrderItem item1 = OrderItem.builder()
        .productName(ImplementationTestConstant.PROD_H100)
        .quantity(CommonConstant.TWO)
        .unitPrice(new BigDecimal(ImplementationTestConstant.PRICE_35000))
        .build();
    final OrderItem item2 = OrderItem.builder()
        .productName(ImplementationTestConstant.PROD_SWITCH)
        .quantity(CommonConstant.FIVE)
        .unitPrice(new BigDecimal(ImplementationTestConstant.PRICE_2000))
        .build();
    final CustomerOrder order = CustomerOrder.builder()
        .orderNumber(ImplementationTestConstant.ORDER_NUM_8888)
        .orderStatus(BusinessDomainConstant.STATE_CONFIRMED)
        .totalAmount(new BigDecimal(ImplementationTestConstant.TOTAL_80000))
        .customer(Customer.builder().id(customerId).build())
        .items(List.of(item1, item2))
        .build();
    mockMvc.perform(
            post(ImplementationTestConstant.ORDERS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order))
        )
        .andExpect(status().isCreated())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_ORDER_NUMBER)
                .value(ImplementationTestConstant.ORDER_NUM_8888)
        );
  }

  @SneakyThrows
  public void verifyDeepOrderQueriesAndMetadata() {
    mockMvc.perform(
            get(ImplementationTestConstant.ORDERS_API)
                .param(
                    ImplementationQueryConstant.PARAM_ORDER_COMPANY_COUNTRY,
                    ImplementationTestConstant.COUNTRY_CODE_VN
                )
                .param(
                    ImplementationQueryConstant.PARAM_ORDER_DEPT_BUDGET_GTE,
                    ImplementationQueryConstant.STR_400000
                )
                .param(
                    ImplementationQueryConstant.PARAM_CUSTOMER_TAG_CODE,
                    ImplementationTestConstant.TAG_VIP
                )
                .param(
                    ImplementationQueryConstant.PARAM_ITEMS_PROD_NAME_LIKE,
                    ImplementationQueryConstant.KEYWORD_H100
                )
                .param(
                    ImplementationQueryConstant.PARAM_TOTAL_AMOUNT_GTE,
                    ImplementationQueryConstant.STR_50000
                )
                .param(
                    ApiEndpointConstant.PARAM_SORT,
                    ImplementationQueryConstant.SORT_CUSTOMER_DEPT_CODE
                )
                .param(ApiEndpointConstant.PARAM_DIR, CommonConstant.SORT_ASC)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_TOTAL_ELEMENTS).value(CommonConstant.ONE)
        );
    mockMvc.perform(
            get(ImplementationTestConstant.ORDERS_API
                + ImplementationQueryConstant.SUBPATH_BY_STATUS
                + BusinessDomainConstant.STATE_CONFIRMED)
        )
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_DATA_LENGTH).value(CommonConstant.ONE)
        );
    mockMvc.perform(get(ImplementationTestConstant.ORDERS_API + ApiEndpointConstant.PATH_METADATA))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath(ImplementationQueryConstant.JSON_METADATA_OPS_LEN)
                .value(ImplementationTestConstant.OPERATORS_COUNT_13)
        );
  }

  @Test
  @DisplayName("Scenario 4 (Validation & Security): Reject invalid Entity payload with 400 Bad Request & UUIDv7 Trace ID")
  @SneakyThrows
  public void validationScenario_InvalidEntityPayload_Returns400WithTraceId() {
    final Author invalidAuthor = Author.builder()
        .penName(CommonConstant.EMPTY_STRING)
        .email(CommonConstant.EMPTY_STRING)
        .country(CommonConstant.EMPTY_STRING)
        .reputationScore(ImplementationTestConstant.NEGATIVE_TEN)
        .verified(false)
        .build();
    mockMvc.perform(
            post(ImplementationTestConstant.AUTHORS_API)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidAuthor))
        )
        .andExpect(status().isBadRequest())
        .andExpect(header().exists(HttpHeaderConstant.HEADER_TRACE_ID))
        .andExpect(jsonPath(ImplementationQueryConstant.JSON_TRACE_ID).exists());
  }

  @SneakyThrows
  public UUID extractIdFromResponse(final MvcResult result) {
    return UUID.fromString(
        objectMapper.readTree(result.getResponse().getContentAsString())
            .get(ImplementationQueryConstant.FIELD_DATA)
            .get(CommonConstant.FIELD_ID)
            .asText()
    );
  }
}
