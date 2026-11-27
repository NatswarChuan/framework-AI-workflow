import React from 'react';
import { ArrowRight, ChevronDown, Terminal } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { RichDocText } from '../components/RichDocText';
import { ALL_NAV_ITEMS } from '../data/navigation';
import { UI_CONTROLS, UI_LABELS, pickText } from '../data/locales';
import { STAGE1_CONTENT } from '../data/pages/stage1Content';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';
import logoUrl from '../assets/logo.jpeg';

interface OverviewPageProps {
  currentLang: SupportedLanguage;
  theme: 'dark' | 'light';
  onNavigateTopic?: (topicId: string) => void;
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

export const OverviewPage: React.FC<OverviewPageProps> = ({
  currentLang,
  theme,
  onNavigateTopic,
}) => {
  const overviewItem = ALL_NAV_ITEMS.find((item) => item.id === 'overview');

  return (
    <article className="doc-page">
      <section className="cyber-hero-panel">
        <div className="cyber-hero-grid">
          <div className="cyber-hero-copy">
            <div className="page-title-row hero-title-row">
              <h1 className="page-title hero-title">
                {overviewItem ? pickText(overviewItem.label, currentLang) : UI_LABELS.brandName}
              </h1>
            </div>

            <p className="hero-subtitle">
              {overviewItem ? pickText(overviewItem.summary, currentLang) : ''}
            </p>

            <div className="hero-actions">
              <a
                href={buildTopicHref('quickstart', currentLang)}
                className="hero-btn-primary"
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) {
                    return;
                  }
                  event.preventDefault();
                  onNavigateTopic?.('quickstart');
                }}
              >
                <span>{pickText(UI_CONTROLS.heroStartCta, currentLang)}</span>
                <ArrowRight size={16} className="rtl-flip-icon" aria-hidden="true" />
              </a>
              <a
                href={buildTopicHref('ai-agent-kit', currentLang)}
                className="hero-btn-secondary"
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) {
                    return;
                  }
                  event.preventDefault();
                  onNavigateTopic?.('ai-agent-kit');
                }}
              >
                <Terminal size={15} aria-hidden="true" />
                <span>{pickText(UI_CONTROLS.heroKitCta, currentLang)}</span>
              </a>
            </div>
          </div>

          <div className="cyber-hero-visual">
            <div className="hero-hud-frame" dir="ltr">
              <span className="hud-corner hud-tl" aria-hidden="true" />
              <span className="hud-corner hud-tr" aria-hidden="true" />
              <span className="hud-corner hud-bl" aria-hidden="true" />
              <span className="hud-corner hud-br" aria-hidden="true" />

              <div className="hero-logo-stage">
                <img
                  src={logoUrl}
                  alt="Spring-NWVMC Official Logo"
                  className="hero-logo-art"
                  width={220}
                  height={220}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="core-insight-section" aria-label={pickText(STAGE1_CONTENT.ovBentoKicker, currentLang)}>
        <div className="core-insight-bar">
          <span className="core-insight-kicker">{pickText(STAGE1_CONTENT.ovBentoKicker, currentLang)}</span>
        </div>
        <div className="core-insight-grid">
          <div className="core-insight-card">
            <div className="core-insight-title">{pickText(STAGE1_CONTENT.ovBento1Title, currentLang)}</div>
            <p><RichDocText text={STAGE1_CONTENT.ovBento1Body} currentLang={currentLang} /></p>
          </div>
          <div className="core-insight-card">
            <div className="core-insight-title">{pickText(STAGE1_CONTENT.ovBento2Title, currentLang)}</div>
            <p><RichDocText text={STAGE1_CONTENT.ovBento2Body} currentLang={currentLang} /></p>
          </div>
          <div className="core-insight-card">
            <div className="core-insight-title">{pickText(STAGE1_CONTENT.ovBento3Title, currentLang)}</div>
            <p><RichDocText text={STAGE1_CONTENT.ovBento3Body} currentLang={currentLang} /></p>
          </div>
        </div>
        <div className="glossary-strip" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center', marginTop: '0.85rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {pickText(UI_CONTROLS.glossaryKicker, currentLang)}
          </span>
          <GlossaryTerm termKey="JPA" currentLang={currentLang} />
          <GlossaryTerm termKey="RBAC" currentLang={currentLang} />
          <GlossaryTerm termKey="Keyset" currentLang={currentLang} />
          <GlossaryTerm termKey="Idempotency" currentLang={currentLang} />
          <GlossaryTerm termKey="AOT" currentLang={currentLang} />
        </div>
      </section>

      <h2 id="goal-architecture" className="section-heading">
        {pickText(STAGE1_CONTENT.ovH2Architecture, currentLang)}
      </h2>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">01</span>
          <h3>{pickText(STAGE1_CONTENT.ovCard1Title, currentLang)}</h3>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard1Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">02</span>
          <h3>{pickText(STAGE1_CONTENT.ovCard2Title, currentLang)}</h3>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard2Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">03</span>
          <h3>{pickText(STAGE1_CONTENT.ovCard3Title, currentLang)}</h3>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard3Body} currentLang={currentLang} />
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-card-index" dir="ltr">04</span>
          <h3>{pickText(STAGE1_CONTENT.ovCard4Title, currentLang)}</h3>
          <p>
            <RichDocText text={STAGE1_CONTENT.ovCard4Body} currentLang={currentLang} />
          </p>
        </div>
      </div>

      <details className="under-the-hood-details">
        <summary className="under-the-hood-summary">
          <span>{pickText(STAGE1_CONTENT.ovHudInternalSummary, currentLang)}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="under-the-hood-body">
          <MermaidDiagram
            theme={theme}
            currentLang={currentLang}
            caption={pickText(STAGE1_CONTENT.ovMermaidCaption, currentLang)}
            chart={ARCHITECTURE_CHART}
          />
        </div>
      </details>

      <h2 id="config-footprint" className="section-heading">
        {pickText(STAGE1_CONTENT.ovH2Compat, currentLang)}
      </h2>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.ovCompatThStack, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovCompatThReq, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovCompatThNote, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{pickText(STAGE1_CONTENT.ovCompatRowRuntime, currentLang)}</td>
              <td><code>Java 21 LTS · Spring Boot 3.2.5 / 3.3.5 / 3.4.0</code></td>
              <td><code>spring.threads.virtual.enabled=true</code></td>
            </tr>
            <tr>
              <td>{pickText(STAGE1_CONTENT.ovCompatRowLicense, currentLang)}</td>
              <td><code>io.github.natswarchuan:spring-nwvmc:0.1.0</code></td>
              <td><code>Apache-2.0 · &lt;parameters&gt;true&lt;/parameters&gt;</code></td>
            </tr>
            <tr>
              <td>{pickText(STAGE1_CONTENT.ovCompatRowCore, currentLang)}</td>
              <td><code>web · websocket · data-jpa · validation · security · cache · actuator</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovCompatRowCoreDesc} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td>{pickText(STAGE1_CONTENT.ovCompatRowOpt, currentLang)}</td>
              <td><code>redis (optional=true) · built-in HttpClient S3 · pure-Java AI parser</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovCompatRowOptDesc} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="section-heading" style={{ fontSize: '1.08rem', marginTop: '1.5rem' }}>
        {pickText(STAGE1_CONTENT.ovTradeTitle, currentLang)}
      </h3>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.ovTradeThFit, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovTradeThSkip, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><RichDocText text={STAGE1_CONTENT.ovTradeRow1Fit} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovTradeRow1Skip} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><RichDocText text={STAGE1_CONTENT.ovTradeRow2Fit} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovTradeRow2Skip} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

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
        {pickText(STAGE1_CONTENT.ovH2QuickExample, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        tabs={[
          {
            id: 'ov-entity',
            label: 'ProductCatalog.java',
            language: 'java',
            fileName: 'src/main/java/com/example/implementation/entity/ProductCatalog.java',
            highlightLines: [25, 26, 27, 28, 31, 39, 50],
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
  // Automatically mounts full CRUD, search, keyset, batch, workflow, schema & AI routes at /api/v1/product-catalogs
}`,
          },
        ]}
      />

      <h2 id="jmh-benchmarks" className="section-heading">
        {pickText(STAGE1_CONTENT.ovH2Benchmarks, currentLang)}
      </h2>

      <p className="section-intro">
        <RichDocText text={STAGE1_CONTENT.ovBenchIntro} currentLang={currentLang} />
      </p>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>{pickText(STAGE1_CONTENT.ovThPath, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovThThroughput, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovThLatency, currentLang)}</th>
              <th>{pickText(STAGE1_CONTENT.ovThMechanism, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>measureVanillaDirectDispatch</code></td>
              <td><code>432.825 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow1Lat} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow1Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureCachedMethodHandleDispatch</code></td>
              <td><code>182.914 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow2Lat} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow2Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyServiceOverrideDispatch</code></td>
              <td><code>68.267 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow3Lat} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow3Mech} currentLang={currentLang} /></td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyDefaultDispatch</code></td>
              <td><code>52.730 ops/ms</code></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow4Lat} currentLang={currentLang} /></td>
              <td><RichDocText text={STAGE1_CONTENT.ovRow4Mech} currentLang={currentLang} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="overview-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>
      <Callout type="security" currentLang={currentLang}>
        <RichDocText text={STAGE1_CONTENT.ovCalloutSecurity} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
