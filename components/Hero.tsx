
import React, { useEffect, useRef, useState } from 'react';
import { useCMS } from '../context/CMSContext';

const Hero: React.FC = () => {
  const { settings } = useCMS();
  const sectionRef = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState('');
  const fullText = settings.heroTitle || "Designing Products That Resonate.";
  const typingSpeed = 70;

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.scrollY;
        sectionRef.current.style.setProperty('--scroll-parallax', `${scrolled * 0.15}px`);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let currentIdx = 0;
    setDisplayText('');
    const interval = setInterval(() => {
      if (currentIdx <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIdx));
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white dark:bg-gray-950">
      {/* Background Decor with animations */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Decorative Elements */}
      <div className="hidden lg:block absolute top-[20%] right-[15%] text-blue-500/20 animate-float">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="hidden lg:block absolute bottom-[25%] left-[10%] text-purple-500/20 animate-float-delayed">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-fade-in-up">
            {settings.heroBadge || "Building the next generation of digital products"}
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-8 text-gray-900 dark:text-white min-h-[1.2em]">
            {displayText.split(' ').map((word, i, arr) => {
              const isLastTwo = i >= arr.length - 2;
              return (
                <span key={i} className={isLastTwo ? 'text-gradient' : ''}>
                  {word}{i !== arr.length - 1 ? ' ' : ''}
                </span>
              );
            })}
            <span className="inline-block w-[3px] h-[0.9em] bg-blue-600 ml-1 animate-pulse align-middle"></span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {settings.heroSubtitle || "Yuvex Tech transforms bold ideas into high-performance applications. We combine cutting-edge engineering with world-class design to elevate your business."}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative group w-full sm:w-auto">
              {/* Pulsing ring around CTA */}
              <div className="absolute -inset-1 bg-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <a href="#portfolio" className="relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95">
                View Our Work
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
            
            <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-center active:scale-95">
              Book a Strategy Call
            </a>
          </div>
        </div>

        {/* Mockup Preview with Parallax */}
        <div 
          className="mt-20 relative max-w-5xl mx-auto transition-transform duration-100 ease-out"
          style={{ transform: 'translateY(calc(var(--scroll-parallax, 0px) * -1))' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-gray-950 z-10"></div>
          {/* Subtle floating effect for the main image */}
          <div className="animate-float">
            <img 
              src="https://picsum.photos/seed/dashboard-tech/1200/600" 
              alt="App Preview" 
              className="rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-700 w-full h-auto filter dark:grayscale hover:grayscale-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;