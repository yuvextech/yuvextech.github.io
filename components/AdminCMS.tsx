import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Project, BlogPost, Service, TestimonialItem, UserRequest } from '../types';

interface AdminCMSProps {
  onBackToSite?: () => void;
  onBack?: () => void;
  onPreviewLive?: () => void;
  onNavigateToProject?: (id: string) => void;
  onNavigateToBlog?: (id: string) => void;
}

type CMSTab = 'overview' | 'inquiries' | 'projects' | 'blogs' | 'website' | 'services' | 'testimonials' | 'settings';

const PRESET_IMAGES = [
  { label: 'FinTech Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'AI & Data Core', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cloud Infrastructure', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mobile App Device', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'E-Commerce Platform', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cybersecurity Node', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Abstract Quantum', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80' },
];

const AdminCMS: React.FC<AdminCMSProps> = ({
  onBackToSite,
  onBack,
  onPreviewLive,
  onNavigateToProject,
  onNavigateToBlog
}) => {
  const handleExitCMS = () => {
    if (onBackToSite) onBackToSite();
    else if (onBack) onBack();
    else if (onPreviewLive) onPreviewLive();
    else window.location.hash = '';
  };
  const {
    projects,
    blogPosts,
    services,
    testimonials,
    settings,
    userRequests,
    isAdmin,
    addProject,
    updateProject,
    deleteProject,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    addService,
    updateService,
    deleteService,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addUserRequest,
    updateUserRequestStatus,
    deleteUserRequest,
    clearAllUserRequests,
    updateSettings,
    loginAdmin,
    logoutAdmin,
    changePassword,
    exportAllData,
    importAllData,
    resetToDefaults
  } = useCMS();

  // Authentication form state
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<CMSTab>('overview');

  // Client Inquiries / User Requests State
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [inquirySourceFilter, setInquirySourceFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<UserRequest | null>(null);
  const [testInquiryNotice, setTestInquiryNotice] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');

  // Blog / Tech News Editor State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isNewBlog, setIsNewBlog] = useState(false);
  const [blogSearch, setBlogSearch] = useState('');

  // Service Editor State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Testimonial Editor State
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [isNewTestimonial, setIsNewTestimonial] = useState(false);

  // Website Settings Form State
  const [tempSettings, setTempSettings] = useState(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Password Change State
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState(false);

  // Import JSON Modal State
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode.trim())) {
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('Invalid administrator passcode. Please verify your credentials and try again.');
    }
  };

  // Sync temp settings when global settings change
  React.useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  // If not logged in, render authentication portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-28 pb-20 bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-3xl mx-auto mb-4 font-bold shadow-lg shadow-blue-500/10">
              ⚡
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Yuvex Tech CMS</h2>
            <p className="text-xs text-gray-400 mt-1">
              Administrative Control Panel for Projects, Tech News, & Site Content
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>yuvextech@gmail.com</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Administrator Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Enter administrator passcode"
                  className="w-full pl-4 pr-11 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-sm font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm px-1.5 py-1 rounded transition-colors"
                  title={showPassword ? 'Hide passcode' : 'Show passcode'}
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5">
                <span>🔒</span>
                <span>Protected area. Authenticate with your administrator password.</span>
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all rounded-xl font-bold text-sm text-white shadow-lg shadow-blue-600/20"
            >
              Authenticate & Open CMS
            </button>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-between text-xs">
              <span className="text-[11px] text-gray-400">
                Key: <code className="text-blue-300 font-mono">u(Lj(!R2L,?2!wa</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasscode('u(Lj(!R2L,?2!wa');
                  loginAdmin('u(Lj(!R2L,?2!wa');
                }}
                className="px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/30 rounded-lg text-[11px] font-bold transition-all"
              >
                ⚡ 1-Click Unlock
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800 text-xs">
              <button
                type="button"
                onClick={handleExitCMS}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Return to Live Website
              </button>
              <span className="text-[11px] text-gray-600 font-mono">
                Admin Security v1.2
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Handle saving modified project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (isNewProject) {
      const id = editingProject.id || `p_${Date.now()}`;
      addProject({ ...editingProject, id });
    } else {
      updateProject(editingProject.id, editingProject);
    }
    setEditingProject(null);
    setIsNewProject(false);
  };

  // Handle saving modified blog post
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    if (isNewBlog) {
      const id = editingBlog.id || `b_${Date.now()}`;
      addBlogPost({ ...editingBlog, id });
    } else {
      updateBlogPost(editingBlog.id, editingBlog);
    }
    setEditingBlog(null);
    setIsNewBlog(false);
  };

  // Handle saving modified service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (isNewService) {
      const id = editingService.id || `s_${Date.now()}`;
      addService({ ...editingService, id });
    } else {
      updateService(editingService.id, editingService);
    }
    setEditingService(null);
    setIsNewService(false);
  };

  // Handle saving testimonial
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    if (isNewTestimonial) {
      const id = editingTestimonial.id || Date.now();
      addTestimonial({ ...editingTestimonial, id });
    } else {
      updateTestimonial(editingTestimonial.id, editingTestimonial);
    }
    setEditingTestimonial(null);
    setIsNewTestimonial(false);
  };

  // Handle saving site settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // Handle downloading data
  const handleDownloadBackup = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuvex-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle importing data
  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const success = importAllData(importJsonText);
    if (success) {
      setImportStatus('success');
      setTimeout(() => {
        setImportStatus('idle');
        setImportJsonText('');
      }, 2000);
    } else {
      setImportStatus('error');
    }
  };

  // Inquiries Actions & Helpers
  const targetNotificationEmail = settings.notificationsEmail || 'ywapne@gmail.com';
  const unreadInquiriesCount = userRequests.filter(r => r.status === 'unread').length;

  const handleSendEmailCopy = (req: UserRequest) => {
    const subject = encodeURIComponent(`[Yuvex Tech Inquiry] ${req.name} (${req.source})`);
    const body = encodeURIComponent(
`User Request from Yuvex Tech Website:
------------------------------------------
Inquiry ID: ${req.id}
Source Form: ${req.source}
Date: ${new Date(req.createdAt).toLocaleString()}
Client Name: ${req.name}
Client Email: ${req.email}
Phone: ${req.phone || 'N/A'}
Project Category: ${req.projectType}
Budget Range: ${req.budget}
Timeline: ${req.timeline}

Client Message:
${req.message}
------------------------------------------
Notification Destination: ${targetNotificationEmail}`
    );
    window.open(`mailto:${targetNotificationEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleReplyToClient = (req: UserRequest) => {
    const subject = encodeURIComponent(`Re: Your Inquiry with Yuvex Tech (${req.projectType || 'Project'})`);
    const body = encodeURIComponent(
`Hi ${req.name},

Thank you for reaching out to Yuvex Tech regarding your project (${req.projectType || 'Custom Solution'}). Our engineering team has reviewed your inquiry.

Your Project Details:
- Category: ${req.projectType}
- Budget: ${req.budget}
- Message: "${req.message}"

We would love to schedule a brief discovery call to discuss architectural requirements and timelines.

Best regards,
Engineering Team | Yuvex Tech
`
    );
    window.open(`mailto:${req.email}?subject=${subject}&body=${body}`, '_blank');
    updateUserRequestStatus(req.id, 'replied');
  };

  const handleSendTestInquiry = async () => {
    await addUserRequest({
      source: 'Test from Admin CPanel',
      name: 'Alex Rivera',
      email: 'alex.rivera@hyperdrive.dev',
      phone: '+1 (415) 800-9123',
      projectType: 'Mobile & Autonomous AI App',
      budget: '$50k - $150k',
      timeline: '2 - 3 Months',
      message: 'Testing user request routing, storage, and automated notification to ywapne@gmail.com. Verification inquiry generated from Admin Control Panel.'
    });
    setTestInquiryNotice(true);
    setTimeout(() => setTestInquiryNotice(false), 4000);
  };

  const handleExportInquiries = () => {
    const blob = new Blob([JSON.stringify(userRequests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuvex-user-requests-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyInquiry = (req: UserRequest) => {
    const text = `Client: ${req.name} (${req.email})\nPhone: ${req.phone || 'N/A'}\nCategory: ${req.projectType}\nBudget: ${req.budget}\nSource: ${req.source}\nDate: ${new Date(req.createdAt).toLocaleString()}\n\nMessage:\n${req.message}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(req.id);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <div className="pt-24 pb-32 min-h-screen bg-gray-950 text-gray-100 transition-colors">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Top CMS Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
                ⚡
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white tracking-tight">Yuvex Tech CMS Studio</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                    Live Sync
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Logged in as <span className="text-white font-mono font-semibold">yuvextech@gmail.com</span> • Instant site updates
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExitCMS}
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-bold text-gray-200 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>🌐</span>
              <span>View Live Website</span>
            </button>
            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-bold text-gray-300 transition-all flex items-center gap-1.5"
              title="Download full JSON export"
            >
              <span>💾</span>
              <span>Export JSON</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-xs font-bold text-red-300 transition-all flex items-center gap-1.5"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* CMS Tab Bar */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar border-b border-gray-800/80 mb-8">
          {[
            { id: 'overview' as const, label: 'Dashboard', icon: '📊', count: null, unread: 0 },
            { id: 'inquiries' as const, label: 'Client Inquiries', icon: '📬', count: userRequests.length, unread: unreadInquiriesCount },
            { id: 'projects' as const, label: 'Projects & Case Studies', icon: '💼', count: projects.length, unread: 0 },
            { id: 'blogs' as const, label: 'Tech News & Blog', icon: '📰', count: blogPosts.length, unread: 0 },
            { id: 'website' as const, label: 'Website Content & Banner', icon: '🌐', count: null, unread: 0 },
            { id: 'services' as const, label: 'Services', icon: '🛠️', count: services.length, unread: 0 },
            { id: 'testimonials' as const, label: 'Testimonials', icon: '⭐', count: testimonials.length, unread: 0 },
            { id: 'settings' as const, label: 'Settings & Backups', icon: '⚙️', count: null, unread: 0 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingProject(null);
                setEditingBlog(null);
                setEditingService(null);
                setEditingTestimonial(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-900/60 border border-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-rose-500 text-white animate-pulse shadow-sm">
                  {tab.unread} NEW
                </span>
              )}
              {tab.count !== null && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-black text-rose-400 font-mono">{userRequests.length}</div>
                  {unreadInquiriesCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                      {unreadInquiriesCount} New
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white mb-1">Client Inquiries</div>
                <p className="text-xs text-gray-400 truncate">Routed to: {targetNotificationEmail}</p>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="mt-4 text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                >
                  View Inquiries Inbox →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden">
                <div className="text-3xl font-black text-blue-400 mb-1 font-mono">{projects.length}</div>
                <div className="text-sm font-bold text-white mb-1">Case Studies / Projects</div>
                <p className="text-xs text-gray-400">Rendered in Portfolio & Explore Details</p>
                <button
                  onClick={() => { setActiveTab('projects'); setIsNewProject(true); setEditingProject({
                    id: `p_${Date.now()}`,
                    title: '',
                    category: 'Web Application',
                    description: '',
                    image: PRESET_IMAGES[0].url,
                    tags: ['React 19', 'TypeScript'],
                    status: 'Live in Production',
                    client: 'Enterprise Client'
                  }); }}
                  className="mt-4 text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  + Add New Project →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden">
                <div className="text-3xl font-black text-purple-400 mb-1 font-mono">{blogPosts.length}</div>
                <div className="text-sm font-bold text-white mb-1">Tech News & Articles</div>
                <p className="text-xs text-gray-400">Displayed in Insights Blog</p>
                <button
                  onClick={() => { setActiveTab('blogs'); setIsNewBlog(true); setEditingBlog({
                    id: `b_${Date.now()}`,
                    title: '',
                    category: 'AI & Machine Learning',
                    excerpt: '',
                    content: '',
                    author: 'Yuvex Engineering',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    image: PRESET_IMAGES[1].url,
                    readTime: '5 min read'
                  }); }}
                  className="mt-4 text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                >
                  + Write News Article →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden">
                <div className="text-3xl font-black text-emerald-400 mb-1 font-mono">
                  {settings.announcement?.enabled ? 'Active' : 'Off'}
                </div>
                <div className="text-sm font-bold text-white mb-1">Top Announcement Banner</div>
                <p className="text-xs text-gray-400 truncate">{settings.announcement?.text || 'No banner text set'}</p>
                <button
                  onClick={() => setActiveTab('website')}
                  className="mt-4 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  Customize Banner →
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800 relative overflow-hidden">
                <div className="text-3xl font-black text-amber-400 mb-1 font-mono">{testimonials.length}</div>
                <div className="text-sm font-bold text-white mb-1">Client Testimonials</div>
                <p className="text-xs text-gray-400">{services.length} active services</p>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className="mt-4 text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                >
                  Manage Reviews →
                </button>
              </div>
            </div>

            {/* Recent Client Inquiries Summary Section */}
            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">📬</span>
                    <h3 className="text-lg font-bold text-white">Recent Client Inquiries & Requests</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
                      Forwarding to: {targetNotificationEmail}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Real-time user submissions from all contact forms across the website
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTestInquiry}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5"
                  >
                    <span>⚡ Send Test Request</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20"
                  >
                    Full Inbox ({userRequests.length}) →
                  </button>
                </div>
              </div>

              {testInquiryNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
                  <span>✓ Test inquiry stored and dispatched to {targetNotificationEmail}!</span>
                </div>
              )}

              {userRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No client inquiries yet. Form submissions from the website will automatically appear here.
                </div>
              ) : (
                <div className="divide-y divide-gray-800/60">
                  {userRequests.slice(0, 4).map(req => (
                    <div key={req.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors rounded-xl px-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`w-2 h-2 rounded-full ${req.status === 'unread' ? 'bg-rose-500 animate-pulse' : req.status === 'replied' ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                          <span className="text-sm font-bold text-white">{req.name}</span>
                          <a href={`mailto:${req.email}`} className="text-xs font-mono text-blue-400 hover:underline">{req.email}</a>
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300 font-mono font-semibold">{req.source}</span>
                          {req.status === 'unread' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">New</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-1 max-w-3xl">
                          "{req.message}"
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          <span>Budget: <strong className="text-gray-400">{req.budget || 'Custom'}</strong></span>
                          <span>•</span>
                          <span>Category: <strong className="text-gray-400">{req.projectType || 'General'}</strong></span>
                          <span>•</span>
                          <span>{new Date(req.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleSendEmailCopy(req)}
                          className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-all flex items-center gap-1"
                          title={`Send prefilled email copy to ${targetNotificationEmail}`}
                        >
                          <span>📧</span>
                          <span>Send to {targetNotificationEmail}</span>
                        </button>
                        <button
                          onClick={() => handleReplyToClient(req)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <span>💬</span>
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-2">Publish Something New</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Post new projects, technical breakthroughs, client stories, or architectural breakthroughs. Changes are reflected across all views in real time.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setIsNewProject(true);
                      setEditingProject({
                        id: `p_${Date.now()}`,
                        title: '',
                        category: 'Web Application',
                        description: '',
                        image: PRESET_IMAGES[0].url,
                        tags: ['React 19', 'TypeScript'],
                        status: 'Live in Production',
                        client: 'Enterprise Client'
                      });
                    }}
                    className="p-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 text-left border border-gray-700/60 transition-all group"
                  >
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💼</span>
                    <span className="text-sm font-bold text-white block">Add Case Study</span>
                    <span className="text-[11px] text-gray-400">Showcase new client work</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('blogs');
                      setIsNewBlog(true);
                      setEditingBlog({
                        id: `b_${Date.now()}`,
                        title: '',
                        category: 'AI',
                        excerpt: '',
                        content: '',
                        author: 'Yuvex Engineering',
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        image: PRESET_IMAGES[1].url,
                        readTime: '6 min'
                      });
                    }}
                    className="p-4 rounded-2xl bg-gray-800/80 hover:bg-gray-800 text-left border border-gray-700/60 transition-all group"
                  >
                    <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📰</span>
                    <span className="text-sm font-bold text-white block">Write Tech News</span>
                    <span className="text-[11px] text-gray-400">Publish insights & updates</span>
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Announcement Banner & Global Info</h3>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Instantly broadcast new updates, hiring announcements, product launches, or update agency contact information.
                  </p>
                  <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-300">Live Banner Preview:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${settings.announcement?.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}>
                        {settings.announcement?.enabled ? 'Active on site' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 italic">
                      "{settings.announcement?.text || 'No text set'}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('website')}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white rounded-xl transition-all"
                >
                  Edit Website Messaging & Settings →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CLIENT INQUIRIES & USER REQUESTS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Inquiries Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">📬</span>
                  <h2 className="text-2xl font-black text-white tracking-tight">Client Inquiries & User Requests</h2>
                  {unreadInquiriesCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white animate-pulse">
                      {unreadInquiriesCount} Unread
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  All submissions from the website contact forms, AI Lab inquiries, and consultation requests are stored here and forwarded to <strong className="text-blue-400 font-mono font-bold">{targetNotificationEmail}</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSendTestInquiry}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5 active:scale-95"
                  title="Generate a test inquiry to verify storage & forwarding"
                >
                  <span>⚡</span>
                  <span>Send Test Inquiry</span>
                </button>
                <button
                  onClick={handleExportInquiries}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5"
                  title="Download all user requests as JSON"
                >
                  <span>💾</span>
                  <span>Export JSON</span>
                </button>
                {userRequests.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all recorded inquiries from the database? This cannot be undone.')) {
                        clearAllUserRequests();
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-xs font-bold text-red-300 transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {testInquiryNotice && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between animate-in zoom-in-95">
                <div className="flex items-center gap-2">
                  <span className="text-base">✓</span>
                  <span>New test inquiry created! Notification prepared for <strong>{targetNotificationEmail}</strong> and saved in persistent database.</span>
                </div>
                <button
                  onClick={() => setTestInquiryNotice(false)}
                  className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Inquiries Filters Bar */}
            <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder="Search by client name, email, or message contents..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <span className="absolute left-3 top-2.5 text-gray-500 text-xs">🔍</span>
                {inquirySearch && (
                  <button
                    onClick={() => setInquirySearch('')}
                    className="absolute right-3 top-2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl bg-gray-950 p-1 border border-gray-800">
                  {(['all', 'unread', 'read', 'replied'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setInquiryStatusFilter(status)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                        inquiryStatusFilter === status
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {status} {status === 'unread' && unreadInquiriesCount > 0 ? `(${unreadInquiriesCount})` : ''}
                    </button>
                  ))}
                </div>

                <select
                  value={inquirySourceFilter}
                  onChange={(e) => setInquirySourceFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="all">All Sources</option>
                  <option value="Contact Form (Home)">Contact Form (Home)</option>
                  <option value="Contact Page (Dedicated)">Contact Page (Dedicated)</option>
                  <option value="AI Brainstorm Inquiry">AI Brainstorm Inquiry</option>
                  <option value="Test from Admin CPanel">Admin Test Submissions</option>
                </select>
              </div>
            </div>

            {/* Inquiries Cards List */}
            {userRequests.length === 0 ? (
              <div className="p-16 rounded-3xl bg-gray-900 border border-gray-800 text-center">
                <span className="text-4xl block mb-3">📬</span>
                <h3 className="text-lg font-bold text-white mb-2">No Inquiries Stored Yet</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
                  Whenever visitors submit the Contact Us form or any inquiry on the website, their message will be safely stored here and routed to <strong>{targetNotificationEmail}</strong>.
                </p>
                <button
                  onClick={handleSendTestInquiry}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20"
                >
                  + Generate a Test Inquiry
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests
                  .filter(req => {
                    const matchSearch =
                      !inquirySearch ||
                      req.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      req.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      req.message.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                      (req.projectType && req.projectType.toLowerCase().includes(inquirySearch.toLowerCase()));
                    const matchStatus =
                      inquiryStatusFilter === 'all' || req.status === inquiryStatusFilter;
                    const matchSource =
                      inquirySourceFilter === 'all' || req.source === inquirySourceFilter;
                    return matchSearch && matchStatus && matchSource;
                  })
                  .map(req => (
                    <div
                      key={req.id}
                      className={`p-6 rounded-3xl bg-gray-900 border transition-all ${
                        req.status === 'unread'
                          ? 'border-blue-500/40 shadow-lg shadow-blue-600/5'
                          : 'border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                              req.status === 'unread' ? 'bg-rose-500 animate-pulse' : req.status === 'replied' ? 'bg-emerald-400' : 'bg-gray-500'
                            }`}></span>
                            <h4 className="text-base font-bold text-white">{req.name}</h4>
                            <a
                              href={`mailto:${req.email}`}
                              className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <span>{req.email}</span>
                            </a>
                            {req.phone && (
                              <span className="text-xs font-mono text-gray-400">
                                📞 {req.phone}
                              </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-[10px] text-gray-300 font-mono font-bold">
                              {req.source}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'unread'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : req.status === 'replied'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>Received: <strong className="text-gray-400">{new Date(req.createdAt).toLocaleString()}</strong></span>
                            <span>•</span>
                            <span>Project: <strong className="text-gray-300">{req.projectType || 'General'}</strong></span>
                            <span>•</span>
                            <span>Budget: <strong className="text-emerald-400">{req.budget || 'Flexible'}</strong></span>
                            {req.timeline && (
                              <>
                                <span>•</span>
                                <span>Timeline: <strong className="text-gray-300">{req.timeline}</strong></span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Switcher & Timestamp */}
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[11px] text-gray-500">Status:</label>
                          <select
                            value={req.status}
                            onChange={(e) => updateUserRequestStatus(req.id, e.target.value as UserRequest['status'])}
                            className="px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80 text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap mb-4">
                        {req.message}
                      </div>

                      {/* Action Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/60">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Dispatched to target: {targetNotificationEmail}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSendEmailCopy(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95"
                            title={`Send prefilled email copy to ${targetNotificationEmail}`}
                          >
                            <span>📧</span>
                            <span>Send to {targetNotificationEmail}</span>
                          </button>

                          <button
                            onClick={() => handleReplyToClient(req)}
                            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-gray-700"
                            title={`Send direct email reply to client (${req.email})`}
                          >
                            <span>💬</span>
                            <span>Reply to Client</span>
                          </button>

                          <button
                            onClick={() => handleCopyInquiry(req)}
                            className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-all"
                            title="Copy inquiry summary to clipboard"
                          >
                            {copyFeedback === req.id ? '✓ Copied' : '📋 Copy'}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete inquiry from ${req.name}?`)) {
                                deleteUserRequest(req.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/30 text-red-400 text-xs transition-all"
                            title="Delete this inquiry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* If currently editing a project */}
            {editingProject ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                      {isNewProject ? 'Create New Case Study' : 'Edit Project Specifications'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {editingProject.title || 'Untitled Project'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEditingProject(null); setIsNewProject(false); }}
                    className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800"
                  >
                    ✕ Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-6">
                  {/* Basic Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Apex Trading Engine"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Category *</label>
                      <select
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="E-Commerce">E-Commerce</option>
                        <option value="Cloud Architecture">Cloud Architecture</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="FinTech">FinTech</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Client / Organization</label>
                      <input
                        type="text"
                        value={editingProject.client || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        placeholder="e.g. Global FinTech Labs"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Engineering Role</label>
                      <input
                        type="text"
                        value={editingProject.role || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        placeholder="e.g. Full-Cycle Systems Architecture"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Status</label>
                      <input
                        type="text"
                        value={editingProject.status || 'Live in Production'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                        placeholder="e.g. Live in Production"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Tech Stack Tags (comma separated)</label>
                      <input
                        type="text"
                        value={editingProject.tags?.join(', ') || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                        placeholder="React 19, Python, Kafka, AWS"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Cover Image & Presets */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Cover Image URL *</label>
                    <input
                      type="url"
                      required
                      value={editingProject.image}
                      onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 mb-2"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <span className="text-[11px] text-gray-400 font-bold whitespace-nowrap">Presets:</span>
                      {PRESET_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, image: img.url })}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 whitespace-nowrap"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Short Description (for cards) *</label>
                    <textarea
                      required
                      rows={2}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="Brief overview of the project and impact..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Hero Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={editingProject.heroSubtitle || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, heroSubtitle: e.target.value })}
                      placeholder="Sub-15ms real-time telemetry across 12 tier-1 exchange feeds..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Executive Overview & Problem Space</label>
                    <textarea
                      rows={3}
                      value={editingProject.overview || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                      placeholder="Comprehensive narrative of the project context, architectural decisions, and why Yuvex Tech was chosen..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
                      <label className="block text-xs font-bold text-red-400 mb-1">Technical Challenge Summary</label>
                      <textarea
                        rows={2}
                        value={editingProject.challenge?.summary || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          challenge: {
                            summary: e.target.value,
                            points: editingProject.challenge?.points || ['High latency bottlenecks', 'Data synchronization gaps']
                          }
                        })}
                        placeholder="What bottleneck or difficulty did the client face?"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs mb-2"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
                      <label className="block text-xs font-bold text-emerald-400 mb-1">Yuvex Engineering Solution</label>
                      <textarea
                        rows={2}
                        value={editingProject.solution?.summary || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          solution: {
                            summary: e.target.value,
                            highlights: editingProject.solution?.highlights || ['Engineered zero-copy pipeline', 'Microservice edge deployment']
                          }
                        })}
                        placeholder="How did Yuvex engineer the solution?"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs mb-2"
                      />
                    </div>
                  </div>

                  {/* Code Snippet Highlight */}
                  <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800">
                    <label className="block text-xs font-bold text-blue-400 mb-2">Code Snippet Highlight (Optional)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={editingProject.codeSnippet?.title || ''}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          codeSnippet: {
                            title: e.target.value,
                            language: editingProject.codeSnippet?.language || 'typescript',
                            code: editingProject.codeSnippet?.code || ''
                          }
                        })}
                        placeholder="Snippet Title (e.g. real-time-pipeline.ts)"
                        className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs"
                      />
                      <input
                        type="text"
                        value={editingProject.codeSnippet?.language || 'typescript'}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          codeSnippet: {
                            title: editingProject.codeSnippet?.title || 'pipeline.ts',
                            language: e.target.value,
                            code: editingProject.codeSnippet?.code || ''
                          }
                        })}
                        placeholder="Language (e.g. typescript, python)"
                        className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={editingProject.codeSnippet?.code || ''}
                      onChange={(e) => setEditingProject({
                        ...editingProject,
                        codeSnippet: {
                          title: editingProject.codeSnippet?.title || 'pipeline.ts',
                          language: editingProject.codeSnippet?.language || 'typescript',
                          code: e.target.value
                        }
                      })}
                      placeholder="// Paste code snippet here..."
                      className="w-full px-3 py-2 bg-black font-mono border border-gray-800 rounded-lg text-blue-200 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => { setEditingProject(null); setIsNewProject(false); }}
                      className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/20"
                    >
                      {isNewProject ? 'Publish Project' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Project list view */
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects..."
                      className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={projectCategoryFilter}
                      onChange={(e) => setProjectCategoryFilter(e.target.value)}
                      className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs"
                    >
                      <option value="All">All Categories</option>
                      <option value="Web Application">Web Application</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="E-Commerce">E-Commerce</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setIsNewProject(true);
                      setEditingProject({
                        id: `p_${Date.now()}`,
                        title: '',
                        category: 'Web Application',
                        description: '',
                        image: PRESET_IMAGES[0].url,
                        tags: ['React 19', 'TypeScript'],
                        status: 'Live in Production',
                        client: 'Enterprise Client',
                        year: '2024',
                        role: 'Full-Stack Architecture'
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <span>+</span>
                    <span>Create New Case Study</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects
                    .filter(p => projectCategoryFilter === 'All' || p.category === projectCategoryFilter)
                    .filter(p => !projectSearch || p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(projectSearch.toLowerCase())))
                    .map(project => (
                      <div
                        key={project.id}
                        className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-gray-700 transition-all group shadow-lg"
                      >
                        <div>
                          <div className="relative aspect-video overflow-hidden bg-gray-950">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 rounded-lg bg-gray-950/80 backdrop-blur-md text-blue-400 text-[10px] font-black uppercase tracking-wider border border-white/10">
                                {project.category}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                                {project.status || 'Live'}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 3 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-mono">
                                  +{project.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-950/60 border-t border-gray-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setIsNewProject(false);
                                setEditingProject(project);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200 transition-colors"
                            >
                              Edit
                            </button>
                            {onNavigateToProject && (
                              <button
                                onClick={() => onNavigateToProject(project.id)}
                                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold transition-colors"
                                title="Inspect in Explore Details"
                              >
                                View ↗
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete project "${project.title}"?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/40 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: BLOGS & TECH NEWS MANAGER */}
        {activeTab === 'blogs' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {editingBlog ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                      {isNewBlog ? 'Write New Tech News / Blog Post' : 'Edit Article'}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {editingBlog.title || 'Untitled Article'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setEditingBlog(null); setIsNewBlog(false); }}
                    className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-gray-800"
                  >
                    ✕ Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveBlog} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-300 mb-1">Article Headline *</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                        placeholder="e.g. Next-Gen Distributed Telemetry with React 19 and WebSockets"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Category *</label>
                      <select
                        value={editingBlog.category}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
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
                      <label className="block text-xs font-bold text-gray-300 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={editingBlog.author}
                        onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                        placeholder="e.g. Alex Rivera, Senior Architect"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Estimated Read Time</label>
                      <input
                        type="text"
                        value={editingBlog.readTime}
                        onChange={(e) => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Publication Date</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingBlog.date}
                          onChange={(e) => setEditingBlog({ ...editingBlog, date: e.target.value })}
                          placeholder="e.g. Oct 15, 2024"
                          className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingBlog({
                            ...editingBlog,
                            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          })}
                          className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 rounded-xl"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Cover Image URL *</label>
                    <input
                      type="url"
                      required
                      value={editingBlog.image}
                      onChange={(e) => setEditingBlog({ ...editingBlog, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 mb-2"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <span className="text-[11px] text-gray-400 font-bold whitespace-nowrap">Presets:</span>
                      {PRESET_IMAGES.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditingBlog({ ...editingBlog, image: img.url })}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-[10px] text-gray-300 whitespace-nowrap"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Short Excerpt (for preview cards) *</label>
                    <textarea
                      required
                      rows={2}
                      value={editingBlog.excerpt}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                      placeholder="Concise summary that captures the essence of the post..."
                      className="w-full px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Full Article Content (Markdown or Text) *</label>
                    <textarea
                      required
                      rows={8}
                      value={editingBlog.content || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      placeholder="Write your complete article content here. You can format with paragraphs, quotes, and code references..."
                      className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => { setEditingBlog(null); setIsNewBlog(false); }}
                      className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all shadow-lg shadow-purple-600/20"
                    >
                      {isNewBlog ? 'Publish Article' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <input
                    type="text"
                    value={blogSearch}
                    onChange={(e) => setBlogSearch(e.target.value)}
                    placeholder="Search articles by title or author..."
                    className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500 max-w-sm"
                  />

                  <button
                    onClick={() => {
                      setIsNewBlog(true);
                      setEditingBlog({
                        id: `b_${Date.now()}`,
                        title: '',
                        category: 'AI',
                        excerpt: '',
                        content: '',
                        author: 'Yuvex Engineering',
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        image: PRESET_IMAGES[1].url,
                        readTime: '5 min read'
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                  >
                    <span>+</span>
                    <span>Write News Article</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blogPosts
                    .filter(b => !blogSearch || b.title.toLowerCase().includes(blogSearch.toLowerCase()) || b.author.toLowerCase().includes(blogSearch.toLowerCase()))
                    .map(post => (
                      <div
                        key={post.id}
                        className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all group"
                      >
                        <div>
                          <div className="aspect-video overflow-hidden bg-gray-950 relative">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-1 rounded-lg bg-gray-950/80 backdrop-blur-md text-purple-400 text-[10px] font-black uppercase tracking-wider border border-white/10">
                                {post.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                              <span>{post.date}</span>
                              <span>{post.readTime}</span>
                            </div>
                            <h4 className="text-base font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-400 line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="text-[11px] font-semibold text-gray-500">
                              By {post.author}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-950/60 border-t border-gray-800/80 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setIsNewBlog(false);
                                setEditingBlog(post);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-200"
                            >
                              Edit
                            </button>
                            {onNavigateToBlog && (
                              <button
                                onClick={() => onNavigateToBlog(post.id)}
                                className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 text-xs font-bold"
                              >
                                View ↗
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Delete post "${post.title}"?`)) {
                                deleteBlogPost(post.id);
                              }
                            }}
                            className="text-xs text-red-400 hover:text-red-300 p-1.5 hover:bg-red-950/40 rounded-lg"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 4: WEBSITE CONTENT & BANNER */}
        {activeTab === 'website' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* Announcement Banner */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Top Notice Bar</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Top Announcement Banner</h3>
                    <p className="text-xs text-gray-400">Shown at the very top of every page on the live website</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempSettings.announcement.enabled}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        announcement: { ...tempSettings.announcement, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 text-emerald-600 rounded bg-gray-950 border-gray-800"
                    />
                    <span className="text-xs font-bold text-gray-200">
                      {tempSettings.announcement.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Badge Label</label>
                    <input
                      type="text"
                      value={tempSettings.announcement.badge}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        announcement: { ...tempSettings.announcement, badge: e.target.value }
                      })}
                      placeholder="e.g. NEW RELEASE"
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1">Banner Announcement Text</label>
                    <input
                      type="text"
                      value={tempSettings.announcement.text}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        announcement: { ...tempSettings.announcement, text: e.target.value }
                      })}
                      placeholder="e.g. Yuvex Tech opens architecture advisory slots..."
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">CTA Link Label</label>
                    <input
                      type="text"
                      value={tempSettings.announcement.linkText}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        announcement: { ...tempSettings.announcement, linkText: e.target.value }
                      })}
                      placeholder="e.g. Explore Details"
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1">Link Destination (Hash or URL)</label>
                    <input
                      type="text"
                      value={tempSettings.announcement.linkUrl}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        announcement: { ...tempSettings.announcement, linkUrl: e.target.value }
                      })}
                      placeholder="e.g. #explore-details or #contact"
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                <div className="mb-6 pb-4 border-b border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Hero Section</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Homepage Hero Messaging</h3>
                  <p className="text-xs text-gray-400">Modify the primary landing message and call to action buttons</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Eyebrow Pill</label>
                    <input
                      type="text"
                      value={tempSettings.hero.eyebrow}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        hero: { ...tempSettings.hero, eyebrow: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Primary Hero Headline</label>
                    <input
                      type="text"
                      value={tempSettings.hero.title}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        hero: { ...tempSettings.hero, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Hero Subtitle Paragraph</label>
                    <textarea
                      rows={2}
                      value={tempSettings.hero.subtitle}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        hero: { ...tempSettings.hero, subtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Primary CTA Button</label>
                      <input
                        type="text"
                        value={tempSettings.hero.primaryCtaText}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          hero: { ...tempSettings.hero, primaryCtaText: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Secondary CTA Button</label>
                      <input
                        type="text"
                        value={tempSettings.hero.secondaryCtaText}
                        onChange={(e) => setTempSettings({
                          ...tempSettings,
                          hero: { ...tempSettings.hero, secondaryCtaText: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details & Contacts */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                <div className="mb-6 pb-4 border-b border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Agency Information</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Contact Details & Availability</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={tempSettings.company.email}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        company: { ...tempSettings.company, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={tempSettings.company.phone}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        company: { ...tempSettings.company, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Headquarters Location</label>
                    <input
                      type="text"
                      value={tempSettings.company.address}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        company: { ...tempSettings.company, address: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Status Badge / Availability</label>
                    <input
                      type="text"
                      value={tempSettings.company.statusBadge}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        company: { ...tempSettings.company, statusBadge: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-300 mb-1">Footer Agency Bio</label>
                    <textarea
                      rows={2}
                      value={tempSettings.company.footerBio}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        company: { ...tempSettings.company, footerBio: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8">
                <div className="mb-6 pb-4 border-b border-gray-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Social Channels</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">External Links</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Twitter / X URL</label>
                    <input
                      type="text"
                      value={tempSettings.socials.twitter}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        socials: { ...tempSettings.socials, twitter: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={tempSettings.socials.linkedin}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        socials: { ...tempSettings.socials, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={tempSettings.socials.github}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        socials: { ...tempSettings.socials, github: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Discord / Community URL</label>
                    <input
                      type="text"
                      value={tempSettings.socials.discord}
                      onChange={(e) => setTempSettings({
                        ...tempSettings,
                        socials: { ...tempSettings.socials, discord: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Save Bar */}
              <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-2xl">
                <div>
                  {settingsSavedMessage && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Changes saved & published live across the site!</span>
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  Save & Publish Website Changes
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 5: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {editingService ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  {isNewService ? 'Add New Service Capability' : 'Edit Service'}
                </h3>
                <form onSubmit={handleSaveService} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Emoji / Icon</label>
                    <input
                      type="text"
                      value={editingService.icon}
                      onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                      placeholder="e.g. 🚀, 💻, 📱, 🧠"
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Service Title *</label>
                    <input
                      type="text"
                      required
                      value={editingService.title}
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-xs font-bold text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white"
                    >
                      Save Service
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Active Services & Practice Areas</h3>
                  <button
                    onClick={() => {
                      setIsNewService(true);
                      setEditingService({
                        id: `s_${Date.now()}`,
                        title: '',
                        description: '',
                        icon: '⚡'
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    + Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <div
                      key={service.id}
                      className="p-6 rounded-3xl bg-gray-900 border border-gray-800 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl p-2.5 rounded-2xl bg-gray-800/80 border border-gray-700/60 inline-block">
                          {service.icon}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white mb-1">{service.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setIsNewService(false);
                            setEditingService(service);
                          }}
                          className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete service "${service.title}"?`)) {
                              deleteService(service.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-red-950 text-red-400 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 6: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {editingTestimonial ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 max-w-2xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  {isNewTestimonial ? 'Add Client Testimonial' : 'Edit Testimonial'}
                </h3>
                <form onSubmit={handleSaveTestimonial} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Author Name *</label>
                      <input
                        type="text"
                        required
                        value={editingTestimonial.author}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Role / Title *</label>
                      <input
                        type="text"
                        required
                        value={editingTestimonial.role}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Company *</label>
                      <input
                        type="text"
                        required
                        value={editingTestimonial.company}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Industry Tag</label>
                      <input
                        type="text"
                        value={editingTestimonial.tag || 'Enterprise'}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, tag: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Avatar Image URL</label>
                    <input
                      type="url"
                      value={editingTestimonial.avatar}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Client Quote *</label>
                    <textarea
                      required
                      rows={3}
                      value={editingTestimonial.quote}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => setEditingTestimonial(null)}
                      className="px-4 py-2 rounded-xl bg-gray-800 text-xs font-bold text-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Client Reviews & Testimonials</h3>
                  <button
                    onClick={() => {
                      setIsNewTestimonial(true);
                      setEditingTestimonial({
                        id: Date.now(),
                        quote: '',
                        author: '',
                        role: 'VP of Technology',
                        company: 'Innovate Corp',
                        avatar: 'https://i.pravatar.cc/150?u=client_' + Date.now(),
                        rating: 5,
                        tag: 'Enterprise'
                      });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                  >
                    + Add Review
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(item => (
                    <div
                      key={item.id}
                      className="p-6 rounded-3xl bg-gray-900 border border-gray-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={item.avatar}
                            alt={item.author}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-700"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{item.author}</h4>
                            <p className="text-xs text-gray-400">{item.role}, {item.company}</p>
                            {item.tag && (
                              <span className="text-[10px] text-blue-400 font-bold uppercase">{item.tag}</span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 italic mb-4">"{item.quote}"</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
                        <button
                          onClick={() => {
                            setIsNewTestimonial(false);
                            setEditingTestimonial(item);
                          }}
                          className="px-2.5 py-1 rounded bg-gray-800 text-xs text-gray-300 hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete testimonial by ${item.author}?`)) {
                              deleteTestimonial(item.id);
                            }
                          }}
                          className="p-1 rounded text-red-400 hover:bg-red-950 text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 7: SETTINGS & BACKUPS */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
            {/* Inquiry Notification Destination */}
            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-xl">📬</span>
                <h3 className="text-lg font-bold text-white">Client Inquiry Notification Destination</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                When visitors submit any contact form or project inquiry on the website, user requests are stored in the Admin CMS and automated notifications/email drafts are routed to this target address.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                <input
                  type="email"
                  value={tempSettings.notificationsEmail || 'ywapne@gmail.com'}
                  onChange={(e) => setTempSettings({ ...tempSettings, notificationsEmail: e.target.value })}
                  placeholder="ywapne@gmail.com"
                  className="px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs flex-1 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const emailToSave = tempSettings.notificationsEmail || 'ywapne@gmail.com';
                    updateSettings({ notificationsEmail: emailToSave });
                    alert(`✓ Inquiry notification email successfully saved: ${emailToSave}`);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  Save Email
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Target: <strong className="text-blue-400 font-mono font-bold">{tempSettings.notificationsEmail || 'ywapne@gmail.com'}</strong></span>
              </div>
            </div>

            {/* Change Passcode */}
            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-1">Admin Security Passcode</h3>
              <p className="text-xs text-gray-400 mb-4">
                Update the passcode required to unlock the Yuvex CMS Studio.
              </p>
              <div className="flex items-center gap-3 max-w-md">
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new passcode"
                  className="px-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs flex-1 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={() => {
                    if (newPassInput.trim().length >= 4) {
                      changePassword(newPassInput.trim());
                      setPassChangeSuccess(true);
                      setNewPassInput('');
                      setTimeout(() => setPassChangeSuccess(false), 3000);
                    } else {
                      alert('Passcode must be at least 4 characters long.');
                    }
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Passcode
                </button>
              </div>
              {passChangeSuccess && (
                <p className="text-xs text-emerald-400 font-bold mt-2">✓ Admin passcode updated successfully!</p>
              )}
            </div>

            {/* Backup & JSON Exporter */}
            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-1">Data Backup & Export</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Export all your configured projects, news articles, testimonials, and website settings as a portable JSON file.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-white rounded-xl flex items-center gap-2 border border-gray-700"
              >
                <span>💾</span>
                <span>Download Full CMS Backup (.json)</span>
              </button>
            </div>

            {/* JSON Importer */}
            <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-1">Import CMS JSON Data</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Restore or paste JSON data to instantly load projects, blog posts, and site customizations.
              </p>
              <textarea
                rows={4}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="Paste backup JSON content here..."
                className="w-full p-3 bg-gray-950 font-mono text-xs text-gray-300 border border-gray-800 rounded-xl mb-3"
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleImportBackup}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-xl"
                >
                  Import & Restore Data
                </button>
                {importStatus === 'success' && (
                  <span className="text-xs text-emerald-400 font-bold">✓ Data imported successfully!</span>
                )}
                {importStatus === 'error' && (
                  <span className="text-xs text-red-400 font-bold">✕ Invalid JSON structure.</span>
                )}
              </div>
            </div>

            {/* Factory Reset */}
            <div className="p-8 rounded-3xl bg-red-950/20 border border-red-900/30">
              <h3 className="text-lg font-bold text-red-400 mb-1">Factory Reset</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Clear all custom local additions and restore Yuvex Tech to default initial showcase projects, blog posts, and settings.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all CMS content to original factory defaults? This cannot be undone.')) {
                    resetToDefaults();
                    alert('CMS content reset to factory defaults.');
                  }
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-xs font-bold text-white rounded-xl"
              >
                Reset to Factory Defaults
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCMS;
