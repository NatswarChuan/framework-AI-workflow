import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS } from '../data/navigation';
import { UI_LABELS, pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

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
        <a
          href={buildTopicHref(prevItem.id, currentLang)}
          className="pagination-card"
          onClick={(event) => {
            if (isPlainLeftClick(event)) {
              event.preventDefault();
              onSelectTopic(prevItem.id);
            }
          }}
        >
          <span className="pagination-dir">
            <ArrowLeft size={13} className="rtl-flip-icon" aria-hidden="true" />
            <span>{pickText(UI_LABELS.previous, currentLang)}</span>
          </span>
          <span className="pagination-title">{pickText(prevItem.label, currentLang)}</span>
        </a>
      ) : (
        <div className="pagination-spacer" aria-hidden="true" />
      )}

      {nextItem && (
        <a
          href={buildTopicHref(nextItem.id, currentLang)}
          className="pagination-card next"
          onClick={(event) => {
            if (isPlainLeftClick(event)) {
              event.preventDefault();
              onSelectTopic(nextItem.id);
            }
          }}
        >
          <span className="pagination-dir">
            <span>{pickText(UI_LABELS.next, currentLang)}</span>
            <ArrowRight size={13} className="rtl-flip-icon" aria-hidden="true" />
          </span>
          <span className="pagination-title">{pickText(nextItem.label, currentLang)}</span>
        </a>
      )}
    </div>
  );
};
