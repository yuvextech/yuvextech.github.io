
import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

interface ServicesPageProps {
  onBack: () => void;
  onContact: () => void;
}

const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    description: 'We dive deep into your business goals, user needs, and market landscape to define the perfect product roadmap.'
  },
  {
    step: '02',
    title: 'Design',
    description: 'Our designers craft intuitive, high-fidelity interfaces that prioritize user experience and brand identity.'
  },
  {
    step: '03',
    title: 'Development',
    description: 'Our engineers build robust, scalable architectures using modern tech stacks and agile methodologies.'
  },
  {
    step: '04',
    title: 'Launch',
    description: 'We ensure a smooth deployment with rigorous testing and continuous monitoring for peak performance.'
  }
];

const ServicesPage: React.FC<ServicesPageProps> = ({ onBack, onContact }) => {
  const { services } = useCMS();
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
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">What We Do</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            Our <span className="text-gradient">Core Capabilities</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            From initial concept to global scale, we provide the technical expertise and creative vision to build digital products that lead industries.
          </p>
        </header>

        {/* Detailed Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="p-12 rounded-[50px] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col md:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-6xl group-hover:scale-110 transition-transform p-6 bg-white dark:bg-white/5 rounded-[30px] shadow-sm">
                {service.icon}
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {['Scalable Architecture', 'Premium Performance', 'Edge Case Security'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-500 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">How We Build</h3>
            <p className="text-gray-500 max-w-xl mx-auto">Our proven methodology ensures every project is delivered with precision and excellence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {PROCESS.map((p, idx) => (
              <div key={idx} className="relative p-10 bg-blue-600/5 dark:bg-blue-600/10 rounded-[40px] border border-blue-500/10 group overflow-hidden">
                <span className="absolute -top-4 -right-4 text-8xl font-black text-blue-600/5 dark:text-blue-400/5 group-hover:scale-110 transition-transform">
                  {p.step}
                </span>
                <div className="text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest mb-4">Step {p.step}</div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{p.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Preview or Secondary CTA */}
        <div className="p-12 md:p-20 bg-blue-600 rounded-[60px] text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to scale?</h2>
          <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium">
            Stop worrying about technical debt. Let us build the foundation your business deserves.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button 
              onClick={onContact}
              className="bg-white text-blue-600 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Start Free Consultation
            </button>
            <button 
              onClick={onBack}
              className="bg-blue-700/30 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-blue-700/50 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
