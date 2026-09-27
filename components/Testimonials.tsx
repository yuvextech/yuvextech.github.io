import React, { useState, useEffect, useCallback } from 'react';
import { useCMS } from '../context/CMSContext';
import SubmitReviewModal from './SubmitReviewModal';

const Testimonials: React.FC = () => {
  const { testimonials } = useCMS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

  // Calculate average rating
  const avgRating = testimonials.length > 0 
    ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-white dark:bg-gray-950 transition-colors">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-3">
            <span>⭐ Client Reviews & Testimonials</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What our partners say.
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto text-sm md:text-base mb-6">
            Real feedback from technical leaders, founders, and enterprises who have scaled with Yuvex Tech.
          </p>

          {/* Quick Metrics & Share Review Action */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span className="text-yellow-400">★</span>
              <span className="font-bold">{avgRating} / 5.0</span>
              <span className="text-gray-400">•</span>
              <span>{testimonials.length} Verified Reviews</span>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>+</span>
              <span>Share Your Review</span>
            </button>
          </div>
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${encodeURIComponent(current.author)}`;
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {current.tag && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {current.tag}
                    </span>
                  )}
                  {current.isClientSubmission && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      Verified Client
                    </span>
                  )}
                </div>

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

      {/* Review Submission Modal */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={() => {
          setCurrentIndex(0);
        }}
      />
    </section>
  );
};

export default Testimonials;
