import React from 'react';
import { SupportedLanguage } from '../types/docs';
import { NAVIGATION_STAGES } from '../data/navigation';
import { pickText } from '../data/locales';

interface DocPageHeaderProps {
  topicId: string;
  currentLang: SupportedLanguage;
  badges?: Array<{ label: string; tone?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' }>;
}

export const DocPageHeader: React.FC<DocPageHeaderProps> = ({
  topicId,
  currentLang,
  badges = [],
}) => {
  const stage = NAVIGATION_STAGES.find((s) => s.items.some((i) => i.id === topicId));
  const item = stage?.items.find((i) => i.id === topicId);

  if (!stage || !item) {
    return null;
  }

  return (
    <header>
      <div className="stage-breadcrumb">{pickText(stage.title, currentLang)}</div>
      {badges.length > 0 && (
        <div className="badge-row">
          {badges.map((b) => (
            <span key={b.label} className={`badge badge-${b.tone ?? 'emerald'}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}
      <h1 className="page-title">{pickText(item.label, currentLang)}</h1>
      <p className="page-lead">{pickText(item.summary, currentLang)}</p>
    </header>
  );
};
