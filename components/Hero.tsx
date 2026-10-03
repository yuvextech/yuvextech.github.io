import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';

interface HeroProps {
  onExploreProject?: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onExploreProject }) => {
  const { settings, projects } = useCMS();
  const sectionRef = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState('');
  const [isDrifting, setIsDrifting] = useState(true);
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

  // Split projects into two rows
  const baseRow1 = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return projects.filter((_, i) => i % 2 === 0);
  }, [projects]);

  const baseRow2 = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return projects.filter((_, i) => i % 2 !== 0);
  }, [projects]);

  // Ensure minimum cards before duplicating for a seamless 50% loop
  const seamlessRow1 = useMemo(() => {
    if (baseRow1.length === 0) return [];
    let list = [...baseRow1];
    while (list.length < 5) {
      list = [...list, ...baseRow1];
    }
    // Duplicate for seamless 0% -> -50% marquee loop
    return [...list, ...list];
  }, [baseRow1]);

  const seamlessRow2 = useMemo(() => {
    if (baseRow2.length === 0) return [];
    let list = [...baseRow2];
    while (list.length < 5) {
      list = [...list, ...baseRow2];
    }
    // Duplicate for seamless -50% -> 0% marquee loop
    return [...list, ...list];
  }, [baseRow2]);

  return (
    <section 
      ref={sectionRef} 
      style={{ paddingTop: '30px', paddingBottom: '30px' }}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white dark:bg-gray-950 transition-colors"
    >
      {/* Background Decor with animations */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full animate-pulse-subtle pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] rounded-full animate-pulse-subtle pointer-events-none" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Decorative Elements */}
      <div className="hidden lg:block absolute top-[20%] right-[15%] text-blue-500/20 animate-float pointer-events-none">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="hidden lg:block absolute bottom-[25%] left-[10%] text-purple-500/20 animate-float-delayed pointer-events-none">
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

        {/* Horizontal StaggeredGrid View with Smooth Animated Drift (Left & Right) */}
        <div 
          className="mt-16 sm:mt-20 relative max-w-[100vw] -mx-6 sm:mx-auto sm:max-w-7xl transition-transform duration-100 ease-out"
          style={{ transform: 'translateY(calc(var(--scroll-parallax, 0px) * -1))' }}
        >
          {/* Subtle Left & Right Edge Fade Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20"></div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20"></div>

          {/* Header Bar with Drift Status & Toggle */}
          <div className="flex items-center justify-between mb-4 px-6 sm:px-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-gray-600 dark:text-gray-300 font-semibold">
                Project Gallery • Interactive Drift
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsDrifting(prev => !prev)}
              className="text-xs font-mono px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Toggle automatic horizontal drift"
            >
              <span>{isDrifting ? '⏸' : '▶'}</span>
              <span>{isDrifting ? 'Pause' : 'Drift'}</span>
            </button>
          </div>

          {/* Staggered Grid Container with Two Smooth Drifting Tracks */}
          <div className="relative overflow-hidden py-2 space-y-4 sm:space-y-6">
            {/* Track 1: Smooth Animated Drift to the LEFT */}
            <div className="relative overflow-hidden pause-on-hover">
              <div 
                className="flex w-max gap-4 sm:gap-6 animate-drift-left"
                style={{ animationPlayState: isDrifting ? 'running' : 'paused' }}
              >
                {seamlessRow1.map((project, idx) => (
                  <div
                    key={`track-left-${project.id}-${idx}`}
                    onClick={() => onExploreProject?.(project.id)}
                    className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/90 dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer hover:-translate-y-1 shrink-0 bg-gray-100 dark:bg-gray-900 ${
                      idx % 3 === 0
                        ? 'w-[260px] sm:w-[340px] md:w-[410px] h-[155px] sm:h-[195px] md:h-[235px]'
                        : idx % 3 === 1
                        ? 'w-[220px] sm:w-[280px] md:w-[325px] h-[155px] sm:h-[195px] md:h-[235px]'
                        : 'w-[290px] sm:w-[370px] md:w-[440px] h-[155px] sm:h-[195px] md:h-[235px]'
                    }`}
                    title={project.title}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-blue-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Track 2: Smooth Animated Drift to the RIGHT (with staggered visual offset) */}
            <div className="relative overflow-hidden pause-on-hover">
              <div 
                className="flex w-max gap-4 sm:gap-6 animate-drift-right"
                style={{ animationPlayState: isDrifting ? 'running' : 'paused' }}
              >
                {seamlessRow2.map((project, idx) => (
                  <div
                    key={`track-right-${project.id}-${idx}`}
                    onClick={() => onExploreProject?.(project.id)}
                    className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200/90 dark:border-white/10 shadow-md hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer hover:-translate-y-1 shrink-0 bg-gray-100 dark:bg-gray-900 ${
                      idx % 3 === 0
                        ? 'w-[240px] sm:w-[300px] md:w-[345px] h-[155px] sm:h-[195px] md:h-[235px]'
                        : idx % 3 === 1
                        ? 'w-[310px] sm:w-[390px] md:w-[460px] h-[155px] sm:h-[195px] md:h-[235px]'
                        : 'w-[260px] sm:w-[340px] md:w-[390px] h-[155px] sm:h-[195px] md:h-[235px]'
                    }`}
                    title={project.title}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-blue-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
