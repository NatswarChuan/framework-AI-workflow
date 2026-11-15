import React, { useEffect, useState } from 'react';
import { SupportedLanguage } from './types/docs';
import { ALL_NAV_ITEMS } from './data/navigation';
import { SUPPORTED_LANGUAGES, isRtlLanguage } from './data/locales';
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
import { EndpointsPage } from './pages/EndpointsPage';
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

function resolveInitialTopic(): string {
  if (typeof window !== 'undefined') {
    const rawHash = window.location.hash.replace('#', '').trim();
    if (rawHash && ALL_NAV_ITEMS.some((item) => item.id === rawHash)) {
      return rawHash;
    }
  }
  return 'overview';
}

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(resolveInitialLanguage);
  const [theme, setTheme] = useState<'dark' | 'light'>(resolveInitialTheme);
  const [activeTopicId, setActiveTopicId] = useState<string>(resolveInitialTopic);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = isRtlLanguage(currentLang) ? 'rtl' : 'ltr';
    window.localStorage.setItem(STORAGE_LANG_KEY, currentLang);
  }, [currentLang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const next = window.location.hash.replace('#', '').trim();
      if (next && ALL_NAV_ITEMS.some((item) => item.id === next)) {
        setActiveTopicId(next);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
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

  const navigateToTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
    if (window.location.hash !== `#${topicId}`) {
      window.location.hash = topicId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        return <AnnotationsPage currentLang={currentLang} />;
      case 'endpoints':
        return <EndpointsPage currentLang={currentLang} />;
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
      default:
        return <OverviewPage currentLang={currentLang} theme={theme} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
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
          onSelectTopic={navigateToTopic}
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
            onSelectTopic={navigateToTopic}
          />
        </main>

        <TableOfContents activeTopicId={activeTopicId} currentLang={currentLang} />
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        currentLang={currentLang}
        onSelectPage={navigateToTopic}
      />
    </div>
  );
};

export default App;
