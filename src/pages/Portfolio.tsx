import { useState } from 'react';
import { AnfrageBand } from '../components/Bausteine.tsx';
import { Galerie } from '../components/Galerie.tsx';
import { useSprache } from '../i18n/sprache.ts';
import type { Kategorie } from '../inhalt/typen.ts';

const FILTER: Kategorie[] = ['hochzeit', 'paar', 'familie', 'babybauch', 'portrait'];

export function Portfolio() {
  const { t, i, l } = useSprache();
  const p = i.portfolio;
  const [filter, setFilter] = useState<Kategorie | null>(null);
  const fotos = p.bilder.filter((b) => b.foto && (!filter || b.kategorie === filter)).map((b) => b.foto);
  // Nur Filter zeigen, zu denen es auch Bilder gibt.
  const vorhanden = FILTER.filter((k) => p.bilder.some((b) => b.kategorie === k));

  const chip = (aktiv: boolean) =>
    `rounded-full border px-5 py-2 text-sm transition ${
      aktiv ? 'border-tinte bg-tinte text-creme' : 'border-linie text-grau hover:border-tinte hover:text-tinte'
    }`;

  return (
    <>
      <header className="rahmen pt-32 pb-10 text-center sm:pt-40">
        <p className="ueberzeile">{l(p.ueberzeile)}</p>
        <h1 className="mt-5 text-6xl sm:text-7xl">{l(p.titel)}</h1>
        {vorhanden.length > 1 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter">
            <button className={chip(filter === null)} aria-pressed={filter === null} onClick={() => setFilter(null)}>
              {t.portfolio.alle}
            </button>
            {vorhanden.map((k) => (
              <button key={k} className={chip(filter === k)} aria-pressed={filter === k} onClick={() => setFilter(k)}>
                {t.portfolio.filter[k]}
              </button>
            ))}
          </div>
        )}
      </header>
      <section className="rahmen pb-24">
        <Galerie fotos={fotos} />
      </section>
      <AnfrageBand />
    </>
  );
}
