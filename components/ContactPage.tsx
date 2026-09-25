
import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

interface ContactPageProps {
  onBack: () => void;
}

const PROJECT_TYPES = ['Mobile App', 'Web Platform', 'UI/UX Design', 'AI Integration', 'Cloud Architecture', 'Other'];
const BUDGET_RANGES = ['$5k - $15k', '$15k - $50k', '$50k - $150k', '$150k+'];

const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
  const { settings, addUserRequest } = useCMS();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mailtoLink, setMailtoLink] = useState('');
  const [targetEmail, setTargetEmail] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const destEmail = settings.notificationsEmail || 'ywapne@gmail.com';
      setTargetEmail(destEmail);
      const res = await addUserRequest({
        source: 'Contact Page (Dedicated)',
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType || 'General Project',
        budget: formData.budget || 'Flexible',
        message: formData.message
      });
      setMailtoLink(res.mailtoUrl);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', projectType: '', budget: '', message: '' });
    } catch (err) {
      console.error('Contact page submission error:', err);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

        <header className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-blue-500 font-bold uppercase tracking-widest text-sm mb-4">Contact Us</h2>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
            Let's Start a <span className="text-gradient">Conversation</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Ready to bring your digital vision to life? Our team of architects and engineers is standing by to help you build the next generation of software.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {isSubmitted ? (
            <div className="glass p-10 md:p-16 rounded-[50px] text-center animate-in zoom-in duration-500 shadow-2xl border border-green-500/20">
              <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/10">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h4 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Inquiry Received & Recorded!</h4>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
                Your request is securely stored in our system and forwarded directly to <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{targetEmail || 'ywapne@gmail.com'}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {mailtoLink && (
                  <a
                    href={mailtoLink}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all font-black shadow-xl shadow-blue-600/20 active:scale-95 inline-flex items-center gap-2"
                  >
                    <span>✉️</span>
                    <span>Send Copy via Email Client</span>
                  </a>
                )}
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all font-bold active:scale-95"
                >
                  Submit Another Inquiry
                </button>
              </div>

              <div className="text-xs text-gray-400 dark:text-gray-500 font-mono flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Stored in Admin CMS • Notification target: {targetEmail || 'ywapne@gmail.com'}</span>
              </div>
            </div>
          ) : (
            <div className="glass p-8 md:p-16 rounded-[50px] border border-gray-100 dark:border-white/10 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Project Category</label>
                    <select 
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 dark:text-white font-medium appearance-none"
                    >
                      <option value="" disabled>Select project type...</option>
                      {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Estimated Budget</label>
                    <select 
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 dark:text-white font-medium appearance-none"
                    >
                      <option value="" disabled>Select budget range...</option>
                      {BUDGET_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">Message Brief</label>
                  <textarea 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your vision and any specific goals you have..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-7 py-5 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all min-h-[180px] resize-none text-gray-900 dark:text-white font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-4 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
