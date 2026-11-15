import React, { useMemo, useState } from 'react';
import { SupportedLanguage } from '../types/docs';
import { ANNOTATIONS_DATA } from '../data/annotationsData';
import { DocPageHeader } from '../components/DocPageHeader';
import { CodeBlock } from '../components/CodeBlock';
import { Callout } from '../components/Callout';
import { UI_LABELS, pickText } from '../data/locales';

interface PageProps {
  currentLang: SupportedLanguage;
}

type AnnotationFilter = 'all' | 'routing' | 'bean' | 'entity' | 'resilience';

const CATEGORY_BADGE: Record<Exclude<AnnotationFilter, 'all'>, string> = {
  routing: 'badge badge-emerald',
  bean: 'badge badge-blue',
  entity: 'badge badge-purple',
  resilience: 'badge badge-amber',
};

export const AnnotationsPage: React.FC<PageProps> = ({ currentLang }) => {
  const [category, setCategory] = useState<AnnotationFilter>('all');
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState(ANNOTATIONS_DATA[0].name);

  const counts = useMemo(() => {
    const grouped = { routing: 0, bean: 0, entity: 0, resilience: 0 };
    for (const item of ANNOTATIONS_DATA) {
      grouped[item.category] += 1;
    }
    return grouped;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ANNOTATIONS_DATA.filter((item) => {
      if (category !== 'all' && item.category !== category) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        item.name.toLowerCase().includes(q) ||
        item.attributes.toLowerCase().includes(q) ||
        pickText(item.purpose, currentLang).toLowerCase().includes(q)
      );
    });
  }, [category, search, currentLang]);

  const activeSpec =
    ANNOTATIONS_DATA.find((item) => item.name === selectedName) ?? filtered[0] ?? ANNOTATIONS_DATA[0];

  return (
    <article className="doc-page">
      <DocPageHeader
        topicId="annotations"
        currentLang={currentLang}
        badges={[
          { label: `${ANNOTATIONS_DATA.length} Pure Java Annotations`, tone: 'emerald' },
          { label: 'Zero Spring Web Imports', tone: 'blue' },
          { label: 'Controller & Entity Targets', tone: 'purple' },
        ]}
      />

      <h2 id="annotations-catalog" className="section-heading">
        {pickText(UI_LABELS.stepGoal, currentLang)}
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        All <strong>{ANNOTATIONS_DATA.length} framework annotations</strong> live inside pure Java packages (<code>core/annotation/</code>, <code>module/datasource/annotation/</code>, <code>module/lock/annotation/</code>, <code>module/webhook/annotation/</code>) with zero compile-time dependency on <code>org.springframework.web.*</code>.
      </p>

      <div className="filter-bar">
        <button
          type="button"
          className={`filter-pill-btn ${category === 'all' ? 'active' : ''}`}
          onClick={() => setCategory('all')}
        >
          All ({ANNOTATIONS_DATA.length})
        </button>
        <button
          type="button"
          className={`filter-pill-btn ${category === 'routing' ? 'active' : ''}`}
          onClick={() => setCategory('routing')}
        >
          Routing ({counts.routing})
        </button>
        <button
          type="button"
          className={`filter-pill-btn ${category === 'bean' ? 'active' : ''}`}
          onClick={() => setCategory('bean')}
        >
          Beans ({counts.bean})
        </button>
        <button
          type="button"
          className={`filter-pill-btn ${category === 'entity' ? 'active' : ''}`}
          onClick={() => setCategory('entity')}
        >
          Entity ({counts.entity})
        </button>
        <button
          type="button"
          className={`filter-pill-btn ${category === 'resilience' ? 'active' : ''}`}
          onClick={() => setCategory('resilience')}
        >
          Resilience ({counts.resilience})
        </button>

        <input
          type="text"
          className="filter-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter annotation (@ServiceOverride, @Idempotent, @FieldSecurity...)"
        />
      </div>

      <h2 id="annotations-matrix" className="section-heading">
        {pickText(UI_LABELS.stepConfig, currentLang)}
      </h2>

      <div className="table-scroll" style={{ maxHeight: '390px', overflowY: 'auto' }}>
        <table className="doc-table">
          <thead>
            <tr>
              <th>Annotation</th>
              <th>Group</th>
              <th>Target</th>
              <th>Attributes &amp; Defaults</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const selected = item.name === activeSpec.name;
              return (
                <tr
                  key={item.name}
                  onClick={() => setSelectedName(item.name)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selected ? 'var(--accent-soft)' : undefined,
                  }}
                >
                  <td><code>{item.name}</code></td>
                  <td>
                    <span className={CATEGORY_BADGE[item.category]}>{item.category}</span>
                  </td>
                  <td><code>{item.target}</code></td>
                  <td>{item.attributes}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 id="annotations-inspector" className="section-heading">
        {pickText(UI_LABELS.stepImplementation, currentLang)} — <code>{activeSpec.name}</code>
      </h2>
      <p style={{ color: 'var(--text-secondary)' }}>
        <strong>Purpose:</strong> {pickText(activeSpec.purpose, currentLang)}
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        <strong>Runtime Behavior:</strong> {pickText(activeSpec.runtimeBehavior, currentLang)}
      </p>

      <CodeBlock
        currentLang={currentLang}
        language="java"
        fileName={`${activeSpec.name.replace('@', '')}Usage.java`}
        code={activeSpec.syntaxSample}
      />

      <Callout type="note" currentLang={currentLang}>
        Click any row in the annotation table above to inspect its exact verified attributes, runtime bridge hook, and copyable Java usage snippet.
      </Callout>
    </article>
  );
};
