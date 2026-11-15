import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';

interface PageProps {
  currentLang: SupportedLanguage;
}

const TXT = {
  calloutTitle: {
    vi: 'Định Dạng Chuẩn W3C traceparent',
    en: 'W3C traceparent Standard Format',
    ja: 'W3C traceparent 標準フォーマット',
    zh: 'W3C traceparent 标准头部格式',
  },
  h1: {
    vi: '1. Quy Chuẩn Tiêu Đề HTTP Tracing Headers',
    en: '1. W3C & Correlation HTTP Headers',
    ja: '1. W3C＆相関トラッキング HTTP ヘッダー',
    zh: '1. W3C 与链路追踪标准 HTTP 头清单',
  },
  colHdr: { vi: 'HTTP Header', en: 'HTTP Header', ja: 'HTTP ヘッダー', zh: 'HTTP 请求/响应头' },
  colSample: { vi: 'Định Dạng Mẫu', en: 'Sample Value', ja: 'サンプル値', zh: '示例格式' },
  colMeaning: { vi: 'Ý Nghĩa & Thành Phần', en: 'Scope & Semantics', ja: '仕様・役割', zh: '规范语义' },
  dTp: {
    vi: 'Chứa version, 32-hex traceId, 16-hex spanId và traceFlags xử lý bởi W3cTraceContextPropagatorHelper.',
    en: 'Carries version, 32-hex traceId, 16-hex spanId, and traceFlags parsed via W3cTraceContextPropagatorHelper.',
    ja: 'version、32桁 traceId、16桁 spanId、traceFlags を保持（W3cTraceContextPropagatorHelper で解析）。',
    zh: '由 W3cTraceContextPropagatorHelper 解析透传，携带 version、32 位 traceId、16 位 spanId 与标志位。',
  },
  dTs: {
    vi: 'Trường vendor routing / baggage tùy chọn theo đặc tả W3C TraceContext.',
    en: 'Optional vendor-specific tracing baggage per W3C TraceContext recommendation.',
    ja: 'APM ベンダー固有のルーティング状態を保持する W3C tracestate。',
    zh: 'W3C TraceContext 规范定义的可选第三方追踪附加状态。',
  },
  dReqId: {
    vi: 'Mã định danh yêu cầu UUIDv7 (RFC 9562) sinh và gắn MDC bởi TraceIdFilter.',
    en: 'RFC 9562 UUIDv7 correlation ID managed in SLF4J MDC by TraceIdFilter.',
    ja: 'TraceIdFilter が SLF4J MDC へ自動バインドする UUIDv7 リクエスト相関ID。',
    zh: 'TraceIdFilter 生成并注入 SLF4J MDC 与响应头的 RFC 9562 UUIDv7 请求唯一 ID。',
  },
  dSpan: {
    vi: 'Mã Span 16-hex hiện tại dùng để đối chiếu từng chặng gọi nội bộ/ra ngoài.',
    en: 'Active 16-hex child span ID emitted for log correlation.',
    ja: '現行処理スパンを識別する16桁の16進 Span ID。',
    zh: '标识当前处理节点调用跨度的 16 位十六进制子 Span ID。',
  },
  h2: {
    vi: '2. API Kiểm Tra Ngữ Cảnh Truy Vết (TraceContextSystemApiController)',
    en: '2. Trace Context Inspection Endpoint (GET /api/v1/system/trace-context)',
    ja: '2. トレースコンテキスト確認API (GET /api/v1/system/trace-context)',
    zh: '2. 链路追踪上下文调试接口 (GET /api/v1/system/trace-context)',
  },
  p2: {
    vi: 'Endpoint GET /api/v1/system/trace-context phản ánh W3cTraceContextDto trích xuất từ SLF4J MDC trên luồng hiện hành:',
    en: 'GET /api/v1/system/trace-context exposes the active W3cTraceContextDto bound in SLF4J MDC:',
    ja: 'GET /api/v1/system/trace-context は SLF4J MDC 上でアクティブな W3cTraceContextDto を返却します：',
    zh: 'GET /api/v1/system/trace-context 返回当前线程 SLF4J MDC 中的活跃 W3cTraceContextDto：',
  },
};

export const DistributedTracingPage: React.FC<PageProps> = ({ currentLang }) => {
  return (
    <div className="doc-page">
      <div className="badge-row">
        <span className="badge badge-emerald">W3C TraceContext</span>
        <span className="badge badge-blue">TraceIdFilter (UUIDv7)</span>
        <span className="badge badge-purple">traceparent</span>
        <span className="badge badge-amber">SLF4J MDC</span>
      </div>

      <h1 className="page-title">
        {currentLang === 'vi' && 'Truy Vết Phân Tán Chuẩn W3C TraceContext'}
        {currentLang === 'en' && 'W3C TraceContext Distributed Tracing Subsystem'}
        {currentLang === 'ja' && 'W3C TraceContext 準拠分散トレーシング基盤'}
        {currentLang === 'zh' && 'W3C TraceContext 标准分布式全链路追踪系统'}
      </h1>

      <p className="page-lead">
        {currentLang === 'vi' &&
          'TraceIdFilter và W3cTraceContextPropagatorHelper bóc tách header traceparent chuẩn W3C, tạo child Span 16-hex, đồng bộ SLF4J MDC và đính kèm X-Request-ID (UUIDv7) vào mọi ApiResponse.'}
        {currentLang === 'en' &&
          'TraceIdFilter and W3cTraceContextPropagatorHelper parse inbound W3C traceparent headers, mint 16-hex child spans, bind SLF4J MDC keys, and attach UUIDv7 X-Request-ID headers to every ApiResponse.'}
        {currentLang === 'ja' &&
          'TraceIdFilter と W3cTraceContextPropagatorHelper が W3C traceparent を解析し、16桁子スパン生成、SLF4J MDC バインド、UUIDv7 X-Request-ID 付与を自動実行します。'}
        {currentLang === 'zh' &&
          'TraceIdFilter 与 W3cTraceContextPropagatorHelper 自动解析 W3C traceparent 请求头、派生 16 位子 Span、写入 SLF4J MDC 并将 UUIDv7 X-Request-ID 注入每个响应。'}
      </p>

      <Callout type="info" title={TXT.calloutTitle[currentLang]}>
        {currentLang === 'vi' &&
          'Định dạng chuẩn: traceparent: {version}-{trace_id}-{parent_id}-{trace_flags} (ví dụ: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01).'}
        {currentLang === 'en' &&
          'Format: traceparent: {version}-{trace_id}-{parent_id}-{trace_flags} (example: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01).'}
        {currentLang === 'ja' &&
          '標準形式：traceparent: {version}-{trace_id}-{parent_id}-{trace_flags}（例：00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01）。'}
        {currentLang === 'zh' &&
          '标准格式：traceparent: {version}-{trace_id}-{parent_id}-{trace_flags}（示例：00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01）。'}
      </Callout>

      <h2 id="tracing-headers" className="section-heading">{TXT.h1[currentLang]}</h2>
      <table className="doc-table">
        <thead>
          <tr>
            <th>{TXT.colHdr[currentLang]}</th>
            <th>{TXT.colSample[currentLang]}</th>
            <th>{TXT.colMeaning[currentLang]}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>traceparent</code></td>
            <td><code>00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01</code></td>
            <td>{TXT.dTp[currentLang]}</td>
          </tr>
          <tr>
            <td><code>tracestate</code></td>
            <td><code>rojo=1,congo=2</code></td>
            <td>{TXT.dTs[currentLang]}</td>
          </tr>
          <tr>
            <td><code>X-Request-ID</code></td>
            <td><code>01a1b4ca-8a90-7f22-91a0-38e2ccbf1024</code></td>
            <td>{TXT.dReqId[currentLang]}</td>
          </tr>
          <tr>
            <td><code>X-Span-ID</code></td>
            <td><code>00f067aa0ba902b7</code></td>
            <td>{TXT.dSpan[currentLang]}</td>
          </tr>
        </tbody>
      </table>

      <h2 id="tracing-endpoint" className="section-heading">{TXT.h2[currentLang]}</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{TXT.p2[currentLang]}</p>

      <CodeBlock
        language="bash"
        fileName="GET /api/v1/system/trace-context"
        code={`curl -X GET "http://localhost:8080/api/v1/system/trace-context" \\
  -H "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01"`}
      />

      <CodeBlock
        language="json"
        fileName="W3cTraceContextDto Response"
        code={`{
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "version": "00",
    "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
    "parentSpanId": "00f067aa0ba902b7",
    "spanId": "c8a1e2f3b4d5e6a7",
    "traceFlags": "01",
    "rawTraceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-c8a1e2f3b4d5e6a7-01",
    "tracestate": ""
  },
  "traceId": "01a1b4ca-8a90-7f22-91a0-38e2ccbf1024"
}`}
      />
    </div>
  );
};
