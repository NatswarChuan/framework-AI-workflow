import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { MermaidDiagram } from '../components/MermaidDiagram';
import { UI_LABELS, pickText } from '../data/locales';

interface OverviewPageProps {
  currentLang: SupportedLanguage;
  theme: 'dark' | 'light';
}

const ARCHITECTURE_CHART = `flowchart LR
  Client[HTTP / GraphQL / STOMP Client] --> Filter[TraceIdFilter + SecurityFilterChainBridge]
  Filter --> Router[Spring MVC RequestMappingHandlerMapping]
  Router --> Proxy[JDK Dynamic Proxy ControllerProxyInvocationHandler]
  Proxy --> Escape{"@ServiceOverride?"}
  Escape -- Yes --> EscapeBean[EscapeHatchDispatchHelper + MethodHandleCacheUtil]
  Escape -- No --> Service[DynamicEntityCrudService + Guardrails]
  Service --> JPA[(JPA / Multi-Datasource / Cache)]`;

export const OverviewPage: React.FC<OverviewPageProps> = ({ currentLang, theme }) => {
  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="overview"
        currentLang={currentLang}
        badges={[
          { label: 'io.github.natswarchuan:spring-nwvmc:1.0.0', tone: 'emerald' },
          { label: 'Java 21 LTS', tone: 'blue' },
          { label: '528 Classes · 42 Annotations · 40 Contracts', tone: 'purple' },
        ]}
      />

      <h2 id="goal-architecture" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>

      <div className="feature-grid">
        <div className="feature-card">
          <h4>528 Core Java Files · 215 Test Files</h4>
          <p>
            Compiles cleanly without Spring MVC or Spring Data annotations on domain interfaces. Only Spring AOT hints (<code>core/aot/</code>) and YAML <code>@ConfigurationProperties</code> metadata retain compile-time Spring imports (10 lines total).
          </p>
        </div>
        <div className="feature-card">
          <h4>40 Contracts · 38 Default Swagger Routes</h4>
          <p>
            Extending <code>AutoApiController&lt;E&gt;</code> registers 17 Read, 11 Write, and 12 Enterprise contracts per entity. <code>/events</code> stays <code>@Hidden</code> and <code>/{`{id}`}/**</code> activates on opt-in.
          </p>
        </div>
        <div className="feature-card">
          <h4>@ServiceOverride &amp; Code Ejection</h4>
          <p>
            Override any single proxy method inline with <code>@ServiceOverride</code> or export standalone MVC layers via <code>GET /system/studio/eject</code>.
          </p>
        </div>
        <div className="feature-card">
          <h4>20-Language Studio &amp; RTL Layout</h4>
          <p>
            Built-in <code>/system/studio</code> and <code>docs/</code> support 20 locales including RTL directionality for <code>ar</code>, <code>fa</code>, and <code>ur</code>.
          </p>
        </div>
      </div>

      <MermaidDiagram
        theme={theme}
        caption="Spring-NWVMC 1.0.0 Request Execution Pipeline"
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
  <version>1.0.0</version>
</dependency>`,
          },
          {
            id: 'gradle',
            label: 'Gradle (Kotlin)',
            language: 'kotlin',
            fileName: 'build.gradle.kts',
            highlightLines: [2],
            code: `dependencies {
  implementation("io.github.natswarchuan:spring-nwvmc:1.0.0")
}`,
          },
          {
            id: 'jitpack',
            label: 'JitPack',
            language: 'xml',
            fileName: 'pom.xml',
            code: `<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>

<dependency>
  <groupId>com.github.NatswarChuan</groupId>
  <artifactId>Spring-NWVMC</artifactId>
  <version>v1.0.0</version>
</dependency>`,
          },
        ]}
      />

      <h2 id="minimal-implementation" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)}
      </h2>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName="ProductCatalog.java + ProductCatalogController.java"
        code={`@Entity
@Table(name = "tbl_product_catalog")
@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_ADMIN}
)
@AuditTrail
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalog extends BaseAuditEntity {

  @AutoCode(prefix = "PRD-")
  @UniqueField
  private String code;

  @NotBlank
  private String name;

  @PositiveOrZero
  private BigDecimal unitPrice;
}

@AutoRestController(path = "/api/v1/product-catalogs")
public interface ProductCatalogController extends AutoApiController<ProductCatalog> {
}`}
      />

      <h2 id="jmh-benchmarks" className="section-heading">
        {pickText(UI_LABELS.stepVerification, currentLang)}
      </h2>

      <p style={{ color: 'var(--text-secondary)' }}>
        Measured in-process JMH <code>1.37</code> throughput (<code>DynamicProxyThroughputBenchmarkTest</code>, <code>Mode.Throughput</code>, <code>ops/ms</code>) and CycloneDX 1.5 SBOM verification across Spring Boot <code>3.2.5</code>, <code>3.3.5</code>, and <code>3.4.0</code> (<code>.github/workflows/ci-matrix.yml</code>):
      </p>

      <div className="table-scroll">
        <table className="doc-table">
          <thead>
            <tr>
              <th>Dispatch Path (JMH 1.37 Benchmark)</th>
              <th>Measured Mean Throughput</th>
              <th>Runtime Mechanism</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>measureVanillaDirectDispatch</code></td>
              <td><code>1457.171 ops/ms</code></td>
              <td>Direct Spring bean invocation baseline</td>
            </tr>
            <tr>
              <td><code>measureCachedMethodHandleDispatch</code></td>
              <td><code>1029.464 ops/ms</code></td>
              <td><code>MethodHandleCacheUtil</code> unreflected handle invocation</td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyServiceOverrideDispatch</code></td>
              <td><code>528.621 ops/ms</code></td>
              <td>JDK Dynamic Proxy routed via <code>@ServiceOverride</code></td>
            </tr>
            <tr>
              <td><code>measureDynamicProxyDefaultDispatch</code></td>
              <td><code>195.486 ops/ms</code></td>
              <td>JDK Dynamic Proxy via interface <code>default</code> contract</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="production-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang)}
      </h2>

      <Callout type="security" currentLang={currentLang}>
        All developer introspection endpoints (<code>/system/studio</code>, <code>/system/studio/eject</code>) and the demo token minter (<code>POST /api/v1/auth/token</code>) default to disabled (<code>false</code>) in production, returning HTTP <code>401</code> and <code>404</code> respectively via <code>SurfaceAccessGuardrailUtil</code>.
      </Callout>
    </article>
  );
};
