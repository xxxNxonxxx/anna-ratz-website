// Lädt die Inhalte aus Sanity. Ohne VITE_SANITY_PROJECT_ID (siehe .env) bleibt
// die Seite beim Startinhalt aus standard.ts.

import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { Foto, Inhalt } from './typen.ts';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? 'production';

export const sanityAktiv = Boolean(projectId);

// Ohne CDN: Annas Änderungen erscheinen beim nächsten Neuladen sofort (das CDN
// hält Antworten bis zu einer Minute im Browser-Cache). Bei einer kleinen Seite
// reicht das Gratis-Kontingent für ungecachte Abrufe locker.
const client = projectId ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false }) : null;
const builder = client ? createImageUrlBuilder(client) : null;

const DOKUMENTE = ['einstellungen', 'startseite', 'hochzeit', 'shootings', 'portfolio', 'ueberMich', 'anfrage', 'rechtliches'] as const;

// Ein Abruf für alle Seiten. Bilder brauchen keine Auflösung: Breite und Höhe
// stecken in der Asset-Referenz (image-<id>-<B>x<H>-<format>).
const ABFRAGE = `{${DOKUMENTE.map((d) => `"${d}": *[_id == "${d}"][0]`).join(', ')}}`;

interface SanityBild {
  _type: 'foto';
  asset?: { _ref: string };
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number };
  alt?: { de?: string; en?: string };
  credit?: { name?: string; link?: string; quelle?: string };
}

function zuFoto(b: SanityBild): Foto | null {
  if (!b.asset?._ref || !builder) return null;
  const [, , groesse] = b.asset._ref.split('-');
  const [w, h] = groesse.split('x').map(Number);
  const c = b.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  return {
    url: (breite) => builder.image(b).width(breite).auto('format').quality(78).url(),
    breite: Math.round(w * (1 - c.left - c.right)),
    hoehe: Math.round(h * (1 - c.top - c.bottom)),
    alt: { de: b.alt?.de ?? '', en: b.alt?.en ?? '' },
    position: b.hotspot ? `${Math.round(b.hotspot.x * 100)}% ${Math.round(b.hotspot.y * 100)}%` : undefined,
    credit: b.credit?.name ? { name: b.credit.name, link: b.credit.link, quelle: b.credit.quelle } : undefined,
  };
}

/** Wandelt Sanity-Bildobjekte in Fotos um; leere Bilder fallen aus Listen heraus. */
function umwandeln(wert: unknown): unknown {
  if (Array.isArray(wert)) return wert.map(umwandeln).filter((x) => x !== null);
  if (wert && typeof wert === 'object') {
    const o = wert as Record<string, unknown>;
    if (o._type === 'foto') return zuFoto(o as unknown as SanityBild);
    const aus: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) if (!k.startsWith('_')) aus[k] = umwandeln(v);
    return aus;
  }
  return wert;
}

/**
 * Bringt Sanity-Daten in die Form des Startinhalts. Was Anna leert, bleibt leer
 * (Text → '', Liste → []). Nur ein fehlendes Einzelbild fällt auf das Startbild
 * zurück, damit das Layout nicht zerbricht.
 */
function mischen(standard: unknown, neu: unknown): unknown {
  if (Array.isArray(standard)) return Array.isArray(neu) ? neu : [];
  if (standard && typeof standard === 'object' && 'url' in standard) return neu ?? standard;
  if (standard && typeof standard === 'object') {
    const n = (neu && typeof neu === 'object' ? neu : {}) as Record<string, unknown>;
    const aus: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(standard)) aus[k] = mischen(v, n[k]);
    return aus;
  }
  if (typeof standard === 'string') return typeof neu === 'string' ? neu : '';
  return neu ?? standard;
}

export async function ladeAusSanity(standard: Inhalt): Promise<Inhalt> {
  if (!client) return standard;
  const roh = umwandeln(await client.fetch(ABFRAGE)) as Record<string, unknown>;
  const aus: Record<string, unknown> = {};
  for (const d of DOKUMENTE) {
    // Dokument noch nie veröffentlicht → Startinhalt für diese Seite.
    aus[d] = roh[d] ? mischen(standard[d], roh[d]) : standard[d];
  }
  return aus as unknown as Inhalt;
}
