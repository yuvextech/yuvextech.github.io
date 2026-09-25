
import React, { useState, useEffect, useCallback } from 'react';
import { useCMS } from '../context/CMSContext';

const Testimonials: React.FC = () => {
  const { testimonials } = useCMS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const next = useCallback(() => {
    if (isTransitioning || testimonials.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning, testimonials.length]);

  const prev = () => {
    if (isTransitioning || testimonials.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 400);
  };

  useEffect(() => {
    if (isPaused || testimonials.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused, next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">What our partners say.</h3>
        </div>

        <div 
          className="max-w-5xl mx-auto relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Quote Icon */}
          <div className="absolute -top-10 -left-6 text-9xl text-blue-600/10 dark:text-blue-600/10 font-serif select-none">“</div>
          
          <div className={`glass rounded-[40px] p-8 md:p-16 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <img 
                  src={current.avatar} 
                  alt={current.author} 
                  className="w-full h-full object-cover rounded-full border-2 border-white/10 dark:border-white/10 relative z-10 shadow-xl"
                />
              </div>
              
              <div className="flex-1">
                <blockquote className="text-xl md:text-3xl font-medium leading-relaxed italic mb-8 text-gray-800 dark:text-white/90">
                  "{current.quote}"
                </blockquote>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">{current.author}</h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold">{current.role} @ {current.company}</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={prev}
                      className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all active:scale-90 shadow-sm"
                      aria-label="Previous testimonial"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button 
                      onClick={next}
                      className="w-12 h-12 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all active:scale-90 shadow-sm"
                      aria-label="Next testimonial"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setCurrentIndex(idx);
                        setIsTransitioning(false);
                    }, 400);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-white/10'}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;