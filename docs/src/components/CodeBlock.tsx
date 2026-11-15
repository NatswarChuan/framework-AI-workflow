import React, { useState } from 'react';
import { Copy, Check, FileCode2, Sparkles } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
  title?: string;
  highlightLines?: number[];
}

const FOCUS_PATTERNS = [
  '@AutoRestController',
  '@AutoComponent',
  '@AutoService',
  '@AutoConfigurationBean',
  '@AutoBean',
  '@EntitySecurity',
  '@FieldSecurity',
  '@StateMachine',
  '@HumanPolicy',
  '@DistributedLock',
  '@Idempotent',
  '@EntityWebhook',
  '@TargetDatabasePlatform',
  '@CustomEndpoint',
  '@HttpCacheable',
  '@UniqueField',
  '@AutoCode',
  '@AutoSlug',
  '@ComputedField',
  '@AuditTrail',
  'extends AutoApiController',
  'enabled: true',
  'provider:',
  'disabledEndpoints',
  'enabledEndpoints',
  'demo-token-endpoint-enabled',
  'fail-fast-weak-jwt-secret',
];

const JAVA_KEYWORDS = new Set([
  'package', 'import', 'public', 'private', 'protected', 'class', 'interface',
  'extends', 'implements', 'final', 'static', 'void', 'return', 'new', 'default',
  'boolean', 'int', 'long', 'double', 'true', 'false', 'null', 'const', 'let',
  'async', 'await', 'function', 'from', 'type', 'input', 'scalar',
]);

const highlightSingleLine = (line: string): React.ReactNode => {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return <span className="tok-comment">{line}</span>;
  }

  // Split by strings, annotations, words, and numbers
  const tokenRegex = /(".*?"|'.*?'|@[A-Za-z0-9_]+|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?[Ll]?\b)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith('@')) {
      parts.push(<span key={key} className="tok-annotation">{token}</span>);
    } else if (token.startsWith('"') || token.startsWith("'")) {
      parts.push(<span key={key} className="tok-string">{token}</span>);
    } else if (JAVA_KEYWORDS.has(token)) {
      parts.push(<span key={key} className="tok-keyword">{token}</span>);
    } else if (/^\d/.test(token)) {
      parts.push(<span key={key} className="tok-number">{token}</span>);
    } else if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
      parts.push(<span key={key} className="tok-type">{token}</span>);
    } else {
      parts.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    const rest = line.slice(lastIndex);
    const commentIdx = rest.indexOf('//');
    if (commentIdx >= 0) {
      parts.push(rest.slice(0, commentIdx));
      parts.push(<span key="inline-comment" className="tok-comment">{rest.slice(commentIdx)}</span>);
    } else {
      parts.push(rest);
    }
  }

  return parts;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'java',
  fileName,
  title,
  highlightLines = [],
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');
  const hasAutoFocus = lines.some((l) => FOCUS_PATTERNS.some((p) => l.includes(p)));

  return (
    <div className="code-container">
      <div className="code-header">
        <div className="code-header-left">
          <div className="code-dots">
            <span className="code-dot" style={{ background: '#f43f5e' }} />
            <span className="code-dot" style={{ background: '#fbbf24' }} />
            <span className="code-dot" style={{ background: '#34d399' }} />
          </div>
          <FileCode2 size={14} style={{ color: '#38bdf8' }} />
          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
            {title || fileName || language.toUpperCase()}
          </span>
          <span className="code-lang-pill">{language}</span>
          {hasAutoFocus && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.68rem',
                color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: 4,
                padding: '0.1rem 0.4rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={11} /> Focus Highlighted
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(52, 211, 153, 0.15)' : 'rgba(30, 41, 59, 0.8)',
            border: copied ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid #334155',
            borderRadius: 6,
            padding: '0.25rem 0.6rem',
            color: copied ? '#34d399' : '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.74rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <pre className="code-body">
        <code>
          {lines.map((line, idx) => {
            const lineNumber = idx + 1;
            const isFocused =
              highlightLines.includes(lineNumber) ||
              FOCUS_PATTERNS.some((pattern) => line.includes(pattern));
            return (
              <div
                key={lineNumber}
                className={`code-line ${isFocused ? 'code-line-focus' : ''}`}
              >
                <span className="code-line-number">{lineNumber}</span>
                <span className="code-line-text">{highlightSingleLine(line)}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};
