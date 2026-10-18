// Impressum, Datenschutz, Bildnachweis, 404. Impressum und Datenschutz pflegt
// Anna in Sanity („Rechtliches“).

import { Link } from 'react-router-dom';
import { useSprache } from '../i18n/sprache.ts';
import type { Foto } from '../inhalt/typen.ts';

function Rechtsseite({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="rahmen max-w-3xl pt-32 pb-24 sm:pt-40">
      <h1 className="text-5xl sm:text-6xl">{titel}</h1>
      <div className="mt-10 space-y-4 text-grau">{children}</div>
    </section>
  );
}

export function Impressum() {
  const { t, i, l } = useSprache();
  return (
    <Rechtsseite titel={t.recht.impressumTitel}>
      <p className="whitespace-pre-line">{l(i.rechtliches.impressum)}</p>
    </Rechtsseite>
  );
}

export function Datenschutz() {
  const { t, i, l } = useSprache();
  return (
    <Rechtsseite titel={t.recht.datenschutzTitel}>
      <p className="whitespace-pre-line">{l(i.rechtliches.datenschutz)}</p>
    </Rechtsseite>
  );
}

/** Alle Fotos irgendwo im Inhalt, die einen Bildnachweis tragen, ohne Doppelte. */
function fremdfotos(wert: unknown, gefunden = new Map<string, Foto>()) {
  if (Array.isArray(wert)) wert.forEach((w) => fremdfotos(w, gefunden));
  else if (wert && typeof wert === 'object') {
    if ('url' in wert) {
      const f = wert as Foto;
      if (f.credit) gefunden.set(f.url(800), f);
    } else Object.values(wert).forEach((w) => fremdfotos(w, gefunden));
  }
  return gefunden;
}

export function Bildnachweis() {
  const { t, i, l } = useSprache();
  const fotos = [...fremdfotos(i).values()];
  return (
    <Rechtsseite titel={t.recht.bildnachweisTitel}>
      <p>{fotos.length ? t.recht.bildnachweisText : t.recht.keineFremdfotos}</p>
      {fotos.length > 0 && (
        <ul className="divide-y divide-linie border-y border-linie text-sm">
          {fotos.map((f) => (
            <li key={f.url(800)} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-2">
              {f.credit?.quelle ? (
                <a href={f.credit.quelle} target="_blank" rel="noreferrer" className="text-tinte hover:underline">
                  {l(f.alt) || f.credit.quelle}
                </a>
              ) : (
                <span className="text-tinte">{l(f.alt)}</span>
              )}
              <span>
                {t.recht.foto}:{' '}
                {f.credit?.link ? (
                  <a href={f.credit.link} target="_blank" rel="noreferrer" className="hover:underline">
                    {f.credit.name}
                  </a>
                ) : (
                  f.credit?.name
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Rechtsseite>
  );
}

export function NichtGefunden() {
  const { t, pfad } = useSprache();
  return (
    <Rechtsseite titel={t.nichtGefunden.titel}>
      <Link to={pfad('start')} className="knopf">
        {t.nichtGefunden.zurueck}
      </Link>
    </Rechtsseite>
  );
}
