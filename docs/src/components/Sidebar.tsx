import React from 'react';
import { NavCategory, SupportedLanguage } from '../types/docs';

interface SidebarProps {
  categories: NavCategory[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  currentLang: SupportedLanguage;
}

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeTopicId,
  onSelectTopic,
  currentLang,
}) => {
  return (
    <aside className="sidebar-nav">
      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              paddingLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-primary)' }} />
            {cat.title[currentLang]}
          </div>

          <ul style={{ listStyle: 'none', paddingLeft: '0.2rem' }}>
            {cat.items.map((item) => {
              const isActive = activeTopicId === item.id;
              return (
                <li key={item.id} style={{ marginBottom: '0.2rem' }}>
                  <button
                    onClick={() => {
                      onSelectTopic(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: isActive ? 'var(--brand-glow)' : 'transparent',
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                      border: 'none',
                      borderLeft: isActive ? '3px solid var(--brand-primary)' : '3px solid transparent',
                      padding: '0.42rem 0.65rem',
                      borderRadius: '0 8px 8px 0',
                      cursor: 'pointer',
                      fontSize: '0.84rem',
                      fontWeight: isActive ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title[currentLang]}
                    </span>
                    {item.badge && (
                      <span
                        className={`badge badge-${isActive ? 'red' : item.badgeType || 'emerald'}`}
                        style={{ fontSize: '0.62rem', padding: '0.08rem 0.4rem', flexShrink: 0 }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
};
