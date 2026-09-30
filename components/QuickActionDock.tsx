import React, { useState, useEffect } from 'react';
import { getBaseUrl } from '../utils/seo';
import { copyToClipboard } from '../utils/clipboard';

interface QuickActionDockProps {
  currentView: string;
  onNavigate: (view: string, id?: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  seoScore?: number;
}

export const QuickActionDock: React.FC<QuickActionDockProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  seoScore = 95
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyCurrentUrl = async () => {
    await copyToClipboard(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {/* Toast Alert on Link Copied */}
      {copied && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 px-4 py-2.5 rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-2xl text-xs font-mono font-bold flex items-center gap-2 border border-white/10 select-none">
          <span className="text-emerald-400 dark:text-emerald-600 text-sm">✓</span>
          <span>Dynamic URL copied to clipboard!</span>
        </div>
      )}

      {/* Expanded Quick Navigation Menu */}
      {isExpanded && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-4 shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-3 mb-1">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
              Quick Nav & Tools
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
            {[
              { id: 'home', label: 'Home', icon: '🏠' },
              { id: 'portfolio', label: 'Portfolio', icon: '💼' },
              { id: 'services', label: 'Services', icon: '⚙️' },
              { id: 'blog', label: 'Knowledge', icon: '📚' },
              { id: 'seo-tools', label: 'SEO Suite', icon: '⚡' },
              { id: 'contact', label: 'Contact', icon: '✉️' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-xl text-left flex items-center gap-2 transition-all ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-2">
            <button
              onClick={handleCopyCurrentUrl}
              className="flex-1 py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>🔗</span>
              <span>Copy URL</span>
            </button>
            <button
              onClick={onToggleTheme}
              className="p-1.5 px-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs hover:border-gray-300 transition-all"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Buttons Bar */}
      <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-1.5 rounded-full shadow-2xl">
        {/* SEO Tools Launcher Pill */}
        <button
          onClick={() => onNavigate('seo-tools')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
            currentView === 'seo-tools'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20'
          }`}
          title="Open Live SEO Tools & SERP Previewer"
        >
          <span className="text-[11px]">⚡</span>
          <span className="hidden sm:inline">SEO</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
            {seoScore}%
          </span>
        </button>

        {/* Copy Dynamic URL Quick Button */}
        <button
          onClick={handleCopyCurrentUrl}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all active:scale-95"
          title="Copy dynamic link"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        {/* Quick Menu Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-full transition-all active:scale-95 ${
            isExpanded
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300'
          }`}
          title="Quick Navigation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Scroll To Top Button (Conditional) */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-600 dark:text-gray-300 transition-all active:scale-95"
            title="Scroll to top"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
};

export default QuickActionDock;
