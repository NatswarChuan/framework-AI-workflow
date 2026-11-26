import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { NAVIGATION_STAGES } from '../data/navigation';
import { UI_CONTROLS, pickText } from '../data/locales';

interface SidebarProps {
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  currentLang: SupportedLanguage;
  open: boolean;
  onCloseMobile: () => void;
}

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
  const [expandedStageId, setExpandedStageId] = useState<string | null>(() =>
    findStageIdForTopic(activeTopicId)
  );

  useEffect(() => {
    setExpandedStageId(findStageIdForTopic(activeTopicId));
  }, [activeTopicId]);

  const toggleStage = (stageId: string) => {
    setExpandedStageId((prev) => (prev === stageId ? null : stageId));
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
        {NAVIGATION_STAGES.map((stage) => {
          const isExpanded = expandedStageId === stage.id;
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
                      <button
                        key={item.id}
                        type="button"
                        data-nav-topic={item.id}
                        aria-current={isActive ? 'page' : undefined}
                        className={`sidebar-item-btn ${item.isSubPage ? 'sidebar-item-sub' : ''} ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          onSelectTopic(item.id);
                          onCloseMobile();
                        }}
                      >
                        {item.isSubPage && <span className="sidebar-sub-dot" aria-hidden="true" />}
                        <span>{pickText(item.label, currentLang)}</span>
                      </button>
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
