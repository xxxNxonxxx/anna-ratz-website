import { AnfrageBand, Einblenden, Fragen, Seitenkopf } from '../components/Bausteine.tsx';
import { Galerie } from '../components/Galerie.tsx';
import { euro } from '../data/preise.ts';
import { useSprache } from '../i18n/sprache.ts';

export function Hochzeit() {
  const { t, i, l, sprache } = useSprache();
  const h = i.hochzeit;

  return (
    <>
      <Seitenkopf ueberzeile={h.ueberzeile} titel={h.titel} intro={h.intro} foto={h.kopfbild} />

      {/* Pakete */}
      <section className="bg-sand/60">
        <div className="rahmen py-24 sm:py-32">
          <h2 className="text-center text-5xl sm:text-6xl">{l(h.paketeTitel)}</h2>
          <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
            {h.pakete.map((p, n) => (
              <Einblenden key={n} verzoegerung={n * 0.12} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-2xl p-8 sm:p-10 ${
                    p.beliebt ? 'bg-tinte text-creme lg:-translate-y-4' : 'border border-linie bg-creme'
                  }`}
                >
                  {p.beliebt && <span className="ueberzeile mb-4 text-rose">{t.allgemein.beliebt}</span>}
                  <h3 className="text-4xl">{l(p.name)}</h3>
                  <p className={`mt-1 text-sm ${p.beliebt ? 'text-creme/70' : 'text-grau'}`}>{l(p.dauer)}</p>
                  <p className="mt-8 font-serif text-5xl">{euro(p.preis, sprache)}</p>
                  <ul className={`mt-8 flex-1 space-y-3 text-[0.95rem] ${p.beliebt ? 'text-creme/85' : 'text-grau'}`}>
                    {p.punkte.map((punkt, k) => (
                      <li key={k} className="flex gap-3">
                        <span className={p.beliebt ? 'text-rose' : 'text-salbei-dunkel'} aria-hidden>
                          ✓
                        </span>
                        {l(punkt)}
                      </li>
                    ))}
                  </ul>
                </article>
              </Einblenden>
            ))}
          </div>
          {h.extras.length > 0 && (
            <div className="mx-auto mt-14 max-w-xl">
              <h3 className="text-center text-3xl">{l(h.extrasTitel)}</h3>
              <ul className="mt-6 divide-y divide-linie border-y border-linie">
                {h.extras.map((e, n) => (
                  <li key={n} className="flex justify-between gap-6 py-3 text-grau">
                    <span>{l(e.name)}</span>
                    <span className="whitespace-nowrap text-tinte">
                      {e.ab ? `${t.allgemein.ab} ` : ''}
                      {euro(e.preis, sprache)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-center text-sm text-grau">{l(h.anfahrt)}</p>
        </div>
      </section>

      {/* Tagesablauf */}
      {h.tag.length > 0 && (
        <section className="rahmen py-24 sm:py-32">
          <h2 className="text-5xl sm:text-6xl">{l(h.tagTitel)}</h2>
          <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {h.tag.map((abschnitt, n) => (
              <Einblenden key={n} verzoegerung={n * 0.1}>
                <li className="relative border-l border-linie pl-6">
                  <span className="absolute top-1.5 -left-[5px] h-2.5 w-2.5 rounded-full bg-salbei" aria-hidden />
                  <p className="ueberzeile">{l(abschnitt.zeit)}</p>
                  <h3 className="mt-2 text-3xl">{l(abschnitt.titel)}</h3>
                  <p className="mt-2 text-grau">{l(abschnitt.text)}</p>
                </li>
              </Einblenden>
            ))}
          </ol>
        </section>
      )}

      {/* Galerie */}
      {h.galerie.length > 0 && (
        <section className="rahmen pb-12">
          <h2 className="mb-10 text-5xl sm:text-6xl">{l(h.galerieTitel)}</h2>
          <Galerie fotos={h.galerie} />
        </section>
      )}

      <Fragen titel={h.faqTitel} eintraege={h.faq} />
      <AnfrageBand />
    </>
  );
}
