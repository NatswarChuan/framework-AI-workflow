import React, { useMemo } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { EndpointSpec, FullLocalizedText, SupportedLanguage } from '../types/docs';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { UI_LABELS, pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE3_CONTENT } from '../data/pages/stage3Content';
import { HUB_CONTENT } from '../data/hubContent';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface EndpointsHubProps {
  currentLang: SupportedLanguage;
  onNavigateTopic: (topicId: string) => void;
}

export const ENDPOINT_GROUP_TO_TOPIC_ID: Record<EndpointSpec['group'], string> = {
  read: 'endpoints-read',
  write: 'endpoints-write',
  enterprise: 'endpoints-enterprise',
  'export-import': 'endpoints-export-import',
};

const GROUP_CARDS: Array<{
  group: EndpointSpec['group'];
  topicId: string;
  badgeClass: string;
  title: FullLocalizedText;
  plainSummary: FullLocalizedText;
}> = [
  {
    group: 'read',
    topicId: 'endpoints-read',
    badgeClass: 'badge badge-emerald',
    title: UI_CONTROLS.explorerRead,
    plainSummary: HUB_CONTENT.epReadPlain,
  },
  {
    group: 'write',
    topicId: 'endpoints-write',
    badgeClass: 'badge badge-blue',
    title: UI_CONTROLS.explorerWrite,
    plainSummary: HUB_CONTENT.epWritePlain,
  },
  {
    group: 'enterprise',
    topicId: 'endpoints-enterprise',
    badgeClass: 'badge badge-purple',
    title: UI_CONTROLS.explorerEnterprise,
    plainSummary: HUB_CONTENT.epEnterprisePlain,
  },
  {
    group: 'export-import',
    topicId: 'endpoints-export-import',
    badgeClass: 'badge badge-amber',
    title: UI_CONTROLS.explorerExportImport,
    plainSummary: HUB_CONTENT.epExportImportPlain,
  },
];

export const EndpointsPage: React.FC<EndpointsHubProps> = ({
  currentLang,
  onNavigateTopic,
}) => {
  const byGroup = useMemo(() => {
    const map: Record<EndpointSpec['group'], EndpointSpec[]> = {
      read: [],
      write: [],
      enterprise: [],
      'export-import': [],
    };
    for (const ep of ENDPOINTS_DATA) {
      map[ep.group].push(ep);
    }
    return map;
  }, []);

  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="endpoints"
        currentLang={currentLang}
      />

      <section className="plain-guide-box">
        <div className="plain-guide-header">
          <BookOpen size={16} />
          <span>{pickText(HUB_CONTENT.plainTermsTitle, currentLang)}</span>
        </div>
        <p className="plain-guide-body">
          <RichDocText text={HUB_CONTENT.epHubPlainLead} currentLang={currentLang} />
        </p>
      </section>

      <h2 id="endpoints-groups" className="section-heading">
        {pickText(HUB_CONTENT.epHubChooseGroup, currentLang)}
      </h2>

      <div className="hub-cards-grid grid-2col">
        {GROUP_CARDS.map((card) => {
          const items = byGroup[card.group];
          return (
            <a
              key={card.topicId}
              href={buildTopicHref(card.topicId, currentLang)}
              className="hub-group-card"
              onClick={(event) => {
                if (!isPlainLeftClick(event)) {
                  return;
                }
                event.preventDefault();
                onNavigateTopic(card.topicId);
              }}
            >
              <div className="hub-group-card-top">
                <span className={card.badgeClass}>
                  {card.group.toUpperCase()}
                </span>
                <ArrowRight size={16} className="rtl-flip-icon hub-card-arrow" aria-hidden="true" />
              </div>
              <h3 className="hub-group-card-title">
                {pickText(card.title, currentLang)}
              </h3>
              <p className="hub-group-card-desc">
                <RichDocText text={card.plainSummary} currentLang={currentLang} />
              </p>
              <div className="hub-preview-chips">
                {items.slice(0, 4).map((ep) => (
                  <code key={ep.id} className="attr-mini-chip">
                    {ep.method} {ep.path || '/'}
                  </code>
                ))}
              </div>
              <span className="hub-group-cta">
                {pickText(HUB_CONTENT.exploreGroupCta, currentLang)}
              </span>
            </a>
          );
        })}
      </div>

      <h2 id="endpoints-system" className="section-heading">
        {pickText(STAGE3_CONTENT.epSystemHeading, currentLang).replace(/^\d+\.\s*/, '')}
      </h2>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <h3><code>GET /system/studio</code></h3>
          <p><RichDocText text={STAGE3_CONTENT.epSysStudio} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h3><code>GET /api/v1/system/databases/health</code></h3>
          <p><RichDocText text={STAGE3_CONTENT.epSysDb} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h3><code>GET /api/v1/system/trace-context</code></h3>
          <p><RichDocText text={STAGE3_CONTENT.epSysTrace} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h3><code>GET /system/studio/eject</code></h3>
          <p><RichDocText text={STAGE3_CONTENT.epSysEject} currentLang={currentLang} /></p>
        </div>
      </div>

      <h2 id="endpoints-guardrails" className="section-heading">
        {pickText(UI_LABELS.stepNotes, currentLang).replace(/^\d+\.\s*/, '')}
      </h2>
      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE3_CONTENT.epCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
