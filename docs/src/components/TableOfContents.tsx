import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SupportedLanguage, TocHeading } from '../types/docs';
import { UI_LABELS, pickText } from '../data/locales';
import { buildTopicHref } from '../utils/navLinks';

interface TableOfContentsProps {
  activeTopicId: string;
  currentLang: SupportedLanguage;
}

export function openAncestorDetails(target: HTMLElement | null): void {
  let cursor = target?.parentElement ?? null;
  while (cursor) {
    if (cursor instanceof HTMLDetailsElement && !cursor.open) {
      cursor.open = true;
    }
    cursor = cursor.parentElement;
  }
}

function useCollectedHeadings(activeTopicId: string, currentLang: SupportedLanguage): TocHeading[] {
  const [headings, setHeadings] = useState<TocHeading[]>([]);

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
    };

    const timer = window.setTimeout(collectHeadings, 30);
    const observer = new MutationObserver(() => collectHeadings());
    observer.observe(container, { childList: true, subtree: true, characterData: true });

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeTopicId, currentLang]);

  return headings;
}

export const MobileTableOfContents: React.FC<TableOfContentsProps> = ({
  activeTopicId,
  currentLang,
}) => {
  const headings = useCollectedHeadings(activeTopicId, currentLang);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  if (headings.length === 0) {
    return null;
  }

  return (
    <details ref={detailsRef} className="mobile-toc-bar">
      <summary className="mobile-toc-summary">
        <span>{pickText(UI_LABELS.onThisPage, currentLang)}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </summary>
      <nav className="mobile-toc-list" aria-label={pickText(UI_LABELS.onThisPage, currentLang)}>
        {headings.map((item) => (
          <a
            key={item.id}
            href={`${buildTopicHref(activeTopicId, currentLang)}/${item.id}`}
            className={`toc-link level-${item.level}`}
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(item.id);
              if (target) {
                openAncestorDetails(target);
                if (detailsRef.current) {
                  detailsRef.current.open = false;
                }
                window.setTimeout(() => {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 20);
                window.history.replaceState(
                  null,
                  '',
                  `${buildTopicHref(activeTopicId, currentLang)}/${item.id}`
                );
              }
            }}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </details>
  );
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  activeTopicId,
  currentLang,
}) => {
  const headings = useCollectedHeadings(activeTopicId, currentLang);
  const [activeId, setActiveId] = useState<string>('');
  const scrollLockUntilRef = useRef<number>(0);

  useEffect(() => {
    if (headings.length > 0) {
      setActiveId((prev) => (headings.some((h) => h.id === prev) ? prev : headings[0].id));
    }
  }, [headings]);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const onScroll = () => {
      if (Date.now() < scrollLockUntilRef.current) {
        return;
      }
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
            href={`${buildTopicHref(activeTopicId, currentLang)}/${item.id}`}
            className={`toc-link level-${item.level} ${activeId === item.id ? 'active' : ''}`}
            onClick={(event) => {
              event.preventDefault();
              const target = document.getElementById(item.id);
              if (target) {
                openAncestorDetails(target);
                scrollLockUntilRef.current = Date.now() + 450;
                window.setTimeout(() => {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 15);
                setActiveId(item.id);
                window.history.replaceState(
                  null,
                  '',
                  `${buildTopicHref(activeTopicId, currentLang)}/${item.id}`
                );
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
