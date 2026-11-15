export type SupportedLanguage = 'en' | 'vi' | 'ja' | 'zh';

export interface NavItem {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: string;
  badge?: string;
  badgeType?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export interface NavCategory {
  id: string;
  title: Record<SupportedLanguage, string>;
  items: NavItem[];
}

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: Record<SupportedLanguage, string>;
  description: Record<SupportedLanguage, string>;
  requiredRole: string;
  requestBodySample?: string;
  responseSample: string;
}

export interface AnnotationSpec {
  name: string;
  target: string;
  purpose: Record<SupportedLanguage, string>;
  rationale: Record<SupportedLanguage, string>;
  applicability: Record<SupportedLanguage, string>;
  usage: Record<SupportedLanguage, string>;
  syntaxSample: string;
  explanation: Record<SupportedLanguage, string>;
}

export interface FilterOperatorSpec {
  operator: string;
  syntax: string;
  description: Record<SupportedLanguage, string>;
  sqlEquivalent: string;
  exampleUrl: string;
}

export interface TocHeading {
  id: string;
  title: string;
  level: number;
}

