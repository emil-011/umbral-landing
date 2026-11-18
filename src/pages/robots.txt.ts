import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL(process.env.SITE_URL || 'https://umbrallab.es');
  const sitemap = new URL('/sitemap.xml', base).href;

  const body = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
