// Demo-Modus der Kundengalerie für statisches Hosting ohne Worker (GitHub Pages):
// Codes und Fotos sind fest eingebaut, die Fotos kommen aus public/bilder/hochzeit.
// Nur zum Ausprobieren der Oberfläche, KEIN Schutz. Aktiv mit VITE_GALERIE_DEMO=1.

import { bilder } from '../data/bilder.ts';

export const DEMO = import.meta.env.VITE_GALERIE_DEMO === '1';

const hochzeit = bilder.filter((b) => b.kategorie === 'hochzeit').map((b) => b.id);

const GALERIEN = [
  {
    code: 'LENA2026',
    slug: 'demo-lena-paul',
    paar: 'Demo · Lena & Paul',
    datum: '2026-06-14',
    ablauf: '2027-01-31',
    hinweis: 'Danke, dass ich euren Tag begleiten durfte! Hier sind eure Fotos, ladet sie euch in Ruhe herunter.',
    ids: hochzeit,
  },
  { code: 'HUBER2026', slug: 'demo-familie-huber', paar: 'Demo · Familie Huber', datum: '2026-09-20', ablauf: '2027-01-31', hinweis: null, ids: hochzeit.slice(0, 6) },
  { code: 'ALT2025X', slug: 'demo-abgelaufen', paar: 'Demo · Abgelaufen', datum: '2025-05-01', ablauf: '2025-08-01', hinweis: null, ids: [] },
];

const pfad = (id: string, breite: 800 | 1800) => `${import.meta.env.BASE_URL}bilder/hochzeit/${id}-${breite}.webp`;

export function demoFotoUrl(art: 'web' | 'original', name: string): string {
  return pfad(name.replace(/\.webp$/, ''), art === 'web' ? 800 : 1800);
}

export async function demoAnmelden(code: string, slug?: string) {
  const sauber = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const g = GALERIEN.find((x) => x.code === sauber && (!slug || x.slug === slug));
  if (!g) return 'falsch' as const;
  if (g.ablauf < new Date().toISOString().slice(0, 10)) return 'abgelaufen' as const;
  return (await demoInhalt(g.slug)) ?? ('falsch' as const);
}

export async function demoInhalt(slug: string) {
  const g = GALERIEN.find((x) => x.slug === slug);
  if (!g) return null;
  // Dateigrößen wie beim echten Server anzeigen
  const fotos = await Promise.all(
    g.ids.map(async (id) => {
      const r = await fetch(pfad(id, 1800), { method: 'HEAD' }).catch(() => null);
      return { name: `${id}.webp`, groesse: Number(r?.headers.get('content-length') ?? 0) };
    }),
  );
  return {
    token: 'demo',
    paar: g.paar,
    slug: g.slug,
    datum: g.datum,
    ablauf: g.ablauf,
    hinweis: g.hinweis,
    fotos,
    zip: null,
    gesamt: fotos.reduce((s, f) => s + f.groesse, 0),
  };
}
