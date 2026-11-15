import React, { useMemo, useState } from 'react';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { SupportedLanguage } from '../types/docs';
import { pickText } from '../data/locales';
import { CodeBlock } from './CodeBlock';

interface InteractiveEndpointExplorerProps {
  currentLang: SupportedLanguage;
}

const METHOD_BADGE_CLASS: Record<string, string> = {
  GET: 'badge badge-emerald',
  POST: 'badge badge-blue',
  PUT: 'badge badge-amber',
  PATCH: 'badge badge-purple',
  DELETE: 'badge badge-rose',
};

export const InteractiveEndpointExplorer: React.FC<InteractiveEndpointExplorerProps> = ({
  currentLang,
}) => {
  const [groupFilter, setGroupFilter] = useState<'all' | 'read' | 'write' | 'enterprise'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(ENDPOINTS_DATA[0].id);

  const visibleEndpoints = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return ENDPOINTS_DATA.filter((ep) => {
      if (groupFilter !== 'all' && ep.group !== groupFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        ep.path.toLowerCase().includes(q) ||
        ep.methodName.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        pickText(ep.summary, currentLang).toLowerCase().includes(q)
      );
    });
  }, [groupFilter, searchTerm, currentLang]);

  const activeEndpoint =
    ENDPOINTS_DATA.find((ep) => ep.id === selectedId) ?? visibleEndpoints[0] ?? ENDPOINTS_DATA[0];

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className="filter-bar">
        {(['all', 'read', 'write', 'enterprise'] as const).map((group) => (
          <button
            key={group}
            type="button"
            className={`filter-pill-btn ${groupFilter === group ? 'active' : ''}`}
            onClick={() => setGroupFilter(group)}
          >
            {group === 'all' && `All (${ENDPOINTS_DATA.length})`}
            {group === 'read' && 'Read (17)'}
            {group === 'write' && 'Write (11)'}
            {group === 'enterprise' && 'Enterprise (12)'}
          </button>
        ))}

        <input
          type="text"
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter path or method (/keyset, zod, upsert, patch)..."
        />
      </div>

      <div className="table-scroll" style={{ maxHeight: '360px', overflowY: 'auto' }}>
        <table className="doc-table">
          <thead>
            <tr>
              <th>HTTP</th>
              <th>Sub-Path</th>
              <th>Java Contract</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {visibleEndpoints.map((ep) => {
              const isSelected = ep.id === activeEndpoint.id;
              return (
                <tr
                  key={ep.id}
                  onClick={() => setSelectedId(ep.id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--accent-soft)' : undefined,
                  }}
                >
                  <td>
                    <span className={METHOD_BADGE_CLASS[ep.method] ?? 'badge'}>{ep.method}</span>
                  </td>
                  <td>
                    <code>{ep.path || '/'}</code>
                    {ep.hiddenInSwagger && (
                      <span className="badge badge-amber" style={{ marginInlineStart: '0.4rem' }}>
                        @Hidden
                      </span>
                    )}
                  </td>
                  <td>
                    <code>{ep.methodName}</code>
                  </td>
                  <td>{pickText(ep.summary, currentLang)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeEndpoint && (
        <CodeBlock
          currentLang={currentLang}
          tabs={[
            {
              id: 'req',
              label: 'HTTP Request',
              language: 'bash',
              fileName: `${activeEndpoint.method} ${activeEndpoint.path || '/'}`,
              code: activeEndpoint.sampleRequest,
            },
            {
              id: 'res',
              label: 'Response Payload',
              language: 'json',
              fileName: activeEndpoint.methodName,
              code: activeEndpoint.sampleResponse,
            },
          ]}
        />
      )}
    </div>
  );
};
