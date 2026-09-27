import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { Project, BlogPost, Service } from '../types';

export interface GlobalSearchProps {
  onNavigate: (
    view: 'home' | 'privacy' | 'portfolio' | 'contact' | 'about' | 'blog' | 'blog-detail' | 'services' | 'testimonials' | 'brainstorm' | 'explore-details' | 'admin',
    id?: string
  ) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

type SearchCategory = 'all' | 'projects' | 'blogs' | 'services';

interface SearchResultItem {
  id: string;
  type: 'project' | 'blog' | 'service';
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  image?: string;
  icon?: string;
  tags?: string[];
  action: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate, isOpen: controlledIsOpen, onClose }) => {
  const { projects, blogPosts, services } = useCMS();
  
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isSearchOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsSearchOpen = (open: boolean) => {
    if (controlledIsOpen !== undefined && onClose) {
      if (!open) onClose();
    } else {
      setInternalIsOpen(open);
    }
  };

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: ⌘K, Ctrl+K, or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in a textarea or another input
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      } else if (e.key === '/' && !isInput && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveCategory('all');
    }
  }, [isSearchOpen]);

  // Real-time filtering across Projects, Blog Posts, and Services
  const allResults: SearchResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Projects
    const projectResults: SearchResultItem[] = projects
      .filter((project: Project) => {
        if (!q) return true;
        const inTitle = project.title.toLowerCase().includes(q);
        const inDesc = (project.description || '').toLowerCase().includes(q);
        const inOverview = (project.overview || '').toLowerCase().includes(q);
        const inCategory = (project.category || '').toLowerCase().includes(q);
        const inClient = (project.client || '').toLowerCase().includes(q);
        const inTags = project.tags?.some(tag => tag.toLowerCase().includes(q));
        return inTitle || inDesc || inOverview || inCategory || inClient || inTags;
      })
      .map((project: Project) => ({
        id: `project-${project.id}`,
        type: 'project',
        title: project.title,
        subtitle: project.overview || project.description,
        category: project.category,
        badge: project.client ? `${project.client}` : 'Case Study',
        image: project.image,
        tags: project.tags?.slice(0, 3),
        action: () => {
          setIsSearchOpen(false);
          onNavigate('explore-details', project.id);
        }
      }));

    // 2. Blog Posts
    const blogResults: SearchResultItem[] = blogPosts
      .filter((post: BlogPost) => {
        if (!q) return true;
        const inTitle = post.title.toLowerCase().includes(q);
        const inExcerpt = (post.excerpt || '').toLowerCase().includes(q);
        const inContent = (post.content || '').toLowerCase().includes(q);
        const inCategory = (post.category || '').toLowerCase().includes(q);
        const inAuthor = (post.author || '').toLowerCase().includes(q);
        return inTitle || inExcerpt || inContent || inCategory || inAuthor;
      })
      .map((post: BlogPost) => ({
        id: `blog-${post.id}`,
        type: 'blog',
        title: post.title,
        subtitle: post.excerpt,
        category: post.category,
        badge: `${post.readTime} • ${post.date}`,
        image: post.image,
        tags: [post.category, post.author],
        action: () => {
          setIsSearchOpen(false);
          onNavigate('blog-detail', post.id);
        }
      }));

    // 3. Services
    const serviceResults: SearchResultItem[] = services
      .filter((service: Service) => {
        if (!q) return true;
        const inTitle = service.title.toLowerCase().includes(q);
        const inDesc = (service.description || '').toLowerCase().includes(q);
        return inTitle || inDesc;
      })
      .map((service: Service) => ({
        id: `service-${service.id}`,
        type: 'service',
        title: service.title,
        subtitle: service.description,
        category: 'Capabilities',
        badge: 'Enterprise Service',
        icon: service.icon,
        action: () => {
          setIsSearchOpen(false);
          onNavigate('services');
        }
      }));

    return [...projectResults, ...blogResults, ...serviceResults];
  }, [projects, blogPosts, services, query]);

  // Filtered by selected Category Tab
  const filteredResults = useMemo(() => {
    if (activeCategory === 'projects') {
      return allResults.filter(r => r.type === 'project');
    }
    if (activeCategory === 'blogs') {
      return allResults.filter(r => r.type === 'blog');
    }
    if (activeCategory === 'services') {
      return allResults.filter(r => r.type === 'service');
    }
    return allResults;
  }, [allResults, activeCategory]);

  // Counts for Category Tabs
  const counts = useMemo(() => {
    return {
      all: allResults.length,
      projects: allResults.filter(r => r.type === 'project').length,
      blogs: allResults.filter(r => r.type === 'blog').length,
      services: allResults.filter(r => r.type === 'service').length
    };
  }, [allResults]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Arrow Key & Enter Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        filteredResults[selectedIndex].action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Popular search suggestions when search is empty
  const popularKeywords = ['AI Integration', 'Cloud Architecture', 'Mobile Apps', 'FinTech', 'Security', 'Web Platforms'];

  return (
    <>
      {/* NAVBAR SEARCH TRIGGER BUTTON / INLINE BAR */}
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
        title="Search projects, blog articles, services (⌘K)"
        aria-label="Open global search"
      >
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <span className="hidden xl:inline font-medium text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
          Search...
        </span>

        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-xs">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* SEARCH COMMAND PALETTE MODAL */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global search dialog"
          className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header: Search Input */}
            <div className="relative flex items-center px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, case studies, tech news, services..."
                className="w-full bg-transparent text-sm md:text-base font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors mr-2 cursor-pointer"
                  title="Clear input"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="px-2 py-1 rounded-lg text-xs font-mono font-medium text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-100/50 dark:bg-gray-950/70 border-b border-gray-100 dark:border-gray-800 overflow-x-auto text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>🔍</span>
                <span>All Results</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {counts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('projects')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'projects'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>💼</span>
                <span>Projects</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeCategory === 'projects' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {counts.projects}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('blogs')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'blogs'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>📰</span>
                <span>Tech News & Blog</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeCategory === 'blogs' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {counts.blogs}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory('services')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === 'services'
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>🛠️</span>
                <span>Services</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeCategory === 'services' ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {counts.services}
                </span>
              </button>
            </div>

            {/* Popular Search Suggestions (when query is empty) */}
            {!query && (
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800/60 bg-gray-50/40 dark:bg-gray-950/20 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-gray-400 dark:text-gray-500 mr-1 text-[11px] uppercase tracking-wider">
                  Suggestions:
                </span>
                {popularKeywords.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700/60 transition-colors cursor-pointer text-[11px] font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Results List */}
            <div
              ref={resultsContainerRef}
              className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 p-2 max-h-[50vh]"
            >
              {filteredResults.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl mx-auto mb-3 text-gray-400">
                    🔎
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    No results found
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    We couldn't find anything matching <span className="font-semibold text-blue-600 dark:text-blue-400">"{query}"</span>. Try searching for broader terms like "cloud", "AI", or "fintech".
                  </p>
                </div>
              ) : (
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 group ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40 border border-transparent'
                      }`}
                    >
                      {/* Thumbnail / Icon */}
                      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700/60 relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xl">
                            {item.icon || (item.type === 'project' ? '💼' : item.type === 'blog' ? '📰' : '🛠️')}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                              item.type === 'project'
                                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40'
                                : item.type === 'blog'
                                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40'
                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                            }`}
                          >
                            {item.type === 'project' ? '💼 Project' : item.type === 'blog' ? '📰 Article' : '🛠️ Service'}
                          </span>

                          {item.category && (
                            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                              {item.category}
                            </span>
                          )}

                          {item.badge && (
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                              • {item.badge}
                            </span>
                          )}
                        </div>

                        <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h5>

                        {item.subtitle && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>
                        )}

                        {item.tags && item.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {item.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Arrow indicator */}
                      <div className="shrink-0 self-center">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white translate-x-0.5'
                              : 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          }`}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with keyboard guidance */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/60 flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[10px]">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[10px]">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-[10px]">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>

              <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
