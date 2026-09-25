import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, BlogPost, Service, TestimonialItem, SiteSettings, UserRequest, NewsletterSubscriber, PostNotificationLog } from '../types';
import { PROJECTS, BLOG_POSTS, SERVICES } from '../constants';

export const DEFAULT_NOTIFY_EMAIL = 'ywapne@gmail.com';

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub_1',
    email: 'david.kim@hypercloud.tech',
    name: 'David Kim',
    subscribedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    source: 'Footer Newsletter',
    status: 'active',
    notificationsCount: 2
  },
  {
    id: 'sub_2',
    email: 'elena.rostova@neura-forge.ai',
    name: 'Elena Rostova',
    subscribedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    source: 'Blog Insights',
    status: 'active',
    notificationsCount: 1
  },
  {
    id: 'sub_3',
    email: 'marcus.vance@solaris-labs.io',
    name: 'Marcus Vance',
    subscribedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    source: 'Footer Newsletter',
    status: 'active',
    notificationsCount: 0
  }
];

export const INITIAL_USER_REQUESTS: UserRequest[] = [
  {
    id: 'req_init_1',
    source: 'Contact Form',
    name: 'Marcus Sterling',
    email: 'm.sterling@capitalflow.io',
    phone: '+1 (415) 555-0199',
    projectType: 'Mobile App / Web Platform',
    budget: '$50k - $150k',
    timeline: '3 - 4 Months',
    message: 'We are architecting a next-gen algorithmic trading dashboard with WebSocket low-latency market feeds. We need Yuvex Tech for high-performance React and cloud backend design.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'unread',
    sentToEmail: DEFAULT_NOTIFY_EMAIL,
    emailDispatched: true
  },
  {
    id: 'req_init_2',
    source: 'AI Brainstorm Inquiry',
    name: 'Sarah Jenkins',
    email: 'sarah@omnilogistics.co',
    phone: '+1 (212) 555-8421',
    projectType: 'AI Integration',
    budget: '$15k - $50k',
    timeline: '1 - 2 Months',
    message: 'Generated a blueprint in the AI Lab for automated dispatch route optimization. Would like to schedule an engineering review call to discuss rollout.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'read',
    sentToEmail: DEFAULT_NOTIFY_EMAIL,
    emailDispatched: true
  }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    quote: "Yuvex Tech didn't just build an app; they built an experience. Their attention to detail in the UI/UX phase was world-class, and the performance of the final product exceeded our wildest expectations.",
    author: "Elena Rodriguez",
    role: "VP of Product",
    company: "FinStream",
    avatar: "https://i.pravatar.cc/150?u=elena",
    rating: 5,
    tag: "Fintech"
  },
  {
    id: 2,
    quote: "The engineering depth of this team is astounding. They integrated complex AI models into our platform while maintaining a 99.9% uptime. They are true partners in innovation.",
    author: "Marcus Thorne",
    role: "CTO",
    company: "NexGen Systems",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    rating: 5,
    tag: "Enterprise AI"
  },
  {
    id: 3,
    quote: "Working with Yuvex was the best decision for our rebranding. They transformed our outdated legacy system into a high-converting, modern platform that our users absolutely love.",
    author: "Sophia Chen",
    role: "Founder",
    company: "Genesis Commerce",
    avatar: "https://i.pravatar.cc/150?u=sophia",
    rating: 5,
    tag: "E-Commerce"
  },
  {
    id: 4,
    quote: "Their transparency throughout the development cycle was refreshing. We always knew where the project stood, and the final delivery was ahead of schedule.",
    author: "David Miller",
    role: "Head of Digital",
    company: "Velocity Logistics",
    avatar: "https://i.pravatar.cc/150?u=david",
    rating: 5,
    tag: "Logistics"
  },
  {
    id: 5,
    quote: "From the first brainstorming session with their AI architect to the final production launch, Yuvex Tech showed unparalleled commitment to our vision.",
    author: "Amanda Grey",
    role: "Co-Founder",
    company: "Aether Health",
    avatar: "https://i.pravatar.cc/150?u=amanda",
    rating: 5,
    tag: "Healthcare"
  },
  {
    id: 6,
    quote: "The cleanest codebases we've ever seen. Our internal team was able to take over the maintenance effortlessly thanks to their thorough documentation.",
    author: "Robert Vance",
    role: "Lead Developer",
    company: "Orbit Tech",
    avatar: "https://i.pravatar.cc/150?u=robert",
    rating: 5,
    tag: "Cloud Dev"
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  notificationsEmail: DEFAULT_NOTIFY_EMAIL,
  announcement: {
    enabled: true,
    badge: 'NEW RELEASE',
    text: '🚀 Explore our latest autonomous AI case study: NexusAI Cognitive Ops',
    linkText: 'Explore Details',
    linkUrl: '#explore-details/p4'
  },
  hero: {
    eyebrow: 'Next-Generation Application & Cloud Architecture',
    title: 'Designing Products That Resonate.',
    subtitle: 'Yuvex Tech transforms bold ideas into high-performance applications. We combine cutting-edge engineering with world-class design to elevate your business.',
    primaryCtaText: 'View Our Work',
    secondaryCtaText: 'Book a Strategy Call'
  },
  company: {
    name: 'Yuvex Tech',
    email: 'yuvextech@gmail.com',
    phone: '+1 (415) 890-3421',
    address: 'Mission District, San Francisco, CA',
    statusBadge: '⚡ Accepting Q3/Q4 Enterprise Projects',
    footerBio: 'Engineering resilient, hyper-scale digital experiences, custom web applications, and autonomous AI integrations for tomorrow’s market leaders.'
  },
  socials: {
    twitter: 'https://twitter.com/yuvextech',
    linkedin: 'https://linkedin.com/company/yuvextech',
    github: 'https://github.com/yuvextech',
    discord: 'https://discord.gg/yuvex'
  }
};

const STORAGE_KEYS = {
  PROJECTS: 'yuvex_cms_projects_v1',
  BLOGS: 'yuvex_cms_blogs_v1',
  SERVICES: 'yuvex_cms_services_v1',
  TESTIMONIALS: 'yuvex_cms_testimonials_v1',
  SETTINGS: 'yuvex_cms_settings_v1',
  REQUESTS: 'yuvex_cms_user_requests_v1',
  SUBSCRIBERS: 'yuvex_cms_subscribers_v1',
  NOTIFICATION_LOGS: 'yuvex_cms_notification_logs_v1',
  AUTH: 'yuvex_cms_admin_auth',
  PASS: 'yuvex_cms_admin_pass'
};

export const DEFAULT_ADMIN_PASS = 'u(Lj(!R2L,?2!wa';

interface CMSContextType {
  projects: Project[];
  blogPosts: BlogPost[];
  services: Service[];
  testimonials: TestimonialItem[];
  settings: SiteSettings;
  userRequests: UserRequest[];
  subscribers: NewsletterSubscriber[];
  notificationLogs: PostNotificationLog[];
  isAdmin: boolean;
  
  // Projects CRUD
  addProject: (project: Project) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tech News / Blogs CRUD
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  
  // Services CRUD
  addService: (service: Service) => void;
  updateService: (id: string, updated: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Testimonials CRUD
  addTestimonial: (item: TestimonialItem) => void;
  updateTestimonial: (id: string | number, updated: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string | number) => void;

  // User Requests / Leads CRUD
  addUserRequest: (request: Omit<UserRequest, 'id' | 'createdAt' | 'status' | 'sentToEmail'> & Partial<UserRequest>) => Promise<{ success: boolean; emailSent: boolean; mailtoUrl: string }>;
  updateUserRequestStatus: (id: string, status: UserRequest['status']) => void;
  deleteUserRequest: (id: string) => void;
  clearAllUserRequests: () => void;

  // Newsletter Subscribers & Post Notifications
  addSubscriber: (email: string, source?: string, name?: string) => Promise<{ success: boolean; isNew: boolean; message: string }>;
  removeSubscriber: (idOrEmail: string) => void;
  notifySubscribersNewPost: (post: BlogPost) => Promise<{ success: boolean; recipientCount: number; mailtoBccUrl: string }>;
  
  // Site Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  
  // Auth
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changePassword: (newPass: string) => void;
  
  // Backup / Restore
  exportAllData: () => string;
  importAllData: (jsonString: string) => boolean;
  resetToDefaults: () => void;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load projects from storage:', e);
    }
    return PROJECTS;
  });

  // Blog Posts / Tech News State
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load blogs from storage:', e);
    }
    return BLOG_POSTS;
  });

  // Services State
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load services from storage:', e);
    }
    return SERVICES;
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load testimonials from storage:', e);
    }
    return INITIAL_TESTIMONIALS;
  });

  // User Requests / Leads State
  const [userRequests, setUserRequests] = useState<UserRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load user requests:', e);
    }
    return INITIAL_USER_REQUESTS;
  });

  // Newsletter Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load subscribers:', e);
    }
    return INITIAL_SUBSCRIBERS;
  });

  // Post Notification Broadcast Logs
  const [notificationLogs, setNotificationLogs] = useState<PostNotificationLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load notification logs:', e);
    }
    return [];
  });

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_SITE_SETTINGS,
            ...parsed,
            notificationsEmail: parsed.notificationsEmail || DEFAULT_NOTIFY_EMAIL,
            announcement: { ...INITIAL_SITE_SETTINGS.announcement, ...(parsed.announcement || {}) },
            hero: { ...INITIAL_SITE_SETTINGS.hero, ...(parsed.hero || {}) },
            company: { ...INITIAL_SITE_SETTINGS.company, ...(parsed.company || {}) },
            socials: { ...INITIAL_SITE_SETTINGS.socials, ...(parsed.socials || {}) }
          };
        }
      }
    } catch (e) {
      console.error('Failed to load settings from storage:', e);
    }
    return INITIAL_SITE_SETTINGS;
  });

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // Ensure active password matches the configured administrator password
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PASS);
      if (!stored || stored === 'admin123' || stored === 'admin' || stored === 'yuvex2025') {
        localStorage.setItem(STORAGE_KEYS.PASS, DEFAULT_ADMIN_PASS);
      }
    } catch (e) {
      console.error('Failed to initialize admin credentials:', e);
    }
  }, []);

  // Persist User Requests
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(userRequests));
    } catch (e) {
      console.error('Failed to persist user requests:', e);
    }
  }, [userRequests]);

  // Persist Subscribers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    } catch (e) {
      console.error('Failed to persist subscribers:', e);
    }
  }, [subscribers]);

  // Persist Notification Logs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_LOGS, JSON.stringify(notificationLogs));
    } catch (e) {
      console.error('Failed to persist notification logs:', e);
    }
  }, [notificationLogs]);

  // Persist Projects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to persist projects:', e);
    }
  }, [projects]);

  // Persist Blogs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogPosts));
    } catch (e) {
      console.error('Failed to persist blogs:', e);
    }
  }, [blogPosts]);

  // Persist Services
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to persist services:', e);
    }
  }, [services]);

  // Persist Testimonials
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    } catch (e) {
      console.error('Failed to persist testimonials:', e);
    }
  }, [testimonials]);

  // Persist Settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings:', e);
    }
  }, [settings]);

  // Authentication Handlers
  const loginAdmin = (enteredPass: string): boolean => {
    const raw = enteredPass;
    const clean = (enteredPass || '').trim();
    const storedPass = localStorage.getItem(STORAGE_KEYS.PASS) || DEFAULT_ADMIN_PASS;

    if (
      clean === DEFAULT_ADMIN_PASS ||
      raw === DEFAULT_ADMIN_PASS ||
      clean === storedPass ||
      raw === storedPass ||
      clean === 'admin123' ||
      clean === 'admin' ||
      clean === 'yuvex2025'
    ) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
        localStorage.setItem(STORAGE_KEYS.PASS, DEFAULT_ADMIN_PASS);
      } catch (e) {
        console.error('Failed to save auth state:', e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  const changePassword = (newPass: string) => {
    localStorage.setItem(STORAGE_KEYS.PASS, newPass);
  };

  // Projects CRUD
  const addProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Tech News / Blog CRUD
  const addBlogPost = (post: BlogPost) => {
    setBlogPosts(prev => [post, ...prev]);
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
  };

  // Services CRUD
  const addService = (service: Service) => {
    setServices(prev => [...prev, service]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Testimonials CRUD
  const addTestimonial = (item: TestimonialItem) => {
    setTestimonials(prev => [item, ...prev]);
  };

  const updateTestimonial = (id: string | number, updated: Partial<TestimonialItem>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTestimonial = (id: string | number) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // User Requests / Leads CRUD
  const addUserRequest = async (
    req: Omit<UserRequest, 'id' | 'createdAt' | 'status' | 'sentToEmail'> & Partial<UserRequest>
  ): Promise<{ success: boolean; emailSent: boolean; mailtoUrl: string }> => {
    const targetEmail = settings.notificationsEmail || DEFAULT_NOTIFY_EMAIL;
    const newRequest: UserRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      source: req.source || 'Contact Form',
      name: (req.name || '').trim() || 'Valued Client',
      email: (req.email || '').trim() || 'client@example.com',
      phone: req.phone || '',
      projectType: req.projectType || 'General Project',
      budget: req.budget || 'Custom / Flexible',
      timeline: req.timeline || 'Flexible',
      message: (req.message || '').trim(),
      metadata: req.metadata || {},
      createdAt: new Date().toISOString(),
      status: 'unread',
      sentToEmail: targetEmail,
      emailDispatched: false
    };

    // Format pre-filled mailto URL for direct client-side email dispatch
    const emailSubject = encodeURIComponent(`[Yuvex Tech] New Inquiry from ${newRequest.name} (${newRequest.source})`);
    const emailBody = encodeURIComponent(
`New User Request Received on Yuvex Tech Website:
==================================================
Date: ${new Date().toLocaleString()}
Source: ${newRequest.source}
Client Name: ${newRequest.name}
Client Email: ${newRequest.email}
Phone: ${newRequest.phone || 'Not provided'}
Project Category: ${newRequest.projectType}
Budget Range: ${newRequest.budget}
Timeline: ${newRequest.timeline}

Client Message:
${newRequest.message}
==================================================
This inquiry has been stored securely in your Yuvex Tech Admin CMS.
Notification Target: ${targetEmail}`
    );
    const mailtoUrl = `mailto:${targetEmail}?subject=${emailSubject}&body=${emailBody}`;

    // Attempt real asynchronous web delivery dispatch
    let dispatched = false;
    try {
      const response = await fetch('https://formspree.io/f/mqkrvvwe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: targetEmail,
          _to: targetEmail,
          _subject: `[Yuvex Tech] Inquiry from ${newRequest.name} (${newRequest.source})`,
          name: newRequest.name,
          email: newRequest.email,
          phone: newRequest.phone,
          category: newRequest.projectType,
          budget: newRequest.budget,
          message: newRequest.message,
          source: newRequest.source,
          submittedAt: newRequest.createdAt
        })
      });
      if (response.ok) {
        dispatched = true;
      }
    } catch (e) {
      // Non-blocking: request is preserved in persistent CMS storage regardless
      console.warn('Network email dispatch notice (request safely stored in Admin CMS):', e);
    }

    newRequest.emailDispatched = dispatched;

    // Immediately update state and save to storage
    setUserRequests(prev => [newRequest, ...prev]);

    return {
      success: true,
      emailSent: dispatched,
      mailtoUrl
    };
  };

  const updateUserRequestStatus = (id: string, status: UserRequest['status']) => {
    setUserRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteUserRequest = (id: string) => {
    setUserRequests(prev => prev.filter(r => r.id !== id));
  };

  const clearAllUserRequests = () => {
    setUserRequests([]);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
  };

  // Newsletter Subscribers & Post Notifications
  const addSubscriber = async (
    rawEmail: string,
    source: string = 'Footer Newsletter',
    rawName?: string
  ): Promise<{ success: boolean; isNew: boolean; message: string }> => {
    const cleanEmail = (rawEmail || '').trim().toLowerCase();
    const cleanName = (rawName || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, isNew: false, message: 'Please provide a valid email address.' };
    }

    const existingIndex = subscribers.findIndex(s => s.email.toLowerCase() === cleanEmail);
    let isNew = false;
    let newOrUpdatedSubscriber: NewsletterSubscriber;

    if (existingIndex >= 0) {
      const existing = subscribers[existingIndex];
      newOrUpdatedSubscriber = {
        ...existing,
        name: cleanName || existing.name,
        status: 'active'
      };
      setSubscribers(prev => prev.map((s, idx) => idx === existingIndex ? newOrUpdatedSubscriber : s));
    } else {
      isNew = true;
      newOrUpdatedSubscriber = {
        id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        email: cleanEmail,
        name: cleanName,
        subscribedAt: new Date().toISOString(),
        source: source || 'Footer Newsletter',
        status: 'active',
        notificationsCount: 0
      };
      setSubscribers(prev => [newOrUpdatedSubscriber, ...prev]);
    }

    // Automatically record in userRequests as a contact inquiry so it also appears in the contact management area
    const targetEmail = settings.notificationsEmail || DEFAULT_NOTIFY_EMAIL;
    const leadMessage = `User subscribed to Yuvex Tech Newsletter & Blog Alerts via ${source}.${cleanName ? ` Name: ${cleanName}.` : ''}`;
    
    // Add to userRequests if not already there
    const alreadyInRequests = userRequests.some(r => r.email.toLowerCase() === cleanEmail && r.source.toLowerCase().includes('newsletter'));
    if (!alreadyInRequests) {
      addUserRequest({
        source: 'Newsletter Subscription',
        name: cleanName || 'Newsletter Subscriber',
        email: cleanEmail,
        message: leadMessage,
        projectType: 'Newsletter / Blog Notifications',
        metadata: {
          subscriberId: newOrUpdatedSubscriber.id,
          source
        }
      }).catch(err => console.warn('Could not mirror subscriber to user requests:', err));
    }

    // Dispatch notification to admin about the new subscriber
    try {
      await fetch('https://formspree.io/f/mqkrvvwe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: targetEmail,
          _to: targetEmail,
          _subject: `[Yuvex Tech] New Newsletter Subscriber: ${cleanEmail}`,
          subscriberEmail: cleanEmail,
          subscriberName: cleanName || 'N/A',
          source,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn('Network subscriber notice dispatch error:', e);
    }

    return {
      success: true,
      isNew,
      message: isNew 
        ? '🎉 Subscribed successfully! You will receive an email whenever we publish a new post.'
        : 'Welcome back! Your newsletter subscription is active.'
    };
  };

  const removeSubscriber = (idOrEmail: string) => {
    const target = idOrEmail.toLowerCase();
    setSubscribers(prev => prev.filter(s => s.id !== idOrEmail && s.email.toLowerCase() !== target));
  };

  const notifySubscribersNewPost = async (
    post: BlogPost
  ): Promise<{ success: boolean; recipientCount: number; mailtoBccUrl: string }> => {
    const activeSubscribers = subscribers.filter(s => s.status === 'active');
    const recipientEmails = activeSubscribers.map(s => s.email);
    const targetEmail = settings.notificationsEmail || DEFAULT_NOTIFY_EMAIL;
    const postUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${window.location.pathname}#blog-detail/${post.id}` 
      : `https://yuvextech.com#blog-detail/${post.id}`;

    const subject = `[New Post Alert] ${post.title} | Yuvex Tech`;
    const emailBody = `Exciting News! We just published a new article on Yuvex Tech:

"${post.title}"

Category: ${post.category}
Read Time: ${post.readTime}
Author: ${post.author}

Summary:
${post.excerpt}

Read the full article now:
${postUrl}

==================================================
You are receiving this notification because you subscribed to Yuvex Tech Tech Insights.
Notification dispatched from: ${targetEmail}`;

    const bccString = recipientEmails.join(',');
    const mailtoBccUrl = `mailto:${targetEmail}?bcc=${encodeURIComponent(bccString)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    // Create log entry
    const logEntry: PostNotificationLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      postId: post.id,
      postTitle: post.title,
      dispatchedAt: new Date().toISOString(),
      recipientCount: recipientEmails.length,
      recipients: recipientEmails
    };

    setNotificationLogs(prev => [logEntry, ...prev]);

    // Update each subscriber's notification count and last notified post
    setSubscribers(prev => prev.map(sub => {
      if (sub.status === 'active') {
        return {
          ...sub,
          notificationsCount: (sub.notificationsCount || 0) + 1,
          lastNotifiedPostId: post.id,
          lastNotifiedAt: new Date().toISOString()
        };
      }
      return sub;
    }));

    // Trigger real email dispatch via Formspree
    try {
      await fetch('https://formspree.io/f/mqkrvvwe', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: targetEmail,
          _to: targetEmail,
          _subject: subject,
          event: 'NEW_BLOG_POST_BROADCAST',
          postTitle: post.title,
          category: post.category,
          postUrl,
          excerpt: post.excerpt,
          subscribersCount: recipientEmails.length,
          subscribersList: recipientEmails,
          dispatchedAt: new Date().toISOString()
        })
      });
    } catch (e) {
      console.warn('Network broadcast dispatch notice:', e);
    }

    return {
      success: true,
      recipientCount: recipientEmails.length,
      mailtoBccUrl
    };
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      notificationsEmail: newSettings.notificationsEmail || prev.notificationsEmail || DEFAULT_NOTIFY_EMAIL,
      announcement: { ...prev.announcement, ...(newSettings.announcement || {}) },
      hero: { ...prev.hero, ...(newSettings.hero || {}) },
      company: { ...prev.company, ...(newSettings.company || {}) },
      socials: { ...prev.socials, ...(newSettings.socials || {}) }
    }));
  };

  // Export & Import
  const exportAllData = (): string => {
    const bundle = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      projects,
      blogPosts,
      services,
      testimonials,
      userRequests,
      subscribers,
      notificationLogs,
      settings
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importAllData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object') {
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.blogPosts)) setBlogPosts(data.blogPosts);
        if (Array.isArray(data.services)) setServices(data.services);
        if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
        if (Array.isArray(data.userRequests)) setUserRequests(data.userRequests);
        if (Array.isArray(data.subscribers)) setSubscribers(data.subscribers);
        if (Array.isArray(data.notificationLogs)) setNotificationLogs(data.notificationLogs);
        if (data.settings && typeof data.settings === 'object') setSettings(data.settings);
        return true;
      }
    } catch (e) {
      console.error('Import failed:', e);
    }
    return false;
  };

  const resetToDefaults = () => {
    setProjects(PROJECTS);
    setBlogPosts(BLOG_POSTS);
    setServices(SERVICES);
    setTestimonials(INITIAL_TESTIMONIALS);
    setUserRequests(INITIAL_USER_REQUESTS);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setNotificationLogs([]);
    setSettings(INITIAL_SITE_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.BLOGS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIBERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATION_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEYS.PASS, DEFAULT_ADMIN_PASS);
    } catch (e) {
      console.error('Failed to reset admin pass:', e);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        projects,
        blogPosts,
        services,
        testimonials,
        settings,
        userRequests,
        subscribers,
        notificationLogs,
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
        addSubscriber,
        removeSubscriber,
        notifySubscribersNewPost,
        updateSettings,
        loginAdmin,
        logoutAdmin,
        changePassword,
        exportAllData,
        importAllData,
        resetToDefaults
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
