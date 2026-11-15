export type SupportedLanguage =
  | 'en'
  | 'zh'
  | 'hi'
  | 'es'
  | 'fr'
  | 'ar'
  | 'bn'
  | 'pt'
  | 'ru'
  | 'ur'
  | 'id'
  | 'de'
  | 'ja'
  | 'vi'
  | 'ko'
  | 'tr'
  | 'it'
  | 'th'
  | 'fa'
  | 'pl';

export interface LanguageMeta {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
  rtl: boolean;
}

export type LocalizedText = Partial<Record<SupportedLanguage, string>> & {
  en: string;
};

export interface NavItem {
  id: string;
  stageId: string;
  label: LocalizedText;
  summary: LocalizedText;
  keywords: string[];
  badge?: string;
}

export interface NavStage {
  id: string;
  stageNumber: number;
  title: LocalizedText;
  items: NavItem[];
}

export interface TocHeading {
  id: string;
  title: string;
  level: number;
}

export interface CodeTab {
  id: string;
  label: string;
  language: string;
  fileName?: string;
  code: string;
  highlightLines?: number[];
}

export interface EndpointSpec {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  methodName: string;
  group: 'read' | 'write' | 'enterprise';
  hiddenInSwagger?: boolean;
  summary: LocalizedText;
  sampleRequest: string;
  sampleResponse: string;
}

export interface AnnotationSpec {
  name: string;
  category: 'routing' | 'bean' | 'entity' | 'resilience';
  target: string;
  purpose: LocalizedText;
  attributes: string;
  syntaxSample: string;
  runtimeBehavior: LocalizedText;
}

export interface FilterOperatorSpec {
  operator: string;
  syntax: string;
  sqlEquivalent: string;
  description: LocalizedText;
}
