
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Blog from './components/Blog';
import Footer from './components/Footer';
import AIPrompt from './components/AIPrompt';
import ClientLogos from './components/ClientLogos';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const PortfolioPage = lazy(() => import('./components/PortfolioPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const TestimonialsPage = lazy(() => import('./components/TestimonialsPage'));
const BrainstormPage = lazy(() => import('./components/BrainstormPage'));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage'));
const ExploreDetailsPage = lazy(() => import('./components/ExploreDetailsPage'));
const AdminCMS = lazy(() => import('./components/AdminCMS'));
import AnnouncementBar from './components/AnnouncementBar';
const SEOToolsPage = lazy(() => import('./components/SEOToolsPage'));
import QuickActionDock from './components/QuickActionDock';
import { updatePageSEO, buildDynamicUrl, getBaseUrl, generateArticleSchema, generateProjectSchema, generateDefaultSchema } from './utils/seo';
import { CMSProvider, useCMS } from './context/CMSContext';

const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <div className="w-10 h-10 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
    <span className="sr-only">Loading…</span>
  </div>
);

type ViewState = 'home' | 'privacy' | 'portfolio' | 'contact' | 'about' | 'blog' | 'blog-detail' | 'services' | 'testimonials' | 'brainstorm' | 'project-detail' | 'explore-details' | 'admin' | 'seo-tools';

const AppContent: React.FC = () => {
  const { projects, blogPosts, settings } = useCMS();
  const [view, setView] = useState<ViewState>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuvex_theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('yuvex_theme', theme);
  }, [theme]);

  // Dynamic SEO & Meta Tag Management
  useEffect(() => {
    const brandName = settings.siteName || 'Yuvex Tech';
    let title = `${brandName} | App Development & AI Solutions`;
    let description = 'Yuvex Tech specializes in high-end mobile app development, custom web platforms, and strategic AI integration with world-class UI/UX design.';
    let canonical = buildDynamicUrl('home');
    let ogType: 'website' | 'article' = 'website';
    let ogImage = `${getBaseUrl()}/og-preview.png`;
    let schema: Record<string, any> | undefined;

    switch (view) {
      case 'admin':
        title = `Admin Content Studio | ${brandName}`;
        description = 'Manage projects, tech news, services, testimonials, and site-wide settings.';
        canonical = buildDynamicUrl('admin');
        break;
      case 'seo-tools':
        title = `SEO Tools & Dynamic SERP Previewer | ${brandName}`;
        description = 'Real-time on-page SEO health audits, Google & Social card SERP previewers, dynamic sitemap generation, and Schema.org structured data validation.';
        canonical = buildDynamicUrl('seo-tools');
        break;
      case 'portfolio':
        title = `Portfolio & Architecture Case Studies | ${brandName}`;
        description = 'Explore enterprise applications, telemedicine solutions, and high-frequency trading platforms designed and engineered by Yuvex Tech.';
        canonical = buildDynamicUrl('portfolio');
        break;
      case 'blog':
        title = `The Knowledge Base & Tech News | ${brandName}`;
        description = 'Insights on engineering, design, and artificial intelligence from our team.';
        canonical = buildDynamicUrl('blog');
        break;
      case 'blog-detail': {
        const post = blogPosts.find(p => p.id === selectedBlogId);
        if (post) {
          title = `${post.title} | ${brandName} Blog`;
          description = post.excerpt;
          canonical = buildDynamicUrl('blog', post.id);
          ogType = 'article';
          ogImage = post.image;
          schema = generateArticleSchema(post, canonical);
        }
        break;
      }
      case 'explore-details':
      case 'project-detail': {
        const project = projects.find(p => p.id === selectedProjectId) || projects[0];
        if (project) {
          title = `${project.title} | Architecture & Engineering Case Study | ${brandName}`;
          description = project.heroSubtitle || project.overview || project.description;
          canonical = buildDynamicUrl('project', project.id);
          ogImage = project.image;
          schema = generateProjectSchema(project, canonical);
        }
        break;
      }
      case 'services':
        title = `Engineering Services & Solutions | ${brandName}`;
        description = 'High-end mobile app development, custom web platforms, and AI strategy.';
        canonical = buildDynamicUrl('services');
        break;
      case 'about':
        title = `About Our Engineering Philosophy | ${brandName}`;
        description = 'Learn about our mission to transform bold ideas into high-performance digital products.';
        canonical = buildDynamicUrl('about');
        break;
      case 'contact':
        title = `Contact Us | Start Your Project | ${brandName}`;
        description = 'Ready to build something amazing? Get in touch with our expert engineering team.';
        canonical = buildDynamicUrl('contact');
        break;
      case 'brainstorm':
        title = `AI Product Brainstorming Studio | ${brandName}`;
        description = 'Use our AI-powered tool to brainstorm your next big digital product.';
        canonical = buildDynamicUrl('brainstorm');
        break;
      case 'privacy':
        title = `Privacy Policy & Compliance | ${brandName}`;
        description = `How we handle and protect your data at ${brandName}.`;
        canonical = buildDynamicUrl('privacy');
        break;
    }

    // Apply comprehensive SEO update across DOM head
    updatePageSEO({
      title,
      description,
      canonicalUrl: canonical,
      ogType,
      ogImage,
      schema: schema || generateDefaultSchema({ title, description, canonicalUrl: canonical })
    });
  }, [view, selectedProjectId, selectedBlogId, projects, blogPosts, settings.siteName]);

  // Dynamic URL Resolution & History Listener
  useEffect(() => {
    const resolveLocation = () => {
      const pathname = window.location.pathname.replace(/^\/+/, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      const fullPath = pathname || hash;

      // 1. Projects / Explore Details
      if (fullPath.startsWith('project/') || fullPath.startsWith('explore-details/')) {
        const id = fullPath.split('/')[1];
        if (id) setSelectedProjectId(id);
        setView('explore-details');
      } else if (fullPath === 'explore-details') {
        setView('explore-details');
      }
      // 2. Blog Posts
      else if (fullPath.startsWith('blog/')) {
        const id = fullPath.split('/')[1];
        if (id) setSelectedBlogId(id);
        setView('blog-detail');
      }
      // 3. Named Routes
      else if (fullPath === 'seo-tools') {
        setView('seo-tools');
      } else if (fullPath === 'admin' || fullPath === 'cms') {
        setView('admin');
      } else if (fullPath === 'privacy') {
        setView('privacy');
      } else if (fullPath === 'portfolio' || fullPath === 'portfolio-page') {
        setView('portfolio');
      } else if (fullPath === 'contact' || fullPath === 'contact-page') {
        setView('contact');
      } else if (fullPath === 'about') {
        setView('about');
      } else if (fullPath === 'blog' || fullPath === 'blog-page') {
        setView('blog');
      } else if (fullPath === 'services' || fullPath === 'services-page') {
        setView('services');
      } else if (fullPath === 'testimonials' || fullPath === 'testimonials-page') {
        setView('testimonials');
      } else if (fullPath === 'brainstorm' || fullPath === 'brainstorm-page') {
        setView('brainstorm');
      } else {
        setView('home');
      }
    };

    window.addEventListener('popstate', resolveLocation);
    window.addEventListener('hashchange', resolveLocation);
    resolveLocation();

    return () => {
      window.removeEventListener('popstate', resolveLocation);
      window.removeEventListener('hashchange', resolveLocation);
    };
  }, []);

  const navigateTo = (newView: ViewState, id?: string) => {
    let newPath = '/';
    let newHash = '';

    if ((newView === 'explore-details' || newView === 'project-detail') && id) {
      setSelectedProjectId(id);
      newPath = `/project/${id}`;
      newHash = `#/project/${id}`;
    } else if (newView === 'explore-details') {
      const activeId = id || selectedProjectId || (projects[0]?.id ?? '');
      if (activeId) setSelectedProjectId(activeId);
      newPath = `/project/${activeId}`;
      newHash = `#/project/${activeId}`;
    } else if (newView === 'blog-detail' && id) {
      setSelectedBlogId(id);
      newPath = `/blog/${id}`;
      newHash = `#/blog/${id}`;
    } else if (newView === 'home') {
      newPath = '/';
      newHash = '';
    } else {
      newPath = `/${newView}`;
      newHash = `#/${newView}`;
    }

    try {
      window.history.pushState({ view: newView, id }, '', newHash || newPath);
    } catch {
      window.location.hash = newHash;
    }

    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <AnnouncementBar onNavigate={(target) => navigateTo(target as ViewState)} />
        <Suspense fallback={<PageLoader />}>
        <AdminCMS 
          onBackToSite={() => navigateTo('home')}
          onBack={() => navigateTo('home')} 
          onPreviewLive={() => navigateTo('home')} 
          onNavigateToProject={(id) => navigateTo('explore-details', id)}
          onNavigateToBlog={(id) => navigateTo('blog-detail', id)}
        />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white overflow-x-hidden bg-white dark:bg-gray-950">
      <AnnouncementBar />
      <Navbar 
        onNavigate={navigateTo} 
        currentView={view} 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="animate-in fade-in duration-700">
        <Suspense fallback={<PageLoader />}>
        {view === 'home' ? (
          <>
            <Hero />
            <Services />
            <Portfolio 
              onViewAll={() => navigateTo('portfolio')} 
              onViewProject={(id) => navigateTo('explore-details', id)}
            />
            <Testimonials />
            <AIPrompt onBrainstorm={() => navigateTo('brainstorm')} />
            <ClientLogos />
            <Blog 
              onViewAll={() => navigateTo('blog')} 
              onViewPost={(id) => navigateTo('blog-detail', id)}
            />
            <Contact />
          </>
        ) : view === 'portfolio' ? (
          <PortfolioPage 
            onBack={() => navigateTo('home')} 
            onSelectProject={(id) => navigateTo('explore-details', id)}
          />
        ) : view === 'contact' ? (
          <ContactPage onBack={() => navigateTo('home')} />
        ) : view === 'about' ? (
          <AboutPage onBack={() => navigateTo('home')} onContact={() => navigateTo('contact')} />
        ) : view === 'blog' ? (
          <BlogPage onBack={() => navigateTo('home')} onSelectPost={(id) => navigateTo('blog-detail', id)} />
        ) : view === 'blog-detail' ? (
          <BlogPage onBack={() => navigateTo('blog')} initialPostId={selectedBlogId} />
        ) : view === 'services' ? (
          <ServicesPage onBack={() => navigateTo('home')} onContact={() => navigateTo('contact')} />
        ) : view === 'testimonials' ? (
          <TestimonialsPage onBack={() => navigateTo('home')} onContact={() => navigateTo('contact')} />
        ) : view === 'brainstorm' ? (
          <BrainstormPage onBack={() => navigateTo('home')} onContact={() => navigateTo('contact')} />
        ) : view === 'seo-tools' ? (
          <SEOToolsPage onBack={() => navigateTo('home')} onNavigateToPage={(route, id) => navigateTo(route as ViewState, id)} />
        ) : (view === 'explore-details' || view === 'project-detail') ? (
          <ExploreDetailsPage 
            selectedId={selectedProjectId}
            onBack={() => navigateTo('portfolio')}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              navigateTo('explore-details', id);
            }}
            onContact={() => navigateTo('contact')}
            onBrainstorm={() => navigateTo('brainstorm')}
          />
        ) : (
          <PrivacyPolicy onBack={() => navigateTo('home')} />
        )}
        </Suspense>
      </main>

      <QuickActionDock 
        currentView={view} 
        onNavigate={(v, id) => navigateTo(v as ViewState, id)} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CMSProvider>
      <AppContent />
    </CMSProvider>
  );
};

export default App;
