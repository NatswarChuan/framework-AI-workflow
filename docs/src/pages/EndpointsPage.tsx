import React, { useMemo } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { EndpointSpec, FullLocalizedText, SupportedLanguage } from '../types/docs';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { Callout } from '../components/Callout';
import { RichDocText } from '../components/RichDocText';
import { pickText } from '../data/locales';
import { UI_CONTROLS } from '../data/uiControls';
import { STAGE3_CONTENT } from '../data/pages/stage3Content';
import { HUB_CONTENT } from '../data/hubContent';

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
        badges={[
          { label: pickText(STAGE3_CONTENT.epBadgeDeclared, currentLang), tone: 'emerald' },
          { label: pickText(STAGE3_CONTENT.epBadgeSwagger, currentLang), tone: 'blue' },
          { label: pickText(STAGE3_CONTENT.epBadgeSplit, currentLang), tone: 'amber' },
        ]}
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
            <button
              key={card.topicId}
              type="button"
              className="hub-group-card"
              onClick={() => onNavigateTopic(card.topicId)}
            >
              <div className="hub-group-card-top">
                <span className={card.badgeClass}>
                  {items.length} {pickText(HUB_CONTENT.endpointsUnit, currentLang)}
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
                {items.slice(0, 4).map((ep) => (
                  <code key={ep.id} className="attr-mini-chip">
                    {ep.method} {ep.path || '/'}
                  </code>
                ))}
                {items.length > 4 && (
                  <span className="hub-more-chip">+{items.length - 4}</span>
                )}
              </div>
              <span className="hub-group-cta">
                {pickText(HUB_CONTENT.exploreGroupCta, currentLang)}
              </span>
            </button>
          );
        })}
      </div>

      <h2 id="endpoints-system" className="section-heading">
        {pickText(STAGE3_CONTENT.epSystemHeading, currentLang).replace(/^\d+\.\s*/, '')}
      </h2>

      <div className="feature-grid grid-2col">
        <div className="feature-card">
          <h4><code>GET /api/v1/system/studio</code></h4>
          <p><RichDocText text={STAGE3_CONTENT.epSysStudio} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h4><code>GET /api/v1/system/databases/health</code></h4>
          <p><RichDocText text={STAGE3_CONTENT.epSysDb} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h4><code>GET /api/v1/system/trace-context</code></h4>
          <p><RichDocText text={STAGE3_CONTENT.epSysTrace} currentLang={currentLang} /></p>
        </div>
        <div className="feature-card">
          <h4><code>GET /api/v1/system/eject/*</code></h4>
          <p><RichDocText text={STAGE3_CONTENT.epSysEject} currentLang={currentLang} /></p>
        </div>
      </div>

      <Callout type="tip" currentLang={currentLang}>
        <RichDocText text={STAGE3_CONTENT.epCalloutTip} currentLang={currentLang} />
      </Callout>
    </article>
  );
};
