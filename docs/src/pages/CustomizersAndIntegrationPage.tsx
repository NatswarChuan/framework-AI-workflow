import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import {
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  Cloud,
  MessageSquare,
  Sparkles,
  HardDrive,
} from 'lucide-react';

interface Props {
  currentLang: SupportedLanguage;
}

const TXT = {
  s1Heading: {
    vi: '1. 7 Nhóm SPI Chính + StorageCustomizer (8 Customizer SPI Interfaces)',
    en: '1. 7 Core Spring Ecosystem SPI Groups + StorageCustomizer (8 SPI Interfaces)',
    ja: '1. Springエコシステム7大SPIグループ ＋ StorageCustomizer（計8インターフェース）',
    zh: '1. 7 大核心 Spring 生态扩展接口 + StorageCustomizer（共 8 个 SPI 接口）',
  },
  groups: [
    {
      name: { vi: 'Nhóm 1: Spring Core', en: 'Group 1: Spring Core', ja: '第1群: Spring Core', zh: '第 1 组: Spring Core' },
      desc: { vi: 'Can thiệp BeanFactory, AOP, JDBC, Transaction, WebMVC thông qua CoreCustomizerContextDto.', en: 'Customizes Core, Beans, AOP, JDBC, Transaction, and WebMVC via CoreCustomizerContextDto.', ja: 'Core・Beans・AOP・WebMVC などを CoreCustomizerContextDto で調整します。', zh: '通过 CoreCustomizerContextDto 介入核心容器、AOP 与 WebMVC 配置。' },
      file: 'SpringCoreCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 2: Platform & Generative AI', en: 'Group 2: Platform & Generative AI', ja: '第2群: Platform & AI', zh: '第 2 组: 平台与生成式 AI' },
      desc: { vi: 'Can thiệp Spring AI ChatClient, Prompt, Embedding và VectorStore qua PlatformAiCustomizerContextDto.', en: 'Customizes Spring AI ChatClient, prompts, embeddings, and VectorStore via PlatformAiCustomizerContextDto.', ja: 'Spring AI ChatClient や VectorStore をカスタマイズします。', zh: '定制 Spring AI ChatClient、Prompt 模板与 VectorStore 向量检索。' },
      file: 'PlatformAiCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 3: Security & Identity', en: 'Group 3: Security & Identity', ja: '第3群: Security & Identity', zh: '第 3 组: 安全与身份认证' },
      desc: { vi: 'Mở rộng JWT Filter, OAuth2 / OIDC, PasswordEncoder qua SecurityCustomizerContextDto.', en: 'Extends JWT filters, OAuth2/OIDC, and auth chains via SecurityCustomizerContextDto.', ja: 'JWTフィルタ、OAuth2/OIDC認証チェーンを拡張します。', zh: '通过 SecurityCustomizerContextDto 扩展 JWT 过滤器、OAuth2 与认证链。' },
      file: 'SecurityIdentityCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 4: Data Access', en: 'Group 4: Data Access', ja: '第4群: Data Access', zh: '第 4 组: 数据访问持久化' },
      desc: { vi: 'Tùy biến JPA, JDBC, Redis, MongoDB, Elasticsearch, GraphQL qua DataCustomizerContextDto.', en: 'Customizes JPA, JDBC, Redis, MongoDB, Elasticsearch, and GraphQL via DataCustomizerContextDto.', ja: 'JPA/Redis/MongoDB/GraphQL 連携を調整します。', zh: '定制 JPA、JDBC、Redis、MongoDB 及 GraphQL 查询策略。' },
      file: 'DataAccessCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 5: Spring Cloud', en: 'Group 5: Spring Cloud', ja: '第5群: Spring Cloud', zh: '第 5 组: Spring Cloud 微服务' },
      desc: { vi: 'Tích hợp Config, Discovery, Gateway, Resilience4j, OpenTelemetry qua CloudCustomizerContextDto.', en: 'Configures Discovery, Gateway, Resilience4j, and Tracing via CloudCustomizerContextDto.', ja: 'Discovery、Gateway、Resilience4j、OTel 設定を拡張します。', zh: '定制服务注册发现、API 网关、Resilience4j 与链路追踪。' },
      file: 'SpringCloudCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 6: Messaging & Integration', en: 'Group 6: Messaging & Integration', ja: '第6群: Messaging', zh: '第 6 组: 消息与集成流' },
      desc: { vi: 'Cấu hình RabbitMQ AMQP, Kafka, Pulsar, Webhooks qua MessagingCustomizerContextDto.', en: 'Configures AMQP, Kafka, Pulsar, and event dispatch via MessagingCustomizerContextDto.', ja: 'AMQP、Kafka、Pulsar 統合をカスタマイズします。', zh: '定制 RabbitMQ、Apache Kafka、Pulsar 及外部事件分发管道。' },
      file: 'MessagingIntegrationCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 7: Architecture Extension', en: 'Group 7: Architecture Extension', ja: '第7群: Architecture', zh: '第 7 组: 架构扩展与模块化' },
      desc: { vi: 'Mở rộng ranh giới module, HATEOAS, Session qua ArchitectureCustomizerContextDto.', en: 'Extends module boundaries, HATEOAS, and sessions via ArchitectureCustomizerContextDto.', ja: 'モジュール境界検証やセッション拡張を適用します。', zh: '定制模块边界校验、HATEOAS 超媒体及分布式会话管理。' },
      file: 'ArchitectureExtensionCustomizer.java',
    },
    {
      name: { vi: 'Nhóm 8 (Storage SPI): File Storage', en: 'Group 8 (Storage SPI): File Storage', ja: '第8 (ストレージSPI): File Storage', zh: '第 8 个 (存储 SPI): 文件存储扩展' },
      desc: { vi: 'Chặn/kiểm tra ngữ cảnh tải tệp Local, S3, GCS qua StorageCustomizerRegistryHelper và StorageCustomizerContextDto.', en: 'Intercepts Local, S3, and GCS storage contexts via StorageCustomizerRegistryHelper and StorageCustomizerContextDto.', ja: 'StorageCustomizerRegistryHelper 経由で Local/S3/GCS ストレージ操作を拡張します。', zh: '通过 StorageCustomizerRegistryHelper 与 StorageCustomizerContextDto 扩展 Local/S3/GCS 文件存储行为。' },
      file: 'StorageCustomizer.java',
    },
  ],
  calloutTitle: {
    vi: 'Zero-Boilerplate SPI Bằng Default Interface Methods',
    en: 'Default-Method SPI Design',
    ja: 'デフォルトメソッド採用のSPI設計',
    zh: '基于 Interface default 方法的 SPI 扩展哲学',
  },
  calloutBody: {
    vi: 'Không dùng abstract class: 100% SPI interface cung cấp default method rỗng. Đăng ký Bean với @AutoComponent và chỉ @Override phương thức cần can thiệp.',
    en: 'Zero abstract classes: every SPI interface defines default no-op methods. Declare an @AutoComponent bean and @Override only the target callback.',
    ja: 'abstract class は使用せず、すべてのSPIにデフォルトメソッドを定義しています。@AutoComponent として必要なフックだけを @Override してください。',
    zh: '禁用抽象类：所有 8 个 SPI 接口均内置 default 空实现。仅需将定制类标记为 @AutoComponent 并选择性 @Override 目标方法即可生效。',
  },
  s2Heading: {
    vi: '2. Endpoint Telemetry 7 Nhóm Hệ Sinh Thái: GET /api/v1/system/customizers',
    en: '2. 7-Group Ecosystem Telemetry Endpoint: GET /api/v1/system/customizers',
    ja: '2. 7大グループ診断エンドポイント: GET /api/v1/system/customizers',
    zh: '2. 7 大生态自定义器实时诊断端点: GET /api/v1/system/customizers',
  },
  s2Body: {
    vi: 'CustomizerTelemetryApiController đọc từ SpringEcosystemCustomizerRegistryHelper để trả về số lượng Customizer đang hoạt động cho 7 nhóm hệ sinh thái lõi (StorageCustomizer được quản lý riêng trong StorageCustomizerRegistryHelper):',
    en: 'CustomizerTelemetryApiController queries SpringEcosystemCustomizerRegistryHelper and returns CustomizerRegistrySummaryDto across the 7 core Spring groups (StorageCustomizer is managed independently by StorageCustomizerRegistryHelper):',
    ja: 'CustomizerTelemetryApiController は SpringEcosystemCustomizerRegistryHelper から7大コアグループの登録数を報告します（StorageCustomizer は StorageCustomizerRegistryHelper が独立管理）：',
    zh: 'CustomizerTelemetryApiController 通过 SpringEcosystemCustomizerRegistryHelper 返回 7 大核心生态分组的注册统计（StorageCustomizer 由 StorageCustomizerRegistryHelper 独立维护）：',
  },
  s3Heading: {
    vi: '3. HTTP Client Đối Tác Chuẩn W3C (ThirdPartyRestClientHelper)',
    en: '3. Outbound Third-Party Client with W3C Propagation (ThirdPartyRestClientHelper)',
    ja: '3. W3Cトレーシング対応の外部HTTPクライアント (ThirdPartyRestClientHelper)',
    zh: '3. 支持 W3C 链路透传的外部调用客户端 (ThirdPartyRestClientHelper)',
  },
  s3Body: {
    vi: 'Gọi HTTP ra ngoài qua thirdPartyRestClientHelper.executeOutboundCall(ThirdPartyCallRequestDto), tự động đính kèm traceparent + X-Request-ID và ánh xạ lỗi thành ThirdPartyIntegrationException (HTTP 502):',
    en: 'Invokes thirdPartyRestClientHelper.executeOutboundCall(ThirdPartyCallRequestDto), automatically propagating W3C traceparent + X-Request-ID headers and mapping upstream failures to ThirdPartyIntegrationException (HTTP 502):',
    ja: 'thirdPartyRestClientHelper.executeOutboundCall(request) 経由で外部APIを呼び出し、traceparent と X-Request-ID を自動伝播し、障害時は HTTP 502（ThirdPartyIntegrationException）へ変換します：',
    zh: '调用 thirdPartyRestClientHelper.executeOutboundCall(ThirdPartyCallRequestDto) 发起外部 HTTP 请求，自动注入 W3C traceparent 与 X-Request-ID，并将下游故障统一映射为 ThirdPartyIntegrationException (HTTP 502)：',
  },
  s4Heading: {
    vi: '4. HTTP Caching RFC 7232 Weak ETag (@HttpCacheable)',
    en: '4. RFC 7232 Conditional HTTP ETag Caching (@HttpCacheable)',
    ja: '4. RFC 7232 条件付き HTTP ETag キャッシュ (@HttpCacheable)',
    zh: '4. RFC 7232 条件请求 HTTP ETag 缓存 (@HttpCacheable)',
  },
  s4Body: {
    vi: 'Gắn @HttpCacheable để tự động xuất tiêu đề ETag + Cache-Control và trả HTTP 304 Not Modified (0 bytes body) khi header If-None-Match trùng khớp:',
    en: 'Annotate interfaces or methods with @HttpCacheable to emit ETag + Cache-Control headers and short-circuit matching If-None-Match requests with HTTP 304 Not Modified (0-byte body):',
    ja: '@HttpCacheable により ETag と Cache-Control ヘッダーを自動出力し、If-None-Match 一致時は 0 バイトの HTTP 304 Not Modified を返却します：',
    zh: '标注 @HttpCacheable 后自动计算 ETag 并注入 Cache-Control 响应头；客户端携带匹配的 If-None-Match 时直接返回零字节 HTTP 304 Not Modified：',
  },
  s5Heading: {
    vi: '5. Chẩn Đoán Khởi Động Thân Thiện (DeveloperFriendlyDiagnosticsHelper)',
    en: '5. Actionable Startup Diagnostics (DeveloperFriendlyDiagnosticsHelper)',
    ja: '5. 起動時開発者診断バナー (DeveloperFriendlyDiagnosticsHelper)',
    zh: '5. 开发者友好启动引导日志 (DeveloperFriendlyDiagnosticsHelper)',
  },
};

export const CustomizersAndIntegrationPage: React.FC<Props> = ({ currentLang }) => {
  const icons = [Cpu, Sparkles, ShieldCheck, Database, Cloud, MessageSquare, Layers, HardDrive];
  const badges = ['badge-emerald', 'badge-blue', 'badge-amber', 'badge-purple', 'badge-blue', 'badge-rose', 'badge-emerald', 'badge-amber'];

  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">8 Customizer SPIs</span>
        <span className="badge badge-blue">RFC 7232 ETag</span>
        <span className="badge badge-purple">executeOutboundCall W3C</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && '8 Giao Diện SPI Customizer & Tích Hợp Hệ Thống Ngoài'}
        {currentLang === 'en' && '8 Ecosystem Customizer SPIs & Enterprise Outbound Integration'}
        {currentLang === 'ja' && '8種のエコシステムSPIカスタマイザと外部システム統合'}
        {currentLang === 'zh' && '8 个 Spring 生态扩展 SPI 接口与外部系统集成'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Kiến trúc mở rộng SPI qua 7 nhóm hệ sinh thái Spring (CustomizerTelemetryApiController) + StorageCustomizer, HTTP Client W3C TraceContext (ThirdPartyRestClientHelper.executeOutboundCall), @HttpCacheable ETag (304) và DeveloperFriendlyDiagnosticsHelper.'}
        {currentLang === 'en' &&
          'Extensible SPI layer spanning 7 Core Spring Ecosystem groups (CustomizerTelemetryApiController) plus StorageCustomizer, W3C-propagating HTTP Client (ThirdPartyRestClientHelper.executeOutboundCall), @HttpCacheable RFC 7232 ETag (304), and DeveloperFriendlyDiagnosticsHelper.'}
        {currentLang === 'ja' &&
          '7つのコアSpringエコシステムSPI群＋StorageCustomizer、W3Cトレース対応HTTPクライアント（ThirdPartyRestClientHelper.executeOutboundCall）、RFC 7232 ETagキャッシュ、起動診断バナーを標準搭載します。'}
        {currentLang === 'zh' &&
          '覆盖 7 大核心 Spring 生态扩展组与 StorageCustomizer 的 SPI 插件体系、支持 W3C 链路透传的 ThirdPartyRestClientHelper.executeOutboundCall、@HttpCacheable RFC 7232 ETag 缓存及启动引导诊断模块。'}
      </p>

      <h2 id="customizer-groups" className="section-heading">{TXT.s1Heading[currentLang]}</h2>

      <div className="doc-grid-2">
        {TXT.groups.map((grp, idx) => {
          const IconComponent = icons[idx];
          return (
            <div className="doc-card" key={grp.file}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <IconComponent size={16} />
                <span>{grp.name[currentLang]}</span>
              </h4>
              <p>{grp.desc[currentLang]}</p>
              <span className={`badge ${badges[idx]}`} style={{ marginTop: '0.6rem' }}>{grp.file}</span>
            </div>
          );
        })}
      </div>

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {TXT.calloutBody[currentLang]}
      </Callout>

      <CodeBlock
        language="java"
        fileName="CustomDataAccessCustomizer.java"
        code={`@AutoComponent
public class CustomDataAccessCustomizer implements DataAccessCustomizer {

  @Override
  public void customizeDataAccess(final DataCustomizerContextDto context) {
    // Customize DataSource routing, cache key prefixes, or GraphQL projections
  }
}`}
      />

      <h2 id="telemetry-endpoint" className="section-heading">{TXT.s2Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.s2Body[currentLang]}</p>

      <CodeBlock
        language="json"
        fileName="GET /api/v1/system/customizers"
        code={`{
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "coreCustomizerCount": 1,
    "platformAiCustomizerCount": 1,
    "securityCustomizerCount": 1,
    "dataCustomizerCount": 1,
    "cloudCustomizerCount": 1,
    "messagingCustomizerCount": 1,
    "architectureCustomizerCount": 1,
    "totalCustomizerCount": 7
  }
}`}
      />

      <h2 id="third-party-subsystem" className="section-heading">{TXT.s3Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.s3Body[currentLang]}</p>

      <CodeBlock
        language="java"
        fileName="PaymentGatewayService.java"
        code={`@AutoService
@RequiredArgsConstructor
public class PaymentGatewayService {

  private final ThirdPartyRestClientHelper thirdPartyRestClientHelper;

  public ThirdPartyCallResponseDto processCharge(final BigDecimal amount) {
    final ThirdPartyCallRequestDto request = ThirdPartyCallRequestDto.builder()
        .serviceName("StripePaymentGateway")
        .targetUrl("https://api.stripe.com/v1/charges")
        .httpMethod("POST")
        .payload("{\\"amount\\": " + amount + "}")
        .build();

    return thirdPartyRestClientHelper.executeOutboundCall(request);
  }
}`}
      />

      <h2 id="http-caching-etag" className="section-heading">{TXT.s4Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.s4Body[currentLang]}</p>

      <CodeBlock
        language="java"
        fileName="CommercialProductController.java"
        code={`@AutoRestController(path = "/api/v1/products")
public interface CommercialProductController extends AutoApiController<CommercialProduct> {

  @HttpCacheable(maxAgeSeconds = 3600, isPrivate = false, mustRevalidate = true, generateETag = true)
  default ApiResponse<String> getProductCatalogNotice() {
    return ApiResponse.success("Official Seasonal Product Catalog 2026");
  }
}`}
      />

      <h2 id="developer-diagnostics" className="section-heading">{TXT.s5Heading[currentLang]}</h2>
      <CodeBlock
        language="text"
        fileName="DevExConstant Startup Banner Output"
        code={`================================================================================
  :: Spring-NWVMC :: Pure Java Runtime Bridge Initialized (Java 21+)
================================================================================
  Swagger UI : http://localhost:8080/swagger-ui/index.html
  Dev Studio : http://localhost:8080/system/studio  (if studio.enabled=true)
  Customizers: http://localhost:8080/api/v1/system/customizers
================================================================================`}
      />
    </div>
  );
};
