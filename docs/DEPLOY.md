# Despliegue de Umbral en umbrallab.es

Checklist para publicar la landing y el formulario. La web es Astro con
`@astrojs/node` en modo `standalone`: **no basta con subir HTML estático**, hace
falta un proceso Node para `/api/waitlist`.

- **Dominio:** `umbrallab.es` (DNS en Cloudflare)
- **Registrador:** Hostinger
- **Hosting:** Hostinger (plan con Node.js o VPS)
- **Correo:** Resend envía; un buzón real recibe

---

## 1. DNS en Cloudflare

1. En Hostinger, cambia los nameservers del dominio a los que te da Cloudflare.
2. En Cloudflare, añade los registros de la web:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A | `@` | IP del hosting de Hostinger | Proxied (naranja) si el SSL está resuelto |
| CNAME | `www` | `umbrallab.es` | Proxied |

3. En **SSL/TLS**, pon **Full (strict)**. El origen (Hostinger) debe tener un
   certificado válido: Let's Encrypt del panel o un Cloudflare Origin Certificate.
   Si todavía no lo tiene, usa **DNS only** hasta instalarlo; no dejes Flexible
   con un formulario.
4. No pongas en proxy los registros de correo (MX/TXT). Deben quedar en **DNS
   only** (nube gris).

Comprobación:

```sh
dig +short A umbrallab.es
dig +short CNAME www.umbrallab.es
curl -I https://umbrallab.es/
```

Si `dig` no devuelve nada, el dominio todavía no está apuntando a Cloudflare.
Ahora mismo `umbrallab.es` no resuelve.

---

## 2. Hosting Node en Hostinger

Hostinger soporta Astro en modo SSR en planes con Node.js (Business, Cloud o
VPS). Un plan shared sin Node no puede ejecutar el endpoint del formulario.
Guías oficiales:

- [Hostinger: Astro](https://docs.hostinger.com/node.js/overview-1/astro)
- [Astro: deploy en Hostinger](https://docs.astro.build/en/guides/deploy/hostinger/)
- [Hostinger: opciones de Node.js](https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/)

### Opción A: aplicación Node en hPanel

1. **Advanced → Node.js** → crear aplicación.
2. Versión de Node: **22** (el proyecto pide `>=22.23.4`; usa la 22 LTS más
   reciente que ofrezca el panel).
3. Directorio raíz: el del proyecto (o el del repo conectado).
4. Comando de build: `npm install && npm run build` (o `bun install --frozen-lockfile && bun run build` si el plan tiene Bun).
5. Archivo de entrada: `dist/server/entry.mjs`.
6. Variables de entorno:

```sh
SITE_URL=https://umbrallab.es
APP_URL=https://app.umbrallab.es
RESEND_API_KEY=re_...
WAITLIST_TO=solicitudes@umbrallab.es
WAITLIST_FROM="Umbral <no-reply@umbrallab.es>"
PUBLIC_WAITLIST_ENDPOINT=/api/waitlist
```

7. Arranque: `bun ./dist/server/entry.mjs` o `npm start` (el script usa Bun). Si solo hay Node: `npm run start:node`.
8. Reinicia la aplicación después de cambiar variables o dependencias.

El proyecto usa Bun en local, pero en Hostinger puedes usar npm: `npm install`
(resuelve las dependencias) y `npm run build`. El resultado sigue siendo el
mismo `dist/`.

### Opción B: VPS

```sh
# Bun 1.3+ y dependencias
bun install --frozen-lockfile
SITE_URL=https://umbrallab.es bun run build

# Arranque (ejemplo con systemd o pm2)
PORT=4321 HOST=0.0.0.0 bun ./dist/server/entry.mjs
# Si el servidor no tiene Bun: node ./dist/server/entry.mjs
```

Pon Nginx delante con proxy a `127.0.0.1:4321` y certificado Let's Encrypt. No
expongas el puerto de Node directamente.

### Si solo tienes hosting estático

La home se vería, pero el formulario devolvería error. Opciones:

- Subir de plan a uno con Node.
- Mantener la landing en Hostinger y el endpoint en un servicio Node aparte.
- Cambiar el formulario a un servicio externo (Formspree, Netlify Forms…) y
  quitar `/api/waitlist`.

---

## 3. Resend: enviar, no recibir

Resend es el servicio que **envía** el aviso. No es un buzón de entrada. El
flujo es:

```
Formulario → /api/waitlist → Resend → buzón de WAITLIST_TO
```

Por eso `WAITLIST_TO` debe ser un correo real. Si apunta a tu Gmail personal,
los avisos seguirán llegando ahí.

### Verificar el dominio

1. En Resend, **Domains → Add domain** → `umbrallab.es`.
2. Copia los registros que te da el panel a Cloudflare. Habitualmente:
   - MX en `send.umbrallab.es` → `feedback-smtp.<región>.amazonses.com`
   - TXT en `send.umbrallab.es` → `v=spf1 include:amazonses.com ~all`
   - TXT en `resend._domainkey.umbrallab.es` → la clave DKIM
3. Todos en **DNS only** (nube gris). No los proxifiques.
4. Espera a que Resend marque el dominio como **Verified**.
5. Crea una API key de envío y guárdala solo en las variables de Hostinger.

Los registros de Resend van en subdominios (`send` y `resend._domainkey`), así
que **no chocan con el MX de recepción** de la raíz. Puedes recibir en
`solicitudes@umbrallab.es` y enviar con Resend desde el mismo dominio.

### Remitente

Con el dominio verificado:

```sh
WAITLIST_FROM="Umbral <no-reply@umbrallab.es>"
```

`onboarding@resend.dev` es solo para pruebas y **solo entrega al correo de la
cuenta de Resend**. Eso explica que los avisos hayan llegado a tu correo
personal: no es el destino que hayas puesto, es la restricción del remitente de
prueba.

### Seguridad

- No subas `.env` al repositorio.
- Si la API key ha estado expuesta, rótala en Resend y actualiza Hostinger.
- El endpoint ya pone el correo del solicitante como `reply_to`: al responder al
  aviso, respondes a la persona, no a `no-reply@`.

---

## 4. Buzón de recepción

Elige **una** de las dos opciones. No mezcles el MX de Cloudflare Email Routing
con un buzón de Hostinger en la misma raíz.

### Opción A: Cloudflare Email Routing (gratis)

1. Cloudflare → **Email → Email Routing** → activar para `umbrallab.es`.
2. Añadir dirección personalizada: `solicitudes@umbrallab.es` → tu Gmail.
3. Verifica el correo de destino.
4. Cloudflare añade los MX y el SPF de recepción en la raíz.
5. En Hostinger, pon `WAITLIST_TO=solicitudes@umbrallab.es`.

Ventaja: no necesitas buzón de Hostinger. Inconveniente: reenvía a tu Gmail; si
más adelante quieres bandeja propia, cambia a Hostinger Email.

### Opción B: buzón de Hostinger

1. Hostinger → **Emails** → crear `solicitudes@umbrallab.es`.
2. Usa los MX de Hostinger en Cloudflare (no actives Email Routing en la raíz).
3. `WAITLIST_TO=solicitudes@umbrallab.es`.

### DMARC

Añade un TXT en `_dmarc`:

```
v=DMARC1; p=none; rua=mailto:solicitudes@umbrallab.es
```

Empieza con `p=none` para observar, y endurece a `quarantine` cuando los
informes estén limpios. No publiques `p=reject` el primer día.

---

## 5. Después de publicar

1. `curl -I https://umbrallab.es/` → 200 y HTTPS válido.
2. `https://umbrallab.es/sitemap.xml` → una URL, `https://umbrallab.es/`.
3. `https://umbrallab.es/robots.txt` → sitemap correcto.
4. Prueba el formulario con un correo real y confirma que llega al buzón.
5. Search Console → propiedad de **dominio** → verificar por DNS → enviar
   `https://umbrallab.es/sitemap.xml` → inspeccionar la home.
6. Purga la caché de Cloudflare después de cada despliegue.
7. Comprueba que `SITE_URL` en Hostinger es exactamente `https://umbrallab.es`
   (sin barra final) y vuelve a desplegar si cambiaste el dominio.

Prueba manual del endpoint:

```sh
curl -X POST https://umbrallab.es/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"tu@correo.com","role":"club"}'
```

---

## 6. Problemas típicos

| Síntoma | Causa probable | Solución |
|---|---|---|
| El dominio no carga | Nameservers o A record | Revisar Cloudflare y `dig` |
| Error 502/503 | Proceso Node caído o puerto mal | Revisar logs y entrada `dist/server/entry.mjs` |
| El formulario devuelve 500 | Falta `RESEND_API_KEY` o `WAITLIST_TO` | Configurar variables y reiniciar |
| Resend 403 domain mismatch | `WAITLIST_FROM` no es del dominio verificado | Verificar dominio y cambiar el from |
| Los avisos solo llegan a tu correo | Sigues usando `onboarding@resend.dev` | Verificar dominio y usar `no-reply@umbrallab.es` |
| El correo llega a spam | Falta SPF/DKIM/DMARC | Revisar registros en Cloudflare |
| Bucle de redirecciones | SSL Flexible con HTTPS en origen | Poner Full (strict) |
| `www` no funciona | Falta CNAME | Añadir CNAME `www` → apex |
| El build falla por versión de Node | El panel ofrece una 22 antigua | Usar Node 22 LTS actualizado o VPS; el proyecto pide `>=22.23.4` |

---

## 7. Orden recomendado

1. Cloudflare DNS + SSL.
2. Hostinger Node app con las variables.
3. Verificar dominio en Resend.
4. Crear buzón/alias y probar el formulario.
5. Search Console y sitemap.
6. Solo después, pensar en landings y guías de la fase 2.

Fuentes: [Astro en Hostinger](https://docs.astro.build/en/guides/deploy/hostinger/),
[Hostinger Astro](https://docs.hostinger.com/node.js/overview-1/astro),
[Resend + Cloudflare](https://resend.com/docs/guides/dns/cloudflare),
[Cloudflare Email Routing](https://developers.cloudflare.com/email-service/get-started/route-emails/).

---

## 8. Estado del despliegue en la VM (17 nov 2026)

Ya está desplegado en la VM de tritrain, sin tocar `/opt/tritrain`:

- **VM:** Ubuntu 24.04, `80.225.190.5`, usuario `ubuntu`.
- **Bun:** 1.4.4 en `/usr/local/bin/bun`.
- **Aplicación:** `/opt/umbral-landing`.
- **Servicio:** `umbral-landing.service`, escuchando en `127.0.0.1:4321`.
- **Proxy:** Caddy, bloque `umbrallab.es` → `127.0.0.1:4321`; `www` redirige al apex.
- **Entorno:** `/opt/umbral-landing/.env` (permisos 600) con `SITE_URL=https://umbrallab.es`
  y `APP_URL=https://app.umbrallab.es`.
- **Build:** `SITE_URL=https://umbrallab.es bun --bun run build` (usar `--bun`; si no,
  Bun ejecuta Astro con el Node 20 del sistema y Astro lo rechaza).
- **Arranque:** `bun ./dist/server/entry.mjs` o `npm start`.
- **Verificación interna:** `http://127.0.0.1:4321/` devuelve 200.

### Estado público

El registro `A` de `umbrallab.es` ya apunta a `80.225.190.5` y Caddy emitió los
certificados de Let's Encrypt para `umbrallab.es` y `www.umbrallab.es`.

Comprobado el 17 nov 2026:

- `https://umbrallab.es/` → 200.
- `http://umbrallab.es/` → 308 a HTTPS.
- `https://www.umbrallab.es/` → 301 a `https://umbrallab.es/`.
- `https://umbrallab.es/sitemap.xml` y `/robots.txt` → 200.
- `https://app.tritrain.es/` y `https://dev.tritrain.es/` → 200 (sin tocar).
- HTML público: 0 enlaces a `app.tritrain.es`.

En Caddy, los assets con hash de `/_astro/*` se sirven con
`Cache-Control: public, max-age=31536000, immutable`; el HTML queda en
`max-age=0` para que los cambios se vean al momento.

El DNS sigue en **DNS only**. Si más adelante se activa el proxy de Cloudflare,
poner SSL/TLS en **Full (strict)**; el certificado de origen de Caddy es válido.
`www.umbrallab.es` debe seguir como CNAME a `umbrallab.es`.

### Operación diaria

```sh
cd /opt/umbral-landing
sudo systemctl status umbral-landing
sudo journalctl -u umbral-landing -f

# Tras cambiar variables del .env (correo, API key)
sudo systemctl restart umbral-landing

# Tras cambiar código
bun install --frozen-lockfile
SITE_URL=https://umbrallab.es bun --bun run build
sudo systemctl restart umbral-landing

# Tras cambiar el Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Los backups del Caddyfile están en `/etc/caddy/Caddyfile.bak-*`.
