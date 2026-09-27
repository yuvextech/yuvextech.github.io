import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { TestimonialItem } from '../types';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (review: TestimonialItem) => void;
}

const PRESET_AVATARS = [
  { label: 'Executive 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { label: 'Founder 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { label: 'Tech Lead 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
  { label: 'Architect 1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  { label: 'VP Product', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
  { label: 'CTO 1', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
];

const INDUSTRY_TAGS = [
  'Enterprise AI',
  'Fintech',
  'Healthcare',
  'E-Commerce',
  'Cloud Architecture',
  'Web Development',
  'Mobile App',
  'Logistics',
  'Cybersecurity',
  'SaaS Platform'
];

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: 'Exceptional (5/5) — Exceeded all technical & velocity benchmarks',
  4: 'Very Satisfied (4/5) — High quality engineering and smooth rollout',
  3: 'Satisfied (3/5) — Delivered core project milestones reliably',
  2: 'Fair (2/5) — Acceptable with areas for improvement',
  1: 'Needs Improvement (1/5) — Did not meet expectations'
};

const SubmitReviewModal: React.FC<SubmitReviewModalProps> = ({ isOpen, onClose, onReviewSubmitted }) => {
  const { submitClientReview } = useCMS();

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [tag, setTag] = useState('Enterprise AI');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [avatarMode, setAvatarMode] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReview, setSubmittedReview] = useState<TestimonialItem | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      setErrorMessage('Image size should be under 2.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!author.trim() || !role.trim() || !company.trim() || !quote.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (quote.trim().length < 20) {
      setErrorMessage('Please write at least 20 characters for your testimonial.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalAvatar = avatarMode === 'url' && customAvatarUrl.trim()
        ? customAvatarUrl.trim()
        : avatar;

      const result = await submitClientReview({
        author: author.trim(),
        role: role.trim(),
        company: company.trim(),
        quote: quote.trim(),
        rating,
        tag,
        avatar: finalAvatar,
        email: email.trim() || undefined
      });

      if (result.success && result.testimonial) {
        setSubmittedReview(result.testimonial);
        if (onReviewSubmitted) {
          onReviewSubmitted(result.testimonial);
        }
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      setErrorMessage('An unexpected error occurred while saving your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedReview(null);
    setAuthor('');
    setRole('');
    setCompany('');
    setEmail('');
    setQuote('');
    setRating(5);
    setTag('Enterprise AI');
    setAvatar(PRESET_AVATARS[0].url);
    setErrorMessage('');
    onClose();
  };

  const effectiveRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl my-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-gray-950/60 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg shadow-inner">
              ⭐
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {submittedReview ? 'Review Submitted Successfully!' : 'Share Your Client Review'}
              </h2>
              <p className="text-xs text-gray-400">
                {submittedReview 
                  ? 'Your testimonial is stored into the Yuvex Tech System CMS and published.'
                  : 'Your experience inspires future partners and guides engineering excellence.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-all"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {submittedReview ? (
            /* Celebration & Success View */
            <div className="space-y-6 text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-3xl shadow-xl shadow-emerald-500/20 animate-bounce">
                ✓
              </div>

              <div className="max-w-md mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Stored in System CMS
                </span>
                <h3 className="text-2xl font-black text-white mb-2">Thank you, {submittedReview.author}!</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Your review has been successfully stored to the Yuvex Tech CMS and added to our client success portfolio.
                </p>
              </div>

              {/* Published Card Preview */}
              <div className="max-w-lg mx-auto text-left p-6 md:p-8 rounded-3xl bg-gray-950 border border-blue-500/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(submittedReview.rating || 5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base">★</span>
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                    {submittedReview.tag}
                  </span>
                </div>

                <blockquote className="text-sm md:text-base text-gray-200 italic mb-6 leading-relaxed">
                  "{submittedReview.quote}"
                </blockquote>

                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-800">
                  <img
                    src={submittedReview.avatar}
                    alt={submittedReview.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30 shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {submittedReview.author}
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono font-medium">
                        Verified
                      </span>
                    </h4>
                    <p className="text-xs text-blue-400 font-medium">
                      {submittedReview.role} @ {submittedReview.company}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Done & View on Site
                </button>
              </div>
            </div>
          ) : (
            /* Review Submission Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Star Rating Section */}
              <div className="p-5 rounded-2xl bg-gray-950/70 border border-gray-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Overall Rating *
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-3xl transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                      >
                        <span className={star <= effectiveRating ? 'text-yellow-400' : 'text-gray-700'}>
                          ★
                        </span>
                      </button>
                    ))}
                    <span className="ml-2 font-mono text-sm font-bold text-yellow-400">
                      {effectiveRating}.0 / 5.0
                    </span>
                  </div>

                  <span className="text-xs text-gray-400 font-medium italic">
                    {RATING_DESCRIPTIONS[effectiveRating]}
                  </span>
                </div>
              </div>

              {/* Author & Role & Company Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Job Title / Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. VP of Product, Founder, CTO"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Omnilogistics, FinStream, Genesis"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Project Domain / Industry Tag
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {INDUSTRY_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    Work Email <span className="text-gray-500 font-normal">(Optional — for verified partner badge)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@company.com"
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Review Quote Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-300">
                    Your Review & Testimonial *
                  </label>
                  <span className={`text-[11px] font-mono ${quote.length < 20 ? 'text-amber-400' : 'text-gray-400'}`}>
                    {quote.length}/600 chars {quote.length < 20 && '(min 20)'}
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="How did Yuvex Tech elevate your digital ecosystem? Mention the technical depth, velocity, architecture, UI quality, or business outcomes achieved..."
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                />
              </div>

              {/* Avatar Selector */}
              <div className="p-5 rounded-2xl bg-gray-950/70 border border-gray-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                    Profile Avatar / Photo
                  </label>
                  <div className="flex gap-1.5 p-1 bg-gray-900 border border-gray-800 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setAvatarMode('preset')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        avatarMode === 'preset' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Presets
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('upload')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        avatarMode === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setAvatarMode('url')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        avatarMode === 'url' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <img
                      src={avatarMode === 'url' && customAvatarUrl ? customAvatarUrl : avatar}
                      alt="Selected avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PRESET_AVATARS[0].url;
                      }}
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      ✓
                    </span>
                  </div>

                  <div className="flex-1">
                    {avatarMode === 'preset' && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {PRESET_AVATARS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(p.url)}
                            className={`relative rounded-full transition-all shrink-0 p-0.5 ${
                              avatar === p.url ? 'ring-2 ring-blue-500 scale-105' : 'opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={p.url}
                              alt={p.label}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {avatarMode === 'upload' && (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">Supports PNG, JPG, WebP under 2.5MB.</p>
                      </div>
                    )}

                    {avatarMode === 'url' && (
                      <input
                        type="url"
                        value={customAvatarUrl}
                        onChange={(e) => setCustomAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Live Preview on Website
                </label>
                <div className="p-6 rounded-2xl bg-gray-950/80 border border-gray-800/80 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                      {tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 italic mb-4 leading-relaxed">
                    "{quote.trim() || 'Your testimonial quote will appear here in real time...'}"
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-800/60">
                    <img
                      src={avatarMode === 'url' && customAvatarUrl ? customAvatarUrl : avatar}
                      alt="Preview"
                      className="w-9 h-9 rounded-full object-cover border border-gray-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        {author.trim() || 'Your Name'}
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded font-mono">
                          Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-blue-400">
                        {(role.trim() || 'Your Role') + ' @ ' + (company.trim() || 'Your Company')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Saving to CMS...
                    </>
                  ) : (
                    <>
                      <span>⭐</span>
                      Submit Review to CMS
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitReviewModal;
