
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useCMS } from '../context/CMSContext';
import { BlogPost, Comment } from '../types';
import NewsletterSection from './NewsletterSection';

const READ_STORAGE_KEY = 'yuvex_read_posts';
const COMMENTS_STORAGE_KEY = 'yuvex_blog_comments';
const PROGRESS_STORAGE_KEY = 'yuvex_blog_progress';
const COMMENTS_PER_PAGE = 5;

const CATEGORY_ICONS: Record<string, string> = {
  'Web Development': '🌐',
  'AI': '🧠',
  'Architecture': '🏗️',
  'Design': '🎨',
  'All': '✨',
  'Tech News': '⚡',
  'Cybersecurity': '🛡️'
};

interface BlogPageProps {
  onBack: () => void;
  onSelectPost?: (id: string) => void;
  initialPostId?: string | null;
}

const BlogPage: React.FC<BlogPageProps> = ({ onBack, onSelectPost, initialPostId }) => {
  const { blogPosts } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [readPosts, setReadPosts] = useState<Set<string>>(new Set());
  const [readProgress, setReadProgress] = useState<Record<string, number>>({});
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    blogPosts.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogPosts]);

  useEffect(() => {
    if (initialPostId) {
      const post = blogPosts.find(p => p.id === initialPostId);
      if (post) setSelectedPost(post);
    } else {
      setSelectedPost(null);
    }
  }, [initialPostId, blogPosts]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const savedRead = localStorage.getItem(READ_STORAGE_KEY);
    if (savedRead) {
      try {
        const parsed = JSON.parse(savedRead);
        if (Array.isArray(parsed)) setReadPosts(new Set(parsed));
      } catch (e) {}
    }

    const savedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {}
    }

    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (savedProgress) {
      try {
        setReadProgress(JSON.parse(savedProgress));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (selectedPost) {
      const handleScroll = () => {
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(100, Math.max(0, (window.scrollY / height) * 100));
        setReadProgress(prev => {
          const next = { ...prev, [selectedPost.id]: progress };
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [selectedPost]);

  const openPost = (post: BlogPost) => {
    setReadPosts((prev) => {
      const next = new Set(prev);
      next.add(post.id);
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
    if (onSelectPost) {
      onSelectPost(post.id);
    } else {
      setSelectedPost(post);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return blogPosts.filter((post) => {
      const matchesSearch = !query || 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, blogPosts]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPost) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Tech Innovator',
      text: newComment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: `https://i.pravatar.cc/100?u=user-${Math.floor(Math.random() * 1000)}`
    };
    setComments(prev => ({
      ...prev,
      [selectedPost.id]: [comment, ...(prev[selectedPost.id] || [])]
    }));
    setNewComment('');
    setCommentPage(1);
  };

  if (selectedPost) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <div className="fixed top-0 left-0 w-full h-1.5 z-[120] bg-gray-200 dark:bg-white/5">
          <div 
            className="h-full bg-blue-600 transition-all duration-150 ease-out"
            style={{ width: `${readProgress[selectedPost.id] || 0}%` }}
          />
        </div>
        <div className="container mx-auto px-6 max-w-4xl">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-12 transition-all font-bold group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to All Posts
          </button>

          <article>
            <div className="mb-12">
              <span className="px-4 py-1.5 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-widest mb-6 inline-block text-white">
                {CATEGORY_ICONS[selectedPost.category]} {selectedPost.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight text-gray-900 dark:text-white">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 text-gray-500">
                <img src={`https://i.pravatar.cc/100?u=${selectedPost.author.replace(/\s/g, '')}`} className="w-12 h-12 rounded-full border border-gray-100 dark:border-white/10" alt={selectedPost.author} />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedPost.author}</p>
                  <p className="text-sm">{selectedPost.date} • {selectedPost.readTime} read</p>
                </div>
              </div>
            </div>
            <img src={selectedPost.image} className="w-full h-[500px] object-cover rounded-[50px] mb-12 shadow-2xl" alt={selectedPost.title} />
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-12">
              {selectedPost.content || selectedPost.excerpt}
              <p className="mt-8">At Yuvex Tech, we explore the boundaries of what's possible in the digital realm. Join our community as we continue to push innovation forward.</p>
            </div>

            {/* Newsletter Subscription for Readers */}
            <NewsletterSection compact source={`Blog Article: ${selectedPost.title}`} className="my-10" />
          </article>

          <div className="border-t border-gray-100 dark:border-white/5 pt-16">
            <h3 className="text-3xl font-black mb-10 text-gray-900 dark:text-white">Discussion</h3>
            <form onSubmit={handleAddComment} className="mb-12">
              <textarea 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 focus:outline-none focus:border-blue-500 transition-all min-h-[150px] resize-none text-gray-900 dark:text-white"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="mt-4 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
              >
                Post Comment
              </button>
            </form>
            <div className="space-y-8">
              {(comments[selectedPost.id] || []).map(comment => (
                <div key={comment.id} className="flex gap-6 p-8 bg-gray-50 dark:bg-white/5 rounded-[40px] border border-gray-100 dark:border-white/10">
                  <img src={comment.avatar} className="w-12 h-12 rounded-full shrink-0" alt={comment.author} />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-12 transition-all font-bold group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Insights</h2>
          <h1 className="text-5xl md:text-7xl font-black mb-8 text-gray-900 dark:text-white leading-tight">
            The <span className="text-gradient">Knowledge</span> Base
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Exploring the nexus of engineering, design, and artificial intelligence. Our latest research and thoughts from the frontlines of technology.
          </p>
        </header>

        <div className="max-w-4xl mx-auto mb-20 space-y-6">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our articles..."
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full py-5 px-10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 dark:text-white font-medium"
          />
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-3 rounded-full text-sm font-bold border transition-all ${
                  activeCategory === category
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/20'
                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              onClick={() => openPost(post)}
              className="group cursor-pointer bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[40px] overflow-hidden hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
                  <span>{post.category}</span>
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  <span className="text-gray-400">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed mb-6">{post.excerpt}</p>
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
                  <img src={`https://i.pravatar.cc/100?u=${post.author.replace(/\s/g, '')}`} className="w-8 h-8 rounded-full" alt={post.author} />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription in Blog Hub */}
        <NewsletterSection source="Blog Knowledge Base Hub" className="mt-16" />
      </div>
    </div>
  );
};

export default BlogPage;
