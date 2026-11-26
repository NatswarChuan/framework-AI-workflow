import React from 'react';
import { ArrowLeft, ArrowRight, FileCode2 } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { ALL_NAV_ITEMS } from '../data/navigation';
import { STORY_STEPS, STORY_UI } from '../data/storySteps';
import { pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';

interface StoryBannerProps {
  topicId: string;
  currentLang: SupportedLanguage;
  onSelectTopic?: (topicId: string) => void;
}

export const StoryBanner: React.FC<StoryBannerProps> = ({
  topicId,
  currentLang,
  onSelectTopic,
}) => {
  const step = STORY_STEPS[topicId];
  if (!step) {
    return null;
  }

  const prevNav = step.prevTopicId
    ? ALL_NAV_ITEMS.find((i) => i.id === step.prevTopicId)
    : undefined;
  const nextNav = step.nextTopicId
    ? ALL_NAV_ITEMS.find((i) => i.id === step.nextTopicId)
    : undefined;

  return (
    <aside className="story-banner" aria-label={pickText(STORY_UI.bannerTitle, currentLang)}>
      <div className="story-banner-top">
        <span className="story-step-pill">
          {pickText(STORY_UI.stepLabel, currentLang)} {step.stepNumber} / {step.totalSteps}
        </span>
        <span className="story-banner-title">
          {pickText(STORY_UI.bannerTitle, currentLang)}
        </span>
      </div>

      <p className="story-banner-desc">{pickText(step.story, currentLang)}</p>

      <div className="story-banner-footer">
        <span className="story-file-ref">
          <FileCode2 size={13} aria-hidden="true" />
          <code>{step.verifiedFile}</code>
        </span>
        <div className="story-nav-links">
          {prevNav && (
            <a
              className="story-nav-link"
              href={buildTopicHref(prevNav.id, currentLang)}
              onClick={(event) => {
                if (!onSelectTopic || !isPlainLeftClick(event)) {
                  return;
                }
                event.preventDefault();
                onSelectTopic(prevNav.id);
              }}
            >
              <ArrowLeft size={13} className="rtl-flip-icon" aria-hidden="true" />
              <span>
                {pickText(STORY_UI.prevStep, currentLang)}: {pickText(prevNav.label, currentLang)}
              </span>
            </a>
          )}
          {nextNav && (
            <a
              className="story-nav-link story-nav-link-next"
              href={buildTopicHref(nextNav.id, currentLang)}
              onClick={(event) => {
                if (!onSelectTopic || !isPlainLeftClick(event)) {
                  return;
                }
                event.preventDefault();
                onSelectTopic(nextNav.id);
              }}
            >
              <span>
                {pickText(STORY_UI.nextStep, currentLang)}: {pickText(nextNav.label, currentLang)}
              </span>
              <ArrowRight size={13} className="rtl-flip-icon" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
};
