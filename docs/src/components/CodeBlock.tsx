import React, { useState } from 'react';
import { Check, Copy, FileCode } from 'lucide-react';
import { CodeTab, SupportedLanguage } from '../types/docs';
import { UI_LABELS, pickText } from '../data/locales';

interface CodeBlockProps {
  code?: string;
  language?: string;
  fileName?: string;
  highlightLines?: number[];
  tabs?: CodeTab[];
  currentLang?: SupportedLanguage;
}

const JAVA_KEYWORDS = new Set([
  'public',
  'private',
  'protected',
  'class',
  'interface',
  'extends',
  'implements',
  'return',
  'import',
  'package',
  'final',
  'static',
  'void',
  'boolean',
  'int',
  'long',
  'true',
  'false',
  'null',
  'if',
  'else',
  'throw',
  'new',
  'async',
  'await',
  'export',
  'const',
  'type',
  'scalar',
]);

function highlightLineTokens(line: string, lineIdx: number): React.ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return <span className="tok-comment">{line}</span>;
  }

  const tokenPattern =
    /(@[A-Za-z_]\w*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+(?:\.\d+)?L?)\b|\b([A-Za-z_]\w*)\b/g;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = tokenPattern.exec(line);
  let tokenCounter = 0;

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push(line.slice(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const key = `l${lineIdx}-t${tokenCounter++}`;

    if (match[1]) {
      nodes.push(<span key={key} className="tok-annotation">{fullMatch}</span>);
    } else if (match[2]) {
      nodes.push(<span key={key} className="tok-string">{fullMatch}</span>);
    } else if (match[3]) {
      nodes.push(<span key={key} className="tok-number">{fullMatch}</span>);
    } else if (match[4]) {
      if (JAVA_KEYWORDS.has(fullMatch)) {
        nodes.push(<span key={key} className="tok-keyword">{fullMatch}</span>);
      } else if (/^[A-Z]/.test(fullMatch)) {
        nodes.push(<span key={key} className="tok-type">{fullMatch}</span>);
      } else {
        nodes.push(fullMatch);
      }
    }

    lastIndex = match.index + fullMatch.length;
    match = tokenPattern.exec(line);
  }

  if (lastIndex < line.length) {
    nodes.push(line.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : ' ';
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code = '',
  language = 'java',
  fileName,
  highlightLines = [],
  tabs,
  currentLang = 'en',
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs && tabs.length > 0 ? tabs[0].id : '');
  const [copied, setCopied] = useState(false);

  const activeTab = tabs?.find((t) => t.id === activeTabId) ?? tabs?.[0];
  const displayCode = activeTab ? activeTab.code : code;
  const displayLang = activeTab ? activeTab.language : language;
  const displayFile = activeTab ? activeTab.fileName : fileName;
  const displayHighlights = activeTab?.highlightLines ?? highlightLines;

  const lines = displayCode.replace(/\r\n/g, '\n').split('\n');

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayCode).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block-shell">
      <div className="code-block-header">
        {tabs && tabs.length > 0 ? (
          <div className="code-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={tab.id === activeTab?.id}
                className={`code-tab-btn ${tab.id === activeTab?.id ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="code-file-meta">
            <FileCode size={14} style={{ color: '#34d399' }} />
            <span>{displayFile ?? displayLang}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {tabs && tabs.length > 0 && displayFile && (
            <span className="code-file-meta" style={{ fontSize: '0.72rem' }}>
              {displayFile}
            </span>
          )}
          <button
            type="button"
            className="copy-code-btn"
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>
              {copied
                ? pickText(UI_LABELS.copied, currentLang)
                : pickText(UI_LABELS.copy, currentLang)}
            </span>
          </button>
        </div>
      </div>

      <div className="code-scroll-area">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = displayHighlights.includes(lineNumber);
          return (
            <div key={lineNumber} className={`code-line ${isHighlighted ? 'highlighted' : ''}`}>
              <span className="code-line-num">{lineNumber}</span>
              <span className="code-line-text">{highlightLineTokens(line, index)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
