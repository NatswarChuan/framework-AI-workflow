import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
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
        badges={[
          { label: 'Maven / Gradle / JitPack', tone: 'blue' },
          { label: pickText(STAGE1_CONTENT.qsBadgeModels, currentLang), tone: 'purple' },
          { label: pickText(STAGE1_CONTENT.qsBadgeFailFast, currentLang), tone: 'rose' },
        ]}
      />

      <h2 id="quickstart-goal" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
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
</dependency>`,
          },
          {
            id: 'gradle',
            label: 'Gradle (Kotlin)',
            language: 'kotlin',
            fileName: 'build.gradle.kts',
            highlightLines: [2],
            code: `dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:0.1.0")
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
        {pickText(UI_LABELS.stepConfig, currentLang)}
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
            code: `app:
  framework:
    studio:
      enabled: true
      demo-token-endpoint-enabled: true
      show-i18n-diagnostics: true`,
          },
        ]}
      />

      <h2 id="quickstart-impl" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
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

      <h2 id="quickstart-verify" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'qs-curl-try',
            label: 'Try Live (curl)',
            language: 'bash',
            fileName: '01-quickstart-marketplace.sh',
            code: `# 1. Start the reference Marketplace app in dev profile (enables Dev Studio + demo JWT)
mvn -f controller-to-api-implementation/pom.xml spring-boot:run -Dspring-boot.run.profiles=dev

# 2. Mint a development ADMIN JWT token
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:8080/api/v1/auth/token?username=admin&role=ROLE_ADMIN" | jq -r '.data.token')

# 3. Create your first Marketplace product (slug "macbook-pro-m3-16-docs" is auto-generated by @AutoSlug!)
curl -s -X POST "http://localhost:8080/api/v1/product-catalogs" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skuCode": "SKU-DOC-MAC-M3",
    "productName": "MacBook Pro M3 16 Docs",
    "category": "ELECTRONICS",
    "brand": "Apple",
    "vendorStoreCode": "VND-HANOI-01",
    "retailPrice": 2499.00,
    "b2bWholesalePrice": 2150.00,
    "costPrice": 1890.00,
    "active": true
  }' | jq

# 4. Read via public storefront controller (costPrice & b2bWholesalePrice are stripped by ProductReadDto!)
curl -s "http://localhost:8080/api/v1/readonly/product-catalogs?skuCode=SKU-DOC-MAC-M3" \\
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq`,
          },
          {
            id: 'qs-mvn-verify',
            label: pickText(STAGE1_CONTENT.qsTabVerifyFile, currentLang),
            language: 'bash',
            fileName: 'verify-build.sh',
            code: `# 1. Run full integration suite + Apache JMeter load test against JitPack v0.1.0
mvn clean verify -f controller-to-api-implementation/pom.xml

# 2. (Framework contributors) Run framework unit tests & local install
mvn clean install -f controller-to-api-framework/pom.xml

# 3. Generate CycloneDX 1.6 SBOM (target/bom.json)
mvn -Ppublish org.cyclonedx:cyclonedx-maven-plugin:2.9.1:makeAggregateBom \\
  "-Dcyclonedx.skipNotDeployed=false" "-Dmaven.deploy.skip=false" -f controller-to-api-framework/pom.xml`,
          },
        ]}
      />

      <h2 id="quickstart-failfast" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
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

      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE1_CONTENT.qsCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
