import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import SubmitReviewModal from './SubmitReviewModal';

interface TestimonialsPageProps {
  onBack: () => void;
  onContact: () => void;
}

const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onBack, onContact }) => {
  const { testimonials } = useCMS();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Compute tags
  const allTags = ['all', ...Array.from(new Set(testimonials.map(t => t.tag).filter(Boolean) as string[]))];

  // Filtered testimonials
  const filteredTestimonials = selectedTag === 'all'
    ? testimonials
    : testimonials.filter(t => t.tag === selectedTag);

  // Compute average rating
  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-12 transition-all group font-bold"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <header className="mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-widest mb-4">
            <span>⭐ Client Reviews & Testimonials</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            Voices of <span className="text-gradient">Innovation</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium mb-8">
            We measure our engineering impact by the tangible success of our partners. Read verified client reviews and share your own experience.
          </p>

          {/* Quick Stats & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-semibold text-gray-800 dark:text-gray-200">
              <span className="text-yellow-400 text-base">★</span>
              <span className="font-bold text-sm">{avgRating} / 5.0</span>
              <span className="text-gray-400">•</span>
              <span>{testimonials.length} Verified Client Reviews</span>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>⭐</span>
              <span>Share Your Review</span>
            </button>
          </div>

          {/* Filter Pills */}
          {allTags.length > 2 && (
            <div className="flex items-center justify-center gap-2 flex-wrap mt-10">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tag === 'all' ? 'All Reviews' : tag}
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {filteredTestimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="p-10 rounded-[40px] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col animate-in fade-in slide-in-from-bottom-8 shadow-sm hover:shadow-xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {testimonial.tag && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider">
                      {testimonial.tag}
                    </span>
                  )}
                  {testimonial.isClientSubmission && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-10 flex-1 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-8">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-white/10 shadow-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.pravatar.cc/150?u=${encodeURIComponent(testimonial.author)}`;
                  }}
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Interactive Card Inviting User to Submit Review */}
          <div 
            onClick={() => setIsReviewModalOpen(true)}
            className="p-10 rounded-[40px] border-2 border-dashed border-blue-500/30 hover:border-blue-500 bg-blue-500/[0.02] hover:bg-blue-500/[0.06] transition-all cursor-pointer group flex flex-col justify-center items-center text-center shadow-sm hover:shadow-xl"
          >
            <div className="w-16 h-16 rounded-full bg-blue-600/10 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center text-2xl font-bold mb-6 transition-all group-hover:scale-110 shadow-inner">
              +
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Have you worked with us?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs mb-6">
              Share your project review. It will be stored to the system CMS and published to our verified stories.
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-600/20 group-hover:bg-blue-500 transition-all">
              Write a Review →
            </span>
          </div>
        </div>

        {/* Video Testimonials Deep Dives */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-6">Deep Dives</h3>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">Hear directly from the visionaries behind the products we build.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative aspect-video rounded-[50px] overflow-hidden group shadow-2xl border border-gray-100 dark:border-white/10">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Video thumbnail" />
              <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5v13L16 10z"/></svg>
                </button>
              </div>
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-xl font-bold">Scaling FinStream to 1M Users</p>
                <p className="text-white/80 text-sm">A conversation with Elena Rodriguez</p>
              </div>
            </div>
            
            <div className="relative aspect-video rounded-[50px] overflow-hidden group shadow-2xl border border-gray-100 dark:border-white/10">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Video thumbnail" />
              <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5v13L16 10z"/></svg>
                </button>
              </div>
              <div className="absolute bottom-8 left-8">
                <p className="text-white text-xl font-bold">The Future of AI Architecture</p>
                <p className="text-white/80 text-sm">Behind the scenes with NexGen Systems</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-32 p-12 md:p-20 bg-gray-950 dark:bg-white/[0.02] border border-white/5 rounded-[50px] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 text-white">Become our next success story.</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Join 50+ partners who have trusted Yuvex Tech with their most ambitious projects.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button 
              onClick={onContact}
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-black text-base hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
            >
              Start Your Journey
            </button>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 active:scale-95"
            >
              Submit Client Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};

export default TestimonialsPage;
