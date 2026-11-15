import React, { useState } from 'react';
import { EndpointSpec, SupportedLanguage } from '../types/docs';
import { Play, Copy, Check } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface InteractiveEndpointExplorerProps {
  endpoints: EndpointSpec[];
  currentLang: SupportedLanguage;
}

export const InteractiveEndpointExplorer: React.FC<InteractiveEndpointExplorerProps> = ({
  endpoints,
  currentLang,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);

  const selected = endpoints[selectedIndex] || endpoints[0];

  const handleCopyCurl = () => {
    const curl = `curl -X ${selected.method} "http://localhost:8080${selected.path}" \\\n  -H "Authorization: Bearer <JWT_TOKEN>" \\\n  -H "Content-Type: application/json"${selected.requestBodySample ? ` \\\n  -d '${selected.requestBodySample.replace(/\n/g, '')}'` : ''}`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    setSimulatedResponse(selected.responseSample);
  };

  const getMethodClass = (method: string) => {
    switch (method) {
      case 'GET': return 'method-get';
      case 'POST': return 'method-post';
      case 'PUT': return 'method-put';
      case 'PATCH': return 'method-patch';
      case 'DELETE': return 'method-delete';
      default: return 'method-get';
    }
  };

  const ui = {
    inspector: { vi: 'Trình Kiểm Tra Endpoint Tương Tác', en: 'Interactive Endpoint Inspector', ja: 'インタラクティブ エンドポイント検査', zh: '交互式端点契约检查器' }[currentLang],
    copied: { vi: 'Đã sao chép cURL', en: 'Copied cURL', ja: 'コピー完了', zh: '已复制 cURL' }[currentLang],
    copy: { vi: 'Sao chép cURL', en: 'Copy cURL', ja: 'cURLをコピー', zh: '复制 cURL' }[currentLang],
    simulate: { vi: 'Mô phỏng gọi', en: 'Simulate Call', ja: '呼び出しシミュレート', zh: '模拟调用响应' }[currentLang],
    reqTitle: { vi: 'Mẫu Request Body (JSON)', en: 'Sample Request Body (JSON)', ja: 'リクエストボディ例 (JSON)', zh: '请求体示例 (JSON)' }[currentLang],
    resSim: { vi: 'Kết quả mô phỏng HTTP 200/201', en: 'Simulated HTTP 200/201 Response', ja: 'シミュレート応答 HTTP 200/201', zh: '模拟 HTTP 200/201 响应结果' }[currentLang],
    resPreview: { vi: 'Xem trước chuẩn ApiResponse<T>', en: 'Standard ApiResponse<T> Contract Preview', ja: '標準 ApiResponse<T> スキーマ', zh: '标准 ApiResponse<T> 响应预览' }[currentLang],
  };

  return (
    <div className="doc-card" style={{ margin: '1.5rem 0 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <span>{ui.inspector}</span>
          <span className="badge badge-emerald">Live Spec Explorer</span>
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCopyCurl}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              color: copied ? 'var(--accent-emerald)' : 'var(--text-primary)',
              padding: '0.35rem 0.7rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? ui.copied : ui.copy}
          </button>

          <button
            onClick={handleExecute}
            style={{
              background: 'var(--brand-primary)',
              border: 'none',
              borderRadius: 6,
              color: '#ffffff',
              padding: '0.35rem 0.8rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Play size={14} />
            {ui.simulate}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
          {currentLang === 'vi'
            ? 'Chọn Endpoint cần kiểm tra chi tiết:'
            : currentLang === 'ja'
            ? '詳細を確認するエンドポイントを選択:'
            : currentLang === 'zh'
            ? '选择需要查看详情的端点:'
            : 'Select Endpoint to Inspect:'}
        </label>
        <select
          value={selectedIndex}
          onChange={(e) => {
            setSelectedIndex(Number(e.target.value));
            setSimulatedResponse(null);
          }}
          style={{
            width: '100%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            color: 'var(--text-primary)',
            padding: '0.6rem 0.85rem',
            fontFamily: 'JetBrains Mono',
            fontSize: '0.84rem',
            outline: 'none',
          }}
        >
          {endpoints.map((ep, idx) => (
            <option key={idx} value={idx}>
              [{ep.method}] {ep.path} — {ep.summary[currentLang]}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.9rem 1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span className={`method-badge ${getMethodClass(selected.method)}`}>{selected.method}</span>
          <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 700 }}>{selected.path}</span>
          <span className="badge badge-purple" style={{ marginLeft: 'auto' }}>Role: {selected.requiredRole}</span>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>{selected.description[currentLang]}</p>
      </div>

      {selected.requestBodySample && (
        <CodeBlock
          language="json"
          title={ui.reqTitle}
          code={selected.requestBodySample}
        />
      )}

      <CodeBlock
        language="json"
        title={simulatedResponse ? ui.resSim : ui.resPreview}
        code={simulatedResponse || selected.responseSample}
      />
    </div>
  );
};
