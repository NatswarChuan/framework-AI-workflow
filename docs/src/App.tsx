import React, { useState, useMemo, useEffect } from 'react';
import { SupportedLanguage, TocHeading } from './types/docs';
import { NAVIGATION_CATEGORIES } from './data/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TableOfContents } from './components/TableOfContents';
import { TopicFocusBanner, TopicPaginationFooter } from './components/TopicFocusBanner';

// Modular Pages
import { OverviewPage } from './pages/OverviewPage';
import { QuickstartPage } from './pages/QuickstartPage';
import { TwoDirectoryPage } from './pages/TwoDirectoryPage';
import { PureJavaAndFileStoragePage } from './pages/PureJavaAndFileStoragePage';
import { DynamicProxyPage } from './pages/DynamicProxyPage';
import { VirtualThreadsPage } from './pages/VirtualThreadsPage';
import { AnnotationsPage } from './pages/AnnotationsPage';
import { EndpointsPage } from './pages/EndpointsPage';
import { QueryOperatorsPage } from './pages/QueryOperatorsPage';
import { SecurityRbacPage } from './pages/SecurityRbacPage';
import { SpringAiPage } from './pages/SpringAiPage';
import { CustomEndpointsPage } from './pages/CustomEndpointsPage';
import { GraphQLSubsystemPage } from './pages/GraphQLSubsystemPage';
import { MultiDatabasePage } from './pages/MultiDatabasePage';
import { WebSocketStompPage } from './pages/WebSocketStompPage';
import { DistributedLockPage } from './pages/DistributedLockPage';
import { WebhookSubsystemPage } from './pages/WebhookSubsystemPage';
import { TimeTravelPage } from './pages/TimeTravelPage';
import { IdempotencyPage } from './pages/IdempotencyPage';
import { DistributedTracingPage } from './pages/DistributedTracingPage';
import { CustomizersAndIntegrationPage } from './pages/CustomizersAndIntegrationPage';

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('vi');
  const [activeTopicId, setActiveTopicId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return NAVIGATION_CATEGORIES;
    const q = searchQuery.toLowerCase();

    return NAVIGATION_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.title[currentLang].toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [searchQuery, currentLang]);

  const t = (en: string, vi: string, ja: string, zh: string): string => {
    switch (currentLang) {
      case 'vi': return vi;
      case 'ja': return ja;
      case 'zh': return zh;
      default: return en;
    }
  };

  const pageHeadings: Record<string, TocHeading[]> = {
    overview: [
      { id: '7-viewpoint-matrix', title: t('7-Viewpoint Matrix', 'Ma Trận 7 Góc Nhìn', '7視点アーキテクチャ行列', '7维架构矩阵'), level: 2 },
      { id: 'architecture', title: t('High-Level Architecture', 'Luồng Kiến Trúc Xử Lý', '処理パイプライン構成', '高阶请求处理架构'), level: 2 },
      { id: 'maven-coordinates', title: t('Maven Dependency', 'Tọa Độ Phụ Thuộc Maven', 'Maven依存関係', 'Maven 依赖坐标'), level: 2 },
    ],
    quickstart: [
      { id: 'step-1', title: t('Step 1: Declare Entity', 'Bước 1: Khai Báo Entity', '手順1：エンティティ定義', '第 1 步：声明实体'), level: 2 },
      { id: 'step-2', title: t('Step 2: Declare Interface', 'Bước 2: Khai Báo Interface', '手順2：インターフェース定義', '第 2 步：声明空接口'), level: 2 },
      { id: 'step-3', title: t('Step 3: 38 Auto-Generated APIs', 'Bước 3: 38 REST APIs Tự Động', '手順3：自動生成38 API', '第 3 步：自动生成 38 个接口'), level: 2 },
    ],
    'two-directory': [
      { id: 'architectural-basis-2-dirs', title: t('Two-Directory Architecture Basis', 'Cơ Sở Kiến Trúc 2 Thư Mục', '2ディレクトリ構成の根拠', '双目录架构设计依据'), level: 2 },
      { id: 'custom-extensions', title: t('Complex Logic Extension', 'Xử Lý Luồng Phức Tạp', '複雑業務の拡張方法', '复杂多步业务扩展'), level: 2 },
    ],
    'pure-java-storage': [
      { id: 'pure-java-annotations', title: t('1. Pure Java Stereotypes', '1. Chú Thích Pure Java', '1. Pure Java アノテーション', '1. 纯 Java 立体型注解'), level: 2 },
      { id: 'l1-reflection-caches', title: t('2. L1 Reflection Caches', '2. Bộ Đệm L1 Phản Xạ', '2. L1 リフレクションキャッシュ', '2. L1 反射元数据缓存'), level: 2 },
      { id: 'file-storage-config', title: t('3. Storage Configuration', '3. Cấu Hình Local / S3 / GCS', '3. ストレージ構成設定', '3. 多云存储 YAML 配置'), level: 2 },
      { id: 'file-storage-endpoints', title: t('4. 6 Storage Endpoints', '4. 6 APIs Lưu Trữ Tệp', '4. 6つのストレージAPI', '4. 6 个内置存储端点'), level: 2 },
      { id: 'file-storage-sample', title: t('5. Upload & Presigned URL', '5. Ví Dụ Upload & Presigned URL', '5. アップロード＆署名付きURL', '5. 上传与预签名 URL 样例'), level: 2 },
    ],
    'dynamic-proxy': [
      { id: 'how-it-works', title: t('Route Synthesis Pipeline', 'Quy Trình Tổng Hợp Tuyến Đường', '動的プロキシ登録フロー', '动态路由合成管线'), level: 2 },
      { id: 'reflection-vs-cglib', title: t('JDK Proxy vs CGLIB', 'So Sánh JDK Proxy Với CGLIB', 'JDK動的プロキシ vs CGLIB', 'JDK 原生代理 vs CGLIB'), level: 2 },
      { id: 'route-registration', title: t('Pure Java Route Registration', 'Hiện Thực Đăng Ký Tuyến Đường', 'Pure Java ルート登録実装', '纯 Java 路由注册代码'), level: 2 },
    ],
    'virtual-threads': [
      { id: 'virtual-threads-setup', title: t('1. Configuration in YML', '1. Cấu Hình YML', '1. YML有効化設定', '1. YAML 启用虚拟线程'), level: 2 },
      { id: 'hikaricp-sizing', title: t('2. HikariCP Sizing', '2. Cân Chỉnh HikariCP', '2. HikariCP プール設計', '2. HikariCP 连接池参数'), level: 2 },
      { id: 'benchmarks', title: t('3. JMeter Load Benchmarks', '3. Benchmark Apache JMeter', '3. JMeter 負荷試験結果', '3. Apache JMeter 压测指标'), level: 2 },
    ],
    'custom-endpoints': [
      { id: 'custom-endpoint-decl', title: t('1. @CustomEndpoint Syntax', '1. Khai Báo @CustomEndpoint', '1. @CustomEndpoint 構文', '1. @CustomEndpoint 声明语法'), level: 2 },
      { id: 'custom-endpoint-delegate', title: t('2. Delegate Helper Bean', '2. Delegate Helper Bean', '2. 委譲先 Helper Bean', '2. 委派独立 Helper 组件'), level: 2 },
    ],
    'graphql-subsystem': [
      { id: 'graphql-sdl', title: t('1. Auto-Generated SDL', '1. Schema SDL Tự Động', '1. 自動生成 GraphQL SDL', '1. 自动生成 GraphQL SDL'), level: 2 },
      { id: 'graphql-query', title: t('2. HTTP Query Sample (/api/v1/graphql)', '2. Truy Vấn HTTP /api/v1/graphql', '2. HTTP クエリ実行例', '2. HTTP 查询调用样例'), level: 2 },
    ],
    'multi-database': [
      { id: 'target-database-platform', title: '1. @TargetDatabasePlatform', level: 2 },
      { id: 'tenant-cluster-routing', title: t('2. Dynamic Cluster Routing', '2. Đăng Ký Cụm CSDL Động', '2. 動的クラスタ登録', '2. 运行时多库集群注册'), level: 2 },
      { id: 'multi-db-health', title: t('3. Cluster Health Monitor', '3. Giám Sát Cụm CSDL', '3. クラスタ死活監視', '3. 数据库集群健康检查'), level: 2 },
    ],
    'websocket-stomp': [
      { id: 'websocket-config', title: t('1. WebSocket & STOMP Endpoints', '1. Endpoint WebSocket & STOMP', '1. WebSocket & STOMP エンドポイント', '1. WebSocket 与 STOMP 端点'), level: 2 },
      { id: 'backend-broadcaster', title: t('2. Backend Event Architecture', '2. Kiến Trúc Hướng Sự Kiện', '2. イベント駆動ブロードキャスト', '2. 后端事件广播架构'), level: 2 },
      { id: 'frontend-client', title: t('3. Frontend Client Integration', '3. Tích Hợp Phía Client', '3. クライアント連携例', '3. 前端订阅客户端集成'), level: 2 },
    ],
    'distributed-lock': [
      { id: 'annotation-attributes', title: t('1. @DistributedLock Annotation', '1. Chú Thích @DistributedLock', '1. @DistributedLock 属性仕様', '1. @DistributedLock 注解属性'), level: 2 },
      { id: 'usage-example', title: t('2. Usage Example', '2. Ví Dụ Nghiệp Vụ Thực Tế', '2. 在庫引当の利用例', '2. 库存扣减业务样例'), level: 2 },
      { id: 'double-entry-transfer', title: t('3. Double-Entry Transfer', '3. Chuyển Tiền Sổ Kép', '3. 二重仕訳送金の排他制御', '3. 双分录转账锁保护'), level: 2 },
    ],
    'webhook-subsystem': [
      { id: 'webhook-annotation', title: t('1. @EntityWebhook Annotation', '1. Chú Thích @EntityWebhook', '1. @EntityWebhook 宣言', '1. @EntityWebhook 注解声明'), level: 2 },
      { id: 'webhook-headers', title: t('2. Standard Webhook Headers', '2. Tiêu Đề HTTP Webhook', '2. Webhook HTTP ヘッダー', '2. Webhook 标准 HTTP 请求头'), level: 2 },
      { id: 'signature-verification', title: t('3. HMAC Verification', '3. Xác Thực Chữ Ký HMAC', '3. HMAC-SHA256 署名検証', '3. HMAC-SHA256 验签示例'), level: 2 },
    ],
    'time-travel': [
      { id: 'time-travel-endpoint', title: t('1. Time-Travel API', '1. API Time-Travel', '1. Time-Travel クエリAPI', '1. Time-Travel 历史快照查询'), level: 2 },
      { id: 'time-travel-response', title: t('2. Response Format', '2. Phản Hồi Trạng Thái Lịch Sử', '2. 復元スナップショット形式', '2. 历史状态重构响应格式'), level: 2 },
    ],
    idempotency: [
      { id: 'idempotent-annotation', title: t('1. @Idempotent Annotation', '1. Chú Thích @Idempotent', '1. @Idempotent 仕様', '1. @Idempotent 注解配置'), level: 2 },
      { id: 'idempotent-headers', title: t('2. HTTP Headers & SHA-256 Helper', '2. Tiêu Đề HTTP & SHA-256', '2. ヘッダー＆SHA-256整合性', '2. 幂等响应头与 SHA-256 校验'), level: 2 },
      { id: 'idempotent-errors', title: t('3. Conflict Handling', '3. Xử Lý Xung Đột', '3. 競合・不一致エラー', '3. 冲突与载荷校验异常'), level: 2 },
    ],
    'distributed-tracing': [
      { id: 'tracing-headers', title: t('1. W3C Tracing Headers', '1. Tiêu Đề W3C Tracing', '1. W3C トレーシングヘッダー', '1. W3C 链路追踪请求头规范'), level: 2 },
      { id: 'tracing-endpoint', title: t('2. Trace Context API', '2. API Ngữ Cảnh Trace', '2. トレース診断API', '2. 链路上下文调试端点'), level: 2 },
    ],
    'annotations-ref': [
      { id: 'autorestcontroller', title: '@AutoRestController', level: 2 },
      { id: 'entitysecurity', title: '@EntitySecurity', level: 2 },
      { id: 'statemachine', title: '@StateMachine', level: 2 },
      { id: 'publishcloudevent', title: '@PublishCloudEvent', level: 2 },
      { id: 'ratelimit', title: '@RateLimit', level: 2 },
      { id: 'entitycircuitbreaker', title: '@EntityCircuitBreaker', level: 2 },
      { id: 'httpcacheable', title: '@HttpCacheable', level: 2 },
      { id: 'fieldsecurity', title: '@FieldSecurity', level: 2 },
      { id: 'uniquefield', title: '@UniqueField', level: 2 },
      { id: 'idempotent', title: '@Idempotent', level: 2 },
    ],
    'endpoints-catalog': [
      { id: 'endpoint-table', title: t('Endpoint Directory', 'Danh Mục Toàn Bộ Endpoints', '全エンドポイント一覧', '端点全量目录表'), level: 2 },
      { id: 'endpoint-toggles', title: t('Granular Endpoint Toggles', 'Bật/Tắt Endpoint Linh Hoạt', '個別エンドポイント有効/無効化', '端点白名单与黑名单控制'), level: 2 },
    ],
    'query-operators': [
      { id: 'operators-table', title: t('13 Filter Operators', '13 Toán Tử Lọc Động', '13種類の動的フィルタ演算子', '13 种动态过滤运算符'), level: 2 },
      { id: 'keyset-pagination', title: t('Keyset vs OFFSET', 'Keyset So Với OFFSET', 'Keyset vs OFFSET 性能比較', 'Keyset 游标分页 vs OFFSET'), level: 2 },
      { id: 'keyset-usage', title: t('Keyset Usage Sample', 'Ví Dụ Sử Dụng Keyset', 'Keyset クエリ使用例', 'Keyset 游标查询示例'), level: 2 },
    ],
    'security-rbac-ref': [
      { id: 'rbac-roles', title: t('NIST RBAC Roles', 'Phân Quyền NIST RBAC', 'NIST RBAC ロール階層', 'NIST RBAC 角色权限矩阵'), level: 2 },
      { id: 'jwt-stateless', title: t('JWT Authentication', 'Xác Thực JWT Không Trạng Thái', 'ステートレス JWT 認証', '无状态 JWT 认证体系'), level: 2 },
      { id: 'field-masking', title: t('Dynamic PII Masking', 'Che Mờ Dữ Liệu PII Động', '動的 PII マスキング', '字段级动态脱敏 (@FieldSecurity)'), level: 2 },
      { id: 'pii-masking-util', title: t('PiiDataMaskingUtil & Anti-Scanner', 'Tiện Ích Che Mờ & Chống Scanner', 'PiiDataMaskingUtil ＆ 防御機構', 'PII 脱敏工具与防扫描矩阵'), level: 2 },
    ],
    'spring-ai-ref': [
      { id: 'ai-tool-schema', title: t('Tool Schema (/ai/context)', 'Tool Schema (/ai/context)', 'AI ツールスキーマ (/ai/context)', 'AI 工具模式 (/ai/context)'), level: 2 },
      { id: 'spring-ai-chat-client', title: 'Spring AI ChatClient', level: 2 },
      { id: 'natural-language-query', title: t('Natural Language Query', 'Truy Vấn Ngôn Ngữ Tự Nhiên', '自然言語クエリ (/ai/query)', '自然语言转译查询 (/ai/query)'), level: 2 },
    ],
    'customizers-ref': [
      { id: 'customizer-groups', title: t('1. 8 Customizer SPI Interfaces', '1. 8 Giao Diện Customizer SPI', '1. 8種のSPIカスタマイザ', '1. 8 个自定义扩展 SPI 接口'), level: 2 },
      { id: 'telemetry-endpoint', title: t('2. Telemetry Diagnostics', '2. Telemetry Chẩn Đoán', '2. 診断テレメトリAPI', '2. 运行时遥测诊断端点'), level: 2 },
      { id: 'third-party-subsystem', title: t('3. Outbound HTTP Client', '3. Tích Hợp Đối Tác Ngoài', '3. 外部HTTP統合クライアント', '3. W3C 链路透传客户端'), level: 2 },
      { id: 'http-caching-etag', title: t('4. HTTP ETag Caching', '4. Bộ Nhớ Đệm HTTP ETag', '4. HTTP ETag キャッシュ', '4. HTTP ETag 条件缓存'), level: 2 },
      { id: 'developer-diagnostics', title: t('5. Startup Diagnostics', '5. Chẩn Đoán Khởi Động', '5. 起動時開発者診断', '5. 启动引导诊断输出'), level: 2 },
    ],
  };

  const renderActivePage = () => {
    switch (activeTopicId) {
      case 'overview':
        return <OverviewPage currentLang={currentLang} />;
      case 'quickstart':
        return <QuickstartPage currentLang={currentLang} />;
      case 'two-directory':
        return <TwoDirectoryPage currentLang={currentLang} />;
      case 'pure-java-storage':
        return <PureJavaAndFileStoragePage currentLang={currentLang} />;
      case 'dynamic-proxy':
        return <DynamicProxyPage currentLang={currentLang} />;
      case 'virtual-threads':
        return <VirtualThreadsPage currentLang={currentLang} />;
      case 'annotations-ref':
        return <AnnotationsPage currentLang={currentLang} />;
      case 'endpoints-catalog':
        return <EndpointsPage currentLang={currentLang} />;
      case 'query-operators':
        return <QueryOperatorsPage currentLang={currentLang} />;
      case 'security-rbac-ref':
        return <SecurityRbacPage currentLang={currentLang} />;
      case 'spring-ai-ref':
        return <SpringAiPage currentLang={currentLang} />;
      case 'custom-endpoints':
        return <CustomEndpointsPage currentLang={currentLang} />;
      case 'graphql-subsystem':
        return <GraphQLSubsystemPage currentLang={currentLang} />;
      case 'multi-database':
        return <MultiDatabasePage currentLang={currentLang} />;
      case 'websocket-stomp':
        return <WebSocketStompPage currentLang={currentLang} />;
      case 'distributed-lock':
        return <DistributedLockPage currentLang={currentLang} />;
      case 'webhook-subsystem':
        return <WebhookSubsystemPage currentLang={currentLang} />;
      case 'time-travel':
        return <TimeTravelPage currentLang={currentLang} />;
      case 'idempotency':
        return <IdempotencyPage currentLang={currentLang} />;
      case 'distributed-tracing':
        return <DistributedTracingPage currentLang={currentLang} />;
      case 'customizers-ref':
        return <CustomizersAndIntegrationPage currentLang={currentLang} />;
      default:
        return <OverviewPage currentLang={currentLang} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="main-body">
        <Sidebar
          categories={filteredCategories}
          activeTopicId={activeTopicId}
          onSelectTopic={setActiveTopicId}
          currentLang={currentLang}
        />

        <main className="content-area">
          <TopicFocusBanner activeTopicId={activeTopicId} currentLang={currentLang} />
          {renderActivePage()}
          <TopicPaginationFooter
            activeTopicId={activeTopicId}
            onSelectTopic={setActiveTopicId}
            currentLang={currentLang}
          />
        </main>

        <TableOfContents
          headings={pageHeadings[activeTopicId] || []}
          title={
            currentLang === 'vi'
              ? 'MỤC LỤC TRANG NÀY'
              : currentLang === 'ja'
              ? 'このページの目次'
              : currentLang === 'zh'
              ? '本页目录导航'
              : 'ON THIS PAGE'
          }
        />
      </div>
    </div>
  );
};
