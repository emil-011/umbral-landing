import type { APIRoute } from 'astro';

export const prerender = true;

/* Solo la home por ahora. Cuando se añadan landings por deporte o guías,
   basta con sumar sus rutas aquí para que entren en el sitemap. */
const pages = ['/'];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(process.env.SITE_URL || 'https://umbrallab.es');
  const urls = pages
    .map((path) => {
      const loc = new URL(path, base).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`;
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
