import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  ListFilter,
  X,
} from 'lucide-react';
import { AnnotationSpec, FullLocalizedText, SupportedLanguage } from '../types/docs';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';
import { HUB_CONTENT } from '../data/hubContent';

interface AnnotationCategoryPageProps {
  topicId: string;
  category: AnnotationSpec['category'];
  currentLang: SupportedLanguage;
  initialAnnotationName?: string;
  onNavigateTopic: (topicId: string) => void;
}

const CATEGORY_BADGE: Record<AnnotationSpec['category'], string> = {
  routing: 'badge badge-emerald',
  bean: 'badge badge-blue',
  entity: 'badge badge-purple',
  rbac: 'badge badge-rose',
  resilience: 'badge badge-amber',
};

const CATEGORY_LABELS: Record<AnnotationSpec['category'], FullLocalizedText> = {
  routing: UI_CONTROLS.annCatRouting,
  bean: UI_CONTROLS.annCatBean,
  entity: UI_CONTROLS.annCatEntity,
  rbac: UI_CONTROLS.annCatRbac,
  resilience: UI_CONTROLS.annCatResilience,
};

const CATEGORY_PLAIN_INTRO: Record<AnnotationSpec['category'], FullLocalizedText> = {
  routing: HUB_CONTENT.catRoutingPlain,
  bean: HUB_CONTENT.catBeanPlain,
  entity: HUB_CONTENT.catEntityPlain,
  rbac: HUB_CONTENT.catRbacPlain,
  resilience: HUB_CONTENT.catResiliencePlain,
};

export const AnnotationCategoryPage: React.FC<AnnotationCategoryPageProps> = ({
  topicId,
  category,
  currentLang,
  initialAnnotationName,
  onNavigateTopic,
}) => {
  const categoryItems = useMemo(
    () => ANNOTATIONS_DATA.filter((item) => item.category === category),
    [category],
  );

  const [filterText, setFilterText] = useState('');
  const [selectedName, setSelectedName] = useState<string>(
    initialAnnotationName && categoryItems.some((i) => i.name === initialAnnotationName)
      ? initialAnnotationName
      : categoryItems[0].name,
  );

  useEffect(() => {
    setFilterText('');
    if (initialAnnotationName && categoryItems.some((i) => i.name === initialAnnotationName)) {
      setSelectedName(initialAnnotationName);
    } else if (!categoryItems.some((i) => i.name === selectedName)) {
      setSelectedName(categoryItems[0].name);
    }
  }, [category, initialAnnotationName, categoryItems]);

  const visibleItems = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) {
      return categoryItems;
    }
    return categoryItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.attributes.toLowerCase().includes(q) ||
        pickText(item.purpose, currentLang).toLowerCase().includes(q) ||
        item.attributeSpecs.some(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            pickText(a.description, currentLang).toLowerCase().includes(q) ||
            pickText(a.allowedValues, currentLang).toLowerCase().includes(q),
        ),
    );
  }, [categoryItems, filterText, currentLang]);

  const activeSpec =
    visibleItems.find((item) => item.name === selectedName) ?? visibleItems[0] ?? categoryItems[0];

  const activeIndex = categoryItems.findIndex((item) => item.name === activeSpec.name);
  const prevSpec = activeIndex > 0 ? categoryItems[activeIndex - 1] : null;
  const nextSpec =
    activeIndex >= 0 && activeIndex < categoryItems.length - 1
      ? categoryItems[activeIndex + 1]
      : null;

  const selectAndScroll = (name: string) => {
    setSelectedName(name);
    window.setTimeout(() => {
      const target = document.getElementById('annotation-detail-card');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 25);
  };

  return (
    <article className="doc-page">
      <button
        type="button"
        className="back-hub-link"
        onClick={() => onNavigateTopic('annotations')}
      >
        <ArrowLeft size={14} className="rtl-flip-icon" />
        <span>{pickText(HUB_CONTENT.backToAnnotationsHub, currentLang)}</span>
      </button>

      <DocPageHeader
        topicId={topicId}
        currentLang={currentLang}
        onNavigateTopic={onNavigateTopic}
        badges={[
          {
            label: `${categoryItems.length} ${pickText(HUB_CONTENT.annotationsUnit, currentLang)}`,
            tone: 'emerald',
          },
          { label: pickText(CATEGORY_LABELS[category], currentLang), tone: 'blue' },
        ]}
      />

      <section className="plain-guide-box">
        <div className="plain-guide-header">
          <BookOpen size={16} />
          <span>{pickText(HUB_CONTENT.plainTermsTitle, currentLang)}</span>
        </div>
        <p className="plain-guide-body">
          <RichDocText text={CATEGORY_PLAIN_INTRO[category]} currentLang={currentLang} />
        </p>
      </section>

      <h2 id="category-picker" className="section-heading">
        {pickText(HUB_CONTENT.pickAnnotationTitle, currentLang)}
      </h2>

      <div className="filter-bar">
        <div className="filter-search-row">
          <input
            id={`filter-${topicId}`}
            name={`filter-${topicId}`}
            type="text"
            className="filter-input"
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

      <div className="category-pill-grid">
        {visibleItems.length === 0 ? (
          <div className="hub-empty-msg">
            {pickText(UI_CONTROLS.annNoMatch, currentLang)}
          </div>
        ) : (
          visibleItems.map((item) => {
            const isActive = item.name === activeSpec.name;
            return (
              <button
                key={item.name}
                type="button"
                aria-pressed={isActive}
                className={`category-ann-pill ${isActive ? 'active' : ''}`}
                onClick={() => selectAndScroll(item.name)}
              >
                <span className="category-ann-pill-top">
                  <code>{item.name}</code>
                  <span className="category-ann-attr-count">
                    {item.attributeSpecs.length}
                  </span>
                </span>
                <span className="category-ann-pill-summary">
                  {pickText(item.purpose, currentLang)}
                </span>
              </button>
            );
          })
        )}
      </div>

      <h2 id="annotation-detail-card" className="section-heading">
        <code>{activeSpec.name}</code>
      </h2>

      <div className="badge-row">
        <span className={CATEGORY_BADGE[activeSpec.category]}>
          {pickText(CATEGORY_LABELS[activeSpec.category], currentLang)}
        </span>
        <span className="badge badge-blue badge-wrap">
          <code>@Target({activeSpec.target})</code>
        </span>
        <span
          className="badge badge-wrap"
          style={{
            backgroundColor: 'var(--bg-badge)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <span>{pickText(STAGE2_CONTENT.annPackageLabel, currentLang)}:</span>{' '}
          <code style={{ marginInlineStart: '0.35rem' }}>{activeSpec.packageName}</code>
        </span>
        {activeSpec.attributeSpecs.length === 0 && (
          <span className="badge badge-purple badge-wrap">
            {pickText(UI_CONTROLS.badgeMarker, currentLang)}
          </span>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)' }}>
        <strong>{pickText(STAGE2_CONTENT.annPurposeLabel, currentLang)}:</strong>{' '}
        <RichDocText text={activeSpec.purpose} currentLang={currentLang} />
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        <strong>{pickText(STAGE2_CONTENT.annBehaviorLabel, currentLang)}:</strong>{' '}
        <RichDocText text={activeSpec.runtimeBehavior} currentLang={currentLang} />
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        <strong>{pickText(STAGE2_CONTENT.annHowToUseLabel, currentLang)}:</strong>{' '}
        <RichDocText text={activeSpec.howToUse} currentLang={currentLang} />
      </p>

      <div className="subsection-heading-row">
        <h3 id="annotation-attributes" className="subsection-heading">
          {pickText(STAGE2_CONTENT.annAttrTableTitle, currentLang)}
        </h3>
        {activeSpec.attributeSpecs.length > 0 && (
          <span className="attr-section-badge">
            {activeSpec.attributeSpecs.length} {pickText(UI_CONTROLS.attrCountSuffix, currentLang)}
          </span>
        )}
      </div>

      {activeSpec.attributeSpecs.length > 0 ? (
        <div className="attr-spec-list">
          {activeSpec.attributeSpecs.map((attr) => (
            <section key={attr.name} className="attr-spec-card">
              <div className="attr-spec-header">
                <div className="attr-spec-identity">
                  <code className="attr-spec-name">{attr.name}</code>
                  <code className="attr-spec-type">{attr.type}</code>
                  <span className={attr.required ? 'badge badge-rose' : 'badge badge-emerald'}>
                    {pickText(
                      attr.required ? UI_CONTROLS.badgeRequired : UI_CONTROLS.badgeOptional,
                      currentLang,
                    )}
                  </span>
                </div>
                <div className="attr-spec-default">
                  <span className="attr-meta-label">
                    {pickText(UI_CONTROLS.colAttrDefault, currentLang)}:
                  </span>
                  <code className="attr-default-code">{attr.defaultValue}</code>
                </div>
              </div>

              <p className="attr-spec-desc">
                <RichDocText text={attr.description} currentLang={currentLang} />
              </p>

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
            </section>
          ))}
        </div>
      ) : (
        <Callout type="note" currentLang={currentLang}>
          <RichDocText text={STAGE2_CONTENT.annNoAttributesNote} currentLang={currentLang} />
        </Callout>
      )}

      <Callout
        type="tip"
        title={pickText(STAGE2_CONTENT.annWhenToUseLabel, currentLang)}
        currentLang={currentLang}
      >
        <RichDocText text={activeSpec.whenToUse} currentLang={currentLang} />
      </Callout>

      <Callout
        type="warning"
        title={pickText(STAGE2_CONTENT.annWhenNotToUseLabel, currentLang)}
        currentLang={currentLang}
      >
        <RichDocText text={activeSpec.whenNotToUse} currentLang={currentLang} />
      </Callout>

      <h3 id="annotation-code-example" className="subsection-heading">
        {pickText(UI_CONTROLS.tabJavaUsage, currentLang)}
      </h3>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName={`${activeSpec.name.replace('@', '')}Usage.java`}
        code={activeSpec.syntaxSample}
      />

      <div className="in-group-nav">
        {prevSpec ? (
          <button
            type="button"
            className="filter-pill-btn"
            onClick={() => selectAndScroll(prevSpec.name)}
          >
            <ChevronLeft size={14} className="rtl-flip-icon" />
            <span>{pickText(HUB_CONTENT.prevInGroup, currentLang)}: <code>{prevSpec.name}</code></span>
          </button>
        ) : (
          <span />
        )}
        {nextSpec && (
          <button
            type="button"
            className="filter-pill-btn active"
            onClick={() => selectAndScroll(nextSpec.name)}
          >
            <span>{pickText(HUB_CONTENT.nextInGroup, currentLang)}: <code>{nextSpec.name}</code></span>
            <ChevronRight size={14} className="rtl-flip-icon" />
          </button>
        )}
      </div>
    </article>
  );
};
