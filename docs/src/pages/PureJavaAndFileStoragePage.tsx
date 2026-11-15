import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  guardTitle: {
    vi: 'Kiểm Định Java 21+ Nghiêm Ngặt & Độc Lập Phiên Bản Spring',
    en: 'Strict Java 21+ Guard & Runtime Spring Bridge',
    ja: '厳格な Java 21+ ガードと実行時 Spring ブリッジ',
    zh: '严格 Java 21+ 校验与运行时 Spring 解耦桥接',
  },
  guardBody: {
    vi: 'Khi khởi động, JavaVersionGuardUtil.enforceJava21OrHigher() kiểm tra phiên bản JVM qua Runtime.version().feature(). Nếu JVM thấp hơn Java 21, framework lập tức từ chối khởi tạo để bảo vệ Virtual Threads và RFC 9562 UUIDv7.',
    en: 'At bootstrap, JavaVersionGuardUtil.enforceJava21OrHigher() inspects Runtime.version().feature() and rejects any runtime below Java 21 to guarantee Virtual Threads and RFC 9562 UUIDv7 support.',
    ja: '起動時に JavaVersionGuardUtil.enforceJava21OrHigher() が Runtime.version().feature() を検査し、Java 21 未満の JVM を即座に遮断します。',
    zh: '启动阶段 JavaVersionGuardUtil.enforceJava21OrHigher() 检查 Runtime.version().feature()，若低于 JDK 21 则立即拦截中止，保障虚拟线程与 RFC 9562 UUIDv7。',
  },
  s1Heading: {
    vi: '1. Chú Thích Pure Java Thay Thế Spring Stereotypes (PureJavaBeanRegistrarBridge)',
    en: '1. Pure Java Stereotype Annotations (PureJavaBeanRegistrarBridge)',
    ja: '1. Pure Java ステレオタイプアノテーション（PureJavaBeanRegistrarBridge）',
    zh: '1. 纯 Java 立体型注解与注册桥接（PureJavaBeanRegistrarBridge）',
  },
  s1Lead: {
    vi: 'Các thành phần nội bộ được đánh dấu bằng annotation Pure Java (0 import org.springframework.*) và được PureJavaBeanRegistrarBridge quét qua PureJavaClasspathScannerUtil để đăng ký vào host BeanFactory tại thời điểm khởi động (đổi lại: tăng thời gian phản xạ lúc boot và yêu cầu interface cho Proxy):',
    en: 'Internal components carry Pure Java annotations (zero import org.springframework.*) discovered via PureJavaClasspathScannerUtil and bound into the host BeanFactory by PureJavaBeanRegistrarBridge at boot (trade-off: startup reflection scanning in exchange for compile-time Spring version decoupling):',
    ja: 'コアコンポーネントは Pure Java アノテーションを付与し、PureJavaClasspathScannerUtil と PureJavaBeanRegistrarBridge により起動時にホストの BeanFactory へ登録されます（コンパイル時の Spring 依存を完全に排除）。',
    zh: '核心组件使用纯 Java 注解标记（零 import org.springframework.*），启动时经由 PureJavaClasspathScannerUtil 与 PureJavaBeanRegistrarBridge 反射注册至宿主 BeanFactory，彻底解耦 Spring 编译期版本锁定。',
  },
  colAnn: { vi: 'Pure Java Annotation', en: 'Pure Java Annotation', ja: 'Pure Java アノテーション', zh: '纯 Java 注解' },
  colRole: { vi: 'Vai Trò Kiến Trúc', en: 'Architectural Role', ja: 'アーキテクチャ役割', zh: '架构职责' },
  colBridge: { vi: 'Cơ Chế Đăng Ký Runtime', en: 'Runtime Registration Bridge', ja: '実行時登録機構', zh: '运行时注册机制' },
  rAutoComp: {
    vi: 'Đánh dấu các lớp Helper, Provider, Listener, Filter (*Helper, *Bridge, *Filter)',
    en: 'Marks Helper, Provider, Listener, and Filter classes',
    ja: 'Helper / Provider / Listener / Filter クラスを宣言',
    zh: '标识 Helper、Provider、Listener 与 Filter 组件类',
  },
  rAutoSvc: {
    vi: 'Đánh dấu các lớp Service Implementation (*ServiceImpl)',
    en: 'Marks Service Implementation classes (*ServiceImpl)',
    ja: 'Service 実装クラス（*ServiceImpl）を宣言',
    zh: '标识 Service 实现类（*ServiceImpl）',
  },
  rAutoCfg: {
    vi: 'Đánh dấu lớp cấu hình tập trung (*Config) thay @Configuration',
    en: 'Marks centralized configuration classes (*Config)',
    ja: '集中構成クラス（*Config）を宣言',
    zh: '标识集中配置类（*Config），替代 @Configuration',
  },
  rAutoBean: {
    vi: 'Đánh dấu phương thức khởi tạo Bean trong *Config (tùy chọn primary = true)',
    en: 'Marks factory methods inside *Config classes (supports primary = true)',
    ja: '*Config 内の Bean 生成ファクトリメソッドを宣言',
    zh: '标识 *Config 中的 Bean 工厂方法（支持 primary = true）',
  },
  l1Heading: {
    vi: '2. Bộ Đệm L1 Phản Xạ & MethodHandle (ReflectionMetadataCacheUtil)',
    en: '2. L1 Reflection & MethodHandle Caches (ReflectionMetadataCacheUtil)',
    ja: '2. L1 リフレクション＆MethodHandleキャッシュ（ReflectionMetadataCacheUtil）',
    zh: '2. L1 反射元数据与 MethodHandle 缓存体系（ReflectionMetadataCacheUtil）',
  },
  l1Lead: {
    vi: 'ReflectionMetadataCacheUtil và ReflectionCacheConstant loại bỏ chi phí Method.invoke() lặp lại trên hot-path bằng 13 ConcurrentHashMap phân giới hạn kích thước kèm Lambda / MethodHandles.Lookup:',
    en: 'ReflectionMetadataCacheUtil and ReflectionCacheConstant eliminate repeated reflection lookup overhead on hot paths using 13 bounded ConcurrentHashMap caches and JVM MethodHandle bindings:',
    ja: 'ReflectionMetadataCacheUtil は ReflectionCacheConstant に定義された13個のサイズ制限付き ConcurrentHashMap と MethodHandle キャッシュでホットパスのリフレクション負荷を排除します：',
    zh: 'ReflectionMetadataCacheUtil 借助 ReflectionCacheConstant 中的 13 个有界 ConcurrentHashMap 缓存与 MethodHandle 句柄绑定，消除运行时热路径的重复反射扫描开销：',
  },
  s2Heading: {
    vi: '3. Cấu Hình Lưu Trữ Tệp Đa Đám Mây (app.framework.storage.*)',
    en: '3. Multi-Provider File Storage Configuration (app.framework.storage.*)',
    ja: '3. マルチクラウドファイルストレージ設定（app.framework.storage.*）',
    zh: '3. 多云文件存储子系统配置（app.framework.storage.*）',
  },
  s2Lead: {
    vi: 'FileStorageProperties tự động nạp cấu hình tiền tố app.framework.storage.*, điều phối qua StorageProviderResolverHelper (LOCAL, S3 với AWS SigV4, GCS), và khử đường dẫn CWE-22 qua StoragePathSanitizerHelper:',
    en: 'FileStorageProperties binds app.framework.storage.* settings across StorageProviderResolverHelper (LOCAL, S3 SigV4, GCS) while StoragePathSanitizerHelper enforces CWE-22 path sanitization:',
    ja: 'FileStorageProperties は app.framework.storage.* 設定を StorageProviderResolverHelper（LOCAL / S3 SigV4 / GCS）へバインドし、StoragePathSanitizerHelper が CWE-22 パストラバーサルを防御します：',
    zh: 'FileStorageProperties 绑定 app.framework.storage.* 配置并由 StorageProviderResolverHelper 在 LOCAL、S3 SigV4 与 GCS 间切换，同时由 StoragePathSanitizerHelper 阻断 CWE-22 路径穿越：',
  },
  s3Heading: {
    vi: '4. 6 RESTful Endpoints Lưu Trữ Tệp (FileStorageController — /api/v1/storage)',
    en: '4. 6 Built-In File Storage REST Endpoints (FileStorageController — /api/v1/storage)',
    ja: '4. 6つの組み込みファイルストレージAPI（FileStorageController — /api/v1/storage）',
    zh: '4. 6 个内置文件存储 REST 端点（FileStorageController — /api/v1/storage）',
  },
  colDesc: { vi: 'Mô Tả Chức Năng', en: 'Operation Description', ja: '機能説明', zh: '功能描述' },
  epUpload: {
    vi: 'Tải lên tệp multipart kèm kiểm tra phần mở rộng, giới hạn kích thước, chống CWE-22 path traversal và checksum SHA-256.',
    en: 'Uploads multipart file with extension allowlist check, size guard, CWE-22 path sanitization, and SHA-256 checksum.',
    ja: '拡張子ホワイトリスト、サイズ制限、CWE-22対策、SHA-256チェックサム付きでマルチパートファイルをアップロードします。',
    zh: '上传 multipart 文件，内置扩展名白名单校验、文件大小守卫、CWE-22 路径净化及 SHA-256 校验和。',
  },
  epDownload: {
    vi: 'Tải xuống tệp nhị phân kèm Content-Disposition, MIME Content-Type và ETag.',
    en: 'Streams stored binary file with Content-Disposition, MIME Content-Type, and ETag headers.',
    ja: 'Content-Disposition、MIME Content-Type、ETagヘッダー付きでバイナリファイルをストリーミング配信します。',
    zh: '流式下载二进制文件，自动注入 Content-Disposition、MIME Content-Type 与 ETag 响应头。',
  },
  epMeta: {
    vi: 'Truy vấn siêu dữ liệu tệp (kích thước, MIME, đường dẫn, lastModified) không cần tải nội dung.',
    en: 'Retrieves file metadata (size, MIME type, storage path, lastModified) without downloading bytes.',
    ja: '本体をダウンロードせずファイルメタデータ（サイズ、MIME、パス、更新日時）を取得します。',
    zh: '仅检索文件元数据（字节数、MIME 类型、存储路径、最后修改时间），无需传输文件本体。',
  },
  epExists: {
    vi: 'Kiểm tra trạng thái tồn tại của fileIdentifier trên nhà cung cấp lưu trữ hiện hành.',
    en: 'Checks whether a fileIdentifier exists in the active storage provider.',
    ja: '現在のストレージバックエンド上に fileIdentifier が存在するかを高速確認します。',
    zh: '快速检査指定 fileIdentifier 在当前激活的存储后端中是否存在。',
  },
  epPresigned: {
    vi: 'Sinh Presigned URL có TTL phục vụ tải lên hoặc tải xuống trực tiếp.',
    en: 'Generates a temporary TTL-bounded Presigned URL for direct client GET/PUT access.',
    ja: 'クライアント直接アクセス用の期限付き（TTL）Presigned URLを発行します。',
    zh: '生成受 TTL 时效限制的临时预签名 Presigned URL，支持客户端直传或直连下载。',
  },
  epDelete: {
    vi: 'Xóa tệp khỏi kho lưu trữ hiện hành và trả về trạng thái xác nhận.',
    en: 'Permanently deletes the file from the active storage backend.',
    ja: '現在のストレージバックエンドから対象ファイルを削除します。',
    zh: '从当前激活的存储后端永久删除指定文件并返回确认响应。',
  },
  s4Heading: {
    vi: '5. Ví Dụ Tải Lên & Sinh Presigned URL (cURL)',
    en: '5. Multipart Upload & Presigned URL Sample (cURL)',
    ja: '5. マルチパートアップロード＆Presigned URLサンプル（cURL）',
    zh: '5. 分块上传与预签名 URL 实测样例（cURL）',
  },
};

export const PureJavaAndFileStoragePage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">503 Pure Java Files</span>
        <span className="badge badge-blue">Zero Spring Imports</span>
        <span className="badge badge-amber">13 L1 Caches</span>
        <span className="badge badge-purple">Storage: LOCAL | S3 | GCS</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Kiến Trúc 100% Pure Java & Lưu Trữ Tệp Đa Đám Mây (Local / S3 / GCS)'}
        {currentLang === 'en' && '100% Pure Java Zero-Spring-Import Engine & Multi-Cloud File Storage'}
        {currentLang === 'ja' && '100% Pure Java ゼロSpringインポート基盤＆マルチクラウドストレージ'}
        {currentLang === 'zh' && '100% 纯 Java 零 Spring 导入引擎与多云文件存储子系统'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'Toàn bộ 503 tệp Java trong controller-to-api-framework/src/main/java không chứa câu lệnh import org.springframework.* hay @org.springframework.* inline. Khởi tạo động tại runtime qua PureJavaSpringBootstrapBridge cùng phân hệ lưu trữ Local, AWS S3 (SigV4) và Google Cloud Storage.'}
        {currentLang === 'en' &&
          'All 503 Java files under controller-to-api-framework/src/main/java contain zero import org.springframework.* statements and zero inline @org.springframework.* references. Runtime integration occurs via PureJavaSpringBootstrapBridge alongside built-in Local, AWS S3 (SigV4), and Google Cloud Storage support.'}
        {currentLang === 'ja' &&
          'controller-to-api-framework/src/main/java 配下の全503ファイルは org.springframework.* のインポートをゼロに保ち、PureJavaSpringBootstrapBridge による動的統合と Local/S3(SigV4)/GCS ストレージを提供します。'}
        {currentLang === 'zh' &&
          'controller-to-api-framework/src/main/java 下全部 503 个 Java 源码文件实现零 org.springframework.* 导入，通过 PureJavaSpringBootstrapBridge 在运行时动态桥接宿主容器，并原生支持本地磁盘、AWS S3 (SigV4) 与 Google Cloud Storage。'}
      </p>

      <Callout type="success" title={TXT.guardTitle[currentLang]}>
        {TXT.guardBody[currentLang]}
      </Callout>

      <h2 id="pure-java-annotations" className="section-heading">{TXT.s1Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.s1Lead[currentLang]}</p>

      <table className="doc-table">
        <thead>
          <tr>
            <th>{TXT.colAnn[currentLang]}</th>
            <th>{TXT.colRole[currentLang]}</th>
            <th>{TXT.colBridge[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@AutoComponent</code></td>
            <td>{TXT.rAutoComp[currentLang]}</td>
            <td><code>GenericBeanDefinition (AUTOWIRE_CONSTRUCTOR)</code></td>
          </tr>
          <tr>
            <td><code>@AutoService</code></td>
            <td>{TXT.rAutoSvc[currentLang]}</td>
            <td><code>GenericBeanDefinition (AUTOWIRE_CONSTRUCTOR)</code></td>
          </tr>
          <tr>
            <td><code>@AutoConfigurationBean</code></td>
            <td>{TXT.rAutoCfg[currentLang]}</td>
            <td><code>PureJavaPropertiesBinderBridge</code> + <code>@AutoBean</code> scan</td>
          </tr>
          <tr>
            <td><code>@AutoBean(primary = true)</code></td>
            <td>{TXT.rAutoBean[currentLang]}</td>
            <td><code>RootBeanDefinition + setPrimary(true)</code></td>
          </tr>
        </tbody>
      </table>

      <h2 id="l1-reflection-caches" className="section-heading">{TXT.l1Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.l1Lead[currentLang]}</p>
      <table className="doc-table">
        <thead>
          <tr>
            <th>ReflectionCacheConstant Field</th>
            <th>Default Capacity</th>
            <th>Cached Metadata Target</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>CLASS_CACHE</code> / <code>CONSTRUCTOR_CACHE</code> / <code>DECLARED_FIELDS_CACHE</code></td>
            <td><code>256</code></td>
            <td><code>Class&lt;?&gt;</code>, no-arg constructors, flattened entity hierarchy fields</td>
          </tr>
          <tr>
            <td><code>FIELD_BY_NAME_CACHE</code> / <code>PROPERTY_DESCRIPTOR_CACHE</code> / <code>UNIQUE_FIELDS_CACHE</code></td>
            <td><code>256</code></td>
            <td>O(1) field lookup, property descriptors, <code>@UniqueField</code> index</td>
          </tr>
          <tr>
            <td><code>KEBAB_CASE_CACHE</code> / <code>REST_ENDPOINT_PATH_CACHE</code></td>
            <td><code>256</code></td>
            <td>Precomputed pluralized kebab-case REST base paths</td>
          </tr>
          <tr>
            <td><code>ANNOTATED_FIELDS_CACHE</code></td>
            <td><code>512</code></td>
            <td>Fields grouped by <code>@AutoCode</code>, <code>@FieldSecurity</code>, <code>@StateMachine</code></td>
          </tr>
          <tr>
            <td><code>METHOD_CACHE</code> / <code>READ_METHOD_HANDLE_CACHE</code> / <code>WRITE_METHOD_HANDLE_CACHE</code></td>
            <td><code>1024</code></td>
            <td>Resolved <code>Method</code> &amp; <code>java.lang.invoke.MethodHandle</code> fast property accessors</td>
          </tr>
          <tr>
            <td><code>PACKAGE_CLASS_NAMES_CACHE</code></td>
            <td><code>64</code></td>
            <td>Base package class discovery index from <code>PureJavaClasspathScannerUtil</code></td>
          </tr>
        </tbody>
      </table>

      <h2 id="file-storage-config" className="section-heading">{TXT.s2Heading[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.s2Lead[currentLang]}</p>

      <CodeBlock
        language="yaml"
        fileName="application.yml"
        code={`app:
  framework:
    storage:
      enabled: true
      provider: LOCAL                  # LOCAL | S3 | GCS
      max-file-size: 52428800          # 50 MiB limit
      allowed-extensions:
        - txt
        - pdf
        - png
        - jpg
        - json
        - csv
      local:
        base-dir: ./uploads-storage
        url-prefix: /api/v1/storage/download/
      s3:
        bucket-name: enterprise-prod-bucket
        region: ap-southeast-1
      gcs:
        bucket-name: enterprise-gcs-bucket
        project-id: enterprise-cloud-2026`}
      />

      <h2 id="file-storage-endpoints" className="section-heading">{TXT.s3Heading[currentLang]}</h2>

      <table className="doc-table">
        <thead>
          <tr>
            <th>HTTP Method</th>
            <th>Endpoint Path</th>
            <th>{TXT.colDesc[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><span className="method-badge method-post">POST</span></td>
            <td><code>/api/v1/storage/upload</code></td>
            <td>{TXT.epUpload[currentLang]}</td>
          </tr>
          <tr>
            <td><span className="method-badge method-get">GET</span></td>
            <td><code>/api/v1/storage/download/&#123;fileId&#125;</code></td>
            <td>{TXT.epDownload[currentLang]}</td>
          </tr>
          <tr>
            <td><span className="method-badge method-get">GET</span></td>
            <td><code>/api/v1/storage/metadata/&#123;fileId&#125;</code></td>
            <td>{TXT.epMeta[currentLang]}</td>
          </tr>
          <tr>
            <td><span className="method-badge method-get">GET</span></td>
            <td><code>/api/v1/storage/exists/&#123;fileId&#125;</code></td>
            <td>{TXT.epExists[currentLang]}</td>
          </tr>
          <tr>
            <td><span className="method-badge method-post">POST</span></td>
            <td><code>/api/v1/storage/presigned-url</code></td>
            <td>{TXT.epPresigned[currentLang]}</td>
          </tr>
          <tr>
            <td><span className="method-badge method-delete">DELETE</span></td>
            <td><code>/api/v1/storage/&#123;fileId&#125;</code></td>
            <td>{TXT.epDelete[currentLang]}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="file-storage-sample" className="section-heading">{TXT.s4Heading[currentLang]}</h2>

      <CodeBlock
        language="bash"
        fileName="cURL Multipart Upload & Presigned URL"
        code={`curl -X POST "http://localhost:8080/api/v1/storage/upload?folder=specs/2026" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -F "file=@enterprise-spec.txt"

curl -X POST "http://localhost:8080/api/v1/storage/presigned-url" \\
  -H "Authorization: Bearer <JWT_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "fileIdentifier": "01a1b921-3ac5-7d7d-8100-b04f545a857c",
    "httpMethod": "GET",
    "expirationSeconds": 600
  }'`}
      />
    </div>
  );
};
