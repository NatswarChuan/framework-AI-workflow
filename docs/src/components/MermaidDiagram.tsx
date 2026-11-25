import React, { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import mermaid from 'mermaid';
import { SupportedLanguage } from '../types/docs';
import { UI_CONTROLS, pickText } from '../data/locales';

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
  theme?: 'dark' | 'light';
  currentLang?: SupportedLanguage;
}

let renderQueue: Promise<void> = Promise.resolve();

function buildMermaidThemeVars(theme: 'dark' | 'light'): Record<string, string> {
  if (theme === 'dark') {
    return {
      darkMode: 'true',
      background: '#111827',
      primaryColor: '#0f172a',
      primaryTextColor: '#f1f5f9',
      primaryBorderColor: '#34d399',
      secondaryColor: '#1e293b',
      secondaryTextColor: '#e2e8f0',
      secondaryBorderColor: '#38bdf8',
      tertiaryColor: '#1e293b',
      tertiaryTextColor: '#e2e8f0',
      lineColor: '#64748b',
      textColor: '#f1f5f9',
      edgeLabelBackground: '#1e293b',
      actorBkg: '#0f172a',
      actorBorder: '#34d399',
      actorTextColor: '#f1f5f9',
      actorLineColor: '#475569',
      signalColor: '#94a3b8',
      signalTextColor: '#f1f5f9',
      labelBoxBkgColor: '#1e293b',
      labelBoxBorderColor: '#38bdf8',
      labelTextColor: '#f1f5f9',
      noteBkgColor: '#1e293b',
      noteBorderColor: '#fbbf24',
      noteTextColor: '#f1f5f9',
      fontSize: '14px',
      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    };
  }
  return {
    darkMode: 'false',
    background: '#f8fafc',
    primaryColor: '#ecfdf5',
    primaryTextColor: '#0f172a',
    primaryBorderColor: '#059669',
    secondaryColor: '#f0f9ff',
    secondaryTextColor: '#0f172a',
    secondaryBorderColor: '#0284c7',
    tertiaryColor: '#f1f5f9',
    tertiaryTextColor: '#0f172a',
    lineColor: '#475569',
    textColor: '#0f172a',
    edgeLabelBackground: '#e2e8f0',
    actorBkg: '#ecfdf5',
    actorBorder: '#059669',
    actorTextColor: '#0f172a',
    actorLineColor: '#64748b',
    signalColor: '#334155',
    signalTextColor: '#0f172a',
    labelBoxBkgColor: '#f0f9ff',
    labelBoxBorderColor: '#0284c7',
    labelTextColor: '#0f172a',
    noteBkgColor: '#fef3c7',
    noteBorderColor: '#d97706',
    noteTextColor: '#0f172a',
    fontSize: '14px',
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
  };
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  caption,
  theme = 'dark',
  currentLang = 'en',
}) => {
  const reactId = useId().replace(/:/g, '');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [renderFailed, setRenderFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const mountedRef = useRef(true);
  const isSequence = chart.trim().startsWith('sequenceDiagram');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!zoomed) {
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setZoomed(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [zoomed]);

  useEffect(() => {
    let active = true;
    const renderId = `mermaid-${reactId}-${theme}-${Math.random().toString(36).slice(2, 7)}`;

    const runRender = async () => {
      if (!active || !mountedRef.current) {
        return;
      }
      try {
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          themeVariables: buildMermaidThemeVars(theme),
          fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          flowchart: {
            htmlLabels: false,
            useMaxWidth: true,
            curve: 'basis',
            padding: 14,
            nodeSpacing: 34,
            rankSpacing: 44,
          },
          sequence: {
            useMaxWidth: false,
            actorMargin: 48,
            messageMargin: 36,
            boxMargin: 12,
          },
        });
        const { svg } = await mermaid.render(renderId, chart);
        if (active && mountedRef.current) {
          setSvgMarkup(svg);
          setRenderFailed(false);
        }
      } catch {
        const orphan = document.getElementById(`d${renderId}`);
        if (orphan) {
          orphan.remove();
        }
        if (active && mountedRef.current) {
          setRenderFailed(true);
        }
      }
    };

    renderQueue = renderQueue.then(runRender, runRender);

    return () => {
      active = false;
    };
  }, [chart, theme, reactId]);

  return (
    <>
      <div className="mermaid-card">
        <div className="mermaid-card-header">
          {caption ? <div className="mermaid-caption">{caption}</div> : <span />}
          {svgMarkup && !renderFailed && (
            <button
              type="button"
              className="mermaid-zoom-btn"
              onClick={() => setZoomed(true)}
              aria-label={pickText(UI_CONTROLS.zoomDiagramLabel, currentLang)}
              title={pickText(UI_CONTROLS.zoomDiagramLabel, currentLang)}
            >
              <Maximize2 size={13} />
            </button>
          )}
        </div>
        {renderFailed ? (
          <pre style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', overflowX: 'auto' }}>
            {chart}
          </pre>
        ) : !svgMarkup ? (
          <div className="mermaid-skeleton" aria-hidden="true" />
        ) : (
          <div
            className={`mermaid-svg-wrap ${isSequence ? 'mermaid-sequence' : ''}`}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
          />
        )}
      </div>

      {zoomed && svgMarkup && (
        <div
          className="mermaid-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? pickText(UI_CONTROLS.zoomDiagramLabel, currentLang)}
          onClick={() => setZoomed(false)}
        >
          <div className="mermaid-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <div className="mermaid-lightbox-bar">
              <span className="mermaid-caption" style={{ marginBottom: 0 }}>
                {caption}
              </span>
              <button
                type="button"
                className="nav-icon-btn"
                onClick={() => setZoomed(false)}
                aria-label={pickText(UI_CONTROLS.closeZoomLabel, currentLang)}
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="mermaid-lightbox-body"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>
        </div>
      )}
    </>
  );
};
