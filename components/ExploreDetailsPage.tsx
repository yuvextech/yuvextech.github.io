import React, { useState, useEffect, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { Project } from '../types';

interface ExploreDetailsPageProps {
  selectedId?: string | null;
  onBack: () => void;
  onSelectProject: (id: string) => void;
  onContact: () => void;
  onBrainstorm?: () => void;
}

type TabType = 'architecture' | 'overview' | 'features' | 'metrics';

const ExploreDetailsPage: React.FC<ExploreDetailsPageProps> = ({
  selectedId,
  onBack,
  onSelectProject,
  onContact,
  onBrainstorm
}) => {
  const { projects } = useCMS();
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState<'interface' | 'architecture' | 'gallery'>('interface');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Determine current active project (default to first project if none or invalid)
  const currentProject: Project = useMemo(() => {
    if (selectedId) {
      const match = projects.find(p => p.id === selectedId);
      if (match) return match;
    }
    return projects[0] || ({} as Project);
  }, [selectedId, projects]);

  // Categories available
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategoryFilter === 'All') return projects;
    return projects.filter(p => p.category === activeCategoryFilter);
  }, [activeCategoryFilter, projects]);

  // Next and previous project for rapid navigation
  const currentIndex = projects.findIndex(p => p.id === currentProject.id);
  const prevProject = projects.length > 0 ? projects[(currentIndex - 1 + projects.length) % projects.length] : null;
  const nextProject = projects.length > 0 ? projects[(currentIndex + 1) % projects.length] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPreviewViewMode('interface');
    setActiveGalleryIndex(0);
  }, [currentProject.id]);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  const handleShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: `${currentProject.title} | Yuvex Tech Explore Details`,
          text: currentProject.description,
          url: window.location.href,
        }).catch(() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
          }
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (e) {
      console.error('Share failed:', e);
    }
  };

  return (
    <div className="pt-28 pb-32 min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Top Breadcrumb & Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-4 border-b border-gray-100 dark:border-white/5 pb-6">
          <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Portfolio</span>
            </button>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Explore Details</span>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{currentProject.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 transition-all active:scale-95"
              title="Share case study"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onContact}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              Discuss Architecture
            </button>
          </div>
        </div>

        {/* Project Switcher Bar */}
        <section className="mb-12 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Explore Case Studies
              </span>
              <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Select a high-performance system to inspect architecture, metrics, and technical benchmarks
              </h3>
            </div>
            
            {/* Category filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeCategoryFilter === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white border border-gray-200 dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProjects.map((p) => {
              const isSelected = p.id === currentProject.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-blue-600/10 border-2 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-400/50 hover:bg-white dark:hover:bg-white/5'
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 truncate">
                        {p.category}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {p.title}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {p.client || 'Enterprise Client'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Hero Section */}
        <section className="mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-500/20">
              {currentProject.category}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentProject.status || 'Live in Production'}
            </span>
            {currentProject.year && (
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-bold border border-gray-200 dark:border-white/10">
                {currentProject.year}
              </span>
            )}
            {currentProject.timeline && (
              <span className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-xs font-bold border border-gray-200 dark:border-white/10">
                ⏱️ {currentProject.timeline}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.08] mb-6">
            {currentProject.title}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-4xl leading-relaxed mb-8">
            {currentProject.heroSubtitle || currentProject.description}
          </p>

          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl mb-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Client / Partner
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {currentProject.client || 'Confidential Client'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Engineering Role
              </span>
              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                {currentProject.role || 'Full-Stack Architecture'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Primary Architecture
              </span>
              <span className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                {currentProject.tags[0]} & {currentProject.tags[1]}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                Benchmark Impact
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400">
                {currentProject.metrics?.[0]?.value || '99.9%'} {currentProject.metrics?.[0]?.label || 'Uptime'}
              </span>
            </div>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mr-2">Stack Elements:</span>
            {currentProject.tags.map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Media Preview & Visual Stage */}
        <section className="mb-16">
          <div className="bg-gray-900 dark:bg-black rounded-3xl p-3 sm:p-4 border border-gray-800 dark:border-white/10 shadow-2xl">
            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between pb-3 px-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="ml-3 text-xs font-mono text-gray-400 hidden sm:inline-block">
                  yuvex-spec://{currentProject.id}.production.live
                </span>
              </div>
              <div className="flex items-center gap-1 bg-gray-800/80 rounded-xl p-1">
                <button
                  onClick={() => setPreviewViewMode('interface')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewViewMode === 'interface'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  System Interface
                </button>
                <button
                  onClick={() => setPreviewViewMode('architecture')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewViewMode === 'architecture'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Edge Pipeline
                </button>
                {currentProject.gallery && currentProject.gallery.length > 0 && (
                  <button
                    onClick={() => setPreviewViewMode('gallery')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewViewMode === 'gallery'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Gallery ({currentProject.gallery.length})
                  </button>
                )}
              </div>
            </div>

            {/* Visual Canvas Display */}
            <div className="mt-3 relative rounded-2xl overflow-hidden aspect-[16/9] bg-gray-950 flex items-center justify-center">
              {previewViewMode === 'interface' && (
                <div className="w-full h-full relative group">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-xs uppercase font-black tracking-widest text-blue-400 block mb-1">
                        Active Production Node
                      </span>
                      <h4 className="text-xl sm:text-2xl font-bold text-white">
                        {currentProject.title} Main Stage
                      </h4>
                    </div>
                    <button
                      onClick={onContact}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <span>Request Live Demo</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {previewViewMode === 'architecture' && (
                <div className="w-full h-full p-6 md:p-12 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-gray-950 text-white">
                  <div>
                    <span className="text-xs uppercase font-black tracking-widest text-blue-400 block mb-2">
                      High-Availability Telemetry Architecture
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      End-to-End Pipeline & Latency Budgets
                    </h3>
                    <p className="text-sm text-gray-400 max-w-2xl">
                      Each pipeline stage is hardened against network volatility with automated backpressure and zero-loss edge buffers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                    {currentProject.architecture?.diagramSteps?.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl">{step.icon}</span>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {step.latency || '< 10ms'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono font-bold mb-1">STEP {step.step}</div>
                        <div className="text-sm font-bold text-white mb-1.5">{step.name}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{step.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 border-t border-gray-800 pt-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        99.999% SLA Target
                      </span>
                      <span>Zero-Trust IAM</span>
                      <span>TLS 1.3 Certified</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('architecture')}
                      className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                    >
                      View Full Architecture Matrix →
                    </button>
                  </div>
                </div>
              )}

              {previewViewMode === 'gallery' && currentProject.gallery && (
                <div className="w-full h-full relative">
                  <img
                    src={currentProject.gallery[activeGalleryIndex]?.url || currentProject.image}
                    alt={currentProject.gallery[activeGalleryIndex]?.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent"></div>
                  
                  {/* Gallery controls */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <p className="text-white text-sm font-medium">
                      {currentProject.gallery[activeGalleryIndex]?.caption}
                    </p>
                    <div className="flex items-center gap-2">
                      {currentProject.gallery.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveGalleryIndex(idx)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            idx === activeGalleryIndex
                              ? 'bg-blue-500 scale-125'
                              : 'bg-white/40 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Deep Dive Navigation Tabs */}
        <section className="mb-16">
          <div className="flex border-b border-gray-200 dark:border-white/10 gap-8 overflow-x-auto no-scrollbar mb-12">
            {[
              { id: 'architecture' as const, label: 'System Architecture', icon: '🏛️' },
              { id: 'overview' as const, label: 'Challenge & Solution', icon: '🎯' },
              { id: 'features' as const, label: 'Engineered Features', icon: '⚡' },
              { id: 'metrics' as const, label: 'Benchmarks & Impact', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 pb-4 text-sm font-bold uppercase tracking-wider transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Architecture Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl mb-4 font-bold">
                    💻
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    Frontend Layer
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {currentProject.architecture?.frontend.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-4 font-bold">
                    ⚙️
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    Backend & APIs
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {currentProject.architecture?.backend.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-4 font-bold">
                    ☁️
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    Cloud & Scale
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {currentProject.architecture?.cloudInfrastructure.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-6">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-4 font-bold">
                    🛡️
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    Security & Controls
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {currentProject.architecture?.securityAndCompliance.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Snippet Box */}
              {currentProject.codeSnippet && (
                <div className="bg-gray-950 rounded-3xl border border-gray-800 p-6 md:p-8 text-gray-200 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-800">
                    <div>
                      <span className="text-xs uppercase font-mono tracking-widest text-blue-400 block mb-1">
                        Architectural Implementation Highlight
                      </span>
                      <h4 className="text-lg font-bold text-white font-mono">
                        {currentProject.codeSnippet.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleCopyCode(currentProject.codeSnippet!.code)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      {copiedCode ? (
                        <>
                          <span className="text-emerald-400">✓</span>
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-xs md:text-sm text-blue-100/90 overflow-x-auto leading-relaxed p-4 bg-black/50 rounded-2xl border border-white/5">
                    <code>{currentProject.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: OVERVIEW & CHALLENGE / SOLUTION */}
          {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Comprehensive Narrative */}
              <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-8 md:p-12">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-2">
                  System Context & Problem Space
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Executive Briefing
                </h3>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  {currentProject.overview}
                </p>
              </div>

              {/* Challenge vs Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Challenge */}
                <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-200/60 dark:border-red-900/30 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      The Technical Challenge
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {currentProject.challenge?.summary}
                  </p>
                  <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                    {currentProject.challenge?.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solution */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-900/30 rounded-3xl p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">💡</span>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                      The Yuvex Engineering Solution
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {currentProject.solution?.summary}
                  </p>
                  <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                    {currentProject.solution?.highlights.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Before vs After Benchmark Comparison */}
              {currentProject.benchmarks && currentProject.benchmarks.length > 0 && (
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-3xl p-8">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Before vs. After Architecture Transformation
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                          <th className="pb-3 font-bold">System Benchmark</th>
                          <th className="pb-3 font-bold text-red-500">Legacy / Before</th>
                          <th className="pb-3 font-bold text-blue-600 dark:text-blue-400">Yuvex Architecture</th>
                          <th className="pb-3 font-bold text-emerald-600 dark:text-emerald-400">Improvement Delta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {currentProject.benchmarks.map((bm, idx) => (
                          <tr key={idx} className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                            <td className="py-3.5 font-bold text-gray-900 dark:text-white">{bm.metric}</td>
                            <td className="py-3.5 font-mono text-gray-500 line-through">{bm.before}</td>
                            <td className="py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{bm.after}</td>
                            <td className="py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-xs">
                                {bm.improvement}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FEATURES */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              {currentProject.features?.map((feature, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-blue-500/40 rounded-3xl p-8 transition-all group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  {feature.impact && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-500/20">
                      <span>🎯 Verified Impact:</span>
                      <span>{feature.impact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: METRICS & DELIVERABLES */}
          {activeTab === 'metrics' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              {/* Quantifiable KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProject.metrics?.map((m, idx) => (
                  <div 
                    key={idx}
                    className="p-8 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 relative overflow-hidden"
                  >
                    <div className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 font-mono">
                      {m.value}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {m.label}
                    </div>
                    {m.change && (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 mb-2">
                        {m.change}
                      </span>
                    )}
                    {m.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {m.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Client Testimonial */}
              {currentProject.testimonial && (
                <div className="p-8 md:p-12 rounded-3xl bg-blue-600 text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                  <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 font-serif leading-none select-none">
                    “
                  </div>
                  <p className="text-lg md:text-2xl font-medium leading-relaxed mb-8 relative z-10">
                    "{currentProject.testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4 relative z-10">
                    <img 
                      src={currentProject.testimonial.avatar} 
                      alt={currentProject.testimonial.author}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                    />
                    <div>
                      <h5 className="font-bold text-base text-white">
                        {currentProject.testimonial.author}
                      </h5>
                      <p className="text-xs text-blue-100 font-medium">
                        {currentProject.testimonial.role}, {currentProject.testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Deliverables Checklist */}
              {currentProject.deliverables && (
                <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Delivered Project Artifacts & Source Repositories
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentProject.deliverables.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-xs font-bold text-gray-800 dark:text-gray-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
                          ✓
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Project Next / Prev Navigation */}
        <section className="mb-20 pt-12 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {prevProject && (
              <button
                onClick={() => onSelectProject(prevProject.id)}
                className="w-full sm:w-auto flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all text-left group"
              >
                <span className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:text-blue-600 transition-colors">
                  ←
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    Previous Project
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {prevProject.title}
                  </span>
                </div>
              </button>
            )}

            <button
              onClick={onBack}
              className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Back to All Projects
            </button>

            {nextProject && (
              <button
                onClick={() => onSelectProject(nextProject.id)}
                className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 p-4 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all text-right group"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    Next Project
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {nextProject.title}
                  </span>
                </div>
                <span className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 group-hover:text-blue-600 transition-colors">
                  →
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Global Strategy CTA */}
        <section className="p-12 md:p-16 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[100px] rounded-full"></div>
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-200 mb-4 block">
              Architectural Consulting
            </span>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
              Ready to engineer your next breakout digital product?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              We design, build, and scale world-class software that performs under peak enterprise load. Book a technical discovery session today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onContact}
                className="w-full sm:w-auto px-10 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl text-sm"
              >
                Schedule Architecture Review
              </button>
              {onBrainstorm && (
                <button
                  onClick={onBrainstorm}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-700/40 hover:bg-blue-700/60 border border-white/20 text-white font-bold rounded-full transition-all text-sm backdrop-blur-sm"
                >
                  Explore AI Brainstorm Lab ✨
                </button>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ExploreDetailsPage;
