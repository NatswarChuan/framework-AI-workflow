import React, { useEffect, useId, useRef, useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { GLOSSARY_ENTRIES } from '../data/glossaryData';
import { RichDocText } from './RichDocText';

interface GlossaryTermProps {
  termKey: keyof typeof GLOSSARY_ENTRIES;
  currentLang: SupportedLanguage;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ termKey, currentLang }) => {
  const entry = GLOSSARY_ENTRIES[termKey];
  const popoverId = useId();
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setHovered(false);
        setPinned(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHovered(false);
        setPinned(false);
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        className="glossary-term-btn"
        aria-expanded={open}
        aria-describedby={open ? popoverId : undefined}
        onClick={() => {
          setPinned((prev) => {
            const next = !prev;
            if (!next) {
              setHovered(false);
            }
            return next;
          });
        }}
      >
        <bdi dir="ltr">{entry.term}</bdi>
        <HelpCircle size={12} aria-hidden="true" />
      </button>
      {open && (
        <span id={popoverId} className="glossary-popover" role="tooltip">
          <RichDocText text={entry.definition} currentLang={currentLang} />
        </span>
      )}
    </span>
  );
};
