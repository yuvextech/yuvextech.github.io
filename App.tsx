
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
    const baseUrl = 'https://yuvextech.github.io';
    let title = `${brandName} | Premium App Development & AI Solutions`;
    let description = 'Yuvex Tech specializes in high-end mobile app development, custom web platforms, and strategic AI integration.';
    let keywords = 'application development, AI solutions, UI/UX design, custom software development, mobile apps, web platforms, fintech development, Yuvex Tech, scalable architecture, React development, Gemini AI integration, software engineering, digital transformation';
    let canonicalUrl = baseUrl;
    let ogImage = 'https://picsum.photos/seed/yuvex-og/1200/630';
    let pageType = 'WebSite';
    let breadcrumbList = null;

    switch (view) {
      case 'admin':
        title = `Admin Content Studio | ${brandName}`;
        description = 'Manage projects, tech news, services, testimonials, and site-wide settings.';
        keywords = 'admin, content management, CMS, projects, settings';
        canonicalUrl = `${baseUrl}/admin`;
        break;
      case 'portfolio':
        title = `Our Portfolio | ${brandName}`;
        description = 'Explore our latest work in mobile apps, web platforms, and AI integrations.';
        keywords = 'portfolio, case studies, mobile apps, web platforms, AI integrations, app development projects';
        canonicalUrl = `${baseUrl}/portfolio`;
        break;
      case 'blog':
        title = `The Knowledge Base & Tech News | ${brandName}`;
        description = 'Insights on engineering, design, and artificial intelligence from our team.';
        keywords = 'blog, tech news, engineering, design, AI insights, software development';
        canonicalUrl = `${baseUrl}/blog`;
        break;
      case 'blog-detail':
        const post = blogPosts.find(p => p.id === selectedBlogId);
        if (post) {
          title = `${post.title} | ${brandName} Blog`;
          description = post.excerpt;
          keywords = `${post.category}, ${post.tags?.join(', ') || 'tech blog'}, ${brandName}`;
          canonicalUrl = `${baseUrl}/blog/${post.id}`;
          ogImage = post.image || ogImage;
          pageType = 'Article';
        }
        break;
      case 'explore-details':
      case 'project-detail':
        const project = projects.find(p => p.id === selectedProjectId) || projects[0];
        if (project) {
          title = `${project.title} | Explore Details & Architecture | ${brandName}`;
          description = project.heroSubtitle || project.overview || project.description;
          keywords = `${project.category}, ${project.tags?.join(', ') || 'software project'}, app development, architecture`;
          canonicalUrl = `${baseUrl}/explore-details/${project.id}`;
          ogImage = project.image || ogImage;
          pageType = 'Article';
          // Build breadcrumb
          breadcrumbList = [
            { name: 'Home', url: baseUrl },
            { name: 'Portfolio', url: `${baseUrl}/portfolio` },
            { name: project.title, url: canonicalUrl }
          ];
        }
        break;
      case 'services':
        title = `Our Services | ${brandName}`;
        description = 'High-end mobile app development, custom web platforms, and AI strategy.';
        keywords = 'mobile app development, web platforms, AI strategy, software development, UI/UX design, fintech development';
        canonicalUrl = `${baseUrl}/services`;
        break;
      case 'about':
        title = `About ${brandName} | Engineering Excellence`;
        description = 'Learn about our mission to transform bold ideas into high-performance digital products.';
        keywords = 'about us, engineering excellence, software company, app development team, AI experts';
        canonicalUrl = `${baseUrl}/about`;
        break;
      case 'contact':
        title = `Contact Us | Start Your Project | ${brandName}`;
        description = 'Ready to build something amazing? Get in touch with our expert engineering team.';
        keywords = 'contact us, get a quote, project inquiry, consultation, app development';
        canonicalUrl = `${baseUrl}/contact`;
        break;
      case 'brainstorm':
        title = `AI Brainstorming | ${brandName}`;
        description = 'Use our AI-powered tool to brainstorm your next big digital product.';
        keywords = 'AI brainstorming, tech ideas, digital product ideas, AI tool, innovation';
        canonicalUrl = `${baseUrl}/brainstorm`;
        break;
      case 'privacy':
        title = `Privacy Policy | ${brandName}`;
        description = `How we handle and protect your data at ${brandName}.`;
        keywords = 'privacy policy, data protection, GDPR, cookies, terms';
        canonicalUrl = `${baseUrl}/privacy`;
        break;
    }

    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    const ogImageEl = document.querySelector('meta[property="og:image"]');
    if (ogImageEl) ogImageEl.setAttribute('content', ogImage);

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', pageType === 'Article' ? 'article' : 'website');

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', ogImage);

    // Inject JSON-LD structured data
    const existingJsonLd = document.getElementById('yuvex-json-ld');
    if (existingJsonLd) existingJsonLd.remove();

    const jsonLd = document.createElement('script');
    jsonLd.id = 'yuvex-json-ld';
    jsonLd.type = 'application/ld+json';

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': pageType === 'Article' ? 'Article' : 'Organization',
      'name': brandName,
      'url': baseUrl,
      'logo': `${baseUrl}/logo.png`,
      'description': description,
      'sameAs': [
        settings.socialLinks?.twitter || 'https://twitter.com/yuvextech',
        settings.socialLinks?.linkedin || 'https://linkedin.com/company/yuvextech',
        settings.socialLinks?.github || 'https://github.com/yuvextech'
      ]
    };

    if (pageType === 'Article' && view === 'blog-detail') {
      const post = blogPosts.find(p => p.id === selectedBlogId);
      if (post) {
        structuredData['@type'] = 'BlogPosting';
        structuredData.headline = post.title;
        structuredData.description = post.excerpt;
        structuredData.image = post.image;
        structuredData.author = { '@type': 'Person', name: post.author || brandName };
        structuredData.publisher = {
          '@type': 'Organization',
          name: brandName,
          logo: { '@type': 'ImageObject', url: `${baseUrl}/logo.png` }
        };
        structuredData.datePublished = post.date;
      }
    } else if (pageType === 'Article' && (view === 'explore-details' || view === 'project-detail')) {
      const project = projects.find(p => p.id === selectedProjectId) || projects[0];
      if (project) {
        structuredData['@type'] = 'CreativeWork';
        structuredData.name = project.title;
        structuredData.description = project.description;
        structuredData.image = project.image;
        structuredData.author = { '@type': 'Organization', name: brandName };
      }
    }

    // Add breadcrumbList if applicable
    if (breadcrumbList) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbList.map((item, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': item.name,
          'item': item.url
        }))
      };
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
      document.head.appendChild(breadcrumbScript);
    }

    jsonLd.textContent = JSON.stringify(structuredData);
    document.head.appendChild(jsonLd);

  }, [view, selectedProjectId, selectedBlogId, projects, blogPosts, settings.siteName, settings.socialLinks]);

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
