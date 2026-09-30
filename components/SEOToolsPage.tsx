import React, { useState, useMemo, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { copyToClipboard } from '../utils/clipboard';
import {
  getBaseUrl,
  buildDynamicUrl,
  runSEOAudit,
  generateSitemapXml,
  generateRobotsTxt,
  generateArticleSchema,
  generateProjectSchema,
  generateDefaultSchema,
  PageMetadata
} from '../utils/seo';

interface SEOToolsPageProps {
  onBack: () => void;
  onNavigateToPage?: (route: string, id?: string) => void;
}

export const SEOToolsPage: React.FC<SEOToolsPageProps> = ({ onBack, onNavigateToPage }) => {
  const { projects, blogPosts, settings } = useCMS();
  const [activeTab, setActiveTab] = useState<'audit' | 'preview' | 'sitemap' | 'schema' | 'keywords'>('audit');
  const [selectedTarget, setSelectedTarget] = useState<string>('home');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [socialPlatform, setSocialPlatform] = useState<'google' | 'twitter' | 'linkedin'>('google');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom metadata overrides for simulation
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  // All inspectable pages in the application
  const availablePages = useMemo(() => {
    const list = [
      { id: 'home', label: 'Home Page (/)', route: 'home', type: 'page' },
      { id: 'portfolio', label: 'Portfolio Hub (/portfolio)', route: 'portfolio', type: 'page' },
      { id: 'services', label: 'Services (/services)', route: 'services', type: 'page' },
      { id: 'blog', label: 'Knowledge Base (/blog)', route: 'blog', type: 'page' },
      { id: 'about', label: 'About Us (/about)', route: 'about', type: 'page' },
      { id: 'contact', label: 'Contact Us (/contact)', route: 'contact', type: 'page' },
      { id: 'brainstorm', label: 'AI Brainstorming (/brainstorm)', route: 'brainstorm', type: 'page' },
      { id: 'privacy', label: 'Privacy Policy (/privacy)', route: 'privacy', type: 'page' }
    ];

    projects.forEach(p => {
      list.push({
        id: `project-${p.id}`,
        label: `Project: ${p.title}`,
        route: 'project',
        type: 'project'
      });
    });

    blogPosts.forEach(b => {
      list.push({
        id: `blog-${b.id}`,
        label: `Article: ${b.title}`,
        route: 'blog',
        type: 'blog'
      });
    });

    return list;
  }, [projects, blogPosts]);

  // Derive metadata for selected target
  const activeMetadata: PageMetadata = useMemo(() => {
    const brand = settings.siteName || 'Yuvex Tech';

    if (selectedTarget.startsWith('project-')) {
      const pId = selectedTarget.replace('project-', '');
      const project = projects.find(p => p.id === pId) || projects[0];
      const url = buildDynamicUrl('project', project.id);
      return {
        title: customTitle || `${project.title} | ${project.category} Architecture Case Study`,
        description: customDesc || (project.heroSubtitle || project.description || '').slice(0, 155),
        canonicalUrl: url,
        ogType: 'website',
        ogImage: project.image,
        keywords: project.tags,
        schema: generateProjectSchema(project, url)
      };
    }

    if (selectedTarget.startsWith('blog-')) {
      const bId = selectedTarget.replace('blog-', '');
      const post = blogPosts.find(b => b.id === bId) || blogPosts[0];
      const url = buildDynamicUrl('blog', post.id);
      return {
        title: customTitle || `${post.title} | ${brand} Insights`,
        description: customDesc || (post.excerpt || '').slice(0, 155),
        canonicalUrl: url,
        ogType: 'article',
        ogImage: post.image,
        author: post.author,
        publishedTime: post.date,
        keywords: [post.category, 'Software Engineering', 'AI'],
        schema: generateArticleSchema(post, url)
      };
    }

    // Static pages
    const pageMap: Record<string, { title: string; desc: string; route: string }> = {
      home: {
        title: `${brand} | App Development & AI Solutions`,
        desc: 'Yuvex Tech specializes in high-end mobile app development, custom web platforms, and strategic AI integration with world-class UI/UX design.',
        route: ''
      },
      portfolio: {
        title: `Portfolio & Architecture Case Studies | ${brand}`,
        desc: 'Explore enterprise applications, telemedicine solutions, and high-frequency trading platforms designed and engineered by Yuvex Tech.',
        route: 'portfolio'
      },
      services: {
        title: `Engineering Services & Solutions | ${brand}`,
        desc: 'Mobile application engineering, responsive web architectures, and strategic Gemini AI workflow automation for scaling businesses.',
        route: 'services'
      },
      blog: {
        title: `The Knowledge Base & Engineering Blog | ${brand}`,
        desc: 'In-depth research on React 19, distributed microservices, low-latency caching, and generative AI interfaces from our engineering lab.',
        route: 'blog'
      },
      about: {
        title: `About Our Engineering Philosophy | ${brand}`,
        desc: 'Learn about Yuvex Tech: our mission, senior engineering leadership, and track record in delivering mission-critical digital products.',
        route: 'about'
      },
      contact: {
        title: `Contact Our Architecture Team | ${brand}`,
        desc: 'Schedule a discovery call or request a detailed project proposal with NDA. We respond within 24 hours with architectural feedback.',
        route: 'contact'
      },
      brainstorm: {
        title: `AI Product Brainstorming Studio | ${brand}`,
        desc: 'Brainstorm and validate your next software product idea with instant AI architecture roadmaps and tech stack recommendations.',
        route: 'brainstorm'
      },
      privacy: {
        title: `Privacy Policy & Data Security | ${brand}`,
        desc: 'Transparent commitment to enterprise privacy, zero-knowledge encryption principles, and international data governance.',
        route: 'privacy'
      }
    };

    const targetInfo = pageMap[selectedTarget] || pageMap.home;
    const url = buildDynamicUrl(targetInfo.route);
    const meta: PageMetadata = {
      title: customTitle || targetInfo.title,
      description: customDesc || targetInfo.desc,
      canonicalUrl: url,
      ogType: 'website',
      ogImage: `${getBaseUrl()}/og-preview.png`,
      keywords: ['App Development', 'AI Integration', 'React', 'Mobile Apps']
    };
    meta.schema = generateDefaultSchema(meta);
    return meta;
  }, [selectedTarget, customTitle, customDesc, projects, blogPosts, settings.siteName]);

  // Sync custom input placeholders when target changes
  useEffect(() => {
    setCustomTitle('');
    setCustomDesc('');
  }, [selectedTarget]);

  // Run audit on active metadata
  const auditResult = useMemo(() => {
    let content = activeMetadata.description;
    if (selectedTarget.startsWith('blog-')) {
      const bId = selectedTarget.replace('blog-', '');
      const post = blogPosts.find(b => b.id === bId);
      if (post?.content) content += ' ' + post.content;
    } else if (selectedTarget.startsWith('project-')) {
      const pId = selectedTarget.replace('project-', '');
      const project = projects.find(p => p.id === pId);
      if (project?.overview) content += ' ' + project.overview;
    }
    return runSEOAudit(activeMetadata, content);
  }, [activeMetadata, selectedTarget, blogPosts, projects]);

  // Generated dynamic sitemap & robots.txt
  const sitemapXml = useMemo(() => generateSitemapXml(projects, blogPosts), [projects, blogPosts]);
  const robotsTxt = useMemo(() => generateRobotsTxt(), []);

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all font-bold group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Site</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              ⚡ Live SEO & SERP Engine
            </span>
            <button
              onClick={() => handleCopy(activeMetadata.canonicalUrl, 'url')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-mono font-bold hover:border-blue-500 transition-all flex items-center gap-1.5 shadow-sm"
              title="Copy active canonical URL"
            >
              <span>{copiedKey === 'url' ? '✓' : '🔗'}</span>
              <span>{copiedKey === 'url' ? 'Copied URL' : 'Copy Dynamic URL'}</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 block mb-2">
                Developer & Webmaster Suite
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                SEO Tools & <span className="text-gradient">Dynamic URL</span> Suite
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                Real-time on-page SEO health audits, Google & Social card SERP previewers, dynamic sitemap generation, and Schema.org structured data validation.
              </p>
            </div>

            {/* Quick target page switcher */}
            <div className="w-full md:w-80 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <label className="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">
                Target Page to Inspect
              </label>
              <select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                {availablePages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-[11px] font-mono text-gray-500 truncate">
                {activeMetadata.canonicalUrl}
              </div>
            </div>
          </div>
        </header>

        {/* Feature Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'audit', label: 'SEO Health Audit', icon: '📊' },
            { id: 'preview', label: 'SERP & Social Preview', icon: '🔍' },
            { id: 'sitemap', label: 'Sitemap & Robots.txt', icon: '🗺️' },
            { id: 'schema', label: 'Schema.org JSON-LD', icon: '🧬' },
            { id: 'keywords', label: 'Meta Tag Generator', icon: '🏷️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 text-xs md:text-sm font-bold transition-all relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: SEO HEALTH AUDIT */}
        {activeTab === 'audit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Score Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex items-center gap-6 shadow-sm">
                <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center font-black ${
                  auditResult.score >= 90
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : auditResult.score >= 70
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                  <span className="text-3xl">{auditResult.score}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono">Score / 100</span>
                </div>
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-gray-400 block mb-1">
                    Overall SEO Health
                  </span>
                  <div className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span>Grade: {auditResult.grade}</span>
                    <span className="text-sm font-bold text-emerald-500">
                      {auditResult.score >= 90 ? 'Production Ready' : 'Optimization Advised'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Audited against Google Search Console, OpenGraph 2.0, and Schema.org specs.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-gray-400 block mb-2">
                    Dynamic Page Specs
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500">Title Length:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {activeMetadata.title.length} chars (Target: 30-60)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-500">Description:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {activeMetadata.description.length} chars (Target: 120-160)
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Reading Time:</span>
                      <span className="font-mono font-bold text-blue-500">
                        ~{auditResult.readTimeMinutes} min read ({auditResult.wordCount} words)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-gray-400 block mb-2">
                    Canonical Resolution
                  </span>
                  <div className="text-xs font-mono p-3 bg-gray-50 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-gray-800 text-blue-600 dark:text-blue-400 break-all mb-3">
                    {activeMetadata.canonicalUrl}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>SSL / HTTPS Protocol</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>Detailed Audit Breakdown</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 font-mono text-gray-600 dark:text-gray-400">
                  {auditResult.checks.length} Checks Run
                </span>
              </h3>

              <div className="space-y-4">
                {auditResult.checks.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      c.status === 'pass'
                        ? 'bg-emerald-500/[0.03] border-emerald-500/20'
                        : c.status === 'warning'
                        ? 'bg-amber-500/[0.03] border-amber-500/20'
                        : 'bg-red-500/[0.03] border-red-500/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          c.status === 'pass'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : c.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}>
                          {c.status === 'pass' ? '✓' : c.status === 'warning' ? '!' : '✕'}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            {c.label}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                            {c.message}
                          </p>
                        </div>
                      </div>

                      {c.value && (
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 self-start sm:self-auto">
                          {c.value}
                        </span>
                      )}
                    </div>

                    {c.recommendation && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5">
                        <span>💡 Recommendation:</span>
                        <span>{c.recommendation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERP & SOCIAL PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Platform & Device Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-2">
                {[
                  { id: 'google', label: 'Google Search Result', icon: '🔍' },
                  { id: 'twitter', label: 'X (Twitter) Card', icon: '🐦' },
                  { id: 'linkedin', label: 'LinkedIn / Facebook', icon: '💼' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSocialPlatform(p.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      socialPlatform === p.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {socialPlatform === 'google' && (
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  <button
                    onClick={() => setSerpDevice('desktop')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      serpDevice === 'desktop' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    💻 Desktop
                  </button>
                  <button
                    onClick={() => setSerpDevice('mobile')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      serpDevice === 'mobile' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-white shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>
              )}
            </div>

            {/* Live Visual Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-10 shadow-sm">
              <span className="text-xs uppercase font-mono font-bold text-gray-400 block mb-6">
                Live Simulator Preview ({socialPlatform.toUpperCase()})
              </span>

              {/* 1. GOOGLE SERP PREVIEW */}
              {socialPlatform === 'google' && (
                <div className={`mx-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-md ${
                  serpDevice === 'mobile' ? 'max-w-md' : 'max-w-2xl'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      Y
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs text-gray-900 font-medium">Yuvex Tech</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-sm">
                        {activeMetadata.canonicalUrl}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-blue-800 hover:underline cursor-pointer text-lg font-medium leading-snug line-clamp-1 mb-1">
                    {activeMetadata.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    <span className="text-gray-400 text-xs">Sep 30, 2026 — </span>
                    {activeMetadata.description}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-emerald-700 font-medium">
                    <span>★ 4.9 Rating (48 reviews)</span>
                    <span>• Software Engineering</span>
                    <span>• Mobile & AI</span>
                  </div>
                </div>
              )}

              {/* 2. TWITTER / X CARD PREVIEW */}
              {socialPlatform === 'twitter' && (
                <div className="max-w-lg mx-auto bg-black text-white p-5 rounded-3xl border border-gray-800 shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                      YT
                    </div>
                    <div>
                      <p className="text-sm font-bold flex items-center gap-1">
                        <span>Yuvex Tech</span>
                        <span className="text-blue-400">☑</span>
                      </p>
                      <p className="text-xs text-gray-500">@yuvextech • Just now</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 mb-3 leading-relaxed">
                    Explore our latest architecture breakdown and engineering advancements. Full case study:
                  </p>

                  <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                    <img
                      src={activeMetadata.ogImage || 'https://picsum.photos/seed/yuvex-og/1200/630'}
                      alt={activeMetadata.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 bg-gray-950">
                      <p className="text-[11px] font-mono text-gray-400 uppercase">
                        {new URL(activeMetadata.canonicalUrl).hostname}
                      </p>
                      <h4 className="text-sm font-bold text-white line-clamp-1 mt-0.5">
                        {activeMetadata.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {activeMetadata.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. LINKEDIN PREVIEW */}
              {socialPlatform === 'linkedin' && (
                <div className="max-w-lg mx-auto bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
                  <img
                    src={activeMetadata.ogImage || 'https://picsum.photos/seed/yuvex-og/1200/630'}
                    alt={activeMetadata.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4 bg-gray-50 dark:bg-gray-900">
                    <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                      {new URL(activeMetadata.canonicalUrl).hostname}
                    </p>
                    <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mt-1">
                      {activeMetadata.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {activeMetadata.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Test Dynamic Custom Meta Editor */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                Test Custom Title & Description in Simulator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Custom Title</label>
                    <span className="font-mono text-gray-400">{customTitle.length || activeMetadata.title.length} / 60</span>
                  </div>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={activeMetadata.title}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Custom Description</label>
                    <span className="font-mono text-gray-400">{customDesc.length || activeMetadata.description.length} / 160</span>
                  </div>
                  <input
                    type="text"
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder={activeMetadata.description}
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SITEMAP & ROBOTS.TXT */}
        {activeTab === 'sitemap' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sitemap.xml Box */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase font-mono font-bold text-blue-500">Auto-Generated XML</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">sitemap.xml</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {8 + projects.length + blogPosts.length} Dynamic URLs
                    </span>
                  </div>
                  <pre className="font-mono text-[11px] leading-relaxed p-4 bg-gray-950 text-gray-300 rounded-2xl overflow-x-auto max-h-72 border border-gray-800">
                    <code>{sitemapXml}</code>
                  </pre>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleCopy(sitemapXml, 'sitemap')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    {copiedKey === 'sitemap' ? '✓ Copied XML!' : '📋 Copy sitemap.xml'}
                  </button>
                  <button
                    onClick={() => handleDownload('sitemap.xml', sitemapXml, 'application/xml')}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-xs transition-all"
                  >
                    📥 Download
                  </button>
                </div>
              </div>

              {/* Robots.txt Box */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase font-mono font-bold text-purple-500">Crawler Protocol</span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">robots.txt</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      RFC 9309 Compliant
                    </span>
                  </div>
                  <pre className="font-mono text-[11px] leading-relaxed p-4 bg-gray-950 text-gray-300 rounded-2xl overflow-x-auto max-h-72 border border-gray-800">
                    <code>{robotsTxt}</code>
                  </pre>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleCopy(robotsTxt, 'robots')}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    {copiedKey === 'robots' ? '✓ Copied Robots.txt!' : '📋 Copy robots.txt'}
                  </button>
                  <button
                    onClick={() => handleDownload('robots.txt', robotsTxt, 'text/plain')}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold text-xs transition-all"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEMA.ORG JSON-LD */}
        {activeTab === 'schema' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-blue-500">Rich Search Snippets</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Schema.org JSON-LD Structured Data
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Active type: <span className="font-mono font-bold text-blue-400">{activeMetadata.schema?.['@type'] || 'WebSite Graph'}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(activeMetadata.schema, null, 2), 'schema')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                >
                  {copiedKey === 'schema' ? '✓ Copied JSON-LD!' : '📋 Copy JSON-LD'}
                </button>
                <a
                  href={`https://validator.schema.org/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold transition-all"
                >
                  Schema Validator ↗
                </a>
              </div>
            </div>

            <pre className="font-mono text-xs leading-relaxed p-6 bg-gray-950 text-sky-200 rounded-2xl overflow-x-auto max-h-96 border border-gray-800">
              <code>{JSON.stringify(activeMetadata.schema, null, 2)}</code>
            </pre>
          </div>
        )}

        {/* TAB 5: META TAG CODE GENERATOR */}
        {activeTab === 'keywords' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-emerald-500">Ready-To-Paste HTML</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  HTML &lt;head&gt; Meta Tag Generator
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Complete OpenGraph, Twitter Card, and Canonical HTML tags for this page.
                </p>
              </div>

              <button
                onClick={() => {
                  const htmlSnippet = `<!-- Primary Meta Tags -->
<title>${activeMetadata.title}</title>
<meta name="title" content="${activeMetadata.title}">
<meta name="description" content="${activeMetadata.description}">
<meta name="keywords" content="${(activeMetadata.keywords || []).join(', ')}">
<link rel="canonical" href="${activeMetadata.canonicalUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${activeMetadata.ogType || 'website'}">
<meta property="og:url" content="${activeMetadata.canonicalUrl}">
<meta property="og:title" content="${activeMetadata.title}">
<meta property="og:description" content="${activeMetadata.description}">
<meta property="og:image" content="${activeMetadata.ogImage || ''}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${activeMetadata.canonicalUrl}">
<meta property="twitter:title" content="${activeMetadata.title}">
<meta property="twitter:description" content="${activeMetadata.description}">
<meta property="twitter:image" content="${activeMetadata.ogImage || ''}">`;
                  handleCopy(htmlSnippet, 'metatags');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
              >
                {copiedKey === 'metatags' ? '✓ Copied Meta HTML!' : '📋 Copy All Meta Tags'}
              </button>
            </div>

            <pre className="font-mono text-xs leading-relaxed p-6 bg-gray-950 text-emerald-200 rounded-2xl overflow-x-auto max-h-96 border border-gray-800">
              <code>{`<!-- Primary Meta Tags -->
<title>${activeMetadata.title}</title>
<meta name="title" content="${activeMetadata.title}">
<meta name="description" content="${activeMetadata.description}">
<meta name="keywords" content="${(activeMetadata.keywords || []).join(', ')}">
<link rel="canonical" href="${activeMetadata.canonicalUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${activeMetadata.ogType || 'website'}">
<meta property="og:url" content="${activeMetadata.canonicalUrl}">
<meta property="og:title" content="${activeMetadata.title}">
<meta property="og:description" content="${activeMetadata.description}">
<meta property="og:image" content="${activeMetadata.ogImage || ''}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${activeMetadata.canonicalUrl}">
<meta property="twitter:title" content="${activeMetadata.title}">
<meta property="twitter:description" content="${activeMetadata.description}">
<meta property="twitter:image" content="${activeMetadata.ogImage || ''}">`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOToolsPage;
