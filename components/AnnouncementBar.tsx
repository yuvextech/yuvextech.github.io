import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';

interface AnnouncementBarProps {
  onNavigate?: (hash: string) => void;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { settings, isAdmin } = useCMS();
  const [dismissed, setDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const visible = !!settings.announcement?.enabled && !dismissed;

  if (!visible) {
    return null;
  }

  const { badge, text, linkText, linkUrl } = settings.announcement;

  const handleClick = (e: React.MouseEvent) => {
    if (linkUrl) {
      if (linkUrl.startsWith('#')) {
        e.preventDefault();
        window.location.hash = linkUrl.replace('#', '');
        if (onNavigate) onNavigate(linkUrl.replace('#', ''));
      }
    }
  };

  // Minimized floating bubble button
  if (isMinimized) {
    return (
      <aside aria-label="Announcement notification" className="fixed bottom-6 left-4 sm:left-6 z-40 animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-2xl hover:shadow-blue-500/20 text-gray-900 dark:text-white transition-all duration-300 hover:scale-105 active:scale-95"
          title="Open announcement bubble"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600 dark:bg-blue-400"></span>
          </span>
          <span className="text-xs font-bold tracking-tight">
            {badge || 'Update'}
          </span>
          <span className="text-xs opacity-70 group-hover:translate-x-0.5 transition-transform">
            💬
          </span>
        </button>
      </aside>
    );
  }

  // Expanded floating bubble notification
  return (
    <aside
      aria-label="Live Announcement"
      className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <div className="relative group rounded-3xl sm:rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-blue-500/25 dark:border-white/15 p-2 sm:pl-2.5 sm:pr-3 shadow-2xl shadow-blue-600/15 dark:shadow-black/70 flex items-center gap-3 transition-all duration-300 hover:border-blue-500/50">
        {/* Glow ambient layer */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl sm:rounded-full blur opacity-15 group-hover:opacity-25 transition duration-500 pointer-events-none"></div>

        {/* Bubble Icon Avatar */}
        <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
          <span className="text-base sm:text-lg">🚀</span>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider border border-blue-100 dark:border-blue-500/30 shrink-0">
                {badge}
              </span>
            )}
            {isAdmin && (
              <span className="hidden sm:inline-block text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.2 rounded">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">
            {text}
          </p>
          {linkText && (
            <a
              href={linkUrl || '#'}
              onClick={handleClick}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-0.5"
            >
              <span>{linkText}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-gray-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-bold"
            title="Minimize to bubble icon"
            aria-label="Minimize notification"
          >
            –
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-xs font-bold"
            title="Dismiss announcement"
            aria-label="Dismiss announcement"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
