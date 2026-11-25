import React, { useEffect, useState } from 'react';
import { SupportedLanguage, TocHeading } from '../types/docs';
import { UI_LABELS, pickText } from '../data/locales';

interface TableOfContentsProps {
  activeTopicId: string;
  currentLang: SupportedLanguage;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeTopicId,
  currentLang,
}) => {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const container = document.getElementById('doc-reading-canvas');
    if (!container) {
      return;
    }

    const collectHeadings = () => {
      const elements = Array.from(container.querySelectorAll('h2[id], h3[id]'));
      const collected: TocHeading[] = elements.map((el) => ({
        id: el.id,
        title: (el.textContent ?? '').trim(),
        level: el.tagName === 'H3' ? 3 : 2,
      }));
      setHeadings((prev) => {
        const same =
          prev.length === collected.length &&
          prev.every(
            (item, idx) =>
              item.id === collected[idx].id &&
              item.title === collected[idx].title &&
              item.level === collected[idx].level
          );
        return same ? prev : collected;
      });
      if (collected.length > 0) {
        setActiveId((prev) => (collected.some((h) => h.id === prev) ? prev : collected[0].id));
      }
    };

    const timer = window.setTimeout(collectHeadings, 30);
    const observer = new MutationObserver(() => collectHeadings());
    observer.observe(container, { childList: true, subtree: true, characterData: true });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTopicId, currentLang]);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 16;
      if (nearBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }
      let current = headings[0].id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 128) {
          current = h.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="doc-toc" aria-label={pickText(UI_LABELS.onThisPage, currentLang)}>
      <div className="toc-heading">{pickText(UI_LABELS.onThisPage, currentLang)}</div>
      <nav className="toc-list">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`toc-link level-${item.level} ${activeId === item.id ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(item.id);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveId(item.id);
              }
            }}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
};
