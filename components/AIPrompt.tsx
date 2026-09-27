
import React from 'react';

interface AIPromptProps {
  onBrainstorm: () => void;
}

const AIPrompt: React.FC<AIPromptProps> = ({ onBrainstorm }) => {
  return (
    <section id="brainstorm" className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-[40px] relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-20 text-6xl group-hover:rotate-12 transition-transform">✨</div>
          
          <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Have an idea? Let's brainstorm.</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
            Our proprietary AI Architect can suggest technical stacks, project names, and strategic features for your next venture in seconds.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-gray-400 dark:text-gray-500 flex items-center cursor-pointer" onClick={onBrainstorm}>
              e.g. A social network for urban gardeners...
            </div>
            <button 
              onClick={onBrainstorm}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all whitespace-nowrap shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Open AI Lab
            </button>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" alt="User" />
              ))}
            </div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Join 500+ builders using our tool
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPrompt;
