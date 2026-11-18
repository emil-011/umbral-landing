# SEO de Umbral

Documento de trabajo de la landing. Resume la investigación, lo que ya está
implementado en la home y lo que habría que hacer después para competir por
términos de categoría. Última revisión: noviembre de 2026.

- **Dominio canónico actual:** `https://umbrallab.es`
- **App:** `https://app.tritrain.es`
- **Marca:** Umbral, nueva identidad de tritrain
- **Idioma:** español (España)

---

## 1. Resumen ejecutivo

La home ya está preparada para:

1. **Defender la marca** (`umbral`, `umbral app`, `umbral entrenamiento`,
   `umbral tritrain`) y aclarar la relación con tritrain.
2. **Posicionar la categoría** con contenido real de triatlón, atletismo,
   natación, ciclismo, duatlón y aquatlón: título, `H1`, sección de disciplinas,
   definición, FAQ y datos estructurados.
3. **Ser rastreada e indexada correctamente**: canonical, `robots.txt`,
   `sitemap.xml`, Open Graph, JSON-LD y dominio configurable.

La limitación principal es estructural: **una sola URL no puede competir con
autoridad por «triatlón», «atletismo» o «entrenamiento»**. Esos términos los
ganan webs con decenas o cientos de páginas que cubren la intención de búsqueda
durante años. Lo que se ha hecho ahora es dejar la base técnica y el contenido
de la home listos; para atacar esos términos de forma realista hace falta la
fase 2 (landings por deporte y guías), descrita en el apartado 7.

---

## 2. Qué dice la evidencia

### 2.1 Contenido útil y E-E-A-T

Google insiste en contenido **útil, fiable y pensado para personas**, no en
trucos de palabras clave. Para un producto como Umbral, eso significa:

- Explicar capacidades **reales** de la app, sin inventar funciones.
- Enseñar criterio: qué es el umbral, cómo se calculan las zonas, cómo se lee la
  carga, qué hacer con los datos.
- Mostrar experiencia y autoridad: autoría, metodología, capturas reales,
  enlaces a la app y a la política de privacidad.
- Evitar páginas puerta, texto duplicado y afirmaciones genéricas sin respaldo.

Fuente: [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### 2.2 Títulos y snippets

Google usa el `<title>`, el `H1` y los enlaces internos para generar el título
del resultado, y puede reescribirlo. Por eso el título de la home combina marca
y categoría (`Umbral - App de entrenamiento para triatlón y atletismo`) y la
descripción concreta el público y las funciones. No conviene forzar 20 palabras
clave en el título: Google lo reescribirá y perderá claridad.

Fuente: [Influencing title links in Google Search](https://developers.google.com/search/docs/appearance/title-link).

### 2.3 Datos estructurados

El JSON-LD **no es un factor de posicionamiento directo**, pero ayuda a que
Google entienda la entidad y puede habilitar resultados enriquecidos. En la home
se declaran:

- `Organization` (marca, logo, qué sabe hacer).
- `WebSite` (nombre, idioma, publisher).
- `WebPage` (URL, descripción, imagen principal).
- `WebApplication` (categoría, sistema, funciones, audiencia).
- `FAQPage` (las mismas preguntas visibles).

Aviso importante: Google **restringió los resultados enriquecidos de FAQ** a
webs gubernamentales y de salud en 2023. Mantener `FAQPage` sigue siendo útil
para comprensión semántica y para asistentes de IA, pero no se debe prometer una
caja de FAQ en Google.

Fuentes: [Software app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app),
[FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage),
[nota de retirada del rich result de FAQ](https://developers.google.com/search/updates#removing-faq-rich-result).

### 2.4 IA generativa y AI Overviews

Google publicó una guía específica de optimización para IA generativa. La idea
central no es un archivo mágico ni `llms.txt`: es el mismo contenido útil, bien
estructurado, con respuestas claras y datos propios. Para Umbral conviene:

- Definiciones cortas y directas al principio de cada sección.
- Datos concretos y verificables (fórmulas ECO/ECS/TSS, disciplinas, tests).
- Tablas y listas cuando ayuden a comparar.
- Entidades bien definidas: Umbral, tritrain, cada deporte, cada métrica.

No se ha añadido `llms.txt` porque no es un estándar exigido por Google y no
sustituye al contenido ni a los enlaces.

Fuente: [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

### 2.5 Core Web Vitals

Los umbrales que conviene vigilar en el percentil 75, tanto en móvil como en
escritorio:

| Métrica | Bien | Necesita mejorar | Mal |
|---|---|---|---|
| LCP | ≤ 2,5 s | 2,5–4,0 s | > 4,0 s |
| INP | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS | ≤ 0,1 | 0,1–0,25 | > 0,25 |

La home parte con ventaja: el hero no usa imágenes raster, las tipografías van
autoalojadas y precargadas, y las animaciones no condicionan el contenido. Hay
que medir con datos de campo (CrUX/Search Console) cuando haya tráfico real, no
solo con Lighthouse.

Fuente: [Web Vitals](https://web.dev/articles/vitals).

### 2.6 Competencia observada en la SERP

Búsquedas reales en España (DuckDuckGo, noviembre de 2026) muestran dos frentes:

- **«umbral»** está ocupado por [Umbral Team](https://umbralteam.com/)
  (asesoría de triatlón), [Planeta Triatlón](https://planetatriatlon.com/calcular-los-umbrales-entrenamiento/),
  calculadoras de umbral láctico y artículos de método. Es un término genérico y
  con colisión de marca: la home debe ganar sobre todo `umbral app`,
  `umbral entrenamiento` y `umbral tritrain`.
- **«app entrenamiento triatlón»** y **«software club atletismo»** tienen
  competidores consolidados: [TriElite](https://trielite.app/es),
  [trisync](https://trisync.app/), [Nolio](https://www.nolio.io/es/triatlon/),
  [TrainerPlan](https://trainerplan.co/es/), [GoToGoal](https://gotogoal.es/),
  [Training Track](https://www.trainingtrack.es/) y
  [Atletismo.app](https://www.atletismo.app/), entre otros.

Conclusión: la home puede plantar cara en marca y en frases de cola media
(«app de entrenamiento para triatlón y atletismo», «software para clubes de
triatlón»), pero no en la cabeza de «triatlón» o «atletismo» sin más páginas y
sin autoridad externa.

### 2.7 Checklist on-page aplicada

Se han seguido los puntos que la industria considera críticos: un `H1` único,
jerarquía de encabezados, título y descripción únicos, URLs limpias, canonical,
enlaces internos descriptivos, datos estructurados, sitemap, robots, contenido
original, imágenes sociales y rendimiento. Referencia:
[On-page SEO checklist de Semrush](https://www.semrush.com/blog/on-page-seo-checklist/).

---

## 3. Mapa de palabras clave

No se han inventado volúmenes de búsqueda: no hay contratada una herramienta de
keywords. La tabla es una hipótesis de intención y competencia que hay que
validar con Search Console, Semrush, Ahrefs o Keyword Planner.

| Cluster | Consulta principal | Secundarias | Intención | URL actual | Siguiente paso |
|---|---|---|---|---|---|
| Marca | `umbral app` | `umbral entrenamiento`, `umbral tritrain`, `tritrain umbral` | Navegacional | `/` | Reforzar con enlaces externos y perfiles |
| Marca | `umbral triatlón` | `umbral atletismo`, `umbral club` | Navegacional | `/` | Contenido de marca y notas de prensa |
| Categoría | `app entrenamiento triatlón` | `app triatlón entrenadores`, `software club triatlón` | Comercial | `/` (parcial) | Landing `/triatlon` |
| Categoría | `app entrenamiento atletismo` | `software club atletismo`, `app entrenadores atletismo` | Comercial | `/` (parcial) | Landing `/atletismo` |
| Categoría | `app entrenamiento natación` | `tests natación`, `zonas natación` | Comercial | `/` (parcial) | Landing `/natacion` |
| Categoría | `app entrenamiento ciclismo` | `zonas potencia`, `TSS ciclismo` | Comercial | `/` (parcial) | Landing `/ciclismo` |
| Nicho | `app duatlón` | `plan duatlón`, `carga duatlón` | Comercial | `/` (parcial) | Landing `/duatlon` |
| Nicho | `app aquatlón` | `plan aquatlón` | Comercial | `/` (parcial) | Landing `/aquatlon` |
| Informacional | `zonas de entrenamiento` | `zonas triatlón`, `zonas carrera`, `zonas natación` | Informacional | FAQ | Guía `/guias/zonas-de-entrenamiento` |
| Informacional | `test de umbral` | `test umbral lactato`, `test 30 minutos`, `umbral anaeróbico` | Informacional | FAQ | Guía `/guias/test-de-umbral` |
| Informacional | `carga de entrenamiento` | `TSS`, `CTL`, `ATL`, `TSB`, `ECO`, `ECS` | Informacional | FAQ + sección Carga | Guía `/guias/carga-de-entrenamiento` |
| Informacional | `plan de entrenamiento triatlón` | `plan triatlón sprint`, `plan triatlón olímpico` | Informacional | — | Guía con descargable |
| Long tail | `cómo calcular zonas de entrenamiento triatlón` | `test de 30 minutos`, `ritmo umbral` | Informacional | — | Guía + calculadora |
| Long tail | `software para clubes de atletismo` | `gestión de grupos`, `fichas de atleta` | Comercial | `/` (parcial) | Landing `/para-clubes` |

**Prioridad recomendada (fase 2):** `/triatlon` → `/atletismo` →
`/entrenamiento` (hub) → guías de zonas, test y carga → `/natacion` y
`/ciclismo` → `/duatlon` y `/aquatlon`.

---

## 4. Qué se ha implementado en la home

### 4.1 Metadatos y rastreo

- `astro.config.mjs`: `site` configurable por `SITE_URL`, por defecto
  `https://umbrallab.es`.
- `src/layouts/Layout.astro`:
  - `title` y `description` orientados a «app de entrenamiento para triatlón y
    atletismo», con natación y ciclismo en la descripción.
  - `canonical` absoluto, `hreflang="es"` y `x-default`.
  - `robots` con `max-image-preview:large`, `max-snippet:-1`.
  - Open Graph y Twitter con URL e imagen absolutas (`/og.png`, 1200 × 630).
  - `apple-touch-icon` y nombre de aplicación.
  - JSON-LD con `Organization`, `WebSite`, `WebPage` y `WebApplication`.
- `src/pages/sitemap.xml.ts`: sitemap generado con el dominio canónico.
- `src/pages/robots.txt.ts`: `Allow: /`, `Disallow: /api/` y URL del sitemap.
- `src/components/Faq.astro`: `FAQPage` generado desde las preguntas visibles.
- `public/brand/umbral-logo-512.png` y `apple-touch-icon.png`: logo cuadrado para
  Organization y dispositivos Apple.

### 4.2 Contenido y enlazado interno

- **Hero:** kicker «App de entrenamiento · clubes, entrenadores y atletas» y
  lead con la frase exacta «Entrenamiento de triatlón, atletismo, natación y
  ciclismo».
- **Nueva sección «Disciplinas»** (`src/components/Disciplinas.astro`):
  definición de Umbral como app de tritrain, seis tarjetas con `H3` para
  triatlón, atletismo, natación, ciclismo, duatlón y aquatlón, y anclas
  `#triatlon`, `#atletismo`, `#natacion`, `#ciclismo`, `#duatlon` y `#aquatlon`.
- **Renumeración** de las secciones 02–10 para mantener el orden visual.
- **FAQ ampliada:** qué es Umbral y su relación con tritrain, zonas de
  entrenamiento, club de triatlón o atletismo, y cobertura de deportes.
- **Navegación y pie:** enlace «Deportes» y columna «Deportes» con enlaces
  descriptivos a cada ancla; «Cómo funciona» en el pie.

### 4.3 Rendimiento y accesibilidad

- Sin imágenes raster en el hero: todo SVG y CSS.
- Tipografías autoalojadas y precargadas; `font-display: swap`.
- `prefers-reduced-motion` y `?static` siguen funcionando.
- Un solo `H1`, secciones con `aria-labelledby`, enlaces con texto descriptivo.
- Comprobado sin desbordamiento horizontal a 320, 360, 390, 414, 620, 768, 900,
  980, 1080, 1100, 1200, 1280, 1440 y 1920 px.

### 4.4 Comprobaciones realizadas

- `bun run build` correcto.
- `title`, `description`, `canonical`, `robots`, OG y Twitter presentes.
- Un `H1`; `H2` con la frase «Entrenamiento de triatlón, atletismo, natación y
  ciclismo».
- Dos bloques JSON-LD válidos (`@graph` y `FAQPage`).
- `sitemap.xml` con `https://umbrallab.es/` y `robots.txt` con el sitemap.
- Sin errores de consola ni overflow horizontal en los anchos probados.

---

## 5. Migración de dominio

Ahora el canónico es `umbrallab.es`. Cuando se traslade `tritrain.es` a Umbral:

1. **Decidir el dominio final** y no cambiar dos veces seguidas. Si la app sigue
   en `app.tritrain.es`, valorar `app.umbrallab.es` o mantener la app y redirigir
   solo la web.
2. **Configurar 301** de cada URL antigua a su equivalente nueva. No usar 302
   ni redirigir todo a la home. Mantener la estructura de rutas.
3. **Actualizar `SITE_URL`** en el entorno de producción y reconstruir. Canonical,
   sitemap, robots y JSON-LD se actualizan solos.
4. **Verificar ambas propiedades** en Search Console. Si es un cambio de sitio,
   usar la herramienta de cambio de dirección y conservar los 301 al menos un
   año.
5. **Enviar el nuevo sitemap** y comprobar la cobertura de indexación.
6. **Actualizar enlaces externos**: redes, directorios de clubes, notas de
   prensa, firmas de correo, app y documentación.
7. **Comprobar redirecciones encadenadas, 404 y duplicados**. Evitar que el
   dominio antiguo y el nuevo sirvan la misma home sin canonical.
8. **Vigilar durante 8–12 semanas**: impresiones, clics, consultas de marca,
   páginas indexadas y errores de rastreo.

Si `tritrain.es` no está indexado (ahora mismo no resuelve DNS), el riesgo es
bajo y basta con 301 + sitemap + enlaces. Si más adelante se decide que
`umbrallab.es` sea el dominio definitivo y `tritrain.es` solo un alias, hay que
mantener el 301 de forma indefinida.

Fuentes: [301 redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects),
[consolidar URLs duplicadas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

---

## 6. Medición

### 6.1 Search Console

- Verificar la propiedad de dominio (DNS), no solo el prefijo de URL.
- Enviar `https://umbrallab.es/sitemap.xml`.
- Inspeccionar la home y pedir indexación la primera vez.
- Revisar semanalmente: consultas, impresiones, CTR, posición media, páginas
  indexadas, errores de rastreo y Core Web Vitals.
- Revisar los informes de mejoras (FAQ, Software App). Si Google no muestra el
  rich result, no es un error: puede ser elegibilidad.

### 6.2 Analítica y conversión

- Medir el formulario de acceso como evento (envío correcto, error, rol).
- Etiquetar campañas con UTM para distinguir marca, contenido y enlaces.
- Comparar conversión de marca vs. categoría: no todo el tráfico orgánico vale
  lo mismo.

### 6.3 KPIs y plazos realistas

| KPI | Qué mide | Plazo orientativo |
|---|---|---|
| Indexación de la home | Que Google la tenga | 1–4 semanas |
| Consultas de marca | `umbral app`, `umbral entrenamiento` | 2–8 semanas |
| Clics de marca | Tráfico navegacional | 1–3 meses |
| Consultas de categoría | `app entrenamiento triatlón` | 3–6 meses |
| Clics de categoría | Tráfico comercial | 4–9 meses |
| Términos genéricos | `triatlón`, `atletismo` | 6–12+ meses y con autoridad |

No hay garantía de posición. Los plazos dependen de autoridad, competencia,
frecuencia de publicación y enlaces.

---

## 7. Fase 2: landings y guías (cuando se apruebe)

No están implementadas. Esta es la propuesta para cuando se quiera competir de
verdad por los términos de categoría.

### 7.1 Landings por deporte

| URL | `H1` | Contenido mínimo |
|---|---|---|
| `/triatlon` | App de entrenamiento para triatlón | Zonas de natación, bici y carrera; plan en texto libre; ECO/ECS; tests; Garmin/Polar/Wahoo; clubes; FAQ |
| `/atletismo` | App de entrenamiento para atletismo | Ritmos por zona, tests de carrera, RPE, carga, grupos y fichas; FAQ |
| `/natacion` | App de entrenamiento para natación | Tests por distancia, curva, series y descansos, zonas; FAQ |
| `/ciclismo` | App de entrenamiento para ciclismo | Vatios, FTP, zonas, TSS, actividades; FAQ |
| `/duatlon` | App de entrenamiento para duatlón | Bloques, carga, plan del club; FAQ |
| `/aquatlon` | App de entrenamiento para aquatlón | Tests de natación y carrera, zonas, seguimiento; FAQ |
| `/entrenamiento` | Software de entrenamiento para entrenadores | Hub que enlaza a las landings y a las guías |
| `/para-clubes` | Software para clubes de triatlón y atletismo | Grupos, invitaciones, roles, fichas, privacidad |
| `/para-entrenadores` | App para entrenadores de resistencia | Plan, carga, tests, seguimiento por atleta |

Cada landing debe tener:

- `H1` propio y una definición clara en las primeras 100 palabras.
- 800–1.200 palabras reales, sin copiar y pegar entre deportes.
- Capturas reales de la app de ese deporte.
- 4–8 FAQ con schema `FAQPage`.
- Enlaces internos a la home, a otras landings y a la guía relacionada.
- `canonical`, `title`, `description`, OG y entrada en el sitemap.
- Datos estructurados de `WebPage` y, si aplica, `SoftwareApplication`.

### 7.2 Guías informacionales

Prioridad:

1. `/guias/zonas-de-entrenamiento` — qué son, cómo se calculan, tabla por deporte.
2. `/guias/test-de-umbral` — protocolos de campo y laboratorio, LT1/LT2.
3. `/guias/carga-de-entrenamiento` — ECO, ECS, TSS, CTL, ATL, TSB con ejemplos.
4. `/guias/plan-triatlon-sprint` — plan de 8 semanas con sesiones.
5. `/guias/plan-atletismo-10k` — plan de 8 semanas.
6. `/guias/natacion-tecnica-y-series` — series y ritmos.

Cada guía debe enlazar a la landing del deporte y al acceso, y usar datos
propios (no copiar artículos de la competencia). Las guías son el motor de
tráfico informacional; las landings capturan la intención comercial.

### 7.3 Calendario de 8 semanas

| Semana | Entregable |
|---|---|
| 1 | `/triatlon` + enlaces desde home y pie |
| 2 | `/atletismo` + enlaces cruzados |
| 3 | `/entrenamiento` (hub) + `/para-clubes` |
| 4 | Guía de zonas + enlaces a landings |
| 5 | Guía de test de umbral |
| 6 | Guía de carga |
| 7 | `/natacion` y `/ciclismo` |
| 8 | `/duatlon`, `/aquatlon` y revisión de enlaces internos |

### 7.4 Qué evitar

- Páginas clonadas cambiando solo la palabra «triatlón» por «atletismo».
- Texto oculto, listas de keywords o enlaces comprados.
- Reseñas o valoraciones inventadas.
- Funciones que la app no tiene.
- Publicar 20 páginas de golpe sin contenido real.
- `llms.txt` como sustituto de contenido o enlaces.

---

## 8. Autoridad y off-page

La home y las futuras landings necesitan enlaces y menciones. Prioridades:

1. **Clubes y entrenadores reales** que usen Umbral: páginas de partners,
   testimonios verificables y casos de uso.
2. **Directorios y federaciones**: listados de software para clubes, asociaciones
   de triatlón y atletismo, programas de entrenadores.
3. **Contenido original**: estudios con datos agregados y anónimos (carga media
   por disciplina, distribución de zonas, cumplimiento de planes). Es el activo
   que más enlaces naturales atrae.
4. **Medios especializados**: Planeta Triatlón, TriathlonHealth, 220 Triathlon,
   podcasts de resistencia. Enviar datos, no notas de prensa vacías.
5. **Perfiles de marca**: LinkedIn, Instagram, YouTube, GitHub si aplica. Enlazar
   desde la web y desde los perfiles.
6. **Google Business Profile** solo si hay negocio local o sede física; no forzar
   un perfil si no corresponde.

No comprar enlaces ni participar en redes de enlaces. A corto plazo puede
funcionar; a medio plazo es un riesgo.

---

## 9. Riesgos y notas

- **«Umbral» es genérico.** Compite con Umbral Team y con artículos sobre el
  umbral fisiológico. La marca necesita siempre el contexto «app» o
  «entrenamiento» en los contenidos.
- **El dominio `.es` parte sin autoridad.** `umbrallab.es` ya está desplegada
  en la VM con HTTPS y el registro `A` apunta a `80.225.190.5`. Falta verificar
  la propiedad en Search Console y enviar el sitemap. La velocidad de
  posicionamiento dependerá de enlaces y contenido, no solo del código.
- **Los rich results de FAQ no están garantizados.** El schema se mantiene por
  comprensión, no por apariencia.
- **AI Overviews pueden reducir clics.** La defensa es marca, conversión directa
  y contenido con datos que no se puedan resumir sin citar.
- **La política de privacidad y el aviso legal** deben ser accesibles y estar
  enlazados. Al quitar los enlaces públicos a la app, el pie ya no apunta a
  `app.tritrain.es/privacidad`; conviene publicar `/privacidad` y `/aviso-legal`
  propios en `umbrallab.es`.
- **El formulario es el objetivo.** Todo el SEO debe llevar a `#acceso` o a la
  app; el tráfico sin conversión no es un resultado.

---

## 10. Fuentes consultadas

- [Google: contenido útil, fiable y centrado en personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: optimización para funciones de IA generativa](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: influir en los title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google: datos estructurados de Software App](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- [Google: FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Google: retirada del rich result de FAQ](https://developers.google.com/search/updates#removing-faq-rich-result)
- [Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: redirecciones 301](https://developers.google.com/search/docs/crawling-indexing/301-redirects)
- [Google: consolidar URLs duplicadas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [web.dev: Web Vitals](https://web.dev/articles/vitals)
- [Semrush: checklist on-page 2026](https://www.semrush.com/blog/on-page-seo-checklist/)
- [Schema.org: WebApplication](https://schema.org/WebApplication)
- SERP de referencia: [Umbral Team](https://umbralteam.com/),
  [Planeta Triatlón](https://planetatriatlon.com/calcular-los-umbrales-entrenamiento/),
  [TriElite](https://trielite.app/es), [trisync](https://trisync.app/),
  [Nolio](https://www.nolio.io/es/triatlon/),
  [TrainerPlan](https://trainerplan.co/es/), [GoToGoal](https://gotogoal.es/),
  [Training Track](https://www.trainingtrack.es/),
  [Atletismo.app](https://www.atletismo.app/).

---

## 11. Registro de cambios

- **2026-11-16:** auditoría inicial de la home; metadatos, canonical, robots,
  sitemap, JSON-LD, sección de disciplinas, FAQ ampliada, enlaces internos,
  logos sociales y documento de estrategia.
