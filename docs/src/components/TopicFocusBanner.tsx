import React from 'react';
import { Target, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { NAVIGATION_CATEGORIES } from '../data/navigation';

interface FocusSummarySpec {
  coreGoal: Record<SupportedLanguage, string>;
  keySyntax: string;
  keyBenefit: Record<SupportedLanguage, string>;
}

const TOPIC_FOCUS_MAP: Record<string, FocusSummarySpec> = {
  overview: {
    coreGoal: {
      vi: 'Tự động sinh 38 REST APIs từ 1 Entity + 1 Interface rỗng với lõi 100% Pure Java Zero-Spring-Import.',
      en: 'Synthesize 38 REST APIs from 1 Entity + 1 empty Interface using a 100% Pure Java Zero-Spring-Import core.',
      ja: '100% Pure Java コアにより、1つのEntityと空Interfaceから38個のREST APIを自動合成。',
      zh: '基于 100% 纯 Java 零 Spring 源码导入核心，从 1 个实体 + 1 个空接口自动生成 38 个 REST 端点。',
    },
    keySyntax: '@AutoRestController(path = "/api/v1/products")',
    keyBenefit: {
      vi: 'Giảm 90% code lặp lại, bắt buộc Java 21+, 0.0% lỗi JMeter.',
      en: 'Eliminates 90% boilerplate, enforces Java 21+, 0.0% JMeter error rate.',
      ja: 'ボイラープレートを90%削減、Java 21+必須、JMeterエラー率0.0%。',
      zh: '消除 90% 模板代码，强制 Java 21+，JMeter 压测 0.0% 错误率。',
    },
  },
  quickstart: {
    coreGoal: {
      vi: 'Triển khai hệ thống 38 APIs hoàn chỉnh chỉ trong 3 phút với 3 bước rõ ràng.',
      en: 'Deploy 38 production-ready REST APIs in 3 minutes through 3 clear steps.',
      ja: '明確な3ステップで、3分以内に38個の本番用REST APIをデプロイ。',
      zh: '通过清晰的 3 个步骤，在 3 分钟内上线全套 38 个生产级 REST 接口。',
    },
    keySyntax: 'public interface ProductController extends AutoApiController<Product>',
    keyBenefit: {
      vi: 'Có sẵn Swagger UI, Live Studio (/system/studio) và bảng chẩn đoán lỗi thân thiện.',
      en: 'Instant Swagger UI, Live Studio (/system/studio), and friendly startup diagnostics.',
      ja: 'Swagger UI、Live Studio、親切な起動診断が即座に利用可能。',
      zh: '内置 Swagger UI、Live Studio 调试台与零门槛友好启动诊断。',
    },
  },
  'two-directory': {
    coreGoal: {
      vi: 'Giới hạn phạm vi code CRUD thông thường trong đúng 2 thư mục: entity/ và controller/.',
      en: 'Restrict standard domain development strictly to two directories: entity/ and controller/.',
      ja: '通常のドメイン開発を entity/ と controller/ の2ディレクトリのみに限定。',
      zh: '将常规领域开发严格收敛至 entity/ 与 controller/ 两个目录。',
    },
    keySyntax: 'entity/*.java  +  controller/*Controller.java  +  helper/*Helper.java',
    keyBenefit: {
      vi: 'Đảm bảo Strict Layer SRP: Controller chỉ điều phối, logic phức tạp tách sang @AutoComponent Helper.',
      en: 'Enforces Strict Layer SRP: Controller only dispatches; complex workflows live in Helpers.',
      ja: '厳格なSRP：Controllerはディスパッチのみ、複雑な処理はHelperへ分離。',
      zh: '严格践行分层单职责：Controller 仅做调度，复杂业务下沉至独立 Helper。',
    },
  },
  'pure-java-storage': {
    coreGoal: {
      vi: 'Lõi Framework 100% Pure Java (0 import org.springframework.*) & Lưu trữ tệp đa đám mây (Local, S3, GCS).',
      en: '100% Pure Java Engine (0 import org.springframework.*) & Multi-Cloud File Storage (Local, S3, GCS).',
      ja: '100% Pure Java コア（Spring import ゼロ）＆マルチクラウドファイルストレージ（Local, S3, GCS）。',
      zh: '100% 纯 Java 零 Spring 导入引擎与多云文件存储子系统（本地磁盘、AWS S3、GCS）。',
    },
    keySyntax: 'app.framework.storage.provider: LOCAL | S3 | GCS  (@AutoComponent / @AutoService)',
    keyBenefit: {
      vi: 'Tự động kích hoạt 6 APIs upload/download/presigned-url/metadata tại /api/v1/storage.',
      en: 'Auto-registers 6 upload/download/presigned-url/metadata endpoints at /api/v1/storage.',
      ja: '/api/v1/storage にアップロード・ダウンロード・署名付きURLの6 APIを自動公開。',
      zh: '自动暴露 /api/v1/storage 下的上传、流式下载、预签名 URL 等 6 个接口。',
    },
  },
  'dynamic-proxy': {
    coreGoal: {
      vi: 'Tổng hợp động các tuyến đường HTTP qua JDK Dynamic Proxy mà không cần sinh bytecode CGLIB.',
      en: 'Synthesize HTTP routes dynamically at boot via JDK Dynamic Proxy with zero bytecode generation.',
      ja: 'CGLIBバイトコード生成なしで、起動時にJDK動的プロキシからHTTPルートを合成。',
      zh: '启动阶段通过 JDK 原生动态代理合成 HTTP 路由，零字节码改写开销。',
    },
    keySyntax: 'Proxy.newProxyInstance(loader, new Class<?>[]{controllerInterface}, handler)',
    keyBenefit: {
      vi: 'Khởi động < 50ms, tương thích GraalVM Native Image, stack trace minh bạch.',
      en: '< 50ms startup impact, GraalVM friendly, clean stack traces.',
      ja: '起動負荷50ms未満、GraalVM対応、クリーンなスタックトレース。',
      zh: '启动耗时 < 50ms，天然亲和 GraalVM Native Image，堆栈清晰。',
    },
  },
  'virtual-threads': {
    coreGoal: {
      vi: 'Xử lý hàng chục nghìn kết nối đồng thời với Java 21 Virtual Threads và HikariCP tối ưu.',
      en: 'Handle tens of thousands of concurrent requests with Java 21 Virtual Threads and tuned HikariCP.',
      ja: 'Java 21仮想スレッドと最適化されたHikariCPで数万の同時接続を処理。',
      zh: '结合 Java 21 虚拟线程与精细化 HikariCP 连接池，轻松承载数万并发。',
    },
    keySyntax: 'spring.threads.virtual.enabled: true',
    keyBenefit: {
      vi: 'Tiết kiệm 99% RAM trên mỗi luồng chờ I/O, đạt 151.0 req/s trên 2,000 requests JMeter với 0.0% lỗi.',
      en: 'Saves 99% RAM per blocked I/O thread, 151.0 req/s across 2,000 JMeter requests with 0.0% error rate.',
      ja: 'I/O待機スレッドのRAMを99%削減、JMeter 2,000リクエストで 151.0 req/s（エラー率 0.0%）を達成。',
      zh: '节省 99% 阻塞线程内存，JMeter 2,000 请求实测 151.0 req/s 且 0.0% 错误率。',
    },
  },
  'custom-endpoints': {
    coreGoal: {
      vi: 'Mở rộng thêm các API nghiệp vụ đặc thù ngay trên Controller Interface mà không viết class Controller.',
      en: 'Add custom domain endpoints directly on Controller Interfaces without procedural Controller classes.',
      ja: '実装クラスを書かずにControllerインターフェースへ独自APIを直接追加。',
      zh: '无需手写实现类，直接在 Controller 接口上声明领域专属定制接口。',
    },
    keySyntax: '@CustomEndpoint(path = "/{id}/refund", httpMethod = "POST", delegateBean = "...")',
    keyBenefit: {
      vi: 'Giữ nguyên 100% kiến trúc Pure Dispatcher, ủy quyền xử lý sang Helper bean.',
      en: 'Preserves 100% Pure Dispatcher architecture by delegating to Helper beans.',
      ja: '純粋なディスパッチャ構造を100%維持し、Helperビーンへ自動委譲。',
      zh: '100% 保持纯粹调度器架构，自动反射委派给独立 Helper 组件。',
    },
  },
  'graphql-subsystem': {
    coreGoal: {
      vi: 'Tự động sinh lược đồ GraphQL SDL và thực thi truy vấn chọn lọc trường tại /api/v1/graphql.',
      en: 'Auto-generate GraphQL SDL schemas and execute field-selective queries at /api/v1/graphql.',
      ja: 'GraphQL SDLスキーマを自動生成し、/api/v1/graphql でフィールド選択クエリを実行。',
      zh: '自动生成 GraphQL SDL 模式并在 /api/v1/graphql 执行按需字段投影查询。',
    },
    keySyntax: 'POST /api/v1/graphql   |   GET /api/v1/graphql/schema   |   GET /api/v1/graphql/explorer',
    keyBenefit: {
      vi: 'Triệt tiêu 100% over-fetching mà không cần viết file .graphqls hay Resolver thủ công.',
      en: 'Eliminates over-fetching with zero manual .graphqls files or resolvers.',
      ja: '.graphqlsファイルやResolverの手動作成なしでオーバーフェッチを解消。',
      zh: '零手写 .graphqls 与 Resolver，彻底消除前后端数据过度获取。',
    },
  },
  'multi-database': {
    coreGoal: {
      vi: 'Định tuyến truy vấn tự động giữa nhiều cụm CSDL (Primary, Read-Replica, Finance, Multi-Tenant).',
      en: 'Route queries dynamically across Primary, Read-Replica, Finance, and Multi-Tenant DB clusters.',
      ja: 'Primary、Replica、財務クラスタ、マルチテナントDB間でクエリを動的ルーティング。',
      zh: '在主库、只读副本、财务专库及多租户分库之间实现声明式动态路由。',
    },
    keySyntax: '@TargetDatabasePlatform(platform = "POSTGRESQL", cluster = "FINANCE_CLUSTER")',
    keyBenefit: {
      vi: 'Cô lập dữ liệu vật lý theo Tenant JWT, giám sát sức khỏe cụm qua GET /api/v1/system/databases/health.',
      en: 'Physical tenant isolation via JWT and live health inspection at GET /api/v1/system/databases/health.',
      ja: 'JWTによるテナント分離と GET /api/v1/system/databases/health での死活監視。',
      zh: '基于 JWT 实现租户物理隔离，支持 GET /api/v1/system/databases/health 集群监控。',
    },
  },
  'websocket-stomp': {
    coreGoal: {
      vi: 'Phát sóng sự kiện thay đổi thực thể thời gian thực qua WebSocket STOMP sau khi DB commit.',
      en: 'Broadcast entity mutations in real time over WebSocket STOMP strictly after DB commit.',
      ja: 'DBコミット直後にWebSocket STOMP経由でエンティティ変更イベントをリアルタイム配信。',
      zh: '在数据库事务提交后，通过 WebSocket STOMP 实时广播实体变更事件。',
    },
    keySyntax: 'ws://localhost:8080/ws-connect  ->  /topic/{entity}/{created|updated|deleted}',
    keyBenefit: {
      vi: 'Loại bỏ hoàn toàn HTTP polling, chống phát sự kiện giả khi giao dịch rollback.',
      en: 'Zero HTTP polling overhead and zero phantom messages on transaction rollback.',
      ja: 'ポーリング不要、ロールバック時の誤配信ゼロを保証。',
      zh: '彻底告别前端轮询，事务回滚时绝不产生脏消息推送。',
    },
  },
  'distributed-lock': {
    coreGoal: {
      vi: 'Chống Race Condition, Double-Spending và bán lố tồn kho bằng khóa phân tán khai báo.',
      en: 'Prevent race conditions, double-spending, and overselling with declarative distributed locks.',
      ja: '宣言的分散ロックにより、競合状態・二重決済・在庫過剰販売を防止。',
      zh: '通过声明式分布式锁彻底杜绝并发竞态、重复扣款与库存超卖。',
    },
    keySyntax: '@DistributedLock(key = "\'LOCK:INVENTORY:\' + #productId", waitTimeMs = 2000L)',
    keyBenefit: {
      vi: 'Tự động trả về HTTP 409 CONFLICT khi tài nguyên đang khóa, tự giải phóng theo leaseTimeMs.',
      en: 'Returns deterministic HTTP 409 CONFLICT on lock contention with automatic TTL lease expiry.',
      ja: '競合時はHTTP 409 CONFLICTを返し、leaseTimeMsで自動解放。',
      zh: '锁竞争超时自动返回 HTTP 409 CONFLICT，租约到期自动释放防死锁。',
    },
  },
  'webhook-subsystem': {
    coreGoal: {
      vi: 'Tự động ký số HMAC-SHA256 và đẩy Webhook bất đồng bộ tới đối tác khi dữ liệu thay đổi.',
      en: 'Sign payloads with HMAC-SHA256 and dispatch outbound webhooks asynchronously on entity changes.',
      ja: 'エンティティ変更時にHMAC-SHA256署名付きWebhookを非同期で外部配信。',
      zh: '实体变更时自动生成 HMAC-SHA256 签名并在虚拟线程中异步推送 Webhook。',
    },
    keySyntax: '@EntityWebhook(events = {"CREATED", "STATE_CHANGED"}, secretHeader = "X-Webhook-Signature")',
    keyBenefit: {
      vi: 'Chạy trên Virtual Threads sau khi commit, không làm chậm luồng API chính.',
      en: 'Runs on Virtual Threads post-commit so external latency never blocks primary APIs.',
      ja: 'コミット後に仮想スレッドで実行され、メインAPIの応答速度に影響なし。',
      zh: '事务提交后于虚拟线程异步投递，外部网络延迟绝不阻塞主接口。',
    },
  },
  'time-travel': {
    coreGoal: {
      vi: 'Tái tạo chính xác trạng thái của bản ghi tại bất kỳ thời điểm nào trong quá khứ qua CDC diffs.',
      en: 'Reconstruct the exact historical state of any record at any past timestamp via CDC diffs.',
      ja: 'CDC差分ログの逆適用により、過去任意時点のレコード状態を正確に復元。',
      zh: '通过逆向回放 CDC 审计增量，精准还原实体在过去任意时刻的状态快照。',
    },
    keySyntax: 'GET /api/v1/system/time-travel/{entityName}/{id}?timestamp=2026-11-01T15:30:00Z',
    keyBenefit: {
      vi: 'Độ phức tạp O(K) theo số lượng bản sửa đổi, phục vụ kiểm toán tài chính & y tế.',
      en: 'O(K) reconstruction complexity without expensive full-database snapshots.',
      ja: 'フルバックアップ不要のO(K)アルゴリズムで金融・医療監査に対応。',
      zh: '无需全库镜像即可 O(K) 极速还原，满足金融与医疗合规审计。',
    },
  },
  idempotency: {
    coreGoal: {
      vi: 'Bảo vệ thao tác ghi phân tán với @Idempotent (IdempotencyAspect) và kiểm tra SHA-256 qua IdempotencyManagerHelper.',
      en: 'Guard mutating operations with @Idempotent (IdempotencyAspect) and SHA-256 payload checks via IdempotencyManagerHelper.',
      ja: '@Idempotent（IdempotencyAspect）および IdempotencyManagerHelper の SHA-256 検証で一回限りの実行を保証。',
      zh: '通过 @Idempotent（IdempotencyAspect）与 IdempotencyManagerHelper 的 SHA-256 指纹校验保障单次精确执行。',
    },
    keySyntax: '@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 86400L)',
    keyBenefit: {
      vi: 'Chặn trùng khóa AOP bằng HTTP 409; IdempotencyManagerHelper xác thực SHA-256 trả HIT hoặc HTTP 422 khi sai payload.',
      en: 'AOP rejects key/in-flight collisions with HTTP 409; IdempotencyManagerHelper enforces SHA-256 integrity (HIT / HTTP 422).',
      ja: 'AOPが重複キーをHTTP 409で遮断し、IdempotencyManagerHelperがSHA-256不一致をHTTP 422で検出。',
      zh: 'AOP 切面以 HTTP 409 拦截重复并发键；IdempotencyManagerHelper 校验 SHA-256 负载并按需返回 HIT 或 HTTP 422。',
    },
  },
  'distributed-tracing': {
    coreGoal: {
      vi: 'Truy vết toàn trình chuẩn W3C TraceContext (traceparent) và UUIDv7 X-Request-ID qua MDC.',
      en: 'End-to-end W3C TraceContext (traceparent) and UUIDv7 X-Request-ID propagation via SLF4J MDC.',
      ja: 'W3C TraceContext（traceparent）とUUIDv7 X-Request-IDによる分散トレーシング。',
      zh: '原生支持 W3C TraceContext (traceparent) 与 UUIDv7 X-Request-ID 全链路追踪。',
    },
    keySyntax: 'traceparent: 00-{32-hex-trace-id}-{16-hex-span-id}-01',
    keyBenefit: {
      vi: 'Tích hợp sẵn với OpenTelemetry, Jaeger, Grafana Tempo và tự động đính kèm vào ApiResponse.',
      en: 'Seamless integration with OpenTelemetry, Jaeger, Tempo, and every ApiResponse envelope.',
      ja: 'OpenTelemetry、Jaeger、Tempoおよび全ApiResponseへ自動統合。',
      zh: '无缝对接 OpenTelemetry、Jaeger，并自动注入每一个 ApiResponse 响应体。',
    },
  },
  'annotations-ref': {
    coreGoal: {
      vi: 'Tra cứu nhanh 10 chú thích khai báo cốt lõi thay thế hàng nghìn dòng code thủ công.',
      en: 'Master the 10 core declarative annotations that replace thousands of lines of manual code.',
      ja: '数千行の手動コードを置き換える10個の中核宣言的アノテーション早見表。',
      zh: '掌握替代数千行手写代码的 10 大核心声明式注解完整规范。',
    },
    keySyntax: '@EntitySecurity • @StateMachine • @FieldSecurity • @UniqueField • @AutoCode',
    keyBenefit: {
      vi: 'Mỗi annotation giải quyết trọn vẹn 1 bài toán: RBAC, FSM, Masking, AutoCode, Audit.',
      en: 'Each annotation solves one cross-cutting concern declaratively with zero boilerplate.',
      ja: 'RBAC、状態遷移、マスキング、自動採番、監査をアノテーション1つで完結。',
      zh: '每个注解一站式解决鉴权、状态机、脱敏、自动编码与审计等横切关注点。',
    },
  },
  'endpoints-catalog': {
    coreGoal: {
      vi: 'Danh mục đầy đủ 38 RESTful Endpoints tự động sinh cho mỗi Controller Interface.',
      en: 'Complete directory of all 38 production-grade RESTful endpoints generated per entity.',
      ja: 'エンティティごとに自動生成される全38種類のRESTfulエンドポイント一覧。',
      zh: '每个实体控制器自动生成的完整 38 个生产级 RESTful 端点目录。',
    },
    keySyntax: 'CRUD • Keyset O(1) • JSON Patch • CSV/JSONL Stream • Diff • Sub-Resources • AI',
    keyBenefit: {
      vi: 'Hỗ trợ bật/tắt linh hoạt từng endpoint qua enabledEndpoints / disabledEndpoints.',
      en: 'Granularly enable or disable any route via enabledEndpoints / disabledEndpoints.',
      ja: 'enabledEndpoints / disabledEndpoints で個別ルートの有効・無効を自在に制御。',
      zh: '支持通过 enabledEndpoints / disabledEndpoints 按需启闭任意端点。',
    },
  },
  'query-operators': {
    coreGoal: {
      vi: 'Truy vấn lọc động với 13 toán tử an toàn SQL Injection và phân trang Keyset Cursor O(1).',
      en: 'Dynamic filtering with 13 SQL-injection-safe operators and O(1) Keyset Cursor pagination.',
      ja: 'SQLインジェクション安全な13種類の演算子とO(1) Keysetカーソルページネーション。',
      zh: '防 SQL 注入的 13 种动态过滤运算符与大数据 O(1) Keyset 游标分页。',
    },
    keySyntax: 'GET /api/v1/orders/keyset?size=20&afterId=0194e1a0-...&price_gte=100',
    keyBenefit: {
      vi: 'Giữ tốc độ truy vấn ổn định 4ms ở trang thứ 50.000 trên bảng hàng triệu bản ghi.',
      en: 'Maintains constant 4ms query latency even at page 50,000 on multi-million-row tables.',
      ja: '数百万行のテーブルの50,000ページ目でも4msの一定応答速度を維持。',
      zh: '在千万级大表第 50,000 页依然保持 4ms 恒定索引寻址耗时。',
    },
  },
  'security-rbac-ref': {
    coreGoal: {
      vi: 'Bảo mật đa tầng: JWT không trạng thái, phân quyền NIST Level 2 RBAC và che mờ PII động.',
      en: 'Defense-in-depth: Stateless JWT, NIST Level 2 RBAC hierarchy, and dynamic PII masking.',
      ja: '多層防御：ステートレスJWT、NISTレベル2 RBAC、動的PIIデータマスキング。',
      zh: '纵深防御体系：无状态 JWT、NIST Level 2 RBAC 角色分级与动态 PII 脱敏。',
    },
    keySyntax: '@EntitySecurity(readRoles = ...)  +  @FieldSecurity(viewRoles = ..., maskPattern = "***")',
    keyBenefit: {
      vi: 'Che mờ dữ liệu ngay tại tầng serialize JSON mà không làm thay đổi dữ liệu gốc trong DB.',
      en: 'Masks sensitive fields during Jackson serialization without mutating database state.',
      ja: 'DBの元データを変更せず、JSONシリアライズ時に機密フィールドを自動マスク。',
      zh: '在 JSON 序列化阶段动态脱敏，绝不污染数据库原始记录与缓存。',
    },
  },
  'spring-ai-ref': {
    coreGoal: {
      vi: 'Kết nối dữ liệu thực thể với LLM qua Function Calling Schema (/ai/context) và truy vấn ngôn ngữ tự nhiên.',
      en: 'Bridge entities with LLMs via Function Calling Schemas (/ai/context) and natural language queries.',
      ja: 'Function Callingスキーマ（/ai/context）と自然言語クエリでLLMとDBを直結。',
      zh: '通过工具调用 Schema (/ai/context) 与自然语言查询将实体数据无缝接入大模型。',
    },
    keySyntax: 'GET /api/v1/{entities}/ai/context   |   POST /api/v1/{entities}/ai/query',
    keyBenefit: {
      vi: 'Chuyển đổi câu hỏi tự nhiên thành JPA Criteria Predicate tham số hóa, chống SQL Injection 100%.',
      en: 'Translates natural prompts into parameterized JPA Criteria Predicates with zero SQLi risk.',
      ja: '自然文をパラメータ化されたJPA Criteriaへ変換し、SQLインジェクションを完全防止。',
      zh: '将自然语言安全转译为参数化 JPA Criteria 谓词，100% 免疫 SQL 注入。',
    },
  },
  'customizers-ref': {
    coreGoal: {
      vi: 'Tùy biến toàn diện 8 giao diện SPI hệ sinh thái Spring, HTTP Caching ETag (304) và Startup Diagnostics.',
      en: 'Customize all 8 Spring ecosystem SPI interfaces, RFC 7232 ETag caching, and Startup Diagnostics.',
      ja: '8種類のSpringエコシステムSPI拡張、RFC 7232 ETagキャッシュ、起動時診断を設定。',
      zh: '覆盖 Spring 生态 8 大 SPI 自定义接口、RFC 7232 HTTP ETag 缓存与启动 Fail-Fast 诊断。',
    },
    keySyntax: 'implements DataAccessCustomizer  |  @HttpCacheable(maxAgeSeconds = 3600L)',
    keyBenefit: {
      vi: 'Mở rộng không giới hạn (Open/Closed Principle) và tiết kiệm 99% băng thông với HTTP 304.',
      en: 'Infinite extensibility (Open/Closed Principle) and 99% bandwidth savings via HTTP 304.',
      ja: '無制限の拡張性（OCP）とHTTP 304による99%の帯域削減を実現。',
      zh: '遵循开闭原则实现无侵入扩展，利用 HTTP 304 节省 99% 重复响应带宽。',
    },
  },
};

interface TopicFocusBannerProps {
  activeTopicId: string;
  currentLang: SupportedLanguage;
}

export const TopicFocusBanner: React.FC<TopicFocusBannerProps> = ({
  activeTopicId,
  currentLang,
}) => {
  const spec = TOPIC_FOCUS_MAP[activeTopicId] || TOPIC_FOCUS_MAP.overview;

  const labels = {
    header: {
      vi: 'TRỌNG TÂM CỐT LÕI (QUICK FOCUS SUMMARY)',
      en: 'KEY FOCUS TAKEAWAYS (3-SECOND SUMMARY)',
      ja: 'このセクションの核心ポイント（3秒サマリー）',
      zh: '核心重点速览（3秒抓住重点）',
    },
    goal: {
      vi: '🎯 Mục Tiêu Trọng Tâm',
      en: '🎯 Core Purpose',
      ja: '🎯 主な目的',
      zh: '🎯 核心用途',
    },
    syntax: {
      vi: '⚡ Cú Pháp / API Cốt Lõi',
      en: '⚡ Key Syntax / API',
      ja: '⚡ 主要構文・API',
      zh: '⚡ 关键注解与接口',
    },
    benefit: {
      vi: '🚀 Giá Trị Mang Lại',
      en: '🚀 Enterprise Value',
      ja: '🚀 導入メリット',
      zh: '🚀 架构收益',
    },
  };

  return (
    <div className="focus-summary-box">
      <div className="focus-summary-header">
        <Target size={16} />
        <span>{labels.header[currentLang]}</span>
      </div>
      <div className="focus-summary-grid">
        <div className="focus-summary-item">
          <div className="focus-summary-item-label">{labels.goal[currentLang]}</div>
          <div className="focus-summary-item-value">{spec.coreGoal[currentLang]}</div>
        </div>
        <div className="focus-summary-item">
          <div className="focus-summary-item-label">{labels.syntax[currentLang]}</div>
          <div
            className="focus-summary-item-value mono"
            style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', wordBreak: 'break-word' }}
          >
            {spec.keySyntax}
          </div>
        </div>
        <div className="focus-summary-item">
          <div className="focus-summary-item-label">{labels.benefit[currentLang]}</div>
          <div className="focus-summary-item-value">{spec.keyBenefit[currentLang]}</div>
        </div>
      </div>
    </div>
  );
};

interface TopicPaginationFooterProps {
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  currentLang: SupportedLanguage;
}

export const TopicPaginationFooter: React.FC<TopicPaginationFooterProps> = ({
  activeTopicId,
  onSelectTopic,
  currentLang,
}) => {
  const flatItems = NAVIGATION_CATEGORIES.flatMap((c) => c.items);
  const currentIndex = flatItems.findIndex((item) => item.id === activeTopicId);
  const prevItem = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

  return (
    <div className="page-nav-footer">
      {prevItem ? (
        <button
          className="page-nav-btn prev"
          onClick={() => {
            onSelectTopic(prevItem.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} />
            {currentLang === 'vi' ? 'Mục Trước' : currentLang === 'ja' ? '前のトピック' : currentLang === 'zh' ? '上一篇' : 'Previous Topic'}
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {prevItem.title[currentLang]}
          </span>
        </button>
      ) : <div />}

      {nextItem ? (
        <button
          className="page-nav-btn next"
          onClick={() => {
            onSelectTopic(nextItem.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {currentLang === 'vi' ? 'Mục Tiếp Theo' : currentLang === 'ja' ? '次のトピック' : currentLang === 'zh' ? '下一篇' : 'Next Topic'}
            <ArrowRight size={14} />
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
            {nextItem.title[currentLang]}
          </span>
        </button>
      ) : <div />}
    </div>
  );
};

