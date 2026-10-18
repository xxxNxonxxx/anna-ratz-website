// Anfrage-Formular. Es gibt noch kein Backend: Beim Absenden öffnet sich das
// Mailprogramm mit fertig ausgefüllter Nachricht. Später durch einen Formular-
// Dienst ersetzen (siehe AGENTS.md).

import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Foto } from '../components/Foto.tsx';
import { useSprache } from '../i18n/sprache.ts';

export function Anfrage() {
  const { t, i, l, pfad } = useSprache();
  const a = i.anfrage;
  const f = t.anfrage.felder;
  const mail = i.einstellungen.mail;
  const arten = a.arten.map(l).filter(Boolean);
  const vorauswahl = (useLocation().state as { art?: string } | null)?.art;
  const [gesendet, setGesendet] = useState(false);

  const senden = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const zeile = (label: string, name: string) => (d.get(name) ? `${label}: ${d.get(name)}` : null);
    const text = [
      zeile(f.name, 'name'),
      zeile(f.mail, 'mail'),
      zeile(f.telefon, 'telefon'),
      zeile(f.art, 'art'),
      zeile(f.datum, 'datum'),
      zeile(f.ort, 'ort'),
      '',
      String(d.get('nachricht') ?? ''),
    ]
      .filter((z) => z !== null)
      .join('\n');
    const betreff = `${d.get('art')} – ${d.get('name')}`;
    window.location.href = `mailto:${mail}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
    setGesendet(true);
  };

  const feld = 'mt-2 w-full rounded-xl border border-linie bg-creme px-4 py-3 text-tinte placeholder:text-grau/60 focus:border-salbei-dunkel focus:outline-none';
  const label = 'block text-sm font-medium';

  return (
    <section className="rahmen grid gap-14 pt-32 pb-24 sm:pt-40 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div>
        <p className="ueberzeile">{l(a.ueberzeile)}</p>
        <h1 className="mt-5 text-6xl sm:text-7xl">{l(a.titel)}</h1>
        <p className="mt-6 max-w-md text-lg text-grau">{l(a.intro)}</p>
        <div className="mt-10 hidden overflow-hidden rounded-t-[999px] rounded-b-2xl lg:block">
           <Foto foto={a.bild} sizes="35vw" className="aspect-[4/5] w-full" />
        </div>
      </div>

      <div>
        {gesendet ? (
          <div className="rounded-2xl bg-sand/70 p-10" role="status">
            <p className="font-serif text-3xl">{t.anfrage.danke}</p>
            <p className="mt-6 text-grau">
              {t.anfrage.direkt} <a className="underline" href={`mailto:${mail}`}>{mail}</a>
            </p>
            <Link to={pfad('start')} className="knopf-hell mt-8">
              {t.nichtGefunden.zurueck}
            </Link>
          </div>
        ) : (
          <form onSubmit={senden} className="grid gap-6 rounded-2xl bg-sand/60 p-6 sm:grid-cols-2 sm:p-10">
            <label className={label}>
              {f.name}
              <input name="name" required autoComplete="name" className={feld} />
            </label>
            <label className={label}>
              {f.mail}
              <input name="mail" type="email" required autoComplete="email" className={feld} />
            </label>
            <label className={label}>
              {f.telefon}
              <input name="telefon" type="tel" autoComplete="tel" className={feld} />
            </label>
            <label className={label}>
              {f.art}
              <select name="art" required defaultValue={vorauswahl && arten.includes(vorauswahl) ? vorauswahl : arten[0]} className={feld}>
                {arten.map((art) => (
                  <option key={art}>{art}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              {f.datum}
              <input name="datum" type="date" className={feld} />
            </label>
            <label className={label}>
              {f.ort}
              <input name="ort" className={feld} />
            </label>
            <label className={`${label} sm:col-span-2`}>
              {f.nachricht}
              <textarea name="nachricht" required rows={6} placeholder={f.nachrichtPlatzhalter} className={feld} />
            </label>
            <label className="flex gap-3 text-sm text-grau sm:col-span-2">
              <input type="checkbox" required className="mt-1 h-4 w-4 accent-salbei-dunkel" />
              <span>
                {f.datenschutz}{' '}
                <Link to={pfad('datenschutz')} className="underline">
                  {t.footer.datenschutz}
                </Link>
              </span>
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="knopf w-full sm:w-auto">
                {f.senden}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
