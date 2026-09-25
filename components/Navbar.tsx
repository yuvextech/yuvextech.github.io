
import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

interface NavbarProps {
  onNavigate: (view: 'home' | 'privacy' | 'portfolio' | 'contact' | 'about' | 'blog' | 'services' | 'testimonials' | 'brainstorm' | 'explore-details' | 'admin') => void;
  currentView: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView, theme, onToggleTheme }) => {
  const { settings, isAuthenticated } = useCMS();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Services', href: '#services-page', type: 'view', target: 'services' as const },
    { name: 'About', href: '#about', type: 'view', target: 'about' as const },
    { name: 'Portfolio', href: '#portfolio-page', type: 'view', target: 'portfolio' as const },
    { name: 'Explore Details', href: '#explore-details', type: 'view', target: 'explore-details' as const },
    { name: 'Blog', href: '#blog-page', type: 'view', target: 'blog' as const },
    { name: 'Brainstorm', href: '#brainstorm-page', type: 'view', target: 'brainstorm' as const },
    { name: 'Testimonials', href: '#testimonials-page', type: 'view', target: 'testimonials' as const },
    { name: 'Contact', href: '#contact-page', type: 'view', target: 'contact' as const },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (link.type === 'view') {
      e.preventDefault();
      onNavigate(link.target!);
      setIsMenuOpen(false);
    } else {
      if (currentView !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          const id = link.href.replace('#', '');
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled || isMenuOpen ? 'py-4 bg-white/90 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/5' : 'py-6 bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <button 
            onClick={() => { onNavigate('home'); setIsMenuOpen(false); window.scrollTo({top: 0, behavior: 'smooth'}); }}
            className="flex items-center gap-2 group relative z-[110]"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white transition-transform group-hover:scale-110 shadow-lg shadow-blue-600/20 font-genos">
              {(settings.siteName || 'Yuvex Tech').charAt(0)}
            </div>
            <span className="text-2xl font-bold tracking-tight dark:text-white font-genos">
              {settings.siteName || 'Yuvex Tech'}
            </span>
          </button>
          
          <div className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link)}
                className={`transition-colors relative group uppercase tracking-wider ${currentView === link.target ? 'text-blue-600 dark:text-blue-400' : 'hover:text-blue-600 dark:hover:text-white'}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-500 transition-all ${currentView === link.target ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('admin')}
              className="px-3 py-1.5 rounded-full text-xs font-bold border border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all flex items-center gap-1.5"
              title="Admin CMS Dashboard"
            >
              <span>⚙️</span>
              <span className="hidden xl:inline">CMS</span>
            </button>
            <button 
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-all active:scale-95"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="hidden sm:block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
            >
              Start Project
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-[110]">
              <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-900 dark:bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[90] lg:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-white dark:bg-gray-950/98 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`relative h-full flex flex-col justify-center items-start px-10 md:px-20 transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-10'}`}>
          <div className="flex flex-col items-start gap-4">
            <div className="text-blue-500 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Navigation</div>
            {navLinks.map((link, index) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleLinkClick(e, link)}
                className={`group flex items-baseline gap-4 text-4xl md:text-6xl font-black transition-all duration-300 animate-in fade-in slide-in-from-left-8 ${currentView === link.target ? 'text-blue-600' : 'text-gray-900 dark:text-white hover:text-blue-500'}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 transition-colors tracking-widest mt-1">
                  0{index + 1}
                </span>
                <span className="uppercase">{link.name}</span>
              </a>
            ))}
            
            <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full animate-in fade-in slide-in-from-left-8" style={{ animationDelay: `${navLinks.length * 60}ms` }}>
              <button 
                type="button"
                aria-label="Start a Discussion / Contact Us"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all text-center shadow-2xl shadow-blue-600/30 dark:shadow-blue-600/20 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/40 flex items-center justify-center gap-2 text-base"
              >
                <span>💬</span>
                <span>Start a Discussion</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button 
                type="button"
                aria-label="Open Admin CMS"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate('admin');
                }}
                className="cursor-pointer px-6 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 font-bold rounded-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all text-center flex items-center justify-center gap-2 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-base"
              >
                <span>⚙️</span>
                <span>Admin CMS</span>
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-12 left-10 md:left-20 text-gray-400 dark:text-gray-600 text-[10px] font-bold tracking-[0.4em] uppercase">
            Yuvex Tech Architecture © 2024
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
