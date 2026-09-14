import { site, toolPages } from '@/lib/site';
export default function sitemap() {
  const routes = ['', '/pricing', '/safety', '/recovery', ...toolPages.map((item) => item.href)];
  return routes.map((route) => ({ url: `${site.url}${route}`, lastModified: new Date(), changeFrequency: route ? 'weekly' : 'daily', priority: route ? 0.8 : 1 }));
}
