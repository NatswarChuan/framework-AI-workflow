import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { SupportedLanguage } from '../types/docs';
import { UI_CONTROLS, pickText } from '../data/locales';
import { CodeBlock } from './CodeBlock';

interface InteractiveEndpointExplorerProps {
  currentLang: SupportedLanguage;
  initialEndpointId?: string;
}

const PAGE_SIZE = 10;

const METHOD_BADGE_CLASS: Record<string, string> = {
  GET: 'badge badge-emerald',
  POST: 'badge badge-blue',
  PUT: 'badge badge-amber',
  PATCH: 'badge badge-purple',
  DELETE: 'badge badge-rose',
};

export const InteractiveEndpointExplorer: React.FC<InteractiveEndpointExplorerProps> = ({
  currentLang,
  initialEndpointId,
}) => {
  const [groupFilter, setGroupFilter] = useState<'all' | 'read' | 'write' | 'enterprise' | 'export-import'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(initialEndpointId ?? ENDPOINTS_DATA[0].id);
  const [pageIndex, setPageIndex] = useState(0);
  const [showAllRows, setShowAllRows] = useState(false);

  useEffect(() => {
    if (initialEndpointId && ENDPOINTS_DATA.some((ep) => ep.id === initialEndpointId)) {
      setGroupFilter('all');
      setSearchTerm('');
      setSelectedId(initialEndpointId);
      const targetIdx = ENDPOINTS_DATA.findIndex((ep) => ep.id === initialEndpointId);
      if (targetIdx >= 0) {
        setPageIndex(Math.floor(targetIdx / PAGE_SIZE));
      }
    }
  }, [initialEndpointId]);

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

  const totalPages = Math.max(1, Math.ceil(visibleEndpoints.length / PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);

  const pagedRows = useMemo(() => {
    if (showAllRows) {
      return visibleEndpoints;
    }
    const start = safePageIndex * PAGE_SIZE;
    return visibleEndpoints.slice(start, start + PAGE_SIZE);
  }, [visibleEndpoints, safePageIndex, showAllRows]);

  const activeEndpoint =
    visibleEndpoints.find((ep) => ep.id === selectedId) ?? visibleEndpoints[0] ?? ENDPOINTS_DATA[0];

  return (
    <div style={{ marginTop: '1.15rem' }}>
      <div className="filter-bar">
        <div className="filter-pills-row">
          {(['all', 'read', 'write', 'enterprise', 'export-import'] as const).map((group) => (
            <button
              key={group}
              type="button"
              className={`filter-pill-btn ${groupFilter === group ? 'active' : ''}`}
              onClick={() => {
                setGroupFilter(group);
                setPageIndex(0);
              }}
            >
              {group === 'all' && pickText(UI_CONTROLS.explorerAll, currentLang)}
              {group === 'read' && pickText(UI_CONTROLS.explorerRead, currentLang)}
              {group === 'write' && pickText(UI_CONTROLS.explorerWrite, currentLang)}
              {group === 'enterprise' && pickText(UI_CONTROLS.explorerEnterprise, currentLang)}
              {group === 'export-import' && pickText(UI_CONTROLS.explorerExportImport, currentLang)}
            </button>
          ))}
        </div>

        <div className="filter-search-row">
          <input
            id="endpoints-search"
            name="endpoints-search"
            type="text"
            className="filter-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(0);
            }}
            placeholder={pickText(UI_CONTROLS.explorerPlaceholder, currentLang)}
            aria-label={pickText(UI_CONTROLS.explorerPlaceholder, currentLang)}
          />
          {searchTerm && (
            <button
              type="button"
              className="filter-clear-btn"
              onClick={() => {
                setSearchTerm('');
                setPageIndex(0);
              }}
              aria-label={pickText(UI_CONTROLS.clearFilterLabel, currentLang)}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="table-scroll">
        <table className="doc-table doc-table-compact">
          <thead>
            <tr>
              <th style={{ width: '82px' }}>{pickText(UI_CONTROLS.colHttp, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colSubPath, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colContract, currentLang)}</th>
              <th>{pickText(UI_CONTROLS.colDescription, currentLang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1.25rem' }}>
                  {pickText(UI_CONTROLS.explorerNoResults, currentLang)}
                </td>
              </tr>
            ) : (
              pagedRows.map((ep) => {
                const isSelected = ep.id === activeEndpoint.id;
                return (
                  <tr
                    key={ep.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={`interactive-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedId(ep.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedId(ep.id);
                      }
                    }}
                  >
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className={METHOD_BADGE_CLASS[ep.method] ?? 'badge'}>{ep.method}</span>
                    </td>
                    <td>
                      <span className="endpoint-path-wrap">
                        <code>{ep.path || '/'}</code>
                        {ep.hiddenInSwagger && (
                          <span className="badge badge-amber">@Hidden</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <code>{ep.methodName}</code>
                    </td>
                    <td>{pickText(ep.summary, currentLang)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {visibleEndpoints.length > PAGE_SIZE && (
        <div className="matrix-pagination-bar">
          <span className="matrix-pagination-count">
            {showAllRows
              ? `${visibleEndpoints.length} / ${visibleEndpoints.length}`
              : `${safePageIndex * PAGE_SIZE + 1}–${Math.min(
                  (safePageIndex + 1) * PAGE_SIZE,
                  visibleEndpoints.length,
                )} / ${visibleEndpoints.length}`}
          </span>
          <div className="matrix-pagination-actions">
            {!showAllRows && (
              <>
                <button
                  type="button"
                  className="filter-pill-btn"
                  disabled={safePageIndex <= 0}
                  onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft size={13} className="rtl-flip-icon" />
                  <span>{pickText(UI_CONTROLS.pagePrevLabel, currentLang)}</span>
                </button>
                <span className="matrix-page-indicator">
                  {safePageIndex + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className="filter-pill-btn"
                  disabled={safePageIndex >= totalPages - 1}
                  onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                >
                  <span>{pickText(UI_CONTROLS.pageNextLabel, currentLang)}</span>
                  <ChevronRight size={13} className="rtl-flip-icon" />
                </button>
              </>
            )}
            <button
              type="button"
              className="filter-pill-btn"
              onClick={() => setShowAllRows((prev) => !prev)}
            >
              {pickText(
                showAllRows ? UI_CONTROLS.paginateRowsLabel : UI_CONTROLS.showAllRowsLabel,
                currentLang,
              )}
            </button>
          </div>
        </div>
      )}

      {activeEndpoint && (
        <CodeBlock
          currentLang={currentLang}
          tabs={[
            {
              id: 'req',
              label: pickText(UI_CONTROLS.tabHttpRequest, currentLang),
              language: 'bash',
              fileName: `${activeEndpoint.method} ${activeEndpoint.path || '/'}`,
              code: activeEndpoint.sampleRequest,
            },
            {
              id: 'res',
              label: pickText(UI_CONTROLS.tabResponsePayload, currentLang),
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
