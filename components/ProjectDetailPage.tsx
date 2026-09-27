
import React, { useEffect } from 'react';
import { PROJECTS } from '../constants';

interface ProjectDetailPageProps {
  id: string | null;
  onBack: () => void;
  onContact: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ id, onBack, onContact }) => {
  const project = PROJECTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Project Not Found</h1>
          <button onClick={onBack} className="text-blue-600 font-bold hover:underline">Back to Portfolio</button>
        </div>
      </div>
    );
  }

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
          Back to Portfolio
        </button>

        <header className="mb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-500/20">
              {project.category}
            </span>
            {project.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest border border-gray-200 dark:border-white/10">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-gray-900 dark:text-white leading-tight">
            {project.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-3xl font-medium">
            {project.description}
          </p>
        </header>

        <div className="rounded-[60px] overflow-hidden aspect-video mb-24 shadow-2xl border border-gray-100 dark:border-white/10">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white">Project Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                We partnered with the team at {project.title.split(' ')[0]} to solve critical scalability issues and modernize their digital ecosystem. The goal was to create a seamless user experience that maintained high performance even under extreme load. Our approach involved a complete architectural overhaul and a focus on intuitive human-centric design.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border border-gray-100 dark:border-white/5">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-blue-600">🎯</span> The Challenge
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  The client faced significant latency issues and a fragmented UI that led to high user drop-off rates. They needed a unified system that could handle real-time data streaming without compromising on visual fidelity.
                </p>
              </div>
              <div className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border border-gray-100 dark:border-white/5">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-green-600">🚀</span> The Solution
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We implemented a headless architecture paired with a global edge delivery network. By integrating custom AI-driven analytics, we provided the client with predictive insights that boosted engagement by 40%.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-black mb-6 text-gray-900 dark:text-white">The Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-black text-blue-600 mb-2">99.9%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">System Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-600 mb-2">+40%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Engagement</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-green-600 mb-2">&lt;200ms</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Avg Latency</div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="p-10 bg-gray-950 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl">🛠️</div>
              <h3 className="text-xl font-bold mb-6">Tech Stack</h3>
              <ul className="space-y-4">
                {project.tags.map(tag => (
                  <li key={tag} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{tag}</span>
                    <span className="w-8 h-px bg-white/20"></span>
                    <span className="font-bold">v19.0</span>
                  </li>
                ))}
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Cloud</span>
                  <span className="w-8 h-px bg-white/20"></span>
                  <span className="font-bold">AWS Lambda</span>
                </li>
              </ul>
              <button 
                onClick={onContact}
                className="w-full mt-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black transition-all"
              >
                Hire Us for Similar Work
              </button>
            </div>

            <div className="p-10 bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Project Specs</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Timeline</span>
                  <p className="text-gray-900 dark:text-white font-bold italic">4 Months of Development</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Impact</span>
                  <p className="text-gray-900 dark:text-white font-bold italic">Global Transformation</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Location</span>
                  <p className="text-gray-900 dark:text-white font-bold italic">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Navigation for projects */}
        <div className="pt-16 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-center md:text-left">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block">Next Case Study</span>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white">HealthSync Pro</h4>
           </div>
           <button 
             onClick={onBack}
             className="px-12 py-5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full font-black text-gray-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-xl"
           >
             Return to Work
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
