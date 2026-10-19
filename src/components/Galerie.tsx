// Masonry-Galerie von React Bits mit Lightbox. Kein Umsortieren per Ziehen —
// das ist für Besucher*innen eher verwirrend.

import { useSprache } from '../i18n/sprache.ts';
import type { Foto } from '../inhalt/typen.ts';
import Masonry from './reactbits/Masonry.tsx';

export function Galerie({ fotos }: { fotos: Foto[] }) {
  const { l } = useSprache();
  return (
    <Masonry
      // Neu aufbauen, wenn sich der Filter ändert, damit die Einblend-Animation wieder läuft.
      key={fotos.map((f) => f.url(800)).join()}
      items={fotos.map((f, i) => ({
        id: i,
        img: f.url(1200),
        width: f.breite,
        height: f.hoehe,
        alt: l(f.alt),
        title: l(f.alt),
      }))}
      columnWidth={300}
      gap={14}
      radius={14}
      animateFrom="bottom"
      stagger={0.015}
      duration={0.35}
      blurToFocus
      hoverEffect="zoom"
      captions="none"
      lightbox
      draggable={false}
    />
  );
}
