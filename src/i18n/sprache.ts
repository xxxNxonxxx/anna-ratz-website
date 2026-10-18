// Sprache kommt aus der URL: alles unter /en ist Englisch, der Rest Deutsch.
// Jede Seite hat einen Schlüssel und pro Sprache einen eigenen Pfad.

import { useLocation } from 'react-router-dom';
import { useInhalt } from '../inhalt/InhaltProvider.tsx';
import type { L } from '../inhalt/typen.ts';
import { TEXTE } from './texte.ts';

export type Sprache = 'de' | 'en';

export const SEITEN = {
  start: { de: '/', en: '/en' },
  hochzeit: { de: '/hochzeit', en: '/en/wedding' },
  shootings: { de: '/shootings', en: '/en/sessions' },
  portfolio: { de: '/portfolio', en: '/en/portfolio' },
  ueber: { de: '/ueber-mich', en: '/en/about' },
  anfrage: { de: '/anfrage', en: '/en/contact' },
  impressum: { de: '/impressum', en: '/en/imprint' },
  datenschutz: { de: '/datenschutz', en: '/en/privacy' },
  bildnachweis: { de: '/bildnachweis', en: '/en/photo-credits' },
  galerie: { de: '/galerie', en: '/en/gallery' },
} as const;

export type Seite = keyof typeof SEITEN;

export function spracheVon(pfad: string): Sprache {
  return pfad === '/en' || pfad.startsWith('/en/') ? 'en' : 'de';
}

export function seiteVon(pfad: string): Seite | null {
  const sauber = pfad.replace(/\/+$/, '') || '/';
  // Kundengalerien haben Unterseiten: /galerie/<adresse>
  if (sauber.startsWith(SEITEN.galerie.de + '/') || sauber.startsWith(SEITEN.galerie.en + '/')) return 'galerie';
  for (const [seite, pfade] of Object.entries(SEITEN)) {
    if (pfade.de === sauber || pfade.en === sauber) return seite as Seite;
  }
  return null;
}

export function useSprache() {
  const { pathname } = useLocation();
  const sprache = spracheVon(pathname);
  return {
    sprache,
    t: TEXTE[sprache],
    /** Inhalte aus Sanity bzw. dem Startinhalt. */
    i: useInhalt(),
    /** Zweisprachigen Text auflösen; fehlt Englisch, gilt Deutsch. */
    l: (text: L | undefined) => (text ? text[sprache] || text.de || '' : ''),
    pfad: (seite: Seite) => SEITEN[seite][sprache],
    /** Dieselbe Seite in der anderen Sprache. */
    andereSprache: andererPfad(pathname, sprache),
  };
}

function andererPfad(pfad: string, sprache: Sprache): string {
  const seite = seiteVon(pfad) ?? 'start';
  const ziel = sprache === 'de' ? 'en' : 'de';
  // bei Galerien die Adresse dahinter mitnehmen
  if (seite === 'galerie') return SEITEN.galerie[ziel] + pfad.replace(/\/+$/, '').slice(SEITEN.galerie[sprache].length);
  return SEITEN[seite][ziel];
}
