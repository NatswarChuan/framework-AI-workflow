import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Info, Lightbulb, ShieldAlert, X } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { UI_LABELS, pickText } from '../data/locales';

interface GuardrailHintIconProps {
  type?: 'security' | 'warning' | 'tip' | 'note';
  currentLang: SupportedLanguage;
  title?: string;
  children: React.ReactNode;
}

export const GuardrailHintIcon: React.FC<GuardrailHintIconProps> = ({
  type = 'security',
  currentLang,
  title,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const leaveTimerRef = useRef<number | null>(null);

  const open = pinned || hovered;
  const headingLabel = title ?? pickText(UI_LABELS.stepNotes, currentLang);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleOutside = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setPinned(false);
        setHovered(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(false);
        setHovered(false);
        buttonRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current !== null) {
        window.clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimerRef.current = window.setTimeout(() => {
      setHovered(false);
    }, 120);
  };

  const renderIcon = (size: number) => {
    if (type === 'warning') {
      return <AlertTriangle size={size} aria-hidden="true" />;
    }
    if (type === 'tip') {
      return <Lightbulb size={size} aria-hidden="true" />;
    }
    if (type === 'note') {
      return <Info size={size} aria-hidden="true" />;
    }
    return <ShieldAlert size={size} aria-hidden="true" />;
  };

  return (
    <div
      ref={wrapRef}
      className="guardrail-hint-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`guardrail-icon-btn guardrail-${type} ${open ? 'is-open' : ''}`}
        aria-label={headingLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        title={headingLabel}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (!wrapRef.current?.contains(event.relatedTarget as Node)) {
            setHovered(false);
          }
        }}
        onClick={() => setPinned((prev) => !prev)}
      >
        {renderIcon(16)}
      </button>

      {open && (
        <div
          className={`guardrail-tooltip-panel guardrail-panel-${type}`}
          role="tooltip"
          aria-label={headingLabel}
        >
          <div className="guardrail-tooltip-header">
            <span className="guardrail-tooltip-title">
              {renderIcon(14)}
              <span>{headingLabel}</span>
            </span>
            {pinned && (
              <button
                type="button"
                className="guardrail-tooltip-close"
                aria-label={headingLabel}
                onClick={() => {
                  setPinned(false);
                  setHovered(false);
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="guardrail-tooltip-body">{children}</div>
        </div>
      )}
    </div>
  );
};
