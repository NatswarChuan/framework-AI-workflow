import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  lead: {
    vi: 'Kết nối mô hình ngôn ngữ lớn (LLM) với thực thể JPA thông qua JSON Schema Function Calling tự sinh (GET /ai/context) và truy vấn ngôn ngữ tự nhiên có kiểm soát (POST /ai/query).',
    en: 'Expose JPA entity metadata directly to LLMs via synthesized OpenAPI/JSON tool schemas (GET /ai/context) and parameterized natural language filtering (POST /ai/query).',
    ja: '自動生成される関数呼び出しスキーマ（GET /ai/context）と型安全にパラメータ化された自然言語クエリ（POST /ai/query）で JPA エンティティを LLM へ接続します。',
    zh: '通过自动生成的 JSON 工具模式（GET /ai/context）与严格参数化的自然语言查询接口（POST /ai/query），安全连接大语言模型与关系实体数据。',
  },
  h1: {
    vi: '1. Tool Schema Tự Động Cho Function Calling (GET /ai/context)',
    en: '1. Dynamic Function Calling Tool Schema (GET /ai/context)',
    ja: '1. 動的関数呼び出しツールスキーマ (GET /ai/context)',
    zh: '1. 动态函数调用工具模式 (GET /ai/context)',
  },
  p1: {
    vi: 'Mỗi Controller kế thừa AutoApiController<E> tự động công bố endpoint GET /ai/context, trả về mô tả thuộc tính thực thể và phạm vi lọc cho Spring AI ChatClient hoặc LLM Agent:',
    en: 'Every controller extending AutoApiController<E> publishes GET /ai/context returning entity schema definitions suitable for Spring AI ChatClient and LLM tool-calling agents:',
    ja: 'AutoApiController<E> を継承した各コントローラーは GET /ai/context を公開し、Spring AI ChatClient や LLM エージェント向けのエンティティ定義を返却します：',
    zh: '所有继承 AutoApiController<E> 的控制器均内置 GET /ai/context 端点，返回供 Spring AI ChatClient 与 Agent 解析的实体结构元数据：',
  },
  h2: {
    vi: '2. Gọi ChatClient Kết Hợp ThirdPartyRestClientHelper Trong Service',
    en: '2. Invoking Spring AI ChatClient Inside Services',
    ja: '2. サービス層での Spring AI ChatClient 連携実装',
    zh: '2. 在 Service 层集成 Spring AI ChatClient',
  },
  h3: {
    vi: '3. Truy Vấn Ngôn Ngữ Tự Nhiên (POST /ai/query)',
    en: '3. Natural Language Query Endpoint (POST /ai/query)',
    ja: '3. 自然言語クエリエンドポイント (POST /ai/query)',
    zh: '3. 自然语言转译查询端点 (POST /ai/query)',
  },
  p3: {
    vi: 'Gửi truy vấn dạng văn bản tới POST /ai/query; bộ dịch nội bộ chuyển đổi thành JPA Criteria Predicate tham số hóa trước khi thực thi truy vấn:',
    en: 'Submit text prompts to POST /ai/query; the engine translates filter intents into parameterized JPA Criteria Predicates rather than raw string SQL:',
    ja: 'POST /ai/query へ自然言語プロンプトを送信すると、生の SQL 文字列連結を行わずパラメータ化された JPA Criteria Predicate へ変換して検索します：',
    zh: '向 POST /ai/query 发送自然语言条件描述，内部引擎将其解析并映射为参数化的 JPA Criteria Predicate 执行查询：',
  },
  calloutTitle: {
    vi: 'Chống SQL Injection Tại Tầng JPA Criteria',
    en: 'SQL Injection Protection via JPA Criteria Binding',
    ja: 'JPA Criteria バインディングによる SQLi 防御',
    zh: '基于 JPA Criteria 参数绑定的 SQL 注入免疫机制',
  },
  calloutBody: {
    vi: 'Toàn bộ điều kiện trích xuất từ POST /ai/query được ràng buộc bằng tham số JPA Criteria thông qua QueryFilterParameterUtil, chặn triệt để chuỗi tiêm SQL thô như \' OR 1=1 --.',
    en: 'Extracted predicates from POST /ai/query execute exclusively through bound JPA Criteria parameters validated by QueryFilterParameterUtil, rejecting raw SQL payloads.',
    ja: 'POST /ai/query から抽出された条件はすべて QueryFilterParameterUtil で検証済みのパラメータ化 Criteria として実行されるため、生の SQL インジェクションを遮断します。',
    zh: 'POST /ai/query 解析出的全部检索条件均通过 QueryFilterParameterUtil 校验并绑定为 JPA Criteria 参数，彻底阻断原始 SQL 拼接注入。',
  },
};

export const SpringAiPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-amber">Spring AI</span>
        <span className="badge badge-blue">Tool Schema (/ai/context)</span>
        <span className="badge badge-emerald">Criteria Parameterized</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'en' && 'Spring AI Integration & Natural Language Queries'}
        {currentLang === 'vi' && 'Tích Hợp Spring AI & Truy Vấn Ngôn Ngữ Tự Nhiên'}
        {currentLang === 'ja' && 'Spring AI連携と自然言語クエリ'}
        {currentLang === 'zh' && 'Spring AI大模型集成与自然语言SQL转译'}
      </h1>

      <p className="page-lead">{TXT.lead[currentLang]}</p>

      <h2 id="ai-tool-schema" className="section-heading">{TXT.h1[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p1[currentLang]}</p>

      <CodeBlock
        language="bash"
        fileName="cURL AI Context Inspection"
        code={`curl -X GET "http://localhost:8080/api/v1/clinical-appointments/ai/context"`}
      />

      <h2 id="spring-ai-chat-client" className="section-heading">{TXT.h2[currentLang]}</h2>
      <CodeBlock
        language="java"
        fileName="service/impl/AiAssistantServiceImpl.java"
        code={`@AutoService
@RequiredArgsConstructor
public class AiAssistantServiceImpl implements AiAssistantService {

    private final ChatClient chatClient;

    @Override
    public String askSchedulerAssistant(final String userPrompt) {
        return chatClient.prompt()
            .user(userPrompt)
            .system("Use /api/v1/clinical-appointments/ai/context schema metadata.")
            .call()
            .content();
    }
}`}
      />

      <h2 id="natural-language-query" className="section-heading">{TXT.h3[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p3[currentLang]}</p>

      <CodeBlock
        language="bash"
        fileName="cURL Natural Language Query"
        code={`curl -X POST "http://localhost:8080/api/v1/customer-orders/ai/query" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "orders placed yesterday with amount greater than 1000"}'`}
      />

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {TXT.calloutBody[currentLang]}
      </Callout>
    </div>
  );
};
