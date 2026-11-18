/**
 * URL de la app. Se puede cambiar con `APP_URL` sin tocar los componentes.
 * En producción es `https://app.umbrallab.es`.
 */
const configured = (import.meta.env.APP_URL as string | undefined) ?? process.env.APP_URL;

export const APP_URL = (configured || 'https://app.umbrallab.es').replace(/\/+$/, '');

/** Acceso para quien ya tiene cuenta. El registro sigue cerrado. */
export const APP_LOGIN_URL = `${APP_URL}/login`;
