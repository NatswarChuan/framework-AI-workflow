import React, { useEffect, useState } from 'react';
import { SupportedLanguage } from './types/docs';
import { ALL_NAV_ITEMS } from './data/navigation';
import { SUPPORTED_LANGUAGES, UI_CONTROLS, UI_LABELS, isRtlLanguage, pickText } from './data/locales';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { MobileTableOfContents, TableOfContents, openAncestorDetails } from './components/TableOfContents';
import { TopicPaginationFooter } from './components/TopicPaginationFooter';
import { StoryBanner } from './components/StoryBanner';
import { DocFooter } from './components/DocFooter';
import { NotFoundPage } from './pages/NotFoundPage';
import { buildTopicHref } from './utils/navLinks';
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
    const queryLang = new URLSearchParams(window.location.search).get('lang');
    if (queryLang && SUPPORTED_LANGUAGES.some((item) => item.code === queryLang)) {
      return queryLang as SupportedLanguage;
    }
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

function parseHashTarget(raw: string): {
  topicId: string;
  sectionId?: string;
  notFound: boolean;
  rawHash?: string;
} {
  const cleaned = raw.replace(/^#/, '').trim();
  if (!cleaned) {
    return { topicId: 'overview', notFound: false };
  }
  const [rawTopic, rawSection] = cleaned.split('/');
  const mappedTopic = HASH_TOPIC_ALIASES[rawTopic] ?? rawTopic;
  if (ALL_NAV_ITEMS.some((item) => item.id === mappedTopic)) {
    return { topicId: mappedTopic, sectionId: rawSection || undefined, notFound: false };
  }
  return { topicId: 'not-found', notFound: true, rawHash: cleaned };
}

function resolveInitialRoute(): {
  topicId: string;
  sectionId?: string;
  notFound: boolean;
  rawHash?: string;
} {
  if (typeof window !== 'undefined') {
    return parseHashTarget(window.location.hash);
  }
  return { topicId: 'overview', notFound: false };
}

export const App: React.FC = () => {
  const [initialRoute] = useState(resolveInitialRoute);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(resolveInitialLanguage);
  const [theme, setTheme] = useState<'dark' | 'light'>(resolveInitialTheme);
  const [activeTopicId, setActiveTopicId] = useState<string>(initialRoute.topicId);
  const [isNotFound, setIsNotFound] = useState<boolean>(initialRoute.notFound);
  const [missingHash, setMissingHash] = useState<string>(initialRoute.rawHash ?? '');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedAnnotationName, setSelectedAnnotationName] = useState<string | undefined>(undefined);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtlLanguage(currentLang) ? 'rtl' : 'ltr';
    window.localStorage.setItem(STORAGE_LANG_KEY, currentLang);
    const currentHash = window.location.hash || `#${activeTopicId}`;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLang);
    url.hash = currentHash;
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, [currentLang]);

  useEffect(() => {
    if (isNotFound) {
      document.title = `${pickText(UI_CONTROLS.notFoundTitle, currentLang)} — ${UI_LABELS.brandName} ${UI_LABELS.versionText}`;
      return;
    }
    const activeItem = ALL_NAV_ITEMS.find((item) => item.id === activeTopicId);
    const topicTitle = activeItem ? pickText(activeItem.label, currentLang) : UI_LABELS.brandName;
    document.title = `${topicTitle} — ${UI_LABELS.brandName} ${UI_LABELS.versionText}`;
  }, [activeTopicId, currentLang, isNotFound]);

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
          openAncestorDetails(el);
          window.setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 20);
        }
      }, 60);
    };

    const initial = parseHashTarget(window.location.hash);
    if (!initial.notFound && initial.sectionId) {
      scrollToSection(initial.sectionId);
    }

    const handleRouteSync = () => {
      const queryLang = new URLSearchParams(window.location.search).get('lang');
      if (queryLang && SUPPORTED_LANGUAGES.some((item) => item.code === queryLang)) {
        setCurrentLang(queryLang as SupportedLanguage);
      }
      const next = parseHashTarget(window.location.hash);
      setIsNotFound(next.notFound);
      setMissingHash(next.rawHash ?? '');
      setActiveTopicId(next.topicId);
      if (!next.notFound) {
        scrollToSection(next.sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
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
    setIsNotFound(false);
    setMissingHash('');
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    const nextHref = buildTopicHref(topicId, currentLang);
    if (window.location.hash !== `#${topicId}` || !window.location.search.includes(`lang=${currentLang}`)) {
      window.history.pushState(null, '', nextHref);
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
          openAncestorDetails(detailEl);
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
          openAncestorDetails(sampleEl);
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
        return (
          <OverviewPage
            currentLang={currentLang}
            theme={theme}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
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
            initialAnnotationName={selectedAnnotationName}
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
        return (
          <OverviewPage
            currentLang={currentLang}
            theme={theme}
            onNavigateTopic={(id) => navigateToTopic(id)}
          />
        );
    }
  };

  const isWideWorkbench = activeTopicId === 'annotations' || activeTopicId.startsWith('annotations-');

  return (
    <div className="portal-root">
      <a href="#doc-reading-canvas" className="skip-to-main">
        {pickText(UI_CONTROLS.skipToMain, currentLang)}
      </a>

      <div className="cyber-ambient-layer" aria-hidden="true" />

      <Navbar
        currentLang={currentLang}
        onChangeLang={(lang) => setCurrentLang(lang)}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
        onNavigateHome={() => navigateToTopic('overview')}
        activeTopicId={activeTopicId}
        onSelectTopic={(topicId) => navigateToTopic(topicId)}
      />

      <div className={`portal-shell ${isWideWorkbench && !isNotFound ? 'portal-shell-wide' : ''}`}>
        <Sidebar
          activeTopicId={activeTopicId}
          onSelectTopic={(topicId) => navigateToTopic(topicId)}
          currentLang={currentLang}
          open={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        <main className="doc-main">
          {!isNotFound && !isWideWorkbench && (
            <MobileTableOfContents activeTopicId={activeTopicId} currentLang={currentLang} />
          )}

          <div id="doc-reading-canvas" className={`doc-canvas ${isWideWorkbench && !isNotFound ? 'doc-canvas-wide' : ''}`}>
            {isNotFound ? (
              <NotFoundPage
                rawHash={missingHash}
                currentLang={currentLang}
                onSelectTopic={(topicId) => navigateToTopic(topicId)}
                onOpenSearch={() => setSearchOpen(true)}
              />
            ) : (
              renderActivePage()
            )}
          </div>

          {!isNotFound && (
            <StoryBanner
              topicId={activeTopicId}
              currentLang={currentLang}
              onSelectTopic={(topicId) => navigateToTopic(topicId)}
            />
          )}

          {!isNotFound && (
            <TopicPaginationFooter
              activeTopicId={activeTopicId}
              currentLang={currentLang}
              onSelectTopic={(topicId) => navigateToTopic(topicId)}
            />
          )}

          <DocFooter currentLang={currentLang} />
        </main>

        {!isNotFound && !isWideWorkbench && (
          <TableOfContents activeTopicId={activeTopicId} currentLang={currentLang} />
        )}
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
