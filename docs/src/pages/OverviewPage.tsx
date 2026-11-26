import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { STAGE1_CONTENT } from '../data/pages/stage1Content';

interface OverviewPageProps {
  currentLang: SupportedLanguage;
  theme: 'dark' | 'light';
}

const ARCHITECTURE_CHART = `flowchart TD
  Client["HTTP / GraphQL / STOMP Client"] --> Filter["TraceIdFilter + SecurityFilterChainBridge"]
  Filter --> Router["Spring MVC RequestMappingHandlerMapping"]
  Router --> Proxy["JDK Dynamic Proxy\nControllerProxyInvocationHandler"]
  Proxy --> Escape{"@ServiceOverride?"}
  Escape -->|Yes| EscapeBean["EscapeHatchDispatchHelper\nMethodHandleCacheUtil"]
  Escape -->|No| Service["DynamicEntityCrudService\n+ Guardrails"]
  EscapeBean --> JPA[("JPA / Multi-Datasource / Cache")]
  Service --> JPA`;

export const OverviewPage: React.FC<OverviewPageProps> = ({ currentLang, theme }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="overview"
        currentLang={currentLang}
        badges={[
          { label: 'io.github.natswarchuan:spring-nwvmc:0.1.0', tone: 'emerald' },
          { label: 'Java 21 LTS', tone: 'blue' },
          { label: pickText(STAGE1_CONTENT.ovBadgeCounts, currentLang), tone: 'purple' },
        ]}
      />

      <h2 id="goal-architecture" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <h4>{pickText(STAGE1_CONTENT.ovCard1Title, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard1Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE1_CONTENT.ovCard2Title, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard2Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE1_CONTENT.ovCard3Title, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard3Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <h4>{pickText(STAGE1_CONTENT.ovCard4Title, currentLang)}</h4>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard4Body} currentLang={currentLang} />
          </p>
        </div>
      </div>

      <MermaidDiagram
        theme={theme}
        currentLang={currentLang}
        caption={pickText(STAGE1_CONTENT.ovMermaidCaption, currentLang)}
        chart={ARCHITECTURE_CHART}
      />

      <h2 id="config-footprint" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'maven',
            label: 'Maven (pom.xml)',
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
            label: 'JitPack',
            language: 'xml',
            fileName: 'pom.xml',
            code: `<!-- Monorepo note: framework module lives in controller-to-api-framework/ -->
<!-- Local install: mvn clean install -f controller-to-api-framework/pom.xml -->
<repositories>
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

      <h2 id="minimal-implementation" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'ov-entity',
            label: 'ProductCatalog.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/ProductCatalog.java',
            highlightLines: [21, 22, 23, 24, 25, 29, 34, 49],
            code: `package com.example.implementation.entity;

import io.github.natswarchuan.common.constant.RoleConstant;
import io.github.natswarchuan.common.entity.BaseAuditEntity;
import io.github.natswarchuan.core.annotation.AutoSlug;
import io.github.natswarchuan.core.annotation.EntitySecurity;
import io.github.natswarchuan.core.annotation.FieldSecurity;
import io.github.natswarchuan.core.annotation.UniqueField;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "tbl_product_catalogs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN})
public class ProductCatalog extends BaseAuditEntity {

  @UniqueField @NotBlank
  @Column(name = "sku_code", nullable = false, length = 64)
  private String skuCode;

  @NotBlank
  @Column(name = "product_name", nullable = false, length = 200)
  private String productName;

  @UniqueField @AutoSlug(sourceField = "productName")
  @Column(name = "slug", nullable = false, length = 250)
  private String slug;

  @NotBlank private String category;
  private String brand;
  @NotBlank private String vendorStoreCode;

  @NotNull @DecimalMin("0.00") private BigDecimal retailPrice;
  @NotNull @DecimalMin("0.00") private BigDecimal b2bWholesalePrice;

  @FieldSecurity(viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN}, nullifyInsteadOfMask = true)
  private BigDecimal costPrice;

  @Column(nullable = false) private Boolean active;
}`,
          },
          {
            id: 'ov-controller',
            label: 'ProductCatalogController.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/controller/ProductCatalogController.java',
            highlightLines: [6, 7],
            code: `package com.example.implementation.controller;

import com.example.implementation.entity.ProductCatalog;
import io.github.natswarchuan.core.annotation.AutoRestController;
import io.github.natswarchuan.core.controller.AutoApiController;

@AutoRestController
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
  // Automatically mounts 40 REST/Batch/Keyset/Schema/AI contracts (38 visible in Swagger UI) at /api/v1/product-catalogs
}`,
          },
        ]}
      />

      <h2 id="jmh-benchmarks" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <p style={{ color: 'var(--text-secondary)' }}>
        <RichDocText text={STAGE1_CONTENT.ovBenchIntro} currentLang={currentLang} />
      </p>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.ovThPath, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovThThroughput, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovThMechanism, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>measureVanillaDirectDispatch</code></td>
              <td><code>432.825 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow1Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureCachedMethodHandleDispatch</code></td>
              <td><code>182.914 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow2Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyServiceOverrideDispatch</code></td>
              <td><code>68.267 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow3Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyDefaultDispatch</code></td>
              <td><code>52.730 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow4Mech} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="production-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="security" currentLang={currentLang}>
        <RichDocText text={STAGE1_CONTENT.ovCalloutSecurity} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
