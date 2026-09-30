import React, { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  canonicalUrl?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, canonicalUrl, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = canonicalUrl || window.location.href;
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 py-3 px-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-2xl mb-8 backdrop-blur-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {idx > 0 && (
              <span className="text-gray-300 dark:text-gray-600 select-none">/</span>
            )}
            {item.active ? (
              <span
                aria-current="page"
                className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md"
              >
                {item.label}
              </span>
            ) : item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer font-medium"
              >
                {item.label}
              </button>
            ) : (
              <span className="font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 font-mono text-[11px] transition-all active:scale-95 shadow-sm"
          title="Copy dynamic link to clipboard"
        >
          {copied ? (
            <>
              <span className="text-emerald-500 font-bold">✓</span>
              <span className="text-emerald-500 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share Link</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
