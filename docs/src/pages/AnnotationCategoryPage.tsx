import React from 'react';
import { AnnotationSpec, SupportedLanguage } from '../types/docs';
import { DocPageHeader } from '../components/DocPageHeader';
import { AnnotationWorkbench } from '../components/AnnotationWorkbench';
import { CATEGORY_TO_TOPIC_ID } from './AnnotationsPage';

interface AnnotationCategoryPageProps {
  topicId: string;
  category: AnnotationSpec['category'];
  currentLang: SupportedLanguage;
  initialAnnotationName?: string;
  onNavigateTopic: (topicId: string) => void;
}

export const AnnotationCategoryPage: React.FC<AnnotationCategoryPageProps> = ({
  topicId,
  category,
  currentLang,
  initialAnnotationName,
  onNavigateTopic,
}) => {
  return (
    <article className="doc-page doc-page-wide">
      <DocPageHeader
        topicId={topicId}
        currentLang={currentLang}
        onNavigateTopic={onNavigateTopic}
      />

      <AnnotationWorkbench
        currentLang={currentLang}
        activeCategory={category}
        initialAnnotationName={initialAnnotationName}
        onSelectCategory={(nextCategory) =>
          onNavigateTopic(
            nextCategory === 'all' ? 'annotations' : CATEGORY_TO_TOPIC_ID[nextCategory],
          )
        }
      />
    </article>
  );
};
