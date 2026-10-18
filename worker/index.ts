// Kundengalerien: Anmelden mit Code, Fotos ansehen und herunterladen.
//
// Ablauf: Das Brautpaar schickt seinen Code an /api/galerie/anmelden. Stimmt er
// (Galerie in Sanity, Dataset „kunden“, aktiv und nicht abgelaufen), gibt es ein
// signiertes Token zurück. Mit dem Token im Query-Parameter `t` liefert der
// Worker die Fotos aus R2. Für Fotos braucht es danach keine Sanity-Abfrage mehr,
// weil Galerie und Ordner im Token stecken.

interface Env {
  FOTOS: R2Bucket;
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_TOKEN: string;
  GALERIE_SECRET: string;
}

interface Galerie {
  paar: string;
  slug: string;
  code: string;
  ordner?: string;
  datum?: string;
  ablauf?: string;
  aktiv?: boolean;
  hinweis?: string;
}

interface Zugang {
  /** Slug der Galerie */
  s: string;
  /** Ordner in R2 */
  o: string;
  /** gültig bis (ms) */
  e: number;
}

const TOKEN_DAUER = 12 * 60 * 60 * 1000;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const teile = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    try {
      if (teile[0] !== 'api' || teile[1] !== 'galerie') return json({ fehler: 'unbekannt' }, 404);

      if (teile[2] === 'anmelden' && request.method === 'POST') return await anmelden(request, env);

      const slug = teile[2];
      if (!slug || !['GET', 'HEAD'].includes(request.method)) return json({ fehler: 'unbekannt' }, 404);
      const zugang = await pruefeToken(url.searchParams.get('t'), slug, env);
      if (!zugang) return json({ fehler: 'zugang' }, 401);

      if (teile.length === 3) return json(await galerieInhalt(zugang, env));
      if (teile[3] === 'zip' && teile.length === 4) return await datei(request, env, `${zugang.o}/alle.zip`, `Anna-Ratz-${slug}.zip`);
      if ((teile[3] === 'web' || teile[3] === 'original') && teile.length === 5 && sichererName(teile[4])) {
        const name = teile[4];
        if (teile[3] === 'web') {
          // fehlt die kleine Version, zur Not das Original zeigen
          const web = await datei(request, env, `${zugang.o}/web/${name}`, null);
          return web.status === 404 ? datei(request, env, `${zugang.o}/original/${name}`, null) : web;
        }
        return await datei(request, env, `${zugang.o}/original/${name}`, url.searchParams.has('laden') ? name : null);
      }
      return json({ fehler: 'unbekannt' }, 404);
    } catch (e) {
      console.error(e);
      return json({ fehler: 'server' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;

async function anmelden(request: Request, env: Env): Promise<Response> {
  const eingabe = (await request.json().catch(() => ({}))) as { code?: unknown; slug?: unknown };
  const code = normalisiere(String(eingabe.code ?? ''));
  const slug = typeof eingabe.slug === 'string' ? eingabe.slug : '';
  if (code.length < 6) return json({ fehler: 'code' }, 401);

  const galerien = await sanity<Galerie[]>(
    env,
    `*[_type == "galerie" && !(_id in path("drafts.**"))]{paar, "slug": slug.current, code, ordner, datum, ablauf, aktiv, hinweis}`,
  );
  // Codes vergleichen statt in der Abfrage filtern: Schreibweise (Bindestrich,
  // Leerzeichen, klein/groß) ist egal.
  let treffer: Galerie | undefined;
  for (const g of galerien) {
    if ((!slug || g.slug === slug) && (await gleich(normalisiere(g.code ?? ''), code))) treffer = g;
  }
  // kurze Bremse gegen Durchprobieren
  if (!treffer) {
    await new Promise((r) => setTimeout(r, 600));
    return json({ fehler: 'code' }, 401);
  }
  if (treffer.aktiv === false || abgelaufen(treffer.ablauf)) return json({ fehler: 'abgelaufen', paar: treffer.paar }, 403);

  const ende = Math.min(Date.now() + TOKEN_DAUER, ablaufZeit(treffer.ablauf));
  const zugang: Zugang = { s: treffer.slug, o: treffer.ordner || treffer.slug, e: ende };
  const token = await signiere(zugang, env);
  return json({ token, ...(await galerieInhalt(zugang, env, treffer)) });
}

async function galerieInhalt(zugang: Zugang, env: Env, galerie?: Galerie) {
  const g =
    galerie ??
    (await sanity<Galerie | null>(
      env,
      `*[_type == "galerie" && slug.current == $slug && !(_id in path("drafts.**"))][0]{paar, "slug": slug.current, datum, ablauf, hinweis}`,
      { slug: zugang.s },
    ));
  const [originale, zip] = await Promise.all([alleObjekte(env, `${zugang.o}/original/`), env.FOTOS.head(`${zugang.o}/alle.zip`)]);
  const fotos = originale
    .filter((o) => /\.(jpe?g|png|webp|heic|tiff?)$/i.test(o.key))
    .map((o) => ({ name: o.key.slice(`${zugang.o}/original/`.length), groesse: o.size }))
    .filter((f) => sichererName(f.name))
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { numeric: true }));
  return {
    paar: g?.paar ?? '',
    slug: zugang.s,
    datum: g?.datum ?? null,
    ablauf: g?.ablauf ?? null,
    hinweis: g?.hinweis ?? null,
    fotos,
    zip: zip ? { groesse: zip.size } : null,
    gesamt: fotos.reduce((s, f) => s + f.groesse, 0),
  };
}

async function alleObjekte(env: Env, prefix: string): Promise<R2Object[]> {
  const aus: R2Object[] = [];
  let cursor: string | undefined;
  do {
    const seite = await env.FOTOS.list({ prefix, cursor, limit: 1000 });
    aus.push(...seite.objects);
    cursor = seite.truncated ? seite.cursor : undefined;
  } while (cursor);
  return aus;
}

/** Datei aus R2 ausliefern, mit Range-Unterstützung (abgebrochene Downloads lassen sich fortsetzen). */
async function datei(request: Request, env: Env, key: string, herunterladenAls: string | null): Promise<Response> {
  const objekt = await env.FOTOS.get(key, { range: request.headers, onlyIf: request.headers });
  if (!objekt) return json({ fehler: 'nicht gefunden' }, 404);
  const kopf = new Headers();
  objekt.writeHttpMetadata(kopf);
  kopf.set('etag', objekt.httpEtag);
  kopf.set('accept-ranges', 'bytes');
  kopf.set('cache-control', 'private, max-age=43200');
  kopf.set('x-robots-tag', 'noindex');
  if (!kopf.has('content-type')) kopf.set('content-type', inhaltstyp(key));
  if (herunterladenAls) kopf.set('content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(herunterladenAls)}`);
  if (!('body' in objekt)) return new Response(null, { status: 304, headers: kopf });

  let status = 200;
  const r = objekt.range as { offset?: number; length?: number; suffix?: number } | undefined;
  if (request.headers.has('range') && r) {
    const start = r.suffix != null ? objekt.size - r.suffix : (r.offset ?? 0);
    const laenge = r.suffix ?? r.length ?? objekt.size - start;
    kopf.set('content-range', `bytes ${start}-${start + laenge - 1}/${objekt.size}`);
    kopf.set('content-length', String(laenge));
    status = 206;
  } else {
    kopf.set('content-length', String(objekt.size));
  }
  return new Response(request.method === 'HEAD' ? null : objekt.body, { status, headers: kopf });
}

async function sanity<T>(env: Env, abfrage: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`https://${env.SANITY_PROJECT_ID}.api.sanity.io/v2026-10-01/data/query/${env.SANITY_DATASET}`);
  url.searchParams.set('query', abfrage);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(`$${k}`, JSON.stringify(v));
  const antwort = await fetch(url, { headers: { authorization: `Bearer ${env.SANITY_TOKEN}` } });
  if (!antwort.ok) throw new Error(`Sanity ${antwort.status}`);
  return ((await antwort.json()) as { result: T }).result;
}

// ---- Token ----------------------------------------------------------------

async function schluessel(env: Env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode(env.GALERIE_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signiere(zugang: Zugang, env: Env): Promise<string> {
  const daten = b64(new TextEncoder().encode(JSON.stringify(zugang)));
  const sig = await crypto.subtle.sign('HMAC', await schluessel(env), new TextEncoder().encode(daten));
  return `${daten}.${b64(new Uint8Array(sig))}`;
}

async function pruefeToken(token: string | null, slug: string, env: Env): Promise<Zugang | null> {
  if (!token) return null;
  const [daten, sig] = token.split('.');
  if (!daten || !sig) return null;
  const echt = await crypto.subtle.verify('HMAC', await schluessel(env), ausB64(sig), new TextEncoder().encode(daten));
  if (!echt) return null;
  const zugang = JSON.parse(new TextDecoder().decode(ausB64(daten))) as Zugang;
  return zugang.s === slug && zugang.e > Date.now() ? zugang : null;
}

const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ausB64 = (text: string) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

// ---- Hilfen ---------------------------------------------------------------

const normalisiere = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '');

async function gleich(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([a, b].map((s) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))));
  return crypto.subtle.timingSafeEqual(x, y);
}

/** Ablaufdatum gilt bis Mitternacht Wiener Zeit (grob: UTC+2 im Sommer, +1 im Winter; 2 h Puffer genügt). */
const ablaufZeit = (ablauf?: string) => (ablauf ? Date.parse(`${ablauf}T23:59:59Z`) : Infinity);
const abgelaufen = (ablauf?: string) => ablaufZeit(ablauf) < Date.now();

const sichererName = (name: string) => name.length > 0 && name.length < 300 && !name.includes('/') && !name.includes('..') && !name.startsWith('.');

function inhaltstyp(key: string): string {
  const endung = key.split('.').pop()?.toLowerCase();
  return (
    { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic', tif: 'image/tiff', tiff: 'image/tiff', zip: 'application/zip' }[endung ?? ''] ??
    'application/octet-stream'
  );
}

function json(daten: unknown, status = 200): Response {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}
