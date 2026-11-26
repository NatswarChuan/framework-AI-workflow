import React from 'react';
import { FullLocalizedText, SupportedLanguage } from '../types/docs';

interface RichDocTextProps {
  text: FullLocalizedText | string;
  currentLang?: SupportedLanguage;
}

export const RichDocText: React.FC<RichDocTextProps> = ({ text, currentLang = 'en' }) => {
  const raw = typeof text === 'string' ? text : text[currentLang] ?? text.en;
  const segments = raw.split(/(\*\*`[^`]+`\*\*|`[^`]+`|\*\*[^*]+\*\*)/g);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.startsWith('**`') && segment.endsWith('`**') && segment.length >= 6) {
          return (
            <strong key={index}>
              <bdi dir="ltr" className="inline-code-bdi">
                <code>{segment.slice(3, -3)}</code>
              </bdi>
            </strong>
          );
        }
        if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
          return (
            <bdi key={index} dir="ltr" className="inline-code-bdi">
              <code>{segment.slice(1, -1)}</code>
            </bdi>
          );
        }
        if (segment.startsWith('**') && segment.endsWith('**') && segment.length >= 4) {
          return <strong key={index}>{segment.slice(2, -2)}</strong>;
        }
        return <React.Fragment key={index}>{segment}</React.Fragment>;
      })}
    </>
  );
};
