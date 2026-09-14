import { site } from '@/lib/site';
export default function robots() { return { rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/history', '/login'] }, sitemap: `${site.url}/sitemap.xml` }; }
