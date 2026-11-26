import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { GLOSSARY_ENTRIES } from '../data/glossaryData';
import { pickText } from '../data/locales';

interface GlossaryTermProps {
  termKey: keyof typeof GLOSSARY_ENTRIES;
  currentLang: SupportedLanguage;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ termKey, currentLang }) => {
  const entry = GLOSSARY_ENTRIES[termKey];
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  if (!entry) {
    return null;
  }

  return (
    <span
      ref={wrapRef}
      className="glossary-term-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-term-btn"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{entry.term}</span>
        <HelpCircle size={12} aria-hidden="true" />
      </button>
      {open && (
        <span className="glossary-popover" role="tooltip">
          {pickText(entry.definition, currentLang)}
        </span>
      )}
    </span>
  );
};
