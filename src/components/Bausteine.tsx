// Kleine wiederkehrende Bausteine: Einblenden, Seitenkopf, Fragen, Anfrage-Band.

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSprache } from '../i18n/sprache.ts';
import type { Foto as FotoDaten, Frage, L } from '../inhalt/typen.ts';
import { Foto } from './Foto.tsx';
import FadeContent from './reactbits/FadeContent.tsx';

export function Einblenden({ children, className = '', verzoegerung = 0 }: { children: ReactNode; className?: string; verzoegerung?: number }) {
  return (
    <FadeContent effect="fade" blur={3} duration={0.5} delay={verzoegerung * 0.4} threshold={0.05} className={className}>
      {children}
    </FadeContent>
  );
}

export function Seitenkopf({ ueberzeile, titel, intro, foto }: { ueberzeile: L; titel: L; intro: L; foto?: FotoDaten }) {
  const { l } = useSprache();
  return (
    <header className="rahmen grid items-end gap-10 pt-32 pb-16 sm:pt-40 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      <div>
        <p className="ueberzeile">{l(ueberzeile)}</p>
        <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl">{l(titel)}</h1>
        <p className="mt-7 max-w-xl text-lg text-grau">{l(intro)}</p>
      </div>
      {foto && (
        <div className="overflow-hidden rounded-t-[999px] rounded-b-2xl">
          <Foto foto={foto} sofort sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/5] w-full animate-langsam-zoom" />
        </div>
      )}
    </header>
  );
}

export function Fragen({ titel, eintraege }: { titel: L; eintraege: Frage[] }) {
  const { l } = useSprache();
  if (!eintraege.length) return null;
  return (
    <section className="rahmen grid gap-10 py-24 lg:grid-cols-[1fr_2fr]">
      <h2 className="text-4xl sm:text-5xl">{l(titel)}</h2>
      <div className="divide-y divide-linie border-y border-linie">
        {eintraege.map((e, i) => (
          <details key={i} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl [&::-webkit-details-marker]:hidden">
              {l(e.frage)}
              <span className="text-salbei-dunkel transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-grau">{l(e.antwort)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function AnfrageBand() {
  const { t, i, l, pfad } = useSprache();
  const s = i.startseite;
  return (
    <section className="relative overflow-hidden bg-tinte text-creme">
      <Foto foto={s.ctaBild} sizes="100vw" className="absolute inset-0 h-full w-full opacity-35" />
      <div className="relative rahmen py-28 text-center sm:py-36">
        <Einblenden>
          <h2 className="text-5xl sm:text-6xl">{l(s.ctaTitel)}</h2>
          <p className="mx-auto mt-6 max-w-xl text-creme/80">{l(s.ctaText)}</p>
          <Link to={pfad('anfrage')} className="knopf mt-10 bg-creme text-tinte hover:bg-sand">
            {t.allgemein.anfragen}
          </Link>
        </Einblenden>
      </div>
    </section>
  );
}
