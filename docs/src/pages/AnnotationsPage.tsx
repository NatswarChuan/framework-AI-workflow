import React from 'react';
import { AnnotationSpec, SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { RichDocText } from '../components/RichDocText';
import { AnnotationWorkbench } from '../components/AnnotationWorkbench';
import { STAGE2_CONTENT } from '../data/pages/stage2Content';

interface AnnotationsHubPageProps {
  currentLang: SupportedLanguage;
  initialAnnotationName?: string;
  onNavigateTopic: (topicId: string, selectedAnnotation?: string) => void;
}

export const CATEGORY_TO_TOPIC_ID: Record<AnnotationSpec['category'], string> = {
  routing: 'annotations-routing',
  bean: 'annotations-beans',
  entity: 'annotations-entity',
  rbac: 'annotations-rbac',
  resilience: 'annotations-resilience',
};

export const AnnotationsPage: React.FC<AnnotationsHubPageProps> = ({
  currentLang,
  initialAnnotationName,
  onNavigateTopic,
}) => {
  return (
    <article className="doc-page doc-page-wide">
      <DocPageHeader
        topicId="annotations"
        currentLang={currentLang}
        guardrailTip={{
          type: 'note',
          content: <RichDocText text={STAGE2_CONTENT.annCalloutNote} currentLang={currentLang} />,
        }}
      />

      <AnnotationWorkbench
        currentLang={currentLang}
        activeCategory="all"
        initialAnnotationName={initialAnnotationName}
        onSelectCategory={(category) =>
          onNavigateTopic(category === 'all' ? 'annotations' : CATEGORY_TO_TOPIC_ID[category])
        }
      />
    </article>
  );
};
