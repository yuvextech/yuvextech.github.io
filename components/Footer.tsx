
import React from 'react';
import { useCMS } from '../context/CMSContext';
import NewsletterSection from './NewsletterSection';

interface FooterProps {
  onNavigate: (view: 'home' | 'privacy' | 'portfolio' | 'contact' | 'about' | 'blog' | 'services' | 'testimonials' | 'brainstorm' | 'explore-details' | 'admin') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, isAuthenticated } = useCMS();

  return (
    <footer className="py-20 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-6">
        {/* Newsletter Subscription Banner */}
        <NewsletterSection source="Footer Newsletter" className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 mb-8"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white font-genos">Y</div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-genos">
                {settings.siteName || 'Yuvex Tech'}
              </span>
            </button>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-8 font-medium">
              Designing and building premium digital products for startups and global brands since 2020.
            </p>
            <div className="flex gap-4">
              <a 
                href={settings.socialLinks?.twitter || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-white dark:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm font-bold text-sm"
                aria-label="Twitter / X"
              >
                𝕏
              </a>
              <a 
                href={settings.socialLinks?.linkedin || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-white dark:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm font-bold text-xs"
                aria-label="LinkedIn"
              >
                Li
              </a>
              <a 
                href={settings.socialLinks?.github || "#"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-white dark:bg-white/5 hover:text-blue-600 dark:hover:text-white transition-all shadow-sm font-bold text-xs"
                aria-label="GitHub"
              >
                Gh
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-gray-900 dark:text-white">Company</h5>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm font-semibold">
              <li><button onClick={() => onNavigate('services')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Services</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">About Us</button></li>
              <li><button onClick={() => onNavigate('portfolio')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Portfolio</button></li>
              <li><button onClick={() => onNavigate('explore-details')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left font-bold text-blue-600 dark:text-blue-400">Explore Details ✨</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-gray-900 dark:text-white">Management & Insights</h5>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm font-semibold">
              <li><button onClick={() => onNavigate('blog')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Latest News</button></li>
              <li><button onClick={() => onNavigate('brainstorm')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">AI Brainstorm</button></li>
              <li><button onClick={() => onNavigate('testimonials')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Testimonials</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-blue-600 dark:hover:text-white transition-colors text-left">Privacy Policy</button></li>
              <li className="pt-2 border-t border-gray-200 dark:border-white/10">
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-colors text-left group"
                >
                  <span>Admin CMS Studio</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono">
                    {isAuthenticated ? 'Active' : 'Login'}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-gray-100 dark:border-white/5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {settings.siteName || 'Yuvex Tech'}. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('admin')} 
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span>🔒 Admin Portal</span>
            </button>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="hover:text-blue-600 dark:hover:text-blue-500 transition-colors">Back to top ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
