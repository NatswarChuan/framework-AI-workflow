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
          <span className="pagination-dir">
            <ArrowLeft size={13} className="rtl-flip-icon" />
            <span>{pickText(UI_LABELS.previous, currentLang)}</span>
          </span>
          <span className="pagination-title">{pickText(prevItem.label, currentLang)}</span>
        </button>
      ) : (
        <div className="pagination-spacer" aria-hidden="true" />
      )}

      {nextItem && (
        <button
          type="button"
          className="pagination-card next"
          onClick={() => onSelectTopic(nextItem.id)}
        >
          <span className="pagination-dir">
            <span>{pickText(UI_LABELS.next, currentLang)}</span>
            <ArrowRight size={13} className="rtl-flip-icon" />
          </span>
          <span className="pagination-title">{pickText(nextItem.label, currentLang)}</span>
        </button>
      )}
    </div>
  );
};
