
import React, { useEffect } from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950/20 transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white mb-12 transition-all group font-bold"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>

        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">Privacy <span className="text-gradient">Policy</span></h1>
          <p className="text-gray-500 dark:text-gray-400">Last Updated: October 20, 2024</p>
        </header>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-12 text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
            <p>
              At Yuvex Tech, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our application development services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase text-xs tracking-widest">Personal Data</h3>
                <p className="text-sm">Includes your name, email address, and professional details provided through our contact forms or project inquiries.</p>
              </div>
              <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
                <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-3 uppercase text-xs tracking-widest">Usage Data</h3>
                <p className="text-sm">Information on how you interact with our site, including IP addresses, browser types, and navigation patterns.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. How We Use Your Data</h2>
            <p>We use the collected information for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our services.</li>
              <li>To notify you about changes to our project timelines or policies.</li>
              <li>To provide customer support and gather feedback.</li>
              <li>To monitor the usage of our platform for technical improvements.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Data Security</h2>
            <p>
              The security of your data is important to us. We implement industry-standard encryption and security measures to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Contact Us</h2>
            <div className="bg-blue-600/5 dark:bg-blue-600/10 border border-blue-500/10 p-8 rounded-[40px] mt-4">
              <p className="font-bold text-gray-900 dark:text-white">Yuvex Tech Legal Dept.</p>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">privacy@yuvex.tech</p>
              <p className="text-sm text-gray-500 mt-2">Mission District, San Francisco, CA</p>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-white/5 text-center">
          <button 
            onClick={onBack}
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
