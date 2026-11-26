import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { UI_CONTROLS, pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface NotFoundPageProps {
  rawHash: string;
  currentLang: SupportedLanguage;
  onSelectTopic: (topicId: string) => void;
  onOpenSearch: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  rawHash,
  currentLang,
  onSelectTopic,
  onOpenSearch,
}) => {
  return (
    <section className="not-found-panel">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="14" y="20" width="68" height="56" rx="14" stroke="#22D3EE" strokeWidth="2.5" fill="rgba(34,211,238,0.08)" />
        <path d="M22 20L32 10H64L74 20" stroke="#FF3B8B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="46" r="5" fill="#FF3B8B" />
        <circle cx="60" cy="46" r="5" fill="#22D3EE" />
        <path d="M38 61C42 57 54 57 58 61" stroke="#FF3B8B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      <code dir="ltr">#{rawHash}</code>

      <h1 className="page-title" style={{ margin: 0 }}>
        {pickText(UI_CONTROLS.notFoundTitle, currentLang)}
      </h1>

      <p className="page-lead" style={{ margin: 0, textAlign: 'center' }}>
        {pickText(UI_CONTROLS.notFoundDesc, currentLang)}
      </p>

      <div className="hero-actions" style={{ justifyContent: 'center' }}>
        <a
          href={buildTopicHref('overview', currentLang)}
          className="hero-btn-primary"
          onClick={(event) => {
            if (isPlainLeftClick(event)) {
              event.preventDefault();
              onSelectTopic('overview');
            }
          }}
        >
          <ArrowLeft size={16} className="rtl-flip-icon" aria-hidden="true" />
          <span>{pickText(UI_CONTROLS.notFoundBackHome, currentLang)}</span>
        </a>

        <button
          type="button"
          className="hero-btn-secondary"
          onClick={onOpenSearch}
        >
          <Search size={15} aria-hidden="true" />
          <span>{pickText(UI_CONTROLS.notFoundSearchBtn, currentLang)}</span>
        </button>
      </div>
    </section>
  );
};
