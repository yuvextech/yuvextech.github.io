
import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

interface TestimonialsPageProps {
  onBack: () => void;
  onContact: () => void;
}

const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onBack, onContact }) => {
  const { testimonials } = useCMS();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

        <header className="mb-24 text-center max-w-4xl mx-auto">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Success Stories</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            Voices of <span className="text-gradient">Innovation</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            We measure our success by the success of our partners. Read how we've helped startups and global leaders transform their digital landscape.
          </p>
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="p-10 rounded-[40px] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-10 flex-1 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-white/5 pt-8">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-14 h-14 rounded-full border-2 border-white dark:border-white/10 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{testimonial.role} @ {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials Placeholder Section */}
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
          <button 
            onClick={onContact}
            className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 relative z-10"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
