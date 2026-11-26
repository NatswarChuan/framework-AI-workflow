import React from 'react';
import { SupportedLanguage } from '../types/docs';

export function buildTopicHref(
  topicId: string,
  lang: SupportedLanguage,
  sectionId?: string,
): string {
  const hashPart = sectionId ? `#${topicId}/${sectionId}` : `#${topicId}`;
  return `?lang=${encodeURIComponent(lang)}${hashPart}`;
}

export function isPlainLeftClick(event: React.MouseEvent<HTMLElement>): boolean {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
