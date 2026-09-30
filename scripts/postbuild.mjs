// Generates static entry points and SEO files after `vite build`.
// Each top-level route gets its own index.html so GitHub Pages serves it
// with HTTP 200 (instead of relying on the 404.html redirect).
import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://yuvextech.github.io';
const DIST = 'dist';
const ROUTES = ['services', 'about', 'portfolio', 'blog', 'brainstorm', 'testimonials', 'contact', 'seo-tools', 'privacy', 'admin'];
const PUBLIC_ROUTES = ROUTES.filter(r => r !== 'admin');

for (const route of ROUTES) {
  const dir = join(DIST, route);
  mkdirSync(dir, { recursive: true });
  copyFileSync(join(DIST, 'index.html'), join(dir, 'index.html'));
}

const today = new Date().toISOString().slice(0, 10);
const urls = ['', ...PUBLIC_ROUTES]
  .map(r => `  <url><loc>${SITE}/${r}</loc><lastmod>${today}</lastmod><changefreq>${r === '' || r === 'blog' ? 'weekly' : 'monthly'}</changefreq><priority>${r === '' ? '1.0' : '0.7'}</priority></url>`)
  .join('\n');
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cms\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`postbuild: ${ROUTES.length} route entry points, sitemap.xml, robots.txt`);
