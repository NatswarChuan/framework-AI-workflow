import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS } from '../data/navigation';
import { UI_LABELS, pickText } from '../data/locales';

interface TopicPaginationFooterProps {
  activeTopicId: string;
  currentLang: SupportedLanguage;
  onSelectTopic: (id: string) => void;
}

export const TopicPaginationFooter: React.FC<TopicPaginationFooterProps> = ({
  activeTopicId,
  currentLang,
  onSelectTopic,
}) => {
  const idx = ALL_NAV_ITEMS.findIndex((item) => item.id === activeTopicId);
  const prevItem = idx > 0 ? ALL_NAV_ITEMS[idx - 1] : null;
  const nextItem = idx >= 0 && idx < ALL_NAV_ITEMS.length - 1 ? ALL_NAV_ITEMS[idx + 1] : null;

  return (
    <div className="doc-pagination">
      {prevItem ? (
        <button
          type="button"
          className="pagination-card"
          onClick={() => onSelectTopic(prevItem.id)}
        >
          <span className="pagination-dir" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={13} />
            {pickText(UI_LABELS.previous, currentLang)}
          </span>
          <span className="pagination-title">{pickText(prevItem.label, currentLang)}</span>
        </button>
      ) : (
        <div />
      )}

      {nextItem && (
        <button
          type="button"
          className="pagination-card next"
          onClick={() => onSelectTopic(nextItem.id)}
        >
          <span
            className="pagination-dir"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}
          >
            {pickText(UI_LABELS.next, currentLang)}
            <ArrowRight size={13} />
          </span>
          <span className="pagination-title">{pickText(nextItem.label, currentLang)}</span>
        </button>
      )}
    </div>
  );
};
