import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocFromServer,
  Firestore,
  DocumentReference,
  SetOptions
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { BlogPost, Project, SiteSettings, UserRequest, Comment, TeamMember, Service, TestimonialItem, NewsletterSubscriber } from '../types';
import { PROJECTS, BLOG_POSTS } from '../constants';

// Initialize Firebase App singleton with safe apiKey fallback
const safeConfig = {
  ...firebaseConfig,
  apiKey: (firebaseConfig as any).apiKey || 'AIzaSyBM_lcDL86Yw1tdZT8O9udriloM5wwjGgg'
};
export const app = getApps().length ? getApp() : initializeApp(safeConfig);

// Initialize Firestore targeting the specific database ID if configured
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// ==========================================
// ADMIN AUTHENTICATION (Firebase Auth + Google)
// ==========================================
/**
 * Google accounts allowed to manage the CMS.
 * Keep this list in sync with isAdmin() in firestore.rules.
 */
export const ADMIN_EMAILS = ['yuvextech@gmail.com', 'ywapne@gmail.com', 'yovses@gmail.com'];

export const auth = getAuth(app);

export function isAdminUser(user: User | null): boolean {
  return !!user && !!user.email && user.emailVerified && ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export async function signInAdminWithGoogle(): Promise<{ ok: boolean; error?: string }> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (!isAdminUser(result.user)) {
      await signOut(auth);
      return { ok: false, error: `${result.user.email || 'This account'} is not authorized to manage this site.` };
    }
    return { ok: true };
  } catch (err: any) {
    const code: string = err?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return { ok: false, error: 'Sign-in was cancelled.' };
    }
    if (code === 'auth/unauthorized-domain') {
      return { ok: false, error: 'This domain is not authorized in Firebase Authentication. Add it under Authentication → Settings → Authorized domains.' };
    }
    if (code === 'auth/operation-not-allowed') {
      return { ok: false, error: 'Google sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.' };
    }
    return { ok: false, error: err?.message || 'Sign-in failed. Please try again.' };
  }
}

export function signOutAdmin(): Promise<void> {
  return signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore rejects `undefined` field values, so strip them before every write.
function clean<T>(data: T): T {
  if (data === undefined) return null as unknown as T;
  const str = JSON.stringify(data);
  return str ? JSON.parse(str) : ({} as T);
}

function setClean(ref: DocumentReference, data: any, options?: SetOptions) {
  const cleaned = clean(data);
  return options ? setDoc(ref, cleaned, options) : setDoc(ref, cleaned);
}

// Initial Team Members Seed Data
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'team_1',
    name: 'Julian Vance',
    role: 'Founder & Head of Engineering',
    image: 'https://i.pravatar.cc/300?u=julian_vance_yuvex',
    bio: 'Ex-FAANG cloud architect with a passion for high-performance distributed systems, React 19, and low-latency APIs.',
    skills: ['Distributed Systems', 'TypeScript', 'Kubernetes', 'Cloud Architecture'],
    socialLinks: {
      twitter: 'https://twitter.com/julian_yuvex',
      linkedin: 'https://linkedin.com/in/julian-vance',
      github: 'https://github.com/julianvance'
    },
    displayOrder: 1,
    isPublished: true
  },
  {
    id: 'team_2',
    name: 'Elena Kostic',
    role: 'Director of Product Design',
    image: 'https://i.pravatar.cc/300?u=elena_kostic_design',
    bio: 'Award-winning UI/UX specialist focused on emotional resonance, design systems, and zero-pill modern interface craft.',
    skills: ['Design Systems', 'Figma', 'Micro-interactions', 'Accessibility'],
    socialLinks: {
      twitter: 'https://twitter.com/elena_ux',
      linkedin: 'https://linkedin.com/in/elena-kostic'
    },
    displayOrder: 2,
    isPublished: true
  },
  {
    id: 'team_3',
    name: 'Dr. Aris Thorne',
    role: 'Lead AI & Machine Learning Scientist',
    image: 'https://i.pravatar.cc/300?u=dr_aris_thorne_ai',
    bio: 'PhD in Statistical NLP; spearheads LLM prompt orchestration, multimodal embedding pipelines, and Gemini workflow automation.',
    skills: ['Gemini 2.5 / 3.0', 'Embeddings', 'Vector DBs', 'Python'],
    socialLinks: {
      twitter: 'https://twitter.com/aris_thorne',
      github: 'https://github.com/aristhorne'
    },
    displayOrder: 3,
    isPublished: true
  },
  {
    id: 'team_4',
    name: 'Maya Lin',
    role: 'VP of Product & Strategic Growth',
    image: 'https://i.pravatar.cc/300?u=maya_lin_strategy',
    bio: 'Helped scale three SaaS startups from pre-seed to Series B. Specializes in technical roadmapping and client success.',
    skills: ['Product Strategy', 'Agile Roadmaps', 'Enterprise Delivery'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/maya-lin-product'
    },
    displayOrder: 4,
    isPublished: true
  }
];

// Initial CPanel Site Settings Seed Data
export const INITIAL_CPANEL_SETTINGS: SiteSettings = {
  siteName: 'Yuvex Tech',
  contactEmail: 'contact@yuvextech.com',
  notificationsEmail: 'ywapne@gmail.com',
  heroBadge: 'Next-Gen Mobile & AI Engineering',
  heroTitle: 'Architecting High-Performance Digital Products',
  heroSubtitle: 'Bespoke mobile applications, scalable cloud infrastructure, and strategic AI integrations for ambitious enterprises.',
  announcement: {
    enabled: true,
    badge: 'NEW',
    text: 'Explore our latest AI Brainstorming Studio & Cloud Database integration',
    linkText: 'Learn More',
    linkUrl: '#brainstorm-page'
  },
  hero: {
    eyebrow: 'Full-Stack Studio & Lab',
    title: 'Architecting High-Performance Digital Products',
    subtitle: 'From zero-latency fintech backends to conversational AI mobile apps, we turn bold concepts into market-defining technology.',
    primaryCtaText: 'Start Project',
    secondaryCtaText: 'Explore Work'
  },
  company: {
    name: 'Yuvex Tech Inc.',
    email: 'contact@yuvextech.com',
    phone: '+1 (800) 555-YUVEX',
    address: 'Silicon Valley, CA & Remote Global',
    statusBadge: 'Accepting Q4 Client Engagements',
    footerBio: 'Engineering excellence meets human-centered design. We build resilient mobile apps, web platforms, and AI systems.'
  },
  socials: {
    twitter: 'https://twitter.com/yuvextech',
    linkedin: 'https://linkedin.com/company/yuvextech',
    github: 'https://github.com/yuvextech',
    discord: 'https://discord.gg/yuvextech'
  },
  socialLinks: {
    twitter: 'https://twitter.com/yuvextech',
    linkedin: 'https://linkedin.com/company/yuvextech',
    github: 'https://github.com/yuvextech',
    discord: 'https://discord.gg/yuvextech'
  }
};

/**
 * Validates connection to Firestore at application boot
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or config is pending.');
    }
    return false;
  }
}


// ==========================================
// 1. POSTS (ARTICLES & TECH NEWS)
// ==========================================
export async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const snap = await getDocs(collection(db, 'posts'));
    if (snap.empty) return [];
    return snap.docs.map(d => ({ ...(d.data() as BlogPost), id: d.id }));
  } catch (err) {
    console.error('Error fetching posts from Firestore:', err);
    return [];
  }
}

export async function saveDbPost(post: BlogPost): Promise<void> {
  const docRef = doc(db, 'posts', post.id);
  await setClean(docRef, { ...post, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function deleteDbPost(id: string): Promise<void> {
  await deleteDoc(doc(db, 'posts', id));
}

export function subscribeDbPosts(callback: (posts: BlogPost[]) => void) {
  return onSnapshot(collection(db, 'posts'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as BlogPost), id: d.id }));
    callback(list);
  }, (err) => {
    console.error('Posts subscription error:', err);
  });
}

// ==========================================
// 2. COMMENTS (PER POST)
// ==========================================
export async function getDbComments(postId?: string): Promise<Comment[]> {
  try {
    const colRef = collection(db, 'comments');
    const q = postId ? query(colRef, where('postId', '==', postId)) : colRef;
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...(d.data() as Comment), id: d.id }));
  } catch (err) {
    console.error('Error fetching comments from Firestore:', err);
    return [];
  }
}

export async function addDbComment(comment: Comment): Promise<void> {
  const commentId = comment.id || `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const docRef = doc(db, 'comments', commentId);
  const commentData: Record<string, any> = {
    id: commentId,
    author: comment.author || 'Anonymous Innovator',
    text: comment.text || '',
    date: comment.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    avatar: comment.avatar || `https://i.pravatar.cc/100?u=${encodeURIComponent(comment.author || 'anon')}`,
    createdAt: comment.createdAt || Date.now()
  };
  if (comment.postId) commentData.postId = comment.postId;
  if (comment.email) commentData.email = comment.email;

  await setClean(docRef, commentData);
}

export async function deleteDbComment(id: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', id));
}

export function subscribeDbComments(callback: (comments: Comment[]) => void, postId?: string) {
  const colRef = collection(db, 'comments');
  const q = postId ? query(colRef, where('postId', '==', postId)) : colRef;
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as Comment), id: d.id }));
    callback(list);
  }, (err) => {
    console.error('Comments subscription error:', err);
  });
}

// ==========================================
// 3. CPANEL SITE SETTINGS
// ==========================================
export async function getDbSettings(): Promise<SiteSettings | null> {
  try {
    const docSnap = await getDoc(doc(db, 'cpanel_settings', 'general'));
    if (docSnap.exists()) {
      return docSnap.data() as SiteSettings;
    }
    return null;
  } catch (err) {
    console.error('Error fetching cpanel_settings from Firestore:', err);
    return null;
  }
}

export async function saveDbSettings(settings: SiteSettings): Promise<void> {
  await setClean(doc(db, 'cpanel_settings', 'general'), {
    ...settings,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

export function subscribeDbSettings(callback: (settings: SiteSettings) => void) {
  return onSnapshot(doc(db, 'cpanel_settings', 'general'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as SiteSettings);
    }
  }, (err) => {
    console.error('Settings subscription error:', err);
  });
}

// ==========================================
// 4. TEAM MEMBERS
// ==========================================
export async function getDbTeamMembers(): Promise<TeamMember[]> {
  try {
    const snap = await getDocs(collection(db, 'team_members'));
    if (snap.empty) return [];
    const members = snap.docs.map(d => ({ ...(d.data() as TeamMember), id: d.id }));
    return members.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (err) {
    console.error('Error fetching team_members from Firestore:', err);
    return [];
  }
}

export async function saveDbTeamMember(member: TeamMember): Promise<void> {
  const id = member.id || `team_${Date.now()}`;
  await setClean(doc(db, 'team_members', id), { ...member, id }, { merge: true });
}

export async function deleteDbTeamMember(id: string): Promise<void> {
  await deleteDoc(doc(db, 'team_members', id));
}

export function subscribeDbTeamMembers(callback: (members: TeamMember[]) => void) {
  return onSnapshot(collection(db, 'team_members'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as TeamMember), id: d.id }));
    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    callback(list);
  }, (err) => {
    console.error('Team members subscription error:', err);
  });
}

// ==========================================
// 5. PROJECTS (PORTFOLIO)
// ==========================================
export async function getDbProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (snap.empty) return [];
    return snap.docs.map(d => ({ ...(d.data() as Project), id: d.id }));
  } catch (err) {
    console.error('Error fetching projects from Firestore:', err);
    return [];
  }
}

export async function saveDbProject(project: Project): Promise<void> {
  await setClean(doc(db, 'projects', project.id), project, { merge: true });
}

export async function deleteDbProject(id: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', id));
}

export function subscribeDbProjects(callback: (projects: Project[]) => void) {
  return onSnapshot(collection(db, 'projects'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as Project), id: d.id }));
    callback(list);
  }, (err) => {
    console.error('Projects subscription error:', err);
  });
}

// ==========================================
// 6. INQUIRIES & CONTACT LEADS
// ==========================================
export async function getDbInquiries(): Promise<UserRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'inquiries'));
    return snap.docs.map(d => ({ ...(d.data() as UserRequest), id: d.id }));
  } catch (err) {
    console.error('Error fetching inquiries from Firestore:', err);
    return [];
  }
}

export async function saveDbInquiry(inquiry: UserRequest): Promise<void> {
  await setClean(doc(db, 'inquiries', inquiry.id), inquiry, { merge: true });
}

export function subscribeDbInquiries(callback: (inquiries: UserRequest[]) => void) {
  return onSnapshot(collection(db, 'inquiries'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as UserRequest), id: d.id }));
    callback(list);
  }, (err) => {
    console.error('Inquiries subscription error:', err);
  });
}

export async function updateDbInquiry(id: string, updated: Partial<UserRequest>): Promise<void> {
  await setClean(doc(db, 'inquiries', id), updated, { merge: true });
}

export async function deleteDbInquiry(id: string): Promise<void> {
  await deleteDoc(doc(db, 'inquiries', id));
}

// ==========================================
// 7. SERVICES
// ==========================================
export async function saveDbService(service: Service): Promise<void> {
  await setClean(doc(db, 'services', service.id), service, { merge: true });
}

export async function deleteDbService(id: string): Promise<void> {
  await deleteDoc(doc(db, 'services', id));
}

export function subscribeDbServices(callback: (services: Service[]) => void) {
  return onSnapshot(collection(db, 'services'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as Service), id: d.id }));
    list.sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    callback(list);
  }, (err) => {
    console.error('Services subscription error:', err);
  });
}

// ==========================================
// 8. TESTIMONIALS (public sees approved only)
// ==========================================
export async function saveDbTestimonial(item: TestimonialItem): Promise<void> {
  await setClean(doc(db, 'testimonials', String(item.id)), { ...item, id: String(item.id) }, { merge: true });
}

export async function createDbTestimonialSubmission(item: TestimonialItem): Promise<void> {
  // Public submissions are create-only and must be pending (enforced in firestore.rules)
  await setClean(doc(db, 'testimonials', String(item.id)), { ...item, id: String(item.id), status: 'pending', verified: false });
}

export async function deleteDbTestimonial(id: string | number): Promise<void> {
  await deleteDoc(doc(db, 'testimonials', String(id)));
}

export function subscribeDbTestimonials(callback: (items: TestimonialItem[]) => void, includeUnapproved: boolean) {
  const colRef = collection(db, 'testimonials');
  const q = includeUnapproved ? colRef : query(colRef, where('status', '==', 'approved'));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as TestimonialItem), id: d.id }));
    list.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
    callback(list);
  }, (err) => {
    console.error('Testimonials subscription error:', err);
  });
}

// ==========================================
// 9. NEWSLETTER SUBSCRIBERS (admin read only)
// ==========================================
export function subscriberDocId(email: string): string {
  return 'sub_' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/** Returns false when the email is already subscribed (create-only rule rejects the write). */
export async function createDbSubscriber(sub: NewsletterSubscriber): Promise<boolean> {
  try {
    await setClean(doc(db, 'subscribers', subscriberDocId(sub.email)), { ...sub, id: subscriberDocId(sub.email) });
    return true;
  } catch (err: any) {
    if (err?.code === 'permission-denied') return false;
    throw err;
  }
}

export async function saveDbSubscriber(sub: NewsletterSubscriber): Promise<void> {
  await setClean(doc(db, 'subscribers', sub.id), sub, { merge: true });
}

export async function deleteDbSubscriber(id: string): Promise<void> {
  await deleteDoc(doc(db, 'subscribers', id));
}

export function subscribeDbSubscribers(callback: (subs: NewsletterSubscriber[]) => void) {
  return onSnapshot(collection(db, 'subscribers'), (snap) => {
    const list = snap.docs.map(d => ({ ...(d.data() as NewsletterSubscriber), id: d.id }));
    list.sort((a, b) => (b.subscribedAt || '').localeCompare(a.subscribedAt || ''));
    callback(list);
  }, (err) => {
    console.error('Subscribers subscription error:', err);
  });
}

// ==========================================
// DATABASE INITIAL SEEDER
// ==========================================
let isSeeding = false;
export async function seedDatabaseIfEmpty(extra?: { services?: Service[]; testimonials?: TestimonialItem[] }): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Check & Seed Posts
    const postsSnap = await getDocs(collection(db, 'posts'));
    if (postsSnap.empty) {
      console.log('Seeding initial blog posts to Firestore...');
      for (const p of BLOG_POSTS) {
        await setClean(doc(db, 'posts', p.id), p);
      }
    }

    // 2. Check & Seed Projects
    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      console.log('Seeding initial projects to Firestore...');
      for (const pr of PROJECTS) {
        await setClean(doc(db, 'projects', pr.id), pr);
      }
    }

    // 3. Check & Seed CPanel Settings
    const settingsSnap = await getDoc(doc(db, 'cpanel_settings', 'general'));
    if (!settingsSnap.exists()) {
      console.log('Seeding initial CPanel settings to Firestore...');
      await setClean(doc(db, 'cpanel_settings', 'general'), INITIAL_CPANEL_SETTINGS);
    }

    // 4. Check & Seed Team Members
    const teamSnap = await getDocs(collection(db, 'team_members'));
    if (teamSnap.empty) {
      console.log('Seeding initial team members to Firestore...');
      for (const member of INITIAL_TEAM_MEMBERS) {
        await setClean(doc(db, 'team_members', member.id), member);
      }
    }

    // 5. Check & Seed Services
    if (extra?.services?.length) {
      const servicesSnap = await getDocs(collection(db, 'services'));
      if (servicesSnap.empty) {
        let order = 0;
        for (const sv of extra.services) {
          await setClean(doc(db, 'services', sv.id), { ...sv, displayOrder: order++ });
        }
      }
    }

    // 6. Check & Seed Testimonials
    if (extra?.testimonials?.length) {
      const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
      if (testimonialsSnap.empty) {
        for (const t of extra.testimonials) {
          await setClean(doc(db, 'testimonials', String(t.id)), { ...t, id: String(t.id), status: t.status || 'approved' });
        }
      }
    }
  } catch (err) {
    console.error('Database seeding failed or offline:', err);
  } finally {
    isSeeding = false;
  }
}
