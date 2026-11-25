package com.novamart.ecommerce.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.novamart.ecommerce.constant.NovaPathConstant;
import com.novamart.ecommerce.constant.NovaRoleConstant;
import com.novamart.ecommerce.constant.NovaTestConstant;
import com.novamart.ecommerce.entity.StorefrontProduct;
import com.novamart.ecommerce.helper.CatalogAiAssistantHelper;
import com.novamart.ecommerce.helper.PartnerShippingGatewayHelper;
import com.novamart.ecommerce.util.NovaJwtTestUtil;
import io.github.natswarchuan.common.constant.HttpHeaderConstant;
import io.github.natswarchuan.common.dto.AiQueryExecutionResultDto;
import io.github.natswarchuan.common.util.UuidUtil;
import io.github.natswarchuan.module.datasource.constant.DataSourceConstant;
import io.github.natswarchuan.module.security.service.JwtTokenService;
import io.github.natswarchuan.module.webhook.dto.WebhookSubscriptionDto;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration tests for Modules 8 & 9: Replica Analytics, Cache, DSL, GraphQL, Storage, AI, SDK.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(NovaTestConstant.PROFILE_TEST)
public class ReplicaAnalyticsAndEcosystemIntegrationTest {

  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper objectMapper;
  @Autowired private ObjectProvider<JwtTokenService> jwtTokenServiceProvider;
  @Autowired private CatalogAiAssistantHelper catalogAiAssistantHelper;
  @Autowired private PartnerShippingGatewayHelper partnerShippingGatewayHelper;

  @Test
  public void shouldRouteSalesAnalyticsToReplicaCacheAndEvictProperly() throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String category = "AUDIO-" + UuidUtil.generateUuidV7().toString().substring(0, 6);

    seedProduct(adminAuth, "SKU-A1-" + category, "NovaBuds Air " + category, category, "200.00");
    seedProduct(adminAuth, "SKU-A2-" + category, "NovaHeadphones Pro " + category, category, "400.00");

    final MvcResult firstCall =
        mockMvc
            .perform(
                get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/analytics/" + category)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.categoryCode").value(category))
            .andExpect(jsonPath("$.data.activeProductCount").value(2))
            .andExpect(jsonPath("$.data.averageRetailPrice").value(300.00))
            .andExpect(
                jsonPath("$.data.servedFromDataSource").value(DataSourceConstant.DATASOURCE_REPLICA))
            .andReturn();

    final String firstTimestamp =
        objectMapper
            .readTree(firstCall.getResponse().getContentAsString())
            .path("data")
            .path("computedAtUtc")
            .asText();

    final MvcResult secondCall =
        mockMvc
            .perform(
                get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/analytics/" + category)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
            .andExpect(status().isOk())
            .andReturn();

    final String secondTimestamp =
        objectMapper
            .readTree(secondCall.getResponse().getContentAsString())
            .path("data")
            .path("computedAtUtc")
            .asText();
    assertThat(secondTimestamp).isEqualTo(firstTimestamp);

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + NovaPathConstant.SUB_SALES_ANALYTICS_EVICT)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    Thread.sleep(5L);
    final MvcResult afterEvictCall =
        mockMvc
            .perform(
                get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/analytics/" + category)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
            .andExpect(status().isOk())
            .andReturn();
    final String afterEvictTimestamp =
        objectMapper
            .readTree(afterEvictCall.getResponse().getContentAsString())
            .path("data")
            .path("computedAtUtc")
            .asText();
    assertThat(afterEvictTimestamp).isNotEqualTo(firstTimestamp);

    mockMvc
        .perform(
            get("/api/v1/system/databases/health")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());
  }

  @Test
  public void shouldSupportDotQueryDslKeysetFieldsGraphqlStorageAiAndSdkCodegen() throws Exception {
    final String adminAuth =
        NovaJwtTestUtil.buildBearerToken(
            jwtTokenServiceProvider,
            NovaTestConstant.USER_ID_ADMIN,
            NovaTestConstant.USERNAME_ADMIN,
            Set.of(NovaRoleConstant.ROLE_ADMIN));
    final String suffix = UuidUtil.generateUuidV7().toString().substring(0, 8);
    seedProduct(adminAuth, "SKU-ECO1-" + suffix, "NovaVision Monitor " + suffix, "MONITORS", "850.00");
    seedProduct(adminAuth, "SKU-ECO2-" + suffix, "NovaVision Mini " + suffix, "MONITORS", "320.00");

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("retailPrice.gte", "800")
                .param("name.like", "NovaVision")
                .param("fields", "id,sku,name,retailPrice"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.content").isArray())
        .andExpect(jsonPath("$.data.content[0].retailPrice").isNumber());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/keyset")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .param("dir", "desc")
                .param("size", "2"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.content").isArray());

    mockMvc
        .perform(
            get("/api/v1/graphql/schema")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            post("/api/v1/graphql")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"query\":\"query { listStorefrontProducts { id sku name retailPrice } }\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.listStorefrontProducts").isArray());

    final MockMultipartFile sampleFile =
        new MockMultipartFile(
            "file",
            "novamart-brochure.txt",
            MediaType.TEXT_PLAIN_VALUE,
            "NovaMart Product Spec".getBytes(StandardCharsets.UTF_8));
    final MvcResult uploadResult =
        mockMvc
            .perform(
                multipart("/api/v1/storage/upload")
                    .file(sampleFile)
                    .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.fileId").isNotEmpty())
            .andReturn();
    final JsonNode uploadNode =
        objectMapper.readTree(uploadResult.getResponse().getContentAsString());
    final String fileId = uploadNode.path("data").path("fileId").asText();

    mockMvc
        .perform(
            get("/api/v1/storage/download/" + fileId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            delete("/api/v1/storage/" + fileId)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/ai/context")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/ai/query")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"prompt\":\"find products with retailPrice greater than 500\",\"page\":0,\"size\":5}"))
        .andExpect(status().isOk());

    final String systemPrompt = catalogAiAssistantHelper.generateProductCatalogSystemPrompt();
    assertThat(systemPrompt).contains("StorefrontProduct");
    final AiQueryExecutionResultDto<StorefrontProduct> aiRes =
        catalogAiAssistantHelper.queryCatalogByNaturalLanguage("retailPrice greater than 500");
    assertThat(aiRes).isNotNull();

    final WebhookSubscriptionDto webhookSub =
        partnerShippingGatewayHelper.registerPaymentWebhookSubscriber(
            "CheckoutPayment",
            NovaTestConstant.SAMPLE_WEBHOOK_URL,
            NovaTestConstant.SAMPLE_WEBHOOK_SECRET);
    assertThat(webhookSub.getSubscriptionId()).isNotNull();

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/schema/zod")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/schema/client")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());

    mockMvc
        .perform(
            get(NovaPathConstant.BASE_STOREFRONT_PRODUCTS + "/schema/typescript")
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth))
        .andExpect(status().isOk());
  }

  /**
   * Helper creating a StorefrontProduct via HTTP POST for integration test setup.
   *
   * @param adminAuth admin bearer header
   * @param sku unique product SKU
   * @param name product display name
   * @param category category code
   * @param retailPrice decimal string retail price
   * @throws Exception if POST fails
   */
  public void seedProduct(
      final String adminAuth,
      final String sku,
      final String name,
      final String category,
      final String retailPrice)
      throws Exception {
    final String body =
        "{\"sku\":\""
            + sku
            + "\",\"name\":\""
            + name
            + "\",\"categoryCode\":\""
            + category
            + "\",\"brand\":\"NovaTech\",\"retailPrice\":"
            + retailPrice
            + ",\"supplierCost\":120.00,\"active\":true}";
    mockMvc
        .perform(
            post(NovaPathConstant.BASE_STOREFRONT_PRODUCTS)
                .header(HttpHeaderConstant.HEADER_AUTHORIZATION, adminAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
        .andExpect(status().isCreated());
  }
}
