import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Search, X } from 'lucide-react';
import { AnnotationSpec, FullLocalizedText, SupportedLanguage } from '../types/docs';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';
import { HUB_CONTENT } from '../data/hubContent';

interface AnnotationsHubPageProps {
  currentLang: SupportedLanguage;
  onNavigateTopic: (topicId: string, selectedAnnotation?: string) => void;
}

export const CATEGORY_TO_TOPIC_ID: Record<AnnotationSpec['category'], string> = {
  routing: 'annotations-routing',
  bean: 'annotations-beans',
  entity: 'annotations-entity',
  rbac: 'annotations-rbac',
  resilience: 'annotations-resilience',
};

const CATEGORY_CARDS: Array<{
  category: AnnotationSpec['category'];
  topicId: string;
  badgeClass: string;
  title: FullLocalizedText;
  plainSummary: FullLocalizedText;
}> = [
  {
    category: 'routing',
    topicId: 'annotations-routing',
    badgeClass: 'badge badge-emerald',
    title: UI_CONTROLS.annCatRouting,
    plainSummary: HUB_CONTENT.catRoutingPlain,
  },
  {
    category: 'bean',
    topicId: 'annotations-beans',
    badgeClass: 'badge badge-blue',
    title: UI_CONTROLS.annCatBean,
    plainSummary: HUB_CONTENT.catBeanPlain,
  },
  {
    category: 'entity',
    topicId: 'annotations-entity',
    badgeClass: 'badge badge-purple',
    title: UI_CONTROLS.annCatEntity,
    plainSummary: HUB_CONTENT.catEntityPlain,
  },
  {
    category: 'rbac',
    topicId: 'annotations-rbac',
    badgeClass: 'badge badge-rose',
    title: UI_CONTROLS.annCatRbac,
    plainSummary: HUB_CONTENT.catRbacPlain,
  },
  {
    category: 'resilience',
    topicId: 'annotations-resilience',
    badgeClass: 'badge badge-amber',
    title: UI_CONTROLS.annCatResilience,
    plainSummary: HUB_CONTENT.catResiliencePlain,
  },
];

export const AnnotationsPage: React.FC<AnnotationsHubPageProps> = ({
  currentLang,
  onNavigateTopic,
}) => {
  const [search, setSearch] = useState('');

  const byCategory = useMemo(() => {
    const map: Record<AnnotationSpec['category'], AnnotationSpec[]> = {
      routing: [],
      bean: [],
      entity: [],
      rbac: [],
      resilience: [],
    };
    for (const item of ANNOTATIONS_DATA) {
      map[item.category].push(item);
    }
    return map;
  }, []);

  const quickMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return [];
    }
    return ANNOTATIONS_DATA.filter(
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
    ).slice(0, 10);
  }, [search, currentLang]);

  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="annotations"
        currentLang={currentLang}
        badges={[
          { label: pickText(STAGE2_CONTENT.annBadgeCount, currentLang), tone: 'emerald' },
          { label: pickText(STAGE2_CONTENT.annBadgeZeroWeb, currentLang), tone: 'blue' },
          { label: pickText(STAGE2_CONTENT.annBadgeTargets, currentLang), tone: 'purple' },
        ]}
      />

      <section className="plain-guide-box">
        <div className="plain-guide-header">
          <BookOpen size={16} />
          <span>{pickText(HUB_CONTENT.plainTermsTitle, currentLang)}</span>
        </div>
        <p className="plain-guide-body">
          <RichDocText text={HUB_CONTENT.annHubPlainLead} currentLang={currentLang} />
        </p>
      </section>

      <h2 id="annotations-quick-find" className="section-heading">
        {pickText(HUB_CONTENT.annHubQuickFind, currentLang)}
      </h2>

      <div className="filter-bar">
        <div className="filter-search-row">
          <Search size={15} className="hub-search-icon" />
          <input
            id="annotations-hub-search"
            name="annotations-hub-search"
            type="text"
            className="filter-input hub-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={pickText(UI_CONTROLS.annSearchPlaceholder, currentLang)}
            aria-label={pickText(UI_CONTROLS.annSearchPlaceholder, currentLang)}
          />
          {search && (
            <button
              type="button"
              className="filter-clear-btn"
              onClick={() => setSearch('')}
              aria-label={pickText(UI_CONTROLS.clearFilterLabel, currentLang)}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {search.trim().length > 0 && (
        <div className="hub-quick-results">
          {quickMatches.length === 0 ? (
            <div className="hub-empty-msg">
              {pickText(UI_CONTROLS.annNoMatch, currentLang)}
            </div>
          ) : (
            quickMatches.map((item) => (
              <button
                key={item.name}
                type="button"
                className="hub-quick-hit"
                onClick={() => onNavigateTopic(CATEGORY_TO_TOPIC_ID[item.category], item.name)}
              >
                <div className="hub-quick-hit-main">
                  <code>{item.name}</code>
                  <span className="hub-quick-hit-desc">
                    {pickText(item.purpose, currentLang)}
                  </span>
                </div>
                <ArrowRight size={15} className="rtl-flip-icon hub-card-arrow" />
              </button>
            ))
          )}
        </div>
      )}

      <h2 id="annotations-groups" className="section-heading">
        {pickText(HUB_CONTENT.annHubChooseGroup, currentLang)}
      </h2>

      <div className="hub-cards-grid">
        {CATEGORY_CARDS.map((card) => {
          const items = byCategory[card.category];
          return (
            <button
              key={card.topicId}
              type="button"
              className="hub-group-card"
              onClick={() => onNavigateTopic(card.topicId)}
            >
              <div className="hub-group-card-top">
                <span className={card.badgeClass}>
                  {items.length} {pickText(HUB_CONTENT.annotationsUnit, currentLang)}
                </span>
                <ArrowRight size={16} className="rtl-flip-icon hub-card-arrow" />
              </div>
              <h3 className="hub-group-card-title">
                {pickText(card.title, currentLang)}
              </h3>
              <p className="hub-group-card-desc">
                <RichDocText text={card.plainSummary} currentLang={currentLang} />
              </p>
              <div className="hub-preview-chips">
                {items.slice(0, 5).map((ann) => (
                  <code key={ann.name} className="attr-mini-chip">
                    {ann.name}
                  </code>
                ))}
                {items.length > 5 && (
                  <span className="hub-more-chip">+{items.length - 5}</span>
                )}
              </div>
              <span className="hub-group-cta">
                {pickText(HUB_CONTENT.exploreGroupCta, currentLang)}
              </span>
            </button>
          );
        })}
      </div>

      <Callout type="note" currentLang={currentLang}>
        <RichDocText text={STAGE2_CONTENT.annCalloutNote} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
