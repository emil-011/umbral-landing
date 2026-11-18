import type { APIRoute } from 'astro';

export const prerender = false;

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const ROLES = new Set(['club', 'trainer', 'athlete']);
const ROLE_LABELS: Record<string, string> = {
  club: 'Club',
  trainer: 'Entrenador/a',
  athlete: 'Atleta',
};

/** Límite sencillo en memoria: 5 solicitudes cada 10 minutos por IP. */
const buckets = new Map<string, { count: number; reset: number }>();

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function allowed(ip: string) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return true;
  }
  if (bucket.count >= 5) return false;
  bucket.count += 1;
  return true;
}

/* En producción las variables se leen del proceso (systemd EnvironmentFile),
   no del bundle: así un cambio de correo o de API key no exige recompilar.
   En desarrollo se mantiene import.meta.env, que es lo que carga Astro. */
const readEnv = (key: string): string | undefined =>
  import.meta.env.PROD
    ? process.env[key]
    : (import.meta.env as unknown as Record<string, string | undefined>)[key];

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const apiKey = readEnv('RESEND_API_KEY');
  if (!apiKey) {
    console.error('[waitlist] RESEND_API_KEY no está configurada');
    return json({ error: 'El formulario no está configurado.' }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Petición inválida.' }, 400);
  }

  // Honeypot: si un bot rellena este campo, no hacemos nada.
  if (typeof body.website === 'string' && body.website.trim()) {
    return json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const role = typeof body.role === 'string' && ROLES.has(body.role) ? body.role : 'club';
  const source = typeof body.source === 'string' ? body.source.slice(0, 500) : '';
  const timestamp = typeof body.ts === 'string' ? body.ts : new Date().toISOString();

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Ese correo no parece válido.' }, 400);
  }

  if (!allowed(clientAddress ?? 'unknown')) {
    return json({ error: 'Demasiadas solicitudes. Inténtalo en unos minutos.' }, 429);
  }

  const recipients = (readEnv('WAITLIST_TO') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.error('[waitlist] WAITLIST_TO no está configurado');
    return json({ error: 'El formulario no está configurado.' }, 500);
  }

  // Resend es el remitente, no un buzón. `from` debe ser un remitente de un
  // dominio verificado en Resend; `onboarding@resend.dev` solo sirve para
  // pruebas y únicamente entrega al correo de la cuenta.
  const from = readEnv('WAITLIST_FROM') ?? 'Umbral <onboarding@resend.dev>';
  const roleLabel = ROLE_LABELS[role] ?? role;
  const safeEmail = escapeHtml(email);
  const safeSource = escapeHtml(source);
  const safeTimestamp = escapeHtml(timestamp);

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#191a18;line-height:1.5">
      <h2 style="margin:0 0 12px">Nueva solicitud de acceso</h2>
      <p style="margin:0 0 6px"><strong>Correo:</strong> ${safeEmail}</p>
      <p style="margin:0 0 6px"><strong>Rol:</strong> ${escapeHtml(roleLabel)}</p>
      <p style="margin:0 0 6px"><strong>Origen:</strong> ${safeSource || '—'}</p>
      <p style="margin:0;color:#6d6a62"><strong>Fecha:</strong> ${safeTimestamp}</p>
    </div>
  `;

  const text = [
    'Nueva solicitud de acceso',
    `Correo: ${email}`,
    `Rol: ${roleLabel}`,
    `Origen: ${source || '—'}`,
    `Fecha: ${timestamp}`,
  ].join('\n');

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: `Nueva solicitud de acceso · ${roleLabel}`,
        html,
        text,
        reply_to: email,
      }),
    });

    if (!response.ok) {
      console.error('[waitlist] Resend respondió', response.status, await response.text());
      return json({ error: 'No hemos podido registrar la solicitud.' }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error('[waitlist] Error llamando a Resend', error);
    return json({ error: 'No hemos podido registrar la solicitud.' }, 502);
  }
};
