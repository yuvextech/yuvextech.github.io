
export interface ProjectFeature {
  title: string;
  description: string;
  icon: string;
  impact?: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
  change?: string;
  description?: string;
}

export interface ArchitectureStep {
  step: string;
  name: string;
  desc: string;
  icon: string;
  latency?: string;
}

export interface ProjectArchitecture {
  frontend: string[];
  backend: string[];
  cloudInfrastructure: string[];
  securityAndCompliance: string[];
  diagramSteps?: ArchitectureStep[];
}

export interface ProjectBenchmark {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  client?: string;
  year?: string;
  timeline?: string;
  role?: string;
  status?: string;
  heroSubtitle?: string;
  overview?: string;
  challenge?: {
    summary: string;
    points: string[];
  };
  solution?: {
    summary: string;
    highlights: string[];
  };
  architecture?: ProjectArchitecture;
  features?: ProjectFeature[];
  metrics?: ProjectMetric[];
  benchmarks?: ProjectBenchmark[];
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
  gallery?: {
    url: string;
    caption: string;
  }[];
  deliverables?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
  };
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: number | string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating?: number;
  tag?: string;
  status?: 'approved' | 'pending' | 'rejected';
  submittedAt?: string;
  email?: string;
  verified?: boolean;
  isClientSubmission?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: string;
  status: 'active' | 'unsubscribed';
  notificationsCount?: number;
  lastNotifiedPostId?: string;
  lastNotifiedAt?: string;
}

export interface PostNotificationLog {
  id: string;
  postId: string;
  postTitle: string;
  dispatchedAt: string;
  recipientCount: number;
  recipients: string[];
}

export interface UserRequest {
  id: string;
  source: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  metadata?: Record<string, any>;
  createdAt: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  sentToEmail: string;
  emailDispatched?: boolean;
}

export interface TelegramTarget {
  id: string; // e.g. '@yuvextech_channel' or '-1001234567890'
  name: string; // Friendly label, e.g. 'Official Telegram Channel'
  type: 'channel' | 'group';
  enabled: boolean;
  addedAt?: string;
  memberCount?: number;
}

export interface TelegramConfig {
  botToken: string;
  botUsername?: string;
  botName?: string;
  autoPostBlogs: boolean;
  autoPostAnnouncements: boolean;
  sendWithPhoto: boolean;
  includeLink: boolean;
  defaultHashtags: string;
  selectedTargetId?: string; // 'all' or specific target id
  targets: TelegramTarget[];
}

export interface TelegramDispatchLog {
  id: string;
  type: 'blog' | 'announcement' | 'quick_message' | 'test';
  title: string;
  targetId: string;
  targetName: string;
  dispatchedAt: string;
  status: 'success' | 'error';
  errorMessage?: string;
  messageId?: number;
}

export interface SiteSettings {
  siteName?: string;
  contactEmail?: string;
  heroTitle?: string;
  heroBadge?: string;
  heroSubtitle?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
  };
  notificationsEmail?: string;
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  telegram?: TelegramConfig;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    statusBadge: string;
    footerBio: string;
  };
  socials: {
    twitter: string;
    linkedin: string;
    github: string;
    discord: string;
  };
}
