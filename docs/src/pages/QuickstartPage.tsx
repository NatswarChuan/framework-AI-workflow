import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, formatStepHeading, pickText } from '../data/locales';
import { STAGE1_CONTENT } from '../data/pages/stage1Content';

interface QuickstartPageProps {
  currentLang: SupportedLanguage;
}

export const QuickstartPage: React.FC<QuickstartPageProps> = ({ currentLang }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="quickstart"
        currentLang={currentLang}
      />

      <h2 id="quickstart-goal" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2Starter, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.qsStarterLead} currentLang={currentLang} />
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.qsGoalBody} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'maven',
            label: 'Maven Central (pom.xml)',
            language: 'xml',
            fileName: 'pom.xml',
            highlightLines: [2, 3, 4],
            code: `<dependency>
  <groupId>io.github.natswarchuan</groupId>
  <artifactId>spring-nwvmc</artifactId>
  <version>0.1.0</version>
</dependency>

<!-- Mandatory: retain parameter names for SpEL keys & Spring MVC bindings -->
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <parameters>true</parameters>
  </configuration>
</plugin>`,
          },
          {
            id: 'gradle',
            label: 'Gradle (Kotlin)',
            language: 'kotlin',
            fileName: 'build.gradle.kts',
            highlightLines: [2, 6],
            code: `dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
}

tasks.withType<JavaCompile> {
  options.compilerArgs.add("-parameters")
}`,
          },
          {
            id: 'jitpack',
            label: 'JitPack (Mirror)',
            language: 'xml',
            fileName: 'pom.xml',
            highlightLines: [3, 4, 9, 10, 11],
            code: `<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependency>
  <groupId>com.github.NatswarChuan</groupId>
  <artifactId>Spring-NWVMC</artifactId>
  <version>v0.1.0</version>
</dependency>`,
          },
        ]}
      />

      <h2 id="quickstart-config" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2Config, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'prod-yml',
            label: pickText(STAGE1_CONTENT.qsTabProd, currentLang),
            language: 'yaml',
            fileName: 'src/main/resources/application.yml',
            highlightLines: [10, 11, 16, 17, 22, 23, 24],
            code: `spring:
  threads:
    virtual:
      enabled: true
  jpa:
    open-in-view: false

app:
  framework:
    query-guardrails:
      max-join-depth: 3
      max-filter-criteria: 25
      max-page-size: 200
      max-unpaged-fetch-limit: 5000
      eager-fetch-singular-relations: true
    security:
      enabled: true
      jwt-secret: \${JWT_SECRET}
      fail-fast-weak-jwt-secret: true
    i18n:
      default-locale: en
      cache-seconds: 3600
    studio:
      enabled: false
      demo-token-endpoint-enabled: false
      show-i18n-diagnostics: false`,
          },
          {
            id: 'dev-yml',
            label: pickText(STAGE1_CONTENT.qsTabDev, currentLang),
            language: 'yaml',
            fileName: 'src/main/resources/application-dev.yml',
            highlightLines: [4, 5, 6],
            code: `spring:
  datasource:
    url: jdbc:h2:mem:devdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  jpa:
    hibernate:
      ddl-auto: update

app:
  framework:
    security:
      jwt-secret: \${JWT_SECRET:DevOnlyLocalSecretKeyAtLeast32BytesLong!}
      fail-fast-weak-jwt-secret: false
    studio:
      enabled: true
      demo-token-endpoint-enabled: true
      show-i18n-diagnostics: true`,
          },
        ]}
      />

      <h2 id="quickstart-impl" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2Impl, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'qs-full-ctrl',
            label: 'ProductCatalogController.java (Full CRUD)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ProductCatalogController.java',
            highlightLines: [7, 8],
            code: `package com.example.implementation.controller;

import com.example.implementation.entity.ProductCatalog;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
  // Base path auto-derived as /api/v1/product-catalogs
}`,
          },
          {
            id: 'qs-readonly-ctrl',
            label: 'ProductCatalogReadOnlyController.java (Public DTO)',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ProductCatalogReadOnlyController.java',
            highlightLines: [9, 10, 11, 12],
            code: `package com.example.implementation.controller;

import com.example.implementation.dto.ProductReadDto;
import com.example.implementation.entity.ProductCatalog;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoReadApi;

// Exposes ONLY read endpoints (GET list/all/count/exists/{id}) projected to ProductReadDto
@AutoRestController(
    basePath = "/api/v1/readonly/product-catalogs",
    readDto = ProductReadDto.class)
public interface ProductCatalogReadOnlyController extends AutoReadApi<ProductCatalog> {}`,
          },
          {
            id: 'qs-read-dto',
            label: 'ProductReadDto.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/dto/ProductReadDto.java',
            code: `package com.example.implementation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder(toBuilder = true)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductReadDto {
  private UUID id;
  private String skuCode;
  private String productName;
  private String slug;
  private String category;
  private String brand;
  private String vendorStoreCode;
  private BigDecimal retailPrice;
  private Boolean active;
  // b2bWholesalePrice & costPrice are intentionally excluded from public storefront responses
}`,
          },
        ]}
      />

      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.qsImplBody} currentLang={currentLang} />
      </p>

      <h2 id="quickstart-first-errors" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2FirstErrors, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.qsErrThSymptom, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.qsErrThCause, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.qsErrThFix, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><RichDocText text={STAGE1_CONTENT.qsErr1Sym} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr1Cause} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr1Fix} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE1_CONTENT.qsErr2Sym} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr2Cause} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr2Fix} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE1_CONTENT.qsErr3Sym} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr3Cause} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsErr3Fix} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="quickstart-error-contract" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2ErrorContract, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.qsErrorContractLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        language="json"
        fileName="ApiResponse<List<ValidationErrorDetail>> (HTTP 400 / 401 / 403 / 404 / 409 / 422 / 429 / 503)"
        code={`{
  "code": "error.validation.failed",
  "message": "Input validation failed",
  "data": [
    {
      "field": "retailPrice",
      "rejectedValue": "-5.00",
      "message": "must be greater than or equal to 0.00"
    }
  ],
  "traceId": "0194e1a0-7f20-7000-8000-000000000101",
  "timestamp": "2026-11-26T10:15:30.412"
}`}
      />

      <h2 id="quickstart-testing" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2Testing, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.qsTestingLead} currentLang={currentLang} />
      </p>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'qs-test-mockmvc',
            label: 'MockMvc Slice / Integration',
            language: 'java',
            fileName: 'src/test/java/com/example/implementation/ProductCatalogIntegrationTest.java',
            highlightLines: [12, 16, 21, 22],
            code: `@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductCatalogIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @WithMockUser(roles = "ADMIN")
  void shouldRejectNegativePriceWithApiResponse400() throws Exception {
    mockMvc.perform(post("/api/v1/product-catalogs")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\\"skuCode\\":\\"SKU-1\\",\\"productName\\":\\"Test\\",\\"category\\":\\"TECH\\",\\"vendorStoreCode\\":\\"V1\\",\\"retailPrice\\":-5.00,\\"b2bWholesalePrice\\":1.00,\\"active\\":true}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("error.validation.failed"))
        .andExpect(jsonPath("$.traceId").isNotEmpty())
        .andExpect(jsonPath("$.data[0].field").value("retailPrice"));
  }
}`,
          },
          {
            id: 'qs-test-tc',
            label: 'Testcontainers PostgreSQL',
            language: 'java',
            fileName: 'src/test/java/com/example/implementation/PostgresContainerSmokeTest.java',
            highlightLines: [1, 2, 5, 6],
            code: `@Testcontainers
@SpringBootTest
class PostgresContainerSmokeTest {

  @Container
  @ServiceConnection
  static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @Test
  void shouldBootstrapFlywayAndQueryPostgres() {
    assertThat(jdbcTemplate.queryForObject("SELECT 1", Integer.class)).isEqualTo(1);
  }
}`,
          },
        ]}
      />

      <h2 id="quickstart-failfast" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2FailFast, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.qsThEx, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.qsThTrig, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.qsThRem, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>UnsupportedJavaVersionException</code></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow1Trig} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow1Rem} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>InvalidConfigurationException</code></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow2Trig} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow2Rem} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>InvalidConfigurationException</code></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow3Trig} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow3Rem} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>InvalidConfigurationException</code></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow4Trig} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.qsRow4Rem} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="quickstart-verify" className="section-heading">
        {pickText(STAGE1_CONTENT.qsH2Verify, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'qs-curl-try',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '01-quickstart-novamart.sh',
            code: `# 1. Start the live NovaMart reference app in dev profile (Maven Central 0.1.0 + Dev Studio + demo JWT)
mvn -f controller-to-api-implementation/pom.xml spring-boot:run "-Dspring-boot.run.profiles=dev"

# 2. Mint a development ADMIN JWT token (POST /api/v1/auth/token — returns 200 OK with data.token)
#    Bash:
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN" | jq -r '.data.token')
#    Windows PowerShell:
#    $ADMIN_TOKEN = (Invoke-RestMethod -Method Post "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN").data.token

# 3. Create your first NovaMart product (slug is auto-generated by @AutoSlug!)
curl -s -X POST "http://localhost:8080/api/v1/storefront-products" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skuCode": "NVM-DOC-MAC-M3",
    "productName": "MacBook Pro M3 16 Docs",
    "category": "ELECTRONICS",
    "brand": "Apple",
    "retailPrice": 2499.00,
    "supplierCost": 1890.00,
    "active": true
  }' | jq

# 4. Read via public storefront controller (supplierCost is stripped by PublicProductCardDto!)
curl -s "http://localhost:8080/api/v1/public/products?skuCode=NVM-DOC-MAC-M3" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq`,
          },
          {
            id: 'qs-mvn-verify',
            label: pickText(STAGE1_CONTENT.qsTabVerifyFile, currentLang),
            language: 'bash',
            fileName: 'verify-build.sh',
            code: `# 1. Run unit & integration tests and verify the build
mvn clean verify

# 2. (Optional) Run Apache JMeter load test against the running dev server
mvn -Pjmeter jmeter:configure jmeter:jmeter jmeter:results`,
          },
        ]}
      />

      <h2 id="quickstart-guardrails" className="section-heading">
        {formatStepHeading(9, UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE1_CONTENT.qsCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
