
import React, { useState, useEffect } from 'react';
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
import PrivacyPolicy from './components/PrivacyPolicy';
import PortfolioPage from './components/PortfolioPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import ServicesPage from './components/ServicesPage';
import TestimonialsPage from './components/TestimonialsPage';
import BrainstormPage from './components/BrainstormPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import ExploreDetailsPage from './components/ExploreDetailsPage';
import AdminCMS from './components/AdminCMS';
import AnnouncementBar from './components/AnnouncementBar';
import { CMSProvider, useCMS } from './context/CMSContext';

type ViewState = 'home' | 'privacy' | 'portfolio' | 'contact' | 'about' | 'blog' | 'blog-detail' | 'services' | 'testimonials' | 'brainstorm' | 'project-detail' | 'explore-details' | 'admin';

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

  // SEO & Meta Tag Management
  useEffect(() => {
    const brandName = settings.siteName || 'Yuvex Tech';
    let title = `${brandName} | Premium App Development & AI Solutions`;
    let description = 'Yuvex Tech specializes in high-end mobile app development, custom web platforms, and strategic AI integration.';

    switch (view) {
      case 'admin':
        title = `Admin Content Studio | ${brandName}`;
        description = 'Manage projects, tech news, services, testimonials, and site-wide settings.';
        break;
      case 'portfolio':
        title = `Our Portfolio | ${brandName}`;
        description = 'Explore our latest work in mobile apps, web platforms, and AI integrations.';
        break;
      case 'blog':
        title = `The Knowledge Base & Tech News | ${brandName}`;
        description = 'Insights on engineering, design, and artificial intelligence from our team.';
        break;
      case 'blog-detail':
        const post = blogPosts.find(p => p.id === selectedBlogId);
        if (post) {
          title = `${post.title} | ${brandName} Blog`;
          description = post.excerpt;
        }
        break;
      case 'explore-details':
      case 'project-detail':
        const project = projects.find(p => p.id === selectedProjectId) || projects[0];
        if (project) {
          title = `${project.title} | Explore Details & Architecture | ${brandName}`;
          description = project.heroSubtitle || project.overview || project.description;
        }
        break;
      case 'services':
        title = `Our Services | ${brandName}`;
        description = 'High-end mobile app development, custom web platforms, and AI strategy.';
        break;
      case 'about':
        title = `About ${brandName} | Engineering Excellence`;
        description = 'Learn about our mission to transform bold ideas into high-performance digital products.';
        break;
      case 'contact':
        title = `Contact Us | Start Your Project | ${brandName}`;
        description = 'Ready to build something amazing? Get in touch with our expert engineering team.';
        break;
      case 'brainstorm':
        title = `AI Brainstorming | ${brandName}`;
        description = 'Use our AI-powered tool to brainstorm your next big digital product.';
        break;
      case 'privacy':
        title = `Privacy Policy | ${brandName}`;
        description = `How we handle and protect your data at ${brandName}.`;
        break;
    }

    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);

  }, [view, selectedProjectId, selectedBlogId, projects, blogPosts, settings.siteName]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin' || hash === '#cms') {
        setView('admin');
      } else if (hash === '#privacy') {
        setView('privacy');
      } else if (hash === '#portfolio-page') {
        setView('portfolio');
      } else if (hash === '#contact-page') {
        setView('contact');
      } else if (hash === '#about') {
        setView('about');
      } else if (hash === '#blog-page') {
        setView('blog');
      } else if (hash === '#services-page') {
        setView('services');
      } else if (hash === '#testimonials-page') {
        setView('testimonials');
      } else if (hash === '#brainstorm-page') {
        setView('brainstorm');
      } else if (hash === '#explore-details') {
        setView('explore-details');
      } else if (hash.startsWith('#explore-details/')) {
        const id = hash.replace('#explore-details/', '');
        setSelectedProjectId(id);
        setView('explore-details');
      } else if (hash.startsWith('#project/')) {
        const id = hash.replace('#project/', '');
        setSelectedProjectId(id);
        setView('explore-details');
      } else if (hash.startsWith('#blog/')) {
        const id = hash.replace('#blog/', '');
        setSelectedBlogId(id);
        setView('blog-detail');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (newView: ViewState, id?: string) => {
    if ((newView === 'explore-details' || newView === 'project-detail') && id) {
      setSelectedProjectId(id);
      window.location.hash = `explore-details/${id}`;
    } else if (newView === 'explore-details') {
      window.location.hash = selectedProjectId ? `explore-details/${selectedProjectId}` : 'explore-details';
    } else if (newView === 'blog-detail' && id) {
      setSelectedBlogId(id);
      window.location.hash = `blog/${id}`;
    } else if (newView === 'home') {
      window.location.hash = '';
    } else if (newView === 'admin') {
      window.location.hash = 'admin';
    } else {
      const hashMap: Record<string, string> = {
        portfolio: 'portfolio-page',
        contact: 'contact-page',
        about: 'about',
        blog: 'blog-page',
        services: 'services-page',
        testimonials: 'testimonials-page',
        brainstorm: 'brainstorm-page',
        'explore-details': 'explore-details',
        privacy: 'privacy',
        admin: 'admin'
      };
      window.location.hash = hashMap[newView] || '';
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
        <AdminCMS 
          onBackToSite={() => navigateTo('home')}
          onBack={() => navigateTo('home')} 
          onPreviewLive={() => navigateTo('home')} 
          onNavigateToProject={(id) => navigateTo('explore-details', id)}
          onNavigateToBlog={(id) => navigateTo('blog-detail', id)}
        />
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
        ) : (view === 'explore-details' || view === 'project-detail') ? (
          <ExploreDetailsPage 
            selectedId={selectedProjectId}
            onBack={() => navigateTo('portfolio')}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              window.location.hash = `explore-details/${id}`;
            }}
            onContact={() => navigateTo('contact')}
            onBrainstorm={() => navigateTo('brainstorm')}
          />
        ) : (
          <PrivacyPolicy onBack={() => navigateTo('home')} />
        )}
      </main>

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
