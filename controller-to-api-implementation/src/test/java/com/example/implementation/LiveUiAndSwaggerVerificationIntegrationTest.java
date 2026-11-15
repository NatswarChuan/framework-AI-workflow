package com.example.implementation;

import static org.assertj.core.api.Assertions.assertThat;

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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

/**
 * End-to-end live HTTP verification test over an embedded Tomcat server validating
 * Developer Live Studio UI ({@code /system/studio}), Swagger UI ({@code /swagger-ui/index.html}),
 * OpenAPI 3.0 Dynamic Proxy specification ({@code /v3/api-docs}), and all interactive preset actions.
 *
 * @author NatswarChuan
 * @version 0.0.1
 * @since 2026-11-14
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class LiveUiAndSwaggerVerificationIntegrationTest {

  @Autowired
  private TestRestTemplate restTemplate;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  @DisplayName("Live UI 1: Developer Live Studio (/system/studio) renders HTML5 DOM with all active controllers and interactive presets")
  void developerLiveStudio_RendersHtmlDomAndInteractiveControls() {
    final ResponseEntity<String> response =
        restTemplate.getForEntity("/system/studio", String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(response.getHeaders().getContentType()).isNotNull();
    assertThat(response.getHeaders().getContentType().toString()).contains("text/html");

    final String html = response.getBody();
    assertThat(html)
        .isNotNull()
        .contains("<!DOCTYPE html>")
        .contains("Live In-Browser API Tester")
        .contains("ProductCatalog")
        .contains("CustomerOrder")
        .contains("VendorStore")
        .contains("id=\"btnGenJwt\"")
        .contains("id=\"studioI18nDiagBar\"")
        .contains("id=\"presetCustomizers\"")
        .contains("id=\"presetCircuitBreakers\"")
        .contains("id=\"presetDbHealth\"")
        .contains("id=\"presetTrace\"")
        .contains("id=\"presetGraphqlSchema\"")
        .contains("id=\"presetProducts\"")
        .contains("id=\"presetCreateProduct\"")
        .contains("loadCreateProductPreset()")
        .doesNotContain("\\\"skuCode\\\"")
        .contains("executeStudioLink(event,this.getAttribute('href'))")
        .contains("rel=\"icon\"")
        .contains("id=\"presetPolicy\"")
        .contains("id=\"btnExecuteQuery\"");
  }

  @Test
  @DisplayName("Live UI 2: Swagger UI (/swagger-ui/index.html) and OpenAPI 3.0 (/v3/api-docs) expose all Dynamic Auto-API endpoints and BearerAuth")
  void swaggerUiAndOpenApiDocs_ExposeDynamicProxyControllersAndBearerSecurity() throws Exception {
    final ResponseEntity<String> swaggerHtmlResponse =
        restTemplate.getForEntity("/swagger-ui/index.html", String.class);
    assertThat(swaggerHtmlResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(swaggerHtmlResponse.getBody()).contains("swagger-ui");

    final ResponseEntity<String> apiDocsResponse =
        restTemplate.getForEntity("/v3/api-docs", String.class);
    assertThat(apiDocsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

    final JsonNode openApiRoot = objectMapper.readTree(apiDocsResponse.getBody());
    assertThat(openApiRoot.path("info").path("title").asText())
        .isEqualTo("Controller-To-API Dynamic Proxy Enterprise Framework");
    assertThat(openApiRoot.path("components").path("securitySchemes").has("BearerAuth")).isTrue();

    final JsonNode paths = openApiRoot.path("paths");
    assertThat(paths.has("/api/v1/auth/token")).isTrue();
    assertThat(paths.has("/api/v1/product-catalogs")).isTrue();
    assertThat(paths.has("/api/v1/customer-orders")).isTrue();
    assertThat(paths.has("/api/v1/vendor-stores")).isTrue();
    assertThat(paths.has("/api/v1/system/customizers")).isTrue();
    assertThat(paths.has("/api/v1/system/resilience/circuit-breakers")).isTrue();
    assertThat(paths.has("/api/v1/system/databases/health")).isTrue();
    assertThat(paths.has("/api/v1/system/trace-context")).isTrue();
    assertThat(paths.has("/api/v1/graphql/schema")).isTrue();
    assertThat(paths.has("/api/v1/advanced-business/flash-sale/buy")).isTrue();

    // Verify @Hidden technical/internal/streaming endpoints are omitted from Swagger UI
    assertThat(paths.has("/system/studio")).isFalse();
    assertThat(paths.has("/error")).isFalse();
    assertThat(paths.has("/api/v1/graphql/explorer")).isFalse();
    assertThat(paths.has("/api/v1/product-catalogs/events")).isFalse();
  }

  @Test
  @DisplayName("Live UI 2B: Developer Live Studio (/system/studio) supports 20 languages via ?lang= and NWVMC_LANG cookie with RTL")
  void developerLiveStudio_SupportsMultilingualParamsCookiesAndRtl() {
    final ResponseEntity<String> viResponse =
        restTemplate.getForEntity("/system/studio?lang=vi", String.class);
    assertThat(viResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(viResponse.getBody())
        .contains("lang=\"vi\"")
        .contains("dir=\"ltr\"")
        .contains("<option value=\"vi\" selected>")
        .contains("Thực Thi Truy Vấn")
        .contains("X-Language")
        .contains("__STUDIO_LANG__");

    final ResponseEntity<String> jaResponse =
        restTemplate.getForEntity("/system/studio?lang=ja", String.class);
    assertThat(jaResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(jaResponse.getBody())
        .contains("lang=\"ja\"")
        .contains("dir=\"ltr\"")
        .contains("<option value=\"ja\" selected>");

    final ResponseEntity<String> arResponse =
        restTemplate.getForEntity("/system/studio?lang=ar", String.class);
    assertThat(arResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(arResponse.getBody())
        .contains("lang=\"ar\"")
        .contains("dir=\"rtl\"")
        .contains("<option value=\"ar\" selected>");

    final HttpHeaders cookieHeaders = new HttpHeaders();
    cookieHeaders.add(HttpHeaders.COOKIE, "NWVMC_LANG=vi");
    final ResponseEntity<String> cookieResponse =
        restTemplate.exchange(
            "/system/studio", HttpMethod.GET, new HttpEntity<>(cookieHeaders), String.class);
    assertThat(cookieResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(cookieResponse.getBody())
        .contains("lang=\"vi\"")
        .contains("<option value=\"vi\" selected>")
        .contains("Thực Thi Truy Vấn");
  }

  @Test
  @DisplayName("Live UI 3: Full interactive workflow across JWT Token generation and all 8 Developer Studio & Swagger UI live presets")
  void interactiveStudioAndSwaggerWorkflow_ExecutesAllLivePresetsSuccessfully() throws Exception {
    // Step 1: Click '1. Generate Admin JWT Token' (POST /api/v1/auth/token)
    final ResponseEntity<String> tokenResponse =
        restTemplate.postForEntity(
            "/api/v1/auth/token?username=studio-admin&role=ROLE_ADMIN", null, String.class);
    assertThat(tokenResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

    final JsonNode tokenRoot = objectMapper.readTree(tokenResponse.getBody());
    final String jwtToken = tokenRoot.path("data").path("token").asText();
    assertThat(jwtToken).isNotBlank();

    final HttpHeaders authHeaders = new HttpHeaders();
    authHeaders.setContentType(MediaType.APPLICATION_JSON);
    authHeaders.setBearerAuth(jwtToken);
    final HttpEntity<Void> authEntity = new HttpEntity<>(authHeaders);

    // Step 2: Preset 1 - 7-Group SPI Telemetry (/api/v1/system/customizers)
    final ResponseEntity<String> customizersRes =
        restTemplate.exchange(
            "/api/v1/system/customizers", HttpMethod.GET, authEntity, String.class);
    assertThat(customizersRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(customizersRes.getBody()).contains("SUCCESS");

    // Step 3: Preset 2 - CircuitBreaker Telemetry (/api/v1/system/resilience/circuit-breakers)
    final ResponseEntity<String> cbRes =
        restTemplate.exchange(
            "/api/v1/system/resilience/circuit-breakers",
            HttpMethod.GET,
            authEntity,
            String.class);
    assertThat(cbRes.getStatusCode()).isEqualTo(HttpStatus.OK);

    // Step 4: Preset 3 - Multi-DB Health (/api/v1/system/databases/health)
    final ResponseEntity<String> dbHealthRes =
        restTemplate.exchange(
            "/api/v1/system/databases/health", HttpMethod.GET, authEntity, String.class);
    assertThat(dbHealthRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(dbHealthRes.getBody()).contains("SUCCESS");

    // Step 5: Preset 4 - UUIDv7 Trace Context (/api/v1/system/trace-context)
    final ResponseEntity<String> traceRes =
        restTemplate.exchange(
            "/api/v1/system/trace-context", HttpMethod.GET, authEntity, String.class);
    assertThat(traceRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(traceRes.getBody()).contains("traceId");

    // Step 6: Preset 5 - GraphQL SDL Schema (/api/v1/graphql/schema)
    final ResponseEntity<String> graphqlRes =
        restTemplate.exchange(
            "/api/v1/graphql/schema", HttpMethod.GET, authEntity, String.class);
    assertThat(graphqlRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(graphqlRes.getBody()).contains("type Query");

    // Step 7: Preset 6 - Create ProductCatalog (POST /api/v1/product-catalogs)
    final String createPayload =
        "{\"skuCode\":\"SKU-STUDIO-01\",\"productName\":\"Studio Quantum Laptop\","
            + "\"category\":\"COMPUTING\",\"brand\":\"NWVMC\",\"vendorStoreCode\":\"VND-001\","
            + "\"retailPrice\":2499.99,\"b2bWholesalePrice\":1999.99,\"costPrice\":1499.99,\"active\":true}";
    final HttpEntity<String> createRequest = new HttpEntity<>(createPayload, authHeaders);
    final ResponseEntity<String> createRes =
        restTemplate.exchange(
            "/api/v1/product-catalogs", HttpMethod.POST, createRequest, String.class);
    assertThat(createRes.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(createRes.getBody())
        .contains("SKU-STUDIO-01")
        .contains("studio-quantum-laptop");

    // Step 8: Preset 7 - List ProductCatalogs (GET /api/v1/product-catalogs)
    final ResponseEntity<String> listRes =
        restTemplate.exchange(
            "/api/v1/product-catalogs", HttpMethod.GET, authEntity, String.class);
    assertThat(listRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(listRes.getBody()).contains("Studio Quantum Laptop");

    // Step 9: Preset 8 - Human Policy Summary (GET /api/v1/subscription-contracts/policy-summary)
    final ResponseEntity<String> policyRes =
        restTemplate.exchange(
            "/api/v1/subscription-contracts/policy-summary",
            HttpMethod.GET,
            authEntity,
            String.class);
    assertThat(policyRes.getStatusCode()).isEqualTo(HttpStatus.OK);

    // Step 10: Schema TypeScript & JSON Schema card endpoints return HTTP 200
    final ResponseEntity<String> tsSchemaRes =
        restTemplate.exchange(
            "/api/v1/product-catalogs/schema/typescript",
            HttpMethod.GET,
            authEntity,
            String.class);
    assertThat(tsSchemaRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(tsSchemaRes.getBody()).contains("interface ProductCatalog");

    final ResponseEntity<String> jsonSchemaRes =
        restTemplate.exchange(
            "/api/v1/product-catalogs/schema/json",
            HttpMethod.GET,
            authEntity,
            String.class);
    assertThat(jsonSchemaRes.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(jsonSchemaRes.getBody())
        .contains("SUCCESS")
        .contains("ProductCatalog");

    // Step 11: Unknown endpoint returns HTTP 404 without unresolved {0}/{1} placeholders
    final ResponseEntity<String> notFoundRes =
        restTemplate.exchange(
            "/api/v1/nonexistent-endpoint-check-404",
            HttpMethod.GET,
            authEntity,
            String.class);
    assertThat(notFoundRes.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    assertThat(notFoundRes.getBody())
        .contains("error.resource.not.found")
        .doesNotContain("{0}")
        .doesNotContain("{1}");
  }
}

