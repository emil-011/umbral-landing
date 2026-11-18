// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Dominio canónico del sitio. Cámbialo con SITE_URL cuando la landing pase a
// otro dominio (por ejemplo, al mover tritrain.es a umbrallab.es) sin tocar
// canonical, sitemap, robots ni datos estructurados.
const site = process.env.SITE_URL || 'https://umbrallab.es';

// https://astro.build/config
export default defineConfig({
  site,
  adapter: node({ mode: 'standalone' }),
  // La barra flotante de desarrollo tapa la marquesina al hacer capturas.
  devToolbar: { enabled: false },
});
