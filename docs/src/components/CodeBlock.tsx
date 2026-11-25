import React, { useEffect, useRef, useState } from 'react';
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
  const copyTimerRef = useRef<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeTab = tabs?.find((t) => t.id === activeTabId) ?? tabs?.[0];
  const displayCode = activeTab ? activeTab.code : code;
  const displayLang = activeTab ? activeTab.language : language;
  const displayFile = activeTab ? activeTab.fileName : fileName;
  const displayHighlights = activeTab?.highlightLines ?? highlightLines;

  useEffect(() => {
    setCopied(false);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = null;
    }
  }, [displayCode]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const lines = displayCode.replace(/\r\n/g, '\n').split('\n');

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayCode).catch(() => {});
    }
    setCopied(true);
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 1600);
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (!tabs || tabs.length < 2) {
      return;
    }
    let nextIdx = -1;
    if (event.key === 'ArrowRight') {
      nextIdx = (idx + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + tabs.length) % tabs.length;
    }
    if (nextIdx >= 0) {
      event.preventDefault();
      setActiveTabId(tabs[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div className="code-block-shell">
      <div className="code-block-header">
        {tabs && tabs.length > 0 ? (
          <div className="code-tabs" role="tablist">
            {tabs.map((tab, idx) => (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                dir="auto"
                aria-selected={tab.id === activeTab?.id}
                tabIndex={tab.id === activeTab?.id ? 0 : -1}
                className={`code-tab-btn ${tab.id === activeTab?.id ? 'active' : ''}`}
                onClick={() => setActiveTabId(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="code-file-meta">
            <FileCode size={14} style={{ color: '#34d399', flexShrink: 0 }} />
            <span className="code-file-name">{displayFile ?? displayLang}</span>
          </div>
        )}

        <div className="code-header-actions">
          {tabs && tabs.length > 0 && displayFile && (
            <span className="code-file-meta code-tab-filename">
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
