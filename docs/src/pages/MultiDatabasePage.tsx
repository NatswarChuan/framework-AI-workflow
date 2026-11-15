import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Cô Lập Dữ Liệu Đa Tenant Theo Cụm Vật Lý',
    en: 'Multi-Tenant Database Isolation',
    ja: 'マルチテナントDBの物理分離',
    zh: '多租户物理数据库隔离',
  },
  h1: {
    vi: '1. Khai Báo Cụm CSDL Qua @TargetDatabasePlatform',
    en: '1. Declaring Target Clusters via @TargetDatabasePlatform',
    ja: '1. @TargetDatabasePlatform による接続クラスタ宣言',
    zh: '1. 通过 @TargetDatabasePlatform 声明目标数据库集群',
  },
  h2: {
    vi: '2. Đăng Ký Cụm CSDL Động Tại Runtime (MultiPlatformDataSourceRegistryHelper)',
    en: '2. Dynamic Runtime Cluster Registration (MultiPlatformDataSourceRegistryHelper)',
    ja: '2. 実行時の動的クラスタ登録 (MultiPlatformDataSourceRegistryHelper)',
    zh: '2. 运行时动态注册数据库集群 (MultiPlatformDataSourceRegistryHelper)',
  },
  h3: {
    vi: '3. Endpoint Giám Sát Cụm CSDL (GET /api/v1/system/databases/health)',
    en: '3. Cluster Health Inspection (GET /api/v1/system/databases/health)',
    ja: '3. クラスタ死活監視エンドポイント (GET /api/v1/system/databases/health)',
    zh: '3. 数据库集群健康监测端点 (GET /api/v1/system/databases/health)',
  },
};

export const MultiDatabasePage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-blue">@TargetDatabasePlatform</span>
        <span className="badge badge-purple">Multi-Tenant Routing</span>
        <span className="badge badge-emerald">MultiDatabaseHealthCheckController</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Đa Nền Tảng CSDL & Định Tuyến Cụm Động (Multi-Database)'}
        {currentLang === 'en' && 'Multi-Database Platform & Dynamic Cluster Routing'}
        {currentLang === 'ja' && 'マルチDBプラットフォームと動的ルーティング'}
        {currentLang === 'zh' && '多数据库平台支持与动态集群路由'}
      </h1>
      <p className="page-lead">
        {currentLang === 'vi' &&
          'Định tuyến truy vấn tự động qua @TargetDatabasePlatform, DatabasePlatformConstant (POSTGRESQL, MYSQL, ORACLE, H2, REDIS, MONGODB), TenantDatabaseRoutingResolverHelper và MultiPlatformDataSourceRegistryHelper.'}
        {currentLang === 'en' &&
          'Route queries declaratively across Primary, Replica, Finance, and Tenant shards using @TargetDatabasePlatform, DatabasePlatformConstant, TenantDatabaseRoutingResolverHelper, and MultiPlatformDataSourceRegistryHelper.'}
        {currentLang === 'ja' &&
          '@TargetDatabasePlatform、DatabasePlatformConstant、TenantDatabaseRoutingResolverHelper、MultiPlatformDataSourceRegistryHelper を用いて、Primary/Replica/財務/テナント別DBへ動的ルーティングします。'}
        {currentLang === 'zh' &&
          '借助 @TargetDatabasePlatform、DatabasePlatformConstant、TenantDatabaseRoutingResolverHelper 与 MultiPlatformDataSourceRegistryHelper 实现主从、财务专库及多租户动态路由。'}
      </p>

      <Callout type="warning" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'TenantDatabaseRoutingResolverHelper đọc mã Tenant từ ngữ cảnh xác thực để định tuyến kết nối SQL về đúng cụm dữ liệu đăng ký trong MultiPlatformDataSourceRegistryHelper.'}
        {currentLang === 'en' &&
          'TenantDatabaseRoutingResolverHelper resolves the tenant identifier from request security context to route SQL connections to the matching DataSource registered in MultiPlatformDataSourceRegistryHelper.'}
        {currentLang === 'ja' &&
          'TenantDatabaseRoutingResolverHelper が認証コンテキストからテナントIDを解決し、MultiPlatformDataSourceRegistryHelper 上の専用 DataSource へルーティングします。'}
        {currentLang === 'zh' &&
          'TenantDatabaseRoutingResolverHelper 从安全上下文提取租户标识，将 SQL 连接动态路由到 MultiPlatformDataSourceRegistryHelper 中对应的租户 DataSource。'}
      </Callout>

      <h2 id="target-database-platform" className="section-heading">{TXT.h1[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="entity/FinancialLedger.java"
        code={`@Entity
@Table(name = "tbl_financial_ledger")
@TargetDatabasePlatform(
    platform = DatabasePlatformConstant.PLATFORM_POSTGRESQL,
    cluster = DatabasePlatformConstant.CLUSTER_FINANCE,
    readOnly = false
)
public class FinancialLedger extends BaseAuditEntity {
}`}
      />

      <h2 id="tenant-cluster-routing" className="section-heading">{TXT.h2[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="helper/TenantClusterOnboardingHelper.java"
        code={`@AutoComponent
@RequiredArgsConstructor
public final class TenantClusterOnboardingHelper {

  private final MultiPlatformDataSourceRegistryHelper registryHelper;

  public void addNewTenantCluster(final String tenantId, final DataSource tenantDs) {
    registryHelper.registerCluster(
        "TENANT_" + tenantId,
        tenantDs,
        DatabasePlatformConstant.PLATFORM_MYSQL,
        false
    );
  }
}`}
      />

      <h2 id="multi-db-health" className="section-heading">{TXT.h3[currentLang]}</h2>
      <CodeBlock
        language="bash"
        fileName="GET /api/v1/system/databases/health"
        code={`curl -X GET "http://localhost:8080/api/v1/system/databases/health" \\
  -H "Authorization: Bearer <TOKEN>"`}
      />
    </div>
  );
};
