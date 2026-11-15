import React from 'react';
import { TocHeading } from '../types/docs';

interface TableOfContentsProps {
  headings: TocHeading[];
  activeHeadingId?: string;
  title?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeHeadingId,
  title = 'ON THIS PAGE',
}) => {
  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="toc-nav">
      <div
        style={{
          fontSize: '0.71rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-primary)',
          marginBottom: '0.85rem',
        }}
      >
        {title}
      </div>

      <ul style={{ listStyle: 'none', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem' }}>
        {headings.map((h) => {
          const isActive = activeHeadingId === h.id;
          return (
            <li
              key={h.id}
              style={{
                marginBottom: '0.5rem',
                paddingLeft: h.level === 3 ? '0.65rem' : '0rem',
              }}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(h.id);
                }}
                style={{
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.81rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'block',
                  lineHeight: 1.45,
                  transition: 'color 0.15s ease',
                }}
              >
                {h.title}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
