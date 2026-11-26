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
  blueprint?: boolean;
}

let renderQueue: Promise<void> = Promise.resolve();

function buildMermaidThemeVars(theme: 'dark' | 'light'): Record<string, string> {
  if (theme === 'dark') {
    return {
      darkMode: 'true',
      background: '#0B0D14',
      primaryColor: '#121522',
      primaryTextColor: '#E6EAF5',
      primaryBorderColor: '#22D3EE',
      secondaryColor: '#181C2E',
      secondaryTextColor: '#E6EAF5',
      secondaryBorderColor: '#FF3B8B',
      tertiaryColor: '#181C2E',
      tertiaryTextColor: '#E6EAF5',
      lineColor: '#22D3EE',
      textColor: '#E6EAF5',
      edgeLabelBackground: '#121522',
      actorBkg: '#121522',
      actorBorder: '#22D3EE',
      actorTextColor: '#E6EAF5',
      actorLineColor: '#323A58',
      signalColor: '#22D3EE',
      signalTextColor: '#E6EAF5',
      labelBoxBkgColor: '#121522',
      labelBoxBorderColor: '#262C44',
      labelTextColor: '#E6EAF5',
      noteBkgColor: '#181C2E',
      noteBorderColor: '#FF3B8B',
      noteTextColor: '#E6EAF5',
      fontSize: '14px',
      fontFamily: 'Be Vietnam Pro, Inter, system-ui, sans-serif',
    };
  }
  return {
    darkMode: 'false',
    background: '#FFFFFF',
    primaryColor: '#F0FAFF',
    primaryTextColor: '#11131D',
    primaryBorderColor: '#0369A1',
    secondaryColor: '#FFF5F9',
    secondaryTextColor: '#11131D',
    secondaryBorderColor: '#D61F69',
    tertiaryColor: '#F6F7FB',
    tertiaryTextColor: '#11131D',
    lineColor: '#0369A1',
    textColor: '#11131D',
    edgeLabelBackground: '#F6F7FB',
    actorBkg: '#F0FAFF',
    actorBorder: '#0369A1',
    actorTextColor: '#11131D',
    actorLineColor: '#64748B',
    signalColor: '#0369A1',
    signalTextColor: '#11131D',
    labelBoxBkgColor: '#F0FAFF',
    labelBoxBorderColor: '#0369A1',
    labelTextColor: '#11131D',
    noteBkgColor: '#FFF5F9',
    noteBorderColor: '#D61F69',
    noteTextColor: '#11131D',
    fontSize: '14px',
    fontFamily: 'Be Vietnam Pro, Inter, system-ui, sans-serif',
  };
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  caption,
  theme = 'dark',
  currentLang = 'en',
  blueprint = true,
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
          fontFamily: 'Be Vietnam Pro, Inter, system-ui, sans-serif',
          flowchart: {
            htmlLabels: false,
            useMaxWidth: true,
            curve: 'basis',
            padding: 14,
            nodeSpacing: 32,
            rankSpacing: 42,
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
      <div className={`mermaid-card ${blueprint ? 'mermaid-blueprint' : ''}`}>
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
