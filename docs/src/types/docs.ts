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

export type FullLocalizedText = Record<SupportedLanguage, string>;

export interface NavItem {
  id: string;
  stageId: string;
  parentId?: string;
  isSubPage?: boolean;
  label: FullLocalizedText;
  summary: FullLocalizedText;
  keywords: string[];
}

export interface NavStage {
  id: string;
  stageNumber: number;
  title: FullLocalizedText;
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
  group: 'read' | 'write' | 'enterprise' | 'export-import';
  hiddenInSwagger?: boolean;
  summary: FullLocalizedText;
  sampleRequest: string;
  sampleResponse: string;
}

export interface AnnotationAttributeSpec {
  name: string;
  type: string;
  defaultValue: string;
  required: boolean;
  description: FullLocalizedText;
  allowedValues: FullLocalizedText;
  example: string;
  caveat: FullLocalizedText;
}

export interface AnnotationSpec {
  name: string;
  packageName: string;
  category: 'routing' | 'bean' | 'entity' | 'rbac' | 'resilience';
  target: string;
  purpose: FullLocalizedText;
  attributes: string;
  attributeSpecs: AnnotationAttributeSpec[];
  howToUse: FullLocalizedText;
  whenToUse: FullLocalizedText;
  whenNotToUse: FullLocalizedText;
  syntaxSample: string;
  runtimeBehavior: FullLocalizedText;
}

export interface FilterOperatorSpec {
  operator: string;
  syntax: string;
  sqlEquivalent: string;
  description: FullLocalizedText;
}
