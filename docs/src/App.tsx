import React, { useEffect, useRef, useState } from 'react';
import { SupportedLanguage } from './types/docs';
import { ALL_NAV_ITEMS } from './data/navigation';
import { SUPPORTED_LANGUAGES, UI_LABELS, isRtlLanguage, pickText } from './data/locales';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { TableOfContents } from './components/TableOfContents';
import { TopicPaginationFooter } from './components/TopicPaginationFooter';
import { OverviewPage } from './pages/OverviewPage';
import { QuickstartPage } from './pages/QuickstartPage';
import { TwoDirectoryPage } from './pages/TwoDirectoryPage';
import { DynamicProxyPage } from './pages/DynamicProxyPage';
import { EscapeHatchPage } from './pages/EscapeHatchPage';
import { AnnotationsPage } from './pages/AnnotationsPage';
import { AnnotationCategoryPage } from './pages/AnnotationCategoryPage';
import { EndpointsPage } from './pages/EndpointsPage';
import { EndpointGroupPage } from './pages/EndpointGroupPage';
import { CustomEndpointsPage } from './pages/CustomEndpointsPage';
import { QueryOperatorsPage } from './pages/QueryOperatorsPage';
import { GraphQLSubsystemPage } from './pages/GraphQLSubsystemPage';
import { MultiDatabasePage } from './pages/MultiDatabasePage';
import { FileStoragePage } from './pages/FileStoragePage';
import { SecurityRbacPage } from './pages/SecurityRbacPage';
import { IdempotencyPage } from './pages/IdempotencyPage';
import { TimeTravelPage } from './pages/TimeTravelPage';
import { VirtualThreadsPage } from './pages/VirtualThreadsPage';
import { DistributedLockPage } from './pages/DistributedLockPage';
import { WebSocketStompPage } from './pages/WebSocketStompPage';
import { WebhookSubsystemPage } from './pages/WebhookSubsystemPage';
import { DistributedTracingPage } from './pages/DistributedTracingPage';
import { MetricsStudioI18nPage } from './pages/MetricsStudioI18nPage';
import { CustomizersAndIntegrationPage } from './pages/CustomizersAndIntegrationPage';
import { ZodClientCodegenPage } from './pages/ZodClientCodegenPage';
import { SpringAiPage } from './pages/SpringAiPage';
import { AiAgentKitPage } from './pages/AiAgentKitPage';

const STORAGE_LANG_KEY = 'nwvmc_docs_lang';
const STORAGE_THEME_KEY = 'nwvmc_docs_theme';

function resolveInitialLanguage(): SupportedLanguage {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_LANG_KEY);
    if (saved && SUPPORTED_LANGUAGES.some((item) => item.code === saved)) {
      return saved as SupportedLanguage;
    }
  }
  return 'en';
}

function resolveInitialTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return 'dark';
}

const HASH_TOPIC_ALIASES: Record<string, string> = {
  'query-dsl': 'query-operators',
  'spi-customizers': 'customizers',
};

function parseHashTarget(raw: string): { topicId: string; sectionId?: string } {
  const cleaned = raw.replace(/^#/, '').trim();
  if (!cleaned) {
    return { topicId: 'overview' };
  }
  const [rawTopic, rawSection] = cleaned.split('/');
  const mappedTopic = HASH_TOPIC_ALIASES[rawTopic] ?? rawTopic;
  if (ALL_NAV_ITEMS.some((item) => item.id === mappedTopic)) {
    return { topicId: mappedTopic, sectionId: rawSection || undefined };
  }
  return { topicId: 'overview' };
}

function resolveInitialTopic(): string {
  if (typeof window !== 'undefined') {
    return parseHashTarget(window.location.hash).topicId;
  }
  return 'overview';
}

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(resolveInitialLanguage);
  const [theme, setTheme] = useState<'dark' | 'light'>(resolveInitialTheme);
  const [activeTopicId, setActiveTopicId] = useState<string>(resolveInitialTopic);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedAnnotationName, setSelectedAnnotationName] = useState<string | undefined>(undefined);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | undefined>(undefined);
  const programmaticNavRef = useRef<boolean>(false);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtlLanguage(currentLang) ? 'rtl' : 'ltr';
    window.localStorage.setItem(STORAGE_LANG_KEY, currentLang);
  }, [currentLang]);

  useEffect(() => {
    const activeItem = ALL_NAV_ITEMS.find((item) => item.id === activeTopicId);
    const topicTitle = activeItem ? pickText(activeItem.label, currentLang) : UI_LABELS.brandName;
    document.title = `${topicTitle} — ${UI_LABELS.brandName} ${UI_LABELS.versionText}`;
  }, [activeTopicId, currentLang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const locked = searchOpen || sidebarOpen;
    if (locked) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    document.body.style.overflow = '';
  }, [searchOpen, sidebarOpen]);

  useEffect(() => {
    const scrollToSection = (sectionId?: string) => {
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    };

    const initial = parseHashTarget(window.location.hash);
    if (initial.sectionId) {
      scrollToSection(initial.sectionId);
    }

    const handleHashChange = () => {
      if (programmaticNavRef.current) {
        programmaticNavRef.current = false;
        return;
      }
      const next = parseHashTarget(window.location.hash);
      setActiveTopicId(next.topicId);
      scrollToSection(next.sectionId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      const target = event.target as HTMLElement | null;
      const isInputFocused =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if (event.key === '/' && !isInputFocused) {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const navigateToTopic = (topicId: string, skipScrollTop = false) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    if (window.location.hash !== `#${topicId}`) {
      programmaticNavRef.current = true;
      window.location.hash = topicId;
    }
    if (!skipScrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateWithAnnotation = (topicId: string, annotationName?: string) => {
    if (annotationName) {
      setSelectedAnnotationName(annotationName);
    }
    navigateToTopic(topicId, false);
  };

  const handleSearchSelect = (pageId: string, targetSelection?: string) => {
    if (pageId.startsWith('annotations-') && targetSelection) {
      setSelectedAnnotationName(targetSelection);
      navigateToTopic(pageId, false);
      window.setTimeout(() => {
        const detailEl = document.getElementById('annotation-detail-card');
        if (detailEl) {
          detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }
    if (pageId.startsWith('endpoints-') && targetSelection) {
      setSelectedEndpointId(targetSelection);
      navigateToTopic(pageId, false);
      window.setTimeout(() => {
        const sampleEl = document.getElementById('endpoint-live-sample');
        if (sampleEl) {
          sampleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
      return;
    }
    navigateToTopic(pageId, false);
  };

  const renderActivePage = () => {
    switch (activeTopicId) {
      case 'overview':
        return <OverviewPage currentLang={currentLang} theme={theme} />;
      case 'quickstart':
        return <QuickstartPage currentLang={currentLang} />;
      case 'two-directory':
        return <TwoDirectoryPage currentLang={currentLang} />;
      case 'dynamic-proxy':
        return <DynamicProxyPage currentLang={currentLang} theme={theme} />;
      case 'escape-hatch':
        return <EscapeHatchPage currentLang={currentLang} />;
      case 'annotations':
        return (
          <AnnotationsPage
            currentLang={currentLang}
            onNavigateTopic={navigateWithAnnotation}
          />
        );
      case 'annotations-routing':
        return (
          <AnnotationCategoryPage
            topicId="annotations-routing"
            category="routing"
            currentLang={currentLang}
            initialAnnotationName={selectedAnnotationName}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'annotations-beans':
        return (
          <AnnotationCategoryPage
            topicId="annotations-beans"
            category="bean"
            currentLang={currentLang}
            initialAnnotationName={selectedAnnotationName}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'annotations-entity':
        return (
          <AnnotationCategoryPage
            topicId="annotations-entity"
            category="entity"
            currentLang={currentLang}
            initialAnnotationName={selectedAnnotationName}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'annotations-rbac':
        return (
          <AnnotationCategoryPage
            topicId="annotations-rbac"
            category="rbac"
            currentLang={currentLang}
            initialAnnotationName={selectedAnnotationName}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'annotations-resilience':
        return (
          <AnnotationCategoryPage
            topicId="annotations-resilience"
            category="resilience"
            currentLang={currentLang}
            initialAnnotationName={selectedAnnotationName}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'endpoints':
        return (
          <EndpointsPage
            currentLang={currentLang}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'endpoints-read':
        return (
          <EndpointGroupPage
            topicId="endpoints-read"
            group="read"
            currentLang={currentLang}
            initialEndpointId={selectedEndpointId}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'endpoints-write':
        return (
          <EndpointGroupPage
            topicId="endpoints-write"
            group="write"
            currentLang={currentLang}
            initialEndpointId={selectedEndpointId}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'endpoints-enterprise':
        return (
          <EndpointGroupPage
            topicId="endpoints-enterprise"
            group="enterprise"
            currentLang={currentLang}
            initialEndpointId={selectedEndpointId}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'endpoints-export-import':
        return (
          <EndpointGroupPage
            topicId="endpoints-export-import"
            group="export-import"
            currentLang={currentLang}
            initialEndpointId={selectedEndpointId}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
      case 'custom-endpoints':
        return <CustomEndpointsPage currentLang={currentLang} theme={theme} />;
      case 'query-operators':
        return <QueryOperatorsPage currentLang={currentLang} />;
      case 'graphql-subsystem':
        return <GraphQLSubsystemPage currentLang={currentLang} />;
      case 'multi-database':
        return <MultiDatabasePage currentLang={currentLang} theme={theme} />;
      case 'file-storage':
        return <FileStoragePage currentLang={currentLang} />;
      case 'security-rbac':
        return <SecurityRbacPage currentLang={currentLang} theme={theme} />;
      case 'idempotency':
        return <IdempotencyPage currentLang={currentLang} theme={theme} />;
      case 'time-travel':
        return <TimeTravelPage currentLang={currentLang} />;
      case 'virtual-threads':
        return <VirtualThreadsPage currentLang={currentLang} />;
      case 'distributed-lock':
        return <DistributedLockPage currentLang={currentLang} />;
      case 'websocket-stomp':
        return <WebSocketStompPage currentLang={currentLang} />;
      case 'webhook-subsystem':
        return <WebhookSubsystemPage currentLang={currentLang} />;
      case 'distributed-tracing':
        return <DistributedTracingPage currentLang={currentLang} theme={theme} />;
      case 'metrics-studio-i18n':
        return <MetricsStudioI18nPage currentLang={currentLang} theme={theme} />;
      case 'customizers':
        return <CustomizersAndIntegrationPage currentLang={currentLang} />;
      case 'zod-client-codegen':
        return <ZodClientCodegenPage currentLang={currentLang} />;
      case 'spring-ai':
        return <SpringAiPage currentLang={currentLang} />;
      case 'ai-agent-kit':
        return <AiAgentKitPage currentLang={currentLang} />;
      default:
        return <OverviewPage currentLang={currentLang} theme={theme} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar
        currentLang={currentLang}
        onChangeLang={(lang) => setCurrentLang(lang)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigateHome={() => navigateToTopic('overview')}
      />

      <div className="portal-shell">
        <Sidebar
          activeTopicId={activeTopicId}
          onSelectTopic={(topicId) => navigateToTopic(topicId)}
          currentLang={currentLang}
          open={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="doc-main">
          <div id="doc-reading-canvas" className="doc-canvas">
            {renderActivePage()}
          </div>

          <TopicPaginationFooter
            activeTopicId={activeTopicId}
            currentLang={currentLang}
            onSelectTopic={(topicId) => navigateToTopic(topicId)}
          />
        </main>

        <TableOfContents activeTopicId={activeTopicId} currentLang={currentLang} />
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        currentLang={currentLang}
        onSelectResult={handleSearchSelect}
      />
    </div>
  );
};

export default App;
