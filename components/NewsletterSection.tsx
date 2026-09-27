import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';

interface NewsletterSectionProps {
  source?: string;
  className?: string;
  compact?: boolean;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  source = 'Newsletter Subscription Section',
  className = '',
  compact = false
}) => {
  const { addSubscriber } = useCMS();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    subscribedEmail?: string;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid email address (e.g., name@company.com).'
      });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await addSubscriber(email, source, name);
      if (result.success) {
        setFeedback({
          type: 'success',
          message: result.message,
          subscribedEmail: email
        });
        setEmail('');
        setName('');
      } else {
        setFeedback({
          type: 'error',
          message: result.message
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: 'Failed to subscribe. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className={`p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 ${className}`}>
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
          <span className="animate-pulse">🔔</span> Newsletter & Blog Alerts
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
          Get notified when new articles drop
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Saved directly to our CMS contact directory. Never miss a release.
        </p>

        {feedback?.type === 'success' ? (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-300 text-xs">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <span>✓</span> Subscribed!
            </p>
            <p className="text-[11px] opacity-90">
              {feedback.subscribedEmail} is registered for automatic email notifications.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address..."
              required
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe to Alerts</span>
                  <span>→</span>
                </>
              )}
            </button>
            {feedback?.type === 'error' && (
              <p className="text-red-500 text-[11px] font-medium mt-1">{feedback.message}</p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <section className={`relative overflow-hidden py-14 my-8 rounded-[40px] bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white shadow-2xl ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>Real-Time Blog Dispatch</span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Subscribe to Our Newsletter & Tech Updates
        </h3>
        <p className="text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Stay informed on cutting-edge engineering, AI architectures, and product design. Whenever we publish a new post, all subscribed users are automatically notified by email.
        </p>

        {feedback?.type === 'success' ? (
          <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center animate-in zoom-in duration-300">
            <div className="w-14 h-14 bg-green-400/20 text-green-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-xl font-bold text-white mb-2">You're on the subscriber list!</h4>
            <p className="text-sm text-blue-100 mb-3 font-mono bg-black/20 py-1.5 px-4 rounded-xl inline-block">
              {feedback.subscribedEmail}
            </p>
            <p className="text-xs text-blue-100/80 leading-relaxed mb-4">
              Your email is safely stored in our CMS Contact Management directory. As soon as any new post is published, you'll receive a direct email notification.
            </p>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs text-blue-200 hover:text-white underline font-semibold transition-colors"
            >
              Subscribe another email address
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                className="sm:w-1/3 px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder-blue-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white/10 text-white placeholder-blue-200/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-blue-50 active:scale-95 text-blue-700 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <span className="text-base">🚀</span>
                  </>
                )}
              </button>
            </div>

            {feedback?.type === 'error' && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-white text-xs font-semibold">
                ⚠️ {feedback.message}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/70">
              <span className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> Instant new post alerts
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> Stored in CMS contacts
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-400">✓</span> Zero spam guarantee
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
export default NewsletterSection;
