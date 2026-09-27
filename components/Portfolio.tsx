
import React, { useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';

interface PortfolioProps {
  onViewAll?: () => void;
  onViewProject?: (id: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onViewAll, onViewProject }) => {
  const { projects } = useCMS();
  const [activeCategory, setActiveCategory] = useState('All');

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
    <section id="portfolio" className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Case Studies</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Recent Projects</h3>
          </div>
          <button 
            onClick={onViewAll}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 transition-colors font-semibold text-sm group"
          >
            View All Work 
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold border transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[400px]">
          {filteredProjects.slice(0, 3).map((project) => (
            <div 
              key={project.id} 
              className="group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
              onClick={() => onViewProject?.(project.id)}
            >
              <div className="relative overflow-hidden rounded-3xl mb-6 aspect-[4/3] border border-gray-100 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex items-center justify-center backdrop-blur-[2px]">
                  <span className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-2xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 delay-75 ease-out">
                    Explore Details
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold tracking-tighter bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{project.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
            </div>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
              <span className="text-4xl mb-4">🔍</span>
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
