
import React, { useState, useEffect, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';

interface PortfolioPageProps {
  onBack: () => void;
  onSelectProject?: (id: string) => void;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({ onBack, onSelectProject }) => {
  const { projects } = useCMS();
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

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

        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Portfolio</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            Our <span className="text-gradient">Masterpieces</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            A curation of our most challenging and successful projects. From fintech dashboards to AI-driven health platforms, we build the future.
          </p>
        </header>

        {/* Filter Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-3 rounded-full text-sm font-bold border transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20'
                  : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="group animate-in fade-in slide-in-from-bottom-8 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelectProject?.(project.id)}
            >
              <div className="relative overflow-hidden rounded-[40px] mb-8 aspect-[16/11] border border-gray-100 dark:border-white/10 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                  <span className="text-white text-xs font-black uppercase tracking-[0.3em] mb-4 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Case Study</span>
                  <h3 className="text-white text-3xl font-bold mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject?.(project.id);
                    }}
                    className="bg-white text-blue-600 px-10 py-4 rounded-full font-black text-sm hover:bg-gray-100 transition-colors shadow-2xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 delay-100"
                  >
                    Explore Details
                  </button>
                </div>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-black tracking-tighter bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1 rounded-full text-blue-600 dark:text-blue-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No projects here yet</h3>
            <p className="text-gray-500">We're constantly building. Check back soon for more masterpieces.</p>
          </div>
        )}

        <div className="mt-32 p-12 md:p-20 bg-blue-600 rounded-[50px] text-center text-white relative overflow-hidden shadow-2xl shadow-blue-600/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">Have a project in mind?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10 font-medium">
            Join the ranks of successful industry leaders. Let's build your next big thing together.
          </p>
          <button 
            onClick={() => onBack()}
            className="bg-white text-blue-600 px-12 py-5 rounded-full font-black text-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl relative z-10"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
