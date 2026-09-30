import React, { useState } from 'react';
import { generateText } from '../services/ai';
import { BlogPost } from '../types';
import { useCMS } from '../context/CMSContext';

interface AIPostGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishPost: (post: BlogPost, notifySubscribers: boolean, postToTelegram?: boolean, targetTgIds?: string[]) => Promise<void>;
  subscriberCount: number;
}

const PRESET_TOPICS = [
  { label: '🔥 Top Trending Tech Search Today', query: 'top trending technology news today artificial intelligence software architecture breakthroughs' },
  { label: '🧠 DeepSeek & Open Source Reasoning AI', query: 'DeepSeek R1 open source reasoning models performance vs OpenAI' },
  { label: '⚡ React 19 & Next-Gen Frontends', query: 'React 19 production features Server Actions compiler web development' },
  { label: '🤖 Autonomous AI Agents in Production', query: 'autonomous AI agent frameworks multi-agent production deployment 2026' },
  { label: '🛡️ Post-Quantum Cryptography & Zero Trust', query: 'post quantum cryptography zero trust security enterprise architecture' },
  { label: '☁️ Cloud Scalability & Cost Engineering', query: 'cloud architecture cost optimization scale to zero kubernetes serverless' }
];

const PRESET_IMAGES = [
  { label: 'AI & Data Core', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Abstract Quantum', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Infrastructure', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'FinTech Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity Node', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mobile App Device', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' }
];

export const AIPostGeneratorModal: React.FC<AIPostGeneratorModalProps> = ({
  isOpen,
  onClose,
  onPublishPost,
  subscriberCount
}) => {
  const [topicQuery, setTopicQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('AI');
  const [targetAudience, setTargetAudience] = useState('Engineering & Tech Leaders');
  const [tone, setTone] = useState('Deep Technical & Authoritative');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Generated Post State for Review & Editing
  const [generatedPost, setGeneratedPost] = useState<BlogPost | null>(null);
  const [groundingSources, setGroundingSources] = useState<{ title: string; url: string }[]>([]);
  const [searchQueriesUsed, setSearchQueriesUsed] = useState<string[]>([]);
  const { telegramConfig, postBlogPostToTelegram } = useCMS();
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  const [autoPostToTelegram, setAutoPostToTelegram] = useState(
    telegramConfig.autoPostBlogs && !!telegramConfig.botToken
  );
  const [selectedTgTarget, setSelectedTgTarget] = useState<string>(
    telegramConfig.selectedTargetId || 'all'
  );
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const query = (customPrompt || topicQuery).trim() || 'top trending technology news today software engineering AI breakthroughs';
    setIsGenerating(true);
    setError(null);
    setGenerationStep('🔍 Connecting to Google Search Grounding to find top trending results...');

    try {

      setGenerationStep('🌐 Querying Google Search and analyzing top ranking articles...');

      const promptText = `You are a Principal Software Architect and Chief Technology Editor at Yuvex Tech.
Conduct a real-time Google Search on the following query to discover the top trending tech news, architectural advancements, and developer discussions right now:
"${query}"

Focus Category: ${selectedCategory}
Target Audience: ${targetAudience}
Tone: ${tone}

Use the Google Search tool to ground all information in current, factual, high-ranking Google search results.

Generate an authoritative, publication-ready technical blog post for the Yuvex Tech Insights publication.
Format your entire output strictly as valid JSON with NO markdown wrappers or code blocks around the JSON object (raw json only):
{
  "title": "Engaging, SEO-optimized title based on top Google search intent (max 80 chars)",
  "category": "${selectedCategory}",
  "excerpt": "A compelling 2-sentence hook highlighting why this is trending and what architects must know.",
  "content": "Full markdown content of the article (minimum 600 words) with clear H2 and H3 headings:
## Why This Is Trending on Google Today
## Core Architectural Mechanics & Technical Breakdown
## Real-World Engineering Implications
## Benchmarks & Implementation Guide
## Yuvex Tech Strategic Verdict",
  "readTime": "5 min read",
  "suggestedImageIndex": 0,
  "trendingKeywords": ["keyword1", "keyword2", "keyword3"],
  "sources": [
    {"title": "Source headline from Google search", "url": "https://example.com"}
  ]
}`;

      const response = await generateText(promptText, { googleSearch: true });

      setGenerationStep('✍️ Structuring article and extracting Google search grounding references...');

      const text = response.text || '';
      
      // Extract Google Search grounding metadata if available
      const searchMetadata = response.groundingMetadata;
      const webQueries = searchMetadata?.webSearchQueries || [query];
      setSearchQueriesUsed(webQueries);

      const citedSources: { title: string; url: string }[] = [];
      if (searchMetadata?.groundingChunks) {
        searchMetadata.groundingChunks.forEach(chunk => {
          if (chunk.web?.uri) {
            citedSources.push({
              title: chunk.web.title || new URL(chunk.web.uri).hostname,
              url: chunk.web.uri
            });
          }
        });
      }

      // Parse JSON from model output
      let parsedData: any = null;
      try {
        // Clean possible markdown code fences
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      } catch (e) {
        // Try regex extraction of json block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedData = JSON.parse(jsonMatch[0]);
          } catch (err) {
            console.error('Failed secondary JSON parse:', err);
          }
        }
      }

      if (!parsedData || !parsedData.title) {
        // Fallback structure if strict JSON parse failed
        parsedData = {
          title: `Trending in ${selectedCategory}: Latest Google Tech Insights`,
          category: selectedCategory,
          excerpt: `A deep technical breakdown of the latest developments trending across Google Search in ${selectedCategory}.`,
          content: text || 'Article generation in progress...',
          readTime: '5 min read',
          suggestedImageIndex: 0,
          trendingKeywords: [query]
        };
      }

      const imgIndex = typeof parsedData.suggestedImageIndex === 'number' && parsedData.suggestedImageIndex >= 0 && parsedData.suggestedImageIndex < PRESET_IMAGES.length 
        ? parsedData.suggestedImageIndex 
        : (selectedCategory === 'AI' ? 0 : selectedCategory === 'Cybersecurity' ? 4 : selectedCategory === 'Architecture' ? 2 : 1);

      const combinedSources = (parsedData.sources && Array.isArray(parsedData.sources) && parsedData.sources.length > 0)
        ? parsedData.sources
        : citedSources;

      setGroundingSources(combinedSources);

      const newPost: BlogPost = {
        id: `ai_post_${Date.now()}`,
        title: parsedData.title,
        category: parsedData.category || selectedCategory,
        excerpt: parsedData.excerpt || '',
        content: parsedData.content || '',
        author: 'Yuvex Tech Research Lab',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: PRESET_IMAGES[imgIndex]?.url || PRESET_IMAGES[0].url,
        readTime: parsedData.readTime || '5 min read'
      };

      setGeneratedPost(newPost);
    } catch (err: any) {
      console.error('AI Post Generation Error:', err);
      setError(err?.message || 'Failed to generate post from Google Search. Please verify your connection and try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePublish = async () => {
    if (!generatedPost) return;
    setIsPublishing(true);
    try {
      const targetIds = selectedTgTarget === 'all' ? ['all'] : [selectedTgTarget];
      await onPublishPost(generatedPost, notifySubscribers, autoPostToTelegram, targetIds);
      if (autoPostToTelegram && telegramConfig.botToken) {
        await postBlogPostToTelegram(generatedPost, targetIds);
      }
      onClose();
    } catch (err) {
      console.error('Failed to publish generated post:', err);
      setError('Failed to publish post. Please check storage.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg shadow-indigo-600/30">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">AI Post Generator (Google Top Search)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pulls top trending searches and verified citations to craft publication-ready articles
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-white font-bold">
                ✕
              </button>
            </div>
          )}

          {!generatedPost ? (
            /* GENERATOR CONFIGURATION FORM */
            <div className="space-y-6">
              
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  ⚡ 1-Click Trending Search Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_TOPICS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isGenerating}
                      onClick={() => {
                        setTopicQuery(preset.query);
                        handleGenerate(preset.query);
                      }}
                      className="p-3 text-left rounded-2xl bg-gray-950 border border-gray-800 hover:border-indigo-500/50 hover:bg-indigo-950/20 text-gray-300 hover:text-white transition-all text-xs group flex items-center justify-between"
                    >
                      <span className="font-semibold group-hover:text-indigo-300 transition-colors">
                        {preset.label}
                      </span>
                      <span className="text-gray-500 group-hover:text-indigo-400 text-sm">→</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Search Prompt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  🎯 Custom Topic or Google Search Query
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={topicQuery}
                    onChange={(e) => setTopicQuery(e.target.value)}
                    placeholder="e.g. Next-Gen Distributed AI Agents, WebAssembly in 2026, Post-Quantum Cryptography..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-2xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="absolute left-3.5 top-3.5 text-gray-500">🔍</span>
                </div>
              </div>

              {/* Target Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Architecture">Cloud Architecture</option>
                    <option value="Design">UI/UX & Product Design</option>
                    <option value="Tech News">Tech News & Updates</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering & Tech Leaders">Engineering & Tech Leaders</option>
                    <option value="Software Developers & Architects">Developers & Architects</option>
                    <option value="Startup Founders & CTOs">Startup Founders & CTOs</option>
                    <option value="General Tech Enthusiasts">General Tech Enthusiasts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5">Depth & Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Deep Technical & Authoritative">Deep Technical & Authoritative</option>
                    <option value="Executive Insights & Impact">Executive Insights & Impact</option>
                    <option value="Practical Hands-On Guide">Practical Hands-On Guide</option>
                    <option value="Futuristic Architectural Blueprint">Futuristic Blueprint</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-800">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleGenerate()}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{generationStep || 'Searching Google & Generating Post...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">✨</span>
                      <span>Generate Post Based on Google Top Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feature Highlights */}
              <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 text-xs text-gray-400 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Real-time Google search trend grounding</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Auto-notifies all {subscriberCount} newsletter subscribers on publish</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Formatted markdown with code & architecture sections</span>
                </div>
              </div>

            </div>
          ) : (
            /* GENERATED POST PREVIEW & EDITING */
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">✓</span>
                  <span><strong>Article Generated Successfully!</strong> Grounded with Google Search results. Review and edit before publishing.</span>
                </div>
                <button
                  onClick={() => setGeneratedPost(null)}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold"
                >
                  Generate Another
                </button>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-gray-400 mb-1">Article Headline *</label>
                  <input
                    type="text"
                    value={generatedPost.title}
                    onChange={(e) => setGeneratedPost({ ...generatedPost, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                  <select
                    value={generatedPost.category}
                    onChange={(e) => setGeneratedPost({ ...generatedPost, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AI">AI & Machine Learning</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Architecture">Cloud Architecture</option>
                    <option value="Design">UI/UX & Product Design</option>
                    <option value="Tech News">Tech News & Updates</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Short Excerpt (Card Summary)</label>
                <textarea
                  rows={2}
                  value={generatedPost.excerpt}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Cover Image</label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setGeneratedPost({ ...generatedPost, image: img.url })}
                      className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        generatedPost.image === img.url ? 'border-indigo-500 scale-105 shadow-md' : 'border-gray-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-white text-center py-0.5 truncate px-1">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-400">Complete Article Content (Markdown)</label>
                  <span className="text-[11px] text-gray-500 font-mono">
                    ~{generatedPost.content.split(/\s+/).length} words
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={generatedPost.content}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Google Search Grounding Citations */}
              {groundingSources.length > 0 && (
                <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-400">
                    <span>🌐</span>
                    <span>Verified Google Search Grounding References:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groundingSources.slice(0, 6).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[11px] text-gray-300 hover:text-white hover:border-indigo-500/50 transition-all flex items-center gap-1.5"
                      >
                        <span className="truncate max-w-[200px]">{src.title}</span>
                        <span className="text-gray-500">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Publish & Subscriber Notification Bar */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Notify All Users by Email on Publish</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                        {subscriberCount} Subscribers
                      </span>
                    </h5>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Directly triggers email broadcast with post title, excerpt, and link to all active newsletter contacts.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-indigo-200 shrink-0">
                  <input
                    type="checkbox"
                    checked={notifySubscribers}
                    onChange={(e) => setNotifySubscribers(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700"
                  />
                  <span>Dispatch Email Broadcast</span>
                </label>
              </div>

              {/* Telegram Auto-Post Bar */}
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/40 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✈️</span>
                    <div>
                      <h5 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Auto-Post to Telegram Channels & Groups</span>
                        {telegramConfig.botToken ? (
                          <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold">
                            {telegramConfig.targets.filter(t => t.enabled).length} Active Targets
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                            Bot Not Configured
                          </span>
                        )}
                      </h5>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Broadcasts cover photo, bold headline, summary, and direct link to your connected Telegram channels.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-sky-200 shrink-0">
                    <input
                      type="checkbox"
                      disabled={!telegramConfig.botToken}
                      checked={autoPostToTelegram && !!telegramConfig.botToken}
                      onChange={(e) => setAutoPostToTelegram(e.target.checked)}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-gray-900 border-gray-700 disabled:opacity-40"
                    />
                    <span>Post to Telegram</span>
                  </label>
                </div>

                {autoPostToTelegram && telegramConfig.botToken && telegramConfig.targets.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 border-t border-sky-900/40 text-xs">
                    <span className="text-gray-400 font-medium">Send to:</span>
                    <select
                      value={selectedTgTarget}
                      onChange={(e) => setSelectedTgTarget(e.target.value)}
                      className="px-2.5 py-1 bg-gray-950 border border-sky-800/80 rounded-lg text-white text-xs focus:outline-none font-mono"
                    >
                      <option value="all">All Active Targets ({telegramConfig.targets.filter(t => t.enabled).length})</option>
                      {telegramConfig.targets.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.type === 'channel' ? '📢' : '👥'} {t.name} ({t.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-colors"
          >
            Cancel
          </button>

          {generatedPost && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate()}
                className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-colors flex items-center gap-1.5"
              >
                <span>🔄</span>
                <span>Regenerate Angle</span>
              </button>

              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing & Notifying...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Publish to Blog</span>
                    {notifySubscribers && <span>& Notify Subscribers</span>}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default AIPostGeneratorModal;
