import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { SUPPORTED_LANGUAGES, UI_CONTROLS, UI_LABELS, pickText } from '../data/locales';
import { buildTopicHref, isPlainLeftClick } from '../utils/navLinks';
import logoUrl from '../assets/logo.jpeg';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onChangeLang: (lang: SupportedLanguage) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
}

const TOP_QUICK_LINKS: Array<{
  id: string;
  labelKey: 'navShortDocs' | 'navShortAnnotations' | 'navShortApis' | 'navShortAgentKit';
  match: (topicId: string) => boolean;
}> = [
  {
    id: 'overview',
    labelKey: 'navShortDocs',
    match: (id) =>
      id === 'overview' ||
      id === 'quickstart' ||
      id === 'two-directory' ||
      id === 'dynamic-proxy' ||
      id === 'escape-hatch',
  },
  {
    id: 'annotations',
    labelKey: 'navShortAnnotations',
    match: (id) => id === 'annotations' || id.startsWith('annotations-'),
  },
  {
    id: 'endpoints',
    labelKey: 'navShortApis',
    match: (id) => id === 'endpoints' || id.startsWith('endpoints-') || id === 'custom-endpoints',
  },
  {
    id: 'ai-agent-kit',
    labelKey: 'navShortAgentKit',
    match: (id) => id === 'ai-agent-kit',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onChangeLang,
  theme,
  onToggleTheme,
  sidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  onNavigateHome,
  activeTopicId,
  onSelectTopic,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langMenuOpen) {
      return;
    }
    const handleOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setLangMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (!panelRef.current) {
        return;
      }
      const optionButtons = Array.from(
        panelRef.current.querySelectorAll<HTMLButtonElement>('button[role="option"]'),
      );
      if (optionButtons.length === 0) {
        return;
      }
      const currentIdx = optionButtons.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % optionButtons.length;
        optionButtons[nextIdx].focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIdx = currentIdx <= 0 ? optionButtons.length - 1 : currentIdx - 1;
        optionButtons[prevIdx].focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        optionButtons[0].focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        optionButtons[optionButtons.length - 1].focus();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

  const activeMeta =
    SUPPORTED_LANGUAGES.find((item) => item.code === currentLang) ?? SUPPORTED_LANGUAGES[0];

  return (
    <header className="doc-navbar">
      <div className="navbar-brand-group">
        <button
          type="button"
          className="nav-icon-btn mobile-menu-btn"
          aria-label={pickText(UI_CONTROLS.toggleNavLabel, currentLang)}
          aria-expanded={sidebarOpen}
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <a
          href={buildTopicHref('overview', currentLang)}
          className="navbar-logo-btn"
          onClick={(event) => {
            if (!isPlainLeftClick(event)) {
              return;
            }
            event.preventDefault();
            onNavigateHome();
          }}
        >
          <span className="navbar-logo-frame">
            <img
              src={logoUrl}
              alt="Spring-NWVMC"
              className="navbar-logo-img"
              width={30}
              height={30}
            />
          </span>
          <span className="navbar-brand-title" dir="ltr">
            <span>Spring-</span>
            <span className="navbar-brand-accent">NWVMC</span>
          </span>
          <span className="navbar-brand-version" dir="ltr">
            {UI_LABELS.versionText}
          </span>
        </a>
      </div>

      <div className="navbar-search-slot">
        <button
          type="button"
          id="navbar-search-trigger"
          className="search-trigger-btn"
          onClick={onOpenSearch}
          aria-label={pickText(UI_LABELS.searchButton, currentLang)}
        >
          <span className="search-trigger-leading">
            <Search size={15} className="search-trigger-icon" />
            <span className="search-trigger-label">{pickText(UI_LABELS.searchButton, currentLang)}</span>
          </span>
          <span className="search-kbd-group" dir="ltr">
            <kbd className="search-kbd-hint">Ctrl</kbd>
            <kbd className="search-kbd-hint">K</kbd>
          </span>
        </button>
      </div>

      <div className="navbar-controls">
        <nav className="navbar-quick-links" aria-label={pickText(UI_CONTROLS.sidebarNavLabel, currentLang)}>
          {TOP_QUICK_LINKS.map((link) => {
            const isActive = link.match(activeTopicId);
            return (
              <a
                key={link.id}
                href={buildTopicHref(link.id, currentLang)}
                className={`navbar-quick-link ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) {
                    return;
                  }
                  event.preventDefault();
                  onSelectTopic(link.id);
                }}
              >
                {pickText(UI_CONTROLS[link.labelKey], currentLang)}
              </a>
            );
          })}
        </nav>

        <span className="navbar-divider" aria-hidden="true" />

        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-icon-btn navbar-github-link"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.65 3.01 8.59 7.19 9.98.53.1.72-.23.72-.5 0-.25-.01-1.08-.01-1.96-2.92.63-3.54-1.24-3.54-1.24-.48-1.21-1.17-1.53-1.17-1.53-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.61 2.47 1.15 3.07.88.09-.68.37-1.15.67-1.41-2.33-.26-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.09-2.82-.11-.27-.47-1.35.1-2.81 0 0 .89-.28 2.9 1.08.84-.23 1.75-.35 2.65-.35.9 0 1.81.12 2.65.35 2.01-1.36 2.9-1.08 2.9-1.08.57 1.46.21 2.54.1 2.81.68.74 1.09 1.67 1.09 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96 0 1.42-.01 2.56-.01 2.91 0 .28.19.61.73.5A10.51 10.51 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" />
          </svg>
        </a>

        <button
          type="button"
          id="theme-toggle-btn"
          className="nav-icon-btn"
          onClick={onToggleTheme}
          aria-label={pickText(UI_CONTROLS.toggleThemeLabel, currentLang)}
          title={pickText(UI_CONTROLS.toggleThemeLabel, currentLang)}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="lang-picker-wrap" ref={pickerRef}>
          <button
            ref={triggerRef}
            type="button"
            id="lang-selector-trigger"
            className={`nav-icon-btn lang-trigger-btn ${langMenuOpen ? 'open' : ''}`}
            onClick={() => setLangMenuOpen((prev) => !prev)}
            aria-expanded={langMenuOpen}
            aria-haspopup="listbox"
            aria-label={pickText(UI_CONTROLS.selectLangLabel, currentLang)}
          >
            <Globe size={15} className="lang-globe-icon" />
            <span className="lang-trigger-code">{activeMeta.code.toUpperCase()}</span>
            <ChevronDown size={13} className="lang-trigger-caret" />
          </button>

          {langMenuOpen && (
            <div
              ref={panelRef}
              className="lang-dropdown-panel"
              role="listbox"
              aria-label={pickText(UI_CONTROLS.langMenuLabel, currentLang)}
            >
              <div className="lang-dropdown-header">
                <span className="lang-dropdown-title">
                  {pickText(UI_CONTROLS.langMenuLabel, currentLang)}
                </span>
                <button
                  type="button"
                  className="lang-dropdown-close"
                  onClick={() => {
                    setLangMenuOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label={pickText(UI_CONTROLS.closeLangMenuLabel, currentLang)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="lang-dropdown-grid">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isActive = lang.code === currentLang;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-lang-option={lang.code}
                      className={`lang-option-btn ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        onChangeLang(lang.code);
                        setLangMenuOpen(false);
                        triggerRef.current?.focus();
                      }}
                    >
                      <span className="lang-option-names">
                        <span className="lang-option-native" dir={lang.rtl ? 'rtl' : 'ltr'}>
                          {lang.nativeName}
                        </span>
                        <span className="lang-option-code" dir="ltr">
                          {lang.code.toUpperCase()}
                        </span>
                      </span>
                      <span className="lang-option-trail">
                        {lang.rtl && <span className="rtl-lang-text">RTL</span>}
                        {isActive && <Check size={14} className="lang-option-check" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
