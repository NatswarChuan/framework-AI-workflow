import React, { useEffect, useRef, useState } from 'react';
import { Globe, Layers, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';
import { SUPPORTED_LANGUAGES, UI_LABELS, pickText } from '../data/locales';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onChangeLang: (lang: SupportedLanguage) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onChangeLang,
  theme,
  onToggleTheme,
  sidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  onNavigateHome,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const activeMeta =
    SUPPORTED_LANGUAGES.find((item) => item.code === currentLang) ?? SUPPORTED_LANGUAGES[0];

  return (
    <header className="doc-navbar">
      <div className="navbar-brand-group">
        <button
          type="button"
          className="nav-icon-btn mobile-menu-btn"
          aria-label="Toggle navigation drawer"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <button
          type="button"
          className="navbar-logo-btn"
          onClick={onNavigateHome}
        >
          <span className="navbar-logo-mark">
            <Layers size={18} />
          </span>
          <span className="navbar-brand-title">{UI_LABELS.brandName}</span>
        </button>

        <span className="navbar-version-pill">{UI_LABELS.versionBadge}</span>
      </div>

      <div className="navbar-controls">
        <button
          type="button"
          id="navbar-search-trigger"
          className="search-trigger-btn"
          onClick={onOpenSearch}
          aria-label={pickText(UI_LABELS.searchButton, currentLang)}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <Search size={15} />
            <span>{pickText(UI_LABELS.searchButton, currentLang)}</span>
          </span>
          <span className="kbd-pill">Ctrl+K</span>
        </button>

        <button
          type="button"
          id="theme-toggle-btn"
          className="nav-icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle Dark or Light Theme"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="lang-picker-wrap" ref={pickerRef}>
          <button
            type="button"
            id="lang-selector-trigger"
            className="nav-icon-btn"
            onClick={() => setLangMenuOpen((prev) => !prev)}
            aria-expanded={langMenuOpen}
            aria-label="Select documentation language"
          >
            <Globe size={15} />
            <span>{activeMeta.code.toUpperCase()}</span>
          </button>

          {langMenuOpen && (
            <div className="lang-dropdown-panel" role="listbox" aria-label="20 Languages">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  data-lang-option={lang.code}
                  className={`lang-option-btn ${lang.code === currentLang ? 'active' : ''}`}
                  onClick={() => {
                    onChangeLang(lang.code);
                    setLangMenuOpen(false);
                  }}
                >
                  <span>
                    {lang.nativeName}{' '}
                    <span style={{ opacity: 0.65, fontSize: '0.75rem' }}>
                      ({lang.code})
                    </span>
                  </span>
                  {lang.rtl && (
                    <span className="sidebar-item-badge">RTL</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
