import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS, NAVIGATION_STAGES } from '../data/navigation';
import { pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface DocPageHeaderProps {
  topicId: string;
  currentLang: SupportedLanguage;
  onNavigateTopic?: (topicId: string) => void;
  badges?: Array<{ label: string; tone?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' }>;
}

export const DocPageHeader: React.FC<DocPageHeaderProps> = ({
  topicId,
  currentLang,
  onNavigateTopic,
}) => {
  const stage = NAVIGATION_STAGES.find((s) => s.items.some((i) => i.id === topicId));
  const item = stage?.items.find((i) => i.id === topicId);
  const parentItem = item?.parentId
    ? ALL_NAV_ITEMS.find((candidate) => candidate.id === item.parentId)
    : undefined;

  if (!stage || !item) {
    return null;
  }

  return (
    <header>
      <div className="stage-breadcrumb">
        <span>{pickText(stage.title, currentLang)}</span>
        {parentItem && (
          <>
            <ChevronRight size={13} className="rtl-flip-icon" style={{ opacity: 0.6 }} />
            {onNavigateTopic ? (
              <a
                href={buildTopicHref(parentItem.id, currentLang)}
                className="breadcrumb-link-btn"
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) {
                    return;
                  }
                  event.preventDefault();
                  onNavigateTopic(parentItem.id);
                }}
              >
                {pickText(parentItem.label, currentLang)}
              </a>
            ) : (
              <span>{pickText(parentItem.label, currentLang)}</span>
            )}
          </>
        )}
      </div>
      <div className="page-title-row">
        <h1 className="page-title">{pickText(item.label, currentLang)}</h1>
      </div>
      <p className="page-lead">{pickText(item.summary, currentLang)}</p>
    </header>
  );
};
