import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { InteractiveEndpointExplorer } from '../components/InteractiveEndpointExplorer';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

export const EndpointsPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">RESTful Specification</span>
        <span className="badge badge-blue">38 Built-In Endpoints</span>
        <span className="badge badge-purple">NIST RBAC & Keyset O(1)</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'Complete 38 Auto-Generated REST Endpoints'}
        {currentLang === 'vi' && 'Danh Mục 38 Endpoint RESTful Tự Động Sinh Hoàn Chỉnh'}
        {currentLang === 'ja' && '自動生成される38種類のRESTfulエンドポイント完全一覧'}
        {currentLang === 'zh' && '38个内置自动生成RESTful端点全集'}
      </h1>

      <p className="page-lead">
        {currentLang === 'en' && 'When you declare an interface extending AutoApiController<E>, the framework automatically synthesizes 38 production-grade REST operations (plus 6 Multi-Cloud File Storage endpoints under /api/v1/storage).'}
        {currentLang === 'vi' && 'Khi bạn khai báo một interface kế thừa AutoApiController<E>, Spring-NWVMC tự động tổng hợp đầy đủ 38 thao tác RESTful chuẩn quốc tế (cùng 6 endpoints lưu trữ tệp tại /api/v1/storage).'}
        {currentLang === 'ja' && 'AutoApiController<E> を継承したインターフェースを宣言するだけで、フレームワークが38種類のエンドポイントを完全自動で公開します。'}
        {currentLang === 'zh' && '只需声明继承自 AutoApiController<E> 的接口，框架即可在运行时自动生成并发布全套 38 个生产级 RESTful 端点。'}
      </p>

      <InteractiveEndpointExplorer endpoints={ENDPOINTS_DATA} currentLang={currentLang} />

      <h2 id="endpoint-table" className="section-heading">
        {currentLang === 'en' && '1. Core Endpoint Directory'}
        {currentLang === 'vi' && '1. Bảng Tra Cứu Toàn Bộ Endpoint Cốt Lõi'}
        {currentLang === 'ja' && '1. エンドポイント詳細カタログ'}
        {currentLang === 'zh' && '1. 端点全量目录表'}
      </h2>

      <table className="doc-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>Endpoint Path Pattern</th>
            <th>Required RBAC Role</th>
            <th>Operation Summary</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS_DATA.map((ep, idx) => (
            <tr key={idx}>
              <td>
                <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                  {ep.method}
                </span>
              </td>
              <td>
                <code>{ep.path}</code>
              </td>
              <td>
                <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>{ep.requiredRole}</span>
              </td>
              <td>
                {ep.summary[currentLang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Callout
        type="info"
        title={
          {
            vi: 'Tài Liệu Hóa Tự Động OpenAPI 3.0 & Cơ Chế @Hidden',
            en: 'Automated OpenAPI 3.0 Registration & @Hidden Filtering',
            ja: 'OpenAPI 3.0 自動登録＆ @Hidden フィルタリング',
            zh: 'OpenAPI 3.0 自动集成与 @Hidden 隐藏机制',
          }[currentLang]
        }
      >
        {currentLang === 'vi' && '36/38 endpoint mặc định (cộng 15 built-in endpoints) tự động hiển thị trên Swagger UI (/swagger-ui/index.html) với schema ApiResponse. Riêng /events (@Hidden SSE), /system/studio và /api/v1/graphql/explorer bị ẩn khỏi Swagger UI.'}
        {currentLang === 'en' && '36 of 38 @Auto* entity endpoints (plus built-in platform APIs) appear in Swagger UI (/swagger-ui/index.html) with ApiResponse schemas; /events (@Hidden SSE), /system/studio, and /api/v1/graphql/explorer stay hidden.'}
        {currentLang === 'ja' && '38契約のうちデフォルト36件が ApiResponse スキーマとともに Swagger UI へ登録されます（/events SSE、/system/studio、/graphql/explorer は @Hidden により除外）。'}
        {currentLang === 'zh' && '38 个契约中默认 36 个公开显示在 Swagger UI（携带 ApiResponse 契约）；/events (@Hidden SSE)、/system/studio 与 /graphql/explorer 默认隐藏。'}
      </Callout>

      <h2 id="endpoint-toggles" className="section-heading">
        {currentLang === 'en' && '2. Granular Endpoint Toggles (Whitelist & Blacklist)'}
        {currentLang === 'vi' && '2. Cơ Chế Bật/Tắt Endpoint Linh Hoạt (Whitelist & Blacklist)'}
        {currentLang === 'ja' && '2. エンドポイントの個別有効化／無効化（ホワイトリスト＆ブラックリスト）'}
        {currentLang === 'zh' && '2. 端点按需启闭机制（白名单与黑名单）'}
      </h2>

      <p>
        {currentLang === 'vi' && 'EndpointFeatureFilterHelper đánh giá tên method hợp đồng (ví dụ deleteById, batchChunked, importCsv) hoặc HTTP method (DELETE) thông qua enabledEndpoints và disabledEndpoints trên @AutoRestController:'}
        {currentLang === 'en' && 'EndpointFeatureFilterHelper evaluates contract method names (e.g. deleteById, batchChunked, importCsv) or HTTP methods (DELETE) via enabledEndpoints and disabledEndpoints on @AutoRestController:'}
        {currentLang === 'ja' && 'EndpointFeatureFilterHelper は @AutoRestController の enabledEndpoints / disabledEndpoints に指定されたメソッド名（deleteById、batchChunked、importCsv等）や HTTP メソッド単位で公開制御します：'}
        {currentLang === 'zh' && 'EndpointFeatureFilterHelper 根据 @AutoRestController 的 enabledEndpoints 与 disabledEndpoints 精确匹配方法名（如 deleteById、batchChunked、importCsv）或 HTTP 方法：'}
      </p>

      <CodeBlock
        language="java"
        fileName="Granular Endpoint Toggles"
        code={`// 1. Whitelist read + create endpoints
@AutoRestController(
    path = "/api/v1/catalog",
    enabledEndpoints = {"getPage", "getById", "getKeyset", "create"}
)
public interface ProductCatalogController extends AutoApiController<CommercialProduct> {}

// 2. Blacklist destructive or bulk endpoints
@AutoRestController(
    path = "/api/v1/orders",
    disabledEndpoints = {"deleteById", "batchChunked", "DELETE"}
)
public interface SecureOrderController extends AutoApiController<CustomerOrder> {}`}
      />
    </div>
  );
};
