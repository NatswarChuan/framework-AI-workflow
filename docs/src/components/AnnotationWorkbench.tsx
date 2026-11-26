import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ListFilter,
  Search,
  X,
} from 'lucide-react';
import { AnnotationSpec, FullLocalizedText, SupportedLanguage } from '../types/docs';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { CodeBlock } from './CodeBlock';
import { RichDocText } from './RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';
import { HUB_CONTENT } from '../data/hubContent';

interface AnnotationWorkbenchProps {
  currentLang: SupportedLanguage;
  activeCategory: 'all' | AnnotationSpec['category'];
  initialAnnotationName?: string;
  onSelectCategory: (category: 'all' | AnnotationSpec['category']) => void;
}

const CATEGORY_TABS: Array<{
  id: 'all' | AnnotationSpec['category'];
  label: FullLocalizedText;
}> = [
  { id: 'all', label: UI_CONTROLS.annFilterAll },
  { id: 'routing', label: UI_CONTROLS.annCatRouting },
  { id: 'bean', label: UI_CONTROLS.annCatBean },
  { id: 'entity', label: UI_CONTROLS.annCatEntity },
  { id: 'rbac', label: UI_CONTROLS.annCatRbac },
  { id: 'resilience', label: UI_CONTROLS.annCatResilience },
];

export const AnnotationWorkbench: React.FC<AnnotationWorkbenchProps> = ({
  currentLang,
  activeCategory,
  initialAnnotationName,
  onSelectCategory,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedName, setSelectedName] = useState<string>(
    initialAnnotationName && ANNOTATIONS_DATA.some((i) => i.name === initialAnnotationName)
      ? initialAnnotationName
      : ANNOTATIONS_DATA[0].name,
  );
  const [expandedAttrs, setExpandedAttrs] = useState<Record<string, boolean>>({});
  const [copiedImport, setCopiedImport] = useState(false);
  const importCopyTimerRef = useRef<number | null>(null);
  const listItemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const countsByCategory = useMemo(() => {
    const counts: Record<'all' | AnnotationSpec['category'], number> = {
      all: ANNOTATIONS_DATA.length,
      routing: 0,
      bean: 0,
      entity: 0,
      rbac: 0,
      resilience: 0,
    };
    for (const item of ANNOTATIONS_DATA) {
      counts[item.category] += 1;
    }
    return counts;
  }, []);

  const categoryScoped = useMemo(() => {
    if (activeCategory === 'all') {
      return ANNOTATIONS_DATA;
    }
    return ANNOTATIONS_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    setFilterText('');
    if (initialAnnotationName && categoryScoped.some((i) => i.name === initialAnnotationName)) {
      setSelectedName(initialAnnotationName);
    } else if (!categoryScoped.some((i) => i.name === selectedName)) {
      setSelectedName(categoryScoped[0]?.name ?? ANNOTATIONS_DATA[0].name);
    }
  }, [activeCategory, initialAnnotationName, categoryScoped]);

  useEffect(() => {
    setExpandedAttrs({});
    setCopiedImport(false);
    if (importCopyTimerRef.current !== null) {
      window.clearTimeout(importCopyTimerRef.current);
      importCopyTimerRef.current = null;
    }
  }, [selectedName]);

  useEffect(() => {
    return () => {
      if (importCopyTimerRef.current !== null) {
        window.clearTimeout(importCopyTimerRef.current);
      }
    };
  }, []);

  const visibleItems = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) {
      return categoryScoped;
    }
    return categoryScoped.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.packageName.toLowerCase().includes(q) ||
        item.attributes.toLowerCase().includes(q) ||
        pickText(item.purpose, currentLang).toLowerCase().includes(q) ||
        item.attributeSpecs.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            pickText(a.description, currentLang).toLowerCase().includes(q),
        ),
    );
  }, [categoryScoped, filterText, currentLang]);

  const activeSpec =
    visibleItems.find((item) => item.name === selectedName) ??
    visibleItems[0] ??
    categoryScoped[0] ??
    ANNOTATIONS_DATA[0];

  const activeIndex = visibleItems.findIndex((item) => item.name === activeSpec.name);
  const prevSpec = activeIndex > 0 ? visibleItems[activeIndex - 1] : null;
  const nextSpec =
    activeIndex >= 0 && activeIndex < visibleItems.length - 1
      ? visibleItems[activeIndex + 1]
      : null;

  const importStatement = `import ${activeSpec.packageName}.${activeSpec.name.replace('@', '')};`;

  const handleCopyImport = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(importStatement).catch(() => {});
    }
    setCopiedImport(true);
    if (importCopyTimerRef.current !== null) {
      window.clearTimeout(importCopyTimerRef.current);
    }
    importCopyTimerRef.current = window.setTimeout(() => {
      setCopiedImport(false);
      importCopyTimerRef.current = null;
    }, 1600);
  };

  const handleSelectAnnotation = (name: string, scrollDetailIntoView = false) => {
    setSelectedName(name);
    if (scrollDetailIntoView) {
      window.setTimeout(() => {
        const card = document.getElementById('annotation-detail-card');
        if (card) {
          const rect = card.getBoundingClientRect();
          if (rect.top < 72) {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 25);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (visibleItems.length < 2) {
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIdx = (idx + 1) % visibleItems.length;
      setSelectedName(visibleItems[nextIdx].name);
      listItemRefs.current[nextIdx]?.focus();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIdx = (idx - 1 + visibleItems.length) % visibleItems.length;
      setSelectedName(visibleItems[prevIdx].name);
      listItemRefs.current[prevIdx]?.focus();
    }
  };

  const toggleAttribute = (attrName: string) => {
    setExpandedAttrs((prev) => ({
      ...prev,
      [attrName]: !prev[attrName],
    }));
  };

  return (
    <section className="ann-workbench">
      <div className="ann-workbench-toolbar">
        <div className="ann-cat-tabs" role="tablist" aria-label={pickText(UI_CONTROLS.colGroup, currentLang)}>
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.id === activeCategory;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`ann-cat-tab ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(tab.id)}
              >
                <span>{pickText(tab.label, currentLang)}</span>
                <span className="ann-cat-tab-count" dir="ltr">
                  {countsByCategory[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="ann-toolbar-search">
          <Search size={15} className="hub-search-icon" aria-hidden="true" />
          <input
            id={`ann-workbench-search-${activeCategory}`}
            name={`ann-workbench-search-${activeCategory}`}
            type="text"
            className="filter-input hub-search-input"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={pickText(UI_CONTROLS.annSearchPlaceholder, currentLang)}
            aria-label={pickText(UI_CONTROLS.annSearchPlaceholder, currentLang)}
          />
          {filterText && (
            <button
              type="button"
              className="filter-clear-btn"
              onClick={() => setFilterText('')}
              aria-label={pickText(UI_CONTROLS.clearFilterLabel, currentLang)}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="ann-workbench-grid">
        <nav
          className="ann-list-pane"
          aria-label={pickText(HUB_CONTENT.pickAnnotationTitle, currentLang)}
        >
          {visibleItems.length === 0 ? (
            <div className="hub-empty-msg">{pickText(UI_CONTROLS.annNoMatch, currentLang)}</div>
          ) : (
            visibleItems.map((item, idx) => {
              const isSelected = item.name === activeSpec.name;
              return (
                <button
                  key={item.name}
                  ref={(el) => {
                    listItemRefs.current[idx] = el;
                  }}
                  type="button"
                  data-ann-item={item.name}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`ann-list-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectAnnotation(item.name, false)}
                  onKeyDown={(event) => handleListKeyDown(event, idx)}
                >
                  <span className="ann-list-name" dir="ltr">
                    {item.name}
                  </span>
                  {item.attributeSpecs.length > 0 && (
                    <span className="ann-list-attr-num" dir="ltr">
                      {item.attributeSpecs.length}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </nav>

        <div id="annotation-detail-card" className="ann-detail-pane">
          <div className="ann-detail-header">
            <div className="ann-detail-title-wrap">
              <h2 className="ann-detail-title">
                <code>{activeSpec.name}</code>
              </h2>
              <div className="ann-meta-strip" dir="ltr">
                <span>@Target({activeSpec.target})</span>
                <span className="ann-meta-sep" aria-hidden="true">/</span>
                <span>{activeSpec.packageName}</span>
              </div>
            </div>

            <button
              type="button"
              className={`ann-copy-import-btn ${copiedImport ? 'copied' : ''}`}
              onClick={handleCopyImport}
              title={importStatement}
            >
              {copiedImport ? <Check size={13} /> : <Copy size={13} />}
              <span>
                {copiedImport
                  ? pickText(UI_LABELS.copied, currentLang)
                  : pickText(UI_CONTROLS.copyImportLabel, currentLang)}
              </span>
            </button>
          </div>

          <p className="ann-purpose-lead">
            <RichDocText text={activeSpec.purpose} currentLang={currentLang} />
          </p>

          <CodeBlock
            currentLang={currentLang}
            language="java"
            fileName={`${activeSpec.name.replace('@', '')}Usage.java`}
            code={activeSpec.syntaxSample}
          />

          <section className="ann-attr-section">
            <div className="ann-attr-section-head">
              <h3>{pickText(STAGE2_CONTENT.annAttrTableTitle, currentLang)}</h3>
              {activeSpec.attributeSpecs.length > 0 ? (
                <span className="ann-attr-count-chip" dir="ltr">
                  {activeSpec.attributeSpecs.length} {pickText(UI_CONTROLS.attrCountSuffix, currentLang)}
                </span>
              ) : (
                <span className="ann-attr-count-chip">
                  {pickText(UI_CONTROLS.badgeMarker, currentLang)}
                </span>
              )}
            </div>

            {activeSpec.attributeSpecs.length === 0 ? (
              <p className="ann-marker-note">
                <RichDocText text={STAGE2_CONTENT.annNoAttributesNote} currentLang={currentLang} />
              </p>
            ) : (
              <div className="ann-attr-accordion">
                {activeSpec.attributeSpecs.map((attr) => {
                  const isOpen = Boolean(expandedAttrs[attr.name]);
                  return (
                    <div key={attr.name} className={`ann-attr-row ${isOpen ? 'is-expanded' : ''}`}>
                      <button
                        type="button"
                        className="ann-attr-summary-btn"
                        aria-expanded={isOpen}
                        onClick={() => toggleAttribute(attr.name)}
                      >
                        <div className="ann-attr-summary-top">
                          <span className="ann-attr-summary-left" dir="ltr">
                            <code className="ann-attr-key">{attr.name}</code>
                            <code className="ann-attr-type">{attr.type}</code>
                            <span
                              className={`ann-attr-req-tag ${attr.required ? 'is-required' : 'is-optional'}`}
                            >
                              {pickText(
                                attr.required ? UI_CONTROLS.badgeRequired : UI_CONTROLS.badgeOptional,
                                currentLang,
                              )}
                            </span>
                          </span>
                          <span className="ann-attr-summary-right">
                            <span className="ann-attr-default-wrap" dir="ltr">
                              <span className="ann-attr-default-lbl">
                                {pickText(UI_CONTROLS.colAttrDefault, currentLang)}:
                              </span>
                              <code className="ann-attr-default-val">{attr.defaultValue}</code>
                            </span>
                            <span className="ann-attr-toggle-pill">
                              <span>{pickText(UI_CONTROLS.attrDetailsToggle, currentLang)}</span>
                              <ChevronDown size={13} className="ann-attr-chevron" />
                            </span>
                          </span>
                        </div>
                        <div className="ann-attr-summary-desc">
                          <RichDocText text={attr.description} currentLang={currentLang} />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="ann-attr-drawer">
                          <div className="attr-spec-details-grid">
                            <div className="attr-detail-box">
                              <div className="attr-detail-title">
                                <ListFilter size={13} />
                                <span>{pickText(UI_CONTROLS.attrAllowedValuesLabel, currentLang)}</span>
                              </div>
                              <div className="attr-detail-content">
                                <RichDocText text={attr.allowedValues} currentLang={currentLang} />
                              </div>
                            </div>

                            <div className="attr-detail-box">
                              <div className="attr-detail-title">
                                <Code2 size={13} />
                                <span>{pickText(UI_CONTROLS.attrExampleLabel, currentLang)}</span>
                              </div>
                              <div className="attr-example-strip" dir="ltr">
                                <code>{attr.example}</code>
                              </div>
                            </div>
                          </div>

                          <div className="attr-caveat-bar">
                            <AlertTriangle size={14} className="attr-caveat-icon" />
                            <div>
                              <strong className="attr-caveat-label">
                                {pickText(UI_CONTROLS.attrCaveatLabel, currentLang)}:{' '}
                              </strong>
                              <RichDocText text={attr.caveat} currentLang={currentLang} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="ann-guidance-grid">
            <div className="ann-guide-card guide-do">
              <div className="ann-guide-card-head">
                <CheckCircle2 size={15} aria-hidden="true" />
                <span>{pickText(STAGE2_CONTENT.annWhenToUseLabel, currentLang)}</span>
              </div>
              <p>
                <RichDocText text={activeSpec.whenToUse} currentLang={currentLang} />
              </p>
            </div>

            <div className="ann-guide-card guide-avoid">
              <div className="ann-guide-card-head">
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{pickText(STAGE2_CONTENT.annWhenNotToUseLabel, currentLang)}</span>
              </div>
              <p>
                <RichDocText text={activeSpec.whenNotToUse} currentLang={currentLang} />
              </p>
            </div>
          </div>

          <div className="ann-notes-compact">
            <div>
              <strong>{pickText(STAGE2_CONTENT.annBehaviorLabel, currentLang)}:</strong>{' '}
              <RichDocText text={activeSpec.runtimeBehavior} currentLang={currentLang} />
            </div>
            <div>
              <strong>{pickText(STAGE2_CONTENT.annHowToUseLabel, currentLang)}:</strong>{' '}
              <RichDocText text={activeSpec.howToUse} currentLang={currentLang} />
            </div>
          </div>

          <div className="in-group-nav">
            {prevSpec ? (
              <button
                type="button"
                className="filter-pill-btn"
                onClick={() => handleSelectAnnotation(prevSpec.name, true)}
              >
                <ChevronLeft size={14} className="rtl-flip-icon" />
                <span>
                  {pickText(HUB_CONTENT.prevInGroup, currentLang)}: <code>{prevSpec.name}</code>
                </span>
              </button>
            ) : (
              <span />
            )}
            {nextSpec && (
              <button
                type="button"
                className="filter-pill-btn active"
                onClick={() => handleSelectAnnotation(nextSpec.name, true)}
              >
                <span>
                  {pickText(HUB_CONTENT.nextInGroup, currentLang)}: <code>{nextSpec.name}</code>
                </span>
                <ChevronRight size={14} className="rtl-flip-icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
