import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { NAVIGATION_STAGES } from '../data/navigation';
import { UI_CONTROLS, pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface SidebarProps {
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  currentLang: SupportedLanguage;
  open: boolean;
  onCloseMobile: () => void;
}

const MOBILE_QUICK_LINKS: Array<{
  id: string;
  labelKey: 'navShortDocs' | 'navShortAnnotations' | 'navShortApis' | 'navShortAgentKit';
  match: (topicId: string) => boolean;
}> = [
  {
    id: 'overview',
    labelKey: 'navShortDocs',
    match: (id) =>
      id === 'overview' ||
      id === 'quickstart' ||
      id === 'two-directory' ||
      id === 'dynamic-proxy' ||
      id === 'escape-hatch',
  },
  {
    id: 'annotations',
    labelKey: 'navShortAnnotations',
    match: (id) => id === 'annotations' || id.startsWith('annotations-'),
  },
  {
    id: 'endpoints',
    labelKey: 'navShortApis',
    match: (id) => id === 'endpoints' || id.startsWith('endpoints-') || id === 'custom-endpoints',
  },
  {
    id: 'ai-agent-kit',
    labelKey: 'navShortAgentKit',
    match: (id) => id === 'ai-agent-kit',
  },
];

function findStageIdForTopic(topicId: string): string | null {
  const matched = NAVIGATION_STAGES.find((stage) =>
    stage.items.some((item) => item.id === topicId)
  );
  if (matched) {
    return matched.id;
  }
  return NAVIGATION_STAGES[0]?.id ?? null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTopicId,
  onSelectTopic,
  currentLang,
  open,
  onCloseMobile,
}) => {
  const [expandedStageIds, setExpandedStageIds] = useState<Set<string>>(() => {
    const initial = findStageIdForTopic(activeTopicId);
    return initial ? new Set([initial]) : new Set();
  });

  useEffect(() => {
    const activeStage = findStageIdForTopic(activeTopicId);
    if (!activeStage) {
      return;
    }
    setExpandedStageIds((prev) => {
      if (prev.has(activeStage)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(activeStage);
      return next;
    });
  }, [activeTopicId]);

  const toggleStage = (stageId: string) => {
    setExpandedStageIds((prev) => {
      const next = new Set(prev);
      if (next.has(stageId)) {
        next.delete(stageId);
      } else {
        next.add(stageId);
      }
      return next;
    });
  };

  return (
    <>
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`doc-sidebar ${open ? 'open' : ''}`}
        aria-label={pickText(UI_CONTROLS.sidebarNavLabel, currentLang)}
      >
        <nav className="sidebar-mobile-quick-links" aria-label={pickText(UI_CONTROLS.sidebarNavLabel, currentLang)}>
          {MOBILE_QUICK_LINKS.map((link) => {
            const isActive = link.match(activeTopicId);
            return (
              <a
                key={link.id}
                href={buildTopicHref(link.id, currentLang)}
                className={`sidebar-mobile-quick-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) {
                    onCloseMobile();
                    return;
                  }
                  event.preventDefault();
                  onSelectTopic(link.id);
                  onCloseMobile();
                }}
              >
                {pickText(UI_CONTROLS[link.labelKey], currentLang)}
              </a>
            );
          })}
          <a
            href="https://github.com/NatswarChuan/Spring-NWVMC"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-mobile-quick-link"
            onClick={() => onCloseMobile()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.65 3.01 8.59 7.19 9.98.53.1.72-.23.72-.5 0-.25-.01-1.08-.01-1.96-2.92.63-3.54-1.24-3.54-1.24-.48-1.21-1.17-1.53-1.17-1.53-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.09-.68.37-1.15.67-1.41-2.33-.26-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.09-2.82-.11-.27-.47-1.35.1-2.81 0 0 .89-.28 2.9 1.08.84-.23 1.75-.35 2.65-.35.9 0 1.81.12 2.65.35 2.01-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.54.1 2.81.68.74 1.09 1.67 1.09 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96 0 1.42-.01 2.56-.01 2.91 0 .28.19.61.73.5A10.51 10.51 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </nav>

        {NAVIGATION_STAGES.map((stage) => {
          const isExpanded = expandedStageIds.has(stage.id);
          const hasActiveTopic = stage.items.some((item) => item.id === activeTopicId);
          return (
            <div key={stage.id} className="sidebar-stage-group">
              <button
                type="button"
                className={`sidebar-stage-btn ${isExpanded ? 'expanded' : ''} ${hasActiveTopic ? 'has-active' : ''}`}
                onClick={() => toggleStage(stage.id)}
                aria-expanded={isExpanded}
              >
                <span className="sidebar-stage-label-wrap">
                  {hasActiveTopic && !isExpanded && (
                    <span className="sidebar-stage-active-dot" aria-hidden="true" />
                  )}
                  <span>{pickText(stage.title, currentLang)}</span>
                </span>
                {isExpanded ? (
                  <ChevronDown size={14} style={{ flexShrink: 0 }} />
                ) : (
                  <ChevronRight size={14} className="rtl-flip-icon" style={{ flexShrink: 0 }} />
                )}
              </button>

              {isExpanded && (
                <div className="sidebar-stage-items">
                  {stage.items.map((item) => {
                    const isActive = item.id === activeTopicId;
                    return (
                      <a
                        key={item.id}
                        href={buildTopicHref(item.id, currentLang)}
                        data-nav-topic={item.id}
                        aria-current={isActive ? 'page' : undefined}
                        className={`sidebar-item-btn ${item.isSubPage ? 'sidebar-item-sub' : ''} ${isActive ? 'active' : ''}`}
                        onClick={(event) => {
                          if (!isPlainLeftClick(event)) {
                            onCloseMobile();
                            return;
                          }
                          event.preventDefault();
                          onSelectTopic(item.id);
                          onCloseMobile();
                        }}
                      >
                        {item.isSubPage && <span className="sidebar-sub-dot" aria-hidden="true" />}
                        <span>{pickText(item.label, currentLang)}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </aside>
    </>
  );
};
