# Umbral — landing

Landing pública de **Umbral**, la app de entrenamiento para clubes, entrenadores y
atletas de **triatlón, atletismo, natación y ciclismo**. También duatlón, acuatlón y
fuerza.

La página está construida sobre lo que la app hace hoy: tests y zonas propias, planes
en texto libre con ECO, panel semanal, actividades de Garmin/Polar/Wahoo, vueltas y
mapa, estadísticas de carga (ECOp/ECOr, ECS, TSS, forma) y clubes con grupos,
invitaciones y fichas de atleta.

## Qué hay en esta versión

- **Hero de producto.** Escenario oscuro con el dial de umbral (zonas, disciplinas y ritmo),
  el wordmark de Umbral y tarjetas de carga. El panel semanal real va justo debajo, con la
  agenda por días, sesiones, zonas, RPE y ECOs/ECSs.
- **Tres miradas.** Club, entrenador y atleta, con lo que cada rol puede hacer.
- **Disciplinas.** Triatlón, atletismo, natación, ciclismo, duatlón y acuatlón, cada uno con
  su landing propia, sus tests, zonas y carga, y enlaces directos desde el pie.
- **El club.** Cabecera del club, grupos expandibles y lista de miembros con su grupo y su rol.
- **La ficha.** Carrusel con pantallas reales de la app: ritmos de entrenamiento, estadísticas y tests del atleta, con flechas y puntos.
- **El plan.** Creador de entrenos real: plan semanal, entradas de texto libre, volumen por disciplina, reparto por fases y ECO por bloque.
- **Seguimiento.** Detalle de actividad: cabecera con estadísticas, plan frente a hecho,
  tiempo en zona, vueltas, gráfica de potencia/FC y mapa del recorrido.
- **La carga.** ECOp/ECOr, desviación, TSS, ECS y forma.
- **La idea, cómo funciona, preguntas y acceso anticipado.**

Los datos de los paneles son **de ejemplo** y están etiquetados como tales. Las
capacidades que se cuentan son las que existen hoy en la app. A propósito **no**
se incluyen tres cosas que la referencia anterior inventaba: comparador de carreras o
atletas, mapa de cumplimiento por club y carga agregada por grupo.

## Stack

- **Astro 7** con adaptador Node: landing estática y endpoint `/api/waitlist`.
- **GSAP 3.15** con `ScrollTrigger`, `SplitText` y `MotionPathPlugin`.
- **Lenis** para scroll suave, sincronizado con ScrollTrigger.
- Tipografías y marca autoalojadas (`public/fonts`, `public/brand`).

## Desarrollo

```sh
bun install
bun run dev
```

El servidor arranca en `http://localhost:4321`. Para que el formulario envíe correos,
copia `.env.example` a `.env` y rellena `RESEND_API_KEY` y `WAITLIST_TO`.

## Build

```sh
bun run build
bun run preview
```

En la VM de producción el Node del sistema es 20 y Astro pide 22.23.4: allí el
build se lanza con `bun --bun run build`, que ejecuta Astro dentro de Bun (Node
24 compatible).

El build usa el adaptador Node. En producción, arranca el servidor standalone:

```sh
npm start
# equivale a: bun ./dist/server/entry.mjs
```

## Estructura

```text
src/
├── components/              marca y secciones de la landing
├── layouts/Layout.astro      shell, metadatos, canonical, schema y movimiento
├── pages/index.astro         composición de la página
├── pages/triatlon, atletismo…    landings por deporte y guías
├── pages/api/waitlist.ts     endpoint server-side de Resend
├── pages/sitemap.xml.ts      sitemap generado con el dominio canónico
├── pages/robots.txt.ts       robots.txt con la URL del sitemap
├── scripts/app.ts            GSAP, Lenis, pestañas, copiar, formulario y menú
└── styles/landing.css        tokens, base y sistema visual completo
public/
├── brand/                    isotipo, logo social y apple-touch-icon
├── fonts/                    Manrope, Inter e IBM Plex Mono
└── og.png                    imagen social 1200 × 630
docs/                         capturas, estrategia SEO y despliegue
```

No hay versiones paralelas: una sola landing, una sola carpeta de componentes y una
sola hoja de estilos.

## Movimiento y accesibilidad

- `prefers-reduced-motion: reduce` desactiva GSAP y Lenis; todo el contenido queda
  visible y las pestañas siguen funcionando.
- `?static` fuerza la versión sin movimiento; sirve para capturas y QA.
- Si el bundle falla, el script retira la clase `js` y el contenido se muestra sin
  animaciones. No hay texto que dependa de que GSAP arranque.
- Los títulos se parten con SplitText, los números cuentan al entrar en pantalla y las
  barras y trazos SVG se dibujan. En el hero, el dial de zonas y los arcos de disciplina
  recorren su circunferencia, el núcleo respira y las tarjetas flotan; la marquesina
  inferior se mueve en CSS.
- La navegación por teclado funciona en pestañas (`←`, `→`, `Home`, `End`), menú
  móvil (`Esc`) y el formulario anuncia errores con `role="alert"`.

## Formulario de acceso

El formulario de acceso anticipado envía a `/api/waitlist`, un endpoint server-side que
usa **Resend** para avisar por correo. La API key nunca llega al navegador.

Resend **envía**, no recibe: `WAITLIST_TO` tiene que ser un buzón real (Hostinger o un
alias de Cloudflare Email Routing). Configura las variables en `.env` (ignorado por git):

```sh
SITE_URL=https://umbrallab.es
APP_URL=https://app.umbrallab.es
RESEND_API_KEY=re_...
WAITLIST_TO=solicitudes@umbrallab.es
WAITLIST_FROM="Umbral <no-reply@umbrallab.es>"
PUBLIC_WAITLIST_ENDPOINT=/api/waitlist
```

- `WAITLIST_FROM` debe ser un remitente de un dominio **verificado en Resend**. En
  producción no uses `onboarding@resend.dev`: ese remitente solo entrega al correo de la
  cuenta de Resend, por eso los avisos acaban en el correo personal.
- `WAITLIST_TO` puede ser un buzón de Hostinger o un alias gratuito de Cloudflare Email
  Routing que reenvíe a tu Gmail. En ese caso, el buzón `solicitudes@umbrallab.es` sigue
  siendo el destino visible para el formulario.
- Añade en Cloudflare los registros DKIM, SPF y MX que indique Resend, sin proxy (nube
  gris). Si usas Cloudflare Email Routing, no mezcles su MX en la raíz con un buzón de
  Hostinger: elige uno de los dos.
- El endpoint valida correo y rol, ignora un honeypot, limita a 5 solicitudes cada
  10 minutos por IP y pone el correo del solicitante como `reply_to`.
- En local, `bun run dev` sirve la landing y el endpoint a la vez.
- En producción, ejecuta `npm start` (arranca con Bun) o `bun ./dist/server/entry.mjs` con esas variables de entorno. Si el hosting solo tiene Node, usa `npm run start:node`.

## Sesión y redirección a la app

La app deja una cookie `umbral_session` en `.umbrallab.es` al iniciar sesión. La
landing la lee en `src/middleware.ts`: si existe, la home responde con un 302 a
`APP_URL` (`https://app.umbrallab.es`) en vez de enseñar la página pública.

- La cookie es solo una señal de "hay sesión"; no contiene tokens. La app sigue
  validando el JWT y, si caducó, pide login con normalidad.
- `?landing=1` (o `?static`) permite ver la landing aunque haya sesión. Es útil
  para revisarla o hacer capturas sin cerrar sesión.
- En local no se redirige: la cookie de la app y la de la landing comparten host.
- El registro está cerrado durante la demo. La app no crea cuentas nuevas, ni por
  email ni con Google; solo entran las cuentas que ya existen.

## Despliegue

El paso a paso de Cloudflare, Hostinger, Resend y Search Console está en
[`docs/DEPLOY.md`](docs/DEPLOY.md).

## SEO

La home está preparada para competir por búsquedas de marca y de categoría:

- **Metadatos.** `title` y `description` orientados a «app de entrenamiento para triatlón y
  atletismo», canonical absoluto, `robots`, Open Graph y Twitter con imagen absoluta.
- **Datos estructurados.** `Organization`, `WebSite`, `WebPage`, `WebApplication` y `FAQPage`
  en JSON-LD, construidos con los mismos datos visibles.
- **Rastreo.** `/sitemap.xml` y `/robots.txt` se generan con `SITE_URL`; `/api/` queda fuera
  del rastreo.
- **Contenido.** Landings de triatlón, atletismo, natación, ciclismo, duatlón y acuatlón,
  páginas para clubes y entrenadores, hub de entrenamiento, guías de zonas y carga,
  definición de Umbral, FAQ ampliada y enlaces internos desde la navegación y el pie.
- **Legal.** `/privacidad` y `/aviso-legal` con el titular, el contacto y los derechos de
  las personas usuarias; enlazadas desde el pie.
- **Rendimiento.** Sin imágenes de hero: SVG, tipografías autoalojadas y precargadas, y
  animaciones que no bloquean el contenido.

La estrategia completa, el mapa de palabras clave, el plan de landings futuras y la
migración de dominio están en [`docs/SEO.md`](docs/SEO.md). Para cambiar de dominio,
actualiza `SITE_URL` en el entorno y vuelve a compilar; canonical, sitemap, robots y schema
se actualizan solos.

## Capturas

- `docs/preview-desktop.png` — hero en escritorio.
- `docs/preview-mobile.png` — hero en móvil.
- `docs/preview-full.jpg` — página completa.
