import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS, NAVIGATION_STAGES } from '../data/navigation';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { OPERATORS_DATA } from '../data/operatorsData';
import { UI_CONTROLS, UI_LABELS, pickText } from '../data/locales';
import { CATEGORY_TO_TOPIC_ID } from '../pages/AnnotationsPage';
import { ENDPOINT_GROUP_TO_TOPIC_ID } from '../pages/EndpointsPage';

interface SearchEntry {
  id: string;
  targetPageId: string;
  targetSelection?: string;
  category: string;
  title: string;
  subtitle: string;
  searchTokens: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectResult: (pageId: string, targetSelection?: string) => void;
}

function renderHighlighted(text: string, query: string): React.ReactNode {
  const q = query.trim();
  if (!q) {
    return text;
  }
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) {
    return text;
  }
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <>
      {before}
      <mark className="search-mark">{match}</mark>
      {after}
    </>
  );
}

function scoreEntry(entry: SearchEntry, query: string): number {
  const titleLower = entry.title.toLowerCase();
  const titleNorm = titleLower.replace(/^[@./]/, '');
  const subLower = entry.subtitle.toLowerCase();
  const catLower = entry.category.toLowerCase();

  if (titleLower === query || titleNorm === query) {
    return 120;
  }
  if (titleLower.startsWith(query) || titleNorm.startsWith(query)) {
    return 100;
  }
  const wordRe = new RegExp(`(?:^|[\\s\\-_/(.@])${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
  if (wordRe.test(titleLower)) {
    return 75;
  }
  if (titleLower.includes(query)) {
    return 50;
  }
  if (entry.searchTokens.includes(query)) {
    return 30;
  }
  if (subLower.includes(query)) {
    return 15;
  }
  if (catLower.includes(query)) {
    return 10;
  }
  return 0;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  currentLang,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const entries = useMemo<SearchEntry[]>(() => {
    const stageTitleById = new Map(
      NAVIGATION_STAGES.map((st) => [st.id, `${pickText(st.title, currentLang)} ${st.title.en}`]),
    );
    const topicItems: SearchEntry[] = ALL_NAV_ITEMS.map((item) => {
      const label = pickText(item.label, currentLang);
      const summary = pickText(item.summary, currentLang);
      const stageContext = stageTitleById.get(item.stageId) ?? '';
      return {
        id: `topic-${item.id}`,
        targetPageId: item.id,
        category: pickText(UI_CONTROLS.searchCatGuide, currentLang),
        title: label,
        subtitle: summary,
        searchTokens: `${label} ${summary} ${stageContext} ${item.label.en} ${item.summary.en} ${item.keywords.join(' ')}`.toLowerCase(),
      };
    });

    const annotationItems: SearchEntry[] = ANNOTATIONS_DATA.map((ann) => {
      const purpose = pickText(ann.purpose, currentLang);
      const howTo = pickText(ann.howToUse, currentLang);
      const attrNames = ann.attributeSpecs
        .map((a) => `${a.name} ${a.defaultValue} ${a.example} ${pickText(a.allowedValues, currentLang)}`)
        .join(' ');
      return {
        id: `ann-${ann.name}`,
        targetPageId: CATEGORY_TO_TOPIC_ID[ann.category],
        targetSelection: ann.name,
        category: pickText(UI_CONTROLS.searchCatAnnotation, currentLang),
        title: ann.name,
        subtitle: purpose,
        searchTokens: `${ann.name} ${ann.packageName} ${purpose} ${ann.purpose.en} ${howTo} ${attrNames}`.toLowerCase(),
      };
    });

    const endpointItems: SearchEntry[] = ENDPOINTS_DATA.map((ep) => {
      const summary = pickText(ep.summary, currentLang);
      return {
        id: `ep-${ep.id}`,
        targetPageId: ENDPOINT_GROUP_TO_TOPIC_ID[ep.group],
        targetSelection: ep.id,
        category: ep.method,
        title: `${ep.method} ${ep.path || '/'} (${ep.methodName})`,
        subtitle: summary,
        searchTokens: `${ep.method} ${ep.path} ${ep.methodName} ${summary} ${ep.summary.en}`.toLowerCase(),
      };
    });

    const operatorItems: SearchEntry[] = OPERATORS_DATA.map((op) => {
      const desc = pickText(op.description, currentLang);
      return {
        id: `op-${op.operator}`,
        targetPageId: 'query-operators',
        category: pickText(UI_CONTROLS.searchCatOperator, currentLang),
        title: `.${op.operator} (${op.syntax})`,
        subtitle: `${op.sqlEquivalent} · ${desc}`,
        searchTokens: `${op.operator} ${op.syntax} ${op.sqlEquivalent} ${desc} ${op.description.en}`.toLowerCase(),
      };
    });

    return [...topicItems, ...annotationItems, ...endpointItems, ...operatorItems];
  }, [currentLang]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return entries.slice(0, 10);
    }
    return entries
      .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
      .map((item) => item.entry);
  }, [entries, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, filtered.length]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const activeEl = resultRefs.current[activeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  if (!open) {
    return null;
  }

  const selectEntry = (item: SearchEntry) => {
    onSelectResult(item.targetPageId, item.targetSelection);
    onClose();
  };

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev + 1) % filtered.length);
      }
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      }
      return;
    }
    if (event.key === 'Enter' && filtered.length > 0) {
      event.preventDefault();
      selectEntry(filtered[Math.min(activeIndex, filtered.length - 1)]);
      return;
    }
    if (event.key === 'Tab' && modalRef.current) {
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div
      className="search-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={pickText(UI_CONTROLS.searchAriaLabel, currentLang)}
      onClick={onClose}
      onKeyDown={handleModalKeyDown}
    >
      <div
        ref={modalRef}
        className="search-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="search-modal-input-row">
          <Search size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            id="docs-search-modal-input"
            name="docs-search-modal-input"
            type="text"
            className="search-modal-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={pickText(UI_LABELS.searchModalHint, currentLang)}
            aria-label={pickText(UI_CONTROLS.searchAriaLabel, currentLang)}
          />
          {query && (
            <button
              type="button"
              className="nav-icon-btn search-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label={pickText(UI_CONTROLS.clearFilterLabel, currentLang)}
            >
              <X size={13} />
            </button>
          )}
          <button
            type="button"
            className="search-esc-btn"
            onClick={onClose}
            aria-label={pickText(UI_CONTROLS.closeSearchLabel, currentLang)}
          >
            <kbd>ESC</kbd>
          </button>
        </div>

        <div className="search-results-list" role="listbox">
          {filtered.length === 0 ? (
            <div className="search-empty-chibi">
              <svg
                width="68"
                height="68"
                viewBox="0 0 96 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="14" y="20" width="68" height="56" rx="14" stroke="#22D3EE" strokeWidth="2.5" fill="rgba(34,211,238,0.08)" />
                <path d="M22 20L32 10H64L74 20" stroke="#FF3B8B" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="36" cy="46" r="5" fill="#FF3B8B" />
                <circle cx="60" cy="46" r="5" fill="#22D3EE" />
                <path d="M38 61C42 57 54 57 58 61" stroke="#FF3B8B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span>{pickText(UI_LABELS.searchNoResults, currentLang)}</span>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    resultRefs.current[idx] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`search-result-btn ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectEntry(item)}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem', flexWrap: 'wrap' }}>
                      <span className="sidebar-item-badge">{item.category}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', overflowWrap: 'anywhere' }}>
                        {renderHighlighted(item.title, query)}
                      </span>
                    </div>
                    <div
                      className="search-result-meta"
                      style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {renderHighlighted(item.subtitle, query)}
                    </div>
                  </div>
                  <ArrowRight size={15} className="rtl-flip-icon" style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </button>
              );
            })
          )}
        </div>

        <div className="search-modal-footer">
          <span className="search-footer-hint">
            <kbd>↑↓</kbd>
            <span>{pickText(UI_CONTROLS.searchFooterNav, currentLang)}</span>
          </span>
          <span className="search-footer-hint">
            <kbd>↵</kbd>
            <span>{pickText(UI_CONTROLS.searchFooterOpen, currentLang)}</span>
          </span>
          <span className="search-footer-hint">
            <kbd>ESC</kbd>
            <span>{pickText(UI_CONTROLS.searchFooterClose, currentLang)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
