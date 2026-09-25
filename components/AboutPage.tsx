
import React, { useEffect } from 'react';

interface AboutPageProps {
  onBack: () => void;
  onContact: () => void;
}

const VALUES = [
  {
    title: 'Engineering Excellence',
    description: 'We don’t just write code; we architect solutions. Performance, scalability, and security are at the core of every line we write.',
    icon: '⚡'
  },
  {
    title: 'Human-Centric Design',
    description: 'Technology should serve people, not the other way around. We prioritize empathy and accessibility in every user interface.',
    icon: '👤'
  },
  {
    title: 'Radical Transparency',
    description: 'We believe in honest communication. Our clients are partners, and we provide clear insights into every stage of development.',
    icon: '💎'
  }
];

const TEAM = [
  {
    name: 'Julian Vance',
    role: 'Founder & Head of Engineering',
    image: 'https://i.pravatar.cc/300?u=julian',
    bio: 'Ex-FAANG architect with a passion for high-performance distributed systems.'
  },
  {
    name: 'Elena Kostic',
    role: 'Director of Design',
    image: 'https://i.pravatar.cc/300?u=elena_design',
    bio: 'Award-winning UI/UX specialist focused on emotional resonance in digital products.'
  },
  {
    name: 'Marcus Thorne',
    role: 'Lead AI Architect',
    image: 'https://i.pravatar.cc/300?u=marcus_ai',
    bio: 'Pioneer in LLM integration and intelligent workflow automation.'
  }
];

const AboutPage: React.FC<AboutPageProps> = ({ onBack, onContact }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

        <header className="mb-24 text-center max-w-4xl mx-auto">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Our Story</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            We build the <span className="text-gradient">digital foundations</span> of tomorrow.
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Yuvex Tech was founded on a simple principle: high-end engineering shouldn't sacrifice human connection. We partner with visionaries to build products that resonate.
          </p>
        </header>

        {/* Mission Section */}
        <section className="mb-32 relative">
          <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] rounded-[100px] pointer-events-none"></div>
          <div className="glass p-12 md:p-20 rounded-[50px] border border-gray-100 dark:border-white/10 relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
                To empower startups and global enterprises by delivering software that isn't just functional, but transformative. We bridge the gap between complex backend architecture and delightful frontend experiences.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">50+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Products Shipped</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">10M+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">End Users Reached</div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" alt="Team collaborating" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">Our Values</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, idx) => (
              <div key={idx} className="p-10 rounded-[40px] bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all group">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">{value.icon}</div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white">The Architects</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {TEAM.map((member, idx) => (
              <div key={idx} className="group">
                <div className="relative overflow-hidden rounded-[40px] aspect-[4/5] mb-6 border border-gray-100 dark:border-white/10 shadow-lg">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                    <p className="text-white text-sm italic">"{member.bio}"</p>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h4>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-32 p-12 md:p-20 bg-gray-950 dark:bg-white/[0.02] border border-white/5 rounded-[50px] text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10 text-white">Let’s build something together.</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Whether you're a startup looking for an MVP or an enterprise scaling to millions, we have the expertise to make it happen.
          </p>
          <button 
            onClick={onContact}
            className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 relative z-10"
          >
            Start a Conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
