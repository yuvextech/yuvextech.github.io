import { BlogPost, Project } from '../types';

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  author?: string;
  publishedTime?: string;
  schema?: Record<string, any>;
}

export interface SEOAuditResult {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  checks: {
    id: string;
    label: string;
    status: 'pass' | 'warning' | 'fail';
    message: string;
    recommendation?: string;
    value?: string | number;
  }[];
  wordCount: number;
  readTimeMinutes: number;
  headingsCount: { h1: number; h2: number; h3: number };
}

/**
 * Resolves the primary base URL of the site dynamically.
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // Handle local dev or preview URLs
    if (origin && origin !== 'null' && !origin.startsWith('file://')) {
      return origin;
    }
  }
  return 'https://yuvextech.github.io';
}

/**
 * Builds a dynamic, shareable canonical URL for a given route and ID.
 */
export function buildDynamicUrl(route: string, id?: string | null): string {
  const base = getBaseUrl();
  const cleanRoute = route.replace(/^\/+/, '');
  
  if (!cleanRoute || cleanRoute === 'home') {
    return `${base}/`;
  }

  if (id) {
    return `${base}/${cleanRoute}/${id}`;
  }

  return `${base}/${cleanRoute}`;
}

/**
 * Updates DOM head tags dynamically for single-page applications.
 */
export function updatePageSEO(meta: PageMetadata) {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  document.title = meta.title;

  // 2. Primary Meta Tags
  setMetaTag('name', 'description', meta.description);
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('name', 'keywords', meta.keywords.join(', '));
  }
  setMetaTag('name', 'author', meta.author || 'Yuvex Tech');
  setMetaTag('name', 'robots', 'index, follow');

  // 3. Canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonicalUrl);

  // 4. OpenGraph Tags
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', meta.canonicalUrl);
  setMetaTag('property', 'og:type', meta.ogType || 'website');
  setMetaTag('property', 'og:site_name', 'Yuvex Tech');
  setMetaTag('property', 'og:image', meta.ogImage || `${getBaseUrl()}/og-preview.png`);

  if (meta.publishedTime) {
    setMetaTag('property', 'article:published_time', meta.publishedTime);
  }

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  setMetaTag('name', 'twitter:url', meta.canonicalUrl);
  setMetaTag('name', 'twitter:image', meta.ogImage || `${getBaseUrl()}/og-preview.png`);
  setMetaTag('name', 'twitter:site', '@yuvextech');

  // 6. Schema.org JSON-LD Structured Data
  let schemaScript = document.getElementById('yuvex-schema-jsonld') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'yuvex-schema-jsonld';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const structuredData = meta.schema || generateDefaultSchema(meta);
  schemaScript.textContent = JSON.stringify(structuredData, null, 2);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Generates default Schema.org Organization and WebSite structured data
 */
export function generateDefaultSchema(meta: PageMetadata) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Yuvex Tech',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.png`
        },
        description: 'Premium application development, custom web platforms, and strategic AI integration.',
        sameAs: [
          'https://twitter.com/yuvextech',
          'https://github.com/yuvextech'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Yuvex Tech',
        publisher: {
          '@id': `${baseUrl}/#organization`
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${meta.canonicalUrl}#webpage`,
        url: meta.canonicalUrl,
        name: meta.title,
        description: meta.description,
        isPartOf: {
          '@id': `${baseUrl}/#website`
        }
      }
    ]
  };
}

/**
 * Generates rich Schema for a Blog Article
 */
export function generateArticleSchema(post: BlogPost, canonicalUrl: string) {
  const baseUrl = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Yuvex Tech',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/favicon.png`
      }
    },
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category
  };
}

/**
 * Generates rich Schema for a Portfolio Project (SoftwareApplication)
 */
export function generateProjectSchema(project: Project, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    operatingSystem: 'iOS, Android, Web, Cloud',
    applicationCategory: project.category === 'Mobile App' ? 'MobileApplication' : 'BusinessApplication',
    description: project.heroSubtitle || project.description,
    image: project.image,
    url: canonicalUrl,
    creator: {
      '@type': 'Organization',
      name: 'Yuvex Tech'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };
}

/**
 * Generates dynamic sitemap.xml content
 */
export function generateSitemapXml(projects: Project[], blogPosts: BlogPost[]): string {
  const baseUrl = getBaseUrl();
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${baseUrl}/portfolio`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/services`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/brainstorm`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/seo-tools`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' }
  ];

  const projectPages = projects.map(p => ({
    loc: `${baseUrl}/project/${p.id}`,
    priority: '0.85',
    changefreq: 'monthly'
  }));

  const blogPages = blogPosts.map(b => ({
    loc: `${baseUrl}/blog/${b.id}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allUrls = [...staticPages, ...projectPages, ...blogPages];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

/**
 * Generates robots.txt content referencing the dynamic sitemap
 */
export function generateRobotsTxt(): string {
  const baseUrl = getBaseUrl();
  return `# Robots.txt for Yuvex Tech
User-agent: *
Allow: /
Disallow: /admin
Disallow: /cms

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * Runs a comprehensive on-page SEO audit on the current active view or provided metadata
 */
export function runSEOAudit(meta: PageMetadata, contentText: string = ''): SEOAuditResult {
  const checks: SEOAuditResult['checks'] = [];
  let score = 100;

  // 1. Page Title Check (Recommended: 30 - 60 chars)
  const titleLen = meta.title?.length || 0;
  if (titleLen === 0) {
    score -= 25;
    checks.push({
      id: 'title-empty',
      label: 'Page Title',
      status: 'fail',
      value: `${titleLen} chars`,
      message: 'Title tag is missing or empty.',
      recommendation: 'Add a concise, branded title between 30 and 60 characters.'
    });
  } else if (titleLen < 30) {
    score -= 10;
    checks.push({
      id: 'title-short',
      label: 'Page Title Length',
      status: 'warning',
      value: `${titleLen} chars`,
      message: 'Title is shorter than recommended (< 30 characters).',
      recommendation: 'Expand with primary target keywords and brand suffix.'
    });
  } else if (titleLen > 60) {
    score -= 5;
    checks.push({
      id: 'title-long',
      label: 'Page Title Length',
      status: 'warning',
      value: `${titleLen} chars`,
      message: 'Title may truncate in Google desktop and mobile SERPs (> 60 characters).',
      recommendation: 'Aim for 50-60 characters for crisp display in search snippets.'
    });
  } else {
    checks.push({
      id: 'title-optimal',
      label: 'Page Title Length',
      status: 'pass',
      value: `${titleLen} chars`,
      message: 'Optimal title length (30-60 characters).'
    });
  }

  // 2. Meta Description Check (Recommended: 120 - 160 chars)
  const descLen = meta.description?.length || 0;
  if (descLen === 0) {
    score -= 25;
    checks.push({
      id: 'desc-empty',
      label: 'Meta Description',
      status: 'fail',
      value: `${descLen} chars`,
      message: 'Meta description is missing.',
      recommendation: 'Write a persuasive summary between 120 and 160 characters with a clear call to action.'
    });
  } else if (descLen < 120) {
    score -= 8;
    checks.push({
      id: 'desc-short',
      label: 'Meta Description Length',
      status: 'warning',
      value: `${descLen} chars`,
      message: 'Meta description is short (< 120 characters).',
      recommendation: 'Expand to 120-160 characters to optimize click-through rate in search results.'
    });
  } else if (descLen > 160) {
    score -= 5;
    checks.push({
      id: 'desc-long',
      label: 'Meta Description Length',
      status: 'warning',
      value: `${descLen} chars`,
      message: 'Meta description exceeds 160 characters and will likely be truncated.',
      recommendation: 'Trim key message to within 160 characters.'
    });
  } else {
    checks.push({
      id: 'desc-optimal',
      label: 'Meta Description Length',
      status: 'pass',
      value: `${descLen} chars`,
      message: 'Optimal meta description length (120-160 characters).'
    });
  }

  // 3. Canonical URL
  if (meta.canonicalUrl && meta.canonicalUrl.startsWith('http')) {
    checks.push({
      id: 'canonical-pass',
      label: 'Canonical Tag & Dynamic URL',
      status: 'pass',
      value: meta.canonicalUrl,
      message: 'Valid absolute canonical URL declared.'
    });
  } else {
    score -= 15;
    checks.push({
      id: 'canonical-fail',
      label: 'Canonical Tag & Dynamic URL',
      status: 'fail',
      value: meta.canonicalUrl || 'Missing',
      message: 'Canonical URL is not an absolute HTTP/HTTPS address.',
      recommendation: 'Provide full dynamic URL with origin.'
    });
  }

  // 4. OpenGraph Social Cards
  const hasOg = meta.title && meta.description && meta.canonicalUrl;
  if (hasOg) {
    checks.push({
      id: 'og-pass',
      label: 'OpenGraph & Social Tags',
      status: 'pass',
      message: 'OpenGraph tags (og:title, og:description, og:url, og:image) configured.'
    });
  } else {
    score -= 10;
    checks.push({
      id: 'og-warning',
      label: 'OpenGraph & Social Tags',
      status: 'warning',
      message: 'Incomplete OpenGraph properties for social sharing.'
    });
  }

  // 5. Schema.org Structured Data
  if (meta.schema || document.getElementById('yuvex-schema-jsonld')) {
    checks.push({
      id: 'schema-pass',
      label: 'Schema.org JSON-LD',
      status: 'pass',
      message: 'Structured data script present in DOM.'
    });
  } else {
    score -= 10;
    checks.push({
      id: 'schema-warning',
      label: 'Schema.org JSON-LD',
      status: 'warning',
      message: 'No JSON-LD structured data detected on page.',
      recommendation: 'Inject Schema.org JSON-LD to qualify for rich search snippets.'
    });
  }

  // 6. Mobile Viewport Check
  const hasViewport = typeof document !== 'undefined' && !!document.querySelector('meta[name="viewport"]');
  if (hasViewport) {
    checks.push({
      id: 'viewport-pass',
      label: 'Mobile Viewport Tag',
      status: 'pass',
      message: 'Responsive viewport meta tag correctly defined.'
    });
  } else {
    score -= 15;
    checks.push({
      id: 'viewport-fail',
      label: 'Mobile Viewport Tag',
      status: 'fail',
      message: 'Missing viewport meta tag for mobile devices.'
    });
  }

  // Content analysis
  const words = contentText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Heading counts
  const headingsCount = {
    h1: typeof document !== 'undefined' ? document.querySelectorAll('h1').length : 1,
    h2: typeof document !== 'undefined' ? document.querySelectorAll('h2').length : 3,
    h3: typeof document !== 'undefined' ? document.querySelectorAll('h3').length : 2
  };

  if (headingsCount.h1 === 1) {
    checks.push({
      id: 'h1-pass',
      label: 'H1 Heading Hierarchy',
      status: 'pass',
      value: '1 H1 present',
      message: 'Page has exactly one top-level H1 heading.'
    });
  } else if (headingsCount.h1 === 0) {
    score -= 10;
    checks.push({
      id: 'h1-missing',
      label: 'H1 Heading Hierarchy',
      status: 'fail',
      value: '0 H1 found',
      message: 'No H1 tag detected on this page.',
      recommendation: 'Add a descriptive H1 heading containing the primary topic keyword.'
    });
  } else {
    score -= 5;
    checks.push({
      id: 'h1-multiple',
      label: 'H1 Heading Hierarchy',
      status: 'warning',
      value: `${headingsCount.h1} H1s found`,
      message: 'Multiple H1 tags detected on the same page.',
      recommendation: 'Use a single H1 per page for clearer topic signaling to search bots.'
    });
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let grade: SEOAuditResult['grade'] = 'F';
  if (finalScore >= 95) grade = 'A+';
  else if (finalScore >= 90) grade = 'A';
  else if (finalScore >= 80) grade = 'B';
  else if (finalScore >= 70) grade = 'C';
  else if (finalScore >= 60) grade = 'D';

  return {
    score: finalScore,
    grade,
    checks,
    wordCount,
    readTimeMinutes,
    headingsCount
  };
}
