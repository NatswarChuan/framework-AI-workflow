package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.implementation.constant.ShowcaseConstant;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * End-to-end integration tests verifying Spring-NWVMC 0.0.3 consumer capabilities in {@code
 * controller-to-api-implementation}: Stage 2 {@code @ServiceOverride} escape hatch, Stage 2 Code
 * Ejection, Stage 4C {@code /schema/zod} & {@code /schema/client}, and 20-language Studio parity.
 *
 * @author NatswarChuan
 * @version 0.0.3
 * @since 2026-11-15
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class Stage5CapabilitiesIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  @DisplayName("Stage 2 Escape Hatch: TagController @ServiceOverride delegates to Spring DI bean")
  public void tagControllerEscapeHatch_ExecutesCustomSpringDiHelper() throws Exception {
    final HttpHeaders authHeaders = createAdminAuthHeaders();
    final ResponseEntity<String> response =
        this.restTemplate.exchange(
            Stage5TestConstant.URL_TAG_ESCAPE_STATS,
            HttpMethod.GET,
            new HttpEntity<>(authHeaders),
            String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    final JsonNode root = this.objectMapper.readTree(response.getBody());
    final JsonNode data = root.path(Stage5TestConstant.JSON_FIELD_DATA);
    assertThat(data.path(ShowcaseConstant.KEY_ENTITY).asText())
        .isEqualTo(ShowcaseConstant.ENTITY_TAG);
    assertThat(data.path(ShowcaseConstant.KEY_DISPATCH_MODE).asText())
        .isEqualTo(ShowcaseConstant.MODE_SERVICE_OVERRIDE);
    assertThat(data.path(ShowcaseConstant.KEY_EVALUATION_ID).asText()).isNotBlank();
  }

  @Test
  @DisplayName("Stage 4C Codegen: /schema/zod and /schema/client return valid TS contracts")
  public void productCatalogSchemaEndpoints_ReturnZodSchemaAndTypedClient() throws Exception {
    final HttpHeaders authHeaders = createAdminAuthHeaders();
    final HttpEntity<Void> authEntity = new HttpEntity<>(authHeaders);

    final ResponseEntity<String> zodRes =
        this.restTemplate.exchange(
            Stage5TestConstant.URL_PRODUCT_ZOD, HttpMethod.GET, authEntity, String.class);
    assertThat(zodRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(zodRes.getBody())
        .contains("z.object")
        .contains("ProductCatalogSchema")
        .contains("skuCode");

    final ResponseEntity<String> clientRes =
        this.restTemplate.exchange(
            Stage5TestConstant.URL_PRODUCT_CLIENT, HttpMethod.GET, authEntity, String.class);
    assertThat(clientRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(clientRes.getBody())
        .contains("ProductCatalogClient")
        .contains("/api/v1/product-catalogs")
        .contains("list(")
        .contains("getById(");
  }

  @Test
  @DisplayName("Stage 2 Ejection: /system/studio/eject synthesizes standard Spring Java files")
  public void studioEjection_ReturnsCompleteStandardSpringFiles() throws Exception {
    final HttpHeaders authHeaders = createAdminAuthHeaders();
    final ResponseEntity<String> ejectRes =
        this.restTemplate.exchange(
            Stage5TestConstant.URL_EJECT_PRODUCT,
            HttpMethod.GET,
            new HttpEntity<>(authHeaders),
            String.class);

    assertThat(ejectRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(ejectRes.getBody())
        .contains("ProductCatalogEjectedController.java")
        .contains("ProductCatalogEjectedService.java")
        .contains("ProductCatalogEjectedServiceImpl.java")
        .contains("ProductCatalogEjectedRepository.java")
        .contains("ProductCatalogEjectedDto.java")
        .contains("@RestController");
  }

  @Test
  @DisplayName("Studio v0.0.3: All 20 languages render cleanly with 38-endpoint badge parity")
  public void studioTwentyLanguages_AllRenderCleanlyWithVersionAnd38Endpoints() {
    for (final String lang : Stage5TestConstant.ALL_TWENTY_LANGUAGES) {
      final ResponseEntity<String> pageRes =
          this.restTemplate.getForEntity(
              Stage5TestConstant.URL_STUDIO_LANG_TEMPLATE + lang, String.class);
      assertThat(pageRes.getStatusCode()).isEqualTo(HttpStatus.OK);
      assertThat(pageRes.getBody())
          .contains(Stage5TestConstant.EXPECTED_VERSION_BADGE)
          .contains("lang=\"" + lang + "\"")
          .contains("window.__STUDIO_LANG__ = '" + lang + "'");
    }
  }

  /**
   * Acquires an ADMIN Bearer token from the demo token endpoint for authenticated checks.
   *
   * @return HTTP headers carrying {@code Authorization: Bearer ...}
   * @throws Exception if JSON token parsing fails
   */
  public HttpHeaders createAdminAuthHeaders() throws Exception {
    final ResponseEntity<String> tokenRes =
        this.restTemplate.postForEntity(Stage5TestConstant.URL_TOKEN_ADMIN, null, String.class);
    assertThat(tokenRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    final JsonNode tokenRoot = this.objectMapper.readTree(tokenRes.getBody());
    final String token =
        tokenRoot
            .path(Stage5TestConstant.JSON_FIELD_DATA)
            .path(Stage5TestConstant.JSON_FIELD_TOKEN)
            .asText();
    final HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);
    return headers;
  }
}
