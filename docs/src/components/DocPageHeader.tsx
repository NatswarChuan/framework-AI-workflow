import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS, NAVIGATION_STAGES } from '../data/navigation';
import { pickText } from '../data/locales';
import { StoryBanner } from './StoryBanner';
import { GuardrailHintIcon } from './GuardrailHintIcon';

interface DocPageHeaderProps {
  topicId: string;
  currentLang: SupportedLanguage;
  onNavigateTopic?: (topicId: string) => void;
  badges?: Array<{ label: string; tone?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' }>;
  guardrailTip?: {
    type?: 'security' | 'warning' | 'tip' | 'note';
    content: React.ReactNode;
    title?: string;
  };
}

export const DocPageHeader: React.FC<DocPageHeaderProps> = ({
  topicId,
  currentLang,
  onNavigateTopic,
  guardrailTip,
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
              <button
                type="button"
                className="breadcrumb-link-btn"
                onClick={() => onNavigateTopic(parentItem.id)}
              >
                {pickText(parentItem.label, currentLang)}
              </button>
            ) : (
              <span>{pickText(parentItem.label, currentLang)}</span>
            )}
          </>
        )}
      </div>
      <div className="page-title-row">
        <h1 className="page-title">{pickText(item.label, currentLang)}</h1>
        {guardrailTip && (
          <GuardrailHintIcon
            type={guardrailTip.type}
            title={guardrailTip.title}
            currentLang={currentLang}
          >
            {guardrailTip.content}
          </GuardrailHintIcon>
        )}
      </div>
      <p className="page-lead">{pickText(item.summary, currentLang)}</p>
      <StoryBanner topicId={topicId} currentLang={currentLang} />
    </header>
  );
};
