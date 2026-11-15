import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Không Cần File .graphqls Hay Resolver Thủ Công',
    en: 'Zero Manual Schema Files or Resolvers',
    ja: '.graphqls ファイル・手動リゾルバ不要',
    zh: '零手写 .graphqls 与 Resolver 解析器',
  },
  h1: {
    vi: '1. Schema SDL Tự Động Sinh (GET /api/v1/graphql/schema)',
    en: '1. Auto-Generated Schema SDL (GET /api/v1/graphql/schema)',
    ja: '1. 自動生成 GraphQL Schema SDL (GET /api/v1/graphql/schema)',
    zh: '1. 自动生成的 GraphQL Schema SDL (GET /api/v1/graphql/schema)',
  },
  h2: {
    vi: '2. Thực Thi GraphQL Qua HTTP (POST /api/v1/graphql)',
    en: '2. HTTP Query & Mutation Execution (POST /api/v1/graphql)',
    ja: '2. HTTP クエリ＆ミューテーション実行 (POST /api/v1/graphql)',
    zh: '2. HTTP GraphQL 查询与变更执行 (POST /api/v1/graphql)',
  },
  h3: {
    vi: '3. Trình Khám Phá Interactive Explorer (/api/v1/graphql/explorer)',
    en: '3. Built-In GraphQL Explorer (/api/v1/graphql/explorer)',
    ja: '3. 組み込み GraphQL Explorer (/api/v1/graphql/explorer)',
    zh: '3. 内置交互式 GraphQL Explorer (/api/v1/graphql/explorer)',
  },
  p3: {
    vi: 'Truy cập /api/v1/graphql/explorer (endpoint giao diện HTML đánh dấu @Hidden trên Swagger UI) để thử nghiệm trực tiếp GraphQL queries.',
    en: 'Open /api/v1/graphql/explorer (marked @Hidden in Swagger UI since it returns HTML) to test schema queries interactively.',
    ja: 'HTML コンソールである /api/v1/graphql/explorer（Swagger UI 上は @Hidden で非表示）から対話的にクエリを試行できます。',
    zh: '访问 /api/v1/graphql/explorer（因其返回 HTML 控制台而在 Swagger UI 中通过 @Hidden 隐藏），即可交互式调试查询语句。',
  },
};

export const GraphQLSubsystemPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-purple">GraphQLDynamicApiController</span>
        <span className="badge badge-emerald">Zero Manual Resolvers</span>
        <span className="badge badge-blue">/api/v1/graphql</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Động Cơ GraphQL Động (/api/v1/graphql & Schema SDL)'}
        {currentLang === 'en' && 'Dynamic GraphQL Subsystem (/api/v1/graphql & SDL)'}
        {currentLang === 'ja' && '動的GraphQLサブシステム (/api/v1/graphql と SDL)'}
        {currentLang === 'zh' && '动态GraphQL子系统 (/api/v1/graphql 与 自动SDL)'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'GraphQLDynamicApiController kết hợp DynamicGraphQLSchemaGeneratorHelper và DynamicGraphQLExecutionHelper phân tích JPA Metamodel để tự động tổng hợp Schema SDL và truy vấn theo từng trường (field selection).'}
        {currentLang === 'en' &&
          'GraphQLDynamicApiController pairs DynamicGraphQLSchemaGeneratorHelper and DynamicGraphQLExecutionHelper to synthesize GraphQL SDL from JPA entity metadata and execute field-selected queries and mutations.'}
        {currentLang === 'ja' &&
          'GraphQLDynamicApiController は DynamicGraphQLSchemaGeneratorHelper と連携し、JPA メタデータから SDL スキーマ生成と選択フィールド射影を自動実行します。'}
        {currentLang === 'zh' &&
          'GraphQLDynamicApiController 联动 DynamicGraphQLSchemaGeneratorHelper 与 DynamicGraphQLExecutionHelper，自动依据 JPA 元数据生成 SDL 并按需裁剪返回字段。'}
      </p>

      <Callout type="success" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'DynamicSchemaProjectionHelper tự động ánh xạ các trường được chọn trong truy vấn GraphQL để chỉ tuần tự hóa đúng các thuộc tính yêu cầu.'}
        {currentLang === 'en' &&
          'DynamicSchemaProjectionHelper maps requested GraphQL field selections directly so responses serialize only requested attributes.'}
        {currentLang === 'ja' &&
          'DynamicSchemaProjectionHelper が要求された GraphQL フィールド選択を直接解釈し、必要な属性だけをシリアライズします。'}
        {currentLang === 'zh' &&
          'DynamicSchemaProjectionHelper 直接映射 GraphQL 查询选中的字段列表，仅序列化客户端所需的属性。'}
      </Callout>

      <h2 id="graphql-sdl" className="section-heading">{TXT.h1[currentLang]}</h2>
      <CodeBlock
        language="graphql"
        fileName="GET /api/v1/graphql/schema"
        code={`scalar DateTime
scalar JSON

type Product {
  id: ID
  code: String
  name: String
  price: Float
  status: String
  createdAt: DateTime
}

type Query {
  getProduct(id: ID!): Product
  listProducts(filter: String, page: Int, size: Int, sort: String): [Product]
  countProducts(filter: String): Int
}`}
      />

      <h2 id="graphql-query" className="section-heading">{TXT.h2[currentLang]}</h2>
      <CodeBlock
        language="bash"
        fileName="POST /api/v1/graphql"
        code={`curl -X POST "http://localhost:8080/api/v1/graphql" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "{ getProduct(id: \\"01931888-0000-7000-8000-000000000001\\") { id name price } }"}'`}
      />

      <h2 id="graphql-explorer" className="section-heading">{TXT.h3[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p3[currentLang]}</p>
    </div>
  );
};
