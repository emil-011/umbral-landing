import { defineMiddleware } from 'astro:middleware';

/**
 * La app (app.umbrallab.es) deja una cookie de sesión en `.umbrallab.es` al iniciar
 * sesión. Si alguien entra en la landing con esa cookie, no tiene sentido enseñarle
 * la página pública: lo mandamos directo a la app.
 *
 * La cookie es solo una pista (HttpOnly, sin datos de sesión). La app sigue siendo
 * la que valida el token; si ya caducó, allí se pide login con normalidad.
 */
const APP_URL =
  (import.meta.env.APP_URL as string | undefined) ??
  process.env.APP_URL ??
  'https://app.umbrallab.es';
const SESSION_COOKIE = 'umbral_session';

export const onRequest = defineMiddleware((context, next) => {
  const isHome =
    context.url.pathname === '/' || context.url.pathname === '/index.html';

  // `?landing=1` y `?static` permiten ver la landing aunque haya sesión: el
  // segundo ya se usa para capturas y QA sin animaciones.
  const forceLanding =
    context.url.searchParams.has('landing') || context.url.searchParams.has('static');

  // En local la cookie de la app y la de la landing comparten host (`localhost`),
  // así que redirigir aquí solo estorba al desarrollar. `import.meta.env.DEV`
  // distingue `astro dev` del servidor compilado, que es el que corre en producción.
  const isDev = import.meta.env.DEV;

  if (isHome && !forceLanding && !isDev && context.cookies.get(SESSION_COOKIE)) {
    return context.redirect(APP_URL, 302);
  }

  return next();
});
