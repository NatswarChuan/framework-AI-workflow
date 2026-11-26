import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, X } from 'lucide-react';
import { EndpointSpec, SupportedLanguage } from '../types/docs';
import { ENDPOINTS_DATA } from '../data/endpointsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { RichDocText } from '../components/RichDocText';
import { UI_CONTROLS, pickText } from '../data/locales';
import { HUB_CONTENT } from '../data/hubContent';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface EndpointGroupPageProps {
  topicId: string;
  group: EndpointSpec['group'];
  currentLang: SupportedLanguage;
  initialEndpointId?: string;
  onNavigateTopic: (topicId: string) => void;
}

const METHOD_BADGE_CLASS: Record<string, string> = {
  GET: 'badge badge-blue',
  POST: 'badge badge-emerald',
  PUT: 'badge badge-purple',
  PATCH: 'badge badge-amber',
  DELETE: 'badge badge-rose',
};

export const EndpointGroupPage: React.FC<EndpointGroupPageProps> = ({
  topicId,
  group,
  currentLang,
  initialEndpointId,
  onNavigateTopic,
}) => {
  const groupEndpoints = useMemo(
    () => ENDPOINTS_DATA.filter((ep) => ep.group === group),
    [group],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(
    initialEndpointId && groupEndpoints.some((ep) => ep.id === initialEndpointId)
      ? initialEndpointId
      : groupEndpoints[0].id,
  );

  useEffect(() => {
    setSearchTerm('');
    if (initialEndpointId && groupEndpoints.some((ep) => ep.id === initialEndpointId)) {
      setSelectedId(initialEndpointId);
    } else if (!groupEndpoints.some((ep) => ep.id === selectedId)) {
      setSelectedId(groupEndpoints[0].id);
    }
  }, [group, initialEndpointId, groupEndpoints]);

  const visibleEndpoints = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) {
      return groupEndpoints;
    }
    return groupEndpoints.filter(
      (ep) =>
        ep.path.toLowerCase().includes(q) ||
        ep.methodName.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        pickText(ep.summary, currentLang).toLowerCase().includes(q),
    );
  }, [groupEndpoints, searchTerm, currentLang]);

  const activeEndpoint = selectedId
    ? (visibleEndpoints.find((ep) => ep.id === selectedId) ?? null)
    : null;

  const handleToggleRow = (id: string) => {
    setSelectedId((prev) => (prev === id ? '' : id));
  };

  return (
    <article className="doc-page">
      <a
        href={buildTopicHref('endpoints', currentLang)}
        className="back-hub-link"
        onClick={(event) => {
          if (!isPlainLeftClick(event)) {
            return;
          }
          event.preventDefault();
          onNavigateTopic('endpoints');
        }}
      >
        <ArrowLeft size={14} className="rtl-flip-icon" aria-hidden="true" />
        <span>{pickText(HUB_CONTENT.backToEndpointsHub, currentLang)}</span>
      </a>

      <DocPageHeader
        topicId={topicId}
        currentLang={currentLang}
        onNavigateTopic={onNavigateTopic}
      />

      <h2 id="group-endpoints-list" className="section-heading">
        {pickText(UI_CONTROLS.colSubPath, currentLang)}
      </h2>

      {groupEndpoints.length > 5 && (
        <div className="filter-bar">
          <div className="filter-search-row">
            <input
              id={`search-${topicId}`}
              name={`search-${topicId}`}
              type="text"
              className="filter-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={pickText(UI_CONTROLS.explorerPlaceholder, currentLang)}
              aria-label={pickText(UI_CONTROLS.explorerPlaceholder, currentLang)}
            />
            {searchTerm && (
              <button
                type="button"
                className="filter-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label={pickText(UI_CONTROLS.clearFilterLabel, currentLang)}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

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
            {visibleEndpoints.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1.25rem' }}>
                  {pickText(UI_CONTROLS.explorerNoResults, currentLang)}
                </td>
              </tr>
            ) : (
              visibleEndpoints.map((ep) => {
                const isSelected = ep.id === activeEndpoint?.id;
                return (
                  <React.Fragment key={ep.id}>
                    <tr
                      tabIndex={0}
                      aria-selected={isSelected}
                      aria-expanded={isSelected}
                      title={pickText(UI_CONTROLS.expandRowHint, currentLang)}
                      className={`interactive-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleToggleRow(ep.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleToggleRow(ep.id);
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
                      <td className="endpoint-contract-cell">
                        <code>{ep.methodName}</code>
                        <ChevronRight size={14} className="ep-expand-chevron rtl-flip-icon" aria-hidden="true" />
                      </td>
                      <td><RichDocText text={ep.summary} currentLang={currentLang} /></td>
                    </tr>
                    {isSelected && (
                      <tr className="ep-expand-row">
                        <td colSpan={4}>
                          <div id="endpoint-live-sample" className="ep-inline-drawer">
                            <p className="ep-inline-summary">
                              <RichDocText text={ep.summary} currentLang={currentLang} />
                            </p>
                            <CodeBlock
                              currentLang={currentLang}
                              tabs={[
                                {
                                  id: 'req',
                                  label: pickText(UI_CONTROLS.tabHttpRequest, currentLang),
                                  language: 'bash',
                                  fileName: `${ep.method} ${ep.path || '/'}`,
                                  code: ep.sampleRequest,
                                },
                                {
                                  id: 'res',
                                  label: pickText(UI_CONTROLS.tabResponsePayload, currentLang),
                                  language: 'json',
                                  fileName: ep.methodName,
                                  code: ep.sampleResponse,
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
};
