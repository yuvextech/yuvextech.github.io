
import React from 'react';
import { useCMS } from '../context/CMSContext';

interface BlogProps {
  onViewAll: () => void;
  onViewPost?: (id: string) => void;
}

const Blog: React.FC<BlogProps> = ({ onViewAll, onViewPost }) => {
  const { blogPosts } = useCMS();

  return (
    <section id="blog" className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Insights</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Latest from our Blog</h3>
          </div>
          <button 
            onClick={onViewAll}
            className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 transition-colors font-semibold text-sm group"
          >
            View All Posts
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <div 
              key={post.id} 
              onClick={() => onViewPost ? onViewPost(post.id) : onViewAll()}
              className="group cursor-pointer bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[40px] overflow-hidden hover:-translate-y-2 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">{post.category}</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-4">{post.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
