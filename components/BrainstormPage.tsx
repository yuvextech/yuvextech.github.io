
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface BrainstormPageProps {
  onBack: () => void;
  onContact: () => void;
}

interface BrainstormSession {
  id: string;
  idea: string;
  recommendation: string;
  date: string;
}

const SUGGESTED_IDEAS = [
  "A decentralized ride-sharing app for electric scooters.",
  "An AI-powered recipe generator that uses only what's in your fridge.",
  "A SaaS platform for managing hyper-local community gardens.",
  "A VR interior design tool with real-time shopping integration."
];

const BrainstormPage: React.FC<BrainstormPageProps> = ({ onBack, onContact }) => {
  const [idea, setIdea] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<BrainstormSession[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('yuvex_brainstorm_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (newIdea: string, rec: string) => {
    const session: BrainstormSession = {
      id: Date.now().toString(),
      idea: newIdea,
      recommendation: rec,
      date: new Date().toLocaleDateString()
    };
    const updated = [session, ...history].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('yuvex_brainstorm_history', JSON.stringify(updated));
  };

  const generateStack = async (targetIdea?: string) => {
    const activeIdea = targetIdea || idea;
    if (!activeIdea.trim()) return;
    
    setLoading(true);
    setSuggestion(null);
    if (!targetIdea) setIdea('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a Senior Technical Architect at Yuvex Tech. 
        A client has a project idea: "${activeIdea}". 
        
        Provide a professional "Technical Blueprint" that includes:
        1. A catchy project name.
        2. Core Tech Stack (Frontend, Backend, Database).
        3. Strategic AI Integration (using Gemini).
        4. One "Killer Feature" that would make this project stand out.
        
        Keep it concise, professional, and exciting. Use Markdown formatting.`,
        config: {
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      });

      const text = response.text || 'Sorry, I could not generate a suggestion right now.';
      setSuggestion(text);
      saveToHistory(activeIdea, text);
    } catch (error) {
      console.error(error);
      setSuggestion('Error generating technical blueprint. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Interface */}
          <div className="lg:col-span-8">
            <header className="mb-12">
              <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">AI Brainstorming</h2>
              <h1 className="text-5xl md:text-6xl font-black mb-8 text-gray-900 dark:text-white leading-tight">
                From Idea to <span className="text-gradient">Architecture</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-2xl font-medium">
                Describe your vision, and our AI architect will build a professional technical blueprint for your next project.
              </p>
            </header>

            <div className="space-y-8">
              <div className="glass p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🏗️</div>
                <textarea 
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your big idea... (e.g., A mobile app for coordinating neighborhood carpools with real-time carbon tracking)"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all min-h-[150px] resize-none text-gray-900 dark:text-white font-medium"
                />
                <button 
                  onClick={() => generateStack()}
                  disabled={loading || !idea.trim()}
                  className="mt-6 w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Consulting Gemini...
                    </>
                  ) : (
                    <>
                      Generate Technical Blueprint
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </>
                  )}
                </button>
              </div>

              {suggestion && (
                <div className="glass p-8 md:p-12 rounded-[40px] border border-blue-500/20 animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-blue-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest">Architect Recommendation</h3>
                    <button 
                      onClick={onContact}
                      className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                      Hire Yuvex to Build This
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </button>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                    <div className="whitespace-pre-wrap font-sans leading-relaxed text-base md:text-lg">
                      {suggestion}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar / Insights */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border border-gray-100 dark:border-white/5">
              <h4 className="text-gray-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                <span className="text-xl">💡</span> Need Inspiration?
              </h4>
              <div className="space-y-4">
                {SUGGESTED_IDEAS.map((suggested, idx) => (
                  <button 
                    key={idx}
                    onClick={() => generateStack(suggested)}
                    disabled={loading}
                    className="w-full p-5 bg-white dark:bg-white/5 rounded-2xl text-left text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 border border-transparent transition-all shadow-sm"
                  >
                    "{suggested}"
                  </button>
                ))}
              </div>
            </div>

            {history.length > 0 && (
              <div className="p-8 bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border border-gray-100 dark:border-white/5">
                <h4 className="text-gray-900 dark:text-white font-bold mb-6 flex items-center gap-2">
                  <span className="text-xl">📜</span> Recent Ideas
                </h4>
                <div className="space-y-4">
                  {history.map((item) => (
                    <div 
                      key={item.id}
                      className="p-5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm"
                    >
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{item.idea}</p>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        <span>{item.date}</span>
                        <button 
                          onClick={() => setSuggestion(item.recommendation)}
                          className="text-blue-600 hover:underline"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-8 bg-blue-600 rounded-[40px] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">🚀</div>
              <h4 className="text-xl font-black mb-4">Go from blueprint to production.</h4>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Our AI gives you the map, but we give you the vehicle. Start a formal discussion to turn this blueprint into a real product.
              </p>
              <button 
                onClick={onContact}
                className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                Project Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainstormPage;
