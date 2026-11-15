import { AnnotationSpec } from '../types/docs';

export const ANNOTATIONS_DATA: AnnotationSpec[] = [
  {
    name: '@AutoRestController',
    target: 'Interface (Controller)',
    purpose: {
      en: 'Primary declaration turning an empty interface into 38 production-grade RESTful endpoints with dynamic proxies.',
      vi: 'Khai báo cốt lõi biến một interface rỗng thành 38 endpoints RESTful chuẩn quốc tế bằng Dynamic Java Proxy.',
      ja: '空のインターフェースを実行可能な38種類の本番対応RESTfulエンドポイントへと変換する中核アノテーション。',
      zh: '框架核心入口注解，将空接口即刻转化为具备38个生产级RESTful端点的动态代理控制器。',
    },
    rationale: {
      en: 'Eliminates 90% of repetitive Controller, Service, and Repository boilerplate. Automatically wires OpenAPI, validation, caching, and Virtual Threads.',
      vi: 'Triệt tiêu 90% mã lặp lại của Controller, Service và Repository. Tự động tích hợp OpenAPI, kiểm tra hợp lệ, bộ đệm và luồng ảo.',
      ja: 'Controller/Service/Repositoryの90%の重複コードを排除。OpenAPI、バリデーション、キャッシュ、仮想スレッドを自動配線します。',
      zh: '彻底消除90%重复的控制器、服务与仓储层样板代码。自动装配OpenAPI文档、校验、缓存与虚拟线程。',
    },
    applicability: {
      en: 'Use for all CRUD-centric enterprise domain entities (Product, Order, User, Payment) needing consistent REST exposure.',
      vi: 'Dùng cho mọi thực thể nghiệp vụ (Sản phẩm, Đơn hàng, Người dùng, Thanh toán) cần cung cấp trọn bộ API chuẩn mực.',
      ja: '標準的なREST API公開が必要なすべてのドメインエンティティ（顧客、商品、注文など）で使用します。',
      zh: '适用于所有需要对外暴露完整RESTful API的核心业务实体（商品、订单、学生、用户、支付流水等）。',
    },
    usage: {
      en: 'Declare on an interface extending AutoApiController<E>. Optionally customize path, disabledEndpoints, enabledEndpoints, or enableNestedSubResources.',
      vi: 'Gắn trên interface kế thừa AutoApiController<E>. Có thể chỉ định path, disabledEndpoints hoặc enabledEndpoints tùy ý.',
      ja: 'AutoApiController<E> を継承したインターフェースに付与します。path や disabledEndpoints で柔軟に制御可能です。',
      zh: '直接标注在继承自 AutoApiController<E> 的接口上，可按需配置 path、disabledEndpoints 或 enabledEndpoints。',
    },
    syntaxSample: `@AutoRestController(
    path = "/api/v1/products",
    disabledEndpoints = {"deleteById", "DELETE"}
)
public interface ProductController extends AutoApiController<CommercialProduct> {
}`,
    explanation: {
      en: 'At application startup, Spring-NWVMC scans registered interfaces, mounts routes into Spring MVC RequestMappingHandlerMapping, and proxies calls into DynamicEntityCrudService.',
      vi: 'Khi ứng dụng khởi động, framework quét các interface, đăng ký tuyến đường vào Spring MVC Router và điều phối các lệnh gọi tới tầng dịch vụ lõi.',
      ja: '起動時にSpring MVCのマッピングテーブルへルートを動的に登録し、呼び出しをコアCRUDサービスへ転送します。',
      zh: '应用启动时动态注册路由至Spring MVC核心调度器，并将HTTP请求无缝代理至DynamicEntityCrudService。',
    },
  },
  {
    name: '@EntitySecurity',
    target: 'Class (Entity)',
    purpose: {
      en: 'Declarative NIST Level 2 Role-Based Access Control (RBAC) at entity table level.',
      vi: 'Kiểm soát truy cập dựa trên vai trò NIST Level 2 (RBAC) ở cấp độ bảng thực thể.',
      ja: 'エンティティテーブル単位の宣言的NISTレベル2ロールベースアクセス制御（RBAC）。',
      zh: '在实体表级别声明式定义NIST Level 2基于角色的权限访问控制（RBAC）。',
    },
    rationale: {
      en: 'Prevents unauthorized data leaks and prevents accidental privilege escalations without writing scattered @PreAuthorize statements.',
      vi: 'Ngăn chặn rò rỉ dữ liệu trái phép và chống leo thang đặc quyền mà không cần viết các chú thích @PreAuthorize rải rác.',
      ja: '各メソッドに @PreAuthorize を散乱させることなく、テーブル単位で厳格なアクセス制御を一元化し情報漏洩を防ぎます。',
      zh: '无需在各方法分散编写 @PreAuthorize，统一在实体入口处集中防范数据越权与提权漏洞。',
    },
    applicability: {
      en: 'Attach to sensitive business entities (PatientRecord, BankAccount, Payroll, SystemUser) requiring strict separation between read, write, and delete permissions.',
      vi: 'Áp dụng cho các thực thể dữ liệu nhạy cảm (Hồ sơ bệnh nhân, Tài khoản ngân hàng, Bảng lương) cần phân quyền riêng biệt giữa xem, sửa và xóa.',
      ja: '閲覧・更新・削除の権限分離が必要な機密エンティティ（医療カルテ、口座情報、給与明細など）に使用します。',
      zh: '适用于需要严格划分读、写、删权限的敏感业务实体（病历档案、银行账户、薪资表单、系统配置）。',
    },
    usage: {
      en: 'Place on the JPA Entity class, specifying readRoles, writeRoles, and deleteRoles string arrays from RoleConstant.',
      vi: 'Đặt trên lớp JPA Entity, truyền các mảng vai trò readRoles, writeRoles, deleteRoles trích xuất từ RoleConstant.',
      ja: 'JPAエンティティクラスに付与し、RoleConstantから参照したロール配列を指定します。',
      zh: '放置在JPA实体类上方，通过RoleConstant常量注入readRoles、writeRoles与deleteRoles角色数组。',
    },
    syntaxSample: `@EntitySecurity(
    readRoles = {RoleConstant.ROLE_USER, RoleConstant.ROLE_ADMIN},
    writeRoles = {RoleConstant.ROLE_ADMIN},
    deleteRoles = {RoleConstant.ROLE_SUPER_ADMIN}
)
public class PatientRecord extends BaseAuditEntity { ... }`,
    explanation: {
      en: 'Evaluated automatically by EntitySecurityEvaluatorHelper and RowLevelSecurityFilterHelper before any query or mutation is executed. Unmatched roles receive HTTP 403 Forbidden.',
      vi: 'Được đánh giá tự động trước khi thực thi truy vấn hoặc ghi. Người dùng không đủ quyền nhận ngay HTTP 403 Forbidden.',
      ja: 'クエリまたは更新実行前に自動評価されます。権限のないユーザーには即座にHTTP 403 Forbiddenが返されます。',
      zh: '在任何查询或写入前自动校验。当前上下文未包含指定权限时直接返回HTTP 403 Forbidden。',
    },
  },
  {
    name: '@StateMachine',
    target: 'Field (Entity Status)',
    purpose: {
      en: 'Embeds a strict finite state machine graph with legal transition paths and non-deletable safeguards.',
      vi: 'Nhúng đồ thị máy trạng thái hữu hạn với các bước chuyển hợp lệ và chốt bảo vệ không thể xóa.',
      ja: '適法な状態遷移パスと削除禁止ガードを備えた厳格な有限ステートマシンを定義。',
      zh: '内嵌严格的有限状态机有向图，定义合法跃迁路径与禁止删除状态节点守卫。',
    },
    rationale: {
      en: 'Eliminates corrupted business states and illegal lifecycle jumps (e.g. jumping directly from DRAFT to DELIVERED) with zero custom validation code.',
      vi: 'Loại bỏ hoàn toàn tình trạng nhảy cóc trạng thái phi lý (ví dụ: từ BẢN NHÁP nhảy thẳng sang ĐÃ GIAO HÀNG) mà không cần code logic phức tạp.',
      ja: '不正な状態遷移（例：下書きからいきなり配達完了へスキップ）や進行中タスクの誤削除をゼロコードで確実に遮断します。',
      zh: '彻底杜绝业务流程状态跳跃与非法变更（如草稿直接变成已收货），且无需手写繁杂的条件判断。',
    },
    applicability: {
      en: 'Use on any status string field representing business progression: Order status, Payment state, Invoice lifecycle, Ticket workflow.',
      vi: 'Dùng trên trường trạng thái thể hiện quy trình tiến triển: Trạng thái đơn hàng, Tiến độ thanh toán, Hóa đơn, Quy trình duyệt vé.',
      ja: '注文ステータス、決済フロー、請求書処理状況など、段階的に進む業務状態フィールドに付与します。',
      zh: '适用于表达状态变迁的字段：订单履约状态、支付交易流转、工单流转、合同生命周期。',
    },
    usage: {
      en: 'Annotate the status field with initial state, valid transition rules in "FROM:TO1,TO2" syntax, and deletableStates.',
      vi: 'Đánh dấu trường trạng thái với initial, chuỗi luật chuyển "FROM:TO1,TO2" và danh sách deletableStates được phép xóa.',
      ja: '状態フィールドに付与し、初期状態、"FROM:TO1,TO2" 形式の遷移ルール、削除許可状態を設定します。',
      zh: '标注在状态字段上，声明 initial 初始态、"FROM:TO1,TO2" 格式的跃迁路径以及允许执行软删除的 deletableStates。',
    },
    syntaxSample: `@StateMachine(
    initial = "REQUESTED",
    transitions = {
        "REQUESTED:CONFIRMED,CANCELLED",
        "CONFIRMED:CHECKED_IN,CANCELLED",
        "CHECKED_IN:IN_CONSULTATION",
        "IN_CONSULTATION:COMPLETED"
    },
    deletableStates = {"REQUESTED", "CANCELLED"}
)
@Column(name = "appointment_status")
private String appointmentStatus;`,
    explanation: {
      en: 'Protects critical lifecycle operations. Attempting illegal transition jumps or soft-deleting an active consultation returns HTTP 422.',
      vi: 'Bảo vệ vòng đời nghiệp vụ. Cố tình nhảy cóc trạng thái hoặc xóa bản ghi đang hoạt động bị chặn với HTTP 422.',
      ja: '状態の不正スキップや、診察中・完了済みの不正削除をHTTP 422で完全に遮断します。',
      zh: '保障核心业务流程闭环。企图跨越中间节点跃迁或删除进行中业务将被HTTP 422拒绝。',
    },
  },
  {
    name: '@PublishCloudEvent',
    target: 'Class or Interface',
    purpose: {
      en: 'Publishes standard CNCF CloudEvents 1.0 JSON payloads to Spring Event Publisher on entity mutations.',
      vi: 'Tự động phát tán sự kiện chuẩn quốc tế CNCF CloudEvents 1.0 khi có thao tác tạo, sửa, xóa, chuyển trạng thái.',
      ja: 'エンティティ作成・更新・削除・状態遷移時に、CNCF CloudEvents 1.0 準拠のイベントを発行。',
      zh: '在实体发生新建、修改、删除或状态流转时，自动向Spring事件总线发布CNCF CloudEvents 1.0标准化事件。',
    },
    rationale: {
      en: 'Empowers event-driven microservice integration across Kafka, RabbitMQ, Webhooks, or Redis Pub/Sub with standardized W3C traceparents.',
      vi: 'Hỗ trợ kiến trúc Event-Driven Microservices liên thông qua Kafka, RabbitMQ, Webhooks với W3C traceparent đồng nhất.',
      ja: 'W3C分散トレースを含む標準仕様により、KafkaやRabbitMQ、Webhook等のマイクロサービス間連携を即座に実現。',
      zh: '基于业界统一标准无缝连接Kafka、RabbitMQ、Pulsar或Webhook，自带W3C链路追踪上下文。',
    },
    applicability: {
      en: 'Whenever downstream systems, external partners, or analytics workers need notification of entity state changes.',
      vi: 'Khi các hệ thống hạ nguồn, đối tác bên thứ ba hoặc công nhân phân tích dữ liệu cần nhận thông báo khi thực thể thay đổi.',
      ja: '下流システム、外部パートナー、または分析ワーカーがデータ変更を即座に検知する必要がある場合に使用。',
      zh: '当需要通知下游子系统、外部合作商户或大数据分析处理节点时使用。',
    },
    usage: {
      en: 'Add to the Entity class or Controller interface. Specify eventType, source URI, and toggles for create, update, and delete.',
      vi: 'Gắn vào lớp Entity hoặc Controller Interface. Khai báo eventType, source và các cờ bật/tắt theo từng hành động.',
      ja: 'EntityまたはControllerに付与し、eventType、source URI、各CRUD操作での発行可否を設定します。',
      zh: '标注在Entity类或Controller接口上，指定eventType、source URI以及各CRUD操作是否启用的开关。',
    },
    syntaxSample: `@PublishCloudEvent(
    eventType = "com.enterprise.order.lifecycle",
    source = "/api/v1/orders",
    publishOnCreate = true,
    publishOnUpdate = true,
    publishOnDelete = false
)
public class CommercialOrder extends BaseAuditEntity { ... }`,
    explanation: {
      en: 'Post-commit, CloudEventPublisherHelper wraps the entity into CloudEventEnvelopeDto<T> and publishes via ApplicationEventPublisher.',
      vi: 'Sau khi commit database thành công, helper đóng gói thực thể vào CloudEventEnvelopeDto<T> và phát tán qua ApplicationEventPublisher.',
      ja: 'トランザクションコミット後、CloudEventPublisherHelperが標準エンベロープに包んでイベントを発行します。',
      zh: '事务成功提交后，系统自动组装 CloudEventEnvelopeDto<T> 并通过 ApplicationEventPublisher 广播分发。',
    },
  },
  {
    name: '@RateLimit',
    target: 'Interface or Method (API Controller)',
    purpose: {
      en: 'Sub-microsecond sliding-window token bucket rate limiter with HTTP 429 quota enforcement.',
      vi: 'Bộ giới hạn lưu lượng theo cửa sổ trượt độ trễ dưới micro giây với phản hồi lỗi HTTP 429.',
      ja: 'サブマイクロ秒の低遅延スライディングウィンドウ型レートリミッター（HTTP 429保護）。',
      zh: '基于滑动窗口的亚微秒级限流令牌桶，精确施行HTTP 429配额熔断。',
    },
    rationale: {
      en: 'Protects backend databases from DDoS floods, crawler abuse, and brute-force spikes with ultra-low memory overhead.',
      vi: 'Bảo vệ cơ sở dữ liệu khỏi tấn công từ chối dịch vụ (DDoS), cào quét dữ liệu và tăng vọt lưu lượng với chi phí RAM cực thấp.',
      ja: 'DDoS攻撃、悪質なスクレイピング、過負荷スパイクからバックエンドDBを極小のメモリ使用量で防護します。',
      zh: '以极低内存开销防范DDoS恶意洪峰、爬虫滥刷与高频暴力破解，确保系统吞吐稳定。',
    },
    applicability: {
      en: 'Apply to public APIs, authentication routes, SMS dispatch, checkout payment triggers, or high-cost export endpoints.',
      vi: 'Áp dụng cho các API công khai, endpoint đăng nhập, gửi SMS OTP, thanh toán đặt hàng hoặc xuất file báo cáo nặng.',
      ja: '公開API、ログイン認証、SMS送信、決済実行、高負荷なレポート出力エンドポイント等に適用します。',
      zh: '适用于公网开放端点、短信验证码下发、结账支付、登录认证或大容量CSV报表导出。',
    },
    usage: {
      en: 'Annotate controller interface or method. Configure requests limit, windowSeconds duration, and partitionKey ("clientIp" or "tenant").',
      vi: 'Đánh dấu trên interface hoặc method. Cấu hình số lượng requests, windowSeconds và partitionKey ("clientIp" hoặc "tenant").',
      ja: 'Controllerインターフェースまたはメソッドに付与し、許容リクエスト数、ウィンドウ秒数、partitionKey を指定します。',
      zh: '标注在Controller接口或独立方法上，配置允许请求上限、时间窗口秒数以及分区键（"clientIp" 或 "tenant"）。',
    },
    syntaxSample: `@RateLimit(requests = 60, windowSeconds = 60, partitionKey = "IP")
public interface OrderController extends AutoApiController<CommercialOrder> {

    @RateLimit(requests = 5, windowSeconds = 10, partitionKey = "IP")
    ApiResponse<CommercialOrder> checkoutCart(CartRequestDto request);
}`,
    explanation: {
      en: 'Enforces request quotas per client IP or tenant key using thread-safe atomic counters. Automatically emits X-RateLimit-Remaining and X-RateLimit-Reset headers.',
      vi: 'Kiểm soát hạn mức yêu cầu theo IP máy khách hoặc Tenant bằng bộ đếm atomic an toàn luồng. Tự động trả về header X-RateLimit-Remaining và X-RateLimit-Reset.',
      ja: 'アトミックカウンターを用いてクライアントIPやテナントごとのアクセス枠を厳格管理し、X-RateLimit-Remainingヘッダーを返却します。',
      zh: '通过原子计数器基于客户端IP或租户隔离请求频次，超额直接抛出HTTP 429并注入X-RateLimit-Remaining响应头。',
    },
  },
  {
    name: '@EntityCircuitBreaker',
    target: 'Interface or Method (API Controller)',
    purpose: {
      en: 'Declarative Resilience4j Circuit Breaker guarding downstream services with HTTP 503 fast-failover.',
      vi: 'Ngắt mạch phòng vệ Resilience4j bảo vệ dịch vụ hạ tầng với cơ chế ngắt sớm HTTP 503.',
      ja: 'Resilience4jベースの宣言的サーキットブレーカー（HTTP 503高速フェイルオーバー）。',
      zh: '声明式Resilience4j断路器熔断降级，防止下游级联故障并以HTTP 503快速失败。',
    },
    rationale: {
      en: 'Prevents catastrophic cascading failures across microservices when a third-party gateway, database, or partner service degrades.',
      vi: 'Ngăn ngừa lỗi liên đới làm sập toàn bộ cụm dịch vụ khi cổng thanh toán, cơ sở dữ liệu đối tác hoặc mạng bên ngoài gặp sự cố.',
      ja: '外部ゲートウェイやパートナーAPIの遅延・障害時に、システム全体の連鎖障害（雪崩現象）を遮断します。',
      zh: '当代付通道、外部合作方或下游数据库发生延迟或宕机时，及时阻断请求以避免整个集群雪崩。',
    },
    applicability: {
      en: 'Use on high-risk integrations: Credit card charge, SMS gateway, logistics tracking, external inventory sync.',
      vi: 'Dùng cho các chức năng có rủi ro cao: Quẹt thẻ thanh toán, SMS Gateway, tra cứu đơn vị vận chuyển, đồng bộ kho đối tác.',
      ja: 'クレジットカード決済、SMS配信、配送状況照会など、外部依存度の高い高リスクな通信箇所で使用します。',
      zh: '适用于高风险外部交互点：银行扣款、短信通道、物流轨迹同步、外部ERP库存联动。',
    },
    usage: {
      en: 'Declare on controller interface. Set circuit breaker name, failureRateThreshold, waitDurationInOpenStateSeconds, and slidingWindowSize.',
      vi: 'Khai báo trên controller interface. Thiết lập tên circuit, failureRateThreshold, waitDurationInOpenStateSeconds và slidingWindowSize.',
      ja: 'Controllerに付与し、サーキット名、失敗率閾値、オープン待機秒数、評価ウィンドウサイズを設定します。',
      zh: '在Controller接口声明，配置熔断器名称、失败率阈值百分比、熔断静止冷却秒数以及评估窗口滑块大小。',
    },
    syntaxSample: `@EntityCircuitBreaker(
    name = "PaymentGatewayCircuit",
    failureRateThreshold = 50.0f,
    waitDurationInOpenStateSeconds = 10,
    slidingWindowSize = 20,
    permittedNumberOfCallsInHalfOpenState = 5
)
public interface IPaymentTransactionController extends AutoApiController<PaymentTransaction> { ... }`,
    explanation: {
      en: 'Monitors downstream call error rates. Once failures exceed the threshold, transitions to OPEN to reject upstream traffic immediately with CircuitBreakerOpenException (HTTP 503), preventing cascading system overload.',
      vi: 'Theo dõi tỷ lệ lỗi cuộc gọi. Khi vượt ngưỡng, chuyển sang trạng thái OPEN để chặn ngay lưu lượng với HTTP 503, triệt tiêu nguy cơ sập toàn hệ thống.',
      ja: '下流エラー率を自動追跡し、閾値超過時に即座にOPENへ遷移してHTTP 503でリクエストを遮断し連鎖的障害を防止します。',
      zh: '监控请求异常率，当失败率越过阈值时立即置为OPEN状态并以HTTP 503拦截调用，防止整个微服务拓扑雪崩。',
    },
  },
  {
    name: '@HttpCacheable',
    target: 'Interface or Method (API Controller)',
    purpose: {
      en: 'Automated RFC 7232 Weak ETag computation and conditional HTTP 304 Not Modified optimization.',
      vi: 'Tự động tính toán mã băm ETag RFC 7232 và tối ưu hóa phản hồi có điều kiện HTTP 304 Not Modified.',
      ja: 'RFC 7232 準拠の弱ETag自動生成と条件付きHTTP 304 Not Modified最適化。',
      zh: '自动化RFC 7232弱ETag哈希计算与HTTP 304条件请求网络带宽极致优化。',
    },
    rationale: {
      en: 'Saves 95% of bandwidth on read-heavy mobile and web clients by returning a 0-byte HTTP 304 body when data is unchanged.',
      vi: 'Tiết kiệm 95% băng thông mạng cho ứng dụng di động và trình duyệt bằng cách trả về thân rỗng 0-byte HTTP 304 khi dữ liệu không đổi.',
      ja: 'データ未変更時に0バイトのHTTP 304を返却することで、モバイルやWebのネットワーク帯域を最大95%節約します。',
      zh: '当服务端内容未发生改动时返回0字节的HTTP 304响应体，为移动App与Web前端节省95%以上的通信带宽。',
    },
    applicability: {
      en: 'Ideal for product catalogs, blog posts, static taxonomies, lookup tables, and rarely modified master data.',
      vi: 'Lý tưởng cho danh mục sản phẩm, bài viết blog, bảng danh mục dùng chung, dữ liệu master ít biến động.',
      ja: '商品カタログ、記事一覧、カテゴリマスタなど、読み取り頻度が高く更新頻度が低いデータに最適です。',
      zh: '极度推荐用于商品品类树、内容资讯列表、通用字典表以及读多写少的全网配置数据。',
    },
    usage: {
      en: 'Add to controller interface or read method. Specify maxAgeSeconds, isPrivate, mustRevalidate, and generateETag.',
      vi: 'Gắn trên controller interface hoặc method đọc. Khai báo maxAgeSeconds, isPrivate, mustRevalidate và generateETag.',
      ja: 'ControllerまたはGETメソッドに付与し、maxAgeSeconds、isPrivate、generateETag等を設定します。',
      zh: '标注在Controller或具体GET方法上，设定缓存有效秒数、isPrivate、mustRevalidate以及是否开启ETag。',
    },
    syntaxSample: `@HttpCacheable(maxAgeSeconds = 120, isPrivate = false, mustRevalidate = true, generateETag = true)
public interface IProductCatalogController extends AutoApiController<ProductCatalog> {

    @HttpCacheable(maxAgeSeconds = 300, isPrivate = true)
    @GetMapping("/featured")
    ResponseEntity<ApiResponse<List<ProductCatalog>>> getFeaturedProducts();
}`,
    explanation: {
      en: 'Computes SHA-256 ETag from response payload. When If-None-Match header matches, returns HTTP 304 immediately without body serialization.',
      vi: 'Tính mã băm SHA-256 từ nội dung trả về. Khi tiêu đề If-None-Match trùng khớp, lập tức trả về HTTP 304 không cần serialize thân JSON.',
      ja: 'レスポンスからSHA-256ハッシュを計算。クライアントのIf-None-Matchと一致した場合、即座にHTTP 304を返却します。',
      zh: '计算响应体的SHA-256摘要，若与客户端传入的If-None-Match一致，则直接返回HTTP 304且跳过数据序列化。',
    },
  },
  {
    name: '@FieldSecurity',
    target: 'Field (Entity Attribute)',
    purpose: {
      en: 'Declarative attribute-level data masking and PII protection.',
      vi: 'Che mờ dữ liệu thuộc tính nhạy cảm và bảo vệ thông tin nhận dạng cá nhân (PII).',
      ja: 'フィールドレベルの宣言的データマスキングと個人情報（PII）保護。',
      zh: '声明式字段级数据脱敏与个人隐私信息（PII）自动化屏蔽。',
    },
    rationale: {
      en: 'Ensures compliance with GDPR, HIPAA, and national privacy regulations automatically at serialization time.',
      vi: 'Đảm bảo tuân thủ các quy định bảo vệ dữ liệu cá nhân (GDPR, HIPAA, Nghị định 13) một cách tự động khi xuất dữ liệu.',
      ja: 'GDPRや個人情報保護法に準拠し、未認可ユーザーに対する機密情報の自動不可逆マスキングを保証します。',
      zh: '从数据出口处自动贯彻GDPR与个人信息保护合规规范，对非特权请求者执行不可逆脱敏。',
    },
    applicability: {
      en: 'Use on phone numbers, national IDs, email addresses, credit card numbers, and salary amounts.',
      vi: 'Dùng cho số điện thoại, căn cước công dân, số thẻ ngân hàng, tiền lương và địa chỉ email.',
      ja: '電話番号、マイナンバー、クレジットカード番号、給与額などの機密フィールドに使用します。',
      zh: '适用于手机号、身份证号、银行卡号、邮箱及员工薪资字段。',
    },
    usage: {
      en: 'Annotate field with viewRoles, maskPattern (default "******"), and nullifyInsteadOfMask (boolean).',
      vi: 'Đánh dấu trường với viewRoles, maskPattern (mặc định "******") và nullifyInsteadOfMask (boolean).',
      ja: 'フィールドに viewRoles、maskPattern（既定 "******"）、nullifyInsteadOfMask を指定します。',
      zh: '在字段上指定有权查看明文的 viewRoles、掩码格式 maskPattern（默认 "******"）及是否置空 nullifyInsteadOfMask。',
    },
    syntaxSample: `@FieldSecurity(
    viewRoles = {RoleConstant.ROLE_ADMIN, RoleConstant.ROLE_SUPER_ADMIN},
    maskPattern = "******",
    nullifyInsteadOfMask = false
)
@Column(name = "national_identity_number")
private String nationalIdentityNumber;`,
    explanation: {
      en: 'Masks values dynamically during serialization (e.g. "***-**-1234") unless the caller has privileged administrator roles.',
      vi: 'Tự động che mờ dữ liệu (ví dụ: "***-**-1234") khi phản hồi HTTP nếu người gọi không có quyền quản trị viên.',
      ja: '一般ユーザー向けレスポンス時に自動でマスク化（例："***"）され、特権管理者のみ平文で閲覧できます。',
      zh: 'HTTP序列化输出时动态掩码脱敏，普通用户只能看到脱敏文本，仅管理员可见原始数据。',
    },
  },
  {
    name: '@UniqueField',
    target: 'Field (Business Identifier)',
    purpose: {
      en: 'Zero-latency pre-persistence uniqueness validation with HTTP 409 Conflict mapping.',
      vi: 'Kiểm tra tính duy nhất của trường nghiệp vụ trước khi lưu DB với mã lỗi HTTP 409 Conflict.',
      ja: 'DBエラー前の高速事前ユニーク検証とHTTP 409エラーマッピング。',
      zh: '在入库前执行亚毫秒级唯一性校验，优雅转译为HTTP 409 Conflict。',
    },
    rationale: {
      en: 'Prevents cryptic SQL constraint crashes and returns clean, human-readable localized error messages to clients.',
      vi: 'Ngăn chặn sập lỗi SQL constraint khó hiểu, trả về thông điệp lỗi đa ngôn ngữ rõ ràng cho người dùng.',
      ja: '難解なSQL例外の発生を防ぎ、クライアントに親切な多言語エラーメッセージを返却します。',
      zh: '告别底层生硬的SQLIntegrityConstraintViolationException，统一封装为标准多语言错误响应。',
    },
    applicability: {
      en: 'Use on business codes, usernames, employee IDs, SKU identifiers, and tax registration numbers.',
      vi: 'Dùng cho mã sản phẩm (SKU), tên đăng nhập, mã nhân viên, mã số thuế doanh nghiệp.',
      ja: 'SKUコード、ユーザー名、社員番号、納税者番号など、重複が許されない業務キーに付与します。',
      zh: '适用于业务流水号、用户名、商品SKU码、企业统一社会信用代码等唯一标识。',
    },
    usage: {
      en: 'Simply annotate the target field alongside standard JPA @Column(unique = true).',
      vi: 'Chỉ cần gắn trên trường dữ liệu mục tiêu cùng với chú thích JPA @Column(unique = true).',
      ja: 'JPAの @Column(unique = true) と合わせてフィールドに付与するだけです。',
      zh: '直接标注在目标实体属性上，可与JPA的 @Column(unique = true) 搭配生效。',
    },
    syntaxSample: `@UniqueField
@Column(name = "stock_sku_code", unique = true)
private String stockSkuCode;`,
    explanation: {
      en: 'Eliminates cryptic database SQL constraint exceptions, converting collisions into localized ApiResponse error messages.',
      vi: 'Loại bỏ ngoại lệ SQL thô của database, chuẩn hóa lỗi trùng lặp thành thông điệp đa ngôn ngữ đẹp mắt.',
      ja: '生のSQL例外を握り潰し、標準化された多言語対応ApiResponseエラーメッセージに整形します。',
      zh: '告别底层生硬的SQLIntegrityConstraintViolationException，统一封装为标准多语言错误响应。',
    },
  },
  {
    name: '@Idempotent',
    target: 'Method (API Endpoint)',
    purpose: {
      en: 'Prevents duplicated submissions using distributed idempotency keys.',
      vi: 'Phòng chống gửi trùng lặp yêu cầu thông qua khóa định danh lũy thừa X-Idempotency-Key.',
      ja: 'X-Idempotency-Keyによる重複リクエスト遮断と冪等性保証。',
      zh: '基于X-Idempotency-Key分布式去重，保障写操作的绝对幂等性。',
    },
    rationale: {
      en: 'Eliminates double charges, duplicated orders, and twin account deductions caused by user double-clicks or network retries.',
      vi: 'Triệt tiêu hoàn toàn rủi ro trừ tiền 2 lần, tạo 2 đơn hàng trùng nhau do người dùng bấm đúp hoặc mạng retry.',
      ja: '連打やネットワークの再送による二重決済、二重注文、過剰在庫引き当てを確実に防ぎます。',
      zh: '彻底解决用户连续快速点击或网络超时重试引发的重复扣款、重复落单与库存多扣。',
    },
    applicability: {
      en: 'Crucial for financial checkouts, fund transfers, wallet top-ups, and mutative order operations.',
      vi: 'Bắt buộc áp dụng cho thanh toán giỏ hàng, chuyển khoản, nạp tiền ví điện tử và tạo đơn hàng.',
      ja: '決済処理、送金、ウォレット残高チャージ、在庫確定など、金銭や重要資産が関わる操作に必須です。',
      zh: '支付结账、资金转账、钱包充值、订单落单等涉及金钱变动的核心交易接口必配。',
    },
    usage: {
      en: 'Annotate controller method. Specify headerName ("X-Idempotency-Key") and record validity ttlSeconds.',
      vi: 'Gắn trên phương thức controller. Chỉ định headerName ("X-Idempotency-Key") và thời gian tồn tại ttlSeconds.',
      ja: 'Controllerメソッドに付与し、ヘッダー名とTTL（秒数）を指定します。',
      zh: '标注在Controller端点方法上，指定请求头键名与幂等记录保持有效的TTL秒数。',
    },
    syntaxSample: `@Idempotent(headerName = "X-Idempotency-Key", ttlSeconds = 300)
public ECommerceOrder checkoutCart(CartCheckoutRequestDto request) { ... }`,
    explanation: {
      en: 'Concurrent requests with the same key receive HTTP 409 Conflict. Identical subsequent requests return cached order safely.',
      vi: 'Các request cùng khóa đang bay nhận lỗi 409 Conflict. Request gửi lại sau khi xong nhận kết quả đã xử lý an toàn.',
      ja: '同一キーの同時処理中は409 Conflictを返し、完了後は安全に同一の確定注文結果を返します。',
      zh: '正在执行的相同请求将被409 Conflict阻断；执行完毕后重放则直接返回前次落单结果。',
    },
  },
];
