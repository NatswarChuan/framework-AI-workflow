import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS } from '../data/navigation';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { OPERATORS_DATA } from '../data/operatorsData';
import { UI_LABELS, pickText } from '../data/locales';

interface SearchEntry {
  id: string;
  targetPageId: string;
  category: string;
  title: string;
  subtitle: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectPage: (pageId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  currentLang,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const entries = useMemo<SearchEntry[]>(() => {
    const topicItems: SearchEntry[] = ALL_NAV_ITEMS.map((item) => ({
      id: `topic-${item.id}`,
      targetPageId: item.id,
      category: 'Guide',
      title: pickText(item.label, currentLang),
      subtitle: `${pickText(item.summary, currentLang)} ${item.keywords.join(' ')}`,
    }));

    const annotationItems: SearchEntry[] = ANNOTATIONS_DATA.map((ann) => ({
      id: `ann-${ann.name}`,
      targetPageId: ann.name === '@ServiceOverride' ? 'escape-hatch' : 'annotations',
      category: 'Annotation',
      title: ann.name,
      subtitle: `${pickText(ann.purpose, currentLang)} · ${ann.attributes}`,
    }));

    const endpointItems: SearchEntry[] = ENDPOINTS_DATA.map((ep) => ({
      id: `ep-${ep.id}`,
      targetPageId: 'endpoints',
      category: ep.method,
      title: `${ep.method} ${ep.path || '/'} (${ep.methodName})`,
      subtitle: pickText(ep.summary, currentLang),
    }));

    const operatorItems: SearchEntry[] = OPERATORS_DATA.map((op) => ({
      id: `op-${op.operator}`,
      targetPageId: 'query-operators',
      category: 'Operator',
      title: `.${op.operator} (${op.syntax})`,
      subtitle: `${op.sqlEquivalent} · ${pickText(op.description, currentLang)}`,
    }));

    return [...topicItems, ...annotationItems, ...endpointItems, ...operatorItems];
  }, [currentLang]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return entries.slice(0, 10);
    }
    return entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(trimmed) ||
          entry.subtitle.toLowerCase().includes(trimmed) ||
          entry.category.toLowerCase().includes(trimmed)
      )
      .slice(0, 14);
  }, [entries, query]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="search-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Documentation Search"
      onClick={onClose}
    >
      <div className="search-modal" onClick={(event) => event.stopPropagation()}>
        <div className="search-modal-input-row">
          <Search size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            id="docs-search-modal-input"
            type="text"
            className="search-modal-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={pickText(UI_LABELS.searchModalHint, currentLang)}
          />
          <button
            type="button"
            className="nav-icon-btn"
            style={{ height: '30px', paddingInline: '0.45rem' }}
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={15} />
          </button>
        </div>

        <div className="search-results-list">
          {filtered.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {pickText(UI_LABELS.searchNoResults, currentLang)}
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                className="search-result-btn"
                onClick={() => {
                  onSelectPage(item.targetPageId);
                  onClose();
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.15rem' }}>
                    <span className="sidebar-item-badge">{item.category}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
                  </div>
                  <div
                    className="search-result-meta"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {item.subtitle}
                  </div>
                </div>
                <ArrowRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
