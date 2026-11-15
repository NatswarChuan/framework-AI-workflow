import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { NAVIGATION_STAGES } from '../data/navigation';
import { pickText } from '../data/locales';

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

  const toggleStage = (stageId: string) => {
    setCollapsedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  return (
    <aside className={`doc-sidebar ${open ? 'open' : ''}`} aria-label="Documentation Navigation">
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
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
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
                      className={`sidebar-item-btn ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        onSelectTopic(item.id);
                        onCloseMobile();
                      }}
                    >
                      <span>{pickText(item.label, currentLang)}</span>
                      {item.badge && <span className="sidebar-item-badge">{item.badge}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};
