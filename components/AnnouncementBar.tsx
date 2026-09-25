import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';

interface AnnouncementBarProps {
  onNavigate?: (hash: string) => void;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigate }) => {
  const { settings, isAdmin } = useCMS();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.announcement?.enabled || dismissed) {
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

  return (
    <div className="relative z-50 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs py-2.5 px-4 shadow-md transition-all">
      <div className="container mx-auto flex items-center justify-between gap-4 max-w-7xl">
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] tracking-wider uppercase backdrop-blur-sm shadow-sm border border-white/20">
              {badge}
            </span>
          )}
          <span className="font-medium text-blue-50 text-xs truncate max-w-2xl">
            {text}
          </span>
          {linkText && (
            <a
              href={linkUrl || '#'}
              onClick={handleClick}
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-white transition-colors"
            >
              <span>{linkText}</span>
              <span>→</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <span className="hidden md:inline-block text-[10px] font-bold bg-amber-400/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded">
              Admin CMS Active
            </span>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors text-white/80 hover:text-white text-xs"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
