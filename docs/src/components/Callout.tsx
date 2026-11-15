import React from 'react';
import { AlertTriangle, Info, Lightbulb, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { UI_LABELS, pickText } from '../data/locales';

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'security';
  title?: string;
  currentLang?: SupportedLanguage;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  currentLang = 'en',
  children,
}) => {
  const defaultTitleMap = {
    note: pickText(UI_LABELS.calloutNote, currentLang),
    tip: pickText(UI_LABELS.calloutTip, currentLang),
    warning: pickText(UI_LABELS.calloutWarning, currentLang),
    security: pickText(UI_LABELS.calloutSecurity, currentLang),
  };

  const iconMap = {
    note: <Info size={16} style={{ color: 'var(--accent-secondary)' }} />,
    tip: <Lightbulb size={16} style={{ color: 'var(--accent-primary)' }} />,
    warning: <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />,
    security: <ShieldCheck size={16} style={{ color: 'var(--accent-rose)' }} />,
  };

  return (
    <div className={`doc-callout ${type}`}>
      <div className="doc-callout-header">
        {iconMap[type]}
        <span>{title ?? defaultTitleMap[type]}</span>
      </div>
      <div className="doc-callout-body">{children}</div>
    </div>
  );
};
