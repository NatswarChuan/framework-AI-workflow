import React, { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  caption?: string;
  theme?: 'dark' | 'light';
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  chart,
  caption,
  theme = 'dark',
}) => {
  const reactId = useId().replace(/:/g, '');
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [renderFailed, setRenderFailed] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: theme === 'dark' ? 'dark' : 'default',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    });

    const renderId = `mermaid-${reactId}-${theme}-${Math.random().toString(36).slice(2, 7)}`;
    mermaid
      .render(renderId, chart)
      .then(({ svg }) => {
        if (active && mountedRef.current) {
          setSvgMarkup(svg);
          setRenderFailed(false);
        }
      })
      .catch(() => {
        if (active && mountedRef.current) {
          setRenderFailed(true);
        }
      });

    return () => {
      active = false;
    };
  }, [chart, theme, reactId]);

  return (
    <div className="mermaid-card">
      {caption && <div className="mermaid-caption">{caption}</div>}
      {renderFailed ? (
        <pre style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{chart}</pre>
      ) : (
        <div
          className="mermaid-svg-wrap"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      )}
    </div>
  );
};
