/**
 * Datos del titular que aparecen en la política de privacidad y en el aviso
 * legal. Cambia aquí y se actualizan las dos páginas.
 *
 * `nif` y `address` son obligatorios en el aviso legal de una web española.
 * Si están vacíos, la línea no se renderiza: rellénalos antes de publicar.
 */
export const LEGAL = {
  appName: 'Umbral',
  holder: 'Emilio Fernández Gallardo',
  nif: '',
  address: '',
  email: 'solicitudes@umbrallab.es',
  siteUrl: 'https://umbrallab.es',
  appUrl: 'https://app.umbrallab.es',
  updatedAt: '24 de noviembre de 2026',
} as const;
