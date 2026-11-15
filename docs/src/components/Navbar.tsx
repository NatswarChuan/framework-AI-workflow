import React, { useRef, useEffect } from 'react';
import { Search, GitBranch, Sun, Moon } from 'lucide-react';
import { SupportedLanguage } from '../types/docs';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.05rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
            }}
          >
            N
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}>
            Spring<span style={{ color: 'var(--brand-primary)' }}>-NWVMC</span>
          </span>
        </a>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: 6,
            padding: '0.2rem 0.55rem',
            fontSize: '0.73rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          <span style={{ color: '#10b981' }}>●</span> v0.0.2 • Pure Java 21+
        </div>
      </div>

      {/* Global Search Input */}
      <div style={{ flex: 1, maxWidth: 460, margin: '0 1.5rem' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={15}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              currentLang === 'vi'
                ? "Tìm nhanh mục tài liệu... (Nhấn '/' để tìm)"
                : currentLang === 'ja'
                ? "ドキュメントを検索... ('/' キーでフォーカス)"
                : currentLang === 'zh'
                ? "快速搜索章节... (按 '/' 聚焦)"
                : "Search documentation topics... (Press '/')"
            }
            style={{
              width: '100%',
              padding: '0.48rem 2.2rem 0.48rem 2.3rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              color: 'var(--text-primary)',
              fontSize: '0.86rem',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          />
          <kbd
            style={{
              position: 'absolute',
              right: '0.7rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 4,
              padding: '0.08rem 0.35rem',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'JetBrains Mono',
            }}
          >
            /
          </kbd>
        </div>
      </div>

      {/* Theme Toggle, Language Switcher & GitHub Link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onToggleTheme}
          title={
            theme === 'dark'
              ? currentLang === 'vi'
                ? 'Chuyển sang giao diện Sáng'
                : currentLang === 'ja'
                ? 'ライトテーマに切替'
                : currentLang === 'zh'
                ? '切换浅色模式'
                : 'Switch to Light Reading Mode'
              : currentLang === 'vi'
              ? 'Chuyển sang giao diện Tối'
              : currentLang === 'ja'
              ? 'ダークテーマに切替'
              : currentLang === 'zh'
              ? '切换深色模式'
              : 'Switch to Dark Mode'
          }
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: '0.35rem 0.65rem',
            color: 'var(--text-primary)',
            fontSize: '0.76rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {theme === 'dark' ? <Sun size={15} style={{ color: '#fbbf24' }} /> : <Moon size={15} style={{ color: '#0284c7' }} />}
          <span>
            {theme === 'dark'
              ? currentLang === 'vi'
                ? 'Sáng'
                : currentLang === 'ja'
                ? 'ライト'
                : currentLang === 'zh'
                ? '浅色'
                : 'Light'
              : currentLang === 'vi'
              ? 'Tối'
              : currentLang === 'ja'
              ? 'ダーク'
              : currentLang === 'zh'
              ? '深色'
              : 'Dark'}
          </span>
        </button>

        <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.2rem', borderRadius: 8, border: '1px solid var(--border-color)' }}>
          {(['vi', 'en', 'ja', 'zh'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onSelectLang(lang)}
              style={{
                border: 'none',
                background: currentLang === lang ? 'var(--brand-primary)' : 'transparent',
                color: currentLang === lang ? '#ffffff' : 'var(--text-muted)',
                padding: '0.22rem 0.55rem',
                borderRadius: 6,
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <a
          href="https://github.com/NatswarChuan/Spring-NWVMC"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <GitBranch size={16} />
          GitHub
        </a>
      </div>
    </header>
  );
};
