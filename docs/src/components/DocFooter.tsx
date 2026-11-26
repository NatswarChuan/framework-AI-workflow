import React from 'react';
import { Bug, Scale, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { UI_CONTROLS, UI_LABELS, pickText } from '../data/locales';

interface DocFooterProps {
  currentLang: SupportedLanguage;
}

export const DocFooter: React.FC<DocFooterProps> = ({ currentLang }) => {
  return (
    <footer className="doc-footer">
      <div className="doc-footer-links">
        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC"
          target="_blank"
          rel="noopener noreferrer"
          className="doc-footer-link"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.65 3.01 8.59 7.19 9.98.53.1.72-.23.72-.5 0-.25-.01-1.08-.01-1.96-2.92.63-3.54-1.24-3.54-1.24-.48-1.21-1.17-1.53-1.17-1.53-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.09-.68.37-1.15.67-1.41-2.33-.26-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.09-2.82-.11-.27-.47-1.35.1-2.81 0 0 .89-.28 2.9 1.08.84-.23 1.75-.35 2.65-.35.9 0 1.81.12 2.65.35 2.01-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.54.1 2.81.68.74 1.09 1.67 1.09 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96 0 1.42-.01 2.56-.01 2.91 0 .28.19.61.73.5A10.51 10.51 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" />
          </svg>
          <span>GitHub</span>
        </a>
        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="doc-footer-link"
        >
          <Scale size={14} aria-hidden="true" />
          <span>{pickText(UI_CONTROLS.footerLicense, currentLang)}</span>
        </a>
        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC-document/blob/main/SECURITY.md"
          target="_blank"
          rel="noopener noreferrer"
          className="doc-footer-link"
        >
          <ShieldCheck size={14} aria-hidden="true" />
          <span>{pickText(UI_CONTROLS.footerSecurity, currentLang)}</span>
        </a>
        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="doc-footer-link"
        >
          <Bug size={14} aria-hidden="true" />
          <span>{pickText(UI_CONTROLS.footerIssues, currentLang)}</span>
        </a>
      </div>

      <span dir="ltr">
        {UI_LABELS.brandName} {UI_LABELS.versionText} · io.github.natswarchuan:spring-nwvmc
      </span>
    </footer>
  );
};
