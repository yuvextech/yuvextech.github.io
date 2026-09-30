import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';

export const AdminCommentsHub: React.FC = () => {
  const { comments, blogPosts, deleteComment, addComment } = useCMS();
  const [selectedPostFilter, setSelectedPostFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newPostId, setNewPostId] = useState(blogPosts[0]?.id || '');
  const [newText, setNewText] = useState('');

  const filteredComments = comments.filter((c) => {
    if (selectedPostFilter !== 'all' && c.postId !== selectedPostFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAuthor = c.author?.toLowerCase().includes(q);
      const matchText = c.text?.toLowerCase().includes(q);
      return matchAuthor || matchText;
    }
    return true;
  });

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !newPostId) return;
    await addComment({
      postId: newPostId,
      author: newAuthor.trim() || 'Verified Architect',
      text: newText.trim(),
      avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(newAuthor || 'architect')}`
    });
    setNewText('');
    setNewAuthor('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-sm">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-blue-400">
            Database Entity: comments
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Comments &amp; Discussion Moderation</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
              {comments.length} Total
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Real-time comments posted by readers on tech news and knowledge base articles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0"
        >
          <span>💬</span>
          <span>Add Test Comment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400">Filter by Article:</label>
          <select
            value={selectedPostFilter}
            onChange={(e) => setSelectedPostFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 font-medium max-w-xs truncate"
          >
            <option value="all">All Articles ({comments.length})</option>
            {blogPosts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search author, text..."
            className="px-4 py-1.5 pl-9 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 w-full sm:w-64"
          />
          <span className="absolute left-3 top-2 text-gray-500 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1.5 text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="p-16 rounded-3xl bg-gray-900 border border-gray-800 text-center text-gray-500 text-sm">
          No comments found in cloud database for this view.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => {
            const post = blogPosts.find((b) => b.id === comment.postId);
            return (
              <div
                key={comment.id}
                className="p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4 group hover:border-gray-700 transition-all"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={comment.avatar || `https://i.pravatar.cc/100?u=${comment.author}`}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full border border-gray-800 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{comment.author}</span>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-400 font-mono text-xs">{comment.date}</span>
                      {post && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 max-w-xs truncate">
                          {post.title}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed mt-1">
                      {comment.text}
                    </p>
                    <div className="text-[10px] font-mono text-gray-500 mt-2">
                      Doc ID: {comment.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      if (confirm(`Delete comment from ${comment.author}?`)) {
                        deleteComment(comment.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Comment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-gray-950 border border-gray-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h4 className="text-sm font-bold text-white">Add Comment to Cloud Database</h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateComment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Target Blog Article</label>
                <select
                  value={newPostId}
                  onChange={(e) => setNewPostId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {blogPosts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Comment Text *</label>
                <textarea
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Insightful perspective on the distributed architecture..."
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCommentsHub;
