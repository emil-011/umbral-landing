import type { APIRoute } from 'astro';

export const prerender = true;

/* Landings por deporte y guías de la fase 2. Suma aquí las rutas nuevas. */
const pages: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/triatlon/', priority: '0.9', changefreq: 'monthly' },
  { path: '/atletismo/', priority: '0.9', changefreq: 'monthly' },
  { path: '/natacion/', priority: '0.9', changefreq: 'monthly' },
  { path: '/ciclismo/', priority: '0.9', changefreq: 'monthly' },
  { path: '/duatlon/', priority: '0.8', changefreq: 'monthly' },
  { path: '/acuatlon/', priority: '0.8', changefreq: 'monthly' },
  { path: '/entrenamiento/', priority: '0.9', changefreq: 'monthly' },
  { path: '/para-clubes/', priority: '0.8', changefreq: 'monthly' },
  { path: '/para-entrenadores/', priority: '0.8', changefreq: 'monthly' },
  { path: '/guias/zonas-de-entrenamiento/', priority: '0.8', changefreq: 'monthly' },
  { path: '/guias/carga-de-entrenamiento/', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacidad/', priority: '0.2', changefreq: 'yearly' },
  { path: '/aviso-legal/', priority: '0.2', changefreq: 'yearly' },
];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(process.env.SITE_URL || 'https://umbrallab.es');
  const urls = pages
    .map((page) => {
      const loc = new URL(page.path, base).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
