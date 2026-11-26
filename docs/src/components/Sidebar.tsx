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

export const Sidebar: React.FC<SidebarProps> = ({
  activeTopicId,
  onSelectTopic,
  currentLang,
  open,
  onCloseMobile,
}) => {
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const activeStage = NAVIGATION_STAGES.find((stage) =>
      stage.items.some((item) => item.id === activeTopicId)
    );
    if (activeStage) {
      setCollapsedStages((prev) => (prev[activeStage.id] ? { ...prev, [activeStage.id]: false } : prev));
    }
  }, [activeTopicId]);

  const toggleStage = (stageId: string) => {
    setCollapsedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
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
          const isCollapsed = Boolean(collapsedStages[stage.id]);
          return (
            <div key={stage.id} className="sidebar-stage-group">
              <button
                type="button"
                className="sidebar-stage-btn"
                onClick={() => toggleStage(stage.id)}
                aria-expanded={!isCollapsed}
              >
                <span>{pickText(stage.title, currentLang)}</span>
                {isCollapsed ? (
                  <ChevronRight size={14} className="rtl-flip-icon" style={{ flexShrink: 0 }} />
                ) : (
                  <ChevronDown size={14} style={{ flexShrink: 0 }} />
                )}
              </button>

              {!isCollapsed && (
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
